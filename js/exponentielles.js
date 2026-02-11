/* ========================================
   EXPONENTIELLES.JS - Exponentielles & Logarithmes
   ======================================== */

/**
 * Etat du module Exponentielles
 */
const ExpState = {
    currentType: 'eq_exp',

    // Sous-types
    subtype_eq_exp: 'exp_egal_k',
    subtype_eq_ln: 'ln_egal_k',
    subtype_derivee: 'exp_compose',
    subtype_etude: 'poly_exp',
    subtype_croissance: 'population',
    subtype_log_decimal: 'ph',

    // Donnees exercice courant
    exercise: {}
};

// ========================================
// Initialisation
// ========================================

function initExponentiellesPage() {
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
            ExpState.currentType = button.dataset.type;

            document.querySelectorAll('[id$="Section"]').forEach(section => {
                section.style.display = 'none';
            });

            const sectionMap = {
                'eq_exp': 'eqExpSection',
                'eq_ln': 'eqLnSection',
                'derivee': 'deriveeSection',
                'etude': 'etudeSection',
                'croissance': 'croissanceSection',
                'log_decimal': 'logDecimalSection'
            };
            const sectionId = sectionMap[ExpState.currentType];
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
        'subtype_eq_exp', 'subtype_eq_ln', 'subtype_derivee',
        'subtype_etude', 'subtype_croissance', 'subtype_log_decimal'
    ];
    selects.forEach(id => {
        $(id).addEventListener('change', () => {
            ExpState[id] = $(id).value;
            generateNewExercise();
            updateExerciseDisplay();
            hideSolution('solutionDiv');
        });
    });
}

function setupActionButtons() {
    $('newExerciseBtn').addEventListener('click', () => {
        generateNewExercise();
        updateExerciseDisplay();
        hideSolution('solutionDiv');
    });

    $('solveBtn').addEventListener('click', () => {
        solveExponentielles();
    });
}

// ========================================
// Utilitaires locaux
// ========================================

function rint(min, max, exclude) {
    let val;
    const excl = exclude || [];
    do {
        val = Math.floor(Math.random() * (max - min + 1)) + min;
    } while (excl.includes(val));
    return val;
}

function K(latex) {
    return katex.renderToString(latex, { throwOnError: false });
}

function signStr(n) {
    return n >= 0 ? '+' : '-';
}

function absStr(n) {
    return Math.abs(n);
}

function termStr(n, first) {
    if (first) {
        return n < 0 ? `- ${Math.abs(n)}` : `${n}`;
    }
    return n >= 0 ? `+ ${n}` : `- ${Math.abs(n)}`;
}

function linLatex(a, b, variable) {
    variable = variable || 'x';
    if (a === 0) return `${b}`;
    let s = '';
    if (a === 1) s = variable;
    else if (a === -1) s = `-${variable}`;
    else s = `${a}${variable}`;
    if (b === 0) return s;
    return `${s} ${signStr(b)} ${absStr(b)}`;
}

// ========================================
// Affichage exercice
// ========================================

function updateExerciseDisplay() {
    let html = '';
    const ex = ExpState.exercise;

    switch (ExpState.currentType) {
        case 'eq_exp':
            html = displayEqExp();
            break;
        case 'eq_ln':
            html = displayEqLn();
            break;
        case 'derivee':
            html = displayDerivee();
            break;
        case 'etude':
            html = displayEtude();
            break;
        case 'croissance':
            html = displayCroissance();
            break;
        case 'log_decimal':
            html = displayLogDecimal();
            break;
    }

    $('expressionDisplay').innerHTML = html;
}

function displayEqExp() {
    const ex = ExpState.exercise;
    const sub = ExpState.subtype_eq_exp;

    if (sub === 'exp_egal_k') {
        const inner = linLatex(ex.a, ex.b);
        return K(`e^{${inner}} = ${ex.k}`);
    } else if (sub === 'exp_egal_exp') {
        const left = linLatex(ex.a, ex.b);
        const right = linLatex(ex.c, ex.d);
        return K(`e^{${left}} = e^{${right}}`);
    } else {
        // exp_second_degre: ae^(2x) + be^x + c = 0
        const aStr = ex.A === 1 ? '' : (ex.A === -1 ? '-' : ex.A);
        const bStr = `${signStr(ex.B)} ${absStr(ex.B)}`;
        const cStr = `${signStr(ex.C)} ${absStr(ex.C)}`;
        return K(`${aStr}e^{2x} ${bStr}\\,e^{x} ${cStr} = 0`);
    }
}

function displayEqLn() {
    const ex = ExpState.exercise;
    const sub = ExpState.subtype_eq_ln;

    if (sub === 'ln_egal_k') {
        const inner = linLatex(ex.a, ex.b);
        return K(`\\ln(${inner}) = ${ex.k}`);
    } else if (sub === 'ln_egal_ln') {
        const left = linLatex(ex.a, ex.b);
        const right = linLatex(ex.c, ex.d);
        return K(`\\ln(${left}) = \\ln(${right})`);
    } else {
        // ln_somme: ln(x) + ln(x + p) = ln(q)
        const pSign = signStr(ex.p);
        return K(`\\ln(x) + \\ln(x ${pSign} ${absStr(ex.p)}) = \\ln(${ex.q})`);
    }
}

function displayDerivee() {
    const ex = ExpState.exercise;
    const sub = ExpState.subtype_derivee;

    if (sub === 'exp_compose') {
        const inner = linLatex(ex.a, ex.b);
        return `Calculer la derivee de ` + K(`f(x) = e^{${inner}}`);
    } else if (sub === 'produit_exp') {
        const poly = linLatex(ex.a, ex.b);
        const expPart = ex.c === 1 ? 'e^{x}' : (ex.c === -1 ? 'e^{-x}' : `e^{${ex.c}x}`);
        return `Calculer la derivee de ` + K(`f(x) = (${poly})\\,${expPart}`);
    } else if (sub === 'quotient_exp') {
        const poly = linLatex(ex.a, ex.b);
        const expPart = ex.c === 1 ? 'e^{x}' : (ex.c === -1 ? 'e^{-x}' : `e^{${ex.c}x}`);
        return `Calculer la derivee de ` + K(`f(x) = \\frac{${poly}}{${expPart}}`);
    } else if (sub === 'ln_compose') {
        const inner = linLatex(ex.a, ex.b);
        return `Calculer la derivee de ` + K(`f(x) = \\ln(${inner})`);
    } else if (sub === 'produit_ln') {
        const coef = ex.a === 1 ? '' : (ex.a === -1 ? '-' : ex.a);
        return `Calculer la derivee de ` + K(`f(x) = ${coef}x\\,\\ln(x)`);
    } else {
        // quotient_ln
        if (ex.numIsLn) {
            return `Calculer la derivee de ` + K(`f(x) = \\frac{\\ln(x)}{${linLatex(ex.a, ex.b)}}`);
        } else {
            return `Calculer la derivee de ` + K(`f(x) = \\frac{${linLatex(ex.a, ex.b)}}{\\ln(x)}`);
        }
    }
}

function displayEtude() {
    const ex = ExpState.exercise;
    const sub = ExpState.subtype_etude;

    if (sub === 'poly_exp') {
        const poly = linLatex(ex.a, ex.b);
        const expPart = ex.c === -1 ? 'e^{-x}' : `e^{${ex.c}x}`;
        return `Etudier les variations de ` + K(`f(x) = (${poly})\\,${expPart}`);
    } else if (sub === 'x_ln') {
        const coef = ex.a === 1 ? '' : (ex.a === -1 ? '-' : ex.a);
        return `Etudier les variations de ` + K(`f(x) = ${coef}x\\,\\ln(x)`) + ` sur ` + K(`]0 ; +\\infty[`);
    } else {
        return `Etudier les variations de ` + K(`f(x) = \\frac{\\ln(x)}{x}`) + ` sur ` + K(`]0 ; +\\infty[`);
    }
}

function displayCroissance() {
    const ex = ExpState.exercise;
    const sub = ExpState.subtype_croissance;

    if (sub === 'population') {
        return `Une population de ${ex.N0} individus croit de ${ex.taux}% par an.<br>` +
            `Combien y aura-t-il d'individus apres <strong>${ex.t} ans</strong> ?`;
    } else if (sub === 'decroissance') {
        return `Une substance radioactive a une demi-vie de <strong>${ex.demiVie} ans</strong>.<br>` +
            `On part de ${ex.N0} g. Quelle masse reste-t-il apres <strong>${ex.t} ans</strong> ?`;
    } else {
        return `Une population de ${ex.N0} individus croit de ${ex.taux}% par an.<br>` +
            `Au bout de combien d'annees la population aura-t-elle <strong>double</strong> ?`;
    }
}

function displayLogDecimal() {
    const ex = ExpState.exercise;
    const sub = ExpState.subtype_log_decimal;

    if (sub === 'ph') {
        return `La concentration en ions H<sup>+</sup> d'une solution est ` +
            K(`[H^+] = ${ex.coef} \\times 10^{${ex.exposant}}`) + ` mol/L.<br>` +
            `Calculer le <strong>pH</strong> de cette solution.`;
    } else if (sub === 'decibels') {
        return `L'intensite sonore d'un son est ` +
            K(`I = ${ex.coef} \\times 10^{${ex.exposant}}`) + ` W/m².<br>` +
            `Calculer le niveau sonore en <strong>decibels</strong>.` +
            `<br><small>(` + K(`I_0 = 10^{-12}`) + ` W/m²)</small>`;
    } else {
        return `Un seisme a une energie ` +
            K(`E = ${ex.coef} \\times 10^{${ex.exposant}}`) + ` joules.<br>` +
            `Calculer sa <strong>magnitude</strong> sur l'echelle de Richter.` +
            `<br><small>(` + K(`M = \\frac{2}{3}\\log_{10}(E) - 3{,}2`) + `)</small>`;
    }
}

