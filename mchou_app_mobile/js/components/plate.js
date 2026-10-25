import { html, nothing } from 'lit-html';
import { PIECES } from '../data/plate-pieces.js';

const geo = (x, y, w, h, r) => [
  x != null && `left:${x}px`, y != null && `top:${y}px`, w != null && `width:${w}px`, h != null && `height:${h}px`, r && `transform:rotate(${r}deg)`
].filter(Boolean).join(';');

const pieces = rows => rows.map(([kind, x, y, w, h, r, kids]) => html`
  <span class="pc pc-${kind}" style=${geo(x, y, w, h, r)}>${kids ? pieces(kids) : nothing}</span>`);

// Les pièces ne bougent jamais : rendues une fois, réutilisées à chaque rendu
const L = Object.fromEntries(Object.entries(PIECES).map(([k, rows]) => [k, pieces(rows)]));

// Ordre d'empilement des garnitures dans l'assiette
const TOPS = ['banane', 'fraise', 'amande', 'lotus', 'chantilly', 'oreo', 'pistache', 'kunafa'];

const GAUFRE_DRIPS = [[46, 152, 12, 24, 16, 14], [78, 156, 14, 34, 18, 16], [112, 154, 12, 22, 16, 14], [138, 146, 12, 28, 16, 14]];
const GAUFRE_SIDES = [[156, 92, 22], [156, 128, 16]];
const BROWNIE_DRIPS = [[10, 18, 24], [34, 10, 16], [58, 22, 28], [82, 12, 18]];
const DRIZZLE = [[44, 58, 112], [34, 88, 132], [40, 118, 120], [56, 146, 90]];
const ZIG = '2,42 9,6 16,94 24,5 31,95 39,6 46,94 54,5 61,95 69,6 76,94 84,5 91,93 98,34';

const on = b => (b ? 'is-on' : '');

const SHAPES = {
  crepe: () => html`<div class="crepe"></div>`,
  spaghetti: () => html`<div class="nest">${L.noodles}</div>`,
  gaufre: v => html`
    <div class="gaufre">
      <div class="gaufre__sauce ${on(v.sauce)}">
        ${GAUFRE_DRIPS.map(([x, y, w, h, bw, bh]) => html`
          <span class="gaufre__drip" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;border-radius:0 0 ${w / 2}px ${w / 2}px">
            <span class="gaufre__blob" style="width:${bw}px;height:${bh}px"></span>
          </span>`)}
        ${GAUFRE_SIDES.map(([x, y, w]) => html`<span class="gaufre__side" style="left:${x}px;top:${y}px;width:${w}px"></span>`)}
        <div class="gaufre__glaze"><span class="gaufre__shine"></span><span class="gaufre__shine gaufre__shine--b"></span></div>
      </div>
    </div>`,
  brownie: v => html`
    <div class="brownie" style="left:${v.brownie.left}px;top:${v.brownie.top}px;width:${v.brownie.w}px;height:${v.brownie.h}px">
      <div class="brownie__cream"></div>
      <div class="brownie__sauce ${on(v.sauce)}">
        ${BROWNIE_DRIPS.map(([x, b, h]) => html`<span class="brownie__drip" style="left:${x}%;bottom:-${b}px;height:${h}px"></span>`)}
      </div>
      <div class="brownie__crumble"></div>
      <div class="brownie__zig ${on(v.sauce)}">
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polyline class="zig zig--edge" points=${ZIG}></polyline>
          <polyline class="zig zig--main" points=${ZIG}></polyline>
          <polyline class="zig zig--shine" points=${ZIG}></polyline>
        </svg>
      </div>
    </div>`,
  choux: v => html`
    <div class="choux">
      ${v.puffs.map(pf => html`
        <span class="puff" style="left:${pf.x}px;top:${pf.y}px;--glaze:${pf.glaze}">
          <span class="puff__cap"></span><span class="puff__tip"></span><span class="puff__cream ${on(v.cream)}"></span>
        </span>`)}
    </div>`
};

// v : plateOf(produit, options) ; ex : suppléments cochés ; sugar : sucre glace visible
export function plateView(v, ex, sugar) {
  const [s1, s2, s3] = v.sauce || ['transparent', 'transparent', 'transparent'];
  const [zz, zo] = v.zig || ['transparent', 'transparent'];
  const vars = `--s1:${s1};--s2:${s2};--s3:${s3};--zz:${zz};--zo:${zo};--d1:${v.drizzle || 'transparent'};--cream:${v.creamColor}`;
  const topOn = k => ex[k] || (k !== 'banane' && v.inc[k]);
  return html`
    <div class="plate" data-plate dir="ltr" style=${vars}>
      <div class="plate__food" data-crepe>
        ${SHAPES[v.shape](v)}
        <div class="plate__zone" style="transform:translateY(${v.zone.ty}px) scale(${v.zone.kx},${v.zone.ky})">
          <div class="spread ${on(v.spread)}" style="transform:scale(${v.spreadScale})">
            <span class="spread__shine"></span><span class="spread__ring"></span><span class="spread__core"></span><span class="spread__edge"></span>
          </div>
          <div class="drizzle ${on(v.drizzle)}">
            ${DRIZZLE.map(([x, y, w]) => html`<span style="left:${x}px;top:${y}px;width:${w}px"></span>`)}
          </div>
          <div class="layer ${on(v.shape === 'spaghetti')}" data-strands>${L.strands}</div>
          <div class="layer ${on(v.inc.banane)}">${L.incBanana}</div>
          <div class="layer ${on(v.inc.bueno)}" data-inc="bueno">${L.bueno}</div>
          ${TOPS.map(k => html`<div class="layer layer--top ${on(topOn(k))}" data-top=${k}>${L[k]}</div>`)}
          <div class="sugar ${on(sugar)}" data-top="sucre"></div>
        </div>
      </div>
    </div>`;
}
