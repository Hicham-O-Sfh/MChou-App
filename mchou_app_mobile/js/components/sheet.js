import { html, nothing } from 'lit-html';

export const sheet = ({ onClose, cls = '', grip = true }, body) => html`
  <div class="sheet">
    <div class="sheet__scrim" data-scrim @click=${onClose}></div>
    <div class="sheet__panel ${cls}" data-panel>
      ${grip ? html`<span class="sheet__grip"></span>` : nothing}
      ${body}
    </div>
  </div>`;
