# Changelog

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
