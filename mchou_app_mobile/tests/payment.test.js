import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cardInput, expInput, luhn, brand, cardErrors, mad, promoInput } from '../js/logic/payment.js';
import { slots, currentSlot, msUntil } from '../js/logic/time.js';

test('saisie carte : groupes de 4, 16 chiffres max', () => {
  assert.equal(cardInput('42424242424242424242', ''), '4242 4242 4242 4242');
  assert.equal(expInput('1228', ''), '12/28');
  assert.equal(promoInput(' mchou 10 '), 'MCHOU10');
});

test('Luhn et marque', () => {
  assert.equal(luhn('4242424242424242'), true);
  assert.equal(luhn('4242424242424241'), false);
  assert.equal(brand('5500 0000'), 'MASTERCARD');
  assert.equal(brand('4000'), 'VISA');
});

test('erreurs du formulaire carte', () => {
  const now = new Date(2026, 9, 26);
  assert.deepEqual(cardErrors({ num: '4242 4242 4242 4242', exp: '12/28', cvv: '123', cname: 'MAROUANE' }, now), {});
  const e = cardErrors({ num: '4242', exp: '09/26', cvv: '1', cname: 'M' }, now);
  assert.deepEqual(e, { num: 'Numéro incomplet', exp: 'Carte expirée', cvv: '3 chiffres au dos', name: 'Nom comme sur la carte' });
  assert.equal(mad(46), '46,00 MAD');
});

test('créneaux : 45 min mini, calés sur la demi-heure', () => {
  const now = new Date(2026, 9, 26, 14, 10).getTime();
  assert.deepEqual(slots(now), ['15:00', '15:30', '16:00', '16:30', '17:00']);
  assert.equal(currentSlot('', now), '15:30');
  assert.equal(currentSlot('16:30', now), '16:30');
  assert.equal(msUntil('15:00', now), 50 * 60000);
  assert.equal(msUntil('14:00', now), (24 * 60 - 10) * 60000);
});
