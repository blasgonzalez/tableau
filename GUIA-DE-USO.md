# Tableau — Guía de uso

Tableau es una aplicación local para la gestión visual de proyectos fotográficos. Todos los datos se guardan en tu ordenador — sin nube, sin cuenta.

---

## Primeros pasos

Al abrir la app verás tres zonas:

- **Panel izquierdo** — árbol de proyectos y tableros
- **Canvas** — el área de trabajo principal
- **Librería** — la biblioteca de fotos del proyecto activo (franja inferior, plegable)

Empieza creando un proyecto en el panel izquierdo.

---

## Proyectos

Los proyectos son contenedores independientes. Cada uno tiene su propia librería de fotos y sus propios tableros.

| Acción | Cómo |
|---|---|
| Crear un proyecto | Clic en **+** en la cabecera *Proyectos y tableros* |
| Renombrar | Pasa el ratón sobre el nombre → icono de lápiz |
| Eliminar | Pasa el ratón sobre el nombre → **×** (elimina todas las fotos y tableros) |
| Exportar como ZIP | Pasa el ratón sobre el nombre → **↓** |
| Importar desde ZIP | Clic en **⬆ Importar** en la cabecera del panel |

Al importar un ZIP, si ya existe un proyecto con el mismo nombre puedes elegir importarlo como copia nueva o reemplazar el existente.

---

## Tableros

Cada proyecto puede tener varios tableros. Un tablero es un canvas libre donde colocas fotos y notas.

| Acción | Cómo |
|---|---|
| Crear un tablero | Clic en **+ Nuevo tablero** dentro de un proyecto |
| Renombrar | Pasa el ratón sobre el nombre → icono de lápiz |
| Duplicar | Pasa el ratón sobre el nombre → botón **⧉** |
| Eliminar | Pasa el ratón sobre el nombre → botón **×** |
| Reordenar | Arrastra el asa **⠿** de cada fila para cambiar el orden |

Cada fila de tablero muestra un contador con el número de fotos que tiene colocadas.

### Configuración del tablero (⚙ Config)

Abre **⚙ Config** en la barra superior para configurar el tablero activo:

- **Unidades** — px, cm, mm o pulgadas
- **DPI** — 72 (pantalla), 96 (web), 150 (borrador), 300 (imprenta), 600 (alta calidad)
- **Modo** — *Variable* (canvas ilimitado) o *Fijo* (dimensiones exactas)
- **Marco por defecto** — grosor de marco que se aplica automáticamente a las fotos nuevas

Configurar DPI y unidades activa las dimensiones físicas en las fotos y en el informe.

---

## Librería de fotos

La franja inferior muestra todas las fotos subidas al proyecto activo.

### Subir fotos

Haz clic en **+ Subir** en la cabecera de la librería para seleccionar archivos individuales, o en **+ Carpeta** para importar todas las imágenes de una carpeta de golpe. También puedes arrastrar archivos de imagen directamente al canvas, o soltarlos sobre el panel de la librería para subirlos sin colocarlos en el tablero. Las fotos se redimensionan automáticamente a un máximo de 1800 px y se guardan en JPEG.

### Ordenación y filtros

| Control | Efecto |
|---|---|
| **⇅** | Ordenar por fecha de importación (predeterminado), nombre A→Z, tono o luminosidad |
| Filtro **Sin colocar** | Mostrar solo las fotos que no están en ningún tablero |
| **# Etiquetas** | Filtrar por etiquetas de texto libre (ver sección Etiquetas) |
| **→** (al pasar el ratón) | Copiar la foto a otro proyecto sin moverla del proyecto actual |

**Ordenar por Tono** agrupa las fotos por su dominante cromática (rojo → naranja → verde → azul → morado → neutro al final). **Ordenar por Luminosidad** las ordena de más oscura a más clara. Cada miniatura muestra un pequeño punto circular cuyo color va de negro (foto oscura) a blanco (foto clara).

### Redimensionar la biblioteca

Arrastra la barra separadora entre el canvas y la biblioteca para ajustar su altura. Al ampliarla, las miniaturas se reorganizan automáticamente en cuadrícula. El tamaño de las miniaturas se controla de forma independiente con el slider de la cabecera.

