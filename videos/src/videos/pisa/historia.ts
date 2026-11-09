// "A Torre Que Entortou Antes de Ficar Pronta": linha do tempo, planos e câmeras.
// Os planos começam nas palavras da locução (legenda.json, gerada por alinhar_locucao.py) e cada reação cai
// 0–3 quadros antes da palavra. Tudo aqui é função pura do quadro.
import legenda from "./legenda.json";

export const FPS = 30;
export type V3 = [number, number, number];
export type Luz = "day" | "golden" | "night";
type Palavra = { w: string; s: number; e: number; fala: number };
const P = legenda as Palavra[];

export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
export const smooth = (x: number) => { const u = clamp01(x); return u * u * (3 - 2 * u); };
export const easeOut = (u: number) => 1 - (1 - clamp01(u)) ** 3;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerp3 = (a: V3, b: V3, t: number): V3 => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];

/** quadro do início da fala n (0 = primeira frase), 2 quadros antes da primeira palavra */
const falaIni = (n: number) => { const w = P.find((p) => p.fala === n); return w ? Math.max(0, Math.round(w.s * FPS) - 2) : 0; };
/** quadro da palavra (n-ésima ocorrência), 2 quadros antes */
export const palavra = (txt: string, n = 1) => {
  const norm = (s: string) => s.toLowerCase().replace(/[.,:;?!]/g, "");
  const w = P.filter((p) => norm(p.w) === norm(txt))[n - 1];
  return w ? Math.max(0, Math.round(w.s * FPS) - 2) : 0;
};
export const TOTAL = Math.round(((P[P.length - 1]?.e ?? 30) + 0.9) * FPS);

// ---------------- estado da história ----------------
export type Estado = {
  andares: number; // quantos níveis da torre estão construídos (0..8)
  inclina: number; // inclinação da torre em graus
  curva: number; // compensação dos andares de cima (0 = reta, 1 = "banana")
  mato: number; // 0..1 abandono (mato crescendo, andaime caído)
  fechado: boolean; // placa FECHADO + rachaduras
  turistas: boolean;
};

export type Plano = {
  id: number; a: number; b: number; luz: Luz;
  cam: (u: number) => { pos: V3; look: V3; fov: number; roll: number };
  estado: (u: number) => Estado;
  dof: number; // cInf em px (0 = tudo nítido)
};

const base: Estado = { andares: 8, inclina: 4, curva: 1, mato: 0, fechado: false, turistas: false };
const TORRE: V3 = [0, 0, 0];
const orbit = (raio: number, ang: number, alt: number, alvoY: number, fov = 40) => ({
  pos: [Math.sin(ang) * raio, alt, Math.cos(ang) * raio] as V3, look: [TORRE[0], alvoY, TORRE[2]] as V3, fov, roll: 0,
});

