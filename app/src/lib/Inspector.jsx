'use client';
import { useEffect, useState } from 'react';
import './light.css';
import './inspector.css';

// Token inspector. Hold Ctrl + Alt and point at anything to see the tokens painted on it,
// on every page (mounted in app/layout.jsx). Reads data-tokens written by tk() and the docs blocks,
// and data-component on Buttons and links, so it can never disagree with the CSS.
// Let go of the keys and it disappears.
// The token data (tokens.resolved.json) loads the first time the keys are held, not with the page.
let data = null;
const load = () => (data ??= Promise.all([import('@/tokens/tokens.resolved.json'), import('@/components/button-tokens')]).then(([{ default: t }, bt]) => ({
  t, bt,
  sem: new Map(t.semantic.map((s) => [s.name, s])),
  prim: new Map([...t.ramps.flatMap((r) => r.steps), t.white].map((p) => [p.name, p])),
  num: new Map(t.numbers.map((n) => [n.name, n])),
  typ: new Map(t.type.styles.map((s) => [`${s.role}/${s.size}`, s])),
})));

function resolve(d, token) {
  if (token.startsWith('layout')) return { note: 'no token' };
  if (token.startsWith('effect')) return { note: 'from Figma · not a token' };
  const s = d.sem.get(token);
  if (s) return { hex: s.hex, note: `→ ${s.ref} · ${s.hex}` };
  const p = d.prim.get(token);
  if (p) return { hex: p.hex, note: `primitive · ${p.hex}` };
  const n = d.num.get(token);
  if (n) return { note: n.ratio ? `${n.px} of the frame` : `${n.px}px` };
  if (token.startsWith('light/')) { const l = d.t.light.find((x) => x.name === token); return { note: `${l.fill} · ${l.blend} · ${l.opacity * 100}% · ${l.size}px` }; }
  if (token.startsWith('type/')) {
    const [, role, size, weight] = token.split('/');
    const st = d.typ.get(`${role}/${size}`);
    return { note: `${st.px}/${st.lh}px · ${weight} ${d.t.type.weights[weight]}` };
  }
  return { note: '' };
}

const COLOUR = new Set(['effect', 'background', 'background · hover', 'gradient top', 'gradient bottom', 'border', 'text colour', 'light']);
const hasTokens = (el) => el.dataset && (el.dataset.tokens || el.dataset.component);
const rowsOf = (d, el) => {
  const { component, type, size, shape } = el.dataset;
  if (component === 'button') return d.bt.buttonTokens({ type, size, shape });
  if (component === 'link') return d.bt.linkTokens({ type, size });
  return JSON.parse(el.dataset.tokens);
};

// Everything stacked under the cursor, top to bottom, so backgrounds you can't
// point at directly still show up. The top layer lists all its tokens; the layers
// beneath list their colour tokens only.
export default function Inspector() {
  const [tip, setTip] = useState(null);
  useEffect(() => {
    let last = null, pos = null, on = false;
    const clear = () => { on = false; last?.removeAttribute('data-inspected'); last = null; setTip(null); };
    const show = async (x, y) => {
      on = true;
      const d = await load();
      if (!on) return; // released while loading
      const stack = document.elementsFromPoint(x, y).filter(hasTokens);
      const top = stack[0];
      if (last && last !== top) last.removeAttribute('data-inspected');
      if (!top) { last = null; setTip(null); return; }
      top.setAttribute('data-inspected', '');
      last = top;
      const layers = stack.map((el, i) => {
        const rows = rowsOf(d, el);
        return { name: el.dataset.name, rows: (i === 0 ? rows : rows.filter(([prop]) => COLOUR.has(prop))).map(([prop, token]) => [prop, token, resolve(d, token)]) };
      }).filter((l, i) => i === 0 || l.rows.length);
      setTip({ x, y, layers });
    };
    const held = (e) => e.ctrlKey && e.altKey;
    const move = (e) => { pos = [e.clientX, e.clientY]; held(e) ? show(...pos) : on && clear(); };
    const key = (e) => { held(e) && pos ? show(...pos) : on && clear(); };
    document.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', clear);
    window.addEventListener('keydown', key);
    window.addEventListener('keyup', key);
    window.addEventListener('blur', clear);
    return () => {
      document.removeEventListener('pointermove', move); document.removeEventListener('pointerleave', clear);
      window.removeEventListener('keydown', key); window.removeEventListener('keyup', key); window.removeEventListener('blur', clear);
    };
  }, []);
  if (!tip) return null;
  const lines = tip.layers.reduce((n, l) => n + l.rows.length + 1, 0);
  const left = Math.max(8, Math.min(tip.x + 16, window.innerWidth - 408)), top = Math.max(8, Math.min(tip.y + 16, window.innerHeight - 24 - lines * 20));
  return (
    <div className="inspector lit motion-fade" style={{ left, top }} data-light-root="" role="tooltip"
      data-name="token inspector · lit" data-tokens={JSON.stringify([['background', 'surface/secondary'], ['border', 'border/secondary'], ['radius', 'radius/md'], ['effect', 'effect · inner-shade'], ['light', 'light/cursor']])}>
      <div className="type-label-lg-regular insp-dim">Under the cursor, top to bottom</div>
      {tip.layers.map((l, i) => (
        <div key={i} className={`insp-layer${i === 0 ? ' insp-top' : ''}`}>
          <div className={i === 0 ? 'type-label-lg-semibold' : 'type-label-lg-medium'}>{i + 1}. {l.name}</div>
          {l.rows.length === 0 && <div className="type-label-lg-regular insp-dim">no tokens</div>}
          {l.rows.map(([prop, token, r]) => (
            <div className="insp-row type-label-lg-regular" key={prop + token}>
              <span className="insp-dim">{prop}</span>
              <span className="insp-token">{r.hex && <i style={{ background: r.hex }} />}{token.startsWith('layout') ? token.replace('layout · ', '') : token}</span>
              <span className="insp-dim">{r.note}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
