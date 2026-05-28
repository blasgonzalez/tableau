# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # production server on http://localhost:3000
npm run dev        # development with nodemon auto-reload
installer\build.bat  # build all installers into dist/
```

No test suite, no linter. There is no build step for the frontend.

## Architecture

**Tableau is a local-only, single-user web app** — Express serves both the API and the single-page frontend. There is no database; all data is stored as JSON files and JPEGs on disk.

### Two files contain the entire application

- **`server.js`** — Express REST API + static serving. All file I/O, image processing (sharp), ZIP export/import.
- **`public/index.html`** — The complete frontend: all CSS, the React app (single `App()` component), JSX via Babel standalone, and both ES/EN translations. No bundler, no sub-components, no imports.

### Data layout (`DATA_DIR`, default `./data`)

```
data/
  projects.json              [{id, name, created}]
  {pid}/
    photos.json              [{id, name, w, h, size}]
    boards.json              [{id, name, dpi, units, fixed, fixedW, fixedH, defaultFrame}]
    rooms.json               [{id, name, walls:[…], blocks:[…], columns:[…]}]
    photos/{id}.jpg
    photos/{id}_thumb.jpg
    boards/{bid}.json        [{id, type, photoId, x, y, w, z, rot, label, frame}]
```

Board items: `type: 'photo'` (or absent) = photo, `type: 'text'` = free text, `type: 'note'` = post-it (internal-only, never rendered in 3D).

Room model:
- `walls`: segments of a closed polygon. Each wall has `boardId` (interior, side A) and/or `boardIdBack` (exterior, side B).
- `blocks`: axis-aligned solids `{id, x, y, w, d, h, color, label, rot, faces:{n,s,e,w,t}}`. Each `faces.{dir}` may have `{boardId}` linking it to a board. `rot` is rotation around the vertical axis in degrees (SVG convention: positive = clockwise viewed from above).
- `columns`: pillars with their own dimensions.

When a wall length or block face dimensions change, the linked board's `fixedW`/`fixedH` go out of sync. The UI surfaces a sync button; the actual resize is performed client-side via the standard board update API.

### React state pattern

The app uses a **state + ref dual pattern** throughout. Every piece of state used inside event handlers or async callbacks has both a `useState` and a `useRef` (e.g. `items`/`itemsRef`, `bid`/`bidRef`, `photos`/`photosRef`). The refs avoid stale-closure bugs in pointer/keyboard handlers; the state drives re-renders. Always update both.

### i18n

`t(key, ...args)` looks up `I18N[lang][key]`. If the value is a function it is called with `args`; if it's a string it's returned directly. **Never call `t('key')(arg)`** — always pass args inline: `t('key', arg)`. Translations live in the `I18N` object near the top of `index.html`.

### Canvas zoom

The canvas uses the CSS `zoom` property (not `transform: scale`). A `--canvas-zoom` CSS variable is set on the canvas element so that UI overlays (`.bitem-bar`, `.dim-tag`, `.rh`, `.props-panel`) can counter-scale with `zoom: calc(1 / var(--canvas-zoom, 1))` and adjusted absolute positions, keeping them readable at any zoom level.

`getBoardPx(board)` returns `{w, h}` in pixels for fixed-size boards, or `null` for variable boards.

### Room floor plan ↔ 3D viewport coordinates

The room editor renders the floor plan in **SVG** (top-down) and the 3D view in **Three.js**. These two systems disagree on rotation sign and Y axis, and getting this wrong causes meshes to drift off their planes:

- SVG `rotate(θ)` with `θ > 0` rotates **clockwise** (Y points down on screen).
- Three.js `rotation.y = θ` with `θ > 0` rotates **counter-clockwise** viewed from above (Y points up, right-hand rule).

So when a block's `rot` is the SVG angle, the Three.js `BoxGeometry` and any group anchoring face-mesh children must use `rotation.y = -rot * π/180`. The block's face board planes are positioned via the same rotated-corner formula used in SVG so they line up.

For the **top face** of a rotated block, the face boards/frames are children of a `THREE.Group` placed at the block center with `group.rotation.y = -rotRad`. Children are flat planes (`rotation.x = -π/2` only — never add `rotation.y` to the child or it tilts out of horizontal). Item rotation (`item.rot` + `item.freeRot`) goes on the child's `rotation.z`.

For photos with `item.rot` of 90° or 270° on a top-face board, the display height uses the **swapped aspect ratio** (`photo.w / photo.h` instead of `photo.h / photo.w`) so the centering math matches what the canvas shows.

### Server auto-shutdown

The browser sends `POST /api/heartbeat` periodically. If the server receives no heartbeat for 90 s it calls `process.exit(0)`. This is how the server shuts down when all browser tabs are closed.

## Version bumps

When bumping the version, update all four locations:

1. `package.json` → `version`
2. `installer/tableau.iss` → `MyAppVersion`
3. `installer/version.json` → `version`, `releaseDate`, `notes`
4. `CHANGELOG.md` + `CHANGELOG.en.md`

## Windows batch files

Do **not** add `chcp 65001` inside `.bat` files that are executed by CMD — it causes a known Windows bug where subsequent `echo` commands lose their first character. Avoid accented characters in batch file text instead.
