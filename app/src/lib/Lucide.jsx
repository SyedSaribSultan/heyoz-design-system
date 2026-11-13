import './lucide.css';

// Lucide icons (public/icons/lucide, redrawn on the HeyOz grid): the one icon helper for components, docs and screens.
// <Lucide name="arrow-up-right" /> draws the icon in the current text colour at size/icon/sm (16);
// pass size="xs" | "md" | "lg" for another size/icon token. lucide(name) is the file, for props
// that take a URL (Button icon / iconAfter).
export const lucide = (name) => `/icons/lucide/${name}.svg`;

export default function Lucide({ name, size = 'sm', className = '', label }) {
  return (
    <span className={`lu ${className}`.trim()} data-size={size} style={{ '--icon': `url(${lucide(name)})` }}
      role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true} />
  );
}
