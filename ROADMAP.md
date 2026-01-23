# 🗺️ Roadmap - MathsFacile

**Objectif** : Créer une plateforme complète d'entraînement en mathématiques pour le collège et le lycée français, couvrant tous les chapitres majeurs du programme.

**Philosophie** : Développement itératif par phases, avec livraison de modules fonctionnels et testés. Chaque phase apporte une valeur immédiate aux utilisateurs.

**Statut Actuel** : Phase 2 complète (9 modules disponibles) ✅

---

## 📊 Vue d'ensemble des phases

| Phase | Thème | Statut | Modules | Niveau |
|-------|-------|--------|---------|--------|
| **Phase 1** | Algèbre de Base | ✅ Complète | 5/5 | 4ème-3ème |
| **Phase 2** | Calculs Numériques | ✅ Complète | 4/4 | 3ème-2nde |
| **Phase 3** | Second Degré | 🔄 En cours | 0/3 | 1ère |
| **Phase 4** | Fonctions | 📋 Planifiée | 0/4 | 2nde-1ère |
| **Phase 5** | Géométrie Analytique | 📋 Planifiée | 0/3 | 2nde-1ère |
| **Phase 6** | Suites et Analyse | 📋 Planifiée | 0/4 | 1ère-Terminale |
| **Phase 7** | Probabilités et Stats | 📋 Planifiée | 0/3 | 2nde-Terminale |
| **Phase 8** | Complexes et Avancé | 📋 Planifiée | 0/3 | Terminale |

---

## ✅ Phase 1 - Algèbre de Base (COMPLÈTE)

**Objectif** : Maîtriser les fondamentaux de l'algèbre (4ème-3ème)

### Modules livrés

| Module | Fichier | Types d'exercices | Tests | Statut |
|--------|---------|-------------------|-------|--------|
| **Équations** | `index.html` | `ax+b=c`, `ax+b=cx+d` | ✅ | ✅ |
| **Développement** | `developpement.html` | Simple, double, (a+b)², (a-b)², (a-b)(a+b) | ✅ | ✅ |
| **Réduction** | `reduction.html` | Termes en x, x², avec parenthèses | ✅ | ✅ |
| **Factorisation** | `factorisation.html` | Facteur commun, identités remarquables | ✅ | ✅ |
| **Inéquations** | `inequations.html` | `ax+b<c`, `ax+b>cx+d` + droite numérique | ✅ | ✅ |

### Fonctionnalités clés développées

- ✅ Architecture modulaire (HTML/CSS/JS vanilla)
- ✅ Génération aléatoire d'exercices
- ✅ Solutions détaillées étape par étape
- ✅ Visualisation avec couleurs (termes colorés)
- ✅ Tests unitaires (Jest)
- ✅ Design responsive
- ✅ Navigation inter-modules

### Date de complétion : Décembre 2024

---

## ✅ Phase 2 - Calculs Numériques (COMPLÈTE)

**Objectif** : Maîtriser les calculs numériques (3ème-2nde)

### Modules livrés

| Module | Fichier | Types d'exercices | Tests | Statut |
|--------|---------|-------------------|-------|--------|
| **Fractions** | `fractions.html` | Addition, soustraction, multiplication, division, simplification, inverse | ✅ | ✅ |
| **Pourcentages** | `pourcentages.html` | Calculer %, appliquer %, variation, évolution, taux global | ✅ | ✅ |
| **Puissances** | `puissances.html` | Produit, quotient, puissance de puissance, produit élevé, notation scientifique, combiné | ✅ | ✅ |
| **Racines carrées** | `racines.html` | Carrés parfaits, simplification, expression conjuguée, fraction conjuguée, produit, quotient | ✅ | ✅ |

### Nouvelles fonctionnalités

- ✅ Système de types d'exercices multiples par module
- ✅ Simplification automatique des fractions
- ✅ Gestion des cas particuliers (division par zéro, etc.)
- ✅ Expressions conjuguées pour les racines
- ✅ Notation scientifique pour les puissances
- ✅ Exercices combinés multi-étapes
- ✅ CSS spécifiques pour puissances et racines

### Date de complétion : Janvier 2025

---

## 🔄 Phase 3 - Second Degré (EN COURS)

**Objectif** : Étudier les équations, inéquations et fonctions du second degré (1ère)

