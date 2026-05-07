# Tableau

Gestión visual de proyectos fotográficos. Tableros libres, biblioteca por proyecto, repositorio local de imágenes.

---

## Descarga e instalación

### Windows

1. Descarga **`tableau-installer-1.2.0.exe`** desde [Releases](https://github.com/blasgonzalez/tableau/releases/latest)
2. Ejecuta el instalador y sigue el asistente (no requiere permisos de administrador)
3. Al finalizar, elige **Iniciar Tableau** o usa el acceso directo del Escritorio

Los datos se guardan en `%LOCALAPPDATA%\Tableau\data` y no se eliminan al desinstalar.

---

### Mac

**Requisito previo:** Node.js 18 o superior.
Si no lo tienes, descárgalo desde [nodejs.org](https://nodejs.org) o instálalo con Homebrew:
```
brew install node
```

**Instalación:**

1. Descarga **`tableau-mac-1.2.0.zip`** desde [Releases](https://github.com/blasgonzalez/tableau/releases/latest)
2. Descomprime el ZIP en la carpeta donde quieras tener la aplicación (p. ej. `~/Aplicaciones/Tableau`)
3. Abre Terminal, arrastra el archivo `install.sh` a la ventana y pulsa Enter
4. Cuando termine, aparecerá **`Tableau.command`** en el Escritorio

A partir de ese momento, haz doble clic en `Tableau.command` para abrir la aplicación.

Los datos se guardan en `~/Library/Application Support/Tableau/data`.

> **Primera vez en Mac:** si macOS bloquea el archivo, ve a Ajustes del Sistema → Privacidad y Seguridad → pulsa "Abrir de todas formas".

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

```
installer\build.bat
```

Genera en `dist/`:
- `tableau-installer-x.x.x.exe` — instalador Windows
- `tableau-mac-x.x.x.zip` — paquete Mac

Requiere [Inno Setup 6](https://jrsoftware.org/isdl.php) en el PATH.

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
