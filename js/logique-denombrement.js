/* ========================================
   LOGIQUE-DENOMBREMENT.JS - Denombrement, Recurrence, Binome de Newton
   ======================================== */

/**
 * Etat du module Logique et Denombrement
 */
const LogDenomState = {
    currentType: 'denombrement',

    subtype_denombrement: 'combinaison',
    subtype_recurrence: 'somme',
    subtype_binome: 'developpement',

    exercise: {}
};

// ========================================
// Utilitaires locaux
// ========================================

function rint(min, max, excl) {
    const exclude = excl || [];
    let val;
    do {
        val = Math.floor(Math.random() * (max - min + 1)) + min;
    } while (exclude.includes(val));
    return val;
}

function K(tex) {
    return katex.renderToString(tex, { throwOnError: false });
}

function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Factorielle
function fact(n) {
    if (n <= 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
}

// Combinaison C(n, k)
function comb(n, k) {
    if (k < 0 || k > n) return 0;
    if (k === 0 || k === n) return 1;
    k = Math.min(k, n - k);
    let result = 1;
    for (let i = 0; i < k; i++) {
        result = result * (n - i) / (i + 1);
    }
    return Math.round(result);
}

// Arrangement A(n, k) = n! / (n-k)!
function arr(n, k) {
    if (k < 0 || k > n) return 0;
    let result = 1;
    for (let i = 0; i < k; i++) result *= (n - i);
    return result;
}

// Formate un terme du developpement binomial
function binomTerm(coef, a, b, pa, pb) {
    let term = '';
    if (coef !== 1) term += `${coef}`;
    if (a !== 1 || pa > 0) {
        if (pa === 0) {
            // pas de a
        } else if (pa === 1) {
            term += (typeof a === 'string') ? a : `${a}`;
        } else {
            term += (typeof a === 'string') ? `${a}^${pa}` : `${a}^{${pa}}`;
        }
    }
    if (b !== 1 || pb > 0) {
        if (pb === 0) {
            // pas de b
        } else if (pb === 1) {
            term += (typeof b === 'string') ? b : `${b}`;
        } else {
            term += (typeof b === 'string') ? `${b}^${pb}` : `${b}^{${pb}}`;
        }
    }
    if (term === '' || term === '1') term = '1';
    return term;
}

// ========================================
// Initialisation
// ========================================

function initLogDenomPage() {
    $('exDenom').innerHTML = K('C_n^k, A_n^k, n!');
    $('exRecur').innerHTML = K('\\forall n \\geq 1');
    $('exBinom').innerHTML = K('(a+b)^n');

    setupTypeButtons();
    setupInputHandlers();
    setupActionButtons();
    generateNewExercise();
    updateExerciseDisplay();
}

function setupTypeButtons() {
    const typeButtons = document.querySelectorAll('.type-btn');
    typeButtons.forEach(button => {
        button.addEventListener('click', () => {
            typeButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            LogDenomState.currentType = button.dataset.type;

            document.querySelectorAll('[id$="Section"]').forEach(section => {
                section.style.display = 'none';
            });

            const sectionMap = {
                'denombrement': 'denombrementSection',
                'recurrence': 'recurrenceSection',
                'binome': 'binomeSection'
            };
            const sectionId = sectionMap[LogDenomState.currentType];
            if (sectionId) $(sectionId).style.display = 'block';

            generateNewExercise();
            updateExerciseDisplay();
            hideSolution('solutionDiv');
        });
    });
}

function setupInputHandlers() {
    const selects = [
        'subtype_denombrement', 'subtype_recurrence', 'subtype_binome'
    ];
    selects.forEach(id => {
        const el = $(id);
        if (el) {
            el.addEventListener('change', () => {
                LogDenomState[id] = el.value;
                generateNewExercise();
                updateExerciseDisplay();
                hideSolution('solutionDiv');
            });
        }
    });
}

function setupActionButtons() {
    $('newExerciseBtn').addEventListener('click', () => {
        generateNewExercise();
        updateExerciseDisplay();
        hideSolution('solutionDiv');
    });

    $('solveBtn').addEventListener('click', () => {
        solveLogDenom();
    });
}

// ========================================
// Generation des exercices
// ========================================

function generateNewExercise() {
    const type = LogDenomState.currentType;
    switch (type) {
        case 'denombrement': generateDenombrement(); break;
        case 'recurrence': generateRecurrence(); break;
        case 'binome': generateBinome(); break;
    }
}

// --- Denombrement ---
function generateDenombrement() {
    const sub = LogDenomState.subtype_denombrement;
    const ex = {};

    // Contextes pour les exercices
    const contexts_perm = [
        { desc: 'personnes placees en ligne', unit: 'personnes' },
        { desc: 'livres disposes sur une etagere', unit: 'livres' },
        { desc: 'lettres d\'un mot', unit: 'lettres' }
    ];
    const contexts_arr = [
        { desc: 'personnes choisies parmi', unit: 'personnes pour un podium (ordre important)' },
        { desc: 'livres selectionnes parmi', unit: 'livres a classer dans un ordre precis' },
        { desc: 'chiffres choisis parmi', unit: 'chiffres distincts pour former un code (ordre important)' }
    ];
    const contexts_comb = [
        { desc: 'personnes choisies parmi', unit: 'personnes pour former un groupe' },
        { desc: 'cartes tirees parmi', unit: 'cartes d\'un jeu' },
        { desc: 'eleves selectionnes parmi', unit: 'eleves pour former un comite' }
    ];

    if (sub === 'permutation') {
        ex.n = rint(3, 8);
        ex.context = pick(contexts_perm);
        ex.result = fact(ex.n);
    } else if (sub === 'arrangement') {
        ex.n = rint(5, 10);
        ex.k = rint(2, Math.min(ex.n - 1, 5));
        ex.context = pick(contexts_arr);
        ex.result = arr(ex.n, ex.k);
    } else {
        ex.n = rint(5, 12);
        ex.k = rint(2, Math.min(ex.n - 1, 6));
        ex.context = pick(contexts_comb);
        ex.result = comb(ex.n, ex.k);
    }

    LogDenomState.exercise = ex;
}

// --- Recurrence ---
function generateRecurrence() {
    const sub = LogDenomState.subtype_recurrence;
    const ex = {};

    if (sub === 'somme') {
        // Choisir parmi plusieurs formules classiques
        const formulas = [
            {
                name: 'somme_entiers',
                statement: '\\displaystyle\\sum_{k=1}^{n} k = \\dfrac{n(n+1)}{2}',
                lhs: '1 + 2 + \\ldots + n',
                rhs: '\\dfrac{n(n+1)}{2}',
                init_n: 1, init_lhs: '1', init_rhs: '\\dfrac{1 \\times 2}{2} = 1',
                hered_lhs: '(1 + 2 + \\ldots + n) + (n+1)',
                hered_rhs: '\\dfrac{n(n+1)}{2} + (n+1)',
                hered_simp: '\\dfrac{n(n+1) + 2(n+1)}{2} = \\dfrac{(n+1)(n+2)}{2}',
                hered_check: '\\dfrac{(n+1)((n+1)+1)}{2}'
            },
            {
                name: 'somme_carres',
                statement: '\\displaystyle\\sum_{k=1}^{n} k^2 = \\dfrac{n(n+1)(2n+1)}{6}',
                lhs: '1^2 + 2^2 + \\ldots + n^2',
                rhs: '\\dfrac{n(n+1)(2n+1)}{6}',
                init_n: 1, init_lhs: '1^2 = 1', init_rhs: '\\dfrac{1 \\times 2 \\times 3}{6} = 1',
                hered_lhs: '(1^2 + \\ldots + n^2) + (n+1)^2',
                hered_rhs: '\\dfrac{n(n+1)(2n+1)}{6} + (n+1)^2',
                hered_simp: '\\dfrac{n(n+1)(2n+1) + 6(n+1)^2}{6} = \\dfrac{(n+1)(2n^2+7n+6)}{6} = \\dfrac{(n+1)(n+2)(2n+3)}{6}',
                hered_check: '\\dfrac{(n+1)((n+1)+1)(2(n+1)+1)}{6}'
            },
            {
                name: 'somme_geo',
                statement: '\\displaystyle\\sum_{k=0}^{n} q^k = \\dfrac{q^{n+1} - 1}{q - 1} \\quad (q \\neq 1)',
                lhs: '1 + q + q^2 + \\ldots + q^n',
                rhs: '\\dfrac{q^{n+1} - 1}{q - 1}',
                init_n: 0, init_lhs: 'q^0 = 1', init_rhs: '\\dfrac{q^1 - 1}{q - 1} = 1',
                hered_lhs: '\\left(1 + q + \\ldots + q^n\\right) + q^{n+1}',
                hered_rhs: '\\dfrac{q^{n+1} - 1}{q - 1} + q^{n+1}',
                hered_simp: '\\dfrac{q^{n+1} - 1 + q^{n+1}(q - 1)}{q - 1} = \\dfrac{q^{n+2} - 1}{q - 1}',
                hered_check: '\\dfrac{q^{(n+1)+1} - 1}{q - 1}'
            }
        ];
        ex.formula = pick(formulas);
    } else {
        // inegalite
        const inequalities = [
            {
                name: 'puissance_entier',
                statement: '2^n > n \\text{ pour tout } n \\geq 1',
                init_n: 1, init_lhs: '2^1 = 2', init_rhs: '1', init_ok: '2 > 1',
                hered_assumption: '2^n > n',
                hered_step: '2^{n+1} = 2 \\times 2^n > 2n',
                hered_conclusion: '2n \\geq n + 1 \\text{ pour } n \\geq 1, \\text{ donc } 2^{n+1} > n + 1'
            },
            {
                name: 'factorielle',
                statement: 'n! \\geq 2^{n-1} \\text{ pour tout } n \\geq 1',
                init_n: 1, init_lhs: '1! = 1', init_rhs: '2^0 = 1', init_ok: '1 \\geq 1',
                hered_assumption: 'n! \\geq 2^{n-1}',
                hered_step: '(n+1)! = (n+1) \\times n! \\geq (n+1) \\times 2^{n-1}',
                hered_conclusion: '(n+1) \\times 2^{n-1} \\geq 2 \\times 2^{n-1} = 2^n \\text{ pour } n+1 \\geq 2'
            },
            {
                name: 'puissance_3',
                statement: '3^n \\geq 2n + 1 \\text{ pour tout } n \\geq 1',
                init_n: 1, init_lhs: '3^1 = 3', init_rhs: '2(1)+1 = 3', init_ok: '3 \\geq 3',
                hered_assumption: '3^n \\geq 2n + 1',
                hered_step: '3^{n+1} = 3 \\times 3^n \\geq 3(2n+1) = 6n + 3',
                hered_conclusion: '6n + 3 \\geq 2(n+1) + 1 = 2n + 3 \\text{ car } 4n \\geq 0'
            }
        ];
        ex.ineq = pick(inequalities);
    }

    LogDenomState.exercise = ex;
}

// --- Binome de Newton ---
function generateBinome() {
    const sub = LogDenomState.subtype_binome;
    const ex = {};

    if (sub === 'developpement') {
        ex.n = pick([2, 3, 4]);
        // Choisir a et b simples
        const pairs = [
            { a: 'x', b: '1', aTeX: 'x', bTeX: '1' },
            { a: 'x', b: '2', aTeX: 'x', bTeX: '2' },
            { a: 'x', b: '-1', aTeX: 'x', bTeX: '-1' },
            { a: '2x', b: '1', aTeX: '2x', bTeX: '1' },
            { a: 'x', b: 'y', aTeX: 'x', bTeX: 'y' },
            { a: '1', b: 'x', aTeX: '1', bTeX: 'x' }
        ];
        ex.pair = pick(pairs);
    } else if (sub === 'coefficient') {
        ex.n = rint(4, 12);
        ex.k = rint(1, ex.n - 1);
        ex.result = comb(ex.n, ex.k);
    } else {
        // terme: terme de rang k dans (a+b)^n
        ex.n = pick([3, 4, 5, 6]);
        ex.k = rint(1, ex.n - 1); // rang entre 1 et n-1
        const pairs = [
            { a: 'x', b: '1', aTeX: 'x', bTeX: '1' },
            { a: 'x', b: '2', aTeX: 'x', bTeX: '2' },
            { a: 'x', b: '-1', aTeX: 'x', bTeX: '-1' },
            { a: '2', b: 'x', aTeX: '2', bTeX: 'x' }
        ];
        ex.pair = pick(pairs);
        ex.coef = comb(ex.n, ex.k);
    }

    LogDenomState.exercise = ex;
}

// ========================================
// Affichage de l'exercice
// ========================================

function updateExerciseDisplay() {
    const type = LogDenomState.currentType;
    const sub = LogDenomState['subtype_' + type];
    const ex = LogDenomState.exercise;
    let tex = '';

    if (type === 'denombrement') {
        if (sub === 'permutation') {
            tex = `\\text{On dispose de } ${ex.n} \\text{ ${ex.context.desc}.}`;
            tex += `\\\\[6pt] \\text{Calculer le nombre de permutations } P_{${ex.n}} = ${ex.n}!`;
        } else if (sub === 'arrangement') {
            tex = `\\text{On dispose de } ${ex.n} \\text{ ${ex.context.unit.split('(')[0].trim()}.}`;
            tex += `\\\\[6pt] \\text{Calculer } A_{${ex.n}}^{${ex.k}} = \\dfrac{${ex.n}!}{(${ex.n} - ${ex.k})!}`;
        } else {
            tex = `\\text{On dispose de } ${ex.n} \\text{ ${ex.context.unit.split('(')[0].trim()}.}`;
            tex += `\\\\[6pt] \\text{Calculer } C_{${ex.n}}^{${ex.k}} = \\binom{${ex.n}}{${ex.k}}`;
        }
    } else if (type === 'recurrence') {
        if (sub === 'somme') {
            tex = `\\text{Demontrer par recurrence que pour tout } n \\geq ${ex.formula.init_n} :`;
            tex += `\\\\[6pt] ${ex.formula.statement}`;
        } else {
            tex = `\\text{Demontrer par recurrence :}`;
            tex += `\\\\[6pt] ${ex.ineq.statement}`;
        }
    } else {
        if (sub === 'developpement') {
            tex = `\\text{Developper } (${ex.pair.aTeX} + ${ex.pair.bTeX})^{${ex.n}} \\text{ a l'aide du binome de Newton.}`;
        } else if (sub === 'coefficient') {
            tex = `\\text{Calculer } C_{${ex.n}}^{${ex.k}} = \\binom{${ex.n}}{${ex.k}}`;
        } else {
            tex = `\\text{Developper } (${ex.pair.aTeX} + ${ex.pair.bTeX})^{${ex.n}}.`;
            tex += `\\\\[6pt] \\text{Quel est le terme de rang } k = ${ex.k} \\text{ ?}`;
        }
    }

    $('expressionDisplay').innerHTML = K(tex);
}

// ========================================
// Correction
// ========================================

function solveLogDenom() {
    const type = LogDenomState.currentType;
    const sub = LogDenomState['subtype_' + type];
    const ex = LogDenomState.exercise;

    let html = '';

    if (type === 'denombrement') {
        html = solveDenombrement(ex, sub);
    } else if (type === 'recurrence') {
        html = solveRecurrence(ex, sub);
    } else {
        html = solveBinome(ex, sub);
    }

    $('stepsContainer').innerHTML = html;
    showSolution('solutionDiv');
}

// --- Correction Denombrement ---
function solveDenombrement(ex, sub) {
    let html = '';

    if (sub === 'permutation') {
        html += step('Definition des permutations',
            `P_n = n!`,
            `Le nombre de facons d'ordonner n objets distincts est egal a n! (factorielle de n).`);

        html += step('Calcul de la factorielle',
            `P_{${ex.n}} = ${ex.n}! = 1 \\times 2 \\times 3 \\times \\ldots \\times ${ex.n}`,
            'On multiplie tous les entiers de 1 a n.');

        // Afficher les etapes intermediaires
        let prod = '';
        for (let i = 1; i <= ex.n; i++) {
            prod += (i === 1 ? '' : ' \\times ') + i;
        }
        html += step('Calcul explicite',
            `${prod} = ${ex.result}`,
            '');

        html += resultBlock(`P_{${ex.n}} = ${ex.n}! = ${ex.result}`,
            `Il y a ${ex.result} facons differentes d'ordonner ${ex.n} ${ex.context.desc}.`);

    } else if (sub === 'arrangement') {
        html += step('Formule des arrangements',
            `A_n^k = \\dfrac{n!}{(n-k)!}`,
            `Le nombre d'arrangements de k elements parmi n est le nombre de facons de choisir et ordonner k elements distincts parmi n.`);

        html += step('Application numerique',
            `A_{${ex.n}}^{${ex.k}} = \\dfrac{${ex.n}!}{(${ex.n} - ${ex.k})!} = \\dfrac{${ex.n}!}{${ex.n - ex.k}!}`,
            '');

        // Calcul explicite : produit n * (n-1) * ... * (n-k+1)
        const terms = [];
        for (let i = 0; i < ex.k; i++) terms.push(ex.n - i);
        html += step('Simplification',
            `A_{${ex.n}}^{${ex.k}} = ${terms.join(' \\times ')} = ${ex.result}`,
            'On annule (n-k)! en haut et en bas, il reste le produit de k termes consecutifs.');

        html += resultBlock(`A_{${ex.n}}^{${ex.k}} = ${ex.result}`,
            `Il y a ${ex.result} arrangements possibles.`);

    } else {
        html += step('Formule des combinaisons',
            `C_n^k = \\binom{n}{k} = \\dfrac{n!}{k! \\,(n-k)!} = \\dfrac{A_n^k}{k!}`,
            'Le nombre de facons de choisir k elements parmi n (ordre indifferent). C\'est l\'arrangement divise par k! car l\'ordre ne compte pas.');

        html += step('Application numerique',
            `C_{${ex.n}}^{${ex.k}} = \\dfrac{${ex.n}!}{${ex.k}! \\times ${ex.n - ex.k}!}`,
            '');

        // Numerateur : produit des k termes
        const numTerms = [];
        for (let i = 0; i < ex.k; i++) numTerms.push(ex.n - i);
        const numStr = numTerms.join(' \\times ');
        const denomStr = `${fact(ex.k)}`;

        html += step('Simplification',
            `C_{${ex.n}}^{${ex.k}} = \\dfrac{${numStr}}{${fact(ex.k)}} = \\dfrac{${arr(ex.n, ex.k)}}{${fact(ex.k)}} = ${ex.result}`,
            `On annule (${ex.n - ex.k})! et on calcule le rapport.`);

        html += resultBlock(`C_{${ex.n}}^{${ex.k}} = \\binom{${ex.n}}{${ex.k}} = ${ex.result}`,
            `Il y a ${ex.result} facons de choisir ${ex.k} elements parmi ${ex.n}.`);
    }

    return html;
}

// --- Correction Recurrence ---
function solveRecurrence(ex, sub) {
    let html = '';

    if (sub === 'somme') {
        const f = ex.formula;

        html += step('Structure du raisonnement par recurrence',
            '',
            'Une demonstration par recurrence comporte deux etapes : l\'initialisation (verifier la propriete pour le premier rang) et l\'heredite (montrer que si la propriete est vraie au rang n, elle l\'est aussi au rang n+1).');

        // Initialisation
        html += step(`Etape 1 : Initialisation (n = ${f.init_n})`,
            `\\text{Membre gauche} = ${f.init_lhs} \\qquad \\text{Membre droit} = ${f.init_rhs}`,
            `La propriete est vraie au rang n = ${f.init_n}.`);

        // Heredite - hypothese
        html += step('Etape 2 : Heredite',
            '',
            `Supposons que la propriete soit vraie au rang n (hypothese de recurrence) : on suppose ${f.lhs} = ${f.rhs}.`);

        html += step('Hypothese de recurrence (H.R.)',
            `${f.lhs} = ${f.rhs}`,
            'On doit montrer que la propriete est vraie au rang n+1.');

        // Calcul au rang n+1
        html += step('Calcul au rang n+1',
            `${f.hered_lhs} = ${f.hered_rhs}`,
            'On utilise l\'hypothese de recurrence pour remplacer la somme jusqu\'a n.');

        html += step('Simplification',
            `= ${f.hered_simp}`,
            '');

        html += step('Verification : c\'est bien la formule au rang n+1',
            `= ${f.hered_check}`,
            'La propriete est bien verifiee au rang n+1.');

        // Conclusion
        html += resultBlock(
            `\\forall n \\geq ${f.init_n}, \\quad ${f.statement}`,
            'La propriete est vraie au rang initial, et si elle est vraie au rang n, elle l\'est au rang n+1. Par le principe de recurrence, elle est vraie pour tout entier n.');

    } else {
        const ineq = ex.ineq;

        html += step('Structure du raisonnement par recurrence',
            '',
            'On montre l\'inegalite par recurrence : initialisation au rang de depart, puis heredite.');

        html += step(`Etape 1 : Initialisation (n = ${ineq.init_n})`,
            `${ineq.init_lhs} \\text{ et } ${ineq.init_rhs} \\implies ${ineq.init_ok}`,
            `L'inegalite est vraie au rang n = ${ineq.init_n}.`);

        html += step('Etape 2 : Heredite - Hypothese de recurrence',
            `\\text{Supposons : } ${ineq.hered_assumption}`,
            'On doit montrer que l\'inegalite est vraie au rang n+1.');

        html += step('Demonstration au rang n+1',
            `${ineq.hered_step}`,
            '');

        html += step('Conclusion de l\'heredite',
            `${ineq.hered_conclusion}`,
            'L\'inegalite est donc verifiee au rang n+1.');

        html += resultBlock(ineq.statement,
            'Par le principe de recurrence, l\'inegalite est vraie pour tout entier n >= 1.');
    }

    return html;
}

// --- Correction Binome de Newton ---
function solveBinome(ex, sub) {
    let html = '';

    if (sub === 'coefficient') {
        html += step('Formule des coefficients binomiaux',
            `C_n^k = \\binom{n}{k} = \\dfrac{n!}{k!(n-k)!}`,
            '');

        html += step('Application numerique',
            `C_{${ex.n}}^{${ex.k}} = \\dfrac{${ex.n}!}{${ex.k}! \\times ${ex.n - ex.k}!}`,
            '');

        const numTerms = [];
        for (let i = 0; i < ex.k; i++) numTerms.push(ex.n - i);

        html += step('Calcul',
            `C_{${ex.n}}^{${ex.k}} = \\dfrac{${numTerms.join(' \\times ')}}{${fact(ex.k)}} = \\dfrac{${arr(ex.n, ex.k)}}{${fact(ex.k)}} = ${ex.result}`,
            '');

        html += resultBlock(`\\binom{${ex.n}}{${ex.k}} = ${ex.result}`, '');

    } else if (sub === 'developpement') {
        const n = ex.n;
        const p = ex.pair;

        html += step('Formule du binome de Newton',
            `(a+b)^n = \\sum_{k=0}^{n} \\binom{n}{k} a^{n-k} b^k`,
            `Chaque terme est de la forme C_n^k * a^(n-k) * b^k.`);

        // Generer les termes
        const terms = [];
        for (let k = 0; k <= n; k++) {
            const c = comb(n, k);
            const pa = n - k;
            const pb = k;
            terms.push({ c, pa, pb });
        }

        // Afficher la formule generale avec les coefficients
        let coeffs = terms.map(t => `\\binom{${n}}{${t.pb}}`).join(' + \\ldots + ');
        const coeffLine = terms.map(t => `${t.c}`).join(', ');

        html += step('Coefficients binomiaux',
            terms.map(t => `\\binom{${n}}{${t.pb}} = ${t.c}`).join(' \\quad '),
            '');

        // Construction du developpement
        let devTerms = [];
        for (const t of terms) {
            let term = '';
            const isFirst = devTerms.length === 0;

            // Coefficient
            const coef = t.c;

            // Construction du terme LaTeX
            let parts = [];
            if (coef !== 1) parts.push(`${coef}`);

            // Partie en a
            if (p.aTeX === '1') {
                // 1^pa = 1, pas besoin de l'afficher
            } else {
                if (t.pa === 0) {
                    // rien (a^0 = 1)
                } else if (t.pa === 1) {
                    parts.push(p.aTeX);
                } else {
                    parts.push(`${p.aTeX}^{${t.pa}}`);
                }
            }

            // Partie en b
            if (p.bTeX === '1') {
                // 1^pb = 1, pas besoin de l'afficher
            } else if (p.bTeX === '-1') {
                // (-1)^k
                if (t.pb === 0) {
                    // 1
                } else if (t.pb % 2 === 1) {
                    // negatif : inverser le signe du coefficient
                    if (parts.length > 0 && parts[0] !== '') {
                        // On a deja un coef, on le met negatif
                        const c_str = parts.shift();
                        parts.unshift(`-${c_str}`);
                    } else if (coef === 1) {
                        parts[0] = '-';
                    }
                }
                // pb pair : positif, rien a faire
            } else {
                if (t.pb === 0) {
                    // rien
                } else if (t.pb === 1) {
                    parts.push(p.bTeX);
                } else {
                    parts.push(`${p.bTeX}^{${t.pb}}`);
                }
            }

            if (parts.length === 0) parts.push('1');
            term = parts.join('');

            devTerms.push(term);
        }

        let develTeX = devTerms[0];
        for (let i = 1; i < devTerms.length; i++) {
            const t = devTerms[i];
            if (t.startsWith('-')) develTeX += ` ${t}`;
            else develTeX += ` + ${t}`;
        }

        html += resultBlock(
            `(${p.aTeX} + ${p.bTeX})^{${n}} = ${develTeX}`,
            '');

    } else {
        // terme de rang k
        const n = ex.n;
        const k = ex.k;
        const p = ex.pair;
        const c = comb(n, k);

        html += step('Terme general du binome de Newton',
            `T_{k+1} = \\binom{n}{k} a^{n-k} b^k`,
            `Le terme de rang k (on commence a k=0) dans le developpement de (a+b)^n est : C_n^k * a^(n-k) * b^k.`);

        html += step(`Application : terme de rang k = ${k}`,
            `T_{${k+1}} = \\binom{${n}}{${k}} \\cdot (${p.aTeX})^{${n-k}} \\cdot (${p.bTeX})^{${k}}`,
            '');

        html += step(`Calcul du coefficient C_${n}^${k}`,
            `\\binom{${n}}{${k}} = ${c}`,
            '');

        // Simplification du terme
        let term = '';
        if (c !== 1) term += `${c}`;
        if (p.aTeX !== '1') {
            if (n - k === 0) {
                // rien (= 1)
            } else if (n - k === 1) {
                term += p.aTeX;
            } else {
                term += `${p.aTeX}^{${n - k}}`;
            }
        }
        if (p.bTeX !== '1') {
            if (k === 0) {
                // rien
            } else if (k === 1) {
                term += p.bTeX;
            } else {
                term += `${p.bTeX}^{${k}}`;
            }
        }
        if (term === '') term = '1';

        html += resultBlock(
            `T_{${k+1}} = ${term}`,
            `Le terme de rang k = ${k} dans le developpement de (${p.aTeX} + ${p.bTeX})^{${n}}.`);
    }

    return html;
}

// ========================================
// Helpers HTML
// ========================================

function step(title, tex, expl) {
    let html = '<div class="step">';
    if (title) html += `<div class="step-number">${title}</div>`;
    if (tex) html += `<div class="step-expression">${K(tex)}</div>`;
    if (expl) html += `<div class="step-explanation">${expl}</div>`;
    html += '</div>';
    return html;
}

function resultBlock(tex, expl) {
    let html = '<div class="result-highlight">';
    html += `<div class="final">${K(tex)}</div>`;
    if (expl) html += `<div class="step-explanation" style="margin-top:8px">${expl}</div>`;
    html += '</div>';
    return html;
}

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', () => {
    initLogDenomPage();
});
