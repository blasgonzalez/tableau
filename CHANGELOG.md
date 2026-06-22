# Changelog

## [1.25.5] — 2026-06-22

### Cambiado
- **Panel lateral de paredes — Fase C: lista limpia:** cada pared se reduce a una fila con nombre (doble clic para renombrar), longitud, contador de tableros (▣ N, solo si hay alguno) y un botón `→` que abre la vista frontal. Se retiran los botones A/B, `+`, `▶` y el indicador `⚠` inline por cara; toda la gestión de tableros vive en la vista frontal.
- **Menú contextual de pared en el plano (clic derecho) — soporte multi-tablero:** cada sección de cara (A / B) ahora muestra «Tableros (N) →» para abrir la vista frontal en esa cara cuando ya hay tableros, y siempre ofrece «+ Tablero» para añadir otro (la lógica de offset acumulado ya existía en `createRoomBoardSide`). Antes solo aparecía «Crear» cuando la cara estaba vacía y «Ver tablero» cuando tenía uno, sin opción de añadir un segundo.

## [1.25.4] — 2026-06-22

### Nuevo
- **Vista frontal — redimensionar tableros vacíos:** los tableros sin contenido (sin fotos, textos ni grids) muestran 8 handles de redimensionado al pasar el cursor: cuadrados blancos en las esquinas y tiras transparentes en los bordes. Arrastrar un handle cambia `fixedW`/`fixedH` en tiempo real con las reglas de ancla correctas (el borde opuesto permanece fijo) y respeta los límites de la pared (mínimo 5 cm, sin salir de los bordes, sin sobrepasar suelo/techo). Al soltar se persiste en un único paso: patch a `fixedW`/`fixedH` del tablero + `saveRoom` con el nuevo `offset`/`hangY` si el ancla los modificó. Snap con guías naranjas a bordes de pared, suelo, techo y bordes de otros tableros de la misma cara. Los tableros con contenido no muestran handles de redimensionado; el arrastre de cuerpo (mover) sigue funcionando igual.

## [1.25.3] — 2026-06-22

### Cambiado
- **Vista frontal — menú contextual por tablero (clic derecho):** las acciones sobre cada tablero (antes el botón `×` flotante, luego la barra en cabecera) se han movido a un menú contextual de clic derecho. Clic derecho sobre cualquier tablero abre el menú con dos opciones: «Editar en tablero» (equivalente al doble clic) y «Desvincular de la pared» (elimina el vínculo sin borrar el tablero). El menú se clamp al viewport y se cierra al hacer clic fuera o iniciar un arrastre. El arrastre (botón izquierdo) y el doble clic siguen funcionando igual. El tablero bajo el cursor recibe un outline más brillante como indicador visual.
- **Vista frontal — eliminado aviso de desincronía:** el indicador `⚠` y el borde naranja que marcaban tableros cuyo `fixedH` no coincidía con el alto de la pared han sido eliminados de la vista frontal. Con varios tableros de tamaños distintos por pared esta condición es la norma y no un error, así que el aviso resultaba confuso. (El aviso en el panel lateral permanece sin cambios hasta la Fase C.)

## [1.25.2] — 2026-06-22

### Nuevo
- **Vista frontal — Fase B: gestión de tableros:** la vista frontal de pared gana capacidades de gestión que antes solo tenía el panel lateral.
  - **Botón "+":** añade un tablero nuevo a la cara activa (A o B, según el toggle) directamente desde la vista frontal. El tablero se crea con las dimensiones de la pared y aparece en la superficie sin cerrar el modal.
  - **Desvincular (×):** al pasar el cursor sobre un tablero aparece un botón `×` en la esquina superior derecha. Al pulsarlo, el tablero se desvincula de esa cara (vuelve al árbol principal) sin borrarlo, y desaparece de la superficie en el mismo acto.
  - **Aviso de desincronía:** los tableros cuya altura (`fixedH`) no coincide con el alto de la pared muestran un borde naranja y un icono `⚠` con tooltip explicativo.

## [1.25.1] — 2026-06-22

### Nuevo
- **Vista frontal de pared — doble clic para editar:** doble clic sobre un tablero en la vista frontal abre directamente su canvas de edición (`setBid` + `setRoomView('board')` + cierre del modal), sin tener que cerrar la vista e ir al árbol.

### Corregido
- **Vista frontal — clic accidental ya no descoloca ni persiste:** el arrastre de tableros ahora exige un movimiento real (>4 px) para considerarse arrastre. Un clic simple o un doble clic sin mover ya no dispara un `saveRoom` innecesario ni reposiciona el tablero. El arrastre de Fase 3c (mover + snap + persistir) se mantiene igual.

## [1.25.0] — 2026-06-21

### Nuevo
- **Hover bidireccional entre árbol, plano 2D y vista 3D:** un único estado `hoveredBoardId` conecta las tres superficies.
  - **Árbol lateral:** hover sobre la fila de un tablero resalta la cara donde está ese tablero en el plano SVG: halo rojo si cara A, azul si cara B (reutilizando el lenguaje visual existente de `hovSide`). La fila recibe clase `hov` (borde izquierdo `--acc`) que no pisa el resaltado `active` del tablero abierto (`.hov:not(.active)`).
  - **Plano 2D → árbol:** al entrar en una pared del SVG se activa `hoveredBoardId` con el primer tablero vinculado, resaltando su fila en el árbol.
  - **Vista 3D → árbol y plano:** `onHoverMM` compara con `hoveredBoardIdRef` antes de llamar al setter, evitando re-renders en cada `mousemove`. Al salir de la vista 3D, `_hoverCleanup` limpia `hoveredBoardId`.
  - **Derivación de `hovSide` en el SVG:** extendida para incluir `hoveredBoardId` (cara A si el tablero está en `boardsA`, cara B si en `boardsB`). El `hov` de naranja-pared no incluye `hoveredBoardId` — el hover desde el árbol solo muestra el halo de cara, no el trazo naranja.

## [1.24.0] — 2026-06-21

### Nuevo
- **Salas — Vista frontal de pared (Fase 3):** doble clic sobre una pared en el plano SVG o en la vista 3D abre un modal con la superficie a escala real. Muestra el contenido de cada tablero vinculado (fotos, mosaicos, texto) posicionado por `offset` y `hangY`. Toggle A/B para alternar caras. Solo para el autor.
- **Arrastre de tableros en la vista frontal:** cada tablero es arrastrable con pointer capture. Snap con guías naranjas a altura estándar (150 cm), centros de pared y bordes/centros de otros tableros. Clamp vertical y horizontal para mantener el tablero dentro de la pared. Persistencia inmediata al soltar.
- **Acceso desde la vista 3D:** doble clic sobre el cuerpo de una pared (sin obra encima) abre la vista frontal con la cara correcta (A o B según el lado clicado).
- **Posición vertical por tablero (`hangY`):** cada entrada de `boardsA`/`boardsB` incluye `hangY` (cm desde el suelo al centro del tablero). Migración perezosa: salas antiguas reciben `hangY = 150` en el primer `loadRooms`.

### Corregido
- **Cara B — posición incorrecta en 3D y en vista frontal:** los tableros de cara B aparecían en el lado contrario al esperado. Fix en el renderer 3D (`ix` medido desde v2 para cara B) y eliminación del espejado redundante en la vista frontal.
- **Vista frontal — arrastre: clamp horizontal** impedía arrastrar tableros fuera de los bordes de la pared.
- **Vista frontal — grids, textos, colores y overflow** corregidos (mosaicos expandidos, fuente y alineación de texto, colores fieles al 3D, overflow oculto).

---

## [1.23.6-fase3c-r2] — 2026-06-21

### Corregido
- **Cara B — posición incorrecta en 3D y en vista frontal:** los tableros de cara B aparecían en el lado opuesto al esperado tanto en el renderer 3D como en la vista frontal. Causa: la fórmula `ix = startOffset + offset + itemFrac·fW` era idéntica para cara A y cara B, sin tener en cuenta que el espectador de cara B mira desde el lado contrario de la pared. Fix en tres puntos:
  1. **Renderer 3D:** para cara B (`sideSign === -1`) se usa `ix = startOffset + wallFaceLen − offset − itemFrac·fW`, que mide el offset desde el extremo v2 (izquierda visual del espectador de cara B) en lugar de v1. Los ítems internos del tablero también se proyectan en el orden correcto.
  2. **Vista frontal — dibujo:** eliminado el espejado `(wallLen − offset − fWcm)·scale`; ahora se usa `offset·scale` para ambas caras. El espejado correcto vive en el 3D.
  3. **Vista frontal — arrastre:** eliminada la inversión `startOffset − dxCm` para cara B; ahora se usa `startOffset + dxCm` para ambas caras, consistente con la nueva convención.
- Eliminado el `console.log('[WFV B]', ...)` de diagnóstico temporal añadido en r1.

## [1.23.6-fase3c-r1] — 2026-06-21

### Corregido
- **Vista frontal — arrastre: clamp horizontal:** un tablero podía arrastrarse fuera de los límites de la pared (offset < 0 u offset > wallLen − fWcm) quedando flotando fuera de la superficie. Se añade clamp `offset ∈ [0, wallLen − fWcm]`. Los solapamientos entre tableros siguen siendo libres (no se bloquean); el clamp solo impide que el tablero salga de los bordes de la pared. Se aplica igual en cara A y cara B (sobre el offset interno).
- **Vista frontal — diagnóstico cara B (en curso):** añadido `console.log('[WFV B]', ...)` temporal en `onPointerMove` para reportar `dxCm`, `startOffset`, `rawOffset` y `newOffset` mientras se investiga el Bug 1 (arrastre invertido en cara B). Se retirará en el commit siguiente.

## [1.23.6-fase3c] — 2026-06-21

### Nuevo
- **Salas — arrastre de tableros en la vista frontal de pared (Fase 3c):** cada tablero de la vista frontal es ahora arrastrable para ajustar su posición horizontal (`offset`) y vertical (`hangY`). Solo para el autor (la vista frontal ya es solo del autor).
  - **Arrastre en vivo:** el tablero sigue al cursor; al soltar se persiste un único `PUT` de la sala. No hay peticiones durante el movimiento.
  - **Pointer capture:** `setPointerCapture` sobre el `div` del tablero en `pointerdown`, lo que evita perder el arrastre si el cursor sale del tablero o del modal.
  - **Snap con guías naranjas** a: altura de visión estándar (centro a 150 cm del suelo), centro vertical de la pared, centro horizontal de la pared, y bordes/centros de los demás tableros de la misma cara. Umbral: 8 px de pantalla. Las guías se muestran como líneas de 1 px del color de acento (`var(--acc)`) dentro de la superficie.
  - **Clamp vertical:** el tablero no puede salir por arriba ni por abajo de la pared (`hangY` ∈ `[fHcm/2, ceilH − fHcm/2]`). Horizontalmente no hay límite (los avisos de desbordamiento son Fase 4).
  - **Cara B:** mover a la derecha en la vista frontal de la cara B desplaza el tablero a la derecha tal como se ve en la vista 3D mirando esa cara (el espejado de `offset` se aplica correctamente en ambas direcciones).
  - **Persistencia completa:** al soltar, se actualiza `boardsA`/`boardsB` de la entrada correspondiente (`offset` y `hangY`) y se llama a `saveRoom`. El `wallFrontView` interno también se actualiza para que el modal refleje la posición guardada sin necesidad de reabrirlo.
  - **Verificación 3D:** mover un tablero en la vista frontal y reabrirla, o cambiar a la vista 3D, muestra el tablero en la posición nueva.

## [1.23.6-fase3b-r3] — 2026-06-21

### Nuevo
- **Salas — entrada a vista frontal de pared desde la vista 3D:** doble clic sobre el cuerpo de una pared en la vista 3D (zona sin obra encima) abre la vista frontal de esa pared, con la cara correcta (A o B según el lado clicado). Solo para el autor (`roomShareMode = false`). El visitante no tiene acceso.
  - El doble clic sobre una foto/obra en 3D mantiene el comportamiento actual (abre la vista de obra): `itemMeshes` tiene prioridad.
  - Usa los planos invisibles de `wallMeshes` (ya existentes para el menú contextual), que tienen `userData.wallId` y `userData.face`. El cuerpo sólido `wMesh` no se toca.
  - `openWallFrontView` acepta ahora un segundo argumento `initialFace` opcional; si se omite, mantiene la heurística anterior (cara A salvo que solo haya tablero en B).

## [1.23.6-fase3b-r2] — 2026-06-21

### Corregido
- **Vista frontal de pared — grids:** los ítems tipo `grid` (mosaico de fotos en celdas) ahora se expanden con `calcGridLayout` y se renderizan foto por foto. Antes se ignoraban.
- **Vista frontal de pared — textos:** los ítems `text` ahora muestran `item.text` (no `item.label`), con la fuente correcta (`fontFamily` via `TEXT_FONTS`), `fontWeight`, `fontStyle`, `textAlign` y `textColor`, escalados al tamaño del tablero pantalla. Antes mostraban un placeholder genérico con tamaño de fuente proporcional al alto.
- **Vista frontal de pared — toggle A/B tapado:** el `<div>` de controles recibe `position:relative; zIndex:2`; la superficie añade `overflow:hidden`. Si un tablero sobresalía por encima del borde superior de la superficie (bordes negativos en `boardT`), el desbordamiento invadía el área de controles. Ambas correcciones eliminan el problema.
- **Vista frontal de pared — tamaño de texto UI fijo:** el label del nombre del tablero usaba `fontSize: Math.max(7, boardH * 0.055)`, que escala con la altura del tablero en pantalla. Ahora usa `fontSize: 9` fijo, independiente del zoom de la superficie.
- **Vista frontal de pared — colores fieles al 3D:** el color de fallback de la pared era `'#c8bdb0'`; el renderer 3D usa `'#d0c8bc'`. Corregido. El fondo de cada tablero era `'#f0ebe4'`; el canvas usa `'#fff'` para tableros fijos. Corregido.

## [1.23.6-fase3b] — 2026-06-21

### Nuevo
- **Salas — Vista frontal de pared (Fase 3b):** doble clic sobre una pared en el plano SVG abre un modal de visualización (solo owner). Muestra la superficie de la pared a escala (largo × altura de techo) con el color de fondo de la pared. Cada tablero vinculado aparece como un rectángulo posicionado por su `offset` horizontal y `hangY` vertical, con el contenido real (miniaturas de fotos, texto) escalado proporcionalmente dentro. Toggle A/B en la cabecera para alternar entre caras. Cierre con ESC o clic fuera. Solo lectura: no se puede arrastrar nada (reservado para Fase 3c). Los bloques no se tocan.

## [1.23.5-fase3a] — 2026-06-21

### Interno (sin cambio visible)
- **Salas — Fase 3a: modelo de posición vertical por tablero:** cada entrada de `boardsA`/`boardsB` pasa de `{boardId, offset}` a `{boardId, offset, hangY}`, donde `hangY` es la altura del centro del tablero sobre el suelo en cm.
  - Migración perezosa completa: `normalizeWall` siempre recorre todas las entradas (aunque la pared ya tenga `boardsA`/`boardsB`) y garantiza `hangY ?? 150` y `offset ?? 0`. Salas antiguas quedan normalizadas en el primer `loadRooms` sin necesidad de reescribir los datos.
  - `normalizeWall` actualizada en `server.js` e `index.html` (ambas copias idénticas).
  - Renderer 3D: `wallSides` propaga `hangY: e.hangY ?? 150`; el `forEach` desestructura `hangY`; `hangCenterY` deja de ser una constante fija y lee el valor de la entrada. Sala se ve idéntica a Fase 2 (todos los tableros existentes tienen `hangY = 150`).
  - Variable `hangCenterY` preparada para Fase 3b (UI de ajuste vertical por tablero).

