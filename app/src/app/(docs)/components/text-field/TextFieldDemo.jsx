'use client';
import { useState } from 'react';
import { TextField, TextArea, SIZE_NAMES } from '@/components/TextField';
import Segmented from '@/components/Segmented';
import { rec } from '@/lib/rec';

// Playground: every option of the text field, live. One control per row; options that do not apply are
// disabled, never removed, so the panel does not move.
const Opts = ({ label, items, value, set, off = [] }) => (
  <div className="pg-row">
    <span className="pg-label type-label-lg-regular">{label}</span>
    <Segmented label={label} items={items.map((v) => [v, v])} value={value} onChange={set} off={off} />
  </div>
);

export default function TextFieldDemo() {
  const [kind, setKind] = useState('single line');
  const [size, setSize] = useState('xs');
  const [state, setState] = useState('rest');
  const [icon, setIcon] = useState('none');
  const [affix, setAffix] = useState('none');
  const [action, setAction] = useState('none');
  const [label, setLabel] = useState('label');
  const [msg, setMsg] = useState('hint');
  const [count, setCount] = useState('off');
  const area = kind === 'textarea';
  // the value in effect: a choice that does not apply falls back without changing what you picked
  const action_ = area && action === 'show / hide' ? 'none' : action;
  const common = {
    size, label: label === 'none' ? undefined : 'Project name', 'aria-label': label === 'none' ? 'Project name' : undefined, optional: label === 'optional',
    placeholder: area ? 'What should Oz make?' : 'Summer launch',
    icon: icon === 'leading' || icon === 'both' ? 'search' : undefined, trailingIcon: icon === 'trailing' || icon === 'both' ? 'lock' : undefined,
    prefix: affix === 'prefix' ? '@' : undefined, suffix: affix === 'suffix' ? '.com' : undefined,
    clearable: action_ === 'clear', disabled: state === 'disabled', readOnly: state === 'read-only',
    maxLength: count === 'on' ? 40 : undefined, showCount: count === 'on',
    ...(msg === 'hint' ? { hint: 'Shown on your brand page.' } : msg === 'error' ? { error: 'That name is already taken.' } : {}),
    ...(state === 'read-only' ? { defaultValue: 'Summer launch' } : {}),
  };
  // keyed by what changes the element's structure, so it remounts cleanly (a read-only field starts with a value)
  return (
    <div className="pg">
      <div className="pg-stage">
        <div className="d-panel lit tfd-stage" style={{ background: 'var(--surface-secondary)' }}
          {...rec('panel · lit', [['background', 'surface/secondary'], ['border', 'border/primary'], ['radius', 'radius/xl'], ['effect', 'effect · inner-shade'], ['light', 'light/cursor']])}>
          <div className="tfd-live">
            {area
              ? <TextArea key={`a${state}`} {...common} rows={3} maxRows={6} />
              : <TextField key={`t${action_ === 'show / hide'}${state}`} {...common} type={action_ === 'show / hide' ? 'password' : 'text'} />}
          </div>
        </div>
      </div>
      <div className="pg-panel lit">
        <Opts label="Kind" items={['single line', 'textarea']} value={kind} set={setKind} />
        <Opts label="Size" items={SIZE_NAMES} value={size} set={setSize} />
        <Opts label="State" items={['rest', 'disabled', 'read-only']} value={state} set={setState} />
        <Opts label="Icon" items={['none', 'leading', 'trailing', 'both']} value={icon} set={setIcon} />
        <Opts label="Prefix / suffix" items={['none', 'prefix', 'suffix']} value={affix} set={setAffix} />
        <Opts label="Button" items={['none', 'clear', 'show / hide']} value={action} set={setAction} off={area ? ['show / hide'] : []} />
        <Opts label="Label" items={['label', 'optional', 'none']} value={label} set={setLabel} />
        <Opts label="Message" items={['none', 'hint', 'error']} value={msg} set={setMsg} />
        <Opts label="Count" items={['off', 'on']} value={count} set={setCount} />
      </div>
    </div>
  );
}
