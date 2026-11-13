'use client';
import { useState } from 'react';
import Menu from '@/components/Menu';
import Button from '@/components/Button';
import Segmented from '@/components/Segmented';
import { lucide } from '@/lib/Lucide';
import './menu-docs.css';

// Live menus for the Menu page.
const SIZES = [['comfortable', 'Comfortable'], ['compact', 'Compact']];

export function MenuPlayground() {
  const [grid, setGrid] = useState(true), [rulers, setRulers] = useState(false), [density, setDensity] = useState('comfortable');
  const [last, setLast] = useState('Nothing chosen yet');
  const [align, setAlign] = useState('start'), [side, setSide] = useState('bottom');
  const items = [
    { group: 'Project', items: [
      { label: 'New project', icon: 'file-plus', shortcut: 'Ctrl N' },
      { label: 'Open…', icon: 'folder-open', shortcut: 'Ctrl O' },
      { label: 'Share', icon: 'share-2', items: [
        { label: 'Copy link', icon: 'link' },
        { label: 'Email…', icon: 'mail' },
        { label: 'Invite people', icon: 'user-plus', description: 'Needs the Team plan', disabled: true },
      ] },
    ] },
    { group: 'View', items: [
      { label: 'Show grid', kind: 'checkbox', checked: grid, keepOpen: true, onSelect: () => setGrid((v) => !v) },
      { label: 'Show rulers', kind: 'checkbox', checked: rulers, keepOpen: true, onSelect: () => setRulers((v) => !v) },
      ...SIZES.map(([v, l]) => ({ label: l, kind: 'radio', checked: density === v, keepOpen: true, onSelect: () => setDensity(v) })),
    ] },
    { type: 'separator' },
    { label: 'Delete project', icon: 'trash', danger: true, description: 'This cannot be undone' },
  ];
  return (
    <div className="mnd-play">
      <div className="mnd-stage">
        <Menu items={items} align={align} side={side} onSelect={(e) => setLast(e.label)}
          trigger={(p) => <Button {...p} size="xs" type="secondary" iconAfter={lucide('chevron-down')}>Project</Button>} />
        <p className="type-body-md-regular d-dim" aria-live="polite">Last chosen: {last}</p>
      </div>
      <div className="mnd-controls">
        <p className="type-label-lg-medium">Open from</p>
        <Segmented label="Side" size="xs" value={side} onChange={setSide} items={[['bottom', 'Below'], ['top', 'Above']]} />
        <p className="type-label-lg-medium">Line up with</p>
        <Segmented label="Align" size="xs" value={align} onChange={setAlign} items={[['start', 'Start edge'], ['end', 'End edge']]} />
      </div>
    </div>
  );
}

// Enough items to scroll: the surface stops at its max height and the list scrolls inside it.
const LONG = Array.from({ length: 24 }, (_, i) => ({ label: `Layer ${i + 1}`, icon: i % 3 === 0 ? 'image' : i % 3 === 1 ? 'video' : 'type' }));
export function LongMenu() {
  return (
    <Menu items={LONG} trigger={(p) => <Button {...p} size="xs" type="secondary" iconAfter={lucide('chevron-down')}>24 layers</Button>} />
  );
}

// A trigger near the bottom and the right edge of the window: the menu flips above and lines up on the end edge.
export function EdgeMenu({ items }) {
  return (
    <Menu items={items} side="bottom" align="end" trigger={(p) => <Button {...p} size="xs" type="secondary" icon={lucide('ellipsis')} label="More actions" />} />
  );
}

// The submenu example: two submenus under one menu.
const FILE_ITEMS = [
  { label: 'Rename', icon: 'pencil', shortcut: 'F2' },
  { label: 'Export as', icon: 'download', items: [{ label: 'PNG', icon: 'image' }, { label: 'MP4', icon: 'video' }, { label: 'PDF', icon: 'file-text' }] },
  { label: 'Share', icon: 'share-2', items: [{ label: 'Copy link', icon: 'link' }, { label: 'Email…', icon: 'mail' }] },
  { type: 'separator' },
  { label: 'Delete', icon: 'trash', danger: true },
];
export function SubmenuDemo() {
  return <Menu items={FILE_ITEMS} trigger={(p) => <Button {...p} size="xs" type="secondary" iconAfter={lucide('chevron-down')}>File</Button>} />;
}