// ========================================
// Generation d'exercices
// ========================================

function generateNewExercise() {
    switch (ExpState.currentType) {
        case 'eq_exp': generateEqExp(); break;
        case 'eq_ln': generateEqLn(); break;
        case 'derivee': generateDerivee(); break;
        case 'etude': generateEtude(); break;
        case 'croissance': generateCroissance(); break;
        case 'log_decimal': generateLogDecimal(); break;
    }
}

function generateEqExp() {
    const sub = ExpState.subtype_eq_exp;

    if (sub === 'exp_egal_k') {
        ExpState.exercise = {
            a: rint(1, 4) * (Math.random() < 0.3 ? -1 : 1),
            b: rint(-5, 5),
            k: rint(1, 10)
        };
        // Eviter a=0
        if (ExpState.exercise.a === 0) ExpState.exercise.a = 1;
    } else if (sub === 'exp_egal_exp') {
        ExpState.exercise = {
            a: rint(1, 5),
            b: rint(-5, 5),
            c: rint(1, 5),
            d: rint(-5, 5)
        };
        // S'assurer que a != c pour avoir une solution
        if (ExpState.exercise.a === ExpState.exercise.c) {
            ExpState.exercise.c = ExpState.exercise.a + 1;
        }
    } else {
        // exp_second_degre: on construit a partir de racines e^x = r1 et e^x = r2
        // Pour que e^x = r ait une solution, r > 0
        const r1 = rint(1, 5);
        const r2 = rint(1, 5);
        // A(e^x)^2 + B(e^x) + C = 0 => A*t^2 + B*t + C avec t1=r1, t2=r2
        // A=1, B = -(r1+r2), C = r1*r2
        ExpState.exercise = {
            A: 1,
            B: -(r1 + r2),
            C: r1 * r2,
            r1: r1,
            r2: r2
        };
    }
}

function generateEqLn() {
    const sub = ExpState.subtype_eq_ln;

    if (sub === 'ln_egal_k') {
        ExpState.exercise = {
            a: rint(1, 4),
            b: rint(-5, 5),
            k: rint(0, 3)
        };
    } else if (sub === 'ln_egal_ln') {
        // ln(ax+b) = ln(cx+d), on veut a != c
        const a = rint(1, 4);
        const c = rint(1, 4, [a]);
        ExpState.exercise = {
            a: a,
            b: rint(-5, 5),
            c: c,
            d: rint(-5, 5)
        };
    } else {
        // ln(x) + ln(x+p) = ln(q)
        // => ln(x(x+p)) = ln(q) => x² + px - q = 0
        // On choisit une solution positive x0, puis p et q
        const x0 = rint(1, 6);
        const p = rint(1, 5);
        const q = x0 * (x0 + p);
        ExpState.exercise = { p: p, q: q, x0: x0 };
    }
}

function generateDerivee() {
    const sub = ExpState.subtype_derivee;

    if (sub === 'exp_compose') {
        ExpState.exercise = {
            a: rint(1, 5) * (Math.random() < 0.3 ? -1 : 1),
            b: rint(-5, 5)
        };
        if (ExpState.exercise.a === 0) ExpState.exercise.a = 2;
    } else if (sub === 'produit_exp') {
        ExpState.exercise = {
            a: rint(1, 4) * (Math.random() < 0.3 ? -1 : 1),
            b: rint(-5, 5),
            c: rint(1, 3) * (Math.random() < 0.5 ? -1 : 1)
        };
        if (ExpState.exercise.a === 0) ExpState.exercise.a = 1;
    } else if (sub === 'quotient_exp') {
        ExpState.exercise = {
            a: rint(1, 4) * (Math.random() < 0.3 ? -1 : 1),
            b: rint(-5, 5),
            c: rint(1, 3) * (Math.random() < 0.5 ? -1 : 1)
        };
        if (ExpState.exercise.a === 0) ExpState.exercise.a = 1;
    } else if (sub === 'ln_compose') {
        ExpState.exercise = {
            a: rint(1, 5) * (Math.random() < 0.2 ? -1 : 1),
            b: rint(-5, 5)
        };
        if (ExpState.exercise.a === 0) ExpState.exercise.a = 3;
    } else if (sub === 'produit_ln') {
        ExpState.exercise = {
            a: rint(1, 4) * (Math.random() < 0.3 ? -1 : 1)
        };
        if (ExpState.exercise.a === 0) ExpState.exercise.a = 1;
    } else {
        // quotient_ln
        ExpState.exercise = {
            a: rint(1, 3),
            b: rint(-3, 3),
            numIsLn: Math.random() < 0.5
        };
    }
}

function generateEtude() {
    const sub = ExpState.subtype_etude;

    if (sub === 'poly_exp') {
        ExpState.exercise = {
            a: rint(1, 3) * (Math.random() < 0.4 ? -1 : 1),
            b: rint(-4, 4),
            c: Math.random() < 0.5 ? -1 : 1
        };
        if (ExpState.exercise.a === 0) ExpState.exercise.a = 1;
    } else if (sub === 'x_ln') {
        ExpState.exercise = {
            a: rint(1, 3) * (Math.random() < 0.3 ? -1 : 1)
        };
        if (ExpState.exercise.a === 0) ExpState.exercise.a = 1;
    } else {
        ExpState.exercise = {};
    }
}

function generateCroissance() {
    const sub = ExpState.subtype_croissance;

    if (sub === 'population') {
        ExpState.exercise = {
            N0: rint(1, 9) * 1000,
            taux: rint(2, 15),
            t: rint(3, 20)
        };
    } else if (sub === 'decroissance') {
        const demiVies = [5, 8, 10, 12, 15, 20, 30];
        ExpState.exercise = {
            N0: rint(1, 9) * 100,
            demiVie: demiVies[rint(0, demiVies.length - 1)],
            t: rint(5, 50)
        };
    } else {
        ExpState.exercise = {
            N0: rint(1, 9) * 1000,
            taux: rint(2, 15)
        };
    }
}

function generateLogDecimal() {
    const sub = ExpState.subtype_log_decimal;

    if (sub === 'ph') {
        const exposant = rint(-6, -1);
        ExpState.exercise = {
            coef: rint(1, 9),
            exposant: exposant
        };
    } else if (sub === 'decibels') {
        const exposant = rint(-9, -3);
        ExpState.exercise = {
            coef: rint(1, 9),
            exposant: exposant
        };
    } else {
        const exposant = rint(10, 18);
        ExpState.exercise = {
            coef: rint(1, 9),
            exposant: exposant
        };
    }
}

// ========================================
// Resolution
// ========================================

function solveExponentielles() {
    let html = '';

    switch (ExpState.currentType) {
        case 'eq_exp': html = solveEqExp(); break;
        case 'eq_ln': html = solveEqLn(); break;
        case 'derivee': html = solveDerivee(); break;
        case 'etude': html = solveEtude(); break;
        case 'croissance': html = solveCroissance(); break;
        case 'log_decimal': html = solveLogDecimal(); break;
    }

    $('stepsContainer').innerHTML = html;
    showSolution('solutionDiv');
}

// ----------------------------------------
// Resolution equations exponentielles
// ----------------------------------------

function solveEqExp() {
    const sub = ExpState.subtype_eq_exp;
    if (sub === 'exp_egal_k') return solveExpEgalK();
    if (sub === 'exp_egal_exp') return solveExpEgalExp();
    return solveExpSecondDegre();
}

function solveExpEgalK() {
    const { a, b, k } = ExpState.exercise;
    let html = '';

    // Rappel
    html += '<div class="step">';
    html += '<div class="step-number">Rappel de cours</div>';
    html += '<div class="step-explanation">';
    html += 'Pour resoudre ' + K('e^X = k') + ' :<br>';
    html += '- Si ' + K('k > 0') + ' : ' + K('X = \\ln(k)') + '<br>';
    html += '- Si ' + K('k \\leq 0') + ' : pas de solution (l\'exponentielle est toujours positive)';
    html += '</div></div>';

    if (k <= 0) {
        html += '<div class="step">';
        html += '<div class="step-number">Conclusion</div>';
        html += '<div class="step-explanation">' + K(`${k} \\leq 0`) + ' donc l\'equation n\'a <strong>pas de solution</strong>.</div>';
        html += '</div>';
        html += '<div class="result-highlight"><div class="final">Pas de solution</div></div>';
        return html;
    }

    // Etape 1 : appliquer ln
    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : Appliquer le logarithme</div>';
    html += '<div class="step-explanation">Comme ' + K(`${k} > 0`) + ', on peut appliquer ln aux deux membres :</div>';
    const inner = linLatex(a, b);
    html += '<div class="step-expression">' + K(`e^{${inner}} = ${k}`) + '</div>';
    html += '<div class="step-expression">' + K(`${inner} = \\ln(${k})`) + '</div>';
    html += '</div>';

    // Etape 2 : resoudre
    html += '<div class="step">';
    html += '<div class="step-number">Etape 2 : Resoudre l\'equation</div>';
    const lnK = Math.log(k);

    if (b !== 0) {
        html += '<div class="step-expression">' + K(`${a}x = \\ln(${k}) ${signStr(-b)} ${absStr(b)}`) + '</div>';
    }
    html += '<div class="step-expression">' + K(`x = \\frac{\\ln(${k}) ${signStr(-b)} ${absStr(b)}}{${a}}`) + '</div>';
    html += '</div>';

    // Etape 3 : valeur
    const xVal = (lnK - b) / a;
    html += '<div class="step">';
    html += '<div class="step-number">Etape 3 : Valeur numerique</div>';
    html += '<div class="step-expression">' + K(`x = \\frac{\\ln(${k}) ${signStr(-b)} ${absStr(b)}}{${a}}`) + '</div>';
    html += '<div class="step-expression">' + K(`x \\approx \\frac{${formatNumber(lnK)} ${signStr(-b)} ${absStr(b)}}{${a}}`) + '</div>';
    html += '<div class="step-expression">' + K(`x \\approx \\color{#38a169}{${formatNumber(xVal)}}`) + '</div>';
    html += '</div>';

    html += '<div class="result-highlight"><div class="final">';
    html += K(`\\boxed{x = \\frac{\\ln(${k}) ${signStr(-b)} ${absStr(b)}}{${a}} \\approx ${formatNumber(xVal)}}`);
    html += '</div></div>';
    return html;
}

