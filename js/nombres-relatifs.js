/* ========================================
   NOMBRES-RELATIFS.JS - Operations sur les nombres relatifs
   ======================================== */

/**
 * Etat du module
 */
const NombresRelatifsState = {
    currentType: 'addition',
    a: 0,
    b: 0,
    c: 0, // pour melange
    opB: '+', // pour melange
    opC: '+', // pour melange
};

/**
 * Genere un entier aleatoire entre min et max (inclus), non nul si nonZero=true
 */
function randInt(min, max, nonZero) {
    let n;
    do {
        n = Math.floor(Math.random() * (max - min + 1)) + min;
    } while (nonZero && n === 0);
    return n;
}

/**
 * Formate un nombre relatif avec parentheses : (+5) ou (-3)
 */
function formatRelatif(n) {
    if (n >= 0) return '(+' + n + ')';
    return '(' + n + ')';
}

/**
 * Initialise la page
 */
function initNombresRelatifsPage() {
    setupTypeButtons();
    setupActionButtons();
    generateNombresRelatifs();
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
            NombresRelatifsState.currentType = button.dataset.type;
            generateNombresRelatifs();
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
        generateNombresRelatifs();
        updateExerciseDisplay();
        hideSolution('solutionDiv');
    });

    $('solveBtn').addEventListener('click', () => {
        solveNombresRelatifs();
    });
}

/**
 * Genere un nouvel exercice
 */
function generateNombresRelatifs() {
    const st = NombresRelatifsState;

    switch (st.currentType) {
        case 'addition':
            st.a = randInt(-20, 20, true);
            st.b = randInt(-20, 20, true);
            break;

        case 'soustraction':
            st.a = randInt(-20, 20, true);
            st.b = randInt(-20, 20, true);
            break;

        case 'multiplication':
            st.a = randInt(-12, 12, true);
            st.b = randInt(-12, 12, true);
            break;

        case 'melange':
            st.a = randInt(-15, 15, true);
            st.b = randInt(-15, 15, true);
            st.c = randInt(-15, 15, true);
            st.opB = Math.random() < 0.5 ? '+' : '-';
            st.opC = Math.random() < 0.5 ? '+' : '-';
            break;
    }
}

/**
 * Met a jour l'affichage de l'exercice
 */
function updateExerciseDisplay() {
    const st = NombresRelatifsState;
    let display = '';

    switch (st.currentType) {
        case 'addition':
            display = formatRelatif(st.a) + ' + ' + formatRelatif(st.b) + ' = ?';
            break;

        case 'soustraction':
            display = formatRelatif(st.a) + ' &minus; ' + formatRelatif(st.b) + ' = ?';
            break;

        case 'multiplication':
            display = formatRelatif(st.a) + ' &times; ' + formatRelatif(st.b) + ' = ?';
            break;

        case 'melange':
            display = formatRelatif(st.a)
                + ' ' + st.opB + ' ' + formatRelatif(st.b)
                + ' ' + st.opC + ' ' + formatRelatif(st.c)
                + ' = ?';
            break;
    }

    $('exerciseDisplay').innerHTML = display;
}

/**
 * Resout l'exercice courant
 */
function solveNombresRelatifs() {
    let html = '<h3>Solution</h3>';

    switch (NombresRelatifsState.currentType) {
        case 'addition':
            html += solveAddition();
            break;
        case 'soustraction':
            html += solveSoustraction();
            break;
        case 'multiplication':
            html += solveMultiplication();
            break;
        case 'melange':
            html += solveMelange();
            break;
    }

    $('solutionDiv').innerHTML = html;
    showSolution('solutionDiv');
}

/**
 * Resout une addition de relatifs
 */
function solveAddition() {
    const a = NombresRelatifsState.a;
    const b = NombresRelatifsState.b;
    const result = a + b;
    let html = '';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : Identifier les signes</div>';
    html += '<div class="step-expression">' + formatRelatif(a) + ' + ' + formatRelatif(b) + '</div>';

    if ((a >= 0 && b >= 0) || (a < 0 && b < 0)) {
        // Meme signe
        const signe = a >= 0 ? 'positifs' : 'negatifs';
        html += '<div class="step-explanation">Les deux nombres sont ' + signe + ' : on additionne les valeurs absolues et on garde le signe.</div>';
        html += '</div>';

        html += '<div class="step">';
        html += '<div class="step-number">Etape 2 : Calculer</div>';
        html += '<div class="step-expression">' + Math.abs(a) + ' + ' + Math.abs(b) + ' = ' + Math.abs(result) + '</div>';
        html += '<div class="step-explanation">On garde le signe ' + (a >= 0 ? 'positif (+)' : 'negatif (-)') + '.</div>';
        html += '</div>';
    } else {
        // Signes differents
        html += '<div class="step-explanation">Les nombres sont de signes contraires : on soustrait la plus petite valeur absolue de la plus grande, et on prend le signe de celui qui a la plus grande valeur absolue.</div>';
        html += '</div>';

        html += '<div class="step">';
        html += '<div class="step-number">Etape 2 : Calculer</div>';
        const absA = Math.abs(a);
        const absB = Math.abs(b);
        const diff = Math.abs(absA - absB);
        const plusGrand = absA >= absB ? a : b;
        html += '<div class="step-expression">' + Math.max(absA, absB) + ' &minus; ' + Math.min(absA, absB) + ' = ' + diff + '</div>';
        html += '<div class="step-explanation">Le nombre avec la plus grande valeur absolue est ' + formatRelatif(plusGrand) + ', donc le resultat est ' + (plusGrand >= 0 ? 'positif' : 'negatif') + '.</div>';
        html += '</div>';
    }

    html += '<div class="result-highlight">';
    html += '<div class="final">' + formatRelatif(a) + ' + ' + formatRelatif(b) + ' = <strong>' + result + '</strong></div>';
    html += '</div>';

    return html;
}

