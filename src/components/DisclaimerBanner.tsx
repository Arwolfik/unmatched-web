import { useState } from 'react';
import { t } from '../lib/i18n';
import type { Lang } from '../types';

const KEY = 'unmatched-picker:banner-dismissed:v1';

interface Props {
  lang: Lang;
}

export function DisclaimerBanner({ lang }: Props) {
  const [hidden, setHidden] = useState(() => {
    try { return localStorage.getItem(KEY) === '1'; }
    catch { return false; }
  });

  if (hidden) return null;
  const s = t(lang);

  const dismiss = () => {
    try { localStorage.setItem(KEY, '1'); } catch { /* ignore */ }
    setHidden(true);
  };

  return (
    <div className="banner" role="note">
      <div className="banner-inner">
        <span className="banner-icon" aria-hidden="true">ⓘ</span>
        <span className="banner-text">{s.bannerNotice}</span>
        <button type="button" className="banner-dismiss" onClick={dismiss}>
          {s.bannerDismiss}
        </button>
      </div>
    </div>
  );
}
