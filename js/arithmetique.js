/* ========================================
   ARITHMETIQUE.JS - Arithmetique (Terminale Spe)
   ======================================== */

/**
 * Etat du module Arithmetique
 */
const ArithState = {
    currentType: 'divisibilite',

    subtype_divisibilite: 'division_euclidienne',
    subtype_pgcd: 'euclide',
    subtype_premiers: 'test',
    subtype_congruences: 'calcul',
    subtype_bezout: 'coefficients',

    exercise: {}
};

// ========================================
// Utilitaires locaux
// ========================================

function K(tex) {
    return katex.renderToString(tex, { throwOnError: false });
}

function randInt(min, max, exclude) {
    const excl = exclude || [];
    let val;
    do {
        val = Math.floor(Math.random() * (max - min + 1)) + min;
    } while (excl.includes(val));
    return val;
}

function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// PGCD par algorithme d'Euclide (retourne les etapes)
function euclideSteps(a, b) {
    const steps = [];
    a = Math.abs(a);
    b = Math.abs(b);
    if (a < b) { [a, b] = [b, a]; }
    while (b > 0) {
        const q = Math.floor(a / b);
        const r = a % b;
        steps.push({ a: a, b: b, q: q, r: r });
        a = b;
        b = r;
    }
    return { pgcd: a, steps: steps };
}

// PGCD simple
function gcd(a, b) {
    a = Math.abs(a); b = Math.abs(b);
    while (b) { [a, b] = [b, a % b]; }
    return a;
}

// PPCM
function lcm(a, b) {
    return Math.abs(a * b) / gcd(a, b);
}

// Test de primalite
function isPrime(n) {
    if (n < 2) return false;
    if (n === 2 || n === 3) return true;
    if (n % 2 === 0 || n % 3 === 0) return false;
    for (let i = 5; i * i <= n; i += 6) {
        if (n % i === 0 || n % (i + 2) === 0) return false;
    }
    return true;
}

// Decomposition en facteurs premiers
function primeFactors(n) {
    const factors = [];
    let d = 2;
    let num = n;
    while (d * d <= num) {
        while (num % d === 0) {
            factors.push(d);
            num = Math.floor(num / d);
        }
        d++;
    }
    if (num > 1) factors.push(num);
    return factors;
}

// Decomposition groupee {prime: exposant}
function primeFactorsGrouped(n) {
    const factors = primeFactors(n);
    const grouped = {};
    factors.forEach(f => {
        grouped[f] = (grouped[f] || 0) + 1;
    });
    return grouped;
}

// Ecriture en facteurs premiers TeX
function primeFactorsTeX(n) {
    const grouped = primeFactorsGrouped(n);
    const primes = Object.keys(grouped).map(Number).sort((a, b) => a - b);
    if (primes.length === 0) return String(n);
    return primes.map(p => {
        const exp = grouped[p];
        return exp === 1 ? String(p) : `${p}^{${exp}}`;
    }).join(' \\times ');
}

// Euclide etendu : retourne {g, u, v} tels que a*u + b*v = g
function extendedGcd(a, b) {
    if (b === 0) return { g: a, u: 1, v: 0 };
    const result = extendedGcd(b, a % b);
    return {
        g: result.g,
        u: result.v,
        v: result.u - Math.floor(a / b) * result.v
    };
}

// Euclide etendu iteratif avec etapes
function extendedGcdSteps(a, b) {
    const steps = [];
    let old_r = a, r = b;
    let old_u = 1, u = 0;
    let old_v = 0, v = 1;

    while (r !== 0) {
        const q = Math.floor(old_r / r);
        steps.push({
            old_r: old_r, r: r, q: q,
            new_r: old_r - q * r,
            old_u: old_u, u: u, new_u: old_u - q * u,
            old_v: old_v, v: v, new_v: old_v - q * v
        });
        [old_r, r] = [r, old_r - q * r];
        [old_u, u] = [u, old_u - q * u];
        [old_v, v] = [v, old_v - q * v];
    }

    return { g: old_r, u: old_u, v: old_v, steps: steps };
}

// Exponentiation modulaire
function modPow(base, exp, mod) {
    let result = 1;
    base = ((base % mod) + mod) % mod;
    while (exp > 0) {
        if (exp % 2 === 1) {
            result = (result * base) % mod;
        }
        exp = Math.floor(exp / 2);
        base = (base * base) % mod;
    }
    return result;
}

// Diviseurs d'un nombre
function getDivisors(n) {
    const divs = [];
    for (let i = 1; i <= Math.sqrt(n); i++) {
        if (n % i === 0) {
            divs.push(i);
            if (i !== n / i) divs.push(n / i);
        }
    }
    return divs.sort((a, b) => a - b);
}

// ========================================
// Initialisation
// ========================================

function initArithmetiquePage() {
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
            ArithState.currentType = button.dataset.type;

            document.querySelectorAll('[id$="Section"]').forEach(section => {
                section.style.display = 'none';
            });

            const sectionMap = {
                'divisibilite': 'divisibiliteSection',
                'pgcd': 'pgcdSection',
                'premiers': 'premiersSection',
                'congruences': 'congruencesSection',
                'bezout': 'bezoutSection'
            };
            const sectionId = sectionMap[ArithState.currentType];
            if (sectionId) {
                $(sectionId).style.display = 'block';
            }

            generateNewExercise();
            updateExerciseDisplay();
            hideSolution('solutionDiv');
        });
    });
}

