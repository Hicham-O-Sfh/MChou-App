# Prototype sur téléphone

But : ouvrir le prototype sur mon téléphone (Samsung Galaxy S25 FE, Android/Chrome), en plein
écran, lancé depuis une icône sur l'écran d'accueil.

## En place

- **Mode téléphone** (`MOB` dans `mchou_app_mobile/js/config.js`), actif sur écran ≤ 600 px ou avec
  `?mobile` : pas de panneau de gauche, pas de cadre ni de fausse barre d'état ; largeur 390 mise à
  l'échelle de la zone sûre (encoche, barre de gestes), hauteur adaptée. Zoom au double-tap bloqué.
- **PWA** : `mchou_app_mobile/manifest.json` (nom, couleurs `#3A0B40`, `display: standalone`, démarre
  sur `./?mobile`) et icônes `icons/icon-192.png` / `icon-512.png`.
- `index.html` à la racine du dépôt redirige vers `mchou_app_mobile/` en gardant `?mobile`.
- Tous les chemins sont relatifs : l'app fonctionne dans un sous-dossier (vérifié le 2026-10-26).

## GitHub Pages

- Adresse voulue : `https://hicham-o-sfh.github.io/MChou-App` → le dépôt doit s'appeler `MChou-App`
  (Settings → General → Repository name), puis côté PC :
  `git remote set-url origin https://github.com/Hicham-O-Sfh/MChou-App.git`.
- Settings → Pages : « Deploy from a branch », `main`, dossier `/ (root)` (l'interface ne propose que
  la racine ou `/docs`). La racine redirige vers `…/MChou-App/mchou_app_mobile/`.
- Dépôt public, ou compte payant pour publier un dépôt privé.
- Sur le téléphone : ouvrir l'adresse dans Chrome, puis menu ⋮ → « Installer l'application ».
- Internet reste nécessaire (lit-html, polices, icônes, tuiles OSM).

## Alternative rapide : même Wi-Fi

`python dev-server.py 8766 0.0.0.0` dans `mchou_app_mobile/`, autoriser Python dans le pare-feu
Windows, ouvrir `http://<IP-du-PC>:8766/?mobile` sur le téléphone. Pas d'installation PWA (pas d'HTTPS).
