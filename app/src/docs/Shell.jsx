import Sidebar from './Sidebar';
import DocsChrome from './DocsChrome';
import { NAV } from './nav';
import { rec } from './ui';
import './docs.css';

// The site map as plain data for client code: no token data, nothing a page doesn't need.
const SITE = NAV.map((g) => ({ group: g.group, items: g.items.map((i) => ({ href: i.href, title: i.title, icon: i.icon, external: !!i.external, toc: i.toc || [] })) }));

// The docs frame: sidebar + one page. Used by every docs route (not by screens like /home).
export default function Shell({ children }) {
  return (
    <div className="d-shell" {...rec('page', [['background', 'background'], ['text colour', 'content/primary']])}>
      <a href="#main" className="d-skip type-label-lg-medium">Skip to content</a>
      <Sidebar nav={SITE} />
      <main id="main" className="d-main" tabIndex={-1}>{children}</main>
      <DocsChrome nav={SITE} />
    </div>
  );
}