Haz clic en el botón **⊞** de la cabecera para ampliar la librería a vista extendida (70 % de la pantalla). Haz clic en **⊟** para volver a la altura compacta. El zoom del canvas se ajusta automáticamente.

### Selección múltiple en la librería

Puedes seleccionar varias fotos antes de añadirlas al canvas o eliminarlas:

- **Ctrl + clic** — alterna la selección de una foto
- **Shift + clic** — selecciona el rango entre la última foto seleccionada y la que pulsas

Con una o más fotos seleccionadas aparece una barra en la parte inferior de la librería con:

| Botón | Acción |
|---|---|
| **# Etiquetas** | Abre el panel de etiquetado en lote (ver sección Etiquetas) |
| **Añadir al tablero** | Coloca todas las fotos seleccionadas en el canvas activo |
| **⊞ Cuadrícula** | Abre el diálogo para colocar las fotos seleccionadas en cuadrícula (ver sección Cuadrícula y ajuste) |
| **× Eliminar** | Elimina las fotos seleccionadas de la librería (pide confirmación) |

Al eliminar una foto que ya está colocada en algún tablero, el aviso de confirmación lista los tableros afectados.

Al arrastrar al canvas con varias fotos seleccionadas se muestra una pila animada con un contador.

### Panel de información

Pasa el ratón sobre una foto en la librería para ver en el panel lateral inferior derecho:

- Nombre, dimensiones originales y tamaño de archivo
- Tamaño en el tablero y dimensiones físicas (si hay DPI configurado)
- Valoración en estrellas (o "sin valorar" si no tiene)
- Tono dominante con muestra de color y porcentaje de luminosidad
- Etiquetas asignadas
- Tableros en los que aparece colocada

### Pestaña Repositorio

La pestaña **Repo** muestra las imágenes de una carpeta local compartida. Para usarla:

1. Copia los archivos de imagen en la carpeta `repo/` dentro del directorio de la aplicación
2. Cambia a la pestaña **Repo** en la librería
3. Haz clic en **+** sobre una miniatura para importarla al proyecto activo

---

## Trabajar en el canvas

### Añadir fotos

- Arrastra una miniatura desde la librería al canvas
- Arrastra una miniatura desde la pestaña Repo
- Suelta archivos de imagen directamente desde el explorador de archivos

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

Haz clic derecho sobre cualquier foto o nota del canvas para abrir un menú con acciones secundarias:

| Opción | Acción |
|---|---|
| **↑ Al frente** | Sube el elemento en el orden Z (ver nota abajo) |
| **▣ Marco** | Ajusta el grosor del marco (solo fotos) |
| **⊞ Usar como tamaño de referencia** | Las fotos que añadas después llegarán a ese ancho (solo fotos) |
| **↔ Voltear horizontal** | Voltea la foto de izquierda a derecha (solo fotos) |
| **↕ Voltear vertical** | Voltea la foto de arriba a abajo (solo fotos) |
| **⧉ Duplicar** | Crea una copia desplazada 20 px |
| **× Eliminar** | Elimina del tablero |

> **Orden Z:** seleccionar o arrastrar un elemento no cambia su posición en la pila. El orden Z solo se modifica con **↑ Al frente** del menú contextual, o al crear / duplicar un elemento (que siempre llega encima de todo).

### Etiquetas

Al hacer clic en la barra de etiqueta se abre un editor emergente que admite varias líneas. El tamaño de la ventana se recuerda por foto. Pulsa **Guardar** para confirmar o **×** para descartar.

### Marcos

La opción **▣ Marco** del menú contextual abre un panel para establecer el grosor en la unidad configurada del tablero. La etiqueta y el tooltip de dimensión muestran el tamaño total incluyendo el marco.

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
| **⬇** | Exportar selección como JPEG (disponible con ≥ 1 elemento) |
| **⊓** | Agrupar los elementos seleccionados (≥ 2) |
| **⊔** | Desagrupar (visible cuando algún elemento del grupo está seleccionado) |
| Deseleccionar | |

---

## Notas flotantes

Haz clic derecho sobre el canvas y selecciona **Añadir nota** para colocar una nota de texto libre. Las notas se comportan como fotos — se pueden mover, redimensionar y bloquear.

