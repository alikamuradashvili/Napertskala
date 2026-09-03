import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

const requireWrangler = createRequire(import.meta.resolve('wrangler/package.json'));
const { Miniflare } = requireWrangler('miniflare');
const { build } = requireWrangler('esbuild');
const key = 'a'.repeat(64);
const built = await build({
  stdin: { contents: `
    import { POST as register } from './app/api/auth/register/route';
    import { POST as login } from './app/api/auth/login/route';
    import { GET as me } from './app/api/auth/me/route';
    import { GET as admin } from './app/api/admin/route';
    import { GET as users, PATCH as manageUsers } from './app/api/admin/users/route';
    export default { async fetch(request) {
      const path = new URL(request.url).pathname;
      if (path === '/register') return register(request);
      if (path === '/login') return login(request);
      if (path === '/me') return me(request);
      if (path === '/admin') return admin(request);
      if (path === '/users') return request.method === 'PATCH' ? manageUsers(request) : users(request);
      return new Response('Not found', { status:404 });
    } };
  `, resolveDir:fileURLToPath(new URL('../', import.meta.url)), sourcefile:'auth-worker-test.ts', loader:'ts' },
  bundle:true, write:false, platform:'neutral', format:'esm', external:['cloudflare:workers'],
  tsconfig:fileURLToPath(new URL('../tsconfig.json', import.meta.url)),
});
const makeWorker = () => new Miniflare({ modules:true, script:built.outputFiles[0].text, compatibilityDate:'2025-01-01', d1Databases:['DB'], bindings:{ADMIN_SETUP_TOKEN:key} });
const send = (worker, path, body, cookie = '', method = 'POST') => worker.dispatchFetch(`http://localhost${path}`, { method, headers:{'content-type':'application/json',origin:'http://localhost',cookie}, body:JSON.stringify(body) });

test('real Worker: setup, regular-user login, promotion, disabling, deletion and owner guards', async () => {
  const worker = makeWorker();
  try {
    const created = await send(worker, '/register', {name:'Temporary test owner',email:'worker-owner@example.test',password:'test-owner-password-12345',setupKey:key});
    assert.equal(created.status, 201, await created.text());
    const loggedIn = await send(worker, '/login', {email:'worker-owner@example.test',password:'test-owner-password-12345'});
    assert.equal(loggedIn.status, 200, await loggedIn.text());
    const cookie = loggedIn.headers.get('set-cookie').split(';')[0];
    const identity = await (await worker.dispatchFetch('http://localhost/me', {headers:{cookie}})).json();
    assert.equal(identity.user.role, 'super_admin');
    assert.equal((await worker.dispatchFetch('http://localhost/admin', {headers:{cookie}})).status,200);
    assert.equal((await worker.dispatchFetch('http://localhost/admin')).status,401);
    const change = body => send(worker, '/users', body, cookie, 'PATCH');
    const newUser = {name:'Test User',email:'test-user@example.test',password:'test-user-password-12345'};
    const added = await change({action:'create_user',...newUser});
    assert.equal(added.status,201,await added.clone().text());
    const userId = (await added.json()).userId;
    let userLogin = await send(worker, '/login', newUser);
    assert.equal(userLogin.status,200);
    let userCookie = userLogin.headers.get('set-cookie').split(';')[0];
    assert.equal((await worker.dispatchFetch('http://localhost/admin',{headers:{cookie:userCookie}})).status,403);
    assert.equal((await change({action:'update_user',userId,role:'admin'})).status,200);
    assert.equal((await worker.dispatchFetch('http://localhost/admin',{headers:{cookie:userCookie}})).status,401);
    userLogin = await send(worker, '/login', newUser);
    userCookie = userLogin.headers.get('set-cookie').split(';')[0];
    assert.equal((await worker.dispatchFetch('http://localhost/admin',{headers:{cookie:userCookie}})).status,200);
    assert.equal((await worker.dispatchFetch('http://localhost/users',{headers:{cookie:userCookie}})).status,403);
    assert.equal((await send(worker,'/users',{action:'update_user',userId,role:'super_admin'},userCookie,'PATCH')).status,403);
    assert.equal((await change({action:'update_user',userId,status:'disabled'})).status,200);
    assert.equal((await send(worker,'/login',newUser)).status,401);
    assert.equal((await change({action:'update_user',userId,status:'active',role:'super_admin'})).status,200);
    assert.equal((await change({action:'delete_user',userId:identity.user.id})).status,400);
    assert.equal((await change({action:'delete_user',userId})).status,200);
    const db = await worker.getD1Database('DB');
    await assert.rejects(db.prepare("UPDATE users SET role='user' WHERE id=?").bind(identity.user.id).run(), /LAST_SUPER_ADMIN/);
    await assert.rejects(db.prepare('DELETE FROM users WHERE id=?').bind(identity.user.id).run(), /LAST_SUPER_ADMIN/);
    assert.equal((await db.prepare("SELECT COUNT(*) AS n FROM audit_log WHERE action='update_user'").first()).n,3);
  } finally { await worker.dispose(); }
});

