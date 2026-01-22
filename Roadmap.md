# 🎯 ROADMAP - Projet MathsFacile

## Vision du Projet

Créer une plateforme d'entraînement en mathématiques couvrant les programmes français du collège à la Terminale, avec des exercices générés automatiquement et des corrections détaillées.

**Philosophie :** Génération infinie d'exercices + feedback immédiat = apprentissage efficace.

---

## 📊 Statut Actuel

| Phase | Statut | Progression |
|-------|--------|-------------|
| Phase 1 - Algèbre de Base | ✅ Complète | 100% |
| Phase 2 - Calculs Numériques | 📋 Planifiée | 0% |
| Phase 3 - Second Degré | 📋 Planifiée | 0% |
| Phase 4 - Fonctions | 📋 Planifiée | 0% |

---

## ✅ PHASE 1 - ALGÈBRE DE BASE (Complète)

### 1.1 Équations du 1er degré ✅
- [x] Type `ax + b = c`
- [x] Type `ax + b = cx + d`
- [x] Choix manuel des coefficients
- [x] Génération aléatoire
- [x] Résolution détaillée étape par étape
- [x] Gestion cas particuliers (0 solution, ∞ solutions)
- [x] Vérification du résultat
- [x] Interface responsive

**Fichiers :** `index.html`, `js/equations.js`

### 1.2 Développement d'expressions ✅
- [x] Distributivité simple : `k(ax + b)`
- [x] Double distributivité : `(ax + b)(cx + d)`
- [x] Carré d'une somme : `(a + b)²`
- [x] Carré d'une différence : `(a - b)²`
- [x] Différence de carrés : `(a + b)(a - b)`
- [x] Flèches SVG dynamiques
- [x] Couleurs par terme (rouge/bleu/vert)
- [x] Identification visuelle de a et b

**Fichiers :** `developpement.html`, `js/developpement.js`

### 1.3 Réduction d'expressions ✅
- [x] Termes en x et constantes
- [x] Termes en x², x et constantes
- [x] Expressions avec parenthèses
- [x] Nombre de termes configurable (3-6)
- [x] Regroupement visuel par couleur
- [x] Légende des couleurs

**Fichiers :** `reduction.html`, `js/reduction.js`

### 1.4 Factorisation ✅
- [x] Facteur commun avec PGCD
- [x] Différence de carrés : `a² - b²`
- [x] Carré parfait : `a² ± 2ab + b²`
- [x] Identification visuelle de a et b
- [x] Inputs pour identités remarquables
- [x] Génération aléatoire pour facteur commun

**Fichiers :** `factorisation.html`, `js/factorisation.js`

### 1.5 Inéquations du 1er degré ✅
- [x] Type `ax + b > c` (et <, ≤, ≥)
- [x] Type `ax + b ≤ cx + d`
- [x] Gestion inversion du signe (÷ par négatif)
- [x] Avertissement visuel pour l'inversion
- [x] Représentation sur droite numérique
- [x] Point plein/vide selon inclusion
- [x] Notation en intervalle

**Fichiers :** `inequations.html`, `js/inequations.js`

---

## 🔄 PHASE 2 - CALCULS NUMÉRIQUES
**Durée estimée :** 1-2 mois | **Priorité :** HAUTE

### 2.1 Fractions
- [ ] Addition/soustraction (dénominateurs différents)
- [ ] Multiplication/division
- [ ] Simplification (PGCD)
- [ ] Conversion décimal ↔ fraction

**Automatisation :** ⭐⭐⭐⭐ FACILE

### 2.2 Pourcentages
- [ ] Calcul de pourcentage
- [ ] Augmentation/réduction
- [ ] Pourcentage d'un pourcentage
- [ ] Problèmes appliqués

**Automatisation :** ⭐⭐⭐⭐⭐ TRÈS FACILE

### 2.3 Puissances
- [ ] Propriétés des exposants
- [ ] Puissances de 10
- [ ] Notation scientifique
- [ ] Calculs combinés

**Automatisation :** ⭐⭐⭐⭐⭐ TRÈS FACILE

### 2.4 Racines carrées
- [ ] Simplification (√72 = 6√2)
- [ ] Opérations (+, -, ×)
- [ ] Rationalisation du dénominateur

**Automatisation :** ⭐⭐⭐⭐ FACILE

---

## 📐 PHASE 3 - SECOND DEGRÉ
**Durée estimée :** 2 mois | **Priorité :** HAUTE

### 3.1 Équations du 2nd degré
- [ ] Calcul du discriminant Δ
- [ ] Discussion selon signe de Δ
- [ ] Calcul des solutions
- [ ] Forme factorisée
- [ ] Vérification

**Automatisation :** ⭐⭐⭐⭐⭐ TRÈS FACILE

### 3.2 Forme canonique
- [ ] Transformation `ax² + bx + c → a(x - α)² + β`
- [ ] Identification du sommet
- [ ] Axe de symétrie

**Automatisation :** ⭐⭐⭐⭐ FACILE

### 3.3 Systèmes d'équations 2×2
- [ ] Méthode par substitution
- [ ] Méthode par combinaison
- [ ] Cas particuliers (parallèles, confondues)
- [ ] Interprétation graphique

**Automatisation :** ⭐⭐⭐⭐⭐ TRÈS FACILE

---

## 📈 PHASE 4 - FONCTIONS
**Durée estimée :** 2-3 mois | **Priorité :** MOYENNE

### 4.1 Fonctions affines
- [ ] Équation de droite y = mx + p
- [ ] Calcul de pente
- [ ] Ordonnée à l'origine
- [ ] Droite passant par 2 points
- [ ] Intersection de droites
- [ ] **Graphique interactif (Canvas/SVG)**

