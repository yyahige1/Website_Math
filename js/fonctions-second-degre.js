/* ========================================
   FONCTIONS-SECOND-DEGRE.JS - Fonctions du 2nd degré
   ======================================== */

/**
 * État du module fonctions du 2nd degré
 */
const FonctionsSecondDegreState = {
    currentType: 'graphique',
    a: 1,
    b: -4,
    c: 3
};

/**
 * Initialise la page fonctions du 2nd degré
 */
function initFonctionsSecondDegrePage() {
    setupTypeButtons();
    setupInputHandlers();
    setupActionButtons();
    updateExerciseDisplay();
}

/**
 * Configure les boutons de type
 */
function setupTypeButtons() {
    const typeButtons = document.querySelectorAll('.type-btn');
    typeButtons.forEach(button => {
        button.addEventListener('click', () => {
            typeButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            FonctionsSecondDegreState.currentType = button.dataset.type;
            updateExerciseDisplay();
            hideSolution('solutionDiv');
        });
    });
}

/**
 * Configure les gestionnaires d'événements pour les inputs
 */
function setupInputHandlers() {
    // Graphique
    $('a_graph').addEventListener('input', () => {
        FonctionsSecondDegreState.a = parseFloat($('a_graph').value) || 1;
        updateExerciseDisplay();
    });
    $('b_graph').addEventListener('input', () => {
        FonctionsSecondDegreState.b = parseFloat($('b_graph').value) || 0;
        updateExerciseDisplay();
    });
    $('c_graph').addEventListener('input', () => {
        FonctionsSecondDegreState.c = parseFloat($('c_graph').value) || 0;
        updateExerciseDisplay();
    });

    // Canonique
    $('a_canon').addEventListener('input', () => {
        FonctionsSecondDegreState.a = parseFloat($('a_canon').value) || 1;
        updateExerciseDisplay();
    });
    $('b_canon').addEventListener('input', () => {
        FonctionsSecondDegreState.b = parseFloat($('b_canon').value) || 0;
        updateExerciseDisplay();
    });
    $('c_canon').addEventListener('input', () => {
        FonctionsSecondDegreState.c = parseFloat($('c_canon').value) || 0;
        updateExerciseDisplay();
    });

    // Sommet
    $('a_sommet').addEventListener('input', () => {
        FonctionsSecondDegreState.a = parseFloat($('a_sommet').value) || 1;
        updateExerciseDisplay();
    });
    $('b_sommet').addEventListener('input', () => {
        FonctionsSecondDegreState.b = parseFloat($('b_sommet').value) || 0;
        updateExerciseDisplay();
    });
    $('c_sommet').addEventListener('input', () => {
        FonctionsSecondDegreState.c = parseFloat($('c_sommet').value) || 0;
        updateExerciseDisplay();
    });

    // Variations
    $('a_var').addEventListener('input', () => {
        FonctionsSecondDegreState.a = parseFloat($('a_var').value) || 1;
        updateExerciseDisplay();
    });
    $('b_var').addEventListener('input', () => {
        FonctionsSecondDegreState.b = parseFloat($('b_var').value) || 0;
        updateExerciseDisplay();
    });
    $('c_var').addEventListener('input', () => {
        FonctionsSecondDegreState.c = parseFloat($('c_var').value) || 0;
        updateExerciseDisplay();
    });

    // Extremum
    $('a_ext').addEventListener('input', () => {
        FonctionsSecondDegreState.a = parseFloat($('a_ext').value) || 1;
        updateExerciseDisplay();
    });
    $('b_ext').addEventListener('input', () => {
        FonctionsSecondDegreState.b = parseFloat($('b_ext').value) || 0;
        updateExerciseDisplay();
    });
    $('c_ext').addEventListener('input', () => {
        FonctionsSecondDegreState.c = parseFloat($('c_ext').value) || 0;
        updateExerciseDisplay();
    });
}

/**
 * Configure les boutons d'action
 */
function setupActionButtons() {
    $('newExerciseBtn').addEventListener('click', generateExercise);
    $('solveBtn').addEventListener('click', solveExercise);
}

/**
 * Met à jour l'affichage de l'exercice
 */
