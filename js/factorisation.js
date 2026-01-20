/* ========================================
   FACTORISATION.JS - Logique de factorisation
   ======================================== */

/**
 * État de la page factorisation
 */
const FactorisationState = {
    currentType: 'facteur-commun',
    facteurCommun: { a: 6, b: 9 }
};

/**
 * Récupère les valeurs selon le type
 * @returns {Object}
 */
function getFactorisationValues() {
    switch (FactorisationState.currentType) {
        case 'facteur-commun':
            return {
                a: FactorisationState.facteurCommun.a,
                b: FactorisationState.facteurCommun.b
            };
        case 'diff-carres':
            return {
                a: Math.abs(parseInt($('dc_a').value)) || 1,
                b: Math.abs(parseInt($('dc_b').value)) || 1
            };
        case 'carre-parfait':
            return {
                a: Math.abs(parseInt($('cp_a').value)) || 1,
                b: Math.abs(parseInt($('cp_b').value)) || 1,
                isPlus: $('cp_sign').value === '+'
            };
    }
}

/**
 * Met à jour l'affichage de l'expression
 */
function updateFactorisationDisplay() {
    const v = getFactorisationValues();
    let display = '';
    
    switch (FactorisationState.currentType) {
        case 'facteur-commun':
            display = formatTerm(v.a, 'x', true) + formatTerm(v.b, '', false);
            break;
        case 'diff-carres':
            display = formatTerm(v.a * v.a, 'x²', true) + ' − ' + (v.b * v.b);
            break;
        case 'carre-parfait':
            const middle = 2 * v.a * v.b * (v.isPlus ? 1 : -1);
            display = formatTerm(v.a * v.a, 'x²', true) + formatTerm(middle, 'x', false) + formatTerm(v.b * v.b, '', false);
            break;
    }
    
    updateText('expressionDisplay', display);
    hideSolution();
}

/**
 * Génère une expression aléatoire
 */
function generateFactorisation() {
    switch (FactorisationState.currentType) {
        case 'facteur-commun':
            const factor = randInt(2, 5);
            const innerA = randInt(1, 5) * (Math.random() < 0.3 ? -1 : 1);
            const innerB = randInt(1, 5) * (Math.random() < 0.3 ? -1 : 1);
            FactorisationState.facteurCommun.a = factor * innerA;
            FactorisationState.facteurCommun.b = factor * innerB;
            break;
        case 'diff-carres':
            $('dc_a').value = randInt(1, 4);
            $('dc_b').value = randInt(1, 6);
            break;
        case 'carre-parfait':
            $('cp_a').value = randInt(1, 4);
            $('cp_b').value = randInt(1, 5);
            $('cp_sign').value = Math.random() < 0.5 ? '+' : '-';
            break;
    }
    updateFactorisationDisplay();
}

/**
 * Résout la factorisation
 */
function solveFactorisation() {
    const v = getFactorisationValues();
    let html = '';
    
    switch (FactorisationState.currentType) {
        case 'facteur-commun':
            html = solveFacteurCommun(v.a, v.b);
            break;
        case 'diff-carres':
            html = solveDiffCarres(v.a, v.b);
            break;
        case 'carre-parfait':
            html = solveCarreParfait(v.a, v.b, v.isPlus);
            break;
    }
    
    updateHTML('stepsContainer', html);
    showSolution();
}

/**
 * Résout une factorisation par facteur commun
 * @param {number} a - Coefficient de x
 * @param {number} b - Constante
 * @returns {string} HTML
 */
function solveFacteurCommun(a, b) {
    const pgcd = gcd(a, b);
    const quotientA = a / pgcd;
    const quotientB = b / pgcd;
    const innerExpr = formatTerm(quotientA, 'x', true) + formatTerm(quotientB, '', false);
    
    let html = '';
    
    html += `
        <div class="step">
            <span class="method-badge">Facteur commun</span>
            <div class="step-expression">Trouver le PGCD des coefficients</div>
            <div class="step-explanation">PGCD(${Math.abs(a)}, ${Math.abs(b)}) = ${pgcd}</div>
        </div>
    `;
    
    html += `
        <div class="step">
            <div class="step-expression">Diviser chaque terme par ${pgcd}</div>
            <div class="factor-visual">
                <div class="factor-line">${a}x ÷ ${pgcd} = ${quotientA}x</div>
                <div class="factor-line">${b} ÷ ${pgcd} = ${quotientB}</div>
            </div>
        </div>
    `;
    
    html += `
        <div class="step">
            <div class="step-expression">Écrire la forme factorisée</div>
            <div class="factor-visual">
                <div class="factor-line">
                    ${formatTerm(a, 'x', true)}${formatTerm(b, '', false)} = 
                    <span class="factor-box factor-common">${pgcd}</span>(<span class="factor-box factor-remaining">${innerExpr}</span>)
                </div>
            </div>
        </div>
    `;
    
    html += createResultHTML(`${pgcd}(${innerExpr})`);
    
    return html;
}

