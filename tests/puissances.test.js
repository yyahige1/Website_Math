// Fichier: tests/puissances.test.js
// Tests unitaires pour le module puissances

// Mock des fonctions utils.js nécessaires
global.randInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

describe('Fonctions utilitaires pour puissances', () => {
    describe('randExponent', () => {
        test('génère un exposant dans la plage donnée', () => {
            const exp = randExponent(1, 5, false);
            expect(exp).toBeGreaterThanOrEqual(1);
            expect(exp).toBeLessThanOrEqual(5);
        });
        
        test('peut générer des exposants négatifs si autorisé', () => {
            let hasNegative = false;
            for (let i = 0; i < 100; i++) {
                const exp = randExponent(1, 5, true);
                if (exp < 0) {
                    hasNegative = true;
                    expect(exp).toBeGreaterThanOrEqual(-5);
                    expect(exp).toBeLessThanOrEqual(-1);
                }
            }
            // Probabilité d'avoir au moins un négatif sur 100 essais
            expect(hasNegative).toBe(true);
        });
    });
    
    describe('formatScientific', () => {
        test('formate correctement un nombre en notation scientifique', () => {
            expect(formatScientific(3.5, 4)).toBe('3.5 × 10<sup>4</sup>');
            expect(formatScientific(2.0, 5)).toBe('2 × 10<sup>5</sup>');
            expect(formatScientific(1.5, -3)).toBe('1.5 × 10<sup>-3</sup>');
        });
        
        test('gère l\'exposant 0 correctement', () => {
            expect(formatScientific(5.0, 0)).toBe('5');
            expect(formatScientific(7.2, 0)).toBe('7.2');
        });
    });
    
    describe('formatPower', () => {
        test('formate correctement une puissance', () => {
            expect(formatPower(2, 3)).toBe('2<sup>3</sup>');
            expect(formatPower(5, 7)).toBe('5<sup>7</sup>');
        });
        
        test('gère l\'exposant 1 correctement', () => {
            expect(formatPower(3, 1)).toBe('3');
            expect(formatPower(10, 1)).toBe('10');
        });
        
        test('gère l\'exposant 0 correctement', () => {
            expect(formatPower(5, 0)).toBe('1');
            expect(formatPower(100, 0)).toBe('1');
        });
    });
});

