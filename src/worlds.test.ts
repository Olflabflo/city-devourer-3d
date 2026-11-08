import test from 'node:test';
import assert from 'node:assert/strict';
import { City, extent, pose } from './city.ts';
import { harbor, landscapes } from './landscapes.ts';
import { fits, radii, thresholds } from './rules.ts';
import { InstancedMesh, Matrix4, Scene } from 'three';
import { landActors, planWorld, spawn, waterActors } from './world-layout.ts';
import { landscapeById } from './landscapes.ts';

test('the landscapes generate distinct layouts with attainable growth chains', () => {
  const layouts = new Set<string>();
  for (const world of landscapes) {
    const map = new City(false, world);
    try {
      const { objects } = map;
      const layout = objects.map(({x,z,tier}) => [x,z,tier].join(',')).join(';');
      assert.ok(!layouts.has(layout), `${world.name} must have a distinct layout`);
      layouts.add(layout);
      for (const item of objects) {
        assert.ok(fits(radii[item.tier - 1], item.footprint, 0), world.name);
        assert.ok(Math.abs(item.x) <= extent && Math.abs(item.z) <= extent, world.name);
      }
      for (let tier = 1; tier < 6; tier++) {
        const points = objects.filter(item => item.tier <= tier).reduce((sum, item) => sum + item.points, 0);
        assert.ok(points >= thresholds[tier], `${world.name} must unlock tier ${tier + 1}`);
      }
      if (world !== harbor) {
        assert.ok(objects.some(item => item.tier === 6), world.name);
        assert.ok(objects.filter(item => item.tier === 1 && Math.hypot(item.x, item.z - spawn[1]) < 16)
          .reduce((sum,item) => sum + item.points, 0) >= thresholds[1], world.name);
      }
    } finally {
      map.dispose();
    }
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



