# 🤖 CLAUDE.md - Guide pour Assistants IA

> Documentation pour les sessions futures avec Claude ou autres assistants IA

**Dernière mise à jour**: 5 Février 2026
**Version projet**: v1.4 (Suites Numériques)

---

## 📋 Vue d'Ensemble du Projet

**MathsFacile** est une plateforme d'entraînement en mathématiques pour l'enseignement secondaire français (collège/lycée). Génération illimitée d'exercices avec solutions détaillées étape par étape.

### Principes Fondamentaux
- ✅ **Zéro dépendance** (sauf KaTeX via CDN pour rendu mathématique)
- ✅ **Vanilla JavaScript** (ES6+)
- ✅ **Fonctionne hors-ligne** (après téléchargement)
- ✅ **Responsive** (mobile, tablette, desktop)
- ✅ **Pédagogique** (chaque étape expliquée)
- ✅ **Léger et rapide** (chargement instantané)

### Stack Technique
| Technologie | Usage |
|-------------|-------|
| HTML5 | Structure |
| CSS3 | Styles, variables CSS, responsive |
| JavaScript ES6+ | Logique, génération, DOM |
| Canvas API | Graphiques (paraboles, fonctions) |
| KaTeX (CDN) | Rendu mathématique (fractions, racines) |
| SVG | Flèches de distributivité (optionnel) |

---

## 📂 Architecture du Projet

### Structure des Fichiers

```
Website_Math/
├── *.html (18 fichiers)        # Pages des modules
├── css/
│   ├── theme.css               # Variables CSS (couleurs, espacements)
│   ├── base.css                # Reset, typographie, formulaires
│   ├── layout.css              # Container, cards, grilles, .param-row
│   ├── navigation.css          # Navigation responsive + hamburger
│   ├── exercices.css           # Styles communs exercices (type-selector, steps, etc.)
│   ├── equations2.css          # Tableaux de signes, fractions, variation tables
│   ├── developpement.css       # Flèches SVG distributivité
│   ├── puissances.css          # Notation scientifique
│   └── racines.css             # (optionnel)
│
├── js/
│   ├── utils.js                # PGCD, formatage nombres, utilitaires
│   ├── ui.js                   # Manipulation DOM (show/hide)
│   ├── main.js                 # Initialisation globale
│   ├── navigation.js           # ⚠️ GÉNÉRATION NAVIGATION (injection)
│   ├── graphing.js             # GraphCanvas (paraboles, droites)
│   ├── tableau-variations.js   # Tableaux de variations dynamiques
│   │
│   └── [MODULE].js (16 fichiers) # Logique de chaque module
│       ├── equations.js
│       ├── developpement.js
│       ├── reduction.js
│       ├── factorisation.js
│       ├── inequations.js
│       ├── equations2.js
│       ├── inequations2.js
│       ├── systemes.js
│       ├── fractions.js
│       ├── pourcentages.js
│       ├── puissances.js
│       ├── racines.js
│       ├── fonctions-affines.js
│       ├── fonctions-second-degre.js
│       ├── derivees.js
│       └── suites.js
│
├── README.md
├── ROADMAP.md
├── CLAUDE.md (ce fichier)
└── NAVIGATION-REFACTOR.md
```

---

## 🏗️ Anatomie d'un Module

Chaque module suit cette structure standardisée:

### 1. Fichier HTML (`[module].html`)

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MathsFacile - [Nom Module]</title>

    <!-- KaTeX (si nécessaire pour fractions/racines) -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"
          integrity="sha384-n8MVd4RsNIU0tAv4ct0nTaAbDJwPJzDEaqSD1odI+WdtXRGWt2kTvGFasHpSy3SV"
          crossorigin="anonymous">
    <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"
            integrity="sha384-XjKyOOlGwcjNTAIQHIpgOno0Hl1YQqzUOEleOLALmuqehneUG+vnGctmUb0ZY0l8"
            crossorigin="anonymous"></script>

    <!-- CSS -->
    <link rel="stylesheet" href="css/theme.css">
    <link rel="stylesheet" href="css/base.css">
    <link rel="stylesheet" href="css/layout.css">
    <link rel="stylesheet" href="css/navigation.css">
    <link rel="stylesheet" href="css/exercices.css">
    <link rel="stylesheet" href="css/equations2.css"> <!-- si tableaux/graphiques -->
