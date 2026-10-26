# Prototype sur téléphone

But : ouvrir la maquette interactive sur mon téléphone (Samsung Galaxy S25 FE, Android/Chrome),
en plein écran, lancée depuis une icône sur l'écran d'accueil.

## Fait (2026-10-15)

- **Mode téléphone** dans `Ordering-Prototype.dc.html` (`MOB`), actif sur écran ≤ 600 px ou avec
  `?mobile` : pas de panneau de gauche, pas de cadre ni de fausse barre d'état, l'app occupe tout
  l'écran (largeur 390 mise à l'échelle, hauteur adaptée). Zoom au double-tap bloqué.
- **PWA** : `manifest.json` (nom, couleurs `#3A0B40`, `display: standalone`, démarre sur
  `Ordering-Prototype.dc.html?mobile`) et icônes `icons/icon-192.png` / `icon-512.png`.
- Fichiers renommés sans espace : `Ordering-Prototype.dc.html`, `Design-System.dc.html`.
- `index.html` à la racine redirige vers `mchou_app_mobile/` (depuis le 2026-10-26 ; avant, vers la
  coquille `.dc.html`). Le paramètre `?mobile` est conservé.

## GitHub Pages (2026-10-26)

- Settings → Pages : « Deploy from a branch », `main`, dossier `/ (root)` (l'interface ne propose que
  la racine ou `/docs`).
- App : `https://<compte>.github.io/MChou/` (redirige) ou `…/MChou/mchou_app_mobile/?mobile`.
- Plus de piège d'encodage : mchou_app_mobile n'utilise pas de chemin `screens%2F…`.

## À faire

- Déployer sur **GitHub Pages** (dépôt public, ou compte payant pour un dépôt privé).
- Tester le **piège d'encodage** : le runtime charge les écrans en `screens%2F<id>.dc.html`
  (slash encodé). Notre serveur Python le résout ; GitHub Pages peut-être pas. Si ça casse :
  noms à plat sans sous-dossier, ou copie des fichiers sous le nom encodé au déploiement.
- Sur le téléphone : ouvrir l'URL dans Chrome, puis menu ⋮ → « Installer l'application »
  (ou « Ajouter à l'écran d'accueil »).
- Internet reste nécessaire (React via unpkg, polices, icônes, tuiles OSM).

## Alternative rapide : même Wi-Fi

Serveur en `--bind 0.0.0.0`, autoriser Python dans le pare-feu Windows, ouvrir
`http://<IP-du-PC>:8765/` sur le téléphone. Pas d'installation PWA (pas d'HTTPS).
