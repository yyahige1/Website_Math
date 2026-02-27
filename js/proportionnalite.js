/* ========================================
   PROPORTIONNALITE.JS - Proportionnalite
   ======================================== */

/**
 * Etat du module
 */
const ProportionnaliteState = {
    currentType: 'tableau',
    // Tableau : 2 lignes, n colonnes, une valeur manquante
    coefficient: 0,
    valeurs1: [],   // ligne du haut
    valeurs2: [],   // ligne du bas
    missingRow: 0,  // 0 = ligne haut, 1 = ligne bas
    missingCol: 0,  // index colonne manquante
    contexte: null,
    // Produit en croix
    crossA: 0,
    crossB: 0,
    crossC: 0,
    crossMissing: 0, // la 4e valeur
};

/**
 * Entier aleatoire entre min et max (inclus)
 */
function propRandInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Choix aleatoire dans un tableau
 */
function propPick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Initialise la page
 */
function initProportionnalitePage() {
    setupTypeButtons();
    setupActionButtons();
    generateProportionnalite();
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
            ProportionnaliteState.currentType = button.dataset.type;
            generateProportionnalite();
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
        generateProportionnalite();
        updateExerciseDisplay();
        hideSolution('solutionDiv');
    });

    $('solveBtn').addEventListener('click', () => {
        solveProportionnalite();
    });
}

/**
 * Contextes pour les problemes
 */
const CONTEXTES = [
    { ligne1: 'Quantite (kg)', ligne2: 'Prix (euros)', unite1: 'kg', unite2: 'euros' },
    { ligne1: 'Nombre de cahiers', ligne2: 'Prix (euros)', unite1: 'cahiers', unite2: 'euros' },
    { ligne1: 'Distance (km)', ligne2: 'Temps (min)', unite1: 'km', unite2: 'min' },
    { ligne1: 'Nombre de parts', ligne2: 'Farine (g)', unite1: 'parts', unite2: 'g' },
    { ligne1: 'Nombre d\'eleves', ligne2: 'Nombre de stylos', unite1: 'eleves', unite2: 'stylos' },
];

/**
 * Genere un nouvel exercice
 */
function generateProportionnalite() {
    const st = ProportionnaliteState;

    switch (st.currentType) {
        case 'tableau':
            generateTableau();
            break;
        case 'coefficient':
            generateCoefficient();
            break;
        case 'produit-croix':
            generateProduitCroix();
            break;
    }
}

function generateTableau() {
    const st = ProportionnaliteState;
    const nbCols = propRandInt(3, 4);
    st.coefficient = propPick([2, 3, 4, 5, 1.5, 2.5, 0.5]);
    st.contexte = propPick(CONTEXTES);

    st.valeurs1 = [];
    st.valeurs2 = [];
    for (let i = 0; i < nbCols; i++) {
        const v = propRandInt(1, 12);
        st.valeurs1.push(v);
        st.valeurs2.push(v * st.coefficient);
    }

    st.missingRow = propRandInt(0, 1);
    st.missingCol = propRandInt(0, nbCols - 1);
}

function generateCoefficient() {
    const st = ProportionnaliteState;
    st.coefficient = propPick([2, 3, 4, 5, 6, 1.5, 2.5, 0.5]);
    st.contexte = propPick(CONTEXTES);

    const nbCols = 3;
    st.valeurs1 = [];
    st.valeurs2 = [];
    for (let i = 0; i < nbCols; i++) {
        const v = propRandInt(1, 10);
        st.valeurs1.push(v);
        st.valeurs2.push(v * st.coefficient);
    }
}

function generateProduitCroix() {
    const st = ProportionnaliteState;
    st.coefficient = propPick([2, 3, 4, 5, 1.5, 2.5]);
    st.contexte = propPick(CONTEXTES);

    st.crossA = propRandInt(2, 12);
    st.crossB = st.crossA * st.coefficient;
    st.crossC = propRandInt(2, 12);
    st.crossMissing = st.crossC * st.coefficient;
}

/**
 * Formate un nombre (enleve .0 inutile)
 */
