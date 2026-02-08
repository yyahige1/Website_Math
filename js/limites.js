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
    coeffs_poly: [3, -5, 2], // [a, b, c] pour ax² + bx + c

    // Paramètres rationnelle en l'infini
    type_rat: 'meme_degre',
    vers_rat: '+inf',
    num_coeffs: [2, 1], // numérateur
    den_coeffs: [1, -3], // dénominateur

    // Paramètres limite en un point
    type_point: 'continue',
    x0_point: 2,
    func_point: { a: 1, b: -4, c: 3 }, // f(x) = ax² + bx + c

    // Paramètres forme indéterminée
    type_ind: '0/0',
    x0_ind: 2,
    num_ind: [1, 0, -4], // x² - 4
    den_ind: [1, -2], // x - 2

    // Paramètres racine
    type_racine: 'sqrt_infini',
    vers_racine: '+inf',
    sqrt_coeffs: [1, 2, 1], // √(x² + 2x + 1)

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

            // Masquer toutes les sections
            document.querySelectorAll('[id$="Section"]').forEach(section => {
                section.style.display = 'none';
            });

            // Afficher la section correspondante
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
    // Polynôme en l'infini
    $('degre_poly').addEventListener('change', () => {
        LimitesState.degre_poly = parseInt($('degre_poly').value);
        generateNewExercise();
        updateExerciseDisplay();
    });

    $('vers_poly').addEventListener('change', () => {
        LimitesState.vers_poly = $('vers_poly').value;
        updateExerciseDisplay();
    });

    // Rationnelle en l'infini
    $('type_rat').addEventListener('change', () => {
        LimitesState.type_rat = $('type_rat').value;
        generateNewExercise();
        updateExerciseDisplay();
    });

    $('vers_rat').addEventListener('change', () => {
        LimitesState.vers_rat = $('vers_rat').value;
        updateExerciseDisplay();
    });

    // Limite en un point
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

    // Forme indéterminée
    $('type_ind').addEventListener('change', () => {
        LimitesState.type_ind = $('type_ind').value;
        generateNewExercise();
        updateExerciseDisplay();
    });

    // Racine
    $('type_racine').addEventListener('change', () => {
        LimitesState.type_racine = $('type_racine').value;
        generateNewExercise();
        updateExerciseDisplay();
    });

    $('vers_racine').addEventListener('change', () => {
        LimitesState.vers_racine = $('vers_racine').value;
        updateExerciseDisplay();
    });

    // Asymptote
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
    const vers = LimitesState.vers_poly === '+inf' ? '+∞' : '-∞';
    const poly = formatPolynomial(coeffs);

    return `lim (${poly}) = ?<br>x→${vers}`;
}

/**
 * Affiche l'exercice rationnelle en l'infini
 */
function displayRationnelleInfini() {
    const num = formatPolynomial(LimitesState.num_coeffs);
    const den = formatPolynomial(LimitesState.den_coeffs);
    const vers = LimitesState.vers_rat === '+inf' ? '+∞' : '-∞';

    const frac = katex.renderToString(`\\frac{${num}}{${den}}`, { throwOnError: false });
    return `lim ${frac} = ?<br>x→${vers}`;
}

/**
 * Affiche l'exercice limite en un point
 */
function displayPoint() {
    const { a, b, c } = LimitesState.func_point;
    const x0 = LimitesState.x0_point;

    let func = '';
    if (LimitesState.type_point === 'continue') {
        func = `${a}x² ${b >= 0 ? '+' : ''} ${b}x ${c >= 0 ? '+' : ''} ${c}`;
    } else {
        // Rationnelle qui peut avoir problème en x0
        const num = `x² ${-4 >= 0 ? '+' : ''} ${-4}`;
        const den = `x ${-x0 >= 0 ? '+' : ''} ${-x0}`;
        func = katex.renderToString(`\\frac{${num}}{${den}}`, { throwOnError: false });
    }

    return `lim f(x) = ?<br>x→${x0}<br><br>avec f(x) = ${func}`;
}

