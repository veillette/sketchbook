import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync, existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
test('Pages build preserves relative assets and sets metadata for the deployed subpath', (t) => {
  // Build into a temporary directory so running the tests never overwrites dist/.
  const out = mkdtempSync(join(tmpdir(), 'sketchbook-build-'));
  t.after(() => rmSync(out, { recursive: true, force: true }));
  const source = readFileSync(new URL('src/index.html', root), 'utf8');
  execFileSync(process.execPath, ['tools/build.mjs', out], {
    cwd: fileURLToPath(root),
    env: { ...process.env, SITE_URL: 'https://example.github.io/sketchbook' },
    stdio: 'pipe',
  });
  const html = readFileSync(join(out, 'index.html'), 'utf8');
  assert.ok(html.includes('<link rel="canonical" href="https://example.github.io/sketchbook/">'));
  assert.ok(html.includes('<meta property="og:url" content="https://example.github.io/sketchbook/">'));
  assert.ok(html.includes('<meta property="og:image" content="https://example.github.io/sketchbook/og-image.png">'));
  assert.doesNotMatch(html, /veillette\.github\.io/);
  assert.equal(readFileSync(new URL('src/index.html', root), 'utf8'), source);
  for (const asset of ['app.js', 'styles.css', 'fonts.css', 'swipe.js', 'lessons.js', 'icon.svg', 'og-image.png']) {
    assert.ok(existsSync(join(out, asset)), asset);
  }
  assert.ok(html.includes('src="app.js"'));
  assert.ok(html.includes('href="styles.css"'));
});
