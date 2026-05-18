import { useEffect, useRef, useState } from 'react';
import { SET_BY_ID } from '../data/sets';
import { t } from '../lib/i18n';
import { buildShareUrl } from '../lib/share';
import type { Lang, RollResult } from '../types';

interface Props {
  result: RollResult;
  lang: Lang;
  playerNames: string[];
  onPlayerRename: (idx: number, name: string) => void;
  onRerollFighter: (idx: number) => void;
  onRerollMap: () => void;
  onRerollAll: () => void;
  onToggleFighterLock: (idx: number) => void;
  onToggleMapLock: () => void;
}

export function ResultPanel({
  result,
  lang,
  playerNames,
  onPlayerRename,
  onRerollFighter,
  onRerollMap,
  onRerollAll,
  onToggleFighterLock,
  onToggleMapLock,
}: Props) {
  const s = t(lang);
  const announceRef = useRef<HTMLDivElement>(null);
  const [shareLabel, setShareLabel] = useState<string | null>(null);

  const handleShare = async () => {
    const url = buildShareUrl(result);
    try {
      await navigator.clipboard.writeText(url);
      setShareLabel(s.shareCopied);
    } catch {
      try {
        const ta = document.createElement('textarea');
        ta.value = url;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        setShareLabel(s.shareCopied);
      } catch {
        setShareLabel(s.shareFailed);
      }
    }
    window.setTimeout(() => setShareLabel(null), 2000);
  };

  useEffect(() => {
    if (announceRef.current) {
      announceRef.current.textContent = s.rollAnnounce(
        result.fighters.map((f) => f.char),
        result.map?.name ?? null,
      );
    }
  }, [result, s]);

  // Quad: 2 teams of 2 (player label = team label, fighters share an owner).
  // Duo & FFA: each fighter has its own player label.
  const isQuad = result.mode === 'quad';
  const isFour = result.fighters.length === 4;

  const renderFighterCard = (idx: number, opts: { showLabel: boolean; teamIdx?: number }) => {
    const f = result.fighters[idx];
    const set = SET_BY_ID.get(f.setId);
    const locked = result.fighterLocks?.[idx] === true;
    const labelOwnerIdx = opts.teamIdx ?? idx;
    const playerLabel = playerNames[labelOwnerIdx]?.trim() || s.playerN(labelOwnerIdx + 1);

    return (
      <article
        key={`${idx}-${f.setId}-${f.char}`}
        className={`fighter-card stagger-${idx + 1}${locked ? ' locked' : ''}${f.image ? ' has-image' : ''}`}
      >
        {f.image && (
          <div className="card-image" aria-hidden="true">
            <img src={f.image} alt="" loading="lazy" />
          </div>
        )}
        <div className="card-corners" aria-hidden="true">
          <span /><span /><span /><span />
        </div>
        {set && <div className="card-stamp">{set.code}</div>}
        <button
          type="button"
          className="card-lock"
          aria-pressed={locked}
          aria-label={locked ? s.unlock : s.lock}
          title={locked ? s.unlock : s.lock}
          onClick={() => onToggleFighterLock(idx)}
        >
          {locked ? <LockClosedIcon /> : <LockOpenIcon />}
        </button>

        {opts.showLabel && (
          <span
            className="player-label"
            contentEditable
            suppressContentEditableWarning
            spellCheck={false}
            onBlur={(e) => {
              const value = e.currentTarget.textContent?.trim() ?? '';
              onPlayerRename(labelOwnerIdx, value || s.playerN(labelOwnerIdx + 1));
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                (e.currentTarget as HTMLElement).blur();
              }
            }}
          >
            {playerLabel}
          </span>
        )}

        <h3 className="fighter-name">{f.char}</h3>
        <div className="card-sep" aria-hidden="true" />
        {set && <div className="fighter-set">{set.name[lang]}</div>}
      </article>
    );
  };

  const renderTeam = (teamIdx: number, fighterIndices: number[]) => {
    const teamLabel = playerNames[teamIdx]?.trim() || s.playerN(teamIdx + 1);
    return (
      <div className={`team team-${teamIdx + 1}`} key={`team-${teamIdx}`}>
        <div className="team-head">
          <span
            className="team-label"
            contentEditable
            suppressContentEditableWarning
            spellCheck={false}
            onBlur={(e) => {
              const value = e.currentTarget.textContent?.trim() ?? '';
              onPlayerRename(teamIdx, value || s.playerN(teamIdx + 1));
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                (e.currentTarget as HTMLElement).blur();
              }
            }}
          >
            {teamLabel}
          </span>
        </div>
        <div className="team-cards">
          {fighterIndices.map((idx) => renderFighterCard(idx, { showLabel: false, teamIdx }))}
        </div>
      </div>
    );
  };

  return (
    <section className="result" aria-labelledby="result-title">
      <div ref={announceRef} className="sr-only" aria-live="polite" />

      <div className="result-head">
        <span className="result-head-rule" />
        <span id="result-title" className="result-head-text">
          {s.resultMeta(result.mode)}
        </span>
        <button
          type="button"
          className="result-head-share"
          onClick={handleShare}
          aria-label={s.share}
          title={s.share}
        >
          <ShareIcon />
          <span>{shareLabel ?? s.share}</span>
        </button>
        <span className="result-head-rule" />
      </div>

      {isQuad ? (
        <div className="teams-row">
          {renderTeam(0, [0, 1])}
          {renderTeam(1, [2, 3])}
        </div>
      ) : (
        <div className={`fighters-row ${isFour ? 'cols-4' : ''}`}>
          {result.fighters.map((_, idx) => renderFighterCard(idx, { showLabel: true }))}
        </div>
      )}

      {result.map && (
        <article
          key={`map-${result.map.setId}-${result.map.name}`}
          className={`map-card${result.mapLock === true ? ' locked' : ''}${result.map.image ? ' has-image' : ''}`}
        >
          {result.map.image && (
            <div className="card-image map-image" aria-hidden="true">
              <img src={result.map.image} alt="" loading="lazy" />
            </div>
          )}
          <div className="card-corners" aria-hidden="true">
            <span /><span /><span /><span />
          </div>
          {(() => {
            const set = SET_BY_ID.get(result.map!.setId);
            const locked = result.mapLock === true;
            return (
              <>
                {set && <div className="card-stamp">{set.code}</div>}
                <button
                  type="button"
                  className="card-lock"
                  aria-pressed={locked}
                  aria-label={locked ? s.unlock : s.lock}
                  title={locked ? s.unlock : s.lock}
                  onClick={onToggleMapLock}
                >
                  {locked ? <LockClosedIcon /> : <LockOpenIcon />}
                </button>
                <div className="map-label">{s.mapLabel}</div>
                <h3 className="map-name">{result.map!.name}</h3>
                <div className="card-sep" aria-hidden="true" />
                {set && <div className="map-set">{set.name[lang]}</div>}
              </>
            );
          })()}
        </article>
      )}

      <div className="reroll-bar" role="group" aria-label={s.rerollAll}>
        {result.fighters.map((_, idx) => {
          // In quad mode, show fighter character name on reroll button (since each is unique).
          // In duo/ffa, show player name.
          const f = result.fighters[idx];
          const labelOwnerIdx = isQuad ? (idx < 2 ? 0 : 1) : idx;
          const buttonLabel = isQuad
            ? f.char
            : (playerNames[labelOwnerIdx]?.trim() || s.playerN(labelOwnerIdx + 1));
          return (
            <button
              key={`rr-${idx}`}
              type="button"
              className="reroll-btn"
              onClick={() => onRerollFighter(idx)}
              title={s.rerollFighter}
            >
              <span className="die" aria-hidden="true">🎲</span>
              <span>{buttonLabel}</span>
            </button>
          );
        })}
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

function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7" />
      <path d="M16 6l-4-4-4 4" />
      <path d="M12 2v13" />
    </svg>
  );
}

function LockClosedIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

function LockOpenIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0" />
    </svg>
  );
}
