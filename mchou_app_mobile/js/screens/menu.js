import { html, nothing } from 'lit-html';
import { rm } from '../config.js';
import { FLAV } from '../data/catalog.js';
import { P, menuSections } from '../logic/catalog.js';
import { qtyById } from '../logic/cart.js';
import { addSimple, minus } from '../actions/cart.js';
import { openProduct } from '../actions/catalog.js';
import { tag, addButton, qtyPill, searchBar } from '../components/product.js';

let pendingFam = null, lockUntil = 0;

const scroller = app => app.$('[data-menu-scroll]');
const stickH = sc => sc.querySelector('[data-menu-stick]')?.offsetHeight ?? 110;

function offIn(el, sc) {
  let y = 0;
  for (; el && el !== sc; el = el.offsetParent) y += el.offsetTop;
  return y;
}

// Depuis une pill de l'accueil : ouvre le menu directement sur la famille
export function famGo(app, k) {
  app.snd('tap');
  pendingFam = k;
  app.set({ flav: '', mq: '' });
  app.go('menu', { reset: true });
}

function scrollToFam(app, k, smooth) {
  const sc = scroller(app), sec = sc?.querySelector(`[data-sec="${k}"]`);
  if (!sec) return;
  lockUntil = Date.now() + 900;
  sc.scrollTo({ top: Math.max(0, offIn(sec, sc) - stickH(sc) + 2), behavior: smooth && !rm() ? 'smooth' : 'auto' });
  app.set({ mfam: k });
}

// La famille active suit la section visible sous la barre collante
function onScroll(app, sc) {
  if (Date.now() < lockUntil) return;
  const lim = sc.scrollTop + stickH(sc) + 14;
  let cur = null;
  sc.querySelectorAll('[data-sec]').forEach(x => { if (cur === null || offIn(x, sc) <= lim) cur = x.dataset.sec; });
  if (cur && cur !== app.s.mfam) app.set({ mfam: cur });
}

function showChip(app, k, smooth) {
  const bar = app.$('[data-fambar]'), chip = bar?.querySelector(`[data-fam="${k}"]`);
  if (chip) bar.scrollTo({ left: Math.max(0, chip.offsetLeft - 20), behavior: smooth && !rm() ? 'smooth' : 'auto' });
}

function pickFlav(app, k, on) {
  app.snd('tap');
  app.set({ flav: on ? '' : k });
  const sc = scroller(app), top = sc?.querySelector('[data-secs-top]');
  if (!top) return;
  const y = offIn(top, sc) - stickH(sc);
  if (sc.scrollTop > y) sc.scrollTo({ top: y });
}

const row = (app, p, n) => html`
  <div class="mrow ${n ? 'is-in' : ''} ${p.soldOut ? 'is-out' : ''}">
    <div class="mrow__main" @click=${() => openProduct(app, p.id)}>
      <span class="mrow__ic" style="background:${p.tint}"><span class="ms fill">${p.icon}</span></span>
      <span class="mrow__txt">
        <span class="mrow__line"><span class="mrow__name">${p.name}</span>${p.tag ? tag(p.tag) : nothing}</span>
        ${p.hint ? html`<span class="mrow__hint">${p.hint}</span>` : nothing}
        <span class="mrow__price">${p.multi ? html`<span class="mrow__from">dès</span>` : nothing}<span class="mrow__p">${p.price} DH</span></span>
      </span>
    </div>
    ${p.soldOut ? html`<span class="mrow__out">Épuisé</span>`
      : n ? qtyPill(n, () => minus(app, p.id), e => addSimple(app, p.id, e.currentTarget), 'qty--row')
      : addButton(e => addSimple(app, p.id, e.currentTarget))}
  </div>`;

const pack = (app, p, n) => html`
  <div class="prow">
    <div class="prow__main" @click=${() => openProduct(app, p.id)}>
      <span class="prow__ic"><span class="ms fill">${p.icon}</span></span>
      <span class="prow__txt"><span class="prow__k">${p.hint}</span><span class="prow__name">${p.name}</span><span class="prow__p">${p.price} DH</span></span>
    </div>
    ${n ? qtyPill(n, () => minus(app, p.id), e => addSimple(app, p.id, e.currentTarget), 'qty--plum')
      : addButton(e => addSimple(app, p.id, e.currentTarget), 'add-btn--plum')}
  </div>`;

const SERVICES = [
  ['celebration', 'Fêtes', 'Anniversaire, fiançailles, ouverture'],
  ['school', 'Soutenances', 'Pour fêter ta soutenance en douceur'],
  ['cake', 'Commandes personnalisées', 'Dis-nous ce dont tu rêves']
];

