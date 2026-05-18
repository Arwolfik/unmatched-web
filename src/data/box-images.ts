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
 * miniatures, hotlinked from BGG game-page galleries.
 * Missing indices are `undefined` — UI gracefully falls back to typography.
 */
export const MINI_IMAGES: Record<string, (string | undefined)[]> = {
  bol1: [
    'https://cf.geekdo-images.com/pRlG2rk7diYIxMRW-AH3pQ__large/img/jPXjwrjKEIHaBhr33lM58xnafG8=/fit-in/1024x1024/filters:no_upscale():strip_icc()/pic9370802.jpg',
    'https://cf.geekdo-images.com/JBCVB_gUcOL1w7vExt8OWQ__large/img/cuWTNcnRjz_-Cu7vEj6zeiSSsSs=/fit-in/1024x1024/filters:no_upscale():strip_icc()/pic9370803.jpg',
    'https://cf.geekdo-images.com/1AR5RZIRfWrz_yQt5-raEQ__large/img/LV8Jf_G5mCQbeC4msihRge9LF4Y=/fit-in/1024x1024/filters:no_upscale():strip_icc()/pic9370804.jpg',
    'https://cf.geekdo-images.com/Vj6iLYWriSX3ITJpWKJD5A__large/img/iIle6iewLb1vzkfZRmN1qsBpKxo=/fit-in/1024x1024/filters:no_upscale():strip_icc()/pic9370805.jpg',
  ],
  bol2: [
    'https://cf.geekdo-images.com/lZuQtDMu7Yp9prdi661GSQ__large/img/Q4SyZ7149U-detHVogAKcT8Ylzc=/fit-in/1024x1024/filters:no_upscale():strip_icc()/pic7931763.jpg',
    'https://cf.geekdo-images.com/ap-X0kHaiIH-b6Jo6i40xw__large/img/RZcgy7bR_oxPyoAkDOyNaFcZMlk=/fit-in/1024x1024/filters:no_upscale():strip_icc()/pic7880381.jpg',
    'https://cf.geekdo-images.com/2VH1V0RRFSb2QnNu3vXM8w__large/img/FNCIY5ZOsLMlxZiEupd5pKmoEOM=/fit-in/1024x1024/filters:no_upscale():strip_icc()/pic7931762.jpg',
    'https://cf.geekdo-images.com/XB7p4JP13EEEY1SE9aTR7Q__large/img/9dTHUjD_U-RdzqNtTtFufffm_pE=/fit-in/1024x1024/filters:no_upscale():strip_icc()/pic7931761.jpg',
  ],
  bol3: [
    'https://cf.geekdo-images.com/2o_ioPzv5Jb-oiBHP0ZTCw__large/img/12Fw1qndW18rzMeEbYr1FldMKXc=/fit-in/1024x1024/filters:no_upscale():strip_icc()/pic9200323.jpg',
    'https://cf.geekdo-images.com/1ekkA2kTCttMXa5x6sTk8g__large/img/tqVvECcLCOpZZEfxHcyKcWUAUdA=/fit-in/1024x1024/filters:no_upscale():strip_icc()/pic9200324.jpg',
    'https://cf.geekdo-images.com/ubv3idVVphyc6w1tTNLkyQ__large/img/pAdaD66UDnBNokTFv59OCpumoNc=/fit-in/1024x1024/filters:no_upscale():strip_icc()/pic9200326.jpg',
    'https://cf.geekdo-images.com/iA3zLpq0dmqAqE6sFK_wHQ__large/img/k84lYg9nQUklqEcbuHt381G0xCA=/fit-in/1024x1024/filters:no_upscale():strip_icc()/pic9200325.jpg',
  ],
  robin: [
    'https://cf.geekdo-images.com/1__7Jx_P6NPbPQLEf5DgcA__large/img/fOTHV5MKAJRPPJmmL82TmraYdRM=/fit-in/1024x1024/filters:no_upscale():strip_icc()/pic8469678.jpg',
    'https://cf.geekdo-images.com/1__7Jx_P6NPbPQLEf5DgcA__large/img/fOTHV5MKAJRPPJmmL82TmraYdRM=/fit-in/1024x1024/filters:no_upscale():strip_icc()/pic8469678.jpg',
  ],
  houdini: [
    'https://cf.geekdo-images.com/eaR-c2BNLWA_TWhzrWmCiw__large/img/EYoBvKFdCXiZiRBUTkoSyy-Wngo=/fit-in/1024x1024/filters:no_upscale():strip_icc()/pic8216109.png',
    'https://cf.geekdo-images.com/dsH6ErEqrf9V0SX1Xx2_Ag__large/img/usp2UVO1NSwMUMBzwF--g5SUMc4=/fit-in/1024x1024/filters:no_upscale():strip_icc()/pic8216105.png',
  ],
  lrrh: [
    'https://cf.geekdo-images.com/dcPDVydM9tn7_IRk2rdDQg__large/img/e3mQ8Pag73Ac7hjWlGFaZWS6xMs=/fit-in/1024x1024/filters:no_upscale():strip_icc()/pic7465590.jpg',
    'https://cf.geekdo-images.com/dcPDVydM9tn7_IRk2rdDQg__large/img/e3mQ8Pag73Ac7hjWlGFaZWS6xMs=/fit-in/1024x1024/filters:no_upscale():strip_icc()/pic7465590.jpg',
  ],
  japan: [
    'https://cf.geekdo-images.com/M8a_pyr6nqy6ceeGPjBDJQ__large/img/XHzQ6h7zQCOKMFitMFkqgKFqqX8=/fit-in/1024x1024/filters:no_upscale():strip_icc()/pic8350409.jpg',
    'https://cf.geekdo-images.com/WXHSFAHzxI-45hZAqsrKpg__large/img/fxftIFejPnRcrnOAODIhogNYbUg=/fit-in/1024x1024/filters:no_upscale():strip_icc()/pic8350411.jpg',
  ],
  ali_lee: [
    'https://cf.geekdo-images.com/8rDuElvSz8ELIzS3pNCQTg__large/img/3dlNdes82IG6nfakzfMMeMLrBuY=/fit-in/1024x1024/filters:no_upscale():strip_icc()/pic9474861.jpg',
    'https://cf.geekdo-images.com/LJCqqjn81cjTm-muV7V95g__large/img/8DVklsqjkiomTUKDF2ryFkbiO7k=/fit-in/1024x1024/filters:no_upscale():strip_icc()/pic9474860.jpg',
  ],
  cobble: [
    'https://cf.geekdo-images.com/NjrQkJfmUHHQG0Q6LhwYiw__large/img/O2lmhpKk_0Nw3TNoyn-IcTwIM5w=/fit-in/1024x1024/filters:no_upscale():strip_icc()/pic5503448.jpg',
    'https://cf.geekdo-images.com/mGXY9UHOUVVPDEqKxZxf-A__large/img/yJy1lCBlgc2r7oo0AxgYHcaa_aM=/fit-in/1024x1024/filters:no_upscale():strip_icc()/pic5503451.jpg',
    'https://cf.geekdo-images.com/Kfr00eh6w8Uz8qMdsqYbyg__large/img/VCHXOF_U4H7lGZZCMn9gaync3D8=/fit-in/1024x1024/filters:no_upscale():strip_icc()/pic5503446.jpg',
    'https://cf.geekdo-images.com/1CRoOL8o_5CIufeTmftmJA__large/img/aIAqa3ga5IfXf9NX91dFmFLgphA=/fit-in/1024x1024/filters:no_upscale():strip_icc()/pic5503450.jpg',
  ],
  slings: [
    'https://cf.geekdo-images.com/HQflnGALCPiF4M4-1fDblA__large/img/Xy1OmJMtEFj6ygx5cvY9Qt-kuGI=/fit-in/1024x1024/filters:no_upscale():strip_icc()/pic8090545.jpg',
    'https://cf.geekdo-images.com/JyII5IC9FUksbWNJV6BzaQ__large/img/0hIBrc79jgIQuxcEQNGk9DAC67Q=/fit-in/1024x1024/filters:no_upscale():strip_icc()/pic8473348.jpg',
    undefined,
    undefined,
  ],
  buffy: [
    'https://cf.geekdo-images.com/66sucwSItPUL8AnmIbs4HA__large/img/4h4nNuuOliHjFe3SQ7HoFJvOP18=/fit-in/1024x1024/filters:no_upscale():strip_icc()/pic8452736.jpg',
    'https://cf.geekdo-images.com/RuLZnhKyoZdrcu9KeOp0TA__large/img/xZKGV8y3OMEjRQHJlVWXS9gCmOA=/fit-in/1024x1024/filters:no_upscale():strip_icc()/pic8452739.jpg',
    'https://cf.geekdo-images.com/qqPsNz59f6XJqPmFWVPs0g__large/img/yEn1g49rZ1f-zOVdBGxdxDOQCP0=/fit-in/1024x1024/filters:no_upscale():strip_icc()/pic8452738.jpg',
    'https://cf.geekdo-images.com/O4WRlfsjATAKT3przCMOPQ__large/img/5O5F8f_GFtI7KXC90mDYt7xDiyg=/fit-in/1024x1024/filters:no_upscale():strip_icc()/pic8452737.jpg',
  ],
  tmnt: [
    'https://cf.geekdo-images.com/8VlpF-oGWDQAmHbmU5ZfVA__large/img/Jc4BJll32LlJg0R29GiyR2v1Zrc=/fit-in/1024x1024/filters:no_upscale():strip_icc()/pic9385227.jpg',
    'https://cf.geekdo-images.com/LDGSVsF-MZ-t2D014GlNUw__large/img/Jy0rftd_-qDSCqPvcGeVyDn2Edg=/fit-in/1024x1024/filters:no_upscale():strip_icc()/pic9385226.jpg',
    'https://cf.geekdo-images.com/FA-5sr8j_XrmsFJIp2cKDw__large/img/Cqo8_BTtssJy9QE9yP_U8EI_zRI=/fit-in/1024x1024/filters:no_upscale():strip_icc()/pic9385228.jpg',
    'https://cf.geekdo-images.com/3L74wHdUd5Kl4SLonOkl5Q__large/img/-TPOFrROz_4ScoT0z-_aj0qA4jw=/fit-in/1024x1024/filters:no_upscale():strip_icc()/pic9385229.jpg',
    'https://cf.geekdo-images.com/SESo45J8RxXP50Wg5Ir4Sw__large/img/mM3w7KfWZvG6LDfzQiL1o0wb-Ho=/fit-in/1024x1024/filters:no_upscale():strip_icc()/pic9385225.jpg',
  ],
  jp_ingen: [
    undefined,
    'https://cf.geekdo-images.com/sLpWj0O1Ex7vF1UYxvpL8g__large/img/06f9m7AsEETPxwi0q7z56nuCqUc=/fit-in/1024x1024/filters:no_upscale():strip_icc()/pic8107023.jpg',
  ],
  jp_trex: [
    'https://cf.geekdo-images.com/jc_ukIPuohCWULbbQHYwcg__large/img/DL8vLoTmAV04Hff2ZL579DGvpSI=/fit-in/1024x1024/filters:no_upscale():strip_icc()/pic8013556.jpg',
    'https://cf.geekdo-images.com/yT-K9C6xCrImc5SRSufT7A__large/img/lwToF-AJpfJGuCPnWHWN271T36Q=/fit-in/1024x1024/filters:no_upscale():strip_icc()/pic8013557.jpg',
  ],
  witcher1: [
    'https://cf.geekdo-images.com/K7QkhAexfAFqVFpgGKoasw__large/img/RVlESbcJq916Rjc1rwPa0L-pByU=/fit-in/1024x1024/filters:no_upscale():strip_icc()/pic9458709.jpg',
    undefined,
    'https://cf.geekdo-images.com/Q75Y-V2QnD02D9hADYN_rA__large/img/jPygCBt-u1zIXvnke9OCod_zHp0=/fit-in/1024x1024/filters:no_upscale():strip_icc()/pic9200329.jpg',
  ],
  witcher2: [
    'https://cf.geekdo-images.com/R9cq9ZkVE-ehxGf8oq3sHg__large/img/skJfo-mRIYryAK2Z9vWi5hFBEuc=/fit-in/1024x1024/filters:no_upscale():strip_icc()/pic8587298.jpg',
    'https://cf.geekdo-images.com/R9cq9ZkVE-ehxGf8oq3sHg__large/img/skJfo-mRIYryAK2Z9vWi5hFBEuc=/fit-in/1024x1024/filters:no_upscale():strip_icc()/pic8587298.jpg',
    'https://cf.geekdo-images.com/MlWBI8wHjoJwUaWkp_4HWg__large/img/6TyMLzSF6sCH1UwGbWir36_yb3s=/fit-in/1024x1024/filters:no_upscale():strip_icc()/pic8587297.jpg',
    'https://cf.geekdo-images.com/yKHXvqbk9vHI4Ntc39BhnA__large/img/Hk-_YNyaIKVme00yok8Zt6NRT0A=/fit-in/1024x1024/filters:no_upscale():strip_icc()/pic8587296.jpg',
  ],
  marvel_rr: [
    'https://cf.geekdo-images.com/kT3Vuu_OObJVHAl6z02Rbg__large/img/XUQEcUr4vuQBjy9DH7ycyZsCXcE=/fit-in/1024x1024/filters:no_upscale():strip_icc()/pic6783823.jpg',
    'https://cf.geekdo-images.com/H7qowONlQ8fr75nL1UlhIg__large/img/C6RRHblljPfVqTev1HpKtq9vTzM=/fit-in/1024x1024/filters:no_upscale():strip_icc()/pic6793193.jpg',
    'https://cf.geekdo-images.com/h3Hx0GlcNoIvyjifZRd-_w__large/img/HkFOEOr4FHCFMkjZ9SVd213rt-E=/fit-in/1024x1024/filters:no_upscale():strip_icc()/pic6785928.jpg',
  ],
  marvel_hk: [
    'https://cf.geekdo-images.com/1l_f7x4vXTU_SM74QTFsaA__large/img/MYq2PSChKTVEtZIRHFEyQWPcf90=/fit-in/1024x1024/filters:no_upscale():strip_icc()/pic6856037.jpg',
    'https://cf.geekdo-images.com/ts7G6dCOBfvdsLMZkxgUGw__large/img/a0usknZEa02GyK45lTPifkwPF28=/fit-in/1024x1024/filters:no_upscale():strip_icc()/pic7676632.jpg',
    'https://cf.geekdo-images.com/ts7G6dCOBfvdsLMZkxgUGw__large/img/a0usknZEa02GyK45lTPifkwPF28=/fit-in/1024x1024/filters:no_upscale():strip_icc()/pic7676632.jpg',
  ],
  marvel_ts: [
    'https://cf.geekdo-images.com/t_lMrft9Ueqb73IgwZfYSQ__large/img/YM_7xna_wXm00_LWwSRwTItWcj4=/fit-in/1024x1024/filters:no_upscale():strip_icc()/pic9336531.jpg',
    'https://cf.geekdo-images.com/eHtloL_e9OqLxLJvXUgcNQ__large/img/2sIDXg-PT9XQEPVNwfadTunfazc=/fit-in/1024x1024/filters:no_upscale():strip_icc()/pic9372751.jpg',
    'https://cf.geekdo-images.com/LpK-lTigP3lA8UPNq15cEw__large/img/kl_-_2lQwi2wfYHmjcv4fhASxZI=/fit-in/1024x1024/filters:no_upscale():strip_icc()/pic9336523.jpg',
  ],
  marvel_kc: [
    'https://cf.geekdo-images.com/WjQPl2VxbYlgV1hUwEmntg__large/img/YOi_0he_USnwQRnZxLidICNIWMM=/fit-in/1024x1024/filters:no_upscale():strip_icc()/pic8968775.jpg',
    'https://cf.geekdo-images.com/Z456uaiaGveI4ryybBsTXA__large/img/ORP98nLjkUOY0UVPqalc2jxBPOs=/fit-in/1024x1024/filters:no_upscale():strip_icc()/pic8339443.jpg',
    'https://cf.geekdo-images.com/TiKHI-9PWEG-dsw8-ABkTQ__large/img/XM7uyHiuQRVcoUbbQxmO6NzmpYQ=/fit-in/1024x1024/filters:no_upscale():strip_icc()/pic8210652.png',
  ],
  marvel_bb: [
    'https://cf.geekdo-images.com/wYaQFYi0doGPJLBYs5HI5g__large/img/_bsfzCk3zjelJaGADBYAqbe3SD8=/fit-in/1024x1024/filters:no_upscale():strip_icc()/pic7609165.jpg',
    'https://cf.geekdo-images.com/5XGj8wrvbxxVbLDXO5Ca4w__large/img/XYQoKaaC_O5oNhNFY4g6tOFdy2M=/fit-in/1024x1024/filters:no_upscale():strip_icc()/pic7609167.jpg',
    'https://cf.geekdo-images.com/cJOPxwDYmD0sqivtWneEvw__large/img/BTGSijeTkyCz8rn_0LID99HjF6A=/fit-in/1024x1024/filters:no_upscale():strip_icc()/pic7609166.jpg',
  ],
};

