/* ========================================
   UI.JS - Gestion du DOM et affichage
   ======================================== */

/**
 * Raccourci pour getElementById
 * @param {string} id 
 * @returns {HTMLElement}
 */
const $ = (id) => document.getElementById(id);

/**
 * Affiche la solution avec animation
 * @param {string} containerId - ID du conteneur de solution
 */
function showSolution(containerId = 'solutionDiv') {
    const el = $(containerId);
    if (el) {
        el.classList.add('show');
    }
}

/**
 * Cache la solution
 * @param {string} containerId 
 */
function hideSolution(containerId = 'solutionDiv') {
    const el = $(containerId);
    if (el) {
        el.classList.remove('show');
    }
}

/**
 * Met à jour le texte d'un élément
 * @param {string} elementId 
 * @param {string} text 
 */
function updateText(elementId, text) {
    const el = $(elementId);
    if (el) {
        el.textContent = text;
    }
}

/**
 * Met à jour le HTML d'un élément
 * @param {string} elementId 
 * @param {string} html 
 */
function updateHTML(elementId, html) {
    const el = $(elementId);
    if (el) {
        el.innerHTML = html;
    }
}

/**
 * Ajoute/enlève une classe
 * @param {string} elementId 
 * @param {string} className 
 * @param {boolean} add 
 */
function toggleClass(elementId, className, add) {
    const el = $(elementId);
    if (el) {
        el.classList.toggle(className, add);
    }
}

/**
 * Initialise les boutons de sélection de type
 * @param {string} selector - Sélecteur CSS des boutons
 * @param {Function} callback - Fonction appelée avec le type sélectionné
 */
function initTypeSelector(selector, callback) {
    const buttons = document.querySelectorAll(selector);
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const type = btn.dataset.type;
            if (callback) callback(type);
        });
    });
}

/**
 * Écoute les changements sur tous les inputs d'un conteneur
 * @param {string} containerSelector 
 * @param {Function} callback 
 */
function onInputsChange(containerSelector, callback) {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    
    container.querySelectorAll('input, select').forEach(el => {
        el.addEventListener('input', callback);
        el.addEventListener('change', callback);
    });
}

/**
 * Génère le HTML d'une étape de résolution
 * @param {Object} options
 * @param {string} options.expression - Expression mathématique
 * @param {string} options.explanation - Explication
 * @param {string} [options.badge] - Badge optionnel (ex: "Facteur commun")
 * @returns {string}
 */
function createStepHTML({ expression, explanation, badge = null }) {
    let html = '<div class="step">';
    if (badge) {
        html += `<span class="method-badge">${badge}</span>`;
    }
    html += `<div class="step-expression">${expression}</div>`;
    html += `<div class="step-explanation">${explanation}</div>`;
    html += '</div>';
    return html;
}

/**
 * Génère le HTML du résultat final
 * @param {string} result 
 * @param {string} [interval] - Intervalle optionnel (pour inéquations)
 * @returns {string}
 */
function createResultHTML(result, interval = null) {
    let html = '<div class="result-highlight">';
    html += `<div class="final">${result}</div>`;
    if (interval) {
        html += `<div class="interval">S = ${interval}</div>`;
    }
    html += '</div>';
    return html;
}

/**
 * Génère le HTML d'une alerte
 * @param {string} type - 'warning' ou 'info'
 * @param {string} message 
 * @returns {string}
 */
function createAlertHTML(type, message) {
    return `<div class="alert alert-${type}">${message}</div>`;
}

/**
 * Génère le HTML de vérification
 * @param {string} calculation 
 * @param {string} leftSide 
 * @param {string} rightSide 
 * @returns {string}
 */
function createVerificationHTML(calculation, leftSide, rightSide) {
    return `
        <div class="verification">
            <div class="verification-title">✓ Vérification</div>
            <div>${calculation}</div>
            <div style="margin-top: 8px; font-weight: 600;">
                Les deux côtés sont égaux : ${leftSide} = ${rightSide} ✓
            </div>
        </div>
    `;
}

/**
 * Génère le HTML des boxes d'identité (a et b)
 * @param {string} aValue 
 * @param {string} bValue 
 * @returns {string}
 */
function createIdentityBoxesHTML(aValue, bValue) {
    return `
        <div class="identity-boxes">
            <div class="id-box id-box-a">
                <span class="id-label">a</span>
                <span class="id-value">${aValue}</span>
            </div>
            <div class="id-box id-box-b">
                <span class="id-label">b</span>
                <span class="id-value">${bValue}</span>
            </div>
        </div>
    `;
}

// Export pour les tests (si module)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        $,
        showSolution,
        hideSolution,
        updateText,
        updateHTML,
        toggleClass,
        initTypeSelector,
        onInputsChange,
        createStepHTML,
        createResultHTML,
        createAlertHTML,
        createVerificationHTML,
        createIdentityBoxesHTML
    };
}