function updateExerciseDisplay() {
    const type = FonctionsSecondDegreState.currentType;

    // Masquer toutes les sections
    $('graphiqueSection').style.display = 'none';
    $('canoniqueSection').style.display = 'none';
    $('sommetSection').style.display = 'none';
    $('variationsSection').style.display = 'none';
    $('extremumSection').style.display = 'none';

    // Afficher la section correspondante
    switch (type) {
        case 'graphique':
            $('graphiqueSection').style.display = 'block';
            break;
        case 'canonique':
            $('canoniqueSection').style.display = 'block';
            break;
        case 'sommet':
            $('sommetSection').style.display = 'block';
            break;
        case 'variations':
            $('variationsSection').style.display = 'block';
            break;
        case 'extremum':
            $('extremumSection').style.display = 'block';
            break;
    }

    // Mettre à jour l'expression affichée
    const a = FonctionsSecondDegreState.a;
    const b = FonctionsSecondDegreState.b;
    const c = FonctionsSecondDegreState.c;

    let display = '';
    switch (type) {
        case 'graphique':
            display = formatQuadraticFunction(a, b, c, true);
            break;
        case 'canonique':
            display = `Forme canonique de ${formatQuadraticFunction(a, b, c, true)}`;
            break;
        case 'sommet':
            display = `Sommet de ${formatQuadraticFunction(a, b, c, true)}`;
            break;
        case 'variations':
            display = `Variations de ${formatQuadraticFunction(a, b, c, true)}`;
            break;
        case 'extremum':
            display = `Extremum de ${formatQuadraticFunction(a, b, c, true)}`;
            break;
    }

    $('expressionDisplay').textContent = display;
}

/**
 * Formate une fonction du second degré
 * @param {number} a - Coefficient de x²
 * @param {number} b - Coefficient de x
 * @param {number} c - Terme constant
 * @param {boolean} useFx - Utiliser f(x) = au lieu de y =
 * @returns {string}
 */
function formatQuadraticFunction(a, b, c, useFx = false) {
    let result = useFx ? 'f(x) = ' : 'y = ';

    // Coefficient a (x²)
    if (a === 0) {
        // Ce n'est pas vraiment une fonction du 2nd degré
        if (b === 0) {
            return result + formatNumber(c);
        }
        // C'est une fonction affine
        if (b === 1) {
            result += 'x';
        } else if (b === -1) {
            result += '-x';
        } else {
            result += `${formatNumber(b)}x`;
        }
    } else {
        if (a === 1) {
            result += 'x²';
        } else if (a === -1) {
            result += '-x²';
        } else {
            result += `${formatNumber(a)}x²`;
        }
    }

    // Coefficient b (x)
    if (b !== 0 && a !== 0) {
        if (b > 0) {
            if (b === 1) {
                result += ' + x';
            } else {
                result += ` + ${formatNumber(b)}x`;
            }
        } else {
            if (b === -1) {
                result += ' - x';
            } else {
                result += ` - ${formatNumber(Math.abs(b))}x`;
            }
        }
    }

    // Constante c
    if (c !== 0) {
        if (c > 0) {
            result += ` + ${formatNumber(c)}`;
        } else {
            result += ` - ${formatNumber(Math.abs(c))}`;
        }
    } else if (a === 0 && b === 0) {
        result += '0';
    }

    return result;
}

/**
 * Génère un exercice aléatoire
 */
function generateExercise() {
    const type = FonctionsSecondDegreState.currentType;

    let a, b, c;

    switch (type) {
        case 'graphique':
            a = randCoef(1, 3, false, true);
            if (Math.random() < 0.5) a = -a; // 50% de chances d'être négatif
            b = randCoef(-8, 8, false, false);
            c = randCoef(-6, 6, false, false);
            $('a_graph').value = a;
            $('b_graph').value = b;
            $('c_graph').value = c;
            break;

        case 'canonique':
            a = randCoef(1, 3, false, true);
            if (Math.random() < 0.5) a = -a;
            b = randCoef(-8, 8, false, true);
            c = randCoef(-6, 6, false, false);
            $('a_canon').value = a;
            $('b_canon').value = b;
            $('c_canon').value = c;
            break;

        case 'sommet':
            a = randCoef(1, 3, false, true);
            if (Math.random() < 0.5) a = -a;
            b = randCoef(-8, 8, false, true);
            c = randCoef(-6, 6, false, false);
            $('a_sommet').value = a;
            $('b_sommet').value = b;
            $('c_sommet').value = c;
            break;

        case 'variations':
            a = randCoef(1, 3, false, true);
            if (Math.random() < 0.5) a = -a;
            b = randCoef(-8, 8, false, true);
            c = randCoef(-6, 6, false, false);
            $('a_var').value = a;
            $('b_var').value = b;
            $('c_var').value = c;
            break;

        case 'extremum':
            a = randCoef(1, 3, false, true);
            if (Math.random() < 0.5) a = -a;
            b = randCoef(-8, 8, false, true);
            c = randCoef(-6, 6, false, false);
            $('a_ext').value = a;
            $('b_ext').value = b;
            $('c_ext').value = c;
            break;
    }

    FonctionsSecondDegreState.a = a;
    FonctionsSecondDegreState.b = b;
    FonctionsSecondDegreState.c = c;

    updateExerciseDisplay();
    hideSolution('solutionDiv');
}

