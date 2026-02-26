// Fichier: js/navigation.js
// Navigation responsive avec double mode : par classe (defaut) / par theme

/* ========================================
   CONFIGURATION : NIVEAUX
   Mapping module -> types autorises par niveau
   ======================================== */

const NIVEAUX_CONFIG = {
    'equations': {
        '4eme': ['type1'],
        '3eme': ['type1', 'type2'],
        '2nde': ['type1', 'type2'],
    },
    'developpement': {
        '4eme': ['simple'],
        '3eme': ['simple', 'double', 'carre-somme', 'carre-diff', 'diff-carres'],
        '2nde': ['simple', 'double', 'carre-somme', 'carre-diff', 'diff-carres'],
    },
    'reduction': {
        '3eme': ['avec-x', 'avec-x2', 'avec-parentheses'],
        '2nde': ['avec-x', 'avec-x2', 'avec-parentheses'],
    },
    'factorisation': {
        '3eme': ['facteur-commun', 'diff-carres', 'carre-parfait'],
        '2nde': ['facteur-commun', 'diff-carres', 'carre-parfait'],
    },
    'inequations': {
        '3eme': ['type1', 'type2'],
        '2nde': ['type1', 'type2'],
    },
    'equations2': {
        '1ere': ['discriminant', 'canonique', 'particuliere', 'somme-produit'],
    },
    'inequations2': {
        '1ere': null, // tous les types
    },
    'systemes': {
        '3eme': ['substitution', 'combinaison'],
        '2nde': ['substitution', 'combinaison'],
    },
    'fractions': {
        '6eme': ['addition', 'soustraction'],
        '5eme': ['addition', 'soustraction'],
        '4eme': ['multiplication', 'division', 'simplification'],
        '3eme': ['addition', 'soustraction', 'multiplication', 'division', 'simplification'],
        '2nde': ['addition', 'soustraction', 'multiplication', 'division', 'simplification'],
    },
    'pourcentages': {
        '5eme': ['calculer', 'trouver'],
        '4eme': ['calculer', 'trouver', 'augmentation', 'reduction'],
        '3eme': ['calculer', 'trouver', 'augmentation', 'reduction', 'retrouver'],
        '2nde': null,
    },
    'puissances': {
        '4eme': ['1', '2', '3'],
        '3eme': ['1', '2', '3', '4', '5'],
        '2nde': ['1', '2', '3', '4', '5', '6'],
    },
    'racines': {
        '3eme': ['1', '2', '3'],
        '2nde': ['1', '2', '3', '4', '5', '6'],
    },
    'fonctions-affines': {
        '3eme': ['image', 'antecedent', 'graphique', 'equation'],
        '2nde': ['graphique', 'image', 'antecedent', 'equation', 'intersection'],
    },
    'fonctions-second-degre': {
        '1ere': null,
    },
    'derivees': {
        '1ere': ['polynomiale', 'produit', 'tangente', 'variations'],
        'terminale': ['polynomiale', 'produit', 'quotient', 'composition', 'tangente', 'variations'],
    },
    'suites': {
        '1ere': ['arithmetique', 'geometrique', 'somme_arith', 'somme_geo', 'variation'],
        'terminale': ['arithmetique', 'geometrique', 'somme_arith', 'somme_geo', 'variation'],
    },
    'limites': {
        'terminale': null,
    },
    'primitives': {
        'terminale': null,
    },
    'exponentielles': {
        '1ere': ['eq_exp', 'derivee'],
        'terminale': ['eq_exp', 'eq_ln', 'derivee', 'etude', 'croissance', 'log_decimal'],
    },
    'probabilites': {
        '4eme': ['simple'],
        '3eme': ['simple', 'arbre'],
        '2nde': ['simple', 'arbre', 'variable'],
        '1ere': ['simple', 'conditionnelle', 'arbre', 'variable'],
        'terminale': ['simple', 'conditionnelle', 'arbre', 'binomiale', 'variable', 'fluctuation'],
    },
    'statistiques': {
        '5eme': ['moyenne'],
        '4eme': ['moyenne', 'mediane'],
        '3eme': ['moyenne', 'mediane', 'dispersion'],
        '2nde': ['moyenne', 'mediane', 'dispersion', 'boite'],
        '1ere': ['moyenne', 'mediane', 'dispersion', 'boite', 'regression'],
    },
    'trigonometrie': {
        '4eme': ['triangle'],
        '3eme': ['triangle'],
        '2nde': ['valeurs', 'conversion'],
        '1ere': ['valeurs', 'conversion', 'equations', 'addition', 'identites'],
        'terminale': ['valeurs', 'conversion', 'equations', 'addition', 'identites', 'triangle'],
    },
    'vecteurs': {
        '2nde': ['coordonnees', 'norme', 'operations'],
        '1ere': ['coordonnees', 'norme', 'colinearite', 'scalaire', 'operations'],
    },
    'geometrie-analytique': {
        '2nde': ['droites', 'distance'],
        '1ere': ['droites', 'cercles', 'distance', 'transformations'],
    },
    'geometrie-espace': {
        'terminale': null,
    },
    'arithmetique': {
        '3eme': ['divisibilite', 'pgcd'],
        'terminale': ['divisibilite', 'pgcd', 'premiers', 'congruences', 'bezout'],
    },
    'nombres-complexes': {
        'terminale': null,
    },
    'logique-denombrement': {
        'terminale': null,
    },
};

