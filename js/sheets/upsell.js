/* Copyright (c) 2026 - Ing. Développeur Hicham Oussama Saffih */
import { html } from 'lit-html';
import { P, defLine } from '../logic/catalog.js';
import { addLine, addedToast } from '../actions/cart.js';
import { bump } from '../ui/motion.js';
import { sheet } from '../components/sheet.js';
import { photo } from '../components/photo.js';

const UPS = ['mojito-fraise', 'shake-oreo'];

function addUp(app, id) {
  addLine(app, defLine(id));
  app.set(s => ({ upsAdded: { ...s.upsAdded, [id]: true } }));
  app.snd('ding');
  app.buzz(8);
  bump(app.$('[data-cart-target]'));
}

// Retour à l'écran d'où vient le builder (menu ou accueil)
function decline(app) {
  app.closeSheet(() => {
    app.go(app.s.hist.at(-1) === 'menu' ? 'menu' : 'home', { reset: true, back: true });
    addedToast(app);
  });
}

export const upsellSheet = (s, app) =>
  sheet(
    { cls: 'ups', onClose: () => decline(app) },
    html`
  <div class="ups__ok"><span class="ms fill">check_circle</span><span>${P[s.bid].full} est dans ton panier</span></div>
  <span class="ups__title">Une boisson avec ça&nbsp;?</span>
  ${UPS.map(id => {
    const p = P[id];
    return html`
      <div class="ups__item">
        <div class="ups__pic" style="background:${p.tint}">${photo(p.full)}</div>
        <span class="ups__txt"><span class="ups__name">${p.full}</span><span class="ups__price">${p.price} DH</span></span>
        ${
          s.upsAdded[id]
            ? html`<span class="ups__added"><span class="ms fill">check_circle</span>Ajouté</span>`
            : html`<button type="button" class="ups__add" aria-label="Ajouter" @click=${() => addUp(app, id)}><span class="ms">add</span></button>`
        }
      </div>`;
  })}
  <div class="ups__actions">
    <button type="button" class="btn-ghost" @click=${() => decline(app)}>${Object.keys(s.upsAdded).length ? 'Continuer' : 'Non merci'}</button>
    <button type="button" class="cta press ups__cart" @click=${() => app.closeSheet(() => app.go('cart'))}>Voir mon panier</button>
  </div>`
  );
