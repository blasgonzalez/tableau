try { require('dotenv').config(); } catch {} // carga .env si existe (opcional)
const express = require('express');
const multer  = require('multer');
let   _sharpMod = null;
const sharp     = (...a) => { if (!_sharpMod) _sharpMod = require('sharp'); return _sharpMod(...a); };
const path    = require('path');
const fs      = require('fs');
const { v4: uuidv4 } = require('uuid');
const AdmZip  = require('adm-zip');
const session = require('express-session');
const bcrypt  = require('bcryptjs');
const { version: APP_VERSION } = require('./package.json');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Auth config ───────────────────────────────────────────────────────────────
// TABLEAU_AUTH=true activa autenticación de usuarios (modo servidor)
// En modo local (defecto) no hay auth y todos los datos van a DATA_DIR
const AUTH_ENABLED     = process.env.TABLEAU_AUTH === 'true';
const SESSION_SECRET   = process.env.TABLEAU_SESSION_SECRET || 'tableau-dev-secret';
const DEFAULT_QUOTA    = parseInt(process.env.TABLEAU_DEFAULT_QUOTA_MB || '25') * 1024 * 1024;
const APP_URL          = (process.env.TABLEAU_APP_URL || 'http://localhost:3000').replace(/\/$/, '');

// ── Email (nodemailer, solo con AUTH_ENABLED) ─────────────────────────────────
let _mailer = null;
function getMailer() {
  if (_mailer) return _mailer;
  if (!process.env.TABLEAU_SMTP_HOST) return null;
  try {
    const nodemailer = require('nodemailer');
    _mailer = nodemailer.createTransport({
      host:   process.env.TABLEAU_SMTP_HOST,
      port:   parseInt(process.env.TABLEAU_SMTP_PORT || '587'),
      secure: process.env.TABLEAU_SMTP_SECURE === 'true',
      auth: { user: process.env.TABLEAU_SMTP_USER, pass: process.env.TABLEAU_SMTP_PASS },
    });
    return _mailer;
  } catch { return null; }
}

async function sendMail({ to, subject, html }) {
  const mailer = getMailer();
  if (!mailer) { console.warn('[mail] SMTP no configurado'); return false; }
  const from = process.env.TABLEAU_SMTP_FROM || process.env.TABLEAU_SMTP_USER;
  try { await mailer.sendMail({ from, to, subject, html }); return true; }
  catch (e) { console.error('[mail] Error:', e.message); return false; }
}

// ── Embedded fonts for SVG/text export ───────────────────────────────────────
const FONTS_DIR = path.join(__dirname, 'fonts');
const resolveFontFile = name => { const p = path.join(FONTS_DIR, name); return fs.existsSync(p) ? p : null; };
const EXPORT_FONTS = {
  serif:   { name: 'Playfair Display', file: resolveFontFile('PlayfairDisplay.ttf') },
  sans:    { name: 'DM Sans',          file: resolveFontFile('DMSans.ttf') },
  display: { name: 'Bebas Neue',       file: resolveFontFile('BebasNeue.ttf') },
  mono:    { name: 'IBM Plex Mono',    file: resolveFontFile('IBMPlexMono.ttf') },
};

// Register fonts with fontconfig so Pango/libvips can find them by name
try {
  const fcCacheDir = path.join(FONTS_DIR, '.fc-cache');
  if (!fs.existsSync(fcCacheDir)) fs.mkdirSync(fcCacheDir);
  const fcConf = `<?xml version="1.0"?>\n<fontconfig>\n  <dir>${FONTS_DIR.replace(/\\/g, '/')}</dir>\n  <cachedir>${fcCacheDir.replace(/\\/g, '/')}</cachedir>\n</fontconfig>`;
  const fcConfPath = path.join(FONTS_DIR, 'fontconfig.conf');
  fs.writeFileSync(fcConfPath, fcConf);
  process.env.FONTCONFIG_FILE = fcConfPath;
} catch (e) {
  console.warn('Could not configure fontconfig:', e.message);
}

// ── Config ───────────────────────────────────────────────────────────────────
const DATA_DIR       = process.env.TABLEAU_DATA_DIR || path.join(__dirname, 'data');
const MAX_UPLOAD_MB  = 80;
const RESIZE_PX      = parseInt(process.env.TABLEAU_RESIZE_PX    || '1800');  // dimensión máxima almacenada
const THUMB_PX       = 260;
const JPEG_QUALITY   = parseInt(process.env.TABLEAU_JPEG_QUALITY || '87');    // calidad JPEG 1-100
const IMAGE_EXT      = new Set(['.jpg', '.jpeg', '.png', '.webp', '.tiff', '.tif', '.avif']);

// ── File system helpers ──────────────────────────────────────────────────────
const ensureDir = d => { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); };

ensureDir(DATA_DIR);
ensureDir(path.join(__dirname, 'public'));

// Path helpers — aceptan dd (data dir del usuario) para aislar datos por usuario
const projsFile      = (dd = DATA_DIR)          => path.join(dd, 'projects.json');
const projDir        = (pid, dd = DATA_DIR)     => path.join(dd, pid);
const photoDir       = (pid, dd = DATA_DIR)     => path.join(dd, pid, 'photos');
const boardDir       = (pid, dd = DATA_DIR)     => path.join(dd, pid, 'boards');
const boardFile      = (pid, bid, dd = DATA_DIR)=> path.join(boardDir(pid, dd), `${bid}.json`);
const boardsMeta     = (pid, dd = DATA_DIR)     => path.join(projDir(pid, dd), 'boards.json');
const photosMeta     = (pid, dd = DATA_DIR)     => path.join(projDir(pid, dd), 'photos.json');
const roomFile       = (pid, dd = DATA_DIR)     => path.join(projDir(pid, dd), 'room.json');
const roomsFile      = (pid, dd = DATA_DIR)     => path.join(projDir(pid, dd), 'rooms.json');
const photoTrashDir  = (pid, dd = DATA_DIR)     => path.join(dd, pid, 'trash', 'photos');
const photoTrashMeta = (pid, dd = DATA_DIR)     => path.join(dd, pid, 'trash', 'photos.json');
const projTrashDir   = (dd = DATA_DIR)          => path.join(dd, '.trash');

// Migrate single room.json → rooms.json on first access
function migrateRooms(pid, dd = DATA_DIR) {
  const nf = roomsFile(pid, dd);
  if (fs.existsSync(nf) && readJSON(nf, []).length > 0) return;
  const of = roomFile(pid, dd);
  if (fs.existsSync(of)) {
    const old = readJSON(of, null);
    if (old && old.vertices) {
      writeJSON(nf, [{ id: `r${Date.now().toString(36)}`, name: old.name || 'Sala', ...old }]);
      return;
    }
  }
  if (!fs.existsSync(nf)) writeJSON(nf, []);
}

function readJSON(file, def = []) {
  try   { return JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch { return def; }
}
function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
}

function initProject(pid, dd = DATA_DIR) {
  ensureDir(projDir(pid, dd));
  ensureDir(photoDir(pid, dd));
  ensureDir(boardDir(pid, dd));
  if (!fs.existsSync(boardsMeta(pid, dd))) writeJSON(boardsMeta(pid, dd), []);
  if (!fs.existsSync(photosMeta(pid, dd))) writeJSON(photosMeta(pid, dd), []);
}

// ── Trash purge ───────────────────────────────────────────────────────────────
const TRASH_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

function purgeOldTrash(dd) {
  if (!fs.existsSync(dd)) return;
  const now = Date.now();
  for (const entry of fs.readdirSync(dd, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name.startsWith('.')) continue;
    const pid = entry.name;
    const tmf = photoTrashMeta(pid, dd);
    if (!fs.existsSync(tmf)) continue;
    const trashed = readJSON(tmf, []);
    const surviving = trashed.filter(p => {
      if (now - p.deletedAt <= TRASH_MAX_AGE_MS) return true;
      [`${p.id}.jpg`, `${p.id}_thumb.jpg`].forEach(f => { try { fs.unlinkSync(path.join(photoTrashDir(pid, dd), f)); } catch {} });
      return false;
    });
    if (surviving.length !== trashed.length) writeJSON(tmf, surviving);
  }
  const ptd = projTrashDir(dd);
  if (!fs.existsSync(ptd)) return;
  for (const e of fs.readdirSync(ptd, { withFileTypes: true })) {
    if (!e.isDirectory()) continue;
    const mf = path.join(ptd, e.name, '_meta.json');
    const meta = readJSON(mf, null);
    if (meta && now - meta.deletedAt > TRASH_MAX_AGE_MS)
      fs.rmSync(path.join(ptd, e.name), { recursive: true, force: true });
  }
}

function runStartupPurge() {
  if (AUTH_ENABLED) {
    for (const user of loadUsers()) purgeOldTrash(path.join(DATA_DIR, user.id));
  } else {
    purgeOldTrash(DATA_DIR);
  }
}

// ── Gestión de usuarios (solo cuando AUTH_ENABLED) ───────────────────────────
const usersFile = () => path.join(DATA_DIR, 'users.json');
const loadUsers = () => { try { return JSON.parse(fs.readFileSync(usersFile(), 'utf8')); } catch { return []; } };
const saveUsers = u  => { fs.mkdirSync(DATA_DIR, { recursive: true }); fs.writeFileSync(usersFile(), JSON.stringify(u, null, 2)); };

function dirSize(dir) {
  if (!fs.existsSync(dir)) return 0;
  let total = 0;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    total += e.isDirectory() ? dirSize(p) : fs.statSync(p).size;
  }
  return total;
}

// ── Reset tokens ──────────────────────────────────────────────────────────────
const resetTokensFile = () => path.join(DATA_DIR, 'reset-tokens.json');
function loadTokens()   { try { return JSON.parse(fs.readFileSync(resetTokensFile(), 'utf8')); } catch { return {}; } }
function saveTokens(t)  { fs.writeFileSync(resetTokensFile(), JSON.stringify(t)); }
function createResetToken(userId) {
  const tokens = loadTokens();
  // Limpiar tokens expirados
  const now = Date.now();
  for (const [k, v] of Object.entries(tokens)) { if (v.expires < now) delete tokens[k]; }
  const token = uuidv4().replace(/-/g, '');
  tokens[token] = { userId, expires: now + 60 * 60 * 1000 }; // 1 hora
  saveTokens(tokens);
  return token;
}
function consumeResetToken(token) {
  const tokens = loadTokens();
  const entry  = tokens[token];
  if (!entry || entry.expires < Date.now()) return null;
  delete tokens[token];
  saveTokens(tokens);
  return entry.userId;
}

// ── Share tokens ──────────────────────────────────────────────────────────────
// Only active in AUTH_ENABLED mode. Stored in DATA_DIR/shares.json.
// { [token]: { ownerId, projectId, role: 'view'|'edit', created } }
const sharesIndexFile = () => path.join(DATA_DIR, 'shares.json');
function loadShares() { try { return JSON.parse(fs.readFileSync(sharesIndexFile(), 'utf8')); } catch { return {}; } }
function saveShares(s) { fs.writeFileSync(sharesIndexFile(), JSON.stringify(s)); }
function resolveShareToken(token) {
  if (!AUTH_ENABLED || !token) return null;
  return loadShares()[token] || null;
}

// resolveAccess: accepts session auth OR valid share token.
// Sets req.dd, req.shareRole (null=owner, 'view'|'edit'=guest), req.sharePid, req.shareToken.
function resolveAccess(req, res, next) {
  if (!AUTH_ENABLED) { req.dd = DATA_DIR; req.shareRole = null; return next(); }
  if (req.session?.userId) {
    const user = loadUsers().find(u => u.id === req.session.userId);
    if (user && !(user.expiresAt && user.expiresAt < Date.now())) {
      req.dd = path.join(DATA_DIR, user.id);
      req.shareRole = null;
      return next();
    }
  }
  // Session-activated share (set by POST /api/share/:token/activate — allows image requests
  // to work without custom headers since the browser sends the session cookie automatically).
  if (req.session?.shareInfo) {
    const share = resolveShareToken(req.session.shareInfo.token);
    if (share) {
      if (req.params.pid && req.params.pid !== share.projectId)
        return res.status(403).json({ error: 'Token no válido para este proyecto' });
      req.dd        = path.join(DATA_DIR, share.ownerId);
      req.shareRole = share.role;
      req.sharePid  = share.projectId;
      req.shareToken = req.session.shareInfo.token;
      return next();
    }
    delete req.session.shareInfo; // token revoked
  }
  const token = req.headers['x-share-token'] || req.query.token;
  if (token) {
    const share = resolveShareToken(token);
    if (share) {
      if (req.params.pid && req.params.pid !== share.projectId)
        return res.status(403).json({ error: 'Token no válido para este proyecto' });
      req.dd        = path.join(DATA_DIR, share.ownerId);
      req.shareRole = share.role;
      req.sharePid  = share.projectId;
      req.shareToken = token;
      return next();
    }
  }
  return res.status(401).json({ error: 'No autenticado' });
}

