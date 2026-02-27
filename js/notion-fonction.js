/* ========================================
   NOTION-FONCTION.JS - Notion de fonction (2nde)
   Lecture graphique, ensemble de definition, tableau de valeurs
   ======================================== */

const NotionFonctionState = {
    currentType: 'image',
    // Fonction graphique : f(x) = a(x - h)^2 + k
    a: 0.5, h: 1, k: 2,
    queryX: 3,
    queryY: 4,
    // Ensemble de definition
    defType: 'racine',
    defA: 2, defB: -4, defC: 1, defD: 3,
    // Tableau de valeurs
    tabA: 1, tabB: -2, tabC: 3,
    tabXValues: [-2, -1, 0, 1, 2, 3],
};

/* ---- Helpers ---- */

function nfK(tex) {
    return katex.renderToString(tex, { throwOnError: false });
}

function nfRandInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function nfPick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function nfFormatNum(n) {
    if (Number.isInteger(n)) return n.toString();
    return (Math.round(n * 100) / 100).toString();
}

function nfGcd(a, b) {
    a = Math.abs(a); b = Math.abs(b);
    while (b) { [a, b] = [b, a % b]; }
    return a;
}

function nfFracTeX(num, den) {
    if (den === 0) return '?';
    const g = nfGcd(Math.abs(num), Math.abs(den));
    let n = num / g, d = den / g;
    if (d < 0) { n = -n; d = -d; }
    if (d === 1) return n.toString();
    return `\\dfrac{${n}}{${d}}`;
}

function nfLinearTeX(a, b) {
    let s = '';
    if (a === 1) s = 'x';
    else if (a === -1) s = '-x';
    else s = a + 'x';
    if (b > 0) s += ' + ' + b;
    else if (b < 0) s += ' - ' + Math.abs(b);
    return s;
}

function nfFunc(x) {
    const st = NotionFonctionState;
    return st.a * (x - st.h) * (x - st.h) + st.k;
}

function nfTabFunc(x) {
    const st = NotionFonctionState;
    return st.tabA * x * x + st.tabB * x + st.tabC;
}

/* ========================================
   INITIALISATION
   ======================================== */

function initNotionFonctionPage() {
    document.querySelectorAll('.type-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            NotionFonctionState.currentType = btn.dataset.type;
            generateNF();
            updateNFDisplay();
            hideSolution('solutionDiv');
        });
    });

    $('generateBtn').addEventListener('click', () => {
        generateNF();
        updateNFDisplay();
        hideSolution('solutionDiv');
    });

    $('solveBtn').addEventListener('click', solveNF);

    generateNF();
    updateNFDisplay();
}

/* ========================================
   GENERATION
   ======================================== */

function generateNF() {
    const st = NotionFonctionState;
    switch (st.currentType) {
        case 'image': generateNFImage(); break;
        case 'antecedent': generateNFAntecedent(); break;
        case 'variations': generateNFVariations(); break;
        case 'definition': generateNFDefinition(); break;
        case 'tableau': generateNFTableau(); break;
    }
}

function generateNFGraphFunc() {
    const st = NotionFonctionState;
    st.a = nfPick([-1, -0.5, 0.5, 1]);
    st.h = nfRandInt(-2, 2);
    st.k = nfRandInt(-3, 3);
}

function generateNFImage() {
    const st = NotionFonctionState;
    generateNFGraphFunc();
    const candidates = [];
    for (let x = -4; x <= 4; x++) {
        if (x === st.h) continue;
        const y = nfFunc(x);
        if (Number.isInteger(y) && Math.abs(y) <= 5) {
            candidates.push(x);
        }
    }
    st.queryX = candidates.length > 0 ? nfPick(candidates) : nfRandInt(-3, 3);
}

function generateNFAntecedent() {
    const st = NotionFonctionState;
    generateNFGraphFunc();
    // Choisir queryY pour avoir des antecedents entiers
    const t = nfRandInt(1, 3);
    st.queryY = st.a * t * t + st.k;
    // Verifier que les antecedents h+t et h-t sont dans [-5,5]
    if (Math.abs(st.h + t) > 5 || Math.abs(st.h - t) > 5) {
        st.queryY = st.k; // vertex, un seul antecedent
    }
}

function generateNFVariations() {
    generateNFGraphFunc();
}

