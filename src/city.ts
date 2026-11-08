import * as T from 'three';
import { Grid } from './rules.ts';
import { harbor, type Landscape } from './landscapes.ts';
import { mapScale, planWorld, type Patrol } from './world-layout.ts';
import { model, type Piece } from './world-models.ts';

export const block = 30;
const sectorSize = block * mapScale;
export const extent = sectorSize * 7 / 2;
const shipOutline = new T.Shape([
  new T.Vector2(-.50, -.29), new T.Vector2(-.38, -.50), new T.Vector2(.12, -.48),
  new T.Vector2(.36, -.33), new T.Vector2(.50, 0), new T.Vector2(.36, .33),
  new T.Vector2(.12, .48), new T.Vector2(-.38, .50), new T.Vector2(-.50, .29),
]);
const shapes = {
  box: new T.BoxGeometry(),
  crown: new T.IcosahedronGeometry(1, 0), pole: new T.CylinderGeometry(.5, .5, 1, 7),
  wheel: new T.CylinderGeometry(.5, .5, 1, 10).rotateX(Math.PI / 2),
  cone: new T.ConeGeometry(.5, 1, 9),
  pyramid: new T.ConeGeometry(Math.SQRT1_2, 1, 4).rotateY(Math.PI / 4),
  gem: new T.OctahedronGeometry(.5),
  ring: new T.TorusGeometry(.39, .11, 6, 32).rotateX(-Math.PI / 2),
  sphere: new T.SphereGeometry(.5, 10, 6),
  hull: new T.CylinderGeometry(.57, .38, 1, 6).rotateY(Math.PI / 6),
  ship: new T.ExtrudeGeometry(shipOutline, { depth:1, bevelEnabled:false }).rotateX(-Math.PI / 2).translate(0, -.5, 0),
};
type Shape = keyof typeof shapes;
type Part = {
  shape: Shape; color: number; local: T.Matrix4;
  mesh?: T.InstancedMesh; slot?: number;
  motion?: Piece['motion'];
};
type Traffic = { axis: 'x' | 'z'; center: number; span: number; speed: number };
export type Prop = {
  x: number; z: number; y: number; angle: number; parts: Part[];
  tier: number; footprint: number; points: number; traffic?: Traffic; patrol?: Patrol; building?: boolean;
};
const pivot = new T.Object3D();
const scratch = new T.Matrix4();
const animatedPart = new T.Matrix4();
const crushedPart = new T.Matrix4();
const compression = new T.Matrix4();
const structures = new Set(['awning','tower','keep','cabin','longhouse','stilt','palazzo','temple','arena',
  'arch','pyramid','station','module','neon','dome','airlock','caravan','crane']);
const asphalt = 0x455667;
const cement = 0xc8b6a0;
const grass = 0x76a76d;
const dark = 0x283949;
const glass = 0x9dd6d8;
const warm = 0xffd675;
const palette = [0xec856e, 0x60a8ab, 0xe9b95e, 0xdfcfb3, 0x797bb0, 0x5593be];

function part(color: number, x: number, y: number, z: number, w: number, h: number, d: number, shape: Shape = 'box', angle = 0) {
  pivot.position.set(x, y, z);
  pivot.rotation.set(0, angle, 0);
  pivot.scale.set(w, h, d);
  pivot.updateMatrix();
  return { color, shape, local: pivot.matrix.clone() };
}

function toPart(p: Piece): Part {
  pivot.position.set(p.x, p.y, p.z);
  pivot.rotation.set(p.pitch, p.yaw, p.roll);
  pivot.scale.set(p.w, p.h, p.d);
  pivot.updateMatrix();
  return { color: p.color, shape: p.shape, local: pivot.matrix.clone(), motion:p.motion };
}

