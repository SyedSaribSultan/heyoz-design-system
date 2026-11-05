'use client';
// DRAFT parts for the editor. Not design-system components yet: each one is built once, from tokens,
// and waits for sign-off before it moves to src/components with a spec and a docs page.
// Every part writes data-tokens, so Ctrl + Alt shows what it paints.
import { useId } from 'react';
import './parts.css';

const T = (rows) => JSON.stringify(rows);
export const iconUrl = (n) => `/icons/lucide/${n}.svg`;

// Icon: a Lucide icon from the grid set, painted in currentColor. size: icon/sm 16 · md 20 · lg 24.
export function Ic({ n, size = 'sm', className = '' }) {
  return <span className={`ed-ic ${className}`} data-size={size} style={{ '--icon': `url(${iconUrl(n)})` }} aria-hidden />;
}

export function Kbd({ children }) {
  return <kbd className="ed-kbd type-label-md-medium" data-name="kbd (draft)" data-tokens={T([['type', 'type/label/md/medium'], ['text colour', 'content/tertiary']])}>{children}</kbd>;
}

// Slider: native range input, so keyboard and screen readers work as-is.
export function Slider({ value, min = 0, max = 1, step = 0.01, onChange, onCommit, label, disabled }) {
  const p = ((value - min) / (max - min)) * 100;
  return (
    <input className="ed-range" type="range" min={min} max={max} step={step} value={value} aria-label={label} disabled={disabled}
      style={{ '--p': `${p}%` }} onChange={(e) => onChange(+e.target.value)} onPointerUp={onCommit} onKeyUp={onCommit}
      data-name="slider (draft)" data-tokens={T([['track', 'fill/tertiary'], ['track · filled', 'content/secondary'], ['thumb', 'content/primary'], ['height', 'layout · 20px'], ['focus', 'border/focus']])} />
  );
}

export function Switch({ checked, onChange, children }) {
  return (
    <button type="button" role="switch" aria-checked={checked} className="ed-switch type-body-md-regular" onClick={() => onChange(!checked)}
      data-name="switch (draft)" data-tokens={T([['track · off', 'fill/tertiary-active'], ['track · on', 'content/secondary'], ['knob', 'content/primary'], ['text colour', 'content/primary']])}>
      <span>{children}</span><i aria-hidden />
    </button>
  );
}

export function NumberField({ label, value, onChange, step = 0.1, min = 0 }) {
  const id = useId();
  return (
    <label className="ed-field ed-num" htmlFor={id} data-name="number field (draft)"
      data-tokens={T([['background', 'surface/secondary'], ['border', 'border/primary'], ['border · focus', 'border/focus'], ['radius', 'radius/md'], ['height', 'size/control/xs'], ['label', 'content/tertiary']])}>
      <span className="type-label-md-medium">{label}</span>
      <input id={id} type="number" step={step} min={min} value={(+value).toFixed(1)} className="type-body-md-regular"
        onChange={(e) => { const v = parseFloat(e.target.value); if (!Number.isNaN(v)) onChange(v); }} />
    </label>
  );
}

export function TextArea({ value, onChange, placeholder, label, rows = 3, id, autoFocus }) {
  return (
    <textarea id={id} className="ed-field ed-ta type-body-md-regular" rows={rows} value={value} placeholder={placeholder} aria-label={label} autoFocus={autoFocus}
      onChange={(e) => onChange(e.target.value)}
      data-name="textarea (draft)" data-tokens={T([['background', 'surface/secondary'], ['border', 'border/primary'], ['border · focus', 'border/focus'], ['radius', 'radius/lg'], ['placeholder', 'content/tertiary']])} />
  );
}

// Section heading used in panels, popovers and the inspector.
export function Label({ children, htmlFor, as: Tag = htmlFor ? 'label' : 'span' }) {
  return <Tag htmlFor={htmlFor} className="ed-lbl type-label-md-semibold" data-name="field label (draft)" data-tokens={T([['type', 'type/label/md/semibold'], ['text colour', 'content/tertiary']])}>{children}</Tag>;
}
export function Hint({ children }) {
  return <p className="ed-hint type-body-sm-regular" data-name="hint" data-tokens={T([['type', 'type/body/sm/regular'], ['text colour', 'content/tertiary']])}>{children}</p>;
}

// Menu item: icon, label (+ sub line), shortcut or badge. Disabled items stay focusable and say why.
export function MenuItem({ icon, children, sub, kbd, badge, danger, disabled, why, active, onClick, role = 'menuitem', checked, ...rest }) {
  return (
    <button type="button" role={role} aria-checked={checked} className="ed-mi type-body-md-regular" data-danger={danger || undefined} data-active={active || undefined}
      aria-disabled={disabled || undefined} title={disabled ? why : undefined} onClick={onClick} {...rest}
      data-name={`menu item${danger ? ' (destructive)' : ''} (draft)`}
      data-tokens={T([['background · hover', 'fill/tertiary-hover'], ['text colour', danger ? 'content/critical' : 'content/primary'], ['icon colour', danger ? 'content/critical' : 'content/secondary'], ['radius', 'radius/md'], ['padding x', 'space/8'], ['gap', 'space/8']])}>
      {icon && <Ic n={icon} />}
      <span className="grow">{children}{sub && <small className="type-body-sm-regular">{sub}</small>}</span>
      {kbd && <Kbd>{kbd}</Kbd>}
      {badge && <Badge>{badge}</Badge>}
      {checked && <Ic n="check" className="ed-tick" />}
    </button>
  );
}
export const Sep = () => <i className="ed-sep" data-name="separator" data-tokens={T([['background', 'border/primary']])} />;
export function Badge({ children }) {
  return <span className="ed-badge type-label-sm-medium" data-name="badge (draft)" data-tokens={T([['background', 'fill/tertiary'], ['text colour', 'content/secondary'], ['radius', 'radius/full']])}>{children}</span>;
}

// Action bar button: icon above label. pressed = its panel is open.
export function BarButton({ icon, label, pressed, danger, onClick, ...rest }) {
  return (
    <button type="button" className="ed-bt type-label-md-medium" aria-pressed={pressed} data-danger={danger || undefined} onClick={onClick} {...rest}
      data-name="action bar button (draft)" data-tokens={T([['text colour', danger ? 'content/critical' : 'content/secondary'], ['text · hover', 'content/primary'], ['background · hover', 'fill/secondary'], ['background · pressed', 'fill/tertiary'], ['radius', 'radius/md'], ['icon', 'size/icon/md']])}>
      <Ic n={icon} size="md" /><span>{label}</span>
    </button>
  );
}

// Callout: an inline notice with an icon.
export function Callout({ icon = 'info', children }) {
  return <div className="ed-callout type-body-sm-regular" data-name="callout (draft)" data-tokens={T([['background', 'fill/secondary'], ['radius', 'radius/md'], ['text colour', 'content/primary']])}><Ic n={icon} /><span>{children}</span></div>;
}

export function Progress({ value }) {
  return <div className="ed-prog" role="progressbar" aria-valuenow={Math.round(value * 100)} aria-valuemin={0} aria-valuemax={100} data-name="progress (draft)" data-tokens={T([['track', 'fill/tertiary'], ['bar', 'content/primary'], ['radius', 'radius/full']])}><i style={{ width: `${value * 100}%` }} /></div>;
}
