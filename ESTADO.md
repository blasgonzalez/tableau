# Tableau — Estado funcional v1.14 (junio 2026)

Documento de referencia para evaluar el estado de la aplicación y planificar las próximas versiones. Orientado a quien ya entiende el contexto general pero necesita una visión ordenada de qué existe, cómo funciona y dónde están los límites.

---

## Qué es Tableau

Aplicación de escritorio web (Express + React en un solo archivo HTML) para la gestión visual de proyectos fotográficos. Permite organizar fotos en tableros de composición libre, construir planos de sala en 2D y explorarlos en 3D. Se instala localmente en Windows, Mac y Linux; opcionalmente se puede desplegar en un servidor para acceso multiusuario con autenticación.

No hay base de datos: todo se guarda en JSON y JPEG en disco. No hay CDN, no hay nube, no hay dependencias externas en tiempo de ejecución.

---

## Arquitectura en una frase

`server.js` gestiona la API REST y los archivos; `public/index.html` contiene toda la aplicación React (~10 000 líneas de JSX, CSS y traducciones en un solo archivo, sin bundler). El servidor compila el JSX con Babel al arrancar, lo cachea en disco, y lo sirve como JS puro desde entonces.

---

## Modos de uso

### Modo local
Un usuario, un navegador, sin red. Los datos se guardan en `%LOCALAPPDATA%\Tableau\data` (Windows) o en `./data` si se arranca directamente con Node. El servidor se cierra automáticamente a los 90 s sin heartbeat del navegador.

### Modo servidor (TABLEAU_AUTH=true)
Permite múltiples usuarios con cuentas propias. Cada usuario tiene su espacio de datos aislado. Funciones adicionales: compartir proyectos por link, tableros privados, recuperación de contraseña por email. Es funcional pero más nuevo y con menos horas de uso real que el modo local.

---

## Inventario funcional

### Proyectos y biblioteca
- Múltiples proyectos con tableros, fotos y salas independientes.
- Exportar/importar proyectos como ZIP (incluye fotos, tableros y metadatos).
- Papelera con restauración de fotos y proyectos enteros; purga automática a los 30 días.
- La biblioteca admite secciones colapsables con drag entre ellas.
- Filtros: sin colocar, rechazadas, por etiquetas, por valoración en estrellas.
- Selección múltiple con Ctrl+clic, Shift+clic y lasso.
- Ordenación: fecha, nombre, tono dominante, luminosidad perceptual.
- Metadatos: EXIF completo (cámara, objetivo, focal, apertura, velocidad, ISO, fecha), valoración 0–5 estrellas, etiquetas de texto libre, tono dominante, luminosidad.
- Detección de duplicados al importar (omitir / añadir / reemplazar).
- Visor fullscreen por foto con EXIF completo y tableros donde aparece.
- Previsualización flotante al pasar el cursor (configurable, solo propietario).
- Copiar foto a otro proyecto.

### Canvas y tableros
- **Tableros variables**: sin tamaño fijo; el canvas crece con el contenido.
- **Tableros fijos**: tamaño real con DPI y unidades (cm, mm, in, px). Las fotos se colocan a su tamaño nativo según el DPI.
- **Tipos de elemento**: foto, texto libre, nota, zona, mosaico, placeholder.
- Arrastrar, redimensionar (con guías de snap y equidistancia), rotar (90° o libre a cualquier ángulo).
- Bloquear, agrupar, desagrupar.
- Copiar/cortar/pegar con ghost visual + rueda para escalar antes de colocar.
- Lasso de selección; Ctrl+A para selección total.
- Deshacer/rehacer hasta 50 pasos; historial preservado por tablero al cambiar de vista.
- Versiones de tablero (snapshots manuales con restauración).
- Guías de alineación (bordes y centros, naranja) y equidistancia (cyan).
- Guías de borde con indicador de centrado en tableros fijos.
- Arrastre restringido a eje con Shift.
- Exportar tablero como JPEG en tres calidades (85/92/100), hasta 16 000 px.
- Exportar selección como JPEG.
- Grid proporcional al tamaño del tablero, con snap; mínimo 3 celdas a lo largo de la dimensión corta.
- Marcos por foto (paspartú + moldura) con configuración por defecto en el tablero.
- Etiquetas de texto por foto (multilinea).
- Voltear horizontal/vertical.
- Tableros privados (modo servidor): invisibles e inaccesibles para invitados.
- Plantillas: guardar tablero como plantilla, aplicar al crear uno nuevo, editar directamente en canvas.

