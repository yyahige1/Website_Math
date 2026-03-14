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
 * Formate un nombre relatif (sans parentheses inutiles)
 */
function formatNR(n) {
    return String(n);
}

/**
 * Formate un nombre apparaissant apres un operateur
 * Parentheses uniquement si negatif : 5 + (-3)
 */
function formatNRAfterOp(n) {
    if (n < 0) return '(' + n + ')';
    return String(n);
}

/**
 * Simplifie l'affichage d'une operation : a OP b
 * Ex: 5, '+', -3 => "5 - 3"
 *     5, '-', -3 => "5 + 3"
 */
function nrSimplifiedOp(a, op, b) {
    let str = formatNR(a);
    if (op === '+') {
        if (b >= 0) str += ' + ' + b;
        else str += ' &minus; ' + Math.abs(b);
    } else {
        if (b >= 0) str += ' &minus; ' + b;
        else str += ' + ' + Math.abs(b);
    }
    return str;
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
            const count = nrRandInt(4, 5);
            const set = new Set();
            while (set.size < count) {
                set.add(nrRandInt(-10, 10));
            }
            st.nombres = Array.from(set);
            break;
        }

        case 'comparaison': {
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
            display += st.nombres.join(' &nbsp;;&nbsp; ');
            display += '</span>';
            break;

        case 'comparaison':
            display = '<strong>Comparer les nombres suivants (placer &lt; ou &gt;) :</strong><br><br>';
            for (let i = 0; i < st.paires.length; i++) {
                display += '<span style="font-size: 1.1em;">' + (i + 1) + ') &nbsp; ' + st.paires[i][0] + ' &nbsp; ... &nbsp; ' + st.paires[i][1] + '</span><br>';
            }
            break;

        case 'addition':
            display = formatNR(st.a) + ' + ' + formatNRAfterOp(st.b) + ' = ?';
            break;

        case 'soustraction':
            display = formatNR(st.a) + ' &minus; ' + formatNRAfterOp(st.b) + ' = ?';
            break;

        case 'multiplication':
            display = formatNR(st.a) + ' &times; ' + formatNRAfterOp(st.b) + ' = ?';
            break;

        case 'division':
            display = formatNR(st.a) + ' &divide; ' + formatNRAfterOp(st.b) + ' = ?';
            break;

        case 'melange': {
            let expr = formatNR(st.a);
            const opBsym = st.opB === '-' ? '&minus;' : '+';
            const opCsym = st.opC === '-' ? '&minus;' : '+';
            expr += ' ' + opBsym + ' ' + formatNRAfterOp(st.b);
            expr += ' ' + opCsym + ' ' + formatNRAfterOp(st.c);
            display = expr + ' = ?';
            break;
        }
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

    // Etape 1 : Identifier negatifs et positifs
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
    html += 'Plus un nombre negatif est eloigne de zero, plus il est petit.';
    html += '</div>';
    html += '</div>';

    // Etape 2 : Droite graduee
    html += '<div class="step">';
    html += '<div class="step-number">Etape 2 : Droite graduee</div>';
    html += '<div class="step-expression">';

    const allNums = [...sorted];
    const lineMin = Math.min(...allNums) - 2;
    const lineMax = Math.max(...allNums) + 2;

    html += '<div style="position:relative; height:70px; margin:15px 10px; overflow:visible;">';
    // Ligne principale
    html += '<div style="position:absolute; top:30px; left:2%; right:2%; height:2px; background:#555;"></div>';
    // Fleche droite
    html += '<div style="position:absolute; top:26px; right:1%; width:0; height:0; border-left:8px solid #555; border-top:5px solid transparent; border-bottom:5px solid transparent;"></div>';

    // Graduations pour tous les entiers dans la plage
    for (let i = Math.ceil(lineMin); i <= Math.floor(lineMax); i++) {
        const pct = 2 + ((i - lineMin) / (lineMax - lineMin)) * 96;
        const isTarget = st.nombres.includes(i);
        const isZero = i === 0;

        // Trait de graduation
        const tickH = (isTarget || isZero) ? 14 : 8;
        const tickTop = 30 - tickH / 2;
        const tickColor = isTarget ? 'var(--primary, #667eea)' : (isZero ? '#333' : '#bbb');
        html += '<div style="position:absolute; top:' + tickTop + 'px; left:' + pct + '%; width:2px; height:' + tickH + 'px; background:' + tickColor + '; transform:translateX(-50%);"></div>';

        // Numero en dessous
        if (isTarget || isZero || (i % 2 === 0)) {
            const color = isTarget ? 'var(--primary, #667eea)' : '#888';
            const fw = isTarget ? 'bold' : 'normal';
            const fs = isTarget ? '0.95em' : '0.8em';
            html += '<div style="position:absolute; top:42px; left:' + pct + '%; transform:translateX(-50%); font-size:' + fs + '; color:' + color + '; font-weight:' + fw + ';">' + i + '</div>';
        }

        // Point colore pour les nombres a placer
        if (isTarget) {
            html += '<div style="position:absolute; top:27px; left:' + pct + '%; width:8px; height:8px; background:var(--primary, #667eea); border-radius:50%; transform:translateX(-50%);"></div>';
        }
    }

    html += '</div>';
    html += '</div>';
    html += '</div>';

    // Resultat
    html += '<div class="result-highlight">';
    html += '<div class="final">Ordre croissant : <strong>' + sorted.join(' &lt; ') + '</strong></div>';
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
        const symbol = a < b ? '&lt;' : '&gt;';

        html += '<div class="step">';
        html += '<div class="step-number">' + (i + 1) + ') ' + a + ' ... ' + b + '</div>';
        html += '<div class="step-expression">' + a + ' <strong>' + symbol + '</strong> ' + b + '</div>';
        html += '<div class="step-explanation">';
        if (a < 0 && b >= 0) {
            html += 'Un nombre negatif est toujours inferieur a un nombre positif.';
        } else if (a >= 0 && b < 0) {
            html += 'Un nombre positif est toujours superieur a un nombre negatif.';
        } else if (a < 0 && b < 0) {
            html += 'Pour deux nombres negatifs, le plus proche de zero est le plus grand. ';
            html += Math.abs(a) < Math.abs(b)
                ? a + ' est plus proche de zero que ' + b + '.'
                : b + ' est plus proche de zero que ' + a + '.';
        } else {
            html += 'Pour deux nombres positifs, on compare directement.';
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
    const absA = Math.abs(a);
    const absB = Math.abs(b);
    let html = '';

    // Afficher l'expression de depart
    html += '<div class="step">';
    html += '<div class="step-number">Etape 1</div>';
    html += '<div class="step-expression">' + formatNR(a) + ' + ' + formatNRAfterOp(b) + '</div>';

    if (a >= 0 && b >= 0) {
        // (+) + (+) : cas simple
        html += '<div class="step-explanation">Les deux nombres sont positifs, on les additionne normalement.</div>';
        html += '</div>';

        html += '<div class="step">';
        html += '<div class="step-number">Etape 2</div>';
        html += '<div class="step-expression">' + a + ' + ' + b + ' = ' + result + '</div>';
        html += '</div>';

    } else if (a < 0 && b < 0) {
        // (-) + (-) : on additionne et on garde le signe -
        html += '<div class="step-explanation">Les deux nombres sont negatifs. On additionne ' + absA + ' et ' + absB + ', puis on met le signe moins devant.</div>';
        html += '</div>';

        html += '<div class="step">';
        html += '<div class="step-number">Etape 2</div>';
        html += '<div class="step-expression">' + absA + ' + ' + absB + ' = ' + (absA + absB) + '</div>';
        html += '<div class="step-explanation">On met le signe moins : &minus;' + (absA + absB) + '</div>';
        html += '</div>';

    } else {
        // Signes differents : on simplifie d'abord
        html += '<div class="step-explanation">Les signes sont differents. Ajouter un nombre negatif revient a soustraire.</div>';
        html += '</div>';

        // Etape 2 : ecriture simplifiee
        html += '<div class="step">';
        html += '<div class="step-number">Etape 2 : On simplifie</div>';
        html += '<div class="step-expression">' + nrSimplifiedOp(a, '+', b) + '</div>';

        if (b < 0) {
            html += '<div class="step-explanation">' + formatNR(a) + ' + (' + b + ') revient a calculer ' + formatNR(a) + ' &minus; ' + absB + '.</div>';
        } else {
            html += '<div class="step-explanation">' + formatNR(a) + ' + ' + b + ' : on part de ' + formatNR(a) + ' et on avance de ' + b + '.</div>';
        }
        html += '</div>';

        // Etape 3 : calcul
        html += '<div class="step">';
        html += '<div class="step-number">Etape 3 : On calcule</div>';

        if (absA === absB) {
            html += '<div class="step-expression">' + absA + ' &minus; ' + absB + ' = 0</div>';
            html += '<div class="step-explanation">Les deux nombres s\'annulent !</div>';
        } else if (absA > absB) {
            html += '<div class="step-expression">' + absA + ' &minus; ' + absB + ' = ' + (absA - absB) + '</div>';
            html += '<div class="step-explanation">' + absA + ' est plus grand que ' + absB + ', donc le resultat garde le signe de ' + formatNR(a) + ' : c\'est <strong>' + result + '</strong>.</div>';
        } else {
            html += '<div class="step-expression">' + absB + ' &minus; ' + absA + ' = ' + (absB - absA) + '</div>';
            html += '<div class="step-explanation">' + absB + ' est plus grand que ' + absA + ', donc le resultat garde le signe de ' + formatNR(b) + ' : c\'est <strong>' + result + '</strong>.</div>';
        }
        html += '</div>';
    }

    html += '<div class="result-highlight">';
    html += '<div class="final">' + formatNR(a) + ' + ' + formatNRAfterOp(b) + ' = <strong>' + result + '</strong></div>';
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
    const absA = Math.abs(a);
    const absB = Math.abs(b);
    let html = '';

    // Etape 1 : Expression de depart
    html += '<div class="step">';
    html += '<div class="step-number">Etape 1</div>';
    html += '<div class="step-expression">' + formatNR(a) + ' &minus; ' + formatNRAfterOp(b) + '</div>';
    html += '<div class="step-explanation">Soustraire un nombre, c\'est ajouter son oppose.<br>L\'oppose de ' + formatNR(b) + ', c\'est ' + formatNR(-b) + '.</div>';
    html += '</div>';

    // Etape 2 : Transformation
    html += '<div class="step">';
    html += '<div class="step-number">Etape 2 : On transforme</div>';
    html += '<div class="step-expression">' + formatNR(a) + ' + ' + formatNRAfterOp(-b) + '</div>';

    if (b < 0) {
        html += '<div class="step-explanation">' + formatNR(a) + ' &minus; (' + b + ') devient ' + formatNR(a) + ' + ' + Math.abs(b) + '.</div>';
    } else if (b > 0) {
        html += '<div class="step-explanation">' + formatNR(a) + ' &minus; ' + b + ' devient ' + formatNR(a) + ' + (' + (-b) + ').</div>';
    }
    html += '</div>';

    // Etape 3 : Calcul (reutilise la logique addition)
    const newA = a;
    const newB = -b;
    const absNewA = Math.abs(newA);
    const absNewB = Math.abs(newB);

    html += '<div class="step">';
    html += '<div class="step-number">Etape 3 : On calcule</div>';

    if ((newA >= 0 && newB >= 0) || (newA < 0 && newB < 0)) {
        // Meme signe
        html += '<div class="step-expression">' + absNewA + ' + ' + absNewB + ' = ' + (absNewA + absNewB) + '</div>';
        if (newA >= 0) {
            html += '<div class="step-explanation">Les deux sont positifs, on additionne directement.</div>';
        } else {
            html += '<div class="step-explanation">Les deux sont negatifs, on additionne ' + absNewA + ' et ' + absNewB + ' puis on met le signe moins.</div>';
        }
    } else {
        // Signes differents
        if (absNewA === absNewB) {
            html += '<div class="step-expression">' + absNewA + ' &minus; ' + absNewB + ' = 0</div>';
            html += '<div class="step-explanation">Les deux nombres s\'annulent !</div>';
        } else if (absNewA > absNewB) {
            html += '<div class="step-expression">' + absNewA + ' &minus; ' + absNewB + ' = ' + (absNewA - absNewB) + '</div>';
            html += '<div class="step-explanation">' + absNewA + ' est plus grand que ' + absNewB + '. Le resultat garde le signe de ' + formatNR(newA) + '.</div>';
        } else {
            html += '<div class="step-expression">' + absNewB + ' &minus; ' + absNewA + ' = ' + (absNewB - absNewA) + '</div>';
            html += '<div class="step-explanation">' + absNewB + ' est plus grand que ' + absNewA + '. Le resultat garde le signe de ' + formatNR(newB) + '.</div>';
        }
    }
    html += '</div>';

    html += '<div class="result-highlight">';
    html += '<div class="final">' + formatNR(a) + ' &minus; ' + formatNRAfterOp(b) + ' = <strong>' + result + '</strong></div>';
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
    html += '<div class="step-expression">' + formatNR(a) + ' &times; ' + formatNRAfterOp(b) + '</div>';

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
    html += '<div class="step-number">Etape 2 : Multiplier les parties numeriques</div>';
    html += '<div class="step-expression">' + Math.abs(a) + ' &times; ' + Math.abs(b) + ' = ' + Math.abs(result) + '</div>';
    html += '</div>';

    html += '<div class="result-highlight">';
    html += '<div class="final">' + formatNR(a) + ' &times; ' + formatNRAfterOp(b) + ' = <strong>' + result + '</strong></div>';
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
    html += '<div class="step-expression">' + formatNR(a) + ' &divide; ' + formatNRAfterOp(b) + '</div>';

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
    html += '<div class="step-number">Etape 2 : Diviser les parties numeriques</div>';
    html += '<div class="step-expression">' + Math.abs(a) + ' &divide; ' + Math.abs(b) + ' = ' + Math.abs(result) + '</div>';
    html += '</div>';

    html += '<div class="result-highlight">';
    html += '<div class="final">' + formatNR(a) + ' &divide; ' + formatNRAfterOp(b) + ' = <strong>' + result + '</strong></div>';
    html += '</div>';

    return html;
}

/**
 * Resout une expression melangee (3 termes)
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

    const opBsym = opB === '-' ? '&minus;' : '+';
    const opCsym = opC === '-' ? '&minus;' : '+';
    const exprFull = formatNR(a) + ' ' + opBsym + ' ' + formatNRAfterOp(b) + ' ' + opCsym + ' ' + formatNRAfterOp(c);

    let html = '';

    // Etape 1 : Simplifier les signes
    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : Simplifier les signes</div>';
    html += '<div class="step-expression">' + exprFull + '</div>';

    // Construire la version simplifiee
    let simplified = formatNR(a);
    // Deuxieme terme
    const effB = opB === '-' ? -b : b;
    if (effB >= 0) {
        simplified += ' + ' + effB;
    } else {
        simplified += ' &minus; ' + Math.abs(effB);
    }
    // Troisieme terme
    const effC = opC === '-' ? -c : c;
    if (effC >= 0) {
        simplified += ' + ' + effC;
    } else {
        simplified += ' &minus; ' + Math.abs(effC);
    }
    html += '<div class="step-explanation">On simplifie : ' + simplified + '</div>';
    html += '</div>';

    // Etape 2 : Premier calcul
    html += '<div class="step">';
    html += '<div class="step-number">Etape 2 : On calcule de gauche a droite</div>';
    const absA = Math.abs(a);
    const absEffB = Math.abs(effB);

    let step2expr = formatNR(a);
    if (effB >= 0) step2expr += ' + ' + effB;
    else step2expr += ' &minus; ' + absEffB;
    step2expr += ' = ' + inter;

    html += '<div class="step-expression">' + step2expr + '</div>';
    html += '<div class="step-explanation">Le resultat intermediaire est ' + inter + '.</div>';
    html += '</div>';

    // Etape 3 : Deuxieme calcul
    html += '<div class="step">';
    html += '<div class="step-number">Etape 3 : On continue</div>';

    let step3expr = formatNR(inter);
    if (effC >= 0) step3expr += ' + ' + effC;
    else step3expr += ' &minus; ' + Math.abs(effC);
    step3expr += ' = ' + result;

    html += '<div class="step-expression">' + step3expr + '</div>';
    html += '</div>';

    // Resultat
    html += '<div class="result-highlight">';
    html += '<div class="final">' + exprFull + ' = <strong>' + result + '</strong></div>';
    html += '</div>';

    return html;
}

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', () => {
    initNombresRelatifsPage();
});
