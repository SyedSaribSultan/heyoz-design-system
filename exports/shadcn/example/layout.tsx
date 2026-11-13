// Example app/layout.tsx for a Next.js + shadcn/ui project using the HeyOz theme.
// Two things matter: class="dark" on <html> (HeyOz is dark only, D-001) and the two font variables
// that exports/shadcn/globals.css reads (--font-geist-sans, --font-bricolage).
import type { Metadata } from "next";
import { Geist, Bricolage_Grotesque } from "next/font/google";
import "./globals.css"; // copied from exports/shadcn/globals.css

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const bricolage = Bricolage_Grotesque({ variable: "--font-bricolage", subsets: ["latin"] });

export const metadata: Metadata = { title: "HeyOz" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`dark ${geist.variable} ${bricolage.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
