/* ========================================
   LOGIQUE-DENOMBREMENT.JS - Denombrement, Recurrence, Binome de Newton
   ======================================== */

/**
 * Etat du module Logique et Denombrement
 */
const LogDenomState = {
    currentType: 'denombrement',

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

// Formater un signe pour affichage
function signStr(val) {
    return val >= 0 ? '+' : '-';
}

// ========================================
// Banque de problemes de denombrement
// ========================================

const PROBLEMES_DENOMBREMENT = [
    // --- PERMUTATIONS ---
    {
        type: 'permutation',
        enonce: (n) => `${n} coureurs franchissent la ligne d'arrivee d'une course. Combien de classements differents sont possibles ?`,
        n_range: [4, 8],
        explication: (n) => `L'ordre d'arrivee compte et tous les ${n} coureurs sont classes.`
    },
    {
        type: 'permutation',
        enonce: (n) => `${n} eleves doivent se placer en file indienne pour entrer en classe. Combien de files differentes peut-on former ?`,
        n_range: [4, 7],
        explication: (n) => `On ordonne la totalite des ${n} eleves, chaque position dans la file est distincte.`
    },
    {
        type: 'permutation',
        enonce: (n) => `On dispose de ${n} livres differents a ranger sur une etagere. De combien de facons peut-on les disposer ?`,
        n_range: [4, 8],
        explication: (n) => `Chaque livre occupe une position differente et tous les ${n} livres sont utilises.`
    },
    {
        type: 'permutation',
        enonce: (n) => `${n} equipes participent a un tournoi. Combien de classements finaux differents sont possibles ?`,
        n_range: [4, 7],
        explication: (n) => `Chaque equipe a un rang final distinct et les ${n} equipes sont toutes classees.`
    },
    {
        type: 'permutation',
        enonce: (n) => `Un mot est forme de ${n} lettres toutes differentes. Combien d'anagrammes peut-on former avec ces lettres ?`,
        n_range: [4, 7],
        explication: (n) => `On utilise les ${n} lettres dans un ordre different a chaque fois : c'est un rearrangement complet.`
    },

    // --- ARRANGEMENTS ---
    {
        type: 'arrangement',
        enonce: (n, k) => `Un club de ${n} membres doit elire un president, un vice-president et un secretaire. De combien de facons peut-on constituer ce bureau ?`,
        n_range: [8, 15],
        k_fixed: 3,
        explication: (n, k) => `On choisit ${k} personnes parmi ${n} et l'ordre compte (president ≠ secretaire).`
    },
    {
        type: 'arrangement',
        enonce: (n, k) => `On forme un code de ${k} chiffres distincts a partir des chiffres 0, 1, 2, ..., ${n - 1}. Combien de codes peut-on obtenir ?`,
        n_range: [6, 10],
        k_range: [3, 4],
        explication: (n, k) => `On choisit ${k} chiffres parmi ${n} et l'ordre des chiffres dans le code compte.`
    },
    {
        type: 'arrangement',
        enonce: (n, k) => `Lors d'une competition, ${k} medailles (or, argent, bronze) sont attribuees a ${k} athletes parmi ${n} participants. Combien de podiums differents sont possibles ?`,
        n_range: [8, 15],
        k_fixed: 3,
        explication: (n, k) => `On choisit ${k} athletes parmi ${n} et l'ordre sur le podium importe (or ≠ bronze).`
    },
    {
        type: 'arrangement',
        enonce: (n, k) => `On distribue ${k} prix differents (1er prix, 2e prix, ...) a ${k} candidats parmi ${n}. Un candidat ne peut recevoir qu'un seul prix. Combien de distributions sont possibles ?`,
        n_range: [7, 12],
        k_range: [2, 4],
        explication: (n, k) => `Les ${k} prix sont distincts et attribues a des candidats differents parmi ${n} : l'ordre compte.`
    },
    {
        type: 'arrangement',
        enonce: (n, k) => `${n} chevaux participent a une course. De combien de facons peut-on prevoir les ${k} premiers dans l'ordre d'arrivee ?`,
        n_range: [8, 14],
        k_range: [2, 4],
        explication: (n, k) => `On choisit ${k} chevaux parmi ${n} et leur classement (1er, 2e, ...) compte.`
    },

    // --- COMBINAISONS ---
    {
        type: 'combinaison',
        enonce: (n, k) => `On tire ${k} cartes simultanement dans un jeu de ${n} cartes. Combien de mains differentes peut-on obtenir ?`,
        n_range: [20, 32],
        k_range: [3, 5],
        explication: (n, k) => `On choisit ${k} cartes parmi ${n} et l'ordre dans lequel on les tire n'importe pas.`
    },
    {
        type: 'combinaison',
        enonce: (n, k) => `On choisit ${k} eleves parmi ${n} pour former une equipe de projet. Combien d'equipes peut-on constituer ?`,
        n_range: [8, 15],
        k_range: [3, 5],
        explication: (n, k) => `On selectionne ${k} eleves parmi ${n} sans distinction de role : l'ordre ne compte pas.`
    },
    {
        type: 'combinaison',
        enonce: (n, k) => `Un comite de ${k} personnes doit etre forme parmi ${n} volontaires. Combien de comites differents peut-on constituer ?`,
        n_range: [8, 14],
        k_range: [3, 5],
        explication: (n, k) => `Tous les membres du comite ont le meme statut : seule la composition compte, pas l'ordre.`
    },
    {
        type: 'combinaison',
        enonce: (n, k) => `On choisit ${k} livres parmi ${n} pour les emporter en vacances. Combien de selections differentes peut-on faire ?`,
        n_range: [8, 15],
        k_range: [3, 5],
        explication: (n, k) => `On selectionne ${k} livres parmi ${n} sans notion d'ordre : seul le choix des livres compte.`
    },
    {
        type: 'combinaison',
        enonce: (n, k) => `Une urne contient ${n} boules numerotees de 1 a ${n}. On tire simultanement ${k} boules. Combien de tirages differents sont possibles ?`,
        n_range: [10, 20],
        k_range: [3, 5],
        explication: (n, k) => `Le tirage est simultane : l'ordre de sortie des boules n'a pas d'importance.`
    }
];

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
    const selects = ['subtype_recurrence', 'subtype_binome'];
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
    const prob = pick(PROBLEMES_DENOMBREMENT);
    const ex = {};

    ex.type = prob.type;
    ex.n = rint(prob.n_range[0], prob.n_range[1]);

    if (prob.type === 'permutation') {
        ex.k = null;
        ex.result = fact(ex.n);
    } else {
        if (prob.k_fixed) {
            ex.k = prob.k_fixed;
        } else {
            ex.k = rint(prob.k_range[0], Math.min(prob.k_range[1], ex.n - 1));
        }
        if (prob.type === 'arrangement') {
            ex.result = arr(ex.n, ex.k);
        } else {
            ex.result = comb(ex.n, ex.k);
        }
    }

    ex.enonce = prob.enonce(ex.n, ex.k);
    ex.explication = prob.explication(ex.n, ex.k);

    LogDenomState.exercise = ex;
}

