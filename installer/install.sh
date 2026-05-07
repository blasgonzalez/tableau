#!/bin/bash
echo ""
echo " ===================================================="
echo "   Tableau - Instalador para Mac"
echo " ===================================================="
echo ""

APP_DIR="$( cd "$( dirname "$0" )" && pwd )"

# Buscar Node.js en ubicaciones habituales
NODE_BIN=$(command -v node 2>/dev/null)
if [ -z "$NODE_BIN" ]; then
    for p in "/opt/homebrew/bin/node" "/usr/local/bin/node"; do
        [ -x "$p" ] && NODE_BIN="$p" && break
    done
fi

if [ -z "$NODE_BIN" ]; then
    echo " [ERROR] Node.js no está instalado."
    echo ""
    echo "   Instálalo desde: https://nodejs.org"
    echo "   O con Homebrew:  brew install node"
    echo ""
    read -rp " Pulsa Enter para cerrar..."
    exit 1
fi

echo " [OK] Node.js $("$NODE_BIN" --version) encontrado."

NPM_BIN="$(dirname "$NODE_BIN")/npm"
[ -x "$NPM_BIN" ] || NPM_BIN=$(command -v npm 2>/dev/null)

echo ""
echo " Instalando dependencias (puede tardar 1-3 minutos)..."
cd "$APP_DIR" && "$NPM_BIN" install --omit=dev --loglevel=error
if [ $? -ne 0 ]; then
    echo ""
    echo " [ERROR] La instalación de dependencias ha fallado."
    read -rp " Pulsa Enter para cerrar..."
    exit 1
fi
echo " [OK] Dependencias instaladas."
echo ""

# Crear lanzador en el Escritorio con la ruta de la app embebida
LAUNCHER="$HOME/Desktop/Tableau.command"
{
    echo "#!/bin/bash"
    echo "export TABLEAU_DATA_DIR=\"\$HOME/Library/Application Support/Tableau/data\""
    echo "export TABLEAU_UPDATE_URL=\"https://raw.githubusercontent.com/blasgonzalez/tableau/main/installer/version.json\""
    echo "mkdir -p \"\$TABLEAU_DATA_DIR\""
    echo "(sleep 2 && open \"http://localhost:3000\") &"
    printf 'node "%s/server.js"\n' "$APP_DIR"
} > "$LAUNCHER"
chmod +x "$LAUNCHER"

echo " [OK] Lanzador creado en el Escritorio: Tableau.command"
echo ""
echo " ===================================================="
echo "   Instalacion completada!"
echo ""
echo "   Haz doble clic en 'Tableau.command' del Escritorio"
echo "   para abrir la aplicacion."
echo " ===================================================="
echo ""
read -rp " Pulsa Enter para cerrar..."
