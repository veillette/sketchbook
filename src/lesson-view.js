import { drawing } from "./art.js";
import { arrow, h } from "./dom.js";
import { setupSwipe } from "./swipe.js";

const stepNumber = step => String(step + 1).padStart(2, "0");

function referenceBoard(lesson, { step, theme, mode }, onSwipe) {
  const finished = mode !== "steps";
  const board = h("div", {
    class: theme === "paper" ? "lesson-board paper-board" : "lesson-board",
    "aria-label": "Drawing reference",
  },
  h("div", { class: "lesson-board-top" },
    h("span", {}, finished ? "THE WHOLE LITTLE PICTURE" : `LINE ${stepNumber(step)} / ${lesson.steps.length}`),
    h("span", { "aria-hidden": "true" }, "✧")),
  drawing(lesson, { step, finished }),
  h("p", { class: "board-caption" }, finished
    ? "Your lines. Your little character."
    : ["Add the golden line.", h("span", { class: "swipe-hint" }, " Swipe left for the next line, right to go back.")]));
  setupSwipe(board, onSwipe);
  return board;
}

function referenceTools({ theme, mode }, { onThemeChange, onPreview }) {
  const preview = mode === "preview";
  const themes = [["chalk", "Chalkboard"], ["paper", "Paper"]];
  return h("div", { class: "reference-tools" },
    h("div", { class: "board-modes", role: "group", "aria-label": "Reference background" },
      themes.map(([value, label]) => h("button", {
        type: "button",
        id: `mode-${value}`,
        "aria-pressed": String(theme === value),
        onclick: () => onThemeChange(value),
      }, label))),
    h("button", {
      type: "button",
      id: "show-finished",
      class: "text-button",
      "aria-pressed": String(preview),
      disabled: mode === "complete",
      onclick: onPreview,
    }, preview ? "← Back to my step" : "Peek at finished drawing"));
}

function stepInstructions(lesson, { step, mode }, { onPrevious, onNext, onStepChange }) {
  const { instruction, tip } = lesson.steps[step];
  const stepCount = lesson.steps.length;
  const preview = mode === "preview";
  return h("section", { class: "instruction", "aria-labelledby": "instruction-title" },
    h("div", { class: "instruction-topline" },
      h("p", { class: "eyebrow" }, preview ? "A peek at the finish" : `Step ${step + 1} of ${stepCount}`),
      h("span", { class: "step-badge", "aria-hidden": "true" }, preview ? "✧" : stepNumber(step))),
    h("div", { class: "instruction-copy" },
      h("h2", { id: "instruction-title" }, preview ? "Here’s where we’re headed." : instruction),
      h("p", {}, preview ? "Take a look at the finished character. When you’re ready, return to your current step." : tip)),
    h("div", { class: "take-time" },
      h("span", { "aria-hidden": "true" }, "〰"), "No rush. Make this line, then come back for the next."),
    h("div", { class: "lesson-controls" },
      h("button", {
        id: "step-prev", class: "button secondary", type: "button", disabled: step === 0 || preview, onclick: onPrevious,
      }, h("span", { "aria-hidden": "true" }, "←"), "Previous"),
      h("button", {
        id: "step-next", class: "button primary", type: "button", disabled: preview, onclick: onNext,
      }, step === stepCount - 1 ? "Finish drawing" : "Next line", h("span", { "aria-hidden": "true" }, "→"))),
    h("div", { class: "step-range" },
      h("label", { for: "step-slider" }, "Your progress", h("span", {}, `${step + 1} / ${stepCount}`)),
      h("input", {
        id: "step-slider",
        type: "range",
        min: 1,
        max: stepCount,
        value: step + 1,
        disabled: preview,
        "aria-label": "Go to drawing step",
        "aria-valuetext": `Step ${step + 1}: ${instruction}`,
        onchange: event => onStepChange(event.currentTarget.valueAsNumber - 1),
      })),
    h("p", { class: "keyboard-hint" }, "On a keyboard? Use ← and → to move between lines."));
}

function completion(lesson, onRestart) {
  const article = /^[aeiou]/i.test(lesson.noun) ? "an" : "a";
  return h("section", { class: "instruction done-instruction", "aria-labelledby": "finished-title" },
    h("span", { class: "done-star", "aria-hidden": "true" }, "✳"),
    h("p", { class: "eyebrow" }, "Look what you made"),
    h("h2", { id: "finished-title", tabindex: "-1" }, `You drew ${article} ${lesson.noun}!`),
    h("p", {}, "Keep it simple, add a little color, or give your character a name. This one is yours."),
    h("div", { class: "finish-actions" },
      h("button", { class: "button primary", type: "button", onclick: onRestart },
        "Draw it again", h("span", { "aria-hidden": "true" }, "↺")),
      h("a", { class: "button secondary", href: "#drawings" }, "Pick another drawing", arrow())));
}

export function createLessonView(lesson, state, actions) {
  return h("div", { class: "lesson-shell" },
    h("div", { class: "lesson-breadcrumb" },
      h("a", { href: "#drawings" }, "← All drawings"),
      h("span", {}, `${lesson.category} / ${lesson.steps.length} simple steps`)),
    h("div", { class: "lesson-title-row" },
      h("div", {}, h("p", { class: "eyebrow" }, "Let’s draw together"), h("h1", {}, lesson.name)),
      h("p", { class: "lesson-intro" }, lesson.intro)),
    h("div", { class: "lesson-workspace" },
      h("div", { class: "reference-column" },
        referenceBoard(lesson, state, actions.onSwipe),
        referenceTools(state, actions)),
      state.mode === "complete" ? completion(lesson, actions.onRestart) : stepInstructions(lesson, state, actions)),
    h("div", { class: "lesson-bottom" },
      h("p", {}, "Draw on your chalkboard or paper. The screen is just your guide."),
      h("button", { type: "button", id: "start-over", class: "text-button", onclick: actions.onRestart },
        "↺ Start over")));
}
