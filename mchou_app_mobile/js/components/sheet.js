import { html } from 'lit-html';

export const sheet = ({ onClose, cls = '' }, body) => html`
  <div class="sheet">
    <div class="sheet__scrim" data-scrim @click=${onClose}></div>
    <div class="sheet__panel ${cls}" data-panel>
      <span class="sheet__grip"></span>
      ${body}
    </div>
  </div>`;