// requireEditAccess: resolveAccess + must not be view-only
function requireEditAccess(req, res, next) {
  resolveAccess(req, res, () => {
    if (req.shareRole === 'view') return res.status(403).json({ error: 'Acceso de solo lectura' });
    next();
  });
}

// ── Board locks (in-memory, resets on restart) ─────────────────────────────────
const boardLocks   = {};
const LOCK_TIMEOUT = 25_000;

function lockKey(dd, pid, bid) { return `${dd}|${pid}|${bid}`; }

function getLock(dd, pid, bid) {
  const key  = lockKey(dd, pid, bid);
  const lock = boardLocks[key];
  if (!lock) return null;
  if (Date.now() - lock.at > LOCK_TIMEOUT) { delete boardLocks[key]; return null; }
  return lock;
}

function acquireLock(dd, pid, bid, token) {
  const existing = getLock(dd, pid, bid);
  if (existing && existing.token !== token) return false;
  boardLocks[lockKey(dd, pid, bid)] = { token, at: Date.now() };
  return true;
}

function releaseLock(dd, pid, bid, token) {
  const key  = lockKey(dd, pid, bid);
  const lock = boardLocks[key];
  if (lock && lock.token === token) { delete boardLocks[key]; return true; }
  return false;
}

// ── Admin middleware ───────────────────────────────────────────────────────────
function requireAdmin(req, res, next) {
  if (!AUTH_ENABLED) return res.status(403).json({ error: 'Solo disponible en modo servidor' });
  if (!req.session?.userId) return res.status(401).json({ error: 'No autenticado' });
  const user = loadUsers().find(u => u.id === req.session.userId);
  if (!user || user.role !== 'admin') return res.status(403).json({ error: 'No autorizado' });
  next();
}

// ── Política de contraseñas ───────────────────────────────────────────────────
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_MS         = 15 * 60 * 1000; // 15 minutos

function validatePassword(pwd) {
  const errors = [];
  if (!pwd || pwd.length < 8)    errors.push('Mínimo 8 caracteres');
  if (!/[A-Z]/.test(pwd))        errors.push('Al menos una mayúscula');
  if (!/[a-z]/.test(pwd))        errors.push('Al menos una minúscula');
  if (!/[0-9]/.test(pwd))        errors.push('Al menos un número');
  return errors; // [] = válida
}

// Genera contraseña temporal legible (cumple la política)
function tempPassword() {
  const lower   = 'abcdefghijkmnpqrstuvwxyz';
  const upper   = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const digits  = '23456789';
  const all     = lower + upper + digits;
  const base    = Array.from({ length: 9 }, () => all[Math.floor(Math.random() * all.length)]);
  base[0] = upper[Math.floor(Math.random() * upper.length)];
  base[1] = digits[Math.floor(Math.random() * digits.length)];
  return base.sort(() => Math.random() - 0.5).join('');
}

function newId(len = 10) {
  return uuidv4().replace(/-/g, '').slice(0, len);
}

// ── EXIF parser (no external deps — reads raw TIFF buffer from sharp) ─────────
function parseExifBuffer(buf) {
  if (!buf || buf.length < 8) return null;
  try {
    // Sharp includes the "Exif\0\0" APP1 prefix before the TIFF header
    if (buf[0] === 0x45 && buf[1] === 0x78 && buf[2] === 0x69 && buf[3] === 0x66) buf = buf.slice(6);
    if (buf.length < 8) return null;
    const le = buf[0] === 0x49;
    const u16 = o => le ? buf.readUInt16LE(o) : buf.readUInt16BE(o);
    const u32 = o => le ? buf.readUInt32LE(o) : buf.readUInt32BE(o);
    const s32 = o => le ? buf.readInt32LE(o) : buf.readInt32BE(o);
    if (u16(2) !== 42) return null;
    const TYPE_SIZE = [0,1,1,2,4,8,1,1,2,4,8,4,8];
    function readVal(type, off, count) {
      if (type === 2)  return buf.slice(off, off + count).toString('latin1').replace(/\0.*$/, '').trim();
      if (type === 3)  return u16(off);
      if (type === 4)  return u32(off);
      if (type === 5)  { const d = u32(off + 4); return d ? u32(off) / d : 0; }
      if (type === 9)  return s32(off);
      if (type === 10) { const d = s32(off + 4); return d ? s32(off) / d : 0; }
      return null;
    }
    function readIFD(offset) {
      if (offset < 8 || offset + 2 > buf.length) return {};
      const tags = {}, n = u16(offset);
      for (let i = 0; i < n; i++) {
        const e = offset + 2 + i * 12;
        if (e + 12 > buf.length) break;
        const tag = u16(e), type = u16(e+2), count = u32(e+4);
        if (!type || type >= TYPE_SIZE.length) continue;
        const bytes = TYPE_SIZE[type] * count;
        const doff = bytes <= 4 ? e + 8 : u32(e + 8);
        if (doff + bytes > buf.length) continue;
        try { tags[tag] = readVal(type, doff, count); } catch {}
      }
      return tags;
    }
    const ifd0 = readIFD(u32(4));
    const out = {};
    if (ifd0[0x010F]) out.make  = String(ifd0[0x010F]).trim();
    if (ifd0[0x0110]) { let m = String(ifd0[0x0110]).trim(); if (out.make && m.toLowerCase().startsWith(out.make.toLowerCase())) m = m.slice(out.make.length).trim(); out.model = m; }
    const ep = ifd0[0x8769];
    if (ep) {
      const ex = readIFD(ep);
      const dto = ex[0x9003] || ex[0x9004];
      if (dto) out.dateTaken = String(dto).trim();
      const et = ex[0x829A]; if (et > 0) out.shutter = et < 0.5 ? `1/${Math.round(1/et)}` : `${Math.round(et*10)/10}s`;
      const fn = ex[0x829D]; if (fn > 0) out.aperture = Math.round(fn * 10) / 10;
      const iso = ex[0x8827]; if (iso != null) out.iso = iso;
      const fl = ex[0x920A]; if (fl > 0) out.focalLength = Math.round(fl);
      const lens = ex[0xA434]; if (lens) out.lens = String(lens).trim();
    }
    return Object.keys(out).length ? out : null;
  } catch { return null; }
}

// ── Image processing ─────────────────────────────────────────────────────────
async function processImage(input, pid, existingId = null, dd = DATA_DIR) {
  const id = existingId || newId(12);

  const origMeta = await sharp(input).metadata();
  const exif = origMeta.exif ? parseExifBuffer(origMeta.exif) : null;

  // Original pixel dimensions (corrected for EXIF orientation)
  const swapDims = origMeta.orientation >= 5 && origMeta.orientation <= 8;
  const origW = swapDims ? origMeta.height : origMeta.width;
  const origH = swapDims ? origMeta.width  : origMeta.height;
  const rawDpi   = origMeta.density || null;
  const origDpi  = rawDpi ? Math.round(origMeta.densityUnit === 'cm' ? rawDpi * 2.54 : rawDpi) : null;

  const resized = await sharp(input)
    .rotate()                    // aplica rotación EXIF automáticamente
    .resize(RESIZE_PX, RESIZE_PX, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
    .toBuffer();

  const [meta, stats] = await Promise.all([
    sharp(resized).metadata(),
    sharp(resized).stats(),
  ]);

  const thumb = await sharp(input)
    .rotate()
    .resize(THUMB_PX, THUMB_PX, { fit: 'inside' })
    .jpeg({ quality: 80 })
    .toBuffer();

  fs.writeFileSync(path.join(photoDir(pid, dd), `${id}.jpg`), resized);
  fs.writeFileSync(path.join(photoDir(pid, dd), `${id}_thumb.jpg`), thumb);

  const ch = stats.channels;
  const brightness = Math.round((0.299 * ch[0].mean + 0.587 * ch[1].mean + 0.114 * ch[2].mean) / 255 * 100) / 100;
  const meanColor = { r: Math.round(ch[0].mean), g: Math.round(ch[1].mean), b: Math.round(ch[2].mean) };
  return { id, w: meta.width, h: meta.height, size: resized.length, dominant: stats.dominant, brightness, meanColor, origW, origH, ...(origDpi && { origDpi }), ...(exif && { exif }) };
}

// ── Vendor libs (React/ReactDOM served locally — no CDN dependency) ──────────
const REACT_JS     = path.join(path.dirname(require.resolve('react/package.json')),     'umd', 'react.production.min.js');
const REACT_DOM_JS = path.join(path.dirname(require.resolve('react-dom/package.json')), 'umd', 'react-dom.production.min.js');
app.get('/vendor/react.js',     (_, res) => res.sendFile(REACT_JS));
app.get('/vendor/react-dom.js', (_, res) => res.sendFile(REACT_DOM_JS));

// ── index.html con JSX pre-transpilado (babel, ~2s, cacheado en disco) ───────
const HTML_SRC   = path.join(__dirname, 'public', 'index.html');
const HTML_BUILT = path.join(__dirname, 'public', '_built.html');
let _htmlReady   = null; // Promise<string>

function compileHtml() {
  return new Promise((resolve) => {
    try {
      const srcMtime = fs.statSync(HTML_SRC).mtimeMs;
      try {
        if (fs.statSync(HTML_BUILT).mtimeMs >= srcMtime)
          return resolve(fs.readFileSync(HTML_BUILT, 'utf8'));
      } catch {}
      const raw  = fs.readFileSync(HTML_SRC, 'utf8');
      const m    = raw.match(/<script type="text\/babel">([\s\S]*?)<\/script>/);
      if (!m) { fs.writeFileSync(HTML_BUILT, raw); return resolve(raw); }
      const babel  = require('@babel/core');
      const { code } = babel.transformSync(m[1], {
        presets: [['@babel/preset-react', { runtime: 'classic' }]],
        plugins: ['@babel/plugin-transform-block-scoping'],
        compact: false, sourceMaps: false
      });
      const built = raw
        .replace(/<script[^>]+unpkg\.com[^>]*><\/script>/g, '')
        .replace(m[0], `<script>${code}</script>`)
        .replace('</head>', '<script src="/vendor/react.js"></script>\n<script src="/vendor/react-dom.js"></script>\n</head>');
      fs.writeFileSync(HTML_BUILT, built);
      resolve(built);
    } catch (e) {
      console.error('HTML build error:', e.message);
      resolve(fs.readFileSync(HTML_SRC, 'utf8'));
    }
  });
}

// Compilar en background al arrancar — listo antes de que el navegador conecte
_htmlReady = compileHtml();

app.get('/', async (req, res) => {
  const html = await _htmlReady;
  try {
    if (fs.statSync(HTML_SRC).mtimeMs > fs.statSync(HTML_BUILT).mtimeMs)
      _htmlReady = compileHtml();
  } catch {}
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(html);
});

// ── Middleware ───────────────────────────────────────────────────────────────
app.use(express.json({ limit: '2mb' }));

if (AUTH_ENABLED) {
  app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000 },
  }));
}

// requireAuth: verifica sesión y asigna req.dd (data dir del usuario)
// En modo local (AUTH_ENABLED=false) siempre pasa y usa DATA_DIR global
function requireAuth(req, res, next) {
  if (!AUTH_ENABLED) { req.dd = DATA_DIR; return next(); }
  if (!req.session?.userId) return res.status(401).json({ error: 'No autenticado' });
  const user = loadUsers().find(u => u.id === req.session.userId);
  if (user?.expiresAt && user.expiresAt < Date.now())
    return res.status(403).json({ error: 'Cuenta expirada' });
  req.dd = path.join(DATA_DIR, req.session.userId);
  next();
}

