# Changelog

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
