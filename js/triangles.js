/* ========================================
   TRIANGLES.JS - Triangles et Parallelogrammes (5eme)
   ======================================== */

/**
 * Etat du module
 */
const TrianglesState = {
    currentType: 'somme-angles',
    exercise: {}
};

// ========================================
// Utilitaires locaux
// ========================================

function triRandInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function triPick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// ========================================
// Initialisation
// ========================================

function initTrianglesPage() {
    setupTypeButtons();
    setupActionButtons();
    generateTri();
    updateTriDisplay();
}

function setupTypeButtons() {
    const typeButtons = document.querySelectorAll('.type-btn');
    typeButtons.forEach(button => {
        button.addEventListener('click', () => {
            typeButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            TrianglesState.currentType = button.dataset.type;
            generateTri();
            updateTriDisplay();
            hideSolution('solutionDiv');
        });
    });
}

function setupActionButtons() {
    $('generateBtn').addEventListener('click', () => {
        generateTri();
        updateTriDisplay();
        hideSolution('solutionDiv');
    });

    $('solveBtn').addEventListener('click', () => {
        solveTri();
    });
}

// ========================================
// Generation des exercices
// ========================================

function generateTri() {
    const st = TrianglesState;

    switch (st.currentType) {
        case 'somme-angles':
            generateSommeAngles();
            break;
        case 'inegalite':
            generateInegalite();
            break;
        case 'parallelogramme':
            generateParallelogramme();
            break;
    }
}

function generateSommeAngles() {
    const st = TrianglesState;
    const sommets = triPick([
        ['A', 'B', 'C'], ['D', 'E', 'F'], ['M', 'N', 'P'],
        ['R', 'S', 'T'], ['I', 'J', 'K']
    ]);
    // Choisir quel angle est inconnu (0, 1 ou 2)
    const unknown = triRandInt(0, 2);
    // Generer trois angles dont la somme vaut 180
    const a1 = triRandInt(20, 100);
    const a2 = triRandInt(20, Math.min(100, 179 - a1 - 20));
    const a3 = 180 - a1 - a2;

    const angles = [a1, a2, a3];

    st.exercise = {
        sommets: sommets,
        angles: angles,
        unknown: unknown
    };
}

function generateInegalite() {
    const st = TrianglesState;
    const valid = Math.random() < 0.5;

    let a, b, c;
    if (valid) {
        // Generer un triangle valide : chaque cote < somme des deux autres
        a = triRandInt(3, 12);
        b = triRandInt(3, 12);
        // c doit etre strictement inferieur a a+b et superieur a |a-b|
        const cMin = Math.abs(a - b) + 1;
        const cMax = a + b - 1;
        c = triRandInt(Math.max(2, cMin), Math.min(15, cMax));
    } else {
        // Generer un cas invalide
        a = triRandInt(2, 6);
        b = triRandInt(2, 6);
        // c >= a + b
        c = a + b + triRandInt(0, 3);
    }

    st.exercise = {
        sides: [a, b, c],
        valid: (a + b > c) && (a + c > b) && (b + c > a)
    };
}

function generateParallelogramme() {
    const st = TrianglesState;
    const sommets = triPick([
        ['A', 'B', 'C', 'D'], ['E', 'F', 'G', 'H'],
        ['M', 'N', 'P', 'Q'], ['R', 'S', 'T', 'U']
    ]);
    const side1 = triRandInt(3, 12);
    const side2 = triRandInt(3, 12);
    const angle = triRandInt(30, 150);

    st.exercise = {
        sommets: sommets,
        side1: side1,
        side2: side2,
        angle: angle
    };
}

// ========================================
// Affichage de l'exercice
// ========================================