/**
 * Résout une différence de carrés a²x² - b²
 * @param {number} a 
 * @param {number} b 
 * @returns {string} HTML
 */
function solveDiffCarres(a, b) {
    const aStr = a === 1 ? 'x' : a + 'x';
    const a2 = a * a;
    const b2 = b * b;
    
    let html = '';
    
    html += `
        <div class="step">
            <span class="method-badge">Identité remarquable</span>
            <div class="step-expression">Reconnaître a² − b²</div>
            <div class="step-explanation">Formule : <span class="id-a">a</span>² − <span class="id-b">b</span>² = (<span class="id-a">a</span> − <span class="id-b">b</span>)(<span class="id-a">a</span> + <span class="id-b">b</span>)</div>
        </div>
    `;
    
    html += `
        <div class="step">
            <div class="step-expression">Identifier a et b</div>
            <div class="step-explanation">
                • ${a2}x² = (<span class="id-a">${aStr}</span>)² donc <span class="id-a">a = ${aStr}</span><br>
                • ${b2} = (<span class="id-b">${b}</span>)² donc <span class="id-b">b = ${b}</span>
            </div>
            ${createIdentityBoxesHTML(aStr, b)}
        </div>
    `;
    
    html += `
        <div class="step">
            <div class="step-expression">Appliquer la formule</div>
            <div class="step-explanation">(<span class="id-a">${aStr}</span> − <span class="id-b">${b}</span>)(<span class="id-a">${aStr}</span> + <span class="id-b">${b}</span>)</div>
        </div>
    `;
    
    html += createResultHTML(`(${aStr} − ${b})(${aStr} + ${b})`);
    
    return html;
}

/**
 * Résout un carré parfait a²x² ± 2abx + b²
 * @param {number} a 
 * @param {number} b 
 * @param {boolean} isPlus 
 * @returns {string} HTML
 */
function solveCarreParfait(a, b, isPlus) {
    const aStr = a === 1 ? 'x' : a + 'x';
    const sign = isPlus ? '+' : '−';
    const a2 = a * a;
    const b2 = b * b;
    const middle = 2 * a * b;
    
    const formula = isPlus 
        ? '(<span class="id-a">a</span> + <span class="id-b">b</span>)² = <span class="id-a">a</span>² + 2<span class="id-a">a</span><span class="id-b">b</span> + <span class="id-b">b</span>²'
        : '(<span class="id-a">a</span> − <span class="id-b">b</span>)² = <span class="id-a">a</span>² − 2<span class="id-a">a</span><span class="id-b">b</span> + <span class="id-b">b</span>²';
    
    let html = '';
    
    html += `
        <div class="step">
            <span class="method-badge">Identité remarquable</span>
            <div class="step-expression">Reconnaître un carré parfait</div>
            <div class="step-explanation">Formule : ${formula}</div>
        </div>
    `;
    
    html += `
        <div class="step">
            <div class="step-expression">Identifier a et b</div>
            <div class="step-explanation">
                • ${a2}x² = (<span class="id-a">${aStr}</span>)² donc <span class="id-a">a = ${aStr}</span><br>
                • ${b2} = (<span class="id-b">${b}</span>)² donc <span class="id-b">b = ${b}</span>
            </div>
            ${createIdentityBoxesHTML(aStr, b)}
        </div>
    `;
    
    html += `
        <div class="step">
            <div class="step-expression">Vérifier le terme du milieu</div>
            <div class="step-explanation">
                2 × <span class="id-a">${aStr}</span> × <span class="id-b">${b}</span> = 2 × ${a} × ${b} × x = ${middle}x ✓
            </div>
        </div>
    `;
    
    html += `
        <div class="step">
            <div class="step-expression">Appliquer la formule</div>
            <div class="step-explanation">(<span class="id-a">${aStr}</span> ${sign} <span class="id-b">${b}</span>)²</div>
        </div>
    `;
    
    html += createResultHTML(`(${aStr} ${sign} ${b})²`);
    
    return html;
}

/**
 * Change le type de factorisation
 * @param {string} type 
 */
function changeFactorisationType(type) {
    FactorisationState.currentType = type;
    
    toggleClass('coeffFacteur', 'hidden', type !== 'facteur-commun');
    toggleClass('coeffDiff', 'hidden', type !== 'diff-carres');
    toggleClass('coeffCarre', 'hidden', type !== 'carre-parfait');
    
    updateFactorisationDisplay();
}

/**
 * Initialise la page factorisation
 */
function initFactorisationPage() {
    initTypeSelector('.type-btn', changeFactorisationType);
    
    $('generateBtn').addEventListener('click', generateFactorisation);
    $('solveBtn').addEventListener('click', solveFactorisation);
    
    document.querySelectorAll('input, select').forEach(el => {
        el.addEventListener('input', updateFactorisationDisplay);
        el.addEventListener('change', updateFactorisationDisplay);
    });
    
    updateFactorisationDisplay();
}

// Export pour les tests
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        solveFacteurCommun,
        solveDiffCarres,
        solveCarreParfait
    };
}
