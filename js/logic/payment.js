/* Copyright (c) 2026 - Ing. Développeur Hicham Oussama Saffih */
import { digits, editDigits } from './format.js';

export const PROMO_CODE = 'MCHOU10';
export const REFUSED_PREFIX = '4000';

export const cardInput = (v, cur) => editDigits(v, cur, d => d.replace(/(\d{4})(?=\d)/g, '$1 '), 16);
export const expInput = (v, cur) => editDigits(v, cur, d => (d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d), 4);
export const cvvInput = v => digits(v).slice(0, 4);
export const nameInput = v => v.toUpperCase().slice(0, 26);
export const promoInput = v => v.toUpperCase().replace(/\s/g, '').slice(0, 12);

export function luhn(n) {
  let sum = 0,
    alt = false;
  for (let i = n.length - 1; i >= 0; i--) {
    let d = +n[i];
    if (alt) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    alt = !alt;
  }
  return n.length >= 15 && sum % 10 === 0;
}

export function brand(num) {
  const n = digits(num);
  if (/^4/.test(n)) return 'VISA';
  if (/^(5[1-5]|2[2-7])/.test(n)) return 'MASTERCARD';
  return '';
}

export const last4 = num => digits(num).slice(-4);

export function cardErrors({ num, exp, cvv, cname }, now = new Date()) {
  const n = digits(num),
    e = {};
  if (!luhn(n)) e.num = n.length < 16 ? 'Numéro incomplet' : 'Numéro de carte invalide';
  const m = exp.match(/^(\d{2})\/(\d{2})$/);
  if (!m || +m[1] < 1 || +m[1] > 12) e.exp = 'Format MM/AA';
  else {
    const y = 2000 + +m[2],
      mo = +m[1];
    if (y < now.getFullYear() || (y === now.getFullYear() && mo < now.getMonth() + 1)) e.exp = 'Carte expirée';
  }
  if (!/^\d{3,4}$/.test(cvv)) e.cvv = '3 chiffres au dos';
  if (cname.trim().length < 3) e.name = 'Nom comme sur la carte';
  return e;
}

// Montant affiché par la banque : 46,00 MAD
export const mad = total => `${total.toFixed(2).replace('.', ',')} MAD`;
