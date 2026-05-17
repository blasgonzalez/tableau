# Changelog

## [1.5.0] — 2026-05-17
### Añadido
- Voltear foto: opciones *Voltear horizontal* y *Voltear vertical* en el menú de contexto de cada foto; el volteo se combina con la rotación y se guarda con el tablero; se refleja en la vista previa del informe y el PDF
- Cuadrícula desde la librería: selecciona varias fotos y pulsa **⊞ Cuadrícula** en la barra de selección; un diálogo permite elegir columnas y separación; en tableros fijos calcula automáticamente el tamaño de celda y muestra cuántas fotos caben; en tableros variables centra la cuadrícula en la vista actual
- Guías de separación igual: al arrastrar un elemento con Snap activo, si la separación respecto a un vecino coincide con la que hay entre ese vecino y otro elemento, aparecen guías **cyan** en ambos huecos y el sistema encaja automáticamente a esa distancia; complementa las guías de alineación de bordes (naranja) y pueden coexistir

### Corregido
- Los controles de cada elemento (rotar, bloquear, eliminar) quedaban ocultos bajo la barra de menú superior cuando la foto estaba colocada en la parte alta del canvas; ahora aparecen debajo del elemento en esa situación
- Al recargar la página, la aplicación volvía siempre al primer tablero del proyecto; ahora recuerda el tablero activo y lo restaura

---

## [1.4.0] — 2026-05-16
### Añadido
- Modo presentación: botón en la barra superior que oculta toda la interfaz y muestra solo el tablero; nombre del proyecto y tablero al pasar el ratón; ESC para salir; el grid se oculta automáticamente
- Navegación entre tableros en presentación: flechas ‹ › a los lados y puntos indicadores en la esquina inferior para pasar de un tablero al siguiente sin salir del modo
- Elemento de texto: bloque tipográfico para el canvas con panel de formato (botón T▾); cuatro tipografías — Serif (Playfair Display), Sans (DM Sans), Display (Bebas Neue), Mono (IBM Plex Mono); alineación y color de texto personalizables; el nuevo elemento hereda los ajustes del último texto colocado; visible en modo presentación a diferencia de las notas internas
- Notas y textos se crean con clic derecho sobre el canvas — los botones de la barra superior se han eliminado para reducir el desorden
- Preview persistente: pasar el ratón sobre una miniatura muestra la preview flotante; hacer clic la fija en pantalla hasta cerrarla con × o ESC
- Gestión de rechazados: botón ✕ en cada miniatura para marcar o desmarcar una foto como rechazada; las fotos rechazadas se ocultan por defecto y muestran una etiqueta roja; filtro en la cabecera para ver solo rechazadas o todas
- Reemplazar foto en canvas: clic derecho → Reemplazar foto; la librería entra en modo selección y el clic en cualquier miniatura intercambia la imagen manteniendo posición, tamaño y rotación; ESC cancela

