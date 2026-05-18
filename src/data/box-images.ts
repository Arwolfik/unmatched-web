/**
 * Box-cover, miniature, and playmat photos per set.
 *
 * - BOX_IMAGES: official box covers per language. English from BGG, Russian
 *   from gaga.ru where the set has a Russian localisation. Used in the set
 *   inventory list.
 * - MINI_IMAGES: photos of the physical miniatures, index-aligned with each
 *   set's `characters` array. Used on fighter result cards.
 * - MAP_IMAGES: photos of the physical playmats / battle maps, index-aligned
 *   with each set's `maps` array. Used on the map result card.
 *
 * All URLs are hotlinked from public product-photography sources (BGG game
 * pages, publisher catalogues). No language variants for minis or maps — the
 * physical product looks the same regardless of localisation.
 */

import type { Lang } from '../types';

type LangMap = { en: string; ru?: string };

export const BOX_IMAGES: Record<string, LangMap> = {
  bol1: {
    en: 'https://cf.geekdo-images.com/4AlLbprNustr9G7pbkGRuw__itemrep@2x/img/kXRoA2ldUqPG0gkF_CQkldwMYf8=/fit-in/492x600/filters:strip_icc()/pic4621579.jpg',
    ru: 'https://gaga.ru/gaga/files/images/fullsize/5293/1.jpg',
  },
  bol2: {
    en: 'https://cf.geekdo-images.com/_N9ueJu-Vaq656p7HSI9sw__itemrep@2x/img/GVyEbOw63bwuZe9ym6VUa45aK74=/fit-in/492x600/filters:strip_icc()/pic6267930.jpg',
    ru: 'https://gaga.ru/gaga/files/images/main/6328.png',
  },
  bol3: {
    en: 'https://cf.geekdo-images.com/L1IaHLvM_Ii0IvixFFZm8g__itemrep@2x/img/Vv302ZE7LVkZeeKNYvZd3BxfaRU=/fit-in/492x600/filters:strip_icc()/pic8721897.jpg',
    ru: 'https://gaga.ru/gaga/files/images/fullsize/8024/1.jpg',
  },
  robin: {
    en: 'https://cf.geekdo-images.com/5Fr8QPIazZRgEMnN2bwJ0g__itemrep@2x/img/-FpyDyX1iino4iGX6YQIMhhuOLY=/fit-in/492x600/filters:strip_icc()/pic4621589.jpg',
    ru: 'https://gaga.ru/gaga/files/images/fullsize/3021/1.jpg',
  },
  houdini: {
    en: 'https://cf.geekdo-images.com/hKve9gkleO4Kp9T1vnJVEg__itemrep@2x/img/8StGpGr_YloHomu4B4w4ENgv18Q=/fit-in/492x600/filters:strip_icc()/pic6918007.jpg',
    ru: 'https://gaga.ru/gaga/files/images/fullsize/6536/1.jpg',
  },
  lrrh: {
    en: 'https://cf.geekdo-images.com/7CFgBadtCNf5Mzi1nsrL2Q__itemrep@2x/img/xbR152vmWGnadUDvpiihIdG63O0=/fit-in/492x600/filters:strip_icc()/pic5822480.jpg',
    ru: 'https://gaga.ru/gaga/files/images/fullsize/6352/1.jpg',
  },
  japan: {
    en: 'https://cf.geekdo-images.com/i7n6LkRIskDq1438AgO0VA__itemrep@2x/img/y_-04FPhGBJ6P1T2IALvGwBxvlg=/fit-in/492x600/filters:strip_icc()/pic7437242.jpg',
    ru: 'https://gaga.ru/gaga/files/images/fullsize/7303/1.jpg',
  },
  ali_lee:   { en: 'https://cf.geekdo-images.com/0cKAx_d2KTNWMktH0EKmzg__itemrep@2x/img/YV4x-EDSiAmDD1sAVVT4GBvVwiY=/fit-in/492x600/filters:strip_icc()/pic9258569.jpg' },
  cobble: {
    en: 'https://cf.geekdo-images.com/iyIO6udRfIn0xM1rIxyO2g__itemrep@2x/img/IT_g0b10F0L-SaIpKaCy-Cu36kM=/fit-in/492x600/filters:strip_icc()/pic5056685.jpg',
    ru: 'https://gaga.ru/gaga/files/images/fullsize/5741/1.jpg',
  },
  slings: {
    en: 'https://cf.geekdo-images.com/Xwf7MpziRPWrrY6ZPxU-Mg__itemrep@2x/img/s_mCZ9YCe7ftv9sQv6rEJr2LRuY=/fit-in/492x600/filters:strip_icc()/pic8074963.jpg',
    ru: 'https://gaga.ru/gaga/files/images/fullsize/7430/1.jpg',
  },
  tales: {
    en: 'https://cf.geekdo-images.com/pDiHT-n1xpW71Ck_wiR8_g__itemrep@2x/img/GqAGWo7pROxmDMv-JJIpKl9jYOg=/fit-in/492x600/filters:strip_icc()/pic7375477.png',
    ru: 'https://gaga.ru/gaga/files/images/fullsize/6885/1.jpg',
  },
  buffy:     { en: 'https://cf.geekdo-images.com/rSsFqioXQFqfTBE0XW9Eyw__itemrep@2x/img/Vs72jIyRGUvcEIR0K_F92kc2o7s=/fit-in/492x600/filters:strip_icc()/pic5549274.jpg' },
  tmnt:      { en: 'https://cf.geekdo-images.com/MInoTd4lhv0tBwTePOZ3DQ__itemrep@2x/img/SOWJFizrb_6LroMLCJsw7tSNdnU=/fit-in/492x600/filters:strip_icc()/pic9553060.jpg' },
  jp_ingen:  { en: 'https://cf.geekdo-images.com/qCMsj-DHIvGcynErPfiClQ__itemrep@2x/img/J_XVGiw6PV1cBx9FeBLwWRRIAo8=/fit-in/492x600/filters:strip_icc()/pic4854152.jpg' },
  jp_trex:   { en: 'https://cf.geekdo-images.com/S1WeubXem2VgJHfCkkcQgA__itemrep@2x/img/XZdICegG7NIF2Szs5E74340i20Y=/fit-in/492x600/filters:strip_icc()/pic6838081.png' },
  witcher1: {
    en: 'https://cf.geekdo-images.com/Vjy4oPIY0knUxVWoKt6o4g__itemrep@2x/img/3cldIswAbAPSqUPwlSBV60WoXOQ=/fit-in/492x600/filters:strip_icc()/pic8419480.jpg',
    ru: 'https://gaga.ru/gaga/files/images/fullsize/7787/1.jpg',
  },
  witcher2: {
    en: 'https://cf.geekdo-images.com/TksQfRZfS3cVO5qO7kTNsw__itemrep@2x/img/tOPjfgNy_ozElddzQQ0YvPOpvmk=/fit-in/492x600/filters:strip_icc()/pic8419452.jpg',
    ru: 'https://gaga.ru/gaga/files/images/main/7786.png',
  },
  marvel_rr: { en: 'https://cf.geekdo-images.com/XJMvbKMR47CvYkkXdjnjrw__itemrep@2x/img/fKqoN-XbNhkr4pRFHgqimu9uedk=/fit-in/492x600/filters:strip_icc()/pic5855222.jpg' },
  marvel_hk: { en: 'https://cf.geekdo-images.com/agYSj-3SR-qMvNeQZ08zLA__itemrep@2x/img/Feu9fyV-XLxIS4zieLPJZ95CYkA=/fit-in/492x600/filters:strip_icc()/pic5855220.jpg' },
  marvel_ts: { en: 'https://cf.geekdo-images.com/bknTHvLMqPTC4GxsMkYvAA__itemrep@2x/img/JWsC4bm3hHNJfD2AQuH9BEQcmbg=/fit-in/492x600/filters:strip_icc()/pic7248461.jpg' },
  marvel_kc: { en: 'https://cf.geekdo-images.com/g4M_mRTZooBmPq7z97M-jg__itemrep@2x/img/S3VThhVt8UAnsHRDKLpPoH14V3I=/fit-in/492x600/filters:strip_icc()/pic7091998.jpg' },
  marvel_bb: { en: 'https://cf.geekdo-images.com/mglq0PQqyQs0yRmPZCO8lA__itemrep@2x/img/Xim5Kwud1e8BIAvwn2AWwIjvtw8=/fit-in/492x600/filters:strip_icc()/pic7437241.jpg' },
  deadpool:  { en: 'https://cf.geekdo-images.com/H3Zv6hbRQnrvLax8YpNrVA__itemrep@2x/img/ahSGfj3Pj5adjEZ4WkT3rLRN-RE=/fit-in/492x600/filters:strip_icc()/pic6086605.jpg' },
};

export function getBoxImage(setId: string, lang: Lang): string | undefined {
  const m = BOX_IMAGES[setId];
  if (!m) return undefined;
  if (lang === 'ru' && m.ru) return m.ru;
  return m.en;
}

/**
 * Index-aligned with each set's `characters` array. Photos of the physical
 * miniatures from official publisher / manufacturer sources only — never
 * community paint-job photos.
 * Missing indices are `undefined` — UI gracefully falls back to typography.
 */
export const MINI_IMAGES: Record<string, (string | undefined)[]> = {
  // Cleared after first scrape pulled painted/hobbyist photos.
  // Awaiting a publisher-photo scrape from restorationgames.com / official sources.
};


/**
 * Index-aligned with each set's `maps` array. Playmat photos from BGG.
 */
export const MAP_IMAGES: Record<string, (string | undefined)[]> = {
  // Cleared after first scrape pulled fan-made 3D playmats — awaiting publisher photos.
};

export function getMiniImage(setId: string, idx: number): string | undefined {
  return MINI_IMAGES[setId]?.[idx];
}

export function getMapImage(setId: string, idx: number): string | undefined {
  return MAP_IMAGES[setId]?.[idx];
}
