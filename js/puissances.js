// Fichier: js/puissances.js
// Module Puissances - Respecte l'architecture MathsFacile

const PuissancesState = {
    currentType: 1,
    currentExercise: null
};

/**
 * Crée une fraction verticale en HTML
 */
function createFraction(numerator, denominator) {
    return `<div class="fraction-inline">
        <span class="fraction-num">${numerator}</span>
        <span class="fraction-line"></span>
        <span class="fraction-den">${denominator}</span>
    </div>`;
}

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
        expression: createFraction(`${base}<sup>${exp1}</sup>`, `${base}<sup>${exp2}</sup>`),
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
    
    if (operation === 'mult') {
        return {
            type: 5,
            operation: 'mult',
            coef1: coef1,
            coef2: coef2,
            exp1: exp1,
            exp2: exp2,
            expression: `(${coef1.toFixed(1)} × 10<sup>${exp1}</sup>) × (${coef2.toFixed(1)} × 10<sup>${exp2}</sup>)`
        };
    } else {
        return {
            type: 5,
            operation: 'div',
            coef1: coef1,
            coef2: coef2,
            exp1: exp1,
            exp2: exp2,
            expression: createFraction(
                `${coef1.toFixed(1)} × 10<sup>${exp1}</sup>`,
                `${coef2.toFixed(1)} × 10<sup>${exp2}</sup>`
            )
        };
    }
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
        expression: createFraction(
            `${base}<sup>${exp1}</sup> × ${base}<sup>${exp2}</sup>`,
            `${base}<sup>${exp3}</sup>`
        ),
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
    html += `<div class="step-expression">Les deux puissances ont la même <span class="term-green">base : ${ex.base}</span></div>`;
    html += `<div class="step-explanation">On peut appliquer la règle du produit</div>`;
    html += `</div>`;
    
    html += `<div class="step">`;
    html += `<div class="step-expression">Règle : <span class="term-red">a<sup>m</sup> × a<sup>n</sup> = a<sup>m+n</sup></span></div>`;
    html += `<div class="step-explanation">Quand on multiplie, on additionne les exposants</div>`;
    html += `</div>`;
    
    html += `<div class="step">`;
    html += `<div class="step-expression"><span class="term-green">${ex.base}</span><sup><span class="term-blue">${ex.exp1}</span>+<span class="term-blue">${ex.exp2}</span></sup></div>`;
    html += `<div class="step-explanation">On additionne les exposants</div>`;
    html += `</div>`;
    
    html += `<div class="step">`;
    html += `<div class="step-expression"><span class="term-green">${ex.base}</span><sup><span class="term-orange">${ex.result}</span></sup></div>`;
    html += `<div class="step-explanation">Car <span class="term-blue">${ex.exp1}</span> + <span class="term-blue">${ex.exp2}</span> = <span class="term-orange">${ex.result}</span></div>`;
    html += `</div>`;
    
    const numericResult = Math.pow(ex.base, ex.result);
    if (ex.result <= 10 && numericResult <= 100000) {
        html += `<div class="step">`;
        html += `<div class="step-expression">Calcul de la valeur numérique</div>`;
        html += `<div class="step-explanation">${ex.base}<sup>${ex.result}</sup> = ${ex.base} × ${ex.base} × ... (${ex.result} fois)</div>`;
        html += `</div>`;
        
        html += `<div class="result-highlight"><span class="term-green">${ex.base}</span><sup><span class="term-orange">${ex.result}</span></sup> = <span class="term-blue">${numericResult}</span></div>`;
    } else {
        html += `<div class="result-highlight"><span class="term-green">${ex.base}</span><sup><span class="term-orange">${ex.result}</span></sup></div>`;
    }
    
    return html;
}

