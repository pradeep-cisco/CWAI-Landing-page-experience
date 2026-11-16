import { useMemo } from 'react';
import { buildOperations } from '../operations/operations-model.js';
import { DataHealthSummary } from '../operations/EvidenceSections.jsx';

export default function AdminDataHealth({ state, onInspect, onOpen }) {
  const model = useMemo(() => buildOperations(state), [state]);
  const contextKey = `${model.scope.domainId}:${model.scope.groupId}`;
  return <DataHealthSummary key={contextKey} model={model} onInspect={onInspect} onOpen={onOpen} defaultExpanded/>;
}
