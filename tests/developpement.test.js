/* ========================================
   DEVELOPPEMENT.TEST.JS - Tests pour la logique de développement
   ======================================== */

/**
 * Développe k(ax + b) = kax + kb
 * @returns {Object} { coefX, constante }
 */
function developpeSimple(k, a, b) {
    return {
        coefX: k * a,
        constante: k * b
    };
}

/**
 * Développe (ax + b)(cx + d) = acx² + (ad + bc)x + bd
 * @returns {Object} { coefX2, coefX, constante }
 */
function developpeDouble(a, b, c, d) {
    return {
        coefX2: a * c,
        coefX: a * d + b * c,
        constante: b * d
    };
}

/**
 * Développe (ax + b)² = a²x² + 2abx + b²
 * @returns {Object} { coefX2, coefX, constante }
 */
function developpeCarreSomme(a, b) {
    return {
        coefX2: a * a,
        coefX: 2 * a * b,
        constante: b * b
    };
}

/**
 * Développe (ax - b)² = a²x² - 2abx + b²
 * @returns {Object} { coefX2, coefX, constante }
 */
function developpeCarreDiff(a, b) {
    return {
        coefX2: a * a,
        coefX: -2 * a * b,
        constante: b * b
    };
}

/**
 * Développe (ax + b)(ax - b) = a²x² - b²
 * @returns {Object} { coefX2, constante }
 */
function developpeDiffCarres(a, b) {
    return {
        coefX2: a * a,
        constante: -(b * b)
    };
}

describe('Distributivité simple: k(ax + b)', () => {
    
    test('2(3x + 5) = 6x + 10', () => {
        const result = developpeSimple(2, 3, 5);
        expect(result.coefX).toBe(6);
        expect(result.constante).toBe(10);
    });
    
    test('3(2x - 4) = 6x - 12', () => {
        const result = developpeSimple(3, 2, -4);
        expect(result.coefX).toBe(6);
        expect(result.constante).toBe(-12);
    });
    
    test('-2(3x + 5) = -6x - 10', () => {
        const result = developpeSimple(-2, 3, 5);
        expect(result.coefX).toBe(-6);
        expect(result.constante).toBe(-10);
    });
    
    test('5(x + 1) = 5x + 5', () => {
        const result = developpeSimple(5, 1, 1);
        expect(result.coefX).toBe(5);
        expect(result.constante).toBe(5);
    });
    
    test('-1(-x - 1) = x + 1', () => {
        const result = developpeSimple(-1, -1, -1);
        expect(result.coefX).toBe(1);
        expect(result.constante).toBe(1);
    });
});

describe('Double distributivité: (ax + b)(cx + d)', () => {
    
    test('(x + 2)(x + 3) = x² + 5x + 6', () => {
        const result = developpeDouble(1, 2, 1, 3);
        expect(result.coefX2).toBe(1);
        expect(result.coefX).toBe(5);
        expect(result.constante).toBe(6);
    });
    
    test('(2x + 1)(3x + 4) = 6x² + 11x + 4', () => {
        const result = developpeDouble(2, 1, 3, 4);
        expect(result.coefX2).toBe(6);
        expect(result.coefX).toBe(11);
        expect(result.constante).toBe(4);
    });
    
    test('(x - 2)(x + 5) = x² + 3x - 10', () => {
        const result = developpeDouble(1, -2, 1, 5);
        expect(result.coefX2).toBe(1);
        expect(result.coefX).toBe(3);
        expect(result.constante).toBe(-10);
    });
    
    test('(x - 3)(x - 4) = x² - 7x + 12', () => {
        const result = developpeDouble(1, -3, 1, -4);
        expect(result.coefX2).toBe(1);
        expect(result.coefX).toBe(-7);
        expect(result.constante).toBe(12);
    });
    
    test('(2x - 3)(4x + 5) = 8x² - 2x - 15', () => {
        const result = developpeDouble(2, -3, 4, 5);
        expect(result.coefX2).toBe(8);
        expect(result.coefX).toBe(-2);
        expect(result.constante).toBe(-15);
    });
});

