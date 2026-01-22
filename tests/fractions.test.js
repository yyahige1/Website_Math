/* ========================================
   FRACTIONS.TEST.JS - Tests pour la logique des fractions
   ======================================== */

const { gcd } = require('../js/utils.js');

/**
 * Calcule le PPCM de deux nombres
 */
function lcm(a, b) {
    return Math.abs(a * b) / gcd(a, b);
}

/**
 * Additionne deux fractions et retourne le résultat simplifié
 * @returns {Object} { num, den }
 */
function addFractions(num1, den1, num2, den2) {
    const ppcm = lcm(den1, den2);
    const newNum1 = num1 * (ppcm / den1);
    const newNum2 = num2 * (ppcm / den2);
    const resultNum = newNum1 + newNum2;
    return simplifyFraction(resultNum, ppcm);
}

/**
 * Soustrait deux fractions
 */
function subtractFractions(num1, den1, num2, den2) {
    const ppcm = lcm(den1, den2);
    const newNum1 = num1 * (ppcm / den1);
    const newNum2 = num2 * (ppcm / den2);
    const resultNum = newNum1 - newNum2;
    return simplifyFraction(resultNum, ppcm);
}

/**
 * Multiplie deux fractions
 */
function multiplyFractions(num1, den1, num2, den2) {
    return simplifyFraction(num1 * num2, den1 * den2);
}

/**
 * Divise deux fractions
 */
function divideFractions(num1, den1, num2, den2) {
    return simplifyFraction(num1 * den2, den1 * num2);
}

/**
 * Simplifie une fraction
 */
function simplifyFraction(num, den) {
    if (den === 0) return { num: NaN, den: NaN };
    
    const divisor = gcd(Math.abs(num), Math.abs(den));
    let newNum = num / divisor;
    let newDen = den / divisor;
    
    // Mettre le signe au numérateur
    if (newDen < 0) {
        newNum = -newNum;
        newDen = -newDen;
    }
    
    return { num: newNum, den: newDen };
}

describe('PPCM (Plus Petit Commun Multiple)', () => {
    
    test('lcm(3, 4) = 12', () => {
        expect(lcm(3, 4)).toBe(12);
    });
    
    test('lcm(6, 8) = 24', () => {
        expect(lcm(6, 8)).toBe(24);
    });
    
    test('lcm(5, 5) = 5', () => {
        expect(lcm(5, 5)).toBe(5);
    });
    
    test('lcm(2, 7) = 14 (nombres premiers entre eux)', () => {
        expect(lcm(2, 7)).toBe(14);
    });
    
    test('lcm(12, 18) = 36', () => {
        expect(lcm(12, 18)).toBe(36);
    });
});

describe('Simplification de fractions', () => {
    
    test('12/18 = 2/3', () => {
        const result = simplifyFraction(12, 18);
        expect(result.num).toBe(2);
        expect(result.den).toBe(3);
    });
    
    test('6/8 = 3/4', () => {
        const result = simplifyFraction(6, 8);
        expect(result.num).toBe(3);
        expect(result.den).toBe(4);
    });
    
    test('5/10 = 1/2', () => {
        const result = simplifyFraction(5, 10);
        expect(result.num).toBe(1);
        expect(result.den).toBe(2);
    });
    
    test('7/11 = 7/11 (déjà irréductible)', () => {
        const result = simplifyFraction(7, 11);
        expect(result.num).toBe(7);
        expect(result.den).toBe(11);
    });
    
    test('15/5 = 3/1 (entier)', () => {
        const result = simplifyFraction(15, 5);
        expect(result.num).toBe(3);
        expect(result.den).toBe(1);
    });
    
    test('-6/8 = -3/4 (négatif au numérateur)', () => {
        const result = simplifyFraction(-6, 8);
        expect(result.num).toBe(-3);
        expect(result.den).toBe(4);
    });
    
    test('6/-8 = -3/4 (négatif au dénominateur → déplacé)', () => {
        const result = simplifyFraction(6, -8);
        expect(result.num).toBe(-3);
        expect(result.den).toBe(4);
    });
    
    test('0/5 = 0/1', () => {
        const result = simplifyFraction(0, 5);
        expect(result.num).toBe(0);
        expect(result.den).toBe(1);
    });
});

describe('Addition de fractions', () => {
    
    test('1/4 + 1/4 = 1/2 (même dénominateur)', () => {
        const result = addFractions(1, 4, 1, 4);
        expect(result.num).toBe(1);
        expect(result.den).toBe(2);
    });
    
    test('1/3 + 1/6 = 1/2', () => {
        const result = addFractions(1, 3, 1, 6);
        expect(result.num).toBe(1);
        expect(result.den).toBe(2);
    });
    
    test('2/3 + 1/4 = 11/12', () => {
        const result = addFractions(2, 3, 1, 4);
        expect(result.num).toBe(11);
        expect(result.den).toBe(12);
    });
    
    test('1/2 + 1/3 = 5/6', () => {
        const result = addFractions(1, 2, 1, 3);
        expect(result.num).toBe(5);
        expect(result.den).toBe(6);
    });
    
    test('3/4 + 5/6 = 19/12', () => {
        const result = addFractions(3, 4, 5, 6);
        expect(result.num).toBe(19);
        expect(result.den).toBe(12);
    });
    
    test('1/2 + 1/2 = 1/1 (résultat entier)', () => {
        const result = addFractions(1, 2, 1, 2);
        expect(result.num).toBe(1);
        expect(result.den).toBe(1);
    });
});

