// Deterministic, local inventory fixtures. Every hierarchy and connection count
// is derived from the routers and links returned by a fresh factory call.
import {NODES, LINKS, TARGET} from './model.js';

export const WAN_SETUPS = Object.freeze([
  Object.freeze({id:'national', label:'National Backbone', description:'3,200 IOS XR routers across six domains and 80 PoP groups.', topology:'mesh'}),
  Object.freeze({id:'metro', label:'Metro Transport', description:'640 IOS XR routers in a transport hub with PoP and Region access groups.', topology:'hub-and-spoke'}),
  Object.freeze({id:'regional', label:'Regional WAN', description:'960 IOS XR routers across five domains of Region groups connected in a ring.', topology:'ring'}),
]);

const nationalPlacements = {
  'XR-PE-W1':'WEST-01', 'XR-P1':'WEST-01', 'XR-PE-W2':'WEST-02', 'XR-P4':'WEST-02',
  'XR-P2':'CORE-01', 'XR-P5':'CORE-01', 'XR-P3':'CORE-02', 'XR-PE-S1':'CORE-02',
  'XR-P6':'EAST-01', 'XR-PE-E1':'EAST-01', 'XR-P7':'EAST-02', 'XR-PE-E2':'EAST-02',
};

const profiles = {
  national: {
    domains:[
      ['West',480,12,'PoP',[0,1]], ['Core',640,8,'PoP',[1,1]],
      ['East',544,16,'PoP',[2,1]], ['North',416,12,'PoP',[1,0]],
      ['South',576,16,'PoP',[1,2]], ['Metro',544,16,'PoP',[2,2]],
    ],
    connections:[
      ['West','Core',128], ['Core','East',96], ['West','North',64], ['North','Core',80],
      ['Core','South',112], ['South','Metro',64], ['East','Metro',96], ['North','East',48], ['West','South',48],
    ],
  },
  metro: {
    domains:[
      ['Access',192,6,'PoP',[0,1]], ['Transport',192,6,'PoP',[1,1]],
      ['Enterprise',128,4,'Region',[2,1]], ['Campus',128,4,'Region',[1,0]],
    ],
    connections:[['Access','Transport',48], ['Transport','Enterprise',48], ['Transport','Campus',32]],
  },
  regional: {
    domains:[
      ['Coastal',192,6,'Region',[0,1]], ['Inland',192,6,'Region',[1,0]],
      ['Capital',192,6,'Region',[2,1]], ['Highlands',192,6,'Region',[2,2]], ['Southern',192,6,'Region',[0,2]],
    ],
    connections:[
      ['Coastal','Inland',32], ['Inland','Capital',32], ['Capital','Highlands',32],
      ['Highlands','Southern',32], ['Southern','Coastal',32],
    ],
  },
};

const pairKey = (from, to) => [from,to].sort().join('|');
const groupId = (domain, index) => `${domain.toUpperCase()}-${String(index+1).padStart(2,'0')}`;
const interfaceName = index => `HundredGigE0/0/0/${index}`;

function placementsFor(profile) {
  const replacements = new Map([
    ['WEST',profile.domains[0][0].toUpperCase()],
    ['CORE',profile.domains[1][0].toUpperCase()],
    ['EAST',profile.domains[2][0].toUpperCase()],
  ]);
  return Object.fromEntries(Object.entries(nationalPlacements).map(([id, group]) => {
    const [prefix, number] = group.split('-');
    return [id,`${replacements.get(prefix)}-${number}`];
  }));
}

function validateSources(nodes, links, target, placements) {
  const ids = new Set(nodes.map(node => node.id));
  if (ids.size !== nodes.length || nodes.some(node => !placements[node.id])) {
    throw new TypeError('WAN source routers must have unique, supported investigation IDs');
  }
  for (const id of Object.keys(nationalPlacements)) {
    if (!ids.has(id)) throw new TypeError(`WAN source router is missing: ${id}`);
  }
  const linkIds = new Set();
  for (const link of links) {
    if (linkIds.has(link.id) || !ids.has(link.from) || !ids.has(link.to) || link.from === link.to) {
      throw new TypeError(`Invalid WAN source link: ${link.id}`);
    }
    linkIds.add(link.id);
  }
  if (!linkIds.has(target)) throw new TypeError(`WAN target link is missing: ${target}`);
}

