// O mundo 3D da Torre de Pisa: céu, colinas, praça de pedra, casas medievais, a torre de mármore em níveis com
// arcos (inclinável e "curvável"), andaime, mato, placa FECHADO e o elenco em cartões 2D (pedreiros, prefeito,
// engenheiros, turistas). update(plano, q, cam) posiciona tudo para o quadro q (função pura).
import * as THREE from "three";
import { Pen, bodyFront, Outfit, INK, Expr, fxPuff, fxCloud } from "./kit/toon";
import { stoneHD, cobbleHD, grassHD, roofHD, facadeHD, cloudHD, ctex, rep } from "./kit/paint";
import { TONE, CHAR, twoTone, untone } from "./kit/shade";
import { LIGHTS, LOOK, LightPreset, WorldLook } from "./kit/lights";
import { NOINK } from "./kit/ink";
import { cardShade, CARD_K } from "./kit/cardshade";
import { FPS, Plano, Luz, Estado, palavra, clamp01, smooth } from "./historia";

// ---------------- luz noite-azul (explicação) ----------------
const NIGHT: LightPreset = {
  ...LIGHTS.day, az: 120, el: 35,
  lit: [0.55, 0.72, 1.25], shade: [0.12, 0.14, 0.3], lift: [0.03, 0.05, 0.14],
  charTint: [0.72, 0.8, 1.05], sideTint: [0.7, 0.75, 1.0], fog: "#2b3f73", fogNear: 30, fogFar: 260,
  sunCol: "#a9c4ff", sunI: 1.6, sky: "#7d93d6", ground: "#2a2f4a",
};
const NIGHT_LOOK: WorldLook = {
  ...LOOK.day,
  sky: { c: ["#3b5594", "#2f4a88", "#24397a", "#1b2c63", "#121d47"], e: [0, 3, 8, 16, 40] },
  cloud: { lit: "#9fb2e6", mid: "#7488c4", shade: "#52639e" }, sat: 0.95,
};
const PRESET: Record<Luz, LightPreset> = { day: LIGHTS.day, golden: LIGHTS.golden, night: NIGHT };
const LOOKS: Record<Luz, WorldLook> = { day: LOOK.day, golden: LOOK.golden, night: NIGHT_LOOK };

// ---------------- materiais ----------------
const tt = (p: THREE.MeshLambertMaterialParameters) => twoTone(new THREE.MeshLambertMaterial(p));
const marmore = () => tt({ map: rep(stoneHD("marmore", ["#f4efe6", "#ece5d8", "#f8f4ec", "#e6ddcd"], "#c9bfae"), 2, 1) });
const marmoreClaro = tt({ color: "#f3eee4" });
const sombraArco = new THREE.MeshBasicMaterial({ color: "#3a2f45" });

// ---------------- elenco (cartões 2D) ----------------
const SU = 0.0022; // m por unidade de desenho (1000 unidades ≈ 2,2 m)
const PEDREIRO: Outfit = { jacket: "#b0763c", pants: "#5d4a3a", boots: INK, hat: "cap", cap: "#d9c49a" };
const PEDREIRO2: Outfit = { jacket: "#7f9b4a", pants: "#4b3f35", boots: INK, hat: "hair", hair: "#3a2a1e" };
const VELHO: Outfit = { jacket: "#b0763c", pants: "#5d4a3a", boots: INK, hat: "hair", hair: "#e9e4dc", moustache: "#f2efe9" };
const PREFEITO: Outfit = { jacket: "#b8323a", pants: "#3b2f4a", boots: INK, hat: "tophat", sash: "#e8c45a", build: "stout", moustache: "#4a3020" };
const ENGENHEIRO: Outfit = { jacket: "#f08a2c", pants: "#2f4a7a", boots: INK, hat: "cap", cap: "#f6d23a" };
const TURISTAS: Outfit[] = [
  { jacket: "#e2453c", pants: "#3b5b9a", boots: "#f4f1ea", hat: "cap", cap: "#2fa36b" },
  { jacket: "#7b5ac9", pants: "#3b3f52", boots: "#5a3b2a", hat: "hair", hair: "#5a3b2a" },
  { jacket: "#2fb0c2", pants: "#5a4a3a", boots: INK, hat: "hair", hair: "#d9a441", build: "kid" },
  { jacket: "#f2c14e", pants: "#304a6a", boots: INK, hat: "cap", cap: "#e2453c", build: "stout" },
];