function generateNFDefinition() {
    const st = NotionFonctionState;
    st.defType = nfPick(['racine', 'inverse', 'quotient', 'racine-quotient']);
    st.defA = nfPick([1, 2, 3, -1, -2, -3]);
    do { st.defB = nfRandInt(-6, 6); } while (st.defB === 0);
    if (st.defType === 'quotient' || st.defType === 'racine-quotient') {
        st.defC = nfPick([1, 2, -1, -2]);
        do { st.defD = nfRandInt(-5, 5); } while (st.defD === 0);
        while (st.defA * st.defD === st.defC * st.defB) {
            st.defD = nfRandInt(-5, 5);
            if (st.defD === 0) st.defD = 1;
        }
    }
}

function generateNFTableau() {
    const st = NotionFonctionState;
    st.tabA = nfPick([1, -1, 2, -2]);
    st.tabB = nfRandInt(-4, 4);
    st.tabC = nfRandInt(-5, 5);
    const all = [-3, -2, -1, 0, 1, 2, 3];
    st.tabXValues = all.sort(() => Math.random() - 0.5).slice(0, 6).sort((a, b) => a - b);
}

/* ========================================
   AFFICHAGE
   ======================================== */

function updateNFDisplay() {
    const st = NotionFonctionState;
    const graphSection = $('graphSection');
    const isGraphType = ['image', 'antecedent', 'variations'].includes(st.currentType);
    graphSection.style.display = isGraphType ? 'block' : 'none';

    let display = '';
    switch (st.currentType) {
        case 'image':
            display = `On consid\u00e8re la courbe repr\u00e9sentative de la fonction <em>f</em> ci-dessous.<br><br>`;
            display += `<strong>Lire graphiquement ${nfK(`f(${st.queryX})`)}.</strong>`;
            break;
        case 'antecedent':
            display = `On consid\u00e8re la courbe repr\u00e9sentative de la fonction <em>f</em> ci-dessous.<br><br>`;
            display += `<strong>D\u00e9terminer graphiquement le(s) ant\u00e9c\u00e9dent(s) de ${nfK(nfFormatNum(st.queryY))} par <em>f</em>.</strong>`;
            break;
        case 'variations':
            display = `On consid\u00e8re la courbe repr\u00e9sentative de la fonction <em>f</em> ci-dessous.<br><br>`;
            display += `<strong>D\u00e9terminer les variations de <em>f</em> sur [\u22125 ; 5].</strong>`;
            break;
        case 'definition':
            display = buildNFDefDisplay();
            break;
        case 'tableau':
            display = buildNFTableauDisplay();
            break;
    }

    $('exerciseDisplay').innerHTML = display;
    if (isGraphType) {
        requestAnimationFrame(() => drawNFGraph());
    }
}

function buildNFDefDisplay() {
    const st = NotionFonctionState;
    const inner = nfLinearTeX(st.defA, st.defB);
    let expr = '';
    switch (st.defType) {
        case 'racine':
            expr = `f(x) = \\sqrt{${inner}}`;
            break;
        case 'inverse':
            expr = `f(x) = \\dfrac{1}{${inner}}`;
            break;
        case 'quotient': {
            const denom = nfLinearTeX(st.defC, st.defD);
            expr = `f(x) = \\dfrac{${denom}}{${inner}}`;
            break;
        }
        case 'racine-quotient': {
            const denom = nfLinearTeX(st.defC, st.defD);
            expr = `f(x) = \\dfrac{\\sqrt{${inner}}}{${denom}}`;
            break;
        }
    }
    return `D\u00e9terminer l'ensemble de d\u00e9finition de :<br><br>${nfK(expr)}`;
}

function buildNFTableauDisplay() {
    const st = NotionFonctionState;
    const exprTeX = nfBuildTabExprTeX();

    let html = `Soit ${nfK(`f(x) = ${exprTeX}`)}. Compl\u00e9ter le tableau de valeurs :<br><br>`;
    html += '<table style="margin:auto; border-collapse:collapse;">';
    html += '<tr><td style="padding:6px 12px; border:1px solid #ccc; font-weight:bold; background:#f5f5f5;">x</td>';
    st.tabXValues.forEach(x => {
        html += `<td style="padding:6px 12px; border:1px solid #ccc; text-align:center;">${x}</td>`;
    });
    html += '</tr><tr><td style="padding:6px 12px; border:1px solid #ccc; font-weight:bold; background:#f5f5f5;">f(x)</td>';
    st.tabXValues.forEach(() => {
        html += `<td style="padding:6px 12px; border:1px solid #ccc; text-align:center; color:#999;">?</td>`;
    });
    html += '</tr></table>';
    return html;
}

