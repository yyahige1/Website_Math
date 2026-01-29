/* ========================================
   POURCENTAGES.JS - Logique des pourcentages
   ======================================== */

/**
 * État de la page pourcentages
 */
const PourcentagesState = {
    currentType: 'calculer'
};

/**
 * Récupère les valeurs depuis les inputs
 * @returns {Object}
 */
function getPourcentageValues() {
    const type = PourcentagesState.currentType;
    
    switch (type) {
        case 'calculer':
            return {
                type,
                pourcentage: parseFloat($('pourcentage').value) || 0,
                valeur: parseFloat($('valeur').value) || 0
            };
        case 'trouver':
            return {
                type,
                partie: parseFloat($('partie').value) || 0,
                total: parseFloat($('total').value) || 0
            };
        case 'augmentation':
        case 'reduction':
            return {
                type,
                valeurInitiale: parseFloat($('valeurInitiale').value) || 0,
                pourcentage: parseFloat($('pourcentageVar').value) || 0
            };
        case 'retrouver':
            return {
                type,
                valeurFinale: parseFloat($('valeurFinale').value) || 0,
                pourcentage: parseFloat($('pourcentageRetro').value) || 0,
                isAugmentation: $('typeVariation').value === 'augmentation'
            };
    }
}

/**
 * Met à jour l'affichage de l'exercice
 */
function updatePourcentageDisplay() {
    const v = getPourcentageValues();
    let display = '';
    
    switch (v.type) {
        case 'calculer':
            display = `${v.pourcentage}% de ${v.valeur} = ?`;
            break;
        case 'trouver':
            display = `${v.partie} sur ${v.total} = ? %`;
            break;
        case 'augmentation':
            display = `${v.valeurInitiale} + ${v.pourcentage}% = ?`;
            break;
        case 'reduction':
            display = `${v.valeurInitiale} − ${v.pourcentage}% = ?`;
            break;
        case 'retrouver':
            const signe = v.isAugmentation ? '+' : '−';
            display = `Après ${signe}${v.pourcentage}%, on obtient ${v.valeurFinale}.<br>Valeur initiale = ?`;
            break;
    }
    
    updateHTML('expressionDisplay', display);
    hideSolution();
}

/**
 * Génère un exercice aléatoire
 */
function generatePourcentage() {
    const type = PourcentagesState.currentType;
    
    switch (type) {
        case 'calculer':
            // Pourcentages "ronds" pour faciliter
            const pourcents = [5, 10, 15, 20, 25, 30, 40, 50, 75];
            $('pourcentage').value = pourcents[randInt(0, pourcents.length - 1)];
            $('valeur').value = randInt(2, 20) * 10; // Multiples de 10
            break;
            
        case 'trouver':
            const total = randInt(2, 20) * 10;
            const partie = randInt(1, total / 5) * 5; // Multiple de 5, inférieur au total
            $('partie').value = partie;
            $('total').value = total;
            break;
            
        case 'augmentation':
        case 'reduction':
            $('valeurInitiale').value = randInt(5, 50) * 10;
            $('pourcentageVar').value = [5, 10, 15, 20, 25, 30, 50][randInt(0, 6)];
            break;
            
        case 'retrouver':
            const initiale = randInt(5, 30) * 10;
            const pourc = [10, 20, 25, 50][randInt(0, 3)];
            const isAug = Math.random() < 0.5;
            const finale = isAug 
                ? initiale * (1 + pourc / 100)
                : initiale * (1 - pourc / 100);
            
            $('valeurFinale').value = finale;
            $('pourcentageRetro').value = pourc;
            $('typeVariation').value = isAug ? 'augmentation' : 'reduction';
            break;
    }
    
    updatePourcentageDisplay();
}

/**
 * Résout l'exercice de pourcentage
 */
function solvePourcentage() {
    const v = getPourcentageValues();
    let html = '';
    
    switch (v.type) {
        case 'calculer':
            html = solveCalculer(v.pourcentage, v.valeur);
            break;
        case 'trouver':
            html = solveTrouver(v.partie, v.total);
            break;
        case 'augmentation':
            html = solveAugmentation(v.valeurInitiale, v.pourcentage);
            break;
        case 'reduction':
            html = solveReduction(v.valeurInitiale, v.pourcentage);
            break;
        case 'retrouver':
            html = solveRetrouver(v.valeurFinale, v.pourcentage, v.isAugmentation);
            break;
    }
    
    updateHTML('stepsContainer', html);
    showSolution();
}

/**
 * Résout: X% de Y = ?
 */