/**
 * Resout une soustraction de relatifs
 */
function solveSoustraction() {
    const a = NombresRelatifsState.a;
    const b = NombresRelatifsState.b;
    const result = a - b;
    let html = '';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : Transformer en addition</div>';
    html += '<div class="step-expression">' + formatRelatif(a) + ' &minus; ' + formatRelatif(b) + '</div>';
    html += '<div class="step-explanation">Soustraire un nombre, c\'est ajouter son oppose. L\'oppose de ' + formatRelatif(b) + ' est ' + formatRelatif(-b) + '.</div>';
    html += '</div>';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 2 : Calculer l\'addition</div>';
    html += '<div class="step-expression">' + formatRelatif(a) + ' + ' + formatRelatif(-b) + '</div>';

    if ((a >= 0 && -b >= 0) || (a < 0 && -b < 0)) {
        const signe = a >= 0 ? 'positifs' : 'negatifs';
        html += '<div class="step-explanation">Meme signe (' + signe + ') : on additionne les valeurs absolues.</div>';
    } else {
        html += '<div class="step-explanation">Signes contraires : on soustrait et on garde le signe du plus grand en valeur absolue.</div>';
    }
    html += '</div>';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 3 : Resultat</div>';
    html += '<div class="step-expression">' + a + ' + ' + (-b) + ' = ' + result + '</div>';
    html += '</div>';

    html += '<div class="result-highlight">';
    html += '<div class="final">' + formatRelatif(a) + ' &minus; ' + formatRelatif(b) + ' = <strong>' + result + '</strong></div>';
    html += '</div>';

    return html;
}

/**
 * Resout une multiplication de relatifs
 */
function solveMultiplication() {
    const a = NombresRelatifsState.a;
    const b = NombresRelatifsState.b;
    const result = a * b;
    let html = '';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : Regle des signes</div>';
    html += '<div class="step-expression">' + formatRelatif(a) + ' &times; ' + formatRelatif(b) + '</div>';

    const signeA = a >= 0 ? '+' : '&minus;';
    const signeB = b >= 0 ? '+' : '&minus;';
    const signeResult = result >= 0 ? '+' : '&minus;';

    html += '<div class="step-explanation">';
    html += 'Regle des signes :<br>';
    html += '(+) &times; (+) = (+) &nbsp;|&nbsp; (&minus;) &times; (&minus;) = (+)<br>';
    html += '(+) &times; (&minus;) = (&minus;) &nbsp;|&nbsp; (&minus;) &times; (+) = (&minus;)<br>';
    html += 'Ici : (' + signeA + ') &times; (' + signeB + ') = <strong>(' + signeResult + ')</strong>';
    html += '</div>';
    html += '</div>';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 2 : Multiplier les valeurs absolues</div>';
    html += '<div class="step-expression">' + Math.abs(a) + ' &times; ' + Math.abs(b) + ' = ' + Math.abs(result) + '</div>';
    html += '</div>';

    html += '<div class="result-highlight">';
    html += '<div class="final">' + formatRelatif(a) + ' &times; ' + formatRelatif(b) + ' = <strong>' + result + '</strong></div>';
    html += '</div>';

    return html;
}

/**
 * Resout une expression melangee
 */
function solveMelange() {
    const st = NombresRelatifsState;
    const a = st.a;
    const b = st.b;
    const c = st.c;
    const opB = st.opB;
    const opC = st.opC;

    // Calculer le resultat intermediaire (a opB b)
    const inter = opB === '+' ? a + b : a - b;
    // Calculer le resultat final (inter opC c)
    const result = opC === '+' ? inter + c : inter - c;

    let html = '';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : Calculer de gauche a droite</div>';
    html += '<div class="step-expression">' + formatRelatif(a) + ' ' + opB + ' ' + formatRelatif(b) + '</div>';

    if (opB === '-') {
        html += '<div class="step-explanation">Soustraire ' + formatRelatif(b) + ' revient a ajouter ' + formatRelatif(-b) + '.</div>';
        html += '</div>';
        html += '<div class="step">';
        html += '<div class="step-number">Etape 1 (suite)</div>';
        html += '<div class="step-expression">' + a + ' + ' + (-b) + ' = ' + inter + '</div>';
    } else {
        html += '<div class="step-explanation">' + a + ' + ' + b + ' = ' + inter + '</div>';
    }
    html += '</div>';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 2 : Suite du calcul</div>';
    html += '<div class="step-expression">' + formatRelatif(inter) + ' ' + opC + ' ' + formatRelatif(c) + '</div>';

    if (opC === '-') {
        html += '<div class="step-explanation">Soustraire ' + formatRelatif(c) + ' revient a ajouter ' + formatRelatif(-c) + '.</div>';
        html += '</div>';
        html += '<div class="step">';
        html += '<div class="step-number">Etape 2 (suite)</div>';
        html += '<div class="step-expression">' + inter + ' + ' + (-c) + ' = ' + result + '</div>';
    } else {
        html += '<div class="step-explanation">' + inter + ' + ' + c + ' = ' + result + '</div>';
    }
    html += '</div>';

    const displayOp = function(op) { return op === '-' ? '&minus;' : '+'; };
    html += '<div class="result-highlight">';
    html += '<div class="final">' + formatRelatif(a) + ' ' + displayOp(opB) + ' ' + formatRelatif(b) + ' ' + displayOp(opC) + ' ' + formatRelatif(c) + ' = <strong>' + result + '</strong></div>';
    html += '</div>';

    return html;
}

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', () => {
    initNombresRelatifsPage();
});
