import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createInterface } from 'node:readline/promises';

export const localOrigin = 'http://localhost:3000';
export const redirectUri = `${localOrigin}/api/auth/google/callback`;
const configPath = fileURLToPath(new URL('../.env.local', import.meta.url));

export function googleSettings(document) {
  const client = document?.web;
  if (!client || typeof client !== 'object') throw new Error('Choose the JSON downloaded for a Google OAuth Web application, not a service account or Desktop client.');
  if (typeof client.client_id !== 'string' || !/^[A-Za-z0-9_-]+\.apps\.googleusercontent\.com$/.test(client.client_id)) throw new Error('The downloaded file has no valid Google Client ID.');
  if (typeof client.client_secret !== 'string' || !/^[A-Za-z0-9_-]{8,512}$/.test(client.client_secret)) throw new Error('The downloaded file has no valid Client Secret. Download the JSON when creating your Google client.');
  if (!Array.isArray(client.redirect_uris) || !client.redirect_uris.includes(redirectUri)) throw new Error(`Add this exact Authorized redirect URI in Google Cloud, then download the client JSON again: ${redirectUri}`);
  return { GOOGLE_CLIENT_ID:client.client_id, GOOGLE_CLIENT_SECRET:client.client_secret, SITE_ORIGIN:localOrigin };
}

export function mergeSettings(source, settings) {
  const newline = source.includes('\r\n') ? '\r\n' : '\n';
  const remaining = new Map(Object.entries(settings));
  const lines = source.split(/\r?\n/);
  const result = [];
  for (const line of lines) {
    const match = line.match(/^\s*(?:export\s+)?(GOOGLE_CLIENT_ID|GOOGLE_CLIENT_SECRET|SITE_ORIGIN)\s*=/);
    if (!match) { result.push(line); continue; }
    if (remaining.has(match[1])) { result.push(`${match[1]}=${remaining.get(match[1])}`); remaining.delete(match[1]); }
    // Remove duplicate definitions so old credentials cannot override the new ones.
  }
  if (result.at(-1) === '') result.pop();
  for (const [name,value] of remaining) result.push(`${name}=${value}`);
  return result.join(newline) + newline;
}

export function configurationStatus(source) {
  const status = {};
  for (const name of ['GOOGLE_CLIENT_ID','GOOGLE_CLIENT_SECRET','SITE_ORIGIN']) {
    const match = source.match(new RegExp(`^[ \\t]*(?:export[ \\t]+)?${name}[ \\t]*=[ \\t]*([^\\r\\n]*)`, 'm'));
    status[name] = Boolean(match?.[1]?.trim().replace(/^(['"])(.*)\1$/, '$2'));
  }
  return status;
}

async function main() {
  const argument = process.argv[2];
  const source = existsSync(configPath) ? readFileSync(configPath, 'utf8') : '';
  if (argument === '--check') {
    for (const [name,present] of Object.entries(configurationStatus(source))) console.log(`${name}: ${present ? 'configured' : 'missing'}`);
    console.log('This checks local settings only, not Google consent or live sign-in.');
    return;
  }
  console.log('\nNapertskala - local Google sign-in setup');
  console.log('This imports a downloaded OAuth Web application JSON. No secrets are printed or sent online.');
  console.log(`Google Authorized redirect URI: ${redirectUri}`);
  let credentialsPath = argument;
  if (!credentialsPath) {
    if (!process.stdin.isTTY) throw new Error('Run setup-google.cmd interactively, or pass the path to your downloaded Google client JSON.');
    const input = createInterface({ input:process.stdin, output:process.stdout });
    try { credentialsPath = await input.question('\nPaste the path to the downloaded client JSON (not the secret itself): '); }
    finally { input.close(); }
  }
  const selectedPath = resolve(credentialsPath.trim().replace(/^"(.*)"$/, '$1'));
  let document;
  try { document = JSON.parse(readFileSync(selectedPath, 'utf8').replace(/^\uFEFF/, '')); }
  catch { throw new Error('Could not read a valid JSON file at that path. No settings were changed.'); }
  const settings = googleSettings(document);
  // Save only after validation. Preserve every unrelated environment setting.
  writeFileSync(configPath, mergeSettings(source, settings), { encoding:'utf8', mode:0o600 });
  console.log('\nSaved Google settings in site/.env.local. Existing users and passwords are unchanged.');
  console.log('Keep both .env.local and the downloaded JSON private. Never upload them or put them in public/.');
  console.log('Restart from PowerShell: .\\start-site.cmd restart');
  console.log('Then open http://localhost:3000/login in Chrome or Edge and choose Continue with Google.');
  console.log('Use the Google email already added in Admin > Users. Google sign-in does not grant new admin roles.\n');
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => { console.error(`Google setup: ${error.message}`); process.exitCode = 1; });
}
