/* ========================================
   DEVELOPPEMENT.JS - Logique de développement
   ======================================== */

/**
 * État de la page développement
 */
const DeveloppementState = {
    currentType: 'simple',
    currentExpression: null
};

/**
 * Génère une expression aléatoire selon le type
 */
function generateDeveloppement() {
    const type = DeveloppementState.currentType;
    let expr = {};
    
    switch (type) {
        case 'simple':
            // k(ax + b)
            expr = {
                k: randCoef(2, 5, true, true),
                a: randCoef(1, 5, true, true),
                b: randCoef(-5, 5, false, true)
            };
            break;
            
        case 'double':
            // (ax + b)(cx + d)
            expr = {
                a: randCoef(1, 4, true, true),
                b: randCoef(-5, 5, false, true),
                c: randCoef(1, 4, true, true),
                d: randCoef(-5, 5, false, true)
            };
            break;
            
        case 'carre-somme':
        case 'carre-diff':
        case 'diff-carres':
            // (ax + b)² ou (ax - b)² ou (ax + b)(ax - b)
            expr = {
                a: randCoef(1, 4, false, true),
                b: randCoef(1, 5, false, true)
            };
            break;
    }
    
    DeveloppementState.currentExpression = expr;
    updateDeveloppementDisplay();
}

/**
 * Met à jour l'affichage de l'expression
 */
function updateDeveloppementDisplay() {
    const type = DeveloppementState.currentType;
    const expr = DeveloppementState.currentExpression;
    
    if (!expr) {
        generateDeveloppement();
        return;
    }
    
    let display = '';
    
    switch (type) {
        case 'simple':
            display = `${expr.k}(${formatTerm(expr.a, 'x', true)}${formatTerm(expr.b, '', false)})`;
            break;
        case 'double':
            display = `(${formatTerm(expr.a, 'x', true)}${formatTerm(expr.b, '', false)})(${formatTerm(expr.c, 'x', true)}${formatTerm(expr.d, '', false)})`;
            break;
        case 'carre-somme':
            display = `(${formatTerm(expr.a, 'x', true)} + ${expr.b})²`;
            break;
        case 'carre-diff':
            display = `(${formatTerm(expr.a, 'x', true)} − ${expr.b})²`;
            break;
        case 'diff-carres':
            display = `(${formatTerm(expr.a, 'x', true)} + ${expr.b})(${formatTerm(expr.a, 'x', true)} − ${expr.b})`;
            break;
    }
    
    updateText('expressionDisplay', display);
    hideSolution();
}

/**
 * Résout le développement
 */
function solveDeveloppement() {
    const type = DeveloppementState.currentType;
    const expr = DeveloppementState.currentExpression;
    
    if (!expr) return;
    
    let html = '';
    
    switch (type) {
        case 'simple':
            html = solveSimple(expr);
            break;
        case 'double':
            html = solveDouble(expr);
            break;
        case 'carre-somme':
            html = solveCarreSomme(expr);
            break;
        case 'carre-diff':
            html = solveCarreDiff(expr);
            break;
        case 'diff-carres':
            html = solveDiffCarresDev(expr);
            break;
    }
    
    updateHTML('stepsContainer', html);
    showSolution();
    
    // Dessiner les flèches après le rendu
    setTimeout(() => drawArrows(), 50);
}

/**
 * Résout une distributivité simple k(ax + b)
 */
function solveSimple(expr) {
    const { k, a, b } = expr;
    const term1 = k * a;
    const term2 = k * b;
    
    return `
        <div class="step">
            <span class="method-badge">Distributivité simple</span>
            <div class="step-expression">k × (a + b) = k × a + k × b</div>
        </div>
        
        <div class="step">
            <div class="step-expression">Appliquer la distributivité</div>
            <div class="arrows-container" id="arrowsContainer">
                <div class="arrow-expr">
                    <span class="arrow-term" id="termK">${k}</span>
                    <span>(</span>
                    <span class="arrow-term" id="termA">${formatTerm(a, 'x', true)}</span>
                    <span class="arrow-term" id="termB">${formatTerm(b, '', false)}</span>
                    <span>)</span>
                </div>
                <svg class="arrows-svg" id="arrowsSvg"></svg>
            </div>
            <div class="results-grid">
                <div class="result-item result-red">
                    <div class="calculation">${k} × ${formatTerm(a, 'x', true)}</div>
                    <div class="result">${formatTerm(term1, 'x', true)}</div>
                </div>
                <div class="result-item result-green">
                    <div class="calculation">${k} × ${formatTerm(b, '', true)}</div>
                    <div class="result">${formatTerm(term2, '', true)}</div>
                </div>
            </div>
        </div>
        
        ${createResultHTML(`${formatTerm(term1, 'x', true)}${formatTerm(term2, '', false)}`)}
    `;
}

