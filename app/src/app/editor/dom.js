// The editor root, and boxes relative to it (popovers are placed inside the editor).
export const root = { el: null };
export function rectOf(elOrPoint) {
  const A = root.el.getBoundingClientRect();
  const r = elOrPoint.getBoundingClientRect ? elOrPoint.getBoundingClientRect() : { left: elOrPoint.x, right: elOrPoint.x, top: elOrPoint.y, bottom: elOrPoint.y };
  return { left: r.left - A.left, top: r.top - A.top, right: r.right - A.left, bottom: r.bottom - A.top };
}
