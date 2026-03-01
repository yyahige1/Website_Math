/* ========================================
   SYMETRIES.JS - Symetries axiale et centrale (6e-5e)
   ======================================== */

/**
 * Etat du module Symetries
 */
const SymetriesState = {
    currentType: 'axiale',
    exercise: {}
};

// ========================================
// Utilitaires locaux
// ========================================

function symRandInt(min, max, exclude) {
    const excl = exclude || [];
    let val;
    do {
        val = Math.floor(Math.random() * (max - min + 1)) + min;
    } while (excl.includes(val));
    return val;
}

function symPick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// ========================================
// Initialisation
// ========================================

function initSymetriesPage() {
    setupTypeButtons();
    setupActionButtons();
    generateSym();
    updateSymDisplay();
}

function setupTypeButtons() {
    const typeButtons = document.querySelectorAll('.type-btn');
    typeButtons.forEach(button => {
        button.addEventListener('click', () => {
            typeButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            SymetriesState.currentType = button.dataset.type;
            generateSym();
            updateSymDisplay();
            hideSolution('solutionDiv');
        });
    });
}

function setupActionButtons() {
    $('generateBtn').addEventListener('click', () => {
        generateSym();
        updateSymDisplay();
        hideSolution('solutionDiv');
    });

    $('solveBtn').addEventListener('click', () => {
        solveSym();
    });
}

// ========================================
// Generation d'exercices
// ========================================

function generateSym() {
    const type = SymetriesState.currentType;
    if (type === 'axiale') {
        generateAxiale();
    } else {
        generateCentrale();
    }
}

function generateAxiale() {
    const ex = {};
    ex.ax = symRandInt(-4, 4);
    ex.ay = symRandInt(-4, 4);

    // Choisir orientation de l'axe
    ex.axisType = symPick(['horizontal', 'vertical']);

    if (ex.axisType === 'horizontal') {
        // Axe y = k, k different de ay
        ex.axisValue = symRandInt(-3, 3, [ex.ay]);
        // Symetrique : reflexion par rapport a y = k
        ex.apx = ex.ax;
        ex.apy = 2 * ex.axisValue - ex.ay;
    } else {
        // Axe x = k, k different de ax
        ex.axisValue = symRandInt(-3, 3, [ex.ax]);
        // Symetrique : reflexion par rapport a x = k
        ex.apx = 2 * ex.axisValue - ex.ax;
        ex.apy = ex.ay;
    }

    SymetriesState.exercise = ex;
}

function generateCentrale() {
    const ex = {};
    ex.ax = symRandInt(-4, 4);
    ex.ay = symRandInt(-4, 4);

    // Centre O different de A
    do {
        ex.ox = symRandInt(-3, 3);
        ex.oy = symRandInt(-3, 3);
    } while (ex.ox === ex.ax && ex.oy === ex.ay);

    // A' = 2O - A
    ex.apx = 2 * ex.ox - ex.ax;
    ex.apy = 2 * ex.oy - ex.ay;

    SymetriesState.exercise = ex;
}

// ========================================
// Affichage
// ========================================

function updateSymDisplay() {
    const type = SymetriesState.currentType;
    const ex = SymetriesState.exercise;
    let display = '';

    if (type === 'axiale') {
        const axisLabel = ex.axisType === 'horizontal'
            ? 'y = ' + ex.axisValue
            : 'x = ' + ex.axisValue;
        display = `Trouver le sym\u00e9trique du point <strong>A(${ex.ax} ; ${ex.ay})</strong> `;
        display += `par rapport \u00e0 l'axe <strong>(d) : ${axisLabel}</strong>`;
    } else {
        display = `Trouver le sym\u00e9trique du point <strong>A(${ex.ax} ; ${ex.ay})</strong> `;
        display += `par rapport au centre <strong>O(${ex.ox} ; ${ex.oy})</strong>`;
    }

    $('exerciseDisplay').innerHTML = display;

    // Dessiner le canvas de l'enonce
    requestAnimationFrame(() => {
        drawSymCanvas('symCanvas', ex, type, false);
    });
}

