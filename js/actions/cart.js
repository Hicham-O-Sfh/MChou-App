/* Copyright (c) 2026 - Ing. Développeur Hicham Oussama Saffih */
import { P, defLine } from '../logic/catalog.js';
import { mergeLine, minusLine, totals, MAX_QTY } from '../logic/cart.js';
import { giftRefund } from '../logic/loyalty.js';
import { PROMO_CODE } from '../logic/payment.js';
import { fly, burst } from '../ui/fx.js';
import { shake } from '../ui/motion.js';

const seeCart = app => ({ label: 'Voir', fn: () => app.go('cart') });
const undo = (app, patch) => ({ label: 'Annuler', fn: () => app.set(patch) });

export const addLine = (app, l) => app.set(s => ({ cart: mergeLine(s.cart, l) }));

export function addSimple(app, id, el) {
  const p = P[id];
  if (!p || p.soldOut) return;
  fly(el, p.icon, () => addLine(app, defLine(id)));
}

export function minus(app, id) {
  app.set(s => ({ cart: minusLine(s.cart, id) }));
  app.snd('off');
  app.buzz(6);
}

export function reorder(app, el) {
  const L = app.s.last;
  if (!L) return;
  fly(el, 'replay', () => {
    L.lines.forEach(l => addLine(app, l));
    const n = L.lines.reduce((a, l) => a + l.qty, 0);
    app.toast(n > 1 ? `${n} articles ajoutés` : 'Ajouté au panier', { action: seeCart(app) });
  });
}

export function addedToast(app, qty = 1) {
  app.toast(qty > 1 ? `${qty} ajoutés au panier` : 'Ajouté au panier', { action: seeCart(app) });
}

// ± sur une ligne du panier ; un cadeau se retire d'un bloc et rend ses Miams
export function lineQty(app, i, d) {
  const { cart, miams } = app.s,
    l = cart[i];
  if (!l) return;
  app.snd(d > 0 ? 'pop' : 'off');
  app.buzz(6);
  if (l.gift) {
    const back = giftRefund(cart.filter(x => x.gift === l.gift));
    app.set({ cart: cart.filter(x => x.gift !== l.gift), miams: miams + back });
    app.toast(`Cadeau retiré, tes ${back} Miams sont rendus`, {
      icon: 'undo',
      tone: 'gold',
      action: undo(app, { cart, miams })
    });
    return;
  }
  const q = l.qty + d;
  if (q <= 0) {
    app.set({ cart: cart.filter((_, j) => j !== i) });
    app.toast('Retiré du panier', { icon: 'delete', tone: 'err', action: undo(app, { cart }) });
  } else {
    app.set({ cart: cart.map((x, j) => (j === i ? { ...x, qty: Math.min(MAX_QTY, q) } : x)) });
  }
}

export function clearCart(app) {
  const { cart, miams } = app.s;
  app.set({ cart: [], miams: miams + giftRefund(cart) });
  app.snd('off');
  app.toast('Panier vidé', { icon: 'delete', tone: 'err', action: undo(app, { cart, miams }) });
}

export function applyPromo(app) {
  const c = app.s.promo.trim().toUpperCase();
  if (!c) return;
  if (c === PROMO_CODE) {
    app.set({ promoOk: true, promoErr: false, promo: c });
    app.snd('coin');
    app.buzz(10);
  } else {
    app.set({ promoErr: true }, () => shake(app.$('[data-promo]')));
    app.snd('err');
  }
}

// Le total compte jusqu'à sa nouvelle valeur ; passer les 150 DH fête la livraison offerte
export function cartEffects(prev, s, app) {
  const a = totals(prev),
    b = totals(s);
  if (a.total !== b.total) app.tween('ct', s.tw.ct ?? a.total, b.total);
  if (!a.free && b.free && s.screen === 'cart') {
    app.snd('win');
    burst(app.$('[data-freebar]'), 28);
  }
}
