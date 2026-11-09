# Sketchbook

Learn to draw friendly cartoons, one line at a time. Follow the screen while drawing
with chalk on a real chalkboard, or with a pencil on paper. There is no on-screen tracing.

There are 56 original lessons across animals, plants, characters, objects and
nature, from cats and elephants to castles, rockets and rainbows. Each step adds one continuous stroke or closed shape. Earlier lines remain
visible; the new line is highlighted. Use Previous / Next, the progress slider,
or the left and right arrow keys. Peek at the finished example without changing
your step, switch the reference background between chalkboard and paper, and mark
a drawing finished. Progress and the chalkboard/paper preference stay in this
browser when storage is available.

## Development

Node.js 26 or newer. No npm dependencies or build framework are required.

```sh
npm run check          # unit tests and static build
python3 -m http.server 8000 --directory dist
```

Open http://localhost:8000. Hash-based lesson links also work on hosting under a
subdirectory. The test suite checks lesson content, cumulative strokes, navigation
boundaries, that every stroke stays inside the visible drawing area, asset
references and malformed/blocked saved progress. The build test writes to a
temporary directory, so `npm test` never touches `dist/`. The tests do not
replace browser, touch-device or visual layout checks.

## Files

- `src/lessons.js`, `src/more-lessons.js`: original SVG strokes, instructions and tips for 56 lessons.
- `src/art.js`: cumulative SVG rendering, current-line highlighting and the `VIEW_BOX` drawing area.
- `src/app.js`, `src/styles.css`: gallery, lesson experience and responsive styles.
- `src/state.js`: guarded local progress, board theme preference and navigation helpers.
- `src/swipe.js`: touch swipe detection for the reference board.
- `src/og-image.png`: 1200×630 social preview card.
- `tools/build.mjs`: copies the site into `dist/` (or the directory given as its first argument).

To add a lesson, give it a unique ID, category, color and a sequence of steps in
`lessons.js` or with `add()` in `more-lessons.js`. Keep each path continuous, with
one `M` command. Only the area inside `VIEW_BOX` (x 30–290, y 35–290) is visible,
so keep every stroke a few units inside it; the tests fail on anything that would
be clipped. Each step needs a concise instruction and its own specific tip;
`add()` throws if a tip is missing. Keep the figure simple enough to
copy with a broad piece of chalk. Run `npm run check` before publishing.

Artwork and lesson text are authored for this project. DM Sans and DM Serif Display
are self-hosted as WOFF2 files (`<family>-<weight>[-italic].woff2`), with their SIL Open Font Licenses in `src/fonts/`. Lesson progress and the reference board theme are local to each
browser; there are no accounts, trackers or server-side progress records.

## GitHub Pages

The **Publish to GitHub Pages** workflow runs tests and builds the static site on
pushes to `main`, then deploys only `dist/`. It can also be run manually from the
Actions tab. No npm installation or repository secrets are needed.

In **Settings → Pages**, select **GitHub Actions** as the build source. The public
site is https://veillette.github.io/sketchbook/. The workflow supplies `SITE_URL`
from Pages configuration so the canonical, `og:url` and `og:image` URLs match the
hosting URL, including its subdirectory or a configured custom domain. Relative
asset paths and hash-based lessons work under that subdirectory.

For a local build targeting another host, run `SITE_URL=https://example.com/sketchbook/ npm run build`. Builds without `SITE_URL` preserve the source metadata.
