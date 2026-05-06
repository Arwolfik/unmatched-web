import { t } from './i18n';
import type { Lang } from '../types';

export function formatRelative(ts: number, lang: Lang, now: number = Date.now()): string {
  const s = t(lang);
  const diff = Math.max(0, now - ts);
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return s.justNow;
  if (mins < 60) return s.minAgo(mins);
  const hours = Math.floor(mins / 60);
  if (hours < 24) return s.hourAgo(hours);
  const days = Math.floor(hours / 24);
  if (days < 7) return s.dayAgo(days);
  return new Date(ts).toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export function makeId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
