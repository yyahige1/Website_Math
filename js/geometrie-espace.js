/* ========================================
   GEOMETRIE-ESPACE.JS - Geometrie dans l'espace (Terminale)
   ======================================== */

/**
 * Etat du module Geometrie dans l'espace
 */
const GeoEspState = {
    currentType: 'coordonnees',

    subtype_coordonnees: 'distance',
    subtype_droites_plans: 'equation_plan',
    subtype_positions: 'parallelisme',
    subtype_produit_scalaire: 'calcul',
    subtype_sections: 'cube',

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

// Formate un point 3D en LaTeX
function pt3(name, x, y, z) {
    return `${name}(${x}\\,;\\,${y}\\,;\\,${z})`;
}

// Formate un vecteur 3D en LaTeX (colonne)
function vec3(x, y, z) {
    return `\\begin{pmatrix} ${x} \\\\ ${y} \\\\ ${z} \\end{pmatrix}`;
}

// Formate un vecteur avec fleche
function vecName(name) {
    return `\\vec{${name}}`;
}

// Formate un terme de somme (avec signe)
function fmtTerm(c, variable, first) {
    if (c === 0) return first ? '0' : '';
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

// ========================================
// Initialisation
// ========================================

function initGeoEspPage() {
    $('exCoord').innerHTML = K('d(A,B) \\in \\mathbb{R}^3');
    $('exDroitesPlan').innerHTML = K('ax + by + cz = d');
    $('exPositions').innerHTML = K('\\vec{u} \\parallel \\vec{v}\\,?');
    $('exScalaire').innerHTML = K('\\vec{u} \\cdot \\vec{v}');
    $('exSections').innerHTML = K('\\text{Section}');

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
            GeoEspState.currentType = button.dataset.type;

            document.querySelectorAll('[id$="Section"]').forEach(section => {
                section.style.display = 'none';
            });

            const sectionMap = {
                'coordonnees': 'coordonneesSection',
                'droites_plans': 'droites_plansSection',
                'positions': 'positionsSection',
                'produit_scalaire': 'produit_scalaireSection',
                'sections': 'sectionsSection'
            };
            const sectionId = sectionMap[GeoEspState.currentType];
            if (sectionId) $(sectionId).style.display = 'block';

            generateNewExercise();
            updateExerciseDisplay();
            hideSolution('solutionDiv');
        });
    });
}

