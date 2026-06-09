'use strict';
const { makeTmpDir, removeTmpDir, seedUser, seedProject, seedBoard, seedShare, seedPhoto, seedComment, TEST_PASSWORD } = require('./helpers');
const tmpDir = makeTmpDir();
process.env.TABLEAU_AUTH           = 'true';
process.env.TABLEAU_DATA_DIR       = tmpDir;
process.env.TABLEAU_AUTO_SHUTDOWN  = 'false';
process.env.TABLEAU_SESSION_SECRET = 'test-secret';

const { describe, test, before, after } = require('node:test');
const assert  = require('node:assert/strict');
const path    = require('path');
const fs      = require('fs');
const { v4: uuidv4 } = require('uuid');
const request = require('supertest');
const app     = require('../server');

describe('Comment system', () => {
  let owner, ownerDd, proj, board, viewToken, editToken, viewTokenWithComments;
  let ownerAgent; // authenticated session for owner

  before(async () => {
    owner     = seedUser(tmpDir, { username: 'cowner', role: 'user' });
    ownerDd   = path.join(tmpDir, owner.id);
    proj      = seedProject(ownerDd, { name: 'Comment Project' });
    board     = seedBoard(ownerDd, proj.id, { name: 'Board A' });

    // share tokens
    viewToken             = uuidv4().replace(/-/g, '');
    editToken             = uuidv4().replace(/-/g, '');
    viewTokenWithComments = uuidv4().replace(/-/g, '');
    seedShare(tmpDir, { token: viewToken,             ownerId: owner.id, projectId: proj.id, role: 'view', allowComments: false });
    seedShare(tmpDir, { token: editToken,             ownerId: owner.id, projectId: proj.id, role: 'edit', allowComments: false });
    seedShare(tmpDir, { token: viewTokenWithComments, ownerId: owner.id, projectId: proj.id, role: 'view', allowComments: true  });

    // log in as owner
    ownerAgent = request.agent(app);
    await ownerAgent.post('/api/login').send({ username: 'cowner', password: TEST_PASSWORD });
  });

  after(() => removeTmpDir(tmpDir));

  // ── Owner CRUD ─────────────────────────────────────────────────────────────

  test('owner can create a comment on a board', async () => {
    const res = await ownerAgent
      .post(`/api/projects/${proj.id}/comments`)
      .send({ entityType: 'board', entityId: board.id, text: 'Owner note' });
    assert.equal(res.status, 200);
    assert.equal(res.body.authorType, 'owner');
    assert.equal(res.body.status, 'published');
    assert.equal(res.body.visibility, 'private');
    assert.equal(res.body.text, 'Owner note');
  });

  test('owner sees all comments in GET list', async () => {
    const res = await ownerAgent.get(`/api/projects/${proj.id}/comments`);
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body));
    assert.ok(res.body.length >= 1);
  });

  test('owner can filter comments by entityType and entityId', async () => {
    // Seed a project-level comment
    seedComment(ownerDd, proj.id, { entityType: 'project', entityId: proj.id, authorId: owner.id, text: 'Project note' });
    const res = await ownerAgent
      .get(`/api/projects/${proj.id}/comments?entityType=board&entityId=${board.id}`);
    assert.equal(res.status, 200);
    assert.ok(res.body.every(c => c.entityType === 'board' && c.entityId === board.id));
  });

  test('owner can edit own comment (text + visibility + includeInMemory)', async () => {
    // Get existing comment id
    const list = await ownerAgent
      .get(`/api/projects/${proj.id}/comments?entityType=board&entityId=${board.id}`);
    const cid = list.body[0].id;
    const res = await ownerAgent
      .patch(`/api/projects/${proj.id}/comments/${cid}`)
      .send({ text: 'Edited text', visibility: 'public', includeInMemory: true });
    assert.equal(res.status, 200);
    assert.equal(res.body.text, 'Edited text');
    assert.equal(res.body.visibility, 'public');
    assert.equal(res.body.includeInMemory, true);
    assert.ok(res.body.editedAt !== null);
  });

  test('owner can delete a comment', async () => {
    const c = seedComment(ownerDd, proj.id, { entityType: 'board', entityId: board.id, authorId: owner.id });
    const res = await ownerAgent.delete(`/api/projects/${proj.id}/comments/${c.id}`);
    assert.equal(res.status, 200);
    assert.equal(res.body.ok, true);
    const list = await ownerAgent.get(`/api/projects/${proj.id}/comments`);
    assert.ok(!list.body.some(x => x.id === c.id));
  });

  // ── Summary ────────────────────────────────────────────────────────────────

  test('GET /summary returns counts per entity', async () => {
    const res = await ownerAgent.get(`/api/projects/${proj.id}/comments/summary`);
    assert.equal(res.status, 200);
    const key = `board:${board.id}`;
    assert.ok(res.body[key] !== undefined, `summary must include ${key}`);
    assert.ok(typeof res.body[key].total === 'number');
  });

  // ── Visitor without allowComments → 403 ───────────────────────────────────

  test('visitor without allowComments gets 403 on POST', async () => {
    const res = await request(app)
      .post(`/api/projects/${proj.id}/comments`)
      .set('X-Share-Token', viewToken)
      .send({ entityType: 'board', entityId: board.id, text: 'Hi' });
    assert.equal(res.status, 403);
  });

  test('view token without allowComments: GET comments returns only public published', async () => {
    // Seed a private published + a pending comment
    seedComment(ownerDd, proj.id, { entityType: 'board', entityId: board.id, status: 'published', visibility: 'private' });
    seedComment(ownerDd, proj.id, { entityType: 'board', entityId: board.id, status: 'pending',   visibility: 'public'  });
    const res = await request(app)
      .get(`/api/projects/${proj.id}/comments`)
      .set('X-Share-Token', viewToken);
    assert.equal(res.status, 200);
    assert.ok(res.body.every(c => c.status === 'published' && c.visibility === 'public'));
  });

  // ── Visitor with allowComments ─────────────────────────────────────────────

  test('visitor with allowComments can POST a comment (→ pending)', async () => {
    const res = await request(app)
      .post(`/api/projects/${proj.id}/comments`)
      .set('X-Share-Token', viewTokenWithComments)
      .send({ entityType: 'board', entityId: board.id, text: 'Visitor says hi', authorName: 'Ana' });
    assert.equal(res.status, 200);
    assert.equal(res.body.authorType, 'visitor');
    assert.equal(res.body.status, 'pending');
    assert.equal(res.body.authorName, 'Ana');
    assert.equal(res.body.shareToken, viewTokenWithComments);
  });

  test('visitor cannot PATCH a comment', async () => {
    const list = await ownerAgent.get(`/api/projects/${proj.id}/comments`);
    const pending = list.body.find(c => c.status === 'pending');
    assert.ok(pending, 'should have a pending comment from previous test');
    const res = await request(app)
      .patch(`/api/projects/${proj.id}/comments/${pending.id}`)
      .set('X-Share-Token', viewTokenWithComments)
      .send({ text: 'hacked' });
    assert.equal(res.status, 403);
  });

  test('visitor cannot DELETE a comment', async () => {
    const list = await ownerAgent.get(`/api/projects/${proj.id}/comments`);
    const any = list.body[0];
    const res = await request(app)
      .delete(`/api/projects/${proj.id}/comments/${any.id}`)
      .set('X-Share-Token', viewTokenWithComments);
    assert.equal(res.status, 403);
  });

  // ── Moderation ─────────────────────────────────────────────────────────────

  test('GET /api/comments/pending returns pending comments for owner', async () => {
    const res = await ownerAgent.get('/api/comments/pending');
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body));
    assert.ok(res.body.every(c => c.status === 'pending'));
    assert.ok(res.body.length >= 1);
  });

  test('GET /api/comments/pending?count=1 returns {count}', async () => {
    const res = await ownerAgent.get('/api/comments/pending?count=1');
    assert.equal(res.status, 200);
    assert.ok(typeof res.body.count === 'number');
    assert.ok(res.body.count >= 1);
  });

  test('owner can approve a pending comment with visibility=public', async () => {
    const list = await ownerAgent.get('/api/comments/pending');
    const pending = list.body[0];
    const res = await ownerAgent
      .post(`/api/projects/${pending.projectId}/comments/${pending.id}/approve`)
      .send({ visibility: 'public' });
    assert.equal(res.status, 200);
    assert.equal(res.body.status, 'published');
    assert.equal(res.body.visibility, 'public');
  });

  test('approve with missing/bad visibility returns 400', async () => {
    // Seed a fresh pending comment
    const c = seedComment(ownerDd, proj.id, { entityType: 'board', entityId: board.id, status: 'pending', authorType: 'visitor' });
    const res = await ownerAgent
      .post(`/api/projects/${proj.id}/comments/${c.id}/approve`)
      .send({ visibility: 'invalid' });
    assert.equal(res.status, 400);
  });

  test('owner can reject a pending comment', async () => {
    const c = seedComment(ownerDd, proj.id, { entityType: 'board', entityId: board.id, status: 'pending', authorType: 'visitor' });
    const res = await ownerAgent
      .post(`/api/projects/${proj.id}/comments/${c.id}/reject`);
    assert.equal(res.status, 200);
    assert.equal(res.body.status, 'rejected');
  });

  // ── Cascade: photo delete ─────────────────────────────────────────────────

  test('deleting a photo hard-deletes its comments', async () => {
    const photoId = seedPhoto(ownerDd, proj.id);
    seedComment(ownerDd, proj.id, { entityType: 'photo', entityId: photoId, authorId: owner.id });
    await ownerAgent.delete(`/api/projects/${proj.id}/photos/${photoId}`);
    const res = await ownerAgent.get(`/api/projects/${proj.id}/comments?entityType=photo&entityId=${photoId}`);
    assert.equal(res.status, 200);
    assert.equal(res.body.length, 0);
  });

  // ── Cascade: board delete ─────────────────────────────────────────────────

  test('deleting a board removes its comments and item comments', async () => {
    const b2 = seedBoard(ownerDd, proj.id, { name: 'Board to delete' });
    const fakeItemId = 'fakeitem01';
    seedComment(ownerDd, proj.id, { entityType: 'board', entityId: b2.id, authorId: owner.id });
    seedComment(ownerDd, proj.id, { entityType: 'zone', entityId: fakeItemId, boardId: b2.id, authorId: owner.id });
    await ownerAgent.delete(`/api/projects/${proj.id}/boards/${b2.id}`);
    const res = await ownerAgent.get(`/api/projects/${proj.id}/comments`);
    assert.equal(res.status, 200);
    assert.ok(!res.body.some(c => c.entityId === b2.id && c.entityType === 'board'));
    assert.ok(!res.body.some(c => c.boardId === b2.id));
  });

  // ── inMemory filter ───────────────────────────────────────────────────────

  test('GET ?inMemory=1 returns only published includeInMemory comments', async () => {
    seedComment(ownerDd, proj.id, { entityType: 'board', entityId: board.id, status: 'published', includeInMemory: true, authorId: owner.id });
    seedComment(ownerDd, proj.id, { entityType: 'board', entityId: board.id, status: 'pending',   includeInMemory: true, authorId: owner.id });
    const res = await ownerAgent.get(`/api/projects/${proj.id}/comments?inMemory=1`);
    assert.equal(res.status, 200);
    assert.ok(res.body.every(c => c.includeInMemory === true && c.status === 'published'));
  });

  // ── allowComments on share token ──────────────────────────────────────────

  test('GET /api/share/:token returns allowComments field', async () => {
    const res = await request(app).get(`/api/share/${viewToken}`);
    assert.equal(res.status, 200);
    assert.equal(res.body.allowComments, false);
    const res2 = await request(app).get(`/api/share/${viewTokenWithComments}`);
    assert.equal(res.status, 200);
    assert.equal(res2.body.allowComments, true);
  });

  test('PATCH /api/projects/:pid/share/:role updates allowComments', async () => {
    // Create a fresh share
    await ownerAgent
      .post(`/api/projects/${proj.id}/share`)
      .send({ role: 'edit' });
    const before = await ownerAgent.get(`/api/projects/${proj.id}/share`);
    assert.equal(before.body.edit.allowComments, false);
    await ownerAgent
      .patch(`/api/projects/${proj.id}/share/edit`)
      .send({ allowComments: true });
    const after = await ownerAgent.get(`/api/projects/${proj.id}/share`);
    assert.equal(after.body.edit.allowComments, true);
  });
});
