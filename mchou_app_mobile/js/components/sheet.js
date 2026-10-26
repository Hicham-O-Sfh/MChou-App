import { html, nothing } from 'lit-html';

// Sans onClose, le voile ne ferme pas la feuille (ex. 3-D Secure)
export const sheet = ({ onClose, cls = '', root = '', grip = true }, body) => html`
  <div class="sheet ${root}">
    <div class="sheet__scrim" data-scrim @click=${onClose}></div>
    <div class="sheet__panel ${cls}" data-panel>
      ${grip ? html`<span class="sheet__grip"></span>` : nothing}
      ${body}
    </div>
  </div>`;
