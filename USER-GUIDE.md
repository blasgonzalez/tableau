# Tableau — User Guide

Tableau is a local-only app for visual management of photography projects. Your data is stored on your computer — no cloud, no account required.

---

## Getting started

When you open the app, you'll see three areas:

- **Left panel** — project, room and board tree
- **Canvas** — the main working area
- **Library** — the photo library for the active project (bottom strip, collapsible)

Start by creating a project in the left panel.

---

## Projects

Projects are independent containers. Each project has its own photo library, boards and rooms.

| Action | How |
|---|---|
| Create a project | Click **+** in the *Projects & Boards* header |
| Rename | Hover over the project name → click the pencil icon |
| Delete | Hover over the project name → click **×** (deletes all photos, boards and rooms) |
| Export as ZIP | Hover over the project name → click **↓** |
| Import from ZIP | Click **⬆ Import** in the panel header |

When importing a ZIP, if a project with the same name already exists you can choose to import it as a new copy or replace the existing one.

---

## Boards

Each project can have multiple boards. A board is a free-form canvas where you arrange photos, notes and text elements.

| Action | How |
|---|---|
| Create a board | Click **+ New board** inside a project |
| Rename | Hover over the board name → pencil icon |
| Duplicate | Hover over the board name → **⧉** button |
| Delete | Hover over the board name → **×** button |
| Reorder | Drag the **⠿** handle on each row to change the order |

Each board row shows a counter with the number of photos placed on it. Boards linked to walls or block faces appear nested under their room.

### Board settings (⚙ Config)

Open **⚙ Config** in the top bar to configure the active board:

- **Units** — px, cm, mm, or inches
- **DPI** — 72 (screen), 96 (web), 150 (draft), 300 (press), 600 (high quality)
- **Board mode** — *Variable* (unlimited canvas) or *Fixed* (exact dimensions)
- **Default frame** — mat thickness applied automatically to newly placed photos
- **Export padding** — white space around content in the exported JPEG (variable boards only)

Setting DPI and units unlocks physical dimensions on photos and in the report.

### Board templates

Save the current layout as a template via **⚙ Config → Save as template**. When creating a new board, a selector lets you start from a template or from scratch. Templates can be deleted from the same selector.

### Board versions

The **⏱** button in the top bar saves a full snapshot of the board at that moment. The list shows each version with date, time and element count. Click **Restore** to revert to that state; the current state is not lost until you confirm. Click **×** to delete a specific version.

---

## Photo library

The library strip at the bottom shows all photos uploaded to the active project.

### Uploading photos

Click **↑ Upload** in the library header to select individual files or a folder. You can also drag image files directly onto the canvas, or drop them onto the library panel to upload without placing them on the board. If any filename matches an existing photo, a dialog lets you skip duplicates, add them anyway, or replace the existing ones while keeping the same ID. Photos are automatically resized to a maximum of 1800 px and stored as JPEG.

### Sections

Create collapsible groups in the library with the **+ Section** button in the header. Sections can be renamed and deleted by hovering over their header. To move a photo to a section, right-click its thumbnail. You can also upload photos directly to a section using the **↑** button on its header, or drag files onto a section (it highlights when files hover over it). Sections are exported and imported with the project ZIP.

### Sorting and filtering

| Control | Effect |
|---|---|
| **⇅** | Sort by import date (default), name A→Z, hue, or brightness |
| **Unplaced** filter | Show only photos not placed on any board |
| **# Tags** | Filter by free-text tags (see Tags section) |
| Name search | Text field in the header |
| **→** (on hover) | Copy the photo to another project without removing it from the current one |

**Sort by Hue** groups photos by dominant colour (red → orange → green → blue → purple → neutral last). **Sort by Brightness** orders them from darkest to lightest. Each thumbnail shows a small dot ranging from black (dark) to white (bright).

### Full-screen viewer

Double-click a library thumbnail to open the photo full-screen. Navigate between photos with the **← →** arrow keys. Close with **ESC** or a click outside the image.

### Resizing the library

Drag the splitter bar between the canvas and the library to adjust its height. When enlarged, thumbnails reflow into a grid. Thumbnail size is controlled independently with the slider in the library header.

