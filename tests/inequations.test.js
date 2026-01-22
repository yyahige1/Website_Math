/* ========================================
   INEQUATIONS.TEST.JS - Tests pour la logique des inéquations
   ======================================== */

/**
 * Résout une inéquation ax + b [sign] c
 * @param {number} a 
 * @param {number} b 
 * @param {string} sign - '<', '>', '<=', '>='
 * @param {number} c 
 * @returns {Object} { hasInfiniteSolutions, noSolution, value, finalSign }
 */
function solveInequationType1(a, b, sign, c) {
    // Cas a = 0
    if (a === 0) {
        const result = evalInequation(b, sign, c);
        if (result) {
            return { hasInfiniteSolutions: true, noSolution: false, value: null, finalSign: null };
        } else {
            return { hasInfiniteSolutions: false, noSolution: true, value: null, finalSign: null };
        }
    }
    
    // Calculer la valeur limite
    const value = (c - b) / a;
    
    // Inverser le signe si on divise par un négatif
    let finalSign = sign;
    if (a < 0) {
        finalSign = invertSign(sign);
    }
    
    return {
        hasInfiniteSolutions: false,
        noSolution: false,
        value,
        finalSign
    };
}

/**
 * Résout une inéquation ax + b [sign] cx + d
 */
function solveInequationType2(a, b, sign, c, d) {
    const newA = a - c;
    const newC = d - b;
    
    // Cas newA = 0
    if (newA === 0) {
        const result = evalInequation(b, sign, d);
        if (result) {
            return { hasInfiniteSolutions: true, noSolution: false, value: null, finalSign: null };
        } else {
            return { hasInfiniteSolutions: false, noSolution: true, value: null, finalSign: null };
        }
    }
    
    const value = newC / newA;
    
    let finalSign = sign;
    if (newA < 0) {
        finalSign = invertSign(sign);
    }
    
    return {
        hasInfiniteSolutions: false,
        noSolution: false,
        value,
        finalSign
    };
}

/**
 * Évalue une inéquation simple
 */
function evalInequation(left, sign, right) {
    switch (sign) {
        case '<': return left < right;
        case '>': return left > right;
        case '<=': return left <= right;
        case '>=': return left >= right;
        default: return false;
    }
}

/**
 * Inverse le signe d'une inéquation
 */
function invertSign(sign) {
    const inversions = {
        '<': '>',
        '>': '<',
        '<=': '>=',
        '>=': '<='
    };
    return inversions[sign];
}

/**
 * Génère la notation en intervalle
 */
function toInterval(value, sign) {
    switch (sign) {
        case '<': return `] −∞ ; ${value} [`;
        case '<=': return `] −∞ ; ${value} ]`;
        case '>': return `] ${value} ; +∞ [`;
        case '>=': return `[ ${value} ; +∞ [`;
        default: return '';
    }
}

describe('Inversion du signe', () => {
    
    test('< devient >', () => {
        expect(invertSign('<')).toBe('>');
    });
    
    test('> devient <', () => {
        expect(invertSign('>')).toBe('<');
    });
    
    test('<= devient >=', () => {
        expect(invertSign('<=')).toBe('>=');
    });
    
    test('>= devient <=', () => {
        expect(invertSign('>=')).toBe('<=');
    });
});

describe('Évaluation d\'inéquations', () => {
    
    test('5 < 10 est vrai', () => {
        expect(evalInequation(5, '<', 10)).toBe(true);
    });
    
    test('10 < 5 est faux', () => {
        expect(evalInequation(10, '<', 5)).toBe(false);
    });
    
    test('5 <= 5 est vrai', () => {
        expect(evalInequation(5, '<=', 5)).toBe(true);
    });
    
    test('5 < 5 est faux', () => {
        expect(evalInequation(5, '<', 5)).toBe(false);
    });
    
    test('10 > 5 est vrai', () => {
        expect(evalInequation(10, '>', 5)).toBe(true);
    });
    
    test('5 >= 5 est vrai', () => {
        expect(evalInequation(5, '>=', 5)).toBe(true);
    });
});

