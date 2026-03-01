/* ========================================
   ANGLES.JS - Angles (6eme-5eme)
   ======================================== */

/**
 * Etat du module Angles
 */
const AnglesState = {
    currentType: 'complementaires',
    givenAngle: 45,
    answer: 45,
    // Pour le type alternes
    alterneSubtype: 'alternes', // 'alternes' ou 'co-interieures'
    transversalAngle: 60,
    exercise: {}
};

// ========================================
// Utilitaires locaux
// ========================================

function angRandInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function angPick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function angDegToRad(deg) {
    return deg * Math.PI / 180;
}

// ========================================
// Initialisation
// ========================================

function initAnglesPage() {
    setupAngTypeButtons();
    setupAngActionButtons();
    generateAng();
    updateAngDisplay();
}

function setupAngTypeButtons() {
    const typeButtons = document.querySelectorAll('.type-btn');
    typeButtons.forEach(button => {
        button.addEventListener('click', () => {
            typeButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            AnglesState.currentType = button.dataset.type;
            generateAng();
            updateAngDisplay();
            hideSolution('solutionDiv');
        });
    });
}

function setupAngActionButtons() {
    $('generateBtn').addEventListener('click', () => {
        generateAng();
        updateAngDisplay();
        hideSolution('solutionDiv');
    });

    $('solveBtn').addEventListener('click', () => {
        solveAng();
    });
}

// ========================================
// Generation d'exercices
// ========================================

function generateAng() {
    const type = AnglesState.currentType;

    switch (type) {
        case 'complementaires':
            generateComplementaires();
            break;
        case 'supplementaires':
            generateSupplementaires();
            break;
        case 'types':
            generateTypes();
            break;
        case 'alternes':
            generateAlternes();
            break;
    }
}

function generateComplementaires() {
    const angle = angRandInt(10, 80);
    AnglesState.givenAngle = angle;
    AnglesState.answer = 90 - angle;
}

function generateSupplementaires() {
    const angle = angRandInt(10, 170);
    AnglesState.givenAngle = angle;
    AnglesState.answer = 180 - angle;
}

function generateTypes() {
    // Generer un angle aleatoire, avec une chance d'obtenir 90 ou 180
    const special = angRandInt(1, 10);
    let angle;
    if (special === 1) {
        angle = 90;
    } else if (special === 2) {
        angle = 180;
    } else {
        angle = angRandInt(1, 179);
    }
    AnglesState.givenAngle = angle;

    if (angle < 90) {
        AnglesState.answer = 'aigu';
    } else if (angle === 90) {
        AnglesState.answer = 'droit';
    } else if (angle < 180) {
        AnglesState.answer = 'obtus';
    } else {
        AnglesState.answer = 'plat';
    }
}

function generateAlternes() {
    const angle = angRandInt(20, 160);
    AnglesState.transversalAngle = angle;
    const subtype = angPick(['alternes', 'co-interieures']);
    AnglesState.alterneSubtype = subtype;

    if (subtype === 'alternes') {
        AnglesState.answer = angle;
    } else {
        AnglesState.answer = 180 - angle;
    }
}

// ========================================
// Affichage
// ========================================

