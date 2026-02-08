/* ========================================
   LIMITES.JS - Calcul de limites de fonctions
   ======================================== */

/**
 * État du module Limites
 */
const LimitesState = {
    currentType: 'polynome_infini',

    // Paramètres polynôme en l'infini
    degre_poly: 2,
    vers_poly: '+inf',
    coeffs_poly: [3, -5, 2],

    // Paramètres rationnelle en l'infini
    type_rat: 'meme_degre',
    vers_rat: '+inf',
    num_coeffs: [2, 1],
    den_coeffs: [1, -3],

    // Paramètres limite en un point
    type_point: 'continue',
    x0_point: 2,
    func_point: { a: 1, b: -4, c: 3 },
    rat_point_num: [1, 0, -4],
    rat_point_den: [1, -2],

    // Paramètres forme indéterminée
    type_ind: '0/0',
    x0_ind: 2,
    fact_a: 1,
    fact_b: 3,

    // Paramètres racine
    type_racine: 'sqrt_infini',
    vers_racine: '+inf',
    sqrt_a: 1,
    sqrt_b: 2,
    sqrt_c: 1,
    diff_a: 5,

    // Paramètres asymptote
    type_asymptote: 'rationnelle',
    asymp_num: [2, 3],
    asymp_den: [1, -1]
};

/**
 * Initialise la page limites
 */
function initLimitesPage() {
    setupTypeButtons();
    setupInputHandlers();
    setupActionButtons();
    generateNewExercise();
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
            LimitesState.currentType = button.dataset.type;

            document.querySelectorAll('[id$="Section"]').forEach(section => {
                section.style.display = 'none';
            });

            const sectionMap = {
                'polynome_infini': 'polynomeInfiniSection',
                'rationnelle_infini': 'rationnelleInfiniSection',
                'point': 'pointSection',
                'indeterminee': 'indetermineeSection',
                'racine': 'racineSection',
                'asymptote': 'asymptoteSection'
            };
            const sectionId = sectionMap[LimitesState.currentType];
            if (sectionId) {
                $(sectionId).style.display = 'block';
            }

            generateNewExercise();
            updateExerciseDisplay();
            hideSolution('solutionDiv');
        });
    });
}

/**
 * Configure les gestionnaires d'événements
 */
function setupInputHandlers() {
    $('degre_poly').addEventListener('change', () => {
        LimitesState.degre_poly = parseInt($('degre_poly').value);
        generateNewExercise();
        updateExerciseDisplay();
    });

    $('vers_poly').addEventListener('change', () => {
        LimitesState.vers_poly = $('vers_poly').value;
        updateExerciseDisplay();
    });

    $('type_rat').addEventListener('change', () => {
        LimitesState.type_rat = $('type_rat').value;
        generateNewExercise();
        updateExerciseDisplay();
    });

    $('vers_rat').addEventListener('change', () => {
        LimitesState.vers_rat = $('vers_rat').value;
        updateExerciseDisplay();
    });

    $('type_point').addEventListener('change', () => {
        LimitesState.type_point = $('type_point').value;
        generateNewExercise();
        updateExerciseDisplay();
    });

    $('x0_point').addEventListener('input', () => {
        LimitesState.x0_point = parseInt($('x0_point').value) || 0;
        generateNewExercise();
        updateExerciseDisplay();
    });

    $('type_ind').addEventListener('change', () => {
        LimitesState.type_ind = $('type_ind').value;
        generateNewExercise();
        updateExerciseDisplay();
    });

    $('type_racine').addEventListener('change', () => {
        LimitesState.type_racine = $('type_racine').value;
        generateNewExercise();
        updateExerciseDisplay();
    });

    $('vers_racine').addEventListener('change', () => {
        LimitesState.vers_racine = $('vers_racine').value;
        updateExerciseDisplay();
    });

    $('type_asymptote').addEventListener('change', () => {
        LimitesState.type_asymptote = $('type_asymptote').value;
        generateNewExercise();
        updateExerciseDisplay();
    });
}

/**
 * Configure les boutons d'action
 */
function setupActionButtons() {
    $('newExerciseBtn').addEventListener('click', () => {
        generateNewExercise();
        updateExerciseDisplay();
        hideSolution('solutionDiv');
    });

    $('solveBtn').addEventListener('click', () => {
        solveLimites();
    });
}

/**
 * Met à jour l'affichage de l'exercice
 */
function updateExerciseDisplay() {
    let html = '';

    switch (LimitesState.currentType) {
        case 'polynome_infini':
            html = displayPolynomeInfini();
            break;
        case 'rationnelle_infini':
            html = displayRationnelleInfini();
            break;
        case 'point':
            html = displayPoint();
            break;
        case 'indeterminee':
            html = displayIndeterminee();
            break;
        case 'racine':
            html = displayRacine();
            break;
        case 'asymptote':
            html = displayAsymptote();
            break;
    }

    $('expressionDisplay').innerHTML = html;
}

/**
 * Affiche l'exercice polynôme en l'infini
 */
function displayPolynomeInfini() {
    const coeffs = LimitesState.coeffs_poly;
    const vers = LimitesState.vers_poly === '+inf' ? '+\\infty' : '-\\infty';
    const poly = toLatexPoly(coeffs);

    return katex.renderToString(`\\lim_{x \\to ${vers}} \\left(${poly}\\right)`, { throwOnError: false });
}

/**
 * Affiche l'exercice rationnelle en l'infini
 */
function displayRationnelleInfini() {
    const num = toLatexPoly(LimitesState.num_coeffs);
    const den = toLatexPoly(LimitesState.den_coeffs);
    const vers = LimitesState.vers_rat === '+inf' ? '+\\infty' : '-\\infty';

    return katex.renderToString(`\\lim_{x \\to ${vers}} \\frac{${num}}{${den}}`, { throwOnError: false });
}

/**
 * Affiche l'exercice limite en un point
 */
