/* ========================================
   REDUCTION.TEST.JS - Tests pour la logique de réduction
   ======================================== */

/**
 * Réduit une liste de termes en regroupant par type
 * @param {Array} terms - [{coef: number, type: 'x²'|'x'|'const'}]
 * @returns {Object} { x2: number, x: number, const: number }
 */
function reduceTerms(terms) {
    const result = { 'x²': 0, 'x': 0, 'const': 0 };
    
    for (const term of terms) {
        result[term.type] += term.coef;
    }
    
    return result;
}

/**
 * Développe et réduit: a(bx + c) + dx + e
 * @returns {Object} { x: number, const: number }
 */
function developpeEtReduit(a, b, c, d, e) {
    // a(bx + c) = abx + ac
    // Total: abx + ac + dx + e = (ab + d)x + (ac + e)
    return {
        x: a * b + d,
        const: a * c + e
    };
}

/**
 * Formate le résultat réduit en string
 */
function formatReduced(coefs) {
    let result = '';
    let isFirst = true;
    
    if (coefs['x²'] !== 0) {
        result += formatCoef(coefs['x²'], 'x²', isFirst);
        isFirst = false;
    }
    if (coefs['x'] !== 0) {
        result += formatCoef(coefs['x'], 'x', isFirst);
        isFirst = false;
    }
    if (coefs['const'] !== 0 || isFirst) {
        result += formatCoef(coefs['const'], '', isFirst);
    }
    
    return result;
}

function formatCoef(coef, variable, isFirst) {
    if (coef === 0 && variable) return '';
    
    const sign = isFirst ? (coef < 0 ? '-' : '') : (coef >= 0 ? ' + ' : ' - ');
    const abs = Math.abs(coef);
    
    if (!variable) return sign + abs;
    if (abs === 1) return sign + variable;
    return sign + abs + variable;
}

describe('Réduction de termes simples', () => {
    
    test('3x + 5x = 8x', () => {
        const terms = [
            { coef: 3, type: 'x' },
            { coef: 5, type: 'x' }
        ];
        const result = reduceTerms(terms);
        expect(result['x']).toBe(8);
    });
    
    test('7 + 3 = 10', () => {
        const terms = [
            { coef: 7, type: 'const' },
            { coef: 3, type: 'const' }
        ];
        const result = reduceTerms(terms);
        expect(result['const']).toBe(10);
    });
    
    test('4x - 2x = 2x', () => {
        const terms = [
            { coef: 4, type: 'x' },
            { coef: -2, type: 'x' }
        ];
        const result = reduceTerms(terms);
        expect(result['x']).toBe(2);
    });
    
    test('5x - 5x = 0', () => {
        const terms = [
            { coef: 5, type: 'x' },
            { coef: -5, type: 'x' }
        ];
        const result = reduceTerms(terms);
        expect(result['x']).toBe(0);
    });
});

describe('Réduction avec x et constantes', () => {
    
    test('3x + 5 + 2x - 3 = 5x + 2', () => {
        const terms = [
            { coef: 3, type: 'x' },
            { coef: 5, type: 'const' },
            { coef: 2, type: 'x' },
            { coef: -3, type: 'const' }
        ];
        const result = reduceTerms(terms);
        expect(result['x']).toBe(5);
        expect(result['const']).toBe(2);
    });
    
    test('7x - 4 - 3x + 10 = 4x + 6', () => {
        const terms = [
            { coef: 7, type: 'x' },
            { coef: -4, type: 'const' },
            { coef: -3, type: 'x' },
            { coef: 10, type: 'const' }
        ];
        const result = reduceTerms(terms);
        expect(result['x']).toBe(4);
        expect(result['const']).toBe(6);
    });
    
    test('-2x + 8 + 5x - 3 = 3x + 5', () => {
        const terms = [
            { coef: -2, type: 'x' },
            { coef: 8, type: 'const' },
            { coef: 5, type: 'x' },
            { coef: -3, type: 'const' }
        ];
        const result = reduceTerms(terms);
        expect(result['x']).toBe(3);
        expect(result['const']).toBe(5);
    });
});