// ── Auth endpoints ────────────────────────────────────────────────────────────
app.post('/api/login', (req, res) => {
  if (!AUTH_ENABLED) return res.json({ ok: true });
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'Credenciales requeridas' });
  const users = loadUsers();
  const user  = users.find(u => u.username === username);
  if (!user) return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });

  // Comprobar expiración de cuenta
  if (user.expiresAt && user.expiresAt < Date.now())
    return res.status(403).json({ error: 'Tu cuenta ha expirado. Contacta con el administrador.' });

  // Comprobar bloqueo
  if (user.lockedUntil && user.lockedUntil > Date.now()) {
    const mins = Math.ceil((user.lockedUntil - Date.now()) / 60000);
    return res.status(429).json({ error: `Cuenta bloqueada. Intenta de nuevo en ${mins} min.` });
  }

  if (!bcrypt.compareSync(password, user.passwordHash)) {
    user.loginAttempts = (user.loginAttempts || 0) + 1;
    if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
      user.lockedUntil   = Date.now() + LOCKOUT_MS;
      user.loginAttempts = 0;
      saveUsers(users);
      return res.status(429).json({ error: `Demasiados intentos. Cuenta bloqueada 15 minutos.` });
    }
    const restantes = MAX_LOGIN_ATTEMPTS - user.loginAttempts;
    saveUsers(users);
    return res.status(401).json({ error: `Usuario o contraseña incorrectos. Intentos restantes: ${restantes}.` });
  }

  // Login correcto — resetear contadores
  user.loginAttempts = 0;
  delete user.lockedUntil;
  user.lastLogin = Date.now();
  saveUsers(users);

  req.session.userId   = user.id;
  req.session.username = user.username;
  const used = dirSize(path.join(DATA_DIR, user.id));
  res.json({ ok: true, username: user.username, quota: user.quota, used, role: user.role || 'user', mustChangePassword: !!user.mustChangePassword, expiresAt: user.expiresAt || null });
});

app.post('/api/logout', (req, res) => {
  if (AUTH_ENABLED) req.session.destroy(() => {});
  res.json({ ok: true });
});

app.get('/api/me', (req, res) => {
  if (!AUTH_ENABLED) return res.json({ auth: false });
  if (!req.session?.userId) return res.json({ auth: true, authenticated: false });
  const users = loadUsers();
  const user  = users.find(u => u.id === req.session.userId);
  if (!user) return res.json({ auth: true, authenticated: false });
  const used = dirSize(path.join(DATA_DIR, user.id));
  res.json({ auth: true, authenticated: true, username: user.username, quota: user.quota, used, role: user.role || 'user', mustChangePassword: !!user.mustChangePassword, expiresAt: user.expiresAt || null });
});

// Cambio de contraseña (usuario autenticado)
app.post('/api/change-password', requireAuth, (req, res) => {
  const { currentPassword, newPassword } = req.body || {};
  const pwErrors = validatePassword(newPassword);
  if (pwErrors.length) return res.status(400).json({ error: pwErrors.join('. ') });
  const users = loadUsers();
  const user  = users.find(u => u.id === req.session.userId);
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
  if (currentPassword && !bcrypt.compareSync(currentPassword, user.passwordHash))
    return res.status(401).json({ error: 'Contraseña actual incorrecta' });
  user.passwordHash      = bcrypt.hashSync(newPassword, 10);
  user.mustChangePassword = false;
  saveUsers(users);
  res.json({ ok: true });
});

// Solicitar reset de contraseña (público)
app.post('/api/reset-password/request', async (req, res) => {
  if (!AUTH_ENABLED) return res.status(403).json({ error: 'No disponible' });
  const { email } = req.body || {};
  if (!email) return res.status(400).json({ error: 'Email requerido' });
  const users = loadUsers();
  const user  = users.find(u => u.email === email);
  res.json({ ok: true }); // Siempre responder ok (no revelar si el email existe)
  if (!user) return;
  const token = createResetToken(user.id);
  const link  = `${APP_URL}/?reset=${token}`;
  await sendMail({
    to: email,
    subject: 'Tableau — Recuperar contraseña',
    html: `<p>Hola ${user.username},</p><p>Haz clic en el siguiente enlace para restablecer tu contraseña (válido 1 hora):</p><p><a href="${link}">${link}</a></p><p>Si no solicitaste este cambio, ignora este mensaje.</p>`,
  });
});

// Confirmar reset de contraseña (público)
app.post('/api/reset-password/confirm', (req, res) => {
  if (!AUTH_ENABLED) return res.status(403).json({ error: 'No disponible' });
  const { token, newPassword } = req.body || {};
  if (!token || !newPassword) return res.status(400).json({ error: 'Datos incompletos' });
  const pwErrors2 = validatePassword(newPassword);
  if (pwErrors2.length) return res.status(400).json({ error: pwErrors2.join('. ') });
  const userId = consumeResetToken(token);
  if (!userId) return res.status(400).json({ error: 'Token inválido o expirado' });
  const users = loadUsers();
  const user  = users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
  user.passwordHash       = bcrypt.hashSync(newPassword, 10);
  user.mustChangePassword = false;
  saveUsers(users);
  res.json({ ok: true });
});

// ── Admin endpoints ───────────────────────────────────────────────────────────
function userStats(uid) {
  const dd = path.join(DATA_DIR, uid);
  const pf = path.join(dd, 'projects.json');
  if (!fs.existsSync(pf)) return { projects: 0, photos: 0, rooms: 0 };
  let projects = 0, photos = 0, rooms = 0;
  try {
    const projs = JSON.parse(fs.readFileSync(pf, 'utf8'));
    projects = projs.length;
    for (const p of projs) {
      const pm = path.join(dd, p.id, 'photos.json');
      if (fs.existsSync(pm)) photos += JSON.parse(fs.readFileSync(pm, 'utf8')).length;
      const rm = path.join(dd, p.id, 'rooms.json');
      if (fs.existsSync(rm)) rooms += JSON.parse(fs.readFileSync(rm, 'utf8')).length;
    }
  } catch {}
  return { projects, photos, rooms };
}

app.get('/api/admin/users', requireAdmin, (req, res) => {
  const users = loadUsers();
  res.json(users.map(u => ({
    id: u.id, username: u.username, email: u.email || '', role: u.role || 'user',
    quota: u.quota, used: dirSize(path.join(DATA_DIR, u.id)),
    mustChangePassword: !!u.mustChangePassword, created: u.created,
    expiresAt: u.expiresAt || null, lastLogin: u.lastLogin || null,
    ...userStats(u.id),
  })));
});

app.post('/api/admin/users', requireAdmin, async (req, res) => {
  const { username, email, quotaMb, role } = req.body || {};
  if (!username?.trim() || !email?.trim()) return res.status(400).json({ error: 'Usuario y email requeridos' });
  const users = loadUsers();
  if (users.find(u => u.username === username)) return res.status(409).json({ error: 'El usuario ya existe' });
  const pass  = tempPassword();
  const quota = Math.round((parseFloat(quotaMb) || DEFAULT_QUOTA / 1024 / 1024) * 1024 * 1024);
  const user  = { id: uuidv4(), username: username.trim(), email: email.trim(), passwordHash: bcrypt.hashSync(pass, 10), quota, role: role || 'user', mustChangePassword: true, created: Date.now() };
  users.push(user);
  saveUsers(users);
  fs.mkdirSync(path.join(DATA_DIR, user.id), { recursive: true });
  await sendMail({
    to: email,
    subject: 'Bienvenido a Tableau',
    html: `<p>Hola ${username},</p><p>Tu cuenta en Tableau ha sido creada.</p><p><strong>URL:</strong> <a href="${APP_URL}">${APP_URL}</a><br><strong>Usuario:</strong> ${username}<br><strong>Contraseña temporal:</strong> ${pass}</p><p>Al iniciar sesión por primera vez deberás cambiar tu contraseña.</p>`,
  });
  res.json({ ok: true, id: user.id });
});

app.delete('/api/admin/users/:uid', requireAdmin, (req, res) => {
  const { uid } = req.params;
  if (uid === req.session.userId) return res.status(400).json({ error: 'No puedes eliminarte a ti mismo' });
  const users = loadUsers();
  const idx   = users.findIndex(u => u.id === uid);
  if (idx === -1) return res.status(404).json({ error: 'Usuario no encontrado' });
  const dir = path.join(DATA_DIR, uid);
  users.splice(idx, 1);
  saveUsers(users);
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
  res.json({ ok: true });
});

app.patch('/api/admin/users/:uid/quota', requireAdmin, (req, res) => {
  const { quotaMb } = req.body || {};
  if (!quotaMb) return res.status(400).json({ error: 'quotaMb requerido' });
  const users = loadUsers();
  const user  = users.find(u => u.id === req.params.uid);
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
  user.quota = Math.round(parseFloat(quotaMb) * 1024 * 1024);
  saveUsers(users);
  res.json({ ok: true });
});

app.patch('/api/admin/users/:uid/expires', requireAdmin, (req, res) => {
  const { expiresAt } = req.body || {};
  const users = loadUsers();
  const user  = users.find(u => u.id === req.params.uid);
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
  if (expiresAt) user.expiresAt = new Date(expiresAt).getTime();
  else delete user.expiresAt;
  saveUsers(users);
  res.json({ ok: true });
});

app.post('/api/admin/users/:uid/reset-password', requireAdmin, async (req, res) => {
  const users = loadUsers();
  const user  = users.find(u => u.id === req.params.uid);
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
  const pass  = tempPassword();
  user.passwordHash       = bcrypt.hashSync(pass, 10);
  user.mustChangePassword = true;
  saveUsers(users);
  if (user.email) {
    await sendMail({
      to: user.email,
      subject: 'Tableau — Nueva contraseña',
      html: `<p>Hola ${user.username},</p><p>Tu contraseña ha sido restablecida.<br><strong>Nueva contraseña temporal:</strong> ${pass}</p><p>Al iniciar sesión deberás cambiarla.</p>`,
    });
  }
  res.json({ ok: true, ...(user.email ? {} : { tempPassword: pass }) });
});

// ── Share management endpoints (AUTH_ENABLED only) ───────────────────────────
app.get('/api/share/:token', (req, res) => {
  const share = resolveShareToken(req.params.token);
  if (!share) return res.status(404).json({ error: 'Enlace no válido' });
  const dd = path.join(DATA_DIR, share.ownerId);
  const proj = readJSON(projsFile(dd)).find(p => p.id === share.projectId);
  if (!proj) return res.status(404).json({ error: 'Proyecto no encontrado' });
  res.json({ role: share.role, project: { id: proj.id, name: proj.name } });
});

// Todas las invitaciones activas del usuario autenticado (para panel de gestión)
app.get('/api/shares', requireAuth, (req, res) => {
  if (!AUTH_ENABLED) return res.json([]);
  const ownerId  = req.session.userId;
  const allProjs = readJSON(projsFile(req.dd));
  const result   = [];
  for (const [token, s] of Object.entries(loadShares())) {
    if (s.ownerId !== ownerId) continue;
    const proj = allProjs.find(p => p.id === s.projectId);
    result.push({ token, projectId: s.projectId, projectName: proj?.name || s.projectId, role: s.role, created: s.created, url: `${APP_URL}/?share=${token}` });
  }
  result.sort((a, b) => b.created - a.created);
  res.json(result);
});

app.get('/api/projects/:pid/share', requireAuth, (req, res) => {
  if (!AUTH_ENABLED) return res.json({ view: null, edit: null });
  const { pid } = req.params;
  const ownerId = req.session.userId;
  const result  = { view: null, edit: null };
  for (const [tok, s] of Object.entries(loadShares())) {
    if (s.ownerId === ownerId && s.projectId === pid) {
      result[s.role] = { token: tok, url: `${APP_URL}/?share=${tok}`, created: s.created };
    }
  }
  res.json(result);
});

