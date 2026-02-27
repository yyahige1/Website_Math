/* ========================================
   PYTHAGORE.JS - Theoreme de Pythagore
   ======================================== */

/**
 * Etat du module
 */
const PythagoreState = {
    currentType: 'hypotenuse',
    // Cotes du triangle rectangle (a et b cotes de l'angle droit, c hypotenuse)
    a: 0,
    b: 0,
    c: 0,
    // Noms des sommets
    sommets: ['A', 'B', 'C'],
    // Pour le type reciproque
    isRectangle: true,
    // Pour le type probleme
    contexte: null,
};

/**
 * KaTeX helper
 */
function K(tex) {
    return katex.renderToString(tex, { throwOnError: false });
}

/**
 * Triplets pythagoriciens courants (pour generer des valeurs exactes)
 */
const TRIPLETS = [
    [3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17],
    [7, 24, 25], [9, 12, 15], [9, 40, 41], [12, 16, 20],
    [15, 20, 25], [20, 21, 29], [10, 24, 26], [14, 48, 50],
];

/**
 * Contextes pour les problemes
 */
const CONTEXTES_PYTHAGORE = [
    {
        intro: 'Une echelle de {c} m est posee contre un mur. Le pied de l\'echelle est a {a} m du mur.',
        question: 'A quelle hauteur l\'echelle touche-t-elle le mur ?',
        coteInconnu: 'b',
        uniteLabel: 'm',
        objetA: 'distance pied-mur',
        objetB: 'hauteur',
        objetC: 'echelle',
    },
    {
        intro: 'Un terrain rectangulaire mesure {a} m de long et {b} m de large.',
        question: 'Quelle est la longueur de la diagonale ?',
        coteInconnu: 'c',
        uniteLabel: 'm',
        objetA: 'longueur',
        objetB: 'largeur',
        objetC: 'diagonale',
    },
    {
        intro: 'Un bateau part du port et navigue {a} km vers l\'Est puis {b} km vers le Nord.',
        question: 'A quelle distance du port se trouve-t-il a vol d\'oiseau ?',
        coteInconnu: 'c',
        uniteLabel: 'km',
        objetA: 'distance Est',
        objetB: 'distance Nord',
        objetC: 'distance directe',
    },
    {
        intro: 'Un mat de {c} m de haut est maintenu par un hauban fixe au sol a {a} m du pied du mat.',
        question: 'Quelle est la longueur du hauban ?',
        coteInconnu: 'c',
        uniteLabel: 'm',
        objetA: 'distance au sol',
        objetB: 'hauteur mat',
        objetC: 'hauban',
    },
    {
        intro: 'Un ecran de television a une diagonale de {c} cm. Sa largeur est de {a} cm.',
        question: 'Quelle est la hauteur de l\'ecran ?',
        coteInconnu: 'b',
        uniteLabel: 'cm',
        objetA: 'largeur',
        objetB: 'hauteur',
        objetC: 'diagonale',
    },
];

/**
 * Initialise la page
 */
function initPythagorePage() {
    setupTypeButtons();
    setupActionButtons();
    generatePythagore();
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
            PythagoreState.currentType = button.dataset.type;
            generatePythagore();
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
        generatePythagore();
        updateExerciseDisplay();
        hideSolution('solutionDiv');
    });

    $('solveBtn').addEventListener('click', () => {
        solvePythagore();
    });
}

/**
 * Genere un triplet pythagoricien aleatoire
 */
function randomTriplet() {
    const t = TRIPLETS[Math.floor(Math.random() * TRIPLETS.length)];
    // Parfois multiplier par un facteur
    const factors = [1, 1, 1, 2];
    const f = factors[Math.floor(Math.random() * factors.length)];
    return [t[0] * f, t[1] * f, t[2] * f];
}

/**
 * Melange les noms de sommets
 */
function randomSommets() {
    const sets = [
        ['A', 'B', 'C'], ['E', 'F', 'G'], ['M', 'N', 'P'],
        ['R', 'S', 'T'], ['I', 'J', 'K'], ['L', 'M', 'N'],
    ];
    return sets[Math.floor(Math.random() * sets.length)];
}

/**
 * Genere un nouvel exercice
 */
