import type { Landscape } from './landscapes.ts';
import { model, piece, type Piece } from './world-models.ts';
import { Grid } from './rules.ts';
import { districts } from './districts.ts';

type Point = readonly [number, number];
type Layout = {
  trails: readonly (readonly Point[])[];
  width: number;
  groundShape?: 'ring' | 'islands' | 'tiles' | 'planks';
};
const layouts: Record<Exclude<Landscape['layout'], 'grid'>, Layout> = {
  valley: { width:14, trails:[[[-94,38],[-42,10],[-10,0],[34,6],[94,34]], [[-85,-53],[-38,-33],[17,-47],[86,-65]], [[-88,81],[-27,63],[37,67],[91,81]]] },
  oasis: { width:8, groundShape:'ring', trails:[[[-82,27],[-44,18],[-26,-11],[-43,-49],[-84,-65]], [[-34,-84],[22,-76],[53,-38],[72,1],[88,45]], [[-65,71],[-21,51],[21,46],[69,70]]] },
  river: { width:19, trails:[[[-96,40],[-48,29],[-14,2],[28,-17],[88,1]], [[-94,-1],[-51,-9],[-23,-38],[35,-60],[95,-39]], [[-83,79],[-33,69],[10,53],[61,49],[91,69]]] },
  floes: { width:13, groundShape:'islands', trails:[[[-88,29],[-53,18],[-17,-7],[27,13],[84,-4]], [[-82,-51],[-29,-66],[10,-47],[55,-65],[89,-49]], [[-78,77],[-37,59],[12,78],[54,58],[87,81]]] },
  crater: { width:9, groundShape:'ring', trails:[[[-93,18],[-55,7],[-35,-26],[-12,-54],[31,-76],[79,-63]], [[-80,55],[-29,64],[23,57],[58,37],[82,12]], [[-76,-63],[-36,-82],[18,-85],[58,-78],[91,-37]]] },
  fleet: { width:3, trails:[[[-88,-8],[85,-8]], [[-88,-62],[87,-62]], [[-88,63],[89,63]]] },
  quays: { width:16, trails:[[[-93,10],[-31,10],[-31,-39],[23,-39],[23,-9],[83,-9]], [[-87,59],[90,59]], [[-93,-77],[90,-77]]] },
  bay: { width:12, groundShape:'islands', trails:[[[-87,3],[-53,29],[-19,42],[34,32],[78,2]], [[-91,-58],[-56,-27],[-9,-32],[39,-53],[86,-67]], [[-81,71],[-31,77],[36,72],[82,54]]] },
  reef: { width:11, groundShape:'islands', trails:[[[-89,29],[-61,8],[-27,-8],[1,-2],[39,22],[86,40]], [[-79,-51],[-32,-66],[10,-74],[49,-56],[87,-25]], [[-82,80],[-32,63],[11,72],[51,53],[81,77]]] },
  canals: { width:15, trails:[[[-91,1],[88,1]], [[-91,-54],[88,-54]], [[-57,83],[-57,38],[7,38],[7,79],[82,79]]] },
  channel: { width:6, groundShape:'islands', trails:[[[-92,-2],[-47,-2],[-14,-18],[32,-22],[87,-16]], [[-87,58],[-38,42],[20,56],[86,47]], [[-91,-62],[-38,-64],[22,-76],[88,-58]]] },
  forum: { width:16, trails:[[[-93,1],[90,1]], [[-71,-65],[71,-65],[71,-21]], [[-76,78],[-76,46],[77,46],[77,78]]] },
  terraces: { width:24, trails:[[[-92,-2],[92,-2]], [[-77,-44],[78,-44]], [[-64,53],[68,53]]] },
  courtyard: { width:10, trails:[[[-93,19],[-39,19],[-39,-14],[40,-14],[40,19],[91,19]], [[-84,-65],[-47,-65],[45,-65],[87,-65]], [[-64,79],[-64,48],[67,48],[67,79]]] },
  fjord: { width:14, trails:[[[-92,-5],[-56,-5],[-22,10],[37,6],[87,-15]], [[-91,-65],[-43,-46],[21,-63],[81,-65]], [[-91,57],[-45,67],[27,50],[85,65]]] },
  alleys: { width:7, trails:[[[-90,19],[-52,19],[-52,-9],[11,-9],[11,19],[87,19]], [[-85,-46],[-61,-73],[14,-73],[47,-46],[88,-46]], [[-91,68],[-23,68],[-23,40],[38,40],[38,78],[86,78]]] },
  branches: { width:6, trails:[[[-90,62],[-56,34],[-22,7],[-2,-17],[21,-51],[49,-81]], [[-88,-56],[-50,-35],[-2,-17],[35,-27],[86,-52]], [[-78,77],[-24,70],[12,37],[33,13],[86,13]]] },
  leaves: { width:18, groundShape:'islands', trails:[[[-91,23],[-59,12],[-24,-1],[21,18],[87,3]], [[-86,-53],[-42,-68],[4,-53],[41,-57],[89,-40]], [[-84,74],[-39,59],[17,74],[69,59]]] },
  checks: { width:7, groundShape:'tiles', trails:[[[-90,13],[-30,13],[-30,-18],[32,-18],[32,13],[91,13]], [[-89,-64],[90,-64]], [[-88,64],[88,64]]] },
  workbench: { width:11, groundShape:'planks', trails:[[[-91,-12],[91,-12]], [[-78,-77],[-78,-55],[75,-55],[75,-79]], [[-86,51],[83,51]]] },
  tracks: { width:4, trails:[[[-92,2],[-45,2],[-31,-25],[38,-25],[57,2],[91,2]], [[-88,-57],[88,-57]], [[-84,75],[-52,52],[51,52],[89,75]]] },
  paper: { width:19, trails:[[[-91,4],[-62,-9],[-16,-3],[30,-28],[89,-12]], [[-91,-65],[-39,-65],[15,-81],[87,-61]], [[-90,52],[-31,62],[12,46],[88,65]]] },
  craters: { width:5, groundShape:'ring', trails:[[[-89,19],[-50,6],[-19,7],[15,-15],[89,-15]], [[-91,-64],[-46,-74],[16,-59],[88,-66]], [[-90,62],[-29,61],[14,77],[87,64]]] },
  canyon: { width:12, trails:[[[0,0],[0,49],[0,89]], [[0,0],[-39,22],[-81,43]],
    [[0,0],[-43,-28],[-76,-57]], [[0,0],[39,-29],[79,-57]], [[0,0],[44,18],[87,38]]] },
  ring: { width:12, groundShape:'ring', trails:[[[-83,40],[-57,61],[0,71],[59,59],[83,29]], [[-85,-33],[-59,-61],[0,-71],[61,-59],[84,-32]], [[-82,0],[0,0],[83,0]]] },
  neon: { width:9, trails:[[[-95,-4],[92,-4]], [[-61,-90],[-61,89]], [[53,-89],[53,89]], [[-91,54],[92,54]]] },
  groves: { width:13, groundShape:'islands', trails:[[[-89,21],[-46,8],[-15,18],[22,-17],[58,-9],[90,-20]], [[-83,-65],[-36,-48],[13,-72],[64,-61],[89,-53]], [[-85,77],[-43,62],[12,74],[55,49],[90,76]]] },
  debris: { width:6, trails:[[[-92,16],[-52,-5],[-21,-9],[22,5],[60,-17],[92,-11]], [[-91,-62],[-54,-52],[-5,-76],[35,-54],[87,-65]], [[-87,80],[-33,60],[15,75],[51,45],[89,57]]] },
};