## [1.23.4] — 2026-06-21

### Corregido
- **Salas — tableros por pared:** al vincular un tablero variable, el bounding box de la copia fija calculaba mal el alto porque usaba `item.h` almacenado (indefinido o desactualizado para fotos). El alto de cada foto se deriva ahora de la proporción `photo.h/photo.w` (o inversa si hay rotación 90°/270°), igual que hace el canvas. Además, las coordenadas de los ítems en la copia se desplazan restando el origen del bounding box, de modo que el contenido empieza en (0,0) y no queda recortado.
- **Salas — vista 3D:** el renderer estiraba el tablero verticalmente para ocupar todo el alto de la pared. Ahora usa el alto físico del tablero (`fixedH`) para escalar los ítems, y ancla el centro del tablero a 150 cm del suelo (estándar museístico). La variable `hangCenterY` está preparada para ser configurable por tablero en una fase posterior.

## [1.23.3-fase2b] — 2026-06-21

### Mejorado
- **Salas — validaciones al vincular un tablero a una pared:**
  - **Tablero ya vinculado a otra pared/cara:** en lugar de compartir el mismo tablero en dos sitios, se crea una copia (via `duplicate`) y se vincula la copia. El original queda intacto. El aviso indica en qué pared estaba ya asignado.
  - **Tablero variable:** en lugar de preguntar si ajustar a las medidas de la pared, se calcula el bounding box del contenido (ítems tipo foto/texto, excluyendo notas y zonas), se convierte a las unidades del tablero vía su DPI, se crea una copia fija con esas dimensiones y se vincula la copia. El tablero variable original queda intacto.
  - **Tablero variable vacío (sin ítems físicos):** se bloquea con aviso; no se crea copia ni se vincula.
  - **Aviso de espacio libre:** si el ancho de la copia (en cm) supera el espacio libre restante en la cara, el aviso incluye "Ocupa X cm; quedan Y cm."
  - Las copias vinculadas aparecen automáticamente anidadas bajo la sala en el árbol de tableros (vía `roomOfBoard`/`wallLinksBoard`).
  - Los tableros fijos no vinculados a ningún sitio se siguen asignando directamente, sin copia.

## [1.23.2-fase2] — 2026-06-21

### Mejorado
- **Salas — múltiples tableros por cara de pared (Fase 2):** una cara A o B puede tener ahora N tableros colocados en secuencia. Cada tablero ocupa su `fixedW` propio; los sucesivos se posicionan pegados al anterior sin hueco (`offset = ΣfixedW` de los previos).
  - Panel lateral: cada cara muestra una lista de filas (una por tablero) con botón de navegación y desvinculación individual. Botón `+` siempre visible al final de cada cara para añadir otro tablero.
  - Botón `+` / `createRoomBoardSide`: primer tablero recibe `fixedW = len` (toda la pared); tableros adicionales reciben `fixedW = len/2` como punto de partida ajustable. El nombre incluye un sufijo numérico a partir del 2.º.
  - Drag & drop: soltar un tablero en una cara lo añade a la lista en lugar de reemplazar. Skip silencioso si el mismo tablero ya está vinculado. Check de mismatch solo aplica al primer tablero de la cara.
  - Desvincular (`unlinkBoardFromWall`): elimina el tablero indicado por `boardId` y repaqueta los offsets de los restantes para que sigan pegados en secuencia.
  - Renderer 3D: eliminado el clamp `Math.min(fW, wallFaceLen)` — cada tablero renderiza su ancho fijo completo desde su offset, pudiendo salirse de la pared (avisos de solape llegarán en Fase 4).

## [1.23.1-fase1] — 2026-06-21

### Interno (sin cambio visible)
- **Renderer 3D de paredes — Fase 1:** el bucle de render itera directamente sobre los elementos de `boardsA`/`boardsB` (en lugar de un tablero fijo por cara). Cada entrada propaga su `offset` hasta el cálculo de posición horizontal (`ix`), listo para Fase 2 donde los tableros tendrán offsets no nulos. Con offset = 0 (esta fase) la sala se ve píxel a píxel idéntica.
  - `wallSides` entries ahora incluyen `offset: e.offset || 0`.
  - `ix = startOffset + offset + (item.x + item.w/2) / bPx.w * Math.min(fW, wallFaceLen - offset)`.
  - Anotaciones en código para Fase 2 (eliminar clamp `Math.min`) y Fase 3 (plano de menú contextual por segmento, hit-testing por segmento en cuerpo de pared).

## [1.23.0] — 2026-06-21

### Interno (sin cambio visible)
- **Modelo de sala — preparación para múltiples tableros por cara de pared (Fase 0):** migración del campo escalar `boardId`/`boardIdBack` en las paredes al modelo de lista `boardsA`/`boardsB` (array de `{boardId, offset}`). En esta fase cada cara sigue teniendo máximo un tablero; el comportamiento de la app no cambia.
  - Migración perezosa en servidor (`loadRooms`): las salas antiguas se normalizan en memoria al cargarse; el formato nuevo se persiste en el siguiente guardado natural.
  - Normalización defensiva en cliente: las salas recibidas de la API pasan por `normalizeRoom` antes de entrar al estado React.
  - Nuevos helpers: `normalizeWall`, `wallBoardIds`, `wallLinksBoard`, `wallSideBoard`, `normalizeRoom` (cliente y servidor).
  - Todos los puntos de lectura/escritura de paredes (`roomBoardIds`, 3D, SVG, panel lateral, menú contextual, merge de vértice, import ZIP, duplicar sala, borrar sala/vértice) actualizados al nuevo modelo.

## [1.22.11] — 2026-06-17

### Mejorado
- **Biblioteca — filtro "Sin colocar": nuevo ámbito "En este tablero":** el selector de ámbito añade una tercera opción que muestra las fotos que no están colocadas en el tablero activo (bid), aunque sí estén en otros tableros del proyecto. Solo aparece cuando hay un tablero activo.
- **Biblioteca — tooltip del filtro de orientación:** al hacer clic para cambiar el ciclo null→L→P→S→null, el div `#tt` se actualizaba al valor anterior porque el sistema de tooltips solo captura `data-tooltip` en `mouseover`. Fix: el `onClick` calcula explícitamente el próximo valor y actualiza `#tt.textContent` de forma síncrona si el tooltip está visible.

### Corregido
- **Biblioteca — fotos en mosaicos (grids) no reconocidas como colocadas:** la comprobación de si una foto estaba colocada en el tablero activo solo miraba `item.photoId` (fotos sueltas), ignorando `item.photoIds[]` de los items de tipo grid. Afectaba al badge "EN TABLEAU" en las miniaturas, al filtro "Sin colocar" en sus tres ámbitos (proyecto, sala, tablero) y a las funciones auxiliares `photoBoardNames` / `photoBoardsDetailed` / `photoBoardsWithContext`. Fix: nuevo helper `isPhotoInBoardItems` que comprueba ambos campos, aplicado en todos los puntos afectados.

## [1.22.10] — 2026-06-17

### Mejorado
- **Barras de scroll del canvas — más visibles y fáciles de usar:** las scrollbars ahora tienen 8 × 8 px (el doble de ancho/alto) con esquinas redondeadas y colores que contrastan mejor contra el fondo del tablero. Al pasar el ratón sobre el thumb cambia a un color más claro para mayor feedback visual.

### Corregido
- **Tablero variable — salto visual al mover elementos:** `normalizeItems` desplazaba todos los items a la izquierda/arriba siempre que hubiera espacio vacío (minX > 0 o minY > 0), incluso cuando todos los items estaban en coordenadas positivas. Cuando el scroll ya estaba en 0, la compensación no podía aplicarse (no se puede hacer scroll negativo) y el canvas saltaba visualmente. Fix: la normalización ahora solo actúa cuando algún item tiene coordenada negativa (minX < 0 o minY < 0) — el único caso donde realmente es necesaria para evitar que items queden fuera del área visible.
- **Tablero variable — primera foto pegada al borde izquierdo:** al añadir la primera foto a un tablero vacío de tamaño variable, `applyNormalized` desplazaba su `x` a 0 (el `minX` del array de un solo elemento era la propia `x`), ignorando la posición del cursor. Fix: se omite la normalización cuando el tablero estaba vacío (`wasEmpty`); la foto cae donde el usuario la soltó y `fitWidth()` ajusta la vista. Las fotos siguientes siguen normalizando con normalidad.
- **Vista 3D en móvil — pinch-to-zoom no funcionaba:** `controls.enableZoom` estaba en `false` (el zoom de rueda se gestionaba con un handler proporcional personalizado), lo que también desactivaba el zoom por pinch de OrbitControls. Fix: `enableZoom = true` — OrbitControls gestiona ahora tanto la rueda del ratón como el gesto de dos dedos; se elimina el handler `onCanvasWheel` manual; y se añade `renderer.domElement.style.touchAction = 'none'` para que el navegador no intercepte los gestos táctiles antes de que lleguen a Three.js.

## [1.22.9] — 2026-06-17

### Mejorado
- **Vista 3D compartida — experiencia en móvil:** en dispositivos táctiles (`window.innerWidth < 768 || 'ontouchstart' in window`) el canvas ocupa ahora el 100% del viewport; el panel lateral de instrucciones de ratón no se renderiza (las instrucciones de ratón no tienen sentido en touch); la barra de botones muestra solo Centrar, Persona y 💬 (si hay comentarios), todos con tamaño mínimo de 44 × 44 px; el botón Pasear y Capturar se ocultan; el overlay de instrucciones de modo paseo no aparece; y OrbitControls activa explícitamente un dedo = orbitar y dos dedos = zoom/pan mediante `controls.touches = { ONE: TOUCH.ROTATE, TWO: TOUCH.DOLLY_PAN }`. El comportamiento en escritorio no cambia.

### Corregido
- **Vista 3D — clic en elementos de texto no abría la vista de obra:** los meshes de texto están en `itemMeshes` y son detectables por el raycaster, pero `openFrom3D` salía inmediatamente con `if (!ud.photoId) return`, bloqueando cualquier elemento sin `photoId`. Fix: la guarda es ahora `if (!ud.itemId && !ud.photoId) return`, permitiendo que los textos (que tienen `itemId` pero no `photoId`) pasen y abran la vista individual correctamente.
- **Vista 3D orbital — límite de ángulo de cámara:** la cámara podía orbitar por debajo del plano del suelo. Se añade `controls.maxPolarAngle = Math.PI * 0.48`, limitando la órbita a justo por encima de la rasante y evitando ángulos imposibles en una galería real.
- **Vista de obra — orden de navegación entre tableros no respetaba el panel lateral:** `openFrom3D` construía `roomPhotos` iterando `room.walls` y `room.blocks` en orden geométrico, ignorando el orden definido por el usuario en el panel lateral izquierdo. Fix: se recogen todos los `boardId` vinculados a la sala, se ordenan según su posición en `boards[]` (el array que refleja el orden del panel), y se llama a `addBoard` en ese orden. El orden de los items dentro de cada tablero (por posición X) no cambia.

## [1.22.8] — 2026-06-16

### Corregido
- **Vista de obra — teclas ← → no esperaban el Promise de la escena 3D:** el handler de teclado no era `async` y actualizaba el estado directamente con `setArtwork3D()`, sin pasar por `navigateToRoomItem`. Esto hacía que la navegación con teclado se saltara el `await room3DReadyPromiseRef.current` que los botones de flecha en pantalla sí respetan, causando transiciones rotas si la escena 3D aún no había terminado de cargar. Fix: el handler es ahora `async`; las teclas ← → leen `artwork3DRef.current` y llaman `await navigateToRoomItem(rp, n)`.
- **Vista de obra — teclas ← → inactivas en nivel 1 (zona/grid):** el handler de teclado solo comprobaba `artwork3DRef.current` (nivel 2 — foto individual); cuando la navegación de sala llegaba a una zona o grid (nivel 1), las teclas ← → no hacían nada, aunque los botones en pantalla sí funcionaban. Fix: se introduce `artwork3DZoneRef` siguiendo el patrón estado+ref dual ya existente; el handler unifica el bloque de nivel 1 para zona y grid, responde a ← → en ambos casos con `await navigateToRoomItem`, y corrige también Escape desde drilldown de zona (vuelve al nivel 1 en lugar de cerrar la vista entera).
- **Vista de zona — posiciones incorrectas de los members:** la vista de conjunto de zona usaba `zone.w/zone.h` (el frame del canvas) como bounding box para escalar y posicionar; si los members no empezaban exactamente en la esquina `(zone.x, zone.y)` del frame, aparecían desplazados. Fix: el scale y el contenedor se calculan ahora sobre el **bounding box real** de los members (`minX/minY/maxX/maxY` en coordenadas relativas a la zona), y cada member se posiciona restando `minX/minY` al offset relativo, garantizando que el conjunto llena el viewport correctamente. Adicionalmente, la altura de los items de foto se calculaba con `m.w` como fallback cuando `m.h` es `undefined`; fix: la altura real se obtiene de `photoMap` via `Math.round(m.w * photo.h / photo.w)`, corrigiendo tanto el bounding box vertical como la posición de cada member.

## [1.22.7] — 2026-06-16

### Nuevo
- **Panel de Backups en Ajustes (modo local):** nueva pestaña "Backups" en el modal de Ajustes, disponible solo en modo local (sin autenticación). Permite activar/desactivar los backups automáticos, configurar el intervalo (en horas) y el número máximo de copias a retener. Muestra la lista de backups existentes con fecha y tamaño. Desde la lista se puede lanzar un backup manual, eliminar una copia individual o restaurar el sistema desde cualquier backup (con confirmación y snapshot automático previo a la restauración). La configuración se guarda en `data/config.json` y persiste entre reinicios del servidor, sobrescribiendo las variables de entorno.

### Mejorado
- **Consejos de ayuda en Ajustes:** la sección "Consejos de ayuda" (antes "Guías de inicio") ahora solo aparece cuando el usuario ha descartado algún consejo — si no hay nada que reiniciar, la opción no se muestra. Se añade descripción explicativa del botón. Tanto el texto como el comportamiento son más claros.
- **Botón "Hacer backup ahora":** muestra estado de carga (`…`) mientras el backup está en progreso y se deshabilita para evitar lanzamientos simultáneos. La lista de backups se refresca automáticamente al completarse.

## [1.22.6] — 2026-06-16

### Corregido
- **Navegación ← → antes de que los datos de sala estén listos — solución robusta:** el indicador booleano `room3DReady` no era suficiente: el usuario podía pulsar las flechas antes de que el estado React se actualizara y ver zonas o grids vacíos. Fix: `initScene` crea una `Promise` que resuelve cuando `boardItemsMap` y `room3DPhotoMapRef` están completamente poblados; `navigateToRoomItem` es ahora `async` y hace `await` de esa Promise antes de ejecutar cualquier navegación. Las flechas ← → ya no se deshabilitan visualmente — el usuario puede pulsarlas en cualquier momento y la navegación simplemente espera a que los datos estén disponibles.

## [1.22.5] — 2026-06-15

