import type { Landscape } from './landscapes.ts';
import { model, piece, type Piece } from './world-models.ts';

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
  canyon: { width:16, trails:[[[-89,18],[-49,14],[-25,-11],[14,-17],[50,-7],[90,-32]], [[-84,-53],[-45,-69],[26,-62],[85,-75]], [[-86,72],[-23,58],[19,67],[88,42]]] },
  ring: { width:12, groundShape:'ring', trails:[[[-83,40],[-57,61],[0,71],[59,59],[83,29]], [[-85,-33],[-59,-61],[0,-71],[61,-59],[84,-32]], [[-82,0],[0,0],[83,0]]] },
  neon: { width:9, trails:[[[-95,-4],[92,-4]], [[-61,-90],[-61,89]], [[53,-89],[53,89]], [[-91,54],[92,54]]] },
  groves: { width:13, groundShape:'islands', trails:[[[-89,21],[-46,8],[-15,18],[22,-17],[58,-9],[90,-20]], [[-83,-65],[-36,-48],[13,-72],[64,-61],[89,-53]], [[-85,77],[-43,62],[12,74],[55,49],[90,76]]] },
  debris: { width:6, trails:[[[-92,16],[-52,-5],[-21,-9],[22,5],[60,-17],[92,-11]], [[-91,-62],[-54,-52],[-5,-76],[35,-54],[87,-65]], [[-87,80],[-33,60],[15,75],[51,45],[89,57]]] },
};

export const spawn = [0, 11.25] as const;
type ObjectPlan = { x: number; z: number; tier: number; radius: number; points: number; yaw: number; pieces: Piece[] };
type WorldPlan = { scenery: Piece[]; objects: ObjectPlan[] };
const radii = [.34, .83, 1.62, 2.92, 4.58, 7.25];
const points = [6, 14, 28, 52, 90, 220];
const accentWhite = 0xf3ebd7;
const riverBlue = 0x3b8398;

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
  if (world.layout === 'grid') throw new Error('The harbor has its own generator');
  const layout = layouts[world.layout];
  let state = [...world.id].reduce((hash, char) => (Math.imul(hash, 31) + char.charCodeAt(0)) >>> 0, 2166136261);
  const random = () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
  const scenery: Piece[] = [];
  if (layout.groundShape === 'tiles') {
    for (let x = -96; x <= 96; x += 12) for (let z = -96; z <= 96; z += 12) {
      scenery.push(piece((x + z) % 24 === 0 ? world.detail : world.ground, x, .019, z, 12, .016, 12));
    }
  } else if (layout.groundShape === 'planks') {
    for (let z = -104; z <= 104; z += 8) scenery.push(piece(z % 16 ? world.detail : world.ground, 0, .014, z, 212, .018, 7.87));
  } else if (layout.groundShape === 'ring') {
    const diameter = world.layout === 'ring' ? 151 : world.layout === 'oasis' ? 31 : 63;
    scenery.push(piece(world.layout === 'oasis' ? 0x498b96 : world.detail, world.layout === 'oasis' ? 5 : 0,
      .014, -12, diameter, .055, diameter, world.layout === 'oasis' ? 'pole' : 'ring'));
  }
  const isRiver = world.layout === 'river';
  const trails = world.id === 'egypt'
    ? [[[-94,34],[-41,19],[-16,8],[21,3],[87,9]], ...layout.trails.slice(1)] as readonly (readonly Point[])[]
    : layout.trails;
  for (const [route, trail] of trails.entries()) {
    for (let i = 1; i < trail.length; i++) scenery.push(strip(world.detail, trail[i - 1], trail[i], layout.width, .05));
    if (isRiver && route === 0) {
      for (let i = 1; i < trail.length; i++) scenery.push(strip(riverBlue, trail[i - 1], trail[i], layout.width * .6, .075));
    }
    for (let i = 1; i < 14; i++) {
      const {x, z, dx, dz} = sample(trail, i / 14);
      if (layout.groundShape === 'islands') {
        const size = 7 + random() * 13;
        scenery.push(piece(world.detail, x + dx * 2, .023, z + dz * 2, size, .05, size * .77, 'pole', random()));
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
  if (world.layout === 'valley' || world.layout === 'canyon' || world.layout === 'fjord') {
    for (let x = -98; x <= 98; x += 23) {
      for (const side of [-1, 1]) {
        const z = side * (111 + random() * 9);
        scenery.push(piece(world.detail, x, 3.6, z, 28, 11 + random() * 12, 25, 'cone', random()));
        if (world.layout === 'valley') scenery.push(piece(0xe7f2f6, x, 11.7, z, 12, 10, 12, 'cone', .1));
      }
    }
  }
  if (world.layout === 'courtyard') {
    for (const x of [-42,42]) scenery.push(piece(world.detail, x, 1, -20, 2.8, 2, 47));
    for (const x of [-28, 28]) scenery.push(piece(world.detail, x, 1, -44, 25, 2, 2.8));
  }

  const objects: ObjectPlan[] = [];
  const add = (x: number, z: number, tier: number, yaw = 0) => {
    const radius = radii[tier - 1];
    if (Math.abs(x) > 99 || Math.abs(z) > 99 || objects.some(other =>
      Math.hypot(x - other.x, z - other.z) < radius + other.radius + .7)) return false;
    objects.push({ x, z, tier, radius, yaw, points:points[tier - 1],
      pieces:model(world.models[tier - 1], world.accent, world.detail) });
    return true;
  };
  add(-8, -17, 6, .24);
  for (let i = 1; i <= 8; i++) add(spawn[0] - i * 1.55, spawn[1] + i * .815, 1, i * .38);
  for (const trail of trails) {
    for (let i = 0; i < 21; i++) {
      const {x,z,dx,dz} = sample(trail, (i + .45) / 21);
      const side = i % 2 === 0 ? 1 : -1;
      const tier = [2,1,3,2,4,1,5][i % 7];
      const offset = side * (layout.width / 2 + 2.1 + random() * 3.4);
      add(x + dz * offset, z - dx * offset, tier, Math.atan2(-dz, dx));
      if (i % 3 === 0) add(x - dz * offset, z + dx * offset, 1, random() * 6.28);
    }
  }
  // Enforce a supply of each tier even if the trails cross or run close to the boundary.
  const minimum = [23, 16, 14, 10, 8, 3];
  for (let tier = 6; tier >= 1; tier--) {
    let count = objects.filter(object => object.tier === tier).length;
    for (let attempt = 0; count < minimum[tier - 1] && attempt < 400; attempt++) {
      const x = (random() * 2 - 1) * 90, z = (random() * 2 - 1) * 90;
      if (Math.hypot(x - spawn[0], z - spawn[1]) > 11 && add(x, z, tier, random() * 6.28)) count++;
    }
    if (count < minimum[tier - 1]) throw new Error(`Insufficient space in ${world.name} for tier ${tier}`);
  }
  return { scenery, objects };
}