function updateTriDisplay() {
    const st = TrianglesState;
    let display = '';

    switch (st.currentType) {
        case 'somme-angles': {
            const ex = st.exercise;
            const S = ex.sommets;
            display = 'Dans le triangle ' + S[0] + S[1] + S[2] + ', on donne :<br>';
            for (let i = 0; i < 3; i++) {
                if (i === ex.unknown) continue;
                display += 'Angle ' + S[i] + ' = ' + ex.angles[i] + '°';
                display += '<br>';
            }
            display += '<strong>Calculer l\'angle ' + S[ex.unknown] + '.</strong>';
            break;
        }
        case 'inegalite': {
            const ex = st.exercise;
            display = 'On donne trois longueurs : ';
            display += 'a = ' + ex.sides[0] + ' cm, ';
            display += 'b = ' + ex.sides[1] + ' cm, ';
            display += 'c = ' + ex.sides[2] + ' cm.<br>';
            display += '<strong>Ces longueurs peuvent-elles former un triangle ?</strong>';
            break;
        }
        case 'parallelogramme': {
            const ex = st.exercise;
            const S = ex.sommets;
            display = S[0] + S[1] + S[2] + S[3] + ' est un parallelogramme.<br>';
            display += S[0] + S[1] + ' = ' + ex.side1 + ' cm, ';
            display += S[1] + S[2] + ' = ' + ex.side2 + ' cm.<br>';
            display += 'L\'angle en ' + S[0] + ' mesure ' + ex.angle + '°.<br>';
            display += '<strong>Determiner les autres cotes et angles.</strong>';
            break;
        }
    }

    $('exerciseDisplay').innerHTML = display;
    drawTriCanvas();
}

// ========================================
// Dessin Canvas
// ========================================

function drawTriCanvas() {
    const canvas = $('triCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    // Fond blanc
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);

    switch (TrianglesState.currentType) {
        case 'somme-angles':
            drawSommeAngles(ctx, w, h);
            break;
        case 'inegalite':
            drawInegalite(ctx, w, h);
            break;
        case 'parallelogramme':
            drawParallelogramme(ctx, w, h);
            break;
    }
}

function drawSommeAngles(ctx, w, h) {
    const ex = TrianglesState.exercise;
    const S = ex.sommets;
    const angles = ex.angles;
    const pad = 50;

    // Convertir les angles du triangle en coordonnees
    // Placer le sommet A en bas a gauche, B en bas a droite
    // L'angle en A = angles[0], l'angle en B = angles[1]
    const angleA = angles[0] * Math.PI / 180;
    const angleB = angles[1] * Math.PI / 180;

    // Longueur du cote AB (base)
    const baseLen = w - 2 * pad;

    // Coordonnees
    const ax = pad;
    const ay = h - pad;
    const bx = w - pad;
    const by = h - pad;

    // Sommet C par intersection des droites depuis A et B
    // Depuis A : direction angle angleA au-dessus de l'horizontale
    // Depuis B : direction (pi - angleB) au-dessus de l'horizontale
    const cx = ax + baseLen * Math.sin(angleB) / Math.sin(angles[2] * Math.PI / 180) * Math.cos(angleA);
    const cy = ay - baseLen * Math.sin(angleB) / Math.sin(angles[2] * Math.PI / 180) * Math.sin(angleA);

    // Ajuster l'echelle si le triangle depasse
    let scale = 1;
    if (cy < pad) {
        scale = (ay - pad) / (ay - cy);
    }
    const cxs = ax + (cx - ax) * scale;
    const cys = ay + (cy - ay) * scale;
    const bxs = ax + (bx - ax) * scale;
    const bys = ay;

    // Dessiner le triangle
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(bxs, bys);
    ctx.lineTo(cxs, cys);
    ctx.closePath();
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = 'rgba(102, 126, 234, 0.08)';
    ctx.fill();

    // Dessiner les arcs d'angles
    var pts = [
        { x: ax, y: ay },
        { x: bxs, y: bys },
        { x: cxs, y: cys }
    ];

    for (let i = 0; i < 3; i++) {
        var p = pts[i];
        var prev = pts[(i + 2) % 3];
        var next = pts[(i + 1) % 3];

        var a1 = Math.atan2(prev.y - p.y, prev.x - p.x);
        var a2 = Math.atan2(next.y - p.y, next.x - p.x);

        // Assurer que l'arc va dans le bon sens (angle interieur)
        if (a2 < a1) a2 += 2 * Math.PI;
        if (a2 - a1 > Math.PI) {
            var tmp = a1;
            a1 = a2;
            a2 = tmp + 2 * Math.PI;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, 20, a1, a2);
        ctx.strokeStyle = i === ex.unknown ? '#e53e3e' : '#3182ce';
        ctx.lineWidth = 1.5;
        ctx.stroke();
    }

    // Labels des sommets
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#333333';
    ctx.fillText(S[0], ax - 16, ay + 18);
    ctx.fillText(S[1], bxs + 16, bys + 18);
    ctx.fillText(S[2], cxs, cys - 12);

    // Labels des angles
    ctx.font = '13px sans-serif';
    for (let i = 0; i < 3; i++) {
        var p = pts[i];
        var prev = pts[(i + 2) % 3];
        var next = pts[(i + 1) % 3];

        var a1 = Math.atan2(prev.y - p.y, prev.x - p.x);
        var a2 = Math.atan2(next.y - p.y, next.x - p.x);
        if (a2 < a1) a2 += 2 * Math.PI;
        if (a2 - a1 > Math.PI) {
            var tmp = a1;
            a1 = a2;
            a2 = tmp + 2 * Math.PI;
        }
        var mid = (a1 + a2) / 2;
        var lx = p.x + 34 * Math.cos(mid);
        var ly = p.y + 34 * Math.sin(mid);

        if (i === ex.unknown) {
            ctx.fillStyle = '#e53e3e';
            ctx.fillText('?', lx, ly + 4);
        } else {
            ctx.fillStyle = '#3182ce';
            ctx.fillText(angles[i] + '\u00B0', lx, ly + 4);
        }
    }
}