function solveExpEgalExp() {
    const { a, b, c, d } = ExpState.exercise;
    let html = '';

    // Rappel
    html += '<div class="step">';
    html += '<div class="step-number">Rappel de cours</div>';
    html += '<div class="step-explanation">';
    html += K('e^A = e^B \\iff A = B') + '<br>';
    html += 'L\'exponentielle est une fonction <strong>strictement croissante</strong>, donc elle est injective.';
    html += '</div></div>';

    // Etape 1 : egalite des exposants
    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : Egalite des exposants</div>';
    html += '<div class="step-expression">' + K(`e^{${linLatex(a, b)}} = e^{${linLatex(c, d)}}`) + '</div>';
    html += '<div class="step-expression">' + K(`${linLatex(a, b)} = ${linLatex(c, d)}`) + '</div>';
    html += '</div>';

    // Etape 2 : resoudre
    html += '<div class="step">';
    html += '<div class="step-number">Etape 2 : Resoudre l\'equation du 1er degre</div>';
    const coeffX = a - c;
    const constante = d - b;
    html += '<div class="step-expression">' + K(`${a}x - ${c}x = ${d} ${signStr(-b)} ${absStr(b)}`) + '</div>';
    html += '<div class="step-expression">' + K(`${coeffX}x = ${constante}`) + '</div>';
    const xVal = constante / coeffX;
    html += '<div class="step-expression">' + K(`x = \\frac{${constante}}{${coeffX}} = \\color{#38a169}{${formatNumber(xVal)}}`) + '</div>';
    html += '</div>';

    html += '<div class="result-highlight"><div class="final">';
    html += K(`\\boxed{x = ${formatNumber(xVal)}}`);
    html += '</div></div>';
    return html;
}

function solveExpSecondDegre() {
    const { A, B, C, r1, r2 } = ExpState.exercise;
    let html = '';

    // Rappel
    html += '<div class="step">';
    html += '<div class="step-number">Rappel de cours</div>';
    html += '<div class="step-explanation">';
    html += 'On pose ' + K('t = e^x') + ' avec ' + K('t > 0') + '.<br>';
    html += 'L\'equation devient une equation du 2nd degre en ' + K('t') + '.<br>';
    html += 'On resout, puis on revient a ' + K('x = \\ln(t)') + ' pour chaque ' + K('t > 0') + '.';
    html += '</div></div>';

    // Etape 1 : poser t = e^x
    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : Changement de variable</div>';
    html += '<div class="step-explanation">On pose ' + K('t = e^x') + ' avec ' + K('t > 0') + '.</div>';
    const bStr = `${signStr(B)} ${absStr(B)}`;
    const cStr = `${signStr(C)} ${absStr(C)}`;
    html += '<div class="step-expression">' + K(`t^2 ${bStr}\\,t ${cStr} = 0`) + '</div>';
    html += '</div>';

    // Etape 2 : discriminant
    const delta = B * B - 4 * A * C;
    html += '<div class="step">';
    html += '<div class="step-number">Etape 2 : Discriminant</div>';
    html += '<div class="step-expression">' + K(`\\Delta = (${B})^2 - 4 \\times ${A} \\times ${C} = ${B * B} - ${4 * A * C} = ${delta}`) + '</div>';
    html += '</div>';

    // Etape 3 : solutions en t
    html += '<div class="step">';
    html += '<div class="step-number">Etape 3 : Solutions en t</div>';
    if (delta > 0) {
        const sqrtDelta = Math.sqrt(delta);
        const t1 = (-B - sqrtDelta) / (2 * A);
        const t2 = (-B + sqrtDelta) / (2 * A);
        html += '<div class="step-expression">' + K(`t_1 = \\frac{${-B} - \\sqrt{${delta}}}{2} = \\frac{${-B} - ${formatNumber(sqrtDelta)}}{2} = ${formatNumber(t1)}`) + '</div>';
        html += '<div class="step-expression">' + K(`t_2 = \\frac{${-B} + \\sqrt{${delta}}}{2} = \\frac{${-B} + ${formatNumber(sqrtDelta)}}{2} = ${formatNumber(t2)}`) + '</div>';

        // Etape 4 : revenir a x
        html += '</div>';
        html += '<div class="step">';
        html += '<div class="step-number">Etape 4 : Revenir a x = ln(t)</div>';
        html += '<div class="step-explanation">On ne garde que les solutions ' + K('t > 0') + ' :</div>';

        let solutions = [];
        if (t1 > 0) {
            const x1 = Math.log(t1);
            html += '<div class="step-expression">' + K(`t_1 = ${formatNumber(t1)} > 0 \\implies x_1 = \\ln(${formatNumber(t1)}) \\approx ${formatNumber(x1)}`) + '</div>';
            solutions.push(formatNumber(x1));
        } else {
            html += '<div class="step-expression">' + K(`t_1 = ${formatNumber(t1)} \\leq 0`) + ' : pas de solution</div>';
        }
        if (t2 > 0) {
            const x2 = Math.log(t2);
            html += '<div class="step-expression">' + K(`t_2 = ${formatNumber(t2)} > 0 \\implies x_2 = \\ln(${formatNumber(t2)}) \\approx ${formatNumber(x2)}`) + '</div>';
            solutions.push(formatNumber(x2));
        } else {
            html += '<div class="step-expression">' + K(`t_2 = ${formatNumber(t2)} \\leq 0`) + ' : pas de solution</div>';
        }
        html += '</div>';

        if (solutions.length > 0) {
            html += '<div class="result-highlight"><div class="final">';
            if (solutions.length === 2) {
                html += K(`\\boxed{x_1 = \\ln(${formatNumber(Math.min(r1, r2))}) \\approx ${solutions[0]} \\quad ; \\quad x_2 = \\ln(${formatNumber(Math.max(r1, r2))}) \\approx ${solutions[1]}}`);
            } else {
                html += K(`\\boxed{x = \\ln(${solutions[0]})}`);
            }
            html += '</div></div>';
        } else {
            html += '<div class="result-highlight"><div class="final">Pas de solution</div></div>';
        }
    } else if (delta === 0) {
        const t0 = -B / (2 * A);
        html += '<div class="step-expression">' + K(`t_0 = \\frac{${-B}}{2} = ${formatNumber(t0)}`) + '</div>';
        html += '</div>';
        html += '<div class="step"><div class="step-number">Etape 4 : Revenir a x</div>';
        if (t0 > 0) {
            const x0 = Math.log(t0);
            html += '<div class="step-expression">' + K(`x = \\ln(${formatNumber(t0)}) \\approx \\color{#38a169}{${formatNumber(x0)}}`) + '</div>';
            html += '</div>';
            html += '<div class="result-highlight"><div class="final">' + K(`\\boxed{x = \\ln(${formatNumber(t0)}) \\approx ${formatNumber(x0)}}`) + '</div></div>';
        } else {
            html += '<div class="step-expression">' + K(`t_0 = ${formatNumber(t0)} \\leq 0`) + ' : pas de solution</div>';
            html += '</div>';
            html += '<div class="result-highlight"><div class="final">Pas de solution</div></div>';
        }
    }

    return html;
}

// ----------------------------------------
// Resolution equations logarithmiques
// ----------------------------------------

function solveEqLn() {
    const sub = ExpState.subtype_eq_ln;
    if (sub === 'ln_egal_k') return solveLnEgalK();
    if (sub === 'ln_egal_ln') return solveLnEgalLn();
    return solveLnSomme();
}

