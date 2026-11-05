'use client';
// The editor shell (D-034, D-036). Default = preview, one video strip and a five-button action bar;
// the inspector only on selection; lanes only with content. Layout in editor.css.
import { useEffect, useRef } from 'react';
import Button from '@/components/Button';
import { S, useEd, bump, track, select, selClip, openTab, closeSheet, openPop, undo, redo, canUndo, canRedo, split, dup, del, captions, play, stop, jog, setTime, tick, toastAct, toast, checkpoint, markSaved, scene, M } from './store';
import { Ic, BarButton, iconUrl } from './parts/parts';
import Preview from './Preview';
import Timeline, { fitTimeline, zoomBy } from './Timeline';
import Inspector from './Inspector';
import Panel from './Panels';
import Popovers from './Popovers';
import { root, rectOf } from './dom';
import './editor.css';

const { total, fmtTC, vclips, trk, RATIO_ICON } = M;

const SCENES = ['none', 'clip', 'text', 'ai', 'empty', 'grown'];

export default function Editor() {
  const ref = useRef(null);
  const v = useEd();
  const narrow = S.narrow, sel = selClip(), insp = !!sel;

  useEffect(() => {
    const asked = new URLSearchParams(window.location.search).get('scene');
    root.el = ref.current; scene(SCENES.includes(asked) ? asked : 'none'); track('editor_opened', { clips: vclips(S.project).length });
    const ro = new ResizeObserver(() => { const n = ref.current.clientWidth < 820; if (n !== S.narrow) { S.narrow = n; S.sheet = null; S.pop = null; bump(); } });
    ro.observe(ref.current);
    let raf; const loop = (ts) => { tick(ts); raf = requestAnimationFrame(loop); }; raf = requestAnimationFrame(loop);
    // The preview and timeline are sized from the window, so they stay hidden until measured, then fade in in place (no layout shift).
    let r1 = requestAnimationFrame(() => { r1 = requestAnimationFrame(() => { if (ref.current) ref.current.dataset.ready = ''; }); });
    return () => { ro.disconnect(); cancelAnimationFrame(raf); cancelAnimationFrame(r1); };
  }, []);
  useEffect(() => { const k = (e) => onKey(e); document.addEventListener('keydown', k); return () => document.removeEventListener('keydown', k); }, []);

  const sheetOpen = S.sheet === 'panel' || (narrow && S.sheet === 'insp');
  return (
    <div className="ed-light">
    <div ref={ref} className="ed type-body-md-regular" data-narrow={narrow || undefined} data-insp={(!narrow && insp) || undefined}
      data-name="editor" data-tokens={JSON.stringify([['background', 'background'], ['text colour', 'content/primary'], ['type', 'type/body/md/regular']])}>
      <TopBar />
      <main className="ed-main lit"><Preview /><Transport /></main>
      {insp && <aside className="ed-insp" aria-label="Inspector" data-open={(narrow && S.sheet === 'insp') || undefined}><Inspector /></aside>}
      <Timeline />
      <ActionBar />
      {S.sheet === 'panel' && <Panel />}
      {sheetOpen && <div className="ed-scrim" data-dim={narrow || undefined} onClick={closeSheet} aria-hidden />}
      <Popovers />
      <Toast />
    </div>
    </div>
  );
}

