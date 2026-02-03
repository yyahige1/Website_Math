/* ========================================
   TABLEAU DE VARIATIONS - Système CSS Grid Unifié
   Basé sur le guide technique fourni
   ======================================== */

/**
 * Génère un tableau de variations dynamique avec CSS Grid
 * @param {Array} liste_x - Valeurs de x (ex: ["-∞", -1, 1, "+∞"])
 * @param {Array} liste_fx - Valeurs de f(x) (ex: ["-∞", 2, -2, "+∞"])
 * @param {Array} liste_nature - Nature de chaque point (ex: ["lim", "max", "min", "lim"])
 * @param {Array} signes_derivee - Signes entre points (ex: ["+", "-", "+"])
 * @param {Object} options - Options d'affichage
 * @returns {string} HTML du tableau
 */
function genererTableauVariations(liste_x, liste_fx, liste_nature, signes_derivee, options = {}) {
    const {
        afficherDerivee = true,
        formuleDerivee = "f'(x)"
    } = options;

    // ÉTAPE 1 : Calculer le nombre de colonnes
    const n_points = liste_x.length;
    const n_colonnes = (2 * n_points) - 1;

    // ÉTAPE 2 : Générer les classes CSS inline pour ce tableau
    const gridCols = Array(n_colonnes).fill('1fr').join(' ');

    let html = '<div class="variations-table-wrapper">';
    html += `<style>
        .variations-table-wrapper .var-content-cell {
            display: grid;
            grid-template-columns: ${gridCols};
            align-items: stretch;
            height: 60px;
        }
        .variations-table-wrapper .var-fx-row .var-content-cell {
            height: 180px;
            align-items: stretch;
        }
        .variations-table-wrapper .var-arrow-col {
            display: flex;         /* Active Flexbox */
            align-items: center;    /* Centre verticalement la flèche */
            justify-content: center;/* Centre horizontalement la flèche */
        }

        ${Array.from({length: n_colonnes}, (_, i) =>
            `.variations-table-wrapper .var-col-${i+1} { grid-column: ${i+1}; text-align: center; }`
        ).join('\n')}
        .variations-table-wrapper .var-v-align-top {
            align-self: start;
            padding-top: 15px;
        }
        .variations-table-wrapper .var-v-align-bottom {
            align-self: end;
            padding-bottom: 15px;
        }
        .variations-table-wrapper .var-fx-value {
            display: inline-block;
            padding: 8px 12px;
            font-weight: 800;
            font-size: 1.2em;
            background: #fff3cd;
            color: #856404;
            border: 2px solid #ffc107;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .variations-table-wrapper .var-arrow {
            font-size: 2.5em;
            font-weight: 700;
            line-height: 1;
        }
        .variations-table-wrapper .var-arrow-up { color: #27ae60; }
        .variations-table-wrapper .var-arrow-down { color: #e74c3c; }
        .variations-table-wrapper .var-deriv-zone {
            font-size: 1.3em;
            font-weight: 700;
        }
        .variations-table-wrapper .var-deriv-positive { color: #27ae60; }
        .variations-table-wrapper .var-deriv-negative { color: #e74c3c; }
        .variations-table-wrapper .var-deriv-zero { color: #333; }
        .variations-table-wrapper .var-x-value {
            font-weight: 700;
            font-size: 1.1em;
        }
    </style>`;

    html += '<table class="variations-table">';

    // ÉTAPE 3 : Ligne X
    html += '<tr><th>x</th><td class="var-content-cell">';
    for (let i = 0; i < n_points; i++) {
        const col_index = (i * 2) + 1; // Colonnes impaires : 1, 3, 5...
        html += `<div class="var-col-${col_index}"><span class="var-x-value">${liste_x[i]}</span></div>`;

        // Colonne paire vide entre les points
        if (i < n_points - 1) {
            const col_index_pair = col_index + 1;
            html += `<div class="var-col-${col_index_pair}"></div>`;
        }
    }
    html += '</td></tr>';

    // ÉTAPE 4 : Ligne F'(X) (si demandée)
    if (afficherDerivee) {
        html += `<tr><th>${formuleDerivee}</th><td class="var-content-cell">`;

        // Première colonne vide
        html += '<div class="var-col-1"></div>';

        let col_counter = 2;
        for (let i = 0; i < signes_derivee.length; i++) {
            // Colonne paire : signe dans l'intervalle
            const signe = signes_derivee[i];
            const classe = signe === '+' ? 'var-deriv-positive' : 'var-deriv-negative';
            html += `<div class="var-col-${col_counter}"><div class="var-deriv-zone ${classe}">${signe}</div></div>`;
            col_counter++;

            // Colonne impaire : zéro au point critique (sauf dernière)
            if (i < signes_derivee.length - 1) {
                html += `<div class="var-col-${col_counter}"><div class="var-deriv-zone var-deriv-zero">0</div></div>`;
                col_counter++;
            }
        }

        // Dernière colonne vide
        html += `<div class="var-col-${n_colonnes}"></div>`;
        html += '</td></tr>';
    }

    // ÉTAPE 5 : Ligne F(X)
    html += '<tr class="var-fx-row"><th>Variations de f</th><td class="var-content-cell">';

    for (let i = 0; i < n_points; i++) {
        const col_index = (i * 2) + 1; // Colonnes impaires

        // Déterminer l'alignement vertical selon la direction de la flèche
        let v_align;
        if (i < n_points - 1) {
            // Pas le dernier point : regarder la flèche qui PART de ce point
            // Si ↗ (monte), le point de départ est EN BAS
            // Si ↘ (descend), le point de départ est EN HAUT
            v_align = signes_derivee[i] === '+' ? 'var-v-align-bottom' : 'var-v-align-top';
        } else {
            // Dernier point : regarder la flèche qui ARRIVE à ce point
            // Si on arrive en montant ↗, le point final est EN HAUT
            // Si on arrive en descendant ↘, le point final est EN BAS
            v_align = signes_derivee[i - 1] === '+' ? 'var-v-align-top' : 'var-v-align-bottom';
        }

        // Valeur de f(x)
        html += `<div class="var-col-${col_index} ${v_align}">`;
        html += `<span class="var-fx-value">${liste_fx[i]}</span>`;
        html += '</div>';

        // Flèche dans la colonne paire suivante
        if (i < n_points - 1) {
            const col_index_pair = col_index + 1;
            const signe_intervalle = signes_derivee[i];
            const arrow_class = signe_intervalle === '+' ? 'var-arrow-up' : 'var-arrow-down';
            const arrow_symbol = signe_intervalle === '+' ? '↗' : '↘';

            html += `<div class="var-col-${col_index_pair} var-arrow-col">`;
            html += `<span class="var-arrow ${arrow_class}">${arrow_symbol}</span>`;
            html += '</div>';
        }
    }

    html += '</td></tr>';
    html += '</table>';
    html += '</div>';

    return html;
}