export const mapScale = .8;
const startZ = 11.25;
export const spawn = [0, startZ * mapScale] as const;
export type Patrol = { x: number; z: number; rx: number; rz: number; speed: number; phase: number; stride?: boolean; hover?: number };
type ObjectPlan = { x: number; z: number; tier: number; radius: number; points: number; yaw: number; name: string; pieces: Piece[]; patrol?: Patrol; landmark?: boolean };
type WorldPlan = { scenery: Piece[]; objects: ObjectPlan[]; greenPlots: Piece[]; isLand(x: number, z: number): boolean };
const modelSizes: readonly [number, string][] = [
  [.29, 'seed drop clip screw nut shell starfish pencil fruit stone jar urn battery crop'],
  [.49, 'barrel sack chest crate rope bollard lily shield urchin cup paper cloth panel cutlery signal beacon sign brick toy ice'],
  [.72, 'planter ant beetle fish walker woman roman roman-woman robot coral solar wrench toolbox'],
  [1.05, 'leaf palm fir crystal kelp column obelisk statue bench buoy supply keyboard basket'],
  [1.55, 'handcart cart carriage rover train drone longboat sail arch stall flower root vise tug'],
  [2.7, 'awning cabin stilt longhouse palazzo tower shuttle module dome airlock temple dune ridge'],
  [4.3, 'cargo breaker galleon wreck crane arena peak iceberg banyan keep caravan station spires'],
  [5.8, 'pyramid nest volcano neon'],
];
const footprintByModel = new Map(modelSizes.flatMap(([radius, names]) => names.split(' ').map(name => [name, radius] as const)));
const points = [6, 14, 28, 52, 90, 220];
const accentWhite = 0xf3ebd7;
const riverBlue = 0x3b8398;
const trafficByWorld: Record<Exclude<Landscape['id'], 'harbor'>, readonly string[]> = {
  alps:['walker','woman'], sahara:['walker','woman','carriage'], amazon:['walker','longboat','woman'],
  arctic:['walker','rover','breaker'], volcano:['walker','woman'],
  sail:['sail','galleon'], cargo:['cargo','walker','woman'], pirate:['longboat','galleon'],
  reef:['fish'], venice:['walker','longboat','woman'], icebreaker:['cargo','breaker'],
  egypt:['woman','longboat','handcart','walker'], rome:['roman','handcart','roman-woman','carriage'],
  greece:['woman','handcart','walker','carriage'], castle:['walker','carriage','woman','handcart'],
  viking:['walker','longboat','handcart','woman'], bazaar:['walker','handcart','woman','carriage'],
  ants:['ant','beetle'], garden:['beetle','ant'], picnic:['ant','beetle'], bench:['beetle'],
  toys:['toy','train'], desk:['ant','beetle'],
  moon:['robot','rover','shuttle','drone'], mars:['robot','drone','shuttle','robot'],
  ring:['robot','drone','shuttle'], neon:['walker','woman','drone','robot'],
  alien:['robot','drone','shuttle'], orbit:['robot','drone','shuttle'],
};

