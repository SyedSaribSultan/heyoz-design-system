'use client';
import { useState } from 'react';
import Progress, { Spinner } from '@/components/Progress';
import Slider from '@/components/Slider';
import Segmented from '@/components/Segmented';
import { Panel } from '@/docs/ui';

// Playground: a bar and a ring side by side, driven by the same value, size and tone.
const Opt = ({ label, items, value, set, off }) => (
  <div className="pgd-opt">
    <span className="type-label-lg-regular d-dim">{label}</span>
    <Segmented label={label} items={items} value={value} onChange={set} off={off} />
  </div>
);

export default function ProgressPlayground() {
  const [kind, setKind] = useState('determinate');
  const [value, setValue] = useState(60);
  const [size, setSize] = useState('md');
  const [tone, setTone] = useState('neutral');
  const [ring, setRing] = useState('md');
  const det = kind === 'determinate';
  return (
    <div className="pgd">
      <Panel lit pad={24} className="pgd-stage">
        <div className="pgd-bar"><Progress label="Rendering" value={det ? value : undefined} size={size} tone={tone} /></div>
        <div className="pgd-ring"><Spinner size={ring} value={det ? value : undefined} tone={tone} label="Rendering" /></div>
      </Panel>
      <Panel lit pad={16} className="pgd-controls">
        <Opt label="Kind" items={[['determinate', 'Determinate'], ['indeterminate', 'Indeterminate']]} value={kind} set={setKind} />
        <Opt label="Bar height" items={[['sm', '2'], ['md', '4'], ['lg', '8']]} value={size} set={setSize} />
        <Opt label="Ring size" items={['xs', 'sm', 'md', 'lg', 'xl'].map((s) => [s, s])} value={ring} set={setRing} />
        <Opt label="Tone" items={['neutral', 'brand', 'success', 'critical'].map((s) => [s, s])} value={tone} set={setTone} />
        <div className="pgd-opt pgd-value">
          <Slider label="Value" value={value} onChange={setValue} unit="%" disabled={!det} />
        </div>
      </Panel>
    </div>
  );
}