function nfBuildTabExprTeX() {
    const a = NotionFonctionState.tabA;
    const b = NotionFonctionState.tabB;
    const c = NotionFonctionState.tabC;
    let s = '';
    if (a === 1) s = 'x^2';
    else if (a === -1) s = '-x^2';
    else s = a + 'x^2';
    if (b === 1) s += ' + x';
    else if (b === -1) s += ' - x';
    else if (b > 0) s += ' + ' + b + 'x';
    else if (b < 0) s += ' - ' + Math.abs(b) + 'x';
    if (c > 0) s += ' + ' + c;
    else if (c < 0) s += ' - ' + Math.abs(c);
    return s;
}

/* ========================================
   DESSIN DU GRAPHIQUE
   ======================================== */

function drawNFGraph() {
    const canvas = $('nfCanvas');
    if (!canvas) return;

    const graph = new GraphCanvas('nfCanvas', {
        width: 500, height: 350,
        xMin: -6, xMax: 6,
        yMin: -6, yMax: 6
    });

    graph.clear();
    graph.drawGrid();
    graph.drawAxes();
    graph.drawTicks();
    graph.drawFunction(x => nfFunc(x), '#3498db', 3);

    // Etiquette Cf
    const labelX = 4;
    const labelY = nfFunc(labelX);
    if (Math.abs(labelY) <= 5.5) {
        const ctx = graph.ctx;
        ctx.font = 'italic 14px Arial';
        ctx.fillStyle = '#3498db';
        const cx = graph.toCanvasX(labelX);
        const cy = graph.toCanvasY(labelY);
        ctx.fillText('Cf', cx + 5, cy - 10);
    }
}

/* ========================================
   RESOLUTION
   ======================================== */

function solveNF() {
    const st = NotionFonctionState;
    let html = '<h3>Solution</h3>';
    switch (st.currentType) {
        case 'image': html += solveNFImage(); break;
        case 'antecedent': html += solveNFAntecedent(); break;
        case 'variations': html += solveNFVariations(); break;
        case 'definition': html += solveNFDefinition(); break;
        case 'tableau': html += solveNFTableau(); break;
    }
    $('solutionDiv').innerHTML = html;
    showSolution('solutionDiv');
}

/* ---- Image ---- */

function solveNFImage() {
    const st = NotionFonctionState;
    const x = st.queryX;
    const y = nfFunc(x);
    let html = '';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : Rep\u00e9rer x = ' + x + ' sur l\'axe des abscisses</div>';
    html += '<div class="step-explanation">On trace mentalement une droite verticale passant par x = ' + x + '.</div>';
    html += '</div>';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 2 : Lire l\'ordonn\u00e9e du point d\'intersection</div>';
    html += '<div class="step-explanation">La droite verticale coupe la courbe C<sub>f</sub> en un point dont l\'ordonn\u00e9e est <strong>' + nfFormatNum(y) + '</strong>.</div>';
    html += '</div>';

    html += '<div class="result-highlight">';
    html += '<div class="final">' + nfK(`f(${x}) = ${nfFormatNum(y)}`) + '</div>';
    html += '</div>';

    return html;
}

/* ---- Antecedent ---- */

