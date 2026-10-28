/* Copyright (c) 2026 - Ing. Développeur Hicham Oussama Saffih */
const FREE_FROM = 150;
const FEE = 15;
const PROMO_RATE = 0.1;

export const MAX_QTY = 20;
// Plafond du sélecteur de quantité (builder, feuille d'options)
export const MAX_PICK = 9;

const lineKey = l =>
  [l.id, l.v || '', (l.ex || []).join(','), l.sugar === false ? 0 : 1, l.note || '', l.gift || ''].join('|');

// Une ligne identique (mêmes options, suppléments, note, cadeau) s'additionne
export function mergeLine(cart, l) {
  const k = lineKey(l),
    i = cart.findIndex(x => lineKey(x) === k);
  if (i < 0) return [...cart, { ...l }];
  return cart.map((x, j) => (j === i ? { ...x, qty: Math.min(MAX_QTY, x.qty + l.qty) } : x));
}

// Retire une unité de la dernière ligne payante de ce produit
export function minusLine(cart, id) {
  const i = cart.findLastIndex(l => l.id === id && !l.gift);
  if (i < 0) return cart;
  return cart[i].qty > 1
    ? cart.map((x, j) => (j === i ? { ...x, qty: x.qty - 1 } : x))
    : cart.filter((_, j) => j !== i);
}

export function qtyById(cart) {
  const q = {};
  cart.forEach(l => {
    if (!l.gift) q[l.id] = (q[l.id] || 0) + l.qty;
  });
  return q;
}

export function totals({ cart, promoOk }) {
  const sub = cart.reduce((a, l) => a + l.unit * l.qty, 0);
  const disc = promoOk ? Math.round(sub * PROMO_RATE) : 0;
  const free = sub >= FREE_FROM;
  const fee = !cart.length || free ? 0 : FEE;
  return {
    sub,
    disc,
    fee,
    free,
    total: sub - disc + fee,
    gain: sub - disc,
    left: Math.max(0, FREE_FROM - sub),
    pct: Math.min(100, Math.round((sub / FREE_FROM) * 100)),
    count: cart.reduce((a, l) => a + l.qty, 0)
  };
}
