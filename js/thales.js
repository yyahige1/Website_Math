/* ========================================
   THALES.JS - Theoreme de Thales
   ======================================== */

/**
 * Etat du module
 */
const ThalesState = {
    currentType: 'direct',
    // Configuration triangle ou papillon
    config: 'triangle', // 'triangle' ou 'papillon'
    // Sommets
    sommets: ['A', 'B', 'C', 'M', 'N'],
    // Longueurs connues
    AB: 0, AC: 0, BC: 0,
    AM: 0, AN: 0, MN: 0,
    // Rapport (k = AM/AB = AN/AC = MN/BC)
    k: 0,
    // Quel cote est inconnu (pour type direct)
    inconnu: 'MN',
    // Pour reciproque
    isParallel: true,
};

/**
 * KaTeX helper
 */
function KT(tex) {
    return katex.renderToString(tex, { throwOnError: false });
}

/**
 * Initialise la page
 */
function initThalesPage() {
    setupTypeButtons();
    setupActionButtons();
    generateThales();
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
            ThalesState.currentType = button.dataset.type;
            generateThales();
            updateExerciseDisplay();
            hideSolution('solutionDiv');
        });
    });
}

/**
 * Configure les boutons d'action
 */
function setupActionButtons() {
    $('generateBtn').addEventListener('click', () => {
        generateThales();
        updateExerciseDisplay();
        hideSolution('solutionDiv');
    });

    $('solveBtn').addEventListener('click', () => {
        solveThales();
    });
}

/**
 * Genere des longueurs coherentes pour Thales
 */
function generateThales() {
    const st = ThalesState;

    // Choisir config triangle ou papillon
    st.config = Math.random() < 0.6 ? 'triangle' : 'papillon';

    // Sommets
    const sets = [
        ['A', 'B', 'C', 'M', 'N'],
        ['O', 'A', 'B', 'M', 'N'],
        ['S', 'E', 'F', 'M', 'N'],
    ];
    st.sommets = sets[Math.floor(Math.random() * sets.length)];

    // Generer des valeurs entieres propres
    // On choisit un rapport k simple : 2/3, 3/4, 2/5, 3/5, 1/2, 3/2, 4/3, 5/3
    const rapports = [
        [1, 2], [1, 3], [2, 3], [3, 4], [2, 5], [3, 5],
        [1, 4], [3, 7], [2, 7], [4, 5],
    ];
    const r = rapports[Math.floor(Math.random() * rapports.length)];
    const kNum = r[0], kDen = r[1];
    st.k = kNum / kDen;

    // BC : choisir un multiple de kDen pour que MN soit entier
    const multipliers = [1, 2, 3, 4, 5];
    const m = multipliers[Math.floor(Math.random() * multipliers.length)];
    st.BC = kDen * m;
    st.MN = kNum * m;

    // AB et AC : choisir puis calculer AM et AN
    const mAB = multipliers[Math.floor(Math.random() * multipliers.length)];
    st.AB = kDen * mAB;
    st.AM = kNum * mAB;

    const mAC = multipliers[Math.floor(Math.random() * multipliers.length)];
    st.AC = kDen * mAC;
    st.AN = kNum * mAC;

    // S'assurer de valeurs raisonnables (>= 2, eviter trop grand)
    if (st.BC < 2 || st.AB < 2 || st.AC < 2) {
        return generateThales();
    }
    if (st.BC > 40 || st.AB > 40 || st.AC > 40) {
        return generateThales();
    }

    switch (st.currentType) {
        case 'direct': {
            // Choisir aleatoirement quel cote est inconnu
            const choices = ['MN', 'AM', 'AN'];
            st.inconnu = choices[Math.floor(Math.random() * choices.length)];
            break;
        }

        case 'reciproque': {
            st.isParallel = Math.random() < 0.5;
            if (!st.isParallel) {
                // Modifier une valeur pour casser la proportionnalite
                st.MN = st.MN + 1;
            }
            break;
        }

        case 'agrandissement':
            // Le rapport k est deja calcule, pas besoin de changement
            break;
    }
}

/**
 * Met a jour l'affichage de l'exercice
 */
