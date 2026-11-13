'use client';
import { useState } from 'react';
import Badge from '@/components/Badge';
import Segmented from '@/components/Segmented';
import { Playground, Control } from '@/docs/display-controls';

const TONES = ['neutral', 'brand', 'success', 'warning', 'critical', 'info'];
const CONTENT = [['label', 'Label'], ['dot', 'Dot'], ['icon', 'Icon'], ['count', 'Count'], ['signal', 'Dot only']];

// The playground: one live badge and the controls that build it.
export default function BadgeDemo() {
  const [tone, setTone] = useState('success'), [variant, setVariant] = useState('soft'), [size, setSize] = useState('md'), [content, setContent] = useState('label');
  const p = { tone, variant, size };
  return (
    <Playground controls={<>
      <Control label="Tone"><Segmented label="Tone" cols={3} items={TONES.map((t) => [t, t])} value={tone} onChange={setTone} /></Control>
      <Control label="Style"><Segmented label="Style" items={[['soft', 'Soft'], ['solid', 'Solid']]} value={variant} onChange={setVariant} /></Control>
      <Control label="Size"><Segmented label="Size" items={[['sm', 'sm'], ['md', 'md']]} value={size} onChange={setSize} /></Control>
      <Control label="Content"><Segmented label="Content" cols={5} items={CONTENT} value={content} onChange={setContent} /></Control>
    </>}>
      {content === 'label' && <Badge {...p}>Live</Badge>}
      {content === 'dot' && <Badge {...p} dot>Live</Badge>}
      {content === 'icon' && <Badge {...p} icon="circle-check">Live</Badge>}
      {content === 'count' && <Badge {...p} count={128} label="unread" />}
      {content === 'signal' && <Badge {...p} dot label="New" />}
    </Playground>
  );
}
