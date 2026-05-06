import type { Lang, Mode, Theme } from '../types';

const KEY = 'unmatched-picker:v1';

interface Persisted {
  lang?: Lang;
  theme?: Theme;
  selectedSets?: string[];
  mode?: Mode;
  playerNames?: string[];
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
