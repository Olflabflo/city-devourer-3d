import test from 'node:test';
import assert from 'node:assert/strict';
import { City, extent, pose } from './city.ts';
import { harbor, landscapes } from './landscapes.ts';
import { canFracture, fits, maximumRadius, targetRadius, thresholds } from './rules.ts';
import { districts } from './districts.ts';
import { InstancedMesh, Matrix4, Scene } from 'three';
import { landActors, planWorld, spawn, waterActors } from './world-layout.ts';
import { landscapeById } from './landscapes.ts';

test('Pirate Bay contains sailing ships and period cargo throughout the generated map', () => {
  const { objects } = planWorld(landscapeById('pirate'));
  const modern = objects.filter(prop => ['cargo','breaker','crane','bollard','supply','rover'].includes(prop.name));
  assert.deepEqual([...new Set(modern.map(prop => prop.name))], []);
  assert.ok(objects.some(prop => prop.name === 'galleon' && prop.patrol));
  assert.ok(objects.some(prop => prop.name === 'chest'));
});

test('Mars uses colony equipment and robot traffic instead of road vehicles', () => {
  const { objects } = planWorld(landscapeById('mars'));
  const vehicles = objects.filter(prop => ['rover','train','car','truck','bike','cart'].includes(prop.name));
  assert.deepEqual([...new Set(vehicles.map(prop => prop.name))], []);
  assert.ok(objects.some(prop => prop.name === 'robot' && prop.patrol));
  assert.ok(objects.some(prop => prop.name === 'module'));
});

test('models tied to a setting do not leak into incompatible worlds', () => {
  const allowedWorlds = new Map([
    ['cargo', ['cargo','icebreaker']],
    ['breaker', ['arctic','icebreaker']],
    ['coral', ['reef']],
    ['wreck', ['pirate','reef','sail']],
    ['roman', ['rome']],
    ['roman-woman', ['rome']],
    ['rover', ['moon','arctic']],
    ['longboat', ['viking','pirate','amazon','venice','egypt']],
  ]);
  const misplaced = [];
  for (const world of landscapes.filter(map => map !== harbor)) {
    const names = new Set(planWorld(world).objects.map(prop => prop.name));
    for (const [model, maps] of allowedWorlds) {
      if (names.has(model) && !maps.includes(world.id)) misplaced.push(`${world.id}:${model}`);
    }
  }
  assert.deepEqual(misplaced, []);
});

test('the Viking waterfront uses longhouses on land and longboats on water', () => {
  const plan = planWorld(landscapeById('viking'));
  const land = plan.objects.filter(prop => prop.tier >= 4 && prop.name !== 'massif' && plan.isLand(prop.x, prop.z));
  const water = plan.objects.filter(prop => prop.tier >= 3 && !plan.isLand(prop.x, prop.z));
  assert.ok(land.some(prop => prop.name === 'longhouse'));
  assert.ok(land.every(prop => prop.name === 'longhouse'));
  assert.ok(water.length > 0);
  assert.ok(water.every(prop => prop.name === 'longboat'));
});

test('polar land sites use expedition equipment and shelter', () => {
  const allowed = new Set(['ice','stone','cabin','station','crate','barrel','supply','beacon','rover','walker','crop']);
  const plan = planWorld(landscapeById('arctic'));
  const land = plan.objects.filter(prop => plan.isLand(prop.x, prop.z));
  assert.ok(land.some(prop => prop.name === 'station'));
  assert.deepEqual([...new Set(land.filter(prop => !allowed.has(prop.name)).map(prop => prop.name))], []);
});

test('object models keep a consistent scale even when their placement values differ', () => {
  const plan = planWorld(landscapeById('viking'));
  const homes = plan.objects.filter(prop => prop.name === 'longhouse' && !prop.landmark);
  const barrels = plan.objects.filter(prop => prop.name === 'barrel');
  assert.ok(homes.length > 1 && barrels.length > 1);
  assert.equal(new Set(homes.map(prop => prop.radius)).size, 1);
  assert.equal(new Set(barrels.map(prop => prop.radius)).size, 1);
  assert.ok(homes[0].radius > barrels[0].radius * 4);
});

