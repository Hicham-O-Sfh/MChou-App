/* Copyright (c) 2026 - Ing. Développeur Hicham Oussama Saffih */
import { html, nothing } from 'lit-html';
import { live } from 'lit-html/directives/live.js';
import { rm } from '../config.js';
import { EX, BUILDER_EX, TAG_LONG, TAG_STYLE } from '../data/catalog.js';
import { P, axOn, optUnit, optLabel, exNames } from '../logic/catalog.js';
import { totals, MAX_PICK } from '../logic/cart.js';
import { plateOf } from '../logic/plate.js';
import { addLine } from '../actions/cart.js';
import { openBuilder } from '../actions/catalog.js';
import { fly, rel, floatTxt } from '../ui/fx.js';
import { plateView } from '../components/plate.js';
import { axisPicker } from '../components/axis.js';

const EXTRA = Object.fromEntries(EX.map(e => [e.k, e]));

const unit = s => optUnit(P[s.bid], s.bsel, s.ex);
const price = s => unit(s) * s.bqty;

const wobble = (el, kf, opts) => {
  if (el && !rm())
    el.animate(
      kf.map(x => ({ scale: String(x) })),
      opts
    );
};

// Les morceaux du supplément tombent dans l'assiette, puis la crêpe rebondit
function dropTop(app, k) {
  const layer = app.$(`[data-top="${k}"]`);
  if (!layer || rm()) return;
  [...layer.children].forEach((c, i) =>
    c.animate(
      [
        { translate: '0 -130px', scale: '1.35', opacity: 0 },
        { translate: '0 5px', scale: '.92', opacity: 1, offset: 0.72 },
        { translate: '0 0', scale: '1', opacity: 1 }
      ],
      { duration: 540, delay: i * 45, easing: 'cubic-bezier(.3,.9,.4,1)', fill: 'backwards' }
    )
  );
  wobble(app.$('[data-crepe]'), [1, 0.96, 1.03, 1], { duration: 520, delay: 260, easing: 'ease-out' });
}

function toggleEx(app, k) {
  const isOn = !app.s.ex[k];
  app.set(
    s => ({ ex: { ...s.ex, [k]: isOn }, bAdded: false }),
    () => {
      if (isOn) dropTop(app, k);
    }
  );
  app.snd(isOn ? 'pop' : 'off');
  app.buzz(6);
  const plate = app.$('[data-plate]');
  if (plate) {
    const r = rel(plate);
    floatTxt(r.x, r.y - 100, `${isOn ? '+' : '−'}${EXTRA[k].p} DH`, isOn ? '#FFD84D' : '#C9A9D1');
  }
}

function pickOption(app, sel) {
  app.set({ bsel: sel, bAdded: false });
  app.snd('pop');
  app.buzz(6);
  wobble(app.$('[data-crepe]'), [1, 0.94, 1.04, 1], { duration: 480, easing: 'ease-out' });
}

function toggleSugar(app) {
  const isOn = !app.s.sugar;
  app.set({ sugar: isOn, bAdded: false });
  app.snd(isOn ? 'pop' : 'off');
}

function setQty(app, d) {
  const q = app.s.bqty + d;
  if (q < 1 || q > MAX_PICK) return;
  app.set({ bqty: q, bAdded: false });
  app.snd(d > 0 ? 'pop' : 'off');
}

function add(app) {
  const s = app.s,
    p = P[s.bid];
  if (s.bAdded) return;
  const line = {
    id: s.bid,
    v: optLabel(p, s.bsel),
    ex: exNames(s.ex),
    sugar: p.sugar ? s.sugar : true,
    note: s.note.trim(),
    unit: unit(s),
    qty: s.bqty
  };
  app.set({ bAdded: true });
  fly(
    app.$('[data-crepe]'),
    p.icon,
    () => {
      addLine(app, line);
      app.later(() => app.openSheet('upsell'), 380);
    },
    64
  );
}

const extraRow = (k, name, priceTxt, isOn, onClick, cls = '') => html`
  <button type="button" class="ex-row ${cls} ${isOn ? 'is-on' : ''}" @click=${onClick}>
    <span class="ex-row__thumb ex-row__thumb--${k}"><span class="ex-art ex-art--${k}"></span></span>
    <span class="ex-row__txt"><span class="ex-row__name">${name}</span><span class="ex-row__price">${priceTxt}</span></span>
    <span class="switch"><span class="switch__knob"></span></span>
  </button>`;

