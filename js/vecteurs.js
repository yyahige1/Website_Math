/* ========================================
   VECTEURS.JS - Vecteurs du plan (Lycee)
   ======================================== */

/**
 * Etat du module Vecteurs
 */
const VecteursState = {
    currentType: 'coordonnees',

    subtype_coordonnees: 'vecteur_ab',
    subtype_norme: 'norme_vecteur',
    subtype_colinearite: 'tester',
    subtype_scalaire: 'coordonnees',
    subtype_operations: 'somme',

    exercise: {}
};

// ========================================
// Utilitaires locaux
// ========================================

function rint(min, max, excl) {
    const exclude = excl || [];
    let val;
    do {
        val = Math.floor(Math.random() * (max - min + 1)) + min;
    } while (exclude.includes(val));
    return val;
}

function K(tex) {
    return katex.renderToString(tex, { throwOnError: false });
}

function roundDec(x, d) {
    const f = Math.pow(10, d);
    return Math.round(x * f) / f;
}

function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function gcdLocal(a, b) {
    a = Math.abs(a); b = Math.abs(b);
    while (b) { [a, b] = [b, a % b]; }
    return a;
}

// Formate un vecteur en TeX : \vec{u}
function vecTeX(name) {
    return `\\vec{${name}}`;
}

// Formate les coordonnees d'un vecteur
function coordTeX(x, y) {
    return `\\begin{pmatrix} ${x} \\\\ ${y} \\end{pmatrix}`;
}

// Formate un signe
function signStr(n) {
    return n >= 0 ? '+' : '-';
}

function signTerm(n, first) {
    if (first) return `${n}`;
    return n >= 0 ? `+ ${n}` : `- ${Math.abs(n)}`;
}

// ========================================
// Dessin des vecteurs sur le graphique
// ========================================

var vecGraph = null;

/**
 * Dessine une fleche de vecteur sur le GraphCanvas
 */
function drawArrowVec(graph, x1, y1, x2, y2, color, label) {
    const ctx = graph.ctx;
    const cx1 = graph.toCanvasX(x1);
    const cy1 = graph.toCanvasY(y1);
    const cx2 = graph.toCanvasX(x2);
    const cy2 = graph.toCanvasY(y2);

    // Ligne
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(cx1, cy1);
    ctx.lineTo(cx2, cy2);
    ctx.stroke();

    // Tete de fleche
    const angle = Math.atan2(cy2 - cy1, cx2 - cx1);
    const headLen = 12;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(cx2, cy2);
    ctx.lineTo(cx2 - headLen * Math.cos(angle - 0.35), cy2 - headLen * Math.sin(angle - 0.35));
    ctx.lineTo(cx2 - headLen * Math.cos(angle + 0.35), cy2 - headLen * Math.sin(angle + 0.35));
    ctx.closePath();
    ctx.fill();

    // Label au milieu
    if (label) {
        const mx = (cx1 + cx2) / 2;
        const my = (cy1 + cy2) / 2;
        // Decaler le label perpendiculairement a la fleche
        const perpX = -Math.sin(angle) * 14;
        const perpY = Math.cos(angle) * 14;
        ctx.fillStyle = color;
        ctx.font = 'bold 13px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, mx + perpX, my + perpY);
    }
}

/**
 * Dessine le graphique des vecteurs selon le type d'exercice
 */
function drawVectorGraph() {
    const ex = VecteursState.exercise;
    const type = VecteursState.currentType;
    const sub = VecteursState['subtype_' + type] || '';

    // Collecter tous les points pour determiner les bornes
    let points = [];

    switch (type) {
        case 'coordonnees':
            points.push({ x: ex.ax, y: ex.ay }, { x: ex.bx, y: ex.by });
            break;
        case 'norme':
            if (sub === 'distance') {
                points.push({ x: ex.ax, y: ex.ay }, { x: ex.bx, y: ex.by });
            } else {
                points.push({ x: 0, y: 0 }, { x: ex.vx, y: ex.vy });
            }
            break;
        case 'colinearite':
            points.push({ x: 0, y: 0 }, { x: ex.ux, y: ex.uy }, { x: ex.vx, y: ex.vy });
            break;
        case 'scalaire':
            points.push({ x: 0, y: 0 }, { x: ex.ux, y: ex.uy }, { x: ex.vx, y: ex.vy });
            break;
        case 'operations':
            points.push({ x: 0, y: 0 }, { x: ex.ux, y: ex.uy }, { x: ex.vx, y: ex.vy }, { x: ex.rx, y: ex.ry });
            break;
    }

    // Calculer les bornes avec marge
    let xMin = -1, xMax = 1, yMin = -1, yMax = 1;
    for (const p of points) {
        if (p.x < xMin) xMin = p.x;
        if (p.x > xMax) xMax = p.x;
        if (p.y < yMin) yMin = p.y;
        if (p.y > yMax) yMax = p.y;
    }
    const margin = 2;
    xMin = Math.floor(xMin - margin);
    xMax = Math.ceil(xMax + margin);
    yMin = Math.floor(yMin - margin);
    yMax = Math.ceil(yMax + margin);

    // Rendre carre si possible
    const rangeX = xMax - xMin;
    const rangeY = yMax - yMin;
    if (rangeX > rangeY) {
        const diff = rangeX - rangeY;
        yMin -= Math.floor(diff / 2);
        yMax += Math.ceil(diff / 2);
    } else if (rangeY > rangeX) {
        const diff = rangeY - rangeX;
        xMin -= Math.floor(diff / 2);
        xMax += Math.ceil(diff / 2);
    }

    vecGraph = new GraphCanvas('vecCanvas', {
        width: 420,
        height: 420,
        padding: 40,
        xMin: xMin,
        xMax: xMax,
        yMin: yMin,
        yMax: yMax
    });

    vecGraph.clear();
    vecGraph.drawGrid();
    vecGraph.drawAxes();
    vecGraph.drawTicks();

    // Dessiner selon le type
    switch (type) {
        case 'coordonnees':
            drawGraphCoordonnees(ex);
            break;
        case 'norme':
            drawGraphNorme(ex, sub);
            break;
        case 'colinearite':
            drawGraphColinearite(ex);
            break;
        case 'scalaire':
            drawGraphScalaire(ex, sub);
            break;
        case 'operations':
            drawGraphOperations(ex);
            break;
    }
}

