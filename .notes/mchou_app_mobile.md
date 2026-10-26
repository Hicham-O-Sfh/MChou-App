# mchou_app_mobile — portage du prototype en HTML/CSS/JS

But : un prototype au code propre et maintenable, fidèle au prototype `.dc.html` (rendu,
comportements, animations, sons). Le prototype d'origine reste intact et sert de **référence** :
chaque écran porté est comparé côte à côte avec lui.

## Lancer

- Claude Code : config `app` de `.claude/launch.json` (port 8766), la référence sur `prototype` (8765).
- À la main : `npm start` dans `mchou_app_mobile/` (lance `python dev-server.py 8766`, sans cache).
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

**Piège des tailles** : les pages d'origine n'ont pas de `box-sizing: border-box` (seuls les boutons
l'ont), alors qu'ici il est global. Un `div`/`span` avec largeur ou hauteur **et** padding dans l'original
doit donc reprendre sa taille rendue (ex. carte produit 168 + 2×8 = 184 px, ligne du menu min 64 + 16 = 80 px).

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
3. ✅ **Home → Menu** + feuilles « série » et « options ». Données de la carte dans `js/data/`
   (`catalog.js`, `loyalty.js`), calculs dans `js/logic/` (`catalog.js` : produits, prix, recherche ;
   `loyalty.js` : prochain cadeau, flamme ; `cart.js` : fusion des lignes, retrait), actions qui
   touchent l'état dans `js/actions/`. La feuille d'options n'affiche plus de suppléments : aucune
   famille sans builder n'en a. En revenant sur le menu, la barre des familles se recale sur la
   famille active (l'original la laissait au début).
4. ✅ **Builder** + feuille « Une boisson avec ça ? » : porté et comparé (5 formes d'assiette, 8
   garnitures, parcours d'ajout identiques). Pièces de l'assiette converties en données
   (`js/data/plate-pieces.js`, `css/plate-pieces.css`, générés depuis `screens/builder.dc.html`).
   Prix animé vérifié (25 → 50 DH en courbe, valeurs finales justes).

**Piège de test** : quand la fenêtre de Claude n'est pas au premier plan, le panneau navigateur ne
dessine plus d'images, donc `requestAnimationFrame` et les animations s'arrêtent à mi-chemin. Pour
vérifier une animation, remplacer temporairement `requestAnimationFrame` par un `setTimeout` de 16 ms.
5. ✅ **Panier → paiement → confirmation → suivi** + feuille 3-D Secure. Calculs dans `js/logic/`
   (`payment.js` : saisie et contrôle de la carte, Luhn, code promo ; `time.js` : créneaux ;
   `order.js` : passage de commande, Miams, flamme, bonus, historique ; `loyalty.js` : cadeaux et
   remboursement) avec leurs tests ; actions dans `js/actions/order.js`. Panneau : « Replay scene »
   et « Next status » via `tools()`. Écart volontaire : la ligne « +200 Miams bonus » de la
   confirmation tient sur une ligne (l'original la cassait à cause du runtime dc).
   `dev-server.py` remplace `python -m http.server` : sans en-tête de cache, le navigateur gardait
   d'anciens modules JS (pour un cache déjà pollué, ouvrir `127.0.0.1:8766` au lieu de `localhost`).
6. ✅ **Cadeaux, profil** + feuille cadeau. Les 13 écrans et les 7 feuilles sont portés ; plus
   d'espace réservé (`screens/index.js` ne liste que les modules). Échange de Miams dans
   `js/actions/gifts.js`, date d'anniversaire en toutes lettres dans `logic/time.js`.
7. PWA (manifest et icônes déjà copiés), relecture finale

Remarques, suggestions et points à peaufiner : [todo.md](../todo.md) à la racine.

Le panneau de gauche : `jump` ira chercher un `jump(app)` propre à l'écran quand il en faut un (données de
démo pour panier, confirmation, suivi) ; les boutons contextuels (« Next status », « Replay scene ») passent
par `tools(s, app)`.
