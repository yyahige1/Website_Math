/* ========================================
   DERIVEES.JS - Calcul de dérivées
   ======================================== */

/**
 * État du module dérivées
 */
const DeriveesState = {
    currentType: 'polynomiale',
    // Polynomiale
    degre: 2,
    coeffs: [3, -5, 2], // ax² + bx + c par défaut
    // Produit
    typeProduit: 'poly_poly',
    // Quotient
    typeQuotient: 'poly_linear',
    // Tangente
    a_tang: 1,
    b_tang: -4,
    c_tang: 3,
    x0_tang: 2,
    // Variations
    a_var: 1,
    b_var: -6,
    c_var: 5
};

/**
 * Initialise la page dérivées
 */
function initDeriveesPage() {
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
            DeriveesState.currentType = button.dataset.type;
            updateExerciseDisplay();
            hideSolution('solutionDiv');
        });
    });
}

/**
 * Configure les gestionnaires d'événements pour les inputs
 */
function setupInputHandlers() {
    // Polynomiale
    $('degre_poly').addEventListener('change', () => {
        DeriveesState.degre = parseInt($('degre_poly').value);
        generateExercise();
    });

    // Produit
    $('type_produit').addEventListener('change', () => {
        DeriveesState.typeProduit = $('type_produit').value;
        generateExercise();
    });

    // Quotient
    $('type_quotient').addEventListener('change', () => {
        DeriveesState.typeQuotient = $('type_quotient').value;
        generateExercise();
    });

    // Tangente
    $('a_tang').addEventListener('input', () => {
        DeriveesState.a_tang = parseFloat($('a_tang').value) || 1;
        updateExerciseDisplay();
    });
    $('b_tang').addEventListener('input', () => {
        DeriveesState.b_tang = parseFloat($('b_tang').value) || 0;
        updateExerciseDisplay();
    });
    $('c_tang').addEventListener('input', () => {
        DeriveesState.c_tang = parseFloat($('c_tang').value) || 0;
        updateExerciseDisplay();
    });
    $('x0_tang').addEventListener('input', () => {
        DeriveesState.x0_tang = parseFloat($('x0_tang').value) || 0;
        updateExerciseDisplay();
    });

    // Variations
    $('a_var').addEventListener('input', () => {
        DeriveesState.a_var = parseFloat($('a_var').value) || 1;
        updateExerciseDisplay();
    });
    $('b_var').addEventListener('input', () => {
        DeriveesState.b_var = parseFloat($('b_var').value) || 0;
        updateExerciseDisplay();
    });
    $('c_var').addEventListener('input', () => {
        DeriveesState.c_var = parseFloat($('c_var').value) || 0;
        updateExerciseDisplay();
    });
}

/**
 * Configure les boutons d'action
 */
function setupActionButtons() {
    $('newExerciseBtn').addEventListener('click', generateExercise);
    $('solveBtn').addEventListener('click', solveExercise);
}

/**
 * Met à jour l'affichage de l'exercice
 */
function updateExerciseDisplay() {
    const type = DeriveesState.currentType;

    // Masquer toutes les sections
    $('polynomialeSection').style.display = 'none';
    $('produitSection').style.display = 'none';
    $('quotientSection').style.display = 'none';
    $('tangenteSection').style.display = 'none';
    $('variationsSection').style.display = 'none';

    // Afficher la section correspondante
    switch (type) {
        case 'polynomiale':
            $('polynomialeSection').style.display = 'block';
            break;
        case 'produit':
            $('produitSection').style.display = 'block';
            break;
        case 'quotient':
            $('quotientSection').style.display = 'block';
            break;
        case 'tangente':
            $('tangenteSection').style.display = 'block';
            break;
        case 'variations':
            $('variationsSection').style.display = 'block';
            break;
    }

    // Mettre à jour l'expression affichée
    let display = '';
    switch (type) {
        case 'polynomiale':
            display = formatPolynomial(DeriveesState.coeffs, true);
            break;
        case 'produit':
            display = generateProduitDisplay();
            break;
        case 'quotient':
            display = generateQuotientDisplay();
            break;
        case 'tangente':
            display = `Tangente à f(x) = ${formatQuadratic(DeriveesState.a_tang, DeriveesState.b_tang, DeriveesState.c_tang)} en x₀ = ${formatNumber(DeriveesState.x0_tang)}`;
            break;
        case 'variations':
            display = `Variations de f(x) = ${formatQuadratic(DeriveesState.a_var, DeriveesState.b_var, DeriveesState.c_var)}`;
            break;
    }

    $('expressionDisplay').textContent = display;
}

