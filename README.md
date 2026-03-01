# 🎓 MathsFacile

Une plateforme d'entraînement en mathématiques interactive pour l'enseignement secondaire français (collège et lycée). Génère des exercices illimités avec des solutions détaillées étape par étape.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Made with JavaScript](https://img.shields.io/badge/Made%20with-JavaScript-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![No Dependencies](https://img.shields.io/badge/Dependencies-0-green.svg)](package.json)

---

## ✨ Fonctionnalités

### Modules Disponibles (v4.0 - 41 modules)

#### Algèbre (8 modules)

| Module | Description | Types d'exercices |
|--------|-------------|-------------------|
| **Équations** | Équations du 1er degré | `ax + b = c`, `ax + b = cx + d` |
| **Développement** | Distributivité et identités | Simple, double, (a+b)², (a-b)², (a+b)(a-b) |
| **Réduction** | Simplification d'expressions | Termes en x, x², avec parenthèses |
| **Factorisation** | Mise en facteur | Facteur commun, identités remarquables |
| **Inéquations** | Inéquations du 1er degré | Avec représentation graphique |
| **Équations 2nd degré** | Résolution ax²+bx+c=0 | Discriminant, canonique, particulières, somme-produit |
| **Inéquations 2nd degré** | Résolution d'inéquations | Tableau de signes, graphique Canvas |
| **Systèmes d'équations** | Systèmes linéaires 2×2 | Substitution, combinaison |

#### Calculs (4 modules)

| Module | Description | Types d'exercices |
|--------|-------------|-------------------|
| **Fractions** | Opérations sur fractions | Addition, soustraction, multiplication, division, simplification, inverse |
| **Pourcentages** | Calculs de pourcentages | Calculer %, appliquer %, variation, évolution, taux global |
| **Puissances** | Calcul avec puissances | Produit, quotient, puissance, notation scientifique, combiné |
| **Racines carrées** | Calcul avec racines | Carrés parfaits, simplification, conjuguée, fraction |

#### Fonctions (3 modules)

| Module | Description | Types d'exercices |
|--------|-------------|-------------------|
| **Fonctions affines** | Fonctions y = ax + b | Graphique, image, antécédent, équation, intersection |
| **Fonctions 2nd degré** | Paraboles | Graphique, canonique, sommet, variations, extremum |
| **Dérivées** | Calcul de dérivées | Polynomiale, produit, quotient, composition, tangente, variations |

#### Suites & Analyse (4 modules)

| Module | Description | Types d'exercices |
|--------|-------------|-------------------|
| **Suites numériques** | Suites arithmétiques/géométriques | Arithmétique, géométrique, sommes, variation |
| **Limites** | Limites de fonctions | Polynôme, rationnelle, point, formes indéterminées, racines, asymptotes |
| **Primitives & Intégrales** | Calcul intégral | Polynomiale, usuelles, condition initiale, intégrale définie, aire, valeur moyenne |
| **Exponentielles & Logarithmes** | Fonctions exp/ln | Équations exp/ln, dérivées, études, croissance, log décimal |

#### Probabilités & Statistiques (2 modules)

| Module | Description | Types d'exercices |
|--------|-------------|-------------------|
| **Probabilités** | Calcul de probabilités | Simples, conditionnelles, arbres, binomiale, variables aléatoires, fluctuation |
| **Statistiques** | Statistiques descriptives | Moyenne, médiane & quartiles, variance & écart-type, diagramme en boîte, régression linéaire |

#### Géométrie & Trigonométrie (4 modules)

| Module | Description | Types d'exercices |
|--------|-------------|-------------------|
| **Trigonométrie** | Cercle trigo, formules | Valeurs remarquables, conversion, équations, formules d'addition, identités, triangles |
| **Vecteurs** | Vecteurs du plan | Coordonnées, norme & distance, colinéarité, produit scalaire, opérations |
| **Géométrie analytique** | Droites et cercles du plan | Équations droites (3 types), cercles (3 types), distances (2 types), transformations (3 types) |
| **Géométrie espace** | Coordonnées et positions 3D | Coordonnées 3D, droites & plans, positions relatives, produit scalaire, sections solides |

#### Terminale Spécialité (3 modules)

| Module | Description | Types d'exercices |
|--------|-------------|-------------------|
| **Arithmétique** | Divisibilité, PGCD, premiers | Divisibilité, PGCD & Euclide, nombres premiers, congruences, Bézout |
| **Nombres Complexes** | Formes, géométrie | Algébrique, trigonométrique, module & argument, équations, géométrie |
| **Logique & Dénombrement** | Combinatoire et raisonnement | Dénombrement (n!, A_n^k, C_n^k), récurrence, binôme de Newton |

#### Modules Collège — Navigation par Classe (13 modules)

| Module | Niveau | Description | Types d'exercices |
|--------|--------|-------------|-------------------|
| **Nombres et décimaux** | 6ème | Opérations, comparaison, arrondis | Addition, soustraction, multiplication, ordre |
| **Proportionnalité** | 6e–5e–4e | Tableaux, coefficients, échelles | Tableau, coefficient, produit en croix, échelle, vitesse |
| **Périmètres, aires et volumes** | 6e–5e | Figures usuelles et solides | Périmètre, aire, volume, conversions |
| **Symétries** | 6e–5e | Axiale et centrale avec Canvas | Construction, propriétés, coordonnées |
| **Angles** | 6e–5e | Mesure et types d'angles | Complémentaires, supplémentaires, alternes-internes |
| **Nombres relatifs** | 5e–4e | Les 4 opérations avec relatifs | Repérage, comparaison, addition, soustraction, multiplication, division |
| **Priorités opératoires** | 5ème | Enchainements de calculs | Sans parenthèses, avec parenthèses |
| **Triangles et parallélogrammes** | 5ème | Propriétés et constructions | Somme des angles, inégalité triangulaire, parallélogramme |
| **Théorème de Pythagore** | 4ème | Direct et réciproque avec Canvas | Hypoténuse, côté, réciproque, problème contextualisé |
| **Translations et rotations** | 4ème | Transformations du plan avec Canvas | Translation par vecteur, rotation 90°/180° |
| **Théorème de Thalès** | 3ème | Direct et réciproque avec Canvas | Longueur manquante, réciproque, agrandissement |
| **Notion de fonction** | 2nde | Généralités sur les fonctions | Image, antécédent, variations, domaine, tableau de valeurs |
| **Fonctions de référence** | 2nde | Fonctions usuelles avec Canvas | Carrée, inverse, racine, cube, valeur absolue |

### Points Forts

- ♾️ **Exercices illimités** - Génération aléatoire infinie
- 📝 **Corrections détaillées** - Chaque étape expliquée
- 🎨 **Visualisation** - Flèches SVG, couleurs par terme, droite numérique, graphiques Canvas
- 📊 **Graphiques interactifs** - Paraboles, racines, zones de solutions (Canvas pur, zéro dépendance)
- 📱 **Responsive** - Fonctionne sur mobile, tablette, desktop
- 🔌 **Hors-ligne** - Aucune connexion requise après téléchargement
- 🚀 **Léger** - Aucune dépendance, chargement instantané

---

## 🚀 Démarrage Rapide

### Option 1 : Téléchargement direct
1. [Télécharger le ZIP](../../archive/main.zip)
2. Extraire
3. Ouvrir `index.html` dans un navigateur

### Option 2 : Git clone
```bash
git clone https://github.com/VOTRE-USERNAME/mathsfacile.git
cd mathsfacile
# Ouvrir index.html dans un navigateur
```

### Option 3 : Serveur local (pour développement)
```bash
# Python
python -m http.server 8000

# Node.js
npx serve .

# Puis ouvrir http://localhost:8000
```

---

## 📂 Structure du Projet

```
Website_Math/
├── *.html (41 fichiers)       # Pages des modules + accueil.html
├── css/
│   ├── theme.css              # Variables CSS (couleurs, espacements)
│   ├── base.css               # Reset, typographie
│   ├── layout.css             # Navigation, cards, grilles
│   ├── navigation.css         # Navigation responsive + hamburger + badge niveau
│   ├── accueil.css            # Page d'accueil navigation par classe
│   ├── exercices.css          # Styles communs exercices
│   ├── equations2.css         # Tableaux de signes, fractions, graphiques
│   ├── developpement.css      # Flèches SVG distributivité
│   └── ...                    # Styles spécifiques modules
│
├── js/
│   ├── utils.js               # Fonctions utilitaires (PGCD, formatage...)
│   ├── ui.js                  # Manipulation DOM
│   ├── main.js                # Initialisation globale
│   ├── navigation.js          # Navigation par classe + filtrage par niveau
│   ├── graphing.js            # Module graphiques Canvas (GraphCanvas + 3D)
│   ├── tableau-variations.js  # Tableaux de variations dynamiques
│   └── [module].js (41)       # Logique de chaque module
│
├── CLAUDE.md                  # Guide pour assistants IA
├── ROADMAP.md                 # Plan de développement général
├── ROADMAP-NAVIGATION-PAR-CLASSE.md  # Roadmap migration navigation par classe
└── README.md                  # Ce fichier
```

---

## 🧪 Tests

```bash
# Installer les dépendances de test
npm install

# Lancer les tests
npm test

# Mode watch (relance automatique)
npm run test:watch

# Couverture de code
npm run test:coverage
```

---

## 🗺️ Roadmap

### ✅ Complété (41 modules — programme complet 6ème → Terminale)

**Lycée (28 modules originaux)**
- [x] Algèbre : Équations, Développement, Réduction, Factorisation, Inéquations, Équations 2nd degré, Inéquations 2nd degré, Systèmes
- [x] Calculs : Fractions, Pourcentages, Puissances, Racines carrées
- [x] Fonctions : Fonctions affines, Fonctions 2nd degré, Dérivées, Notion de fonction, Fonctions de référence
- [x] Suites & Analyse : Suites numériques, Limites, Primitives & Intégrales, Exponentielles & Logarithmes
- [x] Probabilités & Statistiques : Probabilités, Statistiques
- [x] Géométrie & Trigonométrie : Trigonométrie, Vecteurs, Géométrie analytique, Géométrie espace
- [x] Terminale Spécialité : Arithmétique, Nombres Complexes, Logique & Dénombrement

**Collège (13 modules, navigation par classe)**
- [x] 6ème : Nombres et décimaux, Proportionnalité, Périmètres/Aires/Volumes, Symétries, Angles
- [x] 5ème : Nombres relatifs, Priorités opératoires, Triangles et parallélogrammes
- [x] 4ème : Théorème de Pythagore, Translations et rotations
- [x] 3ème : Théorème de Thalès
- [x] 2nde : Notion de fonction, Fonctions de référence

### 🔧 Navigation par classe (✅ implémentée)
- Navigation 6ème → Terminale avec chapitres du programme officiel
- Filtrage automatique des types d'exercices par niveau (`?niveau=`)
- Page d'accueil `accueil.html` avec cards par niveau

### 📋 Phase 5 — Améliorations (prochaine étape)
- Breadcrumb niveau sur chaque page filtrée
- Bouton "Voir tous les exercices" pour désactiver le filtre
- Tests responsive complets sur mobile

📖 Voir [ROADMAP-NAVIGATION-PAR-CLASSE.md](ROADMAP-NAVIGATION-PAR-CLASSE.md) pour le détail complet.

---

## 🛠️ Stack Technique

| Technologie | Utilisation |
|-------------|-------------|
| HTML5 | Structure des pages |
| CSS3 | Styles, variables CSS, responsive |
| JavaScript (ES6+) | Logique, génération, DOM |
| Canvas API | Graphiques (paraboles, fonctions, diagrammes d'Argand) |
| KaTeX (CDN) | Rendu mathématique (fractions, racines, vecteurs) |
| SVG | Flèches de distributivité |

### Pourquoi Vanilla JS ?
- ✅ Zéro dépendance = zéro vulnérabilité
- ✅ Chargement instantané
- ✅ Fonctionne partout
- ✅ Code pédagogique et lisible
- ✅ Maintenance simplifiée

---

## 🤝 Contribuer

Les contributions sont bienvenues !

### Signaler un Bug
1. Vérifier qu'il n'existe pas déjà dans les [Issues](../../issues)
2. Créer une issue avec :
   - Description du bug
   - Étapes pour reproduire
   - Comportement attendu vs obtenu
   - Screenshots si pertinent

### Proposer une Amélioration
1. Ouvrir une issue avec le tag `enhancement`
2. Décrire la fonctionnalité proposée
3. Attendre validation avant développement

### Soumettre du Code
```bash
# 1. Fork le projet
# 2. Créer une branche
git checkout -b feat/ma-fonctionnalite

# 3. Développer et tester
npm test

# 4. Commiter
git commit -m "feat: ajoute [fonctionnalité]"

# 5. Push et Pull Request
git push origin feat/ma-fonctionnalite
```

### Conventions de Commit
```
feat:     Nouvelle fonctionnalité
fix:      Correction de bug
refactor: Refactoring
style:    CSS, formatage
docs:     Documentation
test:     Tests
```

---

## 📊 Métriques Cibles

| Période | Objectif |
|---------|----------|
| 3 mois | 1 000 exercices résolus/mois |
| 6 mois | 10 000 exercices résolus/mois |
| 12 mois | 100 000 exercices résolus/mois |

---

## 📝 License

MIT License - Voir [LICENSE](LICENSE)

---

