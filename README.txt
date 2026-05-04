================================================================================
  TABLEAU  —  Visual Photo Layout Manager
  Local web application for photography project management
================================================================================

REQUIREMENTS
------------
  · Node.js 18 or later
    Download at: https://nodejs.org

  · A modern web browser (Chrome, Edge, Firefox, Safari)

  · Windows 10 or later (for the .bat launcher)
    On macOS/Linux: run manually (see "Manual start" below)


INSTALLATION & FIRST LAUNCH  (Windows)
---------------------------------------
  1. Place the entire "tableau" folder anywhere on your computer.

  2. Double-click  tableau.bat

  3. On the first run, the launcher automatically installs all dependencies
     (requires an internet connection). This takes 1–3 minutes.

  4. Your browser will open automatically at  http://localhost:3000

  That's it. From the second run onwards it starts immediately.


MANUAL START  (macOS / Linux / advanced)
-----------------------------------------
  Open a terminal in the tableau folder and run:

      npm install        (first time only)
      node server.js

  Then open  http://localhost:3000  in your browser.


STOPPING THE APPLICATION
------------------------
  Close the terminal / command prompt window, or press Ctrl+C inside it.


--------------------------------------------------------------------------------
  INTERFACE OVERVIEW
--------------------------------------------------------------------------------

The application has three main areas:

  LEFT SIDEBAR    Project & board navigation + photo information panel
  CANVAS          The main editing area where you arrange photos
  LIBRARY BAR     Thumbnail strip at the bottom showing all project photos


--------------------------------------------------------------------------------
  PROJECTS AND BOARDS
--------------------------------------------------------------------------------

CREATING A PROJECT
  · Click the  +  button in the "Projects & Boards" section of the sidebar,
    or use the "Create first project" button on the welcome screen.
  · Give it a name and press Enter or click "Create".

SWITCHING PROJECTS
  · Click any project name in the sidebar. The arrow (▾/›) shows which
    project is active and expands its list of boards.

CREATING A BOARD
  · With a project selected, click "+ New board" in the sidebar,
    or click the  +  next to the project header.

SWITCHING BOARDS
  · Click any board name under the active project in the sidebar.

RENAMING  (projects and boards)
  · Hover over the name in the sidebar and click the  ✎  pencil icon.
  · Type the new name and press Enter (or click elsewhere to confirm).

DELETING  (projects and boards)
  · Hover and click the  ×  icon.
  · Deleting a project removes all its photos and boards permanently.


--------------------------------------------------------------------------------
  PHOTOS
--------------------------------------------------------------------------------

ADDING PHOTOS TO A PROJECT
  Three methods:

  1. Click  "+ Upload"  in the top bar and choose files from your computer.

  2. Drag image files directly from Windows Explorer onto the canvas.

  3. Drag image files from Windows Explorer onto the canvas — they are
     automatically added to the project library and placed on the board.

SUPPORTED FORMATS
  JPG, JPEG, PNG, WEBP, TIFF, TIF, AVIF
  Maximum upload size: 80 MB per file.
  Photos are automatically resized to a maximum of 1800 px on the longest
  side and stored as JPEG for efficient use.

PLACING PHOTOS ON THE CANVAS
  · Drag a photo from the library bar at the bottom onto the canvas.
  · Or click a thumbnail in the library — it is placed at the centre
    of the current view.

  Photos already placed on the current board show an "IN BOARD" indicator
  on their library thumbnail.

DELETING PHOTOS FROM THE PROJECT
  · Hover over a thumbnail in the library bar and click the  ×  button.
  · This removes the photo from the project and from all boards.


--------------------------------------------------------------------------------
  CANVAS EDITING
--------------------------------------------------------------------------------

MOVING PHOTOS
  · Click and drag any photo on the canvas.
  · The canvas expands automatically in all directions as you work.
    You can always scroll to reach any area.

RESIZING
  · A small orange handle appears at the bottom-right corner on hover.
  · Drag it to resize. The aspect ratio is preserved automatically.

ROTATING
  · Hover over a photo and click the  ↻  button in the control bar above it.
  · Each click rotates 90° clockwise.

BRING TO FRONT
  · Click the  ↑  button to bring a photo in front of overlapping photos.

DELETING FROM CANVAS
  · Click the  ×  button on the photo's control bar.
  · This only removes it from the board; the photo stays in the project library.

ADDING A LABEL
  · Each canvas photo has a text field below it. Click it to type a caption
    or reference label. Press Tab or click elsewhere to save.


