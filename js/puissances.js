// Fichier: js/puissances.js
// Module Puissances - Respecte l'architecture MathsFacile

const PuissancesState = {
    currentType: 1,
    currentExercise: null
};

/**
 * Initialise la page Puissances
 */
function initPuissancesPage() {
    // Gestion des boutons de type
    const typeButtons = document.querySelectorAll('.type-btn');
    typeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            typeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            PuissancesState.currentType = parseInt(btn.dataset.type);
            generatePuissance();
        });
    });

    // Bouton générer
    const generateBtn = document.getElementById('generateBtn');
    if (generateBtn) {
        generateBtn.addEventListener('click', generatePuissance);
    }

    // Bouton correction
    const solveBtn = document.getElementById('solveBtn');
    if (solveBtn) {
        solveBtn.addEventListener('click', solvePuissance);
    }

    // Générer le premier exercice
    generatePuissance();
}

/**
 * Génère un exercice selon le type actuel
 */
function generatePuissance() {
    const type = PuissancesState.currentType;
    let exercise;

    switch(type) {
        case 1: exercise = genProduct(); break;
        case 2: exercise = genQuotient(); break;
        case 3: exercise = genPower(); break;
        case 4: exercise = genProductPower(); break;
        case 5: exercise = genScientific(); break;
        case 6: exercise = genCombined(); break;
        default: exercise = genProduct();
    }

    PuissancesState.currentExercise = exercise;
    updateDisplay();
    hideSolution();
}

/**
 * Met à jour l'affichage de l'exercice
 */
