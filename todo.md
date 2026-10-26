# À faire, à peaufiner, idées

Remarques et suggestions au fil de l'eau. Cocher quand c'est réglé, avec la date.

## Portage mchou_app_mobile

- [ ] Étapes 5 à 7 du portage (panier → suivi, cadeaux et profil, PWA) — voir `.notes/mchou_app_mobile.md`.
- [ ] Ajouter de vraies photos : les emplacements `photo()` (ex-`<image-slot>`) attendent des fichiers dans
      `assets/photos/` ; prévoir une table produit → photo quand les photos arrivent.
- [ ] Après un rechargement, la barre des familles du menu peut se caler trop loin si les polices ne sont pas
      encore chargées (largeurs calculées avec la police de secours). Recaler après `document.fonts.ready`.
      Même défaut dans l'original.
- [ ] Vibration : les navigateurs bloquent `navigator.vibrate` avant le premier vrai tap (message rouge dans la
      console). Tester `navigator.userActivation.hasBeenActive` avant d'appeler, pour une console propre.
- [ ] Déployer sur GitHub Pages pour ouvrir l'app sur le téléphone (voir `.notes/mobile.md`).

## Prototype d'origine (référence)

- [ ] En revenant sur le menu, la barre des familles reste au début au lieu de montrer la famille active
      (corrigé dans mchou_app_mobile seulement).

## Réglé

- [x] 2026-10-26 — Tutoiement partout : « Pour que le livreur puisse te contacter » (écran Adresse).
- [x] 2026-10-26 — Feuille Google : l'avatar affiche « M » (Marouane), plus « H ».
