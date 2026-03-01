/* ========================================
   NOMBRES-DECIMAUX.JS - Operations avec
   nombres entiers et decimaux (6eme)
   ======================================== */

/**
 * Etat de la page nombres decimaux
 */
const NombresDecimauxState = {
    currentType: 'operations',
    currentExercise: null
};

/* ---- Helpers ---- */

function ndRandInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function ndPick(arr) {
    return arr[ndRandInt(0, arr.length - 1)];
}

function ndFormat(n) {
    return Number.isInteger(n) ? n.toString() : parseFloat(n.toFixed(4)).toString();
}

function ndRound(n, decimals) {
    const f = Math.pow(10, decimals);
    return Math.round(n * f) / f;
}

/* ---- Generateurs ---- */

function generateOperations() {
    const op = ndPick(['+', '-', '*', '/']);
    let a, b;

    if (op === '/') {
        // Garantir un resultat exact avec 1 decimale
        b = ndRound(ndRandInt(2, 9) + ndPick([0, 0.5]), 1);
        const result = ndRound(ndRandInt(1, 9) + ndPick([0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]), 1);
        a = ndRound(b * result, 2);
    } else if (op === '*') {
        a = ndRound(ndRandInt(1, 12) + ndPick([0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]), 1);
        b = ndRound(ndRandInt(1, 9) + ndPick([0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]), 1);
    } else {
        a = ndRound(ndRandInt(1, 20) + ndPick([0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]), 1);
        b = ndRound(ndRandInt(1, 15) + ndPick([0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]), 1);
        // Pour la soustraction, s'assurer que a >= b
        if (op === '-' && a < b) { const tmp = a; a = b; b = tmp; }
    }

    return { type: 'operations', a, b, op };
}

function generateComparaison() {
    const count = ndPick([4, 5]);
    const numbers = [];
    for (let i = 0; i < count; i++) {
        const intPart = ndRandInt(0, 15);
        const decPart = ndRandInt(1, 99);
        numbers.push(parseFloat(intPart + '.' + (decPart < 10 ? '0' + decPart : decPart)));
    }
    return { type: 'comparaison', numbers };
}

function generateArrondis() {
    const intPart = ndRandInt(1, 99);
    const d1 = ndRandInt(0, 9);
    const d2 = ndRandInt(0, 9);
    const d3 = ndRandInt(0, 9);
    const d4 = ndPick([null, ndRandInt(1, 9)]);
    const numStr = d4 !== null
        ? `${intPart}.${d1}${d2}${d3}${d4}`
        : `${intPart}.${d1}${d2}${d3}`;
    const number = parseFloat(numStr);
    const target = ndPick(['unite', 'dixieme', 'centieme']);
    return { type: 'arrondis', number, numberStr: numStr, target };
}

function generateOrdreGrandeur() {
    const op = ndPick(['+', '*']);
    let a, b;
    if (op === '*') {
        a = ndRandInt(10, 99);
        b = ndRandInt(10, 99);
    } else {
        a = ndRandInt(100, 999);
        b = ndRandInt(100, 999);
    }
    return { type: 'ordre-grandeur', a, b, op };
}

/* ---- Generation principale ---- */

function generateND() {
    switch (NombresDecimauxState.currentType) {
        case 'operations':    NombresDecimauxState.currentExercise = generateOperations(); break;
        case 'comparaison':   NombresDecimauxState.currentExercise = generateComparaison(); break;
        case 'arrondis':      NombresDecimauxState.currentExercise = generateArrondis(); break;
        case 'ordre-grandeur': NombresDecimauxState.currentExercise = generateOrdreGrandeur(); break;
    }
    updateNDDisplay();
    hideSolution('solutionDiv');
}

/* ---- Affichage ---- */

const OP_SYMBOLS = { '+': '+', '-': '−', '*': '×', '/': '÷' };

