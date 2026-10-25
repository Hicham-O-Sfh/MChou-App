import { html, nothing } from 'lit-html';
import { SCREENS, screen } from '../screens/index.js';

export const panel = (s, app) => html`
  <aside class="panel">
    <div class="panel__head">
      <img src="assets/mchou-logo.png" alt="M'Chou">
      <span class="panel__title">Prototype</span>
    </div>
    <nav class="panel__steps">
      ${SCREENS.map((sc, i) => html`
        <button type="button" class="panel__step ${sc.id === s.screen ? 'is-on' : ''}" @click=${() => app.jump(sc.id)}>
          <span class="panel__n">${String(i + 1).padStart(2, '0')}</span>${sc.label}
        </button>`)}
    </nav>
    <div class="panel__tools">${screen(s.screen).tools?.(s, app) ?? nothing}</div>
  </aside>`;
