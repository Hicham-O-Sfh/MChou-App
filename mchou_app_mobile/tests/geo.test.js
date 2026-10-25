import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SHOP, HOME0, km, etaRange, fmtKm } from '../js/logic/geo.js';

test('distance boutique → adresse de démo ≈ 2,7 km', () => {
  assert.equal(fmtKm(km(SHOP, HOME0)), '2,7');
});

test('livraison : 10–15 min par tranche de 5 km', () => {
  assert.equal(etaRange(2.7), '10–15 min');
  assert.equal(etaRange(5.1), '20–30 min');
});