function updateNDDisplay() {
    const ex = NombresDecimauxState.currentExercise;
    if (!ex) return;
    let display = '';

    switch (ex.type) {
        case 'operations':
            display = `${ndFormat(ex.a)} ${OP_SYMBOLS[ex.op]} ${ndFormat(ex.b)} = ?`;
            break;
        case 'comparaison':
            display = `Ranger dans l'ordre croissant :<br><br>`;
            display += ex.numbers.map(n => `<strong>${ndFormat(n)}</strong>`).join(' &nbsp;;&nbsp; ');
            break;
        case 'arrondis': {
            const targetLabels = { unite: "l'unité", dixieme: 'au dixième', centieme: 'au centième' };
            display = `Arrondir <strong>${ex.numberStr}</strong> à ${targetLabels[ex.target]}`;
            break;
        }
        case 'ordre-grandeur':
            display = `Donner un ordre de grandeur de :<br><br>`;
            display += `<strong>${ex.a} ${OP_SYMBOLS[ex.op]} ${ex.b}</strong>`;
            break;
    }

    $('exerciseDisplay').innerHTML = display;
}

/* ---- Resolutions ---- */

function solveOperations(ex) {
    let html = '<h3>Solution</h3>';
    const sym = OP_SYMBOLS[ex.op];
    let result;

    html += '<div class="step">';
    html += '<div class="step-number">Étape 1</div>';
    html += `<div class="step-expression">${ndFormat(ex.a)} ${sym} ${ndFormat(ex.b)}</div>`;

    switch (ex.op) {
        case '+':
            result = ndRound(ex.a + ex.b, 4);
            html += `<div class="step-explanation">On additionne les deux nombres en alignant les virgules.</div>`;
            break;
        case '-':
            result = ndRound(ex.a - ex.b, 4);
            html += `<div class="step-explanation">On soustrait en alignant les virgules. On commence par les chiffres les plus à droite.</div>`;
            break;
        case '*':
            result = ndRound(ex.a * ex.b, 4);
            html += `<div class="step-explanation">On multiplie comme des entiers, puis on place la virgule. ` +
                    `Il y a ${(ndFormat(ex.a).split('.')[1] || '').length + (ndFormat(ex.b).split('.')[1] || '').length} ` +
                    `chiffre(s) après la virgule au total.</div>`;
            break;
        case '/':
            result = ndRound(ex.a / ex.b, 4);
            html += `<div class="step-explanation">On effectue la division. On peut multiplier les deux nombres par 10 pour supprimer la virgule du diviseur.</div>`;
            break;
    }
    html += '</div>';

    // Etape 2 : detail intermediaire pour multiplication
    if (ex.op === '*') {
        const decA = (ndFormat(ex.a).split('.')[1] || '').length;
        const decB = (ndFormat(ex.b).split('.')[1] || '').length;
        const totalDec = decA + decB;
        const intA = Math.round(ex.a * Math.pow(10, decA));
        const intB = Math.round(ex.b * Math.pow(10, decB));
        const intProduct = intA * intB;

        html += '<div class="step">';
        html += '<div class="step-number">Étape 2</div>';
        html += `<div class="step-expression">${intA} × ${intB} = ${intProduct}</div>`;
        html += `<div class="step-explanation">On calcule le produit sans les virgules, puis on décale la virgule de ${totalDec} rang(s) vers la gauche.</div>`;
        html += '</div>';
    }

    // Etape detail pour division
    if (ex.op === '/') {
        const decB = (ndFormat(ex.b).split('.')[1] || '').length;
        if (decB > 0) {
            const factor = Math.pow(10, decB);
            const newA = ndRound(ex.a * factor, 2);
            const newB = Math.round(ex.b * factor);
            html += '<div class="step">';
            html += '<div class="step-number">Étape 2</div>';
            html += `<div class="step-expression">${ndFormat(ex.a)} ÷ ${ndFormat(ex.b)} = ${ndFormat(newA)} ÷ ${newB}</div>`;
            html += `<div class="step-explanation">On multiplie dividende et diviseur par ${factor} pour avoir un diviseur entier.</div>`;
            html += '</div>';
        }
    }

    html += '<div class="result-highlight">';
    html += `<div class="final">${ndFormat(ex.a)} ${sym} ${ndFormat(ex.b)} = ${ndFormat(result)}</div>`;
    html += '</div>';

    return html;
}

