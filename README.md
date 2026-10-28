# M'Chou — prototype mobile

Prototype interactif de l'app M'Chou (crêpes, choux, brownies, mojitos à Oujda), en HTML/CSS/JS
sans étape de build. Sert de spécification visuelle et comportementale pour l'app Flutter.

- Prototype : <https://hicham-o-sfh.github.io/MChou-App/>
- Design system : <https://hicham-o-sfh.github.io/MChou-App/design-system.html>

## Lancer

Ouvrir `index.html` avec **Live Server** (VS Code), ou tout autre serveur HTTP statique (les modules
ES ne se chargent pas en `file://`). `?mobile` force le mode téléphone (plein écran, sans panneau).
Internet est nécessaire : lit-html, polices, icônes et cartes viennent de CDN.

## Tester

```bash
npm test
```

Tests de la logique pure (`js/logic/`) avec `node --test`, sans dépendance.

## Mettre en forme

```bash
npx prettier --write .
```

Réglages dans `.prettierrc.json` (repris par l'extension Prettier de VS Code). Les gabarits
`html\`…\`` de lit-html ne sont pas reformatés.

## Organisation

| Dossier | Contenu |
|---|---|
| `index.html` | Le prototype |
| `design-system.html` | Vitrine des tokens et composants (couleurs, typo, boutons, cartes, champs…) |
| `js/app.js` | Classe `App` : état partagé, navigation, toasts, feuilles, minuteurs, valeurs animées |
| `js/shell.js` | Coquille : panneau, cadre téléphone, barre d'état, nav, feuille et toast courants |
| `js/screens/` | Un module par écran : `view`, et au besoin `enter`, `leave`, `effects`, `jump`, `tools` |
| `js/sheets/` | Feuilles du bas, déclarées dans `sheets/index.js` |
| `js/components/` | Morceaux d'interface réutilisés (boutons, produit, photo, assiette, flamme…) |
| `js/actions/` | Actions qui modifient l'état (panier, commande, cadeaux) |
| `js/logic/` | Calculs purs et testés (prix, panier, carte, créneaux, fidélité, assiette) |
| `js/data/` | Données : la carte M'Chou, les cadeaux, les pièces de l'assiette du builder |
| `js/ui/` | Sons, animations, effets (vol vers le panier, confettis), cartes Leaflet |
| `css/` | `tokens` (thème Fidèle), `base`, `components`, `shell`, un fichier par écran, feuilles |

Rendu avec [lit-html](https://lit.dev/docs/libraries/standalone-templates/) : seules les parties qui
changent sont mises à jour, ce qui laisse les animations tranquilles.

## À savoir

- Le prototype vient d'un export Claude Design (`.dc.html`), porté puis supprimé du dépôt ; il reste
  dans l'historique git (dernier commit qui le contient : `6057350`).
- Les pages d'origine étaient en `content-box` (sauf les boutons) ; ici tout est en `border-box`. Un
  bloc qui avait une taille **et** un padding reprend sa taille rendue (ex. carte produit 184 px).
  L'assiette du builder reste en `content-box`.
- Pour vérifier une animation quand la fenêtre n'est pas au premier plan, remplacer
  `requestAnimationFrame` par un `setTimeout` de 16 ms : sinon elle reste figée.

## Installer sur le téléphone

`manifest.json` et `icons/` rendent l'app installable : ouvrir le site GitHub Pages dans Chrome,
menu ⋮ → « Installer l'application ». Elle s'ouvre en plein écran sur `?mobile`.

GitHub Pages : Settings → Pages → « Deploy from a branch », `main`, dossier `/ (root)`.
