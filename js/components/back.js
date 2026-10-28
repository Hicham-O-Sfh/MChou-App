/* Copyright (c) 2026 - Ing. Développeur Hicham Oussama Saffih */
import { html } from 'lit-html';

export const backButton = app => html`
  <button type="button" class="icon-btn" aria-label="Retour" @click=${() => {
    app.snd('tap');
    app.back();
  }}>
    <span class="ms flip-rtl">arrow_back</span>
  </button>`;
