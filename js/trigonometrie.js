/* ========================================
   TRIGONOMETRIE.JS - Trigonometrie (Lycee)
   ======================================== */

/**
 * Etat du module Trigonometrie
 */
const TrigoState = {
    currentType: 'valeurs',

    subtype_valeurs: 'aleatoire',
    subtype_conversion: 'deg2rad',
    subtype_equations: 'cos',
    subtype_addition: 'calcul',
    subtype_identites: 'simplifier',
    subtype_triangle: 'rectangle',

    exercise: {}
};

// ========================================
// Donnees de reference
// ========================================

// Angles remarquables : degres, radians (TeX), sin, cos, tan
const ANGLES_REMARQUABLES = [
    { deg: 0,   radTeX: '0',                sin: '0', cos: '1', tan: '0',
      sinVal: 0, cosVal: 1, tanVal: 0, tanDef: true },
    { deg: 30,  radTeX: '\\frac{\\pi}{6}',  sin: '\\frac{1}{2}', cos: '\\frac{\\sqrt{3}}{2}', tan: '\\frac{1}{\\sqrt{3}}',
      sinVal: 0.5, cosVal: Math.sqrt(3)/2, tanVal: 1/Math.sqrt(3), tanDef: true },
    { deg: 45,  radTeX: '\\frac{\\pi}{4}',  sin: '\\frac{\\sqrt{2}}{2}', cos: '\\frac{\\sqrt{2}}{2}', tan: '1',
      sinVal: Math.sqrt(2)/2, cosVal: Math.sqrt(2)/2, tanVal: 1, tanDef: true },
    { deg: 60,  radTeX: '\\frac{\\pi}{3}',  sin: '\\frac{\\sqrt{3}}{2}', cos: '\\frac{1}{2}', tan: '\\sqrt{3}',
      sinVal: Math.sqrt(3)/2, cosVal: 0.5, tanVal: Math.sqrt(3), tanDef: true },
    { deg: 90,  radTeX: '\\frac{\\pi}{2}',  sin: '1', cos: '0', tan: '\\text{non definie}',
      sinVal: 1, cosVal: 0, tanVal: Infinity, tanDef: false },
    { deg: 120, radTeX: '\\frac{2\\pi}{3}', sin: '\\frac{\\sqrt{3}}{2}', cos: '-\\frac{1}{2}', tan: '-\\sqrt{3}',
      sinVal: Math.sqrt(3)/2, cosVal: -0.5, tanVal: -Math.sqrt(3), tanDef: true },
    { deg: 150, radTeX: '\\frac{5\\pi}{6}', sin: '\\frac{1}{2}', cos: '-\\frac{\\sqrt{3}}{2}', tan: '-\\frac{1}{\\sqrt{3}}',
      sinVal: 0.5, cosVal: -Math.sqrt(3)/2, tanVal: -1/Math.sqrt(3), tanDef: true },
    { deg: 180, radTeX: '\\pi',             sin: '0', cos: '-1', tan: '0',
      sinVal: 0, cosVal: -1, tanVal: 0, tanDef: true }
];

// Angles pour les equations trigo (premier quadrant seulement, hors 0 et 90)
const ANGLES_EQ = ANGLES_REMARQUABLES.filter(a => a.deg > 0 && a.deg < 90);

// ========================================
// Initialisation
// ========================================

