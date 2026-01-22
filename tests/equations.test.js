/* ========================================
   EQUATIONS.TEST.JS - Tests pour la logique des équations
   ======================================== */

const { gcd, formatFraction } = require('../js/utils.js');

/**
 * Résout une équation ax + b = c
 * @returns {Object} { hasSolution, isInfinite, value }
 */
function solveEquationType1(a, b, c) {
    if (a === 0) {
        if (b === c) {
            return { hasSolution: true, isInfinite: true, value: null };
        } else {
            return { hasSolution: false, isInfinite: false, value: null };
        }
    }
    const value = (c - b) / a;
    return { hasSolution: true, isInfinite: false, value };
}

/**
 * Résout une équation ax + b = cx + d
 * @returns {Object} { hasSolution, isInfinite, value }
 */
function solveEquationType2(a, b, c, d) {
    const newA = a - c;
    if (newA === 0) {
        if (b === d) {
            return { hasSolution: true, isInfinite: true, value: null };
        } else {
            return { hasSolution: false, isInfinite: false, value: null };
        }
    }
    const value = (d - b) / newA;
    return { hasSolution: true, isInfinite: false, value };
}

describe('Équations Type 1: ax + b = c', () => {
    
    test('équation simple avec solution entière', () => {
        // 2x + 3 = 7 → x = 2
        const result = solveEquationType1(2, 3, 7);
        expect(result.hasSolution).toBe(true);
        expect(result.isInfinite).toBe(false);
        expect(result.value).toBe(2);
    });
    
    test('équation avec solution négative', () => {
        // 3x + 10 = 4 → x = -2
        const result = solveEquationType1(3, 10, 4);
        expect(result.hasSolution).toBe(true);
        expect(result.value).toBe(-2);
    });
    
    test('équation avec solution fractionnaire', () => {
        // 4x + 1 = 2 → x = 1/4
        const result = solveEquationType1(4, 1, 2);
        expect(result.hasSolution).toBe(true);
        expect(result.value).toBe(0.25);
    });
    
    test('équation avec coefficient a négatif', () => {
        // -2x + 6 = 0 → x = 3
        const result = solveEquationType1(-2, 6, 0);
        expect(result.hasSolution).toBe(true);
        expect(result.value).toBe(3);
    });
    
    test('équation sans solution (a=0, b≠c)', () => {
        // 0x + 5 = 3 → impossible
        const result = solveEquationType1(0, 5, 3);
        expect(result.hasSolution).toBe(false);
        expect(result.isInfinite).toBe(false);
    });
    
    test('équation avec infinité de solutions (a=0, b=c)', () => {
        // 0x + 5 = 5 → tout x est solution
        const result = solveEquationType1(0, 5, 5);
        expect(result.hasSolution).toBe(true);
        expect(result.isInfinite).toBe(true);
    });
    
    test('équation avec x = 0', () => {
        // 5x + 0 = 0 → x = 0
        const result = solveEquationType1(5, 0, 0);
        expect(result.hasSolution).toBe(true);
        expect(result.value).toBe(0);
    });
});

describe('Équations Type 2: ax + b = cx + d', () => {
    
    test('équation simple', () => {
        // 3x + 5 = 2x + 11 → x = 6
        const result = solveEquationType2(3, 5, 2, 11);
        expect(result.hasSolution).toBe(true);
        expect(result.value).toBe(6);
    });
    
    test('équation avec solution négative', () => {
        // 5x + 3 = 8x + 12 → -3x = 9 → x = -3
        const result = solveEquationType2(5, 3, 8, 12);
        expect(result.hasSolution).toBe(true);
        expect(result.value).toBe(-3);
    });
    
    test('équation avec solution fractionnaire', () => {
        // 2x + 1 = 5x + 2 → -3x = 1 → x = -1/3
        const result = solveEquationType2(2, 1, 5, 2);
        expect(result.hasSolution).toBe(true);
        expect(result.value).toBeCloseTo(-1/3);
    });
    
    test('équation sans solution (a=c, b≠d)', () => {
        // 3x + 5 = 3x + 7 → 0 = 2 impossible
        const result = solveEquationType2(3, 5, 3, 7);
        expect(result.hasSolution).toBe(false);
    });
    
    test('équation avec infinité de solutions (a=c, b=d)', () => {
        // 3x + 5 = 3x + 5 → 0 = 0 toujours vrai
        const result = solveEquationType2(3, 5, 3, 5);
        expect(result.hasSolution).toBe(true);
        expect(result.isInfinite).toBe(true);
    });
    
    test('équation avec coefficients négatifs', () => {
        // -2x + 4 = 3x - 6 → -5x = -10 → x = 2
        const result = solveEquationType2(-2, 4, 3, -6);
        expect(result.hasSolution).toBe(true);
        expect(result.value).toBe(2);
    });
});

describe('Vérification des solutions', () => {
    
    test('vérification type 1', () => {
        // 2x + 3 = 7, x = 2
        const a = 2, b = 3, c = 7, x = 2;
        expect(a * x + b).toBe(c);
    });
    
    test('vérification type 2', () => {
        // 3x + 5 = 2x + 11, x = 6
        const a = 3, b = 5, c = 2, d = 11, x = 6;
        expect(a * x + b).toBe(c * x + d);
    });
});
