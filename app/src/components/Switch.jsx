'use client';
import { useId } from 'react';
import c from '@/tokens/components.json';
import { rec } from '@/lib/rec';
import '@/styles/components.css';
import './switch.css';

// Switch, built from its spec: components/switch.json → (npm run tokens) → components.json + components.css.
// Change the spec, not this file. Docs: docs/components/switch.md.
// A native input type=checkbox with role=switch sits (invisible) in a label, so forms, Space and the label
// click are the browser's own. The track, the sliding thumb and every colour are CSS (switch.css, --sw-*).
//
// <Switch label="Auto-save" description="Saves every 30 seconds" checked={on} onChange={(checked) => setOn(checked)} />
//   checked / defaultChecked · onChange(checked, event)
//   label, description: text; with neither, pass aria-label · labelPosition: 'end' (right, default) | 'start' (left)
//   block: the row fills its width, so a left label pushes the switch to the far edge (a settings list)
//   size: 'sm' (track 28 × 16) | 'md' (track 36 × 20, default) · disabled · state: 'hover' | 'pressed' | 'focus' forces a look (docs)
const spec = c.switch;
export const SWITCH = spec;
const V = Object.fromEntries(spec.vars.map((x) => [x.key, x.ref ?? `${x.px}px`]));

const tokens = (size) => [['track', `${V[`track-width-${size}`]} × ${V[`track-height-${size}`]}`], ['thumb', V[`thumb-${size}`]], ['radius', V['track-radius']], ['border width', V['track-stroke']],
  ['track · off', V['off-rest-fill']], ['border · off', V['off-rest-border']], ['thumb · off', V['thumb-off']], ['track · on', V['on-rest-fill']], ['thumb · on', V['thumb-on']],
  ['track · hover', V['off-hover-fill']], ['border · hover', V['off-hover-border']], ['track · pressed', V['off-pressed-fill']], ['focus ring', `${V['track-focus-ring']} · border/focus`],
  ['text colour', V['label-color']], ['label', 'type/body/md/regular'], ['description', 'type/body/sm/regular'], ['effect', 'effect · inner-shade'], ['light', 'light/cursor']];

export default function Switch({ checked, defaultChecked, onChange, label, description, labelPosition = 'end', block, size = 'md', disabled, state, className = '', 'aria-label': ariaLabel, ...props }) {
  const id = useId();
  const value = checked === undefined ? { defaultChecked } : { checked };
  return (
    <label className={`sw sw-row ${className}`.trim()} data-size={size} data-state={state} data-position={labelPosition} data-block={block || undefined}
      data-disabled={disabled || undefined} data-text={label || description ? '' : undefined} data-component="switch" {...rec(`switch · ${size}`, tokens(size))}>
      <input type="checkbox" role="switch" className="sw-input" {...value} disabled={disabled} onChange={(e) => onChange?.(e.target.checked, e)}
        aria-label={ariaLabel} aria-labelledby={label && !ariaLabel ? `${id}-l` : undefined} aria-describedby={description ? `${id}-d` : undefined} {...props} />
      <span className="sw-track lit" aria-hidden><span className="sw-thumb" /></span>
      {(label || description) && (
        <span className="sw-text">
          {label && <span id={`${id}-l`} className={`sw-label ${spec.types.label}`}>{label}</span>}
          {description && <span id={`${id}-d`} className={`sw-desc ${spec.types.description}`}>{description}</span>}
        </span>
      )}
    </label>
  );
}