/* ========================================
   CONFIGURATION : NAVIGATION PAR CLASSE
   Chapitres par niveau (seulement modules existants)
   ======================================== */

const NAVIGATION_PAR_CLASSE = {
    '6e': {
        label: '6\u00e8me',
        color: '#4CAF50',
        chapitres: [
            { titre: 'Fractions simples', href: 'fractions.html?niveau=6eme' },
            { titre: 'Tableaux et graphiques', href: 'statistiques.html?niveau=6eme' },
        ]
    },
    '5e': {
        label: '5\u00e8me',
        color: '#2196F3',
        chapitres: [
            { titre: 'Fractions (+/\u2212)', href: 'fractions.html?niveau=5eme' },
            { titre: 'Pourcentages', href: 'pourcentages.html?niveau=5eme' },
            { titre: 'Moyennes', href: 'statistiques.html?niveau=5eme' },
        ]
    },
    '4e': {
        label: '4\u00e8me',
        color: '#FF9800',
        chapitres: [
            { titre: 'Fractions (\u00d7, \u00f7)', href: 'fractions.html?niveau=4eme' },
            { titre: 'Puissances', href: 'puissances.html?niveau=4eme' },
            { titre: 'Calcul litt\u00e9ral', href: 'developpement.html?niveau=4eme' },
            { titre: '\u00c9quations', href: 'index.html?niveau=4eme' },
            { titre: 'Pourcentages', href: 'pourcentages.html?niveau=4eme' },
            { titre: 'Cosinus', href: 'trigonometrie.html?niveau=4eme' },
            { titre: 'Statistiques', href: 'statistiques.html?niveau=4eme' },
            { titre: 'Probabilit\u00e9s', href: 'probabilites.html?niveau=4eme' },
        ]
    },
    '3e': {
        label: '3\u00e8me',
        color: '#F44336',
        chapitres: [
            { titre: 'R\u00e9duction', href: 'reduction.html?niveau=3eme' },
            { titre: 'D\u00e9veloppement', href: 'developpement.html?niveau=3eme' },
            { titre: 'Factorisation', href: 'factorisation.html?niveau=3eme' },
            { titre: '\u00c9quations', href: 'index.html?niveau=3eme' },
            { titre: 'In\u00e9quations', href: 'inequations.html?niveau=3eme' },
            { titre: 'Racines carr\u00e9es', href: 'racines.html?niveau=3eme' },
            { titre: 'Fonctions affines', href: 'fonctions-affines.html?niveau=3eme' },
            { titre: 'Syst\u00e8mes d\'\u00e9quations', href: 'systemes.html?niveau=3eme' },
            { titre: 'Trigonom\u00e9trie', href: 'trigonometrie.html?niveau=3eme' },
            { titre: 'Arithm\u00e9tique (PGCD)', href: 'arithmetique.html?niveau=3eme' },
            { titre: 'Statistiques', href: 'statistiques.html?niveau=3eme' },
            { titre: 'Probabilit\u00e9s', href: 'probabilites.html?niveau=3eme' },
        ]
    },
    '2de': {
        label: '2nde',
        color: '#9C27B0',
        chapitres: [
            { titre: 'Calcul litt\u00e9ral', href: 'developpement.html?niveau=2nde' },
            { titre: 'Factorisation', href: 'factorisation.html?niveau=2nde' },
            { titre: '\u00c9quations', href: 'index.html?niveau=2nde' },
            { titre: 'In\u00e9quations', href: 'inequations.html?niveau=2nde' },
            { titre: '\u00c9quations de droites', href: 'fonctions-affines.html?niveau=2nde' },
            { titre: 'Syst\u00e8mes d\'\u00e9quations', href: 'systemes.html?niveau=2nde' },
            { titre: 'Vecteurs', href: 'vecteurs.html?niveau=2nde' },
            { titre: 'G\u00e9om\u00e9trie analytique', href: 'geometrie-analytique.html?niveau=2nde' },
            { titre: 'Statistiques', href: 'statistiques.html?niveau=2nde' },
            { titre: 'Probabilit\u00e9s', href: 'probabilites.html?niveau=2nde' },
        ]
    },
    '1re': {
        label: '1\u00e8re Sp\u00e9',
        color: '#E91E63',
        chapitres: [
            { titre: 'Second degr\u00e9', href: 'equations2.html?niveau=1ere' },
            { titre: 'Fonction du 2nd degr\u00e9', href: 'fonctions-second-degre.html?niveau=1ere' },
            { titre: 'In\u00e9quations 2nd degr\u00e9', href: 'inequations2.html?niveau=1ere' },
            { titre: 'D\u00e9rivation', href: 'derivees.html?niveau=1ere' },
            { titre: 'Suites num\u00e9riques', href: 'suites.html?niveau=1ere' },
            { titre: 'Fonction exponentielle', href: 'exponentielles.html?niveau=1ere' },
            { titre: 'Trigonom\u00e9trie', href: 'trigonometrie.html?niveau=1ere' },
            { titre: 'Produit scalaire', href: 'vecteurs.html?niveau=1ere' },
            { titre: 'G\u00e9om\u00e9trie rep\u00e9r\u00e9e', href: 'geometrie-analytique.html?niveau=1ere' },
            { titre: 'Probabilit\u00e9s conditionnelles', href: 'probabilites.html?niveau=1ere' },
            { titre: 'Statistiques', href: 'statistiques.html?niveau=1ere' },
        ]
    },
    'Tle': {
        label: 'Tle Sp\u00e9',
        color: '#673AB7',
        chapitres: [
            { titre: 'Limites et continuit\u00e9', href: 'limites.html?niveau=terminale' },
            { titre: 'D\u00e9rivation (compl\u00e9ments)', href: 'derivees.html?niveau=terminale' },
            { titre: 'Logarithme n\u00e9p\u00e9rien', href: 'exponentielles.html?niveau=terminale' },
            { titre: 'Primitives et int\u00e9grales', href: 'primitives.html?niveau=terminale' },
            { titre: 'Suites (limites)', href: 'suites.html?niveau=terminale' },
            { titre: 'Nombres complexes', href: 'nombres-complexes.html?niveau=terminale' },
            { titre: 'Arithm\u00e9tique', href: 'arithmetique.html?niveau=terminale' },
            { titre: 'D\u00e9nombrement', href: 'logique-denombrement.html?niveau=terminale' },
            { titre: 'G\u00e9om\u00e9trie dans l\'espace', href: 'geometrie-espace.html?niveau=terminale' },
            { titre: 'Loi binomiale', href: 'probabilites.html?niveau=terminale' },
        ]
    },
};

