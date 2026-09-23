import { after, beforeEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

// Execute the real route/authorization code against a disposable, in-memory D1 adapter.
// These tests never read local secrets, connect to Google, or create real site accounts.
const sqlite = new DatabaseSync(':memory:');
const DB = {
  prepare(sql) {
    let values = [];
    const statement = {
      bind(...args) { values = args; return statement; },
      async first() { return sqlite.prepare(sql).get(...values) ?? null; },
      async all() { return { results: sqlite.prepare(sql).all(...values) }; },
      async run() { return { meta: sqlite.prepare(sql).run(...values) }; },
      execute() { return { meta: sqlite.prepare(sql).run(...values) }; },
    };
    return statement;
  },
  async batch(statements) {
    sqlite.exec('BEGIN');
    try { const result = statements.map(statement => statement.execute()); sqlite.exec('COMMIT'); return result; }
    catch (error) { sqlite.exec('ROLLBACK'); throw error; }
  },
};
const env = { DB, ADMIN_SETUP_TOKEN: '', GOOGLE_CLIENT_ID: 'test-client', GOOGLE_CLIENT_SECRET: 'test-secret' };
globalThis.__napertskalaAuthTest = { env, headers: new Headers() };

const cache = new Map();
function moduleUrl(path) {
  if (cache.has(path)) return cache.get(path);
  let source = readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
  source = source.replace(/import \{ env \} from 'cloudflare:workers';/g, 'const { env } = globalThis.__napertskalaAuthTest;');
  source = source.replace(/from '@\/lib\/([a-z-]+)'/g, (_, name) => `from '${moduleUrl(`lib/${name}.ts`)}'`);
  source = source.replace("import { headers } from 'next/headers';", 'const headers = async () => globalThis.__napertskalaAuthTest.headers;');
  source = source.replace("import { redirect } from 'next/navigation';", 'const redirect = (location) => { throw Object.assign(new Error("Redirect"), { location }); };');
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX }, fileName: path }).outputText;
  const url = `data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`;
  cache.set(path, url);
  return url;
}
const server = await import(moduleUrl('lib/server.ts'));
const { canAccessAdmin } = await import(moduleUrl('lib/access.ts'));
const register = await import(moduleUrl('app/api/auth/register/route.ts'));
const login = await import(moduleUrl('app/api/auth/login/route.ts'));
const logout = await import(moduleUrl('app/api/auth/logout/route.ts'));
const admin = await import(moduleUrl('app/api/admin/route.ts'));
const media = await import(moduleUrl('app/api/admin/media/route.ts'));
const publicSite = await import(moduleUrl('app/api/site/route.ts'));
const google = await import(moduleUrl('app/api/auth/google/callback/route.ts'));
const googleStart = await import(moduleUrl('app/api/auth/google/start/route.ts'));
const { default: adminLayout } = await import(moduleUrl('app/admin/layout.tsx'));
const { default: usersLayout } = await import(moduleUrl('app/admin/users/layout.tsx'));
const usersApi = await import(moduleUrl('app/api/admin/users/route.ts'));
const { userGuardStatements, userRoleMigration } = await import(moduleUrl('lib/user-schema.ts'));

function request(path, method = 'GET', body, cookie = '') {
  return new Request(`http://localhost:3000${path}`, { method, headers: { origin: 'http://localhost:3000', cookie, ...(body ? { 'Content-Type': 'application/json' } : {}) }, ...(body ? { body: JSON.stringify(body) } : {}) });
}
async function addUser(role = 'admin', status = 'active', email = 'admin@example.test', googleSub = null) {
  const id = crypto.randomUUID();
  const password = 'test-password-12345';
  const { hash, salt } = await server.hashPassword(password);
  // A synthetic unknown role verifies fail-closed authorization.
  sqlite.exec('PRAGMA ignore_check_constraints=ON');
  try { sqlite.prepare('INSERT INTO users(id,email,name,password_hash,password_salt,role,status,google_sub,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?)').run(id,email,'Test account',hash,salt,role,status,googleSub,Date.now(),Date.now()); }
  finally { sqlite.exec('PRAGMA ignore_check_constraints=OFF'); }
  return { id, email, password, role, status };
}
async function cookieFor(user) { return (await server.createSession(user.id)).cookie.split(';')[0]; }
async function withGoogleProfile(profile, action) {
  const original = globalThis.fetch;
  globalThis.fetch = async (url) => Response.json(String(url).includes('/tokeninfo') ? profile : { id_token: 'test-id-token' });
  try { return await action(); } finally { globalThis.fetch = original; }
}
function googleRequest() { return request('/api/auth/google/callback?state=test-state&code=test-code', 'GET', undefined, 'napertskala_oauth_state=test-state'); }

