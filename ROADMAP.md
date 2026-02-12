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
- ✅ Limites (polynôme, rationnelle, point, formes indéterminées, racines, asymptotes)
- ✅ Primitives & Intégrales (polynomiale, usuelles, condition initiale, intégrale définie, aire, valeur moyenne)
- ✅ Exponentielles & Logarithmes (équations exp/ln, dérivées, études de fonctions, croissance, log décimal)

### Probabilités & Statistiques
- ✅ Probabilités (simples, conditionnelles, arbres, loi binomiale, variables aléatoires, fluctuation)
- ✅ Statistiques (moyenne, médiane & quartiles, variance & écart-type, diagramme en boîte, régression linéaire)

### Géométrie & Trigonométrie
- ✅ Trigonométrie (valeurs remarquables, conversion degrés/radians, équations trigo, formules d'addition, identités, triangles)
- ✅ Vecteurs (coordonnées, norme & distance, colinéarité, produit scalaire, opérations)

### Infrastructure Technique
- ✅ Module de graphiques Canvas réutilisable (`js/graphing.js`)
- ✅ Architecture responsive (mobile, tablette, desktop)
- ✅ Navigation cohérente sur tous les fichiers
- ✅ Système de wrapper container pour mise en page optimale

---

## 📁 Structure du Projet

### Fichiers HTML (23)
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
17. `limites.html` - Limites de fonctions
18. `primitives.html` - Primitives & Intégrales
19. `exponentielles.html` - Exponentielles & Logarithmes
20. `probabilites.html` - Probabilités
21. `statistiques.html` - Statistiques
22. `trigonometrie.html` - Trigonométrie
23. `vecteurs.html` - Vecteurs

### Modules JavaScript (29 fichiers)
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
- `js/limites.js` - Logique limites de fonctions
- `js/primitives.js` - Logique primitives et intégrales
- `js/exponentielles.js` - Logique exponentielles et logarithmes
- `js/probabilites.js` - Logique probabilités
- `js/statistiques.js` - Logique statistiques
- `js/trigonometrie.js` - Logique trigonométrie (cercle trigo SVG, triangles SVG)
- `js/vecteurs.js` - Logique vecteurs (graphiques Canvas avec flèches)

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

### ~~1. 📉 Limites~~ ✅ Complété
> Module implémenté avec 6 types d'exercices : polynôme en ±∞, rationnelle en ±∞, limite en un point, formes indéterminées (0/0, ∞-∞), racines carrées, asymptotes. Corrections avec couleurs KaTeX (bleu/rouge/vert).

### ~~2. 🧮 Primitives & Intégrales~~ ✅ Complété
> Module implémenté avec 6 types d'exercices : primitive polynomiale, primitives usuelles (exp, inverse, puissance, racine), condition initiale, intégrale définie, aire sous courbe (avec graphique Canvas), valeur moyenne. Corrections colorées KaTeX, visualisation graphique des aires.

### ~~3. 📈 Exponentielles & Logarithmes~~ ✅ Complété
> Module implémenté avec 6 types d'exercices : équations exponentielles (3 sous-types), équations logarithmiques (3 sous-types), dérivées exp/ln (6 sous-types), étude de fonctions, croissance exponentielle (population, décroissance radioactive, temps de doublement), logarithme décimal (pH, décibels, magnitude). Corrections détaillées avec KaTeX.

### ~~1. 🎲 Probabilités~~ ✅ Complété
> Module implémenté avec 6 types d'exercices : probabilités simples (dé, cartes, urne), probabilités conditionnelles (tableau croisé, formule, Bayes), arbres de probabilités (deux épreuves, probabilités totales), loi binomiale (P(X=k), espérance/écart-type, probabilités cumulées), variables aléatoires (loi de probabilité, espérance/variance), intervalle de fluctuation (calcul, prise de décision). Corrections détaillées avec KaTeX.

### ~~1. 📊 Statistiques~~ ✅ Complété
> Module implémenté avec 5 types d'exercices : moyenne (simple, pondérée, classes), médiane & quartiles, variance & écart-type, diagramme en boîte (construire, lire), régression linéaire (équation droite, coefficient de corrélation). Visualisations SVG (box plot, nuage de points). Corrections détaillées avec KaTeX.

### ~~1. 📐 Trigonométrie~~ ✅ Complété
> Module implémenté avec 6 types d'exercices : valeurs remarquables (sin/cos/tan), conversion degrés/radians, équations trigonométriques (cos x=a, sin x=a, tan x=a dans [0,2π[), formules d'addition et duplication, identités trigonométriques (simplification, trouver cos/sin), triangles (rectangle SOH-CAH-TOA, quelconque loi des cosinus). Graphiques SVG : cercle trigonométrique avec projections cos/sin, triangles avec angles et côtés étiquetés.

### ~~2. ➡️ Vecteurs~~ ✅ Complété
> Module implémenté avec 5 types d'exercices : coordonnées (vecteur AB, milieu, trouver un point), norme & distance (norme, distance, vecteur unitaire), colinéarité (tester, trouver k), produit scalaire (coordonnées, angle, orthogonalité), opérations (somme, combinaison linéaire). Graphiques Canvas avec flèches vectorielles colorées, projections, parallélogramme, arc d'angle.

### 3. 🔢 Arithmétique (Priorité Moyenne)
**Niveau**: Terminale Spécialité Maths

**Types d'exercices suggérés**:
- Divisibilité (critères, preuves)
- PGCD et algorithme d'Euclide
- Nombres premiers (crible, décomposition)
- Congruences (calculs modulo n)
- Théorème de Bézout et applications

### 4. 🔮 Nombres Complexes (Priorité Moyenne)
**Niveau**: Terminale Spécialité Maths

**Types d'exercices suggérés**:
- Forme algébrique (opérations, conjugué, module)
- Forme trigonométrique (module, argument)
- Forme exponentielle (notation e^{i*theta})
- Équations dans C (second degré, racines n-ièmes)
- Interprétation géométrique (transformations du plan)

### 5. 📦 Géométrie dans l'espace (Priorité Moyenne)
**Niveau**: Terminale

**Types d'exercices suggérés**:
- Coordonnées dans l'espace (points, vecteurs, distances)
- Droites et plans (équations paramétriques, cartésiennes)
- Positions relatives (intersection, parallélisme, orthogonalité)
- Produit scalaire dans l'espace
- Sections de solides (plans coupant cubes, tétraèdres)

### 6. 📏 Géométrie analytique plane (Priorité Basse)
**Niveau**: Seconde / Première

**Types d'exercices suggérés**:
- Équations de cercles (centre, rayon, position relative)
- Distance point-droite
- Milieu, barycentre
- Transformations du plan (symétries, rotations, homothéties)

### 7. 🧩 Logique et Dénombrement (Priorité Basse)
**Niveau**: Terminale

**Types d'exercices suggérés**:
- Dénombrement (arrangements, combinaisons, permutations)
- Raisonnement par récurrence
- Formule du binôme de Newton

---

## 🎯 Phases de Développement Futures

### Phase 5 : Géométrie & Trigonométrie ✅ (partiellement)
| # | Module | Types | Statut |
|---|--------|-------|--------|
| 22 | **Trigonométrie** | 6 types | ✅ Complété |
| 23 | **Vecteurs** | 5 types | ✅ Complété |
| 24 | **Géométrie analytique plane** | 4 types | En attente |

### Phase 6 : Terminale Spécialité
| # | Module | Types | Priorité |
|---|--------|-------|----------|
| 25 | **Arithmétique** | 5 types | Moyenne |
| 26 | **Nombres Complexes** | 5 types | Moyenne |
| 27 | **Géométrie dans l'espace** | 5 types | Moyenne |

### Phase 7 : Compléments
| # | Module | Types | Priorité |
|---|--------|-------|----------|
| 28 | **Logique et Dénombrement** | 3 types | Basse |

**Objectif**: ~28 modules couvrant l'intégralité du programme Seconde → Terminale Spé Maths

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

- ✅ **Module Limites** (`limites.html` + `limites.js`)
  - 6 types d'exercices : polynôme en ±∞, rationnelle en ±∞, limite en un point, formes indéterminées (0/0, ∞-∞), racines carrées (3 sous-types), asymptotes
  - Corrections colorées avec KaTeX : bleu (termes dominants), rouge (termes → 0), vert (résultats)
  - Résultats encadrés avec \boxed{}
  - Rappels de cours pédagogiques pour chaque type

- ✅ **Module Primitives & Intégrales** (`primitives.html` + `primitives.js`)
  - 6 types d'exercices : primitive polynomiale, primitives usuelles (exp, inverse, puissance, racine), condition initiale (F(x₀)=y₀), intégrale définie, aire sous courbe, valeur moyenne
  - Visualisation graphique des aires avec Canvas (aire positive en bleu, aire négative en rouge)
  - Gestion du changement de signe (découpage automatique des intégrales)
  - Corrections colorées KaTeX et résultats encadrés
  - Vérification par dérivation pour les primitives

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

**Dernière mise à jour**: 12 Février 2026
**Modules d'exercices**: 23 ✅
**Fichiers HTML**: 23
**Fichiers JavaScript**: 29
  - 23 modules d'exercices
  - 6 utilitaires (utils, ui, main, navigation, graphing, tableau-variations)
**Fichiers CSS**: 9
**Lignes de code**: ~18 500
**Dépendances externes**: 1 (KaTeX CDN)

**Prochaine étape prioritaire**: Phase 6 - Arithmétique 🔢 puis Nombres Complexes 🔮
**Objectif final**: ~28 modules (programme complet Seconde → Terminale Spé Maths)
