// Test Distributivité Pédagogique
// État global
const State = {
    currentMethod: 'simple',
    currentStep: 0,
    maxSteps: {
        simple: 3,
        double: 6
    }
};

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    initMethodSelector();
    initNavigation();
    initControls();
    updateStepDisplay();
});

// Sélecteur de méthode
function initMethodSelector() {
    const methodButtons = document.querySelectorAll('.method-btn');

    methodButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const method = btn.dataset.method;

            // Update active button
            methodButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update method content
            document.querySelectorAll('.method-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(method + 'Method').classList.add('active');

            // Update state
            State.currentMethod = method;
            State.currentStep = 0;

            updateStepDisplay();
        });
    });
}

// Navigation
function initNavigation() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    prevBtn.addEventListener('click', () => {
        if (State.currentStep > 0) {
            State.currentStep--;
            updateStepDisplay();
        }
    });

    nextBtn.addEventListener('click', () => {
        const maxStep = State.maxSteps[State.currentMethod];
        if (State.currentStep < maxStep) {
            State.currentStep++;
            updateStepDisplay();
        }
    });
}

// Controls
function initControls() {
    const resetBtn = document.getElementById('resetBtn');
    const generateBtn = document.getElementById('generateBtn');

    resetBtn.addEventListener('click', () => {
        State.currentStep = 0;
        updateStepDisplay();
    });

    generateBtn.addEventListener('click', () => {
        generateNewExercise();
    });
}

// Update step display
function updateStepDisplay() {
    const method = State.currentMethod;
    const step = State.currentStep;
    const maxStep = State.maxSteps[method];

    // Update step cards
    const methodContent = document.getElementById(method + 'Method');
    const stepCards = methodContent.querySelectorAll('.step-card');

    stepCards.forEach((card, index) => {
        if (index === step) {
            card.classList.add('active');
        } else {
            card.classList.remove('active');
        }
    });

    // Update navigation buttons
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    prevBtn.disabled = (step === 0);
    nextBtn.disabled = (step === maxStep);

    // Update step indicator
    const stepIndicator = document.getElementById('stepIndicator');
    stepIndicator.textContent = `Étape ${step + 1} / ${maxStep + 1}`;

    // Update grid cells for double method
    if (method === 'double' && step >= 1 && step <= 5) {
        updateGridCells(step);
    }
}

// Update grid cells for double distributivity
function updateGridCells(step) {
    const grid = document.querySelector('.grid-container');
    if (!grid) return;

    const cells = {
        1: 'ac',
        2: 'ad',
        3: 'bc',
        4: 'bd'
    };

    // Reset all cells
    document.querySelectorAll('.grid-cell').forEach(cell => {
        cell.classList.remove('filled');
        const product = cell.dataset.product;
        if (product) {
            cell.innerHTML = '<span class="question">?</span>';
        }
    });

    // Fill cells up to current step
    for (let i = 1; i < step && i <= 4; i++) {
        const product = cells[i];
        const cell = document.querySelector(`.grid-cell[data-product="${product}"]`);
        if (cell) {
            cell.classList.add('filled');
            cell.innerHTML = `<span class="result-${product}">${getProductResult(product)}</span>`;
        }
    }

    // Highlight current cell if in steps 1-4
    if (step >= 1 && step <= 4) {
        const currentProduct = cells[step];
        const currentCell = document.querySelector(`.grid-cell[data-product="${currentProduct}"]`);
        if (currentCell) {
            currentCell.classList.add('filled');
            currentCell.innerHTML = `<span class="result-${currentProduct}">${getProductResult(currentProduct)}</span>`;
        }
    }

    // Show all cells filled in step 5
    if (step === 5) {
        Object.values(cells).forEach(product => {
            const cell = document.querySelector(`.grid-cell[data-product="${product}"]`);
            if (cell) {
                cell.classList.add('filled');
                cell.innerHTML = `<span class="result-${product}">${getProductResult(product)}</span>`;
            }
        });
    }
}

// Get product results (hardcoded for demo)
function getProductResult(product) {
    const results = {
        'ac': '2x²',
        'ad': '8x',
        'bc': '3x',
        'bd': '12'
    };
    return results[product] || '?';
}

// Generate new exercise
function generateNewExercise() {
    // Generate random coefficients
    const k = randInt(2, 5);
    const a = randInt(1, 5);
    const b = randInt(2, 9);
    const c = randInt(1, 5);
    const d = randInt(2, 9);

    if (State.currentMethod === 'simple') {
        updateSimpleExercise(k, a, b);
    } else if (State.currentMethod === 'double') {
        updateDoubleExercise(a, b, c, d);
    }

    // Reset to step 0
    State.currentStep = 0;
    updateStepDisplay();
}

