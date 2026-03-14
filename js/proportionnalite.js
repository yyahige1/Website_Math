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
 * Rendu KaTeX inline
 */
function K(tex) {
    return katex.renderToString(tex, { throwOnError: false });
}

/**
 * Fraction KaTeX
 */
function propFrac(num, den) {
    return K('\\dfrac{' + num + '}{' + den + '}');
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
    html += '<div class="step-expression">' + K('k = ') + propFrac(st.contexte.ligne2, st.contexte.ligne1) + '</div>';
    html += '<div class="step-explanation">On utilise une colonne complete : ' + K('k = ') + propFrac(propFormatNum(refV2), propFormatNum(refV1)) + K(' = ' + propFormatNum(st.coefficient)) + '</div>';
    html += '</div>';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 2 : Calculer la valeur manquante</div>';

    if (st.missingRow === 1) {
        const v1 = propFormatNum(st.valeurs1[st.missingCol]);
        const k = propFormatNum(st.coefficient);
        html += '<div class="step-expression">' + K('? = ' + v1 + ' \\times ' + k) + '</div>';
        html += '<div class="step-explanation">' + K(v1 + ' \\times ' + k + ' = ' + propFormatNum(missing)) + '</div>';
    } else {
        const v2 = propFormatNum(st.valeurs2[st.missingCol]);
        const k = propFormatNum(st.coefficient);
        html += '<div class="step-expression">' + K('? = ') + propFrac(v2, k) + '</div>';
        html += '<div class="step-explanation">' + propFrac(v2, k) + K(' = ' + propFormatNum(missing)) + '</div>';
    }
    html += '</div>';

    html += '<div class="result-highlight">';
    html += '<div class="final">La valeur manquante est ' + K('\\boxed{' + propFormatNum(missing) + '}') + '</div>';
    html += '</div>';

    return html;
}

function solveCoefficient() {
    const st = ProportionnaliteState;
    let html = '';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : Calculer le rapport pour chaque colonne</div>';
    html += '<div class="step-expression" style="display: flex; align-items: center; justify-content: center; gap: 20px; flex-wrap: wrap;">';
    for (let i = 0; i < st.valeurs1.length; i++) {
        html += '<span>' + propFrac(propFormatNum(st.valeurs2[i]), propFormatNum(st.valeurs1[i])) + K(' = ' + propFormatNum(st.coefficient)) + '</span>';
    }
    html += '</div>';
    html += '<div class="step-explanation">Tous les rapports sont egaux : c\'est bien un tableau de proportionnalite.</div>';
    html += '</div>';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 2 : Conclure</div>';
    html += '<div class="step-expression">' + K('k = ' + propFormatNum(st.coefficient)) + '</div>';
    html += '<div class="step-explanation">Pour passer de la 1re ligne a la 2e, on multiplie par ' + K(propFormatNum(st.coefficient)) + '.</div>';
    html += '</div>';

    html += '<div class="result-highlight">';
    html += '<div class="final">Coefficient de proportionnalite : ' + K('\\boxed{k = ' + propFormatNum(st.coefficient) + '}') + '</div>';
    html += '</div>';

    return html;
}