</head>
<body>
    <!-- ⚠️ IMPORTANT: Navigation injectée par navigation.js -->
    <!-- Elle s'insère AVANT .container, pas dedans -->

    <div class="container">
        <!-- TITRE -->
        <header class="page-header">
            <h1>🔢 [Titre Module]</h1>
            <p>[Description courte]</p>
        </header>

        <!-- TYPES D'EXERCICES -->
        <div class="card">
            <h2>Type d'exercice</h2>
            <div class="type-selector grid-2"> <!-- ou grid-3 -->
                <button class="type-btn active" data-type="type1">
                    <div class="example">exemple</div>
                    <div class="label">Nom Type</div>
                </button>
                <!-- ... autres boutons -->
            </div>
        </div>

        <!-- ⚠️ IMPORTANT: TOUT dans UNE SEULE card dans l'ordre suivant -->
        <div class="card">
            <!-- 1. Type selector TOUJOURS en premier -->
            <!-- 2. Paramètres conditionnels EN DESSOUS -->
            <!-- 3. Expression display EN BAS (centré avec fond gris) -->
            <!-- 4. Boutons d'action TOUT EN BAS -->

            <!-- PARAMÈTRES (sections conditionnelles) -->
            <div id="section1">
                <h3>📊 [Titre Section]</h3>
                <div class="param-row">
                    <label>Paramètre :</label>
                    <input type="number" id="param1" value="5">
                </div>
                <!-- ... autres params -->
            </div>

            <!-- AFFICHAGE EXERCICE (avec fond gris, centré) -->
            <div class="expression-display">
                <div class="expression" id="exerciseDisplay"></div>
            </div>

            <!-- BOUTONS D'ACTION -->
            <div class="action-buttons">
                <button id="generateBtn" class="btn-generate">Nouvel exercice</button>
                <button id="solveBtn" class="btn-solve">Voir la solution</button>
            </div>
        </div>

        <!-- SOLUTION -->
        <div id="solutionDiv" class="solution card"></div>
    </div>

    <!-- Scripts -->
    <script src="js/utils.js"></script>
    <script src="js/ui.js"></script>
    <script src="js/navigation.js"></script>
    <script src="js/graphing.js"></script> <!-- si graphiques -->
    <script src="js/[module].js"></script>
</body>
</html>
```

### 2. Fichier JavaScript (`js/[module].js`)

**Pattern standardisé**:

```javascript
/* ========================================
   [MODULE].JS - [Description]
   ======================================== */

/**
 * État du module
 */
const [Module]State = {
    currentType: 'type1',
    param1: 5,
    param2: 10,
    // ... autres paramètres
};

/**
 * Initialise la page [module]
 */
function init[Module]Page() {
    setupTypeButtons();
    setupInputHandlers();
    setupActionButtons();
    updateExerciseDisplay();
}

/**
 * Configure les boutons de type
 */
function setupTypeButtons() {
    const typeButtons = document.querySelectorAll('.type-btn');
    typeButtons.forEach(button => {
        button.addEventListener('click', () => {
            typeButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            [Module]State.currentType = button.dataset.type;
            updateExerciseDisplay();
            hideSolution('solutionDiv');
        });
    });
}

/**
 * Configure les gestionnaires d'événements
 */
function setupInputHandlers() {
    $('param1').addEventListener('input', () => {
        [Module]State.param1 = parseFloat($('param1').value) || 0;
        updateExerciseDisplay();
    });
    // ... autres inputs
}

