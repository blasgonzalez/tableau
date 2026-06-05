# Tableau

Gestión visual de proyectos fotográficos. Tableros libres, biblioteca por proyecto, repositorio local de imágenes.

---

## Descarga e instalación

### Windows

1. Descarga **`tableau-installer-x.x.x.exe`** desde [Releases](https://github.com/blasgonzalez/tableau/releases/latest)
2. Ejecuta el instalador y sigue el asistente (no requiere permisos de administrador)
3. Al finalizar, elige **Iniciar Tableau** o usa el acceso directo del Escritorio

Al abrirse, Tableau lanza el servidor en segundo plano (sin ventana) y abre el navegador automáticamente.

Los datos se guardan en `%LOCALAPPDATA%\Tableau\data` y no se eliminan al desinstalar.

---

### Mac

No requiere instalar nada más. Node.js va incluido en el paquete. El mismo archivo funciona en Apple Silicon e Intel.

**Instalación:**

1. Descarga **`tableau-mac-x.x.x.dmg`** desde [Releases](https://github.com/blasgonzalez/tableau/releases/latest) y ábrelo
2. Haz **clic derecho** sobre **"Instalar Tableau"** → **Abrir**
3. En el diálogo de seguridad, confirma que quieres abrirlo
4. Un terminal se abre brevemente, copia la app a Aplicaciones y la lanza automáticamente

A partir de ese momento el doble clic normal ya funciona.

Al abrirse, Tableau lanza el servidor en segundo plano y abre el navegador automáticamente.

Los datos se guardan en `~/Library/Application Support/Tableau/data` y no se eliminan al borrar la app.

> **Instalación manual alternativa:** arrastra Tableau a la carpeta Aplicaciones. La primera vez, abre Finder → Aplicaciones, haz **clic derecho** sobre Tableau → **Abrir** → **Abrir**. Si el icono aparece en gris o el navegador no conecta, ejecuta en Terminal: `open ~/Library/Logs/Tableau/tableau.log` para ver el error.

---

### Linux

**Requisito previo:** Node.js 18 o superior y npm.
```
# Ubuntu / Linux Mint
sudo apt install nodejs npm
```

**Instalación:**

1. Descarga **`tableau-linux-x.x.x.zip`** desde [Releases](https://github.com/blasgonzalez/tableau/releases/latest)
2. Descomprime el ZIP desde la Terminal (el gestor de archivos gráfico puede no descomprimir correctamente):
   ```
   unzip tableau-linux-1.2.0.zip -d ~/Aplicaciones/Tableau
   ```
3. Da permisos de ejecución al script de instalación:
   ```
   chmod +x ~/Aplicaciones/Tableau/install.sh
   ```
4. Ejecuta la instalación:
   ```
   bash ~/Aplicaciones/Tableau/install.sh
   ```
5. Cuando termine, aparecerá un acceso directo **Tableau** en el Escritorio

A partir de ese momento, haz doble clic en el icono **Tableau** del Escritorio para abrir la aplicación.

Los datos se guardan en `~/.local/share/Tableau/data`.

> **Si el icono del Escritorio no responde:** haz clic derecho sobre él y elige "Permitir ejecutar" o "Allow Launching".

---

## Uso

### Subir fotos al proyecto
Usa el botón **+ Subir** en la biblioteca (panel inferior izquierdo). Las fotos se redimensionan automáticamente (máx. 1800 px, JPEG 87 %) y se almacenan en la carpeta de datos.

### Repositorio local
1. Copia tus fotos a la carpeta `repo/` dentro del directorio de la aplicación
2. En la biblioteca, cambia a la pestaña **Repo**
3. Pulsa **+** sobre una miniatura para importarla al proyecto activo

### Tableros
- Arrastra miniaturas desde la biblioteca al canvas
- Reposiciona arrastrando · Redimensiona desde la esquina inferior derecha
- Rota 90° con ↻ · Trae al frente con ↑
- Añade **notas flotantes** con el botón **+ Nota** (texto libre, soporte de enlaces)
- Activa el **snap a cuadrícula** con el botón ⊕ para alinear elementos
- Exporta el tablero como JPEG con el botón de descarga

### Proyectos y tableros
- Clic derecho sobre un proyecto o tablero para eliminarlo
- Cada proyecto tiene su propia biblioteca de fotos independiente

---

## Actualizaciones

La aplicación avisa automáticamente cuando hay una versión nueva disponible. Descarga el instalador desde el enlace que aparece en el aviso y vuelve a ejecutarlo (en Windows reemplaza la instalación anterior; en Mac repite el proceso de instalación).

---

## Instalación para desarrolladores

```bash
git clone https://github.com/blasgonzalez/tableau
cd tableau
npm install
npm start
```

Abre el navegador en **http://localhost:3000**

Para desarrollo con recarga automática: `npm run dev`

### Generar instaladores

**Windows** (local):
```
installer\build.bat
```
Genera `dist/tableau-installer-x.x.x.exe`. Requiere [Inno Setup 6](https://jrsoftware.org/isdl.php) en el PATH.

**Mac y Linux** (automático vía GitHub Actions):
Al publicar un release en GitHub, el workflow `.github/workflows/release.yml` genera y sube automáticamente:
- `tableau-mac-x.x.x.dmg` — Universal (Apple Silicon + Intel, fat binary via lipo)
- `tableau-linux-x.x.x.zip` — Linux x64

Para regenerar manualmente: GitHub → Actions → **Build Mac & Linux** → Run workflow → introducir el tag.

### Estructura de carpetas

```
tableau/
├── server.js
├── package.json
├── public/
│   └── index.html
├── installer/
│   ├── tableau.iss       ← script Inno Setup
│   ├── build.bat         ← genera ambos instaladores
│   ├── launch.bat        ← lanzador Windows (empaquetado)
│   ├── launch.command    ← lanzador Mac (empaquetado)
│   ├── install.sh        ← instalador Mac
│   └── version.json      ← versión actual (leída por la app)
└── data/                 ← generado automáticamente
```

### Configuración del servidor

Edita las constantes al inicio de `server.js`:

```js
const PORT          = 3000;  // puerto
const MAX_UPLOAD_MB = 80;    // límite de subida
const RESIZE_PX     = 1800;  // dimensión máxima almacenada
const THUMB_PX      = 260;   // dimensión de miniaturas
const JPEG_QUALITY  = 87;    // calidad JPEG (0-100)
```

### Acceso en red local

Cambia en `server.js`:
```js
app.listen(PORT, '0.0.0.0', () => { ... })
```
y accede desde otro equipo con `http://[IP-del-servidor]:3000`.
