/* ========================================
   TRANSLATIONS-ROTATIONS.JS - Translations et Rotations (4e)
   ======================================== */

/**
 * Etat du module
 */
const TransRotState = {
    currentType: 'translation',
    exercise: {}
};

// ========================================
// Utilitaires locaux
// ========================================

function trRandInt(min, max, exclude) {
    const excl = exclude || [];
    let val;
    do {
        val = Math.floor(Math.random() * (max - min + 1)) + min;
    } while (excl.includes(val));
    return val;
}

function trPick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// ========================================
// Initialisation
// ========================================

function initTransRotPage() {
    setupTypeButtons();
    setupActionButtons();
    generateTransRot();
    updateTransRotDisplay();
}

function setupTypeButtons() {
    const typeButtons = document.querySelectorAll('.type-btn');
    typeButtons.forEach(button => {
        button.addEventListener('click', () => {
            typeButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            TransRotState.currentType = button.dataset.type;
            generateTransRot();
            updateTransRotDisplay();
            hideSolution('solutionDiv');
        });
    });
}

function setupActionButtons() {
    $('generateBtn').addEventListener('click', () => {
        generateTransRot();
        updateTransRotDisplay();
        hideSolution('solutionDiv');
    });

    $('solveBtn').addEventListener('click', () => {
        solveTransRot();
    });
}

// ========================================
// Generation d'exercices
// ========================================

function generateTransRot() {
    const type = TransRotState.currentType;
    if (type === 'translation') {
        generateTranslation();
    } else {
        generateRotation();
    }
}

function generateTranslation() {
    const ex = {};
    // Point A
    ex.ax = trRandInt(-3, 3);
    ex.ay = trRandInt(-3, 3);

    // Vecteur de translation (non nul)
    do {
        ex.vx = trRandInt(-4, 4);
        ex.vy = trRandInt(-4, 4);
    } while (ex.vx === 0 && ex.vy === 0);

    // Image A' = A + vecteur
    ex.apx = ex.ax + ex.vx;
    ex.apy = ex.ay + ex.vy;

    TransRotState.exercise = ex;
}

function generateRotation() {
    const ex = {};
    // Point A
    ex.ax = trRandInt(-3, 3);
    ex.ay = trRandInt(-3, 3);

    // Centre de rotation O (different de A)
    do {
        ex.ox = trRandInt(-2, 2);
        ex.oy = trRandInt(-2, 2);
    } while (ex.ox === ex.ax && ex.oy === ex.ay);

    // Angle de rotation (multiples de 90 pour des resultats entiers)
    ex.angle = trPick([90, -90, 180]);

    // Calcul de l'image
    const dx = ex.ax - ex.ox;
    const dy = ex.ay - ex.oy;
    const angleRad = ex.angle * Math.PI / 180;
    const cosA = Math.round(Math.cos(angleRad));
    const sinA = Math.round(Math.sin(angleRad));

    ex.apx = ex.ox + cosA * dx - sinA * dy;
    ex.apy = ex.oy + sinA * dx + cosA * dy;

    TransRotState.exercise = ex;
}

// ========================================
// Affichage
// ========================================

function updateTransRotDisplay() {
    const type = TransRotState.currentType;
    const ex = TransRotState.exercise;
    let display = '';

    if (type === 'translation') {
        const signVx = ex.vx >= 0 ? '' : '\u2212';
        const signVy = ex.vy >= 0 ? '' : '\u2212';
        display = 'Trouver l\'image du point <strong>A(' + ex.ax + ' ; ' + ex.ay + ')</strong> ';
        display += 'par la translation de vecteur ';
        display += '<strong>\u20D7u(' + ex.vx + ' ; ' + ex.vy + ')</strong>';
    } else {
        const angleLabel = ex.angle > 0 ? '+' + ex.angle : '' + ex.angle;
        display = 'Trouver l\'image du point <strong>A(' + ex.ax + ' ; ' + ex.ay + ')</strong> ';
        display += 'par la rotation de centre <strong>O(' + ex.ox + ' ; ' + ex.oy + ')</strong> ';
        display += 'et d\'angle <strong>' + angleLabel + '\u00B0</strong>';
    }

    $('exerciseDisplay').innerHTML = display;

    requestAnimationFrame(() => {
        drawTransRotCanvas('transCanvas', ex, type, false);
    });
}