// --- Recurrence ---
function generateRecurrence() {
    const sub = LogDenomState.subtype_recurrence;
    const ex = {};

    if (sub === 'somme') {
        const formulaGenerators = [
            generateSommeEntiers,
            generateSommeCarres,
            generateSommeGeo,
            generateSommeLineaire,
            generateSommeCubes,
            generateSommeKKPlus1,
            generateSommeImpairs
        ];
        ex.formula = pick(formulaGenerators)();
    } else {
        const inequalityGenerators = [
            generateIneqPuissance2,
            generateIneqFactorielle,
            generateIneqPuissance3,
            generateIneqBernoulli,
            generateIneqPuissanceVsPolynome
        ];
        ex.ineq = pick(inequalityGenerators)();
    }

    LogDenomState.exercise = ex;
}

// -- Formules de somme --

function generateSommeEntiers() {
    return {
        name: 'somme_entiers',
        statement: '\\displaystyle\\sum_{k=1}^{n} k = \\dfrac{n(n+1)}{2}',
        lhs: '1 + 2 + \\ldots + n',
        rhs: '\\dfrac{n(n+1)}{2}',
        init_n: 1, init_lhs: '1', init_rhs: '\\dfrac{1 \\times 2}{2} = 1',
        hered_lhs: '(1 + 2 + \\ldots + n) + (n+1)',
        hered_rhs: '\\dfrac{n(n+1)}{2} + (n+1)',
        hered_simp: '\\dfrac{n(n+1) + 2(n+1)}{2} = \\dfrac{(n+1)(n+2)}{2}',
        hered_check: '\\dfrac{(n+1)((n+1)+1)}{2}'
    };
}

