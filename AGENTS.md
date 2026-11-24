# Working on Sketchbook

- Edit `src/`. `tools/build.mjs` generates `dist/` and its offline file list.
- Add original lessons in `src/lessons.js` or `src/more-lessons.js`. Keep IDs
  stable for links and saved progress. Each step adds one continuous stroke or
  closed shape and includes a specific instruction and tip.
- Keep strokes inside `VIEW_BOX` in `src/art.js`. `src/lesson-player.js`
  handles lesson interaction and `src/lesson-view.js` renders the lesson.
- Use Node.js 26. Run `npm run check` and
  `node .github/site-smoke.mjs dist --assets-only`. Preview `dist/` and check
  the changed lesson at phone and desktop widths.
- One-way sync from Origami: shared Pages CI, smoke tests, copy-link, PWA, and
  worker builders are edited in Origami, then copied here with
  `node tools/sync-site-helpers.mjs --write` from the Origami checkout. Do not
  patch those copies only in Sketchbook.
- `src/storage.js` is synced from aperitif `js/storage.js`. Edit storage there,
  then run the Origami sync script.
