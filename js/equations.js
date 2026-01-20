/* ========================================
   EQUATIONS.JS - Logique des équations
   ======================================== */

/**
 * État de la page équations
 */
const EquationsState = {
    currentType: 'type1'
};

/**
 * Récupère les valeurs des coefficients depuis les inputs
 * @returns {Object}
 */
function getEquationValues() {
    if (EquationsState.currentType === 'type1') {
        return {
            type: 'type1',
            a: parseFloat($('a1').value) || 0,
            b: parseFloat($('b1').value) || 0,
            c: parseFloat($('c1').value) || 0
        };
    } else {
        return {
            type: 'type2',
            a: parseFloat($('a2').value) || 0,
            b: parseFloat($('b2').value) || 0,
            c: parseFloat($('c2').value) || 0,
            d: parseFloat($('d2').value) || 0
        };
    }
}

/**
 * Met à jour l'affichage de l'équation
 */
function updateEquationDisplay() {
    const eq = getEquationValues();
    let display = '';
    
    if (eq.type === 'type1') {
        display = `${formatTerm(eq.a, 'x', true)}${formatTerm(eq.b, '', false)} = ${eq.c}`;
    } else {
        display = `${formatTerm(eq.a, 'x', true)}${formatTerm(eq.b, '', false)} = ${formatTerm(eq.c, 'x', true)}${formatTerm(eq.d, '', false)}`;
    }
    
    updateText('expressionDisplay', display);
    hideSolution();
}

/**
 * Génère une équation aléatoire
 */
function generateEquation() {
    if (EquationsState.currentType === 'type1') {
        $('a1').value = randCoef(1, 10, true, true);
        $('b1').value = randCoef(-10, 10, false, false);
        $('c1').value = randCoef(-10, 10, false, false);
    } else {
        const a = randCoef(1, 10, true, true);
        let c;
        do { 
            c = randCoef(1, 10, true, true); 
        } while (a === c && Math.random() > 0.15);
        
        $('a2').value = a;
        $('b2').value = randCoef(-10, 10, false, false);
        $('c2').value = c;
        $('d2').value = randCoef(-10, 10, false, false);
    }
    updateEquationDisplay();
}

/**
 * Résout l'équation et affiche les étapes
 */
function solveEquation() {
    const eq = getEquationValues();
    let html = '';
    
    if (eq.type === 'type1') {
        html = solveType1(eq.a, eq.b, eq.c);
    } else {
        html = solveType2(eq.a, eq.b, eq.c, eq.d);
    }
    
    updateHTML('stepsContainer', html);
    showSolution();
}

/**
 * Résout une équation de type ax + b = c
 * @param {number} a 
 * @param {number} b 
 * @param {number} c 
 * @returns {string} HTML des étapes
 */
function solveType1(a, b, c) {
    let html = '';
    
    html += createStepHTML({
        expression: `${formatTerm(a, 'x', true)}${formatTerm(b, '', false)} = ${c}`,
        explanation: 'Équation de départ'
    });
    
    // Cas a = 0
    if (a === 0) {
        if (b === c) {
            html += createAlertHTML('info', '<strong>♾️ Infinité de solutions</strong><br>L\'équation est toujours vraie.');
        } else {
            html += createAlertHTML('warning', '<strong>∅ Aucune solution</strong><br>L\'équation est impossible.');
        }
        return html;
    }
    
    // Isoler x
    if (b !== 0) {
        const op = b > 0 ? 'soustrait' : 'ajoute';
        html += createStepHTML({
            expression: `${formatTerm(a, 'x', true)} = ${c - b}`,
            explanation: `On ${op} ${Math.abs(b)} des deux côtés`
        });
    }
    
    const num = c - b;
    const result = num / a;
    
    if (a !== 1) {
        html += createStepHTML({
            expression: `x = ${formatFraction(num, a)}`,
            explanation: `On divise par ${a}`
        });
    }
    
    if (!Number.isInteger(result) && Math.abs(a) > 1) {
        html += createStepHTML({
            expression: `x = ${formatNumber(result)}`,
            explanation: 'En décimal'
        });
    }
    
    // Vérification
    const verif = a * result + b;
    html += createVerificationHTML(
        `${a} × ${formatNumber(result)} + ${b} = ${formatNumber(verif)}`,
        formatNumber(verif),
        c
    );
    
    return html;
}

/**
 * Résout une équation de type ax + b = cx + d
 * @param {number} a 
 * @param {number} b 
 * @param {number} c 
 * @param {number} d 
 * @returns {string} HTML des étapes
 */
function solveType2(a, b, c, d) {
    let html = '';
    
    html += createStepHTML({
        expression: `${formatTerm(a, 'x', true)}${formatTerm(b, '', false)} = ${formatTerm(c, 'x', true)}${formatTerm(d, '', false)}`,
        explanation: 'Équation de départ'
    });
    
    const newA = a - c;
    
    if (c !== 0) {
        const op = c > 0 ? 'soustrait' : 'ajoute';
        html += createStepHTML({
            expression: `${formatTerm(newA, 'x', true)}${formatTerm(b, '', false)} = ${d}`,
            explanation: `On ${op} ${Math.abs(c)}x des deux côtés`
        });
    }
    
    // Cas particulier
    if (newA === 0) {
        if (b === d) {
            html += createAlertHTML('info', '<strong>♾️ Infinité de solutions</strong><br>L\'équation est toujours vraie.');
        } else {
            html += createAlertHTML('warning', '<strong>∅ Aucune solution</strong><br>L\'équation est impossible.');
        }
        return html;
    }
    
    const newC = d - b;
    
    if (b !== 0) {
        const op = b > 0 ? 'soustrait' : 'ajoute';
        html += createStepHTML({
            expression: `${formatTerm(newA, 'x', true)} = ${newC}`,
            explanation: `On ${op} ${Math.abs(b)} des deux côtés`
        });
    }
    
    const result = newC / newA;
    
    if (newA !== 1) {
        html += createStepHTML({
            expression: `x = ${formatFraction(newC, newA)}`,
            explanation: `On divise par ${newA}`
        });
    }
    
    if (!Number.isInteger(result) && Math.abs(newA) > 1) {
        html += createStepHTML({
            expression: `x = ${formatNumber(result)}`,
            explanation: 'En décimal'
        });
    }
    
    // Vérification
    const verifL = a * result + b;
    const verifR = c * result + d;
    html += `
        <div class="verification">
            <div class="verification-title">✓ Vérification</div>
            <div>Gauche: ${a} × ${formatNumber(result)} + ${b} = ${formatNumber(verifL)}</div>
            <div>Droite: ${c} × ${formatNumber(result)} + ${d} = ${formatNumber(verifR)}</div>
        </div>
    `;
    
    return html;
}

/**
 * Change le type d'équation
 * @param {string} type 
 */
function changeEquationType(type) {
    EquationsState.currentType = type;
    
    toggleClass('coeffType1', 'hidden', type !== 'type1');
    toggleClass('coeffType2', 'hidden', type !== 'type2');
    
    updateEquationDisplay();
}

/**
 * Initialise la page équations
 */
function initEquationsPage() {
    // Sélecteur de type
    initTypeSelector('.type-btn', changeEquationType);
    
    // Boutons
    $('generateBtn').addEventListener('click', generateEquation);
    $('solveBtn').addEventListener('click', solveEquation);
    
    // Inputs
    document.querySelectorAll('input').forEach(inp => {
        inp.addEventListener('input', updateEquationDisplay);
    });
    
    // Affichage initial
    updateEquationDisplay();
}

// Export pour les tests
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        solveType1,
        solveType2,
        getEquationValues
    };
}