function drawGraphCoordonnees(ex) {
    const sub = VecteursState.subtype_coordonnees;
    const blue = '#2196F3';
    const red = '#e53e3e';

    // Points A et B
    vecGraph.drawPoint(ex.ax, ex.ay, blue, 5, 'A(' + ex.ax + ';' + ex.ay + ')');
    vecGraph.drawPoint(ex.bx, ex.by, red, 5, 'B(' + ex.bx + ';' + ex.by + ')');

    if (sub === 'vecteur_ab' || sub === 'point') {
        // Fleche AB
        drawArrowVec(vecGraph, ex.ax, ex.ay, ex.bx, ex.by, '#667eea', 'AB');
    }
    if (sub === 'milieu') {
        // Segment AB + milieu
        const ctx = vecGraph.ctx;
        ctx.strokeStyle = '#667eea';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(vecGraph.toCanvasX(ex.ax), vecGraph.toCanvasY(ex.ay));
        ctx.lineTo(vecGraph.toCanvasX(ex.bx), vecGraph.toCanvasY(ex.by));
        ctx.stroke();
        ctx.setLineDash([]);

        const mx = (ex.ax + ex.bx) / 2;
        const my = (ex.ay + ex.by) / 2;
        vecGraph.drawPoint(mx, my, '#48bb78', 5, 'M');
    }
}

function drawGraphNorme(ex, sub) {
    if (sub === 'distance') {
        vecGraph.drawPoint(ex.ax, ex.ay, '#2196F3', 5, 'A');
        vecGraph.drawPoint(ex.bx, ex.by, '#e53e3e', 5, 'B');
        drawArrowVec(vecGraph, ex.ax, ex.ay, ex.bx, ex.by, '#667eea', 'AB');
    } else {
        // Vecteur depuis l'origine
        vecGraph.drawPoint(0, 0, '#333', 4, 'O');
        drawArrowVec(vecGraph, 0, 0, ex.vx, ex.vy, '#2196F3', 'u');

        // Ligne en pointilles pour la norme
        const ctx = vecGraph.ctx;
        ctx.strokeStyle = 'rgba(233,62,62,0.5)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        // Projections
        ctx.beginPath();
        ctx.moveTo(vecGraph.toCanvasX(ex.vx), vecGraph.toCanvasY(ex.vy));
        ctx.lineTo(vecGraph.toCanvasX(ex.vx), vecGraph.toCanvasY(0));
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(vecGraph.toCanvasX(ex.vx), vecGraph.toCanvasY(ex.vy));
        ctx.lineTo(vecGraph.toCanvasX(0), vecGraph.toCanvasY(ex.vy));
        ctx.stroke();
        ctx.setLineDash([]);
    }
}

function drawGraphColinearite(ex) {
    vecGraph.drawPoint(0, 0, '#333', 4, 'O');
    drawArrowVec(vecGraph, 0, 0, ex.ux, ex.uy, '#2196F3', 'u');
    drawArrowVec(vecGraph, 0, 0, ex.vx, ex.vy, '#e53e3e', 'v');
}

function drawGraphScalaire(ex, sub) {
    vecGraph.drawPoint(0, 0, '#333', 4, 'O');
    drawArrowVec(vecGraph, 0, 0, ex.ux, ex.uy, '#2196F3', 'u');
    drawArrowVec(vecGraph, 0, 0, ex.vx, ex.vy, '#e53e3e', 'v');

    // Dessiner l'arc d'angle si on cherche l'angle
    if (sub === 'angle' || sub === 'orthogonalite') {
        const ctx = vecGraph.ctx;
        const ox = vecGraph.toCanvasX(0);
        const oy = vecGraph.toCanvasY(0);
        const angleU = Math.atan2(ex.uy, ex.ux);
        const angleV = Math.atan2(ex.vy, ex.vx);

        // Arc entre les deux vecteurs (en coordonnees canvas, y est inverse)
        const canvasAngleU = Math.atan2(-ex.uy, ex.ux);
        const canvasAngleV = Math.atan2(-ex.vy, ex.vx);

        ctx.strokeStyle = 'rgba(102,126,234,0.6)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(ox, oy, 25, Math.min(canvasAngleU, canvasAngleV), Math.max(canvasAngleU, canvasAngleV));
        ctx.stroke();
    }
}

function drawGraphOperations(ex) {
    const sub = VecteursState.subtype_operations;

    vecGraph.drawPoint(0, 0, '#333', 4, 'O');
    drawArrowVec(vecGraph, 0, 0, ex.ux, ex.uy, '#2196F3', 'u');
    drawArrowVec(vecGraph, 0, 0, ex.vx, ex.vy, '#e53e3e', 'v');

    // Vecteur resultat en vert
    drawArrowVec(vecGraph, 0, 0, ex.rx, ex.ry, '#48bb78', sub === 'somme' ? 'u' + ex.op + 'v' : 'w');

    // Parallelogramme en pointilles pour la somme
    if (sub === 'somme' && ex.op === '+') {
        const ctx = vecGraph.ctx;
        ctx.strokeStyle = 'rgba(150,150,150,0.5)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(vecGraph.toCanvasX(ex.ux), vecGraph.toCanvasY(ex.uy));
        ctx.lineTo(vecGraph.toCanvasX(ex.rx), vecGraph.toCanvasY(ex.ry));
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(vecGraph.toCanvasX(ex.vx), vecGraph.toCanvasY(ex.vy));
        ctx.lineTo(vecGraph.toCanvasX(ex.rx), vecGraph.toCanvasY(ex.ry));
        ctx.stroke();
        ctx.setLineDash([]);
    }
}

// ========================================
// Initialisation
// ========================================

function initVecteursPage() {
    setupTypeButtons();
    setupInputHandlers();
    setupActionButtons();
    generateNewExercise();
    updateExerciseDisplay();
}

function setupTypeButtons() {
    const typeButtons = document.querySelectorAll('.type-btn');
    typeButtons.forEach(button => {
        button.addEventListener('click', () => {
            typeButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            VecteursState.currentType = button.dataset.type;

            document.querySelectorAll('[id$="Section"]').forEach(section => {
                section.style.display = 'none';
            });

            const sectionMap = {
                'coordonnees': 'coordonneesSection',
                'norme': 'normeSection',
                'colinearite': 'colineariteSection',
                'scalaire': 'scalaireSection',
                'operations': 'operationsSection'
            };
            const sectionId = sectionMap[VecteursState.currentType];
            if (sectionId) $(sectionId).style.display = 'block';

            generateNewExercise();
            updateExerciseDisplay();
            hideSolution('solutionDiv');
        });
    });
}

