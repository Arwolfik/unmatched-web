import { useEffect, useMemo, useState } from 'react';
import { Nav } from './components/Nav';
import { SetsSheet } from './components/SetsSheet';
import { ResultPanel } from './components/ResultPanel';
import { StickyBar } from './components/StickyBar';
import { HistorySheet } from './components/HistorySheet';
import { DisclaimerBanner } from './components/DisclaimerBanner';
import { TournamentView } from './components/TournamentView';
import { SETS } from './data/sets';
import {
  buildFighterPool,
  buildMapPool,
  clearWinner,
  createTournament,
  getMatch,
  setWinner,
} from './lib/tournament';
import type { Tournament } from './lib/tournament';
import { ALL_SET_IDS, rerollAll, rerollFighter, rerollMap, roll } from './lib/roll';
import type { RollError } from './lib/roll';
import { t } from './lib/i18n';
import { HISTORY_MAX, loadState, saveState } from './lib/storage';
import { makeId } from './lib/time';
import { decodeRoll } from './lib/share';
import type { HistoryEntry, Lang, Mode, RollResult, Theme } from './types';

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
  const [excludedFighters, setExcludedFighters] = useState<string[]>(persisted.excludedFighters ?? []);
  const [excludedMaps, setExcludedMaps] = useState<string[]>(persisted.excludedMaps ?? []);
  const [mode, setMode] = useState<Mode>(persisted.mode ?? 'duo');
  const [playerNames, setPlayerNames] = useState<string[]>(persisted.playerNames ?? DEFAULT_PLAYER_NAMES);
  const [result, setResult] = useState<RollResult | null>(persisted.result ?? null);
  const [history, setHistory] = useState<HistoryEntry[]>(persisted.history ?? []);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [setsOpen, setSetsOpen] = useState(false);
  const [error, setError] = useState<RollError | null>(null);
  const [view, setView] = useState<'roll' | 'tournament'>(persisted.view ?? 'roll');
  const [tournament, setTournament] = useState<Tournament | null>(persisted.tournament ?? null);
  const [tourError, setTourError] = useState<string | null>(null);

  // Persist anything that changes
  useEffect(() => { saveState({ lang }); }, [lang]);
  useEffect(() => { saveState({ theme }); }, [theme]);
  useEffect(() => { saveState({ selectedSets: selected }); }, [selected]);
  useEffect(() => { saveState({ excludedFighters }); }, [excludedFighters]);
  useEffect(() => { saveState({ excludedMaps }); }, [excludedMaps]);
  useEffect(() => { saveState({ mode }); }, [mode]);
  useEffect(() => { saveState({ playerNames }); }, [playerNames]);
  useEffect(() => { saveState({ result }); }, [result]);
  useEffect(() => { saveState({ history }); }, [history]);
  useEffect(() => { saveState({ tournament }); }, [tournament]);
  useEffect(() => { saveState({ view }); }, [view]);

  // Archive a roll into history (used before replacing current with a fresh roll).
  const archiveRoll = (r: RollResult, names: string[]) => {
    const entry: HistoryEntry = {
      id: makeId(),
      timestamp: Date.now(),
      result: r,
      playerNames: names.slice(),
    };
    setHistory((h) => [entry, ...h].slice(0, HISTORY_MAX));
  };

  // Apply theme to <html>
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  // Global keyboard shortcuts:
  //   R = Roll   ·   A = Reroll all   ·   M = Reroll map
  //   1–4 = Reroll fighter at that index   ·   H = Open history
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.isContentEditable
      ) return;
      if (historyOpen || setsOpen || view !== 'roll') return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const k = e.key.toLowerCase();
      if (k === 'r') { e.preventDefault(); handleRoll(); return; }
      if (k === 'h') { e.preventDefault(); setHistoryOpen(true); return; }
      if (!result) return;
      if (k === 'a') { e.preventDefault(); handleRerollAll(); return; }
      if (k === 'm' && result.map) { e.preventDefault(); handleRerollMap(); return; }
      if (/^[1-4]$/.test(k)) {
        const idx = parseInt(k, 10) - 1;
        if (idx < result.fighters.length) {
          e.preventDefault();
          handleRerollFighter(idx);
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result, historyOpen, setsOpen, view, selected, mode, lang, playerNames]);

  // On mount: if a shared roll is in the URL, restore it and clean the URL.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('r');
    if (!token) return;
    const decoded = decodeRoll(token);
    if (decoded) {
      setResult(decoded);
      setMode(decoded.mode);
    }
    // Clean ?r= so refreshes don't re-trigger this
    const url = new URL(window.location.href);
    url.searchParams.delete('r');
    window.history.replaceState({}, '', url.toString());
    // Run only on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const handleToggleExcludedFighter = (key: string) => {
    setExcludedFighters((cur) => (cur.includes(key) ? cur.filter((x) => x !== key) : [...cur, key]));
  };
  const handleToggleExcludedMap = (key: string) => {
    setExcludedMaps((cur) => (cur.includes(key) ? cur.filter((x) => x !== key) : [...cur, key]));
  };

  const handleRoll = () => {
    const r = roll(selected, mode, lang, excludedFighters, excludedMaps);
    if (r.ok) {
      if (result) archiveRoll(result, playerNames);
      setResult(r.roll);
      setError(null);
      // Scroll the result into view shortly after render
      requestAnimationFrame(() => {
        const el = document.querySelector('.result');
        el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    } else {
      setError(r.error);
    }
  };

  const handleRerollFighter = (idx: number) => {
    if (!result) return;
    setResult(rerollFighter(result, idx, selected, lang, excludedFighters));
  };
  const handleRerollMap = () => {
    if (!result) return;
    setResult(rerollMap(result, selected, lang, excludedMaps));
  };
  const handleRerollAll = () => {
    const next = rerollAll(selected, mode, lang, result, excludedFighters, excludedMaps);
    if (next) {
      if (result) archiveRoll(result, playerNames);
      setResult(next);
    }
  };

  const handleToggleFighterLock = (idx: number) => {
    setResult((r) => {
      if (!r) return r;
      const locks = (r.fighterLocks ?? r.fighters.map(() => false)).slice();
      locks[idx] = !locks[idx];
      return { ...r, fighterLocks: locks };
    });
  };

  const handleToggleMapLock = () => {
    setResult((r) => (r ? { ...r, mapLock: !r.mapLock } : r));
  };

  const handleHistoryRestore = (entry: HistoryEntry) => {
    setResult(entry.result);
    setMode(entry.result.mode);
    setPlayerNames(entry.playerNames);
    setHistoryOpen(false);
    setError(null);
    requestAnimationFrame(() => {
      const el = document.querySelector('.result');
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const handleHistoryClear = () => {
    setHistory([]);
    setHistoryOpen(false);
  };

  // ── Tournament ─────────────────────────────────────────────────────────────
  const handleTourStart = () => {
    const r = createTournament(selected, excludedFighters, excludedMaps);
    if (r.ok) {
      setTournament(r.tournament);
      setTourError(null);
    } else {
      setTourError(r.error === 'no_maps' ? s.tour.errNoMaps : s.tour.errNoFighters);
    }
  };

  const handleTourRestart = () => {
    if (tournament && !window.confirm(s.tour.restartConfirm)) return;
    setTournament(null);
    setTourError(null);
  };

  const handleTourWin = (matchId: string, winner: 'a' | 'b') => {
    setTournament((cur) => (cur ? setWinner(cur, matchId, winner) : cur));
  };

  const handleTourUndo = (matchId: string) => {
    setTournament((cur) => {
      if (!cur) return cur;
      // Warn only when undoing would wipe results further down the bracket.
      const dependents = cur.matches.filter(
        (d) =>
          d.winner &&
          ((d.a.kind === 'winnerOf' && d.a.matchId === matchId) ||
            (d.b.kind === 'winnerOf' && d.b.matchId === matchId)),
      );
      if (dependents.length > 0 && !window.confirm(s.tour.undoConfirm)) return cur;
      return getMatch(cur, matchId) ? clearWinner(cur, matchId) : cur;
    });
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
        historyCount={history.length}
        setsCount={selected.length}
        setsTotal={SETS.length}
        onLangChange={setLang}
        onThemeToggle={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
        onHistoryOpen={() => setHistoryOpen(true)}
        onSetsOpen={() => setSetsOpen(true)}
      />

      <DisclaimerBanner lang={lang} />

      <SetsSheet
        open={setsOpen}
        lang={lang}
        selected={selected}
        excludedFighters={excludedFighters}
        excludedMaps={excludedMaps}
        onClose={() => setSetsOpen(false)}
        onToggle={handleToggleSet}
        onSelectAll={handleSelectAll}
        onDeselectAll={handleDeselectAll}
        onToggleFighter={handleToggleExcludedFighter}
        onToggleMap={handleToggleExcludedMap}
      />

      <HistorySheet
        open={historyOpen}
        history={history}
        lang={lang}
        onClose={() => setHistoryOpen(false)}
        onRestore={handleHistoryRestore}
        onClear={handleHistoryClear}
      />

      <div className="view-tabs" role="tablist" aria-label={s.tour.title}>
        <div className="view-tabs-inner">
          <button
            type="button"
            role="tab"
            aria-selected={view === 'roll'}
            className="view-tab"
            onClick={() => setView('roll')}
          >
            🎲 {s.tour.navRoll}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={view === 'tournament'}
            className="view-tab"
            onClick={() => setView('tournament')}
          >
            🏆 {s.tour.nav}
          </button>
        </div>
      </div>

      {view === 'roll' && (
        <StickyBar
          lang={lang}
          mode={mode}
          onModeChange={setMode}
          onRoll={handleRoll}
        />
      )}

      {view === 'tournament' ? (
        <main>
          <TournamentView
            lang={lang}
            tournament={tournament}
            playerNames={[
              playerNames[0] || s.playerN(1),
              playerNames[1] || s.playerN(2),
            ]}
            poolSize={buildFighterPool(selected, excludedFighters).length}
            poolSets={selected.length}
            poolMaps={buildMapPool(selected, excludedMaps).length}
            error={tourError}
            onStart={handleTourStart}
            onRestart={handleTourRestart}
            onWin={handleTourWin}
            onUndo={handleTourUndo}
            onPlayerRename={handlePlayerRename}
            onOpenSets={() => setSetsOpen(true)}
          />
        </main>
      ) : (
      <main>
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
            onToggleFighterLock={handleToggleFighterLock}
            onToggleMapLock={handleToggleMapLock}
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
              <button
                type="button"
                className="btn-tertiary empty-action"
                onClick={() => setSetsOpen(true)}
              >
                {s.setsCount(selected.length, SETS.length)} · {s.customizeSets} →
              </button>
            </div>
          )
        )}
      </main>
      )}

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
