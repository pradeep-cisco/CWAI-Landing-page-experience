import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { EXPERIENCE_SLIDES, LAYOUT_FOCUS, RESPONSE_STEPS, ENTITY_CONTEXT } from './experience-content.js';
import './experience-overview.css';

const DOMAINS = [
  { name: 'West', x: 180, y: 190 }, { name: 'Core', x: 440, y: 190 },
  { name: 'East', x: 700, y: 190 }, { name: 'North', x: 440, y: 52 },
  { name: 'South', x: 440, y: 330 }, { name: 'Metro', x: 700, y: 330 },
];
// The National Backbone example's domain relationships. The presentation never
// reads or changes the operator's selected WAN or current source observation.
const CONNECTIONS = [[0, 1], [1, 2], [0, 3], [3, 1], [1, 4], [4, 5], [2, 5], [3, 2], [0, 4]];
const GRAPH_NODES = [
  { type: 'Device', x: 110, y: 198 }, { type: 'Interface', x: 360, y: 198 },
  { type: 'Service', x: 360, y: 64 }, { type: 'Configuration', x: 610, y: 64 },
];

function Icon({ name, ...props }) {
  const paths = {
    right: <path d="M4 12h15m-6-6 6 6-6 6"/>,
    left: <path d="M20 12H5m6-6-6 6 6 6"/>,
    close: <path d="m6 6 12 12M18 6 6 18"/>,
    pause: <path d="M8 5v14M16 5v14"/>,
    play: <path d="m9 5 10 7-10 7Z"/>,
    check: <path d="m5 12 4 4L19 6"/>,
    investigate: <><circle cx="10" cy="10" r="6"/><path d="m15 15 5 5"/></>,
    validate: <><path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6Z"/><path d="m8 11 3 3 5-5"/></>,
    remediate: <path d="m14 3-9 11h7l-2 7 9-11h-7Z"/>,
    verify: <><circle cx="12" cy="12" r="9"/><path d="m7 12 3 3 7-7"/></>,
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name]}</svg>;
}

function NetworkField({ attention = null }) {
  return <svg className="exp-field" viewBox="0 0 880 440" data-attention={attention || 'none'} role="img" aria-label={attention ? `Six domains remain visible. West has ${attention === 'incident' ? 'an active incident' : 'a developing signal'}.` : 'Routers aggregate into six connected domains: West, Core, East, North, South and Metro.'}>
    <g className="exp-field-links">{CONNECTIONS.map(([a, b]) => <path key={`${a}-${b}`} data-highlight={attention === 'incident' && a === 0} d={`M${DOMAINS[a].x} ${DOMAINS[a].y} L${DOMAINS[b].x} ${DOMAINS[b].y}`}/>)}</g>
    {DOMAINS.map((domain, group) => <g key={domain.name} className="exp-domain-cluster" data-highlight={attention && group === 0} data-muted={Boolean(attention && group !== 0)}>
      {Array.from({ length: 32 }, (_, index) => {
        const angle = index * 2.39996, radius = 35 + Math.sqrt(index / 32) * 42;
        return <circle key={index} className="exp-router-dot" cx={domain.x + Math.cos(angle) * radius} cy={domain.y + Math.sin(angle) * radius} r={index % 4 ? 2 : 3} style={{ '--exp-dx': `${Math.cos(index + group) * 95}px`, '--exp-dy': `${Math.sin(index * 2 + group) * 58}px`, '--exp-delay': `${group * 55 + index * 7}ms` }}/>;
      })}
      <circle className="exp-domain-halo" cx={domain.x} cy={domain.y} r="31"/>
      <circle className="exp-domain-core" cx={domain.x} cy={domain.y} r="14"/>
      {attention && group === 0 && <><circle className="exp-attention-ring" cx={domain.x} cy={domain.y} r="35"/>{attention === 'incident' ? <text className="exp-attention-mark" x={domain.x} y={domain.y + 5} textAnchor="middle">!</text> : <path className="exp-signal-mark" d={`M${domain.x - 7} ${domain.y + 4}l5-6 4 3 6-7`}/>}</>}
      <text className="exp-domain-name" x={domain.x} y={domain.y + 99} textAnchor="middle">{domain.name}</text>
    </g>)}
  </svg>;
}

