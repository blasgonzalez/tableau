# Changelog

## [1.3.1] — 2026-05-12
### Añadido
- Etiquetas de foto multilinea: clic en la etiqueta abre una ventana emergente con área de texto; × descarta los cambios, Guardar los confirma; la ventana recuerda su tamaño por foto
- Notas en la memoria del proyecto: título y texto de las notas marcadas con 📄 aparecen en el informe de pantalla y en el PDF imprimible
- Enlaces de notas en la memoria: si una nota tiene enlace asignado, aparece como hipervínculo clicable en el informe (y en el PDF)
- Título del informe de memoria muestra el nombre del proyecto y la fecha

### Mejorado
- Las notas no muestran la etiqueta de dimensiones al redimensionar
- El informe de memoria abre el PDF con el nombre del proyecto como título de la ventana/pestaña

### Corregido
- El servidor ya no se apaga solo cuando la pestaña lleva tiempo en segundo plano: el timeout sube a 5 minutos y se envía un heartbeat inmediato al volver a la pestaña

---

## [1.3.0] — 2026-05-12
### Añadido
- Bloqueo de elementos: botón 🔒 en cada foto y nota para impedir que se muevan o redimensionen accidentalmente; el elemento bloqueado muestra un candado en la esquina y permite seguir editando etiqueta, marco y texto
- Biblioteca colapsable: cabecera permanente con botón ▼/▲, título y contador; colapsar libera el canvas a pantalla completa; estado persistente entre sesiones
- Ordenación de fotos en la biblioteca: por fecha de importación (orden por defecto) o por nombre A→Z; selector con icono ⇅ en la cabecera de la biblioteca

### Mejorado
- La etiqueta de texto de cada foto se muestra debajo del marco con fondo sólido y texto siempre legible a cualquier zoom
- Los controles de zoom se desplazan con la biblioteca al colapsar/expandir

### Corregido
- Con marco activado, la etiqueta y los controles de foto son siempre accesibles (z-index y posición corregidos)
- El valor del marco se guarda correctamente al editar el campo numérico
- Los marcos se ven en la previsualización de la memoria del proyecto

---

## [1.2.12] — 2026-05-12
### Mejorado
- La etiqueta de texto de cada foto se muestra ahora debajo del marco (posición absoluta), fuera de la foto y del marco, con fondo sólido y texto siempre legible
- El tamaño del texto de la etiqueta se compensa con el zoom del canvas: siempre aparece con el mismo tamaño en pantalla independientemente del nivel de zoom

---

## [1.2.11] — 2026-05-12
### Corregido
- Con marco activado, la etiqueta de texto de la foto ya es accesible: la barra de controles tiene z-index superior al panel de propiedades del marco
- El marco se actualiza correctamente al escribir en el campo numérico (el valor se propagaba al estado pero no al ref, perdiéndose al guardar)
- Los marcos se ven en la previsualización de tablero de la memoria del proyecto: fondo claro y contorno gris por foto

---

## [1.2.10] — 2026-05-11
### Mejorado
- El panel de configuración de marco se counter-escala y se mantiene legible a cualquier nivel de zoom
- Los botones de control de cada foto (z-index elevado) siempre se muestran por encima del marco y del panel de propiedades, sin quedar ocultos

---

## [1.2.9] — 2026-05-11
### Añadido
- Previsualización del tablero en la memoria del proyecto: miniatura a escala con las fotos en su posición, tanto en el panel en pantalla como en el informe imprimible
- Las dimensiones del tablero aparecen bajo la previsualización en la unidad configurada (cm, mm, in, px); para tableros libres se calcula el área efectiva del contenido

### Corregido
- Pantalla negra al abrir la memoria cuando alguna foto tenía marco definido
- El script de arranque dev (tableau.bat) mostraba caracteres incorrectos y fallaba al arrancar por un bug de Windows con chcp 65001

---

## [1.2.8] — 2026-05-11
### Mejorado
- Los controles de cada foto (botones, etiqueta de dimensiones, manejador de redimensión) mantienen su tamaño legible a cualquier nivel de zoom, en lugar de encogerse con el canvas
- Favicon en la pestaña del navegador usando el mismo icono de la aplicación

### Corregido
- Al arrancar en Windows, el navegador ya no abre la página antes de que el servidor esté listo; ahora espera a que el servidor responda antes de abrir

---