/**
 * Résout l'exercice
 */
function solveExercise() {
    const type = FonctionsSecondDegreState.currentType;
    const a = FonctionsSecondDegreState.a;
    const b = FonctionsSecondDegreState.b;
    const c = FonctionsSecondDegreState.c;

    let html = '';

    switch (type) {
        case 'graphique':
            html = solveGraphique(a, b, c);
            break;
        case 'canonique':
            html = solveCanonique(a, b, c);
            break;
        case 'sommet':
            html = solveSommet(a, b, c);
            break;
        case 'variations':
            html = solveVariations(a, b, c);
            break;
        case 'extremum':
            html = solveExtremum(a, b, c);
            break;
    }

    $('stepsContainer').innerHTML = html;
    showSolution('solutionDiv');

    // Dessiner les graphiques après que le DOM soit prêt
    requestAnimationFrame(() => {
        if (type === 'graphique' || type === 'variations') {
            drawParabola(a, b, c);
        }
    });
}

// ============================================================
// Calcul du sommet
// ============================================================
function calculateVertex(a, b, c) {
    const alpha = -b / (2 * a);
    const beta = a * alpha * alpha + b * alpha + c;
    return { alpha, beta };
}

// ============================================================
// Résolution : Représentation graphique
// ============================================================
function solveGraphique(a, b, c) {
    let html = '';

    // Formule
    html += '<div class="formula-box">';
    html += '<div class="formula-title">📐 Fonction du 2nd degré</div>';
    html += `<div class="formula-content">${formatQuadraticFunction(a, b, c, true)}</div>`;
    html += '</div>';

    // Coefficient a
    html += '<div class="step">';
    html += `<div class="step-number">📊 Signe du coefficient a : ${formatNumber(a)}</div>`;
    if (a > 0) {
        html += '<div class="step-explanation">a &gt; 0 : La parabole est <span class="term-red">tournée vers le haut</span> (∪)</div>';
    } else {
        html += '<div class="step-explanation">a &lt; 0 : La parabole est <span class="term-red">tournée vers le bas</span> (∩)</div>';
    }
    html += '</div>';

    // Sommet
    const vertex = calculateVertex(a, b, c);
    html += '<div class="step">';
    html += '<div class="step-number">🎯 Coordonnées du sommet S</div>';
    html += '<div class="step-explanation">Le sommet a pour coordonnées :</div>';
    html += `<div class="step-expression">α = -b/(2a) = -(${formatNumber(b)})/(2×${formatNumber(a)}) = ${formatNumber(vertex.alpha)}</div>`;
    html += `<div class="step-expression">β = f(α) = ${formatNumber(a)} × ${formatNumber(vertex.alpha)}² + ${formatNumber(b)} × ${formatNumber(vertex.alpha)} + ${formatNumber(c)} = ${formatNumber(vertex.beta)}</div>`;
    html += `<div class="result-box">Sommet : S(${formatNumber(vertex.alpha)}, ${formatNumber(vertex.beta)})</div>`;
    html += '</div>';

    // Axe de symétrie
    html += '<div class="step">';
    html += `<div class="step-number">📍 Axe de symétrie</div>`;
    html += `<div class="step-explanation">L'axe de symétrie est la droite verticale x = α</div>`;
    html += `<div class="result-box">Axe de symétrie : x = ${formatNumber(vertex.alpha)}</div>`;
    html += '</div>';

    // Racines (si elles existent)
    const delta = b * b - 4 * a * c;
    html += '<div class="step">';
    html += '<div class="step-number">🔍 Points d\'intersection avec l\'axe des abscisses</div>';
    html += `<div class="step-explanation">Calcul du discriminant : Δ = b² - 4ac</div>`;
    html += `<div class="step-expression">Δ = ${formatNumber(b)}² - 4×${formatNumber(a)}×${formatNumber(c)} = ${formatNumber(delta)}</div>`;

    if (delta > 0) {
        const x1 = (-b + Math.sqrt(delta)) / (2 * a);
        const x2 = (-b - Math.sqrt(delta)) / (2 * a);
        html += '<div class="step-explanation">Δ &gt; 0 : La parabole coupe l\'axe des abscisses en deux points</div>';
        html += `<div class="result-box">x₁ = ${formatNumber(x1)} et x₂ = ${formatNumber(x2)}</div>`;
    } else if (delta === 0) {
        const x0 = -b / (2 * a);
        html += '<div class="step-explanation">Δ = 0 : La parabole touche l\'axe des abscisses en un point (le sommet)</div>';
        html += `<div class="result-box">x₀ = ${formatNumber(x0)}</div>`;
    } else {
        html += '<div class="step-explanation">Δ &lt; 0 : La parabole ne coupe pas l\'axe des abscisses</div>';
    }
    html += '</div>';

    // Point d'intersection avec l'axe des ordonnées
    html += '<div class="step">';
    html += '<div class="step-number">📍 Point d\'intersection avec l\'axe des ordonnées</div>';
    html += '<div class="step-explanation">Pour x = 0 : f(0) = c</div>';
    html += `<div class="result-box">Point : (0, ${formatNumber(c)})</div>`;
    html += '</div>';

    // Graphique
    html += '<div class="step">';
    html += '<div class="step-number">📈 Représentation graphique</div>';
    html += '<div class="graph-container">';
    html += '<canvas id="functionGraph" width="600" height="400"></canvas>';
    html += '</div>';
    html += '</div>';

    return html;
}

