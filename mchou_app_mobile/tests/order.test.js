import { test } from 'node:test';
import assert from 'node:assert/strict';
import { placeOrder } from '../js/logic/order.js';
import { giftRefund, giftLines, giftOf } from '../js/logic/loyalty.js';

const base = {
  cart: [{ id: 'crepe-nb', v: '', ex: [], sugar: true, note: '', unit: 25, qty: 2 }, { id: 'mojito-fraise', v: '', ex: [], sugar: true, note: '', unit: 0, qty: 1, gift: 'mojito' }],
  promoOk: false, miams: 112, streak: 4, weekDone: false, when: 'asap', slot: '', dist: 2.7, pay: 'card', num: '4242 4242 4242 4242',
  saveCard: true, savedCard: null, orders: [], last: null, tw: {}
};
const now = new Date(2026, 9, 26, 14, 0).getTime();

test('5e semaine : flamme + bonus de 200 Miams', () => {
  const p = placeOrder(base, now, 0);
  assert.equal(p.order.no, 'MC-2400');
  assert.equal(p.order.total, 65);
  assert.equal(p.order.gain, 50);
  assert.equal(p.order.bonus, 200);
  assert.equal(p.miams, 362);
  assert.equal(p.streak, 5);
  assert.equal(p.order.eta, now + 15 * 60000);
  assert.deepEqual(p.cart, []);
});

test('semaine déjà commandée : pas de nouvelle flamme', () => {
  const p = placeOrder({ ...base, weekDone: true }, now, 0);
  assert.equal(p.streak, 4);
  assert.equal(p.order.bonus, 0);
});

test('historique, carte enregistrée, dernière commande sans cadeau', () => {
  const p = placeOrder(base, now, 0);
  assert.deepEqual(p.orders[0], { date: '26/10', items: 'Crêpe Nutella banane, Mojito fraise', total: 65 });
  assert.deepEqual(p.savedCard, { brand: 'VISA', last4: '4242' });
  assert.equal(p.last.names, 'Crêpe Nutella banane');
  assert.equal(p.last.lines.length, 1);
});

test('cadeaux : options figées, remboursement une fois par cadeau', () => {
  const duo = giftLines(giftOf('duo'));
  assert.equal(duo.length, 2);
  assert.ok(duo.every(l => l.unit === 0 && l.gift === 'duo'));
  assert.equal(giftRefund(duo), 190);
  assert.equal(giftLines(giftOf('choux6'))[0].v, '6 pièces · Farcis à la crème · crème vanille');
});
