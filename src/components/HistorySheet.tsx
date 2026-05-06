import { useEffect, useRef } from 'react';
import { SET_BY_ID } from '../data/sets';
import { t } from '../lib/i18n';
import { formatRelative } from '../lib/time';
import type { HistoryEntry, Lang } from '../types';

interface Props {
  open: boolean;
  history: HistoryEntry[];
  lang: Lang;
  onClose: () => void;
  onRestore: (entry: HistoryEntry) => void;
  onClear: () => void;
}

export function HistorySheet({ open, history, lang, onClose, onRestore, onClear }: Props) {
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
        className="sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="history-title"
      >
        <header className="sheet-head">
          <h2 id="history-title" className="sheet-title">{s.historyTitle}</h2>
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

        <div className="sheet-body">
          {history.length === 0 ? (
            <div className="sheet-empty">
              <div className="empty-text">{s.historyEmpty}</div>
              <div className="empty-sub">{s.historyEmptySub}</div>
            </div>
          ) : (
            <ul className="history-list">
              {history.map((entry) => (
                <li key={entry.id}>
                  <button
                    type="button"
                    className="history-item"
                    onClick={() => onRestore(entry)}
                  >
                    <div className="history-meta">
                      <span className="history-mode">/{entry.result.mode}</span>
                      <span className="history-time">{formatRelative(entry.timestamp, lang)}</span>
                    </div>
                    <div className="history-fighters">
                      {entry.result.fighters.map((f) => f.char).join(' · ')}
                    </div>
                    {entry.result.map && (
                      <div className="history-map">
                        {(() => {
                          const set = SET_BY_ID.get(entry.result.map.setId);
                          return (
                            <>
                              <span>{entry.result.map.name}</span>
                              {set && <span className="history-set-code">{set.code}</span>}
                            </>
                          );
                        })()}
                      </div>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {history.length > 0 && (
          <footer className="sheet-foot">
            <button
              type="button"
              className="btn-tertiary"
              onClick={() => {
                if (window.confirm(s.historyClearConfirm)) onClear();
              }}
            >
              {s.historyClear}
            </button>
          </footer>
        )}
      </div>
    </>
  );
}
