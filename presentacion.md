# Guión de presentación — Tableau v1.9.1

---

## BLOQUE 1 — Introducción (≈ 2 min)

**[PANTALLA: logotipo / pantalla de inicio del programa]**

Tableau es una herramienta de composición visual pensada para fotógrafos. Funciona completamente en local, sin necesidad de cuenta ni conexión a internet. Todo queda guardado en tu propio equipo.

La idea es simple: tienes una biblioteca de fotos, y puedes distribuirlas en uno o varios tableros para ver cómo quedan juntas. Pero además puedes simular exactamente cómo se verán colgadas en una sala real, en paredes con medidas reales, y caminar por esa sala en tres dimensiones.

Lo abrimos desde el acceso directo del escritorio. El navegador se conecta automáticamente al servidor local y ya estamos dentro.

---

## BLOQUE 2 — Proyectos (≈ 2 min)

**[PANTALLA: panel lateral izquierdo con la lista de proyectos]**

Todo se organiza en proyectos. Cada proyecto tiene su propia biblioteca de fotos y sus propios tableros. Para crear uno nuevo pulsamos **+ Proyecto**, le damos nombre y listo.

**[PANTALLA: crear proyecto, nombrar "Exposición Primavera"]**

Si en algún momento necesitamos llevarnos el proyecto a otro equipo o hacer una copia de seguridad, el botón de descarga junto al nombre del proyecto exporta un ZIP con todas las fotos y todos los datos. Y para importar uno, el botón **⬆ Importar** del panel lateral lo restaura completo. Si ya existe, pregunta si importar como copia nueva o reemplazar el existente.

---

## BLOQUE 3 — Biblioteca de fotos (≈ 4 min)

**[PANTALLA: biblioteca en la parte inferior de la pantalla]**

La biblioteca es donde viven todas las fotos del proyecto. Para subir fotos tenemos el botón **↑ Subir** — admite archivos individuales o carpetas enteras de golpe. También podemos arrastrar directamente desde el explorador de archivos sobre la biblioteca.

**[PANTALLA: arrastrar una carpeta sobre la biblioteca]**

Al importar, Tableau lee los metadatos EXIF de cada foto: cámara, objetivo, distancia focal, apertura, velocidad y fecha de toma. Si pasamos el ratón sobre una miniatura y abrimos el panel de información lateral, lo vemos todo de un vistazo.

**[PANTALLA: hover en miniatura → panel lateral con datos EXIF]**

Las miniaturas se pueden ajustar de tamaño con el slider. Si la biblioteca crece mucho podemos crear **secciones** — grupos colapsables para organizar las fotos por tema, fecha o lo que necesitemos. El botón **+ Sección** en la cabecera de la biblioteca las crea, y con clic derecho sobre cualquier foto la movemos a la sección que queramos.

**[PANTALLA: crear una sección, mover fotos a ella]**

Para buscar una foto concreta tenemos el campo de búsqueda por nombre. Y si queremos ver solo las fotos que todavía no hemos colocado en ningún tablero, activamos el filtro **Sin colocar** — muy útil cuando el proyecto tiene muchas fotos y queremos asegurarnos de no dejar ninguna fuera.

**[PANTALLA: activar filtro "Sin colocar"]**

Cada foto tiene un sistema de valoración de 1 a 5 estrellas y se puede marcar como rechazada con el botón ✕. Las rechazadas se ocultan por defecto pero se pueden filtrar para revisarlas. También podemos asignar etiquetas de texto libre a cualquier foto y filtrar por varias a la vez.

Para ordenar la biblioteca hay cuatro criterios: fecha de importación, nombre, **tono dominante** — que agrupa las fotos por su color medio de izquierda a derecha del espectro — y **luminosidad**, de más oscura a más clara.

**[PANTALLA: ordenar por tono, ver cómo se agrupan visualmente las fotos]**

---

## BLOQUE 4 — Tableros (≈ 5 min)

