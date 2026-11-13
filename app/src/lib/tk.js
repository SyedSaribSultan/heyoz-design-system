// tk(): the only way the Home screen applies design tokens.
// It turns a token spec into real CSS (var(--token)) AND records the same tokens in
// data-tokens, so the hover inspector always shows exactly what is painted.
// Values with no token (fixed layout widths from the design, asset geometry) go in
// `layout` and are labelled as such in the inspector.
// Effects are not tokens yet (D-021). Their values live once in app/globals.css (--fx-*); the inspector
// labels them as untokenised.
export const FX = {
  'inner-shade': 'var(--fx-inner-shade)',
  'inner-highlight': 'var(--fx-inner-highlight)',
  'drop-md': 'var(--fx-drop-md)',
  'drop-sm': 'var(--fx-drop-sm)',
};
const v = (name) => `var(--${name.replaceAll('/', '-')})`;
const SPACE = { p: 'padding', px: ['paddingLeft', 'paddingRight'], py: ['paddingTop', 'paddingBottom'], pt: 'paddingTop', pr: 'paddingRight', pb: 'paddingBottom', pl: 'paddingLeft', gap: 'gap' };

export function tk(name, spec = {}, layout = {}) {
  const style = {}, rows = [], shadows = [];
  let className = spec.className || '';
  for (const [k, val] of Object.entries(spec)) {
    if (k === 'className') continue;
    if (k === 'bg') { style.background = v(val); rows.push(['background', val]); }
    else if (k === 'gradient') { style.background = `linear-gradient(to bottom, ${v(val[0])}, ${v(val[1])})`; rows.push(['gradient top', val[0]], ['gradient bottom', val[1]]); }
    else if (k === 'border') { shadows.push(`inset 0 0 0 var(--stroke-1) ${v(val)}`); rows.push(['border', val], ['border width', 'stroke/1']); }
    else if (k === 'color') { style.color = v(val); rows.push(['text colour', val]); }
    else if (k === 'radius') { style.borderRadius = v(`radius/${val}`); rows.push(['radius', `radius/${val}`]); }
    else if (k === 'type') { className += ` type-${val.replaceAll('/', '-')}`; rows.push(['type', `type/${val}`]); }
    else if (k === 'fx') { for (const f of [val].flat()) { shadows.push(FX[f]); rows.push(['effect', `effect · ${f}`]); } }
    else if (k === 'hover') { style['--hover-bg'] = v(val); rows.push(['background · hover', val]); }
    else if (k === 'light') { rows.push(['light', `light/${val}`]); }
    else if (k === 'size') { style.width = style.height = v(`size/${val}`); rows.push(['size', `size/${val}`]); }
    else if (SPACE[k] !== undefined) {
      for (const prop of [SPACE[k]].flat()) style[prop] = v(`space/${val}`);
      rows.push([k === 'gap' ? 'gap' : `padding ${k.slice(1) || 'all'}`, `space/${val}`]);
    }
  }
  // light/cursor (D-020): everything painted above the background is a lit surface; the background is not.
  const paint = spec.bg || (spec.gradient && spec.gradient[0]);
  const lit = paint && paint !== 'background';
  if (lit) rows.push(['light', 'light/cursor']);
  if (shadows.length) style.boxShadow = shadows.join(', ');
  for (const [k, val] of Object.entries(layout)) { style[k] = typeof val === 'number' ? `${val}px` : val; rows.push([k, `layout · ${style[k]}`]); }
  // data-lit, not a class: Home often sets className after spreading tk(), which would drop a class.
  return { className: className.trim() || undefined, style, 'data-name': name, 'data-tokens': JSON.stringify(rows), ...(lit ? { 'data-lit': '' } : {}) };
}
