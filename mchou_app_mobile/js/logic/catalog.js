import { FAMS, AX, FLAV, EX } from '../data/catalog.js';

export const FM = Object.fromEntries(FAMS.map(f => [f.k, f]));

export const norm = x => String(x).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const slug = x => norm(x).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const BRAND = /^(Nutella|Oreo|Lotus|Bueno|Kunafa)/;

function buildP() {
  const P = {};
  FAMS.forEach(f => f.items.forEach(([name, pr, o = {}]) => {
    const id = o.id || `${f.k}-${slug(name)}`, ax = o.ax || f.ax || [];
    const fl = FLAV.filter(x => x[4].test(`${name} ${o.d || ''}`)).map(x => x[0]), ft = FLAV.find(x => x[0] === fl[0]);
    const hint = ax.map(a => AX[a].hint).filter(Boolean).join(' · ') || o.d || '';
    const prices = Array.isArray(pr) ? pr : [pr];
    const full = o.full || (f.pre && !BRAND.test(name) ? f.pre + name.charAt(0).toLowerCase() + name.slice(1) : f.pre + name);
    P[id] = {
      id, name, full, sub: hint || f.sub, hint, d: o.d || '',
      price: Math.min(...prices), prices, multi: prices.length > 1, ax, ex: !!f.ex, cat: f.k,
      icon: o.icon || f.icon, tint: o.tint || (ft ? ft[3] : f.tint), flav: fl,
      tag: o.tag, soldOut: !!o.soldOut, pop: !!o.pop, bld: f.bld || '', sugar: !!f.sugar, desc: o.desc || f.desc || ''
    };
  }));
  return P;
}

export const P = buildP();

export const axOn = (a, sel) => { const w = AX[a].when; return !w || Object.keys(w).every(k => sel[k] === w[k]); };

export const defSel = p => Object.fromEntries(p.ax.map(a => [a, AX[a].o[0][0]]));

// Les axes « price » indexent le tableau de prix, le premier axe variant le plus vite
export function optUnit(p, sel, ex) {
  let i = 0, m = 1;
  p.ax.filter(a => AX[a].price).forEach(a => {
    const o = AX[a].o;
    i += Math.max(0, o.findIndex(x => x[0] === sel[a])) * m;
    m *= o.length;
  });
  let u = p.prices[i] ?? p.prices[0];
  p.ax.forEach(a => { if (AX[a].add && sel[a] && axOn(a, sel)) u += AX[a].add; });
  return u + EX.reduce((t, e) => t + (ex?.[e.k] ? e.p : 0), 0);
}

export const optLabel = (p, sel) => p.ax.filter(a => axOn(a, sel)).map(a => AX[a].o.find(x => x[0] === sel[a])?.[2]).filter(Boolean).join(' · ');

export const exNames = ex => EX.filter(e => ex[e.k]).map(e => e.n);

export function defLine(id) {
  const p = P[id], sel = defSel(p);
  return { id, v: optLabel(p, sel), ex: [], sugar: true, note: '', unit: optUnit(p, sel), qty: 1 };
}

// Accueil : les plus aimés, ou la recherche sur nom, description et famille
export function homeIds(query) {
  const q = norm(query.trim());
  return Object.keys(P).filter(id => (q ? norm(`${P[id].full} ${P[id].sub} ${FM[P[id].cat].n}`).includes(q) : P[id].pop)).slice(0, 12);
}

// Menu : sections par famille, filtrées par saveur et recherche
export function menuSections(mq, flav) {
  const q = norm(mq.trim());
  const ids = Object.keys(P).filter(id => {
    const p = P[id], f = FM[p.cat];
    return (!flav || p.flav.includes(flav)) && (!q || norm(`${p.full} ${p.name} ${p.d} ${f.n} ${f.t}`).includes(q));
  });
  return FAMS.map(f => ({ fam: f, ids: ids.filter(id => P[id].cat === f.k) })).filter(x => x.ids.length);
}