function solveLnEgalK() {
    const { a, b, k } = ExpState.exercise;
    let html = '';

    // Rappel
    html += '<div class="step">';
    html += '<div class="step-number">Rappel de cours</div>';
    html += '<div class="step-explanation">';
    html += K('\\ln(X) = k \\iff X = e^k') + ' (avec ' + K('X > 0') + ')<br>';
    html += 'Le logarithme n\'est defini que pour les valeurs <strong>strictement positives</strong>.';
    html += '</div></div>';

    // Etape 1 : passer a l'exponentielle
    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : Passer a l\'exponentielle</div>';
    const inner = linLatex(a, b);
    html += '<div class="step-expression">' + K(`\\ln(${inner}) = ${k}`) + '</div>';
    html += '<div class="step-expression">' + K(`${inner} = e^{${k}}`) + '</div>';
    html += '</div>';

    // Etape 2 : resoudre
    html += '<div class="step">';
    html += '<div class="step-number">Etape 2 : Resoudre</div>';
    const ek = Math.exp(k);
    if (b !== 0) {
        html += '<div class="step-expression">' + K(`${a}x = e^{${k}} ${signStr(-b)} ${absStr(b)}`) + '</div>';
    }
    html += '<div class="step-expression">' + K(`x = \\frac{e^{${k}} ${signStr(-b)} ${absStr(b)}}{${a}}`) + '</div>';
    const xVal = (ek - b) / a;
    html += '<div class="step-expression">' + K(`x \\approx \\frac{${formatNumber(ek)} ${signStr(-b)} ${absStr(b)}}{${a}} \\approx ${formatNumber(xVal)}`) + '</div>';
    html += '</div>';

    // Etape 3 : verification domaine
    html += '<div class="step">';
    html += '<div class="step-number">Etape 3 : Verification du domaine</div>';
    const valInner = a * xVal + b;
    html += '<div class="step-explanation">On verifie que ' + K(`${inner} > 0`) + ' pour ' + K(`x \\approx ${formatNumber(xVal)}`) + ' :</div>';
    html += '<div class="step-expression">' + K(`${a} \\times ${formatNumber(xVal)} ${signStr(b)} ${absStr(b)} \\approx ${formatNumber(valInner)}`) + '</div>';
    if (valInner > 0) {
        html += '<div class="step-explanation">C\'est bien positif, la solution est valide.</div>';
    } else {
        html += '<div class="step-explanation">C\'est negatif ! La solution n\'est <strong>pas valide</strong>.</div>';
    }
    html += '</div>';

    html += '<div class="result-highlight"><div class="final">';
    if (valInner > 0) {
        html += K(`\\boxed{x = \\frac{e^{${k}} ${signStr(-b)} ${absStr(b)}}{${a}} \\approx ${formatNumber(xVal)}}`);
    } else {
        html += 'Pas de solution';
    }
    html += '</div></div>';
    return html;
}

function solveLnEgalLn() {
    const { a, b, c, d } = ExpState.exercise;
    let html = '';

    // Rappel
    html += '<div class="step">';
    html += '<div class="step-number">Rappel de cours</div>';
    html += '<div class="step-explanation">';
    html += K('\\ln(A) = \\ln(B) \\iff A = B') + ' (avec ' + K('A > 0') + ' et ' + K('B > 0') + ')<br>';
    html += 'Le logarithme est une fonction <strong>strictement croissante</strong>, donc injective.';
    html += '</div></div>';

    // Etape 1 : egalite des arguments
    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : Egalite des arguments</div>';
    html += '<div class="step-expression">' + K(`\\ln(${linLatex(a, b)}) = \\ln(${linLatex(c, d)})`) + '</div>';
    html += '<div class="step-expression">' + K(`${linLatex(a, b)} = ${linLatex(c, d)}`) + '</div>';
    html += '</div>';

    // Etape 2 : resoudre
    html += '<div class="step">';
    html += '<div class="step-number">Etape 2 : Resoudre</div>';
    const coeffX = a - c;
    const constante = d - b;
    html += '<div class="step-expression">' + K(`${a}x - ${c}x = ${d} ${signStr(-b)} ${absStr(b)}`) + '</div>';
    html += '<div class="step-expression">' + K(`${coeffX}x = ${constante}`) + '</div>';
    const xVal = constante / coeffX;
    html += '<div class="step-expression">' + K(`x = \\frac{${constante}}{${coeffX}} = ${formatNumber(xVal)}`) + '</div>';
    html += '</div>';

    // Etape 3 : verification
    html += '<div class="step">';
    html += '<div class="step-number">Etape 3 : Verification du domaine</div>';
    const leftVal = a * xVal + b;
    const rightVal = c * xVal + d;
    html += '<div class="step-explanation">On verifie que les deux arguments sont positifs :</div>';
    html += '<div class="step-expression">' + K(`${linLatex(a, b)} = ${a} \\times ${formatNumber(xVal)} ${signStr(b)} ${absStr(b)} = ${formatNumber(leftVal)}`) + '</div>';
    html += '<div class="step-expression">' + K(`${linLatex(c, d)} = ${c} \\times ${formatNumber(xVal)} ${signStr(d)} ${absStr(d)} = ${formatNumber(rightVal)}`) + '</div>';
    if (leftVal > 0 && rightVal > 0) {
        html += '<div class="step-explanation">Les deux sont positifs : la solution est <strong>valide</strong>.</div>';
    } else {
        html += '<div class="step-explanation">Au moins un argument est negatif ou nul : <strong>pas de solution</strong>.</div>';
    }
    html += '</div>';

    html += '<div class="result-highlight"><div class="final">';
    if (leftVal > 0 && rightVal > 0) {
        html += K(`\\boxed{x = ${formatNumber(xVal)}}`);
    } else {
        html += 'Pas de solution';
    }
    html += '</div></div>';
    return html;
}

function solveLnSomme() {
    const { p, q, x0 } = ExpState.exercise;
    let html = '';

    // Rappel
    html += '<div class="step">';
    html += '<div class="step-number">Rappel de cours</div>';
    html += '<div class="step-explanation">';
    html += K('\\ln(a) + \\ln(b) = \\ln(a \\times b)') + '<br>';
    html += 'Propriete fondamentale du logarithme : le log d\'un produit = somme des logs.';
    html += '</div></div>';

    // Etape 1 : regrouper
    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : Regrouper les logarithmes</div>';
    html += '<div class="step-expression">' + K(`\\ln(x) + \\ln(x ${signStr(p)} ${absStr(p)}) = \\ln(${q})`) + '</div>';
    html += '<div class="step-expression">' + K(`\\ln\\!\\left(x(x ${signStr(p)} ${absStr(p)})\\right) = \\ln(${q})`) + '</div>';
    html += '</div>';

    // Etape 2 : egalite des arguments
    html += '<div class="step">';
    html += '<div class="step-number">Etape 2 : Egalite des arguments</div>';
    html += '<div class="step-expression">' + K(`x(x ${signStr(p)} ${absStr(p)}) = ${q}`) + '</div>';
    html += '<div class="step-expression">' + K(`x^2 ${signStr(p)} ${absStr(p)}x - ${q} = 0`) + '</div>';
    html += '</div>';

    // Etape 3 : discriminant
    const delta = p * p + 4 * q;
    html += '<div class="step">';
    html += '<div class="step-number">Etape 3 : Resoudre l\'equation du 2nd degre</div>';
    html += '<div class="step-expression">' + K(`\\Delta = ${p}^2 + 4 \\times ${q} = ${p * p} + ${4 * q} = ${delta}`) + '</div>';

    const sqrtDelta = Math.sqrt(delta);
    const x1 = (-p - sqrtDelta) / 2;
    const x2 = (-p + sqrtDelta) / 2;
    html += '<div class="step-expression">' + K(`x_1 = \\frac{-${p} - \\sqrt{${delta}}}{2} = ${formatNumber(x1)}`) + '</div>';
    html += '<div class="step-expression">' + K(`x_2 = \\frac{-${p} + \\sqrt{${delta}}}{2} = ${formatNumber(x2)}`) + '</div>';
    html += '</div>';

    // Etape 4 : verification domaine
    html += '<div class="step">';
    html += '<div class="step-number">Etape 4 : Verification du domaine</div>';
    html += '<div class="step-explanation">Il faut ' + K('x > 0') + ' et ' + K(`x ${signStr(p)} ${absStr(p)} > 0`) + ' (arguments du ln).</div>';

    let validSolutions = [];
    if (x1 > 0 && x1 + p > 0) {
        html += '<div class="step-expression">' + K(`x_1 = ${formatNumber(x1)}`) + ' : valide</div>';
        validSolutions.push(formatNumber(x1));
    } else {
        html += '<div class="step-expression">' + K(`x_1 = ${formatNumber(x1)}`) + ' : rejetee (hors domaine)</div>';
    }
    if (x2 > 0 && x2 + p > 0) {
        html += '<div class="step-expression">' + K(`x_2 = ${formatNumber(x2)}`) + ' : valide</div>';
        validSolutions.push(formatNumber(x2));
    } else {
        html += '<div class="step-expression">' + K(`x_2 = ${formatNumber(x2)}`) + ' : rejetee (hors domaine)</div>';
    }
    html += '</div>';

    html += '<div class="result-highlight"><div class="final">';
    if (validSolutions.length > 0) {
        html += K(`\\boxed{x = ${validSolutions.join(' \\text{ ou } x = ')}}`);
    } else {
        html += 'Pas de solution';
    }
    html += '</div></div>';
    return html;
}

// ----------------------------------------
// Resolution derivees
// ----------------------------------------

function solveDerivee() {
    const sub = ExpState.subtype_derivee;
    if (sub === 'exp_compose') return solveDeriveeExpCompose();
    if (sub === 'produit_exp') return solveDeriveeProduitExp();
    if (sub === 'quotient_exp') return solveDeriveQuotientExp();
    if (sub === 'ln_compose') return solveDeriveeLnCompose();
    if (sub === 'produit_ln') return solveDeriveeProduitLn();
    return solveDeriveQuotientLn();
}