beforeEach(async () => {
  await server.getDb();
  sqlite.exec('DROP TRIGGER IF EXISTS protect_last_super_admin_delete');
  sqlite.exec('DELETE FROM audit_log; DELETE FROM gallery_items; DELETE FROM media; DELETE FROM site_content; DELETE FROM settings; DELETE FROM sessions; DELETE FROM users;');
  for (const sql of userGuardStatements) sqlite.exec(sql);
  env.ADMIN_SETUP_TOKEN = '';
  globalThis.__napertskalaAuthTest.headers = new Headers();
});
after(() => { sqlite.close(); delete globalThis.__napertskalaAuthTest; });

test('only active, explicitly authorized admin roles can see administration', () => {
  for (const user of [null, {}, { role: 'customer', status: 'active' }, { role: 'admin', status: 'disabled' }, { role: 'super_admin', status: 'disabled' }]) assert.equal(canAccessAdmin(user), false);
  assert.equal(canAccessAdmin({ role: 'admin', status: 'active' }), true);
  assert.equal(canAccessAdmin({ role: 'super_admin', status: 'active' }), true);
});

test('anonymous page access redirects and every admin API rejects anonymous calls', async () => {
  await assert.rejects(adminLayout({ children: 'private content' }), (error) => error.location === '/login');
  assert.equal((await admin.GET(request('/api/admin'))).status, 401);
  assert.equal((await admin.PATCH(request('/api/admin', 'PATCH', { action: 'save_content', items: [] }))).status, 401);
  assert.equal((await media.POST(request('/api/admin/media', 'POST'))).status, 401);
  assert.equal((await media.DELETE(request('/api/admin/media?id=test', 'DELETE'))).status, 401);
});

test('malformed, forged and expired session cookies cannot enter the panel', async () => {
  for (const cookie of ['napertskala_session=%E0%A4%A', 'napertskala_session=admin', `napertskala_session=${'a'.repeat(64)}`]) assert.equal(await server.currentUser(request('/admin', 'GET', undefined, cookie)), null);
  const user = await addUser();
  const cookie = await cookieFor(user);
  sqlite.prepare('UPDATE sessions SET expires_at=0').run();
  globalThis.__napertskalaAuthTest.headers = new Headers({ cookie });
  await assert.rejects(adminLayout({ children: 'private content' }), (error) => error.location === '/login');
});

test('password login creates a session and active admins can access the panel and API', async () => {
  for (const role of ['admin', 'super_admin']) {
    const user = await addUser(role, 'active', `${role}@example.test`);
    const response = await login.POST(request('/api/auth/login', 'POST', { email: user.email, password: user.password }));
    assert.equal(response.status, 200);
    const cookie = response.headers.get('set-cookie').split(';')[0];
    globalThis.__napertskalaAuthTest.headers = new Headers({ cookie });
    assert.equal(await adminLayout({ children: 'private content' }), 'private content');
    assert.equal((await admin.GET(request('/api/admin', 'GET', undefined, cookie))).status, 200);
  }
});

