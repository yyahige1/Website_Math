/* ========================================
   UTILS.TEST.JS - Tests unitaires pour utils.js
   ======================================== */

const {
    gcd,
    randInt,
    formatTerm,
    formatNumber,
    formatFraction,
    formatCoefVar,
    isSquare
} = require('../js/utils.js');

describe('gcd (PGCD)', () => {
    test('gcd de deux nombres positifs', () => {
        expect(gcd(12, 8)).toBe(4);
        expect(gcd(15, 25)).toBe(5);
        expect(gcd(7, 11)).toBe(1);
    });
    
    test('gcd avec des nombres négatifs', () => {
        expect(gcd(-12, 8)).toBe(4);
        expect(gcd(12, -8)).toBe(4);
        expect(gcd(-12, -8)).toBe(4);
    });
    
    test('gcd avec zéro', () => {
        expect(gcd(0, 5)).toBe(5);
        expect(gcd(5, 0)).toBe(5);
        expect(gcd(0, 0)).toBe(0);
    });
});

describe('randInt', () => {
    test('génère des nombres dans la plage', () => {
        for (let i = 0; i < 100; i++) {
            const n = randInt(1, 10);
            expect(n).toBeGreaterThanOrEqual(1);
            expect(n).toBeLessThanOrEqual(10);
        }
    });
    
    test('génère des nombres négatifs', () => {
        for (let i = 0; i < 100; i++) {
            const n = randInt(-10, -1);
            expect(n).toBeGreaterThanOrEqual(-10);
            expect(n).toBeLessThanOrEqual(-1);
        }
    });
});

describe('formatTerm', () => {
    test('premier terme positif', () => {
        expect(formatTerm(3, 'x', true)).toBe('3x');
        expect(formatTerm(1, 'x', true)).toBe('x');
        expect(formatTerm(5, '', true)).toBe('5');
    });
    
    test('premier terme négatif', () => {
        expect(formatTerm(-3, 'x', true)).toBe('−3x');
        expect(formatTerm(-1, 'x', true)).toBe('−x');
        expect(formatTerm(-5, '', true)).toBe('−5');
    });
    
    test('terme suivant positif', () => {
        expect(formatTerm(3, 'x', false)).toBe(' + 3x');
        expect(formatTerm(1, 'x', false)).toBe(' + x');
        expect(formatTerm(5, '', false)).toBe(' + 5');
    });
    
    test('terme suivant négatif', () => {
        expect(formatTerm(-3, 'x', false)).toBe(' − 3x');
        expect(formatTerm(-1, 'x', false)).toBe(' − x');
        expect(formatTerm(-5, '', false)).toBe(' − 5');
    });
    
    test('coefficient zéro', () => {
        expect(formatTerm(0, 'x', true)).toBe('0');
        expect(formatTerm(0, 'x', false)).toBe('');
    });
});

describe('formatNumber', () => {
    test('nombres entiers', () => {
        expect(formatNumber(5)).toBe(5);
        expect(formatNumber(-3)).toBe(-3);
    });
    
    test('nombres décimaux', () => {
        expect(formatNumber(3.14159)).toBe(3.142);
        expect(formatNumber(0.123456)).toBe(0.123);
    });
});

describe('formatFraction', () => {
    test('fractions simplifiables', () => {
        expect(formatFraction(4, 2)).toBe('2');
        expect(formatFraction(6, 4)).toBe('3/2');
        expect(formatFraction(12, 8)).toBe('3/2');
    });
    
    test('dénominateur 1', () => {
        expect(formatFraction(5, 1)).toBe('5');
        expect(formatFraction(-3, 1)).toBe('-3');
    });
    
    test('dénominateur négatif', () => {
        expect(formatFraction(3, -2)).toBe('-3/2');
    });
});

describe('formatCoefVar', () => {
    test('coefficient 1', () => {
        expect(formatCoefVar(1, 'x')).toBe('x');
    });
    
    test('coefficient -1', () => {
        expect(formatCoefVar(-1, 'x')).toBe('−x');
    });
    
    test('autres coefficients', () => {
        expect(formatCoefVar(3, 'x')).toBe('3x');
        expect(formatCoefVar(-5, 'x')).toBe('-5x');
    });
});

describe('isSquare', () => {
    test('carrés parfaits', () => {
        expect(isSquare(0)).toBe(true);
        expect(isSquare(1)).toBe(true);
        expect(isSquare(4)).toBe(true);
        expect(isSquare(9)).toBe(true);
        expect(isSquare(16)).toBe(true);
        expect(isSquare(25)).toBe(true);
    });
    
    test('non carrés parfaits', () => {
        expect(isSquare(2)).toBe(false);
        expect(isSquare(3)).toBe(false);
        expect(isSquare(5)).toBe(false);
        expect(isSquare(10)).toBe(false);
    });
    
    test('nombres négatifs', () => {
        expect(isSquare(-1)).toBe(false);
        expect(isSquare(-4)).toBe(false);
    });
});
