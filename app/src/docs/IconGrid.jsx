import { ICON_GRID } from '@/components/Button';

// The icon grid, drawn from the size/icon/grid/* ratios.
// Draw it over any icon frame: it scales with the frame.
export default function IconGrid({ className = '', style }) {
  const F = 24, p = ICON_GRID.padding * F, sq = ICON_GRID.square * F, r = (ICON_GRID.circle * F) / 2, w = 0.3;
  return (
    <svg viewBox={`0 0 ${F} ${F}`} className={`ig ${className}`} style={style} aria-hidden>
      <g fill="none" strokeWidth={w}>
        <line x1="0" y1="0" x2={F} y2={F} /><line x1={F} y1="0" x2="0" y2={F} />
        <line x1={F / 2} y1="0" x2={F / 2} y2={F} /><line x1="0" y1={F / 2} x2={F} y2={F / 2} />
        <rect className="ig-live" x={p} y={p} width={F - 2 * p} height={F - 2 * p} />
        <circle cx={F / 2} cy={F / 2} r={r} />
        <rect className="ig-key" x={(F - sq) / 2} y={(F - sq) / 2} width={sq} height={sq} rx="1" />
      </g>
    </svg>
  );
}
