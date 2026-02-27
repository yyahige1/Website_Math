# Roadmap : Migration Navigation par Classe

> Reorganiser MathsFacile pour que les eleves naviguent par niveau scolaire (6eme, 5eme, ..., Terminale) puis par chapitre, au lieu de la navigation actuelle par domaine mathematique (Algebre, Calculs, Fonctions...).

**Date** : 24 Fevrier 2026
**Mise a jour** : 27 Fevrier 2026
**Statut** : Phases 0 a 3 terminees ✅ | Phase 4 a faire
**Priorite** : Haute (UX critique)

---

## 1. Le Probleme

### Situation actuelle
La navigation est organisee par **domaine mathematique** :
```
Algebre | Calculs | Fonctions | Suites | Analyse | Proba & Stats | Geometrie & Trigo | Terminale Spe
```

### Pourquoi ca ne marche pas
- Un eleve de 4eme ne sait pas ce qu'est "l'Algebre" ou "l'Analyse"
- Il cherche : **"4eme → Calcul litteral"** ou **"3eme → Thales"**
- Certains modules couvrent plusieurs niveaux (ex: Fractions = 6eme a 3eme) sans distinction
- Aucun repere de progression scolaire
- Un eleve de 6eme voit des exercices de Terminale dans le meme menu

### Ce que veut l'eleve
```
Je suis en 4eme → Je cherche "Equations" → J'ai des exercices de MON niveau
```

---

## 2. Architecture Cible

### 2.1 Nouvelle navigation

Remplacer les categories par domaine par des **niveaux scolaires** :

```
MathsFacile    6eme | 5eme | 4eme | 3eme | 2nde | 1ere Spe | Terminale Spe
                 ▾      ▾      ▾      ▾      ▾       ▾           ▾
```

Chaque dropdown affiche les **chapitres du programme officiel** avec des titres que l'eleve reconnait.

### 2.2 Page d'accueil par niveau

Creer une page d'accueil (`accueil.html` ou refondre `index.html`) avec :
- 7 grosses cards cliquables (une par niveau)
- Chaque card montre le nombre de chapitres disponibles
- Design visuel attractif (couleurs par niveau)

### 2.3 Principe de fonctionnement

**Navigation unique par classe** (pas de mode theme — un eleve n'a pas le recul pour naviguer par domaine mathematique).

**Chaque lien pointe vers le module existant avec un parametre de niveau :**
```
fractions.html?niveau=6eme    → Affiche seulement : addition/soustraction denominateurs identiques
fractions.html?niveau=5eme    → Affiche : +/- avec denominateurs differents
fractions.html?niveau=4eme    → Affiche : multiplication, division, simplification
```

Le JS de `navigation.js` lit `?niveau=` et filtre les types d'exercices affiches (via `applyNiveauFilter()` appele apres l'init du module avec `setTimeout(..., 0)`).

---

## 3. Programmes Officiels et Mapping des Modules Existants

### Legende

