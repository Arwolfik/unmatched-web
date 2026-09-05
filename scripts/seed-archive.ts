/* Dev-only: a filled archive plus a finished current tournament, for smoke tests. */
import { createTournament, setWinner, upcomingMatches, playedCount } from '../src/lib/tournament';
import type { Tournament } from '../src/lib/tournament';
const OWNED = ['bol1','bol2','robin','houdini','lrrh','japan','cobble','slings','tales','witcher1','witcher2'];
const make = (stop = Infinity) => {
  const r = createTournament(OWNED, [], []);
  if (!r.ok) throw new Error(r.error);
  let t: Tournament = r.tournament;
  while (playedCount(t) < Math.min(t.matches.length, stop)) {
    const m = upcomingMatches(t)[0];
    if (!m) break;
    t = setWinner(t, m.id, Math.random() < 0.5 ? 'a' : 'b');
  }
  return t;
};
const names: [string, string] = ['Артём', 'Аня'];
const day = 86400000;
console.log(JSON.stringify({
  view: 'stats', lang: 'ru', playerNames: [...names, '', ''], selectedSets: OWNED,
  tournament: make(),
  tournamentPast: [], tournamentFuture: [],
  archive: [
    { tournament: make(), playerNames: names, archivedAt: Date.now() - 40 * day },
    { tournament: make(), playerNames: names, archivedAt: Date.now() - 12 * day },
  ],
}));
