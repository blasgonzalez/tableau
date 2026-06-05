#!/usr/bin/env node
// Gestión de usuarios Tableau
// Uso: node scripts/user.js <comando> [args]
//
//   add    <username> <password> [quota_mb] [email]  — crear usuario (quota por defecto: 25 MB)
//   remove <username>                                 — eliminar usuario y sus datos
//   passwd <username> <new_password>                  — cambiar contraseña
//   quota  <username> <quota_mb>                      — cambiar cuota
//   email  <username> <email>                         — cambiar email
//   list                                              — listar usuarios
//   info   <username>                                 — detalle de un usuario

'use strict';
try { require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') }); } catch {}
const fs      = require('fs');
const path    = require('path');
const bcrypt  = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const DATA_DIR   = process.env.TABLEAU_DATA_DIR || path.join(__dirname, '..', 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

const MB = 1024 * 1024;

function loadUsers() {
  if (!fs.existsSync(USERS_FILE)) return [];
  return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
}

function saveUsers(users) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

function dirSize(dir) {
  if (!fs.existsSync(dir)) return 0;
  let total = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) total += dirSize(p);
    else total += fs.statSync(p).size;
  }
  return total;
}

function fmtBytes(b) {
  if (b < 1024) return b + ' B';
  if (b < MB)   return (b / 1024).toFixed(1) + ' KB';
  return (b / MB).toFixed(1) + ' MB';
}

const [,, cmd, ...args] = process.argv;

