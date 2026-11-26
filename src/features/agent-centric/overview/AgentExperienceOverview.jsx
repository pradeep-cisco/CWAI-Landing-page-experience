import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import slide1 from './assets/slide-1.png';
import slide2 from './assets/slide-2.png';
import slide3 from './assets/slide-3.png';
import slide4 from './assets/slide-4.png';
import slide5 from './assets/slide-5.png';
import './agent-experience-overview.css';

const SLIDES = [
  { image: slide1, title: 'Crosswork AI landing experience', description: 'The landing page combines network operations and oversight of agent work. Incidents answers what happened. Start job exposes available capabilities and scope. Your decisions highlights required reviews, while Suggested keeps optional follow-ups separate.' },
  { image: slide2, title: 'Jobs and incidents', description: 'Jobs groups work by task category. Capacity checks includes jobs from multiple incidents, each with its own status. Incidents connects only the jobs addressing a particular network issue. A category opens Jobs manager; an incident opens incident details.' },
  { image: slide3, title: 'One incident, several jobs', description: 'INC-317 connects three capacity assessments of the affected link, alternate-path headroom and Core ingress to one bounded remediation proposal. The operator reviews scope, impact and rollback. Verification has not started. Supporting jobs expands on demand.' },
  { image: slide4, title: 'Decide, follow up or start work', description: 'Your decisions contains required reviews subject to delegated authority. Suggested opens optional follow-ups to existing findings or dependencies. Start job lets the operator choose a capability and scope. Starting an assessment does not authorize a network change.' },
  { image: slide5, title: 'Verifying recovery', description: 'Recorded controller completion precedes verification. Comparable five-minute mean utilization falls from 92% to 68%, meeting the 75% limit. Routing stability is still being checked, so the incident remains open. Approval, execution and verified outcomes are distinct.' },
];

/** Presentation-only state. The dashboard and its selected incident stay mounted. */
export default function AgentExperienceOverview({ onClose }) {
  const [index, setIndex] = useState(0);
  const dialogRef = useRef(null), headingRef = useRef(null);
  const slide = SLIDES[index];

  useEffect(() => {
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    if (!dialog.open) dialog.showModal();
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => { headingRef.current?.focus({ preventScroll: true }); }, [index]);

  const goTo = next => setIndex(Math.max(0, Math.min(SLIDES.length - 1, next)));
  const onKeys = event => {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      goTo(index + (event.key === 'ArrowRight' ? 1 : -1));
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      goTo(event.key === 'Home' ? 0 : SLIDES.length - 1);
    }
  };

  if (typeof document === 'undefined') return null;
  return createPortal(<dialog ref={dialogRef} className="agent-exp-viewer" aria-label="Option 4 experience overview" aria-describedby="agent-exp-description" onKeyDown={onKeys} onCancel={event => { event.preventDefault(); onClose(); }}>
    <header className="agent-exp-toolbar">
      <span>Experience overview <span className="agent-exp-option">· Option 4</span></span>
      <button type="button" onClick={onClose} aria-label="Close overview">Close <span aria-hidden="true">×</span></button>
    </header>
    <div className="agent-exp-stage">
      <h2 className="agent-exp-sr" ref={headingRef} tabIndex={-1}>{slide.title}</h2>
      <p className="agent-exp-sr" id="agent-exp-description">{slide.description} Simplified representative examples from concept data.</p>
      <img key={slide.image} className="agent-exp-slide" src={slide.image} width="1600" height="900" alt={`Annotated slide ${index + 1}: ${slide.title}`} decoding="sync"/>
    </div>
    <footer className="agent-exp-controls">
      <button type="button" onClick={() => goTo(index - 1)} disabled={index === 0}><span aria-hidden="true">←</span> Previous</button>
      <nav className="agent-exp-pagination" aria-label="Overview slides">{SLIDES.map((item, number) => <button key={item.title} type="button" aria-label={`Slide ${number + 1}: ${item.title}`} aria-current={number === index ? 'step' : undefined} onClick={() => goTo(number)}><span/></button>)}</nav>
      <span className="agent-exp-count" aria-live="polite" aria-atomic="true">{index + 1} / {SLIDES.length}</span>
      <button type="button" className="agent-exp-next" onClick={() => index === SLIDES.length - 1 ? onClose() : goTo(index + 1)}>{index === SLIDES.length - 1 ? 'Done' : 'Next'} <span aria-hidden="true">→</span></button>
    </footer>
  </dialog>, document.body);
}
