import { tk } from '@/lib/tk';

// Home's icon button, shared by Home and the Oz dashboard. Sized as in Figma: 32 (control/xs), 40 (control/sm),
// or a number for a Figma size that is not on the control scale (28). icon: a file in public/home/.
export default function IconButton({ icon, size = 'control/xs', radius = 'full', bg, name = 'icon button', label }) {
  const sized = typeof size === 'number' ? [{}, { width: size, height: size }] : [{ size }, {}];
  return (
    <button {...tk(name, { ...(bg && { bg, hover: `${bg}-hover` }), radius, ...sized[0] }, sized[1])} aria-label={label} title={label} data-btn>
      <span data-icon><img src={`/home/${icon}`} alt="" /></span>
    </button>
  );
}
