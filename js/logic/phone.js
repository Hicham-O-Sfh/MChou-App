/* Copyright (c) 2026 - Ing. Développeur Hicham Oussama Saffih */
import { digits, editDigits } from './format.js';

export const fmtPhone = d =>
  [d.slice(0, 1), d.slice(1, 3), d.slice(3, 5), d.slice(5, 7), d.slice(7, 9)].filter(Boolean).join(' ');

// Accepte +212 6…, 06… ou 6… ; garde les 9 chiffres du mobile
export function normPhone(v) {
  let d = digits(v);
  if (d.length > 9 && d.startsWith('212')) d = d.slice(3);
  if (d.startsWith('0')) d = d.slice(1);
  return d.slice(0, 9);
}

export const phoneInput = (v, cur) => normPhone(editDigits(v, fmtPhone(cur), x => x, 12));

export function phoneState(d, blurred) {
  if (!d) return 'empty';
  if (!/^[67]/.test(d)) return 'err';
  if (d.length === 9) return 'ok';
  return blurred ? 'err' : 'typing';
}
