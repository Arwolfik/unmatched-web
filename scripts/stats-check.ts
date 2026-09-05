/* Do the cumulative numbers add up, and does a round-trip through export survive? */
import {
  createTournament, setWinner, upcomingMatches, playedCount, finalMatch, sidesOf,
} from '../src/lib/tournament';
import type { Tournament } from '../src/lib/tournament';
import { computeStats, flatten } from '../src/lib/stats';
import { buildBackup, parseBackup } from '../src/lib/backup';

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

for (let run = 0; run < 60; run++) {
  const finishedOnes = [make(), make()];
  const inProgress = make(12);
  const all = [...finishedOnes, inProgress];
  const st = computeStats(all);

  const expectedMatches = all.reduce((n, t) => n + playedCount(t), 0);
  if (st.matches !== expectedMatches) throw new Error(`matches ${st.matches} != ${expectedMatches}`);
  if (st.wins[0] + st.wins[1] !== expectedMatches) throw new Error('wins do not sum to matches');
  if (st.tournaments !== 3) throw new Error('tournament count off');
  if (st.finished !== 2) throw new Error(`finished ${st.finished} != 2`);
  if (st.titles[0] + st.titles[1] !== 2) throw new Error('titles do not sum to finished');

  const fighterPlays = st.fighters.reduce((n, f) => n + f.played, 0);
  if (fighterPlays !== expectedMatches * 2) throw new Error('two fighters per match violated');
  const fighterWins = st.fighters.reduce((n, f) => n + f.won, 0);
  if (fighterWins !== expectedMatches) throw new Error('one winning fighter per match violated');
  const setPlays = st.sets.reduce((n, x) => n + x.played, 0);
  if (setPlays !== expectedMatches * 2) throw new Error('box tallies off');
  const mapPlays = st.maps.reduce((n, x) => n + x.played, 0);
  if (mapPlays !== expectedMatches) throw new Error('map tallies off');
  for (const f of st.fighters) if (f.won > f.played) throw new Error('more wins than matches');

  // first-turn figures only cover matches that actually record one
  const ft = st.firstTurn;
  if (ft.games !== flatten(all).filter((p) => p.first !== null).length) throw new Error('first-turn base off');
  if (ft.byPlayer[0] + ft.byPlayer[1] !== ft.games) throw new Error('first-turn split off');
  if (ft.wonGoingFirst > ft.games) throw new Error('impossible first-turn win count');

  // titles line up with who actually played the champion
  const byHand: [number, number] = [0, 0];
  for (const t of finishedOnes) {
    const f = finalMatch(t)!;
    const sides = sidesOf(f)!;
    byHand[f.winner === 'a' ? sides.playerA : sides.playerB]++;
  }
  if (byHand.join() !== st.titles.join()) throw new Error(`titles ${st.titles} != ${byHand}`);

  // export → import keeps every number identical
  const backup = buildBackup({
    playerNames: ['Артём', 'Аня'], selectedSets: OWNED,
    excludedFighters: [], excludedMaps: [],
    tournament: inProgress,
    archive: finishedOnes.map((t) => ({
      tournament: t, playerNames: ['Артём', 'Аня'] as [string, string], archivedAt: Date.now(),
    })),
  });
  const back = parseBackup(JSON.stringify(backup));
  if (!back.ok) throw new Error(`round trip failed: ${back.error}`);
  const st2 = computeStats([
    ...back.backup.archive.map((e) => e.tournament),
    ...(back.backup.tournament ? [back.backup.tournament] : []),
  ]);
  if (JSON.stringify(st2) !== JSON.stringify(st)) throw new Error('stats changed across export/import');
}

// bad input is rejected rather than half-swallowed
for (const [text, want] of [
  ['not json', 'unreadable'],
  ['{"app":"something-else","version":1}', 'foreign'],
  ['{"app":"unmatched-picker","version":99}', 'version'],
  ['{"app":"unmatched-picker","version":1,"tournament":null,"archive":[]}', 'unreadable'],
] as const) {
  const r = parseBackup(text);
  if (r.ok || r.error !== want) throw new Error(`expected ${want} for ${text.slice(0, 30)}`);
}

console.log('✓ stats add up across tournaments; export/import round-trips; bad files are refused');
