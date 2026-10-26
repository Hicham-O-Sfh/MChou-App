import { TW } from '../config.js';

let ctx = null, muted = false;

export const setMuted = v => { muted = v; };

const voice = (C, t0) => ({
  tone(f, f2, at, dur, v, type = 'sine') {
    const o = C.createOscillator(), g = C.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f, t0 + at);
    if (f2) o.frequency.exponentialRampToValueAtTime(f2, t0 + at + dur);
    g.gain.setValueAtTime(.0001, t0 + at);
    g.gain.exponentialRampToValueAtTime(v, t0 + at + .012);
    g.gain.exponentialRampToValueAtTime(.0001, t0 + at + dur);
    o.connect(g).connect(C.destination);
    o.start(t0 + at);
    o.stop(t0 + at + dur + .05);
  },
  noise(at, dur, v, f1, f2, q = 1) {
    const n = Math.floor(C.sampleRate * dur), buf = C.createBuffer(1, n, C.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    const src = C.createBufferSource(), f = C.createBiquadFilter(), g = C.createGain();
    src.buffer = buf;
    f.type = 'bandpass';
    f.Q.value = q;
    f.frequency.setValueAtTime(f1, t0 + at);
    f.frequency.exponentialRampToValueAtTime(f2, t0 + at + dur);
    g.gain.setValueAtTime(.0001, t0 + at);
    g.gain.exponentialRampToValueAtTime(v, t0 + at + dur * .3);
    g.gain.exponentialRampToValueAtTime(.0001, t0 + at + dur);
    src.connect(f).connect(g).connect(C.destination);
    src.start(t0 + at);
    src.stop(t0 + at + dur + .05);
  }
});

const SOUNDS = {
  tap: v => v.tone(660, 0, 0, .05, .02),
  pop: v => v.tone(440, 880, 0, .1, .045),
  off: v => v.tone(620, 360, 0, .09, .03),
  ding: v => { v.tone(1046.5, 0, 0, .45, .04); v.tone(1568, 0, .02, .35, .018); },
  coin: v => { v.tone(988, 0, 0, .07, .03, 'triangle'); v.tone(1319, 0, .07, .22, .03, 'triangle'); },
  whoosh: v => v.noise(0, .35, .05, 500, 2600, .9),
  sizzle: v => v.noise(0, 1.8, .012, 3500, 6000, .6),
  vroom: v => { v.tone(110, 220, 0, .45, .02, 'sawtooth'); v.noise(0, .5, .02, 300, 900, 1); },
  win: v => [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => v.tone(f, 0, i * .09, .32, .03, 'triangle')),
  err: v => v.tone(330, 220, 0, .22, .035, 'triangle')
};

export function snd(k) {
  if (!TW.sound || muted || !SOUNDS[k]) return;
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx ??= new AC();
    if (ctx.state === 'suspended') ctx.resume();
    SOUNDS[k](voice(ctx, ctx.currentTime + .01));
  } catch {}
}

// Le navigateur refuse (et le signale en console) toute vibration avant le premier vrai tap
export function buzz(ms = 8) {
  if (navigator.userActivation && !navigator.userActivation.hasBeenActive) return;
  try { navigator.vibrate?.(ms); } catch {}
}
