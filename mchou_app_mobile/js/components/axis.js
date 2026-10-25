import { html, nothing } from 'lit-html';
import { AX } from '../data/catalog.js';
import { optUnit } from '../logic/catalog.js';

// Choix d'une option (pièces, taille, arôme…) avec le prix de chaque choix
export const axisPicker = (p, sel, a, onPick, cls = '') => {
  const A = AX[a];
  return html`
    <div class="axis ${cls}">
      <span class="axis__n">${A.n}</span>
      <div class="axis__opts">
        ${A.o.map(([val, label]) => {
          const isOn = sel[a] === val, next = { ...sel, [a]: val };
          const pr = A.price ? `${optUnit(p, next)} DH` : A.add && val ? `+${A.add} DH` : '';
          return html`
            <button type="button" class="opt-chip ${isOn ? 'is-on' : ''}" @click=${() => { if (!isOn) onPick(next, val); }}>
              <span class="opt-chip__l">${label}</span>${pr ? html`<span class="opt-chip__p">${pr}</span>` : nothing}
            </button>`;
        })}
      </div>
    </div>`;
};
