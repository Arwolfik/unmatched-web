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
  | { kind: 'winnerOf'; matchId: string }
  /** Feeds the third-place match from a semi-final's loser. */
  | { kind: 'loserOf'; matchId: string };

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
  /** Which fighter takes the first turn. Null until the match is ready. */
  firstSide: 'a' | 'b' | null;
  winner: 'a' | 'b' | null;
  playedAt: number | null;
  /** The bronze match. Lives in the final's column but outside the main tree. */
  thirdPlace?: boolean;
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
  | { kind: 'reset' }
  | { kind: 'editMap' }
  | { kind: 'editSides' }
  | { kind: 'editFirst' };

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
      map: null, sideA: null, firstSide: null, winner: null, playedAt: null,
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
      map: null, sideA: null, firstSide: null, winner: null, playedAt: null,
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
        map: null, sideA: null, firstSide: null, winner: null, playedAt: null,
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
  return { ok: true, tournament: ensureThirdPlace(tournament) };
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
  const wantWinner = slot.kind === 'winnerOf';
  const takeA = wantWinner ? src.winner === 'a' : src.winner === 'b';
  return resolveSlot(t, takeA ? src.a : src.b);
}

/** Does `d` take either of its fighters from match `id`? */
export function feedsFrom(d: TMatch, id: string): boolean {
  const from = (s: SlotRef) =>
    (s.kind === 'winnerOf' || s.kind === 'loserOf') && s.matchId === id;
  return from(d.a) || from(d.b);
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

/** How many matches each player already opens, keyed by player index. */
function firstCounts(t: Tournament, skipId: string): [number, number] {
  const out: [number, number] = [0, 0];
  for (const o of t.matches) {
    if (o.id === skipId || o.sideA === null || o.firstSide == null) continue;
    out[o.firstSide === 'a' ? o.sideA : 1 - o.sideA]++;
  }
  return out;
}

/** Assign a map (from neither fighter's box, least-used first), sides and first turn. */
function prepareIfReady(t: Tournament, m: TMatch): void {
  // `== null` throughout: a match stored before firstSide existed has no such
  // key, and undefined has to read as "not set yet" exactly like null does.
  if (m.map && m.sideA !== null && m.firstSide != null) return;
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

  if (m.firstSide == null) {
    // Going first is a real edge in Unmatched, so it is shared out evenly
    // between the two humans rather than always falling to the top of the
    // bracket. Ties break randomly, which keeps the order unpredictable while
    // the totals stay level.
    const opens = firstCounts(t, m.id);
    const pA = m.sideA as 0 | 1;
    const pB = (1 - pA) as 0 | 1;
    m.firstSide =
      opens[pA] < opens[pB] ? 'a'
      : opens[pB] < opens[pA] ? 'b'
      : Math.random() < 0.5 ? 'a' : 'b';
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
      if (feedsFrom(d, id) && d.winner) { n++; walk(d.id); }
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
      if (!feedsFrom(d, id)) continue;
      d.map = null;
      d.sideA = null;
      d.firstSide = null;
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
  const order = (m: TMatch) => (m.thirdPlace ? 0 : 1);  // bronze is played before the final
  return t.matches
    .filter((m) => !m.winner && isReady(t, m))
    .sort((x, y) => x.round - y.round || order(x) - order(y) || x.idx - y.idx);
}

export function playedCount(t: Tournament): number {
  return t.matches.filter((m) => m.winner).length;
}

/** The gold-medal match — explicitly, never "the last one in the array". */
export function finalMatch(t: Tournament): TMatch | undefined {
  return t.matches.find((m) => m.round === t.totalRounds && !m.thirdPlace);
}

export function thirdPlaceMatch(t: Tournament): TMatch | undefined {
  return t.matches.find((m) => m.thirdPlace);
}

export function champion(t: Tournament): FighterRef | null {
  const final = finalMatch(t);
  if (!final?.winner) return null;
  return resolveSlot(t, final.winner === 'a' ? final.a : final.b);
}

export interface Placement {
  fighter: FighterRef;
  /** Who played them in the deciding match. */
  player: 0 | 1 | null;
}

function placementsOf(t: Tournament, m: TMatch | undefined) {
  if (!m?.winner) return { won: null, lost: null };
  const wonSlot = m.winner === 'a' ? m.a : m.b;
  const lostSlot = m.winner === 'a' ? m.b : m.a;
  const wonFighter = resolveSlot(t, wonSlot);
  const lostFighter = resolveSlot(t, lostSlot);
  const wonPlayer = m.sideA === null ? null
    : ((m.winner === 'a' ? m.sideA : 1 - m.sideA) as 0 | 1);
  const lostPlayer = wonPlayer === null ? null : ((1 - wonPlayer) as 0 | 1);
  return {
    won: wonFighter ? { fighter: wonFighter, player: wonPlayer } : null,
    lost: lostFighter ? { fighter: lostFighter, player: lostPlayer } : null,
  };
}

/** Gold / silver from the final, bronze from the third-place match. */
export function podium(t: Tournament): {
  first: Placement | null;
  second: Placement | null;
  third: Placement | null;
} {
  const f = placementsOf(t, finalMatch(t));
  const b = placementsOf(t, thirdPlaceMatch(t));
  return { first: f.won, second: f.lost, third: b.won };
}

/**
 * Adds the third-place match to a tournament drawn before the feature existed.
 * Idempotent, and deliberately additive — it never touches an existing match's
 * winner, map or sides, so an in-progress bracket survives untouched.
 */
export function ensureThirdPlace(t: Tournament): Tournament {
  if (t.totalRounds < 2) return t;                    // no semi-finals to lose
  if (t.matches.some((m) => m.thirdPlace)) return t;  // already migrated
  const semis = t.matches.filter(
    (m) => m.round === t.totalRounds - 1 && !m.thirdPlace,
  );
  if (semis.length !== 2) return t;

  const next: Tournament = {
    ...t,
    matches: [
      ...t.matches.map((m) => ({ ...m })),
      {
        id: 'third',
        round: t.totalRounds,
        idx: 1,
        thirdPlace: true,
        a: { kind: 'loserOf', matchId: semis[0].id },
        b: { kind: 'loserOf', matchId: semis[1].id },
        map: null, sideA: null, firstSide: null, winner: null, playedAt: null,
      },
    ],
  };
  // Only the new match can actually change here: prepareIfReady bails out early
  // on anything that already has a map and sides.
  for (const m of next.matches) prepareIfReady(next, m);
  return next;
}

// ── In-the-moment edits ──────────────────────────────────────────────────────
//
// The pairing is fixed by the bracket and never editable — these only change
// how a fixed pairing is played out. Swapping sides on a match that is already
// decided deliberately moves that win to the other player: the fighters met,
// but a different human was behind the winning one.

/** Which player takes the first turn, or null until the match is drawn. */
export function firstPlayer(m: TMatch): 0 | 1 | null {
  if (m.sideA === null || m.firstSide == null) return null;
  return (m.firstSide === 'a' ? m.sideA : 1 - m.sideA) as 0 | 1;
}

export function setMatchMap(t: Tournament, matchId: string, map: MapRef): Tournament {
  const cur = getMatch(t, matchId);
  if (!cur || (cur.map?.setId === map.setId && cur.map?.idx === map.idx)) return t;
  const next = clone(t);
  getMatch(next, matchId)!.map = { ...map };
  return next;
}

/** Hand each fighter to the other player. */
export function swapMatchSides(t: Tournament, matchId: string): Tournament {
  const cur = getMatch(t, matchId);
  if (!cur || cur.sideA === null) return t;
  const next = clone(t);
  const m = getMatch(next, matchId)!;
  m.sideA = (1 - m.sideA!) as 0 | 1;
  return next;
}

export function setMatchFirst(t: Tournament, matchId: string, side: 'a' | 'b'): Tournament {
  const cur = getMatch(t, matchId);
  if (!cur || cur.firstSide === side) return t;
  const next = clone(t);
  getMatch(next, matchId)!.firstSide = side;
  return next;
}

/**
 * Backfills the first turn for tournaments drawn before it was tracked. Matches
 * that were already played get 'a', because that is what the old rule did — the
 * top of the bracket always opened — so the record stays true to the table.
 * Everything still unplayed is drawn fresh by the balanced rule.
 */
export function ensureFirstSide(t: Tournament): Tournament {
  const unset = (m: TMatch) => m.firstSide == null;
  if (t.matches.every((m) => !unset(m) || m.sideA === null)) return t;
  const next = clone(t);
  for (const m of next.matches) {
    if (!unset(m)) continue;
    // Normalise the missing key to null so prepareIfReady will fill it in.
    m.firstSide = m.winner !== null ? 'a' : null;
  }
  for (const m of next.matches) prepareIfReady(next, m);
  return next;
}

/**
 * Bring a stored tournament up to date. Order matters: ensureFirstSide has to
 * record history before ensureThirdPlace runs, because adding the bronze match
 * re-runs prepareIfReady over the whole bracket and would otherwise draw a
 * fresh first turn for matches that were already played.
 */
export function migrateTournament(t: Tournament): Tournament {
  return ensureThirdPlace(ensureFirstSide(t));
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

/** Same, but the bronze match shares the final's round and needs its own label. */
export function matchKey(t: Tournament, m: TMatch): string {
  return m.thirdPlace ? 'third' : roundKey(t, m.round);
}
