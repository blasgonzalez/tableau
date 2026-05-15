# Tableau — User Guide

Tableau is a local-only app for visual management of photography projects. Your data is stored on your computer — no cloud, no account required.

---

## Getting started

When you open the app, you'll see three areas:

- **Left panel** — project and board tree
- **Canvas** — the main working area
- **Library** — the photo library for the active project (bottom strip, collapsible)

Start by creating a project in the left panel.

---

## Projects

Projects are independent containers. Each project has its own photo library and its own boards.

| Action | How |
|---|---|
| Create a project | Click **+** in the *Projects & Boards* header |
| Rename | Hover over the project name → click the pencil icon |
| Delete | Hover over the project name → click **×** (deletes all photos and boards) |
| Export as ZIP | Hover over the project name → click **↓** |
| Import from ZIP | Click **⬆ Import** in the panel header |

When importing a ZIP, if a project with the same name already exists you can choose to import it as a new copy or replace the existing one.

---

## Boards

Each project can have multiple boards. A board is a free-form canvas where you arrange photos and notes.

| Action | How |
|---|---|
| Create a board | Click **+ New board** inside a project |
| Rename | Hover over the board name → pencil icon |
| Duplicate | Hover over the board name → **⧉** button |
| Delete | Hover over the board name → **×** button |
| Reorder | Drag the **⠿** handle on each row to change the order |

Each board row shows a counter with the number of photos placed on it.

### Board settings (⚙ Config)

Open **⚙ Config** in the top bar to configure the active board:

- **Units** — px, cm, mm, or inches
- **DPI** — 72 (screen), 96 (web), 150 (draft), 300 (press), 600 (high quality)
- **Board mode** — *Variable* (unlimited canvas) or *Fixed* (exact dimensions)
- **Default frame** — frame thickness applied automatically to newly placed photos

Setting DPI and units unlocks physical dimensions on photos and in the report.

---

## Photo library

The library strip at the bottom shows all photos uploaded to the active project.

### Uploading photos

Click **+ Upload** in the library header to select individual files, or **+ Folder** to import all images from a folder at once. You can also drag image files directly onto the canvas. Photos are automatically resized to a maximum of 1800 px and stored as JPEG.

### Sorting and filtering

| Control | Effect |
|---|---|
| **⇅** | Sort by import date (default), name A→Z, hue, or brightness |
| **Unplaced** filter | Show only photos not placed on any board |
| **# Tags** | Filter by free-text tags (see Tags section) |
| **→** (on hover) | Copy the photo to another project without removing it from the current one |

**Sort by Hue** groups photos by their average dominant colour (red → orange → green → blue → purple → neutral last). **Sort by Brightness** orders them from darkest to lightest. Each thumbnail shows a small circle ranging from black (dark photo) to white (bright photo).

### Resizing the library

Drag the splitter bar between the canvas and the library to adjust its height. When enlarged, thumbnails reflow automatically into a grid. Thumbnail size is controlled independently with the slider in the library header.

### Library multi-select

You can select multiple photos before adding them to the canvas or deleting them:

- **Ctrl + click** — toggle a single photo in or out of the selection
- **Shift + click** — select the range between the last selected photo and the one you click

When one or more photos are selected, an action bar appears at the bottom of the library:

| Button | Action |
|---|---|
| **Add to board** | Place all selected photos onto the active canvas |
| **× Delete** | Delete the selected photos from the library (asks for confirmation) |

If a photo you are deleting is already placed on a board, the confirmation dialog lists the affected boards.

When dragging to the canvas with multiple photos selected, an animated stack with a count badge is shown as the drag ghost.

### Info panel

Hover over a photo in the library to see its name, original dimensions, file size, physical size (if DPI is set), and which boards it appears on.

### Repository tab

The **Repo** tab shows images from a shared local folder. To use it:

1. Copy image files into the `repo/` folder inside the app directory
2. Switch to the **Repo** tab in the library
3. Click **+** on a thumbnail to import it into the active project

---

## Working on the canvas

### Adding photos

- Drag a thumbnail from the library onto the canvas
- Drag a thumbnail from the Repo tab
- Drop image files directly from the file explorer

### Manipulating photos

Hover over a photo on the canvas to reveal its controls:

| Control | Action |
|---|---|
| Drag the photo | Move |
| Orange handle (bottom-right corner) | Resize |
| **↻** (click) | Rotate 90° |
| **↻** (drag) | Free rotation to any angle · Shift snaps to 15° increments |
| **🔒** | Lock / unlock (prevents accidental moves) |
| **×** | Delete from board |
| Label bar (below the photo) | Click to edit the text label |
| **Right-click** | Open context menu |

Locked photos show a padlock badge. You can still edit their label and frame while locked.

### Context menu

Right-click any photo or note on the canvas to open a context menu with secondary actions:

| Option | Action |
|---|---|
| **↑ Bring forward** | Raise the element in the stacking order |
| **▣ Frame** | Set frame thickness (photos only) |
| **⊞ Set as default size** | All photos placed afterwards arrive at this width (photos only) |
| **⧉ Duplicate** | Create a copy offset by 20 px |
| **× Delete** | Remove from board |

### Labels

Clicking the label bar below a photo opens a popup editor that supports multiple lines. The window size is remembered per photo. Press **Save** to confirm or **×** to discard.