export default {
  id: 'menu',
  label: 'Menu',
  bar: true,

  view: (s, app) => {
    const qty = qtyById(s.cart), secs = menuSections(s.mq, s.flav), q = s.mq.trim();
    const famOn = secs.some(x => x.fam.k === s.mfam) ? s.mfam : secs[0]?.fam.k;
    const fl = FLAV.find(x => x[0] === s.flav);
    return html`
      <section class="screen" data-screen="menu">
        <div class="grain"></div>
        <div class="menu__scroll scroll" data-menu-scroll data-scroll @scroll=${e => onScroll(app, e.currentTarget)}>
          <div class="menu__head"><span class="menu__title">Le menu</span><span class="menu__script">choisis ta douceur</span></div>
          <div class="menu__search">
            ${searchBar({ value: s.mq, placeholder: 'Nutella, choux, mojito…', onInput: e => app.set({ mq: e.target.value.slice(0, 40) }), onClear: () => app.set({ mq: '' }) })}
          </div>
          <div class="menu__stick" data-menu-stick>
            <div class="menu__k">TA SAVEUR&nbsp;?</div>
            <div class="flavs scroll-x">
              ${FLAV.map(([k, n, dot]) => html`
                <button type="button" class="flav press ${s.flav === k ? 'is-on' : ''}" @click=${() => pickFlav(app, k, s.flav === k)}>
                  <span class="flav__dot" style="background:${dot}"></span><span class="flav__name">${n}</span>
                </button>`)}
            </div>
            ${secs.length ? html`
              <div class="fams scroll-x" data-fambar>
                ${secs.map(({ fam }) => html`
                  <button type="button" class="fam ${fam.k === famOn ? 'is-on' : ''}" data-fam=${fam.k} @click=${() => { app.snd('tap'); scrollToFam(app, fam.k, true); }}>
                    <span class="ms fill">${fam.icon}</span><span class="fam__name">${fam.n}</span>
                  </button>`)}
              </div>` : nothing}
          </div>
          <div data-secs-top></div>
          ${secs.map(({ fam, ids }) => html`
            <section class="msec" data-sec=${fam.k}>
              <div class="msec__head">
                <span class="script-title">${fam.t}</span>
                ${fam.note || fam.ex ? html`<span class="msec__note">${fam.note || 'Suppléments au choix'}</span>` : nothing}
              </div>
              ${fam.pack
                ? html`<div class="plist">${ids.map(id => pack(app, P[id], qty[id] || 0))}</div>`
                : html`<div class="mlist">${ids.map(id => row(app, P[id], qty[id] || 0))}</div>`}
            </section>`)}
          ${secs.length ? nothing : html`
            <div class="empty-card empty-card--menu">
              <span class="ms">search_off</span>
              <span class="empty-card__title">Rien pour ${q ? `« ${q} »${fl ? ` en ${fl[1].toLowerCase()}` : ''}` : fl ? fl[1].toLowerCase() : ''}</span>
              <span class="empty-card__sub">Essaie une autre saveur ou un autre mot.</span>
              <button type="button" class="btn-outline btn-outline--m" @click=${() => app.set({ mq: '', flav: '' })}>Tout afficher</button>
            </div>`}
          <div class="services">
            <div class="services__head">
              <span class="script-title">Nos services</span>
              <span class="services__sub">On se déplace avec nos douceurs pour tes grands moments.</span>
            </div>
            ${SERVICES.map(([icon, n, sub]) => html`
              <div class="svc">
                <span class="svc__ic"><span class="ms fill">${icon}</span></span>
                <span class="svc__txt"><span class="svc__name">${n}</span><span class="svc__sub">${sub}</span></span>
              </div>`)}
            <button type="button" class="btn-outline press-soft" @click=${() => app.toast('Écris-nous sur Instagram : @mchou._._', { icon: 'chat', tone: 'soft' })}>
              <span class="ms">chat</span>Nous écrire sur Instagram
            </button>
          </div>
        </div>
      </section>`;
  },

  enter(app) {
    if (pendingFam) scrollToFam(app, pendingFam);
    showChip(app, pendingFam || app.s.mfam);
    pendingFam = null;
    // Les largeurs des pastilles changent quand les polices arrivent : recaler une fois chargées
    document.fonts?.ready.then(() => showChip(app, app.s.mfam));
  },

  effects(prev, s, app) {
    if (prev.mfam !== s.mfam) showChip(app, s.mfam, true);
  }
};
