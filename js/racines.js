// Fichier: js/racines.js
// Module Racines carrées - Respecte l'architecture MathsFacile

const RacinesState = {
    currentType: 1,
    currentExercise: null
};

/**
 * Initialise la page Racines
 */
function initRacinesPage() {
    // Gestion des boutons de type
    const typeButtons = document.querySelectorAll('.type-btn');
    typeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            typeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            RacinesState.currentType = parseInt(btn.dataset.type);
            generateRacine();
        });
    });

    // Bouton générer
    const generateBtn = document.getElementById('generateBtn');
    if (generateBtn) {
        generateBtn.addEventListener('click', generateRacine);
    }

    // Bouton correction
    const solveBtn = document.getElementById('solveBtn');
    if (solveBtn) {
        solveBtn.addEventListener('click', solveRacine);
    }

    // Générer le premier exercice
    generateRacine();
}

/**
 * Génère un exercice selon le type actuel
 */
function generateRacine() {
    const type = RacinesState.currentType;
    let exercise;

    switch(type) {
        case 1: exercise = genSimplification(); break;
        case 2: exercise = genAddition(); break;
        case 3: exercise = genMultiplication(); break;
        case 4: exercise = genRationalisation(); break;
        case 5: exercise = genConjuguee(); break;
        case 6: exercise = genFractionConjuguee(); break;
        default: exercise = genSimplification();
    }

    RacinesState.currentExercise = exercise;
    updateDisplay();
    hideSolution();
}

/**
 * Met à jour l'affichage de l'exercice
 */
function updateDisplay() {
    const display = document.getElementById('expressionDisplay');
    if (display && RacinesState.currentExercise) {
        display.innerHTML = RacinesState.currentExercise.expression;
    }
}

/**
 * Cache la solution
 */
function hideSolution() {
    const solutionDiv = document.getElementById('solutionDiv');
    if (solutionDiv) {
        solutionDiv.style.display = 'none';
    }
}

/**
 * Affiche la correction
 */
function solveRacine() {
    const ex = RacinesState.currentExercise;
    if (!ex) return;

    let html = '';

    switch(ex.type) {
        case 1: html = solveSimplification(ex); break;
        case 2: html = solveAddition(ex); break;
        case 3: html = solveMultiplication(ex); break;
        case 4: html = solveRationalisation(ex); break;
        case 5: html = solveConjuguee(ex); break;
        case 6: html = solveFractionConjuguee(ex); break;
    }

    const container = document.getElementById('stepsContainer');
    const solutionDiv = document.getElementById('solutionDiv');
    
    if (container) container.innerHTML = html;
    if (solutionDiv) solutionDiv.style.display = 'block';
}

// ============= FONCTIONS UTILITAIRES =============

/**
 * Crée une fraction verticale en HTML
 * @param {string} numerator - Numérateur
 * @param {string} denominator - Dénominateur
 * @returns {string} HTML de la fraction
 */
function createFraction(numerator, denominator) {
    return `<div class="fraction-inline">
        <span class="fraction-num">${numerator}</span>
        <span class="fraction-line"></span>
        <span class="fraction-den">${denominator}</span>
    </div>`;
}

/**
 * Simplifie une racine carrée
 * @param {number} n - Nombre sous la racine
 * @returns {object} - {outside: nombre devant, inside: nombre sous racine}
 */
function simplifySquareRoot(n) {
    let outside = 1;
    let inside = n;
    
    // On cherche les carrés parfaits (4, 9, 16, 25, 36, 49, 64, 81, 100...)
    const squares = [100, 81, 64, 49, 36, 25, 16, 9, 4];
    
    for (let sq of squares) {
        while (inside % sq === 0) {
            outside *= Math.sqrt(sq);
            inside /= sq;
        }
    }
    
    return { outside, inside };
}

/**
 * Formate une racine
 */
function formatSqrt(coef, radicand) {
    if (radicand === 1) return coef.toString();
    if (coef === 1) return `√${radicand}`;
    return `${coef}√${radicand}`;
}

// ============= GÉNÉRATION D'EXERCICES =============

function genSimplification() {
    // Générer un nombre qui se simplifie bien
    const perfect = [4, 9, 16, 25, 36, 49];
    const square = perfect[randInt(0, perfect.length - 1)];
    const other = randInt(2, 8);
    const n = square * other;
    
    return {
        type: 1,
        number: n,
        square: square,
        expression: `√${n}`
    };
}