export const landActors = new Set(['walker','woman','roman','roman-woman','handcart','carriage','cart','rover','train']);
export const waterActors = new Set(['sail','galleon','longboat','cargo','breaker','fish','wreck','buoy','coral','shell','lily','iceberg','tug']);

const extras: Record<Exclude<Landscape['id'], 'harbor'>, readonly string[][]> = {
  alps:[['stone','seed','sack'],['fir','barrel','planter'],['fir','cabin']],
  sahara:[['jar','stone','sack'],['palm','jar','barrel'],['dune','cabin']],
  amazon:[['seed','stone','drop'],['leaf','fruit','palm'],['palm','banyan','stilt']],
  arctic:[['ice','stone','crate'],['ice','supply','barrel'],['cabin','beacon','supply']],
  volcano:[['stone','crystal','seed'],['crystal','stone','fir'],['ridge','peak','cabin']],
  sail:[['buoy','rope','crate'],['barrel','buoy','crate'],['sail','galleon']],
  cargo:[['crate','rope','bollard','buoy'],['barrel','supply','buoy'],['cargo','crane']],
  pirate:[['barrel','rope','shell','crate'],['chest','barrel','crate'],['sail','longboat','galleon']],
  reef:[['shell','coral'],['coral','shell'],['coral','wreck']],
  venice:[['jar','rope','bollard'],['urn','barrel','planter'],['longboat','arch']],
  icebreaker:[['ice','buoy','rope'],['ice','barrel','crate'],['iceberg','breaker']],
  egypt:[['jar','sack','stone'],['palm','urn','barrel'],['obelisk','column','stall']],
  rome:[['urn','sack','jar','rope'],['stall','column','barrel','planter'],['handcart','arch','awning']],
  greece:[['stone','urn','jar'],['column','planter','barrel'],['arch','statue','stall']],
  castle:[['barrel','sack','rope'],['chest','planter','barrel'],['handcart','awning','cabin']],
  viking:[['barrel','rope','stone'],['shield','sack','chest'],['longhouse','longboat','handcart']],
  bazaar:[['jar','sack','rope'],['cloth','urn','planter'],['stall','awning','handcart']],
  ants:[['seed','stone','drop'],['leaf','ant','fruit'],['ant','beetle','root']],
  garden:[['drop','seed','stone'],['leaf','fruit','flower'],['flower','ant','beetle']],
  picnic:[['seed','fruit','cup'],['leaf','fruit','cup'],['basket','flower','beetle']],
  bench:[['nut','screw','clip'],['toolbox','panel','wrench'],['vise','toolbox','wrench']],
  toys:[['brick','toy','pencil'],['brick','toy','panel'],['toy','train','basket']],
  desk:[['clip','screw','pencil'],['paper','pencil','cup'],['keyboard','panel','basket']],
  moon:[['stone','battery','signal'],['beacon','supply','solar'],['rover','drone','module']],
  mars:[['stone','battery','signal'],['beacon','supply','solar'],['solar','drone','module']],
  ring:[['battery','signal','beacon'],['supply','solar','panel'],['drone','module','shuttle']],
  neon:[['signal','beacon','crate'],['sign','panel','supply'],['drone','sign','tower']],
  alien:[['seed','crystal','drop'],['crystal','flower','leaf'],['crystal','flower','drone']],
  orbit:[['screw','battery','panel'],['panel','supply','solar'],['solar','drone','shuttle']],
};

