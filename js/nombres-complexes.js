/* ========================================
   NOMBRES-COMPLEXES.JS - Nombres Complexes (Terminale Spe)
   ======================================== */

/**
 * Etat du module Nombres Complexes
 */
const ComplexState = {
    currentType: 'algebrique',

    subtype_algebrique: 'addition',
    subtype_trigonometrique: 'algebrique_vers_trigo',
    subtype_module_argument: 'module',
    subtype_equations: 'second_degre',
    subtype_geometrie: 'distance',

    exercise: {}
};

// ========================================
// Utilitaires locaux
// ========================================

function K(tex) {
    return katex.renderToString(tex, { throwOnError: false });
}

function randInt(min, max, exclude) {
    const excl = exclude || [];
    let val;
    do {
        val = Math.floor(Math.random() * (max - min + 1)) + min;
    } while (excl.includes(val));
    return val;
}

function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Formate un nombre complexe a + bi en LaTeX
function formatComplexTeX(a, b) {
    if (a === 0 && b === 0) return '0';
    if (a === 0) {
        if (b === 1) return 'i';
        if (b === -1) return '-i';
        return b + 'i';
    }
    if (b === 0) return String(a);
    const signB = b > 0 ? '+' : '-';
    const absB = Math.abs(b);
    const bPart = absB === 1 ? 'i' : absB + 'i';
    return a + ' ' + signB + ' ' + bPart;
}

// Formate z pour affichage dans un enonce (avec parentheses si necessaire)
function formatComplexParens(a, b) {
    if (a === 0 && b === 0) return '0';
    if (b === 0) return String(a);
    if (a === 0) {
        if (b === 1) return 'i';
        if (b === -1) return '-i';
        return b + 'i';
    }
    return '(' + formatComplexTeX(a, b) + ')';
}

// PGCD simple
function gcdLocal(a, b) {
    a = Math.abs(a); b = Math.abs(b);
    while (b) { [a, b] = [b, a % b]; }
    return a;
}

// Simplifier une fraction
function simplifyFrac(num, den) {
    if (den === 0) return { num: num, den: 1 };
    const g = gcdLocal(Math.abs(num), Math.abs(den));
    const sign = den < 0 ? -1 : 1;
    return { num: sign * num / g, den: sign * den / g };
}

// Angles remarquables: theta -> {cos_num, cos_den, sin_num, sin_den} (fractions de sqrt)
// Retourne cos et sin sous forme exacte pour les angles classiques
const ANGLES_REMARQUABLES = [
    { k: 0, label: '0', cos: '1', sin: '0', cosVal: 1, sinVal: 0 },
    { k: 1, label: '\\frac{\\pi}{6}', cos: '\\frac{\\sqrt{3}}{2}', sin: '\\frac{1}{2}', cosVal: Math.sqrt(3)/2, sinVal: 0.5 },
    { k: 2, label: '\\frac{\\pi}{4}', cos: '\\frac{\\sqrt{2}}{2}', sin: '\\frac{\\sqrt{2}}{2}', cosVal: Math.sqrt(2)/2, sinVal: Math.sqrt(2)/2 },
    { k: 3, label: '\\frac{\\pi}{3}', cos: '\\frac{1}{2}', sin: '\\frac{\\sqrt{3}}{2}', cosVal: 0.5, sinVal: Math.sqrt(3)/2 },
    { k: 4, label: '\\frac{\\pi}{2}', cos: '0', sin: '1', cosVal: 0, sinVal: 1 },
    { k: 5, label: '\\frac{2\\pi}{3}', cos: '-\\frac{1}{2}', sin: '\\frac{\\sqrt{3}}{2}', cosVal: -0.5, sinVal: Math.sqrt(3)/2 },
    { k: 6, label: '\\frac{3\\pi}{4}', cos: '-\\frac{\\sqrt{2}}{2}', sin: '\\frac{\\sqrt{2}}{2}', cosVal: -Math.sqrt(2)/2, sinVal: Math.sqrt(2)/2 },
    { k: 7, label: '\\frac{5\\pi}{6}', cos: '-\\frac{\\sqrt{3}}{2}', sin: '\\frac{1}{2}', cosVal: -Math.sqrt(3)/2, sinVal: 0.5 },
    { k: 8, label: '\\pi', cos: '-1', sin: '0', cosVal: -1, sinVal: 0 },
    { k: 9, label: '\\frac{7\\pi}{6}', cos: '-\\frac{\\sqrt{3}}{2}', sin: '-\\frac{1}{2}', cosVal: -Math.sqrt(3)/2, sinVal: -0.5 },
    { k: 10, label: '\\frac{5\\pi}{4}', cos: '-\\frac{\\sqrt{2}}{2}', sin: '-\\frac{\\sqrt{2}}{2}', cosVal: -Math.sqrt(2)/2, sinVal: -Math.sqrt(2)/2 },
    { k: 11, label: '\\frac{4\\pi}{3}', cos: '-\\frac{1}{2}', sin: '-\\frac{\\sqrt{3}}{2}', cosVal: -0.5, sinVal: -Math.sqrt(3)/2 },
    { k: 12, label: '\\frac{3\\pi}{2}', cos: '0', sin: '-1', cosVal: 0, sinVal: -1 },
    { k: 13, label: '\\frac{5\\pi}{3}', cos: '\\frac{1}{2}', sin: '-\\frac{\\sqrt{3}}{2}', cosVal: 0.5, sinVal: -Math.sqrt(3)/2 },
    { k: 14, label: '\\frac{7\\pi}{4}', cos: '\\frac{\\sqrt{2}}{2}', sin: '-\\frac{\\sqrt{2}}{2}', cosVal: Math.sqrt(2)/2, sinVal: -Math.sqrt(2)/2 },
    { k: 15, label: '\\frac{11\\pi}{6}', cos: '\\frac{\\sqrt{3}}{2}', sin: '-\\frac{1}{2}', cosVal: Math.sqrt(3)/2, sinVal: -0.5 },
];

// Angles pour exercices trigo (premier et deuxieme quadrant principalement)
const ANGLES_EXERCICES = ANGLES_REMARQUABLES.filter(a => a.k >= 1 && a.k <= 7);

// Calculer module exact : sqrt(a^2 + b^2) avec simplification
function moduleExact(a, b) {
    const sum = a * a + b * b;
    // Chercher si c'est un carre parfait
    const sqrtSum = Math.sqrt(sum);
    if (Math.abs(sqrtSum - Math.round(sqrtSum)) < 1e-9) {
        return { value: Math.round(sqrtSum), tex: String(Math.round(sqrtSum)), isSqrt: false };
    }
    // Simplifier sqrt(n) = k*sqrt(m)
    let inside = sum;
    let outside = 1;
    for (let d = 2; d * d <= inside; d++) {
        while (inside % (d * d) === 0) {
            inside /= (d * d);
            outside *= d;
        }
    }
    if (outside === 1) {
        return { value: sqrtSum, tex: '\\sqrt{' + sum + '}', isSqrt: true };
    }
    return { value: sqrtSum, tex: outside + '\\sqrt{' + inside + '}', isSqrt: true };
}

// Calculer l'argument en fraction de pi
function argumentExact(a, b) {
    if (a === 0 && b === 0) return { tex: '\\text{non defini}', value: 0 };

    const angle = Math.atan2(b, a);

    // Tester les angles remarquables
    for (const ar of ANGLES_REMARQUABLES) {
        const refAngle = ar.k * Math.PI / 8;
        // Calculer l'angle reel
        const realAngle = Math.atan2(ar.sinVal, ar.cosVal);
        if (Math.abs(angle - realAngle) < 1e-9 || Math.abs(angle - realAngle + 2 * Math.PI) < 1e-9 || Math.abs(angle - realAngle - 2 * Math.PI) < 1e-9) {
            // Convertir en angle dans ]-pi, pi]
            let label = ar.label;
            if (ar.k > 8) {
                // Convertir en negatif
                const negK = ar.k - 16;
                const negAngle = ANGLES_REMARQUABLES.find(x => x.k === (16 + negK) % 16);
                // Recalculer le label negatif
                switch (ar.k) {
                    case 9: label = '-\\frac{5\\pi}{6}'; break;
                    case 10: label = '-\\frac{3\\pi}{4}'; break;
                    case 11: label = '-\\frac{2\\pi}{3}'; break;
                    case 12: label = '-\\frac{\\pi}{2}'; break;
                    case 13: label = '-\\frac{\\pi}{3}'; break;
                    case 14: label = '-\\frac{\\pi}{4}'; break;
                    case 15: label = '-\\frac{\\pi}{6}'; break;
                }
            }
            return { tex: label, value: angle };
        }
    }

    // Angle non remarquable
    const deg = angle * 180 / Math.PI;
    return { tex: (angle >= 0 ? '' : '-') + String(Math.abs(Math.round(deg * 100) / 100)) + '^\\circ', value: angle };
}

