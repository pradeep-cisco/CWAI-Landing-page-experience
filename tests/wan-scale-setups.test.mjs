import test, {afterEach} from 'node:test';
import assert from 'node:assert/strict';
import * as scale from '../src/features/wan/model/scale.js';
import {createState, gotoFrame, reduce, TARGET, CRITICAL_ALARM} from '../src/features/wan/model/model.js';

afterEach(() => scale.setActiveWanSetup('national'));
const at = frame => gotoFrame({...createState(),networkContext:{...scale.MONITORING_CONTEXT}},frame);

test('the active adapter defaults to the preserved national fixture and aliases the device groups', () => {
  assert.equal(scale.ACTIVE_WAN.id,'national');
  assert.equal(scale.TOTAL_DEVICES,3200);
  assert.equal(scale.TOTAL_LINKS,4939);
  assert.equal(scale.GROUPS.length,80);
  assert.equal(scale.GROUPS,scale.DEVICE_GROUPS);
  assert.equal(scale.POPS,scale.DEVICE_GROUPS);
  assert.equal(scale.PAGE_SIZES.groups,8);
  assert.equal(scale.PAGE_SIZES.pops,scale.PAGE_SIZES.groups);
  assert.equal(scale.PAGE_SIZES.interfaces,6);
  assert.deepEqual(scale.focusedSummary(),{devices:12,shownLinks:16,otherLinks:41});
});

test('switching fixtures updates all live inventories and removes obsolete indexed records', () => {
  const national = scale.ACTIVE_WAN;
  assert.ok(scale.findDevice('XR-METRO-16-034'));
  for (const descriptor of scale.WAN_SETUPS) {
    const setup = scale.setActiveWanSetup(descriptor.id);
    assert.equal(scale.ACTIVE_WAN,setup);
    assert.equal(scale.DOMAINS,setup.domains);
    assert.equal(scale.DEVICE_GROUPS,setup.groups);
    assert.equal(scale.GROUPS,setup.groups);
    assert.equal(scale.POPS,setup.groups);
    assert.equal(scale.DEVICES,setup.devices);
    assert.equal(scale.NETWORK_LINKS,setup.links);
    assert.equal(scale.BUNDLES,setup.bundles);
    assert.equal(scale.GROUP_BUNDLES,setup.groupBundles);
    assert.equal(scale.INTERFACES,setup.interfaces);
    assert.equal(scale.MONITORING_CONTEXT,setup.monitoringContext);
    assert.equal(scale.TOTAL_DEVICES,setup.devices.length);
    assert.equal(scale.TOTAL_LINKS,setup.links.length);
    assert.equal(scale.DOMAINS.reduce((count,domain) => count+scale.domainDevices(domain.id).length,0),scale.TOTAL_DEVICES);
    assert.equal(scale.GROUPS.reduce((count,group) => count+scale.groupDevices(group.id).length,0),scale.TOTAL_DEVICES);
    if (descriptor.id !== 'national') {
      assert.equal(scale.findDevice('XR-METRO-16-034'),undefined);
      assert.equal(scale.findGroup('WEST-01'),undefined);
      assert.deepEqual(scale.domainDevices('West'),[]);
      assert.deepEqual(scale.groupDevices('WEST-01'),[]);
      assert.deepEqual(scale.bundleLinks('West-Core'),[]);
      assert.deepEqual(scale.searchDevices('XR-METRO-16-034').items,[]);
    }
  }
  assert.equal(scale.setActiveWanSetup('national'),national,'a repeated selection uses the cached fixture');
  assert.ok(scale.findDevice('XR-METRO-16-034'));
});

test('an unsupported setup cannot partly replace the active inventory or its indexes', () => {
  const active = scale.setActiveWanSetup('metro');
  const target = scale.findLink(TARGET);
  assert.throws(() => scale.setActiveWanSetup('unsupported'),/Unknown WAN setup/);
  assert.equal(scale.ACTIVE_WAN,active);
  assert.equal(scale.DEVICES,active.devices);
  assert.equal(scale.findLink(TARGET),target);
  assert.equal(scale.findGroup('ACCESS-01'),active.groups[0]);
});

test('router, group, link and interface lookups all resolve only the currently selected setup', () => {
  for (const {id} of scale.WAN_SETUPS) {
    scale.setActiveWanSetup(id);
    for (const group of scale.GROUPS) {
      assert.equal(scale.findGroup(group.id),group);
      assert.equal(scale.findPop(group.id),group);
      assert.equal(scale.groupLabel(group.id),group.label);
      assert.equal(scale.popDevices(group.id),scale.groupDevices(group.id));
      assert.equal(scale.groupDevices(group.id).length,group.deviceCount);
    }
    for (const domain of scale.DOMAINS) assert.equal(scale.domainLabel(domain.id),domain.label);
    const router = scale.findDevice('XR-P1');
    const ports = scale.deviceInterfaces(router.id);
    assert.equal(ports.length,router.interfaceCount);
    assert.equal(scale.deviceLinks(router.id).length,ports.length);
    for (const port of ports) {
      assert.equal(scale.findInterface(port.id),port);
      assert.equal(scale.findInterface(router.id,port.name),port);
      assert.equal(scale.findLink(port.linkId).id,port.linkId);
    }
    const target = scale.findLink(TARGET);
    assert.equal(scale.findInterface(target.from,target.fromInterface).peer,target.to);
  }
  assert.equal(scale.findInterface('missing'),undefined);
  assert.deepEqual(scale.deviceInterfaces('missing'),[]);
  assert.deepEqual(scale.deviceLinks('missing'),[]);
});

