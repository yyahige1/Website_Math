# 🤖 CLAUDE.md - AI Assistant Guide for MathsFacile

**Purpose**: This document helps AI assistants (like Claude) understand the MathsFacile codebase structure, development workflows, and conventions to provide effective assistance.

**Last Updated**: January 2025
**Project Version**: 1.0 (Phase 1 complete, Phase 2 in progress)

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Codebase Architecture](#codebase-architecture)
3. [Tech Stack & Dependencies](#tech-stack--dependencies)
4. [Code Conventions](#code-conventions)
5. [Module Structure](#module-structure)
6. [Development Workflow](#development-workflow)
7. [Testing Strategy](#testing-strategy)
8. [Common Tasks](#common-tasks)
9. [File Organization](#file-organization)
10. [Important Patterns](#important-patterns)
11. [What NOT to Do](#what-not-to-do)

---

## 🎯 Project Overview

### What is MathsFacile?

MathsFacile is an interactive mathematics training platform for French secondary education (collège & lycée). It generates unlimited exercises with detailed step-by-step solutions.

### Core Philosophy

- **Infinite Generation**: Random exercise generation ensures unlimited practice
- **Immediate Feedback**: Instant corrections with detailed explanations
- **Visual Learning**: SVG arrows, color-coded terms, number lines
- **Zero Dependencies**: Vanilla JS for maximum portability and simplicity
- **Offline-First**: Works without internet after initial load

### Current Status

| Phase | Status | Modules |
|-------|--------|---------|
| Phase 1 - Algèbre de Base | ✅ Complete | 5/5 modules |
| Phase 2 - Calculs Numériques | ✅ Complete | 4/4 modules |
| Phase 3 - Second Degré | 🔄 In Progress | 0/3 modules |
| Phase 4+ | 📋 Planned | See ROADMAP.md |

**Available Modules**: Équations, Développement, Réduction, Factorisation, Inéquations, Fractions, Pourcentages, Puissances, Racines carrées (9 modules total)

---

## 🏗️ Codebase Architecture

### High-Level Structure

```
Website_Math/
├── index.html              # Équations module (landing page)
├── {module}.html           # One HTML file per module (9 modules)
│   ├── developpement.html
│   ├── reduction.html
│   ├── factorisation.html
│   ├── inequations.html
│   ├── fractions.html
│   ├── pourcentages.html
│   ├── puissances.html
│   └── racines.html
├── css/
│   ├── theme.css           # CSS variables (colors, spacing, fonts)
│   ├── base.css            # Reset, typography, base styles
│   ├── layout.css          # Navigation, cards, grids, responsive
│   ├── exercices.css       # Exercise-specific styles (common)
│   ├── puissances.css      # Module-specific styles for puissances
│   └── racines.css         # Module-specific styles for racines
├── js/
│   ├── utils.js            # Pure utility functions (PGCD, formatting, random)
│   ├── ui.js               # DOM manipulation helpers
│   ├── main.js             # Global initialization (not always used)
│   └── {module}.js         # Module-specific logic (9 modules)
├── tests/
│   └── {module}.test.js    # Jest unit tests (10 test files)
├── CLAUDE.md               # This file - AI assistant guide
├── README.md               # User-facing documentation
├── ROADMAP.md              # Development roadmap
├── git_guide.md            # Git workflow guide
└── package.json            # Jest configuration only (no runtime deps)
```

### Architecture Principles

1. **No Build Process**: Direct HTML/CSS/JS - open in browser immediately
2. **Modular Design**: Each math topic is a standalone module
3. **Shared Utilities**: Common functions in utils.js, UI helpers in ui.js
4. **Pure Functions**: Logic separated from DOM manipulation
5. **Progressive Enhancement**: Core functionality works everywhere

---

## 🛠️ Tech Stack & Dependencies

### Production Code

| Technology | Usage | Version |
|------------|-------|---------|
| HTML5 | Structure | N/A |
| CSS3 | Styling (variables, flexbox, grid) | N/A |
| JavaScript | Logic (ES6+) | ES2015+ |
| SVG | Dynamic arrows, visualizations | N/A |

**Zero Production Dependencies** - No frameworks, no libraries, no build step.

### Development Tools

| Tool | Purpose | Version |
|------|---------|---------|
| Jest | Unit testing | ^29.7.0 |
| Git | Version control | Any recent |

### Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ features used (arrow functions, destructuring, template literals)
- No polyfills - assumes modern JS support

---

## 📐 Code Conventions

### JavaScript Style

#### Naming Conventions

```javascript
// Functions: camelCase, verb prefix
function generateEquation() { }
function solveEquationType1() { }
function updateDisplay() { }

// Variables: camelCase, descriptive
const currentType = 'type1';
const coefficients = [1, 2, 3];

// Constants: UPPER_SNAKE_CASE (if truly constant)
const MAX_COEFFICIENT = 10;

// State objects: PascalCase + "State" suffix
const EquationsState = { currentType: 'type1' };
```

#### Function Organization

```javascript
/* ========================================
   MODULE.JS - Description
   ======================================== */

/**
 * JSDoc comment for important functions
 * @param {number} a - Description
 * @returns {Object}
 */
function functionName(a) {
    // Implementation
}
```

#### Pure vs. Impure Functions

```javascript
// ✅ PURE: utils.js - No side effects, no DOM access
function gcd(a, b) {
    // Pure math logic
    return result;
}

// ✅ IMPURE: module.js - Can modify DOM, has side effects
function updateDisplay() {
    document.getElementById('result').textContent = '...';
}
```

### HTML Conventions

#### ID vs. Class

```html
<!-- IDs: Unique elements accessed by JS -->
<div id="solutionDiv"></div>
<input type="number" id="a1">

<!-- Classes: Styling and behavior groups -->
<button class="type-btn active" data-type="type1"></button>
<div class="coefficients hidden"></div>
```

#### Data Attributes

```html
<!-- Use data-* for state/type information -->
<button data-type="type1"></button>
<div data-difficulty="easy"></div>
```

### CSS Conventions

#### File Separation

- `theme.css`: CSS variables only (colors, spacing, fonts)
- `base.css`: Reset, typography, base element styles
- `layout.css`: Navigation, cards, grids, responsive layout
- `exercices.css`: Exercise-specific styles shared across modules
- `{module}.css`: Module-specific styles (only if needed)

#### Naming Pattern

```css
/* Utility classes: lowercase with hyphens */
.hidden { display: none; }
.show { opacity: 1; }

/* BEM-style for complex components */
.type-selector { }
.type-btn { }
.type-btn.active { }

/* Descriptive, semantic names */
.solution-box { }
.coefficient-input { }
```

### Commit Message Format

```
type: Short description (max 50 chars)

Optional longer explanation
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code restructuring
- `style`: CSS/formatting
- `docs`: Documentation
- `test`: Tests
- `chore`: Maintenance

**Examples**:
```bash
feat: add fractions module
fix: handle division by zero in equations
refactor: simplify random generation logic
style: improve mobile responsiveness
docs: update README with new modules
test: add unit tests for factorisation
```

---

## 🧩 Module Structure

### Typical Module Files

Each math module typically consists of:

1. **HTML file** (`{module}.html`): Structure, inputs, buttons
2. **JS file** (`js/{module}.js`): Logic, generation, solving
3. **Test file** (`tests/{module}.test.js`): Jest unit tests
4. **CSS file** (optional): Only if module needs unique styles

### Module Template Pattern

```javascript
/* ========================================
   {MODULE}.JS - Module description
   ======================================== */

/**
 * Module state (if needed)
 */
const {Module}State = {
    currentType: 'default',
    // ... other state
};

/**
 * Get input values
 * @returns {Object}
 */
function get{Module}Values() {
    return {
        // Extract from inputs
    };
}

/**
 * Update display
 */
function update{Module}Display() {
    const values = get{Module}Values();
    // Update DOM
    hideSolution();
}

/**
 * Generate random exercise
 */
function generate{Module}() {
    // Set random values
    update{Module}Display();
}

/**
 * Solve and show solution
 */
function solve{Module}() {
    const values = get{Module}Values();
    let html = '';

    // Solve logic
    // Build HTML with steps

    updateHTML('solutionDiv', html);
    showSolution();
}

/**
 * Initialize module
 */
function init{Module}() {
    // Event listeners
    // Initial generation
}

// Initialize on page load
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', init{Module});
}
```

### Common Module Elements

#### Type Selector (Multiple Exercise Types)

```html
<div class="type-selector">
    <button class="type-btn active" data-type="type1">
        <div class="example">Example formula</div>
        <div class="label">Description</div>
    </button>
</div>
```

```javascript
initTypeSelector('.type-btn', (type) => {
    ModuleState.currentType = type;
    updateDisplay();
});
```

#### Coefficient Inputs

```html
<div class="coefficients" id="coeffType1">
    <div class="coef-group">
        <label>a</label>
        <input type="number" id="a1" value="2">
    </div>
</div>
```

#### Action Buttons

```html
<div class="buttons">
    <button onclick="generate{Module}()">🎲 Aléatoire</button>
    <button onclick="solve{Module}()" class="btn-primary">✓ Correction</button>
</div>
```

#### Solution Display

```html
<div class="solution-container" id="solutionDiv">
    <h2>📝 Correction détaillée</h2>
    <div id="solutionSteps"></div>
</div>
```

---

## 🔄 Development Workflow

### Branch Strategy

- **Main branch**: Stable, production-ready code
- **Feature branches**: `feature/{feature-name}` or `feat/{feature-name}`
- **Fix branches**: `fix/{bug-description}`
- **Branch naming**: Use Claude-specific branches when working via Claude Code (e.g., `claude/claude-md-{session-id}`)

### Typical Development Flow

```bash
# 1. Pull latest changes
git pull

# 2. Create feature branch (or use Claude branch)
git checkout -b feature/new-module

# 3. Develop, test, commit frequently
npm test                    # Run tests
git add .
git commit -m "feat: add step 1 of feature"

# 4. When complete, push
git push -u origin feature/new-module

# 5. Create PR (if using GitHub workflow)
```

### Adding a New Module

**Checklist**:

1. ✅ Create `{module}.html` (copy from similar module)
2. ✅ Create `js/{module}.js` with module logic
3. ✅ Create `tests/{module}.test.js` with unit tests
4. ✅ Add navigation link in ALL HTML files
5. ✅ Update README.md with new module
6. ✅ Update ROADMAP.md to mark as complete
7. ✅ Run `npm test` to ensure tests pass
8. ✅ Commit with `feat: add {module} module`

### Making Changes

**Before Editing**:
1. Read existing code first
2. Understand the module's current logic
3. Check for similar patterns in other modules
4. Run tests to ensure baseline passes

**While Editing**:
1. Follow existing code style
2. Keep functions pure when possible
3. Add JSDoc comments for complex functions
4. Update tests if changing logic

**After Editing**:
1. Test manually in browser
2. Run `npm test` to verify unit tests
3. Check all related modules still work
4. Update documentation if needed

---

## 🧪 Testing Strategy

### Test Organization

- **Location**: `tests/{module}.test.js`
- **Framework**: Jest
- **Coverage**: Focus on core logic (pure functions)

### Running Tests

```bash
# Run all tests
npm test

# Watch mode (auto-rerun on changes)
npm run test:watch

# Coverage report
npm run test:coverage
```

### Test Structure

```javascript
describe('Module Name: Description', () => {

    test('specific scenario description', () => {
        // Arrange
        const input = {...};

        // Act
        const result = functionToTest(input);

        // Assert
        expect(result.property).toBe(expected);
    });

    test('edge case description', () => {
        // Test edge cases (zero, negative, infinite, etc.)
    });
});
```

### What to Test

✅ **DO Test**:
- Pure functions (utils.js functions)
- Core solving logic
- Edge cases (division by zero, infinite solutions)
- Mathematical correctness

❌ **DON'T Test**:
- DOM manipulation (difficult to test, verify manually)
- UI interactions (visual verification)
- Random generation (non-deterministic)

### Test Examples

```javascript
// Testing pure utility function
test('gcd calculates correctly', () => {
    expect(gcd(12, 8)).toBe(4);
    expect(gcd(7, 5)).toBe(1);
});

// Testing solving logic
test('solves equation with integer solution', () => {
    const result = solveEquationType1(2, 3, 7);
    expect(result.hasSolution).toBe(true);
    expect(result.value).toBe(2);
});

// Testing edge case
test('handles division by zero', () => {
    const result = solveEquationType1(0, 3, 3);
    expect(result.isInfinite).toBe(true);
});
```

---

## 📝 Common Tasks

### Task 1: Fix a Bug

```bash
# 1. Reproduce the bug
# 2. Read the relevant module code
# 3. Check tests for existing coverage
# 4. Fix the bug
# 5. Add/update tests
# 6. Verify manually
npm test
# 7. Commit
git add .
git commit -m "fix: handle edge case in {module}"
git push
```

### Task 2: Add New Exercise Type to Existing Module

**Steps**:
1. Add new button in HTML type selector
2. Add new coefficient inputs (hidden by default)
3. Update `get{Module}Values()` to handle new type
4. Update `update{Module}Display()` for new format
5. Add generation logic in `generate{Module}()`
6. Add solving logic in `solve{Module}()`
7. Add tests for new type
8. Commit: `feat({module}): add {type} exercise type`

### Task 3: Improve Styling

**Steps**:
1. Identify which CSS file to edit:
   - Theme changes → `theme.css`
   - Layout/responsive → `layout.css`
   - Exercise elements → `exercices.css`
   - Module-specific → `{module}.css`
2. Make changes
3. Test on different screen sizes
4. Test in multiple browsers if major change
5. Commit: `style: improve {description}`

### Task 4: Refactor Code

**Before**:
- Ensure tests exist and pass
- Understand current behavior completely

**During**:
- Keep tests passing (run frequently)
- Refactor in small steps
- Don't change behavior, only structure

**After**:
- All tests still pass
- Manual testing confirms no regressions
- Commit: `refactor({module}): {description}`

---

## 📂 File Organization

### js/utils.js

**Purpose**: Pure utility functions used across multiple modules

**Key Functions**:
- `gcd(a, b)`: Calculate greatest common divisor
- `randInt(min, max)`: Random integer
- `randCoef(min, max, allowNegative, avoidZero)`: Random coefficient
- `formatTerm(coef, variable, isFirst)`: Format algebraic term
- `formatNumber(num)`: Format number (round decimals)
- `formatFraction(num, den)`: Simplify and format fraction

**Rules**:
- NO DOM access
- NO side effects
- Pure functions only
- Well-tested

### js/ui.js

**Purpose**: DOM manipulation helpers

**Key Functions**:
- `$(id)`: Shortcut for getElementById
- `showSolution(containerId)`: Show solution with animation
- `hideSolution(containerId)`: Hide solution
- `updateText(elementId, text)`: Update textContent
- `updateHTML(elementId, html)`: Update innerHTML
- `initTypeSelector(selector, callback)`: Initialize type buttons
- `onInputsChange(containerSelector, callback)`: Listen to input changes

**Rules**:
- Can access DOM
- Simple, reusable helpers
- No complex logic
- Used across modules

### js/{module}.js

**Purpose**: Module-specific logic

**Structure**:
1. State object (if needed)
2. Get values function
3. Update display function
4. Generate function
5. Solve function
6. Init function
7. Event listener setup

**Rules**:
- Follow module template pattern
- Separate pure logic from DOM manipulation
- Use utils.js for common operations
- Add JSDoc for complex functions

### css/ files

**theme.css**:
```css
:root {
    /* Colors */
    --color-primary: #3498db;
    /* Spacing */
    --spacing-sm: 0.5rem;
    /* Typography */
    --font-size-base: 16px;
}
```

**base.css**: Reset, typography, base elements

**layout.css**: Navigation, cards, grids, responsive

**exercices.css**: Exercise-specific (buttons, inputs, solutions)

---

## 🎨 Important Patterns

### Pattern 1: Color-Coded Terms

Used in développement, réduction, factorisation modules.

```javascript
// Generate HTML with colored spans
html += `<span class="term term-red">${term}</span>`;
html += `<span class="term term-blue">${term}</span>`;
html += `<span class="term term-green">${term}</span>`;
```

```css
.term-red { color: #e74c3c; }
.term-blue { color: #3498db; }
.term-green { color: #27ae60; }
```

### Pattern 2: Step-by-Step Solution

```javascript
function solveModule() {
    let html = '<div class="steps">';

    // Step 1
    html += '<div class="step">';
    html += '<div class="step-title">Étape 1 : Description</div>';
    html += '<div class="step-content">';
    html += '<div class="math-line">Mathematical expression</div>';
    html += '<div class="explanation">Plain text explanation</div>';
    html += '</div></div>';

    // Step 2, 3, etc.

    // Final result
    html += '<div class="final-result">';
    html += '<strong>Résultat :</strong> x = 2';
    html += '</div>';

    html += '</div>';
    updateHTML('solutionSteps', html);
    showSolution();
}
```

### Pattern 3: Type Switching

```javascript
// HTML buttons with data-type
<button class="type-btn active" data-type="type1"></button>

// Initialize with callback
initTypeSelector('.type-btn', (type) => {
    ModuleState.currentType = type;

    // Show/hide relevant inputs
    document.querySelectorAll('.coefficients').forEach(div => {
        div.classList.add('hidden');
    });
    document.getElementById(`coeff${capitalize(type)}`).classList.remove('hidden');

    updateDisplay();
});
```

### Pattern 4: Random Generation

```javascript
function generateModule() {
    // Set random values in inputs
    $('a').value = randCoef(1, 10, true, true);  // 1-10, allow negative, avoid zero
    $('b').value = randCoef(-10, 10, false, false); // -10 to 10, no negative flag, allow zero

    // Avoid degenerate cases
    let c;
    do {
        c = randCoef(1, 10);
    } while (c === a); // Ensure c ≠ a

    $('c').value = c;

    // Update display
    updateDisplay();
}
```

### Pattern 5: State Management

```javascript
// Simple state object
const ModuleState = {
    currentType: 'type1',
    lastResult: null,
    // Other state
};

// Update state, then update display
function changeType(newType) {
    ModuleState.currentType = newType;
    updateDisplay();
}
```

### Pattern 6: SVG Generation (for arrows, number lines)

```javascript
function createArrow(x1, y1, x2, y2, color) {
    return `
        <svg class="arrow-svg">
            <defs>
                <marker id="arrowhead-${color}" markerWidth="10" markerHeight="10"
                        refX="9" refY="3" orient="auto">
                    <polygon points="0 0, 10 3, 0 6" fill="${color}" />
                </marker>
            </defs>
            <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"
                  stroke="${color}" stroke-width="2"
                  marker-end="url(#arrowhead-${color})" />
        </svg>
    `;
}
```

### Pattern 7: Special Cases Handling

```javascript
// Always check for degenerate cases
function solve(a, b, c) {
    // Check division by zero
    if (a === 0) {
        if (b === c) {
            return { isInfinite: true, message: "Infinité de solutions" };
        } else {
            return { hasSolution: false, message: "Aucune solution" };
        }
    }

    // Normal case
    const x = (c - b) / a;
    return { hasSolution: true, value: x };
}
```

### Pattern 8: Fraction Simplification (Phase 2)

```javascript
// Simplify fractions using GCD
function simplifyFraction(num, den) {
    if (den === 0) {
        return { error: "Division par zéro" };
    }

    const diviseur = gcd(Math.abs(num), Math.abs(den));
    let simpleNum = num / diviseur;
    let simpleDen = den / diviseur;

    // Keep negative in numerator
    if (simpleDen < 0) {
        simpleNum = -simpleNum;
        simpleDen = -simpleDen;
    }

    return { num: simpleNum, den: simpleDen };
}
```

### Pattern 9: Exponent Notation (Phase 2)

```javascript
// Format exponents with <sup> tags
function formatExponent(base, exp) {
    if (exp === 0) return '1';
    if (exp === 1) return base.toString();

    return `${base}<sup>${exp}</sup>`;
}

// Scientific notation
function toScientificNotation(num) {
    if (num === 0) return '0';

    const exp = Math.floor(Math.log10(Math.abs(num)));
    const mantissa = num / Math.pow(10, exp);

    return `${formatNumber(mantissa)} × 10<sup>${exp}</sup>`;
}
```

### Pattern 10: Conjugate Expressions (Phase 2 - Racines)

```javascript
// Generate conjugate for square roots
function getConjugate(a, sqrtB) {
    // For expression: a + √b, conjugate is: a - √b
    // Used in rationalization: 1/(a + √b) = (a - √b)/((a + √b)(a - √b))

    return {
        original: `${a} + √${sqrtB}`,
        conjugate: `${a} - √${sqrtB}`,
        product: a * a - sqrtB  // (a + √b)(a - √b) = a² - b
    };
}
```

---

## ⚠️ What NOT to Do

### Code Quality

❌ **DON'T add frameworks or libraries**
- This is a vanilla JS project by design
- Keep zero production dependencies

❌ **DON'T use jQuery or similar**
- Use native DOM APIs
- Use helper functions from ui.js

❌ **DON'T add a build process**
- No webpack, no babel, no bundlers
- Keep it simple: direct HTML/CSS/JS

❌ **DON'T mix logic and UI**
```javascript
// ❌ BAD: Logic mixed with DOM
function calculate() {
    const a = document.getElementById('a').value;
    const result = a * 2;
    document.getElementById('result').textContent = result;
}

// ✅ GOOD: Separated
function getInputs() {
    return { a: parseFloat($('a').value) };
}
function calculate(inputs) {
    return inputs.a * 2;  // Pure logic
}
function displayResult(result) {
    updateText('result', result);
}
```

### File Organization

❌ **DON'T create new folders**
- HTML files at root
- JS in js/ folder
- CSS in css/ folder
- Tests in tests/ folder

❌ **DON'T split modules into multiple files**
- One module = one .js file
- Exception: utils.js and ui.js (shared)

❌ **DON'T duplicate code from utils.js**
- Reuse existing utility functions
- Add to utils.js if needed across modules

### Styling

❌ **DON'T use inline styles**
```html
<!-- ❌ BAD -->
<div style="color: red;">Text</div>

<!-- ✅ GOOD -->
<div class="error-text">Text</div>
```

❌ **DON'T add CSS frameworks**
- No Bootstrap, no Tailwind
- Keep custom, lightweight CSS

❌ **DON'T override theme variables in other files**
- Change CSS variables only in theme.css
- Use variables everywhere else

### Testing

❌ **DON'T test UI directly**
- Jest doesn't have DOM (no jsdom configured)
- Test pure logic only
- Verify UI changes manually

❌ **DON'T skip tests for new modules**
- Every module needs tests
- Test core solving logic minimum

### Git Workflow

❌ **DON'T commit directly to main (if using PRs)**
- Use feature branches
- Exception: Small, urgent fixes

❌ **DON'T commit broken code**
- Test before committing
- Run npm test

❌ **DON'T use vague commit messages**
```bash
# ❌ BAD
git commit -m "updates"
git commit -m "fix stuff"

# ✅ GOOD
git commit -m "feat(fractions): add simplification step"
git commit -m "fix(equations): handle division by zero"
```

### Module Development

❌ **DON'T forget to update navigation**
- New modules need links in ALL HTML files
- Update navigation in every existing page

❌ **DON'T break existing modules**
- Test changes don't affect other modules
- Shared functions (utils.js) need extra care

❌ **DON'T ignore edge cases**
- Division by zero
- Negative numbers
- Zero coefficients
- Infinite solutions / no solutions

---

## 🚀 Quick Reference

### Essential Files to Read First

1. `README.md` - Project overview
2. `ROADMAP.md` - Current status, future plans
3. `js/utils.js` - Core utilities
4. `js/ui.js` - UI helpers
5. `js/equations.js` - Example module (simple, well-structured)

### Common Locations

- **Navigation**: In every HTML file's `<nav>` section
- **Solution display**: `<div id="solutionDiv">` or `<div id="solutionSteps">`
- **Buttons**: Usually in `<div class="buttons">` section
- **Type selector**: `<div class="type-selector">` with `.type-btn` buttons

### Key Commands

```bash
# Development
npm test                    # Run tests
npm run test:watch          # Watch mode
npm run test:coverage       # Coverage

# Git
git status                  # Check changes
git add .                   # Stage all
git commit -m "type: msg"   # Commit
git push                    # Push to remote

# Branch (when using Claude Code)
git push -u origin claude/claude-md-{session-id}
```

### Module Checklist

When working on a module:

- [ ] Read module's HTML file
- [ ] Read module's JS file
- [ ] Check for module-specific CSS
- [ ] Look at tests for expected behavior
- [ ] Run tests before changes
- [ ] Make changes
- [ ] Run tests after changes
- [ ] Manual browser testing
- [ ] Update docs if needed
- [ ] Commit with proper message

---

## 💡 Tips for AI Assistants

### Understanding User Intent

**"Add a feature"**:
1. Read existing similar modules
2. Follow established patterns
3. Create tests
4. Update navigation everywhere
5. Update README/ROADMAP

**"Fix a bug"**:
1. Reproduce the issue
2. Read related code
3. Identify root cause
4. Fix with minimal changes
5. Add test to prevent regression

**"Improve/refactor"**:
1. Ask for clarification on scope
2. Ensure tests exist first
3. Refactor incrementally
4. Keep tests passing
5. Don't change behavior

### Code Reading Strategy

1. **Start with structure**: Look at HTML first to understand UI
2. **Then logic**: Read JS to understand behavior
3. **Check tests**: Understand expected behavior
4. **Look at similar**: Check other modules for patterns

### When Making Changes

1. **Be conservative**: Minimal changes to achieve goal
2. **Follow patterns**: Match existing code style
3. **Test thoroughly**: Unit tests + manual testing
4. **Update docs**: If behavior changes externally
5. **Clear commits**: One logical change per commit

### Common Pitfalls

⚠️ **Over-engineering**: Don't add unnecessary abstraction
⚠️ **Breaking changes**: Test all modules after shared code changes
⚠️ **Incomplete features**: Ensure all parts updated (HTML, JS, tests, nav, docs)
⚠️ **Poor error handling**: Always handle edge cases
⚠️ **Inconsistent style**: Match existing patterns exactly

---

## 📞 Getting Help

### Resources

- **README.md**: User documentation
- **ROADMAP.md**: Development plan, status
- **git_guide.md**: Git workflow details
- **Tests**: Expected behavior examples

### Understanding Conventions

- Read existing modules as templates
- Check git history for change patterns: `git log --oneline`
- Look at recent commits for commit message style

### Making Decisions

**When in doubt**:
1. Follow existing patterns
2. Choose simpler solution
3. Ask user for clarification
4. Don't break existing functionality

---

## 🔄 Keeping This Document Updated

This document should be updated when:

- ✅ New architectural patterns are established
- ✅ New modules introduce new conventions
- ✅ Major refactoring changes code organization
- ✅ Development workflow changes
- ✅ New tools are added to the stack

Update frequency: After each major phase completion (see ROADMAP.md)

---

**Version**: 1.0
**Last Updated**: January 2025
**Next Review**: After Phase 2 completion

---

**Remember**: This is a learning platform. Code should be:
- **Simple**: Easy to understand and modify
- **Reliable**: Well-tested, handles edge cases
- **Consistent**: Follows established patterns
- **Maintainable**: Clear, documented, modular

Happy coding! 🎓