function drawInegalite(ctx, w, h) {
    const ex = TrianglesState.exercise;
    const sides = ex.sides;
    const pad = 40;
    const segY = [80, 150, 220];
    const maxLen = Math.max(sides[0], sides[1], sides[2]);
    const scale = (w - 2 * pad - 60) / maxLen;
    const labels = ['a', 'b', 'c'];

    ctx.lineWidth = 3;
    ctx.lineCap = 'round';

    for (let i = 0; i < 3; i++) {
        var x1 = pad + 30;
        var x2 = x1 + sides[i] * scale;
        var y = segY[i];

        // Segment
        ctx.beginPath();
        ctx.moveTo(x1, y);
        ctx.lineTo(x2, y);
        ctx.strokeStyle = '#3182ce';
        ctx.stroke();

        // Petits traits aux extremites
        ctx.beginPath();
        ctx.moveTo(x1, y - 8);
        ctx.lineTo(x1, y + 8);
        ctx.moveTo(x2, y - 8);
        ctx.lineTo(x2, y + 8);
        ctx.strokeStyle = '#333333';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.lineWidth = 3;

        // Label
        ctx.font = 'bold 14px sans-serif';
        ctx.fillStyle = '#3182ce';
        ctx.textAlign = 'center';
        ctx.fillText(labels[i] + ' = ' + sides[i] + ' cm', (x1 + x2) / 2, y - 14);
    }
}