function updateAngDisplay() {
    const type = AnglesState.currentType;
    let display = '';

    switch (type) {
        case 'complementaires':
            display = 'Deux angles sont <strong>complementaires</strong> (leur somme vaut 90\u00B0).<br>';
            display += 'L\'un mesure <strong>' + AnglesState.givenAngle + '\u00B0</strong>. Quelle est la mesure de l\'autre ?';
            break;
        case 'supplementaires':
            display = 'Deux angles sont <strong>supplementaires</strong> (leur somme vaut 180\u00B0).<br>';
            display += 'L\'un mesure <strong>' + AnglesState.givenAngle + '\u00B0</strong>. Quelle est la mesure de l\'autre ?';
            break;
        case 'types':
            display = 'Un angle mesure <strong>' + AnglesState.givenAngle + '\u00B0</strong>.<br>';
            display += 'Quelle est sa nature (aigu, droit, obtus ou plat) ?';
            break;
        case 'alternes': {
            const sub = AnglesState.alterneSubtype;
            const label = sub === 'alternes' ? 'alternes-internes' : 'co-interieures';
            display = 'Deux droites paralleles sont coupees par une secante.<br>';
            display += 'L\'angle marque en <span style="color:#e53e3e;font-weight:600">rouge</span> mesure <strong>' + AnglesState.transversalAngle + '\u00B0</strong>.<br>';
            display += 'Trouver l\'angle marque en <span style="color:#3182ce;font-weight:600">bleu</span> (angles <strong>' + label + '</strong>).';
            break;
        }
    }

    $('exerciseDisplay').innerHTML = display;
    drawAngCanvas();
}

// ========================================
// Dessin Canvas
// ========================================

function drawAngCanvas() {
    const canvas = $('angleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    // Fond blanc
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);

    const type = AnglesState.currentType;

    switch (type) {
        case 'complementaires':
            drawAngleSimple(ctx, w, h, AnglesState.givenAngle, 90);
            break;
        case 'supplementaires':
            drawAngleSimple(ctx, w, h, AnglesState.givenAngle, 180);
            break;
        case 'types':
            drawAngleSimple(ctx, w, h, AnglesState.givenAngle, null);
            break;
        case 'alternes':
            drawParallelLines(ctx, w, h);
            break;
    }
}

/**
 * Dessine un angle simple avec deux demi-droites, un arc et un label.
 * totalAngle sert a dessiner une ligne de reference supplementaire (90 ou 180).
 */
function drawAngleSimple(ctx, w, h, angleDeg, totalAngle) {
    const cx = 80;
    const cy = h - 60;
    const rayLen = 160;
    const arcRadius = 50;

    // Demi-droite horizontale (reference)
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + rayLen, cy);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Demi-droite formant l'angle donne
    const rad = angDegToRad(angleDeg);
    const endX = cx + rayLen * Math.cos(-rad);
    const endY = cy + rayLen * Math.sin(-rad);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = '#e53e3e';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Si totalAngle fourni, dessiner la limite (90 ou 180) en pointilles
    if (totalAngle !== null) {
        const radTotal = angDegToRad(totalAngle);
        const refX = cx + rayLen * Math.cos(-radTotal);
        const refY = cy + rayLen * Math.sin(-radTotal);
        ctx.beginPath();
        ctx.setLineDash([5, 5]);
        ctx.moveTo(cx, cy);
        ctx.lineTo(refX, refY);
        ctx.strokeStyle = '#aaa';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.setLineDash([]);

        // Marquer l'angle droit si totalAngle = 90
        if (totalAngle === 90) {
            const sq = 12;
            ctx.beginPath();
            ctx.moveTo(cx + sq, cy);
            ctx.lineTo(cx + sq, cy - sq);
            ctx.lineTo(cx, cy - sq);
            ctx.strokeStyle = '#aaa';
            ctx.lineWidth = 1;
            ctx.stroke();
        }
    }

    // Arc representant l'angle donne
    ctx.beginPath();
    ctx.arc(cx, cy, arcRadius, -rad, 0, false);
    ctx.strokeStyle = '#667eea';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Label de l'angle
    const labelRad = angDegToRad(angleDeg / 2);
    const labelDist = arcRadius + 18;
    const labelX = cx + labelDist * Math.cos(-labelRad);
    const labelY = cy + labelDist * Math.sin(-labelRad);
    ctx.font = 'bold 14px sans-serif';
    ctx.fillStyle = '#667eea';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(angleDeg + '\u00B0', labelX, labelY);

    // Label du sommet
    ctx.font = '13px sans-serif';
    ctx.fillStyle = '#333';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('O', cx - 10, cy + 8);
}

