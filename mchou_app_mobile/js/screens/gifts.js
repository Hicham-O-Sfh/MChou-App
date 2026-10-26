import { html } from 'lit-html';
import { GIFTS } from '../data/loyalty.js';
import { P } from '../logic/catalog.js';
import { nextGift, flame } from '../logic/loyalty.js';
import { openGift } from '../actions/gifts.js';
import { photo } from '../components/photo.js';
import { flameLine } from '../components/flame.js';
import { miamCoin } from '../components/money.js';

const miamsPill = n => html`<span class="miams-pill">${miamCoin(true)}<span class="miams-pill__n">${n}</span></span>`;

const giftRow = (app, g, miams) => {
  const p = P[g.lines[0][0]], ok = miams >= g.cost;
  return html`
    <button type="button" class="gift press-soft ${ok ? '' : 'is-locked'}" @click=${() => openGift(app, g.k)}>
      <div class="gift__pic" style="background:${p.tint}">${photo(g.n)}</div>
      <span class="gift__txt"><span class="gift__name">${g.n}</span><span class="gift__d">${g.d}</span><span class="gift__cost">${g.cost} Miams</span></span>
      ${ok
        ? html`<span class="gift__go">Échanger</span>`
        : html`<span class="gift__lock"><span class="ms fill">lock</span>Encore ${g.cost - miams}</span>`}
    </button>`;
};

export default {
  id: 'gifts',
  label: 'Gifts',
  bar: true,

  view: (s, app) => {
    const rw = nextGift(s.miams), fl = flame(s);
    return html`
      <section class="screen page" data-screen="gifts">
        <div class="grain"></div>
        <div class="tab-top"><span class="tab-top__title">Cadeaux</span>${miamsPill(s.miams)}</div>
        <div class="tab-scroll scroll" data-scroll>
          <div class="wallet">
            <span class="wallet__k">Tes Miams</span>
            <div class="wallet__row"><span class="wallet__n">${s.miams}</span><span class="wallet__unit">Miams</span><span class="wallet__space"></span><span class="wallet__rate">1 DH = 1 Miam</span></div>
            <div class="bar"><div class="bar__fill bar__fill--anim" style="width:${rw.pct}"></div></div>
            <span class="wallet__msg">${rw.msg}</span>
          </div>
          <button type="button" class="streak-card press-soft" @click=${() => { app.snd('tap'); app.openSheet('streak'); }}>
            <div class="streak-card__head">
              <span class="streak-btn__in"><span class="ms fill">local_fire_department</span><span class="streak-btn__n tabnum">${s.streak}</span></span>
              <span class="streak-card__txt"><span class="streak-card__title">${fl.head}</span><span class="streak-card__sub">Une commande par semaine, 5 semaines d'affilée</span></span>
              <span class="ms flip-rtl streak-card__go">chevron_right</span>
            </div>
            ${flameLine(fl)}
          </button>
          <div class="gifts__head"><span class="gifts__title">Échange tes Miams</span><span class="gifts__sub">Servis tels quels, comme sur la carte.</span></div>
          ${GIFTS.map(g => giftRow(app, g, s.miams))}
        </div>
      </section>`;
  }
};
