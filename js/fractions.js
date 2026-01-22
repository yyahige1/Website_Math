/* ========================================
   FRACTIONS.JS - Logique des fractions
   ======================================== */

/**
 * État de la page fractions
 */
const FractionsState = {
    currentType: 'addition',
    currentExercise: null
};

/**
 * Récupère les valeurs depuis les inputs
 * @returns {Object}
 */
function getFractionValues() {
    const type = FractionsState.currentType;
    
    if (type === 'simplification') {
        return {
            type,
            num: parseInt($('num1').value) || 0,
            den: parseInt($('den1').value) || 1
        };
    }
    
    return {
        type,
        num1: parseInt($('num1').value) || 0,
        den1: parseInt($('den1').value) || 1,
        num2: parseInt($('num2').value) || 0,
        den2: parseInt($('den2').value) || 1
    };
}

/**
 * Met à jour l'affichage de l'exercice
 */
function updateFractionDisplay() {
    const v = getFractionValues();
    let display = '';
    
    const operators = {
        'addition': '+',
        'soustraction': '−',
        'multiplication': '×',
        'division': '÷'
    };
    
    if (v.type === 'simplification') {
        display = `<div class="fraction-display">
            <div class="frac">
                <span class="num">${v.num}</span>
                <span class="den">${v.den}</span>
            </div>
            <span class="op">=</span>
            <span class="result-placeholder">?</span>
        </div>`;
    } else {
        const op = operators[v.type];
        display = `<div class="fraction-display">
            <div class="frac">
                <span class="num">${v.num1}</span>
                <span class="den">${v.den1}</span>
            </div>
            <span class="op">${op}</span>
            <div class="frac">
                <span class="num">${v.num2}</span>
                <span class="den">${v.den2}</span>
            </div>
            <span class="op">=</span>
            <span class="result-placeholder">?</span>
        </div>`;
    }
    
    updateHTML('expressionDisplay', display);
    hideSolution();
}

/**
 * Génère un exercice aléatoire
 */
function generateFraction() {
    const type = FractionsState.currentType;
    
    if (type === 'simplification') {
        // Générer une fraction simplifiable
        const factor = randInt(2, 6);
        const num = randInt(1, 8) * factor;
        const den = randInt(2, 8) * factor;
        
        $('num1').value = num;
        $('den1').value = den;
    } else if (type === 'addition' || type === 'soustraction') {
        // Dénominateurs pas trop grands pour PPCM raisonnable
        const den1 = randInt(2, 10);
        const den2 = randInt(2, 10);
        const num1 = randInt(1, 9);
        let num2 = randInt(1, 9);
        
        // Pour soustraction, éviter résultat négatif (optionnel)
        if (type === 'soustraction') {
            const ppcm = lcm(den1, den2);
            const newNum1 = num1 * (ppcm / den1);
            const newNum2 = num2 * (ppcm / den2);
            if (newNum2 > newNum1) {
                num2 = Math.floor(num1 * den2 / den1);
                if (num2 < 1) num2 = 1;
            }
        }
        
        $('num1').value = num1;
        $('den1').value = den1;
        $('num2').value = num2;
        $('den2').value = den2;
    } else {
        // Multiplication et division
        $('num1').value = randInt(1, 9);
        $('den1').value = randInt(2, 9);
        $('num2').value = randInt(1, 9);
        $('den2').value = randInt(2, 9);
    }
    
    updateFractionDisplay();
}

/**
 * Résout l'exercice de fraction
 */
function solveFraction() {
    const v = getFractionValues();
    let html = '';
    
    switch (v.type) {
        case 'addition':
            html = solveAddition(v.num1, v.den1, v.num2, v.den2);
            break;
        case 'soustraction':
            html = solveSoustraction(v.num1, v.den1, v.num2, v.den2);
            break;
        case 'multiplication':
            html = solveMultiplication(v.num1, v.den1, v.num2, v.den2);
            break;
        case 'division':
            html = solveDivision(v.num1, v.den1, v.num2, v.den2);
            break;
        case 'simplification':
            html = solveSimplification(v.num, v.den);
            break;
    }
    
    updateHTML('stepsContainer', html);
    showSolution();
}

/**
 * Calcule le PPCM de deux nombres
 */
function lcm(a, b) {
    return Math.abs(a * b) / gcd(a, b);
}

/**
 * Crée le HTML d'une fraction
 */
function fracHTML(num, den, highlight = false) {
    const cls = highlight ? 'frac frac-highlight' : 'frac';
    return `<span class="${cls}"><span class="num">${num}</span><span class="den">${den}</span></span>`;
}

