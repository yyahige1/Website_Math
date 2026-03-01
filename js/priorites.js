/* ========================================
   PRIORITES.JS - Priorités opératoires (5ème)
   ======================================== */

const PrioritesState = {
    currentType: 'sans-parentheses',
    expression: '',
    result: 0,
    steps: []
};

function prRandInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function prPick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

/* --- Initialisation --------------------- */

function initPrioritesPage() {
    const typeButtons = document.querySelectorAll('.type-btn');
    typeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            typeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            PrioritesState.currentType = btn.dataset.type;
            generatePR();
        });
    });

    $('generateBtn').addEventListener('click', () => generatePR());
    $('solveBtn').addEventListener('click', () => solvePR());
    generatePR();
}

/* --- Affichage -------------------------- */

function updatePRDisplay() {
    $('exerciseDisplay').innerHTML = PrioritesState.expression;
}

/* --- Génération dispatch ---------------- */

function generatePR() {
    switch (PrioritesState.currentType) {
        case 'sans-parentheses': generateSansParentheses(); break;
        case 'avec-parentheses': generateAvecParentheses(); break;
        case 'imbriquees':       generateImbriquees();       break;
        default:                 generateSansParentheses();
    }
    updatePRDisplay();
    hideSolution('solutionDiv');
}

/* --- Type 1 : sans parenthèses --------- */

function generateSansParentheses() {
    const nbTerms = prPick([3, 3, 4]);
    const values = [];
    const ops = [];
    const mustIdx = prRandInt(0, nbTerms - 2);

    for (let i = 0; i < nbTerms; i++) values.push(prRandInt(2, 12));

    for (let i = 0; i < nbTerms - 1; i++) {
        if (i === mustIdx) ops.push(prPick(['*', '/']));
        else ops.push(prPick(['+', '-', '*', '/']));
    }

    // Ajuster les divisions pour qu'elles tombent juste
    for (let i = 0; i < ops.length; i++) {
        if (ops[i] === '/') {
            const divisor = prRandInt(2, 6);
            values[i] = divisor * prRandInt(2, 6);
            values[i + 1] = divisor;
        }
    }

    const { result, steps } = evaluateFlat(values, ops);
    PrioritesState.expression = buildDisplay(values, ops);
    PrioritesState.result = result;
    PrioritesState.steps = steps;
}

/* --- Type 2 : avec parenthèses --------- */