function drawParallelogramme(ctx, w, h) {
    const ex = TrianglesState.exercise;
    const S = ex.sommets;
    const pad = 50;

    // Construire le parallelogramme
    // A en bas a gauche, B en bas a droite, C en haut a droite, D en haut a gauche
    var maxSide = Math.max(ex.side1, ex.side2);
    var scale = (w - 2 * pad - 40) / (maxSide + ex.side2 * 0.5);

    var angleRad = ex.angle * Math.PI / 180;
    var abLen = ex.side1 * scale;
    var adLen = ex.side2 * scale;

    // Decalage horizontal du cote oblique
    var dx = adLen * Math.cos(angleRad);
    var dy = adLen * Math.sin(angleRad);

    // Position de A (bas gauche, avec marge)
    var ax = pad + Math.max(0, -dx);
    var ay = h - pad;

    var bx = ax + abLen;
    var by = ay;
    var dxp = ax + dx;
    var dyp = ay - dy;
    var cxp = bx + dx;
    var cyp = by - dy;

    // Ajuster si depasse
    var allX = [ax, bx, dxp, cxp];
    var allY = [ay, by, dyp, cyp];
    var minX = Math.min.apply(null, allX);
    var maxX = Math.max.apply(null, allX);
    var minY = Math.min.apply(null, allY);
    var maxY = Math.max.apply(null, allY);

    var scaleX = (w - 2 * pad) / (maxX - minX);
    var scaleY = (h - 2 * pad) / (maxY - minY);
    var sc = Math.min(scaleX, scaleY, 1);

    if (sc < 1) {
        var cx0 = (minX + maxX) / 2;
        var cy0 = (minY + maxY) / 2;
        ax = w / 2 + (ax - cx0) * sc;
        ay = h / 2 + (ay - cy0) * sc;
        bx = w / 2 + (bx - cx0) * sc;
        by = h / 2 + (by - cy0) * sc;
        dxp = w / 2 + (dxp - cx0) * sc;
        dyp = h / 2 + (dyp - cy0) * sc;
        cxp = w / 2 + (cxp - cx0) * sc;
        cyp = h / 2 + (cyp - cy0) * sc;
    }

    // Dessiner le parallelogramme
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx, by);
    ctx.lineTo(cxp, cyp);
    ctx.lineTo(dxp, dyp);
    ctx.closePath();
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = 'rgba(102, 126, 234, 0.08)';
    ctx.fill();

    // Labels des sommets
    ctx.font = 'bold 14px sans-serif';
    ctx.fillStyle = '#333333';
    ctx.textAlign = 'center';
    ctx.fillText(S[0], ax - 14, ay + 18);
    ctx.fillText(S[1], bx + 14, by + 18);
    ctx.fillText(S[2], cxp + 14, cyp - 8);
    ctx.fillText(S[3], dxp - 14, dyp - 8);

    // Cote AB (connu, bleu)
    ctx.font = '13px sans-serif';
    ctx.fillStyle = '#3182ce';
    ctx.fillText(ex.side1 + ' cm', (ax + bx) / 2, (ay + by) / 2 + 18);

    // Cote BC (connu, bleu)
    ctx.fillText(ex.side2 + ' cm', (bx + cxp) / 2 + 14, (by + cyp) / 2);

    // Cote CD (inconnu, rouge)
    ctx.fillStyle = '#e53e3e';
    ctx.fillText('?', (cxp + dxp) / 2, (cyp + dyp) / 2 - 10);

    // Cote DA (inconnu, rouge)
    ctx.fillText('?', (dxp + ax) / 2 - 14, (dyp + ay) / 2);

    // Arc angle en A (connu)
    var a1 = Math.atan2(by - ay, bx - ax);
    var a2 = Math.atan2(dyp - ay, dxp - ax);
    if (a2 > a1) { var tmp = a1; a1 = a2; a2 = tmp; }
    ctx.beginPath();
    ctx.arc(ax, ay, 22, a2, a1);
    ctx.strokeStyle = '#3182ce';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#3182ce';
    var aMid = (a1 + a2) / 2;
    ctx.fillText(ex.angle + '\u00B0', ax + 36 * Math.cos(aMid), ay + 36 * Math.sin(aMid) + 4);

    // Arc angle en B (inconnu)
    var suppAngle = 180 - ex.angle;
    var ba1 = Math.atan2(ay - by, ax - bx);
    var ba2 = Math.atan2(cyp - by, cxp - bx);
    if (ba2 < ba1) ba2 += 2 * Math.PI;
    if (ba2 - ba1 > Math.PI) { var tmp2 = ba1; ba1 = ba2; ba2 = tmp2 + 2 * Math.PI; }
    ctx.beginPath();
    ctx.arc(bx, by, 22, ba1, ba2);
    ctx.strokeStyle = '#e53e3e';
    ctx.stroke();

    ctx.fillStyle = '#e53e3e';
    var bMid = (ba1 + ba2) / 2;
    ctx.fillText('?', bx + 34 * Math.cos(bMid), by + 34 * Math.sin(bMid) + 4);
}