test('administrators assign photos to separate public service galleries', async () => {
  const user = await addUser('admin');
  const cookie = await cookieFor(user);
  sqlite.prepare("INSERT INTO media(id,object_key,filename,content_type,size,created_at) VALUES('weld-photo','weld-object','weld.jpg','image/jpeg',10,1)").run();
  sqlite.prepare("INSERT INTO media(id,object_key,filename,content_type,size,created_at) VALUES('electric-photo','electric-object','electric.jpg','image/jpeg',10,2)").run();
  for (const [mediaId, gallery] of [['weld-photo','welding'],['electric-photo','electrical']]) {
    const response = await admin.PATCH(request('/api/admin','PATCH',{action:'assign_gallery',mediaId,gallery},cookie));
    assert.equal(response.status,200,await response.clone().text());
  }
  assert.equal((await admin.PATCH(request('/api/admin','PATCH',{action:'assign_gallery',mediaId:'electric-photo',gallery:'unknown'},cookie))).status,400);
  const payload = await (await publicSite.GET()).json();
  assert.equal(payload.galleries.welding[0].id,'weld-photo');
  assert.equal(payload.galleries.electrical[0].id,'electric-photo');
  assert.deepEqual(payload.gallery,payload.galleries.welding,'The legacy welding gallery stays compatible with the homepage');
});

test('disabled and non-admin accounts cannot log in or reuse a session for admin access', async () => {
  for (const [role, status] of [['admin', 'disabled'], ['customer', 'active']]) {
    const user = await addUser(role, status, `${role}@example.test`);
    const response = await login.POST(request('/api/auth/login', 'POST', { email: user.email, password: user.password }));
    assert.equal(response.status, 401);
    const cookie = await cookieFor(user);
    globalThis.__napertskalaAuthTest.headers = new Headers({ cookie });
    await assert.rejects(adminLayout({ children: 'private content' }), (error) => error.location === '/login');
    assert.ok([401,403].includes((await admin.GET(request('/api/admin', 'GET', undefined, cookie))).status));
  }
});

test('ordinary admins cannot create or promote administrators', async () => {
  const user = await addUser();
  const cookie = await cookieFor(user);
  assert.equal((await admin.PATCH(request('/api/admin', 'PATCH', { action: 'create_user', email: 'another@example.test' }, cookie))).status, 403);
});

test('first-owner signup is denied without the configured private setup key', async () => {
  const body = { name: 'Site owner', email: 'owner@example.test', password: 'test-password-12345' };
  assert.equal((await register.POST(request('/api/auth/register', 'POST', body))).status, 403);
  env.ADMIN_SETUP_TOKEN = 'a'.repeat(64);
  assert.equal((await register.POST(request('/api/auth/register', 'POST', { ...body, setupKey: 'b'.repeat(64) }))).status, 403);
  assert.equal(sqlite.prepare('SELECT COUNT(*) AS count FROM users').get().count, 0);
});

test('private setup creates exactly one owner, including simultaneous attempts', async () => {
  env.ADMIN_SETUP_TOKEN = 'a'.repeat(64);
  const body = { name: 'Site owner', email: 'owner@example.test', password: 'test-password-12345', setupKey: env.ADMIN_SETUP_TOKEN };
  const responses = await Promise.all([register.POST(request('/api/auth/register', 'POST', body)), register.POST(request('/api/auth/register', 'POST', { ...body, email: 'second@example.test' }))]);
  assert.deepEqual(responses.map((response) => response.status).sort(), [201,403]);
  assert.equal(sqlite.prepare('SELECT COUNT(*) AS count FROM users').get().count, 1);
});

test('Google never turns the first visitor into an owner', async () => {
  const profile = { sub: 'unknown-google', email: 'stranger@example.test', aud: env.GOOGLE_CLIENT_ID, email_verified: 'true' };
  const response = await withGoogleProfile(profile, () => google.GET(googleRequest()));
  assert.equal(new URL(response.headers.get('location')).pathname, '/login');
  assert.equal(response.headers.get('set-cookie'), null);
  assert.equal(sqlite.prepare('SELECT COUNT(*) AS count FROM users').get().count, 0);
});