function setupInputHandlers() {
    const selects = [
        'subtype_coordonnees', 'subtype_norme', 'subtype_colinearite',
        'subtype_scalaire', 'subtype_operations'
    ];
    selects.forEach(id => {
        const el = $(id);
        if (el) {
            el.addEventListener('change', () => {
                VecteursState[id] = el.value;
                generateNewExercise();
                updateExerciseDisplay();
                hideSolution('solutionDiv');
            });
        }
    });
}

function setupActionButtons() {
    $('newExerciseBtn').addEventListener('click', () => {
        generateNewExercise();
        updateExerciseDisplay();
        hideSolution('solutionDiv');
    });

    $('solveBtn').addEventListener('click', () => {
        solveVecteurs();
    });
}

// ========================================
// Generation des exercices
// ========================================

function generateNewExercise() {
    const type = VecteursState.currentType;
    switch (type) {
        case 'coordonnees': generateCoordonnees(); break;
        case 'norme': generateNorme(); break;
        case 'colinearite': generateColinearite(); break;
        case 'scalaire': generateScalaire(); break;
        case 'operations': generateOperations(); break;
    }
}

// --- Coordonnees ---
function generateCoordonnees() {
    const sub = VecteursState.subtype_coordonnees;
    const ex = {};

    // Points A et B avec coordonnees entieres
    ex.ax = rint(-8, 8);
    ex.ay = rint(-8, 8);
    ex.bx = rint(-8, 8);
    ex.by = rint(-8, 8);

    // Vecteur AB
    ex.vx = ex.bx - ex.ax;
    ex.vy = ex.by - ex.ay;

    if (sub === 'point') {
        // Donner A et AB, trouver B
        // On genere des coordonnees du vecteur pour eviter trivialite
        ex.vx = rint(-6, 6, [0]);
        ex.vy = rint(-6, 6, [0]);
        ex.bx = ex.ax + ex.vx;
        ex.by = ex.ay + ex.vy;
    }

    TrigoState_vec_sub = sub; // pas necessaire, on utilise VecteursState
    VecteursState.exercise = ex;
}

// --- Norme & Distance ---
function generateNorme() {
    const sub = VecteursState.subtype_norme;
    const ex = {};

    if (sub === 'norme_vecteur') {
        ex.vx = rint(-10, 10, [0]);
        ex.vy = rint(-10, 10, [0]);
        ex.norme = Math.sqrt(ex.vx * ex.vx + ex.vy * ex.vy);
    } else if (sub === 'distance') {
        ex.ax = rint(-8, 8);
        ex.ay = rint(-8, 8);
        ex.bx = rint(-8, 8);
        ex.by = rint(-8, 8);
        const dx = ex.bx - ex.ax;
        const dy = ex.by - ex.ay;
        ex.distance = Math.sqrt(dx * dx + dy * dy);
    } else {
        // Vecteur unitaire
        ex.vx = rint(-8, 8, [0]);
        ex.vy = rint(-8, 8, [0]);
        ex.norme = Math.sqrt(ex.vx * ex.vx + ex.vy * ex.vy);
        ex.ux = ex.vx / ex.norme;
        ex.uy = ex.vy / ex.norme;
    }

    VecteursState.exercise = ex;
}

// --- Colinearite ---
function generateColinearite() {
    const sub = VecteursState.subtype_colinearite;
    const ex = {};

    if (sub === 'tester') {
        // Generer deux vecteurs, parfois colineaires
        const colineaire = Math.random() < 0.4;
        ex.ux = rint(-6, 6, [0]);
        ex.uy = rint(-6, 6, [0]);

        if (colineaire) {
            const k = pick([-3, -2, -1, 2, 3]);
            ex.vx = ex.ux * k;
            ex.vy = ex.uy * k;
            ex.colineaires = true;
            ex.k = k;
        } else {
            // S'assurer que le determinant est non nul
            do {
                ex.vx = rint(-6, 6, [0]);
                ex.vy = rint(-6, 6, [0]);
            } while (ex.ux * ex.vy - ex.uy * ex.vx === 0);
            ex.colineaires = false;
        }
        ex.det = ex.ux * ex.vy - ex.uy * ex.vx;
    } else {
        // Trouver k pour colinearite
        ex.ux = rint(-5, 5, [0]);
        ex.uy = rint(-5, 5, [0]);
        // v = (k*ux + delta, uy_expr) ou on cherche k
        // On pose v = (a, k) et on veut ux*k - uy*a = 0
        // Donc k = uy*a / ux
        // Plus simple : v = (m, ?) avec ? a trouver
        ex.vx = rint(-5, 5, [0]);
        // k tel que ux * k - uy * vx = 0 => k = uy * vx / ux
        // Pour que k soit entier, choisir vx multiple de ux
        ex.vx = ex.ux * rint(1, 4);
        const multiplier = ex.vx / ex.ux;
        ex.kResult = ex.uy * multiplier;
        // v = (vx, kResult) mais on demande k dans v = (vx, k)
    }

    VecteursState.exercise = ex;
}

// --- Produit scalaire ---
function generateScalaire() {
    const sub = VecteursState.subtype_scalaire;
    const ex = {};

    ex.ux = rint(-6, 6, [0]);
    ex.uy = rint(-6, 6, [0]);
    ex.vx = rint(-6, 6, [0]);
    ex.vy = rint(-6, 6, [0]);

    ex.scalaire = ex.ux * ex.vx + ex.uy * ex.vy;

    if (sub === 'angle') {
        // S'assurer que les vecteurs ne sont pas nuls
        ex.normeU = Math.sqrt(ex.ux * ex.ux + ex.uy * ex.uy);
        ex.normeV = Math.sqrt(ex.vx * ex.vx + ex.vy * ex.vy);
        ex.cosAngle = ex.scalaire / (ex.normeU * ex.normeV);
        ex.angle = Math.acos(Math.max(-1, Math.min(1, ex.cosAngle))) * 180 / Math.PI;
    }

    if (sub === 'orthogonalite') {
        // 50% de chances d'etre orthogonaux
        if (Math.random() < 0.5) {
            // Rendre orthogonaux : v = (-uy, ux) * facteur
            const f = pick([-2, -1, 1, 2]);
            ex.vx = -ex.uy * f;
            ex.vy = ex.ux * f;
            ex.scalaire = ex.ux * ex.vx + ex.uy * ex.vy;
        }
        ex.orthogonaux = (ex.scalaire === 0);
    }

    VecteursState.exercise = ex;
}