/**
 * Formate un polynôme
 */
function formatPolynomial(coeffs, useFx = false) {
    let result = useFx ? 'f(x) = ' : '';
    const n = coeffs.length - 1;
    let first = true;

    for (let i = 0; i <= n; i++) {
        const coef = coeffs[i];
        const power = n - i;

        if (coef === 0) continue;

        // Signe
        if (first) {
            if (coef < 0) result += '-';
        } else {
            result += coef > 0 ? ' + ' : ' - ';
        }

        // Coefficient
        const absCoef = Math.abs(coef);
        if (power === 0 || absCoef !== 1) {
            result += formatNumber(absCoef);
        }

        // Puissance
        if (power === 1) {
            result += 'x';
        } else if (power > 1) {
            result += `x${getSuperscript(power)}`;
        }

        first = false;
    }

    return result || (useFx ? 'f(x) = 0' : '0');
}

/**
 * Convertit un nombre en exposant
 */
function getSuperscript(n) {
    const map = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
    return n.toString().split('').map(c => map[c] || c).join('');
}

/**
 * Formate une fonction quadratique
 */
function formatQuadratic(a, b, c) {
    let result = '';

    // x²
    if (a === 1) result = 'x²';
    else if (a === -1) result = '-x²';
    else result = `${formatNumber(a)}x²`;

    // x
    if (b !== 0) {
        if (b > 0) {
            result += b === 1 ? ' + x' : ` + ${formatNumber(b)}x`;
        } else {
            result += b === -1 ? ' - x' : ` - ${formatNumber(Math.abs(b))}x`;
        }
    }

    // constante
    if (c !== 0) {
        result += c > 0 ? ` + ${formatNumber(c)}` : ` - ${formatNumber(Math.abs(c))}`;
    }

    return result;
}

/**
 * Génère l'affichage pour un produit
 */
function generateProduitDisplay() {
    const type = DeriveesState.typeProduit;
    let u, v;

    switch (type) {
        case 'poly_poly':
            u = 'x² + 2';
            v = '3x - 1';
            break;
        case 'poly_sqrt':
            u = '2x + 3';
            v = '√x';
            break;
        case 'poly_exp':
            u = 'x + 1';
            v = '(2x - 3)³';
            break;
    }

    return `f(x) = (${u})(${v})`;
}

/**
 * Génère l'affichage pour un quotient
 */
function generateQuotientDisplay() {
    const type = DeriveesState.typeQuotient;
    let u, v;

    switch (type) {
        case 'poly_linear':
            u = 'x² - 1';
            v = 'x + 2';
            break;
        case 'linear_poly':
            u = '2x + 1';
            v = 'x² + 1';
            break;
        case 'poly_poly':
            u = 'x² + 2x';
            v = 'x² - 4';
            break;
    }

    return `f(x) = (${u}) / (${v})`;
}

/**
 * Génère un exercice aléatoire
 */
function generateExercise() {
    const type = DeriveesState.currentType;

    switch (type) {
        case 'polynomiale':
            const degre = DeriveesState.degre;
            DeriveesState.coeffs = [];
            for (let i = 0; i <= degre; i++) {
                DeriveesState.coeffs.push(randCoef(-5, 5, false, i === 0));
            }
            break;

        case 'produit':
            // Les coefficients sont générés dynamiquement dans la résolution
            break;

        case 'quotient':
            // Les coefficients sont générés dynamiquement dans la résolution
            break;

        case 'tangente':
            DeriveesState.a_tang = randCoef(1, 3, false, true);
            if (Math.random() < 0.5) DeriveesState.a_tang = -DeriveesState.a_tang;
            DeriveesState.b_tang = randCoef(-6, 6, false, false);
            DeriveesState.c_tang = randCoef(-5, 5, false, false);
            DeriveesState.x0_tang = randCoef(-3, 3, false, true);
            $('a_tang').value = DeriveesState.a_tang;
            $('b_tang').value = DeriveesState.b_tang;
            $('c_tang').value = DeriveesState.c_tang;
            $('x0_tang').value = DeriveesState.x0_tang;
            break;

        case 'variations':
            DeriveesState.a_var = randCoef(1, 3, false, true);
            if (Math.random() < 0.5) DeriveesState.a_var = -DeriveesState.a_var;
            DeriveesState.b_var = randCoef(-8, 8, false, true);
            DeriveesState.c_var = randCoef(-6, 6, false, false);
            $('a_var').value = DeriveesState.a_var;
            $('b_var').value = DeriveesState.b_var;
            $('c_var').value = DeriveesState.c_var;
            break;
    }

    updateExerciseDisplay();
    hideSolution('solutionDiv');
}

