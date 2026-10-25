import { html, nothing } from 'lit-html';
import { live } from 'lit-html/directives/live.js';
import { TAG_STYLE } from '../data/catalog.js';

export const tag = t => html`<span class="tag tag--${TAG_STYLE[t] || 'n1'}">${t}</span>`;

export const addButton = (onAdd, cls = '') => html`
  <button type="button" class="add-btn ${cls}" aria-label="Ajouter" @click=${onAdd}><span class="ms">add</span></button>`;

// Pastille − n + des produits déjà au panier ; cls : qty--row (liste du menu), qty--plum (packs)
export const qtyPill = (n, onMinus, onAdd, cls = '') => html`
  <div class="qty ${cls}">
    <button type="button" aria-label="Retirer" @click=${onMinus}><span class="ms">remove</span></button>
    <span class="qty__n">${n}</span>
    <button type="button" aria-label="Ajouter" @click=${onAdd}><span class="ms">add</span></button>
  </div>`;

export const searchBar = ({ value, placeholder, onInput, onClear }) => html`
  <label class="search">
    <span class="ms">search</span>
    <input class="search__input" .value=${live(value)} placeholder=${placeholder} @input=${onInput}>
    ${value ? html`<button type="button" class="search__clear" aria-label="Effacer" @click=${onClear}><span class="ms">close</span></button>` : nothing}
  </label>`;
