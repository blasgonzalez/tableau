# Tableau — Estado funcional v1.23 (junio 2026)

Documento de referencia para evaluar el estado de la aplicación y planificar las próximas versiones. Orientado a quien ya entiende el contexto general pero necesita una visión ordenada de qué existe, cómo funciona y dónde están los límites.

---

## Qué es Tableau

Aplicación de escritorio web (Express + React en un solo archivo HTML) para la gestión visual de proyectos fotográficos. La idea central es ser la versión digital de la mesa o pared de edición: el espacio donde el fotógrafo extiende sus imágenes, las organiza, las compara y decide cómo van a verse, antes de una exposición, publicación o entrega.

Se instala localmente en Windows, Mac y Linux; opcionalmente se despliega en un servidor para acceso multiusuario con autenticación. Todo funciona sin nube, sin cuenta obligatoria, sin suscripción.

No hay base de datos: todo se guarda en JSON y JPEG en disco. No hay CDN ni dependencias externas en tiempo de ejecución.

---

## Arquitectura en una frase

`server.js` gestiona la API REST y los archivos; `public/index.html` contiene toda la aplicación React (~12 000 líneas de JSX, CSS y traducciones en un solo archivo, sin bundler). El servidor precompila el JSX con Babel, lo cachea en disco (`_built.html`) y lo sirve como JS puro desde entonces.

---

## Modos de uso

### Modo local
Un usuario, un navegador, sin red. Los datos se guardan en `%LOCALAPPDATA%\Tableau\data` (Windows), `~/Library/Application Support/Tableau/data` (Mac) o `~/.local/share/Tableau/data` (Linux). El servidor se cierra automáticamente a los 5 min sin heartbeat del navegador.

### Modo servidor (TABLEAU_AUTH=true)
Permite múltiples usuarios con cuentas propias y espacios de datos aislados. Funciones adicionales: compartir proyectos y salas por link, tableros privados, recuperación de contraseña por email, sistema de comentarios con moderación. Funcional pero con menos horas de uso real que el modo local.

---

## Inventario funcional

### Proyectos y biblioteca
- Múltiples proyectos con tableros, fotos y salas independientes.
- Exportar/importar proyectos como ZIP (incluye fotos, tableros, secciones y metadatos). Fix: zonas y grids conservan sus fotos al importar.
- Papelera con restauración de fotos y proyectos enteros; purga automática a los 30 días.
- Auto-backup configurable (intervalo, directorio, número de copias a retener).
- La biblioteca admite secciones colapsables con drag entre ellas; vista plana o agrupada por sección.
- **Filtros:** sin colocar (ámbito: en el proyecto / en esta sala / en este tablero), rechazadas, por orientación (horizontal/vertical/cuadrado), por etiquetas, por valoración en estrellas.
- Selección múltiple con Ctrl+clic, Shift+clic y lasso.
- Ordenación: fecha, nombre A→Z, tono dominante, luminosidad perceptual.
- Metadatos: EXIF completo (cámara, objetivo, focal, apertura, velocidad, ISO, fecha), valoración 0–5 estrellas, etiquetas de texto libre, tono dominante, luminosidad.
- Detección de duplicados al importar (omitir / añadir / reemplazar).
- Visor fullscreen por foto con EXIF completo, tableros donde aparece (con contexto de sala y cara de pared).
- Previsualización flotante al pasar el cursor (configurable, solo propietario).
- Copiar foto a otro proyecto.
- Búsqueda global Ctrl+K: proyectos, tableros, salas, notas, textos, fotos, etiquetas.
- Panel de información con contexto de sala: indica en qué pared/cara/bloque está colocada cada foto.

### Canvas y tableros
- **Tableros variables**: sin tamaño fijo; el canvas crece con el contenido. Primera foto no se pega al borde izquierdo.
- **Tableros fijos**: tamaño real con DPI y unidades (cm, mm, in, px). Las fotos se colocan a su tamaño nativo según el DPI.
- **Tipos de elemento**: foto, texto libre, nota, zona, mosaico (grid), placeholder.
- Arrastrar, redimensionar (con guías de snap y equidistancia), rotar (90° o libre a cualquier ángulo con Shift en pasos de 15°).
- Bloquear, agrupar, desagrupar.
- Copiar/cortar/pegar con ghost visual + rueda para escalar antes de colocar. El portapapeles persiste al cambiar de tablero.
- Lasso de selección; Ctrl+A para selección total.
- Deshacer/rehacer hasta 50 pasos; historial preservado por tablero al cambiar de vista.
- Versiones de tablero (snapshots manuales con restauración y previsualización).
- Guías de alineación (bordes y centros, naranja) y equidistancia (cyan).
- Guías de borde con indicador de centrado en tableros fijos. Snap al centro del tablero.
- Arrastre restringido a eje con Shift.
- Exportar tablero como JPEG (tres calidades: 85/92/100, hasta 16 000 px) o PNG con fondo transparente.
- Exportar selección como JPEG.
- Grid (mosaico) desde selección múltiple; drag entre celdas para reordenar.
- Marcos por foto (paspartú + moldura) con configuración por defecto en el tablero.
- Etiquetas de texto por foto (multilinea).
- Voltear horizontal/vertical.
- Tableros privados (modo servidor): invisibles e inaccesibles para invitados.
- Plantillas: guardar tablero como plantilla, aplicar al crear uno nuevo, editar directamente en canvas.
- **Propiedades numéricas**: clic derecho → Propiedades → editar X, Y, W, H, Rot con las unidades del tablero. Útil para igualar tamaños entre tableros distintos.
- Barra de scroll más ancha y visible.
- Reajuste automático del canvas (normalización) con compensación de scroll para evitar saltos visuales.

