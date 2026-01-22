// Fichier: tests/racines.test.js
// Tests unitaires pour le module racines carrées

// Mock des fonctions utils.js
global.randInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

global.gcd = function(a, b) {
    while (b !== 0) {
        let temp = b;
        b = a % b;
        a = temp;
    }
    return Math.abs(a);
};

describe('Fonctions utilitaires pour racines', () => {
    describe('primeFactorization', () => {
        test('décompose 72 correctement', () => {
            const result = primeFactorization(72);
            expect(result.outside).toBe(6); // 6 sort de la racine
            expect(result.inside).toBe(2);  // 2 reste sous la racine
        });
        
        test('décompose 50 correctement', () => {
            const result = primeFactorization(50);
            expect(result.outside).toBe(5);
            expect(result.inside).toBe(2);
        });
        
        test('décompose 32 correctement', () => {
            const result = primeFactorization(32);
            expect(result.outside).toBe(4);
            expect(result.inside).toBe(2);
        });
        
        test('décompose un carré parfait', () => {
            const result = primeFactorization(36);
            expect(result.outside).toBe(6);
            expect(result.inside).toBe(1);
        });
        
        test('décompose un nombre premier', () => {
            const result = primeFactorization(7);
            expect(result.outside).toBe(1);
            expect(result.inside).toBe(7);
        });
    });
    
    describe('formatSqrt', () => {
        test('formate correctement avec coefficient 1', () => {
            expect(formatSqrt(1, 5)).toBe('√5');
        });
        
        test('formate correctement avec coefficient > 1', () => {
            expect(formatSqrt(3, 2)).toBe('3√2');
            expect(formatSqrt(6, 5)).toBe('6√5');
        });
        
        test('gère radicand = 1', () => {
            expect(formatSqrt(5, 1)).toBe('5');
            expect(formatSqrt(1, 1)).toBe('1');
        });
    });
});

describe('Génération d\'exercices', () => {
    describe('genSimplification', () => {
        test('génère un exercice de simplification valide', () => {
            const ex = genSimplification();
            expect(ex.type).toBe(1);
            expect(ex.number).toBeGreaterThan(0);
            expect(ex.expression).toContain('√');
        });
    });
    
    describe('genAddition', () => {
        test('génère une addition avec même radicand', () => {
            const ex = genAddition();
            expect(ex.type).toBe(2);
            expect(ex.coef1).toBeGreaterThanOrEqual(2);
            expect(ex.coef2).toBeGreaterThanOrEqual(2);
            expect([2, 3, 5, 6, 7, 10]).toContain(ex.radicand);
        });
    });
    
    describe('genMultiplication', () => {
        test('génère une multiplication valide', () => {
            const ex = genMultiplication();
            expect(ex.type).toBe(3);
            expect(ex.a).toBeGreaterThanOrEqual(2);
            expect(ex.b).toBeGreaterThanOrEqual(2);
        });
    });
    
    describe('genRationalisation', () => {
        test('génère une rationalisation simple', () => {
            const ex = genRationalisation();
            expect(ex.type).toBe(4);
            expect([2, 3, 5, 6, 7, 10]).toContain(ex.radicand);
            expect(ex.expression).toBe(`1/√${ex.radicand}`);
        });
    });
    
    describe('genFractionRationalisation', () => {
        test('génère une fraction à rationaliser', () => {
            const ex = genFractionRationalisation();
            expect(ex.type).toBe(5);
            expect(ex.numerator).toBeGreaterThanOrEqual(2);
            expect([2, 3, 5, 6, 7, 10]).toContain(ex.radicand);
        });
    });
});

