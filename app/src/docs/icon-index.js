// One icon as a short array, so the index stays small:
//   heyoz  → [file, name, set, mono (1|0), wide (1|0)]
//   lucide → [name, tags joined by spaces]
export function slimIcons(lib, list) {
  if (lib === 'lucide') return list.map((i) => [i.name, (i.tags || []).join(' ')]);
  return list.map((i) => [i.file || i.name, i.name, i.set || '', i.mono === false ? 0 : 1, i.w && i.w !== i.h ? 1 : 0]);
}

// Back to objects for the library component.
export function fatIcons(lib, rows) {
  if (lib === 'lucide') return rows.map(([name, tags]) => ({ file: name, name, tags, set: '', mono: true, wide: false }));
  return rows.map(([file, name, set, mono, wide]) => ({ file, name, set, tags: '', mono: !!mono, wide: !!wide }));
}