const wetExtras: Partial<Record<Landscape['id'], readonly [readonly string[], readonly string[]]>> = {
  sahara:[['lily'],['lily']],
  amazon:[['lily','leaf','crate'],['longboat']],
  arctic:[['ice','buoy'],['iceberg','breaker']],
  sail:[['buoy','rope','crate','barrel'],['sail','galleon','wreck']],
  cargo:[['buoy','rope','crate'],['tug','cargo']],
  pirate:[['barrel','rope','chest','crate'],['longboat','sail','galleon','wreck']],
  reef:[['shell','starfish','urchin'],['coral','wreck','kelp']],
  venice:[['buoy','rope','crate'],['longboat']],
  icebreaker:[['ice','buoy'],['iceberg','breaker','cargo']],
  egypt:[['lily','crate'],['longboat']],
  viking:[['barrel','rope','crate'],['longboat']],
};
function covers(p: Piece, x: number, z: number, margin: number) {
  const dx = x - p.x, dz = z - p.z;
  const cos = Math.cos(p.yaw), sin = Math.sin(p.yaw);
  const localX = dx * cos - dz * sin, localZ = dx * sin + dz * cos;
  const halfW = p.w / 2 + margin, halfD = p.d / 2 + margin;
  if (halfW <= 0 || halfD <= 0) return false;
  if (p.shape === 'pole') return (localX / halfW) ** 2 + (localZ / halfD) ** 2 < .8;
  return Math.abs(localX) <= halfW && Math.abs(localZ) <= halfD;
}

function strip(color: number, from: Point, to: Point, width: number, y: number) {
  const dx = to[0] - from[0], dz = to[1] - from[1];
  return piece(color, (from[0] + to[0]) / 2, y, (from[1] + to[1]) / 2, width, .016,
    Math.hypot(dx, dz) + width * .35, 'box', Math.atan2(dx, dz));
}

function sample(trail: readonly Point[], fraction: number) {
  const segments = trail.slice(1).map((end, i) => ({ start: trail[i], end, length: Math.hypot(end[0] - trail[i][0], end[1] - trail[i][1]) }));
  const length = segments.reduce((sum, segment) => sum + segment.length, 0);
  let remaining = fraction * length;
  for (const { start, end, length: segmentLength } of segments) {
    if (remaining <= segmentLength) {
      const t = remaining / segmentLength;
      const dx = (end[0] - start[0]) / segmentLength;
      const dz = (end[1] - start[1]) / segmentLength;
      return { x:start[0] + (end[0] - start[0]) * t, z:start[1] + (end[1] - start[1]) * t, dx, dz };
    }
    remaining -= segmentLength;
  }
  throw new Error('Landscape trail fraction is out of range');
}

