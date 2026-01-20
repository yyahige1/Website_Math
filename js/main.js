/* ========================================
   MAIN.JS - Initialisation globale
   ======================================== */

/**
 * Initialise les fonctionnalités communes à toutes les pages
 */
function initApp() {
    // Marquer le lien de navigation actif
    highlightActiveNav();
}

/**
 * Met en évidence le lien de navigation correspondant à la page actuelle
 */
function highlightActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

/**
 * Génère le HTML de la navigation
 * @returns {string}
 */
function getNavHTML() {
    return `
        <nav class="nav">
            <a href="index.html">Équations</a>
            <a href="developpement.html">Développement</a>
            <a href="reduction.html">Réduction</a>
            <a href="factorisation.html">Factorisation</a>
            <a href="inequations.html">Inéquations</a>
        </nav>
    `;
}

// Initialiser quand le DOM est prêt
document.addEventListener('DOMContentLoaded', initApp);
