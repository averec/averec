import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

export type Humor = "neutro" | "preocupado" | "esperto" | "assustado";

// Bento em estilo "brinquedo de montar": personagem original da série (gorro vermelho,
// bigode, jaqueta mostarda), com cabeça cilíndrica, corpo em bloco e mãos em C.
// Mesma API e mesma caixa (viewBox) da versão anterior, para os cenários não mudarem.

const PLASTICO = "#F4C430";
const PLASTICO_SOMBRA = "#D9A514";
const CONTORNO = "#1a1a1a";

export const Personagem: React.FC<{ humor?: Humor; escala?: number }> = ({ humor = "neutro", escala = 1 }) => {
  const f = useCurrentFrame();
  // brinquedo não "respira": dá pulinhos curtos e secos
  const pulo = Math.abs(Math.sin(f / 9)) * -6;
  const piscar = f % 90 > 85 ? 0.15 : 1;
  const sob = { neutro: 0, preocupado: 9, esperto: -7, assustado: 14 }[humor];
  const boca =
    humor === "esperto"
      ? "M -30 62 Q 0 82 34 56"
      : humor === "assustado"
        ? "M -14 66 Q 0 50 14 66 Q 0 82 -14 66"
        : humor === "preocupado"
          ? "M -26 72 Q 0 58 26 72"
          : "M -24 66 L 24 66";
  const suor = humor === "preocupado" || humor === "assustado";
  const gota = interpolate(f % 40, [0, 40], [0, 26]);
  const braco = humor === "assustado" ? -18 : humor === "esperto" ? 8 : 0;

  return (
    <svg viewBox="-300 -420 600 900" width={600 * escala} height={900 * escala} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="bloco-cabeca" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={PLASTICO_SOMBRA} />
          <stop offset="0.35" stopColor={PLASTICO} />
          <stop offset="0.7" stopColor="#FFD95A" />
          <stop offset="1" stopColor={PLASTICO_SOMBRA} />
        </linearGradient>
        <linearGradient id="bloco-jaqueta" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#A97C1F" />
          <stop offset="0.5" stopColor="#D2A033" />
          <stop offset="1" stopColor="#A97C1F" />
        </linearGradient>
        <linearGradient id="bloco-calca" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#2a3f66" />
          <stop offset="0.5" stopColor="#3b5688" />
          <stop offset="1" stopColor="#2a3f66" />
        </linearGradient>
      </defs>
      <g transform={`translate(0 ${pulo})`}>
        {/* pernas (blocos curtos) */}
        <rect x={-120} y={360} width={240} height={30} rx={6} fill="#22324f" stroke={CONTORNO} strokeWidth={7} />
        <rect x={-116} y={386} width={110} height={86} rx={8} fill="url(#bloco-calca)" stroke={CONTORNO} strokeWidth={7} />
        <rect x={6} y={386} width={110} height={86} rx={8} fill="url(#bloco-calca)" stroke={CONTORNO} strokeWidth={7} />

        {/* braço esquerdo + mão em C */}
        <g transform={`rotate(${10 - braco} -150 190)`}>
          <path d="M -150 170 L -205 300 L -165 316 L -118 200 Z" fill="url(#bloco-jaqueta)" stroke={CONTORNO} strokeWidth={7} strokeLinejoin="round" />
          <path d="M -214 312 a 30 30 0 1 0 50 10 l -14 -6 a 15 15 0 1 1 -24 -4 Z" fill={PLASTICO} stroke={CONTORNO} strokeWidth={6} />
        </g>
        {/* braço direito + mão em C */}
        <g transform={`rotate(${-10 + braco} 150 190)`}>
          <path d="M 150 170 L 205 300 L 165 316 L 118 200 Z" fill="url(#bloco-jaqueta)" stroke={CONTORNO} strokeWidth={7} strokeLinejoin="round" />
          <path d="M 214 312 a 30 30 0 1 1 -50 10 l 14 -6 a 15 15 0 1 0 24 -4 Z" fill={PLASTICO} stroke={CONTORNO} strokeWidth={6} />
        </g>

        {/* tronco trapezoidal */}
        <path d="M -105 160 L 105 160 L 140 365 L -140 365 Z" fill="url(#bloco-jaqueta)" stroke={CONTORNO} strokeWidth={8} strokeLinejoin="round" />
        {/* estampa: gola, zíper e bolso */}
        <path d="M -60 160 L 0 215 L 60 160" fill="#7a5714" stroke={CONTORNO} strokeWidth={6} strokeLinejoin="round" />
        <path d="M 0 215 L 0 362" stroke={CONTORNO} strokeWidth={5} />
        <rect x={30} y={270} width={50} height={36} rx={5} fill="#A97C1F" stroke={CONTORNO} strokeWidth={5} />
        <path d="M -90 175 L -70 350" stroke="#fff" strokeOpacity={0.25} strokeWidth={10} strokeLinecap="round" />

        {/* pescoço */}
        <rect x={-40} y={126} width={80} height={38} rx={4} fill={PLASTICO_SOMBRA} stroke={CONTORNO} strokeWidth={7} />

        {/* cabeça cilíndrica */}
        <rect x={-118} y={-110} width={236} height={240} rx={46} fill="url(#bloco-cabeca)" stroke={CONTORNO} strokeWidth={8} />
        <path d="M -88 -70 L -88 90" stroke="#fff" strokeOpacity={0.35} strokeWidth={12} strokeLinecap="round" />

        {/* gorro (peça encaixada) com pino no topo */}
        <path d="M -128 -40 Q -130 -190 0 -192 Q 130 -190 128 -40 Z" fill="#C8352E" stroke={CONTORNO} strokeWidth={8} />
        <rect x={-136} y={-66} width={272} height={48} rx={14} fill="#A52A24" stroke={CONTORNO} strokeWidth={8} />
        <rect x={-34} y={-228} width={68} height={42} rx={8} fill="#C8352E" stroke={CONTORNO} strokeWidth={7} />
        <ellipse cx={0} cy={-228} rx={34} ry={10} fill="#E04A42" stroke={CONTORNO} strokeWidth={6} />
        <path d="M -100 -120 Q -95 -170 -40 -180" stroke="#fff" strokeOpacity={0.3} strokeWidth={10} fill="none" strokeLinecap="round" />

        {/* rosto impresso */}
        <path d={`M -72 ${2 - sob} L -26 ${4 + sob / 2}`} stroke={CONTORNO} strokeWidth={10} strokeLinecap="round" />
        <path d={`M 72 ${2 - sob} L 26 ${4 + sob / 2}`} stroke={CONTORNO} strokeWidth={10} strokeLinecap="round" />
        <ellipse cx={-46} cy={26} rx={12} ry={16 * piscar} fill={CONTORNO} />
        <ellipse cx={46} cy={26} rx={12} ry={16 * piscar} fill={CONTORNO} />
        <circle cx={-42} cy={20} r={4} fill="#fff" opacity={piscar} />
        <circle cx={50} cy={20} r={4} fill="#fff" opacity={piscar} />
        <path d="M -60 52 Q -30 34 0 48 Q 30 34 60 52 Q 34 62 0 56 Q -34 62 -60 52 Z" fill="#3b2a1e" stroke={CONTORNO} strokeWidth={4} />
        <path d={boca} transform="translate(0 20)" fill="none" stroke={CONTORNO} strokeWidth={7} strokeLinecap="round" />

        {suor && (
          <path
            d={`M 104 ${-20 + gota} q 11 20 0 28 q -11 -8 0 -28 Z`}
            fill="#8fd3ff"
            stroke={CONTORNO}
            strokeWidth={4}
            opacity={interpolate(gota, [0, 22, 26], [1, 1, 0])}
          />
        )}
      </g>
    </svg>
  );
};
