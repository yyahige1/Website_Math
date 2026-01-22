/* ========================================
   FACTORISATION.TEST.JS - Tests pour la logique de factorisation
   ======================================== */

const { gcd, isSquare } = require('../js/utils.js');

/**
 * Factorise par facteur commun: ax + b = pgcd(a,b) * (a/pgcd * x + b/pgcd)
 * @returns {Object} { factor, innerA, innerB }
 */
function factoriseFacteurCommun(a, b) {
    const pgcd = gcd(a, b);
    return {
        factor: pgcd,
        innerA: a / pgcd,
        innerB: b / pgcd
    };
}

/**
 * Vérifie si une expression est une différence de carrés: a²x² - b²
 * @returns {Object} { isValid, a, b }
 */
function checkDiffCarres(coefX2, constante) {
    if (constante >= 0) return { isValid: false };
    
    const a2 = coefX2;
    const b2 = Math.abs(constante);
    
    if (!isSquare(a2) || !isSquare(b2)) {
        return { isValid: false };
    }
    
    return {
        isValid: true,
        a: Math.sqrt(a2),
        b: Math.sqrt(b2)
    };
}

/**
 * Vérifie si une expression est un carré parfait: a²x² ± 2abx + b²
 * @returns {Object} { isValid, a, b, isPlus }
 */
function checkCarreParfait(coefX2, coefX, constante) {
    if (!isSquare(coefX2) || !isSquare(constante)) {
        return { isValid: false };
    }
    
    const a = Math.sqrt(coefX2);
    const b = Math.sqrt(constante);
    const expected2ab = 2 * a * b;
    
    if (coefX === expected2ab) {
        return { isValid: true, a, b, isPlus: true };
    } else if (coefX === -expected2ab) {
        return { isValid: true, a, b, isPlus: false };
    }
    
    return { isValid: false };
}

describe('Factorisation par facteur commun', () => {
    
    test('factorisation simple', () => {
        // 6x + 9 = 3(2x + 3)
        const result = factoriseFacteurCommun(6, 9);
        expect(result.factor).toBe(3);
        expect(result.innerA).toBe(2);
        expect(result.innerB).toBe(3);
    });
    
    test('factorisation avec grands nombres', () => {
        // 12x + 18 = 6(2x + 3)
        const result = factoriseFacteurCommun(12, 18);
        expect(result.factor).toBe(6);
        expect(result.innerA).toBe(2);
        expect(result.innerB).toBe(3);
    });
    
    test('factorisation avec nombres premiers entre eux', () => {
        // 7x + 11 = 1(7x + 11)
        const result = factoriseFacteurCommun(7, 11);
        expect(result.factor).toBe(1);
        expect(result.innerA).toBe(7);
        expect(result.innerB).toBe(11);
    });
    
    test('factorisation avec coefficient négatif', () => {
        // -6x + 9 = 3(-2x + 3)
        const result = factoriseFacteurCommun(-6, 9);
        expect(result.factor).toBe(3);
        expect(result.innerA).toBe(-2);
        expect(result.innerB).toBe(3);
    });
    
    test('factorisation avec les deux négatifs', () => {
        // -6x - 9 = 3(-2x - 3)
        const result = factoriseFacteurCommun(-6, -9);
        expect(result.factor).toBe(3);
        expect(result.innerA).toBe(-2);
        expect(result.innerB).toBe(-3);
    });
    
    test('vérification: facteur × intérieur = original', () => {
        const a = 15, b = 25;
        const result = factoriseFacteurCommun(a, b);
        expect(result.factor * result.innerA).toBe(a);
        expect(result.factor * result.innerB).toBe(b);
    });
});

describe('Différence de carrés: a²x² - b²', () => {
    
    test('x² - 9 = (x-3)(x+3)', () => {
        const result = checkDiffCarres(1, -9);
        expect(result.isValid).toBe(true);
        expect(result.a).toBe(1);
        expect(result.b).toBe(3);
    });
    
    test('4x² - 25 = (2x-5)(2x+5)', () => {
        const result = checkDiffCarres(4, -25);
        expect(result.isValid).toBe(true);
        expect(result.a).toBe(2);
        expect(result.b).toBe(5);
    });
    
    test('9x² - 16 = (3x-4)(3x+4)', () => {
        const result = checkDiffCarres(9, -16);
        expect(result.isValid).toBe(true);
        expect(result.a).toBe(3);
        expect(result.b).toBe(4);
    });
    
    test('x² + 9 n\'est pas une différence de carrés', () => {
        const result = checkDiffCarres(1, 9);
        expect(result.isValid).toBe(false);
    });
    
    test('x² - 5 n\'est pas factorisable (5 pas carré parfait)', () => {
        const result = checkDiffCarres(1, -5);
        expect(result.isValid).toBe(false);
    });
    
    test('2x² - 9 n\'est pas factorisable (2 pas carré parfait)', () => {
        const result = checkDiffCarres(2, -9);
        expect(result.isValid).toBe(false);
    });
});

describe('Carré parfait: a² ± 2ab + b²', () => {
    
    test('x² + 6x + 9 = (x+3)²', () => {
        const result = checkCarreParfait(1, 6, 9);
        expect(result.isValid).toBe(true);
        expect(result.a).toBe(1);
        expect(result.b).toBe(3);
        expect(result.isPlus).toBe(true);
    });
    
    test('x² - 6x + 9 = (x-3)²', () => {
        const result = checkCarreParfait(1, -6, 9);
        expect(result.isValid).toBe(true);
        expect(result.a).toBe(1);
        expect(result.b).toBe(3);
        expect(result.isPlus).toBe(false);
    });
    
    test('4x² + 12x + 9 = (2x+3)²', () => {
        const result = checkCarreParfait(4, 12, 9);
        expect(result.isValid).toBe(true);
        expect(result.a).toBe(2);
        expect(result.b).toBe(3);
        expect(result.isPlus).toBe(true);
    });
    
    test('9x² - 30x + 25 = (3x-5)²', () => {
        const result = checkCarreParfait(9, -30, 25);
        expect(result.isValid).toBe(true);
        expect(result.a).toBe(3);
        expect(result.b).toBe(5);
        expect(result.isPlus).toBe(false);
    });
    
    test('x² + 5x + 9 n\'est pas un carré parfait', () => {
        // 2ab devrait être 6, pas 5
        const result = checkCarreParfait(1, 5, 9);
        expect(result.isValid).toBe(false);
    });
    
    test('x² + 6x + 8 n\'est pas un carré parfait', () => {
        // 8 n'est pas un carré parfait
        const result = checkCarreParfait(1, 6, 8);
        expect(result.isValid).toBe(false);
    });
});

describe('Vérifications algébriques', () => {
    
    test('(a-b)(a+b) = a² - b²', () => {
        for (let a = 1; a <= 5; a++) {
            for (let b = 1; b <= 5; b++) {
                expect((a - b) * (a + b)).toBe(a * a - b * b);
            }
        }
    });
    
    test('(a+b)² = a² + 2ab + b²', () => {
        for (let a = 1; a <= 5; a++) {
            for (let b = 1; b <= 5; b++) {
                expect((a + b) * (a + b)).toBe(a * a + 2 * a * b + b * b);
            }
        }
    });
    
    test('(a-b)² = a² - 2ab + b²', () => {
        for (let a = 1; a <= 5; a++) {
            for (let b = 1; b <= 5; b++) {
                expect((a - b) * (a - b)).toBe(a * a - 2 * a * b + b * b);
            }
        }
    });
});
