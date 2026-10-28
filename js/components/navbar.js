/* Copyright (c) 2026 - Ing. Développeur Hicham Oussama Saffih */
import { html, nothing } from 'lit-html';
import { totals } from '../logic/cart.js';

const tab = (s, app, id, icon, label) => html`
  <button type="button" class="nav__tab ${s.screen === id ? 'is-on' : ''}" @click=${() => app.tab(id)}>
    <span class="ms">${icon}</span><span class="nav__label">${label}</span>
  </button>`;

export const navBar = (s, app) => {
  const n = totals(s).count;
  return html`
    <div class="nav-fade"></div>
    <nav class="nav">
      ${tab(s, app, 'home', 'home', 'Accueil')}
      ${tab(s, app, 'menu', 'restaurant_menu', 'Menu')}
      <div class="nav__slot">
        <button type="button" class="nav__cart" data-cart-target aria-label="Panier" @click=${() => {
          app.snd('tap');
          app.go('cart');
        }}>
          <span class="ms fill">shopping_bag</span>
          ${n ? html`<span class="badge" data-badge>${n}</span>` : nothing}
        </button>
      </div>
      ${tab(s, app, 'gifts', 'redeem', 'Cadeaux')}
      ${tab(s, app, 'profile', 'person', 'Profil')}
    </nav>`;
};