// ============================================================
// Résolution : Forme canonique
// ============================================================
function solveCanonique(a, b, c) {
    let html = '';

    // Formule
    html += '<div class="formula-box">';
    html += '<div class="formula-title">📐 Forme canonique</div>';
    html += `<div class="formula-content">${formatQuadraticFunction(a, b, c, true)}</div>`;
    html += '<div class="formula-subtitle">Forme canonique : f(x) = a(x - α)² + β</div>';
    html += '</div>';

    // Calcul de α
    const alpha = -b / (2 * a);
    html += '<div class="step">';
    html += '<div class="step-number">📍 Étape 1 : Calculer α</div>';
    html += '<div class="step-explanation">α est l\'abscisse du sommet de la parabole</div>';
    html += '<div class="step-expression">α = -b/(2a)</div>';
    html += `<div class="step-expression">α = -(${formatNumber(b)})/(2×${formatNumber(a)}) = ${formatNumber(b >= 0 ? -b : Math.abs(b))}/${formatNumber(2*a)} = ${formatNumber(alpha)}</div>`;
    html += '</div>';

    // Calcul de β
    const beta = a * alpha * alpha + b * alpha + c;
    html += '<div class="step">';
    html += '<div class="step-number">📍 Étape 2 : Calculer β</div>';
    html += '<div class="step-explanation">β est l\'ordonnée du sommet : β = f(α)</div>';
    html += `<div class="step-expression">β = ${formatNumber(a)} × (${formatNumber(alpha)})² + ${formatNumber(b)} × (${formatNumber(alpha)}) + ${formatNumber(c)}</div>`;
    html += `<div class="step-expression">β = ${formatNumber(a * alpha * alpha)} + ${formatNumber(b * alpha)} + ${formatNumber(c)} = ${formatNumber(beta)}</div>`;
    html += '</div>';

    // Forme canonique
    html += '<div class="step">';
    html += '<div class="step-number">✨ Forme canonique</div>';
    let canonicalForm = '';
    if (a === 1) {
        canonicalForm = `(x - (${formatNumber(alpha)}))²`;
    } else if (a === -1) {
        canonicalForm = `-(x - (${formatNumber(alpha)}))²`;
    } else {
        canonicalForm = `${formatNumber(a)}(x - (${formatNumber(alpha)}))²`;
    }

    if (beta > 0) {
        canonicalForm += ` + ${formatNumber(beta)}`;
    } else if (beta < 0) {
        canonicalForm += ` - ${formatNumber(Math.abs(beta))}`;
    }

    html += `<div class="result-box result-value">f(x) = ${canonicalForm}</div>`;
    html += '</div>';

    // Vérification
    html += '<div class="step">';
    html += '<div class="step-number">✓ Vérification</div>';
    html += '<div class="step-explanation">On peut développer pour retrouver la forme initiale :</div>';
    html += `<div class="step-expression">f(x) = ${formatNumber(a)}(x² - 2×${formatNumber(alpha)}×x + ${formatNumber(alpha * alpha)}) + ${formatNumber(beta)}</div>`;
    html += `<div class="step-expression">f(x) = ${formatNumber(a)}x² + ${formatNumber(-2 * a * alpha)}x + ${formatNumber(a * alpha * alpha)} + ${formatNumber(beta)}</div>`;
    html += `<div class="step-expression">f(x) = ${formatQuadraticFunction(a, b, c, false)}</div>`;
    html += '</div>';

    return html;
}

