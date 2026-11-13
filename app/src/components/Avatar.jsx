'use client';
import { useEffect, useRef, useState } from 'react';
import { AVATAR, toneFor, initials } from './avatar-data';
import Lucide from '@/lib/Lucide';
import { rec } from '@/lib/rec';
import '@/styles/components.css';
import './avatar.css';

// Avatar, built from its spec: components/avatar.json → (npm run tokens) → components.json + components.css.
// Change the spec, not this file. Docs: docs/components/avatar.md.
// Who or what something belongs to: a picture, then initials from the name, then an icon.
//
//   <Avatar name="Maya Okafor" src="/home/avatar.webp" />                      circle, md (40)
//   <Avatar name="Acme" shape="squircle" size="lg" />                           a brand: initials on a tone picked from the name
//   <Avatar name="Maya Okafor" status="online" />                                status dot on the edge
//   <AvatarGroup label="Team" size="sm" max={3} avatars={[{ name, src }, …]} /> overlap, then +N
//
// size: 2xs 20 | xs 24 | sm 32 | md 40 (default) | lg 48 | xl 56 · shape: circle (people) | squircle (brands)
// status: online | away | busy | offline · tone: neutral | brand | success | warning | info (default: picked from the name)
// icon: the last fallback, a Lucide name (default user) · decorative: the name is written next to it, so hide it from assistive tech
// more: renders a "+N" face (the group does this) · ring: a surface token when it sits on something other than surface/primary
// An avatar is not a button: wrap it in a Button or a link to make it one.
const spec = AVATAR;
const val = (key) => spec.vars.find((v) => v.key === key);

export default function Avatar({ name = '', src, size = 'md', shape = 'circle', tone, status, icon = 'user', decorative, more, label, ring, className = '', style, ...props }) {
  const [loaded, setLoaded] = useState(false), [failed, setFailed] = useState(false);
  const img = useRef(null);
  // A picture that finished loading before hydration never fires onLoad again: check it here.
  useEffect(() => {
    const el = img.current;
    setLoaded(!!(el && el.complete && el.naturalWidth)); setFailed(!!(el && el.complete && !el.naturalWidth));
  }, [src]);
  const t = more !== undefined ? 'neutral' : tone || toneFor(name);
  const text = more !== undefined ? `+${more}` : initials(name, size);
  const accessible = more !== undefined ? `and ${more} more` : [label || name || 'Avatar', status].filter(Boolean).join(', ');
  const rows = [['size', val(`${size}-size`).ref], ['radius', shape === 'circle' ? 'radius/full' : `layout · ${val(`${size}-radius`).px}px (size × 0.3, set)`], ['border', 'border/primary'], ['border width', 'stroke/1'],
    ['background', `fill/${t === 'neutral' ? 'tertiary' : `${t}-secondary`}`], ['text colour', t === 'neutral' ? 'content/primary' : `content/${t}`], ['type', `type/${spec.types[size].slice(5).replaceAll('-', '/')}`], ['light', 'light/cursor (fallback only; a picture is media)'],
    ...(status ? [['status dot', `layout · ${val(`${size}-dot`).px}px (set)`], ['status colour', `fill/${{ online: 'success', away: 'warning', busy: 'critical' }[status] || 'content/tertiary'}`], ['ring', 'surface/primary · stroke/2']] : [])];
  return (
    <span className={`av ${className}`.trim()} data-size={size} data-shape={shape} data-tone={t} data-status={status || undefined}
      role={decorative ? undefined : 'img'} aria-label={decorative ? undefined : accessible} aria-hidden={decorative || undefined}
      style={ring ? { '--av-ring-colour': `var(--${ring.replaceAll('/', '-')})`, ...style } : style}
      {...rec(`avatar · ${shape} · ${size}${status ? ` · ${status}` : ''}`, rows)} data-component="avatar" {...props}>
      <span className="av-face">
        <span className={`av-fallback lit ${spec.types[size]}`} aria-hidden>{text || <Lucide name={icon} size={{ '2xs': 'xs', xs: 'xs', sm: 'sm', md: 'md', lg: 'lg', xl: 'xl' }[size]} />}</span>
        {src && !failed && <img ref={img} className="av-img" src={src} alt="" data-media data-loaded={loaded || undefined} onLoad={() => setLoaded(true)} onError={() => setFailed(true)} />}
      </span>
      {status && <span className="av-status" aria-hidden />}
    </span>
  );
}

// AvatarGroup: faces overlap by a set amount per size, each cut out by a ring of the surface colour.
// Past max it shows one "+N" face. avatars: [{ name, src, tone, … }] (any Avatar prop).
export function AvatarGroup({ avatars, max = 4, size = 'md', shape = 'circle', label, ring, className = '', ...props }) {
  const shown = avatars.slice(0, max), rest = avatars.length - shown.length;
  return (
    <span className={`av-group ${className}`.trim()} role="group" aria-label={label} {...props}>
      {shown.map((a, i) => <Avatar key={a.name || a.src || i} size={size} shape={shape} ring={ring} {...a} />)}
      {rest > 0 && <Avatar size={size} shape={shape} ring={ring} more={rest} />}
    </span>
  );
}
