import { html, nothing } from 'lit-html';
import { phoneState } from '../logic/phone.js';
import { backButton } from '../components/back.js';
import { progress, phoneField, phoneError } from '../components/onboarding.js';

export default {
  id: 'phone',
  label: 'Phone number',

  view: (s, app) => {
    const ok = phoneState(s.phone, s.phoneBlur) === 'ok';
    return html`
      <section class="screen onb" data-screen="phone">
        <div class="grain"></div>
        <div class="onb__top">${backButton(app)}${progress(1, 2)}</div>
        <div class="onb__body">
          <span class="onb__hello">Salut ${s.fname}&nbsp;!</span>
          <span class="onb__title">Ton numéro de téléphone</span>
          <span class="onb__sub">Pour que le livreur puisse te contacter.</span>
          <label class="phone__label">
            <span class="field-label">Numéro de mobile</span>
            ${phoneField(s, app)}
          </label>
          ${phoneError(s)}
          ${ok ? nothing : html`
            <button type="button" class="sim-hint" @click=${() => { app.set({ phone: '612345678' }); app.snd('pop'); }}>
              <span class="sim-hint__ic"><span class="ms fill">sim_card</span></span>
              <span class="sim-hint__txt"><span class="sim-hint__k">Numéro de ce téléphone</span><span class="sim-hint__v" dir="ltr">+212 6 12 34 56 78</span></span>
              <span class="sim-hint__use">Utiliser</span>
            </button>`}
        </div>
        <div class="onb__cta">
          ${ok
            ? html`<button type="button" class="cta cta--block press" @click=${() => { app.snd('tap'); app.set({ addrEdit: false }); app.go('address'); }}>Continuer</button>`
            : html`<div class="cta-off">Continuer</div>`}
        </div>
      </section>`;
  }
};
