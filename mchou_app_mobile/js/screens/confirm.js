import { html, nothing } from 'lit-html';
import { TW, rm } from '../config.js';
import { nextGift } from '../logic/loyalty.js';
import { clock } from '../logic/time.js';
import { jumpToOrder } from '../actions/order.js';
import { EASE, pop } from '../ui/motion.js';
import { burst } from '../ui/fx.js';
import { miamCoin } from '../components/money.js';

const STARS = [[40, 62, 7, 'gold'], [330, 50, 9, 'gold'], [292, 112, 6, 'green'], [72, 126, 6, 'pink']];
const SPEED = [[40, 140, 56, .55], [24, 166, 70, .45], [46, 192, 48, .55]];
const PUFFS = [[20, .7], [18, .6], [22, .55]];
const RIDER = ['fender', 'fender fender--front', 'body', 'fork', 'light', 'bar', 'seat', 'box', 'leg', 'torso', 'arm', 'helmet', 'visor'];

let sceneAnims = [];

const parts = (r, p) => [...r.querySelectorAll(`[data-p="${p}"]`)];

// Boucles du scooter : roues, rebond, route qui défile, traits de vitesse, fumée
function loops(app, r) {
  if (rm() || r.dataset.looping) return;
  r.dataset.looping = '1';
  const loop = (p, kf, opts) => parts(r, p).forEach((el, i) => app.keep(el.animate(kf, { iterations: Infinity, ...opts(i) })));
  loop('wheel', [{ rotate: '0deg' }, { rotate: '360deg' }], () => ({ duration: 450 }));
  loop('bob', [{ translate: '0 0' }, { translate: '0 -3px' }, { translate: '0 0' }], () => ({ duration: 320 }));
  loop('dash', [{ translate: '0 0' }, { translate: '-52px 0' }], () => ({ duration: 260 }));
  loop('speed', [{ translate: '30px 0', opacity: 0 }, { translate: '0 0', opacity: .9, offset: .3 }, { translate: '-70px 0', opacity: 0 }], i => ({ duration: 600, delay: i * 180 }));
  loop('puff', [{ translate: '0 0', scale: '.4', opacity: .9 }, { translate: '-46px -12px', scale: '1.5', opacity: 0 }], i => ({ duration: 800, delay: i * 260, easing: 'ease-out' }));
}

// Fin de scène : Miams qui comptent, pièces, flamme, bonus éventuel
function sceneEnd(app) {
  const o = app.s.order;
  if (!o || !app.s.sceneOn) return;
  app.set({ sceneOn: false });
  app.tween('gain', 0, o.gain, 900);
  app.tween('m', o.m0, o.m0 + o.gain, 900);
  if (rm()) app.snd('coin');
  else [0, 220, 440, 660].forEach(ms => app.later(() => app.snd('coin'), ms));
  app.later(() => {
    app.set({ streakShown: o.st1 }, () => { if (o.st1 !== o.st0) pop(app.$('[data-flame]')); });
    if (o.bonus) {
      app.tween('m', o.m0 + o.gain, o.m1, 700);
      app.set({ unlockShown: true }, () => { app.snd('win'); app.buzz(20); burst(app.$('[data-unlock]'), 50); });
    }
  }, rm() ? 0 : 1000);
}

function skipScene(app, r) {
  if (!app.s.sceneOn) return;
  app.clearT();
  sceneAnims.forEach(a => { try { a.finish(); } catch {} });
  loops(app, r);
  sceneEnd(app);
}

function runScene(app) {
  const r = app.$('[data-screen="confirm"]'), o = app.s.order;
  if (!r || !o) return;
  const D = TW.rtl ? -1 : 1;
  const enter = (p, kf, opts) => parts(r, p).map(el => app.keep(el.animate(kf, { fill: 'both', easing: EASE.sheet, duration: 560, ...opts })));
  app.set(s => ({ sceneOn: true, caption: 'En route !', unlockShown: false, streakShown: o.st0, tw: { ...s.tw, gain: 0, m: o.m0 } }));
  sceneAnims = [
    ...enter('road', [{ translate: `${390 * D}px 0`, opacity: 0 }, { translate: '0 0', opacity: 1 }]),
    ...enter('card', [{ translate: '0 70px', opacity: 0 }, { translate: '0 0', opacity: 1 }], { delay: 200 })
  ];
  app.later(() => app.snd('whoosh'), 100);
  app.later(() => app.snd('vroom'), 500);
  app.later(() => loops(app, r), 560);
  app.later(() => sceneEnd(app), 900);
  if (rm()) skipScene(app, r);
}

function replay(app) {
  if (!app.s.order) return;
  app.clearT();
  app.stopAnims();
  delete app.$('[data-screen="confirm"]')?.dataset.looping;
  app.set({ sceneOn: false }, () => runScene(app));
}

