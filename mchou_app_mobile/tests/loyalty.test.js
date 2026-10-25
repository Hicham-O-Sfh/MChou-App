import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nextGift, flame } from '../js/logic/loyalty.js';

test('prochain cadeau', () => {
  const g = nextGift(112);
  assert.equal(g.n, 4);
  assert.equal(g.msg, 'Plus que 8 Miams pour : Crêpe Nutella banane');
  assert.equal(nextGift(500).msg, 'Tous les cadeaux sont à ta portée !');
});

test('série de 4, semaine pas encore commandée', () => {
  const f = flame({ streak: 4, weekDone: false });
  assert.deepEqual(f.nodes.map(n => n.on), [true, true, true, true, false]);
  assert.equal(f.nodes[4].now, true);
  assert.equal(f.head, 'Plus qu’une flamme pour gagner 200 Miams !');
  assert.equal(f.title, '4 semaines d’affilée !');
});

test('série bouclée à 5', () => {
  const f = flame({ streak: 5, weekDone: true });
  assert.ok(f.nodes.every(n => n.on && !n.now));
  assert.equal(f.head, 'Série bouclée : +200 Miams pour toi !');
});