// Update simple exercise
function updateSimpleExercise(k, a, b) {
    const ka = k * a;
    const kb = k * b;

    // Update expression display
    const expr = document.querySelector('#simpleMethod .expression-display');
    expr.innerHTML = `
        <span class="term-k">${k}</span>
        <span class="operator">(</span>
        <span class="term-a">${a}x</span>
        <span class="operator"> + </span>
        <span class="term-b">${b}</span>
        <span class="operator">)</span>
    `;

    // Update steps
    const steps = document.querySelectorAll('#simpleMethod .step-card');

    // Step 0
    steps[0].querySelector('.multiplier').innerHTML = `<span class="term-k">${k}</span>`;
    steps[0].querySelector('.term-a').textContent = `${a}x`;
    steps[0].querySelector('.term-b').textContent = `${b}`;
    steps[0].querySelector('.step-explanation').innerHTML =
        `On doit multiplier <span class="term-k">${k}</span> par chaque terme de la parenthèse`;

    // Step 1 - First product
    steps[1].querySelector('.product-terms').innerHTML = `
        <span class="term-k">${k}</span>
        <span class="operator">×</span>
        <span class="term-a">${a}x</span>
    `;
    steps[1].querySelector('.result-ka').textContent = `${ka}x`;
    steps[1].querySelector('.step-explanation').innerHTML =
        `<span class="term-k">${k}</span> × <span class="term-a">${a}x</span> = <span class="result-ka">${ka}x</span>`;

    // Step 2 - Second product
    steps[2].querySelector('.product-terms').innerHTML = `
        <span class="term-k">${k}</span>
        <span class="operator">×</span>
        <span class="term-b">${b}</span>
    `;
    steps[2].querySelector('.result-kb').textContent = `${kb}`;
    steps[2].querySelector('.step-explanation').innerHTML =
        `<span class="term-k">${k}</span> × <span class="term-b">${b}</span> = <span class="result-kb">${kb}</span>`;

    // Step 3 - Final result
    steps[3].querySelector('.final-expression').innerHTML = `
        <span class="result-ka">${ka}x</span>
        <span class="operator"> + </span>
        <span class="result-kb">${kb}</span>
    `;
}

// Update double exercise
function updateDoubleExercise(a, b, c, d) {
    const ac = a * c;
    const ad = a * d;
    const bc = b * c;
    const bd = b * d;

    // Update expression display
    const expr = document.querySelector('#doubleMethod .expression-display');
    expr.innerHTML = `
        <span class="operator">(</span>
        <span class="term-a">${a}x</span>
        <span class="operator"> + </span>
        <span class="term-b">${b}</span>
        <span class="operator">)(</span>
        <span class="term-c">${c === 1 ? 'x' : c + 'x'}</span>
        <span class="operator"> + </span>
        <span class="term-d">${d}</span>
        <span class="operator">)</span>
    `;

    // Update grid labels
    document.querySelectorAll('#doubleMethod .grid-label-top .term-c').forEach(el => {
        el.textContent = c === 1 ? 'x' : c + 'x';
    });
    document.querySelectorAll('#doubleMethod .grid-label-top .term-d').forEach(el => {
        el.textContent = d;
    });
    document.querySelectorAll('#doubleMethod .grid-label-left .term-a').forEach(el => {
        el.textContent = a + 'x';
    });
    document.querySelectorAll('#doubleMethod .grid-label-left .term-b').forEach(el => {
        el.textContent = b;
    });

    // Update steps
    const steps = document.querySelectorAll('#doubleMethod .step-card');

    // Step 1 - ac
    steps[1].querySelector('.product-terms').innerHTML = `
        <span class="term-a">${a}x</span>
        <span class="operator">×</span>
        <span class="term-c">${c === 1 ? 'x' : c + 'x'}</span>
    `;
    steps[1].querySelector('.result-ac').textContent = `${ac}x²`;
    steps[1].querySelector('.step-explanation').innerHTML =
        `<span class="term-a">${a}x</span> × <span class="term-c">${c === 1 ? 'x' : c + 'x'}</span> = <span class="result-ac">${ac}x²</span>`;

    // Step 2 - ad
    steps[2].querySelector('.product-terms').innerHTML = `
        <span class="term-a">${a}x</span>
        <span class="operator">×</span>
        <span class="term-d">${d}</span>
    `;
    steps[2].querySelector('.result-ad').textContent = `${ad}x`;
    steps[2].querySelector('.step-explanation').innerHTML =
        `<span class="term-a">${a}x</span> × <span class="term-d">${d}</span> = <span class="result-ad">${ad}x</span>`;

    // Step 3 - bc
    steps[3].querySelector('.product-terms').innerHTML = `
        <span class="term-b">${b}</span>
        <span class="operator">×</span>
        <span class="term-c">${c === 1 ? 'x' : c + 'x'}</span>
    `;
    steps[3].querySelector('.result-bc').textContent = `${bc}x`;
    steps[3].querySelector('.step-explanation').innerHTML =
        `<span class="term-b">${b}</span> × <span class="term-c">${c === 1 ? 'x' : c + 'x'}</span> = <span class="result-bc">${bc}x</span>`;

    // Step 4 - bd
    steps[4].querySelector('.product-terms').innerHTML = `
        <span class="term-b">${b}</span>
        <span class="operator">×</span>
        <span class="term-d">${d}</span>
    `;
    steps[4].querySelector('.result-bd').textContent = `${bd}`;
    steps[4].querySelector('.step-explanation').innerHTML =
        `<span class="term-b">${b}</span> × <span class="term-d">${d}</span> = <span class="result-bd">${bd}`;

    // Step 6 - Final result
    steps[6].querySelector('.final-expression').innerHTML = `
        <span class="result-ac">${ac}x²</span>
        <span class="operator"> + </span>
        <span class="result-ad">${ad}x</span>
        <span class="operator"> + </span>
        <span class="result-bc">${bc}x</span>
        <span class="operator"> + </span>
        <span class="result-bd">${bd}</span>
    `;

    // Update product results for grid
    window.productResults = {
        'ac': `${ac}x²`,
        'ad': `${ad}x`,
        'bc': `${bc}x`,
        'bd': `${bd}`
    };
}

// Get updated product result
function getProductResult(product) {
    if (window.productResults && window.productResults[product]) {
        return window.productResults[product];
    }

    // Default hardcoded values
    const results = {
        'ac': '2x²',
        'ad': '8x',
        'bc': '3x',
        'bd': '12'
    };
    return results[product] || '?';
}

// Helper: random integer
function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        document.getElementById('prevBtn').click();
    } else if (e.key === 'ArrowRight') {
        document.getElementById('nextBtn').click();
    }
});
