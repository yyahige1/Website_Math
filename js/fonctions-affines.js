// ============================================================
// Fonctions Affines : y = ax + b
// ============================================================

const FonctionsAffinesState = {
    currentType: 'graphique',
    a: 2,
    b: 3,
    x: 5,
    y: 7,
    // Pour équation à partir de 2 points
    x1: 1, y1: 5,
    x2: 3, y2: 9,
    // Pour intersection
    a1: 2, b1: 1,
    a2: -1, b2: 4
};

// ============================================================
// Initialisation
// ============================================================
function initFonctionsAffinesPage() {
    // Gestionnaires de types
    document.querySelectorAll('.type-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            FonctionsAffinesState.currentType = btn.dataset.type;
            updateInputVisibility();
            updateDisplay();
            hideSection('solutionDiv');
        });
    });

    // Gestionnaires d'inputs
    setupInputHandlers();

    // Boutons
    $.id('generateBtn').addEventListener('click', generateExercise);
    $.id('solveBtn').addEventListener('click', solveExercise);

    // Affichage initial
    updateInputVisibility();
    updateDisplay();
}

// ============================================================
// Gestion des inputs
// ============================================================
function setupInputHandlers() {
    // Graphique
    $.id('a_graph').addEventListener('input', () => {
        FonctionsAffinesState.a = parseFloat($.id('a_graph').value);
        updateDisplay();
    });
    $.id('b_graph').addEventListener('input', () => {
        FonctionsAffinesState.b = parseFloat($.id('b_graph').value);
        updateDisplay();
    });

    // Image
    $.id('a_img').addEventListener('input', () => {
        FonctionsAffinesState.a = parseFloat($.id('a_img').value);
        updateDisplay();
    });
    $.id('b_img').addEventListener('input', () => {
        FonctionsAffinesState.b = parseFloat($.id('b_img').value);
        updateDisplay();
    });
    $.id('x_img').addEventListener('input', () => {
        FonctionsAffinesState.x = parseFloat($.id('x_img').value);
        updateDisplay();
    });

    // Antécédent
    $.id('a_ant').addEventListener('input', () => {
        FonctionsAffinesState.a = parseFloat($.id('a_ant').value);
        updateDisplay();
    });
    $.id('b_ant').addEventListener('input', () => {
        FonctionsAffinesState.b = parseFloat($.id('b_ant').value);
        updateDisplay();
    });
    $.id('y_ant').addEventListener('input', () => {
        FonctionsAffinesState.y = parseFloat($.id('y_ant').value);
        updateDisplay();
    });

    // Équation (2 points)
    $.id('x1_eq').addEventListener('input', () => {
        FonctionsAffinesState.x1 = parseFloat($.id('x1_eq').value);
        updateDisplay();
    });
    $.id('y1_eq').addEventListener('input', () => {
        FonctionsAffinesState.y1 = parseFloat($.id('y1_eq').value);
        updateDisplay();
    });
    $.id('x2_eq').addEventListener('input', () => {
        FonctionsAffinesState.x2 = parseFloat($.id('x2_eq').value);
        updateDisplay();
    });
    $.id('y2_eq').addEventListener('input', () => {
        FonctionsAffinesState.y2 = parseFloat($.id('y2_eq').value);
        updateDisplay();
    });

    // Intersection
    $.id('a1_int').addEventListener('input', () => {
        FonctionsAffinesState.a1 = parseFloat($.id('a1_int').value);
        updateDisplay();
    });
    $.id('b1_int').addEventListener('input', () => {
        FonctionsAffinesState.b1 = parseFloat($.id('b1_int').value);
        updateDisplay();
    });
    $.id('a2_int').addEventListener('input', () => {
        FonctionsAffinesState.a2 = parseFloat($.id('a2_int').value);
        updateDisplay();
    });
    $.id('b2_int').addEventListener('input', () => {
        FonctionsAffinesState.b2 = parseFloat($.id('b2_int').value);
        updateDisplay();
    });
}

// ============================================================
// Affichage
// ============================================================
function updateInputVisibility() {
    // Cacher tous les inputs
    document.querySelectorAll('.coefficients').forEach(el => el.classList.add('hidden'));

    // Afficher les inputs correspondants
    const type = FonctionsAffinesState.currentType;
    if (type === 'graphique') {
        $.id('coeffGraphique').classList.remove('hidden');
    } else if (type === 'image') {
        $.id('coeffImage').classList.remove('hidden');
    } else if (type === 'antecedent') {
        $.id('coeffAntecedent').classList.remove('hidden');
    } else if (type === 'equation') {
        $.id('coeffEquation').classList.remove('hidden');
    } else if (type === 'intersection') {
        $.id('coeffIntersection').classList.remove('hidden');
    }
}

