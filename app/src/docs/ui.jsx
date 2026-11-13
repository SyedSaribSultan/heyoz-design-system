// Building blocks for every docs page. A page is: header → sections → prev/next.
// Each section is one idea: a title, one line of description, then the specimen.
import Link from 'next/link';
import { pageFor, neighbours } from './nav';
import Toc from './Toc';
import { slug } from './slug';
import Lucide from '@/lib/Lucide';
import { TypeSummary } from '@/lib/TypeCopy';
import { rec } from '@/lib/rec';
import t from '@/tokens/tokens.resolved.json';
import { Token, Info } from './Info';

export const v = (name) => `var(--${name.replaceAll('/', '-')})`;
export { rec }; // records tokens for the inspector (Ctrl + Alt), lib/rec.js
export { slug, Token, Info };

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

// ─── Spec helpers: every number on a docs page comes from the spec, never typed ───────────────
// px of a number token by its reference name ('size/control/xs' → 32).
export const px = (name) => t.numbers.find((n) => n.name === name)?.px;
// The helpers bound to one component spec. ref(key): the token a variable points at. px(keyOrRef): a variable's px
// (a set number, or the token it points at), or, when it is not a variable key, the px of that token.
export function specOf(spec) {
  const find = (key) => spec.vars.find((x) => x.key === key);
  return {
    ref: (key) => find(key)?.ref,
    px: (keyOrRef) => { const x = find(keyOrRef); return x ? (x.px ?? px(x.ref)) : px(keyOrRef); },
  };
}

// The value of a spec variable: the token and its px when it is a number token; a set number is marked as set.
const value = (x) => x.none ? 'none' : x.px != null
  ? <span>{x.px}px <Meta>set, not a token</Meta></span>
  : <span className="d-row" style={{ gap: 'var(--space-8)' }}><Token>{x.ref}</Token>{px(x.ref) != null && <Meta>{px(x.ref)}px</Meta>}</span>;

// "The details": every variable a parts spec writes (and its type classes) as a table. filter: keep only some variables.
// extra: more rows (set values, effects, layers) after the spec's own.
export function SpecTable({ spec, prefix, filter, extra = [] }) {
  const vars = filter ? spec.vars.filter((x) => filter(x.key)) : spec.vars;
  return (
    <Table first={300} cols={['Variable', 'Value']} rows={[
      ...vars.map((x) => [<Token key="k">--{prefix}-{x.key}</Token>, value(x)]),
      ...Object.entries(filter ? {} : spec.types).map(([k, cls]) => [`type · ${k}`, <Token key="v">{cls.replaceAll('-', '/')}</Token>]),
      ...extra,
    ]} />
  );
}

// Named rules from the spec, as a table. keys: a rule key, or [ruleKey, title].
export function RuleTable({ spec, keys, cols = ['Topic', 'Rule'] }) {
  return <Table first={160} cols={cols} rows={keys.map((k) => { const [key, title] = [].concat(k); return [<span key="t" className="type-label-lg-medium">{title ?? key}</span>, spec.rules[key]]; })} />;
}

// A panel of specimens: a header row, then a row per name. rows: [name, ...cells]. first: the first column's title.
export function Matrix({ cols, first = 'Name', rows, width = 140, tone }) {
  const style = { '--dx-cols': cols.length, '--dx-first': `${width}px` };
  return (
    <Panel lit pad={8} tone={tone} className="dx-matrix">
      <div className="dx-row dx-head type-label-lg-medium d-dim" style={style}><span>{first}</span>{cols.map((c) => <span key={c}>{c}</span>)}</div>
      {rows.map(([name, ...cells], i) => <div className="dx-row" style={style} key={i}><span className="dx-name">{name}</span>{cells.map((cell, j) => <span key={j} className="dx-cell">{cell}</span>)}</div>)}
    </Panel>
  );
}

// A row's name with a line under it (a value, a token): the first cell of a Matrix row.
export function RowName({ title, sub }) {
  return <><span className="type-label-lg-medium">{title}</span>{sub && <Meta>{sub}</Meta>}</>;
}
