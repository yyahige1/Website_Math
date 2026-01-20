/* ========================================
   UTILS.JS - Fonctions utilitaires pures
   ======================================== */

/**
 * Calcule le PGCD de deux nombres
 * @param {number} a 
 * @param {number} b 
 * @returns {number}
 */
function gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    if (a === 0) return b;
    if (b === 0) return a;
    while (b) {
        [a, b] = [b, a % b];
    }
    return a;
}

/**
 * Génère un entier aléatoire entre min et max (inclus)
 * @param {number} min 
 * @param {number} max 
 * @returns {number}
 */
function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Génère un coefficient aléatoire, avec option pour éviter zéro et autoriser négatifs
 * @param {number} min 
 * @param {number} max 
 * @param {boolean} allowNegative 
 * @param {boolean} avoidZero 
 * @returns {number}
 */
function randCoef(min = 1, max = 10, allowNegative = false, avoidZero = true) {
    let n;
    do {
        n = randInt(min, max);
        if (allowNegative && Math.random() < 0.3) {
            n = -n;
        }
    } while (avoidZero && n === 0);
    return n;
}

/**
 * Formate un terme algébrique (ex: 3x², -x, +5)
 * @param {number} coef - Le coefficient
 * @param {string} variable - La variable (ex: 'x', 'x²', '')
 * @param {boolean} isFirst - Si c'est le premier terme (pas de + devant)
 * @returns {string}
 */
function formatTerm(coef, variable, isFirst) {
    if (coef === 0) return isFirst ? '0' : '';
    
    const sign = isFirst ? (coef < 0 ? '−' : '') : (coef > 0 ? ' + ' : ' − ');
    const abs = Math.abs(coef);
    
    if (!variable) return sign + abs;
    if (abs === 1) return sign + variable;
    return sign + abs + variable;
}

/**
 * Formate un nombre (arrondit si décimal)
 * @param {number} num 
 * @returns {number|string}
 */
function formatNumber(num) {
    if (Number.isInteger(num)) return num;
    return Math.round(num * 1000) / 1000;
}

/**
 * Formate une fraction simplifiée
 * @param {number} numerator 
 * @param {number} denominator 
 * @returns {string}
 */
function formatFraction(numerator, denominator) {
    if (denominator === 1) return numerator.toString();
    if (denominator === -1) return (-numerator).toString();
    
    const divisor = gcd(numerator, denominator);
    let num = numerator / divisor;
    let den = denominator / divisor;
    
    if (den < 0) {
        num = -num;
        den = -den;
    }
    
    if (den === 1) return num.toString();
    return `${num}/${den}`;
}

/**
 * Formate un coefficient devant une variable (gère le cas 1 et -1)
 * @param {number} coef 
 * @param {string} variable 
 * @returns {string}
 */
function formatCoefVar(coef, variable) {
    if (coef === 1) return variable;
    if (coef === -1) return '−' + variable;
    return coef + variable;
}

/**
 * Vérifie si un nombre est un carré parfait
 * @param {number} n 
 * @returns {boolean}
 */
function isSquare(n) {
    if (n < 0) return false;
    const sqrt = Math.sqrt(n);
    return sqrt === Math.floor(sqrt);
}

/**
 * Mélange un tableau (Fisher-Yates)
 * @param {Array} arr 
 */
function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

// Export pour les tests (si module)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        gcd,
        randInt,
        randCoef,
        formatTerm,
        formatNumber,
        formatFraction,
        formatCoefVar,
        isSquare,
        shuffleArray
    };
}
