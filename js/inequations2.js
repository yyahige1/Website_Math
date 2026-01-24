/* ========================================
   INEQUATIONS2.JS - Inéquations du 2nd degré
   ======================================== */

/**
 * État du module inéquations du 2nd degré
 */
const Inequations2State = {
    currentA: 1,
    currentB: -5,
    currentC: 6,
    currentSign: '>'
};

/**
 * Récupère les valeurs des coefficients et du signe
 * @returns {Object}
 */
function getInequation2Values() {
    return {
        a: parseFloat($('a_ineq').value) || 1,
        b: parseFloat($('b_ineq').value) || 0,
        c: parseFloat($('c_ineq').value) || 0,
        sign: $('sign_ineq').value
    };
}

/**
 * Génère une fraction HTML avec barre horizontale
 * @param {number} num - Numérateur
 * @param {number} den - Dénominateur
 * @returns {string}
 */
function generateFraction(num, den) {
    return `<span class="frac"><span class="num">${formatNumber(num)}</span><span class="den">${formatNumber(den)}</span></span>`;
}

/**
 * Formate une inéquation du second degré
 * @param {number} a - Coefficient de x²
 * @param {number} b - Coefficient de x
 * @param {number} c - Terme constant
 * @param {string} sign - Signe de l'inéquation
 * @returns {string}
 */
function formatQuadraticInequation(a, b, c, sign) {
    let eq = '';

    // Terme en x²
    if (a === 1) {
        eq = 'x²';
    } else if (a === -1) {
        eq = '-x²';
    } else {
        eq = `${formatNumber(a)}x²`;
    }

    // Terme en x
    if (b !== 0) {
        if (b > 0) {
            eq += ' + ';
            if (b === 1) {
                eq += 'x';
            } else {
                eq += `${formatNumber(b)}x`;
            }
        } else {
            eq += ' - ';
            if (b === -1) {
                eq += 'x';
            } else {
                eq += `${formatNumber(Math.abs(b))}x`;
            }
        }
    }

    // Terme constant
    if (c !== 0) {
        if (c > 0) {
            eq += ` + ${formatNumber(c)}`;
        } else {
            eq += ` - ${formatNumber(Math.abs(c))}`;
        }
    }

    // Symbole de l'inéquation
    const signSymbol = sign === '>=' ? '≥' : sign === '<=' ? '≤' : sign;

    return eq + ' ' + signSymbol + ' 0';
}

/**
 * Met à jour l'affichage de l'inéquation
 */
function updateInequation2Display() {
    const ineq = getInequation2Values();
    const display = formatQuadraticInequation(ineq.a, ineq.b, ineq.c, ineq.sign);

    updateText('expressionDisplay', display);
    hideSolution();
}

/**
 * Génère une inéquation aléatoire
 */
function generateInequation2() {
    $('a_ineq').value = randCoef(1, 5, false, true);
    $('b_ineq').value = randCoef(-10, 10, false, false);
    $('c_ineq').value = randCoef(-10, 10, false, false);

    const signs = ['>', '>=', '<', '<='];
    $('sign_ineq').value = signs[Math.floor(Math.random() * signs.length)];

    updateInequation2Display();
}

/**
 * Calcule le discriminant et résout l'équation
 * @param {number} a
 * @param {number} b
 * @param {number} c
 * @returns {Object}
 */
function solveEquation(a, b, c) {
    const delta = b * b - 4 * a * c;

    if (delta > 0) {
        const x1 = (-b - Math.sqrt(delta)) / (2 * a);
        const x2 = (-b + Math.sqrt(delta)) / (2 * a);
        return {
            delta: delta,
            nbSolutions: 2,
            x1: Math.min(x1, x2),  // Assurer que x1 < x2
            x2: Math.max(x1, x2)
        };
    } else if (delta === 0) {
        const x0 = -b / (2 * a);
        return {
            delta: 0,
            nbSolutions: 1,
            x0: x0
        };
    } else {
        return {
            delta: delta,
            nbSolutions: 0
        };
    }
}

/**
 * Détermine le signe du trinôme ax² + bx + c
 * @param {number} a
 * @param {Object} solution - Résultat de solveEquation
 * @returns {Object} - Intervalles où le trinôme est positif et négatif
 */