- **Título y cuerpo** — escribe directamente en la nota
- **Color** — el botón **■** abre un selector con 6 colores de fondo (amarillo, verde, azul, rosa, morado, naranja) más el predeterminado
- **Enlace** — asigna una URL para mostrar una vista previa del enlace (título, dominio, favicon)
- **Incluir en informe** — activa o desactiva el botón 📄 para incluir o excluir la nota del informe del proyecto

---

## Elementos de texto

Haz clic derecho sobre el canvas y selecciona **Añadir texto** para colocar un bloque tipográfico. Los elementos de texto están diseñados para presentaciones — a diferencia de las notas internas, son visibles en modo presentación. El nuevo elemento hereda automáticamente el tamaño, fuente, alineación y color del último texto que hayas colocado.

Usa la barra de arrastre superior del elemento para moverlo. Haz clic en el botón **T▾** de la barra de controles para abrir el panel de formato:

| Control | Acción |
|---|---|
| **S / M / L / XL** | Tamaño de fuente |
| **Serif / Sans / Display / Mono** | Tipografía (Playfair Display, DM Sans, Bebas Neue, IBM Plex Mono) |
| **⫷ / ⊟ / ⫸** | Alineación del texto (izquierda, centro, derecha) |
| **■** (muestra de color) | Color del texto |
| **↻** (clic) | Rotar 90° |
| **↻** (arrastrar) | Rotación libre; Mayús fija a incrementos de 15° |
| **🔒** | Bloquear / desbloquear |
| **×** | Eliminar del tablero |

Los elementos de texto se pueden mover, redimensionar y agrupar igual que el resto de elementos del canvas.

---

## Zonas

Las zonas son contenedores visuales que agrupan fotos, notas y textos dentro de un tablero. Al mover una zona, todo su contenido se desplaza con ella.

### Crear una zona

Haz clic derecho sobre el canvas vacío y selecciona **+ Zona**. La zona aparece centrada en la vista con un tamaño por defecto y queda seleccionada.

### Redimensionar una zona

Arrastra cualquiera de los **ocho handles** (esquinas y centros de cada lado) para cambiar el tamaño. Las fotos y notas que están dentro de la zona no se mueven al redimensionarla.

### Mover una zona

Arrastra el interior de la zona. Todo el contenido que tiene dentro se mueve con ella. Las zonas no pueden soltarse dentro de otra zona — si lo intentas, vuelven a su posición original.

### Etiqueta y color

- **Etiqueta** — haz clic en el campo de texto interior de la zona para escribir un nombre
- **Color** — haz clic derecho sobre la zona y selecciona uno de los seis colores disponibles (azul, verde, naranja, morado, rojo, neutro)

### Menú contextual de zona

Haz clic derecho sobre una zona para ver sus opciones:

| Opción | Cuándo aparece | Acción |
|---|---|---|
| **⊞ Copiar a nuevo tablero** | Solo si la zona tiene contenido | Crea un tablero nuevo con el contenido de la zona; pide nombre (pre-rellenado con la etiqueta de la zona o "Tablero N") |
| **⊞ Mover a nuevo tablero** | Solo si la zona tiene contenido | Igual que Copiar, pero además elimina la zona y su contenido del tablero actual |
| **× Eliminar** | Siempre | Si la zona tiene contenido pide confirmación antes de eliminar |

### Membresía automática

Cuando colocas o mueves una foto o nota de forma que su centro queda dentro de una zona, el elemento pasa a pertenecer a esa zona automáticamente. Un pequeño punto de color en la esquina del elemento indica a qué zona pertenece. Si mueves el elemento fuera de los límites de la zona, pierde la membresía.

---

## Etiquetas (tags)

Las etiquetas permiten categorizar las fotos con texto libre y filtrar la biblioteca por ellas.

### Asignar etiquetas a una foto

Pasa el ratón sobre una miniatura y haz clic en el botón **#** que aparece en los controles. Se abre un pequeño panel con:

- Las etiquetas ya existentes en el proyecto como casillas de verificación — marca o desmarca para añadir o quitar la etiqueta de esa foto
- Un campo de texto al final para crear una etiqueta nueva: escribe y pulsa **Enter**

Las fotos con etiquetas muestran un badge **#N** en la esquina superior izquierda de la miniatura.

### Etiquetado en lote