describe('Inéquations Type 1: ax + b [sign] c', () => {
    
    test('2x + 3 > 7 → x > 2', () => {
        const result = solveInequationType1(2, 3, '>', 7);
        expect(result.value).toBe(2);
        expect(result.finalSign).toBe('>');
    });
    
    test('3x - 6 <= 0 → x <= 2', () => {
        const result = solveInequationType1(3, -6, '<=', 0);
        expect(result.value).toBe(2);
        expect(result.finalSign).toBe('<=');
    });
    
    test('-2x + 4 > 0 → x < 2 (inversion du signe)', () => {
        const result = solveInequationType1(-2, 4, '>', 0);
        expect(result.value).toBe(2);
        expect(result.finalSign).toBe('<'); // Inversé car division par négatif
    });
    
    test('-3x - 6 >= -15 → x <= 3 (inversion)', () => {
        const result = solveInequationType1(-3, -6, '>=', -15);
        expect(result.value).toBe(3);
        expect(result.finalSign).toBe('<=');
    });
    
    test('0x + 5 > 3 → S = ℝ (infinité de solutions)', () => {
        const result = solveInequationType1(0, 5, '>', 3);
        expect(result.hasInfiniteSolutions).toBe(true);
    });
    
    test('0x + 3 > 5 → S = ∅ (aucune solution)', () => {
        const result = solveInequationType1(0, 3, '>', 5);
        expect(result.noSolution).toBe(true);
    });
});

describe('Inéquations Type 2: ax + b [sign] cx + d', () => {
    
    test('3x + 2 > x + 6 → x > 2', () => {
        const result = solveInequationType2(3, 2, '>', 1, 6);
        expect(result.value).toBe(2);
        expect(result.finalSign).toBe('>');
    });
    
    test('5x - 3 <= 2x + 9 → x <= 4', () => {
        const result = solveInequationType2(5, -3, '<=', 2, 9);
        expect(result.value).toBe(4);
        expect(result.finalSign).toBe('<=');
    });
    
    test('2x + 5 > 4x + 1 → x < 2 (inversion)', () => {
        // 2x + 5 > 4x + 1 → -2x > -4 → x < 2
        const result = solveInequationType2(2, 5, '>', 4, 1);
        expect(result.value).toBe(2);
        expect(result.finalSign).toBe('<');
    });
    
    test('3x + 5 > 3x + 2 → S = ℝ', () => {
        // 0 > -3 toujours vrai
        const result = solveInequationType2(3, 5, '>', 3, 2);
        expect(result.hasInfiniteSolutions).toBe(true);
    });
    
    test('3x + 2 > 3x + 5 → S = ∅', () => {
        // 0 > 3 toujours faux
        const result = solveInequationType2(3, 2, '>', 3, 5);
        expect(result.noSolution).toBe(true);
    });
});

describe('Notation en intervalle', () => {
    
    test('x < 5 → ] −∞ ; 5 [', () => {
        expect(toInterval(5, '<')).toBe('] −∞ ; 5 [');
    });
    
    test('x <= 5 → ] −∞ ; 5 ]', () => {
        expect(toInterval(5, '<=')).toBe('] −∞ ; 5 ]');
    });
    
    test('x > 5 → ] 5 ; +∞ [', () => {
        expect(toInterval(5, '>')).toBe('] 5 ; +∞ [');
    });
    
    test('x >= 5 → [ 5 ; +∞ [', () => {
        expect(toInterval(5, '>=')).toBe('[ 5 ; +∞ [');
    });
    
    test('valeur négative: x < -3 → ] −∞ ; -3 [', () => {
        expect(toInterval(-3, '<')).toBe('] −∞ ; -3 [');
    });
});

describe('Vérification des solutions', () => {
    
    test('2x + 3 > 7, x = 3 vérifie', () => {
        const x = 3;
        expect(2 * x + 3 > 7).toBe(true);
    });
    
    test('2x + 3 > 7, x = 2 ne vérifie pas (limite)', () => {
        const x = 2;
        expect(2 * x + 3 > 7).toBe(false); // 7 > 7 est faux
    });
    
    test('2x + 3 > 7, x = 1 ne vérifie pas', () => {
        const x = 1;
        expect(2 * x + 3 > 7).toBe(false);
    });
    
    test('-2x + 4 > 0, x = 1 vérifie (car 1 < 2)', () => {
        const x = 1;
        expect(-2 * x + 4 > 0).toBe(true);
    });
    
    test('-2x + 4 > 0, x = 3 ne vérifie pas (car 3 > 2)', () => {
        const x = 3;
        expect(-2 * x + 4 > 0).toBe(false);
    });
});