function generateSommeCarres() {
    return {
        name: 'somme_carres',
        statement: '\\displaystyle\\sum_{k=1}^{n} k^2 = \\dfrac{n(n+1)(2n+1)}{6}',
        lhs: '1^2 + 2^2 + \\ldots + n^2',
        rhs: '\\dfrac{n(n+1)(2n+1)}{6}',
        init_n: 1, init_lhs: '1^2 = 1', init_rhs: '\\dfrac{1 \\times 2 \\times 3}{6} = 1',
        hered_lhs: '(1^2 + \\ldots + n^2) + (n+1)^2',
        hered_rhs: '\\dfrac{n(n+1)(2n+1)}{6} + (n+1)^2',
        hered_simp: '\\dfrac{n(n+1)(2n+1) + 6(n+1)^2}{6} = \\dfrac{(n+1)(2n^2+7n+6)}{6} = \\dfrac{(n+1)(n+2)(2n+3)}{6}',
        hered_check: '\\dfrac{(n+1)((n+1)+1)(2(n+1)+1)}{6}'
    };
}

function generateSommeGeo() {
    return {
        name: 'somme_geo',
        statement: '\\displaystyle\\sum_{k=0}^{n} q^k = \\dfrac{q^{n+1} - 1}{q - 1} \\quad (q \\neq 1)',
        lhs: '1 + q + q^2 + \\ldots + q^n',
        rhs: '\\dfrac{q^{n+1} - 1}{q - 1}',
        init_n: 0, init_lhs: 'q^0 = 1', init_rhs: '\\dfrac{q^1 - 1}{q - 1} = 1',
        hered_lhs: '\\left(1 + q + \\ldots + q^n\\right) + q^{n+1}',
        hered_rhs: '\\dfrac{q^{n+1} - 1}{q - 1} + q^{n+1}',
        hered_simp: '\\dfrac{q^{n+1} - 1 + q^{n+1}(q - 1)}{q - 1} = \\dfrac{q^{n+2} - 1}{q - 1}',
        hered_check: '\\dfrac{q^{(n+1)+1} - 1}{q - 1}'
    };
}

function generateSommeLineaire() {
    const a = pick([2, 3, 4, 5]);
    const b = pick([-2, -1, 1, 2, 3]);
    const bSign = b >= 0 ? '+' : '-';
    const bAbs = Math.abs(b);
    const initVal = a + b;

    // RHS: a*n(n+1)/2 + b*n
    const rhsTeX = `\\dfrac{${a}n(n+1)}{2} ${bSign} ${bAbs}n`;
    const initRHS = `\\dfrac{${a} \\times 1 \\times 2}{2} ${bSign} ${bAbs} \\times 1 = ${initVal}`;

    return {
        name: 'somme_lineaire',
        statement: `\\displaystyle\\sum_{k=1}^{n} (${a}k ${bSign} ${bAbs}) = ${rhsTeX}`,
        lhs: `(${a} \\cdot 1 ${bSign} ${bAbs}) + (${a} \\cdot 2 ${bSign} ${bAbs}) + \\ldots + (${a}n ${bSign} ${bAbs})`,
        rhs: rhsTeX,
        init_n: 1,
        init_lhs: `${a} \\times 1 ${bSign} ${bAbs} = ${initVal}`,
        init_rhs: initRHS,
        hered_lhs: `\\left[\\sum_{k=1}^{n} (${a}k ${bSign} ${bAbs})\\right] + (${a}(n+1) ${bSign} ${bAbs})`,
        hered_rhs: `${rhsTeX} + ${a}(n+1) ${bSign} ${bAbs}`,
        hered_simp: `\\dfrac{${a}(n+1)(n+2)}{2} ${bSign} ${bAbs}(n+1)`,
        hered_check: `\\dfrac{${a}(n+1)((n+1)+1)}{2} ${bSign} ${bAbs}(n+1)`
    };
}

