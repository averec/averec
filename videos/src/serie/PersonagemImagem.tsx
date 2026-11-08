import React, { createContext, useContext } from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import type { Humor } from "./Personagem";
import type { Palavra } from "./Legenda";

// Personagem da série animado a partir da arte do usuário (public/personagem/bento.png).
// A imagem é recortada em partes (cabeça, corpo, mãos) que se movem em torno de pivôs, e o rosto
// recebe piscadas e boca que fala junto com a narração.
// Coordenadas abaixo estão em pixels da imagem recortada (678×1224).

const L = 678;
const A = 1224;
const PELE = "rgb(250,196,154)";
const PESCOCO = { x: 360, y: 350 };
const MAO_E = { x: 0, y: 668, w: 178, h: 144, px: 135, py: 688 };
const MAO_D = { x: 515, y: 725, w: 163, h: 125, px: 565, py: 748 };
const OLHO_E = { cx: 325, cy: 232, rx: 36, ry: 28 };
const OLHO_D = { cx: 421, cy: 252, rx: 34, ry: 26 };
const BOCA = { cx: 377, cy: 297 };

/** Narração do episódio e o início (s) do plano atual, para a boca falar sincronizada. */
export const FalaContext = createContext<{ palavras: Palavra[]; inicio: number } | null>(null);

const useFala = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ctx = useContext(FalaContext);
  if (!ctx) return { abertura: 0, inicioPalavra: false, t: f / fps };
  const t = f / fps + ctx.inicio;
  const p = ctx.palavras.find((w) => t >= w.s && t <= w.e);
  if (!p) return { abertura: 0, inicioPalavra: false, t };
  const local = t - p.s;
  return { abertura: 0.35 + 0.65 * Math.abs(Math.sin(local * 17)), inicioPalavra: local < 0.12, t };
};

const Palpebra: React.FC<{ o: typeof OLHO_E; fechado: number }> = ({ o, fechado }) => {
  if (fechado <= 0) return null;
  const h = o.ry * 2 * fechado;
  return (
    <g>
      <clipPath id={`olho-${o.cx}`}>
        <ellipse cx={o.cx} cy={o.cy} rx={o.rx + 4} ry={o.ry + 4} />
      </clipPath>
      <g clipPath={`url(#olho-${o.cx})`}>
        <rect x={o.cx - o.rx - 6} y={o.cy - o.ry - 6} width={o.rx * 2 + 12} height={h + 6} fill={PELE} />
        <path d={`M ${o.cx - o.rx} ${o.cy - o.ry + h} Q ${o.cx} ${o.cy - o.ry + h + 6} ${o.cx + o.rx} ${o.cy - o.ry + h}`} stroke="#111" strokeWidth={5} fill="none" />
      </g>
    </g>
  );
};

const Boca: React.FC<{ abertura: number; humor: Humor }> = ({ abertura, humor }) => {
  if (abertura <= 0 && humor !== "assustado") return null;
  const ab = humor === "assustado" ? Math.max(abertura, 0.6) : abertura;
  return (
    <g>
      <ellipse cx={BOCA.cx} cy={BOCA.cy + 2} rx={30} ry={13} fill={PELE} />
      <ellipse cx={BOCA.cx} cy={BOCA.cy + 2} rx={15 + ab * 4} ry={2 + ab * 11} fill="#3a1414" stroke="#111" strokeWidth={3} />
      {ab > 0.5 && <ellipse cx={BOCA.cx} cy={BOCA.cy + 6 + ab * 4} rx={8} ry={3 + ab * 2} fill="#d35d6e" />}
    </g>
  );
};

