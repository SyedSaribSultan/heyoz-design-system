'use client';
import { useState } from 'react';
import Checkbox, { CheckboxGroup } from '@/components/Checkbox';
import Switch from '@/components/Switch';
import Segmented from '@/components/Segmented';

// Playground: one live checkbox and the knobs that change it. The knobs are Switches and a Segmented (our own parts).
export function CheckboxPlayground({ sm, md }) {
  const [on, setOn] = useState(true);
  const [size, setSize] = useState('md');
  const [text, setText] = useState(true), [desc, setDesc] = useState(true), [off, setOff] = useState(false), [mixed, setMixed] = useState(false);
  return (
    <div className="sc-play">
      <div className="sc-stage">
        <Checkbox size={size} checked={on} indeterminate={mixed} disabled={off} onChange={(v) => { setOn(v); setMixed(false); }}
          label={text ? 'Remember me' : undefined} description={text && desc ? 'Keep me signed in on this device.' : undefined} aria-label="Remember me" />
      </div>
      <div className="sc-controls">
        <span className="sc-controls-title type-label-lg-medium">Change it</span>
        <Segmented label="Size" size="xs" value={size} onChange={setSize} items={[['sm', `Small · ${sm}`], ['md', `Medium · ${md}`]]} />
        <Switch size="sm" label="Label" checked={text} onChange={setText} />
        <Switch size="sm" label="Description" checked={desc && text} disabled={!text} onChange={setDesc} />
        <Switch size="sm" label="Mixed" checked={mixed} onChange={setMixed} />
        <Switch size="sm" label="Disabled" checked={off} onChange={setOff} />
      </div>
    </div>
  );
}

// A parent checkbox that is mixed when some children are checked: the one honest use of indeterminate.
export function SelectAllDemo() {
  const items = ['Video', 'Image', 'Audio'];
  const [picked, setPicked] = useState(['Video', 'Audio']);
  const all = picked.length === items.length, some = picked.length > 0 && !all;
  return (
    <div className="sc-col">
      <Checkbox label="All formats" checked={all} indeterminate={some} onChange={(v) => setPicked(v ? items : [])} />
      <div className="sc-col" style={{ paddingLeft: 'calc(var(--size-icon-md) + var(--space-8))' }}>
        {items.map((it) => <Checkbox key={it} label={it} checked={picked.includes(it)} onChange={(v) => setPicked(v ? [...picked, it] : picked.filter((p) => p !== it))} />)}
      </div>
    </div>
  );
}

export function GroupDemo({ orientation = 'vertical' }) {
  const [v, setV] = useState({ email: true, push: false, sms: false });
  const set = (k) => (x) => setV({ ...v, [k]: x });
  return (
    <CheckboxGroup label="Notify me by" orientation={orientation}>
      <Checkbox label="Email" checked={v.email} onChange={set('email')} />
      <Checkbox label="Push" checked={v.push} onChange={set('push')} />
      <Checkbox label="SMS" checked={v.sms} onChange={set('sms')} />
    </CheckboxGroup>
  );
}
