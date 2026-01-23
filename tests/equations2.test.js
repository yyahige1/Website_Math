/* ========================================
   TESTS - Équations du 2nd degré
   ======================================== */

const { formatNumber } = require('../js/utils.js');
const { solveByDiscriminant, toCanonicalForm, formatQuadraticEquation } = require('../js/equations2.js');

// Rendre formatNumber global pour equations2.js
global.formatNumber = formatNumber;

describe('Équations du 2nd degré : Discriminant', () => {

    test('Δ > 0 : deux solutions distinctes', () => {
        // x² - 5x + 6 = 0 → solutions: 2 et 3
        const result = solveByDiscriminant(1, -5, 6);

        expect(result.delta).toBe(1);  // (-5)² - 4*1*6 = 25 - 24 = 1
        expect(result.nbSolutions).toBe(2);
        expect(result.x1).toBe(3);
        expect(result.x2).toBe(2);
    });

    test('Δ = 0 : une solution double', () => {
        // x² - 4x + 4 = 0 → solution: 2
        const result = solveByDiscriminant(1, -4, 4);

        expect(result.delta).toBe(0);
        expect(result.nbSolutions).toBe(1);
        expect(result.x0).toBe(2);
    });

    test('Δ < 0 : aucune solution réelle', () => {
        // x² + 2x + 5 = 0
        const result = solveByDiscriminant(1, 2, 5);

        expect(result.delta).toBe(-16);  // 4 - 20 = -16
        expect(result.nbSolutions).toBe(0);
    });

    test('Équation avec a ≠ 1', () => {
        // 2x² - 8x + 6 = 0 → solutions: 1 et 3
        const result = solveByDiscriminant(2, -8, 6);

        expect(result.delta).toBe(16);  // 64 - 48 = 16
        expect(result.nbSolutions).toBe(2);
        expect(result.x1).toBe(3);
        expect(result.x2).toBe(1);
    });

    test('Équation avec coefficients négatifs', () => {
        // -x² + 3x - 2 = 0 → solutions: 1 et 2
        const result = solveByDiscriminant(-1, 3, -2);

        expect(result.delta).toBe(1);  // 9 - 8 = 1
        expect(result.nbSolutions).toBe(2);
        // Vérifier que les solutions sont 1 et 2 (sans se soucier de l'ordre)
        const solutions = [result.x1, result.x2].sort();
        expect(solutions[0]).toBeCloseTo(1);
        expect(solutions[1]).toBeCloseTo(2);
    });

    test('Équation avec c = 0', () => {
        // x² - 4x = 0 → solutions: 0 et 4
        const result = solveByDiscriminant(1, -4, 0);

        expect(result.delta).toBe(16);  // 16 - 0 = 16
        expect(result.nbSolutions).toBe(2);
        expect(result.x1).toBe(4);
        expect(result.x2).toBe(0);
    });

    test('Équation avec b = 0', () => {
        // x² - 9 = 0 → solutions: -3 et 3
        const result = solveByDiscriminant(1, 0, -9);

        expect(result.delta).toBe(36);  // 0 - 4*1*(-9) = 36
        expect(result.nbSolutions).toBe(2);
        expect(result.x1).toBeCloseTo(3);
        expect(result.x2).toBeCloseTo(-3);
    });
});

describe('Équations du 2nd degré : Forme canonique', () => {

    test('Forme canonique basique', () => {
        // x² - 4x + 3 = 0 → (x - 2)² - 1
        const result = toCanonicalForm(1, -4, 3);

        expect(result.alpha).toBe(2);
        expect(result.beta).toBe(-1);
    });

    test('Forme canonique avec a ≠ 1', () => {
        // 2x² - 8x + 6 = 0 → 2(x - 2)² - 2
        const result = toCanonicalForm(2, -8, 6);

        expect(result.alpha).toBe(2);
        expect(result.beta).toBe(-2);
    });

    test('Forme canonique avec b = 0', () => {
        // x² + 3 = 0 → (x - 0)² + 3
        const result = toCanonicalForm(1, 0, 3);

        expect(result.alpha).toBeCloseTo(0);
        expect(result.beta).toBe(3);
    });

    test('Forme canonique avec c = 0', () => {
        // x² - 6x = 0 → (x - 3)² - 9
        const result = toCanonicalForm(1, -6, 0);

        expect(result.alpha).toBe(3);
        expect(result.beta).toBe(-9);
    });

    test('Forme canonique avec coefficients décimaux', () => {
        // 0.5x² - 2x + 1.5 = 0
        const result = toCanonicalForm(0.5, -2, 1.5);

        expect(result.alpha).toBe(2);
        expect(result.beta).toBeCloseTo(-0.5);
    });
});