type Cartao = { mesh: THREE.Mesh; mat: THREE.MeshLambertMaterial; cv: HTMLCanvasElement; chave: string; tex: THREE.CanvasTexture };
const GEO_CARTAO = (() => { const g = new THREE.PlaneGeometry(600 * SU, 1000 * SU); g.translate(0, (975 - 500) * SU, 0); return g; })();

// ---------------- texturas pintadas novas ----------------
const lamaTex = () => ctex("lama", 512, 512, (g, r) => {
  g.fillStyle = "#7a5a3c"; g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 260; i++) { g.fillStyle = r() < 0.5 ? "#6a4c32" : "#8a6a48"; g.beginPath(); g.ellipse(r() * 512, r() * 512, 6 + r() * 22, 3 + r() * 9, r() * 3, 0, 7); g.fill(); }
});
const placaTex = () => ctex("placaFechado", 512, 256, (g) => {
  g.fillStyle = "#f4efe2"; g.fillRect(0, 0, 512, 256);
  g.lineWidth = 14; g.strokeStyle = "#c0353a"; g.strokeRect(10, 10, 492, 236);
  g.fillStyle = "#c0353a"; g.font = "900 84px Inter, sans-serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("FECHADO", 256, 136);
});

export class Mundo {
  root = new THREE.Group();
  private sun = new THREE.DirectionalLight("#fff3e0", 2.8);
  private hemi = new THREE.HemisphereLight("#cfe6ff", "#6c5c8c", 0.5);
  private fog = new THREE.Fog("#b8d0ec", 25, 300);
  private skyMat: THREE.ShaderMaterial; private sky: THREE.Mesh;
  private torre = new THREE.Group(); private niveis: THREE.Group[] = [];
  private andaime = new THREE.Group(); private mato = new THREE.Group(); private rachaduras = new THREE.Group();
  private placa: THREE.Mesh; private pedra: THREE.Mesh; private lama: THREE.Mesh; private solo: THREE.Mesh[] = [];
  private nuvens: THREE.Mesh[] = []; private nuvemMaps: Record<Luz, THREE.Texture[]>;
  private cartoes: Cartao[] = [];
  private grama!: THREE.Mesh; private praca!: THREE.Mesh;

