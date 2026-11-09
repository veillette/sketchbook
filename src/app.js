import { lessons } from "./lessons.js";
import { drawing } from "./art.js";
import { loadProgress, saveProgress, lessonFromHash, moveStep } from "./state.js";

const main = document.getElementById("main");
let progress = loadProgress();
let category = "All drawings";
let theme = "chalk";
let showFinished = false;
let celebrate = false;

function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (value === false || value == null) continue;
    if (key.startsWith("on")) el.addEventListener(key.slice(2).toLowerCase(), value);
    else el.setAttribute(key, value === true ? "" : String(value));
  }
  el.append(...children.flat(Infinity).filter((c) => c != null && c !== false));
  return el;
}
const arrow = () => h("span", { "aria-hidden": "true" }, "↗");
const completeCount = () => lessons.filter((lesson) => progress[lesson.id]?.completed).length;
function remember(lesson, step, completed = progress[lesson.id]?.completed === true) {
  progress[lesson.id] = { step, completed };
  saveProgress(progress);
}
function focusMain() { main.focus({ preventScroll: true }); }
function card(lesson, index) {
  const saved = progress[lesson.id];
  return h("a", { class: `lesson-card ${lesson.color}`, href: `#/${lesson.id}` },
    h("div", { class: "card-art" },
      h("span", { class: "card-number", "aria-hidden": "true" }, `0${index + 1}`),
      drawing(lesson, { thumbnail: true }),
      saved?.completed ? h("span", { class: "completion-badge" }, "✓ Drawn") : null,
      h("span", { class: "card-arrow", "aria-hidden": "true" }, "↗")),
    h("div", { class: "card-info" }, h("div", {}, h("p", { class: "eyebrow" }, lesson.category), h("h3", {}, lesson.name)),
      h("span", { class: "card-steps" }, `${lesson.steps.length} steps`, h("span", {}, saved && !saved.completed && saved.step > 0 ? `Continue at step ${saved.step + 1}` : "Beginner friendly"))));
}
function gallery() {
  const grid = h("div", { class: "lesson-grid" });
  const filterButtons = [];
  function filter() {
    grid.replaceChildren(...lessons.flatMap((lesson, index) => category === "All drawings" || category === lesson.category ? [card(lesson, index)] : []));
    filterButtons.forEach((button) => button.setAttribute("aria-pressed", String(button.textContent === category)));
  }
  for (const label of ["All drawings", "Animals", "Plants", "Characters"]) {
    filterButtons.push(h("button", { type: "button", class: "filter-chip", "aria-pressed": String(category === label), onclick: () => { category = label; filter(); } }, label));
  }
  filter();
  const featured = lessons[0];
  document.title = "Sketchbook — One line at a time";
  main.replaceChildren(
    h("section", { class: "hero", "aria-labelledby": "hero-title" },
      h("div", { class: "hero-copy" },
        h("p", { class: "eyebrow hero-eyebrow" }, h("span", { class: "pill-dot", "aria-hidden": "true" }), "A small space to make things"),
        h("h1", { id: "hero-title" }, "Little lines.", h("br"), h("em", {}, "Big characters.")),
        h("p", { class: "hero-description" }, "A cat starts with an ear. A flower starts with a circle. Learn to draw friendly little cartoons, one simple line at a time."),
        h("a", { class: "button primary", href: "#drawings" }, "Find your first drawing", arrow()),
        h("p", { class: "hero-footnote" }, "Chalk, pencil, or your favorite crayon. Just bring yourself.")),
      h("a", { class: "hero-board", href: "#/cat", "aria-label": `Try ${featured.name}, a ${featured.steps.length}-step drawing lesson` },
        h("span", { class: "board-tape", "aria-hidden": "true" }),
        h("div", { class: "board-topline" }, h("span", {}, "TODAY’S LITTLE CREATION"), h("span", { "aria-hidden": "true" }, "✧")),
        drawing(featured, { finished: true }),
        h("span", { class: "hero-scribble", "aria-hidden": "true" }, "you can draw this!"),
        h("div", { class: "board-bottomline" }, h("span", {}, "Meet your first drawing buddy"), h("span", { class: "board-play", "aria-hidden": "true" }, "↗")))),
    h("section", { class: "how-strip", "aria-label": "How it works" },
      [["01", "Pick a little character", "Something that makes you smile."], ["02", "Follow one line at a time", "Your chalkboard or paper is the canvas."], ["03", "Make it your own", "Wobbly lines are welcome here."]].map(([number, title, text]) => h("div", {}, h("span", { class: "how-number" }, number), h("div", {}, h("h2", {}, title), h("p", {}, text))))),
    h("section", { class: "drawings-section", id: "drawings", "aria-labelledby": "drawings-title" },
      h("div", { class: "section-heading" }, h("div", {}, h("p", { class: "eyebrow" }, "Your next small adventure"), h("h2", { id: "drawings-title" }, "What shall we draw?")),
        h("p", { class: "collection-note" }, `${lessons.length} little lessons`, h("span", {}, `${completeCount()} drawn by you`))),
      h("div", { class: "filter-row", role: "group", "aria-label": "Drawing categories" }, filterButtons, h("span", { class: "filter-note" }, "All easy. All yours.")),
      grid),
    h("aside", { class: "encouragement" }, h("span", { class: "encouragement-star", "aria-hidden": "true" }, "✳"), h("div", {}, h("h2", {}, "A little wonky is a little wonderful."), h("p", {}, "There’s no perfect way to draw a cat. Go slowly, try again, and give your drawing a personality of its own.")), h("span", { class: "pencil-doodle", "aria-hidden": "true" }, "〰")));
}