describe('Équations du 2nd degré : Formatage', () => {

    test('Formatage équation standard', () => {
        const eq = formatQuadraticEquation(1, -5, 6);
        expect(eq).toBe('x² - 5x + 6 = 0');
    });

    test('Formatage avec a ≠ 1', () => {
        const eq = formatQuadraticEquation(2, 3, -4);
        expect(eq).toBe('2x² + 3x - 4 = 0');
    });

    test('Formatage avec b = 0', () => {
        const eq = formatQuadraticEquation(1, 0, -9);
        expect(eq).toBe('x² - 9 = 0');
    });

    test('Formatage avec c = 0', () => {
        const eq = formatQuadraticEquation(1, -4, 0);
        expect(eq).toBe('x² - 4x = 0');
    });

    test('Formatage avec a = -1', () => {
        const eq = formatQuadraticEquation(-1, 2, 3);
        expect(eq).toBe('-x² + 2x + 3 = 0');
    });

    test('Formatage avec tous coefficients négatifs', () => {
        const eq = formatQuadraticEquation(-2, -3, -1);
        expect(eq).toBe('-2x² - 3x - 1 = 0');
    });
});

describe('Équations du 2nd degré : Cas particuliers', () => {

    test('Solutions entières simples', () => {
        // x² - 3x + 2 = 0 → solutions: 1 et 2
        const result = solveByDiscriminant(1, -3, 2);

        expect(result.nbSolutions).toBe(2);
        expect(result.x1).toBe(2);
        expect(result.x2).toBe(1);
    });

    test('Équation du type x² = k avec k > 0', () => {
        // x² - 16 = 0 → solutions: -4 et 4
        const result = solveByDiscriminant(1, 0, -16);

        expect(result.nbSolutions).toBe(2);
        expect(result.x1).toBeCloseTo(4);
        expect(result.x2).toBeCloseTo(-4);
    });

    test('Équation du type x² = k avec k < 0', () => {
        // x² + 16 = 0 → pas de solution
        const result = solveByDiscriminant(1, 0, 16);

        expect(result.nbSolutions).toBe(0);
        expect(result.delta).toBe(-64);
    });

    test('Équation avec solutions décimales', () => {
        // x² - x - 1 = 0 → solutions: (1±√5)/2
        const result = solveByDiscriminant(1, -1, -1);

        expect(result.nbSolutions).toBe(2);
        expect(result.delta).toBe(5);
        expect(result.x1).toBeCloseTo((1 + Math.sqrt(5)) / 2);
        expect(result.x2).toBeCloseTo((1 - Math.sqrt(5)) / 2);
    });

    test('Vérification somme et produit des racines', () => {
        // x² - 7x + 12 = 0 → solutions: 3 et 4
        // S = 3 + 4 = 7 = -b/a
        // P = 3 × 4 = 12 = c/a
        const result = solveByDiscriminant(1, -7, 12);

        const somme = result.x1 + result.x2;
        const produit = result.x1 * result.x2;

        expect(somme).toBeCloseTo(7);
        expect(produit).toBeCloseTo(12);
    });
});

describe('Équations du 2nd degré : Validation cohérence', () => {

    test('Cohérence discriminant et forme canonique (Δ > 0)', () => {
        const a = 1, b = -6, c = 8;

        const discResult = solveByDiscriminant(a, b, c);
        const canonResult = toCanonicalForm(a, b, c);

        // Vérifier que Δ = -4aβ
        const deltaFromCanon = -4 * a * canonResult.beta;
        expect(deltaFromCanon).toBeCloseTo(discResult.delta);

        // Vérifier que les solutions coïncident
        expect(discResult.nbSolutions).toBe(2);
        // Solutions depuis forme canonique : α ± √(-β/a)
        const x1Canon = canonResult.alpha + Math.sqrt(-canonResult.beta / a);
        const x2Canon = canonResult.alpha - Math.sqrt(-canonResult.beta / a);

        expect(discResult.x1).toBeCloseTo(x1Canon);
        expect(discResult.x2).toBeCloseTo(x2Canon);
    });

    test('Cohérence discriminant et forme canonique (Δ = 0)', () => {
        const a = 1, b = -6, c = 9;  // (x-3)²

        const discResult = solveByDiscriminant(a, b, c);
        const canonResult = toCanonicalForm(a, b, c);

        expect(discResult.delta).toBe(0);
        expect(discResult.nbSolutions).toBe(1);
        expect(canonResult.beta).toBe(0);
        expect(discResult.x0).toBe(canonResult.alpha);
    });

    test('Cohérence discriminant et forme canonique (Δ < 0)', () => {
        const a = 1, b = 2, c = 5;

        const discResult = solveByDiscriminant(a, b, c);
        const canonResult = toCanonicalForm(a, b, c);

        expect(discResult.delta).toBeLessThan(0);
        expect(discResult.nbSolutions).toBe(0);
        expect(canonResult.beta).toBeGreaterThan(0);  // β > 0 quand Δ < 0 (pour a > 0)
    });
});
