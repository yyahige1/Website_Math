/* ========================================
   EQUATIONS2.JS - Équations du 2nd degré
   ======================================== */

/**
 * État du module équations du 2nd degré
 */
const Equations2State = {
    currentType: 'discriminant'
};

/**
 * Récupère les valeurs des coefficients selon le type
 * @returns {Object}
 */
function getEquation2Values() {
    const type = Equations2State.currentType;

    switch (type) {
        case 'discriminant':
            return {
                type: 'discriminant',
                a: parseFloat($('a_disc').value) || 1,
                b: parseFloat($('b_disc').value) || 0,
                c: parseFloat($('c_disc').value) || 0
            };

        case 'canonique':
            return {
                type: 'canonique',
                a: parseFloat($('a_canon').value) || 1,
                b: parseFloat($('b_canon').value) || 0,
                c: parseFloat($('c_canon').value) || 0
            };

        case 'particuliere':
            const particularType = $('particularType').value;
            return {
                type: 'particuliere',
                particularType: particularType,
                a: parseFloat($('a_part').value) || 1,
                c: parseFloat($('c_part').value) || 0,
                b: particularType === 'ax2+bx' ? parseFloat($('a_part').value) || 1 : 0
            };

        case 'somme-produit':
            return {
                type: 'somme-produit',
                a: parseFloat($('a_sp').value) || 1,
                b: parseFloat($('b_sp').value) || 0,
                c: parseFloat($('c_sp').value) || 0
            };

        default:
            return { type: 'discriminant', a: 1, b: 0, c: 0 };
    }
}

/**
 * Met à jour l'affichage de l'équation
 */
function updateEquation2Display() {
    const eq = getEquation2Values();
    let display = '';

    if (eq.type === 'particuliere') {
        if (eq.particularType === 'ax2+c') {
            display = formatQuadraticEquation(eq.a, 0, eq.c);
        } else if (eq.particularType === 'ax2+bx') {
            display = formatQuadraticEquation(eq.a, eq.a, 0);
        } else {
            display = `(x - ${eq.a})² = ${eq.c}`;
        }
    } else {
        display = formatQuadraticEquation(eq.a, eq.b, eq.c);
    }

    updateText('expressionDisplay', display);
    hideSolution();
}

/**
 * Formate une équation du second degré
 * @param {number} a - Coefficient de x²
 * @param {number} b - Coefficient de x
 * @param {number} c - Terme constant
 * @returns {string}
 */
function formatQuadraticEquation(a, b, c) {
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

    return eq + ' = 0';
}

/**
 * Génère une équation aléatoire
 */
function generateEquation2() {
    const type = Equations2State.currentType;

    switch (type) {
        case 'discriminant':
            $('a_disc').value = randCoef(1, 5, false, true);
            $('b_disc').value = randCoef(-10, 10, false, false);
            $('c_disc').value = randCoef(-10, 10, false, false);
            break;

        case 'canonique':
            $('a_canon').value = randCoef(1, 3, false, true);
            $('b_canon').value = randCoef(-10, 10, false, false);
            $('c_canon').value = randCoef(-10, 10, false, false);
            break;

        case 'particuliere':
            const particularType = $('particularType').value;
            if (particularType === 'ax2+c') {
                $('a_part').value = randCoef(1, 5, false, true);
                $('c_part').value = randCoef(-20, 20, false, true);
            } else if (particularType === 'ax2+bx') {
                $('a_part').value = randCoef(1, 5, false, true);
            } else {
                $('a_part').value = randCoef(-5, 5, false, true);
                $('c_part').value = randCoef(1, 25, false, true);
            }
            break;

        case 'somme-produit':
            $('a_sp').value = 1;  // Simplifié pour S et P
            $('b_sp').value = randCoef(-10, 10, false, true);
            $('c_sp').value = randCoef(-10, 10, false, true);
            break;
    }

    updateEquation2Display();
}

/**
 * Calcule le discriminant et résout l'équation
 * @param {number} a
 * @param {number} b
 * @param {number} c
 * @returns {Object}
 */
