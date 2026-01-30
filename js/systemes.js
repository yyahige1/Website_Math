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

    // Formule box avec le système initial
    html += '<div class="formula-box">';
    html += '<div class="formula-title">📐 Système à résoudre</div>';
    html += '<div class="formula-system">';
    html += '<span>{</span>';
    html += '<div class="formula-system-lines">';
    html += `<div>${formatLinearEquation(sys.a1, sys.b1, sys.c1)}</div>`;
    html += `<div>${formatLinearEquation(sys.a2, sys.b2, sys.c2)}</div>`;
    html += '</div></div></div>';

    if (sys.a1 !== 0) {
        const coefY = -sys.b1 / sys.a1;
        const constante = sys.c1 / sys.a1;

        // Étape 1 : Isoler x
        html += '<div class="step-box step-1">';
        html += '<div class="step-number">📍 Étape 1 : Isoler x dans la première équation</div>';

        html += '<div class="transform-box">';
        html += '<div class="transform-title">⚙️ Équation de départ</div>';
        html += `<div class="transform-content">${formatLinearEquation(sys.a1, sys.b1, sys.c1)}</div>`;
        html += '</div>';

        html += '<div class="calculation-detail">';
        html += '<div class="calc-line">On isole le terme en x :</div>';
        html += `<div class="calc-line">${formatNumber(sys.a1)}x = ${formatNumber(sys.c1)}${sys.b1 !== 0 ? formatTerm(-sys.b1, 'y', false) : ''}</div>`;
        html += '</div>';

        html += '<div class="arithmetic-step">';
        html += '<div class="step-desc">Division par ' + formatNumber(sys.a1) + ' :</div>';
        html += '<div class="step-calc">';
        html += `x = ${formatNumber(sys.c1)}/${formatNumber(sys.a1)}${sys.b1 !== 0 ? ' + (' + formatNumber(-sys.b1) + ')/' + formatNumber(sys.a1) + 'y' : ''}`;
        html += '</div></div>';

        html += '<div class="result-box">';
        html += '<div class="result-label">✓ Expression de x</div>';
        html += `<div class="result-value">x = ${formatNumber(constante)}${coefY !== 0 ? formatTerm(coefY, 'y', false) : ''}</div>`;
        html += '</div>';
        html += '</div>';

        // Étape 2 : Substitution
        html += '<div class="step-box step-2">';
        html += '<div class="step-number">📍 Étape 2 : Substituer x dans la deuxième équation</div>';

        html += '<div class="transform-box">';
        html += '<div class="transform-title">⚙️ Deuxième équation</div>';
        html += `<div class="transform-content">${formatLinearEquation(sys.a2, sys.b2, sys.c2)}</div>`;
        html += '</div>';

        html += '<div class="substitution-box">';
        html += '<div class="substitution-label">🔄 On remplace x par son expression</div>';
        html += `<div class="substitution-content">x = ${formatNumber(constante)}${coefY !== 0 ? formatTerm(coefY, 'y', false) : ''}</div>`;
        html += '</div>';

        html += '<div class="calculation-detail">';
        html += `<div class="calc-line">${formatNumber(sys.a2)}(${formatNumber(constante)}${coefY !== 0 ? formatTerm(coefY, 'y', false) : ''})${sys.b2 !== 0 ? formatTerm(sys.b2, 'y', false) : ''} = ${formatNumber(sys.c2)}</div>`;
        html += '</div>';

        html += '<div class="arithmetic-step">';
        html += '<div class="step-desc">Développement du produit :</div>';
        const prodConstante = sys.a2 * constante;
        const prodCoefY = sys.a2 * coefY;
        html += '<div class="step-calc">';
        html += `${formatNumber(prodConstante)}${prodCoefY !== 0 ? formatTerm(prodCoefY, 'y', false) : ''}${sys.b2 !== 0 ? formatTerm(sys.b2, 'y', false) : ''} = ${formatNumber(sys.c2)}`;
        html += '</div></div>';

        const newB = sys.a2 * coefY + sys.b2;
        const newC = sys.c2 - sys.a2 * constante;

        html += '<div class="arithmetic-step">';
        html += '<div class="step-desc">Regroupement des termes en y :</div>';
        html += `<div class="step-calc">${formatTerm(newB, 'y', true)} = ${formatNumber(newC)}</div>`;
        html += '</div>';

        if (Math.abs(newB) > 0.0001) {
            const y = newC / newB;

            html += '<div class="arithmetic-step">';
            html += '<div class="step-desc">Division par ' + formatNumber(newB) + ' :</div>';
            html += `<div class="step-calc">y = ${formatNumber(newC)} ÷ ${formatNumber(newB)} = ${formatNumber(y)}</div>`;
            html += '</div>';

            html += '<div class="result-box">';
            html += '<div class="result-label">✓ Valeur de y</div>';
            html += `<div class="result-value">y = <span class="value-y">${formatNumber(y)}</span></div>`;
            html += '</div>';
            html += '</div>';

            // Étape 3 : Calcul de x
            html += '<div class="step-box step-3">';
            html += '<div class="step-number">📍 Étape 3 : Calculer x en remplaçant y</div>';

            html += '<div class="substitution-box">';
            html += '<div class="substitution-label">🔄 On utilise l\'expression de x trouvée à l\'étape 1</div>';
            html += `<div class="substitution-content">x = ${formatNumber(constante)}${coefY !== 0 ? formatTerm(coefY, 'y', false) : ''}</div>`;
            html += '</div>';

            html += '<div class="arithmetic-step">';
            html += '<div class="step-desc">Remplacement de y par ' + formatNumber(y) + ' :</div>';
            html += '<div class="step-calc">';
            html += `x = ${formatNumber(constante)}${coefY !== 0 ? ' + ' + formatNumber(coefY) + ' × ' + formatNumber(y) : ''}`;
            html += '</div></div>';

            if (coefY !== 0) {
                const produit = coefY * y;
                html += '<div class="arithmetic-step">';
                html += '<div class="step-desc">Calcul du produit :</div>';
                html += `<div class="step-calc">x = ${formatNumber(constante)} + ${formatNumber(produit)}</div>`;
                html += '</div>';
            }

            const x = constante + coefY * y;

            html += '<div class="arithmetic-step">';
            html += '<div class="step-desc">Résultat final :</div>';
            html += `<div class="step-calc">x = ${formatNumber(x)}</div>`;
            html += '</div>';

            html += '<div class="result-box">';
            html += '<div class="result-label">✓ Valeur de x</div>';
            html += `<div class="result-value">x = <span class="value-x">${formatNumber(x)}</span></div>`;
            html += '</div>';
            html += '</div>';

            // Solution finale
            html += '<div class="final-result">';
            html += `S = {(<span class="color-solution">${formatNumber(x)}</span> ; <span class="color-solution">${formatNumber(y)}</span>)}`;
            html += '</div>';
        }
    }

    return html;
}