export function planWorld(world: Landscape): WorldPlan {
  const {id} = world;
  if (id === 'harbor' || world.layout === 'grid') throw new Error('The harbor has its own generator');
  const layout = layouts[world.layout];
  let state = [...world.id].reduce((hash, char) => (Math.imul(hash, 31) + char.charCodeAt(0)) >>> 0, 2166136261);
  const random = () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
  const scenery: Piece[] = [];
  const greenPlots: Piece[] = [];
  const land: Piece[] = [];
  const water: Piece[] = [];
  const walls: Piece[] = [];
  const waterMap = world.group === 'Wasser' || ['arctic','viking'].includes(world.id);
  const addSurface = (p: Piece, surface: Piece[]) => { scenery.push(p); surface.push(p); };
  const onLand = (x: number, z: number, margin = 0) =>
    (!waterMap || land.some(p => covers(p,x,z,-margin))) && !water.some(p => covers(p,x,z,margin));
  if (layout.groundShape === 'tiles') {
    for (let x = -96; x <= 96; x += 12) for (let z = -96; z <= 96; z += 12) {
      scenery.push(piece((x + z) % 24 === 0 ? world.detail : world.ground, x, .019, z, 12, .016, 12));
    }
  } else if (layout.groundShape === 'planks') {
    for (let z = -104; z <= 104; z += 8) scenery.push(piece(z % 16 ? world.detail : world.ground, 0, .014, z, 212, .018, 7.87));
  } else if (layout.groundShape === 'ring') {
    const diameter = world.layout === 'ring' ? 151 : world.layout === 'oasis' ? 31 : 63;
    const feature = piece(world.layout === 'oasis' ? 0x498b96 : world.detail, world.layout === 'oasis' ? 5 : 0,
      .014, -12, diameter, .055, diameter, world.layout === 'oasis' ? 'pole' : 'ring');
    if (world.layout === 'oasis') addSurface(feature,water);
    else scenery.push(feature);
  }
  const isRiver = world.layout === 'river';
  const trails = world.id === 'egypt'
    ? [[[-94,34],[-41,19],[-16,8],[21,3],[87,9]], ...layout.trails.slice(1)] as readonly (readonly Point[])[]
    : layout.trails;
  if (world.id === 'cargo') {
    for (const [x,z,w,d] of [[-43,31,39,28],[39,52,37,25],[35,-17,43,29]]) {
      addSurface(piece(world.detail,x,.04,z,w,.064,d),land);
    }
    addSurface(strip(0x918985,[-25,34],[23,47],5.2,.09),land);
    addSurface(strip(0x918985,[36,39],[35,-2],5.2,.09),land);
  }
  if (world.layout === 'fjord') {
    for (const side of [-1,1]) addSurface(piece(world.detail,0,.026,side * 94,195,.032,19),land);
  }
  for (const [route, trail] of trails.entries()) {
    for (let i = 1; i < trail.length; i++) {
      if (['fleet','reef','channel'].includes(world.layout)) {
        scenery.push(strip(0x387590, trail[i - 1], trail[i], layout.width, .05));
      } else {
        addSurface(strip(world.detail, trail[i - 1], trail[i], layout.width, .05),land);
      }
    }
    if (isRiver && route === 0) {
      for (let i = 1; i < trail.length; i++) addSurface(strip(riverBlue, trail[i - 1], trail[i], layout.width * .6, .075),water);
    }
    for (let i = 1; i < 14; i++) {
      const {x, z, dx, dz} = sample(trail, i / 14);
      if (layout.groundShape === 'islands') {
        const size = 7 + random() * 13;
        const island = piece(world.detail, x + dx * 2, .062, z + dz * 2, size, .05, size * .77, 'pole', random());
        if (world.layout === 'reef') scenery.push(island);
        else addSurface(island,land);
      }
      const track = world.layout === 'tracks';
      if (track || world.group === 'Science-Fiction' || world.layout === 'fleet' || world.layout === 'forum' || (isRiver && route === 0)) {
        scenery.push(piece(world.accent, x, .071, z, track ? 5.8 : 1.75, .022, .27, 'box', Math.atan2(dx,dz)));
        if (track) for (const side of [-1, 1]) {
          scenery.push(piece(accentWhite, x + dz * side * 1.72, .085, z - dx * side * 1.72, .14, .024, 13.5, 'box', Math.atan2(dx,dz)));
        }
      }
    }
  }
  if (world.layout === 'courtyard') {
    scenery.push(piece(0xc7bba0, 0, .035, -21, 54, .03, 49));
    for (const x of [-26,26]) walls.push(piece(world.detail, x, 1.45, -21, 2.8, 2.9, 48));
    for (const x of [-16,16]) walls.push(piece(world.detail, x, 1.45, -45, 22, 2.9, 2.8));
    for (const x of [-16,16]) walls.push(piece(world.detail, x, 1.45, 3, 22, 2.9, 2.8));
  }

  const objects: ObjectPlan[] = [];
  const occupied = new Grid<ObjectPlan>(5);
  const alternatives = (tier: number, x: number, z: number) => {
    const wet = !onLand(x,z);
    const primary = world.models[tier - 1];
    const options = [primary, ...(extras[id][tier - 1] ?? [])];
    if (wet) {
      const alternatives = wetExtras[world.id];
      if (!alternatives) throw new Error(`Missing water palette for ${world.name}`);
      const palette = alternatives[tier <= 2 ? 0 : 1];
      return palette.includes(primary) ? [primary, ...palette] : palette;
    }
    const dry = options.filter(name => !waterActors.has(name));
    if (dry.length) return dry;
    const local = world.models.slice(0,tier).reverse().find(name => !waterActors.has(name))
      ?? world.models.find(name => !waterActors.has(name));
    if (!local) throw new Error(`Missing land palette for ${world.name}`);
    return [local];
  };
  const add = (x: number, z: number, tier: number, yaw = 0, name?: string, patrol?: Patrol, landmark = false) => {
    if (Math.abs(x) > 99 || Math.abs(z) > 99) return false;
    if (!name) {
      const options = alternatives(tier,x,z);
      name = options[(Math.round(Math.abs(x * 13 + z * 17))) % options.length];
    }
    const size = footprintByModel.get(name);
    if (size === undefined) throw new Error(`Missing footprint for ${name}`);
    const radius = landmark ? 12.35 : size;
    if (name !== 'tower' && walls.some(wall => covers(wall,x,z,radius / mapScale))) return false;
    x *= mapScale;
    z *= mapScale;
    for (const other of occupied.near(x,z,radius + 12.35 + .35)) {
      if ((x - other.x) ** 2 + (z - other.z) ** 2 < (radius + other.radius + .35) ** 2) return false;
    }
    if (patrol) patrol = { ...patrol, x:patrol.x * mapScale, z:patrol.z * mapScale,
      rx:patrol.rx * mapScale, rz:patrol.rz * mapScale };
    const object = { x, z, tier, radius, yaw, name, points:points[tier - 1], patrol, landmark,
      pieces:model(name, world.accent, world.detail) };
    objects.push(object);
    occupied.add(object);
    return true;
  };
  const landmark = world.models[5];
  const landmarkSites: Point[] = [[-8,-17],[16,-24],[-17,-27],[0,-35],[-44,23],
    ...trails.flatMap(trail => [.38,.48,.58,.68].map(t => {
      const {x,z} = sample(trail,t);
      return [x,z] as Point;
    }))];
  for (const [x,z] of landmarkSites) {
    const needsWater = waterActors.has(landmark);
    if (onLand(x,z) === needsWater || !add(x,z,6,.24,landmark,undefined,true)) continue;
    if (waterMap && !needsWater) {
      addSurface(piece(world.detail,x,.055,z,23,.04,23, world.id === 'arctic' ? 'pole' : 'box'),land);
    }
    break;
  }
  for (const wall of walls) {
    const longX = wall.w > wall.d;
    const span = Math.max(wall.w,wall.d);
    const crenels = [];
    for (let offset = -span / 2 + 2; offset < span / 2; offset += 4) {
      crenels.push(piece(world.detail,longX ? offset : 0,3.2,longX ? 0 : offset,
        longX ? 1.6 : 2.2,.65,longX ? 2.2 : 1.6));
    }
    objects.push({x:wall.x * mapScale,z:wall.z * mapScale,tier:6,yaw:0,name:'wall',
      radius:Math.hypot(wall.w,wall.d) * mapScale / 2,points:160,
      pieces:[{...wall,x:0,z:0},...crenels]});
  }
  if (['valley','canyon','fjord'].includes(world.layout)) {
    for (const side of [-1,1]) for (let x = -76; x <= 76; x += 38) {
      const z = side * 92;
      const mass = {x:x * mapScale,z:z * mapScale,tier:6,radius:x === 0 ? 15.8 : 8.2,points:x === 0 ? 340 : 115,
        yaw:side * .7,name:'massif',pieces:model('massif',world.layout === 'valley' ? 0xe7f2f6 : world.accent,world.detail)};
      objects.push(mass);
      occupied.add(mass);
    }
  }
  for (const [kind,x,z,yaw] of districts[id]) {
    const isGarden = kind === 'green';
    const platform = piece(isGarden ? (world.id === 'reef' ? 0x40856f : 0x688a52) :
      kind === 'market' ? world.detail : 0x7c8079,x,.082,z,20,.04,18,'box',yaw);
    if (waterMap && world.id !== 'reef') addSurface(platform,land);
    else scenery.push(platform);
    if (isGarden) greenPlots.push(platform);
    const cos = Math.cos(yaw), sin = Math.sin(yaw);
    if (isGarden && (world.group === 'Science-Fiction' || ['arctic','icebreaker'].includes(world.id))) {
      for (const side of [-1,1]) {
        scenery.push(piece(0x6da9a7,x + cos * side * 9.5,.37,z - sin * side * 9.5,.22,.56,18,'box',yaw));
        scenery.push(piece(0x6da9a7,x + sin * side * 8.6,.37,z + cos * side * 8.6,20,.56,.22,'box',yaw));
      }
    }
    for (let row = -2; row <= 2; row++) {
      for (let col = -3; col <= 3; col++) {
        const dx = col * 2.4, dz = row * 3;
        const px = x + dx * cos + dz * sin, pz = z - dx * sin + dz * cos;
        if (isGarden) add(px,pz,1,yaw,world.id === 'reef' ? 'kelp' : 'crop');
        else if (Math.abs(col) < 3) add(px,pz,row % 2 === 0 ? 2 : 1,yaw);
      }
    }
  }
  if (world.layout === 'courtyard') {
    for (const x of [-26,26]) for (const z of [-45,3]) add(x,z,5,0,'tower');
    for (const x of [-12,13]) for (const z of [-34,-8]) add(x,z,3,0,'awning');
    for (const x of [-10,10]) for (let z = 10; z < 38; z += 5) add(x,z,2,0,'barrel');
  }
  if (world.layout === 'forum' || world.layout === 'terraces') {
    for (const side of [-1,1]) {
      for (let x = -61; x <= 61; x += 8) add(x, side * 8, 2, 0, 'column');
      for (let x = -58; x <= 58; x += 16) add(x, side * 17, 3, side > 0 ? Math.PI : 0, 'stall');
    }
  }
  if (world.layout === 'quays' || world.layout === 'canals') {
    for (const trail of trails) for (let i = 1; i < 22; i++) {
      const {x,z,dx,dz} = sample(trail,i / 22);
      const distance = layout.width / 2 - 1.4;
      for (const side of [-1,1]) {
        const px = x + dz * distance * side, pz = z - dx * distance * side;
        if (onLand(px,pz)) add(px,pz,i % 4 === 0 ? 2 : 1,Math.atan2(-dz,dx),i % 4 === 0 ? (world.id === 'venice' ? 'barrel' : 'supply') : 'bollard');
      }
    }
  }
  for (let i = 1; i <= 8; i++) add(-i * 1.55, startZ + i * .815, 1, i * .38);
  const actors = trafficByWorld[id];
  const addPatrol = (x: number, z: number, i: number) => {
    const wet = !onLand(x,z);
    const eligible = actors.filter(name => wet ? !landActors.has(name) : !waterActors.has(name));
    if (!eligible.length) return false;
    const name = eligible[i % eligible.length];
    const stride = ['walker','woman','roman','roman-woman','robot','ant','beetle','toy'].includes(name);
    const phase = (i % 4) * Math.PI / 2;
    const route = { x, z, phase, stride, rx:stride ? 3.1 : 6.2, rz:stride ? 1.6 : 3.3, speed:stride ? .65 : .83,
      hover:name === 'shuttle' ? 1.1 : name === 'drone' ? .65 : 0 };
    if (landActors.has(name) || waterActors.has(name)) {
      const clearance = stride ? 1.05 : 2.03;
      const staysOnSurface = () => Array.from({length:40}, (_, step) => step * Math.PI / 20).every(t => {
        const px = x + route.rx * Math.sin(t), pz = z + route.rz * Math.cos(t);
        if (landActors.has(name)) {
          return onLand(px,pz,clearance) && !walls.some(wall => covers(wall,px,pz,clearance));
        }
        return !onLand(px,pz,-clearance);
      });
      for (let attempt = 0; attempt < 4 && !staysOnSurface(); attempt++) {
        route.rx *= .65;
        route.rz *= .65;
      }
      if (!staysOnSurface()) return false;
    }
    const angle = Math.atan2(route.rz * Math.sin(phase), route.rx * Math.cos(phase));
    return add(x + route.rx * Math.sin(phase), z + route.rz * Math.cos(phase), stride ? 2 : 3, angle, name, route);
  };
  for (const [i, [x,z]] of ([[4,4],[12,8],[17,17],[4,23],[-5,27],[-16,5],[18,-3],[-19,14]] as Point[]).entries()) addPatrol(x,z,i);
  for (const [i,[x,z]] of ([[1,19],[10,23],[-9,9],[15,0],[-16,26],[22,10]] as Point[]).entries()) addPatrol(x,z,i);
  for (let i = 0; i < 42; i++) {
    const angle = i * 2.39996;
    const radius = 6 + (i % 7) * 2.5;
    add(2 + Math.cos(angle) * radius, 11 + Math.sin(angle) * radius, i % 4 === 0 ? 2 : 1, angle);
  }
  for (const trail of trails) {
    for (let i = 0; i < 21; i++) {
      const {x,z,dx,dz} = sample(trail, (i + .45) / 21);
      const side = i % 2 === 0 ? 1 : -1;
      const tier = [2,1,3,2,4,1,5][i % 7];
      const offset = side * (layout.width / 2 + 2.1 + random() * 3.4);
      add(x + dz * offset, z - dx * offset, tier, Math.atan2(-dz, dx));
      if (i % 5 === 2 && ['forum','alleys','neon','quays','canals','ring'].includes(world.layout)) {
        const setback = waterMap ? layout.width / 2 - 4 : layout.width / 2 + 8;
        const dxRow = dz * setback, dzRow = -dx * setback;
        for (const rowSide of [-1,1]) {
          const px = x + rowSide * dxRow, pz = z + rowSide * dzRow;
          if (onLand(px,pz,4)) {
            const building = world.layout === 'neon' ? 'neon' : world.layout === 'ring' ? 'module' :
              world.layout === 'canals' ? 'palazzo' : 'awning';
            add(px,pz,4,Math.atan2(-dx,-dz) + (rowSide > 0 ? Math.PI : 0),building);
          }
        }
      }
      if (i % 3 === 0) add(x - dz * offset, z + dx * offset, 1, random() * 6.28);
      if (i % 2 === 1) addPatrol(x - dz * 3, z + dx * 3, i + Math.floor(i / 3));
      for (let j = 0; j < 2; j++) {
        const gap = layout.width * .5 + 4 + j * 3;
        const side = j === 0 ? 1 : -1;
        const ox = x + dz * gap * side + dx * (3 + j);
        const oz = z - dx * gap * side + dz * (3 + j);
        add(ox, oz, i % 4 === 0 ? 2 : 1, i * .65);
        if (i % 2 === 0) scenery.push(piece(world.detail, ox, .026, oz, 3.9, .024, 2.8, 'pole', i * .65));
      }
    }
  }
  // Enforce a supply of each tier even if the trails cross or run close to the boundary.
  const minimum = [1280, 425, 108, 42, 20, 5];
  for (let tier = 6; tier >= 1; tier--) {
    let count = objects.filter(object => object.tier === tier).length;
    for (let attempt = 0; count < minimum[tier - 1] && attempt < 18000; attempt++) {
      const trail = trails[attempt % trails.length];
      const along = sample(trail,.03 + random() * .94);
      const offset = (random() < .5 ? -1 : 1) * (layout.width / 2 + 3 + Math.floor(random() * 11) * 3.7 + random() * 1.7);
      const x = attempt < 3500 ? along.x + along.dz * offset : (random() * 2 - 1) * 96;
      const z = attempt < 3500 ? along.z - along.dx * offset : (random() * 2 - 1) * 96;
      if (Math.hypot(x, z - startZ) > 11 && add(x, z, tier, random() * 6.28)) count++;
    }
    if (count < minimum[tier - 1]) throw new Error(`Insufficient space in ${world.name} for tier ${tier}`);
  }
  return {
    scenery: scenery.map(p => ({ ...p, x:p.x * mapScale, z:p.z * mapScale, w:p.w * mapScale, d:p.d * mapScale })),
    objects,
    greenPlots,
    isLand: (x,z) => onLand(x / mapScale,z / mapScale),
  };
}