/**
 * Configure les boutons d'action
 */
function setupActionButtons() {
    $('generateBtn').addEventListener('click', () => {
        generate[Module]();
        updateExerciseDisplay();
        hideSolution('solutionDiv');
    });

    $('solveBtn').addEventListener('click', () => {
        solve[Module]();
    });
}

/**
 * Met à jour l'affichage de l'exercice
 */
function updateExerciseDisplay() {
    let display = '';
    const sections = document.querySelectorAll('.card[id$="Section"]');
    sections.forEach(s => s.style.display = 'none');

    switch ([Module]State.currentType) {
        case 'type1':
            $('section1').style.display = 'block';
            display = `[formule]`;
            break;
        // ... autres types
    }

    $('exerciseDisplay').innerHTML = display; // ⚠️ innerHTML pour KaTeX
}

/**
 * Génère un nouvel exercice
 */
function generate[Module]() {
    // Logique de génération aléatoire
}

/**
 * Résout l'exercice courant
 */
function solve[Module]() {
    let html = '<h3>✅ Solution</h3>';

    switch ([Module]State.currentType) {
        case 'type1':
            html += solveType1();
            break;
        // ... autres types
    }

    $('solutionDiv').innerHTML = html;
    showSolution('solutionDiv');
}

/**
 * Résout exercice de type 1
 */
function solveType1() {
    let html = '';
    html += '<div class="step">';
    html += '<div class="step-number">📍 Étape 1</div>';
    html += '<div class="step-expression">formule</div>';
    html += '<div class="step-explanation">explication</div>';
    html += '</div>';
    // ... autres étapes
    html += '<div class="result-highlight">';
    html += '<div class="final">Résultat final</div>';
    html += '</div>';
    return html;
}

// Utilitaires du module
function formatNumber(n) {
    // Formatage spécifique au module
}

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', () => {
    init[Module]Page();
});
```

---

## 🎨 Conventions de Code

### JavaScript

#### Nommage
- **Variables d'état**: `[Module]State` (ex: `SuitesState`, `EquationsState`)
- **Fonctions init**: `init[Module]Page()`
- **Fonctions solve**: `solve[Module]()`
- **Éléments DOM**: `$('elementId')` (raccourci pour `document.getElementById`)

#### Formatage Mathématique
```javascript
// ❌ ÉVITER (texte brut)
display = "u_n = 5 + 3n";

// ✅ PRÉFÉRER (HTML avec indices/exposants)
display = `u<sub>n</sub> = 5 + 3n`;

// ✅ AVEC KATEX (fractions, racines)
display = katex.renderToString("\\frac{a}{b}", { throwOnError: false });

// ✅ Helper functions
function formatFraction(num, den) {
    return katex.renderToString(`\\frac{${num}}{${den}}`, { throwOnError: false });
}