// ========================================
// Dessin Canvas
// ========================================

function drawSymCanvas(canvasId, ex, type, showSolution) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const W = canvas.width;
    const H = canvas.height;
    const gridMin = -5;
    const gridMax = 5;
    const range = gridMax - gridMin; // 10
    const step = W / range;

    // Convertir coordonnees math -> canvas
    function toX(mx) { return (mx - gridMin) * step; }
    function toY(my) { return H - (my - gridMin) * step; }

    // Fond blanc
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, W, H);

    // Grille legere
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 0.5;
    for (let i = gridMin; i <= gridMax; i++) {
        // Lignes verticales
        ctx.beginPath();
        ctx.moveTo(toX(i), 0);
        ctx.lineTo(toX(i), H);
        ctx.stroke();
        // Lignes horizontales
        ctx.beginPath();
        ctx.moveTo(0, toY(i));
        ctx.lineTo(W, toY(i));
        ctx.stroke();
    }

    // Axes principaux (plus sombres)
    ctx.strokeStyle = '#666666';
    ctx.lineWidth = 1.5;
    // Axe X
    ctx.beginPath();
    ctx.moveTo(0, toY(0));
    ctx.lineTo(W, toY(0));
    ctx.stroke();
    // Axe Y
    ctx.beginPath();
    ctx.moveTo(toX(0), 0);
    ctx.lineTo(toX(0), H);
    ctx.stroke();

    // Graduations et labels
    ctx.fillStyle = '#666666';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    for (let i = gridMin; i <= gridMax; i++) {
        if (i === 0) continue;
        // Graduations axe X
        ctx.beginPath();
        ctx.moveTo(toX(i), toY(0) - 3);
        ctx.lineTo(toX(i), toY(0) + 3);
        ctx.stroke();
        ctx.fillText(i, toX(i), toY(0) + 5);
        // Graduations axe Y
        ctx.beginPath();
        ctx.moveTo(toX(0) - 3, toY(i));
        ctx.lineTo(toX(0) + 3, toY(i));
        ctx.stroke();
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText(i, toX(0) - 6, toY(i));
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
    }
    // Label origine
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';
    ctx.fillText('0', toX(0) - 4, toY(0) + 4);

    // --- Elements specifiques au type ---

    if (type === 'axiale') {
        // Axe de symetrie (rouge, pointille)
        ctx.strokeStyle = '#e53e3e';
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 4]);
        ctx.beginPath();
        if (ex.axisType === 'horizontal') {
            ctx.moveTo(0, toY(ex.axisValue));
            ctx.lineTo(W, toY(ex.axisValue));
        } else {
            ctx.moveTo(toX(ex.axisValue), 0);
            ctx.lineTo(toX(ex.axisValue), H);
        }
        ctx.stroke();
        ctx.setLineDash([]);

        // Label de l'axe
        ctx.fillStyle = '#e53e3e';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'bottom';
        const axisLabel = ex.axisType === 'horizontal'
            ? 'y = ' + ex.axisValue
            : 'x = ' + ex.axisValue;
        if (ex.axisType === 'horizontal') {
            ctx.fillText('(d) : ' + axisLabel, 8, toY(ex.axisValue) - 5);
        } else {
            ctx.save();
            ctx.translate(toX(ex.axisValue) + 14, 16);
            ctx.fillText('(d) : ' + axisLabel, 0, 0);
            ctx.restore();
        }
    } else {
        // Centre O (point rouge)
        drawPoint(ctx, toX(ex.ox), toY(ex.oy), '#e53e3e', 'O(' + ex.ox + ' ; ' + ex.oy + ')', 6);
    }

    // Point A (bleu)
    drawPoint(ctx, toX(ex.ax), toY(ex.ay), '#3182ce', 'A(' + ex.ax + ' ; ' + ex.ay + ')', 6);

    // --- Solution : ajouter A' et constructions ---
    if (showSolution) {
        if (type === 'axiale') {
            // Perpendiculaire de A a l'axe (pointille bleu)
            ctx.strokeStyle = '#3182ce';
            ctx.lineWidth = 1;
            ctx.setLineDash([4, 3]);
            ctx.beginPath();
            ctx.moveTo(toX(ex.ax), toY(ex.ay));
            if (ex.axisType === 'horizontal') {
                ctx.lineTo(toX(ex.ax), toY(ex.axisValue));
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(toX(ex.ax), toY(ex.axisValue));
            } else {
                ctx.lineTo(toX(ex.axisValue), toY(ex.ay));
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(toX(ex.axisValue), toY(ex.ay));
            }
            ctx.lineTo(toX(ex.apx), toY(ex.apy));
            ctx.stroke();
            ctx.setLineDash([]);

            // Pied de la perpendiculaire (petit carre)
            const footX = ex.axisType === 'horizontal' ? ex.ax : ex.axisValue;
            const footY = ex.axisType === 'horizontal' ? ex.axisValue : ex.ay;
            ctx.strokeStyle = '#3182ce';
            ctx.lineWidth = 1;
            const sq = 6;
            ctx.strokeRect(toX(footX) - sq, toY(footY) - sq, sq, sq);
        } else {
            // Segment [A O A'] (pointille)
            ctx.strokeStyle = '#805ad5';
            ctx.lineWidth = 1;
            ctx.setLineDash([4, 3]);
            ctx.beginPath();
            ctx.moveTo(toX(ex.ax), toY(ex.ay));
            ctx.lineTo(toX(ex.apx), toY(ex.apy));
            ctx.stroke();
            ctx.setLineDash([]);
        }

        // Point A' (vert)
        drawPoint(ctx, toX(ex.apx), toY(ex.apy), '#38a169', "A'(" + ex.apx + ' ; ' + ex.apy + ')', 6);
    }
}

