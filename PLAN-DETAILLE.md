# 📋 Plan Détaillé - Prochaines Étapes

**Date**: 5 Février 2026
**État actuel**: 16 modules complétés
**Prochaine cible**: Limites (module 17)

---

## 🎯 Vision Globale

### Objectif Court Terme (1-2 semaines)
Compléter le **trio fondamental Terminale**:
1. ✅ Dérivées (fait)
2. ✅ Suites (fait)
3. ⏳ **Limites** (priorité 1)
4. ⏳ **Primitives/Intégrales** (priorité 2)

### Objectif Moyen Terme (1-2 mois)
- Exponentielles & Logarithmes
- Probabilités
- Statistiques
→ **Total: ~20 modules** (programme Terminale quasiment complet)

### Objectif Long Terme (3-6 mois)
- Trigonométrie
- Vecteurs
- Nombres complexes
- Équations différentielles
→ **Total: ~25 modules** (programme lycée complet)

---

## 📉 Module 17: LIMITES (Priorité 1)

### 🎯 Objectifs Pédagogiques
- Comprendre notion de limite (intuitivement et formellement)
- Maîtriser les opérations sur limites
- Lever les formes indéterminées
- Déterminer asymptotes (verticales, horizontales, obliques)
- Lien avec continuité et dérivabilité

### 📦 Types d'Exercices (6 types)

#### Type 1: Limites de Polynômes en l'Infini
**Exemple**: Déterminer lim(x→+∞) 3x³ - 5x² + 7

**Étapes solution**:
1. Identifier terme de plus haut degré (3x³)
2. Factoriser par ce terme
3. Évaluer limite de chaque facteur
4. Conclure avec règle des signes

**Paramètres**:
- Degré polynôme (2, 3, 4)
- Coefficients (randomisés)
- Sens limite (+∞ ou -∞)

**Difficulté**: ⭐⭐☆☆☆

---

#### Type 2: Limites de Fonctions Rationnelles
**Exemple**: Déterminer lim(x→+∞) (2x² + 3x - 1) / (x² - 4)

**Étapes solution**:
1. Identifier degrés numérateur et dénominateur
2. Cas 1: deg(N) = deg(D) → limite = quotient coefficients dominants
3. Cas 2: deg(N) > deg(D) → limite = ±∞
4. Cas 3: deg(N) < deg(D) → limite = 0
5. Montrer le calcul détaillé (factorisation)

**Paramètres**:
- Degrés numérateur/dénominateur (1-3)
- Coefficients (randomisés)
- Sens limite (+∞, -∞)

**Difficulté**: ⭐⭐⭐☆☆

---

#### Type 3: Limites en un Point (Continuité)
**Exemple**: Déterminer lim(x→2) (x² - 4) / (x - 2)

**Étapes solution**:
1. Tester substitution directe
2. Si forme indéterminée 0/0 → factoriser
3. Simplifier
4. Réévaluer
5. Conclure sur continuité

**Paramètres**:
- Point a (randomisé)
- Type: directe, 0/0, discontinuité

**Difficulté**: ⭐⭐⭐⭐☆

---

#### Type 4: Formes Indéterminées
**Exemple**: Déterminer lim(x→+∞) √(x² + x) - x

**Formes couvertes**:
- ∞ - ∞ (conjugué pour racines)
- 0/0 (factorisation)
- ∞/∞ (terme dominant)
- 0 × ∞ (transformation)

**Étapes solution**:
1. Identifier forme indéterminée
2. Choisir technique (conjugué, factorisation, changement variable)
3. Transformer expression
4. Lever indétermination
5. Calculer limite

**Paramètres**:
- Type forme indéterminée
- Complexité (simple/moyen/difficile)

**Difficulté**: ⭐⭐⭐⭐⭐

---

#### Type 5: Asymptotes
**Exemple**: Déterminer asymptotes de f(x) = (2x² - 3) / (x - 1)

**Types asymptotes**:
- Verticale: x = a (limite infinie en a)
- Horizontale: y = L (limite finie en ±∞)
- Oblique: y = ax + b (div euclidienne ou développement limité)

