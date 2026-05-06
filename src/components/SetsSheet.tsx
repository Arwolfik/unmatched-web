import { useEffect, useRef } from 'react';
import { SetsGrid } from './SetsGrid';
import { t } from '../lib/i18n';
import type { Lang } from '../types';

interface Props {
  open: boolean;
  lang: Lang;
  selected: string[];
  excludedFighters: string[];
  onClose: () => void;
  onToggle: (id: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onToggleFighter: (key: string) => void;
}

export function SetsSheet({
  open, lang, selected, excludedFighters, onClose, onToggle, onSelectAll, onDeselectAll, onToggleFighter,
}: Props) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);

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

  if (!open) return null;
  const s = t(lang);

  return (
    <>
      <div className="sheet-backdrop" onClick={onClose} aria-hidden="true" />
      <div
        className="sheet sheet-wide"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sets-sheet-title"
      >
        <header className="sheet-head">
          <h2 id="sets-sheet-title" className="sheet-title">{s.yourSets}</h2>
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
          <SetsGrid
            lang={lang}
            selected={selected}
            excludedFighters={excludedFighters}
            onToggle={onToggle}
            onSelectAll={onSelectAll}
            onDeselectAll={onDeselectAll}
            onToggleFighter={onToggleFighter}
          />
        </div>
      </div>
    </>
  );
}
