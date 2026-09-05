/**
 * Export / import. Everything lives in this browser's localStorage, so a file
 * is the only way to move a tournament to another device — or to get it back
 * after clearing site data.
 */

import type { ArchivedTournament } from './stats';
import type { Tournament } from './tournament';

const APP = 'unmatched-picker';
const VERSION = 1;

export interface Backup {
  app: typeof APP;
  version: number;
  exportedAt: number;
  playerNames: string[];
  selectedSets: string[];
  excludedFighters: string[];
  excludedMaps: string[];
  tournament: Tournament | null;
  archive: ArchivedTournament[];
}

export type BackupPayload = Omit<Backup, 'app' | 'version' | 'exportedAt'>;

export function buildBackup(payload: BackupPayload): Backup {
  return { app: APP, version: VERSION, exportedAt: Date.now(), ...payload };
}

function looksLikeTournament(x: unknown): x is Tournament {
  const t = x as Tournament | null;
  return Boolean(
    t && typeof t.id === 'string' && Array.isArray(t.matches) && Array.isArray(t.mapPool)
    && t.matches.every((m) => m && typeof m.id === 'string' && m.a && m.b),
  );
}

export type ParseResult =
  | { ok: true; backup: Backup }
  | { ok: false; error: 'unreadable' | 'foreign' | 'version' };

export function parseBackup(text: string): ParseResult {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return { ok: false, error: 'unreadable' };
  }
  const b = raw as Partial<Backup>;
  if (!b || b.app !== APP) return { ok: false, error: 'foreign' };
  if (b.version !== VERSION) return { ok: false, error: 'version' };

  const tournament = looksLikeTournament(b.tournament) ? b.tournament : null;
  const archive = (Array.isArray(b.archive) ? b.archive : []).filter(
    (e): e is ArchivedTournament => Boolean(e) && looksLikeTournament(e.tournament),
  );
  if (!tournament && archive.length === 0) return { ok: false, error: 'unreadable' };

  const strings = (v: unknown) => (Array.isArray(v) ? v.filter((x) => typeof x === 'string') : []);
  return {
    ok: true,
    backup: {
      app: APP,
      version: VERSION,
      exportedAt: typeof b.exportedAt === 'number' ? b.exportedAt : Date.now(),
      playerNames: strings(b.playerNames),
      selectedSets: strings(b.selectedSets),
      excludedFighters: strings(b.excludedFighters),
      excludedMaps: strings(b.excludedMaps),
      tournament,
      archive,
    },
  };
}

export function downloadBackup(backup: Backup): void {
  const stamp = new Date(backup.exportedAt).toISOString().slice(0, 10);
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' }),
  );
  const a = document.createElement('a');
  a.href = url;
  a.download = `unmatched-${stamp}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