/**
 * Résout une double distributivité (ax + b)(cx + d)
 */
function solveDouble(expr) {
    const { a, b, c, d } = expr;
    const t1 = a * c;  // x²
    const t2 = a * d;  // x
    const t3 = b * c;  // x
    const t4 = b * d;  // const
    const middle = t2 + t3;
    
    return `
        <div class="step">
            <span class="method-badge">Double distributivité</span>
            <div class="step-expression">(a + b)(c + d) = ac + ad + bc + bd</div>
        </div>
        
        <div class="step">
            <div class="step-expression">Appliquer la double distributivité</div>
            <div class="arrows-container" id="arrowsContainer">
                <div class="arrow-expr">
                    <span>(</span>
                    <span class="arrow-term" id="termA">${formatTerm(a, 'x', true)}</span>
                    <span class="arrow-term" id="termB">${formatTerm(b, '', false)}</span>
                    <span>)(</span>
                    <span class="arrow-term" id="termC">${formatTerm(c, 'x', true)}</span>
                    <span class="arrow-term" id="termD">${formatTerm(d, '', false)}</span>
                    <span>)</span>
                </div>
                <svg class="arrows-svg" id="arrowsSvg"></svg>
            </div>
            <div class="results-grid">
                <div class="result-item result-red">
                    <div class="calculation">${formatTerm(a, 'x', true)} × ${formatTerm(c, 'x', true)}</div>
                    <div class="result">${formatTerm(t1, 'x²', true)}</div>
                </div>
                <div class="result-item result-red">
                    <div class="calculation">${formatTerm(a, 'x', true)} × ${formatTerm(d, '', true)}</div>
                    <div class="result">${formatTerm(t2, 'x', true)}</div>
                </div>
                <div class="result-item result-blue">
                    <div class="calculation">${formatTerm(b, '', true)} × ${formatTerm(c, 'x', true)}</div>
                    <div class="result">${formatTerm(t3, 'x', true)}</div>
                </div>
                <div class="result-item result-blue">
                    <div class="calculation">${formatTerm(b, '', true)} × ${formatTerm(d, '', true)}</div>
                    <div class="result">${formatTerm(t4, '', true)}</div>
                </div>
            </div>
        </div>
        
        <div class="step">
            <div class="step-expression">Réduire</div>
            <div class="step-explanation">
                ${formatTerm(t1, 'x²', true)}${formatTerm(t2, 'x', false)}${formatTerm(t3, 'x', false)}${formatTerm(t4, '', false)}
                = ${formatTerm(t1, 'x²', true)}${formatTerm(middle, 'x', false)}${formatTerm(t4, '', false)}
            </div>
        </div>
        
        ${createResultHTML(`${formatTerm(t1, 'x²', true)}${formatTerm(middle, 'x', false)}${formatTerm(t4, '', false)}`)}
    `;
}

/**
 * Résout (ax + b)²
 */
function solveCarreSomme(expr) {
    const { a, b } = expr;
    const aStr = a === 1 ? 'x' : a + 'x';
    const a2 = a * a;
    const ab2 = 2 * a * b;
    const b2 = b * b;
    
    return `
        <div class="step">
            <span class="method-badge">Identité remarquable</span>
            <div class="step-expression">(a + b)² = a² + 2ab + b²</div>
        </div>
        
        <div class="step">
            <div class="step-expression">Identifier a et b</div>
            ${createIdentityBoxesHTML(aStr, b)}
        </div>
        
        <div class="step">
            <div class="step-expression">Appliquer la formule</div>
            <div class="step-explanation">
                • a² = (${aStr})² = ${a2}x²<br>
                • 2ab = 2 × ${aStr} × ${b} = ${ab2}x<br>
                • b² = ${b}² = ${b2}
            </div>
        </div>
        
        ${createResultHTML(`${formatTerm(a2, 'x²', true)}${formatTerm(ab2, 'x', false)}${formatTerm(b2, '', false)}`)}
    `;
}

/**
 * Résout (ax - b)²
 */
function solveCarreDiff(expr) {
    const { a, b } = expr;
    const aStr = a === 1 ? 'x' : a + 'x';
    const a2 = a * a;
    const ab2 = -2 * a * b;
    const b2 = b * b;
    
    return `
        <div class="step">
            <span class="method-badge">Identité remarquable</span>
            <div class="step-expression">(a − b)² = a² − 2ab + b²</div>
        </div>
        
        <div class="step">
            <div class="step-expression">Identifier a et b</div>
            ${createIdentityBoxesHTML(aStr, b)}
        </div>
        
        <div class="step">
            <div class="step-expression">Appliquer la formule</div>
            <div class="step-explanation">
                • a² = (${aStr})² = ${a2}x²<br>
                • −2ab = −2 × ${aStr} × ${b} = ${ab2}x<br>
                • b² = ${b}² = ${b2}
            </div>
        </div>
        
        ${createResultHTML(`${formatTerm(a2, 'x²', true)}${formatTerm(ab2, 'x', false)}${formatTerm(b2, '', false)}`)}
    `;
}

