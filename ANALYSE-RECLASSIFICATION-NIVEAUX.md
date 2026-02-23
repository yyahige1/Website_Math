# Analyse : Reclassification des exercices par niveau scolaire

**Date** : 23 Février 2026
**Objet** : Évaluation de la complexité d'une refonte du classement des exercices par classe
**Périmètre** : 6ème → Terminale (collège + lycée)

---

## 1. Ce que ça veut dire concrètement

Actuellement, les 28 modules sont organisés par **thème mathématique** (Fractions, Équations, Dérivées…).
L'objectif serait de les réorganiser par **classe** :

> "Pour un élève de 5ème : voici les exercices qui correspondent à TON programme."

Ce changement de paradigme est **fondamental** — ce n'est pas une amélioration cosmétique, c'est une refonte architecturale.

---

## 2. La difficulté principale : un concept ≠ un niveau

Le problème central est que **presque chaque notion mathématique traverse plusieurs années scolaires**, avec une profondeur croissante.

### Exemples concrets

| Notion | 6ème | 5ème | 4ème | 3ème | 2nde | 1ère | Term |
|--------|------|------|------|------|------|------|------|
| Fractions | introduction | add/sous | × ÷ | simplif complexe | — | — | — |
| Pourcentages | base | — | taux | évolutions | évolutions chaînées | — | — |
| Équations | — | — | 1er degré simple | 1er degré complet | 1er degré avancé | 2nd degré | — |
| Probabilités | — | — | intro | — | classique | conditionnelle | loi binomiale |
| Géométrie | périmètres | aires | Pythagore | trigo 1 | vecteurs | — | espace |
| Trigonométrie | — | — | — | sin/cos/tan | — | formules | complètes |

**Conséquence** : Un même module JS (ex: `fractions.js`) couvre des exercices de 6ème ET de 4ème.
Il faudrait soit **scinder** les modules, soit **étiqueter** chaque type d'exercice avec un ou plusieurs niveaux.

---

## 3. Inventaire de l'ampleur du travail

### 3a. Recenser le niveau de chaque type d'exercice existant

Le projet compte **28 modules × en moyenne 5 types = ~140 types d'exercices**.