// ========================================
// Dessin Canvas
// ========================================

function drawTransRotCanvas(canvasId, ex, type, showSol) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const W = canvas.width;
    const H = canvas.height;
    const gridMin = -6;
    const gridMax = 6;
    const range = gridMax - gridMin;
    const step = W / range;

    function toX(mx) { return (mx - gridMin) * step; }
    function toY(my) { return H - (my - gridMin) * step; }

    // Fond blanc
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, W, H);

    // Grille legere
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 0.5;
    for (let i = gridMin; i <= gridMax; i++) {
        ctx.beginPath();
        ctx.moveTo(toX(i), 0);
        ctx.lineTo(toX(i), H);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, toY(i));
        ctx.lineTo(W, toY(i));
        ctx.stroke();
    }

    // Axes principaux
    ctx.strokeStyle = '#666666';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, toY(0));
    ctx.lineTo(W, toY(0));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(toX(0), 0);
    ctx.lineTo(toX(0), H);
    ctx.stroke();

    // Graduations
    ctx.fillStyle = '#666666';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    for (let i = gridMin; i <= gridMax; i++) {
        if (i === 0) continue;
        ctx.beginPath();
        ctx.moveTo(toX(i), toY(0) - 3);
        ctx.lineTo(toX(i), toY(0) + 3);
        ctx.stroke();
        ctx.fillText(i, toX(i), toY(0) + 5);
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
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';
    ctx.fillText('0', toX(0) - 4, toY(0) + 4);

    // Point A (bleu)
    trDrawPoint(ctx, toX(ex.ax), toY(ex.ay), '#3182ce', 'A(' + ex.ax + ' ; ' + ex.ay + ')', 6);

    if (type === 'translation') {
        // Dessiner le vecteur depuis l'origine (pour montrer le vecteur)
        drawArrow(ctx, toX(0), toY(0), toX(ex.vx), toY(ex.vy), '#e53e3e', 2);
        ctx.fillStyle = '#e53e3e';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'bottom';
        ctx.fillText('\u20D7u(' + ex.vx + ' ; ' + ex.vy + ')', toX(ex.vx) + 8, toY(ex.vy) - 4);
    } else {
        // Centre O (rouge)
        trDrawPoint(ctx, toX(ex.ox), toY(ex.oy), '#e53e3e', 'O(' + ex.ox + ' ; ' + ex.oy + ')', 6);

        // Arc indiquant l'angle
        const radius = 30;
        const startAngle = Math.atan2(-(ex.ay - ex.oy), ex.ax - ex.ox);
        const endAngle = startAngle - ex.angle * Math.PI / 180;
        ctx.beginPath();
        ctx.arc(toX(ex.ox), toY(ex.oy), radius, startAngle, endAngle, ex.angle > 0);
        ctx.strokeStyle = '#805ad5';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Label de l'angle
        const midAngle = (startAngle + endAngle) / 2;
        ctx.fillStyle = '#805ad5';
        ctx.font = '11px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const angleLabel = ex.angle > 0 ? '+' + ex.angle + '\u00B0' : ex.angle + '\u00B0';
        ctx.fillText(angleLabel, toX(ex.ox) + (radius + 14) * Math.cos(midAngle), toY(ex.oy) + (radius + 14) * Math.sin(midAngle));
    }

    // Solution
    if (showSol) {
        if (type === 'translation') {
            // Fleche de A vers A'
            ctx.setLineDash([4, 3]);
            drawArrow(ctx, toX(ex.ax), toY(ex.ay), toX(ex.apx), toY(ex.apy), '#38a169', 1.5);
            ctx.setLineDash([]);
        } else {
            // Segment OA et OA' (pointille)
            ctx.strokeStyle = '#805ad5';
            ctx.lineWidth = 1;
            ctx.setLineDash([4, 3]);
            ctx.beginPath();
            ctx.moveTo(toX(ex.ox), toY(ex.oy));
            ctx.lineTo(toX(ex.ax), toY(ex.ay));
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(toX(ex.ox), toY(ex.oy));
            ctx.lineTo(toX(ex.apx), toY(ex.apy));
            ctx.stroke();
            ctx.setLineDash([]);
        }

        // Point A' (vert)
        trDrawPoint(ctx, toX(ex.apx), toY(ex.apy), '#38a169', "A'(" + ex.apx + ' ; ' + ex.apy + ')', 6);
    }
}

