@echo off
cd /d "%~dp0"

echo.
echo  ============================================================
echo   T A B L E A U
echo  ============================================================
echo.

:: Verificar Node.js / Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo  [ERROR] Node.js no esta instalado / Node.js is not installed
    echo.
    echo  Instalalo desde / Install it from:
    echo.
    echo    https://nodejs.org
    echo.
    echo  Tras instalarlo, vuelve a abrir este archivo.
    echo  After installing, open this file again.
    echo.
    pause
    exit /b 1
)

:: Detectar si ya hay un servidor corriendo en el puerto 3000
:: Detect if a server is already running on port 3000
netstat -aon 2>nul | findstr ":3000 " | findstr "LISTENING" >nul 2>&1
if not errorlevel 1 (
    echo  El servidor ya esta en marcha.
    echo  The server is already running.
    echo.
    echo  Abriendo el navegador... / Opening browser...
    start http://localhost:3000
    echo.
    echo  Puedes cerrar esta ventana.
    echo  You can close this window.
    echo.
    pause
    exit /b 0
)

:: Instalar dependencias en el primer arranque
:: Install dependencies on first run
if not exist "node_modules" (
    echo  Primera ejecucion: instalando dependencias...
    echo  First run: installing dependencies...
    echo  ^(puede tardar 1-3 minutos / may take 1-3 minutes^)
    echo.
    npm install --loglevel=error
    if errorlevel 1 (
        echo.
        echo  [ERROR] La instalacion ha fallado / Installation failed
        echo.
        echo  Comprueba tu conexion a internet e intentalo de nuevo.
        echo  Check your internet connection and try again.
        echo.
        pause
        exit /b 1
    )
    echo.
    echo  Instalacion completada. / Installation complete.
    echo.
)

:: Arrancar
echo  ------------------------------------------------------------
echo.
echo    Tableau esta corriendo en / Tableau is running at:
echo.
echo      http://localhost:3000
echo.
echo  ------------------------------------------------------------
echo.
echo  IMPORTANTE: mantén esta ventana abierta mientras usas
echo  Tableau. Si la cierras, la aplicacion se detendra.
echo.
echo  IMPORTANT: keep this window open while using Tableau.
echo  Closing it will stop the application.
echo.
echo  Para salir: cierra esta ventana o pulsa Ctrl+C
echo  To quit: close this window or press Ctrl+C
echo  ------------------------------------------------------------
echo.

timeout /t 2 /nobreak >nul
start http://localhost:3000

node server.js

echo.
echo  Tableau detenido. / Tableau stopped.
echo  Puedes cerrar esta ventana. / You can close this window.
echo.
pause