/**
 * Dessine deux droites paralleles coupees par une secante,
 * avec les angles marques.
 */
function drawParallelLines(ctx, w, h) {
    const y1 = 90;
    const y2 = 210;
    const margin = 30;

    // Droites paralleles (bleues)
    ctx.strokeStyle = '#3182ce';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(margin, y1);
    ctx.lineTo(w - margin, y1);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(margin, y2);
    ctx.lineTo(w - margin, y2);
    ctx.stroke();

    // Labels paralleles
    ctx.font = 'bold 13px sans-serif';
    ctx.fillStyle = '#3182ce';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'bottom';
    ctx.fillText('(d\u2081)', margin + 4, y1 - 5);
    ctx.fillText('(d\u2082)', margin + 4, y2 - 5);

    // Secante (grise) passant par les deux droites
    // On choisit un angle par rapport a l'horizontale
    const secAngle = angDegToRad(65);
    const interX1 = w * 0.45;
    const interX2 = interX1 + (y2 - y1) / Math.tan(secAngle);

    // Prolonger la secante au-dela des droites
    const dx = Math.cos(Math.PI / 2 - secAngle);
    const dy = -Math.sin(Math.PI / 2 - secAngle);
    const ext = 40;

    ctx.strokeStyle = '#666';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(interX1 - dx * ext, y1 - dy * ext);
    ctx.lineTo(interX2 + dx * ext, y2 + dy * ext);
    ctx.stroke();

    // Angle donne (en rouge) - a l'intersection avec d1
    const angleDeg = AnglesState.transversalAngle;
    const angleRad = angDegToRad(angleDeg);

    // L'angle est mesure entre la droite parallele (vers la droite) et la secante (vers le bas)
    // Calculer l'angle de la secante par rapport a l'horizontale
    const secDx = interX2 - interX1;
    const secDy = y2 - y1;
    const secAngleFromHoriz = Math.atan2(secDy, secDx);

    // Angle donne : entre l'horizontale (vers la droite) et la secante (dans le sens trigo)
    // On affiche l'angle entre la demi-droite horizontale droite et la secante montante
    const startAngle1 = -secAngleFromHoriz;
    const endAngle1 = 0;
    const arcR = 30;

    // Arc pour l'angle donne (rouge) - au point d'intersection avec d1
    ctx.beginPath();
    ctx.arc(interX1, y1, arcR, startAngle1, endAngle1, false);
    ctx.strokeStyle = '#e53e3e';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Label angle donne
    const midAngle1 = (startAngle1 + endAngle1) / 2;
    const lx1 = interX1 + (arcR + 16) * Math.cos(midAngle1);
    const ly1 = y1 + (arcR + 16) * Math.sin(midAngle1);
    ctx.font = 'bold 13px sans-serif';
    ctx.fillStyle = '#e53e3e';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(angleDeg + '\u00B0', lx1, ly1);

    // Angle a trouver (bleu) - a l'intersection avec d2
    const subtype = AnglesState.alterneSubtype;

    if (subtype === 'alternes') {
        // Angles alternes-internes : meme mesure, de l'autre cote de la secante
        // L'angle alterne est du cote oppose, donc entre la secante montante et la droite (vers la gauche)
        const startAngle2 = Math.PI;
        const endAngle2 = Math.PI + (endAngle1 - startAngle1);

        ctx.beginPath();
        ctx.arc(interX2, y2, arcR, startAngle2, endAngle2, false);
        ctx.strokeStyle = '#3182ce';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Label
        const midAngle2 = (startAngle2 + endAngle2) / 2;
        const lx2 = interX2 + (arcR + 16) * Math.cos(midAngle2);
        const ly2 = y2 + (arcR + 16) * Math.sin(midAngle2);
        ctx.font = 'bold 13px sans-serif';
        ctx.fillStyle = '#3182ce';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('?', lx2, ly2);
    } else {
        // Angles co-interieures : supplementaires, du meme cote de la secante
        const startAngle2 = -secAngleFromHoriz;
        const endAngle2 = 0;

        // L'angle co-interieur est entre la secante et la droite, meme cote
        // mais a la seconde intersection : on prend l'angle entre la droite vers la droite
        // et la secante vers le haut (supplementaire)
        const coStartAngle = 0;
        const coEndAngle = Math.PI - secAngleFromHoriz;

        ctx.beginPath();
        ctx.arc(interX2, y2, arcR, -coEndAngle, coStartAngle, false);
        ctx.strokeStyle = '#3182ce';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Label
        const midAngleCo = (-coEndAngle + coStartAngle) / 2;
        const lx2 = interX2 + (arcR + 16) * Math.cos(midAngleCo);
        const ly2 = y2 + (arcR + 16) * Math.sin(midAngleCo);
        ctx.font = 'bold 13px sans-serif';
        ctx.fillStyle = '#3182ce';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('?', lx2, ly2);
    }

    // Fleches de parallelisme sur les deux droites
    drawParallelArrows(ctx, w / 2 + 40, y1);
    drawParallelArrows(ctx, w / 2 + 40, y2);
}