function solveQuotient(ex) {
    let html = '';
    
    html += `<div class="step">`;
    html += `<div class="step-expression">${createFraction(`${ex.base}<sup>${ex.exp1}</sup>`, `${ex.base}<sup>${ex.exp2}</sup>`)}</div>`;
    html += `<div class="step-explanation">Expression de départ</div>`;
    html += `</div>`;
    
    html += `<div class="step">`;
    html += `<div class="step-expression">Les deux puissances ont la même <span class="term-green">base : ${ex.base}</span></div>`;
    html += `<div class="step-explanation">On peut appliquer la règle du quotient</div>`;
    html += `</div>`;
    
    html += `<div class="step">`;
    html += `<div class="step-expression">Règle : ${createFraction(`<span class="term-red">a<sup>m</sup></span>`, `<span class="term-red">a<sup>n</sup></span>`)} = <span class="term-red">a<sup>m−n</sup></span></div>`;
    html += `<div class="step-explanation">Quand on divise, on soustrait les exposants</div>`;
    html += `</div>`;
    
    html += `<div class="step">`;
    html += `<div class="step-expression"><span class="term-green">${ex.base}</span><sup><span class="term-blue">${ex.exp1}</span>−<span class="term-blue">${ex.exp2}</span></sup></div>`;
    html += `<div class="step-explanation">On soustrait les exposants</div>`;
    html += `</div>`;
    
    html += `<div class="step">`;
    html += `<div class="step-expression"><span class="term-green">${ex.base}</span><sup><span class="term-orange">${ex.result}</span></sup></div>`;
    html += `<div class="step-explanation">Car <span class="term-blue">${ex.exp1}</span> − <span class="term-blue">${ex.exp2}</span> = <span class="term-orange">${ex.result}</span></div>`;
    html += `</div>`;
    
    const numericResult = Math.pow(ex.base, ex.result);
    if (ex.result <= 8 && numericResult <= 100000) {
        html += `<div class="step">`;
        html += `<div class="step-expression">Calcul de la valeur numérique</div>`;
        html += `<div class="step-explanation">${ex.base}<sup>${ex.result}</sup> = ${numericResult}</div>`;
        html += `</div>`;
        
        html += `<div class="result-highlight"><span class="term-green">${ex.base}</span><sup><span class="term-orange">${ex.result}</span></sup> = <span class="term-blue">${numericResult}</span></div>`;
    } else {
        html += `<div class="result-highlight"><span class="term-green">${ex.base}</span><sup><span class="term-orange">${ex.result}</span></sup></div>`;
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
    html += `<div class="step-expression">On a une <span class="term-red">puissance d'une puissance</span></div>`;
    html += `<div class="step-explanation">La base est ${ex.base}, l'exposant interne est ${ex.exp1}, l'exposant externe est ${ex.exp2}</div>`;
    html += `</div>`;
    
    html += `<div class="step">`;
    html += `<div class="step-expression">Règle : <span class="term-red">(a<sup>m</sup>)<sup>n</sup> = a<sup>m×n</sup></span></div>`;
    html += `<div class="step-explanation">On multiplie les exposants</div>`;
    html += `</div>`;
    
    html += `<div class="step">`;
    html += `<div class="step-expression"><span class="term-green">${ex.base}</span><sup><span class="term-blue">${ex.exp1}</span>×<span class="term-blue">${ex.exp2}</span></sup></div>`;
    html += `<div class="step-explanation">On multiplie les exposants entre eux</div>`;
    html += `</div>`;
    
    html += `<div class="step">`;
    html += `<div class="step-expression"><span class="term-green">${ex.base}</span><sup><span class="term-orange">${ex.result}</span></sup></div>`;
    html += `<div class="step-explanation">Car <span class="term-blue">${ex.exp1}</span> × <span class="term-blue">${ex.exp2}</span> = <span class="term-orange">${ex.result}</span></div>`;
    html += `</div>`;
    
    const numericResult = Math.pow(ex.base, ex.result);
    if (ex.result <= 10 && numericResult <= 100000) {
        html += `<div class="step">`;
        html += `<div class="step-expression">Calcul de la valeur numérique</div>`;
        html += `<div class="step-explanation">${ex.base}<sup>${ex.result}</sup> = ${numericResult}</div>`;
        html += `</div>`;
        
        html += `<div class="result-highlight"><span class="term-green">${ex.base}</span><sup><span class="term-orange">${ex.result}</span></sup> = <span class="term-blue">${numericResult}</span></div>`;
    } else {
        html += `<div class="result-highlight"><span class="term-green">${ex.base}</span><sup><span class="term-orange">${ex.result}</span></sup></div>`;
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
    html += `<div class="step-expression">On a un <span class="term-red">produit élevé à une puissance</span></div>`;
    html += `<div class="step-explanation">Les bases sont ${ex.base1} et ${ex.base2}, l'exposant est ${ex.exp}</div>`;
    html += `</div>`;
    
    html += `<div class="step">`;
    html += `<div class="step-expression">Règle : <span class="term-red">(ab)<sup>n</sup> = a<sup>n</sup> × b<sup>n</sup></span></div>`;
    html += `<div class="step-explanation">Chaque facteur est élevé à la puissance</div>`;
    html += `</div>`;
    
    const result = `<span class="term-blue">${ex.base1}<sup>${ex.exp}</sup></span> × <span class="term-green">${ex.base2}<sup>${ex.exp}</sup></span>`;
    
    html += `<div class="step">`;
    html += `<div class="step-expression">${result}</div>`;
    html += `<div class="step-explanation">On applique l'exposant à chaque base</div>`;
    html += `</div>`;
    
    const num1 = Math.pow(ex.base1, ex.exp);
    const num2 = Math.pow(ex.base2, ex.exp);
    
    if (ex.exp <= 5 && num1 <= 10000 && num2 <= 10000) {
        html += `<div class="step">`;
        html += `<div class="step-expression">Calcul des valeurs numériques</div>`;
        html += `<div class="step-explanation"><span class="term-blue">${ex.base1}<sup>${ex.exp}</sup> = ${num1}</span> et <span class="term-green">${ex.base2}<sup>${ex.exp}</sup> = ${num2}</span></div>`;
        html += `</div>`;
        
        html += `<div class="step">`;
        html += `<div class="step-expression"><span class="term-blue">${num1}</span> × <span class="term-green">${num2}</span></div>`;
        html += `<div class="step-explanation">On multiplie les résultats</div>`;
        html += `</div>`;
        
        html += `<div class="result-highlight"><span class="term-orange">${num1 * num2}</span></div>`;
    } else {
        html += `<div class="result-highlight">${result}</div>`;
    }
    
    return html;
}

function solveScientific(ex) {
    let html = '';
    
    if (ex.operation === 'mult') {
        html += `<div class="step">`;
        html += `<div class="step-expression">${ex.expression}</div>`;
        html += `<div class="step-explanation">Expression de départ</div>`;
        html += `</div>`;
        
        html += `<div class="step">`;
        html += `<div class="step-expression">On regroupe : (<span class="term-blue">${ex.coef1.toFixed(1)}</span> × <span class="term-blue">${ex.coef2.toFixed(1)}</span>) × (10<sup><span class="term-green">${ex.exp1}</span></sup> × 10<sup><span class="term-green">${ex.exp2}</span></sup>)</div>`;
        html += `<div class="step-explanation">On sépare les coefficients et les puissances de 10</div>`;
        html += `</div>`;
        
        const newCoef = ex.coef1 * ex.coef2;
        const newExp = ex.exp1 + ex.exp2;
        
        html += `<div class="step">`;
        html += `<div class="step-expression"><span class="term-orange">${newCoef.toFixed(2)}</span> × 10<sup><span class="term-red">${newExp}</span></sup></div>`;
        html += `<div class="step-explanation">Coefficients : <span class="term-blue">${ex.coef1.toFixed(1)} × ${ex.coef2.toFixed(1)} = ${newCoef.toFixed(2)}</span>, Exposants : <span class="term-green">${ex.exp1} + ${ex.exp2} = ${newExp}</span></div>`;
        html += `</div>`;
        
        // Ajustement notation scientifique
        if (newCoef >= 10) {
            const adj = newCoef / 10;
            const adjExp = newExp + 1;
            html += `<div class="step">`;
            html += `<div class="step-expression">Ajustement pour notation scientifique (1 ≤ coef < 10)</div>`;
            html += `<div class="step-explanation">${newCoef.toFixed(2)} = ${adj.toFixed(1)} × 10, donc on ajoute 1 à l'exposant</div>`;
            html += `</div>`;
            html += `<div class="result-highlight"><span class="term-orange">${adj.toFixed(1)}</span> × 10<sup><span class="term-red">${adjExp}</span></sup></div>`;
        } else if (newCoef < 1) {
            const adj = newCoef * 10;
            const adjExp = newExp - 1;
            html += `<div class="step">`;
            html += `<div class="step-expression">Ajustement pour notation scientifique (1 ≤ coef < 10)</div>`;
            html += `<div class="step-explanation">${newCoef.toFixed(2)} = ${adj.toFixed(1)} ÷ 10, donc on retire 1 à l'exposant</div>`;
            html += `</div>`;
            html += `<div class="result-highlight"><span class="term-orange">${adj.toFixed(1)}</span> × 10<sup><span class="term-red">${adjExp}</span></sup></div>`;
        } else {
            html += `<div class="result-highlight"><span class="term-orange">${newCoef.toFixed(1)}</span> × 10<sup><span class="term-red">${newExp}</span></sup></div>`;
        }
    } else {
        // Division
        html += `<div class="step">`;
        html += `<div class="step-expression">${createFraction(`${ex.coef1.toFixed(1)} × 10<sup>${ex.exp1}</sup>`, `${ex.coef2.toFixed(1)} × 10<sup>${ex.exp2}</sup>`)}</div>`;
        html += `<div class="step-explanation">Expression de départ</div>`;
        html += `</div>`;
        
        html += `<div class="step">`;
        html += `<div class="step-expression">${createFraction(`<span class="term-blue">${ex.coef1.toFixed(1)}</span>`, `<span class="term-blue">${ex.coef2.toFixed(1)}</span>`)} × ${createFraction(`10<sup><span class="term-green">${ex.exp1}</span></sup>`, `10<sup><span class="term-green">${ex.exp2}</span></sup>`)}</div>`;
        html += `<div class="step-explanation">On sépare les coefficients et les puissances de 10</div>`;
        html += `</div>`;
        
        const newCoef = ex.coef1 / ex.coef2;
        const newExp = ex.exp1 - ex.exp2;
        
        html += `<div class="step">`;
        html += `<div class="step-expression"><span class="term-orange">${newCoef.toFixed(2)}</span> × 10<sup><span class="term-red">${newExp}</span></sup></div>`;
        html += `<div class="step-explanation">Coefficients : ${createFraction(`<span class="term-blue">${ex.coef1.toFixed(1)}</span>`, `<span class="term-blue">${ex.coef2.toFixed(1)}</span>`)} = <span class="term-orange">${newCoef.toFixed(2)}</span>, Exposants : <span class="term-green">${ex.exp1} − ${ex.exp2} = ${newExp}</span></div>`;
        html += `</div>`;
        
        // Ajustement notation scientifique
        if (newCoef >= 10) {
            const adj = newCoef / 10;
            const adjExp = newExp + 1;
            html += `<div class="step">`;
            html += `<div class="step-expression">Ajustement pour notation scientifique</div>`;
            html += `<div class="step-explanation">${newCoef.toFixed(2)} ÷ 10 = ${adj.toFixed(1)}</div>`;
            html += `</div>`;
            html += `<div class="result-highlight"><span class="term-orange">${adj.toFixed(1)}</span> × 10<sup><span class="term-red">${adjExp}</span></sup></div>`;
        } else if (newCoef < 1) {
            const adj = newCoef * 10;
            const adjExp = newExp - 1;
            html += `<div class="step">`;
            html += `<div class="step-expression">Ajustement pour notation scientifique</div>`;
            html += `<div class="step-explanation">${newCoef.toFixed(2)} × 10 = ${adj.toFixed(1)}</div>`;
            html += `</div>`;
            html += `<div class="result-highlight"><span class="term-orange">${adj.toFixed(1)}</span> × 10<sup><span class="term-red">${adjExp}</span></sup></div>`;
        } else {
            html += `<div class="result-highlight"><span class="term-orange">${newCoef.toFixed(1)}</span> × 10<sup><span class="term-red">${newExp}</span></sup></div>`;
        }
    }
    
    return html;
}

function solveCombined(ex) {
    let html = '';
    
    html += `<div class="step">`;
    html += `<div class="step-expression">${createFraction(`${ex.base}<sup>${ex.exp1}</sup> × ${ex.base}<sup>${ex.exp2}</sup>`, `${ex.base}<sup>${ex.exp3}</sup>`)}</div>`;
    html += `<div class="step-explanation">Expression de départ</div>`;
    html += `</div>`;
    
    html += `<div class="step">`;
    html += `<div class="step-expression">Au numérateur : <span class="term-red">produit de puissances</span> → on additionne</div>`;
    html += `<div class="step-explanation">Au dénominateur : une seule puissance</div>`;
    html += `</div>`;
    
    const sum = ex.exp1 + ex.exp2;
    
    html += `<div class="step">`;
    html += `<div class="step-expression">${createFraction(`<span class="term-green">${ex.base}</span><sup><span class="term-blue">${ex.exp1}</span>+<span class="term-blue">${ex.exp2}</span></sup>`, `<span class="term-green">${ex.base}</span><sup>${ex.exp3}</sup>`)}</div>`;
    html += `<div class="step-explanation">On applique a<sup>m</sup> × a<sup>n</sup> = a<sup>m+n</sup> au numérateur</div>`;
    html += `</div>`;
    
    html += `<div class="step">`;
    html += `<div class="step-expression">${createFraction(`<span class="term-green">${ex.base}</span><sup><span class="term-orange">${sum}</span></sup>`, `<span class="term-green">${ex.base}</span><sup>${ex.exp3}</sup>`)}</div>`;
    html += `<div class="step-explanation">Car <span class="term-blue">${ex.exp1} + ${ex.exp2} = ${sum}</span></div>`;
    html += `</div>`;
    
    html += `<div class="step">`;
    html += `<div class="step-expression">Maintenant on a un <span class="term-red">quotient de puissances</span> → on soustrait</div>`;
    html += `<div class="step-explanation">Règle : a<sup>m</sup> ÷ a<sup>n</sup> = a<sup>m−n</sup></div>`;
    html += `</div>`;
    
    html += `<div class="step">`;
    html += `<div class="step-expression"><span class="term-green">${ex.base}</span><sup><span class="term-orange">${sum}</span>−${ex.exp3}</sup></div>`;
    html += `<div class="step-explanation">On soustrait les exposants</div>`;
    html += `</div>`;
    
    html += `<div class="step">`;
    html += `<div class="step-expression"><span class="term-green">${ex.base}</span><sup><span class="term-blue">${ex.result}</span></sup></div>`;
    html += `<div class="step-explanation">Car <span class="term-orange">${sum}</span> − ${ex.exp3} = <span class="term-blue">${ex.result}</span></div>`;
    html += `</div>`;
    
    const numericResult = Math.pow(ex.base, ex.result);
    if (ex.result <= 10 && numericResult <= 100000) {
        html += `<div class="result-highlight"><span class="term-green">${ex.base}</span><sup><span class="term-blue">${ex.result}</span></sup> = <span class="term-orange">${numericResult}</span></div>`;
    } else {
        html += `<div class="result-highlight"><span class="term-green">${ex.base}</span><sup><span class="term-blue">${ex.result}</span></sup></div>`;
    }
    
    return html;
}
