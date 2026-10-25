import { P, defLine } from '../logic/catalog.js';
import { mergeLine, minusLine } from '../logic/cart.js';
import { fly } from '../ui/fx.js';

const seeCart = app => ({ label: 'Voir', fn: () => app.go('cart') });

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
