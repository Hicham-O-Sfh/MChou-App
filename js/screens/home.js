/* Copyright (c) 2026 - Ing. Développeur Hicham Oussama Saffih */
import { html, nothing } from 'lit-html';
import { FAMS } from '../data/catalog.js';
import { P, homeIds } from '../logic/catalog.js';
import { qtyById } from '../logic/cart.js';
import { nextGift } from '../logic/loyalty.js';
import { addSimple, minus, reorder } from '../actions/cart.js';
import { openProduct } from '../actions/catalog.js';
import { famGo } from './menu.js';
import { photo } from '../components/photo.js';
import { tag, addButton, qtyPill, searchBar } from '../components/product.js';

// Temps restant avant minuit, en hh mm ss
function dropLeft(now) {
  const end = new Date(now);
  end.setHours(24, 0, 0, 0);
  const left = Math.max(0, Math.floor((end - now) / 1000));
  return [left / 3600, (left % 3600) / 60, left % 60].map(n => String(Math.floor(n)).padStart(2, '0'));
}

export const productCard = (app, p, n) => html`
  <div class="pcard ${n ? 'is-in' : ''}">
    <div class="pcard__pic ${p.soldOut ? 'is-out' : ''}" style="background:${p.tint}" @click=${() => openProduct(app, p.id)}>
      ${photo(p.full)}${p.tag ? tag(p.tag) : nothing}
    </div>
    <div class="pcard__txt ${p.soldOut ? 'is-out' : ''}" @click=${() => openProduct(app, p.id)}>
      <span class="pcard__name">${p.name}</span><span class="pcard__sub">${p.sub}</span>
    </div>
    ${
      p.soldOut
        ? html`<span class="sold-out pcard__out">Épuisé · retour demain</span>`
        : n
          ? qtyPill(
              n,
              () => minus(app, p.id),
              e => addSimple(app, p.id, e.currentTarget)
            )
          : html`<div class="pcard__buy"><span class="price">${p.price} DH</span>${addButton(e => addSimple(app, p.id, e.currentTarget))}</div>`
    }
  </div>`;

function lastOrder(app, L) {
  const [l1, l2 = l1] = L.lines;
  return html`
    <div class="last">
      <div class="last__row">
        <div class="last__pics">
          <div class="last__pic" style="background:${P[l1.id].tint}">${photo('Photo')}</div>
          <div class="last__pic" style="background:${P[l2.id].tint}">${photo('Photo')}</div>
        </div>
        <div class="last__txt"><span class="last__k">TA DERNIÈRE COMMANDE</span><span class="last__names">${L.names}</span></div>
      </div>
      <div class="last__foot">
        <span class="last__when">${L.when} · <span class="last__total">${L.total} DH</span></span>
        <button type="button" class="cta cta--m press" @click=${e => reorder(app, e.currentTarget)}><span class="ms fill">replay</span>Recommander</button>
      </div>
    </div>`;
}

export default {
  id: 'home',
  label: 'Home',
  bar: true,

  view: (s, app) => {
    const qty = qtyById(s.cart),
      ids = homeIds(s.query),
      q = s.query.trim();
    const [h, m, sec] = dropLeft(s.now),
      rw = nextGift(s.miams);
    return html`
      <section class="screen" data-screen="home">
        <div class="grain"></div>
        <div class="home__scroll scroll" data-scroll>
          <div class="home__top">
            <img class="home__logo" src="assets/mchou-logo.png" alt="M'Chou">
            <button type="button" class="home__addr" @click=${() => {
              app.set({ addrEdit: true });
              app.go('address');
            }}>
              <span class="home__addr-k">Livrer à</span>
              <span class="home__addr-v"><span>${s.q}, ${s.city}</span><span class="ms">expand_more</span></span>
            </button>
            <button type="button" class="streak-btn press" aria-label="Ma série" @click=${() => {
              app.snd('tap');
              app.openSheet('streak');
            }}>
              <span class="streak-pill"><span class="ms fill">local_fire_department</span><span class="streak-pill__n">${s.streak}</span></span>
            </button>
          </div>
          <div class="home__hello">
            <div class="home__hi">Salut ${s.fname},</div>
            <div class="home__want">une petite envie sucrée&nbsp;?</div>
          </div>
          <div class="home__search">
            ${searchBar({ value: s.query, placeholder: 'Crêpe, choux, mojito…', onInput: e => app.set({ query: e.target.value.slice(0, 40) }), onClear: () => app.set({ query: '' }) })}
          </div>
          <div class="cats scroll-x">
            ${FAMS.map(
              f => html`
              <button type="button" class="cat press" @click=${() => famGo(app, f.k)}>
                <span class="cat__ic"><span class="ms fill">${f.icon}</span></span><span class="cat__name">${f.n}</span>
              </button>`
            )}
          </div>
          <div class="drop-wrap">
            <div class="drop">
              <div class="drop__pic"><div>${photo('Brownie Extra Pistachio')}</div></div>
              <div class="drop__body">
                <span class="drop__badge">DROP DU JOUR</span>
                <div class="drop__title">Brownie Extra Pistachio</div>
                <div class="drop__timer">Fin dans<span class="drop__clock" dir="ltr"><span>${h}</span>:<span>${m}</span>:<span>${sec}</span></span></div>
                <div class="drop__buy">
                  <button type="button" class="btn-plum press" @click=${e => addSimple(app, 'brownie-pista', e.currentTarget)}>Je goûte</button>
                  <div class="drop__from">dès<span class="drop__price">35 DH</span></div>
                </div>
              </div>
            </div>
          </div>
          <div class="rw press-soft" role="button" @click=${() => {
            app.snd('tap');
            app.go('gifts');
          }}>
            <div class="rw__ic"><span class="ms fill">redeem</span></div>
            <div class="rw__body">
              <div class="rw__head">
                <span class="rw__title">${rw.n ? (rw.n > 1 ? `${rw.n} cadeaux à portée de Miams` : '1 cadeau à portée de Miams') : 'Ton prochain cadeau'}</span>
                <span class="rw__count">${s.miams} Miams</span>
              </div>
              <div class="bar"><div class="bar__fill" style="width:${rw.pct}"></div></div>
              <span class="rw__msg">${rw.msg}</span>
            </div>
          </div>
          ${s.last ? lastOrder(app, s.last) : nothing}
          <div class="home__list-head">
            <span class="script-title">${q ? 'Résultats' : 'Les plus aimés'}</span>
            <button type="button" class="link-btn" @click=${() => {
              app.snd('tap');
              if (q) app.set({ mq: q });
              app.go('menu', { reset: true });
            }}>Tout voir</button>
          </div>
          <div class="prods scroll-x">${ids.map(id => productCard(app, P[id], qty[id] || 0))}</div>
          ${
            ids.length
              ? nothing
              : html`
            <div class="empty-card">
              <span class="ms">search_off</span>
              <span class="empty-card__title">Rien pour « ${q} »</span>
              <span class="empty-card__sub">Essaie « crêpe », « pistache » ou « mojito ».</span>
            </div>`
          }
        </div>
      </section>`;
  },

  enter(app) {
    app.set({ now: Date.now() });
    app.every(() => app.set({ now: Date.now() }), 1000);
  }
};