function generateSommeCubes() {
    return {
        name: 'somme_cubes',
        statement: '\\displaystyle\\sum_{k=1}^{n} k^3 = \\left[\\dfrac{n(n+1)}{2}\\right]^2',
        lhs: '1^3 + 2^3 + \\ldots + n^3',
        rhs: '\\left[\\dfrac{n(n+1)}{2}\\right]^2',
        init_n: 1, init_lhs: '1^3 = 1', init_rhs: '\\left[\\dfrac{1 \\times 2}{2}\\right]^2 = 1',
        hered_lhs: '(1^3 + 2^3 + \\ldots + n^3) + (n+1)^3',
        hered_rhs: '\\left[\\dfrac{n(n+1)}{2}\\right]^2 + (n+1)^3',
        hered_simp: '(n+1)^2\\left[\\dfrac{n^2}{4} + (n+1)\\right] = (n+1)^2 \\cdot \\dfrac{n^2 + 4n + 4}{4} = \\left[\\dfrac{(n+1)(n+2)}{2}\\right]^2',
        hered_check: '\\left[\\dfrac{(n+1)((n+1)+1)}{2}\\right]^2'
    };
}

function generateSommeKKPlus1() {
    return {
        name: 'somme_kkplus1',
        statement: '\\displaystyle\\sum_{k=1}^{n} k(k+1) = \\dfrac{n(n+1)(n+2)}{3}',
        lhs: '1 \\times 2 + 2 \\times 3 + \\ldots + n(n+1)',
        rhs: '\\dfrac{n(n+1)(n+2)}{3}',
        init_n: 1, init_lhs: '1 \\times 2 = 2', init_rhs: '\\dfrac{1 \\times 2 \\times 3}{3} = 2',
        hered_lhs: '\\left[1 \\times 2 + \\ldots + n(n+1)\\right] + (n+1)(n+2)',
        hered_rhs: '\\dfrac{n(n+1)(n+2)}{3} + (n+1)(n+2)',
        hered_simp: '(n+1)(n+2)\\left[\\dfrac{n}{3} + 1\\right] = (n+1)(n+2) \\cdot \\dfrac{n+3}{3} = \\dfrac{(n+1)(n+2)(n+3)}{3}',
        hered_check: '\\dfrac{(n+1)((n+1)+1)((n+1)+2)}{3}'
    };
}

function generateSommeImpairs() {
    return {
        name: 'somme_impairs',
        statement: '\\displaystyle\\sum_{k=1}^{n} (2k-1) = n^2',
        lhs: '1 + 3 + 5 + \\ldots + (2n-1)',
        rhs: 'n^2',
        init_n: 1, init_lhs: '2 \\times 1 - 1 = 1', init_rhs: '1^2 = 1',
        hered_lhs: '\\left[1 + 3 + \\ldots + (2n-1)\\right] + (2(n+1)-1)',
        hered_rhs: 'n^2 + (2n+1)',
        hered_simp: 'n^2 + 2n + 1 = (n+1)^2',
        hered_check: '(n+1)^2'
    };
}

// -- Inegalites --

function generateIneqPuissance2() {
    return {
        name: 'puissance_entier',
        statement: '2^n > n \\text{ pour tout } n \\geq 1',
        init_n: 1, init_lhs: '2^1 = 2', init_rhs: '1', init_ok: '2 > 1',
        hered_assumption: '2^n > n',
        hered_step: '2^{n+1} = 2 \\times 2^n > 2n',
        hered_conclusion: '2n \\geq n + 1 \\text{ pour } n \\geq 1, \\text{ donc } 2^{n+1} > n + 1'
    };
}