/**
 * Dessine les petites fleches de parallelisme (>>)
 */
function drawParallelArrows(ctx, x, y) {
    ctx.strokeStyle = '#3182ce';
    ctx.lineWidth = 1.5;
    const sz = 6;
    for (let i = 0; i < 2; i++) {
        const ox = x + i * 6;
        ctx.beginPath();
        ctx.moveTo(ox - sz, y - sz);
        ctx.lineTo(ox + sz, y);
        ctx.lineTo(ox - sz, y + sz);
        ctx.stroke();
    }
}

// ========================================
// Resolution
// ========================================

function solveAng() {
    let html = '<h3>Solution</h3>';

    switch (AnglesState.currentType) {
        case 'complementaires':
            html += solveComplementaires();
            break;
        case 'supplementaires':
            html += solveSupplementaires();
            break;
        case 'types':
            html += solveTypes();
            break;
        case 'alternes':
            html += solveAlternes();
            break;
    }

    $('solutionDiv').innerHTML = html;
    showSolution('solutionDiv');
}

function solveComplementaires() {
    const given = AnglesState.givenAngle;
    const answer = AnglesState.answer;
    let html = '';

    // Etape 1 : Rappel de la definition
    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : Rappel</div>';
    html += '<div class="step-expression">Deux angles complementaires ont une somme egale a 90\u00B0.</div>';
    html += '<div class="step-explanation">On note \u03B1 l\'angle connu et \u03B2 l\'angle cherche.</div>';
    html += '</div>';

    // Etape 2 : Mise en equation
    html += '<div class="step">';
    html += '<div class="step-number">Etape 2 : Mise en equation</div>';
    html += '<div class="step-expression">\u03B1 + \u03B2 = 90\u00B0</div>';
    html += '<div class="step-explanation">On isole \u03B2 : \u03B2 = 90\u00B0 \u2212 \u03B1</div>';
    html += '</div>';

    // Etape 3 : Calcul
    html += '<div class="step">';
    html += '<div class="step-number">Etape 3 : Application numerique</div>';
    html += '<div class="step-expression">\u03B2 = 90\u00B0 \u2212 ' + given + '\u00B0</div>';
    html += '<div class="step-explanation">\u03B2 = ' + answer + '\u00B0</div>';
    html += '</div>';

    // Verification
    html += '<div class="step">';
    html += '<div class="step-number">Verification</div>';
    html += '<div class="step-expression">' + given + '\u00B0 + ' + answer + '\u00B0 = ' + (given + answer) + '\u00B0</div>';
    html += '<div class="step-explanation">La somme vaut bien 90\u00B0, les deux angles sont complementaires.</div>';
    html += '</div>';

    // Resultat
    html += '<div class="result-highlight">';
    html += '<div class="final">L\'angle complementaire mesure ' + answer + '\u00B0</div>';
    html += '</div>';

    return html;
}