Pour chacun, il faudrait :
1. Déterminer à quel(s) niveau(x) il appartient (parfois chevauchement sur 2-3 ans)
2. Vérifier la conformité au **programme officiel MEN** de chaque niveau
3. Ajuster la difficulté des paramètres de génération aléatoire (les bornes des valeurs générées ne sont pas les mêmes en 5ème qu'en Terminale)

Ce recensement seul représente une **dizaine d'heures de travail pédagogique** (pas technique).

### 3b. Notion absentes du projet mais au programme collège

Le projet a été construit pour le **lycée (Seconde → Terminale)**. Tout le programme collège manque :

| Classe | Notions manquantes |
|--------|-------------------|
| 6ème | Nombres entiers, fractions simples, géométrie de base (symétries, angles), proportionnalité, périmètres/aires |
| 5ème | Fractions avancées, nombres relatifs, expressions littérales, Pythagore, statistiques simples |
| 4ème | Développement/factorisation niveau collège, équations 1er degré simples, fonctions linéaires, probabilités intro |
| 3ème | Racines carrées simples, théorème de Thalès, trigonométrie basique (sin/cos/tan), puissances entières, statistiques collège |

Cela représenterait **8 à 12 nouveaux modules** à créer de zéro.

### 3c. Refonte de la navigation

La navigation actuelle classe par thème (`Algèbre`, `Calculs`, `Fonctions`…).
Une navigation par niveau nécessiterait une **double entrée** :
- Par niveau : "Je suis en 4ème" → voir les exercices de 4ème
- Par thème (conservation de l'existant) : "Je veux réviser les fractions"

Ce double système de navigation est techniquement réalisable mais implique :
- Ajouter des métadonnées `niveau` à chaque type d'exercice dans les JS
- Réécrire `navigation.js` pour gérer deux modes d'affichage
- Créer des pages d'accueil par niveau (ou un filtre dynamique)

### 3d. Adaptation de la génération des exercices

Les générateurs aléatoires actuels ne sont **pas calibrés par niveau**.
Par exemple, `fractions.js` peut générer des fractions avec des dénominateurs jusqu'à 100, ce qui est hors programme en 6ème (on reste sous 10).

Pour chaque module, il faudrait :
- Définir des **profils de paramètres par niveau** (bornes min/max, types d'opérations autorisées)
- Modifier les fonctions `generate[Module]()` pour accepter un paramètre `niveau`
- Ou créer des fonctions de génération séparées par niveau

---

## 4. Les questions pédagogiques sans réponse simple

### 4a. Quelle référence de programme ?

Les programmes changent. La dernière réforme lycée date de 2019 (bac 2021). Faut-il suivre :
- Le programme **officiel Éduscol** (rigoureux mais peut diverger des pratiques de classe)
- Le programme **commun à tous les manuels** (plus pragmatique)
- Les programmes **spécifiques** (Maths Expertes, Maths Complémentaires en Terminale) ?

### 4b. Que faire des notions qui chevauchent ?

Exemple : les **systèmes d'équations** apparaissent en 3ème (résolution par substitution simple) ET en Seconde (résolution par combinaison). Le même module couvre les deux niveaux avec des exercices différents. Faut-il :
- Un seul module avec un filtre de niveau ?
- Deux modules séparés ?

### 4c. Différenciation lycée général / professionnel / technologique ?

Le programme de `Terminale` est différent selon la filière. La plateforme vise-t-elle uniquement la voie générale ?

---

## 5. Estimation de l'effort total

| Tâche | Estimation |
|-------|-----------|
| Recensement pédagogique des 140 types existants (niveau par niveau) | 15-20h |
| Création des 8-12 nouveaux modules collège | 40-60h |
| Refonte navigation (double entrée thème/niveau) | 8-12h |
| Adaptation des générateurs aléatoires par niveau | 20-30h |
| Adaptation des solutions étape par étape (vocabulaire adapté au niveau) | 20-30h |
| Tests et corrections | 10-15h |
| **Total** | **~115-170h** |

C'est l'équivalent de **reconstruire le projet une deuxième fois**.

---

## 6. Approche recommandée si on veut quand même le faire

### Option A : Ajouter des métadonnées sans tout reconstruire (approche légère)

Ajouter un objet `niveaux` à chaque type d'exercice dans les modules JS :

```javascript
const FractionsTypes = {
    addition: { label: 'Addition', niveaux: ['5ème', '6ème'] },
    multiplication: { label: 'Multiplication', niveaux: ['5ème', '4ème'] },
    // ...
};
```

Puis une page d'accueil avec filtre par classe qui n'affiche que les modules/types pertinents.
**Avantage** : Pas de réécriture des modules.
**Limite** : Ne résout pas l'absence du programme collège, ni le calibrage des paramètres.

### Option B : Refonte progressive niveau par niveau

Commencer par un seul niveau (ex: 3ème, passerelle entre collège et lycée), faire un travail propre dessus, puis étendre.

### Option C : Garder l'organisation thématique et ajouter un indicateur visuel

Simplement afficher un badge `6ème-5ème` / `Lycée` / `Terminale Spé` sur chaque module, sans modifier l'architecture.
Travail estimé : **4-6h**, mais peu d'impact réel sur l'expérience utilisateur.

---

## 7. Conclusion

Reclassifier par niveau est un projet **pédagogiquement souhaitable** mais **techniquement très lourd**.
La difficulté n'est pas principalement technique — c'est la **question pédagogique** qui est complexe :
définir précisément ce qui appartient à quel niveau, dans une matière où les notions s'enchevêtrent sur plusieurs années.

La vraie question à trancher avant tout chantier technique :
> **La cible principale est-elle le collège, le lycée, ou les deux ?**

Si la cible reste le lycée (comme aujourd'hui), l'Option C (badges de niveau) est suffisante et réalisable rapidement.
Si on veut couvrir le collège, c'est un projet de refonte complet qui justifie de repartir d'une architecture nouvelle.
