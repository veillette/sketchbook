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
  const worker = readFileSync(join(out, 'sw.js'), 'utf8');
  const precached = JSON.parse(worker.match(/^const files = (\[.*\]);$/m)[1]);
  for (const asset of ['index.html', 'app.js', 'copy-link.js', 'styles.css', 'manifest.webmanifest', 'icons/icon-512.png']) {
    assert.ok(precached.includes(asset), asset + ' is available offline');
  }
  assert.match(worker, /const cacheName = .*[0-9a-f]{16}/);
  assert.ok(html.includes('href="manifest.webmanifest"'));
  assert.ok(html.includes('<link rel="canonical" href="https://example.github.io/sketchbook/">'));
  assert.ok(html.includes('<meta property="og:url" content="https://example.github.io/sketchbook/">'));
  assert.ok(html.includes('<meta property="og:image" content="https://example.github.io/sketchbook/og-image.png">'));
  assert.doesNotMatch(html, /veillette\.github\.io/);
  assert.equal(readFileSync(new URL('src/index.html', root), 'utf8'), source);
  for (const asset of [
    'app.js', 'dom.js', 'gallery.js', 'lesson-player.js', 'lesson-view.js',
    'styles.css', 'gallery.css', 'lesson.css', 'fonts.css',
    'swipe.js', 'lessons.js', 'icon.svg', 'og-image.png',
  ]) {
    assert.ok(existsSync(join(out, asset)), asset);
  }
  assert.ok(html.includes('src="app.js"'));
  assert.ok(html.includes('href="fonts.css"'));
  assert.ok(html.includes('href="styles.css"'));
  assert.ok(html.includes('href="gallery.css"'));
  assert.ok(html.includes('href="lesson.css"'));
});