// ============================================================
// Résolution : Sommet
// ============================================================
function solveSommet(a, b, c) {
    let html = '';

    // Formule
    html += '<div class="formula-box">';
    html += '<div class="formula-title">🎯 Coordonnées du sommet</div>';
    html += `<div class="formula-content">${formatQuadraticFunction(a, b, c, true)}</div>`;
    html += '</div>';

    // Abscisse du sommet
    const alpha = -b / (2 * a);
    html += '<div class="step">';
    html += '<div class="step-number">📍 Étape 1 : Calculer l\'abscisse α du sommet</div>';
    html += '<div class="step-explanation">Formule : α = -b/(2a)</div>';
    html += `<div class="step-expression">α = -(${formatNumber(b)})/(2×${formatNumber(a)})</div>`;
    html += `<div class="step-expression">α = ${formatNumber(b >= 0 ? -b : Math.abs(b))}/${formatNumber(2*a)}</div>`;
    html += `<div class="result-box">α = ${formatNumber(alpha)}</div>`;
    html += '</div>';

    // Ordonnée du sommet
    const beta = a * alpha * alpha + b * alpha + c;
    html += '<div class="step">';
    html += '<div class="step-number">📍 Étape 2 : Calculer l\'ordonnée β du sommet</div>';
    html += '<div class="step-explanation">On remplace x par α dans la fonction : β = f(α)</div>';
    html += `<div class="step-expression">β = ${formatNumber(a)} × (${formatNumber(alpha)})² + ${formatNumber(b)} × (${formatNumber(alpha)}) + ${formatNumber(c)}</div>`;
    html += `<div class="step-expression">β = ${formatNumber(a)} × ${formatNumber(alpha * alpha)} + ${formatNumber(b * alpha)} + ${formatNumber(c)}</div>`;
    html += `<div class="step-expression">β = ${formatNumber(a * alpha * alpha)} + ${formatNumber(b * alpha)} + ${formatNumber(c)}</div>`;
    html += `<div class="result-box">β = ${formatNumber(beta)}</div>`;
    html += '</div>';

    // Résultat
    html += '<div class="step">';
    html += '<div class="step-number">✨ Coordonnées du sommet</div>';
    html += `<div class="result-box result-value">S(${formatNumber(alpha)}, ${formatNumber(beta)})</div>`;
    html += '</div>';

    // Interprétation
    html += '<div class="step">';
    html += '<div class="step-number">💡 Interprétation</div>';
    if (a > 0) {
        html += `<div class="step-explanation">Comme a &gt; 0, la parabole est tournée vers le haut, le sommet est donc un <span class="term-red">minimum</span>.</div>`;
        html += `<div class="step-explanation">La fonction atteint son minimum en x = ${formatNumber(alpha)}, et ce minimum vaut ${formatNumber(beta)}.</div>`;
    } else {
        html += `<div class="step-explanation">Comme a &lt; 0, la parabole est tournée vers le bas, le sommet est donc un <span class="term-red">maximum</span>.</div>`;
        html += `<div class="step-explanation">La fonction atteint son maximum en x = ${formatNumber(alpha)}, et ce maximum vaut ${formatNumber(beta)}.</div>`;
    }
    html += '</div>';

    return html;
}

