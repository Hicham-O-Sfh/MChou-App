# Méthodologie de travail

Proposition de départ, à ajuster au fil de l'eau.

## Objectif

Finaliser un prototype interactif fidèle au design system (thème « Fidèle »), qui servira de
spécification visuelle et comportementale pour le développement Flutter.

## Types de demandes

| Demande | Déroulé |
|---|---|
| **Retouche** (texte, couleur, espacement) | Modif directe → vérif navigateur → validation |
| **Nouvel écran / parcours** | Spec courte dans `.notes/ecrans/<id>.md` → validation de la spec → réalisation → vérif → validation |
| **Évolution du design system** (nouvelle couleur, nouveau composant) | Décision notée dans `decisions.md` → mise à jour `css/tokens.css` + composants + `design-system.html` → application aux écrans |

## Cycle d'une modification

1. **Cadrer** : ce qui change, sur quels écrans, quels éléments du design system sont touchés.
2. **Réaliser** en réutilisant les fragments existants (boutons, cartes, chips, sheets). Pas de
   nouvelle couleur, taille ou rayon hors design system sans décision explicite.
3. **Vérifier** dans le navigateur : rendu, interactions, console sans erreur, et la checklist
   ci-dessous.
4. **Valider** : tu regardes le résultat dans l'aperçu et tu valides ou tu demandes des retouches.
5. **Commiter** une fois validé : un commit par changement cohérent, message en français qui
   explique le pourquoi.

## Checklist design avant validation

- Un seul CTA doré par écran ; framboise réservée à la flamme, aux badges et promos flash.
- Cibles tactiles ≥ 48 px ; boutons pill ; rayons 12 / 20 / 28.
- Espacements sur la grille de 4 pt, gouttière 20 px.
- Typo : Pacifico seulement en accent ; Fredoka titres/boutons/prix ; Nunito texte.
- Contrastes AA respectés (couleurs du design system uniquement).
- start/end plutôt que left/right (RTL plus tard).
- Textes en français, tutoiement, ton gourmand, sans fausse urgence.
- Chaque tap a un retour (press, son, toast…) et Reduce motion reste respecté.

## Organisation des notes

- `methodologie.md` : ce fichier.
- `decisions.md` : journal des décisions (date, décision, raison). À créer à la première décision.
- `ecrans/<id>.md` : spec d'un écran (but, contenu, états, interactions, navigation entrante et
  sortante, cas limites). Sert aussi de base pour le dev Flutter.
- `flutter.md` : notes de passage à Flutter (correspondance composants ↔ widgets, tokens ↔
  `ThemeData`). Plus tard.

## Préparer le passage à Flutter

- Penser en composants réutilisables : un même bouton, une même carte produit → un widget.
- Toute valeur visuelle doit exister dans `css/tokens.css` (source pour le `ThemeData`).
- Les données (`js/data/`) et l'état initial (`js/state.js`) donnent une première idée des
  modèles de données.
- Les animations sont décrites dans `design-system.html` (durées et courbes) : les reprendre telles
  quelles côté Flutter.