**[PANTALLA: panel lateral → + Tablero]**

Un tablero es el lienzo donde componemos. Al crearlo podemos empezar desde cero o aplicar una **plantilla** guardada — más adelante veremos cómo crearlas.

Hay dos tipos de tablero:
- **Variable**: el lienzo crece con el contenido, sin límite de tamaño.
- **Fijo**: le decimos exactamente cuánto mide — por ejemplo 120 × 80 cm a 300 ppp. El tablero representa entonces el tamaño físico real de la obra.

**[PANTALLA: ⚙ Config del tablero, mostrar opciones de tamaño fijo]**

Para colocar fotos las arrastramos desde la biblioteca al canvas. Si arrastramos varias a la vez, vemos la pila animada con contador. Al soltarlas aparecen distribuidas en diagonal.

**[PANTALLA: arrastrar 3 fotos al canvas]**

Las fotos se mueven, se redimensionan desde la esquina inferior derecha, y se rotan. El botón **↻** de la barra superior gira en pasos de 90°. Para rotación libre, arrastramos el punto circular que aparece sobre la foto — Shift encaja en múltiplos de 15°.

**[PANTALLA: rotar una foto 90°, luego rotación libre]**

Al mover una foto con el imán activado, guías naranjas muestran cuándo estamos alineados con el borde o el centro de otra foto. Y si la separación entre dos fotos coincide con la que hay entre otras dos del tablero, aparecen guías cyan que hacen snap automático a esa misma separación — así conseguimos distribuciones homogéneas sin medir a mano.

**[PANTALLA: mover foto con guías de alineación y separación igual]**

En tableros de tamaño fijo, al arrastrar una foto aparecen además líneas de borde que muestran la distancia a cada lado del tablero. Cuando la foto está centrada horizontal o verticalmente, la guía se vuelve ámbar. El panel de la esquina inferior izquierda actualiza esas distancias en tiempo real.

**[PANTALLA: tablero fijo, arrastrar foto y ver guías de borde + panel de distancias]**

---

## BLOQUE 5 — Marco y acabados (≈ 3 min)

**[PANTALLA: clic derecho sobre una foto → Marco]**

Cada foto puede tener su propio acabado. El panel de marco tiene dos capas: el **paspartú** (color y grosor) y la **moldura** (color y grosor). Podemos definir un marco por defecto en la configuración del tablero que se aplica a cada foto nueva al colocarla.

**[PANTALLA: abrir panel de marco, añadir paspartú blanco y moldura marrón]**

Las dimensiones que muestra el programa incluyen el marco. Si la foto mide 40 × 30 cm y tiene 5 cm de paspartú por lado, el tamaño total que se muestra es 50 × 40 cm — exactamente lo que irá al enmarcador.

Para aplicar el mismo acabado a varias fotos sin configurar una por una, clic derecho → **Copiar estilo de marco**. El cursor cambia a modo pintor — haz clic sobre cada foto a la que quieras aplicar ese mismo acabado y Tableau lo replica instantáneamente.

**[PANTALLA: copiar estilo de marco y aplicarlo a otras fotos]**

---

## BLOQUE 6 — Notas y textos (≈ 3 min)

**[PANTALLA: clic derecho en el canvas → menú contextual]**

Con clic derecho en el canvas accedemos a dos tipos de elementos adicionales.

Las **notas** son post-its digitales: tienen título, texto, un campo de enlace y seis colores disponibles. Son herramientas de trabajo interno — visibles en el tablero pero que no aparecen en la presentación final.

**[PANTALLA: crear una nota amarilla con texto]**

Los **textos libres** sí son parte de la composición. Tienen cuatro tipografías — Serif, Sans, Display y Mono — con tamaño libre desde 8 hasta 999 px, negrita, cursiva, alineación y color personalizables.

**[PANTALLA: crear un texto libre, cambiar tipografía y tamaño]**

