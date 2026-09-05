/**
 * Cumulative record across every tournament — the archive plus the one in
 * progress, so numbers are never missing just because a bracket isn't filed
 * away yet.
 *
 * Players are the same two people throughout, so they stay indices 0 and 1;
 * names live outside and are applied at render.
 */

import { finalMatch, resolveSlot, sidesOf } from './tournament';
import type { FighterRef, MapRef, Tournament } from './tournament';

export interface ArchivedTournament {
  tournament: Tournament;
  /** The names used at the time — renaming later must not rewrite history. */
  playerNames: [string, string];
  archivedAt: number;
}

/** One decided match, flattened out of its bracket. */
export interface PlayedMatch {
  tournamentId: string;
  matchId: string;
  fighters: [FighterRef, FighterRef];
  /** Which player was behind fighters[0] and fighters[1]. */
  players: [0 | 1, 0 | 1];
  map: MapRef | null;
  /** 0 or 1 — index into `fighters` — or null for pre-first-turn records. */
  first: 0 | 1 | null;
  won: 0 | 1;
  playedAt: number | null;
}

export interface Tally { played: number; won: number }
export interface FighterStat extends Tally { ref: FighterRef }
export interface SetStat extends Tally { setId: string }
export interface MapStat { ref: MapRef; played: number }

export interface Stats {
  tournaments: number;
  finished: number;
  matches: number;
  /** Match wins per player. */
  wins: [number, number];
  /** Tournaments won per player, by who played the champion in the final. */
  titles: [number, number];
  /** How the first turn actually performs, once there is data for it. */
  firstTurn: { games: number; wonGoingFirst: number; byPlayer: [number, number] };
  fighters: FighterStat[];
  sets: SetStat[];
  maps: MapStat[];
}

export const fighterKey = (f: FighterRef) => `${f.setId}::${f.idx}`;

export function flatten(tournaments: Tournament[]): PlayedMatch[] {
  const out: PlayedMatch[] = [];
  for (const t of tournaments) {
    for (const m of t.matches) {
      if (!m.winner) continue;
      const sides = sidesOf(m);
      const a = resolveSlot(t, m.a);
      const b = resolveSlot(t, m.b);
      if (!a || !b || !sides) continue;
      out.push({
        tournamentId: t.id,
        matchId: m.id,
        fighters: [a, b],
        players: [sides.playerA, sides.playerB],
        map: m.map,
        first: m.firstSide === null ? null : m.firstSide === 'a' ? 0 : 1,
        won: m.winner === 'a' ? 0 : 1,
        playedAt: m.playedAt,
      });
    }
  }
  return out;
}

function rank<T extends Tally>(by: Map<string, T>): T[] {
  return [...by.values()].sort(
    (x, y) => y.won - x.won || y.played - x.played,
  );
}

export function computeStats(tournaments: Tournament[]): Stats {
  const played = flatten(tournaments);

  const wins: [number, number] = [0, 0];
  const titles: [number, number] = [0, 0];
  const firstTurn = { games: 0, wonGoingFirst: 0, byPlayer: [0, 0] as [number, number] };
  const fighters = new Map<string, FighterStat>();
  const sets = new Map<string, SetStat>();
  const maps = new Map<string, MapStat>();

  for (const p of played) {
    wins[p.players[p.won]]++;

    if (p.first !== null) {
      firstTurn.games++;
      firstTurn.byPlayer[p.players[p.first]]++;
      if (p.first === p.won) firstTurn.wonGoingFirst++;
    }

    p.fighters.forEach((f, i) => {
      const k = fighterKey(f);
      const cur = fighters.get(k) ?? { ref: f, played: 0, won: 0 };
      cur.played++;
      if (p.won === i) cur.won++;
      fighters.set(k, cur);

      const sc = sets.get(f.setId) ?? { setId: f.setId, played: 0, won: 0 };
      sc.played++;
      if (p.won === i) sc.won++;
      sets.set(f.setId, sc);
    });

    if (p.map) {
      const k = `${p.map.setId}::${p.map.idx}`;
      const cur = maps.get(k) ?? { ref: p.map, played: 0 };
      cur.played++;
      maps.set(k, cur);
    }
  }

  let finished = 0;
  for (const t of tournaments) {
    const f = finalMatch(t);
    if (!f?.winner) continue;
    finished++;
    const sides = sidesOf(f);
    if (sides) titles[f.winner === 'a' ? sides.playerA : sides.playerB]++;
  }

  return {
    tournaments: tournaments.length,
    finished,
    matches: played.length,
    wins,
    titles,
    firstTurn,
    fighters: rank(fighters),
    sets: rank(sets),
    maps: [...maps.values()].sort((x, y) => y.played - x.played),
  };
}

/** Head-to-head record for one tournament, used by the results sheet. */
export function tournamentSummary(t: Tournament) {
  const played = flatten([t]);
  const wins: [number, number] = [0, 0];
  let openerWins = 0;
  let withFirst = 0;
  for (const p of played) {
    wins[p.players[p.won]]++;
    if (p.first === null) continue;
    withFirst++;
    if (p.first === p.won) openerWins++;
  }
  return { matches: played.length, wins, withFirst, openerWins };
}
