import { SETS, SET_BY_ID } from '../data/sets';
import type { FighterPick, Lang, MapPick, Mode, RollResult } from '../types';

/** All fighters from the given set IDs as { char, setId } pairs. */
export function fighterPool(
  selectedSets: string[],
  lang: Lang,
  excludedFighters: string[] = [],
): FighterPick[] {
  const excluded = new Set(excludedFighters);
  const pool: FighterPick[] = [];
  for (const id of selectedSets) {
    const s = SET_BY_ID.get(id);
    if (!s) continue;
    s.characters[lang].forEach((char, idx) => {
      if (excluded.has(`${id}::${idx}`)) return;
      pool.push({ char, setId: id });
    });
  }
  return pool;
}

/** Maps from selected sets, filtered by mode. quad/ffa require quad_map=true. */
export function mapPool(selectedSets: string[], lang: Lang, mode: Mode): MapPick[] {
  const pool: MapPick[] = [];
  const requireQuad = mode !== 'duo';
  for (const id of selectedSets) {
    const s = SET_BY_ID.get(id);
    if (!s) continue;
    if (requireQuad && !s.quad_map) continue;
    for (const name of s.maps[lang]) pool.push({ name, setId: id });
  }
  return pool;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function sample<T>(arr: T[], n: number): T[] {
  const copy = arr.slice();
  const out: T[] = [];
  for (let i = 0; i < n && copy.length; i++) {
    const idx = Math.floor(Math.random() * copy.length);
    out.push(copy.splice(idx, 1)[0]);
  }
  return out;
}

export function fighterCount(mode: Mode): number {
  return mode === 'duo' ? 2 : 4;
}

export type RollError =
  | { kind: 'no_sets' }
  | { kind: 'not_enough_chars'; need: number; have: number }
  | { kind: 'no_maps' }
  | { kind: 'no_quad_maps' };

export function roll(
  selectedSets: string[],
  mode: Mode,
  lang: Lang,
  excludedFighters: string[] = [],
): { ok: true; roll: RollResult } | { ok: false; error: RollError } {
  if (selectedSets.length === 0) return { ok: false, error: { kind: 'no_sets' } };

  const fighters = fighterPool(selectedSets, lang, excludedFighters);
  const need = fighterCount(mode);
  if (fighters.length < need) {
    return { ok: false, error: { kind: 'not_enough_chars', need, have: fighters.length } };
  }

  const maps = mapPool(selectedSets, lang, mode);
  if (maps.length === 0) {
    const anyMaps = mapPool(selectedSets, lang, 'duo').length > 0;
    return { ok: false, error: { kind: anyMaps ? 'no_quad_maps' : 'no_maps' } };
  }

  return {
    ok: true,
    roll: {
      mode,
      fighters: sample(fighters, need),
      map: pickRandom(maps),
    },
  };
}

/** Reroll a single fighter at index, keeping the others. */
export function rerollFighter(
  current: RollResult,
  idx: number,
  selectedSets: string[],
  lang: Lang,
  excludedFighters: string[] = [],
): RollResult {
  const pool = fighterPool(selectedSets, lang, excludedFighters);
  // Exclude already-picked fighters except the one we're replacing
  const taken = new Set(
    current.fighters
      .filter((_, i) => i !== idx)
      .map((f) => `${f.setId}::${f.char}`),
  );
  const candidates = pool.filter((f) => !taken.has(`${f.setId}::${f.char}`));
  // Avoid picking the same one if alternatives exist
  const sameKey = `${current.fighters[idx].setId}::${current.fighters[idx].char}`;
  const better = candidates.filter((f) => `${f.setId}::${f.char}` !== sameKey);
  const chosen = (better.length > 0 ? better : candidates);
  if (chosen.length === 0) return current;
  const next = current.fighters.slice();
  next[idx] = pickRandom(chosen);
  return { ...current, fighters: next };
}

export function rerollMap(
  current: RollResult,
  selectedSets: string[],
  lang: Lang,
): RollResult {
  const pool = mapPool(selectedSets, lang, current.mode);
  if (pool.length === 0) return current;
  const without = current.map
    ? pool.filter((m) => `${m.setId}::${m.name}` !== `${current.map!.setId}::${current.map!.name}`)
    : pool;
  return { ...current, map: pickRandom(without.length > 0 ? without : pool) };
}

export function rerollAll(
  selectedSets: string[],
  mode: Mode,
  lang: Lang,
  current?: RollResult | null,
  excludedFighters: string[] = [],
): RollResult | null {
  const fresh = roll(selectedSets, mode, lang, excludedFighters);
  if (!fresh.ok) return null;
  if (!current) return fresh.roll;

  // Preserve any locked fighters / map by carrying them over and re-picking
  // the rest while excluding the locks.
  const need = fighterCount(mode);
  const fighterLocks = current.fighterLocks ?? [];
  const lockedFighters: FighterPick[] = current.fighters
    .map((f, i) => ({ f, locked: fighterLocks[i] === true }))
    .filter((x) => x.locked)
    .map((x) => x.f);

  if (lockedFighters.length === 0 && !current.mapLock) {
    return { ...fresh.roll, fighterLocks: [], mapLock: false };
  }

  const taken = new Set(lockedFighters.map((f) => `${f.setId}::${f.char}`));
  const pool = fighterPool(selectedSets, lang, excludedFighters).filter(
    (f) => !taken.has(`${f.setId}::${f.char}`),
  );
  const remaining = need - lockedFighters.length;
  if (remaining < 0) return null;
  const picked = sample(pool, remaining);
  if (picked.length < remaining) return null;

  // Reassemble fighters preserving original positions
  const newFighters: FighterPick[] = [];
  let pickedIdx = 0;
  const newLocks: boolean[] = [];
  for (let i = 0; i < need; i++) {
    if (fighterLocks[i]) {
      newFighters.push(current.fighters[i]);
      newLocks.push(true);
    } else {
      newFighters.push(picked[pickedIdx++]);
      newLocks.push(false);
    }
  }

  const newMap = current.mapLock ? current.map : fresh.roll.map;

  return {
    mode,
    fighters: newFighters,
    map: newMap,
    fighterLocks: newLocks,
    mapLock: current.mapLock ?? false,
  };
}

export const ALL_SET_IDS = SETS.map((s) => s.id);