/* ========================================
   GESTION DU MODE DE NAVIGATION
   ======================================== */

function getNavMode() {
    try {
        return localStorage.getItem('mathsfacile-nav-mode') || 'classe';
    } catch (e) {
        return 'classe';
    }
}

function setNavMode(mode) {
    try {
        localStorage.setItem('mathsfacile-nav-mode', mode);
    } catch (e) {
        // localStorage indisponible
    }
}

/* ========================================
   GENERATION NAVIGATION PAR THEME (ancien mode)
   ======================================== */

function generateNavigationParTheme(currentPage) {
    return `
            <!-- Algebre -->
            <li class="nav-item has-dropdown">
                <a href="#" class="nav-link">
                    Alg\u00e8bre
                    <span class="arrow">\u25be</span>
                </a>
                <ul class="nav-dropdown">
                    <li><a href="index.html" ${currentPage === 'index' ? 'class="active"' : ''}>\u00c9quations</a></li>
                    <li><a href="developpement.html" ${currentPage === 'developpement' ? 'class="active"' : ''}>D\u00e9veloppement</a></li>
                    <li><a href="reduction.html" ${currentPage === 'reduction' ? 'class="active"' : ''}>R\u00e9duction</a></li>
                    <li><a href="factorisation.html" ${currentPage === 'factorisation' ? 'class="active"' : ''}>Factorisation</a></li>
                    <li><a href="inequations.html" ${currentPage === 'inequations' ? 'class="active"' : ''}>In\u00e9quations</a></li>
                    <li><a href="equations2.html" ${currentPage === 'equations2' ? 'class="active"' : ''}>\u00c9quations 2nd degr\u00e9</a></li>
                    <li><a href="inequations2.html" ${currentPage === 'inequations2' ? 'class="active"' : ''}>In\u00e9quations 2nd degr\u00e9</a></li>
                    <li><a href="systemes.html" ${currentPage === 'systemes' ? 'class="active"' : ''}>Syst\u00e8mes d'\u00e9quations</a></li>
                </ul>
            </li>

            <!-- Calculs -->
            <li class="nav-item has-dropdown">
                <a href="#" class="nav-link">
                    Calculs
                    <span class="arrow">\u25be</span>
                </a>
                <ul class="nav-dropdown">
                    <li><a href="fractions.html" ${currentPage === 'fractions' ? 'class="active"' : ''}>Fractions</a></li>
                    <li><a href="pourcentages.html" ${currentPage === 'pourcentages' ? 'class="active"' : ''}>Pourcentages</a></li>
                    <li><a href="puissances.html" ${currentPage === 'puissances' ? 'class="active"' : ''}>Puissances</a></li>
                    <li><a href="racines.html" ${currentPage === 'racines' ? 'class="active"' : ''}>Racines carr\u00e9es</a></li>
                </ul>
            </li>

            <!-- Fonctions -->
            <li class="nav-item has-dropdown">
                <a href="#" class="nav-link">
                    Fonctions
                    <span class="arrow">\u25be</span>
                </a>
                <ul class="nav-dropdown">
                    <li><a href="fonctions-affines.html" ${currentPage === 'fonctions-affines' ? 'class="active"' : ''}>Fonctions Affines</a></li>
                    <li><a href="fonctions-second-degre.html" ${currentPage === 'fonctions-second-degre' ? 'class="active"' : ''}>Fonctions 2nd degr\u00e9</a></li>
                    <li><a href="derivees.html" ${currentPage === 'derivees' ? 'class="active"' : ''}>D\u00e9riv\u00e9es</a></li>
                </ul>
            </li>

            <!-- Suites -->
            <li class="nav-item has-dropdown">
                <a href="#" class="nav-link">
                    Suites
                    <span class="arrow">\u25be</span>
                </a>
                <ul class="nav-dropdown">
                    <li><a href="suites.html" ${currentPage === 'suites' ? 'class="active"' : ''}>Suites Num\u00e9riques</a></li>
                </ul>
            </li>

            <!-- Analyse -->
            <li class="nav-item has-dropdown">
                <a href="#" class="nav-link">
                    Analyse
                    <span class="arrow">\u25be</span>
                </a>
                <ul class="nav-dropdown">
                    <li><a href="limites.html" ${currentPage === 'limites' ? 'class="active"' : ''}>Limites</a></li>
                    <li><a href="primitives.html" ${currentPage === 'primitives' ? 'class="active"' : ''}>Primitives & Int\u00e9grales</a></li>
                    <li><a href="exponentielles.html" ${currentPage === 'exponentielles' ? 'class="active"' : ''}>Exponentielles & Logarithmes</a></li>
                </ul>
            </li>

            <!-- Proba & Stats -->
            <li class="nav-item has-dropdown">
                <a href="#" class="nav-link">
                    Proba & Stats
                    <span class="arrow">\u25be</span>
                </a>
                <ul class="nav-dropdown">
                    <li><a href="probabilites.html" ${currentPage === 'probabilites' ? 'class="active"' : ''}>Probabilit\u00e9s</a></li>
                    <li><a href="statistiques.html" ${currentPage === 'statistiques' ? 'class="active"' : ''}>Statistiques</a></li>
                </ul>
            </li>

            <!-- Geometrie & Trigo -->
            <li class="nav-item has-dropdown">
                <a href="#" class="nav-link">
                    G\u00e9om\u00e9trie & Trigo
                    <span class="arrow">\u25be</span>
                </a>
                <ul class="nav-dropdown">
                    <li><a href="trigonometrie.html" ${currentPage === 'trigonometrie' ? 'class="active"' : ''}>Trigonom\u00e9trie</a></li>
                    <li><a href="vecteurs.html" ${currentPage === 'vecteurs' ? 'class="active"' : ''}>Vecteurs</a></li>
                    <li><a href="geometrie-analytique.html" ${currentPage === 'geometrie-analytique' ? 'class="active"' : ''}>G\u00e9om\u00e9trie analytique</a></li>
                    <li><a href="geometrie-espace.html" ${currentPage === 'geometrie-espace' ? 'class="active"' : ''}>G\u00e9om\u00e9trie dans l'espace</a></li>
                </ul>
            </li>

            <!-- Terminale Spe -->
            <li class="nav-item has-dropdown">
                <a href="#" class="nav-link">
                    Terminale Sp\u00e9
                    <span class="arrow">\u25be</span>
                </a>
                <ul class="nav-dropdown">
                    <li><a href="arithmetique.html" ${currentPage === 'arithmetique' ? 'class="active"' : ''}>Arithm\u00e9tique</a></li>
                    <li><a href="nombres-complexes.html" ${currentPage === 'nombres-complexes' ? 'class="active"' : ''}>Nombres Complexes</a></li>
                    <li><a href="logique-denombrement.html" ${currentPage === 'logique-denombrement' ? 'class="active"' : ''}>Logique & D\u00e9nombrement</a></li>
                </ul>
            </li>`;
}

