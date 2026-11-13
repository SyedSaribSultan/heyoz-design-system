'use client';
// Preview: the canvas fits the project ratio; text clips render on top and can be dragged.
// The canvas is media (data-media): the cursor light passes behind it.
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Button from '@/components/Button';
import { S, useEd, select, selClip, bump, openTab, dragStart, dragStep, dragFinish, dragCancel, M } from './store';
import { Ic, iconUrl } from './parts/parts';

const { AR, PAL, FONTS, clamp, activeVideo, trk, cend, spd, findClip, allClips } = M;

function rng(a) { return function () { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const hexA = (h, a) => { const n = parseInt(h.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };
function rr(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
// Placeholder footage: a generated scene per seed (the design system app has no real clips).
function drawScene(ctx, w, h, seed, t) {
  const pal = PAL[seed % PAL.length], r = rng(seed * 977 + 13);
  let g = ctx.createLinearGradient(0, 0, 0, h); g.addColorStop(0, pal[0]); g.addColorStop(0.55, pal[1]); g.addColorStop(1, pal[0]); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 4; i++) {
    const x = (r() * 1.1 - 0.05) * w + Math.sin(t * 0.35 + i * 2) * w * 0.03, y = (0.15 + r() * 0.6) * h + Math.cos(t * 0.3 + i) * h * 0.02, rad = (0.25 + r() * 0.35) * Math.max(w, h * 0.6);
    const rg = ctx.createRadialGradient(x, y, 0, x, y, rad); rg.addColorStop(0, hexA(pal[2], 0.36)); rg.addColorStop(1, hexA(pal[2], 0)); ctx.fillStyle = rg; ctx.fillRect(0, 0, w, h);
  }
  ctx.fillStyle = hexA(pal[2], 0.7); rr(ctx, w * 0.05, h * 0.07, w * 0.9, h * 0.016, h * 0.008); ctx.fill();
  for (let i = 0; i < 3; i++) {
    const cx = w * (0.2 + i * 0.3), cy = h * 0.5; ctx.fillStyle = 'rgba(0,0,0,.22)'; rr(ctx, cx - w * 0.12, cy - h * 0.12, w * 0.24, h * 0.32, w * 0.02); ctx.fill();
    ctx.strokeStyle = hexA(pal[2], 0.45); ctx.lineWidth = Math.max(1, w * 0.006); ctx.beginPath(); ctx.arc(cx, cy + h * 0.03, w * 0.075, 0, 7); ctx.stroke();
  }
  const fx = w * (0.45 + Math.sin(t * 0.25) * 0.012), base = h * 0.92; ctx.fillStyle = 'rgba(5,8,10,.93)';
  ctx.beginPath(); ctx.moveTo(fx - w * 0.14, base); ctx.quadraticCurveTo(fx - w * 0.15, h * 0.56, fx - w * 0.05, h * 0.5); ctx.lineTo(fx + w * 0.05, h * 0.5); ctx.quadraticCurveTo(fx + w * 0.15, h * 0.56, fx + w * 0.14, base); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.arc(fx, h * 0.455, w * 0.055, 0, 7); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.55)';
  for (let i = 0; i < 70; i++) { const x = r() * w, y0 = r(), sp = 0.1 + r() * 0.25, y = ((y0 + t * sp) % 1) * h; ctx.beginPath(); ctx.arc(x, y, Math.max(1, w * 0.0045 * (0.5 + r())), 0, 7); ctx.fill(); }
  const v = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.3, w / 2, h / 2, Math.max(w, h) * 0.75); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.55)'); ctx.fillStyle = v; ctx.fillRect(0, 0, w, h);
}
function draw(cv) {
  if (!cv) return; const ctx = cv.getContext('2d'), w = cv.width, h = cv.height, c = activeVideo(S.project, S.t);
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#000'; ctx.fillRect(0, 0, w, h); if (!c) return;
  const st = c.in + (S.t - c.start) * spd(c); ctx.save(); ctx.globalAlpha = c.props.opacity ?? 1;
  if (c.props.flip) { ctx.translate(w, 0); ctx.scale(-1, 1); }
  if (c.props.fit === 'fit' && S.project.ratio !== '16:9') { const hh = (w * 9) / 16; ctx.beginPath(); ctx.rect(0, (h - hh) / 2, w, hh); ctx.clip(); ctx.translate(0, (h - hh) / 2); drawScene(ctx, w, hh, c.meta.seed || 0, st); }
  else drawScene(ctx, w, h, c.meta.seed || 0, st);
  ctx.restore();
}