test('configured Google sign-in redirects to Google with state and only identity scopes', async () => {
  const first = await googleStart.GET(request('/api/auth/google/start'));
  const second = await googleStart.GET(request('/api/auth/google/start'));
  assert.equal(first.status,302);
  const target = new URL(first.headers.get('location'));
  assert.equal(target.origin,'https://accounts.google.com');
  assert.equal(target.searchParams.get('client_id'),env.GOOGLE_CLIENT_ID);
  assert.equal(target.searchParams.get('redirect_uri'),'http://localhost:3000/api/auth/google/callback');
  assert.equal(target.searchParams.get('scope'),'openid email profile');
  assert.equal(target.searchParams.get('response_type'),'code');
  assert.equal(target.searchParams.has('client_secret'),false);
  assert.match(first.headers.get('set-cookie'),/HttpOnly; SameSite=Lax/);
  assert.equal(first.headers.get('set-cookie').includes('; Secure'),false,'Local HTTP OAuth state cookies must remain usable on localhost');
  assert.ok(first.headers.get('set-cookie').includes(target.searchParams.get('state')));
  assert.notEqual(target.searchParams.get('state'),new URL(second.headers.get('location')).searchParams.get('state'));
});

test('missing Google configuration and invalid callbacks cannot create a session', async () => {
  const secret = env.GOOGLE_CLIENT_SECRET;
  try {
    env.GOOGLE_CLIENT_SECRET = '';
    const response = await googleStart.GET(request('/api/auth/google/start'));
    assert.equal(new URL(response.headers.get('location')).searchParams.get('error'),'google_unavailable');
  } finally { env.GOOGLE_CLIENT_SECRET = secret; }
  const response = await google.GET(request('/api/auth/google/callback?state=wrong&code=test-code','GET',undefined,'napertskala_oauth_state=correct'));
  assert.equal(new URL(response.headers.get('location')).pathname,'/login');
  assert.equal(response.headers.get('set-cookie'),null);
});

test('Google sign-in accepts an approved account and rejects a conflicting Google identity', async () => {
  const user = await addUser('admin');
  const profile = { sub: 'approved-google', email: user.email, aud: env.GOOGLE_CLIENT_ID, email_verified: 'true' };
  const accepted = await withGoogleProfile(profile, () => google.GET(googleRequest()));
  assert.equal(new URL(accepted.headers.get('location')).pathname, '/admin');
  assert.ok(accepted.headers.get('set-cookie'));
  const rejected = await withGoogleProfile({ ...profile, sub: 'different-google' }, () => google.GET(googleRequest()));
  assert.equal(new URL(rejected.headers.get('location')).pathname, '/login');
  assert.equal(rejected.headers.get('set-cookie'), null);
});

test('Google Super Admin callback issues a redirect-compatible session and grants panel access', async () => {
  const owner = await addUser('super_admin', 'active', 'google-owner@example.test');
  const response = await withGoogleProfile({sub:'google-owner',email:owner.email,aud:env.GOOGLE_CLIENT_ID,email_verified:'true'}, () => google.GET(googleRequest()));
  assert.equal(response.status,302);
  assert.equal(new URL(response.headers.get('location')).pathname,'/admin');
  const cookies = response.headers.getSetCookie();
  const session = cookies.find(cookie => cookie.startsWith('napertskala_session='));
  assert.ok(session);
  assert.match(session,/; HttpOnly; Secure; SameSite=Lax;/, 'A top-level redirect from Google must be able to send the new session');
  assert.equal(session.includes('SameSite=Strict'),false);
  assert.ok(cookies.some(cookie => cookie.startsWith('napertskala_oauth_state=;') && cookie.includes('Max-Age=0')));
  assert.equal(response.headers.get('cache-control'),'no-store');
  const cookie = session.split(';')[0];
  const user = await server.currentUser(request('/admin','GET',undefined,cookie));
  assert.equal(user.id,owner.id);
  assert.equal(user.role,'super_admin');
  globalThis.__napertskalaAuthTest.headers = new Headers({cookie});
  assert.equal(await adminLayout({children:'admin panel'}),'admin panel');
  assert.equal((await usersApi.GET(request('/api/admin/users','GET',undefined,cookie))).status,200);
});