app.post('/api/projects/:pid/share', requireAuth, (req, res) => {
  if (!AUTH_ENABLED) return res.status(400).json({ error: 'Solo disponible en modo servidor' });
  const { pid } = req.params;
  const { role } = req.body;
  if (role !== 'view' && role !== 'edit') return res.status(400).json({ error: 'role debe ser view o edit' });
  const projects = readJSON(projsFile(req.dd));
  if (!projects.find(p => p.id === pid)) return res.status(404).json({ error: 'Proyecto no encontrado' });
  const ownerId = req.session.userId;
  const shares  = loadShares();
  for (const [tok, s] of Object.entries(shares)) {
    if (s.ownerId === ownerId && s.projectId === pid && s.role === role) delete shares[tok];
  }
  const token = uuidv4().replace(/-/g, '');
  shares[token] = { ownerId, projectId: pid, role, created: Date.now() };
  saveShares(shares);
  res.json({ token, url: `${APP_URL}/?share=${token}`, role });
});

app.delete('/api/projects/:pid/share/:role', requireAuth, (req, res) => {
  if (!AUTH_ENABLED) return res.status(400).json({ error: 'Solo disponible en modo servidor' });
  const { pid, role } = req.params;
  const ownerId = req.session.userId;
  const shares  = loadShares();
  for (const [tok, s] of Object.entries(shares)) {
    if (s.ownerId === ownerId && s.projectId === pid && s.role === role) delete shares[tok];
  }
  saveShares(shares);
  res.json({ ok: true });
});

// Stores the share token in the browser session so image requests (which can't send
// custom headers) are automatically authenticated via the session cookie.
app.post('/api/share/:token/activate', (req, res) => {
  const share = resolveShareToken(req.params.token);
  if (!share) return res.status(404).json({ error: 'Token no válido' });
  if (req.session) req.session.shareInfo = { token: req.params.token };
  res.json({ ok: true });
});

app.post('/api/projects/:pid/share/invite', requireAuth, async (req, res) => {
  if (!AUTH_ENABLED) return res.status(400).json({ error: 'Solo disponible en modo servidor' });
  const { pid } = req.params;
  const { email } = req.body || {};
  if (!email) return res.status(400).json({ error: 'Email requerido' });
  const sender = loadUsers().find(u => u.id === req.session.userId);
  const shares = loadShares();
  let token = null;
  for (const [tok, s] of Object.entries(shares)) {
    if (s.ownerId === req.session.userId && s.projectId === pid && s.role === 'view') { token = tok; break; }
  }
  if (!token) {
    const projects = readJSON(projsFile(req.dd));
    if (!projects.find(p => p.id === pid)) return res.status(404).json({ error: 'Proyecto no encontrado' });
    token = uuidv4().replace(/-/g, '');
    shares[token] = { ownerId: req.session.userId, projectId: pid, role: 'view', created: Date.now() };
    saveShares(shares);
  }
  const url        = `${APP_URL}/?share=${token}`;
  const proj       = readJSON(projsFile(req.dd)).find(p => p.id === pid);
  const projName   = proj?.name || 'Tableau';
  const senderName = sender?.username || 'Un usuario';
  const replyTo    = sender?.email || null;
  const mailer = getMailer();
  if (!mailer) return res.status(500).json({ error: 'El servidor no tiene SMTP configurado.' });
  const from = process.env.TABLEAU_SMTP_FROM || process.env.TABLEAU_SMTP_USER;
  try {
    await mailer.sendMail({
      from,
      to: email,
      ...(replyTo ? { replyTo } : {}),
      subject: `${senderName} te comparte "${projName}" — Tableau`,
      html: `<p>${senderName} te ha dado acceso de solo lectura al proyecto <strong>${projName}</strong> en Tableau.</p>
             <p><a href="${url}">${url}</a></p>
             <hr style="border:none;border-top:1px solid #eee;margin:16px 0"/>
             <p style="color:#999;font-size:11px">Este es un mensaje automático generado por Tableau. No respondas a este correo${replyTo ? ` — si quieres contactar con ${senderName} escribe directamente a <a href="mailto:${replyTo}">${replyTo}</a>` : ''}.</p>`,
    });
  } catch (e) {
    console.error('[mail] Error enviando invitación:', e.message);
    return res.status(500).json({ error: 'Error enviando el correo. Comprueba la configuración SMTP.' });
  }
  res.json({ ok: true, token, url });
});

app.use(express.static(path.join(__dirname, 'public')));

const upload = multer({
  storage: multer.memoryStorage(),
  limits:  { fileSize: MAX_UPLOAD_MB * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    IMAGE_EXT.has(ext) ? cb(null, true) : cb(new Error('Formato de imagen no soportado'));
  }
});

const uploadZip = multer({
  storage: multer.memoryStorage(),
  limits:  { fileSize: 500 * 1024 * 1024 },
});

// ── Update check ─────────────────────────────────────────────────────────────
const UPDATE_URL = process.env.TABLEAU_UPDATE_URL || '';
let updateAvailable = null;

async function checkForUpdates() {
  if (!UPDATE_URL) return;
  try {
    const res = await fetch(UPDATE_URL);
    if (!res.ok) return;
    const { version, downloadUrl } = await res.json();
    updateAvailable = version && version !== APP_VERSION ? { version, downloadUrl } : null;
  } catch {}
}

checkForUpdates();
setInterval(checkForUpdates, 24 * 60 * 60 * 1000);
runStartupPurge();

// ── Link preview ─────────────────────────────────────────────────────────────
app.get('/api/linkpreview', async (req, res) => {
  const raw = req.query.url || '';
  const url = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  if (!/^https?:\/\/.+/i.test(url)) return res.status(400).json({ error: 'URL inválida' });
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 6000);
    const r = await fetch(url, { signal: ctrl.signal, headers: { 'User-Agent': 'Mozilla/5.0' } });
    clearTimeout(timer);
    const html = (await r.text()).slice(0, 60000);
    const og   = p => (html.match(new RegExp(`<meta[^>]+property=["']${p}["'][^>]+content=["']([^"'<]+)["']`, 'i')) ||
                       html.match(new RegExp(`<meta[^>]+content=["']([^"'<]+)["'][^>]+property=["']${p}["']`, 'i')) || [])[1]?.trim();
    const mt   = n => (html.match(new RegExp(`<meta[^>]+name=["']${n}["'][^>]+content=["']([^"'<]+)["']`, 'i')) ||
                       html.match(new RegExp(`<meta[^>]+content=["']([^"'<]+)["'][^>]+name=["']${n}["']`, 'i')) || [])[1]?.trim();
    const titleTag = (html.match(/<title[^>]*>([^<]{1,200})<\/title>/i) || [])[1]?.trim();
    const domain = new URL(url).hostname.replace(/^www\./, '');
    res.json({ url, domain,
      title: og('og:title') || mt('twitter:title') || titleTag || domain,
      image: og('og:image') || null,
    });
  } catch {
    try { const domain = new URL(url).hostname.replace(/^www\./, ''); res.json({ url, domain, title: domain, image: null }); }
    catch { res.status(400).json({ error: 'URL inválida' }); }
  }
});

// ── Version ───────────────────────────────────────────────────────────────────
app.get('/api/version', (_req, res) => res.json({ version: APP_VERSION }));
app.get('/api/update',  (_req, res) => res.json({ current: APP_VERSION, update: updateAvailable }));

// ── Heartbeat ─────────────────────────────────────────────────────────────────
// TABLEAU_AUTO_SHUTDOWN=false desactiva el cierre automático (útil en servidor)
const AUTO_SHUTDOWN = process.env.TABLEAU_AUTO_SHUTDOWN !== 'false';
const HEARTBEAT_TIMEOUT = 300_000; // ms sin heartbeat antes de cerrar (5 min)
let heartbeatTimer = null;
const resetHeartbeat = () => {
  if (!AUTO_SHUTDOWN) return;
  clearTimeout(heartbeatTimer);
  heartbeatTimer = setTimeout(() => process.exit(0), HEARTBEAT_TIMEOUT);
};
resetHeartbeat();
app.post('/api/heartbeat', (_req, res) => { resetHeartbeat(); res.sendStatus(204); });

// ── Projects ─────────────────────────────────────────────────────────────────
app.get('/api/projects', requireAuth, (req, res) => {
  res.json(readJSON(projsFile(req.dd)));
});

app.post('/api/projects', requireAuth, (req, res) => {
  const { name } = req.body;
  if (!name?.trim()) return res.status(400).json({ error: 'Nombre requerido' });
  const projects = readJSON(projsFile(req.dd));
  const p = { id: newId(), name: name.trim(), created: Date.now() };
  projects.push(p);
  writeJSON(projsFile(req.dd), projects);
  initProject(p.id, req.dd);
  res.json(p);
});

app.patch('/api/projects/:pid', requireAuth, (req, res) => {
  const { pid } = req.params;
  const allowed = ['name','exTitle','subtitle','memSections'];
  const patch = {};
  for (const k of allowed) if (req.body[k] !== undefined) patch[k] = req.body[k];
  if (patch.name) patch.name = patch.name.trim();
  const projects = readJSON(projsFile(req.dd)).map(p => p.id === pid ? { ...p, ...patch } : p);
  writeJSON(projsFile(req.dd), projects);
  res.json({ ok: true });
});

app.delete('/api/projects/:pid', requireAuth, (req, res) => {
  const { pid } = req.params;
  const dd = req.dd;
  const projects = readJSON(projsFile(dd));
  const proj = projects.find(p => p.id === pid);
  if (!proj) return res.status(404).json({ error: 'not found' });
  const src = projDir(pid, dd);
  const ptd = projTrashDir(dd);
  ensureDir(ptd);
  const dst = path.join(ptd, pid);
  if (fs.existsSync(src)) {
    if (fs.existsSync(dst)) fs.rmSync(dst, { recursive: true, force: true });
    fs.renameSync(src, dst);
  } else {
    ensureDir(dst);
  }
  writeJSON(path.join(dst, '_meta.json'), { name: proj.name, deletedAt: Date.now() });
  writeJSON(projsFile(dd), projects.filter(p => p.id !== pid));
  res.json({ ok: true });
});

// ── Boards ───────────────────────────────────────────────────────────────────
app.get('/api/projects/:pid/boards', resolveAccess, (req, res) => {
  res.json(readJSON(boardsMeta(req.params.pid, req.dd)));
});

app.post('/api/projects/:pid/boards', requireAuth, (req, res) => {
  const { pid } = req.params;
  const { name } = req.body;
  if (!name?.trim()) return res.status(400).json({ error: 'Nombre requerido' });
  const boards = readJSON(boardsMeta(pid, req.dd));
  const b = { id: newId(), name: name.trim(), created: Date.now(), units: 'cm', dpi: 150 };
  boards.push(b);
  writeJSON(boardsMeta(pid, req.dd), boards);
  writeJSON(boardFile(pid, b.id, req.dd), []);
  res.json(b);
});

app.patch('/api/projects/:pid/boards/:bid', requireAuth, (req, res) => {
  const { pid, bid } = req.params;
  const { name, units, dpi, fixed, fixedW, fixedH, defaultFrame, background, defaultW, exportPad } = req.body;
  const boards = readJSON(boardsMeta(pid, req.dd)).map(b => {
    if (b.id !== bid) return b;
    const u = { ...b };
    if (name         !== undefined) u.name         = name.trim();
    if (units        !== undefined) u.units        = units;
    if (dpi          !== undefined) u.dpi          = Number(dpi) || 300;
    if (fixed        !== undefined) u.fixed        = fixed;
    if (fixedW       !== undefined) u.fixedW       = fixedW;
    if (fixedH       !== undefined) u.fixedH       = fixedH;
    if (defaultFrame !== undefined) u.defaultFrame = defaultFrame;
    if (background   !== undefined) u.background   = background;
    if (defaultW     !== undefined) u.defaultW     = defaultW;
    if (exportPad    !== undefined) u.exportPad    = exportPad == null ? undefined : Math.max(0, Number(exportPad) || 0);
    if (req.body.inMemory !== undefined) u.inMemory = req.body.inMemory;
    return u;
  });
  writeJSON(boardsMeta(pid, req.dd), boards);
  res.json({ ok: true });
});

