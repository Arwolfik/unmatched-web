/* Does adding the third-place match leave an in-progress tournament untouched? */
import {
  createTournament, setWinner, clearWinner, upcomingMatches, resolveSlot,
  playedCount, ensureThirdPlace, podium, finalMatch, thirdPlaceMatch,
  dependentDecidedCount, playerScores,
} from '../src/lib/tournament';
import type { TMatch, Tournament } from '../src/lib/tournament';

const OWNED = ['bol1','bol2','robin','houdini','lrrh','japan','cobble','slings','tales','witcher1','witcher2'];

/** A tournament exactly as the old code would have produced it. */
function legacy(): Tournament {
  const r = createTournament(OWNED, [], []);
  if (!r.ok) throw new Error(r.error);
  const t = r.tournament;
  return { ...t, matches: t.matches.filter((m) => !m.thirdPlace) };
}

const fingerprint = (m: TMatch) => JSON.stringify(m);

let checked = 0;
for (let run = 0; run < 200; run++) {
  let t = legacy();
  if (t.matches.length !== 33) throw new Error(`legacy size ${t.matches.length}`);

  // Play a random number of matches, as if mid-tournament.
  const stopAfter = Math.floor(Math.random() * 33);
  let played = 0;
  while (played < stopAfter) {
    const m = upcomingMatches(t)[0];
    if (!m) break;
    t = setWinner(t, m.id, Math.random() < 0.5 ? 'a' : 'b');
    played++;
  }

  const before = new Map(t.matches.map((m) => [m.id, fingerprint(m)]));
  const scoreBefore = playerScores(t).join(':');
  const playedBefore = playedCount(t);

  const after = ensureThirdPlace(t);

  // 1. every pre-existing match is byte-identical
  for (const m of after.matches) {
    if (m.thirdPlace) continue;
    const was = before.get(m.id);
    if (was === undefined) throw new Error(`match ${m.id} appeared from nowhere`);
    if (was !== fingerprint(m)) throw new Error(`match ${m.id} mutated:\n${was}\n${fingerprint(m)}`);
    before.delete(m.id);
  }
  if (before.size) throw new Error(`matches lost: ${[...before.keys()]}`);
  if (playerScores(after).join(':') !== scoreBefore) throw new Error('score drifted');
  if (playedCount(after) !== playedBefore) throw new Error('played count drifted');

  // 2. the bronze match exists, is fed by both semis, and is not the final
  const third = thirdPlaceMatch(after)!;
  const final = finalMatch(after)!;
  if (!third || third.id === final.id) throw new Error('bronze/final confusion');
  if (third.a.kind !== 'loserOf' || third.b.kind !== 'loserOf') throw new Error('bronze not fed by losers');
  const semiIds = after.matches.filter((m) => m.round === after.totalRounds - 1 && !m.thirdPlace).map((m) => m.id);
  if (![third.a.matchId, third.b.matchId].every((id) => semiIds.includes(id))) throw new Error('bronze fed by non-semis');
  if (after.matches.length !== 34) throw new Error(`size ${after.matches.length}`);
  if (ensureThirdPlace(after).matches.length !== 34) throw new Error('not idempotent');

  // 3. finish it; bronze must be offered before the final
  t = after;
  let sawThirdBeforeFinal: boolean | null = null;
  let guard = 0;
  while (playedCount(t) < t.matches.length && guard++ < 200) {
    const next = upcomingMatches(t)[0];
    if (!next) throw new Error('stalled with matches left');
    if (next.thirdPlace) sawThirdBeforeFinal ??= true;
    if (next.id === final.id) sawThirdBeforeFinal ??= false;
    if (next.map === null || next.sideA === null) throw new Error(`${next.id} unprepared`);
    if (!resolveSlot(t, next.a) || !resolveSlot(t, next.b)) throw new Error(`${next.id} unresolved`);
    t = setWinner(t, next.id, Math.random() < 0.5 ? 'a' : 'b');
  }
  if (sawThirdBeforeFinal !== true) throw new Error('final came up before the bronze match');

  // 4. podium is complete and distinct
  const p = podium(t);
  if (!p.first || !p.second || !p.third) throw new Error('incomplete podium');
  const keys = [p.first, p.second, p.third].map((x) => `${x!.fighter.setId}::${x!.fighter.idx}`);
  if (new Set(keys).size !== 3) throw new Error(`podium not distinct: ${keys}`);
  if (playerScores(t)[0] + playerScores(t)[1] !== 34) throw new Error('scores do not sum');

  // 5. undoing a semi-final must also clear the bronze match
  const semi = t.matches.find((m) => m.round === t.totalRounds - 1 && !m.thirdPlace)!;
  if (dependentDecidedCount(t, semi.id) < 2) throw new Error('semi undo does not warn about final + bronze');
  const rolled = clearWinner(t, semi.id);
  if (thirdPlaceMatch(rolled)!.winner !== null) throw new Error('bronze survived a semi undo');
  if (finalMatch(rolled)!.winner !== null) throw new Error('final survived a semi undo');
  checked++;
}
console.log(`✓ ${checked} tournaments: migration additive, bronze before final, podium complete, undo cascades`);
