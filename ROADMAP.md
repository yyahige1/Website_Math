# 🗺️ Roadmap - Prochaines Étapes

## ✅ Modules Complétés

### Niveau Collège / Seconde
- ✅ Équations du 1er degré
- ✅ Développement (identités remarquables)
- ✅ Réduction d'expressions
- ✅ Factorisation
- ✅ Inéquations du 1er degré
- ✅ Fractions (opérations)
- ✅ Pourcentages
- ✅ Puissances
- ✅ Racines carrées

### Niveau Première
- ✅ Équations du 2nd degré (discriminant, forme canonique, cas particuliers, somme-produit)
- ✅ Inéquations du 2nd degré (tableau de signes, graphiques Canvas)
- ✅ Systèmes d'équations linéaires 2×2 (substitution, combinaison)
- ✅ Fonctions affines (représentation graphique, image, antécédent, équation, intersection)
- ✅ Fonctions du 2nd degré (représentation graphique, forme canonique, sommet, variations, extremum)

### Niveau Terminale
- ✅ Dérivées (polynomiale, produit, quotient, composition, tangente, variations)
- ✅ Suites Numériques (arithmétique, géométrique, sommes, variation)

### Infrastructure Technique
- ✅ Module de graphiques Canvas réutilisable (`js/graphing.js`)
- ✅ Architecture responsive (mobile, tablette, desktop)
- ✅ Navigation cohérente sur tous les fichiers
- ✅ Système de wrapper container pour mise en page optimale

---

## 📁 Structure du Projet

### Fichiers HTML (16)
1. `index.html` - Équations 1er degré
2. `developpement.html` - Développement d'expressions
3. `reduction.html` - Réduction d'expressions
4. `factorisation.html` - Factorisation
5. `inequations.html` - Inéquations 1er degré
6. `equations2.html` - Équations 2nd degré
7. `inequations2.html` - Inéquations 2nd degré
8. `systemes.html` - Systèmes d'équations 2×2
9. `fractions.html` - Opérations sur fractions
10. `pourcentages.html` - Calculs de pourcentages
11. `puissances.html` - Calculs avec puissances
12. `racines.html` - Racines carrées
13. `fonctions-affines.html` - Fonctions affines
14. `fonctions-second-degre.html` - Fonctions du 2nd degré
15. `derivees.html` - Dérivées
16. `suites.html` - Suites Numériques

### Modules JavaScript (22 fichiers)
- `js/utils.js` - Fonctions utilitaires (PGCD, formatage, etc.)
- `js/ui.js` - Manipulation DOM (show, hide, $)
- `js/main.js` - Initialisation globale
- `js/navigation.js` - Génération navigation responsive
- `js/graphing.js` - Module graphiques Canvas réutilisable (GraphCanvas)
- `js/tableau-variations.js` - Tableaux de variations dynamiques
- `js/equations.js` - Logique équations 1er degré
- `js/developpement.js` - Logique développement
- `js/reduction.js` - Logique réduction
- `js/factorisation.js` - Logique factorisation
- `js/inequations.js` - Logique inéquations 1er degré
- `js/equations2.js` - Logique équations 2nd degré
- `js/inequations2.js` - Logique inéquations 2nd degré
- `js/systemes.js` - Logique systèmes d'équations
- `js/fractions.js` - Logique fractions
- `js/pourcentages.js` - Logique pourcentages
- `js/puissances.js` - Logique puissances
- `js/racines.js` - Logique racines carrées
- `js/fonctions-affines.js` - Logique fonctions affines
- `js/fonctions-second-degre.js` - Logique fonctions du 2nd degré
- `js/derivees.js` - Logique dérivées
- `js/suites.js` - Logique suites numériques

### Feuilles de Style CSS
- `css/theme.css` - Variables CSS (couleurs, espacements)
- `css/base.css` - Reset et styles de base
- `css/layout.css` - Structure générale, navigation
- `css/exercices.css` - Styles communs aux exercices
- `css/navigation.css` - Navigation responsive
- `css/equations2.css` - Styles spécifiques 2nd degré (tableaux, graphiques)
- `css/puissances.css`, `css/racines.css` - Styles spécifiques modules