function sizedParts(pieces: Piece[], footprint: number) {
  const parts = pieces.map(toPart);
  let radius = 0, floor = Infinity;
  const bounds = new T.Box3();
  for (const p of parts) {
    const geometry = shapes[p.shape];
    if (!geometry.boundingBox) geometry.computeBoundingBox();
    bounds.copy(geometry.boundingBox!).applyMatrix4(p.local);
    radius = Math.max(radius, Math.hypot(
      Math.max(Math.abs(bounds.min.x), Math.abs(bounds.max.x)),
      Math.max(Math.abs(bounds.min.z), Math.abs(bounds.max.z)),
    ));
    floor = Math.min(floor, bounds.min.y);
  }
  const scale = footprint / radius;
  const transform = new T.Matrix4().makeScale(scale, scale, scale);
  transform.setPosition(0, -floor * scale, 0);
  for (const p of parts) p.local.premultiply(transform);
  return parts;
}

export function pose(prop: Prop, x = prop.x, y = prop.y, z = prop.z, pitch = 0, roll = 0, scale = 1, time?: number, collapse = 0) {
  pivot.position.set(x, y, z);
  pivot.rotation.set(pitch, prop.angle, roll);
  pivot.scale.setScalar(scale);
  pivot.updateMatrix();
  if (collapse) compression.makeScale(1, 1 - .84 * collapse, 1);
  for (const p of prop.parts) {
    const mesh = p.mesh!;
    let local = p.local;
    if (p.motion && time !== undefined) {
      const {kind,phase} = p.motion;
      const px = p.local.elements[12], py = p.local.elements[13], pz = p.local.elements[14];
      if (kind === 'spin') animatedPart.makeRotationY(time * (phase ? 21 * phase : 3.2));
      else animatedPart.makeRotationZ(Math.sin(time * 11) * phase * .52);
      animatedPart.multiply(p.local);
      animatedPart.setPosition(px + (kind === 'swing' ? Math.sin(time * 11) * phase * py * .25 : 0),py,pz);
      local = animatedPart;
    }
    if (collapse) {
      crushedPart.multiplyMatrices(compression,local);
      const height = Math.min(local.elements[13], 7);
      const slide = Math.sin(collapse * Math.PI) * height * .13;
      crushedPart.elements[12] += Math.sin(p.slot! * 1.93) * slide;
      crushedPart.elements[14] += Math.cos(p.slot! * 1.93) * slide;
      local = crushedPart;
    }
    mesh.setMatrixAt(p.slot!, scratch.multiplyMatrices(pivot.matrix, local));
    mesh.instanceMatrix.needsUpdate = true;
  }
}

function building(w: number, h: number, d: number, color: number, tower: boolean) {
  const parts: Part[] = [
    part(0xa99588, 0, .18, 0, w + .3, .36, d + .3),
    part(color, 0, h / 2, 0, w, h, d),
    part(dark, 0, h + .12, 0, w + .15, .24, d + .15),
    part(0x798e94, w * .15, h + .5, 0, w * .25, .85, d * .35),
    part(dark, 0, .75, d / 2 + .02, .9, 1.5, .08),
    part(0xe0b67c, 0, 1.65, d / 2 + .2, 1.65, .14, .55),
    part(glass, w * .27, .76, d / 2 + .04, w * .23, .9, .07),
    ...[-1,0,1].map(i => part(i ? 0xf3dca4 : color, i * .43, 1.735,
      d / 2 + .27, .41, .07, .49)),
  ];
  const floors = Math.max(1, Math.floor((h - 1.5) / 1.55));
  for (let i = 0; i < floors; i++) {
    const y = 1.85 + i * 1.55;
    const tint = i % 3 === 1 ? 0x75b8c6 : glass;
    for (const side of [-1, 1]) {
      parts.push(part(tint, 0, y, side * (d / 2 + .02), w * .74, .53, .06));
      parts.push(part(tint, side * (w / 2 + .02), y, 0, .06, .53, d * .72));
      parts.push(part(0xd6e3dc, 0, y - .32, side * (d / 2 + .035), w * .8, .065, .085));
      parts.push(part(color, side * (w / 2 + .052), y, d * .14, .065, .55, .1));
      if (!tower) parts.push(part(color, 0, y, side * (d / 2 + .055), .24, .56, .065));
    }
  }
  if (tower) {
    parts.push(part(warm, w * .15, h + 1.48, 0, .14, 1.25, .14, 'pole'));
    parts.push({ ...part(0xf2dca0, w * .15, h + 2.03, 0, .83, .11, .18), motion:{kind:'spin',phase:0} });
  }
  return parts;
}

