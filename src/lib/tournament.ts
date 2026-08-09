/**
 * Single-elimination tournament for 1v1 play.
 *
 * Every fighter from the owned sets enters. When the count isn't a power of
 * two, the overflow plays a qualifier round first — e.g. 34 fighters means
 * 2 qualifier matches (4 fighters) feeding a 32-slot main bracket, 33 matches
 * total.
 *
 * Fighters and maps are stored as {setId, idx} refs rather than localized
 * strings, so switching EN/RU mid-tournament re-labels everything correctly.
 *
 * Draw constraints (soft — "prefer to spread"):
 *  - opponents from different boxes, as far as the pool allows
 *  - same-box fighters pushed as deep into the bracket as possible
 *  - each match's map comes from neither fighter's box
 */

import { SET_BY_ID } from '../data/sets';
import type { Lang } from '../types';

export interface FighterRef { setId: string; idx: number }
export interface MapRef { setId: string; idx: number }

export type SlotRef =
  | { kind: 'fighter'; ref: FighterRef }
  | { kind: 'winnerOf'; matchId: string };

export interface TMatch {
  id: string;
  /** 0 = qualifier, 1..totalRounds = main bracket */
  round: number;
  idx: number;
  a: SlotRef;
  b: SlotRef;
  map: MapRef | null;
  /** Which player (0 or 1) plays fighter A. Null until the match is ready. */
  sideA: 0 | 1 | null;
  winner: 'a' | 'b' | null;
  playedAt: number | null;
}

export interface Tournament {
  id: string;
  createdAt: number;
  setIds: string[];
  size: number;
  hasQualifier: boolean;
  totalRounds: number;
  mapPool: MapRef[];
  matches: TMatch[];
}

/**
 * Undo stack entries. The label is stored structurally (not as a localized
 * string) so it still reads correctly if the language is switched later.
 */
export type ActionLabel =
  | { kind: 'win'; fighter: FighterRef }
  | { kind: 'undoMatch' }
  | { kind: 'draw' }
  | { kind: 'reset' };

export interface TourSnapshot {
  state: Tournament | null;
  label: ActionLabel;
}

// ── Pools ────────────────────────────────────────────────────────────────────

export function buildFighterPool(selected: string[], excludedFighters: string[]): FighterRef[] {
  const excluded = new Set(excludedFighters);
  const out: FighterRef[] = [];
  for (const setId of selected) {
    const set = SET_BY_ID.get(setId);
    if (!set) continue;
    set.characters.en.forEach((_, idx) => {
      if (!excluded.has(`${setId}::${idx}`)) out.push({ setId, idx });
    });
  }
  return out;
}

/** 1v1 uses every map — the quad_map size filter doesn't apply. */
export function buildMapPool(selected: string[], excludedMaps: string[]): MapRef[] {
  const excluded = new Set(excludedMaps);
  const out: MapRef[] = [];
  for (const setId of selected) {
    const set = SET_BY_ID.get(setId);
    if (!set) continue;
    set.maps.en.forEach((_, idx) => {
      if (!excluded.has(`${setId}::${idx}`)) out.push({ setId, idx });
    });
  }
  return out;
}

// ── Label resolution (language-agnostic storage) ─────────────────────────────

export function fighterName(ref: FighterRef, lang: Lang): string {
  return SET_BY_ID.get(ref.setId)?.characters[lang][ref.idx] ?? '?';
}

export function mapName(ref: MapRef, lang: Lang): string {
  return SET_BY_ID.get(ref.setId)?.maps[lang][ref.idx] ?? '?';
}

export function setName(setId: string, lang: Lang): string {
  return SET_BY_ID.get(setId)?.name[lang] ?? setId;
}

export function setCode(setId: string): string {
  return SET_BY_ID.get(setId)?.code ?? '';
}

// ── Draw generation ──────────────────────────────────────────────────────────

