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
import gifts from './gifts.js';
import profile from './profile.js';

// Ordre du parcours, repris par le panneau de gauche
export const SCREENS = [splash, login, phone, address, home, menu, builder, cart, checkout, confirm, track, gifts, profile];

const byId = Object.fromEntries(SCREENS.map(sc => [sc.id, sc]));
export const screen = id => byId[id];
