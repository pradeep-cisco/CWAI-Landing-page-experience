// Selectable local fixtures share one active set of inventory indexes. Only a
// bounded page or the 12-router investigation is rendered in the browser.
import {NODES, LINKS, TARGET, CRITICAL_ALARM, activeAlarms, observations} from './model.js';
import {WAN_SETUPS, createWanSetup} from './wan-setups.js';
export {WAN_SETUPS};

export let ACTIVE_WAN, DOMAINS, DEVICE_GROUPS, GROUPS, POPS, DEVICES, NETWORK_LINKS,
  BUNDLES, GROUP_BUNDLES, INTERFACES, TOTAL_DEVICES, TOTAL_LINKS, MONITORING_CONTEXT;
export const PAGE_SIZES={groups:8,pops:8,devices:12,interfaces:6,search:10,links:10};
const fixtureCache=new Map();
let domainIndex,deviceIndex,groupIndex,devicesByGroup,devicesByDomain,linkIndex,
  incidentIndex,interfaceIndex,interfacesByDevice,bundleIndex,groupBundleIndex;

export function setActiveWanSetup(id){
  // Resolve and validate the next fixture before replacing any live binding.
  let fixture=fixtureCache.get(id);
  if(!fixture){fixture=createWanSetup(id);fixtureCache.set(id,fixture);}
  ACTIVE_WAN=fixture;
  DOMAINS=fixture.domains;
  DEVICE_GROUPS=GROUPS=POPS=fixture.groups;
  DEVICES=fixture.devices;
  NETWORK_LINKS=fixture.links;
  BUNDLES=fixture.bundles;
  GROUP_BUNDLES=fixture.groupBundles;
  INTERFACES=fixture.interfaces;
  MONITORING_CONTEXT=fixture.monitoringContext;
  TOTAL_DEVICES=DEVICES.length;
  TOTAL_LINKS=NETWORK_LINKS.length;
  domainIndex=new Map(DOMAINS.map(domain=>[domain.id,domain]));
  deviceIndex=new Map(DEVICES.map(device=>[device.id,device]));
  groupIndex=new Map(DEVICE_GROUPS.map(group=>[group.id,group]));
  devicesByGroup=new Map(DEVICE_GROUPS.map(group=>[group.id,[]]));
  devicesByDomain=new Map(DOMAINS.map(domain=>[domain.id,[]]));
  incidentIndex=new Map(DEVICES.map(device=>[device.id,[]]));
  interfacesByDevice=new Map(DEVICES.map(device=>[device.id,[]]));
  for(const device of DEVICES){
    devicesByGroup.get(device.groupId).push(device);
    devicesByDomain.get(device.domain).push(device);
  }
  linkIndex=new Map(NETWORK_LINKS.map(link=>[link.id,link]));
  for(const link of NETWORK_LINKS){
    incidentIndex.get(link.from).push(link);
    incidentIndex.get(link.to).push(link);
  }
  interfaceIndex=new Map(INTERFACES.map(port=>[port.id,port]));
  for(const port of INTERFACES)interfacesByDevice.get(port.device).push(port);
  bundleIndex=new Map(BUNDLES.map(bundle=>[bundle.id,bundle.linkIds.map(id=>linkIndex.get(id))]));
  groupBundleIndex=new Map(GROUP_BUNDLES.map(bundle=>[bundle.id,bundle.linkIds.map(id=>linkIndex.get(id))]));
  return fixture;
}
setActiveWanSetup('national');