/**
 * Dessine un point avec bordure blanche et label
 */
function trDrawPoint(ctx, cx, cy, color, label, radius) {
    ctx.beginPath();
    ctx.arc(cx, cy, radius + 2, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.fillStyle = color;
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'bottom';
    ctx.fillText(label, cx + radius + 4, cy - 4);
}

/**
 * Dessine une fleche de (x1,y1) a (x2,y2)
 */
function drawArrow(ctx, x1, y1, x2, y2, color, lineWidth) {
    const headLen = 10;
    const angle = Math.atan2(y2 - y1, x2 - x1);

    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = lineWidth;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // Pointe de la fleche
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - headLen * Math.cos(angle - Math.PI / 6), y2 - headLen * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(x2 - headLen * Math.cos(angle + Math.PI / 6), y2 - headLen * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fill();
}

// ========================================
// Resolution
// ========================================

function solveTransRot() {
    const type = TransRotState.currentType;
    let html = '';

    if (type === 'translation') {
        html = solveTranslation();
    } else {
        html = solveRotation();
    }

    // Canvas de solution
    html += '<div style="text-align:center; margin-top: 16px;">';
    html += '<canvas id="transCanvasSol" width="400" height="400" style="border:1px solid #e2e8f0; border-radius:8px; max-width:100%;"></canvas>';
    html += '</div>';

    $('solutionDiv').innerHTML = html;
    showSolution('solutionDiv');

    const ex = TransRotState.exercise;
    requestAnimationFrame(() => {
        drawTransRotCanvas('transCanvasSol', ex, type, true);
    });
}

function solveTranslation() {
    const ex = TransRotState.exercise;
    let html = '<h3>Solution</h3>';

    // Etape 1 : Methode
    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : M\u00e9thode</div>';
    html += '<div class="step-explanation">';
    html += 'L\'image d\'un point A par la translation de vecteur \u20D7u est le point A\' tel que :<br>';
    html += 'x<sub>A\'</sub> = x<sub>A</sub> + x<sub>\u20D7u</sub> et y<sub>A\'</sub> = y<sub>A</sub> + y<sub>\u20D7u</sub>';
    html += '</div>';
    html += '</div>';

    // Etape 2 : Calcul abscisse
    html += '<div class="step">';
    html += '<div class="step-number">Etape 2 : Calcul de l\'abscisse</div>';
    html += '<div class="step-expression">';
    html += 'x<sub>A\'</sub> = x<sub>A</sub> + x<sub>\u20D7u</sub> = ' + ex.ax + ' + (' + ex.vx + ') = ' + ex.apx;
    html += '</div>';
    html += '</div>';

    // Etape 3 : Calcul ordonnee
    html += '<div class="step">';
    html += '<div class="step-number">Etape 3 : Calcul de l\'ordonn\u00e9e</div>';
    html += '<div class="step-expression">';
    html += 'y<sub>A\'</sub> = y<sub>A</sub> + y<sub>\u20D7u</sub> = ' + ex.ay + ' + (' + ex.vy + ') = ' + ex.apy;
    html += '</div>';
    html += '</div>';

    // Etape 4 : Verification
    html += '<div class="step">';
    html += '<div class="step-number">Etape 4 : V\u00e9rification</div>';
    html += '<div class="step-expression">';
    html += 'Vecteur \u20D7(AA\') = (' + ex.apx + ' \u2212 ' + ex.ax + ' ; ' + ex.apy + ' \u2212 ' + ex.ay + ') = (' + ex.vx + ' ; ' + ex.vy + ') = \u20D7u';
    html += '</div>';
    html += '<div class="step-explanation">';
    html += 'Le vecteur \u20D7(AA\') est bien \u00e9gal au vecteur de translation \u20D7u.';
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

function solveRotation() {
    const ex = TransRotState.exercise;
    const angleLabel = ex.angle > 0 ? '+' + ex.angle : '' + ex.angle;
    let html = '<h3>Solution</h3>';

    // Etape 1 : Methode
    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : M\u00e9thode</div>';
    html += '<div class="step-explanation">';
    html += 'L\'image d\'un point A par la rotation de centre O et d\'angle \u03B8 se calcule :<br>';
    html += '1. On translate pour ramener le centre en O (calcul de \u20D7(OA))<br>';
    html += '2. On applique la rotation<br>';
    html += '3. On retranslate';
    html += '</div>';
    html += '</div>';

    // Etape 2 : Vecteur OA
    const dx = ex.ax - ex.ox;
    const dy = ex.ay - ex.oy;
    html += '<div class="step">';
    html += '<div class="step-number">Etape 2 : Vecteur \u20D7(OA)</div>';
    html += '<div class="step-expression">';
    html += '\u20D7(OA) = (' + ex.ax + ' \u2212 ' + ex.ox + ' ; ' + ex.ay + ' \u2212 ' + ex.oy + ') = (' + dx + ' ; ' + dy + ')';
    html += '</div>';
    html += '</div>';

    // Etape 3 : Appliquer la rotation
    html += '<div class="step">';
    html += '<div class="step-number">Etape 3 : Appliquer la rotation de ' + angleLabel + '\u00B0</div>';
    html += '<div class="step-expression">';

    if (ex.angle === 90) {
        html += 'Rotation de +90\u00B0 : (x ; y) \u2192 (\u2212y ; x)<br>';
        html += '(' + dx + ' ; ' + dy + ') \u2192 (' + (-dy) + ' ; ' + dx + ')';
    } else if (ex.angle === -90) {
        html += 'Rotation de \u221290\u00B0 : (x ; y) \u2192 (y ; \u2212x)<br>';
        html += '(' + dx + ' ; ' + dy + ') \u2192 (' + dy + ' ; ' + (-dx) + ')';
    } else {
        // 180 degrees
        html += 'Rotation de 180\u00B0 : (x ; y) \u2192 (\u2212x ; \u2212y)<br>';
        html += '(' + dx + ' ; ' + dy + ') \u2192 (' + (-dx) + ' ; ' + (-dy) + ')';
    }

    html += '</div>';
    html += '<div class="step-explanation">';
    if (ex.angle === 90) {
        html += 'Pour une rotation de +90\u00B0 (sens anti-horaire), on applique : x\' = \u2212y et y\' = x.';
    } else if (ex.angle === -90) {
        html += 'Pour une rotation de \u221290\u00B0 (sens horaire), on applique : x\' = y et y\' = \u2212x.';
    } else {
        html += 'Pour une rotation de 180\u00B0, on applique : x\' = \u2212x et y\' = \u2212y (sym\u00e9trie centrale).';
    }
    html += '</div>';
    html += '</div>';

    // Etape 4 : Retranslater
    html += '<div class="step">';
    html += '<div class="step-number">Etape 4 : Ajouter les coordonn\u00e9es du centre</div>';
    html += '<div class="step-expression">';
    html += 'x<sub>A\'</sub> = x<sub>O</sub> + x\' = ' + ex.ox + ' + ';

    let xRot, yRot;
    if (ex.angle === 90) {
        xRot = -dy;
        yRot = dx;
    } else if (ex.angle === -90) {
        xRot = dy;
        yRot = -dx;
    } else {
        xRot = -dx;
        yRot = -dy;
    }

    html += '(' + xRot + ') = ' + ex.apx + '<br>';
    html += 'y<sub>A\'</sub> = y<sub>O</sub> + y\' = ' + ex.oy + ' + (' + yRot + ') = ' + ex.apy;
    html += '</div>';
    html += '</div>';

    // Etape 5 : Verification
    const distOA = Math.sqrt(dx * dx + dy * dy);
    const dxp = ex.apx - ex.ox;
    const dyp = ex.apy - ex.oy;
    const distOAp = Math.sqrt(dxp * dxp + dyp * dyp);
    html += '<div class="step">';
    html += '<div class="step-number">Etape 5 : V\u00e9rification</div>';
    html += '<div class="step-expression">';
    html += 'OA = \u221A(' + dx + '\u00B2 + ' + dy + '\u00B2) = \u221A' + (dx * dx + dy * dy) + '<br>';
    html += 'OA\' = \u221A(' + dxp + '\u00B2 + ' + dyp + '\u00B2) = \u221A' + (dxp * dxp + dyp * dyp) + '<br>';
    html += 'OA = OA\' (les distances sont conserv\u00e9es)';
    html += '</div>';
    html += '<div class="step-explanation">';
    html += 'Une rotation conserve les distances : OA = OA\'.';
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

document.addEventListener('DOMContentLoaded', initTransRotPage);
