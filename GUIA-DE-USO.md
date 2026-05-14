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

Haz clic en **+ Subir** en la cabecera de la librería para seleccionar archivos individuales, o en **+ Carpeta** para importar todas las imágenes de una carpeta de golpe. También puedes arrastrar archivos de imagen directamente al canvas. Las fotos se redimensionan automáticamente a un máximo de 1800 px y se guardan en JPEG.

### Ordenación y filtros

| Control | Efecto |
|---|---|
| **⇅** | Ordenar por fecha de importación (predeterminado) o nombre A→Z |
| Filtro **Sin colocar** | Mostrar solo las fotos que no están en ningún tablero |
| **→** (al pasar el ratón) | Copiar la foto a otro proyecto sin moverla del proyecto actual |

### Panel de información

Pasa el ratón sobre una foto en la librería para ver su nombre, dimensiones originales, tamaño de archivo, tamaño físico (si hay DPI configurado) y en qué tableros aparece.

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
| **↑** | Traer al frente (subir orden Z) |
| **▣** | Ajustar grosor del marco |
| **🔒** | Bloquear / desbloquear (evita movimientos accidentales) |
| **×** | Eliminar del tablero |
| Barra de etiqueta (debajo de la foto) | Clic para editar el texto |

Las fotos bloqueadas muestran un icono de candado. Mientras están bloqueadas puedes seguir editando su etiqueta y su marco.

### Etiquetas

Al hacer clic en la barra de etiqueta se abre un editor emergente que admite varias líneas. El tamaño de la ventana se recuerda por foto. Pulsa **Guardar** para confirmar o **×** para descartar.

### Marcos

El botón **▣** abre un panel para establecer el grosor del marco en la unidad configurada del tablero. La etiqueta y el tooltip de dimensión muestran el tamaño total incluyendo el marco.

---

## Multiselección y alineación

Haz clic y arrastra sobre el canvas vacío para seleccionar varios elementos con un rectángulo lasso. Aparece una barra de selección en la parte superior:

| Botón | Acción |
|---|---|
| Alinear bordes izquierdos / derechos | Con ≥ 2 elementos |
| Alinear bordes superiores / inferiores | Con ≥ 2 elementos |
| Centrar horizontalmente / verticalmente | Con ≥ 2 elementos |
| Distribuir horizontalmente / verticalmente | Con ≥ 3 elementos |
| Igualar ancho al anclaje | El anclaje es el primer elemento seleccionado (contorno sólido) |
| **⬇** | Exportar selección como JPEG (disponible con ≥ 1 elemento) |
| **⊓** | Agrupar los elementos seleccionados (≥ 2) |
| **⊔** | Desagrupar (visible cuando algún elemento del grupo está seleccionado) |
| Deseleccionar | |

---

## Notas flotantes

Haz clic en **+ Nota** en la barra superior para añadir una nota de texto libre al canvas. Las notas se comportan como fotos — se pueden mover, redimensionar y bloquear.

- **Título y cuerpo** — escribe directamente en la nota
- **Color** — el botón **■** abre un selector con 6 colores de fondo (amarillo, verde, azul, rosa, morado, naranja) más el predeterminado
- **Enlace** — asigna una URL para mostrar una vista previa del enlace (título, dominio, favicon)
- **Incluir en informe** — activa o desactiva el botón 📄 para incluir o excluir la nota del informe del proyecto

---

## Cuadrícula y ajuste

| Botón | Efecto |
|---|---|
| **Cuadrícula** | Mostrar / ocultar la cuadrícula de alineación |
| **Ajustar** | Activar / desactivar el ajuste a cuadrícula al mover elementos |

El selector de tamaño de cuadrícula (junto a Ajustar) ofrece tamaño automático o valores específicos en mm, cm o px según las unidades configuradas en el tablero.

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

## Informe del proyecto

Haz clic en **≡ Informe** en la barra superior para abrir el informe del proyecto. Incluye:

- Una vista previa de cada tablero con las fotos en sus posiciones reales
- Una tabla de todas las fotos con dimensiones, tamaño físico (si hay DPI configurado) y etiqueta
- Notas marcadas para inclusión (icono 📄)
- Enlaces de las notas como hipervínculos clicables

Haz clic en **⎙ Imprimir / Guardar PDF** para imprimir o exportar como PDF.

---

## Exportar un tablero

Haz clic en **⬇ Exportar JPEG** en la barra superior para descargar el tablero activo como imagen JPEG.

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
