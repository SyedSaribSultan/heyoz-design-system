'use client';
import { useState } from 'react';
import Tabs from '@/components/Tabs';
import Segmented from '@/components/Segmented';
import { lucide } from '@/lib/Lucide';

// Panel content for the specimens: one plain line, so the swap is easy to see.
export const Panel1 = ({ children }) => <p className="tb-panel type-body-md-regular">{children}</p>;

const BASE = [
  ['assets', 'Assets', 'image', 12],
  ['brand', 'Brand', 'palette', null],
  ['members', 'Members', 'users', 4],
  ['billing', 'Billing', 'credit-card', null],
];
const MORE = [['activity', 'Activity', 'activity'], ['exports', 'Exports', 'folder'], ['templates', 'Templates', 'layout-grid'], ['integrations', 'Integrations', 'settings'], ['archive', 'Archive', 'inbox'], ['help', 'Help', 'file-text']];
const build = (rows, icons, counts, offOne) => rows.map(([value, label, icon, count], i) => ({
  value, label, icon: icons ? lucide(icon) : undefined, count: counts ? count : undefined, off: offOne && i === 2,
  panel: <Panel1>{label}: the panel for this tab. It stays mounted when you leave it.</Panel1>,
}));

const Ctl = ({ label, children }) => (
  <div className="tb-pg-row"><span className="tb-pg-label type-label-lg-regular">{label}</span>{children}</div>
);
const Opts = ({ label, items, value, set }) => <Segmented label={label} items={items} value={value} onChange={set} />;

// Playground: size, activation, icons, counts, a disabled tab, more tabs than fit, stretch.
export function Playground() {
  const [size, setSize] = useState('md'), [act, setAct] = useState('auto'), [icons, setIcons] = useState('off'), [counts, setCounts] = useState('off');
  const [dis, setDis] = useState('off'), [many, setMany] = useState('off'), [width, setWidth] = useState('hug');
  const rows = many === 'on' ? [...BASE, ...MORE.map((m) => [...m, null])] : BASE;
  const items = build(rows, icons === 'on', counts === 'on', dis === 'on');
  return (
    <div className="tb-pg">
      <div className="tb-stage"><div className="tb-stage-in">
        <Tabs key={`${many}-${width}`} label="Playground" items={items} size={size} activation={act} stretch={width === 'stretch'} />
      </div></div>
      <div className="tb-pg-controls">
        <Ctl label="Size"><Opts label="Size" items={[['md', 'md · 40'], ['sm', 'sm · 32']]} value={size} set={setSize} /></Ctl>
        <Ctl label="Activation"><Opts label="Activation" items={[['auto', 'Automatic'], ['manual', 'Manual']]} value={act} set={setAct} /></Ctl>
        <Ctl label="Icons"><Opts label="Icons" items={[['off', 'Off'], ['on', 'On']]} value={icons} set={setIcons} /></Ctl>
        <Ctl label="Counts"><Opts label="Counts" items={[['off', 'Off'], ['on', 'On']]} value={counts} set={setCounts} /></Ctl>
        <Ctl label="Third tab"><Opts label="Third tab" items={[['off', 'Enabled'], ['on', 'Disabled']]} value={dis} set={setDis} /></Ctl>
        <Ctl label="Width"><Opts label="Width" items={[['hug', 'Hug'], ['stretch', 'Stretch']]} value={width} set={setWidth} /></Ctl>
        <Ctl label="Tabs"><Opts label="Number of tabs" items={[['off', '4'], ['on', '10']]} value={many} set={setMany} /></Ctl>
      </div>
    </div>
  );
}

// The overflow specimen: ten tabs in a narrow frame, so the list scrolls and the edges fade.
export function Overflow() {
  return (
    <div className="tb-narrow">
      <Tabs label="Overflow" items={build([...BASE, ...MORE.map((m) => [...m, null])], true, false, false)} defaultValue="members" />
    </div>
  );
}