test('telemetry, alarm rollups and reachability use the active operational domains and actual router groups', () => {
  for (const {id} of scale.WAN_SETUPS) {
    scale.setActiveWanSetup(id);
    const state = {...at(2),related:true,critical:true};
    const context = scale.MONITORING_CONTEXT;
    assert.equal(scale.summarize(state).alarms,4);
    assert.equal(scale.summarize(state).reachable,scale.TOTAL_DEVICES-1);
    assert.equal(scale.summarize(state).highest,'Critical');
    assert.equal(scale.scopeAlarms(state,context.mainDomain,context.mainGroup).length,2);
    assert.equal(scale.scopeAlarms(state,context.transitDomain,context.transitGroup).length,1);
    assert.equal(scale.scopeAlarms(state,context.criticalDomain,context.criticalGroup)[0].id,CRITICAL_ALARM);
    const eastGap = {...state,gap:'east'};
    assert.equal(scale.summarize(eastGap).stale,scale.domainDevices(context.criticalDomain).length);
    assert.equal(scale.summarize(eastGap,scale.domainDevices(context.mainDomain)).stale,0);
    assert.equal(scale.summarize({...state,gap:'west'}).stale,2);
    assert.equal(scale.summarize({...state,gap:'west'},scale.groupDevices(context.mainGroup)).stale,1);
  }
});

test('domain and group bundle helpers report real current members and preserve target alarm severity through gaps', () => {
  for (const {id} of scale.WAN_SETUPS) {
    scale.setActiveWanSetup(id);
    for (const bundle of scale.BUNDLES) assert.equal(scale.bundleLinks(bundle.id).length,bundle.count);
    for (const bundle of scale.GROUP_BUNDLES) {
      assert.deepEqual(scale.groupBundleLinks(bundle.id).map(link => link.id),bundle.linkIds);
      assert.equal(scale.groupBundleSummary(at(2),bundle.id).total,bundle.count);
    }
    const targetBundle = scale.GROUP_BUNDLES.find(bundle => bundle.linkIds.includes(TARGET));
    const current = scale.groupBundleSummary({...at(2),related:true},targetBundle.id);
    assert.equal(current.max,87);
    assert.equal(current.active,3);
    assert.equal(current.current,current.total);
    const gap = scale.groupBundleSummary({...at(2),related:true,gap:'west'},targetBundle.id);
    assert.equal(gap.active,3);
    assert.ok(gap.unavailable > 0);
    assert.equal(gap.current+gap.unavailable,gap.total);
    assert.ok(gap.max === null || gap.max < 80);
  }
});

test('group navigation resets bounded connection pages and investigation close restores the prior group scope', () => {
  scale.setActiveWanSetup('regional');
  let state = {...at(5),history:0,liveContext:{view:'network'},groupConnectionsPage:99};
  state = scale.navigateScope(state,'group','COASTAL-01');
  assert.equal(state.history,null);
  assert.equal(state.liveContext,null);
  assert.equal(state.view,'pop');
  assert.equal(state.domain,'Coastal');
  assert.equal(state.popId,'COASTAL-01');
  assert.equal(state.groupConnectionsPage,0);
  state = {...state,scopePage:1,groupConnectionsPage:2};
  state = scale.navigateScope(state,'investigation');
  assert.equal(state.returnView.popId,'COASTAL-01');
  assert.equal(state.returnView.scopePage,1);
  assert.equal(state.returnView.groupConnectionsPage,2);
  state = reduce(state,{type:'CLOSE'});
  assert.equal(state.view,'pop');
  assert.equal(state.groupConnectionsPage,2);
  for (const kind of ['network','domain','pop']) {
    const next = scale.navigateScope({...state,groupConnectionsPage:99},kind,kind==='domain'?'Capital':'CAPITAL-01');
    assert.equal(next.groupConnectionsPage,0);
  }
});

test('handover and bounded search describe the selected WAN and its actual group types', () => {
  for (const descriptor of scale.WAN_SETUPS) {
    scale.setActiveWanSetup(descriptor.id);
    const text = scale.networkHandoverPrefix(at(2));
    assert.ok(text.includes(descriptor.label));
    assert.ok(text.includes(`${scale.TOTAL_DEVICES.toLocaleString('en-US')} routers`));
    assert.ok(text.includes(`${scale.GROUPS.length} device groups`));
    const first = scale.searchDevices('XR-');
    assert.equal(first.total,scale.TOTAL_DEVICES);
    assert.equal(first.items.length,scale.PAGE_SIZES.search);
    const group = scale.GROUPS.find(group => group.type === 'Region') || scale.GROUPS[0];
    assert.equal(scale.searchDevices(group.label).total,group.deviceCount);
    const portPage = scale.paged(scale.deviceInterfaces('XR-P1'),0,scale.PAGE_SIZES.interfaces);
    assert.ok(portPage.items.length <= 6);
  }
});
