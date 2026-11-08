import { Vector2, MathUtils } from 'three';
import { City, extent, pose, type Prop } from './city';
import { Input } from './input';
import { Audio, read, save } from './audio';
import { fits, stage, targetRadius, thresholds, timeLeft, type Mode } from './rules';
import { View } from './view';
import { harbor, landscapeById, landscapes } from './landscapes';
import { spawn } from './world-layout';
import './style.css';

function id<T extends HTMLElement = HTMLElement>(name: string) {
  return document.getElementById(name) as T;
}
const world = id('world');
const hud = id('hud');
const overlay = id('overlay');
const modes = id('modes');
const play = id<HTMLButtonElement>('play');
const pause = id<HTMLButtonElement>('pause');
const sound = id<HTMLButtonElement>('sound');
const menu = id<HTMLButtonElement>('menu');
const leave = id<HTMLButtonElement>('leave');
const pad = id('joystick');
const clock = id('clock');
const landscape = id<HTMLSelectElement>('landscape');
const bootStatus = id('boot-status');
const format = new Intl.NumberFormat('de-AT');
const audio = new Audio();
type State = 'menu' | 'active' | 'paused' | 'over';
type Falling = { prop: Prop; x: number; z: number; age: number; duration: number };

function init(view: View) {
  for (const group of new Set(landscapes.map(world => world.group))) {
    const options = document.createElement('optgroup');
    options.label = group;
    for (const world of landscapes.filter(world => world.group === group)) {
      options.append(new Option(world.name, world.id));
    }
    landscape.append(options);
  }
  let map = harbor;
  let city = new City(view.shadows, map);
  view.scene.add(city.root);
  const input = new Input(pad, togglePause);
  const player = new Vector2(...spawn);
  const velocity = new Vector2();
  const desired = new Vector2();
  const clickTarget = new Vector2();
  let followingClick = false;
  const falling: Falling[] = [];
  const unavailable = new Set<Prop>();
  let state: State = 'menu';
  let mode: Mode = 'timed';
  let score = 0, swallowed = 0, elapsed = 0, radius = targetRadius(0), shake = 0, boost = 0;
  let last = performance.now();
  let lastHud = -1;
  const key = () => map === harbor ? `devourer.best.${mode}` : `devourer.best.${map.id}.${mode}`;
  const best = () => Number(read(key())) || 0;
  const record = () => id('record').textContent = `BESTLEISTUNG   ${format.format(best())} PUNKTE`;

  function popup(element: HTMLElement, value: string) {
    element.textContent = value;
    element.classList.remove('pop');
    void element.offsetWidth;
    element.classList.add('pop');
  }

  function setState(next: State) {
    state = next;
    overlay.hidden = next === 'active';
    hud.hidden = next !== 'active';
    pause.hidden = next !== 'active';
    leave.hidden = next !== 'active';
    followingClick = false;
    pad.dataset.active = String(next === 'active');
    pad.hidden = next !== 'active' || !input.touch;
    modes.hidden = next !== 'menu';
    id('landscape-picker').hidden = next !== 'menu';
    menu.hidden = next === 'menu';
    id('controls').hidden = next !== 'menu';
    input.clear();
    velocity.set(0, 0);
    if (next === 'active') {
      last = performance.now();
      lastHud = -1;
      world.focus();
      return;
    }
    const title = id('title');
    if (next === 'menu') title.innerHTML = 'CITY<br>DEVOURER<span>.</span>';
    else title.textContent = next === 'paused' ? 'PAUSE' : swallowed === city.objects.length ? 'ALLES EINGESAMMELT' : 'ZEIT ABGELAUFEN';
    id('summary').textContent = next === 'menu' ? (map === harbor ? 'Lenke die Anomalie durch die Karte und sammle, was in ihren Horizont passt.' : map.description) :
      `${format.format(score)} Punkte · ${swallowed} von ${city.objects.length} Objekten · Stufe ${stage(score)}`;
    id('district').textContent = map.name;
    play.innerHTML = `${next === 'paused' ? 'WEITERSPIELEN' : next === 'over' ? 'NEUSTART' : 'SPIELEN'} <span>↗</span>`;
    record();
    if (next !== 'menu') play.focus();
  }

  function togglePause() {
    if (state === 'active') setState('paused');
    else if (state === 'paused') setState('active');
  }

  function start() {
    city.reset();
    player.set(...spawn);
    falling.length = 0;
    unavailable.clear();
    score = swallowed = elapsed = shake = boost = 0;
    radius = targetRadius(0);
    view.reset();
    for (const name of ['toast', 'float']) id(name).classList.remove('pop');
    setState('active');
    updateHud();
  }

  function updateHud() {
    const level = stage(score);
    const start = thresholds[level - 1];
    const next = thresholds[level];
    id('level').textContent = `STUFE ${level}`;
    id('size').textContent = `Ø ${(radius * 2).toFixed(1).replace('.', ',')} m`;
    id<HTMLProgressElement>('progress').value = next === undefined ? 1 : (score - start) / (next - start);
    id('target').textContent = next === undefined ? `OBJEKTE: ${swallowed} / ${city.objects.length}` : `NÄCHSTE GRÖSSE · ${map.goals[level]}`;
    id('score').textContent = format.format(score);
    const seconds = Math.ceil(timeLeft(mode, elapsed));
    id('clock-label').textContent = mode === 'timed' ? 'ZEIT' : 'MODUS';
    clock.textContent = mode === 'timed' ? `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}` : '∞';
    clock.classList.toggle('urgent', seconds <= 15);
  }

  function simulate(dt: number) {
    city.drive(dt, unavailable);
    const axis = input.read();
    const speed = 8.2 + Math.min(radius, 8) * .32;
    // Match the ground projection of the camera's right and down directions.
    desired.set(.885 * axis.x + .465 * axis.y, -.465 * axis.x + .885 * axis.y).multiplyScalar(speed);
    if (axis.lengthSq()) followingClick = false;
    if (followingClick) {
      desired.copy(clickTarget).sub(player);
      const remaining = desired.length();
      if (remaining < .22) {
        followingClick = false;
        desired.set(0, 0);
      } else {
        desired.setLength(Math.min(speed, remaining * 4.5));
      }
    }
    velocity.lerp(desired, 1 - Math.exp(-(axis.lengthSq() ? 7.5 : 12) * dt));
    player.addScaledVector(velocity, dt).clampScalar(-extent, extent);
    radius = MathUtils.lerp(radius, targetRadius(score), 1 - Math.exp(-4.8 * dt));
    const level = stage(score);
    for (const prop of city.grid.near(player.x, player.y, radius)) {
      const distance = (prop.x - player.x) ** 2 + (prop.z - player.y) ** 2;
      if (!fits(radius, prop.footprint, distance)) continue;
      city.grid.remove(prop);
      unavailable.add(prop);
      falling.push({ prop, x: prop.x, z: prop.z, age: 0, duration: .51 + prop.tier * .09 });
    }
    let gained = 0;
    for (let i = falling.length - 1; i >= 0; i--) {
      const entry = falling[i];
      const { prop } = entry;
      entry.age += dt;
      const t = Math.min(1, entry.age / entry.duration);
      const pull = 1 - (1 - t) ** 2;
      const x = MathUtils.lerp(entry.x, player.x, pull);
      const z = MathUtils.lerp(entry.z, player.y, pull);
      const y = prop.y + Math.sin(t * Math.PI) * .36 - (prop.footprint * .58 + .35) * t ** 2;
      pose(prop, x, y, z, t * .5, Math.sin(t * Math.PI) * .22, 1 - t ** 1.35);
      if (t < 1) continue;
      falling.splice(i, 1);
      gained += prop.points;
      swallowed++;
      view.burst(x, z, prop.tier >= 4);
      if (prop.tier >= 4) shake = Math.min(.64, .22 + .06 * prop.tier);
    }
    if (gained > 0) {
      score += gained;
      if (score > best()) save(key(), String(score));
      const nextLevel = stage(score);
      audio.play(gained, nextLevel > level);
      popup(id('float'), `+${format.format(gained)}`);
      if (nextLevel > level) {
        boost = 1;
        popup(id('toast'), `STUFE ${nextLevel} · ${map.goals[nextLevel - 1]}`);
      }
    }
    shake *= Math.exp(-6 * dt);
    boost *= Math.exp(-2.5 * dt);
  }

  function frame(now: number) {
    const realDt = Math.max(0, (now - last) / 1000);
    const dt = Math.min(.06, realDt);
    last = now;
    if (state === 'active') {
      elapsed += realDt;
      if (timeLeft(mode, elapsed) === 0) setState('over');
      else {
        simulate(dt);
        if (swallowed === city.objects.length) setState('over');
        if (elapsed - lastHud >= .075) {
          lastHud = elapsed;
          updateHud();
        }
      }
    } else if (state === 'menu') {
      city.drive(dt, unavailable);
    }
    view.render(player.x, player.y, radius, now / 1000, dt, state === 'menu', state === 'active' ? shake : 0, boost);
    requestAnimationFrame(frame);
  }

  landscape.onchange = () => {
    if (state !== 'menu') return;
    const selected = landscapeById(landscape.value);
    landscape.value = selected.id;
    if (selected === map) return;
    const next = new City(view.shadows, selected);
    city.dispose();
    city = next;
    map = selected;
    view.scene.add(city.root);
    view.setSky(map.sky);
    view.reset();
    setState('menu');
  };
  modes.querySelectorAll<HTMLButtonElement>('button').forEach(button => {
    button.onclick = () => {
      mode = button.dataset.mode as Mode;
      modes.querySelectorAll('button').forEach(option => option.setAttribute('aria-pressed', String(option === button)));
      record();
    };
  });
  play.onclick = () => {
    audio.unlock();
    if (state === 'paused') setState('active');
    else start();
  };
  function returnToMenu() {
    city.reset();
    unavailable.clear();
    falling.length = 0;
    player.set(...spawn);
    radius = targetRadius(0);
    boost = 0;
    setState('menu');
    play.focus();
  }
  menu.onclick = leave.onclick = returnToMenu;
  view.renderer.domElement.addEventListener('pointerdown', event => {
    if (state !== 'active' || event.pointerType !== 'mouse' || event.button !== 0) return;
    followingClick = view.groundPoint(event.clientX, event.clientY, clickTarget);
    clickTarget.clampScalar(-extent, extent);
  });
  pause.onclick = togglePause;
  function soundLabel() {
    sound.textContent = audio.enabled ? 'TON AN' : 'TON AUS';
    sound.setAttribute('aria-pressed', String(audio.enabled));
  }
  sound.onclick = () => {
    audio.enabled = !audio.enabled;
    save('devourer.sound', audio.enabled ? 'on' : 'off');
    audio.unlock();
    soundLabel();
  };
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && state === 'active') setState('paused');
  });
  view.renderer.domElement.addEventListener('webglcontextlost', event => {
    event.preventDefault();
    if (state === 'active') setState('paused');
  });
  world.tabIndex = -1;
  soundLabel();
  setState('menu');
  requestAnimationFrame(frame);
  play.disabled = false;
  bootStatus.hidden = true;
}

try {
  init(new View(world));
} catch (error) {
  console.error(error);
  id('title').textContent = 'STARTFEHLER';
  id('summary').hidden = true;
  bootStatus.dataset.state = 'failed';
  bootStatus.textContent = 'Die 3D-Grafik konnte nicht gestartet werden. Prüfe, ob WebGL 2 und Hardwarebeschleunigung im Browser verfügbar sind, und lade die Seite neu.';
  modes.hidden = true;
  id('landscape-picker').hidden = true;
  play.hidden = true;
}


