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
- ✅ Dérivées (polynomiale, produit, quotient, tangente, variations)

### Infrastructure Technique
- ✅ Module de graphiques Canvas réutilisable (`js/graphing.js`)
- ✅ Architecture responsive (mobile, tablette, desktop)
- ✅ Navigation cohérente sur tous les fichiers
- ✅ Système de wrapper container pour mise en page optimale

---

## 📁 Structure du Projet

### Fichiers HTML (15)
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

### Modules JavaScript
- `js/utils.js` - Fonctions utilitaires (PGCD, formatage, etc.)
- `js/graphing.js` - Module graphiques Canvas réutilisable
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

### 1. 🔢 Suites Numériques (Priorité Haute)
**Niveau**: Première / Terminale

- Suites arithmétiques
- Suites géométriques

### 2. 📈 Exponentielles et Logarithmes (Priorité Moyenne)
**Niveau**: Terminale

### 3. 🎲 Probabilités et Statistiques (Priorité Moyenne)
**Niveau**: Seconde / Première

### 4. 📐 Trigonométrie (Priorité Basse)
**Niveau**: Seconde / Première

---

## 🎯 Prochaine Étape Immédiate

**Recommandation**: Suites Numériques

Ce module est la suite logique car :
- ✅ Niveau Première/Terminale approprié
- ✅ Complète bien les modules existants
- ✅ Très utile et demandé au lycée
- ✅ Peut réutiliser les structures existantes
- ✅ Base pour d'autres concepts (limites, etc.)

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

### Bugs Corrigés
- ✅ Label coefficient dans équations particulières (b/c dynamique)
- ✅ Tableau de signes malformé (colspan corrigé)
- ✅ Zoom excessif sur GitHub Codespaces
- ✅ Canvas dépassant du conteneur

---

## 📊 Statistiques

**Dernière mise à jour**: 2 Février 2026
**Modules d'exercices**: 15
**Fichiers HTML**: 15
**Fichiers JavaScript**: 17 (15 modules + utils.js + graphing.js)
**Fichiers CSS**: 7
**Lignes de code**: ~9500
**Dépendances externes**: 0 ✅

**Prochaine étape prioritaire**: Suites Numériques 🔢