function solveSupplementaires() {
    const given = AnglesState.givenAngle;
    const answer = AnglesState.answer;
    let html = '';

    // Etape 1
    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : Rappel</div>';
    html += '<div class="step-expression">Deux angles supplementaires ont une somme egale a 180\u00B0.</div>';
    html += '<div class="step-explanation">On note \u03B1 l\'angle connu et \u03B2 l\'angle cherche.</div>';
    html += '</div>';

    // Etape 2
    html += '<div class="step">';
    html += '<div class="step-number">Etape 2 : Mise en equation</div>';
    html += '<div class="step-expression">\u03B1 + \u03B2 = 180\u00B0</div>';
    html += '<div class="step-explanation">On isole \u03B2 : \u03B2 = 180\u00B0 \u2212 \u03B1</div>';
    html += '</div>';

    // Etape 3
    html += '<div class="step">';
    html += '<div class="step-number">Etape 3 : Application numerique</div>';
    html += '<div class="step-expression">\u03B2 = 180\u00B0 \u2212 ' + given + '\u00B0</div>';
    html += '<div class="step-explanation">\u03B2 = ' + answer + '\u00B0</div>';
    html += '</div>';

    // Verification
    html += '<div class="step">';
    html += '<div class="step-number">Verification</div>';
    html += '<div class="step-expression">' + given + '\u00B0 + ' + answer + '\u00B0 = ' + (given + answer) + '\u00B0</div>';
    html += '<div class="step-explanation">La somme vaut bien 180\u00B0, les deux angles sont supplementaires.</div>';
    html += '</div>';

    // Resultat
    html += '<div class="result-highlight">';
    html += '<div class="final">L\'angle supplementaire mesure ' + answer + '\u00B0</div>';
    html += '</div>';

    return html;
}

function solveTypes() {
    const angle = AnglesState.givenAngle;
    const nature = AnglesState.answer;
    let html = '';

    // Etape 1
    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : Rappel des definitions</div>';
    html += '<div class="step-expression">';
    html += 'Un angle <strong>aigu</strong> mesure entre 0\u00B0 et 90\u00B0 (exclu).<br>';
    html += 'Un angle <strong>droit</strong> mesure exactement 90\u00B0.<br>';
    html += 'Un angle <strong>obtus</strong> mesure entre 90\u00B0 (exclu) et 180\u00B0 (exclu).<br>';
    html += 'Un angle <strong>plat</strong> mesure exactement 180\u00B0.';
    html += '</div>';
    html += '<div class="step-explanation">On compare la mesure de l\'angle aux valeurs de reference.</div>';
    html += '</div>';

    // Etape 2
    html += '<div class="step">';
    html += '<div class="step-number">Etape 2 : Comparaison</div>';
    html += '<div class="step-expression">';

    if (nature === 'aigu') {
        html += 'On a ' + angle + '\u00B0 < 90\u00B0';
        html += '</div>';
        html += '<div class="step-explanation">L\'angle est strictement inferieur a 90\u00B0, il est donc <strong>aigu</strong>.</div>';
    } else if (nature === 'droit') {
        html += 'On a ' + angle + '\u00B0 = 90\u00B0';
        html += '</div>';
        html += '<div class="step-explanation">L\'angle est exactement egal a 90\u00B0, il est donc <strong>droit</strong>.</div>';
    } else if (nature === 'obtus') {
        html += 'On a 90\u00B0 < ' + angle + '\u00B0 < 180\u00B0';
        html += '</div>';
        html += '<div class="step-explanation">L\'angle est strictement compris entre 90\u00B0 et 180\u00B0, il est donc <strong>obtus</strong>.</div>';
    } else {
        html += 'On a ' + angle + '\u00B0 = 180\u00B0';
        html += '</div>';
        html += '<div class="step-explanation">L\'angle est exactement egal a 180\u00B0, il est donc <strong>plat</strong>.</div>';
    }
    html += '</div>';

    // Resultat
    const natureLabel = {
        'aigu': 'aigu (< 90\u00B0)',
        'droit': 'droit (= 90\u00B0)',
        'obtus': 'obtus (entre 90\u00B0 et 180\u00B0)',
        'plat': 'plat (= 180\u00B0)'
    };

    html += '<div class="result-highlight">';
    html += '<div class="final">L\'angle de ' + angle + '\u00B0 est un angle ' + natureLabel[nature] + '</div>';
    html += '</div>';

    return html;
}

