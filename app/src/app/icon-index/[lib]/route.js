import icons from '@/icons/icons.json';
import { slimIcons } from '@/docs/icon-index';

// The icon libraries as small static JSON files (/icon-index/heyoz, /icon-index/lucide), built once
// at build time and served from the CDN. The Icons page fetches them instead of carrying 3,000
// icons in its HTML.
export const dynamic = 'force-static';
export const generateStaticParams = () => [{ lib: 'heyoz' }, { lib: 'lucide' }];

export async function GET(_req, { params }) {
  const { lib } = await params;
  if (!icons[lib]) return new Response('Not found', { status: 404 });
  return Response.json(slimIcons(lib, icons[lib]), { headers: { 'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400' } });
}
