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
  // restorationgames.com HeroCollage renders — gray factory mini + dial + card
  bol1: [
    'https://restorationgames.com/wp-content/uploads/2019/07/Medusa-collage.png',
    'https://restorationgames.com/wp-content/uploads/2019/07/Sinbad-collage.png',
    'https://restorationgames.com/wp-content/uploads/2019/07/Alice-collage.png',
    'https://restorationgames.com/wp-content/uploads/2019/07/Arthur-collage.png',
  ],
  bol2: [
    'https://restorationgames.com/wp-content/uploads/2021/11/Sun-Wukong-Collage.png',
    'https://restorationgames.com/wp-content/uploads/2021/11/Yennenga-Collage.png',
    'https://restorationgames.com/wp-content/uploads/2021/11/Bloody-Mary-Collage.png',
    'https://restorationgames.com/wp-content/uploads/2021/11/Achilles-Collage.png',
  ],
  // robin: publisher-tagged BGG image (same group shot for both fighters)
  robin: [
    'https://cf.geekdo-images.com/k9pibtPAOT-R602xoN-YBw__large/img/6JO_-1smseMGSeMl8R4F7acADYk=/fit-in/1024x1024/filters:no_upscale():strip_icc()/pic4621590.png',
    'https://cf.geekdo-images.com/k9pibtPAOT-R602xoN-YBw__large/img/6JO_-1smseMGSeMl8R4F7acADYk=/fit-in/1024x1024/filters:no_upscale():strip_icc()/pic4621590.png',
  ],
  houdini: [
    'https://restorationgames.com/wp-content/uploads/2022/09/RG_Website_UM-HvtG_Collage2.png',
    'https://restorationgames.com/wp-content/uploads/2022/09/RG_Website_UM-HvtG_Collage1.png',
  ],
  lrrh: [
    'https://restorationgames.com/wp-content/uploads/2020/11/UM-LRRHvB-Little-Red.png',
    'https://restorationgames.com/wp-content/uploads/2020/11/UM-LRRHvB-Beowulf.png',
  ],
  japan: [
    'https://restorationgames.com/wp-content/uploads/2024/01/UM_SO_HeroCollage-Oda-Transparent_900x900.png',
    'https://restorationgames.com/wp-content/uploads/2024/01/UM_SO_HeroCollage-Tomoe-Transparent_900x900.png',
  ],
  ali_lee: [
    'https://restorationgames.com/wp-content/uploads/2025/08/UM-LeeAli_HeroCollage-Ali.png',
    'https://restorationgames.com/wp-content/uploads/2025/08/UM-LeeAli_HeroCollage-Lee.png',
  ],
  slings: [
    'https://restorationgames.com/wp-content/uploads/2024/03/UM_SaA_HeroCollage_Shakespeare-900x900.png',
    'https://restorationgames.com/wp-content/uploads/2024/03/UM_SaA_HeroCollage_Titania.png',
    'https://restorationgames.com/wp-content/uploads/2024/03/UM_SaA_HeroCollage_Hamlet.png',
    'https://restorationgames.com/wp-content/uploads/2024/03/UM_SaA_HeroCollage_Sisters.png',
  ],
  // tales: publisher render on white background (clean shot, no dial/card)
  tales: [
    'https://restorationgames.com/wp-content/uploads/2023/09/UM_Adv_AnnieChristmas-900x1325.jpg',
    'https://restorationgames.com/wp-content/uploads/2023/09/UM_Adv_JillTrent-900x1270.jpg',
    'https://restorationgames.com/wp-content/uploads/2023/09/UM_Adv_GoldenBat-900x1418.jpg',
    'https://restorationgames.com/wp-content/uploads/2023/09/UM_Adv_Tesla-900x1237.jpg',
  ],
  // buffy: single Mondoshop group photo, reused for all 4 fighters
  buffy: [
    'https://cdn.shopify.com/s/files/1/0558/2081/products/Unmatched_Buffy_B.png',
    'https://cdn.shopify.com/s/files/1/0558/2081/products/Unmatched_Buffy_B.png',
    'https://cdn.shopify.com/s/files/1/0558/2081/products/Unmatched_Buffy_B.png',
    'https://cdn.shopify.com/s/files/1/0558/2081/products/Unmatched_Buffy_B.png',
  ],
  tmnt: [
    'https://restorationgames.com/wp-content/uploads/2024/12/TMNT_HeroCollage-leonardo.png',
    'https://restorationgames.com/wp-content/uploads/2024/12/TMNT_HeroCollage-Donatello.png',
    'https://restorationgames.com/wp-content/uploads/2024/12/TMNT_HeroCollage-michelangelo.png',
    'https://restorationgames.com/wp-content/uploads/2024/12/TMNT_HeroCollage-Raphael.png',
    'https://restorationgames.com/wp-content/uploads/2024/12/TMNT_HeroCollage-shredder.png',
  ],
  // jp_ingen: single Mondoshop group photo reused
  jp_ingen: [
    'https://cdn.shopify.com/s/files/1/0558/2081/products/05-JurassicPark.jpg',
    'https://cdn.shopify.com/s/files/1/0558/2081/products/05-JurassicPark.jpg',
  ],
  // jp_trex: this line ships pre-painted from the factory (per publisher)
  jp_trex: [
    'https://cf.geekdo-images.com/Tcugo8_JCT7FBwzwwQT0mA__large/img/XjJXUsoCXq5QtEQt_qSAsZ1ArJI=/fit-in/1024x1024/filters:no_upscale():strip_icc()/pic6856039.jpg',
    'https://cf.geekdo-images.com/Tcugo8_JCT7FBwzwwQT0mA__large/img/XjJXUsoCXq5QtEQt_qSAsZ1ArJI=/fit-in/1024x1024/filters:no_upscale():strip_icc()/pic6856039.jpg',
  ],
  witcher1: [
    'https://restorationgames.com/wp-content/uploads/2024/10/um_witcher_ss_collage_geralt.jpg',
    'https://restorationgames.com/wp-content/uploads/2024/11/um_witcher_ss_collage_leshen.jpg',
    'https://restorationgames.com/wp-content/uploads/2024/10/um_witcher_ss_collage_ciri.jpg',
  ],
  witcher2: [
    'https://restorationgames.com/wp-content/uploads/2024/11/um_witcher_rf_collage_YenneferTriss.jpg',
    'https://restorationgames.com/wp-content/uploads/2024/11/um_witcher_rf_collage_Philippa.jpg',
    'https://restorationgames.com/wp-content/uploads/2024/11/um_witcher_rf_collage_Eredin.jpg',
  ],
  deadpool: [
    'https://cf.geekdo-images.com/tQ7sLhLk1-n-y3od9Ghz0A__large/img/qjv9pwUecbvfbaF6zwX7unF9Tys=/fit-in/1024x1024/filters:no_upscale():strip_icc()/pic6086616.png',
  ],
  // No verified publisher photos found yet: bol3, cobble, marvel_rr, marvel_hk,
  // marvel_ts, marvel_kc, marvel_bb. UI falls back to typography for those.
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
