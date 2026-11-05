import c from '@/tokens/components.json';

// The tokens a Button or LinkButton paints, as inspector rows [property, token].
// Read from the element's data-type / data-size / data-shape, so the page HTML doesn't carry them.
const spec = c.button;
const SIZE = Object.fromEntries(spec.sizes.map((s) => [s.size, s]));

export function buttonTokens({ type = 'secondary', size = 'md', shape = 'squircle' }) {
  const s = SIZE[size], rest = spec.types[type].rest, hover = spec.types[type].hover;
  return [['height', s.heightToken], ['padding x', s.paddingXToken || `layout · ${s.paddingX}px (set, not a token)`], ['gap', s.gapToken], ['type', `type/${s.label.slice(5)}`],
    ['radius', shape === 'pill' ? 'radius/full' : s.radiusSet ? `layout · ${s.radius}px (set)` : `layout · ${s.radius}px (height × ${spec.squircle})`], ['icon frame', s.iconToken],
    ['background', rest.fill], ['border', rest.border], ['border width', 'stroke/1'], ['text colour', rest.label], ['icon colour', rest.icon],
    ['background · hover', hover.fill], ['border · hover', hover.border], ['icon · hover', hover.icon], ...(rest.shade ? [['effect', 'effect · inner-shade']] : [])]
    .filter(([, tk]) => tk !== 'none');
}

export function linkTokens({ type = 'brand', size = 'md' }) {
  const s = SIZE[size], l = spec.links[type];
  return [['type', `type/${s.label.slice(5)}`], ['text colour', l.rest], ['text · hover', l.hover], ['gap', s.gapToken]];
}
