import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {NODES, LINKS, TARGET, INTERFACE} from '../src/features/wan/model/model.js';
import {WAN_SETUPS, createWanSetup} from '../src/features/wan/model/wan-setups.js';

const pairKey = (from,to) => [from,to].sort().join('|');
const hash = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');

for (const descriptor of WAN_SETUPS) {
  test(`${descriptor.label}: the domain → device group → router hierarchy is complete and disjoint`, () => {
    const setup = createWanSetup(descriptor.id,{nodes:NODES,links:LINKS,target:TARGET});
    assert.ok(setup.domains.length >= 3);
    for (const collection of [setup.domains,setup.groups,setup.devices,setup.links,setup.interfaces]) {
      assert.equal(new Set(collection.map(item => item.id)).size,collection.length,'unique IDs in each inventory');
    }
    assert.equal(new Set(setup.devices.map(device => device.address)).size,setup.devices.length);
    const domains = new Map(setup.domains.map(domain => [domain.id,domain]));
    const groups = new Map(setup.groups.map(group => [group.id,group]));
    for (const domain of setup.domains) {
      const domainGroups = setup.groups.filter(group => group.domain === domain.id);
      assert.equal(domain.groups,domainGroups.length);
      assert.equal(domain.devices,setup.devices.filter(device => device.domain === domain.id).length);
      assert.ok(domainGroups.length > 0);
      assert.equal(domain.devices,domainGroups.reduce((count,group) => count+group.deviceCount,0));
    }
    for (const group of setup.groups) {
      assert.ok(domains.has(group.domain));
      assert.ok(['PoP','Region'].includes(group.type));
      assert.equal(group.deviceCount,setup.devices.filter(device => device.groupId === group.id).length);
      assert.ok(group.deviceCount > 0);
    }
    for (const device of setup.devices) {
      assert.equal(device.domain,groups.get(device.groupId)?.domain);
      assert.equal(device.pop,device.groupId);
      assert.equal(device.kind,'Router');
      assert.equal(device.os,'IOS XR');
      assert.ok(device.interfaceCount > 0);
    }
    for (const node of NODES) assert.equal(setup.devices.filter(device => device.id === node.id).length,1);
    assert.equal(setup.devices.find(device => device.id === 'XR-P1').domain,setup.monitoringContext.mainDomain);
    assert.equal(setup.devices.find(device => device.id === 'XR-PE-E2').domain,setup.monitoringContext.criticalDomain);
    assert.equal(setup.devices.find(device => device.id === 'XR-P2').domain,setup.monitoringContext.transitDomain);
    assert.notEqual(setup.monitoringContext.mainDomain,setup.monitoringContext.transitDomain);
    assert.notEqual(setup.monitoringContext.transitDomain,setup.monitoringContext.criticalDomain);
  });

  test(`${descriptor.label}: domain and group bundles reconcile exactly with real link membership`, () => {
    const setup = createWanSetup(descriptor.id);
    const devices = new Map(setup.devices.map(device => [device.id,device]));
    const expectedDomains = new Map(), expectedGroups = new Map();
    for (const link of setup.links) {
      assert.ok(devices.has(link.from) && devices.has(link.to));
      assert.notEqual(link.from,link.to);
      const from = devices.get(link.from), to = devices.get(link.to);
      for (const [expected,a,b] of [[expectedDomains,from.domain,to.domain],[expectedGroups,from.groupId,to.groupId]]) {
        if (a === b) continue;
        const key = pairKey(a,b);
        if (!expected.has(key)) expected.set(key,[]);
        expected.get(key).push(link.id);
      }
    }
    for (const [bundles,expected] of [[setup.bundles,expectedDomains],[setup.groupBundles,expectedGroups]]) {
      assert.equal(bundles.length,expected.size);
      const memberIds = [];
      for (const bundle of bundles) {
        const members = expected.get(pairKey(bundle.from,bundle.to));
        assert.ok(members?.length > 0,'no invented bundle');
        assert.equal(bundle.count,members.length);
        assert.deepEqual(bundle.linkIds,members);
        memberIds.push(...bundle.linkIds);
      }
      assert.equal(new Set(memberIds).size,memberIds.length,'every member is counted in exactly one bundle at its level');
      assert.equal(memberIds.length,[...expected.values()].reduce((count,members) => count+members.length,0));
    }
    assert.ok(setup.groupBundles.some(bundle => bundle.fromDomain !== bundle.toDomain));
    for (const source of LINKS) {
      const actual = setup.links.find(link => link.id === source.id);
      assert.deepEqual({id:actual.id,from:actual.from,to:actual.to},source);
    }
  });

  test(`${descriptor.label}: every physical circuit has two unique, reciprocal router interfaces`, () => {
    const setup = createWanSetup(descriptor.id);
    assert.equal(setup.interfaces.length,setup.links.length*2);
    const interfaces = new Map(setup.interfaces.map(port => [port.id,port]));
    const incidentCounts = new Map(setup.devices.map(device => [device.id,0]));
    for (const link of setup.links) {
      const from = interfaces.get(`${link.from}:${link.fromInterface}`);
      const to = interfaces.get(`${link.to}:${link.toInterface}`);
      assert.ok(from && to);
      assert.equal(from.linkId,link.id);
      assert.equal(to.linkId,link.id);
      assert.equal(from.peer,link.to);
      assert.equal(to.peer,link.from);
      assert.equal(from.peerInterface,to.name);
      assert.equal(to.peerInterface,from.name);
      incidentCounts.set(link.from,incidentCounts.get(link.from)+1);
      incidentCounts.set(link.to,incidentCounts.get(link.to)+1);
    }
    for (const device of setup.devices) {
      const ports = setup.interfaces.filter(port => port.device === device.id);
      assert.equal(ports.length,incidentCounts.get(device.id));
      assert.equal(device.interfaceCount,ports.length);
      assert.equal(new Set(ports.map(port => port.name)).size,ports.length);
      ports.forEach(port => {
        assert.equal(port.domain,device.domain);
        assert.equal(port.groupId,device.groupId);
      });
    }
    const target = setup.links.find(link => link.id === TARGET);
    assert.equal(target.from,'XR-P1');
    assert.equal(target.to,'XR-P2');
    assert.equal(target.fromInterface,INTERFACE);
    assert.equal(target.toInterface,'HundredGigE0/0/0/1');
  });
}

