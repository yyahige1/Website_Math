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
    if (m === 0) {
        rhs = `${p}`;
    } else if (m === 1) {
        rhs = 'x';
    } else if (m === -1) {
        rhs = '-x';
    } else {
        rhs = `${m}x`;
    }
    if (m !== 0 && p !== 0) {
        if (p > 0) rhs += ` + ${p}`;
        else rhs += ` - ${Math.abs(p)}`;
    } else if (m === 0) {
        rhs = `${p}`;
    }
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

// Formate equation cercle en LaTeX: (x-a)^2 + (y-b)^2 = r^2
function eqCercleTeX(a, b, r) {
    let xPart = a === 0 ? 'x^2' : (a > 0 ? `(x - ${a})^2` : `(x + ${Math.abs(a)})^2`);
    let yPart = b === 0 ? 'y^2' : (b > 0 ? `(y - ${b})^2` : `(y + ${Math.abs(b)})^2`);
    return `${xPart} + ${yPart} = ${r * r}`;
}

// Formate une fraction LaTeX (simplifie si denominateur = 1)
function fracTeX(num, den) {
    if (den === 1) return `${num}`;
    if (num === 0) return '0';
    return `\\dfrac{${num}}{${den}}`;
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
        ex.m = rint(-4, 4, [0]);
        ex.mx = rint(-5, 5);
        ex.my = rint(-8, 8);
        ex.p = ex.my - ex.m * ex.mx;
    } else if (sub === 'cartesienne') {
        ex.a = rint(-4, 4, [0]);
        ex.b = rint(-4, 4, [0]);
        ex.c = rint(-10, 10);
        const g1 = gcdLocal(ex.a, ex.b);
        ex.m_num = -ex.a / g1;
        ex.m_den = ex.b / g1;
        if (ex.m_den < 0) { ex.m_num = -ex.m_num; ex.m_den = -ex.m_den; }
        const g2 = gcdLocal(ex.c, ex.b);
        ex.p_num = -ex.c / g2;
        ex.p_den = ex.b / g2;
        if (ex.p_den < 0) { ex.p_num = -ex.p_num; ex.p_den = -ex.p_den; }
    } else {
        ex.ax = rint(-6, 6);
        ex.ay = rint(-6, 6);
        do {
            ex.bx = rint(-6, 6);
            ex.by = rint(-6, 6);
        } while (ex.bx === ex.ax);
        const dx = ex.bx - ex.ax;
        const dy = ex.by - ex.ay;
        const g = gcdLocal(dy, dx);
        ex.m_num = dy / g;
        ex.m_den = dx / g;
        if (ex.m_den < 0) { ex.m_num = -ex.m_num; ex.m_den = -ex.m_den; }
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
    } else if (sub === 'centre_rayon') {
        // Donner equation, trouver centre et rayon
    } else {
        // position: donner un point M, determiner sa position par rapport au cercle
        const pos = pick(['interieur', 'sur', 'exterieur']);
        ex.position = pos;
        if (pos === 'interieur') {
            const angle = Math.random() * 2 * Math.PI;
            const dist = Math.random() * (ex.r - 0.5);
            ex.mx = ex.cx + Math.round(dist * Math.cos(angle));
            ex.my = ex.cy + Math.round(dist * Math.sin(angle));
            const d2 = (ex.mx - ex.cx) ** 2 + (ex.my - ex.cy) ** 2;
            if (d2 >= ex.r * ex.r) ex.position = 'exterieur';
        } else if (pos === 'sur') {
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
                ex.mx = ex.cx + ex.r;
                ex.my = ex.cy;
            }
        } else {
            ex.mx = ex.cx + ex.r + rint(1, 4);
            ex.my = ex.cy + rint(-3, 3);
        }
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
        ex.k = pick([-3, -2, -1, 2, 3, 0.5, -0.5]);
        if (Number.isInteger(ex.k)) {
            ex.qx = ex.k * ex.px;
            ex.qy = ex.k * ex.py;
        } else {
            ex.px = rint(-6, 6, [0]) * 2;
            ex.py = rint(-6, 6, [0]) * 2;
            ex.qx = ex.k * ex.px;
            ex.qy = ex.k * ex.py;
        }
    }

    GeoAnaState.exercise = ex;
}

