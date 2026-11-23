import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { COMBINED_EXPERIENCE_SLIDES as SLIDES, COMBINED_LAYOUT_FOCUS, REVIEW_CHOICES, ACTIVITY_JOBS } from './combined-experience-content.js';
import '../../wan/overview/experience-overview.css';
import './combined-experience-overview.css';

const DOMAINS = [
  { name: 'West', x: 95, y: 155 }, { name: 'Core', x: 280, y: 155 },
  { name: 'East', x: 465, y: 155 }, { name: 'North', x: 280, y: 42 },
  { name: 'South', x: 280, y: 275 }, { name: 'Metro', x: 465, y: 275 },
];
const LINKS = [[0, 1], [1, 2], [1, 3], [1, 4], [2, 5], [4, 5]];
const FINDINGS = {
  unexpected: { label: 'Unexpected change', record: 'No matching change', title: 'Routing intent mismatch', detail: 'Current evidence supports incident INC-104. Agents prepare a bounded correction for review.', tone: 'warning' },
  expected: { label: 'Expected change', record: 'Authorized change matches', title: 'Expected change confirmed', detail: 'The assessed difference is explained by its authorized change record. No corrective response is proposed.', tone: 'positive' },
  missing: { label: 'Missing evidence', record: 'Current baseline unavailable', title: 'Assessment remains open', detail: 'Approved intent is unresolved. Agents seek the missing evidence before proposing a restoration.', tone: 'info' },
};

function Icon({ name, ...props }) {
  const paths = {
    right: <path d="M4 12h15m-6-6 6 6-6 6"/>, left: <path d="M20 12H5m6-6-6 6 6 6"/>,
    close: <path d="m6 6 12 12M18 6 6 18"/>, pause: <path d="M8 5v14M16 5v14"/>, play: <path d="m9 5 10 7-10 7Z"/>,
    check: <path d="m5 12 4 4L19 6"/>, clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    review: <><path d="m12 3 9 17H3Z"/><path d="M12 9v4m0 3v.1"/></>,
    verify: <><circle cx="12" cy="12" r="9"/><path d="m7 12 3 3 7-7"/></>,
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name]}</svg>;
}

function NetworkSketch({ small = false }) {
  return <svg className={`c-exp-network${small ? ' c-exp-network-small' : ''}`} viewBox="0 0 560 335" role="img" aria-label="Six connected domains. Core has one active routing-intent incident; other work keeps its own state.">
    <g className="c-exp-links">{LINKS.map(([a, b]) => <path key={`${a}-${b}`} d={`M${DOMAINS[a].x} ${DOMAINS[a].y}L${DOMAINS[b].x} ${DOMAINS[b].y}`}/>)}</g>
    {DOMAINS.map((domain, index) => <g key={domain.name} className="c-exp-domain" data-incident={index === 1} style={{ '--c-exp-delay': `${index * 65}ms` }}>
      <circle className="c-exp-domain-halo" cx={domain.x} cy={domain.y} r={index === 1 ? 27 : 21}/>
      <circle className="c-exp-domain-dot" cx={domain.x} cy={domain.y} r="6"/>
      {index === 1 && <g className="c-exp-incident"><circle cx={domain.x + 22} cy={domain.y - 23} r="11"/><text x={domain.x + 22} y={domain.y - 19} textAnchor="middle">1</text></g>}
      <text className="c-exp-domain-label" x={domain.x} y={domain.y + 46} textAnchor="middle">{domain.name}</text>
    </g>)}
  </svg>;
}

function PictureVisual() {
  return <div className="c-exp-picture">
    <NetworkSketch/>
    <div className="c-exp-work-glance">
      <p className="c-exp-small-label">Work already underway</p>
      {ACTIVITY_JOBS.map((job, index) => <div className="c-exp-glance-item" key={job.id} data-tone={job.tone}>
        <span className="c-exp-glance-icon"><Icon name={['review', 'verify', 'clock'][index]}/></span>
        <div><strong>{['Review a correction', 'Assessment complete', 'Investigation waiting'][index]}</strong><span>{['Core · XR-R07', 'West · XR-R12', 'East · Metro East'][index]}</span></div>
      </div>)}
    </div>
  </div>;
}

