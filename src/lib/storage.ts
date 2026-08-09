import type { HistoryEntry, Lang, Mode, RollResult, Theme } from '../types';
import type { Tournament } from './tournament';

const KEY = 'unmatched-picker:v1';
export const HISTORY_MAX = 20;

interface Persisted {
  lang?: Lang;
  theme?: Theme;
  selectedSets?: string[];
  excludedFighters?: string[];
  excludedMaps?: string[];
  mode?: Mode;
  playerNames?: string[];
  result?: RollResult | null;
  history?: HistoryEntry[];
  tournament?: Tournament | null;
  view?: 'roll' | 'tournament';
}

export function loadState(): Persisted {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Persisted;
  } catch {
    return {};
  }
}

export function saveState(state: Persisted): void {
  try {
    const current = loadState();
    localStorage.setItem(KEY, JSON.stringify({ ...current, ...state }));
  } catch {
    // localStorage quota / disabled — ignore
  }
}
