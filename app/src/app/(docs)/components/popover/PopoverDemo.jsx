'use client';
import { useState } from 'react';
import Button from '@/components/Button';
import Segmented from '@/components/Segmented';
import Popover from '@/components/Popover';
import Tooltip from '@/components/Tooltip';
import { lucide } from '@/lib/Lucide';

// Live specimens for the Popover page.
const Row = ({ label, children }) => <div className="pp-ctl"><span className="type-label-lg-regular pp-ctl-label">{label}</span>{children}</div>;

// The body of the demo popovers: some text, or a few controls.
function Controls() {
  const [res, setRes] = useState('1080p');
  const [fmt, setFmt] = useState('mp4');
  return (
    <div className="pp-form">
      <span className="type-label-md-medium pp-form-label">Resolution</span>
      <Segmented label="Resolution" items={[['720p', '720p'], ['1080p', '1080p'], ['4k', '4K']]} value={res} onChange={setRes} />
      <span className="type-label-md-medium pp-form-label">Format</span>
      <Segmented label="Format" items={[['mp4', 'MP4'], ['mov', 'MOV']]} value={fmt} onChange={setFmt} />
    </div>
  );
}
const TEXT = <p className="pp-text">Your video renders in the background. You can close this and keep editing; Oz tells you when it is ready.</p>;

export function Playground() {
  const [size, setSize] = useState('md');
  const [placement, setPlacement] = useState('bottom');
  const [align, setAlign] = useState('start');
  const [header, setHeader] = useState('yes');
  const [footer, setFooter] = useState('yes');
  const [body, setBody] = useState('controls');
  return (
    <div className="pp-pg">
      <div className="pp-stage">
        <Popover trigger={<Button type="secondary" size="xs" iconAfter={lucide('chevron-down')}>Export</Button>}
          title={header === 'yes' ? 'Export' : undefined} label="Export" size={size} placement={placement} align={align}
          footer={footer === 'yes' ? ({ close }) => <><Button type="ghost" size="xs" onClick={close}>Cancel</Button><Button type="primary" size="xs" onClick={close}>Export video</Button></> : undefined}>
          {body === 'controls' ? <Controls /> : TEXT}
        </Popover>
      </div>
      <div className="pp-controls">
        <Row label="Size"><Segmented label="Size" items={[['sm', 'sm 240'], ['md', 'md 320'], ['lg', 'lg 400']]} value={size} onChange={setSize} /></Row>
        <Row label="Placement"><Segmented label="Placement" cols={2} items={[['bottom', 'Bottom'], ['top', 'Top'], ['left', 'Left'], ['right', 'Right']]} value={placement} onChange={setPlacement} /></Row>
        <Row label="Align"><Segmented label="Align" items={[['start', 'Start'], ['center', 'Center'], ['end', 'End']]} value={align} onChange={setAlign} /></Row>
        <Row label="Header"><Segmented label="Header" items={[['yes', 'Title and close'], ['no', 'None']]} value={header} onChange={setHeader} /></Row>
        <Row label="Footer"><Segmented label="Footer" items={[['yes', 'Actions'], ['no', 'None']]} value={footer} onChange={setFooter} /></Row>
        <Row label="Body"><Segmented label="Body" items={[['controls', 'Controls'], ['text', 'Text']]} value={body} onChange={setBody} /></Row>
      </div>
    </div>
  );
}

// One trigger per side: the live version of the placement rules.
export function Sides() {
  return (
    <div className="pp-bar">
      {['bottom', 'top', 'left', 'right'].map((p) => (
        <Popover key={p} trigger={<Button type="secondary" size="xs">{p}</Button>} title={`Opens ${p}`} size="sm" placement={p} align={p === 'left' || p === 'right' ? 'center' : 'start'}>{TEXT}</Popover>
      ))}
    </div>
  );
}

// A popover is fixed to the window: a box that clips its content (overflow: hidden, a scroller) cannot cut it.
export function Clipped() {
  return (
    <div className="pp-clip">
      <Popover trigger={<Button type="secondary" size="xs">Inside a clipping box</Button>} title="Not clipped" size="sm" footer={({ close }) => <Button type="primary" size="xs" onClick={close}>Got it</Button>}>
        <p className="pp-text">The box around the button has overflow hidden and is shorter than this popover.</p>
      </Popover>
    </div>
  );
}

// A popover inside a popover: Esc closes the inner one first.
export function Nested() {
  return (
    <Popover trigger={<Button type="secondary" size="xs">Open the outer one</Button>} title="Outer" size="md">
      <div className="pp-form">
        <p className="pp-text">Esc closes the newest popover first. A press inside the inner one does not close this one.</p>
        <div className="pp-bar">
          <Popover trigger={<Button type="tertiary" size="xs">Open the inner one</Button>} title="Inner" size="sm" placement="right">{TEXT}</Popover>
          <Tooltip content="Tooltips sit above popovers"><Button type="ghost" size="xs" icon={lucide('info')} label="Info" /></Tooltip>
        </div>
      </div>
    </Popover>
  );
}
