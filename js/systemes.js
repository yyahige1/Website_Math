/* ========================================
   SYSTEMES.JS - Systèmes d'équations linéaires
   ======================================== */

/**
 * État du module systèmes d'équations
 */
const SystemesState = {
    currentMethod: 'substitution'
};

/**
 * Récupère les valeurs du système
 * @returns {Object}
 */
function getSystemValues() {
    return {
        a1: parseFloat($('a1').value) || 0,
        b1: parseFloat($('b1').value) || 0,
        c1: parseFloat($('c1').value) || 0,
        a2: parseFloat($('a2').value) || 0,
        b2: parseFloat($('b2').value) || 0,
        c2: parseFloat($('c2').value) || 0,
        method: SystemesState.currentMethod
    };
}

/**
 * Formate un terme (coefficient + variable)
 * @param {number} coef - Coefficient
 * @param {string} variable - Variable (x ou y)
 * @param {boolean} isFirst - Premier terme de l'équation
 * @returns {string}
 */
function formatTerm(coef, variable, isFirst = false) {
    if (coef === 0) return '';

    let result = '';

    if (isFirst) {
        if (coef === 1) {
            result = variable;
        } else if (coef === -1) {
            result = '-' + variable;
        } else {
            result = formatNumber(coef) + variable;
        }
    } else {
        if (coef > 0) {
            result = ' + ';
            if (coef === 1) {
                result += variable;
            } else {
                result += formatNumber(coef) + variable;
            }
        } else {
            result = ' - ';
            if (coef === -1) {
                result += variable;
            } else {
                result += formatNumber(Math.abs(coef)) + variable;
            }
        }
    }

    return result;
}

/**
 * Formate une équation linéaire
 * @param {number} a - Coefficient de x
 * @param {number} b - Coefficient de y
 * @param {number} c - Terme constant
 * @returns {string}
 */
function formatLinearEquation(a, b, c) {
    let eq = '';

    if (a !== 0) {
        eq += formatTerm(a, 'x', true);
    }

    if (b !== 0) {
        eq += formatTerm(b, 'y', eq === '');
    }

    if (eq === '') {
        eq = '0';
    }

    return eq + ' = ' + formatNumber(c);
}

/**
 * Met à jour l'affichage du système
 */
function updateSystemDisplay() {
    const sys = getSystemValues();

    const eq1 = formatLinearEquation(sys.a1, sys.b1, sys.c1);
    const eq2 = formatLinearEquation(sys.a2, sys.b2, sys.c2);

    const display = `
        <div class="system-display">
            <span>{</span>
            <div class="system-lines">
                <div>${eq1}</div>
                <div>${eq2}</div>
            </div>
        </div>
    `;

    updateHTML('expressionDisplay', display);
    hideSolution();
}

/**
 * Génère un système aléatoire
 */
function generateSystem() {
    // Générer des coefficients qui donnent une solution "propre"
    const x = randCoef(-5, 5, false, true);
    const y = randCoef(-5, 5, false, true);

    // Générer les coefficients de la première équation
    const a1 = randCoef(1, 5, false, true);
    const b1 = randCoef(1, 5, false, true);
    const c1 = a1 * x + b1 * y;

    // Générer les coefficients de la deuxième équation
    let a2 = randCoef(1, 5, false, true);
    let b2 = randCoef(1, 5, false, true);

    // Vérifier que les équations ne sont pas proportionnelles
    while (a1 * b2 === a2 * b1) {
        a2 = randCoef(1, 5, false, true);
        b2 = randCoef(1, 5, false, true);
    }

    const c2 = a2 * x + b2 * y;

    $('a1').value = a1;
    $('b1').value = b1;
    $('c1').value = c1;
    $('a2').value = a2;
    $('b2').value = b2;
    $('c2').value = c2;

    updateSystemDisplay();
}

/**
 * Résout le système et affiche les étapes
 */
function solveSystem() {
    const sys = getSystemValues();
    let html = '<div class="steps">';

    // Vérifier que les équations ne sont pas proportionnelles
    const det = sys.a1 * sys.b2 - sys.a2 * sys.b1;

    if (det === 0) {
        html += '<div class="step">';
        html += '<div class="step-title">⚠️ Système impossible ou indéterminé</div>';
        html += '<div class="step-content highlight-danger">';
        html += '<p>Les deux équations sont proportionnelles ou incompatibles.</p>';
        html += '<p>Le système n\'a pas de solution unique.</p>';
        html += '</div></div>';
    } else {
        if (sys.method === 'substitution') {
            html += solveBySubstitution(sys);
        } else {
            html += solveByCombinaison(sys);
        }
    }

    html += '</div>';
    updateHTML('stepsContainer', html);
    showSolution();
}

/**
 * Résolution par substitution
 */
