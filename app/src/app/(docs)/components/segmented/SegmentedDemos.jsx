'use client';
import { useState } from 'react';
import Segmented from '@/components/Segmented';
import { SIZE_NAMES } from '@/components/Button';
import { lucide } from '@/lib/Lucide';

// A live control: keeps its own value, so every specimen on the page can be clicked and keyboarded.
export function Live({ initial, ...props }) {
  const [v, set] = useState(initial);
  return <Segmented {...props} value={v} onChange={set} />;
}

const KINDS = {
  label: [['day', 'Day'], ['week', 'Week'], ['month', 'Month']],
  both: [['list', 'List', { icon: lucide('list') }], ['grid', 'Grid', { icon: lucide('layout-grid') }], ['rows', 'Rows', { icon: lucide('rows-3') }]],
  icon: [['list', null, { icon: lucide('list'), label: 'List' }], ['grid', null, { icon: lucide('layout-grid'), label: 'Grid' }], ['rows', null, { icon: lucide('rows-3'), label: 'Rows' }]],
};
const Row = ({ label, children }) => (
  <div className="sg-pg-row"><span className="sg-pg-label type-label-lg-regular">{label}</span>{children}</div>
);
const Opts = ({ label, items, value, set }) => <Segmented label={label} items={items} value={value} onChange={set} />;

// Playground: size, options, width, a disabled option. The control sits in a fixed-height stage, so the panel never moves.
export function Playground() {
  const [size, setSize] = useState('xs'), [kind, setKind] = useState('label'), [fit, setFit] = useState('fill'), [off, setOff] = useState('none');
  const [v, setV] = useState('week');
  const items = KINDS[kind];
  const value = items.some(([x]) => x === v) ? v : items[0][0];
  return (
    <div className="sg-pg">
      <div className="sg-stage"><div className="sg-stage-in" data-fit={fit === 'hug' || undefined}>
        <Segmented label="Playground" items={items} value={value} onChange={setV} size={size} fit={fit === 'hug'} off={off === 'one' ? [items[2][0]] : []} />
      </div></div>
      <div className="sg-pg-controls">
        <Row label="Size"><Segmented label="Size" size="2xs" items={SIZE_NAMES.map((s) => [s, s])} value={size} onChange={setSize} /></Row>
        <Row label="Options"><Opts label="Options" items={[['label', 'Label'], ['both', 'Icon + label'], ['icon', 'Icon only']]} value={kind} set={setKind} /></Row>
        <Row label="Width"><Opts label="Width" items={[['fill', 'Fill'], ['hug', 'Hug']]} value={fit} set={setFit} /></Row>
        <Row label="Third option"><Opts label="Third option" items={[['none', 'Enabled'], ['one', 'Disabled']]} value={off} set={setOff} /></Row>
      </div>
    </div>
  );
}
