# Tableau — Guía de uso

Tableau es la versión digital de la mesa de edición: el espacio donde extiendes tus fotos, las organizas, las comparas y decides cómo van a verse. Todo funciona en tu ordenador, sin nube, sin cuenta, sin suscripción.

---

## La interfaz

> 📷 **IMAGEN AQUÍ: captura general de la interfaz con las cuatro zonas anotadas**

Al abrir Tableau verás cuatro zonas:

- **Panel izquierdo** — árbol de proyectos, salas y tableros; plantillas, papelera e información
- **Canvas** — el área de trabajo principal
- **Biblioteca** — la franja inferior con todas las fotos del proyecto activo (plegable)
- **Barra superior** — herramientas contextuales según lo que estés haciendo

Empieza creando un proyecto con el botón **+** en la cabecera del panel izquierdo.

---

## Proyectos

Los proyectos son contenedores independientes. Cada uno tiene su propia biblioteca de fotos, sus propios tableros y sus propias salas.

| Acción | Cómo |
|---|---|
| Crear | Clic en **+** en la cabecera *Proyectos y tableros* |
| Renombrar | Pasa el ratón → icono de lápiz |
| Eliminar | Pasa el ratón → **×** (va a la papelera) |
| Exportar como ZIP | Pasa el ratón → **↓** |
| Importar desde ZIP | Clic en **⬆ Importar** en la cabecera del panel |
| Duplicar | Pasa el ratón → botón de duplicar |

Al importar un ZIP, si ya existe un proyecto con el mismo nombre puedes elegir importarlo como copia nueva o reemplazar el existente.

### Ajustes del proyecto

Abre **Ajustes** desde el botón ⚙ de la barra superior → sección **Proyecto** para configurar:

- Nombre del proyecto
- Notas y descripción
- Valores por defecto para tableros nuevos (unidades, DPI, marco, formato de exportación)
- Compartir (solo modo servidor)

### Papelera

Los proyectos, tableros, salas y fotos eliminados se conservan durante 30 días antes de borrarse definitivamente. Accede a la papelera desde el botón en el panel izquierdo (muestra un badge con el número de elementos). Puedes restaurar elementos completos o vaciar la papelera manualmente.

---

## Tableros

Cada proyecto puede tener varios tableros. Un tablero es el canvas donde colocas y organizas tus fotos.

| Acción | Cómo |
|---|---|
| Crear | Clic en **+ Nuevo tablero** dentro de un proyecto |
| Renombrar | Pasa el ratón → icono de lápiz |
| Duplicar | Pasa el ratón → botón **⧉** |
| Eliminar | Pasa el ratón → botón **×** |
| Reordenar | Arrastra el asa **⠿** de cada fila |
| Marcar como privado | Menú contextual del tablero → Privado (solo modo servidor) |

Los tableros privados son invisibles para los invitados. Se identifican con un icono de ojo tachado junto a su nombre en el panel lateral.

Los tableros vinculados a paredes o bloques de sala aparecen anidados bajo su sala en el panel lateral.

### Configuración del tablero

Abre **⚙ Config** en la barra superior para configurar el tablero activo:

- **Unidades** — px, cm, mm o pulgadas
- **DPI** — 72 (pantalla), 96 (web), 150 (borrador), 300 (imprenta), 600 (alta calidad)
- **Modo** — *Variable* (canvas ilimitado) o *Fijo* (dimensiones exactas)
- **Marco por defecto** — grosor de paspartú que se aplica automáticamente a las fotos nuevas
- **Borde exterior al exportar** — espacio en blanco alrededor del contenido en el JPEG exportado (solo tableros variables)

### Plantillas de tablero

Guarda el diseño actual como plantilla con **⚙ Config → Guardar como plantilla**. Al crear un tablero nuevo aparece un selector para empezar desde una plantilla o en blanco.

### Versiones de tablero

El botón **⏱** en la barra superior guarda un snapshot del estado completo del tablero. La lista muestra cada versión con fecha, hora y número de elementos. Haz clic en **Restaurar** para volver a ese estado. Haz clic en **×** para eliminar una versión.

---

## Biblioteca de fotos

