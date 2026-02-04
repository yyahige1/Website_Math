/* ========================================
   SUITES.JS - Suites Numériques
   ======================================== */

/**
 * État du module suites
 */
const SuitesState = {
    currentType: 'arithmetique',
    // Arithmétique
    u0_arith: 3,
    r_arith: 5,
    n_arith: 10,
    // Géométrique
    u0_geo: 2,
    q_geo: 3,
    n_geo: 5,
    // Somme arithmétique
    u0_sarith: 5,
    r_sarith: 3,
    n_sarith: 10,
    // Somme géométrique
    u0_sgeo: 1,
    q_sgeo: 2,
    n_sgeo: 8,
    // Variation
    type_variation: 'arithmetique',
    u0_var: 10,
    r_var: -2,
    q_var: 0.5
};

/**
 * Initialise la page suites
 */
function initSuitesPage() {
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
            SuitesState.currentType = button.dataset.type;
            updateExerciseDisplay();
            hideSolution('solutionDiv');
        });
    });
}

/**
 * Configure les gestionnaires d'événements pour les inputs
 */
function setupInputHandlers() {
    // Arithmétique
    $('u0_arith').addEventListener('input', () => {
        SuitesState.u0_arith = parseFloat($('u0_arith').value) || 0;
        updateExerciseDisplay();
    });
    $('r_arith').addEventListener('input', () => {
        SuitesState.r_arith = parseFloat($('r_arith').value) || 0;
        updateExerciseDisplay();
    });
    $('n_arith').addEventListener('input', () => {
        SuitesState.n_arith = parseInt($('n_arith').value) || 1;
        updateExerciseDisplay();
    });

    // Géométrique
    $('u0_geo').addEventListener('input', () => {
        SuitesState.u0_geo = parseFloat($('u0_geo').value) || 0;
        updateExerciseDisplay();
    });
    $('q_geo').addEventListener('input', () => {
        SuitesState.q_geo = parseFloat($('q_geo').value) || 1;
        updateExerciseDisplay();
    });
    $('n_geo').addEventListener('input', () => {
        SuitesState.n_geo = parseInt($('n_geo').value) || 1;
        updateExerciseDisplay();
    });

    // Somme arithmétique
    $('u0_sarith').addEventListener('input', () => {
        SuitesState.u0_sarith = parseFloat($('u0_sarith').value) || 0;
        updateExerciseDisplay();
    });
    $('r_sarith').addEventListener('input', () => {
        SuitesState.r_sarith = parseFloat($('r_sarith').value) || 0;
        updateExerciseDisplay();
    });
    $('n_sarith').addEventListener('input', () => {
        SuitesState.n_sarith = parseInt($('n_sarith').value) || 1;
        updateExerciseDisplay();
    });

    // Somme géométrique
    $('u0_sgeo').addEventListener('input', () => {
        SuitesState.u0_sgeo = parseFloat($('u0_sgeo').value) || 0;
        updateExerciseDisplay();
    });
    $('q_sgeo').addEventListener('input', () => {
        SuitesState.q_sgeo = parseFloat($('q_sgeo').value) || 1;
        updateExerciseDisplay();
    });
    $('n_sgeo').addEventListener('input', () => {
        SuitesState.n_sgeo = parseInt($('n_sgeo').value) || 1;
        updateExerciseDisplay();
    });

    // Variation
    $('type_variation').addEventListener('change', () => {
        SuitesState.type_variation = $('type_variation').value;
        // Afficher/masquer les paramètres selon le type
        if (SuitesState.type_variation === 'arithmetique') {
            $('param_r_var').style.display = 'flex';
            $('param_q_var').style.display = 'none';
        } else {
            $('param_r_var').style.display = 'none';
            $('param_q_var').style.display = 'flex';
        }
        updateExerciseDisplay();
    });
    $('u0_var').addEventListener('input', () => {
        SuitesState.u0_var = parseFloat($('u0_var').value) || 0;
        updateExerciseDisplay();
    });
    $('r_var').addEventListener('input', () => {
        SuitesState.r_var = parseFloat($('r_var').value) || 0;
        updateExerciseDisplay();
    });
    $('q_var').addEventListener('input', () => {
        SuitesState.q_var = parseFloat($('q_var').value) || 1;
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
    const type = SuitesState.currentType;

    // Masquer toutes les sections
    $('arithmetiqueSection').style.display = 'none';
    $('geometriqueSection').style.display = 'none';
    $('sommeArithSection').style.display = 'none';
    $('sommeGeoSection').style.display = 'none';
    $('variationSection').style.display = 'none';

    // Afficher la section correspondante
    let display = '';
    switch (type) {
        case 'arithmetique':
            $('arithmetiqueSection').style.display = 'block';
            const r_arith = SuitesState.r_arith;
            const sign_arith = r_arith >= 0 ? '+' : '-';
            display = `u<sub>n</sub> = ${formatNumber(SuitesState.u0_arith)} ${sign_arith} ${formatNumber(Math.abs(r_arith))}n`;
            break;
        case 'geometrique':
            $('geometriqueSection').style.display = 'block';
            display = `u<sub>n</sub> = ${formatNumber(SuitesState.u0_geo)} × ${formatNumber(SuitesState.q_geo)}<sup>n</sup>`;
            break;
        case 'somme_arith':
            $('sommeArithSection').style.display = 'block';
            display = `Somme de ${SuitesState.n_sarith + 1} termes : u<sub>0</sub> + u<sub>1</sub> + ... + u<sub>${SuitesState.n_sarith}</sub>`;
            break;
        case 'somme_geo':
            $('sommeGeoSection').style.display = 'block';
            display = `Somme de ${SuitesState.n_sgeo + 1} termes : u<sub>0</sub> + u<sub>1</sub> + ... + u<sub>${SuitesState.n_sgeo}</sub>`;
            break;
        case 'variation':
            $('variationSection').style.display = 'block';
            if (SuitesState.type_variation === 'arithmetique') {
                display = `Déterminer le sens de variation de la suite arithmétique`;
            } else {
                display = `Déterminer le sens de variation de la suite géométrique`;
            }
            break;
    }

    $('expressionDisplay').innerHTML = display;
}

/**
 * Génère un exercice aléatoire
 */
function generateExercise() {
    const type = SuitesState.currentType;

    switch (type) {
        case 'arithmetique':
            SuitesState.u0_arith = randInt(-10, 10);
            SuitesState.r_arith = randInt(-5, 5);
            if (SuitesState.r_arith === 0) SuitesState.r_arith = 1;
            SuitesState.n_arith = randInt(5, 20);
            $('u0_arith').value = SuitesState.u0_arith;
            $('r_arith').value = SuitesState.r_arith;
            $('n_arith').value = SuitesState.n_arith;
            break;

        case 'geometrique':
            SuitesState.u0_geo = randInt(1, 10);
            SuitesState.q_geo = [0.5, 2, 3, 4, 0.25, 1.5][randInt(0, 5)];
            SuitesState.n_geo = randInt(3, 10);
            $('u0_geo').value = SuitesState.u0_geo;
            $('q_geo').value = SuitesState.q_geo;
            $('n_geo').value = SuitesState.n_geo;
            break;

        case 'somme_arith':
            SuitesState.u0_sarith = randInt(-5, 10);
            SuitesState.r_sarith = randInt(-3, 5);
            if (SuitesState.r_sarith === 0) SuitesState.r_sarith = 1;
            SuitesState.n_sarith = randInt(8, 20);
            $('u0_sarith').value = SuitesState.u0_sarith;
            $('r_sarith').value = SuitesState.r_sarith;
            $('n_sarith').value = SuitesState.n_sarith;
            break;

        case 'somme_geo':
            SuitesState.u0_sgeo = randInt(1, 5);
            SuitesState.q_sgeo = [0.5, 2, 3, 0.25, 1.5][randInt(0, 4)];
            SuitesState.n_sgeo = randInt(5, 12);
            $('u0_sgeo').value = SuitesState.u0_sgeo;
            $('q_sgeo').value = SuitesState.q_sgeo;
            $('n_sgeo').value = SuitesState.n_sgeo;
            break;

        case 'variation':
            SuitesState.u0_var = randInt(5, 20);
            if (Math.random() < 0.5) {
                SuitesState.type_variation = 'arithmetique';
                SuitesState.r_var = randInt(-5, 5);
                if (SuitesState.r_var === 0) SuitesState.r_var = Math.random() < 0.5 ? -2 : 2;
                $('type_variation').value = 'arithmetique';
                $('param_r_var').style.display = 'flex';
                $('param_q_var').style.display = 'none';
                $('r_var').value = SuitesState.r_var;
            } else {
                SuitesState.type_variation = 'geometrique';
                SuitesState.q_var = [0.5, 2, 3, 0.75, 1.5][randInt(0, 4)];
                SuitesState.u0_var = randInt(2, 10);
                $('type_variation').value = 'geometrique';
                $('param_r_var').style.display = 'none';
                $('param_q_var').style.display = 'flex';
                $('q_var').value = SuitesState.q_var;
            }
            $('u0_var').value = SuitesState.u0_var;
            break;
    }

    updateExerciseDisplay();
    hideSolution('solutionDiv');
}

/**
 * Résout l'exercice
 */
function solveExercise() {
    const type = SuitesState.currentType;
    let html = '';

    switch (type) {
        case 'arithmetique':
            html = solveArithmetique(SuitesState.u0_arith, SuitesState.r_arith, SuitesState.n_arith);
            break;
        case 'geometrique':
            html = solveGeometrique(SuitesState.u0_geo, SuitesState.q_geo, SuitesState.n_geo);
            break;
        case 'somme_arith':
            html = solveSommeArithmetique(SuitesState.u0_sarith, SuitesState.r_sarith, SuitesState.n_sarith);
            break;
        case 'somme_geo':
            html = solveSommeGeometrique(SuitesState.u0_sgeo, SuitesState.q_sgeo, SuitesState.n_sgeo);
            break;
        case 'variation':
            html = solveVariation(SuitesState.type_variation, SuitesState.u0_var, SuitesState.r_var, SuitesState.q_var);
            break;
    }

    $('solutionContent').innerHTML = html;
    showSolution('solutionDiv');
}

// ============================================================
// Résolution : Suite Arithmétique
// ============================================================
function solveArithmetique(u0, r, n) {
    let html = '';

    // Formule
    html += '<div class="formula-box">';
    html += '<div class="formula-title">📐 Suite Arithmétique</div>';
    html += `<div class="formula-content">u<sub>n</sub> = u<sub>0</sub> + n × r</div>`;
    html += `<div class="formula-subtitle">avec u<sub>0</sub> = ${formatNumber(u0)} et r = ${formatNumber(r)}</div>`;
    html += '</div>';

    // Formule générale
    html += '<div class="step">';
    html += '<div class="step-number">📚 Formule générale</div>';
    html += '<div class="step-explanation">Pour une suite arithmétique de premier terme u<sub>0</sub> et de raison r :</div>';
    html += '<div class="step-expression">u<sub>n</sub> = u<sub>0</sub> + n × r</div>';
    html += '</div>';

    // Application
    html += '<div class="step">';
    html += '<div class="step-number">📍 Calcul de u<sub>' + n + '</sub></div>';
    html += `<div class="step-expression">u<sub>${n}</sub> = ${formatNumber(u0)} + ${n} × (${formatNumber(r)})</div>`;
    html += `<div class="step-expression">u<sub>${n}</sub> = ${formatNumber(u0)} + ${formatNumber(n * r)}</div>`;

    const un = u0 + n * r;
    html += `<div class="step-expression">u<sub>${n}</sub> = ${formatNumber(un)}</div>`;
    html += '</div>';

    // Premiers termes
    html += '<div class="step">';
    html += '<div class="step-number">📋 Quelques termes de la suite</div>';
    html += '<div class="step-explanation">Les premiers termes pour visualiser la suite :</div>';
    html += '<table style="margin: 10px auto; border-collapse: collapse;">';
    html += '<tr style="background: #f5f5f5; font-weight: 700;">';
    for (let i = 0; i <= Math.min(n, 5); i++) {
        html += `<td style="padding: 8px 12px; border: 1px solid #ddd;">u<sub>${i}</sub></td>`;
    }
    if (n > 5) html += '<td style="padding: 8px 12px; border: 1px solid #ddd;">...</td>';
    if (n > 5) html += `<td style="padding: 8px 12px; border: 1px solid #ddd;">u<sub>${n}</sub></td>`;
    html += '</tr><tr>';
    for (let i = 0; i <= Math.min(n, 5); i++) {
        const ui = u0 + i * r;
        html += `<td style="padding: 8px 12px; border: 1px solid #ddd;">${formatNumber(ui)}</td>`;
    }
    if (n > 5) html += '<td style="padding: 8px 12px; border: 1px solid #ddd;">...</td>';
    if (n > 5) html += `<td style="padding: 8px 12px; border: 1px solid #ddd;">${formatNumber(un)}</td>`;
    html += '</tr></table>';
    html += '</div>';

    // Résultat
    html += '<div class="step">';
    html += '<div class="step-number">✨ Résultat</div>';
    html += `<div class="result-box result-value">u<sub>${n}</sub> = ${formatNumber(un)}</div>`;
    html += '</div>';

    return html;
}

// ============================================================
// Résolution : Suite Géométrique
// ============================================================
function solveGeometrique(u0, q, n) {
    let html = '';

    // Formule
    html += '<div class="formula-box">';
    html += '<div class="formula-title">📐 Suite Géométrique</div>';
    html += `<div class="formula-content">u<sub>n</sub> = u<sub>0</sub> × q<sup>n</sup></div>`;
    html += `<div class="formula-subtitle">avec u<sub>0</sub> = ${formatNumber(u0)} et q = ${formatNumber(q)}</div>`;
    html += '</div>';

    // Formule générale
    html += '<div class="step">';
    html += '<div class="step-number">📚 Formule générale</div>';
    html += '<div class="step-explanation">Pour une suite géométrique de premier terme u<sub>0</sub> et de raison q :</div>';
    html += '<div class="step-expression">u<sub>n</sub> = u<sub>0</sub> × q<sup>n</sup></div>';
    html += '</div>';

    // Application
    html += '<div class="step">';
    html += '<div class="step-number">📍 Calcul de u<sub>' + n + '</sub></div>';
    html += `<div class="step-expression">u<sub>${n}</sub> = ${formatNumber(u0)} × (${formatNumber(q)})<sup>${n}</sup></div>`;

    const qn = Math.pow(q, n);
    html += `<div class="step-expression">u<sub>${n}</sub> = ${formatNumber(u0)} × ${formatNumber(qn)}</div>`;

    const un = u0 * qn;
    html += `<div class="step-expression">u<sub>${n}</sub> = ${formatNumber(un)}</div>`;
    html += '</div>';

    // Premiers termes
    html += '<div class="step">';
    html += '<div class="step-number">📋 Quelques termes de la suite</div>';
    html += '<div class="step-explanation">Les premiers termes pour visualiser la suite :</div>';
    html += '<table style="margin: 10px auto; border-collapse: collapse;">';
    html += '<tr style="background: #f5f5f5; font-weight: 700;">';
    for (let i = 0; i <= Math.min(n, 4); i++) {
        html += `<td style="padding: 8px 12px; border: 1px solid #ddd;">u<sub>${i}</sub></td>`;
    }
    if (n > 4) html += '<td style="padding: 8px 12px; border: 1px solid #ddd;">...</td>';
    if (n > 4) html += `<td style="padding: 8px 12px; border: 1px solid #ddd;">u<sub>${n}</sub></td>`;
    html += '</tr><tr>';
    for (let i = 0; i <= Math.min(n, 4); i++) {
        const ui = u0 * Math.pow(q, i);
        html += `<td style="padding: 8px 12px; border: 1px solid #ddd;">${formatNumber(ui)}</td>`;
    }
    if (n > 4) html += '<td style="padding: 8px 12px; border: 1px solid #ddd;">...</td>';
    if (n > 4) html += `<td style="padding: 8px 12px; border: 1px solid #ddd;">${formatNumber(un)}</td>`;
    html += '</tr></table>';
    html += '</div>';

    // Résultat
    html += '<div class="step">';
    html += '<div class="step-number">✨ Résultat</div>';
    html += `<div class="result-box result-value">u<sub>${n}</sub> = ${formatNumber(un)}</div>`;
    html += '</div>';

    return html;
}

// ============================================================
// Résolution : Somme Arithmétique
// ============================================================
function solveSommeArithmetique(u0, r, n) {
    let html = '';

    const un = u0 + n * r;
    const nombre_termes = n + 1; // de u0 à un

    // Formule
    html += '<div class="formula-box">';
    html += '<div class="formula-title">📐 Somme d\'une Suite Arithmétique</div>';
    html += `<div class="formula-content">S<sub>n</sub> = nombre de termes × (premier terme + dernier terme) / 2</div>`;
    html += `<div class="formula-subtitle">Suite : u<sub>0</sub> = ${formatNumber(u0)}, r = ${formatNumber(r)}</div>`;
    html += '</div>';

    // Formule générale
    html += '<div class="step">';
    html += '<div class="step-number">📚 Formule de la somme</div>';
    html += '<div class="step-explanation">Pour calculer S<sub>n</sub> = u<sub>0</sub> + u<sub>1</sub> + ... + u<sub>n</sub> :</div>';
    html += `<div class="step-expression">S<sub>n</sub> = ${katex.renderToString("\\frac{(n+1)(u_0 + u_n)}{2}", {throwOnError: false})}</div>`;
    html += `<div class="step-explanation">Ou encore : S<sub>n</sub> = (nombre de termes) × (moyenne des extrêmes)</div>`;
    html += '</div>';

    // Calcul de u_n
    html += '<div class="step">';
    html += '<div class="step-number">📍 Étape 1 : Calculer u<sub>' + n + '</sub></div>';
    html += `<div class="step-expression">u<sub>${n}</sub> = u<sub>0</sub> + n × r</div>`;
    html += `<div class="step-expression">u<sub>${n}</sub> = ${formatNumber(u0)} + ${n} × (${formatNumber(r)})</div>`;
    html += `<div class="step-expression">u<sub>${n}</sub> = ${formatNumber(un)}</div>`;
    html += '</div>';

    // Application de la formule
    html += '<div class="step">';
    html += '<div class="step-number">📍 Étape 2 : Appliquer la formule de la somme</div>';
    html += `<div class="step-expression">S<sub>${n}</sub> = ${nombre_termes} × (${formatNumber(u0)} + ${formatNumber(un)}) / 2</div>`;
    html += `<div class="step-expression">S<sub>${n}</sub> = ${nombre_termes} × ${formatNumber(u0 + un)} / 2</div>`;

    const somme = nombre_termes * (u0 + un) / 2;
    html += `<div class="step-expression">S<sub>${n}</sub> = ${formatNumber(somme)}</div>`;
    html += '</div>';

    // Résultat
    html += '<div class="step">';
    html += '<div class="step-number">✨ Résultat</div>';
    html += `<div class="result-box result-value">S<sub>${n}</sub> = ${formatNumber(somme)}</div>`;
    html += `<div class="step-explanation">Somme de ${nombre_termes} termes (de u<sub>0</sub> à u<sub>${n}</sub>)</div>`;
    html += '</div>';

    return html;
}

// ============================================================
// Résolution : Somme Géométrique
// ============================================================
function solveSommeGeometrique(u0, q, n) {
    let html = '';

    const nombre_termes = n + 1;

    // Formule
    html += '<div class="formula-box">';
    html += '<div class="formula-title">📐 Somme d\'une Suite Géométrique</div>';
    if (q !== 1) {
        html += `<div class="formula-content">S<sub>n</sub> = u<sub>0</sub> × (1 - q<sup>n+1</sup>) / (1 - q)</div>`;
    } else {
        html += `<div class="formula-content">S<sub>n</sub> = (n + 1) × u<sub>0</sub> (car q = 1)</div>`;
    }
    html += `<div class="formula-subtitle">Suite : u<sub>0</sub> = ${formatNumber(u0)}, q = ${formatNumber(q)}</div>`;
    html += '</div>';

    if (q === 1) {
        // Cas particulier q = 1
        html += '<div class="step">';
        html += '<div class="step-number">⚠️ Cas particulier : q = 1</div>';
        html += '<div class="step-explanation">Quand q = 1, tous les termes sont égaux à u<sub>0</sub></div>';
        html += `<div class="step-expression">S<sub>${n}</sub> = ${nombre_termes} × ${formatNumber(u0)} = ${formatNumber(nombre_termes * u0)}</div>`;
        html += '</div>';

        html += '<div class="step">';
        html += '<div class="step-number">✨ Résultat</div>';
        html += `<div class="result-box result-value">S<sub>${n}</sub> = ${formatNumber(nombre_termes * u0)}</div>`;
        html += '</div>';
    } else {
        // Formule générale
        html += '<div class="step">';
        html += '<div class="step-number">📚 Formule de la somme</div>';
        html += '<div class="step-explanation">Pour calculer S<sub>n</sub> = u<sub>0</sub> + u<sub>1</sub> + ... + u<sub>n</sub> quand q ≠ 1 :</div>';
        html += `<div class="step-expression">S<sub>n</sub> = ${katex.renderToString("u_0 \\times \\frac{1 - q^{n+1}}{1 - q}", {throwOnError: false})}</div>`;
        html += '</div>';

        // Application
        html += '<div class="step">';
        html += '<div class="step-number">📍 Calcul de la somme</div>';
        html += `<div class="step-expression">S<sub>${n}</sub> = ${formatNumber(u0)} × (1 - (${formatNumber(q)})<sup>${n + 1}</sup>) / (1 - ${formatNumber(q)})</div>`;

        const qnp1 = Math.pow(q, n + 1);
        html += `<div class="step-expression">S<sub>${n}</sub> = ${formatNumber(u0)} × (1 - ${formatNumber(qnp1)}) / ${formatNumber(1 - q)}</div>`;
        html += `<div class="step-expression">S<sub>${n}</sub> = ${formatNumber(u0)} × ${formatNumber(1 - qnp1)} / ${formatNumber(1 - q)}</div>`;

        const somme = u0 * (1 - qnp1) / (1 - q);
        html += `<div class="step-expression">S<sub>${n}</sub> = ${formatNumber(somme)}</div>`;
        html += '</div>';

        // Résultat
        html += '<div class="step">';
        html += '<div class="step-number">✨ Résultat</div>';
        html += `<div class="result-box result-value">S<sub>${n}</sub> = ${formatNumber(somme)}</div>`;
        html += `<div class="step-explanation">Somme de ${nombre_termes} termes (de u<sub>0</sub> à u<sub>${n}</sub>)</div>`;
        html += '</div>';
    }

    return html;
}

// ============================================================
// Résolution : Sens de Variation
// ============================================================
function solveVariation(type, u0, r, q) {
    let html = '';

    if (type === 'arithmetique') {
        // Suite arithmétique
        html += '<div class="formula-box">';
        html += '<div class="formula-title">📐 Sens de Variation - Suite Arithmétique</div>';
        html += `<div class="formula-content">u<sub>n</sub> = ${formatNumber(u0)} + ${formatNumber(r)}n</div>`;
        html += '</div>';

        html += '<div class="step">';
        html += '<div class="step-number">📚 Principe</div>';
        html += '<div class="step-explanation">Pour une suite arithmétique, le sens de variation dépend de la raison r :</div>';
        html += '<div class="step-explanation">• Si r > 0 : la suite est <strong>strictement croissante</strong></div>';
        html += '<div class="step-explanation">• Si r < 0 : la suite est <strong>strictement décroissante</strong></div>';
        html += '<div class="step-explanation">• Si r = 0 : la suite est <strong>constante</strong></div>';
        html += '</div>';

        html += '<div class="step">';
        html += '<div class="step-number">📍 Calcul de u<sub>n+1</sub> - u<sub>n</sub></div>';
        html += '<div class="step-expression">u<sub>n+1</sub> - u<sub>n</sub> = [u<sub>0</sub> + (n+1)r] - [u<sub>0</sub> + nr]</div>';
        html += '<div class="step-expression">u<sub>n+1</sub> - u<sub>n</sub> = u<sub>0</sub> + nr + r - u<sub>0</sub> - nr</div>';
        html += '<div class="step-expression">u<sub>n+1</sub> - u<sub>n</sub> = r</div>';
        html += `<div class="step-expression">u<sub>n+1</sub> - u<sub>n</sub> = ${formatNumber(r)}</div>`;
        html += '</div>';

        html += '<div class="step">';
        html += '<div class="step-number">✨ Conclusion</div>';
        if (r > 0) {
            html += `<div class="result-box">La suite est <span style="color: #27ae60; font-weight: 700;">strictement croissante</span></div>`;
            html += `<div class="step-explanation">Car r = ${formatNumber(r)} > 0</div>`;
        } else if (r < 0) {
            html += `<div class="result-box">La suite est <span style="color: #e74c3c; font-weight: 700;">strictement décroissante</span></div>`;
            html += `<div class="step-explanation">Car r = ${formatNumber(r)} < 0</div>`;
        } else {
            html += `<div class="result-box">La suite est <span style="color: #3498db; font-weight: 700;">constante</span></div>`;
            html += `<div class="step-explanation">Car r = 0</div>`;
        }
        html += '</div>';
    } else {
        // Suite géométrique
        html += '<div class="formula-box">';
        html += '<div class="formula-title">📐 Sens de Variation - Suite Géométrique</div>';
        html += `<div class="formula-content">u<sub>n</sub> = ${formatNumber(u0)} × ${formatNumber(q)}<sup>n</sup></div>`;
        html += '</div>';

        html += '<div class="step">';
        html += '<div class="step-number">📚 Principe</div>';
        html += '<div class="step-explanation">Pour une suite géométrique avec u<sub>0</sub> > 0 :</div>';
        html += '<div class="step-explanation">• Si q > 1 : la suite est <strong>strictement croissante</strong></div>';
        html += '<div class="step-explanation">• Si 0 < q < 1 : la suite est <strong>strictement décroissante</strong></div>';
        html += '<div class="step-explanation">• Si q = 1 : la suite est <strong>constante</strong></div>';
        html += '</div>';

        html += '<div class="step">';
        html += '<div class="step-number">📍 Calcul de u<sub>n+1</sub> / u<sub>n</sub></div>';
        html += '<div class="step-expression">u<sub>n+1</sub> / u<sub>n</sub> = (u<sub>0</sub> × q<sup>n+1</sup>) / (u<sub>0</sub> × q<sup>n</sup>)</div>';
        html += '<div class="step-expression">u<sub>n+1</sub> / u<sub>n</sub> = q<sup>n+1-n</sup></div>';
        html += '<div class="step-expression">u<sub>n+1</sub> / u<sub>n</sub> = q</div>';
        html += `<div class="step-expression">u<sub>n+1</sub> / u<sub>n</sub> = ${formatNumber(q)}</div>`;
        html += '</div>';

        html += '<div class="step">';
        html += '<div class="step-number">📍 Analyse</div>';
        html += `<div class="step-expression">u<sub>0</sub> = ${formatNumber(u0)} ${u0 > 0 ? '> 0' : '< 0'}</div>`;
        html += `<div class="step-expression">q = ${formatNumber(q)}</div>`;
        html += '</div>';

        html += '<div class="step">';
        html += '<div class="step-number">✨ Conclusion</div>';
        if (u0 > 0) {
            if (q > 1) {
                html += `<div class="result-box">La suite est <span style="color: #27ae60; font-weight: 700;">strictement croissante</span></div>`;
                html += `<div class="step-explanation">Car u<sub>0</sub> > 0 et q = ${formatNumber(q)} > 1</div>`;
            } else if (q > 0 && q < 1) {
                html += `<div class="result-box">La suite est <span style="color: #e74c3c; font-weight: 700;">strictement décroissante</span></div>`;
                html += `<div class="step-explanation">Car u<sub>0</sub> > 0 et 0 < q = ${formatNumber(q)} < 1</div>`;
            } else if (q === 1) {
                html += `<div class="result-box">La suite est <span style="color: #3498db; font-weight: 700;">constante</span></div>`;
                html += `<div class="step-explanation">Car q = 1</div>`;
            }
        } else {
            html += `<div class="result-box">Le sens de variation dépend du signe de q et de la parité de n</div>`;
            html += `<div class="step-explanation">Car u<sub>0</sub> < 0, l'analyse est plus complexe</div>`;
        }
        html += '</div>';
    }

    return html;
}

/**
 * Fonction utilitaire pour générer un entier aléatoire
 */
function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Initialiser la page
document.addEventListener('DOMContentLoaded', initSuitesPage);