app.delete('/api/projects/:pid/boards/:bid', requireAuth, (req, res) => {
  const { pid, bid } = req.params;
  const boards = readJSON(boardsMeta(pid, req.dd)).filter(b => b.id !== bid);
  writeJSON(boardsMeta(pid, req.dd), boards);
  const bf = boardFile(pid, bid, req.dd);
  if (fs.existsSync(bf)) fs.unlinkSync(bf);
  const vdir = boardVersionsDir(pid, bid, req.dd);
  if (fs.existsSync(vdir)) fs.rmSync(vdir, { recursive: true, force: true });
  res.json({ ok: true });
});

app.post('/api/projects/:pid/boards/:bid/duplicate', requireAuth, (req, res) => {
  const { pid, bid } = req.params;
  const boards = readJSON(boardsMeta(pid, req.dd));
  const original = boards.find(b => b.id === bid);
  if (!original) return res.status(404).json({ error: 'Tablero no encontrado' });
  const copy = { ...original, id: newId(), name: original.name + ' (copia)', created: Date.now() };
  const items = readJSON(boardFile(pid, bid, req.dd), []);
  const idx = boards.findIndex(b => b.id === bid);
  boards.splice(idx + 1, 0, copy);
  writeJSON(boardsMeta(pid, req.dd), boards);
  writeJSON(boardFile(pid, copy.id, req.dd), items);
  res.json(copy);
});

app.put('/api/projects/:pid/boards/order', requireAuth, (req, res) => {
  const { pid } = req.params;
  const { order } = req.body;
  if (!Array.isArray(order)) return res.status(400).json({ error: 'order required' });
  const boards = readJSON(boardsMeta(pid, req.dd));
  const map = Object.fromEntries(boards.map(b => [b.id, b]));
  const sorted = order.map(id => map[id]).filter(Boolean);
  boards.forEach(b => { if (!order.includes(b.id)) sorted.push(b); });
  writeJSON(boardsMeta(pid, req.dd), sorted);
  res.json({ ok: true });
});

// ── Rooms (multi-room) ────────────────────────────────────────────────────────
app.get('/api/projects/:pid/rooms', resolveAccess, (req, res) => {
  const { pid } = req.params;
  migrateRooms(pid, req.dd);
  res.json(readJSON(roomsFile(pid, req.dd), []));
});

app.post('/api/projects/:pid/rooms', requireAuth, (req, res) => {
  const { pid } = req.params;
  migrateRooms(pid, req.dd);
  const rooms = readJSON(roomsFile(pid, req.dd), []);
  const r = { id: `r${Date.now().toString(36)}`, ...req.body };
  rooms.push(r);
  writeJSON(roomsFile(pid, req.dd), rooms);
  res.json(r);
});

app.put('/api/projects/:pid/rooms/:rid', requireAuth, (req, res) => {
  const { pid, rid } = req.params;
  const rooms = readJSON(roomsFile(pid, req.dd), []);
  const idx = rooms.findIndex(r => r.id === rid);
  if (idx === -1) return res.status(404).json({ error: 'not found' });
  rooms[idx] = { ...rooms[idx], ...req.body, id: rid };
  writeJSON(roomsFile(pid, req.dd), rooms);
  res.json({ ok: true });
});

app.delete('/api/projects/:pid/rooms/:rid', requireAuth, (req, res) => {
  const { pid, rid } = req.params;
  const dd = req.dd;
  const f = roomsFile(pid, dd);
  const rooms = readJSON(f, []);
  const room = rooms.find(r => r.id === rid);
  if (room) {
    const boardIds = new Set([
      ...(room.walls  || []).flatMap(w => [w.boardId, w.boardIdBack].filter(Boolean)),
      ...(room.blocks || []).flatMap(b => Object.values(b.faces || {}).map(f => f?.boardId).filter(Boolean)),
      ...(room.columns|| []).flatMap(c => Object.values(c.faces || {}).map(f => f?.boardId).filter(Boolean)),
    ]);
    if (boardIds.size > 0) {
      writeJSON(boardsMeta(pid, dd), readJSON(boardsMeta(pid, dd)).filter(b => !boardIds.has(b.id)));
      for (const bid of boardIds) {
        const bf = boardFile(pid, bid, dd);
        if (fs.existsSync(bf)) fs.unlinkSync(bf);
        const vdir = boardVersionsDir(pid, bid, dd);
        if (fs.existsSync(vdir)) fs.rmSync(vdir, { recursive: true, force: true });
      }
    }
    writeJSON(f, rooms.filter(r => r.id !== rid));
  }
  res.json({ ok: true });
});

app.post('/api/projects/:pid/rooms/:rid/duplicate', requireAuth, (req, res) => {
  const { pid, rid } = req.params;
  const rooms = readJSON(roomsFile(pid, req.dd), []);
  const original = rooms.find(r => r.id === rid);
  if (!original) return res.status(404).json({ error: 'not found' });
  const copy = {
    ...original,
    id: `r${Date.now().toString(36)}`,
    name: original.name + (req.body?.lang === 'en' ? ' (copy)' : ' (copia)'),
    walls:  (original.walls  || []).map(({ boardId, boardIdBack, ...w }) => w),
    blocks: (original.blocks || []).map(b => ({
      ...b,
      faces: Object.fromEntries(
        Object.entries(b.faces || {}).map(([k, v]) => [k, v ? { ...v, boardId: undefined } : v])
      ),
    })),
  };
  const idx = rooms.findIndex(r => r.id === rid);
  rooms.splice(idx + 1, 0, copy);
  writeJSON(roomsFile(pid, req.dd), rooms);
  res.json(copy);
});

// ── Room geometry (legacy single-room — kept for compatibility) ───────────────
app.get('/api/projects/:pid/room', requireAuth, (req, res) => {
  const f = roomFile(req.params.pid, req.dd);
  res.json(fs.existsSync(f) ? readJSON(f, null) : null);
});

app.put('/api/projects/:pid/room', requireAuth, (req, res) => {
  ensureDir(projDir(req.params.pid, req.dd));
  writeJSON(roomFile(req.params.pid, req.dd), req.body);
  res.json({ ok: true });
});

app.delete('/api/projects/:pid/room', requireAuth, (req, res) => {
  const f = roomFile(req.params.pid, req.dd);
  if (fs.existsSync(f)) fs.unlinkSync(f);
  res.json({ ok: true });
});

// ── Photos – upload ──────────────────────────────────────────────────────────
app.get('/api/projects/:pid/photos', resolveAccess, (req, res) => {
  res.json(readJSON(photosMeta(req.params.pid, req.dd)));
});

app.post('/api/projects/:pid/photos', requireAuth, upload.single('photo'), async (req, res) => {
  const { pid } = req.params;
  if (!req.file) return res.status(400).json({ error: 'No se recibió ningún fichero' });
  // Verificar cuota (solo en modo auth)
  if (AUTH_ENABLED) {
    const users = loadUsers();
    const user  = users.find(u => u.id === req.session.userId);
    if (user) {
      const used = dirSize(req.dd);
      if (used + req.file.size > user.quota)
        return res.status(413).json({ error: 'Cuota de almacenamiento superada' });
    }
  }
  try {
    const { id, w, h, size, dominant, brightness, meanColor, origW, origH, origDpi, exif } = await processImage(req.file.buffer, pid, null, req.dd);
    const photos = readJSON(photosMeta(pid, req.dd));
    const p = { id, name: req.file.originalname, w, h, size, dominant, brightness, meanColor, created: Date.now(), origW, origH, ...(origDpi ? { origDpi } : {}), ...(exif ? { exif } : {}) };
    photos.push(p);
    writeJSON(photosMeta(pid, req.dd), photos);
    res.json(p);
  } catch (e) {
    console.error('Upload error:', e.message);
    res.status(500).json({ error: e.message });
  }
});

app.put('/api/projects/:pid/photos/:id/file', requireAuth, upload.single('photo'), async (req, res) => {
  const { pid, id } = req.params;
  if (!req.file) return res.status(400).json({ error: 'No se recibió ningún fichero' });
  const photos = readJSON(photosMeta(pid, req.dd));
  const idx = photos.findIndex(p => p.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Foto no encontrada' });
  try {
    const { w, h, size, dominant, brightness, meanColor, origW, origH, origDpi, exif } = await processImage(req.file.buffer, pid, id, req.dd);
    const updated = { ...photos[idx], w, h, size, dominant, brightness, meanColor, origW, origH, ...(origDpi ? { origDpi } : {}), ...(exif ? { exif } : {}) };
    photos[idx] = updated;
    writeJSON(photosMeta(pid, req.dd), photos);
    res.json(updated);
  } catch (e) {
    console.error('Replace error:', e.message);
    res.status(500).json({ error: e.message });
  }
});

app.delete('/api/projects/:pid/photos/:id', requireAuth, (req, res) => {
  const { pid, id } = req.params;
  const dd = req.dd;
  const photos = readJSON(photosMeta(pid, dd));
  const photo = photos.find(p => p.id === id);
  if (!photo) return res.status(404).json({ error: 'not found' });
  writeJSON(photosMeta(pid, dd), photos.filter(p => p.id !== id));
  ensureDir(photoTrashDir(pid, dd));
  [`${id}.jpg`, `${id}_thumb.jpg`].forEach(fname => {
    const src = path.join(photoDir(pid, dd), fname);
    const dst = path.join(photoTrashDir(pid, dd), fname);
    if (fs.existsSync(src)) try { fs.renameSync(src, dst); } catch {}
  });
  const tmf = photoTrashMeta(pid, dd);
  const trashed = readJSON(tmf, []);
  trashed.unshift({ ...photo, deletedAt: Date.now() });
  writeJSON(tmf, trashed);
  for (const b of readJSON(boardsMeta(pid, dd))) {
    const bf = boardFile(pid, b.id, dd);
    if (!fs.existsSync(bf)) continue;
    const items = readJSON(bf, []);
    const filtered = items.filter(i => i.photoId !== id);
    if (filtered.length !== items.length) writeJSON(bf, filtered);
  }
  res.json({ ok: true });
});

app.patch('/api/projects/:pid/photos/:id/rating', requireAuth, (req, res) => {
  const { pid, id } = req.params;
  const { rating } = req.body;
  if (typeof rating !== 'number' || rating < 0 || rating > 5) return res.status(400).json({ error: 'rating 0-5 required' });
  const photos = readJSON(photosMeta(pid, req.dd));
  const p = photos.find(p => p.id === id);
  if (!p) return res.status(404).json({ error: 'not found' });
  p.rating = rating;
  writeJSON(photosMeta(pid, req.dd), photos);
  res.json(p);
});

app.patch('/api/projects/:pid/photos/:id/tags', requireAuth, (req, res) => {
  const { pid, id } = req.params;
  const { tags } = req.body;
  if (!Array.isArray(tags)) return res.status(400).json({ error: 'tags array required' });
  const photos = readJSON(photosMeta(pid, req.dd));
  const p = photos.find(p => p.id === id);
  if (!p) return res.status(404).json({ error: 'not found' });
  p.tags = tags.map(t => t.trim()).filter(Boolean);
  writeJSON(photosMeta(pid, req.dd), photos);
  res.json(p);
});

app.patch('/api/projects/:pid/photos/:id/rejected', requireAuth, (req, res) => {
  const { pid, id } = req.params;
  const { rejected } = req.body;
  const photos = readJSON(photosMeta(pid, req.dd));
  const p = photos.find(p => p.id === id);
  if (!p) return res.status(404).json({ error: 'not found' });
  p.rejected = !!rejected;
  writeJSON(photosMeta(pid, req.dd), photos);
  res.json(p);
});

app.patch('/api/projects/:pid/photos/:id/section', requireAuth, (req, res) => {
  const { pid, id } = req.params;
  const { sectionId } = req.body;
  const photos = readJSON(photosMeta(pid, req.dd));
  const p = photos.find(p => p.id === id);
  if (!p) return res.status(404).json({ error: 'not found' });
  if (sectionId) p.sectionId = sectionId; else delete p.sectionId;
  writeJSON(photosMeta(pid, req.dd), photos);
  res.json(p);
});

app.put('/api/projects/:pid/sections', requireAuth, (req, res) => {
  const { pid } = req.params;
  const { sections } = req.body;
  if (!Array.isArray(sections)) return res.status(400).json({ error: 'sections array required' });
  const projects = readJSON(projsFile(req.dd)).map(p =>
    p.id === pid ? { ...p, sections } : p
  );
  writeJSON(projsFile(req.dd), projects);
  res.json({ ok: true });
});

// ── Templates ─────────────────────────────────────────────────────────────────
const templatesFile = (dd = DATA_DIR) => path.join(dd, 'templates.json');

app.get('/api/templates', requireAuth, (req, res) => {
  res.json(readJSON(templatesFile(req.dd)));
});

app.post('/api/templates', requireAuth, (req, res) => {
  const { name, boardMeta, items } = req.body;
  if (!name || !Array.isArray(items)) return res.status(400).json({ error: 'name and items required' });
  const templates = readJSON(templatesFile(req.dd));
  const tmpl = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
    name: name.trim(), created: Date.now(),
    boardMeta: boardMeta || {}, items,
  };
  templates.push(tmpl);
  writeJSON(templatesFile(req.dd), templates);
  res.json(tmpl);
});

