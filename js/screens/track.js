/* Copyright (c) 2026 - Ing. Développeur Hicham Oussama Saffih */
import { html, nothing } from 'lit-html';
import { SHOP, curve, along } from '../logic/geo.js';
import { clock } from '../logic/time.js';
import { jumpToOrder } from '../actions/order.js';
import { whenLeaflet, baseMap, killMap } from '../ui/map.js';
import { confetti } from '../ui/fx.js';
import { photo } from '../components/photo.js';

const RIDE_MS = 24000;
const STEPS = [
  ['check_circle', 'Confirmée'],
  ['skillet', 'En cuisine'],
  ['moped', 'En route'],
  ['home', 'Livrée']
];
const MS = "font:26px/1 'Material Symbols Rounded';font-variation-settings:'FILL' 1;";

let map = null,
  route = null,
  scooter = null,
  doneA = null,
  doneB = null;

function moveScooter(p) {
  if (!scooter || !route) return;
  const { pos, done } = along(route, p);
  try {
    scooter.setLatLng(pos);
    doneA.setLatLngs(done);
    doneB.setLatLngs(done);
  } catch {}
}

function setStage(app, n) {
  app.set(s => ({ stage: n, prog: n >= 3 ? 1 : n === 2 ? s.prog : 0 }));
  if (n === 3) {
    moveScooter(1);
    app.snd('win');
    app.buzz(20);
    app.later(() => confetti(195, 560, 70), 60);
  } else {
    app.snd('ding');
    app.buzz(10);
  }
}

// Repères Leaflet en HTML (divIcon) : boutique, maison, scooter
const icon = (L, html, w, h, ax, ay) => L.divIcon({ className: '', html, iconSize: [w, h], iconAnchor: [ax, ay] });

function initMap(app, el) {
  if (!el.isConnected || map) return;
  const L = window.L,
    home = app.s.ll;
  map = baseMap(el);
  map.attributionControl.getContainer().style.marginBottom = '60px';
  route = curve(SHOP, home);
  L.polyline(route, { color: '#6B2D8B', weight: 5, opacity: 0.85, dashArray: '1 11', lineCap: 'round' }).addTo(map);
  doneA = L.polyline([route[0]], { color: '#3A0B40', weight: 10, opacity: 0.9, lineCap: 'round' }).addTo(map);
  doneB = L.polyline([route[0]], { color: '#FFD84D', weight: 5, opacity: 1, lineCap: 'round' }).addTo(map);
  L.marker(SHOP, {
    icon: icon(
      L,
      '<div style="width:46px;height:46px;border-radius:50%;background:#FFD84D;padding:3px;box-sizing:border-box;box-shadow:0 8px 14px -4px rgba(0,0,0,.5)"><img src="assets/mchou-logo.png" alt="M\'Chou" style="width:100%;height:100%;border-radius:50%;display:block"></div>',
      46,
      46,
      23,
      23
    )
  }).addTo(map);
  L.marker(home, {
    icon: icon(
      L,
      `<div style="position:relative;width:44px;height:56px"><div style="position:absolute;left:0;top:0;width:44px;height:44px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:#6B2D8B;box-shadow:0 0 0 3px #FFD84D,0 8px 14px -4px rgba(0,0,0,.5)"></div><div style="position:absolute;left:0;top:0;width:44px;height:44px;display:grid;place-items:center;${MS}color:#FFD84D">home</div></div>`,
      44,
      56,
      22,
      53
    )
  }).addTo(map);
  scooter = L.marker(route[0], {
    zIndexOffset: 1000,
    icon: icon(
      L,
      `<div style="width:48px;height:48px;border-radius:50%;background:linear-gradient(#FFD36B,#F7B538);box-shadow:0 0 0 3px #3A0B40,0 10px 16px -4px rgba(0,0,0,.55);display:grid;place-items:center;${MS}font-size:28px;color:#3A0B40">moped</div>`,
      48,
      48,
      24,
      24
    )
  }).addTo(map);
  map.fitBounds(L.latLngBounds([SHOP, home]), { paddingTopLeft: [60, 130], paddingBottomRight: [60, 90] });
  moveScooter(app.s.prog);
}

// 5 s en cuisine, puis 24 s de trajet
function run(app) {
  app.set({ now: Date.now() });
  app.every(() => app.set({ now: Date.now() }), 1000);
  if (app.s.stage < 1) app.set({ stage: 1 });
  if (app.s.stage <= 1)
    app.later(() => {
      if (app.s.stage === 1) setStage(app, 2);
    }, 5000);
  app.every(() => {
    const s = app.s;
    if (s.stage !== 2) return;
    const p = Math.min(1, s.prog + 100 / RIDE_MS);
    app.set({ prog: p });
    moveScooter(p);
    if (p >= 1) setStage(app, 3);
  }, 100);
}

