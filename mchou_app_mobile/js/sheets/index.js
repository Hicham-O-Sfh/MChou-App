import { nothing } from 'lit-html';
import { googleSheet } from './google.js';
import { streakSheet } from './streak.js';
import { optionsSheet, optionsEffects } from './options.js';
import { upsellSheet } from './upsell.js';
import { tdsSheet } from './tds.js';

const SHEETS = {
  google: googleSheet,
  streak: streakSheet,
  opts: optionsSheet,
  upsell: upsellSheet,
  tds: tdsSheet
};

export const sheetView = (s, app) => SHEETS[s.sheet]?.(s, app) ?? nothing;

export function sheetEffects(prev, s, app) {
  optionsEffects(prev, s, app);
}
