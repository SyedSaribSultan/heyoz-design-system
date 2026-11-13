import '@/styles/tokens.css';
import '@/styles/typography.css';
import '@/styles/motion.css';
import './globals.css';
import Inspector from '@/lib/Inspector';
import LightField from '@/lib/LightField';
import { Toaster } from '@/components/Toast';
import t from '@/tokens/tokens.resolved.json';
import { SITE_URL } from '@/lib/site';
import { FONT_VARIABLES } from '@/lib/fonts';


const DESCRIPTION = 'The HeyOz design system: colour, type, spacing, radius, size, icons, motion, light and components. Dark, OKLCH, one page per thing, every specimen drawn with the token it documents.';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'HeyOz Design System', template: '%s · HeyOz Design System' },
  description: DESCRIPTION,
  applicationName: 'HeyOz Design System',
  openGraph: { type: 'website', siteName: 'HeyOz Design System', title: 'HeyOz Design System', description: DESCRIPTION, url: '/' },
  twitter: { card: 'summary_large_image', title: 'HeyOz Design System', description: DESCRIPTION },
  alternates: { canonical: '/' },
  formatDetection: { telephone: false },
};

// Browser chrome matches the background token.
export const viewport = { themeColor: t.semantic.find((s) => s.name === 'background').hex, colorScheme: 'dark', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={FONT_VARIABLES} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="type-body-md-regular">{children}<Inspector /><LightField /><Toaster /></body>
    </html>
  );
}
