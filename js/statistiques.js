/* ========================================
   STATISTIQUES.JS - Statistiques descriptives (Lycee)
   ======================================== */

/**
 * Etat du module Statistiques
 */
const StatsState = {
    currentType: 'moyenne',

    subtype_moyenne: 'simple',
    subtype_mediane: 'simple',
    subtype_dispersion: 'simple',
    subtype_boite: 'construire',
    subtype_regression: 'equation',

    exercise: {}
};

// ========================================
// Initialisation
// ========================================

function initStatistiquesPage() {
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
            StatsState.currentType = button.dataset.type;

            document.querySelectorAll('[id$="Section"]').forEach(section => {
                section.style.display = 'none';
            });

            const sectionMap = {
                'moyenne': 'moyenneSection',
                'mediane': 'medianeSection',
                'dispersion': 'dispersionSection',
                'boite': 'boiteSection',
                'regression': 'regressionSection'
            };
            const sectionId = sectionMap[StatsState.currentType];
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
        'subtype_moyenne', 'subtype_mediane', 'subtype_dispersion',
        'subtype_boite', 'subtype_regression'
    ];
    selects.forEach(id => {
        const el = $(id);
        if (el) {
            el.addEventListener('change', () => {
                StatsState[id] = el.value;
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
        solveStatistiques();
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

function K(tex) {
    return katex.renderToString(tex, { throwOnError: false });
}

function roundDec(x, d) {
    const f = Math.pow(10, d);
    return Math.round(x * f) / f;
}

function fracTeX(num, den) {
    if (den === 1) return `${num}`;
    return `\\frac{${num}}{${den}}`;
}

function tableCell(content, options) {
    const style = 'border:1px solid var(--gray-300); padding:8px;'
        + (options && options.bold ? ' font-weight:bold;' : '')
        + (options && options.color ? ` color:${options.color};` : '')
        + (options && options.bg ? ` background:${options.bg};` : '');
    const tag = (options && options.header) ? 'th' : 'td';
    return `<${tag} style="${style}">${content}</${tag}>`;
}

// Trie un tableau et retourne une copie triee
function sortedCopy(arr) {
    return arr.slice().sort((a, b) => a - b);
}

// Calcule la mediane d'un tableau DEJA trie
function computeMedian(sorted) {
    const n = sorted.length;
    if (n % 2 === 1) {
        return sorted[Math.floor(n / 2)];
    }
    return (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
}

// Calcule Q1 et Q3 (methode des sous-listes)
function computeQuartiles(sorted) {
    const n = sorted.length;
    let lower, upper;
    if (n % 2 === 1) {
        const mid = Math.floor(n / 2);
        lower = sorted.slice(0, mid);
        upper = sorted.slice(mid + 1);
    } else {
        lower = sorted.slice(0, n / 2);
        upper = sorted.slice(n / 2);
    }
    return {
        q1: computeMedian(lower),
        q3: computeMedian(upper)
    };
}

// Developpe une serie ponderee en liste complete
function expandSeries(valeurs, effectifs) {
    const result = [];
    for (let i = 0; i < valeurs.length; i++) {
        for (let j = 0; j < effectifs[i]; j++) {
            result.push(valeurs[i]);
        }
    }
    return result;
}

// ========================================
// Generation des exercices
// ========================================

function generateNewExercise() {
    const type = StatsState.currentType;
    switch (type) {
        case 'moyenne': generateMoyenne(); break;
        case 'mediane': generateMediane(); break;
        case 'dispersion': generateDispersion(); break;
        case 'boite': generateBoite(); break;
        case 'regression': generateRegression(); break;
    }
}

// --- Moyenne ---
function generateMoyenne() {
    const sub = StatsState.subtype_moyenne;
    const ex = {};

    if (sub === 'simple') {
        const n = rint(5, 9);
        const vals = [];
        for (let i = 0; i < n; i++) {
            vals.push(rint(2, 20));
        }
        ex.valeurs = vals;
        ex.n = n;
        const somme = vals.reduce((s, v) => s + v, 0);
        ex.somme = somme;
        ex.moyenne = somme / n;

    } else if (sub === 'ponderee') {
        const nbVals = rint(4, 6);
        const vals = [];
        const effs = [];
        let startVal = rint(5, 10);
        for (let i = 0; i < nbVals; i++) {
            vals.push(startVal + i * rint(1, 3));
            effs.push(rint(1, 8));
        }
        // Trier valeurs
        vals.sort((a, b) => a - b);
        ex.valeurs = vals;
        ex.effectifs = effs;
        ex.totalEffectifs = effs.reduce((s, e) => s + e, 0);
        let sommeProd = 0;
        for (let i = 0; i < nbVals; i++) {
            sommeProd += vals[i] * effs[i];
        }
        ex.sommeProd = sommeProd;
        ex.moyenne = sommeProd / ex.totalEffectifs;

    } else {
        // classes
        const nbClasses = rint(4, 5);
        const borneInf = rint(0, 10);
        const largeur = rint(5, 10);
        const classes = [];
        const centres = [];
        const effs = [];
        for (let i = 0; i < nbClasses; i++) {
            const a = borneInf + i * largeur;
            const b = a + largeur;
            classes.push([a, b]);
            centres.push((a + b) / 2);
            effs.push(rint(2, 12));
        }
        ex.classes = classes;
        ex.centres = centres;
        ex.effectifs = effs;
        ex.totalEffectifs = effs.reduce((s, e) => s + e, 0);
        let sommeProd = 0;
        for (let i = 0; i < nbClasses; i++) {
            sommeProd += centres[i] * effs[i];
        }
        ex.sommeProd = sommeProd;
        ex.moyenne = sommeProd / ex.totalEffectifs;
    }

    StatsState.exercise = ex;
}

// --- Mediane & Quartiles ---
function generateMediane() {
    const sub = StatsState.subtype_mediane;
    const ex = {};

    if (sub === 'simple') {
        // Effectif impair ou pair aleatoirement
        const n = rint(7, 13);
        const vals = [];
        for (let i = 0; i < n; i++) {
            vals.push(rint(1, 30));
        }
        ex.valeurs = vals;
        ex.n = n;
        const sorted = sortedCopy(vals);
        ex.sorted = sorted;
        ex.mediane = computeMedian(sorted);
        const q = computeQuartiles(sorted);
        ex.q1 = q.q1;
        ex.q3 = q.q3;
        ex.eiq = q.q3 - q.q1;

    } else {
        // Avec effectifs
        const nbVals = rint(5, 7);
        const vals = [];
        const effs = [];
        let v = rint(0, 5);
        for (let i = 0; i < nbVals; i++) {
            v += rint(1, 3);
            vals.push(v);
            effs.push(rint(1, 8));
        }
        ex.valeurs = vals;
        ex.effectifs = effs;
        ex.totalEffectifs = effs.reduce((s, e) => s + e, 0);

        // Developper en liste pour calculer
        const expanded = expandSeries(vals, effs);
        const sorted = sortedCopy(expanded);
        ex.sorted = sorted;
        ex.mediane = computeMedian(sorted);
        const q = computeQuartiles(sorted);
        ex.q1 = q.q1;
        ex.q3 = q.q3;
        ex.eiq = q.q3 - q.q1;

        // Effectifs cumules
        const cumules = [];
        let cumul = 0;
        for (let i = 0; i < nbVals; i++) {
            cumul += effs[i];
            cumules.push(cumul);
        }
        ex.cumules = cumules;
    }

    StatsState.exercise = ex;
}

// --- Variance & Ecart-type ---
function generateDispersion() {
    const sub = StatsState.subtype_dispersion;
    const ex = {};

    if (sub === 'simple') {
        const n = rint(5, 8);
        const vals = [];
        for (let i = 0; i < n; i++) {
            vals.push(rint(2, 20));
        }
        ex.valeurs = vals;
        ex.n = n;
        const somme = vals.reduce((s, v) => s + v, 0);
        ex.moyenne = somme / n;

        let sommeCarres = 0;
        for (let i = 0; i < n; i++) {
            sommeCarres += Math.pow(vals[i] - ex.moyenne, 2);
        }
        ex.variance = sommeCarres / n;
        ex.ecartType = Math.sqrt(ex.variance);

    } else {
        // Ponderee
        const nbVals = rint(4, 6);
        const vals = [];
        const effs = [];
        let v = rint(5, 10);
        for (let i = 0; i < nbVals; i++) {
            vals.push(v);
            v += rint(2, 5);
            effs.push(rint(1, 8));
        }
        ex.valeurs = vals;
        ex.effectifs = effs;
        const totalN = effs.reduce((s, e) => s + e, 0);
        ex.totalEffectifs = totalN;

        let sommeProd = 0;
        for (let i = 0; i < nbVals; i++) {
            sommeProd += vals[i] * effs[i];
        }
        ex.moyenne = sommeProd / totalN;

        let sommeCarres = 0;
        for (let i = 0; i < nbVals; i++) {
            sommeCarres += effs[i] * Math.pow(vals[i] - ex.moyenne, 2);
        }
        ex.variance = sommeCarres / totalN;
        ex.ecartType = Math.sqrt(ex.variance);
    }

    StatsState.exercise = ex;
}

// --- Diagramme en boite ---
function generateBoite() {
    const sub = StatsState.subtype_boite;
    const ex = {};

    if (sub === 'construire') {
        const n = rint(10, 15);
        const vals = [];
        for (let i = 0; i < n; i++) {
            vals.push(rint(1, 40));
        }
        ex.valeurs = vals;
        ex.n = n;
        const sorted = sortedCopy(vals);
        ex.sorted = sorted;
        ex.min = sorted[0];
        ex.max = sorted[n - 1];
        ex.mediane = computeMedian(sorted);
        const q = computeQuartiles(sorted);
        ex.q1 = q.q1;
        ex.q3 = q.q3;

    } else {
        // Lire un diagramme : on genere les 5 indicateurs
        const min = rint(1, 10);
        const q1 = min + rint(3, 8);
        const med = q1 + rint(2, 6);
        const q3 = med + rint(2, 6);
        const max = q3 + rint(3, 8);

        ex.min = min;
        ex.q1 = q1;
        ex.mediane = med;
        ex.q3 = q3;
        ex.max = max;
        ex.eiq = q3 - q1;
        ex.etendue = max - min;
    }

    StatsState.exercise = ex;
}

// --- Regression lineaire ---
function generateRegression() {
    const sub = StatsState.subtype_regression;
    const ex = {};

    const n = rint(5, 7);
    // Generer des points autour d'une droite y = a*x + b + bruit
    const trueA = roundDec(rint(1, 5) + rint(0, 9) / 10, 1);
    const trueB = rint(-5, 10);
    const xs = [];
    const ys = [];
    for (let i = 0; i < n; i++) {
        const x = rint(1, 3) + i * rint(2, 4);
        xs.push(x);
        const noise = rint(-3, 3);
        ys.push(roundDec(trueA * x + trueB + noise, 1));
    }

    ex.xs = xs;
    ex.ys = ys;
    ex.n = n;

    // Moyennes
    const xBar = xs.reduce((s, v) => s + v, 0) / n;
    const yBar = ys.reduce((s, v) => s + v, 0) / n;
    ex.xBar = xBar;
    ex.yBar = yBar;

    // Covariance et variance de x
    let covXY = 0;
    let varX = 0;
    let varY = 0;
    for (let i = 0; i < n; i++) {
        covXY += (xs[i] - xBar) * (ys[i] - yBar);
        varX += Math.pow(xs[i] - xBar, 2);
        varY += Math.pow(ys[i] - yBar, 2);
    }
    covXY /= n;
    varX /= n;
    varY /= n;

    ex.covXY = covXY;
    ex.varX = varX;
    ex.varY = varY;

    // Coefficient directeur a = Cov(X,Y) / V(X)
    const a = covXY / varX;
    const b = yBar - a * xBar;
    ex.a = a;
    ex.b = b;

    // Coefficient de correlation r = Cov(X,Y) / (sigma_X * sigma_Y)
    const sigmaX = Math.sqrt(varX);
    const sigmaY = Math.sqrt(varY);
    const r = (sigmaX > 0 && sigmaY > 0) ? covXY / (sigmaX * sigmaY) : 0;
    ex.r = r;

    StatsState.exercise = ex;
}

// ========================================
// Affichage de l'exercice
// ========================================

function updateExerciseDisplay() {
    const ex = StatsState.exercise;
    const type = StatsState.currentType;
    let html = '';

    switch (type) {
        case 'moyenne': html = displayMoyenne(ex); break;
        case 'mediane': html = displayMediane(ex); break;
        case 'dispersion': html = displayDispersion(ex); break;
        case 'boite': html = displayBoite(ex); break;
        case 'regression': html = displayRegression(ex); break;
    }

    $('expressionDisplay').innerHTML = html;
}

function displayMoyenne(ex) {
    const sub = StatsState.subtype_moyenne;
    const niveau = new URLSearchParams(window.location.search).get('niveau');
    let html = '';

    if (sub === 'simple') {
        if (niveau === '6eme' || niveau === '5eme') {
            html = `<p>Voici une liste de valeurs :</p>`;
            html += `<p style="text-align:center; font-size:1.1em; font-weight:bold;">${ex.valeurs.join(' ; ')}</p>`;
            html += `<p>Calcule la <strong>moyenne</strong> de ces valeurs.</p>`;
        } else {
            html = `<p>On considere la serie statistique suivante :</p>`;
            html += `<p style="text-align:center; font-size:1.1em; font-weight:bold;">${ex.valeurs.join(' ; ')}</p>`;
            html += `<p>Calculer la moyenne de cette serie.</p>`;
        }

    } else if (sub === 'ponderee') {
        html = `<p>On considere la serie statistique suivante :</p>`;
        html += buildFrequencyTable(ex.valeurs, ex.effectifs);
        html += `<p>Calculer la moyenne ponderee de cette serie.</p>`;

    } else {
        html = `<p>On considere la serie statistique groupee en classes :</p>`;
        html += `<table style="border-collapse: collapse; margin: 10px auto; text-align: center;">`;
        html += `<tr style="background: var(--gray-100);">`;
        html += tableCell('Classe', { header: true });
        html += tableCell('Effectif', { header: true });
        html += `</tr>`;
        for (let i = 0; i < ex.classes.length; i++) {
            html += `<tr>`;
            html += tableCell(`[${ex.classes[i][0]} ; ${ex.classes[i][1]}[`);
            html += tableCell(ex.effectifs[i]);
            html += `</tr>`;
        }
        html += `</table>`;
        html += `<p>Calculer la moyenne de cette serie (en utilisant les centres de classes).</p>`;
    }
    return html;
}

function displayMediane(ex) {
    const sub = StatsState.subtype_mediane;
    let html = '';

    if (sub === 'simple') {
        html = `<p>On considere la serie statistique suivante :</p>`;
        html += `<p style="text-align:center; font-size:1.1em; font-weight:bold;">${ex.valeurs.join(' ; ')}</p>`;
        html += `<p>Determiner la mediane, le premier quartile ` + K('Q_1') + `, le troisieme quartile ` + K('Q_3') + ` et l'ecart interquartile.</p>`;

    } else {
        html = `<p>On considere la serie statistique suivante :</p>`;
        html += buildFrequencyTable(ex.valeurs, ex.effectifs);
        html += `<p>Determiner la mediane, ` + K('Q_1') + `, ` + K('Q_3') + ` et l'ecart interquartile.</p>`;
    }
    return html;
}

function displayDispersion(ex) {
    const sub = StatsState.subtype_dispersion;
    let html = '';

    if (sub === 'simple') {
        html = `<p>On considere la serie statistique suivante :</p>`;
        html += `<p style="text-align:center; font-size:1.1em; font-weight:bold;">${ex.valeurs.join(' ; ')}</p>`;
        html += `<p>Calculer la variance et l'ecart-type de cette serie.</p>`;

    } else {
        html = `<p>On considere la serie statistique suivante :</p>`;
        html += buildFrequencyTable(ex.valeurs, ex.effectifs);
        html += `<p>Calculer la variance et l'ecart-type de cette serie.</p>`;
    }
    return html;
}

function displayBoite(ex) {
    const sub = StatsState.subtype_boite;
    let html = '';

    if (sub === 'construire') {
        html = `<p>On considere la serie statistique suivante :</p>`;
        html += `<p style="text-align:center; font-size:1.1em; font-weight:bold;">${ex.valeurs.join(' ; ')}</p>`;
        html += `<p>Determiner les 5 indicateurs (Min, Q<sub>1</sub>, Me, Q<sub>3</sub>, Max) et representer le diagramme en boite.</p>`;

    } else {
        // Afficher le diagramme, demander de lire les valeurs
        html = `<p>A partir du diagramme en boite ci-dessous, determiner :</p>`;
        html += `<p>Min, Q<sub>1</sub>, Me, Q<sub>3</sub>, Max, l'etendue et l'ecart interquartile.</p>`;
        html += drawBoxPlot(ex.min, ex.q1, ex.mediane, ex.q3, ex.max);
    }
    return html;
}

function displayRegression(ex) {
    const sub = StatsState.subtype_regression;
    let html = '';

    html = `<p>On considere la serie statistique double suivante :</p>`;
    html += `<table style="border-collapse: collapse; margin: 10px auto; text-align: center;">`;
    html += `<tr style="background: var(--gray-100);">`;
    html += tableCell(K('x_i'), { bold: true });
    for (let i = 0; i < ex.n; i++) {
        html += tableCell(ex.xs[i]);
    }
    html += `</tr><tr>`;
    html += tableCell(K('y_i'), { bold: true });
    for (let i = 0; i < ex.n; i++) {
        html += tableCell(ex.ys[i]);
    }
    html += `</tr></table>`;

    if (sub === 'equation') {
        html += `<p>Determiner l'equation de la droite de regression ` + K('y = ax + b') + ` par la methode des moindres carres.</p>`;
    } else {
        html += `<p>Calculer le coefficient de correlation lineaire ` + K('r') + ` et interpreter le resultat.</p>`;
    }
    return html;
}

// ========================================
// Helpers d'affichage
// ========================================

function buildFrequencyTable(valeurs, effectifs) {
    let html = `<table style="border-collapse: collapse; margin: 10px auto; text-align: center;">`;
    html += `<tr style="background: var(--gray-100);">`;
    html += tableCell('Valeur', { header: true });
    for (let i = 0; i < valeurs.length; i++) {
        html += tableCell(valeurs[i]);
    }
    html += `</tr><tr>`;
    html += tableCell('Effectif', { header: true });
    for (let i = 0; i < effectifs.length; i++) {
        html += tableCell(effectifs[i]);
    }
    html += `</tr></table>`;
    return html;
}

// Dessine un diagramme en boite en SVG
function drawBoxPlot(min, q1, med, q3, max) {
    const padL = 40;
    const padR = 40;
    const svgW = 500;
    const svgH = 100;
    const boxY = 25;
    const boxH = 40;

    // Echelle
    const dataMin = min - 1;
    const dataMax = max + 1;
    const scale = (svgW - padL - padR) / (dataMax - dataMin);
    function sx(v) { return padL + (v - dataMin) * scale; }

    let svg = `<div style="overflow-x:auto; margin:12px 0;">`;
    svg += `<svg width="${svgW}" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}" style="display:block; margin:auto; font-family:system-ui,sans-serif; font-size:12px;">`;

    // Axe
    svg += `<line x1="${padL}" y1="${boxY + boxH + 10}" x2="${svgW - padR}" y2="${boxY + boxH + 10}" stroke="#999" stroke-width="1"/>`;

    // Graduations
    const step = Math.max(1, Math.ceil((dataMax - dataMin) / 10));
    for (let v = Math.ceil(dataMin); v <= Math.floor(dataMax); v += step) {
        const x = sx(v);
        svg += `<line x1="${x}" y1="${boxY + boxH + 7}" x2="${x}" y2="${boxY + boxH + 13}" stroke="#999" stroke-width="1"/>`;
        svg += `<text x="${x}" y="${boxY + boxH + 25}" text-anchor="middle" fill="#666">${v}</text>`;
    }

    // Moustaches
    const midY = boxY + boxH / 2;
    svg += `<line x1="${sx(min)}" y1="${midY}" x2="${sx(q1)}" y2="${midY}" stroke="#667eea" stroke-width="2"/>`;
    svg += `<line x1="${sx(q3)}" y1="${midY}" x2="${sx(max)}" y2="${midY}" stroke="#667eea" stroke-width="2"/>`;

    // Barres verticales extremes
    svg += `<line x1="${sx(min)}" y1="${boxY + 10}" x2="${sx(min)}" y2="${boxY + boxH - 10}" stroke="#667eea" stroke-width="2"/>`;
    svg += `<line x1="${sx(max)}" y1="${boxY + 10}" x2="${sx(max)}" y2="${boxY + boxH - 10}" stroke="#667eea" stroke-width="2"/>`;

    // Boite
    const bx = sx(q1);
    const bw = sx(q3) - sx(q1);
    svg += `<rect x="${bx}" y="${boxY}" width="${bw}" height="${boxH}" fill="rgba(102,126,234,0.15)" stroke="#667eea" stroke-width="2" rx="3"/>`;

    // Mediane
    svg += `<line x1="${sx(med)}" y1="${boxY}" x2="${sx(med)}" y2="${boxY + boxH}" stroke="#e53e3e" stroke-width="2.5"/>`;

    svg += `</svg></div>`;
    return svg;
}

// Dessine un nuage de points en SVG
function drawScatterPlot(xs, ys, a, b) {
    const padL = 50;
    const padR = 20;
    const padT = 20;
    const padB = 40;
    const svgW = 450;
    const svgH = 300;

    const xMin = Math.min(...xs) - 1;
    const xMax = Math.max(...xs) + 1;
    const yMin = Math.min(...ys, a * Math.min(...xs) + b) - 2;
    const yMax = Math.max(...ys, a * Math.max(...xs) + b) + 2;

    const scaleX = (svgW - padL - padR) / (xMax - xMin);
    const scaleY = (svgH - padT - padB) / (yMax - yMin);
    function sx(v) { return padL + (v - xMin) * scaleX; }
    function sy(v) { return svgH - padB - (v - yMin) * scaleY; }

    let svg = `<div style="overflow-x:auto; margin:12px 0;">`;
    svg += `<svg width="${svgW}" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}" style="display:block; margin:auto; font-family:system-ui,sans-serif; font-size:11px;">`;

    // Axes
    svg += `<line x1="${padL}" y1="${svgH - padB}" x2="${svgW - padR}" y2="${svgH - padB}" stroke="#999" stroke-width="1"/>`;
    svg += `<line x1="${padL}" y1="${padT}" x2="${padL}" y2="${svgH - padB}" stroke="#999" stroke-width="1"/>`;

    // Graduations X
    const stepX = Math.max(1, Math.ceil((xMax - xMin) / 8));
    for (let v = Math.ceil(xMin); v <= Math.floor(xMax); v += stepX) {
        svg += `<text x="${sx(v)}" y="${svgH - padB + 18}" text-anchor="middle" fill="#666">${v}</text>`;
    }

    // Graduations Y
    const stepY = Math.max(1, Math.ceil((yMax - yMin) / 6));
    for (let v = Math.ceil(yMin); v <= Math.floor(yMax); v += stepY) {
        svg += `<text x="${padL - 8}" y="${sy(v) + 4}" text-anchor="end" fill="#666">${v}</text>`;
    }

    // Droite de regression
    if (a !== undefined && b !== undefined) {
        const x1 = xMin;
        const x2 = xMax;
        const y1 = a * x1 + b;
        const y2 = a * x2 + b;
        svg += `<line x1="${sx(x1)}" y1="${sy(y1)}" x2="${sx(x2)}" y2="${sy(y2)}" stroke="#e53e3e" stroke-width="1.5" stroke-dasharray="6,3"/>`;
    }

    // Points
    for (let i = 0; i < xs.length; i++) {
        svg += `<circle cx="${sx(xs[i])}" cy="${sy(ys[i])}" r="5" fill="#667eea" stroke="#fff" stroke-width="1.5"/>`;
    }

    svg += `</svg></div>`;
    return svg;
}

// ========================================
// Resolution
// ========================================

function solveStatistiques() {
    const type = StatsState.currentType;
    let html = '';

    try {
        switch (type) {
            case 'moyenne': html = solveMoyenne(); break;
            case 'mediane': html = solveMediane(); break;
            case 'dispersion': html = solveDispersion(); break;
            case 'boite': html = solveBoite(); break;
            case 'regression': html = solveRegression(); break;
            default: html = '<p>Type inconnu : ' + type + '</p>';
        }
    } catch (e) {
        html = '<div class="step"><div class="step-number">Erreur</div>';
        html += '<div class="step-explanation">' + e.message + '</div></div>';
    }

    $('stepsContainer').innerHTML = html;
    showSolution('solutionDiv');
}

// --- Solution Moyenne ---
function solveMoyenne() {
    const ex = StatsState.exercise;
    const sub = StatsState.subtype_moyenne;
    const niveau = new URLSearchParams(window.location.search).get('niveau');
    let html = '';

    // Correction simplifiee pour le college
    const isCollege = ['6eme', '5eme', '4eme', '3eme'].includes(niveau);
    if (isCollege && sub === 'simple') {
        html += '<div class="step">';
        html += '<div class="step-number">1. La regle</div>';
        html += '<div class="step-explanation">Pour calculer la <strong>moyenne</strong>, on additionne toutes les valeurs, puis on divise par le nombre de valeurs.</div>';
        html += '</div>';

        html += '<div class="step">';
        html += '<div class="step-number">2. On additionne toutes les valeurs</div>';
        html += `<div class="step-expression">${ex.valeurs.join(' + ')} = <strong>${ex.somme}</strong></div>`;
        html += '</div>';

        html += '<div class="step">';
        html += `<div class="step-number">3. On divise par le nombre de valeurs (il y en a ${ex.n})</div>`;
        html += `<div class="step-expression">${ex.somme} &div; ${ex.n} = <strong>${roundDec(ex.moyenne, 2)}</strong></div>`;
        html += '</div>';

        html += '<div class="result-highlight">';
        html += `<div class="final">La moyenne est <strong>${roundDec(ex.moyenne, 2)}</strong></div>`;
        html += '</div>';
        return html;
    }

    html += '<div class="step">';
    html += '<div class="step-number">1. Rappeler la formule</div>';
    if (sub === 'simple') {
        if (isCollege) {
            html += `<div class="step-expression">Moyenne = ` + K(`\\dfrac{\\text{somme des valeurs}}{\\text{nombre de valeurs}}`) + `</div>`;
        } else {
            html += `<div class="step-expression">` + K(`\\bar{x} = \\frac{1}{n} \\sum_{i=1}^{n} x_i = \\frac{x_1 + x_2 + \\cdots + x_n}{n}`) + `</div>`;
        }
    } else {
        if (isCollege) {
            html += `<div class="step-expression">Moyenne = ` + K(`\\dfrac{\\text{somme des (valeur} \\times \\text{effectif)}}{\\text{effectif total}}`) + `</div>`;
        } else {
            html += `<div class="step-expression">` + K(`\\bar{x} = \\frac{\\sum n_i \\cdot x_i}{\\sum n_i}`) + `</div>`;
        }
    }
    html += '</div>';

    if (sub === 'simple') {
        html += '<div class="step">';
        html += '<div class="step-number">2. Calculer la somme</div>';
        if (isCollege) {
            html += `<div class="step-expression">${ex.valeurs.join(' + ')} = <strong>${ex.somme}</strong></div>`;
        } else {
            html += `<div class="step-expression">` + K(`\\sum x_i = ${ex.valeurs.join(' + ')} = ${ex.somme}`) + `</div>`;
        }
        html += '</div>';

        html += '<div class="step">';
        html += '<div class="step-number">3. Diviser par l\'effectif</div>';
        html += `<div class="step-expression">` + K(`\\dfrac{${ex.somme}}{${ex.n}} = ${roundDec(ex.moyenne, 2)}`) + `</div>`;
        html += '</div>';

    } else if (sub === 'ponderee') {
        html += '<div class="step">';
        html += '<div class="step-number">2. Calculer les produits</div>';
        let termes = [];
        for (let i = 0; i < ex.valeurs.length; i++) {
            termes.push(`${ex.valeurs[i]} \\times ${ex.effectifs[i]}`);
        }
        if (isCollege) {
            html += `<div class="step-expression">` + K(termes.join(' + ')) + `</div>`;
        } else {
            html += `<div class="step-expression">` + K(`\\sum n_i \\cdot x_i = ${termes.join(' + ')}`) + `</div>`;
        }

        let details = [];
        for (let i = 0; i < ex.valeurs.length; i++) {
            details.push(ex.valeurs[i] * ex.effectifs[i]);
        }
        html += `<div class="step-expression">` + K(`= ${details.join(' + ')} = ${ex.sommeProd}`) + `</div>`;
        html += '</div>';

        html += '<div class="step">';
        html += '<div class="step-number">3. Effectif total et moyenne</div>';
        html += `<div class="step-expression">` + K(`N = ${ex.effectifs.join(' + ')} = ${ex.totalEffectifs}`) + `</div>`;
        html += `<div class="step-expression">` + K(`\\bar{x} = \\frac{${ex.sommeProd}}{${ex.totalEffectifs}} = ${roundDec(ex.moyenne, 2)}`) + `</div>`;
        html += '</div>';

    } else {
        // Classes
        html += '<div class="step">';
        html += '<div class="step-number">2. Determiner les centres de classes</div>';
        let centresTeX = [];
        for (let i = 0; i < ex.classes.length; i++) {
            centresTeX.push(`\\frac{${ex.classes[i][0]} + ${ex.classes[i][1]}}{2} = ${ex.centres[i]}`);
        }
        for (let i = 0; i < centresTeX.length; i++) {
            html += `<div class="step-expression">` + K(`c_{${i + 1}} = ${centresTeX[i]}`) + `</div>`;
        }
        html += '</div>';

        html += '<div class="step">';
        html += '<div class="step-number">3. Calculer les produits</div>';
        let termes = [];
        let details = [];
        for (let i = 0; i < ex.centres.length; i++) {
            termes.push(`${ex.centres[i]} \\times ${ex.effectifs[i]}`);
            details.push(ex.centres[i] * ex.effectifs[i]);
        }
        html += `<div class="step-expression">` + K(`\\sum n_i \\cdot c_i = ${termes.join(' + ')}`) + `</div>`;
        html += `<div class="step-expression">` + K(`= ${details.join(' + ')} = ${ex.sommeProd}`) + `</div>`;
        html += '</div>';

        html += '<div class="step">';
        html += '<div class="step-number">4. Calculer la moyenne</div>';
        html += `<div class="step-expression">` + K(`N = ${ex.totalEffectifs}`) + `</div>`;
        html += `<div class="step-expression">` + K(`\\bar{x} = \\frac{${ex.sommeProd}}{${ex.totalEffectifs}} = ${roundDec(ex.moyenne, 2)}`) + `</div>`;
        html += '</div>';
    }

    html += '<div class="result-highlight">';
    html += `<div class="final">` + K(`\\bar{x} = ${roundDec(ex.moyenne, 2)}`) + `</div>`;
    html += '</div>';

    return html;
}

// --- Solution Mediane & Quartiles ---
function solveMediane() {
    const ex = StatsState.exercise;
    const sub = StatsState.subtype_mediane;
    let html = '';

    // Etape 1 : Ordonner
    html += '<div class="step">';
    html += '<div class="step-number">1. Ordonner la serie</div>';
    html += `<div class="step-expression">${ex.sorted.join(' ; ')}</div>`;
    html += `<div class="step-explanation">Serie rangee en ordre croissant (${ex.sorted.length} valeurs)</div>`;
    html += '</div>';

    if (sub === 'effectifs') {
        // Afficher effectifs cumules
        html += '<div class="step">';
        html += '<div class="step-number">2. Effectifs cumules croissants</div>';
        let tableHtml = `<table style="border-collapse: collapse; margin: 10px auto; text-align: center;">`;
        tableHtml += `<tr style="background: var(--gray-100);">`;
        tableHtml += tableCell('Valeur', { header: true });
        for (let i = 0; i < ex.valeurs.length; i++) {
            tableHtml += tableCell(ex.valeurs[i]);
        }
        tableHtml += `</tr><tr>`;
        tableHtml += tableCell('Effectif', { header: true });
        for (let i = 0; i < ex.effectifs.length; i++) {
            tableHtml += tableCell(ex.effectifs[i]);
        }
        tableHtml += `</tr><tr>`;
        tableHtml += tableCell('ECC', { header: true, bold: true });
        for (let i = 0; i < ex.cumules.length; i++) {
            tableHtml += tableCell(ex.cumules[i], { bold: true, color: 'var(--primary)' });
        }
        tableHtml += `</tr></table>`;
        html += tableHtml;
        html += `<div class="step-explanation">Effectif total : N = ${ex.totalEffectifs}</div>`;
        html += '</div>';
    }

    // Mediane
    const n = ex.sorted.length;
    html += '<div class="step">';
    html += '<div class="step-number">' + (sub === 'effectifs' ? '3' : '2') + '. Determiner la mediane</div>';
    if (n % 2 === 1) {
        const pos = Math.floor(n / 2) + 1;
        html += `<div class="step-expression">n = ${n} (impair), la mediane est la valeur de rang ` + K(`\\frac{${n} + 1}{2} = ${pos}`) + `</div>`;
        html += `<div class="step-expression">` + K(`Me = ${ex.mediane}`) + `</div>`;
    } else {
        const pos1 = n / 2;
        const pos2 = n / 2 + 1;
        html += `<div class="step-expression">n = ${n} (pair), la mediane est la moyenne des valeurs de rang ${pos1} et ${pos2}</div>`;
        html += `<div class="step-expression">` + K(`Me = \\frac{${ex.sorted[pos1 - 1]} + ${ex.sorted[pos2 - 1]}}{2} = ${ex.mediane}`) + `</div>`;
    }
    html += '</div>';

    // Quartiles
    html += '<div class="step">';
    html += '<div class="step-number">' + (sub === 'effectifs' ? '4' : '3') + '. Determiner les quartiles</div>';
    html += `<div class="step-explanation">On partage la serie ordonnee en deux moities autour de la mediane.</div>`;
    html += `<div class="step-expression">` + K(`Q_1 = ${ex.q1}`) + ` (mediane de la moitie inferieure)</div>`;
    html += `<div class="step-expression">` + K(`Q_3 = ${ex.q3}`) + ` (mediane de la moitie superieure)</div>`;
    html += '</div>';

    // EIQ
    html += '<div class="step">';
    html += '<div class="step-number">' + (sub === 'effectifs' ? '5' : '4') + '. Ecart interquartile</div>';
    html += `<div class="step-expression">` + K(`EIQ = Q_3 - Q_1 = ${ex.q3} - ${ex.q1} = ${ex.eiq}`) + `</div>`;
    html += `<div class="step-explanation">L'ecart interquartile mesure la dispersion des 50% centraux de la serie.</div>`;
    html += '</div>';

    html += '<div class="result-highlight">';
    html += `<div class="final">` + K(`Me = ${ex.mediane}`) + ` , ` + K(`Q_1 = ${ex.q1}`) + ` , ` + K(`Q_3 = ${ex.q3}`) + ` , ` + K(`EIQ = ${ex.eiq}`) + `</div>`;
    html += '</div>';

    return html;
}

// --- Solution Variance & Ecart-type ---
function solveDispersion() {
    const ex = StatsState.exercise;
    const sub = StatsState.subtype_dispersion;
    let html = '';

    // Etape 1 : Moyenne
    html += '<div class="step">';
    html += '<div class="step-number">1. Calculer la moyenne</div>';
    if (sub === 'simple') {
        html += `<div class="step-expression">` + K(`\\bar{x} = \\frac{${ex.valeurs.join(' + ')}}{${ex.n}} = \\frac{${ex.valeurs.reduce((s, v) => s + v, 0)}}{${ex.n}} = ${roundDec(ex.moyenne, 4)}`) + `</div>`;
    } else {
        let sommeProd = 0;
        let termes = [];
        for (let i = 0; i < ex.valeurs.length; i++) {
            termes.push(`${ex.valeurs[i]} \\times ${ex.effectifs[i]}`);
            sommeProd += ex.valeurs[i] * ex.effectifs[i];
        }
        html += `<div class="step-expression">` + K(`\\bar{x} = \\frac{${termes.join(' + ')}}{${ex.totalEffectifs}} = \\frac{${sommeProd}}{${ex.totalEffectifs}} = ${roundDec(ex.moyenne, 4)}`) + `</div>`;
    }
    html += '</div>';

    // Etape 2 : Formule variance
    html += '<div class="step">';
    html += '<div class="step-number">2. Rappeler la formule de la variance</div>';
    if (sub === 'simple') {
        html += `<div class="step-expression">` + K(`V(X) = \\frac{1}{n} \\sum_{i=1}^{n} (x_i - \\bar{x})^2`) + `</div>`;
    } else {
        html += `<div class="step-expression">` + K(`V(X) = \\frac{1}{N} \\sum n_i (x_i - \\bar{x})^2`) + `</div>`;
    }
    html += '</div>';

    // Etape 3 : Calcul des ecarts
    html += '<div class="step">';
    html += '<div class="step-number">3. Calculer les ecarts au carre</div>';

    if (sub === 'simple') {
        let termes = [];
        let sommeCarres = 0;
        for (let i = 0; i < ex.n; i++) {
            const ecart = roundDec(ex.valeurs[i] - ex.moyenne, 4);
            const carre = roundDec(ecart * ecart, 4);
            termes.push(`(${ex.valeurs[i]} - ${roundDec(ex.moyenne, 2)})^2`);
            sommeCarres += carre;
        }
        html += `<div class="step-expression">` + K(`\\sum (x_i - \\bar{x})^2 = ${termes.join(' + ')}`) + `</div>`;

        // Afficher chaque valeur
        let valsCarres = [];
        for (let i = 0; i < ex.n; i++) {
            valsCarres.push(roundDec(Math.pow(ex.valeurs[i] - ex.moyenne, 2), 4));
        }
        html += `<div class="step-expression">` + K(`= ${valsCarres.join(' + ')}`) + `</div>`;
        html += `<div class="step-expression">` + K(`= ${roundDec(valsCarres.reduce((s, v) => s + v, 0), 4)}`) + `</div>`;

    } else {
        let tableHtml = `<table style="border-collapse: collapse; margin: 10px auto; text-align: center;">`;
        tableHtml += `<tr style="background: var(--gray-100);">`;
        tableHtml += tableCell(K('x_i'), { header: true });
        tableHtml += tableCell(K('n_i'), { header: true });
        tableHtml += tableCell(K('x_i - \\bar{x}'), { header: true });
        tableHtml += tableCell(K('(x_i - \\bar{x})^2'), { header: true });
        tableHtml += tableCell(K('n_i(x_i - \\bar{x})^2'), { header: true });
        tableHtml += `</tr>`;

        let somme = 0;
        for (let i = 0; i < ex.valeurs.length; i++) {
            const ecart = roundDec(ex.valeurs[i] - ex.moyenne, 4);
            const carre = roundDec(ecart * ecart, 4);
            const prod = roundDec(ex.effectifs[i] * carre, 4);
            somme += prod;
            tableHtml += `<tr>`;
            tableHtml += tableCell(ex.valeurs[i]);
            tableHtml += tableCell(ex.effectifs[i]);
            tableHtml += tableCell(roundDec(ecart, 2));
            tableHtml += tableCell(roundDec(carre, 2));
            tableHtml += tableCell(roundDec(prod, 2));
            tableHtml += `</tr>`;
        }
        tableHtml += `<tr style="background: var(--gray-100);">`;
        tableHtml += tableCell('Total', { bold: true });
        tableHtml += tableCell(ex.totalEffectifs, { bold: true });
        tableHtml += tableCell('');
        tableHtml += tableCell('');
        tableHtml += tableCell(roundDec(somme, 2), { bold: true, color: 'var(--primary)' });
        tableHtml += `</tr>`;
        tableHtml += `</table>`;
        html += tableHtml;
    }
    html += '</div>';

    // Etape 4 : Variance
    html += '<div class="step">';
    html += '<div class="step-number">4. Variance et ecart-type</div>';
    html += `<div class="step-expression">` + K(`V(X) = ${roundDec(ex.variance, 4)}`) + `</div>`;
    html += `<div class="step-expression">` + K(`\\sigma(X) = \\sqrt{V(X)} = \\sqrt{${roundDec(ex.variance, 4)}} \\approx ${roundDec(ex.ecartType, 4)}`) + `</div>`;
    html += '</div>';

    html += '<div class="result-highlight">';
    html += `<div class="final">` + K(`V(X) \\approx ${roundDec(ex.variance, 2)}`) + ` , ` + K(`\\sigma(X) \\approx ${roundDec(ex.ecartType, 2)}`) + `</div>`;
    html += '</div>';

    return html;
}

// --- Solution Diagramme en boite ---
function solveBoite() {
    const ex = StatsState.exercise;
    const sub = StatsState.subtype_boite;
    let html = '';

    if (sub === 'construire') {
        // Etape 1 : Ordonner
        html += '<div class="step">';
        html += '<div class="step-number">1. Ordonner la serie</div>';
        html += `<div class="step-expression">${ex.sorted.join(' ; ')}</div>`;
        html += `<div class="step-explanation">${ex.n} valeurs rangees en ordre croissant</div>`;
        html += '</div>';

        // Etape 2 : Les 5 indicateurs
        html += '<div class="step">';
        html += '<div class="step-number">2. Determiner les 5 indicateurs</div>';
        html += `<div class="step-expression">` + K(`\\text{Min} = ${ex.min}`) + `</div>`;

        // Q1
        const q = computeQuartiles(ex.sorted);
        html += `<div class="step-expression">` + K(`Q_1 = ${ex.q1}`) + ` (mediane de la moitie inferieure)</div>`;

        // Mediane
        const n = ex.sorted.length;
        if (n % 2 === 1) {
            html += `<div class="step-expression">` + K(`Me = ${ex.mediane}`) + ` (valeur centrale, rang ${Math.floor(n / 2) + 1})</div>`;
        } else {
            html += `<div class="step-expression">` + K(`Me = ${ex.mediane}`) + ` (moyenne des rangs ${n / 2} et ${n / 2 + 1})</div>`;
        }

        html += `<div class="step-expression">` + K(`Q_3 = ${ex.q3}`) + ` (mediane de la moitie superieure)</div>`;
        html += `<div class="step-expression">` + K(`\\text{Max} = ${ex.max}`) + `</div>`;
        html += '</div>';

        // Etape 3 : Diagramme
        html += '<div class="step">';
        html += '<div class="step-number">3. Diagramme en boite</div>';
        html += drawBoxPlot(ex.min, ex.q1, ex.mediane, ex.q3, ex.max);
        html += '</div>';

        // Resume
        html += '<div class="step">';
        html += '<div class="step-number">4. Resume</div>';
        html += `<div class="step-expression">Etendue : ` + K(`${ex.max} - ${ex.min} = ${ex.max - ex.min}`) + `</div>`;
        html += `<div class="step-expression">Ecart interquartile : ` + K(`Q_3 - Q_1 = ${ex.q3} - ${ex.q1} = ${ex.q3 - ex.q1}`) + `</div>`;
        html += '</div>';

        html += '<div class="result-highlight">';
        html += `<div class="final">Min = ${ex.min} , ` + K(`Q_1 = ${ex.q1}`) + ` , Me = ${ex.mediane} , ` + K(`Q_3 = ${ex.q3}`) + ` , Max = ${ex.max}</div>`;
        html += '</div>';

    } else {
        // Lire un diagramme
        html += '<div class="step">';
        html += '<div class="step-number">1. Lire les 5 indicateurs sur le diagramme</div>';
        html += `<div class="step-expression">` + K(`\\text{Min} = ${ex.min}`) + ` (extremite gauche de la moustache)</div>`;
        html += `<div class="step-expression">` + K(`Q_1 = ${ex.q1}`) + ` (bord gauche de la boite)</div>`;
        html += `<div class="step-expression">` + K(`Me = ${ex.mediane}`) + ` (trait vertical rouge dans la boite)</div>`;
        html += `<div class="step-expression">` + K(`Q_3 = ${ex.q3}`) + ` (bord droit de la boite)</div>`;
        html += `<div class="step-expression">` + K(`\\text{Max} = ${ex.max}`) + ` (extremite droite de la moustache)</div>`;
        html += '</div>';

        html += '<div class="step">';
        html += '<div class="step-number">2. Calculer les indicateurs de dispersion</div>';
        html += `<div class="step-expression">Etendue : ` + K(`${ex.max} - ${ex.min} = ${ex.etendue}`) + `</div>`;
        html += `<div class="step-expression">Ecart interquartile : ` + K(`Q_3 - Q_1 = ${ex.q3} - ${ex.q1} = ${ex.eiq}`) + `</div>`;
        html += '</div>';

        html += '<div class="step">';
        html += '<div class="step-number">3. Interpretation</div>';
        html += `<div class="step-explanation">50% des valeurs se situent entre ${ex.q1} et ${ex.q3}.</div>`;
        html += `<div class="step-explanation">La mediane partage la serie en deux groupes de meme effectif.</div>`;
        html += '</div>';

        html += '<div class="result-highlight">';
        html += `<div class="final">Min = ${ex.min} , ` + K(`Q_1 = ${ex.q1}`) + ` , Me = ${ex.mediane} , ` + K(`Q_3 = ${ex.q3}`) + ` , Max = ${ex.max}<br>` +
            `Etendue = ${ex.etendue} , EIQ = ${ex.eiq}</div>`;
        html += '</div>';
    }

    return html;
}

// --- Solution Regression lineaire ---
function solveRegression() {
    const ex = StatsState.exercise;
    const sub = StatsState.subtype_regression;
    let html = '';

    // Etape 1 : Moyennes
    html += '<div class="step">';
    html += '<div class="step-number">1. Calculer les moyennes</div>';
    html += `<div class="step-expression">` + K(`\\bar{x} = \\frac{${ex.xs.join(' + ')}}{${ex.n}} = ${roundDec(ex.xBar, 4)}`) + `</div>`;
    html += `<div class="step-expression">` + K(`\\bar{y} = \\frac{${ex.ys.join(' + ')}}{${ex.n}} = ${roundDec(ex.yBar, 4)}`) + `</div>`;
    html += '</div>';

    // Etape 2 : Tableau de calcul
    html += '<div class="step">';
    html += '<div class="step-number">2. Tableau des ecarts</div>';

    let tableHtml = `<table style="border-collapse: collapse; margin: 10px auto; text-align: center; font-size: 0.9em;">`;
    tableHtml += `<tr style="background: var(--gray-100);">`;
    tableHtml += tableCell(K('x_i'), { header: true });
    tableHtml += tableCell(K('y_i'), { header: true });
    tableHtml += tableCell(K('x_i - \\bar{x}'), { header: true });
    tableHtml += tableCell(K('y_i - \\bar{y}'), { header: true });
    tableHtml += tableCell(K('(x_i-\\bar{x})(y_i-\\bar{y})'), { header: true });
    tableHtml += tableCell(K('(x_i-\\bar{x})^2'), { header: true });
    tableHtml += `</tr>`;

    let sumXY = 0, sumX2 = 0, sumY2 = 0;
    for (let i = 0; i < ex.n; i++) {
        const dx = roundDec(ex.xs[i] - ex.xBar, 4);
        const dy = roundDec(ex.ys[i] - ex.yBar, 4);
        const dxy = roundDec(dx * dy, 4);
        const dx2 = roundDec(dx * dx, 4);
        sumXY += dxy;
        sumX2 += dx2;
        sumY2 += roundDec(dy * dy, 4);
        tableHtml += `<tr>`;
        tableHtml += tableCell(ex.xs[i]);
        tableHtml += tableCell(ex.ys[i]);
        tableHtml += tableCell(roundDec(dx, 2));
        tableHtml += tableCell(roundDec(dy, 2));
        tableHtml += tableCell(roundDec(dxy, 2));
        tableHtml += tableCell(roundDec(dx2, 2));
        tableHtml += `</tr>`;
    }
    tableHtml += `<tr style="background: var(--gray-100);">`;
    tableHtml += tableCell('', { bold: true });
    tableHtml += tableCell('', { bold: true });
    tableHtml += tableCell('', { bold: true });
    tableHtml += tableCell('Somme', { bold: true });
    tableHtml += tableCell(roundDec(sumXY, 2), { bold: true, color: 'var(--primary)' });
    tableHtml += tableCell(roundDec(sumX2, 2), { bold: true, color: 'var(--primary)' });
    tableHtml += `</tr>`;
    tableHtml += `</table>`;
    html += tableHtml;
    html += '</div>';

    // Etape 3 : Covariance et Variance
    html += '<div class="step">';
    html += '<div class="step-number">3. Covariance et variance</div>';
    html += `<div class="step-expression">` + K(`\\text{Cov}(X,Y) = \\frac{1}{n} \\sum (x_i - \\bar{x})(y_i - \\bar{y}) = \\frac{${roundDec(sumXY, 2)}}{${ex.n}} = ${roundDec(ex.covXY, 4)}`) + `</div>`;
    html += `<div class="step-expression">` + K(`V(X) = \\frac{1}{n} \\sum (x_i - \\bar{x})^2 = \\frac{${roundDec(sumX2, 2)}}{${ex.n}} = ${roundDec(ex.varX, 4)}`) + `</div>`;
    html += '</div>';

    if (sub === 'equation') {
        // Etape 4 : Coefficient directeur
        html += '<div class="step">';
        html += '<div class="step-number">4. Coefficient directeur</div>';
        html += `<div class="step-expression">` + K(`a = \\frac{\\text{Cov}(X,Y)}{V(X)} = \\frac{${roundDec(ex.covXY, 4)}}{${roundDec(ex.varX, 4)}} \\approx ${roundDec(ex.a, 4)}`) + `</div>`;
        html += '</div>';

        // Etape 5 : Ordonnee a l'origine
        html += '<div class="step">';
        html += '<div class="step-number">5. Ordonnee a l\'origine</div>';
        html += `<div class="step-expression">` + K(`b = \\bar{y} - a \\cdot \\bar{x} = ${roundDec(ex.yBar, 4)} - ${roundDec(ex.a, 4)} \\times ${roundDec(ex.xBar, 4)} \\approx ${roundDec(ex.b, 4)}`) + `</div>`;
        html += '</div>';

        // Graphique
        html += '<div class="step">';
        html += '<div class="step-number">6. Representation graphique</div>';
        html += drawScatterPlot(ex.xs, ex.ys, ex.a, ex.b);
        html += '</div>';

        const signB = ex.b >= 0 ? '+' : '-';
        html += '<div class="result-highlight">';
        html += `<div class="final">` + K(`y = ${roundDec(ex.a, 2)}x ${signB} ${roundDec(Math.abs(ex.b), 2)}`) + `</div>`;
        html += '</div>';

    } else {
        // Coefficient de correlation
        html += '<div class="step">';
        html += '<div class="step-number">4. Ecarts-types</div>';
        html += `<div class="step-expression">` + K(`\\sigma_X = \\sqrt{V(X)} = \\sqrt{${roundDec(ex.varX, 4)}} \\approx ${roundDec(Math.sqrt(ex.varX), 4)}`) + `</div>`;
        html += `<div class="step-expression">` + K(`\\sigma_Y = \\sqrt{V(Y)} \\approx ${roundDec(Math.sqrt(ex.varY), 4)}`) + `</div>`;
        html += '</div>';

        html += '<div class="step">';
        html += '<div class="step-number">5. Coefficient de correlation</div>';
        html += `<div class="step-expression">` + K(`r = \\frac{\\text{Cov}(X,Y)}{\\sigma_X \\cdot \\sigma_Y} = \\frac{${roundDec(ex.covXY, 4)}}{${roundDec(Math.sqrt(ex.varX), 4)} \\times ${roundDec(Math.sqrt(ex.varY), 4)}}`) + `</div>`;
        html += `<div class="step-expression">` + K(`r \\approx ${roundDec(ex.r, 4)}`) + `</div>`;
        html += '</div>';

        html += '<div class="step">';
        html += '<div class="step-number">6. Interpretation</div>';
        const absR = Math.abs(ex.r);
        let interpretation;
        if (absR >= 0.9) {
            interpretation = 'La correlation lineaire est <strong>tres forte</strong>.';
        } else if (absR >= 0.7) {
            interpretation = 'La correlation lineaire est <strong>forte</strong>.';
        } else if (absR >= 0.5) {
            interpretation = 'La correlation lineaire est <strong>moderee</strong>.';
        } else {
            interpretation = 'La correlation lineaire est <strong>faible</strong>.';
        }
        html += `<div class="step-explanation">` + K(`|r| = ${roundDec(absR, 4)}`) + `</div>`;
        html += `<div class="step-explanation">${interpretation}</div>`;
        if (ex.r > 0) {
            html += `<div class="step-explanation">La correlation est positive : quand x augmente, y tend a augmenter.</div>`;
        } else {
            html += `<div class="step-explanation">La correlation est negative : quand x augmente, y tend a diminuer.</div>`;
        }

        // Graphique
        html += drawScatterPlot(ex.xs, ex.ys, ex.a, ex.b);
        html += '</div>';

        html += '<div class="result-highlight">';
        html += `<div class="final">` + K(`r \\approx ${roundDec(ex.r, 4)}`) + ` - ${interpretation}</div>`;
        html += '</div>';
    }

    return html;
}

// ========================================
// Initialisation au chargement
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    initStatistiquesPage();
});
