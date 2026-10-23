#!/usr/bin/env node
/**
 * Drops the Playwright auth-state cache so the next `playwright test` run
 * performs a fresh Firebase login in `globalSetup`.
 *
 * Usage: npm run test:e2e:auth
 */
import fs from 'fs';
import path from 'path';

const authDir = path.join(process.cwd(), '.auth');

if (fs.existsSync(authDir)) {
  fs.rmSync(authDir, { recursive: true, force: true });
  console.log('✓ Removed .auth/ — the next e2e run will sign in again.');
} else {
  console.log('✓ No .auth/ cache present — the next e2e run will sign in anyway.');
}
