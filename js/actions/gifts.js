/* Copyright (c) 2026 - Ing. Développeur Hicham Oussama Saffih */
import { giftOf, giftLines } from '../logic/loyalty.js';
import { addLine } from './cart.js';
import { burst } from '../ui/fx.js';

export function openGift(app, k) {
  app.snd('tap');
  app.set({ gift: k, sheet: 'gift' });
}

// Débite les Miams puis pose le cadeau dans le panier (0 DH, options figées)
export function redeem(app) {
  const g = giftOf(app.s.gift);
  if (app.s.miams < g.cost) return;
  app.set(s => ({ miams: s.miams - g.cost }));
  app.snd('win');
  app.buzz(15);
  burst(app.$('[data-gift-thumb]'), 36);
  app.closeSheet(() => {
    giftLines(g).forEach(l => addLine(app, l));
    app.toast(`${g.n} ajouté au panier`, { icon: 'redeem', action: { label: 'Voir', fn: () => app.go('cart') } });
  });
}
