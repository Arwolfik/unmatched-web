import type { Mode, RollResult } from '../types';
import { SET_BY_ID } from '../data/sets';

/** Compact wire format — strips locks, indexes fighters by setId/name. */
interface Wire {
  m: Mode;
  f: [string, string][]; // [setId, char]
  p: [string, string] | null; // [setId, mapName]
}

function utf8ToB64(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function b64ToUtf8(b64: string): string {
  const padded = b64.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((b64.length + 3) % 4);
  const bin = atob(padded);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

export function encodeRoll(r: RollResult): string {
  const wire: Wire = {
    m: r.mode,
    f: r.fighters.map((f) => [f.setId, f.char]),
    p: r.map ? [r.map.setId, r.map.name] : null,
  };
  return utf8ToB64(JSON.stringify(wire));
}

export function decodeRoll(token: string): RollResult | null {
  try {
    const json = b64ToUtf8(token);
    const w = JSON.parse(json) as Partial<Wire>;
    if (!w.m || !['duo', 'quad', 'ffa'].includes(w.m)) return null;
    if (!Array.isArray(w.f) || w.f.length === 0) return null;

    const fighters = w.f.map((pair) => {
      if (!Array.isArray(pair) || pair.length !== 2) return null;
      const [setId, char] = pair;
      if (!SET_BY_ID.has(setId)) return null;
      return { setId, char };
    });
    if (fighters.some((f) => f === null)) return null;

    const map =
      w.p && Array.isArray(w.p) && w.p.length === 2 && SET_BY_ID.has(w.p[0])
        ? { setId: w.p[0], name: w.p[1] }
        : null;

    return {
      mode: w.m,
      fighters: fighters as { setId: string; char: string }[],
      map,
    };
  } catch {
    return null;
  }
}

export function buildShareUrl(r: RollResult): string {
  const url = new URL(window.location.href);
  url.search = '';
  url.searchParams.set('r', encodeRoll(r));
  return url.toString();
}