function updateExerciseDisplay() {
    const st = ThalesState;
    const S = st.sommets;
    let display = '';

    switch (st.currentType) {
        case 'direct': {
            display = 'Dans la figure ci-dessous, ';
            display += '(MN) est parallele a (' + S[1] + S[2] + ').<br>';
            display += 'On donne : ';
            if (st.inconnu === 'MN') {
                display += S[0] + S[1] + ' = ' + st.AB + ', ';
                display += S[0] + 'M = ' + st.AM + ', ';
                display += S[1] + S[2] + ' = ' + st.BC + '.<br>';
                display += '<strong>Calculer MN.</strong>';
            } else if (st.inconnu === 'AM') {
                display += S[0] + S[1] + ' = ' + st.AB + ', ';
                display += 'MN = ' + st.MN + ', ';
                display += S[1] + S[2] + ' = ' + st.BC + '.<br>';
                display += '<strong>Calculer ' + S[0] + 'M.</strong>';
            } else {
                display += S[0] + S[2] + ' = ' + st.AC + ', ';
                display += S[0] + 'M = ' + st.AM + ', ';
                display += S[0] + S[1] + ' = ' + st.AB + '.<br>';
                display += '<strong>Calculer ' + S[0] + 'N.</strong>';
            }
            break;
        }

        case 'reciproque': {
            display = 'On donne : ';
            display += S[0] + 'M = ' + st.AM + ', ';
            display += S[0] + S[1] + ' = ' + st.AB + ', ';
            display += S[0] + 'N = ' + st.AN + ', ';
            display += S[0] + S[2] + ' = ' + st.AC + '.<br>';
            display += '<strong>Les droites (MN) et (' + S[1] + S[2] + ') sont-elles paralleles ?</strong>';
            break;
        }

        case 'agrandissement': {
            display = 'Dans la figure ci-dessous, (MN) est parallele a (' + S[1] + S[2] + ').<br>';
            display += S[0] + S[1] + ' = ' + st.AB + ', ';
            display += S[0] + 'M = ' + st.AM + ', ';
            display += S[1] + S[2] + ' = ' + st.BC + '.<br>';
            const kStr = formatRapport(st.AM, st.AB);
            display += '<strong>Determiner le rapport de reduction et calculer MN.</strong>';
            break;
        }
    }

    $('exerciseDisplay').innerHTML = display;
    drawThalesConfig();
}

/**
 * Formate un rapport a/b en fraction simplifiee
 */
function formatRapport(num, den) {
    const g = gcd(num, den);
    return (num / g) + '/' + (den / g);
}

/**
 * Dessine la configuration de Thales sur le canvas
 */
function drawThalesConfig() {
    const canvas = $('thalesCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const st = ThalesState;
    const S = st.sommets;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.style.display = 'block';

    const w = canvas.width;
    const h = canvas.height;
    const pad = 35;

    if (st.config === 'triangle') {
        drawTriangleConfig(ctx, w, h, pad);
    } else {
        drawPapillonConfig(ctx, w, h, pad);
    }
}

/**
 * Dessine la configuration triangle (M sur [AB], N sur [AC])
 */
function drawTriangleConfig(ctx, w, h, pad) {
    const st = ThalesState;
    const S = st.sommets;

    // Sommet A en haut, B en bas gauche, C en bas droite
    const ax = w / 2;
    const ay = pad + 5;
    const bx = pad;
    const by = h - pad;
    const cx = w - pad;
    const cy = h - pad;

    // M est sur [AB] tel que AM/AB = k
    const k = st.k;
    const mx = ax + k * (bx - ax);
    const my = ay + k * (by - ay);
    // N est sur [AC] tel que AN/AC = k
    const nx = ax + k * (cx - ax);
    const ny = ay + k * (cy - ay);

    // Dessiner les cotes du triangle
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx, by);
    ctx.lineTo(cx, cy);
    ctx.closePath();
    ctx.stroke();

    // Remplissage leger
    ctx.fillStyle = 'rgba(102, 126, 234, 0.06)';
    ctx.fill();

    // Dessiner (MN) parallele a (BC)
    ctx.strokeStyle = '#e74c3c';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 3]);
    ctx.beginPath();
    ctx.moveTo(mx, my);
    ctx.lineTo(nx, ny);
    ctx.stroke();
    ctx.setLineDash([]);

    // Points
    drawPoint(ctx, ax, ay, S[0], 'top');
    drawPoint(ctx, bx, by, S[1], 'bottom-left');
    drawPoint(ctx, cx, cy, S[2], 'bottom-right');
    drawPoint(ctx, mx, my, 'M', 'left');
    drawPoint(ctx, nx, ny, 'N', 'right');

    // Fleches parallelisme
    ctx.font = '11px sans-serif';
    ctx.fillStyle = '#e74c3c';
    ctx.textAlign = 'center';
    ctx.fillText('// (MN) // (' + S[1] + S[2] + ')', w / 2, (my + ny) / 2 - 8);
}