**Étapes solution**:
1. Chercher asymptotes verticales (annulation dénominateur)
2. Calculer limites en ±∞
3. Si limite infinie en ±∞ → chercher asymptote oblique
4. Tracer graphique avec asymptotes

**Paramètres**:
- Type fonction (rationnelle, avec racine)
- Nombre asymptotes

**Difficulté**: ⭐⭐⭐⭐☆

---

#### Type 6: Limites avec Exponentielle/Logarithme
**Exemple**: Déterminer lim(x→0⁺) x·ln(x)

**Cas traités**:
- lim(x→+∞) e^x / x^n (croissance comparée)
- lim(x→+∞) ln(x) / x (croissance comparée)
- lim(x→0⁺) x·ln(x) (forme 0×∞)
- lim(x→+∞) (1 + 1/x)^x = e

**Étapes solution**:
1. Identifier type limite
2. Appliquer règle croissance comparée
3. Ou transformer forme indéterminée
4. Calculer limite

**Paramètres**:
- Fonction (exp, ln)
- Type limite

**Difficulté**: ⭐⭐⭐⭐⭐

---

### 🛠️ Implémentation Technique

#### Fichiers à Créer
```
limites.html          (~250 lignes)
js/limites.js         (~800 lignes)
```

#### Structure State
```javascript
const LimitesState = {
    currentType: 'polynome_infini',

    // Type 1: Polynôme
    degre_poly: 3,
    coeffs_poly: [3, -5, 0, 7],
    sens_limite: 'plus_infini', // 'plus_infini', 'moins_infini'

    // Type 2: Rationnelle
    num_degre: 2,
    num_coeffs: [2, 3, -1],
    den_degre: 2,
    den_coeffs: [1, 0, -4],

    // Type 3: Point
    point_a: 2,
    type_continuité: 'indeterminee', // 'directe', 'indeterminee', 'discontinue'

    // Type 4: Forme indéterminée
    forme_type: 'inf_moins_inf', // '0_sur_0', 'inf_sur_inf', '0_fois_inf'

    // Type 5: Asymptotes
    // (utilise rationnelle)

    // Type 6: Exp/Ln
    fonction_type: 'exp_sur_poly', // 'ln_sur_poly', 'x_fois_ln'
    exposant: 1
};
```

#### Fonctions Clés
```javascript
// Génération
function generatePolynomeInfini()
function generateRationnelle()
function generatePoint()
function generateFormeIndeterminee()
function generateAsymptotes()
function generateExpLn()

// Résolution
function solvePolynomeInfini()  // Factorisation terme dominant
function solveRationnelle()      // Cas selon degrés
function solvePoint()            // Substitution ou levée indétermination
function solveFormeIndeterminee() // Techniques selon forme
function solveAsymptotes()       // Calcul AV, AH, AO + graphique
function solveExpLn()            // Croissance comparée

// Utilitaires
function evalPolynome(coeffs, x)
function factoriserPolynome(coeffs) // Retourne terme dominant factorié
function divisionEuclidienne(num, den) // Pour asymptote oblique
function limiteCroissanceComparee(type) // exp vs poly, ln vs poly
```

#### Visualisation GraphCanvas

Pour **Type 5 (Asymptotes)**:
```javascript
const graph = new GraphCanvas('canvas-asymptotes', {
    xMin: -10, xMax: 10,
    yMin: -10, yMax: 10,
    gridStep: 1
});

// Tracer fonction rationnelle
graph.plotRationalFunction(num_coeffs, den_coeffs, {
    color: '#667eea',
    thickness: 2
});

// Tracer asymptote verticale
graph.plotVerticalLine(x_asymptote, {
    color: '#ed8936',
    dashed: true,
    label: 'x = ' + x_asymptote
});

// Tracer asymptote horizontale/oblique
graph.plotLine(slope, intercept, {
    color: '#48bb78',
    dashed: true,
    label: 'y = ' + equation
});
```

---

### 📚 Ressources Mathématiques

#### Règles à Implémenter

**Opérations sur limites**:
| L₁ | L₂ | L₁ + L₂ | L₁ × L₂ | L₁ / L₂ |
|----|----|---------|---------|----|
| a | b | a+b | ab | a/b (si b≠0) |
| +∞ | a | +∞ | +∞ ou -∞ | +∞ (si a>0) |
| +∞ | +∞ | +∞ | +∞ | FI |

