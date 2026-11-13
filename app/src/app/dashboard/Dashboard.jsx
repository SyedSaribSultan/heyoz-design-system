'use client';
import { useEffect, useRef, useState } from 'react';
import { tk } from '@/lib/tk';
import Button from '@/components/Button';
import Segmented from '@/components/Segmented';
import HomeSideNav from '../home/HomeSideNav';
import IconButton from '../home/IconButton';
import { Ic, iconUrl as L } from '../editor/parts/parts';
import { BRAND, IDEAS, WORKING, COMPETITORS, RESULTS, STATES } from './data';

// Oz dashboard: one prompt box (Oz), one suggested next move, then everything Oz knows, in plain words.
// The page never shows the engine (research → x-ray → angles → ranking). It shows what came out of it.
// Rules: one orange fill per view (the Ask Oz button) · one decision at a time · nothing that costs
// credits or money happens without a yes · one picture, one sentence, one button per card.

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// ─── Ad creative (drawn, so every ad reads as a real static ad without stock photos) ───────────────
function AdArt({ ad, mine, making }) {
  const dark = ad.ground === 'amber';
  return (
    <div className="oz-art" data-media data-ground={ad.ground} data-look={ad.look} data-dark={dark || undefined}>
      {ad.look === 'puzzle' && <div className="oz-puzzle" aria-hidden><i /><i /><i /><b>?</b></div>}
      {ad.look === 'versus' && <div className="oz-versus" aria-hidden><span>$40</span><span>15<small>min</small></span></div>}
      {ad.look === 'streak' && <div className="oz-streak" aria-hidden>100<small>day streak</small></div>}
      <p className="oz-art-head">{ad.head}</p>
      <div className="oz-art-foot">
        {mine ? <img src={BRAND.logo} alt="" /> : <span className="oz-mark">{ad.mark}</span>}
        <span>{mine ? BRAND.name : 'Sponsored'}</span>
      </div>
      {making && <div className="oz-making"><span className="oz-spin" /><span>Making…</span></div>}
    </div>
  );
}

const STATUS = {
  making: ['Making', 'neutral'], ready: ['Ready', 'neutral'], winning: ['Winning', 'success'], okay: ['Okay', 'warning'], stopped: ['Stopped', 'critical'], boosted: ['Winning · more money', 'success'],
};
function Pill({ kind = 'neutral', icon, children }) {
  return <span className="oz-pill" data-kind={kind}>{icon && <Ic n={icon} size="xs" />}{children}</span>;
}

function Section({ title, sub, more, children, id }) {
  return (
    <section {...tk(`${title} section`, { gap: 12 })} className="col oz-sec" id={id}>
      <div className="hrow between oz-sec-h">
        <div className="col">
          <h2 {...tk('section title', { type: 'body/lg/medium', color: 'content/primary' })}>{title}</h2>
          {sub && <p {...tk('section sub', { type: 'body/sm/regular', color: 'content/tertiary' })}>{sub}</p>}
        </div>
        {more && <a href="#" {...tk('see all', { gap: 6, type: 'label/md/medium', color: 'content/tertiary' })} className="hrow oz-more" onClick={(e) => e.preventDefault()}>Open {more} <Ic n="chevron-right" size="sm" /></a>}
      </div>
      {children}
    </section>
  );
}