function nextStatus(app) {
  const k = app.s.stage;
  if (k <= 1) setStage(app, 2);
  else if (k === 2) {
    app.set({ prog: 1 });
    setStage(app, 3);
  }
}

const roundBtn = (label, iconName, onClick, cls = '') => html`
  <button type="button" class="map-btn ${cls}" aria-label=${label} @click=${onClick}><span class="ms">${iconName}</span></button>`;

export default {
  id: 'track',
  label: 'Tracking',
  status: 'track',

  view: (s, app) => {
    const o = s.order || { no: 'MC-2481', pay: 'card', total: 0, last4: '4242' },
      st = s.stage;
    const mins = st <= 1 ? 15 : st === 2 ? Math.max(1, Math.ceil(10 * (1 - s.prog))) : 0;
    const title = ['Commande confirmée', 'Ta crêpe dore en cuisine', 'Yassine est en route', 'Livrée, bon appétit !'][
      st
    ];
    const sub = [
      'On prévient la cuisine.',
      'Départ dans quelques minutes',
      `Arrivée prévue vers ${clock(s.now + mins * 60000)}`,
      `Merci ${s.fname}, à très vite chez M’Chou.`
    ][st];
    const pct = Math.min(100, (st === 2 ? (2 + s.prog) / 3 : st / 3) * 100);
    const home = () => app.go('home', { reset: true, back: true });
    return html`
      <section class="screen" data-screen="track">
        <div class="track__map" data-map></div>
        <div class="track__bar">
          ${roundBtn('Retour', 'arrow_back', home, 'map-btn--back')}
          <span class="track__no">Commande&nbsp;${o.no}</span>
          <span class="track__space"></span>
          ${roundBtn('Aide', 'help', () => app.soon('L’aide'), 'map-btn--gold')}
        </div>
        <div class="track__panel">
          <span class="sheet__grip"></span>
          <div class="track__head">
            <div class="track__titles"><span class="track__title">${title}</span><span class="track__sub">${sub}</span></div>
            ${st < 3 ? html`<div class="track__mins"><span class="track__mins-n">${mins}</span><span class="track__mins-k">MIN</span></div>` : nothing}
          </div>
          <div class="steps4">
            <div class="steps4__track"><div class="steps4__fill" style="width:${pct}%"></div></div>
            ${STEPS.map(
              ([ic, label], i) => html`
              <div class="steps4__step ${i <= st ? 'is-done' : ''} ${i === st && st < 3 ? 'is-now' : ''}">
                <span class="steps4__dot"><span class="ms fill">${ic}</span>${i === st && st < 3 ? html`<span class="steps4__pulse" data-pulse></span>` : nothing}</span>
                <span class="steps4__label">${label}</span>
              </div>`
            )}
          </div>
          ${
            st <= 1
              ? html`
            <div class="track__info"><span class="track__crepe" data-spin></span><span>On t'envoie le nom du livreur dès qu'il récupère ta commande.</span></div>`
              : nothing
          }
          ${
            st === 2
              ? html`
            <div class="driver">
              <div class="driver__pic">${photo('Livreur')}</div>
              <div class="driver__txt"><span class="driver__name">Yassine</span><span class="driver__sub">Scooter · ★ 4,9</span></div>
              <button type="button" class="round-btn" aria-label="Message" @click=${() => app.soon('Le chat livreur')}><span class="ms fill">chat</span></button>
              <button type="button" class="driver__call" aria-label="Appeler" @click=${() => app.toast('Appel de Yassine…', { icon: 'call' })}><span class="ms fill">call</span></button>
            </div>`
              : nothing
          }
          ${st >= 3 ? html`<button type="button" class="cta" @click=${home}>Retour à l'accueil</button>` : nothing}
          <div class="track__pay"><span class="ms fill">payments</span>${o.pay === 'card' ? `Payé par carte •••• ${o.last4}` : `Espèces à la livraison · ${o.total} DH`}</div>
        </div>
      </section>`;
  },

  enter(app) {
    const el = app.$('[data-map]');
    if (el) whenLeaflet(() => initMap(app, el));
    run(app);
  },

  leave() {
    killMap(map);
    map = route = scooter = doneA = doneB = null;
  },

  tools: (s, app) =>
    html`<button type="button" class="tool" @click=${() => nextStatus(app)}><span class="ms">skip_next</span>Next status</button>`,

  jump(app) {
    jumpToOrder(app, 'track');
  }
};
