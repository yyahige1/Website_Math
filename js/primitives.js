/* ========================================
   PRIMITIVES.JS - Primitives & Intégrales
   ======================================== */

/**
 * État du module
 */
const PrimitivesState = {
    currentType: 'polynomiale',

    // Polynomiale
    degre: 2,
    coeffs: [3, -2, 1],

    // Usuelle
    typeUsuelle: 'exponentielle',
    usuelle_a: 2,
    usuelle_b: 3,
    usuelle_n: 3,

    // Condition initiale
    typeCondition: 'polynome',
    cond_coeffs: [2, -3, 1],
    cond_x0: 1,
    cond_y0: 5,
    cond_a: 2,
    cond_b: 1,

    // Intégrale définie
    typeIntegrale: 'polynome',
    int_coeffs: [1, 0, 1],
    int_a: 0,
    int_b: 2,
    int_coef_a: 1,
    int_coef_b: 0,

    // Aire
    typeAire: 'polynome',
    aire_coeffs: [-1, 4, 0],
    aire_a: 0,
    aire_b: 4,
    aire_slope: 2,
    aire_intercept: 1,

    // Valeur moyenne
    typeMoyenne: 'polynome',
    moy_coeffs: [1, -2, 3],
    moy_a: 0,
    moy_b: 3,
    moy_exp_a: 1,
    moy_exp_b: 0
};

// ============================================================
// Helpers KaTeX
// ============================================================

function kx(latex) {
    try {
        return katex.renderToString(latex, { throwOnError: false });
    } catch (e) {
        return latex;
    }
}

function kxd(latex) {
    try {
        return katex.renderToString(latex, { throwOnError: false, displayMode: true });
    } catch (e) {
        return latex;
    }
}

/**
 * Convertit un tableau de coefficients en chaîne LaTeX
 * coeffs[0] est le coeff du plus haut degré
 */
function toLatex(coeffs) {
    const n = coeffs.length - 1;
    let parts = [];
    for (let i = 0; i <= n; i++) {
        const c = coeffs[i];
        const p = n - i;
        if (c === 0) continue;

        let term = '';
        if (parts.length === 0) {
            // Premier terme
            if (p === 0) {
                term = `${c}`;
            } else if (c === 1) {
                term = p === 1 ? 'x' : `x^{${p}}`;
            } else if (c === -1) {
                term = p === 1 ? '-x' : `-x^{${p}}`;
            } else {
                term = p === 1 ? `${c}x` : `${c}x^{${p}}`;
            }
        } else {
            const sign = c > 0 ? '+' : '-';
            const abs = Math.abs(c);
            if (p === 0) {
                term = `${sign}${abs}`;
            } else if (abs === 1) {
                term = p === 1 ? `${sign}x` : `${sign}x^{${p}}`;
            } else {
                term = p === 1 ? `${sign}${abs}x` : `${sign}${abs}x^{${p}}`;
            }
        }
        parts.push(term);
    }
    return parts.length > 0 ? parts.join('') : '0';
}

/**
 * Calcule la primitive d'un polynome
 * Retourne les coefficients de la primitive (sans constante C)
 * coeffs[0] = coeff du plus haut degré
 */
function primitivePoly(coeffs) {
    const n = coeffs.length - 1;
    const result = [];
    for (let i = 0; i <= n; i++) {
        const p = n - i; // puissance de x
        result.push(coeffs[i] / (p + 1));
    }
    result.push(0); // constante C = 0
    return result;
}

/**
 * Affiche une fraction LaTeX simplifiée
 */
function latexFrac(num, den) {
    if (den === 1) return `${num}`;
    if (den === -1) return `${-num}`;
    const g = gcd(Math.abs(num), Math.abs(den));
    let n = num / g;
    let d = den / g;
    if (d < 0) { n = -n; d = -d; }
    if (d === 1) return `${n}`;
    return `\\frac{${n}}{${d}}`;
}

/**
 * Convertit les coefficients d'une primitive en LaTeX
 * Gère les fractions proprement
 */
function primToLatex(coeffs, origCoeffs) {
    const n = coeffs.length - 1;
    let parts = [];

    for (let i = 0; i <= n; i++) {
        const c = coeffs[i];
        const p = n - i;
        if (c === 0 && p > 0) continue; // skip zero terms except constant
        if (i === coeffs.length - 1) continue; // skip the +C placeholder (0)

        // Determine if fraction
        const origPower = (origCoeffs.length - 1) - i; // puissance originale
        const divisor = origPower + 1;
        const origCoef = origCoeffs[i];

        let termLatex = '';
        const g = gcd(Math.abs(origCoef), divisor);
        const num = origCoef / g;
        const den = divisor / g;

        if (den === 1) {
            // Coefficient entier
            if (parts.length === 0) {
                if (p === 0) termLatex = `${num}`;
                else if (num === 1) termLatex = p === 1 ? 'x' : `x^{${p}}`;
                else if (num === -1) termLatex = p === 1 ? '-x' : `-x^{${p}}`;
                else termLatex = p === 1 ? `${num}x` : `${num}x^{${p}}`;
            } else {
                const sign = num > 0 ? '+' : '-';
                const abs = Math.abs(num);
                if (p === 0) termLatex = `${sign}${abs}`;
                else if (abs === 1) termLatex = p === 1 ? `${sign}x` : `${sign}x^{${p}}`;
                else termLatex = p === 1 ? `${sign}${abs}x` : `${sign}${abs}x^{${p}}`;
            }
        } else {
            // Coefficient fractionnaire
            const absNum = Math.abs(num);
            const fracStr = `\\frac{${absNum}}{${den}}`;
            if (parts.length === 0) {
                if (num < 0) {
                    termLatex = p === 0 ? `-${fracStr}` : `-${fracStr}x^{${p}}`;
                } else {
                    termLatex = p === 0 ? fracStr : (p === 1 ? `${fracStr}x` : `${fracStr}x^{${p}}`);
                }
            } else {
                const sign = num > 0 ? '+' : '-';
                termLatex = p === 0 ? `${sign}${fracStr}` : (p === 1 ? `${sign}${fracStr}x` : `${sign}${fracStr}x^{${p}}`);
            }
        }
        parts.push(termLatex);
    }
    return parts.length > 0 ? parts.join('') : '0';
}

/**
 * Evalue un polynome en un point
 */
function evalPoly(coeffs, x) {
    const n = coeffs.length - 1;
    let result = 0;
    for (let i = 0; i <= n; i++) {
        result += coeffs[i] * Math.pow(x, n - i);
    }
    return result;
}

/**
 * Formate un nombre pour LaTeX (arrondi raisonnable)
 */
function fmtN(n) {
    if (Number.isInteger(n)) return `${n}`;
    // Check if it's a "nice" fraction
    const rounded = Math.round(n * 1000) / 1000;
    if (Number.isInteger(rounded)) return `${rounded}`;
    return `${rounded}`;
}

// ============================================================
// Initialisation
// ============================================================

function initPrimitivesPage() {
    setupTypeButtons();
    setupInputHandlers();
    setupActionButtons();
    generateExercise();
    updateExerciseDisplay();
}

function setupTypeButtons() {
    const typeButtons = document.querySelectorAll('.type-btn');
    typeButtons.forEach(button => {
        button.addEventListener('click', () => {
            typeButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            PrimitivesState.currentType = button.dataset.type;
            generateExercise();
            updateExerciseDisplay();
            hideSolution('solutionDiv');
        });
    });
}

function setupInputHandlers() {
    $('degre_poly').addEventListener('change', () => {
        PrimitivesState.degre = parseInt($('degre_poly').value);
        generateExercise();
        updateExerciseDisplay();
    });

    $('type_usuelle').addEventListener('change', () => {
        PrimitivesState.typeUsuelle = $('type_usuelle').value;
        generateExercise();
        updateExerciseDisplay();
    });

    $('type_condition').addEventListener('change', () => {
        PrimitivesState.typeCondition = $('type_condition').value;
        generateExercise();
        updateExerciseDisplay();
    });

    $('type_integrale').addEventListener('change', () => {
        PrimitivesState.typeIntegrale = $('type_integrale').value;
        generateExercise();
        updateExerciseDisplay();
    });

    $('type_aire').addEventListener('change', () => {
        PrimitivesState.typeAire = $('type_aire').value;
        generateExercise();
        updateExerciseDisplay();
    });

    $('type_moyenne').addEventListener('change', () => {
        PrimitivesState.typeMoyenne = $('type_moyenne').value;
        generateExercise();
        updateExerciseDisplay();
    });
}