La franja inferior muestra todas las fotos subidas al proyecto activo.

### Subir fotos

Haz clic en **↑ Subir** para seleccionar archivos o carpetas. También puedes arrastrar archivos directamente al canvas o sobre el panel de la biblioteca. Si algún nombre coincide con una foto ya existente, un aviso te ofrece tres opciones: omitir duplicados, añadirlos o reemplazar los existentes conservando el mismo ID.

Las fotos se redimensionan automáticamente a un máximo de 1800 px y se guardan en JPEG.

### Secciones

Crea grupos colapsables con el botón **+ Sección** de la cabecera. Para mover una foto a una sección, haz clic derecho sobre la miniatura o arrástrala. También puedes subir fotos directamente a una sección con el botón **↑** de su cabecera. Las secciones se exportan e importan con el ZIP del proyecto.

### Ordenación y filtros

| Control | Efecto |
|---|---|
| **⇅** | Ordenar por fecha, nombre A→Z, tono o luminosidad |
| **Sin colocar** | Fotos no colocadas en ningún tablero del proyecto |
| **Sin colocar → En esta sala** | Fotos no colocadas en ninguna pared de la sala activa |
| **# Etiquetas** | Filtrar por etiquetas |
| Búsqueda | Campo de texto en la cabecera (también **Ctrl+K** para búsqueda global) |

El filtro **Sin colocar** tiene un selector de ámbito: *En el proyecto* (todas las fotos sin colocar en ningún tablero) o *En esta sala* (fotos no usadas en ninguna pared de la sala activa). Esta segunda opción es especialmente útil cuando planificas una exposición y quieres ver qué fotos te quedan por colocar en la sala en la que estás trabajando.

### Selección múltiple

- **Ctrl + clic** — alterna la selección
- **Shift + clic** — selecciona el rango (dentro del mismo grupo o sección)
- **☑** en la cabecera de sección — selecciona todas las fotos de esa sección

Con fotos seleccionadas aparece una barra con acciones:

| Botón | Acción |
|---|---|
| **# Etiquetas** | Etiquetar en lote |
| **⊞ Sección** | Mover a una sección |
| **Añadir al tablero** | Colocar en el canvas activo |
| **⊞ Cuadrícula** | Crear mosaico con la selección |
| **× Eliminar** | Eliminar (van a la papelera) |

### Panel de información

Pasa el ratón sobre una foto para ver en el panel lateral:

- Nombre, dimensiones originales y resolución nativa
- Tamaño físico a esa resolución y al DPI del tablero activo
- Metadatos EXIF (cámara, objetivo, focal, apertura, velocidad, ISO)
- Valoración en estrellas, tono dominante, luminosidad y etiquetas
- Tableros donde está colocada (con indicación de sala y cara de pared si aplica)

### Visor a pantalla completa

Doble clic sobre una miniatura para abrir la foto a pantalla completa con todos sus metadatos. Navega con **← →**. Cierra con **ESC**.

### Fotos rechazadas

El botón **✕** en cada miniatura marca la foto como rechazada. El filtro de la cabecera alterna entre ocultar rechazadas, mostrar solo rechazadas y mostrar todas. Atajos sobre la miniatura: **X** para rechazar, **U** para recuperar.

---

## Búsqueda global

Pulsa **Ctrl+K** (o el icono de lupa en la barra superior) para abrir la búsqueda global. Busca en todos los proyectos a la vez: nombres de proyecto, tablero y sala, contenido de notas y textos libres del canvas, nombres de foto y etiquetas.

Los resultados aparecen agrupados por tipo. Haz clic en cualquier resultado para navegar directamente a él.

---

## Trabajar en el canvas

### Añadir fotos

Arrastra una o varias miniaturas desde la biblioteca al canvas. Con varias fotos seleccionadas el arrastre muestra una pila animada con un contador. Las fotos añadidas con clic en la miniatura aparecen en cascada diagonal.

Las fotos se colocan a su tamaño nativo según el DPI del tablero. En un tablero variable vacío, al añadir la primera foto el zoom se ajusta para que sea visible.

### Manipular elementos