function solveDeriveeExpCompose() {
    const { a, b } = ExpState.exercise;
    let html = '';

    html += '<div class="step">';
    html += '<div class="step-number">Rappel de cours</div>';
    html += '<div class="step-explanation">';
    html += 'Si ' + K('f(x) = e^{u(x)}') + ', alors ' + K("f'(x) = u'(x) \\cdot e^{u(x)}") + '<br>';
    html += '(Derivee d\'une composee avec l\'exponentielle)';
    html += '</div></div>';

    const inner = linLatex(a, b);
    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : Identifier u(x)</div>';
    html += '<div class="step-expression">' + K(`f(x) = e^{${inner}}`) + '</div>';
    html += '<div class="step-expression">' + K(`u(x) = ${inner} \\implies u'(x) = ${a}`) + '</div>';
    html += '</div>';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 2 : Appliquer la formule</div>';
    html += '<div class="step-expression">' + K(`f'(x) = ${a} \\cdot e^{${inner}}`) + '</div>';
    html += '</div>';

    html += '<div class="result-highlight"><div class="final">';
    const aStr = a === 1 ? '' : (a === -1 ? '-' : a);
    html += K(`\\boxed{f'(x) = ${aStr}\\,e^{${inner}}}`);
    html += '</div></div>';
    return html;
}

function solveDeriveeProduitExp() {
    const { a, b, c } = ExpState.exercise;
    let html = '';

    html += '<div class="step">';
    html += '<div class="step-number">Rappel de cours</div>';
    html += '<div class="step-explanation">';
    html += K("(uv)' = u'v + uv'") + '<br>';
    html += 'Formule de derivation d\'un produit.';
    html += '</div></div>';

    const poly = linLatex(a, b);
    const expPart = c === 1 ? 'e^{x}' : (c === -1 ? 'e^{-x}' : `e^{${c}x}`);

    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : Identifier u et v</div>';
    html += '<div class="step-expression">' + K(`u(x) = ${poly} \\implies u'(x) = ${a}`) + '</div>';
    html += '<div class="step-expression">' + K(`v(x) = ${expPart} \\implies v'(x) = ${c}\\,${expPart}`) + '</div>';
    html += '</div>';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 2 : Appliquer (uv)\' = u\'v + uv\'</div>';
    html += '<div class="step-expression">' + K(`f'(x) = ${a}\\,${expPart} + (${poly}) \\cdot ${c}\\,${expPart}`) + '</div>';
    html += '</div>';

    // Factoriser par e^(cx)
    const newA = a + a * c; // a*c from the cx*(ax+b) part is wrong, let me recalculate
    // f'(x) = a * e^(cx) + (ax+b) * c * e^(cx) = e^(cx) * [a + c(ax+b)] = e^(cx) * [a + acx + bc] = e^(cx) * [acx + (a+bc)]
    const finalCoeffX = a * c;
    const finalConst = a + b * c;

    html += '<div class="step">';
    html += '<div class="step-number">Etape 3 : Factoriser par ' + K(expPart) + '</div>';
    html += '<div class="step-expression">' + K(`f'(x) = ${expPart}\\left(${a} + ${c}(${poly})\\right)`) + '</div>';
    html += '<div class="step-expression">' + K(`f'(x) = ${expPart}\\left(${a} + ${linLatex(a * c, b * c)}\\right)`) + '</div>';
    html += '<div class="step-expression">' + K(`f'(x) = ${expPart}\\left(${linLatex(finalCoeffX, finalConst)}\\right)`) + '</div>';
    html += '</div>';

    html += '<div class="result-highlight"><div class="final">';
    html += K(`\\boxed{f'(x) = (${linLatex(finalCoeffX, finalConst)})\\,${expPart}}`);
    html += '</div></div>';
    return html;
}

function solveDeriveQuotientExp() {
    const { a, b, c } = ExpState.exercise;
    let html = '';

    html += '<div class="step">';
    html += '<div class="step-number">Rappel de cours</div>';
    html += '<div class="step-explanation">';
    html += K("\\left(\\frac{u}{v}\\right)' = \\frac{u'v - uv'}{v^2}") + '<br>';
    html += 'Derivee d\'un quotient.';
    html += '</div></div>';

    const poly = linLatex(a, b);
    const expPart = c === 1 ? 'e^{x}' : (c === -1 ? 'e^{-x}' : `e^{${c}x}`);
    const expPartSq = c === 1 ? 'e^{2x}' : (c === -1 ? 'e^{-2x}' : `e^{${2 * c}x}`);

    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : Identifier u et v</div>';
    html += '<div class="step-expression">' + K(`u(x) = ${poly} \\implies u'(x) = ${a}`) + '</div>';
    html += '<div class="step-expression">' + K(`v(x) = ${expPart} \\implies v'(x) = ${c}\\,${expPart}`) + '</div>';
    html += '</div>';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 2 : Appliquer la formule du quotient</div>';
    html += '<div class="step-expression">' + K(`f'(x) = \\frac{${a}\\,${expPart} - (${poly}) \\cdot ${c}\\,${expPart}}{(${expPart})^2}`) + '</div>';
    html += '</div>';

    // Simplifier : numerateur = e^(cx) * [a - c(ax+b)] = e^(cx) * [-acx + (a-bc)]
    const finalCoeffX = -a * c;
    const finalConst = a - b * c;

    html += '<div class="step">';
    html += '<div class="step-number">Etape 3 : Simplifier</div>';
    html += '<div class="step-expression">' + K(`f'(x) = \\frac{${expPart}(${a} - ${c}(${poly}))}{${expPartSq}}`) + '</div>';
    html += '<div class="step-expression">' + K(`f'(x) = \\frac{${linLatex(finalCoeffX, finalConst)}}{${expPart}}`) + '</div>';
    html += '</div>';

    html += '<div class="result-highlight"><div class="final">';
    html += K(`\\boxed{f'(x) = \\frac{${linLatex(finalCoeffX, finalConst)}}{${expPart}}}`);
    html += '</div></div>';
    return html;
}

function solveDeriveeLnCompose() {
    const { a, b } = ExpState.exercise;
    let html = '';

    html += '<div class="step">';
    html += '<div class="step-number">Rappel de cours</div>';
    html += '<div class="step-explanation">';
    html += 'Si ' + K('f(x) = \\ln(u(x))') + ', alors ' + K("f'(x) = \\frac{u'(x)}{u(x)}") + '<br>';
    html += '(Derivee d\'une composee avec le logarithme)';
    html += '</div></div>';

    const inner = linLatex(a, b);
    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : Identifier u(x)</div>';
    html += '<div class="step-expression">' + K(`f(x) = \\ln(${inner})`) + '</div>';
    html += '<div class="step-expression">' + K(`u(x) = ${inner} \\implies u'(x) = ${a}`) + '</div>';
    html += '</div>';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 2 : Appliquer la formule</div>';
    html += '<div class="step-expression">' + K(`f'(x) = \\frac{${a}}{${inner}}`) + '</div>';
    html += '</div>';

    html += '<div class="result-highlight"><div class="final">';
    html += K(`\\boxed{f'(x) = \\frac{${a}}{${inner}}}`);
    html += '</div></div>';
    return html;
}

function solveDeriveeProduitLn() {
    const { a } = ExpState.exercise;
    let html = '';

    html += '<div class="step">';
    html += '<div class="step-number">Rappel de cours</div>';
    html += '<div class="step-explanation">';
    html += K("(uv)' = u'v + uv'") + ' et ' + K("(\\ln(x))' = \\frac{1}{x}");
    html += '</div></div>';

    const coefStr = a === 1 ? '' : (a === -1 ? '-' : a);
    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : Identifier u et v</div>';
    html += '<div class="step-expression">' + K(`u(x) = ${coefStr}x \\implies u'(x) = ${a}`) + '</div>';
    html += '<div class="step-expression">' + K(`v(x) = \\ln(x) \\implies v'(x) = \\frac{1}{x}`) + '</div>';
    html += '</div>';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 2 : Appliquer (uv)\' = u\'v + uv\'</div>';
    html += '<div class="step-expression">' + K(`f'(x) = ${a}\\,\\ln(x) + ${coefStr}x \\cdot \\frac{1}{x}`) + '</div>';
    html += '<div class="step-expression">' + K(`f'(x) = ${a}\\,\\ln(x) + ${a}`) + '</div>';
    html += '</div>';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 3 : Factoriser</div>';
    html += '<div class="step-expression">' + K(`f'(x) = ${a}(\\ln(x) + 1)`) + '</div>';
    html += '</div>';

    html += '<div class="result-highlight"><div class="final">';
    html += K(`\\boxed{f'(x) = ${a}(\\ln(x) + 1)}`);
    html += '</div></div>';
    return html;
}

