import { test } from 'node:test';
import assert from 'node:assert/strict';
import { totals } from '../js/logic/cart.js';

const line = (unit, qty = 1) => ({ unit, qty });

test('panier vide : ni frais ni total', () => {
  const t = totals({ cart: [], promoOk: false });
  assert.equal(t.total, 0);
  assert.equal(t.fee, 0);
  assert.equal(t.count, 0);
});

test('sous 150 DH : livraison 15 DH', () => {
  const t = totals({ cart: [line(25, 2), line(20)], promoOk: false });
  assert.equal(t.sub, 70);
  assert.equal(t.fee, 15);
  assert.equal(t.total, 85);
  assert.equal(t.left, 80);
  assert.equal(t.count, 3);
});

test('dès 150 DH : livraison offerte', () => {
  const t = totals({ cart: [line(50, 3)], promoOk: false });
  assert.equal(t.free, true);
  assert.equal(t.fee, 0);
  assert.equal(t.pct, 100);
});

test('code promo : -10 % arrondi, les Miams suivent le montant remisé', () => {
  const t = totals({ cart: [line(35)], promoOk: true });
  assert.equal(t.disc, 4);
  assert.equal(t.gain, 31);
  assert.equal(t.total, 46);
});
