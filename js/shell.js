/* Copyright (c) 2026 - Ing. Développeur Hicham Oussama Saffih */
import { html, nothing } from 'lit-html';
import { keyed } from 'lit-html/directives/keyed.js';
import { TW, MOB } from './config.js';
import { screen } from './screens/index.js';
import { sheetView } from './sheets/index.js';
import { panel } from './components/panel.js';
import { statusBar } from './components/statusbar.js';
import { navBar } from './components/navbar.js';
import { toastView } from './components/toast.js';

export const shell = (s, app) => {
  const sc = screen(s.screen),
    k = s.scale;
  const f = MOB ? { w: 390, h: s.ph, ph: s.ph } : { w: 410, h: 864, ph: 844 };
  return html`
    <div class="stage ${MOB ? 'stage--mob' : ''}">
      ${MOB ? nothing : panel(s, app)}
      <div class="device-wrap" style="width:${Math.round(f.w * k)}px;height:${Math.round(f.h * k)}px">
        <div class="device-scale" style="width:${f.w}px;height:${f.h}px;transform:scale(${k})">
          <div class="device" data-root dir=${TW.rtl ? 'rtl' : 'ltr'} style="height:${f.ph}px">
            ${keyed(s.screen, sc.view(s, app))}
            ${MOB ? nothing : statusBar(sc.status)}
            ${sc.bar ? navBar(s, app) : nothing}
            ${sheetView(s, app)}
            ${s.toast ? toastView(s.toast, app) : nothing}
            <div class="fx" data-fx dir="ltr"></div>
            ${MOB ? nothing : html`<div class="home-indicator"></div>`}
          </div>
        </div>
      </div>
    </div>`;
};