function generatePythagore() {
    const st = PythagoreState;
    const tri = randomTriplet();
    st.a = tri[0];
    st.b = tri[1];
    st.c = tri[2];
    st.sommets = randomSommets();

    switch (st.currentType) {
        case 'hypotenuse':
        case 'cote':
            // Rien de special, le triplet est deja pret
            break;

        case 'reciproque': {
            st.isRectangle = Math.random() < 0.5;
            if (!st.isRectangle) {
                // Modifier un cote pour ne plus avoir un triangle rectangle
                const delta = Math.random() < 0.5 ? 1 : -1;
                st.c = st.c + delta;
            }
            break;
        }

        case 'probleme': {
            const ctx = CONTEXTES_PYTHAGORE[Math.floor(Math.random() * CONTEXTES_PYTHAGORE.length)];
            st.contexte = ctx;
            break;
        }
    }
}

/**
 * Met a jour l'affichage de l'exercice
 */
function updateExerciseDisplay() {
    const st = PythagoreState;
    const S = st.sommets;
    let display = '';

    switch (st.currentType) {
        case 'hypotenuse':
            display = 'Le triangle ' + S[0] + S[1] + S[2] + ' est rectangle en ' + S[0] + '.<br>';
            display += S[0] + S[1] + ' = ' + st.a + ' et ' + S[0] + S[2] + ' = ' + st.b + '.<br>';
            display += '<strong>Calculer ' + S[1] + S[2] + '.</strong>';
            break;

        case 'cote':
            display = 'Le triangle ' + S[0] + S[1] + S[2] + ' est rectangle en ' + S[0] + '.<br>';
            display += S[1] + S[2] + ' = ' + st.c + ' et ' + S[0] + S[1] + ' = ' + st.a + '.<br>';
            display += '<strong>Calculer ' + S[0] + S[2] + '.</strong>';
            break;

        case 'reciproque':
            display = 'On donne ' + S[0] + S[1] + ' = ' + st.a + ', ';
            display += S[0] + S[2] + ' = ' + st.b + ' et ';
            display += S[1] + S[2] + ' = ' + st.c + '.<br>';
            display += '<strong>Le triangle ' + S[0] + S[1] + S[2] + ' est-il rectangle ?</strong>';
            break;

        case 'probleme': {
            const ctx = st.contexte;
            let intro = ctx.intro;
            intro = intro.replace('{a}', st.a).replace('{b}', st.b).replace('{c}', st.c);
            display = intro + '<br><strong>' + ctx.question + '</strong>';
            break;
        }
    }

    $('exerciseDisplay').innerHTML = display;
    drawTriangle();
}

/**
 * Dessine le triangle rectangle sur le canvas
 */
function drawTriangle() {
    const canvas = $('triangleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const st = PythagoreState;
    const S = st.sommets;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (st.currentType === 'probleme') {
        canvas.style.display = 'none';
        return;
    }
    canvas.style.display = 'block';

    const w = canvas.width;
    const h = canvas.height;
    const pad = 40;

    // Proportions du triangle
    const maxSide = Math.max(st.a, st.b, st.c);
    const scale = Math.min((w - 2 * pad) / st.a, (h - 2 * pad) / st.b) * 0.85;

    // Sommet A (angle droit) en bas a gauche
    const ax = pad + 10;
    const ay = h - pad;
    // Sommet B en bas a droite (cote a = AB)
    const bx = ax + st.a * scale;
    const by = ay;
    // Sommet C en haut a gauche (cote b = AC)
    const cx = ax;
    const cy = ay - st.b * scale;

    // Dessiner le triangle
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx, by);
    ctx.lineTo(cx, cy);
    ctx.closePath();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = 'rgba(102, 126, 234, 0.08)';
    ctx.fill();

    // Marque angle droit
    const sq = 12;
    ctx.beginPath();
    ctx.moveTo(ax + sq, ay);
    ctx.lineTo(ax + sq, ay - sq);
    ctx.lineTo(ax, ay - sq);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Labels sommets
    ctx.font = 'bold 14px sans-serif';
    ctx.fillStyle = '#333';
    ctx.textAlign = 'center';
    ctx.fillText(S[0], ax - 14, ay + 16);
    ctx.fillText(S[1], bx + 14, by + 16);
    ctx.fillText(S[2], cx - 14, cy - 8);

    // Labels cotes
    ctx.font = '13px sans-serif';
    ctx.fillStyle = '#667eea';

    // Cote AB (bas)
    const labelAB = getLabelForSide('a');
    ctx.textAlign = 'center';
    ctx.fillText(labelAB, (ax + bx) / 2, ay + 18);

    // Cote AC (gauche)
    const labelAC = getLabelForSide('b');
    ctx.textAlign = 'right';
    ctx.fillText(labelAC, ax - 8, (ay + cy) / 2);

    // Cote BC (hypotenuse)
    const labelBC = getLabelForSide('c');
    ctx.textAlign = 'center';
    const midHx = (bx + cx) / 2 + 12;
    const midHy = (by + cy) / 2 - 6;
    ctx.fillText(labelBC, midHx, midHy);
}