switch (cmd) {
  case 'add': {
    const [username, password, quotaMb, email, role] = args;
    if (!username || !password) { console.error('Uso: add <username> <password> [quota_mb] [email] [admin]'); process.exit(1); }
    const users = loadUsers();
    if (users.find(u => u.username === username)) { console.error(`Usuario '${username}' ya existe`); process.exit(1); }
    const quota = Math.round((parseFloat(quotaMb) || 25) * MB);
    const hash  = bcrypt.hashSync(password, 10);
    const isAdmin = role === 'admin';
    // mustChangePassword solo si se crea desde backoffice, no desde CLI
    const user  = { id: uuidv4(), username, passwordHash: hash, quota, ...(email ? { email } : {}), role: isAdmin ? 'admin' : 'user', created: Date.now() };
    users.push(user);
    saveUsers(users);
    fs.mkdirSync(path.join(DATA_DIR, user.id), { recursive: true });
    console.log(`✓ Usuario '${username}' creado (cuota: ${fmtBytes(quota)}${email ? `, email: ${email}` : ''}${isAdmin ? ', rol: admin' : ''})`);
    break;
  }
  case 'remove': {
    const [username] = args;
    if (!username) { console.error('Uso: remove <username>'); process.exit(1); }
    const users = loadUsers();
    const idx   = users.findIndex(u => u.username === username);
    if (idx === -1) { console.error(`Usuario '${username}' no encontrado`); process.exit(1); }
    const user  = users[idx];
    const dir   = path.join(DATA_DIR, user.id);
    users.splice(idx, 1);
    saveUsers(users);
    if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
    console.log(`✓ Usuario '${username}' eliminado`);
    break;
  }
  case 'passwd': {
    const [username, newPass] = args;
    if (!username || !newPass) { console.error('Uso: passwd <username> <new_password>'); process.exit(1); }
    const users = loadUsers();
    const user  = users.find(u => u.username === username);
    if (!user) { console.error(`Usuario '${username}' no encontrado`); process.exit(1); }
    user.passwordHash = bcrypt.hashSync(newPass, 10);
    saveUsers(users);
    console.log(`✓ Contraseña de '${username}' actualizada`);
    break;
  }
  case 'quota': {
    const [username, quotaMb] = args;
    if (!username || !quotaMb) { console.error('Uso: quota <username> <quota_mb>'); process.exit(1); }
    const users = loadUsers();
    const user  = users.find(u => u.username === username);
    if (!user) { console.error(`Usuario '${username}' no encontrado`); process.exit(1); }
    user.quota = Math.round(parseFloat(quotaMb) * MB);
    saveUsers(users);
    console.log(`✓ Cuota de '${username}' actualizada a ${fmtBytes(user.quota)}`);
    break;
  }
  case 'expire': {
    const [username, dateStr] = args;
    if (!username) { console.error('Uso: expire <username> <YYYY-MM-DD|none>'); process.exit(1); }
    const users = loadUsers();
    const user  = users.find(u => u.username === username);
    if (!user) { console.error(`Usuario '${username}' no encontrado`); process.exit(1); }
    if (!dateStr || dateStr === 'none') {
      delete user.expiresAt;
      saveUsers(users);
      console.log(`✓ Fecha de expiración eliminada para '${username}'`);
    } else {
      const ts = new Date(dateStr).getTime();
      if (isNaN(ts)) { console.error('Fecha inválida. Usa formato YYYY-MM-DD'); process.exit(1); }
      user.expiresAt = ts;
      saveUsers(users);
      console.log(`✓ '${username}' expira el ${new Date(ts).toLocaleDateString('es-ES')}`);
    }
    break;
  }
  case 'role': {
    const [username, role] = args;
    if (!username || !['admin','user'].includes(role)) { console.error('Uso: role <username> admin|user'); process.exit(1); }
    const users = loadUsers();
    const user  = users.find(u => u.username === username);
    if (!user) { console.error(`Usuario '${username}' no encontrado`); process.exit(1); }
    user.role = role;
    saveUsers(users);
    console.log(`✓ Rol de '${username}' actualizado a ${role}`);
    break;
  }
  case 'email': {
    const [username, email] = args;
    if (!username || !email) { console.error('Uso: email <username> <email>'); process.exit(1); }
    const users = loadUsers();
    const user  = users.find(u => u.username === username);
    if (!user) { console.error(`Usuario '${username}' no encontrado`); process.exit(1); }
    user.email = email;
    saveUsers(users);
    console.log(`✓ Email de '${username}' actualizado a ${email}`);
    break;
  }
  case 'list': {
    const users = loadUsers();
    if (!users.length) { console.log('(sin usuarios)'); break; }
    console.log('\nUsuario           Cuota      Usado      Email                Creado');
    console.log('─'.repeat(78));
    for (const u of users) {
      const used = dirSize(path.join(DATA_DIR, u.id));
      const pct  = u.quota ? Math.round(used / u.quota * 100) : 0;
      const date = new Date(u.created).toLocaleDateString('es-ES');
      console.log(
        u.username.padEnd(18) +
        fmtBytes(u.quota).padEnd(11) +
        `${fmtBytes(used)} (${pct}%)`.padEnd(16) +
        (u.email || '—').padEnd(21) +
        date
      );
    }
    console.log();
    break;
  }
  case 'info': {
    const [username] = args;
    if (!username) { console.error('Uso: info <username>'); process.exit(1); }
    const users = loadUsers();
    const user  = users.find(u => u.username === username);
    if (!user) { console.error(`Usuario '${username}' no encontrado`); process.exit(1); }
    const used = dirSize(path.join(DATA_DIR, user.id));
    console.log(`\nUsuario : ${user.username}`);
    console.log(`ID      : ${user.id}`);
    if (user.email) console.log(`Email   : ${user.email}`);
    console.log(`Cuota   : ${fmtBytes(user.quota)}`);
    console.log(`Usado   : ${fmtBytes(used)} (${Math.round(used / user.quota * 100)}%)`);
    console.log(`Creado  : ${new Date(user.created).toLocaleString('es-ES')}\n`);
    break;
  }
  default:
    console.log(`
Uso: node scripts/user.js <comando> [args]

  add    <username> <password> [quota_mb] [email]  crear usuario (defecto: 25 MB)
  remove <username>                                 eliminar usuario y sus datos
  passwd <username> <new_password>                  cambiar contraseña
  quota  <username> <quota_mb>                      cambiar cuota
  email  <username> <email>                         cambiar email
  list                                              listar todos los usuarios
  info   <username>                                 detalle de un usuario
`);
}
