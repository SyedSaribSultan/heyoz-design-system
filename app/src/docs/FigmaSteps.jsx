import Button, { BUTTON, ICON_LIVE } from '@/components/Button';
import IconGrid from './IconGrid';
import { lucide } from './Lucide';

// How to build the button in Figma, step by step, drawn at 3× for xs.
const md = BUTTON.sizes.find((s) => s.size === 'xs'); // the everyday size
const Ico = ({ src }) => <span className="fg-ico"><IconGrid className="fg-grid" /><span style={{ '--icon': `url(${src})` }} /></span>;
const W = lucide('circle'), C = lucide('circle'); // circle icons, so the frame edges show

export const STEPS = [
  { title: 'Label', art: <span className="fg-txt">button</span>, do: [
    'Text layer "button".', `Text style ${md.label.slice(5)} (${md.font}/${md.lineHeight}). Fill content/primary.`, 'Resizing: hug width, hug height.'] },
  { title: 'Icon frames', art: <><Ico src={W} /><span className="fg-txt">button</span><Ico src={C} /></>, do: [
    `Frame ${md.icon} × ${md.icon} (${md.iconToken}), chosen by text size. No fill. Clip content on.`, `Use the icon component as is: it is drawn on the icon grid, the vector filling the key square, ${md.icon * ICON_LIVE} × ${md.icon * ICON_LIVE} centred. Constraints Scale.`, 'Icon colour content/primary. One on each side of the label.'] },
  { title: 'Auto layout', art: <span className="fg-al fg-nopad"><Ico src={W} /><span className="fg-txt">button</span><Ico src={C} /></span>, do: [
    'Select icon, label, icon → Shift + A.', `Direction horizontal. Gap ${md.gap} (${md.gapToken}).`, 'Alignment: centre (middle-centre).'] },
  { title: 'Size the frame', art: <span className="fg-al"><Ico src={W} /><span className="fg-txt">button</span><Ico src={C} /></span>, do: [
    `Height fixed ${md.height} (${md.heightToken}). Width hug.`, `Padding left and right ${md.paddingX} (${md.paddingXToken}).`, 'Padding top and bottom 0: the fixed height and centring do the rest.'] },
  { title: 'Style the frame', art: <span style={{ zoom: 3, display: 'inline-flex' }}><Button size="xs" icon={W} iconAfter={C}>button</Button></span>, do: [
    'Fill fill/secondary. Stroke border/secondary, 1, inside.', `Radius ${md.radius} (${md.height} × ${BUTTON.squircle}, to the nearest 4). Pill: 1000.`, 'Effect: inner shadow x 0, y −4, blur 10, #000 50%.'] },
  { title: 'Make it a component', art: <span style={{ zoom: 2, display: 'inline-flex', outline: '0.5px dashed var(--content-brand)', outlineOffset: 4 }}><Button size="xs" icon={W} iconAfter={C}>button</Button></span>, do: [
    'Ctrl + Alt + K. Name it Button.', 'Boolean properties: Leading icon, Trailing icon, Label. Instance swap on both icons.', 'Text property on the label.'] },
  { title: 'Variants', art: <span className="fg-variants">{[['rest'], ['hover', 'hover'], ['pressed', 'active'], ['disabled']].map(([n, st]) => <Button key={n} size="sm" icon={W} state={st} disabled={n === 'disabled'}>{n}</Button>)}</span>, do: [
    'Properties: Size (2xs … 2xl), Shape (squircle, pill), State (rest, hover, pressed, disabled, loading).',
    'Per size: change height, padding x, gap, text style, icon frame and radius from the Size spec table.',
    'Hover / pressed: fill secondary-hover / secondary-active; stroke secondary-hover / secondary-active; icons content/brand. Disabled: the *-disabled set. Loading: disabled + trailing icon swapped for the spinner.'] },
  { title: 'Icon only', art: <><Button size="lg" icon={lucide('circle')} label="button" /><Button size="lg" shape="pill" icon={lucide('circle')} label="button" /></>, do: [
    'Label property off, trailing icon off.', 'Width fixed = height, padding 0. The icon stays centred.', 'Pill shape gives a circle.'] },
];

export default function FigmaSteps() {
  return (
    <div className="fg" style={{ '--fg-size': `var(--type-${md.label.split('/')[1]}-${md.label.split('/')[2]}-size)`, '--fg-lh': `var(--type-${md.label.split('/')[1]}-${md.label.split('/')[2]}-line-height)` }}>
      {STEPS.map((s, i) => (
        <div className="fg-step lit" key={s.title}>
          <div className="fg-art">{s.art}</div>
          <div className="fg-text">
            <span className="type-heading-sm-semibold"><span className="fg-n">{i + 1}</span> · {s.title}</span>
            <ul className="type-body-md-regular">{s.do.map((d) => <li key={d}>{d}</li>)}</ul>
          </div>
        </div>
      ))}
    </div>
  );
}
