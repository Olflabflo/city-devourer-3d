export const duration = 120;
export const thresholds = [0, 45, 140, 345, 690, 1200];
export const radii = [1.28, 2.05, 3.28, 5.1, 7.15, 10.2];
export type Mode = 'timed' | 'endless';

export function stage(score: number) {
  const next = thresholds.findIndex(threshold => threshold > score);
  return next < 0 ? thresholds.length : next;
}

export function targetRadius(score: number) {
  const index = stage(score) - 1;
  const next = thresholds[index + 1];
  if (next === undefined) return radii[index] + 6 * (1 - Math.exp(-(score - thresholds[index]) / 3000));
  const progress = (score - thresholds[index]) / (next - thresholds[index]);
  return radii[index] + (radii[index + 1] - radii[index]) * progress * .32;
}

export function fits(level: number, tier: number, radius: number, footprint: number, distanceSquared: number) {
  const clearance = radius - footprint;
  return level >= tier && clearance > 0 && distanceSquared <= clearance ** 2;
}

export function timeLeft(mode: Mode, elapsed: number) {
  return mode === 'timed' ? Math.max(0, duration - elapsed) : Infinity;
}

export class Grid<T extends { x: number; z: number }> {
  private cells = new Map<string, Set<T>>();
  constructor(width = 12) {
    this.width = width;
  }
  private readonly width: number;
  private key(x: number, z: number) {
    return `${Math.floor(x / this.width)},${Math.floor(z / this.width)}`;
  }
  add(item: T) {
    const key = this.key(item.x, item.z);
    const bucket = this.cells.get(key) ?? new Set<T>();
    bucket.add(item);
    this.cells.set(key, bucket);
  }
  remove(item: T) {
    const key = this.key(item.x, item.z);
    const bucket = this.cells.get(key);
    bucket?.delete(item);
    if (bucket?.size === 0) this.cells.delete(key);
  }
  move(item: T, x: number, z: number) {
    const changed = this.key(item.x, item.z) !== this.key(x, z);
    if (changed) this.remove(item);
    item.x = x;
    item.z = z;
    if (changed) this.add(item);
  }
  *near(x: number, z: number, radius: number) {
    for (let ix = Math.floor((x - radius) / this.width); ix <= Math.floor((x + radius) / this.width); ix++) {
      for (let iz = Math.floor((z - radius) / this.width); iz <= Math.floor((z + radius) / this.width); iz++) {
        const bucket = this.cells.get(`${ix},${iz}`);
        if (bucket) yield* bucket;
      }
    }
  }
}