function solveNFAntecedent() {
    const st = NotionFonctionState;
    const y = st.queryY;
    const val = (y - st.k) / st.a;
    let html = '';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 1 : Rep\u00e9rer y = ' + nfFormatNum(y) + ' sur l\'axe des ordonn\u00e9es</div>';
    html += '<div class="step-explanation">On trace mentalement une droite horizontale passant par y = ' + nfFormatNum(y) + '.</div>';
    html += '</div>';

    html += '<div class="step">';
    html += '<div class="step-number">Etape 2 : Lire les abscisses des points d\'intersection</div>';

    if (val < 0) {
        html += '<div class="step-explanation">La droite horizontale ne coupe pas la courbe.</div>';
        html += '</div>';
        html += '<div class="result-highlight">';
        html += '<div class="final">' + nfFormatNum(y) + ' n\'a pas d\'ant\u00e9c\u00e9dent par f.</div>';
        html += '</div>';
    } else if (val === 0) {
        html += '<div class="step-explanation">La droite horizontale est tangente \u00e0 la courbe en x = ' + st.h + '.</div>';
        html += '</div>';
        html += '<div class="result-highlight">';
        html += '<div class="final">' + nfFormatNum(y) + ' a un unique ant\u00e9c\u00e9dent : ' + nfK(`x = ${st.h}`) + '</div>';
        html += '</div>';
    } else {
        const t = Math.sqrt(val);
        const x1 = st.h - t;
        const x2 = st.h + t;
        if (Math.abs(x1 - x2) < 0.001) {
            html += '<div class="step-explanation">La droite coupe la courbe en un seul point d\'abscisse x = ' + nfFormatNum(x1) + '.</div>';
            html += '</div>';
            html += '<div class="result-highlight">';
            html += '<div class="final">' + nfFormatNum(y) + ' a un unique ant\u00e9c\u00e9dent : ' + nfK(`x = ${nfFormatNum(x1)}`) + '</div>';
            html += '</div>';
        } else {
            html += '<div class="step-explanation">La droite coupe la courbe en deux points d\'abscisses x = ' + nfFormatNum(x1) + ' et x = ' + nfFormatNum(x2) + '.</div>';
            html += '</div>';
            html += '<div class="result-highlight">';
            html += '<div class="final">' + nfFormatNum(y) + ' a deux ant\u00e9c\u00e9dents : ' + nfK(`x = ${nfFormatNum(x1)}`) + ' et ' + nfK(`x = ${nfFormatNum(x2)}`) + '</div>';
            html += '</div>';
        }
    }

    return html;
}

/* ---- Variations ---- */

function solveNFVariations() {
    const st = NotionFonctionState;
    let html = '';

    html += '<div class="step">';
    html += '<div class="step-number">Observation de la courbe</div>';
    if (st.a > 0) {
        html += '<div class="step-explanation">La parabole est tourn\u00e9e vers le haut (forme en U). Le sommet (point le plus bas) est en x = ' + st.h + ', avec f(' + st.h + ') = ' + nfFormatNum(st.k) + '.</div>';
    } else {
        html += '<div class="step-explanation">La parabole est tourn\u00e9e vers le bas (forme en \u2229). Le sommet (point le plus haut) est en x = ' + st.h + ', avec f(' + st.h + ') = ' + nfFormatNum(st.k) + '.</div>';
    }
    html += '</div>';

    html += '<div class="step">';
    html += '<div class="step-number">Tableau de variations</div>';
    if (st.a > 0) {
        html += '<div class="step-expression">f est d\u00e9croissante sur ]\u2212\u221e ; ' + st.h + ']</div>';
        html += '<div class="step-expression">f est croissante sur [' + st.h + ' ; +\u221e[</div>';
        html += '<div class="step-explanation">f admet un minimum \u00e9gal \u00e0 ' + nfFormatNum(st.k) + ' atteint en x = ' + st.h + '.</div>';
    } else {
        html += '<div class="step-expression">f est croissante sur ]\u2212\u221e ; ' + st.h + ']</div>';
        html += '<div class="step-expression">f est d\u00e9croissante sur [' + st.h + ' ; +\u221e[</div>';
        html += '<div class="step-explanation">f admet un maximum \u00e9gal \u00e0 ' + nfFormatNum(st.k) + ' atteint en x = ' + st.h + '.</div>';
    }
    html += '</div>';

    html += '<div class="result-highlight">';
    if (st.a > 0) {
        html += '<div class="final">f d\u00e9croissante sur ]\u2212\u221e ; ' + st.h + '] puis croissante sur [' + st.h + ' ; +\u221e[<br>Minimum : f(' + st.h + ') = ' + nfFormatNum(st.k) + '</div>';
    } else {
        html += '<div class="final">f croissante sur ]\u2212\u221e ; ' + st.h + '] puis d\u00e9croissante sur [' + st.h + ' ; +\u221e[<br>Maximum : f(' + st.h + ') = ' + nfFormatNum(st.k) + '</div>';
    }
    html += '</div>';

    return html;
}

/* ---- Ensemble de definition ---- */

