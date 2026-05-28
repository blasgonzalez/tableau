# Tableau — Guía de uso

Tableau es una aplicación local para la gestión visual de proyectos fotográficos. Todos los datos se guardan en tu ordenador — sin nube, sin cuenta.

---

## Primeros pasos

Al abrir la app verás tres zonas:

- **Panel izquierdo** — árbol de proyectos, salas y tableros
- **Canvas** — el área de trabajo principal
- **Librería** — la biblioteca de fotos del proyecto activo (franja inferior, plegable)

Empieza creando un proyecto en el panel izquierdo.

---

## Proyectos

Los proyectos son contenedores independientes. Cada uno tiene su propia librería de fotos, sus propios tableros y sus propias salas.

| Acción | Cómo |
|---|---|
| Crear un proyecto | Clic en **+** en la cabecera *Proyectos y tableros* |
| Renombrar | Pasa el ratón sobre el nombre → icono de lápiz |
| Eliminar | Pasa el ratón sobre el nombre → **×** (elimina todas las fotos, tableros y salas) |
| Exportar como ZIP | Pasa el ratón sobre el nombre → **↓** |
| Importar desde ZIP | Clic en **⬆ Importar** en la cabecera del panel |

Al importar un ZIP, si ya existe un proyecto con el mismo nombre puedes elegir importarlo como copia nueva o reemplazar el existente.

---

## Tableros

Cada proyecto puede tener varios tableros. Un tablero es un canvas libre donde colocas fotos, notas y textos.

| Acción | Cómo |
|---|---|
| Crear un tablero | Clic en **+ Nuevo tablero** dentro de un proyecto |
| Renombrar | Pasa el ratón sobre el nombre → icono de lápiz |
| Duplicar | Pasa el ratón sobre el nombre → botón **⧉** |
| Eliminar | Pasa el ratón sobre el nombre → botón **×** |
| Reordenar | Arrastra el asa **⠿** de cada fila para cambiar el orden |

Cada fila de tablero muestra un contador con el número de fotos que tiene colocadas. Los tableros vinculados a paredes o bloques aparecen anidados bajo su sala.

### Configuración del tablero (⚙ Config)

Abre **⚙ Config** en la barra superior para configurar el tablero activo:

- **Unidades** — px, cm, mm o pulgadas
- **DPI** — 72 (pantalla), 96 (web), 150 (borrador), 300 (imprenta), 600 (alta calidad)
- **Modo** — *Variable* (canvas ilimitado) o *Fijo* (dimensiones exactas)
- **Marco por defecto** — grosor de paspartú que se aplica automáticamente a las fotos nuevas
- **Borde exterior al exportar** — espacio en blanco alrededor del contenido en el JPEG exportado (solo tableros variables)

Configurar DPI y unidades activa las dimensiones físicas en las fotos y en el informe.

### Plantillas de tablero

Guarda el diseño actual como plantilla con **⚙ Config → Guardar como plantilla**. Al crear un tablero nuevo aparece un selector para empezar desde una plantilla o en blanco. Las plantillas se gestionan (borrar) desde ese mismo selector.

### Versiones de tablero

El botón **⏱** en la barra superior guarda un snapshot del estado completo del tablero en ese momento. La lista muestra cada versión con fecha, hora y número de elementos. Haz clic en **Restaurar** para volver a ese estado; la versión actual no se pierde hasta que confirmas. Haz clic en **×** para eliminar una versión concreta.

---

## Librería de fotos

La franja inferior muestra todas las fotos subidas al proyecto activo.

### Subir fotos

Haz clic en **↑ Subir** en la cabecera de la librería para seleccionar archivos individuales o carpetas de golpe. También puedes arrastrar archivos de imagen directamente al canvas, o soltarlos sobre el panel de la librería para subirlos sin colocarlos en el tablero. Si algún nombre coincide con una foto ya existente, aparece un aviso con tres opciones: omitir duplicados, añadirlos de todas formas o reemplazar los existentes conservando el mismo ID. Las fotos se redimensionan automáticamente a un máximo de 1800 px y se guardan en JPEG.

### Secciones

