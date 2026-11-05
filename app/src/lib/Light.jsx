'use client';
import './light.css';

// <Light>: a lit surface that starts its own screen: popovers and menus that float above other lit
// surfaces. It is `lit` and a light root (data-light-root), so it carries its own light even when it
// opens inside another lit surface. It must position itself (absolute or fixed).
// The light itself is painted by LightField (root layout) on every lit surface (D-020).
// Never use it for a page frame: the background is not lit.
export default function Light({ as: Tag = 'div', className = '', children, ...props }) {
  return <Tag {...props} className={`lit ${className}`.trim()} data-light-root="">{children}</Tag>;
}
