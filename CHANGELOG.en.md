# Changelog

## [1.23.6-fase3b] — 2026-06-21

### New
- **Rooms — Wall front view (Phase 3b):** double-clicking a wall in the SVG floor plan opens a read-only visualisation modal (owner only). Shows the wall surface to scale (length × ceiling height) with the wall's background colour. Each linked board appears as a rectangle positioned by its horizontal `offset` and vertical `hangY`, with actual content (photo thumbnails, text) scaled proportionally inside. An A/B toggle in the header switches between the two faces. Close with ESC or clicking outside. Read-only: nothing is draggable yet (reserved for Phase 3c). Blocks are not touched.

## [1.23.5-fase3a] — 2026-06-21

### Internal (no visible change)
- **Rooms — Phase 3a: per-board vertical position model:** each `boardsA`/`boardsB` entry expands from `{boardId, offset}` to `{boardId, offset, hangY}`, where `hangY` is the height of the board's centre above the floor in cm.
  - Full lazy migration: `normalizeWall` now always iterates all entries (even when the wall already has `boardsA`/`boardsB`) and guarantees `hangY ?? 150` and `offset ?? 0`. Legacy rooms are normalised on the first `loadRooms` without any data rewrite.
  - `normalizeWall` updated in both `server.js` and `index.html` (both copies identical).
  - 3D renderer: `wallSides` now propagates `hangY: e.hangY ?? 150`; the `forEach` destructures `hangY`; `hangCenterY` is no longer a hard-coded constant — it reads the entry value. The room looks pixel-for-pixel identical to Phase 2 (all existing boards have `hangY = 150`).
  - `hangCenterY` variable structured for Phase 3b (per-board vertical-position UI).

## [1.23.4] — 2026-06-21

### Fixed
- **Rooms — wall boards:** when linking a variable board, the fixed copy's bounding box computed the wrong height because it used the stored `item.h` (undefined or stale for photo items). Each photo's height is now derived from the `photo.h/photo.w` ratio (or its inverse for 90°/270° rotation), mirroring the canvas rendering formula exactly. Item coordinates in the copy are also shifted by subtracting the bounding-box origin so content starts at (0,0) and is not clipped.
- **Rooms — 3D view:** the renderer stretched boards vertically to fill the full wall height. It now uses the board's physical height (`fixedH`) to scale items, and anchors the board centre at 150 cm above the floor (museistic standard). The `hangCenterY` variable is structured for per-board configurability in a future phase.

## [1.23.3-fase2b] — 2026-06-21

### Improved
- **Rooms — validations when linking a board to a wall:**
  - **Board already linked to another wall/face:** instead of sharing the same board across two locations, a copy is created (via `duplicate`) and the copy is linked. The original is left untouched. The toast message states which wall it was already on.
  - **Variable board:** instead of asking whether to resize to the wall dimensions, the content bounding box (photo/text items, excluding notes and zones) is computed in the board's units via its DPI, a fixed copy with those dimensions is created, and the copy is linked. The original variable board is left untouched.
  - **Empty variable board (no physical items):** blocked with a toast; no copy is created and nothing is linked.
  - **Free-space warning:** if the copy's width (in cm) exceeds the remaining free space on the face, the toast appends "Takes X cm; Y cm free."
  - Linked copies appear automatically nested under the room in the board tree (via `roomOfBoard`/`wallLinksBoard`).
  - Fixed boards not already linked anywhere are still assigned directly, without a copy.

## [1.23.2-fase2] — 2026-06-21

### Improved
- **Rooms — multiple boards per wall face (Phase 2):** a face A or B can now hold N boards placed sequentially. Each board uses its own `fixedW`; successive boards are placed flush against the previous one with no gap (`offset = ΣfixedW` of predecessors).
  - Side panel: each face now shows a list of rows (one per board) with individual navigate and unlink buttons. A `+` button always visible at the bottom of each face to add another board.
  - `+` button / `createRoomBoardSide`: first board gets `fixedW = len` (full wall); additional boards get `fixedW = len/2` as a starting point the user can adjust. Name includes a numeric suffix from the 2nd board onward.
  - Drag & drop: dropping a board onto a face adds it to the list instead of replacing. Silent skip if the same board is already linked. Mismatch check applies only to the first board in the face.
  - Unlink (`unlinkBoardFromWall`): removes the board by `boardId` and repacks the offsets of the remaining boards so they stay flush in sequence.
  - 3D renderer: removed the `Math.min(fW, wallFaceLen)` clamp — each board renders its full fixed width from its offset, potentially extending beyond the wall (overlap warnings will come in Phase 4).

## [1.23.1-fase1] — 2026-06-21

### Internal (no visible change)
- **3D wall renderer — Phase 1:** the render loop now iterates directly over `boardsA`/`boardsB` entries instead of a fixed board per face. Each entry propagates its `offset` into the horizontal position calculation (`ix`), ready for Phase 2 where boards will have non-zero offsets. With offset = 0 (this phase) the room looks pixel-for-pixel identical.
  - `wallSides` entries now include `offset: e.offset || 0`.
  - `ix = startOffset + offset + (item.x + item.w/2) / bPx.w * Math.min(fW, wallFaceLen - offset)`.
  - Code annotations for Phase 2 (remove `Math.min` clamp) and Phase 3 (per-segment context-menu plane, per-segment hit-testing on wall body).

## [1.23.0] — 2026-06-21

### Internal (no visible change)
- **Room model — groundwork for multiple boards per wall face (Phase 0):** migration from the scalar `boardId`/`boardIdBack` field on walls to a list model `boardsA`/`boardsB` (array of `{boardId, offset}`). In this phase each face still has at most one board; app behaviour is unchanged.
  - Lazy server-side migration (`loadRooms`): legacy rooms are normalised in memory on load; the new format is persisted on the next natural save.
  - Defensive client-side normalisation: rooms received from the API pass through `normalizeRoom` before entering React state.
  - New helpers: `normalizeWall`, `wallBoardIds`, `wallLinksBoard`, `wallSideBoard`, `normalizeRoom` (client and server).
  - All wall read/write sites (`roomBoardIds`, 3D view, SVG, side panel, context menu, vertex merge, ZIP import, duplicate room, delete room/vertex) updated to the new model.

## [1.22.11] — 2026-06-17

### Improved
- **Library — "Unplaced" filter: new "In this board" scope:** the scope selector adds a third option that shows photos not placed in the active board (bid), even if they appear in other boards of the same project. Only shown when a board is active.
- **Library — orientation filter tooltip:** when clicking to cycle null→L→P→S→null, the `#tt` div kept showing the old value because the tooltip system only captures `data-tooltip` on `mouseover`. Fix: the `onClick` explicitly computes the next value and synchronously updates `#tt.textContent` when the tooltip is visible.

### Fixed
- **Library — photos inside grids not recognised as placed:** the check for whether a photo was placed in the active board only looked at `item.photoId` (standalone photos), ignoring `item.photoIds[]` from grid items. This affected the "IN TABLEAU" badge on thumbnails, the "Unplaced" filter across all three scopes (project, room, board), and the `photoBoardNames` / `photoBoardsDetailed` / `photoBoardsWithContext` helper functions. Fix: new `isPhotoInBoardItems` helper that checks both fields, applied at every affected call site.

## [1.22.10] — 2026-06-17

### Improved
- **Canvas scrollbars — more visible and easier to use:** scrollbars are now 8 × 8 px (twice as wide/tall) with rounded corners and colours that contrast better against the board background. Hovering over the thumb changes to a lighter colour for better visual feedback.