let armed = true; // one undo step per rename
// ─── Top bar ─────────────────────────────────────────────────────────────────
function TopBar() {
  useEd(); const P = S.project, tot = total(P), n = S.narrow;
  const caps = trk(P, 'text').clips.some((x) => x.meta.role === 'caption'), snd = trk(P, 'audio').clips.length;
  const next = !tot || n ? null : !caps ? ['Next: add captions', () => captions('bar')] : !snd ? ['Next: add music', () => openTab('audio', 'bar')] : null;
  return (
    <header className="ed-top" data-name="top bar" data-tokens={JSON.stringify([['background', 'background'], ['padding x', 'space/4'], ['gap', 'space/12']])}>
      <Button type="ghost" size="xs" icon={iconUrl('chevron-left')} label="Back to projects" title="Back to projects" onClick={() => toast('Back to projects is not part of the design system app')} />
      <input className="ed-pname type-heading-xs-semibold" value={P.name} aria-label="Project name" spellCheck={false} maxLength={60}
        onFocus={() => { armed = true; }} onChange={(e) => { if (armed) { checkpoint(); armed = false; } P.name = e.target.value; markSaved(); bump(); }}
        data-name="project name (draft)" data-tokens={JSON.stringify([['type', 'type/heading/xs/semibold'], ['background · hover', 'fill/secondary'], ['background · focus', 'surface/secondary'], ['radius', 'radius/md']])} />
      <span className="ed-save type-body-sm-regular" role="status"><Ic n={S.saved === 'saving' ? 'ellipsis' : 'check'} />{S.saved === 'saving' ? 'Saving…' : 'Saved'}</span>
      <span className="grow" />
      <Button type="ghost" size="xs" icon={iconUrl(RATIO_ICON[P.ratio])} iconAfter={iconUrl('chevron-down')} aria-haspopup="dialog" aria-label={`Canvas ratio ${P.ratio}`}
        onClick={(e) => openPop('ratio', rectOf(e.currentTarget), 'below-start')}>{n ? null : P.ratio}</Button>
      <i className="ed-vsep" />
      <Button type="ghost" size="xs" icon={iconUrl('undo-2')} label="Undo" title="Undo (⌘Z)" disabled={!canUndo()} onClick={undo} />
      <Button type="ghost" size="xs" icon={iconUrl('redo-2')} label="Redo" title="Redo (⇧⌘Z)" disabled={!canRedo()} onClick={redo} />
      {next && <Button type="ghost" size="xs" icon={iconUrl('plus')} onClick={next[1]}>{next[0]}</Button>}
      <Button type="primary" size="xs" icon={iconUrl('download')} disabled={!tot} title={tot ? undefined : 'Add a clip before exporting'} aria-haspopup="dialog"
        onClick={(e) => openPop('export', rectOf(e.currentTarget), 'below-end')}>{n ? null : 'Export'}</Button>
      <Button type="ghost" size="xs" icon={iconUrl('ellipsis')} label="Account, help and settings" aria-haspopup="menu" onClick={(e) => openPop('account', rectOf(e.currentTarget), 'below-end')} />
    </header>
  );
}

// ─── Transport ───────────────────────────────────────────────────────────────
function Transport() {
  useEd(); const t = useEd((s) => s.t);
  return (
    <div className="ed-transport" data-name="transport" data-tokens={JSON.stringify([['timecode', 'type/body/md/medium'], ['play', 'button · primary · sm · pill'], ['go to start', 'button · ghost · xs']])}>
      <div className="type-body-md-medium ed-tc"><span>{fmtTC(t)}</span><span className="ed-dim"> / {fmtTC(total(S.project))}</span></div>
      <div className="ed-tctl">
        <Button type="ghost" size="xs" icon={iconUrl('skip-back')} label="Go to start" title="Go to start (Home)" onClick={() => setTime(0)} />
        <Button type="primary" size="sm" shape="pill" icon={iconUrl(S.playing ? 'pause' : 'play')} label={S.playing ? 'Pause' : 'Play'} title={`${S.playing ? 'Pause' : 'Play'} (Space)`} onClick={play} />
      </div>
      <div className="ed-tr type-label-md-medium">{S.playing && S.rate !== 1 ? `${S.rate}×` : ''}</div>
    </div>
  );
}