MULTI-SELECT AND ALIGNMENT
  · Hold  Shift  and click photos to add them to the selection.
  · When 2 or more photos are selected, an alignment toolbar appears
    floating at the top of the canvas:

    ⊢  Align left edges
    ⋮  Centre horizontally
    ⊣  Align right edges
    ⊤  Align top edges
    ⋯  Centre vertically
    ⊥  Align bottom edges
    ↔  Distribute evenly – horizontal  (3+ photos)
    ↕  Distribute evenly – vertical   (3+ photos)
    ✕  Clear selection

  · You can drag any selected photo and all selected photos move together.
  · Click the canvas background to deselect all.


--------------------------------------------------------------------------------
  BOARD CONFIGURATION  (physical dimensions)
--------------------------------------------------------------------------------

If you are designing for print, you can configure each board with its
intended output resolution:

  1. Open a board and click  ⚙ Config  in the top bar.
  2. Choose your preferred units: px, cm, mm, or inches.
  3. Choose the output resolution (DPI):
       72 dpi  — screen display
       96 dpi  — web / digital
      150 dpi  — draft print
      300 dpi  — professional print (standard)
      600 dpi  — high-quality / fine art print

Once configured:
  · Hovering over any photo on the canvas shows its physical size in a
    small tag (e.g. "320 × 213 px  ·  2.7 cm × 1.8 cm").
  · The info panel on the left sidebar shows the physical dimensions of
    the hovered photo.
  · The breadcrumb at the top shows the active DPI and unit setting.


--------------------------------------------------------------------------------
  PHOTO INFORMATION PANEL
--------------------------------------------------------------------------------

Hover over any photo — either on the canvas or in the library bar — to
display its details in the lower section of the left sidebar:

  · File name
  · Original dimensions and file size
  · Current size on the canvas (px and physical if DPI is configured)
  · List of all boards in which the photo appears
    (the current board is highlighted in amber)


--------------------------------------------------------------------------------
  EXPORT AND REPORT
--------------------------------------------------------------------------------

EXPORT BOARD AS JPEG
  · Click  ⬇ Export JPEG  in the top bar.
  · The entire board is rendered as a flat JPEG image and downloaded.
  · Photos are composited with their current sizes, positions, and rotations.
  · The canvas is scaled down automatically if it exceeds 7000 px.

PROJECT REPORT  (print dimensions reference)
  · Click  ≡ Report  in the top bar.
  · A modal lists every board in the project with all placed photos,
    their pixel sizes, and their physical sizes (if DPI is configured).
  · Click  ⎙ Print / Save PDF  to open a print-ready page in a new window.
    Use your browser's  Ctrl+P  →  "Save as PDF"  to export a PDF document.


--------------------------------------------------------------------------------
  PREFERENCES
--------------------------------------------------------------------------------

Click the small coloured dot (●) at the far right of the top bar to open
the Preferences panel.

THEMES  (4 options)
  · Dark · Amber       — default, warm dark background
  · Light · Natural    — warm cream background, for bright environments
  · Dark · Cool        — dark with blue accent
  · High Contrast      — pure black background, maximum accessibility

LANGUAGE
  · Español  /  English

Both preferences are saved in your browser and restored on next launch.


--------------------------------------------------------------------------------
  DATA AND BACKUP
--------------------------------------------------------------------------------

All data is stored locally on your computer in the  data/  folder inside
the tableau directory.

  data/
    projects.json          — list of all projects
    <project-id>/
      photos.json          — photo metadata for this project
      boards.json          — board list and configuration
      photos/              — processed photo files and thumbnails
      boards/              — board layout files (one JSON per board)

To back up all your projects, copy the entire  data/  folder.
To move the application to another computer, copy the full tableau folder.
Existing project data is preserved across updates.


--------------------------------------------------------------------------------
  TECHNICAL NOTES
--------------------------------------------------------------------------------

  · The application runs entirely on your local machine. No data is sent
    to any external server.

  · The server runs on port 3000 by default. To use a different port,
    set the PORT environment variable before starting:
        set PORT=8080  &&  node server.js

  · Uploaded photos are processed with sharp (server-side):
    resized to max 1800 px, auto-rotated from EXIF data, saved as JPEG.

  · Node.js packages used: express, multer, sharp, uuid.


================================================================================
  Version: 2025  —  https://nodejs.org  for Node.js downloads
================================================================================
