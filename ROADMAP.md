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

### Infrastructure Technique
- ✅ Module de graphiques Canvas réutilisable (`js/graphing.js`)
- ✅ Architecture responsive (mobile, tablette, desktop)
- ✅ Navigation cohérente sur tous les fichiers
- ✅ Système de wrapper container pour mise en page optimale

---

## 📁 Structure du Projet

### Fichiers HTML (12)
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

### 1. 📐 Fonctions (Priorité Haute)
**Niveau**: Première / Terminale

**Modules à créer**:
- **Fonctions affines**
  - Équation y = ax + b
  - Représentation graphique (réutiliser GraphCanvas)
  - Coefficient directeur et ordonnée à l'origine
  - Calcul de l'image, antécédent
  - Intersection de deux droites

- **Fonctions du 2nd degré (paraboles)**
  - Forme développée, canonique, factorisée
  - Sommet, axe de symétrie
  - Représentation graphique (réutiliser GraphCanvas)
  - Variations de la fonction
  - Maximum/minimum

**Fichiers à créer**:
- `fonctions-affines.html` + `js/fonctions-affines.js`
- `fonctions-second-degre.html` + `js/fonctions-second-degre.js`

**Avantages**: Module GraphCanvas déjà créé, peut être directement réutilisé ✅

### 2. 📊 Dérivées (Priorité Haute)
**Niveau**: Terminale

**Modules à créer**:
- Calcul de dérivées (règles usuelles)
- Équation de tangente
- Étude de variations

**Fichiers à créer**:
- `derivees.html` + `js/derivees.js`

### 3. 🔢 Suites Numériques (Priorité Moyenne)
**Niveau**: Première / Terminale

- Suites arithmétiques
- Suites géométriques

### 4. 📈 Exponentielles et Logarithmes (Priorité Moyenne)
**Niveau**: Terminale

### 5. 🎲 Probabilités et Statistiques (Priorité Moyenne)
**Niveau**: Seconde / Première

### 6. 📐 Trigonométrie (Priorité Basse)
**Niveau**: Seconde / Première

---

## 🎯 Prochaine Étape Immédiate

**Recommandation**: Fonctions affines et fonctions du 2nd degré

Ces modules sont la suite logique car :
- ✅ Utilisent les équations du 2nd degré déjà implémentées
- ✅ Niveau approprié après les systèmes
- ✅ Très utiles et demandés
- ✅ Base pour les dérivées

---

## 🔧 Améliorations Récentes

### Janvier 2026
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

**Dernière mise à jour**: 29 Janvier 2026
**Modules d'exercices**: 12
**Fichiers HTML**: 12
**Fichiers JavaScript**: 14 (12 modules + utils.js + graphing.js)
**Fichiers CSS**: 7
**Lignes de code**: ~6000
**Dépendances externes**: 0 ✅

**Prochaine étape prioritaire**: Fonctions affines 📐