### Modules prévus

| Module | Fichier | Types d'exercices | Priorité | Statut |
|--------|---------|-------------------|----------|--------|
| **Équations 2nd degré** | `equations2.html` | Forme canonique, discriminant, résolution | 🔥 Haute | 📋 À faire |
| **Inéquations 2nd degré** | `inequations2.html` | Tableau de signes, représentation graphique | 🔥 Haute | 📋 À faire |
| **Paraboles** | `paraboles.html` | Forme canonique, sommet, variations | 🔥 Haute | 📋 À faire |

### Types d'exercices détaillés

#### 3.1 - Équations du 2nd degré
- **Type 1** : Résolution par forme canonique
  - `ax² + bx + c = 0` → forme `a(x-α)² + β = 0`
  - Identifier sommet, résoudre
- **Type 2** : Résolution par discriminant
  - Calculer Δ = b² - 4ac
  - Cas Δ > 0 (deux solutions), Δ = 0 (une solution), Δ < 0 (aucune)
  - Formules x₁ et x₂
- **Type 3** : Équations particulières
  - ax² + c = 0 (sans terme en x)
  - ax² + bx = 0 (mise en facteur)
  - (x-a)² = k (forme directe)
- **Type 4** : Somme et produit des racines
  - S = -b/a, P = c/a
  - Vérification des solutions

#### 3.2 - Inéquations du 2nd degré
- **Type 1** : Tableau de signes
  - Résoudre ax² + bx + c > 0 (ou <, ≥, ≤)
  - Construire tableau de signes
  - Identifier intervalles solutions
- **Type 2** : Représentation graphique
  - Tracer parabole
  - Identifier zones > 0 ou < 0
- **Type 3** : Système d'inéquations
  - Résoudre plusieurs inéquations simultanément
  - Intersection des ensembles solutions

#### 3.3 - Paraboles et Fonctions du 2nd degré
- **Type 1** : Forme canonique
  - Transformer ax² + bx + c en a(x-α)² + β
  - Identifier sommet (α, β)
- **Type 2** : Variations
  - Tableau de variations
  - Extremum (minimum/maximum)
- **Type 3** : Graphique
  - Tracer parabole avec repères
  - Racines, sommet, ordonnée à l'origine
- **Type 4** : Problèmes d'application
  - Trajectoire parabolique
  - Optimisation (aire, coût, etc.)

### Fonctionnalités techniques à développer

- 🔲 Calcul du discriminant (Δ)
- 🔲 Résolution d'équations avec cas multiples (0, 1, 2 solutions)
- 🔲 Génération de tableaux de signes interactifs
- 🔲 Visualisation de paraboles (SVG ou Canvas)
- 🔲 Forme canonique automatique
- 🔲 Représentation graphique des inéquations
- 🔲 Tests unitaires pour tous les cas (Δ positif, nul, négatif)

### Challenges techniques

- **Visualisation graphique** : Tracer paraboles avec précision
- **Tableaux de signes** : Génération HTML propre et lisible
- **Cas particuliers** : Gestion des racines multiples, nulles, complexes
- **Ergonomie** : Interface claire pour les coefficients a, b, c

### Estimation : 2-3 semaines de développement

---

## 📋 Phase 4 - Fonctions (PLANIFIÉE)

**Objectif** : Étudier les fonctions, variations, limites (2nde-1ère)

### Modules prévus

| Module | Description | Types d'exercices |
|--------|-------------|-------------------|
| **Fonctions affines** | Droites, équations | Pente, ordonnée origine, graphique |
| **Fonctions polynômes** | Degré 2 et 3 | Variations, racines, graphique |
| **Fonctions de référence** | √, 1/x, x², x³ | Tableaux de variations, courbes |
| **Dérivées** | Calcul de dérivées | Formules, tangentes, optimisation |

### Fonctionnalités prévues

- Tracé de courbes interactif
- Tableaux de variations
- Calcul de tangentes
- Étude complète de fonction

### Estimation : 4-5 semaines

---

## 📋 Phase 5 - Géométrie Analytique (PLANIFIÉE)

**Objectif** : Coordonnées, vecteurs, droites dans le plan (2nde-1ère)

### Modules prévus