function LayoutVisual({ focus, onFocus }) {
  const region = (id, number, content) => <button className={`c-exp-layout-region c-exp-layout-${id}`} aria-pressed={focus === id} onClick={() => onFocus(id)}>
    <span><small>{number}</small><strong>{COMBINED_LAYOUT_FOCUS[id].title}</strong></span>{content}
  </button>;
  return <div className="c-exp-layout exp-local-controls">
    <div className="c-exp-layout-page" aria-label="Combined landing page: Network first, Attention and Actions together, then Activity">
      {region('overview', '01', <NetworkSketch small/>)}
      <div className="c-exp-layout-pair">
        {region('attention', '02', <span className="c-exp-layout-line c-exp-line-warning" aria-hidden="true"/>)}
        {region('actions', '03', <span className="c-exp-layout-line c-exp-line-positive" aria-hidden="true"/>)}
      </div>
      {region('activity', '04', <span className="c-exp-layout-jobs" aria-hidden="true"><i/><i/><i/></span>)}
    </div>
    <p className="exp-caption" aria-live="polite"><strong>{COMBINED_LAYOUT_FOCUS[focus].title}</strong><span>{COMBINED_LAYOUT_FOCUS[focus].description}</span></p>
  </div>;
}

function FindingVisual({ finding, onFinding }) {
  const current = FINDINGS[finding];
  return <div className="c-exp-finding exp-local-controls">
    <div className="c-exp-choices" role="group" aria-label="Compare configuration findings">{Object.entries(FINDINGS).map(([id, item]) => <button key={id} aria-pressed={finding === id} onClick={() => onFinding(id)}>{item.label}</button>)}</div>
    <div className="c-exp-comparison">
      <div><span>Observed configuration</span><strong>120</strong><small>XR-R07 · WAN-IMPORT</small></div>
      <span className="c-exp-compare-symbol" aria-hidden="true">{finding === 'missing' ? '?' : finding === 'expected' ? '=' : '≠'}</span>
      <div><span>Approved intent</span><strong>{finding === 'missing' ? '—' : finding === 'expected' ? '120' : '100'}</strong><small>{finding === 'missing' ? 'Current target unresolved' : 'Current local preference'}</small></div>
    </div>
    <p className="c-exp-change-record"><Icon name={finding === 'missing' ? 'clock' : 'verify'}/>{current.record}</p>
    <div className="c-exp-finding-result" data-tone={current.tone} aria-live="polite"><strong>{current.title}</strong><p>{current.detail}</p></div>
    <p className="c-exp-footnote">Knowledge graph relationships locate the configuration and related entities. Source evidence establishes the finding.</p>
  </div>;
}

function ReviewVisual({ choice, onChoice, granted, onGrant }) {
  const status = choice === 'allow' ? granted ? 'Authorization confirmed' : 'Decision submitted' : choice === 'hold' ? 'Correction held' : 'Revision requested';
  return <div className="c-exp-review exp-local-controls">
    <div className="c-exp-proposal"><span className="c-exp-small-label">Proposal v1 · XR-R07 · WAN-IMPORT</span><div className="c-exp-proposal-change"><span>local-preference <s>120</s></span><Icon name="right"/><strong>100</strong></div><p>Only this statement on this router · Delegated review required</p></div>
    <div className="c-exp-choices" role="group" aria-label="Explore review choices">{Object.entries(REVIEW_CHOICES).map(([id, item]) => <button key={id} aria-pressed={choice === id} onClick={() => onChoice(id)}>{item.title}</button>)}</div>
    <div className="c-exp-review-result" aria-live="polite"><strong>{status}</strong><p>{choice === 'allow' && granted ? 'The exact version and scope now have an effective grant. Agents recheck current prerequisites before issuing an operation.' : REVIEW_CHOICES[choice].detail}</p></div>
    {choice === 'allow' && <button className="exp-text-action" onClick={() => onGrant(!granted)}>{granted ? 'Show submission state' : 'Show confirmed authorization'}<Icon name={granted ? 'left' : 'right'}/></button>}
    <p className="c-exp-footnote">Illustrated choices only · No decision is submitted from this overview</p>
  </div>;
}