export const PersonagemImagem: React.FC<{ humor?: Humor; altura: number }> = ({ humor = "neutro", altura }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { abertura, inicioPalavra, t } = useFala();
  const falando = abertura > 0;

  // corpo inteiro: entrada com quique, pulinhos, inclinação e tremor conforme o humor
  const entra = spring({ frame: f, fps, config: { damping: 11, stiffness: 160 } });
  const achata = interpolate(entra, [0, 1], [0.85, 1]);
  const pulo = Math.abs(Math.sin(f / 10)) * (humor === "esperto" ? -12 : -4);
  const tremor = humor === "assustado" ? Math.sin(f * 2.3) * 5 : 0;
  const inclina = { neutro: 0, preocupado: -2.5, esperto: 3, assustado: 0 }[humor] + Math.sin(f / 22) * 1;
  const respira = 1 + Math.sin(f / 14) * 0.008;

  // cabeça: balanço lento + aceno no começo das palavras
  const aceno = inicioPalavra ? 2.5 : 0;
  const cabeca =
    Math.sin(t * 1.7) * 2.2 + (humor === "preocupado" ? -4 : humor === "esperto" ? 3 : 0) + (falando ? Math.sin(t * 5) * 1.2 : 0);

  // mãos: gesticulam enquanto fala
  const gesto = falando ? Math.sin(t * 4.2) * 7 : Math.sin(t * 1.3) * 2;
  const maoE = (humor === "assustado" ? -14 : 0) + gesto;
  const maoD = (humor === "assustado" ? 14 : 0) - gesto * 0.8;

  // piscada a cada ~3 s (duas piscadas seguidas de vez em quando)
  const ciclo = f % 95;
  const fechado = ciclo < 3 ? [0.5, 1, 0.5][ciclo] : ciclo > 9 && ciclo < 12 && f % 285 < 95 ? [0.5, 1, 0.5][ciclo - 9] : 0;

  const img = staticFile("personagem/bento.png");
  return (
    <div
      style={{
        height: altura,
        width: (altura * L) / A,
        transformOrigin: "bottom center",
        transform: `translate(${tremor}px, ${pulo}px) rotate(${inclina}deg) scale(${2 - achata}, ${achata * respira})`,
        filter: "drop-shadow(0 18px 24px rgba(0,0,0,.45))",
      }}
    >
      {/* <Img> invisível segura o quadro até a arte carregar (o <image> do SVG não espera) */}
      <Img src={img} style={{ position: "absolute", width: 1, height: 1, opacity: 0 }} />
      <svg viewBox={`0 0 ${L} ${A}`} width="100%" height="100%" style={{ overflow: "visible" }}>
        <defs>
          <clipPath id="corpo" clipRule="evenodd">
            <path
              clipRule="evenodd"
              d={`M0 ${PESCOCO.y - 4} H${L} V${A} H0 Z M${MAO_E.x} ${MAO_E.y} h${MAO_E.w} v${MAO_E.h} h-${MAO_E.w} Z M${MAO_D.x} ${MAO_D.y} h${MAO_D.w} v${MAO_D.h} h-${MAO_D.w} Z`}
            />
          </clipPath>
          <clipPath id="cabeca">
            <rect x={0} y={0} width={L} height={PESCOCO.y + 2} />
          </clipPath>
          <clipPath id="mao-e">
            <rect x={MAO_E.x} y={MAO_E.y} width={MAO_E.w} height={MAO_E.h} />
          </clipPath>
          <clipPath id="mao-d">
            <rect x={MAO_D.x} y={MAO_D.y} width={MAO_D.w} height={MAO_D.h} />
          </clipPath>
        </defs>

        <image href={img} width={L} height={A} clipPath="url(#corpo)" />
        <g transform={`rotate(${maoE} ${MAO_E.px} ${MAO_E.py})`}>
          <image href={img} width={L} height={A} clipPath="url(#mao-e)" />
        </g>
        <g transform={`rotate(${maoD} ${MAO_D.px} ${MAO_D.py})`}>
          <image href={img} width={L} height={A} clipPath="url(#mao-d)" />
        </g>
        <g transform={`translate(0 ${aceno}) rotate(${cabeca} ${PESCOCO.x} ${PESCOCO.y})`}>
          <image href={img} width={L} height={A} clipPath="url(#cabeca)" />
          <Palpebra o={OLHO_E} fechado={fechado} />
          <Palpebra o={OLHO_D} fechado={fechado} />
          <Boca abertura={abertura} humor={humor} />
        </g>
      </svg>
    </div>
  );
};