describe('Carré d\'une somme: (ax + b)²', () => {
    
    test('(x + 3)² = x² + 6x + 9', () => {
        const result = developpeCarreSomme(1, 3);
        expect(result.coefX2).toBe(1);
        expect(result.coefX).toBe(6);
        expect(result.constante).toBe(9);
    });
    
    test('(2x + 5)² = 4x² + 20x + 25', () => {
        const result = developpeCarreSomme(2, 5);
        expect(result.coefX2).toBe(4);
        expect(result.coefX).toBe(20);
        expect(result.constante).toBe(25);
    });
    
    test('(3x + 1)² = 9x² + 6x + 1', () => {
        const result = developpeCarreSomme(3, 1);
        expect(result.coefX2).toBe(9);
        expect(result.coefX).toBe(6);
        expect(result.constante).toBe(1);
    });
    
    test('(x + 1)² = x² + 2x + 1', () => {
        const result = developpeCarreSomme(1, 1);
        expect(result.coefX2).toBe(1);
        expect(result.coefX).toBe(2);
        expect(result.constante).toBe(1);
    });
});

describe('Carré d\'une différence: (ax - b)²', () => {
    
    test('(x - 3)² = x² - 6x + 9', () => {
        const result = developpeCarreDiff(1, 3);
        expect(result.coefX2).toBe(1);
        expect(result.coefX).toBe(-6);
        expect(result.constante).toBe(9);
    });
    
    test('(2x - 5)² = 4x² - 20x + 25', () => {
        const result = developpeCarreDiff(2, 5);
        expect(result.coefX2).toBe(4);
        expect(result.coefX).toBe(-20);
        expect(result.constante).toBe(25);
    });
    
    test('(3x - 2)² = 9x² - 12x + 4', () => {
        const result = developpeCarreDiff(3, 2);
        expect(result.coefX2).toBe(9);
        expect(result.coefX).toBe(-12);
        expect(result.constante).toBe(4);
    });
});

describe('Différence de carrés: (ax + b)(ax - b)', () => {
    
    test('(x + 3)(x - 3) = x² - 9', () => {
        const result = developpeDiffCarres(1, 3);
        expect(result.coefX2).toBe(1);
        expect(result.constante).toBe(-9);
    });
    
    test('(2x + 5)(2x - 5) = 4x² - 25', () => {
        const result = developpeDiffCarres(2, 5);
        expect(result.coefX2).toBe(4);
        expect(result.constante).toBe(-25);
    });
    
    test('(3x + 4)(3x - 4) = 9x² - 16', () => {
        const result = developpeDiffCarres(3, 4);
        expect(result.coefX2).toBe(9);
        expect(result.constante).toBe(-16);
    });
});

describe('Propriétés algébriques', () => {
    
    test('(a+b)² équivaut à (a+b)(a+b)', () => {
        for (let a = 1; a <= 5; a++) {
            for (let b = 1; b <= 5; b++) {
                const carre = developpeCarreSomme(a, b);
                const double = developpeDouble(a, b, a, b);
                expect(carre.coefX2).toBe(double.coefX2);
                expect(carre.coefX).toBe(double.coefX);
                expect(carre.constante).toBe(double.constante);
            }
        }
    });
    
    test('(a-b)² équivaut à (a-b)(a-b)', () => {
        for (let a = 1; a <= 5; a++) {
            for (let b = 1; b <= 5; b++) {
                const carre = developpeCarreDiff(a, b);
                const double = developpeDouble(a, -b, a, -b);
                expect(carre.coefX2).toBe(double.coefX2);
                expect(carre.coefX).toBe(double.coefX);
                expect(carre.constante).toBe(double.constante);
            }
        }
    });
    
    test('(a+b)(a-b) donne bien a² - b² (terme en x nul)', () => {
        for (let a = 1; a <= 5; a++) {
            for (let b = 1; b <= 5; b++) {
                const result = developpeDouble(a, b, a, -b);
                expect(result.coefX).toBe(0); // ad + bc = a(-b) + ba = 0
                expect(result.coefX2).toBe(a * a);
                expect(result.constante).toBe(-(b * b));
            }
        }
    });
});
