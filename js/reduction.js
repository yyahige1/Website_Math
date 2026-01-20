/* ========================================
   REDUCTION.JS - Logique de réduction
   ======================================== */

/**
 * État de la page réduction
 */
const ReductionState = {
    currentType: 'avec-x',
    nbTerms: 4,
    currentExpression: null
};

/**
 * Classes de couleur pour les termes
 */
const TERM_COLORS = {
    'x²': { bg: 'var(--term-red-bg)', border: '#ef5350', name: 'termes en x²' },
    'x': { bg: 'var(--term-blue-bg)', border: '#42a5f5', name: 'termes en x' },
    'const': { bg: 'var(--term-green-bg)', border: '#66bb6a', name: 'constantes' }
};

/**
 * Génère une expression aléatoire
 */
function generateReductionExpression() {
    const n = ReductionState.nbTerms;
    const terms = [];
    
    switch (ReductionState.currentType) {
        case 'avec-x':
            // Termes en x et constantes
            for (let i = 0; i < n; i++) {
                const isX = Math.random() < 0.6;
                terms.push({
                    coef: randCoef(-10, 10, false, true),
                    type: isX ? 'x' : 'const'
                });
            }
            break;
            
        case 'avec-x2':
            // Termes en x², x et constantes
            for (let i = 0; i < n; i++) {
                const r = Math.random();
                let type;
                if (r < 0.35) type = 'x²';
                else if (r < 0.7) type = 'x';
                else type = 'const';
                
                terms.push({
                    coef: randCoef(-10, 10, false, true),
                    type: type
                });
            }
            break;
            
        case 'avec-parentheses':
            // Expression avec parenthèses: a(bx + c) + dx + e
            const a = randCoef(2, 5, true, true);
            const b = randCoef(-5, 5, false, true);
            const c = randCoef(-5, 5, false, true);
            const d = randCoef(-10, 10, false, true);
            const e = randCoef(-10, 10, false, true);
            
            ReductionState.currentExpression = {
                type: 'parentheses',
                a, b, c, d, e,
                // Après développement: abx + ac + dx + e
                terms: [
                    { coef: a * b, type: 'x' },
                    { coef: a * c, type: 'const' },
                    { coef: d, type: 'x' },
                    { coef: e, type: 'const' }
                ]
            };
            updateReductionDisplay();
            return;
    }
    
    // S'assurer qu'on a au moins un terme de chaque type pertinent
    if (ReductionState.currentType === 'avec-x') {
        const hasX = terms.some(t => t.type === 'x');
        const hasConst = terms.some(t => t.type === 'const');
        if (!hasX) terms[0].type = 'x';
        if (!hasConst) terms[1].type = 'const';
    }
    
    ReductionState.currentExpression = { type: 'simple', terms };
    updateReductionDisplay();
}

/**
 * Met à jour l'affichage
 */
function updateReductionDisplay() {
    const expr = ReductionState.currentExpression;
    if (!expr) {
        generateReductionExpression();
        return;
    }
    
    let display = '';
    
    if (expr.type === 'parentheses') {
        const { a, b, c, d, e } = expr;
        display = `${a}(${formatTerm(b, 'x', true)}${formatTerm(c, '', false)})${formatTerm(d, 'x', false)}${formatTerm(e, '', false)}`;
    } else {
        expr.terms.forEach((term, i) => {
            const variable = term.type === 'x²' ? 'x²' : (term.type === 'x' ? 'x' : '');
            display += formatTerm(term.coef, variable, i === 0);
        });
    }
    
    updateText('expressionDisplay', display);
    hideSolution();
}

/**
 * Résout la réduction
 */
function solveReduction() {
    const expr = ReductionState.currentExpression;
    if (!expr) return;
    
    let html = '';
    
    if (expr.type === 'parentheses') {
        html = solveWithParentheses(expr);
    } else {
        html = solveSimpleReduction(expr.terms);
    }
    
    updateHTML('stepsContainer', html);
    showSolution();
}

/**
 * Résout une réduction simple (sans parenthèses)
 * @param {Array} terms 
 * @returns {string} HTML
 */