// --- Operations ---
function generateOperations() {
    const sub = VecteursState.subtype_operations;
    const ex = {};

    ex.ux = rint(-5, 5, [0]);
    ex.uy = rint(-5, 5, [0]);
    ex.vx = rint(-5, 5, [0]);
    ex.vy = rint(-5, 5, [0]);

    if (sub === 'somme') {
        // u + v ou u - v
        ex.op = pick(['+', '-']);
        if (ex.op === '+') {
            ex.rx = ex.ux + ex.vx;
            ex.ry = ex.uy + ex.vy;
        } else {
            ex.rx = ex.ux - ex.vx;
            ex.ry = ex.uy - ex.vy;
        }
    } else {
        // Combinaison lineaire : a*u + b*v
        ex.a = rint(-4, 4, [0]);
        ex.b = rint(-4, 4, [0]);
        ex.rx = ex.a * ex.ux + ex.b * ex.vx;
        ex.ry = ex.a * ex.uy + ex.b * ex.vy;
    }

    VecteursState.exercise = ex;
}

// ========================================
// Affichage de l'exercice
// ========================================

function updateExerciseDisplay() {
    const ex = VecteursState.exercise;
    const type = VecteursState.currentType;
    let html = '';

    switch (type) {
        case 'coordonnees': html = displayCoordonnees(ex); break;
        case 'norme': html = displayNorme(ex); break;
        case 'colinearite': html = displayColinearite(ex); break;
        case 'scalaire': html = displayScalaire(ex); break;
        case 'operations': html = displayOperations(ex); break;
    }

    $('expressionDisplay').innerHTML = html;

    // Dessiner le graphique
    drawVectorGraph();
}

function displayCoordonnees(ex) {
    const sub = VecteursState.subtype_coordonnees;

    if (sub === 'vecteur_ab') {
        return `<p>Calculer les coordonnees du vecteur ` + K(`${vecTeX('AB')}`) + ` avec :</p>`
            + `<p style="text-align:center;">` + K(`A(${ex.ax}\\,;\\,${ex.ay})`) + ` et ` + K(`B(${ex.bx}\\,;\\,${ex.by})`) + `</p>`;
    } else if (sub === 'milieu') {
        return `<p>Calculer les coordonnees du milieu M de [AB] avec :</p>`
            + `<p style="text-align:center;">` + K(`A(${ex.ax}\\,;\\,${ex.ay})`) + ` et ` + K(`B(${ex.bx}\\,;\\,${ex.by})`) + `</p>`;
    } else {
        return `<p>Trouver les coordonnees du point B sachant que :</p>`
            + `<p style="text-align:center;">` + K(`A(${ex.ax}\\,;\\,${ex.ay})`) + ` et ` + K(`${vecTeX('AB')}${coordTeX(ex.vx, ex.vy)}`) + `</p>`;
    }
}

function displayNorme(ex) {
    const sub = VecteursState.subtype_norme;

    if (sub === 'norme_vecteur') {
        return `<p>Calculer la norme du vecteur :</p>`
            + `<p style="text-align:center; font-size:1.3em;">` + K(`${vecTeX('u')}${coordTeX(ex.vx, ex.vy)}`) + `</p>`;
    } else if (sub === 'distance') {
        return `<p>Calculer la distance AB avec :</p>`
            + `<p style="text-align:center;">` + K(`A(${ex.ax}\\,;\\,${ex.ay})`) + ` et ` + K(`B(${ex.bx}\\,;\\,${ex.by})`) + `</p>`;
    } else {
        return `<p>Determiner le vecteur unitaire de meme direction et meme sens que :</p>`
            + `<p style="text-align:center; font-size:1.3em;">` + K(`${vecTeX('u')}${coordTeX(ex.vx, ex.vy)}`) + `</p>`;
    }
}

function displayColinearite(ex) {
    const sub = VecteursState.subtype_colinearite;

    if (sub === 'tester') {
        return `<p>Les vecteurs suivants sont-ils colineaires ?</p>`
            + `<p style="text-align:center;">` + K(`${vecTeX('u')}${coordTeX(ex.ux, ex.uy)}`) + ` et ` + K(`${vecTeX('v')}${coordTeX(ex.vx, ex.vy)}`) + `</p>`;
    } else {
        return `<p>Trouver la valeur de ` + K('k') + ` pour que les vecteurs soient colineaires :</p>`
            + `<p style="text-align:center;">` + K(`${vecTeX('u')}${coordTeX(ex.ux, ex.uy)}`) + ` et ` + K(`${vecTeX('v')}${coordTeX(ex.vx, 'k')}`) + `</p>`;
    }
}

function displayScalaire(ex) {
    const sub = VecteursState.subtype_scalaire;

    if (sub === 'coordonnees') {
        return `<p>Calculer le produit scalaire ` + K(`${vecTeX('u')} \\cdot ${vecTeX('v')}`) + ` avec :</p>`
            + `<p style="text-align:center;">` + K(`${vecTeX('u')}${coordTeX(ex.ux, ex.uy)}`) + ` et ` + K(`${vecTeX('v')}${coordTeX(ex.vx, ex.vy)}`) + `</p>`;
    } else if (sub === 'angle') {
        return `<p>Calculer l'angle entre les vecteurs :</p>`
            + `<p style="text-align:center;">` + K(`${vecTeX('u')}${coordTeX(ex.ux, ex.uy)}`) + ` et ` + K(`${vecTeX('v')}${coordTeX(ex.vx, ex.vy)}`) + `</p>`;
    } else {
        return `<p>Les vecteurs suivants sont-ils orthogonaux ?</p>`
            + `<p style="text-align:center;">` + K(`${vecTeX('u')}${coordTeX(ex.ux, ex.uy)}`) + ` et ` + K(`${vecTeX('v')}${coordTeX(ex.vx, ex.vy)}`) + `</p>`;
    }
}