// ========================================
// Affichage de l'exercice (HTML + KaTeX inline)
// ========================================

function updateExerciseDisplay() {
    const type = GeoAnaState.currentType;
    const sub = GeoAnaState['subtype_' + type];
    const ex = GeoAnaState.exercise;
    let display = '';

    if (type === 'droites') {
        if (sub === 'reduite') {
            display = `<p>Le point ${K(`M(${ex.mx}\\,;\\,${ex.my})`)} est sur la droite de pente ${K(`m = ${ex.m}`)}.</p>`;
            display += `<p>Trouver l'equation ${K('y = mx + p')} de cette droite.</p>`;
        } else if (sub === 'cartesienne') {
            display = `<p>Droite d'equation : ${K(eqCartTeX(ex.a, ex.b, ex.c))}</p>`;
            display += `<p>Mettre sous la forme ${K('y = mx + p')}.</p>`;
        } else {
            display = `<p>${K(`A(${ex.ax}\\,;\\,${ex.ay})`)} et ${K(`B(${ex.bx}\\,;\\,${ex.by})`)}</p>`;
            display += `<p>Trouver l'equation de la droite ${K('(AB)')}.</p>`;
        }
    } else if (type === 'cercles') {
        if (sub === 'equation') {
            display = `<p>Cercle de centre ${K(`\\Omega(${ex.cx}\\,;\\,${ex.cy})`)} et de rayon ${K(`r = ${ex.r}`)}.</p>`;
            display += `<p>Ecrire l'equation de ce cercle.</p>`;
        } else if (sub === 'centre_rayon') {
            display = `<p>${K(eqCercleTeX(ex.cx, ex.cy, ex.r))}</p>`;
            display += `<p>Trouver le centre et le rayon de ce cercle.</p>`;
        } else {
            display = `<p>Cercle ${K('\\mathcal{C}')} : ${K(eqCercleTeX(ex.cx, ex.cy, ex.r))}</p>`;
            display += `<p>Point ${K(`M(${ex.mx}\\,;\\,${ex.my})`)}.</p>`;
            display += `<p>Determiner la position de ${K('M')} par rapport a ${K('\\mathcal{C}')}.</p>`;
        }
    } else if (type === 'distance') {
        if (sub === 'point_point') {
            display = `<p>${K(`A(${ex.ax}\\,;\\,${ex.ay})`)} et ${K(`B(${ex.bx}\\,;\\,${ex.by})`)}</p>`;
            display += `<p>Calculer la distance ${K('AB')}.</p>`;
        } else {
            display = `<p>Droite ${K('d')} : ${K(eqCartTeX(ex.a, ex.b, ex.c))}</p>`;
            display += `<p>Point ${K(`M(${ex.mx}\\,;\\,${ex.my})`)}</p>`;
            display += `<p>Calculer la distance de ${K('M')} a la droite ${K('d')}.</p>`;
        }
    } else {
        if (sub === 'symetrie_axe') {
            const axisName = { 'Ox': "l'axe des abscisses (Ox)", 'Oy': "l'axe des ordonnees (Oy)", 'yx': "la droite y = x", 'y_neg_x': "la droite y = -x" };
            display = `<p>${K(`A(${ex.px}\\,;\\,${ex.py})`)}</p>`;
            display += `<p>Trouver le symetrique ${K("A'")} de ${K('A')} par rapport a ${axisName[ex.axis]}.</p>`;
        } else if (sub === 'rotation_90') {
            display = `<p>${K(`A(${ex.px}\\,;\\,${ex.py})`)}</p>`;
            display += `<p>Image de ${K('A')} par la rotation de centre ${K('O')} et d'angle ${K(`${ex.angle}^\\circ`)}.</p>`;
        } else {
            const kDisplay = Number.isInteger(ex.k) ? ex.k : (ex.k > 0 ? '\\frac{1}{2}' : '-\\frac{1}{2}');
            display = `<p>${K(`A(${ex.px}\\,;\\,${ex.py})`)}</p>`;
            display += `<p>Homothetie de centre ${K('O')} et de rapport ${K(`k = ${kDisplay}`)}.</p>`;
            display += `<p>Trouver l'image ${K("A'")} de ${K('A')}.</p>`;
        }
    }

    $('expressionDisplay').innerHTML = display;
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

    // Ajouter le graphique
    html += '<div class="graph-container">';
    html += '<h4>Representation graphique</h4>';
    html += '<canvas id="geoCanvas" width="420" height="420"></canvas>';
    html += '</div>';

    $('stepsContainer').innerHTML = html;
    showSolution('solutionDiv');

    // Dessiner le graphique apres insertion dans le DOM
    requestAnimationFrame(() => {
        if (type === 'droites') drawDroitesGraph(ex, sub);
        else if (type === 'cercles') drawCerclesGraph(ex, sub);
        else if (type === 'distance') drawDistanceGraph(ex, sub);
        else if (type === 'transformations') drawTransformationsGraph(ex, sub);
    });
}