function formatSqrt(content) {
    return katex.renderToString(`\\sqrt{${content}}`, { throwOnError: false });
}
```

#### Gestion Signes
```javascript
// ✅ Gérer correctement les signes négatifs
const r = -3;
const sign = r >= 0 ? '+' : '-';
display = `${u0} ${sign} ${Math.abs(r)}n`; // "5 - 3n" au lieu de "5 + -3n"
```

### HTML

#### Classes Importantes
- `.type-selector` + `.grid-2` ou `.grid-3` : Grille de boutons
- `.type-btn` : Bouton de type d'exercice
- `.param-row` : Ligne paramètre (label + input/select)
- `.expression-display` : Affichage exercice
- `.solution` : Conteneur solution
- `.step` : Étape de solution
- `.step-number` : Numéro d'étape
- `.step-expression` : Formule/expression
- `.step-explanation` : Explication textuelle
- `.result-highlight` : Résultat final en évidence

#### Attributs data
```html
<button class="type-btn" data-type="arithmetique">
```

### CSS

#### Variables (theme.css)
```css
--primary: #667eea;
--secondary: #764ba2;
--success: #48bb78;
--warning: #ed8936;
--gray-100, --gray-200, ..., --gray-800
--spacing-xs, --spacing-sm, --spacing-md, --spacing-lg, --spacing-xl
--radius-sm, --radius-md, --radius-lg, --radius-xl
```

#### Responsive
- Desktop: > 768px
- Mobile: ≤ 768px
- Très petit: ≤ 400px

---

## ⚠️ Problèmes Connus et Solutions

### 1. Navigation Tronquée

**Symptôme**: Texte "Suites Numériques" tronqué dans le menu dropdown

**Cause**:
- Injection navigation DANS `.container` au lieu d'AVANT
- `min-width` insuffisant sur `.nav-dropdown`

**Solution** (déjà appliquée):
```javascript
// ✅ js/navigation.js ligne 80
document.body.insertAdjacentHTML('afterbegin', navHTML);
// Au lieu de: container.insertAdjacentHTML('afterbegin', navHTML);
```

```css
/* ✅ css/navigation.css ligne 116 */
.nav-dropdown {
    width: max-content;
    min-width: 200px;
}
```

### 2. KaTeX Double Affichage

**Symptôme**: Racines carrées affichées en double

**Cause**: Conflit entre CSS `.sqrt::before` et KaTeX

**Solution**:
```css
/* ❌ Désactiver dans css/equations2.css */
/* .sqrt { ... } */
/* .sqrt::before { content: "√"; } */
```

### 3. innerHTML vs textContent

**Règle**:
- `innerHTML` pour affichage exercice (permet KaTeX HTML)
- `textContent` pour inputs utilisateur (sécurité)

```javascript
// ✅ Affichage
$('exerciseDisplay').innerHTML = display;

// ✅ Solution
$('solutionDiv').innerHTML = html;
```

### 4. Variation Tables Alignment

**Problème résolu**: Alignement vertical basé sur direction flèche, pas nature point

```javascript
// ✅ tableau-variations.js
const v_align = signes_derivee[i] === '+' ? 'var-v-align-bottom' : 'var-v-align-top';
```

### 5. Structure HTML Incohérente ⚠️ CRITIQUE

**Symptôme**: Paramètres placés APRÈS l'expression display au lieu d'AVANT

**Pourquoi c'est important**:
- Cohérence visuelle entre TOUS les modules
- Ordre logique: choisir type → régler paramètres → voir expression → résoudre
- Utilisateur s'attend à même UX partout

**Règle ABSOLUE** (à ne JAMAIS modifier):
```html
<!-- ✅ STRUCTURE CORRECTE - UNE SEULE card -->
<div class="card">
    <!-- 1️⃣ Type selector EN PREMIER -->
    <div class="type-selector grid-2">
        <button class="type-btn active" data-type="type1">...</button>
    </div>

    <!-- 2️⃣ Paramètres conditionnels EN DESSOUS -->
    <div id="section1">
        <h3>📊 Titre</h3>
        <div class="param-row">...</div>
    </div>

    <!-- 3️⃣ Expression display APRÈS paramètres -->
    <div class="expression-display">
        <div class="expression" id="exerciseDisplay">...</div>
    </div>

    <!-- 4️⃣ Boutons action TOUT EN BAS -->
    <div class="action-buttons">
        <button id="generateBtn">...</button>
        <button id="solveBtn">...</button>
    </div>
</div>