| Control | Acción |
|---|---|
| Arrastrar | Mover |
| Handle de esquina | Redimensionar |
| **↻** | Rotar 90° |
| Arrastrar el punto circular | Rotación libre (Shift = pasos de 15°) |
| **Voltear H / V** | Menú contextual → Voltear |
| **🔒** | Bloquear / desbloquear posición |
| **×** | Eliminar del tablero |

**Shift + arrastrar** restringe el movimiento al eje horizontal o vertical.

Para ver y editar la posición, tamaño y rotación exactos de un elemento, haz clic derecho → **Propiedades**. Introduce los valores numéricos y pulsa **Aplicar**. Útil para igualar tamaños entre tableros distintos.

### Selección múltiple en el canvas

- **Ctrl + clic** o **Shift + clic** — añade o quita de la selección
- Arrastrar sobre el canvas vacío — lasso de selección
- **Ctrl + A** — seleccionar todo

Con varios elementos seleccionados aparece la barra de selección en la parte superior del canvas con herramientas de alineación, distribución, agrupación y exportación.

### Alinear y distribuir

Con dos o más elementos seleccionados usa los botones de la barra de selección para alinear bordes (izquierdo, derecho, superior, inferior) y centros (horizontal, vertical), o para distribuir con espaciado uniforme.

### Agrupar

Selecciona varios elementos y pulsa el botón de agrupar (**⊓**). Un clic sobre cualquier miembro del grupo selecciona todo el grupo. Desagrupa con **⊔**.

### Copiar, cortar y pegar

| Atajo | Acción |
|---|---|
| **Ctrl + C** | Copiar selección |
| **Ctrl + X** | Cortar selección |
| **Ctrl + V** | Pegar con ghost visual |
| **Ctrl + D** | Duplicar en el mismo sitio (+20 px) |

Al pegar, aparece un fantasma semitransparente que sigue el cursor. Haz clic para colocarlo. Usa la **rueda del ratón** para escalar el conjunto antes de colocar. Pulsa **ESC** para cancelar.

El portapapeles persiste al cambiar de tablero: puedes copiar en un tablero y pegar en otro. Funciona con todos los tipos de elemento: fotos, textos, notas, zonas, mosaicos y placeholders.

### Zoom y navegación

| Atajo | Acción |
|---|---|
| **Ctrl + rueda** | Zoom continuo |
| **Ctrl + +** / **Ctrl + −** | Zoom discreto |
| **Ctrl + 0** | Ajustar vista al tablero |
| **Espacio + arrastrar** | Desplazar el canvas (pan) |

### Cuadrícula y snap

El botón **Guías** en la barra superior activa la cuadrícula. El **imán** activa el snap automático: los elementos se alinean con la cuadrícula y con los bordes y centros de otros elementos (guías naranjas). Las guías cyan indican equidistancia entre elementos.

En tableros fijos hay guías de borde que muestran la distancia de los elementos a los márgenes del tablero. Las guías se vuelven sólidas cuando el elemento está centrado exactamente.

### Deshacer y rehacer

**Ctrl + Z** deshace el último cambio. **Ctrl + Mayús + Z** o **Ctrl + Y** rehace. Se conservan hasta 50 pasos por tablero y el historial se mantiene al cambiar de tablero.

---

## Marcos (paspartú y moldura)

Haz clic derecho sobre una foto → **Marco** para definir el grosor del paspartú y la moldura en las unidades del tablero. El marco se incluye en las dimensiones físicas y se renderiza en la exportación, en la vista 3D y en el informe de memoria.

Configura un marco por defecto en **⚙ Config** del tablero para que se aplique automáticamente a las fotos nuevas.

---

## Mosaicos

Los mosaicos son cuadrículas de fotos que puedes crear, editar y reordenar directamente en el canvas.

### Crear un mosaico

Clic derecho en el canvas → **+ Mosaico**. Se abre un diálogo con las opciones:

- **Columnas** — número de columnas
- **Filas** — opcional. Si lo dejas vacío el mosaico crece automáticamente al añadir fotos (**modo libre**); si introduces un número crea una estructura fija C×F con celdas vacías (**modo fijo**)
- **Separación entre columnas** y **separación entre filas** — independientes
- **Compactar** — (solo modo fijo) al quitar una foto, las restantes se desplazan para ocupar el hueco; si está desactivado el hueco queda visible