function generateIneqFactorielle() {
    return {
        name: 'factorielle',
        statement: 'n! \\geq 2^{n-1} \\text{ pour tout } n \\geq 1',
        init_n: 1, init_lhs: '1! = 1', init_rhs: '2^0 = 1', init_ok: '1 \\geq 1',
        hered_assumption: 'n! \\geq 2^{n-1}',
        hered_step: '(n+1)! = (n+1) \\times n! \\geq (n+1) \\times 2^{n-1}',
        hered_conclusion: '(n+1) \\times 2^{n-1} \\geq 2 \\times 2^{n-1} = 2^n \\text{ car } n+1 \\geq 2'
    };
}

function generateIneqPuissance3() {
    return {
        name: 'puissance_3',
        statement: '3^n \\geq 2n + 1 \\text{ pour tout } n \\geq 1',
        init_n: 1, init_lhs: '3^1 = 3', init_rhs: '2(1)+1 = 3', init_ok: '3 \\geq 3',
        hered_assumption: '3^n \\geq 2n + 1',
        hered_step: '3^{n+1} = 3 \\times 3^n \\geq 3(2n+1) = 6n + 3',
        hered_conclusion: '6n + 3 \\geq 2(n+1) + 1 = 2n + 3 \\text{ car } 4n \\geq 0'
    };
}

function generateIneqBernoulli() {
    const x = pick([1, 2, 3]);
    const base = 1 + x;
    return {
        name: 'bernoulli',
        statement: `(1+${x})^n \\geq 1 + ${x}n \\text{ pour tout } n \\geq 1`,
        init_n: 1,
        init_lhs: `(1+${x})^1 = ${base}`,
        init_rhs: `1 + ${x} \\times 1 = ${base}`,
        init_ok: `${base} \\geq ${base}`,
        hered_assumption: `(1+${x})^n \\geq 1 + ${x}n`,
        hered_step: `(1+${x})^{n+1} = (1+${x})(1+${x})^n \\geq (1+${x})(1+${x}n) = 1 + ${x}n + ${x} + ${x * x}n`,
        hered_conclusion: `1 + ${x}(n+1) + ${x * x}n \\geq 1 + ${x}(n+1) \\text{ car } ${x * x}n \\geq 0`
    };
}

function generateIneqPuissanceVsPolynome() {
    // 2^n >= n^2 pour tout n >= 4
    // Init n=4: 2^4=16 >= 4^2=16
    // Heredite: 2^{n+1} = 2*2^n >= 2n^2
    // Montrer 2n^2 >= (n+1)^2 ie n^2 - 2n - 1 >= 0 pour n >= 4 (16-8-1=7>0)
    return {
        name: 'puissance_vs_polynome',
        statement: '2^n \\geq n^2 \\text{ pour tout } n \\geq 4',
        init_n: 4,
        init_lhs: '2^4 = 16',
        init_rhs: '4^2 = 16',
        init_ok: '16 \\geq 16',
        hered_assumption: '2^n \\geq n^2',
        hered_step: '2^{n+1} = 2 \\times 2^n \\geq 2n^2',
        hered_conclusion: '2n^2 \\geq (n+1)^2 \\iff n^2 - 2n - 1 \\geq 0 \\text{ (vrai pour } n \\geq 4\\text{)}'
    };
}

