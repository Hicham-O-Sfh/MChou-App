# M'Chou — prototype mobile

Prototype interactif de l'app M'Chou (crêpes, choux, brownies, mojitos à Oujda), en HTML/CSS/JS
sans étape de build. Portage fidèle du prototype Claude Design (`../Ordering-Prototype.dc.html`),
qui reste la référence visuelle et fonctionnelle.

## Lancer

```bash
npm start
```

Puis <http://localhost:8766/> (bureau, avec le panneau des écrans) ou <http://localhost:8766/?mobile>
(plein écran, comme sur téléphone). Internet est nécessaire : lit-html, polices, icônes et cartes
viennent de CDN.

`dev-server.py` sert les fichiers sans cache navigateur ; avec `python -m http.server`, le navigateur
garde d'anciens modules après une modification.

## Tester

```bash
npm test
```

Tests de la logique pure (`js/logic/`) avec `node --test`, sans dépendance.

## Organisation

| Dossier | Contenu |
|---|---|
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

- Les pages d'origine sont en `content-box` (sauf les boutons) ; ici tout est en `border-box`. Un bloc
  qui a une taille **et** un padding dans l'original reprend sa taille rendue.
- `js/data/plate-pieces.js` et `css/plate-pieces.css` ont été générés depuis `screens/builder.dc.html` :
  ce sont désormais eux qu'on modifie.
- Pour vérifier une animation quand la fenêtre n'est pas au premier plan, remplacer
  `requestAnimationFrame` par un `setTimeout` de 16 ms : sinon elle reste figée.

## Installer sur le téléphone

`manifest.json` et `icons/` rendent l'app installable (« Ajouter à l'écran d'accueil »), ouverte en
plein écran sur `?mobile`. Il faut la servir en HTTPS, par exemple via GitHub Pages
(voir `../.notes/mobile.md`). Tous les chemins sont relatifs : le dossier fonctionne tel quel
dans un sous-répertoire.

Décisions, avancement et écarts avec l'original : `../.notes/mchou_app_mobile.md`.
Remarques et points à peaufiner : `../todo.md`.
