@echo off
chcp 65001 >nul
cd /d "%~dp0\.."

echo.
echo  ====================================================
echo   Tableau - Preparar instalador
echo  ====================================================
echo.

:: 1. Verificar Inno Setup
where iscc >nul 2>&1
if errorlevel 1 (
    echo  [ERROR] iscc.exe no encontrado en el PATH.
    echo.
    echo  Instala Inno Setup desde:
    echo    https://jrsoftware.org/isdl.php
    echo.
    echo  Luego agrega al PATH del sistema:
    echo    C:\Program Files ^(x86^)\Inno Setup 6
    echo.
    pause
    exit /b 1
)
echo  [OK] Inno Setup encontrado.

:: 2. Verificar Node.js
where node >nul 2>&1
if errorlevel 1 (
    echo  [ERROR] Node.js no encontrado.
    echo    https://nodejs.org
    echo.
    pause
    exit /b 1
)
echo  [OK] Node.js encontrado.

:: 3. Verificar curl
where curl >nul 2>&1
if errorlevel 1 (
    echo  [ERROR] curl no encontrado ^(viene incluido en Windows 10+^).
    pause
    exit /b 1
)
echo  [OK] curl encontrado.

:: 4. Descargar node.exe portatil
set NODE_VERSION=20.19.1
set NODE_EXE=installer\node.exe
set NODE_ZIP=installer\_node_tmp.zip
set NODE_TMP=installer\_node_tmp

if exist "%NODE_EXE%" (
    echo  [OK] node.exe ya existe, omitiendo descarga.
) else (
    echo.
    echo  Descargando Node.js %NODE_VERSION% portable ^(~35 MB^)...
    curl -L --progress-bar -o "%NODE_ZIP%" "https://nodejs.org/dist/v%NODE_VERSION%/node-v%NODE_VERSION%-win-x64.zip"
    if errorlevel 1 (
        echo  [ERROR] Descarga fallida. Comprueba la conexion a internet.
        if exist "%NODE_ZIP%" del "%NODE_ZIP%"
        pause
        exit /b 1
    )
    echo  Extrayendo node.exe...
    powershell -NoProfile -Command "Expand-Archive -Path '%NODE_ZIP%' -DestinationPath '%NODE_TMP%' -Force; Copy-Item '%NODE_TMP%\node-v%NODE_VERSION%-win-x64\node.exe' '%NODE_EXE%'"
    if exist "%NODE_TMP%" rmdir /s /q "%NODE_TMP%"
    if exist "%NODE_ZIP%" del "%NODE_ZIP%"
    if not exist "%NODE_EXE%" (
        echo  [ERROR] No se pudo extraer node.exe.
        pause
        exit /b 1
    )
    echo  [OK] node.exe listo.
)

:: 5. Instalar dependencias de produccion
echo.
echo  Instalando dependencias (npm install --omit=dev)...
echo  (puede tardar 1-3 minutos la primera vez)
if exist "node_modules" rmdir /s /q "node_modules"
call npm install --omit=dev --loglevel=error
if errorlevel 1 (
    echo  [ERROR] npm install ha fallado.
    pause
    exit /b 1
)
echo  [OK] Dependencias instaladas.

:: 6. Crear carpeta de salida
if not exist "dist" mkdir "dist"

:: 7. Compilar instalador
echo.
echo  Compilando instalador con Inno Setup...
iscc "installer\tableau.iss"
if errorlevel 1 (
    echo  [ERROR] Compilacion fallida. Revisa los mensajes de arriba.
    pause
    exit /b 1
)

echo.
echo  ====================================================
echo   Instalador generado en: dist\
echo  ====================================================
echo.
pause