/**
 * Dessine la configuration papillon (A entre [MB] et [NC])
 */
function drawPapillonConfig(ctx, w, h, pad) {
    const st = ThalesState;
    const S = st.sommets;
    const k = st.k;

    // A au centre
    const ax = w / 2;
    const ay = h / 2;

    // B en haut gauche, C en haut droite
    const bx = pad + 20;
    const by = pad + 10;
    const cx = w - pad - 20;
    const cy = pad + 30;

    // M et N de l'autre cote de A
    // AM/AB = k => M = A + k * (A - B) = A(1+k) - kB  (cote oppose)
    const mx = ax + k * (ax - bx);
    const my = ay + k * (ay - by);
    const nx = ax + k * (ax - cx);
    const ny = ay + k * (ay - cy);

    // Dessiner les droites
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    // Droite passant par B, A, M
    ctx.beginPath();
    ctx.moveTo(bx, by);
    ctx.lineTo(mx, my);
    ctx.stroke();
    // Droite passant par C, A, N
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(nx, ny);
    ctx.stroke();

    // Dessiner (BC)
    ctx.beginPath();
    ctx.moveTo(bx, by);
    ctx.lineTo(cx, cy);
    ctx.stroke();

    // Dessiner (MN) parallele
    ctx.strokeStyle = '#e74c3c';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 3]);
    ctx.beginPath();
    ctx.moveTo(mx, my);
    ctx.lineTo(nx, ny);
    ctx.stroke();
    ctx.setLineDash([]);

    // Points
    drawPoint(ctx, ax, ay, S[0], 'top');
    drawPoint(ctx, bx, by, S[1], 'top-left');
    drawPoint(ctx, cx, cy, S[2], 'top-right');
    drawPoint(ctx, mx, my, 'M', 'bottom-left');
    drawPoint(ctx, nx, ny, 'N', 'bottom-right');
}

/**
 * Dessine un point etiquete
 */
function drawPoint(ctx, x, y, label, position) {
    // Point
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, 2 * Math.PI);
    ctx.fillStyle = '#333';
    ctx.fill();

    // Label
    ctx.font = 'bold 13px sans-serif';
    ctx.fillStyle = '#333';
    let lx = x, ly = y;
    switch (position) {
        case 'top':        lx = x; ly = y - 10; ctx.textAlign = 'center'; break;
        case 'bottom':     lx = x; ly = y + 18; ctx.textAlign = 'center'; break;
        case 'left':       lx = x - 12; ly = y + 4; ctx.textAlign = 'right'; break;
        case 'right':      lx = x + 12; ly = y + 4; ctx.textAlign = 'left'; break;
        case 'top-left':   lx = x - 10; ly = y - 6; ctx.textAlign = 'right'; break;
        case 'top-right':  lx = x + 10; ly = y - 6; ctx.textAlign = 'left'; break;
        case 'bottom-left':  lx = x - 10; ly = y + 16; ctx.textAlign = 'right'; break;
        case 'bottom-right': lx = x + 10; ly = y + 16; ctx.textAlign = 'left'; break;
    }
    ctx.fillText(label, lx, ly);
}

/**
 * Resout l'exercice courant
 */
function solveThales() {
    let html = '<h3>Solution</h3>';

    switch (ThalesState.currentType) {
        case 'direct':
            html += solveDirect();
            break;
        case 'reciproque':
            html += solveReciproque();
            break;
        case 'agrandissement':
            html += solveAgrandissement();
            break;
    }

    $('solutionDiv').innerHTML = html;
    showSolution('solutionDiv');
}

/**
 * Resout : calcul direct (longueur manquante)
 */