### Zonas
Divisores visuales del canvas que agrupan fotos, notas y textos. Al mover la zona, su contenido se mueve con ella. Se pueden superponer libremente. Seis colores. Convertir zona en tablero (crea un tablero nuevo con todo el contenido). Una foto debe estar completamente dentro de la zona para pertenecer a ella.

### Mosaicos
Crear cuadrícula desde selección múltiple con diálogo de columnas y separación. En tableros fijos calcula automáticamente el tamaño de celda. Drag entre celdas para reordenar. Foto enmarcada recortada a la celda.

### Texto y notas
- **Texto libre**: cuatro tipografías (Playfair Display, DM Sans, Bebas Neue, IBM Plex Mono), negrita, itálica, alineación, color, tamaño libre. Visible en presentación y en 3D.
- **Notas**: post-it flotantes, seis colores, soporte de enlace URL con preview tipo Padlet. Solo para uso interno: invisibles en presentación y en 3D.

### Sala (plano + 3D)
- Plano 2D en SVG: dibujar polígono de paredes, mover vértices, snap a 45°/90°.
- Cada pared tiene cara A (interior) y cara B (exterior), con tablero propio independiente.
- Bloques sólidos: 5 caras (N, S, E, O, superior) vinculables cada una a un tablero; color por cara.
- Columnas.
- Color de pared visible en el plano cuando se asigna.
- Un proyecto puede tener varias salas; los tableros de sala aparecen anidados en el panel lateral.
- **Vista 3D** (Three.js): renders de fotos y textos sobre paredes, bloques y cara superior. Marcos renderizados. Grids/mosaicos en paredes.
- Modo paseo en primera persona (flechas, captura de ratón).
- Figura de escala humana (175 cm) movible por el suelo.
- Capturar vista 3D como foto en la biblioteca del proyecto.
- Sincronización pared/tablero: aviso cuando las dimensiones físicas de la pared difieren del tablero vinculado.

### Presentación
Modo pantalla completa sin interfaz. Navegación entre tableros con flechas y puntos indicadores. Modo zona: las fotos de cada zona se muestran lado a lado a pantalla completa, navegable con ‹ ›. Solo lectura. Las notas y etiquetas se ocultan automáticamente.

### Informe / Memoria del proyecto
Previsualización de todos los tableros a escala, lista de fotos con dimensiones físicas, notas del proyecto, PDF imprimible.

### Modo servidor (funciones exclusivas)
- Gestión de usuarios (admin): crear, borrar, cuota de almacenamiento.
- Recuperación de contraseña por email (SMTP configurable).
- Compartir proyecto por link (solo lectura o edición) con invitación por correo.
- Tableros privados: los invitados no ven ni acceden a ellos.
- Bloqueo de tablero: un invitado en modo edición adquiere un lock; si otro lo intenta, ve conflicto.
- Un usuario registrado que abre un link de invitación accede como invitado (no como propietario de su propia cuenta).

### Instalación y distribución
- Windows: instalador Inno Setup con Node portable incluido, sin permisos de administrador, lanzador VBScript sin ventana de consola.
- Mac: DMG universal (Intel + Apple Silicon), script de instalación automático.
- Linux: ZIP.
- Notificación automática de actualización al arrancar.
- GitHub Actions: Mac y Linux se construyen en CI al publicar el release; solo Windows se genera localmente.

---

## Limitaciones y puntos de fricción conocidos