---

## 🚀 Prochaines Étapes Recommandées

### 1. 📉 Limites (Priorité Haute)
**Niveau**: Terminale

**Types d'exercices suggérés**:
- Limites en l'infini (polynômes, rationnelles)
- Limites en un point (continuité, levée indétermination)
- Formes indéterminées (∞-∞, 0/0, ∞/∞)
- Limites avec exponentielles/logarithmes
- Asymptotes (verticales, horizontales, obliques)

**Justification**: Suite logique après Dérivées et Suites. Fondamental pour Terminale.

### 2. 🧮 Primitives & Intégrales (Priorité Haute)
**Niveau**: Terminale

**Types d'exercices suggérés**:
- Primitives usuelles (polynômes, exp, ln, 1/x)
- Primitives avec changement de variable
- Intégrales définies (calcul d'aires)
- Intégration par parties
- Valeur moyenne d'une fonction

**Justification**: Complète le triptyque Dérivées-Limites-Intégrales.

### 3. 📈 Exponentielles et Logarithmes (Priorité Moyenne)
**Niveau**: Terminale

**Types d'exercices suggérés**:
- Équations exponentielles (e^x = k, e^ax = e^bx)
- Équations logarithmiques (ln(x) = k, ln(ax) = ln(bx))
- Dérivées avec exp/ln
- Étude de fonctions exp/ln
- Croissance exponentielle (applications)
- Logarithme décimal (pH, décibels)

### 4. 🎲 Probabilités (Priorité Moyenne)
**Niveau**: Seconde / Première / Terminale

**Types d'exercices suggérés**:
- Probabilités simples (lancer dé, pièce)
- Probabilités conditionnelles (P(A|B))
- Arbres de probabilités
- Loi binomiale
- Variables aléatoires
- Espérance, variance, écart-type

### 5. 📊 Statistiques (Priorité Moyenne)
**Niveau**: Seconde / Première

**Types d'exercices suggérés**:
- Moyenne, médiane, quartiles
- Variance, écart-type
- Diagrammes (boîtes, histogrammes)
- Régression linéaire
- Coefficient de corrélation

### 6. 📐 Trigonométrie (Priorité Basse)
**Niveau**: Seconde / Première

**Types d'exercices suggérés**:
- Cercle trigonométrique
- Valeurs remarquables (sin, cos, tan)
- Équations trigonométriques
- Formules d'addition
- Résolution triangles

### 7. ➡️ Vecteurs (Priorité Basse)
**Niveau**: Seconde / Première

**Types d'exercices suggérés**:
- Opérations sur vecteurs
- Coordonnées dans le plan
- Colinéarité
- Produit scalaire
- Équations de droites

---

## 🎯 Prochaine Étape Immédiate

**Recommandation forte**: **Limites** 📉

**Pourquoi Limites en priorité ?**
- ✅ Complète naturellement Dérivées et Suites
- ✅ Essentiel pour le programme Terminale
- ✅ Permet d'introduire les asymptotes
- ✅ Base pour Intégrales ensuite
- ✅ Peut réutiliser GraphCanvas pour visualisation
- ✅ Niveau Terminale cohérent avec modules récents

**Plan d'implémentation Limites**:
1. 5-6 types d'exercices (voir liste ci-dessus)
2. Utilisation GraphCanvas pour représentation graphique
3. Explications pédagogiques des formes indéterminées
4. Tableau récapitulatif des opérations sur limites
5. Visualisation asymptotes sur graphiques

---

## 🔧 Améliorations Récentes

### Janvier 2026
- ✅ **Module Dérivées** (`derivees.html` + `derivees.js`)
  - 5 types d'exercices : polynomiale, produit, quotient, tangente, variations
  - Représentation graphique de la tangente et de la fonction
  - Règles de dérivation détaillées
  - Tableau de variations avec signe de f'

- ✅ **Module Fonctions Affines** (`fonctions-affines.html` + `fonctions-affines.js`)
  - 5 types d'exercices : graphique, image, antécédent, équation, intersection
  - Représentation graphique avec GraphCanvas
  - Explications pédagogiques détaillées

- ✅ **Module Fonctions du 2nd Degré** (`fonctions-second-degre.html` + `fonctions-second-degre.js`)
  - 5 types d'exercices : graphique, forme canonique, sommet, variations, extremum
  - Représentation graphique des paraboles avec sommet et racines
  - Tableau de variations complet

- ✅ **Module Graphiques Canvas** (`graphing.js`)
  - Classe GraphCanvas réutilisable
  - Tracé de paraboles avec racines et zones de solutions
  - Zéro dépendance (Canvas natif)
  - Responsive et adaptatif

- ✅ **Corrections Responsive**
  - Ajout wrapper `<div class="container">` sur tous les fichiers HTML
  - Fix débordement graphiques (max-width: 100%, height: auto)
  - Tableaux de signes avec scroll horizontal
  - Media queries pour petits écrans (<480px)

- ✅ **Corrections Formatage**
  - Fonction `formatQuadraticEquation()` pour affichage propre
  - Fix NaN dans generateFraction()
  - Affichage équations : "x² - 5x + 6" au lieu de "1x² + -5x + 6"

### Février 2026
- ✅ **Module Suites Numériques** (`suites.html` + `suites.js`)
  - 5 types d'exercices : arithmétique, géométrique, somme arithmétique, somme géométrique, variation
  - Affichage formules avec indices/exposants HTML
  - Calculs détaillés étape par étape (termes, différences, sommes)
  - Preuve géométrique u_{n+1}/u_n = q
  - Détermination sens de variation (arithmétique et géométrique)

- ✅ **Intégration KaTeX** (module Dérivées)
  - Rendu mathématique professionnel (fractions, racines)
  - CDN avec SRI (Subresource Integrity) pour sécurité
  - Helpers `formatFraction()` et `formatSqrt()`
  - Désactivation CSS .sqrt pour éviter doubles affichages

- ✅ **Dérivée par Composition** (module Dérivées)
  - 6ème type d'exercice : chain rule
  - Types : linear_power, linear_sqrt, quadratic_power
  - Développement algébrique complet (multiplication polynômes)
  - Utilitaires : multiplyPolynomials(), addPolynomials(), subtractPolynomials()

- ✅ **Corrections Navigation**
  - Fix injection navigation (AVANT .container, pas dedans)
  - Ajout catégories Fonctions et Suites dans navigation.js
  - Dropdown width: max-content (adaptatif au texte)
  - Résout troncature "Suites Numériques"

- ✅ **Corrections Tableaux Variations**
  - Alignement vertical basé sur direction flèche (pas nature point)
  - Fix affichage valeurs gauche/droite

- ✅ **CSS Layout**
  - Ajout classe .param-row pour alignement inputs
  - Synchronisation .type-selector dans tous modules

### Bugs Corrigés
- ✅ Navigation "Suites Numériques" tronquée (width: max-content)
- ✅ Boutons exercices Suites mal affichés (class type-selector)
- ✅ Affichage "5 + -3n" → "5 - 3n" (gestion signes)
- ✅ Manque u_{n+1}/u_n = q pour suites géométriques
- ✅ KaTeX double affichage racines (CSS .sqrt désactivé)
- ✅ Quotient dérivées : v² pas développé
- ✅ Label coefficient dans équations particulières (b/c dynamique)
- ✅ Tableau de signes malformé (colspan corrigé)
- ✅ Zoom excessif sur GitHub Codespaces
- ✅ Canvas dépassant du conteneur

---

## 📊 Statistiques

**Dernière mise à jour**: 5 Février 2026
**Modules d'exercices**: 16 ✅
**Fichiers HTML**: 16
**Fichiers JavaScript**: 22
  - 16 modules d'exercices
  - 6 utilitaires (utils, ui, main, navigation, graphing, tableau-variations)
**Fichiers CSS**: 9
**Lignes de code**: ~11 000
**Dépendances externes**: 1 (KaTeX CDN)

**Prochaine étape prioritaire**: Limites 📉
