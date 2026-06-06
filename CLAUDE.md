# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # production server on http://localhost:3000
npm run dev        # development with nodemon auto-reload
npm test           # server-route test suite (added in Fase 0)
installer\build.bat  # build all installers into dist/
```

No linter. There is no manual build step for the frontend.

**Tests:** `npm test` runs the server-route suite against an **isolated temporary data dir** — tests must never touch the real `DATA_DIR`. Run it after any change that touches `server.js`.

Runner: Node.js built-in `node:test` (Node 18+), HTTP assertions via `supertest` (devDependency). Each file runs in its own child process so `TABLEAU_AUTH` and `TABLEAU_DATA_DIR` can be set before `require('../server')` — those constants are captured at load time and cannot change afterwards. 60 tests total:

| File | Auth | Covers |
|---|---|---|
| `tests/local.test.js` | off | Projects, boards, items, rename, trash basics |
| `tests/auth.test.js` | on | Login, lockout, expiry, session, change-password, admin, user isolation |
| `tests/share.test.js` | on | Share tokens, guest board filtering, private boards, locks, owner-as-guest regression |
| `tests/trash.test.js` | off | Full photo/project trash cycle: delete → restore → permanent delete → empty |

### JSX pre-compilation

On server start, `server.js` compiles `public/index.html` (which contains JSX) using `@babel/core` + `@babel/preset-react` + `@babel/plugin-transform-block-scoping` and caches the result to `public/_built.html`. Subsequent requests serve the cached file (instant). The cache invalidates automatically when `index.html` changes (mtime check). React and ReactDOM are served locally from `node_modules` — no CDN dependency. `_built.html` is gitignored.

## Architecture

**Tableau is a web app for visual photography project management** — Express serves both the REST API and the single-page frontend. There is no database; all data is stored as JSON files and JPEGs on disk.

### Two run modes

- **Local mode (default):** single user, no auth. The server auto-shuts down on inactivity (see *Server auto-shutdown* below). This is the mature, most battle-tested mode.
- **Server mode (`TABLEAU_AUTH=true`):** multiple users with their own accounts and **isolated data spaces**. Adds login/auth, password recovery by email (SMTP), project sharing by link (read-only or edit) with email invitations, private boards (invisible/inaccessible to guests), and a primitive board lock (the first editor holds a lock; others see the board read-only). A registered user who opens an invitation link accesses the shared project **as a guest**, not as the owner of their own account. Newer and less battle-tested than local mode. Hosted on an external server (ISP); its process lifecycle is managed by the host, not the browser.

### Two files contain the entire application

- **`server.js`** — Express REST API + static serving. All file I/O, image processing (sharp), ZIP export/import, and (in server mode) auth, sharing, user management.
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

**Trash (papelera):** deleted photos and whole projects are retained for 30 days before automatic purge on server start (`runStartupPurge`); they can be restored until then.

```
{dd}/{pid}/trash/photos/          ← JPEG + thumb files of deleted photos
{dd}/{pid}/trash/photos.json      ← [{id, name, w, h, size, deletedAt}]

{dd}/.trash/{pid}/                ← full project directory copy
{dd}/.trash/{pid}/_meta.json      ← {name, deletedAt}
```

`dd` is `DATA_DIR` in local mode, `DATA_DIR/{userId}` in server mode.

**Server mode:** each user has an isolated data space. Global state under `DATA_DIR`:

```
data/
  users.json          [{id, username, email, passwordHash, role, quota, expiresAt, …}]
  shares.json         {[token]: {ownerId, projectId, role:'view'|'edit', created}}
  reset-tokens.json   {[token]: {userId, expires}}   ← transient, cleaned on use
  {userId}/           ← each user's full data dir (same layout as local mode's DATA_DIR)
```

Board locks are **in-memory only** (`boardLocks` object, `LOCK_TIMEOUT = 25 s`); they reset on server restart. `users.json` must not be committed to git (gitignored).

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

Behaviour depends on the run mode:

- **Local mode:** the browser sends `POST /api/heartbeat` every 30 s (and on tab-visibility change). If the server receives no heartbeat for **5 min** (`HEARTBEAT_TIMEOUT = 300 000 ms`) it calls `process.exit(0)`. The endpoint returns `204`. This is how the desktop server shuts down when all browser tabs are closed, avoiding an orphaned Node process.
- **Server mode (`TABLEAU_AUTH=true`):** heartbeats are **ignored** and the server **never auto-shuts-down**. The endpoint returns `200`; on receiving that status the client cancels its interval and stops sending entirely. Do not re-introduce heartbeat-based shutdown in this mode.

Implementation (`server.js`): `const AUTO_SHUTDOWN = !AUTH_ENABLED && process.env.TABLEAU_AUTO_SHUTDOWN !== 'false'`. When `AUTO_SHUTDOWN` is false, `resetHeartbeat()` is a no-op and the timer is never armed. `TABLEAU_AUTO_SHUTDOWN=false` also overrides in local mode (used by the test suite).

### Data auto-backup (Fase 0)

A configurable auto-backup periodically snapshots `DATA_DIR` as a timestamped ZIP with retention/rotation, plus an on-demand manual trigger. Failures are logged without crashing the server.

| Env var | Default | Description |
|---|---|---|
| `TABLEAU_BACKUP` | `true` | Set to `false` to disable |
| `TABLEAU_BACKUP_DIR` | `backups/` sibling to `DATA_DIR` | Absolute path for ZIP output |
| `TABLEAU_BACKUP_INTERVAL_MIN` | `60` | Minutes between automatic snapshots |
| `TABLEAU_BACKUP_MAX_KEEP` | `10` | Maximum ZIPs to retain; oldest deleted on rotation |

ZIP names: `tableau_YYYY-MM-DDTHH-MM-SS.zip`. Written atomically (`.zip.tmp` → rename). The interval timer uses `.unref()` so it does not block process exit.

Manual trigger: `POST /api/backup` (local: no auth; server mode: admin only). List backups: `GET /api/backup/list`.

## Version bumps

When bumping the version, update all four locations:

1. `package.json` → `version`
2. `installer/tableau.iss` → `MyAppVersion`
3. `installer/version.json` → `version`, `releaseDate`, `notes`
4. `CHANGELOG.md` + `CHANGELOG.en.md`

## Windows batch files

Do **not** add `chcp 65001` inside `.bat` files that are executed by CMD — it causes a known Windows bug where subsequent `echo` commands lose their first character. Avoid accented characters in batch file text instead.