function renderLesson(lesson, restoreFocus = false) {
  const focused = document.activeElement?.id;
  const step = progress[lesson.id]?.step ?? 0;
  const current = lesson.steps[step];
  const isLast = step === lesson.steps.length - 1;
  document.title = `${lesson.name} — Sketchbook`;
  function setStep(next) {
    showFinished = false;
    celebrate = false;
    remember(lesson, next);
    renderLesson(lesson, true);
  }
  function next() {
    if (showFinished) return;
    if (isLast) {
      remember(lesson, step, true);
      celebrate = true;
      renderLesson(lesson);
      document.getElementById("finished-title")?.focus({ preventScroll: true });
    } else setStep(moveStep(lesson, step, 1));
  }
  const board = h("div", { class: `lesson-board ${theme === "paper" ? "paper-board" : ""}`, "aria-label": "Drawing reference" },
    h("div", { class: "lesson-board-top" }, h("span", {}, showFinished || celebrate ? "THE WHOLE LITTLE PICTURE" : `LINE ${String(step + 1).padStart(2, "0")} / ${lesson.steps.length}`), h("span", { "aria-hidden": "true" }, "✧")),
    drawing(lesson, { step, finished: showFinished || celebrate }),
    h("p", { class: "board-caption" }, showFinished || celebrate ? "Your lines. Your little character." : "The golden line is the one to add."));
  const instruction = celebrate
    ? h("section", { class: "instruction done-instruction", "aria-labelledby": "finished-title" }, h("span", { class: "done-star", "aria-hidden": "true" }, "✳"),
      h("p", { class: "eyebrow" }, "Look what you made"), h("h2", { id: "finished-title", tabindex: "-1" }, `You drew a ${lesson.noun}!`),
      h("p", {}, "Keep it simple, add a little color, or give your character a name. This one is yours."),
      h("div", { class: "finish-actions" }, h("button", { class: "button primary", type: "button", onclick: () => setStep(0) }, "Draw it again", h("span", { "aria-hidden": "true" }, "↺")), h("a", { class: "button secondary", href: "#drawings" }, "Pick another drawing", arrow())))
    : h("section", { class: "instruction", "aria-labelledby": "instruction-title" },
      h("div", { class: "instruction-topline" }, h("p", { class: "eyebrow" }, showFinished ? "A peek at the finish" : `Step ${step + 1} of ${lesson.steps.length}`), h("span", { class: "step-badge", "aria-hidden": "true" }, showFinished ? "✧" : String(step + 1).padStart(2, "0"))),
      h("div", { class: "instruction-copy", "aria-live": "polite", "aria-atomic": "true" }, h("h2", { id: "instruction-title" }, showFinished ? "Here’s where we’re headed." : current.instruction), h("p", {}, showFinished ? "Take a look at the finished character. When you’re ready, return to your current step." : current.tip)),
      h("div", { class: "take-time" }, h("span", { "aria-hidden": "true" }, "〰"), "No rush. Make this line, then come back for the next."),
      h("div", { class: "lesson-controls" },
        h("button", { id: "step-prev", class: "button secondary", type: "button", disabled: step === 0 || showFinished, onclick: () => setStep(moveStep(lesson, step, -1)) }, h("span", { "aria-hidden": "true" }, "←"), "Previous"),
        h("button", { id: "step-next", class: "button primary", type: "button", disabled: showFinished, onclick: next }, isLast ? "Finish drawing" : "Next line", h("span", { "aria-hidden": "true" }, "→"))),
      h("div", { class: "step-range" }, h("label", { for: "step-slider" }, "Your progress", h("span", {}, `${step + 1} / ${lesson.steps.length}`)),
        h("input", { id: "step-slider", type: "range", min: "1", max: String(lesson.steps.length), value: String(step + 1), disabled: showFinished, "aria-label": "Go to drawing step", "aria-valuetext": `Step ${step + 1}: ${current.instruction}`, onchange: (event) => setStep(Number(event.target.value) - 1) })),
      h("p", { class: "keyboard-hint" }, "On a keyboard? Use ← and → to move between lines."));
  main.replaceChildren(
    h("div", { class: "lesson-shell" },
      h("div", { class: "lesson-breadcrumb" }, h("a", { href: "#drawings" }, "← All drawings"), h("span", {}, `${lesson.category} / ${lesson.steps.length} simple steps`)),
      h("div", { class: "lesson-title-row" }, h("div", {}, h("p", { class: "eyebrow" }, "Let’s draw together"), h("h1", {}, lesson.name)),
        h("p", { class: "lesson-intro" }, lesson.intro)),
      h("div", { class: "lesson-workspace" },
        h("div", { class: "reference-column" }, board,
          h("div", { class: "reference-tools" },
            h("div", { class: "board-modes", role: "group", "aria-label": "Reference background" },
              [ ["chalk", "Chalkboard"], ["paper", "Paper"] ].map(([value, label]) => h("button", { type: "button", id: `mode-${value}`, "aria-pressed": String(theme === value), onclick: () => { theme = value; renderLesson(lesson, true); } }, label))),
            h("button", { type: "button", id: "show-finished", class: "text-button", "aria-pressed": String(showFinished), disabled: celebrate, onclick: () => { showFinished = !showFinished; renderLesson(lesson, true); } }, showFinished ? "← Back to my step" : "Peek at finished drawing"))),
        instruction),
      h("div", { class: "lesson-bottom" }, h("p", {}, "Draw on your chalkboard or paper. The screen is just your guide."),
        h("button", { type: "button", class: "text-button", onclick: () => setStep(0) }, "↺ Start over"))));
  if (restoreFocus && focused) {
    const target = document.getElementById(focused);
    if (target && !target.disabled) target.focus({ preventScroll: true });
  }
}
function route() {
  showFinished = false;
  celebrate = false;
  const lesson = lessonFromHash(location.hash);
  if (lesson) renderLesson(lesson); else gallery();
  focusMain();
  if (location.hash === "#drawings") document.getElementById("drawings")?.scrollIntoView();
  else scrollTo({ top: 0, behavior: "instant" });
}
window.addEventListener("hashchange", route);
window.addEventListener("keydown", (event) => {
  const lesson = lessonFromHash(location.hash);
  if (!lesson || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || celebrate || showFinished
    || event.target.closest("input, textarea, select, [contenteditable]")) return;
  if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
    event.preventDefault();
    const button = document.getElementById(event.key === "ArrowRight" ? "step-next" : "step-prev");
    if (!button.disabled) button.click();
  }
});
document.querySelector(".skip-link").addEventListener("click", (event) => { event.preventDefault(); focusMain(); main.scrollIntoView(); });
route();
