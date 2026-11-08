import test from 'node:test';
import assert from 'node:assert/strict';
import { City, extent } from './city.ts';
import { harbor, landscapes } from './landscapes.ts';
import { fits, radii, thresholds } from './rules.ts';
import { InstancedMesh, Scene } from 'three';
import { planWorld, spawn } from './world-layout.ts';
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
      assert.ok(city.objects.length >= 240, `${world.name}: collectible density`);
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

