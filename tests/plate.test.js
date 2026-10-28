/* Copyright (c) 2026 - Ing. Développeur Hicham Oussama Saffih */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { P } from '../js/logic/catalog.js';
import { plateOf } from '../js/logic/plate.js';

test('crêpe Nutella banane : nappage Nutella, banane déjà posée', () => {
  const v = plateOf(P['crepe-nb'], {});
  assert.equal(v.shape, 'crepe');
  assert.equal(v.sauce[1], '#4B2615');
  assert.equal(v.spread, true);
  assert.equal(v.inc.banane, true);
  assert.deepEqual(v.chips, ['Nutella', 'Banane', 'Pâte maison']);
  assert.equal(v.drizzle, null);
});

test('deux parfums : le second fait le filet', () => {
  const v = plateOf(P['crepes-nutella-creme-pistache'], {});
  assert.equal(v.sauce[1], '#4B2615');
  assert.equal(v.drizzle, '#8FCB6B');
});

test('brownie : plus grand en taille L, zone aplatie', () => {
  const m = plateOf(P['brownies-lotus'], { taille: 'M' }),
    l = plateOf(P['brownies-lotus'], { taille: 'L' });
  assert.deepEqual([m.brownie.w, m.brownie.h], [156, 112]);
  assert.deepEqual([l.brownie.w, l.brownie.h, l.brownie.left], [190, 134, 27]);
  assert.equal(l.zone.ty, -6);
  assert.ok(l.chips.includes('Crème fromagère'));
});

test('choux : 4 ou 6, crème si farcis', () => {
  const v = plateOf(P['choux-nutella'], { pcs: '6', garn: 'farcis', creme: 'chocolat' });
  assert.equal(v.puffs.length, 6);
  assert.equal(v.cream, true);
  assert.equal(v.creamColor, '#6B3A22');
  assert.equal(plateOf(P['choux-nutella'], { pcs: '4', garn: 'classiques' }).puffs.length, 4);
});

test('gaufre nature : pas de nappage', () => {
  const v = plateOf(P['gaufres-natural'], {});
  assert.equal(v.sauce, null);
  assert.equal(v.zone.kx, 0.8);
});
