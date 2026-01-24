#!/bin/bash

# Script pour convertir les fichiers HTML existants vers la navigation dynamique

echo "🔄 Conversion des fichiers HTML vers navigation dynamique..."

# Liste des fichiers HTML à convertir
files=(
    "index.html"
    "developpement.html"
    "reduction.html"
    "factorisation.html"
    "inequations.html"
    "fractions.html"
    "pourcentages.html"
    "puissances.html"
    "racines.html"
    "equations2.html"
    "inequations2.html"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "📝 Traitement de $file..."

        # Créer une sauvegarde
        cp "$file" "${file}.backup"

        # Remplacer le bloc <nav>...</nav> par <div id="nav-placeholder"></div>
        # On utilise sed avec un pattern multiligne
        perl -i -0pe 's/<nav class="nav">.*?<\/nav>/<div id="nav-placeholder"><\/div>/s' "$file"

        echo "✅ $file converti (backup créé: ${file}.backup)"
    else
        echo "⚠️  $file non trouvé, ignoré."
    fi
done

echo ""
echo "✨ Conversion terminée !"
echo "📋 Les fichiers originaux sont sauvegardés avec l'extension .backup"
echo "💡 Pour tester, ouvrez les fichiers HTML dans votre navigateur"
echo "🗑️  Pour supprimer les backups: rm *.backup"
