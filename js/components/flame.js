/* Copyright (c) 2026 - Ing. Développeur Hicham Oussama Saffih */
import { html } from 'lit-html';

export const flameLine = fl => html`
  <div class="flame">
    <span class="flame__track"></span>
    <span class="flame__fill" style="width:${fl.fill}"></span>
    ${fl.nodes.map(
      n => html`
      <div class="flame__node ${n.on ? 'is-on' : ''} ${n.now ? 'is-now' : ''} ${n.last ? 'is-last' : ''}">
        <span class="flame__slot"><span class="flame__dot"><span class="ms fill">${n.icon}</span></span></span>
        <span class="flame__cap">${n.cap}</span>
      </div>`
    )}
  </div>`;