describe('Réduction avec x², x et constantes', () => {
    
    test('2x² + 3x + x² - x + 5 = 3x² + 2x + 5', () => {
        const terms = [
            { coef: 2, type: 'x²' },
            { coef: 3, type: 'x' },
            { coef: 1, type: 'x²' },
            { coef: -1, type: 'x' },
            { coef: 5, type: 'const' }
        ];
        const result = reduceTerms(terms);
        expect(result['x²']).toBe(3);
        expect(result['x']).toBe(2);
        expect(result['const']).toBe(5);
    });
    
    test('5x² - 2x² + 4x - 4x + 7 - 3 = 3x² + 4', () => {
        const terms = [
            { coef: 5, type: 'x²' },
            { coef: -2, type: 'x²' },
            { coef: 4, type: 'x' },
            { coef: -4, type: 'x' },
            { coef: 7, type: 'const' },
            { coef: -3, type: 'const' }
        ];
        const result = reduceTerms(terms);
        expect(result['x²']).toBe(3);
        expect(result['x']).toBe(0);
        expect(result['const']).toBe(4);
    });
});

describe('Développement puis réduction: a(bx + c) + dx + e', () => {
    
    test('2(3x + 4) + 5x - 2 = 11x + 6', () => {
        // 2(3x + 4) = 6x + 8
        // 6x + 8 + 5x - 2 = 11x + 6
        const result = developpeEtReduit(2, 3, 4, 5, -2);
        expect(result.x).toBe(11);
        expect(result.const).toBe(6);
    });
    
    test('3(2x - 1) + 4x + 7 = 10x + 4', () => {
        // 3(2x - 1) = 6x - 3
        // 6x - 3 + 4x + 7 = 10x + 4
        const result = developpeEtReduit(3, 2, -1, 4, 7);
        expect(result.x).toBe(10);
        expect(result.const).toBe(4);
    });
    
    test('-2(x + 3) + 5x - 1 = 3x - 7', () => {
        // -2(x + 3) = -2x - 6
        // -2x - 6 + 5x - 1 = 3x - 7
        const result = developpeEtReduit(-2, 1, 3, 5, -1);
        expect(result.x).toBe(3);
        expect(result.const).toBe(-7);
    });
    
    test('4(x - 2) - 4x + 8 = 0', () => {
        // 4(x - 2) = 4x - 8
        // 4x - 8 - 4x + 8 = 0
        const result = developpeEtReduit(4, 1, -2, -4, 8);
        expect(result.x).toBe(0);
        expect(result.const).toBe(0);
    });
});

describe('Formatage du résultat', () => {
    
    test('format 3x² + 2x + 5', () => {
        const result = formatReduced({ 'x²': 3, 'x': 2, 'const': 5 });
        expect(result).toBe('3x² + 2x + 5');
    });
    
    test('format x² - 2x + 1', () => {
        const result = formatReduced({ 'x²': 1, 'x': -2, 'const': 1 });
        expect(result).toBe('x² - 2x + 1');
    });
    
    test('format -x² + 3', () => {
        const result = formatReduced({ 'x²': -1, 'x': 0, 'const': 3 });
        expect(result).toBe('-x² + 3');
    });
    
    test('format 5x', () => {
        const result = formatReduced({ 'x²': 0, 'x': 5, 'const': 0 });
        expect(result).toBe('5x');
    });
    
    test('format 7 (constante seule)', () => {
        const result = formatReduced({ 'x²': 0, 'x': 0, 'const': 7 });
        expect(result).toBe('7');
    });
    
    test('format 0 (tout nul)', () => {
        const result = formatReduced({ 'x²': 0, 'x': 0, 'const': 0 });
        expect(result).toBe('0');
    });
});

describe('Cas particuliers', () => {
    
    test('tous les termes s\'annulent', () => {
        const terms = [
            { coef: 3, type: 'x' },
            { coef: -3, type: 'x' },
            { coef: 5, type: 'const' },
            { coef: -5, type: 'const' }
        ];
        const result = reduceTerms(terms);
        expect(result['x']).toBe(0);
        expect(result['const']).toBe(0);
    });
    
    test('un seul terme', () => {
        const terms = [{ coef: 7, type: 'x' }];
        const result = reduceTerms(terms);
        expect(result['x']).toBe(7);
        expect(result['const']).toBe(0);
    });
    
    test('beaucoup de termes', () => {
        const terms = [
            { coef: 1, type: 'x' },
            { coef: 2, type: 'x' },
            { coef: 3, type: 'x' },
            { coef: 4, type: 'x' },
            { coef: -5, type: 'x' }
        ];
        const result = reduceTerms(terms);
        expect(result['x']).toBe(5); // 1+2+3+4-5
    });
});