/**
 * Retourne le label a afficher pour un cote donne
 */
function getLabelForSide(side) {
    const st = PythagoreState;
    switch (st.currentType) {
        case 'hypotenuse':
            if (side === 'a') return st.a.toString();
            if (side === 'b') return st.b.toString();
            return '?';

        case 'cote':
            if (side === 'a') return st.a.toString();
            if (side === 'c') return st.c.toString();
            return '?';

        case 'reciproque':
            if (side === 'a') return st.a.toString();
            if (side === 'b') return st.b.toString();
            return st.c.toString();

        default:
            return '';
    }
}

/**
 * Resout l'exercice courant
 */
function solvePythagore() {
    let html = '<h3>Solution</h3>';

    switch (PythagoreState.currentType) {
        case 'hypotenuse':
            html += solveHypotenuse();
            break;
        case 'cote':
            html += solveCote();
            break;
        case 'reciproque':
            html += solveReciproque();
            break;
        case 'probleme':
            html += solveProbleme();
            break;
    }

    $('solutionDiv').innerHTML = html;
    showSolution('solutionDiv');
}

/**
 * Resout : calculer l'hypotenuse
 */
function solveHypotenuse() {
    const st = PythagoreState;
    const S = st.sommets;
    const a = st.a, b = st.b;
    const c2 = a * a + b * b;
    const c = Math.sqrt(c2);
    let html = '';

    // Etape 1 : Enoncer le theoreme
    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : Enoncer le theoreme</div>';
    html += '<div class="step-expression">';
    html += 'Le triangle ' + S[0] + S[1] + S[2] + ' est rectangle en ' + S[0] + '.';
    html += '</div>';
    html += '<div class="step-explanation">';
    html += 'D\'apres le theoreme de Pythagore : ' + K(S[1] + S[2] + '^2 = ' + S[0] + S[1] + '^2 + ' + S[0] + S[2] + '^2');
    html += '</div>';
    html += '</div>';

    // Etape 2 : Remplacer
    html += '<div class="step">';
    html += '<div class="step-number">Etape 2 : Remplacer par les valeurs</div>';
    html += '<div class="step-expression">';
    html += K(S[1] + S[2] + '^2 = ' + a + '^2 + ' + b + '^2');
    html += '</div>';
    html += '<div class="step-explanation">';
    html += K(S[1] + S[2] + '^2 = ' + (a * a) + ' + ' + (b * b));
    html += '</div>';
    html += '</div>';

    // Etape 3 : Calculer
    html += '<div class="step">';
    html += '<div class="step-number">Etape 3 : Calculer</div>';
    html += '<div class="step-expression">';
    html += K(S[1] + S[2] + '^2 = ' + c2);
    html += '</div>';
    html += '<div class="step-explanation">';
    html += 'Donc ' + K(S[1] + S[2] + ' = \\sqrt{' + c2 + '}');
    html += '</div>';
    html += '</div>';

    // Resultat
    const cStr = Number.isInteger(c) ? c.toString() : c.toFixed(2);
    html += '<div class="result-highlight">';
    html += '<div class="final">' + K(S[1] + S[2] + ' = ' + cStr) + '</div>';
    html += '</div>';

    return html;
}

/**
 * Resout : calculer un cote
 */
