const express = require('express');
const multer  = require('multer');
const sharp   = require('sharp');
const path    = require('path');
const fs      = require('fs');
const { v4: uuidv4 } = require('uuid');
const AdmZip = require('adm-zip');
const { version: APP_VERSION } = require('./package.json');

const app  = express();
const PORT = process.env.PORT || 3000;

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
const MAX_UPLOAD_MB  = 80;    // límite de subida antes de resize
const RESIZE_PX      = 1800;  // dimensión máxima de foto almacenada
const THUMB_PX       = 260;   // dimensión máxima de miniatura
const JPEG_QUALITY   = 87;
const IMAGE_EXT      = new Set(['.jpg', '.jpeg', '.png', '.webp', '.tiff', '.tif', '.avif']);

// ── File system helpers ──────────────────────────────────────────────────────
const ensureDir = d => { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); };

ensureDir(DATA_DIR);
ensureDir(path.join(__dirname, 'public'));

const projsFile  = ()          => path.join(DATA_DIR, 'projects.json');
const projDir    = pid         => path.join(DATA_DIR, pid);
const photoDir   = pid         => path.join(DATA_DIR, pid, 'photos');
const boardDir   = pid         => path.join(DATA_DIR, pid, 'boards');
const boardFile  = (pid, bid)  => path.join(boardDir(pid), `${bid}.json`);
const boardsMeta = pid         => path.join(projDir(pid), 'boards.json');
const photosMeta = pid         => path.join(projDir(pid), 'photos.json');

function readJSON(file, def = []) {
  try   { return JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch { return def; }
}
function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
}

function initProject(pid) {
  ensureDir(projDir(pid));
  ensureDir(photoDir(pid));
  ensureDir(boardDir(pid));
  if (!fs.existsSync(boardsMeta(pid))) writeJSON(boardsMeta(pid), []);
  if (!fs.existsSync(photosMeta(pid))) writeJSON(photosMeta(pid), []);
}

function newId(len = 10) {
  return uuidv4().replace(/-/g, '').slice(0, len);
}

