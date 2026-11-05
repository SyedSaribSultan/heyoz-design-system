import Shell from '@/docs/Shell';

// Every docs page shares this one frame, so the sidebar stays mounted between pages and its active
// highlight can slide from page to page (D-032). The route group "(docs)" does not change any URL.
export default function DocsLayout({ children }) {
  return <Shell>{children}</Shell>;
}