// ========================================
// Initialisation
// ========================================

function initComplexesPage() {
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
            ComplexState.currentType = button.dataset.type;

            document.querySelectorAll('[id$="Section"]').forEach(section => {
                section.style.display = 'none';
            });

            const sectionMap = {
                'algebrique': 'algebriqueSection',
                'trigonometrique': 'trigonometriqueSection',
                'module_argument': 'module_argumentSection',
                'equations': 'equationsSection',
                'geometrie': 'geometrieSection'
            };
            const sectionId = sectionMap[ComplexState.currentType];
            if (sectionId) {
                $(sectionId).style.display = 'block';
            }

            generateNewExercise();
            updateExerciseDisplay();
            hideSolution('solutionDiv');
        });
    });
}

function setupInputHandlers() {
    const selects = [
        'subtype_algebrique', 'subtype_trigonometrique', 'subtype_module_argument',
        'subtype_equations', 'subtype_geometrie'
    ];
    selects.forEach(id => {
        const el = $(id);
        if (el) {
            el.addEventListener('change', () => {
                ComplexState[id] = el.value;
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
        solveExercise();
    });
}

// ========================================
// Generation des exercices
// ========================================

function generateNewExercise() {
    const type = ComplexState.currentType;
    const ex = {};

    switch (type) {
        case 'algebrique':
            generateAlgebrique(ex);
            break;
        case 'trigonometrique':
            generateTrigonometrique(ex);
            break;
        case 'module_argument':
            generateModuleArgument(ex);
            break;
        case 'equations':
            generateEquations(ex);
            break;
        case 'geometrie':
            generateGeometrie(ex);
            break;
    }

    ComplexState.exercise = ex;
}

function generateAlgebrique(ex) {
    const sub = ComplexState.subtype_algebrique;
    // Generer deux nombres complexes
    ex.a1 = randInt(-8, 8, [0]);
    ex.b1 = randInt(-8, 8, [0]);
    ex.a2 = randInt(-8, 8, [0]);
    ex.b2 = randInt(-8, 8, [0]);

    if (sub === 'inverse') {
        // Un seul nombre complexe, non nul
        ex.a2 = undefined;
        ex.b2 = undefined;
    } else if (sub === 'conjugue') {
        ex.a2 = undefined;
        ex.b2 = undefined;
    } else if (sub === 'quotient') {
        // S'assurer que le denominateur n'est pas nul
        if (ex.a2 === 0 && ex.b2 === 0) {
            ex.a2 = randInt(1, 5);
        }
    }
}

function generateTrigonometrique(ex) {
    const sub = ComplexState.subtype_trigonometrique;

    if (sub === 'algebrique_vers_trigo') {
        // Generer un complexe dont le module et l'argument sont "jolis"
        const angle = pick(ANGLES_EXERCICES);
        const r = pick([1, 2, 3, 4]);
        ex.a = Math.round(r * angle.cosVal * 1000) / 1000;
        ex.b = Math.round(r * angle.sinVal * 1000) / 1000;
        // Arrondir a des entiers si possible
        if (Math.abs(ex.a - Math.round(ex.a)) < 1e-6) ex.a = Math.round(ex.a);
        if (Math.abs(ex.b - Math.round(ex.b)) < 1e-6) ex.b = Math.round(ex.b);
        ex.r = r;
        ex.angle = angle;
    } else if (sub === 'trigo_vers_algebrique') {
        const angle = pick(ANGLES_EXERCICES);
        ex.r = pick([1, 2, 3, 5]);
        ex.angle = angle;
    } else if (sub === 'produit_trigo') {
        const angle1 = pick(ANGLES_EXERCICES);
        const angle2 = pick(ANGLES_EXERCICES);
        ex.r1 = pick([1, 2, 3]);
        ex.r2 = pick([1, 2, 3]);
        ex.angle1 = angle1;
        ex.angle2 = angle2;
    } else if (sub === 'puissance_moivre') {
        const angle = pick(ANGLES_EXERCICES.filter(a => a.k <= 4));
        ex.r = pick([1, 2]);
        ex.angle = angle;
        ex.n = randInt(2, 6);
    }
}

function generateModuleArgument(ex) {
    const sub = ComplexState.subtype_module_argument;

    if (sub === 'module') {
        ex.a = randInt(-8, 8, [0]);
        ex.b = randInt(-8, 8, [0]);
    } else if (sub === 'argument') {
        // Choisir un angle remarquable pour que la reponse soit exacte
        const angle = pick(ANGLES_EXERCICES);
        const r = pick([1, 2, 3]);
        ex.a = Math.round(r * angle.cosVal * 1000) / 1000;
        ex.b = Math.round(r * angle.sinVal * 1000) / 1000;
        if (Math.abs(ex.a - Math.round(ex.a)) < 1e-6) ex.a = Math.round(ex.a);
        if (Math.abs(ex.b - Math.round(ex.b)) < 1e-6) ex.b = Math.round(ex.b);
        ex.angle = angle;
        ex.r = r;
    } else if (sub === 'ensemble') {
        // |z - zA| = r (cercle) ou |z - zA| = |z - zB| (mediatrice)
        ex.ensType = pick(['cercle', 'mediatrice']);
        ex.xa = randInt(-4, 4);
        ex.ya = randInt(-4, 4);
        if (ex.ensType === 'cercle') {
            ex.rayon = randInt(1, 5);
        } else {
            ex.xb = randInt(-4, 4);
            ex.yb = randInt(-4, 4);
            if (ex.xa === ex.xb && ex.ya === ex.yb) {
                ex.xb = ex.xa + randInt(1, 3);
            }
        }
    }
}

function generateEquations(ex) {
    const sub = ComplexState.subtype_equations;

    if (sub === 'second_degre') {
        // az^2 + bz + c = 0 avec discriminant negatif
        // On part des racines : z = alpha +/- beta*i
        const alpha = randInt(-4, 4);
        const beta = randInt(1, 5);
        // (z - (alpha+beta*i))(z - (alpha-beta*i)) = z^2 - 2*alpha*z + (alpha^2 + beta^2)
        ex.eqA = 1;
        ex.eqB = -2 * alpha;
        ex.eqC = alpha * alpha + beta * beta;
        ex.alpha = alpha;
        ex.beta = beta;
    } else if (sub === 'z_carre') {
        // z^2 = w, generer w avec des valeurs sympathiques
        // w = a + bi
        // On choisit z = p + qi puis w = z^2
        const p = randInt(-4, 4, [0]);
        const q = randInt(-4, 4, [0]);
        ex.wa = p * p - q * q;
        ex.wb = 2 * p * q;
        ex.solP = p;
        ex.solQ = q;
    } else if (sub === 'lineaire') {
        // az + b*conj(z) = c avec a, b, c complexes simples
        // On pose z = x + iy, conj(z) = x - iy
        // (a+b)x + (a-b)iy = c
        ex.coeffA_re = randInt(1, 5);
        ex.coeffA_im = randInt(-3, 3);
        ex.coeffB_re = randInt(1, 5);
        ex.coeffB_im = randInt(-3, 3);
        // Resultat : on choisit z = x0 + iy0 et on calcule c
        const x0 = randInt(-3, 3);
        const y0 = randInt(-3, 3, [0]);
        // c = a*z + b*conj(z) = (aRe + aIm*i)(x0 + y0*i) + (bRe + bIm*i)(x0 - y0*i)
        const az_re = ex.coeffA_re * x0 - ex.coeffA_im * y0;
        const az_im = ex.coeffA_re * y0 + ex.coeffA_im * x0;
        const bz_re = ex.coeffB_re * x0 + ex.coeffB_im * y0;
        const bz_im = -ex.coeffB_re * y0 + ex.coeffB_im * x0;
        ex.c_re = az_re + bz_re;
        ex.c_im = az_im + bz_im;
        ex.solX = x0;
        ex.solY = y0;
    }
}

function generateGeometrie(ex) {
    const sub = ComplexState.subtype_geometrie;

    if (sub === 'distance') {
        ex.xa = randInt(-5, 5);
        ex.ya = randInt(-5, 5);
        ex.xb = randInt(-5, 5);
        ex.yb = randInt(-5, 5);
        if (ex.xa === ex.xb && ex.ya === ex.yb) {
            ex.xb = ex.xa + randInt(1, 3);
        }
    } else if (sub === 'milieu') {
        // Generer des coordonnees paires pour avoir un milieu entier
        ex.xa = randInt(-6, 6);
        ex.ya = randInt(-6, 6);
        ex.xb = randInt(-6, 6);
        ex.yb = randInt(-6, 6);
    } else if (sub === 'translation') {
        ex.xa = randInt(-5, 5);
        ex.ya = randInt(-5, 5);
        ex.tx = randInt(-4, 4, [0]);
        ex.ty = randInt(-4, 4, [0]);
    } else if (sub === 'rotation') {
        ex.xa = randInt(-4, 4);
        ex.ya = randInt(-4, 4);
        // Centre de rotation
        ex.cx = randInt(-3, 3);
        ex.cy = randInt(-3, 3);
        // Angle de rotation : angle remarquable
        ex.rotAngle = pick([
            { label: '\\frac{\\pi}{2}', cos: 0, sin: 1 },
            { label: '-\\frac{\\pi}{2}', cos: 0, sin: -1 },
            { label: '\\pi', cos: -1, sin: 0 },
            { label: '\\frac{\\pi}{3}', cos: 0.5, sin: Math.sqrt(3)/2 },
            { label: '-\\frac{\\pi}{3}', cos: 0.5, sin: -Math.sqrt(3)/2 },
            { label: '\\frac{\\pi}{4}', cos: Math.sqrt(2)/2, sin: Math.sqrt(2)/2 },
            { label: '-\\frac{\\pi}{4}', cos: Math.sqrt(2)/2, sin: -Math.sqrt(2)/2 },
        ]);
    }
}

// ========================================
// Affichage de l'exercice
// ========================================

function updateExerciseDisplay() {
    const type = ComplexState.currentType;
    const ex = ComplexState.exercise;
    let display = '';

    switch (type) {
        case 'algebrique':
            display = displayAlgebrique(ex);
            break;
        case 'trigonometrique':
            display = displayTrigonometrique(ex);
            break;
        case 'module_argument':
            display = displayModuleArgument(ex);
            break;
        case 'equations':
            display = displayEquations(ex);
            break;
        case 'geometrie':
            display = displayGeometrie(ex);
            break;
    }

    $('expressionDisplay').innerHTML = display;
}

function displayAlgebrique(ex) {
    const sub = ComplexState.subtype_algebrique;
    const z1 = formatComplexTeX(ex.a1, ex.b1);
    const z2 = (ex.a2 !== undefined) ? formatComplexTeX(ex.a2, ex.b2) : '';

    if (sub === 'addition') {
        return 'Calculer ' + K('z_1 + z_2') + ' avec ' +
            K('z_1 = ' + z1) + ' et ' + K('z_2 = ' + z2);
    } else if (sub === 'multiplication') {
        return 'Calculer ' + K('z_1 \\times z_2') + ' avec ' +
            K('z_1 = ' + z1) + ' et ' + K('z_2 = ' + z2);
    } else if (sub === 'conjugue') {
        return 'Determiner le conjugue ' + K('\\bar{z}') + ' de ' + K('z = ' + z1);
    } else if (sub === 'inverse') {
        return 'Calculer ' + K('\\dfrac{1}{z}') + ' avec ' + K('z = ' + z1);
    } else if (sub === 'quotient') {
        return 'Calculer ' + K('\\dfrac{z_1}{z_2}') + ' avec ' +
            K('z_1 = ' + z1) + ' et ' + K('z_2 = ' + z2);
    }
    return '';
}

function displayTrigonometrique(ex) {
    const sub = ComplexState.subtype_trigonometrique;

    if (sub === 'algebrique_vers_trigo') {
        const z = formatComplexTeX(ex.a, ex.b);
        return 'Ecrire ' + K('z = ' + z) + ' sous forme trigonometrique et exponentielle';
    } else if (sub === 'trigo_vers_algebrique') {
        return 'Ecrire sous forme algebrique : ' +
            K('z = ' + ex.r + 'e^{i' + ex.angle.label + '}');
    } else if (sub === 'produit_trigo') {
        const z1 = ex.r1 + 'e^{i' + ex.angle1.label + '}';
        const z2 = ex.r2 + 'e^{i' + ex.angle2.label + '}';
        return 'Calculer ' + K('z_1 \\times z_2') + ' avec ' +
            K('z_1 = ' + z1) + ' et ' + K('z_2 = ' + z2);
    } else if (sub === 'puissance_moivre') {
        const z = ex.r === 1
            ? 'e^{i' + ex.angle.label + '}'
            : ex.r + 'e^{i' + ex.angle.label + '}';
        return 'Calculer ' + K('z^{' + ex.n + '}') + ' avec ' + K('z = ' + z) +
            ' (formule de Moivre)';
    }
    return '';
}

function displayModuleArgument(ex) {
    const sub = ComplexState.subtype_module_argument;

    if (sub === 'module') {
        const z = formatComplexTeX(ex.a, ex.b);
        return 'Calculer le module de ' + K('z = ' + z);
    } else if (sub === 'argument') {
        const z = formatComplexTeX(ex.a, ex.b);
        return 'Determiner l\'argument de ' + K('z = ' + z);
    } else if (sub === 'ensemble') {
        const zA = formatComplexTeX(ex.xa, ex.ya);
        if (ex.ensType === 'cercle') {
            return 'Determiner l\'ensemble des points ' + K('M') + ' d\'affixe ' +
                K('z') + ' tels que ' + K('|z - (' + zA + ')| = ' + ex.rayon);
        } else {
            const zB = formatComplexTeX(ex.xb, ex.yb);
            return 'Determiner l\'ensemble des points ' + K('M') + ' d\'affixe ' +
                K('z') + ' tels que ' + K('|z - (' + zA + ')| = |z - (' + zB + ')|');
        }
    }
    return '';
}

function displayEquations(ex) {
    const sub = ComplexState.subtype_equations;

    if (sub === 'second_degre') {
        let eq = 'z^2';
        if (ex.eqB !== 0) {
            const signB = ex.eqB > 0 ? '+' : '-';
            eq += ' ' + signB + ' ' + Math.abs(ex.eqB) + 'z';
        }
        const signC = ex.eqC > 0 ? '+' : '-';
        eq += ' ' + signC + ' ' + Math.abs(ex.eqC) + ' = 0';
        return 'Resoudre dans ' + K('\\mathbb{C}') + ' : ' + K(eq);
    } else if (sub === 'z_carre') {
        const w = formatComplexTeX(ex.wa, ex.wb);
        return 'Resoudre dans ' + K('\\mathbb{C}') + ' : ' + K('z^2 = ' + w);
    } else if (sub === 'lineaire') {
        const a = formatComplexParens(ex.coeffA_re, ex.coeffA_im);
        const b = formatComplexParens(ex.coeffB_re, ex.coeffB_im);
        const c = formatComplexTeX(ex.c_re, ex.c_im);
        return 'Resoudre : ' + K(a + 'z + ' + b + '\\bar{z} = ' + c);
    }
    return '';
}

function displayGeometrie(ex) {
    const sub = ComplexState.subtype_geometrie;

    if (sub === 'distance') {
        const zA = formatComplexTeX(ex.xa, ex.ya);
        const zB = formatComplexTeX(ex.xb, ex.yb);
        return 'Calculer la distance ' + K('AB') + ' avec ' +
            K('z_A = ' + zA) + ' et ' + K('z_B = ' + zB);
    } else if (sub === 'milieu') {
        const zA = formatComplexTeX(ex.xa, ex.ya);
        const zB = formatComplexTeX(ex.xb, ex.yb);
        return 'Determiner l\'affixe du milieu ' + K('I') + ' de ' + K('[AB]') +
            ' avec ' + K('z_A = ' + zA) + ' et ' + K('z_B = ' + zB);
    } else if (sub === 'translation') {
        const zA = formatComplexTeX(ex.xa, ex.ya);
        const t = formatComplexTeX(ex.tx, ex.ty);
        return 'Determiner l\'image de ' + K('A') + ' d\'affixe ' + K('z_A = ' + zA) +
            ' par la translation de vecteur d\'affixe ' + K('t = ' + t);
    } else if (sub === 'rotation') {
        const zA = formatComplexTeX(ex.xa, ex.ya);
        const zC = formatComplexTeX(ex.cx, ex.cy);
        return 'Determiner l\'image de ' + K('A') + ' d\'affixe ' + K('z_A = ' + zA) +
            ' par la rotation de centre ' + K('\\Omega') + ' d\'affixe ' +
            K('z_\\Omega = ' + zC) + ' et d\'angle ' + K(ex.rotAngle.label);
    }
    return '';
}

// ========================================
// Resolution des exercices
// ========================================

function solveExercise() {
    const type = ComplexState.currentType;
    const ex = ComplexState.exercise;
    let html = '';

    switch (type) {
        case 'algebrique':
            html = solveAlgebrique(ex);
            break;
        case 'trigonometrique':
            html = solveTrigonometrique(ex);
            break;
        case 'module_argument':
            html = solveModuleArgument(ex);
            break;
        case 'equations':
            html = solveEquations(ex);
            break;
        case 'geometrie':
            html = solveGeometrie(ex);
            break;
    }

    $('stepsContainer').innerHTML = html;
    showSolution('solutionDiv');
}

// ---- Forme algebrique ----

function solveAlgebrique(ex) {
    const sub = ComplexState.subtype_algebrique;

    switch (sub) {
        case 'addition': return solveAddition(ex);
        case 'multiplication': return solveMultiplication(ex);
        case 'conjugue': return solveConjugue(ex);
        case 'inverse': return solveInverse(ex);
        case 'quotient': return solveQuotient(ex);
    }
    return '';
}

function solveAddition(ex) {
    let html = '';
    const a1 = ex.a1, b1 = ex.b1, a2 = ex.a2, b2 = ex.b2;
    const resA = a1 + a2;
    const resB = b1 + b2;

    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : Rappel</div>';
    html += '<div class="step-explanation">Pour additionner deux complexes, on additionne les parties reelles et les parties imaginaires separement.</div>';
    html += '</div>';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 2 : Calcul</div>';
    html += '<div class="step-expression">' +
        K('z_1 + z_2 = (' + formatComplexTeX(a1, b1) + ') + (' + formatComplexTeX(a2, b2) + ')') + '</div>';
    html += '<div class="step-expression">' +
        K('= (' + a1 + ' + ' + (a2 >= 0 ? a2 : '(' + a2 + ')') + ') + (' + b1 + ' + ' + (b2 >= 0 ? b2 : '(' + b2 + ')') + ')i') + '</div>';
    html += '<div class="step-expression">' +
        K('= ' + resA + (resB >= 0 ? ' + ' : ' - ') + Math.abs(resB) + 'i') + '</div>';
    html += '</div>';

    html += '<div class="result-highlight">';
    html += '<div class="final">' + K('z_1 + z_2 = \\boxed{' + formatComplexTeX(resA, resB) + '}') + '</div>';
    html += '</div>';

    return html;
}

function solveMultiplication(ex) {
    let html = '';
    const a1 = ex.a1, b1 = ex.b1, a2 = ex.a2, b2 = ex.b2;
    // (a1+b1i)(a2+b2i) = (a1a2 - b1b2) + (a1b2 + b1a2)i
    const resA = a1 * a2 - b1 * b2;
    const resB = a1 * b2 + b1 * a2;

    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : Developpement</div>';
    html += '<div class="step-expression">' +
        K('z_1 \\times z_2 = (' + formatComplexTeX(a1, b1) + ')(' + formatComplexTeX(a2, b2) + ')') + '</div>';
    html += '</div>';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 2 : Calcul detaille</div>';
    html += '<div class="step-expression">' +
        K('= ' + a1 + ' \\times ' + (a2 >= 0 ? a2 : '(' + a2 + ')') +
        ' + ' + a1 + ' \\times ' + (b2 >= 0 ? '(' + b2 + 'i)' : '(' + b2 + 'i)') +
        ' + ' + (b1 >= 0 ? b1 : '(' + b1 + ')') + 'i \\times ' + (a2 >= 0 ? a2 : '(' + a2 + ')') +
        ' + ' + (b1 >= 0 ? b1 : '(' + b1 + ')') + 'i \\times ' + (b2 >= 0 ? '(' + b2 + 'i)' : '(' + b2 + 'i)')) + '</div>';

    html += '<div class="step-expression">' +
        K('= ' + (a1 * a2) + ' + ' + (a1 * b2) + 'i + ' + (b1 * a2) + 'i + ' + (b1 * b2) + 'i^2') + '</div>';

    html += '<div class="step-explanation">On utilise ' + K('i^2 = -1') + '</div>';

    html += '<div class="step-expression">' +
        K('= ' + (a1 * a2) + ' + ' + (a1 * b2) + 'i + ' + (b1 * a2) + 'i ' + (b1 * b2 >= 0 ? '- ' + (b1 * b2) : '+ ' + Math.abs(b1 * b2))) + '</div>';

    html += '<div class="step-expression">' +
        K('= (' + (a1 * a2) + ((-b1 * b2) >= 0 ? ' + ' : ' - ') + Math.abs(b1 * b2) + ') + (' + (a1 * b2) + ' + ' + (b1 * a2) + ')i') + '</div>';

    html += '</div>';

    html += '<div class="result-highlight">';
    html += '<div class="final">' + K('z_1 \\times z_2 = \\boxed{' + formatComplexTeX(resA, resB) + '}') + '</div>';
    html += '</div>';

    return html;
}

function solveConjugue(ex) {
    let html = '';
    const a = ex.a1, b = ex.b1;

    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : Rappel</div>';
    html += '<div class="step-explanation">Le conjugue de ' + K('z = a + bi') + ' est ' + K('\\bar{z} = a - bi') +
        '.<br>On change le signe de la partie imaginaire.</div>';
    html += '</div>';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 2 : Application</div>';
    html += '<div class="step-expression">' +
        K('z = ' + formatComplexTeX(a, b)) + '</div>';
    html += '<div class="step-expression">' +
        K('\\bar{z} = ' + formatComplexTeX(a, -b)) + '</div>';
    html += '</div>';

    html += '<div class="step">';
    html += '<div class="step-number">Verification</div>';
    const mod2 = a * a + b * b;
    html += '<div class="step-explanation">' +
        K('z \\cdot \\bar{z} = |z|^2 = ' + a + '^2 + ' + (b >= 0 ? b : '(' + b + ')') + '^2 = ' + (a * a) + ' + ' + (b * b) + ' = ' + mod2) + '</div>';
    html += '</div>';

    html += '<div class="result-highlight">';
    html += '<div class="final">' + K('\\bar{z} = \\boxed{' + formatComplexTeX(a, -b) + '}') + '</div>';
    html += '</div>';

    return html;
}

function solveInverse(ex) {
    let html = '';
    const a = ex.a1, b = ex.b1;
    const mod2 = a * a + b * b;

    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : Formule</div>';
    html += '<div class="step-expression">' +
        K('\\frac{1}{z} = \\frac{\\bar{z}}{|z|^2} = \\frac{\\bar{z}}{z \\cdot \\bar{z}}') + '</div>';
    html += '</div>';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 2 : Module carre</div>';
    html += '<div class="step-expression">' +
        K('|z|^2 = ' + a + '^2 + ' + (b >= 0 ? b : '(' + b + ')') + '^2 = ' + (a * a) + ' + ' + (b * b) + ' = ' + mod2) + '</div>';
    html += '</div>';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 3 : Conjugue</div>';
    html += '<div class="step-expression">' +
        K('\\bar{z} = ' + formatComplexTeX(a, -b)) + '</div>';
    html += '</div>';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 4 : Calcul</div>';

    const g = gcdLocal(Math.abs(a), gcdLocal(Math.abs(b), mod2));
    const numA = a / g;
    const numB = -b / g;
    const den = mod2 / g;

    if (den === 1) {
        html += '<div class="step-expression">' +
            K('\\frac{1}{z} = ' + formatComplexTeX(numA, numB)) + '</div>';
    } else {
        html += '<div class="step-expression">' +
            K('\\frac{1}{z} = \\frac{' + formatComplexTeX(a, -b) + '}{' + mod2 + '}') + '</div>';
        if (g > 1) {
            html += '<div class="step-expression">' +
                K('= \\frac{' + formatComplexTeX(numA, numB) + '}{' + den + '}') + '</div>';
        }
    }
    html += '</div>';

    // Resultat en fraction
    let resTex;
    if (den === 1) {
        resTex = formatComplexTeX(numA, numB);
    } else {
        const fA = simplifyFrac(a, mod2);
        const fB = simplifyFrac(-b, mod2);
        const partRe = fA.den === 1 ? String(fA.num) : '\\frac{' + fA.num + '}{' + fA.den + '}';
        const partIm = fB.den === 1 ? Math.abs(fB.num) : '\\frac{' + Math.abs(fB.num) + '}{' + fB.den + '}';
        const signIm = fB.num >= 0 ? '+' : '-';
        resTex = partRe + ' ' + signIm + ' ' + partIm + 'i';
    }

    html += '<div class="result-highlight">';
    html += '<div class="final">' + K('\\frac{1}{z} = \\boxed{' + resTex + '}') + '</div>';
    html += '</div>';

    return html;
}

function solveQuotient(ex) {
    let html = '';
    const a1 = ex.a1, b1 = ex.b1, a2 = ex.a2, b2 = ex.b2;
    const mod2 = a2 * a2 + b2 * b2;

    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : Methode</div>';
    html += '<div class="step-explanation">On multiplie numerateur et denominateur par le conjugue du denominateur.</div>';
    html += '<div class="step-expression">' +
        K('\\frac{z_1}{z_2} = \\frac{z_1 \\cdot \\bar{z_2}}{z_2 \\cdot \\bar{z_2}} = \\frac{z_1 \\cdot \\bar{z_2}}{|z_2|^2}') + '</div>';
    html += '</div>';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 2 : Conjugue et module</div>';
    html += '<div class="step-expression">' +
        K('\\bar{z_2} = ' + formatComplexTeX(a2, -b2)) + '<br>' +
        K('|z_2|^2 = ' + a2 + '^2 + ' + (b2 >= 0 ? b2 : '(' + b2 + ')') + '^2 = ' + mod2) + '</div>';
    html += '</div>';

    // Numerateur: z1 * conj(z2)
    const numA = a1 * a2 + b1 * b2;
    const numB = -a1 * b2 + b1 * a2;

    html += '<div class="step">';
    html += '<div class="step-number">Etape 3 : Numerateur</div>';
    html += '<div class="step-expression">' +
        K('z_1 \\cdot \\bar{z_2} = (' + formatComplexTeX(a1, b1) + ')(' + formatComplexTeX(a2, -b2) + ')') + '</div>';
    html += '<div class="step-expression">' +
        K('= ' + formatComplexTeX(numA, numB)) + '</div>';
    html += '</div>';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 4 : Resultat</div>';
    html += '<div class="step-expression">' +
        K('\\frac{z_1}{z_2} = \\frac{' + formatComplexTeX(numA, numB) + '}{' + mod2 + '}') + '</div>';

    // Simplifier
    const fA = simplifyFrac(numA, mod2);
    const fB = simplifyFrac(numB, mod2);

    let resTex;
    if (fA.den === 1 && fB.den === 1) {
        resTex = formatComplexTeX(fA.num, fB.num);
    } else {
        const partRe = fA.den === 1 ? String(fA.num) : '\\frac{' + fA.num + '}{' + fA.den + '}';
        const absNum = Math.abs(fB.num);
        const partIm = fB.den === 1 ? (absNum === 1 ? '' : String(absNum)) : '\\frac{' + absNum + '}{' + fB.den + '}';
        const signIm = fB.num >= 0 ? '+' : '-';
        resTex = partRe + ' ' + signIm + ' ' + partIm + 'i';
    }

    html += '<div class="step-expression">' +
        K('= ' + resTex) + '</div>';
    html += '</div>';

    html += '<div class="result-highlight">';
    html += '<div class="final">' + K('\\frac{z_1}{z_2} = \\boxed{' + resTex + '}') + '</div>';
    html += '</div>';

    return html;
}

// ---- Forme trigonometrique ----

function solveTrigonometrique(ex) {
    const sub = ComplexState.subtype_trigonometrique;

    switch (sub) {
        case 'algebrique_vers_trigo': return solveAlgVersTrigo(ex);
        case 'trigo_vers_algebrique': return solveTrigoVersAlg(ex);
        case 'produit_trigo': return solveProduitTrigo(ex);
        case 'puissance_moivre': return solveMoivre(ex);
    }
    return '';
}

function solveAlgVersTrigo(ex) {
    let html = '';
    const a = ex.a, b = ex.b;
    const mod = moduleExact(a, b);
    const arg = argumentExact(a, b);

    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : Module</div>';
    html += '<div class="step-expression">' +
        K('|z| = \\sqrt{' + (a >= 0 ? a : '(' + a + ')') + '^2 + ' + (b >= 0 ? b : '(' + b + ')') + '^2}') + '</div>';
    html += '<div class="step-expression">' +
        K('= \\sqrt{' + (a * a) + ' + ' + (b * b) + '} = \\sqrt{' + (a * a + b * b) + '} = ' + mod.tex) + '</div>';
    html += '</div>';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 2 : Argument</div>';
    html += '<div class="step-expression">' +
        K('\\cos\\theta = \\frac{a}{|z|} = \\frac{' + a + '}{' + mod.tex + '}') + '<br>' +
        K('\\sin\\theta = \\frac{b}{|z|} = \\frac{' + b + '}{' + mod.tex + '}') + '</div>';
    html += '<div class="step-expression">' +
        K('\\theta = ' + arg.tex) + '</div>';
    html += '</div>';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 3 : Formes</div>';
    const rLabel = mod.tex;
    html += '<div class="step-expression">';
    html += 'Forme trigonometrique : ' +
        K('z = ' + rLabel + '\\left(\\cos ' + arg.tex + ' + i\\sin ' + arg.tex + '\\right)') + '<br>';
    html += 'Forme exponentielle : ' +
        K('z = ' + rLabel + 'e^{i' + arg.tex + '}') + '</div>';
    html += '</div>';

    html += '<div class="result-highlight">';
    html += '<div class="final">' +
        K('z = \\boxed{' + rLabel + 'e^{i' + arg.tex + '}}') + '</div>';
    html += '</div>';

    return html;
}

function solveTrigoVersAlg(ex) {
    let html = '';
    const r = ex.r;
    const angle = ex.angle;

    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : Rappel</div>';
    html += '<div class="step-expression">' +
        K('z = r e^{i\\theta} = r(\\cos\\theta + i\\sin\\theta)') + '</div>';
    html += '</div>';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 2 : Valeurs trigonometriques</div>';
    html += '<div class="step-expression">' +
        K('\\cos\\left(' + angle.label + '\\right) = ' + angle.cos) + '<br>' +
        K('\\sin\\left(' + angle.label + '\\right) = ' + angle.sin) + '</div>';
    html += '</div>';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 3 : Calcul</div>';
    html += '<div class="step-expression">' +
        K('z = ' + r + '\\left(' + angle.cos + ' + i \\cdot ' + angle.sin + '\\right)') + '</div>';

    // Calculer les valeurs
    const aVal = Math.round(r * angle.cosVal * 1000) / 1000;
    const bVal = Math.round(r * angle.sinVal * 1000) / 1000;
    const aDisp = Math.abs(aVal - Math.round(aVal)) < 1e-6 ? Math.round(aVal) : aVal;
    const bDisp = Math.abs(bVal - Math.round(bVal)) < 1e-6 ? Math.round(bVal) : bVal;

    // Affichage exact avec r * cos, r * sin
    if (r !== 1) {
        let reTeX = r + ' \\times ' + angle.cos;
        let imTeX = r + ' \\times ' + angle.sin;
        html += '<div class="step-expression">' +
            K('= ' + reTeX + ' + i \\times ' + imTeX) + '</div>';
    }
    html += '</div>';

    // Resultat
    let resTex;
    // Essayer un affichage exact
    if (Number.isInteger(aDisp) && Number.isInteger(bDisp)) {
        resTex = formatComplexTeX(aDisp, bDisp);
    } else {
        // Affichage avec racines
        resTex = r + '\\cos ' + angle.label + ' + ' + r + 'i\\sin ' + angle.label;
    }

    html += '<div class="result-highlight">';
    html += '<div class="final">' + K('z = \\boxed{' + resTex + '}') + '</div>';
    html += '</div>';

    return html;
}

function solveProduitTrigo(ex) {
    let html = '';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : Regle du produit</div>';
    html += '<div class="step-expression">' +
        K('r_1 e^{i\\theta_1} \\times r_2 e^{i\\theta_2} = r_1 r_2 \\, e^{i(\\theta_1 + \\theta_2)}') + '</div>';
    html += '</div>';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 2 : Module du produit</div>';
    const rProd = ex.r1 * ex.r2;
    html += '<div class="step-expression">' +
        K('|z_1 \\times z_2| = ' + ex.r1 + ' \\times ' + ex.r2 + ' = ' + rProd) + '</div>';
    html += '</div>';

    // Somme des angles
    // On additionne les k pour retrouver l'angle
    const k1 = ex.angle1.k;
    const k2 = ex.angle2.k;
    const kSum = (k1 + k2) % 16;
    const angleSum = ANGLES_REMARQUABLES[kSum];

    // Afficher la somme des fractions de pi
    html += '<div class="step">';
    html += '<div class="step-number">Etape 3 : Argument du produit</div>';
    html += '<div class="step-expression">' +
        K('\\arg(z_1 z_2) = ' + ex.angle1.label + ' + ' + ex.angle2.label + ' = ' + angleSum.label) + '</div>';

    // Si l'angle est > pi, ramener dans ]-pi, pi]
    if (kSum > 8) {
        const negLabel = getNegAngleLabel(kSum);
        html += '<div class="step-explanation">En ramenant dans ' + K(']-\\pi, \\pi]') + ' : ' + K(negLabel) + '</div>';
    }
    html += '</div>';

    let finalAngle = kSum <= 8 ? angleSum.label : getNegAngleLabel(kSum);

    html += '<div class="result-highlight">';
    html += '<div class="final">' +
        K('z_1 \\times z_2 = \\boxed{' + rProd + 'e^{i' + finalAngle + '}}') + '</div>';
    html += '</div>';

    return html;
}

function getNegAngleLabel(k) {
    switch (k) {
        case 9: return '-\\frac{5\\pi}{6}';
        case 10: return '-\\frac{3\\pi}{4}';
        case 11: return '-\\frac{2\\pi}{3}';
        case 12: return '-\\frac{\\pi}{2}';
        case 13: return '-\\frac{\\pi}{3}';
        case 14: return '-\\frac{\\pi}{4}';
        case 15: return '-\\frac{\\pi}{6}';
        default: return ANGLES_REMARQUABLES[k].label;
    }
}

function solveMoivre(ex) {
    let html = '';
    const r = ex.r;
    const n = ex.n;
    const angle = ex.angle;

    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : Formule de Moivre</div>';
    html += '<div class="step-expression">' +
        K('\\left(r e^{i\\theta}\\right)^n = r^n e^{in\\theta}') + '</div>';
    html += '<div class="step-explanation">Ou de maniere equivalente : ' +
        K('(\\cos\\theta + i\\sin\\theta)^n = \\cos(n\\theta) + i\\sin(n\\theta)') + '</div>';
    html += '</div>';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 2 : Module</div>';
    const rn = Math.pow(r, n);
    html += '<div class="step-expression">' +
        K('|z^{' + n + '}| = |z|^{' + n + '} = ' + r + '^{' + n + '} = ' + rn) + '</div>';
    html += '</div>';

    // Angle * n
    const kTotal = (angle.k * n) % 16;
    const angleRes = ANGLES_REMARQUABLES[kTotal];

    html += '<div class="step">';
    html += '<div class="step-number">Etape 3 : Argument</div>';
    html += '<div class="step-expression">' +
        K('\\arg(z^{' + n + '}) = ' + n + ' \\times ' + angle.label) + '</div>';

    let finalAngleLabel;
    if (kTotal <= 8) {
        finalAngleLabel = angleRes.label;
    } else {
        finalAngleLabel = getNegAngleLabel(kTotal);
    }
    html += '<div class="step-expression">' +
        K('= ' + finalAngleLabel + ' \\pmod{2\\pi}') + '</div>';
    html += '</div>';

    // Forme algebrique
    const aVal = Math.round(rn * angleRes.cosVal);
    const bVal = Math.round(rn * angleRes.sinVal);

    html += '<div class="step">';
    html += '<div class="step-number">Etape 4 : Forme algebrique</div>';
    html += '<div class="step-expression">' +
        K('z^{' + n + '} = ' + rn + '\\left(\\cos ' + finalAngleLabel + ' + i\\sin ' + finalAngleLabel + '\\right)') + '</div>';
    html += '<div class="step-expression">' +
        K('= ' + rn + '\\left(' + angleRes.cos + ' + i \\cdot ' + angleRes.sin + '\\right)') + '</div>';

    if (Number.isInteger(aVal) && Number.isInteger(bVal)) {
        html += '<div class="step-expression">' +
            K('= ' + formatComplexTeX(aVal, bVal)) + '</div>';
    }
    html += '</div>';

    html += '<div class="result-highlight">';
    html += '<div class="final">' +
        K('z^{' + n + '} = \\boxed{' + rn + 'e^{i' + finalAngleLabel + '}}');
    if (Number.isInteger(aVal) && Number.isInteger(bVal)) {
        html += '<br>' + K('= ' + formatComplexTeX(aVal, bVal));
    }
    html += '</div></div>';

    return html;
}

// ---- Module & Argument ----

function solveModuleArgument(ex) {
    const sub = ComplexState.subtype_module_argument;

    switch (sub) {
        case 'module': return solveModule(ex);
        case 'argument': return solveArgument(ex);
        case 'ensemble': return solveEnsemble(ex);
    }
    return '';
}

function solveModule(ex) {
    let html = '';
    const a = ex.a, b = ex.b;
    const mod = moduleExact(a, b);

    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : Formule</div>';
    html += '<div class="step-expression">' +
        K('|z| = \\sqrt{a^2 + b^2}') + ' ou ' + K('z = a + bi') + '</div>';
    html += '</div>';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 2 : Calcul</div>';
    html += '<div class="step-expression">' +
        K('|z| = \\sqrt{' + (a >= 0 ? a : '(' + a + ')') + '^2 + ' + (b >= 0 ? b : '(' + b + ')') + '^2}') + '</div>';
    html += '<div class="step-expression">' +
        K('= \\sqrt{' + (a * a) + ' + ' + (b * b) + '}') + '</div>';
    html += '<div class="step-expression">' +
        K('= \\sqrt{' + (a * a + b * b) + '} = ' + mod.tex) + '</div>';
    html += '</div>';

    html += '<div class="result-highlight">';
    html += '<div class="final">' + K('|z| = \\boxed{' + mod.tex + '}') + '</div>';
    html += '</div>';

    return html;
}

function solveArgument(ex) {
    let html = '';
    const a = ex.a, b = ex.b;
    const mod = moduleExact(a, b);
    const arg = argumentExact(a, b);

    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : Module</div>';
    html += '<div class="step-expression">' +
        K('|z| = ' + mod.tex) + '</div>';
    html += '</div>';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 2 : Cosinus et sinus</div>';
    html += '<div class="step-expression">' +
        K('\\cos\\theta = \\frac{a}{|z|} = \\frac{' + a + '}{' + mod.tex + '}') + '<br>' +
        K('\\sin\\theta = \\frac{b}{|z|} = \\frac{' + b + '}{' + mod.tex + '}') + '</div>';
    html += '</div>';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 3 : Identification</div>';
    html += '<div class="step-explanation">On identifie l\'angle dont le cosinus et le sinus correspondent aux valeurs trouvees.</div>';
    html += '</div>';

    html += '<div class="result-highlight">';
    html += '<div class="final">' + K('\\arg(z) = \\boxed{' + arg.tex + '}') + '</div>';
    html += '</div>';

    return html;
}

function solveEnsemble(ex) {
    let html = '';

    if (ex.ensType === 'cercle') {
        const zA = formatComplexTeX(ex.xa, ex.ya);

        html += '<div class="step">';
        html += '<div class="step-number">Etape 1 : Interpretation geometrique</div>';
        html += '<div class="step-expression">' +
            K('|z - z_A| = r') + '</div>';
        html += '<div class="step-explanation">' + K('|z - z_A|') +
            ' represente la distance entre le point ' + K('M') + ' d\'affixe ' +
            K('z') + ' et le point ' + K('A') + ' d\'affixe ' + K('z_A') + '.</div>';
        html += '</div>';

        html += '<div class="step">';
        html += '<div class="step-number">Etape 2 : Identification</div>';
        html += '<div class="step-expression">' +
            K('|z - (' + zA + ')| = ' + ex.rayon) + '</div>';
        html += '<div class="step-explanation">L\'ensemble des points ' + K('M') +
            ' equidistants d\'un point fixe ' + K('A') + ' avec une distance constante ' +
            K('r = ' + ex.rayon) + ' est un <strong>cercle</strong>.</div>';
        html += '</div>';

        html += '<div class="result-highlight">';
        html += '<div class="final">L\'ensemble est le <strong>cercle</strong> de centre ' +
            K('A(' + ex.xa + '\\,;\\,' + ex.ya + ')') + ' et de rayon ' +
            K('r = ' + ex.rayon) + '</div>';
        html += '</div>';
    } else {
        const zA = formatComplexTeX(ex.xa, ex.ya);
        const zB = formatComplexTeX(ex.xb, ex.yb);

        html += '<div class="step">';
        html += '<div class="step-number">Etape 1 : Interpretation geometrique</div>';
        html += '<div class="step-expression">' +
            K('|z - z_A| = |z - z_B|') + '</div>';
        html += '<div class="step-explanation">' +
            K('MA = MB') + ' : l\'ensemble des points equidistants de ' +
            K('A') + ' et ' + K('B') + ' est la <strong>mediatrice</strong> de ' + K('[AB]') + '.</div>';
        html += '</div>';

        // Milieu de AB
        const mx = (ex.xa + ex.xb) / 2;
        const my = (ex.ya + ex.yb) / 2;

        html += '<div class="step">';
        html += '<div class="step-number">Etape 2 : Milieu de [AB]</div>';
        html += '<div class="step-expression">' +
            K('I = \\left(\\frac{' + ex.xa + ' + ' + ex.xb + '}{2}\\,;\\,\\frac{' + ex.ya + ' + ' + ex.yb + '}{2}\\right) = (' + mx + '\\,;\\,' + my + ')') + '</div>';
        html += '</div>';

        html += '<div class="result-highlight">';
        html += '<div class="final">L\'ensemble est la <strong>mediatrice</strong> du segment ' +
            K('[AB]') + '<br>avec ' + K('A(' + ex.xa + '\\,;\\,' + ex.ya + ')') + ' et ' +
            K('B(' + ex.xb + '\\,;\\,' + ex.yb + ')') + '<br>passant par ' +
            K('I(' + mx + '\\,;\\,' + my + ')') + '</div>';
        html += '</div>';
    }

    return html;
}

// ---- Equations ----

function solveEquations(ex) {
    const sub = ComplexState.subtype_equations;

    switch (sub) {
        case 'second_degre': return solveSecondDegre(ex);
        case 'z_carre': return solveZCarre(ex);
        case 'lineaire': return solveLineaire(ex);
    }
    return '';
}

function solveSecondDegre(ex) {
    let html = '';
    const a = ex.eqA, b = ex.eqB, c = ex.eqC;
    const delta = b * b - 4 * a * c;

    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : Discriminant</div>';
    html += '<div class="step-expression">' +
        K('\\Delta = b^2 - 4ac = ' + (b >= 0 ? b : '(' + b + ')') + '^2 - 4 \\times ' + a + ' \\times ' + c) + '</div>';
    html += '<div class="step-expression">' +
        K('= ' + (b * b) + ' - ' + (4 * a * c) + ' = ' + delta) + '</div>';

    if (delta < 0) {
        html += '<div class="step-explanation">' + K('\\Delta < 0') +
            ' : pas de racine reelle, mais deux racines complexes conjuguees.</div>';
    }
    html += '</div>';

    if (delta < 0) {
        const absDelta = -delta;
        const sqrtDelta = moduleExact(0, Math.sqrt(absDelta));
        // sqrt(|delta|)
        let sqrtAbsDelta;
        const sqrtVal = Math.sqrt(absDelta);
        if (Math.abs(sqrtVal - Math.round(sqrtVal)) < 1e-9) {
            sqrtAbsDelta = String(Math.round(sqrtVal));
        } else {
            sqrtAbsDelta = '\\sqrt{' + absDelta + '}';
        }

        html += '<div class="step">';
        html += '<div class="step-number">Etape 2 : Racines complexes</div>';
        html += '<div class="step-expression">' +
            K('z = \\frac{-b \\pm i\\sqrt{|\\Delta|}}{2a} = \\frac{' + (-b) + ' \\pm i' + sqrtAbsDelta + '}{' + (2 * a) + '}') + '</div>';
        html += '</div>';

        const alpha = ex.alpha;
        const beta = ex.beta;

        html += '<div class="step">';
        html += '<div class="step-number">Etape 3 : Simplification</div>';
        html += '<div class="step-expression">' +
            K('z_1 = ' + formatComplexTeX(alpha, beta)) + '<br>' +
            K('z_2 = ' + formatComplexTeX(alpha, -beta)) + '</div>';
        html += '<div class="step-explanation">Les deux racines sont conjuguees : ' +
            K('z_2 = \\bar{z_1}') + '</div>';
        html += '</div>';

        // Verification
        html += '<div class="step">';
        html += '<div class="step-number">Verification</div>';
        html += '<div class="step-explanation">';
        html += K('z_1 + z_2 = ' + (2 * alpha) + ' = -\\frac{b}{a} = ' + (-b)) + '<br>';
        html += K('z_1 \\cdot z_2 = ' + alpha + '^2 + ' + beta + '^2 = ' + (alpha * alpha + beta * beta) + ' = \\frac{c}{a} = ' + c);
        html += '</div></div>';

        html += '<div class="result-highlight">';
        html += '<div class="final">' +
            K('z_1 = \\boxed{' + formatComplexTeX(alpha, beta) + '}') + '<br>' +
            K('z_2 = \\boxed{' + formatComplexTeX(alpha, -beta) + '}') + '</div>';
        html += '</div>';
    }

    return html;
}

function solveZCarre(ex) {
    let html = '';
    const wa = ex.wa, wb = ex.wb;
    const p = ex.solP, q = ex.solQ;

    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : Methode</div>';
    html += '<div class="step-explanation">On pose ' + K('z = x + iy') + ' et on developpe ' +
        K('z^2 = (x+iy)^2 = x^2 - y^2 + 2xyi') + '.</div>';
    html += '</div>';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 2 : Systeme</div>';
    html += '<div class="step-expression">' +
        K('\\begin{cases} x^2 - y^2 = ' + wa + ' \\\\ 2xy = ' + wb + ' \\\\ x^2 + y^2 = |w| \\end{cases}') + '</div>';

    const modW = moduleExact(wa, wb);
    html += '<div class="step-explanation">Avec ' + K('|w| = ' + modW.tex) + '</div>';
    html += '</div>';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 3 : Resolution</div>';

    const modWVal = Math.sqrt(wa * wa + wb * wb);
    const x2 = (wa + modWVal) / 2;
    const y2 = (-wa + modWVal) / 2;

    html += '<div class="step-expression">';
    html += K('x^2 = \\frac{' + wa + ' + ' + modW.tex + '}{2} = ' + x2) + '<br>';
    html += K('y^2 = \\frac{-(' + wa + ') + ' + modW.tex + '}{2} = ' + y2) + '<br>';
    html += '</div>';

    html += '<div class="step-explanation">Le signe de ' + K('xy') + ' est donne par ' + K('2xy = ' + wb) +
        ' donc ' + K('xy ' + (wb >= 0 ? '\\geq 0' : '< 0')) + '.</div>';
    html += '</div>';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 4 : Solutions</div>';
    html += '<div class="step-expression">' +
        K('z_1 = ' + formatComplexTeX(p, q)) + '<br>' +
        K('z_2 = ' + formatComplexTeX(-p, -q)) + '</div>';
    html += '</div>';

    // Verification
    html += '<div class="step">';
    html += '<div class="step-number">Verification</div>';
    const v_re = p * p - q * q;
    const v_im = 2 * p * q;
    html += '<div class="step-expression">' +
        K('z_1^2 = (' + formatComplexTeX(p, q) + ')^2 = ' + formatComplexTeX(v_re, v_im)) + ' &#10003;</div>';
    html += '</div>';

    html += '<div class="result-highlight">';
    html += '<div class="final">' +
        K('z_1 = \\boxed{' + formatComplexTeX(p, q) + '}') + '<br>' +
        K('z_2 = \\boxed{' + formatComplexTeX(-p, -q) + '}') + '</div>';
    html += '</div>';

    return html;
}

function solveLineaire(ex) {
    let html = '';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : Methode</div>';
    html += '<div class="step-explanation">On pose ' + K('z = x + iy') + ' et ' + K('\\bar{z} = x - iy') +
        ', puis on separe parties reelle et imaginaire.</div>';
    html += '</div>';

    const aR = ex.coeffA_re, aI = ex.coeffA_im;
    const bR = ex.coeffB_re, bI = ex.coeffB_im;

    html += '<div class="step">';
    html += '<div class="step-number">Etape 2 : Developpement</div>';
    html += '<div class="step-expression">';
    html += K('(' + formatComplexTeX(aR, aI) + ')(x + iy) + (' + formatComplexTeX(bR, bI) + ')(x - iy) = ' + formatComplexTeX(ex.c_re, ex.c_im));
    html += '</div>';

    // az = (aR*x - aI*y) + (aR*y + aI*x)i
    // b*conj(z) = (bR*x + bI*y) + (-bR*y + bI*x)i
    // Partie reelle: (aR+bR)x + (-aI+bI)y = c_re
    // Partie imaginaire: (aI+bI)x + (aR-bR)y = c_im

    const coeff_x_re = aR + bR;
    const coeff_y_re = -aI + bI;
    const coeff_x_im = aI + bI;
    const coeff_y_im = aR - bR;

    html += '<div class="step-explanation">Partie reelle : ' +
        K(coeff_x_re + 'x + (' + coeff_y_re + ')y = ' + ex.c_re) + '<br>' +
        'Partie imaginaire : ' +
        K(coeff_x_im + 'x + (' + coeff_y_im + ')y = ' + ex.c_im) + '</div>';
    html += '</div>';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 3 : Resolution du systeme</div>';

    const det = coeff_x_re * coeff_y_im - coeff_y_re * coeff_x_im;
    html += '<div class="step-expression">';
    html += K('\\begin{cases} ' + coeff_x_re + 'x + (' + coeff_y_re + ')y = ' + ex.c_re + ' \\\\ ' + coeff_x_im + 'x + (' + coeff_y_im + ')y = ' + ex.c_im + ' \\end{cases}');
    html += '</div>';

    if (det !== 0) {
        html += '<div class="step-explanation">Determinant : ' +
            K('D = ' + coeff_x_re + ' \\times (' + coeff_y_im + ') - (' + coeff_y_re + ') \\times ' + coeff_x_im + ' = ' + det) + '</div>';

        const x = (ex.c_re * coeff_y_im - coeff_y_re * ex.c_im) / det;
        const y = (coeff_x_re * ex.c_im - ex.c_re * coeff_x_im) / det;

        html += '<div class="step-expression">' +
            K('x = \\frac{' + (ex.c_re * coeff_y_im - coeff_y_re * ex.c_im) + '}{' + det + '} = ' + x) + '<br>' +
            K('y = \\frac{' + (coeff_x_re * ex.c_im - ex.c_re * coeff_x_im) + '}{' + det + '} = ' + y) + '</div>';
    }
    html += '</div>';

    html += '<div class="result-highlight">';
    html += '<div class="final">' +
        K('z = \\boxed{' + formatComplexTeX(ex.solX, ex.solY) + '}') + '</div>';
    html += '</div>';

    return html;
}

// ---- Geometrie ----

function solveGeometrie(ex) {
    const sub = ComplexState.subtype_geometrie;

    switch (sub) {
        case 'distance': return solveDistance(ex);
        case 'milieu': return solveMilieu(ex);
        case 'translation': return solveTranslation(ex);
        case 'rotation': return solveRotation(ex);
    }
    return '';
}

function solveDistance(ex) {
    let html = '';
    const dx = ex.xb - ex.xa;
    const dy = ex.yb - ex.ya;

    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : Formule</div>';
    html += '<div class="step-expression">' +
        K('AB = |z_B - z_A|') + '</div>';
    html += '</div>';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 2 : Difference</div>';
    html += '<div class="step-expression">' +
        K('z_B - z_A = (' + formatComplexTeX(ex.xb, ex.yb) + ') - (' + formatComplexTeX(ex.xa, ex.ya) + ')') + '</div>';
    html += '<div class="step-expression">' +
        K('= ' + formatComplexTeX(dx, dy)) + '</div>';
    html += '</div>';

    const mod = moduleExact(dx, dy);

    html += '<div class="step">';
    html += '<div class="step-number">Etape 3 : Module</div>';
    html += '<div class="step-expression">' +
        K('AB = \\sqrt{' + (dx >= 0 ? dx : '(' + dx + ')') + '^2 + ' + (dy >= 0 ? dy : '(' + dy + ')') + '^2}') + '</div>';
    html += '<div class="step-expression">' +
        K('= \\sqrt{' + (dx * dx) + ' + ' + (dy * dy) + '} = \\sqrt{' + (dx * dx + dy * dy) + '} = ' + mod.tex) + '</div>';
    html += '</div>';

    html += '<div class="result-highlight">';
    html += '<div class="final">' + K('AB = \\boxed{' + mod.tex + '}') + '</div>';
    html += '</div>';

    return html;
}

function solveMilieu(ex) {
    let html = '';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : Formule</div>';
    html += '<div class="step-expression">' +
        K('z_I = \\frac{z_A + z_B}{2}') + '</div>';
    html += '</div>';

    const sumA = ex.xa + ex.xb;
    const sumB = ex.ya + ex.yb;

    html += '<div class="step">';
    html += '<div class="step-number">Etape 2 : Somme</div>';
    html += '<div class="step-expression">' +
        K('z_A + z_B = (' + formatComplexTeX(ex.xa, ex.ya) + ') + (' + formatComplexTeX(ex.xb, ex.yb) + ')') + '</div>';
    html += '<div class="step-expression">' +
        K('= ' + formatComplexTeX(sumA, sumB)) + '</div>';
    html += '</div>';

    const mx = sumA / 2;
    const my = sumB / 2;

    html += '<div class="step">';
    html += '<div class="step-number">Etape 3 : Division par 2</div>';

    // Afficher en fractions si necessaire
    let resTex;
    if (Number.isInteger(mx) && Number.isInteger(my)) {
        resTex = formatComplexTeX(mx, my);
    } else {
        const partRe = Number.isInteger(mx) ? String(mx) : '\\frac{' + sumA + '}{2}';
        const partIm = Number.isInteger(my) ? (Math.abs(my) === 1 ? '' : String(Math.abs(my))) : '\\frac{' + Math.abs(sumB) + '}{2}';
        const signIm = my >= 0 ? '+' : '-';
        resTex = partRe + ' ' + signIm + ' ' + partIm + 'i';
    }

    html += '<div class="step-expression">' +
        K('z_I = \\frac{' + formatComplexTeX(sumA, sumB) + '}{2} = ' + resTex) + '</div>';
    html += '</div>';

    html += '<div class="result-highlight">';
    html += '<div class="final">' + K('z_I = \\boxed{' + resTex + '}') + '</div>';
    html += '</div>';

    return html;
}

function solveTranslation(ex) {
    let html = '';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : Rappel</div>';
    html += '<div class="step-expression">' +
        K('z_{A\'} = z_A + t') + '</div>';
    html += '<div class="step-explanation">L\'image par la translation de vecteur ' +
        K('\\vec{u}') + ' d\'affixe ' + K('t') + ' est obtenue en ajoutant ' + K('t') + ' a l\'affixe.</div>';
    html += '</div>';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 2 : Calcul</div>';
    html += '<div class="step-expression">' +
        K('z_{A\'} = (' + formatComplexTeX(ex.xa, ex.ya) + ') + (' + formatComplexTeX(ex.tx, ex.ty) + ')') + '</div>';

    const resX = ex.xa + ex.tx;
    const resY = ex.ya + ex.ty;

    html += '<div class="step-expression">' +
        K('= ' + formatComplexTeX(resX, resY)) + '</div>';
    html += '</div>';

    html += '<div class="result-highlight">';
    html += '<div class="final">' + K('z_{A\'} = \\boxed{' + formatComplexTeX(resX, resY) + '}') +
        '<br>L\'image est ' + K('A\'(' + resX + '\\,;\\,' + resY + ')') + '</div>';
    html += '</div>';

    return html;
}

function solveRotation(ex) {
    let html = '';
    const rot = ex.rotAngle;

    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : Formule de rotation</div>';
    html += '<div class="step-expression">' +
        K('z_{A\'} - z_\\Omega = e^{i\\theta}(z_A - z_\\Omega)') + '</div>';
    html += '<div class="step-explanation">Rotation de centre ' + K('\\Omega') +
        ' et d\'angle ' + K('\\theta = ' + rot.label) + '.</div>';
    html += '</div>';

    // z_A - z_Omega
    const dx = ex.xa - ex.cx;
    const dy = ex.ya - ex.cy;

    html += '<div class="step">';
    html += '<div class="step-number">Etape 2 : Translation au centre</div>';
    html += '<div class="step-expression">' +
        K('z_A - z_\\Omega = (' + formatComplexTeX(ex.xa, ex.ya) + ') - (' + formatComplexTeX(ex.cx, ex.cy) + ') = ' + formatComplexTeX(dx, dy)) + '</div>';
    html += '</div>';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 3 : Multiplication par ' + K('e^{i' + rot.label + '}') + '</div>';
    html += '<div class="step-expression">' +
        K('e^{i' + rot.label + '} = \\cos ' + rot.label + ' + i\\sin ' + rot.label) + '</div>';

    // cos(theta) + i*sin(theta)
    const cosT = rot.cos;
    const sinT = rot.sin;

    // (dx + dy*i)(cosT + sinT*i)
    const resX_raw = dx * cosT - dy * sinT;
    const resY_raw = dx * sinT + dy * cosT;

    // Arrondir
    const resX = Math.round(resX_raw * 1000) / 1000;
    const resY = Math.round(resY_raw * 1000) / 1000;

    html += '<div class="step-expression">' +
        K('e^{i' + rot.label + '} \\times (' + formatComplexTeX(dx, dy) + ')') + '</div>';

    // Resultat de la multiplication
    const finalX_raw = resX + ex.cx;
    const finalY_raw = resY + ex.cy;
    const finalX = Math.round(finalX_raw * 1000) / 1000;
    const finalY = Math.round(finalY_raw * 1000) / 1000;

    html += '<div class="step-expression">' +
        K('= ' + formatComplexTeX(resX, resY)) + '</div>';
    html += '</div>';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 4 : Retranslation</div>';
    html += '<div class="step-expression">' +
        K('z_{A\'} = (' + formatComplexTeX(resX, resY) + ') + (' + formatComplexTeX(ex.cx, ex.cy) + ')') + '</div>';
    html += '<div class="step-expression">' +
        K('= ' + formatComplexTeX(finalX, finalY)) + '</div>';
    html += '</div>';

    html += '<div class="result-highlight">';

    // Afficher entier si possible
    const dispX = Math.abs(finalX - Math.round(finalX)) < 1e-6 ? Math.round(finalX) : finalX;
    const dispY = Math.abs(finalY - Math.round(finalY)) < 1e-6 ? Math.round(finalY) : finalY;

    html += '<div class="final">' + K('z_{A\'} = \\boxed{' + formatComplexTeX(dispX, dispY) + '}') +
        '<br>L\'image est ' + K('A\'(' + dispX + '\\,;\\,' + dispY + ')') + '</div>';
    html += '</div>';

    return html;
}

// ========================================
// Initialisation au chargement
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    initComplexesPage();
});
