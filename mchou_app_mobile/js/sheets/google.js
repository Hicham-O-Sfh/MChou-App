import { html, nothing } from 'lit-html';
import { sheet } from '../components/sheet.js';
import { googleG } from '../components/google-g.js';

function pick(app) {
  if (app.s.gbusy) return;
  app.set({ gbusy: true });
  app.later(() => { app.set({ sheet: null, gbusy: false }); app.go('phone'); }, 1000);
}

export const googleSheet = (s, app) => sheet({ cls: 'gsi', onClose: () => { if (!app.s.gbusy) app.set({ sheet: null }); } }, html`
  <div class="gsi__brand">${googleG(18)}Se connecter avec Google</div>
  <div class="gsi__head">
    <span class="gsi__title">Choisis un compte</span>
    <span class="gsi__sub">pour continuer vers <b>M'Chou</b></span>
  </div>
  <button type="button" class="gsi__account" @click=${() => pick(app)}>
    <span class="gsi__avatar">H</span>
    <span class="gsi__who"><span class="gsi__name">Marouane Berrichi</span><span class="gsi__mail">Marouane.Berrichi@gmail.com</span></span>
    ${s.gbusy ? html`<span class="gsi__spin" data-spin></span>` : nothing}
  </button>
  <div class="gsi__other"><span class="ms">person_add</span>Utiliser un autre compte</div>
  <span class="gsi__legal">Pour continuer, Google partagera ton nom, ton adresse e-mail et ta photo de profil avec M'Chou.</span>`);