Ambos elementos se mueven, redimensionan y rotan igual que las fotos, y participan en el snap con las guías de alineación.

---

## BLOQUE 7 — Zonas y mosaico (≈ 4 min)

**[PANTALLA: clic derecho en canvas → Zona]**

Las **zonas** son divisores visuales del tablero. Al crear una zona, todo lo que esté dentro de sus límites pertenece a ella — si movemos la zona, arrastra las fotos, notas y textos que contiene. Se pueden redimensionar desde cualquier borde o esquina.

**[PANTALLA: crear zona, mover con todo su contenido]**

Las zonas tienen seis colores. Si la distribución de una zona nos gusta y queremos convertirla en un tablero independiente, el botón **⊞** de la zona la convierte en tablero nuevo con todo su contenido.

**[PANTALLA: convertir zona en tablero → aparece en panel lateral]**

El **mosaico** es otra forma de organizar fotos. Seleccionamos varias en la biblioteca y pulsamos **⊞ Cuadrícula** en la barra de selección. Un diálogo pide el número de columnas y la separación. En tableros fijos, Tableau calcula automáticamente el tamaño de celda y te dice cuántas fotos caben. En variables, centra la cuadrícula en la vista.

**[PANTALLA: seleccionar 6 fotos → ⊞ Cuadrícula → 3 columnas]**

Una vez creado el mosaico, podemos reordenar las celdas arrastrándolas entre sí. Con clic derecho sobre una celda podemos quitarla del mosaico o reemplazarla.

---

## BLOQUE 8 — Organización avanzada del canvas (≈ 3 min)

**[PANTALLA: canvas con varias fotos]**

Para seleccionar varios elementos sin hacer clic uno a uno, arrastramos sobre el canvas vacío — el lazo selecciona todo lo que toque. Con Shift+clic agregamos o quitamos elementos de la selección.

**[PANTALLA: selección lasso, luego herramientas de alineación]**

Con una selección múltiple activa, la barra superior muestra herramientas de alineación y distribución: alinear por izquierda, centro, derecha, arriba, medio, abajo; distribuir con espacio igual horizontal o vertical. También podemos intercambiar la posición de dos fotos con ⇄.

Los elementos se pueden **agrupar** con ⊓ — al hacer clic en cualquier miembro del grupo se selecciona todo. Para desagrupar, ⊔.

**[PANTALLA: agrupar 3 fotos, moverlas juntas]**

El botón **🔒** bloquea un elemento para que no se mueva accidentalmente. El candado aparece en la esquina y los elementos bloqueados quedan excluidos de todas las operaciones de selección y alineación.

Ctrl+Z deshace los cambios. Hay hasta 50 pasos de historial por tablero, y el historial se conserva aunque cambiemos de tablero.

El botón **⏱** guarda versiones completas del estado del tablero. Podemos volver a cualquier punto anterior sin perder la versión actual.

**[PANTALLA: guardar versión → lista de versiones con fecha y número de elementos]**

---

## BLOQUE 9 — Plano de sala (≈ 5 min)

**[PANTALLA: panel lateral → + Sala → plano 2D]**

El plano de sala es donde definimos el espacio expositivo real. Dibujamos el perímetro haciendo clic en el canvas para colocar vértices — cada segmento es una pared. Cuando cerramos el polígono, Tableau detecta el cierre automáticamente.

**[PANTALLA: dibujar una sala rectangular, ~10 × 8 m]**

Al hacer clic derecho en el plano podemos añadir **columnas** — pilares con sus propias dimensiones — y **bloques sólidos**, que representan elementos físicos en la sala: pedestales, vitrinas, mamparas o cualquier obstáculo.

**[PANTALLA: añadir una columna en el centro; añadir un bloque sólido]**

Cada pared tiene dos caras independientes: cara A (interior) y cara B (exterior). Con los botones A/B de la barra lateral derecha vinculamos cada cara a un tablero. Al pasar el ratón sobre el botón, la cara correspondiente se ilumina en rojo o azul en el plano para que no haya confusión.

