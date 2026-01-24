// Fichier: js/navigation.js
// Gestion de la navigation responsive

/**
 * Génère le HTML de la navigation
 * @param {string} currentPage - Nom de la page courante (ex: 'index', 'equations2')
 * @returns {string} HTML de la navigation
 */
function generateNavigation(currentPage = '') {
    return `
    <nav class="nav">
        <div class="nav-container">
            <!-- Logo -->
            <a href="index.html" class="nav-brand">MathsFacile</a>

            <!-- Hamburger (mobile uniquement) -->
            <button class="nav-hamburger" aria-label="Menu">
                <span></span>
                <span></span>
                <span></span>
            </button>

            <!-- Menu principal -->
            <ul class="nav-menu">
                <!-- Catégorie : Algèbre -->
                <li class="nav-item has-dropdown">
                    <a href="#" class="nav-link">
                        Algèbre
                        <span class="arrow">▾</span>
                    </a>
                    <ul class="nav-dropdown">
                        <li><a href="index.html" ${currentPage === 'index' ? 'class="active"' : ''}>Équations</a></li>
                        <li><a href="developpement.html" ${currentPage === 'developpement' ? 'class="active"' : ''}>Développement</a></li>
                        <li><a href="reduction.html" ${currentPage === 'reduction' ? 'class="active"' : ''}>Réduction</a></li>
                        <li><a href="factorisation.html" ${currentPage === 'factorisation' ? 'class="active"' : ''}>Factorisation</a></li>
                        <li><a href="inequations.html" ${currentPage === 'inequations' ? 'class="active"' : ''}>Inéquations</a></li>
                        <li><a href="equations2.html" ${currentPage === 'equations2' ? 'class="active"' : ''}>Équations 2nd degré</a></li>
                        <li><a href="inequations2.html" ${currentPage === 'inequations2' ? 'class="active"' : ''}>Inéquations 2nd degré</a></li>
                        <li><a href="systemes.html" ${currentPage === 'systemes' ? 'class="active"' : ''}>Systèmes d'équations</a></li>
                    </ul>
                </li>

                <!-- Catégorie : Calculs -->
                <li class="nav-item has-dropdown">
                    <a href="#" class="nav-link">
                        Calculs
                        <span class="arrow">▾</span>
                    </a>
                    <ul class="nav-dropdown">
                        <li><a href="fractions.html" ${currentPage === 'fractions' ? 'class="active"' : ''}>Fractions</a></li>
                        <li><a href="pourcentages.html" ${currentPage === 'pourcentages' ? 'class="active"' : ''}>Pourcentages</a></li>
                        <li><a href="puissances.html" ${currentPage === 'puissances' ? 'class="active"' : ''}>Puissances</a></li>
                        <li><a href="racines.html" ${currentPage === 'racines' ? 'class="active"' : ''}>Racines carrées</a></li>
                    </ul>
                </li>
            </ul>
        </div>
    </nav>`;
}

/**
 * Injecte la navigation dans la page
 * Cherche un élément avec id="nav-placeholder" ou l'insère au début du body
 */
function injectNavigation() {
    // Détecter la page courante depuis le nom du fichier
    const path = window.location.pathname;
    const page = path.split('/').pop().replace('.html', '') || 'index';

    // Générer le HTML
    const navHTML = generateNavigation(page);

    // Chercher le placeholder
    const placeholder = document.getElementById('nav-placeholder');

    if (placeholder) {
        placeholder.outerHTML = navHTML;
    } else {
        // Insérer au début du body si pas de placeholder
        const container = document.querySelector('.container') || document.body;
        container.insertAdjacentHTML('afterbegin', navHTML);
    }

    // Initialiser les événements de navigation
    initNavigationEvents();
}

/**
 * Initialise la navigation responsive
 */
function initNavigationEvents() {
    const hamburger = document.querySelector('.nav-hamburger');
    const menu = document.querySelector('.nav-menu');
    const overlay = document.querySelector('.nav-overlay');
    const dropdownToggles = document.querySelectorAll('.nav-item.has-dropdown > .nav-link');

    // Toggle menu mobile (hamburger)
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            menu.classList.toggle('active');

            // Créer/toggle overlay
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

    // Toggle dropdowns sur mobile
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            // Sur mobile uniquement
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const parent = toggle.parentElement;
                parent.classList.toggle('active');

                // Fermer les autres dropdowns
                dropdownToggles.forEach(other => {
                    if (other !== toggle) {
                        other.parentElement.classList.remove('active');
                    }
                });
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
}

// Initialiser au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    // Si la navigation existe déjà dans le HTML, juste initialiser les événements
    const existingNav = document.querySelector('.nav');
    if (existingNav) {
        initNavigationEvents();
    } else {
        // Sinon, injecter la navigation
        injectNavigation();
    }
});

