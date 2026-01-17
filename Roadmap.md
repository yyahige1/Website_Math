# 🎯 ROADMAP - Projet MathsFacile

## Vision du Projet
Créer une plateforme d'entraînement en mathématiques couvrant les programmes de collège, lycée (2nde, 1ère, Terminale) avec des exercices auto-corrigés et des explications détaillées.

**Objectif principal :** Générer du contenu infini et automatisé pour maximiser l'engagement (click rate) et le RPM.

---

## 📊 Stratégie Monétisation & Engagement

### Facteurs d'engagement identifiés :
- ✅ Génération infinie d'exercices (pas de limite)
- ✅ Feedback immédiat avec correction détaillée
- ✅ Pas de système de score (pour l'instant) → moins de pression, plus de pratique libre
- 🔄 À tester : Mode "entraînement chronométré" vs "pratique libre"
- 🔄 À tester : Gamification (badges, streaks) vs minimalisme

### Optimisations RPM futures :
- Publicités entre séries d'exercices (après X résolutions)
- Page de résultats détaillés (temps de lecture élevé)
- Historique des exercices résolus (pages multiples)
- Mode "révision" des exercices précédents

---

## 🚀 PHASE 1 - ALGÈBRE DE BASE (MVP)
**Durée estimée :** 2-3 mois | **Priorité :** CRITIQUE

### 1.1 Équations du 1er degré ✅ EN COURS
- [x] Type `ax + b = c`
- [x] Type `ax + b = cx + d`
- [x] Choix manuel des coefficients
- [x] Génération aléatoire
- [x] Résolution détaillée étape par étape avec explications textuelles
- [ ] Gestion cas particuliers (0 solution, infinité de solutions)
- [ ] Interface responsive (mobile/tablette/desktop)

**Automatisation :** ⭐⭐⭐⭐⭐ TRÈS FACILE
**Impact pédagogique :** ⭐⭐⭐⭐⭐ FONDAMENTAL

### 1.2 Développement d'expressions
**Exemples :**
- `a(b + c)` → `ab + ac`
- `(a + b)(c + d)` → double distributivité
- `(a + b)²`, `(a - b)²`, `(a + b)(a - b)` → identités remarquables

**Fonctionnalités :**
- Génération aléatoire de termes
- Choix du type d'expression
- Correction étape par étape avec regroupement des termes

**Automatisation :** ⭐⭐⭐⭐⭐ TRÈS FACILE
**Impact pédagogique :** ⭐⭐⭐⭐⭐ FONDAMENTAL

### 1.3 Réduction d'expressions
**Exemples :**
- `3x + 5x - 2x + 7 - 3`
- `2(x + 3) + 5x - 4`

**Fonctionnalités :**
- Génération d'expressions avec termes similaires
- Étapes de regroupement
- Simplification finale

**Automatisation :** ⭐⭐⭐⭐⭐ TRÈS FACILE

### 1.4 Factorisation simple
**Exemples :**
- Facteur commun : `6x + 9 = 3(2x + 3)`
- Identités remarquables : `x² - 4 = (x-2)(x+2)`

**Fonctionnalités :**
- Détection automatique du PGCD
- Reconnaissance des identités remarquables
- Explications sur le choix de la méthode

**Automatisation :** ⭐⭐⭐⭐ FACILE
**Impact pédagogique :** ⭐⭐⭐⭐⭐

### 1.5 Inéquations du 1er degré
**Exemples :**
- `2x + 3 > 7`
- `5x - 2 ≤ 3x + 4`

**Fonctionnalités :**
- Même logique que les équations
- Gestion du changement de sens (division/multiplication par négatif)
- Représentation graphique sur droite numérique

**Automatisation :** ⭐⭐⭐⭐⭐ TRÈS FACILE

---

## 🧮 PHASE 2 - CALCULS NUMÉRIQUES
**Durée estimée :** 1-2 mois | **Priorité :** HAUTE

### 2.1 Proportionnalité & Pourcentages
**Exercices :**
- Tableaux de proportionnalité
- Calculs de pourcentages (augmentation, réduction)
- Problèmes de vitesse/distance/temps
- Échelles

**Automatisation :** ⭐⭐⭐⭐⭐ TRÈS FACILE
**Impact engagement :** ⭐⭐⭐⭐ (exercices pratiques, utiles)

### 2.2 Fractions
**Exercices :**
- Addition/soustraction avec dénominateurs différents
- Multiplication/division
- Simplification

**Automatisation :** ⭐⭐⭐⭐ FACILE

### 2.3 Racines carrées
**Exercices :**
- Simplification (√72 = 6√2)
- Opérations
- Équations avec racines

**Automatisation :** ⭐⭐⭐⭐ FACILE

### 2.4 Puissances
**Exercices :**
- Propriétés des exposants
- Notation scientifique
- Calculs

**Automatisation :** ⭐⭐⭐⭐⭐ TRÈS FACILE

---

## 📐 PHASE 3 - SECOND DEGRÉ
**Durée estimée :** 2 mois | **Priorité :** HAUTE

### 3.1 Équations du 2nd degré
**Méthodes :**
- Discriminant (Δ)
- Formule de résolution
- Forme factorisée

**Fonctionnalités :**
- Calcul du discriminant
- Discussion selon signe de Δ
- Calcul des solutions
- Vérification

**Automatisation :** ⭐⭐⭐⭐⭐ TRÈS FACILE
**Impact pédagogique :** ⭐⭐⭐⭐⭐ CRUCIAL (1ère)

### 3.2 Forme canonique
**Exercices :**
- Transformation `ax² + bx + c` → `a(x - α)² + β`
- Sommet de parabole
- Axe de symétrie

**Automatisation :** ⭐⭐⭐⭐ FACILE

### 3.3 Systèmes d'équations 2x2
**Méthodes :**
- Substitution
- Combinaison linéaire

**Automatisation :** ⭐⭐⭐⭐⭐ TRÈS FACILE

---

## 📈 PHASE 4 - FONCTIONS
**Durée estimée :** 2-3 mois | **Priorité :** MOYENNE

### 4.1 Fonctions affines
**Exercices :**
- Calcul de pente/ordonnée à l'origine
- Équation de droite passant par 2 points
- Intersection de 2 droites
- Représentation graphique

**Automatisation :** ⭐⭐⭐⭐ FACILE
**Impact visuel :** ⭐⭐⭐⭐⭐ (graphiques)

### 4.2 Fonctions du 2nd degré
**Exercices :**
- Tableau de variations
- Extremum
- Représentation graphique (parabole)
- Intersection avec axes

**Automatisation :** ⭐⭐⭐⭐ FACILE

### 4.3 Tableau de signes
**Exercices :**
- Polynômes du 1er degré
- Polynômes du 2nd degré
- Produits/quotients de fonctions

**Automatisation :** ⭐⭐⭐⭐ FACILE

---

## 🎲 PHASE 5 - GÉOMÉTRIE ANALYTIQUE
**Durée estimée :** 1-2 mois | **Priorité :** MOYENNE

### 5.1 Vecteurs (plan)
**Exercices :**
- Coordonnées de vecteurs
- Addition, multiplication par scalaire
- Norme
- Colinéarité
- Produit scalaire (1ère/Term)

**Automatisation :** ⭐⭐⭐⭐⭐ TRÈS FACILE

### 5.2 Repérage dans le plan
**Exercices :**
- Distance entre 2 points
- Coordonnées du milieu
- Équation de cercle
- Équation de droite (différentes formes)

**Automatisation :** ⭐⭐⭐⭐⭐ TRÈS FACILE

### 5.3 Géométrie dans l'espace (Terminale)
**Exercices :**
- Vecteurs 3D
- Équations de plans
- Intersection plan/droite
- Distance point/plan

**Automatisation :** ⭐⭐⭐⭐ FACILE

---

## 🔢 PHASE 6 - SUITES & ANALYSE
**Durée estimée :** 2-3 mois | **Priorité :** MOYENNE-BASSE

### 6.1 Suites arithmétiques
**Exercices :**
- Calcul de terme général
- Somme des n premiers termes
- Problèmes appliqués

**Automatisation :** ⭐⭐⭐⭐⭐ TRÈS FACILE

### 6.2 Suites géométriques
**Exercices :**
- Calcul de terme général
- Somme des n premiers termes
- Limite

**Automatisation :** ⭐⭐⭐⭐⭐ TRÈS FACILE

### 6.3 Dérivation (1ère/Term)
**Exercices :**
- Calcul de dérivées (polynômes, fractions, racines)
- Équation de tangente
- Application aux variations

**Automatisation :** ⭐⭐⭐⭐ FACILE

### 6.4 Primitives & Intégrales (Terminale)
**Exercices :**
- Calcul de primitives simples
- Calcul d'intégrales
- Aires sous courbe

**Automatisation :** ⭐⭐⭐⭐ FACILE

---

## 📊 PHASE 7 - PROBABILITÉS & STATISTIQUES
**Durée estimée :** 2 mois | **Priorité :** BASSE

### 7.1 Probabilités
**Exercices :**
- Calculs de base (tirages, dés, cartes)
- Arbres de probabilités
- Probabilités conditionnelles
- Loi binomiale

**Automatisation :** ⭐⭐⭐ MOYEN (génération d'énoncés complexe)

### 7.2 Statistiques
**Exercices :**
- Moyenne, médiane, quartiles
- Écart-type
- Diagrammes (générés automatiquement)

**Automatisation :** ⭐⭐⭐⭐ FACILE

---

## 🎨 PHASE 8 - TRIGONOMÉTRIE
**Durée estimée :** 1-2 mois | **Priorité :** BASSE

### 8.1 Trigonométrie de base
**Exercices :**
- Valeurs remarquables (sin, cos, tan)
- Cercle trigonométrique
- Résolution d'équations simples

**Automatisation :** ⭐⭐⭐⭐ FACILE

### 8.2 Formules trigonométriques
**Exercices :**
- Addition, duplication
- Transformation produit en somme

**Automatisation :** ⭐⭐⭐ MOYEN

---

## 🎓 PHASE 9 - COLLÈGE (Extension)
**Priorité :** BASSE (après lycée)

### Thèmes possibles :
- Calcul mental (tables, opérations)
- Nombres relatifs
- Théorème de Pythagore
- Théorème de Thalès
- Géométrie plane (aires, périmètres)
- Introduction aux équations

---

## 🛠️ FONCTIONNALITÉS TRANSVERSALES

### À implémenter progressivement :

**V1 - MVP (Phase 1)**
- ✅ Génération infinie d'exercices
- ✅ Correction détaillée
- ✅ Interface responsive
- [ ] Mode clair/sombre

**V2 - Engagement (après Phase 2)**
- [ ] Historique local (localStorage) des exercices résolus
- [ ] Filtre par difficulté (facile/moyen/difficile)
- [ ] Export PDF des corrections
- [ ] Partage d'exercice (lien)

**V3 - Gamification (Phase 4+)**
- [ ] Système de points/XP
- [ ] Badges de progression
- [ ] Streaks quotidiens
- [ ] Leaderboard (optionnel, anonyme)

**V4 - Personnalisation (Phase 6+)**
- [ ] Compte utilisateur (sauvegarde cloud)
- [ ] Statistiques de progression
- [ ] Recommandations d'exercices
- [ ] Parcours personnalisés

**V5 - Communauté (Long terme)**
- [ ] Forum d'entraide
- [ ] Exercices créés par la communauté
- [ ] Mode "défi" entre utilisateurs

---

## 📱 ASPECTS TECHNIQUES

### Architecture recommandée :
- **Frontend :** HTML/CSS/JavaScript vanilla (Phase 1-2) → React (Phase 3+)
- **Génération :** Algorithmes JS côté client (pas besoin de backend initialement)
- **Stockage :** localStorage (V1) → Firebase/Supabase (V3+)
- **Graphiques :** Canvas API / Chart.js / Plotly

### Optimisations SEO :
- Pages statiques par type d'exercice
- URLs parlantes (/equations-premier-degre, /factorisation, etc.)
- Meta descriptions pédagogiques
- Schema.org markup (EducationalContent)

---

## 🎯 MÉTRIQUES DE SUCCÈS

### Phase 1 (3 mois) :
- 1000 exercices résolus/mois
- Temps moyen par session : 10-15 min
- Taux de rebond < 50%

### Phase 3 (6 mois) :
- 10,000 exercices résolus/mois
- 1000 utilisateurs actifs/mois
- 3-5 pages vues par session

### Phase 6 (12 mois) :
- 100,000 exercices résolus/mois
- 10,000 utilisateurs actifs/mois
- RPM > €3

---

## 🚨 DIFFICULTÉS ANTICIPÉES

### Exercices DIFFICILES à automatiser :
❌ **Démonstrations** (rédaction libre, raisonnement)
❌ **Géométrie pure** (constructions au compas, preuves)
❌ **Problèmes ouverts** (modélisation, créativité)
❌ **Analyse de graphiques complexes** (interprétation)

→ **Solution :** Se concentrer sur les exercices algorithmiques d'abord, ajouter contenu éditorial plus tard.

---

## 📅 PLANNING PRÉVISIONNEL

| Mois | Phase | Livrables |
|------|-------|-----------|
| M1-M2 | Phase 1 | Équations, développement, factorisation |
| M3 | Phase 2 | Calculs numériques |
| M4-M5 | Phase 3 | Second degré |
| M6-M7 | Phase 4 | Fonctions |
| M8 | Phase 5 | Géométrie analytique |
| M9-M10 | Phase 6 | Suites & dérivées |
| M11 | Phase 7 | Probabilités |
| M12 | Phase 8 | Trigonométrie |

**Total : 1 an pour couverture complète lycée**

---

## 💡 PROCHAINES ÉTAPES IMMÉDIATES

1. ✅ **Finaliser MVP équations 1er degré** (cette semaine)
2. **Tester avec utilisateurs réels** (lycéens, profs)
3. **Analyser métriques d'engagement**
4. **Développer, factorisation, réduction** (Phase 1.2-1.4)
5. **Décider gamification** (selon données engagement)

---

## 🔄 Ce document est vivant
À mettre à jour régulièrement selon :
- Feedback utilisateurs
- Données analytics
- Nouvelles opportunités techniques
- Évolution du marché EdTech

**Dernière mise à jour :** Janvier 2026
**Prochaine révision :** Après Phase 1 complète