function displayOperations(ex) {
    const sub = VecteursState.subtype_operations;

    if (sub === 'somme') {
        return `<p>Calculer ` + K(`${vecTeX('u')} ${ex.op} ${vecTeX('v')}`) + ` avec :</p>`
            + `<p style="text-align:center;">` + K(`${vecTeX('u')}${coordTeX(ex.ux, ex.uy)}`) + ` et ` + K(`${vecTeX('v')}${coordTeX(ex.vx, ex.vy)}`) + `</p>`;
    } else {
        const aStr = ex.a === 1 ? '' : ex.a === -1 ? '-' : `${ex.a}`;
        const bSign = ex.b >= 0 ? '+' : '-';
        const bAbs = Math.abs(ex.b) === 1 ? '' : `${Math.abs(ex.b)}`;
        return `<p>Calculer ` + K(`${aStr}${vecTeX('u')} ${bSign} ${bAbs}${vecTeX('v')}`) + ` avec :</p>`
            + `<p style="text-align:center;">` + K(`${vecTeX('u')}${coordTeX(ex.ux, ex.uy)}`) + ` et ` + K(`${vecTeX('v')}${coordTeX(ex.vx, ex.vy)}`) + `</p>`;
    }
}

// ========================================
// Resolution
// ========================================

function solveVecteurs() {
    const type = VecteursState.currentType;
    let html = '';

    try {
        switch (type) {
            case 'coordonnees': html = solveCoordonnees(); break;
            case 'norme': html = solveNorme(); break;
            case 'colinearite': html = solveColinearite(); break;
            case 'scalaire': html = solveScalaire(); break;
            case 'operations': html = solveOperations(); break;
            default: html = '<p>Type inconnu.</p>';
        }
    } catch (e) {
        html = '<div class="step"><div class="step-number">Erreur</div>';
        html += '<div class="step-explanation">' + e.message + '</div></div>';
    }

    $('stepsContainer').innerHTML = html;
    showSolution('solutionDiv');
}

// --- Solution Coordonnees ---
function solveCoordonnees() {
    const ex = VecteursState.exercise;
    const sub = VecteursState.subtype_coordonnees;
    let html = '';

    if (sub === 'vecteur_ab') {
        html += '<div class="step">';
        html += '<div class="step-number">1. Rappeler la formule</div>';
        html += `<div class="step-expression">` + K(`${vecTeX('AB')}${coordTeX('x_B - x_A', 'y_B - y_A')}`) + `</div>`;
        html += '</div>';

        html += '<div class="step">';
        html += '<div class="step-number">2. Remplacer</div>';
        html += `<div class="step-expression">` + K(`${vecTeX('AB')}${coordTeX(`${ex.bx} - (${ex.ax})`, `${ex.by} - (${ex.ay})`)}`) + `</div>`;
        html += '</div>';

        html += '<div class="step">';
        html += '<div class="step-number">3. Calculer</div>';
        html += `<div class="step-expression">` + K(`${vecTeX('AB')}${coordTeX(ex.vx, ex.vy)}`) + `</div>`;
        html += '</div>';

        html += '<div class="result-highlight">';
        html += `<div class="final">` + K(`${vecTeX('AB')}${coordTeX(ex.vx, ex.vy)}`) + `</div>`;
        html += '</div>';

    } else if (sub === 'milieu') {
        const mx = (ex.ax + ex.bx) / 2;
        const my = (ex.ay + ex.by) / 2;
        const mxTeX = Number.isInteger(mx) ? `${mx}` : `\\frac{${ex.ax + ex.bx}}{2}`;
        const myTeX = Number.isInteger(my) ? `${my}` : `\\frac{${ex.ay + ex.by}}{2}`;

        html += '<div class="step">';
        html += '<div class="step-number">1. Rappeler la formule du milieu</div>';
        html += `<div class="step-expression">` + K(`M\\left(\\frac{x_A + x_B}{2}\\,;\\,\\frac{y_A + y_B}{2}\\right)`) + `</div>`;
        html += '</div>';

        html += '<div class="step">';
        html += '<div class="step-number">2. Remplacer</div>';
        html += `<div class="step-expression">` + K(`M\\left(\\frac{${ex.ax} + ${ex.bx}}{2}\\,;\\,\\frac{${ex.ay} + ${ex.by}}{2}\\right)`) + `</div>`;
        html += '</div>';

        html += '<div class="step">';
        html += '<div class="step-number">3. Calculer</div>';
        html += `<div class="step-expression">` + K(`M\\left(\\frac{${ex.ax + ex.bx}}{2}\\,;\\,\\frac{${ex.ay + ex.by}}{2}\\right)`) + `</div>`;
        html += `<div class="step-expression">` + K(`M\\left(${mxTeX}\\,;\\,${myTeX}\\right)`) + `</div>`;
        html += '</div>';

        const mxFinal = roundDec(mx, 2);
        const myFinal = roundDec(my, 2);
        html += '<div class="result-highlight">';
        html += `<div class="final">` + K(`M(${mxFinal}\\,;\\,${myFinal})`) + `</div>`;
        html += '</div>';

    } else {
        // Trouver B sachant A et AB
        html += '<div class="step">';
        html += '<div class="step-number">1. Rappeler la relation</div>';
        html += `<div class="step-expression">` + K(`${vecTeX('AB')}${coordTeX('x_B - x_A', 'y_B - y_A')}`) + `</div>`;
        html += `<div class="step-explanation">Donc ` + K(`x_B = x_A + x_{AB}`) + ` et ` + K(`y_B = y_A + y_{AB}`) + `</div>`;
        html += '</div>';

        html += '<div class="step">';
        html += '<div class="step-number">2. Calculer</div>';
        html += `<div class="step-expression">` + K(`x_B = ${ex.ax} + (${ex.vx}) = ${ex.bx}`) + `</div>`;
        html += `<div class="step-expression">` + K(`y_B = ${ex.ay} + (${ex.vy}) = ${ex.by}`) + `</div>`;
        html += '</div>';

        html += '<div class="result-highlight">';
        html += `<div class="final">` + K(`B(${ex.bx}\\,;\\,${ex.by})`) + `</div>`;
        html += '</div>';
    }

    return html;
}

