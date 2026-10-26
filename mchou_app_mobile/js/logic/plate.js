import { SAUCE } from '../data/catalog.js';

// Parfums du nom, dans leur ordre d'apparition : le 1er nappe, le 2e fait le filet
const SAUCE_HIT = [['nutella', /nutella|box/], ['pistache', /pista|duba/], ['lotus', /lotus/], ['bueno', /bueno/], ['oreo', /oreo/], ['amande', /amande|gazelle/], ['chocolat', /chocolat|brownie/]];
// Garnitures du nom, déjà posées dans l'assiette
const INCLUDED = [['banane', /banane/], ['pistache', /pista/], ['amande', /amande/], ['lotus', /lotus/], ['oreo', /oreo/], ['kunafa', /kunafa|duba/], ['bueno', /bueno/]];
const LABEL = { nutella: 'Nutella', pistache: 'Pistache', lotus: 'Lotus', bueno: 'Bueno', oreo: 'Oreo', amande: 'Amande', chocolat: 'Chocolat', banane: 'Banane', kunafa: 'Kunafa' };

const PUFFS_4 = [[40, 42], [102, 42], [40, 104], [102, 104]];
const PUFFS_6 = [[14, 46], [71, 38], [128, 46], [14, 106], [71, 114], [128, 106]];
const ZONE_SCALE = { spaghetti: .92, gaufre: .8, choux: .86 };
const WATCH = {
  crepe: 'Regarde ta crêpe se garnir', spaghetti: 'Regarde tes spaghetti se garnir', gaufre: 'Regarde ta gaufre se garnir',
  brownie: 'Regarde ton brownie se garnir', choux: 'Regarde tes choux se garnir'
};

export function plateOf(p, sel) {
  const nm = p.name.toLowerCase(), shape = p.bld || 'crepe';
  const hit = SAUCE_HIT.map(([k, r]) => [k, nm.search(r)]).filter(x => x[1] >= 0).sort((a, b) => a[1] - b[1]).map(x => x[0]);
  const C = SAUCE[hit[0]], C2 = SAUCE[hit[1]];
  const inc = Object.fromEntries(INCLUDED.map(([k, r]) => [k, r.test(nm)]));
  const brownie = shape === 'brownie', choux = shape === 'choux', flat = shape === 'crepe' || shape === 'spaghetti';
  const L = sel.taille === 'L', bw = L ? 190 : 156, bh = L ? 134 : 112, k = ZONE_SCALE[shape] || 1;

  const chips = [...new Set([...hit, ...Object.keys(inc).filter(x => inc[x])])].map(x => LABEL[x]);
  if (flat) chips.push('Pâte maison');
  if (brownie) chips.push('Kunafa pistachou', 'Crème fromagère');

  const accent = C2 || C;
  return {
    shape, inc, chips, watch: WATCH[shape],
    sauce: C || null,
    spread: !!C && flat,
    spreadScale: shape === 'spaghetti' ? .72 : 1,
    drizzle: C2 && !choux && !brownie ? C2[1] : null,
    zig: accent ? [accent[1], accent[2]] : null,
    // Le brownie est rectangulaire : la zone de garnitures (200×200) s'aplatit pour tenir sur le dessus
    zone: brownie ? { kx: (bw - 22) / 170, ky: (bh - 20) / 170, ty: -6 } : { kx: k, ky: k, ty: 0 },
    brownie: { w: bw, h: bh, left: 122 - bw / 2, top: 116 - bh / 2 },
    puffs: (sel.pcs === '6' ? PUFFS_6 : PUFFS_4).map(([x, y], i) => ({ x, y, glaze: ((i % 2 && C2) || C || ['', '#F1D9A8'])[1] })),
    cream: sel.garn === 'farcis',
    creamColor: sel.creme === 'chocolat' ? '#6B3A22' : '#FFF4CF'
  };
}