function tree(large: boolean) {
  const size = large ? 1.57 : .82;
  return [
    part(0x82644c, 0, size * 1.02, 0, .33, size * 2.04, .33, 'pole'),
    part(large ? 0x318a71 : 0x4b9e67, 0, size * 2.0, 0, size, size * 1.26, size, 'crown'),
    part(0x8cba62, -.23, size * 2.58, .06, size * .67, size * .86, size * .71, 'crown'),
  ];
}
function bench() {
  return [
    part(0xb76f49, 0, .53, 0, 1.68, .15, .55),
    part(0xc28657, 0, .87, -.25, 1.68, .37, .11),
    ...[-.62, .62].map(x => part(dark, x, .27, 0, .12, .55, .45)),
  ];
}
function car(truck: boolean, color: number) {
  const length = truck ? 6 : 3.75;
  const width = truck ? 2.13 : 1.52;
  const parts = [
    part(color, 0, .52, 0, length, .64, width),
    part(dark, .34, .99, 0, 1.42, .6, width * .85),
    part(color, .31, 1.32, 0, 1.02, .14, width * .84),
  ];
  if (truck) parts.push(part(0xe6e2c7, -1.07, 1.43, 0, 3.46, 1.64, width));
  for (const z of [-1, 1]) {
    for (const x of [-length * .32, length * .32]) parts.push(part(dark, x, .3, z * width / 2, .59, .59, .22, 'wheel'));
    parts.push(part(warm, length / 2, .63, z * width * .33, .09, .19, .24));
    parts.push(part(0xf07868, -length / 2, .63, z * width * .33, .09, .15, .22));
  }
  return parts;
}

export class City {
  readonly root = new T.Group();
  readonly grid = new Grid<Prop>();
  readonly objects: Prop[] = [];
  readonly traffic: Prop[] = [];
  private readonly material = new T.MeshLambertMaterial();
  private readonly ground: T.Mesh<T.PlaneGeometry, T.MeshLambertMaterial>;

  private readonly start = new Map<Prop, [number, number, number]>();
  private travel = 0;
  private readonly animatedScenery: Prop[] = [];