describe('Soustraction de fractions', () => {
    
    test('3/4 - 1/4 = 1/2 (même dénominateur)', () => {
        const result = subtractFractions(3, 4, 1, 4);
        expect(result.num).toBe(1);
        expect(result.den).toBe(2);
    });
    
    test('5/6 - 1/3 = 1/2', () => {
        const result = subtractFractions(5, 6, 1, 3);
        expect(result.num).toBe(1);
        expect(result.den).toBe(2);
    });
    
    test('3/4 - 1/6 = 7/12', () => {
        const result = subtractFractions(3, 4, 1, 6);
        expect(result.num).toBe(7);
        expect(result.den).toBe(12);
    });
    
    test('1/3 - 1/2 = -1/6 (résultat négatif)', () => {
        const result = subtractFractions(1, 3, 1, 2);
        expect(result.num).toBe(-1);
        expect(result.den).toBe(6);
    });
    
    test('2/3 - 2/3 = 0/1 (résultat nul)', () => {
        const result = subtractFractions(2, 3, 2, 3);
        expect(result.num).toBe(0);
        expect(result.den).toBe(1);
    });
});

describe('Multiplication de fractions', () => {
    
    test('1/2 × 1/3 = 1/6', () => {
        const result = multiplyFractions(1, 2, 1, 3);
        expect(result.num).toBe(1);
        expect(result.den).toBe(6);
    });
    
    test('2/3 × 3/4 = 1/2 (avec simplification)', () => {
        const result = multiplyFractions(2, 3, 3, 4);
        expect(result.num).toBe(1);
        expect(result.den).toBe(2);
    });
    
    test('3/5 × 5/7 = 3/7', () => {
        const result = multiplyFractions(3, 5, 5, 7);
        expect(result.num).toBe(3);
        expect(result.den).toBe(7);
    });
    
    test('4/9 × 3/8 = 1/6', () => {
        const result = multiplyFractions(4, 9, 3, 8);
        expect(result.num).toBe(1);
        expect(result.den).toBe(6);
    });
    
    test('2/3 × 0/5 = 0', () => {
        const result = multiplyFractions(2, 3, 0, 5);
        expect(result.num).toBe(0);
    });
    
    test('-2/3 × 1/4 = -1/6', () => {
        const result = multiplyFractions(-2, 3, 1, 4);
        expect(result.num).toBe(-1);
        expect(result.den).toBe(6);
    });
});

describe('Division de fractions', () => {
    
    test('1/2 ÷ 1/3 = 3/2', () => {
        const result = divideFractions(1, 2, 1, 3);
        expect(result.num).toBe(3);
        expect(result.den).toBe(2);
    });
    
    test('3/4 ÷ 2/5 = 15/8', () => {
        const result = divideFractions(3, 4, 2, 5);
        expect(result.num).toBe(15);
        expect(result.den).toBe(8);
    });
    
    test('2/3 ÷ 4/3 = 1/2', () => {
        const result = divideFractions(2, 3, 4, 3);
        expect(result.num).toBe(1);
        expect(result.den).toBe(2);
    });
    
    test('5/6 ÷ 5/6 = 1/1 (même fraction)', () => {
        const result = divideFractions(5, 6, 5, 6);
        expect(result.num).toBe(1);
        expect(result.den).toBe(1);
    });
    
    test('3/4 ÷ 3/1 = 1/4 (division par entier)', () => {
        const result = divideFractions(3, 4, 3, 1);
        expect(result.num).toBe(1);
        expect(result.den).toBe(4);
    });
    
    test('-2/5 ÷ 1/3 = -6/5', () => {
        const result = divideFractions(-2, 5, 1, 3);
        expect(result.num).toBe(-6);
        expect(result.den).toBe(5);
    });
});

describe('Cas particuliers et propriétés', () => {
    
    test('a/b + 0 = a/b', () => {
        const result = addFractions(3, 4, 0, 1);
        expect(result.num).toBe(3);
        expect(result.den).toBe(4);
    });
    
    test('a/b × 1 = a/b', () => {
        const result = multiplyFractions(3, 4, 1, 1);
        expect(result.num).toBe(3);
        expect(result.den).toBe(4);
    });
    
    test('a/b ÷ 1 = a/b', () => {
        const result = divideFractions(3, 4, 1, 1);
        expect(result.num).toBe(3);
        expect(result.den).toBe(4);
    });
    
    test('commutativité addition: a/b + c/d = c/d + a/b', () => {
        const r1 = addFractions(2, 3, 1, 4);
        const r2 = addFractions(1, 4, 2, 3);
        expect(r1.num).toBe(r2.num);
        expect(r1.den).toBe(r2.den);
    });
    
    test('commutativité multiplication: a/b × c/d = c/d × a/b', () => {
        const r1 = multiplyFractions(2, 3, 1, 4);
        const r2 = multiplyFractions(1, 4, 2, 3);
        expect(r1.num).toBe(r2.num);
        expect(r1.den).toBe(r2.den);
    });
    
    test('inverse: a/b × b/a = 1', () => {
        const result = multiplyFractions(3, 5, 5, 3);
        expect(result.num).toBe(1);
        expect(result.den).toBe(1);
    });
});
