import { html } from 'lit-html';
import { rm } from '../config.js';
import { EASE } from '../ui/motion.js';

export default {
  id: 'splash',
  label: 'Splash',
  status: 'clear',

  view: (s, app) => html`
    <section class="screen splash" data-screen="splash" @click=${() => app.go('login', { reset: true })}>
      <div class="grain grain--strong"></div>
      <div class="splash__glow"></div>
      <img class="splash__logo" data-p="logo" src="assets/mchou-logo.png" alt="M'Chou">
      <span class="splash__tag" data-p="tag">Crêpes &amp; douceurs</span>
      <div class="splash__foot">
        <span class="splash__crepe" data-spin></span>
        <span class="splash__city">OUJDA</span>
      </div>
    </section>`,

  enter(app) {
    const r = app.$('[data-screen="splash"]');
    if (r && !rm()) {
      r.querySelector('[data-p="logo"]').animate([
        { scale: '.3', rotate: '-20deg', opacity: 0 },
        { scale: '1.08', rotate: '4deg', opacity: 1, offset: .65 },
        { scale: '1', rotate: '0deg', opacity: 1 }
      ], { duration: 800, easing: EASE.spring, fill: 'both' });
      r.querySelector('[data-p="tag"]').animate([{ translate: '0 16px', opacity: 0 }, { translate: '0 0', opacity: 1 }], { duration: 500, delay: 450, easing: EASE.out, fill: 'both' });
    }
    app.later(() => app.go('login', { reset: true }), 2600);
  }
};