/**
 * Résout l'exercice
 */
function solveExercise() {
    const type = DeriveesState.currentType;
    let html = '';

    switch (type) {
        case 'polynomiale':
            html = solvePolynomiale(DeriveesState.coeffs);
            break;
        case 'produit':
            html = solveProduit(DeriveesState.typeProduit);
            break;
        case 'quotient':
            html = solveQuotient(DeriveesState.typeQuotient);
            break;
        case 'tangente':
            html = solveTangente(DeriveesState.a_tang, DeriveesState.b_tang, DeriveesState.c_tang, DeriveesState.x0_tang);
            break;
        case 'variations':
            html = solveVariations(DeriveesState.a_var, DeriveesState.b_var, DeriveesState.c_var);
            break;
    }

    $('stepsContainer').innerHTML = html;
    showSolution('solutionDiv');

    // Dessiner les graphiques après que le DOM soit prêt
    requestAnimationFrame(() => {
        if (type === 'tangente') {
            drawTangent(DeriveesState.a_tang, DeriveesState.b_tang, DeriveesState.c_tang, DeriveesState.x0_tang);
        } else if (type === 'variations') {
            drawVariations(DeriveesState.a_var, DeriveesState.b_var, DeriveesState.c_var);
        }
    });
}

// ============================================================
// Résolution : Dérivée polynomiale
// ============================================================
function solvePolynomiale(coeffs) {
    let html = '';

    // Fonction
    html += '<div class="formula-box">';
    html += '<div class="formula-title">📐 Dérivée d\'une fonction polynomiale</div>';
    html += `<div class="formula-content">${formatPolynomial(coeffs, true)}</div>`;
    html += '</div>';

    // Rappel de la formule
    html += '<div class="step">';
    html += '<div class="step-number">📚 Formule de dérivation</div>';
    html += '<div class="step-explanation">Pour tout n ≥ 1 : (xⁿ)\' = n × xⁿ⁻¹</div>';
    html += '<div class="step-explanation">La dérivée d\'une constante est 0</div>';
    html += '<div class="step-explanation">(u + v)\' = u\' + v\'</div>';
    html += '</div>';

    // Calcul terme par terme
    const n = coeffs.length - 1;
    html += '<div class="step">';
    html += '<div class="step-number">📍 Calcul de f\'(x) terme par terme</div>';

    const derivCoeffs = [];
    for (let i = 0; i < n; i++) {
        const coef = coeffs[i];
        const power = n - i;
        const newCoef = coef * power;
        const newPower = power - 1;

        if (coef !== 0) {
            let term = '';
            if (power === 0) {
                term = `(${formatNumber(coef)})\' = 0`;
            } else if (power === 1) {
                term = `(${formatNumber(coef)}x)\' = ${formatNumber(coef)}`;
            } else {
                term = `(${formatNumber(coef)}x${getSuperscript(power)})\' = ${formatNumber(power)} × ${formatNumber(coef)}x${getSuperscript(newPower)} = ${formatNumber(newCoef)}x${getSuperscript(newPower)}`;
            }
            html += `<div class="step-expression">${term}</div>`;
        }

        derivCoeffs.push(newCoef);
    }
    html += '</div>';

    // Résultat final
    html += '<div class="step">';
    html += '<div class="step-number">✨ Dérivée finale</div>';
    html += `<div class="result-box result-value">f'(x) = ${formatPolynomial(derivCoeffs, false)}</div>`;
    html += '</div>';

    return html;
}