Crea grupos colapsables dentro de la librería con el botón **+ Sección** de la cabecera. Las secciones se renombran y eliminan pasando el ratón sobre su cabecera. Para mover una foto a una sección, haz clic derecho sobre la miniatura. También puedes subir fotos directamente a una sección con el botón **↑** de su cabecera, o arrastrar archivos sobre la sección (se ilumina al pasar por encima). Las secciones se exportan e importan con el ZIP del proyecto.

### Ordenación y filtros

| Control | Efecto |
|---|---|
| **⇅** | Ordenar por fecha de importación (predeterminado), nombre A→Z, tono o luminosidad |
| Filtro **Sin colocar** | Mostrar solo las fotos que no están en ningún tablero |
| **# Etiquetas** | Filtrar por etiquetas de texto libre (ver sección Etiquetas) |
| Búsqueda por nombre | Campo de texto en la cabecera |
| **→** (al pasar el ratón) | Copiar la foto a otro proyecto sin moverla del proyecto actual |

**Ordenar por Tono** agrupa las fotos por su dominante cromática (rojo → naranja → verde → azul → morado → neutro al final). **Ordenar por Luminosidad** las ordena de más oscura a más clara. Cada miniatura muestra un pequeño punto circular cuyo color va de negro (foto oscura) a blanco (foto clara).

### Visor a pantalla completa

Haz doble clic sobre una miniatura de la librería para abrir la foto a pantalla completa. Navega entre fotos con las teclas **← →**. Cierra con **ESC** o clic fuera de la imagen.

### Redimensionar la biblioteca

Arrastra la barra separadora entre el canvas y la biblioteca para ajustar su altura. Al ampliarla, las miniaturas se reorganizan automáticamente en cuadrícula. El tamaño de las miniaturas se controla de forma independiente con el slider de la cabecera.

Haz clic en el botón **⊞** de la cabecera para ampliar la librería a vista extendida (70 % de la pantalla). Haz clic en **⊟** para volver a la altura compacta. El zoom del canvas se ajusta automáticamente.

### Selección múltiple en la librería

- **Ctrl + clic** — alterna la selección de una foto
- **Shift + clic** — selecciona el rango entre la última foto seleccionada y la que pulsas (dentro del mismo grupo o sección)
- **Seleccionar todo** — botón en la cabecera de cada sección

Con una o más fotos seleccionadas aparece una barra en la parte inferior de la librería con:

| Botón | Acción |
|---|---|
| **# Etiquetas** | Abre el panel de etiquetado en lote |
| **⊞ Sección** | Mueve todas las fotos seleccionadas a una sección |
| **Añadir al tablero** | Coloca todas las fotos seleccionadas en el canvas activo |
| **⊞ Cuadrícula** | Abre el diálogo para colocarlas en cuadrícula |
| **× Eliminar** | Elimina las fotos seleccionadas de la librería (pide confirmación) |

Al eliminar una foto que ya está colocada en algún tablero, el aviso lista los tableros afectados. Al arrastrar al canvas con varias fotos seleccionadas se muestra una pila animada con un contador.

### Panel de información

Pasa el ratón sobre una foto en la librería para ver en el panel lateral:

- Nombre, dimensiones originales y tamaño de archivo
- Cámara, objetivo, distancia focal, apertura, velocidad e ISO (metadatos EXIF)
- Tamaño en el tablero y dimensiones físicas (si hay DPI configurado)
- Valoración en estrellas
- Tono dominante con muestra de color y porcentaje de luminosidad
- Etiquetas asignadas
- Tableros en los que aparece colocada

### Pestaña Repositorio

La pestaña **Repo** muestra las imágenes de una carpeta local compartida. Copia archivos en la carpeta `repo/` dentro del directorio de la aplicación, cambia a la pestaña **Repo** y haz clic en **+** sobre una miniatura para importarla al proyecto activo.

---

## Trabajar en el canvas

### Añadir fotos

- Arrastra una miniatura desde la librería al canvas
- Arrastra una miniatura desde la pestaña Repo
- Suelta archivos de imagen directamente desde el explorador de archivos

Las fotos añadidas individualmente con clic en la miniatura aparecen en cascada diagonal, no apiladas.

### Manipular fotos

Pasa el ratón sobre una foto en el canvas para ver sus controles:

| Control | Acción |
|---|---|
| Arrastrar la foto | Mover |
| Asa naranja (esquina inferior derecha) | Redimensionar |
| **↻** (clic) | Rotar 90° |
| **↻** (arrastrar) | Rotación libre a cualquier ángulo · Shift encaja en múltiplos de 15° |
| **🔒** | Bloquear / desbloquear (evita movimientos accidentales) |
| **×** | Eliminar del tablero |
| Barra de etiqueta (debajo de la foto) | Clic para editar el texto |
| **Clic derecho** | Abrir menú contextual |

Las fotos bloqueadas muestran un icono de candado. Mientras están bloqueadas puedes seguir editando su etiqueta y su marco.

### Menú contextual

Haz clic derecho sobre cualquier foto o nota del canvas:

| Opción | Acción |
|---|---|
| **↑ Al frente** | Sube el elemento en el orden Z |
| **▣ Marco** | Abre el panel de marco y acabados (solo fotos) |
| **⊞ Usar como tamaño de referencia** | Las fotos que añadas después llegarán a ese ancho (solo fotos) |
| **↔ Voltear horizontal** | Voltea la foto de izquierda a derecha |
| **↕ Voltear vertical** | Voltea la foto de arriba a abajo |
| **⇄ Reemplazar foto** | Entra en modo selección para intercambiar la imagen |
| **⧉ Duplicar** | Crea una copia desplazada 20 px |
| **× Eliminar** | Elimina del tablero |

> El orden Z solo se modifica con **↑ Al frente** del menú contextual, o al crear/duplicar un elemento (que siempre llega encima de todo).

### Etiquetas de foto

Al hacer clic en la barra de etiqueta se abre un editor emergente que admite varias líneas. El tamaño de la ventana se recuerda por foto. Pulsa **Guardar** para confirmar o **×** para descartar.

### Marcos y acabados

Haz clic derecho sobre una foto → **▣ Marco** para abrir el panel de acabados, con dos capas independientes:

- **Paspartú** — grosor y color (blanco por defecto). Se suma al tamaño total de la pieza.
- **Moldura** — grosor y color (marrón por defecto). Se suma sobre el paspartú.

Las dimensiones que muestra el programa incluyen siempre el acabado completo. Para aplicar el mismo acabado a varias fotos, usa **Copiar estilo de marco** del menú contextual: el cursor cambia a modo pintor y haz clic sobre cada foto destino.

---

## Multiselección y alineación

Hay tres formas de seleccionar varios elementos:

- **Lasso** — haz clic y arrastra sobre el canvas vacío para trazar un rectángulo de selección
- **Shift + clic** — alterna un elemento concreto sin desmarcar el resto
- **Ctrl + A** — selecciona todos los elementos del tablero

Al hacer clic en cualquier miembro de un grupo se selecciona automáticamente todo el grupo.

Con una selección activa aparece una barra en la parte superior:

| Botón | Acción |
|---|---|
| Alinear bordes izquierdos / derechos | Con ≥ 2 elementos |
| Alinear bordes superiores / inferiores | Con ≥ 2 elementos |
| Centrar horizontalmente / verticalmente | Con ≥ 2 elementos |
| Distribuir horizontalmente / verticalmente | Con ≥ 3 elementos |
| Igualar ancho al anclaje | El anclaje es el primer elemento seleccionado (contorno sólido) |
| **⇄** | Intercambiar la posición de los dos elementos seleccionados (exactamente 2) |
| **⬇** | Exportar selección como JPEG |
| **⊞** | Copiar selección a nuevo tablero |
| **⊓** | Agrupar los elementos seleccionados (≥ 2) |
| **⊔** | Desagrupar |

---

## Notas flotantes

Haz clic derecho sobre el canvas y selecciona **Añadir nota** para colocar una nota de texto libre. Las notas se comportan como fotos — se pueden mover, redimensionar, rotar y bloquear. Son elementos de trabajo interno: no aparecen en la presentación final.

- **Título y cuerpo** — escribe directamente en la nota
- **Color** — el botón **■** abre un selector con 6 colores (amarillo, verde, azul, rosa, morado, naranja)
- **Enlace** — asigna una URL para mostrar una vista previa (título, dominio, favicon)
- **📄** — incluye o excluye la nota del informe del proyecto