function getSignIntervals(a, solution) {
    if (solution.nbSolutions === 0) {
        // Pas de racines : signe constant
        if (a > 0) {
            return { positive: 'R', negative: 'empty' };
        } else {
            return { positive: 'empty', negative: 'R' };
        }
    } else if (solution.nbSolutions === 1) {
        // Une racine double
        if (a > 0) {
            return {
                positive: `]-∞; ${formatNumber(solution.x0)}[ ∪ ]${formatNumber(solution.x0)}; +∞[`,
                zero: solution.x0,
                negative: 'empty'
            };
        } else {
            return {
                positive: 'empty',
                zero: solution.x0,
                negative: `]-∞; ${formatNumber(solution.x0)}[ ∪ ]${formatNumber(solution.x0)}; +∞[`
            };
        }
    } else {
        // Deux racines distinctes
        const x1 = solution.x1;
        const x2 = solution.x2;

        if (a > 0) {
            return {
                positive: `]-∞; ${formatNumber(x1)}[ ∪ ]${formatNumber(x2)}; +∞[`,
                negative: `]${formatNumber(x1)}; ${formatNumber(x2)}[`,
                zeros: [x1, x2]
            };
        } else {
            return {
                positive: `]${formatNumber(x1)}; ${formatNumber(x2)}[`,
                negative: `]-∞; ${formatNumber(x1)}[ ∪ ]${formatNumber(x2)}; +∞[`,
                zeros: [x1, x2]
            };
        }
    }
}

/**
 * Résout l'inéquation et affiche les étapes
 */
