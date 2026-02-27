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
    crossMissing: 0,
    // Echelle
    echelle: 0,
    distanceCarte: 0,
    distanceReelle: 0,
    echelleInconnu: 'reelle',
    echelleContexte: null,
    // Vitesse
    vitesse: 0,
    distance: 0,
    temps: 0,
    vitesseInconnu: 'distance',
    vitesseContexte: null,
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
        case 'echelle':
            generateEchelle();
            break;
        case 'vitesse':
            generateVitesse();
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

        case 'echelle': {
            const ctx = st.echelleContexte;
            display = '<div style="margin-bottom: 8px;"><strong>' + ctx.intro + '</strong></div>';
            display += '<div style="font-size: 1.1em; margin-top: 10px;">';
            display += 'Echelle : 1 : ' + st.echelle.toLocaleString('fr-FR') + '<br>';
            if (st.echelleInconnu === 'reelle') {
                display += 'Distance sur la carte : ' + propFormatNum(st.distanceCarte) + ' cm<br>';
                display += '<strong>Calculer la distance reelle.</strong>';
            } else {
                display += 'Distance reelle : ' + propFormatNum(st.distanceReelle) + ' m<br>';
                display += '<strong>Calculer la distance sur la carte.</strong>';
            }
            display += '</div>';
            break;
        }

        case 'vitesse': {
            const vctx = st.vitesseContexte;
            display = '<div style="margin-bottom: 8px;"><strong>' + vctx.intro + '</strong></div>';
            display += '<div style="font-size: 1.1em; margin-top: 10px;">';
            if (st.vitesseInconnu === 'distance') {
                display += 'Vitesse : ' + propFormatNum(st.vitesse) + ' ' + vctx.uniteV + '<br>';
                display += 'Temps : ' + propFormatNum(st.temps) + ' ' + vctx.uniteT + '<br>';
                display += '<strong>Calculer la distance parcourue.</strong>';
            } else if (st.vitesseInconnu === 'vitesse') {
                display += 'Distance : ' + propFormatNum(st.distance) + ' ' + vctx.uniteD + '<br>';
                display += 'Temps : ' + propFormatNum(st.temps) + ' ' + vctx.uniteT + '<br>';
                display += '<strong>Calculer la vitesse.</strong>';
            } else {
                display += 'Distance : ' + propFormatNum(st.distance) + ' ' + vctx.uniteD + '<br>';
                display += 'Vitesse : ' + propFormatNum(st.vitesse) + ' ' + vctx.uniteV + '<br>';
                display += '<strong>Calculer le temps de parcours.</strong>';
            }
            display += '</div>';
            break;
        }
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
        case 'echelle':
            html += solveEchelle();
            break;
        case 'vitesse':
            html += solveVitesse();
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

/**
 * Contextes pour echelle
 */
const ECHELLE_CONTEXTES = [
    { intro: 'Sur une carte routiere, deux villes sont separees par une certaine distance.' },
    { intro: 'Sur le plan d\'un appartement, on mesure une piece.' },
    { intro: 'Sur une carte de randonnee, on mesure un sentier.' },
    { intro: 'Sur le plan d\'une ville, on mesure la distance entre deux batiments.' },
];

function generateEchelle() {
    const st = ProportionnaliteState;
    st.echelleContexte = propPick(ECHELLE_CONTEXTES);

    // Echelles courantes
    const echelles = [500, 1000, 2000, 5000, 10000, 25000, 50000, 100000];
    st.echelle = propPick(echelles);

    st.echelleInconnu = Math.random() < 0.5 ? 'reelle' : 'carte';

    // Distance carte en cm (entier simple)
    st.distanceCarte = propRandInt(2, 15);
    // Distance reelle en metres : carte_cm * echelle / 100
    st.distanceReelle = st.distanceCarte * st.echelle / 100;
}

function solveEchelle() {
    const st = ProportionnaliteState;
    let html = '';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : Comprendre l\'echelle</div>';
    html += '<div class="step-expression">Echelle 1 : ' + st.echelle.toLocaleString('fr-FR') + '</div>';
    html += '<div class="step-explanation">Cela signifie que 1 cm sur la carte correspond a ' + st.echelle.toLocaleString('fr-FR') + ' cm en realite, soit ' + propFormatNum(st.echelle / 100) + ' m.</div>';
    html += '</div>';

    if (st.echelleInconnu === 'reelle') {
        html += '<div class="step">';
        html += '<div class="step-number">Etape 2 : Calculer la distance reelle</div>';
        html += '<div class="step-expression">Distance reelle = ' + st.distanceCarte + ' cm &times; ' + st.echelle.toLocaleString('fr-FR') + '</div>';
        const reelleCm = st.distanceCarte * st.echelle;
        html += '<div class="step-explanation">' + st.distanceCarte + ' &times; ' + st.echelle.toLocaleString('fr-FR') + ' = ' + reelleCm.toLocaleString('fr-FR') + ' cm</div>';
        html += '</div>';

        html += '<div class="step">';
        html += '<div class="step-number">Etape 3 : Convertir</div>';
        const reelleM = reelleCm / 100;
        html += '<div class="step-expression">' + reelleCm.toLocaleString('fr-FR') + ' cm = ' + propFormatNum(reelleM) + ' m</div>';
        if (reelleM >= 1000) {
            html += '<div class="step-explanation">Soit ' + propFormatNum(reelleM / 1000) + ' km.</div>';
        }
        html += '</div>';

        html += '<div class="result-highlight">';
        html += '<div class="final">Distance reelle : <strong>' + propFormatNum(reelleM) + ' m';
        if (reelleM >= 1000) html += ' (' + propFormatNum(reelleM / 1000) + ' km)';
        html += '</strong></div>';
        html += '</div>';
    } else {
        html += '<div class="step">';
        html += '<div class="step-number">Etape 2 : Convertir en cm</div>';
        const reelleCm = st.distanceReelle * 100;
        html += '<div class="step-expression">' + propFormatNum(st.distanceReelle) + ' m = ' + reelleCm.toLocaleString('fr-FR') + ' cm</div>';
        html += '</div>';

        html += '<div class="step">';
        html += '<div class="step-number">Etape 3 : Calculer la distance sur la carte</div>';
        html += '<div class="step-expression">Distance carte = ' + reelleCm.toLocaleString('fr-FR') + ' &divide; ' + st.echelle.toLocaleString('fr-FR') + '</div>';
        html += '<div class="step-explanation">' + reelleCm.toLocaleString('fr-FR') + ' &divide; ' + st.echelle.toLocaleString('fr-FR') + ' = ' + propFormatNum(st.distanceCarte) + ' cm</div>';
        html += '</div>';

        html += '<div class="result-highlight">';
        html += '<div class="final">Distance sur la carte : <strong>' + propFormatNum(st.distanceCarte) + ' cm</strong></div>';
        html += '</div>';
    }

    return html;
}

