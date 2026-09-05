/* Dev-only: emits a fully played tournament for browser smoke tests. */
import { createTournament, setWinner, upcomingMatches, playedCount } from '../src/lib/tournament';
import type { Tournament } from '../src/lib/tournament';
const OWNED = ['bol1','bol2','robin','houdini','lrrh','japan','cobble','slings','tales','witcher1','witcher2'];
const r = createTournament(OWNED, [], []);
if (!r.ok) throw new Error(r.error);
let t: Tournament = r.tournament;
const stop = Number(process.argv[2] ?? Infinity);
while (playedCount(t) < Math.min(t.matches.length, stop)) {
  const m = upcomingMatches(t)[0];
  if (!m) break;
  t = setWinner(t, m.id, Math.random() < 0.5 ? 'a' : 'b');
}
console.log(JSON.stringify(t));
