import { createLessonView } from "./lesson-view.js";
import { moveStep } from "./state.js";

export function mountLesson(main, lesson, { step, theme, remember, changeTheme, announce }) {
  let mode = "steps";

  const actions = {
    onPrevious: () => navigate(-1),
    onNext: () => navigate(1, true),
    onSwipe: direction => navigate(direction),
    onStepChange: setStep,
    onRestart: () => setStep(0),
    onThemeChange: value => {
      theme = value;
      changeTheme(value);
      render();
    },
    onPreview: () => {
      mode = mode === "preview" ? "steps" : "preview";
      render();
      announce(mode === "preview" ? "Showing the finished drawing." : stepMessage("Back to step"));
    },
  };

  function stepMessage(label = "Step") {
    return `${label} ${step + 1} of ${lesson.steps.length}. ${lesson.steps[step].instruction}`;
  }

  function render(focusSelector) {
    const active = document.activeElement;
    const restoreFocus = active !== main && main.contains(active);
    main.replaceChildren(createLessonView(lesson, { step, theme, mode }, actions));

    if (focusSelector) {
      main.querySelector(focusSelector)?.focus({ preventScroll: true });
    } else if (restoreFocus) {
      // Rendering replaces the controls. Previous may now be disabled or a
      // control may have disappeared when leaving the completion screen.
      const replacement = active.id && document.getElementById(active.id);
      const target = replacement && !replacement.disabled ? replacement : main.querySelector("#step-next");
      if (target && !target.disabled) target.focus({ preventScroll: true });
    }
  }

  function setStep(next) {
    step = next;
    mode = "steps";
    remember(step);
    render();
    announce(stepMessage());
  }

  function navigate(direction, finishAtEnd = false) {
    if (mode !== "steps") return;
    const next = moveStep(lesson, step, direction);
    if (next !== step) {
      setStep(next);
    } else if (direction > 0 && finishAtEnd) {
      // Swiping at the last step stops there. The Next action marks it drawn.
      remember(step, true);
      mode = "complete";
      render("#finished-title");
    }
  }

  render();
  return event => {
    if (mode !== "steps" || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey
      || event.target.closest?.("input, textarea, select, [contenteditable]")) return;
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      navigate(event.key === "ArrowRight" ? 1 : -1, true);
    }
  };
}
