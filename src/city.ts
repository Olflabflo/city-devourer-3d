import * as T from 'three';
import { Grid } from './rules';

export const block = 30;
export const extent = 105;
const shapes = {
  box: new T.BoxGeometry(),
  crown: new T.IcosahedronGeometry(1, 0), pole: new T.CylinderGeometry(.5, .5, 1, 7),
  wheel: new T.CylinderGeometry(.5, .5, 1, 10).rotateX(Math.PI / 2),
};
type Shape = keyof typeof shapes;
type Part = {
  shape: Shape; color: number; local: T.Matrix4;
  mesh?: T.InstancedMesh; slot?: number;
};
type Traffic = { axis: 'x' | 'z'; center: number; span: number; speed: number };
export type Prop = {
  x: number; z: number; y: number; angle: number; parts: Part[];
  tier: number; footprint: number; points: number; traffic?: Traffic;
};
const pivot = new T.Object3D();
const scratch = new T.Matrix4();
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

export function pose(prop: Prop, x = prop.x, y = prop.y, z = prop.z, pitch = 0, roll = 0, scale = 1) {
  pivot.position.set(x, y, z);
  pivot.rotation.set(pitch, prop.angle, roll);
  pivot.scale.setScalar(scale);
  pivot.updateMatrix();
  for (const p of prop.parts) {
    const mesh = p.mesh!;
    mesh.setMatrixAt(p.slot!, scratch.multiplyMatrices(pivot.matrix, p.local));
    mesh.instanceMatrix.needsUpdate = true;
  }
}

function building(w: number, h: number, d: number, color: number, tower: boolean) {
  const parts = [
    part(0xa99588, 0, .18, 0, w + .3, .36, d + .3),
    part(color, 0, h / 2, 0, w, h, d),
    part(dark, 0, h + .12, 0, w + .15, .24, d + .15),
    part(0x798e94, w * .15, h + .5, 0, w * .25, .85, d * .35),
    part(dark, 0, .75, d / 2 + .02, .9, 1.5, .08),
  ];
  const floors = Math.max(1, Math.floor((h - 1.5) / 1.55));
  for (let i = 0; i < floors; i++) {
    const y = 1.85 + i * 1.55;
    const tint = i % 3 === 1 ? 0x75b8c6 : glass;
    for (const side of [-1, 1]) {
      parts.push(part(tint, 0, y, side * (d / 2 + .02), w * .74, .53, .06));
      parts.push(part(tint, side * (w / 2 + .02), y, 0, .06, .53, d * .72));
      if (!tower) parts.push(part(color, 0, y, side * (d / 2 + .055), .24, .56, .065));
    }
  }
  if (tower) parts.push(part(warm, w * .15, h + 1.48, 0, .14, 1.25, .14, 'pole'));
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
function person(color: number) {
  return [
    part(dark, -.11, .25, 0, .13, .5, .18), part(dark, .11, .25, 0, .13, .5, .18),
    part(color, 0, .73, 0, .38, .52, .24), part(0xe1ad81, 0, 1.13, 0, .19, .2, .19, 'crown'),
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

  private readonly start = new Map<Prop, [number, number]>();

  constructor(shadows: boolean) {
    const ground = new T.Mesh(new T.PlaneGeometry(270, 270), new T.MeshLambertMaterial({color: asphalt}));
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = shadows;
    this.root.add(ground);
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
        const add = (x: number, z: number, tier: number, footprint: number, points: number, parts: Part[], angle = 0, traffic?: Traffic) => {
          const prop = { x: cx + x, z: cz + z, y: tier ? .035 : 0, tier, footprint, points, parts, angle, traffic };
          lot.push(prop);
          if (tier) {
            this.objects.push(prop);
            this.start.set(prop, [prop.x, prop.z]);
          }
          if (traffic) this.traffic.push(prop);
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
            add(0, -.9, 6, 7.4, 260, building(10.5, 18 + random() * 12, 9.6, color(), true));
            add(-7.8, 5.5, 2, .89, 16, tree(false));
            add(7.8, 5.5, 2, .89, 16, tree(false));
          } else {
            const w = tier === 5 ? 7.7 : 5.2, d = tier === 5 ? 6.8 : 4.8;
            for (const x of [-4.8, 4.8]) for (const z of [-4.65, 4.65]) {
              add(x, z, tier, Math.hypot(w + .3, d + .3) / 2, tier === 5 ? 95 : 55, building(w, (tier === 5 ? 7.2 : 3.9) + random() * 2.4, d, color(), false), z < 0 ? Math.PI : 0);
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
          add(side * 9, 2.1, 2, .34, 13, person(color()), random() * 6);
        }
        add(-4.7, 9.25, 2, .95, 16, [part(0x40877e, 0, .56, 0, 1.58, .93, .87), part(dark, 0, 1.05, 0, 1.68, .16, .95)]);
        for (let i = 0; i < 7; i++) {
          add(-8 + i * 2.65, 10 + random() * 2, 1, .31, 5, [part(color(), 0, .2, 0, .43, .4, .43)], random() * 6);
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
    for (const prop of this.objects) {
      this.grid.remove(prop);
      [prop.x, prop.z] = this.start.get(prop)!;
      this.grid.add(prop);
      pose(prop);
    }
  }
  drive(dt: number, unavailable: ReadonlySet<Prop>) {
    for (const car of this.traffic) {
      if (unavailable.has(car)) continue;
      const route = car.traffic!;
      const travel = route.span * 2;
      const position = ((car[route.axis] - route.center + route.span + route.speed * dt + travel) % travel) + route.center - route.span;
      this.grid.move(car, route.axis === 'x' ? position : car.x, route.axis === 'z' ? position : car.z);
      pose(car);
    }
  }
}