  constructor(shadows: boolean, landscape: Landscape = harbor) {
    const ground = this.ground = new T.Mesh(new T.PlaneGeometry(270, 270), new T.MeshLambertMaterial({
      color: landscape.id === harbor.id ? asphalt : landscape.ground,
    }));
    ground.material.onBeforeCompile = shader => {
      shader.vertexShader = 'varying vec2 surface;\n' + shader.vertexShader.replace(
        '#include <begin_vertex>', '#include <begin_vertex>\nsurface = position.xy;');
      shader.fragmentShader = 'varying vec2 surface;\n' + shader.fragmentShader.replace(
        '#include <color_fragment>',
        `#include <color_fragment>
        vec2 grainCell = floor(surface * 10.0);
        float grain = fract(sin(dot(grainCell, vec2(12.9898, 78.233))) * 43758.5453);
        float shade = sin(surface.x * .24 + sin(surface.y * .31)) * .025;
        diffuseColor.rgb *= .98 + grain * .04 + shade;`);
    };
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = shadows;
    this.root.add(ground);
    if (landscape.id !== harbor.id) {
      this.buildLandscape(landscape, shadows);
      this.reset();
      return;
    }
    let seed = 1337;
    const random = () => {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      return seed / 4294967296;
    };
    const color = () => palette[Math.floor(random() * palette.length)];

    for (let ix = -3; ix <= 3; ix++) {
      for (let iz = -3; iz <= 3; iz++) {
        const cx = ix * block, cz = iz * block;
        const lot: Prop[] = [];
        const add = (x: number, z: number, tier: number, footprint: number, points: number, parts: Part[], angle = 0, traffic?: Traffic, patrol?: Patrol, building = false) => {
          const transform = new T.Matrix4().makeScale(mapScale, mapScale, mapScale);
          for (const p of parts) p.local.premultiply(transform);
          if (traffic) traffic = { ...traffic, center:traffic.center * mapScale, span:traffic.span * mapScale, speed:traffic.speed * mapScale };
          if (patrol) patrol = { ...patrol, x:patrol.x * mapScale, z:patrol.z * mapScale, rx:patrol.rx * mapScale, rz:patrol.rz * mapScale };
          const prop = { x: (cx + x) * mapScale, z: (cz + z) * mapScale, y: tier ? .035 : 0,
            tier, footprint:footprint * mapScale, points, parts, angle, traffic, patrol, building };
          lot.push(prop);
          if (tier) {
            this.objects.push(prop);
            this.start.set(prop, [prop.x, prop.z, prop.angle]);
          }
          if (traffic || patrol) this.traffic.push(prop);
          else if (parts.some(p => p.motion)) this.animatedScenery.push(prop);
        };
        const park = (ix + iz * 2) % 4 === 0;
        const paving = [part(cement, 0, .08, 0, 21.2, .16, 21.2)];
        if (park) {
          paving.push(part(grass, 0, .165, 0, 17.8, .05, 17.8), part(0xe4cdb1, 0, .194, 0, 2.35, .02, 18.1), part(0xe4cdb1, 0, .194, 0, 18.1, .02, 2.35));
        }
        for (let s = -1; s <= 1; s++) {
          paving.push(part(0xd4aa64, s * 7.6, .014, 15, 2.6, .018, .12), part(0xd4aa64, 15, .014, s * 7.6, .12, .018, 2.6));
        }
        for (let s = -3; s <= 3; s++) {
          paving.push(part(0xe4e2c5, 15 + s * .87, .014, 9.6, .46, .02, 1.36), part(0xe4e2c5, 9.6, .014, 15 + s * .87, 1.36, .02, .46));
        }
        add(0, 0, 0, 0, 0, paving);
        if (park) {
          for (const x of [-5.7, 5.7]) for (const z of [-5.7, 5.7]) {
            add(x, z, z < 0 ? 3 : 2, z < 0 ? 1.65 : .89, z < 0 ? 30 : 16, tree(z < 0));
            add(x, z * .44, 2, .9, 15, bench(), x > 0 ? Math.PI : 0);
          }
          for (const x of [-6, 6]) add(x, -9.25, 3, 1.85, 22, [
            part(0x476555, 0, .83, 0, 3.5, .11, .13),
            part(0x476555, 0, .43, 0, 3.5, .1, .13),
            ...[-1.65, -.83, 0, .83, 1.65].map(v => part(0x476555, v, .55, 0, .1, 1.1, .12)),
          ]);
        } else {
          const tier = Math.abs(ix) + Math.abs(iz) < 3 ? 4 : (ix - iz) % 3 === 0 ? 6 : 5;
          if (tier === 6) {
            add(0, -.9, 6, 7.4, 260, building(10.5, 18 + random() * 12, 9.6, color(), true), 0, undefined, undefined, true);
            add(-7.8, 5.5, 2, .89, 16, tree(false));
            add(7.8, 5.5, 2, .89, 16, tree(false));
          } else {
            const w = tier === 5 ? 7.7 : 5.2, d = tier === 5 ? 6.8 : 4.8;
            for (const x of [-4.8, 4.8]) for (const z of [-4.65, 4.65]) {
              add(x, z, tier, Math.hypot(w + .3, d + .3) / 2, tier === 5 ? 95 : 55,
                building(w, (tier === 5 ? 7.2 : 3.9) + random() * 2.4, d, color(), false),
                z < 0 ? Math.PI : 0, undefined, undefined, true);
            }
          }
        }
        for (const side of [-1, 1]) {
          add(side * 9.2, -8.8, 3, 1.22, 23, [
            part(dark, 0, 1.45, 0, .16, 2.9, .16, 'pole'),
            part(dark, 0, 2.87, .28, .16, .15, .72), part(warm, 0, 2.8, .65, .4, .15, .28),
          ]);
          add(side * 8.7, 8.8, 1, .43, 7, [
            part(dark, 0, .67, 0, .09, 1.34, .09, 'pole'),
            part(0xf47565, 0, 1.39, 0, .49, .43, .11),
            part(0xffeed0, 0, 1.39, .066, .28, .066, .025),
          ]);
          add(side * 7.5, 9.3, 1, .37, 6, [part(0x446c69, 0, .33, 0, .52, .66, .52, 'pole'), part(dark, 0, .68, 0, .56, .12, .56, 'pole')]);
          const x = side * 9;
          add(x, 2.1, 2, .43, 13, sizedParts(model(side > 0 ? 'woman' : 'walker', color(), dark), .43), random() * 6, undefined,
            {x:cx + x,z:cz - .7,rx:.45,rz:2.8,speed:.73,phase:0,stride:true});
          if (ix === 0 && iz === 0) {
            add(side * 4, 7.3, 2, .43, 13, sizedParts(model(side < 0 ? 'woman' : 'walker', 0xe9b95e, dark), .43), 0, undefined,
              {x:side * 4,z:5,rx:2,rz:2.3,speed:.81,phase:0,stride:true});
          }
        }
        add(-9.3, 7, 1, .4, 5, sizedParts(model('hydrant',0xc06349,dark),.4));
        add(9.15, -6.8, 2, .8, 13, sizedParts(model('bike',0x5d9d8e,dark),.8), Math.PI / 2);
        if ((ix + iz) % 3 === 0) {
          add(-6.5, 8.85, 2, .94, 16, sizedParts(model('stop',0x708eb1,dark),.94));
        }
        add(-4.7, 9.25, 2, .95, 16, [part(0x40877e, 0, .56, 0, 1.58, .93, .87), part(dark, 0, 1.05, 0, 1.68, .16, .95)]);
        for (let i = 0; i < 7; i++) {
          add(-8 + i * 2.65, 10 + random() * 2, 1, .31, 5, [part(color(), 0, .2, 0, .43, .4, .43)], random() * 6);
          add(-8 + i * 2.65, -10.1, 1, .32, 5, [
            part(0xb27a4c, 0, .19, 0, .49, .36, .39),
            part(0xffd992, 0, .38, 0, .19, .04, .4),
          ]);
        }
        for (const side of [-1, 1]) {
          for (let i = 0; i < 3; i++) {
            add(side * 9.85, -5.1 + i * 3.65, 1, .31, 4, [
              part(0xb8795d, 0, .21, 0, .42, .39, .42, 'pole'),
              part(0x63966b, 0, .46, 0, .44, .34, .44, 'sphere'),
              part(i % 2 ? 0xffba78 : 0xf19ba7, .05, .61, 0, .18, .19, .18, 'sphere'),
            ]);
          }
        }
        if (ix === 0 && iz === 0) {
          for (let i = 1; i <= 8; i++) {
            add(-i * 1.55, 11.25 + i * .815, 1, .34, 6, [
              part(0xffbf58, 0, .31, 0, .32, .62, .32, 'pole'),
              part(0xf9edd1, 0, .39, 0, .33, .11, .33, 'pole'),
            ]);
          }
        }
        const truck = (ix - iz * 2) % 4 === 0;
        if (iz !== 3) add(-7, 13.3, truck ? 4 : 3, truck ? 3.25 : 2.1, truck ? 58 : 35, car(truck, color()), 0, { axis:'x', center:cx, span:14.5, speed:1.1 + random() });
        if (ix !== 3) add(16.6, 6, 3, 2.1, 35, car(false, color()), Math.PI / 2, { axis:'z', center:cz, span:14.5, speed:-1.3 - random() });
        this.batch(lot, shadows);
      }
    }
    this.reset();
  }

