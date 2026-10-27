# À faire, à peaufiner, idées

Remarques et suggestions au fil de l'eau. Cocher quand c'est réglé, avec la date.

## Portage mchou_app_mobile

- [x] 2026-10-26 — Étapes 5 à 7 du portage (panier → suivi, cadeaux et profil, PWA) — voir `.notes/mchou_app_mobile.md`.
- [ ] Ajouter de vraies photos : les emplacements `photo()` attendent des fichiers dans
      `assets/photos/` ; prévoir une table produit → photo quand les photos arrivent.
- [x] 2026-10-26 — Après un rechargement, la barre des familles du menu peut se caler trop loin si les polices ne sont pas
      encore chargées (largeurs calculées avec la police de secours). Recaler après `document.fonts.ready`.
      Même défaut dans l'original.
- [x] 2026-10-26 — Vibration : les navigateurs bloquent `navigator.vibrate` avant le premier vrai tap (message rouge dans la
      console). Tester `navigator.userActivation.hasBeenActive` avant d'appeler, pour une console propre.
- [x] 2026-10-26 — L'heure courante (`now`) n'avance que sur l'accueil : ailleurs, les créneaux du paiement et
      l'« arrivée prévue vers » du suivi se basent sur une heure figée (même comportement que l'original).
      Faire avancer `now` sur le paiement et le suivi aussi.
- [ ] Le badge « Livreur » du suivi et les photos de produits restent des emplacements vides.
- [ ] Profil : dans l'en-tête, « 112 Miams » et « Mes cadeaux » passent sur deux lignes (aussi dans l'original).
      Raccourcir ou réduire la police pour tenir sur une ligne.
- [ ] Déployer sur GitHub Pages pour ouvrir l'app sur le téléphone (voir `.notes/mobile.md`).
- [x] 2026-10-26 — Zones sûres du téléphone : en mode `?mobile`, l'app se loge entre l'encoche et la barre de
      gestes (`env(safe-area-inset-*)` sur `.stage--mob`, hauteur recalculée dans `fit()`).
- [ ] Profil : la police arabe « Baloo Bhaijaan 2 » n'est chargée nulle part ; le bouton العربية retombe sur
      une police système.

## Écarté (2026-10-26)

- Retour Android via l'historique, sauvegarde de l'état entre deux lancements, fonctionnement hors ligne,
  focus des champs, écrans « prochain lot », version arabe : pas nécessaires pour le prototype.

## Réglé

- [x] 2026-10-26 — Tutoiement partout : « Pour que le livreur puisse te contacter » (écran Adresse).
- [x] 2026-10-26 — Feuille Google : l'avatar affiche « M » (Marouane), plus « H ».
