import { html, nothing } from 'lit-html';
import { live } from 'lit-html/directives/live.js';
import { fmtPhone, phoneInput, phoneState } from '../logic/phone.js';

export const progress = (done, total) => html`
  <div class="progress">${Array.from({ length: total }, (_, i) => html`<span class=${i < done ? 'is-on' : ''}></span>`)}</div>
  <span class="progress-n">${done}/${total}</span>`;

export const phoneField = (s, app, size = '') => {
  const st = phoneState(s.phone, s.phoneBlur);
  return html`
    <span class="field ${size} ${st === 'ok' ? 'is-ok' : st === 'err' ? 'is-err' : ''}">
      <span class="field__prefix" dir="ltr">+212</span>
      <input class="field__input" type="tel" dir="ltr" placeholder="6 12 34 56 78"
        .value=${live(fmtPhone(s.phone))}
        @input=${e => app.set({ phone: phoneInput(e.target.value, app.s.phone) })}
        @blur=${() => app.set({ phoneBlur: true })}>
      ${st === 'ok' ? html`<span class="ms fill field__ok">check_circle</span>` : nothing}
    </span>`;
};

export const phoneError = s => phoneState(s.phone, s.phoneBlur) === 'err'
  ? html`<span class="form-error"><span class="ms fill">error</span>Un mobile marocain commence par 6 ou 7, avec 9 chiffres.</span>`
  : nothing;
