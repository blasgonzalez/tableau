const express = require('express');
const multer  = require('multer');
const sharp   = require('sharp');
const path    = require('path');
const fs      = require('fs');
const { v4: uuidv4 } = require('uuid');
const { version: APP_VERSION } = require('./package.json');

const app  = express();
const PORT = process.env.PORT || 3000;

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

// ── Image processing ─────────────────────────────────────────────────────────
async function processImage(input, pid) {
  const id = newId(12);

  const resized = await sharp(input)
    .rotate()                    // aplica rotación EXIF automáticamente
    .resize(RESIZE_PX, RESIZE_PX, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
    .toBuffer();

  const meta = await sharp(resized).metadata();

  const thumb = await sharp(input)
    .rotate()
    .resize(THUMB_PX, THUMB_PX, { fit: 'inside' })
    .jpeg({ quality: 80 })
    .toBuffer();

  fs.writeFileSync(path.join(photoDir(pid), `${id}.jpg`), resized);
  fs.writeFileSync(path.join(photoDir(pid), `${id}_thumb.jpg`), thumb);

  return { id, w: meta.width, h: meta.height, size: resized.length };
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
const HEARTBEAT_TIMEOUT = 90_000; // ms sin heartbeat antes de cerrar
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
  const { name, units, dpi } = req.body;
  const boards = readJSON(boardsMeta(pid)).map(b => {
    if (b.id !== bid) return b;
    const u = { ...b };
    if (name  !== undefined) u.name  = name.trim();
    if (units !== undefined) u.units = units;
    if (dpi   !== undefined) u.dpi   = Number(dpi) || 300;
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
    const { id, w, h, size } = await processImage(req.file.buffer, pid);
    const photos = readJSON(photosMeta(pid));
    const p = { id, name: req.file.originalname, w, h, size, created: Date.now() };
    photos.push(p);
    writeJSON(photosMeta(pid), photos);
    res.json(p);
  } catch (e) {
    console.error('Upload error:', e.message);
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

// ── Board export (JPEG composite) ─────────────────────────────────────────────
app.get('/api/boards/:pid/:bid/export', async (req, res) => {
  const { pid, bid } = req.params;
  const boardItems = readJSON(boardFile(pid, bid), []);
  const photosData = readJSON(photosMeta(pid));
  const boardsData = readJSON(boardsMeta(pid));
  const board      = boardsData.find(b => b.id === bid);

  if (!boardItems.length) return res.status(400).json({ error: 'El tablero está vacío' });

  const PAD    = 60;
  const sorted = [...boardItems].sort((a, b) => (a.z || 0) - (b.z || 0));

  // Process each item: resize + rotate → get final pixel buffer + canvas position
  const layers = (await Promise.all(sorted.map(async item => {
    if (item.type === 'note') return null;
    const photo = photosData.find(p => p.id === item.photoId);
    if (!photo) return null;
    const pFile = path.join(photoDir(pid), `${item.photoId}.jpg`);
    if (!fs.existsSync(pFile)) return null;

    const rot       = item.rot || 0;
    const isSwapped = rot % 180 !== 0;
    // pre-rotation dimensions that produce the correct post-rotation canvas size
    const resizeW   = isSwapped ? Math.round(item.w * photo.w / photo.h) : item.w;
    const resizeH   = isSwapped ? item.w : Math.round(item.w * photo.h / photo.w);
    const displayH  = isSwapped ? resizeW : resizeH;  // actual canvas height

    const imgBuf = await sharp(pFile)
      .resize(resizeW, resizeH, { fit: 'fill' })
      .rotate(rot, { background: { r: 255, g: 255, b: 255 } })
      .jpeg({ quality: 92 })
      .toBuffer();

    const { width: rw, height: rh } = await sharp(imgBuf).metadata();
    const cx = item.x + item.w   / 2;
    const cy = item.y + displayH / 2;

    return { input: imgBuf, cl: Math.round(cx - rw / 2), ct: Math.round(cy - rh / 2), rw, rh };
  }))).filter(Boolean);

  if (!layers.length) return res.status(400).json({ error: 'No se pudieron procesar las imágenes' });

  const minX = Math.min(...layers.map(l => l.cl));
  const minY = Math.min(...layers.map(l => l.ct));
  const maxX = Math.max(...layers.map(l => l.cl + l.rw));
  const maxY = Math.max(...layers.map(l => l.ct + l.rh));

  const rawW = maxX - minX + PAD * 2;
  const rawH = maxY - minY + PAD * 2;
  const scale = Math.min(1, 7000 / Math.max(rawW, rawH));
  const outW  = Math.max(1, Math.round(rawW * scale));
  const outH  = Math.max(1, Math.round(rawH * scale));

  const composites = await Promise.all(layers.map(async ({ input, cl, ct, rw, rh }) => {
    const scaledInput = scale < 1
      ? await sharp(input).resize(Math.max(1, Math.round(rw * scale)), Math.max(1, Math.round(rh * scale))).jpeg({ quality: 90 }).toBuffer()
      : input;
    return {
      input: scaledInput,
      left:  Math.max(0, Math.round((cl - minX + PAD) * scale)),
      top:   Math.max(0, Math.round((ct - minY + PAD) * scale)),
      blend: 'over',
    };
  }));

  try {
    const output = await sharp({ create: { width: outW, height: outH, channels: 3, background: { r: 255, g: 255, b: 255 } } })
      .composite(composites)
      .jpeg({ quality: 92 })
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
