import { GIFTS, FLAME } from '../data/loyalty.js';
import { P, defSel, optLabel } from './catalog.js';

export const giftOf = k => GIFTS.find(g => g.k === k) || GIFTS[0];

// Miams rendus quand on retire des cadeaux ; le duo a deux lignes, remboursé une seule fois
export function giftRefund(cart) {
  const seen = new Set();
  return cart.reduce((a, l) => {
    if (!l.gift || seen.has(l.gift)) return a;
    seen.add(l.gift);
    return a + giftOf(l.gift).cost * l.qty;
  }, 0);
}

// Lignes de panier d'un cadeau : options figées, prix 0
export const giftLines = g => g.lines.map(([id, sel]) => {
  const s2 = { ...defSel(P[id]), ...sel };
  return { id, v: optLabel(P[id], s2), ex: [], sugar: true, note: '', unit: 0, qty: 1, gift: g.k };
});

export function nextGift(m) {
  const g = GIFTS.find(x => x.cost > m), n = GIFTS.filter(x => x.cost <= m).length;
  return {
    n,
    pct: g ? `${Math.min(100, m / g.cost * 100)}%` : '100%',
    msg: g ? `Plus que ${g.cost - m} Miams pour : ${g.n}` : 'Tous les cadeaux sont à ta portée !'
  };
}

const weeks = n => `${n} ${n > 1 ? 'semaines' : 'semaine'}`;

// Timeline de la série : nœuds allumés, nœud de la semaine en cours, cadeau au bout
export function flame({ streak, weekDone }) {
  const G = FLAME.goal, B = FLAME.bonus;
  const full = weekDone && streak > 0 && streak % G === 0, lit = full ? G : streak % G, cur = full ? -1 : lit, left = G - lit;
  const nodes = Array.from({ length: G }, (_, i) => {
    const on = i < lit, now = i === cur, last = i === G - 1;
    return { on, now, last, icon: on || !last ? 'local_fire_department' : 'redeem', cap: last ? `+${B} Miams` : now ? (weekDone ? 'Semaine pro' : 'Cette semaine') : '' };
  });
  const head = full ? `Série bouclée : +${B} Miams pour toi !`
    : weekDone ? 'Ta flamme de la semaine est allumée !'
    : left === 1 ? `Plus qu’une flamme pour gagner ${B} Miams !`
    : `Encore ${left} flammes pour gagner ${B} Miams`;
  const sub = full ? 'Une nouvelle série démarre la semaine prochaine.'
    : weekDone ? `Encore ${weeks(left)} d’affilée pour gagner ${B} Miams.`
    : left === 1 ? `Commande cette semaine et la ${G}e flamme s’allume.`
    : 'Une commande cette semaine allume la prochaine flamme.';
  return {
    nodes, head, sub,
    fill: `${Math.max(0, lit - 1) / (G - 1) * 80}%`,
    title: streak ? `${weeks(streak)} d’affilée !` : 'Allume ta première flamme !'
  };
}
