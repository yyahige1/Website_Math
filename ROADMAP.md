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

### Infrastructure Technique
- ✅ Module de graphiques Canvas réutilisable (`js/graphing.js`)
- ✅ Architecture responsive (mobile, tablette, desktop)
- ✅ Navigation cohérente sur tous les fichiers
- ✅ Système de wrapper container pour mise en page optimale

---

## 📁 Structure du Projet

### Fichiers HTML (14)
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

### 1. 📊 Dérivées (Priorité Haute)
**Niveau**: Terminale

**Modules à créer**:
- Calcul de dérivées (règles usuelles)
- Équation de tangente
- Étude de variations

**Fichiers à créer**:
- `derivees.html` + `js/derivees.js`

### 2. 🔢 Suites Numériques (Priorité Moyenne)
**Niveau**: Première / Terminale

- Suites arithmétiques
- Suites géométriques

### 3. 📈 Exponentielles et Logarithmes (Priorité Moyenne)
**Niveau**: Terminale

### 4. 🎲 Probabilités et Statistiques (Priorité Moyenne)
**Niveau**: Seconde / Première

### 5. 📐 Trigonométrie (Priorité Basse)
**Niveau**: Seconde / Première

---

## 🎯 Prochaine Étape Immédiate

**Recommandation**: Dérivées

Ce module est la suite logique car :
- ✅ Les fonctions du 2nd degré sont maintenant implémentées
- ✅ Niveau Terminale approprié
- ✅ Très utile et demandé
- ✅ Peut réutiliser GraphCanvas pour les tangentes
- ✅ Complète bien les modules sur les fonctions

---

## 🔧 Améliorations Récentes

### Janvier 2026
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

**Dernière mise à jour**: 31 Janvier 2026
**Modules d'exercices**: 14
**Fichiers HTML**: 14
**Fichiers JavaScript**: 16 (14 modules + utils.js + graphing.js)
**Fichiers CSS**: 7
**Lignes de code**: ~8000
**Dépendances externes**: 0 ✅

**Prochaine étape prioritaire**: Dérivées 📊
