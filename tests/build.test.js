import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';

const root = new URL('../', import.meta.url);
test('Pages build preserves relative assets and sets metadata for the deployed subpath', () => {
  const source = readFileSync(new URL('src/index.html', root), 'utf8');
  execFileSync(process.execPath, ['tools/build.mjs'], {
    cwd: root,
    env: { ...process.env, SITE_URL: 'https://example.github.io/sketchbook' },
  });
  const html = readFileSync(new URL('dist/index.html', root), 'utf8');
  assert.ok(html.includes('<link rel="canonical" href="https://example.github.io/sketchbook/">'));
  assert.ok(html.includes('<meta property="og:url" content="https://example.github.io/sketchbook/">'));
  assert.equal(readFileSync(new URL('src/index.html', root), 'utf8'), source);
  for (const asset of ['app.js', 'styles.css', 'fonts.css', 'swipe.js', 'lessons.js', 'icon.svg']) {
    assert.ok(existsSync(new URL(`dist/${asset}`, root)));
  }
  assert.ok(html.includes('src="app.js"'));
  assert.ok(html.includes('href="styles.css"'));
});