function LayoutVisual({ focus, onFocus }) {
  return <div className="exp-layout-visual exp-local-controls">
    <div className="exp-page-outline" aria-label="Simplified landing-page layout">
      <div className="exp-outline-rail" aria-hidden="true"><i/><i/><i/></div>
      <div className="exp-outline-content">
        <div className="exp-outline-top">
          <button className="exp-outline-region exp-outline-network" aria-pressed={focus === 'overview'} onClick={() => onFocus('overview')}><span className="exp-outline-title"><b>01</b>WAN overview</span><svg viewBox="0 0 360 145" aria-hidden="true"><path d="M55 85 165 85 285 85M165 30v100M55 85l110-55 120 55M165 130h120V85"/>{[[55,85],[165,85],[285,85],[165,30],[165,130],[285,130]].map(([x,y]) => <g key={`${x}-${y}`}><circle cx={x} cy={y} r="13"/><circle className="exp-outline-dot" cx={x} cy={y} r="4"/></g>)}</svg></button>
          <button className="exp-outline-region exp-outline-updates" aria-pressed={focus === 'updates'} onClick={() => onFocus('updates')}><span className="exp-outline-title"><b>02</b>Network watch</span><span className="exp-outline-feed" aria-hidden="true">{[0,1,2].map(i=><span key={i}><i/><span><em/><em/></span></span>)}</span></button>
        </div>
        <button className="exp-outline-region exp-outline-work" aria-pressed={focus === 'work'} onClick={() => onFocus('work')}><span className="exp-outline-title"><b>03</b>Operational tabs</span><span className="exp-outline-tabs">Incidents<span>Watchlist</span><span>Changes</span><span>Recent</span></span></button>
      </div>
    </div>
    <p className="exp-caption" aria-live="polite"><strong>{LAYOUT_FOCUS[focus].title}</strong><span>{LAYOUT_FOCUS[focus].description}</span></p>
  </div>;
}

function AttentionVisual({ attention, onAttention }) {
  return <div className="exp-attention-visual exp-local-controls" data-attention={attention}>
    <div className="exp-choice" role="group" aria-label="Compare attention states"><button aria-pressed={attention === 'signal'} onClick={() => onAttention('signal')}><span className="exp-choice-dot"/>Developing signal</button><button aria-pressed={attention === 'incident'} onClick={() => onAttention('incident')}><span className="exp-choice-dot"/>Active incident</button></div>
    <NetworkField attention={attention}/>
    <p className="exp-caption" aria-live="polite">{attention === 'incident' ? 'The affected scope takes priority, with an agent-owned response already underway.' : 'A developing signal receives proportionate attention while the wider network stays visible.'}</p>
  </div>;
}

function ResponseVisual({ phase, onPhase }) {
  return <div className="exp-response-visual exp-local-controls">
    <div className="exp-response-path" role="group" aria-label="Explore autonomous work stages">{RESPONSE_STEPS.map((step, index) => <button key={step.id} aria-pressed={phase === index} data-complete={phase > index} onClick={() => onPhase(index)}><span className="exp-step-orbit"><Icon name={phase > index ? 'check' : step.id}/></span><span>{step.label}</span><small>{String(index + 1).padStart(2, '0')}</small></button>)}</div>
    <p className="exp-caption" aria-live="polite" key={phase}>{RESPONSE_STEPS[phase].detail}</p>
  </div>;
}

function RecoveryVisual({ verified, onVerify }) {
  return <div className="exp-recovery-visual exp-local-controls" data-verified={verified}>
    <div className="exp-recovery-comparison">
      <div className="exp-result exp-result-complete"><span className="exp-result-symbol"><Icon name="check"/></span><strong>Change completed</strong><span>Execution recorded</span></div>
      <div className="exp-evidence-bridge"><span className="exp-bridge-line"/><span>Evidence checks</span><div aria-label="Recovery criteria">{['Fresh observations', 'Source cleared', 'Stable observations'].map((label,index)=><span key={label} style={{'--exp-delay':`${index * 110}ms`}}><i>{verified ? <Icon name="check"/> : <span/>}</i>{label}</span>)}</div></div>
      <div className="exp-result exp-result-recovered"><span className="exp-result-symbol">{verified ? <Icon name="verify"/> : <span className="exp-pending-ring"/>}</span><strong aria-live="polite">{verified ? 'Recovery verified' : 'Recovery pending'}</strong><span>{verified ? 'Network outcome confirmed' : 'Awaiting supporting evidence'}</span></div>
    </div>
    <button className="exp-text-action" onClick={() => onVerify(!verified)}>{verified ? 'Reset comparison' : 'Show verification'}<Icon name={verified ? 'left' : 'right'}/></button>
  </div>;
}

function ContextVisual({ selected, onSelect, markerId }) {
  return <div className="exp-context-visual exp-local-controls">
    <div className="exp-context-canvas">
      <svg className="exp-context-connections" viewBox="0 0 720 280" preserveAspectRatio="none" aria-hidden="true"><defs><marker id={markerId} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 8 4 0 8Z" fill="context-stroke"/></marker></defs><path data-type="Device" d="M145 198H322" markerEnd={`url(#${markerId})`}/><path data-type="Service" d="M360 99V160" markerEnd={`url(#${markerId})`}/><path data-type="Configuration" d="M395 64H572" markerEnd={`url(#${markerId})`}/><text x="232" y="181" textAnchor="middle">owns</text><text x="375" y="136">depends on</text><text x="483" y="47" textAnchor="middle">configured by</text></svg>
      {GRAPH_NODES.map(node => <button className="exp-context-node" key={node.type} data-type={node.type} aria-pressed={selected === node.type} onClick={() => onSelect(node.type)} style={{left:`${node.x / 720 * 100}%`,top:`${node.y / 280 * 100}%`}}><span>{node.type[0]}</span><strong>{node.type}</strong></button>)}
    </div>
    <p className="exp-caption" aria-live="polite"><strong>{ENTITY_CONTEXT[selected].title}</strong><span>{ENTITY_CONTEXT[selected].relation}</span></p>
  </div>;
}

