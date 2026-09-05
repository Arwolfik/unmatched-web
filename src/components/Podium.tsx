import { getMiniImage } from '../data/box-images';
import { t } from '../lib/i18n';
import { fighterName, setCode, setName } from '../lib/tournament';
import type { Placement } from '../lib/tournament';
import type { Lang } from '../types';

const MEDALS = ['', '🥇', '🥈', '🥉'];

export function Podium({
  places, lang, playerNames, showTitle = true,
}: {
  places: { first: Placement | null; second: Placement | null; third: Placement | null };
  lang: Lang;
  playerNames: [string, string];
  showTitle?: boolean;
}) {
  const s = t(lang);
  const slots: [number, Placement | null][] = [
    [1, places.first], [2, places.second], [3, places.third],
  ];

  return (
    <section className="tm-podium" aria-label={s.tour.podiumTitle}>
      {showTitle && <h2 className="tm-podium-title">{s.tour.podiumTitle}</h2>}
      <ol className="tm-podium-row">
        {slots.map(([place, p]) => p && (
          <li key={place} className={`tm-podium-slot place${place}`}>
            <div className="tm-podium-card">
              <div className="tm-podium-medal">{MEDALS[place]}</div>
              <div className="tm-podium-img">
                {getMiniImage(p.fighter.setId, p.fighter.idx)
                  ? <img src={getMiniImage(p.fighter.setId, p.fighter.idx)} alt="" loading="lazy" />
                  : <span className="tm-podium-code">{setCode(p.fighter.setId)}</span>}
              </div>
              <div className="tm-podium-name">{fighterName(p.fighter, lang)}</div>
              <div className="tm-podium-set">{setName(p.fighter.setId, lang)}</div>
              {p.player !== null && playerNames[p.player] && (
                <div className={`tm-podium-player p${p.player}`}>
                  {s.tour.playedBy(playerNames[p.player])}
                </div>
              )}
            </div>
            <div className="tm-podium-plinth">
              <span className="tm-podium-place">{s.tour.place(place)}</span>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
