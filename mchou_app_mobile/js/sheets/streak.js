import { html } from 'lit-html';
import { sheet } from '../components/sheet.js';
import { flameLine } from '../components/flame.js';
import { flame } from '../logic/loyalty.js';

export const streakSheet = (s, app) => {
  const fl = flame(s);
  return sheet({ cls: 'streak', onClose: () => app.closeSheet() }, html`
    <div class="streak__badge"><span class="ms fill">local_fire_department</span></div>
    <span class="streak__title">${fl.title}</span>
    <div class="streak__msg">
      <span class="streak__head">${fl.head}</span>
      <span class="streak__sub">${fl.sub}</span>
    </div>
    ${flameLine(fl)}
    <span class="streak__info"><span class="ms fill">info</span>Une commande dans la semaine allume une flamme. Une semaine sans commande et la série repart à zéro.</span>
    <button type="button" class="cta" @click=${() => app.closeSheet()}>Compris</button>`);
};
