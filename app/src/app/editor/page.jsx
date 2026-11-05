// Editor · the timeline editor redesign, built from the design system (D-034, D-036).
// Demo states open with ?scene=none|clip|text|ai|empty|grown (read in the browser, Editor.jsx).
// The narrow layout is the same page under 820px wide. Hold Ctrl + Alt to inspect tokens.
import Editor from './Editor';

export const metadata = { title: 'Editor', description: 'The HeyOz timeline editor, rebuilt from the design system: preview, one video strip, trim, reorder, captions, sound and AI on the selection.', alternates: { canonical: '/editor' } };

// Static: served from the CDN. The ?scene= demo links are read in the browser (Editor.jsx).
export default function Page() {
  return <Editor />;
}
