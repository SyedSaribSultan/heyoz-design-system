'use client';
import { useState } from 'react';
import Button, { LinkButton, BUTTON, SIZE_NAMES, TYPE_NAMES, LINK_NAMES, ICON_LIVE } from '@/components/Button';
import IconGrid from './IconGrid';
import Segmented from '@/components/Segmented';
import { lucide } from './Lucide';

// Button playground: every parameter, real relative sizes, one zoom for all sizes so sizes compare.
// The anatomy is drawn on a real Button at the chosen zoom. Overlays sit inside the zoomed
// box, so every mark lines up with the real layout; callout text sits outside, at 1×.
const ZOOMS = [1, 1.5, 2, 3, 4, 6, 8];
export const PARTS = [
  ['1', 'Frame', 'Auto layout, horizontal. Carries fill, border, radius, inner shade.'],
  ['2', 'Leading icon frame', 'Square, from the icon scale by text size (16, 20 or 24). The icon grid is drawn inside: the vector fills the key square (75%), so at least 1/8 of the frame stays clear. Optional.'],
  ['3', 'Label', 'Text style body/{size}/medium. Buttons use the body role only.'],
  ['4', 'Trailing icon frame', 'Same as the leading one. Optional; becomes the spinner when loading.'],
  ['5', 'Padding x', 'Left and right. Top and bottom are not set: the height is fixed and children are centred.'],
  ['6', 'Gap', 'Between every child.'],
  ['7', 'Height', 'size/control/{size}, fixed.'],
  ['8', 'Radius', 'Squircle: height × 0.375, rounded to the nearest 4. Pill: radius/full.'],
];

// One control: a label and a Segmented control. Options never disappear; ones that don't apply
// are disabled, so the panel never moves.
const Opts = ({ label, items, value, set, cols, off = [] }) => (
  <div className="pg-row">
    <span className="pg-label type-label-lg-regular">{label}</span>
    <Segmented label={label} items={items} value={value} onChange={set} cols={cols} off={off} />
  </div>
);
const opt = (list) => list.map((v) => [v, v]);