**Formes Indéterminées** (7 types):
1. 0/0
2. ∞/∞
3. 0 × ∞
4. ∞ - ∞
5. 0⁰
6. ∞⁰
7. 1^∞

**Croissance Comparée**:
- lim(x→+∞) e^x / x^n = +∞ (∀n)
- lim(x→+∞) ln(x) / x^n = 0 (∀n>0)
- lim(x→+∞) x^n / e^x = 0 (∀n)

---

### ✅ Checklist Développement

#### Phase 1: Structure (1-2h)
- [ ] Créer `limites.html` depuis template
- [ ] Créer `js/limites.js` avec State
- [ ] Ajouter lien dans `navigation.js`
- [ ] Setup boutons types (6 boutons)
- [ ] Setup sections paramètres

#### Phase 2: Type 1 - Polynômes (2h)
- [ ] `generatePolynomeInfini()`
- [ ] `solvePolynomeInfini()` avec étapes
- [ ] Tests (deg 2, 3, 4, +∞, -∞)

#### Phase 3: Type 2 - Rationnelles (2-3h)
- [ ] `generateRationnelle()`
- [ ] `solveRationnelle()` avec 3 cas
- [ ] Tests (deg N = D, N > D, N < D)

#### Phase 4: Type 3 - Point (2h)
- [ ] `generatePoint()`
- [ ] `solvePoint()` avec factorisation
- [ ] Tests (directe, 0/0, discontinuité)

#### Phase 5: Type 4 - Formes Indéterminées (3-4h)
- [ ] `generateFormeIndeterminee()`
- [ ] `solveFormeIndeterminee()` avec techniques
- [ ] Tests (∞-∞, 0/0, ∞/∞, 0×∞)

#### Phase 6: Type 5 - Asymptotes (3-4h)
- [ ] `generateAsymptotes()`
- [ ] `solveAsymptotes()` avec graphique
- [ ] Extension GraphCanvas pour rationnelles
- [ ] Tests (AV, AH, AO)

#### Phase 7: Type 6 - Exp/Ln (2-3h)
- [ ] `generateExpLn()`
- [ ] `solveExpLn()` avec croissance comparée
- [ ] Tests (exp/x^n, ln/x, x·ln)

#### Phase 8: Finitions (1-2h)
- [ ] CSS responsive
- [ ] Tests complets tous types
- [ ] Documentation
- [ ] Commit + push

**Temps estimé total**: 18-24h de développement

---

## 🧮 Module 18: PRIMITIVES & INTÉGRALES (Priorité 2)

### 🎯 Objectifs Pédagogiques
- Comprendre primitive comme opération inverse dérivée
- Maîtriser primitives usuelles
- Calculer intégrales définies
- Interpréter géométriquement (aire sous courbe)
- Applications (calcul aires, volumes, moyennes)

### 📦 Types d'Exercices (5-6 types)

#### Type 1: Primitives Usuelles
**Exemple**: Déterminer primitive de f(x) = 3x² - 2x + 5

**Formules**:
- ∫ x^n dx = x^(n+1)/(n+1) + C
- ∫ 1/x dx = ln|x| + C
- ∫ e^x dx = e^x + C
- ∫ sin(x) dx = -cos(x) + C
- ∫ cos(x) dx = sin(x) + C

#### Type 2: Primitives avec Changement de Variable
**Exemple**: ∫ (2x+1)·e^(x²+x) dx

**Technique**: u = x² + x, du = (2x+1)dx

#### Type 3: Intégrales Définies (Calcul d'Aires)
**Exemple**: ∫₀² (x² + 1) dx

**Étapes**:
1. Calculer primitive F(x)
2. Évaluer F(b) - F(a)
3. Interpréter géométriquement (graphique avec aire colorée)

#### Type 4: Intégration par Parties
**Exemple**: ∫ x·e^x dx

**Formule**: ∫ u·v' = u·v - ∫ u'·v

#### Type 5: Aire Entre Deux Courbes
**Exemple**: Aire entre f(x) = x² et g(x) = 2x

**Méthode**: ∫ₐᵇ |f(x) - g(x)| dx

