# mchou_app_mobile — portage du prototype en HTML/CSS/JS

But : un prototype au code propre et maintenable, fidèle au prototype `.dc.html` (rendu,
comportements, animations, sons). Le prototype d'origine reste intact et sert de **référence** :
chaque écran porté est comparé côte à côte avec lui.

## Lancer

- Claude Code : config `app` de `.claude/launch.json` (port 8766), la référence sur `prototype` (8765).
- À la main : `python -m http.server 8766 --bind 127.0.0.1 --directory mchou_app_mobile`.
- Tests de la logique : `npm test` dans `mchou_app_mobile/` (Node ≥ 20, sans dépendance).

## Choix techniques (2026-10-25)

- **Pas de build** : modules ES natifs, servis tels quels.
- **lit-html 3.2.1** (CDN jsdelivr, import map) pour le rendu : seules les parties qui changent sont
  mises à jour, donc les animations ne sont pas interrompues. `keyed(screen)` recrée le DOM à
  chaque changement d'écran (comme `sc-if` dans l'original).
- **CSS en classes + variables** (`css/tokens.css` = thème Fidèle de `tokens/`). Plus de styles inline,
  sauf les valeurs calculées (échelle, positions des effets).
- **Un seul état partagé** (`core/store.js`) : `set(patch, cb)` comme `setState`, rendu groupé.
- Logique métier pure dans `js/logic/` (sans DOM) → testable avec `node --test`.

## Structure

| Dossier | Rôle |
|---|---|
| `js/app.js` | Classe `App` : état, navigation (`go/back/jump/tab`), toast, sheets, minuteurs, `tween`, effets après rendu |
| `js/shell.js` | Coquille : panneau, cadre téléphone / mode `?mobile`, barre d'état, nav, sheet, toast, calque d'effets |
| `js/screens/` | Un module par écran : `{ id, label, bar, status, view(s, app), enter?(app), effects?(prev, s, app), jump?(app), tools?(s, app) }` |
| `js/sheets/` | Feuilles, enregistrées dans `sheets/index.js` par id (`state.sheet`) |
| `js/components/` | Morceaux d'interface réutilisables (nav, toast, sheet, panneau, barre d'état) |
| `js/ui/` | `sound` (WebAudio), `motion` (entrées, press, pop, shake, bump, boucles), `fx` (vol vers le panier, confettis, texte flottant) |
| `js/logic/` | Calculs (panier, puis catalogue, prix, fidélité…) |
| `css/` | `tokens`, `base` (reset, icônes, `.press`, tons), `components`, `shell` |

Conventions reprises de l'original : `data-screen`, `data-cart-target`, `data-badge`, `data-panel`,
`data-scrim`, `data-toast`, `data-spin`, `data-pulse`, `data-scroll` (zone qui remonte au tap sur l'onglet).
Toast : `app.toast(texte, { icon, tone: ok|gold|err|idle|soft, action: { label, fn } })`.

## Avancement

1. ✅ **Socle** : tokens, coquille, panneau, barre d'état, nav + badge, routeur avec glissement
   d'entrée (sens inversé au retour), toast, mécanique des sheets, sons, effets, `tween`, test du
   panier. Les 13 écrans sont des espaces réservés (« À porter » + écran suivant). Vérifié côte à
   côte : cadre, nav, panneau identiques au pixel, ainsi que le mode `?mobile`.
2. ✅ **Splash → login → téléphone → adresse** + feuille Google. Logique `logic/phone.js`
   (format, préfixes, état du champ) et `logic/geo.js` (distance, zone 6 km, délai) testées.
   Carte Leaflet dans `ui/map.js`, créée à `enter` et détruite à `leave`. `components/photo.js`
   remplace `<image-slot>` (même emplacement vide, sans « browse files » puisqu'on n'importe pas
   de photo). Le focus du champ passe par `:focus-within` au lieu d'un état `phoneFocus`.
3. Home → Menu (catalogue `FAMS/AX/FLAV/EX` dans `logic/`)
4. Builder
5. Panier → checkout → confirmation → suivi
6. Cadeaux, profil, sheets restantes
7. PWA (manifest et icônes déjà copiés), relecture finale

## Écarts de l'original gardés tels quels (à trancher)

- Feuille Google : l'avatar affiche « H » alors que le compte est « Marouane Berrichi ».
- Adresse : « Pour que le livreur puisse **vous** contacter » (vouvoiement, le reste tutoie).

Le panneau de gauche : `jump` ira chercher un `jump(app)` propre à l'écran quand il en faut un (données de
démo pour panier, confirmation, suivi) ; les boutons contextuels (« Next status », « Replay scene ») passent
par `tools(s, app)`.