// --- Binome de Newton ---
function generateBinome() {
    const sub = LogDenomState.subtype_binome;
    const ex = {};

    if (sub === 'developpement') {
        ex.n = pick([2, 3, 4]);
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
        ex.k = rint(1, ex.n - 1);
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
    let html = '';

    if (type === 'denombrement') {
        html = `<p>${ex.enonce}</p>`;
    } else if (type === 'recurrence') {
        if (sub === 'somme') {
            html = `<p>Demontrer par recurrence que pour tout ${K(`n \\geq ${ex.formula.init_n}`)} :</p>`;
            html += `<div class="math-formula">${K(ex.formula.statement)}</div>`;
        } else {
            html = `<p>Demontrer par recurrence :</p>`;
            html += `<div class="math-formula">${K(ex.ineq.statement)}</div>`;
        }
    } else {
        if (sub === 'developpement') {
            html = `<p>Developper ${K(`(${ex.pair.aTeX} + ${ex.pair.bTeX})^{${ex.n}}`)} a l'aide du binome de Newton.</p>`;
        } else if (sub === 'coefficient') {
            html = `<p>Calculer ${K(`\\binom{${ex.n}}{${ex.k}}`)}.</p>`;
        } else {
            html = `<p>Developper ${K(`(${ex.pair.aTeX} + ${ex.pair.bTeX})^{${ex.n}}`)}.  Quel est le terme de rang ${K(`k = ${ex.k}`)} ?</p>`;
        }
    }

    $('expressionDisplay').innerHTML = html;
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
        html = solveDenombrement(ex);
    } else if (type === 'recurrence') {
        html = solveRecurrence(ex, sub);
    } else {
        html = solveBinome(ex, sub);
    }

    $('stepsContainer').innerHTML = html;
    showSolution('solutionDiv');
}