function displayPoint() {
    const x0 = LimitesState.x0_point;
    let func = '';

    if (LimitesState.type_point === 'continue') {
        const { a, b, c } = LimitesState.func_point;
        func = toLatexPoly([a, b, c]);
    } else {
        const num = toLatexPoly(LimitesState.rat_point_num);
        const den = toLatexPoly(LimitesState.rat_point_den);
        func = `\\frac{${num}}{${den}}`;
    }

    return katex.renderToString(`\\lim_{x \\to ${x0}} \\left(${func}\\right)`, { throwOnError: false });
}

/**
 * Affiche l'exercice forme indéterminée
 */
function displayIndeterminee() {
    if (LimitesState.type_ind === '0/0') {
        const a = LimitesState.fact_a;
        const b = LimitesState.fact_b;
        const x0 = a * b;
        const num = toLatexPoly([1, -(a + b), a * b]);
        const den = toLatexPoly([1, -x0]);

        return katex.renderToString(`\\lim_{x \\to ${x0}} \\frac{${num}}{${den}}`, { throwOnError: false });
    } else {
        const a = LimitesState.diff_a;
        const expr = `\\sqrt{x^2 + ${a}x} - x`;

        return katex.renderToString(`\\lim_{x \\to +\\infty} \\left(${expr}\\right)`, { throwOnError: false });
    }
}

/**
 * Affiche l'exercice avec racine
 */
function displayRacine() {
    const vers = LimitesState.vers_racine === '+inf' ? '+\\infty' : '-\\infty';

    if (LimitesState.type_racine === 'sqrt_infini') {
        const a = LimitesState.sqrt_a;
        const b = LimitesState.sqrt_b;
        const c = LimitesState.sqrt_c;
        const inside = toLatexPoly([a, b, c]);

        return katex.renderToString(`\\lim_{x \\to ${vers}} \\sqrt{${inside}}`, { throwOnError: false });
    } else if (LimitesState.type_racine === 'diff_sqrt') {
        const a = LimitesState.diff_a;

        return katex.renderToString(`\\lim_{x \\to +\\infty} \\left(\\sqrt{x + ${a}} - \\sqrt{x}\\right)`, { throwOnError: false });
    } else {
        const [a, b] = LimitesState.num_coeffs;
        const [c, d] = [LimitesState.sqrt_a, LimitesState.sqrt_b];
        const num = toLatexPoly([a, b]);
        const denInside = toLatexPoly([c, d, 0]);

        return katex.renderToString(`\\lim_{x \\to ${vers}} \\frac{${num}}{\\sqrt{${denInside}}}`, { throwOnError: false });
    }
}

/**
 * Affiche l'exercice asymptotes
 */
function displayAsymptote() {
    const num = toLatexPoly(LimitesState.asymp_num);
    const den = toLatexPoly(LimitesState.asymp_den);

    const title = 'Déterminer les asymptotes de : ';
    const func = katex.renderToString(`f(x) = \\frac{${num}}{${den}}`, { throwOnError: false });

    return title + func;
}

/**
 * Génère un nouvel exercice aléatoire
 */
function generateNewExercise() {
    switch (LimitesState.currentType) {
        case 'polynome_infini':
            generatePolynomeInfini();
            break;
        case 'rationnelle_infini':
            generateRationnelleInfini();
            break;
        case 'point':
            generatePoint();
            break;
        case 'indeterminee':
            generateIndeterminee();
            break;
        case 'racine':
            generateRacine();
            break;
        case 'asymptote':
            generateAsymptote();
            break;
    }
}

/**
 * Génère polynôme aléatoire
 */
function generatePolynomeInfini() {
    const degre = LimitesState.degre_poly;
    const coeffs = [];

    coeffs.push(randInt(-5, 5, [0])); // Coefficient dominant
    for (let i = 1; i <= degre; i++) {
        coeffs.push(randInt(-10, 10));
    }

    LimitesState.coeffs_poly = coeffs;
}

/**
 * Génère fonction rationnelle aléatoire
 */
function generateRationnelleInfini() {
    const type = LimitesState.type_rat;

    if (type === 'meme_degre') {
        LimitesState.num_coeffs = [randInt(-5, 5, [0]), randInt(-10, 10)];
        LimitesState.den_coeffs = [randInt(-5, 5, [0]), randInt(-10, 10)];
    } else if (type === 'num_sup') {
        LimitesState.num_coeffs = [randInt(-5, 5, [0]), randInt(-10, 10), randInt(-10, 10)];
        LimitesState.den_coeffs = [randInt(-5, 5, [0]), randInt(-10, 10)];
    } else {
        LimitesState.num_coeffs = [randInt(-5, 5, [0]), randInt(-10, 10)];
        LimitesState.den_coeffs = [randInt(-5, 5, [0]), randInt(-10, 10), randInt(-10, 10)];
    }
}

/**
 * Génère fonction pour limite en un point
 */
function generatePoint() {
    const x0 = LimitesState.x0_point;

    if (LimitesState.type_point === 'continue') {
        LimitesState.func_point = {
            a: randInt(-3, 3, [0]),
            b: randInt(-10, 10),
            c: randInt(-10, 10)
        };
    } else {
        // Forme (x-a)(x-b)/(x-c) avec a ≠ c, b ≠ c
        const a = randInt(-5, 5, [x0]);
        const b = randInt(-5, 5, [x0, a]);

        // Développer (x-a)(x-b) = x² - (a+b)x + ab
        LimitesState.rat_point_num = [1, -(a + b), a * b];
        LimitesState.rat_point_den = [1, -x0];
    }
}

/**
 * Génère forme indéterminée
 */
function generateIndeterminee() {
    if (LimitesState.type_ind === '0/0') {
        // Forme (x-a)(x-b)/(x-a) avec a, b différents
        const a = randInt(1, 5);
        const b = randInt(-5, 5, [a]);

        LimitesState.fact_a = a;
        LimitesState.fact_b = b;
    } else {
        LimitesState.diff_a = randInt(2, 10);
    }
}

/**
 * Génère exercice avec racine
 */
