import c from '@/tokens/components.json';

// Avatar's spec and helpers, kept out of Avatar.jsx (a client component) so docs pages on the server can read them.
export const AVATAR = c.avatar;
export const SIZES = ['2xs', 'xs', 'sm', 'md', 'lg', 'xl'];
export const TONES = ['neutral', 'brand', 'success', 'warning', 'info'];
export const STATUSES = ['online', 'away', 'busy', 'offline'];

// The same name always gets the same tone.
export const toneFor = (name = '') => TONES[[...name].reduce((h, ch) => (h * 31 + ch.codePointAt(0)) >>> 0, 7) % TONES.length];

// First letter of the first and last word; one letter at 2xs and xs, two from sm up (a one-word name gives its first two letters).
export function initials(name = '', size = 'md') {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (!words.length) return '';
  const one = size === '2xs' || size === 'xs';
  const letters = words.length > 1 ? [words[0], words[words.length - 1]].map((w) => [...w][0]).join('') : [...words[0]].slice(0, 2).join('');
  return (one ? [...letters][0] : letters).toUpperCase();
}
