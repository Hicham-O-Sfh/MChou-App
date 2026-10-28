/* Copyright (c) 2026 - Ing. Développeur Hicham Oussama Saffih */
import { html, render, nothing } from 'lit-html';
import { initialState } from './state.js';
import { DEMO_CART } from './actions/order.js';
import { FLAV, TAG_STYLE } from './data/catalog.js';
import { P, defSel } from './logic/catalog.js';
import { totals } from './logic/cart.js';
import { flame } from './logic/loyalty.js';
import { plateOf } from './logic/plate.js';
import { snd } from './ui/sound.js';
import { pop, shake, toastIn } from './ui/motion.js';
import { productCard } from './screens/home.js';
import { menuRow, packRow } from './screens/menu.js';
import { tag, addButton, qtyPill, searchBar } from './components/product.js';
import { axisPicker } from './components/axis.js';
import { progress, phoneField, phoneError } from './components/onboarding.js';
import { flameLine } from './components/flame.js';
import { miamCoin, feeRows } from './components/money.js';
import { plateView } from './components/plate.js';
import { sheet } from './components/sheet.js';
import { toastView } from './components/toast.js';
import { navBar } from './components/navbar.js';
import { googleG } from './components/google-g.js';

const SECTIONS = [
  ['principes', 'Principes'],
  ['couleurs', 'Couleurs'],
  ['typo', 'Typographie'],
  ['formes', 'Formes'],
  ['espaces', 'Espaces'],
  ['mouvement', 'Mouvement'],
  ['icones', 'Icônes'],
  ['boutons', 'Boutons'],
  ['chips', 'Chips et tags'],
  ['produits', 'Produits'],
  ['reglages', 'Réglages'],
  ['champs', 'Champs'],
  ['progression', 'Progression'],
  ['assiette', 'Assiette'],
  ['feuilles', 'Feuilles et toast'],
  ['nav', 'Navigation'],
  ['regles', 'Règles']
];

const COLORS = [
  ['plum-950', 'Barre du bas'],
  ['plum-900', "Fond de l'app"],
  ['plum-800', 'Cartes, champs'],
  ['plum-logo', 'Disque du logo, splash'],
  ['plum', 'Accents (3-D Secure)'],
  ['cream', 'Texte'],
  ['lilac', 'Texte secondaire'],
  ['lilac-idle', 'Nav inactive, indices'],
  ['banana', 'Prix, actif, script'],
  ['caramel-light', 'CTA (haut du dégradé)'],
  ['caramel', 'CTA (bas du dégradé)'],
  ['caramel-lip', 'Lèvre des éléments dorés'],
  ['raspberry', 'Flamme, promos flash'],
  ['raspberry-600', 'Badges'],
  ['raspberry-300', 'Erreurs'],
  ['pistachio', 'Succès, nouveautés']
];

const SEMANTIC = [
  'bg',
  'surface',
  'text',
  'text-muted',
  'text-on-gold',
  'price',
  'nav',
  'nav-active',
  'nav-idle',
  'success',
  'danger'
];

const TYPES = [
  ['script', 'Accent', 'une petite envie sucrée ?'],
  ['display', 'Display', 'Commande confirmée'],
  ['h1', 'Titre 1', 'Crêpe Nutella banane'],
  ['h2', 'Titre 2', 'Tes suppléments'],
  ['h3', 'Titre 3', 'Livraison à Hay Al Qods'],
  ['body', 'Texte', 'Crêpe dorée, Nutella généreux et rondelles de banane fraîche, pliée en quart.'],
  ['body-sm', 'Petit texte', 'Le livreur prépare ta monnaie à l’avance.'],
  ['caption', 'Légende', 'Drop du jour'],
  ['button', 'Bouton', 'Je me régale !'],
  ['price', 'Prix', '25 DH · 143 DH']
];

const DEPTHS = [
  ['lip-gold', 'Lèvre dorée', 'ds-depth--gold'],
  ['lip-plum', 'Lèvre plum', ''],
  ['sticker', 'Sticker', 'ds-depth--gold'],
  ['ring-gold', 'Anneau doré', ''],
  ['shadow-float', 'Flottant', '']
];

const SPACES = [1, 2, 3, 4, 5, 6, 8, 10];

