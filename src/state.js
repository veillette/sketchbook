import { lessons, lessonById } from "./lessons.js";
const KEY = "sketchbook.progress.v1";
export function readProgress(storage) {
  try {
    const raw = JSON.parse(storage.getItem(KEY));
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
  } catch { return {}; }
}
export function loadProgress() {
  try { return readProgress(localStorage); } catch { return {}; }
}
export function saveProgress(progress) {
  try { localStorage.setItem(KEY, JSON.stringify(progress)); } catch { /* lessons still work without storage */ }
}
export function lessonFromHash(hash) {
  return lessonById.get(hash.replace(/^#\/?/, "")) ?? null;
}
export function moveStep(lesson, step, delta) {
  return Math.max(0, Math.min(lesson.steps.length - 1, step + delta));
}
