import { html } from 'lit-html';
import splash from './splash.js';
import login from './login.js';
import phone from './phone.js';
import address from './address.js';
import home from './home.js';
import menu from './menu.js';
import builder from './builder.js';
import cart from './cart.js';
import checkout from './checkout.js';
import confirm from './confirm.js';
import track from './track.js';

// Remplacé écran par écran par les modules portés (screens/<id>.js)
const todo = (id, label, opts = {}) => ({
  id, label, ...opts,
  view: (s, app) => html`
    <section class="screen" data-screen=${id}>
      <div class="grain"></div>
      <div class="todo">
        <span class="todo__tag">À porter</span>
        <h1 class="todo__title">${label}</h1>
        <button type="button" class="cta press" @click=${() => app.go(nextOf(id))}>Écran suivant</button>
      </div>
    </section>`
});

export const SCREENS = [
  splash,
  login,
  phone,
  address,
  home,
  menu,
  builder,
  cart,
  checkout,
  confirm,
  track,
  todo('gifts', 'Gifts', { bar: true }),
  todo('profile', 'Profile', { bar: true })
];

const byId = Object.fromEntries(SCREENS.map(sc => [sc.id, sc]));
export const screen = id => byId[id];

const nextOf = id => SCREENS[(SCREENS.findIndex(sc => sc.id === id) + 1) % SCREENS.length].id;
