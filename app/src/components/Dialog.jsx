'use client';
import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Button from './Button';
import { lucide } from '@/lib/Lucide';
import usePresence from '@/lib/usePresence';
import useDismiss from '@/lib/useDismiss';
import { tabbables } from './floating';
import { rec } from '@/lib/rec';
import c from '@/tokens/components.json';
import '@/styles/components.css';
import './dialog.css';

// Dialog, built from its spec: components/dialog.json → (npm run tokens) → components.json + components.css.
// Change the spec, not this file. Docs: docs/components/dialog.md.
//
// <Dialog open={open} onClose={(reason) => setOpen(false)} title="Rename project" description="…" size="md"
//         actions={[{ label: 'Cancel', type: 'ghost', onClick }, { label: 'Save', onClick }]}>body</Dialog>
// <AlertDialog open onCancel onConfirm title description confirmLabel="Delete" tone="critical" />
//
//   open · onClose(reason)   reason: 'escape' | 'scrim' | 'close'. The dialog never closes itself: the owner of `open` does.
//   size                     'sm' | 'md' | 'lg' (400 / 520 / 640). Below 640 the panel is a bottom sheet.
//   blocking                 no Esc, no scrim press, no close button: only the actions end it.
//   scrimClose               a press on the scrim closes (default true). Off when blocking.
//   actions                  [{ label, type, tone, onClick, primary, focus, disabled, loading, icon }]. The last is the main action
//                            unless one says primary. type defaults: main → brand, others → secondary. tone 'critical' = a
//                            destructive confirm (secondary Button, content/critical label). At most one brand Button.
//   footerStart              a node on the left of the footer (a note, a checkbox)
//   initialFocus             a ref, or a selector inside the panel. Default: [data-dlg-focus] → first field in the body →
//                            the main action → the panel.
//   returnFocus              a ref to focus on close. Default: the element that had focus when it opened.
//   className · aria-label   className goes on the panel · aria-label names the dialog when there is no title
// Lifecycle (usePresence): closed → open (page locked, focus trapped, Esc answered) → leaving (focus already given back, panel
// inert, page still locked while it fades) → closed (page unlocked). Every open mounts a fresh Layer, so the element to give
// focus back to is always the one that had focus at that open, even when it reopens during the fade.
// Esc: a layer inside the dialog (select, menu) that handles Esc must call event.preventDefault(), so the dialog stays open.
// Specimen for the docs: <DialogPanel static …> draws the panel only (no scrim, trap or keys) and leaves the Tab order.
const spec = c.dialog;
const TY = spec.types;
const WIDTH = Object.fromEntries(['sm', 'md', 'lg'].map((s) => [s, spec.vars.find((v) => v.key === `panel-width-${s}`).px]));

// ─── Page behaviour: scroll lock and the stack of open dialogs ─────────────────────────────────────────────
// html gets overflow hidden, plus a kept scrollbar gutter only when the page has a scrollbar, so nothing shifts.
let locks = 0;
function lockScroll() {
  if (locks++) return;
  const el = document.documentElement;
  if (window.innerWidth > el.clientWidth) el.setAttribute('data-dlg-bar', '');
  el.setAttribute('data-dlg-lock', '');
}
function unlockScroll() {
  if (--locks) return;
  document.documentElement.removeAttribute('data-dlg-lock');
  document.documentElement.removeAttribute('data-dlg-bar');
}
const FIELD = 'input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [data-autofocus]';

function firstFocus(panel, initialFocus) {
  if (initialFocus?.current) return initialFocus.current;
  if (typeof initialFocus === 'string') { const el = panel.querySelector(initialFocus); if (el) return el; }
  return panel.querySelector('[data-dlg-focus]') || panel.querySelector('.dlg-body')?.querySelector(FIELD)
    || panel.querySelector('[data-dlg-primary]') || tabbables(panel).find((el) => !el.closest('.dlg-close')) || panel;
}

// ─── The panel: header, body, footer ─────────────────────────────────────────────────────────────────────────
export function Action({ label, type, tone, primary, focus, onClick, ...rest }) {
  const critical = tone === 'critical';
  return <Button size="sm" type={type || (critical ? 'secondary' : primary ? 'brand' : 'secondary')} data-tone={critical ? 'critical' : undefined}
    data-dlg-primary={primary ? '' : undefined} data-dlg-focus={focus ? '' : undefined} onClick={onClick} {...rest}>{label}</Button>;
}

