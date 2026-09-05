/* First-turn fairness, and that in-the-moment edits only change what they should. */
import {
  createTournament, setWinner, upcomingMatches, playedCount, resolveSlot,
  ensureFirstSide, migrateTournament, firstPlayer, playerScores, getMatch,
  setMatchMap, swapMatchSides, setMatchFirst,
} from '../src/lib/tournament';
import type { TMatch, Tournament } from '../src/lib/tournament';

const OWNED = ['bol1','bol2','robin','houdini','lrrh','japan','cobble','slings','tales','witcher1','witcher2'];
const fresh = () => {
  const r = createTournament(OWNED, [], []);
  if (!r.ok) throw new Error(r.error);
  return r.tournament;
};
const playOut = (t: Tournament, n = Infinity) => {
  let i = 0;
  while (playedCount(t) < t.matches.length && i++ < n) {
    const m = upcomingMatches(t)[0];
    if (!m) break;
    t = setWinner(t, m.id, Math.random() < 0.5 ? 'a' : 'b');
  }
  return t;
};

// ── 1. First turn is shared evenly between the two players ──────────────────
let worstGap = 0;
let topOpens = 0, total = 0;
const firstWins = [0, 0];   // [won going first, won going second]
for (let run = 0; run < 200; run++) {
  const t = playOut(fresh());
  const opens: [number, number] = [0, 0];
  for (const m of t.matches) {
    if (m.firstSide === null || m.sideA === null) throw new Error(`${m.id} has no first turn`);
    opens[firstPlayer(m)!]++;
    if (m.firstSide === 'a') topOpens++;
    total++;
    if (m.winner) firstWins[m.winner === m.firstSide ? 0 : 1]++;
  }
  worstGap = Math.max(worstGap, Math.abs(opens[0] - opens[1]));
}
const pct = (n: number, d: number) => ((n / d) * 100).toFixed(1) + '%';
console.log(`first turn — player split gap, worst of 200 tournaments: ${worstGap} match(es)`);
console.log(`first turn goes to the top of the bracket: ${pct(topOpens, total)}  (was 100%)`);
console.log(`winner had gone first: ${pct(firstWins[0], firstWins[0] + firstWins[1])}  (coin-flip sim, so ~50%)`);
if (worstGap > 1) throw new Error('first turn is not evenly split');
if (topOpens / total > 0.6 || topOpens / total < 0.4) throw new Error('first turn still tracks the bracket');

// ── 2. Backfilling an old tournament keeps the record true ──────────────────
for (let run = 0; run < 100; run++) {
  const base = playOut(fresh(), Math.floor(Math.random() * 34));
  // A tournament saved before the feature has no firstSide key at all. Half the
  // runs drop the key and half set it to null — an early version of this check
  // only did the latter, and the missing-key case shipped broken because of it.
  const dropKey = run % 2 === 0;
  const legacy: Tournament = {
    ...base,
    matches: base.matches.map((m) => {
      if (!dropKey) return { ...m, firstSide: null };
      const { firstSide: _drop, ...rest } = m;
      return rest as typeof m;
    }),
  };
  const before = new Map(legacy.matches.map((m) => [m.id, JSON.stringify(m)]));
  const after = ensureFirstSide(legacy);

  for (const m of after.matches) {
    const was = JSON.parse(before.get(m.id)!) as TMatch;
    const { firstSide, ...restNow } = m;
    const { firstSide: _was, ...restBefore } = was as typeof m;
    if (JSON.stringify(restNow) !== JSON.stringify(restBefore)) throw new Error(`${m.id} changed beyond firstSide`);
    if (was.winner !== null && firstSide !== 'a') throw new Error(`played ${m.id} not recorded as top-opens`);
    if (was.sideA !== null && firstSide == null) throw new Error(`${m.id} left without a first turn (dropKey=${dropKey})`);
  }
  if (playerScores(after).join(':') !== playerScores(legacy).join(':')) throw new Error('score drifted');
  if (ensureFirstSide(after) !== after) throw new Error('not idempotent');
}
console.log('✓ backfill: played matches keep top-opens, nothing else moves, idempotent');

