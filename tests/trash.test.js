'use strict';
// env vars must be set BEFORE requiring server
const { makeTmpDir, removeTmpDir, seedPhoto } = require('./helpers');
const tmpDir = makeTmpDir();
process.env.TABLEAU_AUTH          = 'false';
process.env.TABLEAU_DATA_DIR      = tmpDir;
process.env.TABLEAU_AUTO_SHUTDOWN = 'false';

const { describe, test, before, after } = require('node:test');
const assert  = require('node:assert/strict');
const path    = require('path');
const fs      = require('fs');
const request = require('supertest');
const app     = require('../server');

describe('Trash operations', () => {
  after(() => removeTmpDir(tmpDir));

  // ── Project trash ──────────────────────────────────────────────────────────
  describe('Project trash', () => {
    test('DELETE project moves it to trash (no longer in active list)', async () => {
      const { body: proj } = await request(app).post('/api/projects').send({ name: 'Trash Me' });

      const del = await request(app).delete(`/api/projects/${proj.id}`);
      assert.equal(del.status, 200);
      assert.ok(del.body.ok);

      const active = await request(app).get('/api/projects');
      assert.ok(!active.body.some(p => p.id === proj.id), 'should not be in active list');

      const trash = await request(app).get('/api/trash/projects');
      assert.ok(trash.body.some(p => p.pid === proj.id), 'should appear in trash');
    });

    test('POST restore brings project back to active list', async () => {
      const { body: proj } = await request(app).post('/api/projects').send({ name: 'Restore Me' });
      await request(app).delete(`/api/projects/${proj.id}`);

      const restore = await request(app).post(`/api/trash/projects/${proj.id}/restore`);
      assert.equal(restore.status, 200);
      assert.equal(restore.body.name, 'Restore Me');

      const active = await request(app).get('/api/projects');
      assert.ok(active.body.some(p => p.id === proj.id), 'restored project must appear in active list');

      const trash = await request(app).get('/api/trash/projects');
      assert.ok(!trash.body.some(p => p.pid === proj.id), 'must no longer be in trash');
    });

    test('restore returns 409 when active project with same id already exists', async () => {
      // Create active project, then manually plant a copy in the trash dir
      const { body: proj } = await request(app).post('/api/projects').send({ name: 'Conflict' });
      const trashDir = path.join(tmpDir, '.trash', proj.id);
      fs.mkdirSync(trashDir, { recursive: true });
      fs.writeFileSync(path.join(trashDir, '_meta.json'),
        JSON.stringify({ name: proj.name, deletedAt: Date.now() }));

      const res = await request(app).post(`/api/trash/projects/${proj.id}/restore`);
      assert.equal(res.status, 409);
    });

    test('DELETE /api/trash/projects/:pid permanently removes the project', async () => {
      const { body: proj } = await request(app).post('/api/projects').send({ name: 'Perm Delete' });
      await request(app).delete(`/api/projects/${proj.id}`);

      const perm = await request(app).delete(`/api/trash/projects/${proj.id}`);
      assert.equal(perm.status, 200);

      const trash = await request(app).get('/api/trash/projects');
      assert.ok(!trash.body.some(p => p.pid === proj.id));
    });

    test('DELETE /api/trash/projects empties entire project trash', async () => {
      const { body: p1 } = await request(app).post('/api/projects').send({ name: 'Trash A' });
      const { body: p2 } = await request(app).post('/api/projects').send({ name: 'Trash B' });
      await request(app).delete(`/api/projects/${p1.id}`);
      await request(app).delete(`/api/projects/${p2.id}`);

      const before = await request(app).get('/api/trash/projects');
      assert.ok(before.body.length >= 2, 'at least two items in trash before empty');

      const empty = await request(app).delete('/api/trash/projects');
      assert.equal(empty.status, 200);

      const after = await request(app).get('/api/trash/projects');
      assert.equal(after.body.length, 0);
    });
  });

  // ── Photo trash ────────────────────────────────────────────────────────────
  describe('Photo trash', () => {
    let pid, photoId;

    before(async () => {
      const { body: proj } = await request(app).post('/api/projects').send({ name: 'Photo Project' });
      pid = proj.id;
      // Seed photo directly to disk (bypasses sharp — only tests trash logic)
      photoId = seedPhoto(tmpDir, pid);
    });

    test('DELETE photo moves it to trash', async () => {
      const del = await request(app).delete(`/api/projects/${pid}/photos/${photoId}`);
      assert.equal(del.status, 200);
      assert.ok(del.body.ok);

      const photos = await request(app).get(`/api/projects/${pid}/photos`);
      assert.ok(!photos.body.some(p => p.id === photoId), 'photo must not be in active list');

      const trash = await request(app).get('/api/trash/photos');
      assert.equal(trash.status, 200);
      assert.ok(trash.body.some(p => p.id === photoId), 'photo must appear in trash');
    });

    test('POST restore returns photo to active list', async () => {
      const restore = await request(app).post(`/api/trash/photos/${pid}/${photoId}/restore`);
      assert.equal(restore.status, 200);
      assert.equal(restore.body.id, photoId);

      const photos = await request(app).get(`/api/projects/${pid}/photos`);
      assert.ok(photos.body.some(p => p.id === photoId), 'photo must be in active list after restore');

      const trash = await request(app).get('/api/trash/photos');
      assert.ok(!trash.body.some(p => p.id === photoId), 'photo must not remain in trash');
    });

    test('GET /api/trash/count reflects photos in trash', async () => {
      // Delete again so it's in trash for count check
      await request(app).delete(`/api/projects/${pid}/photos/${photoId}`);

      const res = await request(app).get('/api/trash/count');
      assert.equal(res.status, 200);
      assert.ok(res.body.photos >= 1);
      assert.ok(typeof res.body.total === 'number');
    });

    test('DELETE /api/trash/photos/:pid/:id permanently deletes a photo', async () => {
      // photoId is currently in trash from previous test
      const perm = await request(app).delete(`/api/trash/photos/${pid}/${photoId}`);
      assert.equal(perm.status, 200);

      const trash = await request(app).get('/api/trash/photos');
      assert.ok(!trash.body.some(p => p.id === photoId));
    });

    test('DELETE /api/trash/photos empties all photo trash', async () => {
      // Seed and delete two more photos
      const id1 = seedPhoto(tmpDir, pid);
      const id2 = seedPhoto(tmpDir, pid);
      await request(app).delete(`/api/projects/${pid}/photos/${id1}`);
      await request(app).delete(`/api/projects/${pid}/photos/${id2}`);

      const empty = await request(app).delete('/api/trash/photos');
      assert.equal(empty.status, 200);

      const trash = await request(app).get('/api/trash/photos');
      assert.equal(trash.body.length, 0);
    });
  });
});
