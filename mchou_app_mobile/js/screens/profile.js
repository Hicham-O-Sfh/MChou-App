import { html, nothing } from 'lit-html';
import { live } from 'lit-html/directives/live.js';
import { fmtKm } from '../logic/geo.js';
import { longDate } from '../logic/time.js';
import { phoneField, phoneError } from '../components/onboarding.js';
import { miamCoin } from '../components/money.js';

const EMAIL = 'Marouane.Berrichi@gmail.com';

// L'anniversaire ne se renseigne qu'une fois, ensuite il est verrouillé
function saveBday(app) {
  const v = app.s.bdayDraft;
  if (!v || app.s.bday) return;
  app.set({ bday: v });
  app.snd('ding');
  app.toast('Anniversaire enregistré', { icon: 'cake', tone: 'gold' });
}

function dropCard(app) {
  const c = app.s.savedCard;
  app.set({ savedCard: null });
  app.snd('off');
  app.toast('Carte supprimée', { icon: 'delete', tone: 'err', action: { label: 'Annuler', fn: () => app.set({ savedCard: c }) } });
}

function logout(app) {
  app.snd('off');
  app.go('login', { reset: true, back: true });
  setTimeout(() => app.toast('À bientôt chez M’Chou !', { icon: 'waving_hand', tone: 'gold' }), 420);
}

const infoRow = (icon, main, sub, action) => html`
  <div class="info-row">
    <span class="info-row__ic"><span class="ms fill">${icon}</span></span>
    <span class="info-row__txt">${main}<span class="info-row__sub">${sub}</span></span>
    ${action}
  </div>`;

const helpRow = (icon, iconCls, label, onClick, { chevron = true, danger = false } = {}) => html`
  <button type="button" class="help-row ${danger ? 'help-row--danger' : ''}" @click=${onClick}>
    <span class="ms help-row__ic ${iconCls}">${icon}</span>
    <span class="help-row__label">${label}</span>
    ${chevron ? html`<span class="ms flip-rtl help-row__go">chevron_right</span>` : nothing}
  </button>`;

function bday(app, s) {
  if (s.bday) {
    return html`
      <div class="bday-locked">
        <span class="info-row__ic"><span class="ms fill">cake</span></span>
        <span class="info-row__txt"><span class="info-row__main">${longDate(s.bday)}</span><span class="info-row__sub tone-idle">Anniversaire enregistré, il n'est plus modifiable</span></span>
        <span class="ms fill tone-idle">lock</span>
      </div>`;
  }
  return html`
    <div class="bday">
      <span class="field-label">Ton anniversaire <span class="field-label__opt">facultatif</span></span>
      <div class="bday__row">
        <input class="text-input bday__input" type="date" aria-label="Date d'anniversaire" .value=${live(s.bdayDraft)} @input=${e => app.set({ bdayDraft: e.target.value })}>
        <button type="button" class="bday__save ${s.bdayDraft ? 'is-ready' : ''}" @click=${() => saveBday(app)}>Valider</button>
      </div>
      <span class="bday__hint"><span class="ms">info</span>Tu ne pourras la renseigner qu'une seule fois, vérifie bien.</span>
    </div>`;
}

export default {
  id: 'profile',
  label: 'Profile',
  bar: true,

  view: (s, app) => {
    const name = s.fname.trim();
    return html`
      <section class="screen page" data-screen="profile">
        <div class="grain"></div>
        <div class="tab-top"><span class="tab-top__title">Profil</span></div>
        <div class="tab-scroll tab-scroll--tight scroll" data-scroll>
          <div class="me">
            <div class="me__id">
              <span class="me__avatar">${(name[0] || 'M').toUpperCase()}</span>
              <span class="me__txt"><span class="me__name">${name || 'Marouane'} Berrichi</span><span class="me__mail">${EMAIL}</span><span class="me__acc">Compte Google</span></span>
            </div>
            <button type="button" class="me__perks" @click=${() => { app.snd('tap'); app.go('gifts'); }}>
              ${miamCoin(true)}<span class="me__miams">${s.miams} Miams</span><span class="me__sep"></span>
              <span class="ms fill tone-flame">local_fire_department</span><span class="me__streak">${s.streak}</span>
              <span class="me__space"></span><span class="me__link">Mes cadeaux</span><span class="ms flip-rtl me__go">chevron_right</span>
            </button>
          </div>

          <span class="section-k profile__k">MES INFOS</span>
          <label class="form-field"><span class="field-label">Prénom</span>
            <input class="text-input" placeholder="Ton prénom" .value=${live(s.fname)} @input=${e => app.set({ fname: e.target.value.replace(/\s+/g, ' ').slice(0, 24) })}>
          </label>
          <label class="form-field"><span class="field-label">Numéro de téléphone <span class="field-label__opt">facultatif, mais conseillé</span></span>
            ${phoneField(s, app, 'field--m')}
          </label>
          ${phoneError(s)}
          ${bday(app, s)}

          <span class="section-k profile__k">MON ADRESSE</span>
          ${infoRow('location_on', html`<span class="info-row__main">${s.q}, ${s.city}</span>`, `≈ ${fmtKm(s.dist)} km de M’Chou`,
            html`<button type="button" class="link-action" @click=${() => { app.set({ addrEdit: true }); app.go('address'); }}>Modifier</button>`)}

          <span class="section-k profile__k">MES COMMANDES</span>
          ${s.orders.length ? html`
            <div class="orders">
              <div class="orders__row orders__row--head"><span>DATE</span><span>ARTICLES</span><span class="orders__total">TOTAL</span></div>
              ${s.orders.slice(0, 8).map(o => html`
                <div class="orders__row"><span class="tabnum">${o.date}</span><span class="orders__items">${o.items}</span><span class="orders__total orders__dh">${o.total} DH</span></div>`)}
            </div>` : html`<span class="profile__empty">Pas encore de commande.</span>`}

          <span class="section-k profile__k">PAIEMENT</span>
          ${s.savedCard
            ? infoRow('credit_card', html`<span class="info-row__main" dir="ltr">${s.savedCard.brand} •••• ${s.savedCard.last4}</span>`, 'Carte enregistrée',
              html`<button type="button" class="link-action info-row__drop" @click=${() => dropCard(app)}>Supprimer</button>`)
            : html`<span class="profile__empty">Aucune carte enregistrée. Elle s'enregistre à ton prochain paiement par carte.</span>`}

          <span class="section-k profile__k">LANGUE</span>
          <div class="lang">
            <span class="lang__on">Français</span>
            <button type="button" class="lang__ar" @click=${() => app.toast('La version arabe arrive bientôt', { icon: 'translate', tone: 'idle' })}>العربية</button>
          </div>

          <span class="section-k profile__k">AIDE ET COMPTE</span>
          <div class="help">
            ${helpRow('chat', 'fill tone-ok', 'Contacter M\'Chou', () => app.toast('Ouverture de WhatsApp…', { icon: 'chat' }))}
            ${helpRow('help', 'fill tone-soft', 'Questions fréquentes', () => app.soon('Les questions fréquentes'))}
            ${helpRow('description', 'fill tone-soft', 'Conditions et confidentialité', () => app.soon('Les conditions'))}
            ${helpRow('logout', 'tone-soft flip-rtl', 'Se déconnecter', () => logout(app), { chevron: false })}
            ${helpRow('delete', '', 'Supprimer mon compte', () => app.toast('On t’envoie un e-mail pour confirmer la suppression', { icon: 'mail', tone: 'err' }), { chevron: false, danger: true })}
          </div>
        </div>
      </section>`;
  }
};