Con varias fotos seleccionadas en la librería, haz clic en **# Etiquetas** en la barra de selección. El panel muestra todas las etiquetas del proyecto con el estado de cada una:

- **Casilla marcada** — todas las fotos seleccionadas tienen la etiqueta
- **Casilla indeterminada** — solo algunas fotos la tienen (se muestra el conteo N/total)
- **Casilla vacía** — ninguna foto la tiene

Hacer clic en una etiqueta la añade a las fotos que no la tenían, o la elimina de todas si ya la tenían todas. También puedes crear una nueva etiqueta escribiendo en el campo inferior y pulsando Enter.

### Puntuación en lote

Selecciona varias fotos en la librería, pasa el cursor sobre cualquiera de las fotos seleccionadas y pulsa una tecla del **0** al **5**. La valoración se aplica a todas las fotos de la selección. Si solo hay una foto seleccionada, la tecla puntúa únicamente esa foto.

### Filtrar por etiquetas

Haz clic en el botón **# Etiquetas** en la cabecera de la biblioteca. Se abre un panel con todas las etiquetas del proyecto; selecciona una o varias. El filtro es **OR** — se muestran las fotos que tengan al menos una de las etiquetas activas. El botón muestra un badge con el número de filtros activos.

Para desactivar todos los filtros de etiqueta, selecciona **Todas** en el panel o haz clic de nuevo en las etiquetas activas.

Los filtros de etiqueta se combinan con el filtro **Sin colocar** y con la búsqueda por nombre.

---

## Cuadrícula y ajuste

| Botón | Efecto |
|---|---|
| **Cuadrícula** | Mostrar / ocultar la cuadrícula de alineación |
| **Ajustar** | Activar / desactivar el ajuste automático al mover elementos |

El selector de tamaño de cuadrícula (junto a Ajustar) ofrece tamaño automático o valores específicos en mm, cm o px según las unidades configuradas en el tablero.

Con **Ajustar** activado, al mover un elemento se alinea primero con los bordes y centros del resto de elementos del tablero (snap a elementos). Aparecen guías naranjas que indican el ajuste activo. Si no hay ningún elemento cercano al que ajustarse, se aplica el snap a la cuadrícula.

Además, si la separación entre el elemento que estás moviendo y un vecino coincide con la que hay entre ese vecino y otro elemento del tablero, aparecen guías **cyan** en ambos huecos y el sistema encaja automáticamente a esa distancia. Esto permite mantener separaciones iguales al ampliar filas o columnas de fotos.

### Colocar fotos en cuadrícula

Selecciona varias fotos en la librería y pulsa **⊞ Cuadrícula** en la barra de selección. El diálogo permite configurar:

- **Columnas** — número de columnas de la cuadrícula
- **Separación** — hueco entre fotos, en las unidades del tablero

En **tableros fijos** el ancho de celda se calcula automáticamente a partir del ancho del tablero, las columnas y la separación. El diálogo muestra si todas las fotos caben; si no caben, ajusta el número de columnas o la separación hasta que el indicador sea positivo.

En **tableros variables** se usa el ancho de referencia del tablero y la cuadrícula se centra en la vista actual.

Las fotos se colocan en el orden de selección (de izquierda a derecha, fila a fila). Si las fotos tienen proporciones distintas, la altura de cada celda se adapta a la foto y las celdas de la misma fila se alinean por el centro.

---

## Zoom

| Acción | Atajo |
|---|---|
| Ampliar / reducir | **Ctrl + rueda del ratón** |
| Ampliar | **Ctrl + +** |
| Reducir | **Ctrl + −** |
| Ajustar al ancho | **Ctrl + 0** · o botón **⇔** |
| Porcentaje de zoom | Clic en los botones % en los controles de la esquina inferior derecha |

El nivel de zoom se guarda por tablero y se restaura al volver a él.

---

## Deshacer / Rehacer

| Acción | Atajo |
|---|---|
| Deshacer | **Ctrl + Z** |
| Rehacer | **Ctrl + Mayús + Z** o **Ctrl + Y** |

Se guardan hasta 50 pasos por tablero. El historial se reinicia al cambiar de tablero.

---

## Memoria del proyecto

Haz clic en **≡ Memoria** en la barra superior para abrir el panel de memoria del proyecto. Tiene dos partes: el formulario de edición (izquierda) y el informe imprimible (al imprimir).

