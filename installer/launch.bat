@echo off
cd /d "%~dp0"

:: ── Configuración ────────────────────────────────────────────────────────────
set "NODE_EXE=%~dp0runtime\node.exe"
set "TABLEAU_DATA_DIR=%LOCALAPPDATA%\Tableau\data"
set "TABLEAU_UPDATE_URL=https://raw.githubusercontent.com/blasgonzalez/tableau/main/installer/version.json"

echo.
echo  ============================================================
echo   T A B L E A U
echo  ============================================================
echo.

:: Crear directorio de datos si no existe
if not exist "%TABLEAU_DATA_DIR%" mkdir "%TABLEAU_DATA_DIR%"

:: Detectar si ya hay un servidor corriendo en el puerto 3000
netstat -aon 2>nul | findstr ":3000 " | findstr "LISTENING" >nul 2>&1
if not errorlevel 1 (
    echo  Tableau ya esta en marcha. / Tableau is already running.
    echo.
    echo  Abriendo el navegador... / Opening browser...
    start http://localhost:3000
    echo.
    pause
    exit /b 0
)

:: Arrancar servidor
echo  Iniciando Tableau...
echo.
echo  ┌─────────────────────────────────────────┐
echo  │  http://localhost:3000                  │
echo  └─────────────────────────────────────────┘
echo.
echo  IMPORTANTE: mantén esta ventana abierta mientras usas Tableau.
echo  Si la cierras, la aplicacion se detendra.
echo.
echo  Para salir: cierra esta ventana o pulsa Ctrl+C
echo  ─────────────────────────────────────────────
echo.

timeout /t 2 /nobreak >nul
start http://localhost:3000

"%NODE_EXE%" "%~dp0server.js"

echo.
echo  Tableau detenido. / Tableau stopped.
echo  Puedes cerrar esta ventana. / You can close this window.
echo.
pause