app.patch('/api/templates/:tid', requireAuth, (req, res) => {
  const { name, items } = req.body;
  const templates = readJSON(templatesFile(req.dd)).map(t => {
    if (t.id !== req.params.tid) return t;
    return { ...t, ...(name !== undefined ? { name: name.trim() } : {}), ...(items !== undefined ? { items } : {}) };
  });
  writeJSON(templatesFile(req.dd), templates);
  res.json({ ok: true });
});

app.delete('/api/templates/:tid', requireAuth, (req, res) => {
  writeJSON(templatesFile(req.dd), readJSON(templatesFile(req.dd)).filter(t => t.id !== req.params.tid));
  res.json({ ok: true });
});

// ── Trash ─────────────────────────────────────────────────────────────────────
app.get('/api/trash/count', requireAuth, (req, res) => {
  const dd = req.dd;
  let photos = 0, projects = 0;
  if (fs.existsSync(dd)) {
    for (const e of fs.readdirSync(dd, { withFileTypes: true })) {
      if (!e.isDirectory() || e.name.startsWith('.')) continue;
      const tmf = photoTrashMeta(e.name, dd);
      if (fs.existsSync(tmf)) photos += readJSON(tmf, []).length;
    }
  }
  const ptd = projTrashDir(dd);
  if (fs.existsSync(ptd))
    projects = fs.readdirSync(ptd, { withFileTypes: true }).filter(e => e.isDirectory()).length;
  res.json({ photos, projects, total: photos + projects });
});

app.get('/api/trash/photos', requireAuth, (req, res) => {
  const dd = req.dd;
  const projectMap = Object.fromEntries(readJSON(projsFile(dd)).map(p => [p.id, p.name]));
  const result = [];
  if (fs.existsSync(dd)) {
    for (const e of fs.readdirSync(dd, { withFileTypes: true })) {
      if (!e.isDirectory() || e.name.startsWith('.')) continue;
      const pid = e.name;
      const tmf = photoTrashMeta(pid, dd);
      if (!fs.existsSync(tmf)) continue;
      for (const p of readJSON(tmf, []))
        result.push({ ...p, pid, projectName: projectMap[pid] || pid });
    }
  }
  result.sort((a, b) => b.deletedAt - a.deletedAt);
  res.json(result);
});

app.get('/api/trash/photos/:pid/:id/thumb', requireAuth, (req, res) => {
  const { pid, id } = req.params;
  const f = path.join(photoTrashDir(pid, req.dd), `${id}_thumb.jpg`);
  if (!fs.existsSync(f)) return res.status(404).send();
  res.sendFile(f);
});

app.post('/api/trash/photos/:pid/:id/restore', requireAuth, (req, res) => {
  const { pid, id } = req.params;
  const dd = req.dd;
  const tmf = photoTrashMeta(pid, dd);
  const trashed = readJSON(tmf, []);
  const photo = trashed.find(p => p.id === id);
  if (!photo) return res.status(404).json({ error: 'not found' });
  ensureDir(photoDir(pid, dd));
  [`${id}.jpg`, `${id}_thumb.jpg`].forEach(fname => {
    const src = path.join(photoTrashDir(pid, dd), fname);
    const dst = path.join(photoDir(pid, dd), fname);
    if (fs.existsSync(src)) try { fs.renameSync(src, dst); } catch {}
  });
  const { deletedAt, pid: _p, projectName: _pn, ...photoMeta } = photo;
  const photos = readJSON(photosMeta(pid, dd));
  photos.push(photoMeta);
  writeJSON(photosMeta(pid, dd), photos);
  writeJSON(tmf, trashed.filter(p => p.id !== id));
  res.json({ ...photoMeta, pid });
});

app.delete('/api/trash/photos/:pid/:id', requireAuth, (req, res) => {
  const { pid, id } = req.params;
  const dd = req.dd;
  const tmf = photoTrashMeta(pid, dd);
  writeJSON(tmf, readJSON(tmf, []).filter(p => p.id !== id));
  [`${id}.jpg`, `${id}_thumb.jpg`].forEach(fname => {
    try { fs.unlinkSync(path.join(photoTrashDir(pid, dd), fname)); } catch {}
  });
  res.json({ ok: true });
});

app.delete('/api/trash/photos', requireAuth, (req, res) => {
  const dd = req.dd;
  if (fs.existsSync(dd)) {
    for (const e of fs.readdirSync(dd, { withFileTypes: true })) {
      if (!e.isDirectory() || e.name.startsWith('.')) continue;
      const pid = e.name;
      const tmf = photoTrashMeta(pid, dd);
      if (!fs.existsSync(tmf)) continue;
      for (const p of readJSON(tmf, []))
        [`${p.id}.jpg`, `${p.id}_thumb.jpg`].forEach(fname => {
          try { fs.unlinkSync(path.join(photoTrashDir(pid, dd), fname)); } catch {}
        });
      writeJSON(tmf, []);
    }
  }
  res.json({ ok: true });
});

app.get('/api/trash/projects', requireAuth, (req, res) => {
  const ptd = projTrashDir(req.dd);
  if (!fs.existsSync(ptd)) return res.json([]);
  const result = [];
  for (const e of fs.readdirSync(ptd, { withFileTypes: true })) {
    if (!e.isDirectory()) continue;
    const meta = readJSON(path.join(ptd, e.name, '_meta.json'), null);
    if (!meta) continue;
    result.push({ pid: e.name, name: meta.name, deletedAt: meta.deletedAt, size: dirSize(path.join(ptd, e.name)) });
  }
  result.sort((a, b) => b.deletedAt - a.deletedAt);
  res.json(result);
});

app.post('/api/trash/projects/:pid/restore', requireAuth, (req, res) => {
  const { pid } = req.params;
  const dd = req.dd;
  const ptd = projTrashDir(dd);
  const src = path.join(ptd, pid);
  if (!fs.existsSync(src)) return res.status(404).json({ error: 'not found' });
  const meta = readJSON(path.join(src, '_meta.json'), null);
  if (!meta) return res.status(400).json({ error: 'invalid' });
  const dst = projDir(pid, dd);
  if (fs.existsSync(dst)) return res.status(409).json({ error: 'exists' });
  try { fs.unlinkSync(path.join(src, '_meta.json')); } catch {}
  fs.renameSync(src, dst);
  const projects = readJSON(projsFile(dd));
  projects.push({ id: pid, name: meta.name, created: Date.now() });
  writeJSON(projsFile(dd), projects);
  res.json({ id: pid, name: meta.name });
});

app.delete('/api/trash/projects/:pid', requireAuth, (req, res) => {
  const dir = path.join(projTrashDir(req.dd), req.params.pid);
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
  res.json({ ok: true });
});

app.delete('/api/trash/projects', requireAuth, (req, res) => {
  const ptd = projTrashDir(req.dd);
  if (fs.existsSync(ptd)) fs.rmSync(ptd, { recursive: true, force: true });
  res.json({ ok: true });
});

app.post('/api/projects/:pid/photos/analyze-colors', requireAuth, async (req, res) => {
  const { pid } = req.params;
  const photos = readJSON(photosMeta(pid, req.dd));
  let updated = 0;
  for (const p of photos) {
    if (p.dominant) continue;
    const pFile = path.join(photoDir(pid, req.dd), `${p.id}.jpg`);
    if (!fs.existsSync(pFile)) continue;
    try {
      const stats = await sharp(pFile).stats();
      p.dominant = stats.dominant;
      const ch = stats.channels;
      p.brightness = Math.round((0.299 * ch[0].mean + 0.587 * ch[1].mean + 0.114 * ch[2].mean) / 255 * 100) / 100;
      p.meanColor = { r: Math.round(ch[0].mean), g: Math.round(ch[1].mean), b: Math.round(ch[2].mean) };
      updated++;
    } catch {}
  }
  if (updated > 0) writeJSON(photosMeta(pid, req.dd), photos);
  res.json({ ok: true, updated });
});

app.post('/api/projects/:pid/photos/:photoId/copy-to/:targetPid', requireAuth, (req, res) => {
  const { pid, photoId, targetPid } = req.params;
  const srcPhotos = readJSON(photosMeta(pid, req.dd));
  const photo = srcPhotos.find(p => p.id === photoId);
  if (!photo) return res.status(404).json({ error: 'Foto no encontrada' });
  const projects = readJSON(projsFile(req.dd));
  if (!projects.find(p => p.id === targetPid)) return res.status(404).json({ error: 'Proyecto destino no encontrado' });
  const nid = newId(12);
  try {
    fs.copyFileSync(path.join(photoDir(pid, req.dd), `${photoId}.jpg`),       path.join(photoDir(targetPid, req.dd), `${nid}.jpg`));
    fs.copyFileSync(path.join(photoDir(pid, req.dd), `${photoId}_thumb.jpg`), path.join(photoDir(targetPid, req.dd), `${nid}_thumb.jpg`));
  } catch (e) { return res.status(500).json({ error: e.message }); }
  const dstPhotos = readJSON(photosMeta(targetPid, req.dd));
  const newPhoto = { ...photo, id: nid };
  dstPhotos.push(newPhoto);
  writeJSON(photosMeta(targetPid, req.dd), dstPhotos);
  res.json(newPhoto);
});

// ── Serve photos ──────────────────────────────────────────────────────────────
app.get('/photos/:pid/:id', resolveAccess, (req, res) => {
  const file = path.join(photoDir(req.params.pid, req.dd), `${req.params.id}.jpg`);
  fs.existsSync(file) ? res.sendFile(file) : res.status(404).end();
});

app.get('/photos/:pid/:id/thumb', resolveAccess, (req, res) => {
  const file = path.join(photoDir(req.params.pid, req.dd), `${req.params.id}_thumb.jpg`);
  fs.existsSync(file) ? res.sendFile(file) : res.status(404).end();
});

// ── Board items ───────────────────────────────────────────────────────────────
app.get('/api/boards/:pid/:bid/items', resolveAccess, (req, res) => {
  const { pid, bid } = req.params;
  res.json(readJSON(boardFile(pid, bid, req.dd), []));
});

app.put('/api/boards/:pid/:bid/items', requireEditAccess, (req, res) => {
  const { pid, bid } = req.params;
  if (!Array.isArray(req.body)) return res.status(400).json({ error: 'Array esperado' });
  if (req.shareRole === 'edit') {
    const lock = getLock(req.dd, pid, bid);
    if (!lock || lock.token !== req.shareToken)
      return res.status(409).json({ error: 'No tienes el bloqueo del tablero' });
  }
  writeJSON(boardFile(pid, bid, req.dd), req.body);
  res.json({ ok: true });
});

// ── Board locks ───────────────────────────────────────────────────────────────
app.post('/api/boards/:pid/:bid/lock', resolveAccess, (req, res) => {
  if (!req.shareRole) return res.json({ ok: true }); // owners bypass locks
  if (req.shareRole !== 'edit') return res.status(403).json({ error: 'Acceso de solo lectura' });
  const { pid, bid } = req.params;
  if (!acquireLock(req.dd, pid, bid, req.shareToken))
    return res.status(409).json({ error: 'El tablero está siendo editado por otro usuario' });
  res.json({ ok: true });
});