// ============================================================
// Résolution : Variations
// ============================================================
function solveVariations(a, b, c) {
    let html = '';

    // Formule
    html += '<div class="formula-box">';
    html += '<div class="formula-title">📊 Tableau de variations</div>';
    html += `<div class="formula-content">${formatQuadraticFunction(a, b, c, true)}</div>`;
    html += '</div>';

    // Sommet
    const alpha = -b / (2 * a);
    const beta = a * alpha * alpha + b * alpha + c;

    html += '<div class="step">';
    html += '<div class="step-number">📍 Étape 1 : Trouver le sommet</div>';
    html += '<div class="step-explanation">Le sommet est le point où la fonction change de sens de variation</div>';
    html += `<div class="step-expression">α = -b/(2a) = -(${formatNumber(b)})/(2×${formatNumber(a)}) = ${formatNumber(alpha)}</div>`;
    html += `<div class="step-expression">β = f(α) = ${formatNumber(beta)}</div>`;
    html += `<div class="result-box">Sommet : S(${formatNumber(alpha)}, ${formatNumber(beta)})</div>`;
    html += '</div>';

    // Sens de variation
    html += '<div class="step">';
    html += '<div class="step-number">📍 Étape 2 : Déterminer le sens de variation</div>';
    if (a > 0) {
        html += '<div class="step-explanation">a &gt; 0 : La parabole est tournée vers le haut</div>';
        html += `<div class="step-explanation">• La fonction est <span class="term-red">décroissante</span> sur ]-∞, ${formatNumber(alpha)}]</div>`;
        html += `<div class="step-explanation">• La fonction est <span class="term-red">croissante</span> sur [${formatNumber(alpha)}, +∞[</div>`;
    } else {
        html += '<div class="step-explanation">a &lt; 0 : La parabole est tournée vers le bas</div>';
        html += `<div class="step-explanation">• La fonction est <span class="term-red">croissante</span> sur ]-∞, ${formatNumber(alpha)}]</div>`;
        html += `<div class="step-explanation">• La fonction est <span class="term-red">décroissante</span> sur [${formatNumber(alpha)}, +∞[</div>`;
    }
    html += '</div>';

    // Tableau de variations
    html += '<div class="step">';
    html += '<div class="step-number">📊 Tableau de variations</div>';

    // Utilisation de la fonction générique pour tableau dynamique
    const liste_x = ["-∞", formatNumber(alpha), "+∞"];
    const liste_fx = a > 0
        ? ["+∞", formatNumber(beta), "+∞"]  // Minimum (parabole vers le haut)
        : ["-∞", formatNumber(beta), "-∞"];  // Maximum (parabole vers le bas)
    const liste_nature = a > 0
        ? ["lim_haut", "min", "lim_haut"]
        : ["lim_bas", "max", "lim_bas"];
    const signes_derivee = a > 0 ? ["-", "+"] : ["+", "-"];

    html += genererTableauVariations(liste_x, liste_fx, liste_nature, signes_derivee, {
        afficherDerivee: false  // Pas de ligne f'(x) pour cet exercice
    });

    html += '</div>';

    // Graphique
    html += '<div class="step">';
    html += '<div class="step-number">📈 Représentation graphique</div>';
    html += '<div class="graph-container">';
    html += '<canvas id="functionGraph" width="600" height="400"></canvas>';
    html += '</div>';
    html += '</div>';

    return html;
}