function generateRacine() {
    if (LimitesState.type_racine === 'sqrt_infini') {
        LimitesState.sqrt_a = randInt(1, 4);
        LimitesState.sqrt_b = randInt(-8, 8);
        LimitesState.sqrt_c = randInt(-8, 8);
    } else if (LimitesState.type_racine === 'diff_sqrt') {
        LimitesState.diff_a = randInt(1, 10);
    } else {
        LimitesState.num_coeffs = [randInt(-5, 5, [0]), randInt(-10, 10)];
        LimitesState.sqrt_a = randInt(1, 4);
        LimitesState.sqrt_b = randInt(-8, 8);
    }
}

/**
 * Génère fonction pour asymptotes
 */
function generateAsymptote() {
    LimitesState.asymp_num = [randInt(-5, 5, [0]), randInt(-10, 10)];
    LimitesState.asymp_den = [randInt(-5, 5, [0]), randInt(-10, 10, [0])];
}

/**
 * Résout l'exercice courant
 */
function solveLimites() {
    let html = '';

    switch (LimitesState.currentType) {
        case 'polynome_infini':
            html = solvePolynomeInfini();
            break;
        case 'rationnelle_infini':
            html = solveRationnelleInfini();
            break;
        case 'point':
            html = solvePoint();
            break;
        case 'indeterminee':
            html = solveIndeterminee();
            break;
        case 'racine':
            html = solveRacine();
            break;
        case 'asymptote':
            html = solveAsymptote();
            break;
    }

    $('stepsContainer').innerHTML = html;
    showSolution('solutionDiv');
}

/**
 * Résout polynôme en l'infini
 */
function solvePolynomeInfini() {
    const coeffs = LimitesState.coeffs_poly;
    const vers = LimitesState.vers_poly;
    const versSymbol = vers === '+inf' ? '+\\infty' : '-\\infty';
    const degre = coeffs.length - 1;
    const a = coeffs[0];

    let html = '';

    // Étape 1 : Rappel de la règle
    html += '<div class="step">';
    html += '<div class="step-number">📚 Rappel de cours</div>';
    html += '<div class="step-explanation">';
    html += 'Pour calculer la limite d\'un polynôme en l\'infini :<br>';
    html += '• On identifie le <strong>terme de plus haut degré</strong> (terme dominant)<br>';
    html += '• Les autres termes deviennent <strong>négligeables</strong> devant lui<br>';
    html += '• La limite du polynôme = limite du terme dominant';
    html += '</div>';
    html += '</div>';

    // Étape 2 : Identifier le terme dominant
    html += '<div class="step">';
    html += '<div class="step-number">Étape 1 : Identifier le terme dominant</div>';
    html += `<div class="step-explanation">Le polynôme est de degré ${degre}.</div>`;
    const termeDominant = katex.renderToString(`${a}x^{${degre}}`, { throwOnError: false });
    html += `<div class="step-expression">Terme dominant : ${termeDominant}</div>`;
    html += '</div>';

    // Étape 3 : Factoriser
    html += '<div class="step">';
    html += '<div class="step-number">Étape 2 : Factoriser par le terme dominant</div>';

    let factorTerms = [];
    for (let i = 1; i <= degre; i++) {
        const coeff = coeffs[i];
        if (coeff !== 0) {
            const sign = coeff > 0 ? '+' : '-';
            const absCoeff = Math.abs(coeff);
            factorTerms.push(`${sign} \\frac{${absCoeff}}{x^{${i}}}`);
        }
    }
    const factorStr = factorTerms.length > 0 ? factorTerms.join(' ') : '';

    const factored = katex.renderToString(
        `${toLatexPoly(coeffs)} = x^{${degre}}\\left(${a} ${factorStr}\\right)`,
        { throwOnError: false }
    );
    html += `<div class="step-expression">${factored}</div>`;
    html += '</div>';

    // Étape 4 : Limite des termes en 1/x
    html += '<div class="step">';
    html += '<div class="step-number">Étape 3 : Limite des termes en 1/x</div>';
    html += `<div class="step-explanation">Quand x → ${versSymbol === '+\\infty' ? '+∞' : '-∞'} :</div>`;
    html += '<div class="step-expression">';
    for (let i = 1; i <= Math.min(degre, 3); i++) {
        const termLim = katex.renderToString(`\\frac{1}{x^{${i}}} \\to 0`, { throwOnError: false });
        html += `${termLim}<br>`;
    }
    html += '</div>';
    html += '<div class="step-explanation">Donc tous les termes entre parenthèses tendent vers 0, sauf le coefficient dominant.</div>';
    html += '</div>';

    // Étape 5 : Comportement de x^n
    html += '<div class="step">';
    html += '<div class="step-number">Étape 4 : Comportement de x<sup>' + degre + '</sup></div>';

    let comportement = '';
    if (degre % 2 === 0) {
        comportement = `Degré pair (${degre}) : x<sup>${degre}</sup> → +∞ que x tende vers +∞ ou -∞`;
    } else {
        if (vers === '+inf') {
            comportement = `Degré impair (${degre}) : quand x → +∞, x<sup>${degre}</sup> → +∞`;
        } else {
            comportement = `Degré impair (${degre}) : quand x → -∞, x<sup>${degre}</sup> → -∞`;
        }
    }
    html += `<div class="step-explanation">${comportement}</div>`;
    html += '</div>';

    // Étape 6 : Conclusion
    html += '<div class="step">';
    html += '<div class="step-number">Étape 5 : Conclusion</div>';

    let limite = '';
    let explication = '';
    if (degre % 2 === 0) {
        if (a > 0) {
            limite = '+\\infty';
            explication = `${a} > 0 et x<sup>${degre}</sup> → +∞, donc ${a} × (+∞) = +∞`;
        } else {
            limite = '-\\infty';
            explication = `${a} < 0 et x<sup>${degre}</sup> → +∞, donc ${a} × (+∞) = -∞`;
        }
    } else {
        if (vers === '+inf') {
            if (a > 0) {
                limite = '+\\infty';
                explication = `${a} > 0 et x<sup>${degre}</sup> → +∞, donc ${a} × (+∞) = +∞`;
            } else {
                limite = '-\\infty';
                explication = `${a} < 0 et x<sup>${degre}</sup> → +∞, donc ${a} × (+∞) = -∞`;
            }
        } else {
            if (a > 0) {
                limite = '-\\infty';
                explication = `${a} > 0 et x<sup>${degre}</sup> → -∞, donc ${a} × (-∞) = -∞`;
            } else {
                limite = '+\\infty';
                explication = `${a} < 0 et x<sup>${degre}</sup> → -∞, donc ${a} × (-∞) = +∞`;
            }
        }
    }

    html += `<div class="step-explanation">${explication}</div>`;
    const limExpr = katex.renderToString(`\\lim_{x \\to ${versSymbol}} ${toLatexPoly(coeffs)} = ${limite}`, { throwOnError: false });
    html += `<div class="step-expression">${limExpr}</div>`;
    html += '</div>';

    html += '<div class="result-highlight">';
    html += `<div class="final">Réponse : ${katex.renderToString(limite, { throwOnError: false })}</div>`;
    html += '</div>';

    return html;
}