app.post('/api/boards/:pid/:bid/lock/ping', resolveAccess, (req, res) => {
  if (!req.shareRole) return res.json({ ok: true });
  const { pid, bid } = req.params;
  res.json({ ok: acquireLock(req.dd, pid, bid, req.shareToken) });
});

app.delete('/api/boards/:pid/:bid/lock', resolveAccess, (req, res) => {
  if (!req.shareRole) return res.json({ ok: true });
  const { pid, bid } = req.params;
  releaseLock(req.dd, pid, bid, req.shareToken);
  res.json({ ok: true });
});

app.get('/api/boards/:pid/:bid/lock', resolveAccess, (req, res) => {
  const { pid, bid } = req.params;
  const lock = getLock(req.dd, pid, bid);
  res.json({ locked: !!lock, mine: !!(lock && req.shareToken && lock.token === req.shareToken) });
});

// ── Board versions ────────────────────────────────────────────────────────────
const boardVersionsDir = (pid, bid, dd = DATA_DIR) => path.join(boardDir(pid, dd), `${bid}.versions`);

app.get('/api/boards/:pid/:bid/versions', requireAuth, (req, res) => {
  const { pid, bid } = req.params;
  const dir = boardVersionsDir(pid, bid, req.dd);
  if (!fs.existsSync(dir)) return res.json([]);
  const versions = fs.readdirSync(dir)
    .filter(f => f.endsWith('.json'))
    .map(f => {
      const ts = parseInt(f.replace('.json', ''));
      const items = readJSON(path.join(dir, f), []);
      return { ts, itemCount: items.length };
    })
    .sort((a, b) => b.ts - a.ts);
  res.json(versions);
});

app.post('/api/boards/:pid/:bid/versions', requireAuth, (req, res) => {
  const { pid, bid } = req.params;
  const dir = boardVersionsDir(pid, bid, req.dd);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const items = readJSON(boardFile(pid, bid, req.dd), []);
  const ts = Date.now();
  writeJSON(path.join(dir, `${ts}.json`), items);
  res.json({ ts, itemCount: items.length });
});

app.get('/api/boards/:pid/:bid/versions/:ts', requireAuth, (req, res) => {
  const { pid, bid, ts } = req.params;
  const file = path.join(boardVersionsDir(pid, bid, req.dd), `${ts}.json`);
  if (!fs.existsSync(file)) return res.status(404).json({ error: 'Versión no encontrada' });
  res.json(readJSON(file, []));
});

app.post('/api/boards/:pid/:bid/versions/:ts/restore', requireAuth, (req, res) => {
  const { pid, bid, ts } = req.params;
  const file = path.join(boardVersionsDir(pid, bid, req.dd), `${ts}.json`);
  if (!fs.existsSync(file)) return res.status(404).json({ error: 'Versión no encontrada' });
  const items = readJSON(file, []);
  writeJSON(boardFile(pid, bid, req.dd), items);
  res.json(items);
});

app.delete('/api/boards/:pid/:bid/versions/:ts', requireAuth, (req, res) => {
  const { pid, bid, ts } = req.params;
  const file = path.join(boardVersionsDir(pid, bid, req.dd), `${ts}.json`);
  if (fs.existsSync(file)) fs.unlinkSync(file);
  res.json({ ok: true });
});

// ── Board export (JPEG composite) ─────────────────────────────────────────────
app.get('/api/boards/:pid/:bid/export', requireAuth, async (req, res) => {
  const { pid, bid } = req.params;
  const { ids, useBoard, pad: padParam } = req.query;
  let boardItems = readJSON(boardFile(pid, bid, req.dd), []);
  if (ids) { const idSet = new Set(ids.split(',')); boardItems = boardItems.filter(i => idSet.has(i.id)); }
  const photosData = readJSON(photosMeta(pid, req.dd));
  const boardsData = readJSON(boardsMeta(pid, req.dd));
  const board      = boardsData.find(b => b.id === bid);

  if (!boardItems.length) return res.status(400).json({ error: 'El tablero está vacío' });

  const PAD      = padParam != null ? Math.max(0, parseInt(padParam) || 0) : 60;
  const boardDpi = board?.dpi || 150;
  const exportDpi = Math.min(600, Math.max(72, parseInt(req.query.exportDpi) || boardDpi));
  const exportScale = exportDpi / boardDpi;  // scale all pixel values to target resolution
  const sorted = [...boardItems].sort((a, b) => (a.z || 0) - (b.z || 0));

  // Expand grid items into individual photo pseudo-items (at export scale)
  const gUnits = board?.units || 'px';
  const gPhysToPx = v => { if (!v || gUnits === 'px') return Math.round(v * exportScale || 0); const f = gUnits === 'cm' ? 2.54 : gUnits === 'mm' ? 25.4 : 1; return Math.round((v / f) * exportDpi); };
  const expanded = [];
  for (const item of sorted) {
    if (item.type !== 'grid') { expanded.push(item); continue; }
    const cols = Math.max(1, item.cols || 3);
    const gapPx = gPhysToPx(item.gap ?? 5);
    const cellW = Math.max(10, (item.w * exportScale - gapPx * (cols - 1)) / cols);
    const pIds = item.photoIds || [];
    let rowY = Math.round(item.y * exportScale);
    for (let r = 0; r * cols < pIds.length; r++) {
      const rowIds = pIds.slice(r * cols, (r + 1) * cols);
      const rowH = Math.max(...rowIds.map(id => { const p = photosData.find(x => x.id === id); return (p && p.w > 0) ? Math.round(cellW * p.h / p.w) : Math.round(cellW); }), 10);
      rowIds.forEach((photoId, ci) => { if (photoId) expanded.push({ photoId, x: Math.round(item.x * exportScale + ci * (cellW + gapPx)), y: rowY, w: Math.round(cellW), z: item.z }); });
      rowY += rowH + gapPx;
    }
  }

  // Process each item: resize + flip + rotate → get final pixel buffer + canvas position
  const layers = (await Promise.all(expanded.map(async item => {
    if (item.type === 'note' || item.type === 'placeholder' || item.type === 'zone') return null;

    if (item.type === 'text') {
      try {
        if (!item.text?.trim()) return null;
        const tw = Math.round(item.w * exportScale);
        const th = Math.round((item.h || 130) * exportScale);
        const fontSize = Math.round((item.fontSize || 26) * exportScale);
        const color = item.textColor || '#111111';
        const fontId = item.fontFamily || 'serif';
        const fontDef = EXPORT_FONTS[fontId] || EXPORT_FONTS.serif;
        const alignMap = { left: 'left', center: 'centre', right: 'right' };
        const align = alignMap[item.textAlign || 'center'] || 'centre';
        const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
        const textOpts = {
          text: `<span foreground="${color}">${esc(item.text)}</span>`,
          font: `${fontDef.name} ${fontSize}`,
          width: tw,
          align,
          rgba: true,
          dpi: 96,
        };
        if (fontDef.file) textOpts.fontfile = fontDef.file;
        let buf = await sharp({ text: textOpts }).png({ compressionLevel: 1 }).toBuffer();
        // Extend rendered text to exactly tw×th so rotation center matches canvas
        const { width: txtW, height: txtH } = await sharp(buf).metadata();
        const padL = item.textAlign === 'right' ? Math.max(0, tw - txtW) : item.textAlign === 'left' ? 0 : Math.max(0, Math.floor((tw - txtW) / 2));
        const padR = Math.max(0, tw - txtW - padL);
        const padB = Math.max(0, th - txtH);
        if (padL > 0 || padR > 0 || padB > 0) {
          buf = await sharp(buf).extend({ left: padL, right: padR, top: 0, bottom: padB, background: { r: 0, g: 0, b: 0, alpha: 0 } }).png({ compressionLevel: 1 }).toBuffer();
        }
        const freeRot = item.freeRot || 0;
        if (freeRot) buf = await sharp(buf).rotate(freeRot, { background: { r: 0, g: 0, b: 0, alpha: 0 } }).png({ compressionLevel: 1 }).toBuffer();
        const { width: rw, height: rh } = await sharp(buf).metadata();
        const cx = item.x * exportScale + tw / 2;
        const cy = item.y * exportScale + th / 2;
        return { input: buf, cl: Math.round(cx - rw / 2), ct: Math.round(cy - rh / 2), rw, rh };
      } catch (err) {
        console.error('Text layer render error:', err.message);
        return null;
      }
    }

    try {
      const photo = photosData.find(p => p.id === item.photoId);
      if (!photo) return null;
      const pFile = path.join(photoDir(pid, req.dd), `${item.photoId}.jpg`);
      if (!fs.existsSync(pFile)) return null;

      const units = board?.units || 'px';
      const toItemPx = v => { if (!v || units === 'px') return Math.round(v * exportScale || 0); const f = units === 'cm' ? 2.54 : units === 'mm' ? 25.4 : 1; return Math.round((v / f) * exportDpi); };
      const matPx  = toItemPx(item.matSize ?? item.frame ?? 0);
      const moldPx = toItemPx(item.frameSize ?? 0);

      const rot       = item.rot || 0;
      const freeRot   = item.freeRot || 0;
      const isSwapped = rot % 180 !== 0;
      const scaledW   = Math.round(item.w * exportScale);
      const resizeW   = isSwapped ? Math.round(scaledW * photo.w / photo.h) : scaledW;
      const resizeH   = isSwapped ? scaledW : Math.round(scaledW * photo.h / photo.w);
      const displayH  = isSwapped ? resizeW : resizeH;

      // Step 1: resize (at export resolution), flip, 90° rotation
      let sharpChain = sharp(pFile).resize(resizeW, resizeH, { fit: 'fill' });
      if (item.flipH) sharpChain = sharpChain.flop();
      if (item.flipV) sharpChain = sharpChain.flip();
      sharpChain = sharpChain.rotate(rot, { background: { r: 255, g: 255, b: 255 } });
      let imgBuf = await sharpChain.png({ compressionLevel: 1 }).toBuffer();

      // Step 2: mat (paspartú) then molding borders — symmetric, so center stays at cx/cy
      if (matPx  > 0) imgBuf = await sharp(imgBuf).extend({ top: matPx,  bottom: matPx,  left: matPx,  right: matPx,  background: item.matColor   || '#ffffff' }).png({ compressionLevel: 1 }).toBuffer();
      if (moldPx > 0) imgBuf = await sharp(imgBuf).extend({ top: moldPx, bottom: moldPx, left: moldPx, right: moldPx, background: item.frameColor || '#5a3e1b' }).png({ compressionLevel: 1 }).toBuffer();

      // Step 3: free rotation on the framed photo
      if (freeRot) imgBuf = await sharp(imgBuf).rotate(freeRot, { background: { r: 255, g: 255, b: 255 } }).png({ compressionLevel: 1 }).toBuffer();

      const { width: rw, height: rh } = await sharp(imgBuf).metadata();
      const cx = item.x * exportScale + scaledW  / 2;
      const cy = item.y * exportScale + displayH / 2;

      return { input: imgBuf, cl: Math.round(cx - rw / 2), ct: Math.round(cy - rh / 2), rw, rh };
    } catch (err) {
      console.error('Photo layer render error:', err.message);
      return null;
    }
  }))).filter(Boolean);

  if (!layers.length) return res.status(400).json({ error: 'No se pudieron procesar las imágenes' });

  // Fixed board mode: use exact board dimensions as canvas
  const fixedMode = useBoard === '1' && board?.fixed && board.fixedW > 0 && board.fixedH > 0;

  let rawW, rawH, getLeft, getTop;
  if (fixedMode) {
    const u = board.units || 'cm';
    const toPx = v => u === 'px' ? Math.round(v * exportScale) : u === 'cm' ? Math.round(v / 2.54 * exportDpi) : u === 'mm' ? Math.round(v / 25.4 * exportDpi) : Math.round(v * exportDpi);
    rawW    = Math.max(1, toPx(board.fixedW));
    rawH    = Math.max(1, toPx(board.fixedH));
    getLeft = (cl) => cl;
    getTop  = (ct) => ct;
  } else {
    const minX = Math.min(...layers.map(l => l.cl));
    const minY = Math.min(...layers.map(l => l.ct));
    rawW    = Math.max(...layers.map(l => l.cl + l.rw)) - minX + PAD * 2;
    rawH    = Math.max(...layers.map(l => l.ct + l.rh)) - minY + PAD * 2;
    getLeft = (cl) => cl - minX + PAD;
    getTop  = (ct) => ct - minY + PAD;
  }

  const maxPx = Math.min(20000, Math.max(1000, parseInt(req.query.maxpx) || 10000));
  const scale = Math.min(1, maxPx / Math.max(rawW, rawH));
  const outW  = Math.max(1, Math.round(rawW * scale));
  const outH  = Math.max(1, Math.round(rawH * scale));

  const composites = (await Promise.all(layers.map(async ({ input, cl, ct, rw, rh }) => {
    const left = Math.round(getLeft(cl) * scale);
    const top  = Math.round(getTop(ct)  * scale);
    if (left >= outW || top >= outH) return null;
    let img = input;
    // Clip left/top overflow
    let srcX = 0, srcY = 0, srcW = rw, srcH = rh, dstL = left, dstT = top;
    if (dstL < 0) { srcX = Math.round(-dstL / scale); srcW = rw - srcX; dstL = 0; }
    if (dstT < 0) { srcY = Math.round(-dstT / scale); srcH = rh - srcY; dstT = 0; }
    if (srcW <= 0 || srcH <= 0) return null;
    if (srcX > 0 || srcY > 0) img = await sharp(input).extract({ left: srcX, top: srcY, width: Math.min(srcW, rw - srcX), height: Math.min(srcH, rh - srcY) }).toBuffer();
    const scaledW = Math.max(1, Math.round(srcW * scale));
    const scaledH = Math.max(1, Math.round(srcH * scale));
    const scaledInput = scale < 1 ? await sharp(img).resize(scaledW, scaledH).png({ compressionLevel: 1 }).toBuffer() : img;
    return { input: scaledInput, left: dstL, top: dstT, blend: 'over' };
  }))).filter(Boolean);

  try {
    const exportQ = Math.min(100, Math.max(1, parseInt(req.query.quality) || 92));
    const output = await sharp({ create: { width: outW, height: outH, channels: 3, background: { r: 255, g: 255, b: 255 } } })
      .composite(composites)
      .jpeg({ quality: exportQ, mozjpeg: true })
      .toBuffer();

    const safeName = (board?.name || 'tableau').replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '_') || 'export';
    res.set('Content-Type', 'image/jpeg');
    res.set('Content-Disposition', `attachment; filename="${safeName}.jpg"`);
    res.send(output);
  } catch (e) {
    console.error('Export error:', e.message);
    res.status(500).json({ error: e.message });
  }
});