// ============================================================
// Résolution : Extremum
// ============================================================
function solveExtremum(a, b, c) {
    let html = '';

    // Formule
    html += '<div class="formula-box">';
    html += '<div class="formula-title">🏔️ Extremum de la fonction</div>';
    html += `<div class="formula-content">${formatQuadraticFunction(a, b, c, true)}</div>`;
    html += '</div>';

    // Nature de l'extremum
    html += '<div class="step">';
    html += '<div class="step-number">📍 Étape 1 : Nature de l\'extremum</div>';
    if (a > 0) {
        html += '<div class="step-explanation">a &gt; 0 : La parabole est tournée vers le haut (∪)</div>';
        html += '<div class="result-box">La fonction admet un <span class="term-red">minimum</span></div>';
    } else {
        html += '<div class="step-explanation">a &lt; 0 : La parabole est tournée vers le bas (∩)</div>';
        html += '<div class="result-box">La fonction admet un <span class="term-red">maximum</span></div>';
    }
    html += '</div>';

    // Position de l'extremum
    const alpha = -b / (2 * a);
    html += '<div class="step">';
    html += '<div class="step-number">📍 Étape 2 : Position de l\'extremum</div>';
    html += '<div class="step-explanation">L\'extremum est atteint au sommet de la parabole</div>';
    html += '<div class="step-expression">x = -b/(2a)</div>';
    html += `<div class="step-expression">x = -(${formatNumber(b)})/(2×${formatNumber(a)}) = ${formatNumber(alpha)}</div>`;
    html += `<div class="result-box">L'extremum est atteint en x = ${formatNumber(alpha)}</div>`;
    html += '</div>';

    // Valeur de l'extremum
    const beta = a * alpha * alpha + b * alpha + c;
    html += '<div class="step">';
    html += '<div class="step-number">📍 Étape 3 : Valeur de l\'extremum</div>';
    html += '<div class="step-explanation">On calcule f(α) pour trouver la valeur de l\'extremum</div>';
    html += `<div class="step-expression">f(${formatNumber(alpha)}) = ${formatNumber(a)} × (${formatNumber(alpha)})² + ${formatNumber(b)} × (${formatNumber(alpha)}) + ${formatNumber(c)}</div>`;
    html += `<div class="step-expression">f(${formatNumber(alpha)}) = ${formatNumber(a * alpha * alpha)} + ${formatNumber(b * alpha)} + ${formatNumber(c)}</div>`;
    html += `<div class="step-expression">f(${formatNumber(alpha)}) = ${formatNumber(beta)}</div>`;
    html += '</div>';

    // Résultat final
    html += '<div class="step">';
    html += '<div class="step-number">✨ Conclusion</div>';
    if (a > 0) {
        html += `<div class="result-box result-value">Le minimum de f est ${formatNumber(beta)}, atteint en x = ${formatNumber(alpha)}</div>`;
        html += `<div class="step-explanation">Pour tout x réel, f(x) ≥ ${formatNumber(beta)}</div>`;
    } else {
        html += `<div class="result-box result-value">Le maximum de f est ${formatNumber(beta)}, atteint en x = ${formatNumber(alpha)}</div>`;
        html += `<div class="step-explanation">Pour tout x réel, f(x) ≤ ${formatNumber(beta)}</div>`;
    }
    html += '</div>';

    return html;
}

// ============================================================
// Dessin de la parabole
// ============================================================
function drawParabola(a, b, c) {
    const graph = new GraphCanvas('functionGraph', {
        xMin: -10,
        xMax: 10,
        yMin: -10,
        yMax: 10,
        gridStep: 1
    });

    graph.clear();
    graph.drawGrid();
    graph.drawAxes();
    graph.drawTicks();

    // Dessiner la parabole
    const func = (x) => a * x * x + b * x + c;
    graph.drawFunction(func, '#2196F3', 3);

    // Marquer le sommet
    const vertex = calculateVertex(a, b, c);
    if (vertex.alpha >= -10 && vertex.alpha <= 10 && vertex.beta >= -10 && vertex.beta <= 10) {
        graph.drawPoint(vertex.alpha, vertex.beta, '#e74c3c', 6);
    }

    // Marquer les racines si elles existent
    const delta = b * b - 4 * a * c;
    if (delta > 0) {
        const x1 = (-b + Math.sqrt(delta)) / (2 * a);
        const x2 = (-b - Math.sqrt(delta)) / (2 * a);
        if (x1 >= -10 && x1 <= 10) {
            graph.drawPoint(x1, 0, '#27ae60', 5);
        }
        if (x2 >= -10 && x2 <= 10) {
            graph.drawPoint(x2, 0, '#27ae60', 5);
        }
    } else if (delta === 0) {
        const x0 = -b / (2 * a);
        if (x0 >= -10 && x0 <= 10) {
            graph.drawPoint(x0, 0, '#27ae60', 5);
        }
    }

    // Marquer le point d'intersection avec l'axe des ordonnées
    if (c >= -10 && c <= 10) {
        graph.drawPoint(0, c, '#9b59b6', 5);
    }
}

// ============================================================
// Initialisation au chargement de la page
// ============================================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFonctionsSecondDegrePage);
} else {
    initFonctionsSecondDegrePage();
}