function setupActionButtons() {
    $('newExerciseBtn').addEventListener('click', () => {
        generateExercise();
        updateExerciseDisplay();
        hideSolution('solutionDiv');
    });

    $('solveBtn').addEventListener('click', () => {
        solvePrimitives();
    });
}

// ============================================================
// Affichage
// ============================================================

function updateExerciseDisplay() {
    // Masquer toutes les sections
    const sections = ['polynomialeSection', 'usuelleSection', 'conditionSection',
                      'integraleSection', 'aireSection', 'moyenneSection'];
    sections.forEach(id => { $(id).style.display = 'none'; });

    let display = '';
    const type = PrimitivesState.currentType;

    switch (type) {
        case 'polynomiale':
            $('polynomialeSection').style.display = 'block';
            display = `Déterminer une primitive de ${kx(`f(x) = ${toLatex(PrimitivesState.coeffs)}`)}`;
            break;

        case 'usuelle':
            $('usuelleSection').style.display = 'block';
            display = `Déterminer une primitive de ${kx(`f(x) = ${getUsuelleLatex()}`)}`;
            break;

        case 'condition': {
            $('conditionSection').style.display = 'block';
            const s = PrimitivesState;
            let fLatex;
            if (s.typeCondition === 'polynome') {
                fLatex = toLatex(s.cond_coeffs);
            } else {
                const aStr = s.cond_a === 1 ? '' : (s.cond_a === -1 ? '-' : `${s.cond_a}`);
                const bSign = s.cond_b >= 0 ? `+${s.cond_b}` : `${s.cond_b}`;
                fLatex = `e^{${aStr}x${s.cond_b !== 0 ? bSign : ''}}`;
            }
            display = `Déterminer la primitive ${kx('F')} de ${kx(`f(x) = ${fLatex}`)} telle que ${kx(`F(${s.cond_x0}) = ${s.cond_y0}`)}`;
            break;
        }

        case 'integrale': {
            $('integraleSection').style.display = 'block';
            const s = PrimitivesState;
            let fLatex;
            if (s.typeIntegrale === 'polynome') {
                fLatex = toLatex(s.int_coeffs);
            } else if (s.typeIntegrale === 'exponentielle') {
                const aStr = s.int_coef_a === 1 ? '' : (s.int_coef_a === -1 ? '-' : `${s.int_coef_a}`);
                const bSign = s.int_coef_b > 0 ? `+${s.int_coef_b}` : (s.int_coef_b < 0 ? `${s.int_coef_b}` : '');
                fLatex = `e^{${aStr}x${bSign}}`;
            } else {
                fLatex = `\\frac{1}{x}`;
            }
            display = `Calculer ${kx(`\\displaystyle\\int_{${s.int_a}}^{${s.int_b}} \\left(${fLatex}\\right) \\, dx`)}`;
            break;
        }

        case 'aire': {
            $('aireSection').style.display = 'block';
            const s = PrimitivesState;
            let fLatex;
            if (s.typeAire === 'polynome') {
                fLatex = toLatex(s.aire_coeffs);
            } else {
                const m = s.aire_slope;
                const p = s.aire_intercept;
                if (m === 0) fLatex = `${p}`;
                else if (m === 1) fLatex = p === 0 ? 'x' : (p > 0 ? `x+${p}` : `x${p}`);
                else if (m === -1) fLatex = p === 0 ? '-x' : (p > 0 ? `-x+${p}` : `-x${p}`);
                else fLatex = p === 0 ? `${m}x` : (p > 0 ? `${m}x+${p}` : `${m}x${p}`);
            }
            display = `Calculer l'aire entre la courbe ${kx(`f(x) = ${fLatex}`)}, l'axe des abscisses et les droites ${kx(`x = ${s.aire_a}`)} et ${kx(`x = ${s.aire_b}`)}`;
            break;
        }

        case 'moyenne': {
            $('moyenneSection').style.display = 'block';
            const s = PrimitivesState;
            let fLatex;
            if (s.typeMoyenne === 'polynome') {
                fLatex = toLatex(s.moy_coeffs);
            } else {
                const aStr = s.moy_exp_a === 1 ? '' : (s.moy_exp_a === -1 ? '-' : `${s.moy_exp_a}`);
                const bSign = s.moy_exp_b > 0 ? `+${s.moy_exp_b}` : (s.moy_exp_b < 0 ? `${s.moy_exp_b}` : '');
                fLatex = `e^{${aStr}x${bSign}}`;
            }
            display = `Calculer la valeur moyenne de ${kx(`f(x) = ${fLatex}`)} sur ${kx(`[${s.moy_a}\\,;\\,${s.moy_b}]`)}`;
            break;
        }
    }

    $('expressionDisplay').innerHTML = display;
}

function getUsuelleLatex() {
    const s = PrimitivesState;
    const a = s.usuelle_a;
    const b = s.usuelle_b;
    const aStr = a === 1 ? '' : (a === -1 ? '-' : `${a}`);
    const inner = b === 0 ? `${aStr}x` : (b > 0 ? `${aStr}x+${b}` : `${aStr}x${b}`);

    switch (s.typeUsuelle) {
        case 'exponentielle':
            return `e^{${inner}}`;
        case 'inverse':
            return `\\frac{1}{${inner}}`;
        case 'puissance':
            return `(${inner})^{${s.usuelle_n}}`;
        case 'racine':
            return `\\frac{1}{\\sqrt{${inner}}}`;
        default:
            return '';
    }
}

// ============================================================
// Génération aléatoire
// ============================================================

