@echo off
set SRC=%~dp0
set DST=C:\Users\blasg\AppData\Local\Programs\Tableau

echo Copiando archivos a instalacion local...

copy /Y "%SRC%server.js"          "%DST%\server.js"
copy /Y "%SRC%package.json"       "%DST%\package.json"
xcopy /Y /E /I "%SRC%public"      "%DST%\public"
xcopy /Y /E /I "%SRC%scripts"     "%DST%\scripts"

echo Compilando JSX...
cd /D "%DST%"
node scripts\build.js

echo.
echo Listo. Reinicia Tableau para aplicar los cambios.
pause