// --- Correction Droites ---
function solveDroites(ex, sub) {
    let html = '';

    if (sub === 'reduite') {
        html += '<div class="formula-box">' + K('y = mx + p') + '</div>';

        html += step('Substitution du point M',
            `${ex.my} = ${ex.m} \\times ${ex.mx} + p`,
            `Le point <span class="color-coef">${K(`M(${ex.mx}\\,;\\,${ex.my})`)}</span> est sur la droite, donc ses coordonnees verifient l'equation.`);

        const mx = ex.m * ex.mx;
        html += step('Calcul de p',
            `p = ${ex.my} - ${mx >= 0 ? mx : `(${mx})`} = ${ex.p}`,
            `On isole <span class="color-solution">p</span> : ${K(`p = ${ex.my} - ${mx} = ${ex.p}`)}.`);

        html += resultBlock(eqReduiteTeX(ex.m, ex.p),
            `Pente : <span class="color-coef">m = ${ex.m}</span>. Ordonnee a l'origine : <span class="color-solution">p = ${ex.p}</span>.`);

    } else if (sub === 'cartesienne') {
        html += step('Equation de depart',
            eqCartTeX(ex.a, ex.b, ex.c),
            `On isole ${K('y')} pour mettre sous forme reduite.`);

        html += step('Isoler le terme en y',
            `${ex.b}y = ${-ex.a}x ${ex.c > 0 ? '- ' + ex.c : '+ ' + Math.abs(ex.c)}`,
            `On deplace <span class="color-coef">${K(`${ex.a}x`)}</span> et la constante <span class="color-coef">${ex.c}</span>.`);

        const mTeX = fracTeX(ex.m_num, ex.m_den);
        const pTeX = fracTeX(ex.p_num, ex.p_den);

        html += step('Diviser par le coefficient de y',
            `y = ${mTeX}\\, x + ${pTeX}`,
            `On divise tout par <span class="color-coef">${ex.b}</span>.`);

        html += resultBlock(`y = ${mTeX}\\, x + ${pTeX}`,
            `Pente : <span class="color-coef">m = ${K(mTeX)}</span>. Ordonnee a l'origine : <span class="color-solution">p = ${K(pTeX)}</span>.`);

    } else {
        // deux_points
        html += '<div class="formula-box">' + K('m = \\dfrac{y_B - y_A}{x_B - x_A}') + '</div>';

        html += step('Calcul de la pente',
            `m = \\dfrac{${ex.by} - (${ex.ay})}{${ex.bx} - (${ex.ax})} = \\dfrac{${ex.by - ex.ay}}{${ex.bx - ex.ax}}`,
            `A partir de <span class="color-coef">${K(`A(${ex.ax}\\,;\\,${ex.ay})`)}</span> et <span class="color-coef">${K(`B(${ex.bx}\\,;\\,${ex.by})`)}</span>.`);

        const mTeX = fracTeX(ex.m_num, ex.m_den);

        html += step('Simplification de la pente',
            `m = ${mTeX}`,
            '');

        html += step("Calcul de l'ordonnee a l'origine",
            `p = y_A - m \\cdot x_A = ${ex.ay} - \\left(${mTeX}\\right) \\times ${ex.ax}`,
            `On utilise le point ${K(`A(${ex.ax}\\,;\\,${ex.ay})`)} pour trouver <span class="color-solution">p</span>.`);

        const pTeX = fracTeX(ex.p_num, ex.p_den);

        html += step('Valeur de p',
            `p = ${pTeX}`,
            '');

        html += resultBlock(`y = ${mTeX}\\, x + ${pTeX}`,
            `Equation de la droite <span class="color-solution">${K('(AB)')}</span>.`);
    }

    return html;
}