test('real Worker: legacy migration preserves existing owner session, credentials and content', async () => {
  const worker = makeWorker();
  try {
    const db = await worker.getD1Database('DB');
    const token = 'b'.repeat(64), tokenHash = createHash('sha256').update(token).digest('hex');
    await db.batch([
      db.prepare("CREATE TABLE users(id TEXT PRIMARY KEY,email TEXT NOT NULL,name TEXT NOT NULL,password_hash TEXT,password_salt TEXT,google_sub TEXT,role TEXT NOT NULL CHECK(role IN ('admin','super_admin')),status TEXT NOT NULL DEFAULT 'active',created_at INTEGER NOT NULL,updated_at INTEGER NOT NULL)"),
      db.prepare('CREATE TABLE sessions(token_hash TEXT PRIMARY KEY,user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,expires_at INTEGER NOT NULL,created_at INTEGER NOT NULL)'),
      db.prepare("CREATE TABLE site_content(key TEXT PRIMARY KEY,value_ka TEXT NOT NULL DEFAULT '',value_en TEXT NOT NULL DEFAULT '',updated_by TEXT REFERENCES users(id),updated_at INTEGER NOT NULL)"),
      db.prepare("INSERT INTO users(id,email,name,password_hash,password_salt,role,created_at,updated_at) VALUES('owner','legacy@example.test','Existing Owner','saved-hash','saved-salt','super_admin',0,0)"),
      db.prepare("INSERT INTO sessions VALUES(?,'owner',?,0)").bind(tokenHash,Date.now()+600000),
      db.prepare("INSERT INTO site_content VALUES('hero','სათაური','Saved title','owner',0)"),
    ]);
    const cookie = `napertskala_session=${token}`;
    const response = await worker.dispatchFetch('http://localhost/users',{headers:{cookie}});
    assert.equal(response.status,200,await response.clone().text());
    assert.equal((await response.json()).users[0].role,'super_admin');
    assert.equal((await db.prepare("SELECT password_hash FROM users WHERE id='owner'").first()).password_hash,'saved-hash');
    assert.equal((await db.prepare('SELECT value_en FROM site_content').first()).value_en,'Saved title');
    const added = await send(worker,'/users',{action:'create_user',name:'Regular User',email:'regular@example.test',useGoogle:true},cookie,'PATCH');
    assert.equal(added.status,201,await added.text());
    assert.equal((await db.prepare("SELECT role FROM users WHERE email='regular@example.test'").first()).role,'user');
    // The saved migration is also safe after runtime initialization.
    const sql = readFileSync(new URL('../drizzle/0002_daffy_jack_power.sql',import.meta.url),'utf8');
    const statements = sql.split('--> statement-breakpoint').map(statement=>statement.trim()).filter(Boolean);
    await db.batch(statements.map(statement=>db.prepare(statement)));
    assert.equal((await worker.dispatchFetch('http://localhost/users',{headers:{cookie}})).status,200);
    assert.equal((await db.prepare('PRAGMA foreign_key_check').all()).results.length,0);
    await assert.rejects(db.prepare("DELETE FROM users WHERE id='owner'").run(), /LAST_SUPER_ADMIN/);
  } finally { await worker.dispose(); }
});