function solveProduitCroix() {
    const st = ProportionnaliteState;
    const A = propFormatNum(st.crossA);
    const B = propFormatNum(st.crossB);
    const C = propFormatNum(st.crossC);
    const D = propFormatNum(st.crossMissing);
    const numerateur = st.crossC * st.crossB;
    let html = '';

    // Etape 1 : Schema visuel du produit en croix
    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : Poser le produit en croix</div>';
    html += '<div class="step-expression">';
    // Tableau visuel avec fleches croisees
    html += '<table style="border-collapse: collapse; margin: 10px auto; font-size: 1.2em;">';
    html += '<tr>';
    html += '<td style="border: 2px solid var(--primary, #667eea); padding: 12px 24px; text-align: center; font-weight: bold;">' + A + '</td>';
    html += '<td style="border: 2px solid var(--primary, #667eea); padding: 12px 24px; text-align: center; font-weight: bold;">' + B + '</td>';
    html += '</tr>';
    html += '<tr>';
    html += '<td style="border: 2px solid var(--primary, #667eea); padding: 12px 24px; text-align: center; font-weight: bold;">' + C + '</td>';
    html += '<td style="border: 2px solid var(--primary, #667eea); padding: 12px 24px; text-align: center; color: var(--primary, #667eea); font-weight: bold;">?</td>';
    html += '</tr>';
    html += '</table>';
    // Fleches : diagonale
    html += '<div style="text-align: center; margin: 8px 0; color: #888; font-size: 0.95em;">';
    html += 'On multiplie en diagonale (' + K(C + ' \\times ' + B) + ') et on divise par ' + K(A);
    html += '</div>';
    html += '</div>';
    html += '</div>';

    // Etape 2 : Formule avec fraction KaTeX
    html += '<div class="step">';
    html += '<div class="step-number">Etape 2 : Appliquer la formule</div>';
    html += '<div class="step-expression">' + K('? = ') + propFrac(C + ' \\times ' + B, A) + '</div>';
    html += '</div>';

    // Etape 3 : Calcul
    html += '<div class="step">';
    html += '<div class="step-number">Etape 3 : Calculer</div>';
    html += '<div class="step-expression">' + K('? = ') + propFrac(propFormatNum(numerateur), A) + K(' = ' + D) + '</div>';
    html += '</div>';

    html += '<div class="result-highlight">';
    html += '<div class="final">' + C + ' ' + st.contexte.unite1 + ' correspondent a ' + K('\\boxed{' + D + ' \\text{ ' + st.contexte.unite2 + '}}') + '</div>';
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
    const echelleStr = st.echelle.toLocaleString('fr-FR');
    let html = '';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : Comprendre l\'echelle</div>';
    html += '<div class="step-expression">' + K('\\text{Echelle } 1 : ' + st.echelle) + '</div>';
    html += '<div class="step-explanation">1 cm sur la carte = ' + K(echelleStr + ' \\text{ cm}') + ' en realite = ' + K(propFormatNum(st.echelle / 100) + ' \\text{ m}') + '</div>';
    html += '</div>';

    if (st.echelleInconnu === 'reelle') {
        const reelleCm = st.distanceCarte * st.echelle;
        const reelleM = reelleCm / 100;

        html += '<div class="step">';
        html += '<div class="step-number">Etape 2 : Calculer la distance reelle</div>';
        html += '<div class="step-expression">' + K('d = ' + st.distanceCarte + ' \\times ' + st.echelle + ' = ' + reelleCm + ' \\text{ cm}') + '</div>';
        html += '</div>';

        html += '<div class="step">';
        html += '<div class="step-number">Etape 3 : Convertir</div>';
        html += '<div class="step-expression">' + K(reelleCm.toLocaleString('fr-FR') + ' \\text{ cm} = ' + propFormatNum(reelleM) + ' \\text{ m}');
        if (reelleM >= 1000) {
            html += K(' = ' + propFormatNum(reelleM / 1000) + ' \\text{ km}');
        }
        html += '</div>';
        html += '</div>';

        html += '<div class="result-highlight">';
        let resultTex = '\\boxed{' + propFormatNum(reelleM) + ' \\text{ m}';
        if (reelleM >= 1000) resultTex += ' = ' + propFormatNum(reelleM / 1000) + ' \\text{ km}';
        resultTex += '}';
        html += '<div class="final">Distance reelle : ' + K(resultTex) + '</div>';
        html += '</div>';
    } else {
        const reelleCm = st.distanceReelle * 100;

        html += '<div class="step">';
        html += '<div class="step-number">Etape 2 : Convertir en cm</div>';
        html += '<div class="step-expression">' + K(propFormatNum(st.distanceReelle) + ' \\text{ m} = ' + reelleCm.toLocaleString('fr-FR') + ' \\text{ cm}') + '</div>';
        html += '</div>';

        html += '<div class="step">';
        html += '<div class="step-number">Etape 3 : Calculer la distance sur la carte</div>';
        html += '<div class="step-expression">' + K('d_{carte} = ') + propFrac(reelleCm.toLocaleString('fr-FR'), echelleStr) + K(' = ' + propFormatNum(st.distanceCarte) + ' \\text{ cm}') + '</div>';
        html += '</div>';

        html += '<div class="result-highlight">';
        html += '<div class="final">Distance sur la carte : ' + K('\\boxed{' + propFormatNum(st.distanceCarte) + ' \\text{ cm}}') + '</div>';
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

    // Etape 1 : Les 3 formules en KaTeX
    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : Rappeler les formules</div>';
    html += '<div class="step-expression" style="display: flex; justify-content: center; gap: 30px; flex-wrap: wrap; align-items: center;">';
    html += '<span>' + K('d = v \\times t') + '</span>';
    html += '<span>' + K('v = \\dfrac{d}{t}') + '</span>';
    html += '<span>' + K('t = \\dfrac{d}{v}') + '</span>';
    html += '</div>';
    html += '</div>';

    const d = propFormatNum(st.distance);
    const v = propFormatNum(st.vitesse);
    const t = propFormatNum(st.temps);

    if (st.vitesseInconnu === 'distance') {
        html += '<div class="step">';
        html += '<div class="step-number">Etape 2 : Calculer la distance</div>';
        html += '<div class="step-expression">' + K('d = ' + v + ' \\times ' + t + ' = ' + d) + '</div>';
        html += '</div>';

        html += '<div class="result-highlight">';
        html += '<div class="final">Distance : ' + K('\\boxed{' + d + ' \\text{ ' + vctx.uniteD + '}}') + '</div>';
        html += '</div>';

    } else if (st.vitesseInconnu === 'vitesse') {
        html += '<div class="step">';
        html += '<div class="step-number">Etape 2 : Calculer la vitesse</div>';
        html += '<div class="step-expression">' + K('v = ') + propFrac(d, t) + K(' = ' + v) + '</div>';
        html += '</div>';

        html += '<div class="result-highlight">';
        html += '<div class="final">Vitesse : ' + K('\\boxed{' + v + ' \\text{ ' + vctx.uniteV + '}}') + '</div>';
        html += '</div>';

    } else {
        html += '<div class="step">';
        html += '<div class="step-number">Etape 2 : Calculer le temps</div>';
        html += '<div class="step-expression">' + K('t = ') + propFrac(d, v) + K(' = ' + t) + '</div>';
        html += '</div>';

        html += '<div class="result-highlight">';
        html += '<div class="final">Temps : ' + K('\\boxed{' + t + ' \\text{ ' + vctx.uniteT + '}}') + '</div>';
        html += '</div>';
    }

    return html;
}

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', () => {
    initProportionnalitePage();
});
