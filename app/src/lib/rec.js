// rec(): record what an element is made of, for the token inspector (Ctrl + Alt): a name and [label, token] rows.
export const rec = (name, rows) => ({ 'data-name': name, 'data-tokens': JSON.stringify(rows) });
