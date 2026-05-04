# Tableau

Gestión visual de proyectos fotográficos. Tableros libres, biblioteca por proyecto, repositorio local de imágenes.

---

## Requisitos

- [Node.js](https://nodejs.org) versión 18 o superior
- npm (viene incluido con Node.js)

---

## Instalación

```bash
# 1. Entra en la carpeta del proyecto
cd tableau

# 2. Instala las dependencias (solo la primera vez)
npm install

# 3. Arranca el servidor
npm start
```

Abre el navegador en **http://localhost:3000**

> Para desarrollo con recarga automática: `npm run dev` (requiere nodemon, ya incluido como devDependency)

---

## Estructura de carpetas

```
tableau/
├── server.js          ← servidor Express
├── package.json
├── public/
│   └── index.html     ← aplicación web (todo en un fichero)
├── repo/              ← ★ coloca aquí tus fotos para importarlas
└── data/              ← proyectos, tableros y fotos procesadas (generado automáticamente)
    ├── projects.json
    └── {id-proyecto}/
        ├── boards.json
        ├── photos.json
        ├── photos/
        │   ├── {id}.jpg        ← foto redimensionada
        │   └── {id}_thumb.jpg  ← miniatura
        └── boards/
            └── {id}.json       ← posiciones y etiquetas del tablero
```

---

## Flujo de trabajo

### Subir fotos al proyecto
Usa el botón **+ Subir** en la biblioteca (panel inferior izquierdo). Las fotos se redimensionan automáticamente en el servidor (máx. 1800px, JPEG 87%) y se almacenan en `data/`.

### Usar el repositorio
1. Copia o mueve tus fotos a la carpeta `repo/`
2. En la biblioteca, cambia a la pestaña **Repo**
3. Pulsa el **+** sobre cualquier miniatura para importarla al proyecto activo
4. Una vez importada aparece marcada como "✓ en proyecto"

### Organizar en tableros
- Arrastra miniaturas desde la biblioteca al canvas
- O haz clic en una miniatura para colocarla en el centro
- Reposiciona arrastrando · Redimensiona desde la esquina inferior derecha
- Rota 90° con el botón ↻ · Trae al frente con ↑
- Añade etiquetas de texto bajo cada foto

### Proyectos y tableros
- Clic derecho sobre un proyecto o tablero para eliminarlo
- Cada proyecto tiene su propia biblioteca de fotos
- Los tableros son independientes entre sí

---

## Configuración

Edita las constantes al inicio de `server.js`:

```js
const PORT           = 3000;   // puerto del servidor
const MAX_UPLOAD_MB  = 80;     // límite de tamaño de subida
const RESIZE_PX      = 1800;   // dimensión máxima almacenada
const THUMB_PX       = 260;    // dimensión máxima de miniatura
const JPEG_QUALITY   = 87;     // calidad JPEG (0-100)
```

---

## Acceso en red local

Para acceder desde otro ordenador de la misma red, edita `server.js` y cambia:

```js
app.listen(PORT, () => { ... })
// por:
app.listen(PORT, '0.0.0.0', () => { ... })
```

Luego accede desde otro equipo con `http://[IP-del-servidor]:3000`

---

## Nota sobre Sharp en Windows

Sharp usa bindings nativos. Si la instalación falla en Windows, prueba:

```bash
npm install --ignore-scripts
npm rebuild sharp
```

O instala las Visual C++ Build Tools si se solicita.
