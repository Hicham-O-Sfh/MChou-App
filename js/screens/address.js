/* Copyright (c) 2026 - Ing. Développeur Hicham Oussama Saffih */
import { html, nothing } from 'lit-html';
import { rm } from '../config.js';
import { EASE } from '../ui/motion.js';
import { whenLeaflet, baseMap, killMap, reverse } from '../ui/map.js';
import { SHOP, HOME0, ZONE_KM, km, etaRange, fmtKm } from '../logic/geo.js';
import { phoneState } from '../logic/phone.js';
import { backButton } from '../components/back.js';
import { progress, phoneField, phoneError } from '../components/onboarding.js';

let map = null,
  revT = 0;

function lift(app, up) {
  const p = app.$('[data-pin]');
  if (!p || rm()) return;
  if (up)
    p.animate([{ translate: '0 0' }, { translate: '0 -16px' }], {
      duration: 180,
      fill: 'forwards',
      easing: 'ease-out'
    });
  else {
    p.animate([{ translate: '0 -16px' }, { translate: '0 3px', offset: 0.6 }, { translate: '0 0' }], {
      duration: 380,
      fill: 'forwards',
      easing: EASE.spring
    });
    app.snd('tap');
  }
}

function initMap(app, el) {
  if (!el.isConnected || map) return;
  map = baseMap(el).setView(app.s.ll, 16);
  map.on('movestart', () => lift(app, true));
  map.on('moveend', () => {
    lift(app, false);
    const c = map.getCenter(),
      ll = [c.lat, c.lng],
      dist = km(SHOP, ll);
    app.set({ ll, dist, inZone: dist <= ZONE_KM });
    clearTimeout(revT);
    revT = setTimeout(async () => {
      const r = await reverse(ll);
      if (r) app.set(s => ({ q: r.q, city: r.city || s.city }));
    }, 700);
  });
}

function save(app) {
  app.snd('ding');
  if (app.s.addrEdit) {
    app.back();
    setTimeout(() => app.toast('Adresse enregistrée'), 60);
  } else {
    app.go('home', { reset: true });
    setTimeout(() => app.toast(`C’est parti, ${app.s.fname} !`, { icon: 'celebration', tone: 'gold' }), 420);
  }
}

export default {
  id: 'address',
  label: 'Address',

  view: (s, app) => {
    const pst = phoneState(s.phone, s.phoneBlur),
      zone = s.inZone,
      ok = zone && pst !== 'err';
    return html`
      <section class="screen onb" data-screen="address">
        <div class="grain"></div>
        <div class="onb__top">
          ${backButton(app)}
          ${s.addrEdit ? html`<span class="onb__title-edit">Adresse de livraison</span>` : progress(2, 2)}
        </div>
        <div class="addr__scroll scroll">
          ${
            s.addrEdit
              ? nothing
              : html`
            <div class="addr__intro">
              <span class="onb__title">Où on t'apporte ça&nbsp;?</span>
              <span class="onb__sub">Place le pin sur ta porte, on s'occupe du reste.</span>
            </div>`
          }
          <div class="map-card">
            <div class="map-card__map" data-map></div>
            <div class="map-pin">
              <span class="map-pin__shadow"></span>
              <div class="map-pin__body" data-pin><span class="map-pin__drop"></span><span class="ms fill map-pin__ic">home</span></div>
            </div>
            <div class="zone-chip ${zone ? 'zone-chip--ok' : 'zone-chip--out'}">
              <span class="ms fill">${zone ? 'check_circle' : 'block'}</span>${zone ? 'Zone livrée' : 'Hors zone'}
            </div>
            <button type="button" class="locate" aria-label="Ma position" @click=${() => {
              app.snd('tap');
              map?.flyTo(HOME0, 17, { duration: 0.9 });
            }}>
              <span class="ms">my_location</span>
            </button>
          </div>
          <div class="addr-line">
            <span class="addr-line__ic"><span class="ms fill">location_on</span></span>
            <span class="addr-line__txt">
              <span class="addr-line__q">${s.q}, ${s.city}</span>
              <span class="addr-line__d ${zone ? '' : 'is-out'}">${zone ? `≈ ${fmtKm(s.dist)} km de M’Chou · ${etaRange(s.dist)}` : 'On livre jusqu’à 6 km autour de M’Chou'}</span>
            </span>
          </div>
          <label class="addr__label">
            <span class="field-label">Ton numéro&nbsp;? <span class="field-label__opt">facultatif, mais conseillé</span></span>
            ${phoneField(s, app, 'field--m')}
          </label>
          ${phoneError(s)}
          ${pst === 'empty' ? html`<span class="hint">Pour que le livreur puisse te contacter.</span>` : nothing}
        </div>
        <div class="addr__cta">
          ${
            ok
              ? html`<button type="button" class="cta cta--block press" @click=${() => save(app)}>${s.addrEdit ? 'Enregistrer' : 'C’est parti !'}</button>`
              : html`<div class="cta-off">${zone ? 'Vérifie ton numéro' : 'Hors zone de livraison'}</div>`
          }
        </div>
      </section>`;
  },

  enter(app) {
    const el = app.$('[data-map]');
    if (el) whenLeaflet(() => initMap(app, el));
  },

  leave() {
    clearTimeout(revT);
    killMap(map);
    map = null;
  },

  jump(app) {
    app.set({ addrEdit: false });
    app.go('address', { reset: true });
  }
};
