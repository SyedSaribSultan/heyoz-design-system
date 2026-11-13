'use client';
import { useState } from 'react';
import Button from '@/components/Button';
import Segmented from '@/components/Segmented';
import Dialog, { AlertDialog } from '@/components/Dialog';
import { Toaster, toast } from '@/components/Toast';
import { lucide } from '@/lib/Lucide';

// Live dialogs for the Dialog page. Each one keeps its own `open`: the dialog never closes itself.
const LONG = Array.from({ length: 9 }, (_, i) => `Paragraph ${i + 1}. Only the body scrolls. The title and the actions stay where they are, and a soft fade at the edge shows there is more above or below.`);

export function DialogPlayground() {
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState('md'), [content, setContent] = useState('form'), [scrim, setScrim] = useState('on'), [blocking, setBlocking] = useState('off');
  const [name, setName] = useState('Summer launch');
  const close = () => setOpen(false);
  const body = content === 'form'
    ? <label className="dg-field"><span className="type-label-lg-medium">Project name</span><input className="dg-input type-body-md-regular" value={name} onChange={(e) => setName(e.target.value)} /></label>
    : content === 'long' ? <div className="dg-long">{LONG.map((t) => <p key={t}>{t}</p>)}</div>
    : <p>Nothing here needs an answer except the one below.</p>;
  return (
    <div className="dg-play">
      <div className="dg-controls">
        <div className="dg-ctl"><span className="type-label-lg-medium d-dim">Size</span><Segmented label="Size" size="xs" value={size} onChange={setSize} items={[['sm', 'sm'], ['md', 'md'], ['lg', 'lg']]} /></div>
        <div className="dg-ctl"><span className="type-label-lg-medium d-dim">Body</span><Segmented label="Body" size="xs" value={content} onChange={setContent} items={[['form', 'Field'], ['text', 'Text'], ['long', 'Scrolls']]} /></div>
        <div className="dg-ctl"><span className="type-label-lg-medium d-dim">Scrim press closes</span><Segmented label="Scrim press closes" size="xs" value={scrim} onChange={setScrim} items={[['on', 'On'], ['off', 'Off']]} /></div>
        <div className="dg-ctl"><span className="type-label-lg-medium d-dim">Blocking</span><Segmented label="Blocking" size="xs" value={blocking} onChange={setBlocking} items={[['off', 'Off'], ['on', 'On']]} /></div>
      </div>
      <Button type="brand" size="sm" onClick={() => setOpen(true)}>Open the dialog</Button>
      <Dialog open={open} onClose={close} size={size} scrimClose={scrim === 'on'} blocking={blocking === 'on'}
        title="Rename project" description={content === 'form' ? 'Names show in the project list and in every export.' : undefined}
        footerStart={blocking === 'on' ? 'Only the buttons close this one.' : undefined}
        actions={[{ label: 'Cancel', type: 'ghost', onClick: close }, { label: 'Save', onClick: () => { close(); toast.success('Project saved', { description: content === 'form' ? name : undefined }); } }]}>
        {body}
      </Dialog>
      <Toaster />
    </div>
  );
}

// Alert dialogs: a plain confirm, and a destructive one (focus starts on Cancel).
export function AlertDemo() {
  const [which, setWhich] = useState(null), [busy, setBusy] = useState(false);
  const close = () => { if (!busy) setWhich(null); };
  const del = () => { setBusy(true); setTimeout(() => { setBusy(false); setWhich(null); toast.success('Project deleted', { action: { label: 'Undo', onClick: () => toast('Restored') } }); }, 900); };
  return (
    <div className="d-row">
      <Button type="secondary" size="sm" icon={lucide('log-out')} onClick={() => setWhich('leave')}>Leave without saving</Button>
      <Button type="secondary" size="sm" onClick={() => setWhich('delete')}>Delete project</Button>
      <AlertDialog open={which === 'leave'} title="Leave without saving?" description="Your changes to this clip are not saved yet."
        confirmLabel="Leave" cancelLabel="Stay" onCancel={close} onConfirm={() => setWhich(null)} />
      <AlertDialog open={which === 'delete'} tone="critical" loading={busy} title="Delete “Summer launch”?" description="Its 14 clips and 3 exports are deleted too. You can undo this for 10 seconds."
        confirmLabel="Delete project" onCancel={close} onConfirm={del} />
      <Toaster />
    </div>
  );
}
