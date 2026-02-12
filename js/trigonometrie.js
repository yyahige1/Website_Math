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

        // Quel cote est donne ?
        const given = pick(['hypotenuse', 'adjacent', 'oppose']);
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
        const possible = ['hypotenuse', 'adjacent', 'oppose'].filter(s => s !== given);
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
