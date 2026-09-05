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
  readyTitle: string;
  readySub: string;
  customizeSets: string;
  manageSets: string;
  ownSetOn: string;
  ownSetOff: string;
  fightersHeader: string;
  mapsHeader: string;
  fightersIncluded: (n: number, total: number) => string;
  errNoSets: string;
  errNoMaps: string;
  errNoQuadMaps: string;
  errNotEnoughChars: (need: number, have: number) => string;
  // a11y
  rollAnnounce: (fighters: string[], map: string | null) => string;
  // nav
  themeLight: string;
  themeDark: string;
  // tournament
  stats: {
    nav: string;
    navArchive: string;
    title: string;
    subtitle: (tournaments: number, matches: number) => string;
    empty: string;
    emptySub: string;
    headToHead: string;
    tileTournaments: string;
    tileFinished: string;
    tileMatches: string;
    tileTitles: string;
    tileFirstTurn: string;
    firstTurnNote: (n: number) => string;
    firstTurnUnknown: string;
    fighters: string;
    fightersNote: string;
    boxes: string;
    maps: string;
    colPlayed: string;
    colWon: string;
    colRate: string;
    showAll: (n: number) => string;
    showLess: string;
    data: string;
    dataNote: string;
    exportBtn: string;
    importBtn: string;
    importConfirm: (tournaments: number) => string;
    importDone: (tournaments: number) => string;
    importErrUnreadable: string;
    importErrForeign: string;
    importErrVersion: string;
    // archive
    archiveTitle: string;
    archiveEmpty: string;
    archiveEmptySub: string;
    archiveCurrent: string;
    archiveFileIt: string;
    archiveFileConfirm: string;
    archiveDelete: string;
    archiveDeleteConfirm: string;
    archiveUnfinished: string;
    // results sheet
    results: string;
    resultsTitle: string;
    resultsOf: (date: string) => string;
    resultsPrint: string;
    resultsClose: string;
    colMatch: string;
    colMap: string;
    colFirst: string;
    colWinner: string;
  };
  tour: {
    nav: string;
    navRoll: string;
    title: string;
    setupTitle: string;
    setupSub: (fighters: number, sets: number, maps: number) => string;
    setupMatches: (n: number) => string;
    setupQualifier: (n: number) => string;
    start: string;
    restart: string;
    restartConfirm: string;
    undoConfirm: (n: number) => string;
    undoBtn: string;
    redoBtn: string;
    undoTip: (label: string) => string;
    redoTip: (label: string) => string;
    actWin: (fighter: string) => string;
    actUndoMatch: string;
    actDraw: string;
    actReset: string;
    actEditMap: string;
    actEditSides: string;
    actEditFirst: string;
    safetyNote: string;
    progress: (played: number, total: number) => string;
    upcoming: string;
    upcomingEmpty: string;
    bracket: string;
    roundQualifier: string;
    roundFinal: string;
    roundThird: string;
    podiumTitle: string;
    place: (n: number) => string;
    playedBy: (name: string) => string;
    plays: string;
    wins: string;
    undo: string;
    champion: string;
    vs: string;
    tbd: string;
    scoreboard: string;
    goesFirst: string;
    goesFirstShort: string;
    edit: string;
    editTitle: string;
    editPairFixed: string;
    editMapLabel: string;
    editSidesLabel: string;
    editFirstLabel: string;
    editSwap: string;
    editOwnBox: string;
    editResult: string;
    editClearResult: string;
    editWonNote: (fighter: string, player: string) => string;
    editClose: string;
    errNoFighters: string;
    errNoMaps: string;
    matchN: (round: string, n: number) => string;
  };
  // footer
  footerDisclaimer: string;
  footerSource: string;
  footerAuthor: string;
  // top banner
  bannerNotice: string;
  bannerDismiss: string;
  // share
  share: string;
  shareCopied: string;
  shareFailed: string;
  // locks
  lock: string;
  unlock: string;
  // history
  history: string;
  historyTitle: string;
  historyEmpty: string;
  historyEmptySub: string;
  historyClear: string;
  historyClearConfirm: string;
  historyClose: string;
  historyRestore: string;
  // relative time
  justNow: string;
  minAgo: (n: number) => string;
  hourAgo: (n: number) => string;
  dayAgo: (n: number) => string;
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
  quadSub: 'Tag team',
  ffa: '/ffa',
  ffaSub: '4-player',
  roll: 'Roll',
  rerollAll: 'Reroll all',
  rerollMap: 'Reroll map',
  rerollFighter: 'Reroll',
  resultMeta: (m) => (m === 'duo' ? '1v1 — 2 fighters · 1 map' : m === 'quad' ? 'Tag team — 2 players · 2 fighters each · 1 map' : '4-player free-for-all · 1 map'),
  mapLabel: 'Map',
  playerN: (n) => `Player ${n}`,
  emptyTitle: 'Pick your sets first.',
  emptySub: 'Toggle the boxes you own above, then roll.',
  readyTitle: 'Ready to deal.',
  readySub: 'Pick a mode below and tap Roll.',
  customizeSets: 'Customize',
  manageSets: 'Manage sets',
  ownSetOn: 'I own this set',
  ownSetOff: "I don't own this set",
  fightersHeader: 'Fighters',
  mapsHeader: 'Maps',
  fightersIncluded: (n, total) => `${n} of ${total} fighters in pool`,
  errNoSets: 'No sets selected. Pick at least one to roll.',
  errNoMaps: 'None of your selected sets include any maps. Add a set with a map.',
  errNoQuadMaps: 'None of your selected sets include a 4-player map. Add a bigger box (Battle of Legends, Cobble & Fog, Marvel, etc.).',
  errNotEnoughChars: (need, have) => `Need ${need} fighters, your sets only contain ${have}.`,
  rollAnnounce: (fighters, map) =>
    `Roll complete: ${fighters.join(', ')}${map ? ` on ${map}` : ''}.`,
  themeLight: 'Light theme',
  themeDark: 'Dark theme',
  stats: {
    nav: 'Stats',
    navArchive: 'Archive',
    title: 'Across every tournament',
    subtitle: (t, m) => `${t} tournament${t === 1 ? '' : 's'} · ${m} matches played`,
    empty: 'Nothing played yet',
    emptySub: 'Run a tournament and the numbers show up here.',
    headToHead: 'Head to head',
    tileTournaments: 'Tournaments',
    tileFinished: 'Finished',
    tileMatches: 'Matches',
    tileTitles: 'Titles',
    tileFirstTurn: 'Won going first',
    firstTurnNote: (n) => `over ${n} matches with a recorded first turn`,
    firstTurnUnknown: 'No first-turn data yet',
    fighters: 'Fighters',
    fightersNote: 'Sorted by wins, then by matches played.',
    boxes: 'Boxes',
    maps: 'Maps',
    colPlayed: 'Played',
    colWon: 'Won',
    colRate: 'Rate',
    showAll: (n) => `Show all ${n}`,
    showLess: 'Show less',
    data: 'Your data',
    dataNote: 'Everything lives in this browser only. Export a file to keep a copy or move it to another device.',
    exportBtn: 'Export file',
    importBtn: 'Import file',
    importConfirm: (n) => `Replace what is here with this file? It holds ${n} tournament${n === 1 ? '' : 's'}. This can be undone only by importing your current export, so take one first if in doubt.`,
    importDone: (n) => `Imported — ${n} tournament${n === 1 ? '' : 's'}.`,
    importErrUnreadable: "That file isn't readable as a backup.",
    importErrForeign: "That file isn't an Unmatched Picker export.",
    importErrVersion: 'That export comes from a different version.',
    archiveTitle: 'Archive',
    archiveEmpty: 'Archive is empty',
    archiveEmptySub: 'Finished tournaments land here when you start a new one.',
    archiveCurrent: 'Current',
    archiveFileIt: 'File it away',
    archiveFileConfirm: 'Move this tournament into the archive? The bracket stays readable there, and the board clears for a new draw.',
    archiveDelete: 'Delete',
    archiveDeleteConfirm: 'Delete this tournament from the archive for good? Its matches drop out of the stats.',
    archiveUnfinished: 'Unfinished',
    results: 'Results sheet',
    resultsTitle: 'Tournament results',
    resultsOf: (d) => d,
    resultsPrint: 'Print / save as PDF',
    resultsClose: 'Close',
    colMatch: 'Match',
    colMap: 'Map',
    colFirst: 'Opened',
    colWinner: 'Winner',
  },
  tour: {
    nav: 'Tournament',
    navRoll: 'Random roll',
    title: 'Tournament',
    setupTitle: 'Run a bracket.',
    setupSub: (f, s, m) => `${f} fighters from ${s} sets · ${m} maps in rotation`,
    setupMatches: (n) => `${n} matches, single elimination`,
    setupQualifier: (n) => `${n} qualifier ${n === 1 ? 'match' : 'matches'} first — the field isn't a power of two`,
    start: 'Draw the bracket',
    restart: 'New tournament',
    restartConfirm: 'Draw a new tournament? The current one moves to the archive first.',
    undoConfirm: (n) =>
      `This also clears ${n} later ${n === 1 ? 'match' : 'matches'} that followed from it. You can undo afterwards. Continue?`,
    undoBtn: 'Undo',
    redoBtn: 'Redo',
    undoTip: (l) => `Undo: ${l}  (⌘Z)`,
    redoTip: (l) => `Redo: ${l}  (⇧⌘Z)`,
    actWin: (f) => `win — ${f}`,
    actUndoMatch: 'cleared a result',
    actDraw: 'new draw',
    actReset: 'tournament reset',
    actEditMap: 'map changed',
    actEditSides: 'sides swapped',
    actEditFirst: 'first turn changed',
    safetyNote: 'Every action can be undone — nothing is lost by a stray tap.',
    progress: (p, t) => `${p} of ${t} matches played`,
    upcoming: 'Up next',
    upcomingEmpty: 'Nothing left to play.',
    bracket: 'Bracket',
    roundQualifier: 'Qualifier',
    roundFinal: 'Final',
    roundThird: 'Third place',
    podiumTitle: 'Final standings',
    place: (n) => ['', '1st', '2nd', '3rd'][n] ?? `${n}th`,
    playedBy: (name) => `played by ${name}`,
    plays: 'plays',
    wins: 'Won',
    undo: 'Undo',
    champion: 'Champion',
    vs: 'vs',
    tbd: 'TBD',
    scoreboard: 'Head to head',
    goesFirst: 'Goes first',
    goesFirstShort: '1st',
    edit: 'Edit',
    editTitle: 'Match settings',
    editPairFixed: 'The bracket fixes who meets whom. Everything else is yours to change.',
    editMapLabel: 'Map',
    editSidesLabel: 'Who plays whom',
    editFirstLabel: 'Who goes first',
    editSwap: 'Swap fighters',
    editOwnBox: "one of the fighters' own box",
    editResult: 'Result',
    editClearResult: 'Clear result',
    editWonNote: (fighter, player) => `${fighter} won — the point goes to ${player}.`,
    editClose: 'Done',
    errNoFighters: 'Need at least 4 fighters — pick more sets first.',
    errNoMaps: 'No maps in the selected sets — a tournament needs at least one.',
    matchN: (round, n) => `${round} · match ${n}`,
  },
  footerDisclaimer:
    'A fan project — not affiliated with or endorsed by Restoration Games. All set, fighter, and map names and artwork are property of their respective rights holders. Images are hotlinked from public sources for identification only; this tool is non-commercial and ad-free.',
  bannerNotice:
    'Fan project — not affiliated with Restoration Games. Artwork shown for identification.',
  bannerDismiss: 'Got it',
  footerSource: 'Source',
  footerAuthor: 'Артем Сапрыкин',
  share: 'Copy link',
  shareCopied: 'Link copied',
  shareFailed: 'Could not copy — try again',
  lock: 'Lock — keep on Reroll all',
  unlock: 'Unlock',
  history: 'History',
  historyTitle: 'Roll history',
  historyEmpty: 'No rolls yet.',
  historyEmptySub: 'Past rolls will appear here as you play.',
  historyClear: 'Clear history',
  historyClearConfirm: 'Clear all history?',
  historyClose: 'Close',
  historyRestore: 'Restore',
  justNow: 'just now',
  minAgo: (n) => `${n}m ago`,
  hourAgo: (n) => `${n}h ago`,
  dayAgo: (n) => `${n}d ago`,
};

