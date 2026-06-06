'use strict';
// env vars must be set BEFORE requiring server (AUTH_ENABLED and DATA_DIR are const at load time)
const { makeTmpDir, removeTmpDir } = require('./helpers');
const tmpDir = makeTmpDir();
process.env.TABLEAU_AUTH          = 'false';
process.env.TABLEAU_DATA_DIR      = tmpDir;
process.env.TABLEAU_AUTO_SHUTDOWN = 'false';

const { describe, test, after } = require('node:test');
const assert  = require('node:assert/strict');
const request = require('supertest');
const app     = require('../server');

describe('Local mode — smoke tests (no auth)', () => {
  after(() => removeTmpDir(tmpDir));

  let pid, bid;

  test('GET /api/version returns a version string', async () => {
    const res = await request(app).get('/api/version');
    assert.equal(res.status, 200);
    assert.equal(typeof res.body.version, 'string');
    assert.ok(res.body.version.length > 0);
  });

  test('GET /api/me returns auth:false', async () => {
    const res = await request(app).get('/api/me');
    assert.equal(res.status, 200);
    assert.equal(res.body.auth, false);
  });

  test('POST /api/projects with no name returns 400', async () => {
    const res = await request(app).post('/api/projects').send({});
    assert.equal(res.status, 400);
  });

  test('POST /api/projects creates a project', async () => {
    const res = await request(app).post('/api/projects').send({ name: 'Mi Proyecto' });
    assert.equal(res.status, 200);
    assert.equal(res.body.name, 'Mi Proyecto');
    assert.ok(res.body.id);
    pid = res.body.id;
  });

  test('GET /api/projects lists the created project', async () => {
    const res = await request(app).get('/api/projects');
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body));
    assert.ok(res.body.some(p => p.id === pid));
  });

  test('POST /api/projects/:pid/boards creates a board', async () => {
    const res = await request(app).post(`/api/projects/${pid}/boards`).send({ name: 'Tablero 1' });
    assert.equal(res.status, 200);
    assert.equal(res.body.name, 'Tablero 1');
    assert.ok(res.body.id);
    bid = res.body.id;
  });

  test('GET /api/projects/:pid/boards lists the board', async () => {
    const res = await request(app).get(`/api/projects/${pid}/boards`);
    assert.equal(res.status, 200);
    assert.ok(res.body.some(b => b.id === bid));
  });

  test('GET /api/boards/:pid/:bid/items returns empty array initially', async () => {
    const res = await request(app).get(`/api/boards/${pid}/${bid}/items`);
    assert.equal(res.status, 200);
    assert.deepEqual(res.body, []);
  });

  test('PUT /api/boards/:pid/:bid/items saves items', async () => {
    const items = [{ id: 'x1', type: 'text', x: 10, y: 10, w: 200, h: 50 }];
    const res   = await request(app).put(`/api/boards/${pid}/${bid}/items`).send(items);
    assert.equal(res.status, 200);
    assert.ok(res.body.ok);
  });

  test('GET /api/boards/:pid/:bid/items returns the saved items', async () => {
    const res = await request(app).get(`/api/boards/${pid}/${bid}/items`);
    assert.equal(res.status, 200);
    assert.equal(res.body.length, 1);
    assert.equal(res.body[0].id, 'x1');
  });

  test('PATCH /api/projects/:pid renames the project', async () => {
    const res = await request(app).patch(`/api/projects/${pid}`).send({ name: 'Renamed' });
    assert.equal(res.status, 200);
    const list = await request(app).get('/api/projects');
    assert.ok(list.body.find(p => p.id === pid)?.name === 'Renamed');
  });

  test('DELETE /api/projects/:pid moves project to trash', async () => {
    const res = await request(app).delete(`/api/projects/${pid}`);
    assert.equal(res.status, 200);
    assert.ok(res.body.ok);
  });

  test('GET /api/projects does not list the deleted project', async () => {
    const res = await request(app).get('/api/projects');
    assert.equal(res.status, 200);
    assert.ok(!res.body.some(p => p.id === pid));
  });

  test('GET /api/trash/projects shows the deleted project', async () => {
    const res = await request(app).get('/api/trash/projects');
    assert.equal(res.status, 200);
    assert.ok(res.body.some(p => p.pid === pid));
  });
});