function updateDisplay() {
    const type = FonctionsAffinesState.currentType;
    let display = '';

    switch (type) {
        case 'graphique':
            display = formatLinearFunction(FonctionsAffinesState.a, FonctionsAffinesState.b);
            break;
        case 'image':
            display = `f(${FonctionsAffinesState.x}) = ? avec f(x) = ${formatLinearFunction(FonctionsAffinesState.a, FonctionsAffinesState.b)}`;
            break;
        case 'antecedent':
            display = `f(x) = ${FonctionsAffinesState.y}, x = ? avec f(x) = ${formatLinearFunction(FonctionsAffinesState.a, FonctionsAffinesState.b)}`;
            break;
        case 'equation':
            display = `Droite passant par A(${FonctionsAffinesState.x1}, ${FonctionsAffinesState.y1}) et B(${FonctionsAffinesState.x2}, ${FonctionsAffinesState.y2})`;
            break;
        case 'intersection':
            const f1 = formatLinearFunction(FonctionsAffinesState.a1, FonctionsAffinesState.b1);
            const f2 = formatLinearFunction(FonctionsAffinesState.a2, FonctionsAffinesState.b2);
            display = `${f1} et ${f2}`;
            break;
    }

    $.id('expressionDisplay').innerHTML = display;
}

// ============================================================
// Formatage
// ============================================================
function formatLinearFunction(a, b) {
    let result = 'y = ';

    // Coefficient a
    if (a === 0) {
        return `y = ${formatNumber(b)}`;
    } else if (a === 1) {
        result += 'x';
    } else if (a === -1) {
        result += '-x';
    } else {
        result += `${formatNumber(a)}x`;
    }

    // Constante b
    if (b > 0) {
        result += ` + ${formatNumber(b)}`;
    } else if (b < 0) {
        result += ` − ${formatNumber(Math.abs(b))}`;
    }

    return result;
}

// ============================================================
// Génération d'exercices
// ============================================================
function generateExercise() {
    const type = FonctionsAffinesState.currentType;

    switch (type) {
        case 'graphique':
            FonctionsAffinesState.a = randomInt(-5, 5, [0]);
            FonctionsAffinesState.b = randomInt(-8, 8);
            $.id('a_graph').value = FonctionsAffinesState.a;
            $.id('b_graph').value = FonctionsAffinesState.b;
            break;

        case 'image':
            FonctionsAffinesState.a = randomInt(-5, 5, [0]);
            FonctionsAffinesState.b = randomInt(-8, 8);
            FonctionsAffinesState.x = randomInt(-10, 10);
            $.id('a_img').value = FonctionsAffinesState.a;
            $.id('b_img').value = FonctionsAffinesState.b;
            $.id('x_img').value = FonctionsAffinesState.x;
            break;

        case 'antecedent':
            FonctionsAffinesState.a = randomInt(-5, 5, [0]);
            FonctionsAffinesState.b = randomInt(-8, 8);
            // Générer y tel que x soit entier
            const x_temp = randomInt(-10, 10);
            FonctionsAffinesState.y = FonctionsAffinesState.a * x_temp + FonctionsAffinesState.b;
            $.id('a_ant').value = FonctionsAffinesState.a;
            $.id('b_ant').value = FonctionsAffinesState.b;
            $.id('y_ant').value = FonctionsAffinesState.y;
            break;

        case 'equation':
            // Générer 2 points différents
            FonctionsAffinesState.x1 = randomInt(-5, 5);
            FonctionsAffinesState.y1 = randomInt(-8, 8);
            FonctionsAffinesState.x2 = randomInt(-5, 5, [FonctionsAffinesState.x1]);
            FonctionsAffinesState.y2 = randomInt(-8, 8);
            $.id('x1_eq').value = FonctionsAffinesState.x1;
            $.id('y1_eq').value = FonctionsAffinesState.y1;
            $.id('x2_eq').value = FonctionsAffinesState.x2;
            $.id('y2_eq').value = FonctionsAffinesState.y2;
            break;

        case 'intersection':
            FonctionsAffinesState.a1 = randomInt(-5, 5, [0]);
            FonctionsAffinesState.b1 = randomInt(-8, 8);
            FonctionsAffinesState.a2 = randomInt(-5, 5, [0, FonctionsAffinesState.a1]); // Différent de a1
            FonctionsAffinesState.b2 = randomInt(-8, 8);
            $.id('a1_int').value = FonctionsAffinesState.a1;
            $.id('b1_int').value = FonctionsAffinesState.b1;
            $.id('a2_int').value = FonctionsAffinesState.a2;
            $.id('b2_int').value = FonctionsAffinesState.b2;
            break;
    }

    updateDisplay();
    hideSection('solutionDiv');
}