### Dos modos de funcionamiento

**Modo libre:** el mosaico crece al añadir fotos. No hay celdas vacías.

**Modo fijo:** estructura C×F predefinida. Las celdas vacías aparecen como rectángulos punteados en el canvas (invisibles en la exportación). Útil para reservar huecos o planificar una composición antes de tener todas las fotos.

### Añadir y gestionar fotos

- **Arrastra una foto desde la biblioteca** sobre una celda vacía para llenarla, o sobre una celda ocupada para reemplazarla.
- **Arrastra entre celdas** para reordenar (intercambia las dos fotos).
- **Clic derecho sobre una celda ocupada** → opciones de celda (reemplazar, quitar) y opciones del mosaico (propiedades, desacoplar, eliminar).
- **Clic derecho sobre una celda vacía o espacio entre celdas** → opciones del mosaico.

### Dimensiones de celda

Al pasar el ratón sobre un mosaico, el panel de información lateral muestra el tamaño de celda en píxeles y en unidades físicas (cm, mm…) según el DPI del tablero. Es el dato que necesitas para producción.

Para ajustar el tamaño de celda con precisión: clic derecho → **Propiedades del mosaico** → campo **Ancho de celda**. Introduce el valor deseado y el sistema recalcula el ancho total del mosaico automáticamente.

### Desacoplar un mosaico

Clic derecho → **Desacoplar**. Tres opciones:

- **En fotos sueltas** — cada celda se convierte en una foto independiente en su posición exacta
- **En columnas** — cada columna se convierte en una zona con sus fotos bloqueadas (puedes arrastrar la columna entera como bloque)
- **En filas** — cada fila se convierte en una zona con sus fotos bloqueadas

---

## Zonas

> 📷 **IMAGEN AQUÍ: zona con fotos dentro, borde de color visible y cabecera de zona**

Las zonas son divisores visuales del canvas que agrupan fotos, notas y textos. Al mover la zona, su contenido se mueve con ella.

Crea una zona con clic derecho en el canvas → **+ Zona**. Elige entre seis colores. Redimensiona desde cualquier borde o esquina.

Dentro de una zona, un segundo clic sobre una foto la selecciona directamente (estilo Figma). Una foto debe estar completamente dentro de la zona para pertenecer a ella; si la arrastras parcialmente fuera, se desvincula.

El botón **⊞** de la cabecera de la zona convierte todo su contenido en un tablero nuevo.

---

## Textos libres

> 📷 **IMAGEN AQUÍ: toolbar contextual de texto activa en la barra superior**

Crea un elemento de texto con clic derecho en el canvas → **+ Texto**.

Haz **doble clic** sobre el texto para entrar en modo edición. Mientras editas, la barra superior muestra las opciones de formato:

- **Fuente** — Serif (Playfair Display), Sans (DM Sans), Display (Bebas Neue), Mono (IBM Plex Mono), Garamond (Cormorant Garamond), Inter, Josefin
- **Tamaño** — dropdown con presets adaptados al DPI del tablero, o introduce un valor manual
- **Negrita** e **Itálica**
- **Alineación** — izquierda, centro, derecha
- **Color** — selector de color con opción de reset

Con el texto seleccionado (sin editar) se comporta como cualquier otro elemento: se puede mover, redimensionar, agrupar y alinear con otros elementos.

Los textos libres son visibles en el modo presentación y en la vista 3D.

---

## Notas internas

Las notas son post-its flotantes para uso interno. Se crean con clic derecho → **+ Nota**. Elige entre seis colores. Admiten enlaces URL con previsualización estilo Padlet.

Las notas **no son visibles** en el modo presentación ni en la vista 3D. Son exclusivamente para el flujo de trabajo del autor.

---

## Presentación

Haz clic en el icono de presentación en la barra superior. La cuadrícula, las notas y las etiquetas se ocultan. Navega entre tableros con **← →** o las flechas en pantalla.

