/* Do players end up "owning" fighters as they advance? */
import {
  createTournament, setWinner, upcomingMatches, resolveSlot, playedCount,
} from '../src/lib/tournament';
import type { FighterRef, Tournament } from '../src/lib/tournament';

const OWNED = ['bol1','bol2','robin','houdini','lrrh','japan','cobble','slings','tales','witcher1','witcher2'];
const key = (f: FighterRef) => `${f.setId}::${f.idx}`;

let side0 = 0, side1 = 0;
let sameAsPrev = 0, changedFromPrev = 0;
const repeatHistogram = new Map<number, number>();   // times one player played one fighter
let worstStreak = 0;
const distinctPerPlayer: number[] = [];

for (let run = 0; run < 300; run++) {
  const r = createTournament(OWNED, [], []);
  if (!r.ok) throw new Error(r.error);
  let t: Tournament = r.tournament;

  const lastPlayer = new Map<string, 0 | 1>();
  const pairCount = new Map<string, number>();       // `${player}::${fighter}`

  let guard = 0;
  while (playedCount(t) < t.matches.length && guard++ < 500) {
    const m = upcomingMatches(t)[0];
    if (!m || m.sideA === null) break;

    const a = resolveSlot(t, m.a)!;
    const b = resolveSlot(t, m.b)!;
    const pA = m.sideA;
    const pB = (1 - m.sideA) as 0 | 1;
    m.sideA === 0 ? side0++ : side1++;

    for (const [f, p] of [[a, pA], [b, pB]] as [FighterRef, 0 | 1][]) {
      const prev = lastPlayer.get(key(f));
      if (prev !== undefined) (prev === p ? sameAsPrev++ : changedFromPrev++);
      lastPlayer.set(key(f), p);
      const pk = `${p}::${key(f)}`;
      const n = (pairCount.get(pk) ?? 0) + 1;
      pairCount.set(pk, n);
      if (n > worstStreak) worstStreak = n;
    }
    t = setWinner(t, m.id, Math.random() < 0.5 ? 'a' : 'b');
  }

  for (const n of pairCount.values()) {
    repeatHistogram.set(n, (repeatHistogram.get(n) ?? 0) + 1);
  }
  for (const p of [0, 1]) {
    const distinct = [...pairCount.keys()].filter((k) => k.startsWith(`${p}::`)).length;
    distinctPerPlayer.push(distinct);
  }
}

const pct = (n: number, d: number) => ((n / d) * 100).toFixed(1) + '%';
console.log(`sideA balance:  P0 ${pct(side0, side0 + side1)} / P1 ${pct(side1, side0 + side1)}`);
console.log(`fighter kept same player next round: ${pct(sameAsPrev, sameAsPrev + changedFromPrev)}  (coin flip = 50%)`);
console.log(`\nHow often one player played one fighter N times:`);
for (const n of [...repeatHistogram.keys()].sort((a, b) => a - b)) {
  console.log(`  ${n}x : ${repeatHistogram.get(n)}`);
}
console.log(`worst case in 300 tournaments: one player played one fighter ${worstStreak}x`);
const avgDistinct = distinctPerPlayer.reduce((a,b)=>a+b,0)/distinctPerPlayer.length;
console.log(`\ndistinct fighters per player per tournament: ${avgDistinct.toFixed(1)} of 33 matches`);
