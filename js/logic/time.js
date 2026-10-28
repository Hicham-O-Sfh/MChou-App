/* Copyright (c) 2026 - Ing. Développeur Hicham Oussama Saffih */
const pad = n => String(n).padStart(2, '0');

export const clock = ts => {
  const d = new Date(ts);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
export const ddmm = ts => {
  const d = new Date(ts);
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}`;
};

const MONTHS = [
  'janvier',
  'février',
  'mars',
  'avril',
  'mai',
  'juin',
  'juillet',
  'août',
  'septembre',
  'octobre',
  'novembre',
  'décembre'
];

// « 1998-03-12 » → « 12 mars 1998 »
export function longDate(v) {
  const [y, m, d] = v.split('-').map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

// 5 créneaux de 30 min, le premier au moins 45 min plus tard, calé sur :00 ou :30
export function slots(now) {
  const d = new Date(now + 45 * 60000);
  d.setMinutes(d.getMinutes() < 30 ? 30 : 60, 0, 0);
  return Array.from({ length: 5 }, () => {
    const v = clock(d);
    d.setMinutes(d.getMinutes() + 30);
    return v;
  });
}

export function currentSlot(slot, now) {
  const sl = slots(now);
  return sl.includes(slot) ? slot : sl[1];
}

// Délai jusqu'à un créneau « HH:MM » (demain s'il est déjà passé)
export function msUntil(v, now) {
  const [h, m] = v.split(':').map(Number),
    d = new Date(now);
  d.setHours(h, m, 0, 0);
  if (d.getTime() < now) d.setDate(d.getDate() + 1);
  return d.getTime() - now;
}
