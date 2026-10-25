import { html } from 'lit-html';
import { photo } from '../components/photo.js';
import { googleG } from '../components/google-g.js';

const CARDS = [['login-1', 'Crêpe Nutella banane'], ['login-2', 'Mojito fraise'], ['login-3', 'Brownie pistache'], ['login-4', 'Choux']];

export default {
  id: 'login',
  label: 'Google sign-in',
  status: 'clear',

  view: (s, app) => html`
    <section class="screen login" data-screen="login">
      <div class="grain"></div>
      <div class="login__collage" dir="ltr">
        ${CARDS.map(([id, label]) => html`<div class="login__card login__card--${id}"><div class="login__pic">${photo(label)}</div></div>`)}
        <img class="login__logo" src="assets/mchou-logo.png" alt="">
        <span class="login__dot login__dot--green"></span>
        <span class="login__dot login__dot--pink"></span>
        <span class="login__dot login__dot--gold"></span>
      </div>
      <div class="login__foot">
        <div class="login__titles">
          <span class="login__title">Bienvenue chez M'Chou</span>
          <span class="login__script">crêpes, choux &amp; brownies</span>
        </div>
        <span class="login__pitch">Livrés tout chauds partout à Oujda. Chaque dirham dépensé te rapporte un Miam.</span>
        <div class="login__actions">
          <button type="button" class="btn-google" @click=${() => { app.snd('tap'); app.set({ sheet: 'google', gbusy: false }); }}>
            ${googleG(20)}Continuer avec Google
          </button>
          <button type="button" class="btn-outline" @click=${() => { app.snd('tap'); app.go('phone'); }}>
            <span class="ms">call</span>Continuer avec mon numéro
          </button>
        </div>
        <span class="login__legal">En continuant, tu acceptes nos <u>Conditions</u> et notre <u>Politique de confidentialité</u>.</span>
      </div>
    </section>`
};
