/* ========================================
   GEOMETRIE-ANALYTIQUE.JS - Geometrie analytique plane
   ======================================== */

/**
 * Etat du module Geometrie analytique
 */
const GeoAnaState = {
    currentType: 'droites',

    subtype_droites: 'reduite',
    subtype_cercles: 'equation',
    subtype_distance: 'point_point',
    subtype_transformations: 'symetrie_axe',

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

function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function roundDec(x, d) {
    const f = Math.pow(10, d);
    return Math.round(x * f) / f;
}

function gcdLocal(a, b) {
    a = Math.abs(a); b = Math.abs(b);
    while (b) { [a, b] = [b, a % b]; }
    return a || 1;
}

// Formate un coefficient pour l'affichage (evite 1x, -1x)
function fmtCoef(c, variable) {
    if (c === 0) return '';
    if (c === 1) return variable;
    if (c === -1) return '-' + variable;
    return `${c}${variable}`;
}

// Formate un terme dans une somme (avec signe)
function fmtTerm(c, variable, first) {
    if (c === 0) return '';
    const abs = Math.abs(c);
    const sign = c > 0 ? '+' : '-';
    let term;
    if (variable) {
        if (abs === 1) term = variable;
        else term = `${abs}${variable}`;
    } else {
        term = `${abs}`;
    }
    if (first) return c < 0 ? `-${term}` : term;
    return `${sign} ${term}`;
}

// Formate equation reduite en LaTeX: y = mx + p
function eqReduiteTeX(m, p) {
    let rhs = '';
    // Terme mx
    if (m === 0) {
        rhs = `${p}`;
    } else if (m === 1) {
        rhs = 'x';
    } else if (m === -1) {
        rhs = '-x';
    } else {
        rhs = `${m}x`;
    }
    // Terme +p
    if (m !== 0 && p !== 0) {
        if (p > 0) rhs += ` + ${p}`;
        else rhs += ` - ${Math.abs(p)}`;
    } else if (m === 0) {
        rhs = `${p}`;
    }
    // Cas m!=0 et p==0
    return `y = ${rhs}`;
}

// Formate equation cartesienne en LaTeX: ax + by + c = 0
function eqCartTeX(a, b, c) {
    let parts = [];
    if (a !== 0) {
        if (a === 1) parts.push('x');
        else if (a === -1) parts.push('-x');
        else parts.push(`${a}x`);
    }
    if (b !== 0) {
        if (parts.length === 0) {
            if (b === 1) parts.push('y');
            else if (b === -1) parts.push('-y');
            else parts.push(`${b}y`);
        } else {
            if (b === 1) parts.push('+ y');
            else if (b === -1) parts.push('- y');
            else if (b > 0) parts.push(`+ ${b}y`);
            else parts.push(`- ${Math.abs(b)}y`);
        }
    }
    if (c !== 0) {
        if (parts.length === 0) parts.push(`${c}`);
        else if (c > 0) parts.push(`+ ${c}`);
        else parts.push(`- ${Math.abs(c)}`);
    }
    if (parts.length === 0) parts.push('0');
    return parts.join(' ') + ' = 0';
}

// Formate equation cercle en LaTeX: (x-a)² + (y-b)² = r²
function eqCercleTeX(a, b, r) {
    let xPart = a === 0 ? 'x^2' : (a > 0 ? `(x - ${a})^2` : `(x + ${Math.abs(a)})^2`);
    let yPart = b === 0 ? 'y^2' : (b > 0 ? `(y - ${b})^2` : `(y + ${Math.abs(b)})^2`);
    return `${xPart} + ${yPart} = ${r * r}`;
}

// ========================================
// Initialisation
// ========================================

function initGeoAnaPage() {
    $('exDroites').innerHTML = K('y = mx + p');
    $('exCercles').innerHTML = K('(x-a)^2 + (y-b)^2 = r^2');
    $('exDistance').innerHTML = K('d(A,B)');
    $('exTransfo').innerHTML = K("A \\mapsto A'");

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
            GeoAnaState.currentType = button.dataset.type;

            document.querySelectorAll('[id$="Section"]').forEach(section => {
                section.style.display = 'none';
            });

            const sectionMap = {
                'droites': 'droitesSection',
                'cercles': 'cerclesSection',
                'distance': 'distanceSection',
                'transformations': 'transformationsSection'
            };
            const sectionId = sectionMap[GeoAnaState.currentType];
            if (sectionId) $(sectionId).style.display = 'block';

            generateNewExercise();
            updateExerciseDisplay();
            hideSolution('solutionDiv');
        });
    });
}