function solveBySubstitution(sys) {
    let html = '';

    // Étape 1 : Isoler une variable
    html += '<div class="step">';
    html += '<div class="step-title">Étape 1 : Isoler une variable</div>';
    html += '<div class="step-content">';
    html += '<p>À partir de la première équation, on exprime x en fonction de y :</p>';
    html += `<div class="math-line">${formatLinearEquation(sys.a1, sys.b1, sys.c1)}</div>`;

    if (sys.a1 !== 0) {
        html += `<div class="math-line">${formatNumber(sys.a1)}x = ${formatNumber(sys.c1)}${sys.b1 !== 0 ? formatTerm(-sys.b1, 'y', false) : ''}</div>`;
        const coefY = -sys.b1 / sys.a1;
        const constante = sys.c1 / sys.a1;

        html += `<div class="highlight-box">x = ${formatNumber(constante)}${coefY !== 0 ? formatTerm(coefY, 'y', false) : ''}</div>`;

        // Étape 2 : Substitution
        html += '</div></div>';
        html += '<div class="step">';
        html += '<div class="step-title">Étape 2 : Substitution dans la deuxième équation</div>';
        html += '<div class="step-content">';
        html += `<div class="math-line">${formatLinearEquation(sys.a2, sys.b2, sys.c2)}</div>`;
        html += `<p>On remplace x par ${formatNumber(constante)}${coefY !== 0 ? formatTerm(coefY, 'y', false) : ''} :</p>`;

        const newB = sys.a2 * coefY + sys.b2;
        const newC = sys.c2 - sys.a2 * constante;

        html += `<div class="math-line">${formatNumber(sys.a2)}(${formatNumber(constante)}${coefY !== 0 ? formatTerm(coefY, 'y', false) : ''})${sys.b2 !== 0 ? formatTerm(sys.b2, 'y', false) : ''} = ${formatNumber(sys.c2)}</div>`;

        if (Math.abs(newB) > 0.0001) {
            html += `<div class="math-line">${formatTerm(newB, 'y', true)} = ${formatNumber(newC)}</div>`;

            const y = newC / newB;
            html += `<div class="highlight-success">y = <span class="color-solution">${formatNumber(y)}</span></div>`;

            // Étape 3 : Calcul de x
            html += '</div></div>';
            html += '<div class="step">';
            html += '<div class="step-title">Étape 3 : Calcul de x</div>';
            html += '<div class="step-content">';
            html += `<div class="math-line">x = ${formatNumber(constante)}${coefY !== 0 ? formatTerm(coefY, 'y', false) : ''}</div>`;
            html += `<div class="math-line">x = ${formatNumber(constante)}${coefY !== 0 ? ' ' + (coefY > 0 ? '+' : '-') + ' ' + formatNumber(Math.abs(coefY)) + ' × ' + formatNumber(y) : ''}</div>`;

            const x = constante + coefY * y;
            html += `<div class="highlight-success">x = <span class="color-solution">${formatNumber(x)}</span></div>`;

            // Solution finale
            html += '<div class="final-result">';
            html += `S = {(<span class="color-solution">${formatNumber(x)}</span> ; <span class="color-solution">${formatNumber(y)}</span>)}`;
            html += '</div>';
        }
    }

    html += '</div></div>';

    return html;
}

/**
 * Résolution par combinaison
 */
