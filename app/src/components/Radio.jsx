'use client';
import { createContext, useContext, useId, useRef, useState } from 'react';
import useRoving from '@/lib/useRoving';
import c from '@/tokens/components.json';
import { rec } from '@/lib/rec';
import '@/styles/components.css';
import './radio.css';

// Radio, built from its spec: components/radio.json → (npm run tokens) → components.json + components.css.
// Change the spec, not this file. Docs: docs/components/radio.md.
// One group, one Tab stop (roving tabindex): Tab lands on the chosen radio, or the first enabled one.
// Arrows move AND choose (Down/Right next, Up/Left back, wrapping), Home / End go to the ends, Space chooses.
// Disabled radios are skipped.
//
// <RadioGroup label="Plan" value={plan} onChange={setPlan} orientation="vertical" | "horizontal">
//   <Radio value="free" label="Free" description="One brand" /> <Radio value="pro" label="Pro" />
// </RadioGroup>
//   RadioGroup: value / defaultValue · onChange(value) · label (group label) or aria-label · name (adds a hidden input for forms)
//     size: 'sm' (circle 16) | 'md' (circle 20, default) · disabled (every radio) · orientation
//   Radio: value (string, required) · label, description · disabled · size · state: 'hover' | 'pressed' | 'focus' forces a look (docs)
const spec = c.radio;
export const RADIO = spec;
const V = Object.fromEntries(spec.vars.map((x) => [x.key, x.ref ?? `${x.px}px`]));
const Ctx = createContext(null);

const tokens = (size) => [['circle', V[`circle-${size}`]], ['dot', V[`dot-${size}`]], ['border width', V['circle-stroke']],
  ['fill · unchecked', V['unchecked-rest-fill']], ['border · unchecked', V['unchecked-rest-border']], ['fill · checked', V['checked-rest-fill']], ['dot colour', V['checked-rest-dot']],
  ['fill · hover', V['unchecked-hover-fill']], ['border · hover', V['unchecked-hover-border']], ['fill · pressed', V['unchecked-pressed-fill']], ['focus ring', `${V['circle-focus-ring']} · border/focus`],
  ['text colour', V['label-color']], ['label', 'type/body/md/regular'], ['description', 'type/body/sm/regular'], ['effect', 'effect · inner-shade'], ['light', 'light/cursor']];

export function RadioGroup({ label, 'aria-label': ariaLabel, value, defaultValue, onChange, name, orientation = 'vertical', size = 'md', disabled, children, className = '', ...props }) {
  const id = useId(), ref = useRef(null);
  const [inner, setInner] = useState(defaultValue ?? null);
  const controlled = value !== undefined, current = controlled ? value : inner;
  const select = (v) => { if (!controlled) setInner(v); if (v !== current) onChange?.(v); };
  const { onKeyDown, first } = useRoving({ ref, item: '[role="radio"]', track: true }); // first: the Tab stop while none is chosen

  return (
    <Ctx.Provider value={{ value: current, select, size, disabled, first }}>
      <div ref={ref} className={`rd rd-group ${className}`.trim()} role="radiogroup" aria-label={ariaLabel} aria-labelledby={label && !ariaLabel ? id : undefined}
        data-orientation={orientation} data-component="radio group" onKeyDown={onKeyDown}
        {...rec('radio group', [['gap', V[orientation === 'horizontal' ? 'group-gap-horizontal' : 'group-gap']], ['label', 'type/body/md/medium'], ['label gap', V['group-label-gap']]])} {...props}>
        {label && <span id={id} className={`rd-group-label ${spec.types['group-label']}`}>{label}</span>}
        <div className="rd-group-items">{children}</div>
        {name && <input type="hidden" name={name} value={current ?? ''} />}
      </div>
    </Ctx.Provider>
  );
}

export function Radio({ value, label, description, disabled, size, state, className = '', ...props }) {
  const g = useContext(Ctx), id = useId();
  const sz = size ?? g?.size ?? 'md', off = disabled ?? g?.disabled;
  const checked = g?.value === value;
  // roving tabindex: the chosen radio, or the first enabled one while nothing is chosen
  const tab = off ? -1 : checked || (g?.value == null && g?.first === String(value)) ? 0 : -1;
  return (
    <div role="radio" className={`rd rd-row ${className}`.trim()} tabIndex={tab} aria-checked={checked} aria-disabled={off || undefined}
      aria-labelledby={label ? `${id}-l` : undefined} aria-describedby={description ? `${id}-d` : undefined}
      data-value={String(value)} data-size={sz} data-state={state} data-disabled={off || undefined} data-text={label || description ? '' : undefined}
      data-component="radio" {...rec(`radio · ${sz}`, tokens(sz))}
      onClick={() => { if (!off) g?.select(value); }}
      onKeyDown={(e) => { if (e.key === ' ') { e.preventDefault(); if (!off) g?.select(value); } }} {...props}>
      <span className="rd-circle lit" aria-hidden><span className="rd-dot" /></span>
      {(label || description) && (
        <span className="rd-text">
          {label && <span id={`${id}-l`} className={`rd-label ${spec.types.label}`}>{label}</span>}
          {description && <span id={`${id}-d`} className={`rd-desc ${spec.types.description}`}>{description}</span>}
        </span>
      )}
    </div>
  );
}
