import { useId, useState } from 'react';
import { agentQueue, agentResponse } from './model/agentic-model.js';
import { observations, currentFrame, THRESHOLD, INTERFACE } from './model/model.js';
import './agent-workspace.css';

const QUESTIONS = ['Why this response?', 'What else is affected?', 'What happens next?'];
const JOB_LABELS = { 'not-started': 'Not started', running: 'Running', completed: 'Completed', failed: 'Failed', unknown: 'Result unknown' };
const STAGE_VARIANTS = { complete: 'complete', active: 'progress', blocked: 'inactive', pending: 'inactive' };
const STAGE_LABELS = { complete: 'Complete', active: 'In progress', blocked: 'Waiting for prerequisites', pending: 'Not started' };
const toneFor = (response) => response.resolved ? 'positive' : response.needsDecision ? 'warning' : response.paused || response.inactive ? 'inactive' : 'in-progress';
const inputValue = (event) => String(event.currentTarget?.value ?? event.target?.value ?? event.detail?.value ?? '');

function SectionHeading({ children }) {
  return <hbr-text variant="sub-section-title">{children}</hbr-text>;
}

function StageRail({ response }) {
  const steps = response.steps.length ? response.steps : [
    { id: 'investigate', label: 'Investigate', status: 'pending' },
    { id: 'remediate', label: 'Remediate', status: 'pending' },
    { id: 'verify', label: 'Verify', status: 'pending' },
  ];
  return (
    <section className="wan-agent-section" aria-label="Autonomous response stages">
      <hbr-text type="secondary" size="xs">Autonomous response stages</hbr-text>
      <hbr-timeline>
        {steps.map((step) => (
          <hbr-timeline-panel
            key={step.id}
            label={step.label}
            subtext={STAGE_LABELS[step.status] || step.status}
            variant={STAGE_VARIANTS[step.status] || 'default'}
            aria={{ level: 4 }}
          />
        ))}
      </hbr-timeline>
    </section>
  );
}

function Findings({ response, onInspect, target }) {
  return (
    <hbr-layout direction="column" gap="lg">
      <hbr-text>{response.summary}</hbr-text>
      {response.evidence.map((item) => (
        <div className="wan-agent-source" key={`${item.source}-${item.label}`}>
          <div className="wan-agent-row">
            <hbr-text weight="semibold">{item.label}</hbr-text>
            <hbr-tag size="small" sentiment={item.fresh ? 'info' : 'inactive'}>
              {item.fresh ? 'Observed' : 'Last known'}
            </hbr-tag>
          </div>
          <hbr-text>{item.value}</hbr-text>
          <hbr-text type="secondary" size="xs">{item.source} · {item.time}</hbr-text>
        </div>
      ))}
      <hbr-button variant="text" size="small" onClick={() => onInspect?.(target)}>
        Inspect {target.kind === 'device' ? 'device' : 'interface'} sources
        <hbr-icon slot="suffix" name="arrow-right" />
      </hbr-button>
    </hbr-layout>
  );
}

function Activity({ response, time }) {
  const events = response.activity.length ? response.activity : [{
    time,
    agent: 'Coordination agent',
    title: 'Network watch active',
    detail: 'Qualifying conditions trigger a response within the delegated WAN scope.',
  }];
  return (
    <hbr-timeline>
      {events.map((event, index) => (
        <hbr-timeline-panel
          key={`${event.time}-${event.title}-${index}`}
          label={event.title}
          subtext={`${event.time} · ${event.agent}`}
          variant="complete"
          open={true}
          aria={{ level: 4 }}
        >
          <hbr-text>{event.detail}</hbr-text>
        </hbr-timeline-panel>
      ))}
    </hbr-timeline>
  );
}