/**
 * Dessine un point avec bordure blanche et label
 */
function drawPoint(ctx, cx, cy, color, label, radius) {
    // Cercle blanc (bordure)
    ctx.beginPath();
    ctx.arc(cx, cy, radius + 2, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    // Cercle colore
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    // Label
    ctx.fillStyle = color;
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'bottom';
    ctx.fillText(label, cx + radius + 4, cy - 4);
}

// ========================================
// Resolution
// ========================================

function solveSym() {
    const type = SymetriesState.currentType;
    let html = '';

    if (type === 'axiale') {
        html = solveAxiale();
    } else {
        html = solveCentrale();
    }

    // Ajouter canvas de solution
    html += '<div style="text-align:center; margin-top: 16px;">';
    html += '<canvas id="symCanvasSol" width="400" height="400" style="border:1px solid #e2e8f0; border-radius:8px;"></canvas>';
    html += '</div>';

    $('solutionDiv').innerHTML = html;
    showSolution('solutionDiv');

    // Dessiner apres insertion dans le DOM
    const ex = SymetriesState.exercise;
    requestAnimationFrame(() => {
        drawSymCanvas('symCanvasSol', ex, type, true);
    });
}

function solveAxiale() {
    const ex = SymetriesState.exercise;
    let html = '<h3>Solution</h3>';

    const axisLabel = ex.axisType === 'horizontal'
        ? 'y = ' + ex.axisValue
        : 'x = ' + ex.axisValue;

    // Etape 1 : Rappel de la methode
    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : M\u00e9thode</div>';
    html += '<div class="step-explanation">';
    html += 'Le sym\u00e9trique d\'un point par rapport \u00e0 un axe se trouve en tra\u00e7ant ';
    html += 'la perpendiculaire \u00e0 l\'axe passant par le point, puis en reportant ';
    html += 'la m\u00eame distance de l\'autre c\u00f4t\u00e9 de l\'axe.';
    html += '</div>';
    html += '</div>';

    // Etape 2 : Calcul de la distance
    if (ex.axisType === 'horizontal') {
        const dist = Math.abs(ex.ay - ex.axisValue);
        html += '<div class="step">';
        html += '<div class="step-number">Etape 2 : Distance \u00e0 l\'axe</div>';
        html += '<div class="step-expression">';
        html += 'd(A, (d)) = |y<sub>A</sub> \u2212 ' + ex.axisValue + '| = |' + ex.ay + ' \u2212 ' + ex.axisValue + '| = ' + dist;
        html += '</div>';
        html += '<div class="step-explanation">';
        html += 'L\'axe est horizontal (y = ' + ex.axisValue + '), donc on mesure la distance verticale.';
        html += '</div>';
        html += '</div>';

        // Etape 3 : Coordonnees de A'
        html += '<div class="step">';
        html += '<div class="step-number">Etape 3 : Coordonn\u00e9es de A\'</div>';
        html += '<div class="step-expression">';
        html += "x<sub>A'</sub> = x<sub>A</sub> = " + ex.ax + '<br>';
        html += "y<sub>A'</sub> = 2 \u00d7 " + ex.axisValue + ' \u2212 ' + ex.ay + ' = ' + ex.apy;
        html += '</div>';
        html += '<div class="step-explanation">';
        html += 'L\'abscisse ne change pas (la perpendiculaire est verticale). ';
        html += 'L\'ordonn\u00e9e se calcule par la formule y\' = 2k \u2212 y o\u00f9 k est la valeur de l\'axe.';
        html += '</div>';
        html += '</div>';
    } else {
        const dist = Math.abs(ex.ax - ex.axisValue);
        html += '<div class="step">';
        html += '<div class="step-number">Etape 2 : Distance \u00e0 l\'axe</div>';
        html += '<div class="step-expression">';
        html += 'd(A, (d)) = |x<sub>A</sub> \u2212 ' + ex.axisValue + '| = |' + ex.ax + ' \u2212 ' + ex.axisValue + '| = ' + dist;
        html += '</div>';
        html += '<div class="step-explanation">';
        html += 'L\'axe est vertical (x = ' + ex.axisValue + '), donc on mesure la distance horizontale.';
        html += '</div>';
        html += '</div>';

        // Etape 3 : Coordonnees de A'
        html += '<div class="step">';
        html += '<div class="step-number">Etape 3 : Coordonn\u00e9es de A\'</div>';
        html += '<div class="step-expression">';
        html += "x<sub>A'</sub> = 2 \u00d7 " + ex.axisValue + ' \u2212 ' + ex.ax + ' = ' + ex.apx + '<br>';
        html += "y<sub>A'</sub> = y<sub>A</sub> = " + ex.ay;
        html += '</div>';
        html += '<div class="step-explanation">';
        html += 'L\'ordonn\u00e9e ne change pas (la perpendiculaire est horizontale). ';
        html += 'L\'abscisse se calcule par la formule x\' = 2k \u2212 x o\u00f9 k est la valeur de l\'axe.';
        html += '</div>';
        html += '</div>';
    }

    // Etape 4 : Verification
    html += '<div class="step">';
    html += '<div class="step-number">Etape 4 : V\u00e9rification</div>';
    html += '<div class="step-expression">';
    if (ex.axisType === 'horizontal') {
        const midY = (ex.ay + ex.apy) / 2;
        html += 'Milieu de [AA\'] : y = (' + ex.ay + ' + ' + ex.apy + ') / 2 = ' + midY + ' = ' + ex.axisValue + ' (valeur de l\'axe)';
    } else {
        const midX = (ex.ax + ex.apx) / 2;
        html += 'Milieu de [AA\'] : x = (' + ex.ax + ' + ' + ex.apx + ') / 2 = ' + midX + ' = ' + ex.axisValue + ' (valeur de l\'axe)';
    }
    html += '</div>';
    html += '<div class="step-explanation">';
    html += 'Le milieu du segment [AA\'] est bien sur l\'axe de sym\u00e9trie.';
    html += '</div>';
    html += '</div>';

    // Resultat
    html += '<div class="result-highlight">';
    html += '<div class="final">';
    html += "A'(" + ex.apx + ' ; ' + ex.apy + ')';
    html += '</div>';
    html += '</div>';

    return html;
}

function solveCentrale() {
    const ex = SymetriesState.exercise;
    let html = '<h3>Solution</h3>';

    // Etape 1 : Rappel
    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : M\u00e9thode</div>';
    html += '<div class="step-explanation">';
    html += 'Le sym\u00e9trique d\'un point A par rapport \u00e0 un centre O est le point A\' ';
    html += 'tel que O est le milieu du segment [AA\'].';
    html += '</div>';
    html += '</div>';

    // Etape 2 : Formules
    html += '<div class="step">';
    html += '<div class="step-number">Etape 2 : Formules</div>';
    html += '<div class="step-expression">';
    html += 'Si O est le milieu de [AA\'] alors :<br>';
    html += "x<sub>A'</sub> = 2 \u00d7 x<sub>O</sub> \u2212 x<sub>A</sub><br>";
    html += "y<sub>A'</sub> = 2 \u00d7 y<sub>O</sub> \u2212 y<sub>A</sub>";
    html += '</div>';
    html += '<div class="step-explanation">';
    html += 'On utilise la propri\u00e9t\u00e9 du milieu : x<sub>O</sub> = (x<sub>A</sub> + x<sub>A\'</sub>) / 2, ';
    html += 'donc x<sub>A\'</sub> = 2x<sub>O</sub> \u2212 x<sub>A</sub>. Idem pour y.';
    html += '</div>';
    html += '</div>';

    // Etape 3 : Calcul
    html += '<div class="step">';
    html += '<div class="step-number">Etape 3 : Calcul des coordonn\u00e9es</div>';
    html += '<div class="step-expression">';
    html += "x<sub>A'</sub> = 2 \u00d7 " + ex.ox + ' \u2212 ' + ex.ax + ' = ' + (2 * ex.ox) + ' \u2212 ' + ex.ax + ' = ' + ex.apx + '<br>';
    html += "y<sub>A'</sub> = 2 \u00d7 " + ex.oy + ' \u2212 ' + ex.ay + ' = ' + (2 * ex.oy) + ' \u2212 ' + ex.ay + ' = ' + ex.apy;
    html += '</div>';
    html += '<div class="step-explanation">';
    html += 'On remplace par les coordonn\u00e9es de O(' + ex.ox + ' ; ' + ex.oy + ') et A(' + ex.ax + ' ; ' + ex.ay + ').';
    html += '</div>';
    html += '</div>';

    // Etape 4 : Verification
    html += '<div class="step">';
    html += '<div class="step-number">Etape 4 : V\u00e9rification</div>';
    html += '<div class="step-expression">';
    const midX = (ex.ax + ex.apx) / 2;
    const midY = (ex.ay + ex.apy) / 2;
    html += 'Milieu de [AA\'] : ((' + ex.ax + ' + ' + ex.apx + ') / 2 ; (' + ex.ay + ' + ' + ex.apy + ') / 2)<br>';
    html += '= (' + midX + ' ; ' + midY + ') = O(' + ex.ox + ' ; ' + ex.oy + ')';
    html += '</div>';
    html += '<div class="step-explanation">';
    html += 'Le milieu de [AA\'] est bien le point O, ce qui confirme que A\' est le sym\u00e9trique de A par rapport \u00e0 O.';
    html += '</div>';
    html += '</div>';

    // Resultat
    html += '<div class="result-highlight">';
    html += '<div class="final">';
    html += "A'(" + ex.apx + ' ; ' + ex.apy + ')';
    html += '</div>';
    html += '</div>';

    return html;
}

// ========================================
// Initialisation au chargement
// ========================================

document.addEventListener('DOMContentLoaded', initSymetriesPage);