### Mejorado
- En modo presentación las notas internas y las etiquetas de foto se ocultan automáticamente
- La vista previa del tablero en el informe muestra ahora las fotos rotadas (giros de 90° y rotación libre a cualquier ángulo) y los elementos de texto en sus posiciones correctas
- Corregida la generación de PDF: ya no aparece una primera página en blanco cuando el proyecto tiene varios tableros; cada tablero empieza en página nueva
- Los botones de acción de la librería (Copiar foto →, Etiquetas #, valoración en estrellas) son legibles en todos los temas, incluido Claro · Natural

### Eliminado
- Color de fondo personalizable del tablero — causaba conflictos de visibilidad con etiquetas de foto, notas y elementos de texto

---

## [1.3.10] — 2026-05-15
### Añadido
- Etiquetado en lote: con varias fotos seleccionadas en la biblioteca, el botón **# Etiquetas** en la barra de selección abre un panel para añadir o quitar etiquetas a todas a la vez; las casillas muestran estado parcial (indeterminado) cuando solo algunas fotos tienen la etiqueta
- Puntuación en lote: al pulsar una tecla 0–5 mientras el cursor está sobre una foto seleccionada y hay más de una foto en la selección, la valoración se aplica a todas las fotos seleccionadas
- Panel de información ampliado: el panel lateral muestra ahora la valoración en estrellas, el tono dominante con muestra de color, el porcentaje de luminosidad y las etiquetas asignadas a cada foto

---

## [1.3.9] — 2026-05-15
### Añadido
- Arrastrar imágenes desde el explorador de archivos directamente a la librería para subirlas sin colocarlas en el canvas; la librería muestra un contorno mientras el archivo vuela sobre ella
- Botón ⊞/⊟ en la cabecera de la librería para alternar entre altura compacta y vista extendida (70 % de la pantalla) con un solo clic; el zoom del canvas se ajusta automáticamente

### Mejorado
- Las 5 estrellas de valoración son siempre visibles en cada miniatura: llenas y en color acento si hay valoración, vacías y tenues si no; facilita puntuar de un vistazo sin necesidad de hover

---

## [1.3.8] — 2026-05-15
### Añadido
- Menú contextual (clic derecho) en fotos y notas: Traer al frente, Marco (solo fotos), Usar como tamaño de referencia (solo fotos), Duplicar, Eliminar
- Intercambiar posición: selecciona exactamente 2 elementos y pulsa ⇄ en la barra de selección para intercambiar sus posiciones
- Tamaño de referencia: clic derecho en una foto → "Usar como tamaño de referencia" — las fotos que añadas después llegan a ese ancho; se muestra en ⚙ Config con botón Limpiar

### Mejorado
- Eliminados botones de la barra hover de fotos (↑ Traer al frente y ▣ Marco) — ahora en el menú contextual; quedan solo ↻, 🔒 y ×
- Eliminado botón ↑ de la barra hover de notas — ahora en el menú contextual

### Corregido
- La configuración del tablero (tamaño fijo, marco por defecto, color de fondo) solo se guardaba en memoria y se perdía al recargar la página — ahora se persiste correctamente en disco

---

## [1.3.7] — 2026-05-14
### Añadido
- Biblioteca redimensionable: arrastra la barra separadora entre el canvas y la biblioteca para ajustar su altura; las miniaturas se reorganizan automáticamente en cuadrícula
- Ordenar por Tono: ordena las fotos por su dominante de color media (rojo → naranja → verde → azul → morado → neutro)
- Ordenar por Luminosidad: ordena las fotos de más oscura a más clara según la luminosidad perceptual media
- Indicador de luminosidad: punto circular en cada miniatura que va de negro (foto oscura) a blanco (foto clara)
- Etiquetas (tags): botón # en cada miniatura para asignar etiquetas de texto libre; badge con el número de etiquetas activas; filtro múltiple OR en la cabecera de la biblioteca

### Mejorado
- Las miniaturas de la biblioteca se reorganizan en cuadrícula al ampliar la altura; el tamaño de miniatura y la altura de la biblioteca son independientes

---

## [1.3.6] — 2026-05-14
### Añadido
- Reordenar tableros: arrastra el asa ⠿ de cada tablero en el panel lateral para cambiar su orden
- Contador de fotos por tablero: número de fotos colocadas visible en cada fila del panel lateral
- Snap a otros elementos: al mover una foto o nota se alinea automáticamente con los bordes y centros del resto de elementos; guías visuales naranjas muestran el ajuste
- Selección múltiple en la biblioteca: Ctrl+clic alterna, Shift+clic selecciona rango; barra con acciones (añadir al tablero, eliminar)
- Arrastre de varias fotos al canvas: si hay selección múltiple en la biblioteca, arrastrar muestra una pila animada con contador

### Mejorado
- Iconos SVG estilo Photoshop para todas las herramientas de alineación y distribución
- Iconos SVG claros para exportar / importar en toda la aplicación; agrupar / desagrupar con icono propio
- Shift+clic en el canvas alterna la selección de un elemento sin desmarcar el resto; clic en un miembro de grupo selecciona todo el grupo
- Aviso al borrar una foto que ya está colocada en tableros: lista los tableros afectados
- Visibilidad mejorada en todos los temas de color: textos secundarios, contador de tableros y controles de interfaz

---

## [1.3.5] — 2026-05-14
### Añadido
- Selección lasso: arrastra sobre el canvas vacío para seleccionar varios elementos con un rectángulo de goma
- Exportar selección como JPEG: botón ⬇ en la barra de selección (también visible con 1 elemento) exporta únicamente los elementos seleccionados
- Agrupación de elementos: botón ⊓ agrupa los elementos seleccionados; al hacer clic en cualquier miembro del grupo se selecciona todo el grupo; botón ⊔ para desagrupar
- Historial de deshacer persistente por tablero: al cambiar de tablero el historial de deshacer/rehacer se conserva y se restaura al volver
- Importar carpeta: botón + Carpeta en la biblioteca importa todas las imágenes de una carpeta de golpe

### Corregido
- Selección lasso: los elementos dentro del rectángulo no quedaban seleccionados al soltar (el clic burbujeaba al contenedor raíz y borraba la selección)
- Mover grupo con imán activado: cada foto se ajustaba individualmente a la guía más próxima rompiendo las distancias; ahora el ajuste se calcula una sola vez sobre el anclaje y se aplica igual a todo el grupo

---

## [1.3.4] — 2026-05-13
### Añadido
- Copiar/pegar elementos: Ctrl+C copia la selección, Ctrl+V pega con desplazamiento de 20 px; funciona entre tableros del mismo proyecto
- Duplicar elementos: Ctrl+D duplica la selección actual en el mismo lugar (+20 px)
- Rotación libre: arrastra el punto circular que aparece sobre cada foto o nota para girarla a cualquier ángulo; Shift encaja en múltiplos de 15°; el botón ↻ sigue girando 90° exactos
- Color de fondo de notas: botón ■ en la barra de cada nota abre un selector con 6 colores (amarillo, verde, azul, rosa, morado, naranja)
- Copiar foto a otro proyecto: botón → en cada miniatura de la biblioteca abre un menú para duplicar la foto en otro proyecto sin mover la original

---

## [1.3.3] — 2026-05-13
### Añadido
- Atajos de teclado: Supr/Retroceso elimina los elementos seleccionados, Ctrl+A selecciona todo el tablero, flechas mueven la selección 1 px (Shift+flechas 10 px)
- Búsqueda por nombre en la cabecera de la biblioteca
- Slider para ajustar el tamaño de las miniaturas en la biblioteca (48–160 px, persistente)

### Mejorado
- El icono de candado ahora muestra fondo oscuro semitransparente y es visible sobre cualquier foto
- Los elementos bloqueados quedan excluidos de todas las operaciones: arrastre, alineación y distribución
- Arrastrar una selección múltiple ya no resetea la selección al soltar

### Corregido
- Ctrl+A + arrastrar: todos los elementos seleccionados se mueven correctamente

---

## [1.3.2] — 2026-05-13
### Añadido
- Filtro "Sin colocar" en la cabecera de la biblioteca: muestra solo las fotos que no están en ningún tablero del proyecto; el contador cambia a N/Total al activarlo; estado persistente entre sesiones

### Mejorado
- El botón "+ Subir foto" se ha movido a la cabecera de la biblioteca, junto al resto de controles

---

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