function solveInequation2() {
    const ineq = getInequation2Values();
    let html = '<div class="steps">';

    // Vérification a ≠ 0
    if (ineq.a === 0) {
        html += '<div class="step">';
        html += '<div class="step-title">⚠️ Erreur</div>';
        html += '<div class="step-content highlight-danger">';
        html += `<p>Le coefficient <span class="color-coef">a</span> ne peut pas être nul pour une inéquation du 2nd degré.</p>`;
        html += `<p>Il s'agit d'une inéquation du 1er degré.</p>`;
        html += '</div></div>';
        html += '</div>';
        updateHTML('stepsContainer', html);
        showSolution();
        return;
    }

    // Étape 1 : Résolution de l'équation associée
    html += '<div class="step">';
    html += '<div class="step-title">Étape 1 : Résolution de l\'équation associée</div>';
    html += '<div class="step-content">';
    html += `<p>Pour résoudre l'inéquation, on résout d'abord l'équation ${formatNumber(ineq.a)}x² + ${formatNumber(ineq.b)}x + ${formatNumber(ineq.c)} = 0</p>`;

    const solution = solveEquation(ineq.a, ineq.b, ineq.c);
    const delta = solution.delta;

    html += `<div class="formula-box">Δ = b² - 4ac</div>`;
    html += `<div class="math-line">Δ = (${formatNumber(ineq.b)})² - 4 × ${formatNumber(ineq.a)} × ${formatNumber(ineq.c)}</div>`;
    html += `<div class="math-line">Δ = ${formatNumber(ineq.b * ineq.b)} - ${formatNumber(4 * ineq.a * ineq.c)}</div>`;
    html += `<div class="delta-box">Δ = <span class="color-delta">${formatNumber(delta)}</span></div>`;

    if (solution.nbSolutions === 2) {
        html += `<div class="highlight-success"><p>Δ > 0 : l'équation a deux solutions</p></div>`;
        const sqrtDelta = Math.sqrt(delta);
        html += `<div class="math-line">x₁ = ${generateFraction('(-b - √Δ)', '(2a)')} = ${generateFraction(`(${formatNumber(-ineq.b)} - ${formatNumber(sqrtDelta)})`, formatNumber(2 * ineq.a))} = <span class="color-solution">${formatNumber(solution.x1)}</span></div>`;
        html += `<div class="math-line">x₂ = ${generateFraction('(-b + √Δ)', '(2a)')} = ${generateFraction(`(${formatNumber(-ineq.b)} + ${formatNumber(sqrtDelta)})`, formatNumber(2 * ineq.a))} = <span class="color-solution">${formatNumber(solution.x2)}</span></div>`;
    } else if (solution.nbSolutions === 1) {
        html += `<div class="highlight-box"><p>Δ = 0 : l'équation a une solution double</p></div>`;
        html += `<div class="math-line">x₀ = ${generateFraction('-b', '2a')} = ${generateFraction(formatNumber(-ineq.b), formatNumber(2 * ineq.a))} = <span class="color-solution">${formatNumber(solution.x0)}</span></div>`;
    } else {
        html += `<div class="highlight-danger"><p>Δ < 0 : l'équation n'a pas de solution réelle</p></div>`;
    }

    html += '</div></div>';

    // Étape 2 : Tableau de signes
    html += '<div class="step">';
    html += '<div class="step-title">Étape 2 : Tableau de signes</div>';
    html += '<div class="step-content">';

    html += '<div class="sign-table">';
    html += '<table>';

    // Ligne x
    html += '<tr><td><strong>x</strong></td>';
    if (solution.nbSolutions === 2) {
        html += `<td>-∞</td><td colspan="2"></td><td>${formatNumber(solution.x1)}</td><td colspan="2"></td><td>${formatNumber(solution.x2)}</td><td colspan="2"></td><td>+∞</td>`;
    } else if (solution.nbSolutions === 1) {
        html += `<td>-∞</td><td colspan="2"></td><td>${formatNumber(solution.x0)}</td><td colspan="2"></td><td>+∞</td>`;
    } else {
        html += '<td>-∞</td><td colspan="4"></td><td>+∞</td>';
    }
    html += '</tr>';

    // Ligne signe
    html += '<tr><td><strong>ax² + bx + c</strong></td>';
    if (solution.nbSolutions === 2) {
        if (ineq.a > 0) {
            html += '<td></td><td>+</td><td></td><td>0</td><td>-</td><td></td><td>0</td><td>+</td><td></td><td></td>';
        } else {
            html += '<td></td><td>-</td><td></td><td>0</td><td>+</td><td></td><td>0</td><td>-</td><td></td><td></td>';
        }
    } else if (solution.nbSolutions === 1) {
        if (ineq.a > 0) {
            html += '<td></td><td>+</td><td></td><td>0</td><td>+</td><td></td><td></td>';
        } else {
            html += '<td></td><td>-</td><td></td><td>0</td><td>-</td><td></td><td></td>';
        }
    } else {
        // Pas de racines : signe constant
        if (ineq.a > 0) {
            html += '<td></td><td colspan="4">+</td><td></td>';
        } else {
            html += '<td></td><td colspan="4">-</td><td></td>';
        }
    }
    html += '</tr>';

    html += '</table>';
    html += '</div>';

    // Explication
    if (ineq.a > 0) {
        html += '<p class="info-text">💡 Comme <span class="color-coef">a > 0</span>, la parabole est tournée vers le haut.</p>';
    } else {
        html += '<p class="info-text">💡 Comme <span class="color-coef">a < 0</span>, la parabole est tournée vers le bas.</p>';
    }

    html += '</div></div>';

    // Étape 3 : Ensemble solution
    html += '<div class="step">';
    html += '<div class="step-title">Étape 3 : Ensemble solution</div>';
    html += '<div class="step-content">';

    const signSymbol = ineq.sign === '>=' ? '≥' : ineq.sign === '<=' ? '≤' : ineq.sign;
    html += `<p>On cherche les valeurs de x pour lesquelles ${formatQuadraticInequation(ineq.a, ineq.b, ineq.c, ineq.sign).replace(' ' + signSymbol + ' 0', '')} ${signSymbol} 0</p>`;

    const intervals = getSignIntervals(ineq.a, solution);
    let solutionSet = '';

    // Déterminer l'ensemble solution selon le signe de l'inéquation
    if (ineq.sign === '>' || ineq.sign === '>=') {
        // On cherche où le trinôme est positif (ou nul si >=)
        if (solution.nbSolutions === 0) {
            if (ineq.a > 0) {
                solutionSet = 'S = ℝ';
            } else {
                solutionSet = 'S = ∅';
            }
        } else if (solution.nbSolutions === 1) {
            if (ineq.a > 0) {
                if (ineq.sign === '>=') {
                    solutionSet = 'S = ℝ';
                } else {
                    solutionSet = `S = ℝ \\ {${formatNumber(solution.x0)}}`;
                }
            } else {
                if (ineq.sign === '>=') {
                    solutionSet = `S = {${formatNumber(solution.x0)}}`;
                } else {
                    solutionSet = 'S = ∅';
                }
            }
        } else {
            if (ineq.a > 0) {
                if (ineq.sign === '>=') {
                    solutionSet = `S = ]-∞ ; ${formatNumber(solution.x1)}] ∪ [${formatNumber(solution.x2)} ; +∞[`;
                } else {
                    solutionSet = `S = ]-∞ ; ${formatNumber(solution.x1)}[ ∪ ]${formatNumber(solution.x2)} ; +∞[`;
                }
            } else {
                if (ineq.sign === '>=') {
                    solutionSet = `S = [${formatNumber(solution.x1)} ; ${formatNumber(solution.x2)}]`;
                } else {
                    solutionSet = `S = ]${formatNumber(solution.x1)} ; ${formatNumber(solution.x2)}[`;
                }
            }
        }
    } else {
        // On cherche où le trinôme est négatif (ou nul si <=)
        if (solution.nbSolutions === 0) {
            if (ineq.a < 0) {
                solutionSet = 'S = ℝ';
            } else {
                solutionSet = 'S = ∅';
            }
        } else if (solution.nbSolutions === 1) {
            if (ineq.a < 0) {
                if (ineq.sign === '<=') {
                    solutionSet = 'S = ℝ';
                } else {
                    solutionSet = `S = ℝ \\ {${formatNumber(solution.x0)}}`;
                }
            } else {
                if (ineq.sign === '<=') {
                    solutionSet = `S = {${formatNumber(solution.x0)}}`;
                } else {
                    solutionSet = 'S = ∅';
                }
            }
        } else {
            if (ineq.a > 0) {
                if (ineq.sign === '<=') {
                    solutionSet = `S = [${formatNumber(solution.x1)} ; ${formatNumber(solution.x2)}]`;
                } else {
                    solutionSet = `S = ]${formatNumber(solution.x1)} ; ${formatNumber(solution.x2)}[`;
                }
            } else {
                if (ineq.sign === '<=') {
                    solutionSet = `S = ]-∞ ; ${formatNumber(solution.x1)}] ∪ [${formatNumber(solution.x2)} ; +∞[`;
                } else {
                    solutionSet = `S = ]-∞ ; ${formatNumber(solution.x1)}[ ∪ ]${formatNumber(solution.x2)} ; +∞[`;
                }
            }
        }
    }

    html += '<div class="final-result">';
    html += solutionSet;
    html += '</div>';

    html += '</div></div>';

    html += '</div>';
    updateHTML('stepsContainer', html);
    showSolution();

    // Dessiner le graphique
    drawGraph(ineq, solution);
}