// ============================================================
// Résolution : Règle du produit
// ============================================================
function solveProduit(typeProduit) {
    let html = '';
    let u, v, uPrime, vPrime, uStr, vStr;

    switch (typeProduit) {
        case 'poly_poly':
            uStr = 'x² + 2';
            vStr = '3x - 1';
            u = 'x² + 2';
            v = '3x - 1';
            uPrime = '2x';
            vPrime = '3';
            break;
        case 'poly_sqrt':
            uStr = '2x + 3';
            vStr = '√x';
            u = '2x + 3';
            v = '√x';
            uPrime = '2';
            vPrime = '1/(2√x)';
            break;
        case 'poly_exp':
            uStr = 'x + 1';
            vStr = '(2x - 3)³';
            u = 'x + 1';
            v = '(2x - 3)³';
            uPrime = '1';
            vPrime = '3(2x - 3)² × 2 = 6(2x - 3)²';
            break;
    }

    // Fonction
    html += '<div class="formula-box">';
    html += '<div class="formula-title">📐 Dérivée d\'un produit</div>';
    html += `<div class="formula-content">f(x) = (${u})(${v})</div>`;
    html += '<div class="formula-subtitle">avec u(x) = ' + u + ' et v(x) = ' + v + '</div>';
    html += '</div>';

    // Formule
    html += '<div class="step">';
    html += '<div class="step-number">📚 Formule de dérivation</div>';
    html += '<div class="step-explanation">Pour f(x) = u(x) × v(x) :</div>';
    html += '<div class="step-expression">f\'(x) = u\'(x) × v(x) + u(x) × v\'(x)</div>';
    html += '</div>';

    // Calcul de u' et v'
    html += '<div class="step">';
    html += '<div class="step-number">📍 Étape 1 : Calculer u\'(x) et v\'(x)</div>';
    html += `<div class="step-expression">u(x) = ${u}</div>`;
    html += `<div class="step-expression">u'(x) = ${uPrime}</div>`;
    html += `<div class="step-expression">v(x) = ${v}</div>`;
    html += `<div class="step-expression">v'(x) = ${vPrime}</div>`;
    html += '</div>';

    // Application de la formule
    html += '<div class="step">';
    html += '<div class="step-number">📍 Étape 2 : Appliquer la formule</div>';
    html += '<div class="step-expression">f\'(x) = u\'(x) × v(x) + u(x) × v\'(x)</div>';
    html += `<div class="step-expression">f'(x) = (${uPrime}) × (${v}) + (${u}) × (${vPrime})</div>`;
    html += '</div>';

    // Résultat
    html += '<div class="step">';
    html += '<div class="step-number">✨ Dérivée (forme développée si besoin)</div>';
    html += `<div class="result-box result-value">f'(x) = (${uPrime})(${v}) + (${u})(${vPrime})</div>`;
    html += '</div>';

    return html;
}

// ============================================================
// Résolution : Règle du quotient
// ============================================================
function solveQuotient(typeQuotient) {
    let html = '';
    let u, v, uPrime, vPrime;

    switch (typeQuotient) {
        case 'poly_linear':
            u = 'x² - 1';
            v = 'x + 2';
            uPrime = '2x';
            vPrime = '1';
            break;
        case 'linear_poly':
            u = '2x + 1';
            v = 'x² + 1';
            uPrime = '2';
            vPrime = '2x';
            break;
        case 'poly_poly':
            u = 'x² + 2x';
            v = 'x² - 4';
            uPrime = '2x + 2';
            vPrime = '2x';
            break;
    }

    // Fonction
    html += '<div class="formula-box">';
    html += '<div class="formula-title">📐 Dérivée d\'un quotient</div>';
    html += `<div class="formula-content">f(x) = (${u}) / (${v})</div>`;
    html += '<div class="formula-subtitle">avec u(x) = ' + u + ' et v(x) = ' + v + '</div>';
    html += '</div>';

    // Formule
    html += '<div class="step">';
    html += '<div class="step-number">📚 Formule de dérivation</div>';
    html += '<div class="step-explanation">Pour f(x) = u(x) / v(x) :</div>';
    html += '<div class="step-expression">f\'(x) = (u\'(x) × v(x) - u(x) × v\'(x)) / [v(x)]²</div>';
    html += '</div>';

    // Calcul de u' et v'
    html += '<div class="step">';
    html += '<div class="step-number">📍 Étape 1 : Calculer u\'(x) et v\'(x)</div>';
    html += `<div class="step-expression">u(x) = ${u}</div>`;
    html += `<div class="step-expression">u'(x) = ${uPrime}</div>`;
    html += `<div class="step-expression">v(x) = ${v}</div>`;
    html += `<div class="step-expression">v'(x) = ${vPrime}</div>`;
    html += '</div>';

    // Application de la formule
    html += '<div class="step">';
    html += '<div class="step-number">📍 Étape 2 : Appliquer la formule</div>';
    html += '<div class="step-expression">f\'(x) = [u\'(x) × v(x) - u(x) × v\'(x)] / [v(x)]²</div>';
    html += `<div class="step-expression">f'(x) = [(${uPrime}) × (${v}) - (${u}) × (${vPrime})] / (${v})²</div>`;
    html += '</div>';

    // Résultat
    html += '<div class="step">';
    html += '<div class="step-number">✨ Dérivée finale</div>';
    html += `<div class="result-box result-value">f'(x) = [(${uPrime})(${v}) - (${u})(${vPrime})] / (${v})²</div>`;
    html += '</div>';

    return html;
}