// ─── Oz's answer: appears right under the prompt. Never a side chat. ───────────────────────────────
function OzCard({ oz, onAct }) {
  if (!oz) return null;
  return (
    <div {...tk('oz answer', { bg: 'surface/secondary', border: 'border/secondary', radius: '2xl', p: 16, gap: 12 }, { width: 1024, maxWidth: '100%' })} className="col oz-card motion-pop" aria-live="polite">
      <div className="hrow oz-who"><span className="oz-avatar" data-busy={oz.working || undefined} /><span {...tk('oz name', { type: 'label/md/medium', color: 'content/secondary' })}>Oz</span>
        {!oz.working && <span style={{ marginLeft: 'auto' }}><Button type="ghost" size="2xs" icon={L('x')} label="Close" onClick={() => onAct('close')} /></span>}</div>
      {oz.steps && (
        <ul className="oz-steps">{oz.steps.map((s, i) => <li key={s} data-done={i < oz.done || undefined}>{i < oz.done ? <Ic n="check" size="sm" /> : <span className="oz-spin" />}{s}</li>)}</ul>
      )}
      {oz.text && <p {...tk('oz says', { type: 'body/lg/regular', color: 'content/primary' })}>{oz.text}</p>}
      {oz.facts && <div className="oz-facts">{oz.facts.map(([k, v]) => <div key={k}><span>{k}</span><b>{v}</b></div>)}</div>}
      {oz.cost && <div className="hrow wrap oz-cost">{oz.cost.map((c) => <Pill key={c}>{c}</Pill>)}</div>}
      {oz.acts && !oz.working && (
        <div className="hrow wrap oz-acts">
          {oz.acts.map(([label, kind, act], i) => <Button key={label} type={i === 0 ? 'primary' : 'tertiary'} size="sm" onClick={() => onAct(act)}>{label}</Button>)}
        </div>
      )}
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [state, setState] = useState('brand');
  const [ads, setAds] = useState([]);
  const [boosted, setBoosted] = useState(false);
  const [oz, setOz] = useState(null);
  const [text, setText] = useState('');
  const run = useRef(0);
  const box = useRef(null);

  // Demo: jumping to a state sets the data that state implies.
  function jump(s) {
    run.current++; setOz(null); setBoosted(false); setState(s);
    if (s === 'new' || s === 'brand') setAds([]);
    if (s === 'ready') setAds(IDEAS.map((i) => ({ id: i.id, idea: i, status: 'ready' })));
    if (s === 'live' || s === 'next') setAds(IDEAS.map((i) => ({ id: i.id, idea: i, status: RESULTS.byAd[i.id].status })));
  }
  useEffect(() => { const k = (e) => { if (e.target.closest('input,textarea')) return; const i = +e.key - 1; if (STATES[i]) jump(STATES[i][0]); }; window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k); }, []);

  async function think(steps, then) {
    const me = ++run.current;
    for (let d = 0; d <= steps.length; d++) { if (me !== run.current) return; setOz({ working: d < steps.length, steps, done: d }); await wait(650); }
    if (me === run.current) setOz({ steps, done: steps.length, ...then });
  }
  async function makeAds(list, replace) {
    const me = run.current;
    const fresh = list.map((idea, i) => ({ id: `${idea.id}-${Date.now()}-${i}`, idea, status: 'making' }));
    setAds((a) => (replace ? fresh : [...fresh, ...a]));
    for (const f of fresh) { await wait(700); if (me !== run.current) return; setAds((a) => a.map((x) => (x.id === f.id ? { ...x, status: 'ready' } : x))); }
  }

  // What Oz does with a request. Thinking is free and automatic; anything that costs needs a yes.
  function ask(raw) {
    const t = (raw || '').toLowerCase().trim(); if (!t) return;
    setText('');
    if (state === 'new' || /http|www|\.com|\.org|website|set up|setup/.test(t)) return act('setup');
    if (/no website|don.t have/.test(t)) return setOz({ text: "No problem. Tell me in one line what you sell and who it's for, like: “A math app for curious adults, $25 a month.”" });
    if (/example/.test(t)) return setOz({ text: 'Here is one: a coffee shop pastes its site. Oz finds 4 cafés nearby that run ads, sees “morning deal” ads last longest, and makes 5 morning-deal ads in the café’s colours. The owner just says yes.' });
    if (/why/.test(t) && /win/.test(t)) return setOz({ text: '“Guess the answer” asks a question in the first second, so people stop and try it. Your other ads start with a claim. Claims are easy to scroll past.' });
    if (/spend|spent|cost|money/.test(t) && state !== 'brand' && state !== 'new') return setOz({ text: `You've spent $${RESULTS.spent} so far and got ${RESULTS.trials} free trials. That's $${(RESULTS.spent / RESULTS.trials).toFixed(2)} each. You set a limit of $${RESULTS.perDay * RESULTS.of}.` });
    if (/test|launch|run them|go live/.test(t)) return act('test');
    if (/more money|scale|boost/.test(t)) return act('scale');
    if (/like the winner|more like|5 more|five more/.test(t)) return act('more');
    if (/quizzo|competitor|working|show me/.test(t)) { document.getElementById('working')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); return setOz({ text: 'Scroll down: these are the ads running longest for apps like yours. Long-running ads are usually the ones making money.' }); }
    if (/video/.test(t)) return act('make', { only: 'video' });
    return act('make');
  }

  async function act(a, opt = {}) {
    if (a === 'setup') return think([`Reading ${BRAND.site}`, 'Finding your product, price and voice', 'Finding 4 apps like yours', 'Looking at 82 of their ads'], {
      text: 'This is what I learned about you. Is it right?',
      facts: [['Brand', BRAND.name], ['What you sell', 'Learning app, $24.99 a month'], ['Who it’s for', 'Curious adults who want to think better'], ['How you sound', 'Warm, clever, never smug']],
      acts: [['Yes, that’s me', 'primary', 'setupYes'], ['Fix something', 'tertiary', 'fix']],
    });
    if (a === 'setupYes') { setState('brand'); return setOz({ text: 'Great. Below are 5 ideas made for you, the ads working best for apps like yours, and how your competitors are doing.' }); }
    if (a === 'fix') { box.current?.focus(); return setOz({ text: 'Type what I got wrong in the box above. I won’t change anything about your brand without asking you.' }); }
    if (a === 'make') {
      const list = opt.only === 'video' ? IDEAS.filter((i) => i.format === 'Video') : opt.idea ? [opt.idea] : IDEAS;
      const n = list.length;
      return setOz({
        text: opt.idea ? `I'll make “${opt.idea.title}” for ${BRAND.name}, in your colours and voice.` : `I'll make ${n} ads from your top ideas, in your colours and voice. Sized for Instagram and TikTok.`,
        cost: [`${n} ad${n > 1 ? 's' : ''}`, `${n * 4} credits`, `About ${Math.max(1, Math.round(n * 0.6))} min`],
        acts: [[n > 1 ? `Yes, make ${n} ads` : 'Yes, make it', 'primary', { go: 'makeYes', list }], ['Not now', 'tertiary', 'close']],
      });
    }
    if (a?.go === 'makeYes') {
      setOz({ text: `Making ${a.list.length === 1 ? 'your ad' : `${a.list.length} ads`}. They'll show up in “Your ads” below. You can keep going.` });
      if (state === 'brand' || state === 'new') setState('ready');
      return makeAds(a.list, state === 'brand' || state === 'new');
    }
    if (a === 'test') return setOz({
      text: `I'll show your ${ads.length || 5} ads to people on Instagram and TikTok for 7 days, and stop weak ones early.`,
      cost: [`$${RESULTS.perDay} a day`, `$${RESULTS.perDay * RESULTS.of} at most`, 'Stop anytime'],
      acts: [['Yes, start the test', 'primary', 'testYes'], ['Not now', 'tertiary', 'close']],
    });
    if (a === 'testYes') { setOz({ text: 'Test started. I’ll tell you as soon as one ad is clearly better. (Demo: jumping to day 3.)' }); await wait(1400); jump('live'); return setOz({ text: 'Day 3: “Guess the answer” is winning. It gets a free trial for $0.90. The others cost $1.40 or more.' }); }
    if (a === 'scale') return setOz({
      text: 'Move the money from the stopped ad to the winner? Your total stays the same.',
      cost: ['Winner: $8 → $12 a day', 'Total: still $20 a day'],
      acts: [['Yes, move it', 'primary', 'scaleYes'], ['Not now', 'tertiary', 'close']],
    });
    if (a === 'scaleYes') { setBoosted(true); return setOz({ text: 'Done. The winner now gets $12 a day. I’ll check again tomorrow.' }); }
    if (a === 'more') return setOz({
      text: 'Winning ads get tired after about 2 weeks. I’ll make 5 fresh versions of “Guess the answer” so costs stay low.',
      cost: ['5 ads', '20 credits', 'About 3 min'],
      acts: [['Yes, make 5 more', 'primary', { go: 'makeYes', list: [
        { id: 'r1', title: 'Guess the shape', format: 'Video', ad: { ground: 'green', head: 'Which shape comes next?', look: 'puzzle' } },
        { id: 'r2', title: 'Guess the number', format: 'Video', ad: { ground: 'red', head: 'Only 4% get this. Do you?', look: 'puzzle' } },
        { id: 'r3', title: 'Guess before your coffee', format: 'Image ad', ad: { ground: 'amber', head: 'Solve it before your coffee cools', look: 'puzzle' } },
        { id: 'r4', title: 'Guess vs. friends', format: 'Video', ad: { ground: 'gray', head: 'Send this to your smartest friend', look: 'type' } },
        { id: 'r5', title: 'Guess in 3 seconds', format: 'Video', ad: { ground: 'blue', head: '3 seconds. Go.', look: 'puzzle' } },
      ] }], ['Not now', 'tertiary', 'close']],
    });
    if (a === 'close') return setOz(null);
  }

  // ─── What Oz suggests: the single most useful next move for this state ───
  const SUGGEST = {
    new: { title: 'Set up my brand from my website', why: 'Oz reads your site and learns your product, price and voice. Takes about a minute.', icon: 'globe', act: 'setup', more: ["I don't have a website", 'Show me an example'] },
    brand: { title: 'Make my first 5 ads', why: 'Made from the 5 ideas below, each copied from an ad that is already working.', icon: 'wand-sparkles', act: 'make', more: ['Make only videos', 'Show me what’s working'] },
    ready: { title: 'Test my ads for 7 days', why: ads.some((a) => a.status === 'making') ? 'As soon as your ads are made. $20 a day, and Oz stops the weak ones early.' : `${ads.length} ads are ready. $20 a day, and Oz stops the weak ones early.`, icon: 'rocket', act: 'test', more: ['Make 5 more like these', 'Make only videos'] },
    live: boosted ? { title: 'Make 5 more like the winner', why: 'Keep the winner fresh before people get tired of it.', icon: 'wand-sparkles', act: 'more', more: ['Why is it winning?', 'How much did I spend?'] }
      : { title: 'Put more money on the winner', why: '“Guess the answer” gets a free trial for $0.90. The stopped ad cost $4.80.', icon: 'trending-up', act: 'scale', more: ['Why is it winning?', 'How much did I spend?'] },
    next: { title: 'Make 5 more like the winner', why: 'Winners get tired after about 2 weeks. Fresh versions keep costs low.', icon: 'wand-sparkles', act: 'more', more: ['Show me Quizzo’s 6 new ads', 'How much did I spend?'] },
  }[state];

  const HELLO = {
    new: ['Welcome to HeyOz', 'Tell Oz what you sell. It finds what works and makes your ads.'],
    brand: ['Good morning, Sarib', `Oz looked at 82 ads from 4 ${BRAND.niche} like yours. Here’s what’s working.`],
    ready: ['Good morning, Sarib', ads.some((a) => a.status === 'making') ? 'Oz is making your ads. They’ll appear below.' : `${ads.length} ads are ready. They need your OK.`],
    live: ['Good morning, Sarib', `Your test is on day ${RESULTS.day} of ${RESULTS.of}. One ad is clearly winning.`],
    next: ['Good morning, Sarib', `Since yesterday: ${RESULTS.trials} people started a free trial from your ads.`],
  }[state];

  const has = (s) => ({ new: ['how', 'working'], brand: ['ideas', 'working', 'rivals'], ready: ['ads', 'ideas', 'working', 'rivals'], live: ['results', 'ads', 'ideas', 'working', 'rivals'], next: ['results', 'ads', 'working', 'ideas', 'rivals'] }[state].indexOf(s));
  const order = (s) => ({ order: has(s) });

  const madeIdeas = new Set(ads.map((a) => a.idea.id));
  const perTrial = (RESULTS.spent / RESULTS.trials).toFixed(2);

  return (
    <div {...tk('page', { bg: 'background', className: 'home oz' })}>
      <HomeSideNav />
      <div {...tk('top nav + workspace')} className="col grow main">
        {/* Top nav: same as Home (Go Back · Tasks · Upgrade), plus a sample-data tag for the prototype. */}
        <header {...tk('top nav', { px: 16, py: 8 })} className="hrow between">
          <div className="hrow" style={{ gap: 'var(--space-8)' }}>
            <button {...tk('go back', { hover: 'fill/tertiary-hover', radius: 'lg', px: 12, py: 8, gap: 4 })} className="hrow" data-btn>
              <span {...tk('icon', { size: 'icon/sm' })} data-icon><img src="/home/chevron-left.svg" alt="" /></span>
              <span {...tk('go back label', { type: 'label/md/medium', color: 'content/primary' })}>Go Back</span>
            </button>
            <span className="oz-sample">Sample data · prototype</span>
          </div>
          <div {...tk('top actions', { gap: 8 })} className="hrow">
            <IconButton icon="tasks.svg" bg="fill/secondary" radius="lg" name="tasks" label="Tasks" />
            <span {...tk('divider', {}, { width: 12, height: 12 })} className="divider"><img src="/home/divider.svg" alt="" /></span>
            <button {...tk('upgrade', { bg: 'fill/tertiary', hover: 'fill/tertiary-hover', border: 'border/secondary', fx: 'inner-shade', radius: 'lg', px: 12, py: 8, gap: 4 })} className="hrow" data-btn>
              <span {...tk('icon', { size: 'icon/sm' })} data-icon><img src="/home/diamond.svg" alt="" /></span>
              <span {...tk('upgrade label', { type: 'label/md/medium', color: 'content/primary' })}>Upgrade</span>
            </button>
          </div>
        </header>

        <main {...tk('workspace', { pt: 16, pb: 32, px: 16 })} className="col grow center-x">
          <div {...tk('content', { py: 32, gap: 32 })} className="col center-x full oz-content">
            {/* 1 · Hello: who you are talking to, and the one-line state of things */}
            <div {...tk('hero text', { gap: 12 })} className="col center-x text-center">
              <h1 {...tk('title', { type: 'display/sm/medium', color: 'content/primary' })}>{HELLO[0]}</h1>
              <p {...tk('status', { type: 'body/lg/regular', color: 'content/secondary', gap: 8 })} className="hrow center oz-status"><span className="oz-dot" data-live={state === 'live' || state === 'next' || undefined} />{HELLO[1]}</p>
            </div>

            {/* 2 · Oz: the prompt box. Anything typed works; Oz answers right below it. */}
            <div className="col center-x full" style={{ gap: 'var(--space-12)' }}>
              <form {...tk('oz prompt', { bg: 'surface/secondary', border: 'border/brand-secondary', fx: 'drop-md', radius: '3xl', p: 12, gap: 8 }, { width: 1024, maxWidth: '100%' })} className="hrow end oz-prompt"
                onSubmit={(e) => { e.preventDefault(); ask(text); }}>
                <div className="col grow stretch between" style={{ gap: 'var(--space-12)' }}>
                  <textarea ref={box} rows={2} value={text} onChange={(e) => setText(e.target.value)} aria-label="Ask Oz"
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ask(text); } }}
                    placeholder={state === 'new' ? 'Paste your website, or tell Oz what you sell' : 'Tell Oz what you want. Like “get more people to try my app”'}
                    {...tk('prompt', { pt: 6, pl: 6, pr: 12, type: 'body/lg/regular', color: 'content/primary' })} />
                  <div className="hrow wrap" style={{ gap: 'var(--space-4)' }}>
                    {state !== 'new' && <span {...tk('brand chip', { bg: 'fill/tertiary', radius: 'lg', px: 8, py: 4, gap: 6, type: 'label/md/medium', color: 'content/primary' })} className="hrow"><img src={BRAND.logo} alt="" className="oz-chiplogo" />{BRAND.name}</span>}
                    <span {...tk('where chip', { bg: 'fill/tertiary', radius: 'lg', px: 8, py: 4, gap: 6, type: 'label/md/medium', color: 'content/secondary' })} className="hrow"><Ic n="megaphone" size="sm" />Instagram + TikTok</span>
                    <Button type="ghost" size="2xs" icon={L('mic')} label="Speak instead" />
                  </div>
                </div>
                <button type="submit" {...tk('ask oz', { gradient: ['fill/brand-hover', 'fill/brand'], fx: 'inner-shade', radius: 'lg', type: 'body/md/medium', color: 'content/on-brand', gap: 4 }, { width: 125, height: 100 })} className="col center oz-send" data-btn>
                  <Ic n="arrow-up" size="md" />
                  <span>Ask Oz</span>
                </button>
              </form>

              {oz && <OzCard oz={oz} onAct={act} />}
              {(!oz || (!oz.acts && !oz.working)) && SUGGEST && (
                <div className="col full oz-suggest" style={{ gap: 'var(--space-8)', maxWidth: 1024 }}>
                  <button {...tk('oz suggests', { bg: 'surface/primary', border: 'border/secondary', radius: '2xl', p: 16, gap: 16 })} className="hrow oz-next" onClick={() => act(SUGGEST.act)}>
                    <span className="oz-next-ic"><Ic n={SUGGEST.icon} size="lg" /></span>
                    <span className="col grow" style={{ gap: 'var(--space-2)', textAlign: 'left' }}>
                      <span {...tk('label', { type: 'label/xs/medium', color: 'content/brand' })}>OZ SUGGESTS</span>
                      <span {...tk('next title', { type: 'body/lg/medium', color: 'content/primary' })}>{SUGGEST.title}</span>
                      <span {...tk('next why', { type: 'body/sm/regular', color: 'content/tertiary' })}>{SUGGEST.why}</span>
                    </span>
                    <span className="btn lit type-body-md-medium" data-type="primary" data-size="sm" data-shape="squircle" data-component="button">Do it</span>
                  </button>
                  <div className="hrow wrap center" style={{ gap: 'var(--space-8)' }}>
                    {SUGGEST.more.map((m) => <Button key={m} type="tertiary" size="xs" shape="pill" onClick={() => ask(m)}>{m}</Button>)}
                  </div>
                </div>
              )}
            </div>

            {/* 3 · Everything Oz knows, most useful first. Sections only appear once they have something in them. */}
            <div className="col full oz-sections">
              {has('results') >= 0 && (
                <div style={order('results')}>
                  <Section title={state === 'next' ? 'Since yesterday' : 'How your ads are doing'} sub={`Day ${RESULTS.day} of ${RESULTS.of} · on Instagram and TikTok`} more="Campaigns">
                    <div className="oz-stats">
                      <div {...tk('stat', { bg: 'surface/primary', border: 'border/tertiary', radius: 'xl', p: 16, gap: 4 })} className="col"><span className="oz-stat-k">You spent</span><b className="oz-stat-v">${RESULTS.spent}</b><span className="oz-stat-d">of your $140 limit</span></div>
                      <div {...tk('stat', { bg: 'surface/primary', border: 'border/tertiary', radius: 'xl', p: 16, gap: 4 })} className="col"><span className="oz-stat-k">People who tried your app</span><b className="oz-stat-v">{RESULTS.trials}</b><span className="oz-stat-d">free trials started</span></div>
                      <div {...tk('stat', { bg: 'surface/primary', border: 'border/tertiary', radius: 'xl', p: 16, gap: 4 })} className="col"><span className="oz-stat-k">Cost of each one</span><b className="oz-stat-v">${perTrial}</b><span className="oz-stat-d">lower is better</span></div>
                      <div {...tk('stat', { bg: 'surface/primary', border: 'border/tertiary', radius: 'xl', p: 16, gap: 8 })} className="col oz-days"><span className="oz-stat-k">Test progress</span>
                        <div className="oz-dayrow">{Array.from({ length: RESULTS.of }, (_, i) => <i key={i} data-on={i < RESULTS.day || undefined} />)}</div>
                        <span className="oz-stat-d">{RESULTS.of - RESULTS.day} days left</span></div>
                    </div>
                  </Section>
                </div>
              )}

              {has('ads') >= 0 && ads.length > 0 && (
                <div style={order('ads')}>
                  <Section title="Your ads" sub={ads.some((a) => a.status === 'making') ? 'Oz is making them now.' : state === 'ready' ? 'Ready to test. Tap one to change it.' : 'Green is winning. Red is stopped.'} more="My Assets">
                    <div className="oz-scroll">
                      {ads.map((a) => {
                        const st = a.status === 'winning' && boosted ? 'boosted' : a.status;
                        const r = RESULTS.byAd[a.idea.id];
                        return (
                          <div key={a.id} {...tk('your ad', { bg: 'surface/primary', border: 'border/tertiary', radius: 'xl', p: 6, gap: 8 })} className="col oz-adcard">
                            <AdArt ad={a.idea.ad} mine making={a.status === 'making'} />
                            <div className="col" style={{ gap: 'var(--space-4)', padding: '0 var(--space-6) var(--space-6)' }}>
                              <span className="oz-adtitle">{a.idea.title}</span>
                              <div className="hrow between"><Pill kind={STATUS[st][1]}>{STATUS[st][0]}</Pill>{(state === 'live' || state === 'next') && r && a.status !== 'making' && <span className="oz-adnum">${r.cost.toFixed(2)} each</span>}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </Section>
                </div>
              )}

              {has('how') >= 0 && (
                <div style={order('how')}>
                  <Section title="What Oz does for you" sub="You only say yes. Nothing costs money without your OK.">
                    <div className="oz-how">
                      {[['globe', 'Learns your brand', 'From your website, in about a minute.'], ['search', 'Finds what works', 'The ads that run longest in your niche.'], ['wand-sparkles', 'Makes your ads', 'In your colours and your voice.'], ['trending-up', 'Tests and improves', 'Keeps the winners, stops the rest.']].map(([i, t, d], k) => (
                        <div key={t} {...tk('step', { bg: 'surface/primary', border: 'border/tertiary', radius: 'xl', p: 16, gap: 8 })} className="col">
                          <span className="oz-num">{k + 1}</span><Ic n={i} size="lg" /><b className="oz-how-t">{t}</b><span className="oz-how-d">{d}</span>
                        </div>
                      ))}
                    </div>
                  </Section>
                </div>
              )}

              {has('ideas') >= 0 && (
                <div style={order('ideas')}>
                  <Section title="Ideas for you" sub="Ranked by how well they fit Brilliant. Each one is based on an ad that already works." more="Playbook">
                    <div className="oz-scroll">
                      {IDEAS.map((idea, k) => (
                        <div key={idea.id} {...tk('idea', { bg: 'surface/primary', border: 'border/tertiary', radius: 'xl', p: 6, gap: 8 })} className="col oz-idea">
                          <AdArt ad={idea.ad} mine />
                          <div className="col grow" style={{ gap: 'var(--space-6)', padding: '0 var(--space-6) var(--space-6)' }}>
                            <div className="hrow" style={{ gap: 'var(--space-6)' }}><Pill>{`#${k + 1}`}</Pill><Pill>{idea.format}</Pill></div>
                            <span className="oz-adtitle">{idea.title}</span>
                            <span className="oz-why">{idea.why}</span>
                            <div className="grow" />
                            {madeIdeas.has(idea.id) ? <Pill kind="success" icon="check">Made</Pill>
                              : <Button type="secondary" size="xs" block onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); act('make', { idea }); }}>Make this</Button>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Section>
                </div>
              )}

              {has('working') >= 0 && (
                <div style={order('working')} id="working">
                  <Section title={state === 'new' ? 'What’s working in ads right now' : `What’s working for ${BRAND.niche}`} sub="Ads that have run the longest. Brands keep paying for ads that make them money." more="Competitors">
                    <div className="oz-scroll">
                      {WORKING.map((w) => (
                        <div key={w.id} {...tk('working ad', { bg: 'surface/primary', border: 'border/tertiary', radius: 'xl', p: 6, gap: 8 })} className="col oz-idea">
                          <AdArt ad={{ ...w.ad }} />
                          <div className="col grow" style={{ gap: 'var(--space-6)', padding: '0 var(--space-6) var(--space-6)' }}>
                            <div className="hrow between"><span className="oz-adtitle">{w.brand}</span><Pill kind={w.days > 100 ? 'brand' : 'neutral'} icon="flame">{w.days} days</Pill></div>
                            <span className="oz-why">{w.why}</span>
                            <div className="grow" />
                            {state === 'new' ? null : <Button type="tertiary" size="xs" block onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); act('make', { idea: { id: w.id, title: `${w.brand}'s idea, made for ${BRAND.name}`, format: 'Image ad', ad: { ...w.ad, mark: undefined } } }); }}>Make one like this</Button>}
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="oz-source"><Ic n="info" size="xs" />From the Meta Ad Library and TikTok Creative Center. Sample data in this prototype.</p>
                  </Section>
                </div>
              )}

              {has('rivals') >= 0 && (
                <div style={order('rivals')}>
                  <Section title="Your competitors" sub="How many ads each one is running right now." more="Competitors">
                    <div className="oz-rivals">
                      {COMPETITORS.map((c) => (
                        <div key={c.name} {...tk('competitor', { bg: 'surface/primary', border: 'border/tertiary', radius: 'xl', p: 12, gap: 12 })} className="hrow">
                          <span className="oz-mark lg" data-ground={c.ground}>{c.mark}</span>
                          <div className="col grow" style={{ gap: 'var(--space-2)' }}>
                            <b className="oz-adtitle">{c.name}</b>
                            <span className="oz-why">{c.active} ads running · best one {c.longest} days</span>
                          </div>
                          {state === 'next' && c.new > 0 && <Pill kind="brand">{c.new} new</Pill>}
                        </div>
                      ))}
                    </div>
                  </Section>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Demo only: jump between the five situations a user can be in (keys 1–5). */}
      <div className="oz-demo" aria-label="Demo state">
        <span>Demo</span>
        <Segmented label="Demo state" items={STATES} value={state} onChange={jump} size="2xs" />
      </div>
    </div>
  );
}