**[PANTALLA: hover sobre botón A → pared se ilumina en rojo]**

Al crear el tablero de una pared, Tableau calcula automáticamente su tamaño físico y el DPI óptimo. Si luego modificamos la longitud de la pared, aparece un aviso de desincronización con el botón **Sincronizar** para actualizar el tablero.

Los bloques también tienen caras — Norte, Sur, Este, Oeste y Superior — cada una con su propio tablero. Esto permite componer sobre todos los lados de, por ejemplo, un pedestal o una mampara doble cara.

**[PANTALLA: bloque sólido → panel lateral → crear tablero para cara Norte y Superior]**

---

## BLOQUE 10 — Vista 3D y modo paseo (≈ 5 min)

**[PANTALLA: botón de vista 3D o atajo Shift+R]**

Shift+R activa la vista tridimensional de la sala. Tableau construye las paredes, el suelo, las columnas y los bloques en 3D, y proyecta sobre cada pared las fotos del tablero vinculado — con sus marcos de paspartú y moldura incluidos.

**[PANTALLA: vista 3D de la sala con fotos en paredes]**

Podemos orbitar con el ratón o activar el **modo paseo** con el botón correspondiente de la barra. En modo paseo, las flechas ↑↓ avanzan y retroceden, ←→ giran la cámara. Hacemos clic en el canvas para capturar el ratón y girar libremente sin límite de borde.

**[PANTALLA: activar modo paseo, caminar por la sala]**

Al hacer clic sobre una pared o una foto durante el paseo, la cámara se posiciona perpendicular a ella a 200 cm — ideal para evaluar una obra a distancia de lectura.

**[PANTALLA: clic en una foto → cámara se posiciona frente a ella]**

El botón de **figura de escala** añade una silueta humana de 175 cm que podemos arrastrar por el suelo de la sala. Sirve para verificar que las alturas de colgado son correctas.

**[PANTALLA: activar figura → arrastrarla junto a las obras]**

Por último, el botón **Capturar** guarda la vista actual como foto en la biblioteca del proyecto — útil para documentar la maqueta virtual o compartirla.

---

## BLOQUE 11 — Presentación e informe (≈ 3 min)

**[PANTALLA: botón presentación en barra superior]**

El modo presentación oculta toda la interfaz y muestra solo el tablero a pantalla completa. Las flechas laterales o los puntos inferiores navegan entre tableros sin salir del modo.

Si el tablero tiene zonas definidas, el botón **Ver zonas** recompone las fotos de cada zona en pantalla completa una al lado de la otra, con navegación entre zonas con ‹ ›.

En cualquier momento de la presentación podemos hacer clic en dos fotos para intercambiarlas y ver variantes de composición en tiempo real.

**[PANTALLA: presentación → intercambiar dos fotos con clic]**

Para documentar el proyecto, la **memoria** — botón 📄 de la barra superior — genera un informe con la miniatura de cada tablero, la lista de fotos con sus dimensiones físicas (incluyendo marco), valoración y etiquetas asignadas, y las notas marcadas como internas. El botón **Imprimir / PDF** genera el documento listo para entregar al cliente o al enmarcador.

**[PANTALLA: memoria del proyecto con miniaturas y tabla de fotos]**

---

## BLOQUE 12 — Cierre (≈ 1 min)

**[PANTALLA: pantalla de inicio con varios proyectos]**

Tableau corre en local — no hay suscripción, no hay nube, no hay cuenta que crear. Está disponible para Windows, Mac y Linux. Cuando cierras el navegador el servidor se apaga solo; cuando lo vuelves a abrir, retoma exactamente donde lo dejaste.

El programa se actualiza automáticamente: al arrancar comprueba si hay una versión nueva y te avisa en la interfaz.

---

*Fin del guión — duración estimada: 37–40 minutos con demos en directo.*
