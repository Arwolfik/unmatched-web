import { getMiniImage } from '../data/box-images';
import { t } from '../lib/i18n';
import { champion, fighterName, playedCount, playerScores, setName } from '../lib/tournament';
import type { ArchivedTournament } from '../lib/stats';
import type { Tournament } from '../lib/tournament';
import type { Lang } from '../types';

interface Props {
  lang: Lang;
  archive: ArchivedTournament[];
  current: Tournament | null;
  currentNames: [string, string];
  onOpenResults: (index: number | 'current') => void;
  onFileCurrent: () => void;
  onDelete: (index: number) => void;
}

export function ArchiveView({
  lang, archive, current, currentNames, onOpenResults, onFileCurrent, onDelete,
}: Props) {
  const s = t(lang);
  // Newest first, without disturbing the stored order.
  const rows = archive.map((entry, index) => ({ entry, index })).reverse();

  return (
    <section className="ar" aria-label={s.stats.archiveTitle}>
      <header className="st-head">
        <h2 className="st-title">{s.stats.archiveTitle}</h2>
      </header>

      {current && playedCount(current) > 0 && (
        <Card
          lang={lang}
          tournament={current}
          names={currentNames}
          date={current.createdAt}
          badge={s.stats.archiveCurrent}
          onOpen={() => onOpenResults('current')}
          extra={
            <button type="button" className="btn-tertiary" onClick={onFileCurrent}>
              {s.stats.archiveFileIt}
            </button>
          }
        />
      )}

      {rows.length === 0 ? (
        <div className="sheet-empty">
          <div className="empty-text">{s.stats.archiveEmpty}</div>
          <div className="empty-sub">{s.stats.archiveEmptySub}</div>
        </div>
      ) : (
        rows.map(({ entry, index }) => (
          <Card
            key={`${entry.tournament.id}-${index}`}
            lang={lang}
            tournament={entry.tournament}
            names={entry.playerNames}
            date={entry.archivedAt}
            onOpen={() => onOpenResults(index)}
            extra={
              <button type="button" className="btn-tertiary ar-del" onClick={() => onDelete(index)}>
                {s.stats.archiveDelete}
              </button>
            }
          />
        ))
      )}
    </section>
  );
}

function Card({
  lang, tournament, names, date, badge, onOpen, extra,
}: {
  lang: Lang;
  tournament: Tournament;
  names: [string, string];
  date: number;
  badge?: string;
  onOpen: () => void;
  extra: React.ReactNode;
}) {
  const s = t(lang);
  const champ = champion(tournament);
  const score = playerScores(tournament);
  const dateText = new Date(date).toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  return (
    <article className="ar-card">
      <div className="ar-card-img">
        {champ && getMiniImage(champ.setId, champ.idx)
          ? <img src={getMiniImage(champ.setId, champ.idx)} alt="" loading="lazy" />
          : <span className="ar-card-blank">🏆</span>}
      </div>

      <div className="ar-card-body">
        <div className="ar-card-meta">
          <span>{dateText}</span>
          <span className={badge ? 'ar-badge live' : 'ar-badge'}>
            {badge ?? (champ ? '' : s.stats.archiveUnfinished)}
          </span>
        </div>
        <div className="ar-card-champ">
          {champ ? fighterName(champ, lang) : '—'}
        </div>
        {champ && <div className="ar-card-set">{setName(champ.setId, lang)}</div>}
        <div className="ar-card-score">
          <span className="p0">{names[0]} {score[0]}</span>
          <span className="ar-card-sep">:</span>
          <span className="p1">{score[1]} {names[1]}</span>
        </div>
      </div>

      <div className="ar-card-actions">
        <button type="button" className="btn-secondary" onClick={onOpen}>
          {s.stats.results}
        </button>
        {extra}
      </div>
    </article>
  );
}