function ActivityVisual({ selected, onSelect }) {
  const job = ACTIVITY_JOBS.find(item => item.id === selected);
  return <div className="c-exp-activity exp-local-controls">
    <div className="c-exp-job-list" role="group" aria-label="Explore independent jobs">{ACTIVITY_JOBS.map(item => <button key={item.id} data-tone={item.tone} aria-pressed={selected === item.id} onClick={() => onSelect(item.id)}>
      <span className="c-exp-job-mark"><Icon name={item.tone === 'positive' ? 'verify' : item.tone === 'inactive' ? 'clock' : 'review'}/></span><span><strong>{item.title}</strong><small>{item.scope}</small></span><span className="c-exp-job-status">{item.status}</span>
    </button>)}</div>
    <div className="c-exp-job-detail" aria-live="polite">
      <ol className="c-exp-checkpoints" aria-label={`${job.title} confirmed checkpoints`}>{job.checkpoints.map(step => <li key={step.label} data-state={step.state} aria-current={step.state === 'current' || step.state === 'waiting' ? 'step' : undefined}><span>{step.state === 'complete' ? <Icon name="check"/> : null}</span>{step.label}<small className="c-exp-sr"> · {step.state === 'future' ? 'not reached' : step.state}</small></li>)}</ol>
      <p>{job.checkpoint}</p>
    </div>
  </div>;
}

function ResultVisual({ verified, onVerify }) {
  return <div className="c-exp-result exp-local-controls" data-verified={verified}>
    <div className="c-exp-result-flow"><div><span className="c-exp-result-orbit"><Icon name="check"/></span><strong>Operation completed</strong><small>Execution record retained</small></div><span className="c-exp-result-link" aria-hidden="true"/><div><span className="c-exp-result-orbit"><Icon name={verified ? 'verify' : 'clock'}/></span><strong aria-live="polite">{verified ? 'Scoped outcome verified' : 'Verification pending'}</strong><small>{verified ? 'INC-104 resolved within scope' : 'Incident remains open'}</small></div></div>
    <ul className="c-exp-proof" aria-label="Required outcome evidence">{['Approved route policy matches', 'Required routing conditions hold', 'Reviewed change boundary preserved'].map((label, index) => <li key={label} data-met={verified || index === 0}><span><Icon name={verified || index === 0 ? 'check' : 'clock'}/></span>{label}<small>{verified || index === 0 ? 'Confirmed' : 'Pending'}</small></li>)}</ul>
    <button className="exp-text-action" onClick={() => onVerify(!verified)}>{verified ? 'Show pending checks' : 'Show verification evidence'}<Icon name={verified ? 'left' : 'right'}/></button>
  </div>;
}

