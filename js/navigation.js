// Fichier: js/navigation.js
// Gestion de la navigation responsive

/**
 * Initialise la navigation responsive
 */
function initNavigation() {
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
document.addEventListener('DOMContentLoaded', initNavigation);
