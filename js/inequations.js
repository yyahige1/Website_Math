/* ========================================
   INEQUATIONS.JS - Logique des inéquations
   ======================================== */

/**
 * État de la page inéquations
 */
const InequationsState = {
    currentType: 'type1'
};

/**
 * Symboles des signes d'inéquation
 */
const SIGN_SYMBOLS = { '<': '<', '>': '>', '<=': '≤', '>=': '≥' };
const SIGN_OPPOSITE = { '<': '>', '>': '<', '<=': '>=', '>=': '<=' };

/**
 * Récupère les valeurs des coefficients
 * @returns {Object}
 */
function getInequationValues() {
    if (InequationsState.currentType === 'type1') {
        return {
            type: 'type1',
            a: parseFloat($('a1').value) || 0,
            b: parseFloat($('b1').value) || 0,
            sign: $('sign1').value,
            c: parseFloat($('c1').value) || 0
        };
    } else {
        return {
            type: 'type2',
            a: parseFloat($('a2').value) || 0,
            b: parseFloat($('b2').value) || 0,
            sign: $('sign2').value,
            c: parseFloat($('c2').value) || 0,
            d: parseFloat($('d2').value) || 0
        };
    }
}

/**
 * Met à jour l'affichage de l'inéquation
 */
function updateInequationDisplay() {
    const ineq = getInequationValues();
    const s = SIGN_SYMBOLS[ineq.sign];
    let display = '';
    
    if (ineq.type === 'type1') {
        display = `${formatTerm(ineq.a, 'x', true)}${formatTerm(ineq.b, '', false)} ${s} ${ineq.c}`;
    } else {
        display = `${formatTerm(ineq.a, 'x', true)}${formatTerm(ineq.b, '', false)} ${s} ${formatTerm(ineq.c, 'x', true)}${formatTerm(ineq.d, '', false)}`;
    }
    
    updateText('expressionDisplay', display);
    hideSolution();
}

/**
 * Génère un signe aléatoire
 * @returns {string}
 */
function randSign() {
    const signs = ['<', '>', '<=', '>='];
    return signs[Math.floor(Math.random() * signs.length)];
}

/**
 * Génère une inéquation aléatoire
 */
function generateInequation() {
    if (InequationsState.currentType === 'type1') {
        $('a1').value = randCoef(1, 10, true, true);
        $('b1').value = randCoef(-10, 10, false, false);
        $('sign1').value = randSign();
        $('c1').value = randCoef(-10, 10, false, false);
    } else {
        const a = randCoef(1, 10, true, true);
        let c;
        do { c = randCoef(1, 10, true, true); } while (a === c);
        
        $('a2').value = a;
        $('b2').value = randCoef(-10, 10, false, false);
        $('sign2').value = randSign();
        $('c2').value = c;
        $('d2').value = randCoef(-10, 10, false, false);
    }
    updateInequationDisplay();
}

/**
 * Résout l'inéquation
 */
function solveInequation() {
    const ineq = getInequationValues();
    let html = '';
    
    if (ineq.type === 'type1') {
        html = solveInequationType1(ineq);
    } else {
        html = solveInequationType2(ineq);
    }
    
    updateHTML('stepsContainer', html);
    showSolution();
}

/**
 * Évalue une inéquation
 * @param {number} left 
 * @param {string} sign 
 * @param {number} right 
 * @returns {boolean}
 */
function evalInequation(left, sign, right) {
    switch (sign) {
        case '<': return left < right;
        case '>': return left > right;
        case '<=': return left <= right;
        case '>=': return left >= right;
    }
}

/**
 * Résout une inéquation de type ax + b > c
 * @param {Object} ineq 
 * @returns {string} HTML
 */
function solveInequationType1(ineq) {
    const { a, b, c, sign } = ineq;
    const s = SIGN_SYMBOLS[sign];
    let html = '';
    let currentSign = sign;
    
    html += createStepHTML({
        expression: `${formatTerm(a, 'x', true)}${formatTerm(b, '', false)} ${s} ${c}`,
        explanation: 'Inéquation de départ'
    });
    
    // Cas a = 0
    if (a === 0) {
        const result = evalInequation(b, sign, c);
        html += createStepHTML({
            expression: `${b} ${s} ${c}`,
            explanation: result ? 'Toujours vrai → S = ℝ' : 'Toujours faux → S = ∅'
        });
        return html;
    }
    
    // Isoler x
    if (b !== 0) {
        const op = b > 0 ? 'soustrait' : 'ajoute';
        html += createStepHTML({
            expression: `${formatTerm(a, 'x', true)} ${s} ${c - b}`,
            explanation: `On ${op} ${Math.abs(b)} des deux côtés`
        });
    }
    
    const num = c - b;
    
    // Diviser par a
    if (a < 0) {
        currentSign = SIGN_OPPOSITE[currentSign];
        html += `
            <div class="warning-sign">
                <strong>⚠️ Attention :</strong> On divise par ${a} (négatif), donc on <strong>inverse le signe</strong> !
            </div>
        `;
    }
    
    const result = num / a;
    const finalSign = SIGN_SYMBOLS[currentSign];
    
    html += createStepHTML({
        expression: `x ${finalSign} ${formatFraction(num, a)}`,
        explanation: `On divise par ${a}`
    });
    
    // Résultat et droite numérique
    html += buildInequationResult(result, currentSign);
    
    return html;
}

/**
 * Résout une inéquation de type ax + b ≤ cx + d
 * @param {Object} ineq 
 * @returns {string} HTML
 */
