/* Simulation harness — verifies the tournament rules hold end to end. */
import {
  createTournament, resolveSlot, setWinner, upcomingMatches,
  playedCount, champion, playerScores, matchesByRound, isReady,
  buildFighterPool, buildMapPool, fighterName, mapName,
} from '../src/lib/tournament';

const OWNED = ['bol1','bol2','robin','houdini','lrrh','japan','cobble','slings','tales','witcher1','witcher2'];

const pool = buildFighterPool(OWNED, []);
const maps = buildMapPool(OWNED, []);
console.log(`Pool: ${pool.length} fighters, ${maps.length} maps\n`);

let sameBoxFirstRoundTotal = 0;
let mapViolations = 0;
let sideMissing = 0;
let runs = 0;

for (let run = 0; run < 200; run++) {
  const r = createTournament(OWNED, [], []);
  if (!r.ok) { console.log('FAILED:', r.error); process.exit(1); }
  let t = r.tournament;
  runs++;

  if (run === 0) {
    console.log(`Structure: size=${t.size} matches=${t.matches.length} rounds=${t.totalRounds} qualifier=${t.hasQualifier}`);
    console.log('Matches per round:', matchesByRound(t).map(x => x.length).join(' → '));
  }

  // First-playable matches (qualifier + round 1) — count same-box pairings
  for (const m of t.matches.filter(m => m.round <= 1)) {
    const a = resolveSlot(t, m.a), b = resolveSlot(t, m.b);
    if (a && b && a.setId === b.setId) sameBoxFirstRoundTotal++;
  }

  // Play the whole bracket at random
  let guard = 0;
  while (playedCount(t) < t.matches.length && guard++ < 500) {
    const next = upcomingMatches(t)[0];
    if (!next) break;
    // Every playable match must have map + sides assigned
    if (next.sideA === null) sideMissing++;
    if (next.map) {
      const a = resolveSlot(t, next.a)!, b = resolveSlot(t, next.b)!;
      if (next.map.setId === a.setId || next.map.setId === b.setId) mapViolations++;
    }
    t = setWinner(t, next.id, Math.random() < 0.5 ? 'a' : 'b');
  }

  const champ = champion(t);
  const [s0, s1] = playerScores(t);
  if (!champ) { console.log('NO CHAMPION on run', run); process.exit(1); }
  if (s0 + s1 !== t.matches.length) {
    console.log(`SCORE MISMATCH run ${run}: ${s0}+${s1} != ${t.matches.length}`); process.exit(1);
  }
  if (playedCount(t) !== t.matches.length) {
    console.log(`INCOMPLETE run ${run}: ${playedCount(t)}/${t.matches.length}`); process.exit(1);
  }

  if (run === 0) {
    console.log(`\nSample run → champion: ${fighterName(champ, 'ru')}   score ${s0}:${s1}`);
    console.log('First 5 matches:');
    for (const m of t.matches.slice(0, 5)) {
      const a = resolveSlot(t, m.a)!, b = resolveSlot(t, m.b)!;
      console.log(`  ${m.id}  ${fighterName(a,'ru')} [${a.setId}] vs ${fighterName(b,'ru')} [${b.setId}]  →  ${m.map ? mapName(m.map,'ru')+' ['+m.map.setId+']' : '—'}`);
    }
  }
}

console.log(`\n─── ${runs} runs ───`);
console.log(`Same-box pairings in qualifier+R1: ${sameBoxFirstRoundTotal} total (${(sameBoxFirstRoundTotal/runs).toFixed(2)} per tournament)`);
console.log(`Map-from-own-box violations:       ${mapViolations}`);
console.log(`Matches missing side assignment:   ${sideMissing}`);
console.log(mapViolations === 0 && sideMissing === 0 ? '\n✅ All invariants hold' : '\n❌ Invariant broken');