// --- Correction Cercles ---
function solveCercles(ex, sub) {
    let html = '';

    if (sub === 'equation') {
        html += '<div class="formula-box">' + K('(x - a)^2 + (y - b)^2 = r^2') + '</div>';

        html += step('Application numerique',
            eqCercleTeX(ex.cx, ex.cy, ex.r),
            `Centre <span class="color-coef">${K(`\\Omega(${ex.cx}\\,;\\,${ex.cy})`)}</span>, rayon <span class="color-coef">${K(`r = ${ex.r}`)}</span>, donc ${K(`r^2 = ${ex.r * ex.r}`)}.`);

        html += resultBlock(eqCercleTeX(ex.cx, ex.cy, ex.r), '');

    } else if (sub === 'centre_rayon') {
        html += '<div class="formula-box">' + K('(x - a)^2 + (y - b)^2 = R^2') + '</div>';

        html += step('Identification de la forme standard',
            eqCercleTeX(ex.cx, ex.cy, ex.r),
            `On identifie les valeurs de <span class="color-coef">a</span>, <span class="color-coef">b</span> et ${K('R^2')} dans l'equation.`);

        html += step('Lecture du centre et du rayon',
            `\\Omega(${ex.cx}\\,;\\,${ex.cy}), \\quad R^2 = ${ex.r * ex.r}`,
            `<span class="color-coef">a = ${ex.cx}</span>, <span class="color-coef">b = ${ex.cy}</span>, ${K(`R^2 = ${ex.r * ex.r}`)}.`);

        html += step('Calcul du rayon',
            `r = \\sqrt{${ex.r * ex.r}} = ${ex.r}`,
            '');

        html += resultBlock(
            `\\Omega(${ex.cx}\\,;\\,${ex.cy}), \\quad r = ${ex.r}`,
            `Centre : <span class="color-solution">${K(`\\Omega(${ex.cx}\\,;\\,${ex.cy})`)}</span>. Rayon : <span class="color-solution">${K(`r = ${ex.r}`)}</span>.`);

    } else {
        // position
        html += step('Calcul de la distance entre M et le centre',
            `d(\\Omega, M) = \\sqrt{(${ex.mx} - (${ex.cx}))^2 + (${ex.my} - (${ex.cy}))^2}`,
            `Centre <span class="color-coef">${K(`\\Omega(${ex.cx}\\,;\\,${ex.cy})`)}</span>, point <span class="color-coef">${K(`M(${ex.mx}\\,;\\,${ex.my})`)}</span>.`);

        const dx = ex.mx - ex.cx;
        const dy = ex.my - ex.cy;
        html += step('Calcul du radicande',
            `d(\\Omega, M) = \\sqrt{(${dx})^2 + (${dy})^2} = \\sqrt{${dx*dx} + ${dy*dy}} = \\sqrt{${ex.dist2}}`,
            '');

        const distVal = roundDec(Math.sqrt(ex.dist2), 3);
        const isPerfect = Number.isInteger(Math.sqrt(ex.dist2));
        const distDisplay = isPerfect ? Math.sqrt(ex.dist2) : `\\sqrt{${ex.dist2}} \\approx ${distVal}`;

        html += step('Comparaison avec le rayon',
            `d(\\Omega, M) = ${distDisplay} \\quad \\text{et} \\quad r = ${ex.r}`,
            '');

        let conclusion, expl, conclusionClass;
        if (ex.dist2 < ex.r * ex.r) {
            conclusion = `d(\\Omega, M) < r`;
            expl = `La distance est <span class="case-positive">strictement inferieure</span> au rayon : <span class="color-solution">M est a l'interieur du cercle</span>.`;
            conclusionClass = 'case-positive';
        } else if (ex.dist2 === ex.r * ex.r) {
            conclusion = `d(\\Omega, M) = r`;
            expl = `La distance est <span class="case-zero">egale</span> au rayon : <span class="color-solution">M appartient au cercle</span>.`;
            conclusionClass = 'case-zero';
        } else {
            conclusion = `d(\\Omega, M) > r`;
            expl = `La distance est <span class="case-negative">superieure</span> au rayon : <span class="color-solution">M est a l'exterieur du cercle</span>.`;
            conclusionClass = 'case-negative';
        }

        html += resultBlock(conclusion, expl);
    }

    return html;
}