/**
 * Résout une addition de fractions
 */
function solveAddition(num1, den1, num2, den2) {
    let html = '';
    
    // Étape 1 : Afficher l'opération
    html += createStepHTML({
        expression: `${fracHTML(num1, den1)} + ${fracHTML(num2, den2)}`,
        explanation: 'Addition de fractions'
    });
    
    // Cas même dénominateur
    if (den1 === den2) {
        const resultNum = num1 + num2;
        html += createStepHTML({
            expression: `${fracHTML(num1 + ' + ' + num2, den1)} = ${fracHTML(resultNum, den1)}`,
            explanation: 'Même dénominateur : on additionne les numérateurs'
        });
        
        // Simplification si possible
        html += simplifyStep(resultNum, den1);
        return html;
    }
    
    // Trouver le PPCM
    const ppcm = lcm(den1, den2);
    const mult1 = ppcm / den1;
    const mult2 = ppcm / den2;
    
    html += createStepHTML({
        expression: `PPCM(${den1}, ${den2}) = ${ppcm}`,
        explanation: 'Trouver le dénominateur commun (PPCM)'
    });
    
    // Mettre au même dénominateur
    const newNum1 = num1 * mult1;
    const newNum2 = num2 * mult2;
    
    html += createStepHTML({
        expression: `${fracHTML(num1 + '×' + mult1, den1 + '×' + mult1)} + ${fracHTML(num2 + '×' + mult2, den2 + '×' + mult2)} = ${fracHTML(newNum1, ppcm)} + ${fracHTML(newNum2, ppcm)}`,
        explanation: 'Mettre au même dénominateur'
    });
    
    // Additionner
    const resultNum = newNum1 + newNum2;
    html += createStepHTML({
        expression: `${fracHTML(newNum1 + ' + ' + newNum2, ppcm)} = ${fracHTML(resultNum, ppcm)}`,
        explanation: 'Additionner les numérateurs'
    });
    
    // Simplifier
    html += simplifyStep(resultNum, ppcm);
    
    return html;
}

/**
 * Résout une soustraction de fractions
 */
function solveSoustraction(num1, den1, num2, den2) {
    let html = '';
    
    html += createStepHTML({
        expression: `${fracHTML(num1, den1)} − ${fracHTML(num2, den2)}`,
        explanation: 'Soustraction de fractions'
    });
    
    // Cas même dénominateur
    if (den1 === den2) {
        const resultNum = num1 - num2;
        html += createStepHTML({
            expression: `${fracHTML(num1 + ' − ' + num2, den1)} = ${fracHTML(resultNum, den1)}`,
            explanation: 'Même dénominateur : on soustrait les numérateurs'
        });
        
        html += simplifyStep(resultNum, den1);
        return html;
    }
    
    // PPCM
    const ppcm = lcm(den1, den2);
    const mult1 = ppcm / den1;
    const mult2 = ppcm / den2;
    
    html += createStepHTML({
        expression: `PPCM(${den1}, ${den2}) = ${ppcm}`,
        explanation: 'Trouver le dénominateur commun (PPCM)'
    });
    
    const newNum1 = num1 * mult1;
    const newNum2 = num2 * mult2;
    
    html += createStepHTML({
        expression: `${fracHTML(newNum1, ppcm)} − ${fracHTML(newNum2, ppcm)}`,
        explanation: 'Mettre au même dénominateur'
    });
    
    const resultNum = newNum1 - newNum2;
    html += createStepHTML({
        expression: `${fracHTML(newNum1 + ' − ' + newNum2, ppcm)} = ${fracHTML(resultNum, ppcm)}`,
        explanation: 'Soustraire les numérateurs'
    });
    
    html += simplifyStep(resultNum, ppcm);
    
    return html;
}

/**
 * Résout une multiplication de fractions
 */
function solveMultiplication(num1, den1, num2, den2) {
    let html = '';
    
    html += createStepHTML({
        expression: `${fracHTML(num1, den1)} × ${fracHTML(num2, den2)}`,
        explanation: 'Multiplication de fractions'
    });
    
    html += createStepHTML({
        expression: `${fracHTML(num1 + ' × ' + num2, den1 + ' × ' + den2)}`,
        explanation: 'Multiplier numérateurs entre eux et dénominateurs entre eux'
    });
    
    const resultNum = num1 * num2;
    const resultDen = den1 * den2;
    
    html += createStepHTML({
        expression: `${fracHTML(resultNum, resultDen)}`,
        explanation: 'Calculer'
    });
    
    html += simplifyStep(resultNum, resultDen);
    
    return html;
}

