'use client';
import Tooltip from '@/components/Tooltip';

// The docs' detail tips: the plain story stays on the page, the details (token names, references, values) live in a Tooltip.
// New lines in info stay. A tip's trigger takes focus, so the keyboard gets it too.

// A token name (click copies it: DocsChrome). info: the details shown in the tooltip (reference, value).
export function Token({ children, info }) {
  const code = <code className="d-token type-label-lg-medium" tabIndex={info ? 0 : undefined}>{children}</code>;
  return info ? <Tooltip wide content={info}>{code}</Tooltip> : code;
}

// Plain words with a detail tooltip.
export function Info({ info, children }) {
  return <Tooltip wide content={info}><span className="d-has-info" tabIndex={0}>{children}</span></Tooltip>;
}