| Symbole | Signification |
|---------|---------------|
| ✅ | Module existant, utilisable tel quel ou avec filtrage de types |
| 🔧 | Module existant mais necessite adaptation (difficulte, types specifiques) |
| ❌ | Module a creer (n'existe pas) |

---

### 3.1 — 6eme (Cycle 3)

> Programme : B.O. Cycle 3, partie mathematiques

| # | Chapitre (titre eleve) | Module existant | Action |
|---|------------------------|-----------------|--------|
| 1 | **Nombres entiers et decimaux** | ❌ Aucun | A CREER : operations, comparaison, arrondis |
| 2 | **Addition et soustraction de fractions** (meme denominateur) | 🔧 `fractions.html` | FILTRER : seulement addition/soustraction simples + ADAPTER la generation pour denominateurs identiques |
| 3 | **Proportionnalite** | ❌ Aucun | A CREER : tableaux, coefficient, regles de trois |
| 4 | **Perimetres et aires** | ❌ Aucun | A CREER : rectangle, carre, triangle, cercle |
| 5 | **Volumes** (pave droit) | ❌ Aucun | A CREER : pave droit, conversions |
| 6 | **Symetrie axiale** | ❌ Aucun | A CREER : constructions, proprietes, axes |
| 7 | **Angles** (mesure, types) | ❌ Aucun | A CREER : mesurer, types d'angles, complementaires/supplementaires |
| 8 | **Tableaux et graphiques** | 🔧 `statistiques.html` | FILTRER : seulement lecture de tableaux/graphiques simples |

**Bilan 6eme : 2 modules reutilisables (avec adaptation), 6 modules a creer**

---

### 3.2 — 5eme (Cycle 4 - annee 1)

| # | Chapitre (titre eleve) | Module existant | Action |
|---|------------------------|-----------------|--------|
| 1 | **Nombres relatifs** (introduction) | ❌ Aucun | A CREER : reperage, comparaison, addition/soustraction |
| 2 | **Fractions** (+/- denominateurs differents) | 🔧 `fractions.html` | FILTRER : addition/soustraction seulement (pas multiplication/division) |
| 3 | **Enchainement d'operations** (priorites) | ❌ Aucun | A CREER : priorites operatoires, parentheses |
| 4 | **Proportionnalite et pourcentages** | 🔧 `pourcentages.html` | FILTRER : types simples (calculer un pourcentage, appliquer) |
| 5 | **Angles et parallelisme** | ❌ Aucun | A CREER : alternes-internes, correspondants |
| 6 | **Triangles** (construction, inegalite triangulaire) | ❌ Aucun | A CREER : construire un triangle, cas d'egalite |
| 7 | **Parallelogrammes** (proprietes) | ❌ Aucun | A CREER : proprietes, reconnaissance |
| 8 | **Symetrie centrale** | ❌ Aucun | A CREER : centre de symetrie, constructions |
| 9 | **Aires et volumes** (prisme, cylindre) | ❌ Aucun | A CREER : prisme droit, cylindre, formules |
| 10 | **Statistiques** (moyennes) | 🔧 `statistiques.html` | FILTRER : type moyenne seulement, nombres simples |

**Bilan 5eme : 3 modules reutilisables (avec filtrage), 7 modules a creer**

---

### 3.3 — 4eme (Cycle 4 - annee 2)

| # | Chapitre (titre eleve) | Module existant | Action |
|---|------------------------|-----------------|--------|
| 1 | **Nombres relatifs** (multiplication, division) | ❌ Aucun (extension du module 5eme) | A CREER ou etendre le module 5eme |
| 2 | **Fractions** (x, ÷, simplification) | ✅ `fractions.html` | FILTRER : multiplication, division, simplification |
| 3 | **Puissances** (introduction) | 🔧 `puissances.html` | FILTRER : types simples (notation, calcul, pas scientifique) |
| 4 | **Calcul litteral** (simple, distributivite) | 🔧 `developpement.html` + `reduction.html` | FILTRER : simple distributivite seulement (pas identites remarquables) |
| 5 | **Equations du 1er degre** | ✅ `index.html` | FILTRER : type 1 (equations simples ax+b=c) |
| 6 | **Theoreme de Pythagore** | ❌ Aucun | A CREER : calcul hypotenuse, reciproque, applications |
| 7 | **Proportionnalite** (approfondissement) | 🔧 `pourcentages.html` | ADAPTER : augmentation/reduction |
| 8 | **Translations et rotations** | ❌ Aucun | A CREER : translations, rotations, images |
| 9 | **Statistiques** (moyenne, mediane) | 🔧 `statistiques.html` | FILTRER : moyenne + mediane (pas ecart-type, pas regression) |
| 10 | **Probabilites** (introduction) | 🔧 `probabilites.html` | FILTRER : type simple seulement (des, cartes) |
| 11 | **Cosinus d'un angle** (dans le triangle rectangle) | 🔧 `trigonometrie.html` | ADAPTER : seulement cos, dans triangle rectangle |

**Bilan 4eme : 2 modules directs, 6 adaptables, 3 modules a creer**

---

### 3.4 — 3eme (Cycle 4 - annee 3, Brevet)

| # | Chapitre (titre eleve) | Module existant | Action |
|---|------------------------|-----------------|--------|
| 1 | **Calcul litteral** (developpement, factorisation) | ✅ `developpement.html` + `reduction.html` + `factorisation.html` | FILTRER : simple + double distributivite, facteur commun. Identites remarquables en intro |
| 2 | **Identites remarquables** | ✅ `developpement.html` + `factorisation.html` | Types : carre-somme, carre-diff, diff-carres |
| 3 | **Equations et inequations du 1er degre** | ✅ `index.html` + `inequations.html` | Tous types disponibles |
| 4 | **Fonctions lineaires et affines** | ✅ `fonctions-affines.html` | FILTRER : image, antecedent, equation, graphique (pas intersection) |
| 5 | **Racines carrees** | 🔧 `racines.html` | FILTRER : simplification, operations simples (pas rationalisation avancee) |
| 6 | **Theoreme de Thales** | ❌ Aucun | A CREER : direct, reciproque, partie entiere |
| 7 | **Trigonometrie** (sin, cos, tan) | 🔧 `trigonometrie.html` | FILTRER : type triangle seulement (pas cercle trigo, pas equations) |
| 8 | **Statistiques** (mediane, quartiles, etendue) | ✅ `statistiques.html` | FILTRER : moyenne, mediane, quartiles |
| 9 | **Probabilites** | 🔧 `probabilites.html` | FILTRER : simple + arbre (pas binomiale, pas conditionnelle) |
| 10 | **PGCD et fractions irreductibles** | 🔧 `arithmetique.html` | FILTRER : divisibilite + PGCD seulement (pas congruences, pas Bezout) |
| 11 | **Systemes d'equations** (introduction) | 🔧 `systemes.html` | OK tel quel |

**Bilan 3eme : 5 modules directs, 6 adaptables, 1 module a creer (Thales)**

---

### 3.5 — Seconde (2nde)

| # | Chapitre (titre eleve) | Module existant | Action |
|---|------------------------|-----------------|--------|
| 1 | **Ensembles de nombres et calculs** | 🔧 `fractions.html` + `racines.html` + `puissances.html` | FILTRER : tous types pertinents, renforcement |
| 2 | **Calcul litteral et identites remarquables** | ✅ `developpement.html` + `factorisation.html` + `reduction.html` | Tous types |
| 3 | **Equations et inequations** | ✅ `index.html` + `inequations.html` | Tous types |
| 4 | **Notion de fonction** (generalites) | ✅ `notion-fonction.html` | 5 types : image, antecedent, variations, definition, tableau de valeurs |
| 5 | **Fonctions de reference** (carre, inverse, racine, cube) | ✅ `fonctions-reference.html` | 5 types : carree, inverse, racine, cube, valeur absolue |
| 6 | **Equations de droites** | ✅ `fonctions-affines.html` | Types : graphique, equation, intersection |
| 7 | **Systemes d'equations** | ✅ `systemes.html` | Tous types |
| 8 | **Vecteurs du plan** (introduction) | 🔧 `vecteurs.html` | FILTRER : coordonnees, operations (pas produit scalaire, pas colinearite avancee) |
| 9 | **Statistiques descriptives** | ✅ `statistiques.html` | FILTRER : moyenne, mediane, quartiles, ecart-type, boite a moustaches |
| 10 | **Probabilites** | 🔧 `probabilites.html` | FILTRER : simple, arbre, variable aleatoire (pas binomiale) |
| 11 | **Echantillonnage et fluctuation** | 🔧 `probabilites.html` | FILTRER : type fluctuation |
| 12 | **Geometrie dans le plan** | 🔧 `geometrie-analytique.html` | FILTRER : droites, distances (pas cercles avances, pas transformations) |

**Bilan 2nde : 7 modules directs, 5 adaptables, 0 module a creer** ✅

---

### 3.6 — Premiere Specialite Maths

| # | Chapitre (titre eleve) | Module existant | Action |
|---|------------------------|-----------------|--------|
| 1 | **Suites numeriques** | ✅ `suites.html` | Types : arithmetique, geometrique, variation |
| 2 | **Second degre** | ✅ `equations2.html` + `inequations2.html` + `fonctions-second-degre.html` | Tous types |
| 3 | **Derivation** | ✅ `derivees.html` | Tous types |
| 4 | **Fonction exponentielle** (introduction) | 🔧 `exponentielles.html` | FILTRER : eq exp + derivee exp (pas ln, pas log decimal) |
| 5 | **Trigonometrie** | ✅ `trigonometrie.html` | Types : valeurs remarquables, conversion, equations, addition, identites |
| 6 | **Produit scalaire** | ✅ `vecteurs.html` | Types : scalaire + norme |
| 7 | **Geometrie repere** (droites, cercles) | ✅ `geometrie-analytique.html` | Tous types |
| 8 | **Probabilites conditionnelles** | ✅ `probabilites.html` | Types : conditionnelle, arbre, variable aleatoire |
| 9 | **Variables aleatoires** | ✅ `probabilites.html` | Type : variable aleatoire |
| 10 | **Suites** (sommes) | ✅ `suites.html` | Types : somme_arith, somme_geo |

**Bilan 1ere Spe : 9 modules directs, 1 adaptable, 0 a creer**

---

### 3.7 — Terminale Specialite Maths

| # | Chapitre (titre eleve) | Module existant | Action |
|---|------------------------|-----------------|--------|
| 1 | **Suites et limites de suites** | ✅ `suites.html` + `limites.html` | Tous types |
| 2 | **Limites de fonctions et continuite** | ✅ `limites.html` | Tous types |
| 3 | **Complements sur la derivation** | ✅ `derivees.html` | Types : composition, variations |
| 4 | **Fonction logarithme neperien** | ✅ `exponentielles.html` | Types : eq_ln, derivee (ln) |
| 5 | **Fonction exponentielle** (approfondissement) | ✅ `exponentielles.html` | Types : eq_exp, derivee, etude, croissance |
| 6 | **Primitives et integrales** | ✅ `primitives.html` | Tous types |
| 7 | **Geometrie dans l'espace** | ✅ `geometrie-espace.html` | Tous types |
| 8 | **Nombres complexes** | ✅ `nombres-complexes.html` | Tous types |
| 9 | **Arithmetique** | ✅ `arithmetique.html` | Tous types |
| 10 | **Combinatoire et denombrement** | ✅ `logique-denombrement.html` | Tous types |
| 11 | **Loi binomiale et grands nombres** | ✅ `probabilites.html` | Types : binomiale, fluctuation |
| 12 | **Equations differentielles** (intro) | ❌ Aucun | Optionnel : y' = ay type basique (hors programme strict mais souvent aborde) |

**Bilan Terminale Spe : 11 modules directs, 0 adaptable, 0 a creer (programme couvert a 100%)**

---

## 4. Bilan : Modules a Creer

### 4.1 Modules entierement nouveaux necessaires

| # | Module | Niveaux | Types d'exercices | Priorite | Statut |
|---|--------|---------|-------------------|----------|--------|
| 1 | **Nombres entiers et decimaux** | 6eme | Operations, comparaison, arrondis, ordre de grandeur | Basse | ❌ A creer |
| 2 | **Proportionnalite** | 6eme, 5eme, 4eme | Tableau, coefficient, 4eme proportionnelle, echelle | Moyenne | 🔧 V1 basique creee (3 types), a enrichir (echelle, vitesse, debit) |
| 3 | **Perimetres et aires** | 6eme, 5eme | Rectangle, triangle, cercle, conversions | Basse | 🔧 V1 basique creee (3 types), a enrichir (volumes prisme/cylindre) |
| 4 | **Symetries** (axiale + centrale) | 6eme, 5eme | Constructions, proprietes, axes/centres | Basse | ❌ A creer |
| 5 | **Angles** | 6eme, 5eme | Mesure, types, alternes-internes, correspondants | Basse | ❌ A creer |
| 6 | **Nombres relatifs** | 5eme, 4eme | Reperage, comparaison, 4 operations | Moyenne | 🔧 V1 basique creee (4 types), a enrichir (types differencies 5e/4e) |
| 7 | **Priorites operatoires** | 5eme | Calculs avec parentheses, enchainements | Basse | ❌ A creer |
| 8 | **Triangles et parallelogrammes** | 5eme | Proprietes, construction, reconnaissance | Basse | ❌ A creer |
| 9 | **Theoreme de Pythagore** | 4eme | Direct, reciproque, problemes | **Haute** | ❌ A creer |
| 10 | **Translations et rotations** | 4eme | Images de figures, proprietes | Basse | ❌ A creer |
| 11 | **Theoreme de Thales** | 3eme | Direct, reciproque, agrandissement/reduction | **Haute** | ❌ A creer |
| 12 | **Notion de fonction** (generalites) | 2nde | Lecture graphique, image/antecedent, ensemble de definition, variations | Moyenne | ✅ Cree (Phase 3) |
| 13 | **Fonctions de reference** | 2nde | Carre, inverse, racine, cube, valeur absolue | Moyenne | ✅ Cree (Phase 3) |

**Total : 8 modules a creer, 3 modules V1 a enrichir (2 modules crees en Phase 3)**

### 4.2 Priorites de creation

**Priorite 1 (Haute)** — Les niveaux les plus demandes (3eme brevet, 4eme) :
1. Theoreme de Pythagore (4eme)
2. Theoreme de Thales (3eme)
3. Nombres relatifs (5eme-4eme)
4. Proportionnalite (6eme-5eme-4eme, transversal)

**Priorite 2 (Moyenne)** — Completude 2nde et enrichissement college :
5. Notion de fonction / generalites (2nde)
6. Fonctions de reference (2nde)
7. Perimetres, aires, volumes (6eme-5eme)

**Priorite 3 (Basse)** — Completude 6eme-5eme :
8. Nombres entiers et decimaux (6eme)
9. Priorites operatoires (5eme)
10. Symetries (6eme-5eme)
11. Angles (6eme-5eme)
12. Triangles et parallelogrammes (5eme)
13. Translations et rotations (4eme)

---

## 5. Systeme de Filtrage par Niveau

### 5.1 Principe technique (✅ implemente)

Le filtrage est centralise dans `js/navigation.js` (pas de fichier separe). La fonction `applyNiveauFilter()` est appelee via `setTimeout(..., 0)` apres le DOMContentLoaded, ce qui garantit qu'elle s'execute APRES l'init de chaque module. Aucune modification des 28 fichiers JS de modules.

### 5.2 Configuration du filtrage (✅ implemente)

Le mapping est dans `NIVEAUX_CONFIG` au debut de `js/navigation.js` :

```javascript
const NIVEAUX_CONFIG = {
    'fractions': {
        '6eme':      { types: ['addition', 'soustraction'], label: 'Fractions simples',
                       genConfig: { sameDenominator: true } },
        '5eme':      { types: ['addition', 'soustraction'], label: 'Fractions +/-' },
        '4eme':      { types: ['multiplication', 'division', 'simplification'], label: 'Fractions x/÷' },
        '3eme':      { types: ['addition', 'soustraction', 'multiplication', 'division', 'simplification', 'inverse'] },
        '2nde':      { types: ['addition', 'soustraction', 'multiplication', 'division', 'simplification', 'inverse'] },
    },
    'equations': {
        '4eme':      { types: ['type1'], label: 'Equations simples' },
        '3eme':      { types: ['type1', 'type2'] },
        '2nde':      { types: ['type1', 'type2'] },
    },
    'developpement': {
        '4eme':      { types: ['simple'], label: 'Distributivite simple' },
        '3eme':      { types: ['simple', 'double', 'carre-somme', 'carre-diff', 'diff-carres'] },
        '2nde':      { types: ['simple', 'double', 'carre-somme', 'carre-diff', 'diff-carres'] },
    },
    'puissances': {
        '4eme':      { types: ['1', '2', '3'], label: 'Puissances : bases' },
        '3eme':      { types: ['1', '2', '3', '4', '5'] },
        '2nde':      { types: ['1', '2', '3', '4', '5', '6'] },
    },
    'trigonometrie': {
        '4eme':      { types: ['triangle'], genConfig: { cosOnly: true }, label: 'Cosinus dans le triangle rectangle' },
        '3eme':      { types: ['triangle'], label: 'Trigonometrie dans le triangle rectangle' },
        '2nde':      { types: ['valeurs', 'conversion'] },
        '1ere':      { types: ['valeurs', 'conversion', 'equations', 'addition', 'identites'] },
        'terminale': { types: ['valeurs', 'conversion', 'equations', 'addition', 'identites', 'triangle'] },
    },
    'probabilites': {
        '4eme':      { types: ['simple'], label: 'Introduction aux probabilites' },
        '3eme':      { types: ['simple', 'arbre'] },
        '2nde':      { types: ['simple', 'arbre', 'variable'] },
        '1ere':      { types: ['simple', 'conditionnelle', 'arbre', 'variable'] },
        'terminale': { types: ['simple', 'conditionnelle', 'arbre', 'binomiale', 'variable', 'fluctuation'] },
    },
    'statistiques': {
        '5eme':      { types: ['moyenne'], label: 'Moyennes' },
        '4eme':      { types: ['moyenne', 'mediane'], label: 'Moyenne et mediane' },
        '3eme':      { types: ['moyenne', 'mediane', 'dispersion'] },
        '2nde':      { types: ['moyenne', 'mediane', 'dispersion', 'boite'] },
        '1ere':      { types: ['moyenne', 'mediane', 'dispersion', 'boite', 'regression'] },
    },
    'racines': {
        '3eme':      { types: ['1', '2', '3'], label: 'Racines carrees : bases' },
        '2nde':      { types: ['1', '2', '3', '4', '5', '6'] },
    },
    'factorisation': {
        '3eme':      { types: ['facteur-commun', 'diff-carres', 'carre-parfait'] },
        '2nde':      { types: ['facteur-commun', 'diff-carres', 'carre-parfait'] },
    },
    'reduction': {
        '3eme':      { types: ['avec-x', 'avec-x2', 'avec-parentheses'] },
        '2nde':      { types: ['avec-x', 'avec-x2', 'avec-parentheses'] },
    },
    'inequations': {
        '3eme':      { types: ['type1', 'type2'] },
        '2nde':      { types: ['type1', 'type2'] },
    },
    'fonctions-affines': {
        '3eme':      { types: ['image', 'antecedent', 'graphique', 'equation'] },
        '2nde':      { types: ['graphique', 'image', 'antecedent', 'equation', 'intersection'] },
    },
    'systemes': {
        '3eme':      { types: ['substitution', 'combinaison'] },
        '2nde':      { types: ['substitution', 'combinaison'] },
    },
    'vecteurs': {
        '2nde':      { types: ['coordonnees', 'norme', 'operations'] },
        '1ere':      { types: ['coordonnees', 'norme', 'colinearite', 'scalaire', 'operations'] },
    },
    'arithmetique': {
        '3eme':      { types: ['divisibilite', 'pgcd'], label: 'PGCD et divisibilite' },
        'terminale': { types: ['divisibilite', 'pgcd', 'premiers', 'congruences', 'bezout'] },
    },
    'equations2': {
        '1ere':      { types: ['discriminant', 'canonique', 'particuliere', 'somme-produit'] },
    },
    'inequations2': {
        '1ere':      { types: null }, // tous
    },
    'fonctions-second-degre': {
        '1ere':      { types: null }, // tous
    },
    'derivees': {
        '1ere':      { types: ['polynomiale', 'produit', 'tangente', 'variations'] },
        'terminale': { types: ['polynomiale', 'produit', 'quotient', 'composition', 'tangente', 'variations'] },
    },
    'exponentielles': {
        '1ere':      { types: ['eq_exp', 'derivee'], label: 'Fonction exponentielle' },
        'terminale': { types: ['eq_exp', 'eq_ln', 'derivee', 'etude', 'croissance', 'log_decimal'] },
    },
    'suites': {
        '1ere':      { types: ['arithmetique', 'geometrique', 'somme_arith', 'somme_geo', 'variation'] },
        'terminale': { types: ['arithmetique', 'geometrique', 'somme_arith', 'somme_geo', 'variation'] },
    },
    'limites': {
        'terminale': { types: null }, // tous
    },
    'primitives': {
        'terminale': { types: null }, // tous
    },
    'geometrie-analytique': {
        '2nde':      { types: ['droites', 'distance'] },
        '1ere':      { types: ['droites', 'cercles', 'distance', 'transformations'] },
    },
    'geometrie-espace': {
        'terminale': { types: null }, // tous
    },
    'nombres-complexes': {
        'terminale': { types: null }, // tous
    },
    'logique-denombrement': {
        'terminale': { types: null }, // tous
    },
    'pourcentages': {
        '5eme':      { types: ['calculer', 'trouver'], label: 'Pourcentages simples' },
        '4eme':      { types: ['calculer', 'trouver', 'augmentation', 'reduction'] },
        '3eme':      { types: ['calculer', 'trouver', 'augmentation', 'reduction', 'retrouver'] },
        '2nde':      { types: null }, // tous
    },
};
```

### 5.3 Fonction de filtrage (✅ implemente)

La fonction `applyNiveauFilter()` dans `js/navigation.js` :
- Lit `?niveau=` depuis l'URL
- Cache les `.type-btn` non autorises (`display: none`)
- Active le premier bouton autorise via `.click()` (declenche le handler du module)
- Affiche un badge niveau dans le header avec lien "Changer" vers `accueil.html`

---

## 6. Nouvelle Navigation (✅ implemente)

### 6.1 Structure du dropdown par niveau

```javascript
// Dans navigation.js
const NAVIGATION_PAR_CLASSE = {
    '6eme': {
        color: '#4CAF50',
        chapitres: [
            { titre: 'Nombres et calculs',          href: 'nombres-decimaux.html?niveau=6eme' },
            { titre: 'Fractions simples',            href: 'fractions.html?niveau=6eme' },
            { titre: 'Proportionnalite',             href: 'proportionnalite.html?niveau=6eme' },
            { titre: 'Perimetres et aires',          href: 'perimetres-aires.html?niveau=6eme' },
            { titre: 'Symetrie axiale',              href: 'symetries.html?niveau=6eme' },
            { titre: 'Angles',                       href: 'angles.html?niveau=6eme' },
            { titre: 'Tableaux et graphiques',       href: 'statistiques.html?niveau=6eme' },
        ]
    },
    '5eme': {
        color: '#2196F3',
        chapitres: [
            { titre: 'Nombres relatifs',             href: 'nombres-relatifs.html?niveau=5eme' },
            { titre: 'Fractions (+/-)',              href: 'fractions.html?niveau=5eme' },
            { titre: 'Priorites operatoires',        href: 'priorites.html?niveau=5eme' },
            { titre: 'Pourcentages',                 href: 'pourcentages.html?niveau=5eme' },
            { titre: 'Angles et parallelisme',       href: 'angles.html?niveau=5eme' },
            { titre: 'Triangles',                    href: 'triangles.html?niveau=5eme' },
            { titre: 'Symetrie centrale',            href: 'symetries.html?niveau=5eme' },
            { titre: 'Perimetres et aires',          href: 'perimetres-aires.html?niveau=5eme' },
            { titre: 'Moyennes',                     href: 'statistiques.html?niveau=5eme' },
        ]
    },
    '4eme': {
        color: '#FF9800',
        chapitres: [
            { titre: 'Nombres relatifs (x, ÷)',     href: 'nombres-relatifs.html?niveau=4eme' },
            { titre: 'Fractions (x, ÷)',             href: 'fractions.html?niveau=4eme' },
            { titre: 'Puissances',                   href: 'puissances.html?niveau=4eme' },
            { titre: 'Calcul litteral',              href: 'developpement.html?niveau=4eme' },
            { titre: 'Equations',                    href: 'index.html?niveau=4eme' },
            { titre: 'Pythagore',                    href: 'pythagore.html?niveau=4eme' },
            { titre: 'Pourcentages',                 href: 'pourcentages.html?niveau=4eme' },
            { titre: 'Cosinus',                      href: 'trigonometrie.html?niveau=4eme' },
            { titre: 'Statistiques',                 href: 'statistiques.html?niveau=4eme' },
            { titre: 'Probabilites',                 href: 'probabilites.html?niveau=4eme' },
        ]
    },
    '3eme': {
        color: '#F44336',
        chapitres: [
            { titre: 'Calcul litteral',              href: 'reduction.html?niveau=3eme' },
            { titre: 'Developpement',                href: 'developpement.html?niveau=3eme' },
            { titre: 'Factorisation',                href: 'factorisation.html?niveau=3eme' },
            { titre: 'Equations',                    href: 'index.html?niveau=3eme' },
            { titre: 'Inequations',                  href: 'inequations.html?niveau=3eme' },
            { titre: 'Racines carrees',              href: 'racines.html?niveau=3eme' },
            { titre: 'Fonctions affines',            href: 'fonctions-affines.html?niveau=3eme' },
            { titre: 'Systemes d\'equations',        href: 'systemes.html?niveau=3eme' },
            { titre: 'Thales',                       href: 'thales.html?niveau=3eme' },
            { titre: 'Trigonometrie',                href: 'trigonometrie.html?niveau=3eme' },
            { titre: 'PGCD et arithmetique',         href: 'arithmetique.html?niveau=3eme' },
            { titre: 'Statistiques',                 href: 'statistiques.html?niveau=3eme' },
            { titre: 'Probabilites',                 href: 'probabilites.html?niveau=3eme' },
        ]
    },
    '2nde': {
        color: '#9C27B0',
        chapitres: [
            { titre: 'Calcul litteral',              href: 'developpement.html?niveau=2nde' },
            { titre: 'Equations et inequations',     href: 'index.html?niveau=2nde' },
            { titre: 'Notion de fonction',           href: 'notion-fonction.html?niveau=2nde' },
            { titre: 'Fonctions de reference',       href: 'fonctions-reference.html?niveau=2nde' },
            { titre: 'Equations de droites',         href: 'fonctions-affines.html?niveau=2nde' },
            { titre: 'Systemes d\'equations',        href: 'systemes.html?niveau=2nde' },
            { titre: 'Vecteurs',                     href: 'vecteurs.html?niveau=2nde' },
            { titre: 'Geometrie analytique',         href: 'geometrie-analytique.html?niveau=2nde' },
            { titre: 'Statistiques',                 href: 'statistiques.html?niveau=2nde' },
            { titre: 'Probabilites',                 href: 'probabilites.html?niveau=2nde' },
            { titre: 'Echantillonnage',              href: 'probabilites.html?niveau=2nde&type=fluctuation' },
        ]
    },
    '1ere': {
        color: '#E91E63',
        chapitres: [
            { titre: 'Second degre',                 href: 'equations2.html?niveau=1ere' },
            { titre: 'Fonction du 2nd degre',        href: 'fonctions-second-degre.html?niveau=1ere' },
            { titre: 'Inequations 2nd degre',        href: 'inequations2.html?niveau=1ere' },
            { titre: 'Derivation',                   href: 'derivees.html?niveau=1ere' },
            { titre: 'Suites numeriques',            href: 'suites.html?niveau=1ere' },
            { titre: 'Fonction exponentielle',       href: 'exponentielles.html?niveau=1ere' },
            { titre: 'Trigonometrie',                href: 'trigonometrie.html?niveau=1ere' },
            { titre: 'Produit scalaire',             href: 'vecteurs.html?niveau=1ere' },
            { titre: 'Geometrie repere',             href: 'geometrie-analytique.html?niveau=1ere' },
            { titre: 'Probabilites conditionnelles', href: 'probabilites.html?niveau=1ere' },
        ]
    },
    'terminale': {
        color: '#673AB7',
        chapitres: [
            { titre: 'Limites et continuite',        href: 'limites.html?niveau=terminale' },
            { titre: 'Derivation (complements)',      href: 'derivees.html?niveau=terminale' },
            { titre: 'Fonction logarithme neperien', href: 'exponentielles.html?niveau=terminale' },
            { titre: 'Fonction exponentielle',       href: 'exponentielles.html?niveau=terminale' },
            { titre: 'Primitives et integrales',     href: 'primitives.html?niveau=terminale' },
            { titre: 'Suites (limites)',             href: 'suites.html?niveau=terminale' },
            { titre: 'Nombres complexes',            href: 'nombres-complexes.html?niveau=terminale' },
            { titre: 'Arithmetique',                 href: 'arithmetique.html?niveau=terminale' },
            { titre: 'Denombrement et combinatoire', href: 'logique-denombrement.html?niveau=terminale' },
            { titre: 'Geometrie dans l\'espace',     href: 'geometrie-espace.html?niveau=terminale' },
            { titre: 'Loi binomiale',                href: 'probabilites.html?niveau=terminale' },
        ]
    }
};
```

---

## 7. Page d'Accueil (✅ implemente)

### 7.1 Design (`accueil.html`)

Page d'accueil avec 7 cards cliquables (une par niveau, de la 6eme a la Terminale). Cliquer sur une card ouvre en accordeon la liste des chapitres disponibles. Chaque chapitre est un lien vers le module filtre (ex: `fractions.html?niveau=4eme`).

Le logo "MathsFacile" dans la nav renvoie vers `accueil.html`.

---

## 8. Phases d'Implementation

### Phase 0 : Infrastructure ✅ TERMINEE (26 fev 2026)
> Navigation + filtrage, sans creer de nouveaux modules

- [x] Mapping `NIVEAUX_CONFIG` complet (28 modules, tous niveaux) dans `js/navigation.js`
- [x] Mapping `NAVIGATION_PAR_CLASSE` (7 niveaux, chapitres avec liens) dans `js/navigation.js`
- [x] Fonction `applyNiveauFilter()` dans `js/navigation.js` (filtrage via `setTimeout(0)` apres init module)
- [x] Refonte `js/navigation.js` : navigation uniquement par classe (mode theme supprime)
- [x] Page d'accueil `accueil.html` avec 7 cards de niveaux + accordeon chapitres
- [x] `css/accueil.css` : styles page d'accueil (cards, grid, responsive)
- [x] `css/navigation.css` : badge niveau, dropdowns repliables mobile, styles accordion
- [x] Logo nav renvoie vers `accueil.html`
- [x] Aucune modification des 28 fichiers HTML ni des 28 fichiers JS de modules

**Resultat** : Un eleve peut naviguer par classe (6eme a Terminale) avec les 28 modules existants filtres par niveau.

### Phase 0.5 : Premiers modules college ✅ TERMINEE (27 fev 2026)
> Ajout de 3 nouveaux modules basiques + 2 extensions pour enrichir 6eme et 5eme

- [x] **Nombres relatifs** (`nombres-relatifs.html` + `js/nombres-relatifs.js`) — V1 basique
  - 4 types : addition, soustraction, multiplication, melange
  - A ameliorer en Phase 2 : types differencies 5e (add/sub) vs 4e (mul/div)
- [x] **Proportionnalite** (`proportionnalite.html` + `js/proportionnalite.js`) — V1 basique
  - 3 types : tableau, coefficient, produit-croix
  - A ameliorer en Phase 2 : ajouter echelle, vitesse, debit
- [x] **Perimetres et aires** (`perimetres-aires.html` + `js/perimetres-aires.js`) — V1 basique
  - 3 types : perimetre, aire, conversions
  - A ameliorer en Phase 4 : ajouter volumes (prisme, cylindre)
- [x] Extension `reduction.js` : ajout type 'nombres' (somme de nombres) pour 5eme
- [x] Extension `pourcentages` : ajout filtrage 6eme (types calculer, trouver)
- [x] Mise a jour `NIVEAUX_CONFIG` et `NAVIGATION_PAR_CLASSE` dans `navigation.js`
- [x] Mise a jour `accueil.html` (6eme: 5 chapitres, 5eme: 7 chapitres)

**Resultat** : 31 modules total. 6eme et 5eme ont du contenu navigable. Versions basiques a enrichir dans les phases suivantes.

### Phase 1 : Pythagore + Thales ✅ TERMINEE (27 fev 2026)
> Les 2 gros manques critiques pour le college (4eme brevet blanc, 3eme brevet)

- [x] **Theoreme de Pythagore** (`pythagore.html` + `js/pythagore.js`)
  - 4 types : calcul hypotenuse, calcul cote, reciproque, probleme contextualise
  - Canvas pour visualisation du triangle rectangle
  - Triplets pythagoriciens, 5 contextes de problemes
  - Niveaux : 4eme
- [x] **Theoreme de Thales** (`thales.html` + `js/thales.js`)
  - 3 types : calcul direct (longueur manquante), reciproque (parallelisme), agrandissement/reduction
  - Canvas pour visualisation (configuration triangle + papillon)
  - Rapports fractionnaires, produit en croix
  - Niveaux : 3eme
- [x] Ajout dans `NIVEAUX_CONFIG` et `NAVIGATION_PAR_CLASSE`
- [x] Mise a jour `accueil.html` (4eme: 9 chapitres, 3eme: 13 chapitres)

**Resultat** : 33 modules total. Pythagore (4eme) et Thales (3eme) operationnels avec visualisations Canvas.

### Phase 2 : Ameliorations modules college ✅ TERMINEE (27 fev 2026)
> Enrichir les modules V1 + adaptations de generation specifiques

- [x] **Nombres relatifs** — enrichi (7 types au total)
  - Ajout types 5eme : reperage (droite graduee), comparaison
  - Ajout type 4eme : division (avec division exacte)
  - NIVEAUX_CONFIG : 5eme [reperage, comparaison, addition, soustraction], 4eme [add, sub, mul, div, melange]
- [x] **Proportionnalite** — enrichi (5 types au total)
  - Ajout types : echelle (4 contextes, calcul carte/reelle), vitesse (5 contextes d/v/t)
  - NIVEAUX_CONFIG : 5eme inclut echelle et vitesse
- [x] Adaptations de generation specifiques
  - `fractions.js` : niveau=6eme force meme denominateur pour addition/soustraction
  - `trigonometrie.js` : niveau=4eme force cosinus uniquement (givenSide et findSide parmi adjacent/hypotenuse)
- [x] Mise a jour NIVEAUX_CONFIG dans navigation.js

**Resultat** : Modules enrichis avec differentiation par niveau. Fractions et trigonometrie s'adaptent automatiquement au niveau.

### Phase 3 : Modules 2nde manquants ✅ TERMINEE (27 fev 2026)
> Completude du programme de Seconde

- [x] **Notion de fonction** (`notion-fonction.html` + `js/notion-fonction.js`)
  - 5 types : lire une image, lire un antecedent, variations, ensemble de definition, tableau de valeurs
  - Canvas (GraphCanvas) pour les types graphiques (parabole a(x-h)^2 + k)
  - KaTeX pour les expressions mathematiques (racines, fractions, domaines)
  - Niveaux : 2nde
- [x] **Fonctions de reference** (`fonctions-reference.html` + `js/fonctions-reference.js`)
  - 5 types : fonction carree, fonction inverse, fonction racine, fonction cube, valeur absolue
  - Sous-exercices aleatoires : calcul image, resolution antecedent, comparaison par monotonie
  - Canvas (GraphCanvas) pour courbe representative dans la correction
  - Proprietes (domaine, parite, variations) rappelees dans chaque correction
  - Niveaux : 2nde
- [x] Ajout dans `NIVEAUX_CONFIG` et `NAVIGATION_PAR_CLASSE` (2nde: 12 chapitres)
- [x] Mise a jour `accueil.html` (2nde: 12 chapitres)

**Resultat** : 35 modules total. Programme de 2nde complete avec notion de fonction et fonctions de reference.

### Phase 4 : Modules college basse priorite (4-5 sessions) ← PROCHAINE ETAPE
> Completude 6eme-5eme

- [ ] **Nombres entiers et decimaux** (`nombres-decimaux.html`)
- [ ] **Priorites operatoires** (`priorites.html`)
- [ ] **Perimetres et aires** — enrichir la V1 existante (`perimetres-aires.html`)
  - Ajouter volumes : pave droit, prisme, cylindre, conversions de volumes
- [ ] **Symetries** axiale et centrale (`symetries.html`)
  - Canvas pour les constructions geometriques
- [ ] **Angles** (`angles.html`)
  - Canvas pour les figures
- [ ] **Triangles et parallelogrammes** (`triangles.html`)
- [ ] **Translations et rotations** (`translations-rotations.html`)

### Phase 5 : Polish et ameliorations (1-2 sessions)

- [ ] Bandeau "Niveau" affiche sur chaque page quand filtre actif (breadcrumb : Accueil > 4eme > Equations)
- [ ] Bouton "Voir tous les exercices" pour desactiver le filtre de niveau
- [ ] Seo : meta descriptions par niveau
- [ ] Tests sur mobile de toute la navigation
- [ ] Mettre a jour CLAUDE.md et ROADMAP.md

---

## 9. Estimation de Charge

| Phase | Sessions estimees | Modules concernes | Difficulte | Statut |
|-------|-------------------|-------------------|------------|--------|
| Phase 0 (infra) | 1-2 | 0 nouveau, tous modifies | Moyenne | ✅ Terminee |
| Phase 0.5 (premiers modules) | 1 | 3 nouveaux V1 + 2 extensions | Faible | ✅ Terminee |
| Phase 1 (Pythagore/Thales) | 1 | 2 nouveaux (Canvas) | Moyenne | ✅ Terminee |
| Phase 2 (college mid) | 1 | 2 enrichis + 2 adaptes | Moyenne | ✅ Terminee |
| Phase 3 (2nde) | 1 | 2 nouveaux (Canvas + KaTeX) | Moyenne | ✅ Terminee |
| Phase 4 (college low) | 4-5 | 6 nouveaux + 1 enrichi | Haute (geometrie canvas) | ← Prochaine |
| Phase 5 (polish) | 1-2 | 0 nouveau | Faible | A faire |
| **Total** | **~15-20 sessions** | **10 nouveaux + 3 enrichis + infra** | |

---

## 10. Points de Vigilance

### 10.1 Ce qui ne change PAS
- Les 28 modules existants restent intacts (memes URLs, meme code)
- Le systeme de State par module ne change pas
- Les fichiers CSS ne changent pas (sauf navigation.css)
- KaTeX, GraphCanvas, utils.js, ui.js restent identiques

### 10.2 Ce qui a change (Phase 0 + Phase 0.5)

**Phase 0 :**
- `js/navigation.js` : refonte majeure (navigation par classe uniquement, plus de mode theme)
- `NIVEAUX_CONFIG` + `NAVIGATION_PAR_CLASSE` + `applyNiveauFilter()` dans `navigation.js`
- `accueil.html` : nouvelle page d'accueil (index.html reste la page des equations)
- `css/accueil.css` + ajouts dans `css/navigation.css`
- Aucune modification des 28 modules JS ni des 28 fichiers HTML

**Phase 0.5 :**
- 3 nouveaux modules V1 : `nombres-relatifs.html/.js`, `proportionnalite.html/.js`, `perimetres-aires.html/.js`
- Extension `js/reduction.js` : ajout type 'nombres' pour 5eme
- Extension `NIVEAUX_CONFIG` : ajout pourcentages 6eme, reduction 5eme, 3 nouveaux modules
- Mise a jour `NAVIGATION_PAR_CLASSE` : 6eme passe a 5 chapitres, 5eme a 7 chapitres
- Mise a jour `accueil.html` : cards 6eme et 5eme enrichies
- **Total modules : 31** (28 originaux + 3 nouveaux)

### 10.3 Risques
- **URLs cassees** : `index.html` est actuellement la page des equations. Si on en fait la page d'accueil, il faut un redirect ou renommer.
  - **Solution recommandee** : creer `accueil.html` comme nouvelle page d'accueil, garder `index.html` pour les equations. Changer le lien du logo dans la nav.
- **Modules partages entre niveaux** : un eleve de 3eme qui clique "Fractions" et un de 4eme arrivent sur la meme page → le parametre `?niveau=` gere la distinction.
- **SEO** : les URL avec parametres sont moins propres que des pages dediees, mais c'est acceptable pour un site statique sans backend.

### 10.4 Alternative future
Si le site croit, envisager un vrai routeur JS qui gere les vues sans rechargement de page. Mais pour l'instant, le systeme `?niveau=` est simple, zero-dependance, et suffisant.

---

## 11. Resume Visuel

```
AVANT :
  Nav: [Algebre ▾] [Calculs ▾] [Fonctions ▾] ...
  → L'eleve ne s'y retrouve pas

APRES (✅ implemente) :
  Nav: [6e ▾] [5e ▾] [4e ▾] [3e ▾] [2de ▾] [1re ▾] [Tle ▾]
  → L'eleve clique sur sa classe, voit SES chapitres
  → Les types d'exercices sont filtres automatiquement par niveau
```

---

**Phases 0 a 3 terminees. 35 modules total. Prochaine etape : Phase 4 (modules college basse priorite).**
