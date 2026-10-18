# Écran Profil (`screens/profile.dc.html`)

## Décisions (2026-10-15)

- **En-tête** : initiale, nom, e-mail Google (lecture seule), solde de Miams et flamme ; un tap
  ouvre Cadeaux.
- **Mes infos** : prénom modifiable (repris dans « Salut Marouane », toasts, suivi), numéro de
  téléphone (même valeur que l'onboarding et l'adresse), date d'anniversaire facultative.
  - L'anniversaire ne se renseigne **qu'une seule fois** : après « Valider », il est verrouillé.
  - Pas de cadeau d'anniversaire décidé pour l'instant.
- **Mon adresse** : quartier + distance, « Modifier » ouvre l'écran Adresse.
- **Mes commandes** : petit tableau Date / Articles / Total (8 dernières), texte petit,
  **pas de bouton « Recommander »**. Chaque commande passée s'ajoute en haut.
- **Paiement** : seulement la carte enregistrée, avec « Supprimer ». Pas de mode de paiement
  préféré : on pousse toujours la carte (1re position et cochée au paiement).
- **Langue** : Français / العربية (l'arabe n'est pas encore fait, toast).
- **Aide et compte** : contacter M'Chou (WhatsApp), FAQ, conditions, se déconnecter, supprimer
  mon compte (exigé par Google Play).

## Écarté

- Favoris : retirés de tout le projet.
- Allergies : non, la note pour la cuisine dans le builder suffit (cas rare).
- Réglages de notifications : non, tout est activé si le client accepte les notifications.