// --- Solution Norme ---
function solveNorme() {
    const ex = VecteursState.exercise;
    const sub = VecteursState.subtype_norme;
    let html = '';

    if (sub === 'norme_vecteur') {
        html += '<div class="step">';
        html += '<div class="step-number">1. Rappeler la formule de la norme</div>';
        html += `<div class="step-expression">` + K(`\\|${vecTeX('u')}\\| = \\sqrt{x^2 + y^2}`) + `</div>`;
        html += '</div>';

        html += '<div class="step">';
        html += '<div class="step-number">2. Remplacer</div>';
        html += `<div class="step-expression">` + K(`\\|${vecTeX('u')}\\| = \\sqrt{(${ex.vx})^2 + (${ex.vy})^2}`) + `</div>`;
        const x2 = ex.vx * ex.vx;
        const y2 = ex.vy * ex.vy;
        html += `<div class="step-expression">` + K(`= \\sqrt{${x2} + ${y2}}`) + `</div>`;
        html += `<div class="step-expression">` + K(`= \\sqrt{${x2 + y2}}`) + `</div>`;
        html += '</div>';

        // Simplifier la racine si possible
        const sum = x2 + y2;
        const sqrtVal = Math.sqrt(sum);
        const isExact = Number.isInteger(sqrtVal);

        html += '<div class="step">';
        html += '<div class="step-number">3. Resultat</div>';
        if (isExact) {
            html += `<div class="step-expression">` + K(`= ${sqrtVal}`) + `</div>`;
        } else {
            // Simplifier sqrt(n) = a*sqrt(b)
            const simplified = simplifySquareRoot(sum);
            if (simplified.outer > 1) {
                html += `<div class="step-expression">` + K(`= ${simplified.outer}\\sqrt{${simplified.inner}}`) + `</div>`;
            }
            html += `<div class="step-expression">` + K(`\\approx ${roundDec(sqrtVal, 2)}`) + `</div>`;
        }
        html += '</div>';

        html += '<div class="result-highlight">';
        if (isExact) {
            html += `<div class="final">` + K(`\\|${vecTeX('u')}\\| = ${sqrtVal}`) + `</div>`;
        } else {
            html += `<div class="final">` + K(`\\|${vecTeX('u')}\\| = \\sqrt{${sum}} \\approx ${roundDec(sqrtVal, 2)}`) + `</div>`;
        }
        html += '</div>';

    } else if (sub === 'distance') {
        const dx = ex.bx - ex.ax;
        const dy = ex.by - ex.ay;

        html += '<div class="step">';
        html += '<div class="step-number">1. Rappeler la formule de la distance</div>';
        html += `<div class="step-expression">` + K(`AB = \\sqrt{(x_B - x_A)^2 + (y_B - y_A)^2}`) + `</div>`;
        html += '</div>';

        html += '<div class="step">';
        html += '<div class="step-number">2. Remplacer</div>';
        html += `<div class="step-expression">` + K(`AB = \\sqrt{(${ex.bx} - (${ex.ax}))^2 + (${ex.by} - (${ex.ay}))^2}`) + `</div>`;
        html += `<div class="step-expression">` + K(`= \\sqrt{(${dx})^2 + (${dy})^2}`) + `</div>`;
        const dx2 = dx * dx;
        const dy2 = dy * dy;
        html += `<div class="step-expression">` + K(`= \\sqrt{${dx2} + ${dy2}}`) + `</div>`;
        html += `<div class="step-expression">` + K(`= \\sqrt{${dx2 + dy2}}`) + `</div>`;
        html += '</div>';

        const sum = dx2 + dy2;
        const dist = roundDec(Math.sqrt(sum), 2);
        const isExact = Number.isInteger(Math.sqrt(sum));

        html += '<div class="result-highlight">';
        if (isExact) {
            html += `<div class="final">` + K(`AB = ${Math.sqrt(sum)}`) + `</div>`;
        } else {
            html += `<div class="final">` + K(`AB = \\sqrt{${sum}} \\approx ${dist}`) + `</div>`;
        }
        html += '</div>';

    } else {
        // Vecteur unitaire
        html += '<div class="step">';
        html += '<div class="step-number">1. Calculer la norme</div>';
        const x2 = ex.vx * ex.vx;
        const y2 = ex.vy * ex.vy;
        const sum = x2 + y2;
        html += `<div class="step-expression">` + K(`\\|${vecTeX('u')}\\| = \\sqrt{(${ex.vx})^2 + (${ex.vy})^2} = \\sqrt{${sum}}`) + `</div>`;
        const normeVal = roundDec(ex.norme, 4);
        html += `<div class="step-expression">` + K(`\\approx ${normeVal}`) + `</div>`;
        html += '</div>';

        html += '<div class="step">';
        html += '<div class="step-number">2. Rappeler la formule du vecteur unitaire</div>';
        html += `<div class="step-expression">` + K(`\\vec{u}_0 = \\frac{1}{\\|${vecTeX('u')}\\|} \\times ${vecTeX('u')}`) + `</div>`;
        html += '</div>';

        html += '<div class="step">';
        html += '<div class="step-number">3. Calculer</div>';
        html += `<div class="step-expression">` + K(`\\vec{u}_0 = \\frac{1}{\\sqrt{${sum}}} ${coordTeX(ex.vx, ex.vy)}`) + `</div>`;
        html += `<div class="step-expression">` + K(`\\vec{u}_0${coordTeX(`\\frac{${ex.vx}}{\\sqrt{${sum}}}`, `\\frac{${ex.vy}}{\\sqrt{${sum}}}`)}`) + `</div>`;
        const ux = roundDec(ex.ux, 4);
        const uy = roundDec(ex.uy, 4);
        html += `<div class="step-expression">` + K(`\\vec{u}_0 \\approx ${coordTeX(ux, uy)}`) + `</div>`;
        html += '</div>';

        html += '<div class="step">';
        html += '<div class="step-number">4. Verification</div>';
        const normeU0 = roundDec(Math.sqrt(ux * ux + uy * uy), 4);
        html += `<div class="step-expression">` + K(`\\|\\vec{u}_0\\| \\approx ${normeU0} \\approx 1`) + ` ✓</div>`;
        html += '</div>';

        html += '<div class="result-highlight">';
        html += `<div class="final">` + K(`\\vec{u}_0 \\approx ${coordTeX(ux, uy)}`) + `</div>`;
        html += '</div>';
    }

    return html;
}

