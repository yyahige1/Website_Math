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

// Formate un signe pour affichage
function signStr(val) {
    return val >= 0 ? `+ ${val}` : `- ${Math.abs(val)}`;
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
        ex.na = rint(-3, 3, [0]);
        ex.nb = rint(-3, 3, [0]);
        ex.nc = rint(-3, 3, [0]);
        ex.x0 = rint(-4, 4);
        ex.y0 = rint(-4, 4);
        ex.z0 = rint(-4, 4);
        ex.d = -(ex.na * ex.x0 + ex.nb * ex.y0 + ex.nc * ex.z0);
    } else {
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
        ex.ux = rint(-3, 3, [0]);
        ex.uy = rint(-3, 3, [0]);
        ex.uz = rint(-3, 3, [0]);
        ex.orthogonal = Math.random() > 0.5;
        if (ex.orthogonal) {
            ex.vx = rint(-3, 3, [0]);
            ex.vy = rint(-3, 3, [0]);
            if (ex.uz !== 0) {
                const dot_partial = ex.ux * ex.vx + ex.uy * ex.vy;
                if (dot_partial % ex.uz === 0) {
                    ex.vz = -dot_partial / ex.uz;
                } else {
                    ex.vx = ex.uz; ex.vy = 0;
                    ex.vz = -ex.ux;
                }
            } else {
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
        ex.ax = rint(-4, 4); ex.ay = rint(-4, 4); ex.az = rint(-4, 4);
        ex.bx = rint(-4, 4); ex.by = rint(-4, 4); ex.bz = rint(-4, 4);
        ex.cx = rint(-4, 4); ex.cy = rint(-4, 4); ex.cz = rint(-4, 4);
        ex.coplanar = Math.random() > 0.5;

        if (ex.coplanar) {
            const s = pick([1, 2, -1]);
            const t = pick([1, 2, -1]);
            ex.dx = ex.ax + s * (ex.bx - ex.ax) + t * (ex.cx - ex.ax);
            ex.dy = ex.ay + s * (ex.by - ex.ay) + t * (ex.cy - ex.ay);
            ex.dz = ex.az + s * (ex.bz - ex.az) + t * (ex.cz - ex.az);
            ex.alpha = s;
            ex.beta = t;
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
        const a = pick([2, 3, 4]);
        const sectionType = pick(['diagonale', 'mediane', 'hexagone']);
        GeoEspState.exercise = { a, sectionType };
    } else {
        const a = pick([2, 4, 6]);
        const sectionType = pick(['milieux_aretes', 'parallele_face']);
        GeoEspState.exercise = { a, sectionType };
    }
}

// ========================================
// Affichage de l'exercice (HTML + KaTeX inline)
// ========================================

function updateExerciseDisplay() {
    const type = GeoEspState.currentType;
    const sub = GeoEspState['subtype_' + type];
    const ex = GeoEspState.exercise;
    let display = '';

    if (type === 'coordonnees') {
        display = `<p style="text-align:center">${K(pt3('A', ex.ax, ex.ay, ex.az))} &nbsp; et &nbsp; ${K(pt3('B', ex.bx, ex.by, ex.bz))}</p>`;
        if (sub === 'distance') {
            display += `<p>Calculer la distance ${K('AB')}.</p>`;
        } else if (sub === 'vecteur') {
            display += `<p>Donner les coordonnees du vecteur ${K('\\overrightarrow{AB}')}.</p>`;
        } else {
            display += `<p>Trouver les coordonnees du milieu ${K('I')} de ${K('[AB]')}.</p>`;
        }
    } else if (type === 'droites_plans') {
        if (sub === 'equation_plan') {
            display = `<p>Plan passant par ${K(pt3('M', ex.x0, ex.y0, ex.z0))}</p>`;
            display += `<p style="text-align:center">de vecteur normal ${K(`${vecName('n')} ${vec3(ex.na, ex.nb, ex.nc)}`)}</p>`;
            display += `<p>Determiner une equation cartesienne de ce plan.</p>`;
        } else {
            display = `<p>Droite passant par ${K(pt3('A', ex.ax, ex.ay, ex.az))}</p>`;
            display += `<p style="text-align:center">de vecteur directeur ${K(`${vecName('d')} ${vec3(ex.dl, ex.dm, ex.dn)}`)}</p>`;
            display += `<p>Ecrire la representation parametrique de cette droite.</p>`;
        }
    } else if (type === 'positions') {
        if (sub === 'parallelisme') {
            display = `<p style="text-align:center">${K(`${vecName('u')} ${vec3(ex.ux, ex.uy, ex.uz)}`)} &nbsp;&nbsp; ${K(`${vecName('v')} ${vec3(ex.vx, ex.vy, ex.vz)}`)}</p>`;
            display += `<p>Les vecteurs ${K(vecName('u'))} et ${K(vecName('v'))} sont-ils colineaires (paralleles) ?</p>`;
        } else if (sub === 'orthogonalite') {
            display = `<p style="text-align:center">${K(`${vecName('u')} ${vec3(ex.ux, ex.uy, ex.uz)}`)} &nbsp;&nbsp; ${K(`${vecName('v')} ${vec3(ex.vx, ex.vy, ex.vz)}`)}</p>`;
            display += `<p>Les vecteurs ${K(vecName('u'))} et ${K(vecName('v'))} sont-ils orthogonaux ?</p>`;
        } else {
            display = `<p style="text-align:center">${K(pt3('A', ex.ax, ex.ay, ex.az))}, &nbsp; ${K(pt3('B', ex.bx, ex.by, ex.bz))}</p>`;
            display += `<p style="text-align:center">${K(pt3('C', ex.cx, ex.cy, ex.cz))}, &nbsp; ${K(pt3('D', ex.dx, ex.dy, ex.dz))}</p>`;
            display += `<p>Les points A, B, C, D sont-ils coplanaires ?</p>`;
        }
    } else if (type === 'produit_scalaire') {
        display = `<p style="text-align:center">${K(`${vecName('u')} ${vec3(ex.ux, ex.uy, ex.uz)}`)} &nbsp;&nbsp; ${K(`${vecName('v')} ${vec3(ex.vx, ex.vy, ex.vz)}`)}</p>`;
        if (sub === 'calcul') {
            display += `<p>Calculer ${K(`${vecName('u')} \\cdot ${vecName('v')}`)}.</p>`;
        } else {
            display += `<p>Calculer l'angle ${K('\\theta')} entre ${K(vecName('u'))} et ${K(vecName('v'))}.</p>`;
        }
    } else {
        // sections
        if (sub === 'cube') {
            const sectionLabels = {
                'diagonale': 'un plan contenant une arete et un sommet non adjacent',
                'mediane': 'un plan parallele a une face',
                'hexagone': 'un plan coupant les six faces'
            };
            display = `<p>Cube ABCDEFGH de cote ${K(`a = ${ex.a}`)}.</p>`;
            display += `<p>Section par ${sectionLabels[ex.sectionType]}.</p>`;
            display += `<p>Quelle est la nature de la section ?</p>`;
        } else {
            const sectionLabels = {
                'milieux_aretes': 'les milieux de 3 aretes',
                'parallele_face': 'un plan parallele a une face'
            };
            display = `<p>Tetraedre regulier ABCD de cote ${K(`a = ${ex.a}`)}.</p>`;
            display += `<p>Section par ${sectionLabels[ex.sectionType]}.</p>`;
            display += `<p>Quelle est la nature de la section ?</p>`;
        }
    }

    const el = $('expressionDisplay');
    el.innerHTML = display;
    el.style.fontSize = '1.1em';
    el.style.fontWeight = '500';
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

    // Ajouter graphique 3D pour coordonnees et sections
    if (type === 'coordonnees' || type === 'sections') {
        html += '<div class="graph-container">';
        html += '<h4>Representation graphique</h4>';
        html += '<canvas id="geo3DCanvas" width="420" height="380"></canvas>';
        html += '</div>';
    }

    $('stepsContainer').innerHTML = html;
    showSolution('solutionDiv');

    // Dessin apres insertion dans le DOM
    if (type === 'coordonnees' || type === 'sections') {
        requestAnimationFrame(() => {
            if (type === 'coordonnees') draw3DCoordonnees(ex, sub);
            else if (type === 'sections') draw3DSections(ex, sub);
        });
    }
}

// --- Correction Coordonnees 3D ---
function solveCoordonnees3D(ex, sub) {
    let html = '';

    if (sub === 'distance') {
        html += '<div class="formula-box">' + K('AB = \\sqrt{(x_B - x_A)^2 + (y_B - y_A)^2 + (z_B - z_A)^2}') + '</div>';

        html += step('Application numerique',
            `AB = \\sqrt{(${ex.bx} - (${ex.ax}))^2 + (${ex.by} - (${ex.ay}))^2 + (${ex.bz} - (${ex.az}))^2}`,
            `Avec <span class="color-coef">${K(pt3('A', ex.ax, ex.ay, ex.az))}</span> et <span class="color-coef">${K(pt3('B', ex.bx, ex.by, ex.bz))}</span>.`);

        html += step('Calcul des differences',
            `AB = \\sqrt{(${ex.vx})^2 + (${ex.vy})^2 + (${ex.vz})^2} = \\sqrt{${ex.vx*ex.vx} + ${ex.vy*ex.vy} + ${ex.vz*ex.vz}}`,
            '');

        html += step('Simplification',
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

    } else if (sub === 'vecteur') {
        html += '<div class="formula-box">' + K('\\overrightarrow{AB} = \\begin{pmatrix} x_B - x_A \\\\ y_B - y_A \\\\ z_B - z_A \\end{pmatrix}') + '</div>';

        html += step('Application numerique',
            `\\overrightarrow{AB} = \\begin{pmatrix} ${ex.bx} - (${ex.ax}) \\\\ ${ex.by} - (${ex.ay}) \\\\ ${ex.bz} - (${ex.az}) \\end{pmatrix}`,
            `De <span class="color-coef">${K(pt3('A', ex.ax, ex.ay, ex.az))}</span> vers <span class="color-coef">${K(pt3('B', ex.bx, ex.by, ex.bz))}</span>.`);

        html += resultBlock(`\\overrightarrow{AB} = ${vec3(ex.vx, ex.vy, ex.vz)}`, '');

    } else {
        html += '<div class="formula-box">' + K('I = \\left( \\dfrac{x_A + x_B}{2} \\;;\\; \\dfrac{y_A + y_B}{2} \\;;\\; \\dfrac{z_A + z_B}{2} \\right)') + '</div>';

        html += step('Application numerique',
            `I = \\left( \\dfrac{${ex.ax} + (${ex.bx})}{2} \\;;\\; \\dfrac{${ex.ay} + (${ex.by})}{2} \\;;\\; \\dfrac{${ex.az} + (${ex.bz})}{2} \\right)`,
            `Avec <span class="color-coef">${K(pt3('A', ex.ax, ex.ay, ex.az))}</span> et <span class="color-coef">${K(pt3('B', ex.bx, ex.by, ex.bz))}</span>.`);

        html += resultBlock(
            `I\\left(${ex.mx}\\,;\\,${ex.my}\\,;\\,${ex.mz}\\right)`,
            '<span class="color-solution">Coordonnees du milieu</span> de [AB].');
    }

    return html;
}

// --- Correction Droites et Plans ---
function solveDroitesPlan(ex, sub) {
    let html = '';

    if (sub === 'equation_plan') {
        html += '<div class="formula-box">' + K('a(x - x_0) + b(y - y_0) + c(z - z_0) = 0') + '</div>';

        html += step('Identification',
            `${K(pt3('M', ex.x0, ex.y0, ex.z0))}, \\quad ${K(`${vecName('n')} ${vec3(ex.na, ex.nb, ex.nc)}`)}`,
            `Point du plan : <span class="color-coef">${K(pt3('M', ex.x0, ex.y0, ex.z0))}</span>. Vecteur normal : <span class="color-coef">${K(`${vecName('n')}(${ex.na}\\,;\\,${ex.nb}\\,;\\,${ex.nc})`)}</span>.`);

        html += step('Substitution',
            `${ex.na}(x - (${ex.x0})) + ${ex.nb}(y - (${ex.y0})) + ${ex.nc}(z - (${ex.z0})) = 0`,
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

        html += step('Developpement et simplification',
            terms.join(' ') + ' = 0',
            `On developpe les parentheses et on regroupe les constantes : <span class="color-delta">${K(`d = ${ex.d}`)}</span>.`);

        html += resultBlock(terms.join(' ') + ' = 0', '');

    } else {
        // droite_parametrique
        html += '<div class="formula-box">' + K('\\begin{cases} x = x_A + l \\cdot t \\\\ y = y_A + m \\cdot t \\\\ z = z_A + n \\cdot t \\end{cases} \\quad (t \\in \\mathbb{R})') + '</div>';

        html += step('Identification des parametres',
            '',
            `Point : <span class="color-coef">${K(pt3('A', ex.ax, ex.ay, ex.az))}</span>. Vecteur directeur : <span class="color-coef">${K(`${vecName('d')}(${ex.dl}\\,;\\,${ex.dm}\\,;\\,${ex.dn})`)}</span>.`);

        html += resultBlock(
            `\\begin{cases} x = ${ex.ax} ${ex.dl >= 0 ? '+ ' + ex.dl : '- ' + Math.abs(ex.dl)} t \\\\ y = ${ex.ay} ${ex.dm >= 0 ? '+ ' + ex.dm : '- ' + Math.abs(ex.dm)} t \\\\ z = ${ex.az} ${ex.dn >= 0 ? '+ ' + ex.dn : '- ' + Math.abs(ex.dn)} t \\end{cases}`,
            `avec ${K('t \\in \\mathbb{R}')}.`);
    }

    return html;
}

// --- Correction Positions ---
function solvePositions(ex, sub) {
    let html = '';

    if (sub === 'parallelisme') {
        html += '<div class="formula-box">' + K('\\vec{u} \\parallel \\vec{v} \\iff \\exists \\, k \\in \\mathbb{R} : \\vec{v} = k \\cdot \\vec{u}') + '</div>';

        html += step('Donnees',
            '',
            `<span class="color-coef">${K(`${vecName('u')}(${ex.ux}\\,;\\,${ex.uy}\\,;\\,${ex.uz})`)}</span> et <span class="color-coef">${K(`${vecName('v')}(${ex.vx}\\,;\\,${ex.vy}\\,;\\,${ex.vz})`)}</span>.`);

        html += step('Verification des rapports',
            `\\frac{v_x}{u_x} = \\frac{${ex.vx}}{${ex.ux}}, \\quad \\frac{v_y}{u_y} = \\frac{${ex.vy}}{${ex.uy}}, \\quad \\frac{v_z}{u_z} = \\frac{${ex.vz}}{${ex.uz}}`,
            'On verifie si les rapports des coordonnees sont tous egaux.');

        if (ex.parallel) {
            html += step('Conclusion',
                `${vecName('v')} = ${ex.k_coef} \\, ${vecName('u')}`,
                `Les trois rapports sont egaux a <span class="color-delta">${K(`k = ${ex.k_coef}`)}</span>.`);
            html += resultBlock(`${vecName('u')} \\parallel ${vecName('v')} \\quad (k = ${ex.k_coef})`,
                '<span class="color-solution">Les vecteurs sont colineaires (paralleles).</span>');
        } else {
            html += step('Conclusion',
                '',
                '<span class="color-delta">Les rapports ne sont pas tous egaux.</span>');
            html += resultBlock(`${vecName('u')} \\not\\parallel ${vecName('v')}`,
                '<span class="color-solution">Les vecteurs ne sont pas colineaires.</span>');
        }

    } else if (sub === 'orthogonalite') {
        html += '<div class="formula-box">' + K('\\vec{u} \\perp \\vec{v} \\iff \\vec{u} \\cdot \\vec{v} = 0') + '</div>';

        html += step('Donnees',
            '',
            `<span class="color-coef">${K(`${vecName('u')}(${ex.ux}\\,;\\,${ex.uy}\\,;\\,${ex.uz})`)}</span> et <span class="color-coef">${K(`${vecName('v')}(${ex.vx}\\,;\\,${ex.vy}\\,;\\,${ex.vz})`)}</span>.`);

        html += step('Calcul du produit scalaire',
            `${vecName('u')} \\cdot ${vecName('v')} = (${ex.ux})(${ex.vx}) + (${ex.uy})(${ex.vy}) + (${ex.uz})(${ex.vz})`,
            '');

        const p1 = ex.ux * ex.vx, p2 = ex.uy * ex.vy, p3 = ex.uz * ex.vz;
        html += step('Resultat',
            `${vecName('u')} \\cdot ${vecName('v')} = ${p1} + (${p2}) + (${p3}) = ${ex.dot}`,
            '');

        if (ex.orthogonal) {
            html += resultBlock(`${vecName('u')} \\cdot ${vecName('v')} = 0 \\implies ${vecName('u')} \\perp ${vecName('v')}`,
                '<span class="color-solution">Les vecteurs sont orthogonaux.</span>');
        } else {
            html += resultBlock(`${vecName('u')} \\cdot ${vecName('v')} = ${ex.dot} \\neq 0`,
                '<span class="color-solution">Les vecteurs ne sont pas orthogonaux.</span>');
        }

    } else {
        // coplanaire — methode combinaison lineaire (programme lycee)
        html += '<div class="formula-box">' + K('A, B, C, D \\text{ coplanaires} \\iff \\exists\\,\\alpha, \\beta \\in \\mathbb{R} : \\overrightarrow{AD} = \\alpha \\overrightarrow{AB} + \\beta \\overrightarrow{AC}') + '</div>';

        const abx = ex.bx - ex.ax, aby = ex.by - ex.ay, abz = ex.bz - ex.az;
        const acx = ex.cx - ex.ax, acy = ex.cy - ex.ay, acz = ex.cz - ex.az;
        const adx = ex.dx - ex.ax, ady = ex.dy - ex.ay, adz = ex.dz - ex.az;

        html += step('Calcul des vecteurs',
            '',
            `<span class="color-coef">${K(`\\overrightarrow{AB} ${vec3(abx, aby, abz)}`)}</span> &nbsp; <span class="color-coef">${K(`\\overrightarrow{AC} ${vec3(acx, acy, acz)}`)}</span> &nbsp; <span class="color-coef">${K(`\\overrightarrow{AD} ${vec3(adx, ady, adz)}`)}</span>`);

        // Format un terme alpha ou beta avec gestion des signes
        function sysTermA(c) {
            if (c === 0) return '0';
            if (c === 1) return '\\alpha';
            if (c === -1) return '-\\alpha';
            return `${c}\\alpha`;
        }
        function sysTermB(c) {
            if (c === 0) return '';
            if (c === 1) return ' + \\beta';
            if (c === -1) return ' - \\beta';
            if (c > 0) return ` + ${c}\\beta`;
            return ` - ${Math.abs(c)}\\beta`;
        }
        const sysLine = (a, b, rhs) => `${sysTermA(a)}${sysTermB(b)} = ${rhs}`;

        html += step('Systeme a resoudre (3 equations, 2 inconnues)',
            `\\begin{cases} ${sysLine(abx, acx, adx)} \\\\ ${sysLine(aby, acy, ady)} \\\\ ${sysLine(abz, acz, adz)} \\end{cases}`,
            `On cherche <span class="color-coef">${K('\\alpha')}</span> et <span class="color-coef">${K('\\beta')}</span> satisfaisant les 3 equations simultanement.`);

        if (ex.coplanar) {
            const al = ex.alpha, be = ex.beta;
            html += step('Solution du systeme',
                '',
                `Le systeme est compatible : <span class="color-delta">${K(`\\alpha = ${al}`)}</span> et <span class="color-delta">${K(`\\beta = ${be}`)}</span>.`);

            const v1 = al * abx + be * acx;
            const v2 = al * aby + be * acy;
            const v3 = al * abz + be * acz;
            html += step('Verification dans les 3 equations',
                '',
                `(1) : ${K(`${al}(${abx}) + ${be}(${acx}) = ${v1} = ${adx}`)} ✓<br>` +
                `(2) : ${K(`${al}(${aby}) + ${be}(${acy}) = ${v2} = ${ady}`)} ✓<br>` +
                `(3) : ${K(`${al}(${abz}) + ${be}(${acz}) = ${v3} = ${adz}`)} ✓`);

            function fmtVecCoef(c, v) {
                if (c === 1) return `\\overrightarrow{${v}}`;
                if (c === -1) return `-\\overrightarrow{${v}}`;
                return `${c}\\overrightarrow{${v}}`;
            }
            const beSign = be >= 0 ? '+ ' : '';
            html += resultBlock(
                `\\overrightarrow{AD} = ${fmtVecCoef(al, 'AB')} ${beSign}${fmtVecCoef(be, 'AC')}`,
                '<span class="color-solution">A, B, C, D sont coplanaires.</span>');
        } else {
            // Tenter de resoudre les equations (1) et (2)
            const det2 = abx * acy - acx * aby;
            if (Math.abs(det2) > 1e-9) {
                const alpha = (adx * acy - acx * ady) / det2;
                const beta = (abx * ady - adx * aby) / det2;
                const checkLhs = roundDec(alpha * abz + beta * acz, 4);
                const alFmt = roundDec(alpha, 2);
                const beFmt = roundDec(beta, 2);
                html += step('Resolution des equations (1) et (2)',
                    '',
                    `En resolvant avec les deux premieres equations, on trouve : <span class="color-delta">${K(`\\alpha \\approx ${alFmt}`)}</span> et <span class="color-delta">${K(`\\beta \\approx ${beFmt}`)}</span>.`);
                html += step('Verification dans l\'equation (3)',
                    '',
                    `${K(`${alFmt}(${abz}) + ${beFmt}(${acz}) \\approx ${checkLhs}`)}, mais le membre droit vaut <span class="color-delta">${K(`${adz}`)}</span>.<br>` +
                    `<span class="color-delta">L\'equation (3) n\'est pas satisfaite : le systeme est incompatible.</span>`);
            } else {
                html += step('Analyse du systeme',
                    '',
                    `<span class="color-delta">Le systeme n\'admet pas de solution</span> : les equations sont inconsistantes.`);
            }
            html += resultBlock(
                '\\nexists\\,(\\alpha, \\beta) \\text{ solution du systeme}',
                '<span class="color-solution">A, B, C, D ne sont pas coplanaires.</span>');
        }
    }

    return html;
}

// --- Correction Produit scalaire ---
function solveProduitScalaire(ex, sub) {
    let html = '';

    html += '<div class="formula-box">' + K(`${vecName('u')} \\cdot ${vecName('v')} = u_x v_x + u_y v_y + u_z v_z`) + '</div>';

    html += step('Donnees',
        '',
        `<span class="color-coef">${K(`${vecName('u')}(${ex.ux}\\,;\\,${ex.uy}\\,;\\,${ex.uz})`)}</span> et <span class="color-coef">${K(`${vecName('v')}(${ex.vx}\\,;\\,${ex.vy}\\,;\\,${ex.vz})`)}</span>.`);

    html += step('Application numerique',
        `${vecName('u')} \\cdot ${vecName('v')} = (${ex.ux})(${ex.vx}) + (${ex.uy})(${ex.vy}) + (${ex.uz})(${ex.vz})`,
        '');

    const p1 = ex.ux * ex.vx, p2 = ex.uy * ex.vy, p3 = ex.uz * ex.vz;
    html += step('Calcul',
        `${vecName('u')} \\cdot ${vecName('v')} = ${p1} ${p2 >= 0 ? '+ ' + p2 : '- ' + Math.abs(p2)} ${p3 >= 0 ? '+ ' + p3 : '- ' + Math.abs(p3)} = ${ex.dot}`,
        '');

    if (sub === 'calcul') {
        html += resultBlock(`${vecName('u')} \\cdot ${vecName('v')} = ${ex.dot}`, '');
    } else {
        // angle
        html += '<div class="formula-box">' + K('\\cos \\theta = \\dfrac{\\vec{u} \\cdot \\vec{v}}{\\|\\vec{u}\\| \\cdot \\|\\vec{v}\\|}') + '</div>';

        html += step('Calcul des normes',
            `\\|${vecName('u')}\\| = \\sqrt{${ex.normU2}} \\approx ${roundDec(ex.normU, 3)} \\qquad \\|${vecName('v')}\\| = \\sqrt{${ex.normV2}} \\approx ${roundDec(ex.normV, 3)}`,
            '');

        const cosTheta = ex.dot / (ex.normU * ex.normV);
        const theta = Math.acos(Math.max(-1, Math.min(1, cosTheta)));
        const thetaDeg = roundDec(theta * 180 / Math.PI, 1);

        html += step('Calcul du cosinus',
            `\\cos \\theta = \\dfrac{${ex.dot}}{${roundDec(ex.normU, 3)} \\times ${roundDec(ex.normV, 3)}} \\approx ${roundDec(cosTheta, 4)}`,
            '');

        const angleType = cosTheta > 0.01 ? '<span class="case-positive">Angle aigu</span> (cos > 0)' :
                          cosTheta < -0.01 ? '<span class="case-negative">Angle obtus</span> (cos < 0)' :
                          '<span class="case-zero">Angle droit</span> (cos = 0)';

        html += resultBlock(`\\theta \\approx ${thetaDeg}^\\circ`, angleType);
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
                '',
                'Le plan contient une <span class="color-coef">diagonale de la base</span> et une <span class="color-coef">arete verticale</span> correspondante.');

            html += step('Nature de la section',
                '',
                `La section est un <span class="color-delta">rectangle</span> de dimensions : cote du cube ${K(`a = ${a}`)} et diagonale de face ${K(`a\\sqrt{2}`)}.`);

            const diag = roundDec(a * Math.sqrt(2), 3);
            const aire = roundDec(a * a * Math.sqrt(2), 3);
            html += resultBlock(
                `\\text{Rectangle } ${a} \\times ${diag}`,
                `Aire = <span class="color-solution">${K(`a^2\\sqrt{2} = ${aire}`)} u${K('^2')}</span>`);

        } else if (sectionType === 'mediane') {
            html += step('Section parallele a une face',
                '',
                'Tout plan parallele a une face d\'un cube coupe le cube en un <span class="color-delta">carre</span> de meme dimension.');

            html += resultBlock(
                `\\text{Carre de cote } ${a}`,
                `Aire = <span class="color-solution">${K(`${a}^2 = ${a * a}`)} u${K('^2')}</span>`);

        } else {
            html += step('Section par un plan coupant les 6 faces',
                '',
                'Le plan passe par les <span class="color-coef">milieux de 6 aretes</span> (deux a deux paralleles). La section est un <span class="color-delta">hexagone regulier</span>.');

            const side = roundDec(a * Math.sqrt(2) / 2, 3);
            html += resultBlock(
                `\\text{Hexagone regulier de cote } \\dfrac{a\\sqrt{2}}{2} = ${side}`,
                `Perimetre = <span class="color-solution">${K(`3a\\sqrt{2} \\approx ${roundDec(3 * a * Math.sqrt(2), 3)}`)} u</span>`);
        }

    } else {
        // tetraedre
        const { a, sectionType } = ex;

        if (sectionType === 'milieux_aretes') {
            html += step('Section par les milieux de 3 aretes',
                '',
                'Par le <span class="color-coef">theoreme des milieux</span>, la section est un <span class="color-delta">triangle equilateral</span> semblable au triangle de base avec rapport 1/2.');

            html += resultBlock(
                `\\text{Triangle equilateral de cote } \\dfrac{a}{2} = ${a / 2}`,
                `Perimetre = <span class="color-solution">${K(`\\dfrac{3a}{2} = ${3 * a / 2}`)} u</span>`);

        } else {
            html += step('Section par un plan parallele a une face',
                '',
                'Un plan parallele a une face d\'un tetraedre coupe les 3 aretes adjacentes en un <span class="color-delta">triangle equilateral</span> (homothete de la face).');

            html += resultBlock(
                '\\text{Triangle equilateral (homothete de la face)}',
                'Le rapport de similitude <span class="color-solution">' + K('k') + '</span> verifie ' + K('0 < k < 1') + '.');
        }
    }

    return html;
}

// ========================================
// Graphiques 3D (projection isometrique)
// ========================================

function iso3D(x, y, z, cx, cy, scale) {
    // Projection isometrique simplifiee
    const angle = Math.PI / 6;
    const px = cx + scale * (x * Math.cos(angle) - y * Math.cos(angle));
    const py = cy - scale * z + scale * (x * Math.sin(angle) + y * Math.sin(angle)) * 0.5;
    return { x: px, y: py };
}

function drawArrow3D(ctx, from, to, color, label) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();

    // Fleche
    const dx = to.x - from.x, dy = to.y - from.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len < 5) return;
    const ux = dx / len, uy = dy / len;
    const sz = 8;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(to.x, to.y);
    ctx.lineTo(to.x - sz * ux + sz * 0.4 * uy, to.y - sz * uy - sz * 0.4 * ux);
    ctx.lineTo(to.x - sz * ux - sz * 0.4 * uy, to.y - sz * uy + sz * 0.4 * ux);
    ctx.closePath();
    ctx.fill();

    if (label) {
        ctx.fillStyle = color;
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(label, to.x + ux * 12, to.y + uy * 12);
    }
}

