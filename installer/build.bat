@echo off
cd /d "%~dp0\.."
echo.
echo  ════════════════════════════════════════════════════
echo   Tableau — Preparar instalador
echo  ════════════════════════════════════════════════════
echo.

:: ── 1. Verificar herramientas necesarias ────────────────────────────────────
where iscc >nul 2>&1
if errorlevel 1 (
    echo  [ERROR] Inno Setup no encontrado en el PATH.
    echo.
    echo  Descarga e instala Inno Setup desde:
    echo    https://jrsoftware.org/isdl.php
    echo.
    echo  Tras instalarlo, añade su carpeta al PATH o ajusta la
    echo  variable ISCC_EXE al final de este script.
    echo.
    pause & exit /b 1
)

where node >nul 2>&1
if errorlevel 1 (
    echo  [ERROR] Node.js no encontrado. Necesitas Node.js para preparar node_modules.
    echo    https://nodejs.org
    echo.
    pause & exit /b 1
)

where curl >nul 2>&1
if errorlevel 1 (
    echo  [ERROR] curl no encontrado (viene incluido en Windows 10+).
    pause & exit /b 1
)

:: ── 2. Descargar node.exe portátil ──────────────────────────────────────────
:: Cambia NODE_VERSION si quieres otra versión LTS
set "NODE_VERSION=20.19.1"
set "NODE_ZIP=installer\node-v%NODE_VERSION%-win-x64.zip"
set "NODE_EXE=installer\node.exe"

if exist "%NODE_EXE%" (
    echo  node.exe ya existe, omitiendo descarga.
) else (
    echo  Descargando Node.js %NODE_VERSION% portátil...
    curl -L -o "%NODE_ZIP%" "https://nodejs.org/dist/v%NODE_VERSION%/node-v%NODE_VERSION%-win-x64.zip"
    if errorlevel 1 (
        echo  [ERROR] Descarga fallida. Comprueba la conexión a internet.
        pause & exit /b 1
    )
    echo  Extrayendo node.exe...
    powershell -NoProfile -Command ^
      "Expand-Archive -Path '%NODE_ZIP%' -DestinationPath 'installer\_node_tmp' -Force; " ^
      "Copy-Item 'installer\_node_tmp\node-v%NODE_VERSION%-win-x64\node.exe' 'installer\node.exe'; " ^
      "Remove-Item 'installer\_node_tmp' -Recurse -Force"
    del "%NODE_ZIP%" 2>nul
    if not exist "%NODE_EXE%" (
        echo  [ERROR] No se pudo extraer node.exe.
        pause & exit /b 1
    )
    echo  node.exe listo.
)

:: ── 3. Instalar dependencias de producción ──────────────────────────────────
echo.
echo  Instalando dependencias (npm install --omit=dev)...
if exist "node_modules" rmdir /s /q "node_modules"
call npm install --omit=dev --loglevel=error
if errorlevel 1 (
    echo  [ERROR] npm install ha fallado.
    pause & exit /b 1
)
echo  Dependencias instaladas.

:: ── 4. Crear carpeta de salida ──────────────────────────────────────────────
if not exist "dist" mkdir "dist"

:: ── 5. Compilar instalador ──────────────────────────────────────────────────
echo.
echo  Compilando instalador con Inno Setup...
iscc "installer\tableau.iss"
if errorlevel 1 (
    echo  [ERROR] La compilación ha fallado. Revisa los errores de Inno Setup.
    pause & exit /b 1
)

echo.
echo  ════════════════════════════════════════════════════
echo   Instalador generado en:  dist\
echo  ════════════════════════════════════════════════════
echo.
pause