function solveInequationType2(ineq) {
    const { a, b, c, d, sign } = ineq;
    const s = SIGN_SYMBOLS[sign];
    let html = '';
    let currentSign = sign;
    
    html += createStepHTML({
        expression: `${formatTerm(a, 'x', true)}${formatTerm(b, '', false)} ${s} ${formatTerm(c, 'x', true)}${formatTerm(d, '', false)}`,
        explanation: 'Inéquation de départ'
    });
    
    const newA = a - c;
    
    if (c !== 0) {
        const op = c > 0 ? 'soustrait' : 'ajoute';
        html += createStepHTML({
            expression: `${formatTerm(newA, 'x', true)}${formatTerm(b, '', false)} ${s} ${d}`,
            explanation: `On ${op} ${Math.abs(c)}x des deux côtés`
        });
    }
    
    // Cas particulier
    if (newA === 0) {
        const result = evalInequation(b, sign, d);
        html += createStepHTML({
            expression: `${b} ${s} ${d}`,
            explanation: result ? 'Toujours vrai → S = ℝ' : 'Toujours faux → S = ∅'
        });
        return html;
    }
    
    const newC = d - b;
    
    if (b !== 0) {
        const op = b > 0 ? 'soustrait' : 'ajoute';
        html += createStepHTML({
            expression: `${formatTerm(newA, 'x', true)} ${s} ${newC}`,
            explanation: `On ${op} ${Math.abs(b)} des deux côtés`
        });
    }
    
    // Diviser
    if (newA < 0) {
        currentSign = SIGN_OPPOSITE[currentSign];
        html += `
            <div class="warning-sign">
                <strong>⚠️ Attention :</strong> On divise par ${newA} (négatif), donc on <strong>inverse le signe</strong> !
            </div>
        `;
    }
    
    const result = newC / newA;
    const finalSign = SIGN_SYMBOLS[currentSign];
    
    html += createStepHTML({
        expression: `x ${finalSign} ${formatFraction(newC, newA)}`,
        explanation: `On divise par ${newA}`
    });
    
    html += buildInequationResult(result, currentSign);
    
    return html;
}

/**
 * Construit le résultat avec la droite numérique
 * @param {number} value 
 * @param {string} sign 
 * @returns {string} HTML
 */
function buildInequationResult(value, sign) {
    const s = SIGN_SYMBOLS[sign];
    const isStrict = sign === '<' || sign === '>';
    const formattedValue = formatNumber(value);
    
    let interval = '';
    let solution = `x ${s} ${formattedValue}`;
    
    switch (sign) {
        case '<':
            interval = `] −∞ ; ${formattedValue} [`;
            break;
        case '<=':
            interval = `] −∞ ; ${formattedValue} ]`;
            break;
        case '>':
            interval = `] ${formattedValue} ; +∞ [`;
            break;
        case '>=':
            interval = `[ ${formattedValue} ; +∞ [`;
            break;
    }
    
    return `
        ${createResultHTML(solution, interval)}
        ${buildNumberLine(value, sign)}
    `;
}

/**
 * Construit la droite numérique
 * @param {number} value 
 * @param {string} sign 
 * @returns {string} HTML
 */
function buildNumberLine(value, sign) {
    const isStrict = sign === '<' || sign === '>';
    const isLeft = sign === '<' || sign === '<=';
    const pointClass = isStrict ? 'empty' : 'filled';
    const formattedValue = formatNumber(value);
    const pointPos = 50;
    
    return `
        <div class="number-line-container">
            <div style="text-align: center; font-size: 0.9em; color: var(--gray-600); margin-bottom: 8px;">
                Représentation sur la droite des réels
            </div>
            <div class="number-line">
                <div class="number-line-axis"></div>
                <div class="number-line-arrow-left"></div>
                <div class="number-line-arrow-right"></div>
                
                <!-- Zone colorée -->
                <div class="number-line-zone-line" style="
                    ${isLeft ? `left: 15px; right: ${100 - pointPos}%;` : `left: ${pointPos}%; right: 15px;`}
                "></div>
                
                <!-- Point -->
                <div class="number-line-point ${pointClass}" style="left: ${pointPos}%;"></div>
                <div class="number-line-label" style="left: ${pointPos}%;">${formattedValue}</div>
            </div>
            <div style="text-align: center; font-size: 0.85em; color: var(--gray-500); margin-top: 5px;">
                ${isStrict ? '○ = valeur exclue' : '● = valeur incluse'}
            </div>
        </div>
    `;
}

/**
 * Change le type d'inéquation
 * @param {string} type 
 */
function changeInequationType(type) {
    InequationsState.currentType = type;
    
    toggleClass('coeffType1', 'hidden', type !== 'type1');
    toggleClass('coeffType2', 'hidden', type !== 'type2');
    
    updateInequationDisplay();
}

/**
 * Initialise la page inéquations
 */
function initInequationsPage() {
    initTypeSelector('.type-btn', changeInequationType);
    
    $('generateBtn').addEventListener('click', generateInequation);
    $('solveBtn').addEventListener('click', solveInequation);
    
    document.querySelectorAll('input, select').forEach(el => {
        el.addEventListener('input', updateInequationDisplay);
        el.addEventListener('change', updateInequationDisplay);
    });
    
    updateInequationDisplay();
}

// Export pour les tests
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        solveInequationType1,
        solveInequationType2,
        evalInequation
    };
}
