import React from "react";
import { useCurrentFrame } from "remotion";

// Sala da casa velha: papel de parede, janela com luz neon, buraco na parede com maços de
// dinheiro, entulho e poeira no chão. Desenho em 1080×1920, coordenadas fixas (sem aleatório).

const MACOS = [
  [0, 0], [96, 0], [192, 0],
  [20, -46], [116, -46], [212, -46],
  [48, -92], [144, -92],
  [80, -138],
];

const ENTULHO: [number, number, number, number][] = [
  // x, y, tamanho, rotação
  [650, 1300, 46, 12], [712, 1318, 34, -20], [770, 1296, 54, 35], [835, 1322, 30, 8],
  [880, 1302, 42, -30], [945, 1320, 36, 50], [700, 1286, 26, 70], [820, 1284, 24, -45],
  [760, 1330, 22, 15], [905, 1333, 20, -10],
];

const Maco: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect width={88} height={40} rx={4} fill="#8CC48A" stroke="#1f3d1e" strokeWidth={4} />
    <rect x={6} y={6} width={76} height={28} rx={3} fill="none" stroke="#5f9a5d" strokeWidth={2} />
    <circle cx={44} cy={20} r={9} fill="none" stroke="#3E6B3D" strokeWidth={3} />
    <rect x={36} y={-2} width={16} height={44} fill="#E9DFC4" stroke="#1f3d1e" strokeWidth={3} />
  </g>
);

export const CenarioParede: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <svg viewBox="0 0 1080 1920" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0 }}>
      <defs>
        <pattern id="papel" width="90" height="90" patternUnits="userSpaceOnUse">
          <rect width="90" height="90" fill="#5a2a3c" />
          <path d="M45 10 q12 18 0 35 q-12 -17 0 -35 Z M0 55 q12 18 0 35 M90 55 q-12 18 0 35" fill="#6b3449" stroke="#4a2131" strokeWidth="2" />
        </pattern>
        <pattern id="tabuas" width="180" height="60" patternUnits="userSpaceOnUse">
          <rect width="180" height="60" fill="#5b3a26" />
          <path d="M0 59 H180 M120 0 V60" stroke="#3a2416" strokeWidth="4" />
          <path d="M20 25 q30 -6 60 0" stroke="#6d4730" strokeWidth="3" fill="none" />
        </pattern>
        <radialGradient id="neon" cx="0.25" cy="0.18" r="0.75">
          <stop offset="0" stopColor="#ff5fae" stopOpacity="0.55" />
          <stop offset="0.45" stopColor="#ff5fae" stopOpacity="0.12" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="vinheta" cx="0.5" cy="0.45" r="0.75">
          <stop offset="0.55" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.65" />
        </radialGradient>
        <linearGradient id="buraco" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#120807" />
          <stop offset="1" stopColor="#2a1610" />
        </linearGradient>
      </defs>

      {/* parede e chão */}
      <rect width="1080" height="1360" fill="url(#papel)" />
      <rect y="1330" width="1080" height="40" fill="#2e1a12" />
      <rect y="1370" width="1080" height="550" fill="url(#tabuas)" />

      {/* janela com persiana e luz neon */}
      <rect x="70" y="230" width="300" height="330" fill="#2b1a14" />
      <rect x="86" y="246" width="268" height="298" fill="#ff7fc0" />
      {Array.from({ length: 14 }).map((_, i) => (
        <rect key={i} x="86" y={250 + i * 21} width="268" height="12" fill="#7a2450" />
      ))}
      <rect x="60" y="555" width="320" height="22" fill="#3a241a" />

      {/* quadro torto */}
      <g transform="rotate(-4 640 330)">
        <rect x="560" y="260" width="160" height="130" fill="#3a241a" />
        <rect x="574" y="274" width="132" height="102" fill="#c9b48a" />
        <path d="M574 376 L620 320 L650 350 L680 315 L706 376 Z" fill="#7f8f62" />
      </g>

      {/* buraco na parede */}
      <path
        d="M640 640 L700 600 L760 628 L820 590 L880 622 L955 608 L990 680 L975 760 L1000 840 L960 930 L870 950 L790 930 L700 955 L650 880 L620 790 L640 720 Z"
        fill="#d8c3a5"
      />
      <path
        d="M662 660 L712 628 L765 650 L822 616 L878 646 L940 634 L966 690 L952 762 L972 836 L940 908 L866 924 L792 906 L706 928 L668 866 L644 790 L660 726 Z"
        fill="url(#buraco)"
      />
      {/* tijolos aparentes na borda */}
      {[[700, 640], [830, 628], [930, 660], [955, 800], [690, 900], [880, 905]].map(([x, y], i) => (
        <rect key={i} x={x - 22} y={y - 10} width="44" height="20" rx="3" fill="#a35a3c" stroke="#5a2e1d" strokeWidth="3" />
      ))}
      {/* rachaduras */}
      <path d="M640 640 L600 610 L585 560 M600 610 L560 620 M990 680 L1040 650 M1000 840 L1060 860 L1075 900 M700 955 L680 1010 L700 1060 M960 930 L990 990" stroke="#2a1218" strokeWidth="5" fill="none" strokeLinecap="round" />

      {/* maços de dinheiro empilhados dentro */}
      <g transform="translate(690 860)">
        {MACOS.map(([x, y], i) => (
          <Maco key={i} x={x} y={y} />
        ))}
      </g>
      {/* brilho do dinheiro */}
      <ellipse cx="820" cy="790" rx="170" ry="120" fill="#b8ffb0" opacity={0.08 + 0.04 * Math.sin(f / 10)} />

      {/* entulho e marreta no chão */}
      <path d="M600 1345 Q800 1270 1010 1345 Z" fill="#c9b293" stroke="#6e5a44" strokeWidth="4" />
      {ENTULHO.map(([x, y, t, r], i) => (
        <polygon
          key={i}
          points={`0,0 ${t},${t * 0.15} ${t * 0.85},${t * 0.7} ${t * 0.1},${t * 0.6}`}
          transform={`translate(${x} ${y}) rotate(${r})`}
          fill={i % 3 === 0 ? "#a35a3c" : "#d8c3a5"}
          stroke="#4a3526"
          strokeWidth="3"
        />
      ))}
      <g transform="rotate(-18 960 1420)">
        <rect x="860" y="1410" width="190" height="18" rx="6" fill="#8a5a34" stroke="#2b1a10" strokeWidth="4" />
        <rect x="1030" y="1385" width="44" height="70" rx="6" fill="#55585c" stroke="#1d1e20" strokeWidth="4" />
      </g>

      {/* poeira flutuando */}
      {Array.from({ length: 18 }).map((_, i) => {
        const x = 640 + ((i * 53) % 360) + Math.sin((f + i * 20) / 25) * 12;
        const y = 1250 - ((f * (0.6 + (i % 4) * 0.2) + i * 70) % 700);
        return <circle key={i} cx={x} cy={y} r={2 + (i % 3)} fill="#f3e3c8" opacity={0.35} />;
      })}

      {/* luz e vinheta */}
      <rect width="1080" height="1920" fill="url(#neon)" />
      <rect width="1080" height="1920" fill="url(#vinheta)" />
    </svg>
  );
};
