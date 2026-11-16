import { useState } from 'react';
import { AdminSummary } from '../ProductSections.jsx';
import { ACTIVE_WAN } from '../model/scale.js';
import AdminDataHealth from './AdminDataHealth.jsx';
import KnowledgeGraph from './KnowledgeGraph.jsx';

export default function AdminWorkspace({ state, onInspect, onOpen }) {
  const [view, setView] = useState('knowledge');
  return <hbr-tab-group primary class="wan-admin-tabs" aria-label="Admin sections" onhbr-tab-show={event => { if (event.target === event.currentTarget && ['knowledge', 'health', 'automation'].includes(event.detail?.name)) setView(event.detail.name); }}>
    <hbr-tab slot="nav" panel="knowledge" active={view === 'knowledge'}>Knowledge graph</hbr-tab>
    <hbr-tab slot="nav" panel="health" active={view === 'health'}>Data health</hbr-tab>
    <hbr-tab slot="nav" panel="automation" active={view === 'automation'}>Automation</hbr-tab>
    <hbr-tab-panel name="knowledge" active={view === 'knowledge'}><KnowledgeGraph key={ACTIVE_WAN.id} state={state}/></hbr-tab-panel>
    <hbr-tab-panel name="health" active={view === 'health'}><AdminDataHealth state={state} onInspect={onInspect} onOpen={onOpen}/></hbr-tab-panel>
    <hbr-tab-panel name="automation" active={view === 'automation'}><AdminSummary state={state}/></hbr-tab-panel>
  </hbr-tab-group>;
}