function solveDeriveQuotientLn() {
    const { a, b, numIsLn } = ExpState.exercise;
    let html = '';

    html += '<div class="step">';
    html += '<div class="step-number">Rappel de cours</div>';
    html += '<div class="step-explanation">';
    html += K("\\left(\\frac{u}{v}\\right)' = \\frac{u'v - uv'}{v^2}");
    html += '</div></div>';

    if (numIsLn) {
        // f(x) = ln(x) / (ax+b)
        const den = linLatex(a, b);
        html += '<div class="step">';
        html += '<div class="step-number">Etape 1 : Identifier u et v</div>';
        html += '<div class="step-expression">' + K(`u(x) = \\ln(x) \\implies u'(x) = \\frac{1}{x}`) + '</div>';
        html += '<div class="step-expression">' + K(`v(x) = ${den} \\implies v'(x) = ${a}`) + '</div>';
        html += '</div>';

        html += '<div class="step">';
        html += '<div class="step-number">Etape 2 : Appliquer la formule</div>';
        html += '<div class="step-expression">' + K(`f'(x) = \\frac{\\frac{1}{x}(${den}) - \\ln(x) \\cdot ${a}}{(${den})^2}`) + '</div>';
        html += '</div>';

        html += '<div class="step">';
        html += '<div class="step-number">Etape 3 : Simplifier</div>';
        html += '<div class="step-expression">' + K(`f'(x) = \\frac{\\frac{${den}}{x} - ${a}\\ln(x)}{(${den})^2}`) + '</div>';
        html += '<div class="step-expression">' + K(`f'(x) = \\frac{${den} - ${a}x\\ln(x)}{x(${den})^2}`) + '</div>';
        html += '</div>';

        html += '<div class="result-highlight"><div class="final">';
        html += K(`\\boxed{f'(x) = \\frac{${den} - ${a}x\\ln(x)}{x(${den})^2}}`);
        html += '</div></div>';
    } else {
        // f(x) = (ax+b) / ln(x)
        const num = linLatex(a, b);
        html += '<div class="step">';
        html += '<div class="step-number">Etape 1 : Identifier u et v</div>';
        html += '<div class="step-expression">' + K(`u(x) = ${num} \\implies u'(x) = ${a}`) + '</div>';
        html += '<div class="step-expression">' + K(`v(x) = \\ln(x) \\implies v'(x) = \\frac{1}{x}`) + '</div>';
        html += '</div>';

        html += '<div class="step">';
        html += '<div class="step-number">Etape 2 : Appliquer la formule</div>';
        html += '<div class="step-expression">' + K(`f'(x) = \\frac{${a}\\ln(x) - (${num}) \\cdot \\frac{1}{x}}{(\\ln(x))^2}`) + '</div>';
        html += '</div>';

        html += '<div class="step">';
        html += '<div class="step-number">Etape 3 : Simplifier</div>';
        html += '<div class="step-expression">' + K(`f'(x) = \\frac{${a}x\\ln(x) - (${num})}{x(\\ln(x))^2}`) + '</div>';
        html += '</div>';

        html += '<div class="result-highlight"><div class="final">';
        html += K(`\\boxed{f'(x) = \\frac{${a}x\\ln(x) - (${num})}{x(\\ln(x))^2}}`);
        html += '</div></div>';
    }
    return html;
}

// ----------------------------------------
// Resolution etude de fonction
// ----------------------------------------

function solveEtude() {
    const sub = ExpState.subtype_etude;
    if (sub === 'poly_exp') return solveEtudePolyExp();
    if (sub === 'x_ln') return solveEtudeXLn();
    return solveEtudeLnSurX();
}

function solveEtudePolyExp() {
    const { a, b, c } = ExpState.exercise;
    let html = '';
    const poly = linLatex(a, b);
    const expPart = c === -1 ? 'e^{-x}' : `e^{${c}x}`;

    // Etape 1 : domaine
    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : Domaine de definition</div>';
    html += '<div class="step-expression">' + K(`f(x) = (${poly})\\,${expPart}`) + '</div>';
    html += '<div class="step-explanation">L\'exponentielle est definie sur ' + K('\\mathbb{R}') + ', et ' + K(`${poly}`) + ' aussi.<br>Domaine : ' + K('D_f = \\mathbb{R}') + '</div>';
    html += '</div>';

    // Etape 2 : limites
    html += '<div class="step">';
    html += '<div class="step-number">Etape 2 : Limites aux bornes</div>';

    // Limite en +inf : si c > 0, le terme exp domine -> signe de a * +inf
    // si c < 0, e^(-x) -> 0 donc f -> 0
    if (c > 0) {
        html += '<div class="step-expression">' + K(`\\lim_{x \\to +\\infty} f(x) = ${a > 0 ? '+' : '-'}\\infty`) + '</div>';
        html += '<div class="step-explanation">Car ' + K(`${expPart} \\to +\\infty`) + ' et le polynome tend vers ' + K(`${a > 0 ? '+' : '-'}\\infty`) + '.</div>';
        html += '<div class="step-expression">' + K(`\\lim_{x \\to -\\infty} f(x) = 0`) + '</div>';
        html += '<div class="step-explanation">Car ' + K(`${expPart} \\to 0`) + ' (croissance comparee).</div>';
    } else {
        html += '<div class="step-expression">' + K(`\\lim_{x \\to +\\infty} f(x) = 0`) + '</div>';
        html += '<div class="step-explanation">Car ' + K(`${expPart} \\to 0`) + ' (croissance comparee : l\'exponentielle l\'emporte).</div>';
        html += '<div class="step-expression">' + K(`\\lim_{x \\to -\\infty} f(x) = ${a > 0 ? '-' : '+'}\\infty`) + '</div>';
        html += '<div class="step-explanation">Car ' + K(`${expPart} \\to +\\infty`) + ' quand ' + K('x \\to -\\infty') + '.</div>';
    }
    html += '</div>';

    // Etape 3 : derivee
    // f'(x) = a * e^(cx) + (ax+b) * c * e^(cx) = e^(cx)[a + c(ax+b)] = e^(cx)[acx + (a+bc)]
    const dCoeffX = a * c;
    const dConst = a + b * c;

    html += '<div class="step">';
    html += '<div class="step-number">Etape 3 : Derivee</div>';
    html += '<div class="step-explanation">On utilise la formule du produit ' + K("(uv)' = u'v + uv'") + ' :</div>';
    html += '<div class="step-expression">' + K(`f'(x) = ${a}\\,${expPart} + (${poly}) \\cdot ${c}\\,${expPart}`) + '</div>';
    html += '<div class="step-expression">' + K(`f'(x) = ${expPart}\\left(${linLatex(dCoeffX, dConst)}\\right)`) + '</div>';
    html += '</div>';

    // Etape 4 : signe de f'
    html += '<div class="step">';
    html += '<div class="step-number">Etape 4 : Signe de f\'(x)</div>';
    html += '<div class="step-explanation">' + K(expPart + ' > 0') + ' pour tout ' + K('x \\in \\mathbb{R}') + '.</div>';
    html += '<div class="step-explanation">Le signe de ' + K("f'(x)") + ' depend donc de ' + K(`${linLatex(dCoeffX, dConst)}`) + '.</div>';

    if (dCoeffX !== 0) {
        const x0 = -dConst / dCoeffX;
        html += '<div class="step-expression">' + K(`${linLatex(dCoeffX, dConst)} = 0 \\iff x = ${formatNumber(x0)}`) + '</div>';

        if (dCoeffX > 0) {
            html += '<div class="step-explanation">' + K("f'(x) < 0") + ' pour ' + K(`x < ${formatNumber(x0)}`) +
                ' et ' + K("f'(x) > 0") + ' pour ' + K(`x > ${formatNumber(x0)}`) + '.</div>';
        } else {
            html += '<div class="step-explanation">' + K("f'(x) > 0") + ' pour ' + K(`x < ${formatNumber(x0)}`) +
                ' et ' + K("f'(x) < 0") + ' pour ' + K(`x > ${formatNumber(x0)}`) + '.</div>';
        }

        // Valeur au point critique
        const fVal = (a * x0 + b) * Math.exp(c * x0);
        html += '</div>';

        // Etape 5 : Tableau de variations
        html += '<div class="step">';
        html += '<div class="step-number">Etape 5 : Extremum</div>';
        const nature = dCoeffX > 0 ? 'minimum' : 'maximum';
        html += '<div class="step-expression">' + K(`f(${formatNumber(x0)}) = (${a} \\times ${formatNumber(x0)} ${signStr(b)} ${absStr(b)})\\,${expPart.replace('x', `(${formatNumber(x0)})`)}`) + '</div>';
        html += '<div class="step-expression">' + K(`f(${formatNumber(x0)}) \\approx \\color{#38a169}{${formatNumber(fVal)}}`) + '</div>';
        html += '<div class="step-explanation">C\'est un <strong>' + nature + ' local</strong>.</div>';
    } else {
        if (dConst > 0) {
            html += '<div class="step-explanation">' + K("f'(x) > 0") + ' pour tout x : f est <strong>strictement croissante</strong>.</div>';
        } else {
            html += '<div class="step-explanation">' + K("f'(x) < 0") + ' pour tout x : f est <strong>strictement decroissante</strong>.</div>';
        }
    }
    html += '</div>';

    // Resume
    html += '<div class="result-highlight"><div class="final">';
    if (dCoeffX !== 0) {
        const x0 = -dConst / dCoeffX;
        const fVal = (a * x0 + b) * Math.exp(c * x0);
        const nature = dCoeffX > 0 ? 'minimum' : 'maximum';
        html += K(`f'(x) = (${linLatex(dCoeffX, dConst)})\\,${expPart}`) + '<br>';
        html += `${nature.charAt(0).toUpperCase() + nature.slice(1)} en ` + K(`x = ${formatNumber(x0)}`) +
            ' : ' + K(`f(${formatNumber(x0)}) \\approx ${formatNumber(fVal)}`);
    } else {
        html += K(`f'(x) = ${dConst}\\,${expPart}`) + '<br>';
        html += 'Fonction <strong>' + (dConst > 0 ? 'croissante' : 'decroissante') + '</strong> sur ' + K('\\mathbb{R}');
    }
    html += '</div></div>';
    return html;
}

