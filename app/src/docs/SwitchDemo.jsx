'use client';
import { useState } from 'react';
import Switch from '@/components/Switch';
import Segmented from '@/components/Segmented';
import './selection-docs.css';

// Playground: one live switch and the knobs that change it.
export function SwitchPlayground({ sm, md }) {
  const [on, setOn] = useState(true);
  const [size, setSize] = useState('md'), [pos, setPos] = useState('end');
  const [desc, setDesc] = useState(true), [off, setOff] = useState(false);
  return (
    <div className="sc-play">
      <div className="sc-stage">
        <Switch size={size} labelPosition={pos} checked={on} onChange={setOn} disabled={off}
          label="Auto-save" description={desc ? 'Saves your project every 30 seconds.' : undefined} />
      </div>
      <div className="sc-controls">
        <span className="sc-controls-title type-label-lg-medium">Change it</span>
        <Segmented label="Size" size="xs" value={size} onChange={setSize} items={[['sm', `Small · ${sm}`], ['md', `Medium · ${md}`]]} />
        <Segmented label="Label side" size="xs" value={pos} onChange={setPos} items={[['start', 'Left'], ['end', 'Right']]} />
        <Switch size="sm" label="Description" checked={desc} onChange={setDesc} />
        <Switch size="sm" label="Disabled" checked={off} onChange={setOff} />
      </div>
    </div>
  );
}

// A settings list: the label on the left, the switch at the far edge (block).
export function SettingsDemo() {
  const [v, setV] = useState({ save: true, sound: false, beta: false });
  const set = (k) => (x) => setV({ ...v, [k]: x });
  return (
    <div className="sc-list">
      <Switch block labelPosition="start" label="Auto-save" description="Saves your project every 30 seconds." checked={v.save} onChange={set('save')} />
      <Switch block labelPosition="start" label="Sound effects" checked={v.sound} onChange={set('sound')} />
      <Switch block labelPosition="start" label="Early features" description="Try new tools before everyone else." checked={v.beta} onChange={set('beta')} />
    </div>
  );
}
