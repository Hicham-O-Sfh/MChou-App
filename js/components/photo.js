/* Copyright (c) 2026 - Ing. Développeur Hicham Oussama Saffih */
import { html } from 'lit-html';

const EMPTY_ICON = html`
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>
  </svg>`;

// Photo de assets/photos/ si elle est fournie, sinon l'emplacement vide légendé
export const photo = (label, src) =>
  src
    ? html`<img class="photo" src=${src} alt=${label}>`
    : html`<div class="photo photo--empty">${EMPTY_ICON}<span class="photo__cap">${label}</span></div>`;