/**
 * Résout rationnelle en l'infini
 */
function solveRationnelleInfini() {
    const num = LimitesState.num_coeffs;
    const den = LimitesState.den_coeffs;
    const vers = LimitesState.vers_rat === '+inf' ? '+\\infty' : '-\\infty';

    const degNum = num.length - 1;
    const degDen = den.length - 1;

    let html = '';

    // Étape 0 : Rappel
    html += '<div class="step">';
    html += '<div class="step-number">📚 Rappel de cours</div>';
    html += '<div class="step-explanation">';
    html += 'Pour une limite de fonction rationnelle en l\'infini :<br>';
    html += '• On compare les <strong>degrés</strong> du numérateur et dénominateur<br>';
    html += '• On factorise par les <strong>termes de plus haut degré</strong><br>';
    html += '• Si même degré : limite = rapport des coefficients dominants<br>';
    html += '• Si degré numérateur > dénominateur : limite = ±∞<br>';
    html += '• Si degré dénominateur > numérateur : limite = 0';
    html += '</div>';
    html += '</div>';

    // Étape 1 : Comparer les degrés
    html += '<div class="step">';
    html += '<div class="step-number">Étape 1 : Comparer les degrés</div>';
    const numPoly = katex.renderToString(toLatexPoly(num), { throwOnError: false });
    const denPoly = katex.renderToString(toLatexPoly(den), { throwOnError: false });
    html += `<div class="step-explanation">`;
    html += `Numérateur : ${numPoly} → degré ${degNum}<br>`;
    html += `Dénominateur : ${denPoly} → degré ${degDen}`;
    html += `</div>`;
    html += '</div>';

    // Étape 2 : Factoriser
    html += '<div class="step">';
    html += '<div class="step-number">Étape 2 : Factoriser par les termes de plus haut degré</div>';

    // Construire la factorisation du numérateur
    let numFactorTerms = [`${num[0]}`];
    for (let i = 1; i <= degNum; i++) {
        const coeff = num[i];
        if (coeff !== 0) {
            const sign = coeff > 0 ? '+' : '-';
            const absCoeff = Math.abs(coeff);
            numFactorTerms.push(`${sign} \\frac{${absCoeff}}{x^{${i}}}`);
        }
    }

    // Construire la factorisation du dénominateur
    let denFactorTerms = [`${den[0]}`];
    for (let i = 1; i <= degDen; i++) {
        const coeff = den[i];
        if (coeff !== 0) {
            const sign = coeff > 0 ? '+' : '-';
            const absCoeff = Math.abs(coeff);
            denFactorTerms.push(`${sign} \\frac{${absCoeff}}{x^{${i}}}`);
        }
    }

    const factExpr = katex.renderToString(
        `\\frac{${toLatexPoly(num)}}{${toLatexPoly(den)}} = \\frac{x^{${degNum}}\\left(${numFactorTerms.join(' ')}\\right)}{x^{${degDen}}\\left(${denFactorTerms.join(' ')}\\right)}`,
        { throwOnError: false }
    );
    html += `<div class="step-expression">${factExpr}</div>`;
    html += '</div>';

    // Étape 3 : Simplifier
    html += '<div class="step">';
    html += '<div class="step-number">Étape 3 : Simplifier</div>';

    if (degNum === degDen) {
        const simplified = katex.renderToString(
            `= \\frac{${num[0]} + \\frac{\\text{termes} \\to 0}{x}}{${den[0]} + \\frac{\\text{termes} \\to 0}{x}}`,
            { throwOnError: false }
        );
        html += `<div class="step-expression">${simplified}</div>`;
        html += `<div class="step-explanation">On simplifie par x<sup>${degNum}</sup> (même degré).</div>`;
    } else if (degNum > degDen) {
        const diff = degNum - degDen;
        const simplified = katex.renderToString(
            `= x^{${diff}} \\times \\frac{${num[0]} + \\frac{\\text{termes} \\to 0}{x}}{${den[0]} + \\frac{\\text{termes} \\to 0}{x}}`,
            { throwOnError: false }
        );
        html += `<div class="step-expression">${simplified}</div>`;
        html += `<div class="step-explanation">Après simplification, il reste x<sup>${diff}</sup> au numérateur.</div>`;
    } else {
        const diff = degDen - degNum;
        const simplified = katex.renderToString(
            `= \\frac{1}{x^{${diff}}} \\times \\frac{${num[0]} + \\frac{\\text{termes} \\to 0}{x}}{${den[0]} + \\frac{\\text{termes} \\to 0}{x}}`,
            { throwOnError: false }
        );
        html += `<div class="step-expression">${simplified}</div>`;
        html += `<div class="step-explanation">Après simplification, il reste 1/x<sup>${diff}</sup>.</div>`;
    }
    html += '</div>';

    // Étape 4 : Limite des termes en 1/x
    html += '<div class="step">';
    html += '<div class="step-number">Étape 4 : Limite des termes en 1/x</div>';
    html += `<div class="step-explanation">Quand x → ${vers === '+\\infty' ? '+∞' : '-∞'}, tous les termes avec x au dénominateur tendent vers 0.</div>`;
    const limTerms = katex.renderToString(`\\frac{1}{x}, \\frac{1}{x^2}, \\frac{1}{x^3}, ... \\to 0`, { throwOnError: false });
    html += `<div class="step-expression">${limTerms}</div>`;
    html += '</div>';

    // Étape 5 : Conclusion
    html += '<div class="step">';
    html += '<div class="step-number">Étape 5 : Conclusion</div>';

    let limite = '';
    let limiteLatex = '';
    let explication = '';

    if (degNum === degDen) {
        const ratio = num[0] / den[0];
        limite = formatNumber(ratio);
        limiteLatex = limite;
        const fracRatio = katex.renderToString(`\\frac{${num[0]}}{${den[0]}} = ${limite}`, { throwOnError: false });
        explication = `Les termes tendent vers 0, il reste : ${fracRatio}`;
    } else if (degNum > degDen) {
        const diff = degNum - degDen;
        const sign = (num[0] / den[0]) > 0 ? '+' : '-';
        limite = `${sign}∞`;
        limiteLatex = `${sign}\\infty`;

        const xPower = katex.renderToString(`x^{${diff}}`, { throwOnError: false });
        const fracCoeffs = katex.renderToString(`\\frac{${num[0]}}{${den[0]}}`, { throwOnError: false });

        if (sign === '+') {
            explication = `${xPower} → +∞ et ${fracCoeffs} > 0, donc la limite est +∞`;
        } else {
            explication = `${xPower} → +∞ et ${fracCoeffs} < 0, donc la limite est -∞`;
        }
    } else {
        const diff = degDen - degNum;
        limite = '0';
        limiteLatex = '0';

        const invXPower = katex.renderToString(`\\frac{1}{x^{${diff}}}`, { throwOnError: false });
        explication = `${invXPower} → 0 quand x → ${vers === '+\\infty' ? '+∞' : '-∞'}`;
    }

    html += `<div class="step-explanation">${explication}</div>`;
    const limExpr = katex.renderToString(
        `\\lim_{x \\to ${vers}} \\frac{${toLatexPoly(num)}}{${toLatexPoly(den)}} = ${limiteLatex}`,
        { throwOnError: false }
    );
    html += `<div class="step-expression">${limExpr}</div>`;
    html += '</div>';

    html += '<div class="result-highlight">';
    html += `<div class="final">Réponse : ${limite}</div>`;
    html += '</div>';

    return html;
}