/**
 * Dessine le graphique de l'inéquation
 */
function drawGraph(ineq, solution) {
    const graphContainer = $('graphContainer');
    graphContainer.style.display = 'block';

    // Déterminer les limites du graphique en fonction des racines
    let xMin = -10, xMax = 10, yMin = -10, yMax = 10;

    if (solution.nbSolutions === 2) {
        const spread = solution.x2 - solution.x1;
        xMin = solution.x1 - spread * 0.5;
        xMax = solution.x2 + spread * 0.5;
    } else if (solution.nbSolutions === 1) {
        xMin = solution.x0 - 5;
        xMax = solution.x0 + 5;
    }

    // Ajuster yMin et yMax en fonction de la parabole
    const vertex_x = -ineq.b / (2 * ineq.a);
    const vertex_y = ineq.a * vertex_x * vertex_x + ineq.b * vertex_x + ineq.c;

    if (ineq.a > 0) {
        // Parabole vers le haut
        yMin = Math.min(-2, vertex_y - 2);
        yMax = Math.max(10, vertex_y + 8);
    } else {
        // Parabole vers le bas
        yMin = Math.min(-10, vertex_y - 8);
        yMax = Math.max(2, vertex_y + 2);
    }

    // Créer le graphique
    const graph = new GraphCanvas('graphCanvas', {
        width: 600,
        height: 400,
        xMin: xMin,
        xMax: xMax,
        yMin: yMin,
        yMax: yMax
    });

    // Préparer les racines pour le graphique
    let roots = null;
    if (solution.nbSolutions === 2) {
        roots = { x1: solution.x1, x2: solution.x2 };
    } else if (solution.nbSolutions === 1) {
        roots = { x0: solution.x0 };
    }

    // Dessiner l'inéquation
    graph.drawQuadraticInequality(ineq.a, ineq.b, ineq.c, ineq.sign, roots);
}

/**
 * Initialise la page inéquations du 2nd degré
 */
function initInequations2Page() {
    // Écouteurs d'événements pour les inputs
    const allInputs = document.querySelectorAll('.coefficients input, .coefficients select');
    allInputs.forEach(input => {
        input.addEventListener('input', updateInequation2Display);
    });

    // Boutons
    $('generateBtn').addEventListener('click', generateInequation2);
    $('solveBtn').addEventListener('click', solveInequation2);

    // Générer une première inéquation
    generateInequation2();
}
