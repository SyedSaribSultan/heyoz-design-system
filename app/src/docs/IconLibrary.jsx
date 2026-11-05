'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { fatIcons } from './icon-index';
import Lucide from './Lucide';

// Searchable icon grid. Single-colour icons are drawn from a sprite with <use>, so they take the
// text colour; colour icons (logos, flags, emoji) are drawn as images, as designed.
//
// Speed: the page HTML carries only the first `initial` icons. The full index (/icon-index/{lib})
// loads when the library comes near the screen or the search box is used, and tiles render in
// batches as you scroll, so 3,000 icons never land in the DOM at once.
const BATCH = 240;

export default function IconLibrary({ lib, initial, total: totalAll, sprite, dir, groupBy, placeholder }) {
  const [all, setAll] = useState(() => fatIcons(lib, initial));
  const [loaded, setLoaded] = useState(false);
  const [q, setQ] = useState('');
  const [limit, setLimit] = useState(BATCH);
  const root = useRef(null), more = useRef(null), loading = useRef(null);

  const load = () => {
    loading.current ??= fetch(`/icon-index/${lib}`).then((r) => r.json()).then((rows) => { setAll(fatIcons(lib, rows)); setLoaded(true); }).catch(() => { loading.current = null; });
    return loading.current;
  };
  // Fetch the index once the library is within a screen or so of the viewport.
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { load(); io.disconnect(); } }, { rootMargin: '1200px 0px' });
    io.observe(root.current);
    return () => io.disconnect();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  // Render the next batch when the end of the grid comes into view.
  useEffect(() => {
    if (!more.current) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setLimit((l) => l + BATCH); }, { rootMargin: '600px 0px' });
    io.observe(more.current);
    return () => io.disconnect();
  });
  useEffect(() => { setLimit(BATCH); }, [q]);

  const { groups, total, shown } = useMemo(() => {
    const s = q.trim().toLowerCase();
    const hit = (i) => !s || i.name.toLowerCase().includes(s) || i.set.toLowerCase().includes(s) || i.tags.includes(s);
    const list = all.filter(hit);
    let left = limit;
    const take = (l) => { const out = l.slice(0, Math.max(0, left)); left -= out.length; return out; };
    if (!groupBy) return { groups: [[null, take(list), list.length]], total: list.length, shown: Math.min(list.length, limit) };
    const m = new Map();
    for (const i of list) { const k = i.set || 'General'; if (!m.has(k)) m.set(k, []); m.get(k).push(i); }
    const groups = [...m.entries()].map(([k, l]) => [k, take(l), l.length]).filter(([, l]) => l.length);
    return { groups, total: list.length, shown: Math.min(list.length, limit) };
  }, [q, all, groupBy, limit]);

  const searching = q.trim() && !loaded;
  const count = loaded || q.trim() ? total : totalAll;
  return (
    <div className="il" ref={root}>
      <div className="il-bar">
        <span className="il-field lit">
          <Lucide name="search" className="il-glass" />
          <input className="il-search type-body-md-regular" type="search" value={q} onChange={(e) => setQ(e.target.value)} onFocus={load}
            placeholder={placeholder} aria-label={placeholder} spellCheck={false} autoComplete="off" />
        </span>
        <span className="d-dim type-label-lg-regular il-count" aria-live="polite">{searching ? 'Loading…' : `${count.toLocaleString('en')} of ${totalAll.toLocaleString('en')}`}</span>
      </div>
      {groups.map(([g, list, n]) => (
        <div key={g || 'all'} className="il-group">
          {g && <h3 className="d-sub type-label-lg-medium">{g} <span className="d-dim">· {n}</span></h3>}
          <div className="il-grid">
            {list.map((i) => (
              <a key={i.file} className="il-tile lit" href={`/icons/${dir}/${i.file}.svg`} download title={`${i.name} · download SVG`}>
                <span className="il-art">
                  {i.mono
                    ? <svg width="24" height="24" aria-hidden><use href={`${sprite}#${i.file}`} /></svg>
                    : <img src={`/icons/${dir}/${i.file}.svg`} alt="" loading="lazy" decoding="async" style={i.wide ? { width: 28, height: 'auto' } : { width: 24, height: 24 }} />}
                </span>
                <span className="il-name type-label-lg-regular">{(i.set && i.name.startsWith(i.set) && i.name.slice(i.set.length).trim()) || i.name}</span>
              </a>
            ))}
          </div>
        </div>
      ))}
      {(shown < total || !loaded) && <div ref={more} className="il-more type-label-lg-regular d-dim">{loaded ? `Showing ${shown.toLocaleString('en')} of ${total.toLocaleString('en')}` : 'Loading icons…'}</div>}
      {loaded && total === 0 && <p className="d-dim type-body-md-regular">No icon matches “{q}”.</p>}
    </div>
  );
}