/**
 * Résout limite en un point
 */
function solvePoint() {
    const x0 = LimitesState.x0_point;
    let html = '';

    if (LimitesState.type_point === 'continue') {
        const { a, b, c } = LimitesState.func_point;

        html += '<div class="step">';
        html += '<div class="step-number">Étape 1 : Vérifier la continuité</div>';
        html += `<div class="step-explanation">La fonction polynomiale est continue sur ℝ.</div>`;
        html += '</div>';

        html += '<div class="step">';
        html += '<div class="step-number">Étape 2 : Calculer par substitution</div>';
        const result = a * x0 * x0 + b * x0 + c;

        const calcExpr = katex.renderToString(
            `f(${x0}) = ${formatCoeff(a)} \\cdot ${x0}^2 ${formatTerm(b, x0, 1)} ${formatConstant(c)} = ${result}`,
            { throwOnError: false }
        );
        html += `<div class="step-expression">${calcExpr}</div>`;
        html += '</div>';

        html += '<div class="result-highlight">';
        html += `<div class="final">Réponse : ${result}</div>`;
        html += '</div>';
    } else {
        // Fonction rationnelle
        const num = LimitesState.rat_point_num;
        const den = LimitesState.rat_point_den;

        const numVal = num[0] * x0 * x0 + num[1] * x0 + num[2];
        const denVal = den[0] * x0 + den[1];

        html += '<div class="step">';
        html += '<div class="step-number">Étape 1 : Vérifier si le dénominateur s\'annule</div>';
        html += `<div class="step-explanation">Dénominateur en x = ${x0} : ${denVal}</div>`;
        html += '</div>';

        if (denVal !== 0) {
            html += '<div class="step">';
            html += '<div class="step-number">Étape 2 : Calculer par substitution</div>';
            const result = numVal / denVal;
            html += `<div class="step-expression">Numérateur : ${numVal}<br>Dénominateur : ${denVal}<br>Limite : ${formatNumber(result)}</div>`;
            html += '</div>';

            html += '<div class="result-highlight">';
            html += `<div class="final">Réponse : ${formatNumber(result)}</div>`;
            html += '</div>';
        } else {
            html += '<div class="step">';
            html += '<div class="step-number">Étape 2 : Limite infinie</div>';
            html += `<div class="step-explanation">Le dénominateur s'annule mais pas le numérateur (${numVal}). La limite est infinie.</div>`;
            html += '</div>';

            html += '<div class="result-highlight">';
            const signe = numVal > 0 ? '+' : '-';
            html += `<div class="final">Réponse : ${signe}∞</div>`;
            html += '</div>';
        }
    }

    return html;
}

/**
 * Résout forme indéterminée
 */
