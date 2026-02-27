/* ========================================
   FONCTIONS-REFERENCE.JS - Fonctions de reference (2nde)
   Carree, inverse, racine, cube, valeur absolue
   ======================================== */

const FonctionsReferenceState = {
    currentType: 'carree',
    subType: 'image', // image, antecedent, comparaison
    x: 3,       // valeur pour image
    y: 9,       // valeur pour antecedent
    compA: -3,  // premiere valeur pour comparaison
    compB: 2,   // seconde valeur pour comparaison
};

/* ---- Helpers ---- */

function frK(tex) {
    return katex.renderToString(tex, { throwOnError: false });
}

function frRandInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function frPick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function frFormatNum(n) {
    if (Number.isInteger(n)) return n.toString();
    return (Math.round(n * 1000) / 1000).toString();
}

function frGcd(a, b) {
    a = Math.abs(a); b = Math.abs(b);
    while (b) { [a, b] = [b, a % b]; }
    return a;
}

function frFracTeX(num, den) {
    if (den === 0) return '?';
    const g = frGcd(Math.abs(num), Math.abs(den));
    let n = num / g, d = den / g;
    if (d < 0) { n = -n; d = -d; }
    if (d === 1) return n.toString();
    return `\\dfrac{${n}}{${d}}`;
}

/* ---- Infos sur les fonctions de reference ---- */

const FUNC_INFO = {
    carree: {
        name: 'carr\u00e9e',
        latex: 'f(x) = x^2',
        domain: '\\mathbb{R}',
        parity: 'paire',
        parityExpl: 'f(\u2212x) = (\u2212x)^2 = x^2 = f(x)',
        variations: 'd\u00e9croissante sur ]\u2212\\infty\\,;\\,0] et croissante sur [0\\,;\\,+\\infty[',
        graphOpts: { xMin: -5, xMax: 5, yMin: -1, yMax: 10 },
        func: x => x * x,
        color: '#e74c3c',
    },
    inverse: {
        name: 'inverse',
        latex: 'f(x) = \\dfrac{1}{x}',
        domain: '\\mathbb{R} \\setminus \\{0\\}',
        parity: 'impaire',
        parityExpl: 'f(\u2212x) = \\dfrac{1}{\u2212x} = \u2212\\dfrac{1}{x} = \u2212f(x)',
        variations: 'd\u00e9croissante sur ]\u2212\\infty\\,;\\,0[ et d\u00e9croissante sur ]0\\,;\\,+\\infty[',
        graphOpts: { xMin: -5, xMax: 5, yMin: -5, yMax: 5 },
        func: x => (x === 0 ? NaN : 1 / x),
        color: '#3498db',
    },
    racine: {
        name: 'racine carr\u00e9e',
        latex: 'f(x) = \\sqrt{x}',
        domain: '[0\\,;\\,+\\infty[',
        parity: 'ni paire ni impaire',
        parityExpl: 'D\u00e9finie uniquement sur [0\\,;\\,+\\infty[',
        variations: 'croissante sur [0\\,;\\,+\\infty[',
        graphOpts: { xMin: -1, xMax: 10, yMin: -1, yMax: 5 },
        func: x => (x < 0 ? NaN : Math.sqrt(x)),
        color: '#27ae60',
    },
    cube: {
        name: 'cube',
        latex: 'f(x) = x^3',
        domain: '\\mathbb{R}',
        parity: 'impaire',
        parityExpl: 'f(\u2212x) = (\u2212x)^3 = \u2212x^3 = \u2212f(x)',
        variations: 'croissante sur \\mathbb{R}',
        graphOpts: { xMin: -3, xMax: 3, yMin: -8, yMax: 8 },
        func: x => x * x * x,
        color: '#9b59b6',
    },
    'valeur-absolue': {
        name: 'valeur absolue',
        latex: 'f(x) = |x|',
        domain: '\\mathbb{R}',
        parity: 'paire',
        parityExpl: 'f(\u2212x) = |\u2212x| = |x| = f(x)',
        variations: 'd\u00e9croissante sur ]\u2212\\infty\\,;\\,0] et croissante sur [0\\,;\\,+\\infty[',
        graphOpts: { xMin: -5, xMax: 5, yMin: -1, yMax: 5 },
        func: x => Math.abs(x),
        color: '#e67e22',
    },
};

