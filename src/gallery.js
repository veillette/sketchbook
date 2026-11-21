import { drawing } from "./art.js";
import { arrow, h } from "./dom.js";
import { lessons } from "./lessons.js";

export const ALL_DRAWINGS = "All drawings";
const categories = [ALL_DRAWINGS, ...new Set(lessons.map(lesson => lesson.category))];
const howTo = [
  ["01", "Pick a little character", "Something that makes you smile."],
  ["02", "Follow one line at a time", "Your chalkboard or paper is the canvas."],
  ["03", "Make it your own", "Wobbly lines are welcome here."],
];

function lessonCard(lesson, index, saved) {
  const status = saved && !saved.completed && saved.step > 0
    ? `Continue at step ${saved.step + 1}`
    : "Beginner friendly";

  return h("a", { class: `lesson-card ${lesson.color}`, href: `#/${lesson.id}` },
    h("div", { class: "card-art" },
      h("span", { class: "card-number", "aria-hidden": "true" }, String(index + 1).padStart(2, "0")),
      drawing(lesson, { thumbnail: true }),
      saved?.completed ? h("span", { class: "completion-badge" }, "✓ Drawn") : null,
      h("span", { class: "card-arrow", "aria-hidden": "true" }, "↗")),
    h("div", { class: "card-info" },
      h("div", {},
        h("p", { class: "eyebrow" }, lesson.category),
        h("h3", {}, lesson.name)),
      h("span", { class: "card-steps" }, `${lesson.steps.length} steps`, h("span", {}, status))));
}

function hero(featured) {
  return h("section", { class: "hero", "aria-labelledby": "hero-title" },
    h("div", { class: "hero-copy" },
      h("p", { class: "eyebrow hero-eyebrow" },
        h("span", { class: "pill-dot", "aria-hidden": "true" }), "A small space to make things"),
      h("h1", { id: "hero-title" }, "Little lines.", h("br"), h("em", {}, "Big characters.")),
      h("p", { class: "hero-description" },
        "A cat starts with an ear. A flower starts with a circle. Learn to draw friendly little cartoons, one simple line at a time."),
      h("a", { class: "button primary", href: "#drawings" }, "Find your first drawing", arrow()),
      h("p", { class: "hero-footnote" }, "Chalk, pencil, or your favorite crayon. Just bring yourself.")),
    h("a", {
      class: "hero-board",
      href: `#/${featured.id}`,
      "aria-label": `Try ${featured.name}, a ${featured.steps.length}-step drawing lesson`,
    },
    h("span", { class: "board-tape", "aria-hidden": "true" }),
    h("div", { class: "board-topline" },
      h("span", {}, "TODAY’S LITTLE CREATION"), h("span", { "aria-hidden": "true" }, "✧")),
    drawing(featured, { finished: true }),
    h("span", { class: "hero-scribble", "aria-hidden": "true" }, "you can draw this!"),
    h("div", { class: "board-bottomline" },
      h("span", {}, "Meet your first drawing buddy"), h("span", { class: "board-play", "aria-hidden": "true" }, "↗"))));
}

function collection(progress, initialCategory, onCategoryChange) {
  const grid = h("div", { class: "lesson-grid" });
  const buttons = categories.map(category => h("button", {
    type: "button",
    class: "filter-chip",
    onclick: () => {
      filter(category);
      onCategoryChange(category);
    },
  }, category));

  function filter(category) {
    const cards = [];
    lessons.forEach((lesson, index) => {
      if (category === ALL_DRAWINGS || category === lesson.category) {
        cards.push(lessonCard(lesson, index, progress[lesson.id]));
      }
    });
    grid.replaceChildren(...cards);
    buttons.forEach((button, index) => {
      button.setAttribute("aria-pressed", String(categories[index] === category));
    });
  }

  filter(initialCategory);
  const completed = lessons.filter(lesson => progress[lesson.id]?.completed).length;
  return h("section", { class: "drawings-section", id: "drawings", "aria-labelledby": "drawings-title" },
    h("div", { class: "section-heading" },
      h("div", {},
        h("p", { class: "eyebrow" }, "Your next small adventure"),
        h("h2", { id: "drawings-title" }, "What shall we draw?")),
      h("p", { class: "collection-note" }, `${lessons.length} little lessons`, h("span", {}, `${completed} drawn by you`))),
    h("div", { class: "filter-row", role: "group", "aria-label": "Drawing categories" },
      buttons, h("span", { class: "filter-note" }, "All easy. All yours.")),
    grid);
}

export function createGallery(progress, category, onCategoryChange) {
  return [
    hero(lessons[0]),
    h("section", { class: "how-strip", "aria-label": "How it works" },
      howTo.map(([number, title, text]) => h("div", {},
        h("span", { class: "how-number" }, number),
        h("div", {}, h("h2", {}, title), h("p", {}, text))))),
    collection(progress, category, onCategoryChange),
    h("aside", { class: "encouragement" },
      h("span", { class: "encouragement-star", "aria-hidden": "true" }, "✳"),
      h("div", {},
        h("h2", {}, "A little wonky is a little wonderful."),
        h("p", {}, "There’s no perfect way to draw a cat. Go slowly, try again, and give your drawing a personality of its own.")),
      h("span", { class: "pencil-doodle", "aria-hidden": "true" }, "〰")),
  ];
}