/** Russian count forms: 1 матч, 2 матча, 5 матчей. */
function plural(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
  return many;
}

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
  quadSub: 'Дабл',
  ffa: '/ffa',
  ffaSub: '4 игрока',
  roll: 'Бросить',
  rerollAll: 'Перебросить всё',
  rerollMap: 'Перебросить поле',
  rerollFighter: 'Перебросить',
  resultMeta: (m) => (m === 'duo' ? '1×1 — 2 бойца · 1 поле' : m === 'quad' ? 'Дабл — 2 игрока · по 2 бойца · 1 поле' : '4 игрока, каждый сам за себя · 1 поле'),
  mapLabel: 'Поле',
  playerN: (n) => `Игрок ${n}`,
  emptyTitle: 'Сначала выберите наборы.',
  emptySub: 'Отметьте свои коробки выше — и бросайте.',
  readyTitle: 'Готово к раздаче.',
  readySub: 'Выбери режим ниже и нажми «Бросить».',
  customizeSets: 'Настроить',
  manageSets: 'Наборы',
  ownSetOn: 'У меня есть этот набор',
  ownSetOff: 'У меня нет этого набора',
  fightersHeader: 'Бойцы',
  mapsHeader: 'Поля',
  fightersIncluded: (n, total) => `${n} из ${total} в пуле`,
  errNoSets: 'Не выбрано ни одного набора. Отметьте хотя бы один.',
  errNoMaps: 'В выбранных наборах нет полей. Добавьте набор с полем.',
  errNoQuadMaps: 'Ни в одном из выбранных наборов нет полей для 4 игроков. Добавьте крупный набор (Битва легенд, Булыжники и туман, Marvel и т.д.).',
  errNotEnoughChars: (need, have) => `Нужно ${need} бойцов, в наборах их только ${have}.`,
  rollAnnounce: (fighters, map) =>
    `Бросок: ${fighters.join(', ')}${map ? ` на ${map}` : ''}.`,
  themeLight: 'Светлая тема',
  themeDark: 'Тёмная тема',
  stats: {
    nav: 'Статистика',
    navArchive: 'Архив',
    title: 'За все турниры',
    subtitle: (t, m) => `${t} ${plural(t, 'турнир', 'турнира', 'турниров')} · сыграно ${m} ${plural(m, 'матч', 'матча', 'матчей')}`,
    empty: 'Пока ничего не сыграно',
    emptySub: 'Проведи турнир — и здесь появятся цифры.',
    headToHead: 'Личный счёт',
    tileTournaments: 'Турниров',
    tileFinished: 'Доиграно',
    tileMatches: 'Матчей',
    tileTitles: 'Титулов',
    tileFirstTurn: 'Побед с первого хода',
    firstTurnNote: (n) => `по ${n} матчам, где известен первый ход`,
    firstTurnUnknown: 'Данных о первом ходе пока нет',
    fighters: 'Бойцы',
    fightersNote: 'Сортировка по победам, при равенстве — по числу матчей.',
    boxes: 'Коробки',
    maps: 'Карты',
    colPlayed: 'Матчей',
    colWon: 'Побед',
    colRate: 'Винрейт',
    showAll: (n) => `Показать все ${n}`,
    showLess: 'Свернуть',
    data: 'Твои данные',
    dataNote: 'Всё хранится только в этом браузере. Выгрузи файл, чтобы иметь копию или перенести на другое устройство.',
    exportBtn: 'Выгрузить файл',
    importBtn: 'Загрузить файл',
    importConfirm: (n) => `Заменить всё, что здесь есть, содержимым файла? В нём ${n} ${plural(n, 'турнир', 'турнира', 'турниров')}. Откатить это можно будет только импортом текущей выгрузки — если сомневаешься, сделай её сначала.`,
    importDone: (n) => `Загружено — турниров: ${n}.`,
    importErrUnreadable: 'Файл не читается как резервная копия.',
    importErrForeign: 'Это не выгрузка Unmatched Picker.',
    importErrVersion: 'Выгрузка из другой версии.',
    archiveTitle: 'Архив',
    archiveEmpty: 'В архиве пусто',
    archiveEmptySub: 'Завершённые турниры попадут сюда, когда начнёшь новый.',
    archiveCurrent: 'Текущий',
    archiveFileIt: 'Убрать в архив',
    archiveFileConfirm: 'Убрать этот турнир в архив? Сетка останется доступной там, а поле освободится под новую жеребьёвку.',
    archiveDelete: 'Удалить',
    archiveDeleteConfirm: 'Удалить турнир из архива насовсем? Его матчи выпадут из статистики.',
    archiveUnfinished: 'Не доигран',
    results: 'Красивые итоги',
    resultsTitle: 'Итоги турнира',
    resultsOf: (d) => d,
    resultsPrint: 'Печать / сохранить PDF',
    resultsClose: 'Закрыть',
    colMatch: 'Матч',
    colMap: 'Карта',
    colFirst: 'Первый ход',
    colWinner: 'Победа',
  },
  tour: {
    nav: 'Турнир',
    navRoll: 'Случайный бросок',
    title: 'Турнир',
    setupTitle: 'Собрать сетку.',
    setupSub: (f, s, m) => `${f} бойцов из ${s} наборов · ${m} карт в ротации`,
    setupMatches: (n) => `${n} матчей, на вылет`,
    setupQualifier: (n) =>
      `Сначала ${n} ${plural(n, 'матч', 'матча', 'матчей')} квалификации — участников не степень двойки`,
    start: 'Провести жеребьёвку',
    restart: 'Новый турнир',
    restartConfirm: 'Провести новую жеребьёвку? Текущий турнир сначала уедет в архив.',
    undoConfirm: (n) =>
      `Сбросит ещё ${n} ${plural(n, 'сыгранный матч', 'сыгранных матча', 'сыгранных матчей')} ниже по сетке. Это тоже можно будет отменить. Продолжить?`,
    undoBtn: 'Отменить',
    redoBtn: 'Вернуть',
    undoTip: (l) => `Отменить: ${l}  (⌘Z)`,
    redoTip: (l) => `Вернуть: ${l}  (⇧⌘Z)`,
    actWin: (f) => `победа — ${f}`,
    actUndoMatch: 'сброс результата',
    actDraw: 'новая жеребьёвка',
    actReset: 'сброс турнира',
    actEditMap: 'смена карты',
    actEditSides: 'обмен персонажами',
    actEditFirst: 'смена первого хода',
    safetyNote: 'Любое действие можно отменить — случайный тык ничего не сломает.',
    progress: (p, t) => `Сыграно ${p} из ${t} матчей`,
    upcoming: 'Ближайшие матчи',
    upcomingEmpty: 'Играть нечего — сетка пройдена.',
    bracket: 'Сетка',
    roundQualifier: 'Квалификация',
    roundFinal: 'Финал',
    roundThird: 'За третье место',
    podiumTitle: 'Итоги турнира',
    place: (n) => `${n}-е место`,
    playedBy: (name) => `игрок: ${name}`,
    plays: 'играет за',
    wins: 'Победа',
    undo: 'Отменить',
    champion: 'Чемпион',
    vs: 'против',
    tbd: 'Ждём',
    scoreboard: 'Личный счёт',
    goesFirst: 'Ходит первым',
    goesFirstShort: '1-й',
    edit: 'Изменить',
    editTitle: 'Условия матча',
    editPairFixed: 'Кто с кем играет — задаёт сетка. Всё остальное можно менять.',
    editMapLabel: 'Карта',
    editSidesLabel: 'Кто за кого',
    editFirstLabel: 'Кто ходит первым',
    editSwap: 'Поменяться персонажами',
    editOwnBox: 'родная коробка одного из бойцов',
    editResult: 'Результат',
    editClearResult: 'Сбросить результат',
    editWonNote: (fighter, player) => `Победа: ${fighter}. Очко: ${player}.`,
    editClose: 'Готово',
    errNoFighters: 'Нужно минимум 4 бойца — отметь больше наборов.',
    errNoMaps: 'В выбранных наборах нет карт — для турнира нужна хотя бы одна.',
    matchN: (round, n) => `${round} · матч ${n}`,
  },
  footerDisclaimer:
    'Фан-проект — не аффилирован с Restoration Games. Названия наборов, бойцов, карт и иллюстрации принадлежат правообладателям. Изображения подгружаются с публичных источников для идентификации; проект некоммерческий, без рекламы.',
  bannerNotice:
    'Фан-проект — не аффилирован с Restoration Games. Изображения показаны для идентификации.',
  bannerDismiss: 'Понятно',
  footerSource: 'Исходники',
  footerAuthor: 'Артем Сапрыкин',
  share: 'Скопировать ссылку',
  shareCopied: 'Ссылка скопирована',
  shareFailed: 'Не удалось скопировать — попробуй ещё',
  lock: 'Закрепить — не менять при «Перебросить всё»',
  unlock: 'Открепить',
  history: 'История',
  historyTitle: 'История бросков',
  historyEmpty: 'Бросков ещё не было.',
  historyEmptySub: 'Здесь появятся прошлые броски.',
  historyClear: 'Очистить историю',
  historyClearConfirm: 'Очистить всю историю?',
  historyClose: 'Закрыть',
  historyRestore: 'Восстановить',
  justNow: 'только что',
  minAgo: (n) => `${n} мин назад`,
  hourAgo: (n) => `${n} ч назад`,
  dayAgo: (n) => `${n} д назад`,
};

const TABLE: Record<Lang, Strings> = { en, ru };

export function t(lang: Lang): Strings {
  return TABLE[lang];
}
