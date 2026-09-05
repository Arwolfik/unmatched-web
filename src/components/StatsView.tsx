import { useRef, useState } from 'react';
import { getMiniImage } from '../data/box-images';
import { t } from '../lib/i18n';
import { fighterName, mapName, setCode, setName } from '../lib/tournament';
import type { Stats } from '../lib/stats';
import type { Lang } from '../types';

interface Props {
  lang: Lang;
  stats: Stats;
  playerNames: [string, string];
  importNotice: string | null;
  onExport: () => void;
  onImport: (file: File) => void;
}

const TOP_N = 12;
const rate = (won: number, played: number) =>
  played === 0 ? '—' : `${Math.round((won / played) * 100)}%`;

export function StatsView({
  lang, stats, playerNames, importNotice, onExport, onImport,
}: Props) {
  const s = t(lang);
  const [allFighters, setAllFighters] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const fighters = allFighters ? stats.fighters : stats.fighters.slice(0, TOP_N);
  const total = stats.wins[0] + stats.wins[1];
  const share = total === 0 ? 50 : (stats.wins[0] / total) * 100;
  const ft = stats.firstTurn;

  return (
    <section className="st" aria-label={s.stats.title}>
      <header className="st-head">
        <h2 className="st-title">{s.stats.title}</h2>
        <p className="st-sub">{s.stats.subtitle(stats.tournaments, stats.matches)}</p>
      </header>

      {stats.matches === 0 ? (
        <div className="sheet-empty">
          <div className="empty-text">{s.stats.empty}</div>
          <div className="empty-sub">{s.stats.emptySub}</div>
        </div>
      ) : (
        <>
          {/* Head to head */}
          <div className="st-h2h">
            <div className="st-h2h-label">{s.stats.headToHead}</div>
            <div className="st-h2h-row">
              <span className="st-h2h-name p0">{playerNames[0]}</span>
              <span className="st-h2h-score">
                <b className="p0">{stats.wins[0]}</b>
                <span className="st-h2h-sep">:</span>
                <b className="p1">{stats.wins[1]}</b>
              </span>
              <span className="st-h2h-name p1">{playerNames[1]}</span>
            </div>
            <div className="st-bar" aria-hidden="true">
              <div className="st-bar-a" style={{ width: `${share}%` }} />
            </div>
          </div>

          {/* Tiles */}
          <div className="st-tiles">
            <Tile label={s.stats.tileTournaments} value={String(stats.tournaments)} />
            <Tile label={s.stats.tileFinished} value={String(stats.finished)} />
            <Tile label={s.stats.tileMatches} value={String(stats.matches)} />
            <Tile
              label={s.stats.tileTitles}
              value={`${stats.titles[0]} : ${stats.titles[1]}`}
              split
            />
            <Tile
              label={s.stats.tileFirstTurn}
              value={ft.games === 0 ? '—' : rate(ft.wonGoingFirst, ft.games)}
              note={ft.games === 0 ? s.stats.firstTurnUnknown : s.stats.firstTurnNote(ft.games)}
              wide
            />
          </div>

          {/* Fighters */}
          <div className="st-block">
            <h3 className="st-block-title">{s.stats.fighters}</h3>
            <p className="st-block-note">{s.stats.fightersNote}</p>
            <table className="st-table">
              <thead>
                <tr>
                  <th />
                  <th className="st-num">{s.stats.colPlayed}</th>
                  <th className="st-num">{s.stats.colWon}</th>
                  <th className="st-num">{s.stats.colRate}</th>
                </tr>
              </thead>
              <tbody>
                {fighters.map((f) => (
                  <tr key={`${f.ref.setId}::${f.ref.idx}`}>
                    <td>
                      <span className="st-who">
                        <span className="st-thumb">
                          {getMiniImage(f.ref.setId, f.ref.idx)
                            ? <img src={getMiniImage(f.ref.setId, f.ref.idx)} alt="" loading="lazy" />
                            : <span className="st-code">{setCode(f.ref.setId)}</span>}
                        </span>
                        <span>
                          <b>{fighterName(f.ref, lang)}</b>
                          <em>{setName(f.ref.setId, lang)}</em>
                        </span>
                      </span>
                    </td>
                    <td className="st-num">{f.played}</td>
                    <td className="st-num st-won">{f.won}</td>
                    <td className="st-num">{rate(f.won, f.played)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {stats.fighters.length > TOP_N && (
              <button
                type="button"
                className="btn-tertiary st-more"
                onClick={() => setAllFighters((v) => !v)}
              >
                {allFighters ? s.stats.showLess : s.stats.showAll(stats.fighters.length)}
              </button>
            )}
          </div>

          {/* Boxes */}
          <div className="st-block">
            <h3 className="st-block-title">{s.stats.boxes}</h3>
            <table className="st-table">
              <thead>
                <tr>
                  <th />
                  <th className="st-num">{s.stats.colPlayed}</th>
                  <th className="st-num">{s.stats.colWon}</th>
                  <th className="st-num">{s.stats.colRate}</th>
                </tr>
              </thead>
              <tbody>
                {stats.sets.map((x) => (
                  <tr key={x.setId}>
                    <td>
                      <span className="st-set">
                        <span className="st-set-code">{setCode(x.setId)}</span>
                        {setName(x.setId, lang)}
                      </span>
                    </td>
                    <td className="st-num">{x.played}</td>
                    <td className="st-num st-won">{x.won}</td>
                    <td className="st-num">{rate(x.won, x.played)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Maps */}
          <div className="st-block">
            <h3 className="st-block-title">{s.stats.maps}</h3>
            <ul className="st-maps">
              {stats.maps.map((x) => (
                <li key={`${x.ref.setId}::${x.ref.idx}`}>
                  <span className="st-map-name">{mapName(x.ref, lang)}</span>
                  <span className="st-map-set">{setName(x.ref.setId, lang)}</span>
                  <span className="st-map-n">{x.played}</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      {/* Data */}
      <div className="st-block st-data">
        <h3 className="st-block-title">{s.stats.data}</h3>
        <p className="st-block-note">{s.stats.dataNote}</p>
        <div className="st-data-actions">
          <button type="button" className="btn-secondary" onClick={onExport}>
            ↓ {s.stats.exportBtn}
          </button>
          <button type="button" className="btn-tertiary" onClick={() => fileRef.current?.click()}>
            ↑ {s.stats.importBtn}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onImport(f);
              e.target.value = '';
            }}
          />
        </div>
        {importNotice && <p className="st-notice">{importNotice}</p>}
      </div>
    </section>
  );
}

function Tile({
  label, value, note, wide, split,
}: { label: string; value: string; note?: string; wide?: boolean; split?: boolean }) {
  return (
    <div className={`st-tile${wide ? ' wide' : ''}`}>
      <div className="st-tile-label">{label}</div>
      <div className={`st-tile-value${split ? ' split' : ''}`}>{value}</div>
      {note && <div className="st-tile-note">{note}</div>}
    </div>
  );
}