### Nuevo
- **Tema "Le Gras"** (renombrado desde "Oscuro · Ámbar"): paleta completamente neutral de grises puros. Inspirada en la primera fotografía de la historia — el heliograbado de Niépce (1826). Sin tintes de color, grises puros. Ajustados --sub (#d0d0d0), --muted (#b8b8b8) y --dim (#606060) para legibilidad clara sobre fondo oscuro.
- **Vista de obra M1 — paridad owner/visitante:** el owner tiene ahora exactamente la misma experiencia que el visitante de sala compartida en la vista de obra. Zonas: vista de conjunto con todos los miembros escalados sobre el color de pared, con drilldown a elementos individuales. Grids: vista del mosaico completo con flechas ← → de sala. Textos sueltos: vista fullscreen con tipografía y alineación exactas sobre el color de pared. Navegación ← → recorre todos los elementos del nivel de sala (fotos sueltas, zonas, grids, textos) ordenados por posición X.
- **Vista de obra M1 — fondo de color de pared:** todas las vistas (foto individual, zona, grid) muestran ahora el color de la pared/bloque donde está ubicado el tablero como fondo. El color de los controles (flechas, contador, botón ← Volver) se adapta automáticamente según la luminancia del fondo.
- **Marcos en la vista de obra:** las fotos se muestran con su paspartú y moldura configurados en el tablero, escalados proporcionalmente al tamaño de visualización en pantalla.
- **Extras del owner en la vista de obra:** dimensiones físicas con DPI, nombre del tablero, y botón "Editar en tablero →" para ir directamente al canvas.

### Corregido
- **Menús contextuales cortados en el borde del viewport:** los menús de clic derecho (elementos del canvas, grids, salas, vértices, columnas, paredes) se cortaban al aparecer cerca del borde derecho o inferior de la pantalla. Fix: el menú se renderiza en la posición del cursor y, tras montarse en el DOM, se ajusta si su bounding rect sobrepasa el viewport.
- **Panel de marco cortado en el borde del viewport:** el panel de paspartú/moldura se recortaba cuando la foto estaba cerca del borde del área visible, porque el panel vivía dentro del elemento `.bitem` afectado por `overflow:hidden` y el zoom del canvas. Fix: el panel ahora se monta fuera del canvas wrapper con `position:fixed` y coordenadas de viewport (clampeadas), igual que el modal de Propiedades.
- **Vista de obra — navegación ← → para zonas, grids y textos (owner y visitante):** `navigateToRoomItem` leía `allBoardItemsRef.current` para calcular los miembros de zona al pulsar las flechas; en modo owner ese ref se sobreescribía al entrar en 3D (con solo los tableros enlazados a la sala) y en modo visitante nunca se populaba. Fix: los miembros de zona se pre-calculan al insertar cada zona en `roomPhotos` dentro de `openFrom3D`, que ya usa `boardItemsMap` local (siempre sincronizado con los meshes renderizados); `navigateToRoomItem` los consume desde `next.members` sin depender de ningún ref externo.
- **Orden de navegación ← → en la vista de obra:** el array `roomPhotos` se ordenaba globalmente por `item.x`, mezclando ítems de distintos tableros y rompiendo el recorrido físico de la sala. Fix: dentro de `addBoard` los ítems de cada tablero se ordenan por `item.x` antes de añadirlos; el orden de llamada a `addBoard` (paredes en orden → caras de bloques en orden) determina el orden entre tableros.
- **Zona y grid vacíos al navegar con ← → inmediatamente tras cargar la sala:** `openFrom3D` y `navigateToRoomItem` usaban `photosRef.current` (estado React) para construir el photoMap de zonas y grids. En los primeros segundos de sesión ese estado está vacío aunque los tableros ya estén renderizados en 3D, porque la carga de fotos del proyecto (async) no había completado su ciclo de render. Fix: `initScene` almacena su `photoMap` local (construido desde la API en el mismo `Promise.all` que los items de tablero) en `room3DPhotoMapRef`; tanto `openFrom3D` como `navigateToRoomItem` usan ese ref en lugar de `photosRef.current`.
- **Zona y grid vacíos al navegar muy rápido con ← → al entrar en 3D:** `navigateToRoomItem` podía ejecutarse antes de que `initScene` completara la carga de datos (boardItemsMap + photoMap). Fix: nuevo estado `room3DReady` (false al entrar en 3D, true al finalizar `initScene`); `navigateToRoomItem` retorna inmediatamente si `!room3DReady`; las flechas ← → se muestran en opacity 0.4 y sin eventos de puntero mientras la escena no está lista; las tres vistas (foto, zona, grid) muestran un spinner "Cargando…" en lugar de contenido vacío durante ese período.
- **Marco cortado en la vista de obra fullscreen:** el `box-shadow` que simula paspartú y moldura sobresalía del viewport porque la imagen alcanzaba el máximo permitido por `.fullscreen-img` antes de añadir el frame. Fix: el `<img>` recibe `maxWidth`/`maxHeight` que restan `2 × (matD + moldD)` del espacio disponible, de modo que la imagen shrinkea lo suficiente para que el `box-shadow` quepa dentro del viewport.

## [1.22.4] — 2026-06-15

### Corregido
- **Vista de foto — fondo negro en lugar del color de pared:** las fotos individuales y las celdas de grid en vista de obra mostraban fondo negro en lugar del color de la pared donde estaban colocadas. Las vistas de zona y texto ya lo hacían correctamente. Fix: la vista de foto y la vista de grid Level 1 aplican ahora `wallColor` (propagado desde `openFrom3D`) como fondo del overlay, igual que las vistas de zona y texto.
- **Contraste de etiquetas e indicadores sobre fondos claros:** los botones ← Volver, las flechas ← →, el contador "X de N", las etiquetas de foto y las dimensiones usaban color blanco fijo. Sobre fondos de pared claros (beige, crema, blanco) resultaban invisibles. Fix: todos los elementos overlay calculan ahora su color mediante `bgContrast(wallColor)` y usan negro semitransparente si el fondo es claro.

## [1.22.3] — 2026-06-15

### Nuevo
- **Rediseño de la navegación de vista de obra (M1):** la navegación ← → recorre ahora TODOS los elementos del nivel de sala de todos los tableros, en orden de posición X: fotos sueltas, grids, zonas y textos. Anteriormente solo navegaba entre fotos.
- **Vista de zona en 3D:** al hacer clic o doble clic sobre un elemento de una zona en la vista 3D, se abre una vista fullscreen de la zona completa con fondo del color de pared del tablero. Todos los items de la zona (fotos y textos) se renderizan a escala con marcos. Al hacer clic en un item dentro de la zona se entra en el drilldown (← → navega dentro de la zona).
- **Vista de texto en 3D:** los items de tipo texto (tanto sueltos como los de una zona en drilldown) tienen su propia vista fullscreen con el texto renderizado con la tipografía, tamaño, peso y alineación exactos sobre el color de fondo de la pared del tablero.
- **Flechas de navegación de sala en Level 1:** las vistas Level 1 (grid y zona) muestran ahora las flechas ← → de navegación de sala, con el contador "X de N", igual que la vista de foto individual.

### Corregido
- **Vista de obra en sala compartida (?room=TOKEN) — sin flechas de navegación ni grids:** al abrir una foto en modo visitante de sala, las flechas ← → de navegación entre obras no aparecían y los grids no se podían abrir. Causa raíz: `openFrom3D` construía el array de navegación (`roomPhotos`) leyendo `allBoardItemsRef`, que no se inicializa en modo sala compartida (solo se popula en el modo owner). Fix: `openFrom3D` usa ahora `boardItemsMap` (variable local de `initScene`, siempre sincronizada con los meshes renderizados), que funciona en ambos modos.

## [1.22.2] — 2026-06-15

### Corregido
- **Vista de obra en sala compartida (?room=TOKEN) — sin flechas de navegación ni grids:** al abrir una foto en modo visitante de sala, las flechas ← → de navegación entre obras no aparecían y los grids no se podían abrir. Causa raíz: `openFrom3D` construía el array de navegación (`roomPhotos`) leyendo `allBoardItemsRef`, que no se inicializa en modo sala compartida (solo se popula en el modo owner). Fix: `openFrom3D` usa ahora `boardItemsMap` (variable local de `initScene`, siempre sincronizada con los meshes renderizados), que funciona en ambos modos.

## [1.22.1] — 2026-06-15

### Corregido
- **Múltiples dropdowns abiertos simultáneamente en la topbar:** al hacer clic en el avatar con preferencias abierto (o viceversa), ambos menús permanecían visibles. Fix: cada botón de dropdown (avatar, preferencias, exportar, grid) ahora cierra todos los demás antes de abrir el suyo. Solo un dropdown puede estar abierto a la vez en la topbar.
- **Vista de obra desde el 3D — clic no respondía:** OrbitControls consumía el evento `click` antes de que llegara al handler de la vista de obra. Fix: los listeners cambian de `mousedown`+`click` a `pointerdown`+`pointerup` con comprobación de umbral de movimiento (4 px), que no son interceptados por OrbitControls.
- **Snap a la perpendicular en walk mode — segundo tramo brusco:** al hacer clic en una pared en walk mode, la posición se movía con easing pero la orientación de cámara se aplicaba de golpe al final del tween. Fix: la rotación (yaw/pitch) ahora se interpola en paralelo durante los mismos 500 ms con el mismo easing cuadrático, sin ninguna asignación directa al finalizar.

### Nuevo
- **Doble clic en vista 3D → vista de obra:** en modo orbital (además del clic simple ya existente) y en modo walk, hacer doble clic sobre una foto abre la vista de obra a pantalla completa. En walk mode el doble clic abre la obra sin interferir con el comportamiento del clic simple (posicionar cámara perpendicular).
- **Temas renombrados:** "Alto Contraste" → **Rochester**; "Oscuro · Frío" → **Tokyo**.

## [1.22.0] — 2026-06-14

### Corregido
- **Importación ZIP — zonas y grids pierden sus fotos:** al importar un proyecto, las fotos que pertenecían a una zona perdían su `zoneId` (quedaban sueltas) y los grids aparecían vacíos. Causa raíz: el remapeo de IDs solo cubría `item.photoId`. Los grids usan `item.photoIds` (array plano de IDs), y las zonas usan `item.zoneId` que referencia el ID del item de zona (no un photoId). Fix: se pre-generan los nuevos IDs de todos los items antes de escribirlos (para construir `itemIdMap`) y se remapean también `item.zoneId` e `item.photoIds[]`.
- **Color de pared vinculada en el plano de sala:** las paredes con tablero asignado aparecían en blanco/gris aunque el tablero estaba correctamente vinculado. Causa raíz: si `wall.color` tenía algún valor guardado (p. ej. el color por defecto `#d0c8bc` capturado accidentalmente por el picker), esa rama cortocircuitaba la lógica `linked` antes de evaluar el acento. Fix: en el plano 2D el estado `linked` tiene prioridad absoluta sobre el color personalizado.
- **Panel abierto tras importar ZIP:** al confirmar la importación de un proyecto, el panel lateral y la sección de navegación se abren automáticamente, mostrando el proyecto importado, independientemente de si el usuario los tenía colapsados.
- **Renombrado de temas:** "Alto Contraste" pasa a llamarse **Rochester**; "Oscuro · Frío" pasa a llamarse **Tokyo**.
- **Vista de obra desde el 3D — clic no respondía:** OrbitControls consumía el evento `click` antes de que llegara al handler de la vista de obra. Fix: los listeners cambian de `mousedown`+`click` a `pointerdown`+`pointerup` con comprobación de umbral de movimiento (4 px), que no son interceptados por OrbitControls.
- **Múltiples dropdowns abiertos simultáneamente en la topbar:** al hacer clic en el avatar con preferencias abierto (o viceversa), ambos menús permanecían visibles. Fix: cada botón de dropdown (avatar, preferencias, exportar, grid) ahora cierra todos los demás antes de abrir el suyo. Solo un dropdown puede estar abierto a la vez en la topbar.
- **Snap a la perpendicular en walk mode — segundo tramo brusco:** al hacer clic en una pared en walk mode, la posición se movía con easing pero la orientación de cámara se aplicaba de golpe al final del tween. Fix: la rotación (yaw/pitch) ahora se interpola en paralelo durante los mismos 500 ms con el mismo easing cuadrático, sin ninguna asignación directa al finalizar.

### Nuevo
- **Doble clic en vista 3D → vista de obra:** en modo orbital (además del clic simple ya existente) y en modo walk, hacer doble clic sobre una foto abre la vista de obra a pantalla completa. En walk mode el doble clic abre la obra sin interferir con el comportamiento del clic simple (posicionar cámara perpendicular).
- **Vista de obra desde el 3D (M1):** clic en una foto en la vista 3D (fuera de walk mode y sin portapapeles activo) abre la obra a pantalla completa. ← o ESC cierra y restaura la posición exacta de cámara. ← → navega por todas las fotos de la sala en orden (paredes → bloques) con loop circular. El panel inferior muestra la etiqueta del item, las dimensiones físicas calculadas con el DPI del tablero, y los comentarios públicos publicados. Los grids muestran primero el grid completo a pantalla (Nivel 1); al hacer clic en una celda se abre la foto individual (Nivel 2) con navegación entre las celdas del grid. Funciona en modo visitante (?room=TOKEN).
- **HUD de etiqueta en vista 3D:** al pasar el cursor sobre una obra que tiene etiqueta, se muestra su nombre en un overlay centrado en la parte inferior del canvas. Las obras sin etiqueta no muestran nada. El HUD se oculta automáticamente en modo walk (ratón capturado) y al salir de la vista 3D.

## [1.21.19] — 2026-06-14

### Corregido
- **Importación ZIP — zonas y grids pierden sus fotos:** al importar un proyecto, las fotos que pertenecían a una zona perdían su `zoneId` (quedaban sueltas) y los grids aparecían vacíos. Causa raíz: el remapeo de IDs solo cubría `item.photoId`. Los grids usan `item.photoIds` (array plano de IDs), y las zonas usan `item.zoneId` que referencia el ID del item de zona (no un photoId). Fix: se pre-generan los nuevos IDs de todos los items antes de escribirlos (para construir `itemIdMap`) y se remapean también `item.zoneId` e `item.photoIds[]`.
- **Color de pared vinculada en el plano de sala:** las paredes con tablero asignado aparecían en blanco/gris aunque el tablero estaba correctamente vinculado. Causa raíz: si `wall.color` tenía algún valor guardado (p. ej. el color por defecto `#d0c8bc` capturado accidentalmente por el picker), esa rama cortocircuitaba la lógica `linked` antes de evaluar el acento. Fix: en el plano 2D el estado `linked` tiene prioridad absoluta sobre el color personalizado — si la pared tiene tablero vinculado siempre se pinta con `--acc`; el color personalizado solo se aplica a paredes sin tablero. Además la comprobación de `linked` se simplifica a `!!(wall.boardId || wall.boardIdBack)` para no depender de que el estado `boards` esté cargado.
- **Desplazamiento permanente de la biblioteca al hacer hover en miniaturas (causa raíz definitiva):** el bug fue introducido en v1.21.11 al migrar todos los atributos `title=""` a `data-tooltip=""`. La regla CSS `[data-tooltip]:hover::after` creaba un pseudo-elemento que al aparecer/desaparecer causaba layout shifts en los contenedores flex ancestros. Solución: se eliminan completamente las reglas CSS de tooltip y se reemplaza por un tooltip JavaScript: un único `<div id="tt" style="position:fixed">` al nivel raíz de App, posicionado con `getBoundingClientRect()` via listeners `mouseover`/`mouseout` en el documento. Con `position:fixed` y coordenadas calculadas en JS el tooltip vive completamente fuera del flujo del documento y no puede causar layout shifts. Adicionalmente: `min-height:0` en `.sidebar`, `overflow-y:auto` en `.sb-sec.nav`, `height:313px;overflow:hidden` en `.sb-sec.info` e InfoPanel con visibility-toggling.
- **Mensaje sin proyecto en la biblioteca:** cuando no hay proyecto activo (`!pid`), la biblioteca ahora muestra "Crea o selecciona un proyecto para empezar" en lugar de "Tu biblioteca está vacía".
- **Tema "Wetzlar" — contraste insuficiente (cuarta revisión):** `--sub` sube a `#d8d8d8` (≈ 13.1:1) y `--muted` a `#aaaaaa` (≈ 6.2:1).
- **Renombrado de temas:** "Claro · Natural" pasa a llamarse **Arles**, "Claro · Frío" pasa a llamarse **Düsseldorf**, y "Oscuro · Wetzlar" pasa a llamarse **Wetzlar**. Son nombres propios, iguales en ES y EN.
- **Menús simultáneos en la topbar:** cuando el avatar estaba abierto y se hacía clic en preferencias (o viceversa), ambos menús permanecían visibles. Ahora solo un dropdown puede estar abierto a la vez en la topbar: abrir avatar, preferencias, exportar o grid automáticamente cierra los otros.

### Nuevo
- **HUD de etiqueta en vista 3D:** al pasar el cursor sobre una obra que tiene etiqueta, se muestra su nombre en un overlay centrado en la parte inferior del canvas. Las obras sin etiqueta no muestran nada. El HUD se oculta automáticamente en modo walk (ratón capturado) y al salir de la vista 3D.
- **Tema "Wetzlar":** tema oscuro diseñado para trabajar con fotografía en blanco y negro, con el rojo Leica (#cc0000) como color de acento. Variables: fondo ultra oscuro (#0f0f0f), paneles (#1a1a1a - #222222), texto claro (#e8e8e8).
- **Transiciones suaves de cámara en la vista 3D:** la cámara ya no salta instantáneamente entre posiciones. Tres puntos reciben interpolación con easing cuadrático (`easeInOutQuad`): botón de reset de vista (800 ms), clic en superficie durante el modo walk (500 ms), y retorno a vista 3D tras "Editar tablero" desde el menú contextual de pared (600 ms, posicionando la cámara frente a la pared o cara de bloque seleccionada). Los movimientos continuos (WASD, giro de ratón, OrbitControls) no se ven afectados.

## [1.21.18] — 2026-06-13

### Corregido
- **Parpadeo de la biblioteca al pasar el cursor por las miniaturas (eliminación del código residual):** se elimina el bloque `posSection` (distancias ↑↓←→ del ítem seleccionado al borde del tablero) que había quedado dentro de `InfoPanel` tras mover el panel de propiedades numéricas al menú contextual. Ese bloque evaluaba `sel.length > 0` en cada render y era la única fuente de variación dinámica que permanecía en el panel de info. También se eliminan las clases CSS `.info-pos*` ya sin uso.

## [1.21.17] — 2026-06-13

### Corregido
- **Parpadeo y salto de la biblioteca al pasar el cursor por las miniaturas (fix definitivo):** se consolidan las dos correcciones anteriores en una sola solución robusta. El panel de información (`.sb-sec.info`) recupera su posición en el flujo flex normal con `height: 313px; overflow: hidden; flex-shrink: 0`. Además, InfoPanel se refactoriza para retornar siempre la misma estructura DOM: estado vacío y contenido viven en capas absolutas superpuestas; la alternancia entre ellos se hace con `visibility: hidden/visible` (nunca montando/desmontando nodos que cambien la altura del contenedor padre).

## [1.21.16] — 2026-06-13

### Corregido
- **Parpadeo y salto de la biblioteca al pasar el cursor por las miniaturas (fix definitivo):** el enfoque anterior (`height: 200px` fijo) no eliminaba el layout shift porque `.sb-sec.info` seguía participando en el flujo flex. Ahora se saca del flujo con `position: absolute; bottom: 0; left: 0; right: 0; height: 250px` y se añade `padding-bottom: 250px` a `.sb-inner` para que los demás elementos no queden tapados.

## [1.21.15] — 2026-06-13

### Corregido
- **Parpadeo y salto de posición de la biblioteca al pasar el cursor por las miniaturas:** el panel de información (`.sb-sec.info`) no tenía altura fija, por lo que al mostrar los detalles de una foto crecía de ~100 px a ~300 px y desplazaba el layout. Ahora tiene `height: 200px` fijo con `overflow: hidden`.

## [1.21.14] — 2026-06-12

### Corregido
- **Resize de zona con "Escalar contenido" — desbordamiento en resize libre:** al redimensionar sin Shift, los items sin altura almacenada (fotos) no escalaban su altura visual con `scaleY`, por lo que la zona podía quedar más pequeña que su contenido. Añadido guard de tamaño mínimo en `onMM`, `onMU` y el modal de propiedades: la zona nunca puede ser más pequeña que el bounding box de su contenido escalado.

## [1.21.13] — 2026-06-12

### Corregido
- **Modal de propiedades — tamaño no se aplicaba en fotos:** al cambiar W en una foto, el valor se sobreescribía con el derivado del campo H (que permanecía en su valor original). Ahora: si el usuario cambia W y no H, se aplica W directamente; si cambia H, se deriva W desde H manteniendo la relación de aspecto.
- **Modal de propiedades — W/H en proporción en tiempo real:** cuando el candado ⛓ está activo, cambiar W actualiza H automáticamente (y viceversa) mientras se escribe, sin esperar a pulsar Aplicar. Para fotos, W y H siempre se sincronizan (aspecto siempre bloqueado).
- **Modal de propiedades — elementos bloqueados:** si el elemento tiene el bloqueo activo, todos los campos se muestran como solo lectura, el botón Aplicar queda deshabilitado y aparece un aviso "Este elemento está bloqueado" bajo los campos.
- **Modal de propiedades — zona con "Escalar contenido":** al cambiar W o H de una zona con `scaleContent: true`, el contenido de la zona se escala proporcionalmente igual que al redimensionar arrastrando el handle.

## [1.21.12] — 2026-06-12

### Añadido
- **Modal de propiedades numéricas:** accesible mediante clic derecho → "Propiedades…" en cualquier elemento del canvas (fotos, texto, notas, zonas, placeholder). Muestra campos editables para X, Y, W, H y Rot con las unidades del tablero (px para tableros variables; cm/mm/in para tableros fijos). El icono ⛓ alterna el escalado proporcional de W/H (estado persistido en localStorage). Los cambios se aplican al pulsar Aplicar o Enter en cualquier campo, con entrada en el historial de deshacer. ESC cierra sin aplicar.

### Mejorado
- **Panel de info limpio:** eliminado el panel de propiedades numéricas inline que vivía en la barra lateral de información (era difícil de usar por su pequeño tamaño y posición). Reemplazado por el modal centrado accesible desde el menú contextual.

## [1.21.11] — 2026-06-10

### Mejorado
- **Sistema de tooltips unificado:** todos los botones de la aplicación usan ahora el mismo estilo de tooltip CSS (`[data-tooltip]:hover::after`) en lugar de la mezcla de `data-tooltip` (estilo personalizado) y `title=""` (tooltip nativo del navegador con fondo oscuro diferente). Afecta a: botones de la barra de alineación, controles `.ibc` del canvas (rotación, bloqueo, eliminación, avanzar), botones de la barra lateral (proyectos, tableros, salas, secciones, biblioteca), controles de filtro de la biblioteca, botones de vista 3D/sala, panel de administración y otros. Eliminados los atributos `title=""` de elementos no interactivos (nombres truncados de proyectos/tableros, badges de zona, etc.) para evitar tooltips nativos en elementos decorativos.

## [1.21.10] — 2026-06-10

### Corregido
- **Botones de control microbios a zoom bajo:** el cap `min(..., 1.17)` introducido en 1.21.9 rompía la contraescala para zoom de canvas < 0.855 — los botones medían 14 px a zoom 0.5 y 8 px a zoom 0.3. La contraescala correcta es `zoom: calc(1 / var(--canvas-zoom,1))` sin cap: los botones son siempre 24×24 px en pantalla a cualquier nivel de zoom.
- **Tooltips invisibles en la barra superior:** `bottom: calc(100% + 6px)` posicionaba el tooltip por encima del elemento. Para los botones de la topbar (en la parte superior de la pantalla) el tooltip quedaba fuera del viewport. Cambiado a `top: calc(100% + 6px)` — el tooltip aparece siempre debajo del botón, donde siempre hay espacio.

## [1.21.9] — 2026-06-10

### Añadido
- **Panel de propiedades numéricas:** cuando hay exactamente un elemento seleccionado en un tablero, el panel de info (barra lateral inferior izquierda) muestra campos editables para X, Y, W, H y Rot. Las unidades son px en tableros variables; cm/mm/in en tableros con DPI fijo. Un botón de candado (⛓) alterna el escalado proporcional W/H para elementos no-foto (las fotos siempre mantienen su relación de aspecto). Los campos se aplican al pulsar Enter o al perder el foco, con deshacer. Se actualizan en tiempo real mientras se arrastra, redimensiona o rota el elemento.

### Mejorado
- **Handle de redimensionado unificado:** el handle de esquina `.rh` de fotos, textos, notas y otros elementos ahora tiene un área visual de 8×8 px (igual que los handles de texto) con área de clic de 20×20 px implementada mediante pseudo-elemento `::after`. El indicador visual coincide con el estándar del resto de handles.
- **Tamaño máximo de controles en zoom bajo:** la contraescalada CSS de `.bitem-bar` ya no crece indefinidamente a zoom muy bajo — se limita a un máximo visual de ≈28 px (factor 1.17). Además, los elementos de texto más pequeños de 40 px en pantalla ocultan los controles seleccionados por defecto y solo los muestran al pasar el cursor.

### Corregido
- **Salto al iniciar el arrastre de una foto:** al hacer clic para arrastrar un elemento, había un pequeño salto de posición inicial. El cálculo ahora usa `clientToCanvas` tanto en el `pointerdown` como en el `pointermove` para obtener el delta en coordenadas del canvas, eliminando la discrepancia que causaba el salto.

## [1.21.8] — 2026-06-10

### Corregido
- **Fotos ocultas en esquinas de la vista 3D:** en una esquina interior, los items colocados cerca del borde de la pared quedaban ocultos detrás del cuerpo de la pared adyacente. El cálculo de la posición `ix` a lo largo del eje de la pared empezaba siempre en el vértice (cruce de ejes de pared), sin descontar el semiancho de las paredes que convergen en ese vértice. La cara interior visible de una pared solo abarca desde el punto de esquina interior (`vértice − wt/2`) hasta el punto de esquina interior opuesto. Ahora `ix` se desplaza `wt/2` desde v1 (si hay otra pared en ese vértice) y se limita a `min(fixedW, longitud_interior)` hacia v2, de modo que los items siempre se proyectan dentro de la franja visible de la cara de la pared.

## [1.21.7] — 2026-06-09

### Corregido
- **Texturas de grids en vista 3D compartida:** en un enlace de sala compartida (`?room=TOKEN`), las fotos dentro de elementos tipo grid no se cargaban — aparecían como cuadrícula vacía. El helper `roomPhotoIds` del servidor solo extraía `it.photoId` (fotos sueltas), ignorando `it.photoIds` (el array de fotos de los grids). Ahora itera también `it.photoIds` para incluir todas las fotos referenciadas por grids en los tableros de la sala.

## [1.21.6] — 2026-06-09

### Añadido
- **Selector de ámbito en el filtro "Sin colocar":** cuando el filtro está activo aparece un desplegable con dos opciones. "En el proyecto" conserva el comportamiento anterior (fotos no colocadas en ningún tablero del proyecto). "En esta sala" — visible solo cuando hay una sala activa con tableros vinculados — muestra las fotos no colocadas en ningún tablero enlazado a paredes o caras de bloque de esa sala (`getRoomBoardIds`). Al desactivar el filtro el ámbito vuelve a "En el proyecto".
- **Panel de info de foto — contexto de sala:** cada tablero en el que aparece la foto muestra ahora su ubicación en sala cuando procede. Si el tablero está vinculado a una pared: "Pared X — Sala Y (cara A/B)". Si está vinculado a una cara de bloque: "Bloque X — cara Norte/Sur/…". Si es un tablero independiente: solo el nombre del tablero. El cruce rooms ↔ boardId se calcula al pintar el panel (lazy, no en el render del canvas).

## [1.21.5] — 2026-06-09

### Corregido
- **Word wrap en textos de vista 3D:** `fillText()` no hace salto de línea automático, por lo que textos más anchos que el elemento se recortaban en una sola línea. El renderer 3D ahora aplica word wrap manual basado en `measureText()`: divide cada párrafo (`\n`) en palabras y acumula hasta que la línea supera `item.w - padding`, momento en que abre una nueva línea. La altura del canvas (`cvH`) se recalcula después del wrap para acomodar todas las líneas resultantes. La fuente se re-asigna al contexto tras el resize del canvas (que resetea el estado del contexto). Corrige ambos renderizadores (paredes y caras de bloques).

## [1.21.4] — 2026-06-09

### Ajustado
- **Límite mínimo de redimensionado reducido a 10 px:** el tamaño mínimo al arrastrar el handle de resize era excesivo en todos los tipos de elemento. Valores anteriores: fotos/placeholders 80 px ancho, grids 60 px, zonas 40×30 px (scale) / 80×60 px (no-scale), textos 120×60 px, notas 120×60 px. Todos reducidos a 10×10 px. Por debajo de 10 px el elemento sería invisible e inaccesible. El handle `.rh` ya contra-escala con el zoom de canvas (`zoom: calc(1 / var(--canvas-zoom,1))`), por lo que se mantiene operable a cualquier tamaño.

## [1.21.3] — 2026-06-09

### Corregido
- **Checkbox "Público" guardaba como privado:** el servidor ignoraba el campo `visibility` del body del POST y siempre inicializaba los comentarios de propietario como `'private'`. Ahora lee `req.body.visibility` y aplica `'public'` o `'private'` según lo enviado por el cliente.
- **Indicador de comentarios para visitante:** el punto de notificación (`.tbtn-dot`) del botón `💬` de la topbar no se coloreaba en modo invitado aunque hubiera comentarios públicos disponibles. Ahora muestra el punto en color acento (`var(--acc)`) cuando hay comentarios para leer (invitado) o pendientes de moderar (propietario). El botón de comentarios en la cabecera de sala compartida también muestra el badge cuando hay comentarios.
- **Texto multilínea en vista 3D:** cuando un texto contenía saltos de línea (`\n`), la altura fija del canvas (`itemH × SCALE`) hacía que el `startY` calculado fuera negativo y solo la línea central quedara visible. El canvas ahora crece dinámicamente a `max(baseCvH, ceil(totalH + padding))` para acomodar todas las líneas. Corrige ambos renderizadores (paredes y caras de bloques).

## [1.21.2] — 2026-06-09

### Ajustado
- **Tooltips de topbar unificados:** todos los botones de la topbar usan ahora `data-tooltip` (CSS) en lugar de `title` (nativo). Afecta a: grid, configuración de tablero, comentarios (tablero y sala), mostrar panel, gestión de invitaciones, moderación global y el badge del indicador de estado. Comportamiento visual consistente en toda la barra superior.

## [1.21.1] — 2026-06-09

### Ajustado
- **Botón de comentarios contextual en topbar:** un único botón `💬` que muestra los comentarios de la entidad activa en cada momento — tablero (`entityType:'board'`) cuando el usuario está en vista de tablero, sala (`entityType:'room'`) cuando está en vista de plano o 3D. El conteo refleja los totales de `commentSummary` para la entidad correspondiente.
- **Eliminado botón de comentarios redundante del toolbar de sala:** el botón `💬` que aparecía en el toolbar flotante del plano de sala ha sido retirado; queda solo el botón contextual de la topbar.

## [1.21.0] — 2026-06-09

### Ajustado
- **Cierre automático del panel de comentarios** al cambiar de tablero (`bid`) o de vista (`roomView`), evitando que el panel quede abierto sobre una entidad que ya no está visible.
- **Badge de comentarios en la sala:** botón `💬` con indicador de conteo en la cabecera del panel de sala (junto al nombre), mismo estilo que el botón de tablero. Muestra punto naranja si hay pendientes (propietario). Oculto durante la edición del nombre.
- **Botón de comentarios de proyecto siempre visible:** movido fuera de `nrow-acts` (que era opaco hasta el hover) a una posición fija junto al nombre del proyecto, visible para propietarios siempre y para invitados cuando hay comentarios publicados. Se elimina el duplicado interno en `nrow-acts`.
- **Tooltips de topbar verificados:** `data-tooltip` presente en todos los botones relevantes de la barra superior (`ttMemory`, `ttExport`, `ttPresent`, `ttVersions`, `ttShortcuts`, `ttPrefs`).

## [1.20.31] — 2026-06-09

### Añadido
- **Sistema de comentarios — cliente (Tanda 2):** interfaz completa de comentarios y anotaciones en el lado del cliente.
  - **Badges en canvas:** burbuja `💬 N` sobre fotos, zonas, textos y grids; se contra-escala con el zoom del canvas; borde naranja cuando hay pendientes (solo propietario).
  - **Menú contextual:** entrada "Comentarios" en el menú contextual de foto, texto, zona y grid (oculto en modo sala compartida).
  - **Botones de toolbar:** botón de comentarios en la barra del tablero, en el toolbar de sala y en la fila de proyecto del sidebar. Botón de moderación en la topbar cuando hay comentarios pendientes (solo modo servidor, propietario).
  - **Panel lateral de comentarios:** panel deslizante a la derecha (`.comment-panel`) con lista de comentarios, controles de edición/visibilidad/memoria y compositor; el propietario ve todos los comentarios con controles completos, el visitante solo ve los `published+public`.
  - **Checkbox `allowComments`:** en el modal de compartir proyecto y en el modal de compartir sala, con llamada `PATCH` para activar/desactivar comentarios en tokens existentes. Se propaga al cliente (invitado) desde las respuestas de init del servidor.
  - **Modal de moderación:** overlay de pantalla completa (solo propietario en modo servidor) con la lista de comentarios pendientes, selector de visibilidad por comentario y acciones de aprobar/rechazar.
  - **Integración en memoria:** `printMemoria` es ahora async; recupera `GET /api/projects/:pid/comments?inMemory=1` e inyecta bloques de observaciones agrupados por tablero, foto y proyecto en el informe HTML.
  - **Botón de comentarios en sala compartida:** botón `💬` en la cabecera de sala compartida cuando `allowComments === true`.

## [1.20.30] — 2026-06-09

### Añadido
- **Sistema de comentarios — servidor (Tanda 1):** infraestructura completa del lado del servidor para el nuevo sistema de anotaciones.
  - Almacenamiento en `{dd}/{pid}/comments.json` (por-proyecto), sin base de datos.
  - Rutas CRUD: `GET/POST /api/projects/:pid/comments`, `GET /api/projects/:pid/comments/summary` (conteos sin cuerpos), `PATCH/DELETE /api/projects/:pid/comments/:cid`.
  - Rutas de moderación (solo modo servidor, `requireAuth`): `GET /api/comments/pending` (con `?count=1`), `POST …/approve` y `POST …/reject`.
  - Flag `allowComments` (boolean, defecto `false`) en los tokens de `shares.json` para proyectos y salas; `resolveAccess` lo expone como `req.shareAllowComments`. Visitantes sin el flag reciben 403 al intentar comentar.
  - `PATCH /api/projects/:pid/share/:role` y `PATCH /api/projects/:pid/rooms/:rid/share` para activar/desactivar comentarios en un token existente.
  - `GET /api/share/:token` y `GET /api/rooms/share/:token` devuelven `allowComments`.
  - Cascadas de borrado: foto → comentarios de esa foto (hard-delete inmediato); tablero → comentarios del tablero y de sus ítems (`boardId===bid`); sala → sala + tableros vinculados. Ítems borrados implícitamente (via `PUT items`): barrido perezoso en `runStartupPurge` (`purgeOrphanComments`).
  - Suite de tests `tests/comments.test.js` (26 tests): owner CRUD, filtrado por rol, resumen, moderación, cascadas, flag `allowComments`.

## [1.20.29] — 2026-06-09

### Corregido
- **Vista 3D — iluminación volumétrica permanente:** la iluminación volumétrica (luz principal cálida + relleno frío) ahora es permanente, sin opción de toggle. Sin botón, sin localStorage. Las paredes y objetos tienen volumen y profundidad de forma consistente.

## [1.20.28] — 2026-06-09

### Añadido
- **Vista 3D — iluminación volumétrica (temporal):** botón toggle removido — la iluminación volumétrica es ahora el comportamiento por defecto permanente.

## [1.20.27] — 2026-06-09

### Corregido
- **Admin: confirmación de eliminación de usuario oculta:** el modal de confirmación al intentar eliminar un usuario aparecía detrás del panel de administración (z-index insuficiente). Ahora aparece correctamente encima.

## [1.20.26] — 2026-06-08

### Corregido / Mejorado
- **Handles de redimensionado en modo edición:** los 8 handles del elemento de texto se ocultan automáticamente mientras el elemento está en modo edición (el usuario está escribiendo, no redimensionando). Vuelven a aparecer al salir del modo edición.
- **Barra de controles — posición adaptativa:** la barra de controles del elemento de texto ahora aparece debajo del elemento cuando el borde superior está dentro de los primeros 52 px del canvas (cerca del topbar), igual que ya hacían fotos y notas.

## [1.20.25] — 2026-06-08

### Corregido / Mejorado
- **3D: texto con fontSize grande:** el texto ya no desaparece en la vista 3D al usar tamaños grandes (≥ 512 px). El renderer 3D escala el font proporcionalmente al canvas de textura; el aspecto visual es correcto independientemente del valor absoluto.
- **Handles de redimensionado (texto):** 8 handles visibles al seleccionar un elemento de texto (4 esquinas + 4 lados), contra-escalados con el zoom del canvas. Permiten redimensionar en cualquier dirección (antes solo SE).
- **Borde de selección visible:** al seleccionar un elemento de texto el borde pasa a 2 px sólido con el color de acento; en modo edición baja a 40 % de opacidad para distinguir los dos estados.
- **Cursor correcto:** en modo selección el cursor del texto es `grab`; solo en modo edición (doble clic) cambia a `text`.
- **Barra de controles:** vuelve a la posición estándar (flotando encima del elemento) igual que fotos y notas. Handle `.rh` de notas ampliado a 20 × 20 px con z-index superior a la barra para evitar oclusión.
- **Inicio de edición al crear:** al añadir un elemento de texto, el texto existente se selecciona automáticamente (listo para sobreescribir).

## [1.20.24] — 2026-06-08

### Corregido / Mejorado
- **Tamaño de texto por defecto:** el elemento de texto nuevo arranca siempre con 64 px en tableros variables y el equivalente proporcional al DPI en tableros fijos. Ya no hereda `fontSize` de elementos anteriores, eliminando el problema de texto microscópico.
- **Presets de tamaño ampliados:** tableros variables hasta 2048 px; tableros fijos hasta 288 pt. Límite del campo manual subido a 9999 (necesario para texto a escala de sala). Formato de preset fijo: "12pt (50px)".
- **Entrada directa al crear texto:** al añadir un elemento de texto el modo edición se activa automáticamente (igual que al hacer doble clic), sin necesidad de un paso extra.
- **Iconos de alineación de texto:** reemplazados por los iconos estándar de Lucide (AlignLeft / AlignCenter / AlignRight) con líneas que representan texto.
- **Barra de controles del texto:** movida a la esquina superior derecha del elemento (antes estaba en la inferior, tapando el handle de redimensionado). Contra-escala con el zoom del canvas igual que el resto de controles.

## [1.20.23] — 2026-06-08

### Corregido
- **Modo edición de texto — activación por doble clic:** el modo edición (toolbar de formato, cursor activo) solo se activa con **doble clic**, igual que Figma, Illustrator y Keynote. Un clic simple selecciona el elemento y muestra la toolbar genérica (copiar, alinear, agrupar) sin entrar en edición.
- **Modo edición de texto — salida limpia:** ESC o clic fuera del elemento sale del modo edición dejando el elemento seleccionado; la toolbar genérica vuelve a mostrarse.
- **fontSize corrupto saneado al cargar:** al abrir un tablero, cualquier elemento de texto con `fontSize < 8` (datos corruptos) se corrige automáticamente al valor por defecto (24 px en tableros variables, equivalente a 12 pt en tableros fijos).
- **addText — herencia de fontSize inválido:** el nuevo elemento ya no hereda `fontSize` de un elemento previo con valor corrupto (< 8); en ese caso usa el valor por defecto.

---

## [1.20.22] — 2026-06-08

### Corregido
- **Topbar de texto — condición de activación:** la barra de formato solo aparece cuando el elemento de texto está en **modo edición** (clic en el textarea, cursor de texto activo). Al seleccionarlo con un solo clic muestra la toolbar genérica de ítem (copiar, alinear, agrupar, etc.) igual que cualquier foto.
- **Topbar de texto — exclusión mutua con toolbar genérica:** texto en edición → toolbar de formato; texto seleccionado sin editar → toolbar genérica. Ambas son mutuamente excluyentes; ya no se solapan.
- **Tamaño por defecto de nuevos elementos de texto:** 24 px en tableros variables; equivalente a 12 pt (`Math.round(12 × DPI / 72)` px) en tableros fijos.

---

## [1.20.21] — 2026-06-08

### Añadido
- **Topbar contextual para texto:** al seleccionar un elemento de texto, la barra superior muestra los controles de formato (fuente, tamaño, negrita, cursiva, alineación, color) en lugar de los botones habituales — igual que el panel de opciones de herramienta en Photoshop. El panel flotante anterior ha sido eliminado.
- **Dropdown de fuente:** selector con cada opción renderizada en su propia tipografía. Ancho suficiente para mostrar "Cormorant Garamond".
- **Dropdown de tamaño:** campo de entrada numérica manual (Enter o perder el foco confirman el valor) más lista de presets clicables. En tableros fijos muestra "12pt (50px)"; en tableros variables muestra px directamente.
- **Fuentes nuevas — Cormorant Garamond** (Regular, Negrita, Cursiva), **Inter** (Regular, Negrita) y **Josefin Sans** (Regular, Negrita): disponibles en canvas 2D, exportación JPEG y vista 3D.
- **Fuentes servidas localmente:** todos los archivos `.ttf` se sirven ahora desde `/fonts/` (public/fonts/) mediante `@font-face`; se eliminó la dependencia del CDN de Google Fonts.

## [1.20.20] — 2026-06-08

### Corregido
- **Instalador Windows — arranque en instalación limpia:** el servidor ya no se queda con la pantalla de carga indefinida tras una instalación nueva. `installer/build.bat` ahora ejecuta `node scripts/build.js` antes de empaquetar el instalador, por lo que `_built.html` llega precompilado y el servidor sirve el frontend directamente sin necesidad de compilar en el arranque.
- **Instalador Windows — directorio `scripts/` faltante:** `scripts/` se incluye ahora en el paquete instalador como respaldo, por si `_built.html` queda obsoleto tras la instalación. Anteriormente, el proceso hijo lanzado por el servidor para recompilar el JSX fallaba con ENOENT porque `scripts/build.js` no estaba en el directorio de instalación.
- **Pantalla de carga infinita → página de error:** si el proceso de compilación falla, el servidor ahora muestra una página de error permanente con el mensaje "No se encontró el compilador JSX. Reinstala la aplicación." en lugar de un spinner que gira indefinidamente.

---

## [1.20.19] — 2026-06-08

### Añadido
- **Vista 3D — menú contextual en paredes y caras de bloque:** clic derecho sobre una pared o cara de bloque sin ítem muestra un menú que permite navegar al tablero vinculado o crear uno nuevo en esa cara. Si el portapapeles está activo, aparece la opción "Pegar aquí" (cara con tablero) o "Crear y pegar" (cara sin tablero) para crear el tablero y pegar en un solo paso. El menú incluye el nombre del tablero como cabecera informativa.

### Corregido
- **Vista 3D — menú contextual en walk mode:** el menú contextual ya no aparece mientras el modo paseo (walk) está activo (`walkActive`), donde el cursor está capturado y el menú no tiene sentido.
- **Vista 3D — menú contextual para invitados (refuerzo):** el guard `roomShareMode` del handler `onCtxMenu` ahora también cubre el caso de walk mode con una sola condición combinada.

---

## [1.20.18] — 2026-06-07

### Corregido
- **Vista 3D — modo sala compartida (invitado):** el menú contextual Copiar/Cortar ya no aparece al hacer clic derecho sobre una foto en la pared cuando se accede mediante `?room=TOKEN`. El handler `onCtxMenu` comprueba `roomShareModeRef` y retorna sin mostrar el menú. El handler de clic izquierdo para navegar a un tablero con portapapeles activo (`onPasteClick`) también se desactiva en modo invitado.

---

## [1.20.17] — 2026-06-07

### Corregido
- **Vista 3D — rotación de fotos en cara superior de bloques:** las fotos colocadas en el tablero de la cara superior de un bloque ya renderizan con su rotación (`item.rot` + `item.freeRot`) aplicada correctamente en `rotation.z` del plano hijo, igual que en las caras verticales. Las fotos con 90° o 270° usan el aspect ratio intercambiado para que las dimensiones del plano sean las nativas antes de rotar (mismo comportamiento que las caras N/S/E/O).

---

## [1.20.16] — 2026-06-07

### Mejorado
- **Figura de escala humana — ajuste de proporciones:**
  - **Cabeza:** +35% de tamaño (`SphereGeometry(15)`), óvalo más pronunciado en Y×1.2 respecto a X/Z (≈24 cm ancho × 29 cm alto)
  - **Torso:** 10% más corto (y=82→147); hombros +28% más anchos (54 cm ⌀, era 42 cm); cintura más estrangulada (26 cm ⌀) para silueta de maniquí clara; diferencia visual mayor entre hombros/cintura/caderas
  - **Brazos:** total ~68 cm (brazo 37 cm + antebrazo 31 cm); hombro bajado a y=133 para no parecer pegado al cuello; manos a mitad del muslo (y≈61)
  - **Juntas:** esfera de codo reducida a r=4 (= radio del antebrazo, discreta); esfera de rodilla reducida a r=5.5 (= radio de la pantorrilla, discreta)
  - **Pies:** 30 cm de largo, 8 cm de alto (más volumen); girados 180° en Y para que la figura mire hacia el interior de la sala (dirección −Z, hacia la cámara por defecto); inclinación talón/punta `rotation.x=−0.08`

---

## [1.20.15] — 2026-06-07

### Mejorado
- **Figura de escala humana — aspecto maniquí y figura en modo invitado:**
  - Color sandy/taupe cálido (`#C4AA8A`, roughness 0.75) en lugar del blanco marfil anterior
  - Esferas de junta en hombros, codos, caderas y rodillas que solapan con los segmentos de cápsula, eliminando los huecos visibles en las articulaciones
  - Pies rediseñados: `SphereGeometry` escalada de forma no uniforme (28 cm largo × 10 cm ancho × 6 cm alto, orientados en Z, con ligera inclinación talón/punta)
  - Los botones **👤 Persona** y **↔ Mover** son ahora visibles en la barra de controles 3D mínima que se muestra al invitado (`?room=TOKEN`), sin necesitar el topbar completo

---

## [1.20.14] — 2026-06-07

### Mejorado
- **Figura de escala humana (vista 3D) — rediseño tipo maniquí:** silueta más reconocible y proporciones corregidas (canon 7,5 cabezas, 175 cm). Cabeza como óvalo vertical; torso con `LatheGeometry` cerrado en crotch y cuello (hombros 42 cm, cintura 28 cm, caderas 35 cm); brazos y piernas como cápsulas suaves (perfil de semiesferas en `LatheGeometry`) sin articulaciones esféricas visibles; manos y pies como ovoides planos. Material `MeshStandardMaterial` blanco marfil (`#E8E4DF`, roughness 0.85, metalness 0) en sustitución del beige opaco anterior

---

## [1.20.13] — 2026-06-07

### Seguridad
- **Unicidad de tokens de compartición:** revisión de seguridad en los endpoints `POST /api/projects/:pid/share` y `POST /api/projects/:pid/rooms/:rid/share`. Confirmado que ambos generan siempre un UUID v4 aleatorio nuevo (`uuidv4()`) en cada petición, sin derivar el token de datos del proyecto ni reutilizar el token anterior. Se añaden tests de regresión que verifican que dos llamadas consecutivas producen tokens distintos

---

## [1.20.12] — 2026-06-07

### Corregido
- **Tooltips inconsistentes:** se unifica el estilo visual de todos los tooltips usando el atributo personalizado `data-tooltip` (estilo CSS custom de Tableau) en lugar de mezclar con `title=""` (tooltips nativos del navegador). Se eliminan tooltips redundantes que solo repetían el texto ya visible en botones
- **Buttons de formato de texto (Bold, Italic) y color picker de notas:** convertidos a `data-tooltip` para mantener consistencia visual
- **Grid panel — botones ESC y Enter:** convertidos a `data-tooltip` con los atajos de teclado
- **Botones de zoom y alineación:** se elimina el atributo `title=""` que coexistía con `data-tooltip`, evitando tooltips duplicados

---

## [1.20.11] — 2026-06-07

### Añadido
- **Compartir sala — modal rediseñado:** estructura equivalente al modal «Compartir proyecto»: enlace con botón «Copiar», campo de correo y botón «Enviar invitación». Se elimina el acceso a Regenerar/Revocar desde este modal (ahora centralizado en «Invitaciones activas»)
- **Compartir sala — botón en el menú lateral:** el icono de compartir aparece en la fila de cada sala del panel izquierdo cuando `AUTH_ENABLED=true`
- **Invitaciones activas — lista unificada:** la ventana muestra ahora tanto links de proyecto como de sala. Cada entrada incluye nombre del proyecto (+ sala si corresponde), tipo («Proyecto — solo lectura» / «Sala — vista 3D»), correo del destinatario si se envió por email (o «—»), fecha de creación, y botones «Copiar enlace» y «Revocar»
- **Tablero privado — indicador visual:** el icono EyeOff se desplaza a la izquierda del nombre del tablero en el sidebar. Se añade un badge en la miga de pan del topbar y una franja de puntos en la parte superior del canvas cuando el propietario está editando un tablero privado

### Corregido
- **Hint de onboarding (arrastrar foto al tablero):** el hint de «Momento 3» y el de tablero vacío aparecían fuera del área visible del canvas porque estaban posicionados al 50% de la altura total del canvas (mínimo 2200 px). Ahora usan `position:fixed` y siempre se centran en el viewport

---

## [1.20.10] — 2026-06-07

### Corregido
- **Sala compartida — fotos no se renderizaban en el visor 3D:** el endpoint `GET /api/projects/:pid/boards` devolvía 403 en scope de sala, lo que dejaba el state `boards` vacío. El renderer 3D necesita los metadatos del tablero (`fixedW`, `dpi`, `units`) para calcular la posición de cada foto en la pared; sin ellos, cortocircuitaba inmediatamente y las superficies aparecían vacías. El servidor ahora devuelve solo los tableros no privados enlazados a esa sala; el cliente los carga junto con las fotos antes de activar la vista 3D
- **Sala compartida — pantalla de bienvenida errónea con token inválido:** si el token estaba revocado o era malformado, la app mostraba la pantalla de onboarding «Crear primer proyecto» en lugar de un mensaje de error. Ahora se muestra una pantalla de error clara («Este enlace ya no está disponible») cuando el token no puede resolverse. Además, la pantalla de bienvenida queda suprimida permanentemente en cualquier contexto de sala compartida

---

## [1.20.9] — 2026-06-07

### Corregido
- **Grid cortado al hacer zoom out (tableros variables):** el canvas del grid calculaba su tamaño mínimo con `max(3000, wrapSize / zoom)`. Si `wrapSize` estaba en 0 (por haberse medido mientras el elemento estaba oculto con `display:none` en la vista de sala), el canvas quedaba en 3000 px de canvas, que a zoom muy bajo puede ser menos de 300 px en pantalla. Ahora se usa `window.innerWidth/innerHeight` como fallback cuando `wrapSize` es 0
- **Grid desaparece en modo auto al hacer zoom out:** la condición `gridVisible` comparaba `gridCellPx × zoom` con `GRID_MIN_PX`, lo que hacía desaparecer el grid a zoom bajo aunque estuviera activado. La visibilidad ahora comprueba el tamaño de celda base (`gridCellPx >= GRID_MIN_PX`), independiente del zoom. La comprobación de zoom para el snap permanece sin cambios

---

## [1.20.8] — 2026-06-07

### Añadido
- **Compartir sala (modo servidor):** botón de compartir en la barra de herramientas del editor de sala (solo propietarios, solo en modo servidor). Genera un link público `?room=TOKEN` que abre la app directamente en la vista 3D de esa sala sin necesidad de cuenta. Un solo token activo por sala; regenerar revoca el anterior. Incluye modal con copiar, regenerar y revocar
- **Acceso restringido al scope de sala:** el link de sala da acceso solo a la geometría de esa sala, a los items de los tableros enlazados a sus paredes y bloques, y a las fotos estrictamente referenciadas por esos items. Cualquier otro recurso del proyecto devuelve 403
- **Layout de sala compartida:** el visitante ve únicamente el canvas 3D con los controles de navegación (orbital + modo paseo) y una cabecera mínima con el nombre de la sala. Sin topbar de edición, sin panel lateral, sin biblioteca
- **Icono de tablero privado:** los tableros marcados como privados muestran ahora el icono de ojo tachado (Lucide EyeOff) en lugar del símbolo `⊘`, visible solo para el propietario

---

## [1.20.7] — 2026-06-07

### Añadido
- **Tooltips contextuales en botones:** regla CSS global `[data-tooltip]` que muestra un tooltip estilizado al pasar el ratón sobre cualquier botón con ese atributo. Aplicado a los botones del topbar (Presentación, Memoria, Versiones, Exportar, Preferencias, ?), la barra de selección del canvas (Cortar, Copiar, Agrupar, Desagrupar, Intercambiar), los controles de zoom (Acercar, Ajustar, Alejar) y la barra hover de foto (Rotar, Bloquear, Eliminar)
- **Panel de atajos de teclado (F1):** botón `?` en el topbar (siempre visible) y tecla F1 para abrir el panel; ESC y clic en el backdrop para cerrarlo. El panel lista todos los atajos organizados en secciones (General, Canvas—selección/edición/movimiento/zoom/rotación, Biblioteca, Vista 3D/Walk, Plano de sala, Galería) con badges `<kbd>` estilizados y marca ⚠️ para los atajos no visibles en la interfaz

---

## [1.20.6] — 2026-06-06

### Corregido
- Passenger (integración Apache/Nginx con `passenger_nodejs`) ya no necesita ejecutar el fichero como módulo principal: los tres bloques de arranque (`app.listen`, `checkForUpdates`/`runStartupPurge`/backup, `resetHeartbeat`) ahora también se activan cuando la variable de entorno `PASSENGER_USE_FEEDBACK_FD` está definida, que es la señal estándar de Passenger en modo integrado

---

## [1.20.5] — 2026-06-06

### Corregido
- Solución definitiva al timeout de Passenger: cuando `_built.html` no existe o está desactualizado, `GET /` responde **de inmediato** con una página de espera animada (auto-refresh cada 8 s) y lanza la compilación Babel en un proceso hijo independiente (`scripts/build.js` vía `child_process.execFile`). El event loop nunca se bloquea; Passenger recibe respuesta HTTP instantánea en cualquier modo de arranque. Una vez finalizado el build, el siguiente acceso a `/` sirve `_built.html` por el fast path asíncrono (`res.sendFile`). Eliminadas `compileHtml()` y la variable `_htmlReady` de `server.js` (la compilación vive exclusivamente en `scripts/build.js`)

---

## [1.20.4] — 2026-06-06

### Corregido
- El arranque del servidor ya no bloquea el event loop en ningún modo de Passenger: `GET /` sirve `_built.html` con `res.sendFile()` totalmente asíncrono cuando el fichero existe y es válido (`npm run build`); la compilación Babel solo ocurre bajo demanda en desarrollo (cuando `_built.html` está ausente o `index.html` cambió). Eliminados `setImmediate` y la pre-carga en el callback de `listen()` que seguían bloqueando el event loop con un `fs.readFileSync` síncrono incluso en el fast path

---

## [1.20.3] — 2026-06-06

### Añadido
- Script `npm run build` (`scripts/build.js`) que precompila `public/index.html` a `public/_built.html` con la misma configuración Babel que usa el servidor; se debe ejecutar una vez después de cada despliegue en producción antes de reiniciar el servidor, eliminando así el bloqueo del event loop durante el arranque

### Cambiado
- En modo standalone (Node.js directo), el callback de `server.listen()` inicia explícitamente la compilación Babel una vez que el puerto ya está activo; si `_built.html` está precompilado (`npm run build`), la llamada es una lectura de disco instantánea y no hay bloqueo

---

## [1.20.2] — 2026-06-06

### Corregido
- Corrección del arranque en Passenger integration mode (Apache/Nginx con `passenger_nodejs`): en ese modo el módulo se carga con `require()`, no como main, por lo que el bloque `if (require.main === module)` no se ejecuta y la compilación Babel nunca arrancaba, dejando el servidor bloqueado en el primer request; ahora `setImmediate` dispara la compilación en el primer tick del event loop independientemente del modo de ejecución

---

## [1.20.1] — 2026-06-06

### Corregido
- El servidor ya no agota el timeout de Phusion Passenger (ni de otros gestores de procesos) al arrancar: `server.listen()` se llama ahora antes de que Babel compile el JSX, por lo que el puerto queda activo en milisegundos; la compilación síncrona (~10 s en CPUs lentas) ocurre después, con el puerto ya visible

---

## [1.20.0] — 2026-06-06

### Corregido
- Al sincronizar un tablero con su pared o cara de bloque, los ítems que quedan fuera de las nuevas dimensiones ya no permanecen en el JSON como elementos «colgados»: si hay ítems afectados, se muestra un diálogo de confirmación («Sincronizar (N fotos a biblioteca)») y, al aceptar, se eliminan del tablero — la foto sigue disponible como «sin colocar» en la biblioteca

### Cambiado
- La detección de desbordamiento en la sincronización ahora comprueba ambos ejes (ancho y alto), no solo el ancho
- El flujo de sincronización con desbordamiento pasa de bloqueo con toast de error a diálogo de confirmación destructiva con recuento de ítems afectados

---

## [1.19.0] — 2026-06-06

### Añadido
- Onboarding progresivo y contextual: tres momentos independientes sin wizard bloqueante, persistidos en `localStorage` bajo `tb-onboarding`
- Pantalla de bienvenida (sin proyectos): propuesta de valor reescrita como beneficio directo
- Biblioteca vacía: estado enriquecido con título, subtítulo, botón «Subir fotos», hint de drag-drop y enlace «¿Qué puedo hacer?» que abre un overlay con las 3 capacidades principales de la app (tableros visuales, repositorio de imágenes, vista de sala 3D); se cae al estado minimalista si ya fue descartado
- Tablero vacío con fotos en biblioteca: hint sutil de una línea con botón × individual; desaparece automáticamente al colocar el primer ítem
- Overlay «¿Qué puedo hacer?»: cierra con ×, ESC o clic fuera; checkbox «No mostrar de nuevo» oculta permanentemente el enlace de ayuda en futuras visitas sin eliminar las otras guías
- Botón «↺ Reiniciar guías de inicio» en Ajustes → General: borra el estado `tb-onboarding` y muestra toast de confirmación

---

## [1.18.0] — 2026-06-06

### Añadido
- Clic izquierdo sobre una pared o cara de bloque con tablero mientras el portapapeles tiene contenido navega automáticamente a ese tablero y abre el ghost de pegado; el cursor cambia a punto de mira mientras el portapapeles está activo en la vista 3D
- Las zonas tienen prioridad sobre sus fotos en el raycasting 3D: hacer clic derecho sobre una foto que pertenece a una zona copia la zona completa (foto + hijos) en lugar de la foto individual; el menú contextual muestra «Copiar zona» / «Cortar zona»
- Hover visual en la vista 3D: al pasar el cursor sobre una foto o texto, el elemento (o todos los miembros de la zona a la que pertenece) se atenúa ligeramente; el cursor cambia a puntero
- ESC en vista 3D con portapapeles activo cancela el modo de selección de destino (cursor punto de mira) sin borrar el portapapeles, permitiendo pegar con Ctrl+V en el canvas 2D

---

## [1.17.0] — 2026-06-06

### Añadido
- Clic derecho sobre una foto o texto en la vista 3D de sala muestra un menú contextual con «Copiar» y «Cortar»; la acción carga el ítem en el portapapeles existente (el mismo que usa Ctrl+C/X en el canvas 2D), activando el banner de portapapeles para que el usuario pueda pegar con Ctrl+V en cualquier tablero

---

## [1.16.0] — 2026-06-06

### Añadido
- Modal de Ajustes (⚙ en dropdown de preferencias): tab General con selección de tema, idioma, toggle de biblioteca y bloque «Acerca de»; tab Proyecto (visible cuando hay un proyecto activo) con nombre editable, notas libres, valores por defecto para nuevos tableros (unidades, DPI, marco, formato de exportación) y estado del link de compartir con botones de generar/revocar
- Notas de proyecto y valores por defecto de tablero se guardan en `projects.json` y viajan con el ZIP de exportación/importación
- Los nuevos tableros heredan las unidades, DPI y marco por defecto configurados en los ajustes del proyecto
- El formato de exportación por defecto del proyecto se aplica automáticamente al cambiar de proyecto
- El dropdown de preferencias se simplifica a Tema + Idioma + «Ajustes…»

---

## [1.15.0] — 2026-06-06

### Añadido
- Exportar tablero como PNG con fondo transparente: el desplegable de exportación tiene ahora un toggle JPEG / PNG en la cabecera y una sola terna de presets de calidad (96 / 150 / 300 dpi); la elección se recuerda entre sesiones; en modo PNG el área alrededor de las fotos, los bordes de rotación libre y el borde exterior configurable quedan transparentes
- Caras de bloque vinculadas a tablero: aviso ⚠ y botón «Sincronizar» en el panel de bloque cuando las dimensiones físicas de la cara (N/S usan ancho×alto, E/O usan fondo×alto, Superior usa ancho×fondo) difieren de fixedW/fixedH del tablero; mismo comportamiento que las paredes
- Avatar de cuenta en el topbar (modo servidor): botón circular con la inicial del usuario que abre un dropdown con barra de almacenamiento, botón de cambio de clave, acceso a administración (solo admin) y cierre de sesión; estos controles se eliminan del desplegable de preferencias

---

## [1.14.1] — 2026-06-05

### Corregido
- Control de zoom: se elimina el valor numérico del porcentaje (confuso para el usuario)
- Correo de invitación: texto más natural ("acceso de visitante", asunto "te invita a")
- Usuarios registrados que abren un link de invitación ahora acceden correctamente como invitados al proyecto compartido, tanto en llamadas API como en imágenes

---

## [1.14.0] — 2026-06-05

### Añadido
- Tablero privado (modo servidor): nuevo atributo en la configuración del tablero; los invitados no ven ni pueden acceder a los tableros marcados como privados

### Mejorado
- Las fotos bloqueadas dentro de una zona ya no impiden mover la zona
- Segundo clic sobre una foto dentro de una zona seleccionada (estilo Figma): selecciona la foto directamente sin necesidad de deseleccionar la zona primero
- La barra de control de una foto en la parte superior de una zona ya no se solapa con la cabecera de la zona
- Una foto debe estar completamente dentro de la zona para pertenecer a ella; arrastrarla parcialmente fuera la desvincula
- Las zonas se pueden superponer libremente sin rebote
- Panel de información siempre visible al pie del panel izquierdo; los invitados no lo ven
- Jerarquía visual corregida: las salas aparecen claramente anidadas bajo el proyecto en la barra lateral
- Botones `+ Nueva sala` y `+ Nuevo tablero` al mismo nivel jerárquico

---

## [1.12.0] — 2026-06-04

### Añadido
- Copiar/cortar y pegar visual con ghost: Ctrl+C / Ctrl+X copia o corta los elementos seleccionados; Ctrl+V muestra un fantasma semitransparente que sigue el cursor — clic para colocar, ESC para cancelar
- La rueda del ratón escala el conjunto mientras el ghost está activo, permitiendo ajustar el tamaño antes de colocar
- Botones ✂ (cortar) y ⎘ (copiar) visibles en la barra de selección cuando hay elementos seleccionados
- Opción "Pegar" en el menú contextual del canvas (clic derecho) cuando hay algo en el portapapeles
- El ghost aparece centrado en el punto del clic derecho si se pega desde el menú contextual
- Compatible con todos los tipos: fotos, notas, zonas, texto, placeholders y grupos

### Corregido
- Desagrupar no limpiaba la selección activa, lo que provocaba que los elementos se siguieran moviendo juntos hasta hacer clic en el canvas

---

## [1.11.2] — 2026-06-04

### Corregido
- Error al iniciar en Windows cuando la carpeta de datos (`%LOCALAPPDATA%\Tableau\data`) no existía todavía: el lanzador ahora crea las carpetas intermedias si faltan

---

## [1.11.0] — 2026-06-03

### Añadido
- Papelera: las fotos y proyectos eliminados se conservan hasta 30 días antes de borrarse definitivamente
- La papelera se abre desde un botón en la barra lateral con badge de conteo cuando hay elementos
- Fotos en la papelera muestran el proyecto de origen; se pueden restaurar a la biblioteca o borrar definitivamente
- Proyectos en la papelera se pueden restaurar completos (con todos sus tableros, fotos y salas)
- Vaciar papelera elimina todo el contenido de golpe
- Purga automática de elementos con más de 30 días al arrancar el servidor

### Mejorado
- Borrar una sala elimina ahora también todos los tableros vinculados a sus paredes, bloques y columnas
- La pantalla de bienvenida ("Crear primer proyecto") solo aparece cuando no hay proyectos Y la papelera está vacía
- Arrastrar fotos sin proyecto activo muestra un aviso en rojo en la biblioteca y el canvas, en lugar del color de acento habitual

### Corregido
- Restaurar una versión anterior de un tablero avisa si alguna foto de esa versión ya no existe en la biblioteca

---

## [1.10.2] — 2026-06-01

### Mejorado
- Instalador Mac universal: un solo DMG para Intel y Apple Silicon (binario Node fat binary via lipo)
- Launcher Mac registra errores en `~/Library/Logs/Tableau/tableau.log` y muestra un diálogo si el servidor no arranca

---

## [1.10.1] — 2026-06-01

### Mejorado
- Carga inicial instantánea: el JSX se compila en el servidor al arrancar (~2 s una sola vez) y se cachea en disco — el navegador recibe JS puro, sin Babel
- React y ReactDOM se sirven localmente desde node_modules — sin dependencia de unpkg.com ni de ninguna red externa
- Arranque del servidor más rápido: sharp se carga en diferido (solo al procesar la primera imagen)

### Corregido
- Panel izquierdo: plantillas siempre arranca colapsado; expandirlas ya no colapsa la sección de proyectos
- Panel izquierdo: iconos identificativos en cada sección (⊞ Proyectos, ◈ Plantillas, ○ Información)
- El desplegable de preferencias ya no queda tapado por los controles de zoom al expandir la biblioteca
- El botón de ampliar biblioteca expande hasta ocupar toda la pantalla (sin canvas visible)

---

## [1.10.0] — 2026-05-31

### Añadido
- Panel de info: dimensiones reales del archivo original (no de la miniatura de trabajo), DPI del archivo y tamaño de impresión nativo
- Colocación de fotos a tamaño nativo: al arrastrar al tablero, la foto ocupa el espacio que le corresponde según sus píxeles y el DPI del tablero
- DPI vuelve al panel de configuración del tablero (se había retirado en 1.9.x)
- Tablero variable: al colocar la primera foto, el zoom se ajusta automáticamente para mostrarla completa
- Tablero variable: el botón ⇔ (ajustar) ya no tiene límite mínimo de zoom — siempre muestra todo el contenido
- Zoom con rueda: mínimo reducido a 0,1 % (antes 5 %)
- Mac: el DMG incluye "Instalar Tableau.command" — un clic derecho → Abrir copia la app, elimina la restricción de seguridad y la abre

### Corregido
- El panel de información ya no muestra los KB de la miniatura de trabajo (dato incorrecto)
- Colocación de fotos: la herencia de tamaño entre fotos de diferente orientación (vertical/horizontal) ya no causa tamaños incorrectos
- Borrar el único tablero o proyecto ya deja el canvas correctamente inactivo (no se podían seguir añadiendo fotos sin tablero activo)
- Multi-arrastre desde biblioteca: las fotos se colocan a su tamaño real en lugar de a 320 px fijo
- Normalización del canvas variable: los ítems siempre se anclan al origen, evitando que el botón ⇔ deje de funcionar al dispersar contenido

---

## [1.9.10] — 2026-05-30
### Corregido
- Windows: el lanzador detectaba incorrectamente el servidor como activo tras cerrarlo — ya arranca siempre correctamente

---

## [1.9.9] — 2026-05-30
### Corregido
- Windows: el lanzador VBScript no establecía el directorio de trabajo correcto — la aplicación ya abre sin error

---

## [1.9.8] — 2026-05-30
### Añadido
- Windows: lanzador VBScript sin ventana de consola — la app abre directamente en el navegador

### Corregido
- Canvas: la alineación y distribución uniforme ya tienen en cuenta los marcos (paspartú y moldura) de cada foto
- Exportación JPEG: los marcos (paspartú y moldura) se renderizan correctamente en la imagen exportada

---

## [1.9.7] — 2026-05-30
### Añadido
- Pantalla de carga animada al arrancar (desaparece en cuanto React termina de compilar)
- Plantillas: sección en el panel lateral con comportamiento de acordeón (una sección abierta a la vez)
- Plantillas: edición directa en el canvas — clic en la plantilla del panel para abrirla, clic en un tablero para salir
- Plantillas: añadir contenedores desde la biblioteca (la foto se convierte automáticamente en placeholder)
- Plantillas: redimensionar contenedores manteniendo su ratio
- Plantillas: modal de configuración (unidades, DPI, dimensiones fijas) específico para la plantilla
- Plantillas: eliminación con confirmación; gestión solo desde el panel lateral (el picker de «Nuevo tablero» es solo selección)
- Biblioteca: indicador de ajuste de ratio al asignar foto a un contenedor (borde verde = encaja bien, ámbar = recorte moderado)
- Tablero: botón «Crear» deshabilitado hasta que se introduce un nombre

### Corregido
- Plantillas: los cambios al editar una plantilla no se persistían al volver a entrarla
- Plantillas: crear tablero desde plantilla no cargaba los items (race condition)
- Topbar: botones irrelevantes (Memoria, Versiones, Exportar…) ocultos durante la edición de plantilla; Cuadrícula permanece visible

---

## [1.9.6] — 2026-05-30
### Añadido
- Biblioteca: rechazar fotos desde el menú contextual (solo fotos no colocadas en ningún tablero); soporta selección múltiple
- Biblioteca: botón visual «Recuperar» en cada miniatura cuando la vista está filtrada a «Rechazadas»
- Biblioteca: contador de fotos con formato `[n]` en cabeceras de biblioteca, sección y botón de rechazadas
- Biblioteca: cabecera de sección alineada igual que la de biblioteca — nombre y `[n]` a la izquierda, botones a la derecha
- Biblioteca: el botón `+ Sección` se oculta en modo vista plana
- Tablero: opción «Enviar atrás» en el menú contextual de fotos, textos y mosaicos

### Corregido
- Servidor: el EXIF de las fotos no se guardaba al importar (faltaba extraer el campo en el endpoint de subida)
- Servidor: el parser EXIF fallaba silenciosamente porque sharp incluye el prefijo `Exif\0\0` antes del TIFF header
- Biblioteca: el mensaje de la barra superior ya no dice «crea uno en el panel izquierdo» cuando no hay ningún proyecto creado aún

---

## [1.9.5] — 2026-05-29
### Añadido
- Biblioteca: separador visual (línea punteada) entre la última sección y las fotos sin sección
- Biblioteca: arrastrar fotos entre secciones; la zona "sin sección" también es drop target
- Biblioteca: menú contextual con selección múltiple aplica "mover a sección" a todas las fotos seleccionadas; indica sección activa si todas comparten la misma
- Biblioteca: botón ☑ de seleccionar-todo en cada cabecera de sección
- Biblioteca: menú contextual incluye "Ver en pantalla completa" (solo selección individual)
- Visor pantalla completa: panel de info completo — dimensiones, tamaño, rating, tags, EXIF completo y tableros donde aparece la foto con navegación directa
- Tablero: "Ver en pantalla completa" disponible en el menú contextual de fotos colocadas en el tablero

### Corregido
- Biblioteca: deseleccionar (✕) ya limpia el anchor de Shift-click, evitando rangos inesperados en la siguiente selección
- Biblioteca: eliminado el badge de número de tags en las miniaturas

---

## [1.9.4] — 2026-05-29
### Añadido
- Sala: color individual por cara de bloque (N, S, E, O, Superior) con selector en el panel flotante del bloque
- Sala: duplicar sala desde el panel lateral (copia geometría, elimina vínculos de tableros)
- Sala: crear y gestionar salas desde el menú lateral, igual que los tableros
- Sala: renombrar y eliminar sala desde el panel lateral con botones de acción en hover
- Sala: al eliminar sala, opción (desmarcada por defecto) para eliminar también los tableros vinculados
- Sala: color de paredes visible en el plano 2D cuando se asigna un color personalizado
- Bloques: los botones de cara navegan al tablero si existe, o lo crean si no; eliminada la opción de desvincular
- Vista 3D: rotación de fotos (item.rot y freeRot) aplicada correctamente en caras verticales de paredes y bloques
- Vista 3D: fotos giradas 90°/270° en caras verticales con dimensiones y posición correctas
- Vista 3D: grids (mosaicos) en tableros de pared renderizados en 3D
- Vista 3D: notas excluidas del renderizado (solo fotos y textos)

### Corregido
- Vista 3D: el color asignado a una pared ahora se muestra en la vista 3D
- Vista 3D: la rotación de bloques en el plano se refleja correctamente en la vista 3D
- Sala: señalización visual de lado A/B con halo de contraste, visible sobre cualquier color de pared
- Sala: hover sobre botones de cara del bloque señala la cara en el plano
- Sala: botón de duplicar sala visible al hacer hover en el panel lateral
- Menú contextual de pared: eliminada la opción «Desvincular tablero»
- Temas oscuros: contraste de texto mejorado (--muted y --dim con ratio ≥4:1)
- Tema Oscuro·Frío: diferenciado visualmente del Oscuro·Ámbar con fondos más azules

---

## [1.9.1] — 2026-05-28
### Añadido
- Sala: bloques sólidos con etiqueta, color y dimensiones configurables desde el menú contextual del plano
- Sala: cada cara del bloque (N, S, E, O, Superior) puede vincularse a un tablero propio
- Sala: los tableros de caras de bloque aparecen anidados bajo su sala en el panel lateral
- Vista 3D: las fotos colocadas en tableros de caras de bloque se renderizan sobre el bloque
- Vista 3D: marcos (paspartú + moldura) se muestran en paredes y caras de bloque

### Corregido
- Vista 3D: la rotación de fotos en la cara superior del bloque ahora se muestra correctamente

---

## [1.9.0] — 2026-05-27
### Añadido
- Texto: tamaño libre (8–999 px) con botones de incremento inteligente, en lugar de tallas fijas S/M/L/XL
- Texto: negrita e itálica por elemento
- Texto: renderizado multilínea correcto en la vista 3D
- Arrastrar fotos: el indicador de arrastre diferencia tablero, mosaico y zona como destino
- Fotos en zona: al soltar una foto sobre una zona, se adapta automáticamente a sus dimensiones

### Corregido
- Mosaico: tras arrastrar una celda, el clic de finalización ya no iniciaba un intercambio no deseado
- Mosaico: «Quitar del mosaico» eliminaba todas las ocurrencias de la misma foto; ahora elimina solo la celda seleccionada
- Texto y notas: el color en tableros de tamaño fijo (fondo blanco) aplica contraste automático correcto
- Texto y notas: en paredes largas (p. ej. 15 m) ya no aparecen con tamaño minúsculo en la vista 3D
- Notas: ahora se muestran correctamente en la vista 3D

---

## [1.8.7] — 2026-05-27
### Corregido
- Vista 3D: las fotos colocadas en paredes de altura personalizada se posicionan correctamente (el eje vertical usa la altura física de la pared, no el fixedH del tablero)
- Vista 3D: los tableros de cara B (boardIdBack) ahora cargan sus items al entrar en la vista 3D
- Sala: al eliminar un vértice que borra paredes con tableros vinculados, el diálogo avisa y los elimina; al fusionar dos paredes el tablero de cara B ya no se pierde

---

## [1.8.6] — 2026-05-26
### Corregido
- Sala: al eliminar un vértice que borra paredes con tableros vinculados, el diálogo avisa con los nombres de los tableros afectados y los elimina si se confirma
- Sala: al fusionar dos paredes (eliminación de vértice intermedio), el tablero de cara B ya no se pierde

---

## [1.8.5] — 2026-05-26
### Añadido
- Vista 3D: esquinas de paredes con posts en vértices compartidos — uniones limpias a cualquier ángulo
- Sala: cada pared puede tener un tablero por cara — Cara A (interior) y Cara B (exterior) independientes
- Sala: color de pared independiente por cara (cara A y cara B)
- Sala: botones A/B en la barra lateral con franja de color identificativa; al pasar el ratón se resalta la cara en el plano 2D (rojo = A, azul = B)
- Sala: menú contextual diferencia cara A y cara B — color, tablero y sincronizar por separado
- Sala: snap a 45°/90° al arrastrar vértices existentes manteniendo Shift; también hace snap a vértices cercanos

---

## [1.8.4] — 2026-05-25
### Añadido
- Vista 3D: modo paseo en primera persona — flechas ↑↓ para avanzar/retroceder, ←→ para girar; clic en el canvas para capturar el ratón (rotación libre sin límite de borde)
- Vista 3D: clic en una pared o foto durante el paseo posiciona la cámara perpendicular a ella a 200 cm
- Vista 3D: instrucciones del modo paseo visibles en el overlay inicial y en el panel lateral derecho
- Vista 3D: la figura de escala humana se oculta automáticamente al entrar en modo paseo
- Biblioteca: fotos añadidas individualmente con clic aparecen en cascada diagonal (no apiladas en el mismo punto)

### Corregido
- Biblioteca: Shift+clic con varias secciones seleccionaba fotos de otras secciones; el rango ahora se restringe al mismo grupo (sección o sin sección)

---

## [1.8.3] — 2026-05-25
### Añadido
- Multi-sala: un proyecto puede tener varias salas; cada sala tiene su propio plano de planta y paredes
- Navegador: tableros agrupados bajo su sala, con flecha de colapso por sala
- Navegador: tableros sin sala cuelgan directamente del proyecto, sin etiqueta extra
- Sala: botón "Nueva sala" disponible desde el panel de sala (junto a las pestañas de sala)
- Biblioteca: vista plana (sin agrupación por sección) activable con un botón toggle
- Biblioteca: botón "Seleccionar todo" en la cabecera de cada sección; Ctrl+clic para selección múltiple; Shift+clic para selección por rango
- Presentación: modo zona rediseñado — las fotos se recomponen en pantalla completa lado a lado ignorando las posiciones del canvas; navegar entre zonas con ‹ ›
- Presentación: botón toggle "Ver zonas / Ver tablero" para cambiar de modo sin salir de la presentación
- Presentación: intercambio de fotos por clic disponible en todos los modos de presentación (tablero y zona)
- Presentación: canvas en solo lectura (sin arrastrar, redimensionar ni menú contextual)

### Corregido
- Planos de sala no se guardaban al finalizar el dibujo (PUT iba a `/rooms/undefined` por `id` ausente)
- Al crear un tablero para una pared, el tablero podía aparecer asignado a la sala incorrecta
- El elemento activo en el navegador podía iluminarse simultáneamente en sala y tablero; ahora solo hay un elemento activo
- Migración de `room.json` → `rooms.json` robustecida (no se omite si el archivo destino existe pero está vacío)
- Navegador: el contador de fotos en un tablero incluía zonas y notas; ahora solo cuenta fotos
- Presentación: el icono de selección se superponía al botón de eliminar en la biblioteca; reemplazado por borde de contorno
- Presentación en zona: aparecían 3 fotos en una pareja porque el arrastre asignaba `zoneId` a fotos no pertenecientes a ninguna zona
- Presentación en zona: el botón "Ver zonas" aparecía pero no hacía nada si la zona no tenía fotos asignadas
- Presentación en zona: el espacio de visualización era enorme cuando las fotos estaban alejadas en el canvas
- Intercambio de fotos en presentación: el swap intercambiaba también el `zoneId` rompiendo la pertenencia de zona; ahora solo cambia el `photoId`
- Arrastre: una foto sacada de una zona y vuelta a soltar dentro de una zona recupera correctamente su membresía

---

## [1.8.1] — 2026-05-23
### Añadido
- Vista 3D: figura de escala humana (175 cm) activable desde la barra de herramientas — tronco generado con `LatheGeometry` para un perfil orgánico continuo sin costuras; cabeza oval; articulaciones esféricas en hombros, codos, caderas y rodillas
- Vista 3D: botón "↔ Mover" para arrastrar la figura libremente por el suelo de la sala; desactiva la órbita mientras se arrastra y la restaura al terminar

---

## [1.8.0] — 2026-05-23
### Añadido
- Tableros fijos: guías de borde en tiempo real al seleccionar un elemento — cuatro líneas de puntos muestran la distancia a cada borde del tablero durante el arrastre
- Tableros fijos: distancias a bordes en el panel de información (esquina inferior izquierda), actualizadas fotograma a fotograma mientras se arrastra
- Tableros fijos: indicador de centrado — las guías se vuelven sólidas y ámbar cuando el elemento está centrado horizontal o verticalmente; el panel muestra "⊕ centrado H/V"
- Tableros fijos: snap al eje central del tablero (H y V) al arrastrar elementos; la guía ámbar aparece al acercarse al centro
- Arrastre restringido a un eje: mantener Shift mientras se arrastra bloquea el movimiento al eje dominante de los primeros pixels (horizontal o vertical), como en Photoshop
- Zoom suave con Ctrl+rueda: zoom continuo multiplicativo (×1.1 por tick) en lugar de saltos discretos
- Zoom: el porcentaje se muestra siempre en tableros fijos; el botón ⇔ ajusta la vista en ambos tipos de tablero
- Zoom: el botón − ya no queda atascado por encima del nivel establecido por "Ajustar vista" en tableros grandes

---

## [1.7.1] — 2026-05-22
### Añadido
- Zonas: cabecera de control (etiqueta, bloquear, eliminar) visible al seleccionar la zona; aparece como fantasma al pasar el cursor sin bloquear el acceso a las fotos
- Zonas: esquinas y bordes de redimensionado ahora visibles y funcionales (aparecen al pasar el cursor)

### Corregido
- Notas de texto ocultas en la vista 3D de sala (solo se muestran fotos y texto libre)
- Barra de control de notas simplificada: solo color, bloquear y eliminar; tamaño de fuente y memoria accesibles desde el menú contextual
- Texto de las notas ilegible en tableros fijos (fondo blanco): las notas con color personalizado usan texto oscuro automáticamente

---

## [1.7.0] — 2026-05-21
### Añadido
- Vista 3D: botón "Capturar" que guarda la vista actual como foto en la librería del proyecto
- Sala: aviso de desincronización pared/tablero — aparece cuando la longitud real de la pared difiere del ancho configurado en el tablero (en ambas direcciones)
- Sala: botón "Sincronizar" en la fila de pared afectada; actualiza el ancho del tablero para que coincida con la pared; bloquea la sincronización si hay fotos que quedarían fuera del nuevo ancho

### Corregido
- El handle de redimensionado de fotos aparecía lejos de la esquina inferior derecha al hacer zoom en el canvas (interacción incorrecta entre `calc(X/zoom)` y el CSS `zoom` del elemento)
- Arrastrar vértices en el plano de sala producía deriva progresiva del cursor; ahora usa `getScreenCTM().inverse()` para convertir coordenadas de pantalla a SVG con precisión
- Los botones de la barra de herramientas 3D eran invisibles con el tema claro de la aplicación

---

## [1.6.5] — 2026-05-20
### Añadido
- Al convertir una zona en tablero (Copiar o Mover), se abre un diálogo para escribir el nombre del tablero; viene pre-rellenado con la etiqueta de la zona o con "Tablero N" si no tiene nombre

### Corregido
- Pantalla negra al abrir la memoria del proyecto (error React #310): el efecto de inicialización del formulario estaba situado después de un retorno condicional, violando las reglas de hooks
- Las zonas ya no muestran el icono de imagen rota en la vista previa de la memoria; se renderizan solo las fotos y los textos
- Seleccionar o arrastrar un elemento ya no lo eleva automáticamente al frente; el orden z solo cambia con la opción explícita "Al frente" del menú contextual
- Los textos libres dentro de zonas ahora respetan el orden z y pueden situarse encima de las fotos con "Al frente"

---

## [1.6.4] — 2026-05-19
### Añadido
- Zonas: divisores visuales del tablero que agrupan fotos, notas y textos. Una zona arrastra todo su contenido al moverse. Se crean con clic derecho en el canvas y se pueden redimensionar desde cualquier lado o esquina
- Seis colores de zona disponibles (azul, verde, naranja, morado, rojo, neutro), configurables con clic derecho sobre la zona
- Convertir zona en tablero: el botón ⊞ de la zona crea un tablero nuevo con todo el contenido que contiene

### Corregido
- Las zonas no pueden soltarse dentro de otra zona; si se intenta, vuelven a su posición original
- Al mover una foto que pertenece a una zona, no pierde su membresía si sigue dentro de los límites de esa zona
- El redimensionado de zonas ya no roba el contenido de otras zonas que se solapen

---

## [1.6.3] — 2026-05-19
### Añadido
- Detección de fotos duplicadas al subir: si algún nombre coincide con una foto ya existente aparece un aviso con tres opciones — omitir los duplicados, añadirlos de todas formas o reemplazar los existentes conservando el mismo ID (los tableros no se ven afectados)
- Guías de snap durante el redimensionado: al arrastrar el handle de esquina se muestran guías cuando el borde derecho o la anchura coinciden con los de otras fotos en el tablero
- Herencia de tamaño al colocar fotos: si la foto que se añade al tablero tiene la misma proporción que la última colocada (diferencia < 3 %), hereda su anchura automáticamente

### Corregido
- Fuentes de texto libre correctas en la versión instalada: los archivos `.ttf` ahora se incluyen en el instalador; en versiones anteriores solo funcionaba Impact
- Posición del texto libre en exportación JPEG: el buffer de texto se extiende a las dimensiones exactas del elemento antes de rotar, corrigiendo el desplazamiento que aparecía al exportar
- El handle de redimensionado ya no se desplaza del cursor: se usa `movementX` incremental en lugar de coordenadas absolutas, evitando la deriva al hacer scroll en el canvas

---

## [1.6.2] — 2026-05-19
### Añadido
- Visor fullscreen: doble clic en una miniatura de la biblioteca abre la foto a pantalla completa; navega entre fotos con ← →, cierra con ESC o clic fuera
- Versiones de tablero: botón ⏱ en la barra superior guarda snapshots del estado del tablero; lista con fecha, número de elementos y botones para restaurar o eliminar cada versión
- Control de cuadrícula como desplegable: el botón "Guías" abre un menú con el toggle on/off, el selector de densidad y el imán (snap) agrupados; la barra superior queda más limpia

### Corregido
- Doble clic en miniatura ya no añade la foto al tablero antes de abrir el fullscreen

---

## [1.6.1] — 2026-05-18
### Añadido
- Copiar selección a nuevo tablero: botón ⊞ en la barra de selección del canvas; escribe el nombre del nuevo tablero y los elementos seleccionados se copian con la misma posición

### Corregido
- Las fuentes de los textos libres (Playfair Display, DM Sans, Bebas Neue, IBM Plex Mono) se renderizan correctamente en la exportación JPEG; en versiones anteriores todas se exportaban con la misma fuente
- El programa recuerda el proyecto y el tablero activos al recargar la página o reiniciar
- El desplegable de calidad de exportación se abría fuera de pantalla; ahora se despliega hacia abajo correctamente
- La calidad máxima de exportación JPEG sube a 100 (estaba limitada a 98)

---

## [1.6.0] — 2026-05-18
### Añadido
- Lectura EXIF: al importar una foto se extraen automáticamente cámara, objetivo, distancia focal, apertura, velocidad, ISO y fecha de toma; visibles en el panel de información lateral
- Plantillas de tablero: guarda el diseño del tablero actual como plantilla (⚙ Config → Guardar como plantilla); al crear un tablero nuevo aparece un selector para empezar desde una plantilla o en blanco; las plantillas se gestionan (borrar) desde el mismo selector
- Control de calidad en exportación JPEG: botón ▾ con tres opciones — Buena (JPEG 85), Alta (JPEG 92) y Máxima (JPEG 100 · tope 16 000 px)
- Textos libres en la exportación JPEG: los elementos de texto del tablero se renderizan correctamente en el fichero exportado con sus fuentes exactas (Playfair Display, DM Sans, Bebas Neue, IBM Plex Mono)

### Mejorado
- Pipeline de exportación JPEG sin pérdida intermedia: los buffers de procesado por capas pasan a PNG lossless; solo el fichero de salida final se comprime como JPEG
- Tope de resolución de exportación aumentado de 7 000 a 10 000 px (16 000 px en modo Máxima)

---

## [1.5.4] — 2026-05-17
### Mejorado
- Color del grid corregido en todos los temas: cada tema define su propio color de guías optimizado para contraste; en el tema Claro · Natural el grid ya es visible (antes era casi idéntico al fondo)
- El grid ya no se pinta cuando el zoom es tan bajo que las líneas serían sub-píxel; el botón **Guías** se atenúa y muestra un tooltip explicativo en ese caso
- Los controles de densidad e imán (visibles cuando el grid está activo) ya no desplazan los botones de la barra al activarse o desactivarse el grid

---

## [1.5.3] — 2026-05-17
### Corregido
- El botón **↑ Subir ▾** no abría el desplegable (el menú quedaba oculto detrás del layout)
- Los controles de foto en el canvas no respondían al clic cuando el desplegable había fallado al abrirse (overlay invisible bloqueaba la interacción)
- La biblioteca se colapsaba al pulsar el botón ↑ de subida en una sección
- Shift+clic seleccionaba desde la foto pulsada hasta el final porque el anchor no se limpiaba al mover la selección a una sección
- La selección de la biblioteca no se limpiaba al finalizar una subida de archivos

---

## [1.5.2] — 2026-05-17
### Añadido
- Progreso de subida: barra en la parte inferior con el nombre del archivo actual, contador N/Total y barra de progreso animada mientras se suben fotos
- Subir fotos directamente a una sección: botón **↑** en la cabecera de cada sección para subir archivos que quedan asignados automáticamente a esa sección; arrastrar archivos desde el explorador sobre una sección también los asigna a ella (la sección se ilumina al pasar por encima)
- Mover selección múltiple a sección: botón **⊞ Sección** en la barra de selección de la librería para mover todas las fotos seleccionadas a una sección de golpe
- Botón de subida unificado: los botones *+ Carpeta* y *+ Subir foto* se fusionan en un único botón **↑ Subir ▾** con desplegable

---

## [1.5.1] — 2026-05-17
### Añadido
- Secciones en la librería: crea secciones colapsables para agrupar fotos; botón **+ Sección** en la cabecera de la librería; las secciones se renombran y eliminan con los botones que aparecen al pasar el ratón; clic derecho sobre una miniatura para mover la foto a una sección; las secciones se exportan e importan con el ZIP del proyecto
- Selección por rango en la librería: **Shift + clic** selecciona todas las fotos entre la última seleccionada y la que se pulsa, sin necesidad de haber hecho Ctrl+clic primero
- Silenciar librería: botón **◎ Silenciar** en la cabecera de la librería que oculta temporalmente todos los indicadores visuales sobre las miniaturas (estrellas, etiquetas, indicador de brillo, botones) para ver las fotos sin ruido visual
- Exportación en tableros fijos: el JPEG exportado respeta exactamente las dimensiones configuradas del tablero en lugar de recortar al contenido
- Borde exterior al exportar: los tableros variables permiten configurar el espacio en blanco alrededor de las fotos en el JPEG exportado (⚙ Config → *Borde exterior al exportar*)

### Corregido
- El scroll de la librería no funcionaba cuando había muchas fotos; ahora el contenido se desplaza correctamente
- El volteo horizontal/vertical de las fotos no se aplicaba en el JPEG exportado; ahora se refleja correctamente
- Los botones de subir carpeta y subir foto aparecían separados por otros controles; vuelven a estar juntos

---

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
