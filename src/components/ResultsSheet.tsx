import { useEffect } from 'react';
import { Podium } from './Podium';
import { t } from '../lib/i18n';
import { tournamentSummary } from '../lib/stats';
import {
  fighterName,
  firstPlayer,
  mapName,
  matchKey,
  podium,
  resolveSlot,
  setName,
  sidesOf,
} from '../lib/tournament';
import type { TMatch, Tournament } from '../lib/tournament';
import type { Lang } from '../types';

interface Props {
  lang: Lang;
  tournament: Tournament;
  playerNames: [string, string];
  date: number;
  onClose: () => void;
}

/**
 * A single tournament, laid out to be read whole — on screen, in a screenshot,
 * or on paper. Everything is on one page: podium, score, and every match with
 * the map, the sides and who opened.
 */
export function ResultsSheet({ lang, tournament, playerNames, date, onClose }: Props) {
  const s = t(lang);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const places = podium(tournament);
  const sum = tournamentSummary(tournament);
  const played = tournament.matches
    .filter((m) => m.winner)
    .sort((x, y) => (x.playedAt ?? 0) - (y.playedAt ?? 0) || x.round - y.round);

  const label = (m: TMatch) => {
    const key = matchKey(tournament, m);
    return key === 'qualifier' ? s.tour.roundQualifier
      : key === 'final' ? s.tour.roundFinal
        : key === 'third' ? s.tour.roundThird
          : key;
  };
  const dateText = new Date(date).toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <div className="rs-wrap" role="dialog" aria-modal="true" aria-label={s.stats.resultsTitle}>
      <div className="rs-bar">
        <button type="button" className="btn-tertiary" onClick={onClose}>
          ← {s.stats.resultsClose}
        </button>
        <button type="button" className="btn-secondary" onClick={() => window.print()}>
          ⎙ {s.stats.resultsPrint}
        </button>
      </div>

      <article className="rs">
        <header className="rs-head">
          <div className="rs-eyebrow">Unmatched</div>
          <h1 className="rs-title">{s.stats.resultsTitle}</h1>
          <div className="rs-date">{dateText}</div>
        </header>

        {places.first && <Podium places={places} lang={lang} playerNames={playerNames} showTitle={false} />}

        <div className="rs-score">
          <span className="rs-score-name p0">{playerNames[0]}</span>
          <span className="rs-score-nums">
            <b className="p0">{sum.wins[0]}</b>
            <span>:</span>
            <b className="p1">{sum.wins[1]}</b>
          </span>
          <span className="rs-score-name p1">{playerNames[1]}</span>
        </div>

        <div className="rs-facts">
          <span>{s.tour.progress(sum.matches, tournament.matches.length)}</span>
          {sum.withFirst > 0 && (
            <span>
              {s.stats.tileFirstTurn}: <b>{Math.round((sum.openerWins / sum.withFirst) * 100)}%</b>
            </span>
          )}
        </div>

        <table className="rs-table">
          <thead>
            <tr>
              <th>{s.stats.colMatch}</th>
              <th>{s.stats.colMap}</th>
              <th>{s.stats.colFirst}</th>
              <th>{s.stats.colWinner}</th>
            </tr>
          </thead>
          <tbody>
            {played.map((m) => {
              const a = resolveSlot(tournament, m.a)!;
              const b = resolveSlot(tournament, m.b)!;
              const sides = sidesOf(m)!;
              const opener = firstPlayer(m);
              const winSide = m.winner === 'a' ? 'a' : 'b';
              const winFighter = winSide === 'a' ? a : b;
              const winPlayer = winSide === 'a' ? sides.playerA : sides.playerB;
              return (
                <tr key={m.id}>
                  <td>
                    <span className="rs-round">{label(m)}</span>
                    <span className="rs-pair">
                      <i className={`rs-dot p${sides.playerA}`} />{fighterName(a, lang)}
                      <span className="rs-vs">·</span>
                      <i className={`rs-dot p${sides.playerB}`} />{fighterName(b, lang)}
                    </span>
                  </td>
                  <td className="rs-map">
                    {m.map ? mapName(m.map, lang) : '—'}
                    {m.map && <em>{setName(m.map.setId, lang)}</em>}
                  </td>
                  <td className={opener === null ? '' : `rs-first p${opener}`}>
                    {opener === null ? '—' : playerNames[opener]}
                  </td>
                  <td className={`rs-winner p${winPlayer}`}>
                    <b>{fighterName(winFighter, lang)}</b>
                    <em>{playerNames[winPlayer]}</em>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <footer className="rs-foot">unmatched.saprykin.tech</footer>
      </article>
    </div>
  );
}