/**
 * Affiche l'exercice forme indéterminée
 */
function displayIndeterminee() {
    if (LimitesState.type_ind === '0/0') {
        const x0 = LimitesState.x0_ind;
        const num = `x² - ${x0 * x0}`;
        const den = `x - ${x0}`;
        const frac = katex.renderToString(`\\frac{${num}}{${den}}`, { throwOnError: false });
        return `lim ${frac} = ?<br>x→${x0}`;
    } else {
        // Forme ∞ - ∞
        const a = LimitesState.sqrt_coeffs[0];
        return `lim (√(x² + ${a}x) - x) = ?<br>x→+∞`;
    }
}

/**
 * Affiche l'exercice avec racine
 */
function displayRacine() {
    const vers = LimitesState.vers_racine === '+inf' ? '+∞' : '-∞';

    if (LimitesState.type_racine === 'sqrt_infini') {
        const [a, b, c] = LimitesState.sqrt_coeffs;
        const inside = `${a}x² ${b >= 0 ? '+' : ''} ${b}x ${c >= 0 ? '+' : ''} ${c}`;
        const sqrt = katex.renderToString(`\\sqrt{${inside}}`, { throwOnError: false });
        return `lim ${sqrt} = ?<br>x→${vers}`;
    } else if (LimitesState.type_racine === 'diff_sqrt') {
        const a = Math.abs(LimitesState.sqrt_coeffs[1]);
        const sqrt1 = katex.renderToString(`\\sqrt{x}`, { throwOnError: false });
        const sqrt2 = katex.renderToString(`\\sqrt{x + ${a}}`, { throwOnError: false });
        return `lim (${sqrt2} - ${sqrt1}) = ?<br>x→+∞`;
    } else {
        const [a, b] = LimitesState.num_coeffs;
        const [c, d] = LimitesState.sqrt_coeffs.slice(0, 2);
        const num = `${a}x ${b >= 0 ? '+' : ''} ${b}`;
        const denInside = `${c}x² ${d >= 0 ? '+' : ''} ${d}`;
        const frac = katex.renderToString(`\\frac{${num}}{\\sqrt{${denInside}}}`, { throwOnError: false });
        return `lim ${frac} = ?<br>x→${vers}`;
    }
}

/**
 * Affiche l'exercice asymptotes
 */
function displayAsymptote() {
    const [a, b] = LimitesState.asymp_num;
    const [c, d] = LimitesState.asymp_den;
    const num = `${a}x ${b >= 0 ? '+' : ''} ${b}`;
    const den = `${c}x ${d >= 0 ? '+' : ''} ${d}`;
    const frac = katex.renderToString(`\\frac{${num}}{${den}}`, { throwOnError: false });

    return `Déterminer les asymptotes de :<br>f(x) = ${frac}`;
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

    for (let i = 0; i <= degre; i++) {
        if (i === 0) {
            // Coefficient dominant non nul
            coeffs.push(randInt(-5, 5, [0]));
        } else {
            coeffs.push(randInt(-10, 10));
        }
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
        // Génère (x-a)(x-b)/(x-x0) où a ≠ x0
        LimitesState.x0_ind = x0;
    }
}

/**
 * Génère forme indéterminée
 */
function generateIndeterminee() {
    if (LimitesState.type_ind === '0/0') {
        const x0 = randInt(1, 5);
        LimitesState.x0_ind = x0;
        // Forme (x²-x0²)/(x-x0) = (x-x0)(x+x0)/(x-x0)
        LimitesState.num_ind = [1, 0, -(x0 * x0)];
        LimitesState.den_ind = [1, -x0];
    } else {
        // Forme ∞ - ∞ avec racines
        LimitesState.sqrt_coeffs = [randInt(1, 5), randInt(1, 10), 0];
    }
}

/**
 * Génère exercice avec racine
 */
