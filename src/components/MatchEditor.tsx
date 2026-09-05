import { useEffect, useRef } from 'react';
import { getMapImage, getMiniImage } from '../data/box-images';
import { t } from '../lib/i18n';
import {
  fighterName,
  mapName,
  resolveSlot,
  setCode,
  setName,
  sidesOf,
} from '../lib/tournament';
import type { MapRef, TMatch, Tournament } from '../lib/tournament';
import type { Lang } from '../types';

interface Props {
  open: boolean;
  lang: Lang;
  tournament: Tournament;
  match: TMatch;
  playerNames: [string, string];
  roundLabel: string;
  onClose: () => void;
  onSetMap: (matchId: string, map: MapRef) => void;
  onSwapSides: (matchId: string) => void;
  onSetFirst: (matchId: string, side: 'a' | 'b') => void;
  onClearResult: (matchId: string) => void;
}

const mapKey = (m: MapRef) => `${m.setId}::${m.idx}`;

export function MatchEditor({
  open, lang, tournament, match: m, playerNames, roundLabel,
  onClose, onSetMap, onSwapSides, onSetFirst, onClearResult,
}: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;
  const s = t(lang);

  const a = resolveSlot(tournament, m.a);
  const b = resolveSlot(tournament, m.b);
  const sides = sidesOf(m);
  if (!a || !b || !sides) return null;

  const rows: { side: 'a' | 'b'; fighter: typeof a; player: 0 | 1 }[] = [
    { side: 'a', fighter: a, player: sides.playerA },
    { side: 'b', fighter: b, player: sides.playerB },
  ];
  const winnerRow = m.winner ? rows.find((r) => r.side === m.winner)! : null;

  return (
    <>
      <div className="sheet-backdrop" onClick={onClose} aria-hidden="true" />
      <div className="sheet" role="dialog" aria-modal="true" aria-labelledby="me-title">
        <header className="sheet-head">
          <h2 id="me-title" className="sheet-title">
            {s.tour.editTitle}
            <span className="me-round">{roundLabel}</span>
          </h2>
          <button ref={closeRef} type="button" className="icon-btn" onClick={onClose} aria-label={s.tour.editClose}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </header>

        <div className="sheet-body sheet-body-padded">
          <p className="me-note">{s.tour.editPairFixed}</p>

          {/* Who plays whom + who opens — one row per fighter */}
          <div className="me-block">
            <div className="me-block-head">
              <span className="me-label">{s.tour.editSidesLabel}</span>
              <button type="button" className="btn-tertiary me-swap" onClick={() => onSwapSides(m.id)}>
                ⇅ {s.tour.editSwap}
              </button>
            </div>

            {rows.map((r) => (
              <div key={r.side} className={`me-row${m.winner === r.side ? ' won' : ''}`}>
                <div className="me-row-img">
                  {getMiniImage(r.fighter.setId, r.fighter.idx)
                    ? <img src={getMiniImage(r.fighter.setId, r.fighter.idx)} alt="" loading="lazy" />
                    : <span className="me-code">{setCode(r.fighter.setId)}</span>}
                </div>
                <div className="me-row-body">
                  <div className={`me-row-player p${r.player}`}>{playerNames[r.player]}</div>
                  <div className="me-row-name">{fighterName(r.fighter, lang)}</div>
                  <div className="me-row-set">{setName(r.fighter.setId, lang)}</div>
                </div>
                <button
                  type="button"
                  className={`me-first${m.firstSide === r.side ? ' on' : ''}`}
                  onClick={() => onSetFirst(m.id, r.side)}
                  aria-pressed={m.firstSide === r.side}
                  title={s.tour.goesFirst}
                >
                  {s.tour.goesFirstShort}
                </button>
              </div>
            ))}
            <div className="me-hint">{s.tour.editFirstLabel}</div>
          </div>

          {/* Map */}
          <div className="me-block">
            <span className="me-label">{s.tour.editMapLabel}</span>
            {m.map && (
              <div className="me-map-current">
                {getMapImage(m.map.setId, m.map.idx) && (
                  <span className="me-map-thumb">
                    <img src={getMapImage(m.map.setId, m.map.idx)} alt="" loading="lazy" />
                  </span>
                )}
                <span>
                  <b>{mapName(m.map, lang)}</b>
                  <em>{setName(m.map.setId, lang)}</em>
                </span>
              </div>
            )}
            <select
              className="me-select"
              value={m.map ? mapKey(m.map) : ''}
              onChange={(e) => {
                const pick = tournament.mapPool.find((mp) => mapKey(mp) === e.target.value);
                if (pick) onSetMap(m.id, pick);
              }}
              aria-label={s.tour.editMapLabel}
            >
              {tournament.mapPool.map((mp) => {
                const own = mp.setId === a.setId || mp.setId === b.setId;
                return (
                  <option key={mapKey(mp)} value={mapKey(mp)}>
                    {mapName(mp, lang)} — {setName(mp.setId, lang)}
                    {own ? ` (${s.tour.editOwnBox})` : ''}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Result */}
          {winnerRow && (
            <div className="me-block">
              <span className="me-label">{s.tour.editResult}</span>
              <p className="me-result">
                🏆 {s.tour.editWonNote(
                  fighterName(winnerRow.fighter, lang),
                  playerNames[winnerRow.player],
                )}
              </p>
              <button type="button" className="btn-tertiary" onClick={() => onClearResult(m.id)}>
                ↩ {s.tour.editClearResult}
              </button>
            </div>
          )}
        </div>

        <div className="sheet-foot">
          <button type="button" className="btn-primary" onClick={onClose}>{s.tour.editClose}</button>
        </div>
      </div>
    </>
  );
}