### 4.2 Fonctions du 2nd degré
- [ ] Tableau de variations
- [ ] Extremum (min/max)
- [ ] Intersection avec les axes
- [ ] **Tracé de parabole**

### 4.3 Tableaux de signes
- [ ] Polynôme du 1er degré
- [ ] Polynôme du 2nd degré
- [ ] Produit/quotient de fonctions
- [ ] **Tableau généré visuellement**

---

## 🎲 PHASE 5 - GÉOMÉTRIE ANALYTIQUE
**Durée estimée :** 1-2 mois | **Priorité :** MOYENNE

### 5.1 Vecteurs (Plan)
- [ ] Coordonnées d'un vecteur
- [ ] Addition, soustraction
- [ ] Multiplication par scalaire
- [ ] Norme
- [ ] Colinéarité

### 5.2 Repérage
- [ ] Distance entre 2 points
- [ ] Coordonnées du milieu
- [ ] Équation de cercle
- [ ] Appartenance d'un point

### 5.3 Produit scalaire (1ère)
- [ ] Calcul avec coordonnées
- [ ] Calcul avec norme et angle
- [ ] Orthogonalité

---

## 🔢 PHASE 6 - SUITES & ANALYSE
**Durée estimée :** 2-3 mois | **Priorité :** MOYENNE-BASSE

### 6.1 Suites arithmétiques
- [ ] Terme général
- [ ] Raison
- [ ] Somme des n premiers termes

### 6.2 Suites géométriques
- [ ] Terme général
- [ ] Raison
- [ ] Somme des n premiers termes
- [ ] Limite

### 6.3 Dérivation (1ère/Term)
- [ ] Dérivées de fonctions usuelles
- [ ] Règles de dérivation
- [ ] Équation de tangente
- [ ] Application aux variations

### 6.4 Primitives & Intégrales (Term)
- [ ] Primitives usuelles
- [ ] Calcul d'intégrales
- [ ] Aire sous une courbe

---

## 📊 PHASE 7 - PROBABILITÉS & STATISTIQUES
**Durée estimée :** 2 mois | **Priorité :** BASSE

### 7.1 Probabilités
- [ ] Calculs de base (dés, cartes, tirages)
- [ ] Arbres de probabilités
- [ ] Probabilités conditionnelles
- [ ] Loi binomiale

### 7.2 Statistiques
- [ ] Moyenne, médiane, quartiles
- [ ] Écart-type
- [ ] Diagrammes (histogramme, box-plot)

---

## 🎨 PHASE 8 - TRIGONOMÉTRIE
**Durée estimée :** 1-2 mois | **Priorité :** BASSE

- [ ] Valeurs remarquables (sin, cos, tan)
- [ ] Cercle trigonométrique interactif
- [ ] Équations trigonométriques simples
- [ ] Formules d'addition

---

## 🛠️ FONCTIONNALITÉS TRANSVERSALES

### V1 - MVP ✅
- [x] Génération infinie d'exercices
- [x] Correction détaillée
- [x] Interface responsive
- [x] Architecture modulaire (HTML/CSS/JS séparés)

### V2 - Engagement (Après Phase 2)
- [ ] Mode clair/sombre
- [ ] Historique local (localStorage)
- [ ] Filtre par difficulté
- [ ] Export PDF des corrections
- [ ] Partage d'exercice (URL)

### V3 - Gamification (Phase 4+)
- [ ] Système de points/XP
- [ ] Badges de progression
- [ ] Streaks quotidiens
- [ ] Statistiques personnelles

### V4 - Personnalisation (Phase 6+)
- [ ] Compte utilisateur (optionnel)
- [ ] Sauvegarde cloud
- [ ] Recommandations d'exercices
- [ ] Parcours personnalisés

---

## 📅 Planning Prévisionnel

| Période | Phase | Livrables |
|---------|-------|-----------|
| M1-M2 | Phase 1 | ✅ Algèbre de base (5 modules) |
| M3 | Phase 2 | Calculs numériques |
| M4-M5 | Phase 3 | Second degré |
| M6-M7 | Phase 4 | Fonctions + graphiques |
| M8 | Phase 5 | Géométrie analytique |
| M9-M10 | Phase 6 | Suites & dérivées |
| M11 | Phase 7 | Probabilités |
| M12 | Phase 8 | Trigonométrie |

**Total : 1 an pour couverture complète lycée**

---

## 🎯 Métriques de Succès

| Jalon | Objectif |
|-------|----------|
| Phase 1 (3 mois) | 1 000 exercices/mois, 10 min/session |
| Phase 3 (6 mois) | 10 000 exercices/mois, 1 000 utilisateurs actifs |
| Phase 6 (12 mois) | 100 000 exercices/mois, RPM > 3€ |

---

## 🚨 Limitations Connues

### Exercices NON automatisables :
- ❌ Démonstrations (raisonnement libre)
- ❌ Géométrie de construction (compas, règle)
- ❌ Problèmes ouverts (modélisation)
- ❌ Rédaction de preuves

→ **Focus sur les exercices algorithmiques et calculatoires**

---

## 💡 Prochaines Étapes Immédiates

1. ✅ ~~Finaliser Phase 1~~
2. [ ] Tests unitaires pour tous les modules
3. [ ] SEO de base (meta, titres, descriptions)
4. [ ] Feedback utilisateurs réels
5. [ ] Démarrer Phase 2 (Fractions)

---

## 🔄 Historique des Mises à Jour

| Date | Modification |
|------|--------------|
| Janvier 2025 | Phase 1 complète, architecture refactorisée |
| Janvier 2025 | Création CONTEXT.md, mise à jour README/ROADMAP |

---

**Dernière mise à jour :** Janvier 2025
**Prochaine révision :** Après Phase 2
