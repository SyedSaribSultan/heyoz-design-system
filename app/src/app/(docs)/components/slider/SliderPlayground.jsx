'use client';
import { useState } from 'react';
import Slider from '@/components/Slider';
import Segmented from '@/components/Segmented';
import { Panel } from '@/docs/ui';

// Playground: every option of the slider. Options never disappear (the panel never moves).
const Opt = ({ label, items, value, set, off }) => (
  <div className="sl-pg-opt">
    <span className="type-label-lg-regular d-dim">{label}</span>
    <Segmented label={label} items={items} value={value} onChange={set} off={off} />
  </div>
);
const onOff = [['off', 'Off'], ['on', 'On']];

export default function SliderPlayground() {
  const [kind, setKind] = useState('single');
  const [ticks, setTicks] = useState('off');
  const [limits, setLimits] = useState('on');
  const [field, setField] = useState('off');
  const [state, setState] = useState('live');
  const [single, setSingle] = useState(40);
  const [pair, setPair] = useState([20, 70]);
  const range = kind === 'range';
  return (
    <div className="sl-pg">
      <Panel lit pad={24} className="sl-pg-stage">
        <div className="sl-pg-slider">
          {range
            ? <Slider key="r" label="Price range" range value={pair} onChange={setPair} unit="$" ticks={ticks === 'on' ? 10 : undefined} limits={limits === 'on'} field={field === 'on'} disabled={state === 'disabled'} />
            : <Slider key="s" label="Opacity" value={single} onChange={setSingle} unit="%" ticks={ticks === 'on' ? 10 : undefined} limits={limits === 'on'} field={field === 'on'} disabled={state === 'disabled'} />}
        </div>
      </Panel>
      <Panel lit pad={16} className="sl-pg-controls">
        <Opt label="Kind" items={[['single', 'Single'], ['range', 'Range']]} value={kind} set={setKind} />
        <Opt label="Ticks" items={onOff} value={ticks} set={setTicks} />
        <Opt label="Min / max" items={onOff} value={limits} set={setLimits} />
        <Opt label="Number field" items={onOff} value={field} set={setField} />
        <Opt label="State" items={[['live', 'Live'], ['disabled', 'Disabled']]} value={state} set={setState} />
      </Panel>
    </div>
  );
}
