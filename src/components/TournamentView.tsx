import { useState } from 'react';
import { getMapImage, getMiniImage } from '../data/box-images';
import { t } from '../lib/i18n';
import {
  champion,
  fighterName,
  mapName,
  playedCount,
  playerScores,
  resolveSlot,
  roundKey,
  setCode,
  setName,
  sidesOf,
  upcomingMatches,
} from '../lib/tournament';
import type { ActionLabel, FighterRef, TMatch, Tournament } from '../lib/tournament';
import type { Lang } from '../types';

interface Props {
  lang: Lang;
  tournament: Tournament | null;
  playerNames: [string, string];
  poolSize: number;
  poolSets: number;
  poolMaps: number;
  error: string | null;
  undoLabel: ActionLabel | null;
  redoLabel: ActionLabel | null;
  onStart: () => void;
  onRestart: () => void;
  onWin: (matchId: string, winner: 'a' | 'b') => void;
  onUndo: (matchId: string) => void;
  onUndoAction: () => void;
  onRedoAction: () => void;
  onPlayerRename: (idx: number, name: string) => void;
  onOpenSets: () => void;
}

const UPCOMING_PREVIEW = 4;

/** Structural action labels resolve here so they follow the current language. */
function actionText(a: ActionLabel, lang: Lang): string {
  const s = t(lang);
  switch (a.kind) {
    case 'win': return s.tour.actWin(fighterName(a.fighter, lang));
    case 'undoMatch': return s.tour.actUndoMatch;
    case 'draw': return s.tour.actDraw;
    case 'reset': return s.tour.actReset;
  }
}

function UndoBar({
  lang, undoLabel, redoLabel, onUndoAction, onRedoAction,
}: Pick<Props, 'lang' | 'undoLabel' | 'redoLabel' | 'onUndoAction' | 'onRedoAction'>) {
  const s = t(lang);
  return (
    <div className="tm-undo">
      <button
        type="button"
        className="tm-undo-btn"
        onClick={onUndoAction}
        disabled={!undoLabel}
        title={undoLabel ? s.tour.undoTip(actionText(undoLabel, lang)) : undefined}
      >
        ↩ {s.tour.undoBtn}
        {undoLabel && <span className="tm-undo-what">{actionText(undoLabel, lang)}</span>}
      </button>
      <button
        type="button"
        className="tm-undo-btn"
        onClick={onRedoAction}
        disabled={!redoLabel}
        title={redoLabel ? s.tour.redoTip(actionText(redoLabel, lang)) : undefined}
      >
        ↪ {s.tour.redoBtn}
      </button>
    </div>
  );
}

export function TournamentView(props: Props) {
  const { lang, tournament, playerNames } = props;
  const s = t(lang);
  const [showAllUpcoming, setShowAllUpcoming] = useState(false);

  if (!tournament) {
    return (
      <>
        <UndoBar {...props} />
        <TournamentSetup {...props} />
      </>
    );
  }

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
      <UndoBar {...props} />

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
              player={0}
              onRename={(v) => props.onPlayerRename(0, v)}
            />
            <span className="tm-score-nums">
              <b className="p0">{scores[0]}</b>
              <span className="tm-score-sep">:</span>
              <b className="p1">{scores[1]}</b>
            </span>
            <EditableName
              name={playerNames[1]}
              player={1}
              onRename={(v) => props.onPlayerRename(1, v)}
            />
          </div>
        </div>

        <button type="button" className="btn-tertiary tm-restart" onClick={props.onRestart}>
          {s.tour.restart}
        </button>
      </header>

      <p className="tm-safety">{s.tour.safetyNote}</p>

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
        <BracketTree
          t={tournament}
          lang={lang}
          playerNames={playerNames}
          label={label}
          onUndo={props.onUndo}
        />
      </div>
    </section>
  );
}

// ── Bracket tree — sports-style, with connector lines ────────────────────────

const BOX_W = 176;
const BOX_H = 52;
const PITCH = 66;   // vertical distance between adjacent round-1 matches
const COL_GAP = 54;
const HEADER_H = 32;