function genAddition() {
    // Même radicand
    const radicand = [2, 3, 5, 6, 7][randInt(0, 4)];
    const coef1 = randInt(2, 7);
    const coef2 = randInt(2, 7);
    
    return {
        type: 2,
        coef1: coef1,
        coef2: coef2,
        radicand: radicand,
        expression: `${formatSqrt(coef1, radicand)} + ${formatSqrt(coef2, radicand)}`
    };
}

function genMultiplication() {
    const a = randInt(2, 12);
    const b = randInt(2, 12);
    
    return {
        type: 3,
        a: a,
        b: b,
        expression: `√${a} × √${b}`
    };
}

function genRationalisation() {
    const n = [2, 3, 5, 7][randInt(0, 3)];
    
    return {
        type: 4,
        radicand: n,
        expression: createFraction('1', `√${n}`)
    };
}

function genConjuguee() {
    // 1/(√a + b) ou 1/(√a - b)
    const a = [2, 3, 5, 7][randInt(0, 3)];
    const b = randInt(1, 5);
    const sign = Math.random() < 0.5 ? '+' : '−';
    
    return {
        type: 5,
        radicand: a,
        constant: b,
        sign: sign,
        expression: createFraction('1', `√${a} ${sign} ${b}`)
    };
}

function genFractionConjuguee() {
    // a/(√b + c)
    const numerator = randInt(2, 8);
    const radicand = [2, 3, 5, 7][randInt(0, 3)];
    const constant = randInt(1, 4);
    const sign = Math.random() < 0.5 ? '+' : '−';
    
    return {
        type: 6,
        numerator: numerator,
        radicand: radicand,
        constant: constant,
        sign: sign,
        expression: createFraction(`${numerator}`, `√${radicand} ${sign} ${constant}`)
    };
}

// ============= RÉSOLUTION =============

function solveSimplification(ex) {
    let html = '';
    
    html += `<div class="step">`;
    html += `<div class="step-expression">${ex.expression}</div>`;
    html += `<div class="step-explanation">Expression de départ</div>`;
    html += `</div>`;
    
    const result = simplifySquareRoot(ex.number);
    const sqrtOfSquare = Math.sqrt(ex.square);
    
    html += `<div class="step">`;
    html += `<div class="step-expression">On cherche si ${ex.number} contient des <span class="term-red">carrés parfaits</span></div>`;
    html += `<div class="step-explanation">${ex.number} = <span class="term-red">${ex.square}</span> × ${ex.number / ex.square}</div>`;
    html += `</div>`;
    
    html += `<div class="step">`;
    html += `<div class="step-expression">√${ex.number} = √(<span class="term-red">${ex.square}</span> × ${ex.number / ex.square})</div>`;
    html += `<div class="step-explanation">On sépare la racine</div>`;
    html += `</div>`;
    
    html += `<div class="step">`;
    html += `<div class="step-expression">√<span class="term-red">${ex.square}</span> × √${ex.number / ex.square}</div>`;
    html += `<div class="step-explanation">Propriété : √(a×b) = √a × √b</div>`;
    html += `</div>`;
    
    html += `<div class="step">`;
    html += `<div class="step-expression"><span class="term-blue">${sqrtOfSquare}</span> × √${ex.number / ex.square}</div>`;
    html += `<div class="step-explanation">Car √${ex.square} = ${sqrtOfSquare}</div>`;
    html += `</div>`;
    
    if (result.inside === 1) {
        html += `<div class="result-highlight">${result.outside}</div>`;
    } else {
        html += `<div class="result-highlight"><span class="term-blue">${result.outside}</span>√<span class="term-green">${result.inside}</span></div>`;
    }
    
    return html;
}

function solveAddition(ex) {
    let html = '';
    
    html += `<div class="step">`;
    html += `<div class="step-expression">${ex.expression}</div>`;
    html += `<div class="step-explanation">Expression de départ</div>`;
    html += `</div>`;
    
    html += `<div class="step">`;
    html += `<div class="step-expression">Les deux termes ont le même radicand : <span class="term-green">√${ex.radicand}</span></div>`;
    html += `<div class="step-explanation">On peut factoriser</div>`;
    html += `</div>`;
    
    const result = ex.coef1 + ex.coef2;
    
    html += `<div class="step">`;
    html += `<div class="step-expression">(<span class="term-blue">${ex.coef1}</span> + <span class="term-blue">${ex.coef2}</span>)<span class="term-green">√${ex.radicand}</span></div>`;
    html += `<div class="step-explanation">On additionne les coefficients</div>`;
    html += `</div>`;
    
    html += `<div class="result-highlight"><span class="term-blue">${result}</span><span class="term-green">√${ex.radicand}</span></div>`;
    
    return html;
}

