export function read(key: string) {
  try { return localStorage.getItem(key); } catch { return null; }
}
export function save(key: string, value: string) {
  try { localStorage.setItem(key, value); } catch { /* Storage can be unavailable in private embeds. */ }
}

export class Audio {
  enabled = read('devourer.sound') !== 'off';
  private context?: AudioContext;

  unlock() {
    if (!this.enabled) return;
    try {
      this.context ??= new AudioContext();
      void this.context.resume().catch(() => {});
    } catch { /* Audio is optional. */ }
  }

  play(points: number, levelUp: boolean) {
    const ctx = this.context;
    if (!this.enabled || ctx?.state !== 'running') return;
    const notes = levelUp ? [392, 494, 587, 784] : [Math.max(72, 300 - points)];
    notes.forEach((frequency, i) => {
      const start = ctx.currentTime + i * .078;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = levelUp ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(frequency, start);
      osc.frequency.exponentialRampToValueAtTime(levelUp ? frequency * 1.07 : frequency * .42, start + .13);
      gain.gain.setValueAtTime(.001, start);
      gain.gain.exponentialRampToValueAtTime(.085, start + .018);
      gain.gain.exponentialRampToValueAtTime(.001, start + .16);
      osc.connect(gain).connect(ctx.destination);
      osc.start(start);
      osc.stop(start + .17);
    });
  }
}