function solveNFDefinition() {
    const st = NotionFonctionState;
    const a = st.defA, b = st.defB, c = st.defC, d = st.defD;
    const inner = nfLinearTeX(a, b);
    let html = '';

    switch (st.defType) {
        case 'racine': {
            const solTeX = nfFracTeX(-b, a);
            html += '<div class="step">';
            html += '<div class="step-number">Condition d\'existence de la racine carr\u00e9e</div>';
            html += '<div class="step-expression">' + nfK(`\\sqrt{${inner}}`) + ' existe si et seulement si ' + nfK(`${inner} \\geq 0`) + '</div>';
            html += '</div>';

            html += '<div class="step">';
            html += '<div class="step-number">R\u00e9solution de l\'in\u00e9quation</div>';
            html += '<div class="step-expression">' + nfK(`${inner} \\geq 0`) + '</div>';
            if (a > 0) {
                html += '<div class="step-expression">' + nfK(`x \\geq ${solTeX}`) + '</div>';
            } else {
                html += '<div class="step-expression">' + nfK(`x \\leq ${solTeX}`) + '</div>';
            }
            html += '</div>';

            html += '<div class="result-highlight">';
            if (a > 0) {
                html += '<div class="final">' + nfK(`D_f = \\left[${solTeX}\\,;\\,+\\infty\\right[`) + '</div>';
            } else {
                html += '<div class="final">' + nfK(`D_f = \\left]\\!-\\infty\\,;\\,${solTeX}\\right]`) + '</div>';
            }
            html += '</div>';
            break;
        }

        case 'inverse': {
            const solTeX = nfFracTeX(-b, a);
            html += '<div class="step">';
            html += '<div class="step-number">Condition d\'existence</div>';
            html += '<div class="step-expression">Le d\u00e9nominateur ne doit pas \u00eatre nul : ' + nfK(`${inner} \\neq 0`) + '</div>';
            html += '</div>';

            html += '<div class="step">';
            html += '<div class="step-number">Valeur interdite</div>';
            html += '<div class="step-expression">' + nfK(`${inner} = 0 \\iff x = ${solTeX}`) + '</div>';
            html += '</div>';

            html += '<div class="result-highlight">';
            html += '<div class="final">' + nfK(`D_f = \\mathbb{R} \\setminus \\left\\{${solTeX}\\right\\}`) + '</div>';
            html += '</div>';
            break;
        }

        case 'quotient': {
            const solTeX = nfFracTeX(-b, a);
            const denom = nfLinearTeX(c, d);
            html += '<div class="step">';
            html += '<div class="step-number">Condition d\'existence</div>';
            html += '<div class="step-expression">' + nfK(`f(x) = \\dfrac{${denom}}{${inner}}`) + '</div>';
            html += '<div class="step-explanation">Le d\u00e9nominateur ne doit pas \u00eatre nul : ' + nfK(`${inner} \\neq 0`) + '</div>';
            html += '</div>';

            html += '<div class="step">';
            html += '<div class="step-number">Valeur interdite</div>';
            html += '<div class="step-expression">' + nfK(`${inner} = 0 \\iff x = ${solTeX}`) + '</div>';
            html += '</div>';

            html += '<div class="result-highlight">';
            html += '<div class="final">' + nfK(`D_f = \\mathbb{R} \\setminus \\left\\{${solTeX}\\right\\}`) + '</div>';
            html += '</div>';
            break;
        }

        case 'racine-quotient': {
            const sol1TeX = nfFracTeX(-b, a);
            const sol1Val = -b / a;
            const sol2TeX = nfFracTeX(-d, c);
            const sol2Val = -d / c;
            const denom = nfLinearTeX(c, d);

            html += '<div class="step">';
            html += '<div class="step-number">Conditions d\'existence</div>';
            html += '<div class="step-expression">1. Sous la racine : ' + nfK(`${inner} \\geq 0`) + '</div>';
            html += '<div class="step-expression">2. D\u00e9nominateur non nul : ' + nfK(`${denom} \\neq 0`) + '</div>';
            html += '</div>';

            html += '<div class="step">';
            html += '<div class="step-number">Condition 1 : racine carr\u00e9e</div>';
            if (a > 0) {
                html += '<div class="step-expression">' + nfK(`${inner} \\geq 0 \\iff x \\geq ${sol1TeX}`) + '</div>';
            } else {
                html += '<div class="step-expression">' + nfK(`${inner} \\geq 0 \\iff x \\leq ${sol1TeX}`) + '</div>';
            }
            html += '</div>';

            html += '<div class="step">';
            html += '<div class="step-number">Condition 2 : valeur interdite</div>';
            html += '<div class="step-expression">' + nfK(`${denom} = 0 \\iff x = ${sol2TeX}`) + '</div>';
            html += '</div>';

            html += '<div class="step">';
            html += '<div class="step-number">Intersection des conditions</div>';
            let domainTeX = '';
            if (a > 0) {
                if (sol2Val > sol1Val) {
                    domainTeX = `\\left[${sol1TeX}\\,;\\,+\\infty\\right[ \\setminus \\left\\{${sol2TeX}\\right\\}`;
                } else if (Math.abs(sol2Val - sol1Val) < 0.0001) {
                    domainTeX = `\\left]${sol1TeX}\\,;\\,+\\infty\\right[`;
                } else {
                    domainTeX = `\\left[${sol1TeX}\\,;\\,+\\infty\\right[`;
                }
            } else {
                if (sol2Val < sol1Val) {
                    domainTeX = `\\left]\\!-\\infty\\,;\\,${sol1TeX}\\right] \\setminus \\left\\{${sol2TeX}\\right\\}`;
                } else if (Math.abs(sol2Val - sol1Val) < 0.0001) {
                    domainTeX = `\\left]\\!-\\infty\\,;\\,${sol1TeX}\\right[`;
                } else {
                    domainTeX = `\\left]\\!-\\infty\\,;\\,${sol1TeX}\\right]`;
                }
            }
            html += '<div class="step-expression">' + nfK(`D_f = ${domainTeX}`) + '</div>';
            html += '</div>';

            html += '<div class="result-highlight">';
            html += '<div class="final">' + nfK(`D_f = ${domainTeX}`) + '</div>';
            html += '</div>';
            break;
        }
    }

    return html;
}