function setupInputHandlers() {
    const selects = [
        'subtype_droites', 'subtype_cercles',
        'subtype_distance', 'subtype_transformations'
    ];
    selects.forEach(id => {
        const el = $(id);
        if (el) {
            el.addEventListener('change', () => {
                GeoAnaState[id] = el.value;
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
        solveGeoAna();
    });
}

// ========================================
// Generation des exercices
// ========================================

function generateNewExercise() {
    const type = GeoAnaState.currentType;
    switch (type) {
        case 'droites': generateDroites(); break;
        case 'cercles': generateCercles(); break;
        case 'distance': generateDistance(); break;
        case 'transformations': generateTransformations(); break;
    }
}

// --- Droites ---
function generateDroites() {
    const sub = GeoAnaState.subtype_droites;
    const ex = {};

    if (sub === 'reduite') {
        // Donner un point M et une pente m, trouver l'equation y = mx + p
        ex.m = rint(-4, 4, [0]);
        ex.mx = rint(-5, 5);
        ex.my = rint(-8, 8);
        // p = y - m*x
        ex.p = ex.my - ex.m * ex.mx;
    } else if (sub === 'cartesienne') {
        // Donner ax + by + c = 0 (b != 0), mettre sous forme reduite
        ex.a = rint(-4, 4, [0]);
        ex.b = rint(-4, 4, [0]);
        ex.c = rint(-10, 10);
        // Forme reduite: y = (-a/b)x + (-c/b)
        // Simplifier la fraction
        const g1 = gcdLocal(ex.a, ex.b);
        ex.m_num = -ex.a / g1;
        ex.m_den = ex.b / g1;
        // Normaliser: denominateur positif
        if (ex.m_den < 0) { ex.m_num = -ex.m_num; ex.m_den = -ex.m_den; }
        const g2 = gcdLocal(ex.c, ex.b);
        ex.p_num = -ex.c / g2;
        ex.p_den = ex.b / g2;
        if (ex.p_den < 0) { ex.p_num = -ex.p_num; ex.p_den = -ex.p_den; }
    } else {
        // deux_points: donner A et B, trouver equation
        ex.ax = rint(-6, 6);
        ex.ay = rint(-6, 6);
        do {
            ex.bx = rint(-6, 6);
            ex.by = rint(-6, 6);
        } while (ex.bx === ex.ax); // eviter droite verticale
        // Pente
        const dx = ex.bx - ex.ax;
        const dy = ex.by - ex.ay;
        const g = gcdLocal(dy, dx);
        ex.m_num = dy / g;
        ex.m_den = dx / g;
        if (ex.m_den < 0) { ex.m_num = -ex.m_num; ex.m_den = -ex.m_den; }
        // Ordonnee a l'origine: p = ay - m*ax = ay - (m_num/m_den)*ax
        // p = (ay*m_den - m_num*ax) / m_den
        ex.p_num = ex.ay * ex.m_den - ex.m_num * ex.ax;
        ex.p_den = ex.m_den;
        const g2 = gcdLocal(Math.abs(ex.p_num), Math.abs(ex.p_den));
        ex.p_num = ex.p_num / g2;
        ex.p_den = ex.p_den / g2;
        if (ex.p_den < 0) { ex.p_num = -ex.p_num; ex.p_den = -ex.p_den; }
    }

    GeoAnaState.exercise = ex;
}

// --- Cercles ---
function generateCercles() {
    const sub = GeoAnaState.subtype_cercles;
    const ex = {};

    ex.cx = rint(-5, 5);
    ex.cy = rint(-5, 5);
    ex.r = rint(1, 6);

    if (sub === 'equation') {
        // Donner centre et rayon, ecrire l'equation
        // Rien de plus a generer
    } else if (sub === 'centre_rayon') {
        // Donner equation, trouver centre et rayon
        // Utilise les memes ex.cx, ex.cy, ex.r
    } else {
        // position: donner un point M, determiner sa position par rapport au cercle
        // Generer un point qui peut etre interieur, sur le cercle, ou exterieur
        const pos = pick(['interieur', 'sur', 'exterieur']);
        ex.position = pos;
        if (pos === 'interieur') {
            // d(O, M) < r : choisir des coordonnees telles que dist < r
            // Point aleatoire proche du centre
            const angle = Math.random() * 2 * Math.PI;
            const dist = Math.random() * (ex.r - 0.5);
            ex.mx = ex.cx + Math.round(dist * Math.cos(angle));
            ex.my = ex.cy + Math.round(dist * Math.sin(angle));
            // Verifier
            const d2 = (ex.mx - ex.cx) ** 2 + (ex.my - ex.cy) ** 2;
            if (d2 >= ex.r * ex.r) ex.position = 'exterieur';
        } else if (pos === 'sur') {
            // Choisir un angle tel que le point est sur le cercle avec coordonnees entieres
            // Triplets pythagoriciens pour r
            const pythagorean = [[3,4,5],[5,12,13],[8,15,17]];
            const trip = pick(pythagorean.filter(t => t[2] === ex.r || t[2] <= ex.r + 2));
            if (trip && trip[2] === ex.r) {
                const signX = pick([-1, 1]);
                const signY = pick([-1, 1]);
                ex.mx = ex.cx + signX * trip[0];
                ex.my = ex.cy + signY * trip[1];
                const d2 = (ex.mx - ex.cx) ** 2 + (ex.my - ex.cy) ** 2;
                if (d2 !== ex.r * ex.r) ex.position = 'exterieur';
            } else {
                // Fallback: placer sur l'axe
                ex.mx = ex.cx + ex.r;
                ex.my = ex.cy;
            }
        } else {
            // exterieur
            ex.mx = ex.cx + ex.r + rint(1, 4);
            ex.my = ex.cy + rint(-3, 3);
        }
        // Recalculer distance reelle
        ex.dist2 = (ex.mx - ex.cx) ** 2 + (ex.my - ex.cy) ** 2;
        ex.dist_num = Math.sqrt(ex.dist2);
    }

    GeoAnaState.exercise = ex;
}

// --- Distance ---
function generateDistance() {
    const sub = GeoAnaState.subtype_distance;
    const ex = {};

    if (sub === 'point_point') {
        ex.ax = rint(-6, 6);
        ex.ay = rint(-6, 6);
        do {
            ex.bx = rint(-6, 6);
            ex.by = rint(-6, 6);
        } while (ex.bx === ex.ax && ex.by === ex.ay);
        ex.dx = ex.bx - ex.ax;
        ex.dy = ex.by - ex.ay;
        ex.dist2 = ex.dx * ex.dx + ex.dy * ex.dy;
        ex.dist = Math.sqrt(ex.dist2);
    } else {
        // point_droite: d(M, droite ax+by+c=0)
        ex.a = rint(-3, 3, [0]);
        ex.b = rint(-3, 3, [0]);
        ex.c = rint(-8, 8);
        ex.mx = rint(-5, 5);
        ex.my = rint(-5, 5);
        ex.num = Math.abs(ex.a * ex.mx + ex.b * ex.my + ex.c);
        ex.den2 = ex.a * ex.a + ex.b * ex.b;
        ex.den = Math.sqrt(ex.den2);
        ex.dist = ex.num / ex.den;
    }

    GeoAnaState.exercise = ex;
}

// --- Transformations ---
function generateTransformations() {
    const sub = GeoAnaState.subtype_transformations;
    const ex = {};

    ex.px = rint(-6, 6, [0]);
    ex.py = rint(-6, 6, [0]);

    if (sub === 'symetrie_axe') {
        ex.axis = pick(['Ox', 'Oy', 'yx', 'y_neg_x']);
        if (ex.axis === 'Ox') {
            ex.qx = ex.px; ex.qy = -ex.py;
        } else if (ex.axis === 'Oy') {
            ex.qx = -ex.px; ex.qy = ex.py;
        } else if (ex.axis === 'yx') {
            ex.qx = ex.py; ex.qy = ex.px;
        } else {
            ex.qx = -ex.py; ex.qy = -ex.px;
        }
    } else if (sub === 'rotation_90') {
        ex.angle = pick([90, 180, 270]);
        if (ex.angle === 90) {
            ex.qx = -ex.py; ex.qy = ex.px;
        } else if (ex.angle === 180) {
            ex.qx = -ex.px; ex.qy = -ex.py;
        } else {
            ex.qx = ex.py; ex.qy = -ex.px;
        }
    } else {
        // homothetie
        ex.k = pick([-3, -2, -1, 2, 3, 0.5, -0.5]);
        if (Number.isInteger(ex.k)) {
            ex.qx = ex.k * ex.px;
            ex.qy = ex.k * ex.py;
        } else {
            // k = 1/2 ou -1/2
            ex.px = rint(-6, 6, [0]) * 2; // pair pour eviter les decimaux
            ex.py = rint(-6, 6, [0]) * 2;
            ex.qx = ex.k * ex.px;
            ex.qy = ex.k * ex.py;
        }
    }

    GeoAnaState.exercise = ex;
}

// ========================================
// Affichage de l'exercice
// ========================================

function updateExerciseDisplay() {
    const type = GeoAnaState.currentType;
    const sub = GeoAnaState['subtype_' + type];
    const ex = GeoAnaState.exercise;
    let tex = '';

    if (type === 'droites') {
        if (sub === 'reduite') {
            tex = `\\text{Le point } M(${ex.mx}\\,;\\,${ex.my}) \\text{ est sur la droite de pente } m = ${ex.m}.`;
            tex += `\\\\[6pt] \\text{Trouver l'equation } y = mx + p \\text{ de cette droite.}`;
        } else if (sub === 'cartesienne') {
            tex = `\\text{Droite d'equation : } ${eqCartTeX(ex.a, ex.b, ex.c)}`;
            tex += `\\\\[6pt] \\text{Mettre sous la forme } y = mx + p.`;
        } else {
            tex = `A(${ex.ax}\\,;\\,${ex.ay}) \\text{ et } B(${ex.bx}\\,;\\,${ex.by})`;
            tex += `\\\\[6pt] \\text{Trouver l'equation de la droite } (AB).`;
        }
    } else if (type === 'cercles') {
        if (sub === 'equation') {
            tex = `\\text{Cercle de centre } \\Omega(${ex.cx}\\,;\\,${ex.cy}) \\text{ et de rayon } r = ${ex.r}.`;
            tex += `\\\\[6pt] \\text{Ecrire l'equation de ce cercle.}`;
        } else if (sub === 'centre_rayon') {
            tex = eqCercleTeX(ex.cx, ex.cy, ex.r);
            tex += `\\\\[6pt] \\text{Trouver le centre et le rayon de ce cercle.}`;
        } else {
            tex = `\\text{Cercle } \\mathcal{C} \\text{ : } ${eqCercleTeX(ex.cx, ex.cy, ex.r)}`;
            tex += `\\\\[6pt] \\text{Point } M(${ex.mx}\\,;\\,${ex.my}).`;
            tex += `\\\\[4pt] \\text{Determiner la position de } M \\text{ par rapport a } \\mathcal{C}.`;
        }
    } else if (type === 'distance') {
        if (sub === 'point_point') {
            tex = `A(${ex.ax}\\,;\\,${ex.ay}) \\text{ et } B(${ex.bx}\\,;\\,${ex.by})`;
            tex += `\\\\[6pt] \\text{Calculer la distance } AB.`;
        } else {
            tex = `\\text{Droite } d : ${eqCartTeX(ex.a, ex.b, ex.c)}`;
            tex += `\\\\[6pt] \\text{Point } M(${ex.mx}\\,;\\,${ex.my})`;
            tex += `\\\\[4pt] \\text{Calculer la distance de } M \\text{ a la droite } d.`;
        }
    } else {
        if (sub === 'symetrie_axe') {
            const axisName = { 'Ox': "l'axe des abscisses (Ox)", 'Oy': "l'axe des ordonnees (Oy)", 'yx': "la droite y = x", 'y_neg_x': "la droite y = -x" };
            tex = `A(${ex.px}\\,;\\,${ex.py})`;
            tex += `\\\\[6pt] \\text{Trouver le symetrique } A' \\text{ de } A \\text{ par rapport a }`;
            tex += `\\\\[2pt] ${axisName[ex.axis]}.`;
        } else if (sub === 'rotation_90') {
            tex = `A(${ex.px}\\,;\\,${ex.py})`;
            tex += `\\\\[6pt] \\text{Image de } A \\text{ par la rotation de centre } O \\text{ et d'angle } ${ex.angle}^\\circ.`;
        } else {
            const kDisplay = Number.isInteger(ex.k) ? ex.k : (ex.k > 0 ? '\\frac{1}{2}' : '-\\frac{1}{2}');
            tex = `A(${ex.px}\\,;\\,${ex.py})`;
            tex += `\\\\[6pt] \\text{Homothetie de centre } O \\text{ et de rapport } k = ${kDisplay}.`;
            tex += `\\\\[4pt] \\text{Trouver l'image } A' \\text{ de } A.`;
        }
    }

    $('expressionDisplay').innerHTML = K(tex);
}

// ========================================
// Correction
// ========================================

function solveGeoAna() {
    const type = GeoAnaState.currentType;
    const sub = GeoAnaState['subtype_' + type];
    const ex = GeoAnaState.exercise;

    let html = '';

    if (type === 'droites') {
        html = solveDroites(ex, sub);
    } else if (type === 'cercles') {
        html = solveCercles(ex, sub);
    } else if (type === 'distance') {
        html = solveDistance(ex, sub);
    } else {
        html = solveTransformations(ex, sub);
    }

    $('stepsContainer').innerHTML = html;
    showSolution('solutionDiv');
}

// --- Correction Droites ---
function solveDroites(ex, sub) {
    let html = '';

    if (sub === 'reduite') {
        html += step('Rappel de la forme reduite',
            'y = mx + p',
            'L\'equation reduite d\'une droite a pour coefficient directeur m (pente) et ordonnee a l\'origine p.');

        html += step('Substitution du point M',
            `${ex.my} = ${ex.m} \\times ${ex.mx} + p`,
            `Le point M(${ex.mx}\\,;\\,${ex.my}) est sur la droite, donc ses coordonnees verifient l\'equation.`);

        const mx = ex.m * ex.mx;
        html += step('Calcul de p',
            `p = ${ex.my} - (${mx}) = ${ex.p}`,
            '');

        html += resultBlock(eqReduiteTeX(ex.m, ex.p), `Coefficient directeur : m = ${ex.m}. Ordonnee a l\'origine : p = ${ex.p}.`);

    } else if (sub === 'cartesienne') {
        html += step('Equation de depart',
            eqCartTeX(ex.a, ex.b, ex.c),
            'On isole y en passant les autres termes de l\'autre cote.');

        html += step('Isoler le terme en y',
            `${ex.b}y = ${-ex.a}x ${ex.c > 0 ? '- ' + ex.c : '+ ' + Math.abs(ex.c)}`,
            `On deplace le terme ${ex.a}x et la constante ${ex.c}.`);

        let mTeX;
        if (ex.m_den === 1) mTeX = `${ex.m_num}`;
        else if (ex.m_num === 0) mTeX = '0';
        else mTeX = `\\dfrac{${ex.m_num}}{${ex.m_den}}`;

        let pTeX;
        if (ex.p_den === 1) pTeX = `${ex.p_num}`;
        else if (ex.p_num === 0) pTeX = '0';
        else pTeX = `\\dfrac{${ex.p_num}}{${ex.p_den}}`;

        html += step('Diviser par le coefficient de y',
            `y = ${mTeX} x + (${pTeX})`,
            `On divise tout par ${ex.b}.`);

        html += resultBlock(`y = ${mTeX} x + ${pTeX}`,
            `Pente : m = ${mTeX}. Ordonnee a l\'origine : p = ${pTeX}.`);

    } else {
        // deux_points
        html += step('Calcul de la pente (coefficient directeur)',
            `m = \\dfrac{y_B - y_A}{x_B - x_A} = \\dfrac{${ex.by} - (${ex.ay})}{${ex.bx} - (${ex.ax})} = \\dfrac{${ex.by - ex.ay}}{${ex.bx - ex.ax}}`,
            'La pente est le rapport de l\'accroissement des ordonnees sur l\'accroissement des abscisses.');

        let mTeX;
        if (ex.m_den === 1) mTeX = `${ex.m_num}`;
        else mTeX = `\\dfrac{${ex.m_num}}{${ex.m_den}}`;

        html += step('Simplification de la pente',
            `m = ${mTeX}`,
            '');

        html += step('Calcul de l\'ordonnee a l\'origine',
            `p = y_A - m \\cdot x_A = ${ex.ay} - \\left(${mTeX}\\right) \\times ${ex.ax}`,
            `On utilise le point A(${ex.ax}\\,;\\,${ex.ay}) pour trouver p.`);

        let pTeX;
        if (ex.p_den === 1) pTeX = `${ex.p_num}`;
        else pTeX = `\\dfrac{${ex.p_num}}{${ex.p_den}}`;

        html += step('Valeur de p',
            `p = ${pTeX}`,
            '');

        html += resultBlock(`y = ${mTeX} x + ${pTeX}`,
            `Equation de la droite (AB).`);
    }

    return html;
}

// --- Correction Cercles ---
function solveCercles(ex, sub) {
    let html = '';

    if (sub === 'equation') {
        html += step('Formule de l\'equation du cercle',
            '(x - a)^2 + (y - b)^2 = r^2',
            'Un cercle de centre Omega(a\\,;\\,b) et de rayon r a pour equation reduite ci-dessus.');

        html += step('Application numerique',
            eqCercleTeX(ex.cx, ex.cy, ex.r),
            `Centre Omega(${ex.cx}\\,;\\,${ex.cy}), rayon r = ${ex.r}, donc r^2 = ${ex.r * ex.r}.`);

        html += resultBlock(eqCercleTeX(ex.cx, ex.cy, ex.r), '');

    } else if (sub === 'centre_rayon') {
        html += step('Identification de la forme standard',
            '(x - a)^2 + (y - b)^2 = R^2',
            'On identifie les valeurs de a, b et R^2 dans l\'equation donnee.');

        html += step('Lecture du centre et du rayon',
            eqCercleTeX(ex.cx, ex.cy, ex.r),
            `a = ${ex.cx}, b = ${ex.cy}, R^2 = ${ex.r * ex.r}`);

        html += step('Calcul du rayon',
            `r = \\sqrt{${ex.r * ex.r}} = ${ex.r}`,
            '');

        html += resultBlock(
            `\\Omega(${ex.cx}\\,;\\,${ex.cy}), \\quad r = ${ex.r}`,
            `Centre : Omega(${ex.cx}\\,;\\,${ex.cy}). Rayon : r = ${ex.r}.`);

    } else {
        // position
        html += step('Calcul de la distance entre M et le centre',
            `d(\\Omega, M) = \\sqrt{(${ex.mx} - ${ex.cx})^2 + (${ex.my} - ${ex.cy})^2}`,
            `Centre Omega(${ex.cx}\\,;\\,${ex.cy}), point M(${ex.mx}\\,;\\,${ex.my}).`);

        const dx = ex.mx - ex.cx;
        const dy = ex.my - ex.cy;
        html += step('Calcul du radicande',
            `d(\\Omega, M) = \\sqrt{(${dx})^2 + (${dy})^2} = \\sqrt{${dx*dx + dy*dy}}`,
            '');

        const distVal = roundDec(Math.sqrt(ex.dist2), 3);
        html += step('Comparaison avec le rayon',
            `d(\\Omega, M) = \\sqrt{${ex.dist2}} \\approx ${distVal} \\quad \\text{et} \\quad r = ${ex.r}`,
            '');

        let conclusion, expl;
        if (ex.dist2 < ex.r * ex.r) {
            conclusion = `d(\\Omega, M) < r \\implies M \\text{ est interieur au cercle}`;
            expl = `Puisque la distance de M au centre est strictement inferieure au rayon, M est a l\'interieur du cercle.`;
        } else if (ex.dist2 === ex.r * ex.r) {
            conclusion = `d(\\Omega, M) = r \\implies M \\text{ est sur le cercle}`;
            expl = `La distance de M au centre est exactement egale au rayon : M appartient au cercle.`;
        } else {
            conclusion = `d(\\Omega, M) > r \\implies M \\text{ est exterieur au cercle}`;
            expl = `La distance de M au centre est superieure au rayon : M est a l\'exterieur du cercle.`;
        }

        html += resultBlock(conclusion, expl);
    }

    return html;
}

// --- Correction Distance ---
function solveDistance(ex, sub) {
    let html = '';

    if (sub === 'point_point') {
        html += step('Formule de la distance',
            'AB = \\sqrt{(x_B - x_A)^2 + (y_B - y_A)^2}',
            'La distance entre deux points A(xA\\,;\\,yA) et B(xB\\,;\\,yB) est donnee par cette formule (theoreme de Pythagore).');

        html += step('Application numerique',
            `AB = \\sqrt{(${ex.bx} - ${ex.ax})^2 + (${ex.by} - ${ex.ay})^2} = \\sqrt{${ex.dx}^2 + ${ex.dy}^2}`,
            '');

        html += step('Calcul du radicande',
            `AB = \\sqrt{${ex.dx * ex.dx} + ${ex.dy * ex.dy}} = \\sqrt{${ex.dist2}}`,
            '');

        // Simplifier la racine si possible
        const isPerf = Number.isInteger(Math.sqrt(ex.dist2));
        if (isPerf) {
            html += resultBlock(`AB = ${Math.sqrt(ex.dist2)}`, '');
        } else {
            // Chercher facteur carre
            let factor = 1;
            for (let k = Math.floor(Math.sqrt(ex.dist2)); k >= 2; k--) {
                if (ex.dist2 % (k * k) === 0) { factor = k; break; }
            }
            if (factor > 1) {
                html += resultBlock(`AB = ${factor}\\sqrt{${ex.dist2 / (factor * factor)}} \\approx ${roundDec(ex.dist, 3)}`, '');
            } else {
                html += resultBlock(`AB = \\sqrt{${ex.dist2}} \\approx ${roundDec(ex.dist, 3)}`, '');
            }
        }

    } else {
        // point_droite
        html += step('Formule de la distance point-droite',
            'd(M, d) = \\dfrac{|a \\cdot x_M + b \\cdot y_M + c|}{\\sqrt{a^2 + b^2}}',
            `Pour la droite d'equation ax + by + c = 0 et le point M(xM\\,;\\,yM).`);

        html += step('Identification des coefficients',
            `a = ${ex.a},\\quad b = ${ex.b},\\quad c = ${ex.c},\\quad M(${ex.mx}\\,;\\,${ex.my})`,
            '');

        const num_val = ex.a * ex.mx + ex.b * ex.my + ex.c;
        html += step('Calcul du numerateur',
            `|${ex.a} \\times ${ex.mx} + ${ex.b} \\times ${ex.my} + (${ex.c})| = |${num_val}| = ${Math.abs(num_val)}`,
            '');

        html += step('Calcul du denominateur',
            `\\sqrt{${ex.a}^2 + ${ex.b}^2} = \\sqrt{${ex.a*ex.a} + ${ex.b*ex.b}} = \\sqrt{${ex.den2}}`,
            '');

        const isPerf = Number.isInteger(Math.sqrt(ex.den2));
        let denTeX = isPerf ? `${Math.sqrt(ex.den2)}` : `\\sqrt{${ex.den2}}`;

        html += resultBlock(`d(M, d) = \\dfrac{${Math.abs(num_val)}}{${denTeX}} \\approx ${roundDec(ex.dist, 3)}`, '');
    }

    return html;
}

// --- Correction Transformations ---
function solveTransformations(ex, sub) {
    let html = '';

    if (sub === 'symetrie_axe') {
        const axisMap = {
            'Ox': { name: "l\'axe des abscisses (Ox)", rule: "(x, y) \\mapsto (x, -y)", ruletxt: "La symetrie par rapport a Ox conserve x et change le signe de y." },
            'Oy': { name: "l\'axe des ordonnees (Oy)", rule: "(x, y) \\mapsto (-x, y)", ruletxt: "La symetrie par rapport a Oy change le signe de x et conserve y." },
            'yx': { name: "la droite y = x", rule: "(x, y) \\mapsto (y, x)", ruletxt: "La symetrie par rapport a y = x echange les coordonnees." },
            'y_neg_x': { name: "la droite y = -x", rule: "(x, y) \\mapsto (-y, -x)", ruletxt: "La symetrie par rapport a y = -x echange les coordonnees en changeant leurs signes." }
        };
        const info = axisMap[ex.axis];

        html += step('Regle de symetrie',
            info.rule,
            info.ruletxt);

        html += step('Application au point A',
            `A(${ex.px}\\,;\\,${ex.py}) \\implies A'(${ex.qx}\\,;\\,${ex.qy})`,
            '');

        html += resultBlock(`A'(${ex.qx}\\,;\\,${ex.qy})`, `Symetrique de A par rapport a ${info.name}.`);

    } else if (sub === 'rotation_90') {
        const ruleMap = {
            90: { rule: "(x, y) \\mapsto (-y, x)", expl: "Rotation de 90° (sens direct) : on echange x et y puis on change le signe de la nouvelle abscisse." },
            180: { rule: "(x, y) \\mapsto (-x, -y)", expl: "Rotation de 180° : on change les signes des deux coordonnees." },
            270: { rule: "(x, y) \\mapsto (y, -x)", expl: "Rotation de 270° (sens direct) = rotation de 90° dans le sens indirect." }
        };
        const info = ruleMap[ex.angle];

        html += step(`Regle pour une rotation de ${ex.angle}° autour de O`,
            info.rule,
            info.expl);

        html += step('Application au point A',
            `A(${ex.px}\\,;\\,${ex.py}) \\implies A'(${ex.qx}\\,;\\,${ex.qy})`,
            '');

        html += resultBlock(`A'(${ex.qx}\\,;\\,${ex.qy})`, `Image de A par la rotation de ${ex.angle}° autour de l\'origine.`);

    } else {
        // homothetie
        const kDisplay = Number.isInteger(ex.k) ? ex.k : (ex.k > 0 ? '\\frac{1}{2}' : '-\\frac{1}{2}');

        html += step('Regle de l\'homothetie de centre O et de rapport k',
            `(x, y) \\mapsto (kx, ky)`,
            'Chaque coordonnee est multipliee par le rapport k.');

        html += step('Application numerique',
            `A'\\left(${kDisplay} \\times ${ex.px}\\,;\\,${kDisplay} \\times ${ex.py}\\right)`,
            '');

        html += resultBlock(`A'(${ex.qx}\\,;\\,${ex.qy})`,
            `Image de A(${ex.px}\\,;\\,${ex.py}) par l\'homothetie de centre O et de rapport k = ${kDisplay}.`);
    }

    return html;
}

// ========================================
// Helpers HTML
// ========================================

function step(title, tex, expl) {
    let html = '<div class="step">';
    if (title) html += `<div class="step-number">${title}</div>`;
    if (tex) html += `<div class="step-expression">${K(tex)}</div>`;
    if (expl) html += `<div class="step-explanation">${expl}</div>`;
    html += '</div>';
    return html;
}

function resultBlock(tex, expl) {
    let html = '<div class="result-highlight">';
    html += `<div class="final">${K(tex)}</div>`;
    if (expl) html += `<div class="step-explanation" style="margin-top:8px">${expl}</div>`;
    html += '</div>';
    return html;
}

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', () => {
    initGeoAnaPage();
});
