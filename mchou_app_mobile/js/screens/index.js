import { html } from 'lit-html';

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
  todo('splash', 'Splash', { status: 'clear' }),
  todo('login', 'Google sign-in', { status: 'clear' }),
  todo('phone', 'Phone number'),
  todo('address', 'Address'),
  todo('home', 'Home', { bar: true }),
  todo('menu', 'Menu', { bar: true }),
  todo('builder', 'Builder', { status: 'clear' }),
  todo('cart', 'Cart'),
  todo('checkout', 'Checkout'),
  todo('confirm', 'Confirmation', { status: 'clear' }),
  todo('track', 'Tracking', { status: 'track' }),
  todo('gifts', 'Gifts', { bar: true }),
  todo('profile', 'Profile', { bar: true })
];

const byId = Object.fromEntries(SCREENS.map(sc => [sc.id, sc]));
export const screen = id => byId[id];

const nextOf = id => SCREENS[(SCREENS.findIndex(sc => sc.id === id) + 1) % SCREENS.length].id;
