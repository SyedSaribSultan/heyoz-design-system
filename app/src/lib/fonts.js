import { Geist, Bricolage_Grotesque, Inter, Inter_Tight, Mona_Sans, Hubot_Sans, Plus_Jakarta_Sans, Manrope, Instrument_Serif, Space_Grotesk } from 'next/font/google';

// The system fonts (D-018) load with the page. The type-preview fonts (D-033) are declared but not
// preloaded: a browser downloads a font only when a page uses it, so they cost nothing until picked.
// next/font needs each call's options written out as a literal (no spreads, no shared objects).
export const geist = Geist({ subsets: ['latin'], display: 'swap', variable: '--font-geist' });
// opsz axis: Bricolage adjusts its letterforms to the size it is set at.
export const bricolage = Bricolage_Grotesque({ subsets: ['latin'], display: 'swap', variable: '--font-bricolage', axes: ['opsz'] });
export const inter = Inter({ subsets: ['latin'], display: 'swap', preload: false, variable: '--font-inter', axes: ['opsz'] });
export const interTight = Inter_Tight({ subsets: ['latin'], display: 'swap', preload: false, variable: '--font-inter-tight' });
export const mona = Mona_Sans({ subsets: ['latin'], display: 'swap', preload: false, variable: '--font-mona' });
export const hubot = Hubot_Sans({ subsets: ['latin'], display: 'swap', preload: false, variable: '--font-hubot' });
export const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], display: 'swap', preload: false, variable: '--font-jakarta' });
export const manrope = Manrope({ subsets: ['latin'], display: 'swap', preload: false, variable: '--font-manrope' });
export const instrument = Instrument_Serif({ subsets: ['latin'], display: 'swap', preload: false, variable: '--font-instrument', weight: '400' });
export const space = Space_Grotesk({ subsets: ['latin'], display: 'swap', preload: false, variable: '--font-space' });

export const FONT_VARIABLES = [geist, bricolage, inter, interTight, mona, hubot, jakarta, manrope, instrument, space].map((f) => f.variable).join(' ');