// ============================================================
// Résolution : Équation de tangente
// ============================================================
function solveTangente(a, b, c, x0) {
    let html = '';

    // Fonction
    html += '<div class="formula-box">';
    html += '<div class="formula-title">📐 Équation de la tangente</div>';
    html += `<div class="formula-content">f(x) = ${formatQuadratic(a, b, c)}</div>`;
    html += `<div class="formula-subtitle">au point d'abscisse x₀ = ${formatNumber(x0)}</div>`;
    html += '</div>';

    // Formule
    html += '<div class="step">';
    html += '<div class="step-number">📚 Formule de la tangente</div>';
    html += '<div class="step-explanation">L\'équation de la tangente en x₀ est :</div>';
    html += '<div class="step-expression">y = f\'(x₀)(x - x₀) + f(x₀)</div>';
    html += '</div>';

    // Calcul de f'(x)
    html += '<div class="step">';
    html += '<div class="step-number">📍 Étape 1 : Calculer f\'(x)</div>';
    html += `<div class="step-expression">f(x) = ${formatQuadratic(a, b, c)}</div>`;
    html += `<div class="step-expression">f'(x) = ${formatNumber(2 * a)}x + ${formatNumber(b)}</div>`;
    html += '</div>';

    // Calcul de f'(x0)
    const fPrimeX0 = 2 * a * x0 + b;
    html += '<div class="step">';
    html += '<div class="step-number">📍 Étape 2 : Calculer f\'(x₀)</div>';
    html += `<div class="step-expression">f'(${formatNumber(x0)}) = ${formatNumber(2 * a)} × ${formatNumber(x0)} + ${formatNumber(b)}</div>`;
    html += `<div class="step-expression">f'(${formatNumber(x0)}) = ${formatNumber(fPrimeX0)}</div>`;
    html += '<div class="step-explanation">C\'est le coefficient directeur de la tangente</div>';
    html += '</div>';

    // Calcul de f(x0)
    const fX0 = a * x0 * x0 + b * x0 + c;
    html += '<div class="step">';
    html += '<div class="step-number">📍 Étape 3 : Calculer f(x₀)</div>';
    html += `<div class="step-expression">f(${formatNumber(x0)}) = ${formatNumber(a)} × ${formatNumber(x0)}² + ${formatNumber(b)} × ${formatNumber(x0)} + ${formatNumber(c)}</div>`;
    html += `<div class="step-expression">f(${formatNumber(x0)}) = ${formatNumber(a * x0 * x0)} + ${formatNumber(b * x0)} + ${formatNumber(c)}</div>`;
    html += `<div class="step-expression">f(${formatNumber(x0)}) = ${formatNumber(fX0)}</div>`;
    html += '</div>';

    // Équation de la tangente
    html += '<div class="step">';
    html += '<div class="step-number">📍 Étape 4 : Écrire l\'équation de la tangente</div>';
    html += '<div class="step-expression">y = f\'(x₀)(x - x₀) + f(x₀)</div>';
    html += `<div class="step-expression">y = ${formatNumber(fPrimeX0)}(x - (${formatNumber(x0)})) + ${formatNumber(fX0)}</div>`;
    html += `<div class="step-expression">y = ${formatNumber(fPrimeX0)}x - ${formatNumber(fPrimeX0 * x0)} + ${formatNumber(fX0)}</div>`;
    const ordonnee = fX0 - fPrimeX0 * x0;
    html += `<div class="step-expression">y = ${formatNumber(fPrimeX0)}x + ${formatNumber(ordonnee)}</div>`;
    html += '</div>';

    // Résultat
    html += '<div class="step">';
    html += '<div class="step-number">✨ Équation de la tangente</div>';
    html += `<div class="result-box result-value">y = ${formatNumber(fPrimeX0)}x + ${formatNumber(ordonnee)}</div>`;
    html += `<div class="step-explanation">Passe par le point (${formatNumber(x0)}, ${formatNumber(fX0)})</div>`;
    html += '</div>';

    // Graphique
    html += '<div class="step">';
    html += '<div class="step-number">📈 Représentation graphique</div>';
    html += '<div class="graph-container">';
    html += '<canvas id="tangentGraph" width="600" height="400"></canvas>';
    html += '</div>';
    html += '</div>';

    return html;
}