// ── Project export / import (ZIP) ────────────────────────────────────────────
app.get('/api/projects/:pid/export', requireAuth, (req, res) => {
  const { pid } = req.params;
  const proj = readJSON(projsFile(req.dd)).find(p => p.id === pid);
  if (!proj) return res.status(404).json({ error: 'Proyecto no encontrado' });

  const zip = new AdmZip();
  zip.addFile('tableau-export.json', Buffer.from(JSON.stringify({
    version: APP_VERSION, exportedAt: Date.now(), originId: pid, projectName: proj.name,
    sections: proj.sections || [],
  }, null, 2)));

  const pMeta = photosMeta(pid, req.dd);
  const bMeta = boardsMeta(pid, req.dd);
  const rMeta = roomsFile(pid, req.dd);
  if (fs.existsSync(pMeta)) zip.addFile('photos.json', fs.readFileSync(pMeta));
  if (fs.existsSync(bMeta)) zip.addFile('boards.json', fs.readFileSync(bMeta));
  if (fs.existsSync(rMeta)) zip.addFile('rooms.json',  fs.readFileSync(rMeta));

  readJSON(boardsMeta(pid, req.dd)).forEach(b => {
    const bf = boardFile(pid, b.id, req.dd);
    if (fs.existsSync(bf)) zip.addFile(`boards/${b.id}.json`, fs.readFileSync(bf));
  });

  const pDir = photoDir(pid, req.dd);
  if (fs.existsSync(pDir)) {
    fs.readdirSync(pDir).forEach(f => zip.addFile(`photos/${f}`, fs.readFileSync(path.join(pDir, f))));
  }

  const safeName = proj.name.replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '_') || 'proyecto';
  res.set('Content-Type', 'application/zip');
  res.set('Content-Disposition', `attachment; filename="${safeName}-tableau.zip"`);
  res.send(zip.toBuffer());
});

const pendingImports = new Map();

app.post('/api/projects/import', requireAuth, (req, res, next) => {
  uploadZip.single('zip')(req, res, err => {
    if (err) return res.status(400).json({ error: `Error al recibir el archivo: ${err.message}` });

    if (!req.file) return res.status(400).json({ error: 'No se recibió ningún fichero' });

    let zip, exportMeta;
    try {
      zip = new AdmZip(req.file.buffer);
    } catch (e) {
      console.error('[import] Error leyendo ZIP:', e.message);
      return res.status(400).json({ error: `No se pudo leer el archivo ZIP: ${e.message}` });
    }

    const entry = zip.getEntry('tableau-export.json');
    if (!entry) return res.status(400).json({ error: 'El archivo no contiene tableau-export.json — ¿es un proyecto Tableau exportado?' });

    try {
      exportMeta = JSON.parse(entry.getData().toString('utf8'));
    } catch (e) {
      console.error('[import] Error parseando tableau-export.json:', e.message);
      return res.status(400).json({ error: `tableau-export.json no es válido: ${e.message}` });
    }

    if (!exportMeta.originId || !exportMeta.projectName) {
      return res.status(400).json({ error: 'tableau-export.json incompleto (faltan campos originId o projectName)' });
    }

    const projects = readJSON(projsFile(req.dd));
    const existing = projects.find(p => p.id === exportMeta.originId);

    const now = Date.now();
    for (const [k, v] of pendingImports) {
      if (now - v.createdAt > 10 * 60 * 1000) pendingImports.delete(k);
    }
    const tempId = newId();
    pendingImports.set(tempId, { buffer: req.file.buffer, exportMeta, createdAt: now, dd: req.dd });

    res.json({ tempId, projectName: exportMeta.projectName, conflict: !!existing, existingProject: existing || null });
  });
});

app.post('/api/projects/import/:tempId/confirm', requireAuth, (req, res) => {
  const { tempId } = req.params;
  const { mode, targetPid } = req.body;

  const pending = pendingImports.get(tempId);
  if (!pending) return res.status(400).json({ error: 'Importación expirada, vuelve a subir el archivo' });
  pendingImports.delete(tempId);

  const { buffer, exportMeta, dd } = pending;

  let zip;
  try { zip = new AdmZip(buffer); } catch (e) {
    console.error('[import/confirm] Error leyendo ZIP:', e.message);
    return res.status(400).json({ error: `Error leyendo ZIP: ${e.message}` });
  }

  try {
    const oldPhotos = JSON.parse(zip.getEntry('photos.json')?.getData().toString('utf8') || '[]');
    const oldBoards = JSON.parse(zip.getEntry('boards.json')?.getData().toString('utf8') || '[]');

    let newPid;
    if (mode === 'replace' && targetPid) {
      newPid = targetPid;
      const pDir = photoDir(newPid, dd);
      const bDir = boardDir(newPid, dd);
      if (fs.existsSync(pDir)) fs.readdirSync(pDir).forEach(f => { try { fs.unlinkSync(path.join(pDir, f)); } catch {} });
      if (fs.existsSync(bDir)) fs.readdirSync(bDir).forEach(f => { try { fs.unlinkSync(path.join(bDir, f)); } catch {} });
      const projects = readJSON(projsFile(dd)).map(p => p.id === newPid ? { ...p, name: exportMeta.projectName, sections: exportMeta.sections || [] } : p);
      writeJSON(projsFile(dd), projects);
    } else {
      newPid = newId();
      const projects = readJSON(projsFile(dd));
      projects.push({ id: newPid, name: exportMeta.projectName, created: Date.now(), sections: exportMeta.sections || [] });
      writeJSON(projsFile(dd), projects);
      initProject(newPid, dd);
    }

    const oldRooms = JSON.parse(zip.getEntry('rooms.json')?.getData().toString('utf8') || '[]');

    const photoIdMap = {};
    oldPhotos.forEach(p => { photoIdMap[p.id] = newId(12); });
    const boardIdMap = {};
    oldBoards.forEach(b => { boardIdMap[b.id] = newId(); });

    writeJSON(photosMeta(newPid, dd), oldPhotos.map(p => ({ ...p, id: photoIdMap[p.id] })));

    zip.getEntries().forEach(entry => {
      if (!entry.entryName.startsWith('photos/') || entry.isDirectory) return;
      const fname = path.basename(entry.entryName);
      let oldId, newFname;
      if (fname.endsWith('_thumb.jpg')) {
        oldId = fname.slice(0, fname.length - '_thumb.jpg'.length);
        const nid = photoIdMap[oldId]; if (!nid) return;
        newFname = `${nid}_thumb.jpg`;
      } else if (fname.endsWith('.jpg')) {
        oldId = fname.slice(0, fname.length - '.jpg'.length);
        const nid = photoIdMap[oldId]; if (!nid) return;
        newFname = `${nid}.jpg`;
      } else return;
      fs.writeFileSync(path.join(photoDir(newPid, dd), newFname), entry.getData());
    });

    writeJSON(boardsMeta(newPid, dd), oldBoards.map(b => ({ ...b, id: boardIdMap[b.id] })));

    oldBoards.forEach(b => {
      const entry = zip.getEntry(`boards/${b.id}.json`);
      const items = entry ? JSON.parse(entry.getData().toString('utf8')) : [];
      writeJSON(boardFile(newPid, boardIdMap[b.id], dd), items.map(item => ({
        ...item,
        id: newId(),
        ...(item.photoId ? { photoId: photoIdMap[item.photoId] || item.photoId } : {}),
      })));
    });

    if (oldRooms.length) {
      const newRooms = oldRooms.map(room => ({
        ...room,
        walls: (room.walls || []).map(wall => ({
          ...wall,
          ...(wall.boardId     ? { boardId:     boardIdMap[wall.boardId]     || wall.boardId     } : {}),
          ...(wall.boardIdBack ? { boardIdBack: boardIdMap[wall.boardIdBack] || wall.boardIdBack } : {}),
        })),
        blocks: (room.blocks || []).map(block => ({
          ...block,
          faces: Object.fromEntries(
            Object.entries(block.faces || {}).map(([k, v]) => [
              k, v?.boardId ? { ...v, boardId: boardIdMap[v.boardId] || v.boardId } : v
            ])
          ),
        })),
      }));
      writeJSON(roomsFile(newPid, dd), newRooms);
    }

    res.json(readJSON(projsFile(dd)).find(p => p.id === newPid) || { id: newPid, name: exportMeta.projectName });
  } catch (e) {
    console.error('[import/confirm] Error durante la importación:', e);
    res.status(500).json({ error: `Error durante la importación: ${e.message}` });
  }
});

// ── Start ─────────────────────────────────────────────────────────────────────
const server = app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════╗
  ║           T A B L E A U              ║
  ╠══════════════════════════════════════╣
  ║  http://localhost:${PORT}               ║
  ╚══════════════════════════════════════╝
  Datos → ${DATA_DIR}
`);
});

server.on('error', err => {
  if (err.code === 'EADDRINUSE') {
    console.error(`
  [ERROR] El puerto ${PORT} ya está en uso / Port ${PORT} is already in use.

  Cierra la otra ventana del servidor y vuelve a intentarlo.
  Close the other server window and try again.

  O libera el puerto con / Or free the port with:
    for /f "tokens=5" %a in ('netstat -aon ^| findstr :${PORT}') do taskkill /F /PID %a
`);
  } else {
    console.error('[ERROR]', err.message);
  }
  process.exit(1);
});
