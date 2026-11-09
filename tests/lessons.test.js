import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { lessons, lessonById } from '../src/lessons.js';
import { readProgress, readTheme, lessonFromHash, moveStep } from '../src/state.js';
import { drawing, VIEW_BOX } from '../src/art.js';

test('all requested subjects have complete, individually described strokes', () => {
  assert.equal(lessons.length, 56);
  for (const lesson of lessons) {
    assert.ok(lesson.steps.length >= 6 && lesson.steps.length <= 20);
    assert.equal(new Set(lesson.steps.map(s => s.path)).size, lesson.steps.length);
    for (const stroke of lesson.steps) {
      assert.match(stroke.path, /^M -?\d/);
      assert.equal((stroke.path.match(/[Mm]/g) ?? []).length, 1, `one continuous stroke per step: ${lesson.id}`);
      assert.ok(stroke.instruction && stroke.tip);
      assert.doesNotMatch(stroke.path, /NaN|undefined|Infinity/);
    }
    assert.equal(new Set(lesson.steps.map(s => s.tip)).size, lesson.steps.length, `every step in ${lesson.id} has its own tip`);
  }
  assert.equal(new Set(lessons.map(l => l.id)).size, lessons.length);
  // Shared helpers (eyes, smiles) may reuse a tip, but generic boilerplate should not creep back.
  const uses = new Map();
  for (const { tip } of lessons.flatMap(l => l.steps)) uses.set(tip, (uses.get(tip) ?? 0) + 1);
  for (const [tip, count] of uses) assert.ok(count <= 12, `tip used ${count} times: "${tip}"`);
});

// Samples M/L/Q/C/Z paths and the oval helper's relative-arc form, so a
// stroke that runs off the board (and gets clipped) fails here.
function strokeBounds(path) {
  const oval = path.match(/^M (\S+) (\S+) a (\S+) (\S+) 0 1 0 \S+ 0 a \S+ \S+ 0 1 0 \S+ 0$/);
  if (oval) {
    const [x, y, rx, ry] = oval.slice(1).map(Number);
    return { minX: x, maxX: x + 2 * rx, minY: y - ry, maxY: y + ry };
  }
  const tokens = path.match(/[A-Za-z]|-?\d*\.?\d+/g);
  const points = [];
  let i = 0, command, cx = 0, cy = 0;
  const num = () => Number(tokens[i++]);
  while (i < tokens.length) {
    if (/[A-Za-z]/.test(tokens[i])) command = tokens[i++];
    if (command === 'Z') continue;
    if (command === 'M' || command === 'L') { cx = num(); cy = num(); points.push([cx, cy]); continue; }
    const controls = command === 'Q' ? 2 : command === 'C' ? 3 : 0;
    assert.ok(controls, `unsupported path command ${command} in ${path}`);
    const p = [[cx, cy]];
    for (let k = 0; k < controls; k++) p.push([num(), num()]);
    for (let t = 0; t <= 1; t += 0.02) {
      let level = p;
      while (level.length > 1) level = level.slice(1).map((q, k) => [level[k][0] + (q[0] - level[k][0]) * t, level[k][1] + (q[1] - level[k][1]) * t]);
      points.push(level[0]);
    }
    [cx, cy] = p.at(-1);
  }
  const xs = points.map(q => q[0]), ys = points.map(q => q[1]);
  return { minX: Math.min(...xs), maxX: Math.max(...xs), minY: Math.min(...ys), maxY: Math.max(...ys) };
}

test('every stroke stays inside the visible drawing area', () => {
  const [x, y, width, height] = VIEW_BOX;
  const margin = 3; // room for half the stroke width
  for (const lesson of lessons) {
    for (const stroke of lesson.steps) {
      const b = strokeBounds(stroke.path);
      const where = `${lesson.id}: "${stroke.instruction}"`;
      assert.ok(b.minX >= x + margin && b.maxX <= x + width - margin, `${where} runs off the side (x ${b.minX.toFixed(1)}–${b.maxX.toFixed(1)})`);
      assert.ok(b.minY >= y + margin && b.maxY <= y + height - margin, `${where} runs off the top or bottom (y ${b.minY.toFixed(1)}–${b.maxY.toFixed(1)})`);
    }
  }
});

test('saved progress handles missing, malformed, stale and out-of-range data', () => {
  const read = (value) => readProgress({ getItem: () => value });
  for (const value of [null, '{', 'null', '[]', '42', '"cat"']) assert.deepEqual(read(value), {});
  assert.deepEqual(readProgress({ getItem() { throw new Error('blocked'); } }), {});
  assert.deepEqual(read(JSON.stringify({ cat: { step: -7, completed: true }, dog: { step: 999, completed: 'true' }, removed: { step: 1 } })), {
    cat: { step: 0, completed: true }, dog: { step: lessonById.get('dog').steps.length - 1, completed: false },
  });
  assert.equal(read('{"cat":{"step":2.5}}').cat.step, 0);
});

