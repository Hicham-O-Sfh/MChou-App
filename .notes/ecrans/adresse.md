# Écran Adresse (`js/screens/address.js`)

## Décisions (2026-10-15)

- Plus de champ rue / repère ni de choix Maison / Travail / Autre : la carte avec le pin
  qu'on déplace suffit à situer la porte.
- Champ **numéro de téléphone** à la place : facultatif mais conseillé (le livreur appelle s'il
  ne trouve pas). Même état `phone` que l'écran 03, donc pré-rempli s'il a déjà été saisi.
  Un numéro mal tapé bloque le CTA (« Vérifie ton numéro ») ; vide, il ne bloque pas.
- Paiement : la ligne adresse affiche le quartier + la distance ; sans numéro, la ligne
  téléphone affiche « Pas de numéro ».
- Estimation de livraison : **10–15 min par tranche de 5 km** (`etaRange`, `etaSteps`).
  L'heure d'arrivée de la commande et le suivi utilisent la même base (15 min par tranche).