test('the default national setup preserves the original inventory, physical links, and nine corridors', () => {
  const setup = createWanSetup();
  assert.equal(setup.id,'national');
  assert.equal(setup.devices.length,3200);
  assert.equal(setup.groups.length,80);
  assert.equal(setup.links.length,4939);
  assert.equal(setup.interfaces.length,9878);
  assert.deepEqual(setup.domains.map(domain => domain.id),['West','Core','East','North','South','Metro']);
  assert.equal(setup.bundles.length,9);
  assert.equal(setup.bundles.reduce((count,bundle) => count+bundle.count,0),736);
  assert.deepEqual(setup.bundles.map(({from,to,count}) => [from,to,count]),[
    ['West','Core',128], ['Core','East',96], ['West','North',64], ['North','Core',80],
    ['Core','South',112], ['South','Metro',64], ['East','Metro',96], ['North','East',48], ['West','South',48],
  ]);
  // Digests were recorded from the original, unchanged scale.js fixture.
  assert.equal(hash(setup.links.map(({id,from,to}) => ({id,from,to}))),
    '185c31043dfd2a06568c5ff17601829e74637d5378aad86be9dbdea3df28bc98');
  assert.equal(hash(setup.devices.map(({id,domain,pop,role,os,address}) => ({id,domain,pop,role,os,address}))),
    'ff7d0b5f3bec4b06c531580cb0c4d86616f555c7b099efe6873be04971509e01');
});

test('the three examples differ in inventory, grouping, and actual domain graph', () => {
  const national = createWanSetup('national'), metro = createWanSetup('metro'), regional = createWanSetup('regional');
  assert.equal(WAN_SETUPS.length,3);
  assert.deepEqual([national.devices.length,metro.devices.length,regional.devices.length],[3200,640,960]);
  assert.deepEqual([...new Set(national.groups.map(group => group.type))],['PoP']);
  assert.deepEqual([...new Set(metro.groups.map(group => group.type))].sort(),['PoP','Region']);
  assert.deepEqual([...new Set(regional.groups.map(group => group.type))],['Region']);
  const degree = setup => setup.domains.map(domain => setup.bundles.filter(bundle => [bundle.from,bundle.to].includes(domain.id)).length);
  assert.deepEqual(degree(metro),[1,3,1,1]);
  assert.deepEqual(degree(regional),[2,2,2,2,2]);
  assert.equal(metro.topology,'hub-and-spoke');
  assert.equal(regional.topology,'ring');
});

test('factory calls are deterministic and own independent mutable inventories without changing source data', () => {
  const source = JSON.stringify({nodes:NODES,links:LINKS});
  for (const {id} of WAN_SETUPS) {
    const first = createWanSetup(id), second = createWanSetup(id);
    assert.deepEqual(first,second);
    first.domains[0].layout[0] = 99;
    first.groups[0].label = 'Changed';
    first.devices[0].address = 'Changed';
    first.links[0].fromInterface = 'Changed';
    first.bundles[0].linkIds.push('Changed');
    first.interfaces[0].name = 'Changed';
    assert.deepEqual(createWanSetup(id),second);
  }
  assert.equal(JSON.stringify({nodes:NODES,links:LINKS}),source);
  assert.throws(() => createWanSetup('unknown'),/Unknown WAN setup/);
});