/**
 * Résout une division de fractions
 */
function solveDivision(num1, den1, num2, den2) {
    let html = '';
    
    html += createStepHTML({
        expression: `${fracHTML(num1, den1)} ÷ ${fracHTML(num2, den2)}`,
        explanation: 'Division de fractions'
    });
    
    html += createStepHTML({
        expression: `${fracHTML(num1, den1)} × ${fracHTML(den2, num2)}`,
        explanation: '<strong>Règle :</strong> Diviser = multiplier par l\'inverse'
    });
    
    html += createStepHTML({
        expression: `${fracHTML(num1 + ' × ' + den2, den1 + ' × ' + num2)}`,
        explanation: 'Multiplier numérateurs et dénominateurs'
    });
    
    const resultNum = num1 * den2;
    const resultDen = den1 * num2;
    
    html += createStepHTML({
        expression: `${fracHTML(resultNum, resultDen)}`,
        explanation: 'Calculer'
    });
    
    html += simplifyStep(resultNum, resultDen);
    
    return html;
}

/**
 * Résout une simplification de fraction
 */
function solveSimplification(num, den) {
    let html = '';
    
    html += createStepHTML({
        expression: `${fracHTML(num, den)}`,
        explanation: 'Simplifier cette fraction'
    });
    
    const divisor = gcd(Math.abs(num), Math.abs(den));
    
    if (divisor === 1) {
        html += createAlertHTML('info', 'Cette fraction est déjà irréductible (PGCD = 1)');
        html += createResultHTML(fracHTML(num, den, true));
        return html;
    }
    
    html += createStepHTML({
        expression: `PGCD(${Math.abs(num)}, ${Math.abs(den)}) = ${divisor}`,
        explanation: 'Trouver le PGCD des deux nombres'
    });
    
    const newNum = num / divisor;
    const newDen = den / divisor;
    
    html += createStepHTML({
        expression: `${fracHTML(num + ' ÷ ' + divisor, den + ' ÷ ' + divisor)} = ${fracHTML(newNum, newDen)}`,
        explanation: 'Diviser numérateur et dénominateur par le PGCD'
    });
    
    html += createResultHTML(fracHTML(newNum, newDen, true));
    
    return html;
}

/**
 * Étape de simplification finale (si possible)
 */
function simplifyStep(num, den) {
    let html = '';
    const divisor = gcd(Math.abs(num), Math.abs(den));
    
    // Gérer le signe
    let finalNum = num;
    let finalDen = den;
    if (finalDen < 0) {
        finalNum = -finalNum;
        finalDen = -finalDen;
    }
    
    if (divisor > 1) {
        const simpNum = finalNum / divisor;
        const simpDen = finalDen / divisor;
        
        html += createStepHTML({
            expression: `${fracHTML(finalNum, finalDen)} = ${fracHTML(finalNum + ' ÷ ' + divisor, finalDen + ' ÷ ' + divisor)} = ${fracHTML(simpNum, simpDen)}`,
            explanation: `Simplifier par ${divisor} (PGCD)`
        });
        
        finalNum = simpNum;
        finalDen = simpDen;
    }
    
    // Résultat final
    if (finalDen === 1) {
        html += createResultHTML(`<span class="final-number">${finalNum}</span>`);
    } else {
        html += createResultHTML(fracHTML(finalNum, finalDen, true));
    }
    
    return html;
}

/**
 * Change le type d'opération
 * @param {string} type 
 */
function changeFractionType(type) {
    FractionsState.currentType = type;
    
    // Afficher/masquer la deuxième fraction
    const isSimplification = type === 'simplification';
    toggleClass('fraction2Group', 'hidden', isSimplification);
    
    // Mettre à jour le label
    const labels = {
        'addition': 'Fraction 1',
        'soustraction': 'Fraction 1',
        'multiplication': 'Fraction 1',
        'division': 'Fraction 1',
        'simplification': 'Fraction à simplifier'
    };
    updateText('fraction1Label', labels[type]);
    
    updateFractionDisplay();
}

/**
 * Initialise la page fractions
 */
function initFractionsPage() {
    initTypeSelector('.type-btn', changeFractionType);
    
    $('generateBtn').addEventListener('click', generateFraction);
    $('solveBtn').addEventListener('click', solveFraction);
    
    document.querySelectorAll('input').forEach(el => {
        el.addEventListener('input', updateFractionDisplay);
    });
    
    updateFractionDisplay();
}

// Export pour les tests
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        lcm,
        solveAddition,
        solveSoustraction,
        solveMultiplication,
        solveDivision,
        solveSimplification
    };
}