function propFormatNum(n) {
    if (Number.isInteger(n)) return n.toString();
    return parseFloat(n.toFixed(2)).toString();
}

/**
 * Construit un tableau HTML
 */
function buildTableHTML(row1, row2, ctx, missingRow, missingCol) {
    let html = '<table style="border-collapse: collapse; margin: 10px auto; font-size: 1.1em;">';
    html += '<tr style="background: var(--gray-100, #f5f5f5);">';
    html += '<th style="border: 1px solid #ccc; padding: 8px 14px;">' + ctx.ligne1 + '</th>';
    for (let i = 0; i < row1.length; i++) {
        const val = (missingRow === 0 && missingCol === i) ? '<strong style="color: var(--primary, #667eea);">?</strong>' : propFormatNum(row1[i]);
        html += '<td style="border: 1px solid #ccc; padding: 8px 14px; text-align: center;">' + val + '</td>';
    }
    html += '</tr>';

    html += '<tr>';
    html += '<th style="border: 1px solid #ccc; padding: 8px 14px;">' + ctx.ligne2 + '</th>';
    for (let i = 0; i < row2.length; i++) {
        const val = (missingRow === 1 && missingCol === i) ? '<strong style="color: var(--primary, #667eea);">?</strong>' : propFormatNum(row2[i]);
        html += '<td style="border: 1px solid #ccc; padding: 8px 14px; text-align: center;">' + val + '</td>';
    }
    html += '</tr>';

    html += '</table>';
    return html;
}

/**
 * Met a jour l'affichage
 */
function updateExerciseDisplay() {
    const st = ProportionnaliteState;
    let display = '';

    switch (st.currentType) {
        case 'tableau':
            display = '<div style="margin-bottom: 8px;"><strong>Completez la valeur manquante :</strong></div>';
            display += buildTableHTML(st.valeurs1, st.valeurs2, st.contexte, st.missingRow, st.missingCol);
            break;

        case 'coefficient':
            display = '<div style="margin-bottom: 8px;"><strong>Trouvez le coefficient de proportionnalite :</strong></div>';
            display += buildTableHTML(st.valeurs1, st.valeurs2, st.contexte, -1, -1);
            break;

        case 'produit-croix':
            display = '<div style="margin-bottom: 8px;"><strong>Trouvez la quatrieme proportionnelle :</strong></div>';
            display += '<div style="font-size: 1.2em; margin-top: 10px;">';
            display += 'Si ' + propFormatNum(st.crossA) + ' ' + st.contexte.unite1 + ' correspondent a ' + propFormatNum(st.crossB) + ' ' + st.contexte.unite2 + ',<br>';
            display += 'a combien de ' + st.contexte.unite2 + ' correspondent ' + propFormatNum(st.crossC) + ' ' + st.contexte.unite1 + ' ?';
            display += '</div>';
            break;
    }

    $('exerciseDisplay').innerHTML = display;
}

/**
 * Resout l'exercice
 */
function solveProportionnalite() {
    let html = '<h3>Solution</h3>';

    switch (ProportionnaliteState.currentType) {
        case 'tableau':
            html += solveTableau();
            break;
        case 'coefficient':
            html += solveCoefficient();
            break;
        case 'produit-croix':
            html += solveProduitCroix();
            break;
    }

    $('solutionDiv').innerHTML = html;
    showSolution('solutionDiv');
}

