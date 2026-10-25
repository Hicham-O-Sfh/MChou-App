import { html, nothing } from 'lit-html';

export const toastView = (t, app) => html`
  <div class="toast" data-toast>
    <span class="ms fill toast__icon tone-${t.tone}">${t.icon}</span>
    <span class="toast__text">${t.text}</span>
    ${t.action ? html`<button type="button" class="toast__action" @click=${() => app.toastAction()}>${t.action.label}</button>` : nothing}
  </div>`;