  private buildLandscape(landscape: Landscape, shadows: boolean) {
    const { scenery, objects } = planWorld(landscape);
    this.batch([{ x:0, z:0, y:0, angle:0, tier:0, footprint:0, points:0, parts:scenery.map(toPart) }], false);
    const chunks = new Map<string, Prop[]>();
    for (const object of objects) {
      const { x, z, tier, points, radius, yaw, pieces, patrol } = object;
      const prop = { x, z, tier, points, footprint:radius, angle:yaw, y:.083, parts:sizedParts(pieces, radius), patrol,
        building:structures.has(object.name) };
      const key = `${Math.floor((x + extent) / sectorSize)},${Math.floor((z + extent) / sectorSize)}`;
      const chunk = chunks.get(key) ?? [];
      chunk.push(prop);
      chunks.set(key, chunk);
      this.objects.push(prop);
      if (patrol) this.traffic.push(prop);
      else if (prop.parts.some(p => p.motion)) this.animatedScenery.push(prop);
      this.start.set(prop, [x,z,yaw]);
    }
    for (const chunk of chunks.values()) this.batch(chunk, shadows);
  }

  private batch(lot: Prop[], shadows: boolean) {
    for (const shape of Object.keys(shapes) as Shape[]) {
      const entries = lot.flatMap(prop => prop.parts.filter(p => p.shape === shape));
      if (!entries.length) continue;
      const mesh = new T.InstancedMesh(shapes[shape], this.material, entries.length);
      mesh.castShadow = shadows;
      mesh.receiveShadow = shadows;
      mesh.instanceMatrix.setUsage(T.DynamicDrawUsage);
      const tint = new T.Color();
      entries.forEach((p, i) => {
        p.mesh = mesh;
        p.slot = i;
        mesh.setColorAt(i, tint.setHex(p.color));
      });
      for (const prop of lot) {
        if (prop.parts.every(p => p.mesh)) pose(prop);
      }
      this.root.add(mesh);

    }
    // Moving cars and drawn-in objects can reach beyond their initial lot bounds.
    for (const mesh of new Set(lot.flatMap(prop => prop.parts.map(p => p.mesh!)))) {
      mesh.computeBoundingSphere();
      mesh.boundingSphere!.radius += 22;
    }
  }