/* ========================================
   GENERATION NAVIGATION PAR CLASSE (nouveau mode)
   ======================================== */

function generateNavigationParClasse(currentPage) {
    // Detecter le niveau courant depuis l'URL
    const params = new URLSearchParams(window.location.search);
    const currentNiveau = params.get('niveau') || '';

    let menuHTML = '';

    for (const [key, data] of Object.entries(NAVIGATION_PAR_CLASSE)) {
        const chapitresHTML = data.chapitres.map(ch => {
            // Extraire page et niveau du href pour comparer
            const hrefPage = ch.href.split('?')[0].replace('.html', '') || 'index';
            const hrefParams = new URLSearchParams(ch.href.split('?')[1] || '');
            const hrefNiveau = hrefParams.get('niveau') || '';

            const isActive = (currentPage === hrefPage || (currentPage === 'index' && hrefPage === 'index'))
                             && currentNiveau === hrefNiveau;

            return `<li><a href="${ch.href}" ${isActive ? 'class="active"' : ''}>${ch.titre}</a></li>`;
        }).join('\n                        ');

        menuHTML += `
                <li class="nav-item has-dropdown">
                    <a href="#" class="nav-link">
                        ${key}
                        <span class="arrow">\u25be</span>
                    </a>
                    <ul class="nav-dropdown">
                        ${chapitresHTML}
                    </ul>
                </li>`;
    }

    return menuHTML;
}

