import { nothing } from 'lit-html';
import { googleSheet } from './google.js';

const SHEETS = {
  google: googleSheet
};

export const sheetView = (s, app) => SHEETS[s.sheet]?.(s, app) ?? nothing;
