# Plan: vinculación hover bidireccional + rediseño del panel de pared

Dos trabajos relacionados pero de tamaño muy distinto. Se hacen por
fases, de menor a mayor riesgo. Cada fase es liberable.

Contexto: la Fase 3 (tableros por pared) ha llegado hasta 3c (vista
frontal con arrastre y snap). Quedan pendientes 3d (arrastrar desde
plano con "soltar para levantar") y 3e (mover entre paredes), que son
independientes de este plan. Este documento cubre el rediseño del panel
lateral y la vinculación hover, que el panel saturado hizo necesarios.

---

## Decisiones cerradas

- **Vinculación bidireccional** vía un único `hoveredBoardId` compartido
  que todas las vistas observan.
  - Hover en árbol izquierdo → resalta la PARED del tablero en el plano
    2D (solo cuando el plano está visible; limitación aceptada).
  - Hover en plano 2D o sobre obra en 3D → resalta el tablero en el
    árbol (color de acento `--acc`).
  - En el plano se resalta la pared entera, no el tablero individual
    (el plano es esquemático; la precisión por tablero vive en la vista
    frontal).
  - SIN etiqueta de pared en el árbol (el resaltado ya da esa info).
- **Navegación a editar un tablero (B + toque de C):**
  - Desde el árbol izquierdo (ya funciona).
  - Doble clic sobre un tablero en la vista frontal → editar en canvas.
  - El panel de pared NO navega a tableros.
- **Árbol izquierdo PLANO** bajo la sala. Sin anidamiento por pared.
- **Panel de pared rediseñado:** config de sala + lista de paredes
  simple. La gestión de tableros (vincular, crear, quitar, posicionar)
  se traslada a la vista frontal.

---

## FASE A — Vinculación hover bidireccional
Victoria rápida, independiente, bajo riesgo. No toca la estructura del
panel. Modelo: Sonnet.

- Estado compartido `hoveredBoardId` (+ ref si hace falta para
  handlers, patrón estado+ref).
- Árbol: onMouseEnter sobre la fila de un tablero → setHoveredBoardId.
  onMouseLeave → null. La fila se resalta con `--acc` cuando su id ===
  hoveredBoardId.
- Plano 2D: cuando hoveredBoardId está activo, resaltar la pared que
  contiene ese tablero (vía wallLinksBoard / boardsA/boardsB).
  Reutilizar el resaltado de hover de pared existente. Solo si el plano
  está visible.
- Plano 2D inverso: hover sobre una pared/tablero en el plano →
  setHoveredBoardId del tablero correspondiente → se resalta en el árbol.
- 3D: hover sobre una obra (mesh con userData.boardId) →
  setHoveredBoardId → se resalta en el árbol. Limpiar al salir del hover
  y al salir de la vista 3D.

Criterio: hover en cualquiera de las tres superficies resalta el
tablero en las demás donde esté representado. Sin parpadeos. El
resaltado del plano solo aparece con el plano visible.

---

## FASE B — Dar capacidades de gestión a la vista frontal
Prerrequisito del rediseño del panel: ANTES de vaciar el panel, la vista
frontal debe saber hacer todo lo que hoy se hace desde él. Aditivo, no
rompe el panel todavía. Modelo: Sonnet.

La vista frontal (que ya tiene toggle A/B y arrastre) gana:
1. **Añadir tablero a la cara activa:** un botón "+" en la vista frontal
   que permite vincular un tablero existente (libre) o crear uno nuevo
   en la cara mostrada (A o B según el toggle). Reutiliza
   createRoomBoardSide / handleDropBoardOnWall y las validaciones de
   Fase 2 (copia si ya vinculado, copia fija si variable).
2. **Quitar un tablero de la cara:** acción sobre cada tablero en la
   vista frontal (desvincular → vuelve al árbol principal). Reutiliza
   unlinkBoardFromWall.
3. **Editar contenido:** doble clic sobre un tablero en la vista frontal
   → navega al canvas de ese tablero (setBid). Cierra el modal.
4. **Aviso de desincronía** por tablero (altura ≠ pared) visible aquí.

Criterio: todo lo que el panel permite hacer con tableros se puede hacer
ya desde la vista frontal. El panel sigue intacto en esta fase (las dos
vías coexisten temporalmente).

---

## FASE C — Rediseño del panel de pared (vaciado)
Solo cuando la Fase B está completa y probada. Modelo: Sonnet.

- Cada pared se colapsa a una fila simple:
  - Nombre + longitud.
  - Botón "abrir vista frontal" (la puerta de entrada permanente).
  - Indicador ligero: nº de tableros de la pared.
  - Punto de aviso (·) si algún tablero de la pared está desincronizado.
- Se ELIMINAN del panel: botones A/B, "+", "▶", el ⚠ inline por cara,
  las filas por cara. Toda esa gestión ya vive en la vista frontal (B).
- Config de sala (altura de techo, grosor) se mantiene arriba.
- Verificar que nada que sólo existía en el panel se pierde (censo de
  acciones del panel antes de retirarlas).

Criterio: el panel queda legible y estable con N tableros por cara. Toda
la gestión sigue siendo posible (desde la vista frontal). Nada se pierde.

---

## Orden y liberación

| Fase | Qué | Riesgo | Libera |
|------|-----|--------|--------|
| A | Hover bidireccional | Bajo | Sí |
| B | Gestión en vista frontal | Medio | Sí (coexiste con panel) |
| C | Vaciar el panel | Medio | Sí |

Fase A se puede hacer y liberar ya. B y C son secuenciales (C depende
de B). Las Fases 3d y 3e de tableros-por-pared quedan pendientes y son
independientes de este plan; se retoman cuando se decida.
