'use strict';
const os     = require('os');
const fs     = require('fs');
const path   = require('path');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const TEST_PASSWORD = 'Test1234!';
// Cost 4 = fast for tests (still valid bcrypt)
const TEST_HASH = bcrypt.hashSync(TEST_PASSWORD, 4);

function makeTmpDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'tableau-test-'));
}

function removeTmpDir(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
}

// dd = the user's data dir (auth mode: DATA_DIR/userId, local mode: DATA_DIR)
function seedProject(dd, { id, name = 'Test Project' } = {}) {
  const projId    = id || uuidv4().replace(/-/g, '').slice(0, 10);
  const projsFile = path.join(dd, 'projects.json');
  fs.mkdirSync(dd, { recursive: true });
  const projs = fs.existsSync(projsFile) ? JSON.parse(fs.readFileSync(projsFile)) : [];
  const proj  = { id: projId, name, created: Date.now() };
  projs.push(proj);
  fs.writeFileSync(projsFile, JSON.stringify(projs));
  fs.mkdirSync(path.join(dd, projId, 'photos'), { recursive: true });
  fs.mkdirSync(path.join(dd, projId, 'boards'), { recursive: true });
  fs.writeFileSync(path.join(dd, projId, 'photos.json'), '[]');
  fs.writeFileSync(path.join(dd, projId, 'boards.json'), '[]');
  return proj;
}

function seedBoard(dd, pid, { id, name = 'Test Board', isPrivate = false } = {}) {
  const boardId  = id || uuidv4().replace(/-/g, '').slice(0, 10);
  const metaFile = path.join(dd, pid, 'boards.json');
  const boards   = fs.existsSync(metaFile) ? JSON.parse(fs.readFileSync(metaFile)) : [];
  const board    = { id: boardId, name, created: Date.now(), private: isPrivate };
  boards.push(board);
  fs.writeFileSync(metaFile, JSON.stringify(boards));
  fs.writeFileSync(path.join(dd, pid, 'boards', `${boardId}.json`), '[]');
  return board;
}

// Creates a user in globalDataDir/users.json and its data directory
function seedUser(globalDataDir, { id, username, email, role = 'user', quota = 100 * 1024 * 1024, expiresAt } = {}) {
  const userId    = id || uuidv4();
  const usersFile = path.join(globalDataDir, 'users.json');
  fs.mkdirSync(globalDataDir, { recursive: true });
  const users = fs.existsSync(usersFile) ? JSON.parse(fs.readFileSync(usersFile)) : [];
  const user  = {
    id: userId,
    username,
    email:              email || `${username}@test.com`,
    passwordHash:       TEST_HASH,
    quota,
    role,
    mustChangePassword: false,
    created:            Date.now(),
    ...(expiresAt !== undefined ? { expiresAt } : {}),
  };
  users.push(user);
  fs.writeFileSync(usersFile, JSON.stringify(users));
  fs.mkdirSync(path.join(globalDataDir, userId), { recursive: true });
  return user;
}

// Writes a share token entry to globalDataDir/shares.json
function seedShare(globalDataDir, { token, ownerId, projectId, role = 'view', allowComments = false, type, roomId }) {
  const sharesFile = path.join(globalDataDir, 'shares.json');
  const shares     = fs.existsSync(sharesFile) ? JSON.parse(fs.readFileSync(sharesFile)) : {};
  shares[token]    = { ownerId, projectId, role, allowComments, created: Date.now(),
    ...(type   ? { type }   : {}),
    ...(roomId ? { roomId } : {}),
  };
  fs.writeFileSync(sharesFile, JSON.stringify(shares));
}

// Seeds a comment record to dd/pid/comments.json
function seedComment(dd, pid, { id, entityType = 'board', entityId, boardId = null, authorType = 'owner',
  authorId = 'local', authorName = 'owner', text = 'Test comment', status = 'published',
  visibility = 'private', includeInMemory = false, shareToken = null } = {}) {
  const commentId   = id || uuidv4().replace(/-/g, '').slice(0, 12);
  const commentsFile = path.join(dd, pid, 'comments.json');
  const comments    = fs.existsSync(commentsFile) ? JSON.parse(fs.readFileSync(commentsFile)) : [];
  const comment     = { id: commentId, entityType, entityId, boardId, authorType, authorId, authorName,
    text, createdAt: Date.now(), editedAt: null, status, visibility, includeInMemory, shareToken };
  comments.push(comment);
  fs.writeFileSync(commentsFile, JSON.stringify(comments));
  return comment;
}

// Seeds a room entry to dd/pid/rooms.json
function seedRoom(dd, pid, { id, name = 'Test Room' } = {}) {
  const roomId    = id || uuidv4().replace(/-/g, '').slice(0, 10);
  const roomsFile = path.join(dd, pid, 'rooms.json');
  const rooms     = fs.existsSync(roomsFile) ? JSON.parse(fs.readFileSync(roomsFile)) : [];
  const room      = { id: roomId, name, walls: [], blocks: [], columns: [] };
  rooms.push(room);
  fs.writeFileSync(roomsFile, JSON.stringify(rooms));
  return room;
}

// Seeds a photo directly to disk (no sharp processing — for trash/restore tests)
function seedPhoto(dd, pid) {
  const photoId   = uuidv4().replace(/-/g, '').slice(0, 12);
  const photoDir  = path.join(dd, pid, 'photos');
  const metaFile  = path.join(dd, pid, 'photos.json');
  fs.mkdirSync(photoDir, { recursive: true });
  // Minimal JPEG: SOI + EOI (4 bytes — enough to exist, not parsed by trash logic)
  const fakeJpeg  = Buffer.from([0xFF, 0xD8, 0xFF, 0xD9]);
  fs.writeFileSync(path.join(photoDir, `${photoId}.jpg`),       fakeJpeg);
  fs.writeFileSync(path.join(photoDir, `${photoId}_thumb.jpg`), fakeJpeg);
  const photos = fs.existsSync(metaFile) ? JSON.parse(fs.readFileSync(metaFile)) : [];
  photos.push({ id: photoId, name: 'test.jpg', w: 1, h: 1, size: 4, created: Date.now() });
  fs.writeFileSync(metaFile, JSON.stringify(photos));
  return photoId;
}

module.exports = { makeTmpDir, removeTmpDir, seedUser, seedProject, seedBoard, seedRoom, seedShare, seedPhoto, seedComment, TEST_PASSWORD };
