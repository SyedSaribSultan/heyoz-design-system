'use client';
// Timeline. Video is magnetic (ripple); text and audio are free and stack into sub-rows when they
// overlap. Lanes appear only with content. Trim from the edges, drag to reorder or move, snap to the
// playhead and clip edges, scrub on the ruler, ⌘/Ctrl-scroll to zoom, auto-fit until you zoom.
import { useEffect, useLayoutEffect, useRef } from 'react';
import Button from '@/components/Button';
import { S, useEd, bump, setTime, select, stop, checkpoint, markSaved, track, openPop, openTab, M } from './store';
import { Ic, iconUrl } from './parts/parts';
import { rectOf } from './dom';

const { clamp, vclips, trk, allClips, cdur, cend, total, packRows, durS, findClip, trimEdge, reorder, snapT, relayout } = M;
const GUT = 64, MINPPS = 14, MAXPPS = 220;
const el = { scroll: null };

const calcFit = () => clamp(((el.scroll?.clientWidth || 800) - GUT - 32) / Math.max(total(S.project), 8), MINPPS, 200);
export function fitTimeline() { S.autofit = true; S.pps = calcFit(); bump(); }
export function zoomBy(f) {
  const sc = el.scroll; S.autofit = false; const sx = sc ? GUT + S.t * S.pps - sc.scrollLeft : 0;
  S.pps = clamp(S.pps * f, MINPPS, MAXPPS); bump();
  requestAnimationFrame(() => { if (sc) sc.scrollLeft = Math.max(0, GUT + S.t * S.pps - sx); });
}

function rng(a) { return function () { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function Wave({ c, w }) {
  const n = Math.max(4, Math.floor(w / 3)), r = rng((c.meta.seed || 1) * 131 + 7), vol = Math.min(1, c.props.volume * 0.9); let d = '';
  for (let i = 0; i < n; i++) { const a = (0.18 + 0.6 * Math.abs(Math.sin(i * 0.23 + (c.meta.seed || 0))) * (0.55 + 0.45 * r())) * vol * 0.5; d += `M${(i * 3 + 1.5).toFixed(1)} ${(0.5 - a).toFixed(3)}V${(0.5 + a).toFixed(3)}`; }
  return <svg className="ed-wv" viewBox={`0 0 ${n * 3} 1`} preserveAspectRatio="none" aria-hidden><path d={d} stroke="currentColor" strokeWidth="1.6" fill="none" vectorEffect="non-scaling-stroke" /></svg>;
}

function Clip({ c, top, h }) {
  const pps = S.pps, w = Math.max(cdur(c) * pps, 6), sel = S.sel === c.id, gen = c.meta.status === 'generating';
  const k = { video: 'v', text: 't', audio: 'a' }[c.kind], icn = c.kind === 'video' ? 'film' : c.kind === 'text' ? 'type' : c.meta.source === 'sfx' ? 'audio-waveform' : 'eighth-note';
  const what = c.kind === 'video' ? 'Video' : c.kind === 'text' ? 'Text' : c.meta.source === 'sfx' ? 'Sound effect' : 'Music';
  const onKey = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); select(c.id); }
    // Keyboard trim: [ and ] move the out point, with Alt the in point (brief: trim without a mouse).
    if ((e.key === '[' || e.key === ']') && !gen) {
      e.preventDefault(); checkpoint(); const d = (e.key === ']' ? 1 : -1) * (e.shiftKey ? 1 : 1 / 30) * M.spd(c);
      M.applyKey(S.project, c, e.altKey ? 'in' : 'out', (e.altKey ? c.in : c.out) + d); track('clip_trimmed', { kind: c.kind, via: 'keyboard' }); markSaved(); bump();
    }
  };
  return (
    <div className={`ed-clip ${k}`} data-id={c.id} data-sel={sel || undefined} data-gen={gen || undefined} tabIndex={0} role="button" aria-pressed={sel}
      aria-label={`${c.name} ${gen ? `${Math.round((c.meta.progress || 0) * 100)}%, generating` : durS(cdur(c))}, ${what.toLowerCase()} clip`} /* starts with the visible text */ onKeyDown={onKey}
      style={{ left: c.start * pps, width: w, top, height: h }}
      data-name={`${what.toLowerCase()} clip`} data-tokens={JSON.stringify([['background', c.kind === 'video' ? 'scene art (media)' : c.kind === 'text' ? 'fill/tertiary' : 'fill/elevated'], ['border', c.kind === 'text' ? 'border/tertiary' : 'border/elevated'], ['selected', 'border/selected'], ['radius', 'radius/md'], ['label', 'type/label/md/medium']])}>
      {c.kind === 'video' && <div className="ed-strip" style={{ background: M.stripBg(c.meta.seed || 0) }} />}
      {c.kind === 'audio' && <Wave c={c} w={w} />}
      {w > 56 && <div className="ed-cl type-label-md-medium"><Ic n={icn} size="xs" /><span>{c.name}</span>{' '}{w > 110 && !gen && <em>{durS(cdur(c))}</em>}{gen && <em>{Math.round((c.meta.progress || 0) * 100)}%</em>}</div>}
      {!gen && <><i className="ed-hd l" data-h="l" /><i className="ed-hd r" data-h="r" /></>}
    </div>
  );
}