function solveTableau() {
    const st = ProportionnaliteState;
    const missing = st.missingRow === 0 ? st.valeurs1[st.missingCol] : st.valeurs2[st.missingCol];
    let html = '';

    // Trouver une colonne complete pour calculer le coefficient
    let refCol = 0;
    if (refCol === st.missingCol) refCol = 1;

    const refV1 = st.valeurs1[refCol];
    const refV2 = st.valeurs2[refCol];

    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : Trouver le coefficient de proportionnalite</div>';
    html += '<div class="step-expression">k = ' + st.contexte.ligne2 + ' / ' + st.contexte.ligne1 + '</div>';
    html += '<div class="step-explanation">On utilise une colonne complete : k = ' + propFormatNum(refV2) + ' / ' + propFormatNum(refV1) + ' = ' + propFormatNum(st.coefficient) + '</div>';
    html += '</div>';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 2 : Calculer la valeur manquante</div>';

    if (st.missingRow === 1) {
        // Manque sur la ligne 2 : multiplier par k
        html += '<div class="step-expression">' + st.contexte.ligne2 + ' = ' + propFormatNum(st.valeurs1[st.missingCol]) + ' &times; ' + propFormatNum(st.coefficient) + '</div>';
        html += '<div class="step-explanation">' + propFormatNum(st.valeurs1[st.missingCol]) + ' &times; ' + propFormatNum(st.coefficient) + ' = ' + propFormatNum(missing) + '</div>';
    } else {
        // Manque sur la ligne 1 : diviser par k
        html += '<div class="step-expression">' + st.contexte.ligne1 + ' = ' + propFormatNum(st.valeurs2[st.missingCol]) + ' / ' + propFormatNum(st.coefficient) + '</div>';
        html += '<div class="step-explanation">' + propFormatNum(st.valeurs2[st.missingCol]) + ' / ' + propFormatNum(st.coefficient) + ' = ' + propFormatNum(missing) + '</div>';
    }
    html += '</div>';

    html += '<div class="result-highlight">';
    html += '<div class="final">La valeur manquante est <strong>' + propFormatNum(missing) + '</strong></div>';
    html += '</div>';

    return html;
}

function solveCoefficient() {
    const st = ProportionnaliteState;
    let html = '';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : Calculer le rapport pour chaque colonne</div>';
    let rapports = '';
    for (let i = 0; i < st.valeurs1.length; i++) {
        rapports += propFormatNum(st.valeurs2[i]) + ' / ' + propFormatNum(st.valeurs1[i]) + ' = ' + propFormatNum(st.coefficient);
        if (i < st.valeurs1.length - 1) rapports += '&nbsp;&nbsp;;&nbsp;&nbsp;';
    }
    html += '<div class="step-expression">' + rapports + '</div>';
    html += '<div class="step-explanation">Tous les rapports sont egaux : c\'est bien un tableau de proportionnalite.</div>';
    html += '</div>';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 2 : Conclure</div>';
    html += '<div class="step-expression">k = ' + propFormatNum(st.coefficient) + '</div>';
    html += '<div class="step-explanation">Le coefficient de proportionnalite est ' + propFormatNum(st.coefficient) + '. Pour passer de la 1re ligne a la 2e, on multiplie par ' + propFormatNum(st.coefficient) + '.</div>';
    html += '</div>';

    html += '<div class="result-highlight">';
    html += '<div class="final">Coefficient de proportionnalite : <strong>k = ' + propFormatNum(st.coefficient) + '</strong></div>';
    html += '</div>';

    return html;
}

function solveProduitCroix() {
    const st = ProportionnaliteState;
    let html = '';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : Poser le produit en croix</div>';
    html += '<div class="step-expression">';
    html += propFormatNum(st.crossA) + ' &rarr; ' + propFormatNum(st.crossB) + '<br>';
    html += propFormatNum(st.crossC) + ' &rarr; ?';
    html += '</div>';
    html += '<div class="step-explanation">On cherche la quatrieme proportionnelle.</div>';
    html += '</div>';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 2 : Appliquer la formule</div>';
    const numerateur = st.crossC * st.crossB;
    html += '<div class="step-expression">? = (' + propFormatNum(st.crossC) + ' &times; ' + propFormatNum(st.crossB) + ') / ' + propFormatNum(st.crossA) + '</div>';
    html += '<div class="step-explanation">? = ' + propFormatNum(numerateur) + ' / ' + propFormatNum(st.crossA) + ' = ' + propFormatNum(st.crossMissing) + '</div>';
    html += '</div>';

    html += '<div class="result-highlight">';
    html += '<div class="final">' + propFormatNum(st.crossC) + ' ' + st.contexte.unite1 + ' correspondent a <strong>' + propFormatNum(st.crossMissing) + ' ' + st.contexte.unite2 + '</strong></div>';
    html += '</div>';

    return html;
}

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', () => {
    initProportionnalitePage();
});