/* ========================================
   INITIALISATION
   ======================================== */

function initFonctionsReferencePage() {
    document.querySelectorAll('.type-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            FonctionsReferenceState.currentType = btn.dataset.type;
            generateFR();
            updateFRDisplay();
            hideSolution('solutionDiv');
        });
    });

    $('generateBtn').addEventListener('click', () => {
        generateFR();
        updateFRDisplay();
        hideSolution('solutionDiv');
    });

    $('solveBtn').addEventListener('click', solveFR);

    generateFR();
    updateFRDisplay();
}

/* ========================================
   GENERATION
   ======================================== */

function generateFR() {
    const st = FonctionsReferenceState;
    st.subType = frPick(['image', 'antecedent', 'comparaison']);

    switch (st.currentType) {
        case 'carree': generateFRCarree(); break;
        case 'inverse': generateFRInverse(); break;
        case 'racine': generateFRRacine(); break;
        case 'cube': generateFRCube(); break;
        case 'valeur-absolue': generateFRAbsolue(); break;
    }
}

function generateFRCarree() {
    const st = FonctionsReferenceState;
    switch (st.subType) {
        case 'image':
            st.x = frRandInt(-8, 8);
            while (st.x === 0 || st.x === 1 || st.x === -1) st.x = frRandInt(-8, 8);
            break;
        case 'antecedent':
            st.y = frPick([0, 1, 4, 9, 16, 25]);
            break;
        case 'comparaison': {
            const mode = frPick(['both_pos', 'both_neg', 'mixed']);
            if (mode === 'both_pos') {
                st.compA = frRandInt(1, 6);
                st.compB = frRandInt(1, 6);
                while (st.compB === st.compA) st.compB = frRandInt(1, 6);
            } else if (mode === 'both_neg') {
                st.compA = frRandInt(-6, -1);
                st.compB = frRandInt(-6, -1);
                while (st.compB === st.compA) st.compB = frRandInt(-6, -1);
            } else {
                st.compA = frRandInt(-6, -1);
                st.compB = frRandInt(1, 6);
            }
            break;
        }
    }
}

function generateFRInverse() {
    const st = FonctionsReferenceState;
    switch (st.subType) {
        case 'image':
            st.x = frPick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
            break;
        case 'antecedent':
            st.y = frPick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
            break;
        case 'comparaison': {
            // Meme signe pour utiliser la monotonie
            const sign = frPick([-1, 1]);
            st.compA = sign * frRandInt(1, 6);
            st.compB = sign * frRandInt(1, 6);
            while (st.compB === st.compA) st.compB = sign * frRandInt(1, 6);
            break;
        }
    }
}

function generateFRRacine() {
    const st = FonctionsReferenceState;
    switch (st.subType) {
        case 'image':
            st.x = frPick([0, 1, 4, 9, 16, 25, 36, 49]);
            break;
        case 'antecedent':
            st.y = frRandInt(0, 7);
            break;
        case 'comparaison':
            st.compA = frRandInt(0, 10);
            st.compB = frRandInt(0, 10);
            while (st.compB === st.compA) st.compB = frRandInt(0, 10);
            break;
    }
}