// ============================================================
// Résolution
// ============================================================
function solveExercise() {
    const type = FonctionsAffinesState.currentType;
    let html = '';

    switch (type) {
        case 'graphique':
            html = solveGraphique(FonctionsAffinesState.a, FonctionsAffinesState.b);
            break;
        case 'image':
            html = solveImage(FonctionsAffinesState.a, FonctionsAffinesState.b, FonctionsAffinesState.x);
            break;
        case 'antecedent':
            html = solveAntecedent(FonctionsAffinesState.a, FonctionsAffinesState.b, FonctionsAffinesState.y);
            break;
        case 'equation':
            html = solveEquation(FonctionsAffinesState.x1, FonctionsAffinesState.y1,
                                FonctionsAffinesState.x2, FonctionsAffinesState.y2);
            break;
        case 'intersection':
            html = solveIntersection(FonctionsAffinesState.a1, FonctionsAffinesState.b1,
                                    FonctionsAffinesState.a2, FonctionsAffinesState.b2);
            break;
    }

    $.id('stepsContainer').innerHTML = html;
    showSection('solutionDiv');
}

// ============================================================
// Résolution : Représentation graphique
// ============================================================
function solveGraphique(a, b) {
    let html = '';

    // Formule
    html += '<div class="formula-box">';
    html += '<div class="formula-title">📐 Fonction affine</div>';
    html += `<div class="formula-content">${formatLinearFunction(a, b)}</div>`;
    html += '</div>';

    // Coefficient directeur
    html += '<div class="step">';
    html += `<div class="step-number">📊 Coefficient directeur : a = ${formatNumber(a)}</div>`;
    if (a > 0) {
        html += `<div class="step-explanation">La fonction est <span class="term-red">croissante</span> (la droite "monte")</div>`;
    } else if (a < 0) {
        html += `<div class="step-explanation">La fonction est <span class="term-red">décroissante</span> (la droite "descend")</div>`;
    }
    html += '</div>';

    // Ordonnée à l'origine
    html += '<div class="step">';
    html += `<div class="step-number">📍 Ordonnée à l'origine : b = ${formatNumber(b)}</div>`;
    html += `<div class="step-explanation">La droite coupe l'axe des ordonnées au point (0, ${formatNumber(b)})</div>`;
    html += '</div>';

    // Points remarquables
    html += '<div class="step">';
    html += '<div class="step-number">🎯 Points remarquables</div>';
    html += '<div class="points-table">';
    html += '<table class="result-table">';
    html += '<tr><th>x</th><th>y = ' + formatNumber(a) + 'x + ' + formatNumber(b) + '</th></tr>';

    // Point 1: x = 0
    html += `<tr><td>0</td><td>${formatNumber(b)}</td></tr>`;

    // Point 2: calculer pour x = 1 ou x = 2
    const x_test = (a !== 0) ? 1 : 2;
    const y_test = a * x_test + b;
    html += `<tr><td>${x_test}</td><td>${formatNumber(y_test)}</td></tr>`;

    html += '</table>';
    html += '</div>';
    html += '</div>';

    // Graphique
    html += '<div class="graph-container">';
    html += '<canvas id="functionGraph" width="600" height="400"></canvas>';
    html += '</div>';

    // Dessiner le graphique après un court délai
    setTimeout(() => {
        drawLinearFunction(a, b);
    }, 50);

    return html;
}

