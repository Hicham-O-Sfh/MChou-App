# M'Chou — prototype d'app mobile

Prototype interactif d'une app de commande/livraison de crêpes, brownies, choux, milkshakes et
mojitos à Oujda (Maroc), en **HTML/CSS/JS sans build** (dossier `mchou_app_mobile/`). L'app finale
sera développée en **Flutter/Dart** ; ce dépôt sert à itérer sur le design et le comportement avant.

Le prototype vient d'un export Claude Design (`.dc.html`), porté puis supprimé le 2026-10-26 ;
il reste dans l'historique git (dernier commit qui le contient : `6057350`).

Méthodologie de travail : [.notes/methodologie.md](.notes/methodologie.md).
Détails du portage, structure et pièges : [mchou_app_mobile/README.md](mchou_app_mobile/README.md)
et [.notes/mchou_app_mobile.md](.notes/mchou_app_mobile.md).

## Décisions en cours

- **Thème « Fidèle » (sombre) uniquement.** Le thème clair « Nutella Fun » est abandonné.
- **Images** : emplacements vides `photo()` (`js/components/photo.js`). Une vraie photo va dans
  `mchou_app_mobile/assets/photos/` et se passe en second argument de `photo()`.
- **Réglages figés** : son activé, Reduce motion désactivé, LTR (`TW` dans `js/config.js`).
- **Données = vraie carte M'Chou** partout (`js/data/catalog.js`). Retranscription et décisions :
  [.notes/ecrans/menu.md](.notes/ecrans/menu.md).
- Pas de retour Android par l'historique, pas de sauvegarde entre deux lancements, pas de mode hors
  ligne, pas de version arabe : écartés pour le prototype (voir `todo.md`).

## Fichiers

| Fichier | Rôle |
|---|---|
| `mchou_app_mobile/` | Le prototype (voir son `README.md`) |
| `index.html` | Redirige la racine du site vers `mchou_app_mobile/` (GitHub Pages depuis la racine) |
| `.notes/` | Notes de travail : méthodologie, specs d'écrans, portage, téléphone |
| `todo.md` | Remarques, suggestions et points à peaufiner, au fil de l'eau (à tenir à jour) |

## Lancer

- Dans Claude Code : config `app` de `.claude/launch.json` (port 8766).
- À la main : `npm start` dans `mchou_app_mobile/`, puis `http://localhost:8766/` (bureau, avec le
  panneau des écrans) ou `http://localhost:8766/?mobile` (plein écran).
- Tests de la logique : `npm test` dans `mchou_app_mobile/`.
- Internet nécessaire : lit-html (CDN), Google Fonts, Material Symbols, Leaflet + tuiles OSM.

## Architecture (résumé)

- `js/app.js` : classe `App`, un seul état partagé (`app.s`, `app.set(patch, cb)`), navigation
  (`go`, `back`, `jump` depuis le panneau, `tab`), `toast`, feuilles (`openSheet`, `closeSheet`),
  minuteurs coupés à chaque changement d'écran (`later`, `every`), valeurs animées (`tween`).
- `js/screens/<id>.js` : un module par écran `{ id, label, bar, status, view(s, app) }` + au besoin
  `enter`, `leave`, `effects`, `jump`, `tools` (boutons du panneau). Ordre dans `screens/index.js`.