// ============================================================
// Résolution : Étude de variations
// ============================================================
function solveVariations(a, b, c) {
    let html = '';

    // Fonction
    html += '<div class="formula-box">';
    html += '<div class="formula-title">📊 Étude de variations</div>';
    html += `<div class="formula-content">f(x) = ${formatQuadratic(a, b, c)}</div>`;
    html += '</div>';

    // Calcul de f'(x)
    html += '<div class="step">';
    html += '<div class="step-number">📍 Étape 1 : Calculer f\'(x)</div>';
    html += `<div class="step-expression">f(x) = ${formatQuadratic(a, b, c)}</div>`;
    html += `<div class="step-expression">f'(x) = ${formatNumber(2 * a)}x + ${formatNumber(b)}</div>`;
    html += '</div>';

    // Résolution de f'(x) = 0
    const x0 = -b / (2 * a);
    html += '<div class="step">';
    html += '<div class="step-number">📍 Étape 2 : Résoudre f\'(x) = 0</div>';
    html += `<div class="step-expression">${formatNumber(2 * a)}x + ${formatNumber(b)} = 0</div>`;
    html += `<div class="step-expression">${formatNumber(2 * a)}x = ${formatNumber(-b)}</div>`;
    html += `<div class="step-expression">x = ${formatNumber(x0)}</div>`;
    html += '</div>';

    // Signe de f'(x)
    html += '<div class="step">';
    html += '<div class="step-number">📍 Étape 3 : Étudier le signe de f\'(x)</div>';
    html += `<div class="step-explanation">f'(x) = ${formatNumber(2 * a)}x + ${formatNumber(b)} est une fonction affine</div>`;
    if (2 * a > 0) {
        html += `<div class="step-explanation">• f'(x) &lt; 0 pour x &lt; ${formatNumber(x0)}</div>`;
        html += `<div class="step-explanation">• f'(x) = 0 pour x = ${formatNumber(x0)}</div>`;
        html += `<div class="step-explanation">• f'(x) &gt; 0 pour x &gt; ${formatNumber(x0)}</div>`;
    } else {
        html += `<div class="step-explanation">• f'(x) &gt; 0 pour x &lt; ${formatNumber(x0)}</div>`;
        html += `<div class="step-explanation">• f'(x) = 0 pour x = ${formatNumber(x0)}</div>`;
        html += `<div class="step-explanation">• f'(x) &lt; 0 pour x &gt; ${formatNumber(x0)}</div>`;
    }
    html += '</div>';

    // Tableau de variations
    const fX0 = a * x0 * x0 + b * x0 + c;
    html += '<div class="step">';
    html += '<div class="step-number">📊 Tableau de variations</div>';
    html += '<div class="variations-table-container">';
    html += '<table class="variations-table">';

    // Ligne x
    html += '<tr>';
    html += '<th>x</th>';
    html += '<td>-∞</td>';
    html += `<td>${formatNumber(x0)}</td>`;
    html += '<td>+∞</td>';
    html += '</tr>';

    // Ligne f'(x)
    html += '<tr>';
    html += '<th>f\'(x)</th>';
    if (a > 0) {
        html += '<td>-</td>';
        html += '<td>0</td>';
        html += '<td>+</td>';
    } else {
        html += '<td>+</td>';
        html += '<td>0</td>';
        html += '<td>-</td>';
    }
    html += '</tr>';

    // Ligne f(x)
    html += '<tr>';
    html += '<th>f(x)</th>';
    if (a > 0) {
        html += '<td class="var-up">+∞<br>↘</td>';
        html += `<td class="var-extremum">${formatNumber(fX0)}</td>`;
        html += '<td class="var-down">↗<br>+∞</td>';
    } else {
        html += '<td class="var-down">-∞<br>↗</td>';
        html += `<td class="var-extremum">${formatNumber(fX0)}</td>`;
        html += '<td class="var-up">↘<br>-∞</td>';
    }
    html += '</tr>';

    html += '</table>';
    html += '</div>';
    html += '</div>';

    // Conclusion
    html += '<div class="step">';
    html += '<div class="step-number">✨ Conclusion</div>';
    if (a > 0) {
        html += `<div class="step-explanation">• f est <span class="term-red">décroissante</span> sur ]-∞, ${formatNumber(x0)}]</div>`;
        html += `<div class="step-explanation">• f admet un <span class="term-red">minimum</span> en x = ${formatNumber(x0)}, qui vaut ${formatNumber(fX0)}</div>`;
        html += `<div class="step-explanation">• f est <span class="term-red">croissante</span> sur [${formatNumber(x0)}, +∞[</div>`;
    } else {
        html += `<div class="step-explanation">• f est <span class="term-red">croissante</span> sur ]-∞, ${formatNumber(x0)}]</div>`;
        html += `<div class="step-explanation">• f admet un <span class="term-red">maximum</span> en x = ${formatNumber(x0)}, qui vaut ${formatNumber(fX0)}</div>`;
        html += `<div class="step-explanation">• f est <span class="term-red">décroissante</span> sur [${formatNumber(x0)}, +∞[</div>`;
    }
    html += '</div>';

    // Graphique
    html += '<div class="step">';
    html += '<div class="step-number">📈 Représentation graphique</div>';
    html += '<div class="graph-container">';
    html += '<canvas id="variationsGraph" width="600" height="400"></canvas>';
    html += '</div>';
    html += '</div>';

    return html;
}