| Module | Description | Types d'exercices |
|--------|-------------|-------------------|
| **Vecteurs** | Coordonnées, opérations | Addition, k×v, norme, colinéarité |
| **Droites** | Équations cartésiennes | ax+by+c=0, parallélisme, intersection |
| **Produit scalaire** | Calcul, applications | Orthogonalité, projection, angle |

### Fonctionnalités prévues

- Repère orthonormé interactif
- Tracé de vecteurs (flèches)
- Construction de droites
- Calculs de distances et angles

### Estimation : 3-4 semaines

---

## 📋 Phase 6 - Suites et Analyse (PLANIFIÉE)

**Objectif** : Suites numériques, limites, récurrence (1ère-Terminale)

### Modules prévus

| Module | Description | Types d'exercices |
|--------|-------------|-------------------|
| **Suites arithmétiques** | Un = U0 + nr | Calcul de termes, somme |
| **Suites géométriques** | Un = U0 × q^n | Calcul de termes, limite |
| **Récurrence** | Preuve par récurrence | Initialisation, hérédité |
| **Limites** | Limites de suites | Calcul, théorèmes |

### Fonctionnalités prévues

- Génération de termes de suites
- Représentation graphique (nuage de points)
- Étapes de raisonnement par récurrence
- Calculs de limites

### Estimation : 4-5 semaines

---

## 📋 Phase 7 - Probabilités et Statistiques (PLANIFIÉE)

**Objectif** : Probabilités, statistiques, lois de probabilité (2nde-Terminale)

### Modules prévus

| Module | Description | Types d'exercices |
|--------|-------------|-------------------|
| **Probabilités de base** | Calcul de probabilités | P(A), P(A∪B), P(A∩B), P(Ā) |
| **Statistiques** | Moyenne, médiane, écart-type | Calculs sur séries |
| **Lois de probabilité** | Binomiale, normale | Calculs, représentations |

### Fonctionnalités prévues

- Arbres de probabilité
- Diagrammes de Venn
- Courbes de lois (histogrammes, courbe de Gauss)
- Calculatrice statistique

### Estimation : 3-4 semaines

---

## 📋 Phase 8 - Nombres Complexes et Avancé (PLANIFIÉE)

**Objectif** : Nombres complexes, logarithmes, exponentielle (Terminale)

### Modules prévus

| Module | Description | Types d'exercices |
|--------|-------------|-------------------|
| **Nombres complexes** | Forme algébrique, module, argument | z = a+ib, \|z\|, arg(z) |
| **Logarithme et exponentielle** | ln(x), e^x | Équations, inéquations |
| **Intégration** | Calcul d'intégrales | Primitives, aire sous courbe |

### Fonctionnalités prévues

- Représentation dans le plan complexe
- Courbes de ln et exp
- Calcul d'aires (intégrales)
- Équations différentielles simples

### Estimation : 4-5 semaines

---

## 🚀 Fonctionnalités Transverses

### Améliorations interface (toutes phases)

- [ ] Mode sombre / clair
- [ ] Historique des exercices
- [ ] Sauvegarde des favoris (localStorage)
- [ ] Système de difficulté (facile/moyen/difficile)
- [ ] Chronomètre pour les exercices
- [ ] Statistiques de progression
- [ ] Exportation PDF des solutions

### Améliorations techniques

- [ ] PWA (Progressive Web App) pour installation
- [ ] Service Worker pour offline total
- [ ] Internationalisation (i18n) pour l'anglais
- [ ] Accessibilité (ARIA, navigation clavier)
- [ ] Animations CSS pour transitions
- [ ] Mode impression optimisé

### Améliorations pédagogiques

- [ ] Indices progressifs (aide étape par étape)
- [ ] Exercices guidés (mode tutoriel)
- [ ] Quiz de révision
- [ ] Parcours thématiques (fiches de révision)
- [ ] Intégration vidéos explicatives (liens YouTube)

---

## 📈 Métriques de Succès

### Objectifs techniques

| Métrique | Cible | Actuel |
|----------|-------|--------|
| Couverture de tests | > 80% | ~70% |
| Performance (Lighthouse) | > 90 | ~95 |
| Accessibilité | > 90 | ~85 |
| Modules livrés | 30+ | 9 |
| Zéro dépendances prod | ✅ | ✅ |

### Objectifs utilisateurs (6 mois)

