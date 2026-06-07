'use strict';
// env vars must be set BEFORE requiring server
const { makeTmpDir, removeTmpDir, seedUser, seedProject, seedBoard, seedRoom, seedShare, TEST_PASSWORD } = require('./helpers');
const tmpDir = makeTmpDir();
process.env.TABLEAU_AUTH           = 'true';
process.env.TABLEAU_DATA_DIR       = tmpDir;
process.env.TABLEAU_AUTO_SHUTDOWN  = 'false';
process.env.TABLEAU_SESSION_SECRET = 'test-secret';

const { describe, test, before, after } = require('node:test');
const assert  = require('node:assert/strict');
const path    = require('path');
const { v4: uuidv4 } = require('uuid');
const request = require('supertest');
const app     = require('../server');

describe('Share tokens & guest access control', () => {
  let owner, ownerDd, proj, publicBoard, privateBoard, viewToken, editToken, room;

  before(() => {
    owner        = seedUser(tmpDir, { username: 'shareowner', role: 'user' });
    ownerDd      = path.join(tmpDir, owner.id);
    proj         = seedProject(ownerDd, { name: 'Shared Project' });
    publicBoard  = seedBoard(ownerDd, proj.id, { name: 'Public Board',  isPrivate: false });
    privateBoard = seedBoard(ownerDd, proj.id, { name: 'Private Board', isPrivate: true  });
    viewToken    = uuidv4().replace(/-/g, '');
    editToken    = uuidv4().replace(/-/g, '');
    seedShare(tmpDir, { token: viewToken, ownerId: owner.id, projectId: proj.id, role: 'view' });
    seedShare(tmpDir, { token: editToken, ownerId: owner.id, projectId: proj.id, role: 'edit' });
    room         = seedRoom(ownerDd, proj.id, { name: 'Test Room' });
  });

  after(() => removeTmpDir(tmpDir));

  // ── Token resolution ───────────────────────────────────────────────────────
  test('GET /api/share/:token resolves role and project name', async () => {
    const res = await request(app).get(`/api/share/${viewToken}`);
    assert.equal(res.status, 200);
    assert.equal(res.body.role, 'view');
    assert.equal(res.body.project.id, proj.id);
    assert.equal(res.body.project.name, 'Shared Project');
  });

  test('GET /api/share/invalid returns 404', async () => {
    const res = await request(app).get('/api/share/notavalidtoken000000');
    assert.equal(res.status, 404);
  });

  // ── Board list filtering ───────────────────────────────────────────────────
  test('view token: GET boards returns only public boards', async () => {
    const res = await request(app)
      .get(`/api/projects/${proj.id}/boards`)
      .set('X-Share-Token', viewToken);
    assert.equal(res.status, 200);
    assert.ok(res.body.some(b => b.id === publicBoard.id),  'public board must appear');
    assert.ok(!res.body.some(b => b.id === privateBoard.id), 'private board must be hidden');
  });

  test('edit token: GET boards also filters private boards', async () => {
    const res = await request(app)
      .get(`/api/projects/${proj.id}/boards`)
      .set('X-Share-Token', editToken);
    assert.equal(res.status, 200);
    assert.ok(!res.body.some(b => b.id === privateBoard.id), 'private board must be hidden for edit token too');
  });

  // ── Board item access ──────────────────────────────────────────────────────
  test('view token: GET items of public board succeeds', async () => {
    const res = await request(app)
      .get(`/api/boards/${proj.id}/${publicBoard.id}/items`)
      .set('X-Share-Token', viewToken);
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body));
  });

  test('view token: GET items of private board returns 403', async () => {
    const res = await request(app)
      .get(`/api/boards/${proj.id}/${privateBoard.id}/items`)
      .set('X-Share-Token', viewToken);
    assert.equal(res.status, 403);
  });

  // ── Write access ───────────────────────────────────────────────────────────
  test('view token: PUT items returns 403 (read-only)', async () => {
    const res = await request(app)
      .put(`/api/boards/${proj.id}/${publicBoard.id}/items`)
      .set('X-Share-Token', viewToken)
      .send([]);
    assert.equal(res.status, 403);
  });

  test('view token: POST lock returns 403', async () => {
    const res = await request(app)
      .post(`/api/boards/${proj.id}/${publicBoard.id}/lock`)
      .set('X-Share-Token', viewToken);
    assert.equal(res.status, 403);
  });

  // ── Lock + edit flow ───────────────────────────────────────────────────────
  test('edit token: write items WITHOUT acquiring lock first returns 409', async () => {
    const board = seedBoard(ownerDd, proj.id, { name: 'No-lock board' });
    const tok   = uuidv4().replace(/-/g, '');
    seedShare(tmpDir, { token: tok, ownerId: owner.id, projectId: proj.id, role: 'edit' });
    const res = await request(app)
      .put(`/api/boards/${proj.id}/${board.id}/items`)
      .set('X-Share-Token', tok)
      .send([]);
    assert.equal(res.status, 409);
  });

  test('edit token: acquire lock then write items succeeds', async () => {
    const board = seedBoard(ownerDd, proj.id, { name: 'Lockable board' });
    const tok   = uuidv4().replace(/-/g, '');
    seedShare(tmpDir, { token: tok, ownerId: owner.id, projectId: proj.id, role: 'edit' });

    const lockRes = await request(app)
      .post(`/api/boards/${proj.id}/${board.id}/lock`)
      .set('X-Share-Token', tok);
    assert.equal(lockRes.status, 200, 'lock acquire must succeed');

    const writeRes = await request(app)
      .put(`/api/boards/${proj.id}/${board.id}/items`)
      .set('X-Share-Token', tok)
      .send([{ id: 'i1', type: 'text', x: 0, y: 0, w: 100, h: 40 }]);
    assert.equal(writeRes.status, 200, 'write with lock must succeed');
  });

  test('second edit token cannot acquire lock held by first', async () => {
    const board = seedBoard(ownerDd, proj.id, { name: 'Conflict board' });
    const tok1  = uuidv4().replace(/-/g, '');
    const tok2  = uuidv4().replace(/-/g, '');
    seedShare(tmpDir, { token: tok1, ownerId: owner.id, projectId: proj.id, role: 'edit' });
    seedShare(tmpDir, { token: tok2, ownerId: owner.id, projectId: proj.id, role: 'edit' });

    await request(app).post(`/api/boards/${proj.id}/${board.id}/lock`).set('X-Share-Token', tok1);

    const res = await request(app)
      .post(`/api/boards/${proj.id}/${board.id}/lock`)
      .set('X-Share-Token', tok2);
    assert.equal(res.status, 409);
  });

  test('owner (no token) bypasses lock and can write freely', async () => {
    const board = seedBoard(ownerDd, proj.id, { name: 'Owner bypass board' });
    const agent = request.agent(app);
    await agent.post('/api/login').send({ username: 'shareowner', password: TEST_PASSWORD });

    // Owner writes without acquiring a lock
    const res = await agent
      .put(`/api/boards/${proj.id}/${board.id}/items`)
      .send([{ id: 'o1', type: 'text', x: 0, y: 0, w: 50, h: 20 }]);
    assert.equal(res.status, 200);
  });

  // ── Token scoping ──────────────────────────────────────────────────────────
  test('view token used for a different project returns 403', async () => {
    const otherProj = seedProject(ownerDd, { name: 'Other Project' });
    const res = await request(app)
      .get(`/api/projects/${otherProj.id}/boards`)
      .set('X-Share-Token', viewToken); // viewToken is scoped to proj.id
    assert.equal(res.status, 403);
  });

  // ── Owner previewing own share link (regression) ──────────────────────────
  test('owner sending own share token gets guest (view) access — private boards hidden', async () => {
    const agent = request.agent(app);
    await agent.post('/api/login').send({ username: 'shareowner', password: TEST_PASSWORD });

    // Logged-in owner sends their own viewToken → resolveAccess must return shareRole='view'
    const res = await agent
      .get(`/api/projects/${proj.id}/boards`)
      .set('X-Share-Token', viewToken);
    assert.equal(res.status, 200);
    assert.ok(!res.body.some(b => b.id === privateBoard.id),
      'private board must be hidden when owner previews via own share token');
    assert.ok(res.body.some(b => b.id === publicBoard.id),
      'public board must still be visible');
  });

  test('owner without share token sees all boards including private', async () => {
    const agent = request.agent(app);
    await agent.post('/api/login').send({ username: 'shareowner', password: TEST_PASSWORD });

    const res = await agent.get(`/api/projects/${proj.id}/boards`);
    assert.equal(res.status, 200);
    assert.ok(res.body.some(b => b.id === privateBoard.id),
      'owner must see private boards when not using a share token');
  });

  // ── Share management ───────────────────────────────────────────────────────
  test('owner can create a share token via API', async () => {
    const agent = request.agent(app);
    await agent.post('/api/login').send({ username: 'shareowner', password: TEST_PASSWORD });
    const res = await agent.post(`/api/projects/${proj.id}/share`).send({ role: 'view' });
    assert.equal(res.status, 200);
    assert.equal(res.body.role, 'view');
    assert.ok(res.body.token);
  });

  test('owner can delete a share token', async () => {
    const agent = request.agent(app);
    await agent.post('/api/login').send({ username: 'shareowner', password: TEST_PASSWORD });
    // Create then delete
    await agent.post(`/api/projects/${proj.id}/share`).send({ role: 'view' });
    const res = await agent.delete(`/api/projects/${proj.id}/share/view`);
    assert.equal(res.status, 200);
    assert.ok(res.body.ok);
  });

  // ── Token uniqueness (security: tokens must never be predictable or reused) ──
  test('project share: consecutive POST calls produce different tokens', async () => {
    const agent = request.agent(app);
    await agent.post('/api/login').send({ username: 'shareowner', password: TEST_PASSWORD });
    const r1 = await agent.post(`/api/projects/${proj.id}/share`).send({ role: 'view' });
    const r2 = await agent.post(`/api/projects/${proj.id}/share`).send({ role: 'view' });
    assert.equal(r1.status, 200);
    assert.equal(r2.status, 200);
    assert.ok(r1.body.token, 'first token must be non-empty');
    assert.ok(r2.body.token, 'second token must be non-empty');
    assert.notEqual(r1.body.token, r2.body.token, 'consecutive tokens must differ');
  });

  test('room share: consecutive POST calls produce different tokens', async () => {
    const agent = request.agent(app);
    await agent.post('/api/login').send({ username: 'shareowner', password: TEST_PASSWORD });
    const r1 = await agent.post(`/api/projects/${proj.id}/rooms/${room.id}/share`);
    const r2 = await agent.post(`/api/projects/${proj.id}/rooms/${room.id}/share`);
    assert.equal(r1.status, 200);
    assert.equal(r2.status, 200);
    assert.ok(r1.body.token, 'first room token must be non-empty');
    assert.ok(r2.body.token, 'second room token must be non-empty');
    assert.notEqual(r1.body.token, r2.body.token, 'consecutive room tokens must differ');
  });
});
