#!/bin/bash
APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"
NODE="$APP_DIR/node/node"
SERVER="$APP_DIR/app/server.js"
DATA_DIR="$HOME/Library/Application Support/Tableau/data"

mkdir -p "$DATA_DIR"
export TABLEAU_DATA_DIR="$DATA_DIR"
export TABLEAU_UPDATE_URL="https://raw.githubusercontent.com/blasgonzalez/tableau/main/installer/version.json"

# Si el servidor ya está en marcha solo abrir el navegador
if lsof -ti:3000 > /dev/null 2>&1; then
    open "http://localhost:3000"
    exit 0
fi

# Arrancar servidor en segundo plano
"$NODE" "$SERVER" &

# Esperar hasta que el servidor responda (máx 30 s)
for i in $(seq 1 30); do
    curl -s "http://localhost:3000" > /dev/null 2>&1 && break
    sleep 1
done

open "http://localhost:3000"