function shuffled<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function layoutEntrants(order: FighterRef[], base: number, playIn: number) {
  const qualifiers = order.slice(0, playIn * 2);
  const direct = order.slice(playIn * 2);
  const slots: (FighterRef | { qualifier: number })[] = new Array(base);
  // Spread qualifier winners evenly through the bracket instead of clumping.
  const step = playIn > 0 ? Math.floor(base / playIn) : 0;
  for (let k = 0; k < playIn; k++) slots[k * step] = { qualifier: k };
  let d = 0;
  for (let i = 0; i < base; i++) if (!slots[i]) slots[i] = direct[d++];
  return { qualifiers, slots };
}

/**
 * Lower is better. Heavily penalises same-box opponents in the first match,
 * then progressively less for same-box fighters that could only meet deeper in.
 */
function drawScore(order: FighterRef[], base: number, playIn: number): number {
  const { qualifiers, slots } = layoutEntrants(order, base, playIn);

  const boxesAt = (i: number): string[] => {
    const s = slots[i];
    if ('qualifier' in s) {
      const k = s.qualifier;
      return [qualifiers[2 * k].setId, qualifiers[2 * k + 1].setId];
    }
    return [s.setId];
  };

  let score = 0;

  // Qualifier matches themselves
  for (let k = 0; k < playIn; k++) {
    if (qualifiers[2 * k].setId === qualifiers[2 * k + 1].setId) score += 100;
  }

  // Round-1 opponents
  for (let i = 0; i < base; i += 2) {
    const A = boxesAt(i);
    const B = boxesAt(i + 1);
    if (A.some((x) => B.includes(x))) score += 100;
  }

  // Same box inside a group of 4 (could meet in round 2), then 8 (round 3)
  for (const [groupSize, weight] of [[4, 10], [8, 2]] as const) {
    for (let g = 0; g < base; g += groupSize) {
      const counts = new Map<string, number>();
      for (let i = g; i < g + groupSize && i < base; i++) {
        for (const b of boxesAt(i)) counts.set(b, (counts.get(b) ?? 0) + 1);
      }
      for (const c of counts.values()) if (c > 1) score += weight * (c - 1);
    }
  }

  return score;
}

export type CreateError = 'no_fighters' | 'no_maps';

export function createTournament(
  selected: string[],
  excludedFighters: string[],
  excludedMaps: string[],
): { ok: true; tournament: Tournament } | { ok: false; error: CreateError } {
  const pool = buildFighterPool(selected, excludedFighters);
  if (pool.length < 4) return { ok: false, error: 'no_fighters' };
  const mapPool = buildMapPool(selected, excludedMaps);
  if (mapPool.length === 0) return { ok: false, error: 'no_maps' };

  const size = pool.length;
  const base = 2 ** Math.floor(Math.log2(size));
  const playIn = size - base;

  // Randomised restarts — pick the draw that spreads boxes best.
  let order = shuffled(pool);
  let best = drawScore(order, base, playIn);
  for (let attempt = 0; attempt < 600 && best > 0; attempt++) {
    const candidate = shuffled(pool);
    const s = drawScore(candidate, base, playIn);
    if (s < best) { best = s; order = candidate; }
  }

  const { qualifiers, slots } = layoutEntrants(order, base, playIn);
  const matches: TMatch[] = [];

  // Round 0 — qualifiers
  for (let k = 0; k < playIn; k++) {
    matches.push({
      id: `r0m${k}`,
      round: 0,
      idx: k,
      a: { kind: 'fighter', ref: qualifiers[2 * k] },
      b: { kind: 'fighter', ref: qualifiers[2 * k + 1] },
      map: null, sideA: null, winner: null, playedAt: null,
    });
  }

  const slotToRef = (i: number): SlotRef => {
    const s = slots[i];
    return 'qualifier' in s
      ? { kind: 'winnerOf', matchId: `r0m${s.qualifier}` }
      : { kind: 'fighter', ref: s };
  };

  // Round 1 — main bracket entry
  for (let i = 0; i < base / 2; i++) {
    matches.push({
      id: `r1m${i}`,
      round: 1,
      idx: i,
      a: slotToRef(2 * i),
      b: slotToRef(2 * i + 1),
      map: null, sideA: null, winner: null, playedAt: null,
    });
  }

  // Rounds 2..R — winners meet pairwise
  const totalRounds = Math.log2(base);
  for (let r = 2; r <= totalRounds; r++) {
    const count = base / 2 ** r;
    for (let i = 0; i < count; i++) {
      matches.push({
        id: `r${r}m${i}`,
        round: r,
        idx: i,
        a: { kind: 'winnerOf', matchId: `r${r - 1}m${2 * i}` },
        b: { kind: 'winnerOf', matchId: `r${r - 1}m${2 * i + 1}` },
        map: null, sideA: null, winner: null, playedAt: null,
      });
    }
  }

  const tournament: Tournament = {
    id: `t${Date.now().toString(36)}`,
    createdAt: Date.now(),
    setIds: selected.slice(),
    size,
    hasQualifier: playIn > 0,
    totalRounds,
    mapPool,
    matches,
  };

  // Seed map + sides for everything already playable
  for (const m of tournament.matches) prepareIfReady(tournament, m);
  return { ok: true, tournament };
}