function generateFRCube() {
    const st = FonctionsReferenceState;
    switch (st.subType) {
        case 'image':
            st.x = frRandInt(-4, 4);
            while (st.x === 0 || st.x === 1 || st.x === -1) st.x = frRandInt(-4, 4);
            break;
        case 'antecedent':
            st.y = frPick([-27, -8, -1, 0, 1, 8, 27]);
            break;
        case 'comparaison':
            st.compA = frRandInt(-5, 5);
            st.compB = frRandInt(-5, 5);
            while (st.compB === st.compA) st.compB = frRandInt(-5, 5);
            break;
    }
}

function generateFRAbsolue() {
    const st = FonctionsReferenceState;
    switch (st.subType) {
        case 'image':
            st.x = frRandInt(-8, 8);
            while (st.x === 0) st.x = frRandInt(-8, 8);
            break;
        case 'antecedent':
            st.y = frPick([-2, 0, 1, 3, 5, 7]);
            break;
        case 'comparaison': {
            st.compA = frRandInt(-6, 6);
            st.compB = frRandInt(-6, 6);
            while (st.compB === st.compA || Math.abs(st.compA) === Math.abs(st.compB))
                st.compB = frRandInt(-6, 6);
            break;
        }
    }
}

/* ========================================
   AFFICHAGE
   ======================================== */

function updateFRDisplay() {
    const st = FonctionsReferenceState;
    const info = FUNC_INFO[st.currentType];
    let display = '';

    display += `Soit <em>f</em> la <strong>fonction ${info.name}</strong> d\u00e9finie par ${frK(info.latex)}.<br><br>`;

    switch (st.subType) {
        case 'image':
            display += `<strong>Calculer ${frK(`f(${st.x})`)}.</strong>`;
            break;
        case 'antecedent':
            display += `<strong>R\u00e9soudre ${frK(`f(x) = ${st.y}`)}.</strong>`;
            break;
        case 'comparaison':
            display += `<strong>Sans calculer, comparer ${frK(`f(${st.compA})`)} et ${frK(`f(${st.compB})`)}.</strong>`;
            break;
    }

    $('exerciseDisplay').innerHTML = display;
}

/* ========================================
   RESOLUTION
   ======================================== */

function solveFR() {
    const st = FonctionsReferenceState;
    let html = '<h3>Solution</h3>';

    // Rappel des proprietes
    html += buildFRProperties();

    // Resolution selon sous-type
    switch (st.subType) {
        case 'image': html += solveFRImage(); break;
        case 'antecedent': html += solveFRAntecedent(); break;
        case 'comparaison': html += solveFRComparaison(); break;
    }

    // Graphique
    html += '<div class="step">';
    html += '<div class="step-number">Repr\u00e9sentation graphique</div>';
    html += '<div style="text-align:center;">';
    html += '<canvas id="frCanvas" width="500" height="350" style="max-width:100%;"></canvas>';
    html += '</div>';
    html += '</div>';

    $('solutionDiv').innerHTML = html;
    showSolution('solutionDiv');

    requestAnimationFrame(() => drawFRGraph());
}

function buildFRProperties() {
    const info = FUNC_INFO[FonctionsReferenceState.currentType];
    let html = '<div class="step">';
    html += '<div class="step-number">Propri\u00e9t\u00e9s de la fonction ' + info.name + '</div>';
    html += '<div class="step-expression">Ensemble de d\u00e9finition : ' + frK(`D_f = ${info.domain}`) + '</div>';
    html += '<div class="step-expression">Parit\u00e9 : fonction ' + info.parity + '</div>';
    html += '<div class="step-expression">Variations : ' + info.variations + '</div>';
    html += '</div>';
    return html;
}

/* ---- Image ---- */