function solveSimpleReduction(terms) {
    let html = '';
    
    // Afficher l'expression de départ avec couleurs
    let coloredExpr = '';
    terms.forEach((term, i) => {
        const variable = term.type === 'x²' ? 'x²' : (term.type === 'x' ? 'x' : '');
        const color = TERM_COLORS[term.type];
        const termStr = formatTerm(term.coef, variable, i === 0);
        coloredExpr += `<span style="background: ${color.bg}; padding: 2px 4px; border-radius: 3px;">${termStr}</span>`;
    });
    
    html += `
        <div class="step">
            <div class="step-expression">Identifier les termes semblables</div>
            <div class="step-explanation" style="font-family: var(--font-mono); font-size: 1.1em; margin-top: 8px;">
                ${coloredExpr}
            </div>
            ${createLegend(terms)}
        </div>
    `;
    
    // Regrouper par type
    const groups = {};
    terms.forEach(term => {
        if (!groups[term.type]) groups[term.type] = [];
        groups[term.type].push(term.coef);
    });
    
    // Afficher le regroupement
    let regroupHTML = '';
    const order = ['x²', 'x', 'const'];
    
    order.forEach(type => {
        if (groups[type] && groups[type].length > 0) {
            const color = TERM_COLORS[type];
            const variable = type === 'x²' ? 'x²' : (type === 'x' ? 'x' : '');
            const coefs = groups[type].map((c, i) => i === 0 ? c : (c >= 0 ? ` + ${c}` : ` − ${Math.abs(c)}`)).join('');
            const sum = groups[type].reduce((a, b) => a + b, 0);
            
            regroupHTML += `
                <div style="background: ${color.bg}; border: 2px dashed ${color.border}; padding: 8px 12px; border-radius: 6px; margin: 6px 0; text-align: center;">
                    <span style="font-family: var(--font-mono);">(${coefs})${variable} = ${formatTerm(sum, variable, true)}</span>
                </div>
            `;
        }
    });
    
    html += `
        <div class="step">
            <div class="step-expression">Regrouper et calculer</div>
            ${regroupHTML}
        </div>
    `;
    
    // Résultat final
    let result = '';
    let isFirst = true;
    order.forEach(type => {
        if (groups[type]) {
            const sum = groups[type].reduce((a, b) => a + b, 0);
            if (sum !== 0) {
                const variable = type === 'x²' ? 'x²' : (type === 'x' ? 'x' : '');
                result += formatTerm(sum, variable, isFirst);
                isFirst = false;
            }
        }
    });
    
    if (result === '') result = '0';
    
    html += createResultHTML(result);
    
    return html;
}

/**
 * Résout une expression avec parenthèses
 * @param {Object} expr 
 * @returns {string} HTML
 */
function solveWithParentheses(expr) {
    const { a, b, c, d, e, terms } = expr;
    let html = '';
    
    // Étape 1: Développer
    html += `
        <div class="step">
            <span class="method-badge">Développement</span>
            <div class="step-expression">${a}(${formatTerm(b, 'x', true)}${formatTerm(c, '', false)})</div>
            <div class="step-explanation">
                ${a} × ${formatTerm(b, 'x', true)} = ${a * b}x<br>
                ${a} × ${formatTerm(c, '', true)} = ${a * c}
            </div>
        </div>
    `;
    
    // Étape 2: Expression développée
    const developed = `${formatTerm(a * b, 'x', true)}${formatTerm(a * c, '', false)}${formatTerm(d, 'x', false)}${formatTerm(e, '', false)}`;
    
    html += `
        <div class="step">
            <div class="step-expression">Expression développée</div>
            <div class="step-explanation" style="font-family: var(--font-mono); font-size: 1.1em;">
                ${developed}
            </div>
        </div>
    `;
    
    // Étape 3: Réduire
    html += solveSimpleReduction(terms);
    
    return html;
}

/**
 * Crée la légende des couleurs
 * @param {Array} terms 
 * @returns {string} HTML
 */
function createLegend(terms) {
    const types = [...new Set(terms.map(t => t.type))];
    let legend = '<div style="display: flex; gap: 12px; margin-top: 10px; flex-wrap: wrap; justify-content: center;">';
    
    types.forEach(type => {
        const color = TERM_COLORS[type];
        legend += `
            <div style="display: flex; align-items: center; gap: 4px; font-size: 0.85em;">
                <span style="width: 12px; height: 12px; background: ${color.bg}; border: 1px solid ${color.border}; border-radius: 2px;"></span>
                ${color.name}
            </div>
        `;
    });
    
    legend += '</div>';
    return legend;
}

/**
 * Change le type de réduction
 * @param {string} type 
 */
function changeReductionType(type) {
    ReductionState.currentType = type;
    ReductionState.currentExpression = null;
    generateReductionExpression();
}

/**
 * Change le nombre de termes
 * @param {number} n 
 */
function changeNbTerms(n) {
    ReductionState.nbTerms = n;
    ReductionState.currentExpression = null;
    generateReductionExpression();
}

/**
 * Initialise la page réduction
 */
function initReductionPage() {
    initTypeSelector('.type-btn', changeReductionType);
    
    $('generateBtn').addEventListener('click', () => {
        ReductionState.currentExpression = null;
        generateReductionExpression();
    });
    $('solveBtn').addEventListener('click', solveReduction);
    
    // Sélecteur nombre de termes
    const nbTermsSelect = $('nbTerms');
    if (nbTermsSelect) {
        nbTermsSelect.addEventListener('change', (e) => {
            changeNbTerms(parseInt(e.target.value));
        });
    }
    
    generateReductionExpression();
}

// Export pour les tests
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        solveSimpleReduction,
        solveWithParentheses
    };
}
