'use strict';
// env vars must be set BEFORE requiring server
const { makeTmpDir, removeTmpDir, seedUser, TEST_PASSWORD } = require('./helpers');
const tmpDir = makeTmpDir();
process.env.TABLEAU_AUTH           = 'true';
process.env.TABLEAU_DATA_DIR       = tmpDir;
process.env.TABLEAU_AUTO_SHUTDOWN  = 'false';
process.env.TABLEAU_SESSION_SECRET = 'test-secret';

const { describe, test, before, after } = require('node:test');
const assert  = require('node:assert/strict');
const request = require('supertest');
const app     = require('../server');

describe('Authentication & authorization', () => {
  let owner, admin;

  before(() => {
    owner = seedUser(tmpDir, { username: 'owner', role: 'user'  });
    admin = seedUser(tmpDir, { username: 'admin', role: 'admin' });
    seedUser(tmpDir, { username: 'expired', role: 'user', expiresAt: Date.now() - 1000 });
  });

  after(() => removeTmpDir(tmpDir));

  // ── Login ──────────────────────────────────────────────────────────────────
  test('login with valid credentials returns ok and username', async () => {
    const res = await request(app).post('/api/login').send({ username: 'owner', password: TEST_PASSWORD });
    assert.equal(res.status, 200);
    assert.ok(res.body.ok);
    assert.equal(res.body.username, 'owner');
    assert.ok(typeof res.body.quota === 'number');
  });

  test('login with wrong password returns 401', async () => {
    const res = await request(app).post('/api/login').send({ username: 'owner', password: 'WrongPass1' });
    assert.equal(res.status, 401);
    assert.ok(res.body.error);
  });

  test('login with missing fields returns 400', async () => {
    const res = await request(app).post('/api/login').send({ username: 'owner' });
    assert.equal(res.status, 400);
  });

  test('login with expired account returns 403', async () => {
    const res = await request(app).post('/api/login').send({ username: 'expired', password: TEST_PASSWORD });
    assert.equal(res.status, 403);
  });

  test('5 consecutive wrong passwords trigger lockout (429)', async () => {
    seedUser(tmpDir, { username: 'lockme', role: 'user' });
    for (let i = 0; i < 5; i++) {
      await request(app).post('/api/login').send({ username: 'lockme', password: 'Bad1pass' });
    }
    const res = await request(app).post('/api/login').send({ username: 'lockme', password: TEST_PASSWORD });
    assert.equal(res.status, 429);
  });

  // ── Session / /api/me ──────────────────────────────────────────────────────
  test('GET /api/me without session returns authenticated:false', async () => {
    const res = await request(app).get('/api/me');
    assert.equal(res.status, 200);
    assert.equal(res.body.auth, true);
    assert.equal(res.body.authenticated, false);
  });

  test('GET /api/me after login returns user info', async () => {
    const agent = request.agent(app);
    await agent.post('/api/login').send({ username: 'owner', password: TEST_PASSWORD });
    const res = await agent.get('/api/me');
    assert.equal(res.status, 200);
    assert.equal(res.body.authenticated, true);
    assert.equal(res.body.username, 'owner');
  });

  test('POST /api/logout destroys session', async () => {
    const agent = request.agent(app);
    await agent.post('/api/login').send({ username: 'owner', password: TEST_PASSWORD });
    await agent.post('/api/logout');
    const res = await agent.get('/api/me');
    assert.equal(res.body.authenticated, false);
  });

  // ── Protected routes ───────────────────────────────────────────────────────
  test('GET /api/projects without auth returns 401', async () => {
    const res = await request(app).get('/api/projects');
    assert.equal(res.status, 401);
  });

  test('GET /api/projects with auth returns empty list for new user', async () => {
    const agent = request.agent(app);
    await agent.post('/api/login').send({ username: 'owner', password: TEST_PASSWORD });
    const res = await agent.get('/api/projects');
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body));
  });

  // ── User isolation ─────────────────────────────────────────────────────────
  test('user A cannot see user B projects', async () => {
    const agentA = request.agent(app);
    await agentA.post('/api/login').send({ username: 'owner', password: TEST_PASSWORD });
    await agentA.post('/api/projects').send({ name: 'Owner project' });

    const agentB = request.agent(app);
    await agentB.post('/api/login').send({ username: 'admin', password: TEST_PASSWORD });
    const res = await agentB.get('/api/projects');
    assert.equal(res.status, 200);
    assert.equal(res.body.length, 0, 'admin should see their own empty list, not owner\'s');
  });

  // ── Change password ────────────────────────────────────────────────────────
  test('change-password with wrong current returns 401', async () => {
    const agent = request.agent(app);
    await agent.post('/api/login').send({ username: 'owner', password: TEST_PASSWORD });
    const res = await agent.post('/api/change-password').send({
      currentPassword: 'WrongCurrent1',
      newPassword:     'NewValid123!',
    });
    assert.equal(res.status, 401);
  });

  test('change-password with weak new password returns 400', async () => {
    const agent = request.agent(app);
    await agent.post('/api/login').send({ username: 'owner', password: TEST_PASSWORD });
    const res = await agent.post('/api/change-password').send({
      currentPassword: TEST_PASSWORD,
      newPassword:     'weak',
    });
    assert.equal(res.status, 400);
  });

  // ── Admin routes ───────────────────────────────────────────────────────────
  test('GET /api/admin/users as regular user returns 403', async () => {
    const agent = request.agent(app);
    await agent.post('/api/login').send({ username: 'owner', password: TEST_PASSWORD });
    const res = await agent.get('/api/admin/users');
    assert.equal(res.status, 403);
  });

  test('GET /api/admin/users as admin returns user list', async () => {
    const agent = request.agent(app);
    await agent.post('/api/login').send({ username: 'admin', password: TEST_PASSWORD });
    const res = await agent.get('/api/admin/users');
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body));
    assert.ok(res.body.length >= 2);
  });

  test('admin cannot delete themselves', async () => {
    const agent = request.agent(app);
    await agent.post('/api/login').send({ username: 'admin', password: TEST_PASSWORD });
    const res = await agent.delete(`/api/admin/users/${admin.id}`);
    assert.equal(res.status, 400);
  });

  test('admin can delete another user', async () => {
    seedUser(tmpDir, { username: 'tobedeleted', role: 'user' });
    const users = require('fs').readdirSync; // just to find the id
    // Get id via admin API
    const agent = request.agent(app);
    await agent.post('/api/login').send({ username: 'admin', password: TEST_PASSWORD });
    const list = await agent.get('/api/admin/users');
    const target = list.body.find(u => u.username === 'tobedeleted');
    assert.ok(target);
    const res = await agent.delete(`/api/admin/users/${target.id}`);
    assert.equal(res.status, 200);
    assert.ok(res.body.ok);
  });

  // ── Reset password (public endpoint) ──────────────────────────────────────
  test('POST /api/reset-password/request always returns ok (hides user existence)', async () => {
    const res = await request(app).post('/api/reset-password/request').send({ email: 'nonexistent@x.com' });
    assert.equal(res.status, 200);
    assert.ok(res.body.ok);
  });

  test('POST /api/reset-password/confirm with invalid token returns 400', async () => {
    const res = await request(app).post('/api/reset-password/confirm').send({
      token:       'invalidtoken',
      newPassword: 'NewValid123!',
    });
    assert.equal(res.status, 400);
  });
});
