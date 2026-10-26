import { html, nothing } from 'lit-html';
import { live } from 'lit-html/directives/live.js';
import { digits } from '../logic/format.js';
import { totals } from '../logic/cart.js';
import { brand, last4, mad } from '../logic/payment.js';
import { validateOtp } from '../actions/order.js';
import { sheet } from '../components/sheet.js';

const OTP = '482913';

// Page 3-D Secure de la banque (CMI), aux couleurs de la banque et non de M'Chou
export const tdsSheet = (s, app) => {
  const ready = s.otp.length === 6;
  return sheet({ root: 'sheet--tds', cls: 'tds' }, html`
    <div class="tds__head">
      <span class="tds__badge"><span class="ms fill">lock</span>3-D SECURE · CMI</span>
      <button type="button" class="tds__cancel" @click=${() => app.set({ sheet: null, tdsBusy: false })}>Annuler</button>
    </div>
    <span class="tds__title">Confirme ton paiement</span>
    <div class="tds__grid">
      <span>Marchand</span><b>M'CHOU OUJDA</b>
      <span>Montant</span><b>${mad(totals(s).total)}</b>
      <span>Carte</span><b dir="ltr">${brand(s.num) || 'Carte'} •••• ${last4(s.num)}</b>
    </div>
    <span class="tds__info">Ta banque a envoyé un code à 6 chiffres au <span dir="ltr">+212 6•• •• •• 78</span>.</span>
    <input class="tds__otp" dir="ltr" placeholder="••••••" aria-label="Code SMS" .value=${live(s.otp)} @input=${e => app.set({ otp: digits(e.target.value).slice(0, 6) })}>
    ${s.tdsSms && !ready && !s.tdsBusy ? html`
      <button type="button" class="tds__sms" @click=${() => { app.set({ otp: OTP }); app.snd('pop'); }}><span class="ms fill">sms</span>Code reçu par SMS · ${OTP}</button>` : nothing}
    ${s.tdsBusy
      ? html`<div class="tds__btn"><span class="tds__spin" data-spin></span>Vérification…</div>`
      : ready
        ? html`<button type="button" class="tds__btn" @click=${() => validateOtp(app)}>Valider</button>`
        : html`<div class="tds__btn is-off">Valider</div>`}`);
};
