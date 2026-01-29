# 🎓 MathsFacile

Une plateforme d'entraînement en mathématiques interactive pour l'enseignement secondaire français (collège et lycée). Génère des exercices illimités avec des solutions détaillées étape par étape.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Made with JavaScript](https://img.shields.io/badge/Made%20with-JavaScript-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![No Dependencies](https://img.shields.io/badge/Dependencies-0-green.svg)](package.json)

---

## ✨ Fonctionnalités

### Modules Disponibles (v1.3)

#### Phase 1 - Algèbre de Base (5 modules)

| Module | Description | Types d'exercices |
|--------|-------------|-------------------|
| **Équations** | Équations du 1er degré | `ax + b = c`, `ax + b = cx + d` |
| **Développement** | Distributivité et identités | Simple, double, (a+b)², (a-b)², (a+b)(a-b) |
| **Réduction** | Simplification d'expressions | Termes en x, x², avec parenthèses |
| **Factorisation** | Mise en facteur | Facteur commun, identités remarquables |
| **Inéquations** | Inéquations du 1er degré | Avec représentation graphique |

#### Phase 2 - Calculs Numériques (4 modules)

| Module | Description | Types d'exercices |
|--------|-------------|-------------------|
| **Fractions** | Opérations sur fractions | Addition, soustraction, multiplication, division, simplification, inverse |
| **Pourcentages** | Calculs de pourcentages | Calculer %, appliquer %, variation, évolution, taux global |
| **Puissances** | Calcul avec puissances | Produit, quotient, puissance, produit élevé, notation scientifique, combiné |
| **Racines carrées** | Calcul avec racines | Carrés parfaits, simplification, expression conjuguée, fraction conjuguée |

#### Phase 3 - Second Degré (3 modules)

| Module | Description | Types d'exercices |
|--------|-------------|-------------------|
| **Équations 2nd degré** | Résolution d'équations ax²+bx+c=0 | Discriminant, forme canonique, équations particulières, somme-produit |
| **Inéquations 2nd degré** | Résolution d'inéquations | Tableau de signes, ensemble solution, graphique interactif Canvas |
| **Systèmes d'équations** | Systèmes linéaires 2×2 | Méthode par substitution, méthode par combinaison |

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
├── index.html              # Équations du 1er degré (landing page)
├── developpement.html      # Développement d'expressions
├── reduction.html          # Réduction d'expressions
├── factorisation.html      # Factorisation
├── inequations.html        # Inéquations du 1er degré
├── fractions.html          # Fractions
├── pourcentages.html       # Pourcentages
├── puissances.html         # Puissances
├── racines.html            # Racines carrées
├── equations2.html         # Équations du 2nd degré
├── inequations2.html       # Inéquations du 2nd degré
├── systemes.html           # Systèmes d'équations linéaires
├── template.html           # Template pour nouvelles pages
│
├── css/
│   ├── theme.css           # Variables CSS (couleurs, espacements)
│   ├── base.css            # Reset, typographie
│   ├── layout.css          # Navigation, cards, grilles
│   ├── exercices.css       # Styles communs exercices
│   ├── equations2.css      # Styles équations/inéquations 2nd degré
│   ├── puissances.css      # Styles spécifiques puissances
│   └── racines.css         # Styles spécifiques racines
│
├── js/
│   ├── utils.js            # Fonctions utilitaires (PGCD, formatage...)
│   ├── ui.js               # Manipulation DOM
│   ├── main.js             # Initialisation globale
│   ├── navigation.js       # Génération navigation (factorisation)
│   ├── graphing.js         # Module graphiques Canvas (paraboles)
│   ├── equations.js        # Logique équations 1er degré
│   ├── developpement.js    # Logique développement
│   ├── reduction.js        # Logique réduction
│   ├── factorisation.js    # Logique factorisation
│   ├── inequations.js      # Logique inéquations 1er degré
│   ├── fractions.js        # Logique fractions
│   ├── pourcentages.js     # Logique pourcentages
│   ├── puissances.js       # Logique puissances
│   ├── racines.js          # Logique racines carrées
│   ├── equations2.js       # Logique équations 2nd degré
│   ├── inequations2.js     # Logique inéquations 2nd degré
│   └── systemes.js         # Logique systèmes d'équations
│
├── tests/
│   ├── *.test.js           # Tests unitaires pour chaque module
│   └── utils.test.js       # Tests utilitaires
│
├── CLAUDE.md               # Guide pour assistants IA
├── ROADMAP.md              # Plan de développement
├── NAVIGATION-REFACTOR.md  # Documentation factorisation navigation
└── README.md               # Ce fichier
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

### ✅ Phase 1 - Algèbre de Base (Complète)
- [x] Équations du 1er degré
- [x] Développement d'expressions
- [x] Réduction d'expressions
- [x] Factorisation
- [x] Inéquations du 1er degré

### ✅ Phase 2 - Calculs Numériques (Complète)
- [x] Fractions (6 types d'exercices)
- [x] Pourcentages (5 types d'exercices)
- [x] Puissances (6 types d'exercices)
- [x] Racines carrées (6 types d'exercices)

### ✅ Phase 3 - Second Degré (Complète)
- [x] Équations du 2nd degré (discriminant, canonique, particulières, somme-produit)
- [x] Inéquations du 2nd degré (tableau de signes, graphiques Canvas)
- [x] Systèmes d'équations linéaires 2×2 (substitution, combinaison)
- [x] Module de graphiques Canvas réutilisable (paraboles, racines, zones)

### 📋 Phases Futures
- Phase 4 : Fonctions (affines, polynômes, dérivées)
- Phase 5 : Géométrie analytique (vecteurs, droites)
- Phase 6 : Suites et analyse
- Phase 7 : Probabilités et statistiques
- Phase 8 : Nombres complexes et avancé

📖 Voir [ROADMAP.md](ROADMAP.md) pour le détail complet.

---

## 🛠️ Stack Technique

| Technologie | Utilisation |
|-------------|-------------|
| HTML5 | Structure des pages |
| CSS3 | Styles, variables CSS, responsive |
| JavaScript (ES6+) | Logique, génération, DOM |
| Canvas API | Graphiques (paraboles, fonctions) |
| SVG | Flèches de distributivité |
| Jest | Tests unitaires (optionnel) |

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

