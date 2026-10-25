import { P, defSel } from '../logic/catalog.js';

// Familles avec builder (crêpes, choux, brownies…) → builder ; boissons et packs → feuille d'options
export function openProduct(app, id) {
  const p = P[id];
  if (!p || p.soldOut) return;
  if (p.bld) return openBuilder(app, id);
  app.snd('tap');
  app.set(s => ({ po: { id, sel: defSel(p), ex: {}, qty: 1 }, sheet: 'opts', tw: { ...s.tw, o: null } }));
}

export function openBuilder(app, id = 'crepe-nb') {
  app.snd('tap');
  app.set(s => ({ bid: id, bsel: defSel(P[id]), ex: {}, sugar: true, bqty: 1, note: '', bAdded: false, upsAdded: {}, tw: { ...s.tw, b: null } }));
  app.go('builder');
}
