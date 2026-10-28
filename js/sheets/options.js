/* Copyright (c) 2026 - Ing. Développeur Hicham Oussama Saffih */
import { html, nothing } from 'lit-html';
import { P, FM, axOn, optUnit, optLabel, exNames } from '../logic/catalog.js';
import { MAX_PICK } from '../logic/cart.js';
import { addLine, addedToast } from '../actions/cart.js';
import { fly } from '../ui/fx.js';
import { sheet } from '../components/sheet.js';
import { axisPicker } from '../components/axis.js';

const price = s => {
  const o = s.po,
    p = o && P[o.id];
  return p ? optUnit(p, o.sel, o.ex) * o.qty : null;
};

const setPo = (app, ch) => app.set(s => ({ po: { ...s.po, ...ch } }));

function add(app) {
  const o = app.s.po,
    p = P[o.id];
  const line = {
    id: p.id,
    v: optLabel(p, o.sel),
    ex: exNames(o.ex),
    sugar: true,
    note: '',
    unit: optUnit(p, o.sel, o.ex),
    qty: o.qty
  };
  fly(app.$('[data-opt-thumb]'), p.icon, () => addLine(app, line), 56);
  app.closeSheet(() => addedToast(app, o.qty));
}

export const optionsSheet = (s, app) => {
  const po = s.po,
    p = po && P[po.id];
  if (!p) return nothing;
  const fam = FM[p.cat],
    d = p.d || fam.note || '';
  return sheet(
    { cls: 'opts', grip: false, onClose: () => app.closeSheet() },
    html`
    <div class="opts__head">
      <span class="sheet__grip"></span>
      <div class="opts__id">
        <span class="opts__thumb" data-opt-thumb style="background:${p.tint}"><span class="ms fill">${p.icon}</span></span>
        <span class="opts__txt">
          <span class="opts__fam">${fam.n}</span>
          <span class="opts__name">${p.full}</span>
          ${d ? html`<span class="opts__d">${d}</span>` : nothing}
        </span>
        <button type="button" class="close-btn" aria-label="Fermer" @click=${() => app.closeSheet()}><span class="ms">close</span></button>
      </div>
    </div>
    <div class="opts__body scroll">
      ${p.ax
        .filter(a => axOn(a, po.sel))
        .map(a =>
          axisPicker(p, po.sel, a, sel => {
            app.snd('tap');
            setPo(app, { sel });
          })
        )}
    </div>
    <div class="opts__foot">
      <div class="stepper">
        <button type="button" class=${po.qty > 1 ? '' : 'is-off'} aria-label="Moins" @click=${() => {
          if (po.qty > 1) {
            app.snd('off');
            setPo(app, { qty: po.qty - 1 });
          }
        }}><span class="ms">remove</span></button>
        <span class="stepper__n">${po.qty}</span>
        <button type="button" aria-label="Plus" @click=${() => {
          if (po.qty < MAX_PICK) {
            app.snd('pop');
            setPo(app, { qty: po.qty + 1 });
          }
        }}><span class="ms">add</span></button>
      </div>
      <button type="button" class="cta cta--fill press" @click=${() => add(app)}>Ajouter<span class="cta__dot"></span><span class="tabnum">${s.tw.o ?? price(s)} DH</span></button>
    </div>`
  );
};

// Le total compte jusqu'au nouveau prix quand une option change
export function optionsEffects(prev, s, app) {
  const a = price(prev),
    b = price(s);
  if (a != null && b != null && a !== b && prev.po.id === s.po.id) app.tween('o', s.tw.o ?? a, b);
}
