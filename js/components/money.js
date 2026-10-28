/* Copyright (c) 2026 - Ing. Développeur Hicham Oussama Saffih */
import { html, nothing } from 'lit-html';

export const miamCoin = (big = false) => html`<span class="coin ${big ? 'coin--l' : ''}">M</span>`;

// Sous-total, livraison, remise ; total affiché = valeur animée du panier
export const feeRows = t => html`
  <div class="sum__row"><span>Sous-total</span><span class="sum__v">${t.sub} DH</span></div>
  <div class="sum__row"><span>Livraison</span><span class="sum__v ${t.fee ? '' : 'is-free'}">${t.fee ? `${t.fee} DH` : 'Offerte'}</span></div>
  ${t.disc ? html`<div class="sum__row"><span>Code MCHOU10</span><span class="sum__v is-free">−${t.disc} DH</span></div>` : nothing}`;