test('the landscapes generate distinct layouts with attainable growth chains', () => {
  const layouts = new Set<string>();
  for (const world of landscapes) {
    const map = new City(false, world);
    try {
      const { objects } = map;
      const layout = objects.map(({x,z,tier}) => [x,z,tier].join(',')).join(';');
      assert.ok(!layouts.has(layout), `${world.name} must have a distinct layout`);
      layouts.add(layout);
      let score = 0;
      for (const item of [...objects].sort((a,b) => a.footprint - b.footprint)) {
        assert.ok(Math.abs(item.x) <= extent && Math.abs(item.z) <= extent, world.name);
        if (item.footprint <= maximumRadius) {
          assert.ok(fits(targetRadius(score),item.footprint,0), `${world.name}: growth must unlock ${item.footprint} at ${score}`);
        } else {
          assert.ok(canFracture(score, targetRadius(score), item.footprint, 0), `${world.name}: fracture target must be reachable`);
        }
        score += item.points;
      }
      assert.ok(score >= thresholds[thresholds.length - 1], `${world.name}: maximum`);
      assert.ok(objects.some(item => item.footprint > targetRadius(9800)), `${world.name}: late target`);
    } finally {
      map.dispose();
    }
  }
});

test('every world has its own district profile and a planted area', () => {
  assert.equal(new Set(Object.values(districts).map(JSON.stringify)).size, landscapes.length);
  for (const world of landscapes.filter(map => map !== harbor)) {
    const plan = planWorld(world);
    const plot = plan.greenPlots[0];
    assert.ok(plot, world.name);
    assert.ok(plan.objects.filter(prop => (prop.name === 'crop' || prop.name === 'kelp') &&
      Math.hypot(prop.x - plot.x * .8, prop.z - plot.z * .8) < 12).length >= 8, world.name);
  }
});

test('oversized walls break once and their pieces award the original value and one completion', () => {
  const world = new City(false, landscapeById('castle'));
  try {
    const wall = world.objects.find(prop => prop.footprint > maximumRadius)!;
    assert.ok(wall);
    assert.equal(canFracture(15499,maximumRadius,wall.footprint,0),false);
    assert.equal(canFracture(15500,maximumRadius,wall.footprint,0),true);
    const before = new Set(world.objects);
    assert.equal(world.breakApart(wall),true);
    assert.equal(world.breakApart(wall),false);
    const inGrid = () => [...world.grid.near(wall.x,wall.z,25)];
    const chunks = inGrid().filter(prop => !before.has(prop));
    assert.equal(inGrid().includes(wall),false);
    assert.equal(chunks.length,5);
    let points = 0, count = 0;
    for (const chunk of chunks) {
      assert.ok(fits(maximumRadius,chunk.footprint,0));
      const result = world.finishPickup(chunk);
      points += result.points;
      count += result.count;
      assert.deepEqual(world.finishPickup(chunk),{points:0,count:0});
    }
    assert.equal(points,wall.points);
    assert.equal(count,1);
    world.reset();
    assert.ok(inGrid().includes(wall));
    assert.ok(inGrid().every(prop => before.has(prop)));
  } finally {
    world.dispose();
  }
});

test('disposing a landscape releases its scene objects and instance data', () => {
  const scene = new Scene();
  const world = new City(false, landscapes[18]);
  scene.add(world.root);
  const meshes = world.root.children.filter(object => object instanceof InstancedMesh);
  assert.ok(meshes.length > 0);
  let released = 0;
  for (const mesh of meshes) mesh.addEventListener('dispose', () => released++);
  world.dispose();
  assert.equal(scene.children.length, 0, 'The old landscape detaches from the active scene');
  assert.equal(world.root.children.length, 0);
  assert.equal(released, meshes.length);
});