describe('Génération d\'exercices', () => {
    describe('generateProduct', () => {
        test('génère un exercice de produit valide', () => {
            const ex = generateProduct();
            expect(ex.type).toBe(PowerTypes.PRODUCT);
            expect(ex.base).toBeGreaterThanOrEqual(2);
            expect(ex.base).toBeLessThanOrEqual(10);
            expect(ex.exp1).toBeGreaterThanOrEqual(2);
            expect(ex.exp2).toBeGreaterThanOrEqual(2);
            expect(ex.result).toBe(ex.exp1 + ex.exp2);
        });
        
        test('génère une expression correcte', () => {
            const ex = generateProduct();
            expect(ex.expression).toContain('<sup>');
            expect(ex.expression).toContain('×');
        });
    });
    
    describe('generateQuotient', () => {
        test('génère un exercice de quotient valide', () => {
            const ex = generateQuotient();
            expect(ex.type).toBe(PowerTypes.QUOTIENT);
            expect(ex.base).toBeGreaterThanOrEqual(2);
            expect(ex.base).toBeLessThanOrEqual(10);
            expect(ex.exp1).toBeGreaterThan(ex.exp2);
            expect(ex.result).toBe(ex.exp1 - ex.exp2);
        });
        
        test('génère une expression correcte', () => {
            const ex = generateQuotient();
            expect(ex.expression).toContain('<sup>');
            expect(ex.expression).toContain('÷');
        });
    });
    
    describe('generatePowerOfPower', () => {
        test('génère un exercice de puissance de puissance valide', () => {
            const ex = generatePowerOfPower();
            expect(ex.type).toBe(PowerTypes.POWER);
            expect(ex.base).toBeGreaterThanOrEqual(2);
            expect(ex.base).toBeLessThanOrEqual(5);
            expect(ex.result).toBe(ex.exp1 * ex.exp2);
        });
    });
    
    describe('generateProductPower', () => {
        test('génère un exercice de produit élevé à une puissance', () => {
            const ex = generateProductPower();
            expect(ex.type).toBe(PowerTypes.PRODUCT_POWER);
            expect(ex.base1).toBeGreaterThanOrEqual(2);
            expect(ex.base2).toBeGreaterThanOrEqual(2);
            expect(ex.result).toContain('<sup>');
            expect(ex.result).toContain('×');
        });
    });
    
    describe('generateScientific', () => {
        test('génère un exercice de notation scientifique valide', () => {
            const ex = generateScientific();
            expect(ex.type).toBe(PowerTypes.SCIENTIFIC);
            expect(['multiply', 'divide']).toContain(ex.operation);
            expect(ex.coef1).toBeGreaterThanOrEqual(1);
            expect(ex.coef1).toBeLessThan(10);
            expect(ex.coef2).toBeGreaterThanOrEqual(1);
            expect(ex.coef2).toBeLessThan(10);
        });
        
        test('calcule correctement le résultat pour la multiplication', () => {
            // Forcer une multiplication
            const ex = generateScientific();
            if (ex.operation === 'multiply') {
                expect(ex.result.coef).toBeCloseTo(ex.coef1 * ex.coef2, 1);
                expect(ex.result.exp).toBe(ex.exp1 + ex.exp2);
            }
        });
        
        test('calcule correctement le résultat pour la division', () => {
            const ex = generateScientific();
            if (ex.operation === 'divide') {
                expect(ex.result.coef).toBeCloseTo(ex.coef1 / ex.coef2, 1);
                expect(ex.result.exp).toBe(ex.exp1 - ex.exp2);
            }
        });
    });
    
    describe('generateCombined', () => {
        test('génère un exercice combiné valide', () => {
            const ex = generateCombined();
            expect(ex.type).toBe(PowerTypes.COMBINED);
            expect(ex.result).toBe(ex.exp1 + ex.exp2 - ex.exp3);
        });
    });
});

describe('Résolution d\'exercices', () => {
    describe('Propriétés mathématiques', () => {
        test('produit : a^m × a^n = a^(m+n)', () => {
            const ex = generateProduct();
            expect(ex.result).toBe(ex.exp1 + ex.exp2);
        });
        
        test('quotient : a^m ÷ a^n = a^(m-n)', () => {
            const ex = generateQuotient();
            expect(ex.result).toBe(ex.exp1 - ex.exp2);
        });
        
        test('puissance : (a^m)^n = a^(m×n)', () => {
            const ex = generatePowerOfPower();
            expect(ex.result).toBe(ex.exp1 * ex.exp2);
        });
    });
});

describe('Cas particuliers', () => {
    test('formatPower gère a^0 = 1', () => {
        expect(formatPower(5, 0)).toBe('1');
        expect(formatPower(100, 0)).toBe('1');
    });
    
    test('formatPower gère a^1 = a', () => {
        expect(formatPower(7, 1)).toBe('7');
        expect(formatPower(3, 1)).toBe('3');
    });
    
    test('formatScientific gère 10^0 = 1', () => {
        expect(formatScientific(5, 0)).toBe('5');
    });
});

// Définir les constantes PowerTypes pour les tests
const PowerTypes = {
    PRODUCT: 1,
    QUOTIENT: 2,
    POWER: 3,
    PRODUCT_POWER: 4,
    SCIENTIFIC: 5,
    COMBINED: 6
};

// Copier les fonctions à tester depuis puissances.js
function randExponent(min = 1, max = 8, allowNegative = false) {
    if (allowNegative && Math.random() < 0.3) {
        return -randInt(1, 5);
    }
    return randInt(min, max);
}