export default {
  id: 'builder',
  label: 'Builder',
  status: 'clear',

  view: (s, app) => {
    const p = P[s.bid] || P['crepe-nb'],
      v = plateOf(p, s.bsel),
      n = totals(s).count;
    return html`
      <section class="screen builder" data-screen="builder">
        <div class="builder__stage">
          <div class="grain grain--soft"></div>
          <div class="builder__bar">
            <button type="button" class="icon-btn icon-btn--dark" aria-label="Retour" @click=${() => {
              app.snd('tap');
              app.back();
            }}>
              <span class="ms flip-rtl">arrow_back</span>
            </button>
            <button type="button" class="icon-btn icon-btn--dark builder__cart" data-cart-target aria-label="Panier" @click=${() => {
              app.snd('tap');
              app.go('cart');
            }}>
              <span class="ms fill">shopping_bag</span>
              ${n ? html`<span class="badge badge--s" data-badge>${n}</span>` : nothing}
            </button>
          </div>
          ${plateView(v, s.ex, p.sugar && s.sugar)}
        </div>
        <div class="builder__info scroll">
          <div class="builder__head">
            <div class="builder__id">
              ${p.tag ? html`<span class="tag tag--lg tag--${TAG_STYLE[p.tag] || 'n1'}">${TAG_LONG[p.tag]}</span>` : nothing}
              <span class="builder__name">${p.full}</span>
            </div>
            <span class="builder__base">${optUnit(p, s.bsel)} DH</span>
          </div>
          <span class="builder__desc">${p.desc}</span>
          <div class="ing">${v.chips.map(c => html`<span class="ing__chip"><span class="ms fill">check_circle</span>${c}</span>`)}</div>
          ${p.ax.filter(a => axOn(a, s.bsel)).map(a => axisPicker(p, s.bsel, a, sel => pickOption(app, sel), 'axis--builder'))}
          <div class="builder__sub">
            <span class="builder__title">Tes suppléments</span>
            <span class="builder__watch">${v.watch}</span>
          </div>
          ${BUILDER_EX.map(k => extraRow(k, EXTRA[k].n, `+${EXTRA[k].p} DH`, !!s.ex[k], () => toggleEx(app, k)))}
          ${p.sugar ? extraRow('sucre', 'Sucre glace', 'Offert', s.sugar, () => toggleSugar(app), 'ex-row--sugar') : nothing}
          <label class="note">
            <span class="builder__title">Un mot pour la cuisine&nbsp;?</span>
            <span class="note__box">
              <textarea class="note__input" rows="2" placeholder="Bien chaude, coupée en deux…" .value=${live(s.note)} @input=${e => app.set({ note: e.target.value.slice(0, 120) })}></textarea>
              <span class="note__len">${s.note.length}/120</span>
            </span>
          </label>
        </div>
        <div class="builder__foot">
          <div class="stepper stepper--surface">
            <button type="button" class=${s.bqty > 1 ? '' : 'is-off'} aria-label="Moins" @click=${() => setQty(app, -1)}><span class="ms">remove</span></button>
            <span class="stepper__n">${s.bqty}</span>
            <button type="button" aria-label="Plus" @click=${() => setQty(app, 1)}><span class="ms">add</span></button>
          </div>
          ${
            s.bAdded
              ? html`<div class="cta-done"><span class="ms fill">check_circle</span>Ajouté</div>`
              : html`<button type="button" class="cta cta--fill press" @click=${() => add(app)}>Ajouter<span class="cta__dot"></span><span class="tabnum">${s.tw.b ?? price(s)} DH</span></button>`
          }
        </div>
      </section>`;
  },

  // Le prix compte jusqu'à la nouvelle valeur à chaque changement
  effects(prev, s, app) {
    if (prev.ex === s.ex && prev.bqty === s.bqty && prev.bsel === s.bsel && prev.bid === s.bid) return;
    const a = price(prev),
      b = price(s);
    if (a !== b) app.tween('b', s.tw.b ?? a, b);
  },

  jump(app) {
    openBuilder(app);
  }
};
