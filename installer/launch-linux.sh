#!/bin/bash
DIR="$( cd "$( dirname "$0" )" && pwd )"
export TABLEAU_DATA_DIR="$HOME/.local/share/Tableau/data"
export TABLEAU_UPDATE_URL="https://raw.githubusercontent.com/blasgonzalez/tableau/main/installer/version.json"
mkdir -p "$TABLEAU_DATA_DIR"
(sleep 2 && xdg-open "http://localhost:3000") &
node "$DIR/server.js"
