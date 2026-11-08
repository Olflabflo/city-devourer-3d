import * as T from 'three';

const holeShader = new T.ShaderMaterial({
  transparent: true,
  depthWrite: false,
  uniforms: { time: { value: 0 }, boost: { value: 0 } },
  vertexShader: `varying vec2 at;
    void main(){ at = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
  fragmentShader: `varying vec2 at; uniform float time; uniform float boost;
    void main() {
      float r = length(at);
      float angle = atan(at.y, at.x);
      float disk = smoothstep(.96, 1.025, r) * (1.0 - smoothstep(1.08, 1.48, r));
      float flow = .52 + .22 * sin(6.0 * angle + r * 63.0 - time * 3.8)
                       + .18 * sin(11.0 * angle - r * 39.0 - time * 5.5);
      float lens = exp(-pow((r - 1.012) * 79.0, 2.0));
      float halo = exp(-max(0.0, r - 1.02) * 8.5) * (1.0 - smoothstep(1.33, 1.65, r));
      float hotSide = .68 + .32 * cos(angle - 1.0);
      vec3 fire = mix(vec3(.67,.16,.035), vec3(1.0,.79,.45), clamp(flow * hotSide + boost * .2, 0.0, 1.0));
      vec3 glow = mix(vec3(.27,.13,.45), fire, clamp(disk * 1.5 + lens, 0.0, 1.0));
      float opacity = max(1.0 - smoothstep(.99, 1.012, r), disk * (.55 + .38 * flow));
      opacity = max(opacity, max(lens, halo * .33));
      vec3 col = mix(vec3(.004,.002,.013), glow, smoothstep(.973, 1.015, r));
      gl_FragColor = vec4(col,opacity);
    }`,
});

export class View {
  readonly scene = new T.Scene();
  readonly camera = new T.PerspectiveCamera(42, innerWidth / innerHeight, .5, 380);
  readonly renderer: T.WebGLRenderer;
  readonly hole = new T.Mesh(new T.CircleGeometry(1.65, 96), holeShader);
  readonly shadows = !matchMedia('(any-pointer: coarse)').matches;
  private readonly focus = new T.Vector3();
  private readonly offset = new T.Vector3(.41, .93, .78);
  private zoom = 28;
  private ratio = Math.min(devicePixelRatio, this.shadows ? 1.7 : 1.3);
  private sampleTime = 0;
  private frames = 0;
  private readonly particleGeometry = new T.BufferGeometry();
  private readonly positions = new Float32Array(240 * 3);
  private readonly particles = Array.from({ length: 240 }, () => ({ x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, life: 0 }));
  private particleIndex = 0;

  constructor(container: HTMLElement) {
    this.renderer = new T.WebGLRenderer({ antialias: this.shadows, powerPreference: 'high-performance' });
    this.renderer.outputColorSpace = T.SRGBColorSpace;
    this.renderer.shadowMap.enabled = this.shadows;
    this.renderer.shadowMap.type = T.PCFShadowMap;
    this.renderer.shadowMap.autoUpdate = false;
    this.scene.background = new T.Color(0x9ac5c8);
    this.scene.fog = new T.Fog(0x9ac5c8, 72, 195);
    this.scene.add(new T.HemisphereLight(0xfff3dd, 0x8794b5, 1.65));
    const light = new T.DirectionalLight(0xffecd4, 2.65);
    light.position.set(-45, 85, 35);
    if (this.shadows) {
      light.castShadow = true;
      light.shadow.mapSize.set(1024, 1024);
      light.shadow.camera.left = light.shadow.camera.bottom = -49;
      light.shadow.camera.right = light.shadow.camera.top = 49;
      light.shadow.camera.far = 210;
      light.shadow.normalBias = .08;
    }
    this.scene.add(light, light.target);
    this.sun = light;
    this.hole.rotation.x = -Math.PI / 2;
    this.hole.position.y = .225;
    this.scene.add(this.hole);
    this.particleGeometry.setAttribute('position', new T.BufferAttribute(this.positions, 3).setUsage(T.DynamicDrawUsage));
    const cloud = new T.Points(this.particleGeometry, new T.PointsMaterial({ color: 0xffba6d, size: .26, transparent: true, opacity: .88, depthWrite: false }));
    cloud.frustumCulled = false;
    this.scene.add(cloud);
    container.append(this.renderer.domElement);
    addEventListener('resize', this.resize);
    this.resize();
  }

  private readonly sun: T.DirectionalLight;

  setSky(color: number) {
    (this.scene.background as T.Color).setHex(color);
    (this.scene.fog as T.Fog).color.setHex(color);
    this.renderer.shadowMap.needsUpdate = true;
  }
  private resize = () => {
    this.camera.aspect = innerWidth / innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(this.ratio);
    this.renderer.setSize(innerWidth, innerHeight);
  };

  burst(x: number, z: number, large: boolean) {
    for (let i = 0; i < (large ? 24 : 9); i++) {
      const p = this.particles[this.particleIndex++ % this.particles.length];
      const a = Math.random() * Math.PI * 2;
      const v = 1 + Math.random() * (large ? 8 : 4);
      Object.assign(p, { x, y: .43, z, vx: Math.cos(a) * v, vy: 1.5 + Math.random() * 4, vz: Math.sin(a) * v, life: .3 + Math.random() * .55 });
    }
  }

  reset() {
    for (const p of this.particles) p.life = 0;
    this.focus.set(0, 0, 0);
    this.zoom = 25;
  }

  render(x: number, z: number, radius: number, time: number, dt: number, menu: boolean, shake: number, boost: number) {
    const ease = 1 - Math.exp(-5 * dt);
    this.focus.x = T.MathUtils.lerp(this.focus.x, menu ? -10 : x, ease);
    this.focus.z = T.MathUtils.lerp(this.focus.z, menu ? 0 : z, ease);
    const portrait = this.camera.aspect < .85;
    this.zoom = T.MathUtils.lerp(this.zoom, (menu ? (portrait ? 37 : 42) : 19 + radius * 3.45) * (portrait ? 1.23 : 1), ease);
    this.camera.position.copy(this.focus).addScaledVector(this.offset, this.zoom);
    this.camera.position.x += Math.sin(time * 49) * shake;
    this.camera.position.z += Math.cos(time * 53) * shake * .55;
    this.camera.lookAt(this.focus);
    this.hole.position.x = x;
    this.hole.position.z = z;
    this.hole.scale.setScalar(radius);
    holeShader.uniforms.time.value = time;
    holeShader.uniforms.boost.value = boost;
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      if (p.life > 0) {
        p.life -= dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.z += p.vz * dt;
        p.vy -= 9 * dt;
      }
      this.positions[i * 3] = p.x;
      this.positions[i * 3 + 1] = p.life > 0 ? p.y : -100;
      this.positions[i * 3 + 2] = p.z;
    }
    this.particleGeometry.attributes.position.needsUpdate = true;
    if (this.shadows && (this.frames % 4 === 0)) {
      this.sun.target.position.copy(this.focus);
      this.sun.position.copy(this.focus).add(new T.Vector3(-45, 85, 35));
      this.renderer.shadowMap.needsUpdate = true;
    }
    this.frames++;
    this.sampleTime += dt;
    if (this.sampleTime >= 2) {
      const fps = this.frames / this.sampleTime;
      const next = Math.max(.7, Math.min(devicePixelRatio, this.shadows ? 1.7 : 1.3, this.ratio + (fps < 42 ? -.15 : fps > 57 ? .08 : 0)));
      if (next !== this.ratio) {
        this.ratio = next;
        this.resize();
      }
      this.sampleTime = 0;
      this.frames = 0;
    }
    this.renderer.render(this.scene, this.camera);
  }
}
