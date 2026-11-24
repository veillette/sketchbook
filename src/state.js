import { lessons, lessonById } from "./lessons.js";
import { store } from "./storage.js";
const KEY = "sketchbook.progress.v1";
const THEME_KEY = "sketchbook.theme.v1";

export function readProgress(storage) {
  const raw = store.get(KEY, {}, storage);
  const result = {};
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return result;
  for (const lesson of lessons) {
    const value = raw[lesson.id];
    if (!value || typeof value !== "object") continue;
    result[lesson.id] = {
      step: Number.isInteger(value.step) ? Math.max(0, Math.min(lesson.steps.length - 1, value.step)) : 0,
      completed: value.completed === true,
    };
  }
  return result;
}
export function loadProgress() {
  return readProgress();
}
export function saveProgress(progress) {
  store.set(KEY, progress);
}
export function readTheme(storage) {
  try {
    return storage.getItem(THEME_KEY) === "paper" ? "paper" : "chalk";
  } catch { return "chalk"; }
}
export function loadTheme() {
  try { return readTheme(localStorage); } catch { return "chalk"; }
}
export function saveTheme(theme) {
  try { localStorage.setItem(THEME_KEY, theme === "paper" ? "paper" : "chalk"); } catch { /* theme still works without storage */ }
}
export function lessonFromHash(hash) {
  return lessonById.get(hash.replace(/^#\/?/, "")) ?? null;
}
export function moveStep(lesson, step, delta) {
  return Math.max(0, Math.min(lesson.steps.length - 1, step + delta));
}