Si el tablero tiene zonas, el botón **Ver zonas** recompone las fotos de cada zona en pantalla completa; navega entre zonas con **‹ ›**. Haz clic en dos fotos para intercambiarlas y ver variantes en tiempo real.

Pulsa **ESC** para salir.

---

## Exportar

Haz clic en el botón de exportar (↓) en la barra superior.

**Formato:**
- **JPEG** — con tres niveles de calidad: Buena (85), Alta (92) y Máxima (100, hasta 16 000 px)
- **PNG** — fondo transparente, útil para fotos con marco sobre fondo sin color

En tableros fijos el archivo exportado respeta exactamente las dimensiones configuradas. En tableros variables incluye el borde exterior configurado en **⚙ Config**.

También puedes exportar solo la selección activa con el botón **↓** de la barra de selección.

---

## Memoria del proyecto

Haz clic en el icono de memoria (documento) en la barra superior. El informe incluye:

- Vista previa de cada tablero a escala
- Lista de fotos con dimensiones físicas (incluido el marco), valoración y etiquetas
- Notas del proyecto marcadas con 📄
- Comentarios del autor marcados como "incluir en memoria"

El botón **⎙ Imprimir / Guardar PDF** genera el documento listo para entregar.

---

## Comentarios y anotaciones

> 📷 **IMAGEN AQUÍ: panel lateral de comentarios abierto con una lista de comentarios**

Puedes añadir comentarios a cualquier entidad del proyecto: el proyecto en su conjunto, un tablero, una sala, una foto, una zona o un texto.

### Añadir un comentario

- **Tablero / sala** — botón 💬 en la barra superior (contextual: muestra los comentarios del tablero o sala que estés viendo)
- **Foto, zona o texto** — clic derecho sobre el elemento → **Comentarios**, o haz clic en el badge 💬 que aparece sobre el elemento

Los comentarios del autor son **privados por defecto**. Puedes marcarlos como públicos para que los vean los visitantes, y marcar la casilla **Incluir en memoria** para que aparezcan en el informe.

Puedes editar tus propios comentarios. Los elementos con comentarios muestran un badge 💬 con el número de comentarios.

### Comentarios de visitantes

Si al compartir el proyecto o la sala habilitas los comentarios, los visitantes pueden enviar comentarios que llegan como **pendientes de moderación**.

Como autor, el botón 💬 en la barra superior muestra un punto naranja cuando hay comentarios pendientes. Haz clic para abrir la pantalla de moderación: aprueba o rechaza cada comentario, y decide si los aprobados son públicos o privados.

---

## Sala y vista 3D

La sala te permite dibujar la planta del espacio expositivo y ver en tres dimensiones cómo quedan las fotos en cada pared.

### Crear una sala

Haz clic en **+ Nueva sala** en el panel lateral. Un proyecto puede tener varias salas independientes.

### Dibujar la planta

> 📷 **IMAGEN AQUÍ: plano de sala con vértices, cotas y panel derecho con paredes A/B**

1. Haz clic en **Editar planta** para entrar en modo edición.
2. Haz clic en el canvas para ir colocando vértices. Mantén **Shift** para forzar ángulos de 45°/90°.
3. Cierra el polígono haciendo clic sobre el primer vértice, o deja los segmentos abiertos si la sala no es un polígono cerrado.
4. **⌫** deshace el último vértice. **ESC** cancela.

Una vez dibujada, arrastra los vértices para modificar la planta.

**Eliminar un segmento de pared:** clic derecho sobre el segmento (la línea entre dos vértices) → **Eliminar pared**. El segmento desaparece pero los vértices se conservan, salvo que queden sin ningún otro segmento conectado, en cuyo caso se eliminan también. Si el segmento tiene tableros vinculados, el programa pide confirmación antes de eliminarlo.

Esto es útil para representar paredes con vanos (ventanas, puertas): dibuja todos los segmentos incluyendo los huecos, y luego elimina los segmentos que corresponden a la abertura.

**Configuración de la sala** (panel derecho):
- **Altura del techo** — en cm, determina la altura de las paredes en 3D
- **Grosor por defecto** — grosor de las paredes

