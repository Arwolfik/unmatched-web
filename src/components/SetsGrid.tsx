import { useMemo, useState } from 'react';
import { SETS } from '../data/sets';
import type { Lang } from '../types';
import { t } from '../lib/i18n';

interface Props {
  lang: Lang;
  selected: string[];
  onToggle: (id: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
}

export function SetsGrid({ lang, selected, onToggle, onSelectAll, onDeselectAll }: Props) {
  const s = t(lang);
  const [query, setQuery] = useState('');

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
    <section className="sets-section" aria-labelledby="sets-title">
      <header className="section-head">
        <h2 id="sets-title" className="section-title">{s.yourSets}</h2>
        <div className="section-controls">
          <span className="section-count">{s.setsCount(selected.length, SETS.length)}</span>
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

      <div style={{ height: 16 }} />

      <div className="sets-grid">
        {filtered.map((set) => {
          const isOwned = selected.includes(set.id);
          const charCount = set.characters[lang].length;
          const mapCount = set.maps[lang].length;
          return (
            <button
              key={set.id}
              type="button"
              role="checkbox"
              aria-checked={isOwned}
              className="set-card"
              onClick={() => onToggle(set.id)}
            >
              <div className="set-card-top">
                <span className="set-code">{set.code}</span>
                <span className="set-check" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12l5 5L20 7" />
                  </svg>
                </span>
              </div>
              <div className="set-name">{set.name[lang]}</div>
              <div className="set-meta">
                {s.fightersCount(charCount)} · {s.mapsCount(mapCount)}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