// ── EXIF parser (no external deps — reads raw TIFF buffer from sharp) ─────────
function parseExifBuffer(buf) {
  if (!buf || buf.length < 8) return null;
  try {
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
async function processImage(input, pid, existingId = null) {
  const id = existingId || newId(12);

  const origMeta = await sharp(input).metadata();
  const exif = origMeta.exif ? parseExifBuffer(origMeta.exif) : null;

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

  fs.writeFileSync(path.join(photoDir(pid), `${id}.jpg`), resized);
  fs.writeFileSync(path.join(photoDir(pid), `${id}_thumb.jpg`), thumb);

  const ch = stats.channels;
  const brightness = Math.round((0.299 * ch[0].mean + 0.587 * ch[1].mean + 0.114 * ch[2].mean) / 255 * 100) / 100;
  const meanColor = { r: Math.round(ch[0].mean), g: Math.round(ch[1].mean), b: Math.round(ch[2].mean) };
  return { id, w: meta.width, h: meta.height, size: resized.length, dominant: stats.dominant, brightness, meanColor, ...(exif && { exif }) };
}

// ── Middleware ───────────────────────────────────────────────────────────────
app.use(express.json({ limit: '2mb' }));
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
const HEARTBEAT_TIMEOUT = 300_000; // ms sin heartbeat antes de cerrar (5 min)
let heartbeatTimer = null;
const resetHeartbeat = () => {
  clearTimeout(heartbeatTimer);
  heartbeatTimer = setTimeout(() => process.exit(0), HEARTBEAT_TIMEOUT);
};
resetHeartbeat();
app.post('/api/heartbeat', (_req, res) => { resetHeartbeat(); res.sendStatus(204); });

// ── Projects ─────────────────────────────────────────────────────────────────
app.get('/api/projects', (_req, res) => {
  res.json(readJSON(projsFile()));
});

app.post('/api/projects', (req, res) => {
  const { name } = req.body;
  if (!name?.trim()) return res.status(400).json({ error: 'Nombre requerido' });
  const projects = readJSON(projsFile());
  const p = { id: newId(), name: name.trim(), created: Date.now() };
  projects.push(p);
  writeJSON(projsFile(), projects);
  initProject(p.id);
  res.json(p);
});

app.patch('/api/projects/:pid', (req, res) => {
  const { pid } = req.params;
  const { name } = req.body;
  const projects = readJSON(projsFile()).map(p =>
    p.id === pid ? { ...p, name: name.trim() } : p
  );
  writeJSON(projsFile(), projects);
  res.json({ ok: true });
});

app.delete('/api/projects/:pid', (req, res) => {
  const { pid } = req.params;
  const projects = readJSON(projsFile()).filter(p => p.id !== pid);
  writeJSON(projsFile(), projects);
  fs.rmSync(projDir(pid), { recursive: true, force: true });
  res.json({ ok: true });
});

// ── Boards ───────────────────────────────────────────────────────────────────
app.get('/api/projects/:pid/boards', (req, res) => {
  res.json(readJSON(boardsMeta(req.params.pid)));
});

app.post('/api/projects/:pid/boards', (req, res) => {
  const { pid } = req.params;
  const { name } = req.body;
  if (!name?.trim()) return res.status(400).json({ error: 'Nombre requerido' });
  const boards = readJSON(boardsMeta(pid));
  const b = { id: newId(), name: name.trim(), created: Date.now() };
  boards.push(b);
  writeJSON(boardsMeta(pid), boards);
  writeJSON(boardFile(pid, b.id), []);
  res.json(b);
});

app.patch('/api/projects/:pid/boards/:bid', (req, res) => {
  const { pid, bid } = req.params;
  const { name, units, dpi, fixed, fixedW, fixedH, defaultFrame, background, defaultW, exportPad } = req.body;
  const boards = readJSON(boardsMeta(pid)).map(b => {
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
    return u;
  });
  writeJSON(boardsMeta(pid), boards);
  res.json({ ok: true });
});

app.delete('/api/projects/:pid/boards/:bid', (req, res) => {
  const { pid, bid } = req.params;
  const boards = readJSON(boardsMeta(pid)).filter(b => b.id !== bid);
  writeJSON(boardsMeta(pid), boards);
  const bf = boardFile(pid, bid);
  if (fs.existsSync(bf)) fs.unlinkSync(bf);
  const vdir = boardVersionsDir(pid, bid);
  if (fs.existsSync(vdir)) fs.rmSync(vdir, { recursive: true, force: true });
  res.json({ ok: true });
});

app.post('/api/projects/:pid/boards/:bid/duplicate', (req, res) => {
  const { pid, bid } = req.params;
  const boards = readJSON(boardsMeta(pid));
  const original = boards.find(b => b.id === bid);
  if (!original) return res.status(404).json({ error: 'Tablero no encontrado' });
  const copy = { ...original, id: newId(), name: original.name + ' (copia)', created: Date.now() };
  const items = readJSON(boardFile(pid, bid), []);
  const idx = boards.findIndex(b => b.id === bid);
  boards.splice(idx + 1, 0, copy);
  writeJSON(boardsMeta(pid), boards);
  writeJSON(boardFile(pid, copy.id), items);
  res.json(copy);
});

app.put('/api/projects/:pid/boards/order', (req, res) => {
  const { pid } = req.params;
  const { order } = req.body;
  if (!Array.isArray(order)) return res.status(400).json({ error: 'order required' });
  const boards = readJSON(boardsMeta(pid));
  const map = Object.fromEntries(boards.map(b => [b.id, b]));
  const sorted = order.map(id => map[id]).filter(Boolean);
  boards.forEach(b => { if (!order.includes(b.id)) sorted.push(b); });
  writeJSON(boardsMeta(pid), sorted);
  res.json({ ok: true });
});

// ── Photos – upload ──────────────────────────────────────────────────────────
app.get('/api/projects/:pid/photos', (req, res) => {
  res.json(readJSON(photosMeta(req.params.pid)));
});

app.post('/api/projects/:pid/photos', upload.single('photo'), async (req, res) => {
  const { pid } = req.params;
  if (!req.file) return res.status(400).json({ error: 'No se recibió ningún fichero' });
  try {
    const { id, w, h, size, dominant, brightness, meanColor } = await processImage(req.file.buffer, pid);
    const photos = readJSON(photosMeta(pid));
    const p = { id, name: req.file.originalname, w, h, size, dominant, brightness, meanColor, created: Date.now() };
    photos.push(p);
    writeJSON(photosMeta(pid), photos);
    res.json(p);
  } catch (e) {
    console.error('Upload error:', e.message);
    res.status(500).json({ error: e.message });
  }
});

app.put('/api/projects/:pid/photos/:id/file', upload.single('photo'), async (req, res) => {
  const { pid, id } = req.params;
  if (!req.file) return res.status(400).json({ error: 'No se recibió ningún fichero' });
  const photos = readJSON(photosMeta(pid));
  const idx = photos.findIndex(p => p.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Foto no encontrada' });
  try {
    const { w, h, size, dominant, brightness, meanColor, exif } = await processImage(req.file.buffer, pid, id);
    const updated = { ...photos[idx], w, h, size, dominant, brightness, meanColor, ...(exif ? { exif } : {}) };
    photos[idx] = updated;
    writeJSON(photosMeta(pid), photos);
    res.json(updated);
  } catch (e) {
    console.error('Replace error:', e.message);
    res.status(500).json({ error: e.message });
  }
});

app.delete('/api/projects/:pid/photos/:id', (req, res) => {
  const { pid, id } = req.params;
  const photos = readJSON(photosMeta(pid)).filter(p => p.id !== id);
  writeJSON(photosMeta(pid), photos);
  [path.join(photoDir(pid), `${id}.jpg`), path.join(photoDir(pid), `${id}_thumb.jpg`)]
    .forEach(f => { try { fs.unlinkSync(f); } catch {} });
  res.json({ ok: true });
});

app.patch('/api/projects/:pid/photos/:id/rating', (req, res) => {
  const { pid, id } = req.params;
  const { rating } = req.body;
  if (typeof rating !== 'number' || rating < 0 || rating > 5) return res.status(400).json({ error: 'rating 0-5 required' });
  const photos = readJSON(photosMeta(pid));
  const p = photos.find(p => p.id === id);
  if (!p) return res.status(404).json({ error: 'not found' });
  p.rating = rating;
  writeJSON(photosMeta(pid), photos);
  res.json(p);
});

app.patch('/api/projects/:pid/photos/:id/tags', (req, res) => {
  const { pid, id } = req.params;
  const { tags } = req.body;
  if (!Array.isArray(tags)) return res.status(400).json({ error: 'tags array required' });
  const photos = readJSON(photosMeta(pid));
  const p = photos.find(p => p.id === id);
  if (!p) return res.status(404).json({ error: 'not found' });
  p.tags = tags.map(t => t.trim()).filter(Boolean);
  writeJSON(photosMeta(pid), photos);
  res.json(p);
});

app.patch('/api/projects/:pid/photos/:id/rejected', (req, res) => {
  const { pid, id } = req.params;
  const { rejected } = req.body;
  const photos = readJSON(photosMeta(pid));
  const p = photos.find(p => p.id === id);
  if (!p) return res.status(404).json({ error: 'not found' });
  p.rejected = !!rejected;
  writeJSON(photosMeta(pid), photos);
  res.json(p);
});

app.patch('/api/projects/:pid/photos/:id/section', (req, res) => {
  const { pid, id } = req.params;
  const { sectionId } = req.body;
  const photos = readJSON(photosMeta(pid));
  const p = photos.find(p => p.id === id);
  if (!p) return res.status(404).json({ error: 'not found' });
  if (sectionId) p.sectionId = sectionId; else delete p.sectionId;
  writeJSON(photosMeta(pid), photos);
  res.json(p);
});

app.put('/api/projects/:pid/sections', (req, res) => {
  const { pid } = req.params;
  const { sections } = req.body;
  if (!Array.isArray(sections)) return res.status(400).json({ error: 'sections array required' });
  const projects = readJSON(projsFile()).map(p =>
    p.id === pid ? { ...p, sections } : p
  );
  writeJSON(projsFile(), projects);
  res.json({ ok: true });
});

// ── Templates ─────────────────────────────────────────────────────────────────
const templatesFile = () => path.join(DATA_DIR, 'templates.json');

app.get('/api/templates', (_req, res) => {
  res.json(readJSON(templatesFile()));
});

app.post('/api/templates', (req, res) => {
  const { name, boardMeta, items } = req.body;
  if (!name || !Array.isArray(items)) return res.status(400).json({ error: 'name and items required' });
  const templates = readJSON(templatesFile());
  const tmpl = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
    name: name.trim(), created: Date.now(),
    boardMeta: boardMeta || {}, items,
  };
  templates.push(tmpl);
  writeJSON(templatesFile(), templates);
  res.json(tmpl);
});

app.patch('/api/templates/:tid', (req, res) => {
  const { name } = req.body;
  const templates = readJSON(templatesFile()).map(t => t.id === req.params.tid ? { ...t, name: name.trim() } : t);
  writeJSON(templatesFile(), templates);
  res.json({ ok: true });
});

app.delete('/api/templates/:tid', (req, res) => {
  writeJSON(templatesFile(), readJSON(templatesFile()).filter(t => t.id !== req.params.tid));
  res.json({ ok: true });
});

app.post('/api/projects/:pid/photos/analyze-colors', async (req, res) => {
  const { pid } = req.params;
  const photos = readJSON(photosMeta(pid));
  let updated = 0;
  for (const p of photos) {
    if (p.dominant) continue;
    const pFile = path.join(photoDir(pid), `${p.id}.jpg`);
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
  if (updated > 0) writeJSON(photosMeta(pid), photos);
  res.json({ ok: true, updated });
});

app.post('/api/projects/:pid/photos/:photoId/copy-to/:targetPid', (req, res) => {
  const { pid, photoId, targetPid } = req.params;
  const srcPhotos = readJSON(photosMeta(pid));
  const photo = srcPhotos.find(p => p.id === photoId);
  if (!photo) return res.status(404).json({ error: 'Foto no encontrada' });
  const projects = readJSON(projsFile());
  if (!projects.find(p => p.id === targetPid)) return res.status(404).json({ error: 'Proyecto destino no encontrado' });
  const nid = newId(12);
  try {
    fs.copyFileSync(path.join(photoDir(pid), `${photoId}.jpg`),       path.join(photoDir(targetPid), `${nid}.jpg`));
    fs.copyFileSync(path.join(photoDir(pid), `${photoId}_thumb.jpg`), path.join(photoDir(targetPid), `${nid}_thumb.jpg`));
  } catch (e) { return res.status(500).json({ error: e.message }); }
  const dstPhotos = readJSON(photosMeta(targetPid));
  const newPhoto = { ...photo, id: nid };
  dstPhotos.push(newPhoto);
  writeJSON(photosMeta(targetPid), dstPhotos);
  res.json(newPhoto);
});

// ── Serve photos ──────────────────────────────────────────────────────────────
app.get('/photos/:pid/:id', (req, res) => {
  const file = path.join(photoDir(req.params.pid), `${req.params.id}.jpg`);
  fs.existsSync(file) ? res.sendFile(file) : res.status(404).end();
});

app.get('/photos/:pid/:id/thumb', (req, res) => {
  const file = path.join(photoDir(req.params.pid), `${req.params.id}_thumb.jpg`);
  fs.existsSync(file) ? res.sendFile(file) : res.status(404).end();
});

// ── Board items ───────────────────────────────────────────────────────────────
app.get('/api/boards/:pid/:bid/items', (req, res) => {
  const { pid, bid } = req.params;
  res.json(readJSON(boardFile(pid, bid), []));
});

app.put('/api/boards/:pid/:bid/items', (req, res) => {
  const { pid, bid } = req.params;
  if (!Array.isArray(req.body)) return res.status(400).json({ error: 'Array esperado' });
  writeJSON(boardFile(pid, bid), req.body);
  res.json({ ok: true });
});

// ── Board versions ────────────────────────────────────────────────────────────
const boardVersionsDir = (pid, bid) => path.join(boardDir(pid), `${bid}.versions`);

app.get('/api/boards/:pid/:bid/versions', (req, res) => {
  const { pid, bid } = req.params;
  const dir = boardVersionsDir(pid, bid);
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

app.post('/api/boards/:pid/:bid/versions', (req, res) => {
  const { pid, bid } = req.params;
  const dir = boardVersionsDir(pid, bid);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const items = readJSON(boardFile(pid, bid), []);
  const ts = Date.now();
  writeJSON(path.join(dir, `${ts}.json`), items);
  res.json({ ts, itemCount: items.length });
});

app.post('/api/boards/:pid/:bid/versions/:ts/restore', (req, res) => {
  const { pid, bid, ts } = req.params;
  const file = path.join(boardVersionsDir(pid, bid), `${ts}.json`);
  if (!fs.existsSync(file)) return res.status(404).json({ error: 'Versión no encontrada' });
  const items = readJSON(file, []);
  writeJSON(boardFile(pid, bid), items);
  res.json(items);
});

app.delete('/api/boards/:pid/:bid/versions/:ts', (req, res) => {
  const { pid, bid, ts } = req.params;
  const file = path.join(boardVersionsDir(pid, bid), `${ts}.json`);
  if (fs.existsSync(file)) fs.unlinkSync(file);
  res.json({ ok: true });
});

// ── Board export (JPEG composite) ─────────────────────────────────────────────
app.get('/api/boards/:pid/:bid/export', async (req, res) => {
  const { pid, bid } = req.params;
  const { ids, useBoard, pad: padParam } = req.query;
  let boardItems = readJSON(boardFile(pid, bid), []);
  if (ids) { const idSet = new Set(ids.split(',')); boardItems = boardItems.filter(i => idSet.has(i.id)); }
  const photosData = readJSON(photosMeta(pid));
  const boardsData = readJSON(boardsMeta(pid));
  const board      = boardsData.find(b => b.id === bid);

  if (!boardItems.length) return res.status(400).json({ error: 'El tablero está vacío' });

  const PAD    = padParam != null ? Math.max(0, parseInt(padParam) || 0) : 60;
  const sorted = [...boardItems].sort((a, b) => (a.z || 0) - (b.z || 0));

  // Process each item: resize + flip + rotate → get final pixel buffer + canvas position
  const layers = (await Promise.all(sorted.map(async item => {
    if (item.type === 'note' || item.type === 'placeholder' || item.type === 'zone') return null;

    if (item.type === 'text') {
      try {
        if (!item.text?.trim()) return null;
        const tw = Math.round(item.w);
        const th = Math.round(item.h || 130);
        const fontSize = item.fontSize || 26;
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
        const cx = item.x + tw / 2;
        const cy = item.y + th / 2;
        return { input: buf, cl: Math.round(cx - rw / 2), ct: Math.round(cy - rh / 2), rw, rh };
      } catch (err) {
        console.error('Text layer render error:', err.message);
        return null;
      }
    }

    try {
      const photo = photosData.find(p => p.id === item.photoId);
      if (!photo) return null;
      const pFile = path.join(photoDir(pid), `${item.photoId}.jpg`);
      if (!fs.existsSync(pFile)) return null;

      const rot       = item.rot || 0;
      const freeRot   = item.freeRot || 0;
      const isSwapped = rot % 180 !== 0;
      const resizeW   = isSwapped ? Math.round(item.w * photo.w / photo.h) : item.w;
      const resizeH   = isSwapped ? item.w : Math.round(item.w * photo.h / photo.w);
      const displayH  = isSwapped ? resizeW : resizeH;

      let sharpChain = sharp(pFile).resize(resizeW, resizeH, { fit: 'fill' });
      if (item.flipH) sharpChain = sharpChain.flop();
      if (item.flipV) sharpChain = sharpChain.flip();
      sharpChain = sharpChain.rotate(rot, { background: { r: 255, g: 255, b: 255 } });
      if (freeRot) sharpChain = sharpChain.rotate(freeRot, { background: { r: 255, g: 255, b: 255 } });
      const imgBuf = await sharpChain.png({ compressionLevel: 1 }).toBuffer();

      const { width: rw, height: rh } = await sharp(imgBuf).metadata();
      const cx = item.x + item.w   / 2;
      const cy = item.y + displayH / 2;

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
    rawW    = board.fixedW;
    rawH    = board.fixedH;
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
app.get('/api/projects/:pid/export', (req, res) => {
  const { pid } = req.params;
  const proj = readJSON(projsFile()).find(p => p.id === pid);
  if (!proj) return res.status(404).json({ error: 'Proyecto no encontrado' });

  const zip = new AdmZip();
  zip.addFile('tableau-export.json', Buffer.from(JSON.stringify({
    version: APP_VERSION, exportedAt: Date.now(), originId: pid, projectName: proj.name,
    sections: proj.sections || [],
  }, null, 2)));

  const pMeta = photosMeta(pid);
  const bMeta = boardsMeta(pid);
  if (fs.existsSync(pMeta)) zip.addFile('photos.json', fs.readFileSync(pMeta));
  if (fs.existsSync(bMeta)) zip.addFile('boards.json', fs.readFileSync(bMeta));

  readJSON(boardsMeta(pid)).forEach(b => {
    const bf = boardFile(pid, b.id);
    if (fs.existsSync(bf)) zip.addFile(`boards/${b.id}.json`, fs.readFileSync(bf));
  });

  const pDir = photoDir(pid);
  if (fs.existsSync(pDir)) {
    fs.readdirSync(pDir).forEach(f => zip.addFile(`photos/${f}`, fs.readFileSync(path.join(pDir, f))));
  }

  const safeName = proj.name.replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '_') || 'proyecto';
  res.set('Content-Type', 'application/zip');
  res.set('Content-Disposition', `attachment; filename="${safeName}-tableau.zip"`);
  res.send(zip.toBuffer());
});

const pendingImports = new Map();

app.post('/api/projects/import', (req, res, next) => {
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

    const projects = readJSON(projsFile());
    const existing = projects.find(p => p.id === exportMeta.originId);

    const now = Date.now();
    for (const [k, v] of pendingImports) {
      if (now - v.createdAt > 10 * 60 * 1000) pendingImports.delete(k);
    }
    const tempId = newId();
    pendingImports.set(tempId, { buffer: req.file.buffer, exportMeta, createdAt: now });

    res.json({ tempId, projectName: exportMeta.projectName, conflict: !!existing, existingProject: existing || null });
  });
});

app.post('/api/projects/import/:tempId/confirm', (req, res) => {
  const { tempId } = req.params;
  const { mode, targetPid } = req.body;

  const pending = pendingImports.get(tempId);
  if (!pending) return res.status(400).json({ error: 'Importación expirada, vuelve a subir el archivo' });
  pendingImports.delete(tempId);

  const { buffer, exportMeta } = pending;

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
      const pDir = photoDir(newPid);
      const bDir = boardDir(newPid);
      if (fs.existsSync(pDir)) fs.readdirSync(pDir).forEach(f => { try { fs.unlinkSync(path.join(pDir, f)); } catch {} });
      if (fs.existsSync(bDir)) fs.readdirSync(bDir).forEach(f => { try { fs.unlinkSync(path.join(bDir, f)); } catch {} });
      const projects = readJSON(projsFile()).map(p => p.id === newPid ? { ...p, name: exportMeta.projectName, sections: exportMeta.sections || [] } : p);
      writeJSON(projsFile(), projects);
    } else {
      newPid = newId();
      const projects = readJSON(projsFile());
      projects.push({ id: newPid, name: exportMeta.projectName, created: Date.now(), sections: exportMeta.sections || [] });
      writeJSON(projsFile(), projects);
      initProject(newPid);
    }

    const photoIdMap = {};
    oldPhotos.forEach(p => { photoIdMap[p.id] = newId(12); });
    const boardIdMap = {};
    oldBoards.forEach(b => { boardIdMap[b.id] = newId(); });

    writeJSON(photosMeta(newPid), oldPhotos.map(p => ({ ...p, id: photoIdMap[p.id] })));

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
      fs.writeFileSync(path.join(photoDir(newPid), newFname), entry.getData());
    });

    writeJSON(boardsMeta(newPid), oldBoards.map(b => ({ ...b, id: boardIdMap[b.id] })));

    oldBoards.forEach(b => {
      const entry = zip.getEntry(`boards/${b.id}.json`);
      const items = entry ? JSON.parse(entry.getData().toString('utf8')) : [];
      writeJSON(boardFile(newPid, boardIdMap[b.id]), items.map(item => ({
        ...item,
        id: newId(),
        ...(item.photoId ? { photoId: photoIdMap[item.photoId] || item.photoId } : {}),
      })));
    });

    res.json(readJSON(projsFile()).find(p => p.id === newPid) || { id: newPid, name: exportMeta.projectName });
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