const f = (n: number) => falaIni(n);
export const PLANOS: Plano[] = [
  // 1 gancho: plano médio da torre torta com o pedreiro medindo com a régua
  { id: 1, a: 0, b: f(1), luz: "day", dof: 10,
    cam: (u) => ({ pos: lerp3([7, 1.7, 16], [6.2, 1.8, 14], smooth(u)), look: [1.2, 3.6, 0], fov: 40, roll: 0 }),
    estado: () => ({ ...base, andares: 4, inclina: 5, curva: 0 }) },
  // 2 revelação aberta: a cidade medieval e o prefeito apontando o terreno vazio
  { id: 2, a: f(1), b: f(2), luz: "day", dof: 0,
    cam: (u) => orbit(lerp(38, 30, smooth(u)), lerp(0.9, 0.6, smooth(u)), lerp(16, 11, smooth(u)), 2),
    estado: () => ({ ...base, andares: 1, inclina: 0, curva: 0 }) },
  // 3 detalhe: o chão mole, a pedra afunda
  { id: 3, a: f(2), b: f(3), luz: "day", dof: 12,
    cam: (u) => ({ pos: lerp3([5.2, 1.0, 8.4], [4.7, 0.8, 7.4], smooth(u)), look: [3.2, 0.25, 4.3], fov: 38, roll: 0 }),
    estado: () => ({ ...base, andares: 1, inclina: 0.5, curva: 0 }) },
  // 4 terceiro andar: a torre pende, o martelo cai
  { id: 4, a: f(3), b: f(4), luz: "day", dof: 6,
    cam: (u) => orbit(lerp(21, 18, smooth(u)), -0.35, 3.0, 4),
    estado: (u) => ({ ...base, andares: 3, inclina: lerp(0.5, 3.5, easeOut(u * 1.4)), curva: 0 }) },
  // 5 a guerra: luz dourada, obra abandonada, o mato cresce; flash branco no fim (pulo de tempo)
  { id: 5, a: f(4), b: f(5), luz: "golden", dof: 0,
    cam: (u) => orbit(lerp(22, 25, smooth(u)), lerp(-0.9, -1.15, smooth(u)), 5, 3),
    estado: (u) => ({ ...base, andares: 3, inclina: 3.5, curva: 0, mato: smooth(u * 1.2) }) },
  // 6 explicação (noite-azul): o chão firma sob a torre
  { id: 6, a: f(5), b: f(6), luz: "night", dof: 0,
    cam: (u) => ({ pos: lerp3([13, 1.0, 13], [12, 1.8, 12], smooth(u)), look: [0, 1.6, 0], fov: 42, roll: 0 }),
    estado: () => ({ ...base, andares: 3, inclina: 3.5, curva: 0, mato: 1 }) },
  // 7 a volta: pedreiros velhos empilham os andares de cima tortos para o outro lado
  { id: 7, a: f(6), b: f(7), luz: "day", dof: 6,
    cam: (u) => orbit(lerp(27, 33, smooth(u)), lerp(0.25, 0.5, smooth(u)), lerp(5, 9, smooth(u)), lerp(6, 9, smooth(u))),
    estado: (u) => ({ ...base, andares: Math.round(lerp(3, 8, clamp01(u * 1.25))), inclina: 4, curva: smooth(u) }) },
  // 8 dois séculos: volta lenta em torno da torre pronta, luz dourada
  { id: 8, a: f(7), b: f(8), luz: "golden", dof: 0,
    cam: (u) => orbit(36, lerp(1.4, 2.2, smooth(u)), 8, 9),
    estado: () => ({ ...base }) },
  // 9 1990: noite-azul, rachaduras e placa FECHADO
  { id: 9, a: f(8), b: f(9), luz: "night", dof: 8,
    cam: (u) => ({ pos: lerp3([2.8, 1.8, 13.0], [2.6, 1.8, 12.0], smooth(u)), look: [1.6, 1.9, 4.6], fov: 40, roll: 0 }),
    estado: () => ({ ...base, fechado: true }) },
  // 10 engenheiros cavam por baixo; a torre volta um pouquinho
  { id: 10, a: f(9), b: f(10), luz: "day", dof: 6,
    cam: (u) => orbit(lerp(31, 27, smooth(u)), lerp(-0.6, -0.4, smooth(u)), 3.5, 6.5),
    estado: (u) => ({ ...base, inclina: lerp(4.6, 4.0, smooth(u * 1.3)), fechado: false }) },
  // 11 "Mas não deixaram reta." sting: aproximação com leve giro
  { id: 11, a: f(10), b: f(11), luz: "day", dof: 10,
    cam: (u) => ({ ...orbit(lerp(36, 27, easeOut(u)), 0.1, 6, 9, 40), roll: lerp(0, 0.06, easeOut(u)) }),
    estado: () => ({ ...base }) },
  // 12 fecho: a fila de turistas empurrando a torre na foto
  { id: 12, a: f(11), b: TOTAL, luz: "day", dof: 0,
    cam: (u) => ({ pos: lerp3([-9, 1.8, 25], [-10.5, 2.4, 29], smooth(u)), look: [0.5, 6, 0], fov: 42, roll: 0 }),
    estado: () => ({ ...base, turistas: true }) },
];

export const planoEm = (q: number) => PLANOS.find((p) => q >= p.a && q < p.b) ?? PLANOS[PLANOS.length - 1];
export const FLASH_AT = f(5) - 3; // pulo de tempo da guerra (6 quadros de flash branco)
export const STING_AT = palavra("reta.");