### Zonas
Divisores visuales del canvas que agrupan fotos, notas y textos. Al mover la zona, su contenido se mueve con ella. Se pueden superponer libremente. Seis colores. Convertir zona en tablero. Una foto debe estar completamente dentro de la zona para pertenecer a ella. Segundo clic sobre foto dentro de zona la selecciona directamente (estilo Figma). Redimensionado con escala de contenido opcional.

### Texto y notas
- **Texto libre**: 7 tipografías (Playfair Display, DM Sans, Bebas Neue, IBM Plex Mono, Cormorant Garamond, Inter, Josefin Sans), negrita, itálica, alineación, color, tamaño libre. Toolbar contextual en la barra superior al editar. Visible en presentación y en 3D.
- **Notas**: post-it flotantes, seis colores, soporte de enlace URL con previsualización. Solo uso interno: invisibles en presentación y en 3D.

### Sala (plano + 3D)
- Plano 2D en SVG: dibujar polígono de paredes, mover vértices, snap a 45°/90°.
- Cada pared tiene cara A (interior) y cara B (exterior), con tablero propio independiente. Color de pared visible en el plano.
- Bloques sólidos: 5 caras (N, S, E, O, superior) vinculables cada una a un tablero independiente; color por cara.
- Columnas.
- Un proyecto puede tener varias salas; duplicar sala; gestión desde el panel lateral.
- Sincronización pared/tablero y cara de bloque/tablero: aviso cuando las dimensiones difieren.
- **Vista 3D** (Three.js):
  - Renders de fotos, textos y grids sobre paredes, bloques y cara superior. Marcos renderizados.
  - Iluminación volumétrica permanente (luz cálida + relleno frío).
  - Transiciones suaves de cámara con easing cuadrático (centrar, clic en pared en walk mode, volver al 3D desde edición).
  - HUD de etiqueta al hacer hover sobre una obra con etiqueta asignada.
  - Límite de órbita: la cámara no puede bajar del nivel del suelo.
  - Modo paseo en primera persona (WASD / flechas, captura de ratón). Snap suave a perpendicular al hacer clic en pared.
  - Figura de escala humana (175 cm, tipo maniquí) movible por el suelo.
  - Capturar vista 3D como foto en la biblioteca.
  - Copiar/cortar desde el 3D y pegar en cualquier tablero. Menú contextual en paredes para crear/navegar tableros.
  - **Vista de obra** (M1): clic o doble clic en foto/texto/zona/grid → vista fullscreen con fondo de color de pared.
    - Navegación ← → entre todos los elementos de la sala, ordenados por posición X dentro de cada tablero y por el orden de tableros del panel lateral.
    - Loop circular. Teclado y ratón funcionan igual.
    - Zonas: vista del conjunto con todos los miembros a escala; drilldown a elementos individuales.
    - Grids: vista del mosaico completo; drilldown a celdas individuales.
    - Textos: renderizados con su tipografía y color exactos sobre el fondo de pared.
    - Marcos y paspartú visibles en la vista de obra.
    - Panel de información: etiqueta, dimensiones físicas, comentarios públicos.
    - Owner: dimensiones técnicas y botón "Editar en tablero".
    - Paridad total owner/visitante en la experiencia de visita.
    - Al salir, la cámara 3D vuelve exactamente a la posición donde estaba.
  - Responsive móvil (M4): canvas a pantalla completa, pinch-to-zoom, botones táctiles (44px mínimo).

### Comentarios y anotaciones (modo servidor)
- Añadir comentarios a cualquier entidad: proyecto, tablero, sala, foto, zona, texto, grid.
- Privados por defecto; marcables como públicos y como "incluir en memoria".
- Visitantes pueden comentar si el autor lo habilita al compartir.
- Moderación de comentarios de visitantes (aprobar/rechazar).
- Integración en la memoria del proyecto.

### Compartir (modo servidor)
- Compartir proyecto por link (solo lectura): el visitante navega todos los tableros no privados.
- Compartir sala por link (?room=TOKEN): abre directamente la vista 3D limpia sin interfaz de edición.
- Permitir comentarios de visitantes por proyecto o por sala.
- Invitaciones activas unificadas (proyectos y salas) con opción de revocar.