/* ========================================
   GENERATION NAVIGATION (dispatch)
   ======================================== */

/**
 * Genere le HTML complet de la navigation
 * @param {string} currentPage - Nom de la page courante
 * @returns {string} HTML de la navigation
 */
function generateNavigation(currentPage = '') {
    const mode = getNavMode();
    const menuContent = mode === 'classe'
        ? generateNavigationParClasse(currentPage)
        : generateNavigationParTheme(currentPage);

    const modeClass = mode === 'classe' ? 'nav-mode-classe' : 'nav-mode-theme';
    const toggleLabel = mode === 'classe' ? 'Par th\u00e8me' : 'Par classe';

    return `
    <nav class="nav ${modeClass}">
        <div class="nav-container">
            <a href="accueil.html" class="nav-brand">MathsFacile</a>

            <button class="nav-hamburger" aria-label="Menu">
                <span></span>
                <span></span>
                <span></span>
            </button>

            <ul class="nav-menu">
                ${menuContent}
            </ul>

            <button class="nav-mode-toggle" id="navModeToggle" title="Changer le mode de navigation">
                ${toggleLabel}
            </button>
        </div>
    </nav>`;
}

/* ========================================
   INJECTION ET EVENEMENTS
   ======================================== */

/**
 * Injecte la navigation dans la page
 */
