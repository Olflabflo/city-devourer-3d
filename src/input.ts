import { Vector2 } from 'three';

export class Input {
  private readonly keys = new Set<string>();
  private readonly stick = new Vector2();
  private pointer: number | null = null;
  private readonly thumb: HTMLElement;
  private readonly directions = ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'];
  readonly value = new Vector2();
  readonly touch = matchMedia('(any-pointer: coarse)').matches || navigator.maxTouchPoints > 0;

  constructor(private readonly pad: HTMLElement, togglePause: () => void) {
    this.thumb = pad.querySelector('i')!;
    window.addEventListener('keydown', e => {
      if (!e.repeat && (e.code === 'Escape' || e.code === 'KeyP')) togglePause();
      if (this.directions.includes(e.code) && pad.dataset.active === 'true') {
        e.preventDefault();
        this.keys.add(e.code);
      }
    });
    window.addEventListener('keyup', e => this.keys.delete(e.code));
    window.addEventListener('blur', () => this.clear());
    pad.addEventListener('pointerdown', e => {
      if (this.pointer !== null || e.button !== 0) return;
      this.pointer = e.pointerId;
      pad.setPointerCapture(e.pointerId);
      this.updateStick(e);
    });
    pad.addEventListener('pointermove', e => {
      if (e.pointerId === this.pointer) this.updateStick(e);
    });
    for (const name of ['pointerup', 'pointercancel', 'lostpointercapture'] as const) {
      pad.addEventListener(name, e => {
        if (e.pointerId === this.pointer) this.releaseStick();
      });
    }
  }

  private updateStick(e: PointerEvent) {
    const rect = this.pad.getBoundingClientRect();
    this.stick.set((e.clientX - rect.left - rect.width / 2) / 38, (e.clientY - rect.top - rect.height / 2) / 38);
    this.stick.clampLength(0, 1);
    this.thumb.style.transform = `translate(${this.stick.x * 33}px,${this.stick.y * 33}px)`;
  }

  private releaseStick() {
    const id = this.pointer;
    this.pointer = null;
    if (id !== null && this.pad.hasPointerCapture(id)) this.pad.releasePointerCapture(id);
    this.stick.set(0, 0);
    this.thumb.style.transform = '';
  }

  clear() {
    this.keys.clear();
    this.releaseStick();
  }

  read() {
    const held = (a: string, b: string) => Number(this.keys.has(a) || this.keys.has(b));
    const length = this.stick.length();
    const strength = length > .1 ? ((length - .1) / .9) ** 1.45 / length : 0;
    return this.value.set(
      this.stick.x * strength + held('KeyD', 'ArrowRight') - held('KeyA', 'ArrowLeft'),
      this.stick.y * strength + held('KeyS', 'ArrowDown') - held('KeyW', 'ArrowUp'),
    ).clampLength(0, 1);
  }
}
