#!/usr/bin/env node
/**
 * Google Search Console — one-command OAuth re-authorisation.
 *
 * Why this exists: the refresh token dies and the recovery has cost us whole
 * sessions of re-deriving the flow. It died again on 2026-09-02 (invalid_grant,
 * "Token has been expired or revoked"), and the previous grant was issued
 * 2026-08-21 — a 12-day life, consistent with the OAuth consent screen still
 * being in **Testing** status, where Google expires refresh tokens after 7 days.
 *
 * THE DURABLE FIX IS NOT THIS SCRIPT. Publish the consent screen:
 *   console.cloud.google.com/auth/audience  (project stellar-orb-506106-v3)
 *   → Audience → "PUBLISH APP" → confirm.
 * A readonly-scope app used by its own owner needs no verification review; the
 * unverified-app warning on the consent screen is expected, click Advanced →
 * Continue. Once published, refresh tokens stop expiring on the 7-day clock and
 * this script is needed only if the grant is revoked.
 *
 * Usage (needs a browser on this machine — representative's PC, weekdays 09-19):
 *   node scripts/gsc-auth.mjs
 *
 * It starts a loopback listener, prints a consent URL, waits for the redirect,
 * exchanges the code, and writes the token to BOTH projects that share this
 * client (epickor-blog and blog-news use the same client_id and token file).
 */

import { createServer } from 'http';
import { readFileSync, writeFileSync, existsSync, copyFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CLIENT_FILE = join(ROOT, 'secrets', 'gsc_oauth_client.json');
const TOKEN_FILE = join(ROOT, 'secrets', 'gsc_oauth_token.json');
const SIBLING_TOKEN = 'D:/dev/blog-news/secrets/gsc_oauth_token.json';
const SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly';

if (!existsSync(CLIENT_FILE)) {
  console.error(`Missing ${CLIENT_FILE}. The OAuth client JSON is gitignored; it is not recoverable from the repo.`);
  process.exit(1);
}
const conf = JSON.parse(readFileSync(CLIENT_FILE, 'utf8'));
const key = conf.installed || conf.web;
if (!key?.client_id || !key?.client_secret) {
  console.error('Client JSON has no installed/web credentials.');
  process.exit(1);
}

// --port pins the loopback port so a printed consent URL survives a restart of
// this listener. Any port works: the client is type "installed" with a bare
// http://localhost redirect, which Google matches on host, not port.
const portArg = process.argv.indexOf('--port');
const PORT = portArg !== -1 ? Number(process.argv[portArg + 1]) : 0;

const server = createServer();
server.on('error', (e) => {
  console.error(`Cannot listen on port ${PORT}: ${e.code}. Another listener may still be running.`);
  process.exit(1);
});
server.listen(PORT, '127.0.0.1', () => {
  const port = server.address().port;
  const redirectUri = `http://localhost:${port}`;
  const url =
    'https://accounts.google.com/o/oauth2/v2/auth?' +
    new URLSearchParams({
      client_id: key.client_id,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: SCOPE,
      access_type: 'offline',
      // force, not auto: without it Google returns an access token with NO
      // refresh_token when a grant already exists, and the file we write is
      // then useless in an hour.
      prompt: 'consent',
    });

  console.log('\n1) A browser window should open. If it does not, paste this URL:\n');
  console.log(url + '\n');
  console.log('2) Sign in as 5414peace@gmail.com — the account that owns the epickor.com property.');
  console.log('3) "Google hasn\'t verified this app" is expected while the consent screen is in Testing:');
  console.log('   Advanced → Go to ... (unsafe) → Continue.\n');
  console.log(`Waiting on ${redirectUri} ...`);

  // --no-open: print the URL and wait, without popping a window on the
  // representative's machine before they are ready for it.
  if (!process.argv.includes('--no-open')) {
    spawn('cmd', ['/c', 'start', '""', url.replace(/&/g, '^&')], { stdio: 'ignore', detached: true }).unref();
  }

  server.on('request', async (req, res) => {
    const q = new URL(req.url, redirectUri).searchParams;
    const code = q.get('code');
    const err = q.get('error');
    const done = (msg) => {
      res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(msg);
    };
    if (err) {
      done(`Denied: ${err}. You can close this tab.`);
      console.error(`\nConsent denied: ${err}`);
      server.close();
      process.exit(1);
    }
    if (!code) return done('No code in this request.');

    const body = new URLSearchParams({
      code,
      client_id: key.client_id,
      client_secret: key.client_secret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    });
    const r = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', body });
    const tok = await r.json();
    if (!r.ok || !tok.access_token) {
      done('Token exchange failed. See the terminal.');
      console.error('\nToken exchange failed:', JSON.stringify(tok));
      server.close();
      process.exit(1);
    }
    if (!tok.refresh_token) {
      done('Got an access token but no refresh token. See the terminal.');
      console.error('\nNo refresh_token returned — re-run; prompt=consent is required for one.');
      server.close();
      process.exit(1);
    }

    const out = {
      access_token: tok.access_token,
      refresh_token: tok.refresh_token,
      scope: tok.scope || SCOPE,
      expiry_date: Date.now() + (tok.expires_in ?? 3600) * 1000,
      created_at: new Date().toISOString(),
    };
    writeFileSync(TOKEN_FILE, JSON.stringify(out, null, 2));
    let sibling = '';
    try {
      if (existsSync(dirname(SIBLING_TOKEN))) {
        writeFileSync(SIBLING_TOKEN, JSON.stringify(out, null, 2));
        sibling = ` and ${SIBLING_TOKEN}`;
      }
    } catch { /* sibling project is optional */ }

    done('Authorised. You can close this tab and return to the terminal.');
    console.log(`\nWrote ${TOKEN_FILE}${sibling}`);
    console.log('Verify with:  node scripts/gsc-fetch.mjs --days 28');
    server.close();
    process.exit(0);
  });
});
