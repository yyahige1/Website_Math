/* ========================================
   PERIMETRES-AIRES.JS - Perimetres et Aires
   ======================================== */

/**
 * Etat du module
 */
const PerimetresAiresState = {
    currentType: 'perimetre',
    shape: '',
    dims: {},       // dimensions de la figure
    answer: 0,      // resultat attendu
    answerExact: '', // resultat exact (ex: "12pi")
    formula: '',
};

/**
 * Entier aleatoire entre min et max inclus
 */
function paRandInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function paPick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Formate un nombre
 */
function paFormat(n) {
    if (Number.isInteger(n)) return n.toString();
    return parseFloat(n.toFixed(2)).toString();
}

/**
 * Rendu KaTeX si disponible, sinon texte brut
 */
function paK(tex) {
    if (typeof katex !== 'undefined') {
        return katex.renderToString(tex, { throwOnError: false });
    }
    return tex;
}

/**
 * Initialise la page
 */
function initPerimetresAiresPage() {
    setupTypeButtons();
    setupActionButtons();
    generatePerimetresAires();
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
            PerimetresAiresState.currentType = button.dataset.type;
            generatePerimetresAires();
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
        generatePerimetresAires();
        updateExerciseDisplay();
        hideSolution('solutionDiv');
    });

    $('solveBtn').addEventListener('click', () => {
        solvePerimetresAires();
    });
}

/* ========================================
   FORMES DISPONIBLES
   ======================================== */

const PERIMETRE_SHAPES = ['carre', 'rectangle', 'triangle', 'cercle'];
const AIRE_SHAPES = ['carre', 'rectangle', 'triangle', 'disque', 'parallelogramme'];

const SHAPE_NAMES = {
    carre: 'Carre',
    rectangle: 'Rectangle',
    triangle: 'Triangle',
    cercle: 'Cercle',
    disque: 'Disque',
    parallelogramme: 'Parallelogramme',
};

/* ========================================
   GENERATION
   ======================================== */

function generatePerimetresAires() {
    const st = PerimetresAiresState;

    switch (st.currentType) {
        case 'perimetre':
            generatePerimetre();
            break;
        case 'aire':
            generateAire();
            break;
        case 'conversions':
            generateConversion();
            break;
    }
}

function generatePerimetre() {
    const st = PerimetresAiresState;
    st.shape = paPick(PERIMETRE_SHAPES);

    switch (st.shape) {
        case 'carre': {
            const c = paRandInt(2, 20);
            st.dims = { cote: c };
            st.answer = 4 * c;
            st.formula = 'P = 4 \\times c';
            break;
        }
        case 'rectangle': {
            const L = paRandInt(5, 20);
            const l = paRandInt(2, L - 1);
            st.dims = { longueur: L, largeur: l };
            st.answer = 2 * (L + l);
            st.formula = 'P = 2 \\times (L + l)';
            break;
        }
        case 'triangle': {
            const a = paRandInt(3, 15);
            const b = paRandInt(3, 15);
            const cMax = a + b - 1;
            const cMin = Math.abs(a - b) + 1;
            const c = paRandInt(Math.max(cMin, 3), Math.min(cMax, 15));
            st.dims = { a: a, b: b, c: c };
            st.answer = a + b + c;
            st.formula = 'P = a + b + c';
            break;
        }
        case 'cercle': {
            const r = paRandInt(2, 15);
            st.dims = { rayon: r };
            st.answer = parseFloat((2 * Math.PI * r).toFixed(2));
            st.answerExact = '2\\pi \\times ' + r;
            st.formula = 'P = 2\\pi r';
            break;
        }
    }
}

function generateAire() {
    const st = PerimetresAiresState;
    st.shape = paPick(AIRE_SHAPES);

    switch (st.shape) {
        case 'carre': {
            const c = paRandInt(2, 15);
            st.dims = { cote: c };
            st.answer = c * c;
            st.formula = 'A = c^2';
            break;
        }
        case 'rectangle': {
            const L = paRandInt(3, 18);
            const l = paRandInt(2, L);
            st.dims = { longueur: L, largeur: l };
            st.answer = L * l;
            st.formula = 'A = L \\times l';
            break;
        }
        case 'triangle': {
            const b = paRandInt(3, 16);
            const h = paRandInt(2, 14);
            st.dims = { base: b, hauteur: h };
            st.answer = (b * h) / 2;
            st.formula = 'A = \\frac{b \\times h}{2}';
            break;
        }
        case 'disque': {
            const r = paRandInt(2, 12);
            st.dims = { rayon: r };
            st.answer = parseFloat((Math.PI * r * r).toFixed(2));
            st.answerExact = '\\pi \\times ' + r + '^2';
            st.formula = 'A = \\pi r^2';
            break;
        }
        case 'parallelogramme': {
            const b = paRandInt(3, 16);
            const h = paRandInt(2, 12);
            st.dims = { base: b, hauteur: h };
            st.answer = b * h;
            st.formula = 'A = b \\times h';
            break;
        }
    }
}

