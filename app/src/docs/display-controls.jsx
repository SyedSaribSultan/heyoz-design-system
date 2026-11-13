
// Playground: a stage with the live specimen, then a labelled row per control.
export function Playground({ children, controls }) {
  return (
    <div className="d-panel lit" style={{ background: "var(--surface-primary)", padding: "var(--space-24)" }} data-name="panel · lit" data-tokens={JSON.stringify([["background","surface/primary"],["border","border/primary"],["radius","radius/xl"],["padding","space/24"],["light","light/cursor"]])}>
      <div className="dx-stage">{children}</div>
      <div className="dx-controls">{controls}</div>
    </div>
  );
}
export function Control({ label, children }) {
  return <><span className="dx-control-label type-label-lg-medium d-dim">{label}</span><div className="dx-control">{children}</div></>;
}