- `js/sheets/` (feuilles du bas, enregistrées dans `sheets/index.js`), `js/components/` (morceaux
  réutilisés), `js/actions/` (ce qui modifie l'état), `js/logic/` (calculs purs, testés),
  `js/data/` (carte, cadeaux, pièces de l'assiette), `js/ui/` (sons, animations, effets, cartes).
- CSS en classes et variables : `css/tokens.css` (thème), `base`, `components`, `shell`, un fichier
  par écran, `sheets.css`, assiette du builder.
- Familles avec builder (crêpes, spéciales, spaghetti, gaufres, brownies, choux) → builder ;
  boissons et packs → feuille d'options. **Ordre des familles** = ordre des pills et sections.
- Ligne de panier : `{ id, v, ex, sugar, note, unit, qty }`, plus `gift: <k>` pour un cadeau
  (0 DH, Miams rendus si on le retire). Fidélité : 1 DH = 1 Miam ; une flamme par semaine avec
  commande, +200 Miams toutes les 5. Specs : `.notes/ecrans/`.
- **Mode téléphone** (`?mobile` ou écran ≤ 600 px) : plein écran, largeur 390 mise à l'échelle de la
  zone sûre, sans panneau ni fausse barre d'état. `manifest.json` + `icons/` : installable (PWA).

### Ajouter un écran

1. `js/screens/<id>.js` en copiant un écran proche (racine `<section class="screen" data-screen>`,
   fond `grain`, ~54 px libres en haut, CTA en bas) et `css/screens/<id>.css` lié dans `index.html`.
2. L'ajouter à `SCREENS` dans `js/screens/index.js`, et l'état initial dans `js/state.js`.
3. Brancher la navigation (remplacer le `app.soon(...)` correspondant).

## Conventions du design system (thème « Fidèle »)

Source de vérité : `mchou_app_mobile/css/tokens.css`. Résumé :

- **Couleurs** : fond plum 900 `#3A0B40`, cartes/inputs plum 800 `#4E1256`, barre plum 950
  `#24062A`, texte crème `#FFF6E9`, texte secondaire lilas `#E9D3EE`, nav inactive `#C9A9D1`,
  prix/actif/script banane `#FFD84D`. CTA = dégradé caramel `#FFD36B → #F7B538` avec lèvre
  `#C98A12`. Framboise `#FF4D6D` uniquement flamme/badges/promos flash ; erreurs `#FF6B85` ;
  succès pistache `#8FCB6B`.
- **Un seul CTA doré par écran** (plus les prix). Les éléments dorés reposent sur une « lèvre »
  de 4 px (box-shadow) pour paraître pressables.
- **Typo** : Pacifico (titres d'accent uniquement), Fredoka (titres, boutons, prix 700 18/22),
  Nunito (texte 500 16/24, petit 600 14/20, caption 800 12/16 en capitales +6 %).
- **Formes** : radius 12 / 20 / 28 / pill ; boutons pill ; cibles tactiles ≥ 48 px
  (CTA XL 64, L 56, M 48).
- **Espaces** : grille de 4 pt, gouttière 20.
- **Mouvement** : press 90 ms (scale .95, s'enfonce de 3 px), release 420 ms
  `cubic-bezier(.34,1.56,.64,1)`, count-up 600 ms, sheet 360 ms `cubic-bezier(.32,.72,0,1)`.
  Toujours respecter Reduce motion (fondu 150 ms) et le réglage son.
- **Icônes** : Material Symbols Rounded, poids 400, FILL 1 quand actif.
- **Barre de nav** : flottante à 16 px des bords, 5 entrées (Accueil, Menu, Panier surélevé
  de 34 px, Cadeaux, Profil).
- **RTL** : penser start/end, jamais left/right ; icônes directionnelles en miroir (`flip-rtl`) ;
  prix en chiffres latins + « DH ».
- **Ton** : français, tutoiement, court et gourmand (« Je me régale ! »). Pas de culpabilisation
  ni de fausse urgence.

## Règles de travail

- Couleurs, rayons, durées : passer par les variables de `css/tokens.css`, pas de valeur en dur
  nouvelle sans décision.
- Réutiliser les composants et classes existants (`components.css`, `js/components/`) plutôt que
  réinventer un style.
- Après une modif, vérifier dans le navigateur (rendu + console) avant de conclure.
- Penser à la traduction Flutter : composants réutilisables, valeurs issues des tokens.
- Consigner décisions et specs dans `.notes/`, remarques et idées dans `todo.md`.
