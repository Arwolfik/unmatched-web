import { useState } from 'react';
import { getMapImage, getMiniImage } from '../data/box-images';
import { t } from '../lib/i18n';
import {
  champion,
  fighterName,
  mapName,
  matchesByRound,
  playedCount,
  playerScores,
  resolveSlot,
  roundKey,
  setCode,
  setName,
  sidesOf,
  upcomingMatches,
} from '../lib/tournament';
import type { FighterRef, TMatch, Tournament } from '../lib/tournament';
import type { Lang } from '../types';

interface Props {
  lang: Lang;
  tournament: Tournament | null;
  playerNames: [string, string];
  poolSize: number;
  poolSets: number;
  poolMaps: number;
  error: string | null;
  onStart: () => void;
  onRestart: () => void;
  onWin: (matchId: string, winner: 'a' | 'b') => void;
  onUndo: (matchId: string) => void;
  onPlayerRename: (idx: number, name: string) => void;
  onOpenSets: () => void;
}

const UPCOMING_PREVIEW = 4;

export function TournamentView(props: Props) {
  const { lang, tournament, playerNames } = props;
  const s = t(lang);
  const [showAllUpcoming, setShowAllUpcoming] = useState(false);

  if (!tournament) return <TournamentSetup {...props} />;

  const rounds = matchesByRound(tournament);
  const played = playedCount(tournament);
  const total = tournament.matches.length;
  const scores = playerScores(tournament);
  const champ = champion(tournament);
  const upcoming = upcomingMatches(tournament);
  const visible = showAllUpcoming ? upcoming : upcoming.slice(0, UPCOMING_PREVIEW);

  const label = (round: number) => {
    const key = roundKey(tournament, round);
    if (key === 'qualifier') return s.tour.roundQualifier;
    if (key === 'final') return s.tour.roundFinal;
    return key;
  };

  return (
    <section className="tm" aria-label={s.tour.title}>
      {/* ── Status bar ───────────────────────────────────────────── */}
      <header className="tm-status">
        <div className="tm-progress">
          <div className="tm-progress-text">{s.tour.progress(played, total)}</div>
          <div className="tm-progress-track" aria-hidden="true">
            <div className="tm-progress-fill" style={{ width: `${(played / total) * 100}%` }} />
          </div>
        </div>

        <div className="tm-score" aria-label={s.tour.scoreboard}>
          <div className="tm-score-label">{s.tour.scoreboard}</div>
          <div className="tm-score-row">
            <EditableName
              name={playerNames[0]}
              onRename={(v) => props.onPlayerRename(0, v)}
            />
            <span className="tm-score-nums">
              <b>{scores[0]}</b>
              <span className="tm-score-sep">:</span>
              <b>{scores[1]}</b>
            </span>
            <EditableName
              name={playerNames[1]}
              onRename={(v) => props.onPlayerRename(1, v)}
            />
          </div>
        </div>

        <button type="button" className="btn-tertiary tm-restart" onClick={props.onRestart}>
          {s.tour.restart}
        </button>
      </header>

      {/* ── Champion ─────────────────────────────────────────────── */}
      {champ && (
        <div className="tm-champion">
          {getMiniImage(champ.setId, champ.idx) && (
            <div className="tm-champion-img">
              <img src={getMiniImage(champ.setId, champ.idx)} alt="" loading="lazy" />
            </div>
          )}
          <div className="tm-champion-body">
            <div className="tm-champion-label">🏆 {s.tour.championIs}</div>
            <div className="tm-champion-name">{fighterName(champ, lang)}</div>
            <div className="tm-champion-set">{setName(champ.setId, lang)}</div>
          </div>
        </div>
      )}

      {/* ── Up next ──────────────────────────────────────────────── */}
      <div className="tm-section">
        <h2 className="tm-section-title">{s.tour.upcoming}</h2>
        {upcoming.length === 0 ? (
          <p className="tm-empty">{s.tour.upcomingEmpty}</p>
        ) : (
          <>
            <div className="tm-cards">
              {visible.map((m) => (
                <MatchCard
                  key={m.id}
                  m={m}
                  t={tournament}
                  lang={lang}
                  playerNames={playerNames}
                  roundLabel={label(m.round)}
                  onWin={props.onWin}
                />
              ))}
            </div>
            {upcoming.length > UPCOMING_PREVIEW && (
              <button
                type="button"
                className="btn-tertiary tm-more"
                onClick={() => setShowAllUpcoming((v) => !v)}
              >
                {showAllUpcoming
                  ? '▲'
                  : `▼ +${upcoming.length - UPCOMING_PREVIEW}`}
              </button>
            )}
          </>
        )}
      </div>

      {/* ── Bracket ──────────────────────────────────────────────── */}
      <div className="tm-section">
        <h2 className="tm-section-title">{s.tour.bracket}</h2>
        <div className="tm-bracket">
          {rounds.map((round, i) => (
            <div className="tm-col" key={i}>
              <div className="tm-col-head">
                {label(round[0].round)}
                <span className="tm-col-count">{round.length}</span>
              </div>
              {round.map((m) => (
                <BracketRow
                  key={m.id}
                  m={m}
                  t={tournament}
                  lang={lang}
                  playerNames={playerNames}
                  onUndo={props.onUndo}
                  undoLabel={s.tour.undo}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Setup screen ─────────────────────────────────────────────────────────────

function TournamentSetup({
  lang, poolSize, poolSets, poolMaps, error, onStart, onOpenSets,
}: Props) {
  const s = t(lang);
  const base = poolSize >= 4 ? 2 ** Math.floor(Math.log2(poolSize)) : 0;
  const qualifiers = poolSize - base;

  return (
    <section className="tm-setup">
      <div className="tm-setup-title">{s.tour.setupTitle}</div>
      <div className="tm-setup-sub">{s.tour.setupSub(poolSize, poolSets, poolMaps)}</div>

      {poolSize >= 4 && (
        <ul className="tm-setup-facts">
          <li>{s.tour.setupMatches(poolSize - 1)}</li>
          {qualifiers > 0 && <li>{s.tour.setupQualifier(qualifiers)}</li>}
        </ul>
      )}

      {error && <div className="tm-setup-error">⚠ {error}</div>}

      <div className="tm-setup-actions">
        <button type="button" className="btn-primary" onClick={onStart} disabled={poolSize < 4}>
          🎲 {s.tour.start}
        </button>
        <button type="button" className="btn-tertiary" onClick={onOpenSets}>
          {s.manageSets} →
        </button>
      </div>
    </section>
  );
}

// ── Match card (playable) ────────────────────────────────────────────────────

function MatchCard({
  m, t: tour, lang, playerNames, roundLabel, onWin,
}: {
  m: TMatch;
  t: Tournament;
  lang: Lang;
  playerNames: [string, string];
  roundLabel: string;
  onWin: (id: string, w: 'a' | 'b') => void;
}) {
  const s = t(lang);
  const a = resolveSlot(tour, m.a)!;
  const b = resolveSlot(tour, m.b)!;
  const sides = sidesOf(m);

  return (
    <article className="tm-card">
      <header className="tm-card-head">
        <span className="tm-card-round">{roundLabel}</span>
        <span className="tm-card-num">#{m.idx + 1}</span>
      </header>

      <FighterSide ref_={a} lang={lang} player={sides ? playerNames[sides.playerA] : ''} />
      <div className="tm-card-vs"><span>{s.tour.vs}</span></div>
      <FighterSide ref_={b} lang={lang} player={sides ? playerNames[sides.playerB] : ''} />

      {m.map && (
        <div className="tm-card-map">
          {getMapImage(m.map.setId, m.map.idx) && (
            <span className="tm-card-map-thumb">
              <img src={getMapImage(m.map.setId, m.map.idx)} alt="" loading="lazy" />
            </span>
          )}
          <span className="tm-card-map-body">
            <span className="tm-card-map-name">🗺 {mapName(m.map, lang)}</span>
            <span className="tm-card-map-set">{setName(m.map.setId, lang)}</span>
          </span>
        </div>
      )}

      <div className="tm-card-actions">
        <button type="button" className="tm-win-btn" onClick={() => onWin(m.id, 'a')}>
          🏆 {fighterName(a, lang)}
        </button>
        <button type="button" className="tm-win-btn" onClick={() => onWin(m.id, 'b')}>
          🏆 {fighterName(b, lang)}
        </button>
      </div>
    </article>
  );
}

function FighterSide({ ref_, lang, player }: { ref_: FighterRef; lang: Lang; player: string }) {
  const s = t(lang);
  const img = getMiniImage(ref_.setId, ref_.idx);
  return (
    <div className="tm-side">
      <div className="tm-side-img">
        {img ? <img src={img} alt="" loading="lazy" /> : <span className="tm-side-code">{setCode(ref_.setId)}</span>}
      </div>
      <div className="tm-side-body">
        {player && (
          <div className="tm-side-player">
            <b>{player}</b> <span>{s.tour.plays}</span>
          </div>
        )}
        <div className="tm-side-name">{fighterName(ref_, lang)}</div>
        <div className="tm-side-set">
          <span className="tm-side-set-code">{setCode(ref_.setId)}</span>
          {setName(ref_.setId, lang)}
        </div>
      </div>
    </div>
  );
}

// ── Bracket row (compact) ────────────────────────────────────────────────────

function BracketRow({
  m, t: tour, lang, playerNames, onUndo, undoLabel,
}: {
  m: TMatch;
  t: Tournament;
  lang: Lang;
  playerNames: [string, string];
  onUndo: (id: string) => void;
  undoLabel: string;
}) {
  const s = t(lang);
  const a = resolveSlot(tour, m.a);
  const b = resolveSlot(tour, m.b);
  const sides = sidesOf(m);

  const title = m.map
    ? `${mapName(m.map, lang)}${sides ? ` · ${playerNames[sides.playerA]} / ${playerNames[sides.playerB]}` : ''}`
    : undefined;

  const nameOf = (r: FighterRef | null) => (r ? fighterName(r, lang) : s.tour.tbd);

  const decided = m.winner !== null;
  const Row = decided ? 'button' : 'div';

  return (
    <Row
      className={`tm-mini${decided ? ' decided' : ''}`}
      title={title}
      {...(decided
        ? { type: 'button' as const, onClick: () => onUndo(m.id), 'aria-label': undoLabel }
        : {})}
    >
      <span className={`tm-mini-side${m.winner === 'a' ? ' won' : m.winner === 'b' ? ' lost' : ''}`}>
        {nameOf(a)}
      </span>
      <span className={`tm-mini-side${m.winner === 'b' ? ' won' : m.winner === 'a' ? ' lost' : ''}`}>
        {nameOf(b)}
      </span>
    </Row>
  );
}

// ── Editable player name ─────────────────────────────────────────────────────

function EditableName({ name, onRename }: { name: string; onRename: (v: string) => void }) {
  return (
    <span
      className="tm-score-name"
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      onBlur={(e) => onRename(e.currentTarget.textContent?.trim() ?? '')}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          (e.currentTarget as HTMLElement).blur();
        }
      }}
    >
      {name}
    </span>
  );
}