<!-- ❌ JAMAIS faire des cards séparées pour chaque section -->
<!-- ❌ JAMAIS mettre expression display AVANT les paramètres -->
```

**Notes importantes**:
- Sections de paramètres: `<div id="sectionX">` (PAS `class="card"`)
- Expression display: utilise classe `.expression-display` (fond gris, centré)
- Boutons: `<div class="action-buttons">` (PAS `class="card action-buttons"`)
- Tout dans **UNE SEULE card** parent

---

## 🔧 Comment Ajouter un Nouveau Module

### Checklist Complète

#### 1. Créer les Fichiers
- [ ] `[module].html` (copier template)
- [ ] `js/[module].js` (suivre pattern State)

#### 2. HTML
- [ ] Titre + description
- [ ] Boutons types (`.type-selector .grid-2`)
- [ ] Sections paramètres (`.param-row`)
- [ ] Affichage exercice (`.expression-display`)
- [ ] Boutons action
- [ ] Div solution
- [ ] Scripts: utils, ui, navigation, [module].js
- [ ] KaTeX CDN si fractions/racines

#### 3. JavaScript
- [ ] Définir `[Module]State`
- [ ] `init[Module]Page()`
- [ ] `setupTypeButtons()`
- [ ] `setupInputHandlers()`
- [ ] `setupActionButtons()`
- [ ] `updateExerciseDisplay()`
- [ ] `generate[Module]()`
- [ ] `solve[Module]()`
- [ ] Fonctions `solveTypeX()` pour chaque type
- [ ] DOMContentLoaded listener

#### 4. CSS (si nécessaire)
- [ ] Ajouter styles spécifiques dans nouveau fichier CSS
- [ ] Ou utiliser classes existantes

#### 5. Navigation
- [ ] Ajouter dans `js/navigation.js` (fonction `generateNavigation`)
- [ ] Catégorie appropriée (Algèbre, Calculs, Fonctions, Suites)
- [ ] Tester que le lien active la classe `.active`

#### 6. Tests
- [ ] Tester tous les types d'exercices
- [ ] Vérifier responsive (mobile/desktop)
- [ ] Vérifier affichage KaTeX si utilisé
- [ ] Tester génération aléatoire
- [ ] Vérifier solutions étape par étape

---

## 📊 Modules Actuels (16)

### Algèbre (8 modules)
1. **Équations** (`index.html`) - 1er degré
2. **Développement** - Identités remarquables
3. **Réduction** - Simplification expressions
4. **Factorisation** - Facteur commun + identités
5. **Inéquations** - 1er degré
6. **Équations 2nd degré** - Discriminant, canonique
7. **Inéquations 2nd degré** - Tableau signes
8. **Systèmes** - 2×2 substitution/combinaison

### Calculs (4 modules)
9. **Fractions** - 6 types (add, sub, mul, div, simplify, inverse)
10. **Pourcentages** - 5 types
11. **Puissances** - 6 types
12. **Racines** - 6 types

### Fonctions (3 modules)
13. **Fonctions Affines** - 5 types (graphique, image, antécédent, équation, intersection)
14. **Fonctions 2nd degré** - 5 types (graphique, canonique, sommet, variations, extremum)
15. **Dérivées** - 6 types (polynomiale, produit, quotient, composition, tangente, variations)

### Suites (1 module)
16. **Suites Numériques** - 5 types (arithmétique, géométrique, somme arith, somme géo, variation)

---

## 🎯 Préférences de Style (Important!)

### Communication
- ❌ **PAS d'emojis** dans le code (sauf si utilisateur demande explicitement)
- ✅ Texte clair et concis
- ✅ Commentaires en français

### Développement
- ✅ Toujours LIRE un fichier avant de le modifier
- ✅ Utiliser Edit (pas Write) pour fichiers existants
- ✅ Préférer outils spécialisés à bash (Read au lieu de cat, Edit au lieu de sed)
- ✅ Commits clairs avec format: `fix:`, `feat:`, `refactor:`

### Math Rendering
- ✅ KaTeX pour fractions et racines
- ✅ HTML `<sub>` `<sup>` pour indices/exposants simples
- ✅ Formatage propre: "5 - 3n" pas "5 + -3n"
- ✅ Fractions visuelles KaTeX au lieu de "a/b"

### Architecture
- ✅ Navigation injectée AVANT `.container`
- ✅ Pattern State pour chaque module
- ✅ Pas de duplication de code
- ✅ GraphCanvas réutilisable pour graphiques
- ✅ CSS modulaire (theme, base, layout, navigation, exercices)
- ⚠️ **JAMAIS prendre de libertés de design sans vérifier les modules existants**
  - Toujours COMPARER avec index.html, equations2.html ou fonctions-affines.html
  - Structure HTML doit être IDENTIQUE entre tous les modules
  - Ordre: type-selector → paramètres → expression-display → boutons
  - Si incertain, DEMANDER avant de créer une nouvelle structure

---

## 📚 Ressources et Helpers

### Fonctions Utilitaires (utils.js)

```javascript
// PGCD
function pgcd(a, b)