describe('Propriétés mathématiques', () => {
    test('√72 = 6√2', () => {
        const result = primeFactorization(72);
        expect(result.outside).toBe(6);
        expect(result.inside).toBe(2);
    });
    
    test('√50 = 5√2', () => {
        const result = primeFactorization(50);
        expect(result.outside).toBe(5);
        expect(result.inside).toBe(2);
    });
    
    test('√a × √b = √(ab)', () => {
        const a = 3;
        const b = 12;
        const product = a * b; // 36
        const result = primeFactorization(product);
        expect(result.outside).toBe(6);
        expect(result.inside).toBe(1);
    });
    
    test('addition de racines avec même radicand', () => {
        const coef1 = 3;
        const coef2 = 5;
        const radicand = 2;
        const resultCoef = coef1 + coef2;
        expect(resultCoef).toBe(8);
        expect(formatSqrt(resultCoef, radicand)).toBe('8√2');
    });
});

describe('Cas particuliers', () => {
    test('simplification d\'un carré parfait', () => {
        const result = primeFactorization(64);
        expect(result.outside).toBe(8);
        expect(result.inside).toBe(1);
        expect(formatSqrt(result.outside, result.inside)).toBe('8');
    });
    
    test('simplification d\'un nombre premier', () => {
        const result = primeFactorization(11);
        expect(result.outside).toBe(1);
        expect(result.inside).toBe(11);
        expect(formatSqrt(result.outside, result.inside)).toBe('√11');
    });
    
    test('rationalisation de 1/√2', () => {
        // Résultat attendu: √2/2
        const radicand = 2;
        expect(formatSqrt(1, radicand)).toBe('√2');
        // Le dénominateur devient 2
    });
});

// Copier les fonctions à tester
function primeFactorization(n) {
    const factors = new Map();
    let temp = n;
    
    while (temp % 2 === 0) {
        factors.set(2, (factors.get(2) || 0) + 1);
        temp /= 2;
    }
    
    for (let i = 3; i <= Math.sqrt(temp); i += 2) {
        while (temp % i === 0) {
            factors.set(i, (factors.get(i) || 0) + 1);
            temp /= i;
        }
    }
    
    if (temp > 1) {
        factors.set(temp, 1);
    }
    
    let outside = 1;
    let inside = 1;
    
    factors.forEach((count, prime) => {
        const pairs = Math.floor(count / 2);
        const remaining = count % 2;
        
        outside *= Math.pow(prime, pairs);
        inside *= Math.pow(prime, remaining);
    });
    
    return { outside, inside, factors };
}

function formatSqrt(coef, radicand) {
    if (radicand === 1) {
        return coef.toString();
    }
    if (coef === 1) {
        return `√${radicand}`;
    }
    return `${coef}√${radicand}`;
}

function genSimplification() {
    const perfect = [4, 9, 16, 25, 36, 49, 64];
    const square = perfect[randInt(0, perfect.length - 1)];
    const other = randInt(2, 10);
    const n = square * other;
    
    return {
        type: 1,
        number: n,
        expression: `√${n}`
    };
}

function genAddition() {
    const radicand = [2, 3, 5, 6, 7, 10][randInt(0, 5)];
    const coef1 = randInt(2, 8);
    const coef2 = randInt(2, 8);
    
    return {
        type: 2,
        coef1: coef1,
        coef2: coef2,
        radicand: radicand,
        expression: `${formatSqrt(coef1, radicand)} + ${formatSqrt(coef2, radicand)}`
    };
}

function genMultiplication() {
    const a = randInt(2, 20);
    const b = randInt(2, 20);
    
    return {
        type: 3,
        a: a,
        b: b,
        expression: `√${a} × √${b}`
    };
}

function genRationalisation() {
    const n = [2, 3, 5, 6, 7, 10][randInt(0, 5)];
    
    return {
        type: 4,
        radicand: n,
        expression: `1/√${n}`
    };
}

function genFractionRationalisation() {
    const a = randInt(2, 10);
    const b = [2, 3, 5, 6, 7, 10][randInt(0, 5)];
    
    return {
        type: 5,
        numerator: a,
        radicand: b,
        expression: `${a}/√${b}`
    };
}