function solveEtudeXLn() {
    const { a } = ExpState.exercise;
    let html = '';
    const coefStr = a === 1 ? '' : (a === -1 ? '-' : a);

    // Domaine
    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : Domaine de definition</div>';
    html += '<div class="step-expression">' + K(`f(x) = ${coefStr}x\\,\\ln(x)`) + '</div>';
    html += '<div class="step-explanation">' + K('\\ln(x)') + ' est defini pour ' + K('x > 0') + '.<br>Domaine : ' + K('D_f = ]0 ; +\\infty[') + '</div>';
    html += '</div>';

    // Limites
    html += '<div class="step">';
    html += '<div class="step-number">Etape 2 : Limites aux bornes</div>';
    html += '<div class="step-expression">' + K(`\\lim_{x \\to 0^+} x\\,\\ln(x) = 0`) + '</div>';
    html += '<div class="step-explanation">C\'est une forme indeterminee ' + K('0 \\times (-\\infty)') + ' mais par croissance comparee ' + K('x\\ln(x) \\to 0') + '.</div>';
    html += '<div class="step-expression">' + K(`\\lim_{x \\to +\\infty} ${coefStr}x\\,\\ln(x) = ${a > 0 ? '+' : '-'}\\infty`) + '</div>';
    html += '</div>';

    // Derivee
    // f(x) = ax ln(x), f'(x) = a(ln(x) + 1)
    html += '<div class="step">';
    html += '<div class="step-number">Etape 3 : Derivee</div>';
    html += '<div class="step-expression">' + K(`f'(x) = ${a}\\left(\\ln(x) + 1\\right)`) + '</div>';
    html += '</div>';

    // Signe de f'
    html += '<div class="step">';
    html += '<div class="step-number">Etape 4 : Signe de f\'(x)</div>';
    html += '<div class="step-expression">' + K(`f'(x) = 0 \\iff \\ln(x) + 1 = 0 \\iff \\ln(x) = -1 \\iff x = e^{-1} = \\frac{1}{e}`) + '</div>';

    const x0 = 1 / Math.E;
    if (a > 0) {
        html += '<div class="step-explanation">' + K("f'(x) < 0") + ' pour ' + K(`0 < x < \\frac{1}{e}`) +
            ' et ' + K("f'(x) > 0") + ' pour ' + K(`x > \\frac{1}{e}`) + '.</div>';
    } else {
        html += '<div class="step-explanation">' + K("f'(x) > 0") + ' pour ' + K(`0 < x < \\frac{1}{e}`) +
            ' et ' + K("f'(x) < 0") + ' pour ' + K(`x > \\frac{1}{e}`) + '.</div>';
    }
    html += '</div>';

    // Extremum
    const fVal = a * x0 * Math.log(x0); // a * (1/e) * (-1) = -a/e
    const nature = a > 0 ? 'minimum' : 'maximum';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 5 : Extremum</div>';
    html += '<div class="step-expression">' + K(`f\\left(\\frac{1}{e}\\right) = ${coefStr} \\cdot \\frac{1}{e} \\cdot \\ln\\left(\\frac{1}{e}\\right) = ${coefStr} \\cdot \\frac{1}{e} \\cdot (-1) = \\frac{${-a}}{e}`) + '</div>';
    html += '<div class="step-expression">' + K(`f\\left(\\frac{1}{e}\\right) = \\frac{${-a}}{e} \\approx ${formatNumber(fVal)}`) + '</div>';
    html += '<div class="step-explanation">C\'est un <strong>' + nature + ' local</strong>.</div>';
    html += '</div>';

    html += '<div class="result-highlight"><div class="final">';
    html += K(`f'(x) = ${a}(\\ln(x) + 1)`) + '<br>';
    html += `${nature.charAt(0).toUpperCase() + nature.slice(1)} en ` + K(`x = \\frac{1}{e}`) +
        ' : ' + K(`f\\left(\\frac{1}{e}\\right) = \\frac{${-a}}{e} \\approx ${formatNumber(fVal)}`);
    html += '</div></div>';
    return html;
}

function solveEtudeLnSurX() {
    let html = '';

    // Domaine
    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : Domaine de definition</div>';
    html += '<div class="step-expression">' + K(`f(x) = \\frac{\\ln(x)}{x}`) + '</div>';
    html += '<div class="step-explanation">' + K('\\ln(x)') + ' est defini pour ' + K('x > 0') + ' et ' + K('x \\neq 0') + '.<br>Domaine : ' + K('D_f = ]0 ; +\\infty[') + '</div>';
    html += '</div>';

    // Limites
    html += '<div class="step">';
    html += '<div class="step-number">Etape 2 : Limites aux bornes</div>';
    html += '<div class="step-expression">' + K(`\\lim_{x \\to 0^+} \\frac{\\ln(x)}{x} = -\\infty`) + '</div>';
    html += '<div class="step-explanation">Car ' + K('\\ln(x) \\to -\\infty') + ' et ' + K('x \\to 0^+') + '.</div>';
    html += '<div class="step-expression">' + K(`\\lim_{x \\to +\\infty} \\frac{\\ln(x)}{x} = 0`) + '</div>';
    html += '<div class="step-explanation">Par croissance comparee : ' + K('\\ln(x)') + ' croit moins vite que ' + K('x') + '.</div>';
    html += '</div>';

    // Derivee : f'(x) = (1/x * x - ln(x) * 1) / x² = (1 - ln(x)) / x²
    html += '<div class="step">';
    html += '<div class="step-number">Etape 3 : Derivee (quotient)</div>';
    html += '<div class="step-expression">' + K(`f'(x) = \\frac{\\frac{1}{x} \\cdot x - \\ln(x) \\cdot 1}{x^2} = \\frac{1 - \\ln(x)}{x^2}`) + '</div>';
    html += '</div>';

    // Signe
    html += '<div class="step">';
    html += '<div class="step-number">Etape 4 : Signe de f\'(x)</div>';
    html += '<div class="step-expression">' + K(`x^2 > 0`) + ' pour tout ' + K('x > 0') + '</div>';
    html += '<div class="step-expression">' + K(`f'(x) = 0 \\iff 1 - \\ln(x) = 0 \\iff \\ln(x) = 1 \\iff x = e`) + '</div>';
    html += '<div class="step-explanation">' + K("f'(x) > 0") + ' pour ' + K('0 < x < e') +
        ' et ' + K("f'(x) < 0") + ' pour ' + K('x > e') + '.</div>';
    html += '</div>';

    // Maximum
    const fE = 1 / Math.E;
    html += '<div class="step">';
    html += '<div class="step-number">Etape 5 : Maximum</div>';
    html += '<div class="step-expression">' + K(`f(e) = \\frac{\\ln(e)}{e} = \\frac{1}{e} \\approx ${formatNumber(fE)}`) + '</div>';
    html += '<div class="step-explanation">C\'est le <strong>maximum global</strong> de f sur ' + K(']0 ; +\\infty[') + '.</div>';
    html += '</div>';

    html += '<div class="result-highlight"><div class="final">';
    html += K(`f'(x) = \\frac{1 - \\ln(x)}{x^2}`) + '<br>';
    html += 'Maximum en ' + K('x = e') + ' : ' + K(`f(e) = \\frac{1}{e} \\approx ${formatNumber(fE)}`);
    html += '</div></div>';
    return html;
}

// ----------------------------------------
// Resolution croissance exponentielle
// ----------------------------------------

function solveCroissance() {
    const sub = ExpState.subtype_croissance;
    if (sub === 'population') return solveCroissancePopulation();
    if (sub === 'decroissance') return solveDecroissance();
    return solveTempsDouble();
}

function solveCroissancePopulation() {
    const { N0, taux, t } = ExpState.exercise;
    let html = '';
    const r = taux / 100;

    html += '<div class="step">';
    html += '<div class="step-number">Rappel de cours</div>';
    html += '<div class="step-explanation">';
    html += 'Croissance exponentielle continue : ' + K(`N(t) = N_0 \\cdot e^{rt}`) + '<br>';
    html += 'Ou ' + K('r') + ' est le taux de croissance et ' + K('t') + ' le temps.';
    html += '</div></div>';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : Identifier les donnees</div>';
    html += '<div class="step-expression">' + K(`N_0 = ${N0}`) + ' (population initiale)</div>';
    html += '<div class="step-expression">' + K(`r = ${taux}\\% = ${r}`) + ' (taux de croissance)</div>';
    html += '<div class="step-expression">' + K(`t = ${t}`) + ' ans</div>';
    html += '</div>';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 2 : Appliquer la formule</div>';
    html += '<div class="step-expression">' + K(`N(${t}) = ${N0} \\times e^{${r} \\times ${t}}`) + '</div>';
    html += '<div class="step-expression">' + K(`N(${t}) = ${N0} \\times e^{${formatNumber(r * t)}}`) + '</div>';
    const result = N0 * Math.exp(r * t);
    html += '<div class="step-expression">' + K(`N(${t}) = ${N0} \\times ${formatNumber(Math.exp(r * t))}`) + '</div>';
    html += '<div class="step-expression">' + K(`N(${t}) \\approx \\color{#38a169}{${Math.round(result)}}`) + ' individus</div>';
    html += '</div>';

    html += '<div class="result-highlight"><div class="final">';
    html += K(`\\boxed{N(${t}) \\approx ${Math.round(result)}}`) + ' individus';
    html += '</div></div>';
    return html;
}