### Fixed
- **Variable board — visual jump when moving items:** `normalizeItems` shifted all items left/up whenever there was empty space (minX > 0 or minY > 0), even when all items were at positive coordinates. When scroll was already at 0, the compensation could not be applied (scroll cannot go negative) and the canvas jumped visually. Fix: normalization now only fires when an item has a negative coordinate (minX < 0 or minY < 0) — the only case where it is actually necessary to prevent items from going off the visible area.
- **Variable board — first photo snapping to left edge:** when adding the first photo to an empty variable-size board, `applyNormalized` shifted its `x` to 0 (the `minX` of a single-element array was the item's own `x`), ignoring the cursor position. Fix: normalization is skipped when the board was empty (`wasEmpty`); the photo lands where the user dropped it and `fitWidth()` adjusts the view. Subsequent photos continue to normalize correctly.
- **3D view on mobile — pinch-to-zoom not working:** `controls.enableZoom` was `false` (wheel zoom was handled by a custom proportional handler), which also disabled OrbitControls' pinch-to-zoom. Fix: `enableZoom = true` — OrbitControls now handles both mouse wheel and two-finger pinch; the manual `onCanvasWheel` handler is removed; and `renderer.domElement.style.touchAction = 'none'` is added so the browser does not intercept touch gestures before they reach Three.js.

## [1.22.9] — 2026-06-17

### Improved
- **Shared 3D view — mobile experience:** on touch devices (`window.innerWidth < 768 || 'ontouchstart' in window`) the canvas now fills 100% of the viewport; the mouse-instruction side panel is not rendered (mouse instructions are meaningless on touch); the button bar shows only Reset view, Person, and 💬 (if comments are enabled), all with a minimum 44 × 44 px touch target; Walk and Snapshot buttons are hidden; the walk-mode instruction overlay is suppressed; and OrbitControls explicitly enables one finger = orbit, two fingers = zoom/pan via `controls.touches = { ONE: TOUCH.ROTATE, TWO: TOUCH.DOLLY_PAN }`. Desktop behaviour is unchanged.

### Fixed
- **3D view — clicking text elements did not open artwork view:** text meshes are in `itemMeshes` and are hit by the raycaster, but `openFrom3D` exited immediately with `if (!ud.photoId) return`, blocking any element without a `photoId`. Fix: the guard is now `if (!ud.itemId && !ud.photoId) return`, allowing text items (which have `itemId` but no `photoId`) to proceed and open the individual artwork view correctly.
- **3D orbital view — camera angle limit:** the camera could orbit below the floor plane. Added `controls.maxPolarAngle = Math.PI * 0.48`, capping the orbit just above the horizon and preventing impossible angles in a real gallery.
- **Artwork view — board navigation order did not match the left panel:** `openFrom3D` built `roomPhotos` by iterating `room.walls` and `room.blocks` in geometric order, ignoring the order defined by the user in the left sidebar. Fix: all `boardId`s linked to the room are collected, sorted by their position in `boards[]` (the array that reflects the sidebar order), and `addBoard` is called in that order. The order of items within each board (by X position) is unchanged.

## [1.22.8] — 2026-06-16

### Fixed
- **Artwork view — ← → keyboard keys did not await the 3D scene Promise:** the keyboard handler was not `async` and updated state directly via `setArtwork3D()`, bypassing `navigateToRoomItem`. This caused keyboard navigation to skip the `await room3DReadyPromiseRef.current` that the on-screen arrow buttons correctly respect, resulting in broken transitions if the 3D scene had not yet finished loading. Fix: the handler is now `async`; ← → keys read `artwork3DRef.current` and call `await navigateToRoomItem(rp, n)`.
- **Artwork view — ← → keys inactive at level 1 (zone/grid):** the keyboard handler only checked `artwork3DRef.current` (level 2 — individual photo); when room navigation landed on a zone or grid (level 1), ← → did nothing even though the on-screen buttons worked. Fix: `artwork3DZoneRef` is introduced following the existing state+ref dual pattern; the handler merges the level-1 block for zone and grid, responds to ← → in both cases with `await navigateToRoomItem`, and also fixes Escape from zone drilldown (now returns to level 1 overview instead of closing the entire artwork view).
- **Zone view — incorrect member positions:** the zone overview used `zone.w/zone.h` (the canvas frame) as the bounding box for scaling and positioning; if members did not start exactly at the `(zone.x, zone.y)` corner of the frame, they appeared shifted. Fix: scale and container are now computed from the **real member bounding box** (`minX/minY/maxX/maxY` in zone-relative coordinates), and each member is positioned by subtracting `minX/minY` from its relative offset, ensuring the layout fills the viewport correctly. Additionally, photo item heights were falling back to `m.w` when `m.h` is `undefined`; fix: the actual height is now derived from `photoMap` via `Math.round(m.w * photo.h / photo.w)`, correcting both the vertical bounding box and each member's rendered height.

## [1.22.7] — 2026-06-16

### New
- **Backup panel in Settings (local mode):** new "Backups" tab in the Settings modal, available only in local mode (no authentication). Allows enabling/disabling automatic backups, configuring the interval (in hours) and maximum number of copies to retain. Shows the list of existing backups with date and size. From the list you can trigger a manual backup, delete an individual copy, or restore the system from any backup (with confirmation and an automatic snapshot before restore). Configuration is saved to `data/config.json` and persists across server restarts, overriding environment variables.

### Improved
- **Help tips in Settings:** the "Help tips" section (formerly "Getting-started guides") now only appears when the user has dismissed at least one tip — if there is nothing to reset, the option is not shown. An explanatory description is added. Both the label and the behaviour are clearer.
- **"Backup now" button:** shows a loading state (`…`) while the backup is in progress and is disabled to prevent simultaneous runs. The backup list refreshes automatically on completion.

## [1.22.6] — 2026-06-16

### Fixed
- **← → navigation before room data is ready — robust solution:** the boolean `room3DReady` flag was not sufficient: the user could press the arrows before the React state update cycle completed and see empty zones or grids. Fix: `initScene` creates a `Promise` that resolves once `boardItemsMap` and `room3DPhotoMapRef` are fully populated; `navigateToRoomItem` is now `async` and `await`s that Promise before executing any navigation. The ← → arrows are no longer visually disabled — the user can press them at any time and navigation simply waits for data to be available.

## [1.22.5] — 2026-06-15

### New
- **"Le Gras" theme** (renamed from "Oscuro · Ámbar"): completely neutral pure grey palette inspired by the first photograph in history — Niépce's heliograph (1826). No colour tint, pure monochromatic greys. Adjusted --sub (#d0d0d0), --muted (#b8b8b8) and --dim (#606060) for clear readability on dark background.
- **Artwork view M1 — owner/visitor parity:** the owner now has exactly the same experience as a shared-room visitor in the artwork view. Zones: overview of all members scaled on the wall colour, with drilldown to individual items. Grids: full mosaic view with room ← → arrows. Loose texts: fullscreen view with exact typography and alignment on wall colour. ← → navigation traverses all room-level items (loose photos, zones, grids, texts) sorted by X position.
- **Artwork view M1 — wall colour background:** all views (individual photo, zone overview, grid) now show the colour of the wall/block where the board is mounted as the background. Control colours (arrows, counter, ← Back button) adapt automatically based on background luminance.
- **Frames in artwork view:** photos are displayed with their mat and moulding as configured on the board, scaled proportionally to the on-screen display size.
- **Owner extras in artwork view:** physical dimensions with DPI, board name, and "Edit in board →" button to go directly to the canvas.

### Fixed
- **Context menus clipped at viewport edge:** right-click menus (canvas items, grids, rooms, vertices, columns, walls) were cut off when appearing near the right or bottom edge of the screen. Fix: the menu renders at cursor position and, after mounting in the DOM, adjusts if its bounding rect overflows the viewport.
- **Frame panel clipped at viewport edge:** the mat/moulding panel was clipped when the photo was near the edge of the visible area, because it lived inside the `.bitem` element affected by `overflow:hidden` and canvas zoom. Fix: the panel is now mounted outside the canvas wrapper with `position:fixed` and clamped viewport coordinates, matching the Properties modal approach.
- **Artwork view — ← → arrow navigation for zones, grids and texts (owner and visitor):** `navigateToRoomItem` read `allBoardItemsRef.current` to compute zone members when navigating with arrows; in owner mode this ref was overwritten on 3D entry (with only the room-linked boards) and in visitor mode it was never populated. Fix: zone members are pre-computed when inserting each zone entry into `roomPhotos` inside `openFrom3D`, which already uses the local `boardItemsMap` (always in sync with rendered meshes); `navigateToRoomItem` reads them from `next.members` without relying on any external ref.
- **Artwork view ← → navigation order:** the `roomPhotos` array was globally sorted by `item.x`, mixing items from different boards and breaking the physical room traversal order. Fix: within `addBoard`, each board's items are sorted by `item.x` before being appended; the `addBoard` call order (walls in sequence → block faces in sequence) determines the order across boards.
- **Zone and grid empty when navigating with ← → immediately after room loads:** `openFrom3D` and `navigateToRoomItem` used `photosRef.current` (React state) to build the photo map for zones and grids. In the first seconds of a session that ref is empty even though boards are already rendered in 3D, because the project photos async load hadn't yet completed its render cycle. Fix: `initScene` stores its local `photoMap` (built from the API in the same `Promise.all` as board items) in `room3DPhotoMapRef`; both `openFrom3D` and `navigateToRoomItem` now use that ref instead of `photosRef.current`.
- **Zone and grid empty when navigating very quickly with ← → on entering 3D:** `navigateToRoomItem` could run before `initScene` finished loading data (boardItemsMap + photoMap). Fix: new `room3DReady` state (false on 3D entry, true when `initScene` completes); `navigateToRoomItem` returns early if `!room3DReady`; ← → arrows show at opacity 0.4 with no pointer events while the scene is not yet ready; all three views (photo, zone, grid) display a "Loading…" spinner instead of empty content during that window.
- **Frame clipped in artwork fullscreen view:** the `box-shadow` simulating mat and moulding extended beyond the viewport because the image reached its `.fullscreen-img` maximum before the frame was added. Fix: the `<img>` receives `maxWidth`/`maxHeight` that subtract `2 × (matD + moldD)` from the available space, shrinking the image enough for the `box-shadow` to fit within the viewport.

## [1.22.4] — 2026-06-15

### Fixed
- **Photo view — black background instead of wall colour:** individual photos and grid cells in the artwork view were displaying a black background instead of the wall colour of the board they were placed on. Zone and text views already handled this correctly. Fix: the photo view and grid Level 1 view now apply `wallColor` (propagated from `openFrom3D`) as the overlay background, consistent with zone and text views.
- **Label and indicator contrast on light backgrounds:** the ← Back button, ← → arrows, "X of N" counter, photo labels, and dimension text used a fixed white colour. On light wall backgrounds (beige, cream, white) these were invisible. Fix: all overlay elements now derive their colour via `bgContrast(wallColor)` and use semi-transparent black when the background is light.

## [1.22.3] — 2026-06-15

### New
- **Artwork navigation redesign (M1):** the ← → navigation now covers ALL room-level elements across all boards, ordered by X position: standalone photos, grids, zones, and texts. Previously it only navigated photos.
- **Zone view in 3D:** clicking or double-clicking a zone member in the 3D view opens a fullscreen view of the complete zone, with the wall colour as background. All zone items (photos and texts) are rendered to scale with frames. Clicking an item within the zone enters drilldown (← → navigates within the zone).
- **Text view in 3D:** text items (standalone or as zone drilldown) have their own fullscreen view rendering the text with exact typeface, size, weight, and alignment on the board's wall colour background.
- **Room nav arrows at Level 1:** grid and zone Level 1 views now show the ← → room navigation arrows with the "X of N" counter, matching the individual photo view.

### Fixed
- **Artwork view in shared room (?room=TOKEN) — no navigation arrows or grids:** when opening a photo in room visitor mode, the ← → navigation arrows between artworks did not appear and grids could not be opened. Root cause: `openFrom3D` built the navigation array (`roomPhotos`) by reading `allBoardItemsRef`, which is not initialised in room-share mode (it is only populated in owner mode). Fix: `openFrom3D` now uses `boardItemsMap` (a local variable in `initScene`, always in sync with the rendered meshes), which works in both modes.

## [1.22.2] — 2026-06-15

### Fixed
- **Artwork view in shared room (?room=TOKEN) — no navigation arrows or grids:** when opening a photo in room visitor mode, the ← → navigation arrows between artworks did not appear and grids could not be opened. Root cause: `openFrom3D` built the navigation array (`roomPhotos`) by reading `allBoardItemsRef`, which is not initialised in room-share mode (it is only populated in owner mode). Fix: `openFrom3D` now uses `boardItemsMap` (a local variable in `initScene`, always in sync with the rendered meshes), which works in both modes.

## [1.22.1] — 2026-06-15

### Fixed
- **Multiple dropdowns open simultaneously in topbar:** when clicking the avatar with preferences open (or vice versa), both menus remained visible. Fix: each dropdown button (avatar, preferences, export, grid) now closes all others before opening its own. Only one dropdown can be open at a time in the topbar.
- **Artwork view from 3D — click did not respond:** OrbitControls was consuming the `click` event before it reached the artwork view handler. Fix: listeners changed from `mousedown`+`click` to `pointerdown`+`pointerup` with a movement threshold check (4 px), which OrbitControls does not intercept.
- **Perpendicular snap in walk mode — jarring second phase:** when clicking a wall in walk mode, camera position moved with easing but the camera orientation was applied abruptly at the end of the tween. Fix: yaw/pitch now interpolates in parallel over the same 500 ms with the same quadratic easing, with no direct assignment at completion.

### New
- **Double-click in 3D view → artwork view:** in orbit mode (in addition to the existing single click) and in walk mode, double-clicking a photo opens the artwork fullscreen view. In walk mode, double-click opens the artwork without interfering with single-click behaviour (perpendicular camera snap).
- **Theme renames:** "Alto Contraste" → **Rochester**; "Oscuro · Frío" → **Tokyo**.

## [1.22.0] — 2026-06-14

### Fixed
- **ZIP import — zones and grids lose their photos:** when importing a project, photos that belonged to a zone lost their `zoneId` (appearing detached) and grids appeared empty. Root cause: the ID remap only covered `item.photoId`. Grids use `item.photoIds` (a flat ID array) and zones use `item.zoneId` which references the zone item's ID (not a photoId). Fix: new IDs are pre-generated for all items before writing (to build `itemIdMap`), and `item.zoneId` and `item.photoIds[]` are also remapped.
- **Linked wall color in room floor plan:** walls with an assigned board appeared white/gray even though the board was correctly linked. Root cause: if `wall.color` had any saved value (e.g. the default `#d0c8bc` accidentally captured by the color picker), that branch short-circuited the `linked` logic before the accent was evaluated. Fix: in the 2D floor plan the `linked` state takes absolute priority over the custom color.
- **Panel open after ZIP import:** when confirming a project import, the sidebar and navigation section open automatically, showing the imported project, regardless of whether the user had them collapsed.
- **Theme renames:** "Alto Contraste" (High Contrast) is now **Rochester**; "Oscuro · Frío" (Dark Cool) is now **Tokyo**.
- **Artwork view from 3D — click did not respond:** OrbitControls was consuming the `click` event before it reached the artwork view handler. Fix: listeners changed from `mousedown`+`click` to `pointerdown`+`pointerup` with a movement threshold check (4 px), which OrbitControls does not intercept.
- **Multiple dropdowns open simultaneously in topbar:** when clicking the avatar with preferences open (or vice versa), both menus remained visible. Fix: each dropdown button (avatar, preferences, export, grid) now closes all others before opening its own. Only one dropdown can be open at a time in the topbar.
- **Perpendicular snap in walk mode — jarring second phase:** when clicking a wall in walk mode, camera position moved with easing but the camera orientation was applied abruptly at the end of the tween. Fix: yaw/pitch now interpolates in parallel over the same 500 ms with the same quadratic easing, with no direct assignment at completion.

### New
- **Double-click in 3D view → artwork view:** in orbit mode (in addition to the existing single click) and in walk mode, double-clicking a photo opens the artwork fullscreen view. In walk mode, double-click opens the artwork without interfering with single-click behaviour (perpendicular camera snap).
- **Artwork view from 3D (M1):** clicking a photo in the 3D view (outside walk mode and with no active clipboard) opens the artwork fullscreen. ← or ESC closes it and restores the exact camera position. ← → navigates all photos in the room in order (walls → blocks) with circular looping. The bottom panel shows the item label, physical dimensions calculated from the board DPI, and published public comments. Grids first show the full grid fullscreen (Level 1); clicking a cell opens the individual photo (Level 2) with navigation between the grid cells. Works in visitor mode (?room=TOKEN).
- **Label HUD in 3D view:** hovering over an artwork that has a label shows its name in a centered overlay at the bottom of the canvas. Artworks without a label show nothing. The HUD is hidden automatically in walk mode (mouse captured) and when leaving the 3D view.

## [1.21.19] — 2026-06-14

### Fixed
- **ZIP import — zones and grids lose their photos:** when importing a project, photos that belonged to a zone lost their `zoneId` (appearing detached) and grids appeared empty. Root cause: the ID remap only covered `item.photoId`. Grids use `item.photoIds` (a flat ID array) and zones use `item.zoneId` which references the zone item's ID (not a photoId). Fix: new IDs are pre-generated for all items before writing (to build `itemIdMap`), and `item.zoneId` and `item.photoIds[]` are also remapped.
- **Linked wall color in room floor plan:** walls with an assigned board appeared white/gray even though the board was correctly linked. Root cause: if `wall.color` had any saved value (e.g. the default `#d0c8bc` accidentally captured by the color picker), that branch short-circuited the `linked` logic before the accent was evaluated. Fix: in the 2D floor plan the `linked` state takes absolute priority over the custom color — if the wall has a linked board it always paints with `--acc`; the custom color only applies to walls without a board. The `linked` check is also simplified to `!!(wall.boardId || wall.boardIdBack)` to avoid depending on the `boards` state being loaded.
- **Persistent library shift on thumbnail hover (definitive root cause):** the bug was introduced in v1.21.11 when all `title=""` attributes were migrated to `data-tooltip=""`. The CSS rule `[data-tooltip]:hover::after` created a pseudo-element whose appearance/disappearance caused layout shifts in ancestor flex containers. Fix: the CSS tooltip rules are removed entirely and replaced with a JavaScript tooltip: a single `<div id="tt" style="position:fixed">` at the root of App, positioned via `getBoundingClientRect()` in `mouseover`/`mouseout` listeners on the document. With `position:fixed` and JS-calculated coordinates, the tooltip lives completely outside the document flow and cannot cause layout shifts. Additionally: `min-height:0` on `.sidebar`, `overflow-y:auto` on `.sb-sec.nav`, `height:313px;overflow:hidden` on `.sb-sec.info`, and InfoPanel with visibility-toggling.
- **No project message in library:** when no project is active (`!pid`), the library now displays "Create or select a project to get started" instead of "Your library is empty".
- **"Wetzlar" theme — insufficient contrast (fourth revision):** `--sub` raised to `#d8d8d8` (≈ 13.1:1) and `--muted` to `#aaaaaa` (≈ 6.2:1).
- **Theme renames:** "Claro · Natural" is now **Arles**, "Claro · Frío" is now **Düsseldorf**, and "Dark · Wetzlar" is now **Wetzlar**. Proper names, identical in ES and EN.
- **Simultaneous menus in topbar:** when the avatar was open and the user clicked on preferences (or vice versa), both menus remained visible. Now only one dropdown can be open at a time in the topbar: opening avatar, preferences, export, or grid automatically closes the others.

### New
- **Label HUD in 3D view:** hovering over an artwork that has a label shows its name in a centered overlay at the bottom of the canvas. Artworks without a label show nothing. The HUD is hidden automatically in walk mode (mouse captured) and when leaving the 3D view.
- **"Wetzlar" theme:** dark theme designed for black and white photography work, with Leica red (#cc0000) as the accent color. Variables: ultra-dark background (#0f0f0f), panels (#1a1a1a–#222222), light text (#e8e8e8).
- **Smooth camera transitions in 3D view:** the camera no longer jumps instantly between positions. Three points receive quadratic easing interpolation (`easeInOutQuad`): the view-reset button (800 ms), clicking a surface in walk mode (500 ms), and re-entering 3D view after "Edit board" from the wall context menu (600 ms, positioning the camera facing the selected wall or block face). Continuous movements (WASD, mouse drag, OrbitControls) are unaffected.

## [1.21.18] — 2026-06-13

### Fixed
- **Library flicker on thumbnail hover (residual code removal):** removed the `posSection` block (selected item distances ↑↓←→ to board edges) that had been left inside `InfoPanel` after the numeric properties panel was moved to the context menu. That block evaluated `sel.length > 0` on every render and was the only remaining source of dynamic variation inside the info panel. The now-unused `.info-pos*` CSS classes were also removed.

## [1.21.17] — 2026-06-13

### Fixed
- **Library flicker and position jump on thumbnail hover (definitive fix):** consolidates the two previous attempts into one robust solution. The info panel (`.sb-sec.info`) returns to the normal flex flow with `height: 313px; overflow: hidden; flex-shrink: 0`. Additionally, InfoPanel is refactored to always return the same DOM structure: empty state and content live in overlapping absolute layers; switching between them uses `visibility: hidden/visible` (never mounting/unmounting nodes that would change the parent container's height).

## [1.21.16] — 2026-06-13

### Fixed
- **Library flicker and position jump on thumbnail hover (definitive fix):** the previous approach (`height: 200px`) did not eliminate the layout shift because `.sb-sec.info` was still participating in the flex flow. It is now removed from the flow with `position: absolute; bottom: 0; left: 0; right: 0; height: 250px`, and `padding-bottom: 250px` is added to `.sb-inner` so the other elements are not obscured.

## [1.21.15] — 2026-06-13

### Fixed
- **Library flicker and position jump when hovering thumbnails:** the info panel (`.sb-sec.info`) had no fixed height, so displaying photo details caused it to grow from ~100 px to ~300 px, shifting the layout. It now has a fixed `height: 200px` with `overflow: hidden`.

## [1.21.14] — 2026-06-12

### Fixed
- **Zone resize with "Scale content" — overflow on free resize:** when resizing without Shift, items without a stored height (photos) did not scale their visual height with `scaleY`, so the zone could end up smaller than its content. Added a minimum-size guard to `onMM`, `onMU`, and the properties modal: the zone can never be made smaller than the bounding box of its scaled content.

## [1.21.13] — 2026-06-12

### Fixed
- **Properties modal — size not applying on photos:** when changing W on a photo, the value was overwritten by the one derived from the H field (which remained at its original value). Now: if the user changes W but not H, W is applied directly; if H is changed, W is derived from H preserving the aspect ratio.
- **Properties modal — live proportional W/H:** when the ⛓ lock is active, changing W automatically updates H (and vice versa) as you type, without waiting for Apply. For photos, W and H are always kept in sync (aspect always locked).
- **Properties modal — locked elements:** if the item has its lock active, all fields are shown as read-only, the Apply button is disabled, and a notice "This element is locked" appears below the fields.
- **Properties modal — zone with "Scale content":** when changing W or H on a zone with `scaleContent: true`, the zone's contents are scaled proportionally, matching the behaviour of the drag-resize handle.

## [1.21.12] — 2026-06-12

### Added
- **Numeric properties modal:** accessible via right-click → "Properties…" on any canvas element (photos, text, notes, zones, placeholders). Shows editable fields for X, Y, W, H and Rot using the board's units (px for variable boards; cm/mm/in for fixed boards). The ⛓ icon toggles proportional W/H scaling (state persisted in localStorage). Changes apply on clicking Apply or pressing Enter in any field, with an undo history entry. ESC closes without applying.

### Improved
- **Cleaner info panel:** removed the inline numeric properties panel that lived in the info sidebar (was hard to use due to its small size and position). Replaced by the centred modal accessible from the context menu.

## [1.21.11] — 2026-06-10

### Improved
- **Unified tooltip system:** all buttons in the application now use the same CSS tooltip style (`[data-tooltip]:hover::after`) instead of the previous mix of `data-tooltip` (custom styled) and `title=""` (native browser tooltip with a different dark background). Affects: align-bar buttons, canvas `.ibc` controls (rotate, lock, delete, forward), sidebar buttons (projects, boards, rooms, sections, library), library filter controls, 3D/room view buttons, admin panel, and others. Removed `title=""` attributes from non-interactive elements (truncated project/board names, zone badges, etc.) to prevent native tooltips on decorative elements.

## [1.21.10] — 2026-06-10

### Fixed
- **Microscopic control buttons at low zoom:** the `min(..., 1.17)` cap introduced in 1.21.9 broke counter-scaling for canvas zoom < 0.855 — buttons measured 14 px at zoom 0.5 and 8 px at zoom 0.3. The correct counter-scale is `zoom: calc(1 / var(--canvas-zoom,1))` without a cap: buttons are always 24×24 px on screen at any zoom level.
- **Invisible tooltips in the top bar:** `bottom: calc(100% + 6px)` positioned the tooltip above the element. For topbar buttons (at the top of the screen) the tooltip was placed outside the viewport. Changed to `top: calc(100% + 6px)` — the tooltip always appears below the button, where there is always room.

## [1.21.9] — 2026-06-10

### Added
- **Numeric properties panel:** when exactly one element is selected on a board, the info panel (bottom-left sidebar) shows editable fields for X, Y, W, H and Rot. Units are px for variable boards; cm/mm/in for fixed boards with DPI. A lock button (⛓) toggles proportional W/H scaling for non-photo items (photos always maintain their aspect ratio). Fields apply on Enter or blur with undo support, and update in real time during drag, resize and rotate operations.

### Improved
- **Unified resize handle:** the corner `.rh` handle for photos, texts, notes and other items now has an 8×8 px visual area (matching text handles) with a 20×20 px click area implemented via a `::after` pseudo-element. The visual indicator is consistent with the rest of the canvas handles.
- **Maximum control size at low zoom:** the CSS counter-scale of `.bitem-bar` no longer grows unboundedly at very low zoom — it is capped at a visual maximum of ≈28 px (factor 1.17). Additionally, text items smaller than 40 px on screen hide their selection controls by default and only show them on hover.

### Fixed
- **Positional jump when starting to drag an item:** clicking to drag an item caused a small initial position jump. The calculation now uses `clientToCanvas` on both `pointerdown` and `pointermove` to compute the delta in canvas coordinates, eliminating the discrepancy that caused the jump.

## [1.21.8] — 2026-06-10

### Fixed
- **Photos hidden at interior wall corners in 3D view:** items placed near the edge of a wall were hidden behind the body of the adjacent wall at the corner. The `ix` position along the wall axis always started at the vertex (centerline intersection), without subtracting the half-thickness of the walls that meet there. The visible interior face of a wall only spans from the inner corner point (`vertex − wt/2`) to the opposite inner corner point. `ix` now starts `wt/2` from v1 (when another wall meets at that vertex) and is capped to `min(fixedW, inner_length)` toward v2, so items are always projected within the visible strip of the wall face.

## [1.21.7] — 2026-06-09

### Fixed
- **Grid textures missing in shared 3D room view:** in a room share link (`?room=TOKEN`), photos inside grid items were not loaded — the grid appeared as an empty shell. The server's `roomPhotoIds` helper only extracted `it.photoId` (single photo items), ignoring `it.photoIds` (the photo array of grid items). It now also iterates `it.photoIds` so all photos referenced by grids on room boards are included in the allowed set.

## [1.21.6] — 2026-06-09

### Added
- **Scope selector for the "Unplaced" filter:** when the filter is active a dropdown appears with two options. "In project" preserves the existing behaviour (photos not placed on any board in the project). "In this room" — only shown when there is an active room with linked boards — shows photos not placed on any board linked to that room's walls or block faces (`getRoomBoardIds`). Deactivating the filter resets the scope to "In project".
- **Photo info panel — room context:** each board where the photo appears now shows its room location when applicable. If the board is linked to a wall: "Wall X — Room Y (side A/B)". If linked to a block face: "Block X — North/South/… face". If it is a standalone board: just the board name. The rooms ↔ boardId cross-reference is computed when the panel renders (lazy, not during canvas render).

## [1.21.5] — 2026-06-09

### Fixed
- **Word wrap in 3D view text items:** `fillText()` does not wrap automatically, so text wider than its element was clipped to a single line. The 3D renderer now applies manual word wrap using `measureText()`: each paragraph (split by `\n`) is broken into words and accumulated until the line exceeds `item.w - padding`, at which point a new line is opened. Canvas height (`cvH`) is recomputed after wrapping to fit all resulting lines. The font is re-applied to the context after the canvas resize (which resets all context state). Fixes both renderers (wall items and block faces).

## [1.21.4] — 2026-06-09

### Changed
- **Minimum resize limit reduced to 10 px:** the minimum drag size was too large for all element types. Previous values: photos/placeholders 80 px wide, grids 60 px, zones 40×30 px (scale mode) / 80×60 px (non-scale), texts 120×60 px, notes 120×60 px. All reduced to 10×10 px — below 10 px an element would be invisible and unreachable. The `.rh` handle already counter-scales with canvas zoom (`zoom: calc(1 / var(--canvas-zoom,1))`), so it remains usable at any element size.

## [1.21.3] — 2026-06-09

### Fixed
- **"Public" checkbox saved as private:** the server ignored the `visibility` field in the POST body and always initialised owner comments as `'private'`. It now reads `req.body.visibility` and stores `'public'` or `'private'` as sent by the client.
- **Comment indicator missing for guests:** the notification dot (`.tbtn-dot`) on the topbar `💬` button was not coloured in guest mode even when public comments were available to read. It now shows the accent dot (`var(--acc)`) when there are comments to read (guest) or comments pending moderation (owner). The comment button in the room-share header also shows the badge when comments exist.
- **Multi-line text in 3D view:** when a text item contained newlines (`\n`), the fixed canvas height (`itemH × SCALE`) caused the computed `startY` to go negative, leaving only the middle line visible. The canvas now grows dynamically to `max(baseCvH, ceil(totalH + padding))` to fit all lines. Fixes both renderers (wall items and block faces).

## [1.21.2] — 2026-06-09

### Changed
- **Topbar tooltips unified:** all topbar buttons now use `data-tooltip` (CSS-driven) instead of `title` (native browser). Affected buttons: grid, board config, comments (board and room), show panel, invitation management, global moderation badge. Consistent visual behaviour across the entire top bar.

## [1.21.1] — 2026-06-09

### Changed
- **Contextual comment button in topbar:** a single `💬` button that reflects the active entity at all times — board (`entityType:'board'`) when in board view, room (`entityType:'room'`) when in floor-plan or 3D view. The count tracks `commentSummary` for the corresponding entity.
- **Removed redundant comment button from room toolbar:** the `💬` button that appeared in the floating floor-plan toolbar has been removed; only the topbar contextual button remains.

## [1.21.0] — 2026-06-09

### Changed
- **Auto-close comment panel** when the active board (`bid`) or view mode (`roomView`) changes, preventing the panel from remaining open over an entity that is no longer visible.
- **Room comment badge:** `💬` button with count indicator in the room panel header (next to the room name), matching the board button style. Shows an orange dot when there are pending comments (owner only). Hidden while the room name is being edited.
- **Project comment button always visible:** moved out of `nrow-acts` (which was opacity-0 until hover) to a fixed position next to the project name, always visible for owners and visible to guests when there are published comments. Duplicate inside `nrow-acts` removed.
- **Topbar tooltips verified:** `data-tooltip` present on all relevant top-bar buttons (`ttMemory`, `ttExport`, `ttPresent`, `ttVersions`, `ttShortcuts`, `ttPrefs`).

## [1.20.31] — 2026-06-09

### Added
- **Comment system — client side (Round 2):** full comment and annotation UI on the client side.
  - **Canvas badges:** `💬 N` bubble on photos, zones, texts and grids; counter-scaled with canvas zoom; orange border when there are pending comments (owner only).
  - **Context menu:** "Comments" entry in the context menu for photo, text, zone and grid items (hidden in room-share mode).
  - **Toolbar buttons:** comment button in the board toolbar, room toolbar and project sidebar row. Moderation button in the topbar when there are pending comments (server mode, owner only).
  - **Lateral comment panel:** sliding panel on the right (`.comment-panel`) with comment list, edit/visibility/memory controls and a composer; the owner sees all comments with full controls, guests only see `published+public` ones.
  - **`allowComments` checkbox:** in the project share modal and the room share modal, with a `PATCH` call to toggle comments on existing tokens. Propagated to the guest client from server init responses.
  - **Moderation modal:** full-screen overlay (owner in server mode only) with a list of pending comments, per-comment visibility selector and approve/reject actions.
  - **Memory integration:** `printMemoria` is now async; fetches `GET /api/projects/:pid/comments?inMemory=1` and injects observation blocks grouped by board, photo and project into the HTML report.
  - **Comment button in room share header:** `💬` button in the room-share header bar when `allowComments === true`.

## [1.20.30] — 2026-06-09

### Added
- **Comment system — server side (Round 1):** complete server infrastructure for the new annotation system.
  - Storage in `{dd}/{pid}/comments.json` (per-project), no database.
  - CRUD routes: `GET/POST /api/projects/:pid/comments`, `GET /api/projects/:pid/comments/summary` (counts without bodies), `PATCH/DELETE /api/projects/:pid/comments/:cid`.
  - Moderation routes (server mode only, `requireAuth`): `GET /api/comments/pending` (with `?count=1`), `POST …/approve` and `POST …/reject`.
  - `allowComments` flag (boolean, default `false`) on share tokens in `shares.json` for both project and room shares; `resolveAccess` exposes it as `req.shareAllowComments`. Visitors without the flag receive 403 when trying to comment.
  - `PATCH /api/projects/:pid/share/:role` and `PATCH /api/projects/:pid/rooms/:rid/share` to toggle comments on an existing token.
  - `GET /api/share/:token` and `GET /api/rooms/share/:token` now return `allowComments`.
  - Delete cascades: photo → its comments (hard-delete); board → board comments and all item comments (`boardId===bid`); room → room + linked boards. Items deleted implicitly (via `PUT items`): lazy sweep in `runStartupPurge` (`purgeOrphanComments`).
  - Test suite `tests/comments.test.js` (26 tests): owner CRUD, role filtering, summary, moderation, cascades, `allowComments` flag.

## [1.20.29] — 2026-06-09

### Fixed
- **3D view — permanent volumetric lighting:** volumetric lighting (warm main light + cool fill) is now permanent with no toggle option. No button, no localStorage. Walls and objects have consistent volume and depth.

## [1.20.28] — 2026-06-09

### Added
- **3D view — volumetric lighting (temporary):** toggle button removed — volumetric lighting is now the permanent default behavior.

## [1.20.27] — 2026-06-09

### Fixed
- **Admin: user delete confirmation modal hidden:** the confirmation modal when attempting to delete a user appeared behind the admin panel (insufficient z-index). Now appears correctly on top.

## [1.20.26] — 2026-06-08

### Fixed / Improved
- **Resize handles hidden in edit mode:** the 8 resize handles on text elements are automatically hidden while the element is in edit mode (the user is typing, not resizing). They reappear when edit mode is exited.
- **Control bar — adaptive position:** the text element control bar now appears below the element when its top edge is within the first 52 px of the canvas (near the topbar), consistent with photos and notes.

## [1.20.25] — 2026-06-08

### Fixed / Improved
- **3D: large fontSize text:** text no longer disappears in the 3D view when using large font sizes (≥ 512 px). The 3D renderer now scales the font proportionally to the texture canvas; the visual result is correct regardless of the absolute value.
- **Text resize handles:** 8 visible handles when a text element is selected (4 corners + 4 edges), counter-scaled with canvas zoom. Resizing is now possible in all 8 directions (previously SE only).
- **Visible selection border:** selecting a text element shows a 2 px solid accent-color border; in edit mode the opacity drops to 40 % to visually distinguish the two states.
- **Correct cursor:** in selection mode the cursor over the text area is `grab`; only in edit mode (double-click) does it change to `text`.
- **Control bar position:** restored to standard position (floating above the element), consistent with photos and notes. Note element `.rh` handle enlarged to 20 × 20 px with higher z-index to prevent overlap.
- **Edit on creation:** when a text element is added, any existing text is automatically selected (ready to overwrite).

## [1.20.24] — 2026-06-08

### Fixed / Improved
- **Default text size:** new text elements always start at 64 px on variable boards and the DPI-proportional equivalent on fixed boards. `fontSize` is no longer inherited from previous elements, eliminating the microscopic-text problem.
- **Expanded size presets:** variable boards up to 2048 px; fixed boards up to 288 pt. Manual input cap raised to 9999 (needed for room-scale text). Fixed preset format: "12pt (50px)".
- **Direct edit on creation:** adding a text element immediately activates edit mode (same as double-clicking), with no extra step required.
- **Text alignment icons:** replaced with standard Lucide icons (AlignLeft / AlignCenter / AlignRight) using lines that represent text.
- **Text element control bar:** moved to the top-right corner of the element (was at the bottom, covering the resize handle). Counter-scales with canvas zoom like all other controls.

## [1.20.23] — 2026-06-08

### Fixed
- **Text edit mode — double-click to activate:** edit mode (format toolbar, active cursor) is now triggered only by **double-click**, matching Figma, Illustrator, and Keynote. A single click selects the element and shows the generic toolbar (copy, align, group) without entering edit mode.
- **Text edit mode — clean exit:** ESC or clicking outside exits edit mode while keeping the element selected; the generic toolbar returns.
- **Corrupted fontSize sanitised on load:** when opening a board, any text element with `fontSize < 8` (corrupt data) is automatically corrected to the default value (24 px on variable boards, 12 pt equivalent on fixed boards).
- **addText — invalid fontSize inheritance:** a new text element no longer inherits `fontSize` from a previous element with a corrupt value (< 8); the default is used instead.

---

## [1.20.22] — 2026-06-08

### Fixed
- **Text topbar — activation condition:** the format toolbar now only appears when the text element is in **edit mode** (clicked into the textarea, text cursor active). A single click selects the item and shows the generic item toolbar (copy, align, group, etc.) just like any photo.
- **Text topbar — mutual exclusion with generic toolbar:** text in edit mode → format toolbar; text selected but not editing → generic toolbar. Both are mutually exclusive; they no longer overlap.
- **Default size for new text elements:** 24 px on variable boards; equivalent to 12 pt (`Math.round(12 × DPI / 72)` px) on fixed boards.

---

## [1.20.21] — 2026-06-08

### Added
- **Contextual topbar for text:** when a text element is selected, the top bar replaces the usual action buttons with format controls (font, size, bold, italic, alignment, color) — just like Photoshop's options bar. The previous floating panel has been removed.
- **Font dropdown:** each option is rendered in its own typeface. Wide enough to display "Cormorant Garamond" without truncation.
- **Size dropdown:** manual numeric input (confirmed on Enter or blur) plus a clickable preset list. Fixed boards show presets as "12pt (50px)"; variable boards show px values directly.
- **New fonts — Cormorant Garamond** (Regular, Bold, Italic), **Inter** (Regular, Bold) and **Josefin Sans** (Regular, Bold): available in the 2D canvas, JPEG export, and 3D view.
- **Self-hosted fonts:** all `.ttf` files are now served locally from `/fonts/` (public/fonts/) via `@font-face`; the Google Fonts CDN dependency has been removed.

## [1.20.20] — 2026-06-08

### Fixed
- **Windows installer — first-launch startup:** the server no longer shows an infinite loading screen on a clean install. `installer/build.bat` now runs `node scripts/build.js` before packaging the installer, so `_built.html` arrives pre-compiled and the server serves the frontend directly without compiling on startup.
- **Windows installer — missing `scripts/` directory:** `scripts/` is now included in the installer package as a fallback in case `_built.html` becomes stale after installation. Previously, the child process spawned by the server to recompile the JSX failed with ENOENT because `scripts/build.js` was not present in the install directory.
- **Infinite loading screen → error page:** if the build process fails, the server now shows a permanent error page with the message "JSX compiler not found. Reinstall the application." instead of a spinner that loops forever.

---

## [1.20.19] — 2026-06-08

### Added
- **3D view — context menu on walls and block faces:** right-clicking on a wall or block face that has no photo item shows a menu to navigate to the linked board or create a new one for that face. When the clipboard is active, a "Paste here" option appears (face with board) or "Create & paste" (face without board) to create the board and paste in one step. The menu shows the board name as an informative header.

### Fixed
- **3D view — context menu in walk mode:** the context menu no longer appears while walk mode is active (`walkActive`), where the cursor is captured and the menu makes no sense.
- **3D view — context menu for guests (reinforcement):** the `roomShareMode` guard in the `onCtxMenu` handler now also covers walk mode with a single combined condition.

---

## [1.20.18] — 2026-06-07

### Fixed
- **3D view — room share mode (guest):** the Copy/Cut context menu no longer appears on right-click over a wall photo when accessing via `?room=TOKEN`. The `onCtxMenu` handler checks `roomShareModeRef` and returns early without showing the menu. The left-click handler for navigating to a board while the clipboard is active (`onPasteClick`) is also disabled in guest mode.

---

## [1.20.17] — 2026-06-07

### Fixed
- **3D view — photo rotation on block top faces:** photos placed on the board linked to a block's top face now render with their rotation (`item.rot` + `item.freeRot`) correctly applied in `rotation.z` of the child plane, matching the behaviour of vertical faces. Photos at 90° or 270° use the swapped aspect ratio so that plane dimensions are native before rotating (same as N/S/E/W faces).

---

## [1.20.16] — 2026-06-07

### Improved
- **Human scale figure — proportion adjustments:**
  - **Head:** +35% larger (`SphereGeometry(15)`), more oval in Y×1.2 vs X/Z (≈24 cm wide × 29 cm tall)
  - **Torso:** 10% shorter (y=82→147); shoulders +28% wider (54 cm ⌀, was 42 cm); narrower waist (26 cm ⌀) for a clear mannequin silhouette; pronounced contrast between shoulders, waist and hips
  - **Arms:** ~68 cm total (upper arm 37 cm + forearm 31 cm); shoulder attachment lowered to y=133 so arms don't look attached to the neck; hands reach mid-thigh (y≈61)
  - **Joints:** elbow sphere reduced to r=4 (= forearm radius, discrete); knee sphere reduced to r=5.5 (= calf radius, discrete)
  - **Feet:** 30 cm long, 8 cm tall (more volume); rotated 180° on Y so the figure faces into the room (−Z direction, toward the default camera); heel/toe tilt `rotation.x=−0.08`

---

## [1.20.15] — 2026-06-07

### Improved
- **Human scale figure — mannequin look and figure in guest mode:**
  - Sandy/warm taupe colour (`#C4AA8A`, roughness 0.75) replacing the previous ivory white
  - Joint spheres at shoulders, elbows, hips and knees that overlap adjacent capsule segments, eliminating visible gaps at articulations
  - Feet redesigned: non-uniformly scaled `SphereGeometry` (28 cm long × 10 cm wide × 6 cm tall, oriented in Z, with a slight heel/toe tilt)
  - **👤 Person** and **↔ Move** buttons are now visible in the minimal 3D control bar shown to guests (`?room=TOKEN`), without requiring the full topbar

---

## [1.20.14] — 2026-06-07

### Improved
- **Human scale figure (3D view) — mannequin redesign:** more recognisable silhouette with corrected proportions (7.5-head canon, 175 cm). Head as a vertical oval; torso via closed `LatheGeometry` (shoulders 42 cm, waist 28 cm, hips 35 cm); arms and legs as smooth capsules (hemisphere-profile `LatheGeometry`) with no visible sphere joints; hands and feet as flat ovoids. `MeshStandardMaterial` in ivory white (`#E8E4DF`, roughness 0.85, metalness 0) replacing the previous flat beige

---

## [1.20.13] — 2026-06-07

### Security
- **Share token uniqueness:** security review of `POST /api/projects/:pid/share` and `POST /api/projects/:pid/rooms/:rid/share` endpoints. Confirmed that both always generate a fresh random UUID v4 (`uuidv4()`) on each request — no token is derived from project data or reused from a previous call. Regression tests added to verify that two consecutive calls produce different tokens

---

## [1.20.12] — 2026-06-07

### Fixed
- **Inconsistent tooltip styles:** all tooltips now use the custom `data-tooltip` attribute (Tableau's styled CSS tooltips) instead of mixing with `title=""` (native browser tooltips). Redundant tooltips that only repeated visible button text have been removed
- **Text formatting buttons (Bold, Italic) and note color picker:** converted to `data-tooltip` for visual consistency
- **Grid panel — ESC and Enter buttons:** converted to `data-tooltip` showing keyboard shortcuts
- **Zoom and alignment buttons:** the `title=""` attribute coexisting with `data-tooltip` has been removed, eliminating duplicate tooltips

---

## [1.20.11] — 2026-06-07

### Added
- **Share room — redesigned modal:** matches the «Share project» modal structure: link with «Copy» button, email field, and «Send invitation» button. Regenerate/Revoke removed from this modal (now centralised in «Active invitations»)
- **Share room — sidebar button:** a share icon appears on each room row in the left panel when `AUTH_ENABLED=true`
- **Active invitations — unified list:** the panel now shows both project and room links. Each entry shows project name (+ room name if applicable), type («Project — read only» / «Room — 3D view»), recipient email if sent (or «—»), creation date, and «Copy link» / «Revoke» buttons
- **Private board — visual indicator:** the EyeOff icon moves to the left of the board name in the sidebar. A badge appears in the topbar breadcrumb and a dashed ribbon at the top of the canvas while the owner edits a private board

### Fixed
- **Onboarding hint (drag photo to board):** the «Moment 3» hint and the empty-board hint appeared outside the visible canvas area because they were positioned at 50% of the full canvas height (minimum 2200 px). They now use `position:fixed` and always centre in the viewport

---

## [1.20.10] — 2026-06-07

### Fixed
- **Room share — photos not rendering in 3D viewer:** the `GET /api/projects/:pid/boards` endpoint was returning 403 in room scope, leaving the `boards` state empty. The 3D renderer needs board metadata (`fixedW`, `dpi`, `units`) to calculate each photo's position on the wall; without it, it short-circuited immediately and surfaces appeared blank. The server now returns only the non-private boards linked to that room; the client loads them together with photos before activating the 3D view
- **Room share — welcome screen shown on invalid token:** if the token was revoked or malformed, the app displayed the «Create first project» onboarding screen instead of an error. A clear error screen («This link is no longer available») is now shown when the token cannot be resolved. The welcome screen is also permanently suppressed in any room-share context

---

## [1.20.9] — 2026-06-07

### Fixed
- **Grid cut off on zoom-out (variable boards):** the grid canvas calculated its minimum size as `max(3000, wrapSize / zoom)`. If `wrapSize` was 0 (measured while the element was hidden via `display:none` in room view), the canvas stayed at 3000 canvas px, which at very low zoom can be less than 300 screen px. Now `window.innerWidth/innerHeight` is used as fallback when `wrapSize` is 0
- **Grid disappears in auto mode on zoom-out:** the `gridVisible` condition compared `gridCellPx × zoom` against `GRID_MIN_PX`, causing the grid to vanish at low zoom even when enabled. Visibility now checks the base cell size (`gridCellPx >= GRID_MIN_PX`), zoom-independent. The zoom check for snap remains unchanged

---

## [1.20.8] — 2026-06-07

### Added
- **Room sharing (server mode):** share button in the room editor toolbar (owners only, server mode only). Generates a public `?room=TOKEN` link that opens the app directly in the 3D view of that room with no account required. One active token per room; regenerating revokes the previous one. Modal includes copy, regenerate, and revoke actions
- **Room-scoped access control:** the room link grants access only to that room's geometry, items on boards linked to its walls and blocks, and photos strictly referenced by those items. Any other project resource returns 403
- **Room share layout:** visitors see only the 3D canvas with navigation controls (orbital + walk mode) and a minimal header showing the room name. No edit topbar, no sidebar, no library panel
- **Private board icon:** boards marked as private now display the eye-off icon (Lucide EyeOff) instead of the `⊘` symbol, visible only to the owner

---

## [1.20.7] — 2026-06-07

### Added
- **Contextual button tooltips:** global CSS rule `[data-tooltip]` that shows a styled tooltip on hover for any button with that attribute. Applied to topbar buttons (Presentation, Report, Versions, Export, Preferences, ?), the canvas selection bar (Cut, Copy, Group, Ungroup, Swap), zoom controls (Zoom in, Fit, Zoom out), and the photo hover bar (Rotate, Lock, Delete)
- **Keyboard shortcuts panel (F1):** `?` button in the topbar (always visible) and F1 key to open the panel; ESC and backdrop click to close it. The panel lists all shortcuts organized by section (General, Canvas—selection/editing/movement/zoom/rotation, Library, 3D View/Walk, Floor plan, Gallery) with styled `<kbd>` badges and ⚠️ marks for shortcuts not visible in the UI

---

## [1.20.6] — 2026-06-06

### Fixed
- Passenger (Apache/Nginx integration mode with `passenger_nodejs`) no longer requires the file to run as the main module: the three startup blocks (`app.listen`, `checkForUpdates`/`runStartupPurge`/backup, `resetHeartbeat`) now also activate when the `PASSENGER_USE_FEEDBACK_FD` environment variable is defined, which is Passenger's standard signal in integration mode

---

## [1.20.5] — 2026-06-06

### Fixed
- Definitive fix for the Passenger startup timeout: when `_built.html` is missing or stale, `GET /` responds **immediately** with an animated loading page (auto-refresh every 8 s) and spawns the Babel compilation in a separate child process (`scripts/build.js` via `child_process.execFile`). The event loop is never blocked; Passenger receives an instant HTTP response in any startup mode. Once the build completes, the next visit to `/` is served via the async fast path (`res.sendFile`). Removed `compileHtml()` and `_htmlReady` from `server.js` (compilation now lives exclusively in `scripts/build.js`)

---

## [1.20.4] — 2026-06-06

### Fixed
- Server startup no longer blocks the event loop in any Passenger mode: `GET /` serves `_built.html` using fully async `res.sendFile()` when the file exists and is valid (`npm run build`); Babel compilation only happens on demand in development (when `_built.html` is missing or `index.html` changed). Removed the `setImmediate` and the pre-load in the `listen()` callback that were still blocking the event loop via synchronous `fs.readFileSync` even in the fast path

---

## [1.20.3] — 2026-06-06

### Added
- `npm run build` script (`scripts/build.js`) that pre-compiles `public/index.html` to `public/_built.html` using the same Babel configuration as the server; run it once after each production deployment before restarting the server, eliminating the event loop block during startup

### Changed
- In standalone mode (direct Node.js), the `server.listen()` callback now explicitly starts Babel compilation once the port is already active; if `_built.html` is pre-compiled (`npm run build`), the call is an instant disk read with no blocking

---

## [1.20.2] — 2026-06-06

### Fixed
- Fixed startup in Passenger integration mode (Apache/Nginx with `passenger_nodejs`): in that mode the module is loaded via `require()`, not as main, so the `if (require.main === module)` block never runs and Babel compilation never started, leaving the server stuck on the first request; `setImmediate` now triggers compilation on the first event loop tick regardless of how the module is loaded

---

## [1.20.1] — 2026-06-06

### Fixed
- Server no longer times out under Phusion Passenger (or other process managers) on startup: `server.listen()` is now called before Babel compiles the JSX, so the port becomes active within milliseconds; the synchronous compilation (~10 s on slow CPUs) happens afterward, with the port already visible to the process manager

---

## [1.20.0] — 2026-06-06

### Fixed
- Syncing a board with its wall or block face no longer leaves items that fall outside the new dimensions as "dangling" entries in the JSON: if affected items exist, a confirmation dialog is shown ("Sync (N photos to library)") and, on accept, they are removed from the board — the photo remains available as "unplaced" in the library

### Changed
- Overflow detection during sync now checks both axes (width and height), not just width
- The sync-with-overflow flow changes from a blocking error toast to a destructive confirmation dialog showing the count of affected items

---

## [1.19.0] — 2026-06-06

### Added
- Progressive contextual onboarding: three independent moments with no blocking wizard, persisted in `localStorage` under `tb-onboarding`
- Welcome screen (no projects): value proposition rewritten as a direct benefit
- Empty library: enriched state with title, subtitle, "Upload photos" button, drag-drop hint, and a "What can I do?" link that opens an overlay with the 3 main app capabilities (visual boards, image repository, 3D room view); falls back to the minimal state if already dismissed
- Empty board with photos in the library: subtle one-line hint with an individual × dismiss button; disappears automatically when the first item is placed
- "What can I do?" overlay: closes with ×, ESC, or click outside; "Don't show again" checkbox permanently hides the help link on future visits without removing the other guides
- "↺ Reset getting-started guides" button in Settings → General: clears the `tb-onboarding` state and shows a confirmation toast

---

## [1.18.0] — 2026-06-06

### Added
- Left-clicking a wall or block face with an associated board while the clipboard has content automatically navigates to that board and opens the paste ghost; the cursor changes to a crosshair while the clipboard is active in the 3D view
- Zones take priority over their photos in 3D raycasting: right-clicking a photo that belongs to a zone copies the whole zone (zone + children) instead of the individual photo; the context menu shows "Copy zone" / "Cut zone"
- Hover visual in the 3D view: moving the cursor over a photo or text dims the element (or all members of the zone it belongs to) slightly; the cursor changes to a pointer
- ESC in the 3D view with an active clipboard cancels the destination-selection mode (crosshair cursor) without clearing the clipboard, allowing paste with Ctrl+V in the 2D canvas

---

## [1.17.0] — 2026-06-06

### Added
- Right-clicking a photo or text in the 3D room view shows a context menu with "Copy" and "Cut"; the action loads the item into the existing clipboard (the same one used by Ctrl+C/X in the 2D canvas), activating the clipboard banner so the user can paste with Ctrl+V into any board

---

## [1.16.0] — 2026-06-06

### Added
- Settings modal (⚙ in the preferences dropdown): General tab with theme, language, library toggle and About block; Project tab (visible when a project is active) with editable name, free-form notes, defaults for new boards (units, DPI, frame width, export format), and share-link status with generate/revoke buttons
- Project notes and board defaults are stored in `projects.json` and travel with the ZIP export/import
- New boards inherit the units, DPI, and default frame configured in the project settings
- The project's default export format is applied automatically when switching projects
- The preferences dropdown is simplified to Theme + Language + "Settings…"

---

## [1.15.0] — 2026-06-06

### Added
- Export board as PNG with transparent background: the export dropdown now has a JPEG / PNG toggle at the top and a single set of quality presets (96 / 150 / 300 dpi); the choice is remembered across sessions; in PNG mode the area around photos, free-rotation corners, and the configurable export border are all transparent
- Block faces linked to a board: ⚠ warning and "Sync" button in the block panel when the face's physical dimensions (N/S use width×height, E/W use depth×height, Top uses width×depth) differ from the board's fixedW/fixedH; same behaviour as walls
- Account avatar in the topbar (server mode): circular button with the user's initial that opens a dropdown with storage bar, change-password button, admin access (admins only), and sign-out; these controls are removed from the preferences dropdown

---

## [1.14.1] — 2026-06-05

### Fixed
- Zoom control: numeric percentage value removed (confusing for users)
- Invitation email: more natural wording ("visitor access", subject "invites you to")
- Registered users opening a share link now correctly access the shared project as guests, for both API calls and image requests

---

## [1.14.0] — 2026-06-05

### Added
- Private board (server mode): new option in board settings; guests cannot see or access boards marked as private

### Improved
- Locked items inside a zone no longer prevent the zone from being moved
- Second click on a photo inside a selected zone (Figma-style): selects the photo directly without first deselecting the zone
- The control bar of a photo near the top of a zone no longer overlaps the zone header
- A photo must be entirely inside a zone to belong to it; dragging it partially outside unlinks it
- Zones can freely overlap without snap-back
- Info panel always visible at the bottom of the left panel; hidden from guests
- Visual hierarchy fix: rooms now clearly appear nested under the project in the sidebar
- `+ New room` and `+ New board` buttons at the same hierarchical level

---

## [1.12.0] — 2026-06-04

### Added
- Visual copy/cut and paste with ghost: Ctrl+C / Ctrl+X copies or cuts selected items; Ctrl+V shows a semi-transparent ghost that follows the cursor — click to place, ESC to cancel
- Mouse wheel scales the ghost while it is active, letting you resize the selection before placing it
- ✂ (cut) and ⎘ (copy) buttons visible in the selection bar whenever items are selected
- "Paste" option in the canvas context menu (right-click) when the clipboard has content
- Ghost appears centered on the right-click point when pasting from the context menu
- Works with all item types: photos, notes, zones, text, placeholders and groups

### Fixed
- Ungrouping did not clear the active selection, causing items to keep moving together until clicking on the canvas

---

## [1.11.2] — 2026-06-04

### Fixed
- Startup error on Windows when the data folder (`%LOCALAPPDATA%\Tableau\data`) did not exist yet: the launcher now creates intermediate folders if missing

---

## [1.11.0] — 2026-06-03

### Added
- Trash bin: deleted photos and projects are kept for up to 30 days before being permanently removed
- Trash opens from a sidebar button with a count badge when there is content
- Photos in trash show their source project; they can be restored to the library or permanently deleted
- Projects in trash can be fully restored (with all their boards, photos and rooms)
- Empty trash removes all content at once
- Automatic purge of items older than 30 days on server startup

### Improved
- Deleting a room now also removes all boards linked to its walls, blocks and columns
- The welcome screen ("Create first project") only appears when there are no projects AND the trash is empty
- Dragging photos without an active project shows a red warning on the library and canvas instead of the usual accent color

### Fixed
- Restoring an older board version now warns if any photo from that version no longer exists in the library

---

## [1.10.2] — 2026-06-01

### Improved
- Universal Mac installer: a single DMG for both Intel and Apple Silicon (fat binary Node via lipo)
- Mac launcher logs errors to `~/Library/Logs/Tableau/tableau.log` and shows a dialog if the server fails to start

---

## [1.10.1] — 2026-06-01

### Improved
- Instant initial load: JSX is compiled on the server at startup (~2 s once) and cached to disk — the browser receives plain JS, no Babel
- React and ReactDOM served locally from node_modules — no dependency on unpkg.com or any external network
- Faster server startup: sharp is loaded lazily (only when processing the first image)

### Fixed
- Left panel: templates always starts collapsed; expanding it no longer collapses the projects section
- Left panel: section icons added (⊞ Projects, ◈ Templates, ○ Info)
- Preferences dropdown no longer hidden behind zoom controls when the library is expanded
- Library expand button now fills the full screen (canvas hidden)

---

## [1.10.0] — 2026-05-31

### Added
- Info panel: real original file dimensions (not the working thumbnail), EXIF DPI and native print size
- Photos placed at native size: dragging to the board places the photo at the size matching its pixels and board DPI
- Board DPI returned to the board config panel (was removed in 1.9.x)
- Variable board: placing the first photo auto-adjusts zoom to show it fully
- Variable board: the ⇔ (fit) button no longer has a minimum zoom limit — always shows all content
- Mouse wheel zoom: minimum lowered to 0.1 % (was 5 %)
- Mac: DMG now includes "Instalar Tableau.command" — one right-click → Open copies the app, removes quarantine and launches it

### Fixed
- Info panel no longer shows the working thumbnail's file size (incorrect value)
- Photo placement: size inheritance between portrait and landscape photos no longer causes wrong dimensions
- Deleting the only board or project now leaves the canvas correctly inactive (photos could still be dropped without an active board)
- Multi-drag from library: photos placed at their real size instead of a fixed 320 px
- Variable canvas normalisation: items always anchor to origin, preventing the ⇔ button from breaking when content is spread far apart

---

## [1.9.10] — 2026-05-30
### Fixed
- Windows: launcher incorrectly detected the server as running after it was closed — now always starts correctly

---

## [1.9.9] — 2026-05-30
### Fixed
- Windows: VBScript launcher did not set the correct working directory — the app now opens without error

---

## [1.9.8] — 2026-05-30
### Added
- Windows: VBScript launcher with no console window — the app opens directly in the browser

### Fixed
- Canvas: alignment and uniform distribution now account for each photo's frame (mat and molding)
- JPEG export: frames (mat and molding) are now correctly rendered in the exported image

---

## [1.9.7] — 2026-05-30
### Added
- Animated loading screen on startup (disappears once React finishes compiling)
- Templates: sidebar section with accordion behaviour (one section open at a time)
- Templates: direct canvas editing — click a template in the panel to open it, click a board to exit
- Templates: add containers from the library (photo is automatically converted to a placeholder)
- Templates: resize containers while preserving their aspect ratio
- Templates: configuration modal (units, DPI, fixed dimensions) specific to the template
- Templates: deletion with confirmation; management only from the sidebar panel (the «New board» picker is selection-only)
- Library: aspect-ratio fit indicator when assigning a photo to a container (green border = great fit, amber = moderate crop)
- Board: «Create» button disabled until a name is entered

### Fixed
- Templates: edits made while editing a template were not persisted on re-entry
- Templates: creating a board from a template did not load items (race condition)
- Topbar: irrelevant buttons (Report, Versions, Export…) hidden during template editing; Grid remains visible

---

## [1.9.6] — 2026-05-30
### Added
- Library: reject photos via context menu (only photos not placed on any board); supports multiple selection
- Library: visual «Recover» button on each thumbnail when the view is filtered to «Rejected»
- Library: photo count formatted as `[n]` in library header, section headers, and rejected filter button
- Library: section header aligned like the library header — name and `[n]` on the left, action buttons on the right
- Library: `+ Section` button hidden in flat view mode
- Board: «Send backward» option in the context menu for photos, text items, and grids

### Fixed
- Server: photo EXIF was not saved on import (missing field extraction in the upload endpoint)
- Server: EXIF parser silently failed because sharp prepends an `Exif\0\0` prefix before the TIFF header
- Library: the top bar message no longer says «create one in the left panel» when no projects exist yet

---

## [1.9.5] — 2026-05-29
### Added
- Library: visual separator (dashed line) between the last section and unsectioned photos
- Library: drag photos between sections; the "no section" zone is also a drop target
- Library: context menu with multiple selection applies "move to section" to all selected photos; shows active section if all share the same one
- Library: ☑ select-all button in each section header
- Library: context menu includes "View fullscreen" (single selection only)
- Fullscreen viewer: full info panel — dimensions, size, rating, tags, complete EXIF and boards where the photo appears with direct navigation
- Board: "View fullscreen" available in the context menu of photos placed on the board

### Fixed
- Library: deselect (✕) now clears the Shift-click anchor, preventing unexpected ranges on the next selection
- Library: removed tag count badge from thumbnails

---

## [1.9.4] — 2026-05-29
### Added
- Room: individual color per block face (N, S, E, W, Top) with picker in the block floating panel
- Room: duplicate room from side panel (copies geometry, clears board links)
- Room: create and manage rooms from the side menu, same as boards
- Room: rename and delete room from side panel with hover action buttons
- Room: when deleting a room, optional checkbox (unchecked by default) to also delete linked boards
- Room: wall color visible in the 2D floor plan when a custom color is assigned
- Blocks: face buttons navigate to the board if it exists, or create it if not; unlink option removed
- 3D view: photo rotation (item.rot and freeRot) correctly applied on vertical faces of walls and blocks
- 3D view: photos rotated 90°/270° on vertical faces with correct dimensions and position
- 3D view: grids (mosaics) on wall boards rendered in 3D
- 3D view: notes excluded from rendering (only photos and text items)

### Fixed
- 3D view: wall color assigned in the floor plan now correctly shown in 3D
- 3D view: block rotation in the floor plan correctly reflected in 3D
- Room: A/B side visual indicator with contrast halo, visible over any wall color
- Room: hovering block face buttons highlights the face in the floor plan
- Room: duplicate room button visible on hover in the side panel
- Wall context menu: removed "Unlink board" option
- Dark themes: improved text contrast (--muted and --dim with ≥4:1 ratio)
- Dark Cool theme: visually differentiated from Dark Amber with more blue-tinted surfaces

---

## [1.9.1] — 2026-05-28
### Added
- Room: solid blocks with configurable label, color and dimensions via floor plan context menu
- Room: each block face (N, S, E, W, Top) can be linked to its own board
- Room: block face boards are nested under their room in the side panel
- 3D view: photos placed on block face boards are rendered on the block surface
- 3D view: frames (mat + molding) are now shown on walls and block faces

### Fixed
- 3D view: photo rotation on the block top face now displays correctly

---

## [1.9.0] — 2026-05-27
### Added
- Text: free font size (8–999 px) with smart increment buttons, replacing fixed S/M/L/XL sizes
- Text: bold and italic toggles per item
- Text: correct multiline rendering in 3D view
- Photo drag: drop hint distinguishes board, grid and zone as target
- Photos in zone: dropping a photo onto a zone auto-fits it to the zone dimensions

### Fixed
- Grid: after dragging a cell, the release click no longer triggered an unintended swap
- Grid: "Remove from grid" was removing all occurrences of the same photo; now removes only the selected cell
- Text and notes: color on fixed-size boards (white background) now applies correct automatic contrast
- Text and notes: no longer appear tiny on long walls (e.g. 15 m) in 3D view
- Notes: now rendered correctly in 3D view

---

## [1.8.7] — 2026-05-27
### Fixed
- 3D view: photos placed on walls with a custom height are now positioned correctly (vertical axis uses the physical wall height, not the board's fixedH)
- 3D view: Side B boards (boardIdBack) now load their items when entering 3D view
- Room: deleting a vertex that removes walls with linked boards now warns and deletes them; merging two walls no longer discards the Side B board

---

## [1.8.6] — 2026-05-26
### Fixed
- Room: deleting a vertex that removes walls with linked boards now shows a confirmation dialog listing the affected boards and deletes them on confirm
- Room: merging two walls (deleting a middle vertex) no longer discards the Side B board

---

## [1.8.5] — 2026-05-26
### Added
- 3D view: wall corners use vertex posts at shared vertices for clean joins at any angle
- Room: each wall can have a board per face — Side A (interior) and Side B (exterior) independently
- Room: independent wall color per face (Side A and Side B)
- Room: A/B buttons in the sidebar with color stripe indicator; hovering highlights the face in the 2D floor plan (red = A, blue = B)
- Room: context menu separates Side A and Side B — color, board and sync controls per face
- Room: snap to 45°/90° when dragging existing vertices while holding Shift; also snaps to nearby vertices

---

## [1.8.4] — 2026-05-25
### Added
- 3D view: first-person walk mode — ↑↓ arrows to move forward/back, ←→ to turn; click canvas to capture mouse for unlimited rotation
- 3D view: clicking a wall or photo during walk mode snaps the camera perpendicular to it at 200 cm
- 3D view: walk mode instructions shown in the initial overlay and in the right panel
- 3D view: human scale figure is automatically hidden when entering walk mode
- Library: photos added individually by click are placed in a diagonal cascade (no longer stacked at the same point)

### Fixed
- Library: Shift+click with multiple sections was selecting photos from other sections; range is now restricted to the same group (section or unsectioned)

---

## [1.8.3] — 2026-05-25
### Added
- Multi-room: a project can have multiple rooms, each with its own floor plan and walls
- Navigator: boards grouped under their room, with a per-room collapse arrow
- Navigator: boards not linked to any room appear directly under the project, without any extra label
- Room panel: "New room" button available from the room panel (next to the room tabs)
- Library: flat view (no section grouping) toggled with a button
- Library: "Select all" button per section header; Ctrl+click for multi-select; Shift+click for range select
- Presentation: zone mode redesigned — photos recomposed side-by-side at full screen ignoring canvas positions; navigate between zones with ‹ ›
- Presentation: "View zones / View board" toggle button to switch modes without leaving presentation
- Presentation: photo swap by click available in all presentation modes (board and zone)
- Presentation: canvas is read-only (no dragging, resizing or context menu)

### Fixed
- Floor plans were not saved after finishing a drawing (PUT went to `/rooms/undefined` due to missing `id`)
- Creating a board for a wall could assign the board to the wrong room
- A navigator item could be active-highlighted simultaneously as both a room and a board; now only one item is active at a time
- Migration from `room.json` → `rooms.json` made robust (no longer skipped if the target file exists but is empty)
- Navigator: board photo count included zones and notes; now counts photos only
- Presentation: selection checkmark overlapped the delete button in the library; replaced with an outline border
- Zone presentation: 3 photos appeared in a pair because drag was assigning `zoneId` to unzoned photos
- Zone presentation: "View zones" button appeared but did nothing when a zone had no assigned photos
- Zone presentation: display area was huge when photos were far apart on the canvas
- Photo swap in presentation: swap was also exchanging `zoneId`, breaking zone membership; now only swaps `photoId`
- Drag: a photo removed from a zone and dropped back inside correctly recovers its zone membership

---

## [1.8.1] — 2026-05-23
### Added
- 3D view: human scale figure (175 cm) toggled from the toolbar — torso built with `LatheGeometry` for a seamless organic silhouette; oval head; spherical joints at shoulders, elbows, hips and knees
- 3D view: "↔ Move" button to drag the figure freely across the room floor; orbit controls are disabled during drag and restored on exit

---

## [1.8.0] — 2026-05-23
### Added
- Fixed boards: real-time edge guides when an element is selected — four dashed lines show the distance to each board edge, updating live during drag
- Fixed boards: edge distances displayed in the info panel (bottom-left), updated frame-by-frame while dragging
- Fixed boards: centering indicator — guides turn solid amber when the element is horizontally or vertically centered; the panel shows "⊕ centered H/V"
- Fixed boards: snap to board centre axes (H and V) when dragging; amber guide appears as the element approaches the centre
- Axis-constrained drag: holding Shift while dragging locks movement to the dominant axis of the first pixels of motion (horizontal or vertical), like Photoshop
- Smooth Ctrl+wheel zoom: continuous multiplicative zoom (×1.1 per tick) instead of discrete steps
- Zoom: percentage always shown on fixed boards; ⇔ button fits the view on both board types
- Zoom: the − button no longer gets stuck above the level set by "Fit view" on large boards

---

## [1.7.1] — 2026-05-22
### Added
- Zones: control header (label, lock, delete) visible when zone is selected; shown as a ghost on hover without blocking access to photos
- Zones: corner and edge resize handles now visible and functional (appear on hover)

### Fixed
- Text notes hidden in the 3D room view (only photos and free text are rendered)
- Note control bar simplified: only colour, lock and delete; font size and memory accessible from the right-click context menu
- Note text illegible on fixed boards (white background): notes with a custom colour now automatically use dark text

---

## [1.7.0] — 2026-05-21
### Added
- 3D view: "Snapshot" button that saves the current view as a photo in the project library
- Room: wall/board desync warning — appears when the real wall length differs from the board's configured width (in either direction)
- Room: "Sync" button on the affected wall row; updates the board width to match the wall; blocks sync if photos would overflow the new width

### Fixed
- The photo resize handle appeared far from the bottom-right corner when the canvas was zoomed (incorrect interaction between `calc(X/zoom)` and the element's CSS `zoom`)
- Dragging vertices in the floor plan caused progressive cursor drift; now uses `getScreenCTM().inverse()` for accurate screen-to-SVG coordinate conversion
- 3D toolbar buttons were invisible when using the app's light theme

---

## [1.6.5] — 2026-05-20
### Added
- When converting a zone to a board (Copy or Move), a dialog now prompts for the board name; pre-filled with the zone label or "Board N" if the zone has no name

### Fixed
- Black screen when opening the project memory report (React error #310): the form initialisation effect was placed after a conditional return, violating the Rules of Hooks
- Zones no longer show a broken image icon in the memory report preview; only photos and text elements are rendered
- Selecting or dragging an item no longer automatically brings it to the front; z-order only changes with the explicit "Bring forward" option in the context menu
- Free text elements inside zones now respect z-order and can appear above photos using "Bring forward"

---

## [1.6.4] — 2026-05-19
### Added
- Zones: visual board dividers that group photos, notes and text. A zone drags all its contents when moved. Created via right-click on the canvas; resizable from any side or corner
- Six zone colours available (blue, green, orange, purple, red, neutral), configurable via right-click on the zone
- Convert zone to board: the ⊞ button on the zone creates a new board containing all the zone's items

### Fixed
- Zones cannot be dropped inside another zone; if attempted, they snap back to their original position
- Moving a photo that belongs to a zone no longer loses its membership if it is still within that zone's bounds
- Resizing a zone no longer steals content from overlapping zones

---

## [1.6.3] — 2026-05-19
### Added
- Duplicate photo detection on upload: if any filename matches an existing photo a dialog appears with three options — skip duplicates, add them anyway, or replace the existing ones keeping the same ID (board items are unaffected)
- Snap guides during resize: dragging the corner handle shows guides when the right edge or width matches another photo on the board
- Size inheritance when placing photos: if the photo being added has the same aspect ratio as the last placed one (difference < 3 %), it inherits its width automatically

### Fixed
- Correct typefaces in installed version: `.ttf` files are now bundled in the installer; previously only Impact worked in the installed build
- Text element position in JPEG export: the text buffer is extended to the exact element dimensions before rotation, fixing the offset that appeared on export
- Resize handle no longer drifts from the cursor: `movementX` is now accumulated incrementally instead of using absolute coordinates, preventing drift when the canvas scrolls during resize

---

## [1.6.2] — 2026-05-19
### Added
- Fullscreen viewer: double-click a library thumbnail to open the photo fullscreen; navigate with ← →, close with ESC or click outside
- Board versions: ⏱ button in the top bar saves snapshots of the board state; list with date, item count and restore/delete buttons per version
- Grid controls as dropdown: the "Grid" button opens a menu grouping the on/off toggle, density selector and snap toggle; the top bar is cleaner

### Fixed
- Double-clicking a thumbnail no longer adds the photo to the board before opening fullscreen

---

## [1.6.1] — 2026-05-18
### Added
- Copy selection to new board: ⊞ button in the canvas selection bar; type the new board name and the selected elements are copied at the same positions

### Fixed
- Text element typefaces (Playfair Display, DM Sans, Bebas Neue, IBM Plex Mono) now render correctly in JPEG export; previous versions exported all text in the same font
- The app now remembers the active project and board when the page is reloaded or the app restarted
- The export quality dropdown was appearing off-screen; it now opens downward correctly
- Maximum JPEG export quality raised to 100 (was capped at 98)

---

## [1.6.0] — 2026-05-18
### Added
- EXIF reading: camera, lens, focal length, aperture, shutter speed, ISO and date taken are extracted automatically on import and shown in the info panel
- Board templates: save the current board layout as a template (⚙ Config → Save as template); when creating a new board a picker lets you start from a template or blank; templates can be deleted from the same picker
- JPEG export quality control: ▾ dropdown with three options — Good (JPEG 85), High (JPEG 92) and Max (JPEG 100 · 16 000 px cap)
- Text elements in JPEG export: free text elements are now rendered correctly in the exported file using their exact typefaces (Playfair Display, DM Sans, Bebas Neue, IBM Plex Mono)

### Improved
- Lossless intermediate pipeline for JPEG export: per-layer processing buffers are now PNG lossless; only the final output file is JPEG-compressed
- Export resolution cap raised from 7 000 to 10 000 px (16 000 px in Max mode)

---

## [1.5.4] — 2026-05-17
### Improved
- Grid colour corrected across all themes: each theme now defines its own optimised grid colour; in the Light · Natural theme the grid is now visible (previously it was nearly identical to the background)
- The grid is no longer painted when the zoom is so low that lines would be sub-pixel; the **Grid** button dims and shows an explanatory tooltip in that case
- The density and snap controls (shown when the grid is active) no longer shift the top-bar buttons when the grid is toggled on or off

---

## [1.5.3] — 2026-05-17
### Fixed
- The **↑ Upload ▾** button did not open the dropdown (menu was hidden behind the layout)
- Photo controls on the canvas did not respond to clicks when the dropdown had failed to open (invisible overlay was blocking interaction)
- The library collapsed when clicking the ↑ upload button on a section
- Shift+click selected from the clicked photo to the end because the anchor was not cleared after moving a selection to a section
- The library selection was not cleared after a file upload completed

---

## [1.5.2] — 2026-05-17
### Added
- Upload progress: bar at the bottom showing the current filename, N/Total counter and an animated progress bar while photos are being uploaded
- Upload directly to a section: **↑** button in each section header to upload files that are automatically assigned to that section; dragging files from the file explorer onto a section also assigns them to it (the section highlights on hover)
- Move multiple selection to section: **⊞ Section** button in the library selection bar to move all selected photos to a section at once
- Unified upload button: the *+ Folder* and *+ Upload photo* buttons are merged into a single **↑ Upload ▾** button with a dropdown

---

## [1.5.1] — 2026-05-17
### Added
- Library sections: create collapsible sections to group photos; **+ Section** button in the library header; sections can be renamed and deleted with buttons that appear on hover; right-click a thumbnail to move it to a section; sections are included in the project ZIP export/import
- Range selection in the library: **Shift + click** selects all photos between the last selected and the clicked one, without requiring a prior Ctrl+click
- Mute library: **◎ Mute** button in the library header temporarily hides all visual indicators on thumbnails (stars, tags, brightness dot, action buttons) to view photos without visual noise
- Fixed-board export: the exported JPEG now matches the exact board dimensions instead of cropping to the content bounding box
- Variable-board export border: variable boards allow configuring the white space around photos in the exported JPEG (⚙ Config → *Export border*)

### Fixed
- Library scroll was broken when the library contained many photos; content now scrolls correctly
- Horizontal/vertical flip was not applied in the exported JPEG; it is now reflected correctly
- The upload folder and upload photo buttons were separated by other controls; they are together again

---

## [1.5.0] — 2026-05-17
### Added
- Flip photo: *Flip horizontal* and *Flip vertical* options in the context menu for each photo; flip combines with rotation and is saved with the board; reflected in the report preview and PDF
- Grid from library: select multiple photos and click **⊞ Grid** in the selection bar; a dialog lets you choose columns and gap; on fixed boards the cell size is calculated automatically and shows how many photos fit; on variable boards the grid is centred on the current view
- Equal-gap guides: when dragging an element with Snap enabled, if the gap to a neighbour matches the gap between that neighbour and another element, **cyan** guides appear in both spaces and the system snaps automatically to that distance; complements the edge alignment guides (orange) and both can appear at the same time

### Fixed
- Element controls (rotate, lock, delete) were hidden behind the top menu bar when a photo was placed near the top of the canvas; they now appear below the element in that situation
- On page reload, the app always returned to the first board in the project; it now remembers the active board and restores it

---

## [1.4.0] — 2026-05-16
### Added
- Presentation mode: button in the top bar hides all UI and shows only the board; project and board name appear at the bottom on hover; ESC to exit; the grid hides automatically
- Board navigation in presentation: ‹ › arrows on each side and dot indicators in the corner to move between boards without leaving presentation mode
- Text element: typographic block for the canvas with a format panel (T▾ button); four typefaces — Serif (Playfair Display), Sans (DM Sans), Display (Bebas Neue), Mono (IBM Plex Mono); customisable alignment and text colour; a new element inherits the settings of the last text element placed; visible in presentation mode unlike internal notes
- Notes and text elements are now created by right-clicking on the canvas — the top-bar buttons have been removed to reduce clutter
- Persistent preview: hovering a thumbnail shows the floating preview; clicking it pins it until closed with × or ESC
- Rejected photo management: ✕ button on each thumbnail to mark or unmark a photo as rejected; rejected photos are hidden by default and show a red label; filter in the library header to show only rejected or all
- Replace photo on canvas: right-click → Replace photo; the library enters selection mode and clicking any thumbnail swaps the image while keeping position, size and rotation; ESC cancels

### Improved
- In presentation mode, internal notes and photo labels are hidden automatically
- The board preview in the report now shows rotated photos (both 90° steps and free rotation at any angle) and text elements in their correct positions
- Fixed PDF generation: no more blank first page when the project has multiple boards; each board starts on a new page
- Library action buttons (Copy photo →, Tags #, star ratings) are now legible in all colour themes, including Light Natural

### Removed
- Custom board background colour — it caused visibility conflicts with photo labels, notes and text elements

---

## [1.3.10] — 2026-05-15
### Added
- Batch tagging: with multiple photos selected in the library, the **# Tags** button in the selection bar opens a panel to add or remove tags from all of them at once; checkboxes show an indeterminate state when only some selected photos have a given tag
- Batch rating: pressing a key 0–5 while the cursor is over a selected photo and more than one photo is selected applies the rating to all selected photos
- Enhanced info panel: the side panel now shows the star rating, dominant hue with colour swatch, brightness percentage, and assigned tags for each photo

---

## [1.3.9] — 2026-05-15
### Added
- Drag image files from the file explorer directly onto the library to upload them without placing on the canvas; the library shows an outline highlight while files are dragged over it
- ⊞/⊟ snap button in the library header to toggle between compact height and extended view (70 % of the screen) in one click; canvas zoom adjusts automatically

### Improved
- All 5 rating stars are now always visible on each thumbnail: filled and accent-coloured when rated, faint and empty when not; makes it easy to assess ratings at a glance without hovering

---

## [1.3.8] — 2026-05-15
### Added
- Right-click context menu on photos and notes: Bring forward, Frame (photos only), Set as default size (photos only), Duplicate, Delete
- Swap positions: select exactly 2 elements and click ⇄ in the selection toolbar to exchange their positions
- Default photo size: right-click a photo → "Set as default size" — all photos placed afterwards arrive at that width; indicator shown in ⚙ Config with a Clear button

### Improved
- Buttons removed from photo hover bar (↑ Bring forward and ▣ Frame) — now in context menu; keeps only ↻, 🔒 and ×
- Button removed from note hover bar (↑ Bring forward) — now in context menu

### Fixed
- Board configuration (fixed size, default frame, background colour) was only saved in memory and lost on page reload — now fully persisted to disk

---

## [1.3.7] — 2026-05-14
### Added
- Resizable library: drag the splitter bar between the canvas and the library to adjust its height; thumbnails reflow automatically into a grid
- Sort by Hue: sorts photos by their average dominant colour (red → orange → green → blue → purple → neutral)
- Sort by Brightness: sorts photos from darkest to lightest using perceptual mean luminosity
- Brightness indicator: small circle on each thumbnail ranging from black (dark photo) to white (bright photo)
- Tags: # button on each thumbnail to assign free-text tags; badge showing active tag count; multi-tag OR filter in the library header

### Improved
- Library thumbnails reflow into a grid when the panel is enlarged; thumbnail size and library height are now independent controls

---

## [1.3.6] — 2026-05-14
### Added
- Board reordering: drag the ⠿ handle on each board row in the side panel to change the order
- Photo count per board: number of placed photos shown on each row in the side panel
- Snap to other elements: moving a photo or note snaps automatically to the edges and centres of all other elements; orange guide lines show the active snap
- Library multi-select: Ctrl+click toggles, Shift+click selects a range; action bar to add to canvas or delete
- Multi-photo drag to canvas: when the library has multiple photos selected, dragging shows an animated stack with a count badge

### Improved
- Photoshop-style SVG icons for all alignment and distribution tools
- Clear SVG icons for export/import throughout the app; group/ungroup with dedicated icons
- Shift+click on the canvas toggles a single item without deselecting the rest; clicking any group member selects the whole group
- Delete warning when removing a photo already placed on boards: lists the affected boards
- Improved colour visibility across all themes: secondary text, board counters and UI controls

---

## [1.3.5] — 2026-05-14
### Added
- Lasso selection: drag on empty canvas to select multiple elements with a rubber-band rectangle
- Export selection as JPEG: ⬇ button in the selection bar (visible with 1 or more items) exports only the selected elements
- Element grouping: ⊓ button groups selected elements; clicking any group member selects the whole group; ⊔ to ungroup
- Persistent undo history per board: undo/redo history is preserved when switching boards and restored on return
- Import folder: + Folder button in the library imports all images from a folder at once

### Fixed
- Lasso selection: items inside the rectangle were not selected on release (click bubbled to the root container and cleared the selection)
- Move group with snap enabled: each item was snapping individually to its nearest grid line, breaking relative spacing; snap is now calculated once on the anchor and applied uniformly to the whole group

---

## [1.3.4] — 2026-05-13
### Added
- Copy/paste elements: Ctrl+C copies the selection, Ctrl+V pastes with a 20 px offset; works across boards within the same project
- Duplicate elements: Ctrl+D duplicates the current selection in place (+20 px)
- Free rotation: drag the circular handle that appears above each photo or note to rotate it to any angle; Shift snaps to 15° increments; the ↻ button still rotates in exact 90° steps
- Note background color: the ■ button on each note opens a picker with 6 colors (yellow, green, blue, pink, purple, orange)
- Copy photo to another project: the → button on each library thumbnail opens a menu to duplicate the photo into another project without moving the original

---

## [1.3.3] — 2026-05-13
### Added
- Keyboard shortcuts: Del/Backspace deletes selected elements, Ctrl+A selects all on the board, arrow keys nudge selection 1 px (Shift+arrows 10 px)
- Search by filename in the library header
- Slider to adjust thumbnail size in the library (48–160 px, persistent)

### Improved
- Lock badge now shows a dark semi-transparent background and is visible over any photo
- Locked elements are excluded from all operations: drag, alignment and distribution
- Dragging a multi-selection no longer resets the selection on release

### Fixed
- Ctrl+A + drag: all selected elements now move correctly

---

## [1.3.2] — 2026-05-13
### Added
- "Unplaced" filter in the library header: shows only photos not placed on any board in the project; counter changes to N/Total when active; state persists across sessions

### Improved
- The upload button has been moved to the library header, alongside the other library controls

---

## [1.3.1] — 2026-05-12
### Added
- Multiline photo labels: clicking the label opens a popup editor; × discards changes, Save confirms; window size is remembered per photo
- Notes in the project report: title and text of notes marked with 📄 appear in the on-screen panel and in the printable PDF
- Note links in the report: if a note has a link assigned, it appears as a clickable hyperlink in the report (and in the PDF)
- Memory report title now shows the project name and date

### Improved
- Notes no longer show a dimension tooltip when resizing
- The memory report PDF opens with the project name as the window/tab title

### Fixed
- Server no longer shuts down when the browser tab stays in the background for a long time: timeout raised to 5 minutes and an immediate heartbeat is sent when returning to the tab

---

## [1.3.0] — 2026-05-12
### Added
- Element locking: 🔒 button on each photo and note prevents accidental moves or resizes; locked elements show a padlock badge and still allow editing label, frame and text
- Collapsible library: persistent header with ▼/▲ toggle, title and photo count; collapsing gives the canvas full vertical space; state persists across sessions
- Photo sorting in the library: by import date (default) or name A→Z; selector with ⇅ icon in the library header

### Improved
- Photo text label now appears below the frame with a solid background, readable at any zoom level
- Zoom controls move with the library when collapsing or expanding

### Fixed
- With a frame set, the photo label and controls are always accessible (z-index and position corrected)
- Frame value now saves correctly when editing the numeric field
- Frames are visible in the project memory report preview

---

## [1.2.12] — 2026-05-12
### Improved
- The text label for each photo is now displayed below the frame (absolute positioning), outside the photo and its frame, with a solid background and always-readable text
- Label text size compensates for canvas zoom: it always appears at the same screen size regardless of the zoom level

---

## [1.2.11] — 2026-05-12
### Fixed
- With a frame set, the photo text label is now accessible: the control bar has a higher z-index than the frame properties panel
- Frame value now persists correctly when typed in the numeric field (value was updating state but not the ref, so it was lost on save)
- Frames are visible in the board preview inside the project memory report: light background and grey outline per photo

---

## [1.2.10] — 2026-05-11
### Improved
- The frame settings panel is now counter-scaled and remains readable at any zoom level
- Photo control buttons (elevated z-index) always render above the frame and the properties panel, no longer hidden behind them

---

## [1.2.9] — 2026-05-11
### Added
- Board preview in the project memory report: scaled thumbnail showing photos in their actual positions, both in the on-screen panel and in the printable report
- Board dimensions shown below the preview in the configured unit (cm, mm, in, px); for variable boards the effective content area is calculated

### Fixed
- Black screen when opening the memory report if any photo had a frame defined
- Dev launcher script (tableau.bat) showed garbled characters and failed to start due to a Windows bug with chcp 65001

---

## [1.2.8] — 2026-05-11
### Improved
- Photo controls (buttons, dimension label, resize handle) now keep their readable size at any zoom level instead of shrinking with the canvas
- Favicon in the browser tab using the same application icon

### Fixed
- On Windows startup, the browser no longer opens the page before the server is ready; it now waits for the server to respond before opening

---

## [1.2.7] — 2026-05-10
### Added
- Per-photo frame: the ▣ button in each image's controls opens a panel to set the frame thickness in the board's configured unit
- Default frame configurable in ⚙ Board Config (applied automatically to newly placed photos)
- Dimensions show the total size (photo + frame) with an explanatory note in the memory report
- Persistent zoom per board: zoom level is saved in localStorage and restored on app restart
- Auto fit-to-width for variable boards: when opening a board for the first time, content is fitted to the window width
- ⇔ button in the zoom controls to fit to width at any time (also Ctrl+0)

### Fixed
- Importing a ZIP project showed a black screen when the confirmation dialog opened
- Import error messages now display the exact cause of the problem

---

## [1.2.6] — 2026-05-10
### Added
- Export project as ZIP: ↓ button on each project in the side panel downloads a file with all photos and boards
- Import project from ZIP: ⬆ button in the side panel; if the project already exists in this installation, offers to import as a new copy or replace the existing one

---

## [1.2.5] — 2026-05-10
### Added
- Photo thumbnails in the memory report: shown next to each photo both in the on-screen panel and in the printable report

---

## [1.2.4] — 2026-05-10
### Added
- Physical dimensions while resizing: floating tooltip shows the size in the configured unit (cm, mm, in…) while dragging the edge; falls back to pixels if no scale is configured
- Memory report shows dimensions in the configured unit instead of pixels

### Improved
- Zoom level remembered per board: switching back to a board restores its previous zoom instead of re-applying auto-fit

---

## [1.2.3] — 2026-05-09
### Added
- Duplicate boards: ⧉ button in the side panel creates an exact copy of the board with all its elements

---

## [1.2.2] — 2026-05-08
### Added
- Server shuts down automatically when the app is closed in the browser
- Custom icon for Windows and Linux shortcuts

---

## [1.2.1] — 2026-05-08
### Added
- Canvas change history: Ctrl+Z (undo) and Ctrl+Shift+Z / Ctrl+Y (redo)
- Up to 50 steps per board; history resets when switching boards

---

## [1.2.0] — 2026-05-06
### Added
- Free-text floating notes on the canvas (+ Note button in the top bar)
- Notes are resizable and movable like photos
- Link support in notes: Padlet-style preview with title, domain and favicon
- Mac installer (tableau-mac-x.x.x.zip) with automatic install script
- Linux installer (tableau-linux-x.x.x.zip)

### Improved
- Grid snap (Snap button): photos and notes align automatically when moved
- Grid size dropdowns are now readable in all colour themes

---

## [1.1.0] — 2026-05-05
### Added
- Windows installer with Inno Setup (no administrator rights required)
- Portable Node.js bundled in the installer (no external dependencies on Windows)
- Automatic update notification on app start
- Desktop and Start Menu shortcuts

---

## [1.0.0] — 2026-04-01
### Initial release
- Visual management of photography projects with free-form composition boards
- Per-project photo library with import from a local repository
- Resize, rotate and text labels per photo
- Alignment and distribution tools for multi-selection
- Zoom with Ctrl+wheel and percentage controls
- Board export as JPEG
- Printable project memory report
- Four colour themes (Dark Amber, Light Natural, Dark Cool, High Contrast)
- Language support: Spanish and English
- Local storage (no cloud, no account)