function drawPoint3D(ctx, p, color, label) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();

    if (label) {
        const m = ctx.measureText(label);
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.fillRect(p.x - m.width / 2 - 2, p.y - 18, m.width + 4, 14);
        ctx.fillStyle = color;
        ctx.font = 'bold 11px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(label, p.x, p.y - 7);
    }
}

function draw3DCoordonnees(ex, sub) {
    const canvas = document.getElementById('geo3DCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = 420, H = 380;
    canvas.width = W;
    canvas.height = H;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, W, H);

    // Determiner l'echelle
    const allCoords = [ex.ax, ex.ay, ex.az, ex.bx, ex.by, ex.bz, 0];
    if (sub === 'milieu') allCoords.push(ex.mx, ex.my, ex.mz);
    const maxVal = Math.max(...allCoords.map(Math.abs), 1);
    const scale = Math.min(40, 140 / maxVal);
    const cx = W * 0.5, cy = H * 0.55;

    // Axes
    const axisLen = maxVal + 1.5;
    const oP = iso3D(0, 0, 0, cx, cy, scale);
    const xP = iso3D(axisLen, 0, 0, cx, cy, scale);
    const yP = iso3D(0, axisLen, 0, cx, cy, scale);
    const zP = iso3D(0, 0, axisLen, cx, cy, scale);

    drawArrow3D(ctx, oP, xP, '#e74c3c', 'x');
    drawArrow3D(ctx, oP, yP, '#27ae60', 'y');
    drawArrow3D(ctx, oP, zP, '#3498db', 'z');

    // Label O
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.textAlign = 'right';
    ctx.fillText('O', oP.x - 8, oP.y + 4);

    // Points A et B
    const pA = iso3D(ex.ax, ex.ay, ex.az, cx, cy, scale);
    const pB = iso3D(ex.bx, ex.by, ex.bz, cx, cy, scale);

    // Lignes de projection (pointilles)
    ctx.setLineDash([3, 3]);
    ctx.strokeStyle = 'rgba(231,76,60,0.3)';
    ctx.lineWidth = 1;
    // Projection A sur le plan xy
    const pAxy = iso3D(ex.ax, ex.ay, 0, cx, cy, scale);
    ctx.beginPath(); ctx.moveTo(pA.x, pA.y); ctx.lineTo(pAxy.x, pAxy.y); ctx.stroke();
    // Projection B
    ctx.strokeStyle = 'rgba(39,174,96,0.3)';
    const pBxy = iso3D(ex.bx, ex.by, 0, cx, cy, scale);
    ctx.beginPath(); ctx.moveTo(pB.x, pB.y); ctx.lineTo(pBxy.x, pBxy.y); ctx.stroke();
    ctx.setLineDash([]);

    // Segment AB (ou vers milieu)
    if (sub === 'distance') {
        ctx.strokeStyle = '#9b59b6';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 4]);
        ctx.beginPath(); ctx.moveTo(pA.x, pA.y); ctx.lineTo(pB.x, pB.y); ctx.stroke();
        ctx.setLineDash([]);
    } else if (sub === 'vecteur') {
        drawArrow3D(ctx, pA, pB, '#9b59b6', '');
    }

    drawPoint3D(ctx, pA, '#e74c3c', `A(${ex.ax};${ex.ay};${ex.az})`);
    drawPoint3D(ctx, pB, '#27ae60', `B(${ex.bx};${ex.by};${ex.bz})`);

    if (sub === 'milieu') {
        const pM = iso3D(ex.mx, ex.my, ex.mz, cx, cy, scale);
        ctx.strokeStyle = 'rgba(155,89,182,0.5)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath(); ctx.moveTo(pA.x, pA.y); ctx.lineTo(pB.x, pB.y); ctx.stroke();
        ctx.setLineDash([]);
        drawPoint3D(ctx, pM, '#9b59b6', `I(${ex.mx};${ex.my};${ex.mz})`);
    }
}

