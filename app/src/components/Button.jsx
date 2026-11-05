import Link from 'next/link';
import c from '@/tokens/components.json';
import { buttonTokens, linkTokens } from './button-tokens';
import '@/styles/components.css';
import './button.css';

// Button, built from its spec: components/button.json → (npm run tokens) → components.json + components.css.
// Change the spec, not this file. Docs: docs/components/button.md.
// Every size and type value is CSS (src/styles/components.css), keyed by data-size, data-type and
// data-shape, so a button is a few attributes, not an inline style block. The token inspector
// (Ctrl + Alt) reads the same attributes through button-tokens.js.
const spec = c.button;
export const BUTTON = spec;
export const ICON_GRID = c.iconGrid; // ratios of the icon frame
export const ICON_LIVE = ICON_GRID.square; // a HeyOz icon's longest side ÷ its frame
export const SIZE_NAMES = spec.sizes.map((s) => s.size);
const SIZE = Object.fromEntries(spec.sizes.map((s) => [s.size, s]));

export const TYPE_NAMES = Object.keys(spec.types);
export const LINK_NAMES = Object.keys(spec.links);
export { buttonTokens, linkTokens };

export function Icon({ src }) {
  return <span className="btn-icon" style={{ '--icon': `url(${src})` }} aria-hidden />;
}

// type: brand … brand-ghost · size: 2xs … 2xl · block: fill the width · shape: squircle | pill · icon / iconAfter: svg url · state: 'hover' | 'active' to force one (docs)
// href: renders a link that looks exactly like the button (navigation, not an action)
export default function Button({ type = 'secondary', size = 'md', shape = 'squircle', icon, iconAfter, loading, disabled, state, block, children, label, href, ...props }) {
  const iconOnly = !children, Tag = href ? Link : 'button';
  return (
    <Tag
      href={href}
      type={href ? undefined : 'button'}
      className={`btn lit ${SIZE[size].labelClass}`}
      data-component="button"
      data-name={`button · ${type} · ${size} · ${shape}`}
      data-type={type}
      data-size={size}
      data-shape={shape}
      data-state={state}
      data-icon-only={iconOnly || undefined}
      data-block={block || undefined}
      disabled={href ? undefined : disabled || loading}
      aria-busy={loading || undefined}
      aria-label={iconOnly ? label : undefined}
      {...props}
    >
      {icon && !(iconOnly && loading) && <Icon src={icon} />}
      {children && <span className="btn-label">{children}</span>}
      {loading ? <span className="btn-spinner" aria-hidden /> : iconAfter && <Icon src={iconAfter} />}
    </Tag>
  );
}

// Link: text (and an optional icon) in the label style of the given size. No frame, no fill.
export function LinkButton({ type = 'brand', size = 'md', icon, iconAfter, disabled, state, children, href, ...props }) {
  const Tag = href && !disabled ? 'a' : 'button';
  return (
    <Tag className={`btn-link ${SIZE[size].labelClass}`} href={Tag === 'a' ? href : undefined} type={Tag === 'button' ? 'button' : undefined}
      disabled={Tag === 'button' ? disabled : undefined} aria-disabled={disabled || undefined} data-state={state}
      data-component="link" data-type={type} data-size={size} data-name={`link · ${type} · ${size}`} {...props}>
      {icon && <Icon src={icon} />}<span>{children}</span>{iconAfter && <Icon src={iconAfter} />}
    </Tag>
  );
}