| Área | Situación actual |
|------|-----------------|
| Escala del proyecto | Pensado para uso personal o en equipo pequeño. El JSON en disco no escala bien con centenares de proyectos o miles de fotos. |
| Mantenibilidad del frontend | ~10 000 líneas en un solo archivo HTML sin bundler ni tests. El patrón estado+ref se repite en decenas de variables. Añadir funcionalidad es caro. |
| Colaboración en tiempo real | No existe. El sistema de locks es primitivo (quien tiene el lock edita, los demás ven el tablero como solo lectura). No hay presencia, ni resolución de conflictos, ni notificaciones. |
| Historial persistente | El historial de deshacer se pierde al cerrar el navegador. Las versiones manuales (snapshots) son el único respaldo. |
| Exportación del tablero | Solo JPEG. No hay PDF directo del canvas, ni SVG, ni exportación a formatos estándar de diseño. |
| Búsqueda | Solo por nombre de foto en la biblioteca. No hay búsqueda global de proyectos, tableros o contenido de notas. |
| Auto-shutdown | El servidor se cierra a los 90 s sin heartbeat. En modo servidor con múltiples usuarios puede apagarse si todos cierran el navegador simultáneamente. |
| Sin tests | No hay suite de pruebas automatizadas. Los cambios en una área pueden romper otra sin aviso. |
| Sala: sincronización de bloque | Cuando cambian las dimensiones físicas de una cara de bloque, no hay aviso equivalente al de las paredes. Solo las paredes tienen el botón de sincronizar. |

---

## Observaciones sobre el estado actual

La aplicación es funcionalmente rica para su edad (versión 1.14 en poco más de dos meses desde el lanzamiento inicial). El núcleo —biblioteca, canvas, exportación— es sólido y maduro. La sala 3D es una característica diferenciadora real. El modo servidor es funcional pero con menos madurez que el modo local.

El crecimiento hasta aquí ha sido principalmente en anchura (nuevas funciones). El punto de inflexión natural es empezar a profundizar en estabilidad, pulido UX y en las áreas donde los usuarios se encuentran con límites reales.

---

## Posibles líneas de actuación

### Pulido y estabilidad
- Mejorar el onboarding (primer arranque, primer proyecto, primer tablero).
- Ayuda contextual accesible desde la interfaz (tooltips ricos, atajos de teclado en un panel, documentación embebida).
- Revisar la experiencia en móvil/tablet (actualmente sin optimizar).
- Accesibilidad: navegación por teclado completa, contraste y lectores de pantalla.

### Colaboración
- Presencia en tiempo real: avatares indicando qué tablero está viendo cada invitado.
- Comentarios/anotaciones como modo de revisión (no notas del canvas, sino hilos externos).
- Historial de cambios por usuario en modo servidor.

### Biblioteca
- Búsqueda visual por similitud o color dominante.
- Agrupación automática por fecha de captura EXIF.
- Integración opcional con almacenamiento externo (carpeta local sincronizada, no nube).

### Tablero y exportación
- Exportación a PDF directamente del tablero (no solo el informe).
- Exportación a PNG (fondo transparente para fotos con marcos).
- Plantillas de sistema (predefinidas, no solo las del usuario).
- Modo impresión: ajustar tablero a hoja A3/A2 con márgenes reales.

### Sala / 3D
- Iluminación básica en la vista 3D (luz ambiental + direccional ajustable).
- Textos libres y notas renderizados en la vista 3D.
- Aviso de sincronización en caras de bloque (equivalente al de paredes).
- Exportar imagen 3D en alta resolución.

### Modo servidor / administración
- Dashboard de administración con uso de almacenamiento por usuario.
- Log de accesos y actividad.
- Límite de cuota visible para el propio usuario.
- Invitaciones con rol de edición vía correo (actualmente solo se envía vista de solo lectura por email).

### Infraestructura
- Suite de tests básica (al menos para las rutas del servidor).
- Separar el frontend en archivos al tener bundler (Vite u otro) para facilitar el mantenimiento.
- Auto-backup configurable de la carpeta de datos.