function generateExercise() {
    const type = PrimitivesState.currentType;

    switch (type) {
        case 'polynomiale': {
            const deg = PrimitivesState.degre;
            const coeffs = [];
            for (let i = 0; i <= deg; i++) {
                coeffs.push(randCoef(-5, 5, false, i === 0));
            }
            PrimitivesState.coeffs = coeffs;
            break;
        }

        case 'usuelle': {
            PrimitivesState.usuelle_a = randCoef(1, 4, false, true);
            if (Math.random() < 0.4) PrimitivesState.usuelle_a = -PrimitivesState.usuelle_a;
            PrimitivesState.usuelle_b = randCoef(-5, 5, false, false);
            if (PrimitivesState.typeUsuelle === 'puissance') {
                PrimitivesState.usuelle_n = randCoef(2, 5, false, true);
            }
            break;
        }

        case 'condition': {
            if (PrimitivesState.typeCondition === 'polynome') {
                const coeffs = [];
                for (let i = 0; i <= 2; i++) {
                    coeffs.push(randCoef(-4, 4, false, i === 0));
                }
                PrimitivesState.cond_coeffs = coeffs;
            } else {
                PrimitivesState.cond_a = randCoef(1, 3, false, true);
                if (Math.random() < 0.4) PrimitivesState.cond_a = -PrimitivesState.cond_a;
                PrimitivesState.cond_b = randCoef(-3, 3, false, false);
            }
            PrimitivesState.cond_x0 = randCoef(0, 3, false, false);
            PrimitivesState.cond_y0 = randCoef(-5, 5, false, false);
            break;
        }

        case 'integrale': {
            if (PrimitivesState.typeIntegrale === 'polynome') {
                const coeffs = [];
                for (let i = 0; i <= 2; i++) {
                    coeffs.push(randCoef(-3, 3, false, i === 0));
                }
                PrimitivesState.int_coeffs = coeffs;
                PrimitivesState.int_a = randCoef(-2, 1, false, false);
                PrimitivesState.int_b = PrimitivesState.int_a + randCoef(1, 4, false, true);
            } else if (PrimitivesState.typeIntegrale === 'exponentielle') {
                PrimitivesState.int_coef_a = randCoef(1, 3, false, true);
                if (Math.random() < 0.4) PrimitivesState.int_coef_a = -PrimitivesState.int_coef_a;
                PrimitivesState.int_coef_b = randCoef(-2, 2, false, false);
                PrimitivesState.int_a = 0;
                PrimitivesState.int_b = randCoef(1, 3, false, true);
            } else {
                // inverse: 1/x, bornes > 0
                PrimitivesState.int_a = randCoef(1, 3, false, true);
                PrimitivesState.int_b = PrimitivesState.int_a + randCoef(1, 4, false, true);
            }
            break;
        }

        case 'aire': {
            if (PrimitivesState.typeAire === 'polynome') {
                // Parabole qui passe par des points sympas
                const a = randCoef(1, 2, false, true);
                const neg = Math.random() < 0.5 ? -1 : 1;
                const r1 = randCoef(0, 1, false, false);
                const r2 = r1 + randCoef(2, 4, false, true);
                // f(x) = neg*a*(x-r1)(x-r2) = neg*a*(x²-(r1+r2)x+r1*r2)
                PrimitivesState.aire_coeffs = [neg * a, neg * a * (-(r1 + r2)), neg * a * r1 * r2];
                PrimitivesState.aire_a = r1;
                PrimitivesState.aire_b = r2;
            } else {
                PrimitivesState.aire_slope = randCoef(1, 3, false, true);
                if (Math.random() < 0.4) PrimitivesState.aire_slope = -PrimitivesState.aire_slope;
                PrimitivesState.aire_intercept = randCoef(-2, 4, false, false);
                PrimitivesState.aire_a = 0;
                PrimitivesState.aire_b = randCoef(2, 5, false, true);
            }
            break;
        }

        case 'moyenne': {
            if (PrimitivesState.typeMoyenne === 'polynome') {
                const coeffs = [];
                for (let i = 0; i <= 2; i++) {
                    coeffs.push(randCoef(-3, 3, false, i === 0));
                }
                PrimitivesState.moy_coeffs = coeffs;
                PrimitivesState.moy_a = randCoef(0, 2, false, false);
                PrimitivesState.moy_b = PrimitivesState.moy_a + randCoef(1, 4, false, true);
            } else {
                PrimitivesState.moy_exp_a = randCoef(1, 2, false, true);
                if (Math.random() < 0.4) PrimitivesState.moy_exp_a = -PrimitivesState.moy_exp_a;
                PrimitivesState.moy_exp_b = randCoef(-2, 2, false, false);
                PrimitivesState.moy_a = 0;
                PrimitivesState.moy_b = randCoef(1, 3, false, true);
            }
            break;
        }
    }
}

// ============================================================
// Résolution principale
// ============================================================

function solvePrimitives() {
    let html = '';
    const type = PrimitivesState.currentType;

    switch (type) {
        case 'polynomiale': html = solvePolynomiale(); break;
        case 'usuelle': html = solveUsuelle(); break;
        case 'condition': html = solveCondition(); break;
        case 'integrale': html = solveIntegrale(); break;
        case 'aire': html = solveAire(); break;
        case 'moyenne': html = solveMoyenne(); break;
    }

    $('stepsContainer').innerHTML = html;
    showSolution('solutionDiv');

    // Dessiner les graphiques si nécessaire
    requestAnimationFrame(() => {
        if (type === 'aire') {
            drawAire();
        } else if (type === 'integrale' && PrimitivesState.typeIntegrale === 'polynome') {
            drawIntegrale();
        }
    });
}

// ============================================================
// 1. Primitive polynomiale
// ============================================================

function solvePolynomiale() {
    const coeffs = PrimitivesState.coeffs;
    const n = coeffs.length - 1;
    let html = '';

    // Rappel
    html += '<div class="step">';
    html += '<div class="step-number">📚 Rappel</div>';
    html += `<div class="step-expression">${kxd(`\\text{Si } f(x) = x^n \\text{, alors } F(x) = \\frac{x^{n+1}}{n+1} + C`)}</div>`;
    html += '<div class="step-explanation">On applique cette regle terme par terme</div>';
    html += '</div>';

    // Étape 1 : Identifier les termes
    html += '<div class="step">';
    html += '<div class="step-number">📍 Étape 1 : Fonction à primitiver</div>';
    html += `<div class="step-expression">${kxd(`f(x) = ${toLatex(coeffs)}`)}</div>`;
    html += '</div>';

    // Étape 2 : Calcul terme par terme
    html += '<div class="step">';
    html += '<div class="step-number">📍 Étape 2 : Primitiver chaque terme</div>';

    for (let i = 0; i <= n; i++) {
        const c = coeffs[i];
        const p = n - i;
        if (c === 0) continue;

        const newP = p + 1;
        const g = gcd(Math.abs(c), newP);
        const numSimp = c / g;
        const denSimp = newP / g;

        let arrow;
        if (p === 0) {
            // constante c -> cx
            arrow = `\\color{#667eea}{${c}} \\longrightarrow \\color{#38a169}{${c}x}`;
        } else {
            const coefStr = c === 1 ? '' : (c === -1 ? '-' : `${c}`);
            const xpStr = p === 1 ? 'x' : `x^{${p}}`;
            const resultCoef = denSimp === 1 ? `${numSimp}` : `\\frac{${Math.abs(numSimp)}}{${denSimp}}`;
            const signResult = numSimp < 0 ? '-' : '';
            arrow = `\\color{#667eea}{${coefStr}${xpStr}} \\longrightarrow \\color{#38a169}{${signResult}${resultCoef}x^{${newP}}}`;
        }
        html += `<div class="step-expression">${kxd(arrow)}</div>`;
    }
    html += '</div>';

    // Étape 3 : Résultat
    const primCoeffs = primitivePoly(coeffs);
    const primLatex = primToLatex(primCoeffs, coeffs);

    html += '<div class="step">';
    html += '<div class="step-number">📍 Étape 3 : Rassembler</div>';
    html += `<div class="step-expression">${kxd(`F(x) = ${primLatex} + C`)}</div>`;
    html += '<div class="step-explanation">où C est une constante réelle quelconque</div>';
    html += '</div>';

    // Résultat final
    html += '<div class="result-highlight">';
    html += `<div class="final">${kx(`\\boxed{F(x) = ${primLatex} + C}`)}</div>`;
    html += '</div>';

    // Vérification
    html += '<div class="step">';
    html += '<div class="step-number">🔍 Vérification</div>';
    html += `<div class="step-explanation">On peut vérifier : ${kx(`F'(x) = ${toLatex(coeffs)} = f(x)`)} ✓</div>`;
    html += '</div>';

    return html;
}

// ============================================================
// 2. Primitives usuelles
// ============================================================