// --- Correction Denombrement ---
function solveDenombrement(ex) {
    let html = '';
    const type = ex.type;

    // Etape 1 : Identification de la methode
    if (type === 'permutation') {
        html += step('Analyse du probleme',
            '',
            `${ex.explication} On ordonne la <strong>totalite</strong> des elements et l'<strong>ordre compte</strong> : c'est une <strong>permutation</strong>.`);

        html += step('Formule des permutations',
            `P_n = n!`,
            `Le nombre de permutations de ${K(`n`)} objets distincts est ${K(`n!`)} (factorielle de ${K(`n`)}).`);

        html += step('Application numerique',
            `P_{${ex.n}} = ${ex.n}!`,
            '');

        let prod = '';
        for (let i = 1; i <= ex.n; i++) {
            prod += (i === 1 ? '' : ' \\times ') + i;
        }
        html += step('Calcul explicite',
            `${prod} = ${ex.result}`,
            '');

        html += resultBlock(`P_{${ex.n}} = ${ex.n}! = ${ex.result}`,
            `Il y a ${K(`${ex.result}`)} possibilites.`);

    } else if (type === 'arrangement') {
        html += step('Analyse du probleme',
            '',
            `${ex.explication} On choisit une <strong>partie</strong> des elements et l'<strong>ordre compte</strong> : c'est un <strong>arrangement</strong>.`);

        html += step('Formule des arrangements',
            `A_n^k = \\dfrac{n!}{(n-k)!}`,
            `Le nombre d'arrangements de ${K(`k`)} elements parmi ${K(`n`)} : on choisit et on ordonne.`);

        html += step('Application numerique',
            `A_{${ex.n}}^{${ex.k}} = \\dfrac{${ex.n}!}{(${ex.n} - ${ex.k})!} = \\dfrac{${ex.n}!}{${ex.n - ex.k}!}`,
            '');

        const terms = [];
        for (let i = 0; i < ex.k; i++) terms.push(ex.n - i);
        html += step('Simplification',
            `A_{${ex.n}}^{${ex.k}} = ${terms.join(' \\times ')} = ${ex.result}`,
            `On simplifie ${K(`(${ex.n - ex.k})!`)} : il reste le produit des ${K(`${ex.k}`)} plus grands facteurs.`);

        html += resultBlock(`A_{${ex.n}}^{${ex.k}} = ${ex.result}`,
            `Il y a ${K(`${ex.result}`)} possibilites.`);

    } else {
        html += step('Analyse du probleme',
            '',
            `${ex.explication} On choisit une <strong>partie</strong> des elements et l'<strong>ordre ne compte pas</strong> : c'est une <strong>combinaison</strong>.`);

        html += step('Formule des combinaisons',
            `C_n^k = \\binom{n}{k} = \\dfrac{n!}{k! \\,(n-k)!}`,
            `Le nombre de facons de choisir ${K(`k`)} elements parmi ${K(`n`)} sans tenir compte de l'ordre. C'est ${K(`A_n^k`)} divise par ${K(`k!`)} car l'ordre ne compte pas.`);

        html += step('Application numerique',
            `C_{${ex.n}}^{${ex.k}} = \\dfrac{${ex.n}!}{${ex.k}! \\times ${ex.n - ex.k}!}`,
            '');

        const numTerms = [];
        for (let i = 0; i < ex.k; i++) numTerms.push(ex.n - i);

        html += step('Simplification',
            `C_{${ex.n}}^{${ex.k}} = \\dfrac{${numTerms.join(' \\times ')}}{${fact(ex.k)}} = \\dfrac{${arr(ex.n, ex.k)}}{${fact(ex.k)}} = ${ex.result}`,
            `On simplifie ${K(`(${ex.n - ex.k})!`)} et on divise par ${K(`${ex.k}! = ${fact(ex.k)}`)}.`);

        html += resultBlock(`\\binom{${ex.n}}{${ex.k}} = ${ex.result}`,
            `Il y a ${K(`${ex.result}`)} possibilites.`);
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
            'Une demonstration par recurrence comporte deux etapes : l\'<strong>initialisation</strong> (verifier la propriete pour le premier rang) et l\'<strong>heredite</strong> (montrer que si la propriete est vraie au rang ' + K('n') + ', elle l\'est aussi au rang ' + K('n+1') + ').');

        // Initialisation
        html += step(`Etape 1 : Initialisation (${K(`n = ${f.init_n}`)})`,
            `\\text{Membre gauche : } ${f.init_lhs} \\qquad \\text{Membre droit : } ${f.init_rhs}`,
            `Les deux membres sont egaux : la propriete est vraie au rang ${K(`n = ${f.init_n}`)}.`);

        // Heredite - hypothese
        html += step('Etape 2 : Heredite',
            '',
            `Supposons que la propriete soit vraie au rang ${K('n')} (hypothese de recurrence) : ${K(`${f.lhs} = ${f.rhs}`)}.`);

        html += step('Hypothese de recurrence (H.R.)',
            `${f.lhs} = ${f.rhs}`,
            `On doit montrer que la propriete est vraie au rang ${K('n+1')}.`);

        // Calcul au rang n+1
        html += step('Calcul au rang n+1',
            `${f.hered_lhs} = ${f.hered_rhs}`,
            `On utilise l'hypothese de recurrence pour remplacer la somme jusqu'a ${K('n')}.`);

        html += step('Simplification',
            `= ${f.hered_simp}`,
            '');

        html += step('Verification',
            `= ${f.hered_check}`,
            `C'est bien la formule au rang ${K('n+1')}.`);

        // Conclusion
        html += resultBlock(
            `\\forall n \\geq ${f.init_n}, \\quad ${f.statement}`,
            `La propriete est vraie au rang initial et l'heredite est demontree. Par le principe de recurrence, elle est vraie pour tout entier ${K(`n \\geq ${f.init_n}`)}.`);

    } else {
        const ineq = ex.ineq;

        html += step('Structure du raisonnement par recurrence',
            '',
            'On demontre l\'inegalite par recurrence : <strong>initialisation</strong> au rang de depart, puis <strong>heredite</strong>.');

        html += step(`Etape 1 : Initialisation (${K(`n = ${ineq.init_n}`)})`,
            `${ineq.init_lhs} \\text{ et } ${ineq.init_rhs} \\implies ${ineq.init_ok}`,
            `L'inegalite est vraie au rang ${K(`n = ${ineq.init_n}`)}.`);

        html += step('Etape 2 : Heredite - Hypothese de recurrence',
            `\\text{Supposons : } ${ineq.hered_assumption}`,
            `On doit montrer que l'inegalite reste vraie au rang ${K('n+1')}.`);

        html += step('Demonstration au rang n+1',
            `${ineq.hered_step}`,
            '');

        html += step('Conclusion de l\'heredite',
            `${ineq.hered_conclusion}`,
            `L'inegalite est donc verifiee au rang ${K('n+1')}.`);

        html += resultBlock(ineq.statement,
            `Par le principe de recurrence, l'inegalite est vraie pour tout entier ${K(`n \\geq ${ineq.init_n}`)}.`);
    }

    return html;
}

