/* Copyright (c) 2026 - Ing. Développeur Hicham Oussama Saffih */
import { html } from 'lit-html';
import { P } from '../logic/catalog.js';
import { giftOf, giftLines } from '../logic/loyalty.js';
import { redeem } from '../actions/gifts.js';
import { sheet } from '../components/sheet.js';
import { photo } from '../components/photo.js';
import { miamCoin } from '../components/money.js';

export const giftSheet = (s, app) => {
  const g = giftOf(s.gift),
    p = P[g.lines[0][0]],
    ok = s.miams >= g.cost,
    gap = g.cost - s.miams;
  const items =
    g.lines.length > 1
      ? `Contenu : ${giftLines(g)
          .map(l => P[l.id].full)
          .join(' + ')}. `
      : '';
  return sheet(
    { cls: 'giftsheet', onClose: () => app.closeSheet() },
    html`
    <div class="giftsheet__pic" data-gift-thumb style="background:${p.tint}">${photo(g.n)}</div>
    <span class="giftsheet__name">${g.n}</span>
    <span class="giftsheet__d">${g.d}</span>
    <span class="giftsheet__info"><span class="ms fill">redeem</span><span>${items}Servi tel quel, sans personnalisation.</span></span>
    <div class="giftsheet__cost">
      ${miamCoin(true)}<span class="giftsheet__n">${g.cost} Miams</span>
      <span class="giftsheet__left">${ok ? `Il te restera ${-gap} Miams` : `Il te manque ${gap} Miams`}</span>
    </div>
    ${
      ok
        ? html`<button type="button" class="cta press giftsheet__cta" @click=${() => redeem(app)}>Je me l'offre&nbsp;!</button>`
        : html`<div class="cta-off giftsheet__cta"><span class="ms fill">lock</span>Encore ${gap} Miams</div>`
    }
    <button type="button" class="giftsheet__later" @click=${() => app.closeSheet()}>Pas maintenant</button>`
  );
};
