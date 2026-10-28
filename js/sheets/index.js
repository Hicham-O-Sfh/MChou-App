/* Copyright (c) 2026 - Ing. Développeur Hicham Oussama Saffih */
import { nothing } from 'lit-html';
import { googleSheet } from './google.js';
import { streakSheet } from './streak.js';
import { optionsSheet, optionsEffects } from './options.js';
import { upsellSheet } from './upsell.js';
import { tdsSheet } from './tds.js';
import { giftSheet } from './gift.js';

const SHEETS = {
  google: googleSheet,
  streak: streakSheet,
  opts: optionsSheet,
  upsell: upsellSheet,
  tds: tdsSheet,
  gift: giftSheet
};

export const sheetView = (s, app) => SHEETS[s.sheet]?.(s, app) ?? nothing;

export function sheetEffects(prev, s, app) {
  optionsEffects(prev, s, app);
}