Click **⊞** in the library header to expand to an extended view (70 % of the screen height). Click **⊟** to return to compact height. The canvas zoom adjusts automatically.

### Library multi-select

- **Ctrl + click** — toggle a single photo in or out of the selection
- **Shift + click** — select the range between the last selected photo and the one you click (within the same group or section)
- **Select all** — button in the header of each section

When photos are selected, an action bar appears at the bottom:

| Button | Action |
|---|---|
| **# Tags** | Open the batch tag panel |
| **⊞ Section** | Move all selected photos to a section |
| **Add to board** | Place all selected photos onto the active canvas |
| **⊞ Grid** | Open the grid placement dialog |
| **× Delete** | Delete selected photos from the library (asks for confirmation) |

When dragging to the canvas with multiple photos selected, an animated stack with a count badge is shown.

### Info panel

Hover over a photo in the library to see in the side panel:

- Name, original dimensions and file size
- Camera, lens, focal length, aperture, shutter speed and ISO (EXIF metadata)
- Size on the board and physical dimensions (if DPI is configured)
- Star rating
- Dominant hue with colour swatch and brightness percentage
- Assigned tags
- Boards the photo is placed on

### Repository tab

The **Repo** tab shows images from a shared local folder. Copy files into the `repo/` folder inside the app directory, switch to the **Repo** tab and click **+** on a thumbnail to import it into the active project.

---

## Working on the canvas

### Adding photos

- Drag a thumbnail from the library onto the canvas
- Drag a thumbnail from the Repo tab
- Drop image files directly from the file explorer

Photos added individually by clicking a thumbnail appear in a diagonal cascade, not stacked.

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

Right-click any photo or note on the canvas:

| Option | Action |
|---|---|
| **↑ Bring forward** | Raise the element in the stacking order |
| **▣ Frame** | Open the frame and finish panel (photos only) |
| **⊞ Set as default size** | Photos placed afterwards arrive at this width (photos only) |
| **↔ Flip horizontal** | Mirror the photo left to right |
| **↕ Flip vertical** | Mirror the photo top to bottom |
| **⇄ Replace photo** | Enter selection mode to swap the image |
| **⧉ Duplicate** | Create a copy offset by 20 px |
| **× Delete** | Remove from board |

> Z-order only changes via **↑ Bring forward** in the context menu, or when creating / duplicating an element (which always arrives on top).

### Photo labels

Clicking the label bar below a photo opens a multi-line popup editor. The window size is remembered per photo. Press **Save** to confirm or **×** to discard.

### Frames and finishes

Right-click a photo → **▣ Frame** to open the finishes panel, with two independent layers:

- **Mat** — thickness and colour (white by default). Added to the total piece size.
- **Molding** — thickness and colour (brown by default). Added on top of the mat.

Dimensions always include the full finish. To apply the same finish to multiple photos, use **Copy frame style** from the context menu: the cursor switches to painter mode and a click on any photo applies the style.

---

## Multi-selection and alignment

Three ways to select multiple elements:

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
| **⬇** | Export selection as JPEG |
| **⊞** | Copy selection to a new board |
| **⊓** | Group selected elements (≥ 2) |
| **⊔** | Ungroup |

---

## Floating notes

Right-click on the canvas and select **Add note** to place a free-text note. Notes behave like photos — they can be moved, resized, rotated and locked. They are internal working elements and do not appear in presentation mode.

- **Title and body** — type directly in the note
- **Color** — the **■** button opens a picker with 6 colours (yellow, green, blue, pink, purple, orange)
- **Link** — assign a URL to show a link preview (title, domain, favicon)
- **📄** — include or exclude the note from the project report

---

## Text elements

Right-click the canvas and select **Add text** to place a typographic block. Unlike internal notes, text elements remain visible in presentation mode. A new element inherits the font, size, alignment and colour of the last text element placed.

Click the **T▾** button on the element's control bar to open the format panel:

| Control | Action |
|---|---|
| Numeric size field | Free font size from 8 to 999 px; **−/+** buttons with smart increment |
| **B** / **I** | Bold / Italic |
| **Serif / Sans / Display / Mono** | Typeface — Playfair Display, DM Sans, Bebas Neue, IBM Plex Mono |
| **⫷ / ⊟ / ⫸** | Text alignment (left, center, right) |
| **■** (colour swatch) | Text colour |
| **↻** (click) | Rotate 90° |
| **↻** (drag) | Free rotation · Shift snaps to 15° increments |
| **🔒** | Lock / unlock |
| **×** | Delete from board |

