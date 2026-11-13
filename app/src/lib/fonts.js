import { Geist, Bricolage_Grotesque } from 'next/font/google';

// The system fonts (D-018): Bricolage Grotesque for display and headings, Geist for body and labels.
// next/font needs each call's options written out as a literal (no spreads, no shared objects).
export const geist = Geist({ subsets: ['latin'], display: 'swap', variable: '--font-geist' });
// opsz axis: Bricolage adjusts its letterforms to the size it is set at.
export const bricolage = Bricolage_Grotesque({ subsets: ['latin'], display: 'swap', variable: '--font-bricolage', axes: ['opsz'] });

export const FONT_VARIABLES = [geist, bricolage].map((f) => f.variable).join(' ');
