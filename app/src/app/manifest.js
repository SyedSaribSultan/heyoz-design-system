import t from '@/tokens/tokens.resolved.json';

const bg = t.semantic.find((s) => s.name === 'background').hex;

export default function manifest() {
  return {
    name: 'HeyOz Design System', short_name: 'HeyOz DS', description: 'How HeyOz looks, feels and behaves.',
    start_url: '/', display: 'standalone', background_color: bg, theme_color: bg,
    icons: [{ src: '/icon-192.png', sizes: '192x192', type: 'image/png' }, { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }],
  };
}