function solveByCombinaison(sys) {
    let html = '';

    // Étape 1 : Système initial
    html += '<div class="step">';
    html += '<div class="step-title">Étape 1 : Système de départ</div>';
    html += '<div class="step-content">';
    html += '<div class="system-display">';
    html += '<span>{</span><div class="system-lines">';
    html += `<div>${formatLinearEquation(sys.a1, sys.b1, sys.c1)} &nbsp;&nbsp;(L₁)</div>`;
    html += `<div>${formatLinearEquation(sys.a2, sys.b2, sys.c2)} &nbsp;&nbsp;(L₂)</div>`;
    html += '</div></div>';
    html += '</div></div>';

    // Étape 2 : Éliminer une variable
    html += '<div class="step">';
    html += '<div class="step-title">Étape 2 : Élimination d\'une variable</div>';
    html += '<div class="step-content">';

    // Choisir la variable à éliminer (celle avec les plus petits coefficients)
    const elimY = Math.abs(sys.b1) + Math.abs(sys.b2) <= Math.abs(sys.a1) + Math.abs(sys.a2);

    if (elimY) {
        // Éliminer y
        html += `<p>On élimine y en multipliant (L₁) par ${formatNumber(sys.b2)} et (L₂) par ${formatNumber(-sys.b1)} :</p>`;

        const mult1 = sys.b2;
        const mult2 = -sys.b1;

        const newA1 = sys.a1 * mult1;
        const newB1 = sys.b1 * mult1;
        const newC1 = sys.c1 * mult1;

        const newA2 = sys.a2 * mult2;
        const newB2 = sys.b2 * mult2;
        const newC2 = sys.c2 * mult2;

        html += '<div class="system-display">';
        html += '<span>{</span><div class="system-lines">';
        html += `<div>${formatLinearEquation(newA1, newB1, newC1)}</div>`;
        html += `<div>${formatLinearEquation(newA2, newB2, newC2)}</div>`;
        html += '</div></div>';

        html += '<p>On additionne les deux équations :</p>';

        const finalA = newA1 + newA2;
        const finalC = newC1 + newC2;

        html += `<div class="math-line">${formatTerm(finalA, 'x', true)} = ${formatNumber(finalC)}</div>`;

        const x = finalC / finalA;
        html += `<div class="highlight-success">x = <span class="color-solution">${formatNumber(x)}</span></div>`;

        // Étape 3 : Calcul de y
        html += '</div></div>';
        html += '<div class="step">';
        html += '<div class="step-title">Étape 3 : Calcul de y</div>';
        html += '<div class="step-content">';
        html += `<p>On remplace x = ${formatNumber(x)} dans (L₁) :</p>`;
        html += `<div class="math-line">${formatLinearEquation(sys.a1, sys.b1, sys.c1)}</div>`;
        html += `<div class="math-line">${formatNumber(sys.a1)} × ${formatNumber(x)}${sys.b1 !== 0 ? formatTerm(sys.b1, 'y', false) : ''} = ${formatNumber(sys.c1)}</div>`;

        const leftSide = sys.a1 * x;
        html += `<div class="math-line">${formatNumber(leftSide)}${sys.b1 !== 0 ? formatTerm(sys.b1, 'y', false) : ''} = ${formatNumber(sys.c1)}</div>`;

        const y = (sys.c1 - leftSide) / sys.b1;
        html += `<div class="math-line">${formatTerm(sys.b1, 'y', true)} = ${formatNumber(sys.c1 - leftSide)}</div>`;
        html += `<div class="highlight-success">y = <span class="color-solution">${formatNumber(y)}</span></div>`;

        // Solution finale
        html += '<div class="final-result">';
        html += `S = {(<span class="color-solution">${formatNumber(x)}</span> ; <span class="color-solution">${formatNumber(y)}</span>)}`;
        html += '</div>';

    } else {
        // Éliminer x (logique similaire)
        html += `<p>On élimine x en multipliant (L₁) par ${formatNumber(sys.a2)} et (L₂) par ${formatNumber(-sys.a1)} :</p>`;

        const mult1 = sys.a2;
        const mult2 = -sys.a1;

        const newA1 = sys.a1 * mult1;
        const newB1 = sys.b1 * mult1;
        const newC1 = sys.c1 * mult1;

        const newA2 = sys.a2 * mult2;
        const newB2 = sys.b2 * mult2;
        const newC2 = sys.c2 * mult2;

        html += '<div class="system-display">';
        html += '<span>{</span><div class="system-lines">';
        html += `<div>${formatLinearEquation(newA1, newB1, newC1)}</div>`;
        html += `<div>${formatLinearEquation(newA2, newB2, newC2)}</div>`;
        html += '</div></div>';

        html += '<p>On additionne les deux équations :</p>';

        const finalB = newB1 + newB2;
        const finalC = newC1 + newC2;

        html += `<div class="math-line">${formatTerm(finalB, 'y', true)} = ${formatNumber(finalC)}</div>`;

        const y = finalC / finalB;
        html += `<div class="highlight-success">y = <span class="color-solution">${formatNumber(y)}</span></div>`;

        // Étape 3 : Calcul de x
        html += '</div></div>';
        html += '<div class="step">';
        html += '<div class="step-title">Étape 3 : Calcul de x</div>';
        html += '<div class="step-content">';
        html += `<p>On remplace y = ${formatNumber(y)} dans (L₁) :</p>`;
        html += `<div class="math-line">${formatLinearEquation(sys.a1, sys.b1, sys.c1)}</div>`;
        html += `<div class="math-line">${sys.a1 !== 0 ? formatTerm(sys.a1, 'x', true) : ''}${formatNumber(sys.b1)} × ${formatNumber(y)} = ${formatNumber(sys.c1)}</div>`;

        const rightSide = sys.b1 * y;
        html += `<div class="math-line">${sys.a1 !== 0 ? formatTerm(sys.a1, 'x', true) : ''} = ${formatNumber(sys.c1 - rightSide)}</div>`;

        const x = (sys.c1 - rightSide) / sys.a1;
        html += `<div class="highlight-success">x = <span class="color-solution">${formatNumber(x)}</span></div>`;

        // Solution finale
        html += '<div class="final-result">';
        html += `S = {(<span class="color-solution">${formatNumber(x)}</span> ; <span class="color-solution">${formatNumber(y)}</span>)}`;
        html += '</div>';
    }

    html += '</div></div>';

    return html;
}

/**
 * Initialise la page systèmes d'équations
 */
function initSystemesPage() {
    // Initialiser le sélecteur de méthodes
    initTypeSelector('.type-btn', (method) => {
        SystemesState.currentMethod = method;
        updateSystemDisplay();
    });

    // Écouteurs d'événements pour les inputs
    const allInputs = document.querySelectorAll('.coefficients input');
    allInputs.forEach(input => {
        input.addEventListener('input', updateSystemDisplay);
    });

    // Boutons
    $('generateBtn').addEventListener('click', generateSystem);
    $('solveBtn').addEventListener('click', solveSystem);

    // Générer un premier système
    generateSystem();
}