function solveAlternes() {
    const given = AnglesState.transversalAngle;
    const answer = AnglesState.answer;
    const subtype = AnglesState.alterneSubtype;
    let html = '';

    if (subtype === 'alternes') {
        // Etape 1
        html += '<div class="step">';
        html += '<div class="step-number">Etape 1 : Identifier la configuration</div>';
        html += '<div class="step-expression">Les droites (d\u2081) et (d\u2082) sont paralleles, coupees par une secante.</div>';
        html += '<div class="step-explanation">Les angles marques sont <strong>alternes-internes</strong> : ils sont situes de part et d\'autre de la secante, entre les deux paralleles.</div>';
        html += '</div>';

        // Etape 2
        html += '<div class="step">';
        html += '<div class="step-number">Etape 2 : Appliquer la propriete</div>';
        html += '<div class="step-expression">Si deux droites sont paralleles, alors les angles alternes-internes sont egaux.</div>';
        html += '<div class="step-explanation">Donc l\'angle cherche a la meme mesure que l\'angle donne.</div>';
        html += '</div>';

        // Etape 3
        html += '<div class="step">';
        html += '<div class="step-number">Etape 3 : Conclusion</div>';
        html += '<div class="step-expression">Angle cherche = ' + given + '\u00B0</div>';
        html += '<div class="step-explanation">Les deux angles alternes-internes mesurent chacun ' + given + '\u00B0.</div>';
        html += '</div>';
    } else {
        // Co-interieures
        // Etape 1
        html += '<div class="step">';
        html += '<div class="step-number">Etape 1 : Identifier la configuration</div>';
        html += '<div class="step-expression">Les droites (d\u2081) et (d\u2082) sont paralleles, coupees par une secante.</div>';
        html += '<div class="step-explanation">Les angles marques sont <strong>co-interieures</strong> (ou interieures du meme cote) : ils sont situes du meme cote de la secante, entre les deux paralleles.</div>';
        html += '</div>';

        // Etape 2
        html += '<div class="step">';
        html += '<div class="step-number">Etape 2 : Appliquer la propriete</div>';
        html += '<div class="step-expression">Si deux droites sont paralleles, alors les angles co-interieures sont supplementaires.</div>';
        html += '<div class="step-explanation">Leur somme vaut 180\u00B0. Donc l\'angle cherche = 180\u00B0 \u2212 angle donne.</div>';
        html += '</div>';

        // Etape 3
        html += '<div class="step">';
        html += '<div class="step-number">Etape 3 : Calcul</div>';
        html += '<div class="step-expression">Angle cherche = 180\u00B0 \u2212 ' + given + '\u00B0 = ' + answer + '\u00B0</div>';
        html += '<div class="step-explanation">' + given + '\u00B0 + ' + answer + '\u00B0 = 180\u00B0, la propriete est verifiee.</div>';
        html += '</div>';
    }

    // Resultat
    html += '<div class="result-highlight">';
    html += '<div class="final">L\'angle cherche mesure ' + answer + '\u00B0</div>';
    html += '</div>';

    return html;
}

// ========================================
// Initialisation au chargement
// ========================================

document.addEventListener('DOMContentLoaded', initAnglesPage);