// --- Correction Binome de Newton ---
function solveBinome(ex, sub) {
    let html = '';

    if (sub === 'coefficient') {
        html += step('Formule des coefficients binomiaux',
            `\\binom{n}{k} = \\dfrac{n!}{k!(n-k)!}`,
            '');

        html += step('Application numerique',
            `\\binom{${ex.n}}{${ex.k}} = \\dfrac{${ex.n}!}{${ex.k}! \\times ${ex.n - ex.k}!}`,
            '');

        const numTerms = [];
        for (let i = 0; i < ex.k; i++) numTerms.push(ex.n - i);

        html += step('Calcul',
            `\\binom{${ex.n}}{${ex.k}} = \\dfrac{${numTerms.join(' \\times ')}}{${fact(ex.k)}} = \\dfrac{${arr(ex.n, ex.k)}}{${fact(ex.k)}} = ${ex.result}`,
            '');

        html += resultBlock(`\\binom{${ex.n}}{${ex.k}} = ${ex.result}`, '');

    } else if (sub === 'developpement') {
        const n = ex.n;
        const p = ex.pair;

        html += step('Formule du binome de Newton',
            `(a+b)^n = \\sum_{k=0}^{n} \\binom{n}{k} \\, a^{n-k} \\, b^k`,
            `Chaque terme est de la forme ${K('\\binom{n}{k} \\cdot a^{n-k} \\cdot b^k')}.`);

        // Generer les termes
        const terms = [];
        for (let k = 0; k <= n; k++) {
            const c = comb(n, k);
            const pa = n - k;
            const pb = k;
            terms.push({ c, pa, pb });
        }

        html += step('Coefficients binomiaux',
            terms.map(t => `\\binom{${n}}{${t.pb}} = ${t.c}`).join(' \\quad '),
            '');

        // Construction du developpement
        let devTerms = [];
        for (const t of terms) {
            const coef = t.c;
            let parts = [];
            if (coef !== 1) parts.push(`${coef}`);

            // Partie en a
            if (p.aTeX === '1') {
                // 1^pa = 1
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
                // 1^pb = 1
            } else if (p.bTeX === '-1') {
                if (t.pb === 0) {
                    // 1
                } else if (t.pb % 2 === 1) {
                    if (parts.length > 0 && parts[0] !== '') {
                        const c_str = parts.shift();
                        parts.unshift(`-${c_str}`);
                    } else if (coef === 1) {
                        parts[0] = '-';
                    }
                }
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
            devTerms.push(parts.join(''));
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
            `T_{k+1} = \\binom{n}{k} \\, a^{n-k} \\, b^k`,
            `Le terme de rang ${K('k')} (a partir de ${K('k=0')}) dans le developpement de ${K(`(a+b)^n`)} est ${K('\\binom{n}{k} \\cdot a^{n-k} \\cdot b^k')}.`);

        html += step(`Application : terme de rang ${K(`k = ${k}`)}`,
            `T_{${k + 1}} = \\binom{${n}}{${k}} \\cdot (${p.aTeX})^{${n - k}} \\cdot (${p.bTeX})^{${k}}`,
            '');

        html += step('Calcul du coefficient',
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
        if (p.bTeX !== '1' && p.bTeX !== '-1') {
            if (k === 0) {
                // rien
            } else if (k === 1) {
                term += p.bTeX;
            } else {
                term += `${p.bTeX}^{${k}}`;
            }
        } else if (p.bTeX === '-1') {
            if (k > 0 && k % 2 === 1) {
                // Negatif
                if (term.startsWith('-')) {
                    term = term.substring(1); // double negatif
                } else {
                    term = '-' + (term || '1');
                }
            }
        }
        if (term === '' || term === '-') term = term === '-' ? '-1' : '1';

        html += resultBlock(
            `T_{${k + 1}} = ${term}`,
            `Le terme de rang ${K(`k = ${k}`)} dans le developpement de ${K(`(${p.aTeX} + ${p.bTeX})^{${n}}`)}.`);
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
