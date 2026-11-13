'use client';
import { useState } from 'react';
import Button from '@/components/Button';
import Segmented from '@/components/Segmented';
import { Toaster, toast } from '@/components/Toast';

// Live toasts for the Toast page. The toaster is one per app; a second one renders nothing, so this is safe next to the root one.
const SAY = {
  neutral: ['Link copied', 'Anyone with the link can view the project.'],
  success: ['Clip added to the timeline', 'It starts at 00:12.'],
  warning: ['You are low on credits', '12 left. An export uses 12.'],
  critical: ['Export failed', 'The file was too large. Try 720p.'],
  info: ['A new version is ready', 'Reload to get it.'],
};

export function ToastPlayground() {
  const [type, setType] = useState('success'), [action, setAction] = useState('off'), [desc, setDesc] = useState('off');
  const fire = (ty) => {
    const say = ty === 'neutral' ? toast : toast[ty], retry = ty === 'critical';
    say(SAY[ty][0], { description: desc === 'on' ? SAY[ty][1] : undefined, action: action === 'on' ? { label: retry ? 'Retry' : 'Undo', onClick: () => toast(retry ? 'Retrying' : 'Undone') } : undefined });
  };
  return (
    <div className="tg-play">
      <div className="tg-controls">
        <div className="tg-ctl"><span className="type-label-lg-medium d-dim">Type</span>
          <Segmented label="Type" size="xs" value={type} onChange={setType} items={[['neutral', 'Neutral'], ['success', 'Success'], ['warning', 'Warning'], ['critical', 'Critical'], ['info', 'Info']]} /></div>
        <div className="tg-ctl"><span className="type-label-lg-medium d-dim">Action</span><Segmented label="Action" size="xs" value={action} onChange={setAction} items={[['off', 'Off'], ['on', 'On']]} /></div>
        <div className="tg-ctl"><span className="type-label-lg-medium d-dim">Description</span><Segmented label="Description" size="xs" value={desc} onChange={setDesc} items={[['off', 'Off'], ['on', 'On']]} /></div>
      </div>
      <div className="d-row">
        <Button type="primary" size="sm" onClick={() => fire(type)}>Show toast</Button>
        <Button type="secondary" size="sm" onClick={() => ['neutral', 'success', 'info', 'warning', 'success'].forEach((ty, i) => setTimeout(() => fire(ty), i * 220))}>Show five</Button>
        <Button type="ghost" size="sm" onClick={() => toast.dismiss()}>Dismiss all</Button>
      </div>
      <Toaster />
    </div>
  );
}
