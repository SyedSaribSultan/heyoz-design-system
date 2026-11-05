import Shell from '@/docs/Shell';
import Button from '@/components/Button';

export const metadata = { title: 'Not found' };

export default function NotFound() {
  return (
    <Shell>
      <article className="d-page">
        <header className="d-head" style={{ boxShadow: 'none' }}>
          <span className="d-eyebrow type-label-lg-medium">404</span>
          <h1 className="type-display-md-semibold">We can’t find that page</h1>
          <p className="d-lede type-body-lg-regular">It may have moved. Press <kbd className="d-kbd type-label-lg-medium">/</kbd> to look for it, or start again from the beginning.</p>
          <div className="o-ctas"><Button type="brand" size="sm" href="/">Overview</Button><Button size="sm" href="/foundations/colour">Colour</Button></div>
        </header>
      </article>
    </Shell>
  );
}
