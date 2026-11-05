import { ImageResponse } from 'next/og';
import fs from 'node:fs';
import path from 'node:path';
import t from '@/tokens/tokens.resolved.json';

// The social card for every page, built once at build time from the tokens.
export const alt = 'HeyOz Design System';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const hex = (name) => t.semantic.find((s) => s.name === name).hex;

export default function OG() {
  const logo = `data:image/svg+xml;base64,${fs.readFileSync(path.join(process.cwd(), 'src/app/icon.svg')).toString('base64')}`;
  const ramps = t.ramps;
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 72, background: hex('background'), color: hex('content/primary') }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <img src={logo} width={64} height={64} alt="" />
          <span style={{ fontSize: 32, color: hex('content/secondary') }}>HeyOz</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <span style={{ fontSize: 84, fontWeight: 700, letterSpacing: -2, lineHeight: 1 }}>Design System</span>
          <span style={{ fontSize: 32, color: hex('content/tertiary') }}>Colour · Type · Space · Icons · Motion · Light · Components</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {ramps.map((r) => (
            <div key={r.name} style={{ display: 'flex', gap: 6 }}>
              {r.steps.map((p) => <div key={p.name} style={{ flex: 1, height: 14, borderRadius: 4, background: p.hex }} />)}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