  reset() {
    this.travel = 0;
    for (const prop of this.objects) {
      this.grid.remove(prop);
      [prop.x, prop.z, prop.angle] = this.start.get(prop)!;
      this.grid.add(prop);
      pose(prop);
    }
  }

  dispose() {
    this.root.removeFromParent();
    for (const child of this.root.children) {
      if (child instanceof T.InstancedMesh) child.dispose();
    }
    this.root.clear();
    this.material.dispose();
    this.ground.geometry.dispose();
    this.ground.material.dispose();
  }
  drive(dt: number, unavailable: ReadonlySet<Prop>) {
    this.travel += dt;
    for (const prop of this.animatedScenery) {
      if (!unavailable.has(prop)) pose(prop, prop.x, prop.y, prop.z, 0, 0, 1, this.travel);
    }
    for (const car of this.traffic) {
      if (unavailable.has(car)) continue;
      if (car.patrol) {
        const route = car.patrol;
        const t = route.phase + this.travel * route.speed;
        const sin = Math.sin(t), cos = Math.cos(t);
        this.grid.move(car, route.x + route.rx * sin, route.z + route.rz * cos);
        car.angle = Math.atan2(route.rz * sin, route.rx * cos);
        const step = route.stride ? Math.sin(this.travel * 11 + route.phase) : Math.sin(this.travel * 2.5 + route.phase);
        pose(car, car.x, car.y + Math.abs(step) * (route.stride ? .07 : .12) + (route.hover ?? 0),
          car.z, 0, step * (route.stride ? .06 : .1), 1, this.travel + route.phase);
        continue;
      }
      const route = car.traffic!;
      const travel = route.span * 2;
      const position = ((car[route.axis] - route.center + route.span + route.speed * dt + travel) % travel) + route.center - route.span;
      this.grid.move(car, route.axis === 'x' ? position : car.x, route.axis === 'z' ? position : car.z);
      pose(car);
    }
  }
}