function solveCote() {
    const st = PythagoreState;
    const S = st.sommets;
    const a = st.a, c = st.c;
    const b2 = c * c - a * a;
    const b = Math.sqrt(b2);
    let html = '';

    // Etape 1
    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : Enoncer le theoreme</div>';
    html += '<div class="step-expression">';
    html += 'Le triangle ' + S[0] + S[1] + S[2] + ' est rectangle en ' + S[0] + '.';
    html += '</div>';
    html += '<div class="step-explanation">';
    html += 'D\'apres le theoreme de Pythagore : ' + K(S[1] + S[2] + '^2 = ' + S[0] + S[1] + '^2 + ' + S[0] + S[2] + '^2');
    html += '</div>';
    html += '</div>';

    // Etape 2 : Isoler le cote cherche
    html += '<div class="step">';
    html += '<div class="step-number">Etape 2 : Isoler le cote inconnu</div>';
    html += '<div class="step-expression">';
    html += K(S[0] + S[2] + '^2 = ' + S[1] + S[2] + '^2 - ' + S[0] + S[1] + '^2');
    html += '</div>';
    html += '<div class="step-explanation">';
    html += 'On isole ' + K(S[0] + S[2] + '^2') + ' en passant ' + K(S[0] + S[1] + '^2') + ' de l\'autre cote.';
    html += '</div>';
    html += '</div>';

    // Etape 3 : Remplacer
    html += '<div class="step">';
    html += '<div class="step-number">Etape 3 : Remplacer par les valeurs</div>';
    html += '<div class="step-expression">';
    html += K(S[0] + S[2] + '^2 = ' + c + '^2 - ' + a + '^2');
    html += '</div>';
    html += '<div class="step-explanation">';
    html += K(S[0] + S[2] + '^2 = ' + (c * c) + ' - ' + (a * a) + ' = ' + b2);
    html += '</div>';
    html += '</div>';

    // Etape 4 : Racine
    html += '<div class="step">';
    html += '<div class="step-number">Etape 4 : Conclure</div>';
    html += '<div class="step-expression">';
    html += K(S[0] + S[2] + ' = \\sqrt{' + b2 + '}');
    html += '</div>';
    html += '</div>';

    const bStr = Number.isInteger(b) ? b.toString() : b.toFixed(2);
    html += '<div class="result-highlight">';
    html += '<div class="final">' + K(S[0] + S[2] + ' = ' + bStr) + '</div>';
    html += '</div>';

    return html;
}

/**
 * Resout : reciproque
 */
function solveReciproque() {
    const st = PythagoreState;
    const S = st.sommets;
    const a = st.a, b = st.b, c = st.c;
    let html = '';

    // Identifier le plus grand cote
    const max = Math.max(a, b, c);
    let maxLabel, otherLabels;
    if (c === max) {
        maxLabel = S[1] + S[2];
        otherLabels = [S[0] + S[1], S[0] + S[2]];
    } else if (b === max) {
        maxLabel = S[0] + S[2];
        otherLabels = [S[0] + S[1], S[1] + S[2]];
    } else {
        maxLabel = S[0] + S[1];
        otherLabels = [S[0] + S[2], S[1] + S[2]];
    }

    // Etape 1 : Identifier le plus grand cote
    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : Identifier le plus grand cote</div>';
    html += '<div class="step-expression">';
    html += S[0] + S[1] + ' = ' + a + ', ' + S[0] + S[2] + ' = ' + b + ', ' + S[1] + S[2] + ' = ' + c;
    html += '</div>';
    html += '<div class="step-explanation">';
    html += 'Le plus grand cote est ' + maxLabel + ' = ' + max + '. S\'il y a un angle droit, il serait oppose a ce cote.';
    html += '</div>';
    html += '</div>';

    // Etape 2 : Calculer max^2
    html += '<div class="step">';
    html += '<div class="step-number">Etape 2 : Calculer ' + maxLabel + '<sup>2</sup></div>';
    html += '<div class="step-expression">';
    html += K(maxLabel + '^2 = ' + max + '^2 = ' + (max * max));
    html += '</div>';
    html += '</div>';

    // Etape 3 : Calculer somme des carres
    const others = [a, b, c].filter(x => x !== max || (a === b && b === c));
    // Recalcul propre
    let side1, side2, lab1, lab2;
    if (c === max) { side1 = a; side2 = b; lab1 = S[0] + S[1]; lab2 = S[0] + S[2]; }
    else if (b === max) { side1 = a; side2 = c; lab1 = S[0] + S[1]; lab2 = S[1] + S[2]; }
    else { side1 = b; side2 = c; lab1 = S[0] + S[2]; lab2 = S[1] + S[2]; }

    const sum = side1 * side1 + side2 * side2;
    html += '<div class="step">';
    html += '<div class="step-number">Etape 3 : Calculer ' + lab1 + '<sup>2</sup> + ' + lab2 + '<sup>2</sup></div>';
    html += '<div class="step-expression">';
    html += K(lab1 + '^2 + ' + lab2 + '^2 = ' + side1 + '^2 + ' + side2 + '^2 = ' + (side1 * side1) + ' + ' + (side2 * side2) + ' = ' + sum);
    html += '</div>';
    html += '</div>';

    // Etape 4 : Comparer
    const maxCarre = max * max;
    html += '<div class="step">';
    html += '<div class="step-number">Etape 4 : Comparer</div>';
    html += '<div class="step-expression">';
    html += K(maxLabel + '^2 = ' + maxCarre) + ' et ' + K(lab1 + '^2 + ' + lab2 + '^2 = ' + sum);
    html += '</div>';
    html += '<div class="step-explanation">';
    if (maxCarre === sum) {
        html += 'On a ' + K(maxLabel + '^2 = ' + lab1 + '^2 + ' + lab2 + '^2') + '.<br>';
        html += 'D\'apres la <strong>reciproque du theoreme de Pythagore</strong>, le triangle est rectangle.';
    } else {
        html += 'On a ' + K(maxCarre + ' \\neq ' + sum) + '.<br>';
        html += maxLabel + '<sup>2</sup> &ne; ' + lab1 + '<sup>2</sup> + ' + lab2 + '<sup>2</sup>, donc le theoreme de Pythagore n\'est pas verifie.';
    }
    html += '</div>';
    html += '</div>';

    // Resultat
    html += '<div class="result-highlight">';
    if (maxCarre === sum) {
        html += '<div class="final">Le triangle ' + S[0] + S[1] + S[2] + ' <strong>est rectangle</strong> en ';
        // L'angle droit est oppose a l'hypotenuse
        if (c === max) html += S[0];
        else if (b === max) html += S[1];
        else html += S[2];
        html += '.</div>';
    } else {
        html += '<div class="final">Le triangle ' + S[0] + S[1] + S[2] + ' <strong>n\'est pas rectangle</strong>.</div>';
    }
    html += '</div>';

    return html;
}