// ============================================================
// Dessin du graphique
// ============================================================
function drawLinearFunction(a, b) {
    const canvas = document.getElementById('functionGraph');
    if (!canvas) return;

    const graph = new GraphCanvas(canvas, {
        xMin: -10,
        xMax: 10,
        yMin: -10,
        yMax: 10,
        gridStep: 1
    });

    graph.clear();
    graph.drawAxes();
    graph.drawGrid();

    // Dessiner la droite
    const points = [];
    for (let x = -10; x <= 10; x += 0.1) {
        const y = a * x + b;
        if (y >= -10 && y <= 10) {
            points.push({ x, y });
        }
    }

    // Tracer la ligne
    if (points.length > 0) {
        const ctx = graph.ctx;
        ctx.strokeStyle = '#3498db';
        ctx.lineWidth = 3;
        ctx.beginPath();

        const firstPoint = graph.toCanvas(points[0].x, points[0].y);
        ctx.moveTo(firstPoint.x, firstPoint.y);

        for (let i = 1; i < points.length; i++) {
            const p = graph.toCanvas(points[i].x, points[i].y);
            ctx.lineTo(p.x, p.y);
        }

        ctx.stroke();
    }

    // Marquer les points remarquables
    // Point (0, b)
    graph.drawPoint(0, b, '#e74c3c', 6);
    graph.drawLabel(0, b, `(0, ${formatNumber(b)})`, 'top');

    // Point (1, a+b) ou autre point
    const x_mark = (a !== 0) ? 1 : 2;
    const y_mark = a * x_mark + b;
    if (y_mark >= -10 && y_mark <= 10) {
        graph.drawPoint(x_mark, y_mark, '#e74c3c', 6);
        graph.drawLabel(x_mark, y_mark, `(${x_mark}, ${formatNumber(y_mark)})`, 'bottom');
    }
}

// ============================================================
// Résolution : Calculer une image
// ============================================================
function solveImage(a, b, x) {
    let html = '';

    // Formule
    html += '<div class="formula-box">';
    html += '<div class="formula-title">📐 Calcul de l'image</div>';
    html += `<div class="formula-content">f(${x}) = ?</div>`;
    html += `<div class="formula-subtitle">avec f(x) = ${formatLinearFunction(a, b)}</div>`;
    html += '</div>';

    // Étape 1: Substitution
    html += '<div class="step">';
    html += '<div class="step-number">📍 Étape 1 : Substituer x par ' + x + '</div>';
    html += `<div class="step-expression">f(${x}) = ${formatNumber(a)} × ${x} + ${formatNumber(b)}</div>`;
    html += '</div>';

    // Étape 2: Calcul de ax
    html += '<div class="step">';
    html += '<div class="step-number">📍 Étape 2 : Calculer le produit</div>';
    const ax = a * x;
    html += `<div class="step-expression">${formatNumber(a)} × ${x} = ${formatNumber(ax)}</div>`;
    html += '</div>';

    // Étape 3: Calcul final
    html += '<div class="step">';
    html += '<div class="step-number">📍 Étape 3 : Ajouter la constante</div>';
    const result = ax + b;
    html += `<div class="step-expression">f(${x}) = ${formatNumber(ax)} + ${formatNumber(b)} = ${formatNumber(result)}</div>`;
    html += '</div>';

    // Résultat
    html += '<div class="result-box">';
    html += `<div class="result-label">✓ Image de ${x}</div>`;
    html += `<div class="result-value">f(${x}) = ${formatNumber(result)}</div>`;
    html += '</div>';

    return html;
}

// ============================================================
// Résolution : Calculer un antécédent
// ============================================================
function solveAntecedent(a, b, y) {
    let html = '';

    // Formule
    html += '<div class="formula-box">';
    html += '<div class="formula-title">📐 Calcul de l'antécédent</div>';
    html += `<div class="formula-content">f(x) = ${y}, x = ?</div>`;
    html += `<div class="formula-subtitle">avec f(x) = ${formatLinearFunction(a, b)}</div>`;
    html += '</div>';

    // Étape 1: Équation
    html += '<div class="step">';
    html += '<div class="step-number">📍 Étape 1 : Poser l'équation</div>';
    html += `<div class="step-expression">${formatNumber(a)}x + ${formatNumber(b)} = ${y}</div>`;
    html += '</div>';

    // Étape 2: Soustraire b
    html += '<div class="step">';
    html += '<div class="step-number">📍 Étape 2 : Soustraire ' + formatNumber(b) + ' des deux côtés</div>';
    const yMinusB = y - b;
    html += `<div class="step-expression">${formatNumber(a)}x = ${y} − ${formatNumber(b)} = ${formatNumber(yMinusB)}</div>`;
    html += '</div>';

    // Étape 3: Diviser par a
    html += '<div class="step">';
    html += '<div class="step-number">📍 Étape 3 : Diviser par ' + formatNumber(a) + '</div>';
    const x = yMinusB / a;
    html += `<div class="step-expression">x = ${formatNumber(yMinusB)} ÷ ${formatNumber(a)} = ${formatNumber(x)}</div>`;
    html += '</div>';

    // Résultat
    html += '<div class="result-box">';
    html += `<div class="result-label">✓ Antécédent de ${y}</div>`;
    html += `<div class="result-value">x = ${formatNumber(x)}</div>`;
    html += '</div>';

    // Vérification
    html += '<div class="step">';
    html += '<div class="step-number">✓ Vérification</div>';
    const verif = a * x + b;
    html += `<div class="step-expression">f(${formatNumber(x)}) = ${formatNumber(a)} × ${formatNumber(x)} + ${formatNumber(b)} = ${formatNumber(verif)}</div>`;
    html += '</div>';

    return html;
}