function solveComparaison(ex) {
    let html = '<h3>Solution</h3>';
    const nums = [...ex.numbers];

    // Etape 1 : comparer les parties entieres
    html += '<div class="step">';
    html += '<div class="step-number">Étape 1 — Comparer les parties entières</div>';
    const intParts = nums.map(n => ({ n, int: Math.floor(n) }));
    html += '<div class="step-expression">';
    html += intParts.map(p => `${ndFormat(p.n)} → partie entière : ${p.int}`).join('<br>');
    html += '</div>';
    html += '<div class="step-explanation">On commence par comparer les parties entières. Un nombre avec une partie entière plus petite est plus petit.</div>';
    html += '</div>';

    // Etape 2 : pour les nombres de meme partie entiere, comparer les decimales
    html += '<div class="step">';
    html += '<div class="step-number">Étape 2 — Comparer les parties décimales</div>';
    html += '<div class="step-expression">';
    html += 'Quand les parties entières sont égales, on compare chiffre par chiffre après la virgule (dixièmes, centièmes...).';
    html += '</div>';
    html += '<div class="step-explanation">On regarde d\'abord les dixièmes, puis les centièmes si nécessaire.</div>';
    html += '</div>';

    // Etape 3 : classement final
    const sorted = [...nums].sort((a, b) => a - b);
    html += '<div class="step">';
    html += '<div class="step-number">Étape 3 — Classement</div>';
    html += '<div class="step-expression">';
    html += sorted.map(n => ndFormat(n)).join(' &lt; ');
    html += '</div>';
    html += '<div class="step-explanation">On écrit les nombres du plus petit au plus grand.</div>';
    html += '</div>';

    html += '<div class="result-highlight">';
    html += `<div class="final">${sorted.map(n => ndFormat(n)).join(' &lt; ')}</div>`;
    html += '</div>';

    return html;
}

function solveArrondis(ex) {
    let html = '<h3>Solution</h3>';
    const targetLabels = { unite: "l'unité", dixieme: 'au dixième', centieme: 'au centième' };
    const targetDecimals = { unite: 0, dixieme: 1, centieme: 2 };
    const dec = targetDecimals[ex.target];

    // Etape 1 : identifier le chiffre a observer
    const parts = ex.numberStr.split('.');
    const intPart = parts[0];
    const decPart = parts[1] || '';
    const posNames = ['dixièmes', 'centièmes', 'millièmes', 'dix-millièmes'];

    let lookAt, lookAtName;
    if (ex.target === 'unite') {
        lookAt = decPart.length > 0 ? parseInt(decPart[0]) : 0;
        lookAtName = 'des dixièmes';
    } else if (ex.target === 'dixieme') {
        lookAt = decPart.length > 1 ? parseInt(decPart[1]) : 0;
        lookAtName = 'des centièmes';
    } else {
        lookAt = decPart.length > 2 ? parseInt(decPart[2]) : 0;
        lookAtName = 'des millièmes';
    }

    html += '<div class="step">';
    html += '<div class="step-number">Étape 1 — Repérer le chiffre décisif</div>';
    html += `<div class="step-expression">Nombre : ${ex.numberStr}</div>`;
    html += `<div class="step-explanation">Pour arrondir à ${targetLabels[ex.target]}, on regarde le chiffre ${lookAtName} : c'est <strong>${lookAt}</strong>.</div>`;
    html += '</div>';

    // Etape 2 : appliquer la regle
    const rounded = ndRound(ex.number, dec);
    const direction = lookAt >= 5 ? 'supérieur' : 'inférieur';
    const rule = lookAt >= 5
        ? 'Ce chiffre est supérieur ou égal à 5, donc on arrondit au-dessus.'
        : 'Ce chiffre est inférieur à 5, donc on arrondit au-dessous.';

    html += '<div class="step">';
    html += '<div class="step-number">Étape 2 — Appliquer la règle</div>';
    html += `<div class="step-expression">${lookAt} est ${direction} à 5</div>`;
    html += `<div class="step-explanation">${rule}</div>`;
    html += '</div>';

    // Resultat
    let roundedStr;
    if (dec === 0) {
        roundedStr = rounded.toString();
    } else {
        roundedStr = rounded.toFixed(dec);
    }

    html += '<div class="result-highlight">';
    html += `<div class="final">${ex.numberStr} arrondi à ${targetLabels[ex.target]} = ${roundedStr}</div>`;
    html += '</div>';

    return html;
}

