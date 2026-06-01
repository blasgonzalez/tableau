#!/bin/bash
APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"
NODE="$APP_DIR/node/node"
SERVER="$APP_DIR/app/server.js"
DATA_DIR="$HOME/Library/Application Support/Tableau/data"
LOG_FILE="$HOME/Library/Logs/Tableau/tableau.log"

mkdir -p "$DATA_DIR"
mkdir -p "$(dirname "$LOG_FILE")"
export TABLEAU_DATA_DIR="$DATA_DIR"
export TABLEAU_UPDATE_URL="https://raw.githubusercontent.com/blasgonzalez/tableau/main/installer/version.json"

xattr -dr com.apple.quarantine "$APP_DIR/.." 2>/dev/null || true

if lsof -ti:3000 > /dev/null 2>&1; then
    open "http://localhost:3000"
    exit 0
fi

echo "--- $(date) ---" >> "$LOG_FILE"
echo "Node: $NODE" >> "$LOG_FILE"
echo "Arch: $(uname -m)" >> "$LOG_FILE"
"$NODE" "$SERVER" >> "$LOG_FILE" 2>&1 &
NODE_PID=$!

OK=0
for i in $(seq 1 30); do
    if ! kill -0 $NODE_PID 2>/dev/null; then
        echo "Node process exited unexpectedly" >> "$LOG_FILE"
        break
    fi
    curl -s "http://localhost:3000" > /dev/null 2>&1 && OK=1 && break
    sleep 1
done

if [ $OK -eq 0 ]; then
    osascript -e "display dialog \"Tableau no pudo arrancar.\n\nRevisa el log en:\n$LOG_FILE\" buttons {\"OK\"} with icon stop with title \"Tableau\""
    exit 1
fi

open "http://localhost:3000"