---

## Zones

Zones are visual containers that group photos, notes and text elements on a board. Moving a zone moves all its contents with it.

Right-click on empty canvas space and select **+ Zone**. Drag any of the **eight handles** (corners and mid-edges) to resize. Photos and notes inside the zone do not move when you resize it.

- **Label** — click the text field inside the zone to type a name
- **Colour** — right-click the zone and pick one of the six available colours

Zones cannot be dropped inside another zone. When the centre of a photo or note falls inside a zone, it automatically joins that zone (small coloured dot on the element's corner).

### Zone context menu

| Option | Action |
|---|---|
| **⊞ Copy to new board** | Creates a new board from zone contents; prompts for a name |
| **⊞ Move to new board** | Same as Copy, but also removes the zone from the current board |
| **× Delete** | Asks for confirmation before deleting if the zone has contents |

---

## Tags

Tags let you categorise photos with free-text labels and filter the library by them.

Hover over a thumbnail and click **#** to open the tag panel for that photo. With multiple photos selected in the library, click **# Tags** in the selection bar for batch tagging — checkboxes show an indeterminate state when only some photos have a tag.

**Batch rating:** select multiple photos, hover over any of them, and press a key from **0** to **5** to apply that rating to all selected photos.

**Filtering:** click **# Tags** in the library header. The filter is OR — photos with at least one of the active tags are shown. Tag filters combine with the Unplaced filter and name search.

---

## Grid and snap

| Button | Effect |
|---|---|
| **Grid** | Show / hide the alignment grid |
| **Snap** | Enable / disable automatic snapping when moving items |

With **Snap** enabled, **orange** guide lines appear when an element aligns with the edge or centre of another element. If the gap between the element you are moving and a neighbour matches the gap between that neighbour and another element, **cyan** guide lines appear and the system snaps to that distance automatically — great for maintaining equal spacing in photo rows or columns.

### Placing photos as a grid

Select multiple photos in the library and click **⊞ Grid** in the selection bar. Configure columns and gap. On fixed boards the cell width is calculated automatically; the dialog shows whether all photos fit.

---

## Zoom

| Action | Shortcut |
|---|---|
| Zoom in / out | **Ctrl + scroll wheel** |
| Zoom in / out | **Ctrl + +** / **Ctrl + −** |
| Fit to width | **Ctrl + 0** · or **⇔** button |

Zoom level is saved per board and restored when you switch back to it.

---

## Undo / Redo

| Action | Shortcut |
|---|---|
| Undo | **Ctrl + Z** |
| Redo | **Ctrl + Shift + Z** or **Ctrl + Y** |

Up to 50 undo steps are kept per board. History is preserved when switching between boards.

---

## Project memory report

Click **≡ Memory** in the top bar. The report includes a scaled preview of each board, a photo table with physical dimensions (including frame), ratings, tags, and notes marked with 📄. Click **⎙ Print / Save PDF** to generate the document.

---

## Exporting a board

Click **⬇ Export JPEG** in the top bar. Three quality levels are available: Good (JPEG 85), High (JPEG 92), and Maximum (JPEG 100, up to 16 000 px). On fixed boards the JPEG matches the configured dimensions exactly.

---

## Presentation mode

Click **Present** in the top bar. The grid, internal notes and photo labels are hidden automatically. Navigate between boards with the **‹ ›** arrows or the **← →** arrow keys.

If the board has zones, the **View zones** button recomposes each zone's photos side by side full-screen; navigate between zones with **‹ ›**. At any time, click two photos to swap them and preview composition variants in real time.

Press **ESC** to exit presentation mode.

---

## Room and 3D view

The room feature lets you draw the exhibition space floor plan and preview how photos look on walls and blocks in 3D.

### Multiple rooms

A project can have several independent rooms. Create additional rooms with the **+ New room** button visible next to the room tabs. Each room has its own floor plan and wall list; in the left panel, each room's boards appear nested under its name.

### Drawing the floor plan

1. Click **Draw floor plan** to enter drawing mode.
2. Click on the canvas to place vertices one by one. Hold **Shift** to force 45°/90° angles and snap to nearby vertices.
3. To close the polygon, click the first vertex again.
4. Press **⌫** to undo the last vertex, or **Cancel** to exit without saving.

Once drawn, click **Edit floor plan** to reposition vertices by dragging them.

### Right-click on the floor plan

| Option | Result |
|---|---|
| **+ Column** | Adds a configurable square pillar |
| **+ Block** | Enters block drawing mode (drag to define position and size) |

### Walls — Face A and Face B

Each wall has two independent faces that can each be linked to a different board:

- **Face A** — the interior face (following the drawing direction)
- **Face B** — the exterior face

In the right panel, each wall shows **A** and **B** buttons with a coloured strip for each face. Hovering a button highlights that face in the 2D floor plan (red = A, blue = B). Click **+** on a face to create its linked board, or **▶** to go to the existing board.

Right-clicking a wall in the floor plan opens a menu to change the colour and linked board of each face independently, and to sync dimensions if the wall has changed length.

#### Desync warning ⚠

If the real wall length no longer matches the linked board's configured width, a **⚠** badge and a **Sync** button appear on that wall row. If photos on the board would overflow the new width, sync is blocked — adjust those photos first.

### Solid blocks

A block represents a physical object in the space: pedestal, display case, partition wall, etc. To create one, right-click the floor plan and select **+ Block**, then drag to define its position and footprint.

Selecting a block opens a properties panel with:

- **Label** — block name
- **Color** — fill colour in the floor plan and 3D view
- **W / D / H** — width, depth and height in cm

Each block has **five faces** (North, South, East, West, Top), each with its own button in the right panel. Click **+** to create that face's board, or **▶** to go to the existing board. Block face boards appear nested under their room in the left panel.

### 3D view

Press **Shift + R** (or the **3D view** button) to see the room in three dimensions. Photos from all boards linked to walls and block faces are projected onto their respective surfaces, with mat and molding frames included.

Use the mouse to **orbit** (click + drag), **zoom** (scroll wheel) and **pan** (right-click + drag).

| Button | Action |
|---|---|
| **← Floor plan** (or **R**) | Return to the floor plan view |
| **Reset view** | Restore the camera to its initial position |
| **Figure** | Show / hide the 175 cm human scale figure |
| **↔ Move** | Enable dragging the figure across the floor |
| **Snapshot** | Save the current view as a photo in the library |
| **Walk mode** | Switch to first-person navigation |

#### Walk mode

In walk mode the camera moves through the room interior:

| Key | Action |
|---|---|
| **↑ / ↓** | Move forward / backward |
| **← / →** | Turn the camera left / right |
| Click on the canvas | Capture the mouse for free rotation without screen-edge limits |
| Click on a wall or photo | Position the camera perpendicular to it at 200 cm |
| **ESC** | Release the mouse |

The scale figure is hidden automatically when walk mode is active.

---

## Rejected photos

The **✕** button that appears on hover marks a photo as rejected. Rejected photos are hidden from the library by default. The **✕ Rejected** button in the header cycles through: hide rejected → show rejected only → show all.

---

## Replace photo on canvas

Right-click a canvas photo and choose **⇄ Replace photo**. The library enters selection mode: click any thumbnail to swap the image while keeping the same position, size and rotation. Press **ESC** to cancel.

---

## Themes and language

Click **Preferences** in the top bar to change the theme (Dark Amber, Light Natural, Dark Cool, High Contrast) and the language (Spanish, English).

---

## Updates

When a new version is available, a banner appears at the top of the app. Download the new installer and run it — on Windows it replaces the previous installation automatically.

---

## Closing the app

Close the browser tab. The server detects this and shuts down automatically within 90 seconds.

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
| **Ctrl + 0** | Fit to width |
| **Del** / **Backspace** | Delete selected elements |
| **Arrow keys** | Nudge selection 1 px |
| **Shift + Arrow keys** | Nudge selection 10 px |
| **R** | Room: go to floor plan |
| **Shift + R** | Room: go to 3D view |
| **ESC** | Exit presentation / cancel operation |