### Presentación
Modo pantalla completa sin interfaz. Navegación entre tableros con flechas. Modo zona: fotos de cada zona recompuestas en pantalla completa, navegable con ‹ ›. Intercambio de fotos en tiempo real. Las notas y etiquetas se ocultan automáticamente.

### Informe / Memoria del proyecto
Previsualización de todos los tableros a escala, lista de fotos con dimensiones físicas (incluido marco), valoración, etiquetas, notas del proyecto y comentarios marcados como "incluir en memoria". PDF imprimible.

### Modal de Ajustes
- **General**: tema, idioma, preferencias de biblioteca, reiniciar guías de inicio.
- **Proyecto**: nombre, notas, valores por defecto para tableros nuevos (unidades, DPI, marco, formato de exportación).
- **Cuenta** (modo servidor): uso de almacenamiento, cambiar contraseña, administración, cerrar sesión.

### Temas
Le Gras (grises neutros puros), Arles (claro natural), Düsseldorf (claro frío), Wetzlar (oscuro, rojo Leica), Tokyo (oscuro frío), Rochester (alto contraste).

### Onboarding y ayuda
- Tres momentos contextuales de onboarding sin wizard bloqueante.
- Panel de atajos de teclado (F1).
- Tooltips unificados (sistema JS con div #tt position:fixed — sin layout shifts).

### Tests y estabilidad
- Suite de tests de servidor: 83 tests (local, auth, share, trash, comments).
- Auto-backup configurable (ZIP de DATA_DIR con rotación).

### Instalación y distribución
- Windows: instalador Inno Setup con Node portable incluido, sin permisos de administrador.
- Mac: DMG universal (Intel + Apple Silicon).
- Linux: ZIP.
- Notificación automática de actualización al arrancar.
- GitHub Actions: Mac y Linux se construyen en CI; solo Windows se genera localmente.

---

## Limitaciones y puntos de fricción conocidos

| Área | Situación actual |
|------|-----------------|
| Arrastrar tablero a pared | No implementado. Hay que crear el tablero desde el panel de sala. Es la petición más frecuente de usuarios. |
| Zoom desplaza el canvas | El reajuste automático de coordenadas (normalización) compensa el scroll pero puede percibirse en casos extremos. |
| Reglas y guías arrastrables | No existen guías manuales tipo Indesign/Photoshop. Solo guías automáticas de snap. |
| Exportación del canvas | Solo JPEG y PNG. No hay PDF directo del canvas ni exportación a formatos de diseño. |
| Texto en 3D con fuente incorrecta | Bug de timing conocido: si el renderer 3D crea la textura antes de que la fuente esté cargada, usa la fuente de fallback. Se resuelve recargando. |
| Mantenibilidad del frontend | ~12 000 líneas en un solo archivo HTML sin bundler. Añadir funcionalidad es caro en tiempo y riesgo de regresiones. |
| Colaboración en tiempo real | No existe. Los locks son primitivos. No hay presencia ni resolución de conflictos. |
| Historial persistente | El historial de deshacer se pierde al cerrar el navegador. Las versiones manuales son el único respaldo. |
| Escala | Pensado para uso personal o equipo pequeño. JSON en disco no escala bien con miles de fotos. |

---

## Observaciones sobre el estado actual

Tableau ha crecido significativamente desde v1.14. El núcleo (biblioteca, canvas, exportación) es sólido. La sala 3D con vista de obra es el diferenciador más potente del producto y está a la altura de herramientas como Artsteps en la experiencia de visita.

El crecimiento ha sido principalmente en anchura (nuevas funciones). El momento natural ahora es profundizar en estabilidad, pulido UX y en las áreas donde los usuarios reales se encuentran con límites concretos.

---

## Líneas de actuación prioritarias

### Corto plazo (alto valor, esfuerzo contenido)
- **Arrastrar tablero a pared** — la petición más frecuente; elimina el paso extra de crear tablero desde el plano.
- **Guía de usuario actualizada** — ya generada, pendiente de publicar en WordPress.
- **Actualizar este ESTADO.md** — ya hecho con esta versión.

### Medio plazo
- **Spots de iluminación posicionables** — diferenciador real para exposiciones; luz direccional desde puntos del techo.
- **Exportación PDF del canvas** — demandada por usuarios para entrega a clientes.
- **Reglas y guías manuales** — arrastrables desde los bordes del tablero, tipo Indesign.
- **Informe de montaje** — evolución de la memoria: lista de obras por pared con dimensiones reales, para coordinación con galerías.

### Largo plazo / estratégico
- **Presencia en tiempo real** — avatares de visitantes activos en la sala compartida.
- **Migración a bundler (Vite)** — para mantenibilidad del frontend a largo plazo.
- **Agrupación automática por fecha EXIF** — para proyectos con mucho volumen de fotos.
