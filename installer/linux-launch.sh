#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
NODE="$SCRIPT_DIR/runtime/node"
SERVER="$SCRIPT_DIR/server.js"
DATA_DIR="${XDG_DATA_HOME:-$HOME/.local/share}/tableau/data"

mkdir -p "$DATA_DIR"
export TABLEAU_DATA_DIR="$DATA_DIR"
export TABLEAU_UPDATE_URL="https://raw.githubusercontent.com/blasgonzalez/tableau/main/installer/version.json"

# Si el servidor ya está en marcha solo abrir el navegador
if ss -tlnp 2>/dev/null | grep -q ':3000 ' || lsof -ti:3000 > /dev/null 2>&1; then
    xdg-open "http://localhost:3000" 2>/dev/null || true
    exit 0
fi

# Arrancar servidor en segundo plano
"$NODE" "$SERVER" &

# Esperar hasta que el servidor responda (máx 30 s)
for i in $(seq 1 30); do
    curl -s "http://localhost:3000" > /dev/null 2>&1 && break
    sleep 1
done

xdg-open "http://localhost:3000" 2>/dev/null || echo "Abre http://localhost:3000 en tu navegador"
