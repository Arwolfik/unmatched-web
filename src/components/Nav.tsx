import type { Lang, Theme } from '../types';
import { t } from '../lib/i18n';

interface Props {
  lang: Lang;
  theme: Theme;
  historyCount: number;
  onLangChange: (l: Lang) => void;
  onThemeToggle: () => void;
  onHistoryOpen: () => void;
}

export function Nav({ lang, theme, historyCount, onLangChange, onThemeToggle, onHistoryOpen }: Props) {
  const s = t(lang);

  return (
    <nav className="nav" role="navigation">
      <div className="nav-inner">
        <a href="/" className="nav-logo" aria-label={s.appName}>
          <span className="nav-logo-mark"><i>U</i></span>
          <span>Unmatched <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>Picker</em></span>
        </a>

        <div className="nav-controls">
          <button
            type="button"
            className="icon-btn icon-btn-history"
            onClick={onHistoryOpen}
            aria-label={s.historyTitle}
            title={s.historyTitle}
          >
            <HistoryIcon />
            {historyCount > 0 && (
              <span className="icon-btn-badge" aria-hidden="true">{historyCount}</span>
            )}
          </button>

          <div className="toggle-group" role="group" aria-label="Language">
            <button
              type="button"
              className="toggle-btn"
              aria-pressed={lang === 'en'}
              onClick={() => onLangChange('en')}
            >EN</button>
            <button
              type="button"
              className="toggle-btn"
              aria-pressed={lang === 'ru'}
              onClick={() => onLangChange('ru')}
            >RU</button>
          </div>

          <button
            type="button"
            className="icon-btn"
            onClick={onThemeToggle}
            aria-label={theme === 'light' ? s.themeDark : s.themeLight}
            title={theme === 'light' ? s.themeDark : s.themeLight}
          >
            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
          </button>
        </div>
      </div>
    </nav>
  );
}

function HistoryIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v5h5" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}