function injectNavigation() {
    const path = window.location.pathname;
    const page = path.split('/').pop().replace('.html', '') || 'index';

    const navHTML = generateNavigation(page);

    const placeholder = document.getElementById('nav-placeholder');
    if (placeholder) {
        placeholder.outerHTML = navHTML;
    } else {
        document.body.insertAdjacentHTML('afterbegin', navHTML);
    }

    initNavigationEvents();
}

/**
 * Initialise les evenements de navigation
 */
function initNavigationEvents() {
    const hamburger = document.querySelector('.nav-hamburger');
    const menu = document.querySelector('.nav-menu');
    const overlay = document.querySelector('.nav-overlay');
    const dropdownToggles = document.querySelectorAll('.nav-item.has-dropdown > .nav-link');
    const mode = getNavMode();

    // Toggle menu mobile (hamburger)
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            menu.classList.toggle('active');

            if (!overlay) {
                const newOverlay = document.createElement('div');
                newOverlay.className = 'nav-overlay';
                document.body.appendChild(newOverlay);

                newOverlay.addEventListener('click', () => {
                    closeMenu();
                });

                setTimeout(() => newOverlay.classList.add('active'), 10);
            } else {
                overlay.classList.toggle('active');
            }
        });
    }

    // Dropdowns sur mobile
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                // En mode classe : toggle l'expansion du dropdown
                if (mode === 'classe') {
                    const item = toggle.parentElement;
                    item.classList.toggle('expanded');
                }
            }
        });
    });

    // Fermer le menu lors du clic sur un lien
    const navLinks = document.querySelectorAll('.nav-dropdown a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                closeMenu();
            }
        });
    });

    // Fermer le menu lors du redimensionnement vers desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeMenu();
        }
    });

    // Toggle mode classe/theme
    const toggleBtn = document.getElementById('navModeToggle');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const current = getNavMode();
            const next = current === 'classe' ? 'theme' : 'classe';
            setNavMode(next);
            // Recharger pour appliquer le nouveau mode
            // Retirer le parametre niveau si on passe en mode theme
            if (next === 'theme') {
                const url = new URL(window.location);
                url.searchParams.delete('niveau');
                window.location.href = url.toString();
            } else {
                window.location.reload();
            }
        });
    }
}

