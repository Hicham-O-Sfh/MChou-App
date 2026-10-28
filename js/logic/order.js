/* Copyright (c) 2026 - Ing. Développeur Hicham Oussama Saffih */
import { FLAME } from '../data/loyalty.js';
import { P } from './catalog.js';
import { totals } from './cart.js';
import { etaSteps } from './geo.js';
import { brand, last4 } from './payment.js';
import { currentSlot, msUntil, ddmm } from './time.js';

const unique = a => [...new Set(a)];

// Passe la commande : renvoie le changement d'état (commande, Miams, série, historique, panier vidé)
export function placeOrder(s, now, rnd = Math.random()) {
  const t = totals(s);
  const st1 = s.weekDone ? s.streak : s.streak + 1;
  const bonus = !s.weekDone && st1 % FLAME.goal === 0 ? FLAME.bonus : 0;
  const m1 = s.miams + t.gain + bonus;
  const paid = s.cart.filter(l => !l.gift);
  const eta = now + (s.when === 'later' ? msUntil(currentSlot(s.slot, now), now) : 15 * etaSteps(s.dist) * 60000);
  const order = {
    no: `MC-${2400 + Math.floor(rnd * 600)}`,
    total: t.total,
    gain: t.gain,
    pay: s.pay,
    last4: last4(s.num),
    m0: s.miams,
    m1,
    bonus,
    st0: s.streak,
    st1,
    eta
  };
  return {
    busy: false,
    order,
    miams: m1,
    streak: st1,
    weekDone: true,
    orders: [{ date: ddmm(now), items: unique(s.cart.map(l => P[l.id].full)).join(', '), total: t.total }, ...s.orders],
    savedCard: s.pay === 'card' && s.saveCard ? { brand: brand(s.num) || 'CARTE', last4: order.last4 } : s.savedCard,
    last: paid.length
      ? {
          names: unique(paid.map(l => P[l.id].full)).join(', '),
          when: 'Aujourd’hui',
          total: t.total,
          lines: paid.map(l => ({ ...l }))
        }
      : s.last,
    cart: [],
    promoOk: false,
    promo: '',
    cardTry: false,
    stage: 1,
    prog: 0,
    streakShown: s.streak,
    unlockShown: false,
    tw: { ...s.tw, gain: 0, m: s.miams }
  };
}