/**
 * Contextes pour vitesse
 */
const VITESSE_CONTEXTES = [
    { intro: 'Un cycliste roule a vitesse constante.', uniteV: 'km/h', uniteD: 'km', uniteT: 'h', vitesses: [12, 15, 18, 20, 25] },
    { intro: 'Une voiture circule sur l\'autoroute.', uniteV: 'km/h', uniteD: 'km', uniteT: 'h', vitesses: [80, 90, 100, 110, 120, 130] },
    { intro: 'Un pieton marche a vitesse reguliere.', uniteV: 'km/h', uniteD: 'km', uniteT: 'h', vitesses: [4, 5, 6] },
    { intro: 'Un train circule entre deux gares.', uniteV: 'km/h', uniteD: 'km', uniteT: 'h', vitesses: [80, 100, 120, 160, 200, 300] },
    { intro: 'Un nageur s\'entraine dans un bassin.', uniteV: 'm/min', uniteD: 'm', uniteT: 'min', vitesses: [40, 50, 60, 80, 100] },
];

function generateVitesse() {
    const st = ProportionnaliteState;
    const ctx = propPick(VITESSE_CONTEXTES);
    st.vitesseContexte = ctx;
    st.vitesse = propPick(ctx.vitesses);

    // Temps : entier simple (1 a 6 heures ou minutes selon contexte)
    st.temps = propRandInt(1, 6);
    // Parfois des demi-heures
    if (Math.random() < 0.3) st.temps = propPick([0.5, 1.5, 2.5]);

    st.distance = st.vitesse * st.temps;

    const inconnus = ['distance', 'vitesse', 'temps'];
    st.vitesseInconnu = propPick(inconnus);
}

function solveVitesse() {
    const st = ProportionnaliteState;
    const vctx = st.vitesseContexte;
    let html = '';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : Rappeler la formule</div>';
    html += '<div class="step-expression">distance = vitesse &times; temps</div>';
    html += '<div class="step-explanation">d = v &times; t &nbsp;&nbsp;|&nbsp;&nbsp; v = d / t &nbsp;&nbsp;|&nbsp;&nbsp; t = d / v</div>';
    html += '</div>';

    if (st.vitesseInconnu === 'distance') {
        html += '<div class="step">';
        html += '<div class="step-number">Etape 2 : Calculer la distance</div>';
        html += '<div class="step-expression">d = ' + propFormatNum(st.vitesse) + ' &times; ' + propFormatNum(st.temps) + '</div>';
        html += '<div class="step-explanation">d = ' + propFormatNum(st.distance) + ' ' + vctx.uniteD + '</div>';
        html += '</div>';

        html += '<div class="result-highlight">';
        html += '<div class="final">Distance : <strong>' + propFormatNum(st.distance) + ' ' + vctx.uniteD + '</strong></div>';
        html += '</div>';

    } else if (st.vitesseInconnu === 'vitesse') {
        html += '<div class="step">';
        html += '<div class="step-number">Etape 2 : Calculer la vitesse</div>';
        html += '<div class="step-expression">v = ' + propFormatNum(st.distance) + ' &divide; ' + propFormatNum(st.temps) + '</div>';
        html += '<div class="step-explanation">v = ' + propFormatNum(st.vitesse) + ' ' + vctx.uniteV + '</div>';
        html += '</div>';

        html += '<div class="result-highlight">';
        html += '<div class="final">Vitesse : <strong>' + propFormatNum(st.vitesse) + ' ' + vctx.uniteV + '</strong></div>';
        html += '</div>';

    } else {
        html += '<div class="step">';
        html += '<div class="step-number">Etape 2 : Calculer le temps</div>';
        html += '<div class="step-expression">t = ' + propFormatNum(st.distance) + ' &divide; ' + propFormatNum(st.vitesse) + '</div>';
        html += '<div class="step-explanation">t = ' + propFormatNum(st.temps) + ' ' + vctx.uniteT + '</div>';
        html += '</div>';

        html += '<div class="result-highlight">';
        html += '<div class="final">Temps : <strong>' + propFormatNum(st.temps) + ' ' + vctx.uniteT + '</strong></div>';
        html += '</div>';
    }

    return html;
}

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', () => {
    initProportionnalitePage();
});