function solveIndeterminee() {
    let html = '';

    if (LimitesState.type_ind === '0/0') {
        const a = LimitesState.fact_a;
        const b = LimitesState.fact_b;
        const x0 = a * b;

        // Rappel
        html += '<div class="step">';
        html += '<div class="step-number">📚 Rappel de cours - Forme indéterminée 0/0</div>';
        html += '<div class="step-explanation">';
        html += 'Quand on obtient 0/0 par substitution directe :<br>';
        html += '• C\'est une <strong>forme indéterminée</strong><br>';
        html += '• On ne peut PAS conclure directement<br>';
        html += '• Il faut <strong>lever l\'indétermination</strong> en factorisant<br>';
        html += '• Le facteur commun qui s\'annule doit apparaître au numérateur ET au dénominateur';
        html += '</div>';
        html += '</div>';

        // Étape 1 : Vérifier la forme indéterminée
        html += '<div class="step">';
        html += '<div class="step-number">Étape 1 : Vérifier la forme indéterminée</div>';

        const numPoly = [1, -(a + b), a * b];
        const numVal = numPoly[0] * x0 * x0 + numPoly[1] * x0 + numPoly[2];
        const denVal = x0 - x0;

        html += `<div class="step-explanation">Substitution directe pour x = ${x0} :</div>`;
        const numLatex = katex.renderToString(toLatexPoly(numPoly), { throwOnError: false });
        html += `<div class="step-expression">Numérateur : ${numLatex} = ${numVal}</div>`;
        html += `<div class="step-expression">Dénominateur : x - ${x0} = ${denVal}</div>`;
        html += `<div class="step-explanation">On obtient bien la forme <strong>0/0</strong>. Il faut factoriser.</div>`;
        html += '</div>';

        // Étape 2 : Factoriser le numérateur
        html += '<div class="step">';
        html += '<div class="step-number">Étape 2 : Factoriser le numérateur</div>';

        html += '<div class="step-explanation">';
        html += 'On cherche les racines du numérateur (valeurs qui l\'annulent) :<br>';
        html += `• (x - ${a}) s\'annule en x = ${a}<br>`;
        html += `• (x - ${b}) s\'annule en x = ${b}<br>`;
        html += `Comme le numérateur s\'annule en x = ${x0}, il doit contenir le facteur (x - ${x0})`;
        html += '</div>';

        const numFactorization = katex.renderToString(
            `${toLatexPoly(numPoly)} = (x - ${a})(x - ${b})`,
            { throwOnError: false }
        );
        html += `<div class="step-expression">${numFactorization}</div>`;
        html += '</div>';

        // Étape 3 : Écrire la fraction factorisée
        html += '<div class="step">';
        html += '<div class="step-number">Étape 3 : Écrire la fraction factorisée</div>';

        const fracFactored = katex.renderToString(
            `\\frac{${toLatexPoly(numPoly)}}{x - ${x0}} = \\frac{(x - ${a})(x - ${b})}{x - ${x0}}`,
            { throwOnError: false }
        );
        html += `<div class="step-expression">${fracFactored}</div>`;
        html += '</div>';

        // Étape 4 : Simplifier
        html += '<div class="step">';
        html += '<div class="step-number">Étape 4 : Simplifier par le facteur commun</div>';

        let simplified, result;
        if (a === x0) {
            html += `<div class="step-explanation">Le facteur commun est (x - ${a}). On peut simplifier car on calcule la limite quand x <strong>tend vers</strong> ${x0}, donc x ≠ ${x0}.</div>`;
            simplified = katex.renderToString(`\\frac{(x - ${a})(x - ${b})}{x - ${x0}} = x - ${b}`, { throwOnError: false });
            result = x0 - b;
        } else {
            html += `<div class="step-explanation">Le facteur commun est (x - ${b}). On peut simplifier car on calcule la limite quand x <strong>tend vers</strong> ${x0}, donc x ≠ ${x0}.</div>`;
            simplified = katex.renderToString(`\\frac{(x - ${a})(x - ${b})}{x - ${x0}} = x - ${a}`, { throwOnError: false });
            result = x0 - a;
        }
        html += `<div class="step-expression">${simplified}</div>`;
        html += '</div>';

        // Étape 5 : Calculer la limite
        html += '<div class="step">';
        html += '<div class="step-number">Étape 5 : Calculer la limite par substitution</div>';

        html += '<div class="step-explanation">Après simplification, la fonction devient continue en x = ' + x0 + '. On peut substituer directement :</div>';

        const limExpr = a === x0
            ? katex.renderToString(`\\lim_{x \\to ${x0}} (x - ${b}) = ${x0} - ${b} = ${result}`, { throwOnError: false })
            : katex.renderToString(`\\lim_{x \\to ${x0}} (x - ${a}) = ${x0} - ${a} = ${result}`, { throwOnError: false });
        html += `<div class="step-expression">${limExpr}</div>`;
        html += '</div>';

        html += '<div class="result-highlight">';
        html += `<div class="final">Réponse : ${result}</div>`;
        html += '</div>';
    } else {
        // Forme ∞ - ∞ avec racines
        const a = LimitesState.diff_a;

        // Rappel
        html += '<div class="step">';
        html += '<div class="step-number">📚 Rappel de cours - Forme indéterminée ∞ - ∞</div>';
        html += '<div class="step-explanation">';
        html += 'Quand on obtient ∞ - ∞ :<br>';
        html += '• C\'est une <strong>forme indéterminée</strong><br>';
        html += '• On ne peut PAS conclure (∞ - ∞ peut donner n\'importe quoi)<br>';
        html += '• Avec des racines carrées, on utilise la <strong>quantité conjuguée</strong><br>';
        html += '• Astuce : (a - b)(a + b) = a² - b²';
        html += '</div>';
        html += '</div>';

        // Étape 1 : Identifier la forme
        html += '<div class="step">';
        html += '<div class="step-number">Étape 1 : Identifier la forme indéterminée</div>';

        const sqrt1 = katex.renderToString(`\\sqrt{x^2 + ${a}x}`, { throwOnError: false });
        html += `<div class="step-explanation">Quand x → +∞ :</div>`;
        html += `<div class="step-expression">${sqrt1} \\sim \\sqrt{x^2} = |x| = x → +∞</div>`;
        html += `<div class="step-expression">x → +∞</div>`;
        html += `<div class="step-explanation">Donc on a bien la forme ∞ - ∞</div>`;
        html += '</div>';

        // Étape 2 : Multiplier par la quantité conjuguée
        html += '<div class="step">';
        html += '<div class="step-number">Étape 2 : Multiplier par la quantité conjuguée</div>';

        html += '<div class="step-explanation">';
        html += 'On multiplie et divise par la quantité conjuguée :<br>';
        const conjugeeFormule = katex.renderToString(`(\\sqrt{x^2 + ${a}x} + x)`, { throwOnError: false });
        html += `Quantité conjuguée : ${conjugeeFormule}`;
        html += '</div>';

        const conjugate = katex.renderToString(
            `\\frac{\\sqrt{x^2 + ${a}x} - x}{1} \\times \\frac{\\sqrt{x^2 + ${a}x} + x}{\\sqrt{x^2 + ${a}x} + x}`,
            { throwOnError: false }
        );
        html += `<div class="step-expression">${conjugate}</div>`;
        html += '</div>';

        // Étape 3 : Développer le numérateur
        html += '<div class="step">';
        html += '<div class="step-number">Étape 3 : Développer avec a² - b²</div>';

        html += '<div class="step-explanation">';
        html += 'On utilise l\'identité remarquable (a - b)(a + b) = a² - b² :';
        html += '</div>';

        const developed = katex.renderToString(
            `= \\frac{(\\sqrt{x^2 + ${a}x})^2 - x^2}{\\sqrt{x^2 + ${a}x} + x} = \\frac{x^2 + ${a}x - x^2}{\\sqrt{x^2 + ${a}x} + x}`,
            { throwOnError: false }
        );
        html += `<div class="step-expression">${developed}</div>`;

        const simplified = katex.renderToString(
            `= \\frac{${a}x}{\\sqrt{x^2 + ${a}x} + x}`,
            { throwOnError: false }
        );
        html += `<div class="step-expression">${simplified}</div>`;
        html += '</div>';

        // Étape 4 : Factoriser par x
        html += '<div class="step">';
        html += '<div class="step-number">Étape 4 : Factoriser par x (terme dominant)</div>';

        html += '<div class="step-explanation">';
        html += 'Au numérateur : on factorise par x<br>';
        html += 'Au dénominateur : on factorise par x sous la racine et hors de la racine';
        html += '</div>';

        const factorSqrt = katex.renderToString(
            `\\sqrt{x^2 + ${a}x} = \\sqrt{x^2\\left(1 + \\frac{${a}}{x}\\right)} = |x|\\sqrt{1 + \\frac{${a}}{x}} = x\\sqrt{1 + \\frac{${a}}{x}}`,
            { throwOnError: false }
        );
        html += `<div class="step-expression">${factorSqrt}</div>`;

        const factored = katex.renderToString(
            `= \\frac{${a}x}{x\\sqrt{1 + \\frac{${a}}{x}} + x} = \\frac{${a}x}{x\\left(\\sqrt{1 + \\frac{${a}}{x}} + 1\\right)} = \\frac{${a}}{\\sqrt{1 + \\frac{${a}}{x}} + 1}`,
            { throwOnError: false }
        );
        html += `<div class="step-expression">${factored}</div>`;
        html += '</div>';

        // Étape 5 : Calculer la limite
        html += '<div class="step">';
        html += '<div class="step-number">Étape 5 : Calculer la limite</div>';

        html += `<div class="step-explanation">Quand x → +∞ :</div>`;
        const limFrac = katex.renderToString(`\\frac{${a}}{x} \\to 0`, { throwOnError: false });
        html += `<div class="step-expression">${limFrac}</div>`;

        const result = a / 2;
        const limExpr = katex.renderToString(
            `\\lim_{x \\to +\\infty} \\frac{${a}}{\\sqrt{1 + \\frac{${a}}{x}} + 1} = \\frac{${a}}{\\sqrt{1 + 0} + 1} = \\frac{${a}}{\\sqrt{1} + 1} = \\frac{${a}}{2} = ${formatNumber(result)}`,
            { throwOnError: false }
        );
        html += `<div class="step-expression">${limExpr}</div>`;
        html += '</div>';

        html += '<div class="result-highlight">';
        html += `<div class="final">Réponse : ${formatNumber(result)}</div>`;
        html += '</div>';
    }

    return html;
}

