// Static assets in /public are not content-hashed, so they cache for a day and revalidate in the
// background for a week: fast repeat visits, and a re-export from Figma shows up within a day.
const ASSET_CACHE = 'public, max-age=86400, stale-while-revalidate=604800';

/** @type {import('next').NextConfig} */
export default {
  // NEXT_DIST_DIR lets a second server (e.g. a Turbopack test) build into its own folder without touching .next.
  distDir: process.env.NEXT_DIST_DIR || '.next',
  reactStrictMode: true,
  poweredByHeader: false,
  async redirects() {
    return [
      { source: '/foundations', destination: '/foundations/colour', permanent: false },
      { source: '/components', destination: '/components/button', permanent: false },
    ];
  },
  async headers() {
    return [
      { source: '/icons/:path*', headers: [{ key: 'Cache-Control', value: ASSET_CACHE }] },
      { source: '/home/:path*', headers: [{ key: 'Cache-Control', value: ASSET_CACHE }] },
      { source: '/icon-:size(\\d+).png', headers: [{ key: 'Cache-Control', value: ASSET_CACHE }] },
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};