function generateAvecParentheses() {
    const pattern = prRandInt(1, 3);

    if (pattern === 1) {
        // (a OP b) OP2 c
        const a = prRandInt(2, 10), b = prRandInt(2, 10);
        const innerOp = prPick(['+', '-']);
        const outerOp = prPick(['*', '/']);
        const innerVal = applyOp(a, innerOp, b);
        if (innerVal <= 0) return generateAvecParentheses();

        let c;
        if (outerOp === '/') {
            const divs = getDivisors(innerVal);
            c = prPick(divs);
        } else {
            c = prRandInt(2, 8);
        }

        const result = applyOp(innerVal, outerOp, c);
        const display = `(${a} ${opSymbol(innerOp)} ${b}) ${opSymbol(outerOp)} ${c}`;
        PrioritesState.expression = display;
        PrioritesState.result = result;
        PrioritesState.steps = [
            { text: `On calcule la parenthèse : ${a} ${opSymbol(innerOp)} ${b} = ${innerVal}`,
              expr: `<strong>${innerVal}</strong> ${opSymbol(outerOp)} ${c}` },
            { text: `On effectue : ${innerVal} ${opSymbol(outerOp)} ${c} = ${result}`,
              expr: `<strong>${result}</strong>` }
        ];

    } else if (pattern === 2) {
        // c OP2 (a OP b)
        const a = prRandInt(2, 10), b = prRandInt(2, 10);
        const innerOp = prPick(['+', '-']);
        const outerOp = prPick(['*', '/']);
        const innerVal = applyOp(a, innerOp, b);
        if (innerVal <= 0) return generateAvecParentheses();

        let c;
        if (outerOp === '/') c = innerVal * prRandInt(2, 5);
        else c = prRandInt(2, 8);

        const result = applyOp(c, outerOp, innerVal);
        const display = `${c} ${opSymbol(outerOp)} (${a} ${opSymbol(innerOp)} ${b})`;
        PrioritesState.expression = display;
        PrioritesState.result = result;
        PrioritesState.steps = [
            { text: `On calcule la parenthèse : ${a} ${opSymbol(innerOp)} ${b} = ${innerVal}`,
              expr: `${c} ${opSymbol(outerOp)} <strong>${innerVal}</strong>` },
            { text: `On effectue : ${c} ${opSymbol(outerOp)} ${innerVal} = ${result}`,
              expr: `<strong>${result}</strong>` }
        ];

    } else {
        // a OP1 (b OP2 c) OP3 d
        const b = prRandInt(2, 8), c = prRandInt(2, 8);
        const innerOp = prPick(['+', '-']);
        const innerVal = applyOp(b, innerOp, c);
        if (innerVal <= 0) return generateAvecParentheses();

        const a = prRandInt(2, 10), d = prRandInt(2, 10);
        const op1 = prPick(['+', '-', '*']);
        const op2 = prPick(['+', '-']);

        const display = `${a} ${opSymbol(op1)} (${b} ${opSymbol(innerOp)} ${c}) ${opSymbol(op2)} ${d}`;
        const steps = [
            { text: `On calcule la parenthèse : ${b} ${opSymbol(innerOp)} ${c} = ${innerVal}`,
              expr: `${a} ${opSymbol(op1)} <strong>${innerVal}</strong> ${opSymbol(op2)} ${d}` }
        ];

        let result;
        if (op1 === '*') {
            const mulRes = a * innerVal;
            result = applyOp(mulRes, op2, d);
            steps.push(
                { text: `Multiplication prioritaire : ${a} ${opSymbol(op1)} ${innerVal} = ${mulRes}`,
                  expr: `<strong>${mulRes}</strong> ${opSymbol(op2)} ${d}` },
                { text: `On termine : ${mulRes} ${opSymbol(op2)} ${d} = ${result}`,
                  expr: `<strong>${result}</strong>` }
            );
        } else {
            const leftRes = applyOp(a, op1, innerVal);
            result = applyOp(leftRes, op2, d);
            steps.push(
                { text: `De gauche à droite : ${a} ${opSymbol(op1)} ${innerVal} = ${leftRes}`,
                  expr: `<strong>${leftRes}</strong> ${opSymbol(op2)} ${d}` },
                { text: `On termine : ${leftRes} ${opSymbol(op2)} ${d} = ${result}`,
                  expr: `<strong>${result}</strong>` }
            );
        }

        PrioritesState.expression = display;
        PrioritesState.result = result;
        PrioritesState.steps = steps;
    }
}

/* --- Type 3 : imbriquées ---------------- */

function generateImbriquees() {
    const pattern = prRandInt(1, 2);

    if (pattern === 1) {
        // a OP (b OP2 (c OP3 d))
        const c = prRandInt(2, 8), d = prRandInt(2, 8);
        const op3 = prPick(['+', '-']);
        const inner = applyOp(c, op3, d);
        if (inner <= 0) return generateImbriquees();

        const b = prRandInt(2, 6);
        const op2 = prPick(['+', '*']);
        const middle = applyOp(b, op2, inner);

        const a = prRandInt(2, 6);
        const op1 = prPick(['*', '+', '-']);
        const result = applyOp(a, op1, middle);

        PrioritesState.expression = `${a} ${opSymbol(op1)} (${b} ${opSymbol(op2)} (${c} ${opSymbol(op3)} ${d}))`;
        PrioritesState.result = result;
        PrioritesState.steps = [
            { text: `Parenthèse intérieure : ${c} ${opSymbol(op3)} ${d} = ${inner}`,
              expr: `${a} ${opSymbol(op1)} (${b} ${opSymbol(op2)} <strong>${inner}</strong>)` },
            { text: `Parenthèse extérieure : ${b} ${opSymbol(op2)} ${inner} = ${middle}`,
              expr: `${a} ${opSymbol(op1)} <strong>${middle}</strong>` },
            { text: `Opération finale : ${a} ${opSymbol(op1)} ${middle} = ${result}`,
              expr: `<strong>${result}</strong>` }
        ];
    } else {
        // (a OP b) OP2 (c OP3 d)
        const a = prRandInt(2, 10), b = prRandInt(2, 10);
        const op1 = prPick(['+', '-']);
        const left = applyOp(a, op1, b);

        const c = prRandInt(2, 10), d = prRandInt(2, 10);
        const op3 = prPick(['+', '-']);
        const right = applyOp(c, op3, d);

        if (left <= 0 || right <= 0) return generateImbriquees();

        const op2 = prPick(['*', '+', '-']);
        const result = applyOp(left, op2, right);

        PrioritesState.expression = `(${a} ${opSymbol(op1)} ${b}) ${opSymbol(op2)} (${c} ${opSymbol(op3)} ${d})`;
        PrioritesState.result = result;
        PrioritesState.steps = [
            { text: `Première parenthèse : ${a} ${opSymbol(op1)} ${b} = ${left}`,
              expr: `<strong>${left}</strong> ${opSymbol(op2)} (${c} ${opSymbol(op3)} ${d})` },
            { text: `Seconde parenthèse : ${c} ${opSymbol(op3)} ${d} = ${right}`,
              expr: `${left} ${opSymbol(op2)} <strong>${right}</strong>` },
            { text: `Opération finale : ${left} ${opSymbol(op2)} ${right} = ${result}`,
              expr: `<strong>${result}</strong>` }
        ];
    }
}