function solveFRImage() {
    const st = FonctionsReferenceState;
    const info = FUNC_INFO[st.currentType];
    const x = st.x;
    let html = '';

    html += '<div class="step">';
    html += '<div class="step-number">Calcul de l\'image</div>';

    switch (st.currentType) {
        case 'carree':
            html += '<div class="step-expression">' + frK(`f(${x}) = (${x})^2 = ${x * x}`) + '</div>';
            break;
        case 'inverse':
            html += '<div class="step-expression">' + frK(`f(${x}) = \\dfrac{1}{${x}} = ${frFracTeX(1, x)}`) + '</div>';
            break;
        case 'racine':
            html += '<div class="step-expression">' + frK(`f(${x}) = \\sqrt{${x}} = ${frFormatNum(Math.sqrt(x))}`) + '</div>';
            break;
        case 'cube':
            html += '<div class="step-expression">' + frK(`f(${x}) = (${x})^3 = ${x * x * x}`) + '</div>';
            break;
        case 'valeur-absolue':
            html += '<div class="step-expression">' + frK(`f(${x}) = |${x}| = ${Math.abs(x)}`) + '</div>';
            if (x < 0) {
                html += '<div class="step-explanation">Comme ' + x + ' < 0, |' + x + '| = \u2212(' + x + ') = ' + Math.abs(x) + '</div>';
            } else {
                html += '<div class="step-explanation">Comme ' + x + ' > 0, |' + x + '| = ' + x + '</div>';
            }
            break;
    }
    html += '</div>';

    const result = info.func(x);
    html += '<div class="result-highlight">';
    html += '<div class="final">' + frK(`f(${x}) = ${frFormatNum(result)}`) + '</div>';
    html += '</div>';

    return html;
}

/* ---- Antecedent ---- */

function solveFRAntecedent() {
    const st = FonctionsReferenceState;
    const y = st.y;
    let html = '';

    html += '<div class="step">';
    html += '<div class="step-number">R\u00e9solution</div>';

    switch (st.currentType) {
        case 'carree': {
            html += '<div class="step-expression">' + frK(`x^2 = ${y}`) + '</div>';
            if (y < 0) {
                html += '<div class="step-explanation">Un carr\u00e9 est toujours positif ou nul, donc pas de solution.</div>';
                html += '</div>';
                html += '<div class="result-highlight"><div class="final">Pas de solution.</div></div>';
            } else if (y === 0) {
                html += '<div class="step-explanation">' + frK(`x^2 = 0 \\iff x = 0`) + '</div>';
                html += '</div>';
                html += '<div class="result-highlight"><div class="final">' + frK('x = 0') + '</div></div>';
            } else {
                const sqr = Math.sqrt(y);
                html += '<div class="step-expression">' + frK(`x = \\sqrt{${y}} = ${frFormatNum(sqr)}`) + ' ou ' + frK(`x = -\\sqrt{${y}} = ${frFormatNum(-sqr)}`) + '</div>';
                html += '</div>';
                html += '<div class="result-highlight"><div class="final">' + frK(`x = ${frFormatNum(sqr)}`) + ' ou ' + frK(`x = ${frFormatNum(-sqr)}`) + '</div></div>';
            }
            break;
        }

        case 'inverse': {
            html += '<div class="step-expression">' + frK(`\\dfrac{1}{x} = ${y}`) + '</div>';
            if (y === 0) {
                html += '<div class="step-explanation">' + frK(`\\dfrac{1}{x}`) + ' ne peut jamais valoir 0, donc pas de solution.</div>';
                html += '</div>';
                html += '<div class="result-highlight"><div class="final">Pas de solution.</div></div>';
            } else {
                html += '<div class="step-expression">' + frK(`x = \\dfrac{1}{${y}} = ${frFracTeX(1, y)}`) + '</div>';
                html += '</div>';
                html += '<div class="result-highlight"><div class="final">' + frK(`x = ${frFracTeX(1, y)}`) + '</div></div>';
            }
            break;
        }

        case 'racine': {
            html += '<div class="step-expression">' + frK(`\\sqrt{x} = ${y}`) + '</div>';
            if (y < 0) {
                html += '<div class="step-explanation">Une racine carr\u00e9e est toujours positive, donc pas de solution.</div>';
                html += '</div>';
                html += '<div class="result-highlight"><div class="final">Pas de solution.</div></div>';
            } else {
                const sol = y * y;
                html += '<div class="step-explanation">On \u00e9l\u00e8ve au carr\u00e9 les deux membres (les deux sont positifs).</div>';
                html += '<div class="step-expression">' + frK(`x = ${y}^2 = ${sol}`) + '</div>';
                html += '</div>';
                html += '<div class="result-highlight"><div class="final">' + frK(`x = ${sol}`) + '</div></div>';
            }
            break;
        }

        case 'cube': {
            html += '<div class="step-expression">' + frK(`x^3 = ${y}`) + '</div>';
            const cbrt = Math.cbrt(y);
            if (Number.isInteger(cbrt)) {
                html += '<div class="step-expression">' + frK(`x = \\sqrt[3]{${y}} = ${cbrt}`) + '</div>';
                html += '</div>';
                html += '<div class="result-highlight"><div class="final">' + frK(`x = ${cbrt}`) + '</div></div>';
            } else {
                html += '<div class="step-expression">' + frK(`x = \\sqrt[3]{${y}} \\approx ${frFormatNum(cbrt)}`) + '</div>';
                html += '</div>';
                html += '<div class="result-highlight"><div class="final">' + frK(`x = \\sqrt[3]{${y}}`) + '</div></div>';
            }
            break;
        }

        case 'valeur-absolue': {
            html += '<div class="step-expression">' + frK(`|x| = ${y}`) + '</div>';
            if (y < 0) {
                html += '<div class="step-explanation">La valeur absolue est toujours positive, donc pas de solution.</div>';
                html += '</div>';
                html += '<div class="result-highlight"><div class="final">Pas de solution.</div></div>';
            } else if (y === 0) {
                html += '<div class="step-expression">' + frK(`|x| = 0 \\iff x = 0`) + '</div>';
                html += '</div>';
                html += '<div class="result-highlight"><div class="final">' + frK('x = 0') + '</div></div>';
            } else {
                html += '<div class="step-expression">' + frK(`|x| = ${y} \\iff x = ${y}`) + ' ou ' + frK(`x = ${-y}`) + '</div>';
                html += '</div>';
                html += '<div class="result-highlight"><div class="final">' + frK(`x = ${y}`) + ' ou ' + frK(`x = ${-y}`) + '</div></div>';
            }
            break;
        }
    }

    return html;
}

