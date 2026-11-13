import { ACTIVE_WAN, DEVICES, DOMAINS, domainLabel } from './model/scale.js';
import { THRESHOLD } from './model/model.js';
import { agentResponse } from './model/agentic-model.js';

export function IncidentList({ watch, onOpen, onInspect }) {
  return <hbr-layout variant="dashboard:widgets:container">
    <hbr-card container col="full">
      <hbr-layout slot="header" direction="row" gap="md" align="center">
        <hbr-text variant="section-title">Open incidents</hbr-text>
        <hbr-tag size="small" sentiment={watch.incidents.length ? 'warning' : 'positive'}>{watch.incidents.length} open</hbr-tag>
      </hbr-layout>
      <hbr-layout direction="column" gap="lg">
        {watch.incidents.length ? watch.incidents.map(incident => {
          const target = watch.updates.find(update => update.incident === incident.id && update.target)?.target;
          return <article className="crosswork-incident-row" key={incident.id}>
            <div className="crosswork-incident-heading">
              <hbr-tag status size="small" sentiment={incident.severity === 'Critical' ? 'negative' : incident.severity === 'Coverage gap' ? 'inactive' : 'warning'}>{incident.sourceState}</hbr-tag>
              <hbr-tag size="small" sentiment={incident.attentionRequired ? 'warning' : 'in-progress'}>{incident.stage}</hbr-tag>
            </div>
            <hbr-text variant="sub-section-title">{incident.title}</hbr-text>
            <hbr-text size="sm" type="secondary">{domainLabel(incident.domainId)} · {incident.target}</hbr-text>
            <hbr-text size="sm">CW AI · {incident.currentWork}</hbr-text>
            <hbr-layout direction="row" gap="md">
              <hbr-button size="small" variant="outline" onClick={() => onOpen(incident.id)}>Follow response</hbr-button>
              {target && <hbr-button size="small" variant="text" onClick={() => onInspect(target)}>Inspect source</hbr-button>}
            </hbr-layout>
          </article>;
        }) : <hbr-layout direction="row" gap="md" align="center">
          <hbr-icon name="status-positive" sentiment="positive" size="24px" />
          <hbr-text>No open incidents in the current network watch.</hbr-text>
        </hbr-layout>}
      </hbr-layout>
    </hbr-card>
  </hbr-layout>;
}

export function AdminSummary({ state }) {
  const response = agentResponse(state);
  return <div className="crosswork-admin-grid">
    <hbr-card container col="full">
      <hbr-text slot="header" variant="section-title">Autonomous response</hbr-text>
      <hbr-layout direction="column" gap="lg">
        <hbr-tag size="small" sentiment={state.agentic.paused ? 'warning' : 'info'}>{state.agentic.paused ? 'Further changes paused' : 'Delegated response enabled'}</hbr-tag>
        <hbr-key-value-pairs direction="column"><dl>
          <dt>Network scope</dt><dd>{ACTIVE_WAN.label}</dd>
          <dt>Managed inventory</dt><dd>{DEVICES.length.toLocaleString('en-US')} IOS XR routers · {DOMAINS.length} domains</dd>
          <dt>Response assessment</dt><dd>{response.plan?.title || response.stage}</dd>
          <dt>Response basis</dt><dd>{response.plan?.origin === 'graph-derived' ? 'Constructed from network evidence' : 'Procedure and network evidence'}</dd>
          <dt>Execution boundary</dt><dd>Current evidence, permitted scope and validated constraints</dd>
        </dl></hbr-key-value-pairs>
      </hbr-layout>
    </hbr-card>
    <hbr-card container col="full">
      <hbr-text slot="header" variant="section-title">Recovery requirements</hbr-text>
      <hbr-key-value-pairs direction="column"><dl>
        <dt>Source quality</dt><dd>Current interface observations required</dd>
        <dt>Utilization</dt><dd>Below {THRESHOLD}%</dd>
        <dt>Stability window</dt><dd>5 minutes without collection gaps</dd>
        <dt>Alarm state</dt><dd>Cleared by the source</dd>
        <dt>Controller result</dt><dd>Confirmed execution completion</dd>
      </dl></hbr-key-value-pairs>
    </hbr-card>
  </div>;
}