/**
 * Résolution par combinaison
 */
function solveByCombinaison(sys) {
    let html = '';

    // Formule box avec le système initial
    html += '<div class="formula-box">';
    html += '<div class="formula-title">📐 Système à résoudre</div>';
    html += '<div class="formula-system">';
    html += '<span>{</span>';
    html += '<div class="formula-system-lines">';
    html += `<div>${formatLinearEquation(sys.a1, sys.b1, sys.c1)} &nbsp;&nbsp;(L₁)</div>`;
    html += `<div>${formatLinearEquation(sys.a2, sys.b2, sys.c2)} &nbsp;&nbsp;(L₂)</div>`;
    html += '</div></div></div>';

    // Choisir la variable à éliminer (celle avec les plus petits coefficients)
    const elimY = Math.abs(sys.b1) + Math.abs(sys.b2) <= Math.abs(sys.a1) + Math.abs(sys.a2);

    if (elimY) {
        // Éliminer y
        const mult1 = sys.b2;
        const mult2 = -sys.b1;

        // Étape 1 : Multiplier les équations
        html += '<div class="step-box step-1">';
        html += '<div class="step-number">📍 Étape 1 : Multiplier les équations pour éliminer y</div>';

        html += '<div class="multiplier-box">';
        html += '<div class="multiplier-label">🔢 Choix des multiplicateurs</div>';
        html += '<div class="multiplier-content">';
        html += `On multiplie (L₁) par ${formatNumber(mult1)} et (L₂) par ${formatNumber(mult2)}`;
        html += '</div></div>';

        html += '<div class="arithmetic-step">';
        html += '<div class="step-desc">Multiplication de (L₁) par ' + formatNumber(mult1) + ' :</div>';
        const newA1 = sys.a1 * mult1;
        const newB1 = sys.b1 * mult1;
        const newC1 = sys.c1 * mult1;
        html += '<div class="step-calc">';
        html += `${formatNumber(mult1)}(${formatLinearEquation(sys.a1, sys.b1, sys.c1)})`;
        html += '</div></div>';

        html += '<div class="calculation-detail">';
        html += '<div class="calc-line">Développement :</div>';
        html += `<div class="calc-line">${formatNumber(mult1)} × ${formatNumber(sys.a1)}x + ${formatNumber(mult1)} × ${formatNumber(sys.b1)}y = ${formatNumber(mult1)} × ${formatNumber(sys.c1)}</div>`;
        html += `<div class="calc-line"><strong>${formatLinearEquation(newA1, newB1, newC1)}</strong></div>`;
        html += '</div>';

        html += '<div class="arithmetic-step">';
        html += '<div class="step-desc">Multiplication de (L₂) par ' + formatNumber(mult2) + ' :</div>';
        const newA2 = sys.a2 * mult2;
        const newB2 = sys.b2 * mult2;
        const newC2 = sys.c2 * mult2;
        html += '<div class="step-calc">';
        html += `${formatNumber(mult2)}(${formatLinearEquation(sys.a2, sys.b2, sys.c2)})`;
        html += '</div></div>';

        html += '<div class="calculation-detail">';
        html += '<div class="calc-line">Développement :</div>';
        html += `<div class="calc-line">${formatNumber(mult2)} × ${formatNumber(sys.a2)}x + ${formatNumber(mult2)} × ${formatNumber(sys.b2)}y = ${formatNumber(mult2)} × ${formatNumber(sys.c2)}</div>`;
        html += `<div class="calc-line"><strong>${formatLinearEquation(newA2, newB2, newC2)}</strong></div>`;
        html += '</div>';

        html += '<div class="transform-box">';
        html += '<div class="transform-title">📋 Nouveau système</div>';
        html += '<div class="transform-content">';
        html += '<div class="system-display">';
        html += '<span>{</span><div class="system-lines">';
        html += `<div>${formatLinearEquation(newA1, newB1, newC1)}</div>`;
        html += `<div>${formatLinearEquation(newA2, newB2, newC2)}</div>`;
        html += '</div></div></div></div>';
        html += '</div>';

        // Étape 2 : Addition
        html += '<div class="step-box step-2">';
        html += '<div class="step-number">📍 Étape 2 : Additionner les deux équations</div>';

        html += '<div class="addition-box">';
        html += '<div class="addition-label">➕ Addition membre à membre</div>';
        html += '<div class="addition-content">';
        html += `(${formatLinearEquation(newA1, newB1, newC1)}) + (${formatLinearEquation(newA2, newB2, newC2)})`;
        html += '</div></div>';

        html += '<div class="calculation-detail">';
        html += '<div class="calc-line">Termes en x : ' + formatNumber(newA1) + ' + (' + formatNumber(newA2) + ') = ' + formatNumber(newA1 + newA2) + '</div>';
        html += '<div class="calc-line">Termes en y : ' + formatNumber(newB1) + ' + (' + formatNumber(newB2) + ') = ' + formatNumber(newB1 + newB2) + '</div>';
        html += '<div class="calc-line">Second membre : ' + formatNumber(newC1) + ' + (' + formatNumber(newC2) + ') = ' + formatNumber(newC1 + newC2) + '</div>';
        html += '</div>';

        const finalA = newA1 + newA2;
        const finalC = newC1 + newC2;

        html += '<div class="arithmetic-step">';
        html += '<div class="step-desc">Équation simplifiée (y éliminé) :</div>';
        html += `<div class="step-calc">${formatTerm(finalA, 'x', true)} = ${formatNumber(finalC)}</div>`;
        html += '</div>';

        const x = finalC / finalA;

        html += '<div class="arithmetic-step">';
        html += '<div class="step-desc">Division par ' + formatNumber(finalA) + ' :</div>';
        html += `<div class="step-calc">x = ${formatNumber(finalC)} ÷ ${formatNumber(finalA)} = ${formatNumber(x)}</div>`;
        html += '</div>';

        html += '<div class="result-box">';
        html += '<div class="result-label">✓ Valeur de x</div>';
        html += `<div class="result-value">x = <span class="value-x">${formatNumber(x)}</span></div>`;
        html += '</div>';
        html += '</div>';

        // Étape 3 : Calcul de y
        html += '<div class="step-box step-3">';
        html += '<div class="step-number">📍 Étape 3 : Calculer y en remplaçant x dans (L₁)</div>';

        html += '<div class="transform-box">';
        html += '<div class="transform-title">⚙️ Équation (L₁)</div>';
        html += `<div class="transform-content">${formatLinearEquation(sys.a1, sys.b1, sys.c1)}</div>`;
        html += '</div>';

        html += '<div class="substitution-box">';
        html += '<div class="substitution-label">🔄 On remplace x par ' + formatNumber(x) + '</div>';
        html += '<div class="substitution-content">';
        html += `${formatNumber(sys.a1)} × ${formatNumber(x)}${sys.b1 !== 0 ? formatTerm(sys.b1, 'y', false) : ''} = ${formatNumber(sys.c1)}`;
        html += '</div></div>';

        const leftSide = sys.a1 * x;
        html += '<div class="arithmetic-step">';
        html += '<div class="step-desc">Calcul du produit ' + formatNumber(sys.a1) + ' × ' + formatNumber(x) + ' :</div>';
        html += `<div class="step-calc">${formatNumber(leftSide)}${sys.b1 !== 0 ? formatTerm(sys.b1, 'y', false) : ''} = ${formatNumber(sys.c1)}</div>`;
        html += '</div>';

        const rightY = sys.c1 - leftSide;
        html += '<div class="arithmetic-step">';
        html += '<div class="step-desc">Isoler le terme en y :</div>';
        html += `<div class="step-calc">${formatTerm(sys.b1, 'y', true)} = ${formatNumber(sys.c1)} - ${formatNumber(leftSide)} = ${formatNumber(rightY)}</div>`;
        html += '</div>';

        const y = rightY / sys.b1;
        html += '<div class="arithmetic-step">';
        html += '<div class="step-desc">Division par ' + formatNumber(sys.b1) + ' :</div>';
        html += `<div class="step-calc">y = ${formatNumber(rightY)} ÷ ${formatNumber(sys.b1)} = ${formatNumber(y)}</div>`;
        html += '</div>';

        html += '<div class="result-box">';
        html += '<div class="result-label">✓ Valeur de y</div>';
        html += `<div class="result-value">y = <span class="value-y">${formatNumber(y)}</span></div>`;
        html += '</div>';
        html += '</div>';

        // Solution finale
        html += '<div class="final-result">';
        html += `S = {(<span class="color-solution">${formatNumber(x)}</span> ; <span class="color-solution">${formatNumber(y)}</span>)}`;
        html += '</div>';

    } else {
        // Éliminer x
        const mult1 = sys.a2;
        const mult2 = -sys.a1;

        // Étape 1 : Multiplier les équations
        html += '<div class="step-box step-1">';
        html += '<div class="step-number">📍 Étape 1 : Multiplier les équations pour éliminer x</div>';

        html += '<div class="multiplier-box">';
        html += '<div class="multiplier-label">🔢 Choix des multiplicateurs</div>';
        html += '<div class="multiplier-content">';
        html += `On multiplie (L₁) par ${formatNumber(mult1)} et (L₂) par ${formatNumber(mult2)}`;
        html += '</div></div>';

        html += '<div class="arithmetic-step">';
        html += '<div class="step-desc">Multiplication de (L₁) par ' + formatNumber(mult1) + ' :</div>';
        const newA1 = sys.a1 * mult1;
        const newB1 = sys.b1 * mult1;
        const newC1 = sys.c1 * mult1;
        html += '<div class="step-calc">';
        html += `${formatNumber(mult1)}(${formatLinearEquation(sys.a1, sys.b1, sys.c1)})`;
        html += '</div></div>';

        html += '<div class="calculation-detail">';
        html += '<div class="calc-line">Développement :</div>';
        html += `<div class="calc-line">${formatNumber(mult1)} × ${formatNumber(sys.a1)}x + ${formatNumber(mult1)} × ${formatNumber(sys.b1)}y = ${formatNumber(mult1)} × ${formatNumber(sys.c1)}</div>`;
        html += `<div class="calc-line"><strong>${formatLinearEquation(newA1, newB1, newC1)}</strong></div>`;
        html += '</div>';

        html += '<div class="arithmetic-step">';
        html += '<div class="step-desc">Multiplication de (L₂) par ' + formatNumber(mult2) + ' :</div>';
        const newA2 = sys.a2 * mult2;
        const newB2 = sys.b2 * mult2;
        const newC2 = sys.c2 * mult2;
        html += '<div class="step-calc">';
        html += `${formatNumber(mult2)}(${formatLinearEquation(sys.a2, sys.b2, sys.c2)})`;
        html += '</div></div>';

        html += '<div class="calculation-detail">';
        html += '<div class="calc-line">Développement :</div>';
        html += `<div class="calc-line">${formatNumber(mult2)} × ${formatNumber(sys.a2)}x + ${formatNumber(mult2)} × ${formatNumber(sys.b2)}y = ${formatNumber(mult2)} × ${formatNumber(sys.c2)}</div>`;
        html += `<div class="calc-line"><strong>${formatLinearEquation(newA2, newB2, newC2)}</strong></div>`;
        html += '</div>';

        html += '<div class="transform-box">';
        html += '<div class="transform-title">📋 Nouveau système</div>';
        html += '<div class="transform-content">';
        html += '<div class="system-display">';
        html += '<span>{</span><div class="system-lines">';
        html += `<div>${formatLinearEquation(newA1, newB1, newC1)}</div>`;
        html += `<div>${formatLinearEquation(newA2, newB2, newC2)}</div>`;
        html += '</div></div></div></div>';
        html += '</div>';

        // Étape 2 : Addition
        html += '<div class="step-box step-2">';
        html += '<div class="step-number">📍 Étape 2 : Additionner les deux équations</div>';

        html += '<div class="addition-box">';
        html += '<div class="addition-label">➕ Addition membre à membre</div>';
        html += '<div class="addition-content">';
        html += `(${formatLinearEquation(newA1, newB1, newC1)}) + (${formatLinearEquation(newA2, newB2, newC2)})`;
        html += '</div></div>';

        html += '<div class="calculation-detail">';
        html += '<div class="calc-line">Termes en x : ' + formatNumber(newA1) + ' + (' + formatNumber(newA2) + ') = ' + formatNumber(newA1 + newA2) + '</div>';
        html += '<div class="calc-line">Termes en y : ' + formatNumber(newB1) + ' + (' + formatNumber(newB2) + ') = ' + formatNumber(newB1 + newB2) + '</div>';
        html += '<div class="calc-line">Second membre : ' + formatNumber(newC1) + ' + (' + formatNumber(newC2) + ') = ' + formatNumber(newC1 + newC2) + '</div>';
        html += '</div>';

        const finalB = newB1 + newB2;
        const finalC = newC1 + newC2;

        html += '<div class="arithmetic-step">';
        html += '<div class="step-desc">Équation simplifiée (x éliminé) :</div>';
        html += `<div class="step-calc">${formatTerm(finalB, 'y', true)} = ${formatNumber(finalC)}</div>`;
        html += '</div>';

        const y = finalC / finalB;

        html += '<div class="arithmetic-step">';
        html += '<div class="step-desc">Division par ' + formatNumber(finalB) + ' :</div>';
        html += `<div class="step-calc">y = ${formatNumber(finalC)} ÷ ${formatNumber(finalB)} = ${formatNumber(y)}</div>`;
        html += '</div>';

        html += '<div class="result-box">';
        html += '<div class="result-label">✓ Valeur de y</div>';
        html += `<div class="result-value">y = <span class="value-y">${formatNumber(y)}</span></div>`;
        html += '</div>';
        html += '</div>';

        // Étape 3 : Calcul de x
        html += '<div class="step-box step-3">';
        html += '<div class="step-number">📍 Étape 3 : Calculer x en remplaçant y dans (L₁)</div>';

        html += '<div class="transform-box">';
        html += '<div class="transform-title">⚙️ Équation (L₁)</div>';
        html += `<div class="transform-content">${formatLinearEquation(sys.a1, sys.b1, sys.c1)}</div>`;
        html += '</div>';

        html += '<div class="substitution-box">';
        html += '<div class="substitution-label">🔄 On remplace y par ' + formatNumber(y) + '</div>';
        html += '<div class="substitution-content">';
        html += `${sys.a1 !== 0 ? formatTerm(sys.a1, 'x', true) : ''} + ${formatNumber(sys.b1)} × ${formatNumber(y)} = ${formatNumber(sys.c1)}`;
        html += '</div></div>';

        const rightSide = sys.b1 * y;
        html += '<div class="arithmetic-step">';
        html += '<div class="step-desc">Calcul du produit ' + formatNumber(sys.b1) + ' × ' + formatNumber(y) + ' :</div>';
        html += `<div class="step-calc">${sys.a1 !== 0 ? formatTerm(sys.a1, 'x', true) : ''} + ${formatNumber(rightSide)} = ${formatNumber(sys.c1)}</div>`;
        html += '</div>';

        const rightX = sys.c1 - rightSide;
        html += '<div class="arithmetic-step">';
        html += '<div class="step-desc">Isoler le terme en x :</div>';
        html += `<div class="step-calc">${sys.a1 !== 0 ? formatTerm(sys.a1, 'x', true) : ''} = ${formatNumber(sys.c1)} - ${formatNumber(rightSide)} = ${formatNumber(rightX)}</div>`;
        html += '</div>';

        const x = rightX / sys.a1;
        html += '<div class="arithmetic-step">';
        html += '<div class="step-desc">Division par ' + formatNumber(sys.a1) + ' :</div>';
        html += `<div class="step-calc">x = ${formatNumber(rightX)} ÷ ${formatNumber(sys.a1)} = ${formatNumber(x)}</div>`;
        html += '</div>';

        html += '<div class="result-box">';
        html += '<div class="result-label">✓ Valeur de x</div>';
        html += `<div class="result-value">x = <span class="value-x">${formatNumber(x)}</span></div>`;
        html += '</div>';
        html += '</div>';

        // Solution finale
        html += '<div class="final-result">';
        html += `S = {(<span class="color-solution">${formatNumber(x)}</span> ; <span class="color-solution">${formatNumber(y)}</span>)}`;
        html += '</div>';
    }

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