function solveOrdreGrandeur(ex) {
    let html = '<h3>Solution</h3>';
    const sym = OP_SYMBOLS[ex.op];

    // Etape 1 : arrondir chaque nombre
    let roundA, roundB;
    if (ex.op === '*') {
        roundA = Math.round(ex.a / 10) * 10;
        roundB = Math.round(ex.b / 10) * 10;
    } else {
        roundA = Math.round(ex.a / 100) * 100;
        roundB = Math.round(ex.b / 100) * 100;
    }

    html += '<div class="step">';
    html += '<div class="step-number">Étape 1 — Arrondir les nombres</div>';
    html += `<div class="step-expression">${ex.a} ≈ ${roundA} &nbsp;&nbsp;et&nbsp;&nbsp; ${ex.b} ≈ ${roundB}</div>`;
    const precision = ex.op === '*' ? 'à la dizaine' : 'à la centaine';
    html += `<div class="step-explanation">On arrondit chaque nombre ${precision} la plus proche pour simplifier le calcul.</div>`;
    html += '</div>';

    // Etape 2 : calcul approche
    const estimate = ex.op === '*' ? roundA * roundB : roundA + roundB;
    html += '<div class="step">';
    html += '<div class="step-number">Étape 2 — Calcul approché</div>';
    html += `<div class="step-expression">${roundA} ${sym} ${roundB} = ${estimate}</div>`;
    html += '<div class="step-explanation">On effectue l\'opération avec les nombres arrondis.</div>';
    html += '</div>';

    // Etape 3 : calcul exact pour comparaison
    const exact = ex.op === '*' ? ex.a * ex.b : ex.a + ex.b;
    html += '<div class="step">';
    html += '<div class="step-number">Étape 3 — Vérification (calcul exact)</div>';
    html += `<div class="step-expression">${ex.a} ${sym} ${ex.b} = ${exact}</div>`;
    html += `<div class="step-explanation">L'ordre de grandeur (${estimate}) est proche du résultat exact (${exact}).</div>`;
    html += '</div>';

    html += '<div class="result-highlight">';
    html += `<div class="final">Ordre de grandeur de ${ex.a} ${sym} ${ex.b} ≈ ${estimate}</div>`;
    html += '</div>';

    return html;
}

/* ---- Resolution principale ---- */

function solveND() {
    const ex = NombresDecimauxState.currentExercise;
    if (!ex) return;
    let html = '';

    switch (ex.type) {
        case 'operations':     html = solveOperations(ex); break;
        case 'comparaison':    html = solveComparaison(ex); break;
        case 'arrondis':       html = solveArrondis(ex); break;
        case 'ordre-grandeur': html = solveOrdreGrandeur(ex); break;
    }

    $('solutionDiv').innerHTML = html;
    showSolution('solutionDiv');
}

/* ---- Initialisation ---- */

function initNombresDecimauxPage() {
    // Boutons de type
    const typeButtons = document.querySelectorAll('.type-btn');
    typeButtons.forEach(button => {
        button.addEventListener('click', () => {
            typeButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            NombresDecimauxState.currentType = button.dataset.type;
            generateND();
        });
    });

    // Boutons d'action
    $('generateBtn').addEventListener('click', () => {
        generateND();
    });

    $('solveBtn').addEventListener('click', () => {
        solveND();
    });

    // Premier exercice
    generateND();
}

document.addEventListener('DOMContentLoaded', initNombresDecimauxPage);