/**
 * Resout : probleme contextualise
 */
function solveProbleme() {
    const st = PythagoreState;
    const ctx = st.contexte;
    const a = st.a, b = st.b, c = st.c;
    let html = '';

    // Etape 1 : Modeliser
    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : Modeliser le probleme</div>';
    html += '<div class="step-expression">';
    html += 'On identifie un triangle rectangle avec :';
    html += '</div>';
    html += '<div class="step-explanation">';
    html += ctx.objetA + ' = ' + a + ' ' + ctx.uniteLabel + '<br>';
    html += ctx.objetB + ' = ' + b + ' ' + ctx.uniteLabel + '<br>';
    html += ctx.objetC + ' = ' + c + ' ' + ctx.uniteLabel;
    html += '</div>';
    html += '</div>';

    let inconnu, result;
    if (ctx.coteInconnu === 'c') {
        // Calculer l'hypotenuse
        const r2 = a * a + b * b;
        result = Math.sqrt(r2);

        html += '<div class="step">';
        html += '<div class="step-number">Etape 2 : Appliquer Pythagore</div>';
        html += '<div class="step-expression">';
        html += K('d^2 = ' + a + '^2 + ' + b + '^2 = ' + (a * a) + ' + ' + (b * b) + ' = ' + r2);
        html += '</div>';
        html += '</div>';

        html += '<div class="step">';
        html += '<div class="step-number">Etape 3 : Conclure</div>';
        html += '<div class="step-expression">';
        html += K('d = \\sqrt{' + r2 + '}');
        html += '</div>';
        html += '</div>';
    } else {
        // Calculer un cote (b inconnu)
        const r2 = c * c - a * a;
        result = Math.sqrt(r2);

        html += '<div class="step">';
        html += '<div class="step-number">Etape 2 : Appliquer Pythagore</div>';
        html += '<div class="step-expression">';
        html += K('h^2 = ' + c + '^2 - ' + a + '^2 = ' + (c * c) + ' - ' + (a * a) + ' = ' + r2);
        html += '</div>';
        html += '</div>';

        html += '<div class="step">';
        html += '<div class="step-number">Etape 3 : Conclure</div>';
        html += '<div class="step-expression">';
        html += K('h = \\sqrt{' + r2 + '}');
        html += '</div>';
        html += '</div>';
    }

    const rStr = Number.isInteger(result) ? result.toString() : result.toFixed(2);
    html += '<div class="result-highlight">';
    html += '<div class="final">';
    if (ctx.coteInconnu === 'c') {
        html += 'La ' + ctx.objetC + ' mesure <strong>' + rStr + ' ' + ctx.uniteLabel + '</strong>.';
    } else {
        html += 'La ' + ctx.objetB + ' mesure <strong>' + rStr + ' ' + ctx.uniteLabel + '</strong>.';
    }
    html += '</div>';
    html += '</div>';

    return html;
}

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', () => {
    initPythagorePage();
});