function solveDecroissance() {
    const { N0, demiVie, t } = ExpState.exercise;
    let html = '';
    const lambda = Math.log(2) / demiVie;

    html += '<div class="step">';
    html += '<div class="step-number">Rappel de cours</div>';
    html += '<div class="step-explanation">';
    html += 'Decroissance radioactive : ' + K(`N(t) = N_0 \\cdot e^{-\\lambda t}`) + '<br>';
    html += 'La constante de decroissance est liee a la demi-vie par : ' + K(`\\lambda = \\frac{\\ln(2)}{t_{1/2}}`);
    html += '</div></div>';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : Calculer la constante de decroissance</div>';
    html += '<div class="step-expression">' + K(`\\lambda = \\frac{\\ln(2)}{${demiVie}} = \\frac{${formatNumber(Math.log(2))}}{${demiVie}} \\approx ${formatNumber(lambda)}`) + '</div>';
    html += '</div>';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 2 : Appliquer la formule</div>';
    html += '<div class="step-expression">' + K(`N(${t}) = ${N0} \\times e^{-${formatNumber(lambda)} \\times ${t}}`) + '</div>';
    html += '<div class="step-expression">' + K(`N(${t}) = ${N0} \\times e^{${formatNumber(-lambda * t)}}`) + '</div>';
    const result = N0 * Math.exp(-lambda * t);
    html += '<div class="step-expression">' + K(`N(${t}) \\approx \\color{#38a169}{${formatNumber(result)}}`) + ' g</div>';
    html += '</div>';

    html += '<div class="result-highlight"><div class="final">';
    html += K(`\\boxed{N(${t}) \\approx ${formatNumber(result)}}`) + ' g';
    html += '</div></div>';
    return html;
}

function solveTempsDouble() {
    const { N0, taux } = ExpState.exercise;
    let html = '';
    const r = taux / 100;

    html += '<div class="step">';
    html += '<div class="step-number">Rappel de cours</div>';
    html += '<div class="step-explanation">';
    html += 'On cherche ' + K('t') + ' tel que ' + K('N(t) = 2 N_0') + '.<br>';
    html += K('N_0 \\cdot e^{rt} = 2 N_0 \\implies e^{rt} = 2 \\implies rt = \\ln(2)');
    html += '</div></div>';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : Poser l\'equation</div>';
    html += '<div class="step-expression">' + K(`${N0} \\cdot e^{${r}t} = 2 \\times ${N0}`) + '</div>';
    html += '<div class="step-expression">' + K(`e^{${r}t} = 2`) + '</div>';
    html += '</div>';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 2 : Appliquer ln</div>';
    html += '<div class="step-expression">' + K(`${r}t = \\ln(2)`) + '</div>';
    html += '<div class="step-expression">' + K(`t = \\frac{\\ln(2)}{${r}}`) + '</div>';
    const result = Math.log(2) / r;
    html += '<div class="step-expression">' + K(`t = \\frac{${formatNumber(Math.log(2))}}{${r}} \\approx \\color{#38a169}{${formatNumber(result)}}`) + ' ans</div>';
    html += '</div>';

    html += '<div class="result-highlight"><div class="final">';
    html += K(`\\boxed{t = \\frac{\\ln(2)}{${r}} \\approx ${formatNumber(result)}}`) + ' ans';
    html += '</div></div>';
    return html;
}

// ----------------------------------------
// Resolution logarithme decimal
// ----------------------------------------

function solveLogDecimal() {
    const sub = ExpState.subtype_log_decimal;
    if (sub === 'ph') return solvePH();
    if (sub === 'decibels') return solveDecibels();
    return solveMagnitude();
}

function solvePH() {
    const { coef, exposant } = ExpState.exercise;
    let html = '';

    html += '<div class="step">';
    html += '<div class="step-number">Rappel de cours</div>';
    html += '<div class="step-explanation">';
    html += K('\\text{pH} = -\\log_{10}([H^+])') + '<br>';
    html += 'Propriete : ' + K('\\log_{10}(a \\times 10^n) = \\log_{10}(a) + n');
    html += '</div></div>';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : Appliquer la formule</div>';
    html += '<div class="step-expression">' + K(`\\text{pH} = -\\log_{10}(${coef} \\times 10^{${exposant}})`) + '</div>';
    html += '</div>';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 2 : Developper le logarithme</div>';
    html += '<div class="step-expression">' + K(`\\text{pH} = -(\\log_{10}(${coef}) + ${exposant})`) + '</div>';
    const logCoef = Math.log10(coef);
    html += '<div class="step-expression">' + K(`\\text{pH} = -(${formatNumber(logCoef)} ${signStr(exposant)} ${absStr(exposant)})`) + '</div>';
    const totalLog = logCoef + exposant;
    html += '<div class="step-expression">' + K(`\\text{pH} = -(${formatNumber(totalLog)})`) + '</div>';
    const pH = -totalLog;
    html += '<div class="step-expression">' + K(`\\text{pH} \\approx \\color{#38a169}{${formatNumber(pH)}}`) + '</div>';
    html += '</div>';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 3 : Interpretation</div>';
    let interpretation = '';
    if (pH < 7) interpretation = 'La solution est <strong>acide</strong> (pH < 7).';
    else if (pH > 7) interpretation = 'La solution est <strong>basique</strong> (pH > 7).';
    else interpretation = 'La solution est <strong>neutre</strong> (pH = 7).';
    html += '<div class="step-explanation">' + interpretation + '</div>';
    html += '</div>';

    html += '<div class="result-highlight"><div class="final">';
    html += K(`\\boxed{\\text{pH} \\approx ${formatNumber(pH)}}`);
    html += '</div></div>';
    return html;
}

function solveDecibels() {
    const { coef, exposant } = ExpState.exercise;
    let html = '';

    html += '<div class="step">';
    html += '<div class="step-number">Rappel de cours</div>';
    html += '<div class="step-explanation">';
    html += K('L = 10 \\cdot \\log_{10}\\!\\left(\\frac{I}{I_0}\\right)') + ' avec ' + K('I_0 = 10^{-12}') + ' W/m²';
    html += '</div></div>';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : Calculer le rapport I/I₀</div>';
    html += '<div class="step-expression">' + K(`\\frac{I}{I_0} = \\frac{${coef} \\times 10^{${exposant}}}{10^{-12}} = ${coef} \\times 10^{${exposant - (-12)}}`) + '</div>';
    const rapportExp = exposant + 12;
    html += '<div class="step-expression">' + K(`= ${coef} \\times 10^{${rapportExp}}`) + '</div>';
    html += '</div>';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 2 : Appliquer le logarithme</div>';
    html += '<div class="step-expression">' + K(`\\log_{10}(${coef} \\times 10^{${rapportExp}}) = \\log_{10}(${coef}) + ${rapportExp}`) + '</div>';
    const logCoef = Math.log10(coef);
    const totalLog = logCoef + rapportExp;
    html += '<div class="step-expression">' + K(`= ${formatNumber(logCoef)} + ${rapportExp} = ${formatNumber(totalLog)}`) + '</div>';
    html += '</div>';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 3 : Calculer les decibels</div>';
    const dB = 10 * totalLog;
    html += '<div class="step-expression">' + K(`L = 10 \\times ${formatNumber(totalLog)} = \\color{#38a169}{${formatNumber(dB)}}`) + ' dB</div>';
    html += '</div>';

    html += '<div class="result-highlight"><div class="final">';
    html += K(`\\boxed{L \\approx ${formatNumber(dB)}}`) + ' dB';
    html += '</div></div>';
    return html;
}

function solveMagnitude() {
    const { coef, exposant } = ExpState.exercise;
    let html = '';

    html += '<div class="step">';
    html += '<div class="step-number">Rappel de cours</div>';
    html += '<div class="step-explanation">';
    html += 'Echelle de Richter : ' + K('M = \\frac{2}{3}\\log_{10}(E) - 3{,}2');
    html += '</div></div>';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : Calculer log₁₀(E)</div>';
    html += '<div class="step-expression">' + K(`\\log_{10}(${coef} \\times 10^{${exposant}}) = \\log_{10}(${coef}) + ${exposant}`) + '</div>';
    const logCoef = Math.log10(coef);
    const totalLog = logCoef + exposant;
    html += '<div class="step-expression">' + K(`= ${formatNumber(logCoef)} + ${exposant} = ${formatNumber(totalLog)}`) + '</div>';
    html += '</div>';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 2 : Appliquer la formule</div>';
    html += '<div class="step-expression">' + K(`M = \\frac{2}{3} \\times ${formatNumber(totalLog)} - 3{,}2`) + '</div>';
    const M = (2 / 3) * totalLog - 3.2;
    html += '<div class="step-expression">' + K(`M = ${formatNumber((2 / 3) * totalLog)} - 3{,}2`) + '</div>';
    html += '<div class="step-expression">' + K(`M \\approx \\color{#38a169}{${formatNumber(M)}}`) + '</div>';
    html += '</div>';

    html += '<div class="result-highlight"><div class="final">';
    html += K(`\\boxed{M \\approx ${formatNumber(M)}}`);
    html += '</div></div>';
    return html;
}

// ========================================
// Initialisation au chargement
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    initExponentiellesPage();
});