| Métrique | Cible |
|----------|-------|
| Exercices résolus/mois | 10 000 |
| Utilisateurs actifs/mois | 500 |
| Taux de complétion exercices | > 60% |
| Note utilisateurs | > 4.5/5 |

---

## 🎯 Prochaines Actions Immédiates

### Phase 3 - Sprint 1 (Semaine 1-2)

1. **Équations du 2nd degré** - Module de base
   - [ ] Créer `equations2.html` avec structure
   - [ ] Implémenter calcul du discriminant
   - [ ] Gérer les 3 cas (Δ > 0, = 0, < 0)
   - [ ] Solutions détaillées étape par étape
   - [ ] Tests unitaires complets
   - [ ] Navigation mise à jour

2. **Design et UX**
   - [ ] CSS spécifique pour affichage Δ et racines
   - [ ] Visualisation des étapes de calcul
   - [ ] Format LaTeX/MathML pour formules complexes

### Phase 3 - Sprint 2 (Semaine 3-4)

3. **Inéquations du 2nd degré**
   - [ ] Créer `inequations2.html`
   - [ ] Tableaux de signes générés automatiquement
   - [ ] Intervalles solutions
   - [ ] Tests unitaires

4. **Paraboles**
   - [ ] Créer `paraboles.html`
   - [ ] Tracé de paraboles (SVG ou Canvas)
   - [ ] Forme canonique automatique
   - [ ] Sommet, variations

---

## 🛠️ Stack Technique (évolution)

### Actuel (Phases 1-2)

- HTML5, CSS3, JavaScript ES6+
- Jest pour tests unitaires
- SVG pour visualisations simples
- Git + GitHub

### Envisagé (Phases 3+)

- **Canvas API** : Pour tracés de courbes complexes (paraboles, fonctions)
- **MathJax** ou **KaTeX** : Rendu LaTeX pour formules complexes (optionnel, évaluer impact taille)
- **Chart.js** (optionnel) : Pour statistiques et courbes (si vanilla SVG trop complexe)

**Décision** : Rester vanilla le plus longtemps possible, n'ajouter des libs que si vraiment nécessaire et après prototypage vanilla.

---

## 📊 Planification Globale

| Trimestre | Phases | Objectif |
|-----------|--------|----------|
| **Q4 2024** | Phase 1 complète | 5 modules algèbre |
| **Q1 2025** | Phase 2 complète | 9 modules total |
| **Q2 2025** | Phase 3 + Phase 4 | Second degré + Fonctions |
| **Q3 2025** | Phase 5 + Phase 6 | Géométrie + Suites |
| **Q4 2025** | Phase 7 + Phase 8 | Probas + Complexes |
| **2026+** | Améliorations, PWA, communauté | Plateforme mature |

---

## 🤝 Contribution

### Comment contribuer à la roadmap

1. **Prioriser un module** : Créer une issue avec tag `roadmap`
2. **Proposer une phase** : Ouvrir une discussion GitHub
3. **Signaler des besoins pédagogiques** : Issue avec tag `pedagogie`

### Choix des priorités

Les modules sont priorisés selon :

1. **Programme scolaire** : Suivre progression collège → lycée
2. **Dépendances** : Prérequis entre chapitres (ex: équations 1er avant 2nd degré)
3. **Impact utilisateur** : Chapitres les plus demandés/utilisés
4. **Complexité technique** : Équilibrer modules simples et complexes

---

## 📝 Notes de Version

### v1.2 - Janvier 2025 (Phase 2 complète)
- ✅ Ajout Fractions
- ✅ Ajout Pourcentages
- ✅ Ajout Puissances
- ✅ Ajout Racines carrées
- ✅ 4 modules × 6 types d'exercices = 24 types totaux
- ✅ Tests unitaires complets pour tous modules

### v1.0 - Décembre 2024 (Phase 1 complète)
- ✅ Équations du 1er degré
- ✅ Développement d'expressions
- ✅ Réduction d'expressions
- ✅ Factorisation
- ✅ Inéquations du 1er degré
- ✅ Architecture modulaire en place
- ✅ Tests unitaires Jest

---

**Dernière mise à jour** : 23 janvier 2025
**Prochaine révision** : Fin Phase 3 (estimé mars 2025)

---

🎓 **MathsFacile** - L'entraînement en mathématiques sans limite.
