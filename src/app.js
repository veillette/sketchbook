import { ALL_DRAWINGS, createGallery } from "./gallery.js";
import { mountLesson } from "./lesson-player.js";
import { lessonFromHash, loadProgress, loadTheme, saveProgress, saveTheme } from "./state.js";

const main = document.getElementById("main");
const announcer = document.getElementById("announcer");
const progress = loadProgress();
let category = ALL_DRAWINGS;
let theme = loadTheme();
let handleLessonKeydown;

function focusMain() {
  main.focus({ preventScroll: true });
}

function announce(text) {
  announcer.textContent = "";
  requestAnimationFrame(() => { announcer.textContent = text; });
}

function route() {
  const lesson = lessonFromHash(location.hash);
  if (lesson) {
    document.title = `${lesson.name} — Sketchbook`;
    handleLessonKeydown = mountLesson(main, lesson, {
      step: progress[lesson.id]?.step ?? 0,
      theme,
      remember(step, completed = progress[lesson.id]?.completed === true) {
        progress[lesson.id] = { step, completed };
        saveProgress(progress);
      },
      changeTheme(value) {
        theme = value;
        saveTheme(theme);
      },
      announce,
    });
  } else {
    document.title = "Sketchbook — One line at a time";
    handleLessonKeydown = undefined;
    main.replaceChildren(...createGallery(progress, category, value => { category = value; }));
  }

  focusMain();
  if (location.hash === "#drawings") document.getElementById("drawings")?.scrollIntoView();
  else scrollTo({ top: 0, behavior: "instant" });
}

window.addEventListener("hashchange", route);
window.addEventListener("keydown", event => handleLessonKeydown?.(event));
document.querySelector(".skip-link").addEventListener("click", event => {
  event.preventDefault();
  focusMain();
  main.scrollIntoView();
});
route();