function solveCalculer(pourcentage, valeur) {
    let html = '';

    // Formule
    html += `<div class="formula-box">
        <div class="formula-title">📐 Formule</div>
        <div class="formula-content">${pourcentage}% de ${valeur} = ?</div>
    </div>`;

    // Étape 1: Convertir en décimal
    const decimal = pourcentage / 100;
    html += createStepHTML({
        expression: `<span class="value-percent">${pourcentage}%</span> = ${pourcentage} ÷ 100 = <span class="value-highlight">${decimal}</span>`,
        explanation: '📍 Étape 1 : Convertir le pourcentage en nombre décimal'
    });

    // Étape 2: Multiplier
    const resultat = decimal * valeur;
    html += createStepHTML({
        expression: `<span class="value-highlight">${decimal}</span> × <span class="value-initial">${valeur}</span> = <span class="value-result">${formatNumber(resultat)}</span>`,
        explanation: '📍 Étape 2 : Multiplier le nombre décimal par la valeur'
    });

    // Barre visuelle
    html += `<div class="percentage-bar">
        <div class="percentage-bar-container">
            <div class="percentage-bar-fill" style="width: ${pourcentage}%;">${pourcentage}%</div>
        </div>
        <div class="percentage-bar-label">${pourcentage}% de ${valeur} = ${formatNumber(resultat)}</div>
    </div>`;

    // Résultat final
    html += createResultHTML(`<span class="value-percent">${pourcentage}%</span> de <span class="value-initial">${valeur}</span> = <span class="value-result">${formatNumber(resultat)}</span>`);

    return html;
}

/**
 * Résout: X sur Y = ?%
 */
function solveTrouver(partie, total) {
    let html = '';

    // Formule
    html += `<div class="formula-box">
        <div class="formula-title">📐 Formule</div>
        <div class="formula-content">${partie} sur ${total} = ? %</div>
    </div>`;

    if (total === 0) {
        html += createAlertHTML('warning', 'Division par zéro impossible !');
        return html;
    }

    // Étape 1: Division
    const fraction = partie / total;
    html += createStepHTML({
        expression: `<span class="value-highlight">${partie}</span> ÷ <span class="value-initial">${total}</span> = ${formatNumber(fraction)}`,
        explanation: '📍 Étape 1 : Diviser la partie par le total'
    });

    // Étape 2: Multiplier par 100
    const pourcentage = fraction * 100;
    html += createStepHTML({
        expression: `${formatNumber(fraction)} × 100 = <span class="value-percent">${formatNumber(pourcentage)}%</span>`,
        explanation: '📍 Étape 2 : Multiplier par 100 pour obtenir le pourcentage'
    });

    // Barre visuelle
    html += `<div class="percentage-bar">
        <div class="percentage-bar-container">
            <div class="percentage-bar-fill" style="width: ${Math.min(pourcentage, 100)}%;">${formatNumber(pourcentage)}%</div>
        </div>
        <div class="percentage-bar-label">${partie} représente ${formatNumber(pourcentage)}% de ${total}</div>
    </div>`;

    // Résultat final
    html += createResultHTML(`<span class="value-highlight">${partie}</span> représente <span class="value-percent">${formatNumber(pourcentage)}%</span> de <span class="value-initial">${total}</span>`);

    return html;
}

/**
 * Résout: valeur + X% = ?
 */
function solveAugmentation(valeurInitiale, pourcentage) {
    let html = '';

    // Formule
    html += `<div class="formula-box">
        <div class="formula-title">📐 Augmentation</div>
        <div class="formula-content">${valeurInitiale} + ${pourcentage}% = ?</div>
    </div>`;

    // Méthode 1: Calculer l'augmentation
    const augmentation = (pourcentage / 100) * valeurInitiale;
    html += createStepHTML({
        expression: `Augmentation = <span class="value-percent">${pourcentage}%</span> × <span class="value-initial">${valeurInitiale}</span> = <span class="value-highlight">${formatNumber(augmentation)}</span>`,
        explanation: '📍 Étape 1 : Calculer le montant de l\'augmentation'
    });

    const resultat = valeurInitiale + augmentation;
    html += createStepHTML({
        expression: `<span class="value-initial">${valeurInitiale}</span> + <span class="value-highlight">${formatNumber(augmentation)}</span> = <span class="value-result">${formatNumber(resultat)}</span>`,
        explanation: '📍 Étape 2 : Ajouter l\'augmentation à la valeur initiale'
    });

    // Comparaison visuelle
    html += `<div class="comparison-box">
        <div class="comparison-item before">
            <div class="comparison-label">Avant</div>
            <div class="comparison-value">${valeurInitiale}</div>
        </div>
        <div class="comparison-arrow">→</div>
        <div class="comparison-item after">
            <div class="comparison-label">Après +${pourcentage}%</div>
            <div class="comparison-value">${formatNumber(resultat)}</div>
        </div>
    </div>`;

    // Méthode alternative avec coefficient
    const coef = 1 + pourcentage / 100;
    html += `<div class="method-alt">
        <div class="method-alt-title">💡 Méthode rapide : coefficient multiplicateur</div>
        <div class="method-alt-content">
            <p>Augmenter de ${pourcentage}% revient à multiplier par <strong>${formatNumber(coef)}</strong></p>
            <div class="method-alt-formula">${valeurInitiale} × ${formatNumber(coef)} = ${formatNumber(resultat)}</div>
        </div>
    </div>`;

    // Coefficient box
    html += `<div class="coefficient-box">
        <div class="coefficient-label">Coefficient multiplicateur</div>
        <div class="coefficient-value">${formatNumber(coef)}</div>
        <div class="coefficient-explanation">Pour augmenter de ${pourcentage}%, on multiplie par ${formatNumber(coef)}</div>
    </div>`;

    html += createResultHTML(`<span class="value-initial">${valeurInitiale}</span> + <span class="value-percent">${pourcentage}%</span> = <span class="value-result">${formatNumber(resultat)}</span>`);

    return html;
}