### Formulario de información

| Campo | Descripción |
|---|---|
| **Título** | Título de presentación del proyecto |
| **Descripción breve** | Subtítulo o descripción corta |
| **+ Sección** | Añade un epígrafe libre con título y cuerpo de texto; puedes añadir tantas secciones como necesites y eliminarlas con **×** |

Los cambios en los campos de texto se guardan automáticamente al salir del campo.

### Tableros y piezas

Debajo del formulario aparece la lista de tableros del proyecto con una vista previa a escala de cada uno y la tabla de fotos que contiene.

- El botón **Incluir en memoria / Excluir de memoria** de cada tablero controla si ese tablero aparece en el informe imprimible. Los tableros excluidos se muestran atenuados.

### Imprimir el informe

Haz clic en **⎙ Imprimir / Guardar PDF** para abrir el diálogo de impresión del navegador. El informe se pagina así:

- **Primera página** — información del proyecto (título, descripción y secciones), si la casilla *Incluir información del proyecto en el informe* está marcada
- **Una página por tablero** — vista previa a escala + tabla de fotos con dimensiones y etiquetas

El informe también incluye las notas marcadas con el icono 📄 y sus enlaces como hipervínculos clicables.

---

## Exportar un tablero

Haz clic en **⬇ Exportar JPEG** en la barra superior para descargar el tablero activo como imagen JPEG.

---

## Modo presentación

Haz clic en **Presentación** en la barra superior para ocultar toda la interfaz y ver el tablero activo a pantalla completa. El nombre del proyecto y el tablero aparecen discretamente en la parte inferior al pasar el ratón. Pasa el ratón por la esquina superior derecha para ver el botón de salida, o pulsa **ESC** para volver a la vista normal.

Para navegar entre tableros sin salir del modo, usa las **flechas ‹ ›** que aparecen a los lados de la pantalla al mover el ratón, o pulsa las **teclas ← →**. Los puntos de la esquina inferior indican el tablero actual y el total.

En modo presentación: la cuadrícula se oculta automáticamente, las notas internas y las etiquetas de foto desaparecen. Los elementos de texto (añadidos con clic derecho → Añadir texto) permanecen visibles y son la forma recomendada de añadir títulos o pies para presentaciones.

---

## Fotos rechazadas

El botón **✕** que aparece al pasar el ratón sobre una miniatura de la librería marca la foto como rechazada. Las fotos rechazadas:

- Se ocultan de la librería por defecto (aparecen en la cabecera cuántas hay)
- Muestran una etiqueta roja **RECHAZADA** si están visibles
- Se pueden recuperar volviendo a pulsar ✕

El botón **✕ Rechazadas** en la cabecera de la librería alterna entre tres estados: ocultar rechazadas (por defecto) → mostrar solo rechazadas → mostrar todas.

---

## Reemplazar foto en canvas

Haz clic derecho sobre una foto del canvas y elige **⇄ Reemplazar foto**. La librería entra en modo selección: aparece un banner con instrucciones y la foto a reemplazar queda resaltada en rojo. Haz clic en cualquier miniatura de la librería para intercambiar la imagen — la nueva foto ocupa la misma posición, tamaño y rotación. Pulsa **ESC** o el botón del banner para cancelar.

---

## Temas e idioma

Haz clic en **Preferencias** en la barra superior para cambiar:

- **Tema** — Dark Amber, Light Natural, Dark Cool, High Contrast
- **Idioma** — Español, English

---

## Actualizaciones

Cuando hay una nueva versión disponible, aparece un banner en la parte superior de la app. Haz clic en el enlace para descargar el nuevo instalador y ejecútalo — en Windows reemplaza la instalación anterior automáticamente.

---

## Cerrar la aplicación

Cierra la pestaña del navegador. El servidor detecta el cierre y se apaga automáticamente en 90 segundos. La ventana de símbolo del sistema se cerrará sola.

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
| **Ctrl + 0** | Ajustar al ancho (tablero variable) / ajustar tablero (tablero fijo) |
| **Supr** / **Retroceso** | Eliminar elementos seleccionados |
| **Flechas** | Mover selección 1 px |
| **Mayús + Flechas** | Mover selección 10 px |
