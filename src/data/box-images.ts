/**
 * Box-cover images per set, per language.
 * English URLs are hotlinked from BoardGameGeek's CDN (their standard public
 * catalogue images, used for game discovery).
 * Russian URLs are hotlinked from gaga.ru's product catalogue where the set
 * has an official Russian-language localisation.
 *
 * If no Russian URL exists, the helper falls back to the English cover.
 */

import type { Lang } from '../types';

type LangMap = { en: string; ru?: string };

export const BOX_IMAGES: Record<string, LangMap> = {
  bol1:      { en: 'https://cf.geekdo-images.com/4AlLbprNustr9G7pbkGRuw__itemrep@2x/img/kXRoA2ldUqPG0gkF_CQkldwMYf8=/fit-in/492x600/filters:strip_icc()/pic4621579.jpg' },
  bol2:      { en: 'https://cf.geekdo-images.com/_N9ueJu-Vaq656p7HSI9sw__itemrep@2x/img/GVyEbOw63bwuZe9ym6VUa45aK74=/fit-in/492x600/filters:strip_icc()/pic6267930.jpg' },
  bol3:      { en: 'https://cf.geekdo-images.com/L1IaHLvM_Ii0IvixFFZm8g__itemrep@2x/img/Vv302ZE7LVkZeeKNYvZd3BxfaRU=/fit-in/492x600/filters:strip_icc()/pic8721897.jpg' },
  robin:     { en: 'https://cf.geekdo-images.com/5Fr8QPIazZRgEMnN2bwJ0g__itemrep@2x/img/-FpyDyX1iino4iGX6YQIMhhuOLY=/fit-in/492x600/filters:strip_icc()/pic4621589.jpg' },
  houdini:   { en: 'https://cf.geekdo-images.com/hKve9gkleO4Kp9T1vnJVEg__itemrep@2x/img/8StGpGr_YloHomu4B4w4ENgv18Q=/fit-in/492x600/filters:strip_icc()/pic6918007.jpg' },
  lrrh:      { en: 'https://cf.geekdo-images.com/7CFgBadtCNf5Mzi1nsrL2Q__itemrep@2x/img/xbR152vmWGnadUDvpiihIdG63O0=/fit-in/492x600/filters:strip_icc()/pic5822480.jpg' },
  japan:     { en: 'https://cf.geekdo-images.com/i7n6LkRIskDq1438AgO0VA__itemrep@2x/img/y_-04FPhGBJ6P1T2IALvGwBxvlg=/fit-in/492x600/filters:strip_icc()/pic7437242.jpg' },
  ali_lee:   { en: 'https://cf.geekdo-images.com/0cKAx_d2KTNWMktH0EKmzg__itemrep@2x/img/YV4x-EDSiAmDD1sAVVT4GBvVwiY=/fit-in/492x600/filters:strip_icc()/pic9258569.jpg' },
  cobble:    { en: 'https://cf.geekdo-images.com/iyIO6udRfIn0xM1rIxyO2g__itemrep@2x/img/IT_g0b10F0L-SaIpKaCy-Cu36kM=/fit-in/492x600/filters:strip_icc()/pic5056685.jpg' },
  slings:    { en: 'https://cf.geekdo-images.com/Xwf7MpziRPWrrY6ZPxU-Mg__itemrep@2x/img/s_mCZ9YCe7ftv9sQv6rEJr2LRuY=/fit-in/492x600/filters:strip_icc()/pic8074963.jpg' },
  tales:     { en: 'https://cf.geekdo-images.com/pDiHT-n1xpW71Ck_wiR8_g__itemrep@2x/img/GqAGWo7pROxmDMv-JJIpKl9jYOg=/fit-in/492x600/filters:strip_icc()/pic7375477.png' },
  buffy:     { en: 'https://cf.geekdo-images.com/rSsFqioXQFqfTBE0XW9Eyw__itemrep@2x/img/Vs72jIyRGUvcEIR0K_F92kc2o7s=/fit-in/492x600/filters:strip_icc()/pic5549274.jpg' },
  tmnt:      { en: 'https://cf.geekdo-images.com/MInoTd4lhv0tBwTePOZ3DQ__itemrep@2x/img/SOWJFizrb_6LroMLCJsw7tSNdnU=/fit-in/492x600/filters:strip_icc()/pic9553060.jpg' },
  jp_ingen:  { en: 'https://cf.geekdo-images.com/qCMsj-DHIvGcynErPfiClQ__itemrep@2x/img/J_XVGiw6PV1cBx9FeBLwWRRIAo8=/fit-in/492x600/filters:strip_icc()/pic4854152.jpg' },
  jp_trex:   { en: 'https://cf.geekdo-images.com/S1WeubXem2VgJHfCkkcQgA__itemrep@2x/img/XZdICegG7NIF2Szs5E74340i20Y=/fit-in/492x600/filters:strip_icc()/pic6838081.png' },
  witcher1:  { en: 'https://cf.geekdo-images.com/Vjy4oPIY0knUxVWoKt6o4g__itemrep@2x/img/3cldIswAbAPSqUPwlSBV60WoXOQ=/fit-in/492x600/filters:strip_icc()/pic8419480.jpg' },
  witcher2:  { en: 'https://cf.geekdo-images.com/TksQfRZfS3cVO5qO7kTNsw__itemrep@2x/img/tOPjfgNy_ozElddzQQ0YvPOpvmk=/fit-in/492x600/filters:strip_icc()/pic8419452.jpg' },
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