---

## Elementos de texto

Haz clic derecho sobre el canvas y selecciona **Añadir texto** para colocar un bloque tipográfico. A diferencia de las notas internas, los textos son visibles en modo presentación. El nuevo elemento hereda automáticamente el tamaño, fuente, alineación y color del último texto colocado.

Usa la barra de arrastre superior del elemento para moverlo. Haz clic en el botón **T▾** de la barra de controles para abrir el panel de formato:

| Control | Acción |
|---|---|
| Campo numérico de tamaño | Tamaño de fuente libre de 8 a 999 px; botones **−/+** con incremento inteligente |
| **N** / **K** | Negrita / Cursiva |
| **Serif / Sans / Display / Mono** | Tipografía (Playfair Display, DM Sans, Bebas Neue, IBM Plex Mono) |
| **⫷ / ⊟ / ⫸** | Alineación del texto (izquierda, centro, derecha) |
| **■** (muestra de color) | Color del texto |
| **↻** (clic) | Rotar 90° |
| **↻** (arrastrar) | Rotación libre; Shift fija a incrementos de 15° |
| **🔒** | Bloquear / desbloquear |
| **×** | Eliminar del tablero |

---

## Zonas

Las zonas son contenedores visuales que agrupan fotos, notas y textos dentro de un tablero. Al mover una zona, todo su contenido se desplaza con ella.

Haz clic derecho sobre el canvas vacío y selecciona **+ Zona**. Arrastra cualquiera de los **ocho handles** (esquinas y centros de cada lado) para redimensionarla. Las fotos y notas que están dentro no se mueven al redimensionar la zona.

- **Etiqueta** — haz clic en el campo interior de la zona para escribir un nombre
- **Color** — haz clic derecho sobre la zona y elige uno de los seis colores disponibles

Las zonas no pueden soltarse dentro de otra zona. Cuando el centro de una foto o nota cae dentro de una zona, el elemento pasa a pertenecerle automáticamente (punto de color en la esquina).

### Menú contextual de zona

| Opción | Acción |
|---|---|
| **⊞ Copiar a nuevo tablero** | Crea un tablero nuevo con el contenido; pide nombre |
| **⊞ Mover a nuevo tablero** | Igual, pero además elimina la zona del tablero actual |
| **× Eliminar** | Pide confirmación si tiene contenido |

---

## Etiquetas (tags)

Las etiquetas permiten categorizar fotos con texto libre y filtrar la librería por ellas.

Pasa el ratón sobre una miniatura y haz clic en **#** para abrir el panel de etiquetas de esa foto. Con varias fotos seleccionadas en la librería, haz clic en **# Etiquetas** en la barra de selección para etiquetar en lote — las casillas muestran estado indeterminado cuando solo algunas fotos tienen la etiqueta.

**Puntuación en lote:** selecciona varias fotos, pasa el cursor sobre cualquiera y pulsa una tecla **0–5** para aplicar esa valoración a toda la selección.

**Filtrar:** haz clic en **# Etiquetas** en la cabecera de la librería; el filtro es OR (se muestran fotos con al menos una de las etiquetas activas). Los filtros de etiqueta se combinan con el filtro Sin colocar y la búsqueda por nombre.

---

## Cuadrícula y ajuste

| Botón | Efecto |
|---|---|
| **Cuadrícula** | Mostrar / ocultar la cuadrícula de alineación |
| **Imán** | Activar / desactivar el ajuste automático al mover elementos |

Con **Imán** activado, al mover un elemento aparecen guías **naranjas** cuando se alinea con bordes o centros de otros elementos. Si la separación con un vecino coincide con la que hay entre ese vecino y otro elemento, aparecen guías **cyan** y el sistema encaja automáticamente — ideal para mantener separaciones iguales en filas y columnas de fotos.

### Colocar fotos en cuadrícula

Selecciona varias fotos en la librería y pulsa **⊞ Cuadrícula** en la barra de selección. El diálogo permite configurar columnas y separación. En tableros fijos el ancho de celda se calcula automáticamente y el diálogo indica si todas las fotos caben.

---

## Zoom