### Frames

The **▣** option in the context menu opens a panel to set a frame thickness in the board's configured unit. The label and dimension tooltip show the total size including the frame.

---

## Multi-selection and alignment

There are three ways to select multiple elements:

- **Lasso** — click and drag on empty canvas space to draw a selection rectangle
- **Shift + click** — toggle a single element without deselecting the rest
- **Ctrl + A** — select all elements on the board

Clicking any member of a group automatically selects the entire group.

With an active selection, a toolbar appears at the top:

| Button | Action |
|---|---|
| Align left / right edges | With ≥ 2 elements |
| Align top / bottom edges | With ≥ 2 elements |
| Center horizontally / vertically | With ≥ 2 elements |
| Distribute horizontally / vertically | With ≥ 3 elements |
| Match width to anchor | The anchor is the first item selected (solid outline) |
| **⇄** | Swap positions of the two selected elements (exactly 2) |
| **⬇** | Export selection as JPEG (available with ≥ 1 element) |
| **⊓** | Group selected elements (≥ 2) |
| **⊔** | Ungroup (visible when any grouped element is selected) |
| Deselect | |

---

## Floating notes

Click **+ Note** in the top bar to add a free-text note to the canvas. Notes behave like photos — they can be moved, resized, and locked.

- **Title and body** — type directly in the note
- **Color** — the **■** button opens a picker with 6 background colors (yellow, green, blue, pink, purple, orange) plus the default
- **Link** — assign a URL to show a link preview (title, domain, favicon)
- **Include in report** — toggle the 📄 button to include or exclude the note from the project report

---

## Tags

Tags let you categorise photos with free-text labels and filter the library by them.

### Assigning tags

Hover over a thumbnail and click the **#** button. A panel opens with:

- All existing tags in the project as checkboxes — tick or untick to add or remove the tag from that photo
- A text field at the bottom to create a new tag: type and press **Enter**

Photos with tags show a **#N** badge in the top-left corner of the thumbnail.

### Filtering by tags

Click the **# Tags** button in the library header. A panel shows all tags in the project; select one or more. The filter is **OR** — photos with at least one of the active tags are shown. The button displays a badge with the number of active filters.

To clear all tag filters, select **All** in the panel or click the active tags again.

Tag filters combine with the **Unplaced** filter and the name search.

---

## Grid and snap

| Button | Effect |
|---|---|
| **Grid** | Show / hide the alignment grid |
| **Snap** | Enable / disable automatic snapping when moving items |

The grid size selector (next to Snap) offers automatic sizing or specific values in mm, cm, or px depending on the board's configured units.

With **Snap** enabled, moving an element will first try to align it with the edges and centres of other elements on the board (snap to elements). Orange guide lines appear to show the active snap. If no nearby element is found, the item snaps to the grid instead.

---

## Zoom

| Action | Shortcut |
|---|---|
| Zoom in / out | **Ctrl + scroll wheel** |
| Zoom in | **Ctrl + +** |
| Zoom out | **Ctrl + −** |
| Fit to width | **Ctrl + 0** · or **⇔** button |
| Zoom percentage | Click the % buttons in the bottom-right controls |

Zoom level is saved per board and restored when you switch back to it.

---

## Undo / Redo

| Action | Shortcut |
|---|---|
| Undo | **Ctrl + Z** |
| Redo | **Ctrl + Shift + Z** or **Ctrl + Y** |

Up to 50 undo steps are kept per board. History resets when you switch to a different board.

---

## Project report

Click **≡ Report** in the top bar to open the project report. It shows:

- A preview of each board with photos in their actual positions
- A table of all photos with dimensions, physical size (if DPI is configured), and label
- Notes that are marked for inclusion (📄 icon)
- Note links as clickable hyperlinks

Click **⎙ Print / Save PDF** to print or export as a PDF file.

---

## Exporting a board

Click **⬇ Export JPEG** in the top bar to download the active board as a JPEG image.

---

## Themes and language

Click **Preferences** in the top bar to change:

- **Theme** — Dark Amber, Light Natural, Dark Cool, High Contrast
- **Language** — Spanish, English

---

## Updates

When a new version is available, a banner appears at the top of the app. Click the link to download the new installer and run it — on Windows it replaces the previous installation automatically.

---

## Closing the app

Close the browser tab. The server detects this and shuts down automatically within 90 seconds. The Command Prompt window will close on its own.

---

## Keyboard shortcuts summary

| Shortcut | Action |
|---|---|
| **Ctrl + Z** | Undo |
| **Ctrl + Shift + Z** / **Ctrl + Y** | Redo |
| **Ctrl + C** | Copy selected elements |
| **Ctrl + V** | Paste (offset by 20 px) |
| **Ctrl + D** | Duplicate selected elements |
| **Ctrl + A** | Select all elements on the board |
| **Ctrl + scroll** | Zoom in / out |
| **Ctrl + +** / **Ctrl + −** | Zoom in / out |
| **Ctrl + 0** | Fit to width (variable board) / fit board (fixed board) |
| **Del** / **Backspace** | Delete selected elements |
| **Arrow keys** | Nudge selection 1 px |
| **Shift + Arrow keys** | Nudge selection 10 px |