// Simplifier sqrt(n) en a*sqrt(b)
function simplifySquareRoot(n) {
    let outer = 1;
    let inner = n;
    for (let i = 2; i * i <= inner; i++) {
        while (inner % (i * i) === 0) {
            outer *= i;
            inner /= (i * i);
        }
    }
    return { outer, inner };
}

// --- Solution Colinearite ---
function solveColinearite() {
    const ex = VecteursState.exercise;
    const sub = VecteursState.subtype_colinearite;
    let html = '';

    if (sub === 'tester') {
        html += '<div class="step">';
        html += '<div class="step-number">1. Rappeler le critere de colinearite</div>';
        html += `<div class="step-explanation">Deux vecteurs ` + K(`${vecTeX('u')}(x;y)`) + ` et ` + K(`${vecTeX('v')}(x';y')`) + ` sont colineaires si et seulement si :</div>`;
        html += `<div class="step-expression">` + K(`\\det(${vecTeX('u')}, ${vecTeX('v')}) = xy' - yx' = 0`) + `</div>`;
        html += '</div>';

        html += '<div class="step">';
        html += '<div class="step-number">2. Calculer le determinant</div>';
        html += `<div class="step-expression">` + K(`\\det(${vecTeX('u')}, ${vecTeX('v')}) = (${ex.ux}) \\times (${ex.vy}) - (${ex.uy}) \\times (${ex.vx})`) + `</div>`;
        html += `<div class="step-expression">` + K(`= ${ex.ux * ex.vy} - (${ex.uy * ex.vx})`) + `</div>`;
        html += `<div class="step-expression">` + K(`= ${ex.det}`) + `</div>`;
        html += '</div>';

        html += '<div class="step">';
        html += '<div class="step-number">3. Conclure</div>';
        if (ex.colineaires) {
            html += `<div class="step-expression">Le determinant vaut 0, donc les vecteurs sont <strong>colineaires</strong>.</div>`;
            html += `<div class="step-expression">On a ` + K(`${vecTeX('v')} = ${ex.k} \\times ${vecTeX('u')}`) + `</div>`;
        } else {
            html += `<div class="step-expression">Le determinant vaut ` + K(`${ex.det} \\neq 0`) + `, donc les vecteurs ne sont <strong>pas colineaires</strong>.</div>`;
        }
        html += '</div>';

        html += '<div class="result-highlight">';
        if (ex.colineaires) {
            html += `<div class="final">Les vecteurs sont colineaires (` + K(`${vecTeX('v')} = ${ex.k}${vecTeX('u')}`) + `)</div>`;
        } else {
            html += `<div class="final">Les vecteurs ne sont pas colineaires (det = ` + K(`${ex.det}`) + `)</div>`;
        }
        html += '</div>';

    } else {
        // Trouver k
        html += '<div class="step">';
        html += '<div class="step-number">1. Ecrire la condition de colinearite</div>';
        html += `<div class="step-expression">` + K(`\\det(${vecTeX('u')}, ${vecTeX('v')}) = 0`) + `</div>`;
        html += `<div class="step-expression">` + K(`${ex.ux} \\times k - ${ex.uy} \\times ${ex.vx} = 0`) + `</div>`;
        html += '</div>';

        html += '<div class="step">';
        html += '<div class="step-number">2. Resoudre</div>';
        html += `<div class="step-expression">` + K(`${ex.ux}k = ${ex.uy} \\times ${ex.vx}`) + `</div>`;
        html += `<div class="step-expression">` + K(`${ex.ux}k = ${ex.uy * ex.vx}`) + `</div>`;
        html += `<div class="step-expression">` + K(`k = \\frac{${ex.uy * ex.vx}}{${ex.ux}}`) + `</div>`;
        html += `<div class="step-expression">` + K(`k = ${ex.kResult}`) + `</div>`;
        html += '</div>';

        html += '<div class="result-highlight">';
        html += `<div class="final">` + K(`k = ${ex.kResult}`) + `</div>`;
        html += '</div>';
    }

    return html;
}

// --- Solution Produit scalaire ---
function solveScalaire() {
    const ex = VecteursState.exercise;
    const sub = VecteursState.subtype_scalaire;
    let html = '';

    // Etape commune : calculer le produit scalaire
    html += '<div class="step">';
    html += '<div class="step-number">1. Rappeler la formule du produit scalaire</div>';
    html += `<div class="step-expression">` + K(`${vecTeX('u')} \\cdot ${vecTeX('v')} = x_u x_v + y_u y_v`) + `</div>`;
    html += '</div>';

    html += '<div class="step">';
    html += '<div class="step-number">2. Calculer</div>';
    html += `<div class="step-expression">` + K(`${vecTeX('u')} \\cdot ${vecTeX('v')} = (${ex.ux})(${ex.vx}) + (${ex.uy})(${ex.vy})`) + `</div>`;
    html += `<div class="step-expression">` + K(`= ${ex.ux * ex.vx} + (${ex.uy * ex.vy})`) + `</div>`;
    html += `<div class="step-expression">` + K(`= ${ex.scalaire}`) + `</div>`;
    html += '</div>';

    if (sub === 'coordonnees') {
        html += '<div class="result-highlight">';
        html += `<div class="final">` + K(`${vecTeX('u')} \\cdot ${vecTeX('v')} = ${ex.scalaire}`) + `</div>`;
        html += '</div>';

    } else if (sub === 'angle') {
        html += '<div class="step">';
        html += '<div class="step-number">3. Calculer les normes</div>';
        const normeU2 = ex.ux * ex.ux + ex.uy * ex.uy;
        const normeV2 = ex.vx * ex.vx + ex.vy * ex.vy;
        html += `<div class="step-expression">` + K(`\\|${vecTeX('u')}\\| = \\sqrt{${normeU2}} \\approx ${roundDec(ex.normeU, 4)}`) + `</div>`;
        html += `<div class="step-expression">` + K(`\\|${vecTeX('v')}\\| = \\sqrt{${normeV2}} \\approx ${roundDec(ex.normeV, 4)}`) + `</div>`;
        html += '</div>';

        html += '<div class="step">';
        html += '<div class="step-number">4. Appliquer la formule de l\'angle</div>';
        html += `<div class="step-expression">` + K(`\\cos(\\theta) = \\frac{${vecTeX('u')} \\cdot ${vecTeX('v')}}{\\|${vecTeX('u')}\\| \\times \\|${vecTeX('v')}\\|}`) + `</div>`;
        html += `<div class="step-expression">` + K(`= \\frac{${ex.scalaire}}{${roundDec(ex.normeU, 4)} \\times ${roundDec(ex.normeV, 4)}}`) + `</div>`;
        html += `<div class="step-expression">` + K(`\\approx ${roundDec(ex.cosAngle, 4)}`) + `</div>`;
        html += '</div>';

        html += '<div class="step">';
        html += '<div class="step-number">5. Trouver l\'angle</div>';
        html += `<div class="step-expression">` + K(`\\theta = \\arccos(${roundDec(ex.cosAngle, 4)})`) + `</div>`;
        html += `<div class="step-expression">` + K(`\\theta \\approx ${roundDec(ex.angle, 1)}°`) + `</div>`;
        html += '</div>';

        html += '<div class="result-highlight">';
        html += `<div class="final">` + K(`\\theta \\approx ${roundDec(ex.angle, 1)}°`) + `</div>`;
        html += '</div>';

    } else {
        // Orthogonalite
        html += '<div class="step">';
        html += '<div class="step-number">3. Conclure</div>';
        html += `<div class="step-explanation">Deux vecteurs sont orthogonaux si et seulement si leur produit scalaire est nul.</div>`;
        if (ex.orthogonaux) {
            html += `<div class="step-expression">` + K(`${vecTeX('u')} \\cdot ${vecTeX('v')} = 0`) + `, donc les vecteurs sont <strong>orthogonaux</strong>. ✓</div>`;
        } else {
            html += `<div class="step-expression">` + K(`${vecTeX('u')} \\cdot ${vecTeX('v')} = ${ex.scalaire} \\neq 0`) + `, donc les vecteurs ne sont <strong>pas orthogonaux</strong>.</div>`;
        }
        html += '</div>';

        html += '<div class="result-highlight">';
        if (ex.orthogonaux) {
            html += `<div class="final">Les vecteurs sont orthogonaux ` + K(`(${vecTeX('u')} \\perp ${vecTeX('v')})`) + `</div>`;
        } else {
            html += `<div class="final">Les vecteurs ne sont pas orthogonaux ` + K(`(${vecTeX('u')} \\cdot ${vecTeX('v')} = ${ex.scalaire})`) + `</div>`;
        }
        html += '</div>';
    }

    return html;
}

