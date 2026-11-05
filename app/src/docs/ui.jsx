// Building blocks for every docs page. A page is: header → sections → prev/next.
// Each section is one idea: a title, one line of description, then the specimen.
import Link from 'next/link';
import { pageFor, neighbours } from './nav';
import Toc from './Toc';
import { slug } from './slug';
import Lucide from './Lucide';
import { TypeSummary } from '@/lib/TypeCopy';

export const v = (name) => `var(--${name.replaceAll('/', '-')})`;
// Records tokens for the inspector (hold Ctrl + Alt): rows of [property, token].
export const rec = (name, rows) => ({ 'data-name': name, 'data-tokens': JSON.stringify(rows) });
export { slug };

export function DocPage({ href, children }) {
  const p = pageFor(href), toc = p.toc || [];
  const { prev, next } = neighbours(href);
  return (
    <article className="d-page">
      <header className="d-head">
        <h1 className="type-display-md-semibold">{p.title}</h1>
        <p className="d-lede type-body-lg-regular">{p.href === '/foundations/typography' ? <TypeSummary /> : p.summary}</p>
      </header>
      <div className="d-layout">
        <div className="d-content">{children}</div>
        {toc.length > 1 && <Toc items={toc.map((t) => [t, slug(t)])} />}
      </div>
      <footer className="d-pager">
        {prev ? <Link href={prev.href} className="d-pager-link lit"><span className="type-label-lg-regular d-dim"><Lucide name="arrow-left" /> Previous</span><span className="type-heading-sm-medium">{prev.title}</span></Link> : <span />}
        {next ? <Link href={next.href} className="d-pager-link d-pager-next lit"><span className="type-label-lg-regular d-dim">Next <Lucide name="arrow-right" /></span><span className="type-heading-sm-medium">{next.title}</span></Link> : <span />}
      </footer>
    </article>
  );
}

export function Section({ title, desc, children, aside }) {
  return (
    <section id={slug(title)} className="d-section">
      <div className="d-section-head">
        <div>
          <h2 className="type-heading-md-semibold"><a href={`#${slug(title)}`} className="d-anchor">{title}</a></h2>
          {desc && <p className="d-desc type-body-md-regular">{desc}</p>}
        </div>
        {aside}
      </div>
      {children}
    </section>
  );
}

// A framed area. tone: the surface token it paints. Every panel is lit (light/cursor) and shaded.
export function Panel({ tone = 'surface/primary', lit, pad = 24, className = '', style, children }) {
  const props = { className: `d-panel lit ${className}`.trim(), style: { background: v(tone), padding: v(`space/${pad}`), ...style },
    ...rec('panel · lit', [['background', tone], ['border', 'border/primary'], ['radius', 'radius/xl'], ['padding', `space/${pad}`], ['effect', 'effect · inner-shade'], ['light', 'light/cursor']]) };
  return <div {...props}>{children}</div>;
}

export function Grid({ min = 200, gap = 12, children }) {
  return <div className="d-grid" style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${min}px, 1fr))`, gap: v(`space/${gap}`) }}>{children}</div>;
}

// A token name (click copies it). info: the details shown in the tooltip (reference, value).
export function Token({ children, info }) { return <code className="d-token type-label-lg-medium" data-info={info}>{children}</code>; }
// Plain words with a detail tooltip.
export function Info({ info, children }) { return <span className="d-has-info" data-info={info}>{children}</span>; }
export function Meta({ children }) { return <span className="d-dim type-label-lg-regular">{children}</span>; }

// A simple, aligned spec table. cols: header labels. rows: arrays of cells.
export function Table({ cols, rows, first = 160 }) {
  const grid = { gridTemplateColumns: `${first}px repeat(${cols.length - 1}, minmax(0, 1fr))` };
  return (
    <div className="d-table lit" {...rec('table · lit', [['background', 'surface/primary'], ['border', 'border/primary'], ['radius', 'radius/xl'], ['effect', 'effect · inner-shade'], ['light', 'light/cursor']])}>
      <div className="d-tr d-th type-label-lg-medium" style={grid}>{cols.map((c) => <div key={c}>{c}</div>)}</div>
      {rows.map((r, i) => <div className="d-tr" style={grid} key={i}>{r.map((c, j) => <div key={j}>{c}</div>)}</div>)}
    </div>
  );
}