function draw3DSections(ex, sub) {
    const canvas = document.getElementById('geo3DCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = 420, H = 380;
    canvas.width = W;
    canvas.height = H;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, W, H);

    const cx = W * 0.5, cy = H * 0.55;

    if (sub === 'cube') {
        const a = ex.a;
        const scale = Math.min(50, 120 / a);

        // 8 sommets du cube
        const v = [
            iso3D(0, 0, 0, cx, cy, scale),     // A = 0
            iso3D(a, 0, 0, cx, cy, scale),     // B = 1
            iso3D(a, a, 0, cx, cy, scale),     // C = 2
            iso3D(0, a, 0, cx, cy, scale),     // D = 3
            iso3D(0, 0, a, cx, cy, scale),     // E = 4
            iso3D(a, 0, a, cx, cy, scale),     // F = 5
            iso3D(a, a, a, cx, cy, scale),     // G = 6
            iso3D(0, a, a, cx, cy, scale),     // H = 7
        ];
        const labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

        // Aretes cachees (pointilles)
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = 'rgba(0,0,0,0.2)';
        ctx.lineWidth = 1;
        [[0, 3], [0, 4], [3, 7]].forEach(([i, j]) => {
            ctx.beginPath(); ctx.moveTo(v[i].x, v[i].y); ctx.lineTo(v[j].x, v[j].y); ctx.stroke();
        });
        ctx.setLineDash([]);

        // Aretes visibles
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1.5;
        [[0, 1], [1, 2], [2, 3],
         [4, 5], [5, 6], [6, 7], [7, 4],
         [1, 5], [2, 6], [3, 7], [0, 4]].forEach(([i, j]) => {
            ctx.beginPath(); ctx.moveTo(v[i].x, v[i].y); ctx.lineTo(v[j].x, v[j].y); ctx.stroke();
        });

        // Section coloree
        ctx.fillStyle = 'rgba(52,152,219,0.25)';
        ctx.strokeStyle = '#3498db';
        ctx.lineWidth = 2.5;

        if (ex.sectionType === 'diagonale') {
            // Rectangle diagonal ABGF (diagonale AC base)
            const pts = [v[0], v[2], v[6], v[4]];
            ctx.beginPath();
            pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        } else if (ex.sectionType === 'mediane') {
            // Carre milieu en hauteur
            const h = a / 2;
            const pts = [
                iso3D(0, 0, h, cx, cy, scale),
                iso3D(a, 0, h, cx, cy, scale),
                iso3D(a, a, h, cx, cy, scale),
                iso3D(0, a, h, cx, cy, scale)
            ];
            ctx.beginPath();
            pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        } else {
            // Hexagone par les milieux
            const h = a / 2;
            const pts = [
                iso3D(h, 0, 0, cx, cy, scale),
                iso3D(a, h, 0, cx, cy, scale),
                iso3D(a, a, h, cx, cy, scale),
                iso3D(h, a, a, cx, cy, scale),
                iso3D(0, h, a, cx, cy, scale),
                iso3D(0, 0, h, cx, cy, scale)
            ];
            ctx.beginPath();
            pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }

        // Labels sommets
        v.forEach((p, i) => {
            ctx.fillStyle = '#333';
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(labels[i], p.x + (i < 4 ? 0 : 0), p.y + (i < 4 ? 14 : -8));
        });

    } else {
        // Tetraedre
        const a = ex.a;
        const scale = Math.min(45, 100 / a);
        const h = a * Math.sqrt(2 / 3);

        const v = [
            iso3D(0, 0, 0, cx, cy, scale),                            // A
            iso3D(a, 0, 0, cx, cy, scale),                            // B
            iso3D(a / 2, a * Math.sqrt(3) / 2, 0, cx, cy, scale),    // C
            iso3D(a / 2, a * Math.sqrt(3) / 6, h, cx, cy, scale),    // D (sommet)
        ];
        const labels = ['A', 'B', 'C', 'D'];

        // Aretes cachees
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = 'rgba(0,0,0,0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(v[0].x, v[0].y); ctx.lineTo(v[2].x, v[2].y); ctx.stroke();
        ctx.setLineDash([]);

        // Aretes visibles
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1.5;
        [[0, 1], [1, 2], [0, 3], [1, 3], [2, 3]].forEach(([i, j]) => {
            ctx.beginPath(); ctx.moveTo(v[i].x, v[i].y); ctx.lineTo(v[j].x, v[j].y); ctx.stroke();
        });

        // Section
        ctx.fillStyle = 'rgba(46,204,113,0.25)';
        ctx.strokeStyle = '#27ae60';
        ctx.lineWidth = 2.5;

        if (ex.sectionType === 'milieux_aretes') {
            // Milieux de AB, BC, CA
            const mid = (i, j) => ({ x: (v[i].x + v[j].x) / 2, y: (v[i].y + v[j].y) / 2 });
            const pts = [mid(0, 1), mid(1, 2), mid(0, 2)];
            ctx.beginPath();
            pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        } else {
            // Plan parallele a BCD passant a mi-hauteur
            const k = 0.5;
            const pts = [
                { x: v[3].x + k * (v[1].x - v[3].x), y: v[3].y + k * (v[1].y - v[3].y) },
                { x: v[3].x + k * (v[2].x - v[3].x), y: v[3].y + k * (v[2].y - v[3].y) },
                { x: v[3].x + k * (v[0].x - v[3].x), y: v[3].y + k * (v[0].y - v[3].y) },
            ];
            ctx.beginPath();
            pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }

        // Labels
        v.forEach((p, i) => {
            ctx.fillStyle = '#333';
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(labels[i], p.x, p.y + (i === 3 ? -10 : 16));
        });
    }
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
    initGeoEspPage();
});