/**
 * Unites de conversion
 */
const CONVERSION_UNITS_LENGTH = ['km', 'm', 'dm', 'cm', 'mm'];
const CONVERSION_UNITS_AREA = ['km\u00b2', 'm\u00b2', 'dm\u00b2', 'cm\u00b2', 'mm\u00b2'];

function generateConversion() {
    const st = PerimetresAiresState;
    const isArea = Math.random() < 0.4;

    if (isArea) {
        st.shape = 'conv_aire';
        const units = CONVERSION_UNITS_AREA;
        const fromIdx = paRandInt(0, units.length - 2);
        const toIdx = fromIdx + 1;
        const val = paPick([1, 2, 3, 5, 10, 25, 100]);
        // Conversion : 1 unite[fromIdx] = 100 unite[toIdx] pour les aires
        const factor = Math.pow(100, toIdx - fromIdx);
        st.dims = { value: val, from: units[fromIdx], to: units[toIdx], factor: factor };
        st.answer = val * factor;
    } else {
        st.shape = 'conv_longueur';
        const units = CONVERSION_UNITS_LENGTH;
        const fromIdx = paRandInt(0, units.length - 2);
        const toIdx = fromIdx + 1;
        const val = paPick([1, 2, 3, 5, 10, 25, 100, 500]);
        const factor = 10;
        st.dims = { value: val, from: units[fromIdx], to: units[toIdx], factor: factor };
        st.answer = val * factor;
    }
}

/* ========================================
   AFFICHAGE
   ======================================== */

function updateExerciseDisplay() {
    const st = PerimetresAiresState;
    let display = '';

    switch (st.currentType) {
        case 'perimetre':
            display = buildShapeDisplay('Calculer le perimetre', st);
            break;
        case 'aire':
            display = buildShapeDisplay('Calculer l\'aire', st);
            break;
        case 'conversions':
            display = buildConversionDisplay(st);
            break;
    }

    $('exerciseDisplay').innerHTML = display;
}

function buildShapeDisplay(question, st) {
    let html = '<div style="margin-bottom: 8px;"><strong>' + question + ' du ' + SHAPE_NAMES[st.shape].toLowerCase() + ' :</strong></div>';

    // Afficher les dimensions
    html += '<div style="font-size: 1.15em; margin: 10px 0;">';
    const d = st.dims;
    switch (st.shape) {
        case 'carre':
            html += 'Cote = ' + d.cote + ' cm';
            break;
        case 'rectangle':
            html += 'Longueur = ' + d.longueur + ' cm, Largeur = ' + d.largeur + ' cm';
            break;
        case 'triangle':
            if (d.a !== undefined) {
                html += 'Cotes : a = ' + d.a + ' cm, b = ' + d.b + ' cm, c = ' + d.c + ' cm';
            } else {
                html += 'Base = ' + d.base + ' cm, Hauteur = ' + d.hauteur + ' cm';
            }
            break;
        case 'cercle':
        case 'disque':
            html += 'Rayon = ' + d.rayon + ' cm';
            break;
        case 'parallelogramme':
            html += 'Base = ' + d.base + ' cm, Hauteur = ' + d.hauteur + ' cm';
            break;
    }
    html += '</div>';

    // Afficher la formule
    html += '<div style="color: var(--gray-500, #888); font-size: 0.9em;">Formule : ' + paK(st.formula) + '</div>';

    return html;
}

function buildConversionDisplay(st) {
    const d = st.dims;
    let html = '<div style="margin-bottom: 8px;"><strong>Convertir :</strong></div>';
    html += '<div style="font-size: 1.3em; margin: 10px 0;">';
    html += d.value + ' ' + d.from + ' = ? ' + d.to;
    html += '</div>';
    return html;
}

/* ========================================
   RESOLUTION
   ======================================== */

function solvePerimetresAires() {
    let html = '<h3>Solution</h3>';

    switch (PerimetresAiresState.currentType) {
        case 'perimetre':
            html += solvePerimetre();
            break;
        case 'aire':
            html += solveAire();
            break;
        case 'conversions':
            html += solveConversion();
            break;
    }

    $('solutionDiv').innerHTML = html;
    showSolution('solutionDiv');
}

