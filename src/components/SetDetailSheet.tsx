import { useEffect, useRef } from 'react';
import { SET_BY_ID } from '../data/sets';
import { t } from '../lib/i18n';
import type { Lang } from '../types';

interface Props {
  setId: string | null;
  lang: Lang;
  isOwned: boolean;
  excludedFighters: string[];
  onClose: () => void;
  onToggleSet: () => void;
  onToggleFighter: (key: string) => void;
}

export function SetDetailSheet({
  setId, lang, isOwned, excludedFighters, onClose, onToggleSet, onToggleFighter,
}: Props) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const open = setId !== null;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    closeBtnRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open || !setId) return null;
  const set = SET_BY_ID.get(setId);
  if (!set) return null;

  const s = t(lang);
  const excluded = new Set(excludedFighters);
  const totalChars = set.characters[lang].length;
  const includedChars =
    isOwned ? totalChars - set.characters[lang].filter((_, i) => excluded.has(`${setId}::${i}`)).length : 0;

  return (
    <>
      <div className="sheet-backdrop" onClick={onClose} aria-hidden="true" />
      <div
        className="sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="setdetail-title"
      >
        <header className="sheet-head">
          <div className="setdetail-head">
            <span className="setdetail-code">{set.code}</span>
            <h2 id="setdetail-title" className="sheet-title">{set.name[lang]}</h2>
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            className="icon-btn"
            onClick={onClose}
            aria-label={s.historyClose}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </header>

        <div className="sheet-body sheet-body-padded">
          {/* Own this set toggle */}
          <button
            type="button"
            role="checkbox"
            aria-checked={isOwned}
            className="setdetail-own"
            onClick={onToggleSet}
          >
            <span className="set-check" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12l5 5L20 7" />
              </svg>
            </span>
            <span className="setdetail-own-text">
              {isOwned ? s.ownSetOn : s.ownSetOff}
            </span>
            <span className="setdetail-own-count">
              {isOwned ? `${includedChars}/${totalChars}` : `0/${totalChars}`}
            </span>
          </button>

          {/* Fighter list */}
          <div className="setdetail-section">
            <div className="setdetail-section-title">{s.fightersHeader}</div>
            <ul className="char-list">
              {set.characters[lang].map((char, idx) => {
                const key = `${setId}::${idx}`;
                const off = excluded.has(key);
                return (
                  <li key={idx}>
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={isOwned && !off}
                      disabled={!isOwned}
                      className="char-row"
                      onClick={() => onToggleFighter(key)}
                    >
                      <span className="set-check" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12l5 5L20 7" />
                        </svg>
                      </span>
                      <span className="char-name">{char}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Maps (read-only summary) */}
          {set.maps[lang].length > 0 && (
            <div className="setdetail-section">
              <div className="setdetail-section-title">{s.mapsHeader}</div>
              <ul className="char-list">
                {set.maps[lang].map((map, idx) => (
                  <li key={idx}>
                    <div className="char-row char-row-readonly">
                      <span className="char-name">{map}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
