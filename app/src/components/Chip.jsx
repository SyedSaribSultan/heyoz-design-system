'use client';
import { useEffect, useRef, useState } from 'react';
import { CHIP } from './chip-data';
import Lucide, { lucide } from '@/lib/Lucide';
import useIndicator from '@/lib/useIndicator';
import useRoving from '@/lib/useRoving';
import cssTime from '@/lib/cssTime';
import { rec } from '@/lib/rec';
import Button from './Button';
import '@/styles/components.css';
import './chip.css';

// Chip, built from its spec: components/chip.json → (npm run tokens) → components.json + components.css.
// Change the spec, not this file. Docs: docs/components/chip.md.
// A compact interactive control. Four kinds share one frame:
//   action   <Chip icon="wand-sparkles" onClick={…}>Enhance</Chip>                        a setting; may open a menu
//   filter   <Chip selected={on} onSelectedChange={setOn}>Video</Chip>                    toggles; aria-pressed
//   input    <Chip onRemove={…}>design@brand.com</Chip>                                   a value you can remove (cross Button; Backspace / Delete)
//   choice   <ChipGroup label="Aspect" items={[['9:16', '9:16'], …]} value onChange />     one of a group, with a sliding indicator (D-032)
// size: xs (32, default) | 2xs (28) · icon: a Lucide name · image: a logo or picture url (media, above the light)
// iconAfter: a trailing Lucide name; iconAfterHover swaps to another on hover and focus (Home's double chevron → cross)
// state: 'hover' | 'active' forces a look (docs) · label: the accessible name of an icon-only chip
const spec = CHIP;
const val = (key) => spec.vars.find((v) => v.key === key);
const ref = (key) => val(key)?.ref;

const rowsFor = (size, kind, look) => [['height', ref(`${size}-height`)], ['padding x', ref(`${size}-padding-x`) || `layout · ${val(`${size}-padding-x`).px}px (set)`], ['gap', ref(`${size}-gap`)],
  ['radius', ref(`${size}-radius`) || `layout · ${val(`${size}-radius`).px}px (set)`], ['type', `type/${spec.types[size].slice(5).replaceAll('-', '/')}`], ['icon frame', ref('icon')],
  ['background', ref(`${look}-fill`) || 'none'], ['border', ref(`${look}-border`)], ['border width', 'stroke/1'], ['text colour', ref(`${look}-label`)], ['icon colour', ref(`${look}-icon`)],
  ['background · hover', ref('hover-fill')], ['border · hover', ref('hover-border')], ['effect', 'effect · inner-shade'], ['light', 'light/cursor']];