function solvePerimetre() {
    const st = PerimetresAiresState;
    const d = st.dims;
    let html = '';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : Formule du perimetre</div>';
    html += '<div class="step-expression">' + SHAPE_NAMES[st.shape] + ' : ' + paK(st.formula) + '</div>';
    html += '</div>';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 2 : Remplacer par les valeurs</div>';

    switch (st.shape) {
        case 'carre':
            html += '<div class="step-expression">' + paK('P = 4 \\times ' + d.cote) + '</div>';
            html += '<div class="step-explanation">' + paK('P = ' + st.answer) + ' cm</div>';
            break;
        case 'rectangle':
            html += '<div class="step-expression">' + paK('P = 2 \\times (' + d.longueur + ' + ' + d.largeur + ')') + '</div>';
            html += '<div class="step-explanation">' + paK('P = 2 \\times ' + (d.longueur + d.largeur)) + ' = ' + st.answer + ' cm</div>';
            break;
        case 'triangle':
            html += '<div class="step-expression">' + paK('P = ' + d.a + ' + ' + d.b + ' + ' + d.c) + '</div>';
            html += '<div class="step-explanation">' + paK('P = ' + st.answer) + ' cm</div>';
            break;
        case 'cercle':
            html += '<div class="step-expression">' + paK('P = 2\\pi \\times ' + d.rayon) + '</div>';
            html += '<div class="step-explanation">' + paK('P = ' + paFormat(2 * d.rayon) + '\\pi \\approx ' + paFormat(st.answer)) + ' cm</div>';
            break;
    }
    html += '</div>';

    html += '<div class="result-highlight">';
    if (st.shape === 'cercle') {
        html += '<div class="final">P = ' + paK(paFormat(2 * d.rayon) + '\\pi') + ' cm &asymp; <strong>' + paFormat(st.answer) + ' cm</strong></div>';
    } else {
        html += '<div class="final">P = <strong>' + paFormat(st.answer) + ' cm</strong></div>';
    }
    html += '</div>';

    return html;
}

function solveAire() {
    const st = PerimetresAiresState;
    const d = st.dims;
    let html = '';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : Formule de l\'aire</div>';
    html += '<div class="step-expression">' + SHAPE_NAMES[st.shape] + ' : ' + paK(st.formula) + '</div>';
    html += '</div>';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 2 : Remplacer par les valeurs</div>';

    switch (st.shape) {
        case 'carre':
            html += '<div class="step-expression">' + paK('A = ' + d.cote + '^2 = ' + d.cote + ' \\times ' + d.cote) + '</div>';
            html += '<div class="step-explanation">' + paK('A = ' + st.answer) + ' cm&sup2;</div>';
            break;
        case 'rectangle':
            html += '<div class="step-expression">' + paK('A = ' + d.longueur + ' \\times ' + d.largeur) + '</div>';
            html += '<div class="step-explanation">' + paK('A = ' + st.answer) + ' cm&sup2;</div>';
            break;
        case 'triangle':
            html += '<div class="step-expression">' + paK('A = \\frac{' + d.base + ' \\times ' + d.hauteur + '}{2}') + '</div>';
            html += '<div class="step-explanation">' + paK('A = \\frac{' + (d.base * d.hauteur) + '}{2} = ' + paFormat(st.answer)) + ' cm&sup2;</div>';
            break;
        case 'disque':
            html += '<div class="step-expression">' + paK('A = \\pi \\times ' + d.rayon + '^2') + '</div>';
            html += '<div class="step-explanation">' + paK('A = ' + (d.rayon * d.rayon) + '\\pi \\approx ' + paFormat(st.answer)) + ' cm&sup2;</div>';
            break;
        case 'parallelogramme':
            html += '<div class="step-expression">' + paK('A = ' + d.base + ' \\times ' + d.hauteur) + '</div>';
            html += '<div class="step-explanation">' + paK('A = ' + st.answer) + ' cm&sup2;</div>';
            break;
    }
    html += '</div>';

    html += '<div class="result-highlight">';
    if (st.shape === 'disque') {
        html += '<div class="final">A = ' + paK((d.rayon * d.rayon) + '\\pi') + ' cm&sup2; &asymp; <strong>' + paFormat(st.answer) + ' cm&sup2;</strong></div>';
    } else {
        html += '<div class="final">A = <strong>' + paFormat(st.answer) + ' cm&sup2;</strong></div>';
    }
    html += '</div>';

    return html;
}

function solveConversion() {
    const st = PerimetresAiresState;
    const d = st.dims;
    let html = '';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : Rappel de la regle</div>';

    if (st.shape === 'conv_aire') {
        html += '<div class="step-expression">1 ' + d.from + ' = ' + d.factor + ' ' + d.to + '</div>';
        html += '<div class="step-explanation">Pour les aires, on multiplie par 100 (= 10&sup2;) a chaque changement d\'unite.</div>';
    } else {
        html += '<div class="step-expression">1 ' + d.from + ' = ' + d.factor + ' ' + d.to + '</div>';
        html += '<div class="step-explanation">Pour les longueurs, on multiplie par 10 a chaque changement d\'unite.</div>';
    }
    html += '</div>';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 2 : Calculer</div>';
    html += '<div class="step-expression">' + d.value + ' ' + d.from + ' = ' + d.value + ' &times; ' + d.factor + ' ' + d.to + '</div>';
    html += '<div class="step-explanation">' + d.value + ' &times; ' + d.factor + ' = ' + paFormat(st.answer) + '</div>';
    html += '</div>';

    html += '<div class="result-highlight">';
    html += '<div class="final">' + d.value + ' ' + d.from + ' = <strong>' + paFormat(st.answer) + ' ' + d.to + '</strong></div>';
    html += '</div>';

    return html;
}

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', () => {
    initPerimetresAiresPage();
});