function attachInterfaces(devices, links, target) {
  const deviceIndex = new Map(devices.map(device => [device.id,device]));
  const selected = links.find(link => link.id === target);
  const reserved = new Map([[selected.from,0],[selected.to,1]]);
  const nextPort = new Map(devices.map(device => [device.id,0]));
  const takePort = device => {
    let port = nextPort.get(device);
    if (reserved.get(device) === port) port++;
    nextPort.set(device,port+1);
    return interfaceName(port);
  };
  const interfaces = [];
  for (const link of links) {
    link.fromInterface = link === selected ? interfaceName(0) : takePort(link.from);
    link.toInterface = link === selected ? interfaceName(1) : takePort(link.to);
    for (const [id,name,peer,peerInterface] of [
      [link.from,link.fromInterface,link.to,link.toInterface],
      [link.to,link.toInterface,link.from,link.fromInterface],
    ]) {
      const device = deviceIndex.get(id);
      device.interfaceCount++;
      interfaces.push({id:`${id}:${name}`,device:id,groupId:device.groupId,domain:device.domain,
        name,peer,peerInterface,linkId:link.id});
    }
  }
  return interfaces;
}

// Only actual links create bundles. Configured corridors supply a stable
// orientation/order, while any extra supplied source corridor is still counted.
function aggregateDomains(links, deviceIndex, configured) {
  const actual = new Map();
  for (const link of links) {
    const from = deviceIndex.get(link.from).domain, to = deviceIndex.get(link.to).domain;
    if (from === to) continue;
    const key = pairKey(from,to);
    if (!actual.has(key)) actual.set(key,{from,to,linkIds:[]});
    actual.get(key).linkIds.push(link.id);
  }
  const bundles = [];
  const append = (from,to) => {
    const key = pairKey(from,to), members = actual.get(key);
    if (!members) return;
    bundles.push({id:`${from}-${to}`,from,to,count:members.linkIds.length,linkIds:members.linkIds});
    actual.delete(key);
  };
  configured.forEach(([from,to]) => append(from,to));
  for (const {from,to} of [...actual.values()]) append(from,to);
  return bundles;
}

function aggregateGroups(links, deviceIndex, groups) {
  const order = new Map(groups.map((group,index) => [group.id,index]));
  const actual = new Map();
  for (const link of links) {
    let from = deviceIndex.get(link.from), to = deviceIndex.get(link.to);
    if (from.groupId === to.groupId) continue;
    if (order.get(from.groupId) > order.get(to.groupId)) [from,to] = [to,from];
    const key = pairKey(from.groupId,to.groupId);
    if (!actual.has(key)) actual.set(key,{id:`${from.groupId}--${to.groupId}`,
      from:from.groupId,to:to.groupId,fromDomain:from.domain,toDomain:to.domain,count:0,linkIds:[]});
    const bundle = actual.get(key);
    bundle.count++;
    bundle.linkIds.push(link.id);
  }
  return [...actual.values()];
}

