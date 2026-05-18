import { useMemo, useState } from 'react';
import { SETS } from '../data/sets';
import { getBoxImage } from '../data/box-images';
import type { Lang } from '../types';
import { t } from '../lib/i18n';

interface Props {
  lang: Lang;
  selected: string[];
  excludedFighters: string[];
  excludedMaps: string[];
  onToggle: (id: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onToggleFighter: (key: string) => void;
  onToggleMap: (key: string) => void;
}

export function SetsGrid({
  lang, selected, excludedFighters, excludedMaps,
  onToggle, onSelectAll, onDeselectAll, onToggleFighter, onToggleMap,
}: Props) {
  const s = t(lang);
  const [query, setQuery] = useState('');
  const excludedFs = useMemo(() => new Set(excludedFighters), [excludedFighters]);
  const excludedMs = useMemo(() => new Set(excludedMaps), [excludedMaps]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SETS;
    return SETS.filter((set) => {
      const name = set.name[lang].toLowerCase();
      const chars = set.characters[lang].join(' ').toLowerCase();
      const code = set.code.toLowerCase();
      return name.includes(q) || chars.includes(q) || code.includes(q);
    });
  }, [query, lang]);

  return (
    <section className="sets-section" aria-label={s.yourSets}>
      <header className="sets-toolbar">
        <span className="section-count">{s.setsCount(selected.length, SETS.length)}</span>
        <div className="sets-toolbar-actions">
          <button type="button" className="btn-tertiary" onClick={onSelectAll}>{s.selectAll}</button>
          <button type="button" className="btn-tertiary" onClick={onDeselectAll}>{s.deselectAll}</button>
        </div>
      </header>

      <div className="search" role="search">
        <span className="search-icon" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </span>
        <input
          type="search"
          placeholder={s.searchPlaceholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label={s.searchPlaceholder}
        />
      </div>

      <ul className="sets-list">
        {filtered.map((set) => {
          const isOwned = selected.includes(set.id);
          const chars = set.characters[lang];
          const maps = set.maps[lang];
          const includedChars = isOwned
            ? chars.length - chars.filter((_, i) => excludedFs.has(`${set.id}::${i}`)).length
            : 0;
          return (
            <li key={set.id} className={`set-row${isOwned ? ' owned' : ''}`}>
              <button
                type="button"
                role="checkbox"
                aria-checked={isOwned}
                className="set-row-main"
                onClick={() => onToggle(set.id)}
              >
                <span className="set-check" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12l5 5L20 7" />
                  </svg>
                </span>
                {(() => {
                  const box = getBoxImage(set.id, lang);
                  return box ? (
                    <span className="set-row-thumb" aria-hidden="true">
                      <img src={box} alt="" loading="lazy" />
                    </span>
                  ) : (
                    <span className="set-row-code">{set.code}</span>
                  );
                })()}
                <span className="set-row-name">{set.name[lang]}</span>
                <span className="set-row-count">
                  {isOwned ? `${includedChars}/${chars.length}` : `${chars.length}`}
                </span>
              </button>

              {isOwned && (
                <>
                  <div className="chip-row">
                    <span className="chip-row-label">{s.fightersHeader}</span>
                    <div className="char-chips" role="group" aria-label={s.fightersHeader}>
                      {chars.map((char, idx) => {
                        const key = `${set.id}::${idx}`;
                        const on = !excludedFs.has(key);
                        return (
                          <button
                            key={idx}
                            type="button"
                            role="checkbox"
                            aria-checked={on}
                            className={`char-chip${on ? ' on' : ''}`}
                            onClick={() => onToggleFighter(key)}
                          >
                            <span className="set-check" aria-hidden="true">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12l5 5L20 7" />
                              </svg>
                            </span>
                            <span>{char}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {maps.length > 0 && (
                    <div className="chip-row chip-row-maps">
                      <span className="chip-row-label">{s.mapsHeader}</span>
                      <div className="char-chips" role="group" aria-label={s.mapsHeader}>
                        {maps.map((map, idx) => {
                          const key = `${set.id}::${idx}`;
                          const on = !excludedMs.has(key);
                          return (
                            <button
                              key={idx}
                              type="button"
                              role="checkbox"
                              aria-checked={on}
                              className={`char-chip${on ? ' on' : ''}`}
                              onClick={() => onToggleMap(key)}
                            >
                              <span className="set-check" aria-hidden="true">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M5 12l5 5L20 7" />
                                </svg>
                              </span>
                              <span>{map}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