/**
 * Ferme le menu mobile
 */
function closeMenu() {
    const hamburger = document.querySelector('.nav-hamburger');
    const menu = document.querySelector('.nav-menu');
    const overlay = document.querySelector('.nav-overlay');

    if (hamburger) hamburger.classList.remove('active');
    if (menu) menu.classList.remove('active');
    if (overlay) overlay.classList.remove('active');

    // Fermer tous les dropdowns expandus
    document.querySelectorAll('.nav-item.expanded').forEach(item => {
        item.classList.remove('expanded');
    });
}

/* ========================================
   FILTRAGE PAR NIVEAU
   ======================================== */

/**
 * Filtre les boutons de type selon le niveau de classe
 * Appele apres l'init du module via setTimeout
 */
function applyNiveauFilter() {
    const params = new URLSearchParams(window.location.search);
    const niveau = params.get('niveau');
    if (!niveau) return;

    // Identifier le module courant
    const page = window.location.pathname.split('/').pop().replace('.html', '') || 'index';
    const moduleKey = page === 'index' ? 'equations' : page;

    const config = NIVEAUX_CONFIG[moduleKey];
    if (!config || !config[niveau]) return;

    const allowedTypes = config[niveau];
    // null = tous les types autorises, pas de filtrage
    if (allowedTypes === null) return;

    // Cacher les boutons non autorises
    const allBtns = document.querySelectorAll('.type-btn');
    let hasActive = false;

    allBtns.forEach(btn => {
        if (!allowedTypes.includes(btn.dataset.type)) {
            btn.style.display = 'none';
            btn.classList.remove('active');
        } else if (btn.classList.contains('active')) {
            hasActive = true;
        }
    });

    // Si le bouton actif a ete cache, activer le premier autorise
    if (!hasActive) {
        const firstAllowedBtn = document.querySelector(`.type-btn[data-type="${allowedTypes[0]}"]`);
        if (firstAllowedBtn) {
            firstAllowedBtn.click();
        }
    }

    // Afficher un badge niveau dans le header
    const header = document.querySelector('header');
    if (header) {
        const niveauLabels = {
            '6eme': '6\u00e8me', '5eme': '5\u00e8me', '4eme': '4\u00e8me', '3eme': '3\u00e8me',
            '2nde': '2nde', '1ere': '1\u00e8re Sp\u00e9', 'terminale': 'Terminale Sp\u00e9'
        };
        const label = niveauLabels[niveau] || niveau;

        const badge = document.createElement('div');
        badge.className = 'niveau-badge';
        badge.innerHTML = `Niveau ${label} <a href="accueil.html" class="niveau-badge-link">Changer</a>`;
        header.insertBefore(badge, header.firstChild);
    }
}

/* ========================================
   INITIALISATION
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    const existingNav = document.querySelector('.nav');
    if (existingNav) {
        initNavigationEvents();
    } else {
        injectNavigation();
    }

    // Appliquer le filtrage par niveau APRES l'init du module
    setTimeout(applyNiveauFilter, 0);
});