function initTrigonometriePage() {
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
            TrigoState.currentType = button.dataset.type;

            document.querySelectorAll('[id$="Section"]').forEach(section => {
                section.style.display = 'none';
            });

            const sectionMap = {
                'valeurs': 'valeursSection',
                'conversion': 'conversionSection',
                'equations': 'equationsSection',
                'addition': 'additionSection',
                'identites': 'identitesSection',
                'triangle': 'triangleSection'
            };
            const sectionId = sectionMap[TrigoState.currentType];
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
        'subtype_valeurs', 'subtype_conversion', 'subtype_equations',
        'subtype_addition', 'subtype_identites', 'subtype_triangle'
    ];
    selects.forEach(id => {
        const el = $(id);
        if (el) {
            el.addEventListener('change', () => {
                TrigoState[id] = el.value;
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
        solveTrigonometrie();
    });
}

// ========================================
// Utilitaires locaux
// ========================================

function rint(min, max, exclude) {
    let val;
    const excl = exclude || [];
    do {
        val = Math.floor(Math.random() * (max - min + 1)) + min;
    } while (excl.includes(val));
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

function pickFunc(sub) {
    if (sub === 'aleatoire') {
        return pick(['sin', 'cos', 'tan']);
    }
    return sub;
}

// Retourne le pgcd de deux entiers positifs
function gcdLocal(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) {
        [a, b] = [b, a % b];
    }
    return a;
}

// Formate une fraction en TeX (simplifie)
function fracTeX(num, den) {
    if (den === 1) return `${num}`;
    if (den === -1) return `${-num}`;
    if (num === 0) return '0';
    const sign = (num < 0) !== (den < 0) ? '-' : '';
    const n = Math.abs(num);
    const d = Math.abs(den);
    const g = gcdLocal(n, d);
    const ns = n / g;
    const ds = d / g;
    if (ds === 1) return `${sign}${ns}`;
    return `${sign}\\frac{${ns}}{${ds}}`;
}

// Formate un angle en radians (multiple de pi) en TeX
function radianTeX(num, den) {
    // Represente (num/den) * pi
    const g = gcdLocal(Math.abs(num), Math.abs(den));
    let n = num / g;
    let d = den / g;
    if (d < 0) { n = -n; d = -d; }
    if (n === 0) return '0';
    const sign = n < 0 ? '-' : '';
    const absN = Math.abs(n);
    if (d === 1) {
        if (absN === 1) return `${sign}\\pi`;
        return `${sign}${absN}\\pi`;
    }
    if (absN === 1) return `${sign}\\frac{\\pi}{${d}}`;
    return `${sign}\\frac{${absN}\\pi}{${d}}`;
}

// ========================================
// Generation des exercices
// ========================================

function generateNewExercise() {
    const type = TrigoState.currentType;
    switch (type) {
        case 'valeurs': generateValeurs(); break;
        case 'conversion': generateConversion(); break;
        case 'equations': generateEquations(); break;
        case 'addition': generateAddition(); break;
        case 'identites': generateIdentites(); break;
        case 'triangle': generateTriangle(); break;
    }
}

// --- Valeurs remarquables ---
function generateValeurs() {
    const func = pickFunc(TrigoState.subtype_valeurs);
    // Filtrer : tan non definie pour 90 deg
    let angles = ANGLES_REMARQUABLES;
    if (func === 'tan') {
        angles = angles.filter(a => a.tanDef);
    }
    const angle = pick(angles);
    TrigoState.exercise = { func, angle };
}

// --- Conversion degres/radians ---
function generateConversion() {
    const sub = TrigoState.subtype_conversion;
    const ex = {};

    if (sub === 'deg2rad') {
        // Angles multiples de 15 entre 0 et 360
        const possibles = [];
        for (let d = 0; d <= 360; d += 15) {
            possibles.push(d);
        }
        ex.deg = pick(possibles);
        // Convertir : deg * pi / 180
        const num = ex.deg;
        const den = 180;
        const g = gcdLocal(num, den);
        ex.numSimp = num / g;
        ex.denSimp = den / g;
        ex.radTeX = radianTeX(ex.numSimp, ex.denSimp);
        ex.radVal = ex.deg * Math.PI / 180;
    } else {
        // Radians vers degres : generer une fraction de pi
        const fractions = [
            { num: 0, den: 1 },
            { num: 1, den: 6 }, { num: 1, den: 4 }, { num: 1, den: 3 },
            { num: 1, den: 2 }, { num: 2, den: 3 }, { num: 3, den: 4 },
            { num: 5, den: 6 }, { num: 1, den: 1 },
            { num: 7, den: 6 }, { num: 5, den: 4 }, { num: 4, den: 3 },
            { num: 3, den: 2 }, { num: 5, den: 3 }, { num: 7, den: 4 },
            { num: 11, den: 6 }, { num: 2, den: 1 }
        ];
        const frac = pick(fractions);
        ex.num = frac.num;
        ex.den = frac.den;
        ex.radTeX = radianTeX(frac.num, frac.den);
        ex.deg = (frac.num / frac.den) * 180;
    }

    TrigoState.exercise = ex;
}

// --- Equations trigonometriques ---
function generateEquations() {
    const func = TrigoState.subtype_equations;
    const ex = { func };

    // Choisir un angle remarquable du premier quadrant
    const angle = pick(ANGLES_EQ);
    ex.refAngle = angle;

    if (func === 'cos') {
        // cos(x) = valeur, valeur peut etre positive ou negative
        const positive = Math.random() < 0.5;
        ex.positive = positive;
        ex.valueTeX = positive ? angle.cos : '-' + angle.cos.replace(/^-/, '');
        ex.valueNum = positive ? angle.cosVal : -angle.cosVal;
        // Solutions dans [0, 2pi)
        const refRad = angle.deg * Math.PI / 180;
        if (positive) {
            ex.sol1Rad = refRad;
            ex.sol2Rad = 2 * Math.PI - refRad;
            ex.sol1TeX = angle.radTeX;
            ex.sol2TeX = radianTeX(360 - angle.deg, 180);
        } else {
            ex.sol1Rad = Math.PI - refRad;
            ex.sol2Rad = Math.PI + refRad;
            ex.sol1TeX = radianTeX(180 - angle.deg, 180);
            ex.sol2TeX = radianTeX(180 + angle.deg, 180);
        }
    } else if (func === 'sin') {
        const positive = Math.random() < 0.5;
        ex.positive = positive;
        ex.valueTeX = positive ? angle.sin : '-' + angle.sin.replace(/^-/, '');
        ex.valueNum = positive ? angle.sinVal : -angle.sinVal;
        const refRad = angle.deg * Math.PI / 180;
        if (positive) {
            ex.sol1Rad = refRad;
            ex.sol2Rad = Math.PI - refRad;
            ex.sol1TeX = angle.radTeX;
            ex.sol2TeX = radianTeX(180 - angle.deg, 180);
        } else {
            ex.sol1Rad = Math.PI + refRad;
            ex.sol2Rad = 2 * Math.PI - refRad;
            ex.sol1TeX = radianTeX(180 + angle.deg, 180);
            ex.sol2TeX = radianTeX(360 - angle.deg, 180);
        }
    } else {
        // tan(x) = valeur
        const positive = Math.random() < 0.5;
        ex.positive = positive;
        ex.valueTeX = positive ? angle.tan : '-' + angle.tan.replace(/^-/, '');
        ex.valueNum = positive ? angle.tanVal : -angle.tanVal;
        const refRad = angle.deg * Math.PI / 180;
        if (positive) {
            ex.sol1Rad = refRad;
            ex.sol2Rad = Math.PI + refRad;
            ex.sol1TeX = angle.radTeX;
            ex.sol2TeX = radianTeX(180 + angle.deg, 180);
        } else {
            ex.sol1Rad = Math.PI - refRad;
            ex.sol2Rad = 2 * Math.PI - refRad;
            ex.sol1TeX = radianTeX(180 - angle.deg, 180);
            ex.sol2TeX = radianTeX(360 - angle.deg, 180);
        }
    }

    // Simplifier les solutions TeX (recalculer proprement)
    if (func === 'cos') {
        if (ex.positive) {
            ex.sol1TeX = angle.radTeX;
            const deg2 = 360 - angle.deg;
            ex.sol2TeX = radianTeX(deg2, 180);
        } else {
            const deg1 = 180 - angle.deg;
            const deg2 = 180 + angle.deg;
            ex.sol1TeX = radianTeX(deg1, 180);
            ex.sol2TeX = radianTeX(deg2, 180);
        }
    } else if (func === 'sin') {
        if (ex.positive) {
            ex.sol1TeX = angle.radTeX;
            const deg2 = 180 - angle.deg;
            ex.sol2TeX = radianTeX(deg2, 180);
        } else {
            const deg1 = 180 + angle.deg;
            const deg2 = 360 - angle.deg;
            ex.sol1TeX = radianTeX(deg1, 180);
            ex.sol2TeX = radianTeX(deg2, 180);
        }
    } else {
        if (ex.positive) {
            ex.sol1TeX = angle.radTeX;
            const deg2 = 180 + angle.deg;
            ex.sol2TeX = radianTeX(deg2, 180);
        } else {
            const deg1 = 180 - angle.deg;
            const deg2 = 360 - angle.deg;
            ex.sol1TeX = radianTeX(deg1, 180);
            ex.sol2TeX = radianTeX(deg2, 180);
        }
    }

    TrigoState.exercise = ex;
}

// --- Formules d'addition ---
function generateAddition() {
    const sub = TrigoState.subtype_addition;
    const ex = {};

    // Choisir deux angles remarquables dont la somme ou difference donne un angle connu
    const pairs = [
        { a: 30, b: 45 }, { a: 45, b: 60 }, { a: 30, b: 60 },
        { a: 45, b: 30 }, { a: 60, b: 45 }, { a: 60, b: 30 }
    ];
    const pair = pick(pairs);
    const op = pick(['+', '-']);
    const func = pick(['cos', 'sin']);

    ex.func = func;
    ex.op = op;
    ex.aDeg = pair.a;
    ex.bDeg = pair.b;
    ex.aAngle = ANGLES_REMARQUABLES.find(a => a.deg === pair.a);
    ex.bAngle = ANGLES_REMARQUABLES.find(a => a.deg === pair.b);

    // Resultat
    const resultDeg = op === '+' ? pair.a + pair.b : pair.a - pair.b;
    ex.resultDeg = resultDeg;

    // Calculer la valeur numerique
    const aRad = pair.a * Math.PI / 180;
    const bRad = pair.b * Math.PI / 180;
    if (func === 'cos') {
        ex.resultVal = op === '+' ? Math.cos(aRad + bRad) : Math.cos(aRad - bRad);
    } else {
        ex.resultVal = op === '+' ? Math.sin(aRad + bRad) : Math.sin(aRad - bRad);
    }

    // Chercher si le resultat correspond a un angle remarquable
    const absResult = Math.abs(resultDeg);
    ex.resultAngle = ANGLES_REMARQUABLES.find(a => a.deg === absResult) || null;

    if (sub === 'developper') {
        // Generer une expression comme cos(2x) = 2cos²(x) - 1 ou sin(2x) = 2sin(x)cos(x)
        const formulas = [
            { expr: '\\cos(2x)', type: 'cos2x' },
            { expr: '\\sin(2x)', type: 'sin2x' },
            { expr: '\\cos^2(x) - \\sin^2(x)', type: 'cos2x_alt' }
        ];
        ex.formula = pick(formulas);
        // Choisir un angle pour x
        const xAngles = [30, 45, 60];
        ex.xDeg = pick(xAngles);
        ex.xAngle = ANGLES_REMARQUABLES.find(a => a.deg === ex.xDeg);
    }

    TrigoState.exercise = ex;
}

// --- Identites trigonometriques ---
function generateIdentites() {
    const sub = TrigoState.subtype_identites;
    const ex = {};

    if (sub === 'simplifier') {
        const expressions = [
            {
                exprTeX: '\\cos^2(x) + \\sin^2(x)',
                resultTeX: '1',
                resultVal: 1,
                explanation: 'Identite fondamentale : cos^2(x) + sin^2(x) = 1'
            },
            {
                exprTeX: '1 - \\cos^2(x)',
                resultTeX: '\\sin^2(x)',
                resultVal: null,
                explanation: 'Car cos^2(x) + sin^2(x) = 1, donc sin^2(x) = 1 - cos^2(x)'
            },
            {
                exprTeX: '1 - \\sin^2(x)',
                resultTeX: '\\cos^2(x)',
                resultVal: null,
                explanation: 'Car cos^2(x) + sin^2(x) = 1, donc cos^2(x) = 1 - sin^2(x)'
            },
            {
                exprTeX: '\\frac{\\sin(x)}{\\cos(x)}',
                resultTeX: '\\tan(x)',
                resultVal: null,
                explanation: 'Definition de la tangente : tan(x) = sin(x) / cos(x)'
            },
            {
                exprTeX: '1 + \\tan^2(x)',
                resultTeX: '\\frac{1}{\\cos^2(x)}',
                resultVal: null,
                explanation: 'Identite : 1 + tan^2(x) = 1/cos^2(x)'
            },
            {
                exprTeX: '\\cos^2(x) - \\sin^2(x)',
                resultTeX: '\\cos(2x)',
                resultVal: null,
                explanation: 'Formule de duplication : cos(2x) = cos^2(x) - sin^2(x)'
            },
            {
                exprTeX: '2\\sin(x)\\cos(x)',
                resultTeX: '\\sin(2x)',
                resultVal: null,
                explanation: 'Formule de duplication : sin(2x) = 2sin(x)cos(x)'
            }
        ];
        ex.identity = pick(expressions);

    } else {
        // Trouver cos(x) sachant sin(x)
        // Choisir un quadrant et un angle remarquable
        const angle = pick(ANGLES_EQ);
        const quadrant = rint(1, 4);
        ex.quadrant = quadrant;
        ex.refAngle = angle;

        // Signe de sin et cos selon le quadrant
        let sinSign, cosSign;
        switch (quadrant) {
            case 1: sinSign = 1; cosSign = 1; break;
            case 2: sinSign = 1; cosSign = -1; break;
            case 3: sinSign = -1; cosSign = -1; break;
            case 4: sinSign = -1; cosSign = 1; break;
        }

        // Choisir aleatoirement : donner sin, trouver cos (ou inverse)
        const givesin = Math.random() < 0.5;
        ex.giveSin = givesin;

        if (givesin) {
            ex.givenFunc = 'sin';
            ex.givenValueNum = sinSign * angle.sinVal;
            ex.givenValueTeX = (sinSign < 0 ? '-' : '') + angle.sin;
            ex.findFunc = 'cos';
            ex.findValueNum = cosSign * angle.cosVal;
            ex.findValueTeX = (cosSign < 0 ? '-' : '') + angle.cos;
        } else {
            ex.givenFunc = 'cos';
            ex.givenValueNum = cosSign * angle.cosVal;
            ex.givenValueTeX = (cosSign < 0 ? '-' : '') + angle.cos;
            ex.findFunc = 'sin';
            ex.findValueNum = sinSign * angle.sinVal;
            ex.findValueTeX = (sinSign < 0 ? '-' : '') + angle.sin;
        }
    }

    TrigoState.exercise = ex;
}

// --- Triangles ---
function generateTriangle() {
    const sub = TrigoState.subtype_triangle;
    const ex = {};

    if (sub === 'rectangle') {
        // Triangle rectangle avec un angle et un cote donnes
        const angle = pick([30, 45, 60]);
        ex.angle = angle;
        ex.angleAngle = ANGLES_REMARQUABLES.find(a => a.deg === angle);

        // Pour le niveau 4eme, forcer cosinus uniquement (adjacent et hypotenuse)
        const niveau = new URLSearchParams(window.location.search).get('niveau');
        let givenChoices, findChoices;
        if (niveau === '4eme') {
            givenChoices = ['hypotenuse', 'adjacent'];
        } else {
            givenChoices = ['hypotenuse', 'adjacent', 'oppose'];
        }

        const given = pick(givenChoices);
        ex.givenSide = given;
        ex.givenValue = rint(3, 15);

        // Calculer les autres cotes
        const rad = angle * Math.PI / 180;
        if (given === 'hypotenuse') {
            ex.hyp = ex.givenValue;
            ex.adj = roundDec(ex.givenValue * Math.cos(rad), 4);
            ex.opp = roundDec(ex.givenValue * Math.sin(rad), 4);
        } else if (given === 'adjacent') {
            ex.adj = ex.givenValue;
            ex.hyp = roundDec(ex.givenValue / Math.cos(rad), 4);
            ex.opp = roundDec(ex.givenValue * Math.tan(rad), 4);
        } else {
            ex.opp = ex.givenValue;
            ex.hyp = roundDec(ex.givenValue / Math.sin(rad), 4);
            ex.adj = roundDec(ex.givenValue / Math.tan(rad), 4);
        }

        // Quel cote chercher ?
        let possible;
        if (niveau === '4eme') {
            // Forcer a trouver l'autre cote de la relation cosinus
            possible = ['hypotenuse', 'adjacent'].filter(s => s !== given);
        } else {
            possible = ['hypotenuse', 'adjacent', 'oppose'].filter(s => s !== given);
        }
        ex.findSide = pick(possible);

    } else {
        // Triangle quelconque - loi des cosinus
        // Generer un triangle avec des mesures raisonnables
        const A = rint(30, 80);
        const B = rint(30, 130 - A);
        const C = 180 - A - B;
        ex.A = A;
        ex.B = B;
        ex.C = C;

        // Cote a (oppose a A)
        const a = rint(5, 15);
        ex.a = a;

        // Par loi des sinus : a/sin(A) = b/sin(B) = c/sin(C)
        const radA = A * Math.PI / 180;
        const radB = B * Math.PI / 180;
        const radC = C * Math.PI / 180;
        ex.b = roundDec(a * Math.sin(radB) / Math.sin(radA), 2);
        ex.c = roundDec(a * Math.sin(radC) / Math.sin(radA), 2);

        // Choisir ce qu'on demande
        const quest = pick(['cote', 'angle']);
        ex.quest = quest;

        if (quest === 'cote') {
            // Donner 2 cotes et l'angle entre eux, trouver le 3e cote (loi des cosinus)
            ex.method = 'cosinus';
            // Donner b, c et A, trouver a
            ex.givenText = `b = ${ex.b}, c = ${ex.c}, \\hat{A} = ${A}°`;
            // a² = b² + c² - 2bc.cos(A)
            ex.resultVal = roundDec(Math.sqrt(ex.b * ex.b + ex.c * ex.c - 2 * ex.b * ex.c * Math.cos(radA)), 2);
        } else {
            // Donner 3 cotes, trouver un angle (loi des cosinus inverse)
            ex.method = 'cosinus_inv';
            // cos(A) = (b² + c² - a²) / (2bc)
            ex.cosA = roundDec((ex.b * ex.b + ex.c * ex.c - a * a) / (2 * ex.b * ex.c), 4);
            ex.resultVal = A;
        }
    }

    TrigoState.exercise = ex;
}

// ========================================
// Affichage de l'exercice
// ========================================

function updateExerciseDisplay() {
    const ex = TrigoState.exercise;
    const type = TrigoState.currentType;
    let html = '';

    switch (type) {
        case 'valeurs': html = displayValeurs(ex); break;
        case 'conversion': html = displayConversion(ex); break;
        case 'equations': html = displayEquations(ex); break;
        case 'addition': html = displayAddition(ex); break;
        case 'identites': html = displayIdentites(ex); break;
        case 'triangle': html = displayTriangle(ex); break;
    }

    $('expressionDisplay').innerHTML = html;

    // Afficher/masquer les graphiques
    const graphContainer = $('trigoGraphContainer');
    if (type === 'triangle') {
        graphContainer.style.display = 'block';
        drawTriangleSVG(ex);
    } else if (type === 'valeurs' || type === 'equations') {
        graphContainer.style.display = 'block';
        drawCercleTrigSVG(ex, type);
    } else {
        graphContainer.style.display = 'none';
    }
}

function displayValeurs(ex) {
    const funcName = '\\' + ex.func;
    return `<p>Calculer la valeur exacte de :</p>`
        + `<p style="text-align:center; font-size:1.3em;">` + K(`${funcName}\\left(${ex.angle.radTeX}\\right)`) + `</p>`
        + `<p style="text-align:center; color: var(--gray-500);">(soit ${ex.angle.deg}&deg;)</p>`;
}

function displayConversion(ex) {
    const sub = TrigoState.subtype_conversion;
    if (sub === 'deg2rad') {
        return `<p>Convertir en radians :</p>`
            + `<p style="text-align:center; font-size:1.3em; font-weight:bold;">${ex.deg}&deg;</p>`;
    } else {
        return `<p>Convertir en degres :</p>`
            + `<p style="text-align:center; font-size:1.3em;">` + K(ex.radTeX + '\\text{ rad}') + `</p>`;
    }
}

function displayEquations(ex) {
    const funcName = '\\' + ex.func;
    return `<p>Resoudre dans ` + K('[0 \\,;\\, 2\\pi[') + ` :</p>`
        + `<p style="text-align:center; font-size:1.3em;">` + K(`${funcName}(x) = ${ex.valueTeX}`) + `</p>`;
}

function displayAddition(ex) {
    const sub = TrigoState.subtype_addition;

    if (sub === 'calcul') {
        const funcName = '\\' + ex.func;
        const aTeX = ex.aAngle.radTeX;
        const bTeX = ex.bAngle.radTeX;
        return `<p>Calculer la valeur exacte de :</p>`
            + `<p style="text-align:center; font-size:1.3em;">` + K(`${funcName}\\left(${aTeX} ${ex.op} ${bTeX}\\right)`) + `</p>`;
    } else {
        // Developper
        return `<p>Calculer la valeur exacte en utilisant les formules de duplication :</p>`
            + `<p style="text-align:center; font-size:1.3em;">` + K(ex.formula.expr.replace(/x/g, ex.xAngle.radTeX)) + `</p>`
            + `<p style="text-align:center; color: var(--gray-500);">avec ` + K(`x = ${ex.xAngle.radTeX}`) + ` (soit ${ex.xDeg}&deg;)</p>`;
    }
}

function displayIdentites(ex) {
    const sub = TrigoState.subtype_identites;

    if (sub === 'simplifier') {
        return `<p>Simplifier l'expression suivante :</p>`
            + `<p style="text-align:center; font-size:1.3em;">` + K(ex.identity.exprTeX) + `</p>`;
    } else {
        const quadrantNames = {1: 'premier', 2: 'deuxieme', 3: 'troisieme', 4: 'quatrieme'};
        return `<p>On sait que ` + K(`\\${ex.givenFunc}(x) = ${ex.givenValueTeX}`) + ` et que ` + K('x') + ` est dans le <strong>${quadrantNames[ex.quadrant]} quadrant</strong>.</p>`
            + `<p>Calculer ` + K(`\\${ex.findFunc}(x)`) + `.</p>`;
    }
}

function displayTriangle(ex) {
    const sub = TrigoState.subtype_triangle;

    if (sub === 'rectangle') {
        const sideNames = { hypotenuse: 'l\'hypotenuse', adjacent: 'le cote adjacent', oppose: 'le cote oppose' };
        const findNames = { hypotenuse: 'l\'hypotenuse', adjacent: 'le cote adjacent', oppose: 'le cote oppose' };
        return `<p>Dans un triangle rectangle, on connait :</p>`
            + `<p style="text-align:center;">Un angle de <strong>${ex.angle}&deg;</strong> et ${sideNames[ex.givenSide]} = <strong>${ex.givenValue}</strong></p>`
            + `<p>Calculer ${findNames[ex.findSide]}.</p>`;
    } else {
        if (ex.quest === 'cote') {
            return `<p>Dans un triangle ABC, on connait :</p>`
                + `<p style="text-align:center;">` + K(`b = ${ex.b} \\quad c = ${ex.c} \\quad \\hat{A} = ${ex.A}°`) + `</p>`
                + `<p>Calculer le cote ` + K('a') + ` en utilisant la loi des cosinus.</p>`;
        } else {
            return `<p>Dans un triangle ABC, on connait les trois cotes :</p>`
                + `<p style="text-align:center;">` + K(`a = ${ex.a} \\quad b = ${ex.b} \\quad c = ${ex.c}`) + `</p>`
                + `<p>Calculer l'angle ` + K('\\hat{A}') + ` en utilisant la loi des cosinus.</p>`;
        }
    }
}

// ========================================
// Dessin SVG du cercle trigonometrique
// ========================================

function drawCercleTrigSVG(ex, type) {
    const container = $('trigoSvgContainer');
    const W = 320, H = 320;
    const cx = W / 2, cy = H / 2;
    const R = 120;

    let svg = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="display:block; margin:auto; font-family:system-ui,sans-serif;">`;

    // Fond
    svg += `<rect width="${W}" height="${H}" fill="white" rx="8"/>`;

    // Grille legere
    svg += `<line x1="${cx}" y1="20" x2="${cx}" y2="${H - 20}" stroke="#e0e0e0" stroke-width="1"/>`;
    svg += `<line x1="20" y1="${cy}" x2="${W - 20}" y2="${cy}" stroke="#e0e0e0" stroke-width="1"/>`;

    // Axes
    svg += `<line x1="20" y1="${cy}" x2="${W - 20}" y2="${cy}" stroke="#333" stroke-width="1.5"/>`;
    svg += `<line x1="${cx}" y1="20" x2="${cx}" y2="${H - 20}" stroke="#333" stroke-width="1.5"/>`;

    // Fleches des axes
    svg += `<polygon points="${W - 20},${cy} ${W - 28},${cy - 4} ${W - 28},${cy + 4}" fill="#333"/>`;
    svg += `<polygon points="${cx},20 ${cx - 4},28 ${cx + 4},28" fill="#333"/>`;
    svg += `<text x="${W - 18}" y="${cy - 8}" fill="#333" font-size="12">x</text>`;
    svg += `<text x="${cx + 8}" y="22" fill="#333" font-size="12">y</text>`;

    // Cercle
    svg += `<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="#667eea" stroke-width="2"/>`;

    // Graduations 1 et -1
    svg += `<text x="${cx + R + 5}" y="${cy + 15}" fill="#666" font-size="11">1</text>`;
    svg += `<text x="${cx - R - 14}" y="${cy + 15}" fill="#666" font-size="11">-1</text>`;
    svg += `<text x="${cx + 5}" y="${cy - R - 5}" fill="#666" font-size="11">1</text>`;
    svg += `<text x="${cx + 5}" y="${cy + R + 15}" fill="#666" font-size="11">-1</text>`;

    // Determiner l'angle a afficher
    let angleDeg;
    if (type === 'valeurs') {
        angleDeg = ex.angle.deg;
    } else {
        // Equations : montrer l'angle de reference
        angleDeg = ex.refAngle.deg;
    }

    const angleRad = angleDeg * Math.PI / 180;

    // Point M sur le cercle
    const mx = cx + R * Math.cos(angleRad);
    const my = cy - R * Math.sin(angleRad);

    // Rayon OM
    svg += `<line x1="${cx}" y1="${cy}" x2="${mx.toFixed(1)}" y2="${my.toFixed(1)}" stroke="#e53e3e" stroke-width="2"/>`;

    // Point M
    svg += `<circle cx="${mx.toFixed(1)}" cy="${my.toFixed(1)}" r="4" fill="#e53e3e"/>`;
    svg += `<text x="${(mx + 8).toFixed(1)}" y="${(my - 8).toFixed(1)}" fill="#e53e3e" font-size="12" font-weight="bold">M</text>`;

    // Projection cos (horizontal)
    svg += `<line x1="${mx.toFixed(1)}" y1="${my.toFixed(1)}" x2="${mx.toFixed(1)}" y2="${cy}" stroke="#2196F3" stroke-width="1.5" stroke-dasharray="4,3"/>`;
    svg += `<line x1="${cx}" y1="${cy}" x2="${mx.toFixed(1)}" y2="${cy}" stroke="#2196F3" stroke-width="2.5"/>`;

    // Projection sin (vertical)
    svg += `<line x1="${mx.toFixed(1)}" y1="${my.toFixed(1)}" x2="${cx}" y2="${my.toFixed(1)}" stroke="#48bb78" stroke-width="1.5" stroke-dasharray="4,3"/>`;
    svg += `<line x1="${cx}" y1="${cy}" x2="${cx}" y2="${my.toFixed(1)}" stroke="#48bb78" stroke-width="2.5"/>`;

    // Labels cos et sin
    const cosVal = Math.cos(angleRad);
    const sinVal = Math.sin(angleRad);
    if (Math.abs(cosVal) > 0.1) {
        svg += `<text x="${((cx + mx) / 2).toFixed(1)}" y="${cy + 15}" fill="#2196F3" font-size="11" font-weight="bold" text-anchor="middle">cos</text>`;
    }
    if (Math.abs(sinVal) > 0.1) {
        svg += `<text x="${cx - 18}" y="${((cy + my) / 2).toFixed(1)}" fill="#48bb78" font-size="11" font-weight="bold" text-anchor="middle">sin</text>`;
    }

    // Arc d'angle
    const arcR = 25;
    const arcEndX = cx + arcR;
    const arcEndY = cy;
    const arcMX = cx + arcR * Math.cos(angleRad);
    const arcMY = cy - arcR * Math.sin(angleRad);
    const largeArc = angleDeg > 180 ? 1 : 0;
    if (angleDeg > 0) {
        svg += `<path d="M ${arcEndX} ${arcEndY} A ${arcR} ${arcR} 0 ${largeArc} 0 ${arcMX.toFixed(1)} ${arcMY.toFixed(1)}" fill="none" stroke="#ff9800" stroke-width="1.5"/>`;
        const labelAngle = angleRad / 2;
        const lx = cx + (arcR + 14) * Math.cos(labelAngle);
        const ly = cy - (arcR + 14) * Math.sin(labelAngle);
        svg += `<text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" fill="#ff9800" font-size="11" text-anchor="middle" dominant-baseline="middle">${angleDeg}&deg;</text>`;
    }

    // Pour les equations, montrer aussi les solutions
    if (type === 'equations') {
        const sol1Rad = ex.sol1Rad || 0;
        const sol2Rad = ex.sol2Rad || 0;

        // Solution 1
        const s1x = cx + R * Math.cos(sol1Rad);
        const s1y = cy - R * Math.sin(sol1Rad);
        svg += `<circle cx="${s1x.toFixed(1)}" cy="${s1y.toFixed(1)}" r="5" fill="#48bb78" stroke="white" stroke-width="1.5"/>`;
        svg += `<text x="${(s1x + 10).toFixed(1)}" y="${(s1y - 8).toFixed(1)}" fill="#48bb78" font-size="11" font-weight="bold">x&#8321;</text>`;

        // Solution 2
        if (Math.abs(sol1Rad - sol2Rad) > 0.01) {
            const s2x = cx + R * Math.cos(sol2Rad);
            const s2y = cy - R * Math.sin(sol2Rad);
            svg += `<circle cx="${s2x.toFixed(1)}" cy="${s2y.toFixed(1)}" r="5" fill="#ff9800" stroke="white" stroke-width="1.5"/>`;
            svg += `<text x="${(s2x + 10).toFixed(1)}" y="${(s2y - 8).toFixed(1)}" fill="#ff9800" font-size="11" font-weight="bold">x&#8322;</text>`;
        }
    }

    svg += `</svg>`;
    container.innerHTML = svg;
}

// ========================================
// Dessin SVG des triangles
// ========================================

function drawTriangleSVG(ex) {
    const container = $('trigoSvgContainer');
    const sub = TrigoState.subtype_triangle;

    const W = 400, H = 280;
    const pad = 50;

    if (sub === 'rectangle') {
        // Triangle rectangle : angle droit en bas a droite
        // C = angle droit (en bas a droite)
        // B = en bas a gauche
        // A = en haut a droite
        const baseLen = 200;
        const heightLen = 140;

        const Bx = pad;
        const By = H - pad;
        const Cx = pad + baseLen;
        const Cy = H - pad;
        const Ax = pad + baseLen;
        const Ay = H - pad - heightLen;

        let svg = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="display:block; margin:auto; font-family:system-ui,sans-serif;">`;

        // Triangle
        svg += `<polygon points="${Bx},${By} ${Cx},${Cy} ${Ax},${Ay}" fill="rgba(102,126,234,0.08)" stroke="#667eea" stroke-width="2.5"/>`;

        // Angle droit en C
        const sq = 15;
        svg += `<polyline points="${Cx - sq},${Cy} ${Cx - sq},${Cy - sq} ${Cx},${Cy - sq}" fill="none" stroke="#333" stroke-width="1.5"/>`;

        // Arc pour l'angle en B
        const arcR = 30;
        const endAngleX = Bx + arcR;
        const endAngleY = By;
        const angleRad = ex.angle * Math.PI / 180;
        const arcEndX = Bx + arcR * Math.cos(-angleRad);
        const arcEndY = By + arcR * Math.sin(-angleRad);
        svg += `<path d="M ${endAngleX} ${endAngleY} A ${arcR} ${arcR} 0 0 0 ${arcEndX.toFixed(1)} ${arcEndY.toFixed(1)}" fill="none" stroke="#e53e3e" stroke-width="1.5"/>`;
        svg += `<text x="${Bx + 38}" y="${By - 8}" fill="#e53e3e" font-size="14" font-weight="bold">${ex.angle}&deg;</text>`;

        // Labels des sommets
        svg += `<text x="${Bx - 10}" y="${By + 18}" fill="#333" font-size="13" font-weight="bold">B</text>`;
        svg += `<text x="${Cx + 8}" y="${Cy + 18}" fill="#333" font-size="13" font-weight="bold">C</text>`;
        svg += `<text x="${Ax + 8}" y="${Ay - 5}" fill="#333" font-size="13" font-weight="bold">A</text>`;

        // Labels des cotes
        const sideNames = { hypotenuse: 'hyp', adjacent: 'adj', oppose: 'opp' };
        const givenLabel = ex.givenSide === 'hypotenuse' ? `${ex.givenValue}` : `${ex.givenValue}`;
        const findLabel = '?';

        // Hypotenuse = BA (diagonale)
        const hypMx = (Bx + Ax) / 2 - 20;
        const hypMy = (By + Ay) / 2;
        // Adjacent = BC (base)
        const adjMx = (Bx + Cx) / 2;
        const adjMy = By + 18;
        // Oppose = CA (vertical)
        const oppMx = Cx + 12;
        const oppMy = (Cy + Ay) / 2;

        function sideLabel(side) {
            if (side === ex.givenSide) return `${sideNames[side]} = ${ex.givenValue}`;
            if (side === ex.findSide) return `${sideNames[side]} = ?`;
            return sideNames[side];
        }

        function sideColor(side) {
            if (side === ex.givenSide) return '#2196F3';
            if (side === ex.findSide) return '#e53e3e';
            return '#666';
        }

        // Hypotenuse (diagonale B -> A)
        svg += `<text x="${hypMx}" y="${hypMy}" fill="${sideColor('hypotenuse')}" font-size="13" font-weight="bold" transform="rotate(-35, ${hypMx}, ${hypMy})">${sideLabel('hypotenuse')}</text>`;
        // Adjacent (base B -> C)
        svg += `<text x="${adjMx}" y="${adjMy}" fill="${sideColor('adjacent')}" font-size="13" font-weight="bold" text-anchor="middle">${sideLabel('adjacent')}</text>`;
        // Oppose (vertical C -> A)
        svg += `<text x="${oppMx}" y="${oppMy}" fill="${sideColor('oppose')}" font-size="13" font-weight="bold">${sideLabel('oppose')}</text>`;

        svg += `</svg>`;
        container.innerHTML = svg;

    } else {
        // Triangle quelconque
        // Placer les sommets a partir des angles et cotes
        const A_angle = ex.A;
        const B_angle = ex.B;
        const C_angle = ex.C;

        // Placer B en bas a gauche, C en bas a droite
        // cote a (BC) = oppose a A
        // On normalise pour que le plus grand cote fasse ~200px
        const maxSide = Math.max(ex.a, ex.b, ex.c);
        const scale = 200 / maxSide;

        const Bx = pad + 20;
        const By = H - pad;
        const Cx = Bx + ex.a * scale;
        const Cy = By;

        // A par calcul trigonometrique depuis B
        const angB_rad = B_angle * Math.PI / 180;
        const sideC = ex.c * scale; // cote BA
        const Ax = Bx + sideC * Math.cos(angB_rad);
        const Ay = By - sideC * Math.sin(angB_rad);

        let svg = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="display:block; margin:auto; font-family:system-ui,sans-serif;">`;

        // Triangle
        svg += `<polygon points="${Bx.toFixed(1)},${By.toFixed(1)} ${Cx.toFixed(1)},${Cy.toFixed(1)} ${Ax.toFixed(1)},${Ay.toFixed(1)}" fill="rgba(102,126,234,0.08)" stroke="#667eea" stroke-width="2.5"/>`;

        // Arcs d'angles
        function drawAngleArc(px, py, angle, startAngle, label, color) {
            const r = 22;
            const sa = startAngle;
            const ea = startAngle + angle * Math.PI / 180;
            const sx = px + r * Math.cos(-sa);
            const sy = py + r * Math.sin(-sa);
            const ex_x = px + r * Math.cos(-ea);
            const ex_y = py + r * Math.sin(-ea);
            const largeArc = angle > 180 ? 1 : 0;
            svg += `<path d="M ${sx.toFixed(1)} ${sy.toFixed(1)} A ${r} ${r} 0 ${largeArc} 0 ${ex_x.toFixed(1)} ${ex_y.toFixed(1)}" fill="none" stroke="${color}" stroke-width="1.5"/>`;
            const mid = sa + (angle * Math.PI / 180) / 2;
            const lx = px + (r + 14) * Math.cos(-mid);
            const ly = py + (r + 14) * Math.sin(-mid);
            svg += `<text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" fill="${color}" font-size="12" text-anchor="middle" dominant-baseline="middle">${label}&deg;</text>`;
        }

        // Angle en B
        const angleBstart = 0;
        drawAngleArc(Bx, By, B_angle, angleBstart, B_angle, '#e53e3e');

        // Angle en C
        const angleCstart = Math.PI - Math.atan2(Cy - Ay, Cx - Ax);
        // Simplifier : angle en C entre CB et CA
        const cbAngle = Math.atan2(By - Cy, Bx - Cx);
        const caAngle = Math.atan2(Ay - Cy, Ax - Cx);
        const r_arc = 22;
        const csX = Cx + r_arc * Math.cos(cbAngle);
        const csY = Cy + r_arc * Math.sin(cbAngle);
        const ceX = Cx + r_arc * Math.cos(caAngle);
        const ceY = Cy + r_arc * Math.sin(caAngle);
        svg += `<path d="M ${csX.toFixed(1)} ${csY.toFixed(1)} A ${r_arc} ${r_arc} 0 0 0 ${ceX.toFixed(1)} ${ceY.toFixed(1)}" fill="none" stroke="#ff9800" stroke-width="1.5"/>`;
        const cmid = (cbAngle + caAngle) / 2;
        const clx = Cx + (r_arc + 14) * Math.cos(cmid);
        const cly = Cy + (r_arc + 14) * Math.sin(cmid);
        svg += `<text x="${clx.toFixed(1)}" y="${cly.toFixed(1)}" fill="#ff9800" font-size="12" text-anchor="middle" dominant-baseline="middle">${C_angle}&deg;</text>`;

        // Labels des sommets
        svg += `<text x="${Bx - 15}" y="${By + 5}" fill="#333" font-size="14" font-weight="bold">B</text>`;
        svg += `<text x="${Cx + 8}" y="${Cy + 5}" fill="#333" font-size="14" font-weight="bold">C</text>`;
        svg += `<text x="${Ax.toFixed(1)}" y="${(Ay - 10).toFixed(1)}" fill="#333" font-size="14" font-weight="bold" text-anchor="middle">A</text>`;

        // Labels des cotes
        // a = BC (base)
        svg += `<text x="${((Bx + Cx) / 2).toFixed(1)}" y="${By + 22}" fill="#2196F3" font-size="13" font-weight="bold" text-anchor="middle">a = ${ex.a}</text>`;
        // b = AC
        const bMx = (Ax + Cx) / 2 + 10;
        const bMy = (Ay + Cy) / 2;
        svg += `<text x="${bMx.toFixed(1)}" y="${bMy.toFixed(1)}" fill="#48bb78" font-size="13" font-weight="bold">b = ${ex.b}</text>`;
        // c = AB
        const cMx = (Ax + Bx) / 2 - 15;
        const cMy = (Ay + By) / 2;
        svg += `<text x="${cMx.toFixed(1)}" y="${cMy.toFixed(1)}" fill="#e53e3e" font-size="13" font-weight="bold">c = ${roundDec(ex.c, 1)}</text>`;

        svg += `</svg>`;
        container.innerHTML = svg;
    }
}

// ========================================
// Resolution
// ========================================

function solveTrigonometrie() {
    const type = TrigoState.currentType;
    let html = '';

    try {
        switch (type) {
            case 'valeurs': html = solveValeurs(); break;
            case 'conversion': html = solveConversion(); break;
            case 'equations': html = solveEquations(); break;
            case 'addition': html = solveAddition(); break;
            case 'identites': html = solveIdentites(); break;
            case 'triangle': html = solveTriangle(); break;
            default: html = '<p>Type inconnu : ' + type + '</p>';
        }
    } catch (e) {
        html = '<div class="step"><div class="step-number">Erreur</div>';
        html += '<div class="step-explanation">' + e.message + '</div></div>';
    }

    $('stepsContainer').innerHTML = html;
    showSolution('solutionDiv');
}

// --- Solution Valeurs remarquables ---
function solveValeurs() {
    const ex = TrigoState.exercise;
    const angle = ex.angle;
    const func = ex.func;
    let html = '';

    // Etape 1 : Rappel du tableau
    html += '<div class="step">';
    html += '<div class="step-number">1. Tableau des valeurs remarquables</div>';
    html += '<div class="step-expression">';
    html += buildValeursTable(func);
    html += '</div>';
    html += '</div>';

    // Etape 2 : Identification
    html += '<div class="step">';
    html += '<div class="step-number">2. Identifier l\'angle</div>';
    html += `<div class="step-expression">` + K(`${angle.radTeX} = ${angle.deg}°`) + `</div>`;
    html += '</div>';

    // Etape 3 : Resultat
    html += '<div class="step">';
    html += '<div class="step-number">3. Lire la valeur</div>';
    let resultTeX;
    if (func === 'sin') resultTeX = angle.sin;
    else if (func === 'cos') resultTeX = angle.cos;
    else resultTeX = angle.tan;
    html += `<div class="step-expression">` + K(`\\${func}\\left(${angle.radTeX}\\right) = ${resultTeX}`) + `</div>`;
    html += '</div>';

    html += '<div class="result-highlight">';
    html += `<div class="final">` + K(`\\${func}(${angle.radTeX}) = ${resultTeX}`) + `</div>`;
    html += '</div>';

    return html;
}

// Construit le tableau des valeurs remarquables
function buildValeursTable(highlightFunc) {
    const angles = ANGLES_REMARQUABLES.filter(a => a.deg <= 90);
    let html = `<table style="border-collapse: collapse; margin: 10px auto; text-align: center; font-size: 0.95em;">`;
    html += `<tr style="background: var(--gray-100);">`;
    html += `<th style="border:1px solid var(--gray-300); padding:8px;">Angle</th>`;
    for (const a of angles) {
        html += `<th style="border:1px solid var(--gray-300); padding:8px;">` + K(a.radTeX) + `</th>`;
    }
    html += `</tr>`;

    // Ligne degres
    html += `<tr>`;
    html += `<td style="border:1px solid var(--gray-300); padding:8px; font-weight:bold;">Degres</td>`;
    for (const a of angles) {
        html += `<td style="border:1px solid var(--gray-300); padding:8px;">${a.deg}&deg;</td>`;
    }
    html += `</tr>`;

    // sin
    const sinStyle = highlightFunc === 'sin' ? ' background: var(--info-light);' : '';
    html += `<tr>`;
    html += `<td style="border:1px solid var(--gray-300); padding:8px; font-weight:bold;${sinStyle}">` + K('\\sin') + `</td>`;
    for (const a of angles) {
        html += `<td style="border:1px solid var(--gray-300); padding:8px;${sinStyle}">` + K(a.sin) + `</td>`;
    }
    html += `</tr>`;

    // cos
    const cosStyle = highlightFunc === 'cos' ? ' background: var(--info-light);' : '';
    html += `<tr>`;
    html += `<td style="border:1px solid var(--gray-300); padding:8px; font-weight:bold;${cosStyle}">` + K('\\cos') + `</td>`;
    for (const a of angles) {
        html += `<td style="border:1px solid var(--gray-300); padding:8px;${cosStyle}">` + K(a.cos) + `</td>`;
    }
    html += `</tr>`;

    // tan
    const tanStyle = highlightFunc === 'tan' ? ' background: var(--info-light);' : '';
    html += `<tr>`;
    html += `<td style="border:1px solid var(--gray-300); padding:8px; font-weight:bold;${tanStyle}">` + K('\\tan') + `</td>`;
    for (const a of angles) {
        html += `<td style="border:1px solid var(--gray-300); padding:8px;${tanStyle}">` + K(a.tan) + `</td>`;
    }
    html += `</tr>`;

    html += `</table>`;
    return html;
}

// --- Solution Conversion ---
function solveConversion() {
    const ex = TrigoState.exercise;
    const sub = TrigoState.subtype_conversion;
    let html = '';

    html += '<div class="step">';
    html += '<div class="step-number">1. Rappeler la formule de conversion</div>';
    if (sub === 'deg2rad') {
        html += `<div class="step-expression">` + K(`\\text{radians} = \\text{degres} \\times \\frac{\\pi}{180}`) + `</div>`;
    } else {
        html += `<div class="step-expression">` + K(`\\text{degres} = \\text{radians} \\times \\frac{180}{\\pi}`) + `</div>`;
    }
    html += '</div>';

    html += '<div class="step">';
    html += '<div class="step-number">2. Appliquer la formule</div>';
    if (sub === 'deg2rad') {
        html += `<div class="step-expression">` + K(`${ex.deg}° = ${ex.deg} \\times \\frac{\\pi}{180}`) + `</div>`;
        html += `<div class="step-expression">` + K(`= \\frac{${ex.deg}\\pi}{180}`) + `</div>`;
    } else {
        html += `<div class="step-expression">` + K(`${ex.radTeX} = \\frac{${ex.num}}{${ex.den}} \\times \\pi \\times \\frac{180}{\\pi}`) + `</div>`;
        html += `<div class="step-expression">` + K(`= \\frac{${ex.num} \\times 180}{${ex.den}}`) + `</div>`;
    }
    html += '</div>';

    html += '<div class="step">';
    html += '<div class="step-number">3. Simplifier</div>';
    if (sub === 'deg2rad') {
        if (ex.deg === 0) {
            html += `<div class="step-expression">` + K(`= 0 \\text{ rad}`) + `</div>`;
        } else {
            const g = gcdLocal(ex.deg, 180);
            html += `<div class="step-expression">` + K(`= \\frac{${ex.deg / g}\\pi}{${180 / g}}`) + `</div>`;
            html += `<div class="step-expression">` + K(`= ${ex.radTeX}`) + `</div>`;
        }
    } else {
        html += `<div class="step-expression">` + K(`= ${ex.deg}°`) + `</div>`;
    }
    html += '</div>';

    html += '<div class="result-highlight">';
    if (sub === 'deg2rad') {
        html += `<div class="final">` + K(`${ex.deg}° = ${ex.radTeX} \\text{ rad}`) + `</div>`;
    } else {
        html += `<div class="final">` + K(`${ex.radTeX} \\text{ rad} = ${ex.deg}°`) + `</div>`;
    }
    html += '</div>';

    return html;
}

// --- Solution Equations trigonometriques ---
function solveEquations() {
    const ex = TrigoState.exercise;
    const func = ex.func;
    const funcName = '\\' + func;
    let html = '';

    // Etape 1 : Rappel methode
    html += '<div class="step">';
    html += '<div class="step-number">1. Methode de resolution</div>';
    if (func === 'cos') {
        html += `<div class="step-explanation">Pour ` + K(`\\cos(x) = a`) + `, les solutions dans ` + K(`[0, 2\\pi[`) + ` sont :</div>`;
        html += `<div class="step-expression">` + K(`x = \\alpha \\quad \\text{et} \\quad x = 2\\pi - \\alpha`) + `</div>`;
        html += `<div class="step-explanation">ou ` + K(`\\alpha`) + ` est l'angle de reference dans ` + K(`[0, \\pi]`) + `</div>`;
    } else if (func === 'sin') {
        html += `<div class="step-explanation">Pour ` + K(`\\sin(x) = a`) + `, les solutions dans ` + K(`[0, 2\\pi[`) + ` sont :</div>`;
        html += `<div class="step-expression">` + K(`x = \\alpha \\quad \\text{et} \\quad x = \\pi - \\alpha`) + `</div>`;
        html += `<div class="step-explanation">ou ` + K(`\\alpha`) + ` est l'angle de reference</div>`;
    } else {
        html += `<div class="step-explanation">Pour ` + K(`\\tan(x) = a`) + `, les solutions dans ` + K(`[0, 2\\pi[`) + ` sont :</div>`;
        html += `<div class="step-expression">` + K(`x = \\alpha \\quad \\text{et} \\quad x = \\pi + \\alpha`) + `</div>`;
    }
    html += '</div>';

    // Etape 2 : Identifier l'angle de reference
    html += '<div class="step">';
    html += '<div class="step-number">2. Identifier l\'angle de reference</div>';
    html += `<div class="step-expression">L'angle de reference est ` + K(ex.refAngle.radTeX) + ` (soit ${ex.refAngle.deg}&deg;)</div>`;
    if (func === 'cos') {
        html += `<div class="step-expression">Car ` + K(`\\cos\\left(${ex.refAngle.radTeX}\\right) = ${ex.refAngle.cos}`) + `</div>`;
    } else if (func === 'sin') {
        html += `<div class="step-expression">Car ` + K(`\\sin\\left(${ex.refAngle.radTeX}\\right) = ${ex.refAngle.sin}`) + `</div>`;
    } else {
        html += `<div class="step-expression">Car ` + K(`\\tan\\left(${ex.refAngle.radTeX}\\right) = ${ex.refAngle.tan}`) + `</div>`;
    }
    html += '</div>';

    // Etape 3 : Solutions
    html += '<div class="step">';
    html += '<div class="step-number">3. Determiner les solutions</div>';

    // Verifier si sol1 et sol2 sont identiques
    const sol1 = ex.sol1TeX;
    const sol2 = ex.sol2TeX;

    html += `<div class="step-expression">` + K(`x_1 = ${sol1}`) + `</div>`;
    if (sol1 !== sol2) {
        html += `<div class="step-expression">` + K(`x_2 = ${sol2}`) + `</div>`;
    }
    html += '</div>';

    // Etape 4 : Verification
    html += '<div class="step">';
    html += '<div class="step-number">4. Verification</div>';
    html += `<div class="step-expression">` + K(`${funcName}\\left(${sol1}\\right) = ${ex.valueTeX}`) + ` ✓</div>`;
    if (sol1 !== sol2) {
        html += `<div class="step-expression">` + K(`${funcName}\\left(${sol2}\\right) = ${ex.valueTeX}`) + ` ✓</div>`;
    }
    html += '</div>';

    html += '<div class="result-highlight">';
    if (sol1 === sol2) {
        html += `<div class="final">` + K(`S = \\left\\{ ${sol1} \\right\\}`) + `</div>`;
    } else {
        html += `<div class="final">` + K(`S = \\left\\{ ${sol1} \\,;\\, ${sol2} \\right\\}`) + `</div>`;
    }
    html += '</div>';

    return html;
}

// --- Solution Formules d'addition ---
function solveAddition() {
    const ex = TrigoState.exercise;
    const sub = TrigoState.subtype_addition;
    let html = '';

    if (sub === 'calcul') {
        const funcName = '\\' + ex.func;
        const aTeX = ex.aAngle.radTeX;
        const bTeX = ex.bAngle.radTeX;

        // Etape 1 : Rappel formule
        html += '<div class="step">';
        html += '<div class="step-number">1. Rappeler la formule</div>';
        if (ex.func === 'cos') {
            if (ex.op === '+') {
                html += `<div class="step-expression">` + K(`\\cos(a + b) = \\cos(a)\\cos(b) - \\sin(a)\\sin(b)`) + `</div>`;
            } else {
                html += `<div class="step-expression">` + K(`\\cos(a - b) = \\cos(a)\\cos(b) + \\sin(a)\\sin(b)`) + `</div>`;
            }
        } else {
            if (ex.op === '+') {
                html += `<div class="step-expression">` + K(`\\sin(a + b) = \\sin(a)\\cos(b) + \\cos(a)\\sin(b)`) + `</div>`;
            } else {
                html += `<div class="step-expression">` + K(`\\sin(a - b) = \\sin(a)\\cos(b) - \\cos(a)\\sin(b)`) + `</div>`;
            }
        }
        html += '</div>';

        // Etape 2 : Rappeler les valeurs
        html += '<div class="step">';
        html += '<div class="step-number">2. Valeurs remarquables utilisees</div>';
        html += `<div class="step-expression">` + K(`\\cos\\left(${aTeX}\\right) = ${ex.aAngle.cos} \\quad \\sin\\left(${aTeX}\\right) = ${ex.aAngle.sin}`) + `</div>`;
        html += `<div class="step-expression">` + K(`\\cos\\left(${bTeX}\\right) = ${ex.bAngle.cos} \\quad \\sin\\left(${bTeX}\\right) = ${ex.bAngle.sin}`) + `</div>`;
        html += '</div>';

        // Etape 3 : Appliquer
        html += '<div class="step">';
        html += '<div class="step-number">3. Appliquer la formule</div>';
        if (ex.func === 'cos') {
            const sign = ex.op === '+' ? '-' : '+';
            html += `<div class="step-expression">` + K(`${funcName}\\left(${aTeX} ${ex.op} ${bTeX}\\right) = ${ex.aAngle.cos} \\times ${ex.bAngle.cos} ${sign} ${ex.aAngle.sin} \\times ${ex.bAngle.sin}`) + `</div>`;
        } else {
            const sign = ex.op === '+' ? '+' : '-';
            html += `<div class="step-expression">` + K(`${funcName}\\left(${aTeX} ${ex.op} ${bTeX}\\right) = ${ex.aAngle.sin} \\times ${ex.bAngle.cos} ${sign} ${ex.aAngle.cos} \\times ${ex.bAngle.sin}`) + `</div>`;
        }
        html += '</div>';

        // Etape 4 : Calculer
        html += '<div class="step">';
        html += '<div class="step-number">4. Calculer</div>';

        // Calculer les produits
        let resultTeX;
        if (ex.resultAngle) {
            if (ex.func === 'cos') {
                resultTeX = ex.resultDeg >= 0 ? ex.resultAngle.cos : ex.resultAngle.cos;
            } else {
                resultTeX = ex.resultDeg >= 0 ? ex.resultAngle.sin : ex.resultAngle.sin;
            }
        }
        const resultNum = roundDec(ex.resultVal, 6);
        html += `<div class="step-expression">` + K(`\\approx ${resultNum}`) + `</div>`;

        if (ex.resultAngle) {
            const rDeg = Math.abs(ex.resultDeg);
            const rAngle = ANGLES_REMARQUABLES.find(a => a.deg === rDeg);
            if (rAngle) {
                let exact;
                if (ex.func === 'cos') exact = ex.resultVal >= 0 ? rAngle.cos : '-' + rAngle.cos.replace(/^-/, '');
                else exact = ex.resultVal >= 0 ? rAngle.sin : '-' + rAngle.sin.replace(/^-/, '');
                html += `<div class="step-expression">Soit ` + K(`${funcName}(${ex.resultDeg >= 0 ? rAngle.radTeX : ''}) = ${exact}`) + `</div>`;
            }
        }
        html += '</div>';

        html += '<div class="result-highlight">';
        html += `<div class="final">` + K(`${funcName}\\left(${aTeX} ${ex.op} ${bTeX}\\right) \\approx ${roundDec(ex.resultVal, 4)}`) + `</div>`;
        html += '</div>';

    } else {
        // Developper (formules de duplication)
        const x = ex.xAngle;
        const xTeX = x.radTeX;

        html += '<div class="step">';
        html += '<div class="step-number">1. Rappeler la formule de duplication</div>';
        switch (ex.formula.type) {
            case 'cos2x':
                html += `<div class="step-expression">` + K(`\\cos(2x) = \\cos^2(x) - \\sin^2(x)`) + `</div>`;
                html += `<div class="step-expression">` + K(`= 2\\cos^2(x) - 1 = 1 - 2\\sin^2(x)`) + `</div>`;
                break;
            case 'sin2x':
                html += `<div class="step-expression">` + K(`\\sin(2x) = 2\\sin(x)\\cos(x)`) + `</div>`;
                break;
            case 'cos2x_alt':
                html += `<div class="step-expression">` + K(`\\cos^2(x) - \\sin^2(x) = \\cos(2x)`) + `</div>`;
                break;
        }
        html += '</div>';

        html += '<div class="step">';
        html += '<div class="step-number">2. Valeurs pour ' + K(`x = ${xTeX}`) + ' (soit ' + ex.xDeg + '&deg;)</div>';
        html += `<div class="step-expression">` + K(`\\cos(${xTeX}) = ${x.cos}`) + `</div>`;
        html += `<div class="step-expression">` + K(`\\sin(${xTeX}) = ${x.sin}`) + `</div>`;
        html += '</div>';

        html += '<div class="step">';
        html += '<div class="step-number">3. Appliquer</div>';

        let resultVal;
        switch (ex.formula.type) {
            case 'cos2x':
                resultVal = x.cosVal * x.cosVal - x.sinVal * x.sinVal;
                html += `<div class="step-expression">` + K(`\\cos(2 \\times ${xTeX}) = (${x.cos})^2 - (${x.sin})^2`) + `</div>`;
                html += `<div class="step-expression">` + K(`= ${roundDec(x.cosVal * x.cosVal, 4)} - ${roundDec(x.sinVal * x.sinVal, 4)}`) + `</div>`;
                break;
            case 'sin2x':
                resultVal = 2 * x.sinVal * x.cosVal;
                html += `<div class="step-expression">` + K(`\\sin(2 \\times ${xTeX}) = 2 \\times ${x.sin} \\times ${x.cos}`) + `</div>`;
                html += `<div class="step-expression">` + K(`= 2 \\times ${roundDec(x.sinVal * x.cosVal, 4)}`) + `</div>`;
                break;
            case 'cos2x_alt':
                resultVal = x.cosVal * x.cosVal - x.sinVal * x.sinVal;
                html += `<div class="step-expression">` + K(`(${x.cos})^2 - (${x.sin})^2 = ${roundDec(x.cosVal * x.cosVal, 4)} - ${roundDec(x.sinVal * x.sinVal, 4)}`) + `</div>`;
                break;
        }
        html += `<div class="step-expression">` + K(`= ${roundDec(resultVal, 4)}`) + `</div>`;
        html += '</div>';

        // Verifier si c'est une valeur remarquable
        const doubleDeg = 2 * ex.xDeg;
        const doubleAngle = ANGLES_REMARQUABLES.find(a => a.deg === doubleDeg);
        if (doubleAngle) {
            html += '<div class="step">';
            html += '<div class="step-number">4. Verification</div>';
            const funcType = (ex.formula.type === 'sin2x') ? 'sin' : 'cos';
            const exactVal = funcType === 'cos' ? doubleAngle.cos : doubleAngle.sin;
            html += `<div class="step-expression">On reconnait ` + K(`\\${funcType}(${doubleAngle.radTeX}) = ${exactVal}`) + ` ✓</div>`;
            html += '</div>';
        }

        html += '<div class="result-highlight">';
        html += `<div class="final">` + K(`= ${roundDec(resultVal, 4)}`) + `</div>`;
        html += '</div>';
    }

    return html;
}

// --- Solution Identites trigonometriques ---
function solveIdentites() {
    const ex = TrigoState.exercise;
    const sub = TrigoState.subtype_identites;
    let html = '';

    if (sub === 'simplifier') {
        html += '<div class="step">';
        html += '<div class="step-number">1. Identifier l\'identite</div>';
        html += `<div class="step-explanation">${ex.identity.explanation}</div>`;
        html += '</div>';

        html += '<div class="step">';
        html += '<div class="step-number">2. Simplifier</div>';
        html += `<div class="step-expression">` + K(ex.identity.exprTeX + ' = ' + ex.identity.resultTeX) + `</div>`;
        html += '</div>';

        html += '<div class="result-highlight">';
        html += `<div class="final">` + K(ex.identity.exprTeX + ' = ' + ex.identity.resultTeX) + `</div>`;
        html += '</div>';

    } else {
        // Trouver cos/sin sachant l'autre
        html += '<div class="step">';
        html += '<div class="step-number">1. Utiliser l\'identite fondamentale</div>';
        html += `<div class="step-expression">` + K(`\\cos^2(x) + \\sin^2(x) = 1`) + `</div>`;
        html += '</div>';

        html += '<div class="step">';
        html += '<div class="step-number">2. Remplacer la valeur connue</div>';
        const givenTeX = ex.givenValueTeX;
        html += `<div class="step-expression">On sait que ` + K(`\\${ex.givenFunc}(x) = ${givenTeX}`) + `</div>`;
        const givenSquared = roundDec(ex.givenValueNum * ex.givenValueNum, 4);
        html += `<div class="step-expression">Donc ` + K(`\\${ex.givenFunc}^2(x) = \\left(${givenTeX}\\right)^2 = ${givenSquared}`) + `</div>`;
        html += '</div>';

        html += '<div class="step">';
        html += '<div class="step-number">3. En deduire la valeur cherchee</div>';
        const otherSquared = roundDec(1 - givenSquared, 4);
        html += `<div class="step-expression">` + K(`\\${ex.findFunc}^2(x) = 1 - ${givenSquared} = ${otherSquared}`) + `</div>`;
        html += `<div class="step-expression">` + K(`\\${ex.findFunc}(x) = \\pm\\sqrt{${otherSquared}}`) + `</div>`;
        html += '</div>';

        html += '<div class="step">';
        html += '<div class="step-number">4. Determiner le signe</div>';
        const quadrantNames = {1: 'premier', 2: 'deuxieme', 3: 'troisieme', 4: 'quatrieme'};
        html += `<div class="step-explanation">Dans le ${quadrantNames[ex.quadrant]} quadrant :</div>`;

        let sinSigne, cosSigne;
        switch (ex.quadrant) {
            case 1: sinSigne = 'positif'; cosSigne = 'positif'; break;
            case 2: sinSigne = 'positif'; cosSigne = 'negatif'; break;
            case 3: sinSigne = 'negatif'; cosSigne = 'negatif'; break;
            case 4: sinSigne = 'negatif'; cosSigne = 'positif'; break;
        }
        html += `<div class="step-expression">` + K(`\\sin(x)`) + ` est <strong>${sinSigne}</strong>, ` + K(`\\cos(x)`) + ` est <strong>${cosSigne}</strong></div>`;
        html += `<div class="step-expression">Donc ` + K(`\\${ex.findFunc}(x) = ${ex.findValueTeX}`) + `</div>`;
        html += '</div>';

        html += '<div class="result-highlight">';
        html += `<div class="final">` + K(`\\${ex.findFunc}(x) = ${ex.findValueTeX}`) + `</div>`;
        html += '</div>';
    }

    return html;
}

// --- Solution Triangles ---
function solveTriangle() {
    const ex = TrigoState.exercise;
    const sub = TrigoState.subtype_triangle;
    let html = '';

    if (sub === 'rectangle') {
        // Triangle rectangle : SOH CAH TOA
        html += '<div class="step">';
        html += '<div class="step-number">1. Rappeler les formules SOH-CAH-TOA</div>';
        html += `<div class="step-expression">` + K(`\\sin(\\alpha) = \\frac{\\text{oppose}}{\\text{hypotenuse}}`) + `</div>`;
        html += `<div class="step-expression">` + K(`\\cos(\\alpha) = \\frac{\\text{adjacent}}{\\text{hypotenuse}}`) + `</div>`;
        html += `<div class="step-expression">` + K(`\\tan(\\alpha) = \\frac{\\text{oppose}}{\\text{adjacent}}`) + `</div>`;
        html += '</div>';

        // Identifier la bonne formule
        html += '<div class="step">';
        html += '<div class="step-number">2. Choisir la bonne formule</div>';

        const given = ex.givenSide;
        const find = ex.findSide;
        let formula, ratio, calcul, result;

        if ((given === 'hypotenuse' && find === 'oppose') || (given === 'oppose' && find === 'hypotenuse')) {
            formula = 'sin';
            if (given === 'hypotenuse') {
                ratio = `\\sin(${ex.angle}°) = \\frac{\\text{oppose}}{${ex.givenValue}}`;
                calcul = `\\text{oppose} = ${ex.givenValue} \\times \\sin(${ex.angle}°)`;
                result = ex.opp;
            } else {
                ratio = `\\sin(${ex.angle}°) = \\frac{${ex.givenValue}}{\\text{hypotenuse}}`;
                calcul = `\\text{hypotenuse} = \\frac{${ex.givenValue}}{\\sin(${ex.angle}°)}`;
                result = ex.hyp;
            }
        } else if ((given === 'hypotenuse' && find === 'adjacent') || (given === 'adjacent' && find === 'hypotenuse')) {
            formula = 'cos';
            if (given === 'hypotenuse') {
                ratio = `\\cos(${ex.angle}°) = \\frac{\\text{adjacent}}{${ex.givenValue}}`;
                calcul = `\\text{adjacent} = ${ex.givenValue} \\times \\cos(${ex.angle}°)`;
                result = ex.adj;
            } else {
                ratio = `\\cos(${ex.angle}°) = \\frac{${ex.givenValue}}{\\text{hypotenuse}}`;
                calcul = `\\text{hypotenuse} = \\frac{${ex.givenValue}}{\\cos(${ex.angle}°)}`;
                result = ex.hyp;
            }
        } else {
            formula = 'tan';
            if (given === 'adjacent') {
                ratio = `\\tan(${ex.angle}°) = \\frac{\\text{oppose}}{${ex.givenValue}}`;
                calcul = `\\text{oppose} = ${ex.givenValue} \\times \\tan(${ex.angle}°)`;
                result = ex.opp;
            } else {
                ratio = `\\tan(${ex.angle}°) = \\frac{${ex.givenValue}}{\\text{adjacent}}`;
                calcul = `\\text{adjacent} = \\frac{${ex.givenValue}}{\\tan(${ex.angle}°)}`;
                result = ex.adj;
            }
        }

        html += `<div class="step-explanation">On utilise la formule du <strong>${formula === 'sin' ? 'sinus' : formula === 'cos' ? 'cosinus' : 'tangente'}</strong></div>`;
        html += `<div class="step-expression">` + K(ratio) + `</div>`;
        html += '</div>';

        html += '<div class="step">';
        html += '<div class="step-number">3. Calculer</div>';
        html += `<div class="step-expression">` + K(calcul) + `</div>`;

        // Valeur remarquable de la fonction trigo
        const angleData = ex.angleAngle;
        let trigoVal;
        if (formula === 'sin') trigoVal = angleData.sin;
        else if (formula === 'cos') trigoVal = angleData.cos;
        else trigoVal = angleData.tan;

        html += `<div class="step-expression">` + K(`\\${formula}(${ex.angle}°) = ${trigoVal}`) + `</div>`;
        html += `<div class="step-expression">` + K(`\\approx ${roundDec(result, 2)}`) + `</div>`;
        html += '</div>';

        const sideNames = { hypotenuse: 'Hypotenuse', adjacent: 'Cote adjacent', oppose: 'Cote oppose' };
        html += '<div class="result-highlight">';
        html += `<div class="final">${sideNames[find]} ` + K(`\\approx ${roundDec(result, 2)}`) + `</div>`;
        html += '</div>';

    } else {
        // Triangle quelconque
        if (ex.quest === 'cote') {
            html += '<div class="step">';
            html += '<div class="step-number">1. Rappeler la loi des cosinus</div>';
            html += `<div class="step-expression">` + K(`a^2 = b^2 + c^2 - 2bc \\cos(\\hat{A})`) + `</div>`;
            html += '</div>';

            html += '<div class="step">';
            html += '<div class="step-number">2. Remplacer les valeurs</div>';
            html += `<div class="step-expression">` + K(`a^2 = ${ex.b}^2 + ${ex.c}^2 - 2 \\times ${ex.b} \\times ${ex.c} \\times \\cos(${ex.A}°)`) + `</div>`;
            const b2 = roundDec(ex.b * ex.b, 2);
            const c2 = roundDec(ex.c * ex.c, 2);
            const cosA = roundDec(Math.cos(ex.A * Math.PI / 180), 4);
            const produit = roundDec(2 * ex.b * ex.c * cosA, 2);
            html += `<div class="step-expression">` + K(`a^2 = ${b2} + ${c2} - ${roundDec(2 * ex.b * ex.c, 2)} \\times ${cosA}`) + `</div>`;
            html += `<div class="step-expression">` + K(`a^2 = ${b2} + ${c2} - ${produit}`) + `</div>`;
            const a2 = roundDec(b2 + c2 - produit, 2);
            html += `<div class="step-expression">` + K(`a^2 = ${a2}`) + `</div>`;
            html += '</div>';

            html += '<div class="step">';
            html += '<div class="step-number">3. Conclure</div>';
            html += `<div class="step-expression">` + K(`a = \\sqrt{${a2}} \\approx ${ex.resultVal}`) + `</div>`;
            html += '</div>';

            html += '<div class="result-highlight">';
            html += `<div class="final">` + K(`a \\approx ${ex.resultVal}`) + `</div>`;
            html += '</div>';

        } else {
            // Trouver un angle
            html += '<div class="step">';
            html += '<div class="step-number">1. Rappeler la loi des cosinus (forme inverse)</div>';
            html += `<div class="step-expression">` + K(`\\cos(\\hat{A}) = \\frac{b^2 + c^2 - a^2}{2bc}`) + `</div>`;
            html += '</div>';

            html += '<div class="step">';
            html += '<div class="step-number">2. Remplacer les valeurs</div>';
            const b2 = roundDec(ex.b * ex.b, 2);
            const c2 = roundDec(ex.c * ex.c, 2);
            const a2 = roundDec(ex.a * ex.a, 2);
            const num = roundDec(b2 + c2 - a2, 2);
            const den = roundDec(2 * ex.b * ex.c, 2);
            html += `<div class="step-expression">` + K(`\\cos(\\hat{A}) = \\frac{${ex.b}^2 + ${ex.c}^2 - ${ex.a}^2}{2 \\times ${ex.b} \\times ${ex.c}}`) + `</div>`;
            html += `<div class="step-expression">` + K(`= \\frac{${b2} + ${c2} - ${a2}}{${den}}`) + `</div>`;
            html += `<div class="step-expression">` + K(`= \\frac{${num}}{${den}} \\approx ${ex.cosA}`) + `</div>`;
            html += '</div>';

            html += '<div class="step">';
            html += '<div class="step-number">3. Trouver l\'angle</div>';
            html += `<div class="step-expression">` + K(`\\hat{A} = \\arccos(${ex.cosA})`) + `</div>`;
            html += `<div class="step-expression">` + K(`\\hat{A} \\approx ${ex.resultVal}°`) + `</div>`;
            html += '</div>';

            html += '<div class="step">';
            html += '<div class="step-number">4. Verification</div>';
            html += `<div class="step-explanation">Somme des angles : ` + K(`${ex.A}° + ${ex.B}° + ${ex.C}° = ${ex.A + ex.B + ex.C}° = 180°`) + ` ✓</div>`;
            html += '</div>';

            html += '<div class="result-highlight">';
            html += `<div class="final">` + K(`\\hat{A} \\approx ${ex.resultVal}°`) + `</div>`;
            html += '</div>';
        }
    }

    return html;
}

// ========================================
// Initialisation au chargement
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    initTrigonometriePage();
});