export default function ExperienceOverview({ onClose }) {
  const [slide, setSlide] = useState(0), [focus, setFocus] = useState('overview');
  const [attention, setAttention] = useState('signal'), [phase, setPhase] = useState(0);
  const [verified, setVerified] = useState(false), [selected, setSelected] = useState('Service');
  const [motion, setMotion] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const dialogRef = useRef(null), headingRef = useRef(null), scrollRef = useRef(null);
  const markerId = `overview-arrow-${useId().replaceAll(':', '')}`;
  const item = EXPERIENCE_SLIDES[slide];

  useEffect(() => {
    const dialog = dialogRef.current, previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    if (!dialog.open) dialog.showModal();
    headingRef.current?.focus({ preventScroll: true });
    return () => { dialog.close(); document.body.style.overflow = previousOverflow; };
  }, []);
  useEffect(() => { headingRef.current?.focus({ preventScroll: true }); scrollRef.current?.scrollTo({ top: 0 }); }, [slide]);

  const goTo = index => setSlide(Math.max(0, Math.min(EXPERIENCE_SLIDES.length - 1, index)));
  const keys = event => {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.target.closest('.exp-local-controls')) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); goTo(slide + (event.key === 'ArrowRight' ? 1 : -1)); }
    if (event.key === 'Home') { event.preventDefault(); goTo(0); }
    if (event.key === 'End') { event.preventDefault(); goTo(EXPERIENCE_SLIDES.length - 1); }
  };

  return createPortal(<dialog ref={dialogRef} className="exp-presentation" aria-labelledby="exp-presentation-title" aria-describedby="exp-presentation-description" data-motion={motion ? 'playing' : 'paused'} onKeyDown={keys} onCancel={event => { event.preventDefault(); onClose(); }}>
    <header className="exp-presentation-header"><span>Experience overview</span><div><span className="exp-presentation-index">{String(slide + 1).padStart(2, '0')} <i>/</i> 06</span><button className="exp-icon-action exp-motion-action" aria-label={motion ? 'Pause motion' : 'Enable motion'} aria-pressed={motion} onClick={() => setMotion(current => !current)}><Icon name={motion ? 'pause' : 'play'}/></button><button className="exp-icon-action" aria-label="Close overview" onClick={onClose}><Icon name="close"/></button></div></header>
    <div className="exp-presentation-main" ref={scrollRef}>
      <section className="exp-presentation-heading"><span className="exp-eyebrow">{item.label}</span><h2 id="exp-presentation-title" ref={headingRef} tabIndex={-1}>{item.title}</h2><p id="exp-presentation-description">{item.description}</p></section>
      <figure className={`exp-presentation-figure exp-scene-${item.id}`} key={item.id}>
        {item.id === 'watch' && <><NetworkField/><figcaption className="exp-network-caption"><span><strong>3,200</strong> routers</span><i/><span><strong>80</strong> device groups</span><i/><span><strong>6</strong> domains</span><small>National Backbone example</small></figcaption></>}
        {item.id === 'layout' && <LayoutVisual focus={focus} onFocus={setFocus}/>}
        {item.id === 'trend' && <AttentionVisual attention={attention} onAttention={setAttention}/>}
        {item.id === 'response' && <ResponseVisual phase={phase} onPhase={setPhase}/>}
        {item.id === 'recovery' && <RecoveryVisual verified={verified} onVerify={setVerified}/>}
        {item.id === 'context' && <ContextVisual selected={selected} onSelect={setSelected} markerId={markerId}/>}
      </figure>
    </div>
    <footer className="exp-presentation-footer"><button className="exp-nav-action" disabled={slide === 0} onClick={() => goTo(slide - 1)}><Icon name="left"/><span>Previous</span></button><nav className="exp-progress" aria-label="Overview slides">{EXPERIENCE_SLIDES.map((chapter, index) => <button key={chapter.id} aria-label={`Slide ${index + 1}: ${chapter.title}`} aria-current={slide === index ? 'step' : undefined} onClick={() => goTo(index)}><span/></button>)}</nav><button className="exp-nav-action exp-nav-next" onClick={() => slide === EXPERIENCE_SLIDES.length - 1 ? onClose() : goTo(slide + 1)}><span>{slide === EXPERIENCE_SLIDES.length - 1 ? 'Done' : 'Next'}</span><Icon name={slide === EXPERIENCE_SLIDES.length - 1 ? 'check' : 'right'}/></button></footer>
  </dialog>, document.body);
}
