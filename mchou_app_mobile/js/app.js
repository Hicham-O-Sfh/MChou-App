import { render } from 'lit-html';
import { TW, MOB, rm } from './config.js';
import { createStore } from './core/store.js';
import { initialState } from './state.js';
import { screen } from './screens/index.js';
import { shell } from './shell.js';
import { snd, buzz, setMuted } from './ui/sound.js';
import { screenIn, sheetIn, sheetOut, toastIn, autoAnim } from './ui/motion.js';
import { mountFx } from './ui/fx.js';

export class App {
  timers = [];
  anims = [];
  raf = {};
  navBack = false;
  root = null;

  constructor(host) {
    this.host = host;
    this.store = createStore(initialState(), () => this.update());
    this.prev = this.s;
  }

  get s() { return this.store.get(); }
  set(patch, cb) { this.store.set(patch, cb); }
  $(sel) { return this.root?.querySelector(sel); }

  start() {
    addEventListener('resize', () => this.fit());
    this.fit();
    this.update();
    this.enter(this.s.screen);
  }

  update() {
    const prev = this.prev, s = this.s;
    this.prev = s;
    render(shell(s, this), this.host);
    if (!this.root) {
      this.root = this.host.querySelector('[data-root]');
      mountFx(this.root, this.$('[data-fx]'), () => this.s.scale);
    }
    if (prev !== s) this.effects(prev, s);
  }

  effects(prev, s) {
    if (prev.screen !== s.screen) this.enter(s.screen, prev.screen);
    if (s.sheet && s.sheet !== prev.sheet) sheetIn(this.$('[data-panel]'), this.$('[data-scrim]'));
    if (s.toast && s.toast !== prev.toast) toastIn(this.$('[data-toast]'));
    if (s.muted !== prev.muted) setMuted(s.muted);
    screen(s.screen).effects?.(prev, s, this);
    autoAnim(this.root);
  }

  // Téléphone : largeur 390 mise à l'échelle de l'écran. Bureau : cadre 410×864 réduit si besoin.
  fit() {
    const W = innerWidth, H = innerHeight;
    if (MOB) {
      const k = W / 390, ph = Math.round(H / k);
      if (Math.abs(k - this.s.scale) > .004 || ph !== this.s.ph) this.set({ scale: k, ph });
      return;
    }
    const k = Math.max(.45, Math.min(1, (H - 24) / 864, (W - 24) / 410));
    if (Math.abs(k - this.s.scale) > .004) this.set({ scale: k });
  }

  enter(id, prev) {
    this.clearT();
    this.stopAnims();
    if (prev) screen(prev).leave?.(this);
    const el = this.$(`[data-screen="${id}"]`);
    if (el && prev) screenIn(el, (TW.rtl ? -1 : 1) * (this.navBack ? -1 : 1));
    this.navBack = false;
    screen(id).enter?.(this);
  }

  go(id, o = {}) {
    if (id === this.s.screen) return;
    this.navBack = !!o.back;
    this.set(s => ({
      screen: id,
      hist: o.reset ? [] : o.back ? s.hist.slice(0, -1) : [...s.hist, s.screen],
      sheet: null,
      toast: null
    }));
  }

  back() { this.go(this.s.hist.at(-1) || 'home', { back: true }); }

  jump(id) {
    const sc = screen(id);
    if (sc.jump) sc.jump(this);
    else this.go(id, { reset: true });
  }

  tab(id) {
    if (this.s.screen !== id) { this.snd('tap'); this.go(id, { reset: true, back: id === 'home' }); return; }
    if (id === 'home' || id === 'menu') this.$('[data-scroll]')?.scrollTo({ top: 0, behavior: 'smooth' });
  }

  soon(name) { this.toast(`${name} arrive dans le prochain lot d’écrans`, { icon: 'construction', tone: 'idle' }); }

  toast(text, { icon = 'check_circle', tone = 'ok', action } = {}) {
    clearTimeout(this.toastT);
    const t = { text, icon, tone, action };
    this.set({ toast: t });
    this.toastT = setTimeout(() => this.set(s => (s.toast === t ? { toast: null } : null)), action ? 3600 : 2400);
  }

  toastAction() {
    const a = this.s.toast?.action;
    this.set({ toast: null });
    a?.fn();
  }

  openSheet(id) { this.set({ sheet: id }); }

  closeSheet(cb) {
    let ran = false;
    sheetOut(this.$('[data-panel]'), () => {
      if (ran) return;
      ran = true;
      this.set({ sheet: null });
      cb?.();
    });
  }

  // Minuteurs et animations d'écran : coupés à chaque changement d'écran
  later(fn, ms) { const id = setTimeout(fn, ms); this.timers.push(['t', id]); return id; }
  every(fn, ms) { const id = setInterval(fn, ms); this.timers.push(['i', id]); return id; }
  clearT() { this.timers.forEach(([k, id]) => (k === 't' ? clearTimeout(id) : clearInterval(id))); this.timers = []; }
  keep(anim) { this.anims.push(anim); return anim; }
  stopAnims() { this.anims.forEach(a => { try { a.cancel(); } catch {} }); this.anims = []; }

  // Valeur affichée qui « compte » jusqu'à la cible, lue dans s.tw[key]
  tween(key, from, to, dur = 600) {
    cancelAnimationFrame(this.raf[key]);
    const put = v => this.set(s => ({ tw: { ...s.tw, [key]: v } }));
    if (rm() || from == null || from === to) return put(to);
    const t0 = performance.now();
    const step = now => {
      const p = Math.min(1, (now - t0) / dur);
      put(Math.round(from + (to - from) * (1 - (1 - p) ** 3)));
      if (p < 1) this.raf[key] = requestAnimationFrame(step);
    };
    this.raf[key] = requestAnimationFrame(step);
  }

  snd(k) { snd(k); }
  buzz(ms) { buzz(ms); }
}