test('board theme preference defaults to chalk and only accepts paper', () => {
  assert.equal(readTheme({ getItem: () => null }), 'chalk');
  assert.equal(readTheme({ getItem: () => 'chalk' }), 'chalk');
  assert.equal(readTheme({ getItem: () => 'paper' }), 'paper');
  assert.equal(readTheme({ getItem: () => 'slate' }), 'chalk');
  assert.equal(readTheme({ getItem() { throw new Error('blocked'); } }), 'chalk');
});

test('lesson navigation resolves URLs and stops at the first and last strokes', () => {
  for (const lesson of lessons) {
    assert.equal(lessonFromHash(`#/${lesson.id}`), lesson);
    assert.equal(moveStep(lesson, 0, -1), 0);
    assert.equal(moveStep(lesson, lesson.steps.length - 1, 1), lesson.steps.length - 1);
    assert.equal(moveStep(lesson, 0, 1), 1);
  }
  for (const hash of ['', '#drawings', '#/unknown', '#main']) assert.equal(lessonFromHash(hash), null);
});

test('art accumulates exactly one stroke and highlights only the current stroke', (t) => {
  const prior = globalThis.document;
  globalThis.document = { createElementNS(ns, tag) {
    return { tag, attrs: {}, children: [], setAttribute(k, v) { this.attrs[k] = v; }, append(child) { this.children.push(child); } };
  } };
  t.after(() => { if (prior) globalThis.document = prior; else delete globalThis.document; });
  for (const lesson of lessons) {
    for (let step = 0; step < lesson.steps.length; step++) {
      const svg = drawing(lesson, { step });
      assert.equal(svg.children.length, step + 1);
      assert.equal(svg.children.filter(p => p.attrs.class.includes('new-stroke')).length, 1);
      assert.equal(svg.children.at(-1).attrs.d, lesson.steps[step].path);
      assert.ok(svg.attrs['aria-label'].includes(`step ${step + 1}`));
    }
    for (const options of [{ finished: true, step: 0 }, { thumbnail: true }]) {
      const svg = drawing(lesson, options);
      assert.equal(svg.children.length, lesson.steps.length);
      assert.ok(svg.children.every(p => p.attrs.class === 'stroke'));
    }
  }
});

test('static entrypoint uses relative, packaged assets and reduced-motion styles', () => {
  const html = readFileSync(new URL('../src/index.html', import.meta.url), 'utf8');
  for (const asset of ['styles.css', 'app.js', 'icon.svg']) {
    assert.ok(html.includes(`"${asset}"`));
    assert.ok(readFileSync(new URL(`../src/${asset}`, import.meta.url)).length);
  }
  assert.match(html, /canonical" href="https:\/\/veillette\.github\.io\/sketchbook\/"/);
  assert.match(html, /og:url" content="https:\/\/veillette\.github\.io\/sketchbook\/"/);
  assert.match(html, /og:image" content="https:\/\/veillette\.github\.io\/sketchbook\/og-image\.png"/);
  const png = readFileSync(new URL('../src/og-image.png', import.meta.url));
  assert.equal(png.toString('latin1', 1, 4), 'PNG');
  assert.deepEqual([png.readUInt32BE(16), png.readUInt32BE(20)], [1200, 630], 'og:image is 1200×630');
  assert.match(html, /id="announcer"[^>]*aria-live="polite"/, 'step announcements live outside the re-rendered <main>');
  assert.doesNotMatch(html, /chatgpt\.site/);
  const css = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');
  assert.match(css, /prefers-reduced-motion/);
  for (const color of ['peach', 'butter', 'lilac', 'sage', 'pink', 'blue']) {
    assert.match(css, new RegExp(`\\.${color} \\.card-art\\{`));
  }
});

test('fonts are self-hosted and include their redistribution licenses', () => {
  const css = readFileSync(new URL('../src/fonts.css', import.meta.url), 'utf8');
  const urls = [...css.matchAll(/url\(([^)]+)\)/g)].map(m => m[1]);
  assert.ok(urls.length);
  for (const url of urls) {
    assert.match(url, /^fonts\/[a-z]+-\d{3}(-italic)?\.woff2$/);
    assert.equal(readFileSync(new URL(`../src/${url}`, import.meta.url)).toString('latin1', 0, 4), 'wOF2');
  }
  for (const family of ['dmsans', 'dmserifdisplay']) {
    assert.match(readFileSync(new URL(`../src/fonts/${family}-OFL.txt`, import.meta.url), 'utf8'), /SIL OPEN FONT LICENSE/);
  }
});