export default function CombinedExperienceOverview({ onClose }) {
  const [slide, setSlide] = useState(0), [focus, setFocus] = useState('overview'), [finding, setFinding] = useState('unexpected');
  const [choice, setChoice] = useState('allow'), [granted, setGranted] = useState(false), [selected, setSelected] = useState('ROUTE-104'), [verified, setVerified] = useState(false);
  const [reduced, setReduced] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [motion, setMotion] = useState(true);
  const dialogRef = useRef(null), headingRef = useRef(null), scrollRef = useRef(null);
  const item = SLIDES[slide];

  useEffect(() => {
    const dialog = dialogRef.current, previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    if (!dialog.open) dialog.showModal();
    return () => { if (dialog.open) dialog.close(); document.body.style.overflow = previousOverflow; };
  }, []);
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(preference.matches);
    preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, []);
  useEffect(() => { headingRef.current?.focus({ preventScroll: true }); scrollRef.current?.scrollTo({ top: 0 }); }, [slide]);

  const goTo = index => setSlide(Math.max(0, Math.min(SLIDES.length - 1, index)));
  const keys = event => {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.target.closest('.exp-local-controls')) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); goTo(slide + (event.key === 'ArrowRight' ? 1 : -1)); }
    if (event.key === 'Home' || event.key === 'End') { event.preventDefault(); goTo(event.key === 'Home' ? 0 : SLIDES.length - 1); }
  };

  return createPortal(<dialog ref={dialogRef} className="exp-presentation combined-exp-presentation" aria-labelledby="combined-exp-title" aria-describedby="combined-exp-description" data-motion={motion && !reduced ? 'playing' : 'paused'} onKeyDown={keys} onCancel={event => { event.preventDefault(); onClose(); }}>
    <header className="exp-presentation-header"><span>Experience overview · Option 3</span><div><span className="exp-presentation-index">{String(slide + 1).padStart(2, '0')} <i>/</i> {String(SLIDES.length).padStart(2, '0')}</span><button className="exp-icon-action" disabled={reduced} aria-label={reduced ? 'Reduced motion enabled' : motion ? 'Pause motion' : 'Enable motion'} aria-pressed={motion && !reduced} onClick={() => setMotion(value => !value)}><Icon name={motion && !reduced ? 'pause' : 'play'}/></button><button className="exp-icon-action" aria-label="Close overview" onClick={onClose}><Icon name="close"/></button></div></header>
    <div className="exp-presentation-main" ref={scrollRef}>
      <section className="exp-presentation-heading"><span className="exp-eyebrow">{item.label}</span><h2 id="combined-exp-title" ref={headingRef} tabIndex={-1}>{item.title}</h2><p id="combined-exp-description">{item.description}</p></section>
      <figure className={`exp-presentation-figure c-exp-scene-${item.id}`} key={item.id}>
        {item.id === 'picture' && <PictureVisual/>}
        {item.id === 'layout' && <LayoutVisual focus={focus} onFocus={setFocus}/>}
        {item.id === 'finding' && <FindingVisual finding={finding} onFinding={setFinding}/>}
        {item.id === 'review' && <ReviewVisual choice={choice} onChoice={id => { setChoice(id); setGranted(false); }} granted={granted} onGrant={setGranted}/>}
        {item.id === 'activity' && <ActivityVisual selected={selected} onSelect={setSelected}/>}
        {item.id === 'result' && <ResultVisual verified={verified} onVerify={setVerified}/>}
        {item.id !== 'layout' && <figcaption className="c-exp-slide-caption">{item.id === 'finding' ? finding === 'unexpected' ? item.caption : 'Compare the source evidence before deciding what the finding means.' : item.caption}</figcaption>}
      </figure>
    </div>
    <footer className="exp-presentation-footer"><button className="exp-nav-action" disabled={slide === 0} onClick={() => goTo(slide - 1)}><Icon name="left"/><span>Previous</span></button><nav className="exp-progress" aria-label="Overview slides">{SLIDES.map((chapter, index) => <button key={chapter.id} aria-label={`Slide ${index + 1}: ${chapter.title}`} aria-current={slide === index ? 'step' : undefined} onClick={() => goTo(index)}><span/></button>)}</nav><button className="exp-nav-action exp-nav-next" onClick={() => slide === SLIDES.length - 1 ? onClose() : goTo(slide + 1)}><span>{slide === SLIDES.length - 1 ? 'Done' : 'Next'}</span><Icon name={slide === SLIDES.length - 1 ? 'check' : 'right'}/></button></footer>
  </dialog>, document.body);
}
