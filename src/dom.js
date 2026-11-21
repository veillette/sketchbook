export function h(tag, attrs = {}, ...children) {
  const element = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (value === false || value == null) continue;
    if (key.startsWith("on")) element.addEventListener(key.slice(2).toLowerCase(), value);
    else element.setAttribute(key, value === true ? "" : String(value));
  }
  element.append(...children.flat(Infinity).filter(child => child != null && child !== false));
  return element;
}

export function arrow() {
  return h("span", { "aria-hidden": "true" }, "↗");
}
