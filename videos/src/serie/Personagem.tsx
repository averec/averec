import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

export type Humor = "neutro" | "preocupado" | "esperto" | "assustado";

// Bento: personagem original da série (gorro vermelho, bigode, jaqueta mostarda).
// Usado nos placeholders de cena até existirem ilustrações definitivas.
export const Personagem: React.FC<{ humor?: Humor; escala?: number }> = ({
  humor = "neutro",
  escala = 1,
}) => {
  const f = useCurrentFrame();
  const respira = Math.sin(f / 12) * 4;
  const piscar = f % 90 > 84 ? 0.15 : 1;
  const sobrancelha = {
    neutro: 0,
    preocupado: 10,
    esperto: -8,
    assustado: 16,
  }[humor];
  const boca =
    humor === "esperto"
      ? "M -34 70 Q 0 92 40 62"
      : humor === "assustado"
        ? "M -16 74 Q 0 58 16 74 Q 0 90 -16 74"
        : humor === "preocupado"
          ? "M -30 80 Q 0 64 30 80"
          : "M -28 74 L 28 74";
  const suor = humor === "preocupado" || humor === "assustado";
  const gota = interpolate(f % 40, [0, 40], [0, 30]);
  return (
    <svg
      viewBox="-300 -420 600 900"
      width={600 * escala}
      height={900 * escala}
      style={{ overflow: "visible" }}
    >
      <g transform={`translate(0 ${respira})`}>
        {/* corpo / jaqueta */}
        <path
          d="M -170 470 Q -190 250 -110 190 L 110 190 Q 190 250 170 470 Z"
          fill="#C9962B"
          stroke="#1a1a1a"
          strokeWidth={8}
        />
        <path d="M 0 195 L 0 470" stroke="#1a1a1a" strokeWidth={6} />
        <rect x={-60} y={300} width={40} height={50} rx={6} fill="#A97C1F" stroke="#1a1a1a" strokeWidth={5} />
        {/* pescoço */}
        <rect x={-35} y={150} width={70} height={50} fill="#E7B98F" stroke="#1a1a1a" strokeWidth={7} />
        {/* cabeça */}
        <ellipse cx={0} cy={20} rx={150} ry={165} fill="#F1C9A0" stroke="#1a1a1a" strokeWidth={8} />
        {/* gorro */}
        <path
          d="M -158 -10 Q -160 -190 0 -195 Q 160 -190 158 -10 Z"
          fill="#C8352E"
          stroke="#1a1a1a"
          strokeWidth={8}
        />
        <rect x={-170} y={-40} width={340} height={56} rx={22} fill="#A52A24" stroke="#1a1a1a" strokeWidth={8} />
        <circle cx={0} cy={-205} r={30} fill="#C8352E" stroke="#1a1a1a" strokeWidth={8} />
        {/* sobrancelhas */}
        <path d={`M -95 ${28 - sobrancelha} L -35 ${28 + sobrancelha / 2}`} stroke="#1a1a1a" strokeWidth={12} strokeLinecap="round" />
        <path d={`M 95 ${28 - sobrancelha} L 35 ${28 + sobrancelha / 2}`} stroke="#1a1a1a" strokeWidth={12} strokeLinecap="round" />
        {/* olhos */}
        <ellipse cx={-62} cy={8 + 70} rx={14} ry={20 * piscar} fill="#1a1a1a" transform="translate(0 -18)" />
        <ellipse cx={62} cy={8 + 70} rx={14} ry={20 * piscar} fill="#1a1a1a" transform="translate(0 -18)" />
        {/* bigode */}
        <path
          d="M -70 100 Q -35 78 0 94 Q 35 78 70 100 Q 40 112 0 104 Q -40 112 -70 100 Z"
          fill="#3b2a1e"
          stroke="#1a1a1a"
          strokeWidth={5}
        />
        <path d={boca} transform="translate(0 52)" fill="none" stroke="#1a1a1a" strokeWidth={8} strokeLinecap="round" />
        {suor && (
          <path
            d={`M 135 ${-10 + gota} q 12 22 0 30 q -12 -8 0 -30 Z`}
            fill="#8fd3ff"
            stroke="#1a1a1a"
            strokeWidth={4}
            opacity={interpolate(gota, [0, 25, 30], [1, 1, 0])}
          />
        )}
      </g>
    </svg>
  );
};