// The panel itself. fade forces the scroll fades for a specimen ('top' | 'bottom' | 'both').
function Panel({ title, description, size = 'md', role = 'dialog', closable = true, onClose, actions = [], footerStart, children, panelRef, titleId, descId, leaving, static: isStatic, fade, className = '', 'aria-label': ariaLabel }) {
  const bodyRef = useRef(null), contentRef = useRef(null);
  const [edge, setEdge] = useState({ top: false, bottom: false });
  useEffect(() => {
    const body = bodyRef.current;
    if (!body || isStatic) return;
    const update = () => {
      const top = body.scrollTop > 1, bottom = body.scrollHeight - body.scrollTop - body.clientHeight > 1;
      setEdge((e) => (e.top === top && e.bottom === bottom ? e : { top, bottom }));
    };
    update();
    body.addEventListener('scroll', update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(body); if (contentRef.current) ro.observe(contentRef.current);
    return () => { body.removeEventListener('scroll', update); ro.disconnect(); };
  }, [isStatic]);
  const top = fade === 'top' || fade === 'both' || edge.top, bottom = fade === 'bottom' || fade === 'both' || edge.bottom;
  const primary = actions.some((a) => a.primary) ? -1 : actions.length - 1;
  const panel = (
    <div ref={panelRef} className={`dlg-panel lit motion-pop ${className}`.trim()} data-size={size} data-leaving={leaving || undefined}
      role={isStatic ? undefined : role} aria-modal={isStatic ? undefined : 'true'} aria-labelledby={title ? titleId : undefined} aria-label={title ? undefined : ariaLabel} aria-describedby={description ? descId : undefined}
      tabIndex={-1} inert={isStatic || undefined}
      {...rec(`${role === 'alertdialog' ? 'alert dialog' : 'dialog'} · ${size}`, [['background', 'surface/primary'], ['border', 'border/primary'], ['radius', 'radius/2xl'], ['width', `layout · ${WIDTH[size]}px`], ['effect', 'effect · inner-shade'], ['light', 'light/cursor']])}>
      <div className="dlg-head" {...rec('dialog header', [['padding left', 'space/24'], ['padding right', 'space/16'], ['padding top', 'space/16'], ['padding bottom', 'space/8'], ['gap', 'space/4']])}>
        <h2 id={titleId} className={`dlg-title ${TY['header-title']}`}>{title}</h2>
        {closable && <span className="dlg-close"><Button type="ghost" size="xs" icon={lucide('x')} label="Close" onClick={() => onClose?.('close')} /></span>}
        {description && <p id={descId} className={`dlg-desc ${TY['header-description']}`}>{description}</p>}
      </div>
      {children != null && (
        <div className="dlg-main" data-top={top || undefined} data-bottom={bottom || undefined}>
          <div ref={bodyRef} className={`dlg-body ${TY.body}`} {...rec('dialog body', [['padding x', 'space/24'], ['padding y', 'space/4'], ['type', 'type/body/md/regular'], ['text colour', 'content/primary']])}>
            <div ref={contentRef}>{children}</div>
          </div>
        </div>
      )}
      {(actions.length > 0 || footerStart) && (
        <div className="dlg-foot" {...rec('dialog footer', [['padding x', 'space/24'], ['padding top', 'space/16'], ['padding bottom', 'space/24'], ['gap', 'space/8']])}>
          {footerStart && <div className={`dlg-foot-start ${TY.body}`}>{footerStart}</div>}
          {actions.map((a, i) => <Action key={a.label} {...a} primary={a.primary || i === primary} />)}
        </div>
      )}
    </div>
  );
  return panel;
}

// A specimen for the docs: the panel on its own, in a frame that behaves like a window of that width.
// fit: the frame is as wide as the modal would be around this size (panel width + 2 x inset). frame: style for the frame (width, height).
// Inert: it leaves the Tab order.
export function DialogPanel({ frame, fit, ...props }) {
  const w = fit ? { width: `min(100%, calc(var(--dlg-panel-width-${props.size || 'md'}) + 2 * var(--dlg-panel-inset)))` } : null;
  return (
    <div className="dlg dlg-root dlg-frame" style={{ ...w, ...frame }}>
      <div className="dlg-layout"><Panel {...props} static /></div>
    </div>
  );
}

// ─── The modal ───────────────────────────────────────────────────────────────────────────────────────────────
function Layer({ open, leaving, onClose, blocking, scrimClose, initialFocus, returnFocus, closable, ...rest }) {
  const id = useId(), titleId = `${id}-title`, descId = `${id}-desc`;
  const panel = useRef(null), opener = useRef(null);
  const live = useRef({}); live.current = { onClose, blocking };

  // On mount: remember who had focus, lock the page. On unmount (after the fade): unlock.
  useLayoutEffect(() => {
    opener.current = returnFocus?.current || document.activeElement;
    lockScroll();
    return unlockScroll;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Esc closes the newest layer only (lib/useDismiss). A layer inside the dialog (select, menu) that handled Esc has prevented
  // the default, so the dialog stays. A press on the scrim is handled below, not as an outside press.
  const { isTop } = useDismiss({ open, press: false, escape: !blocking, onDismiss: (_, e) => { e.preventDefault(); live.current.onClose?.('escape'); } });

  // While open: trap focus, pull stray focus back, start inside. On close: give focus back at once.
  useEffect(() => {
    if (!open) return;
    const allowed = (el) => el?.closest?.('[data-focus-allow]');
    const onKey = (e) => {
      if (e.key !== 'Tab' || !isTop()) return;
      const p = panel.current, list = tabbables(p), a = document.activeElement;
      if (allowed(a)) return;
      if (!list.length) { e.preventDefault(); p.focus(); return; }
      const first = list[0], last = list[list.length - 1], inside = p.contains(a) && a !== p;
      if (e.shiftKey && (!inside || a === first)) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && (!inside || a === last)) { e.preventDefault(); first.focus(); }
    };
    const onFocusIn = (e) => {
      if (!isTop() || panel.current.contains(e.target) || allowed(e.target)) return;
      (tabbables(panel.current)[0] || panel.current).focus({ preventScroll: true });
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('focusin', onFocusIn);
    firstFocus(panel.current, initialFocus)?.focus({ preventScroll: true });
    return () => {
      document.removeEventListener('keydown', onKey); document.removeEventListener('focusin', onFocusIn);
      const back = opener.current;
      if (back && back.isConnected) back.focus({ preventScroll: true });
    };
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const press = (e) => { if (!panel.current.contains(e.target) && scrimClose && !blocking) onClose?.('scrim'); };
  return (
    <div className="dlg dlg-root dlg-ov motion-fade" data-leaving={leaving || undefined} data-state={leaving ? 'leaving' : 'open'} inert={leaving || undefined} data-light-root="" onPointerDown={press}
      {...rec('dialog scrim', [['background', 'background · 72%'], ['blur', 'space/4']])}>
      <div className="dlg-layout">
        <Panel {...rest} closable={closable && !blocking} onClose={onClose} panelRef={panel} titleId={titleId} descId={descId} leaving={leaving} />
      </div>
    </div>
  );
}


export default function Dialog({ open, onClose, blocking = false, scrimClose = true, closable = true, initialFocus, returnFocus, role = 'dialog', size = 'md', ...rest }) {
  const { mounted, leaving, gen } = usePresence(open);
  const [host, setHost] = useState(null);
  useEffect(() => setHost(document.body), []);
  if (!host || !mounted) return null;
  return createPortal(
    <Layer key={gen} open={open} leaving={leaving} onClose={onClose} blocking={blocking} scrimClose={scrimClose} closable={closable} initialFocus={initialFocus}
      returnFocus={returnFocus} role={role} size={size} {...rest} />, host);
}

// Alert dialog: one question, confirm or cancel. No close button, no scrim press, sm wide. Esc cancels.
// While `loading` the dialog stays open until the work ends: Esc does nothing (it is blocking) and Cancel is disabled.
// tone 'critical': the confirm is destructive, so focus starts on Cancel and the confirm is a critical secondary Button.
export function AlertDialog({ open, title, description, confirmLabel = 'Confirm', cancelLabel = 'Cancel', tone, loading, onConfirm, onCancel, ...rest }) {
  const critical = tone === 'critical';
  return (
    <Dialog open={open} role="alertdialog" size="sm" closable={false} scrimClose={false} blocking={!!loading} title={title} description={description}
      onClose={() => { if (!loading) onCancel?.(); }}
      actions={[{ label: cancelLabel, type: 'ghost', onClick: onCancel, focus: critical, disabled: loading },
        { label: confirmLabel, primary: true, tone, loading, onClick: onConfirm, focus: !critical }]} {...rest} />
  );
}
