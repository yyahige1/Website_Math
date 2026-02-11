/* ========================================
   PROBABILITES.JS - Probabilites (Lycee)
   ======================================== */

/**
 * Etat du module Probabilites
 */
const ProbaState = {
    currentType: 'simple',

    // Sous-types
    subtype_simple: 'de',
    subtype_conditionnelle: 'tableau',
    subtype_arbre: 'deux_epreuves',
    subtype_binomiale: 'proba_exacte',
    subtype_variable: 'loi',
    subtype_fluctuation: 'intervalle',

    // Donnees exercice courant
    exercise: {}
};

// ========================================
// Initialisation
// ========================================

function initProbabilitesPage() {
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
            ProbaState.currentType = button.dataset.type;

            document.querySelectorAll('[id$="Section"]').forEach(section => {
                section.style.display = 'none';
            });

            const sectionMap = {
                'simple': 'simpleSection',
                'conditionnelle': 'conditionnelleSection',
                'arbre': 'arbreSection',
                'binomiale': 'binomialeSection',
                'variable': 'variableSection',
                'fluctuation': 'fluctuationSection'
            };
            const sectionId = sectionMap[ProbaState.currentType];
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
        'subtype_simple', 'subtype_conditionnelle', 'subtype_arbre',
        'subtype_binomiale', 'subtype_variable', 'subtype_fluctuation'
    ];
    selects.forEach(id => {
        const el = $(id);
        if (el) {
            el.addEventListener('change', () => {
                ProbaState[id] = el.value;
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
        solveProbabilites();
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

function kx(tex) {
    return katex.renderToString(tex, { throwOnError: false });
}

function fracReduite(num, den) {
    if (den === 0) return { num: num, den: 1 };
    const s = den < 0 ? -1 : 1;
    num *= s;
    den *= s;
    const g = pgcd(Math.abs(num), Math.abs(den));
    return { num: num / g, den: den / g };
}

function fracTeX(num, den) {
    const f = fracReduite(num, den);
    if (f.den === 1) return `${f.num}`;
    return `\\frac{${f.num}}{${f.den}}`;
}

function factorial(n) {
    if (n <= 1) return 1;
    let r = 1;
    for (let i = 2; i <= n; i++) r *= i;
    return r;
}

function binomCoeff(n, k) {
    if (k < 0 || k > n) return 0;
    if (k === 0 || k === n) return 1;
    let r = 1;
    for (let i = 0; i < k; i++) {
        r = r * (n - i) / (i + 1);
    }
    return Math.round(r);
}

function binomProba(n, k, p) {
    return binomCoeff(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
}

function roundDec(x, d) {
    const f = Math.pow(10, d);
    return Math.round(x * f) / f;
}

// ========================================
// Generation des exercices
// ========================================

function generateNewExercise() {
    const type = ProbaState.currentType;
    switch (type) {
        case 'simple': generateSimple(); break;
        case 'conditionnelle': generateConditionnelle(); break;
        case 'arbre': generateArbre(); break;
        case 'binomiale': generateBinomiale(); break;
        case 'variable': generateVariable(); break;
        case 'fluctuation': generateFluctuation(); break;
    }
}

// --- Probabilites simples ---
function generateSimple() {
    const sub = ProbaState.subtype_simple;
    const ex = {};

    if (sub === 'de') {
        const nbDes = rint(1, 2);
        ex.nbDes = nbDes;
        if (nbDes === 1) {
            const faces = 6;
            ex.faces = faces;
            const types = ['pair', 'impair', 'superieur', 'multiple'];
            const choix = types[rint(0, types.length - 1)];
            ex.question = choix;
            if (choix === 'pair') {
                ex.favorables = [2, 4, 6];
                ex.texte = 'Obtenir un nombre pair';
            } else if (choix === 'impair') {
                ex.favorables = [1, 3, 5];
                ex.texte = 'Obtenir un nombre impair';
            } else if (choix === 'superieur') {
                const seuil = rint(2, 5);
                ex.seuil = seuil;
                ex.favorables = [];
                for (let i = seuil; i <= 6; i++) ex.favorables.push(i);
                ex.texte = `Obtenir un nombre superieur ou egal a ${seuil}`;
            } else {
                const m = rint(2, 3);
                ex.multiple = m;
                ex.favorables = [];
                for (let i = 1; i <= 6; i++) {
                    if (i % m === 0) ex.favorables.push(i);
                }
                ex.texte = `Obtenir un multiple de ${m}`;
            }
            ex.total = faces;
        } else {
            ex.faces = 6;
            const somme = rint(4, 9);
            ex.somme = somme;
            ex.texte = `Obtenir une somme egale a ${somme} avec deux des`;
            // Compter les cas favorables
            let fav = 0;
            const details = [];
            for (let i = 1; i <= 6; i++) {
                for (let j = 1; j <= 6; j++) {
                    if (i + j === somme) {
                        fav++;
                        details.push(`(${i},${j})`);
                    }
                }
            }
            ex.favorables = details;
            ex.nbFavorables = fav;
            ex.total = 36;
        }
    } else if (sub === 'cartes') {
        const questions = [
            { texte: 'Tirer un as', favorables: 4, total: 52, detail: '4 as dans un jeu de 52 cartes' },
            { texte: 'Tirer un coeur', favorables: 13, total: 52, detail: '13 coeurs dans un jeu de 52 cartes' },
            { texte: 'Tirer une figure (valet, dame, roi)', favorables: 12, total: 52, detail: '3 figures x 4 couleurs = 12' },
            { texte: 'Tirer un roi ou un coeur', favorables: 16, total: 52, detail: '4 rois + 13 coeurs - 1 roi de coeur = 16' },
            { texte: 'Tirer une carte rouge', favorables: 26, total: 52, detail: '26 cartes rouges (coeurs + carreaux)' },
            { texte: 'Tirer un as ou une figure', favorables: 16, total: 52, detail: '4 as + 12 figures = 16' }
        ];
        const q = questions[rint(0, questions.length - 1)];
        ex.texte = q.texte;
        ex.favorables = q.favorables;
        ex.total = q.total;
        ex.detail = q.detail;
    } else {
        // Urne
        const nRouges = rint(2, 6);
        const nBleues = rint(2, 6);
        const nVertes = rint(1, 4);
        ex.rouges = nRouges;
        ex.bleues = nBleues;
        ex.vertes = nVertes;
        ex.total = nRouges + nBleues + nVertes;
        const questions = [
            { texte: `Tirer une boule rouge`, favorables: nRouges, detail: `${nRouges} boules rouges` },
            { texte: `Tirer une boule bleue`, favorables: nBleues, detail: `${nBleues} boules bleues` },
            { texte: `Tirer une boule qui n'est pas verte`, favorables: nRouges + nBleues, detail: `${nRouges} rouges + ${nBleues} bleues = ${nRouges + nBleues}` },
            { texte: `Tirer une boule rouge ou verte`, favorables: nRouges + nVertes, detail: `${nRouges} rouges + ${nVertes} vertes = ${nRouges + nVertes}` }
        ];
        const q = questions[rint(0, questions.length - 1)];
        ex.texte = q.texte;
        ex.favorables = q.favorables;
        ex.detail = q.detail;
    }

    ProbaState.exercise = ex;
}

// --- Probabilites conditionnelles ---
function generateConditionnelle() {
    const sub = ProbaState.subtype_conditionnelle;
    const ex = {};

    if (sub === 'tableau') {
        // Tableau croise 2x2
        const total = rint(80, 200);
        const pA = (rint(30, 70)) / 100;
        const pBsachantA = (rint(20, 80)) / 100;
        const pBsachantAbar = (rint(10, 60)) / 100;

        const nA = Math.round(total * pA);
        const nAbar = total - nA;
        const nAetB = Math.round(nA * pBsachantA);
        const nAetBbar = nA - nAetB;
        const nAbarEtB = Math.round(nAbar * pBsachantAbar);
        const nAbarEtBbar = nAbar - nAbarEtB;
        const nB = nAetB + nAbarEtB;
        const nBbar = nAetBbar + nAbarEtBbar;

        const contextes = [
            { A: 'Femme', Abar: 'Homme', B: 'Sportif', Bbar: 'Non sportif', lieu: 'Dans une entreprise' },
            { A: 'Eleve de Terminale', Abar: 'Eleve de Premiere', B: 'A la cantine', Bbar: 'Pas a la cantine', lieu: 'Dans un lycee' },
            { A: 'Adulte', Abar: 'Enfant', B: 'Vaccin', Bbar: 'Non vaccine', lieu: 'Dans un centre medical' }
        ];
        const ctx = contextes[rint(0, contextes.length - 1)];

        ex.ctx = ctx;
        ex.nA = nA; ex.nAbar = nAbar;
        ex.nB = nB; ex.nBbar = nBbar;
        ex.nAetB = nAetB; ex.nAetBbar = nAetBbar;
        ex.nAbarEtB = nAbarEtB; ex.nAbarEtBbar = nAbarEtBbar;
        ex.total = total;
        ex.texte = `${ctx.lieu}, on interroge ${total} personnes.`;
        ex.questionTex = `P(\\text{${ctx.B}} | \\text{${ctx.A}})`;
        ex.reponseNum = nAetB;
        ex.reponseDen = nA;
    } else if (sub === 'formule') {
        const pA = rint(2, 8) / 10;
        const pB = rint(2, 8) / 10;
        // P(A inter B) <= min(pA, pB)
        const maxInter = Math.min(pA, pB);
        const pAinterB = rint(1, Math.floor(maxInter * 10)) / 10;

        ex.pA = pA; ex.pB = pB; ex.pAinterB = pAinterB;
        ex.texte = `On donne P(A) = ${pA}, P(B) = ${pB} et P(A \\cap B) = ${pAinterB}.`;
        ex.questionTex = `P(A|B)`;
        // P(A|B) = P(A inter B) / P(B)
        ex.reponseNum = Math.round(pAinterB * 10);
        ex.reponseDen = Math.round(pB * 10);
    } else {
        // Bayes
        const pA = rint(1, 5) / 10;
        const pAbar = roundDec(1 - pA, 1);
        const pBsachantA = rint(5, 9) / 10;
        const pBsachantAbar = rint(1, 4) / 10;

        ex.pA = pA; ex.pAbar = pAbar;
        ex.pBsachantA = pBsachantA;
        ex.pBsachantAbar = pBsachantAbar;

        // P(B) = P(B|A)P(A) + P(B|Abar)P(Abar)
        ex.pB = roundDec(pBsachantA * pA + pBsachantAbar * pAbar, 4);
        // P(A|B) = P(B|A)P(A) / P(B)
        ex.pAsachantB = roundDec((pBsachantA * pA) / ex.pB, 4);

        const contextes = [
            { A: 'malade', B: 'test positif' },
            { A: 'defectueux', B: 'detecte' },
            { A: 'spam', B: 'mot-cle present' }
        ];
        const ctx = contextes[rint(0, contextes.length - 1)];
        ex.ctx = ctx;
        ex.texte = `P(${ctx.A}) = ${pA}, P(${ctx.B}|${ctx.A}) = ${pBsachantA}, P(${ctx.B}|non ${ctx.A}) = ${pBsachantAbar}`;
    }

    ProbaState.exercise = ex;
}

// --- Arbres de probabilites ---
function generateArbre() {
    const sub = ProbaState.subtype_arbre;
    const ex = {};

    if (sub === 'deux_epreuves') {
        // Deux tirages successifs
        const pRouge1 = rint(1, 5);
        const total1 = rint(pRouge1 + 2, 10);
        const pRouge2sachantRouge = rint(1, 4);
        const total2 = total1; // meme urne (avec remise)
        const pRouge2sachantBleu = rint(1, 4);

        ex.pR1_num = pRouge1; ex.pR1_den = total1;
        ex.pB1_num = total1 - pRouge1; ex.pB1_den = total1;
        ex.pR2sachantR_num = pRouge2sachantRouge; ex.pR2sachantR_den = total2;
        ex.pR2sachantB_num = pRouge2sachantBleu; ex.pR2sachantB_den = total2;

        ex.texte = `Une urne contient ${pRouge1} boules rouges et ${total1 - pRouge1} boules bleues (${total1} au total). On tire une boule, on la remet, puis on tire a nouveau.`;
        ex.question = `Quelle est la probabilite d'obtenir deux boules rouges ?`;

        // P(R1 et R2) = P(R1) * P(R2|R1) = pRouge1/total1 * pRouge2sachantRouge/total2
        ex.pDeuxRouges_num = pRouge1 * pRouge2sachantRouge;
        ex.pDeuxRouges_den = total1 * total2;
    } else {
        // Probabilites totales
        const pA = rint(2, 7);
        const denA = 10;
        const pBsachantA = rint(3, 8);
        const denB = 10;
        const pBsachantAbar = rint(1, 5);

        ex.pA_num = pA; ex.pA_den = denA;
        ex.pAbar_num = denA - pA; ex.pAbar_den = denA;
        ex.pBsachantA_num = pBsachantA; ex.pBsachantA_den = denB;
        ex.pBsachantAbar_num = pBsachantAbar; ex.pBsachantAbar_den = denB;

        // P(B) = P(B|A)*P(A) + P(B|Abar)*P(Abar)
        ex.pB_num = pA * pBsachantA + (denA - pA) * pBsachantAbar;
        ex.pB_den = denA * denB;

        const contextes = [
            { A: 'Machine A', Abar: 'Machine B', B: 'piece defectueuse' },
            { A: 'Fournisseur 1', Abar: 'Fournisseur 2', B: 'produit conforme' }
        ];
        const ctx = contextes[rint(0, contextes.length - 1)];
        ex.ctx = ctx;
        ex.texte = `${ctx.A} produit ${pA * 10}% de la production. ${ctx.Abar} produit le reste.`;
    }

    ProbaState.exercise = ex;
}

// --- Loi binomiale ---
function generateBinomiale() {
    const sub = ProbaState.subtype_binomiale;
    const ex = {};

    const n = rint(3, 8);
    const pNum = rint(1, 5);
    const pDen = 10;
    const p = pNum / pDen;
    const q = 1 - p;

    ex.n = n; ex.p = p; ex.q = q;
    ex.pNum = pNum; ex.pDen = pDen;

    if (sub === 'proba_exacte') {
        const k = rint(1, n - 1);
        ex.k = k;
        ex.coeff = binomCoeff(n, k);
        ex.resultat = binomProba(n, k, p);
        ex.texte = `X suit une loi binomiale B(${n} ; ${fracTeX(pNum, pDen)}).`;
        ex.question = `Calculer P(X = ${k}).`;
    } else if (sub === 'esperance') {
        ex.esperance = n * p;
        ex.variance = n * p * q;
        ex.ecartType = Math.sqrt(ex.variance);
        ex.texte = `X suit une loi binomiale B(${n} ; ${fracTeX(pNum, pDen)}).`;
        ex.question = `Calculer E(X), V(X) et l'ecart-type de X.`;
    } else {
        // proba_cumul
        const k = rint(1, n - 2);
        const sens = rint(0, 1) === 0 ? 'inf' : 'sup';
        ex.k = k; ex.sens = sens;
        let cumul = 0;
        if (sens === 'inf') {
            for (let i = 0; i <= k; i++) cumul += binomProba(n, i, p);
            ex.question = `Calculer P(X \\leq ${k}).`;
        } else {
            for (let i = k; i <= n; i++) cumul += binomProba(n, i, p);
            ex.question = `Calculer P(X \\geq ${k}).`;
        }
        ex.cumul = cumul;
        ex.texte = `X suit une loi binomiale B(${n} ; ${fracTeX(pNum, pDen)}).`;
    }

    const contextes = [
        `On lance ${n} fois une piece truquee (probabilite de succes ${fracTeX(pNum, pDen)}).`,
        `Un QCM comporte ${n} questions avec ${pDen} choix chacune, dont 1 bonne reponse.`,
        `Un controle qualite teste ${n} pieces. Chaque piece a une probabilite ${fracTeX(pNum, pDen)} d'etre defectueuse.`
    ];
    ex.contexte = contextes[rint(0, contextes.length - 1)];

    ProbaState.exercise = ex;
}

// --- Variables aleatoires ---
function generateVariable() {
    const sub = ProbaState.subtype_variable;
    const ex = {};

    // Generer une loi de probabilite avec 3 a 5 valeurs
    const nbValeurs = rint(3, 5);
    const valeurs = [];
    const probas = [];

    // Generer des valeurs distinctes
    const startVal = rint(-2, 0);
    for (let i = 0; i < nbValeurs; i++) {
        valeurs.push(startVal + i);
    }

    // Generer des probabilites (numerateurs sur un denominateur commun)
    const den = rint(6, 12);
    let resteNum = den;
    for (let i = 0; i < nbValeurs - 1; i++) {
        const maxNum = resteNum - (nbValeurs - 1 - i);
        const num = rint(1, Math.max(1, maxNum));
        probas.push(num);
        resteNum -= num;
    }
    probas.push(resteNum);

    ex.valeurs = valeurs;
    ex.probas = probas;
    ex.den = den;
    ex.nbValeurs = nbValeurs;

    // Calculer esperance
    let esp = 0;
    for (let i = 0; i < nbValeurs; i++) {
        esp += valeurs[i] * probas[i] / den;
    }
    ex.esperance = esp;

    // Calculer variance
    let variance = 0;
    for (let i = 0; i < nbValeurs; i++) {
        variance += probas[i] / den * Math.pow(valeurs[i] - esp, 2);
    }
    ex.variance = variance;
    ex.ecartType = Math.sqrt(variance);

    if (sub === 'loi') {
        ex.texte = `On donne la loi de probabilite de X (une probabilite manquante).`;
        // Cacher une proba
        ex.cachee = rint(0, nbValeurs - 1);
        ex.question = `Determiner la probabilite manquante et verifier que la somme vaut 1.`;
    } else {
        ex.texte = `On donne la loi de probabilite de X.`;
        ex.question = `Calculer E(X), V(X) et l'ecart-type de X.`;
    }

    ProbaState.exercise = ex;
}

// --- Fluctuation ---
function generateFluctuation() {
    const sub = ProbaState.subtype_fluctuation;
    const ex = {};

    const n = [25, 30, 40, 50, 100][rint(0, 4)];
    const pPercent = rint(20, 80);
    const p = pPercent / 100;

    ex.n = n; ex.p = p; ex.pPercent = pPercent;

    // Intervalle de fluctuation au seuil 95% : [p - 1/sqrt(n) ; p + 1/sqrt(n)]
    const marge = 1 / Math.sqrt(n);
    ex.borneInf = roundDec(p - marge, 4);
    ex.borneSup = roundDec(p + marge, 4);
    ex.marge = marge;

    if (sub === 'intervalle') {
        ex.texte = `On considere un caractere de proportion p = ${fracTeX(pPercent, 100)} dans la population.`;
        ex.question = `Determiner l'intervalle de fluctuation au seuil de 95% pour un echantillon de taille n = ${n}.`;
    } else {
        // Decision
        const fObs = roundDec(p + (rint(0, 1) === 0 ? 1 : -1) * rint(5, 20) / 100, 4);
        ex.fObs = fObs;
        ex.dansIntervalle = (fObs >= ex.borneInf && fObs <= ex.borneSup);
        ex.texte = `Dans un echantillon de taille n = ${n}, on observe une frequence f = ${roundDec(fObs, 2)}.`;
        ex.question = `La proportion theorique est p = ${fracTeX(pPercent, 100)}. Peut-on accepter cette hypothese au seuil de 95% ?`;
    }

    ProbaState.exercise = ex;
}

// ========================================
// Affichage de l'exercice
// ========================================

function updateExerciseDisplay() {
    const ex = ProbaState.exercise;
    const type = ProbaState.currentType;
    let html = '';

    switch (type) {
        case 'simple': {
            const sub = ProbaState.subtype_simple;
            if (sub === 'de') {
                if (ex.nbDes === 1) {
                    html = `<p>On lance un de equilibre a 6 faces.</p>`;
                    html += `<p><strong>Evenement :</strong> ${ex.texte}</p>`;
                    html += `<p>Calculer la probabilite de cet evenement.</p>`;
                } else {
                    html = `<p>On lance deux des equilibres a 6 faces.</p>`;
                    html += `<p><strong>Evenement :</strong> ${ex.texte}</p>`;
                    html += `<p>Calculer la probabilite de cet evenement.</p>`;
                }
            } else if (sub === 'cartes') {
                html = `<p>On tire une carte au hasard dans un jeu de 52 cartes.</p>`;
                html += `<p><strong>Evenement :</strong> ${ex.texte}</p>`;
                html += `<p>Calculer la probabilite de cet evenement.</p>`;
            } else {
                html = `<p>Une urne contient ${ex.rouges} boules rouges, ${ex.bleues} boules bleues et ${ex.vertes} boules vertes.</p>`;
                html += `<p>On tire une boule au hasard.</p>`;
                html += `<p><strong>Evenement :</strong> ${ex.texte}</p>`;
                html += `<p>Calculer la probabilite de cet evenement.</p>`;
            }
            break;
        }
        case 'conditionnelle': {
            const sub = ProbaState.subtype_conditionnelle;
            if (sub === 'tableau') {
                html = `<p>${ex.texte}</p>`;
                html += `<table style="border-collapse: collapse; margin: 10px auto; text-align: center;">`;
                html += `<tr style="background: var(--gray-100);"><th style="border:1px solid var(--gray-300); padding:8px;"></th><th style="border:1px solid var(--gray-300); padding:8px;">${ex.ctx.B}</th><th style="border:1px solid var(--gray-300); padding:8px;">${ex.ctx.Bbar}</th><th style="border:1px solid var(--gray-300); padding:8px;">Total</th></tr>`;
                html += `<tr><td style="border:1px solid var(--gray-300); padding:8px; font-weight:bold;">${ex.ctx.A}</td><td style="border:1px solid var(--gray-300); padding:8px;">${ex.nAetB}</td><td style="border:1px solid var(--gray-300); padding:8px;">${ex.nAetBbar}</td><td style="border:1px solid var(--gray-300); padding:8px; font-weight:bold;">${ex.nA}</td></tr>`;
                html += `<tr><td style="border:1px solid var(--gray-300); padding:8px; font-weight:bold;">${ex.ctx.Abar}</td><td style="border:1px solid var(--gray-300); padding:8px;">${ex.nAbarEtB}</td><td style="border:1px solid var(--gray-300); padding:8px;">${ex.nAbarEtBbar}</td><td style="border:1px solid var(--gray-300); padding:8px; font-weight:bold;">${ex.nAbar}</td></tr>`;
                html += `<tr style="background: var(--gray-100);"><td style="border:1px solid var(--gray-300); padding:8px; font-weight:bold;">Total</td><td style="border:1px solid var(--gray-300); padding:8px; font-weight:bold;">${ex.nB}</td><td style="border:1px solid var(--gray-300); padding:8px; font-weight:bold;">${ex.nBbar}</td><td style="border:1px solid var(--gray-300); padding:8px; font-weight:bold;">${ex.total}</td></tr>`;
                html += `</table>`;
                html += `<p>Calculer ${kx(ex.questionTex)}</p>`;
            } else if (sub === 'formule') {
                html = `<p>${kx(ex.texte)}</p>`;
                html += `<p>Calculer ${kx(ex.questionTex)}.</p>`;
            } else {
                html = `<p>On donne :</p>`;
                html += `<p>${kx(`P(\\text{${ex.ctx.A}}) = ${ex.pA}`)}</p>`;
                html += `<p>${kx(`P(\\text{${ex.ctx.B}} | \\text{${ex.ctx.A}}) = ${ex.pBsachantA}`)}</p>`;
                html += `<p>${kx(`P(\\text{${ex.ctx.B}} | \\overline{\\text{${ex.ctx.A}}}) = ${ex.pBsachantAbar}`)}</p>`;
                html += `<p>Calculer ${kx(`P(\\text{${ex.ctx.A}} | \\text{${ex.ctx.B}})`)} (formule de Bayes).</p>`;
            }
            break;
        }
        case 'arbre': {
            const sub = ProbaState.subtype_arbre;
            if (sub === 'deux_epreuves') {
                html = `<p>${ex.texte}</p>`;
                html += `<p>${ex.question}</p>`;
            } else {
                html = `<p>${ex.texte}</p>`;
                html += `<p>${kx(`P(\\text{${ex.ctx.A}}) = ${fracTeX(ex.pA_num, ex.pA_den)}`)}</p>`;
                html += `<p>${kx(`P(\\text{${ex.ctx.B}} | \\text{${ex.ctx.A}}) = ${fracTeX(ex.pBsachantA_num, ex.pBsachantA_den)}`)}</p>`;
                html += `<p>${kx(`P(\\text{${ex.ctx.B}} | \\text{${ex.ctx.Abar}}) = ${fracTeX(ex.pBsachantAbar_num, ex.pBsachantAbar_den)}`)}</p>`;
                html += `<p>Calculer ${kx(`P(\\text{${ex.ctx.B}})`)} par la formule des probabilites totales.</p>`;
            }
            break;
        }
        case 'binomiale': {
            html = `<p>${ex.contexte}</p>`;
            html += `<p>${kx(ex.texte)}</p>`;
            html += `<p>${kx(ex.question)}</p>`;
            break;
        }
        case 'variable': {
            html = `<p>${ex.texte}</p>`;
            // Afficher le tableau de loi
            html += `<table style="border-collapse: collapse; margin: 10px auto; text-align: center;">`;
            html += `<tr style="background: var(--gray-100);"><td style="border:1px solid var(--gray-300); padding:8px; font-weight:bold;">${kx('x_i')}</td>`;
            for (let i = 0; i < ex.nbValeurs; i++) {
                html += `<td style="border:1px solid var(--gray-300); padding:8px;">${ex.valeurs[i]}</td>`;
            }
            html += `</tr>`;
            html += `<tr><td style="border:1px solid var(--gray-300); padding:8px; font-weight:bold;">${kx('P(X = x_i)')}</td>`;
            for (let i = 0; i < ex.nbValeurs; i++) {
                if (ProbaState.subtype_variable === 'loi' && i === ex.cachee) {
                    html += `<td style="border:1px solid var(--gray-300); padding:8px; color: var(--primary); font-weight:bold;">?</td>`;
                } else {
                    html += `<td style="border:1px solid var(--gray-300); padding:8px;">${kx(fracTeX(ex.probas[i], ex.den))}</td>`;
                }
            }
            html += `</tr></table>`;
            html += `<p>${ex.question}</p>`;
            break;
        }
        case 'fluctuation': {
            html = `<p>${ex.texte}</p>`;
            html += `<p>${kx(ex.question)}</p>`;
            break;
        }
    }

    $('expressionDisplay').innerHTML = html;
}

// ========================================
// Resolution
// ========================================

function solveProbabilites() {
    let html = '';
    const type = ProbaState.currentType;

    switch (type) {
        case 'simple': html = solveSimple(); break;
        case 'conditionnelle': html = solveConditionnelle(); break;
        case 'arbre': html = solveArbre(); break;
        case 'binomiale': html = solveBinomiale(); break;
        case 'variable': html = solveVariable(); break;
        case 'fluctuation': html = solveFluctuation(); break;
    }

    $('stepsContainer').innerHTML = html;
    showSolution('solutionDiv');
}

// --- Solutions probabilites simples ---
function solveSimple() {
    const ex = ProbaState.exercise;
    const sub = ProbaState.subtype_simple;
    let html = '';

    html += '<div class="step">';
    html += '<div class="step-number">1. Identifier l\'univers</div>';

    if (sub === 'de') {
        if (ex.nbDes === 1) {
            html += `<div class="step-expression">${kx('\\Omega = \\{1, 2, 3, 4, 5, 6\\}')}</div>`;
            html += `<div class="step-explanation">Un de a 6 faces : ${kx('\\text{card}(\\Omega) = 6')}</div>`;
        } else {
            html += `<div class="step-expression">${kx('\\Omega = \\{(i,j) \\mid 1 \\leq i,j \\leq 6\\}')}</div>`;
            html += `<div class="step-explanation">Deux des : ${kx('\\text{card}(\\Omega) = 6 \\times 6 = 36')}</div>`;
        }
    } else if (sub === 'cartes') {
        html += `<div class="step-expression">${kx('\\text{card}(\\Omega) = 52')}</div>`;
        html += `<div class="step-explanation">Jeu de 52 cartes (4 couleurs x 13 valeurs)</div>`;
    } else {
        html += `<div class="step-expression">${kx(`\\text{card}(\\Omega) = ${ex.rouges} + ${ex.bleues} + ${ex.vertes} = ${ex.total}`)}</div>`;
        html += `<div class="step-explanation">Total de boules dans l'urne</div>`;
    }
    html += '</div>';

    html += '<div class="step">';
    html += '<div class="step-number">2. Compter les cas favorables</div>';

    if (sub === 'de' && ex.nbDes === 1) {
        html += `<div class="step-expression">Cas favorables : {${ex.favorables.join(', ')}}</div>`;
        html += `<div class="step-explanation">${ex.texte} : ${ex.favorables.length} cas favorables</div>`;
    } else if (sub === 'de' && ex.nbDes === 2) {
        html += `<div class="step-expression">Cas favorables : ${ex.favorables.join(', ')}</div>`;
        html += `<div class="step-explanation">${ex.nbFavorables} couples donnent une somme de ${ex.somme}</div>`;
    } else if (sub === 'cartes') {
        html += `<div class="step-expression">${ex.detail}</div>`;
        html += `<div class="step-explanation">${ex.favorables} cas favorables</div>`;
    } else {
        html += `<div class="step-expression">${ex.detail}</div>`;
        html += `<div class="step-explanation">${ex.favorables} cas favorables</div>`;
    }
    html += '</div>';

    html += '<div class="step">';
    html += '<div class="step-number">3. Calculer la probabilite</div>';

    let numFav, denFav;
    if (sub === 'de' && ex.nbDes === 1) {
        numFav = ex.favorables.length;
        denFav = ex.total;
    } else if (sub === 'de' && ex.nbDes === 2) {
        numFav = ex.nbFavorables;
        denFav = ex.total;
    } else if (sub === 'cartes') {
        numFav = ex.favorables;
        denFav = ex.total;
    } else {
        numFav = ex.favorables;
        denFav = ex.total;
    }

    const fr = fracReduite(numFav, denFav);
    const valeur = roundDec(numFav / denFav, 4);

    html += `<div class="step-expression">${kx(`P = \\frac{\\text{cas favorables}}{\\text{cas possibles}} = \\frac{${numFav}}{${denFav}}`)}</div>`;

    if (fr.num !== numFav || fr.den !== denFav) {
        html += `<div class="step-explanation">Fraction simplifiee : ${kx(fracTeX(fr.num, fr.den))} ${kx(`\\approx ${valeur}`)}</div>`;
    } else {
        html += `<div class="step-explanation">${kx(`\\approx ${valeur}`)}</div>`;
    }
    html += '</div>';

    html += '<div class="result-highlight">';
    html += `<div class="final">${kx(`P(\\text{evenement}) = ${fracTeX(fr.num, fr.den)}`)}`;
    if (fr.den !== 1) html += ` soit environ ${roundDec(valeur * 100, 1)}%`;
    html += `</div>`;
    html += '</div>';

    return html;
}

// --- Solutions conditionnelles ---
function solveConditionnelle() {
    const ex = ProbaState.exercise;
    const sub = ProbaState.subtype_conditionnelle;
    let html = '';

    if (sub === 'tableau') {
        html += '<div class="step">';
        html += '<div class="step-number">1. Rappeler la formule</div>';
        html += `<div class="step-expression">${kx(`P(B|A) = \\frac{\\text{Nombre dans } A \\cap B}{\\text{Nombre dans } A}`)}</div>`;
        html += `<div class="step-explanation">On cherche ${kx(ex.questionTex)}</div>`;
        html += '</div>';

        html += '<div class="step">';
        html += '<div class="step-number">2. Lire le tableau</div>';
        html += `<div class="step-expression">${kx(`\\text{${ex.ctx.A} et ${ex.ctx.B}} = ${ex.nAetB}`)}, ${kx(`\\text{Total ${ex.ctx.A}} = ${ex.nA}`)}</div>`;
        html += `<div class="step-explanation">On lit ces valeurs dans le tableau croise.</div>`;
        html += '</div>';

        html += '<div class="step">';
        html += '<div class="step-number">3. Calculer</div>';
        const fr = fracReduite(ex.reponseNum, ex.reponseDen);
        html += `<div class="step-expression">${kx(`${ex.questionTex} = \\frac{${ex.reponseNum}}{${ex.reponseDen}} = ${fracTeX(fr.num, fr.den)}`)}</div>`;
        html += `<div class="step-explanation">${kx(`\\approx ${roundDec(ex.reponseNum / ex.reponseDen, 4)}`)}</div>`;
        html += '</div>';

        html += '<div class="result-highlight">';
        html += `<div class="final">${kx(`${ex.questionTex} = ${fracTeX(fr.num, fr.den)}`)} soit environ ${roundDec(ex.reponseNum / ex.reponseDen * 100, 1)}%</div>`;
        html += '</div>';

    } else if (sub === 'formule') {
        html += '<div class="step">';
        html += '<div class="step-number">1. Rappeler la formule</div>';
        html += `<div class="step-expression">${kx(`P(A|B) = \\frac{P(A \\cap B)}{P(B)}`)}</div>`;
        html += `<div class="step-explanation">Formule de la probabilite conditionnelle</div>`;
        html += '</div>';

        html += '<div class="step">';
        html += '<div class="step-number">2. Remplacer les valeurs</div>';
        html += `<div class="step-expression">${kx(`P(A|B) = \\frac{${ex.pAinterB}}{${ex.pB}}`)}</div>`;
        html += `<div class="step-explanation">${kx(`P(A \\cap B) = ${ex.pAinterB}`)} et ${kx(`P(B) = ${ex.pB}`)}</div>`;
        html += '</div>';

        const fr = fracReduite(ex.reponseNum, ex.reponseDen);
        const val = roundDec(ex.pAinterB / ex.pB, 4);

        html += '<div class="step">';
        html += '<div class="step-number">3. Calculer</div>';
        html += `<div class="step-expression">${kx(`P(A|B) = ${fracTeX(fr.num, fr.den)} \\approx ${val}`)}</div>`;
        html += '</div>';

        html += '<div class="result-highlight">';
        html += `<div class="final">${kx(`P(A|B) = ${fracTeX(fr.num, fr.den)}`)} soit environ ${roundDec(val * 100, 1)}%</div>`;
        html += '</div>';

    } else {
        // Bayes
        html += '<div class="step">';
        html += '<div class="step-number">1. Rappeler la formule de Bayes</div>';
        html += `<div class="step-expression">${kx(`P(A|B) = \\frac{P(B|A) \\times P(A)}{P(B)}`)}</div>`;
        html += '</div>';

        html += '<div class="step">';
        html += '<div class="step-number">2. Calculer P(B) par les probabilites totales</div>';
        const pBval = roundDec(ex.pBsachantA * ex.pA + ex.pBsachantAbar * ex.pAbar, 4);
        html += `<div class="step-expression">${kx(`P(B) = P(B|A) \\times P(A) + P(B|\\bar{A}) \\times P(\\bar{A})`)}</div>`;
        html += `<div class="step-expression">${kx(`P(B) = ${ex.pBsachantA} \\times ${ex.pA} + ${ex.pBsachantAbar} \\times ${ex.pAbar}`)}</div>`;
        html += `<div class="step-expression">${kx(`P(B) = ${roundDec(ex.pBsachantA * ex.pA, 4)} + ${roundDec(ex.pBsachantAbar * ex.pAbar, 4)} = ${pBval}`)}</div>`;
        html += '</div>';

        html += '<div class="step">';
        html += '<div class="step-number">3. Appliquer Bayes</div>';
        const numerateur = roundDec(ex.pBsachantA * ex.pA, 4);
        const resultat = roundDec(numerateur / pBval, 4);
        html += `<div class="step-expression">${kx(`P(A|B) = \\frac{${ex.pBsachantA} \\times ${ex.pA}}{${pBval}} = \\frac{${numerateur}}{${pBval}}`)}</div>`;
        html += `<div class="step-expression">${kx(`P(A|B) \\approx ${resultat}`)}</div>`;
        html += '</div>';

        html += '<div class="result-highlight">';
        html += `<div class="final">${kx(`P(\\text{${ex.ctx.A}} | \\text{${ex.ctx.B}}) \\approx ${resultat}`)} soit environ ${roundDec(resultat * 100, 1)}%</div>`;
        html += '</div>';
    }

    return html;
}

// --- Solutions arbres ---
function solveArbre() {
    const ex = ProbaState.exercise;
    const sub = ProbaState.subtype_arbre;
    let html = '';

    if (sub === 'deux_epreuves') {
        html += '<div class="step">';
        html += '<div class="step-number">1. Construire l\'arbre</div>';
        html += `<div class="step-expression">`;
        html += `<div style="font-family: monospace; line-height: 1.8; padding: 10px;">`;
        html += `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;┌── R2 (${kx(fracTeX(ex.pR2sachantR_num, ex.pR2sachantR_den))})<br>`;
        html += `&nbsp;&nbsp;┌── R1 (${kx(fracTeX(ex.pR1_num, ex.pR1_den))}) ─┤<br>`;
        html += `&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── B2<br>`;
        html += `──┤<br>`;
        html += `&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;┌── R2 (${kx(fracTeX(ex.pR2sachantB_num, ex.pR2sachantB_den))})<br>`;
        html += `&nbsp;&nbsp;└── B1 (${kx(fracTeX(ex.pB1_num, ex.pB1_den))}) ─┤<br>`;
        html += `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── B2<br>`;
        html += `</div></div>`;
        html += `<div class="step-explanation">Arbre pondere avec remise</div>`;
        html += '</div>';

        html += '<div class="step">';
        html += '<div class="step-number">2. Appliquer la regle du produit</div>';
        html += `<div class="step-expression">${kx(`P(R_1 \\cap R_2) = P(R_1) \\times P(R_2|R_1)`)}</div>`;
        html += `<div class="step-expression">${kx(`= ${fracTeX(ex.pR1_num, ex.pR1_den)} \\times ${fracTeX(ex.pR2sachantR_num, ex.pR2sachantR_den)}`)}</div>`;
        html += `<div class="step-expression">${kx(`= ${fracTeX(ex.pDeuxRouges_num, ex.pDeuxRouges_den)}`)}</div>`;
        html += '</div>';

        const fr = fracReduite(ex.pDeuxRouges_num, ex.pDeuxRouges_den);
        const val = roundDec(ex.pDeuxRouges_num / ex.pDeuxRouges_den, 4);

        html += '<div class="result-highlight">';
        html += `<div class="final">${kx(`P(R_1 \\cap R_2) = ${fracTeX(fr.num, fr.den)}`)} soit environ ${roundDec(val * 100, 1)}%</div>`;
        html += '</div>';

    } else {
        // Probabilites totales
        html += '<div class="step">';
        html += '<div class="step-number">1. Identifier les donnees</div>';
        html += `<div class="step-expression">${kx(`P(${ex.ctx.A}) = ${fracTeX(ex.pA_num, ex.pA_den)}`)}, ${kx(`P(${ex.ctx.Abar}) = ${fracTeX(ex.pAbar_num, ex.pAbar_den)}`)}</div>`;
        html += `<div class="step-expression">${kx(`P(${ex.ctx.B}|${ex.ctx.A}) = ${fracTeX(ex.pBsachantA_num, ex.pBsachantA_den)}`)}, ${kx(`P(${ex.ctx.B}|${ex.ctx.Abar}) = ${fracTeX(ex.pBsachantAbar_num, ex.pBsachantAbar_den)}`)}</div>`;
        html += '</div>';

        html += '<div class="step">';
        html += '<div class="step-number">2. Appliquer la formule des probabilites totales</div>';
        html += `<div class="step-expression">${kx(`P(B) = P(B|A) \\times P(A) + P(B|\\bar{A}) \\times P(\\bar{A})`)}</div>`;
        html += `<div class="step-expression">${kx(`= ${fracTeX(ex.pBsachantA_num, ex.pBsachantA_den)} \\times ${fracTeX(ex.pA_num, ex.pA_den)} + ${fracTeX(ex.pBsachantAbar_num, ex.pBsachantAbar_den)} \\times ${fracTeX(ex.pAbar_num, ex.pAbar_den)}`)}</div>`;

        const t1_num = ex.pBsachantA_num * ex.pA_num;
        const t1_den = ex.pBsachantA_den * ex.pA_den;
        const t2_num = ex.pBsachantAbar_num * ex.pAbar_num;
        const t2_den = ex.pBsachantAbar_den * ex.pAbar_den;

        html += `<div class="step-expression">${kx(`= ${fracTeX(t1_num, t1_den)} + ${fracTeX(t2_num, t2_den)}`)}</div>`;
        html += '</div>';

        html += '<div class="step">';
        html += '<div class="step-number">3. Calculer</div>';
        const fr = fracReduite(ex.pB_num, ex.pB_den);
        const val = roundDec(ex.pB_num / ex.pB_den, 4);
        html += `<div class="step-expression">${kx(`P(B) = ${fracTeX(ex.pB_num, ex.pB_den)} = ${fracTeX(fr.num, fr.den)}`)}</div>`;
        html += `<div class="step-explanation">${kx(`\\approx ${val}`)}</div>`;
        html += '</div>';

        html += '<div class="result-highlight">';
        html += `<div class="final">${kx(`P(\\text{${ex.ctx.B}}) = ${fracTeX(fr.num, fr.den)}`)} soit environ ${roundDec(val * 100, 1)}%</div>`;
        html += '</div>';
    }

    return html;
}

// --- Solutions binomiale ---
function solveBinomiale() {
    const ex = ProbaState.exercise;
    const sub = ProbaState.subtype_binomiale;
    let html = '';

    html += '<div class="step">';
    html += '<div class="step-number">1. Identifier les parametres</div>';
    html += `<div class="step-expression">${kx(`X \\sim B(n = ${ex.n},\\; p = ${fracTeX(ex.pNum, ex.pDen)})`)}</div>`;
    html += `<div class="step-explanation">Schema de Bernoulli : ${ex.n} epreuves independantes, probabilite de succes ${kx(`p = ${fracTeX(ex.pNum, ex.pDen)}`)}</div>`;
    html += '</div>';

    if (sub === 'proba_exacte') {
        html += '<div class="step">';
        html += '<div class="step-number">2. Rappeler la formule</div>';
        html += `<div class="step-expression">${kx(`P(X = k) = \\binom{n}{k} \\, p^k \\, (1-p)^{n-k}`)}</div>`;
        html += '</div>';

        html += '<div class="step">';
        html += '<div class="step-number">3. Calculer le coefficient binomial</div>';
        html += `<div class="step-expression">${kx(`\\binom{${ex.n}}{${ex.k}} = \\frac{${ex.n}!}{${ex.k}! \\times ${ex.n - ex.k}!} = ${ex.coeff}`)}</div>`;
        html += '</div>';

        html += '<div class="step">';
        html += '<div class="step-number">4. Appliquer la formule</div>';
        const pVal = roundDec(ex.p, 2);
        const qVal = roundDec(ex.q, 2);
        html += `<div class="step-expression">${kx(`P(X = ${ex.k}) = ${ex.coeff} \\times ${pVal}^{${ex.k}} \\times ${qVal}^{${ex.n - ex.k}}`)}</div>`;
        html += `<div class="step-expression">${kx(`= ${ex.coeff} \\times ${roundDec(Math.pow(ex.p, ex.k), 6)} \\times ${roundDec(Math.pow(ex.q, ex.n - ex.k), 6)}`)}</div>`;
        html += '</div>';

        html += '<div class="result-highlight">';
        html += `<div class="final">${kx(`P(X = ${ex.k}) \\approx ${roundDec(ex.resultat, 4)}`)} soit environ ${roundDec(ex.resultat * 100, 2)}%</div>`;
        html += '</div>';

    } else if (sub === 'esperance') {
        html += '<div class="step">';
        html += '<div class="step-number">2. Calculer l\'esperance</div>';
        html += `<div class="step-expression">${kx(`E(X) = n \\times p = ${ex.n} \\times ${roundDec(ex.p, 2)} = ${roundDec(ex.esperance, 4)}`)}</div>`;
        html += `<div class="step-explanation">L'esperance represente le nombre moyen de succes.</div>`;
        html += '</div>';

        html += '<div class="step">';
        html += '<div class="step-number">3. Calculer la variance</div>';
        html += `<div class="step-expression">${kx(`V(X) = n \\times p \\times (1-p) = ${ex.n} \\times ${roundDec(ex.p, 2)} \\times ${roundDec(ex.q, 2)} = ${roundDec(ex.variance, 4)}`)}</div>`;
        html += '</div>';

        html += '<div class="step">';
        html += '<div class="step-number">4. Calculer l\'ecart-type</div>';
        html += `<div class="step-expression">${kx(`\\sigma(X) = \\sqrt{V(X)} = \\sqrt{${roundDec(ex.variance, 4)}} \\approx ${roundDec(ex.ecartType, 4)}`)}</div>`;
        html += '</div>';

        html += '<div class="result-highlight">';
        html += `<div class="final">${kx(`E(X) = ${roundDec(ex.esperance, 4)}`)}, ${kx(`V(X) = ${roundDec(ex.variance, 4)}`)}, ${kx(`\\sigma(X) \\approx ${roundDec(ex.ecartType, 4)}`)}</div>`;
        html += '</div>';

    } else {
        // Cumul
        html += '<div class="step">';
        html += '<div class="step-number">2. Decomposer la probabilite cumulee</div>';
        if (ex.sens === 'inf') {
            html += `<div class="step-expression">${kx(`P(X \\leq ${ex.k}) = \\sum_{i=0}^{${ex.k}} P(X = i)`)}</div>`;
            let detail = '';
            for (let i = 0; i <= ex.k; i++) {
                const pi = binomProba(ex.n, i, ex.p);
                detail += `<div class="step-expression">${kx(`P(X = ${i}) = \\binom{${ex.n}}{${i}} \\times ${roundDec(ex.p, 2)}^{${i}} \\times ${roundDec(ex.q, 2)}^{${ex.n - i}} \\approx ${roundDec(pi, 4)}`)}</div>`;
            }
            html += detail;
        } else {
            html += `<div class="step-expression">${kx(`P(X \\geq ${ex.k}) = \\sum_{i=${ex.k}}^{${ex.n}} P(X = i)`)}</div>`;
            let detail = '';
            for (let i = ex.k; i <= ex.n; i++) {
                const pi = binomProba(ex.n, i, ex.p);
                detail += `<div class="step-expression">${kx(`P(X = ${i}) = \\binom{${ex.n}}{${i}} \\times ${roundDec(ex.p, 2)}^{${i}} \\times ${roundDec(ex.q, 2)}^{${ex.n - i}} \\approx ${roundDec(pi, 4)}`)}</div>`;
            }
            html += detail;
        }
        html += '</div>';

        html += '<div class="step">';
        html += '<div class="step-number">3. Sommer</div>';
        const symbole = ex.sens === 'inf' ? `\\leq` : `\\geq`;
        html += `<div class="step-expression">${kx(`P(X ${symbole} ${ex.k}) \\approx ${roundDec(ex.cumul, 4)}`)}</div>`;
        html += '</div>';

        html += '<div class="result-highlight">';
        html += `<div class="final">${kx(`P(X ${symbole} ${ex.k}) \\approx ${roundDec(ex.cumul, 4)}`)} soit environ ${roundDec(ex.cumul * 100, 2)}%</div>`;
        html += '</div>';
    }

    return html;
}

// --- Solutions variables aleatoires ---
function solveVariable() {
    const ex = ProbaState.exercise;
    const sub = ProbaState.subtype_variable;
    let html = '';

    if (sub === 'loi') {
        html += '<div class="step">';
        html += '<div class="step-number">1. Utiliser la propriete fondamentale</div>';
        html += `<div class="step-expression">${kx(`\\sum_{i} P(X = x_i) = 1`)}</div>`;
        html += `<div class="step-explanation">La somme de toutes les probabilites vaut 1.</div>`;
        html += '</div>';

        html += '<div class="step">';
        html += '<div class="step-number">2. Calculer la probabilite manquante</div>';
        let somme = 0;
        let detail = '';
        for (let i = 0; i < ex.nbValeurs; i++) {
            if (i !== ex.cachee) {
                somme += ex.probas[i];
                detail += `${fracTeX(ex.probas[i], ex.den)}`;
                if (i < ex.nbValeurs - 1 && !(i === ex.nbValeurs - 2 && ex.cachee === ex.nbValeurs - 1)) {
                    detail += ' + ';
                }
            }
        }
        html += `<div class="step-expression">${kx(`P(X = ${ex.valeurs[ex.cachee]}) = 1 - \\left(${detail.replace(/ \+ $/, '')}\\right)`)}</div>`;
        html += `<div class="step-expression">${kx(`= 1 - ${fracTeX(somme, ex.den)} = ${fracTeX(ex.den - somme, ex.den)}`)}</div>`;

        const fr = fracReduite(ex.probas[ex.cachee], ex.den);
        html += `<div class="step-expression">${kx(`= ${fracTeX(fr.num, fr.den)}`)}</div>`;
        html += '</div>';

        html += '<div class="step">';
        html += '<div class="step-number">3. Verifier</div>';
        html += `<div class="step-expression">Somme : `;
        let verif = [];
        for (let i = 0; i < ex.nbValeurs; i++) {
            verif.push(fracTeX(ex.probas[i], ex.den));
        }
        html += `${kx(verif.join(' + '))} = ${kx(fracTeX(ex.den, ex.den))} = 1 \\; \\checkmark</div>`;
        html += '</div>';

        html += '<div class="result-highlight">';
        html += `<div class="final">${kx(`P(X = ${ex.valeurs[ex.cachee]}) = ${fracTeX(fr.num, fr.den)}`)}</div>`;
        html += '</div>';

    } else {
        // Esperance et variance
        html += '<div class="step">';
        html += '<div class="step-number">1. Rappeler la loi de X</div>';
        html += `<table style="border-collapse: collapse; margin: 10px auto; text-align: center;">`;
        html += `<tr style="background: var(--gray-100);"><td style="border:1px solid var(--gray-300); padding:8px; font-weight:bold;">${kx('x_i')}</td>`;
        for (let i = 0; i < ex.nbValeurs; i++) {
            html += `<td style="border:1px solid var(--gray-300); padding:8px;">${ex.valeurs[i]}</td>`;
        }
        html += `</tr><tr><td style="border:1px solid var(--gray-300); padding:8px; font-weight:bold;">${kx('P(X=x_i)')}</td>`;
        for (let i = 0; i < ex.nbValeurs; i++) {
            html += `<td style="border:1px solid var(--gray-300); padding:8px;">${kx(fracTeX(ex.probas[i], ex.den))}</td>`;
        }
        html += `</tr></table>`;
        html += '</div>';

        html += '<div class="step">';
        html += '<div class="step-number">2. Calculer E(X)</div>';
        html += `<div class="step-expression">${kx(`E(X) = \\sum x_i \\times P(X = x_i)`)}</div>`;
        let espDetail = [];
        for (let i = 0; i < ex.nbValeurs; i++) {
            espDetail.push(`${ex.valeurs[i]} \\times ${fracTeX(ex.probas[i], ex.den)}`);
        }
        html += `<div class="step-expression">${kx(`= ${espDetail.join(' + ')}`)}</div>`;

        let espNumDetail = [];
        let espNum = 0;
        for (let i = 0; i < ex.nbValeurs; i++) {
            const val = ex.valeurs[i] * ex.probas[i];
            espNum += val;
            espNumDetail.push(fracTeX(val, ex.den));
        }
        html += `<div class="step-expression">${kx(`= ${espNumDetail.join(' + ')} = ${fracTeX(espNum, ex.den)}`)}</div>`;

        const espFr = fracReduite(espNum, ex.den);
        html += `<div class="step-expression">${kx(`E(X) = ${fracTeX(espFr.num, espFr.den)} \\approx ${roundDec(ex.esperance, 4)}`)}</div>`;
        html += '</div>';

        html += '<div class="step">';
        html += '<div class="step-number">3. Calculer V(X)</div>';
        html += `<div class="step-expression">${kx(`V(X) = E(X^2) - [E(X)]^2`)}</div>`;

        // E(X^2)
        let ex2 = 0;
        for (let i = 0; i < ex.nbValeurs; i++) {
            ex2 += ex.valeurs[i] * ex.valeurs[i] * ex.probas[i] / ex.den;
        }
        html += `<div class="step-expression">${kx(`E(X^2) = ${roundDec(ex2, 4)}`)}</div>`;
        html += `<div class="step-expression">${kx(`V(X) = ${roundDec(ex2, 4)} - (${roundDec(ex.esperance, 4)})^2 = ${roundDec(ex2, 4)} - ${roundDec(ex.esperance * ex.esperance, 4)} = ${roundDec(ex.variance, 4)}`)}</div>`;
        html += '</div>';

        html += '<div class="step">';
        html += '<div class="step-number">4. Calculer l\'ecart-type</div>';
        html += `<div class="step-expression">${kx(`\\sigma(X) = \\sqrt{V(X)} = \\sqrt{${roundDec(ex.variance, 4)}} \\approx ${roundDec(ex.ecartType, 4)}`)}</div>`;
        html += '</div>';

        html += '<div class="result-highlight">';
        html += `<div class="final">${kx(`E(X) \\approx ${roundDec(ex.esperance, 4)}`)}, ${kx(`V(X) \\approx ${roundDec(ex.variance, 4)}`)}, ${kx(`\\sigma(X) \\approx ${roundDec(ex.ecartType, 4)}`)}</div>`;
        html += '</div>';
    }

    return html;
}

// --- Solutions fluctuation ---
function solveFluctuation() {
    const ex = ProbaState.exercise;
    const sub = ProbaState.subtype_fluctuation;
    let html = '';

    html += '<div class="step">';
    html += '<div class="step-number">1. Verifier les conditions</div>';
    html += `<div class="step-expression">${kx(`n = ${ex.n} \\geq 25`)} ${kx('\\checkmark')}</div>`;
    html += `<div class="step-expression">${kx(`n \\times p = ${ex.n} \\times ${ex.p} = ${roundDec(ex.n * ex.p, 2)} \\geq 5`)} ${ex.n * ex.p >= 5 ? kx('\\checkmark') : kx('\\text{(condition limite)}')}</div>`;
    html += `<div class="step-expression">${kx(`n \\times (1-p) = ${ex.n} \\times ${roundDec(1 - ex.p, 2)} = ${roundDec(ex.n * (1 - ex.p), 2)} \\geq 5`)} ${ex.n * (1 - ex.p) >= 5 ? kx('\\checkmark') : kx('\\text{(condition limite)}')}</div>`;
    html += '</div>';

    html += '<div class="step">';
    html += '<div class="step-number">2. Calculer l\'intervalle de fluctuation</div>';
    html += `<div class="step-expression">${kx(`I = \\left[ p - \\frac{1}{\\sqrt{n}} \\;; \\; p + \\frac{1}{\\sqrt{n}} \\right]`)}</div>`;
    html += `<div class="step-expression">${kx(`\\frac{1}{\\sqrt{${ex.n}}} = \\frac{1}{${roundDec(Math.sqrt(ex.n), 4)}} \\approx ${roundDec(ex.marge, 4)}`)}</div>`;
    html += `<div class="step-expression">${kx(`I = \\left[ ${ex.p} - ${roundDec(ex.marge, 4)} \\;; \\; ${ex.p} + ${roundDec(ex.marge, 4)} \\right]`)}</div>`;
    html += `<div class="step-expression">${kx(`I \\approx \\left[ ${roundDec(ex.borneInf, 4)} \\;; \\; ${roundDec(ex.borneSup, 4)} \\right]`)}</div>`;
    html += '</div>';

    if (sub === 'decision') {
        html += '<div class="step">';
        html += '<div class="step-number">3. Comparer la frequence observee</div>';
        html += `<div class="step-expression">${kx(`f_{obs} = ${ex.fObs}`)}</div>`;
        if (ex.dansIntervalle) {
            html += `<div class="step-expression">${kx(`${roundDec(ex.borneInf, 4)} \\leq ${ex.fObs} \\leq ${roundDec(ex.borneSup, 4)}`)} ${kx('\\checkmark')}</div>`;
            html += `<div class="step-explanation">La frequence observee appartient a l'intervalle de fluctuation.</div>`;
        } else {
            html += `<div class="step-expression">${kx(`${ex.fObs} \\notin \\left[ ${roundDec(ex.borneInf, 4)} \\;; \\; ${roundDec(ex.borneSup, 4)} \\right]`)}</div>`;
            html += `<div class="step-explanation">La frequence observee n'appartient pas a l'intervalle de fluctuation.</div>`;
        }
        html += '</div>';

        html += '<div class="result-highlight">';
        if (ex.dansIntervalle) {
            html += `<div class="final">On accepte l'hypothese ${kx(`p = ${ex.p}`)} au seuil de 95%.<br>La frequence observee est compatible avec la proportion theorique.</div>`;
        } else {
            html += `<div class="final">On rejette l'hypothese ${kx(`p = ${ex.p}`)} au seuil de 95%.<br>La frequence observee n'est pas compatible avec la proportion theorique.</div>`;
        }
        html += '</div>';
    } else {
        html += '<div class="result-highlight">';
        html += `<div class="final">Intervalle de fluctuation au seuil de 95% :<br>${kx(`I = \\left[ ${roundDec(ex.borneInf, 4)} \\;; \\; ${roundDec(ex.borneSup, 4)} \\right]`)}</div>`;
        html += '</div>';
    }

    return html;
}

// ========================================
// Initialisation au chargement
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    initProbabilitesPage();
});
