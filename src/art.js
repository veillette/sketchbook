const NS = "http://www.w3.org/2000/svg";
export function drawing(lesson, { step = lesson.steps.length - 1, finished = false, thumbnail = false } = {}) {
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("viewBox", "30 35 260 255");
  svg.setAttribute("class", `drawing${thumbnail ? " thumbnail" : ""}`);
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", `${lesson.name}${thumbnail || finished ? ", finished drawing" : `, step ${step + 1} of ${lesson.steps.length}`}`);
  for (const [index, stroke] of lesson.steps.entries()) {
    if (!finished && index > step) continue;
    const path = document.createElementNS(NS, "path");
    path.setAttribute("d", stroke.path);
    path.setAttribute("class", index === step && !finished && !thumbnail ? "stroke new-stroke" : "stroke");
    svg.append(path);
  }
  return svg;
}
