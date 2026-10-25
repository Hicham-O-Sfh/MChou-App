import { rm } from '../config.js';
import { snd, buzz } from './sound.js';
import { bump } from './motion.js';

const CONFETTI = ['#FFD84D', '#FF4D6D', '#8FCB6B', '#FFF6E9', '#F7B538', '#C9A9D1'];
const FLY_EASE = 'cubic-bezier(.45,.05,.55,.95)';

let root = null, layer = null, getScale = () => 1;

export function mountFx(r, l, scale) { root = r; layer = l; getScale = scale; }

// Centre d'un élément dans le repère du téléphone (non mis à l'échelle)
export function rel(el) {
  const p = root.getBoundingClientRect(), r = el.getBoundingClientRect(), k = getScale();
  return { x: (r.left - p.left + r.width / 2) / k, y: (r.top - p.top + r.height / 2) / k };
}

function spawn(cls, x, y, w, h = w) {
  const n = document.createElement('div');
  n.className = cls;
  Object.assign(n.style, { left: `${x}px`, top: `${y}px`, width: `${w}px`, height: `${h}px` });
  layer.appendChild(n);
  return n;
}

export function fly(src, icon, done, size = 54) {
  const tgt = root?.querySelector('[data-cart-target]');
  let ran = false;
  const fin = () => { if (ran) return; ran = true; done?.(); setTimeout(() => bump(tgt), 30); };
  if (!src || !tgt || !layer || rm()) { snd('ding'); buzz(10); return fin(); }

  const a = rel(src), b = rel(tgt), dx = b.x - a.x, dy = b.y - a.y;
  const cx = dx * .5 + (Math.abs(dx) < 40 ? 70 : 0), cy = Math.min(0, dy) - 140;
  const pts = Array.from({ length: 13 }, (_, i) => {
    const t = i / 12, u = 1 - t;
    return [2 * u * t * cx + t * t * dx, 2 * u * t * cy + t * t * dy, t];
  });

  const main = spawn('fx-fly', a.x - size / 2, a.y - size / 2, size);
  const ic = document.createElement('span');
  ic.className = 'ms';
  ic.style.fontSize = `${Math.round(size * .52)}px`;
  ic.textContent = icon;
  main.appendChild(ic);
  const an = main.animate(pts.map(([x, y, t]) => ({ translate: `${x}px ${y}px`, scale: String(1 + Math.sin(t * Math.PI) * .25 - t * .55), rotate: `${t * 220}deg` })), { duration: 720, easing: FLY_EASE, fill: 'forwards' });

  for (let k = 1; k <= 4; k++) {
    const z = 12 - k * 2, d = spawn('fx-trail', a.x - z / 2, a.y - z / 2, z);
    d.animate(pts.map(([x, y, t]) => ({ translate: `${x}px ${y}px`, opacity: t > .92 ? 0 : .95 - k * .16 })), { duration: 720, delay: k * 50, easing: FLY_EASE, fill: 'forwards' }).onfinish = () => d.remove();
    setTimeout(() => d.remove(), 1100);
  }

  const land = () => { if (ran) return; main.remove(); snd('ding'); buzz(10); fin(); };
  an.onfinish = land;
  setTimeout(() => { main.remove(); land(); }, 820);
  snd('whoosh');
}

export function confetti(x, y, n = 40) {
  if (!layer || rm()) return;
  for (let i = 0; i < n; i++) {
    const d = spawn('fx-bit', x, y, 6 + Math.random() * 6, 8 + Math.random() * 8);
    d.style.borderRadius = Math.random() < .4 ? '50%' : '2px';
    d.style.background = CONFETTI[i % CONFETTI.length];
    const ang = Math.random() * Math.PI * 2, sp = 70 + Math.random() * 150, tx = Math.cos(ang) * sp, ty = Math.sin(ang) * sp - 110;
    d.animate([
      { translate: '0 0', rotate: '0deg', opacity: 1 },
      { translate: `${tx}px ${ty}px`, rotate: `${Math.random() * 540 - 270}deg`, opacity: 1, offset: .45 },
      { translate: `${tx * 1.2}px ${ty + 330}px`, rotate: `${Math.random() * 900}deg`, opacity: 0 }
    ], { duration: 1500 + Math.random() * 600, easing: 'cubic-bezier(.2,.6,.4,1)', fill: 'forwards' }).onfinish = () => d.remove();
    setTimeout(() => d.remove(), 2400);
  }
}

export function burst(el, n) {
  if (!el) return;
  const r = rel(el);
  confetti(r.x, r.y, n);
}

export function floatTxt(x, y, txt, color = '#FFD84D') {
  if (!layer || rm()) return;
  const d = document.createElement('div');
  d.className = 'fx-float';
  d.textContent = txt;
  Object.assign(d.style, { left: `${x - 70}px`, top: `${y - 14}px`, color });
  layer.appendChild(d);
  d.animate([
    { translate: '0 12px', opacity: 0, scale: '.7' },
    { translate: '0 -8px', opacity: 1, scale: '1.12', offset: .3 },
    { translate: '0 -54px', opacity: 0, scale: '1' }
  ], { duration: 900, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'forwards' }).onfinish = () => d.remove();
  setTimeout(() => d.remove(), 1100);
}