function solveMultiplication(ex) {
    let html = '';
    
    html += `<div class="step">`;
    html += `<div class="step-expression">${ex.expression}</div>`;
    html += `<div class="step-explanation">Expression de départ</div>`;
    html += `</div>`;
    
    html += `<div class="step">`;
    html += `<div class="step-expression">√<span class="term-red">${ex.a}</span> × √<span class="term-blue">${ex.b}</span> = √(<span class="term-red">${ex.a}</span> × <span class="term-blue">${ex.b}</span>)</div>`;
    html += `<div class="step-explanation">Propriété : √a × √b = √(a×b)</div>`;
    html += `</div>`;
    
    const product = ex.a * ex.b;
    
    html += `<div class="step">`;
    html += `<div class="step-expression">√<span class="term-green">${product}</span></div>`;
    html += `<div class="step-explanation">${ex.a} × ${ex.b} = ${product}</div>`;
    html += `</div>`;
    
    // Simplifier si possible
    const result = simplifySquareRoot(product);
    
    if (result.outside > 1) {
        html += `<div class="step">`;
        html += `<div class="step-expression">On simplifie √${product}</div>`;
        html += `<div class="step-explanation">On cherche les carrés parfaits dans ${product}</div>`;
        html += `</div>`;
        
        if (result.inside === 1) {
            html += `<div class="result-highlight"><span class="term-blue">${result.outside}</span></div>`;
        } else {
            html += `<div class="result-highlight"><span class="term-blue">${result.outside}</span>√<span class="term-green">${result.inside}</span></div>`;
        }
    } else {
        html += `<div class="result-highlight">√<span class="term-green">${product}</span></div>`;
    }
    
    return html;
}

function solveRationalisation(ex) {
    let html = '';
    
    html += `<div class="step">`;
    html += `<div class="step-expression">${createFraction('1', `√${ex.radicand}`)}</div>`;
    html += `<div class="step-explanation">Expression de départ</div>`;
    html += `</div>`;
    
    html += `<div class="step">`;
    html += `<div class="step-expression">On multiplie par ${createFraction(`<span class="term-red">√${ex.radicand}</span>`, `<span class="term-red">√${ex.radicand}</span>`)}</div>`;
    html += `<div class="step-explanation">Pour éliminer la racine au dénominateur</div>`;
    html += `</div>`;
    
    html += `<div class="step">`;
    html += `<div class="step-expression">${createFraction(`1 × <span class="term-red">√${ex.radicand}</span>`, `√${ex.radicand} × <span class="term-red">√${ex.radicand}</span>`)}</div>`;
    html += `<div class="step-explanation">Multiplication en haut et en bas</div>`;
    html += `</div>`;
    
    html += `<div class="step">`;
    html += `<div class="step-expression">${createFraction(`<span class="term-blue">√${ex.radicand}</span>`, `<span class="term-green">${ex.radicand}</span>`)}</div>`;
    html += `<div class="step-explanation">Car √${ex.radicand} × √${ex.radicand} = ${ex.radicand}</div>`;
    html += `</div>`;
    
    html += `<div class="result-highlight">${createFraction(`<span class="term-blue">√${ex.radicand}</span>`, `<span class="term-green">${ex.radicand}</span>`)}</div>`;
    
    return html;
}

function solveConjuguee(ex) {
    let html = '';
    
    const conjugateSign = ex.sign === '+' ? '−' : '+';
    const conjugate = `√${ex.radicand} ${conjugateSign} ${ex.constant}`;
    
    html += `<div class="step">`;
    html += `<div class="step-expression">${createFraction('1', `√${ex.radicand} ${ex.sign} ${ex.constant}`)}</div>`;
    html += `<div class="step-explanation">Expression de départ</div>`;
    html += `</div>`;
    
    html += `<div class="step">`;
    html += `<div class="step-expression">On multiplie par ${createFraction(`<span class="term-red">l'expression conjuguée</span>`, `<span class="term-red">${conjugate}</span>`)}</div>`;
    html += `<div class="step-explanation">Le conjugué de (√a + b) est (√a − b)</div>`;
    html += `</div>`;
    
    html += `<div class="step">`;
    html += `<div class="step-expression">${createFraction(`1 × <span class="term-red">(${conjugate})</span>`, `(√${ex.radicand} ${ex.sign} ${ex.constant}) × <span class="term-red">(${conjugate})</span>`)}</div>`;
    html += `<div class="step-explanation">Multiplication en haut et en bas</div>`;
    html += `</div>`;
    
    html += `<div class="step">`;
    html += `<div class="step-expression">${createFraction(`<span class="term-blue">${conjugate}</span>`, `(√${ex.radicand})<sup>2</sup> − ${ex.constant}<sup>2</sup>`)}</div>`;
    html += `<div class="step-explanation">Identité remarquable : (a+b)(a−b) = a² − b²</div>`;
    html += `</div>`;
    
    const denominator = ex.radicand - (ex.constant * ex.constant);
    
    html += `<div class="step">`;
    html += `<div class="step-expression">${createFraction(`<span class="term-blue">${conjugate}</span>`, `<span class="term-green">${denominator}</span>`)}</div>`;
    html += `<div class="step-explanation">Car (√${ex.radicand})² = ${ex.radicand} et ${ex.constant}² = ${ex.constant * ex.constant}</div>`;
    html += `</div>`;
    
    html += `<div class="result-highlight">${createFraction(`<span class="term-blue">${conjugate}</span>`, `<span class="term-green">${denominator}</span>`)}</div>`;
    
    return html;
}

