import type { SetDef } from '../types';

export const SETS: SetDef[] = [
  // ── Battle of Legends ─────────────────────────────────────
  {
    id: 'bol1', code: 'BOL1',
    name: { en: 'Battle of Legends Vol. 1', ru: 'Битва легенд, том 1' },
    quad_map: true,
    characters: {
      en: ['Medusa', 'Sinbad', 'Alice', 'King Arthur'],
      ru: ['Медуза', 'Синдбад', 'Алиса', 'Король Артур'],
    },
    maps: {
      en: ['The Labyrinth', 'The Seven Seas'],
      ru: ['Лабиринт', 'Семь морей'],
    },
  },
  {
    id: 'bol2', code: 'BOL2',
    name: { en: 'Battle of Legends Vol. 2', ru: 'Битва легенд, том 2' },
    quad_map: true,
    characters: {
      en: ['Sun Wukong', 'Yennenga', 'Bloody Mary', 'Achilles'],
      ru: ['Сунь Укун', 'Йенненга', 'Кровавая Мэри', 'Ахиллес'],
    },
    maps: {
      en: ['Heavenly Palace'],
      ru: ['Небесный дворец'],
    },
  },
  {
    id: 'bol3', code: 'BOL3',
    name: { en: 'Battle of Legends Vol. 3', ru: 'Битва легенд, том 3' },
    quad_map: true,
    characters: {
      en: ['Blackbeard', 'Chupacabra', 'Pandora', 'Loki'],
      ru: ['Чёрная Борода', 'Чупакабра', 'Пандора', 'Локи'],
    },
    maps: {
      en: ["Santa's Workshop", 'Venice'],
      ru: ['Мастерская Санты', 'Венеция'],
    },
  },

  // ── Duel boxes (2 fighters) ───────────────────────────────
  {
    id: 'robin', code: 'RH',
    name: { en: 'Robin Hood vs. Bigfoot', ru: 'Робин Гуд против Снежного человека' },
    quad_map: false,
    characters: {
      en: ['Robin Hood', 'Bigfoot'],
      ru: ['Робин Гуд', 'Снежный человек'],
    },
    maps: { en: ['Sherwood Forest'], ru: ['Шервудский лес'] },
  },
  {
    id: 'houdini', code: 'HOU',
    name: { en: 'Houdini vs. The Genie', ru: 'Гудини против Джина' },
    quad_map: false,
    characters: { en: ['Houdini', 'The Genie'], ru: ['Гудини', 'Джин'] },
    maps: { en: ['The Theatre'], ru: ['Театр'] },
  },
  {
    id: 'lrrh', code: 'LRH',
    name: { en: 'Little Red Riding Hood vs. Beowulf', ru: 'Красная Шапочка против Беовульфа' },
    quad_map: false,
    characters: {
      en: ['Little Red Riding Hood', 'Beowulf'],
      ru: ['Красная Шапочка', 'Беовульф'],
    },
    maps: { en: ['Heorot Hall'], ru: ['Зал Хеорот'] },
  },
  {
    id: 'japan', code: 'JPN',
    name: { en: 'Oda Nobunaga & Tomoe', ru: 'Ода Набунага и Томоэ' },
    quad_map: false,
    characters: {
      en: ['Oda Nobunaga', 'Tomoe'],
      ru: ['Ода Набунага', 'Томоэ'],
    },
    maps: { en: ['Japan'], ru: ['Япония'] },
  },
  {
    id: 'ali_lee', code: 'ALI',
    name: { en: 'Muhammad Ali vs. Bruce Lee', ru: 'Мухаммед Али против Брюса Ли' },
    quad_map: false,
    characters: {
      en: ['Muhammad Ali', 'Bruce Lee'],
      ru: ['Мухаммед Али', 'Брюс Ли'],
    },
    maps: { en: [], ru: [] },
  },

  // ── 4-character boxes ─────────────────────────────────────
  {
    id: 'cobble', code: 'C&F',
    name: { en: 'Cobble & Fog', ru: 'Булыжники и туман' },
    quad_map: true,
    characters: {
      en: ['Sherlock Holmes', 'Jekyll & Hyde', 'The Invisible Man', 'Dracula'],
      ru: ['Шерлок Холмс', 'Джекил и Хайд', 'Человек-невидимка', 'Дракула'],
    },
    maps: {
      en: ['Baker Street Rooftops', 'The Manor (Passages)'],
      ru: ['Бейкер-стрит', 'Поместье с ходами'],
    },
  },
  {
    id: 'slings', code: 'S&A',
    name: { en: 'Slings & Arrows', ru: 'Пращи и стрелы' },
    quad_map: true,
    characters: {
      en: ['William Shakespeare', 'Titania', 'Hamlet', 'The Sisters'],
      ru: ['Уильям Шекспир', 'Титания', 'Гамлет', 'Сёстры'],
    },
    maps: { en: ['The Globe Theatre'], ru: ['Глобус'] },
  },
  {
    id: 'tales', code: 'TTA',
    name: { en: 'Tales to Amaze', ru: 'Удивительные истории' },
    quad_map: true,
    characters: {
      en: ['Annie Christmas', 'Jill Trent', 'Golden Bat', 'Nikola Tesla'],
      ru: ['Энни Кристмас', 'Джилл Трент', 'Золотая Летучая Мышь', 'Никола Тесла'],
    },
    maps: { en: [], ru: [] },
  },
  {
    id: 'buffy', code: 'BUF',
    name: { en: 'Buffy the Vampire Slayer', ru: 'Баффи — истребительница вампиров' },
    quad_map: true,
    characters: {
      en: ['Buffy', 'Willow', 'Angel', 'Spike'],
      ru: ['Баффи', 'Уиллоу', 'Эйнджел', 'Спайк'],
    },
    maps: { en: ['Sunnydale High', 'The Bronze'], ru: ['Школа Санндейла', 'Бронза'] },
  },
  {
    id: 'tmnt', code: 'TMNT',
    name: { en: 'Teenage Mutant Ninja Turtles', ru: 'Черепашки-ниндзя' },
    quad_map: true,
    characters: {
      en: ['Leonardo', 'Donatello', 'Michelangelo', 'Raphael', 'Shredder'],
      ru: ['Леонардо', 'Донателло', 'Микеланджело', 'Рафаэль', 'Шреддер'],
    },
    maps: { en: ['Big Apple', 'Technodrome'], ru: ['Большое Яблоко', 'Технодром'] },
  },

  // ── Jurassic Park ─────────────────────────────────────────
  {
    id: 'jp_ingen', code: 'JP1',
    name: { en: 'Jurassic Park: InGen vs. Raptors', ru: 'Парк Юрского периода: InGen против Рапторов' },
    quad_map: false,
    characters: {
      en: ['InGen Hunters', 'Velociraptors'],
      ru: ['Охотники InGen', 'Велоцирапторы'],
    },
    maps: { en: ['Raptor Paddock'], ru: ['Вольер с Рапторами'] },
  },
  {
    id: 'jp_trex', code: 'JP2',
    name: { en: 'Jurassic Park: Dr. Sattler vs. T. Rex', ru: 'Парк Юрского периода: Д-р Сэтлер против Ти-Рекса' },
    quad_map: false,
    characters: {
      en: ['Dr. Ellie Sattler', 'T. Rex'],
      ru: ['Д-р Элли Сэтлер', 'Тираннозавр Рекс'],
    },
    maps: { en: ['T. Rex Paddock'], ru: ['Вольер с Ти-Рексом'] },
  },

  // ── Witcher ──────────────────────────────────────────────
  {
    id: 'witcher1', code: 'WC1',
    name: { en: 'The Witcher: Steel & Silver', ru: 'Ведьмак: Сталь и Серебро' },
    quad_map: false,
    characters: {
      en: ['Geralt of Rivia', 'Ancient Leshen', 'Ciri'],
      ru: ['Геральт из Ривии', 'Древний Лесен', 'Цири'],
    },
    maps: { en: ['Farylund Forest', 'Kaer Morhen'], ru: ['Лес Фарилунд', 'Каэр Морхен'] },
  },
  {
    id: 'witcher2', code: 'WC2',
    name: { en: 'The Witcher: Realms Fall', ru: 'Ведьмак: Падение Королевств' },
    quad_map: false,
    characters: {
      en: ['Yennefer & Triss', 'Philippa Eilhart', 'Eredin'],
      ru: ['Йеннефер и Трисс', 'Филиппа Эйлхарт', 'Эредин'],
    },
    maps: { en: [], ru: [] },
  },

  // ── Marvel ───────────────────────────────────────────────
  {
    id: 'marvel_rr', code: 'MRR',
    name: { en: 'Marvel: Redemption Row', ru: 'Marvel: Путь Искупления' },
    quad_map: true,
    characters: {
      en: ['Luke Cage', 'Ghost Rider', 'Moon Knight'],
      ru: ['Люк Кейдж', 'Призрачный Гонщик', 'Лунный Рыцарь'],
    },
    maps: { en: ['The Raft'], ru: ['Тюрьма «Плот»'] },
  },
  {
    id: 'marvel_hk', code: 'MHK',
    name: { en: "Marvel: Hell's Kitchen", ru: 'Marvel: Адская Кухня' },
    quad_map: true,
    characters: {
      en: ['Daredevil', 'Elektra', 'Bullseye'],
      ru: ['Сорвиголова', 'Электра', 'Меткий Глаз'],
    },
    maps: { en: ["Hell's Kitchen"], ru: ['Адская Кухня'] },
  },
  {
    id: 'marvel_ts', code: 'MTS',
    name: { en: 'Marvel: Teen Spirit', ru: 'Marvel: Дух Молодости' },
    quad_map: true,
    characters: {
      en: ['Ms. Marvel', 'Squirrel Girl', 'Cloak & Dagger'],
      ru: ['Мисс Марвел', 'Девушка-белка', 'Плащ и Кинжал'],
    },
    maps: { en: ['Navy Pier'], ru: ['Военно-морской Пирс'] },
  },
  {
    id: 'marvel_kc', code: 'MKC',
    name: { en: 'Marvel: For King and Country', ru: 'Marvel: За Короля и Отечество' },
    quad_map: true,
    characters: {
      en: ['Black Widow', 'Black Panther', 'Winter Soldier'],
      ru: ['Чёрная Вдова', 'Чёрная Пантера', 'Зимний Солдат'],
    },
    maps: { en: ['Helicarrier'], ru: ['Хеликарриер'] },
  },
  {
    id: 'marvel_bb', code: 'MBB',
    name: { en: 'Marvel: Brains and Brawn', ru: 'Marvel: Разум и Сила' },
    quad_map: true,
    characters: {
      en: ['Spider-Man', 'Doctor Strange', 'She-Hulk'],
      ru: ['Человек-паук', 'Доктор Стрэндж', 'Женщина-Халк'],
    },
    maps: { en: ['Sanctum Sanctorum'], ru: ['Санктум Санкторум'] },
  },

  // ── Character packs ──────────────────────────────────────
  {
    id: 'deadpool', code: 'DP',
    name: { en: 'Deadpool', ru: 'Дэдпул' },
    quad_map: false,
    characters: { en: ['Deadpool'], ru: ['Дэдпул'] },
    maps: { en: [], ru: [] },
  },
];

export const SET_BY_ID = new Map(SETS.map((s) => [s.id, s]));
