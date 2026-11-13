'use client';
import { useState } from 'react';
import { RadioGroup, Radio } from '@/components/Radio';
import Switch from '@/components/Switch';
import Segmented from '@/components/Segmented';

const PLANS = [['free', 'Free', 'One brand, 20 credits a month.'], ['pro', 'Pro', 'Five brands, 500 credits a month.'], ['team', 'Team', 'Unlimited brands, shared credits.']];

// Playground: one live group and the knobs that change it.
export function RadioPlayground({ sm, md }) {
  const [plan, setPlan] = useState('pro');
  const [size, setSize] = useState('md'), [dir, setDir] = useState('vertical');
  const [desc, setDesc] = useState(true), [offOne, setOffOne] = useState(false), [offAll, setOffAll] = useState(false);
  return (
    <div className="sc-play">
      <div className="sc-stage sc-stage-wide">
        <RadioGroup label="Plan" value={plan} onChange={setPlan} size={size} orientation={dir} disabled={offAll}>
          {PLANS.map(([v, l, d]) => <Radio key={v} value={v} label={l} description={desc ? d : undefined} disabled={offOne && v === 'team'} />)}
        </RadioGroup>
      </div>
      <div className="sc-controls">
        <span className="sc-controls-title type-label-lg-medium">Change it</span>
        <Segmented label="Size" size="xs" value={size} onChange={setSize} items={[['sm', `Small · ${sm}`], ['md', `Medium · ${md}`]]} />
        <Segmented label="Layout" size="xs" value={dir} onChange={setDir} items={[['vertical', 'Vertical'], ['horizontal', 'Horizontal']]} />
        <Switch size="sm" label="Descriptions" checked={desc} onChange={setDesc} />
        <Switch size="sm" label="Team disabled" checked={offOne} onChange={setOffOne} />
        <Switch size="sm" label="Whole group disabled" checked={offAll} onChange={setOffAll} />
      </div>
    </div>
  );
}

export function GroupDemo({ orientation = 'vertical', descriptions, label = 'Aspect ratio' }) {
  const [v, setV] = useState('16:9');
  return (
    <RadioGroup label={label} value={v} onChange={setV} orientation={orientation}>
      {[['16:9', 'Wide'], ['9:16', 'Tall'], ['1:1', 'Square']].map(([k, l]) => <Radio key={k} value={k} label={l} description={descriptions ? `${k} · ${k === '9:16' ? 'Shorts, Reels' : k === '16:9' ? 'YouTube, web' : 'Feed posts'}` : undefined} />)}
    </RadioGroup>
  );
}

// The disabled group: one chosen, all disabled; and one option disabled among enabled ones.
export function DisabledDemo() {
  return (
    <div className="sc-row">
      <RadioGroup label="Whole group" defaultValue="a" disabled>
        <Radio value="a" label="Chosen" /><Radio value="b" label="Not chosen" />
      </RadioGroup>
      <RadioGroup label="One option" defaultValue="a">
        <Radio value="a" label="Available" /><Radio value="b" label="Needs Pro" disabled /><Radio value="c" label="Available" />
      </RadioGroup>
    </div>
  );
}