function updateDisplay() {
    const display = document.getElementById('expressionDisplay');
    if (display && PuissancesState.currentExercise) {
        display.innerHTML = PuissancesState.currentExercise.expression;
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
function solvePuissance() {
    const ex = PuissancesState.currentExercise;
    if (!ex) return;

    let html = '';

    switch(ex.type) {
        case 1: html = solveProduct(ex); break;
        case 2: html = solveQuotient(ex); break;
        case 3: html = solvePower(ex); break;
        case 4: html = solveProductPower(ex); break;
        case 5: html = solveScientific(ex); break;
        case 6: html = solveCombined(ex); break;
    }

    const container = document.getElementById('stepsContainer');
    const solutionDiv = document.getElementById('solutionDiv');
    
    if (container) container.innerHTML = html;
    if (solutionDiv) solutionDiv.style.display = 'block';
}

// ============= GÉNÉRATION D'EXERCICES =============

function genProduct() {
    const base = randInt(2, 10);
    const exp1 = randInt(2, 6);
    const exp2 = randInt(2, 6);
    
    return {
        type: 1,
        base: base,
        exp1: exp1,
        exp2: exp2,
        expression: `${base}<sup>${exp1}</sup> × ${base}<sup>${exp2}</sup>`,
        result: exp1 + exp2
    };
}

function genQuotient() {
    const base = randInt(2, 10);
    const exp1 = randInt(5, 10);
    const exp2 = randInt(2, exp1 - 1);
    
    return {
        type: 2,
        base: base,
        exp1: exp1,
        exp2: exp2,
        expression: `${base}<sup>${exp1}</sup> ÷ ${base}<sup>${exp2}</sup>`,
        result: exp1 - exp2
    };
}

function genPower() {
    const base = randInt(2, 5);
    const exp1 = randInt(2, 4);
    const exp2 = randInt(2, 4);
    
    return {
        type: 3,
        base: base,
        exp1: exp1,
        exp2: exp2,
        expression: `(${base}<sup>${exp1}</sup>)<sup>${exp2}</sup>`,
        result: exp1 * exp2
    };
}

function genProductPower() {
    const base1 = randInt(2, 5);
    const base2 = randInt(2, 5);
    const exp = randInt(2, 5);
    
    return {
        type: 4,
        base1: base1,
        base2: base2,
        exp: exp,
        expression: `(${base1} × ${base2})<sup>${exp}</sup>`,
        resultExp: exp
    };
}

function genScientific() {
    const operation = Math.random() < 0.5 ? 'mult' : 'div';
    const coef1 = (randInt(10, 99) / 10);
    const coef2 = (randInt(10, 99) / 10);
    const exp1 = randInt(-3, 8);
    const exp2 = randInt(-3, 8);
    
    const sign = operation === 'mult' ? '×' : '÷';
    
    return {
        type: 5,
        operation: operation,
        coef1: coef1,
        coef2: coef2,
        exp1: exp1,
        exp2: exp2,
        expression: `(${coef1.toFixed(1)} × 10<sup>${exp1}</sup>) ${sign} (${coef2.toFixed(1)} × 10<sup>${exp2}</sup>)`
    };
}

function genCombined() {
    const base = randInt(2, 5);
    const exp1 = randInt(2, 4);
    const exp2 = randInt(2, 4);
    const exp3 = randInt(1, 3);
    
    return {
        type: 6,
        base: base,
        exp1: exp1,
        exp2: exp2,
        exp3: exp3,
        expression: `${base}<sup>${exp1}</sup> × ${base}<sup>${exp2}</sup> ÷ ${base}<sup>${exp3}</sup>`,
        result: exp1 + exp2 - exp3
    };
}

// ============= RÉSOLUTION =============

function solveProduct(ex) {
    let html = '';
    
    html += `<div class="step">`;
    html += `<div class="step-expression">${ex.expression}</div>`;
    html += `<div class="step-explanation">Expression de départ</div>`;
    html += `</div>`;
    
    html += `<div class="step">`;
    html += `<div class="step-expression">On applique : a<sup>m</sup> × a<sup>n</sup> = a<sup>m+n</sup></div>`;
    html += `<div class="step-explanation">Produit de puissances de même base</div>`;
    html += `</div>`;
    
    html += `<div class="step">`;
    html += `<div class="step-expression">${ex.base}<sup>${ex.exp1}+${ex.exp2}</sup> = ${ex.base}<sup>${ex.result}</sup></div>`;
    html += `<div class="step-explanation">On additionne les exposants</div>`;
    html += `</div>`;
    
    const numResult = Math.pow(ex.base, ex.result);
    if (ex.result <= 10 && numResult <= 100000) {
        html += `<div class="result-highlight">${ex.base}<sup>${ex.result}</sup> = ${numResult}</div>`;
    } else {
        html += `<div class="result-highlight">${ex.base}<sup>${ex.result}</sup></div>`;
    }
    
    return html;
}

function solveQuotient(ex) {
    let html = '';
    
    html += `<div class="step">`;
    html += `<div class="step-expression">${ex.expression}</div>`;
    html += `<div class="step-explanation">Expression de départ</div>`;
    html += `</div>`;
    
    html += `<div class="step">`;
    html += `<div class="step-expression">On applique : a<sup>m</sup> ÷ a<sup>n</sup> = a<sup>m−n</sup></div>`;
    html += `<div class="step-explanation">Quotient de puissances de même base</div>`;
    html += `</div>`;
    
    html += `<div class="step">`;
    html += `<div class="step-expression">${ex.base}<sup>${ex.exp1}−${ex.exp2}</sup> = ${ex.base}<sup>${ex.result}</sup></div>`;
    html += `<div class="step-explanation">On soustrait les exposants</div>`;
    html += `</div>`;
    
    const numResult = Math.pow(ex.base, ex.result);
    if (ex.result <= 8 && numResult <= 100000) {
        html += `<div class="result-highlight">${ex.base}<sup>${ex.result}</sup> = ${numResult}</div>`;
    } else {
        html += `<div class="result-highlight">${ex.base}<sup>${ex.result}</sup></div>`;
    }
    
    return html;
}

function solvePower(ex) {
    let html = '';
    
    html += `<div class="step">`;
    html += `<div class="step-expression">${ex.expression}</div>`;
    html += `<div class="step-explanation">Expression de départ</div>`;
    html += `</div>`;
    
    html += `<div class="step">`;
    html += `<div class="step-expression">On applique : (a<sup>m</sup>)<sup>n</sup> = a<sup>m×n</sup></div>`;
    html += `<div class="step-explanation">Puissance de puissance</div>`;
    html += `</div>`;
    
    html += `<div class="step">`;
    html += `<div class="step-expression">${ex.base}<sup>${ex.exp1}×${ex.exp2}</sup> = ${ex.base}<sup>${ex.result}</sup></div>`;
    html += `<div class="step-explanation">On multiplie les exposants</div>`;
    html += `</div>`;
    
    const numResult = Math.pow(ex.base, ex.result);
    if (ex.result <= 10 && numResult <= 100000) {
        html += `<div class="result-highlight">${ex.base}<sup>${ex.result}</sup> = ${numResult}</div>`;
    } else {
        html += `<div class="result-highlight">${ex.base}<sup>${ex.result}</sup></div>`;
    }
    
    return html;
}

function solveProductPower(ex) {
    let html = '';
    
    html += `<div class="step">`;
    html += `<div class="step-expression">${ex.expression}</div>`;
    html += `<div class="step-explanation">Expression de départ</div>`;
    html += `</div>`;
    
    html += `<div class="step">`;
    html += `<div class="step-expression">On applique : (ab)<sup>n</sup> = a<sup>n</sup> × b<sup>n</sup></div>`;
    html += `<div class="step-explanation">Puissance d'un produit</div>`;
    html += `</div>`;
    
    const result = `${ex.base1}<sup>${ex.exp}</sup> × ${ex.base2}<sup>${ex.exp}</sup>`;
    html += `<div class="step">`;
    html += `<div class="step-expression">${result}</div>`;
    html += `<div class="step-explanation">Résultat développé</div>`;
    html += `</div>`;
    
    const num1 = Math.pow(ex.base1, ex.exp);
    const num2 = Math.pow(ex.base2, ex.exp);
    if (ex.exp <= 5 && num1 <= 10000 && num2 <= 10000) {
        html += `<div class="result-highlight">${result} = ${num1} × ${num2} = ${num1 * num2}</div>`;
    } else {
        html += `<div class="result-highlight">${result}</div>`;
    }
    
    return html;
}

function solveScientific(ex) {
    let html = '';
    
    html += `<div class="step">`;
    html += `<div class="step-expression">${ex.expression}</div>`;
    html += `<div class="step-explanation">Expression de départ</div>`;
    html += `</div>`;
    
    if (ex.operation === 'mult') {
        const newCoef = ex.coef1 * ex.coef2;
        const newExp = ex.exp1 + ex.exp2;
        
        html += `<div class="step">`;
        html += `<div class="step-expression">(${ex.coef1.toFixed(1)} × ${ex.coef2.toFixed(1)}) × (10<sup>${ex.exp1}</sup> × 10<sup>${ex.exp2}</sup>)</div>`;
        html += `<div class="step-explanation">On regroupe coefficients et puissances de 10</div>`;
        html += `</div>`;
        
        html += `<div class="step">`;
        html += `<div class="step-expression">${newCoef.toFixed(2)} × 10<sup>${newExp}</sup></div>`;
        html += `<div class="step-explanation">On multiplie et on additionne les exposants</div>`;
        html += `</div>`;
        
        if (newCoef >= 10) {
            const adj = newCoef / 10;
            html += `<div class="result-highlight">${adj.toFixed(1)} × 10<sup>${newExp + 1}</sup></div>`;
        } else if (newCoef < 1) {
            const adj = newCoef * 10;
            html += `<div class="result-highlight">${adj.toFixed(1)} × 10<sup>${newExp - 1}</sup></div>`;
        } else {
            html += `<div class="result-highlight">${newCoef.toFixed(1)} × 10<sup>${newExp}</sup></div>`;
        }
    } else {
        const newCoef = ex.coef1 / ex.coef2;
        const newExp = ex.exp1 - ex.exp2;
        
        html += `<div class="step">`;
        html += `<div class="step-expression">(${ex.coef1.toFixed(1)} ÷ ${ex.coef2.toFixed(1)}) × (10<sup>${ex.exp1}</sup> ÷ 10<sup>${ex.exp2}</sup>)</div>`;
        html += `<div class="step-explanation">On regroupe coefficients et puissances de 10</div>`;
        html += `</div>`;
        
        html += `<div class="step">`;
        html += `<div class="step-expression">${newCoef.toFixed(2)} × 10<sup>${newExp}</sup></div>`;
        html += `<div class="step-explanation">On divise et on soustrait les exposants</div>`;
        html += `</div>`;
        
        if (newCoef >= 10) {
            const adj = newCoef / 10;
            html += `<div class="result-highlight">${adj.toFixed(1)} × 10<sup>${newExp + 1}</sup></div>`;
        } else if (newCoef < 1) {
            const adj = newCoef * 10;
            html += `<div class="result-highlight">${adj.toFixed(1)} × 10<sup>${newExp - 1}</sup></div>`;
        } else {
            html += `<div class="result-highlight">${newCoef.toFixed(1)} × 10<sup>${newExp}</sup></div>`;
        }
    }
    
    return html;
}

function solveCombined(ex) {
    let html = '';
    
    html += `<div class="step">`;
    html += `<div class="step-expression">${ex.expression}</div>`;
    html += `<div class="step-explanation">Expression de départ</div>`;
    html += `</div>`;
    
    html += `<div class="step">`;
    html += `<div class="step-expression">${ex.base}<sup>${ex.exp1}+${ex.exp2}−${ex.exp3}</sup></div>`;
    html += `<div class="step-explanation">Produit → addition, Quotient → soustraction</div>`;
    html += `</div>`;
    
    const sum = ex.exp1 + ex.exp2;
    html += `<div class="step">`;
    html += `<div class="step-expression">${ex.base}<sup>${sum}−${ex.exp3}</sup></div>`;
    html += `<div class="step-explanation">${ex.exp1} + ${ex.exp2} = ${sum}</div>`;
    html += `</div>`;
    
    html += `<div class="step">`;
    html += `<div class="step-expression">${ex.base}<sup>${ex.result}</sup></div>`;
    html += `<div class="step-explanation">${sum} − ${ex.exp3} = ${ex.result}</div>`;
    html += `</div>`;
    
    const numResult = Math.pow(ex.base, ex.result);
    if (ex.result <= 10 && numResult <= 100000) {
        html += `<div class="result-highlight">${ex.base}<sup>${ex.result}</sup> = ${numResult}</div>`;
    } else {
        html += `<div class="result-highlight">${ex.base}<sup>${ex.result}</sup></div>`;
    }
    
    return html;
}