function BracketTree({
  t: tour, lang, playerNames, label, onUndo,
}: {
  t: Tournament;
  lang: Lang;
  playerNames: [string, string];
  label: (round: number) => string;
  onUndo: (id: string) => void;
}) {
  const s = t(lang);

  const byRound: Record<number, TMatch[]> = {};
  for (const m of tour.matches) (byRound[m.round] ??= []).push(m);

  // Vertical placement: round 1 is evenly spaced; every later match sits
  // centred between the two matches that feed it.
  const y: Record<string, number> = {};
  byRound[1].forEach((m, i) => { y[m.id] = i * PITCH; });
  for (let r = 2; r <= tour.totalRounds; r++) {
    byRound[r].forEach((m, i) => {
      const a = byRound[r - 1][2 * i];
      const b = byRound[r - 1][2 * i + 1];
      y[m.id] = (y[a.id] + y[b.id]) / 2;
    });
  }
  // Qualifiers sit level with the round-1 match they feed into.
  if (byRound[0]) {
    for (const q of byRound[0]) {
      const target = byRound[1].find(
        (m) =>
          (m.a.kind === 'winnerOf' && m.a.matchId === q.id) ||
          (m.b.kind === 'winnerOf' && m.b.matchId === q.id),
      );
      y[q.id] = target ? y[target.id] : 0;
    }
  }

  const hasQ = Boolean(byRound[0]);
  const colX = (round: number) => (hasQ ? round : round - 1) * (BOX_W + COL_GAP);
  const columns = (hasQ ? 1 : 0) + tour.totalRounds;
  const width = columns * BOX_W + (columns - 1) * COL_GAP;
  const height = byRound[1].length * PITCH + HEADER_H;

  // Elbow connectors from each feeder to the match it advances into.
  const links: { d: string; live: boolean }[] = [];
  for (const m of tour.matches) {
    for (const slot of [m.a, m.b]) {
      if (slot.kind !== 'winnerOf') continue;
      const feeder = tour.matches.find((f) => f.id === slot.matchId);
      if (!feeder) continue;
      const fx = colX(feeder.round) + BOX_W;
      const fy = y[feeder.id] + BOX_H / 2 + HEADER_H;
      const px = colX(m.round);
      const py = y[m.id] + BOX_H / 2 + HEADER_H;
      const midX = fx + (px - fx) / 2;
      links.push({
        d: `M ${fx} ${fy} H ${midX} V ${py} H ${px}`,
        live: feeder.winner !== null,
      });
    }
  }

  const roundNumbers = Object.keys(byRound).map(Number).sort((a, b) => a - b);

  return (
    <div className="tm-tree-scroll">
      <div className="tm-tree" style={{ width, height }}>
        <svg className="tm-tree-links" width={width} height={height} aria-hidden="true">
          {links.map((l, i) => (
            <path key={i} d={l.d} className={l.live ? 'tm-link live' : 'tm-link'} />
          ))}
        </svg>

        {roundNumbers.map((r) => (
          <div
            key={`h${r}`}
            className="tm-tree-head"
            style={{ left: colX(r), width: BOX_W }}
          >
            {label(r)}
            <span className="tm-tree-head-n">{byRound[r].length}</span>
          </div>
        ))}

        {tour.matches.map((m) => (
          <TreeBox
            key={m.id}
            m={m}
            t={tour}
            lang={lang}
            playerNames={playerNames}
            x={colX(m.round)}
            y={y[m.id] + HEADER_H}
            onUndo={onUndo}
            undoLabel={s.tour.undo}
            tbd={s.tour.tbd}
          />
        ))}
      </div>
    </div>
  );
}

function TreeBox({
  m, t: tour, lang, playerNames, x, y, onUndo, undoLabel, tbd,
}: {
  m: TMatch;
  t: Tournament;
  lang: Lang;
  playerNames: [string, string];
  x: number;
  y: number;
  onUndo: (id: string) => void;
  undoLabel: string;
  tbd: string;
}) {
  const a = resolveSlot(tour, m.a);
  const b = resolveSlot(tour, m.b);
  const sides = sidesOf(m);
  const decided = m.winner !== null;

  const tip = [
    m.map ? `🗺 ${mapName(m.map, lang)}` : null,
    sides && a ? `${playerNames[sides.playerA]}: ${fighterName(a, lang)}` : null,
    sides && b ? `${playerNames[sides.playerB]}: ${fighterName(b, lang)}` : null,
    decided ? undoLabel : null,
  ].filter(Boolean).join('\n');

  const row = (ref_: FighterRef | null, side: 'a' | 'b') => {
    const state = !decided ? '' : m.winner === side ? ' won' : ' lost';
    const player = sides ? (side === 'a' ? sides.playerA : sides.playerB) : null;
    // Colour, not just the initial — two players can share a first letter.
    const initial = player !== null && ref_ ? (playerNames[player][0] ?? '') : '';
    return (
      <span className={`tm-tree-row${state}`}>
        {initial && (
          <span className={`tm-tree-who p${player}`} title={playerNames[player!]}>
            {initial}
          </span>
        )}
        <span className="tm-tree-name">{ref_ ? fighterName(ref_, lang) : tbd}</span>
      </span>
    );
  };

  const common = {
    className: `tm-tree-box${decided ? ' decided' : ''}${!a || !b ? ' pending' : ''}`,
    style: { left: x, top: y, width: BOX_W, height: BOX_H },
    title: tip || undefined,
  };

  if (decided) {
    return (
      <button type="button" {...common} onClick={() => onUndo(m.id)} aria-label={undoLabel}>
        {row(a, 'a')}
        {row(b, 'b')}
      </button>
    );
  }
  return <div {...common}>{row(a, 'a')}{row(b, 'b')}</div>;
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

      <FighterSide
        ref_={a} lang={lang}
        player={sides ? playerNames[sides.playerA] : ''}
        playerIdx={sides ? sides.playerA : null}
      />
      <div className="tm-card-vs"><span>{s.tour.vs}</span></div>
      <FighterSide
        ref_={b} lang={lang}
        player={sides ? playerNames[sides.playerB] : ''}
        playerIdx={sides ? sides.playerB : null}
      />

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

function FighterSide({
  ref_, lang, player, playerIdx,
}: { ref_: FighterRef; lang: Lang; player: string; playerIdx: 0 | 1 | null }) {
  const s = t(lang);
  const img = getMiniImage(ref_.setId, ref_.idx);
  return (
    <div className="tm-side">
      <div className="tm-side-img">
        {img ? <img src={img} alt="" loading="lazy" /> : <span className="tm-side-code">{setCode(ref_.setId)}</span>}
      </div>
      <div className="tm-side-body">
        {player && (
          <div className={`tm-side-player p${playerIdx}`}>
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

// ── Editable player name ─────────────────────────────────────────────────────

function EditableName({
  name, player, onRename,
}: { name: string; player: 0 | 1; onRename: (v: string) => void }) {
  return (
    <span
      className={`tm-score-name p${player}`}
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
