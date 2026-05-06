import { useEffect, useMemo, useState } from 'react';
import { Nav } from './components/Nav';
import { SetsGrid } from './components/SetsGrid';
import { ResultPanel } from './components/ResultPanel';
import { StickyBar } from './components/StickyBar';
import { ALL_SET_IDS, rerollAll, rerollFighter, rerollMap, roll } from './lib/roll';
import type { RollError } from './lib/roll';
import { t } from './lib/i18n';
import { loadState, saveState } from './lib/storage';
import type { Lang, Mode, RollResult, Theme } from './types';

const DEFAULT_PLAYER_NAMES: string[] = ['', '', '', ''];

function getInitialTheme(): Theme {
  const saved = loadState().theme;
  if (saved) return saved;
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

function getInitialLang(): Lang {
  const saved = loadState().lang;
  if (saved) return saved;
  if (typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('ru')) {
    return 'ru';
  }
  return 'en';
}

export default function App() {
  const persisted = loadState();

  const [lang, setLang] = useState<Lang>(getInitialLang());
  const [theme, setTheme] = useState<Theme>(getInitialTheme());
  const [selected, setSelected] = useState<string[]>(persisted.selectedSets ?? ALL_SET_IDS);
  const [mode, setMode] = useState<Mode>(persisted.mode ?? 'duo');
  const [playerNames, setPlayerNames] = useState<string[]>(persisted.playerNames ?? DEFAULT_PLAYER_NAMES);
  const [result, setResult] = useState<RollResult | null>(null);
  const [error, setError] = useState<RollError | null>(null);

  // Persist anything that changes
  useEffect(() => { saveState({ lang }); }, [lang]);
  useEffect(() => { saveState({ theme }); }, [theme]);
  useEffect(() => { saveState({ selectedSets: selected }); }, [selected]);
  useEffect(() => { saveState({ mode }); }, [mode]);
  useEffect(() => { saveState({ playerNames }); }, [playerNames]);

  // Apply theme to <html>
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  // Reset stale result when sets/lang/mode change underneath us
  useEffect(() => {
    if (result && result.mode !== mode) setResult(null);
  }, [mode, result]);

  // Re-localise existing result when the language flips
  useEffect(() => {
    if (!result) return;
    const fresh = roll(selected, mode, lang);
    if (fresh.ok) setResult(fresh.roll);
    // intentionally not adding `result` to deps — we only want this on lang change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  const s = t(lang);
  const errorMessage = useMemo(() => formatError(error, lang), [error, lang]);

  const handleToggleSet = (id: string) => {
    setSelected((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
  };
  const handleSelectAll = () => setSelected(ALL_SET_IDS);
  const handleDeselectAll = () => setSelected([]);

  const handleRoll = () => {
    const r = roll(selected, mode, lang);
    if (r.ok) {
      setResult(r.roll);
      setError(null);
      // Scroll the result into view shortly after render
      requestAnimationFrame(() => {
        const el = document.querySelector('.result');
        el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    } else {
      setResult(null);
      setError(r.error);
    }
  };

  const handleRerollFighter = (idx: number) => {
    if (!result) return;
    setResult(rerollFighter(result, idx, selected, lang));
  };
  const handleRerollMap = () => {
    if (!result) return;
    setResult(rerollMap(result, selected, lang));
  };
  const handleRerollAll = () => {
    const next = rerollAll(selected, mode, lang);
    if (next) setResult(next);
  };

  const handlePlayerRename = (idx: number, name: string) => {
    setPlayerNames((cur) => {
      const next = cur.length === 4 ? cur.slice() : ['', '', '', ''];
      next[idx] = name === s.playerN(idx + 1) ? '' : name;
      return next;
    });
  };

  return (
    <>
      <Nav
        lang={lang}
        theme={theme}
        onLangChange={setLang}
        onThemeToggle={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
      />

      <main>
        <SetsGrid
          lang={lang}
          selected={selected}
          onToggle={handleToggleSet}
          onSelectAll={handleSelectAll}
          onDeselectAll={handleDeselectAll}
        />

        {error && (
          <div className="error-inline" role="alert">
            <div className="error-title">⚠ {errorMessage.title}</div>
            <div className="error-body">{errorMessage.body}</div>
          </div>
        )}

        {result ? (
          <ResultPanel
            result={result}
            lang={lang}
            playerNames={playerNames.map((n, i) => n || s.playerN(i + 1))}
            onPlayerRename={handlePlayerRename}
            onRerollFighter={handleRerollFighter}
            onRerollMap={handleRerollMap}
            onRerollAll={handleRerollAll}
          />
        ) : (
          !error && (
            <div className="empty">
              <div className="empty-text">
                {selected.length === 0 ? s.emptyTitle : s.readyTitle}
              </div>
              <div className="empty-sub">
                {selected.length === 0 ? s.emptySub : s.readySub}
              </div>
            </div>
          )
        )}
      </main>

      <footer className="footer">
        <div className="footer-inner">
          <p className="footer-disclaimer">{s.footerDisclaimer}</p>
          <p className="footer-meta">
            <a href="https://github.com/Arwolfik/unmatched-web" target="_blank" rel="noopener">
              {s.footerSource}
            </a>
            <span className="footer-dot" aria-hidden="true">·</span>
            <a href="https://saprykin.tech" target="_blank" rel="noopener">
              {s.footerAuthor}
            </a>
          </p>
        </div>
      </footer>

      <StickyBar
        lang={lang}
        mode={mode}
        onModeChange={setMode}
        onRoll={handleRoll}
      />
    </>
  );
}

function formatError(err: RollError | null, lang: Lang): { title: string; body: string } {
  if (!err) return { title: '', body: '' };
  const s = t(lang);
  switch (err.kind) {
    case 'no_sets':
      return { title: s.errNoSets, body: '' };
    case 'no_maps':
      return { title: s.errNoMaps, body: '' };
    case 'no_quad_maps':
      return { title: s.errNoQuadMaps, body: '' };
    case 'not_enough_chars':
      return { title: s.errNotEnoughChars(err.need, err.have), body: '' };
    default: {
      const _exhaustive: never = err;
      return _exhaustive;
    }
  }
}