| Acción | Atajo |
|---|---|
| Ampliar / reducir | **Ctrl + rueda del ratón** |
| Ampliar / reducir | **Ctrl + +** / **Ctrl + −** |
| Ajustar al ancho | **Ctrl + 0** · o botón **⇔** |

El nivel de zoom se guarda por tablero y se restaura al volver a él.

---

## Deshacer / Rehacer

| Acción | Atajo |
|---|---|
| Deshacer | **Ctrl + Z** |
| Rehacer | **Ctrl + Mayús + Z** o **Ctrl + Y** |

Se guardan hasta 50 pasos por tablero. El historial se conserva al cambiar de tablero.

---

## Memoria del proyecto

Haz clic en **≡ Memoria** en la barra superior. El informe incluye una vista previa de cada tablero, la tabla de fotos con dimensiones físicas (incluyendo marco), valoración, etiquetas, y las notas marcadas con 📄. El botón **⎙ Imprimir / Guardar PDF** genera el documento listo para entregar.

---

## Exportar un tablero

Haz clic en **⬇ Exportar JPEG** en la barra superior. Hay tres niveles de calidad: Buena (JPEG 85), Alta (JPEG 92) y Máxima (JPEG 100, hasta 16 000 px). En tableros fijos el JPEG respeta exactamente las dimensiones configuradas.

---

## Modo presentación

Haz clic en **Presentación** en la barra superior. La cuadrícula, las notas internas y las etiquetas de foto se ocultan automáticamente. Navega entre tableros con las flechas **‹ ›** o las teclas **← →**.

Si el tablero tiene zonas, el botón **Ver zonas** recompone las fotos de cada zona en pantalla completa lado a lado; navega entre zonas con **‹ ›**. En cualquier momento haz clic en dos fotos para intercambiarlas y ver variantes de composición en tiempo real.

Pulsa **ESC** para salir del modo presentación.

---

## Sala y vista 3D

La sala permite dibujar la planta del espacio expositivo y visualizar en 3D cómo quedan las fotos en cada pared o bloque.

### Multi-sala

Un proyecto puede tener varias salas independientes. Crea salas adicionales con el botón **+ Nueva sala** visible junto a las pestañas de sala. Cada sala tiene su propio plano y su propia lista de paredes; en el panel lateral, los tableros de cada sala aparecen anidados bajo su nombre.

### Dibujar la planta

1. Clic en **Dibujar planta** para entrar en modo dibujo.
2. Clic en el canvas para ir colocando vértices. Mantén **Shift** para forzar ángulos de 45°/90° y hacer snap a vértices cercanos.
3. Para cerrar el polígono, haz clic sobre el primer vértice.
4. Pulsa **⌫** para deshacer el último vértice, o **Cancelar** para salir sin guardar.

Una vez dibujada, haz clic en **Editar planta** para mover vértices arrastrándolos.

### Clic derecho en el plano

El menú contextual del plano permite añadir elementos al espacio:

| Opción | Resultado |
|---|---|
| **+ Columna** | Añade un pilar cuadrado configurable |
| **+ Bloque** | Entra en modo dibujo de bloque (arrastra para definir posición y tamaño) |

### Paredes — cara A y cara B

Cada pared tiene dos caras independientes que pueden vincularse a tableros distintos:

- **Cara A** — la cara interior (según el sentido de dibujo)
- **Cara B** — la cara exterior

En el panel derecho, cada pared muestra los botones **A** y **B** con una franja del color de cada cara. Al pasar el ratón sobre un botón, esa cara se ilumina en el plano 2D (rojo = A, azul = B). Haz clic en **+** de una cara para crear su tablero vinculado, o en **▶** para ir al tablero ya creado.

El clic derecho sobre una pared en el plano abre un menú para cambiar el color y el tablero de cada cara por separado, y para sincronizar las dimensiones si la pared ha cambiado de longitud.

#### Aviso de desincronización ⚠

Si la longitud real de la pared difiere del ancho del tablero vinculado, aparece un badge **⚠** y el botón **Sincronizar**. Si hay fotos que quedarían fuera del nuevo ancho, la sincronización se bloquea — ajusta esas fotos primero.

### Bloques sólidos

Un bloque representa un elemento físico en la sala: pedestal, vitrina, mampara, etc. Para crearlo haz clic derecho en el plano y selecciona **+ Bloque**, luego arrastra para definir su posición y tamaño.