const MOTIONS = [
  ['Press', 'press', 'ease-out', 'Échelle .95, s’enfonce de 3 px sur sa lèvre', 'press'],
  ['Release', 'release', 'ease-spring', 'Rebond au relâché, pop des badges', 'pop'],
  ['Count-up', 'countup', 'ease-out', 'Chaque prix qui change défile', 'count'],
  ['Vol vers le panier', 'fly', 'ease-in', 'Puis rebond du panier et « ding »', 'fly'],
  ['Feuille', 'sheet', 'ease-sheet', 'Feuilles du bas', 'sheet'],
  ['Erreur', 'base', 'ease-out', 'Champ refusé : secousse', 'shake']
];

const ICONS = [
  'home',
  'restaurant_menu',
  'shopping_bag',
  'redeem',
  'person',
  'search',
  'add',
  'remove',
  'delete',
  'close',
  'arrow_back',
  'chevron_right',
  'check_circle',
  'error',
  'info',
  'local_fire_department',
  'moped',
  'skillet',
  'cake',
  'bakery_dining',
  'icecream',
  'local_bar',
  'sell',
  'schedule',
  'location_on',
  'my_location',
  'call',
  'credit_card',
  'payments',
  'photo_camera',
  'lock',
  'celebration',
  'school',
  'replay',
  'language',
  'logout'
];

const swatch = name => `--mc-${name}`;
const cssVar = name => getComputedStyle(document.documentElement).getPropertyValue(swatch(name)).trim();

function luminance(hex) {
  const n = parseInt(hex.slice(1), 16);
  const c = [n >> 16, (n >> 8) & 255, n & 255].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}