#### Type 6: Valeur Moyenne
**Exemple**: Valeur moyenne de f sur [a,b]

**Formule**: μ = 1/(b-a) · ∫ₐᵇ f(x) dx

---

### 🛠️ Implémentation Technique

#### Fichiers
```
integrales.html
js/integrales.js
```

#### Visualisation
- GraphCanvas pour tracer fonction
- Colorer aire sous courbe (fillRect ou polygon)
- Afficher trapèzes/rectangles pour méthode numérique

**Temps estimé**: 15-20h

---

## 📈 Module 19: EXPONENTIELLES & LOGARITHMES (Priorité 3)

### Types d'Exercices (6-8 types)
1. Équations exponentielles simples
2. Équations logarithmiques
3. Dérivées avec exp/ln
4. Étude de fonction exponentielle
5. Croissance exponentielle (applications réelles)
6. Logarithme décimal (pH, décibels)
7. Primitives exp/ln
8. Équations différentielles y' = ky

**Temps estimé**: 20-25h

---

## 🎲 Module 20: PROBABILITÉS

### Types d'Exercices
1. Probabilités simples (dé, pièce, tirage)
2. Probabilités conditionnelles P(A|B)
3. Arbres de probabilités
4. Loi binomiale B(n, p)
5. Variables aléatoires
6. Espérance, variance, écart-type

**Temps estimé**: 18-22h

---

## 📊 Module 21: STATISTIQUES

### Types d'Exercices
1. Moyenne, médiane, quartiles
2. Variance, écart-type
3. Diagrammes en boîtes
4. Histogrammes
5. Régression linéaire (y = ax + b)
6. Coefficient de corrélation

**Visualisation**: Canvas pour diagrammes

**Temps estimé**: 15-20h

---

## 🗓️ Planning Proposé

### Semaine 1-2: Limites
- Développement complet module 17
- Tests et corrections
- Documentation

### Semaine 3-4: Primitives & Intégrales
- Développement module 18
- Intégration visualisations aires
- Tests

### Semaine 5-6: Exponentielles & Logarithmes
- Module 19
- Applications réelles
- Tests

### Semaine 7: Consolidation
- Corrections bugs
- Optimisations
- Refactoring si nécessaire

### Semaine 8-9: Probabilités
- Module 20
- Visualisations arbres
- Tests

### Semaine 10-11: Statistiques
- Module 21
- Diagrammes Canvas
- Tests

**Total: 11 semaines pour 5 modules**
**Rythme: ~2-3 semaines par module**

---

## 🎯 Critères de Qualité

Pour chaque nouveau module, s'assurer de:

### Code
- ✅ Pattern State respecté
- ✅ Fonctions bien nommées (init, setup, generate, solve)
- ✅ Commentaires clairs en français
- ✅ Pas de duplication de code
- ✅ Gestion erreurs (divisions par 0, domaines)

### UX/UI
- ✅ Responsive (mobile + desktop)
- ✅ Affichage mathématique propre (KaTeX si nécessaire)
- ✅ Étapes solution claires et pédagogiques
- ✅ Graphiques lisibles (si applicable)
- ✅ Feedback visuel (boutons actifs, etc.)

### Pédagogie
- ✅ Exemples variés et progressifs
- ✅ Explications détaillées
- ✅ Cas particuliers traités
- ✅ Formules de référence affichées
- ✅ Interprétation résultats

### Tests
- ✅ Tous types d'exercices testés
- ✅ Cas limites vérifiés
- ✅ Génération aléatoire robuste
- ✅ Affichage correct sur mobile
- ✅ Navigation fonctionnelle

---

## 🚀 Vision Finale

### À 25 Modules
**MathsFacile devient**:
- Plateforme complète lycée français
- Couverture Seconde → Terminale
- 25 × 5 types moyens = **~125 types d'exercices**
- Génération infinie
- Solutions détaillées
- Graphiques interactifs
- Zéro dépendance (sauf KaTeX)
- Utilisable hors-ligne
- Open source

### Impact Potentiel
- Outil pédagogique pour enseignants
- Révisions autonomes élèves
- Exercices personnalisés
- Accessible partout (mobile, tablette, PC)
- Gratuit et open source

---

**Prêt à commencer avec Limites ? 📉**