test('river maps have a continuous water channel distinct from the banks', () => {
  for (const id of ['amazon', 'egypt']) {
    const plan = planWorld(landscapeById(id));
    const channel = plan.scenery.filter(p => p.color === 0x3b8398 && p.w >= 8 && p.d > 12);
    assert.ok(channel.length >= 4, `${id} needs a continuous blue river channel`);
    assert.ok(new Set(channel.map(p => p.yaw)).size > 2, `${id} channel bends along the terrain`);
  }
});

test('each map has nearby collectibles and active traffic that resets with the round', () => {
  for (const world of landscapes) {
    const city = new City(false, world);
    try {
      assert.ok(city.objects.length >= 1880, `${world.name}: collectible density`);
      const nearSpawn = city.objects.filter(item => Math.hypot(item.x, item.z - spawn[1]) <= 24);
      assert.ok(nearSpawn.length >= 25, `${world.name}: enough to find near the start`);
      const moving = city.traffic.filter(item => Math.hypot(item.x, item.z - spawn[1]) <= 30);
      assert.ok(moving.length >= 4, `${world.name}: movement visible near the start`);
      const origin = moving.map(({ x,z }) => [x,z]);
      city.drive(.5, new Set([moving[0]]));
      assert.deepEqual([moving[0].x, moving[0].z], origin[0]);
      assert.notDeepEqual(moving.slice(1).map(({x,z}) => [x,z]), origin.slice(1));
      city.reset();
      assert.deepEqual(moving.map(({x,z}) => [x,z]), origin);
    } finally {
      city.dispose();
    }
  }
});

test('historical traffic fits its period and routes stay on the correct surface', () => {
  for (const world of landscapes.filter(map => map !== harbor)) {
    const plan = planWorld(world);
    const movers = plan.objects.filter(prop => prop.patrol);
    const names = new Set(plan.objects.map(prop => prop.name));
    assert.ok(names.size >= 7, `${world.name}: model variety`);
    assert.ok(plan.objects.some(prop => prop.tier === 6 && prop.name === world.models[5]), `${world.name}: landmark`);
    if (world.group === 'Geschichte') {
      assert.ok(movers.some(prop => prop.name === 'handcart' || prop.name === 'carriage'), `${world.name}: period ground traffic`);
    }
    for (const prop of movers) {
      if (world.group === 'Geschichte') {
        assert.ok(['walker','woman','roman','roman-woman','handcart','carriage','sail','longboat'].includes(prop.name));
      }
      if (!landActors.has(prop.name) && !waterActors.has(prop.name)) continue;
      const {x,z,rx,rz} = prop.patrol!;
      for (let step = 0; step < 96; step++) {
        const angle = step * Math.PI / 48;
        assert.equal(plan.isLand(x + rx * Math.sin(angle), z + rz * Math.cos(angle)),
          landActors.has(prop.name), `${world.name}: ${prop.name} crosses an incompatible surface`);
      }
    }
  }
});

test('a collapsing building lowers its upper parts and a restart restores them', () => {
  const city = new City(false, landscapeById('castle'));
  try {
    const building = city.objects.find(prop => prop.building && prop.tier === 6)!;
    assert.ok(building);
    const roof = building.parts.reduce((top, part) => part.local.elements[13] > top.local.elements[13] ? part : top);
    const height = () => {
      const matrix = new Matrix4();
      roof.mesh!.getMatrixAt(roof.slot!, matrix);
      return matrix.elements[13];
    };
    const intact = height();
    pose(building, building.x, building.y, building.z, 0, 0, 1, undefined, .8);
    assert.ok(height() < intact * .5);
    city.reset();
    assert.equal(height(), intact);
  } finally {
    city.dispose();
  }
});



