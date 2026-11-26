import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import IncidentThread from './IncidentThread.jsx';
import ScopedChangeReview from './ScopedChangeReview.jsx';
import { getIncidentDetail } from './incident-overview-model.js';
import { clampIncidentDrawerWidth, getIncidentDrawerBounds, incidentDrawerWidthForKey } from './incident-drawer-size.js';
import './incident-drawer.css';

function workspaceBounds() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return getIncidentDrawerBounds(1280);
  const shell = document.querySelector('.n-root');
  const navigationWidth = shell ? Number.parseFloat(getComputedStyle(shell).getPropertyValue('--hbr-app-shift-left')) || 0 : 0;
  return getIncidentDrawerBounds(window.innerWidth - navigationWidth, window.innerWidth);
}

const requestKey = request => request?.jobId ? request.token ?? `${request.jobId}:${request.reviewedVersion}` : null;
const requestedReview = (request, incidentId) => request?.jobId ? { jobId: request.jobId, reviewedVersion: request.reviewedVersion, incidentId } : null;

/** Docked inspection reserves page space; nothing underneath is covered. */
export default function IncidentDrawer({ model, incidentIds = [], selectedIncidentId, domainFilter = 'all', agentFilter = 'all', onSelectIncident, onClose, initialWidth, onWidthChange, onWidthCommit, reviewRequest, changeDecisions = {}, onDecision }) {
  const panelRef = useRef(null), contentRef = useRef(null), reviewHeadingRef = useRef(null);
  const boundsRef = useRef(null), dragRef = useRef(null);
  if (!boundsRef.current) boundsRef.current = workspaceBounds();
  const widthPreferenceRef = useRef(Number.isFinite(initialWidth) && initialWidth > 0 ? initialWidth : null);
  const [bounds, setBounds] = useState(boundsRef.current);
  const [width, setWidth] = useState(() => clampIncidentDrawerWidth(initialWidth, boundsRef.current));
  const widthRef = useRef(width), changeRef = useRef(onWidthChange), commitRef = useRef(onWidthCommit), closeRef = useRef(onClose);
  const [resizing, setResizing] = useState(false);
  const [review, setReview] = useState(() => requestedReview(reviewRequest, selectedIncidentId));
  const handledRequestRef = useRef(requestKey(reviewRequest)), previousIncidentRef = useRef(selectedIncidentId);
  commitRef.current = onWidthCommit;
  changeRef.current = onWidthChange;
  closeRef.current = onClose;

  const detail = useMemo(() => getIncidentDetail(model, selectedIncidentId, { domainId: domainFilter, agentId: agentFilter }), [model, selectedIncidentId, domainFilter, agentFilter]);
  const queue = useMemo(() => [...new Set(incidentIds)].filter(id => getIncidentDetail(model, id, { domainId: domainFilter, agentId: agentFilter })), [model, incidentIds, domainFilter, agentFilter]);
  const navigationIds = queue.includes(selectedIncidentId) ? queue : detail ? [selectedIncidentId] : [];
  const index = navigationIds.indexOf(selectedIncidentId);
  const reviewJob = review?.incidentId === selectedIncidentId && detail?.scopedJobIds.includes(review.jobId)
    ? model.jobs.find(job => job.id === review.jobId && job.proposal) : null;

  const updateWidth = useCallback(value => {
    const next = clampIncidentDrawerWidth(value, boundsRef.current);
    widthRef.current = next;
    setWidth(next);
    return next;
  }, []);

  const commitWidth = useCallback(value => {
    widthPreferenceRef.current = value;
    commitRef.current?.(value);
  }, []);

  const endResize = useCallback(({ commit = false, restore = false, render = true } = {}) => {
    const drag = dragRef.current;
    if (!drag) return;
    dragRef.current = null;
    window.removeEventListener('pointermove', drag.move);
    window.removeEventListener('pointerup', drag.end);
    window.removeEventListener('pointercancel', drag.cancel);
    window.removeEventListener('blur', drag.blur);
    try { if (drag.target.hasPointerCapture?.(drag.pointerId)) drag.target.releasePointerCapture(drag.pointerId); } catch { /* Pointer capture may already have ended. */ }
    for (const [element, property, value, priority] of drag.styles) {
      if (value) element.style.setProperty(property, value, priority);
      else element.style.removeProperty(property);
    }
    if (restore && render) updateWidth(drag.startWidth);
    if (commit) commitWidth(widthRef.current);
    if (render) setResizing(false);
  }, [commitWidth, updateWidth]);

  const startResize = event => {
    if (event.button !== 0 || event.isPrimary === false || dragRef.current) return;
    event.preventDefault();
    const target = event.currentTarget, pointerId = event.pointerId;
    target.focus({ preventScroll: true });
    const styles = [[document.documentElement, 'cursor'], [document.body, 'user-select']].map(([element, property]) => [element, property, element.style.getPropertyValue(property), element.style.getPropertyPriority(property)]);
    document.documentElement.style.setProperty('cursor', 'ew-resize');
    document.body.style.setProperty('user-select', 'none');
    const drag = { target, pointerId, startX: event.clientX, startWidth: widthRef.current, styles };
    drag.move = move => {
      if (move.pointerId !== pointerId) return;
      if (move.cancelable) move.preventDefault();
      updateWidth(drag.startWidth + drag.startX - move.clientX);
    };
    drag.end = end => { if (end.pointerId === pointerId) endResize({ commit: true }); };
    drag.cancel = cancel => { if (cancel.pointerId === pointerId) endResize({ restore: true }); };
    drag.blur = () => endResize({ restore: true });
    dragRef.current = drag;
    setResizing(true);
    window.addEventListener('pointermove', drag.move, { passive: false });
    window.addEventListener('pointerup', drag.end);
    window.addEventListener('pointercancel', drag.cancel);
    window.addEventListener('blur', drag.blur);
    try { target.setPointerCapture?.(pointerId); } catch { /* Window listeners also handle interrupted capture. */ }
  };

  const resizeWithKey = event => {
    const next = incidentDrawerWidthForKey(event.key, widthRef.current, boundsRef.current);
    if (next === null) return;
    event.preventDefault();
    endResize();
    commitWidth(updateWidth(next));
  };

  useLayoutEffect(() => {
    const measure = () => {
      endResize();
      const next = workspaceBounds();
      boundsRef.current = next;
      setBounds(next);
      updateWidth(widthPreferenceRef.current ?? next.defaultWidth);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => { window.removeEventListener('resize', measure); endResize({ render: false }); };
  }, [endResize, updateWidth]);

  useEffect(() => {
    if (previousIncidentRef.current !== selectedIncidentId) {
      previousIncidentRef.current = selectedIncidentId;
      setReview(null);
      endResize({ commit: true });
    }
    const key = requestKey(reviewRequest);
    if (key !== null && key !== handledRequestRef.current) {
      handledRequestRef.current = key;
      setReview(requestedReview(reviewRequest, selectedIncidentId));
    }
  }, [selectedIncidentId, reviewRequest?.jobId, reviewRequest?.reviewedVersion, reviewRequest?.token, endResize]);

  const focusContent = useCallback(() => {
    const heading = reviewJob ? reviewHeadingRef.current : contentRef.current?.querySelector('.agent-incident-header h2');
    (heading || contentRef.current)?.focus({ preventScroll: true });
  }, [Boolean(reviewJob)]);

  useLayoutEffect(() => {
    if (detail) changeRef.current?.(width);
  }, [width, Boolean(detail)]);

  useLayoutEffect(() => {
    if (!detail) return undefined;
    if (contentRef.current) contentRef.current.scrollTop = 0;
    const frame = requestAnimationFrame(focusContent);
    return () => cancelAnimationFrame(frame);
  }, [selectedIncidentId, reviewJob?.id, Boolean(detail), focusContent]);

  const reportClose = () => {
    endResize({ commit: true });
    closeRef.current?.();
  };
  const navigate = offset => {
    const id = navigationIds[index + offset];
    if (!id || !onSelectIncident) return;
    endResize({ commit: true });
    setReview(null);
    onSelectIncident(id);
  };
  const openReview = job => {
    if (!detail?.scopedJobIds.includes(job.id) || !job.proposal) return;
    setReview({ jobId: job.id, reviewedVersion: job.proposal.version, incidentId: selectedIncidentId });
  };

  if (!detail) return null;

  return <section ref={panelRef} id="agent-incident-drawer" className="agent-incident-drawer" role="region" aria-labelledby="agent-incident-inspection-label" style={{ '--incident-panel-width': `${width}px` }} data-placement="right" data-docked="true" data-resizing={resizing ? 'true' : 'false'} onKeyDown={event => { if (event.key === 'Escape' && !event.defaultPrevented) { event.preventDefault(); event.stopPropagation(); reportClose(); } }}>
    <header className="agent-incident-drawer-label"><span id="agent-incident-inspection-label">Incident details</span><nav className="agent-incident-drawer-navigation" aria-label="Incident navigation">
      <hbr-button variant="text" size="small" arialabel="Previous incident" disabled={index <= 0 || !onSelectIncident} onClick={() => navigate(-1)}><hbr-icon name="caret-left" size="16px" aria-hidden="true"/></hbr-button>
      <span className="agent-incident-drawer-position">{index + 1} of {navigationIds.length}</span>
      <hbr-button variant="text" size="small" arialabel="Next incident" disabled={index < 0 || index >= navigationIds.length - 1 || !onSelectIncident} onClick={() => navigate(1)}><hbr-icon name="caret-right" size="16px" aria-hidden="true"/></hbr-button>
    </nav><hbr-button class="agent-incident-drawer-close" variant="text" size="small" arialabel="Close incident details" onClick={reportClose}><hbr-icon name="x" size="16px" aria-hidden="true"/></hbr-button></header>
    <div className="agent-incident-drawer-resize" role="separator" tabIndex={0} aria-orientation="vertical" aria-label="Resize incident drawer" aria-valuemin={bounds.min} aria-valuemax={bounds.max} aria-valuenow={width} aria-valuetext={`${width} pixels`} onPointerDown={startResize} onLostPointerCapture={event => { if (dragRef.current?.pointerId === event.pointerId) endResize({ commit: true }); }} onKeyDown={resizeWithKey}><span aria-hidden="true"/></div>
    <div className="agent-incident-drawer-content" ref={contentRef} tabIndex={-1}>
      {reviewJob ? <div className="agent-incident-drawer-review" key={`${selectedIncidentId}-${reviewJob.id}`}>
        <hbr-button class="agent-incident-drawer-back" variant="text" size="small" onClick={() => setReview(null)}><hbr-icon name="arrow-left" slot="prefix" size="14px" aria-hidden="true"/>Back to incident</hbr-button>
        <header className="agent-incident-drawer-review-heading"><span>{detail.id} · {reviewJob.id}</span><h2 ref={reviewHeadingRef} tabIndex={-1}>Review change</h2></header>
        <ScopedChangeReview job={reviewJob} model={model} decision={changeDecisions[reviewJob.id]} reviewedVersion={review.reviewedVersion} onDecision={(jobId, state, version) => onDecision?.(jobId, state, version)}/>
      </div> : <IncidentThread key={selectedIncidentId} embedded model={model} incidentId={selectedIncidentId} domainFilter={domainFilter} agentFilter={agentFilter} onReview={openReview}/>}
    </div>
  </section>;
}