export default function Timeline() {
  useEd(); const t = useEd((s) => s.t);
  const scroll = useRef(null), inner = useRef(null);
  const P = S.project, vs = vclips(P), tx = trk(P, 'text').clips, au = trk(P, 'audio').clips, empty = !allClips(P).length;
  if (S.autofit && !S.drag) S.pps = calcFit();
  const pps = S.pps, dur = Math.max(total(P) + 3, 12), W = Math.ceil(dur * pps);

  useLayoutEffect(() => { el.scroll = scroll.current; const ro = new ResizeObserver(() => { if (S.autofit) bump(); }); ro.observe(scroll.current); return () => ro.disconnect(); }, []);
  // Keep the playhead in view while playing.
  useEffect(() => { const sc = scroll.current; if (!S.playing || !sc) return; const x = GUT + t * pps; if (x > sc.scrollLeft + sc.clientWidth - 30 || x < sc.scrollLeft + GUT) sc.scrollLeft = Math.max(0, x - sc.clientWidth / 3); }, [t, pps]);
  // ⌘/Ctrl + scroll zooms (non-passive, so it can stop the page zoom).
  useEffect(() => {
    const sc = scroll.current; const wheel = (e) => { if (e.ctrlKey || e.metaKey) { e.preventDefault(); zoomBy(e.deltaY < 0 ? 1.12 : 1 / 1.12); } };
    sc.addEventListener('wheel', wheel, { passive: false }); return () => sc.removeEventListener('wheel', wheel);
  }, []);

  const step = [0.5, 1, 2, 5, 10, 15, 30, 60].find((s) => s * pps >= 72) || 60, minor = (step * pps) / 5 >= 12 ? step / 5 : (step * pps) / 2 >= 12 ? step / 2 : step;
  const ticks = []; for (let i = 0; i * minor <= dur + 1e-6; i++) { const tt = i * minor, Mj = Math.abs(tt / step - Math.round(tt / step)) < 1e-6; ticks.push([tt, Mj]); }

  const tOf = (e) => (e.clientX - inner.current.getBoundingClientRect().left - GUT) / S.pps;
  const down = (e) => {
    if (e.button > 0) return; const tg = e.target;
    if (tg.closest('[data-ruler]')) { S.drag = { type: 'scrub' }; stop(); setTime(tOf(e)); scroll.current.setPointerCapture(e.pointerId); e.preventDefault(); return; }
    const ce = tg.closest('.ed-clip');
    if (ce) {
      const c = findClip(S.project, ce.dataset.id); if (!c) return;
      if (c.kind === 'video' && !(S.t >= c.start && S.t < cend(c))) S.t = c.start + 0.01;
      if (S.sel !== c.id) select(c.id); else bump();
      if (c.meta.status === 'generating') return;
      const hd = tg.closest('.ed-hd');
      S.drag = { type: hd ? 'trim' : 'move', side: hd?.dataset.h, id: c.id, x0: e.clientX, orig: { start: c.start, in: c.in, out: c.out }, moved: false, cp: false };
      scroll.current.setPointerCapture(e.pointerId); return;
    }
    if (tg.closest('.ed-ltrack') && !tg.closest('button') && S.sel) select(null);
  };
  const move = (e) => {
    const d = S.drag; if (!d) return;
    if (d.type === 'scrub') return setTime(tOf(e));
    const dx = e.clientX - d.x0; if (!d.moved && Math.abs(dx) < 3) return; d.moved = true; if (!d.cp) { checkpoint(); d.cp = true; }
    const c = findClip(S.project, d.id); if (!c) return; const s = M.spd(c), dT = dx / S.pps, o = d.orig, endO = o.start + (o.out - o.in) / s, th = 8 / S.pps;
    if (d.type === 'trim') trimEdge(c, d.side, o, snapT(S.project, (d.side === 'r' ? endO : o.start) + dT, c.id, S.t, th));
    else if (c.kind === 'video') reorder(S.project, c, o.start + cdur(c) / 2 + dT);
    else { let ns = Math.max(0, o.start + dT); const du = cdur(c), a = snapT(S.project, ns, c.id, S.t, th), b = snapT(S.project, ns + du, c.id, S.t, th) - du; ns = Math.abs(a - ns) <= Math.abs(b - ns) ? a : b; c.start = Math.max(0, ns); }
    relayout(S.project); bump();
  };
  const up = () => {
    const d = S.drag; S.drag = null;
    if (d?.moved) { markSaved(); track(d.type === 'trim' ? 'clip_trimmed' : d.type === 'move' && findClip(S.project, d.id)?.kind === 'video' ? 'clip_reordered' : 'clip_moved', { via: 'drag' }); bump(); }
  };
  const ctx = (e) => {
    e.preventDefault(); const ce = e.target.closest('.ed-clip'), r = rectOf({ x: e.clientX, y: e.clientY });
    if (ce) { select(ce.dataset.id); openPop('ctx', r, 'point', { kind: 'clip' }); }
    else if (e.target.closest('.ed-ltrack')) { setTime(tOf(e)); openPop('ctx', r, 'point', { kind: 'tl' }); }
  };
  const lane = (icon, name, h, kids) => (
    <div className="ed-lane"><div className="ed-gut type-label-md-medium"><Ic n={icon} /><span>{name}</span></div><div className="ed-ltrack" style={{ width: W, height: h }}>{kids}</div></div>
  );
  const TR = packRows(tx), AU = packRows(au);
  return (
    <section className="ed-tl lit" aria-label="Timeline" data-name="timeline" data-tokens={JSON.stringify([['background', 'surface/secondary'], ['border', 'border/secondary'], ['radius', 'radius/2xl'], ['lane', 'fill/primary · border/primary · radius/lg'], ['playhead', 'fill/brand'], ['ruler label', 'type/label/sm/medium']])}>
      <div ref={scroll} className="ed-tl-scroll" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={() => { S.drag = null; }} onContextMenu={ctx}>
        <div ref={inner} className="ed-tl-inner" style={{ width: GUT + W }}>
          <div className="ed-rrow">
            <div className="ed-gut ed-gut-tools">
              <button type="button" className="ed-fit" aria-label="Fit timeline to window" title="Fit (0) · zoom with ⌘/Ctrl + scroll" onClick={fitTimeline}><Ic n="move-horizontal" size="xs" /></button>
            </div>
            <div className="ed-rtrack" data-ruler style={{ width: W }}>
              {ticks.map(([tt, Mj]) => <span key={tt}><i className="ed-tick" data-major={Mj || undefined} style={{ left: tt * pps }} />{Mj && <span className="ed-tlab type-label-sm-medium" style={{ left: tt * pps }}>{Math.floor(tt / 60)}:{String(Math.floor(tt % 60)).padStart(2, '0')}{tt % 1 ? '.5' : ''}</span>}</span>)}
              <i className="ed-pl-head" role="slider" tabIndex={0} aria-label="Playhead" aria-valuemin={0} aria-valuemax={+total(P).toFixed(2)} aria-valuenow={+t.toFixed(2)} aria-valuetext={M.fmtTC(t)} style={{ left: t * pps }}
                onKeyDown={(e) => { if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); e.stopPropagation(); setTime(S.t + (e.key === 'ArrowRight' ? 1 : -1) * (e.shiftKey ? 1 : 1 / 30)); } }} />
            </div>
          </div>
          {lane('film', 'Video', 60, empty
            ? <div className="ed-emptytl type-body-sm-regular"><span>Drop a clip here or</span><Button type="secondary" size="2xs" onClick={() => openTab('media', 'empty')}>Add from media</Button><Button type="secondary" size="2xs" icon={iconUrl('sparkles')} onClick={() => openTab('ai', 'empty')}>Generate</Button></div>
            : vs.map((c) => <Clip key={c.id} c={c} top={6} h={48} />))}
          {tx.length > 0 && lane('type', 'Text', TR.n * 32 + 4, tx.map((c) => <Clip key={c.id} c={c} top={4 + TR.map[c.id] * 32} h={26} />))}
          {au.length > 0 && lane('eighth-note', 'Audio', AU.n * 44 + 4, au.map((c) => <Clip key={c.id} c={c} top={4 + AU.map[c.id] * 44} h={40} />))}
          <i className="ed-pl-line" style={{ left: GUT + t * pps }} />
        </div>
      </div>
    </section>
  );
}
