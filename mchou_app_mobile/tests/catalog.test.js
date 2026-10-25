import { test } from 'node:test';
import assert from 'node:assert/strict';
import { P, defSel, optUnit, optLabel, defLine, homeIds, menuSections } from '../js/logic/catalog.js';

test('ids et noms complets', () => {
  assert.equal(P['crepe-nb'].full, 'Crêpe Nutella banane');
  assert.equal(P['crepes-amande'].full, 'Crêpe amande');
  assert.equal(P['jus-orange'].full, 'Jus d’orange');
  assert.equal(P['choux-nutella'].sub, '4 ou 6 pièces · classiques ou farcis');
});

test('choux : prix par pièces × façon', () => {
  const p = P['choux-nutella'];
  assert.equal(optUnit(p, { pcs: '4', garn: 'classiques' }), 12);
  assert.equal(optUnit(p, { pcs: '6', garn: 'classiques' }), 15);
  assert.equal(optUnit(p, { pcs: '4', garn: 'farcis' }), 18);
  assert.equal(optUnit(p, { pcs: '6', garn: 'farcis' }), 24);
  assert.equal(P['choux-nutella'].multi, true);
});

test('arôme +5 DH et suppléments', () => {
  const p = P['chauds-cappuccino'];
  assert.equal(optUnit(p, { arome: '' }), 15);
  assert.equal(optUnit(p, { arome: 'caramel' }), 20);
  assert.equal(optUnit(P['crepe-nb'], {}, { pistache: true, banane: true }), 40);
});

test('la crème ne s’affiche que pour les choux farcis', () => {
  const p = P['choux-pistache'];
  assert.equal(optLabel(p, { pcs: '6', garn: 'classiques', creme: 'vanille' }), '6 pièces · Classiques');
  assert.equal(optLabel(p, { pcs: '6', garn: 'farcis', creme: 'vanille' }), '6 pièces · Farcis à la crème · crème vanille');
});

test('ligne par défaut', () => {
  assert.deepEqual(defSel(P['brownies-lotus']), { taille: 'M' });
  assert.deepEqual(defLine('brownies-lotus'), { id: 'brownies-lotus', v: 'Taille M', ex: [], sugar: true, note: '', unit: 30, qty: 1 });
});

test('recherche accueil sans accents', () => {
  assert.ok(homeIds('').every(id => P[id].pop));
  assert.ok(homeIds('crepe').includes('crepe-nb'));
});

test('menu : filtre saveur et recherche', () => {
  const secs = menuSections('', 'pistache');
  assert.ok(secs.every(s => s.ids.every(id => P[id].flav.includes('pistache'))));
  assert.deepEqual(menuSections('mojito', '').map(s => s.fam.k), ['mojitos']);
  assert.equal(menuSections('zzz', '').length, 0);
});