// ── Resolution & progression ─────────────────────────────────────────────────

export function getMatch(t: Tournament, id: string): TMatch | undefined {
  return t.matches.find((m) => m.id === id);
}

/** The concrete fighter in a slot, or null if the feeding match isn't decided. */
export function resolveSlot(t: Tournament, slot: SlotRef): FighterRef | null {
  if (slot.kind === 'fighter') return slot.ref;
  const src = getMatch(t, slot.matchId);
  if (!src || !src.winner) return null;
  return resolveSlot(t, src.winner === 'a' ? src.a : src.b);
}

export function isReady(t: Tournament, m: TMatch): boolean {
  return resolveSlot(t, m.a) !== null && resolveSlot(t, m.b) !== null;
}

const fighterKey = (f: FighterRef) => `${f.setId}::${f.idx}`;

/**
 * How many matches each player is already slated to play each fighter in,
 * keyed `player::setId::idx`. Counts assigned matches, played or not — an
 * assigned match is a commitment.
 */
function playCounts(t: Tournament, skipId: string): Map<string, number> {
  const counts = new Map<string, number>();
  for (const o of t.matches) {
    if (o.id === skipId || o.sideA === null) continue;
    const oa = resolveSlot(t, o.a);
    const ob = resolveSlot(t, o.b);
    const bump = (p: number, f: FighterRef | null) => {
      if (!f) return;
      const k = `${p}::${fighterKey(f)}`;
      counts.set(k, (counts.get(k) ?? 0) + 1);
    };
    bump(o.sideA, oa);
    bump(1 - o.sideA, ob);
  }
  return counts;
}

/** Assign a map (from neither fighter's box, least-used first) and sides. */
function prepareIfReady(t: Tournament, m: TMatch): void {
  if (m.map && m.sideA !== null) return;
  const a = resolveSlot(t, m.a);
  const b = resolveSlot(t, m.b);
  if (!a || !b) return;

  if (m.sideA === null) {
    // Hand each fighter to whoever has played it least, so nobody ends up
    // "owning" a character as it climbs the bracket. A pure coin flip left a
    // fighter with the same player ~50% of the time, which read as ownership.
    // Both fighters can want the same player; then only one switch is possible
    // and the tie breaks randomly.
    const counts = playCounts(t, m.id);
    const c = (p: 0 | 1, f: FighterRef) => counts.get(`${p}::${fighterKey(f)}`) ?? 0;
    const costP0takesA = c(0, a) + c(1, b);
    const costP1takesA = c(1, a) + c(0, b);
    m.sideA =
      costP0takesA < costP1takesA ? 0
      : costP1takesA < costP0takesA ? 1
      : Math.random() < 0.5 ? 0 : 1;
  }

  if (!m.map) {
    const usage = new Map<string, number>();
    for (const other of t.matches) {
      if (!other.map) continue;
      const key = `${other.map.setId}::${other.map.idx}`;
      usage.set(key, (usage.get(key) ?? 0) + 1);
    }
    const neutral = t.mapPool.filter((mp) => mp.setId !== a.setId && mp.setId !== b.setId);
    // Fall back to the full pool if the constraint leaves nothing (tiny pools).
    const candidates = neutral.length > 0 ? neutral : t.mapPool;
    let min = Infinity;
    for (const mp of candidates) min = Math.min(min, usage.get(`${mp.setId}::${mp.idx}`) ?? 0);
    const leastUsed = candidates.filter((mp) => (usage.get(`${mp.setId}::${mp.idx}`) ?? 0) === min);
    m.map = leastUsed[Math.floor(Math.random() * leastUsed.length)];
  }
}

