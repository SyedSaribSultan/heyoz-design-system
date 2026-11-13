import { Token, Table, Meta } from '@/docs/ui';
import t from '@/tokens/tokens.resolved.json';
import './selection-docs.css';

// Shared page blocks for the three selection controls (Checkbox, Radio, Switch). Every number comes from the spec.
const px = (ref) => t.numbers.find((n) => n.name === ref)?.px;

// The value of a spec variable: the token, with its px when it is a number token; a set number is marked as set.
const value = (x) => x.none ? 'none' : x.px != null
  ? <span>{x.px}px <Meta>set, not a token</Meta></span>
  : <span className="d-row" style={{ gap: 'var(--space-8)' }}><Token>{x.ref}</Token>{px(x.ref) != null && <Meta>{px(x.ref)}px</Meta>}</span>;

// A spec number in px, by its variable key (tokens resolved).
export const num = (spec, key) => { const x = spec.vars.find((v) => v.key === key); return x.px ?? px(x.ref); };

// Every part of the spec as a table: the CSS variable and what it holds.
export function SpecTable({ spec, prefix }) {
  return (
    <Table first={300} cols={['Variable', 'Value']} rows={[
      ...spec.vars.map((x) => [<Token key="k">--{prefix}-{x.key}</Token>, value(x)]),
      ...Object.entries(spec.types).map(([k, cls]) => [`type · ${k}`, <Token key="v">{cls.replaceAll('-', '/')}</Token>]),
    ]} />
  );
}

// Named rules from the spec, as a table. keys: [[ruleKey, title]]
export function RuleTable({ spec, keys }) {
  return <Table first={160} cols={['Topic', 'Rule']} rows={keys.map(([k, title]) => [<span key="t" className="type-label-lg-medium">{title}</span>, spec.rules[k]])} />;
}

// A grid of specimens: head = column titles, rows = [title, sub, [cells]].
export function Matrix({ head, rows }) {
  return (
    <div className="sc-matrix" style={{ '--cols': head.length }}>
      <span />
      {head.map((h) => <span key={h} className="sc-head type-label-lg-medium d-dim">{h}</span>)}
      {rows.map(([title, sub, cells]) => [
        <span key={`${title}-t`} className="d-stack" style={{ gap: 0 }}><span className="type-label-lg-medium">{title}</span>{sub && <Meta>{sub}</Meta>}</span>,
        ...cells.map((cell, i) => <span key={`${title}-${i}`} className="sc-cell">{cell}</span>),
      ])}
    </div>
  );
}
