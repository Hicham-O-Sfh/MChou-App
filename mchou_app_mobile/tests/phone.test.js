import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fmtPhone, normPhone, phoneInput, phoneState } from '../js/logic/phone.js';

test('format par groupes : 6 12 34 56 78', () => {
  assert.equal(fmtPhone('612345678'), '6 12 34 56 78');
  assert.equal(fmtPhone('612'), '6 12');
});

test('préfixes +212 et 0 retirés', () => {
  assert.equal(normPhone('+212 6 12 34 56 78'), '612345678');
  assert.equal(normPhone('0612345678'), '612345678');
});

test('effacer une espace efface le chiffre précédent', () => {
  assert.equal(phoneInput('6 12 3456', '6123456'), '612345');
});

test('états du champ', () => {
  assert.equal(phoneState('', false), 'empty');
  assert.equal(phoneState('5', false), 'err');
  assert.equal(phoneState('6123', false), 'typing');
  assert.equal(phoneState('6123', true), 'err');
  assert.equal(phoneState('712345678', false), 'ok');
});
