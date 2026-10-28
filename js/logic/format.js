/* Copyright (c) 2026 - Ing. Développeur Hicham Oussama Saffih */
export const digits = v => String(v).replace(/\D/g, '');

// Garde les chiffres saisis ; effacer un séparateur efface le chiffre qui le précède
export function editDigits(v, oldFmt, fmt, maxD) {
  let d = digits(v);
  if (d === digits(oldFmt) && v.length < oldFmt.length) d = d.slice(0, -1);
  return fmt(d.slice(0, maxD));
}