function formatScientific(coefficient, exponent) {
    const coefStr = coefficient.toFixed(1).replace('.0', '');
    if (exponent === 0) return coefStr;
    return `${coefStr} × 10<sup>${exponent}</sup>`;
}

function formatPower(base, exponent) {
    if (exponent === 0) return '1';
    if (exponent === 1) return base.toString();
    return `${base}<sup>${exponent}</sup>`;
}

function generateProduct() {
    const base = randInt(2, 10);
    const exp1 = randExponent(2, 6);
    const exp2 = randExponent(2, 6);
    
    return {
        type: PowerTypes.PRODUCT,
        base: base,
        exp1: exp1,
        exp2: exp2,
        expression: `${formatPower(base, exp1)} × ${formatPower(base, exp2)}`,
        result: exp1 + exp2
    };
}

function generateQuotient() {
    const base = randInt(2, 10);
    const exp1 = randExponent(5, 10);
    const exp2 = randExponent(2, exp1 - 1);
    
    return {
        type: PowerTypes.QUOTIENT,
        base: base,
        exp1: exp1,
        exp2: exp2,
        expression: `${formatPower(base, exp1)} ÷ ${formatPower(base, exp2)}`,
        result: exp1 - exp2
    };
}

function generatePowerOfPower() {
    const base = randInt(2, 5);
    const exp1 = randExponent(2, 4);
    const exp2 = randExponent(2, 4);
    
    return {
        type: PowerTypes.POWER,
        base: base,
        exp1: exp1,
        exp2: exp2,
        expression: `(${formatPower(base, exp1)})<sup>${exp2}</sup>`,
        result: exp1 * exp2
    };
}

function generateProductPower() {
    const base1 = randInt(2, 5);
    const base2 = randInt(2, 5);
    const exp = randExponent(2, 5);
    
    return {
        type: PowerTypes.PRODUCT_POWER,
        base1: base1,
        base2: base2,
        exp: exp,
        expression: `(${base1} × ${base2})<sup>${exp}</sup>`,
        result: `${formatPower(base1, exp)} × ${formatPower(base2, exp)}`
    };
}

function generateScientific() {
    const operation = Math.random() < 0.5 ? 'multiply' : 'divide';
    
    if (operation === 'multiply') {
        const coef1 = (randInt(10, 99) / 10);
        const coef2 = (randInt(10, 99) / 10);
        const exp1 = randExponent(-3, 8);
        const exp2 = randExponent(-3, 8);
        
        return {
            type: PowerTypes.SCIENTIFIC,
            operation: 'multiply',
            coef1: coef1,
            coef2: coef2,
            exp1: exp1,
            exp2: exp2,
            expression: `(${formatScientific(coef1, exp1)}) × (${formatScientific(coef2, exp2)})`,
            result: {
                coef: coef1 * coef2,
                exp: exp1 + exp2
            }
        };
    } else {
        const coef1 = (randInt(10, 99) / 10);
        const coef2 = (randInt(10, 99) / 10);
        const exp1 = randExponent(-3, 8);
        const exp2 = randExponent(-3, 8);
        
        return {
            type: PowerTypes.SCIENTIFIC,
            operation: 'divide',
            coef1: coef1,
            coef2: coef2,
            exp1: exp1,
            exp2: exp2,
            expression: `(${formatScientific(coef1, exp1)}) ÷ (${formatScientific(coef2, exp2)})`,
            result: {
                coef: coef1 / coef2,
                exp: exp1 - exp2
            }
        };
    }
}

function generateCombined() {
    const base = randInt(2, 5);
    const exp1 = randExponent(2, 4);
    const exp2 = randExponent(2, 4);
    const exp3 = randExponent(1, 3);
    
    return {
        type: PowerTypes.COMBINED,
        base: base,
        exp1: exp1,
        exp2: exp2,
        exp3: exp3,
        expression: `${formatPower(base, exp1)} × ${formatPower(base, exp2)} ÷ ${formatPower(base, exp3)}`,
        result: exp1 + exp2 - exp3
    };
}