function clone(t: Tournament): Tournament {
  return { ...t, matches: t.matches.map((m) => ({ ...m })) };
}

export function setWinner(t: Tournament, matchId: string, winner: 'a' | 'b'): Tournament {
  const existing = getMatch(t, matchId);
  // Same reference back = no state change = no undo entry. Keeps a double-tap
  // from stacking redundant history the user then has to press undo through.
  if (!existing || existing.winner === winner) return t;
  const next = clone(t);
  const m = getMatch(next, matchId)!;
  m.winner = winner;
  m.playedAt = Date.now();
  // The downstream match may now be playable
  for (const other of next.matches) prepareIfReady(next, other);
  return next;
}

/** How many already-played matches downstream would be wiped by undoing this one. */
export function dependentDecidedCount(t: Tournament, matchId: string): number {
  let n = 0;
  const walk = (id: string) => {
    for (const d of t.matches) {
      const feeds =
        (d.a.kind === 'winnerOf' && d.a.matchId === id) ||
        (d.b.kind === 'winnerOf' && d.b.matchId === id);
      if (feeds && d.winner) { n++; walk(d.id); }
    }
  };
  walk(matchId);
  return n;
}

/** Undo a result, cascading through every match that depended on it. */
export function clearWinner(t: Tournament, matchId: string): Tournament {
  const existing = getMatch(t, matchId);
  if (!existing || existing.winner === null) return t;
  const next = clone(t);
  const reset = (id: string) => {
    const m = getMatch(next, id);
    if (!m) return;
    m.winner = null;
    m.playedAt = null;
    for (const d of next.matches) {
      const feeds =
        (d.a.kind === 'winnerOf' && d.a.matchId === id) ||
        (d.b.kind === 'winnerOf' && d.b.matchId === id);
      if (!feeds) continue;
      d.map = null;
      d.sideA = null;
      if (d.winner) reset(d.id);
    }
  };
  reset(matchId);
  for (const m of next.matches) prepareIfReady(next, m);
  return next;
}

// ── Derived views ────────────────────────────────────────────────────────────

export function matchesByRound(t: Tournament): TMatch[][] {
  const rounds: TMatch[][] = [];
  for (const m of t.matches) {
    (rounds[m.round] ??= []).push(m);
  }
  return rounds.filter(Boolean);
}

/** Playable right now: both fighters known, no result yet. */
export function upcomingMatches(t: Tournament): TMatch[] {
  return t.matches
    .filter((m) => !m.winner && isReady(t, m))
    .sort((x, y) => x.round - y.round || x.idx - y.idx);
}

export function playedCount(t: Tournament): number {
  return t.matches.filter((m) => m.winner).length;
}

export function champion(t: Tournament): FighterRef | null {
  const final = t.matches[t.matches.length - 1];
  if (!final?.winner) return null;
  return resolveSlot(t, final.winner === 'a' ? final.a : final.b);
}

/** Match wins per human player. */
export function playerScores(t: Tournament): [number, number] {
  const score: [number, number] = [0, 0];
  for (const m of t.matches) {
    if (!m.winner || m.sideA === null) continue;
    const winnerPlayer = m.winner === 'a' ? m.sideA : (1 - m.sideA) as 0 | 1;
    score[winnerPlayer]++;
  }
  return score;
}

/** Which player plays which side of a match. */
export function sidesOf(m: TMatch): { playerA: 0 | 1; playerB: 0 | 1 } | null {
  if (m.sideA === null) return null;
  return { playerA: m.sideA, playerB: (1 - m.sideA) as 0 | 1 };
}

/** "Qualifier" for round 0, otherwise 1/16 … 1/2 … Final, derived from match count. */
export function roundKey(t: Tournament, round: number): 'qualifier' | 'final' | string {
  if (round === 0) return 'qualifier';
  const count = 2 ** (t.totalRounds - round);
  return count === 1 ? 'final' : `1/${count}`;
}