// ============================================================
// Résolution : Trouver l'équation à partir de 2 points
// ============================================================
function solveEquation(x1, y1, x2, y2) {
    let html = '';

    // Formule
    html += '<div class="formula-box">';
    html += '<div class="formula-title">📐 Équation de la droite</div>';
    html += `<div class="formula-content">Passant par A(${x1}, ${y1}) et B(${x2}, ${y2})</div>`;
    html += '</div>';

    // Étape 1: Calculer le coefficient directeur
    html += '<div class="step">';
    html += '<div class="step-number">📍 Étape 1 : Calculer le coefficient directeur a</div>';
    html += '<div class="step-explanation">Formule : a = (y₂ − y₁) / (x₂ − x₁)</div>';
    const deltaY = y2 - y1;
    const deltaX = x2 - x1;
    const a = deltaY / deltaX;
    html += `<div class="step-expression">a = (${y2} − ${y1}) / (${x2} − ${x1}) = ${formatNumber(deltaY)} / ${formatNumber(deltaX)} = ${formatNumber(a)}</div>`;
    html += '</div>';

    // Étape 2: Calculer b avec le point A
    html += '<div class="step">';
    html += '<div class="step-number">📍 Étape 2 : Calculer l'ordonnée à l'origine b</div>';
    html += `<div class="step-explanation">On utilise le point A(${x1}, ${y1}) et la formule y = ax + b</div>`;
    html += `<div class="step-expression">${y1} = ${formatNumber(a)} × ${x1} + b</div>`;
    const ax1 = a * x1;
    html += `<div class="step-expression">${y1} = ${formatNumber(ax1)} + b</div>`;
    const b = y1 - ax1;
    html += `<div class="step-expression">b = ${y1} − ${formatNumber(ax1)} = ${formatNumber(b)}</div>`;
    html += '</div>';

    // Résultat
    html += '<div class="result-box">';
    html += '<div class="result-label">✓ Équation de la droite</div>';
    html += `<div class="result-value">${formatLinearFunction(a, b)}</div>`;
    html += '</div>';

    // Vérification avec le point B
    html += '<div class="step">';
    html += '<div class="step-number">✓ Vérification avec B(' + x2 + ', ' + y2 + ')</div>';
    const y2_calc = a * x2 + b;
    html += `<div class="step-expression">y = ${formatNumber(a)} × ${x2} + ${formatNumber(b)} = ${formatNumber(y2_calc)}</div>`;
    if (Math.abs(y2_calc - y2) < 0.0001) {
        html += '<div class="step-explanation term-green">✓ Correct !</div>';
    }
    html += '</div>';

    return html;
}