### Paredes — cara A y cara B

Cada pared tiene dos caras independientes:

- **Cara A** — interior (según el sentido de dibujo)
- **Cara B** — exterior

En el panel lateral, cada pared muestra su nombre, longitud y número de tableros vinculados, con un botón para abrir la **vista frontal**.

#### Vista frontal de pared

La vista frontal es el espacio donde gestionas los tableros de una cara. Abre la vista frontal desde el panel lateral y usa el toggle **A / B** para cambiar de cara.

Desde la vista frontal puedes:

- **Crear un tablero** con el botón **+** — crea un tablero fijo vacío vinculado a esa cara
- **Mover un tablero** dentro de la vista frontal arrastrándolo (con snap a 150 cm, bordes de pared y otros tableros)
- **Redimensionar un tablero vacío** desde sus bordes o esquinas
- **Editar en canvas** con doble clic sobre el tablero
- **Clic derecho sobre un tablero** → menú con opciones: editar, mover a otra pared, desvincular, eliminar

Una cara de pared puede tener varios tableros con posiciones independientes.

Si la longitud real de la pared difiere del ancho de un tablero vinculado, aparece un badge **⚠** y el botón **Sincronizar**.

### Bloques sólidos

Un bloque representa un elemento físico: pedestal, vitrina, mampara. Clic derecho en el plano → **+ Bloque**, luego arrastra para definir posición y tamaño.

Cada bloque tiene **cinco caras** (Norte, Sur, Este, Oeste, Superior), cada una vinculable a un tablero independiente.

### Columnas

Clic derecho en el plano → **+ Columna**. Configura dimensiones y posición.

### Vista 3D

> 📷 **IMAGEN AQUÍ: vista 3D con fotos en paredes, figura de escala y controles visibles**

Pulsa **Shift + R** o el botón **Vista 3D**. Las fotos de todos los tableros vinculados se proyectan sobre su superficie con marcos incluidos. Los textos libres también se renderizan en las paredes.

**Navegación orbital:** clic + arrastrar para orbitar, rueda para zoom, clic derecho + arrastrar para desplazar.

| Botón | Acción |
|---|---|
| **Centrar** | Restablecer la cámara |
| **Figura** | Mostrar / ocultar la figura de escala (175 cm) |
| **↔ Mover** | Arrastrar la figura por el suelo |
| **Iluminación** | Activar iluminación volumétrica |
| **Modo paseo** | Navegación en primera persona |

#### Modo paseo

| Tecla | Acción |
|---|---|
| **↑ / W** | Avanzar |
| **↓ / S** | Retroceder |
| **← / A** | Girar izquierda |
| **→ / D** | Girar derecha |
| Clic en el canvas | Capturar el ratón para rotación libre |
| Clic en pared o foto | Posicionar la cámara perpendicular a 200 cm |
| **ESC** | Liberar el ratón |

#### Copiar desde la vista 3D

Haz clic derecho sobre una foto o zona en la vista 3D para **Copiar** o **Cortar**. El elemento entra en el portapapeles. Navega a cualquier otro tablero y haz clic derecho → **Pegar** para colocarlo con el ghost visual.

Con algo en el portapapeles, haz clic derecho sobre una pared en el 3D para **ir a su tablero** o **crear un tablero nuevo** para esa cara. Si hay algo en el portapapeles, aparece la opción de pegar directamente al navegar.

---

## Compartir

> 📷 **IMAGEN AQUÍ: modal de "Compartir proyecto" con el link y la opción de correo**

Las funciones de compartir están disponibles en el **modo servidor** (Tableau instalado en un servidor con `TABLEAU_AUTH=true`).

### Compartir un proyecto

Haz clic en el icono de compartir (**⇄**) en la barra superior o en el panel lateral junto al nombre del proyecto.

El link generado da acceso de **solo lectura** al proyecto: el visitante puede navegar todos los tableros (excepto los marcados como privados) y ver las fotos, pero no puede editar nada.

Opciones:
- **Copiar enlace** — para enviarlo manualmente
- **Enviar por correo** — introduce un email y envía la invitación
- **Permitir comentarios** — los visitantes podrán enviar comentarios para que los moderes