function solveDirect() {
    const st = ThalesState;
    const S = st.sommets;
    let html = '';

    // Etape 1 : Identifier la configuration
    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : Identifier la configuration</div>';
    html += '<div class="step-expression">';
    html += 'Les droites (MN) et (' + S[1] + S[2] + ') sont paralleles.';
    html += '</div>';
    html += '<div class="step-explanation">';
    html += 'D\'apres le <strong>theoreme de Thales</strong>, on a l\'egalite des rapports :';
    html += '</div>';
    html += '</div>';

    // Etape 2 : Ecrire les rapports
    html += '<div class="step">';
    html += '<div class="step-number">Etape 2 : Ecrire l\'egalite des rapports</div>';
    html += '<div class="step-expression">';
    html += KT('\\dfrac{' + S[0] + 'M}{' + S[0] + S[1] + '} = \\dfrac{' + S[0] + 'N}{' + S[0] + S[2] + '} = \\dfrac{MN}{' + S[1] + S[2] + '}');
    html += '</div>';
    html += '</div>';

    // Etape 3 : Remplacer et calculer
    let resultValue, resultLabel;

    if (st.inconnu === 'MN') {
        html += '<div class="step">';
        html += '<div class="step-number">Etape 3 : Remplacer par les valeurs connues</div>';
        html += '<div class="step-expression">';
        html += KT('\\dfrac{' + st.AM + '}{' + st.AB + '} = \\dfrac{MN}{' + st.BC + '}');
        html += '</div>';
        html += '</div>';

        // Produit en croix
        resultValue = st.MN;
        resultLabel = 'MN';

        html += '<div class="step">';
        html += '<div class="step-number">Etape 4 : Produit en croix</div>';
        html += '<div class="step-expression">';
        html += KT('MN = \\dfrac{' + st.AM + ' \\times ' + st.BC + '}{' + st.AB + '} = \\dfrac{' + (st.AM * st.BC) + '}{' + st.AB + '}');
        html += '</div>';
        html += '</div>';

    } else if (st.inconnu === 'AM') {
        html += '<div class="step">';
        html += '<div class="step-number">Etape 3 : Remplacer par les valeurs connues</div>';
        html += '<div class="step-expression">';
        html += KT('\\dfrac{' + S[0] + 'M}{' + st.AB + '} = \\dfrac{' + st.MN + '}{' + st.BC + '}');
        html += '</div>';
        html += '</div>';

        resultValue = st.AM;
        resultLabel = S[0] + 'M';

        html += '<div class="step">';
        html += '<div class="step-number">Etape 4 : Produit en croix</div>';
        html += '<div class="step-expression">';
        html += KT(S[0] + 'M = \\dfrac{' + st.MN + ' \\times ' + st.AB + '}{' + st.BC + '} = \\dfrac{' + (st.MN * st.AB) + '}{' + st.BC + '}');
        html += '</div>';
        html += '</div>';

    } else {
        html += '<div class="step">';
        html += '<div class="step-number">Etape 3 : Remplacer par les valeurs connues</div>';
        html += '<div class="step-expression">';
        html += KT('\\dfrac{' + st.AM + '}{' + st.AB + '} = \\dfrac{' + S[0] + 'N}{' + st.AC + '}');
        html += '</div>';
        html += '</div>';

        resultValue = st.AN;
        resultLabel = S[0] + 'N';

        html += '<div class="step">';
        html += '<div class="step-number">Etape 4 : Produit en croix</div>';
        html += '<div class="step-expression">';
        html += KT(S[0] + 'N = \\dfrac{' + st.AM + ' \\times ' + st.AC + '}{' + st.AB + '} = \\dfrac{' + (st.AM * st.AC) + '}{' + st.AB + '}');
        html += '</div>';
        html += '</div>';
    }

    // Resultat
    const rStr = Number.isInteger(resultValue) ? resultValue.toString() : resultValue.toFixed(2);
    html += '<div class="result-highlight">';
    html += '<div class="final">' + KT(resultLabel + ' = ' + rStr) + '</div>';
    html += '</div>';

    return html;
}

/**
 * Resout : reciproque (parallelisme)
 */
