import t from '@/tokens/tokens.resolved.json';

// Every token as a search entry. Loaded the first time search opens, never with the page.
// copy: what Enter puts on the clipboard (a CSS variable, or the class for a type style).
const css = (name) => `var(--${name.replaceAll('/', '-')})`;
const NUM_PAGE = { space: '/foundations/spacing', radius: '/foundations/radius', size: '/foundations/size', stroke: '/foundations/size' };

export default function tokenEntries() {
  const out = [];
  for (const s of t.semantic) out.push({ kind: 'Colour', title: s.name, sub: `→ ${s.ref} · ${s.hex}`, swatch: s.hex, copy: css(s.name), href: '/foundations/colour' });
  for (const r of t.ramps) for (const p of r.steps) out.push({ kind: 'Primitive', title: p.name, sub: p.hex, swatch: p.hex, copy: css(p.name), href: '/foundations/colour' });
  for (const n of t.numbers) out.push({ kind: 'Number', icon: 'ruler', title: n.name, sub: n.ratio ? `${n.px} of the frame` : `${n.px}px`, copy: css(n.name), href: NUM_PAGE[n.group] || '/foundations/size' });
  for (const s of t.type.styles) out.push({ kind: 'Type', icon: 'type', title: `type/${s.role}/${s.size}`, sub: `${s.px}/${s.lh}px · ${t.type.families[s.role].name}`, copy: `type-${s.role}-${s.size}-regular`, href: '/foundations/typography' });
  for (const [k, ms] of Object.entries(t.motion.duration)) out.push({ kind: 'Motion', icon: 'timer', title: `duration/${k}`, sub: `${ms}ms`, copy: `var(--duration-${k})`, href: '/foundations/motion' });
  for (const [k, e] of Object.entries(t.motion.easing)) out.push({ kind: 'Motion', icon: 'timer', title: `easing/${k}`, sub: e, copy: `var(--easing-${k})`, href: '/foundations/motion' });
  for (const l of t.light) out.push({ kind: 'Light', icon: 'sun', title: l.name, sub: `${l.fill} · ${l.blend} · ${l.size}px`, copy: 'lit', href: '/foundations/light' });
  return out;
}