// Formatage
function formatNumber(n) // Affiche nombres avec maximum 2 décimales

// Simplification fraction
function simplifyFraction(num, den)

// Helpers (ui.js)
function $(id) // Raccourci document.getElementById
function show(element)
function hide(element)
function showSolution(divId)
function hideSolution(divId)
```

### GraphCanvas (graphing.js)

```javascript
// Créer graphique
const graph = new GraphCanvas(canvasId, {
    xMin: -5, xMax: 5,
    yMin: -10, yMax: 10,
    gridStep: 1
});

// Tracer parabole
graph.plotParabola(a, b, c, options);

// Tracer droite
graph.plotLine(slope, intercept, options);

// Marquer point
graph.plotPoint(x, y, label, color);
```

### Tableau Variations (tableau-variations.js)

```javascript
// Créer tableau
const tableau = createTableauVariations(containerId, {
    points: [
        { x: '-∞', nature: 'limite' },
        { x: '2', nature: 'zero', f_value: '0' },
        { x: '+∞', nature: 'limite' }
    ],
    signes_derivee: ['+', '-'],
    f_variations: ['↗', '4', '↘']
});
```

---

## 🚀 Roadmap Actuelle

### ✅ Complété (v1.4)
- 16 modules fonctionnels
- Navigation responsive
- KaTeX intégré
- GraphCanvas
- Tableaux variations
- Module Suites Numériques

### 🔜 Prochaines Étapes Prioritaires

1. **Limites** (Terminale) - 4-5 types
2. **Primitives** (Terminale) - 4-5 types
3. **Exponentielles/Logarithmes** (Terminale) - 6-8 types
4. **Probabilités** (Seconde/Première) - 5-6 types
5. **Statistiques** (Seconde/Première) - 4-5 types
6. **Trigonométrie** (Seconde/Première) - 5-6 types
7. **Vecteurs** (Seconde/Première) - 4-5 types

### 🔧 Améliorations Techniques Futures
- Tests automatisés (Jest)
- Mode sombre
- Sauvegarde progression (localStorage)
- Export PDF des solutions
- Graphiques 3D (WebGL)
- Mode entraînement chronométré

---

## 💡 Conseils pour Futures Sessions

### Avant de Modifier du Code
1. ✅ Lire CLAUDE.md (ce fichier)
2. ✅ Lire le fichier avant modification
3. ✅ Comprendre le pattern State
4. ✅ Vérifier navigation.js synchronisé
5. ✅ Tester responsive

### Debugging Checklist
- Navigation tronquée → Vérifier width: max-content
- KaTeX double → Vérifier CSS .sqrt désactivé
- Layout cassé → Vérifier injection navigation
- Formules moches → Utiliser KaTeX ou <sub><sup>
- Signes négatifs → Gérer avec Math.abs() et signe séparé

### Git Workflow
```bash
git status
git add [files]
git commit -m "type: description"
git push -u origin [branch]
```

Types: `feat`, `fix`, `refactor`, `style`, `docs`, `test`

---

## 📞 Contact

Pour questions ou améliorations futures, référez-vous à ce document et aux fichiers:
- `README.md` - Documentation utilisateur
- `ROADMAP.md` - Plan de développement
- `NAVIGATION-REFACTOR.md` - Documentation factorisation navigation

**Fin de CLAUDE.md**
