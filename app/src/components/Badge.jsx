import c from '@/tokens/components.json';
import Lucide from '@/lib/Lucide';
import { rec } from '@/lib/rec';
import '@/styles/components.css';
import './badge.css';

// Badge, built from its spec: components/badge.json → (npm run tokens) → components.json + components.css.
// Change the spec, not this file. Docs: docs/components/badge.md.
// A small, non-interactive label: a status, a count, or a dot that says "new". Never a button (that is a Chip).
//
//   <Badge tone="success">Live</Badge>                       label badge, soft (default), md
//   <Badge tone="critical" variant="solid" icon="alert-triangle">Failed</Badge>
//   <Badge tone="warning" dot>Paused</Badge>                 leading dot
//   <Badge tone="brand" variant="solid" count={128} label="unread" />     count: 99+ above max
//   <BadgeAnchor badge={<Badge tone="brand" variant="solid" dot label="New" />}>…icon or avatar…</BadgeAnchor>
//
// tone: neutral | brand | success | warning | critical | info · variant: soft | solid · size: sm | md
// icon: a Lucide name · dot: leading dot (or, with no children and no count, the dot-only badge)
// count / max: a number, capped at max (default 99) · label: what is counted, or the dot's accessible name
// ring: a surface token (e.g. "surface/secondary") when the badge sits on something other than surface/primary
const spec = c.badge;
export const BADGE = spec;
export const TONES = ['neutral', 'brand', 'success', 'warning', 'critical', 'info'];
export const VARIANTS = ['soft', 'solid'];
export const SIZES = ['sm', 'md'];
const ref = (key) => spec.vars.find((v) => v.key === key)?.ref;

export default function Badge({ tone = 'neutral', variant = 'soft', size = 'md', icon, dot, count, max = 99, label, ring, children, className = '', style, ...props }) {
  if (count === 0) return null;
  const kind = count !== undefined ? 'count' : dot && !children ? 'dot' : 'label';
  const text = kind === 'count' ? (count > max ? `${max}+` : String(count)) : children;
  const fill = ref(`${variant}-${tone}-fill`), content = ref(`${variant}-${tone}-content`);
  const rows = kind === 'dot'
    ? [['size', `layout · ${spec.vars.find((v) => v.key === `${size}-signal`).px}px (set)`], ['background', variant === 'solid' ? fill : ref(`soft-${tone}-dot`)], ['radius', ref('radius')]]
    : [['type', `type/label/${size === 'sm' ? 'sm' : 'md'}/medium`], ['padding x', ref(`${size}-padding-x`)], ['padding y', `layout · ${spec.vars.find((v) => v.key === `${size}-padding-y`).px}px (set)`],
      ['background', fill], ['text colour', content], ['radius', ref('radius')], ...(variant === 'solid' ? [['effect', 'effect · inner-shade']] : []), ['light', 'light/cursor']];
  return (
    <span
      className={`bdg motion-fade ${kind === 'dot' ? '' : `lit ${spec.types[size]}`} ${className}`.trim()}
      data-tone={tone} data-variant={variant} data-size={size} data-kind={kind}
      role={kind === 'dot' ? 'img' : undefined} aria-label={kind === 'dot' ? label : undefined}
      style={ring ? { '--bdg-ring-colour': `var(--${ring.replaceAll('/', '-')})`, ...style } : style}
      {...rec(`badge · ${kind} · ${variant} · ${tone} · ${size}`, rows)} {...props}
    >
      {kind === 'label' && icon && <Lucide name={icon} size={size === 'sm' ? 'xs' : 'sm'} />}
      {kind === 'label' && !icon && dot && <span className="bdg-dot" aria-hidden />}
      {kind !== 'dot' && <span className="bdg-text">{text}</span>}
      {kind === 'count' && label && <span className="bdg-sr">{label}</span>}
    </span>
  );
}

// BadgeAnchor: puts a badge on the top-right corner of what it wraps (an icon, a button, an avatar).
// shape="circle" moves it in to sit on a circle's edge (14.6% from each side).
export function BadgeAnchor({ badge, shape = 'square', children }) {
  return <span className="bdg-anchor" data-shape={shape}>{children}<span className="bdg-pin">{badge}</span></span>;
}