const scene = flip => html`
  <div class="scene" dir="ltr">
    <div class="scene__road" data-p="road">
      <div class="scene__flip" style="transform:scaleX(${flip})">
        ${STARS.map(([x, y, z, c]) => html`<span class="scene__star scene__star--${c}" style="left:${x}px;top:${y}px;width:${z}px;height:${z}px"></span>`)}
        <div class="scene__hill"></div>
        <div class="scene__hill scene__hill--b"></div>
        <div class="scene__asphalt"></div>
        <div class="scene__lane"><div class="scene__dash" data-p="dash"></div></div>
        ${SPEED.map(([x, y, w, a]) => html`<span class="scene__speed" data-p="speed" style="left:${x}px;top:${y}px;width:${w}px;opacity:${a}"></span>`)}
        ${PUFFS.map(([z, a]) => html`<span class="scene__puff" data-p="puff" style="width:${z}px;height:${z}px;background:rgba(255,246,233,${a})"></span>`)}
        <div class="scooter">
          <span class="scooter__wheel" data-p="wheel"></span>
          <span class="scooter__wheel scooter__wheel--front" data-p="wheel"></span>
          <div class="scooter__bob" data-p="bob">
            ${RIDER.map(c => html`<span class="${c.split(' ').map(x => `rider__${x}`).join(' ')}">${c === 'box' ? html`<span class="rider__logo" style="transform:scaleX(${flip})">M</span>` : nothing}</span>`)}
          </div>
        </div>
      </div>
    </div>
  </div>`;

export default {
  id: 'confirm',
  label: 'Confirmation',
  status: 'clear',

  view: (s, app) => {
    const o = s.order || { no: 'MC-2481', gain: 0, m0: s.miams, m1: s.miams, st0: s.streak, st1: s.streak, eta: s.now + 900000, bonus: 0 };
    const mNow = Math.round(s.tw.m ?? o.m0), nx = nextGift(mNow), unlocked = !!o.bonus && s.unlockShown;
    const streakSub = o.bonus ? `${o.st1}e flamme : +${o.bonus} Miams gagnés !`
      : o.st1 > o.st0 ? 'Ta flamme grandit, rendez-vous la semaine prochaine' : 'Ta flamme est déjà entretenue cette semaine';
    return html`
      <section class="screen confirm" data-screen="confirm">
        <div class="grain grain--soft"></div>
        <div class="confirm__bar">
          <button type="button" class="round-btn" aria-label="Son" @click=${() => app.set(x => ({ muted: !x.muted }))}>
            <span class="ms fill">${s.muted || !TW.sound ? 'volume_off' : 'volume_up'}</span>
          </button>
        </div>
        <div class="confirm__stage" dir="ltr">
          <div class="confirm__caption"><span data-caption>${s.caption}</span></div>
          ${scene(TW.rtl ? -1 : 1)}
        </div>
        <div class="confirm__card" data-p="card">
          <div class="confirm__head">
            <span class="confirm__check"><span class="ms">check</span></span>
            <div class="confirm__titles">
              <span class="confirm__title">Commande confirmée&nbsp;!</span>
              <span class="confirm__sub">N° ${o.no} · arrivée vers ${clock(o.eta)}</span>
            </div>
          </div>
          <div class="confirm__miams">
            <div class="confirm__gain">${miamCoin(true)}<span class="confirm__plus">+${s.tw.gain ?? 0} Miams</span><span class="confirm__total">${mNow} Miams</span></div>
            <div class="bar"><div class="bar__fill" style="width:${nx.pct}"></div></div>
            ${unlocked
              ? html`<span class="confirm__unlock" data-unlock><span class="ms fill">redeem</span>+${o.bonus} Miams bonus, 5 semaines d'affilée&nbsp;!</span>`
              : html`<span class="confirm__msg">${nx.msg}</span>`}
          </div>
          <div class="confirm__streak">
            <span class="streak-btn__in" data-flame><span class="ms fill">local_fire_department</span><span class="streak-btn__n tabnum">${s.streakShown}</span></span>
            <span class="confirm__streak-txt"><span class="confirm__streak-n">${s.streakShown} semaines d'affilée</span><span class="confirm__streak-sub">${streakSub}</span></span>
          </div>
          <button type="button" class="cta press" @click=${() => { app.snd('tap'); app.go('track'); }}><span class="ms fill">moped</span>Suivre ma commande</button>
          <button type="button" class="confirm__home" @click=${() => app.go('home', { reset: true })}>Retour à l'accueil</button>
        </div>
      </section>`;
  },

  enter(app) {
    runScene(app);
  },

  effects(prev, s, app) {
    if (s.caption && s.caption !== prev.caption) pop(app.$('[data-caption]'));
  },

  tools: (s, app) => html`<button type="button" class="tool" @click=${() => replay(app)}><span class="ms">replay</span>Replay scene</button>`,

  jump(app) {
    if (app.s.screen === 'confirm') return replay(app);
    jumpToOrder(app, 'confirm');
  }
};
