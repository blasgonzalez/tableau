# Changelog

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