// ============================================================
// Résolution : Intersection de deux droites
// ============================================================
function solveIntersection(a1, b1, a2, b2) {
    let html = '';

    const f1 = formatLinearFunction(a1, b1);
    const f2 = formatLinearFunction(a2, b2);

    // Formule
    html += '<div class="formula-box">';
    html += '<div class="formula-title">📐 Intersection de deux droites</div>';
    html += `<div class="formula-content">d₁ : ${f1}</div>`;
    html += `<div class="formula-content">d₂ : ${f2}</div>`;
    html += '</div>';

    // Vérifier si droites parallèles
    if (a1 === a2) {
        html += '<div class="result-box">';
        html += '<div class="result-label">⚠️ Droites parallèles</div>';
        if (b1 === b2) {
            html += '<div class="result-value">Les droites sont confondues (infinité de points d\'intersection)</div>';
        } else {
            html += '<div class="result-value">Les droites sont parallèles (pas de point d\'intersection)</div>';
        }
        html += '</div>';
        return html;
    }

    // Étape 1: Poser l'équation
    html += '<div class="step">';
    html += '<div class="step-number">📍 Étape 1 : Égaliser les deux fonctions</div>';
    html += `<div class="step-expression">${formatNumber(a1)}x + ${formatNumber(b1)} = ${formatNumber(a2)}x + ${formatNumber(b2)}</div>`;
    html += '</div>';

    // Étape 2: Regrouper les termes en x
    html += '<div class="step">';
    html += '<div class="step-number">📍 Étape 2 : Regrouper les termes en x</div>';
    const aCoef = a1 - a2;
    const bConst = b2 - b1;
    html += `<div class="step-expression">${formatNumber(a1)}x − ${formatNumber(a2)}x = ${formatNumber(b2)} − ${formatNumber(b1)}</div>`;
    html += `<div class="step-expression">${formatNumber(aCoef)}x = ${formatNumber(bConst)}</div>`;
    html += '</div>';

    // Étape 3: Résoudre
    html += '<div class="step">';
    html += '<div class="step-number">📍 Étape 3 : Diviser par ' + formatNumber(aCoef) + '</div>';
    const x = bConst / aCoef;
    html += `<div class="step-expression">x = ${formatNumber(bConst)} ÷ ${formatNumber(aCoef)} = ${formatNumber(x)}</div>`;
    html += '</div>';

    // Étape 4: Calculer y
    html += '<div class="step">';
    html += '<div class="step-number">📍 Étape 4 : Calculer y</div>';
    const y = a1 * x + b1;
    html += `<div class="step-expression">y = ${formatNumber(a1)} × ${formatNumber(x)} + ${formatNumber(b1)} = ${formatNumber(y)}</div>`;
    html += '</div>';

    // Résultat
    html += '<div class="result-box">';
    html += '<div class="result-label">✓ Point d\'intersection</div>';
    html += `<div class="result-value">I(${formatNumber(x)}, ${formatNumber(y)})</div>`;
    html += '</div>';

    // Graphique avec les deux droites
    html += '<div class="graph-container">';
    html += '<canvas id="functionGraph" width="600" height="400"></canvas>';
    html += '</div>';

    // Dessiner le graphique
    setTimeout(() => {
        drawTwoLines(a1, b1, a2, b2, x, y);
    }, 50);

    return html;
}

// ============================================================
// Dessin de deux droites avec point d'intersection
// ============================================================
function drawTwoLines(a1, b1, a2, b2, xInter, yInter) {
    const canvas = document.getElementById('functionGraph');
    if (!canvas) return;

    const graph = new GraphCanvas(canvas, {
        xMin: -10,
        xMax: 10,
        yMin: -10,
        yMax: 10,
        gridStep: 1
    });

    graph.clear();
    graph.drawAxes();
    graph.drawGrid();

    // Dessiner la première droite
    drawLine(graph, a1, b1, '#3498db', 3);

    // Dessiner la deuxième droite
    drawLine(graph, a2, b2, '#e74c3c', 3);

    // Marquer le point d'intersection
    if (xInter >= -10 && xInter <= 10 && yInter >= -10 && yInter <= 10) {
        graph.drawPoint(xInter, yInter, '#27ae60', 8);
        graph.drawLabel(xInter, yInter, `I(${formatNumber(xInter)}, ${formatNumber(yInter)})`, 'top');
    }
}

function drawLine(graph, a, b, color, lineWidth) {
    const points = [];
    for (let x = -10; x <= 10; x += 0.1) {
        const y = a * x + b;
        if (y >= -10 && y <= 10) {
            points.push({ x, y });
        }
    }

    if (points.length > 0) {
        const ctx = graph.ctx;
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.beginPath();

        const firstPoint = graph.toCanvas(points[0].x, points[0].y);
        ctx.moveTo(firstPoint.x, firstPoint.y);

        for (let i = 1; i < points.length; i++) {
            const p = graph.toCanvas(points[i].x, points[i].y);
            ctx.lineTo(p.x, p.y);
        }

        ctx.stroke();
    }
}