// ─── Action bar: five tools, or the selection's verbs ────────────────────────
function ActionBar() {
  useEd(); const c = selClip(), tab = (t) => S.sheet === 'panel' && S.tab === t;
  return (
    <nav className="ed-bar lit" aria-label="Editing tools" data-name="action bar" data-tokens={JSON.stringify([['background', 'surface/secondary'], ['border', 'border/secondary'], ['radius', 'radius/2xl'], ['gap', 'space/8']])}>
      {!c ? (<>
        <BarButton icon="film" label="Add" pressed={tab('media')} onClick={() => openTab('media')} />
        <BarButton icon="type" label="Text" pressed={tab('text')} onClick={() => openTab('text')} />
        <BarButton icon="captions" label="Captions" onClick={() => captions('bar')} />
        <BarButton icon="eighth-note" label="Sound" pressed={tab('audio')} onClick={() => openTab('audio')} />
        <BarButton icon="sparkles" label="AI" pressed={tab('ai')} onClick={() => openTab('ai')} />
      </>) : (<>
        <BarButton icon="chevron-left" label="Done" onClick={() => select(null)} />
        <i className="ed-bsep" />
        <BarButton icon="scissors" label="Split" onClick={() => { track('tool_used', { tool: 'split', via: 'bar' }); split(); }} />
        {S.narrow && <BarButton icon="sliders-horizontal" label="Edit" pressed={S.sheet === 'insp'} onClick={() => { S.sheet = 'insp'; bump(); }} />}
        {c.kind !== 'text' && <BarButton icon="sparkles" label="AI" pressed={tab('ai')} onClick={() => openTab('ai')} />}
        <BarButton icon="copy" label="Duplicate" onClick={dup} />
        <BarButton icon="trash" label="Delete" danger onClick={del} />
      </>)}
    </nav>
  );
}

function Toast() {
  const t = useEd((s) => s.toast);
  return (
    <div className="ed-toast type-body-sm-medium" role="status" aria-live="polite" data-on={t ? '' : undefined}
      data-name="toast (draft)" data-tokens={JSON.stringify([['background', 'surface/inverse'], ['text colour', 'content/inverse-primary'], ['radius', 'radius/lg'], ['effect', 'effect · drop-md']])}>
      {t && <><span>{t.msg}</span>{t.label && <button type="button" onClick={toastAct}>{t.label}</button>}</>}
    </div>
  );
}

// ─── Keyboard (brief §3.9) ───────────────────────────────────────────────────
function onKey(e) {
  const tg = e.target, typing = /^(INPUT|TEXTAREA|SELECT)$/.test(tg.tagName) && tg.type !== 'range' || tg.isContentEditable;
  const mod = e.metaKey || e.ctrlKey, k = e.key, kl = k.toLowerCase();
  if (mod && kl === 'k') { e.preventDefault(); track('tool_used', { tool: 'palette', via: 'shortcut' }); return openPop('cmd', null, 'center'); }
  if (k === 'Escape') { if (S.pop) { S.pop = null; S.ai = null; bump(); } else if (S.sheet) closeSheet(); else if (S.sel) select(null); return; }
  if (S.pop?.type === 'cmd' || typing) return;
  if (mod && kl === 'z') { e.preventDefault(); return e.shiftKey ? redo() : undo(); }
  if (mod && kl === 'y') { e.preventDefault(); return redo(); }
  if (mod && kl === 'd') { e.preventDefault(); track('tool_used', { tool: 'duplicate', via: 'shortcut' }); return dup(); }
  if (mod || e.altKey) return;
  if ((tg.tagName === 'BUTTON' || tg.getAttribute?.('role') === 'button') && (k === ' ' || k === 'Enter')) return;
  if (tg.type === 'range' && k.startsWith('Arrow')) return;
  const t = S.t;
  switch (k) {
    case ' ': e.preventDefault(); play(); break;
    case 's': case 'S': track('tool_used', { tool: 'split', via: 'shortcut' }); split(); break;
    case 'j': case 'J': jog(-1); break;
    case 'k': case 'K': stop(); break;
    case 'l': case 'L': jog(1); break;
    case 'ArrowLeft': e.preventDefault(); stop(); setTime(t - (e.shiftKey ? 1 : 1 / 30)); break;
    case 'ArrowRight': e.preventDefault(); stop(); setTime(t + (e.shiftKey ? 1 : 1 / 30)); break;
    case 'Home': e.preventDefault(); setTime(0); break;
    case 'End': e.preventDefault(); setTime(total(S.project)); break;
    case 'Delete': case 'Backspace': if (S.sel) { e.preventDefault(); track('tool_used', { tool: 'delete', via: 'shortcut' }); del(); } break;
    case '=': case '+': zoomBy(1.3); break;
    case '-': zoomBy(1 / 1.3); break;
    case '0': fitTimeline(); break;
    case '?': openPop('keys', null, 'center'); break;
  }
}
