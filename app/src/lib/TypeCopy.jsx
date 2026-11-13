// Copy that names the typefaces (D-018): Bricolage Grotesque for titles, Geist for everything else.
const FAMILY = { display: 'Bricolage Grotesque', body: 'Geist' };

// The family for a role: display and heading take the display face, body and label the body face.
export function FamilyName({ role }) {
  return role === 'display' || role === 'heading' ? FAMILY.display : FAMILY.body;
}

// The Typography page's one-line summary (header and overview card).
export function TypeSummary() {
  return 'The letters HeyOz writes with: big ones for titles, smaller ones for reading. Bricolage writes the titles, Geist writes everything else.';
}

export function FamiliesDesc() {
  return 'Two typefaces work together. Bricolage is loud and friendly, for titles. Geist is calm and clear, for reading.';
}

export function RoleDesc({ role }) {
  const job = { display: 'The biggest words, for the moments that matter.', heading: 'Titles for sections, cards and menus.', body: 'Words for reading: sentences, prompts, descriptions.', label: 'Small words on buttons, chips and tags.' }[role];
  return <>{job} Written in <FamilyName role={role} />.</>;
}
