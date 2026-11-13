// Shared blocks for the Badge, Chip and Avatar docs pages: a spec table built from the generated variables,
// and the playground layout (a stage and a column of controls). No hooks: server and client files both import it.
import { Table, Token, Meta, Panel } from './ui';
import './display-docs.css';
// Playground and Control live in display-controls.jsx, so client demos do not pull in ui.jsx.

// Every variable a parts spec writes, and its type classes, straight from components.json. Nothing is typed here.
export function SpecTable({ spec, prefix, filter }) {
  const vars = filter ? spec.vars.filter((x) => filter(x.key)) : spec.vars;
  return (
    <Table first={280} cols={['Variable', 'Value']} rows={[
      ...vars.map((x) => [<Token key="k">--{prefix}-{x.key}</Token>, x.ref ? <Token key="v">{x.ref}</Token> : x.none ? 'none' : <span key="v">{x.px}px <Meta>set, not a token</Meta></span>]),
      ...Object.entries(filter ? {} : spec.types).map(([k, cls]) => [`type · ${k}`, <Token key="v">{cls}</Token>]),
    ]} />
  );
}

// A named rule from the spec, as a table row: the rule's name and its text.
export function RuleTable({ rules, keys }) {
  return <Table first={160} cols={['Rule', 'What it says']} rows={keys.map((k) => [<span key="k" className="type-label-lg-medium">{k}</span>, rules[k]])} />;
}

// A matrix panel: a header row and rows of specimens. cols: header labels after the first column.
export function Matrix({ cols, first = 'Name', rows, width = 140 }) {
  const style = { '--dx-cols': cols.length, '--dx-first': `${width}px` };
  return (
    <Panel lit pad={8} className="dx-matrix">
      <div className="dx-row dx-head type-label-lg-medium d-dim" style={style}><span>{first}</span>{cols.map((c) => <span key={c}>{c}</span>)}</div>
      {rows.map(([name, ...cells], i) => <div className="dx-row" style={style} key={i}><span className="dx-name">{name}</span>{cells.map((cell, j) => <span key={j} className="dx-cell">{cell}</span>)}</div>)}
    </Panel>
  );
}