## [1.2.7] — 2026-05-10
### Añadido
- Marco por foto: botón ▣ en los controles de cada imagen abre un panel donde se define el grosor del marco en la unidad configurada del tablero
- Marco por defecto configurable en ⚙ Config del tablero (se aplica a las fotos nuevas al colocarlas)
- Las dimensiones muestran el tamaño total (foto + marco) con nota aclaratoria en el informe de memoria
- Zoom persistente por tablero: el nivel de zoom se guarda en localStorage y se restaura al reiniciar la aplicación
- Ajuste automático al ancho para tableros variables: al abrir un tablero por primera vez encuadra el contenido en el ancho de la ventana
- Botón ⇔ en los controles de zoom para ajustar al ancho en cualquier momento (también Ctrl+0)

### Corregido
- La importación de proyectos ZIP mostraba pantalla negra al abrir el diálogo de confirmación
- Los mensajes de error en la importación ahora muestran la causa exacta del problema

---

## [1.2.6] — 2026-05-10
### Añadido
- Exportar proyecto como ZIP: botón ↓ en cada proyecto del panel lateral descarga un archivo con todas las fotos y tableros
- Importar proyecto desde ZIP: botón ⬆ en el panel lateral; si el proyecto ya existe en esta instalación ofrece importar como copia nueva o reemplazar el existente

---

## [1.2.5] — 2026-05-10
### Añadido
- Miniaturas de imagen en el informe de memoria: aparecen junto a cada foto tanto en el panel en pantalla como en el informe imprimible

---

## [1.2.4] — 2026-05-10
### Añadido
- Dimensiones físicas al redimensionar: tooltip flotante muestra el tamaño en la unidad configurada (cm, mm, in…) mientras se arrastra el borde; si no hay escala configurada muestra píxeles
- El informe de memoria muestra las dimensiones en la unidad configurada en lugar de píxeles

### Mejorado
- El nivel de zoom se recuerda por tablero: al volver a un tablero se restaura el zoom que tenía en lugar de aplicar el auto-encuadre

---

## [1.2.3] — 2026-05-09
### Añadido
- Duplicar tableros: botón ⧉ en el panel lateral crea una copia exacta del tablero con todos sus elementos

---

## [1.2.2] — 2026-05-08
### Añadido
- El servidor se cierra automáticamente al cerrar la aplicación en el navegador
- Icono propio en los accesos directos de Windows y Linux

---

## [1.2.1] — 2026-05-08
### Añadido
- Historial de cambios en el canvas: Ctrl+Z (deshacer) y Ctrl+Shift+Z / Ctrl+Y (rehacer)
- Hasta 50 pasos por tablero; el historial se reinicia al cambiar de tablero

---

## [1.2.0] — 2026-05-06
### Añadido
- Notas flotantes de texto libre en el canvas (botón + Nota en la barra superior)
- Las notas son redimensionables y se mueven como las fotos
- Soporte de enlaces en notas: previsualización estilo Padlet con título, dominio y favicon
- Instalador para Mac (tableau-mac-x.x.x.zip) con script de instalación automático
- Instalador para Linux (tableau-linux-x.x.x.zip)

### Mejorado
- Snap a cuadrícula (botón Imán): las fotos y notas se alinean automáticamente al mover
- Los desplegables de tamaño de cuadrícula ahora son legibles en todos los modos de color

---

## [1.1.0] — 2026-05-05
### Añadido
- Instalador Windows con Inno Setup (no requiere permisos de administrador)
- Node.js portable incluido en el instalador (sin dependencias externas en Windows)
- Notificación automática de actualización disponible al arrancar la app
- Acceso directo en el Escritorio y en el menú Inicio

---

## [1.0.0] — 2026-04-01
### Lanzamiento inicial
- Gestión visual de proyectos fotográficos con tableros de composición libres
- Biblioteca de fotos por proyecto con importación desde repositorio local
- Redimensión, rotación y etiquetas de texto por foto
- Herramientas de alineación y distribución para selección múltiple
- Zoom con Ctrl+rueda y controles de porcentaje
- Exportación del tablero como JPEG
- Informe de memoria del proyecto (imprimible)
- Cuatro temas de color (Oscuro Ámbar, Claro Natural, Oscuro Frío, Alto Contraste)
- Soporte de idiomas: español e inglés
- Almacenamiento local (sin nube, sin cuenta)
