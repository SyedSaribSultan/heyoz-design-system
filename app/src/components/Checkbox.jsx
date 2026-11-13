'use client';
import { createContext, useContext, useEffect, useId, useRef } from 'react';
import c from '@/tokens/components.json';
import { rec } from '@/lib/rec';
import '@/styles/components.css';
import './checkbox.css';

// Checkbox, built from its spec: components/checkbox.json → (npm run tokens) → components.json + components.css.
// Change the spec, not this file. Docs: docs/components/checkbox.md.
// A native input type=checkbox sits (invisible) in a label, so forms, Space, the label click and the mixed
// state are the browser's own. The box, the mark and every colour are CSS (checkbox.css, --cb-*).
//
// <Checkbox label="Remember me" description="On this device only" checked={on} onChange={(checked) => setOn(checked)} />
//   checked / defaultChecked · onChange(checked, event) · indeterminate: the mixed state (a parent of a list)
//   label, description: text; with neither, pass aria-label · size: 'sm' (box 16) | 'md' (box 20, default)
//   disabled · state: 'hover' | 'pressed' | 'focus' forces a look (docs) · name, value, id … go to the input
// <CheckboxGroup label="Notify me by" orientation="vertical" | "horizontal" size disabled> …Checkbox… </CheckboxGroup>
const spec = c.checkbox;
export const CHECKBOX = spec;
const V = Object.fromEntries(spec.vars.map((x) => [x.key, x.ref ?? `${x.px}px`]));
const GroupCtx = createContext(null);

const tokens = (size) => [['box', V[`box-${size}`]], ['radius', V[`box-radius-${size}`]], ['border width', V['box-stroke']],
  ['fill · unchecked', V['unchecked-rest-fill']], ['border · unchecked', V['unchecked-rest-border']], ['fill · checked', V['checked-rest-fill']], ['mark', V['checked-rest-mark']],
  ['fill · hover', V['unchecked-hover-fill']], ['border · hover', V['unchecked-hover-border']], ['fill · pressed', V['unchecked-pressed-fill']], ['focus ring', `${V['box-focus-ring']} · border/focus`],
  ['text colour', V['label-color']], ['label', 'type/body/md/regular'], ['description', 'type/body/sm/regular'], ['effect', 'effect · inner-shade'], ['light', 'light/cursor']];

export default function Checkbox({ checked, defaultChecked, indeterminate, onChange, label, description, size, disabled, state, className = '', 'aria-label': ariaLabel, ...props }) {
  const group = useContext(GroupCtx), id = useId(), input = useRef(null);
  const sz = size ?? group?.size ?? 'md', off = disabled ?? group?.disabled;
  // indeterminate is a property of the input, not an attribute
  useEffect(() => { if (input.current) input.current.indeterminate = !!indeterminate; });
  const value = checked === undefined ? { defaultChecked } : { checked };
  return (
    <label className={`cb cb-row ${className}`.trim()} data-size={sz} data-state={state} data-disabled={off || undefined} data-text={label || description ? '' : undefined}
      {...rec(`checkbox · ${sz}`, tokens(sz))} data-component="checkbox">
      <input ref={input} type="checkbox" className="cb-input" {...value} disabled={off} onChange={(e) => onChange?.(e.target.checked, e)}
        aria-label={ariaLabel} aria-labelledby={label && !ariaLabel ? `${id}-l` : undefined} aria-describedby={description ? `${id}-d` : undefined} {...props} />
      <span className="cb-box lit" aria-hidden>
        <span className="cb-mark" data-kind="check" />
        <span className="cb-mark" data-kind="mixed" />
      </span>
      {(label || description) && (
        <span className="cb-text">
          {label && <span id={`${id}-l`} className={`cb-label ${spec.types.label}`}>{label}</span>}
          {description && <span id={`${id}-d`} className={`cb-desc ${spec.types.description}`}>{description}</span>}
        </span>
      )}
    </label>
  );
}

export function CheckboxGroup({ label, orientation = 'vertical', size = 'md', disabled, children, className = '', ...props }) {
  const id = useId();
  return (
    <GroupCtx.Provider value={{ size, disabled }}>
      <div className={`cb cb-group ${className}`.trim()} role="group" aria-labelledby={label ? id : undefined} data-orientation={orientation} data-component="checkbox group"
        {...rec('checkbox group', [['gap', V[orientation === 'horizontal' ? 'group-gap-horizontal' : 'group-gap']], ['label', 'type/body/md/medium'], ['label gap', V['group-label-gap']]])} {...props}>
        {label && <span id={id} className={`cb-group-label ${spec.types['group-label']}`}>{label}</span>}
        <div className="cb-group-items">{children}</div>
      </div>
    </GroupCtx.Provider>
  );
}