// ========================================
// Resolution
// ========================================

function solveTri() {
    let html = '<h3>Solution</h3>';

    switch (TrianglesState.currentType) {
        case 'somme-angles':
            html += solveSommeAngles();
            break;
        case 'inegalite':
            html += solveInegalite();
            break;
        case 'parallelogramme':
            html += solveParallelogramme();
            break;
    }

    $('solutionDiv').innerHTML = html;
    showSolution('solutionDiv');
}

function solveSommeAngles() {
    const ex = TrianglesState.exercise;
    const S = ex.sommets;
    const angles = ex.angles;
    const unk = ex.unknown;
    let html = '';

    // Les deux angles connus
    const known = [];
    for (let i = 0; i < 3; i++) {
        if (i !== unk) known.push({ name: S[i], value: angles[i] });
    }

    // Etape 1 : Propriete
    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : Propriete de la somme des angles</div>';
    html += '<div class="step-expression">';
    html += 'Dans un triangle, la somme des angles est egale a 180\u00B0.';
    html += '</div>';
    html += '<div class="step-explanation">';
    html += 'Angle ' + S[0] + ' + Angle ' + S[1] + ' + Angle ' + S[2] + ' = 180\u00B0';
    html += '</div>';
    html += '</div>';

    // Etape 2 : Remplacer
    html += '<div class="step">';
    html += '<div class="step-number">Etape 2 : Remplacer les valeurs connues</div>';
    html += '<div class="step-expression">';
    html += known[0].value + '\u00B0 + ' + known[1].value + '\u00B0 + Angle ' + S[unk] + ' = 180\u00B0';
    html += '</div>';
    html += '<div class="step-explanation">';
    var sumKnown = known[0].value + known[1].value;
    html += 'La somme des deux angles connus vaut ' + known[0].value + ' + ' + known[1].value + ' = ' + sumKnown + '\u00B0.';
    html += '</div>';
    html += '</div>';

    // Etape 3 : Calculer
    html += '<div class="step">';
    html += '<div class="step-number">Etape 3 : Calculer l\'angle inconnu</div>';
    html += '<div class="step-expression">';
    html += 'Angle ' + S[unk] + ' = 180\u00B0 \u2212 ' + sumKnown + '\u00B0';
    html += '</div>';
    html += '<div class="step-explanation">';
    html += 'Angle ' + S[unk] + ' = 180 \u2212 ' + sumKnown + ' = ' + angles[unk];
    html += '</div>';
    html += '</div>';

    // Resultat
    html += '<div class="result-highlight">';
    html += '<div class="final">Angle ' + S[unk] + ' = ' + angles[unk] + '\u00B0</div>';
    html += '</div>';

    return html;
}

function solveInegalite() {
    const ex = TrianglesState.exercise;
    const sides = ex.sides;
    const a = sides[0], b = sides[1], c = sides[2];
    let html = '';

    // Etape 1 : Rappel
    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : Inegalite triangulaire</div>';
    html += '<div class="step-expression">';
    html += 'Pour former un triangle, la longueur de chaque cote doit etre strictement inferieure a la somme des deux autres.';
    html += '</div>';
    html += '<div class="step-explanation">';
    html += 'Il faut verifier les trois inegalites.';
    html += '</div>';
    html += '</div>';

    // Etape 2 : Verifier a + b > c
    var check1 = a + b > c;
    html += '<div class="step">';
    html += '<div class="step-number">Etape 2 : Verifier a + b > c</div>';
    html += '<div class="step-expression">';
    html += a + ' + ' + b + ' = ' + (a + b);
    html += (check1 ? ' > ' : ' \u2264 ') + c;
    html += '</div>';
    html += '<div class="step-explanation">';
    html += check1 ? 'Vrai' : 'Faux';
    html += '</div>';
    html += '</div>';

    // Etape 3 : Verifier a + c > b
    var check2 = a + c > b;
    html += '<div class="step">';
    html += '<div class="step-number">Etape 3 : Verifier a + c > b</div>';
    html += '<div class="step-expression">';
    html += a + ' + ' + c + ' = ' + (a + c);
    html += (check2 ? ' > ' : ' \u2264 ') + b;
    html += '</div>';
    html += '<div class="step-explanation">';
    html += check2 ? 'Vrai' : 'Faux';
    html += '</div>';
    html += '</div>';

    // Etape 4 : Verifier b + c > a
    var check3 = b + c > a;
    html += '<div class="step">';
    html += '<div class="step-number">Etape 4 : Verifier b + c > a</div>';
    html += '<div class="step-expression">';
    html += b + ' + ' + c + ' = ' + (b + c);
    html += (check3 ? ' > ' : ' \u2264 ') + a;
    html += '</div>';
    html += '<div class="step-explanation">';
    html += check3 ? 'Vrai' : 'Faux';
    html += '</div>';
    html += '</div>';

    // Resultat
    var allValid = check1 && check2 && check3;
    html += '<div class="result-highlight">';
    if (allValid) {
        html += '<div class="final">Les trois inegalites sont verifiees : ces longueurs <strong>peuvent</strong> former un triangle.</div>';
    } else {
        html += '<div class="final">Au moins une inegalite n\'est pas verifiee : ces longueurs <strong>ne peuvent pas</strong> former un triangle.</div>';
    }
    html += '</div>';

    return html;
}