/**
 * Index-aligned with each set's `maps` array. Playmat photos from BGG.
 */
export const MAP_IMAGES: Record<string, (string | undefined)[]> = {
  bol2: [
    'https://cf.geekdo-images.com/HNLJeRI412ShNTGVqtAZgQ__large/img/hb0iYr6hKhZoq1m5_jrTl7HYwbs=/fit-in/1024x1024/filters:no_upscale():strip_icc()/pic9182394.jpg',
  ],
  lrrh: [
    'https://cf.geekdo-images.com/sIYvNmMChl1I27gewvX0BA__large/img/ij0CoDC0GWLXQkxNdiQSl08uU4w=/fit-in/1024x1024/filters:no_upscale():strip_icc()/pic8487897.jpg',
  ],
  slings: [
    'https://cf.geekdo-images.com/fYe21hPWkoCAbdmWMnVNGA__large/img/wK6hTUwImut4Pt6TCZIVAUclFyk=/fit-in/1024x1024/filters:no_upscale():strip_icc()/pic8683960.jpg',
  ],
  buffy: [
    'https://cf.geekdo-images.com/F162YBBzQIj4KBX3oDMDNA__large/img/iMZ_h38Fvx2LfERYsp2dEchfhkk=/fit-in/1024x1024/filters:no_upscale():strip_icc()/pic8845020.jpg',
    undefined,
  ],
  witcher1: [
    'https://cf.geekdo-images.com/rF8THd4MyJoCav7K8yf3GQ__large/img/jDscKMfh9i4Z6UqpspUeQ6Jd0kQ=/fit-in/1024x1024/filters:no_upscale():strip_icc()/pic8868252.jpg',
    'https://cf.geekdo-images.com/jsf-eQ9fhtsD3B4nXp_h9g__large/img/pVrHRpkNgIqLkpOtJR-jJrvuRYw=/fit-in/1024x1024/filters:no_upscale():strip_icc()/pic8868253.jpg',
  ],
  marvel_rr: [
    'https://cf.geekdo-images.com/TE7z8UQ4TgTh1Go7pcevBQ__large/img/_Ue1IexThzq0L-XKPH0-_vO4DtA=/fit-in/1024x1024/filters:no_upscale():strip_icc()/pic6766746.jpg',
  ],
  marvel_hk: [
    'https://cf.geekdo-images.com/vco3GkOXXWc3PeT0WQWO3g__large/img/Lfs6NaAuxVFUdcG13S8dITDDSbw=/fit-in/1024x1024/filters:no_upscale():strip_icc()/pic6878415.jpg',
  ],
  marvel_kc: [
    'https://cf.geekdo-images.com/WjQPl2VxbYlgV1hUwEmntg__large/img/YOi_0he_USnwQRnZxLidICNIWMM=/fit-in/1024x1024/filters:no_upscale():strip_icc()/pic8968775.jpg',
  ],
};

export function getMiniImage(setId: string, idx: number): string | undefined {
  return MINI_IMAGES[setId]?.[idx];
}

export function getMapImage(setId: string, idx: number): string | undefined {
  return MAP_IMAGES[setId]?.[idx];
}