function solveReciproque() {
    const st = ThalesState;
    const S = st.sommets;
    let html = '';

    // Etape 1
    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : Calculer les rapports</div>';
    html += '<div class="step-expression">';
    html += 'On calcule les rapports ' + KT('\\dfrac{' + S[0] + 'M}{' + S[0] + S[1] + '}') + ' et ' + KT('\\dfrac{' + S[0] + 'N}{' + S[0] + S[2] + '}') + '.';
    html += '</div>';
    html += '</div>';

    // Etape 2 : Calcul du premier rapport
    const g1 = gcd(st.AM, st.AB);
    const r1Num = st.AM / g1;
    const r1Den = st.AB / g1;

    html += '<div class="step">';
    html += '<div class="step-number">Etape 2 : Premier rapport</div>';
    html += '<div class="step-expression">';
    html += KT('\\dfrac{' + S[0] + 'M}{' + S[0] + S[1] + '} = \\dfrac{' + st.AM + '}{' + st.AB + '}');
    if (g1 > 1) {
        html += ' = ' + KT('\\dfrac{' + r1Num + '}{' + r1Den + '}');
    }
    html += '</div>';
    html += '</div>';

    // Etape 3 : Calcul du deuxieme rapport
    const g2 = gcd(st.AN, st.AC);
    const r2Num = st.AN / g2;
    const r2Den = st.AC / g2;

    html += '<div class="step">';
    html += '<div class="step-number">Etape 3 : Deuxieme rapport</div>';
    html += '<div class="step-expression">';
    html += KT('\\dfrac{' + S[0] + 'N}{' + S[0] + S[2] + '} = \\dfrac{' + st.AN + '}{' + st.AC + '}');
    if (g2 > 1) {
        html += ' = ' + KT('\\dfrac{' + r2Num + '}{' + r2Den + '}');
    }
    html += '</div>';
    html += '</div>';

    // Etape 4 : Comparaison
    const areEqual = (r1Num * r2Den === r2Num * r1Den);
    html += '<div class="step">';
    html += '<div class="step-number">Etape 4 : Comparer les rapports</div>';
    html += '<div class="step-expression">';
    html += KT('\\dfrac{' + r1Num + '}{' + r1Den + '}');
    if (areEqual) {
        html += ' = ';
    } else {
        html += ' &ne; ';
    }
    html += KT('\\dfrac{' + r2Num + '}{' + r2Den + '}');
    html += '</div>';
    html += '<div class="step-explanation">';
    if (areEqual) {
        html += 'Les rapports sont <strong>egaux</strong>.<br>';
        html += 'D\'apres la <strong>reciproque du theoreme de Thales</strong>, les droites (MN) et (' + S[1] + S[2] + ') sont paralleles.';
    } else {
        html += 'Les rapports sont <strong>differents</strong>.<br>';
        html += 'On ne peut pas conclure que les droites sont paralleles par le theoreme de Thales.';
    }
    html += '</div>';
    html += '</div>';

    // Resultat
    html += '<div class="result-highlight">';
    if (areEqual) {
        html += '<div class="final">Les droites (MN) et (' + S[1] + S[2] + ') <strong>sont paralleles</strong>.</div>';
    } else {
        html += '<div class="final">Les droites (MN) et (' + S[1] + S[2] + ') <strong>ne sont pas paralleles</strong>.</div>';
    }
    html += '</div>';

    return html;
}

/**
 * Resout : agrandissement/reduction
 */
function solveAgrandissement() {
    const st = ThalesState;
    const S = st.sommets;
    let html = '';

    // Etape 1 : Calcul du rapport
    const g = gcd(st.AM, st.AB);
    const kNum = st.AM / g;
    const kDen = st.AB / g;
    const kValue = st.AM / st.AB;

    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : Calculer le rapport de ' + (kValue < 1 ? 'reduction' : 'agrandissement') + '</div>';
    html += '<div class="step-expression">';
    html += KT('k = \\dfrac{' + S[0] + 'M}{' + S[0] + S[1] + '} = \\dfrac{' + st.AM + '}{' + st.AB + '}');
    if (g > 1) {
        html += ' = ' + KT('\\dfrac{' + kNum + '}{' + kDen + '}');
    }
    html += '</div>';
    html += '<div class="step-explanation">';
    if (kValue < 1) {
        html += 'k &lt; 1, c\'est une <strong>reduction</strong>.';
    } else if (kValue > 1) {
        html += 'k &gt; 1, c\'est un <strong>agrandissement</strong>.';
    } else {
        html += 'k = 1, les deux figures sont de meme taille.';
    }
    html += '</div>';
    html += '</div>';

    // Etape 2 : Appliquer pour trouver MN
    html += '<div class="step">';
    html += '<div class="step-number">Etape 2 : Calculer MN</div>';
    html += '<div class="step-expression">';
    html += KT('MN = k \\times ' + S[1] + S[2] + ' = \\dfrac{' + kNum + '}{' + kDen + '} \\times ' + st.BC);
    html += '</div>';
    html += '<div class="step-explanation">';
    html += KT('MN = \\dfrac{' + kNum + ' \\times ' + st.BC + '}{' + kDen + '} = \\dfrac{' + (kNum * st.BC) + '}{' + kDen + '}');
    html += '</div>';
    html += '</div>';

    // Resultat
    const rStr = Number.isInteger(st.MN) ? st.MN.toString() : st.MN.toFixed(2);
    html += '<div class="result-highlight">';
    html += '<div class="final">';
    html += KT('k = \\dfrac{' + kNum + '}{' + kDen + '}') + ' et ' + KT('MN = ' + rStr);
    html += '</div>';
    html += '</div>';

    return html;
}

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', () => {
    initThalesPage();
});
