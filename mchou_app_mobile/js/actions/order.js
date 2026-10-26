import { digits } from '../logic/format.js';
import { cardErrors, REFUSED_PREFIX } from '../logic/payment.js';
import { placeOrder } from '../logic/order.js';
import { shake } from '../ui/motion.js';

// Panier de démo pour ouvrir panier, paiement, confirmation ou suivi depuis le panneau
export const DEMO_CART = [
  { id: 'crepe-nb', ex: ['Pistache'], sugar: true, note: '', unit: 35, qty: 1 },
  { id: 'mojito-fraise', ex: [], sugar: true, note: '', unit: 20, qty: 1 }
];

function commit(app, target = 'confirm') {
  app.set(placeOrder(app.s, Date.now()), () => app.go(target, { reset: true }));
}

// Carte : contrôle du formulaire puis 3-D Secure ; espèces : envoi direct
export function place(app) {
  const s = app.s;
  if (!s.cart.length || s.busy) return;
  if (s.pay === 'card') {
    if (Object.keys(cardErrors(s)).length) {
      app.set({ cardTry: true }, () => shake(app.$('[data-cardform]')));
      app.snd('err');
      return;
    }
    app.snd('tap');
    app.set({ sheet: 'tds', otp: '', tdsBusy: false, tdsSms: false, payErr: '' });
    app.later(() => { app.set({ tdsSms: true }); app.snd('pop'); }, 1300);
    return;
  }
  app.snd('tap');
  app.set({ busy: true });
  app.later(() => commit(app), 1200);
}

// Une carte commençant par 4000 simule un refus de la banque
export function validateOtp(app) {
  if (app.s.otp.length < 6 || app.s.tdsBusy) return;
  app.set({ tdsBusy: true });
  app.later(() => {
    if (digits(app.s.num).startsWith(REFUSED_PREFIX)) {
      app.set({ sheet: null, tdsBusy: false, payErr: 'Paiement refusé par ta banque. Essaie une autre carte ou paie en espèces à la livraison.' });
      app.snd('err');
      app.buzz(30);
    } else {
      app.set({ sheet: null, tdsBusy: false, busy: true });
      app.later(() => commit(app), 500);
    }
  }, 1400);
}

export function scanCard(app) {
  app.snd('tap');
  app.set({ num: '4242 4242 4242 4242', exp: '12/28', cname: 'Marouane Berrichi', payErr: '' });
  app.toast('Carte scannée, ajoute le cryptogramme', { icon: 'photo_camera', tone: 'gold' });
}

// Depuis le panneau : ouvre la confirmation ou le suivi, en passant une commande de démo si besoin
export function jumpToOrder(app, target) {
  const s = app.s;
  if (s.order) return app.go(target, { reset: true });
  const cardBad = s.pay === 'card' && Object.keys(cardErrors(s)).length > 0;
  app.set({ cart: s.cart.length ? s.cart : DEMO_CART, pay: cardBad ? 'cash' : s.pay }, () => commit(app, target));
}
