import { PAGES } from '@/docs/nav';
import { SITE_URL } from '@/lib/site';

export default function sitemap() {
  return [{ url: SITE_URL, priority: 1 }, ...PAGES.map((p) => ({ url: `${SITE_URL}${p.href}`, priority: p.external ? 0.3 : 0.8 }))];
}
