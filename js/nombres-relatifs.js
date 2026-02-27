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
    c: 0,
    opB: '+',
    opC: '+',
    // Pour reperage
    nombres: [],
    // Pour comparaison
    paires: [],
};

/**
 * Genere un entier aleatoire entre min et max (inclus), non nul si nonZero=true
 */
function nrRandInt(min, max, nonZero) {
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
        case 'reperage': {
            // Generer 4-5 nombres distincts a placer sur une droite graduee
            const count = nrRandInt(4, 5);
            const set = new Set();
            while (set.size < count) {
                set.add(nrRandInt(-10, 10));
            }
            st.nombres = Array.from(set);
            break;
        }

        case 'comparaison': {
            // Generer 4 paires de nombres a comparer
            st.paires = [];
            for (let i = 0; i < 4; i++) {
                const a = nrRandInt(-20, 20);
                let b;
                do { b = nrRandInt(-20, 20); } while (b === a);
                st.paires.push([a, b]);
            }
            break;
        }

        case 'addition':
            st.a = nrRandInt(-20, 20, true);
            st.b = nrRandInt(-20, 20, true);
            break;

        case 'soustraction':
            st.a = nrRandInt(-20, 20, true);
            st.b = nrRandInt(-20, 20, true);
            break;

        case 'multiplication':
            st.a = nrRandInt(-12, 12, true);
            st.b = nrRandInt(-12, 12, true);
            break;

        case 'division': {
            // Generer une division exacte
            st.b = nrRandInt(-12, 12, true);
            const quotient = nrRandInt(-10, 10, true);
            st.a = st.b * quotient;
            break;
        }

        case 'melange':
            st.a = nrRandInt(-15, 15, true);
            st.b = nrRandInt(-15, 15, true);
            st.c = nrRandInt(-15, 15, true);
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
        case 'reperage':
            display = '<strong>Ranger les nombres suivants dans l\'ordre croissant :</strong><br><br>';
            display += '<span style="font-size: 1.3em;">';
            display += st.nombres.map(n => (n >= 0 ? '+' + n : '' + n)).join(' &nbsp;;&nbsp; ');
            display += '</span>';
            break;

        case 'comparaison':
            display = '<strong>Comparer les nombres suivants (placer &lt; ou &gt;) :</strong><br><br>';
            for (let i = 0; i < st.paires.length; i++) {
                const a = st.paires[i][0];
                const b = st.paires[i][1];
                const aStr = a >= 0 ? '+' + a : '' + a;
                const bStr = b >= 0 ? '+' + b : '' + b;
                display += '<span style="font-size: 1.1em;">' + (i + 1) + ') &nbsp; ' + aStr + ' &nbsp; ... &nbsp; ' + bStr + '</span><br>';
            }
            break;

        case 'addition':
            display = formatRelatif(st.a) + ' + ' + formatRelatif(st.b) + ' = ?';
            break;

        case 'soustraction':
            display = formatRelatif(st.a) + ' &minus; ' + formatRelatif(st.b) + ' = ?';
            break;

        case 'multiplication':
            display = formatRelatif(st.a) + ' &times; ' + formatRelatif(st.b) + ' = ?';
            break;

        case 'division':
            display = formatRelatif(st.a) + ' &divide; ' + formatRelatif(st.b) + ' = ?';
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
        case 'reperage':
            html += solveReperage();
            break;
        case 'comparaison':
            html += solveComparaison();
            break;
        case 'addition':
            html += solveNRAddition();
            break;
        case 'soustraction':
            html += solveNRSoustraction();
            break;
        case 'multiplication':
            html += solveNRMultiplication();
            break;
        case 'division':
            html += solveNRDivision();
            break;
        case 'melange':
            html += solveNRMelange();
            break;
    }

    $('solutionDiv').innerHTML = html;
    showSolution('solutionDiv');
}

/**
 * Resout : reperage (ranger dans l'ordre croissant)
 */
function solveReperage() {
    const st = NombresRelatifsState;
    const sorted = [...st.nombres].sort((a, b) => a - b);
    let html = '';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : Reperer les nombres negatifs et positifs</div>';
    const negatifs = sorted.filter(n => n < 0);
    const positifs = sorted.filter(n => n >= 0);
    html += '<div class="step-expression">';
    html += 'Negatifs : ' + (negatifs.length > 0 ? negatifs.join(', ') : 'aucun');
    html += ' &nbsp;|&nbsp; Positifs : ' + (positifs.length > 0 ? positifs.join(', ') : 'aucun');
    html += '</div>';
    html += '<div class="step-explanation">';
    html += 'Les nombres negatifs sont toujours inferieurs aux nombres positifs.<br>';
    html += 'Plus un nombre negatif est "grand" en valeur absolue, plus il est petit.';
    html += '</div>';
    html += '</div>';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 2 : Droite graduee</div>';
    html += '<div class="step-expression">';
    // Dessiner une droite simplifiee en texte
    html += '<div style="position:relative; height:50px; margin: 10px 0;">';
    html += '<div style="position:absolute; top:20px; left:5%; right:5%; height:2px; background:#333;"></div>';
    const min = Math.min(...sorted) - 1;
    const max = Math.max(...sorted) + 1;
    const range = max - min;
    sorted.forEach(n => {
        const pct = 5 + ((n - min) / range) * 90;
        html += '<div style="position:absolute; top:8px; left:' + pct + '%; transform:translateX(-50%); text-align:center; font-weight:bold; color: var(--primary, #667eea);">' + n + '<div style="width:2px; height:12px; background:#333; margin:2px auto;"></div></div>';
    });
    html += '</div>';
    html += '</div>';
    html += '</div>';

    html += '<div class="result-highlight">';
    html += '<div class="final">Ordre croissant : <strong>' + sorted.map(n => (n >= 0 ? '+' + n : '' + n)).join(' &lt; ') + '</strong></div>';
    html += '</div>';

    return html;
}