// --- Solution Operations ---
function solveOperations() {
    const ex = VecteursState.exercise;
    const sub = VecteursState.subtype_operations;
    let html = '';

    if (sub === 'somme') {
        html += '<div class="step">';
        html += '<div class="step-number">1. Rappeler la regle</div>';
        if (ex.op === '+') {
            html += `<div class="step-expression">` + K(`${vecTeX('u')} + ${vecTeX('v')} = ${coordTeX('x_u + x_v', 'y_u + y_v')}`) + `</div>`;
        } else {
            html += `<div class="step-expression">` + K(`${vecTeX('u')} - ${vecTeX('v')} = ${coordTeX('x_u - x_v', 'y_u - y_v')}`) + `</div>`;
        }
        html += '</div>';

        html += '<div class="step">';
        html += '<div class="step-number">2. Calculer</div>';
        if (ex.op === '+') {
            html += `<div class="step-expression">` + K(`${vecTeX('u')} + ${vecTeX('v')} = ${coordTeX(`${ex.ux} + (${ex.vx})`, `${ex.uy} + (${ex.vy})`)}`) + `</div>`;
        } else {
            html += `<div class="step-expression">` + K(`${vecTeX('u')} - ${vecTeX('v')} = ${coordTeX(`${ex.ux} - (${ex.vx})`, `${ex.uy} - (${ex.vy})`)}`) + `</div>`;
        }
        html += `<div class="step-expression">` + K(`= ${coordTeX(ex.rx, ex.ry)}`) + `</div>`;
        html += '</div>';

        html += '<div class="result-highlight">';
        html += `<div class="final">` + K(`${vecTeX('u')} ${ex.op} ${vecTeX('v')} = ${coordTeX(ex.rx, ex.ry)}`) + `</div>`;
        html += '</div>';

    } else {
        // Combinaison lineaire
        const aStr = ex.a === 1 ? '' : ex.a === -1 ? '-' : `${ex.a}`;
        const bSign = ex.b >= 0 ? '+' : '-';
        const bAbs = Math.abs(ex.b) === 1 ? '' : `${Math.abs(ex.b)}`;
        const exprTeX = `${aStr}${vecTeX('u')} ${bSign} ${bAbs}${vecTeX('v')}`;

        html += '<div class="step">';
        html += '<div class="step-number">1. Rappeler la regle</div>';
        html += `<div class="step-expression">` + K(`a${vecTeX('u')} + b${vecTeX('v')} = ${coordTeX('a \\cdot x_u + b \\cdot x_v', 'a \\cdot y_u + b \\cdot y_v')}`) + `</div>`;
        html += '</div>';

        html += '<div class="step">';
        html += '<div class="step-number">2. Calculer chaque composante</div>';
        html += `<div class="step-expression">` + K(`${ex.a} \\times ${vecTeX('u')} = ${ex.a} \\times ${coordTeX(ex.ux, ex.uy)} = ${coordTeX(ex.a * ex.ux, ex.a * ex.uy)}`) + `</div>`;
        html += `<div class="step-expression">` + K(`${ex.b} \\times ${vecTeX('v')} = ${ex.b} \\times ${coordTeX(ex.vx, ex.vy)} = ${coordTeX(ex.b * ex.vx, ex.b * ex.vy)}`) + `</div>`;
        html += '</div>';

        html += '<div class="step">';
        html += '<div class="step-number">3. Additionner</div>';
        html += `<div class="step-expression">` + K(`${exprTeX} = ${coordTeX(`${ex.a * ex.ux} + (${ex.b * ex.vx})`, `${ex.a * ex.uy} + (${ex.b * ex.vy})`)}`) + `</div>`;
        html += `<div class="step-expression">` + K(`= ${coordTeX(ex.rx, ex.ry)}`) + `</div>`;
        html += '</div>';

        html += '<div class="result-highlight">';
        html += `<div class="final">` + K(`${exprTeX} = ${coordTeX(ex.rx, ex.ry)}`) + `</div>`;
        html += '</div>';
    }

    return html;
}

// ========================================
// Initialisation au chargement
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    initVecteursPage();
});