export default function ButtonAnatomy() {
  const [type, setType] = useState('secondary');
  const [size, setSize] = useState('xs');
  const [shape, setShape] = useState('squircle');
  const [content, setContent] = useState('label + icons');
  const [state, setState] = useState('live');
  const [marks, setMarks] = useState('on');
  const [zi, setZi] = useState(3);
  const link = type.startsWith('link-'), linkType = type.replace('link-', '');
  // the value in effect: a disabled choice falls back without changing what you picked
  const content_ = link && content === 'icon only' ? 'label + icons' : content;
  const state_ = link && state === 'loading' ? 'live' : state;
  const z = ZOOMS[zi], s = BUTTON.sizes.find((x) => x.size === size);
  const iconOnly = content_ === 'icon only';
  const iconTop = (s.height - s.icon) / 2;
  const radius = shape === 'pill' ? s.height / 2 : s.radius;
  const t = BUTTON.types[link ? 'secondary' : type];
  const stateProps = { live: {}, hover: { state: 'hover' }, pressed: { state: 'active' }, disabled: { disabled: true }, loading: { loading: true } }[state_];
  const showMarks = marks === 'on' && !link;
  const L = iconOnly ? [] : [['5', s.paddingX / 2], ['2', s.paddingX + s.icon / 2], ['6', s.paddingX + s.icon + s.gap / 2]];
  const vals = { '1': `${t.rest.fill} · ${t.rest.border} · stroke/1`, '2': `${s.icon} frame · ${+(s.icon * ICON_LIVE).toFixed(2)} vector · ${s.iconToken}`, '3': `${s.label.slice(5)} · ${s.font}/${s.lineHeight}`, '4': `${s.icon} frame · ${+(s.icon * ICON_LIVE).toFixed(2)} vector`,
    '5': `${s.paddingX}px · ${s.paddingXToken || 'set, not a token'}`, '6': `${s.gap}px · ${s.gapToken}`, '7': `${s.height}px · ${s.heightToken}`, '8': shape === 'pill' ? 'radius/full (1000)' : (s.radiusSet ? `${s.radius}px · set` : `${s.radius}px · ${s.height} × ${BUTTON.squircle}, to the nearest 4`) };
  return (
    <div className="an">
      <div className="pg">
      <div className="pg-stage">
      <div className="an-canvas" style={{ '--an-z': z }}>
        <div className="an-zoombar lit">
          <Button type="ghost" size="xs" icon={lucide('minus')} label="Zoom out" disabled={zi === 0} onClick={() => setZi(Math.max(0, zi - 1))} />
          <span className="type-label-lg-medium">{z * 100}%</span>
          <Button type="ghost" size="xs" icon={lucide('plus')} label="Zoom in" disabled={zi === ZOOMS.length - 1} onClick={() => setZi(Math.min(ZOOMS.length - 1, zi + 1))} />
          <Button type="ghost" size="xs" onClick={() => setZi(0)}>Reset</Button>
        </div>
        <div className="an-fig" data-marks={showMarks || undefined}>
          {/* With the measure marks on, the specimen is a picture: no pointer (docs.css) and out of the Tab order. */}
          <div className="an-zoom" style={{ zoom: z, borderRadius: link ? 0 : radius, overflow: showMarks ? 'hidden' : 'visible' }}>
            {link
              ? <LinkButton type={linkType} size={size} icon={content_ === 'label + icons' ? lucide('circle') : undefined} iconAfter={content_ === 'label + icons' ? lucide('circle') : undefined} {...(state_ === 'live' ? {} : state_ === 'disabled' ? { disabled: true } : { state: state_ === 'pressed' ? 'active' : 'hover' })} tabIndex={showMarks ? -1 : undefined}>button</LinkButton>
              : <Button type={type} size={size} shape={shape} icon={content_ === 'label' ? undefined : iconOnly ? lucide('circle') : lucide('circle')} iconAfter={content_ === 'label + icons' ? lucide('circle') : undefined} label="button" {...stateProps} tabIndex={showMarks ? -1 : undefined}>{iconOnly ? null : 'button'}</Button>}
            {showMarks && <>
              {!iconOnly && <><i className="an-pad" style={{ left: 0, width: s.paddingX }} /><i className="an-pad" style={{ right: 0, width: s.paddingX }} /></>}
              {content_ === 'label + icons' && <>
                <i className="an-gap" style={{ left: s.paddingX + s.icon, width: s.gap }} /><i className="an-gap" style={{ right: s.paddingX + s.icon, width: s.gap }} />
                <i className="an-icon" style={{ left: s.paddingX, top: iconTop, width: s.icon, height: s.icon }} /><i className="an-icon" style={{ right: s.paddingX, top: iconTop, width: s.icon, height: s.icon }} />
                <IconGrid className="an-grid" style={{ left: s.paddingX, top: iconTop, width: s.icon, height: s.icon }} /><IconGrid className="an-grid" style={{ right: s.paddingX, top: iconTop, width: s.icon, height: s.icon }} />
                <i className="an-label" style={{ left: s.paddingX + s.icon + s.gap, right: s.paddingX + s.icon + s.gap, top: iconTop, height: s.lineHeight }} />
              </>}
              {content_ === 'label' && <i className="an-label" style={{ left: s.paddingX, right: s.paddingX, top: (s.height - s.lineHeight) / 2, height: s.lineHeight }} />}
              {iconOnly && <><i className="an-icon" style={{ left: iconTop, top: iconTop, width: s.icon, height: s.icon }} /><IconGrid className="an-grid" style={{ left: iconTop, top: iconTop, width: s.icon, height: s.icon }} /></>}
            </>}
          </div>
          {showMarks && <>
            {L.map(([n, x]) => <span key={n} className="an-pin an-top" style={{ left: x * z }}>{n}</span>)}
            {content_ === 'label + icons' && <span className="an-pin an-top" style={{ right: (s.paddingX + s.icon / 2) * z }}>4</span>}
            {!iconOnly && <span className="an-pin an-top" style={{ left: '50%' }}>3</span>}
            {iconOnly && <span className="an-pin an-top" style={{ left: '50%' }}>2</span>}
            <span className="an-pin an-bottom" style={{ left: '50%' }}>1</span>
            <span className="an-dim" style={{ height: s.height * z }}><span className="an-pin">7</span></span>
            <span className="an-pin an-corner" style={{ left: -20, top: -20 }}>8</span>
          </>}
        </div>
      </div>
      </div>
      <div className="pg-panel lit">
        <Opts label="Type" cols={2} value={type} set={setType}
          items={[...TYPE_NAMES.map((v) => [v, v]), ...LINK_NAMES.map((v) => [`link-${v}`, `link ${v}`])]} />
        <Opts label="Size" cols={4} value={size} set={setSize} items={opt(SIZE_NAMES)} />
        <Opts label="Content" cols={3} value={content_} set={setContent} items={[['label + icons', 'icons'], ['label', 'label'], ['icon only', 'icon only']]} off={link ? ['icon only'] : []} />
        <Opts label="Shape" cols={2} value={shape} set={setShape} items={opt(['squircle', 'pill'])} off={link ? ['squircle', 'pill'] : []} />
        <Opts label="State" cols={3} value={state_} set={setState} items={opt(['live', 'hover', 'pressed', 'disabled', 'loading'])} off={link ? ['loading'] : []} />
        <Opts label="Anatomy" cols={2} value={link ? 'off' : marks} set={setMarks} items={opt(['on', 'off'])} off={link ? ['on', 'off'] : []} />
      </div>
      </div>
      <ol className="an-legend" data-dim={showMarks ? undefined : ''}>
        {PARTS.filter(([n]) => !(iconOnly && ['3', '4', '5', '6'].includes(n)) && !(content_ === 'label' && ['2', '4', '6'].includes(n))).map(([n, name, what]) => (
          <li key={n}><span className="an-pin an-static">{n}</span><div className="d-stack" style={{ gap: 0 }}>
            <span className="type-label-lg-medium">{name} <span className="d-dim">· {vals[n]}</span></span>
            <span className="d-dim type-body-md-regular">{what}</span></div></li>
        ))}
      </ol>
    </div>
  );
}
