# Changelog

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
