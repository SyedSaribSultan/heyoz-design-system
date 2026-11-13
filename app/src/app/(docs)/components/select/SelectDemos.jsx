'use client';
import { useState } from 'react';
import Select from '@/components/Select';
import Segmented from '@/components/Segmented';
import Button from '@/components/Button';

// Live selects for the Select page. Options are plain data, shared with the page.
export const MODELS = [
  { value: 'flare', label: 'Flare', icon: 'zap', description: 'Fast and cheap, for drafts' },
  { value: 'sunburst', label: 'Sunburst', icon: 'sparkles', description: 'Studio detail for final ads' },
  { value: 'muse', label: 'Muse', icon: 'palette', description: 'Crisp text and flat colour' },
  { value: 'noir', label: 'Noir', icon: 'film', description: 'Not available on your plan', disabled: true },
];
export const RATIOS = [
  { group: 'Social', options: [{ value: '1:1', label: 'Square · 1:1' }, { value: '4:5', label: 'Feed · 4:5' }, { value: '9:16', label: 'Story · 9:16' }] },
  { group: 'Wide', options: [{ value: '16:9', label: 'Video · 16:9' }, { value: '21:9', label: 'Banner · 21:9', disabled: true }] },
];
export const LANGS = ['English', 'Español', 'Français', 'Deutsch', 'Italiano', 'Português', 'Nederlands', 'Svenska', 'Polski', 'Türkçe', 'العربية', '日本語', '한국어', '中文'].map((l) => ({ value: l, label: l }));

export function SelectPlayground() {
  const [size, setSize] = useState('xs'), [value, setValue] = useState('sunburst'), [bad, setBad] = useState(false), [off, setOff] = useState(false);
  return (
    <div className="mnd-play">
      <div className="mnd-stage mnd-stage-field">
        <Select label="Image model" size={size} options={MODELS} value={value} onChange={setValue} invalid={bad} disabled={off}
          hint={bad ? undefined : 'You can change this per ad.'} error={bad ? 'Pick a model your plan includes.' : undefined} />
      </div>
      <div className="mnd-controls">
        <p className="type-label-lg-medium">Size</p>
        <Segmented label="Size" size="xs" value={size} onChange={setSize} items={[['xs', 'xs 32'], ['sm', 'sm 40'], ['md', 'md 48']]} />
        <p className="type-label-lg-medium">State</p>
        <div className="mnd-chips">
          <Button size="xs" type={bad ? 'tertiary' : 'secondary'} aria-pressed={bad} onClick={() => setBad(!bad)}>Invalid</Button>
          <Button size="xs" type={off ? 'tertiary' : 'secondary'} aria-pressed={off} onClick={() => setOff(!off)}>Disabled</Button>
          <Button size="xs" type="secondary" onClick={() => setValue(undefined)}>Clear value</Button>
        </div>
      </div>
    </div>
  );
}

export function FormDemo() {
  const [m, setM] = useState('flare'), [r, setR] = useState(), [sent, setSent] = useState(false);
  const missing = sent && !r;
  return (
    <form className="mnd-form" onSubmit={(e) => { e.preventDefault(); setSent(true); }} noValidate>
      <Select label="Image model" name="model" options={MODELS} value={m} onChange={setM} />
      <Select label="Aspect ratio" name="ratio" placeholder="Choose a ratio" options={RATIOS} value={r} onChange={setR} error={missing ? 'Choose a ratio to continue.' : ''} hint={missing ? undefined : 'Sets the canvas shape.'} />
      <div><Button type="primary" size="xs" onClick={() => setSent(true)}>Continue</Button></div>
    </form>
  );
}
