import { useEffect, useRef } from 'react';
import { SET_BY_ID } from '../data/sets';
import { t } from '../lib/i18n';
import type { Lang, RollResult } from '../types';

interface Props {
  result: RollResult;
  lang: Lang;
  playerNames: string[];
  onPlayerRename: (idx: number, name: string) => void;
  onRerollFighter: (idx: number) => void;
  onRerollMap: () => void;
  onRerollAll: () => void;
}

export function ResultPanel({
  result,
  lang,
  playerNames,
  onPlayerRename,
  onRerollFighter,
  onRerollMap,
  onRerollAll,
}: Props) {
  const s = t(lang);
  const announceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (announceRef.current) {
      announceRef.current.textContent = s.rollAnnounce(
        result.fighters.map((f) => f.char),
        result.map?.name ?? null,
      );
    }
  }, [result, s]);

  const isFour = result.fighters.length === 4;

  return (
    <section className="result" aria-labelledby="result-title">
      <div ref={announceRef} className="sr-only" aria-live="polite" />

      <div className="result-head">
        <span className="result-head-rule" />
        <span id="result-title" className="result-head-text">
          {s.resultMeta(result.mode)}
        </span>
        <span className="result-head-rule" />
      </div>

      <div className={`fighters-row ${isFour ? 'cols-4' : ''}`}>
        {result.fighters.map((f, idx) => {
          const set = SET_BY_ID.get(f.setId);
          return (
            <article
              key={`${idx}-${f.setId}-${f.char}`}
              className={`fighter-card stagger-${idx + 1}`}
            >
              <div className="card-corners" aria-hidden="true">
                <span /><span /><span /><span />
              </div>
              {set && <div className="card-stamp">{set.code}</div>}
              <span
                className="player-label"
                contentEditable
                suppressContentEditableWarning
                spellCheck={false}
                onBlur={(e) => {
                  const value = e.currentTarget.textContent?.trim() ?? '';
                  onPlayerRename(idx, value || s.playerN(idx + 1));
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    (e.currentTarget as HTMLElement).blur();
                  }
                }}
              >
                {playerNames[idx]?.trim() || s.playerN(idx + 1)}
              </span>
              <h3 className="fighter-name">{f.char}</h3>
              <div className="card-sep" aria-hidden="true" />
              {set && <div className="fighter-set">{set.name[lang]}</div>}
            </article>
          );
        })}
      </div>

      {result.map && (() => {
        const set = SET_BY_ID.get(result.map.setId);
        return (
          <article className="map-card">
            <div className="card-corners" aria-hidden="true">
              <span /><span /><span /><span />
            </div>
            {set && <div className="card-stamp">{set.code}</div>}
            <div className="map-label">{s.mapLabel}</div>
            <h3 className="map-name">{result.map.name}</h3>
            <div className="card-sep" aria-hidden="true" />
            {set && <div className="map-set">{set.name[lang]}</div>}
          </article>
        );
      })()}

      <div className="reroll-bar" role="group" aria-label={s.rerollAll}>
        {result.fighters.map((_, idx) => (
          <button
            key={`rr-${idx}`}
            type="button"
            className="reroll-btn"
            onClick={() => onRerollFighter(idx)}
            title={s.rerollFighter}
          >
            <span className="die" aria-hidden="true">🎲</span>
            <span>{playerNames[idx]?.trim() || s.playerN(idx + 1)}</span>
          </button>
        ))}
        {result.map && (
          <button
            type="button"
            className="reroll-btn"
            onClick={onRerollMap}
            title={s.rerollMap}
          >
            <span className="die" aria-hidden="true">🎲</span>
            <span>{s.mapLabel}</span>
          </button>
        )}
        <button
          type="button"
          className="reroll-btn reroll-all"
          onClick={onRerollAll}
        >
          <span className="die" aria-hidden="true">🎲</span>
          <span>{s.rerollAll}</span>
        </button>
      </div>
    </section>
  );
}