/**
 * Resout : comparaison
 */
function solveComparaison() {
    const st = NombresRelatifsState;
    let html = '';

    for (let i = 0; i < st.paires.length; i++) {
        const a = st.paires[i][0];
        const b = st.paires[i][1];
        const aStr = a >= 0 ? '+' + a : '' + a;
        const bStr = b >= 0 ? '+' + b : '' + b;
        const symbol = a < b ? '&lt;' : '&gt;';

        html += '<div class="step">';
        html += '<div class="step-number">' + (i + 1) + ') ' + aStr + ' ... ' + bStr + '</div>';
        html += '<div class="step-expression">' + aStr + ' <strong>' + symbol + '</strong> ' + bStr + '</div>';
        html += '<div class="step-explanation">';
        if (a < 0 && b >= 0) {
            html += 'Un nombre negatif est toujours inferieur a un nombre positif.';
        } else if (a >= 0 && b < 0) {
            html += 'Un nombre positif est toujours superieur a un nombre negatif.';
        } else if (a < 0 && b < 0) {
            html += 'Pour deux negatifs, le plus proche de zero est le plus grand : |' + Math.abs(a) + '| et |' + Math.abs(b) + '|.';
        } else {
            html += 'Pour deux positifs, on compare directement.';
        }
        html += '</div>';
        html += '</div>';
    }

    return html;
}

/**
 * Resout une addition de relatifs
 */
function solveNRAddition() {
    const a = NombresRelatifsState.a;
    const b = NombresRelatifsState.b;
    const result = a + b;
    let html = '';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : Identifier les signes</div>';
    html += '<div class="step-expression">' + formatRelatif(a) + ' + ' + formatRelatif(b) + '</div>';

    if ((a >= 0 && b >= 0) || (a < 0 && b < 0)) {
        const signe = a >= 0 ? 'positifs' : 'negatifs';
        html += '<div class="step-explanation">Les deux nombres sont ' + signe + ' : on additionne les valeurs absolues et on garde le signe.</div>';
        html += '</div>';

        html += '<div class="step">';
        html += '<div class="step-number">Etape 2 : Calculer</div>';
        html += '<div class="step-expression">' + Math.abs(a) + ' + ' + Math.abs(b) + ' = ' + Math.abs(result) + '</div>';
        html += '<div class="step-explanation">On garde le signe ' + (a >= 0 ? 'positif (+)' : 'negatif (-)') + '.</div>';
        html += '</div>';
    } else {
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
function solveNRSoustraction() {
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
function solveNRMultiplication() {
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
 * Resout une division de relatifs
 */
function solveNRDivision() {
    const a = NombresRelatifsState.a;
    const b = NombresRelatifsState.b;
    const result = a / b;
    let html = '';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : Regle des signes</div>';
    html += '<div class="step-expression">' + formatRelatif(a) + ' &divide; ' + formatRelatif(b) + '</div>';

    const signeA = a >= 0 ? '+' : '&minus;';
    const signeB = b >= 0 ? '+' : '&minus;';
    const signeResult = result >= 0 ? '+' : '&minus;';

    html += '<div class="step-explanation">';
    html += 'La regle des signes est la meme que pour la multiplication :<br>';
    html += '(+) &divide; (+) = (+) &nbsp;|&nbsp; (&minus;) &divide; (&minus;) = (+)<br>';
    html += '(+) &divide; (&minus;) = (&minus;) &nbsp;|&nbsp; (&minus;) &divide; (+) = (&minus;)<br>';
    html += 'Ici : (' + signeA + ') &divide; (' + signeB + ') = <strong>(' + signeResult + ')</strong>';
    html += '</div>';
    html += '</div>';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 2 : Diviser les valeurs absolues</div>';
    html += '<div class="step-expression">' + Math.abs(a) + ' &divide; ' + Math.abs(b) + ' = ' + Math.abs(result) + '</div>';
    html += '</div>';

    html += '<div class="result-highlight">';
    html += '<div class="final">' + formatRelatif(a) + ' &divide; ' + formatRelatif(b) + ' = <strong>' + result + '</strong></div>';
    html += '</div>';

    return html;
}

/**
 * Resout une expression melangee
 */
function solveNRMelange() {
    const st = NombresRelatifsState;
    const a = st.a;
    const b = st.b;
    const c = st.c;
    const opB = st.opB;
    const opC = st.opC;

    const inter = opB === '+' ? a + b : a - b;
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
