/* Copyright (c) 2026 - Ing. Développeur Hicham Oussama Saffih */
import { html } from 'lit-html';

export const statusBar = mode => html`
  <div class="statusbar ${mode ? `statusbar--${mode}` : ''}" dir="ltr">
    <span>9:41</span>
    <span class="statusbar__icons">
      <span class="ms">signal_cellular_alt</span><span class="ms">wifi</span><span class="ms statusbar__battery">battery_full</span>
    </span>
  </div>`;