function ExecutionRecord({ response, onAction }) {
  const { job, acknowledgement, handoff } = response;
  return (
    <hbr-layout direction="column" gap="lg">
      <dl className="wan-agent-record">
        <dt>Response owner</dt><dd>{response.owner}</dd>
        <dt>Target</dt><dd>{response.target}</dd>
        <dt>Acknowledgement</dt><dd>{acknowledgement?.confirmed ? `${acknowledgement.actor} · ${acknowledgement.time} · Confirmed` : 'Not applicable'}</dd>
        <dt>Controller job</dt><dd>{job.id ? `${job.id} · ${JOB_LABELS[job.status]}` : 'No controller change started'}</dd>
        {job.startedAt && <><dt>Started</dt><dd>{job.startedAt}</dd></>}
        {job.completedAt && <><dt>Completed</dt><dd>{job.completedAt}</dd></>}
      </dl>
      {job.id && (
        <hbr-timeline>
          {job.steps.map((step) => (
            <hbr-timeline-panel
              key={step.label}
              label={step.label}
              subtext={STAGE_LABELS[step.status] || step.status}
              variant={STAGE_VARIANTS[step.status] || 'default'}
              aria={{ level: 4 }}
            />
          ))}
        </hbr-timeline>
      )}
      {handoff && (
        <div className="wan-agent-source">
          <hbr-text weight="semibold">Engineering handoff</hbr-text>
          <hbr-tag size="small" sentiment={handoff.status === 'accepted' ? 'positive' : 'info'}>
            {handoff.status === 'accepted' ? `Accepted by ${handoff.acceptedBy || 'engineering'}` : 'Delivered · Acceptance pending'}
          </hbr-tag>
          <hbr-text>{handoff.route} · Routed by {handoff.actor || 'CW AI'} at {handoff.sent}</hbr-text>
          {handoff.accepted && <hbr-text type="secondary" size="xs">Acceptance confirmed {handoff.accepted}</hbr-text>}
          <hbr-button variant="text" size="small" onClick={() => onAction({ type: 'SHOW_HANDOFF', incident: response.id })}>Review delivered context</hbr-button>
        </div>
      )}
      <hbr-text type="secondary" size="xs">A controller result, a source alarm, and verified recovery are separate records.</hbr-text>
    </hbr-layout>
  );
}

export function AgentSummary({ state, onAction }) {
  const queue = agentQueue(state);
  const decisions = queue.filter((item) => item.needsDecision);
  const working = queue.filter((item) => !item.resolved && !item.needsDecision);
  const selected = decisions[0] || queue.find((item) => item.id === state.agentic?.selected) || queue[0] || agentResponse(state);
  const resolved = queue.some((item) => item.resolved);
  const title = decisions.length ? `${decisions.length} ${decisions.length === 1 ? 'response needs' : 'responses need'} a decision` : working.length ? `${working.length} ${working.length === 1 ? 'response' : 'responses'} in progress` : resolved ? 'Recovery verified by CW AI' : 'Autonomous response enabled';
  return (
    <div className="wan-agent-summary" aria-label="CW AI response status">
      <hbr-icon name="magic-wand" size="24px" />
      <div className="wan-agent-summary-copy">
        <hbr-text weight="semibold">CW AI · {title}</hbr-text>
        <hbr-text type="secondary" size="xs">{selected.currentWork}</hbr-text>
      </div>
      <hbr-tag size="small" sentiment={toneFor(selected)}>{selected.stage}</hbr-tag>
      <hbr-button variant="outline" size="small" onClick={() => onAction({ type: 'AGENT_OPEN', incident: selected.id })}>
        {state.agentic?.open ? 'Response open' : decisions.length ? 'Review decision' : 'View response'}
        <hbr-icon slot="suffix" name="arrow-right" />
      </hbr-button>
    </div>
  );
}

