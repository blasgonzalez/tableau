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
    photos/{id}.jpg
    photos/{id}_thumb.jpg
    boards/{bid}.json        [{id, type, photoId, x, y, w, z, rot, label, frame}]
```

Board items with `type: 'note'` are floating text notes; items without a type (or `type` absent) are photos.

### React state pattern

The app uses a **state + ref dual pattern** throughout. Every piece of state used inside event handlers or async callbacks has both a `useState` and a `useRef` (e.g. `items`/`itemsRef`, `bid`/`bidRef`, `photos`/`photosRef`). The refs avoid stale-closure bugs in pointer/keyboard handlers; the state drives re-renders. Always update both.

### i18n

`t(key, ...args)` looks up `I18N[lang][key]`. If the value is a function it is called with `args`; if it's a string it's returned directly. **Never call `t('key')(arg)`** — always pass args inline: `t('key', arg)`. Translations live in the `I18N` object near the top of `index.html`.

### Canvas zoom

The canvas uses the CSS `zoom` property (not `transform: scale`). A `--canvas-zoom` CSS variable is set on the canvas element so that UI overlays (`.bitem-bar`, `.dim-tag`, `.rh`, `.props-panel`) can counter-scale with `zoom: calc(1 / var(--canvas-zoom, 1))` and adjusted absolute positions, keeping them readable at any zoom level.

`getBoardPx(board)` returns `{w, h}` in pixels for fixed-size boards, or `null` for variable boards.

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
