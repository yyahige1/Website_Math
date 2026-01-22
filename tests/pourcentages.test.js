/* ========================================
   POURCENTAGES.TEST.JS - Tests pour la logique des pourcentages
   ======================================== */

/**
 * Calcule X% de Y
 */
function calculerPourcentage(pourcentage, valeur) {
    return (pourcentage / 100) * valeur;
}

/**
 * Trouve quel pourcentage X représente de Y
 */
function trouverPourcentage(partie, total) {
    if (total === 0) return NaN;
    return (partie / total) * 100;
}

/**
 * Calcule une augmentation de X%
 */
function augmenter(valeur, pourcentage) {
    return valeur * (1 + pourcentage / 100);
}

/**
 * Calcule une réduction de X%
 */
function reduire(valeur, pourcentage) {
    return valeur * (1 - pourcentage / 100);
}

/**
 * Retrouve la valeur initiale après une variation
 */
function retrouverInitiale(valeurFinale, pourcentage, isAugmentation) {
    const coef = isAugmentation 
        ? 1 + pourcentage / 100 
        : 1 - pourcentage / 100;
    return valeurFinale / coef;
}

/**
 * Calcule le coefficient multiplicateur
 */
function coefficientMultiplicateur(pourcentage, isAugmentation) {
    return isAugmentation 
        ? 1 + pourcentage / 100 
        : 1 - pourcentage / 100;
}

describe('Calculer un pourcentage: X% de Y', () => {
    
    test('25% de 80 = 20', () => {
        expect(calculerPourcentage(25, 80)).toBe(20);
    });
    
    test('10% de 150 = 15', () => {
        expect(calculerPourcentage(10, 150)).toBe(15);
    });
    
    test('50% de 60 = 30', () => {
        expect(calculerPourcentage(50, 60)).toBe(30);
    });
    
    test('100% de 45 = 45', () => {
        expect(calculerPourcentage(100, 45)).toBe(45);
    });
    
    test('0% de 100 = 0', () => {
        expect(calculerPourcentage(0, 100)).toBe(0);
    });
    
    test('15% de 200 = 30', () => {
        expect(calculerPourcentage(15, 200)).toBe(30);
    });
    
    test('33.33% de 90 ≈ 30', () => {
        expect(calculerPourcentage(33.33, 90)).toBeCloseTo(30, 0);
    });
    
    test('200% de 50 = 100 (plus de 100%)', () => {
        expect(calculerPourcentage(200, 50)).toBe(100);
    });
});

describe('Trouver le pourcentage: X sur Y = ?%', () => {
    
    test('20 sur 80 = 25%', () => {
        expect(trouverPourcentage(20, 80)).toBe(25);
    });
    
    test('15 sur 60 = 25%', () => {
        expect(trouverPourcentage(15, 60)).toBe(25);
    });
    
    test('50 sur 100 = 50%', () => {
        expect(trouverPourcentage(50, 100)).toBe(50);
    });
    
    test('75 sur 300 = 25%', () => {
        expect(trouverPourcentage(75, 300)).toBe(25);
    });
    
    test('0 sur 50 = 0%', () => {
        expect(trouverPourcentage(0, 50)).toBe(0);
    });
    
    test('100 sur 100 = 100%', () => {
        expect(trouverPourcentage(100, 100)).toBe(100);
    });
    
    test('150 sur 100 = 150% (plus que le total)', () => {
        expect(trouverPourcentage(150, 100)).toBe(150);
    });
    
    test('division par 0 = NaN', () => {
        expect(trouverPourcentage(50, 0)).toBeNaN();
    });
});

describe('Augmentation: valeur + X%', () => {
    
    test('100 + 20% = 120', () => {
        expect(augmenter(100, 20)).toBe(120);
    });
    
    test('80 + 25% = 100', () => {
        expect(augmenter(80, 25)).toBe(100);
    });
    
    test('50 + 10% = 55', () => {
        expect(augmenter(50, 10)).toBeCloseTo(55);
    });
    
    test('200 + 50% = 300', () => {
        expect(augmenter(200, 50)).toBe(300);
    });
    
    test('100 + 0% = 100', () => {
        expect(augmenter(100, 0)).toBe(100);
    });
    
    test('100 + 100% = 200', () => {
        expect(augmenter(100, 100)).toBe(200);
    });
    
    test('40 + 5% = 42', () => {
        expect(augmenter(40, 5)).toBe(42);
    });
});