function solveByDiscriminant(a, b, c) {
    const delta = b * b - 4 * a * c;

    if (delta > 0) {
        const x1 = (-b + Math.sqrt(delta)) / (2 * a);
        const x2 = (-b - Math.sqrt(delta)) / (2 * a);
        return {
            delta: delta,
            nbSolutions: 2,
            x1: x1,
            x2: x2
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
 * Convertit en forme canonique
 * @param {number} a
 * @param {number} b
 * @param {number} c
 * @returns {Object}
 */
function toCanonicalForm(a, b, c) {
    const alpha = -b / (2 * a);
    const beta = c - (b * b) / (4 * a);

    return { alpha, beta };
}

/**
 * Résout l'équation et affiche les étapes
 */
function solveEquation2() {
    const eq = getEquation2Values();
    let html = '<div class="steps">';

    if (eq.type === 'discriminant') {
        html += solveDiscriminantSteps(eq.a, eq.b, eq.c);
    } else if (eq.type === 'canonique') {
        html += solveCanonicSteps(eq.a, eq.b, eq.c);
    } else if (eq.type === 'particuliere') {
        html += solveParticularSteps(eq);
    } else if (eq.type === 'somme-produit') {
        html += solveSommeProduitSteps(eq.a, eq.b, eq.c);
    }

    html += '</div>';
    updateHTML('stepsContainer', html);
    showSolution();
}

/**
 * Génère les étapes de résolution par discriminant
 */
function solveDiscriminantSteps(a, b, c) {
    let html = '';

    // Vérification a ≠ 0
    if (a === 0) {
        html += '<div class="step">';
        html += '<div class="step-title">⚠️ Erreur</div>';
        html += '<div class="step-content">';
        html += `<p>Le coefficient a ne peut pas être nul pour une équation du 2nd degré.</p>`;
        html += `<p>Il s'agit d'une équation du 1er degré.</p>`;
        html += '</div></div>';
        return html;
    }

    // Étape 1 : Identification
    html += '<div class="step">';
    html += '<div class="step-title">Étape 1 : Identification des coefficients</div>';
    html += '<div class="step-content">';
    html += `<div class="math-line">${formatQuadraticEquation(a, b, c)}</div>`;
    html += `<p>a = ${formatNumber(a)}, b = ${formatNumber(b)}, c = ${formatNumber(c)}</p>`;
    html += '</div></div>';

    // Étape 2 : Calcul du discriminant
    const delta = b * b - 4 * a * c;
    html += '<div class="step">';
    html += '<div class="step-title">Étape 2 : Calcul du discriminant Δ</div>';
    html += '<div class="step-content">';
    html += `<div class="math-line">Δ = b² - 4ac</div>`;
    html += `<div class="math-line">Δ = (${formatNumber(b)})² - 4 × ${formatNumber(a)} × ${formatNumber(c)}</div>`;
    html += `<div class="math-line">Δ = ${formatNumber(b * b)} - ${formatNumber(4 * a * c)}</div>`;
    html += `<div class="math-line"><strong>Δ = ${formatNumber(delta)}</strong></div>`;
    html += '</div></div>';

    // Étape 3 : Interprétation et solutions
    html += '<div class="step">';
    html += '<div class="step-title">Étape 3 : Solutions</div>';
    html += '<div class="step-content">';

    if (delta > 0) {
        html += `<p>Δ > 0 : l'équation a <strong>deux solutions distinctes</strong></p>`;
        const sqrtDelta = Math.sqrt(delta);
        html += `<div class="math-line">√Δ = √${formatNumber(delta)} = ${formatNumber(sqrtDelta)}</div>`;

        const x1 = (-b + sqrtDelta) / (2 * a);
        const x2 = (-b - sqrtDelta) / (2 * a);

        html += `<div class="math-line">x₁ = (-b + √Δ) / (2a) = (${formatNumber(-b)} + ${formatNumber(sqrtDelta)}) / ${formatNumber(2 * a)}</div>`;
        html += `<div class="math-line"><strong>x₁ = ${formatNumber(x1)}</strong></div>`;
        html += '<br>';
        html += `<div class="math-line">x₂ = (-b - √Δ) / (2a) = (${formatNumber(-b)} - ${formatNumber(sqrtDelta)}) / ${formatNumber(2 * a)}</div>`;
        html += `<div class="math-line"><strong>x₂ = ${formatNumber(x2)}</strong></div>`;

        html += '<div class="final-result">';
        html += `<strong>S = {${formatNumber(x1)} ; ${formatNumber(x2)}}</strong>`;
        html += '</div>';

    } else if (delta === 0) {
        html += `<p>Δ = 0 : l'équation a <strong>une solution double</strong></p>`;
        const x0 = -b / (2 * a);
        html += `<div class="math-line">x₀ = -b / (2a) = ${formatNumber(-b)} / ${formatNumber(2 * a)}</div>`;
        html += `<div class="math-line"><strong>x₀ = ${formatNumber(x0)}</strong></div>`;

        html += '<div class="final-result">';
        html += `<strong>S = {${formatNumber(x0)}}</strong>`;
        html += '</div>';

    } else {
        html += `<p>Δ < 0 : l'équation <strong>n'a pas de solution réelle</strong></p>`;
        html += '<div class="final-result">';
        html += '<strong>S = ∅</strong>';
        html += '</div>';
    }

    html += '</div></div>';

    return html;
}

/**
 * Génère les étapes de résolution par forme canonique
 */
function solveCanonicSteps(a, b, c) {
    let html = '';

    if (a === 0) {
        html += '<div class="step"><div class="step-title">⚠️ Erreur</div>';
        html += '<div class="step-content"><p>Le coefficient a ne peut pas être nul.</p></div></div>';
        return html;
    }

    // Étape 1 : Forme canonique
    const alpha = -b / (2 * a);
    const beta = c - (b * b) / (4 * a);

    html += '<div class="step">';
    html += '<div class="step-title">Étape 1 : Mise sous forme canonique</div>';
    html += '<div class="step-content">';
    html += `<p>Pour une équation ax² + bx + c = 0, la forme canonique est :</p>`;
    html += `<div class="math-line">a(x - α)² + β = 0</div>`;
    html += `<p>avec α = -b/(2a) et β = c - b²/(4a)</p>`;
    html += `<div class="math-line">α = -${formatNumber(b)} / (2 × ${formatNumber(a)}) = ${formatNumber(alpha)}</div>`;
    html += `<div class="math-line">β = ${formatNumber(c)} - (${formatNumber(b)})² / (4 × ${formatNumber(a)}) = ${formatNumber(beta)}</div>`;
    html += `<div class="math-line"><strong>${formatNumber(a)}(x - ${formatNumber(alpha)})² + ${formatNumber(beta)} = 0</strong></div>`;
    html += '</div></div>';

    // Étape 2 : Résolution
    html += '<div class="step">';
    html += '<div class="step-title">Étape 2 : Résolution</div>';
    html += '<div class="step-content">';
    html += `<div class="math-line">${formatNumber(a)}(x - ${formatNumber(alpha)})² = ${formatNumber(-beta)}</div>`;
    html += `<div class="math-line">(x - ${formatNumber(alpha)})² = ${formatNumber(-beta / a)}</div>`;

    const k = -beta / a;

    if (k > 0) {
        const sqrtK = Math.sqrt(k);
        html += `<p>Le second membre est positif : deux solutions</p>`;
        html += `<div class="math-line">x - ${formatNumber(alpha)} = ±√${formatNumber(k)}</div>`;
        html += `<div class="math-line">x - ${formatNumber(alpha)} = ±${formatNumber(sqrtK)}</div>`;

        const x1 = alpha + sqrtK;
        const x2 = alpha - sqrtK;

        html += `<div class="math-line">x₁ = ${formatNumber(alpha)} + ${formatNumber(sqrtK)} = ${formatNumber(x1)}</div>`;
        html += `<div class="math-line">x₂ = ${formatNumber(alpha)} - ${formatNumber(sqrtK)} = ${formatNumber(x2)}</div>`;

        html += '<div class="final-result">';
        html += `<strong>S = {${formatNumber(x1)} ; ${formatNumber(x2)}}</strong>`;
        html += '</div>';

    } else if (k === 0) {
        html += `<p>Le second membre est nul : une solution</p>`;
        html += `<div class="math-line">x = ${formatNumber(alpha)}</div>`;

        html += '<div class="final-result">';
        html += `<strong>S = {${formatNumber(alpha)}}</strong>`;
        html += '</div>';

    } else {
        html += `<p>Le second membre est négatif : pas de solution réelle</p>`;
        html += '<div class="final-result">';
        html += '<strong>S = ∅</strong>';
        html += '</div>';
    }

    html += '</div></div>';

    return html;
}

/**
 * Génère les étapes pour équations particulières
 */
function solveParticularSteps(eq) {
    let html = '';
    const { particularType, a, c } = eq;

    if (particularType === 'ax2+c') {
        // Type ax² + c = 0
        html += '<div class="step">';
        html += '<div class="step-title">Équation de type ax² + c = 0</div>';
        html += '<div class="step-content">';
        html += `<div class="math-line">${formatNumber(a)}x² + ${formatNumber(c)} = 0</div>`;
        html += `<div class="math-line">${formatNumber(a)}x² = ${formatNumber(-c)}</div>`;
        html += `<div class="math-line">x² = ${formatNumber(-c / a)}</div>`;

        const k = -c / a;

        if (k > 0) {
            const sqrtK = Math.sqrt(k);
            html += `<p>x² = ${formatNumber(k)} > 0 : deux solutions</p>`;
            html += `<div class="math-line">x = ±√${formatNumber(k)} = ±${formatNumber(sqrtK)}</div>`;
            html += '<div class="final-result">';
            html += `<strong>S = {${formatNumber(-sqrtK)} ; ${formatNumber(sqrtK)}}</strong>`;
            html += '</div>';
        } else if (k === 0) {
            html += `<p>x² = 0 : une solution</p>`;
            html += '<div class="final-result"><strong>S = {0}</strong></div>';
        } else {
            html += `<p>x² = ${formatNumber(k)} < 0 : pas de solution réelle</p>`;
            html += '<div class="final-result"><strong>S = ∅</strong></div>';
        }

        html += '</div></div>';

    } else if (particularType === 'ax2+bx') {
        // Type ax² + bx = 0
        const b = a;  // Dans ce cas particulier
        html += '<div class="step">';
        html += '<div class="step-title">Équation de type ax² + bx = 0</div>';
        html += '<div class="step-content">';
        html += `<div class="math-line">${formatNumber(a)}x² + ${formatNumber(b)}x = 0</div>`;
        html += `<div class="math-line">x(${formatNumber(a)}x + ${formatNumber(b)}) = 0</div>`;
        html += '<p>Produit nul : x = 0 ou ${formatNumber(a)}x + ${formatNumber(b)} = 0</p>';
        html += `<div class="math-line">x = 0 ou x = ${formatNumber(-b / a)}</div>`;
        html += '<div class="final-result">';
        html += `<strong>S = {0 ; ${formatNumber(-b / a)}}</strong>`;
        html += '</div>';
        html += '</div></div>';

    } else {
        // Type (x - a)² = k
        html += '<div class="step">';
        html += '<div class="step-title">Équation de type (x - a)² = k</div>';
        html += '<div class="step-content">';
        html += `<div class="math-line">(x - ${formatNumber(a)})² = ${formatNumber(c)}</div>`;

        if (c > 0) {
            const sqrtC = Math.sqrt(c);
            html += `<div class="math-line">x - ${formatNumber(a)} = ±√${formatNumber(c)}</div>`;
            html += `<div class="math-line">x - ${formatNumber(a)} = ±${formatNumber(sqrtC)}</div>`;
            const x1 = a + sqrtC;
            const x2 = a - sqrtC;
            html += `<div class="math-line">x₁ = ${formatNumber(a)} + ${formatNumber(sqrtC)} = ${formatNumber(x1)}</div>`;
            html += `<div class="math-line">x₂ = ${formatNumber(a)} - ${formatNumber(sqrtC)} = ${formatNumber(x2)}</div>`;
            html += '<div class="final-result">';
            html += `<strong>S = {${formatNumber(x2)} ; ${formatNumber(x1)}}</strong>`;
            html += '</div>';
        } else if (c === 0) {
            html += `<div class="math-line">x = ${formatNumber(a)}</div>`;
            html += '<div class="final-result">';
            html += `<strong>S = {${formatNumber(a)}}</strong>`;
            html += '</div>';
        } else {
            html += '<p>k < 0 : pas de solution réelle</p>';
            html += '<div class="final-result"><strong>S = ∅</strong></div>';
        }

        html += '</div></div>';
    }

    return html;
}

/**
 * Génère les étapes somme et produit
 */
function solveSommeProduitSteps(a, b, c) {
    let html = '';

    if (a === 0) {
        html += '<div class="step"><div class="step-title">⚠️ Erreur</div>';
        html += '<div class="step-content"><p>Le coefficient a ne peut pas être nul.</p></div></div>';
        return html;
    }

    // Résolution par discriminant d'abord
    const result = solveByDiscriminant(a, b, c);

    // Calcul de S et P
    const S = -b / a;
    const P = c / a;

    html += '<div class="step">';
    html += '<div class="step-title">Étape 1 : Résolution de l\'équation</div>';
    html += '<div class="step-content">';
    html += `<div class="math-line">${formatQuadraticEquation(a, b, c)}</div>`;
    html += solveDiscriminantSteps(a, b, c);
    html += '</div></div>';

    html += '<div class="step">';
    html += '<div class="step-title">Étape 2 : Somme et produit des racines</div>';
    html += '<div class="step-content">';
    html += '<p>Pour une équation ax² + bx + c = 0 de racines x₁ et x₂ :</p>';
    html += '<div class="math-line">Somme S = x₁ + x₂ = -b/a</div>';
    html += '<div class="math-line">Produit P = x₁ × x₂ = c/a</div>';
    html += '<br>';
    html += `<div class="math-line">S = -${formatNumber(b)} / ${formatNumber(a)} = <strong>${formatNumber(S)}</strong></div>`;
    html += `<div class="math-line">P = ${formatNumber(c)} / ${formatNumber(a)} = <strong>${formatNumber(P)}</strong></div>`;

    if (result.nbSolutions === 2) {
        html += '<br><p><strong>Vérification :</strong></p>';
        html += `<div class="math-line">x₁ + x₂ = ${formatNumber(result.x1)} + ${formatNumber(result.x2)} = ${formatNumber(result.x1 + result.x2)} ✓</div>`;
        html += `<div class="math-line">x₁ × x₂ = ${formatNumber(result.x1)} × ${formatNumber(result.x2)} = ${formatNumber(result.x1 * result.x2)} ✓</div>`;
    } else if (result.nbSolutions === 1) {
        html += '<br><p>L\'équation a une racine double, donc S = 2x₀ et P = x₀²</p>';
    } else {
        html += '<br><p>L\'équation n\'a pas de racines réelles.</p>';
    }

    html += '</div></div>';

    return html;
}

/**
 * Initialise la page équations du 2nd degré
 */
function initEquations2Page() {
    // Initialiser le sélecteur de types
    initTypeSelector('.type-btn', (type) => {
        Equations2State.currentType = type;

        // Masquer tous les coefficients
        document.querySelectorAll('.coefficients').forEach(div => {
            div.classList.add('hidden');
        });

        // Afficher les coefficients du type sélectionné
        const typeMap = {
            'discriminant': 'coeffDiscriminant',
            'canonique': 'coeffCanonique',
            'particuliere': 'coeffParticuliere',
            'somme-produit': 'coeffSommeProduit'
        };

        $(typeMap[type]).classList.remove('hidden');
        updateEquation2Display();
    });

    // Écouteurs d'événements pour les inputs
    const allInputs = document.querySelectorAll('.coefficients input, .coefficients select');
    allInputs.forEach(input => {
        input.addEventListener('input', updateEquation2Display);
    });

    // Boutons
    $('generateBtn').addEventListener('click', generateEquation2);
    $('solveBtn').addEventListener('click', solveEquation2);

    // Générer une première équation
    generateEquation2();
}

// Export pour les tests
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        solveByDiscriminant,
        toCanonicalForm,
        formatQuadraticEquation
    };
}
