import { html, nothing } from 'lit-html';
import { live } from 'lit-html/directives/live.js';
import { totals } from '../logic/cart.js';
import { etaRange, fmtKm } from '../logic/geo.js';
import { fmtPhone } from '../logic/phone.js';
import { slots, currentSlot } from '../logic/time.js';
import { brand, cardErrors, cardInput, expInput, cvvInput, nameInput } from '../logic/payment.js';
import { place, scanCard, DEMO_CART } from '../actions/order.js';
import { backButton } from '../components/onboarding.js';
import { miamCoin, feeRows } from '../components/money.js';

const pick = (app, patch) => { app.snd('tap'); app.set(patch); };

const payOption = (isOn, icon, tone, title, sub, onClick) => html`
  <button type="button" class="pay ${isOn ? 'is-on' : ''}" @click=${onClick}>
    <span class="pay__ic"><span class="ms fill tone-${tone}">${icon}</span></span>
    <span class="pay__txt"><span class="pay__title">${title}</span><span class="pay__sub">${sub}</span></span>
    <span class="pay__dot"></span>
  </button>`;

const cardField = (label, err, input) => html`
  <label class="cform__field">
    <span class="field-label">${label}</span>
    ${input}
    ${err ? html`<span class="cform__err">${err}</span>` : nothing}
  </label>`;

function cardForm(app, s) {
  const e = s.cardTry ? cardErrors(s) : {}, b = brand(s.num);
  const bad = k => (e[k] ? 'is-err' : '');
  return html`
    <div class="cform" data-cardform>
      <button type="button" class="cform__scan" @click=${() => scanCard(app)}><span class="ms fill">photo_camera</span>Scanner ma carte</button>
      ${cardField('Numéro de carte', e.num, html`
        <span class="cform__num ${bad('num')}">
          <input class="cform__num-input" dir="ltr" placeholder="1234 5678 9012 3456" .value=${live(s.num)}
            @input=${ev => app.set({ num: cardInput(ev.target.value, app.s.num), payErr: '' })}>
          ${b ? html`<span class="cform__brand">${b}</span>` : nothing}
        </span>`)}
      <div class="cform__pair">
        ${cardField('Expiration', e.exp, html`
          <input class="cform__input ${bad('exp')}" dir="ltr" placeholder="MM/AA" .value=${live(s.exp)} @input=${ev => app.set({ exp: expInput(ev.target.value, app.s.exp) })}>`)}
        ${cardField('Cryptogramme', e.cvv, html`
          <input class="cform__input ${bad('cvv')}" dir="ltr" placeholder="123" .value=${live(s.cvv)} @input=${ev => app.set({ cvv: cvvInput(ev.target.value) })}>`)}
      </div>
      ${cardField('Nom sur la carte', e.name, html`
        <input class="cform__input cform__input--name ${bad('name')}" placeholder="Marouane Berrichi" .value=${live(s.cname)} @input=${ev => app.set({ cname: nameInput(ev.target.value) })}>`)}
      <button type="button" class="cform__save ${s.saveCard ? 'is-on' : ''}" @click=${() => pick(app, { saveCard: !app.s.saveCard })}>
        <span class="cform__save-txt">Enregistrer la carte pour la prochaine fois</span>
        <span class="switch"><span class="switch__knob"></span></span>
      </button>
      <span class="cform__lock"><span class="ms fill">lock</span>Paiement sécurisé par le CMI avec 3-D Secure. M'Chou ne voit jamais ton numéro de carte.</span>
    </div>`;
}

export default {
  id: 'checkout',
  label: 'Checkout',

  view: (s, app) => {
    const t = totals(s), shown = s.tw.ct ?? t.total, later = s.when === 'later', slot = currentSlot(s.slot, s.now);
    return html`
      <section class="screen page" data-screen="checkout">
        <div class="grain"></div>
        <div class="page__top">${backButton(app)}<span class="page__title">Paiement</span></div>
        <div class="page__scroll scroll checkout__scroll">
          <span class="section-k">LIVRAISON</span>
          <div class="deliv">
            <div class="deliv__addr">
              <span class="deliv__ic"><span class="ms fill">location_on</span></span>
              <span class="deliv__txt"><span class="deliv__main">${s.q}, ${s.city}</span><span class="deliv__sub">≈ ${fmtKm(s.dist)} km de M’Chou</span></span>
              <button type="button" class="deliv__edit" @click=${() => { app.set({ addrEdit: true }); app.go('address'); }}>Modifier</button>
            </div>
            <div class="deliv__sep"></div>
            <div class="deliv__when">
              <button type="button" class="when ${later ? '' : 'is-on'}" @click=${() => pick(app, { when: 'asap' })}>
                <span class="when__title"><span class="ms fill">bolt</span>Dès que possible</span><span class="when__sub">${etaRange(s.dist)}</span>
              </button>
              <button type="button" class="when ${later ? 'is-on' : ''}" @click=${() => pick(app, { when: 'later' })}>
                <span class="when__title"><span class="ms">schedule</span>Programmer</span><span class="when__sub">${later ? `à ${slot}` : 'Choisis un créneau'}</span>
              </button>
            </div>
            ${later ? html`
              <div class="slots scroll-x">
                ${slots(s.now).map(v => html`<button type="button" class="slot ${v === slot ? 'is-on' : ''}" @click=${() => pick(app, { slot: v })}>${v}</button>`)}
              </div>` : nothing}
            <div class="deliv__sep"></div>
            <div class="deliv__phone">
              <span class="deliv__ic"><span class="ms fill">call</span></span>
              <span class="deliv__txt">
                <span class="deliv__main" dir="ltr">${s.phone ? `+212 ${fmtPhone(s.phone)}` : 'Pas de numéro'}</span>
                <span class="deliv__sub">${s.phone ? 'Le livreur t’appelle à ce numéro si besoin' : 'Ajoute-le via Modifier, c’est conseillé'}</span>
              </span>
            </div>
          </div>
          <span class="section-k section-k--gap">PAIEMENT</span>
          ${s.payErr ? html`<div class="pay-err"><span class="ms fill">credit_card_off</span><span>${s.payErr}</span></div>` : nothing}
          ${payOption(s.pay === 'card', 'credit_card', 'gold', 'Carte bancaire', 'Visa, Mastercard, cartes marocaines', () => pick(app, { pay: 'card', payErr: '' }))}
          ${s.pay === 'card' ? cardForm(app, s) : nothing}
          ${payOption(s.pay === 'cash', 'payments', 'ok', 'Espèces à la livraison', 'Prépare ton billet, on gère la monnaie', () => pick(app, { pay: 'cash', payErr: '' }))}
          <span class="section-k section-k--gap">RÉCAP · ${t.count} ${t.count > 1 ? 'articles' : 'article'}</span>
          <div class="sum">
            ${feeRows(t)}
            <div class="sum__gain">${miamCoin()}<span>+${t.gain} Miams à la livraison</span></div>
          </div>
        </div>
        <div class="checkout__foot">
          <span class="checkout__note"><span class="ms fill">lock</span>${s.pay === 'card' ? 'Carte · 3-D Secure par le CMI' : 'Espèces à la livraison'}</span>
          ${s.busy
            ? html`<div class="place place--busy"><span class="place__spin" data-spin></span>On envoie ta commande en cuisine…</div>`
            : html`<button type="button" class="place" @click=${() => place(app)}>Je me régale&nbsp;!<span class="place__total">${shown} DH</span></button>`}
        </div>
      </section>`;
  },

  jump(app) {
    if (!app.s.cart.length) app.set({ cart: DEMO_CART });
    app.go('checkout', { reset: true });
  }
};