// ============================================================
// Dessin de la tangente
// ============================================================
function drawTangent(a, b, c, x0) {
    const graph = new GraphCanvas('tangentGraph', {
        xMin: -10,
        xMax: 10,
        yMin: -10,
        yMax: 10,
        gridStep: 1
    });

    graph.clear();
    graph.drawGrid();
    graph.drawAxes();
    graph.drawTicks();

    // Dessiner la parabole
    const func = (x) => a * x * x + b * x + c;
    graph.drawFunction(func, '#2196F3', 3);

    // Point de tangence
    const y0 = a * x0 * x0 + b * x0 + c;
    if (x0 >= -10 && x0 <= 10 && y0 >= -10 && y0 <= 10) {
        graph.drawPoint(x0, y0, '#e74c3c', 6);
    }

    // Tangente
    const fPrime = 2 * a * x0 + b;
    const tangent = (x) => fPrime * (x - x0) + y0;
    graph.drawFunction(tangent, '#27ae60', 2);
}

// ============================================================
// Dessin pour variations
// ============================================================
function drawVariations(a, b, c) {
    const graph = new GraphCanvas('variationsGraph', {
        xMin: -10,
        xMax: 10,
        yMin: -10,
        yMax: 10,
        gridStep: 1
    });

    graph.clear();
    graph.drawGrid();
    graph.drawAxes();
    graph.drawTicks();

    // Dessiner la parabole
    const func = (x) => a * x * x + b * x + c;
    graph.drawFunction(func, '#2196F3', 3);

    // Sommet (extremum)
    const x0 = -b / (2 * a);
    const y0 = a * x0 * x0 + b * x0 + c;
    if (x0 >= -10 && x0 <= 10 && y0 >= -10 && y0 <= 10) {
        graph.drawPoint(x0, y0, '#e74c3c', 6);
    }
}

// ============================================================
// Initialisation au chargement de la page
// ============================================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDeriveesPage);
} else {
    initDeriveesPage();
}