function solveParallelogramme() {
    const ex = TrianglesState.exercise;
    const S = ex.sommets;
    const s1 = ex.side1;
    const s2 = ex.side2;
    const angle = ex.angle;
    const suppAngle = 180 - angle;
    let html = '';

    // Etape 1 : Cotes opposes
    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : Cotes opposes egaux</div>';
    html += '<div class="step-expression">';
    html += 'Dans un parallelogramme, les cotes opposes sont de meme longueur.';
    html += '</div>';
    html += '<div class="step-explanation">';
    html += S[0] + S[1] + ' = ' + S[2] + S[3] + ' = ' + s1 + ' cm<br>';
    html += S[1] + S[2] + ' = ' + S[3] + S[0] + ' = ' + s2 + ' cm';
    html += '</div>';
    html += '</div>';

    // Etape 2 : Angles opposes
    html += '<div class="step">';
    html += '<div class="step-number">Etape 2 : Angles opposes egaux</div>';
    html += '<div class="step-expression">';
    html += 'Dans un parallelogramme, les angles opposes sont egaux.';
    html += '</div>';
    html += '<div class="step-explanation">';
    html += 'Angle ' + S[0] + ' = Angle ' + S[2] + ' = ' + angle + '\u00B0';
    html += '</div>';
    html += '</div>';

    // Etape 3 : Angles consecutifs
    html += '<div class="step">';
    html += '<div class="step-number">Etape 3 : Angles consecutifs supplementaires</div>';
    html += '<div class="step-expression">';
    html += 'Deux angles consecutifs d\'un parallelogramme sont supplementaires (somme = 180\u00B0).';
    html += '</div>';
    html += '<div class="step-explanation">';
    html += 'Angle ' + S[1] + ' = 180\u00B0 \u2212 ' + angle + '\u00B0 = ' + suppAngle + '\u00B0<br>';
    html += 'Angle ' + S[3] + ' = 180\u00B0 \u2212 ' + angle + '\u00B0 = ' + suppAngle + '\u00B0';
    html += '</div>';
    html += '</div>';

    // Resultat
    html += '<div class="result-highlight">';
    html += '<div class="final">';
    html += S[0] + S[1] + ' = ' + S[2] + S[3] + ' = ' + s1 + ' cm<br>';
    html += S[1] + S[2] + ' = ' + S[3] + S[0] + ' = ' + s2 + ' cm<br>';
    html += 'Angle ' + S[0] + ' = Angle ' + S[2] + ' = ' + angle + '\u00B0<br>';
    html += 'Angle ' + S[1] + ' = Angle ' + S[3] + ' = ' + suppAngle + '\u00B0';
    html += '</div>';
    html += '</div>';

    return html;
}

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', () => {
    initTrianglesPage();
});