export default function Chip({ size = 'xs', kind, icon, image, iconAfter, iconAfterHover, selected, onSelectedChange, onRemove, onClick, onKeyDown, disabled, state, label, 'aria-label': ariaLabel, children, className = '', ...props }) {
  const k = kind || (onRemove ? 'input' : selected !== undefined ? 'filter' : 'action');
  const [leaving, setLeaving] = useState(false);
  const root = useRef(null), timer = useRef(0);
  useEffect(() => () => clearTimeout(timer.current), []); // a chip removed another way must not fire onRemove after it is gone
  const on = k === 'filter' || k === 'choice' ? !!selected : undefined;
  const look = disabled ? 'disabled' : on ? 'selected' : k === 'choice' ? 'choice' : 'rest';
  const text = typeof children === 'string' ? children : label;

  const remove = () => {
    if (disabled || leaving) return;
    const sibs = [...(root.current?.parentElement?.querySelectorAll('.chp[data-kind="input"]') || [])], i = sibs.indexOf(root.current);
    const next = sibs[i + 1] || sibs[i - 1];
    setLeaving(true);
    timer.current = setTimeout(() => { onRemove?.(); setLeaving(false); next?.focus(); }, cssTime('--duration-fast', 120)); // fade out, then the row closes up
  };
  const press = (e) => { onClick?.(e); if (k === 'filter') onSelectedChange?.(!selected); };
  const keys = (e) => {
    onKeyDown?.(e);
    if (k === 'input' && !e.defaultPrevented && (e.key === 'Backspace' || e.key === 'Delete')) { e.preventDefault(); remove(); }
  };

  const showCheck = k === 'filter' && !icon && !image;
  const common = {
    ref: root,
    className: `chp lit ${spec.types[size]} ${leaving ? 'motion-fade' : ''} ${className}`.trim(),
    'data-leaving': leaving || undefined,
    'data-component': 'chip', 'data-size': size, 'data-kind': k, 'data-selected': on || undefined, 'data-state': state,
    onKeyDown: keys,
    ...rec(`chip · ${k} · ${size}${on ? ' · selected' : ''}`, rowsFor(size, k, look)),
    ...props,
  };
  const body = (
    <>
      {showCheck && <span className="chp-check" aria-hidden><Lucide name="check" size="sm" /></span>}
      {icon && <Lucide name={icon} size="sm" className="chp-icon" />}
      {image && <img className="chp-image" src={image} alt="" data-media />}
      {children && <span className="chp-label">{children}</span>}
      {iconAfter && (iconAfterHover
        ? <span className="motion-swap chp-swap" aria-hidden><Lucide name={iconAfter} size="sm" /><Lucide name={iconAfterHover} size="sm" className="motion-swap-in" /></span>
        : <Lucide name={iconAfter} size="sm" className="chp-icon" />)}
      {k === 'input' && <Button type="ghost" size="2xs" icon={lucide('x')} label={`Remove ${text || ''}`.trim()} tabIndex={-1} disabled={disabled} onClick={remove} />}
    </>
  );
  if (k === 'input') {
    return <span {...common} role="group" tabIndex={disabled ? undefined : common.tabIndex ?? 0} aria-label={ariaLabel ?? text} aria-keyshortcuts="Backspace Delete" aria-disabled={disabled || undefined}>{body}</span>;
  }
  return (
    <button {...common} type="button" disabled={disabled} onClick={press}
      aria-pressed={k === 'filter' ? !!selected : undefined} aria-label={ariaLabel ?? (!children ? label : undefined)}
      role={k === 'choice' ? 'radio' : undefined} aria-checked={k === 'choice' ? !!selected : undefined}>
      {body}
    </button>
  );
}

// ChipGroup: choice chips, one chosen. The selected look is one indicator that slides between chips (D-032).
// items: [[value, label]] or [{ value, label, icon, image, disabled }] · value / onChange · label or aria-label: the group's name · className: on the root
// Keyboard: Tab stops once, on the chosen chip; arrows move and choose, Home and End jump.
export function ChipGroup({ label, 'aria-label': ariaLabel, items, value, onChange, size = 'xs', className = '', ...props }) {
  const ref = useRef(null);
  const list = items.map((it) => (Array.isArray(it) ? { value: it[0], label: it[1] } : it));
  const { vars, ready, moving } = useIndicator(ref, '[aria-checked="true"]', [value, list.length, size]);
  const stop = list.some((it) => it.value === value && !it.disabled) ? value : list.find((it) => !it.disabled)?.value;
  const { onKeyDown: keys } = useRoving({ ref, item: '[role="radio"]' }); // the focused chip is clicked, which calls onChange
  return (
    <div ref={ref} className={`chp-group ${className}`.trim()} role="radiogroup" aria-label={ariaLabel ?? label} data-size={size} onKeyDown={keys}
      data-indicator-ready={ready || undefined} data-indicator-moving={moving || undefined} {...props}>
      <span className="chp chp-thumb motion-indicator" data-size={size} data-selected data-component="chip" data-name={`chip indicator · selected · ${size}`} style={vars} aria-hidden />
      {list.map((it) => (
        <Chip key={it.value} kind="choice" size={size} icon={it.icon} image={it.image} disabled={it.disabled} selected={it.value === value}
          data-value={it.value} tabIndex={it.value === stop ? 0 : -1} onClick={() => onChange?.(it.value)}>{it.label}</Chip>
      ))}
    </div>
  );
}