/* ---- Tableau de valeurs ---- */

function solveNFTableau() {
    const st = NotionFonctionState;
    const a = st.tabA, b = st.tabB, c = st.tabC;
    const exprTeX = nfBuildTabExprTeX();
    let html = '';

    html += '<div class="step">';
    html += '<div class="step-number">Rappel</div>';
    html += '<div class="step-expression">' + nfK(`f(x) = ${exprTeX}`) + '</div>';
    html += '</div>';

    st.tabXValues.forEach(x => {
        const fx = nfTabFunc(x);
        const ax2 = a * x * x;
        const bx = b * x;

        html += '<div class="step">';
        html += '<div class="step-number">' + nfK(`f(${x})`) + '</div>';

        // Substitution
        let subst = '';
        if (a === 1) subst = `(${x})^2`;
        else if (a === -1) subst = `-(${x})^2`;
        else subst = `${a} \\times (${x})^2`;

        if (b === 1) subst += ` + (${x})`;
        else if (b === -1) subst += ` - (${x})`;
        else if (b > 0) subst += ` + ${b} \\times (${x})`;
        else if (b < 0) subst += ` ${b} \\times (${x})`;

        if (c > 0) subst += ` + ${c}`;
        else if (c < 0) subst += ` - ${Math.abs(c)}`;

        html += '<div class="step-expression">' + nfK(`f(${x}) = ${subst}`) + '</div>';
        html += '<div class="step-expression">' + nfK(`f(${x}) = ${ax2} ${bx >= 0 ? '+' : '-'} ${Math.abs(bx)} ${c >= 0 ? '+' : '-'} ${Math.abs(c)} = ${fx}`) + '</div>';
        html += '</div>';
    });

    // Tableau complet
    html += '<div class="result-highlight">';
    html += '<table style="margin:auto; border-collapse:collapse;">';
    html += '<tr><td style="padding:6px 12px; border:1px solid #ccc; font-weight:bold; background:#f5f5f5;">x</td>';
    st.tabXValues.forEach(x => {
        html += `<td style="padding:6px 12px; border:1px solid #ccc; text-align:center;">${x}</td>`;
    });
    html += '</tr><tr><td style="padding:6px 12px; border:1px solid #ccc; font-weight:bold; background:#f5f5f5;">f(x)</td>';
    st.tabXValues.forEach(x => {
        html += `<td style="padding:6px 12px; border:1px solid #ccc; text-align:center; font-weight:bold; color:var(--success);">${nfTabFunc(x)}</td>`;
    });
    html += '</tr></table>';
    html += '</div>';

    return html;
}

/* ========================================
   INIT
   ======================================== */

document.addEventListener('DOMContentLoaded', initNotionFonctionPage);