Al seleccionar un bloque aparece un panel de propiedades con:

- **Etiqueta** — nombre del bloque
- **Color** — color de relleno en el plano y en 3D
- **W / D / H** — ancho, profundidad y altura en cm

Cada bloque tiene **cinco caras** (Norte, Sur, Este, Oeste, Superior), cada una con su propio botón en el panel derecho. Haz clic en **+** para crear el tablero de esa cara, o en **▶** para ir al tablero existente. Los tableros de bloque aparecen anidados bajo su sala en el panel lateral izquierdo.

### Vista 3D

Pulsa **Shift + R** (o el botón **Vista 3D**) para ver la sala en tres dimensiones. Las fotos de todos los tableros vinculados a paredes y bloques se proyectan sobre su superficie correspondiente, con sus marcos de paspartú y moldura incluidos.

Usa el ratón para **orbitar** (clic + arrastrar), hacer **zoom** (rueda) y **desplazarte** (clic derecho + arrastrar).

| Botón | Acción |
|---|---|
| **← Planta** (o **R**) | Volver a la vista de planta |
| **Centrar** | Restablecer la cámara a la posición inicial |
| **Figura** | Mostrar / ocultar la figura de escala humana (175 cm) |
| **↔ Mover** | Activar el arrastre de la figura por el suelo |
| **Capturar** | Guardar la vista actual como foto en la librería |
| **Modo paseo** | Activar la navegación en primera persona |

#### Modo paseo

En modo paseo la cámara se desplaza por el interior de la sala:

| Tecla | Acción |
|---|---|
| **↑ / ↓** | Avanzar / retroceder |
| **← / →** | Girar la cámara a izquierda / derecha |
| Clic en el canvas | Capturar el ratón para rotación libre sin límite de borde |
| Clic en una pared o foto | Posicionar la cámara perpendicular a ella a 200 cm |
| **ESC** | Liberar el ratón |

La figura de escala se oculta automáticamente al entrar en modo paseo.

---

## Fotos rechazadas

El botón **✕** en cada miniatura marca la foto como rechazada. Las rechazadas se ocultan por defecto. El botón **✕ Rechazadas** en la cabecera alterna entre: ocultar rechazadas → mostrar solo rechazadas → mostrar todas.

---

## Reemplazar foto en canvas

Clic derecho sobre una foto del canvas → **⇄ Reemplazar foto**. La librería entra en modo selección: haz clic en cualquier miniatura para intercambiar la imagen manteniendo posición, tamaño y rotación. Pulsa **ESC** para cancelar.

---

## Temas e idioma

Haz clic en **Preferencias** en la barra superior para cambiar el tema (Dark Amber, Light Natural, Dark Cool, High Contrast) y el idioma (Español, English).

---

## Actualizaciones

Cuando hay una nueva versión disponible, aparece un banner en la parte superior. Descarga el nuevo instalador y ejecútalo — en Windows reemplaza la instalación anterior automáticamente.

---

## Cerrar la aplicación

Cierra la pestaña del navegador. El servidor detecta el cierre y se apaga automáticamente en 90 segundos.

---

## Resumen de atajos de teclado

| Atajo | Acción |
|---|---|
| **Ctrl + Z** | Deshacer |
| **Ctrl + Mayús + Z** / **Ctrl + Y** | Rehacer |
| **Ctrl + C** | Copiar elementos seleccionados |
| **Ctrl + V** | Pegar (desplazado 20 px) |
| **Ctrl + D** | Duplicar elementos seleccionados |
| **Ctrl + A** | Seleccionar todos los elementos del tablero |
| **Ctrl + rueda** | Ampliar / reducir zoom |
| **Ctrl + +** / **Ctrl + −** | Ampliar / reducir zoom |
| **Ctrl + 0** | Ajustar al ancho |
| **Supr** / **Retroceso** | Eliminar elementos seleccionados |
| **Flechas** | Mover selección 1 px |
| **Mayús + Flechas** | Mover selección 10 px |
| **R** | Sala: ir al plano de planta |
| **Shift + R** | Sala: ir a la vista 3D |
| **ESC** | Salir de presentación / cancelar operación |
