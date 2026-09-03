import { randomBytes } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// This local, user-run helper never creates accounts or sends the setup key online.
const configPath = fileURLToPath(new URL('../.env.local', import.meta.url));
const source = existsSync(configPath) ? readFileSync(configPath, 'utf8') : '';
const setting = /^ADMIN_SETUP_TOKEN\s*=\s*(.*)$/m;
const existing = source.match(setting)?.[1]?.trim().replace(/^(['"])(.*)\1$/, '$2');
const token = existing && existing.length >= 32 ? existing : randomBytes(32).toString('hex');
if (token !== existing) {
  const line = `ADMIN_SETUP_TOKEN=${token}`;
  const updated = setting.test(source) ? source.replace(setting, line) : `${source}${source && !source.endsWith('\n') ? '\n' : ''}${line}\n`;
  writeFileSync(configPath, updated, { encoding: 'utf8', mode: 0o600 });
}
console.log('\nPrivate first-owner setup. Keep this key secret.');
console.log(`\nSetup key: ${token}`);
console.log('\n1. Restart the site: start-site.cmd restart');
console.log('2. Open http://localhost:3000/setup');
console.log('3. Enter this key and choose your owner email and password.');
console.log('\nSetup closes automatically after the first account exists.');
console.log('After setup, remove ADMIN_SETUP_TOKEN from site/.env.local and restart.');
console.log('Normal sign-in: http://localhost:3000/login\n');