function setupInputHandlers() {
    const selects = [
        'subtype_coordonnees', 'subtype_droites_plans',
        'subtype_positions', 'subtype_produit_scalaire', 'subtype_sections'
    ];
    selects.forEach(id => {
        const el = $(id);
        if (el) {
            el.addEventListener('change', () => {
                GeoEspState[id] = el.value;
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
        solveGeoEsp();
    });
}

// ========================================
// Generation des exercices
// ========================================

function generateNewExercise() {
    const type = GeoEspState.currentType;
    switch (type) {
        case 'coordonnees': generateCoordonnees3D(); break;
        case 'droites_plans': generateDroitesPlan(); break;
        case 'positions': generatePositions(); break;
        case 'produit_scalaire': generateProduitScalaire(); break;
        case 'sections': generateSections(); break;
    }
}

// --- Coordonnees 3D ---
function generateCoordonnees3D() {
    const ex = {
        ax: rint(-5, 5), ay: rint(-5, 5), az: rint(-5, 5),
        bx: rint(-5, 5), by: rint(-5, 5), bz: rint(-5, 5)
    };
    ex.vx = ex.bx - ex.ax;
    ex.vy = ex.by - ex.ay;
    ex.vz = ex.bz - ex.az;
    ex.dist2 = ex.vx * ex.vx + ex.vy * ex.vy + ex.vz * ex.vz;
    ex.dist = Math.sqrt(ex.dist2);
    ex.mx = (ex.ax + ex.bx) / 2;
    ex.my = (ex.ay + ex.by) / 2;
    ex.mz = (ex.az + ex.bz) / 2;
    GeoEspState.exercise = ex;
}

// --- Droites et plans ---
function generateDroitesPlan() {
    const sub = GeoEspState.subtype_droites_plans;
    const ex = {};

    if (sub === 'equation_plan') {
        // Vecteur normal n(a, b, c) et point M(x0, y0, z0) sur le plan
        ex.na = rint(-3, 3, [0]);
        ex.nb = rint(-3, 3, [0]);
        ex.nc = rint(-3, 3, [0]);
        ex.x0 = rint(-4, 4);
        ex.y0 = rint(-4, 4);
        ex.z0 = rint(-4, 4);
        // Equation: na(x-x0) + nb(y-y0) + nc(z-z0) = 0
        // => na*x + nb*y + nc*z + d = 0 avec d = -(na*x0 + nb*y0 + nc*z0)
        ex.d = -(ex.na * ex.x0 + ex.nb * ex.y0 + ex.nc * ex.z0);
    } else {
        // droite_parametrique: point A et vecteur directeur d
        ex.ax = rint(-4, 4);
        ex.ay = rint(-4, 4);
        ex.az = rint(-4, 4);
        ex.dl = rint(-3, 3, [0]);
        ex.dm = rint(-3, 3, [0]);
        ex.dn = rint(-3, 3, [0]);
    }

    GeoEspState.exercise = ex;
}

// --- Positions relatives ---
function generatePositions() {
    const sub = GeoEspState.subtype_positions;
    const ex = {};

    if (sub === 'parallelisme') {
        // Deux vecteurs u et v - soit paralleles, soit non
        ex.ux = rint(-3, 3, [0]);
        ex.uy = rint(-3, 3, [0]);
        ex.uz = rint(-3, 3, [0]);
        ex.parallel = Math.random() > 0.5;
        if (ex.parallel) {
            const k = pick([-3, -2, 2, 3]);
            ex.vx = k * ex.ux;
            ex.vy = k * ex.uy;
            ex.vz = k * ex.uz;
            ex.k_coef = k;
        } else {
            // Vecteur non proportionnel
            do {
                ex.vx = rint(-3, 3, [0]);
                ex.vy = rint(-3, 3, [0]);
                ex.vz = rint(-3, 3, [0]);
            } while (
                ex.ux * ex.vy === ex.uy * ex.vx &&
                ex.uy * ex.vz === ex.uz * ex.vy &&
                ex.ux * ex.vz === ex.uz * ex.vx
            );
        }
    } else if (sub === 'orthogonalite') {
        // Deux vecteurs - soit orthogonaux, soit non
        ex.ux = rint(-3, 3, [0]);
        ex.uy = rint(-3, 3, [0]);
        ex.uz = rint(-3, 3, [0]);
        ex.orthogonal = Math.random() > 0.5;
        if (ex.orthogonal) {
            // Construire v orthogonal a u : u.v = 0
            // Choisir vx et vy librement, calculer vz = -(ux*vx + uy*vy)/uz (si uz != 0)
            ex.vx = rint(-3, 3, [0]);
            ex.vy = rint(-3, 3, [0]);
            if (ex.uz !== 0) {
                const dot_partial = ex.ux * ex.vx + ex.uy * ex.vy;
                if (dot_partial % ex.uz === 0) {
                    ex.vz = -dot_partial / ex.uz;
                } else {
                    // Ajuster vx pour que vz soit entier
                    ex.vx = ex.uz; ex.vy = 0;
                    ex.vz = -ex.ux; // uz*vz = -ux*uz => vz = -ux
                }
            } else {
                // uz = 0 : choisir vz libre, vx = uy, vy = -ux
                ex.vx = ex.uy; ex.vy = -ex.ux; ex.vz = rint(-3, 3);
            }
        } else {
            do {
                ex.vx = rint(-3, 3, [0]);
                ex.vy = rint(-3, 3, [0]);
                ex.vz = rint(-3, 3, [0]);
            } while (ex.ux * ex.vx + ex.uy * ex.vy + ex.uz * ex.vz === 0);
        }
        ex.dot = ex.ux * ex.vx + ex.uy * ex.vy + ex.uz * ex.vz;
    } else {
        // coplanaire: 4 points A, B, C, D
        ex.ax = rint(-4, 4); ex.ay = rint(-4, 4); ex.az = rint(-4, 4);
        ex.bx = rint(-4, 4); ex.by = rint(-4, 4); ex.bz = rint(-4, 4);
        ex.cx = rint(-4, 4); ex.cy = rint(-4, 4); ex.cz = rint(-4, 4);
        ex.coplanar = Math.random() > 0.5;

        if (ex.coplanar) {
            // D = A + s*AB + t*AC pour certains s, t
            const s = pick([1, 2, -1]);
            const t = pick([1, 2, -1]);
            ex.dx = ex.ax + s * (ex.bx - ex.ax) + t * (ex.cx - ex.ax);
            ex.dy = ex.ay + s * (ex.by - ex.ay) + t * (ex.cy - ex.ay);
            ex.dz = ex.az + s * (ex.bz - ex.az) + t * (ex.cz - ex.az);
        } else {
            do {
                ex.dx = rint(-4, 4);
                ex.dy = rint(-4, 4);
                ex.dz = rint(-4, 4);
            } while (det3(
                ex.bx - ex.ax, ex.by - ex.ay, ex.bz - ex.az,
                ex.cx - ex.ax, ex.cy - ex.ay, ex.cz - ex.az,
                ex.dx - ex.ax, ex.dy - ex.ay, ex.dz - ex.az
            ) === 0);
        }

        // Calculer le determinant
        ex.det = det3(
            ex.bx - ex.ax, ex.by - ex.ay, ex.bz - ex.az,
            ex.cx - ex.ax, ex.cy - ex.ay, ex.cz - ex.az,
            ex.dx - ex.ax, ex.dy - ex.ay, ex.dz - ex.az
        );
    }

    GeoEspState.exercise = ex;
}

// Determinant 3x3
function det3(a1, a2, a3, b1, b2, b3, c1, c2, c3) {
    return a1 * (b2 * c3 - b3 * c2)
         - a2 * (b1 * c3 - b3 * c1)
         + a3 * (b1 * c2 - b2 * c1);
}

// --- Produit scalaire ---
function generateProduitScalaire() {
    const ex = {
        ux: rint(-4, 4, [0]),
        uy: rint(-4, 4, [0]),
        uz: rint(-4, 4, [0]),
        vx: rint(-4, 4, [0]),
        vy: rint(-4, 4, [0]),
        vz: rint(-4, 4, [0])
    };
    ex.dot = ex.ux * ex.vx + ex.uy * ex.vy + ex.uz * ex.vz;
    ex.normU2 = ex.ux * ex.ux + ex.uy * ex.uy + ex.uz * ex.uz;
    ex.normV2 = ex.vx * ex.vx + ex.vy * ex.vy + ex.vz * ex.vz;
    ex.normU = Math.sqrt(ex.normU2);
    ex.normV = Math.sqrt(ex.normV2);
    GeoEspState.exercise = ex;
}

// --- Sections ---
function generateSections() {
    const sub = GeoEspState.subtype_sections;

    if (sub === 'cube') {
        // Differents types de sections dans un cube unite [0,a]^3
        const a = pick([2, 3, 4]);
        const sectionType = pick(['diagonale', 'mediane', 'hexagone']);
        GeoEspState.exercise = { a, sectionType };
    } else {
        // tetraedre regulier
        const a = pick([2, 4, 6]);
        const sectionType = pick(['milieux_aretes', 'parallele_face']);
        GeoEspState.exercise = { a, sectionType };
    }
}

// ========================================
// Affichage de l'exercice
// ========================================

function updateExerciseDisplay() {
    const type = GeoEspState.currentType;
    const sub = GeoEspState['subtype_' + type];
    const ex = GeoEspState.exercise;
    let tex = '';

    if (type === 'coordonnees') {
        const ptA = pt3('A', ex.ax, ex.ay, ex.az);
        const ptB = pt3('B', ex.bx, ex.by, ex.bz);
        if (sub === 'distance') {
            tex = `${ptA} \\quad ${ptB}`;
            tex += `\\\\[6pt] \\text{Calculer la distance } AB.`;
        } else if (sub === 'vecteur') {
            tex = `${ptA} \\quad ${ptB}`;
            tex += `\\\\[6pt] \\text{Donner les coordonnees du vecteur } \\overrightarrow{AB}.`;
        } else {
            tex = `${ptA} \\quad ${ptB}`;
            tex += `\\\\[6pt] \\text{Trouver les coordonnees du milieu } I \\text{ de } [AB].`;
        }
    } else if (type === 'droites_plans') {
        if (sub === 'equation_plan') {
            tex = `\\text{Plan passant par } M${pt3('', ex.x0, ex.y0, ex.z0)}`;
            tex += `\\\\[4pt] \\text{de vecteur normal } \\vec{n}${vec3(ex.na, ex.nb, ex.nc)}`;
            tex += `\\\\[6pt] \\text{Determiner une equation cartesienne de ce plan.}`;
        } else {
            tex = `\\text{Droite passant par } A${pt3('', ex.ax, ex.ay, ex.az)}`;
            tex += `\\\\[4pt] \\text{de vecteur directeur } \\vec{d}${vec3(ex.dl, ex.dm, ex.dn)}`;
            tex += `\\\\[6pt] \\text{Ecrire la representation parametrique de cette droite.}`;
        }
    } else if (type === 'positions') {
        if (sub === 'parallelisme') {
            tex = `\\vec{u}${vec3(ex.ux, ex.uy, ex.uz)} \\qquad \\vec{v}${vec3(ex.vx, ex.vy, ex.vz)}`;
            tex += `\\\\[6pt] \\text{Les vecteurs } \\vec{u} \\text{ et } \\vec{v} \\text{ sont-ils colineaires (paralleles) ?}`;
        } else if (sub === 'orthogonalite') {
            tex = `\\vec{u}${vec3(ex.ux, ex.uy, ex.uz)} \\qquad \\vec{v}${vec3(ex.vx, ex.vy, ex.vz)}`;
            tex += `\\\\[6pt] \\text{Les vecteurs } \\vec{u} \\text{ et } \\vec{v} \\text{ sont-ils orthogonaux ?}`;
        } else {
            tex = `A${pt3('', ex.ax, ex.ay, ex.az)}, \\; B${pt3('', ex.bx, ex.by, ex.bz)},`;
            tex += `\\\\[4pt] C${pt3('', ex.cx, ex.cy, ex.cz)}, \\; D${pt3('', ex.dx, ex.dy, ex.dz)}`;
            tex += `\\\\[6pt] \\text{Les points A, B, C, D sont-ils coplanaires ?}`;
        }
    } else if (type === 'produit_scalaire') {
        tex = `\\vec{u}${vec3(ex.ux, ex.uy, ex.uz)} \\qquad \\vec{v}${vec3(ex.vx, ex.vy, ex.vz)}`;
        if (sub === 'calcul') {
            tex += `\\\\[6pt] \\text{Calculer } \\vec{u} \\cdot \\vec{v}.`;
        } else {
            tex += `\\\\[6pt] \\text{Calculer l'angle } \\theta \\text{ entre } \\vec{u} \\text{ et } \\vec{v}.`;
        }
    } else {
        // sections
        if (sub === 'cube') {
            const sectionLabels = {
                'diagonale': 'un plan contenant une arete et un sommet non adjacent',
                'mediane': 'un plan parallele a une face',
                'hexagone': 'un plan coupant les six faces'
            };
            tex = `\\text{Cube ABCDEFGH de cote } a = ${ex.a}.`;
            tex += `\\\\[6pt] \\text{Section par } \\text{${sectionLabels[ex.sectionType]}}.`;
            tex += `\\\\[4pt] \\text{Quelle est la nature de la section ?}`;
        } else {
            const sectionLabels = {
                'milieux_aretes': 'les milieux de 3 aretes',
                'parallele_face': 'un plan parallele a une face'
            };
            tex = `\\text{Tetraedre ABCD regulier de cote } a = ${ex.a}.`;
            tex += `\\\\[6pt] \\text{Section par } \\text{${sectionLabels[ex.sectionType]}}.`;
            tex += `\\\\[4pt] \\text{Quelle est la nature de la section ?}`;
        }
    }

    $('expressionDisplay').innerHTML = K(tex);
}

// ========================================
// Correction
// ========================================

function solveGeoEsp() {
    const type = GeoEspState.currentType;
    const sub = GeoEspState['subtype_' + type];
    const ex = GeoEspState.exercise;

    let html = '';

    if (type === 'coordonnees') {
        html = solveCoordonnees3D(ex, sub);
    } else if (type === 'droites_plans') {
        html = solveDroitesPlan(ex, sub);
    } else if (type === 'positions') {
        html = solvePositions(ex, sub);
    } else if (type === 'produit_scalaire') {
        html = solveProduitScalaire(ex, sub);
    } else {
        html = solveSections(ex, sub);
    }

    $('stepsContainer').innerHTML = html;
    showSolution('solutionDiv');
}

// --- Correction Coordonnees 3D ---
function solveCoordonnees3D(ex, sub) {
    let html = '';

    if (sub === 'distance') {
        html += step('Formule de la distance en 3D',
            'AB = \\sqrt{(x_B - x_A)^2 + (y_B - y_A)^2 + (z_B - z_A)^2}',
            'Extension du theoreme de Pythagore a l\'espace a trois dimensions.');

        html += step('Application numerique',
            `AB = \\sqrt{(${ex.bx} - ${ex.ax})^2 + (${ex.by} - ${ex.ay})^2 + (${ex.bz} - ${ex.az})^2}`,
            '');

        html += step('Calcul des differences',
            `AB = \\sqrt{(${ex.vx})^2 + (${ex.vy})^2 + (${ex.vz})^2} = \\sqrt{${ex.dist2}}`,
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

    } else if (sub === 'vecteur') {
        html += step('Formule des coordonnees de AB',
            '\\overrightarrow{AB} = \\begin{pmatrix} x_B - x_A \\\\ y_B - y_A \\\\ z_B - z_A \\end{pmatrix}',
            'On soustrait les coordonnees de l\'origine (A) a celles de l\'extremite (B).');

        html += step('Application numerique',
            `\\overrightarrow{AB} = \\begin{pmatrix} ${ex.bx} - (${ex.ax}) \\\\ ${ex.by} - (${ex.ay}) \\\\ ${ex.bz} - (${ex.az}) \\end{pmatrix}`,
            '');

        html += resultBlock(`\\overrightarrow{AB} = \\begin{pmatrix} ${ex.vx} \\\\ ${ex.vy} \\\\ ${ex.vz} \\end{pmatrix}`, '');

    } else {
        html += step('Formule du milieu en 3D',
            'I = \\left( \\dfrac{x_A + x_B}{2} \\;,\\; \\dfrac{y_A + y_B}{2} \\;,\\; \\dfrac{z_A + z_B}{2} \\right)',
            'Le milieu est le barycentre de A et B avec des coefficients egaux.');

        html += step('Application numerique',
            `I = \\left( \\dfrac{${ex.ax} + ${ex.bx}}{2} \\;,\\; \\dfrac{${ex.ay} + ${ex.by}}{2} \\;,\\; \\dfrac{${ex.az} + ${ex.bz}}{2} \\right)`,
            '');

        const mx = (ex.ax + ex.bx) / 2;
        const my = (ex.ay + ex.by) / 2;
        const mz = (ex.az + ex.bz) / 2;

        function fmtHalf(n) {
            if (n === Math.floor(n)) return `${n}`;
            return `\\dfrac{${ex.ax + ex.bx}}{2}`;
        }

        html += resultBlock(
            `I\\left(${mx}\\,;\\,${my}\\,;\\,${mz}\\right)`,
            'Coordonnees du milieu de [AB].');
    }

    return html;
}

// --- Correction Droites et Plans ---
function solveDroitesPlan(ex, sub) {
    let html = '';

    if (sub === 'equation_plan') {
        html += step('Equation d\'un plan de vecteur normal n(a, b, c) passant par M(x0, y0, z0)',
            'a(x - x_0) + b(y - y_0) + c(z - z_0) = 0',
            'Le vecteur normal est perpendiculaire a tout vecteur du plan.');

        html += step('Substitution',
            `${ex.na}(x - ${ex.x0}) + ${ex.nb}(y - ${ex.y0}) + ${ex.nc}(z - ${ex.z0}) = 0`,
            '');

        html += step('Developpement',
            `${ex.na}x ${ex.na * (-ex.x0) >= 0 ? '+ ' + ex.na * (-ex.x0) : '- ' + Math.abs(ex.na * (-ex.x0))} + ${ex.nb}y ${ex.nb * (-ex.y0) >= 0 ? '+ ' + ex.nb * (-ex.y0) : '- ' + Math.abs(ex.nb * (-ex.y0))} + ${ex.nc}z ${ex.nc * (-ex.z0) >= 0 ? '+ ' + ex.nc * (-ex.z0) : '- ' + Math.abs(ex.nc * (-ex.z0))} = 0`,
            '');

        // Construire l'equation finale
        const terms = [];
        if (ex.na === 1) terms.push('x');
        else if (ex.na === -1) terms.push('-x');
        else terms.push(`${ex.na}x`);

        if (ex.nb >= 0) {
            if (ex.nb === 1) terms.push('+ y');
            else terms.push(`+ ${ex.nb}y`);
        } else {
            if (ex.nb === -1) terms.push('- y');
            else terms.push(`- ${Math.abs(ex.nb)}y`);
        }

        if (ex.nc >= 0) {
            if (ex.nc === 1) terms.push('+ z');
            else terms.push(`+ ${ex.nc}z`);
        } else {
            if (ex.nc === -1) terms.push('- z');
            else terms.push(`- ${Math.abs(ex.nc)}z`);
        }

        if (ex.d !== 0) {
            if (ex.d > 0) terms.push(`+ ${ex.d}`);
            else terms.push(`- ${Math.abs(ex.d)}`);
        }

        html += resultBlock(terms.join(' ') + ' = 0',
            `Equation cartesienne du plan de vecteur normal n(${ex.na}\\,;\\,${ex.nb}\\,;\\,${ex.nc}).`);

    } else {
        // droite_parametrique
        html += step('Representation parametrique d\'une droite',
            '\\begin{cases} x = x_A + l \\cdot t \\\\ y = y_A + m \\cdot t \\\\ z = z_A + n \\cdot t \\end{cases} \\quad (t \\in \\mathbb{R})',
            'On part du point A et on se deplace dans la direction du vecteur directeur d(l, m, n).');

        html += step('Identification des parametres',
            `A(${ex.ax}\\,;\\,${ex.ay}\\,;\\,${ex.az}), \\quad \\vec{d}${vec3(ex.dl, ex.dm, ex.dn)}`,
            '');

        html += resultBlock(
            `\\begin{cases} x = ${ex.ax} ${ex.dl >= 0 ? '+ ' + ex.dl : '- ' + Math.abs(ex.dl)} t \\\\ y = ${ex.ay} ${ex.dm >= 0 ? '+ ' + ex.dm : '- ' + Math.abs(ex.dm)} t \\\\ z = ${ex.az} ${ex.dn >= 0 ? '+ ' + ex.dn : '- ' + Math.abs(ex.dn)} t \\end{cases}`,
            'Representation parametrique de la droite (t \\in \\mathbb{R}).');
    }

    return html;
}

// --- Correction Positions ---
function solvePositions(ex, sub) {
    let html = '';

    if (sub === 'parallelisme') {
        html += step('Condition de colinearite',
            '\\vec{u} \\text{ et } \\vec{v} \\text{ colineaires} \\iff \\exists \\, k \\in \\mathbb{R} : \\vec{v} = k \\cdot \\vec{u}',
            'Deux vecteurs sont colineaires (paralleles) si et seulement si l\'un est un multiple scalaire de l\'autre. On verifie si les rapports des coordonnees sont egaux.');

        html += step('Calcul des rapports',
            `\\frac{${ex.vx}}{${ex.ux}} = ? \\qquad \\frac{${ex.vy}}{${ex.uy}} = ? \\qquad \\frac{${ex.vz}}{${ex.uz}} = ?`,
            '');

        if (ex.parallel) {
            html += step('Verification',
                `\\vec{v} = ${ex.k_coef} \\, \\vec{u}`,
                `Les trois rapports sont egaux a ${ex.k_coef} : les vecteurs sont colineaires.`);
            html += resultBlock('\\vec{u} \\text{ et } \\vec{v} \\text{ sont colineaires (paralleles)}.',
                `k = ${ex.k_coef}`);
        } else {
            html += step('Verification',
                '\\text{Les rapports ne sont pas tous egaux.}',
                'Au moins un rapport differe des autres : les vecteurs ne sont pas colineaires.');
            html += resultBlock('\\vec{u} \\text{ et } \\vec{v} \\text{ ne sont pas colineaires.}', '');
        }

    } else if (sub === 'orthogonalite') {
        html += step('Condition d\'orthogonalite',
            '\\vec{u} \\perp \\vec{v} \\iff \\vec{u} \\cdot \\vec{v} = 0',
            'Deux vecteurs sont orthogonaux si et seulement si leur produit scalaire est nul.');

        html += step('Calcul du produit scalaire',
            `\\vec{u} \\cdot \\vec{v} = (${ex.ux})(${ex.vx}) + (${ex.uy})(${ex.vy}) + (${ex.uz})(${ex.vz})`,
            '');

        html += step('Resultat',
            `\\vec{u} \\cdot \\vec{v} = ${ex.ux * ex.vx} + ${ex.uy * ex.vy} + ${ex.uz * ex.vz} = ${ex.dot}`,
            '');

        if (ex.orthogonal) {
            html += resultBlock('\\vec{u} \\perp \\vec{v} \\quad (\\text{car } \\vec{u} \\cdot \\vec{v} = 0)',
                'Les vecteurs sont orthogonaux.');
        } else {
            html += resultBlock(`\\vec{u} \\cdot \\vec{v} = ${ex.dot} \\neq 0 \\implies \\vec{u} \\text{ et } \\vec{v} \\text{ ne sont pas orthogonaux.}`, '');
        }

    } else {
        // coplanaire
        html += step('Condition de coplanarite',
            '\\text{A, B, C, D coplanaires} \\iff \\det(\\overrightarrow{AB}, \\overrightarrow{AC}, \\overrightarrow{AD}) = 0',
            'Quatre points sont coplanaires si et seulement si le determinant de la matrice formee par les vecteurs AB, AC, AD est nul.');

        const abx = ex.bx - ex.ax, aby = ex.by - ex.ay, abz = ex.bz - ex.az;
        const acx = ex.cx - ex.ax, acy = ex.cy - ex.ay, acz = ex.cz - ex.az;
        const adx = ex.dx - ex.ax, ady = ex.dy - ex.ay, adz = ex.dz - ex.az;

        html += step('Calcul des vecteurs',
            `\\overrightarrow{AB}${vec3(abx, aby, abz)} \\quad \\overrightarrow{AC}${vec3(acx, acy, acz)} \\quad \\overrightarrow{AD}${vec3(adx, ady, adz)}`,
            '');

        html += step('Calcul du determinant',
            `\\det = \\begin{vmatrix} ${abx} & ${acx} & ${adx} \\\\ ${aby} & ${acy} & ${ady} \\\\ ${abz} & ${acz} & ${adz} \\end{vmatrix} = ${ex.det}`,
            'On developpe selon la premiere colonne (ou par la regle de Sarrus).');

        if (ex.coplanar) {
            html += resultBlock('\\det = 0 \\implies \\text{A, B, C, D sont coplanaires.}',
                'Les quatre points appartiennent au meme plan.');
        } else {
            html += resultBlock(`\\det = ${ex.det} \\neq 0 \\implies \\text{A, B, C, D ne sont pas coplanaires.}`,
                'Les quatre points ne sont pas dans le meme plan.');
        }
    }

    return html;
}

// --- Correction Produit scalaire ---
function solveProduitScalaire(ex, sub) {
    let html = '';

    html += step('Formule du produit scalaire dans l\'espace',
        '\\vec{u} \\cdot \\vec{v} = u_x v_x + u_y v_y + u_z v_z',
        'Le produit scalaire est la somme des produits des coordonnees correspondantes.');

    html += step('Application numerique',
        `\\vec{u} \\cdot \\vec{v} = (${ex.ux})(${ex.vx}) + (${ex.uy})(${ex.vy}) + (${ex.uz})(${ex.vz})`,
        '');

    html += step('Calcul',
        `\\vec{u} \\cdot \\vec{v} = ${ex.ux * ex.vx} + ${ex.uy * ex.vy} + ${ex.uz * ex.vz} = ${ex.dot}`,
        '');

    if (sub === 'calcul') {
        html += resultBlock(`\\vec{u} \\cdot \\vec{v} = ${ex.dot}`, '');
    } else {
        // angle
        html += step('Formule de l\'angle',
            '\\cos \\theta = \\dfrac{\\vec{u} \\cdot \\vec{v}}{\\|\\vec{u}\\| \\cdot \\|\\vec{v}\\|}',
            'L\'angle entre deux vecteurs se calcule a partir du produit scalaire et des normes.');

        html += step('Calcul des normes',
            `\\|\\vec{u}\\| = \\sqrt{${ex.normU2}} \\approx ${roundDec(ex.normU, 3)} \\qquad \\|\\vec{v}\\| = \\sqrt{${ex.normV2}} \\approx ${roundDec(ex.normV, 3)}`,
            '');

        const cosTheta = ex.dot / (ex.normU * ex.normV);
        const theta = Math.acos(Math.max(-1, Math.min(1, cosTheta)));
        const thetaDeg = roundDec(theta * 180 / Math.PI, 1);

        html += step('Calcul du cosinus',
            `\\cos \\theta = \\dfrac{${ex.dot}}{\\sqrt{${ex.normU2}} \\times \\sqrt{${ex.normV2}}} \\approx ${roundDec(cosTheta, 4)}`,
            '');

        html += resultBlock(`\\theta = \\arccos\\left(${roundDec(cosTheta, 4)}\\right) \\approx ${thetaDeg}^\\circ`,
            cosTheta >= 0 ? 'Angle aigu (cos > 0).' : 'Angle obtus (cos < 0).');
    }

    return html;
}

// --- Correction Sections ---
function solveSections(ex, sub) {
    let html = '';

    if (sub === 'cube') {
        const { a, sectionType } = ex;

        if (sectionType === 'diagonale') {
            html += step('Section par un plan diagonal',
                '\\text{Le plan passe par deux aretes opposees du cube}',
                'Le plan contient une diagonale de la base et une arete verticale correspondante.');

            html += step('Vertices de la section',
                '\\text{La section est un rectangle}',
                'Le rectangle a pour dimensions : un cote = a (cote du cube), l\'autre cote = a\\sqrt{2} (diagonale de la face).');

            const diag = roundDec(a * Math.sqrt(2), 3);
            html += resultBlock(
                `\\text{Section : rectangle } a \\times a\\sqrt{2} = ${a} \\times ${diag}`,
                `Aire = a^2\\sqrt{2} = ${roundDec(a * a * Math.sqrt(2), 3)} \\text{ u}^2`);

        } else if (sectionType === 'mediane') {
            html += step('Section parallele a une face',
                '\\text{Le plan est parallele a la face ABCD}',
                'Tout plan parallele a une face d\'un cube coupe le cube en un carre.');

            html += resultBlock(
                `\\text{Section : carre de cote } ${a}`,
                `Aire = ${a}^2 = ${a * a} \\text{ u}^2`);

        } else {
            html += step('Section par un plan coupant les 6 faces',
                '\\text{Le plan passe par les milieux de 6 aretes}',
                'Si le plan passe par les milieux d\'aretes deux a deux paralleles, il coupe le cube en un hexagone regulier.');

            const side = roundDec(a * Math.sqrt(2) / 2, 3);
            html += resultBlock(
                `\\text{Section : hexagone regulier de cote } \\frac{a\\sqrt{2}}{2} = ${side}`,
                `Perimetre = 3a\\sqrt{2} = ${roundDec(3 * a * Math.sqrt(2), 3)} \\text{ u}`);
        }

    } else {
        // tetraedre
        const { a, sectionType } = ex;

        if (sectionType === 'milieux_aretes') {
            html += step('Section par les milieux de 3 aretes',
                '\\text{Plan passant par les milieux de 3 aretes}',
                'Le plan de milieux de 3 aretes d\'un tetraedre regulier donne une section triangulaire.');

            html += step('Nature de la section',
                '\\text{Section : triangle equilateral}',
                'Par le theoreme des milieux, le triangle de section est semblable au triangle de base avec un rapport 1/2.');

            html += resultBlock(
                `\\text{Triangle equilateral de cote } \\frac{a}{2} = ${a / 2}`,
                `Perimetre = \\frac{3a}{2} = ${3 * a / 2} \\text{ u}`);

        } else {
            html += step('Section par un plan parallele a une face',
                '\\text{Plan parallele a la face BCD}',
                'Un plan parallele a une face d\'un tetraedre coupe les 3 aretes adjacentes.');

            html += step('Propriete',
                '\\text{La section est un triangle semblable a la face}',
                'Le rapport de similitude depend de la position du plan par rapport au sommet oppose.');

            html += resultBlock(
                '\\text{Section : triangle equilateral (homothete de la face)}',
                'Le rapport de similitude k verifie 0 < k < 1.');
        }
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
    initGeoEspPage();
});
