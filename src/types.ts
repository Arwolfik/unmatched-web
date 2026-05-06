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
}

export interface AppState {
  lang: Lang;
  theme: Theme;
  selectedSets: string[];
  mode: Mode;
  roll: RollResult | null;
  playerNames: string[]; // length 4 — overrides default labels in results
}