function generateRacine() {
    if (LimitesState.type_racine === 'sqrt_infini') {
        LimitesState.sqrt_coeffs = [
            randInt(1, 3),
            randInt(-5, 5),
            randInt(-5, 5)
        ];
    } else if (LimitesState.type_racine === 'diff_sqrt') {
        LimitesState.sqrt_coeffs = [0, randInt(1, 10), 0];
    } else {
        LimitesState.num_coeffs = [randInt(-5, 5, [0]), randInt(-10, 10)];
        LimitesState.sqrt_coeffs = [randInt(1, 3), randInt(-5, 5)];
    }
}

/**
 * Génère fonction pour asymptotes
 */
function generateAsymptote() {
    LimitesState.asymp_num = [randInt(-5, 5, [0]), randInt(-10, 10)];
    LimitesState.asymp_den = [randInt(-5, 5, [0]), randInt(-10, 10)];
}

/**
 * Résout l'exercice courant
 */
function solveLimites() {
    let html = '<h3>✅ Correction détaillée</h3>';

    switch (LimitesState.currentType) {
        case 'polynome_infini':
            html += solvePolynomeInfini();
            break;
        case 'rationnelle_infini':
            html += solveRationnelleInfini();
            break;
        case 'point':
            html += solvePoint();
            break;
        case 'indeterminee':
            html += solveIndeterminee();
            break;
        case 'racine':
            html += solveRacine();
            break;
        case 'asymptote':
            html += solveAsymptote();
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
    const versSymbol = vers === '+inf' ? '+∞' : '-∞';
    const degre = coeffs.length - 1;
    const a = coeffs[0];

    let html = '';

    html += '<div class="step">';
    html += '<div class="step-number">Étape 1 : Identifier le terme dominant</div>';
    html += `<div class="step-explanation">Pour un polynôme de degré ${degre}, le terme dominant est ${a}x<sup>${degre}</sup>.</div>`;
    html += `<div class="step-expression">En l'infini, les termes de plus bas degré sont négligeables.</div>`;
    html += '</div>';

    html += '<div class="step">';
    html += '<div class="step-number">Étape 2 : Comportement du terme dominant</div>';

    let comportement = '';
    if (degre % 2 === 0) {
        // Degré pair
        comportement = `x<sup>${degre}</sup> → +∞ quand x → ${versSymbol}`;
    } else {
        // Degré impair
        if (vers === '+inf') {
            comportement = `x<sup>${degre}</sup> → +∞`;
        } else {
            comportement = `x<sup>${degre}</sup> → -∞`;
        }
    }
    html += `<div class="step-expression">${comportement}</div>`;
    html += '</div>';

    html += '<div class="step">';
    html += '<div class="step-number">Étape 3 : Conclusion</div>';

    let limite = '';
    if (degre % 2 === 0) {
        limite = a > 0 ? '+∞' : '-∞';
    } else {
        if (vers === '+inf') {
            limite = a > 0 ? '+∞' : '-∞';
        } else {
            limite = a > 0 ? '-∞' : '+∞';
        }
    }

    const poly = formatPolynomial(coeffs);
    html += `<div class="step-expression">lim (${poly}) = ${limite}<br>x→${versSymbol}</div>`;
    html += '</div>';

    html += '<div class="result-highlight">';
    html += `<div class="final">Réponse : ${limite}</div>`;
    html += '</div>';

    return html;
}

/**
 * Résout rationnelle en l'infini
 */
function solveRationnelleInfini() {
    const num = LimitesState.num_coeffs;
    const den = LimitesState.den_coeffs;
    const vers = LimitesState.vers_rat === '+inf' ? '+∞' : '-∞';

    const degNum = num.length - 1;
    const degDen = den.length - 1;

    let html = '';

    html += '<div class="step">';
    html += '<div class="step-number">Étape 1 : Comparer les degrés</div>';
    html += `<div class="step-explanation">Degré numérateur : ${degNum}<br>Degré dénominateur : ${degDen}</div>`;
    html += '</div>';

    html += '<div class="step">';
    html += '<div class="step-number">Étape 2 : Factoriser par le terme dominant</div>';

    let factorNum = `x<sup>${degNum}</sup>`;
    let factorDen = `x<sup>${degDen}</sup>`;

    html += `<div class="step-explanation">On factorise par ${factorNum} au numérateur et ${factorDen} au dénominateur.</div>`;
    html += '</div>';

    html += '<div class="step">';
    html += '<div class="step-number">Étape 3 : Simplifier et calculer la limite</div>';

    let limite = '';
    if (degNum === degDen) {
        // Limite = rapport des coefficients dominants
        const ratio = num[0] / den[0];
        limite = formatNumber(ratio);
    } else if (degNum > degDen) {
        // Limite = ±∞
        const sign = (num[0] / den[0]) > 0 ? '+' : '-';
        limite = `${sign}∞`;
    } else {
        // Limite = 0
        limite = '0';
    }

    html += `<div class="step-expression">Les termes avec x au dénominateur tendent vers 0.</div>`;
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
    const { a, b, c } = LimitesState.func_point;
    const x0 = LimitesState.x0_point;

    let html = '';

    html += '<div class="step">';
    html += '<div class="step-number">Étape 1 : Vérifier la continuité</div>';
    html += `<div class="step-explanation">La fonction f(x) = ${a}x² ${b >= 0 ? '+' : ''} ${b}x ${c >= 0 ? '+' : ''} ${c} est continue en x = ${x0}.</div>`;
    html += '</div>';

    html += '<div class="step">';
    html += '<div class="step-number">Étape 2 : Calculer f(${x0})</div>';
    const result = a * x0 * x0 + b * x0 + c;
    html += `<div class="step-expression">f(${x0}) = ${a}×${x0}² ${b >= 0 ? '+' : ''} ${b}×${x0} ${c >= 0 ? '+' : ''} ${c}</div>`;
    html += `<div class="step-expression">f(${x0}) = ${formatNumber(result)}</div>`;
    html += '</div>';

    html += '<div class="result-highlight">';
    html += `<div class="final">Réponse : ${formatNumber(result)}</div>`;
    html += '</div>';

    return html;
}

/**
 * Résout forme indéterminée
 */
function solveIndeterminee() {
    const x0 = LimitesState.x0_ind;

    let html = '';

    html += '<div class="step">';
    html += '<div class="step-number">Étape 1 : Identifier la forme indéterminée</div>';
    html += `<div class="step-explanation">En x = ${x0}, le numérateur et le dénominateur s'annulent : forme 0/0.</div>`;
    html += '</div>';

    html += '<div class="step">';
    html += '<div class="step-number">Étape 2 : Factoriser</div>';
    html += `<div class="step-expression">x² - ${x0 * x0} = (x - ${x0})(x + ${x0})</div>`;
    const frac = katex.renderToString(`\\frac{(x - ${x0})(x + ${x0})}{x - ${x0}}`, { throwOnError: false });
    html += `<div class="step-expression">${frac}</div>`;
    html += '</div>';

    html += '<div class="step">';
    html += '<div class="step-number">Étape 3 : Simplifier</div>';
    html += `<div class="step-expression">On simplifie par (x - ${x0}) :</div>`;
    html += `<div class="step-expression">x + ${x0}</div>`;
    html += '</div>';

    html += '<div class="step">';
    html += '<div class="step-number">Étape 4 : Calculer la limite</div>';
    const result = x0 + x0;
    html += `<div class="step-expression">lim (x + ${x0}) = ${x0} + ${x0} = ${result}<br>x→${x0}</div>`;
    html += '</div>';

    html += '<div class="result-highlight">';
    html += `<div class="final">Réponse : ${result}</div>`;
    html += '</div>';

    return html;
}

/**
 * Résout limite avec racine
 */
function solveRacine() {
    let html = '';

    if (LimitesState.type_racine === 'sqrt_infini') {
        const [a, b, c] = LimitesState.sqrt_coeffs;
        const vers = LimitesState.vers_racine === '+inf' ? '+∞' : '-∞';

        html += '<div class="step">';
        html += '<div class="step-number">Étape 1 : Factoriser sous la racine</div>';
        const inside = `${a}x² ${b >= 0 ? '+' : ''} ${b}x ${c >= 0 ? '+' : ''} ${c}`;
        const sqrt = katex.renderToString(`\\sqrt{${inside}}`, { throwOnError: false });
        html += `<div class="step-expression">${sqrt} = ${katex.renderToString(`\\sqrt{x^2(${a} + \\frac{${b}}{x} + \\frac{${c}}{x^2})}`, { throwOnError: false })}</div>`;
        html += '</div>';

        html += '<div class="step">';
        html += '<div class="step-number">Étape 2 : Simplifier</div>';
        html += `<div class="step-expression">= |x| × ${katex.renderToString(`\\sqrt{${a} + \\frac{${b}}{x} + \\frac{${c}}{x^2}}`, { throwOnError: false })}</div>`;
        html += '</div>';

        html += '<div class="step">';
        html += '<div class="step-number">Étape 3 : Calculer la limite</div>';
        const sqrtA = Math.sqrt(Math.abs(a));
        const limite = vers === '+∞' ? `+∞` : `-∞`;
        html += `<div class="step-expression">Quand x → ${vers}, |x| → +∞ et ${katex.renderToString(`\\sqrt{${a}}`, { throwOnError: false })} = ${formatNumber(sqrtA)}</div>`;
        html += '</div>';

        html += '<div class="result-highlight">';
        html += `<div class="final">Réponse : ${limite}</div>`;
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
    html += `<div class="step-explanation">Le dénominateur s'annule en x = ${formatNumber(x_av)}</div>`;
    html += `<div class="step-expression">Asymptote verticale : x = ${formatNumber(x_av)}</div>`;
    html += '</div>';

    html += '<div class="step">';
    html += '<div class="step-number">Étape 2 : Asymptote horizontale</div>';
    html += `<div class="step-explanation">Limite en ±∞ : même degré au numérateur et dénominateur.</div>`;
    const y_ah = a / c;
    html += `<div class="step-expression">Asymptote horizontale : y = ${formatNumber(y_ah)}</div>`;
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
 * Formate un polynôme à partir de ses coefficients
 * @param {Array} coeffs - Coefficients [a, b, c, ...] pour ax^n + bx^(n-1) + ...
 */
function formatPolynomial(coeffs) {
    const degre = coeffs.length - 1;
    let terms = [];

    for (let i = 0; i <= degre; i++) {
        const coeff = coeffs[i];
        const power = degre - i;

        if (coeff === 0) continue;

        let term = '';

        // Coefficient
        if (i === 0) {
            // Premier terme
            if (coeff === 1 && power > 0) {
                term = '';
            } else if (coeff === -1 && power > 0) {
                term = '-';
            } else {
                term = String(coeff);
            }
        } else {
            // Termes suivants
            if (coeff > 0) {
                if (coeff === 1 && power > 0) {
                    term = ' + ';
                } else {
                    term = ` + ${coeff}`;
                }
            } else {
                if (coeff === -1 && power > 0) {
                    term = ' - ';
                } else {
                    term = ` - ${Math.abs(coeff)}`;
                }
            }
        }

        // Variable avec exposant
        if (power > 1) {
            term += `x<sup>${power}</sup>`;
        } else if (power === 1) {
            term += 'x';
        }

        terms.push(term);
    }

    return terms.join('');
}

/**
 * Génère un entier aléatoire entre min et max (inclus)
 * @param {number} min - Minimum
 * @param {number} max - Maximum
 * @param {Array} exclude - Valeurs à exclure (optionnel)
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