test('redirect-compatible cookies retain cross-origin write protection and can be logged out', async () => {
  const user = await addUser('super_admin');
  const session = await server.createSession(user.id);
  assert.match(session.cookie,/SameSite=Lax/);
  const cookie = session.cookie.split(';')[0];
  for (const [handler,path,method,body] of [
    [logout.POST,'/api/auth/logout','POST',{}],
    [admin.PATCH,'/api/admin','PATCH',{action:'save_content',items:[]}],
    [usersApi.PATCH,'/api/admin/users','PATCH',{action:'delete_user',userId:user.id}],
  ]) {
    const forged = request(path,method,body,cookie);
    forged.headers.set('origin','https://other.example');
    assert.equal((await handler(forged)).status,403);
  }
  const response = await logout.POST(request('/api/auth/logout','POST',{},cookie));
  assert.equal(response.status,200);
  assert.match(response.headers.get('set-cookie'),/HttpOnly; Secure; SameSite=Lax; Max-Age=0/);
  assert.equal(await server.currentUser(request('/admin','GET',undefined,cookie)),null);
});

const changeUser = (cookie, body) => usersApi.PATCH(request('/api/admin/users', 'PATCH', body, cookie));

test('Users page and directory are restricted to Super Admins', async () => {
  assert.equal((await usersApi.GET(request('/api/admin/users'))).status, 401);
  assert.equal((await changeUser('', { action:'create_user' })).status, 401);
  await assert.rejects(usersLayout({ children:'users' }), error => error.location === '/login');
  for (const role of ['user','admin','super_admin']) {
    const user = await addUser(role, 'active', `${role}@example.test`);
    const cookie = await cookieFor(user);
    globalThis.__napertskalaAuthTest.headers = new Headers({ cookie });
    if (role === 'super_admin') assert.equal(await usersLayout({ children:'users' }), 'users');
    else await assert.rejects(usersLayout({ children:'users' }), error => error.location === (role === 'admin' ? '/admin' : '/login'));
    const response = await usersApi.GET(request('/api/admin/users', 'GET', undefined, cookie));
    assert.equal(response.status, role === 'super_admin' ? 200 : 403);
    if (response.ok) {
      const body = await response.json();
      assert.equal(body.users.length, 3);
      for (const row of body.users) {
        assert.equal('password_hash' in row, false);
        assert.equal('password_salt' in row, false);
        assert.equal('google_sub' in row, false);
      }
    }
    if (role === 'admin') assert.equal('users' in await (await admin.GET(request('/api/admin', 'GET', undefined, cookie))).json(), false);
  }
});

test('Super Admin creates a user, promotes and demotes them, disables and re-enables login', async () => {
  const owner = await addUser('super_admin');
  const cookie = await cookieFor(owner);
  const account = { name:'New User', email:'new@example.test', password:'test-new-password-12345' };
  const created = await changeUser(cookie, { action:'create_user', ...account });
  assert.equal(created.status, 201, await created.clone().text());
  const userId = (await created.json()).userId;
  assert.equal(sqlite.prepare('SELECT role FROM users WHERE id=?').get(userId).role, 'user');
  const signIn = () => login.POST(request('/api/auth/login', 'POST', account));
  let response = await signIn();
  assert.equal(response.status, 200);
  let userCookie = response.headers.get('set-cookie').split(';')[0];
  assert.equal((await admin.GET(request('/api/admin', 'GET', undefined, userCookie))).status, 403);
  assert.equal((await changeUser(cookie, { action:'update_user', userId, role:'admin' })).status, 200);
  assert.equal(await server.currentUser(request('/api/auth/me', 'GET', undefined, userCookie)), null);
  response = await signIn(); userCookie = response.headers.get('set-cookie').split(';')[0];
  assert.equal((await admin.GET(request('/api/admin', 'GET', undefined, userCookie))).status, 200);
  assert.equal((await changeUser(cookie, { action:'update_user', userId, status:'disabled' })).status, 200);
  assert.equal((await signIn()).status, 401);
  assert.equal(await server.currentUser(request('/api/auth/me', 'GET', undefined, userCookie)), null);
  assert.equal((await changeUser(cookie, { action:'update_user', userId, status:'active', role:'user' })).status, 200);
  assert.equal((await signIn()).status, 200);
  assert.equal(await server.currentUser(request('/api/auth/me', 'GET', undefined, userCookie)), null, 'Re-enabling must not resurrect old sessions');
  assert.equal(sqlite.prepare("SELECT COUNT(*) AS n FROM audit_log WHERE target_id=? AND action='update_user'").get(userId).n, 3);
});