function solveUsuelle() {
    const s = PrimitivesState;
    const a = s.usuelle_a;
    const b = s.usuelle_b;
    const type = s.typeUsuelle;
    let html = '';

    const aStr = a === 1 ? '' : (a === -1 ? '-' : `${a}`);
    const inner = b === 0 ? `${aStr}x` : (b > 0 ? `${aStr}x+${b}` : `${aStr}x${b}`);

    switch (type) {
        case 'exponentielle': {
            // f(x) = e^(ax+b), F(x) = (1/a) e^(ax+b)
            html += '<div class="step">';
            html += '<div class="step-number">📚 Rappel</div>';
            html += `<div class="step-expression">${kxd(`\\text{Si } f(x) = e^{u(x)} \\text{, alors une primitive est } F(x) = \\frac{1}{u'(x)} \\, e^{u(x)}`)}</div>`;
            html += `<div class="step-explanation">valable lorsque ${kx("u(x)")} est une fonction affine ${kx("u(x) = ax + b")}</div>`;
            html += '</div>';

            html += '<div class="step">';
            html += '<div class="step-number">📍 Étape 1 : Identifier u(x)</div>';
            html += `<div class="step-expression">${kxd(`f(x) = e^{\\color{#667eea}{${inner}}}`)}  </div>`;
            html += `<div class="step-expression">${kxd(`u(x) = \\color{#667eea}{${inner}} \\quad \\Rightarrow \\quad u'(x) = \\color{#e53e3e}{${a}}`)}  </div>`;
            html += '</div>';

            html += '<div class="step">';
            html += '<div class="step-number">📍 Étape 2 : Appliquer la formule</div>';
            const coefLatex = a === 1 ? '' : (a === -1 ? '-' : `\\frac{1}{${a}}`);
            const finalCoef = latexFrac(1, a);
            html += `<div class="step-expression">${kxd(`F(x) = \\color{#38a169}{${finalCoef}} \\, e^{${inner}} + C`)}  </div>`;
            html += '</div>';

            html += '<div class="result-highlight">';
            html += `<div class="final">${kx(`\\boxed{F(x) = ${finalCoef} \\, e^{${inner}} + C}`)}</div>`;
            html += '</div>';
            break;
        }

        case 'inverse': {
            // f(x) = 1/(ax+b), F(x) = (1/a) ln|ax+b|
            html += '<div class="step">';
            html += '<div class="step-number">📚 Rappel</div>';
            html += `<div class="step-expression">${kxd(`\\text{Si } f(x) = \\frac{1}{ax+b} \\text{, alors } F(x) = \\frac{1}{a} \\ln|ax+b| + C`)}</div>`;
            html += `<div class="step-explanation">sur un intervalle où ${kx(`ax+b \\neq 0`)}</div>`;
            html += '</div>';

            html += '<div class="step">';
            html += '<div class="step-number">📍 Étape 1 : Identifier a et b</div>';
            html += `<div class="step-expression">${kxd(`f(x) = \\frac{1}{\\color{#667eea}{${inner}}} \\quad \\text{avec } a = \\color{#667eea}{${a}} \\text{ et } b = \\color{#667eea}{${b}}`)}  </div>`;
            html += '</div>';

            html += '<div class="step">';
            html += '<div class="step-number">📍 Étape 2 : Appliquer la formule</div>';
            const coefLn = latexFrac(1, a);
            html += `<div class="step-expression">${kxd(`F(x) = \\color{#38a169}{${coefLn}} \\, \\ln|${inner}| + C`)}  </div>`;
            html += '</div>';

            html += '<div class="result-highlight">';
            html += `<div class="final">${kx(`\\boxed{F(x) = ${coefLn} \\, \\ln|${inner}| + C}`)}</div>`;
            html += '</div>';
            break;
        }

        case 'puissance': {
            // f(x) = (ax+b)^n, F(x) = (1/(a(n+1))) (ax+b)^(n+1)
            const n = s.usuelle_n;
            html += '<div class="step">';
            html += '<div class="step-number">📚 Rappel</div>';
            html += `<div class="step-expression">${kxd(`\\text{Si } f(x) = (ax+b)^n \\text{ avec } n \\neq -1 \\text{, alors } F(x) = \\frac{1}{a(n+1)}(ax+b)^{n+1} + C`)}</div>`;
            html += '</div>';

            html += '<div class="step">';
            html += '<div class="step-number">📍 Étape 1 : Identifier les paramètres</div>';
            html += `<div class="step-expression">${kxd(`f(x) = (\\color{#667eea}{${inner}})^{\\color{#e53e3e}{${n}}}`)}  </div>`;
            html += `<div class="step-expression">${kxd(`a = \\color{#667eea}{${a}}, \\quad b = \\color{#667eea}{${b}}, \\quad n = \\color{#e53e3e}{${n}}`)}  </div>`;
            html += '</div>';

            html += '<div class="step">';
            html += '<div class="step-number">📍 Étape 2 : Calculer le coefficient</div>';
            const newN = n + 1;
            const denom = a * newN;
            const coefPuis = latexFrac(1, denom);
            html += `<div class="step-expression">${kxd(`\\frac{1}{a(n+1)} = \\frac{1}{${a} \\times ${newN}} = \\color{#38a169}{${coefPuis}}`)}  </div>`;
            html += '</div>';

            html += '<div class="step">';
            html += '<div class="step-number">📍 Étape 3 : Écrire la primitive</div>';
            html += `<div class="step-expression">${kxd(`F(x) = ${coefPuis}(${inner})^{${newN}} + C`)}  </div>`;
            html += '</div>';

            html += '<div class="result-highlight">';
            html += `<div class="final">${kx(`\\boxed{F(x) = ${coefPuis}(${inner})^{${newN}} + C}`)}</div>`;
            html += '</div>';
            break;
        }

        case 'racine': {
            // f(x) = 1/√(ax+b) = (ax+b)^(-1/2), F(x) = (2/a)√(ax+b)
            html += '<div class="step">';
            html += '<div class="step-number">📚 Rappel</div>';
            html += `<div class="step-expression">${kxd(`\\frac{1}{\\sqrt{ax+b}} = (ax+b)^{-1/2}`)}</div>`;
            html += `<div class="step-expression">${kxd(`\\text{Primitive : } F(x) = \\frac{2}{a}\\sqrt{ax+b} + C`)}</div>`;
            html += `<div class="step-explanation">sur un intervalle où ${kx(`ax+b > 0`)}</div>`;
            html += '</div>';

            html += '<div class="step">';
            html += '<div class="step-number">📍 Étape 1 : Identifier a et b</div>';
            html += `<div class="step-expression">${kxd(`f(x) = \\frac{1}{\\sqrt{\\color{#667eea}{${inner}}}} \\quad \\text{avec } a = \\color{#667eea}{${a}}`)}  </div>`;
            html += '</div>';

            html += '<div class="step">';
            html += '<div class="step-number">📍 Étape 2 : Appliquer la formule</div>';
            const coefSqrt = latexFrac(2, a);
            html += `<div class="step-expression">${kxd(`F(x) = \\color{#38a169}{${coefSqrt}} \\, \\sqrt{${inner}} + C`)}  </div>`;
            html += '</div>';

            html += '<div class="result-highlight">';
            html += `<div class="final">${kx(`\\boxed{F(x) = ${coefSqrt}\\sqrt{${inner}} + C}`)}</div>`;
            html += '</div>';
            break;
        }
    }

    // Vérification
    html += '<div class="step">';
    html += '<div class="step-number">🔍 Vérification</div>';
    html += `<div class="step-explanation">On peut toujours vérifier en dérivant ${kx('F(x)')} : on doit retrouver ${kx('f(x)')}</div>`;
    html += '</div>';

    return html;
}

// ============================================================
// 3. Primitive avec condition initiale
// ============================================================

function solveCondition() {
    const s = PrimitivesState;
    let html = '';

    html += '<div class="step">';
    html += '<div class="step-number">📚 Méthode</div>';
    html += `<div class="step-expression">${kxd(`\\text{On cherche } F(x) \\text{ telle que } F'(x) = f(x) \\text{ et } F(${s.cond_x0}) = ${s.cond_y0}`)}</div>`;
    html += '<div class="step-explanation">On calcule d\'abord la primitive générale (avec C), puis on détermine C grace à la condition</div>';
    html += '</div>';

    if (s.typeCondition === 'polynome') {
        const coeffs = s.cond_coeffs;
        const primCoeffs = primitivePoly(coeffs);
        const primLatex = primToLatex(primCoeffs, coeffs);

        // Étape 1 : Primitive générale
        html += '<div class="step">';
        html += '<div class="step-number">📍 Étape 1 : Primitive générale</div>';
        html += `<div class="step-expression">${kxd(`f(x) = ${toLatex(coeffs)}`)}  </div>`;
        html += `<div class="step-expression">${kxd(`F(x) = \\color{#667eea}{${primLatex}} + C`)}  </div>`;
        html += '</div>';

        // Étape 2 : Appliquer la condition
        const Fx0 = evalPoly(primCoeffs, s.cond_x0);
        const C = s.cond_y0 - Fx0;

        html += '<div class="step">';
        html += '<div class="step-number">📍 Étape 2 : Déterminer C</div>';
        html += `<div class="step-expression">${kxd(`F(\\color{#e53e3e}{${s.cond_x0}}) = ${s.cond_y0}`)}  </div>`;
        html += `<div class="step-expression">${kxd(`${fmtN(Fx0)} + C = ${s.cond_y0}`)}  </div>`;
        html += `<div class="step-expression">${kxd(`C = ${s.cond_y0} - ${fmtN(Fx0)} = \\color{#38a169}{${fmtN(C)}}`)}  </div>`;
        html += '</div>';

        // Résultat
        const cSign = C >= 0 ? `+${fmtN(C)}` : `${fmtN(C)}`;
        html += '<div class="result-highlight">';
        html += `<div class="final">${kx(`\\boxed{F(x) = ${primLatex} ${cSign}}`)}</div>`;
        html += '</div>';

    } else {
        // Exponentielle
        const a = s.cond_a;
        const b = s.cond_b;
        const aStr = a === 1 ? '' : (a === -1 ? '-' : `${a}`);
        const inner = b === 0 ? `${aStr}x` : (b > 0 ? `${aStr}x+${b}` : `${aStr}x${b}`);
        const coef = latexFrac(1, a);

        html += '<div class="step">';
        html += '<div class="step-number">📍 Étape 1 : Primitive générale</div>';
        html += `<div class="step-expression">${kxd(`f(x) = e^{${inner}}`)}  </div>`;
        html += `<div class="step-expression">${kxd(`F(x) = \\color{#667eea}{${coef} \\, e^{${inner}}} + C`)}  </div>`;
        html += '</div>';

        // Étape 2 : Appliquer la condition
        const expVal = Math.exp(a * s.cond_x0 + b);
        const Fx0 = (1 / a) * expVal;

        html += '<div class="step">';
        html += '<div class="step-number">📍 Étape 2 : Déterminer C</div>';
        html += `<div class="step-expression">${kxd(`F(${s.cond_x0}) = ${s.cond_y0}`)}  </div>`;

        const expArg = a * s.cond_x0 + b;
        if (expArg === 0) {
            html += `<div class="step-expression">${kxd(`${coef} \\, e^{0} + C = ${s.cond_y0}`)}  </div>`;
            html += `<div class="step-expression">${kxd(`${coef} + C = ${s.cond_y0}`)}  </div>`;
            const C = s.cond_y0 - (1 / a);
            html += `<div class="step-expression">${kxd(`C = \\color{#38a169}{${fmtN(C)}}`)}  </div>`;
            html += '</div>';

            const cSign = C >= 0 ? `+${fmtN(C)}` : `${fmtN(C)}`;
            html += '<div class="result-highlight">';
            html += `<div class="final">${kx(`\\boxed{F(x) = ${coef} \\, e^{${inner}} ${cSign}}`)}</div>`;
            html += '</div>';
        } else {
            html += `<div class="step-expression">${kxd(`${coef} \\, e^{${expArg}} + C = ${s.cond_y0}`)}  </div>`;
            const Cexact = s.cond_y0;
            html += `<div class="step-expression">${kxd(`C = ${s.cond_y0} - ${coef} \\, e^{${expArg}}`)}  </div>`;
            html += '</div>';

            html += '<div class="result-highlight">';
            html += `<div class="final">${kx(`\\boxed{F(x) = ${coef} \\, e^{${inner}} + ${s.cond_y0} - ${coef} \\, e^{${expArg}}}`)}</div>`;
            html += '</div>';
        }
    }

    return html;
}

// ============================================================
// 4. Intégrale définie
// ============================================================

function solveIntegrale() {
    const s = PrimitivesState;
    let html = '';

    html += '<div class="step">';
    html += '<div class="step-number">📚 Rappel</div>';
    html += `<div class="step-expression">${kxd(`\\int_a^b f(x)\\,dx = F(b) - F(a) = \\Big[ F(x) \\Big]_a^b`)}</div>`;
    html += '<div class="step-explanation">où F est une primitive de f</div>';
    html += '</div>';

    if (s.typeIntegrale === 'polynome') {
        const coeffs = s.int_coeffs;
        const a = s.int_a;
        const b = s.int_b;
        const primCoeffs = primitivePoly(coeffs);
        const primLatex = primToLatex(primCoeffs, coeffs);

        // Étape 1 : Primitive
        html += '<div class="step">';
        html += '<div class="step-number">📍 Étape 1 : Trouver une primitive</div>';
        html += `<div class="step-expression">${kxd(`f(x) = ${toLatex(coeffs)}`)}  </div>`;
        html += `<div class="step-expression">${kxd(`F(x) = \\color{#667eea}{${primLatex}}`)}  </div>`;
        html += '<div class="step-explanation">On prend C = 0 (le choix de C n\'affecte pas le résultat)</div>';
        html += '</div>';

        // Étape 2 : F(b) - F(a)
        const Fb = evalPoly(primCoeffs, b);
        const Fa = evalPoly(primCoeffs, a);
        const result = Fb - Fa;

        html += '<div class="step">';
        html += '<div class="step-number">📍 Étape 2 : Calculer F(b) - F(a)</div>';
        html += `<div class="step-expression">${kxd(`\\Big[ F(x) \\Big]_{${a}}^{${b}} = F(\\color{#667eea}{${b}}) - F(\\color{#e53e3e}{${a}})`)}  </div>`;
        html += `<div class="step-expression">${kxd(`F(${b}) = ${fmtN(Fb)}`)}  </div>`;
        html += `<div class="step-expression">${kxd(`F(${a}) = ${fmtN(Fa)}`)}  </div>`;
        html += `<div class="step-expression">${kxd(`F(${b}) - F(${a}) = ${fmtN(Fb)} - ${fmtN(Fa)} = \\color{#38a169}{${fmtN(result)}}`)}  </div>`;
        html += '</div>';

        html += '<div class="result-highlight">';
        html += `<div class="final">${kx(`\\boxed{\\int_{${a}}^{${b}} \\left(${toLatex(coeffs)}\\right) dx = ${fmtN(result)}}`)}</div>`;
        html += '</div>';

        // Graphique
        html += '<div class="step">';
        html += '<div class="step-number">📈 Représentation graphique</div>';
        html += '<div class="graph-container">';
        html += '<canvas id="integraleGraph" width="600" height="400"></canvas>';
        html += '</div>';
        html += `<div class="step-explanation">L'aire ${result >= 0 ? 'colorée' : '(attention au signe !)'} vaut ${kx(`${fmtN(Math.abs(result))}`)}</div>`;
        html += '</div>';

    } else if (s.typeIntegrale === 'exponentielle') {
        const a = s.int_coef_a;
        const b_coef = s.int_coef_b;
        const borneA = s.int_a;
        const borneB = s.int_b;
        const aStr = a === 1 ? '' : (a === -1 ? '-' : `${a}`);
        const inner = b_coef === 0 ? `${aStr}x` : (b_coef > 0 ? `${aStr}x+${b_coef}` : `${aStr}x${b_coef}`);
        const coef = latexFrac(1, a);

        html += '<div class="step">';
        html += '<div class="step-number">📍 Étape 1 : Trouver une primitive</div>';
        html += `<div class="step-expression">${kxd(`f(x) = e^{${inner}}`)}  </div>`;
        html += `<div class="step-expression">${kxd(`F(x) = \\color{#667eea}{${coef} \\, e^{${inner}}}`)}  </div>`;
        html += '</div>';

        const valB = (1 / a) * Math.exp(a * borneB + b_coef);
        const valA = (1 / a) * Math.exp(a * borneA + b_coef);
        const argB = a * borneB + b_coef;
        const argA = a * borneA + b_coef;

        html += '<div class="step">';
        html += '<div class="step-number">📍 Étape 2 : Calculer F(b) - F(a)</div>';
        html += `<div class="step-expression">${kxd(`F(${borneB}) = ${coef} \\, e^{${argB}}`)}  </div>`;
        html += `<div class="step-expression">${kxd(`F(${borneA}) = ${coef} \\, e^{${argA}}`)}  </div>`;
        html += `<div class="step-expression">${kxd(`\\int_{${borneA}}^{${borneB}} e^{${inner}}\\,dx = ${coef}\\left(e^{${argB}} - e^{${argA}}\\right)`)}  </div>`;
        html += '</div>';

        const numResult = fmtN(valB - valA);
        html += '<div class="result-highlight">';
        html += `<div class="final">${kx(`\\boxed{\\int_{${borneA}}^{${borneB}} e^{${inner}}\\,dx = ${coef}\\left(e^{${argB}} - e^{${argA}}\\right) \\approx ${numResult}}`)}</div>`;
        html += '</div>';

    } else {
        // inverse: 1/x
        const borneA = s.int_a;
        const borneB = s.int_b;

        html += '<div class="step">';
        html += '<div class="step-number">📍 Étape 1 : Trouver une primitive</div>';
        html += `<div class="step-expression">${kxd(`f(x) = \\frac{1}{x}`)}  </div>`;
        html += `<div class="step-expression">${kxd(`F(x) = \\color{#667eea}{\\ln(x)} \\quad \\text{(sur } ]0, +\\infty[\\text{)}`)}  </div>`;
        html += '</div>';

        html += '<div class="step">';
        html += '<div class="step-number">📍 Étape 2 : Calculer F(b) - F(a)</div>';
        html += `<div class="step-expression">${kxd(`\\Big[ \\ln(x) \\Big]_{${borneA}}^{${borneB}} = \\ln(${borneB}) - \\ln(${borneA})`)}  </div>`;
        html += `<div class="step-expression">${kxd(`= \\ln\\left(\\frac{${borneB}}{${borneA}}\\right)`)}  </div>`;

        const g = gcd(borneB, borneA);
        const simpNum = borneB / g;
        const simpDen = borneA / g;
        if (simpDen === 1) {
            html += `<div class="step-expression">${kxd(`= \\color{#38a169}{\\ln(${simpNum})}`)}  </div>`;
        } else {
            html += `<div class="step-expression">${kxd(`= \\color{#38a169}{\\ln\\left(\\frac{${simpNum}}{${simpDen}}\\right)}`)}  </div>`;
        }
        html += '</div>';

        const numVal = fmtN(Math.log(borneB / borneA));
        const fracStr = simpDen === 1 ? `\\ln(${simpNum})` : `\\ln\\left(\\frac{${simpNum}}{${simpDen}}\\right)`;
        html += '<div class="result-highlight">';
        html += `<div class="final">${kx(`\\boxed{\\int_{${borneA}}^{${borneB}} \\frac{1}{x}\\,dx = ${fracStr} \\approx ${numVal}}`)}</div>`;
        html += '</div>';
    }

    return html;
}

// ============================================================
// 5. Aire et intégrale
// ============================================================

function solveAire() {
    const s = PrimitivesState;
    let html = '';

    html += '<div class="step">';
    html += '<div class="step-number">📚 Rappel</div>';
    html += `<div class="step-expression">${kxd(`\\mathcal{A} = \\int_a^b |f(x)|\\,dx`)}</div>`;
    html += '<div class="step-explanation">L\'aire est toujours positive. Si f change de signe, il faut découper l\'intégrale</div>';
    html += '</div>';

    if (s.typeAire === 'polynome') {
        const coeffs = s.aire_coeffs;
        const a = s.aire_a;
        const b = s.aire_b;

        html += '<div class="step">';
        html += '<div class="step-number">📍 Étape 1 : Étudier le signe de f</div>';
        html += `<div class="step-expression">${kxd(`f(x) = ${toLatex(coeffs)}`)}  </div>`;

        // Trouver les racines dans [a,b]
        const A = coeffs[0], B = coeffs[1], C = coeffs[2];
        const delta = B * B - 4 * A * C;
        let roots = [];
        if (delta > 0) {
            const r1 = (-B - Math.sqrt(delta)) / (2 * A);
            const r2 = (-B + Math.sqrt(delta)) / (2 * A);
            if (r1 > a && r1 < b) roots.push(r1);
            if (r2 > a && r2 < b) roots.push(r2);
        } else if (delta === 0) {
            const r = -B / (2 * A);
            if (r > a && r < b) roots.push(r);
        }

        // Signe de f sur [a,b]
        const fMid = evalPoly(coeffs, (a + b) / 2);
        const primCoeffs = primitivePoly(coeffs);
        const primLatex = primToLatex(primCoeffs, coeffs);

        if (roots.length === 0) {
            // f garde un signe constant sur [a,b]
            const positive = fMid >= 0;
            html += `<div class="step-explanation">f ne s'annule pas sur [${a}, ${b}], elle est ${positive ? 'positive' : 'négative'} sur cet intervalle</div>`;
            html += '</div>';

            html += '<div class="step">';
            html += '<div class="step-number">📍 Étape 2 : Calculer la primitive</div>';
            html += `<div class="step-expression">${kxd(`F(x) = ${primLatex}`)}  </div>`;
            html += '</div>';

            const Fb = evalPoly(primCoeffs, b);
            const Fa = evalPoly(primCoeffs, a);
            const integrale = Fb - Fa;
            const aire = Math.abs(integrale);

            html += '<div class="step">';
            html += '<div class="step-number">📍 Étape 3 : Calculer l\'aire</div>';
            if (positive) {
                html += `<div class="step-expression">${kxd(`\\mathcal{A} = \\int_{${a}}^{${b}} f(x)\\,dx = F(${b}) - F(${a}) = ${fmtN(Fb)} - ${fmtN(Fa)} = \\color{#38a169}{${fmtN(aire)}}`)}  </div>`;
            } else {
                html += `<div class="step-expression">${kxd(`\\mathcal{A} = -\\int_{${a}}^{${b}} f(x)\\,dx = -(F(${b}) - F(${a})) = -(${fmtN(integrale)}) = \\color{#38a169}{${fmtN(aire)}}`)}  </div>`;
            }
            html += '</div>';

            html += '<div class="result-highlight">';
            html += `<div class="final">${kx(`\\boxed{\\mathcal{A} = ${fmtN(aire)} \\text{ u.a.}}`)}  </div>`;
            html += '</div>';
        } else if (roots.length === 2) {
            // f change de signe, découper
            const r1 = Math.min(roots[0], roots[1]);
            const r2 = Math.max(roots[0], roots[1]);
            html += `<div class="step-explanation">f s'annule en ${kx(`x = ${fmtN(r1)}`)} et ${kx(`x = ${fmtN(r2)}`)}</div>`;
            html += `<div class="step-explanation">Il faut découper l'intégrale en 3 parties</div>`;
            html += '</div>';

            html += '<div class="step">';
            html += '<div class="step-number">📍 Étape 2 : Primitive</div>';
            html += `<div class="step-expression">${kxd(`F(x) = ${primLatex}`)}  </div>`;
            html += '</div>';

            // Calculer les 3 intégrales
            const Fa = evalPoly(primCoeffs, a);
            const Fr1 = evalPoly(primCoeffs, r1);
            const Fr2 = evalPoly(primCoeffs, r2);
            const Fb = evalPoly(primCoeffs, b);

            const I1 = Fr1 - Fa;
            const I2 = Fr2 - Fr1;
            const I3 = Fb - Fr2;

            html += '<div class="step">';
            html += '<div class="step-number">📍 Étape 3 : Calculer chaque partie</div>';
            html += `<div class="step-expression">${kxd(`I_1 = \\int_{${a}}^{${fmtN(r1)}} f(x)\\,dx = ${fmtN(I1)}`)}  </div>`;
            html += `<div class="step-expression">${kxd(`I_2 = \\int_{${fmtN(r1)}}^{${fmtN(r2)}} f(x)\\,dx = ${fmtN(I2)}`)}  </div>`;
            html += `<div class="step-expression">${kxd(`I_3 = \\int_{${fmtN(r2)}}^{${b}} f(x)\\,dx = ${fmtN(I3)}`)}  </div>`;
            html += '</div>';

            const aire = Math.abs(I1) + Math.abs(I2) + Math.abs(I3);
            html += '<div class="step">';
            html += '<div class="step-number">📍 Étape 4 : Aire totale</div>';
            html += `<div class="step-expression">${kxd(`\\mathcal{A} = |I_1| + |I_2| + |I_3| = ${fmtN(Math.abs(I1))} + ${fmtN(Math.abs(I2))} + ${fmtN(Math.abs(I3))} = \\color{#38a169}{${fmtN(aire)}}`)}  </div>`;
            html += '</div>';

            html += '<div class="result-highlight">';
            html += `<div class="final">${kx(`\\boxed{\\mathcal{A} = ${fmtN(aire)} \\text{ u.a.}}`)}  </div>`;
            html += '</div>';
        } else {
            // 1 racine
            const r = roots[0];
            html += `<div class="step-explanation">f s'annule en ${kx(`x = ${fmtN(r)}`)}, il faut découper en 2 parties</div>`;
            html += '</div>';

            html += '<div class="step">';
            html += '<div class="step-number">📍 Étape 2 : Primitive</div>';
            html += `<div class="step-expression">${kxd(`F(x) = ${primLatex}`)}  </div>`;
            html += '</div>';

            const Fa = evalPoly(primCoeffs, a);
            const Fr = evalPoly(primCoeffs, r);
            const Fb = evalPoly(primCoeffs, b);
            const I1 = Fr - Fa;
            const I2 = Fb - Fr;

            html += '<div class="step">';
            html += '<div class="step-number">📍 Étape 3 : Calculer chaque partie</div>';
            html += `<div class="step-expression">${kxd(`I_1 = \\int_{${a}}^{${fmtN(r)}} f(x)\\,dx = ${fmtN(I1)}`)}  </div>`;
            html += `<div class="step-expression">${kxd(`I_2 = \\int_{${fmtN(r)}}^{${b}} f(x)\\,dx = ${fmtN(I2)}`)}  </div>`;
            html += '</div>';

            const aire = Math.abs(I1) + Math.abs(I2);
            html += '<div class="step">';
            html += '<div class="step-number">📍 Étape 4 : Aire totale</div>';
            html += `<div class="step-expression">${kxd(`\\mathcal{A} = |I_1| + |I_2| = ${fmtN(Math.abs(I1))} + ${fmtN(Math.abs(I2))} = \\color{#38a169}{${fmtN(aire)}}`)}  </div>`;
            html += '</div>';

            html += '<div class="result-highlight">';
            html += `<div class="final">${kx(`\\boxed{\\mathcal{A} = ${fmtN(aire)} \\text{ u.a.}}`)}  </div>`;
            html += '</div>';
        }

    } else {
        // Fonction affine
        const m = s.aire_slope;
        const p = s.aire_intercept;
        const a = s.aire_a;
        const b = s.aire_b;

        let fLatex;
        if (m === 0) fLatex = `${p}`;
        else if (m === 1) fLatex = p === 0 ? 'x' : (p > 0 ? `x+${p}` : `x${p}`);
        else if (m === -1) fLatex = p === 0 ? '-x' : (p > 0 ? `-x+${p}` : `-x${p}`);
        else fLatex = p === 0 ? `${m}x` : (p > 0 ? `${m}x+${p}` : `${m}x${p}`);

        html += '<div class="step">';
        html += '<div class="step-number">📍 Étape 1 : Étudier le signe de f</div>';
        html += `<div class="step-expression">${kxd(`f(x) = ${fLatex}`)}  </div>`;

        // Racine
        const racine = m !== 0 ? -p / m : null;
        let rootInInterval = racine !== null && racine > a && racine < b;

        if (!rootInInterval) {
            const fA = m * a + p;
            const positive = fA >= 0;
            html += `<div class="step-explanation">f ${racine !== null ? `s'annule en x = ${fmtN(racine)} (hors de [${a}, ${b}])` : 'ne s\'annule pas'}. Elle est ${positive ? 'positive' : 'négative'} sur [${a}, ${b}]</div>`;
            html += '</div>';

            // F(x) = mx²/2 + px
            html += '<div class="step">';
            html += '<div class="step-number">📍 Étape 2 : Primitive</div>';
            const mFrac = latexFrac(m, 2);
            const primStr = p === 0 ? `${mFrac}x^2` : (p > 0 ? `${mFrac}x^2+${p}x` : `${mFrac}x^2${p}x`);
            html += `<div class="step-expression">${kxd(`F(x) = ${primStr}`)}  </div>`;
            html += '</div>';

            const Fb = (m / 2) * b * b + p * b;
            const Fa = (m / 2) * a * a + p * a;
            const integrale = Fb - Fa;
            const aire = Math.abs(integrale);

            html += '<div class="step">';
            html += '<div class="step-number">📍 Étape 3 : Calculer l\'aire</div>';
            html += `<div class="step-expression">${kxd(`\\mathcal{A} = ${positive ? '' : '-'}\\int_{${a}}^{${b}} f(x)\\,dx = ${positive ? '' : '-'}(${fmtN(Fb)} - ${fmtN(Fa)}) = \\color{#38a169}{${fmtN(aire)}}`)}  </div>`;
            html += '</div>';

            html += '<div class="result-highlight">';
            html += `<div class="final">${kx(`\\boxed{\\mathcal{A} = ${fmtN(aire)} \\text{ u.a.}}`)}  </div>`;
            html += '</div>';
        } else {
            html += `<div class="step-explanation">f s'annule en ${kx(`x = ${fmtN(racine)}`)}, il faut découper</div>`;
            html += '</div>';

            const mFrac = latexFrac(m, 2);
            const primStr = p === 0 ? `${mFrac}x^2` : (p > 0 ? `${mFrac}x^2+${p}x` : `${mFrac}x^2${p}x`);
            html += '<div class="step">';
            html += '<div class="step-number">📍 Étape 2 : Primitive</div>';
            html += `<div class="step-expression">${kxd(`F(x) = ${primStr}`)}  </div>`;
            html += '</div>';

            const Fa = (m / 2) * a * a + p * a;
            const Fr = (m / 2) * racine * racine + p * racine;
            const Fb = (m / 2) * b * b + p * b;
            const I1 = Fr - Fa;
            const I2 = Fb - Fr;
            const aire = Math.abs(I1) + Math.abs(I2);

            html += '<div class="step">';
            html += '<div class="step-number">📍 Étape 3 : Calculer</div>';
            html += `<div class="step-expression">${kxd(`I_1 = \\int_{${a}}^{${fmtN(racine)}} f(x)\\,dx = ${fmtN(I1)}`)}  </div>`;
            html += `<div class="step-expression">${kxd(`I_2 = \\int_{${fmtN(racine)}}^{${b}} f(x)\\,dx = ${fmtN(I2)}`)}  </div>`;
            html += `<div class="step-expression">${kxd(`\\mathcal{A} = |I_1| + |I_2| = ${fmtN(Math.abs(I1))} + ${fmtN(Math.abs(I2))} = \\color{#38a169}{${fmtN(aire)}}`)}  </div>`;
            html += '</div>';

            html += '<div class="result-highlight">';
            html += `<div class="final">${kx(`\\boxed{\\mathcal{A} = ${fmtN(aire)} \\text{ u.a.}}`)}  </div>`;
            html += '</div>';
        }
    }

    // Graphique
    html += '<div class="step">';
    html += '<div class="step-number">📈 Représentation graphique</div>';
    html += '<div class="graph-container">';
    html += '<canvas id="aireGraph" width="600" height="400"></canvas>';
    html += '</div>';
    html += '</div>';

    return html;
}

// ============================================================
// 6. Valeur moyenne
// ============================================================

function solveMoyenne() {
    const s = PrimitivesState;
    let html = '';

    const a = s.moy_a;
    const b = s.moy_b;

    html += '<div class="step">';
    html += '<div class="step-number">📚 Rappel</div>';
    html += `<div class="step-expression">${kxd(`\\mu = \\frac{1}{b-a} \\int_a^b f(x)\\,dx`)}</div>`;
    html += '<div class="step-explanation">La valeur moyenne représente la "hauteur" du rectangle de même aire que la surface sous la courbe</div>';
    html += '</div>';

    if (s.typeMoyenne === 'polynome') {
        const coeffs = s.moy_coeffs;
        const primCoeffs = primitivePoly(coeffs);
        const primLatex = primToLatex(primCoeffs, coeffs);

        html += '<div class="step">';
        html += '<div class="step-number">📍 Étape 1 : Trouver une primitive</div>';
        html += `<div class="step-expression">${kxd(`f(x) = ${toLatex(coeffs)}`)}  </div>`;
        html += `<div class="step-expression">${kxd(`F(x) = \\color{#667eea}{${primLatex}}`)}  </div>`;
        html += '</div>';

        html += '<div class="step">';
        html += '<div class="step-number">📍 Étape 2 : Calculer l\'intégrale</div>';
        const Fb = evalPoly(primCoeffs, b);
        const Fa = evalPoly(primCoeffs, a);
        const integrale = Fb - Fa;
        html += `<div class="step-expression">${kxd(`\\int_{${a}}^{${b}} f(x)\\,dx = F(${b}) - F(${a}) = ${fmtN(Fb)} - ${fmtN(Fa)} = \\color{#667eea}{${fmtN(integrale)}}`)}  </div>`;
        html += '</div>';

        html += '<div class="step">';
        html += '<div class="step-number">📍 Étape 3 : Calculer la valeur moyenne</div>';
        const bma = b - a;
        const moyenne = integrale / bma;
        html += `<div class="step-expression">${kxd(`\\mu = \\frac{1}{${b} - ${a}} \\times ${fmtN(integrale)} = \\frac{1}{${bma}} \\times ${fmtN(integrale)} = \\color{#38a169}{${fmtN(moyenne)}}`)}  </div>`;
        html += '</div>';

        html += '<div class="result-highlight">';
        html += `<div class="final">${kx(`\\boxed{\\mu = ${fmtN(moyenne)}}`)}</div>`;
        html += '</div>';

    } else {
        // Exponentielle
        const ea = s.moy_exp_a;
        const eb = s.moy_exp_b;
        const aStr = ea === 1 ? '' : (ea === -1 ? '-' : `${ea}`);
        const inner = eb === 0 ? `${aStr}x` : (eb > 0 ? `${aStr}x+${eb}` : `${aStr}x${eb}`);
        const coef = latexFrac(1, ea);

        html += '<div class="step">';
        html += '<div class="step-number">📍 Étape 1 : Trouver une primitive</div>';
        html += `<div class="step-expression">${kxd(`f(x) = e^{${inner}}`)}  </div>`;
        html += `<div class="step-expression">${kxd(`F(x) = \\color{#667eea}{${coef} \\, e^{${inner}}}`)}  </div>`;
        html += '</div>';

        const argB = ea * b + eb;
        const argA = ea * a + eb;

        html += '<div class="step">';
        html += '<div class="step-number">📍 Étape 2 : Calculer l\'intégrale</div>';
        html += `<div class="step-expression">${kxd(`\\int_{${a}}^{${b}} e^{${inner}}\\,dx = ${coef}\\left(e^{${argB}} - e^{${argA}}\\right)`)}  </div>`;
        html += '</div>';

        const bma = b - a;
        const valIntegrale = (1 / ea) * (Math.exp(argB) - Math.exp(argA));
        const moyenne = valIntegrale / bma;

        html += '<div class="step">';
        html += '<div class="step-number">📍 Étape 3 : Calculer la valeur moyenne</div>';
        html += `<div class="step-expression">${kxd(`\\mu = \\frac{1}{${bma}} \\times ${coef}\\left(e^{${argB}} - e^{${argA}}\\right)`)}  </div>`;
        html += `<div class="step-expression">${kxd(`\\mu \\approx \\color{#38a169}{${fmtN(moyenne)}}`)}  </div>`;
        html += '</div>';

        const moyFrac = latexFrac(1, ea * bma);
        html += '<div class="result-highlight">';
        html += `<div class="final">${kx(`\\boxed{\\mu = ${moyFrac}\\left(e^{${argB}} - e^{${argA}}\\right) \\approx ${fmtN(moyenne)}}`)}</div>`;
        html += '</div>';
    }

    return html;
}

// ============================================================
// Graphiques
// ============================================================

function drawIntegrale() {
    const s = PrimitivesState;
    if (s.typeIntegrale !== 'polynome') return;

    const coeffs = s.int_coeffs;
    const a = s.int_a;
    const b = s.int_b;

    const func = (x) => evalPoly(coeffs, x);

    // Déterminer les bornes du graphique
    let yMin = -5, yMax = 5;
    for (let x = a - 1; x <= b + 1; x += 0.1) {
        const y = func(x);
        if (y < yMin) yMin = y - 2;
        if (y > yMax) yMax = y + 2;
    }

    const graph = new GraphCanvas('integraleGraph', {
        xMin: Math.min(a - 2, -2),
        xMax: Math.max(b + 2, 5),
        yMin: Math.floor(yMin),
        yMax: Math.ceil(yMax),
        width: 600,
        height: 400
    });

    graph.clear();
    graph.drawGrid();
    graph.drawAxes();
    graph.drawTicks();

    // Colorier l'aire sous la courbe
    fillAreaUnderCurve(graph, func, a, b);

    // Tracer la fonction
    graph.drawFunction(func, '#2196F3', 3);

    // Points des bornes
    graph.drawPoint(a, func(a), '#e74c3c', 5, `a=${a}`);
    graph.drawPoint(b, func(b), '#e74c3c', 5, `b=${b}`);
}

function drawAire() {
    const s = PrimitivesState;
    let func;
    const a = s.aire_a;
    const b = s.aire_b;

    if (s.typeAire === 'polynome') {
        const coeffs = s.aire_coeffs;
        func = (x) => evalPoly(coeffs, x);
    } else {
        const m = s.aire_slope;
        const p = s.aire_intercept;
        func = (x) => m * x + p;
    }

    // Déterminer les bornes du graphique
    let yMin = -5, yMax = 5;
    for (let x = a - 1; x <= b + 1; x += 0.1) {
        const y = func(x);
        if (y < yMin - 1) yMin = y - 2;
        if (y > yMax - 1) yMax = y + 2;
    }

    const graph = new GraphCanvas('aireGraph', {
        xMin: Math.min(a - 2, -2),
        xMax: Math.max(b + 2, 5),
        yMin: Math.floor(yMin),
        yMax: Math.ceil(yMax),
        width: 600,
        height: 400
    });

    graph.clear();
    graph.drawGrid();
    graph.drawAxes();
    graph.drawTicks();

    // Colorier l'aire
    fillAreaUnderCurve(graph, func, a, b);

    // Tracer la fonction
    graph.drawFunction(func, '#2196F3', 3);

    // Bornes verticales
    const ctx = graph.ctx;
    ctx.strokeStyle = '#e74c3c';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 5]);

    [a, b].forEach(xVal => {
        const cx = graph.toCanvasX(xVal);
        const cy0 = graph.toCanvasY(0);
        const cyF = graph.toCanvasY(func(xVal));
        ctx.beginPath();
        ctx.moveTo(cx, cy0);
        ctx.lineTo(cx, cyF);
        ctx.stroke();
    });

    ctx.setLineDash([]);

    graph.drawPoint(a, 0, '#e74c3c', 5, `a=${a}`);
    graph.drawPoint(b, 0, '#e74c3c', 5, `b=${b}`);
}

/**
 * Colorie l'aire entre la courbe et l'axe des x
 */
function fillAreaUnderCurve(graph, func, a, b) {
    const ctx = graph.ctx;
    const step = (b - a) / 300;

    // Aire positive (au-dessus de l'axe)
    ctx.fillStyle = 'rgba(102, 126, 234, 0.25)';
    ctx.beginPath();
    ctx.moveTo(graph.toCanvasX(a), graph.toCanvasY(0));
    for (let x = a; x <= b; x += step) {
        const y = func(x);
        if (y >= 0) {
            ctx.lineTo(graph.toCanvasX(x), graph.toCanvasY(y));
        } else {
            ctx.lineTo(graph.toCanvasX(x), graph.toCanvasY(0));
        }
    }
    ctx.lineTo(graph.toCanvasX(b), graph.toCanvasY(0));
    ctx.closePath();
    ctx.fill();

    // Aire négative (en-dessous de l'axe)
    ctx.fillStyle = 'rgba(229, 62, 62, 0.2)';
    ctx.beginPath();
    ctx.moveTo(graph.toCanvasX(a), graph.toCanvasY(0));
    for (let x = a; x <= b; x += step) {
        const y = func(x);
        if (y < 0) {
            ctx.lineTo(graph.toCanvasX(x), graph.toCanvasY(y));
        } else {
            ctx.lineTo(graph.toCanvasX(x), graph.toCanvasY(0));
        }
    }
    ctx.lineTo(graph.toCanvasX(b), graph.toCanvasY(0));
    ctx.closePath();
    ctx.fill();
}

// ============================================================
// Initialisation
// ============================================================

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPrimitivesPage);
} else {
    initPrimitivesPage();
}
