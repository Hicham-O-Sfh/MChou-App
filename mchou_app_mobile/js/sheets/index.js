import { nothing } from 'lit-html';

const SHEETS = {};

export const sheetView = (s, app) => SHEETS[s.sheet]?.(s, app) ?? nothing;