describe('Réduction: valeur - X%', () => {
    
    test('100 - 20% = 80', () => {
        expect(reduire(100, 20)).toBe(80);
    });
    
    test('120 - 25% = 90', () => {
        expect(reduire(120, 25)).toBe(90);
    });
    
    test('200 - 50% = 100', () => {
        expect(reduire(200, 50)).toBe(100);
    });
    
    test('80 - 10% = 72', () => {
        expect(reduire(80, 10)).toBe(72);
    });
    
    test('100 - 0% = 100', () => {
        expect(reduire(100, 0)).toBe(100);
    });
    
    test('100 - 100% = 0', () => {
        expect(reduire(100, 100)).toBe(0);
    });
    
    test('150 - 30% = 105', () => {
        expect(reduire(150, 30)).toBe(105);
    });
});

describe('Retrouver la valeur initiale', () => {
    
    test('Après +20%, on a 120 → initiale = 100', () => {
        expect(retrouverInitiale(120, 20, true)).toBe(100);
    });
    
    test('Après -20%, on a 80 → initiale = 100', () => {
        expect(retrouverInitiale(80, 20, false)).toBe(100);
    });
    
    test('Après +25%, on a 100 → initiale = 80', () => {
        expect(retrouverInitiale(100, 25, true)).toBe(80);
    });
    
    test('Après -25%, on a 75 → initiale = 100', () => {
        expect(retrouverInitiale(75, 25, false)).toBe(100);
    });
    
    test('Après +50%, on a 150 → initiale = 100', () => {
        expect(retrouverInitiale(150, 50, true)).toBe(100);
    });
    
    test('Après -50%, on a 50 → initiale = 100', () => {
        expect(retrouverInitiale(50, 50, false)).toBe(100);
    });
    
    test('Après +10%, on a 110 → initiale = 100', () => {
        expect(retrouverInitiale(110, 10, true)).toBeCloseTo(100);
    });
});

describe('Coefficient multiplicateur', () => {
    
    test('+20% → coefficient 1.2', () => {
        expect(coefficientMultiplicateur(20, true)).toBe(1.2);
    });
    
    test('-20% → coefficient 0.8', () => {
        expect(coefficientMultiplicateur(20, false)).toBe(0.8);
    });
    
    test('+50% → coefficient 1.5', () => {
        expect(coefficientMultiplicateur(50, true)).toBe(1.5);
    });
    
    test('-50% → coefficient 0.5', () => {
        expect(coefficientMultiplicateur(50, false)).toBe(0.5);
    });
    
    test('+100% → coefficient 2', () => {
        expect(coefficientMultiplicateur(100, true)).toBe(2);
    });
    
    test('-100% → coefficient 0', () => {
        expect(coefficientMultiplicateur(100, false)).toBe(0);
    });
    
    test('+0% → coefficient 1', () => {
        expect(coefficientMultiplicateur(0, true)).toBe(1);
    });
});

describe('Propriétés et vérifications', () => {
    
    test('augmenter puis réduire du même % ne donne pas la valeur initiale', () => {
        // 100 + 20% = 120, puis 120 - 20% = 96 (pas 100!)
        const apresAugmentation = augmenter(100, 20);
        const apresReduction = reduire(apresAugmentation, 20);
        expect(apresReduction).not.toBe(100);
        expect(apresReduction).toBe(96);
    });
    
    test('réduire puis augmenter du même % ne donne pas la valeur initiale', () => {
        // 100 - 20% = 80, puis 80 + 20% = 96 (pas 100!)
        const apresReduction = reduire(100, 20);
        const apresAugmentation = augmenter(apresReduction, 20);
        expect(apresAugmentation).not.toBe(100);
        expect(apresAugmentation).toBe(96);
    });
    
    test('X% de Y = Y% de X', () => {
        expect(calculerPourcentage(25, 80)).toBe(calculerPourcentage(80, 25));
        expect(calculerPourcentage(15, 60)).toBe(calculerPourcentage(60, 15));
    });
    
    test('retrouver initiale est l\'inverse d\'augmenter', () => {
        const initiale = 100;
        const pourcentage = 25;
        const finale = augmenter(initiale, pourcentage);
        const retrouvee = retrouverInitiale(finale, pourcentage, true);
        expect(retrouvee).toBeCloseTo(initiale);
    });
    
    test('retrouver initiale est l\'inverse de réduire', () => {
        const initiale = 100;
        const pourcentage = 25;
        const finale = reduire(initiale, pourcentage);
        const retrouvee = retrouverInitiale(finale, pourcentage, false);
        expect(retrouvee).toBeCloseTo(initiale);
    });
});
