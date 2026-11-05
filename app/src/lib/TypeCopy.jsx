'use client';
import { useEffect, useState } from 'react';
import { TYPE_OPTIONS, DEFAULT_TYPE, FAMILY, TYPE_EVENT } from './typeOptions';

// Copy that names the typeface follows the type preview (D-033): it reads the current choice and
// updates the moment it changes. Server HTML shows the system pair; the client swaps names in.
export function useTypeOption() {
  const [id, setId] = useState(DEFAULT_TYPE);
  useEffect(() => {
    setId(document.documentElement.dataset.type || DEFAULT_TYPE);
    const on = (e) => setId(e.detail);
    window.addEventListener(TYPE_EVENT, on);
    return () => window.removeEventListener(TYPE_EVENT, on);
  }, []);
  const o = TYPE_OPTIONS.find((x) => x.id === id) || TYPE_OPTIONS[0];
  const [display, displayShort] = FAMILY[o.display], [body, bodyShort] = FAMILY[o.body];
  return { id: o.id, single: o.kind === 'single', isDefault: o.id === DEFAULT_TYPE, display, displayShort, body, bodyShort };
}

// The family for a role: display and heading take the display face, body and label the body face.
export function FamilyName({ role }) {
  const n = useTypeOption();
  return role === 'display' || role === 'heading' ? n.display : n.body;
}

// The Typography page's one-line summary (header and overview card).
export function TypeSummary() {
  const n = useTypeOption();
  return `The letters HeyOz writes with: big ones for titles, smaller ones for reading. ${n.single ? `${n.display} does everything.` : `${n.displayShort} writes the titles, ${n.bodyShort} writes everything else.`}`;
}

export function FamiliesDesc() {
  const n = useTypeOption();
  if (n.isDefault) return 'Two typefaces work together. Bricolage is loud and friendly, for titles. Geist is calm and clear, for reading.';
  return n.single ? `One typeface does every job: ${n.display}.` : `Two typefaces work together: ${n.display} for titles, ${n.body} for reading.`;
}

export function RoleDesc({ role }) {
  const job = { display: 'The biggest words, for the moments that matter.', heading: 'Titles for sections, cards and menus.', body: 'Words for reading: sentences, prompts, descriptions.', label: 'Small words on buttons, chips and tags.' }[role];
  return <>{job} Written in <FamilyName role={role} />.</>;
}