/**
 * Résout limite avec racine
 */
function solveRacine() {
    let html = '';

    if (LimitesState.type_racine === 'sqrt_infini') {
        const a = LimitesState.sqrt_a;
        const b = LimitesState.sqrt_b;
        const c = LimitesState.sqrt_c;
        const vers = LimitesState.vers_racine === '+inf' ? '+\\infty' : '-\\infty';

        html += '<div class="step">';
        html += '<div class="step-number">Étape 1 : Factoriser sous la racine</div>';

        const factored = katex.renderToString(
            `\\sqrt{${toLatexPoly([a, b, c])}} = \\sqrt{x^2\\left(${a} + \\frac{${b}}{x} + \\frac{${c}}{x^2}\\right)}`,
            { throwOnError: false }
        );
        html += `<div class="step-expression">${factored}</div>`;
        html += '</div>';

        html += '<div class="step">';
        html += '<div class="step-number">Étape 2 : Simplifier</div>';

        const simplified = katex.renderToString(
            `= |x| \\cdot \\sqrt{${a} + \\frac{${b}}{x} + \\frac{${c}}{x^2}}`,
            { throwOnError: false }
        );
        html += `<div class="step-expression">${simplified}</div>`;
        html += '</div>';

        html += '<div class="step">';
        html += '<div class="step-number">Étape 3 : Calculer la limite</div>';

        const sqrtA = Math.sqrt(Math.abs(a));
        let limite = '';

        if (vers === '+\\infty') {
            limite = a > 0 ? '+\\infty' : '0';
        } else {
            limite = a > 0 ? '+\\infty' : '0';
        }

        html += `<div class="step-explanation">Quand x → ${vers === '+\\infty' ? '+∞' : '-∞'}, les termes avec x au dénominateur tendent vers 0.</div>`;
        const limExpr = katex.renderToString(
            `\\lim_{x \\to ${vers}} \\sqrt{${toLatexPoly([a, b, c])}} = ${limite}`,
            { throwOnError: false }
        );
        html += `<div class="step-expression">${limExpr}</div>`;
        html += '</div>';

        html += '<div class="result-highlight">';
        html += `<div class="final">Réponse : ${katex.renderToString(limite, { throwOnError: false })}</div>`;
        html += '</div>';
    } else if (LimitesState.type_racine === 'diff_sqrt') {
        const a = LimitesState.diff_a;

        html += '<div class="step">';
        html += '<div class="step-number">Étape 1 : Multiplier par la quantité conjuguée</div>';

        const conjugate = katex.renderToString(
            `\\frac{\\sqrt{x + ${a}} - \\sqrt{x}}{1} \\times \\frac{\\sqrt{x + ${a}} + \\sqrt{x}}{\\sqrt{x + ${a}} + \\sqrt{x}}`,
            { throwOnError: false }
        );
        html += `<div class="step-expression">${conjugate}</div>`;
        html += '</div>';

        html += '<div class="step">';
        html += '<div class="step-number">Étape 2 : Simplifier</div>';

        const simplified = katex.renderToString(
            `= \\frac{(x + ${a}) - x}{\\sqrt{x + ${a}} + \\sqrt{x}} = \\frac{${a}}{\\sqrt{x + ${a}} + \\sqrt{x}}`,
            { throwOnError: false }
        );
        html += `<div class="step-expression">${simplified}</div>`;
        html += '</div>';

        html += '<div class="step">';
        html += '<div class="step-number">Étape 3 : Calculer la limite</div>';
        html += `<div class="step-explanation">Quand x → +∞, le dénominateur tend vers +∞.</div>`;
        const limExpr = katex.renderToString(
            `\\lim_{x \\to +\\infty} \\frac{${a}}{\\sqrt{x + ${a}} + \\sqrt{x}} = 0`,
            { throwOnError: false }
        );
        html += `<div class="step-expression">${limExpr}</div>`;
        html += '</div>';

        html += '<div class="result-highlight">';
        html += `<div class="final">Réponse : 0</div>`;
        html += '</div>';
    }

    return html;
}

