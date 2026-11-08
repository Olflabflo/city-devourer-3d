import assert from 'node:assert/strict';
import test from 'node:test';
import { fits, Grid, radii, stage, targetRadius, thresholds, timeLeft } from './rules.ts';

test('growth stages start at their thresholds and fit representative objects', () => {
  const sizes = [.44, 1.02, 2.2, 3.6, 5.3, 7.4, 13.8];
  for (const [i, score] of thresholds.entries()) {
    assert.equal(stage(score), i + 1);
    assert.equal(targetRadius(score), radii[i]);
    assert.ok(fits(radii[i], sizes[i], .16));
    if (i) assert.equal(stage(score - 1), i);
  }
  assert.ok(targetRadius(6000) > targetRadius(1200));
});
test('objects that fit are pulled in once their center enters the horizon', () => {
  assert.equal(fits(2, 1.95, 1), true);
  assert.equal(fits(2, 2, 0), true);
  assert.equal(fits(2, 2.01, 0), false);
  assert.equal(fits(2, 1, 4), false);
});

test('growth needs a larger collection at every stage and does not jump at a threshold', () => {
  const previous = [0, 120, 350, 850, 1700, 3000];
  const typicalSmallItem = 6;
  assert.equal(stage(39 * typicalSmallItem), 1);
  assert.equal(stage(40 * typicalSmallItem), 2);
  assert.ok(targetRadius(45) < 1.5);
  for (let i = 1; i < thresholds.length; i++) {
    if (i < previous.length) assert.ok(thresholds[i] >= 2 * previous[i]);
    const radiusBefore = targetRadius(thresholds[i] - 1);
    assert.ok(targetRadius(thresholds[i]) - radiusBefore < .025);
  }
  assert.ok(targetRadius(6000) < 13);
});
test('moving and swallowing objects updates spatial membership', () => {
  const grid = new Grid();
  const car = { x: -1, z: 0 };
  grid.add(car);
  assert.deepEqual([...grid.near(-1, 0, 0)], [car]);
  grid.move(car, 13, 4);
  assert.deepEqual([...grid.near(-1, 0, 0)], []);
  assert.deepEqual([...grid.near(13, 4, 0)], [car]);
  grid.remove(car);
  assert.deepEqual([...grid.near(13, 4, 0)], []);
});
test('timed rounds expire at 120 seconds and endless rounds have no deadline', () => {
  assert.equal(timeLeft('timed', 0), 120);
  assert.equal(timeLeft('timed', 119), 1);
  assert.equal(timeLeft('timed', 121), 0);
  assert.equal(timeLeft('endless', 121), Infinity);
});

test('WP-12 reaches a fixed maximum only at 15,500 points', () => {
  assert.equal(stage(239), 1);
  assert.equal(stage(240), 2);
  assert.equal(stage(15499), 6);
  assert.equal(stage(15500), 7);
  assert.ok(targetRadius(15499) < 14.4);
  assert.equal(targetRadius(15500), 14.4);
  assert.equal(targetRadius(30000), 14.4);
});