/** Build a complete, independent fixture without changing any application state. */
export function createWanSetup(id = 'national', {nodes = NODES, links = LINKS, target = TARGET} = {}) {
  const descriptor = WAN_SETUPS.find(setup => setup.id === id);
  if (!descriptor) throw new RangeError(`Unknown WAN setup: ${id}`);
  const profile = profiles[id], placements = placementsFor(profile);
  validateSources(nodes,links,target,placements);
  const domains = profile.domains.map(([id,devices,groups,groupType,layout]) => ({
    id,label:id,devices,groups,groupType,layout:[...layout],
    // Retained for callers migrating from the original PoP-only inventory.
    pops:groups,
  }));
  const groups = domains.flatMap(domain => Array.from({length:domain.groups}, (_,index) => ({
    id:groupId(domain.id,index),label:`${domain.id} ${domain.groupType} ${String(index+1).padStart(2,'0')}`,
    type:domain.groupType,domain:domain.id,
    deviceCount:Math.floor(domain.devices/domain.groups)+(index<domain.devices%domain.groups?1:0),
    layout:[index%3,Math.floor((index%12)/3)],
  })));
  const devices = groups.flatMap(group => {
    const known = nodes.filter(node => placements[node.id] === group.id);
    const domainIndex = domains.findIndex(domain => domain.id === group.domain);
    const number = Number(group.id.split('-').at(-1));
    return Array.from({length:group.deviceCount}, (_,index) => ({
      id:known[index]?.id || `XR-${group.id}-${String(index+1).padStart(3,'0')}`,
      domain:group.domain,groupId:group.id,pop:group.id,
      role:known[index]?.role || (index%4===0?'PE':'P'),os:'IOS XR',kind:'Router',
      address:`10.${domainIndex+1}.${number}.${index+1}`,interfaceCount:0,
    }));
  });
  const deviceIndex = new Map(devices.map(device => [device.id,device]));
  const devicesByGroup = new Map(groups.map(group => [group.id,devices.filter(device => device.groupId === group.id)]));
  const devicesByDomain = new Map(domains.map(domain => [domain.id,devices.filter(device => device.domain === domain.id)]));
  const connections = links.map(({id,from,to}) => ({id,from,to}));
  const hasPair = new Set(connections.map(link => pairKey(link.from,link.to)));
  const add = (id,from,to,unique = true) => {
    const key = pairKey(from,to);
    if (from === to || (unique && hasPair.has(key))) return;
    hasPair.add(key);
    connections.push({id,from,to});
  };
  // Rings and local chords make every router part of its actual group fabric.
  for (const group of groups) {
    const members = devicesByGroup.get(group.id);
    members.forEach((device,index) => add(`R-${group.id}-${index+1}`,device.id,members[(index+1)%members.length].id));
    members.filter((_,index) => index%4===0).forEach((device,index) =>
      add(`C-${group.id}-${index+1}`,device.id,members[(index*4+Math.floor(members.length/2))%members.length].id));
  }
  for (const domain of domains) {
    const localGroups = groups.filter(group => group.domain === domain.id);
    localGroups.forEach((group,index) => {
      for (let member = 0; member<4; member++) {
        add(`P-${group.id}-${member+1}`,devicesByGroup.get(group.id)[member].id,
          devicesByGroup.get(localGroups[(index+1)%localGroups.length].id)[member].id);
      }
    });
  }
  for (const [from,to,count] of profile.connections) {
    const existing = connections.filter(link => pairKey(deviceIndex.get(link.from).domain,deviceIndex.get(link.to).domain) === pairKey(from,to)).length;
    const a = devicesByDomain.get(from), b = devicesByDomain.get(to);
    for (let index = existing; index<count; index++) {
      // Parallel physical circuits are allowed, as in the original backbone.
      add(`B-${from}-${to}-${index+1}`,a[(index*7)%a.length].id,b[(index*11)%b.length].id,false);
    }
  }
  const interfaces = attachInterfaces(devices,connections,target);
  const main = deviceIndex.get('XR-P1'), critical = deviceIndex.get('XR-PE-E2'), transit = deviceIndex.get('XR-P2');
  return {...descriptor,domains,groups,devices,links:connections,
    bundles:aggregateDomains(connections,deviceIndex,profile.connections),
    groupBundles:aggregateGroups(connections,deviceIndex,groups),interfaces,
    monitoringContext:{mainDomain:main.domain,criticalDomain:critical.domain,mainGroup:main.groupId,
      criticalGroup:critical.groupId,transitDomain:transit.domain,transitGroup:transit.groupId,
      target,targetInterface:connections.find(link => link.id === target).fromInterface},
  };
}