test('regular users and ordinary admins cannot mutate users through either API', async () => {
  const owner = await addUser('super_admin', 'active', 'owner@example.test');
  for (const role of ['user','admin']) {
    const user = await addUser(role, 'active', `${role}@example.test`);
    const cookie = await cookieFor(user);
    for (const body of [{ action:'create_user', name:'Intruder', email:'intruder@example.test', role:'super_admin', useGoogle:true }, { action:'update_user', userId:user.id, role:'super_admin' }, { action:'update_user', userId:owner.id, status:'disabled' }, { action:'delete_user', userId:owner.id }]) {
      assert.equal((await changeUser(cookie, body)).status, 403);
      assert.equal((await admin.PATCH(request('/api/admin', 'PATCH', body, cookie))).status, 403);
    }
  }
  assert.equal(sqlite.prepare('SELECT COUNT(*) AS n FROM users').get().n, 3);
});

test('invalid roles, statuses, duplicate emails and foreign origins are rejected', async () => {
  const owner = await addUser('super_admin');
  const cookie = await cookieFor(owner);
  const user = await addUser('user', 'active', 'regular@example.test');
  for (const changes of [{role:'owner'}, {status:'blocked'}, {role:23}, {role:{}}, {status:[]}]) {
    assert.equal((await changeUser(cookie, { action:'update_user', userId:user.id, ...changes })).status, 400);
    assert.equal((await changeUser(cookie, { action:'create_user', name:'Test User', email:'valid@example.test', useGoogle:true, ...changes })).status, 400);
  }
  assert.equal((await changeUser(cookie, {action:'create_user', name:'Duplicate', email:' REGULAR@example.test ', useGoogle:true})).status, 409);
  assert.equal((await changeUser(cookie, {action:'create_user', name:'Test User', email:'bad@example.test', password:'short'})).status, 400);
  assert.equal((await changeUser(cookie, {action:'update_user', userId:'missing', role:'admin'})).status, 404);
  const forged = request('/api/admin/users', 'PATCH', {action:'delete_user', userId:user.id}, cookie);
  forged.headers.set('origin','https://untrusted.example');
  assert.equal((await usersApi.PATCH(forged)).status, 403);
});

test('own account and last active Super Admin are protected, including direct database writes', async () => {
  const owner = await addUser('super_admin');
  const cookie = await cookieFor(owner);
  for (const changes of [{action:'update_user', role:'user'}, {action:'update_user', status:'disabled'}, {action:'delete_user'}]) {
    assert.equal((await changeUser(cookie, {userId:owner.id, ...changes})).status, 400);
  }
  await addUser('super_admin', 'disabled', 'disabled-owner@example.test');
  assert.throws(() => sqlite.prepare("UPDATE users SET role='admin' WHERE id=?").run(owner.id), /LAST_SUPER_ADMIN/);
  assert.throws(() => sqlite.prepare("UPDATE users SET status='disabled' WHERE id=?").run(owner.id), /LAST_SUPER_ADMIN/);
  assert.throws(() => sqlite.prepare('DELETE FROM users WHERE id=?').run(owner.id), /LAST_SUPER_ADMIN/);
  assert.equal(sqlite.prepare("SELECT COUNT(*) AS n FROM users WHERE role='super_admin' AND status='active'").get().n, 1);
});

test('concurrent Super Admin demotions cannot remove all owners or use stale authority', async () => {
  const first = await addUser('super_admin');
  const second = await addUser('super_admin', 'active', 'second@example.test');
  const firstCookie = await cookieFor(first), secondCookie = await cookieFor(second);
  const responses = await Promise.all([
    changeUser(firstCookie, {action:'update_user', userId:second.id, role:'admin'}),
    changeUser(secondCookie, {action:'update_user', userId:first.id, role:'admin'}),
  ]);
  assert.equal(responses.filter(response => response.status === 200).length, 1);
  assert.equal(sqlite.prepare("SELECT COUNT(*) AS n FROM users WHERE role='super_admin' AND status='active'").get().n, 1);
});