// ── 2b. The same, through the migration App actually runs on load ───────────
// Adding the bronze match re-prepares the whole bracket, so it has to happen
// after the first turns are recorded, not before.
for (let run = 0; run < 100; run++) {
  const base = playOut(fresh(), 1 + Math.floor(Math.random() * 33));
  // How a tournament drawn before either feature is stored: no bronze match,
  // and no firstSide key on any match.
  const legacy: Tournament = {
    ...base,
    matches: base.matches.filter((m) => !m.thirdPlace).map((m) => {
      const { firstSide: _drop, ...rest } = m;
      return rest as typeof m;
    }),
  };
  const before = new Map(legacy.matches.map((m) => [m.id, JSON.stringify(m)]));
  const after = migrateTournament(legacy);

  if (after.matches.filter((m) => m.thirdPlace).length !== 1) throw new Error('bronze match missing');
  for (const m of after.matches) {
    if (m.thirdPlace) continue;
    const was = JSON.parse(before.get(m.id)!) as TMatch;
    const { firstSide, ...rest } = m;
    if (JSON.stringify(rest) !== JSON.stringify(was)) throw new Error(`${m.id} changed beyond firstSide`);
    if (was.winner !== null && firstSide !== 'a') throw new Error(`played ${m.id} lost its top-opens record`);
    if (was.sideA !== null && firstSide == null) throw new Error(`${m.id} left without a first turn`);
  }
  if (playerScores(after).join(':') !== playerScores(legacy).join(':')) throw new Error('score drifted');
  if (migrateTournament(after) !== after) throw new Error('migration not idempotent');
}
console.log('✓ full migration: bronze added, first turns backfilled, played matches untouched');

// ── 3. Edits change only what they claim to ─────────────────────────────────
for (let run = 0; run < 100; run++) {
  let t = playOut(fresh(), 20);
  const played = t.matches.filter((m) => m.winner)[3];
  const pairOf = (x: Tournament) => x.matches.map((m) => JSON.stringify([m.id, m.a, m.b, m.winner])).join('|');
  const pairsBefore = pairOf(t);
  const scoreBefore = playerScores(t);

  // map: nothing but the map moves
  const other = t.mapPool.find((mp) => mp.setId !== played.map!.setId)!;
  const mapped = setMatchMap(t, played.id, other);
  if (pairOf(mapped) !== pairsBefore) throw new Error('map edit touched a pairing');
  if (playerScores(mapped).join() !== scoreBefore.join()) throw new Error('map edit moved the score');
  if (setMatchMap(mapped, played.id, other) !== mapped) throw new Error('no-op map edit made a new state');

  // first turn: nothing but the first turn moves
  const flipped = setMatchFirst(t, played.id, played.firstSide === 'a' ? 'b' : 'a');
  if (pairOf(flipped) !== pairsBefore) throw new Error('first-turn edit touched a pairing');
  if (playerScores(flipped).join() !== scoreBefore.join()) throw new Error('first-turn edit moved the score');

  // swap: the pairing and the winning fighter hold, the point changes hands
  const swapped = swapMatchSides(t, played.id);
  if (pairOf(swapped) !== pairsBefore) throw new Error('swap touched a pairing');
  const m0 = getMatch(t, played.id)!;
  const m1 = getMatch(swapped, played.id)!;
  if (m1.sideA !== 1 - m0.sideA!) throw new Error('swap did not swap');
  const wonFighterBefore = resolveSlot(t, m0.winner === 'a' ? m0.a : m0.b);
  const wonFighterAfter = resolveSlot(swapped, m1.winner === 'a' ? m1.a : m1.b);
  if (JSON.stringify(wonFighterBefore) !== JSON.stringify(wonFighterAfter)) throw new Error('swap changed who won');
  const sAfter = playerScores(swapped);
  if (sAfter[0] !== scoreBefore[0] - (m0.winner === 'a' ? (m0.sideA === 0 ? 1 : -1) : (m0.sideA === 0 ? -1 : 1))) {
    throw new Error(`swap did not move exactly one point: ${scoreBefore} -> ${sAfter}`);
  }
  if (sAfter[0] + sAfter[1] !== scoreBefore[0] + scoreBefore[1]) throw new Error('swap changed the match count');
  t = swapped;
}
console.log('✓ edits: pairings and winning fighters hold; a swap moves exactly one point');
