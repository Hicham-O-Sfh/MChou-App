/* Copyright (c) 2026 - Ing. Développeur Hicham Oussama Saffih */
import { html, nothing } from 'lit-html';
import { live } from 'lit-html/directives/live.js';
import { P } from '../logic/catalog.js';
import { totals, qtyById } from '../logic/cart.js';
import { giftOf } from '../logic/loyalty.js';
import { promoInput } from '../logic/payment.js';
import { addSimple, lineQty, clearCart, applyPromo } from '../actions/cart.js';
import { DEMO_CART } from '../actions/order.js';
import { backButton } from '../components/back.js';
import { photo } from '../components/photo.js';
import { miamCoin, feeRows } from '../components/money.js';

const PAIRINGS = ['mojito-fraise', 'choux-nutella', 'shake-oreo', 'mojito-passion', 'choux-pistache'];

function lineDesc(l) {
  const d = [l.v].filter(Boolean).concat((l.ex || []).map(x => `+ ${x}`));
  if (l.sugar === false) d.push('Sans sucre glace');
  if (l.note) d.push(`« ${l.note} »`);
  if (l.gift) d.unshift(`Cadeau · ${giftOf(l.gift).cost * l.qty} Miams`);
  return d.length ? d.join(' · ') : P[l.id].sub;
}

const line = (app, l, i) => {
  const p = P[l.id];
  return html`
    <div class="cline">
      <div class="cline__pic" style="background:${p.tint}">${photo(p.full)}</div>
      <div class="cline__body">
        <span class="cline__name">${p.full}</span>
        <span class="cline__desc">${lineDesc(l)}</span>
        <div class="cline__row">
          <span class="cline__price ${l.gift ? 'is-gift' : ''}">${l.gift ? 'Offert' : `${l.unit * l.qty} DH`}</span>
          ${
            l.gift
              ? html`<button type="button" class="cline__drop" aria-label="Retirer le cadeau" @click=${() => lineQty(app, i, -1)}><span class="ms">delete</span></button>`
              : html`
              <div class="cline__qty">
                <button type="button" aria-label="Moins" @click=${() => lineQty(app, i, -1)}>
                  ${l.qty === 1 ? html`<span class="ms cline__del">delete</span>` : html`<span class="ms cline__minus">remove</span>`}
                </button>
                <span class="cline__n">${l.qty}</span>
                <button type="button" aria-label="Plus" @click=${() => lineQty(app, i, 1)}><span class="ms cline__plus">add</span></button>
              </div>`
          }
        </div>
      </div>
    </div>`;
};

function promoField(app, s) {
  const ring = s.promoOk ? 'is-ok' : s.promoErr ? 'is-err' : '';
  return html`
    <div class="promo ${ring}" data-promo>
      <span class="ms promo__ic">sell</span>
      ${
        s.promoOk
          ? html`
        <span class="promo__code">MCHOU10</span>
        <span class="promo__ok"><span class="ms fill">check_circle</span>-10 %</span>
        <button type="button" class="promo__x" aria-label="Retirer le code" @click=${() => app.set({ promoOk: false, promo: '' })}><span class="ms">close</span></button>`
          : html`
        <input class="promo__input" placeholder="Code promo" aria-label="Code promo" .value=${live(s.promo)} @input=${e => app.set({ promo: promoInput(e.target.value), promoErr: false })}>
        <button type="button" class="promo__apply" @click=${() => applyPromo(app)}>Appliquer</button>`
      }
    </div>
    ${s.promoErr && !s.promoOk ? html`<span class="promo__err"><span class="ms fill">error</span>Ce code n'existe pas ou a expiré.</span>` : nothing}`;
}

const empty = app => html`
  <div class="cart-empty">
    <div class="cart-empty__plate"><span></span><span></span><span></span></div>
    <span class="cart-empty__title">Ton assiette est vide</span>
    <span class="cart-empty__sub">Une petite crêpe pour commencer&nbsp;? La livraison est offerte dès 150 DH.</span>
    <button type="button" class="cta press cart-empty__cta" @click=${() => app.go('home', { reset: true, back: true })}>Remplir mon assiette</button>
  </div>`;

export default {
  id: 'cart',
  label: 'Cart',

  view: (s, app) => {
    const t = totals(s),
      shown = s.tw.ct ?? t.total,
      qty = qtyById(s.cart);
    const pairings = PAIRINGS.filter(id => !qty[id]).slice(0, 3);
    return html`
      <section class="screen page" data-screen="cart">
        <div class="grain"></div>
        <div class="page__top page__top--tight">
          ${backButton(app)}
          <span class="page__title">Mon panier</span>
          ${s.cart.length ? html`<button type="button" class="cart__clear" @click=${() => clearCart(app)}><span class="ms">delete</span>Vider</button>` : nothing}
        </div>
        ${
          s.cart.length
            ? html`
          <div class="page__body">
            <div class="page__scroll scroll">
              <div class="free">
                ${
                  t.free
                    ? html`<span class="free__done"><span class="ms fill">check_circle</span>Livraison offerte débloquée&nbsp;!</span>`
                    : html`<span class="free__left">Plus que <span class="tone-gold">${t.left} DH</span> pour la livraison offerte</span>`
                }
                <div class="free__bar" data-freebar>
                  <div class="free__fill" style="width:${t.pct}%"></div>
                  <span class="free__knob" style="inset-inline-start:${t.pct}%"><span class="ms fill">moped</span></span>
                </div>
                <span class="free__sub">${t.free ? 'Dès 150 DH, la livraison est pour nous.' : `${t.sub} / 150 DH · sinon livraison 15 DH`}</span>
              </div>
              ${s.cart.map((l, i) => line(app, l, i))}
              ${
                pairings.length
                  ? html`
                <div class="pair">
                  <span class="pair__title">Ça se marie bien</span>
                  <div class="pair__list scroll-x">
                    ${pairings.map(
                      id => html`
                      <div class="pair__card">
                        <div class="pair__pic" style="background:${P[id].tint}">${photo(P[id].full)}</div>
                        <span class="pair__name">${P[id].full}</span>
                        <div class="pair__row">
                          <span class="pair__price">${P[id].price} DH</span>
                          <button type="button" class="pair__add" aria-label="Ajouter" @click=${e => addSimple(app, id, e.currentTarget)}><span class="ms">add</span></button>
                        </div>
                      </div>`
                    )}
                  </div>
                </div>`
                  : nothing
              }
              ${promoField(app, s)}
              <div class="sum">
                ${feeRows(t)}
                <div class="sum__sep"></div>
                <div class="sum__total"><span>Total</span><span class="sum__amount">${shown} DH</span></div>
                <div class="sum__gain sum__gain--cart">${miamCoin()}<span>Tu gagnes <b>${t.gain} Miams</b> avec cette commande</span></div>
              </div>
            </div>
            <div class="page__foot">
              <button type="button" class="cta cta--block press" @click=${() => {
                app.snd('tap');
                app.go('checkout');
              }}>Commander<span class="cta__dot"></span><span class="tabnum">${shown} DH</span></button>
            </div>
          </div>`
            : empty(app)
        }
      </section>`;
  },

  jump(app) {
    if (!app.s.cart.length) app.set({ cart: DEMO_CART });
    app.go('cart', { reset: true });
  }
};