/**
 * Résout: valeur - X% = ?
 */
function solveReduction(valeurInitiale, pourcentage) {
    let html = '';
    
    html += createStepHTML({
        expression: `${valeurInitiale} − ${pourcentage}%`,
        explanation: 'Réduire une valeur d\'un pourcentage'
    });
    
    const reduction = (pourcentage / 100) * valeurInitiale;
    
    html += createStepHTML({
        expression: `Réduction = ${pourcentage}% × ${valeurInitiale} = ${formatNumber(reduction)}`,
        explanation: 'Calculer le montant de la réduction'
    });
    
    const resultat = valeurInitiale - reduction;
    
    html += createStepHTML({
        expression: `${valeurInitiale} − ${formatNumber(reduction)} = ${formatNumber(resultat)}`,
        explanation: 'Soustraire la réduction de la valeur initiale'
    });
    
    // Méthode alternative
    const coef = 1 - pourcentage / 100;
    html += `
        <div class="step" style="background: var(--info-light); border-left-color: var(--info);">
            <div class="step-expression">💡 Méthode rapide : coefficient multiplicateur</div>
            <div class="step-explanation">
                Réduire de ${pourcentage}% = multiplier par ${coef}<br>
                ${valeurInitiale} × ${coef} = ${formatNumber(resultat)}
            </div>
        </div>
    `;
    
    html += createResultHTML(`${valeurInitiale} − ${pourcentage}% = <strong>${formatNumber(resultat)}</strong>`);
    
    return html;
}

/**
 * Résout: Après ±X%, on a Y. Valeur initiale = ?
 */
function solveRetrouver(valeurFinale, pourcentage, isAugmentation) {
    let html = '';
    
    const signe = isAugmentation ? '+' : '−';
    const mot = isAugmentation ? 'augmentation' : 'réduction';
    
    html += createStepHTML({
        expression: `Après ${signe}${pourcentage}%, on obtient ${valeurFinale}`,
        explanation: `Retrouver la valeur initiale avant ${mot}`
    });
    
    const coef = isAugmentation 
        ? 1 + pourcentage / 100 
        : 1 - pourcentage / 100;
    
    html += createStepHTML({
        expression: `Coefficient multiplicateur = ${coef}`,
        explanation: isAugmentation 
            ? `+${pourcentage}% signifie × ${coef}`
            : `−${pourcentage}% signifie × ${coef}`
    });
    
    html += createStepHTML({
        expression: `Valeur initiale × ${coef} = ${valeurFinale}`,
        explanation: 'L\'équation à résoudre'
    });
    
    const valeurInitiale = valeurFinale / coef;
    
    html += createStepHTML({
        expression: `Valeur initiale = ${valeurFinale} ÷ ${coef} = ${formatNumber(valeurInitiale)}`,
        explanation: 'Diviser par le coefficient'
    });
    
    // Vérification
    const verif = isAugmentation 
        ? valeurInitiale * (1 + pourcentage / 100)
        : valeurInitiale * (1 - pourcentage / 100);
    
    html += `
        <div class="verification">
            <div class="verification-title">✓ Vérification</div>
            <div>${formatNumber(valeurInitiale)} ${signe} ${pourcentage}% = ${formatNumber(valeurInitiale)} × ${coef} = ${formatNumber(verif)} ✓</div>
        </div>
    `;
    
    html += createResultHTML(`Valeur initiale = <strong>${formatNumber(valeurInitiale)}</strong>`);
    
    return html;
}

/**
 * Change le type d'exercice
 * @param {string} type 
 */
function changePourcentageType(type) {
    PourcentagesState.currentType = type;
    
    // Masquer tous les groupes d'inputs
    document.querySelectorAll('.input-group').forEach(el => {
        el.classList.add('hidden');
    });
    
    // Afficher le bon groupe
    const groupMap = {
        'calculer': 'inputsCalculer',
        'trouver': 'inputsTrouver',
        'augmentation': 'inputsVariation',
        'reduction': 'inputsVariation',
        'retrouver': 'inputsRetrouver'
    };
    
    $(groupMap[type]).classList.remove('hidden');
    
    updatePourcentageDisplay();
}

/**
 * Initialise la page pourcentages
 */
function initPourcentagesPage() {
    initTypeSelector('.type-btn', changePourcentageType);
    
    $('generateBtn').addEventListener('click', generatePourcentage);
    $('solveBtn').addEventListener('click', solvePourcentage);
    
    document.querySelectorAll('input, select').forEach(el => {
        el.addEventListener('input', updatePourcentageDisplay);
        el.addEventListener('change', updatePourcentageDisplay);
    });
    
    updatePourcentageDisplay();
}

// Export pour les tests
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        solveCalculer,
        solveTrouver,
        solveAugmentation,
        solveReduction,
        solveRetrouver
    };
}
