# Notes de développement

Détail technique sorti du README (devenu public).

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

## Mise en forme

`npx prettier --write .`, réglages dans `.prettierrc.json` (repris par l'extension Prettier de
VS Code). Les gabarits `html\`…\`` de lit-html ne sont pas reformatés.

## Pièges

- Le prototype vient d'un export Claude Design (`.dc.html`), porté puis supprimé du dépôt ; il reste
  dans l'historique git (dernier commit qui le contient : `6057350`).
- Les pages d'origine étaient en `content-box` (sauf les boutons) ; ici tout est en `border-box`. Un
  bloc qui avait une taille **et** un padding reprend sa taille rendue (ex. carte produit 184 px).
  L'assiette du builder reste en `content-box`.
- Pour vérifier une animation quand la fenêtre n'est pas au premier plan, remplacer
  `requestAnimationFrame` par un `setTimeout` de 16 ms : sinon elle reste figée.

## Publication

GitHub Pages : Settings → Pages → « Deploy from a branch », `main`, dossier `/ (root)`.
