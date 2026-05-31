#!/bin/bash
# Instalar Tableau — clic derecho > Abrir
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SRC="$SCRIPT_DIR/Tableau.app"
DEST="/Applications/Tableau.app"

echo ""
echo "Instalando Tableau..."

if [ ! -d "$SRC" ]; then
  echo "Error: no se encuentra Tableau.app en el mismo directorio que este script."
  exit 1
fi

cp -rf "$SRC" "$DEST"
xattr -cr "$DEST"

echo "Instalado correctamente. Abriendo Tableau..."
sleep 1
open "$DEST"