/* ---- Comparaison ---- */

function solveFRComparaison() {
    const st = FonctionsReferenceState;
    const a = st.compA, b = st.compB;
    const info = FUNC_INFO[st.currentType];
    const fa = info.func(a), fb = info.func(b);
    let html = '';

    html += '<div class="step">';
    html += '<div class="step-number">Raisonnement par monotonie</div>';

    switch (st.currentType) {
        case 'carree': {
            if (a >= 0 && b >= 0) {
                html += '<div class="step-explanation">' + a + ' et ' + b + ' sont positifs. La fonction carr\u00e9e est croissante sur [0 ; +\u221e[.</div>';
                if (a < b) html += '<div class="step-expression">' + frK(`${a} < ${b} \\implies f(${a}) < f(${b})`) + '</div>';
                else html += '<div class="step-expression">' + frK(`${a} > ${b} \\implies f(${a}) > f(${b})`) + '</div>';
            } else if (a <= 0 && b <= 0) {
                html += '<div class="step-explanation">' + a + ' et ' + b + ' sont n\u00e9gatifs. La fonction carr\u00e9e est d\u00e9croissante sur ]\u2212\u221e ; 0].</div>';
                if (a < b) html += '<div class="step-expression">' + frK(`${a} < ${b} \\implies f(${a}) > f(${b})`) + '</div>';
                else html += '<div class="step-expression">' + frK(`${a} > ${b} \\implies f(${a}) < f(${b})`) + '</div>';
            } else {
                html += '<div class="step-explanation">Les nombres sont de signes diff\u00e9rents. On compare leurs valeurs absolues : |' + a + '| = ' + Math.abs(a) + ' et |' + b + '| = ' + Math.abs(b) + '.</div>';
                html += '<div class="step-explanation">Pour la fonction carr\u00e9e, f(a) = a\u00b2, donc f(a) d\u00e9pend uniquement de |a|.</div>';
                if (Math.abs(a) > Math.abs(b)) {
                    html += '<div class="step-expression">' + frK(`|${a}| > |${b}| \\implies f(${a}) > f(${b})`) + '</div>';
                } else {
                    html += '<div class="step-expression">' + frK(`|${a}| < |${b}| \\implies f(${a}) < f(${b})`) + '</div>';
                }
            }
            break;
        }

        case 'inverse': {
            if (a > 0 && b > 0) {
                html += '<div class="step-explanation">' + a + ' et ' + b + ' sont positifs. La fonction inverse est d\u00e9croissante sur ]0 ; +\u221e[.</div>';
                if (a < b) html += '<div class="step-expression">' + frK(`${a} < ${b} \\implies f(${a}) > f(${b})`) + '</div>';
                else html += '<div class="step-expression">' + frK(`${a} > ${b} \\implies f(${a}) < f(${b})`) + '</div>';
            } else {
                html += '<div class="step-explanation">' + a + ' et ' + b + ' sont n\u00e9gatifs. La fonction inverse est d\u00e9croissante sur ]\u2212\u221e ; 0[.</div>';
                if (a < b) html += '<div class="step-expression">' + frK(`${a} < ${b} \\implies f(${a}) > f(${b})`) + '</div>';
                else html += '<div class="step-expression">' + frK(`${a} > ${b} \\implies f(${a}) < f(${b})`) + '</div>';
            }
            break;
        }

        case 'racine': {
            html += '<div class="step-explanation">' + a + ' et ' + b + ' sont positifs. La fonction racine carr\u00e9e est croissante sur [0 ; +\u221e[.</div>';
            if (a < b) html += '<div class="step-expression">' + frK(`${a} < ${b} \\implies f(${a}) < f(${b})`) + '</div>';
            else html += '<div class="step-expression">' + frK(`${a} > ${b} \\implies f(${a}) > f(${b})`) + '</div>';
            break;
        }

        case 'cube': {
            html += '<div class="step-explanation">La fonction cube est strictement croissante sur \u211d.</div>';
            if (a < b) html += '<div class="step-expression">' + frK(`${a} < ${b} \\implies f(${a}) < f(${b})`) + '</div>';
            else html += '<div class="step-expression">' + frK(`${a} > ${b} \\implies f(${a}) > f(${b})`) + '</div>';
            break;
        }

        case 'valeur-absolue': {
            html += '<div class="step-explanation">On compare les valeurs absolues : |' + a + '| = ' + Math.abs(a) + ' et |' + b + '| = ' + Math.abs(b) + '.</div>';
            if (Math.abs(a) > Math.abs(b)) {
                html += '<div class="step-expression">' + frK(`|${a}| > |${b}| \\implies f(${a}) > f(${b})`) + '</div>';
            } else if (Math.abs(a) < Math.abs(b)) {
                html += '<div class="step-expression">' + frK(`|${a}| < |${b}| \\implies f(${a}) < f(${b})`) + '</div>';
            }
            break;
        }
    }
    html += '</div>';

    // Verification
    html += '<div class="step">';
    html += '<div class="step-number">V\u00e9rification</div>';
    html += '<div class="step-expression">' + frK(`f(${a}) = ${frFormatNum(fa)}`) + ' et ' + frK(`f(${b}) = ${frFormatNum(fb)}`) + '</div>';
    html += '</div>';

    const cmp = fa > fb ? '>' : fa < fb ? '<' : '=';
    html += '<div class="result-highlight">';
    html += '<div class="final">' + frK(`f(${a}) ${cmp} f(${b})`) + '</div>';
    html += '</div>';

    return html;
}

