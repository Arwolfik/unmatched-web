import type { Lang } from '../types';

interface Strings {
  appName: string;
  // section
  yourSets: string;
  setsCount: (selected: number, total: number) => string;
  selectAll: string;
  deselectAll: string;
  searchPlaceholder: string;
  fightersCount: (n: number) => string;
  mapsCount: (n: number) => string;
  // modes
  duo: string;
  duoSub: string;
  quad: string;
  quadSub: string;
  ffa: string;
  ffaSub: string;
  // roll
  roll: string;
  rerollAll: string;
  rerollMap: string;
  rerollFighter: string;
  resultMeta: (mode: 'duo' | 'quad' | 'ffa') => string;
  mapLabel: string;
  // labels
  playerN: (n: number) => string;
  // empty / errors
  emptyTitle: string;
  emptySub: string;
  errNoSets: string;
  errNoMaps: string;
  errNoQuadMaps: string;
  errNotEnoughChars: (need: number, have: number) => string;
  // a11y
  rollAnnounce: (fighters: string[], map: string | null) => string;
  // nav
  themeLight: string;
  themeDark: string;
}

const en: Strings = {
  appName: 'Unmatched Picker',
  yourSets: 'Your sets',
  setsCount: (n, t) => `${n} of ${t} sets`,
  selectAll: 'Select all',
  deselectAll: 'Deselect all',
  searchPlaceholder: 'Search sets…',
  fightersCount: (n) => `${n} ${n === 1 ? 'fighter' : 'fighters'}`,
  mapsCount: (n) => (n === 0 ? 'no maps' : `${n} ${n === 1 ? 'map' : 'maps'}`),
  duo: '/duo',
  duoSub: '1v1',
  quad: '/quad',
  quadSub: '2v2',
  ffa: '/ffa',
  ffaSub: '4-player',
  roll: 'Roll',
  rerollAll: 'Reroll all',
  rerollMap: 'Reroll map',
  rerollFighter: 'Reroll',
  resultMeta: (m) => (m === 'duo' ? '1v1 — 2 fighters · 1 map' : m === 'quad' ? '2v2 — 4 fighters · 1 map' : '4-player free-for-all · 1 map'),
  mapLabel: 'Map',
  playerN: (n) => `Player ${n}`,
  emptyTitle: 'Pick your sets first.',
  emptySub: 'Toggle the boxes you own above, then roll.',
  errNoSets: 'No sets selected. Pick at least one to roll.',
  errNoMaps: 'None of your selected sets include any maps. Add a set with a map.',
  errNoQuadMaps: 'None of your selected sets include a 4-player map. Add a bigger box (Battle of Legends, Cobble & Fog, Marvel, etc.).',
  errNotEnoughChars: (need, have) => `Need ${need} fighters, your sets only contain ${have}.`,
  rollAnnounce: (fighters, map) =>
    `Roll complete: ${fighters.join(', ')}${map ? ` on ${map}` : ''}.`,
  themeLight: 'Light theme',
  themeDark: 'Dark theme',
};

const ru: Strings = {
  appName: 'Unmatched Picker',
  yourSets: 'Ваши наборы',
  setsCount: (n, t) => `${n} из ${t}`,
  selectAll: 'Выбрать все',
  deselectAll: 'Снять выбор',
  searchPlaceholder: 'Поиск наборов…',
  fightersCount: (n) => {
    const last = n % 10;
    const teen = n % 100 >= 11 && n % 100 <= 14;
    if (teen || last === 0 || last >= 5) return `${n} бойцов`;
    if (last === 1) return `${n} боец`;
    return `${n} бойца`;
  },
  mapsCount: (n) => {
    if (n === 0) return 'без карт';
    const last = n % 10;
    const teen = n % 100 >= 11 && n % 100 <= 14;
    if (teen || last === 0 || last >= 5) return `${n} карт`;
    if (last === 1) return `${n} карта`;
    return `${n} карты`;
  },
  duo: '/duo',
  duoSub: '1×1',
  quad: '/quad',
  quadSub: '2×2',
  ffa: '/ffa',
  ffaSub: '4 игрока',
  roll: 'Бросить',
  rerollAll: 'Перебросить всё',
  rerollMap: 'Перебросить поле',
  rerollFighter: 'Перебросить',
  resultMeta: (m) => (m === 'duo' ? '1×1 — 2 бойца · 1 поле' : m === 'quad' ? '2×2 — 4 бойца · 1 поле' : '4 игрока, каждый сам за себя · 1 поле'),
  mapLabel: 'Поле',
  playerN: (n) => `Игрок ${n}`,
  emptyTitle: 'Сначала выберите наборы.',
  emptySub: 'Отметьте свои коробки выше — и бросайте.',
  errNoSets: 'Не выбрано ни одного набора. Отметьте хотя бы один.',
  errNoMaps: 'В выбранных наборах нет полей. Добавьте набор с полем.',
  errNoQuadMaps: 'Ни в одном из выбранных наборов нет полей для 4 игроков. Добавьте крупный набор (Битва легенд, Булыжники и туман, Marvel и т.д.).',
  errNotEnoughChars: (need, have) => `Нужно ${need} бойцов, в наборах их только ${have}.`,
  rollAnnounce: (fighters, map) =>
    `Бросок: ${fighters.join(', ')}${map ? ` на ${map}` : ''}.`,
  themeLight: 'Светлая тема',
  themeDark: 'Тёмная тема',
};

const TABLE: Record<Lang, Strings> = { en, ru };

export function t(lang: Lang): Strings {
  return TABLE[lang];
}