/**
 * Résout (ax + b)(ax - b)
 */
function solveDiffCarresDev(expr) {
    const { a, b } = expr;
    const aStr = a === 1 ? 'x' : a + 'x';
    const a2 = a * a;
    const b2 = b * b;
    
    return `
        <div class="step">
            <span class="method-badge">Identité remarquable</span>
            <div class="step-expression">(a + b)(a − b) = a² − b²</div>
        </div>
        
        <div class="step">
            <div class="step-expression">Identifier a et b</div>
            ${createIdentityBoxesHTML(aStr, b)}
        </div>
        
        <div class="step">
            <div class="step-expression">Appliquer la formule</div>
            <div class="step-explanation">
                • a² = (${aStr})² = ${a2}x²<br>
                • b² = ${b}² = ${b2}
            </div>
        </div>
        
        ${createResultHTML(`${formatTerm(a2, 'x²', true)} − ${b2}`)}
    `;
}

/**
 * Dessine les flèches SVG pour la distributivité
 */
function drawArrows() {
    const svg = document.getElementById('arrowsSvg');
    const container = document.getElementById('arrowsContainer');
    
    if (!svg || !container) return;
    
    const type = DeveloppementState.currentType;
    svg.innerHTML = '';
    
    const containerRect = container.getBoundingClientRect();
    
    if (type === 'simple') {
        const k = document.getElementById('termK');
        const a = document.getElementById('termA');
        const b = document.getElementById('termB');
        
        if (!k || !a || !b) return;
        
        drawArrow(svg, containerRect, k, a, '#ef5350');
        drawArrow(svg, containerRect, k, b, '#66bb6a');
    } else if (type === 'double') {
        const termA = document.getElementById('termA');
        const termB = document.getElementById('termB');
        const termC = document.getElementById('termC');
        const termD = document.getElementById('termD');
        
        if (!termA || !termB || !termC || !termD) return;
        
        // Premier terme vers les deux autres
        drawArrow(svg, containerRect, termA, termC, '#ef5350');
        drawArrow(svg, containerRect, termA, termD, '#ef5350');
        // Deuxième terme vers les deux autres
        drawArrow(svg, containerRect, termB, termC, '#42a5f5');
        drawArrow(svg, containerRect, termB, termD, '#42a5f5');
    }
}

/**
 * Dessine une flèche courbe entre deux éléments
 */
function drawArrow(svg, containerRect, from, to, color) {
    const fromRect = from.getBoundingClientRect();
    const toRect = to.getBoundingClientRect();
    
    const x1 = fromRect.left + fromRect.width / 2 - containerRect.left;
    const y1 = fromRect.bottom - containerRect.top + 5;
    const x2 = toRect.left + toRect.width / 2 - containerRect.left;
    const y2 = toRect.bottom - containerRect.top + 5;
    
    const midY = Math.max(y1, y2) + 20 + Math.abs(x2 - x1) * 0.15;
    
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', `M ${x1} ${y1} Q ${x1} ${midY}, ${(x1 + x2) / 2} ${midY} Q ${x2} ${midY}, ${x2} ${y2}`);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', color);
    path.setAttribute('stroke-width', '2');
    path.setAttribute('marker-end', `url(#arrow-${color.replace('#', '')})`);
    
    // Ajouter le marqueur s'il n'existe pas
    if (!svg.querySelector(`#arrow-${color.replace('#', '')}`)) {
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        defs.innerHTML = `
            <marker id="arrow-${color.replace('#', '')}" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="${color}"/>
            </marker>
        `;
        svg.appendChild(defs);
    }
    
    svg.appendChild(path);
}

/**
 * Change le type de développement
 */
function changeDeveloppementType(type) {
    DeveloppementState.currentType = type;
    DeveloppementState.currentExpression = null;
    generateDeveloppement();
}

/**
 * Initialise la page développement
 */
function initDeveloppementPage() {
    initTypeSelector('.type-btn', changeDeveloppementType);
    
    $('generateBtn').addEventListener('click', () => {
        DeveloppementState.currentExpression = null;
        generateDeveloppement();
    });
    $('solveBtn').addEventListener('click', solveDeveloppement);
    
    // Redessiner les flèches au redimensionnement
    window.addEventListener('resize', () => {
        if (document.getElementById('arrowsSvg')) {
            drawArrows();
        }
    });
    
    generateDeveloppement();
}

// Export pour les tests
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        solveSimple,
        solveDouble,
        solveCarreSomme,
        solveCarreDiff,
        solveDiffCarresDev
    };
}