  constructor() {
    const R = this.root;
    // céu em 5 faixas por elevação (valores invertidos do tone map)
    this.skyMat = new THREE.ShaderMaterial({
      uniforms: { c0: { value: new THREE.Color() }, c1: { value: new THREE.Color() }, c2: { value: new THREE.Color() }, c3: { value: new THREE.Color() }, c4: { value: new THREE.Color() }, e: { value: new THREE.Vector4() } },
      vertexShader: "varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
      fragmentShader: `uniform vec3 c0, c1, c2, c3, c4; uniform vec4 e; varying vec3 vP;
        void main(){ float el = asin(clamp(normalize(vP).y, -1.0, 1.0));
          vec3 c = mix(c0, c1, smoothstep(0.0, e.x, el)); c = mix(c, c2, smoothstep(e.x, e.y, el));
          c = mix(c, c3, smoothstep(e.y, e.z, el)); c = mix(c, c4, smoothstep(e.z, e.w, el)); gl_FragColor = vec4(c, 1.0); }`,
      side: THREE.BackSide, depthWrite: false, fog: false,
    });
    this.sky = new THREE.Mesh(new THREE.SphereGeometry(1100, 48, 24), this.skyMat);
    this.sky.renderOrder = -1; this.sky.frustumCulled = false; this.sky.layers.set(NOINK); R.add(this.sky);
    this.sun.castShadow = true; this.sun.shadow.mapSize.set(2048, 2048); R.add(this.sun, this.sun.target, this.hemi);

    // chão: grama ao longe, praça de pedra no centro
    const grama = this.grama = new THREE.Mesh(new THREE.CircleGeometry(600, 64).rotateX(-Math.PI / 2), tt({ map: rep(grassHD(), 120, 120) }));
    grama.receiveShadow = true; R.add(grama);
    const praca = this.praca = new THREE.Mesh(new THREE.CircleGeometry(26, 64).rotateX(-Math.PI / 2).translate(0, 0.02, 0), tt({ map: rep(cobbleHD(), 8, 8) }));
    praca.receiveShadow = true; R.add(praca);
    this.lama = new THREE.Mesh(new THREE.CircleGeometry(5.5, 48).rotateX(-Math.PI / 2).translate(0, 0.04, 0), tt({ map: rep(lamaTex(), 3, 3) }));
    this.lama.receiveShadow = true; R.add(this.lama);
    // colinas (esferas meio enterradas) e ciprestes
    const colina = tt({ color: "#6fa85a" }), colina2 = tt({ color: "#5b9450" });
    for (let i = 0; i < 9; i++) {
      const a = (i / 9) * Math.PI * 2 + 0.3, d = 170 + (i % 3) * 40, r = 60 + (i % 4) * 18;
      const m = new THREE.Mesh(new THREE.SphereGeometry(r, 32, 16), i % 2 ? colina : colina2);
      m.position.set(Math.sin(a) * d, -r * 0.62, Math.cos(a) * d); m.receiveShadow = true; R.add(m);
    }
    const cip = tt({ color: "#2f6b45" }), tronco = tt({ color: "#6b4a32" });
    for (let i = 0; i < 26; i++) {
      const a = (i / 26) * Math.PI * 2, d = 46 + (i % 5) * 9;
      const g = new THREE.Group();
      const c = new THREE.Mesh(new THREE.ConeGeometry(1.3, 7 + (i % 3), 10), cip); c.position.y = 4.5; c.castShadow = true;
      const t = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.25, 1.2, 6), tronco); t.position.y = 0.6;
      g.add(c, t); g.position.set(Math.sin(a) * d, 0, Math.cos(a) * d); R.add(g);
    }
    // casas medievais em volta da praça
    const roofs = ["#c9643c", "#b4532f", "#d07a45"].map((c) => tt({ map: rep(roofHD(c), 2, 2) }));
    const walls = [
      { wall: "#f0d9a8", shutter: "#3f7a5a" }, { wall: "#e8b48a", shutter: "#355f8a" }, { wall: "#f3e6c9", shutter: "#8a3f3a" }, { wall: "#e9c78f", shutter: "#4a6a3a" },
    ].map((o, i) => tt({ map: facadeHD("pisaCasa" + i, 3, 3, { ...o, door: true }) }));
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * Math.PI * 2 + 0.12, d = 31 + (i % 3) * 2;
      const w = 7 + (i % 3) * 1.5, h = 6 + (i % 4) * 1.2, dp = 6;
      const g = new THREE.Group();
      const corpo = new THREE.Mesh(new THREE.BoxGeometry(w, h, dp), walls[i % 4]); corpo.position.y = h / 2; corpo.castShadow = corpo.receiveShadow = true;
      const tel = new THREE.Mesh(new THREE.CylinderGeometry(0.01, dp * 0.62, w + 0.6, 4, 1).rotateZ(Math.PI / 2).rotateX(Math.PI / 4), roofs[i % 3]);
      tel.scale.set(1, 0.55, 1); tel.position.y = h + 1.4; tel.castShadow = true;
      g.add(corpo, tel); g.position.set(Math.sin(a) * d, 0, Math.cos(a) * d); g.lookAt(0, 0, 0); R.add(g);
    }
    // catedral simplificada ao fundo (bloco + cúpula), sem detalhes de marca
    const cat = new THREE.Group();
    const nave = new THREE.Mesh(new THREE.BoxGeometry(26, 11, 10), marmoreClaro); nave.position.y = 5.5; nave.castShadow = true;
    const cup = new THREE.Mesh(new THREE.SphereGeometry(4.5, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), tt({ color: "#c9643c" })); cup.position.y = 11;
    cat.add(nave, cup); cat.position.set(-17, 0, -14); cat.rotation.y = 0.5; R.add(cat);

    // a torre: base + 6 galerias + campanário; cada nível é um grupo empilhado (pivô no topo do anterior)
    const mat = marmore(), ALT = [3.4, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.4];
    let pai: THREE.Object3D = this.torre;
    ALT.forEach((h, i) => {
      const n = new THREE.Group();
      const r = i === 7 ? 2.1 : 3.0;
      const nucleo = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.82, r * 0.82, h, 32), mat); nucleo.position.y = h / 2; nucleo.castShadow = nucleo.receiveShadow = true;
      const anel = new THREE.Mesh(new THREE.CylinderGeometry(r + 0.18, r + 0.18, 0.28, 32), mat); anel.position.y = h - 0.14; anel.castShadow = true;
      n.add(nucleo, anel);
      const nCol = i === 0 ? 15 : i === 7 ? 12 : 22;
      for (let k = 0; k < nCol; k++) {
        const a = (k / nCol) * Math.PI * 2;
        const col = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, h - 0.5, 8), marmoreClaro);
        col.position.set(Math.sin(a) * r, (h - 0.28) / 2, Math.cos(a) * r); col.castShadow = true; n.add(col);
        const arco = new THREE.Mesh(new THREE.PlaneGeometry((Math.PI * 2 * r) / nCol * 0.62, h * 0.55), sombraArco);
        const a2 = a + Math.PI / nCol; arco.position.set(Math.sin(a2) * r * 0.83, h * 0.45, Math.cos(a2) * r * 0.83); arco.lookAt(Math.sin(a2) * 10, h * 0.45, Math.cos(a2) * 10);
        n.add(arco);
      }
      n.position.y = i === 0 ? 0 : ALT[i - 1];
      pai.add(n); this.niveis.push(n); pai = n;
    });
    R.add(this.torre);
    // andaime de madeira (aparece nos planos de obra)
    const madeira = tt({ color: "#9a6a3a" });
    for (let k = 0; k < 8; k++) {
      const a = (k / 8) * Math.PI * 2, p = new THREE.Mesh(new THREE.BoxGeometry(0.18, 9, 0.18), madeira);
      p.position.set(Math.sin(a) * 3.9, 4.5, Math.cos(a) * 3.9); p.castShadow = true; this.andaime.add(p);
    }
    for (let y = 1; y < 9; y += 2.2) { const anel = new THREE.Mesh(new THREE.TorusGeometry(3.9, 0.08, 6, 8), madeira); anel.rotation.x = Math.PI / 2; anel.position.y = y; this.andaime.add(anel); }
    R.add(this.andaime);
    // mato (abandono): tufos que crescem
    const tufo = tt({ color: "#4f8f3a" });
    for (let i = 0; i < 70; i++) {
      const a = i * 2.39996, d = 3.4 + (i % 9) * 0.6, m = new THREE.Mesh(new THREE.ConeGeometry(0.35, 1.3, 5), tufo);
      m.position.set(Math.sin(a) * d, 0, Math.cos(a) * d); m.castShadow = true; this.mato.add(m);
    }
    R.add(this.mato);
    // pedra que afunda (plano 3) e camadas de solo (plano 6)
    this.pedra = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.7, 0.9), mat); this.pedra.castShadow = true; R.add(this.pedra);
    ["#b98a52", "#8a6a48", "#6e5236", "#54402b"].forEach((c, i) => {
      const m = new THREE.Mesh(new THREE.CylinderGeometry(6 + i * 0.4, 6 + i * 0.4, 1.1, 48), tt({ color: c })); m.position.y = -0.55 - i * 1.1; m.castShadow = m.receiveShadow = true; this.solo.push(m); R.add(m);
    });
    // rachaduras e placa FECHADO (plano 9): texto dentro da cena, legível (não espelhado)
    const rach = new THREE.MeshBasicMaterial({ color: "#2a1f2e" });
    for (let i = 0; i < 6; i++) {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(0.06, 0.9 + (i % 3) * 0.4), rach);
      const a = 0.25 + i * 0.12; m.position.set(Math.sin(a) * 2.47, 1.0 + (i % 3) * 0.6, Math.cos(a) * 2.47); m.lookAt(Math.sin(a) * 10, m.position.y, Math.cos(a) * 10); m.rotateZ((i % 2 ? 1 : -1) * 0.4);
      this.rachaduras.add(m);
    }
    this.niveis[0].add(this.rachaduras);
    this.placa = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 1.0), new THREE.MeshBasicMaterial({ map: placaTex() }));
    const poste = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.4, 0.12), madeira); poste.position.y = -0.95;
    this.placa.add(poste); this.placa.position.set(1.6, 1.65, 4.6); this.placa.rotation.y = 0.12; R.add(this.placa);
    // nuvens pintadas (cartões sem tinta)
    this.nuvemMaps = { day: [0, 1, 2].map((s) => cloudHD(s)), golden: [0, 1, 2].map((s) => cloudHD(s, LOOK.golden.cloud)), night: [0, 1, 2].map((s) => cloudHD(s, NIGHT_LOOK.cloud)) };
    for (let i = 0; i < 9; i++) {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(90, 45), new THREE.MeshBasicMaterial({ map: this.nuvemMaps.day[i % 3], transparent: true, depthWrite: false, fog: false }));
      const a = (i / 9) * Math.PI * 2; m.position.set(Math.sin(a) * 420, 90 + (i % 3) * 30, Math.cos(a) * 420); m.layers.set(NOINK); R.add(m); this.nuvens.push(m);
    }
  }

  // ---------------- cartões ----------------
  private cartao(i: number) {
    while (this.cartoes.length <= i) {
      const cv = document.createElement("canvas"); cv.width = 600; cv.height = 1000;
      const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
      const mat = cardShade(new THREE.MeshLambertMaterial({ map: tex, alphaTest: 0.5, side: THREE.DoubleSide }));
      const mesh = new THREE.Mesh(GEO_CARTAO, mat); mesh.layers.set(NOINK); mesh.renderOrder = 1; mesh.receiveShadow = true;
      mesh.onBeforeRender = (r) => { const rt = r.getRenderTarget(); CARD_K.uPx.value = (rt ? rt.height : r.domElement.height) / 1920; };
      this.root.add(mesh); this.cartoes.push({ mesh, mat, cv, tex, chave: "" });
    }
    return this.cartoes[i];
  }
  private pose(i: number, o: Outfit, x: number, z: number, cam: THREE.Camera, opts: { expr?: Expr; mode?: "stand" | "stroll"; phase?: number; look?: number; wave?: number; tilt?: number; prop?: ["hammer", number] | null; escala?: number; y?: number; seed?: number; blink?: boolean; fx?: "puff" }) {
    const c = this.cartao(i), q = (v: number | undefined, k = 20) => Math.round((v ?? 0) * k) / k;
    const chave = JSON.stringify([o, opts.expr, opts.mode, q(opts.phase), q(opts.look), q(opts.wave), q(opts.tilt), opts.prop?.[1] !== undefined ? q(opts.prop[1], 4) : 0, opts.blink, opts.seed]);
    if (chave !== c.chave) {
      const g = c.cv.getContext("2d")!; g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, 600, 1000);
      bodyFront(new Pen(g), o, { expr: opts.expr ?? "neutral", mode: opts.mode ?? "stand", phase: opts.phase ?? 0, look: opts.look ?? 0, wave: opts.wave, tilt: opts.tilt ?? 0, prop: opts.prop ?? null, blink: opts.blink, seed: opts.seed ?? i + 1 });
      c.tex.needsUpdate = true; c.chave = chave;
    }
    c.mesh.visible = true; c.mesh.position.set(x, opts.y ?? 0, z); c.mesh.scale.setScalar(opts.escala ?? 1);
    const dx = cam.position.x - x, dz = cam.position.z - z; c.mesh.rotation.set(0, Math.atan2(dx, dz), 0); // gira só no eixo vertical
  }

  update(p: Plano, q: number, cam: THREE.PerspectiveCamera, scene: THREE.Scene) {
    const u = clamp01((q - p.a) / Math.max(1, p.b - p.a)), t = q / FPS, e: Estado = p.estado(u), L = PRESET[p.luz], K = LOOKS[p.luz];
    // câmera
    const c = p.cam(u);
    const respira = Math.sin(t * 0.9) * 0.03; // nada fica parado
    cam.position.set(c.pos[0], c.pos[1] + respira, c.pos[2]); cam.up.set(0, 1, 0); cam.lookAt(...c.look); cam.rotateZ(c.roll);
    cam.fov = c.fov; cam.near = 0.2; cam.far = 1500; cam.updateProjectionMatrix(); cam.updateMatrixWorld(); cam.layers.enable(NOINK);
    // luz: sol relativo à câmera, congelado por plano
    const fwd = new THREE.Vector3(c.look[0] - c.pos[0], 0, c.look[2] - c.pos[2]).normalize(), az = THREE.MathUtils.degToRad(L.az), el = THREE.MathUtils.degToRad(L.el);
    const right = new THREE.Vector3(fwd.z, 0, -fwd.x).multiplyScalar(-1);
    const sunDir = fwd.clone().multiplyScalar(Math.cos(az)).addScaledVector(right, Math.sin(az)).multiplyScalar(Math.cos(el)).add(new THREE.Vector3(0, Math.sin(el), 0)).normalize();
    const foco = new THREE.Vector3(...c.look);
    this.sun.position.copy(foco).addScaledVector(sunDir, 200); this.sun.target.position.copy(foco); this.sun.color.set(L.sunCol); this.sun.intensity = L.sunI;
    const sc = this.sun.shadow.camera, Rr = THREE.MathUtils.clamp(cam.position.distanceTo(foco) * 1.2 + 8, 14, 70);
    sc.left = -Rr; sc.right = Rr; sc.top = Rr; sc.bottom = -Rr; sc.near = 20; sc.far = 420; sc.updateProjectionMatrix();
    this.sun.shadow.bias = L.bias; this.sun.shadow.normalBias = L.normalBias * (Rr / 12);
    this.hemi.color.set(L.sky); this.hemi.groundColor.set(L.ground); this.hemi.intensity = L.hemiI;
    TONE.uLitCol.value.set(...L.lit); TONE.uShadeCol.value.set(...L.shade); TONE.uShadeLift.value.set(...L.lift);
    TONE.uLambert.value = L.lambert; TONE.uSideK.value = L.sideK; TONE.uTerm.value = L.term; TONE.uBounce.value.set(...K.bounce); TONE.uSat.value = K.sat;
    CHAR.uCharTint.value.set(...L.charTint); CHAR.uCharShade.value = L.charShade; CHAR.uGrad.value = L.charGrad; CHAR.uBodyGrad.value = L.bodyGrad; CHAR.uSideTint.value.set(...L.sideTint);
    const su = this.skyMat.uniforms; K.sky.c.forEach((h, i) => untone(h, su["c" + i].value));
    const ee = K.sky.e.map((d) => THREE.MathUtils.degToRad(d)); su.e.value.set(ee[1], ee[2], ee[3], ee[4]);
    this.sky.position.copy(cam.position);
    untone(L.fog, this.fog.color); this.fog.near = L.fogNear; this.fog.far = L.fogFar; scene.fog = this.fog; scene.background = null;
    this.nuvens.forEach((m, i) => { m.lookAt(cam.position.x, m.position.y, cam.position.z); (m.material as THREE.MeshBasicMaterial).map = this.nuvemMaps[p.luz][i % 3]; m.position.y += 0; m.rotation.z = 0; m.translateX(Math.sin(t * 0.05 + i) * 0.02); });

    // torre: níveis visíveis, inclinação no pivô da base, compensação nos de cima
    this.niveis.forEach((n, i) => { n.visible = i < e.andares; n.rotation.z = 0; });
    this.torre.rotation.set(0, 0, -THREE.MathUtils.degToRad(e.inclina));
    for (let i = 4; i < 8; i++) this.niveis[i].rotation.z = THREE.MathUtils.degToRad(0.35 * e.curva); // andares de cima tortos para o outro lado
    this.andaime.visible = (p.id === 2 || p.id === 4 || p.id === 5 || p.id === 7) && e.mato < 0.95;
    this.andaime.rotation.z = -THREE.MathUtils.degToRad(e.inclina) + e.mato * 0.5; this.andaime.scale.y = Math.max(0.35, 1 - e.mato * 0.6);
    this.mato.visible = e.mato > 0; this.mato.scale.set(1, Math.max(0.01, e.mato), 1);
    this.lama.visible = p.id <= 5;
    this.grama.visible = this.praca.visible = p.id !== 6; // plano 6: corte do terreno mostrando as camadas
    this.rachaduras.visible = e.fechado; this.placa.visible = e.fechado;
    // pedra afundando no plano 3 (o chão "engole" a pedra, com quique leve)
    this.pedra.visible = p.id === 3;
    if (p.id === 3) { const k = smooth(u * 1.3); this.pedra.position.set(3.2, 0.35 - k * 0.45 + Math.sin(t * 6) * 0.01 * (1 - k), 4.3); this.pedra.rotation.set(0, 0.4, k * 0.12); }
    // camadas de solo firmando no plano 6
    this.solo.forEach((m, i) => { m.visible = p.id === 6; m.scale.y = 1 - 0.25 * smooth(u) * (i + 1) / 3; });
    if (p.id === 6) { this.torre.position.y = -0.05 * smooth(u); } else this.torre.position.y = 0;

    // elenco por plano
    this.cartoes.forEach((cc) => (cc.mesh.visible = false));
    const idle = (s: number) => Math.sin(t * 2 + s) * 0.04;
    const blink = (s: number) => ((q + s * 37) % 95) < 3;
    if (p.id === 1) this.pose(0, PEDREIRO, 3.4, 7.0, cam, { expr: "stern", look: -0.6, tilt: idle(1), blink: blink(1) });
    if (p.id === 2) {
      this.pose(0, PREFEITO, 4.5, 6.5, cam, { expr: "grin", wave: 0.6 + idle(2) * 4, tilt: idle(2), blink: blink(2) });
      this.pose(1, PEDREIRO, 6.5, 4.0, cam, { expr: "neutral", look: -0.4, blink: blink(3) });
      this.pose(2, PEDREIRO2, 3.0, 2.0, cam, { expr: "smile", look: 0.3, blink: blink(4) });
    }
    if (p.id === 3) { this.pose(0, PEDREIRO, 2.0, 5.4, cam, { expr: "nervous", look: 0.5, y: -0.25 * smooth(u * 1.3), blink: blink(5) }); }
    if (p.id === 4) {
      const cai = q >= palavra("pendia") ? 1 : 0;
      this.pose(0, PEDREIRO, 6.5, 6.5, cam, { expr: cai ? "shock" : "neutral", prop: cai ? null : ["hammer", 0], tilt: idle(6), blink: blink(6) });
      this.pose(1, PEDREIRO2, 8.0, 3.6, cam, { expr: cai ? "nervous" : "neutral", look: -0.3, blink: blink(7) });
    }
    if (p.id === 7) {
      [VELHO, VELHO, PEDREIRO2].forEach((o, i) => this.pose(i, o, 6.5 + i * 1.8, 6.0 - i * 1.6, cam, { expr: i === 1 ? "smile_closed" : "neutral", mode: "stroll", phase: t * 0.8 + i * 0.3, blink: blink(8 + i) }));
    }
    if (p.id === 9) this.pose(0, ENGENHEIRO, -0.2, 6.2, cam, { expr: "nervous", look: -0.6, blink: blink(11) });
    if (p.id === 10) {
      [0, 1, 2].forEach((i) => this.pose(i, ENGENHEIRO, -2.0 + i * 1.6, 5.6 + i * 0.4, cam, { expr: i === 0 ? "stern" : "neutral", prop: ["hammer", (Math.sin(t * 5 + i * 2) + 1) / 2], blink: blink(12 + i) }));
    }
    if (p.id === 12) {
      TURISTAS.forEach((o, i) => this.pose(i, o, -3.5 - i * 1.3, 15 + i * 1.3, cam, { expr: i % 2 ? "laugh" : "grin", wave: 0.9, tilt: 0.12 + idle(i) * 2, blink: blink(20 + i) }));
    }
  }
}
export { fxPuff, fxCloud };