// --- Correction Distance ---
function solveDistance(ex, sub) {
    let html = '';

    if (sub === 'point_point') {
        html += '<div class="formula-box">' + K('AB = \\sqrt{(x_B - x_A)^2 + (y_B - y_A)^2}') + '</div>';

        html += step('Application numerique',
            `AB = \\sqrt{(${ex.bx} - (${ex.ax}))^2 + (${ex.by} - (${ex.ay}))^2}`,
            `Avec <span class="color-coef">${K(`A(${ex.ax}\\,;\\,${ex.ay})`)}</span> et <span class="color-coef">${K(`B(${ex.bx}\\,;\\,${ex.by})`)}</span>.`);

        html += step('Calcul des differences',
            `AB = \\sqrt{(${ex.dx})^2 + (${ex.dy})^2} = \\sqrt{${ex.dx * ex.dx} + ${ex.dy * ex.dy}}`,
            '');

        html += step('Calcul du radicande',
            `AB = \\sqrt{${ex.dist2}}`,
            '');

        const isPerf = Number.isInteger(Math.sqrt(ex.dist2));
        if (isPerf) {
            html += resultBlock(`AB = ${Math.sqrt(ex.dist2)}`, '');
        } else {
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
        html += '<div class="formula-box">' + K('d(M, d) = \\dfrac{|ax_M + by_M + c|}{\\sqrt{a^2 + b^2}}') + '</div>';

        html += step('Identification des coefficients',
            `a = ${ex.a},\\quad b = ${ex.b},\\quad c = ${ex.c}`,
            `Droite <span class="color-coef">${K(eqCartTeX(ex.a, ex.b, ex.c))}</span> et point <span class="color-coef">${K(`M(${ex.mx}\\,;\\,${ex.my})`)}</span>.`);

        const num_val = ex.a * ex.mx + ex.b * ex.my + ex.c;
        html += step('Calcul du numerateur',
            `|${ex.a} \\times (${ex.mx}) + ${ex.b} \\times (${ex.my}) + (${ex.c})| = |${num_val}| = ${Math.abs(num_val)}`,
            '');

        html += step('Calcul du denominateur',
            `\\sqrt{(${ex.a})^2 + (${ex.b})^2} = \\sqrt{${ex.a*ex.a} + ${ex.b*ex.b}} = \\sqrt{${ex.den2}}`,
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
            'Ox': { name: "l'axe (Ox)", rule: "(x, y) \\mapsto (x, -y)", ruletxt: "La symetrie par rapport a <span class=\"color-coef\">(Ox)</span> conserve x et change le signe de y." },
            'Oy': { name: "l'axe (Oy)", rule: "(x, y) \\mapsto (-x, y)", ruletxt: "La symetrie par rapport a <span class=\"color-coef\">(Oy)</span> change le signe de x et conserve y." },
            'yx': { name: "la droite y = x", rule: "(x, y) \\mapsto (y, x)", ruletxt: "La symetrie par rapport a <span class=\"color-coef\">y = x</span> echange les coordonnees." },
            'y_neg_x': { name: "la droite y = -x", rule: "(x, y) \\mapsto (-y, -x)", ruletxt: "La symetrie par rapport a <span class=\"color-coef\">y = -x</span> echange et change les signes." }
        };
        const info = axisMap[ex.axis];

        html += '<div class="formula-box">' + K(info.rule) + '</div>';

        html += step('Regle de symetrie',
            info.rule,
            info.ruletxt);

        html += step('Application au point A',
            `A(${ex.px}\\,;\\,${ex.py}) \\implies A'(${ex.qx}\\,;\\,${ex.qy})`,
            '');

        html += resultBlock(`A'(${ex.qx}\\,;\\,${ex.qy})`,
            `Symetrique de <span class="color-coef">${K(`A(${ex.px}\\,;\\,${ex.py})`)}</span> par rapport a ${info.name}.`);

    } else if (sub === 'rotation_90') {
        const ruleMap = {
            90: { rule: "(x, y) \\mapsto (-y, x)", expl: "Rotation de <span class=\"color-coef\">90°</span> (sens direct) : on echange x et y puis on change le signe de la nouvelle abscisse." },
            180: { rule: "(x, y) \\mapsto (-x, -y)", expl: "Rotation de <span class=\"color-coef\">180°</span> : on change les signes des deux coordonnees." },
            270: { rule: "(x, y) \\mapsto (y, -x)", expl: "Rotation de <span class=\"color-coef\">270°</span> (sens direct) = rotation de 90° dans le sens indirect." }
        };
        const info = ruleMap[ex.angle];

        html += '<div class="formula-box">' + K(info.rule) + '</div>';

        html += step(`Regle pour une rotation de ${ex.angle}° autour de O`,
            info.rule,
            info.expl);

        html += step('Application au point A',
            `A(${ex.px}\\,;\\,${ex.py}) \\implies A'(${ex.qx}\\,;\\,${ex.qy})`,
            '');

        html += resultBlock(`A'(${ex.qx}\\,;\\,${ex.qy})`,
            `Image de <span class="color-coef">${K(`A(${ex.px}\\,;\\,${ex.py})`)}</span> par la rotation de ${ex.angle}° autour de l'origine.`);

    } else {
        // homothetie
        const kDisplay = Number.isInteger(ex.k) ? ex.k : (ex.k > 0 ? '\\frac{1}{2}' : '-\\frac{1}{2}');

        html += '<div class="formula-box">' + K(`(x, y) \\mapsto (kx,\\, ky)`) + '</div>';

        html += step("Regle de l'homothetie de centre O et de rapport k",
            `(x, y) \\mapsto (kx, ky)`,
            `Chaque coordonnee est multipliee par le rapport <span class="color-coef">${K(`k = ${kDisplay}`)}</span>.`);

        html += step('Application numerique',
            `A'\\left(${kDisplay} \\times (${ex.px})\\,;\\,${kDisplay} \\times (${ex.py})\\right)`,
            '');

        html += resultBlock(`A'(${ex.qx}\\,;\\,${ex.qy})`,
            `Image de <span class="color-coef">${K(`A(${ex.px}\\,;\\,${ex.py})`)}</span> par l'homothetie de centre O et de rapport ${K(`k = ${kDisplay}`)}.`);
    }

    return html;
}

// ========================================
// Graphiques
// ========================================

function computeGraphBounds(points, margin) {
    margin = margin || 2;
    let xMin = Infinity, xMax = -Infinity, yMin = Infinity, yMax = -Infinity;
    for (const p of points) {
        if (p.x < xMin) xMin = p.x;
        if (p.x > xMax) xMax = p.x;
        if (p.y < yMin) yMin = p.y;
        if (p.y > yMax) yMax = p.y;
    }
    xMin = Math.floor(xMin - margin);
    xMax = Math.ceil(xMax + margin);
    yMin = Math.floor(yMin - margin);
    yMax = Math.ceil(yMax + margin);

    // Rendre le viewport a peu pres carre
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

    return { xMin, xMax, yMin, yMax };
}

function createGeoGraph(points, margin) {
    const bounds = computeGraphBounds(points, margin || 2);
    const graph = new GraphCanvas('geoCanvas', {
        width: 420, height: 420, padding: 40,
        xMin: bounds.xMin, xMax: bounds.xMax,
        yMin: bounds.yMin, yMax: bounds.yMax
    });
    graph.clear();
    graph.drawGrid();
    graph.drawAxes();
    graph.drawTicks();
    return graph;
}

function drawDroitesGraph(ex, sub) {
    let points = [];

    if (sub === 'reduite') {
        const m = ex.m, p = ex.p;
        points.push({ x: ex.mx, y: ex.my });
        points.push({ x: 0, y: p });
        points.push({ x: -5, y: m * (-5) + p });
        points.push({ x: 5, y: m * 5 + p });

        const graph = createGeoGraph(points, 2);
        graph.drawLineEquation(m, p, '#3498db', 2.5);
        graph.drawPoint(ex.mx, ex.my, '#e74c3c', 6, `M(${ex.mx};${ex.my})`);
        graph.drawPoint(0, p, '#27ae60', 5, `(0;${p})`);

    } else if (sub === 'cartesienne') {
        if (ex.b !== 0) {
            const m = -ex.a / ex.b, p = -ex.c / ex.b;
            points.push({ x: -5, y: m * (-5) + p });
            points.push({ x: 5, y: m * 5 + p });
            points.push({ x: 0, y: p });
        } else {
            const xv = -ex.c / ex.a;
            points.push({ x: xv, y: -5 });
            points.push({ x: xv, y: 5 });
        }

        const graph = createGeoGraph(points, 2);
        graph.drawLineCartesian(ex.a, ex.b, ex.c, '#3498db', 2.5);

    } else {
        // deux_points
        const m = ex.m_num / ex.m_den;
        const p = ex.p_num / ex.p_den;
        points.push({ x: ex.ax, y: ex.ay });
        points.push({ x: ex.bx, y: ex.by });
        points.push({ x: -5, y: m * (-5) + p });
        points.push({ x: 5, y: m * 5 + p });

        const graph = createGeoGraph(points, 2);
        graph.drawLineEquation(m, p, '#3498db', 2.5);
        graph.drawPoint(ex.ax, ex.ay, '#e74c3c', 6, `A(${ex.ax};${ex.ay})`);
        graph.drawPoint(ex.bx, ex.by, '#27ae60', 6, `B(${ex.bx};${ex.by})`);
    }
}

function drawCerclesGraph(ex, sub) {
    let points = [];
    points.push({ x: ex.cx - ex.r, y: ex.cy });
    points.push({ x: ex.cx + ex.r, y: ex.cy });
    points.push({ x: ex.cx, y: ex.cy - ex.r });
    points.push({ x: ex.cx, y: ex.cy + ex.r });

    if (sub === 'position' && ex.mx !== undefined) {
        points.push({ x: ex.mx, y: ex.my });
    }

    const graph = createGeoGraph(points, 2);
    graph.drawCircle(ex.cx, ex.cy, ex.r, '#3498db', 2.5);
    graph.drawPoint(ex.cx, ex.cy, '#9b59b6', 5, `\u03A9(${ex.cx};${ex.cy})`);

    if (sub === 'position') {
        const mColor = ex.dist2 < ex.r * ex.r ? '#27ae60' :
                       ex.dist2 === ex.r * ex.r ? '#3498db' : '#e74c3c';
        graph.drawPoint(ex.mx, ex.my, mColor, 6, `M(${ex.mx};${ex.my})`);
        graph.drawDashedLine(ex.cx, ex.cy, ex.mx, ex.my, 'rgba(150,150,150,0.6)');
    }
}

function drawDistanceGraph(ex, sub) {
    let points = [];

    if (sub === 'point_point') {
        points.push({ x: ex.ax, y: ex.ay });
        points.push({ x: ex.bx, y: ex.by });

        const graph = createGeoGraph(points, 2);
        graph.drawPoint(ex.ax, ex.ay, '#3498db', 6, `A(${ex.ax};${ex.ay})`);
        graph.drawPoint(ex.bx, ex.by, '#e74c3c', 6, `B(${ex.bx};${ex.by})`);
        graph.drawDashedLine(ex.ax, ex.ay, ex.bx, ex.by, '#27ae60', 2);
    } else {
        points.push({ x: ex.mx, y: ex.my });
        if (ex.b !== 0) {
            for (let xi = -6; xi <= 6; xi += 3) {
                points.push({ x: xi, y: (-ex.a * xi - ex.c) / ex.b });
            }
        } else {
            const xv = -ex.c / ex.a;
            points.push({ x: xv, y: -6 });
            points.push({ x: xv, y: 6 });
        }

        const graph = createGeoGraph(points, 2);
        graph.drawLineCartesian(ex.a, ex.b, ex.c, '#3498db', 2);
        graph.drawPoint(ex.mx, ex.my, '#e74c3c', 6, `M(${ex.mx};${ex.my})`);
    }
}

function drawTransformationsGraph(ex, sub) {
    let points = [
        { x: ex.px, y: ex.py },
        { x: ex.qx, y: ex.qy },
        { x: 0, y: 0 }
    ];

    const graph = createGeoGraph(points, 2);

    // Tracer l'axe de symetrie
    if (sub === 'symetrie_axe') {
        if (ex.axis === 'Ox') {
            graph.drawLineEquation(0, 0, '#9b59b6', 1.5);
        } else if (ex.axis === 'Oy') {
            graph.drawLineCartesian(1, 0, 0, '#9b59b6', 1.5);
        } else if (ex.axis === 'yx') {
            graph.drawLineEquation(1, 0, '#9b59b6', 1.5);
        } else {
            graph.drawLineEquation(-1, 0, '#9b59b6', 1.5);
        }
    }

    graph.drawPoint(ex.px, ex.py, '#3498db', 6, `A(${ex.px};${ex.py})`);
    graph.drawPoint(ex.qx, ex.qy, '#27ae60', 6, `A'(${ex.qx};${ex.qy})`);
    graph.drawDashedLine(ex.px, ex.py, ex.qx, ex.qy, 'rgba(150,150,150,0.5)');
    graph.drawPoint(0, 0, '#333', 4, 'O');
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
    let html = '<div class="final-result">';
    html += K(tex);
    html += '</div>';
    if (expl) html += `<div class="step-explanation" style="margin-top:8px; text-align:center;">${expl}</div>`;
    return html;
}

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', () => {
    initGeoAnaPage();
});
