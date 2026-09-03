import { test } from 'node:test';
import assert from 'node:assert/strict';
import { googleSettings, mergeSettings, configurationStatus, redirectUri } from '../scripts/setup-google.mjs';

const client = { web:{client_id:'123-test.apps.googleusercontent.com',client_secret:'test-only-secret-12345',redirect_uris:[redirectUri]} };

test('imports only a Web client with the exact local redirect URL', () => {
  assert.deepEqual(googleSettings(client), {GOOGLE_CLIENT_ID:client.web.client_id,GOOGLE_CLIENT_SECRET:client.web.client_secret,SITE_ORIGIN:'http://localhost:3000'});
  assert.throws(() => googleSettings({installed:client.web}), /Web application/);
  assert.throws(() => googleSettings({web:{...client.web,redirect_uris:['http://localhost:3000/wrong']}}), /exact Authorized redirect URI/);
});

test('rejects missing secrets and values that could inject environment settings', () => {
  for (const client_secret of ['',null,'abc\nADMIN_SETUP_TOKEN=injected','secret$EXPAND','secret#comment']) {
    assert.throws(() => googleSettings({web:{...client.web,client_secret}}), /Client Secret/);
  }
  assert.throws(() => googleSettings({web:{...client.web,client_id:'not-a-google-client'}}), /Client ID/);
});

test('preserves unrelated private settings and removes duplicate Google definitions', () => {
  const source = '# Keep this comment\r\nADMIN_SETUP_TOKEN=keep-private\r\nGOOGLE_CLIENT_ID=old\r\nGOOGLE_CLIENT_SECRET=old\r\nGOOGLE_CLIENT_SECRET=duplicate\r\nOTHER_TOKEN=keep-this-too\r\nSITE_ORIGIN=http://old.example\r\n';
  const updated = mergeSettings(source, googleSettings(client));
  assert.ok(updated.includes('# Keep this comment\r\nADMIN_SETUP_TOKEN=keep-private\r\n'));
  assert.ok(updated.includes('OTHER_TOKEN=keep-this-too\r\n'));
  assert.equal(updated.match(/GOOGLE_CLIENT_SECRET=/g).length,1);
  assert.equal(updated.includes('old'),false);
  assert.deepEqual(configurationStatus(updated), {GOOGLE_CLIENT_ID:true,GOOGLE_CLIENT_SECRET:true,SITE_ORIGIN:true});
});

test('check reports missing and blank values without exposing any secrets', () => {
  assert.deepEqual(configurationStatus('GOOGLE_CLIENT_ID=""\nGOOGLE_CLIENT_SECRET=\nSITE_ORIGIN=http://localhost:3000\n'), {GOOGLE_CLIENT_ID:false,GOOGLE_CLIENT_SECRET:false,SITE_ORIGIN:true});
  assert.equal(JSON.stringify(configurationStatus(mergeSettings('',googleSettings(client)))).includes(client.web.client_secret),false);
});
