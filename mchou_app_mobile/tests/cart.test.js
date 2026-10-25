import { test } from 'node:test';
import assert from 'node:assert/strict';
import { totals, mergeLine, minusLine, qtyById } from '../js/logic/cart.js';

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

const crepe = { id: 'crepe-nb', v: '', ex: [], sugar: true, note: '', unit: 25, qty: 1 };

test('même ligne : les quantités s’additionnent, plafond 20', () => {
  let cart = mergeLine([], crepe);
  cart = mergeLine(cart, { ...crepe, qty: 2 });
  assert.equal(cart.length, 1);
  assert.equal(cart[0].qty, 3);
  assert.equal(mergeLine(cart, { ...crepe, qty: 30 })[0].qty, 20);
  assert.equal(mergeLine(cart, { ...crepe, ex: ['Pistache'] }).length, 2);
});

test('retirer une unité, puis la ligne ; les cadeaux ne bougent pas', () => {
  const gift = { ...crepe, unit: 0, gift: 'crepe-nb' };
  let cart = [gift, { ...crepe, qty: 2 }];
  cart = minusLine(cart, 'crepe-nb');
  assert.equal(cart[1].qty, 1);
  cart = minusLine(cart, 'crepe-nb');
  assert.deepEqual(cart, [gift]);
  assert.deepEqual(minusLine(cart, 'crepe-nb'), [gift]);
  assert.deepEqual(qtyById([gift, crepe]), { 'crepe-nb': 1 });
});