export function AgentWorkspace({ state, onAction, onInspect, onClose }) {
  const headingId = useId();
  const [intervening, setIntervening] = useState(false);
  if (!state.agentic?.open) return null;

  const selectedId = state.agentic.selected || 'interface';
  const response = agentResponse(state, selectedId);
  const queue = agentQueue(state);
  const choices = queue.some((item) => item.id === response.id) ? queue : [...queue, response];
  const source = observations(state);
  const time = currentFrame(state).time;
  const { job, decision } = response;
  const paused = !!state.agentic.paused;
  const historical = state.history !== null && state.history !== undefined;
  const canIntervene = !historical && !response.resolved && !response.inactive && response.stage !== 'Monitoring' && !(response.id === 'interface' && state.frame < 2);
  const target = response.id === 'device' || (response.id === 'monitoring' && state.gap !== 'west') ? { kind: 'device', id: 'XR-PE-E2' } : { kind: 'interface', id: `XR-P1:${INTERFACE}` };
  const messages = (state.agentic.messages || []).filter((message) => message.incident === response.id);
  const draft = state.agentic.draft || '';
  const ask = (question) => {
    if (question.trim()) onAction({ type: 'AGENT_ASK', incident: response.id, question: question.trim() });
  };
  const close = () => onClose ? onClose() : onAction({ type: 'AGENT_CLOSE' });

  return (
    <aside className="wan-agent-workspace" aria-labelledby={headingId} data-agent-stage={response.stage} data-agent-incident={response.id}>
      <header className="wan-agent-header">
        <div className="wan-agent-row">
          <hbr-layout direction="row" gap="sm" align="center">
            <hbr-icon name="magic-wand" size="24px" />
            <hbr-text id={headingId} variant="section-title">CW AI response</hbr-text>
          </hbr-layout>
          <hbr-layout direction="row" gap="xs" align="center">
            <hbr-button size="small" variant="text" aria={{ pressed: !!state.agentic.pinned }} onClick={() => onAction({ type: 'AGENT_PIN' })}>
              {state.agentic.pinned ? 'Pinned' : 'Pin'}
            </hbr-button>
            <hbr-button size="small" variant="text" aria={{ label: 'Minimize CW AI response' }} onClick={close}>
              <hbr-icon name="x" />
            </hbr-button>
          </hbr-layout>
        </div>
        <hbr-select
          key={choices.map(item => `${item.id}:${item.title}:${item.needsDecision}:${item.resolved}`).join('|')}
          label="Response queue"
          size="small"
          value={response.id}
          hoist={true}
          onhbr-change={(event) => {
            const incident = event.detail?.option?.value ?? event.currentTarget.value;
            if (incident) onAction({ type: 'AGENT_SELECT', incident });
          }}
        >
          {choices.map((item) => <hbr-option key={item.id} value={item.id}>{item.title}{item.needsDecision ? ' · Decision needed' : item.resolved ? ' · Resolved' : ''}</hbr-option>)}
        </hbr-select>
        <div className="wan-agent-row">
          <hbr-text size="xs" weight="semibold">Owned by {response.owner}</hbr-text>
          <hbr-tag size="small" sentiment={toneFor(response)}>{response.stage}</hbr-tag>
        </div>
        <hbr-text type="secondary" size="xs">{response.scope}</hbr-text>
      </header>

      <div className="wan-agent-body" tabIndex={-1}>
        <hbr-card>
          <hbr-layout direction="column" gap="md">
            <div className="wan-agent-row">
              <hbr-text size="xs" weight="semibold">{response.currentAgent}</hbr-text>
              {job.id && <hbr-tag size="small" sentiment={job.status === 'failed' ? 'negative' : job.status === 'completed' ? 'positive' : 'info'}>{job.id} · {JOB_LABELS[job.status]}</hbr-tag>}
            </div>
            <SectionHeading>{response.currentWork}</SectionHeading>
            {job.status === 'running' && (
              <hbr-layout direction="row" gap="sm" align="center">
                <hbr-spinner size="small" direction="row" aria-label="Following running controller job" />
                <hbr-text type="secondary" size="xs">Following confirmed controller execution</hbr-text>
              </hbr-layout>
            )}
            <hbr-text>{response.summary}</hbr-text>
            <div className="wan-agent-source">
              <hbr-text type="secondary" size="xs">{response.resolved ? 'Outcome' : 'Next agent activity'}</hbr-text>
              <hbr-text>{response.next}</hbr-text>
            </div>
          </hbr-layout>
        </hbr-card>

        {decision && response.needsDecision && (
          <section className="wan-agent-decision wan-agent-section" aria-label="Engineering decision">
            <hbr-tag size="small" sentiment="warning">Engineering decision required</hbr-tag>
            <SectionHeading>{decision.title}</SectionHeading>
            <hbr-text>{decision.detail}</hbr-text>
            {response.handoff && <hbr-text type="secondary" size="xs">CW AI delivered the evidence to {response.handoff.route} at {response.handoff.sent}. Engineering acceptance is {response.handoff.status === 'accepted' ? 'confirmed' : 'pending'}.</hbr-text>}
            <hbr-button size="small" variant="outline" onClick={() => onAction({ type: 'SHOW_HANDOFF', incident: response.id })}>Review engineering handoff</hbr-button>
          </section>
        )}

        {response.id === 'interface' && state.frame >= 1 && (
          <section className="wan-agent-metric wan-agent-section" aria-label="Interface source observation">
            <div className="wan-agent-row">
              <hbr-layout direction="column" gap="xs">
                <hbr-text type="secondary" size="xs">{source.fresh ? 'Latest interface observation' : 'Last-known interface observation'}</hbr-text>
                <hbr-text type="number" size="md" weight="bold">{source.utilization}%</hbr-text>
              </hbr-layout>
              <hbr-tag size="small" sentiment={source.fresh ? 'info' : 'inactive'}>{source.fresh ? 'Current' : 'Telemetry unavailable'}</hbr-tag>
            </div>
            <hbr-text type="secondary" size="xs">Observed {source.observedAt} · Alarm threshold {THRESHOLD}%</hbr-text>
            <div className="wan-agent-row">
              <hbr-text size="xs">Source alarm · CNC-1042</hbr-text>
              <hbr-tag size="small" sentiment={state.frame >= 11 ? 'positive' : state.frame >= 2 ? 'warning' : 'inactive'}>{state.frame >= 11 ? 'Source-cleared' : state.frame >= 2 ? 'Major · Active' : 'Not reported'}</hbr-tag>
            </div>
          </section>
        )}

        <StageRail response={response} />

        <div className="wan-agent-disclosures">
          <hbr-accordion summary="Findings and sources" size="small">
            <Findings response={response} onInspect={onInspect} target={target} />
          </hbr-accordion>
          <hbr-accordion summary={`Agent activity · ${response.activity.length}`} size="small">
            <Activity response={response} time={time} />
          </hbr-accordion>
          <hbr-accordion summary="Change and execution record" size="small">
            <ExecutionRecord response={response} onAction={onAction} />
          </hbr-accordion>
          {response.criteria.length > 0 && (
            <hbr-accordion summary="Recovery verification" size="small" open={response.stage === 'Verifying' || response.resolved}>
              <hbr-layout direction="column" gap="lg">
                {response.criteria.map((criterion) => (
                  <div className="wan-agent-criterion" key={criterion.id}>
                    <hbr-icon name={criterion.met ? 'status-positive' : 'status-dormant'} sentiment={criterion.met ? 'positive' : 'dormant'} size="20px" />
                    <hbr-layout direction="column" gap="xs">
                      <hbr-text weight="semibold">{criterion.label}</hbr-text>
                      <hbr-text type="secondary" size="xs">{criterion.met ? 'Met' : 'Pending'} · {criterion.detail}</hbr-text>
                    </hbr-layout>
                  </div>
                ))}
              </hbr-layout>
            </hbr-accordion>
          )}
        </div>

        <section className="wan-agent-section" aria-label="Ask CW AI about this response">
          <SectionHeading>Ask CW AI</SectionHeading>
          <hbr-text type="secondary" size="xs">Ask about the evidence or affected scope. Agents continue while you ask.</hbr-text>
          {messages.length > 0 && (
            <div className="wan-agent-conversation" role="log" aria-label="Response conversation" aria-live="polite">
              {messages.map((message) => (
                <div className="wan-agent-message" data-role={message.role} key={message.id}>
                  <div className="wan-agent-row">
                    <hbr-text size="xs" weight="semibold">{message.role === 'operator' ? 'Priya' : 'CW AI'}</hbr-text>
                    <hbr-text type="secondary" size="xs">{message.time}</hbr-text>
                  </div>
                  <hbr-text>{message.text}</hbr-text>
                </div>
              ))}
            </div>
          )}
          <div className="wan-agent-questions">
            {QUESTIONS.map((question) => <hbr-button variant="outline" size="small" key={question} onClick={() => ask(question)}>{question}</hbr-button>)}
          </div>
          <form className="wan-agent-question-form" onSubmit={(event) => { event.preventDefault(); ask(draft); }}>
            <hbr-input
              label="Ask about this incident"
              placeholder="Ask about these findings…"
              autocomplete="off"
              value={draft}
              onhbr-input={(event) => onAction({ type: 'AGENT_DRAFT', incident: response.id, value: inputValue(event) })}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.isComposing) {
                  event.preventDefault();
                  ask(draft);
                }
              }}
            />
            <hbr-button type="submit" size="small" disabled={!draft.trim()}>Ask</hbr-button>
          </form>
          <hbr-accordion summary="Add operator context" size="small">
            <hbr-textarea
              label="Context for this response"
              helpText="Saved with this response. Context does not authorize a controller change."
              rows={3}
              resize="vertical"
              value={state.agentic.notes?.[response.id] || ''}
              onhbr-input={(event) => onAction({ type: 'AGENT_NOTE', incident: response.id, value: inputValue(event) })}
            />
          </hbr-accordion>
        </section>
      </div>

      <footer className="wan-agent-footer">
        <hbr-text type="secondary" size="xs">{historical ? 'Historical review · Return to current observations to intervene' : response.resolved ? 'Outcome and evidence retained' : state.agentic.pinned ? 'Pinned response · Monitoring continues' : 'Response continues when minimized'}</hbr-text>
        {canIntervene && (
          <hbr-accordion summary="Intervene" size="small" open={intervening} onhbr-show={() => setIntervening(true)} onhbr-hide={() => setIntervening(false)}>
            <hbr-layout direction="column" gap="md">
              <hbr-text type="secondary" size="xs">Pausing prevents further automated changes. Observation continues; a confirmed controller job is not cancelled or reversed.</hbr-text>
              {response.id === 'interface' && <hbr-button variant="outline" size="small" onClick={() => onAction({ type: paused ? 'AGENT_RESUME' : 'AGENT_PAUSE', incident: response.id })}>{paused ? 'Resume with revalidation' : 'Pause further changes'}</hbr-button>}
              {!response.handoff ? <hbr-button variant="outline" size="small" onClick={() => onAction({ type: 'AGENT_HANDOFF', incident: response.id })}>Route to engineering</hbr-button> : <hbr-text type="secondary" size="xs">Evidence already delivered to {response.handoff.route}. {response.handoff.status === 'accepted' ? 'Acceptance confirmed.' : 'Acceptance pending.'}</hbr-text>}
            </hbr-layout>
          </hbr-accordion>
        )}
      </footer>
    </aside>
  );
}

export default AgentWorkspace;
