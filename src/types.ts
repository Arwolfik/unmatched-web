export type Lang = 'en' | 'ru';
export type Theme = 'light' | 'dark';
export type Mode = 'duo' | 'quad' | 'ffa';

export interface SetDef {
  id: string;
  code: string; // 3–5 letter shorthand shown in inventory & result meta
  name: Record<Lang, string>;
  /** True if maps from this set are big enough for 4-player play. */
  quad_map: boolean;
  characters: Record<Lang, string[]>;
  maps: Record<Lang, string[]>;
}

export interface FighterPick {
  char: string;
  setId: string;
}

export interface MapPick {
  name: string;
  setId: string;
}

export interface RollResult {
  mode: Mode;
  fighters: FighterPick[];
  map: MapPick | null;
  /** Indices of fighters that should be preserved on Reroll All. */
  fighterLocks?: boolean[];
  /** Whether the map should be preserved on Reroll All. */
  mapLock?: boolean;
}

export interface AppState {
  lang: Lang;
  theme: Theme;
  selectedSets: string[];
  /** Excluded fighters as `${setId}::${index}` keys.
   *  Indexed (not by name) so the value persists across language switches. */
  excludedFighters: string[];
  /** Excluded maps — same `${setId}::${index}` shape. */
  excludedMaps: string[];
  mode: Mode;
  roll: RollResult | null;
  playerNames: string[]; // length 4 — overrides default labels in results
}

export interface HistoryEntry {
  id: string;
  timestamp: number;
  result: RollResult;
  playerNames: string[];
}
