# Écran Cadeaux (`js/screens/gifts.js`) et flamme

## Miams (2026-10-15)

- 1 DH payé = 1 Miam (hors livraison, après promo). Les Miams forment un **solde** : plus de
  palier unique « crêpe offerte à 150 ».
- Le terme « Miams » est validé (préféré à « points »).

## Les 11 cadeaux (`GIFTS` dans la coquille)

| Miams | Cadeau | Contenu |
|---:|---|---|
| 40 | Le p'tit noir | Café expresso |
| 60 | Quatre choux Nutella | Choux Nutella, 4 pièces classiques |
| 90 | Mojito fraise | Mojito fraise |
| 100 | Crêpe Nutella | Crêpe Nutella |
| 120 | Crêpe Nutella banane | Crêpe Nutella banane |
| 130 | Milkshake Oreo | Milkshake Oreo |
| 140 | Brownie Lotus | Brownie Lotus, taille M |
| 160 | Six choux pistache | Choux pistache, 6 pièces farcis crème vanille |
| 190 | Le duo goûter | Crêpe Nutella + Mojito fraise |
| 250 | Brownie Extra pistachio | Brownie Extra pistachio, taille L |
| 400 | La fête des choux | Pack 24 choux mixtes |

- **Pas personnalisables** : options figées, jamais de builder ni de feuille d'options.
- Tap → feuille `sheets/gift` → « Je me l'offre ! » : les Miams sont débités et le cadeau
  arrive dans le panier à 0 DH (« Offert », ligne `gift: <k>`, pas de stepper).
- Retirer le cadeau du panier (ou vider le panier) rend les Miams.
- Un panier qui ne contient que des cadeaux paie quand même la livraison (15 DH).

## Flamme (série)

- Une flamme = au moins une commande dans la semaine concernée.
- **Pas de semaine de grâce** : une semaine sans commande, la série repart à zéro.
- Toutes les **5 flammes d'affilée : +200 Miams** (`FLAME`), crédités à la commande qui allume
  la 5e (puis 10e, 15e…). La confirmation affiche le bonus.
- La feuille de la flamme montre une timeline de 5 nœuds (plus de S37, S38… qui prêtaient à
  confusion) avec un texte d'en-tête qui dit combien il reste. Timeline partagée :
  `js/components/flame.js` (feuille + carte de l'écran Cadeaux).