const contrast = (a, b) => {
  const [x, y] = [luminance(a), luminance(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};

let s = { ...initialState, screen: 'home', cart: DEMO_CART, phone: '612345678', phoneBlur: true };
const ui = { fill: false, plate: 'crepe', count: 25, sw: true, qty: 2 };

const base = {
  get s() {
    return s;
  },
  set(patch) {
    s = { ...s, ...(typeof patch === 'function' ? patch(s) : patch) };
    draw();
  },
  snd,
  tab(id) {
    this.set({ screen: id });
  },
  $: sel => document.querySelector(sel)
};
// Les composants appellent aussi go, toast, buzz… : sans effet ici
const app = new Proxy(base, { get: (t, k) => (k in t ? Reflect.get(t, k, t) : () => {}) });

const play = (kind, e) => {
  const box = e.currentTarget.closest('.ds-motion').querySelector('.ds-motion__demo > *');
  const dur = parseFloat(cssVar(`dur-${e.currentTarget.dataset.dur}`)) || 0;
  const easing = cssVar(e.currentTarget.dataset.ease) || 'ease-out';
  snd('tap');
  if (kind === 'press')
    box.animate([{ transform: 'none' }, { transform: 'translateY(3px) scale(.95)' }, { transform: 'none' }], {
      duration: dur * 5,
      easing
    });
  if (kind === 'pop') pop(box);
  if (kind === 'shake') shake(box);
  if (kind === 'sheet') box.animate([{ translate: '0 100%' }, { translate: '0 0' }], { duration: dur, easing });
  if (kind === 'fly')
    box.animate(
      [
        { translate: '0 0', scale: '1' },
        { translate: '60px -40px', scale: '.8', offset: 0.5 },
        { translate: '120px 0', scale: '.5' }
      ],
      { duration: dur, easing: 'cubic-bezier(.45,.05,.55,.95)' }
    );
  if (kind === 'count') {
    const from = ui.count === 25 ? 25 : 143,
      to = from === 25 ? 143 : 25,
      t0 = performance.now();
    ui.count = to;
    const step = now => {
      const k = Math.min(1, (now - t0) / dur);
      box.textContent = `${Math.round(from + (to - from) * (1 - (1 - k) ** 3))} DH`;
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
};

const sec = (id, title, sub, body) => html`
  <section class="ds-sec" id=${id}>
    <header class="ds-sec__head">
      <h2 class="ds-sec__title">${title}</h2>
      ${sub ? html`<span class="ds-sec__sub">${sub}</span>` : nothing}
    </header>
    ${body}
  </section>`;

const principles = () => html`
  <div class="ds-grid ds-grid--3">
    <div class="ds-card">
      <span class="ds-card__title">Généreux et rond</span>
      <span class="ds-card__txt">Rayons 20 à 28, boutons pill, cibles de 48 px minimum. Les éléments dorés reposent sur une lèvre de 4 px : ils ont l’air pressables.</span>
    </div>
    <div class="ds-card">
      <span class="ds-card__title">L’or, c’est l’action</span>
      <span class="ds-card__txt">Le dégradé caramel est réservé au CTA principal de l’écran, plus les prix. Framboise seulement pour la flamme, les badges et les promos flash.</span>
    </div>
    <div class="ds-card">
      <span class="ds-card__title">Chaque tap répond</span>
      <span class="ds-card__txt">Écrasé au press, rebond au relâché, petit son et vibration légère. Jamais bloquant : réduire les animations et le son sont respectés.</span>
    </div>
  </div>`;

const colors = () => {
  const bg = cssVar('plum-900');
  return html`
    <div class="ds-grid ds-grid--swatch">
      ${COLORS.map(([n, role]) => {
        const v = cssVar(n).toUpperCase(),
          ratio = contrast(v, bg);
        return html`
          <div class="ds-swatch">
            <span class="ds-swatch__chip" style="background:var(${swatch(n)})"></span>
            <span class="ds-swatch__name">${n}</span>
            <code>${v}</code>
            <span class="ds-swatch__role">${role}</span>
            <span class="ds-swatch__ratio ${ratio >= 4.5 ? 'is-ok' : ''}">${ratio.toFixed(1)}:1 sur plum 900</span>
          </div>`;
      })}
      <div class="ds-swatch">
        <span class="ds-swatch__chip" style="background:var(--mc-grad-cta);box-shadow:var(--mc-lip-gold)"></span>
        <span class="ds-swatch__name">grad-cta</span>
        <code>caramel-light → caramel</code>
        <span class="ds-swatch__role">Un seul CTA doré par écran</span>
      </div>
    </div>
    <span class="ds-label">Rôles (variables sémantiques)</span>
    <div class="ds-roles">
      ${SEMANTIC.map(
        n =>
          html`<span class="ds-role"><span class="ds-role__dot" style="background:var(${swatch(n)})"></span>--mc-${n}</span>`
      )}
    </div>`;
};

function fontSpec(name) {
  const el = document.querySelector(`[data-type="${name}"]`);
  if (!el) return '';
  const cs = getComputedStyle(el);
  return `${cs.fontWeight} ${parseFloat(cs.fontSize)}/${parseFloat(cs.lineHeight) || '—'} ${cs.fontFamily.split(',')[0].replace(/"/g, '')}`;
}

const typography = () => html`
  <div class="ds-types">
    ${TYPES.map(
      ([n, label, sample]) => html`
        <div class="ds-type">
          <div class="ds-type__meta"><span class="ds-type__name">${label}</span><code>--mc-type-${n}</code><code>${fontSpec(n)}</code></div>
          <span class="ds-type__sample ${n === 'caption' ? 'ds-type__sample--caps' : ''} ${n === 'script' || n === 'price' ? 'tone-gold' : ''}" data-type=${n} style="font:var(--mc-type-${n})">${sample}</span>
        </div>`
    )}
  </div>`;

const shapes = () => html`
  <span class="ds-label">Rayons</span>
  <div class="ds-row">
    ${['sm', 'md', 'lg', 'pill'].map(
      r =>
        html`<div class="ds-shape"><span class="ds-shape__box" style="border-radius:var(--mc-radius-${r})"></span><code>radius-${r} · ${cssVar(`radius-${r}`)}</code></div>`
    )}
  </div>
  <span class="ds-label">Profondeur</span>
  <div class="ds-row">
    ${DEPTHS.map(
      ([n, label, cls]) =>
        html`<div class="ds-shape"><span class="ds-shape__box ds-depth ${cls}" style="box-shadow:var(--mc-${n})"></span><code>${label} · ${n}</code></div>`
    )}
  </div>`;

const spaces = () => html`
  <div class="ds-spaces">
    ${SPACES.map(
      n =>
        html`<div class="ds-space"><code>space-${n} · ${cssVar(`space-${n}`)}</code><span class="ds-space__bar" style="width:var(--mc-space-${n})"></span></div>`
    )}
    <div class="ds-space"><code>gouttière · ${cssVar('screen-gutter')}</code><span class="ds-space__bar" style="width:var(--mc-screen-gutter)"></span></div>
  </div>`;

const motion = () => html`
  <div class="ds-grid ds-grid--2">
    ${MOTIONS.map(
      ([label, dur, ease, desc, kind]) => html`
        <div class="ds-motion">
          <div class="ds-motion__txt">
            <span class="ds-card__title">${label}</span>
            <code>${cssVar(`dur-${dur}`)} · ${cssVar(ease)}</code>
            <span class="ds-card__txt">${desc}</span>
          </div>
          <div class="ds-motion__demo">
            ${
              kind === 'count'
                ? html`<span class="price ds-count">${ui.count} DH</span>`
                : kind === 'fly'
                  ? html`<span class="fx-fly ds-fly"><span class="ms">bakery_dining</span></span>`
                  : kind === 'shake'
                    ? html`<span class="field ds-shake is-err"><span class="field__prefix">+212</span><input class="field__input" value="5 12 34" readonly aria-label="Numéro refusé"></span>`
                    : html`<span class="cta ds-motion__cta">Je me régale !</span>`
            }
          </div>
          <button type="button" class="btn-outline ds-motion__play" data-dur=${dur} data-ease=${ease} @click=${e => play(kind, e)}>
            <span class="ms">play_arrow</span>Rejouer
          </button>
        </div>`
    )}
  </div>
  <p class="hint">Réduire les animations : fondu de 150 ms, sans arcs, défilements ni confettis (variables <code>--mc-dur-*</code> remises à zéro).</p>`;

const icons = () => html`
  <div class="ds-row ds-row--end">
    <button type="button" class="ds-toggle ${ui.fill ? 'is-on' : ''}" @click=${() => ((ui.fill = !ui.fill), draw())}>
      <span>FILL 1 (actif)</span><span class="switch"><span class="switch__knob"></span></span>
    </button>
  </div>
  <div class="ds-icons">
    ${ICONS.map(i => html`<div class="ds-icon"><span class="ms ${ui.fill ? 'fill' : ''}">${i}</span><code>${i}</code></div>`)}
  </div>`;

const buttons = () => html`
  <span class="ds-label">Principal · L 56 · M 48</span>
  <div class="ds-row">
    <button type="button" class="cta press">Je me régale !</button>
    <button type="button" class="cta cta--m press"><span class="ms">restaurant_menu</span>Voir le menu</button>
    <div class="ds-w"><button type="button" class="cta cta--fill press">Ajouter<span class="cta__dot"></span><span class="tabnum">25 DH</span></button></div>
    <span class="cta-off ds-w">Choisis une taille</span>
    <span class="cta-done ds-w"><span class="ms fill">check_circle</span>Ajouté</span>
  </div>
  <span class="ds-label">Secondaires</span>
  <div class="ds-row">
    <button type="button" class="btn-outline ds-w press"><span class="ms">photo_camera</span>Scanner ma carte</button>
    <button type="button" class="btn-ghost ds-w press">Non merci</button>
    <button type="button" class="btn-plum press">Tout voir</button>
    <button type="button" class="link-btn">Plus tard</button>
    <button type="button" class="link-action">Modifier</button>
  </div>
  <span class="ds-label">Icônes · 48</span>
  <div class="ds-row">
    <button type="button" class="icon-btn press" aria-label="Retour"><span class="ms flip-rtl">arrow_back</span></button>
    <button type="button" class="icon-btn icon-btn--dark ds-rel press" aria-label="Panier">
      <span class="ms fill">shopping_bag</span><span class="badge badge--s">2</span>
    </button>
    <button type="button" class="round-btn press" aria-label="Appeler"><span class="ms">call</span></button>
    <button type="button" class="close-btn" aria-label="Fermer"><span class="ms">close</span></button>
    ${addButton(() => snd('ding'))}
    <span class="ds-plum">${addButton(() => snd('ding'), 'add-btn--plum')}</span>
  </div>
  <span class="ds-label">Connexion Google · couleurs officielles</span>
  <div class="ds-row"><button type="button" class="btn-google ds-w">${googleG(20)}Continuer avec Google</button></div>`;

const chips = () => {
  const drink = Object.values(P).find(p => !p.bld && p.multi);
  return html`
    <span class="ds-label">Tags</span>
    <div class="ds-row">
      ${Object.keys(TAG_STYLE).map(t => tag(t))}
      <span class="tag tag--lg">N°1 DES VENTES</span>
      <span class="sold-out">Épuisé · retour demain</span>
    </div>
    <span class="ds-label">Saveurs et familles (menu)</span>
    <div class="ds-row ds-row--tight">
      ${FLAV.slice(0, 5).map(
        ([k, n, dot], i) =>
          html`<button type="button" class="flav press ${i === 1 ? 'is-on' : ''}"><span class="flav__dot" style="background:${dot}"></span><span class="flav__name">${n}</span></button>`
      )}
    </div>
    <div class="ds-row ds-row--tight">
      <button type="button" class="fam is-on"><span class="ms fill">skillet</span><span class="fam__name">Crêpes</span></button>
      <button type="button" class="fam"><span class="ms fill">cake</span><span class="fam__name">Brownies</span></button>
      <button type="button" class="fam"><span class="ms fill">local_bar</span><span class="fam__name">Mojitos</span></button>
    </div>
    <span class="ds-label">Choix d’une option, avec son prix</span>
    <div class="ds-narrow">
      ${drink.ax.slice(0, 1).map(a => axisPicker(drink, s.dsSel ?? defSel(drink), a, sel => app.set({ dsSel: sel })))}
    </div>`;
};

const products = () => html`
  <span class="ds-label">Carte produit · ajouté (devient une pastille) · épuisé</span>
  <div class="ds-row ds-row--top">
    ${productCard(app, P['crepe-nb'], 0)} ${productCard(app, P['brownie-pista'], 2)}
    ${productCard(app, P['speciales-brownie-dubai'], 0)}
  </div>
  <span class="ds-label">Lignes du menu et pack</span>
  <div class="ds-narrow">
    <div class="mlist">
      ${menuRow(app, P['mojito-fraise'], 0)} ${menuRow(app, P['crepe-nb'], 1)} ${menuRow(app, P['speciales-brownie-dubai'], 0)}
    </div>
    <div class="plist">${packRow(app, P['packs-choux-mixtes'], 0)} ${packRow(app, P['packs-choux-mixtes'], 2)}</div>
  </div>`;

const settings = () => html`
  <div class="ds-narrow ds-stack">
    <button type="button" class="ex-row ${ui.sw ? 'is-on' : ''}" @click=${() => ((ui.sw = !ui.sw), snd('tap'), draw())}>
      <span class="ex-row__thumb ex-row__thumb--banane"><span class="ex-art ex-art--banane"></span></span>
      <span class="ex-row__txt"><span class="ex-row__name">Banane</span><span class="ex-row__price">+5 DH</span></span>
      <span class="switch"><span class="switch__knob"></span></span>
    </button>
    <div class="ds-row">
      <div class="stepper">
        <button type="button" class=${ui.qty > 1 ? '' : 'is-off'} aria-label="Moins" @click=${() => ((ui.qty = Math.max(1, ui.qty - 1)), draw())}><span class="ms">remove</span></button>
        <span class="stepper__n">${ui.qty}</span>
        <button type="button" aria-label="Plus" @click=${() => (ui.qty++, draw())}><span class="ms">add</span></button>
      </div>
      <div class="ds-w">${qtyPill(
        ui.qty,
        () => ((ui.qty = Math.max(1, ui.qty - 1)), draw()),
        () => (ui.qty++, draw())
      )}</div>
      ${qtyPill(
        ui.qty,
        () => {},
        () => {},
        'qty--row'
      )}
      <span class="ds-plum">${qtyPill(
        ui.qty,
        () => {},
        () => {},
        'qty--plum'
      )}</span>
    </div>
  </div>`;

const fields = () => html`
  <div class="ds-grid ds-grid--2">
    <label class="form-field">
      <span class="field-label">Numéro de téléphone</span>
      ${phoneField({ ...s, phone: '', phoneBlur: false }, app)}
      <span class="hint">Par défaut</span>
    </label>
    <label class="form-field">
      <span class="field-label">Numéro de téléphone</span>
      ${phoneField(s, app)}
      ${phoneError(s)}
      <span class="hint">Saisie libre : valide, ou erreur après la sortie du champ</span>
    </label>
    <label class="form-field">
      <span class="field-label">Numéro de téléphone</span>
      ${phoneField({ ...s, phone: '51234', phoneBlur: true }, app)} ${phoneError({ ...s, phone: '51234', phoneBlur: true })}
    </label>
    <label class="form-field">
      <span class="field-label">Prénom <span class="field-label__opt">(facultatif)</span></span>
      <input class="text-input" placeholder="Marouane">
    </label>
    <div class="form-field ds-span">
      ${searchBar({ value: s.dsQuery ?? 'Pistache', placeholder: 'Nutella, choux, mojito…', onInput: e => app.set({ dsQuery: e.target.value }), onClear: () => app.set({ dsQuery: '' }) })}
    </div>
  </div>`;

const progressions = () => {
  const t = totals(s);
  return html`
    <div class="ds-grid ds-grid--2">
      <div class="ds-card ds-card--flat">
        <span class="free__left">Plus que <span class="tone-gold">35 DH</span> pour la livraison offerte</span>
        <div class="bar"><div class="bar__fill" style="width:76%"></div></div>
      </div>
      <div class="ds-card ds-card--flat ds-card--row">${progress(2, 4)}</div>
      <div class="ds-card ds-card--flat">${flameLine(flame({ streak: 3, weekDone: false }))}</div>
      <div class="ds-card ds-card--flat ds-card--row">
        <span class="streak-pill"><span class="ms fill">local_fire_department</span><span class="streak-pill__n">4</span></span>
        ${miamCoin()} ${miamCoin(true)}
        <span class="ds-badge-demo"><span class="ms fill">shopping_bag</span><span class="badge">2</span></span>
      </div>
      <div class="sum ds-span">
        ${feeRows(t)}
        <div class="sum__sep"></div>
        <div class="sum__total"><span>Total</span><span class="sum__amount">${t.total} DH</span></div>
        <div class="sum__gain">${miamCoin()}<span>Tu gagnes <b>${t.total} Miams</b></span></div>
      </div>
    </div>`;
};

// Le premier produit de chaque forme d'assiette
const PLATES = [];
for (const p of Object.values(P)) if (p.bld && !PLATES.some(([, b]) => b === p.bld)) PLATES.push([p.id, p.bld]);

const SHAPE_NAMES = { crepe: 'Crêpe', gaufre: 'Gaufre', brownie: 'Brownie', choux: 'Choux', spaghetti: 'Spaghetti' };

const plate = () => {
  const p = P[(PLATES.find(([, shape]) => shape === ui.plate) ?? PLATES[0])[0]];
  return html`
    <div class="ds-row ds-row--tight">
      ${PLATES.map(
        ([, shape]) =>
          html`<button type="button" class="fam ${p.bld === shape ? 'is-on' : ''}" @click=${() => ((ui.plate = shape), snd('tap'), draw())}><span class="fam__name">${SHAPE_NAMES[shape] ?? shape}</span></button>`
      )}
    </div>
    <div class="ds-plate">${plateView(plateOf(p, defSel(p)), {}, p.sugar)}</div>`;
};

const overlays = () => html`
  <div class="ds-grid ds-grid--2">
    <div class="ds-phone ds-phone--toast">
      <div class="grain"></div>
      ${toastView({ tone: 'ok', icon: 'check_circle', text: 'Ajouté au panier', action: { label: 'Voir' } }, app)}
      <button type="button" class="btn-outline ds-phone__btn" @click=${e => toastIn(e.currentTarget.parentElement.querySelector('[data-toast]'))}>
        <span class="ms">play_arrow</span>Rejouer le toast
      </button>
    </div>
    <div class="ds-phone">
      <div class="grain"></div>
      ${sheet(
        { cls: 'ups' },
        html`
          <span class="ups__ok"><span class="ms fill">check_circle</span>Ajouté au panier</span>
          <span class="ups__title">Une boisson avec ça ?</span>
          <div class="ups__item">
            <span class="ups__pic" style="background:${P['mojito-fraise'].tint}"></span>
            <span class="ups__txt"><span class="ups__name">Mojito fraise</span><span class="ups__price">${P['mojito-fraise'].price} DH</span></span>
            <button type="button" class="ups__add press" aria-label="Ajouter"><span class="ms">add</span></button>
          </div>
          <div class="ups__actions"><button type="button" class="btn-ghost press">Non merci</button></div>`
      )}
    </div>
  </div>`;

const nav = () => html`
  <div class="ds-phone ds-phone--nav">
    <div class="grain"></div>
    ${navBar(s, app)}
  </div>
  <p class="hint">Flottante à 16 px des bords, 5 entrées, panier surélevé de 34 px. Touche un onglet pour l’activer.</p>`;

const rules = () => html`
  <div class="ds-grid ds-grid--3">
    <div class="ds-card">
      <span class="ds-card__title">Accessibilité</span>
      <span class="ds-card__txt">Textes AA sur leur fond, cibles de 48 px minimum (les « + » ont une marge invisible). Chaque animation respecte « réduire les animations » ; le son a son propre réglage.</span>
    </div>
    <div class="ds-card">
      <span class="ds-card__title">Arabe, plus tard</span>
      <span class="ds-card__txt">Mises en page en start/end, jamais left/right. Icônes directionnelles en miroir (<code>flip-rtl</code>). Prix en chiffres latins + « DH ».</span>
    </div>
    <div class="ds-card">
      <span class="ds-card__title">Ton</span>
      <span class="ds-card__txt">Tutoiement, court et gourmand : « Je me régale ! », « Remplir mon assiette ». Pas de culpabilisation ni de fausse urgence.</span>
    </div>
  </div>`;

const page = () => html`
  <div class="ds">
    <header class="ds-top">
      <img class="ds-top__logo" src="assets/mchou-logo.png" alt="M'Chou">
      <div class="ds-top__txt">
        <h1 class="ds-top__title">Design system</h1>
        <span class="ds-top__sub">Thème « Fidèle » · v0.2 · base 390 × 844 · valeurs lues dans <code>css/tokens.css</code></span>
      </div>
      <a class="cta cta--m ds-top__go" href="./"><span class="ms">smartphone</span>Prototype</a>
    </header>
    <nav class="ds-toc scroll-x">${SECTIONS.map(([id, n]) => html`<a class="ds-toc__a" href="#${id}">${n}</a>`)}</nav>
    <main class="ds-main">
      ${sec('principes', 'Principes', '', principles())}
      ${sec('couleurs', 'Couleurs', 'contraste calculé sur le fond plum 900', colors())}
      ${sec('typo', 'Typographie', 'Pacifico · Fredoka · Nunito', typography())}
      ${sec('formes', 'Formes', 'rayons et profondeur', shapes())}
      ${sec('espaces', 'Espaces', 'grille de 4 pt · gouttière 20', spaces())}
      ${sec('mouvement', 'Mouvement', 'appuie sur « Rejouer »', motion())}
      ${sec('icones', 'Icônes', 'Material Symbols Rounded · poids 400 · FILL 1 quand actif', icons())}
      ${sec('boutons', 'Boutons', 'un seul CTA doré par écran', buttons())}
      ${sec('chips', 'Chips et tags', '', chips())}
      ${sec('produits', 'Produits', 'composants de l’accueil et du menu', products())}
      ${sec('reglages', 'Réglages', 'interrupteur, stepper, pastilles', settings())}
      ${sec('champs', 'Champs', 'défaut, valide, erreur', fields())}
      ${sec('progression', 'Progression', 'barre, étapes, flamme, Miams, badge, total', progressions())}
      ${sec('assiette', 'Assiette du builder', 'les 5 formes, garnitures incluses', plate())}
      ${sec('feuilles', 'Feuilles et toast', '', overlays())}
      ${sec('nav', 'Barre de navigation', '', nav())}
      ${sec('regles', 'Règles', '', rules())}
    </main>
  </div>`;

function draw() {
  render(page(), document.getElementById('ds'));
}

draw();
// Les specs typo se lisent sur le rendu : on redessine une fois les polices chargées
document.fonts.ready.then(draw);
