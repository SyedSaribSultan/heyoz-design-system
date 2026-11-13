// A tile with its designed resting glow in the top-right corner.
// The moving light is not here: LightField (src/lib/LightField.jsx) lights every surface
// above the background, never the background or media (D-020).
export default function RestGlow({ children, className = '', ...props }) {
  return <div {...props} className={`rest-glow ${className}`.trim()}>{children}</div>;
}