function setupInputHandlers() {
    const selects = [
        'subtype_divisibilite', 'subtype_pgcd', 'subtype_premiers',
        'subtype_congruences', 'subtype_bezout'
    ];
    selects.forEach(id => {
        const el = $(id);
        if (el) {
            el.addEventListener('change', () => {
                ArithState[id] = el.value;
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
        solveExercise();
    });
}

// ========================================
// Generation des exercices
// ========================================

function generateNewExercise() {
    const type = ArithState.currentType;
    const ex = {};

    switch (type) {
        case 'divisibilite':
            generateDivisibilite(ex);
            break;
        case 'pgcd':
            generatePgcd(ex);
            break;
        case 'premiers':
            generatePremiers(ex);
            break;
        case 'congruences':
            generateCongruences(ex);
            break;
        case 'bezout':
            generateBezout(ex);
            break;
    }

    ArithState.exercise = ex;
}

function generateDivisibilite(ex) {
    const sub = ArithState.subtype_divisibilite;

    if (sub === 'division_euclidienne') {
        ex.a = randInt(100, 999);
        ex.b = randInt(7, 49);
        ex.q = Math.floor(ex.a / ex.b);
        ex.r = ex.a % ex.b;
    } else if (sub === 'criteres') {
        // Nombre a tester pour criteres de divisibilite
        ex.n = randInt(100, 9999);
        ex.diviseurs = pick([2, 3, 4, 5, 9, 11]);
    } else if (sub === 'multiples') {
        ex.n = randInt(12, 120);
    }
}

function generatePgcd(ex) {
    const sub = ArithState.subtype_pgcd;

    if (sub === 'euclide') {
        // Generer deux nombres avec un PGCD non trivial
        const d = randInt(1, 15);
        const a = d * randInt(5, 40, [0]);
        const b = d * randInt(3, 30, [0]);
        ex.a = Math.max(a, b);
        ex.b = Math.min(a, b);
        if (ex.a === ex.b) ex.a += d;
    } else if (sub === 'ppcm') {
        ex.a = randInt(6, 60);
        ex.b = randInt(6, 60);
    } else if (sub === 'simplification') {
        const d = randInt(2, 12);
        ex.num = d * randInt(2, 20);
        ex.den = d * randInt(2, 20);
        if (ex.num === ex.den) ex.num += d;
    }
}

function generatePremiers(ex) {
    const sub = ArithState.subtype_premiers;

    if (sub === 'test') {
        // Melanger premiers et non-premiers
        if (Math.random() < 0.5) {
            const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47,
                53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113,
                127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191,
                193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251];
            ex.n = pick(primes);
        } else {
            do {
                ex.n = randInt(10, 250);
            } while (isPrime(ex.n));
        }
    } else if (sub === 'decomposition') {
        // Nombre composé avec facteurs premiers pas trop grands
        const p1 = pick([2, 3, 5, 7, 11, 13]);
        const p2 = pick([2, 3, 5, 7, 11, 13, 17, 19]);
        const p3 = pick([2, 3, 5, 7]);
        const choices = [
            p1 * p2,
            p1 * p1 * p2,
            p1 * p2 * p3,
            p1 * p1 * p2 * p3,
            p1 * p2 * p2
        ];
        ex.n = pick(choices);
        if (ex.n < 12) ex.n = p1 * p2 * p3 + p1;
        // Recalculer si premier par accident
        if (isPrime(ex.n)) ex.n = ex.n + 1;
    } else if (sub === 'crible') {
        ex.limit = pick([30, 40, 50]);
    }
}

function generateCongruences(ex) {
    const sub = ArithState.subtype_congruences;

    if (sub === 'calcul') {
        ex.a = randInt(50, 500);
        ex.n = randInt(3, 13);
    } else if (sub === 'operations') {
        ex.a = randInt(10, 99);
        ex.b = randInt(10, 99);
        ex.n = randInt(3, 12);
        ex.op = pick(['+', '-', '\\times']);
    } else if (sub === 'puissance') {
        ex.base = randInt(2, 12);
        ex.exp = randInt(5, 30);
        ex.n = randInt(3, 13);
    }
}

function generateBezout(ex) {
    const sub = ArithState.subtype_bezout;

    if (sub === 'coefficients') {
        // Generer a et b premiers entre eux
        do {
            ex.a = randInt(15, 120);
            ex.b = randInt(10, 80);
        } while (gcd(ex.a, ex.b) !== 1 || ex.a <= ex.b);
    } else if (sub === 'equation_diophantienne') {
        // ax + by = c avec c multiple du pgcd(a,b)
        const d = randInt(1, 5);
        do {
            ex.a = randInt(5, 30) * d;
            ex.b = randInt(3, 20) * d;
        } while (gcd(ex.a, ex.b) !== d);
        ex.c = d * randInt(1, 10);
        ex.d = d; // le pgcd
    }
}

// ========================================
// Affichage de l'exercice
// ========================================

function updateExerciseDisplay() {
    const type = ArithState.currentType;
    const ex = ArithState.exercise;
    let display = '';

    switch (type) {
        case 'divisibilite':
            display = displayDivisibilite(ex);
            break;
        case 'pgcd':
            display = displayPgcd(ex);
            break;
        case 'premiers':
            display = displayPremiers(ex);
            break;
        case 'congruences':
            display = displayCongruences(ex);
            break;
        case 'bezout':
            display = displayBezout(ex);
            break;
    }

    $('expressionDisplay').innerHTML = display;
}

function displayDivisibilite(ex) {
    const sub = ArithState.subtype_divisibilite;
    if (sub === 'division_euclidienne') {
        return 'Effectuer la division euclidienne de ' + K(String(ex.a)) + ' par ' + K(String(ex.b));
    } else if (sub === 'criteres') {
        return K(String(ex.n)) + ' est-il divisible par ' + K(String(ex.diviseurs)) + ' ?';
    } else if (sub === 'multiples') {
        return 'Determiner tous les diviseurs de ' + K(String(ex.n));
    }
    return '';
}

function displayPgcd(ex) {
    const sub = ArithState.subtype_pgcd;
    if (sub === 'euclide') {
        return 'Calculer ' + K(`\\text{PGCD}(${ex.a},\\, ${ex.b})`) + ' par l\'algorithme d\'Euclide';
    } else if (sub === 'ppcm') {
        return 'Calculer ' + K(`\\text{PPCM}(${ex.a},\\, ${ex.b})`);
    } else if (sub === 'simplification') {
        return 'Simplifier la fraction ' + K(`\\dfrac{${ex.num}}{${ex.den}}`);
    }
    return '';
}

function displayPremiers(ex) {
    const sub = ArithState.subtype_premiers;
    if (sub === 'test') {
        return K(String(ex.n)) + ' est-il un nombre premier ?';
    } else if (sub === 'decomposition') {
        return 'Decomposer ' + K(String(ex.n)) + ' en produit de facteurs premiers';
    } else if (sub === 'crible') {
        return 'Trouver tous les nombres premiers inferieurs ou egaux a ' + K(String(ex.limit));
    }
    return '';
}

function displayCongruences(ex) {
    const sub = ArithState.subtype_congruences;
    if (sub === 'calcul') {
        return 'Calculer le reste de la division de ' + K(String(ex.a)) + ' par ' + K(String(ex.n));
    } else if (sub === 'operations') {
        const opName = ex.op === '+' ? 'la somme' : ex.op === '-' ? 'la difference' : 'le produit';
        return 'Calculer le reste de ' + opName + ' ' +
            K(`${ex.a} ${ex.op} ${ex.b}`) + ' modulo ' + K(String(ex.n));
    } else if (sub === 'puissance') {
        return 'Calculer le reste de ' + K(`${ex.base}^{${ex.exp}}`) + ' modulo ' + K(String(ex.n));
    }
    return '';
}

function displayBezout(ex) {
    const sub = ArithState.subtype_bezout;
    if (sub === 'coefficients') {
        return 'Trouver ' + K('u') + ' et ' + K('v') + ' tels que ' +
            K(`${ex.a}u + ${ex.b}v = 1`);
    } else if (sub === 'equation_diophantienne') {
        return 'Resoudre dans ' + K('\\mathbb{Z}') + ' : ' +
            K(`${ex.a}x + ${ex.b}y = ${ex.c}`);
    }
    return '';
}

// ========================================
// Resolution des exercices
// ========================================

function solveExercise() {
    const type = ArithState.currentType;
    const ex = ArithState.exercise;
    let html = '';

    switch (type) {
        case 'divisibilite':
            html = solveDivisibilite(ex);
            break;
        case 'pgcd':
            html = solvePgcd(ex);
            break;
        case 'premiers':
            html = solvePremiers(ex);
            break;
        case 'congruences':
            html = solveCongruences(ex);
            break;
        case 'bezout':
            html = solveBezout(ex);
            break;
    }

    $('stepsContainer').innerHTML = html;
    showSolution('solutionDiv');
}

// ---- Divisibilite ----

function solveDivisibilite(ex) {
    const sub = ArithState.subtype_divisibilite;

    if (sub === 'division_euclidienne') {
        return solveDivisionEuclidienne(ex);
    } else if (sub === 'criteres') {
        return solveCriteres(ex);
    } else if (sub === 'multiples') {
        return solveMultiples(ex);
    }
    return '';
}

function solveDivisionEuclidienne(ex) {
    let html = '';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : Rappel</div>';
    html += '<div class="step-explanation">La division euclidienne de ' +
        K('a') + ' par ' + K('b') + ' donne : ' +
        K('a = b \\times q + r') + ' avec ' + K('0 \\leq r < b') + '</div>';
    html += '</div>';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 2 : Calcul</div>';
    html += '<div class="step-expression">' +
        K(`${ex.a} = ${ex.b} \\times ${ex.q} + ${ex.r}`) + '</div>';
    html += '<div class="step-explanation">On divise : ' +
        K(`${ex.a} \\div ${ex.b} = ${ex.q}`) + ' (quotient entier)<br>' +
        'Reste : ' + K(`${ex.a} - ${ex.b} \\times ${ex.q} = ${ex.r}`) + '</div>';
    html += '</div>';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 3 : Verification</div>';
    html += '<div class="step-expression">' +
        K(`${ex.b} \\times ${ex.q} + ${ex.r} = ${ex.b * ex.q} + ${ex.r} = ${ex.a}`) +
        ' &#10003;</div>';
    html += '<div class="step-explanation">On verifie que ' +
        K(`0 \\leq ${ex.r} < ${ex.b}`) + ' : c\'est bien le cas.</div>';
    html += '</div>';

    html += '<div class="result-highlight">';
    html += '<div class="final">' +
        K(`${ex.a} = ${ex.b} \\times ${ex.q} + ${ex.r}`) +
        '<br>Quotient : ' + K(`q = ${ex.q}`) +
        ' &mdash; Reste : ' + K(`r = ${ex.r}`) + '</div>';
    html += '</div>';

    return html;
}

function solveCriteres(ex) {
    let html = '';
    const n = ex.n;
    const d = ex.diviseurs;
    const divisible = n % d === 0;

    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : Rappel du critere</div>';
    html += '<div class="step-explanation">';

    // Rappel du critere
    switch (d) {
        case 2:
            html += 'Un nombre est divisible par 2 si son dernier chiffre est pair (0, 2, 4, 6 ou 8).';
            break;
        case 3:
            html += 'Un nombre est divisible par 3 si la somme de ses chiffres est divisible par 3.';
            break;
        case 4:
            html += 'Un nombre est divisible par 4 si le nombre forme par ses deux derniers chiffres est divisible par 4.';
            break;
        case 5:
            html += 'Un nombre est divisible par 5 si son dernier chiffre est 0 ou 5.';
            break;
        case 9:
            html += 'Un nombre est divisible par 9 si la somme de ses chiffres est divisible par 9.';
            break;
        case 11:
            html += 'Un nombre est divisible par 11 si la difference entre la somme des chiffres de rang pair et celle des chiffres de rang impair est divisible par 11.';
            break;
    }
    html += '</div></div>';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 2 : Application</div>';

    const digits = String(n).split('').map(Number);

    if (d === 2) {
        const last = digits[digits.length - 1];
        html += '<div class="step-expression">Dernier chiffre de ' + K(String(n)) + ' : ' + K(String(last)) + '</div>';
        html += '<div class="step-explanation">' + K(String(last)) + (last % 2 === 0 ? ' est pair.' : ' est impair.') + '</div>';
    } else if (d === 3 || d === 9) {
        const sum = digits.reduce((a, b) => a + b, 0);
        const digitsStr = digits.join(' + ');
        html += '<div class="step-expression">Somme des chiffres : ' + K(digitsStr + ' = ' + sum) + '</div>';
        html += '<div class="step-explanation">' + K(String(sum)) +
            (sum % d === 0 ? ' est divisible par ' + K(String(d)) + '.' :
                ' n\'est pas divisible par ' + K(String(d)) + '.') + '</div>';
    } else if (d === 4) {
        const lastTwo = n % 100;
        html += '<div class="step-expression">Deux derniers chiffres : ' + K(String(lastTwo)) + '</div>';
        html += '<div class="step-explanation">' + K(`${lastTwo} \\div 4 = ${lastTwo / 4}`) + ' : ' +
            (lastTwo % 4 === 0 ? 'c\'est un entier.' : 'ce n\'est pas un entier (' + K(`${lastTwo} = 4 \\times ${Math.floor(lastTwo / 4)} + ${lastTwo % 4}`) + ').') + '</div>';
    } else if (d === 5) {
        const last = digits[digits.length - 1];
        html += '<div class="step-expression">Dernier chiffre de ' + K(String(n)) + ' : ' + K(String(last)) + '</div>';
        html += '<div class="step-explanation">' + (last === 0 || last === 5 ? 'C\'est 0 ou 5.' : 'Ce n\'est ni 0 ni 5.') + '</div>';
    } else if (d === 11) {
        let sumOdd = 0, sumEven = 0;
        digits.forEach((dig, i) => {
            if (i % 2 === 0) sumOdd += dig;
            else sumEven += dig;
        });
        const diff = Math.abs(sumOdd - sumEven);
        html += '<div class="step-expression">';
        html += 'Chiffres de rang impair : ' + digits.filter((_, i) => i % 2 === 0).join(' + ') + ' = ' + sumOdd + '<br>';
        html += 'Chiffres de rang pair : ' + digits.filter((_, i) => i % 2 !== 0).join(' + ') + ' = ' + sumEven + '<br>';
        html += 'Difference : ' + K(`|${sumOdd} - ${sumEven}| = ${diff}`);
        html += '</div>';
        html += '<div class="step-explanation">' + K(String(diff)) +
            (diff % 11 === 0 ? ' est divisible par 11.' : ' n\'est pas divisible par 11.') + '</div>';
    }
    html += '</div>';

    html += '<div class="result-highlight">';
    if (divisible) {
        html += '<div class="final">' + K(`${n}`) + ' <strong>est divisible</strong> par ' + K(String(d)) +
            '<br>' + K(`${n} = ${d} \\times ${n / d}`) + '</div>';
    } else {
        html += '<div class="final">' + K(`${n}`) + ' <strong>n\'est pas divisible</strong> par ' + K(String(d)) +
            '<br>Reste : ' + K(`${n} = ${d} \\times ${Math.floor(n / d)} + ${n % d}`) + '</div>';
    }
    html += '</div>';

    return html;
}

function solveMultiples(ex) {
    let html = '';
    const n = ex.n;
    const divisors = getDivisors(n);

    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : Methode</div>';
    html += '<div class="step-explanation">Pour trouver les diviseurs de ' + K(String(n)) +
        ', on teste les entiers de 1 a ' + K(`\\sqrt{${n}} \\approx ${Math.floor(Math.sqrt(n))}`) +
        '.<br>Pour chaque diviseur ' + K('d') + ' trouve, ' + K(`\\frac{${n}}{d}`) + ' est aussi un diviseur.</div>';
    html += '</div>';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 2 : Recherche systematique</div>';
    html += '<div class="step-expression">';

    const sqrtN = Math.floor(Math.sqrt(n));
    for (let i = 1; i <= sqrtN; i++) {
        if (n % i === 0) {
            const pair = n / i;
            if (i === pair) {
                html += K(`${n} = ${i} \\times ${i}`) + '<br>';
            } else {
                html += K(`${n} = ${i} \\times ${pair}`) + '<br>';
            }
        }
    }
    html += '</div></div>';

    html += '<div class="result-highlight">';
    html += '<div class="final">Les diviseurs de ' + K(String(n)) + ' sont :<br>' +
        K(`\\{${divisors.join(',\\, ')}\\}`) +
        '<br>(' + divisors.length + ' diviseurs)</div>';
    html += '</div>';

    return html;
}

// ---- PGCD & Euclide ----

function solvePgcd(ex) {
    const sub = ArithState.subtype_pgcd;

    if (sub === 'euclide') {
        return solveEuclide(ex);
    } else if (sub === 'ppcm') {
        return solvePpcm(ex);
    } else if (sub === 'simplification') {
        return solveSimplification(ex);
    }
    return '';
}

function solveEuclide(ex) {
    let html = '';
    const result = euclideSteps(ex.a, ex.b);

    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : Rappel de l\'algorithme</div>';
    html += '<div class="step-explanation">On effectue des divisions euclidiennes successives jusqu\'a obtenir un reste nul.<br>' +
        'Le dernier reste non nul est le PGCD.</div>';
    html += '</div>';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 2 : Divisions successives</div>';
    html += '<div class="step-expression">';

    result.steps.forEach((s, i) => {
        const color = s.r === 0 ? '\\color{green}' : '';
        html += K(`${s.a} = ${s.b} \\times ${s.q} + ${color}{${s.r}}`) + '<br>';
    });
    html += '</div>';
    html += '<div class="step-explanation">Le dernier reste non nul est ' +
        K(`\\color{green}{${result.pgcd}}`) + '.</div>';
    html += '</div>';

    html += '<div class="result-highlight">';
    html += '<div class="final">' +
        K(`\\text{PGCD}(${ex.a},\\, ${ex.b}) = \\boxed{${result.pgcd}}`) + '</div>';
    html += '</div>';

    return html;
}

function solvePpcm(ex) {
    let html = '';
    const g = gcd(ex.a, ex.b);
    const l = lcm(ex.a, ex.b);

    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : Calculer le PGCD</div>';

    const result = euclideSteps(ex.a, ex.b);
    html += '<div class="step-expression">';
    result.steps.forEach(s => {
        html += K(`${s.a} = ${s.b} \\times ${s.q} + ${s.r}`) + '<br>';
    });
    html += '</div>';
    html += '<div class="step-explanation">' + K(`\\text{PGCD}(${ex.a},\\, ${ex.b}) = ${g}`) + '</div>';
    html += '</div>';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 2 : Formule du PPCM</div>';
    html += '<div class="step-expression">' +
        K(`\\text{PPCM}(a, b) = \\frac{a \\times b}{\\text{PGCD}(a, b)}`) + '</div>';
    html += '<div class="step-explanation">' +
        K(`\\text{PPCM}(${ex.a},\\, ${ex.b}) = \\frac{${ex.a} \\times ${ex.b}}{${g}} = \\frac{${ex.a * ex.b}}{${g}}`) + '</div>';
    html += '</div>';

    html += '<div class="result-highlight">';
    html += '<div class="final">' +
        K(`\\text{PPCM}(${ex.a},\\, ${ex.b}) = \\boxed{${l}}`) + '</div>';
    html += '</div>';

    return html;
}

function solveSimplification(ex) {
    let html = '';
    const g = gcd(ex.num, ex.den);
    const numSimp = ex.num / g;
    const denSimp = ex.den / g;

    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : Trouver le PGCD</div>';

    const result = euclideSteps(ex.num, ex.den);
    html += '<div class="step-expression">';
    result.steps.forEach(s => {
        html += K(`${s.a} = ${s.b} \\times ${s.q} + ${s.r}`) + '<br>';
    });
    html += '</div>';
    html += '<div class="step-explanation">' + K(`\\text{PGCD}(${ex.num},\\, ${ex.den}) = ${g}`) + '</div>';
    html += '</div>';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 2 : Simplifier</div>';
    html += '<div class="step-expression">' +
        K(`\\frac{${ex.num}}{${ex.den}} = \\frac{${numSimp} \\times ${g}}{${denSimp} \\times ${g}} = \\frac{${numSimp}}{${denSimp}}`) + '</div>';
    html += '</div>';

    html += '<div class="result-highlight">';
    html += '<div class="final">' +
        K(`\\dfrac{${ex.num}}{${ex.den}} = \\boxed{\\dfrac{${numSimp}}{${denSimp}}}`) + '</div>';
    html += '</div>';

    return html;
}

// ---- Nombres premiers ----

function solvePremiers(ex) {
    const sub = ArithState.subtype_premiers;

    if (sub === 'test') {
        return solveTestPremier(ex);
    } else if (sub === 'decomposition') {
        return solveDecomposition(ex);
    } else if (sub === 'crible') {
        return solveCrible(ex);
    }
    return '';
}

function solveTestPremier(ex) {
    let html = '';
    const n = ex.n;
    const prime = isPrime(n);
    const sqrtN = Math.floor(Math.sqrt(n));

    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : Methode</div>';
    html += '<div class="step-explanation">Pour tester si ' + K(String(n)) +
        ' est premier, on cherche un diviseur parmi les nombres premiers ' +
        K(`p \\leq \\sqrt{${n}} \\approx ${sqrtN}`) + '.</div>';
    html += '</div>';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 2 : Tests de divisibilite</div>';
    html += '<div class="step-expression">';

    // Tester les premiers jusqu'a sqrt(n)
    const primesToTest = [2, 3, 5, 7, 11, 13, 17, 19].filter(p => p <= sqrtN);
    let foundDivisor = 0;

    for (const p of primesToTest) {
        if (n % p === 0) {
            html += K(`${n} \\div ${p} = ${n / p}`) + ' &#10003; Divisible !<br>';
            foundDivisor = p;
            break;
        } else {
            html += K(`${n} \\div ${p} = ${(n / p).toFixed(2)}\\ldots`) + ' Non divisible<br>';
        }
    }
    html += '</div></div>';

    html += '<div class="result-highlight">';
    if (prime) {
        html += '<div class="final">' + K(`\\boxed{${n} \\text{ est premier}}`) +
            '<br>Aucun nombre premier ' + K(`\\leq ${sqrtN}`) + ' ne divise ' + K(String(n)) + '.</div>';
    } else {
        html += '<div class="final">' + K(`\\boxed{${n} \\text{ n\'est pas premier}}`) +
            '<br>' + K(`${n} = ${foundDivisor} \\times ${n / foundDivisor}`) + '</div>';
    }
    html += '</div>';

    return html;
}

function solveDecomposition(ex) {
    let html = '';
    const n = ex.n;
    const factors = primeFactors(n);
    const grouped = primeFactorsGrouped(n);

    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : Methode</div>';
    html += '<div class="step-explanation">On divise successivement par les plus petits nombres premiers possibles.</div>';
    html += '</div>';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 2 : Divisions successives</div>';
    html += '<div class="step-expression">';

    // Montrer le tableau de decomposition
    html += '<table style="border-collapse: collapse; margin: 0 auto; font-size: 1.1em;">';
    let current = n;
    factors.forEach(f => {
        html += '<tr>';
        html += '<td style="padding: 2px 12px; border-right: 2px solid var(--primary); text-align: right;">' + K(String(current)) + '</td>';
        html += '<td style="padding: 2px 12px; text-align: left;">' + K(String(f)) + '</td>';
        html += '</tr>';
        current = current / f;
    });
    html += '<tr>';
    html += '<td style="padding: 2px 12px; border-right: 2px solid var(--primary); text-align: right;">' + K('1') + '</td>';
    html += '<td style="padding: 2px 12px;"></td>';
    html += '</tr>';
    html += '</table>';
    html += '</div></div>';

    html += '<div class="result-highlight">';
    html += '<div class="final">' +
        K(`${n} = \\boxed{${primeFactorsTeX(n)}}`) + '</div>';
    html += '</div>';

    return html;
}

function solveCrible(ex) {
    let html = '';
    const limit = ex.limit;

    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : Principe du crible d\'Eratosthene</div>';
    html += '<div class="step-explanation">On ecrit tous les entiers de 2 a ' + K(String(limit)) +
        '.<br>On elimine successivement les multiples de chaque nombre premier non encore elimine.</div>';
    html += '</div>';

    // Crible
    const sieve = new Array(limit + 1).fill(true);
    sieve[0] = sieve[1] = false;
    const eliminationSteps = [];

    for (let i = 2; i * i <= limit; i++) {
        if (sieve[i]) {
            const eliminated = [];
            for (let j = i * i; j <= limit; j += i) {
                if (sieve[j]) {
                    eliminated.push(j);
                    sieve[j] = false;
                }
            }
            if (eliminated.length > 0) {
                eliminationSteps.push({ prime: i, eliminated: eliminated });
            }
        }
    }

    html += '<div class="step">';
    html += '<div class="step-number">Etape 2 : Elimination</div>';
    html += '<div class="step-expression">';
    eliminationSteps.forEach(step => {
        html += 'Multiples de ' + K(String(step.prime)) + ' elimines : ' +
            K(step.eliminated.join(',\\, ')) + '<br>';
    });
    html += '</div></div>';

    const primes = [];
    for (let i = 2; i <= limit; i++) {
        if (sieve[i]) primes.push(i);
    }

    html += '<div class="result-highlight">';
    html += '<div class="final">Nombres premiers ' + K(`\\leq ${limit}`) + ' :<br>' +
        K(`\\boxed{${primes.join(',\\; ')}}`) +
        '<br>(' + primes.length + ' nombres premiers)</div>';
    html += '</div>';

    return html;
}

// ---- Congruences ----

function solveCongruences(ex) {
    const sub = ArithState.subtype_congruences;

    if (sub === 'calcul') {
        return solveCalculCongruence(ex);
    } else if (sub === 'operations') {
        return solveOperationsCongruence(ex);
    } else if (sub === 'puissance') {
        return solvePuissanceCongruence(ex);
    }
    return '';
}

function solveCalculCongruence(ex) {
    let html = '';
    const q = Math.floor(ex.a / ex.n);
    const r = ex.a % ex.n;

    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : Division euclidienne</div>';
    html += '<div class="step-expression">' +
        K(`${ex.a} = ${ex.n} \\times ${q} + ${r}`) + '</div>';
    html += '</div>';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 2 : Conclusion</div>';
    html += '<div class="step-expression">' +
        K(`${ex.a} \\equiv ${r} \\pmod{${ex.n}}`) + '</div>';
    html += '</div>';

    html += '<div class="result-highlight">';
    html += '<div class="final">Le reste de la division de ' + K(String(ex.a)) + ' par ' +
        K(String(ex.n)) + ' est ' + K(`\\boxed{${r}}`) + '</div>';
    html += '</div>';

    return html;
}

function solveOperationsCongruence(ex) {
    let html = '';
    const ra = ex.a % ex.n;
    const rb = ex.b % ex.n;

    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : Restes individuels</div>';
    html += '<div class="step-expression">' +
        K(`${ex.a} \\equiv ${ra} \\pmod{${ex.n}}`) + '<br>' +
        K(`${ex.b} \\equiv ${rb} \\pmod{${ex.n}}`) + '</div>';
    html += '</div>';

    let result, calcul;
    if (ex.op === '+') {
        result = (ra + rb) % ex.n;
        calcul = `${ra} + ${rb} = ${ra + rb}`;
    } else if (ex.op === '-') {
        result = ((ra - rb) % ex.n + ex.n) % ex.n;
        calcul = `${ra} - ${rb} = ${ra - rb}`;
    } else {
        result = (ra * rb) % ex.n;
        calcul = `${ra} \\times ${rb} = ${ra * rb}`;
    }

    const opSymbol = ex.op === '\\times' ? '\\times' : ex.op;

    html += '<div class="step">';
    html += '<div class="step-number">Etape 2 : Operation sur les congruences</div>';
    html += '<div class="step-expression">' +
        K(`${ex.a} ${opSymbol} ${ex.b} \\equiv ${ra} ${opSymbol} ${rb} \\pmod{${ex.n}}`) + '</div>';
    html += '<div class="step-explanation">' + K(calcul) +
        ', et ' + K(`${ex.op === '+' ? ra + rb : ex.op === '-' ? ra - rb : ra * rb} \\equiv ${result} \\pmod{${ex.n}}`) + '</div>';
    html += '</div>';

    html += '<div class="result-highlight">';
    html += '<div class="final">' +
        K(`${ex.a} ${opSymbol} ${ex.b} \\equiv \\boxed{${result}} \\pmod{${ex.n}}`) + '</div>';
    html += '</div>';

    return html;
}

function solvePuissanceCongruence(ex) {
    let html = '';
    const base = ex.base;
    const exp = ex.exp;
    const n = ex.n;

    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : Methode des puissances successives</div>';
    html += '<div class="step-explanation">On calcule les puissances de ' + K(String(base)) +
        ' modulo ' + K(String(n)) + ' en cherchant un cycle.</div>';
    html += '</div>';

    // Calculer les puissances successives
    html += '<div class="step">';
    html += '<div class="step-number">Etape 2 : Puissances successives</div>';
    html += '<div class="step-expression">';

    let current = base % n;
    const powers = [{ exp: 1, val: current }];
    let cycleLength = 0;

    for (let i = 2; i <= Math.min(exp, 20); i++) {
        current = (current * (base % n)) % n;
        powers.push({ exp: i, val: current });
        if (current === powers[0].val && cycleLength === 0) {
            cycleLength = i - 1;
        }
    }

    // Afficher les premieres puissances
    const showCount = Math.min(powers.length, cycleLength > 0 ? cycleLength + 2 : 12);
    for (let i = 0; i < showCount; i++) {
        html += K(`${base}^{${powers[i].exp}} \\equiv ${powers[i].val} \\pmod{${n}}`) + '<br>';
    }
    html += '</div>';

    if (cycleLength > 0) {
        html += '<div class="step-explanation">On observe un cycle de longueur ' +
            K(String(cycleLength)) + '.</div>';
    }
    html += '</div>';

    const result = modPow(base, exp, n);

    if (cycleLength > 0 && exp > cycleLength) {
        const remainder = ((exp - 1) % cycleLength) + 1;
        html += '<div class="step">';
        html += '<div class="step-number">Etape 3 : Utilisation du cycle</div>';
        html += '<div class="step-expression">' +
            K(`${exp} = ${cycleLength} \\times ${Math.floor((exp - 1) / cycleLength)} + ${remainder}`) + '</div>';
        html += '<div class="step-explanation">Donc ' +
            K(`${base}^{${exp}} \\equiv ${base}^{${remainder}} \\equiv ${result} \\pmod{${n}}`) + '</div>';
        html += '</div>';
    }

    html += '<div class="result-highlight">';
    html += '<div class="final">' +
        K(`${base}^{${exp}} \\equiv \\boxed{${result}} \\pmod{${n}}`) + '</div>';
    html += '</div>';

    return html;
}

// ---- Bezout ----

function solveBezout(ex) {
    const sub = ArithState.subtype_bezout;

    if (sub === 'coefficients') {
        return solveBezoutCoeffs(ex);
    } else if (sub === 'equation_diophantienne') {
        return solveDiophantienne(ex);
    }
    return '';
}

function solveBezoutCoeffs(ex) {
    let html = '';
    const a = ex.a;
    const b = ex.b;

    // Euclide d'abord
    const eucl = euclideSteps(a, b);

    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : Algorithme d\'Euclide</div>';
    html += '<div class="step-expression">';
    eucl.steps.forEach(s => {
        html += K(`${s.a} = ${s.b} \\times ${s.q} + ${s.r}`) + '<br>';
    });
    html += '</div>';
    html += '<div class="step-explanation">' + K(`\\text{PGCD}(${a},\\, ${b}) = ${eucl.pgcd}`) + '</div>';
    html += '</div>';

    if (eucl.pgcd !== 1) {
        html += '<div class="result-highlight">';
        html += '<div class="final">' + K(`\\text{PGCD}(${a}, ${b}) = ${eucl.pgcd} \\neq 1`) +
            '<br>Les nombres ne sont pas premiers entre eux. Le theoreme de Bezout donne ' +
            K(`${a}u + ${b}v = ${eucl.pgcd}`) + '.</div>';
        html += '</div>';
    }

    // Remontee de l'algorithme d'Euclide
    html += '<div class="step">';
    html += '<div class="step-number">Etape 2 : Remontee de l\'algorithme</div>';
    html += '<div class="step-explanation">On exprime chaque reste en fonction de ' +
        K('a') + ' et ' + K('b') + ' en remontant les egalites.</div>';
    html += '<div class="step-expression">';

    // Remontee
    const steps = eucl.steps;
    if (steps.length >= 2) {
        // On part de l'avant-derniere ligne (dernier reste non nul)
        for (let i = steps.length - 2; i >= 0; i--) {
            const s = steps[i];
            html += K(`${s.r} = ${s.a} - ${s.b} \\times ${s.q}`) + '<br>';
        }
    }

    html += '</div></div>';

    // Resultat avec Euclide etendu
    const ext = extendedGcd(a, b);

    html += '<div class="step">';
    html += '<div class="step-number">Etape 3 : Verification</div>';
    html += '<div class="step-expression">' +
        K(`${a} \\times (${ext.u}) + ${b} \\times (${ext.v}) = ${a * ext.u + b * ext.v}`) + '</div>';
    html += '</div>';

    html += '<div class="result-highlight">';
    html += '<div class="final">' +
        K(`\\boxed{${a} \\times (${ext.u}) + ${b} \\times (${ext.v}) = ${eucl.pgcd}}`) +
        '<br>' + K(`u = ${ext.u},\\quad v = ${ext.v}`) + '</div>';
    html += '</div>';

    return html;
}

function solveDiophantienne(ex) {
    let html = '';
    const a = ex.a;
    const b = ex.b;
    const c = ex.c;
    const d = ex.d; // pgcd(a, b)

    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : Condition d\'existence</div>';
    html += '<div class="step-explanation">L\'equation ' + K(`${a}x + ${b}y = ${c}`) +
        ' admet des solutions si et seulement si ' + K(`\\text{PGCD}(${a}, ${b})`) +
        ' divise ' + K(String(c)) + '.</div>';

    const eucl = euclideSteps(a, b);
    html += '<div class="step-expression">' +
        K(`\\text{PGCD}(${a}, ${b}) = ${d}`) + ' et ' +
        K(`${c} = ${d} \\times ${c / d}`) + ' : ' + K(`${d} | ${c}`) + ' &#10003;</div>';
    html += '</div>';

    // Simplification
    const a2 = a / d;
    const b2 = b / d;
    const c2 = c / d;

    html += '<div class="step">';
    html += '<div class="step-number">Etape 2 : Simplification</div>';
    if (d > 1) {
        html += '<div class="step-expression">' +
            K(`${a}x + ${b}y = ${c} \\iff ${a2}x + ${b2}y = ${c2}`) + '</div>';
        html += '<div class="step-explanation">On divise par ' + K(String(d)) + '. Maintenant ' +
            K(`\\text{PGCD}(${a2}, ${b2}) = 1`) + '.</div>';
    } else {
        html += '<div class="step-expression">' +
            K(`\\text{PGCD}(${a}, ${b}) = 1`) + ' : l\'equation est deja simplifiee.</div>';
    }
    html += '</div>';

    // Trouver une solution particuliere via Bezout
    const ext = extendedGcd(a2, b2);
    const x0 = ext.u * c2;
    const y0 = ext.v * c2;

    html += '<div class="step">';
    html += '<div class="step-number">Etape 3 : Solution particuliere (Bezout)</div>';
    html += '<div class="step-expression">';
    html += K(`${a2} \\times (${ext.u}) + ${b2} \\times (${ext.v}) = 1`) + '<br>';
    if (c2 !== 1) {
        html += 'En multipliant par ' + K(String(c2)) + ' :<br>';
        html += K(`${a2} \\times (${x0}) + ${b2} \\times (${y0}) = ${c2}`) + '<br>';
    }
    html += '</div>';
    html += '<div class="step-explanation">Solution particuliere : ' +
        K(`x_0 = ${x0},\\; y_0 = ${y0}`) + '</div>';
    html += '</div>';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 4 : Solution generale</div>';
    html += '<div class="step-explanation">Les solutions generales sont de la forme :</div>';

    const signB2 = b2 >= 0 ? '+' : '-';
    const signA2 = a2 >= 0 ? '-' : '+';

    html += '<div class="step-expression">' +
        K(`\\begin{cases} x = ${x0} ${signB2} ${Math.abs(b2)}k \\\\ y = ${y0} ${signA2} ${Math.abs(a2)}k \\end{cases} \\quad k \\in \\mathbb{Z}`) + '</div>';
    html += '</div>';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 5 : Verification</div>';
    html += '<div class="step-expression">';
    html += 'Pour ' + K('k = 0') + ' : ' +
        K(`${a} \\times (${x0}) + ${b} \\times (${y0}) = ${a * x0} + ${b * y0} = ${a * x0 + b * y0}`) + ' &#10003;';
    html += '</div></div>';

    html += '<div class="result-highlight">';
    html += '<div class="final">' +
        K(`\\boxed{\\begin{cases} x = ${x0} ${signB2} ${Math.abs(b2)}k \\\\ y = ${y0} ${signA2} ${Math.abs(a2)}k \\end{cases}} \\quad k \\in \\mathbb{Z}`) + '</div>';
    html += '</div>';

    return html;
}

// ========================================
// Initialisation au chargement
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    initArithmetiquePage();
});