export function findDevice(id){return deviceIndex.get(id);}
export function findGroup(id){return groupIndex.get(id);}
export function findPop(id){return findGroup(id);}
export function domainLabel(id){return (typeof id==='object'?id:domainIndex.get(id))?.label??String(id??'');}
export function groupLabel(id){return (typeof id==='object'?id:findGroup(id))?.label??String(id??'');}
export function domainDevices(domain){return devicesByDomain.get(domain)||[];}
export function groupDevices(group){return devicesByGroup.get(group)||[];}
export function popDevices(pop){return groupDevices(pop);}
export function findLink(id){return linkIndex.get(id);}
export function deviceLinks(id){return incidentIndex.get(id)||[];}
export function deviceInterfaces(id){return interfacesByDevice.get(id)||[];}
export function findInterface(id,name){return interfaceIndex.get(name===undefined?id:`${id}:${name}`);}
export function telemetryCurrent(state,device){return !(state.gap==='east'&&device.domain===MONITORING_CONTEXT.criticalDomain)&&!(state.gap==='west'&&['XR-P1','XR-P2'].includes(device.id));}
export function deviceReachable(state,id){return !(state.critical&&id==='XR-PE-E2');}
export function alarmDevice(alarm){return findDevice(alarm.id==='CNC-1044'?'XR-P2':alarm.id===CRITICAL_ALARM?'XR-PE-E2':'XR-P1');}
export function scopeAlarms(state,domain=null,group=null){return activeAlarms(state).filter(a=>{const d=alarmDevice(a);return (!domain||d.domain===domain)&&(!group||d.groupId===group);});}
export function summarize(state,devices=DEVICES){
  const ids=new Set(devices.map(d=>d.id)),alarms=activeAlarms(state).filter(a=>ids.has(alarmDevice(a).id));
  const critical=alarms.filter(a=>a.severity==='Critical').length,major=alarms.filter(a=>a.severity==='Major').length,minor=alarms.filter(a=>a.severity==='Minor').length;
  const stale=devices.filter(d=>!telemetryCurrent(state,d)).length;
  return {devices:devices.length,reachable:devices.filter(d=>deviceReachable(state,d.id)).length,stale,alarms:alarms.length,critical,major,minor,newAlarms:alarms.filter(a=>!a.acknowledged).length,tone:critical?'critical':major||minor?'major':stale?'unknown':'normal',highest:critical?'Critical':major?'Major':minor?'Minor':null};
}
export function paged(items,page=0,size=12){
  const pages=Math.max(1,Math.ceil(items.length/size)),current=Math.max(0,Math.min(pages-1,Math.trunc(Number(page)||0)));
  return {items:items.slice(current*size,(current+1)*size),page:current,pages,total:items.length,start:items.length?current*size+1:0,end:Math.min(items.length,(current+1)*size)};
}
export function searchDevices(query,page=0){
  const q=query.trim().toLowerCase();
  const matches=q?DEVICES.filter(d=>`${d.id} ${d.address} ${d.groupId} ${d.domain} ${groupLabel(d.groupId)}`.toLowerCase().includes(q)):DEVICES;
  // Exact IDs come first without changing inventory order for the rest of a query.
  const exact=matches.find(d=>d.id.toLowerCase()===q||d.address===q);
  const result=exact?[exact,...matches.filter(d=>d!==exact)]:matches;
  return paged(result,page,PAGE_SIZES.search);
}
export function bundleLinks(id){return bundleIndex.get(id)||[];}
export function groupBundleLinks(id){return groupBundleIndex.get(id)||[];}
export function linkUtilization(state,link){if(link.id===TARGET)return observations(state).utilization;let hash=0;for(const ch of link.id)hash=(hash*31+ch.charCodeAt(0))>>>0;return 20+hash%45;}
function summarizeLinks(state,links){
  const fresh=links.filter(l=>l.id===TARGET?observations(state).fresh:telemetryCurrent(state,findDevice(l.from))&&telemetryCurrent(state,findDevice(l.to)));
  return {total:links.length,current:fresh.length,unavailable:links.length-fresh.length,max:fresh.length?Math.max(...fresh.map(l=>linkUtilization(state,l))):null,active:activeAlarms(state).filter(a=>links.some(l=>l.id===a.object)).length};
}
export function bundleSummary(state,id){return summarizeLinks(state,bundleLinks(id));}
export function groupBundleSummary(state,id){return summarizeLinks(state,groupBundleLinks(id));}
export function focusedSummary(){const ids=new Set(NODES.map(n=>n.id));return {devices:ids.size,shownLinks:LINKS.length,otherLinks:NETWORK_LINKS.filter(l=>(ids.has(l.from)||ids.has(l.to))&&!LINKS.some(s=>s.id===l.id)).length};}
export function viewSnapshot(state){return {view:state.view,domain:state.domain,popId:state.popId,scopePage:state.scopePage,groupConnectionsPage:state.groupConnectionsPage??0};}
export function navigateScope(state,kind,value){
  if(kind==='network')return {...state,history:null,liveContext:null,view:'network',domain:'All domains',popId:null,scopePage:0,groupConnectionsPage:0,selection:null,returnView:null};
  if(kind==='domain')return {...state,history:null,liveContext:null,view:'domain',domain:value,popId:null,scopePage:0,groupConnectionsPage:0,selection:null,returnView:null};
  if(kind==='group'||kind==='pop'){const group=findGroup(value);return group?{...state,history:null,liveContext:null,view:'pop',domain:group.domain,popId:group.id,scopePage:0,groupConnectionsPage:0,selection:null,returnView:null}:state;}
  if(kind==='investigation')return {...state,returnView:state.view==='investigation'?state.returnView:viewSnapshot(state),view:'investigation',domain:'All domains',popId:null,scopePage:0,groupConnectionsPage:0};
  return state;
}
export function networkHandoverPrefix(state){
  const s=summarize(state),types=['PoP','Region'].map(type=>({type,count:DEVICE_GROUPS.filter(group=>group.type===type).length})).filter(item=>item.count);
  return `WAN setup: ${ACTIVE_WAN.label}.\nNetwork scope: ${s.devices.toLocaleString('en-US')} routers · ${DEVICE_GROUPS.length} device groups (${types.map(({type,count})=>`${count} ${type}${count===1?'':'s'}`).join(', ')}) · ${DOMAINS.length} operational domains.\nReachability: ${s.reachable.toLocaleString('en-US')} / ${s.devices.toLocaleString('en-US')}.\nCurrent telemetry coverage: ${(s.devices-s.stale).toLocaleString('en-US')} / ${s.devices.toLocaleString('en-US')} routers.\n\n`;
}
