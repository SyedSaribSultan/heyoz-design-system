'use client';
import { useState } from 'react';
import Button from '@/components/Button';
import Segmented from '@/components/Segmented';
import Tooltip from '@/components/Tooltip';
import { lucide } from '@/lib/Lucide';

// Live specimens for the Tooltip page.
const TEXT = { short: 'Close sidebar', long: 'Shows every frame of the clip at full size, so you can cut it exactly where you want', lines: 'Export video\nMP4, 1080p' };
const Row = ({ label, children }) => <div className="ttp-ctl"><span className="type-label-lg-regular ttp-ctl-label">{label}</span>{children}</div>;

export function Playground() {
  const [placement, setPlacement] = useState('top');
  const [text, setText] = useState('short');
  const [keys, setKeys] = useState('none');
  const [wide, setWide] = useState('no');
  return (
    <div className="ttp-pg">
      <div className="ttp-stage">
        <Tooltip content={TEXT[text]} shortcut={keys === 'none' ? undefined : keys === 'one' ? 'Ctrl B' : 'Ctrl Shift P'} placement={placement} wide={wide === 'yes'}>
          <Button type="secondary" size="xs">Hover or focus me</Button>
        </Tooltip>
      </div>
      <div className="ttp-controls">
        <Row label="Placement"><Segmented label="Placement" cols={2} items={[['top', 'Top'], ['bottom', 'Bottom'], ['left', 'Left'], ['right', 'Right']]} value={placement} onChange={setPlacement} /></Row>
        <Row label="Text"><Segmented label="Text" items={[['short', 'Short'], ['long', 'Long'], ['lines', 'Two lines']]} value={text} onChange={setText} /></Row>
        <Row label="Shortcut"><Segmented label="Shortcut" items={[['none', 'None'], ['one', 'Ctrl B'], ['three', '3 keys']]} value={keys} onChange={setKeys} /></Row>
        <Row label="Max width"><Segmented label="Max width" items={[['no', 'Normal'], ['yes', 'Wide']]} value={wide} onChange={setWide} /></Row>
      </div>
    </div>
  );
}

// Six icon buttons in a row: the first hover waits, then moving along the row is instant (warm).
const TOOLS = [['scissors', 'Split at playhead', 'S'], ['copy', 'Duplicate', 'Ctrl D'], ['trash', 'Delete', 'Backspace'], ['undo-2', 'Undo', 'Ctrl Z'], ['redo-2', 'Redo', 'Ctrl Shift Z'], ['download', 'Export']];
export function Toolbar() {
  return (
    <div className="ttp-bar" role="toolbar" aria-label="Clip tools">
      {TOOLS.map(([icon, label, keys]) => (
        <Tooltip key={icon} content={label} shortcut={keys} describe={false}>
          <Button type="ghost" size="xs" icon={lucide(icon)} label={label} />
        </Tooltip>
      ))}
    </div>
  );
}

// One button per placement: the live version of the four specimens.
export function Sides() {
  return (
    <div className="ttp-bar">
      {['top', 'bottom', 'left', 'right'].map((p) => (
        <Tooltip key={p} content={`Placed ${p}`} placement={p}><Button type="secondary" size="xs">{p}</Button></Tooltip>
      ))}
    </div>
  );
}

// A control that is disabled gets no events, so a focusable span carries the tooltip.
export function Disabled() {
  return (
    <Tooltip content="Add a clip to export">
      <span tabIndex={0} className="ttp-wrap"><Button type="primary" size="xs" disabled>Export video</Button></span>
    </Tooltip>
  );
}