/* --- Évaluation plate (type 1) ---------- */

function evaluateFlat(values, ops) {
    const steps = [];
    let vals = values.slice();
    let opsLeft = ops.slice();

    // Passe 1 : × et ÷ (gauche à droite)
    let i = 0;
    while (i < opsLeft.length) {
        if (opsLeft[i] === '*' || opsLeft[i] === '/') {
            const r = applyOp(vals[i], opsLeft[i], vals[i + 1]);
            const expr = buildDisplayFromArrays(vals, opsLeft, i, r);
            steps.push({
                text: `On effectue ${vals[i]} ${opSymbol(opsLeft[i])} ${vals[i + 1]} = ${r} (priorité × / ÷)`,
                expr
            });
            vals.splice(i, 2, r);
            opsLeft.splice(i, 1);
        } else {
            i++;
        }
    }

    // Passe 2 : + et − (gauche à droite)
    while (opsLeft.length > 0) {
        const r = applyOp(vals[0], opsLeft[0], vals[1]);
        const expr = buildDisplayFromArrays(vals, opsLeft, 0, r);
        steps.push({
            text: `On effectue ${vals[0]} ${opSymbol(opsLeft[0])} ${vals[1]} = ${r}`,
            expr
        });
        vals.splice(0, 2, r);
        opsLeft.splice(0, 1);
    }

    return { result: vals[0], steps };
}

/* --- Résolution (affichage solution) ---- */

function solvePR() {
    const steps = PrioritesState.steps;
    if (!steps || steps.length === 0) return;

    let html = '<h3>Solution détaillée</h3>';

    // Rappel
    html += '<div class="step">';
    html += '<div class="step-explanation">';
    html += '<strong>Rappel :</strong> ';
    html += '1) Parenthèses &nbsp; 2) × et ÷ &nbsp; 3) + et −';
    html += '</div></div>';

    // Expression de départ
    html += '<div class="step">';
    html += '<div class="step-number">Expression de départ</div>';
    html += `<div class="step-expression">${PrioritesState.expression}</div>`;
    html += '</div>';

    steps.forEach((s, idx) => {
        html += '<div class="step">';
        html += `<div class="step-number">Étape ${idx + 1}</div>`;
        html += `<div class="step-expression">${s.expr}</div>`;
        html += `<div class="step-explanation">${s.text}</div>`;
        html += '</div>';
    });

    html += '<div class="result-highlight">';
    html += `<div class="final">${PrioritesState.expression} = ${PrioritesState.result}</div>`;
    html += '</div>';

    $('solutionDiv').innerHTML = html;
    showSolution('solutionDiv');
}

/* --- Utilitaires internes --------------- */

function opSymbol(op) {
    switch (op) {
        case '+': return '+';
        case '-': return '−';
        case '*': return '×';
        case '/': return '÷';
        default:  return op;
    }
}

function applyOp(a, op, b) {
    switch (op) {
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '/': return a / b;
        default:  return 0;
    }
}

function buildDisplay(values, ops) {
    let s = '' + values[0];
    for (let i = 0; i < ops.length; i++) {
        s += ` ${opSymbol(ops[i])} ${values[i + 1]}`;
    }
    return s;
}

function buildDisplayFromArrays(vals, ops, idx, result) {
    const nv = vals.slice(), no = ops.slice();
    nv.splice(idx, 2, result);
    no.splice(idx, 1);
    let s = '';
    for (let i = 0; i < nv.length; i++) {
        s += (i === idx) ? `<strong>${nv[i]}</strong>` : '' + nv[i];
        if (i < no.length) s += ` ${opSymbol(no[i])} `;
    }
    return s;
}

function getDivisors(n) {
    if (n <= 1) return [2];
    const divs = [];
    for (let i = 2; i <= Math.min(n, 12); i++) {
        if (n % i === 0) divs.push(i);
    }
    return divs.length > 0 ? divs : [2];
}

/* --- Point d'entrée --------------------- */

document.addEventListener('DOMContentLoaded', initPrioritesPage);