export default function Preview() {
  useEd(); const t = useEd((s) => s.t);
  const pv = useRef(null), cv = useRef(null), [box, setBox] = useState({ w: 0, h: 0 });
  const P = S.project, ratio = P.ratio, empty = !allClips(P).length;
  // Fit the ratio into the stage.
  useLayoutEffect(() => {
    const el = pv.current;
    const fit = () => {
      const cs = getComputedStyle(el), pw = el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight), ph = el.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
      if (pw <= 0 || ph <= 0) return; const ar = AR[S.project.ratio]; let w = ph * ar, h = ph; if (w > pw) { w = pw; h = pw / ar; }
      setBox({ w: Math.max(40, Math.floor(w)), h: Math.max(40, Math.floor(h)) });
    };
    fit(); const ro = new ResizeObserver(fit); ro.observe(el); return () => ro.disconnect();
  }, [ratio]);
  useEffect(() => {
    const c = cv.current; if (!c || !box.w) return; const d = Math.min(2, window.devicePixelRatio || 1);
    const W = Math.round(box.w * d), H = Math.round(box.h * d); if (c.width !== W || c.height !== H) { c.width = W; c.height = H; } draw(c);
  });
  const v = activeVideo(P, t), gen = v?.meta.status === 'generating', sel = selClip();
  const texts = trk(P, 'text').clips.filter((c) => t >= c.start && t < cend(c));

  // Text drag in the preview: one undo step per drag, on the store's drag shell (so it cannot overlap a timeline drag).
  const down = (e) => {
    const o = e.target.closest('[data-text]');
    if (o) { const c = findClip(P, o.dataset.text); if (!c) return; if (S.drag) return; if (S.sel !== c.id) select(c.id); dragStart('text', { id: c.id }); e.currentTarget.setPointerCapture(e.pointerId); e.preventDefault(); return; }
    if (e.target.closest('button')) return;
    if (v && S.sel !== v.id) select(v.id);
  };
  const move = (e) => {
    const d = S.drag; if (!d || d.type !== 'text') return; const c = findClip(S.project, d.id); if (!c) return; dragStep(0);
    const r = e.currentTarget.getBoundingClientRect(); c.props.x = clamp(((e.clientX - r.left) / r.width) * 100, 6, 94); c.props.y = clamp(((e.clientY - r.top) / r.height) * 100, 6, 94); bump();
  };
  const up = () => { if (S.drag?.type === 'text') dragFinish(); };
  const cancel = () => { if (S.drag?.type === 'text') dragCancel(); };

  return (
    <div ref={pv} className="ed-pv" onPointerDown={(e) => { if (e.target === pv.current && S.sel) select(null); }}>
      <div className="ed-cvbox" data-media data-sel={(sel && sel.kind === 'video' && v === sel) || undefined} style={{ width: box.w, height: box.h, '--sh': `${box.h}px` }}
        onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={cancel} onLostPointerCapture={cancel}
        data-name="preview (media)" data-tokens={JSON.stringify([['radius', 'radius/lg'], ['selected ring', 'border/selected'], ['border', 'border/primary']])}>
        <canvas ref={cv} aria-label="Video preview" />
        <div className="ed-ov">
          {texts.map((c) => { const p = c.props; return (
            <div key={c.id} data-text={c.id} className="ed-ov-text" data-sel={S.sel === c.id || undefined}
              style={{ left: `${p.x}%`, top: `${p.y}%`, fontFamily: FONTS[p.font], fontWeight: p.font === 'display' ? 800 : 700, fontSize: `calc(var(--sh) * ${p.size / 100})`, color: p.color, textAlign: p.align,
                ...(p.bg ? { background: 'rgba(0,0,0,.62)', padding: '.3em .55em', borderRadius: '.35em' } : { textShadow: '0 2px 14px rgba(0,0,0,.55)' }) }}>{p.text}</div>); })}
          {gen && <div className="ed-genbadge type-body-sm-medium"><Ic n="sparkles" /> Generating {Math.round(v.meta.progress * 100)}%</div>}
          {empty && (
            <div className="ed-pv-empty">
              <Ic n="film" size="lg" /><b className="type-heading-sm-semibold">Start with a clip</b>
              <span className="type-body-sm-regular">Generate one with AI or add footage from your media.</span>
              <div className="ed-row"><Button type="brand" size="xs" icon={iconUrl('sparkles')} onClick={() => openTab('ai', 'empty')}>Generate clip</Button><Button type="secondary" size="xs" onClick={() => openTab('media', 'empty')}>Add from media</Button></div>
            </div>
          )}
        </div>
        {S.safe && <Safe ratio={ratio} />}
      </div>
    </div>
  );
}

function Safe({ ratio }) {
  return (
    <div className="ed-safe type-label-sm-medium" aria-hidden>
      {ratio === '9:16'
        ? (<><div style={{ left: 0, right: 0, top: 0, height: '12%' }}>Top UI</div><div style={{ left: 0, right: 0, bottom: 0, height: '22%' }}>Caption + buttons</div><div style={{ right: 0, top: '12%', bottom: '22%', width: '14%' }} /></>)
        : <div style={{ inset: '6%', background: 'none' }}>Title safe</div>}
    </div>
  );
}
