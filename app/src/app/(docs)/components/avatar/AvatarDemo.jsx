'use client';
import { useState } from 'react';
import Avatar from '@/components/Avatar';
import { SIZES, STATUSES } from '@/components/avatar-data';
import Segmented from '@/components/Segmented';
import { Playground, Control } from '@/docs/display-controls';

// The playground: one live avatar and the controls that build it.
export default function AvatarDemo() {
  const [size, setSize] = useState('xl'), [shape, setShape] = useState('circle'), [face, setFace] = useState('picture'), [status, setStatus] = useState('none');
  const p = { size, shape, status: status === 'none' ? undefined : status };
  return (
    <Playground controls={<>
      <Control label="Size"><Segmented label="Size" cols={6} items={SIZES.map((s) => [s, s])} value={size} onChange={setSize} /></Control>
      <Control label="Shape"><Segmented label="Shape" items={[['circle', 'Circle · people'], ['squircle', 'Squircle · brands']]} value={shape} onChange={setShape} /></Control>
      <Control label="Face"><Segmented label="Face" items={[['picture', 'Picture'], ['initials', 'Initials'], ['icon', 'Icon']]} value={face} onChange={setFace} /></Control>
      <Control label="Status"><Segmented label="Status" cols={5} items={[['none', 'None'], ...STATUSES.map((s) => [s, s])]} value={status} onChange={setStatus} /></Control>
    </>}>
      {face === 'picture' && <Avatar {...p} name="Maya Okafor" src="/home/avatar.webp" />}
      {face === 'initials' && <Avatar {...p} name="Priya Nair" />}
      {face === 'icon' && <Avatar {...p} label="Guest" />}
    </Playground>
  );
}