### Compartir una sala (vista 3D)

> 📷 **IMAGEN AQUÍ: lo que ve el invitado al abrir el link de sala — vista 3D limpia sin interfaz**

Desde el panel lateral, junto al nombre de la sala, o desde dentro de la sala, haz clic en el botón de compartir sala.

El link generado abre directamente la **vista 3D de esa sala**, sin ninguna interfaz de edición. El visitante puede orbitar, hacer zoom y usar el modo paseo. No tiene acceso a otros tableros ni al resto del proyecto.

- **Permitir comentarios** — el visitante puede comentar la sala desde la barra de controles 3D

### Gestionar invitaciones

Haz clic en el icono de invitaciones activas para ver todos los links generados (de proyecto y de sala), con fecha de creación y email del destinatario si se envió por correo. Desde ahí puedes **revocar** cualquier link.

---

## Ajustes

Haz clic en el icono ⚙ de la barra superior para abrir el modal de Ajustes.

### General

- **Tema** — Oscuro · Ámbar, Claro · Natural, Oscuro · Frío, Alto Contraste, Claro · Frío
- **Idioma** — Español, English
- **Biblioteca** — Vista previa al pasar el ratón (solo propietario)
- **Guías de inicio** — Reiniciar las guías de primer arranque

### Proyecto

Configuración específica del proyecto activo:

- Nombre y notas del proyecto
- **Valores por defecto para tableros nuevos** — unidades, DPI, marco por defecto, formato y calidad de exportación. Estos valores se guardan con el proyecto y viajan con el ZIP de exportación.
- **Compartir** (modo servidor) — estado del link de compartir, generar o revocar

### Cuenta (modo servidor)

Haz clic en el **avatar** (botón circular con tu inicial en la barra superior) para gestionar tu cuenta:

- Uso de almacenamiento
- Cambiar contraseña
- Panel de administración (solo admins)
- Cerrar sesión

---

## Atajos de teclado

Pulsa **F1** o el botón **?** en la barra superior para ver el panel completo de atajos. Los más frecuentes:

### Canvas

| Atajo | Acción |
|---|---|
| **Ctrl + Z** | Deshacer |
| **Ctrl + Mayús + Z** / **Ctrl + Y** | Rehacer |
| **Ctrl + C** | Copiar |
| **Ctrl + X** | Cortar |
| **Ctrl + V** | Pegar con ghost |
| **Ctrl + D** | Duplicar |
| **Ctrl + A** | Seleccionar todo |
| **Supr** / **Retroceso** | Eliminar selección |
| **Flechas** | Mover 1 px |
| **Mayús + Flechas** | Mover 10 px |
| **Shift + arrastrar** | Mover en eje H o V |
| **Ctrl + rueda** | Zoom |
| **Ctrl + 0** | Ajustar vista |
| **Espacio + arrastrar** | Pan (desplazar canvas) |

### Biblioteca

| Atajo | Acción |
|---|---|
| **X** | Rechazar foto |
| **U** | Recuperar foto rechazada |
| **0 – 5** | Asignar valoración |
| **Ctrl + clic** | Selección múltiple |
| **Shift + clic** | Selección por rango |

### Navegación

| Atajo | Acción |
|---|---|
| **Ctrl + K** | Búsqueda global |
| **F1** | Panel de atajos |
| **R** | Ir al plano de sala |
| **Shift + R** | Ir a la vista 3D |
| **ESC** | Cancelar / salir de presentación |

### Vista 3D (modo paseo)

| Atajo | Acción |
|---|---|
| **W / ↑** | Avanzar |
| **S / ↓** | Retroceder |
| **A / ←** | Girar izquierda |
| **D / →** | Girar derecha |

---

## Actualizaciones

Cuando hay una nueva versión, aparece un aviso en la barra superior. Descarga el instalador desde el enlace y ejecútalo — en Windows reemplaza la instalación anterior automáticamente.

---

## Cerrar la aplicación

Cierra la pestaña del navegador. En modo local, el servidor detecta el cierre y se apaga automáticamente. En modo servidor, el proceso lo gestiona el servidor y permanece activo.