/* ========================================
   DESSIN DU GRAPHIQUE
   ======================================== */

function drawFRGraph() {
    const st = FonctionsReferenceState;
    const info = FUNC_INFO[st.currentType];
    const opts = info.graphOpts;

    const graph = new GraphCanvas('frCanvas', {
        width: 500, height: 350,
        xMin: opts.xMin, xMax: opts.xMax,
        yMin: opts.yMin, yMax: opts.yMax
    });

    graph.clear();
    graph.drawGrid();
    graph.drawAxes();
    graph.drawTicks();
    graph.drawFunction(info.func, info.color, 3);

    // Marquer les points pertinents
    switch (st.subType) {
        case 'image': {
            const x = st.x;
            const y = info.func(x);
            if (isFinite(y)) {
                graph.drawDashedLine(x, 0, x, y, 'rgba(150,150,150,0.5)');
                graph.drawDashedLine(0, y, x, y, 'rgba(150,150,150,0.5)');
                graph.drawPoint(x, y, '#e74c3c', 5, `(${x}, ${frFormatNum(y)})`);
            }
            break;
        }
        case 'antecedent': {
            const y = st.y;
            // Trouver les antecedents selon le type
            let antecedents = [];
            switch (st.currentType) {
                case 'carree':
                    if (y >= 0) {
                        const s = Math.sqrt(y);
                        antecedents.push(s);
                        if (s !== 0) antecedents.push(-s);
                    }
                    break;
                case 'inverse':
                    if (y !== 0) antecedents.push(1 / y);
                    break;
                case 'racine':
                    if (y >= 0) antecedents.push(y * y);
                    break;
                case 'cube':
                    antecedents.push(Math.cbrt(y));
                    break;
                case 'valeur-absolue':
                    if (y > 0) { antecedents.push(y); antecedents.push(-y); }
                    else if (y === 0) antecedents.push(0);
                    break;
            }
            antecedents.forEach(x => {
                if (isFinite(x) && x >= opts.xMin && x <= opts.xMax) {
                    graph.drawDashedLine(x, 0, x, y, 'rgba(150,150,150,0.5)');
                    graph.drawPoint(x, y, '#e74c3c', 5, `(${frFormatNum(x)}, ${y})`);
                }
            });
            if (antecedents.length > 0) {
                const xLeft = opts.xMin;
                graph.drawDashedLine(xLeft, y, antecedents[0], y, 'rgba(150,150,150,0.5)');
            }
            break;
        }
        case 'comparaison': {
            const a = st.compA, b = st.compB;
            const fa = info.func(a), fb = info.func(b);
            if (isFinite(fa)) {
                graph.drawDashedLine(a, 0, a, fa, 'rgba(150,150,150,0.5)');
                graph.drawDashedLine(0, fa, a, fa, 'rgba(150,150,150,0.5)');
                graph.drawPoint(a, fa, '#e74c3c', 5, `A(${a}, ${frFormatNum(fa)})`);
            }
            if (isFinite(fb)) {
                graph.drawDashedLine(b, 0, b, fb, 'rgba(150,150,150,0.5)');
                graph.drawDashedLine(0, fb, b, fb, 'rgba(150,150,150,0.5)');
                graph.drawPoint(b, fb, '#3498db', 5, `B(${b}, ${frFormatNum(fb)})`);
            }
            break;
        }
    }

    // Etiquette
    const ctx = graph.ctx;
    ctx.font = 'italic 14px Arial';
    ctx.fillStyle = info.color;
    ctx.fillText('Cf', graph.toCanvasX(opts.xMax) - 30, graph.toCanvasY(opts.yMax) + 20);
}

/* ========================================
   INIT
   ======================================== */

document.addEventListener('DOMContentLoaded', initFonctionsReferencePage);
