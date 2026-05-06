import { useMemo, useState } from 'react';
import { SETS } from '../data/sets';
import type { Lang } from '../types';
import { t } from '../lib/i18n';

interface Props {
  lang: Lang;
  selected: string[];
  excludedFighters: string[];
  onToggle: (id: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onOpenDetail: (id: string) => void;
}

export function SetsGrid({
  lang, selected, excludedFighters, onToggle, onSelectAll, onDeselectAll, onOpenDetail,
}: Props) {
  const s = t(lang);
  const [query, setQuery] = useState('');
  const excluded = useMemo(() => new Set(excludedFighters), [excludedFighters]);

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
      <header className="section-head">
        <span className="section-count">{s.setsCount(selected.length, SETS.length)}</span>
        <div className="section-controls">
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
          const totalChars = set.characters[lang].length;
          const includedChars = isOwned
            ? totalChars - set.characters[lang].filter((_, i) => excluded.has(`${set.id}::${i}`)).length
            : 0;
          return (
            <div
              key={set.id}
              className="set-card"
              aria-checked={isOwned}
              role="group"
            >
              <button
                type="button"
                className="set-check-btn"
                role="checkbox"
                aria-checked={isOwned}
                aria-label={`${isOwned ? s.deselectAll : s.selectAll}: ${set.name[lang]}`}
                onClick={() => onToggle(set.id)}
              >
                <span className="set-check" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12l5 5L20 7" />
                  </svg>
                </span>
              </button>
              <button
                type="button"
                className="set-card-main"
                onClick={() => onOpenDetail(set.id)}
                aria-label={`${set.name[lang]} — ${s.customizeSets}`}
              >
                <div className="set-code">{set.code}</div>
                <div className="set-name">{set.name[lang]}</div>
                <div className="set-meta">
                  {isOwned
                    ? s.fightersIncluded(includedChars, totalChars)
                    : s.fightersCount(totalChars)
                  }
                </div>
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