/**
 * Résout asymptotes
 */
function solveAsymptote() {
    const [a, b] = LimitesState.asymp_num;
    const [c, d] = LimitesState.asymp_den;

    let html = '';

    html += '<div class="step">';
    html += '<div class="step-number">Étape 1 : Asymptote verticale</div>';
    const x_av = -d / c;
    html += `<div class="step-explanation">Le dénominateur s'annule quand ${c}x + ${d} = 0, soit x = ${formatNumber(x_av)}</div>`;
    const avExpr = katex.renderToString(`x = ${formatNumber(x_av)}`, { throwOnError: false });
    html += `<div class="step-expression">Asymptote verticale : ${avExpr}</div>`;
    html += '</div>';

    html += '<div class="step">';
    html += '<div class="step-number">Étape 2 : Asymptote horizontale</div>';
    html += `<div class="step-explanation">Même degré au numérateur et dénominateur : la limite en ±∞ est le rapport des coefficients dominants.</div>`;
    const y_ah = a / c;
    const ahExpr = katex.renderToString(`y = ${formatNumber(y_ah)}`, { throwOnError: false });
    html += `<div class="step-expression">Asymptote horizontale : ${ahExpr}</div>`;
    html += '</div>';

    html += '<div class="result-highlight">';
    html += `<div class="final">Asymptote verticale : x = ${formatNumber(x_av)}<br>Asymptote horizontale : y = ${formatNumber(y_ah)}</div>`;
    html += '</div>';

    return html;
}

// ========================================
// Fonctions utilitaires
// ========================================

/**
 * Convertit un polynôme en LaTeX
 * @param {Array} coeffs - Coefficients [a, b, c, ...] pour ax^n + bx^(n-1) + ...
 */
function toLatexPoly(coeffs) {
    const degre = coeffs.length - 1;
    let terms = [];

    for (let i = 0; i <= degre; i++) {
        const coeff = coeffs[i];
        const power = degre - i;

        if (coeff === 0) continue;

        let term = '';

        // Signe
        if (terms.length === 0) {
            // Premier terme
            if (coeff < 0) term = '-';
        } else {
            term = coeff > 0 ? ' + ' : ' - ';
        }

        // Coefficient absolu
        const absCoeff = Math.abs(coeff);
        if (power === 0) {
            // Terme constant
            term += absCoeff;
        } else if (absCoeff === 1) {
            // Ne rien ajouter (on mettra juste x)
        } else {
            term += absCoeff;
        }

        // Variable avec exposant
        if (power > 1) {
            term += `x^{${power}}`;
        } else if (power === 1) {
            term += 'x';
        }

        terms.push(term);
    }

    return terms.length > 0 ? terms.join('') : '0';
}

/**
 * Formate un coefficient (évite 1x, affiche juste x)
 */
function formatCoeff(c) {
    if (c === 1) return '';
    if (c === -1) return '-';
    return c;
}

/**
 * Formate un terme avec signe
 */
function formatTerm(coeff, x, power) {
    if (coeff === 0) return '';

    const sign = coeff > 0 ? '+' : '-';
    const absCoeff = Math.abs(coeff);

    if (power === 0) {
        return ` ${sign} ${absCoeff}`;
    }

    const coeffStr = absCoeff === 1 ? '' : absCoeff;
    const powerStr = power === 1 ? '' : `^${power}`;

    return ` ${sign} ${coeffStr} \\cdot ${x}${powerStr}`;
}

/**
 * Formate une constante
 */
function formatConstant(c) {
    if (c === 0) return '';
    if (c > 0) return ` + ${c}`;
    return ` - ${Math.abs(c)}`;
}

/**
 * Génère un entier aléatoire entre min et max (inclus)
 */
function randInt(min, max, exclude = []) {
    let val;
    do {
        val = Math.floor(Math.random() * (max - min + 1)) + min;
    } while (exclude.includes(val));
    return val;
}

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', () => {
    initLimitesPage();
});
