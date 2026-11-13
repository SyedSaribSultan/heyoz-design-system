'use client';
import { useState } from 'react';
import Chip, { ChipGroup } from '@/components/Chip';
import Button from '@/components/Button';
import Segmented from '@/components/Segmented';
import { lucide } from '@/lib/Lucide';
import { Playground, Control } from '@/docs/display-controls';

const LOGO = '/home/openai-selected.svg';

// Playground: one live chip and the controls that build it.
export function ChipPlayground() {
  const [kind, setKind] = useState('action'), [size, setSize] = useState('xs'), [lead, setLead] = useState('icon'), [trail, setTrail] = useState('none'), [off, setOff] = useState(false);
  const [on, setOn] = useState(true), [shown, setShown] = useState(true);
  const p = {
    size, disabled: off, icon: lead === 'icon' ? 'wand-sparkles' : undefined, image: lead === 'logo' ? LOGO : undefined,
    ...(trail === 'menu' ? { iconAfter: 'chevron-down' } : trail === 'clear' ? { iconAfter: 'chevrons-up-down', iconAfterHover: 'x' } : {}),
  };
  return (
    <Playground controls={<>
      <Control label="Kind"><Segmented label="Kind" items={[['action', 'Action'], ['filter', 'Filter'], ['input', 'Input']]} value={kind} onChange={setKind} /></Control>
      <Control label="Size"><Segmented label="Size" items={[['xs', 'xs · 32'], ['2xs', '2xs · 28']]} value={size} onChange={setSize} /></Control>
      <Control label="Leading"><Segmented label="Leading" items={[['none', 'None'], ['icon', 'Icon'], ['logo', 'Logo']]} value={lead} onChange={setLead} /></Control>
      <Control label="Trailing"><Segmented label="Trailing" items={[['none', 'None'], ['menu', 'Chevron'], ['clear', 'Swap on hover']]} value={trail} onChange={setTrail} /></Control>
      <Control label="Disabled"><Segmented label="Disabled" items={[['no', 'Off'], ['yes', 'On']]} value={off ? 'yes' : 'no'} onChange={(v) => setOff(v === 'yes')} /></Control>
    </>}>
      {kind === 'action' && <Chip {...p}>Enhance</Chip>}
      {kind === 'filter' && <Chip {...p} selected={on} onSelectedChange={setOn}>Video</Chip>}
      {kind === 'input' && (shown ? <Chip {...p} iconAfter={undefined} iconAfterHover={undefined} onRemove={() => setShown(false)}>design@brand.com</Chip>
        : <Button type="tertiary" size="xs" onClick={() => setShown(true)}>Add it back</Button>)}
    </Playground>
  );
}

// Filter chips toggle; input chips remove (Backspace / Delete, or the cross); action chips press.
export function ChipKinds() {
  const [filters, setFilters] = useState({ Image: true, Video: false, Audio: false });
  const [tags, setTags] = useState(['Launch', 'Summer sale', 'Retargeting']);
  const [pressed, setPressed] = useState(0);
  return (
    <div className="dx-gallery" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
      <div className="dx-item"><div className="dx-view" role="group" aria-label="Formats">
        {Object.keys(filters).map((f) => <Chip key={f} selected={filters[f]} onSelectedChange={(v) => setFilters({ ...filters, [f]: v })}>{f}</Chip>)}
      </div><span className="d-dim type-label-lg-regular">Filter: toggles on and off (aria-pressed).</span></div>
      <div className="dx-item"><div className="dx-view">
        {tags.map((tg) => <Chip key={tg} onRemove={() => setTags(tags.filter((x) => x !== tg))}>{tg}</Chip>)}
        {!tags.length && <Button type="tertiary" size="xs" onClick={() => setTags(['Launch', 'Summer sale', 'Retargeting'])}>Reset</Button>}
      </div><span className="d-dim type-label-lg-regular">Input: focus one, press Backspace or Delete; focus moves to the next.</span></div>
      <div className="dx-item"><div className="dx-view">
        <Chip icon="wand-sparkles" onClick={() => setPressed(pressed + 1)}>Enhance</Chip>
        <Chip image={LOGO} iconAfter="chevrons-up-down" iconAfterHover="x">Static Ads</Chip>
      </div><span className="d-dim type-label-lg-regular">Action: a setting. The second swaps its trailing icon on hover and focus (Home). Pressed {pressed}×.</span></div>
    </div>
  );
}

// Choice chips: one chosen, one indicator that slides (D-032).
export function ChipChoices() {
  const [aspect, setAspect] = useState('9:16'), [mode, setMode] = useState('image'), [wrap, setWrap] = useState('1080p');
  return (
    <div className="dx-gallery" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
      <div className="dx-item"><div className="dx-view"><ChipGroup label="Aspect ratio" items={['1:1', '4:5', '9:16', '16:9'].map((x) => [x, x])} value={aspect} onChange={setAspect} /></div><span className="d-dim type-label-lg-regular">A row. Arrow keys move and choose.</span></div>
      <div className="dx-item"><div className="dx-view"><ChipGroup label="Mode" items={[{ value: 'image', label: 'Image', icon: 'image' }, { value: 'video', label: 'Video', icon: 'video' }, { value: 'audio', label: 'Audio', icon: 'sparkles', disabled: true }]} value={mode} onChange={setMode} /></div><span className="d-dim type-label-lg-regular">With icons; a disabled option keeps its place.</span></div>
      <div className="dx-item" style={{ maxWidth: 260 }}><div className="dx-view" style={{ width: 200 }}><ChipGroup size="2xs" label="Resolution" items={['720p', '1080p', '1440p', '2160p', '4320p'].map((x) => [x, x])} value={wrap} onChange={setWrap} /></div><span className="d-dim type-label-lg-regular">2xs, wrapping: the indicator travels in a straight line to the next row.</span></div>
    </div>
  );
}