test('deleting a user preserves their photos and content and removes sessions', async () => {
  const owner = await addUser('super_admin');
  const cookie = await cookieFor(owner);
  const user = await addUser('admin', 'active', 'editor@example.test');
  const oldCookie = await cookieFor(user);
  sqlite.prepare("INSERT INTO site_content(key,value_ka,value_en,updated_by,updated_at) VALUES('test','ტექსტი','Text',?,0)").run(user.id);
  sqlite.prepare("INSERT INTO settings(key,value,updated_by,updated_at) VALUES('phone','123',?,0)").run(user.id);
  sqlite.prepare("INSERT INTO media(id,object_key,filename,content_type,size,uploaded_by,created_at) VALUES('photo','object','photo.jpg','image/jpeg',10,?,0)").run(user.id);
  await server.audit(user.id, 'save_content', 'site');
  assert.equal((await changeUser(cookie, {action:'delete_user', userId:user.id})).status, 200);
  assert.equal(sqlite.prepare('SELECT id FROM users WHERE id=?').get(user.id), undefined);
  assert.equal(await server.currentUser(request('/api/auth/me','GET',undefined,oldCookie)), null);
  assert.equal(sqlite.prepare("SELECT value_en,updated_by FROM site_content WHERE key='test'").get().value_en, 'Text');
  assert.equal(sqlite.prepare("SELECT uploaded_by FROM media WHERE id='photo'").get().uploaded_by, null);
  assert.equal(sqlite.prepare("SELECT action FROM audit_log WHERE target_id=?").get(user.id).action, 'delete_user');
});

test('approved Google-only regular users sign in to the public site, not the panel', async () => {
  const owner = await addUser('super_admin');
  const cookie = await cookieFor(owner);
  assert.equal((await changeUser(cookie, {action:'create_user', name:'Google User', email:'google@example.test', useGoogle:true})).status, 201);
  assert.equal(sqlite.prepare("SELECT password_hash FROM users WHERE email='google@example.test'").get().password_hash, null);
  const response = await withGoogleProfile({sub:'regular-google',email:'google@example.test',aud:env.GOOGLE_CLIENT_ID,email_verified:'true'}, () => google.GET(googleRequest()));
  assert.equal(new URL(response.headers.get('location')).pathname, '/');
  assert.ok(response.headers.get('set-cookie'));
});

test('role migration preserves owner credentials and all foreign-key references', () => {
  const db = new DatabaseSync(':memory:');
  try {
    db.exec("PRAGMA foreign_keys=ON; CREATE TABLE users(id TEXT PRIMARY KEY,role TEXT NOT NULL CHECK(role IN ('admin','super_admin')),status TEXT,password_hash TEXT); CREATE INDEX idx_users_role_status ON users(role,status); CREATE TABLE sessions(user_id TEXT REFERENCES users(id) ON DELETE CASCADE); CREATE TABLE content(updated_by TEXT REFERENCES users(id)); INSERT INTO users VALUES('owner','super_admin','active','existing-hash'); INSERT INTO sessions VALUES('owner'); INSERT INTO content VALUES('owner'); BEGIN;");
    for (const sql of userRoleMigration) db.exec(sql);
    db.exec('COMMIT');
    assert.equal(db.prepare('SELECT password_hash FROM users').get().password_hash, 'existing-hash');
    assert.equal(db.prepare('SELECT role FROM users').get().role, 'super_admin');
    assert.equal(db.prepare('SELECT COUNT(*) AS n FROM sessions').get().n, 1);
    assert.equal(db.prepare('SELECT COUNT(*) AS n FROM content').get().n, 1);
    db.exec("INSERT INTO users(id,status) VALUES('regular','active')");
    assert.equal(db.prepare("SELECT role FROM users WHERE id='regular'").get().role, 'user');
    assert.deepEqual(db.prepare('PRAGMA foreign_key_check').all(), []);
  } finally { db.close(); }
});
