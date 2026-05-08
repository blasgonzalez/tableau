#!/bin/bash
echo ""
echo " ===================================================="
echo "   Tableau - Instalador para Linux"
echo " ===================================================="
echo ""

APP_DIR="$( cd "$( dirname "$0" )" && pwd )"

# Buscar Node.js (algunas distros lo registran como 'nodejs')
NODE_BIN=$(command -v node 2>/dev/null || command -v nodejs 2>/dev/null)

if [ -z "$NODE_BIN" ]; then
    echo " [ERROR] Node.js no esta instalado."
    echo ""
    echo "   Ubuntu / Linux Mint:  sudo apt install nodejs npm"
    echo "   Fedora:               sudo dnf install nodejs npm"
    echo "   O desde:              https://nodejs.org"
    echo ""
    read -rp " Pulsa Enter para cerrar..."
    exit 1
fi

echo " [OK] Node.js $("$NODE_BIN" --version) encontrado."

NPM_BIN=$(command -v npm 2>/dev/null)
if [ -z "$NPM_BIN" ]; then
    echo " [ERROR] npm no encontrado."
    echo "   Ubuntu / Linux Mint:  sudo apt install npm"
    read -rp " Pulsa Enter para cerrar..."
    exit 1
fi

echo ""
echo " Instalando dependencias (puede tardar 1-3 minutos)..."
cd "$APP_DIR" && "$NPM_BIN" install --omit=dev --loglevel=error
if [ $? -ne 0 ]; then
    echo ""
    echo " [ERROR] La instalacion de dependencias ha fallado."
    read -rp " Pulsa Enter para cerrar..."
    exit 1
fi
echo " [OK] Dependencias instaladas."

# Crear carpeta de datos
DATA_DIR="$HOME/.local/share/Tableau/data"
mkdir -p "$DATA_DIR"
echo " [OK] Carpeta de datos: $DATA_DIR"
echo ""

# Dar permisos al lanzador
chmod +x "$APP_DIR/launch.sh"

# Crear acceso directo en el Escritorio (.desktop)
DESKTOP_FILE="$HOME/Desktop/Tableau.desktop"
{
    echo "[Desktop Entry]"
    echo "Version=1.0"
    echo "Type=Application"
    echo "Name=Tableau"
    echo "Comment=Gestion visual de proyectos fotograficos"
    printf 'Exec=bash "%s/launch.sh"\n' "$APP_DIR"
    echo "Terminal=true"
    echo "Categories=Graphics;"
} > "$DESKTOP_FILE"
chmod +x "$DESKTOP_FILE"
# Marcar como de confianza en entornos GNOME/Cinnamon
gio set "$DESKTOP_FILE" metadata::trusted true 2>/dev/null || true

echo " [OK] Acceso directo creado en el Escritorio: Tableau.desktop"
echo ""
echo " ===================================================="
echo "   Instalacion completada!"
echo ""
echo "   Haz doble clic en 'Tableau' del Escritorio"
echo "   para abrir la aplicacion."
echo " ===================================================="
echo ""
read -rp " Pulsa Enter para cerrar..."
