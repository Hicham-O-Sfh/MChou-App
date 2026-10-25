import { rm } from '../config.js';

export const EASE = {
  spring: 'cubic-bezier(.34,1.56,.64,1)',
  sheet: 'cubic-bezier(.32,.72,0,1)',
  in: 'cubic-bezier(.45,.05,.8,.35)',
  out: 'cubic-bezier(.22,1,.36,1)'
};

const fade = el => el?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 150 });

export function screenIn(el, dir) {
  if (rm()) return fade(el);
  el.animate([{ translate: `${dir * 48}px 0`, opacity: 0 }, { translate: '0 0', opacity: 1 }], { duration: 380, easing: EASE.sheet });
}

export function sheetIn(panel, scrim) {
  if (rm()) return fade(panel);
  panel?.animate([{ translate: '0 100%' }, { translate: '0 0' }], { duration: 360, easing: EASE.sheet });
  scrim?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 260 });
}

export function sheetOut(panel, done) {
  if (!panel || rm()) return done();
  panel.animate([{ translate: '0 0' }, { translate: '0 100%' }], { duration: 240, easing: EASE.in, fill: 'forwards' }).onfinish = done;
  setTimeout(done, 320);
}

export function toastIn(el) {
  if (!el) return;
  if (rm()) return fade(el);
  el.animate([{ translate: '0 -24px', opacity: 0, scale: '.96' }, { translate: '0 0', opacity: 1, scale: '1' }], { duration: 420, easing: EASE.spring });
}

export function pop(el) {
  if (!el || rm()) return;
  el.animate([{ scale: '.6', opacity: 0 }, { scale: '1.1', opacity: 1, offset: .6 }, { scale: '1', opacity: 1 }], { duration: 440, easing: EASE.spring });
}

export function shake(el) {
  if (!el || rm()) return;
  el.animate(['0', '-8px', '7px', '-5px', '3px', '0'].map(x => ({ translate: `${x} 0` })), { duration: 380, easing: 'ease-out' });
}

export function bump(el) {
  if (!el || rm()) return;
  el.animate([{ scale: '1' }, { scale: '1.22' }, { scale: '.94' }, { scale: '1' }], { duration: 460, easing: EASE.spring });
  el.querySelector('[data-badge]')?.animate([{ scale: '.3' }, { scale: '1.3' }, { scale: '1' }], { duration: 420, delay: 60, easing: EASE.spring, fill: 'backwards' });
}

// data-spin / data-pulse : boucles posées une fois par élément
export function autoAnim(root) {
  if (!root) return;
  root.querySelectorAll('[data-spin]:not([data-on])').forEach(el => {
    el.dataset.on = '1';
    el.animate([{ rotate: '0deg' }, { rotate: '360deg' }], { duration: 1100, iterations: Infinity });
  });
  if (rm()) return;
  root.querySelectorAll('[data-pulse]:not([data-on])').forEach(el => {
    el.dataset.on = '1';
    el.animate([{ scale: '1', opacity: .9 }, { scale: '1.5', opacity: 0 }], { duration: 1400, iterations: Infinity, easing: 'ease-out' });
  });
}