function solveFractionConjuguee(ex) {
    let html = '';
    
    const conjugateSign = ex.sign === '+' ? '−' : '+';
    const conjugate = `√${ex.radicand} ${conjugateSign} ${ex.constant}`;
    
    html += `<div class="step">`;
    html += `<div class="step-expression">${createFraction(`${ex.numerator}`, `√${ex.radicand} ${ex.sign} ${ex.constant}`)}</div>`;
    html += `<div class="step-explanation">Expression de départ</div>`;
    html += `</div>`;
    
    html += `<div class="step">`;
    html += `<div class="step-expression">On multiplie par ${createFraction(`<span class="term-red">${conjugate}</span>`, `<span class="term-red">${conjugate}</span>`)}</div>`;
    html += `<div class="step-explanation">Expression conjuguée</div>`;
    html += `</div>`;
    
    html += `<div class="step">`;
    html += `<div class="step-expression">${createFraction(`<span class="term-orange">${ex.numerator}</span> × <span class="term-red">(${conjugate})</span>`, `(√${ex.radicand} ${ex.sign} ${ex.constant}) × <span class="term-red">(${conjugate})</span>`)}</div>`;
    html += `<div class="step-explanation">Multiplication en haut et en bas</div>`;
    html += `</div>`;
    
    html += `<div class="step">`;
    html += `<div class="step-expression">${createFraction(`<span class="term-orange">${ex.numerator}</span><span class="term-blue">(${conjugate})</span>`, `(√${ex.radicand})<sup>2</sup> − ${ex.constant}<sup>2</sup>`)}</div>`;
    html += `<div class="step-explanation">Identité remarquable : (a+b)(a−b) = a² − b²</div>`;
    html += `</div>`;
    
    const denominator = ex.radicand - (ex.constant * ex.constant);
    
    html += `<div class="step">`;
    html += `<div class="step-expression">${createFraction(`<span class="term-orange">${ex.numerator}</span><span class="term-blue">(${conjugate})</span>`, `<span class="term-green">${denominator}</span>`)}</div>`;
    html += `<div class="step-explanation">Car (√${ex.radicand})² = ${ex.radicand} et ${ex.constant}² = ${ex.constant * ex.constant}</div>`;
    html += `</div>`;
    
    // Simplifier si PGCD
    const g = gcd(ex.numerator, Math.abs(denominator));
    if (g > 1) {
        const newNum = ex.numerator / g;
        const newDen = denominator / g;
        
        html += `<div class="step">`;
        html += `<div class="step-expression">On simplifie par ${g}</div>`;
        html += `<div class="step-explanation">PGCD(${ex.numerator}, ${Math.abs(denominator)}) = ${g}</div>`;
        html += `</div>`;
        
        if (newDen === 1) {
            html += `<div class="result-highlight"><span class="term-orange">${newNum}</span><span class="term-blue">(${conjugate})</span></div>`;
        } else if (newDen === -1) {
            html += `<div class="result-highlight">−<span class="term-orange">${newNum}</span><span class="term-blue">(${conjugate})</span></div>`;
        } else {
            html += `<div class="result-highlight">${createFraction(`<span class="term-orange">${newNum}</span><span class="term-blue">(${conjugate})</span>`, `<span class="term-green">${newDen}</span>`)}</div>`;
        }
    } else {
        html += `<div class="result-highlight">${createFraction(`<span class="term-orange">${ex.numerator}</span><span class="term-blue">(${conjugate})</span>`, `<span class="term-green">${denominator}</span>`)}</div>`;
    }
    
    return html;
}
