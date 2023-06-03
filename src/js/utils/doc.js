export function qs(query, target = document) {
  return target.querySelector(query);
}

export function qsAll(query, target = document) {
  return target.querySelectorAll(query);
}

export function cl(tagName = "div", { id = "", className = "" } = {}) {
  const el = document.createElement(tagName);

  if (id !== "") el.id = id;
  if (className !== "") el.className = className;

  return el;
}

export function getCSSVar(name) {
  const cs = getComputedStyle(qs(":root"));
  return cs.getPropertyValue(name);
}

export function setCSSVar(name, val) {
  document.documentElement.style.setProperty(name, val);
}
