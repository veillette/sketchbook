import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { lessons, lessonById } from '../src/lessons.js';
import { readProgress, lessonFromHash, moveStep } from '../src/state.js';
import { drawing } from '../src/art.js';

test('all requested subjects have complete, individually described strokes', () => {
  assert.equal(lessons.length, 56);
  for (const lesson of lessons) {
    assert.ok(lesson.steps.length >= 6 && lesson.steps.length <= 20);
    assert.equal(new Set(lesson.steps.map(s => s.path)).size, lesson.steps.length);
    for (const stroke of lesson.steps) {
      assert.match(stroke.path, /^M /);
      assert.equal((stroke.path.match(/M /g) ?? []).length, 1, 'one continuous stroke per step');
      assert.ok(stroke.instruction && stroke.tip);
      assert.doesNotMatch(stroke.path, /NaN|undefined|Infinity/);
    }
  }
  assert.equal(new Set(lessons.map(l => l.id)).size, lessons.length);
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
  assert.match(readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8'), /prefers-reduced-motion/);
});

test('fonts are self-hosted and include their redistribution licenses', () => {
  const css = readFileSync(new URL('../src/fonts.css', import.meta.url), 'utf8');
  const urls = [...css.matchAll(/url\(([^)]+)\)/g)].map(m => m[1]);
  assert.ok(urls.length);
  for (const url of urls) {
    assert.ok(url.startsWith('fonts/'));
    assert.ok(readFileSync(new URL(`../src/${url}`, import.meta.url)).length);
  }
  for (const family of ['dmsans', 'dmserifdisplay']) {
    assert.match(readFileSync(new URL(`../src/fonts/${family}-OFL.txt`, import.meta.url), 'utf8'), /SIL OPEN FONT LICENSE/);
  }
});
