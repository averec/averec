import React from "react";
import { useCurrentFrame } from "remotion";

// Cenários desenhados em 1080×1920 (sem aleatório: o mesmo quadro sempre sai igual).

const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg viewBox="0 0 1080 1920" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0 }}>
    <defs>
      <radialGradient id="vinheta-c" cx="0.5" cy="0.45" r="0.75">
        <stop offset="0.55" stopColor="#000" stopOpacity="0" />
        <stop offset="1" stopColor="#000" stopOpacity="0.6" />
      </radialGradient>
    </defs>
    {children}
    <rect width="1080" height="1920" fill="url(#vinheta-c)" />
  </svg>
);

/** Interior de agência bancária: balcão de caixa com vidro, fila, letreiro. */
export const CenarioBanco: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Svg>
      <defs>
        <linearGradient id="parede-b" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#dfe6ea" />
          <stop offset="1" stopColor="#c3ccd2" />
        </linearGradient>
        <pattern id="piso-b" width="160" height="160" patternUnits="userSpaceOnUse">
          <rect width="160" height="160" fill="#d9d2c3" />
          <rect width="80" height="80" fill="#cbc3b2" />
          <rect x="80" y="80" width="80" height="80" fill="#cbc3b2" />
        </pattern>
      </defs>
      <rect width="1080" height="1360" fill="url(#parede-b)" />
      <rect y="1360" width="1080" height="560" fill="url(#piso-b)" />
      {/* luminárias */}
      {[180, 540, 900].map((x) => (
        <g key={x}>
          <rect x={x - 110} y="60" width="220" height="24" rx="6" fill="#f8fbff" stroke="#9aa6ad" strokeWidth="4" />
          <path d={`M${x - 110} 84 L${x - 220} 600 L${x + 220} 600 L${x + 110} 84 Z`} fill="#fff" opacity="0.12" />
        </g>
      ))}
      <g transform="translate(0 140)">
      {/* letreiro */}
      <rect x="290" y="170" width="500" height="110" rx="14" fill="#1f4e79" />
      <text x="540" y="245" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="900" fontSize="64" fill="#fff" letterSpacing="10">BANCO</text>
      <text x="540" y="330" textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize="26" fill="#55636c" letterSpacing="6">CAIXAS · ATENDIMENTO</text>
      {/* balcão com guichês */}
      <rect y="700" width="1080" height="80" fill="#8a6a4a" stroke="#4d3826" strokeWidth="6" />
      <rect y="780" width="1080" height="580" fill="#a8835e" stroke="#4d3826" strokeWidth="6" />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={60 + i * 340} y="380" width="280" height="320" fill="#cfe4ee" opacity="0.55" stroke="#7e8f98" strokeWidth="8" />
          <path d={`M${80 + i * 340} 400 L${180 + i * 340} 400 L${100 + i * 340} 520 Z`} fill="#fff" opacity="0.35" />
          <circle cx={200 + i * 340} cy="600" r="30" fill="#9aa6ad" stroke="#5f6b72" strokeWidth="5" />
          <text x={200 + i * 340} y="450" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="34" fill="#1f4e79">{`CAIXA ${i + 1}`}</text>
          <rect x={150 + i * 340} y="840" width="100" height="140" rx="8" fill="#94724f" stroke="#4d3826" strokeWidth="4" />
        </g>
      ))}
      {/* painel de senha */}
      <rect x="820" y="250" width="200" height="90" rx="8" fill="#111" />
      <text x="920" y="312" textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight="600" fontSize="44" fill={f % 60 < 45 ? "#ff4d4d" : "#7a1f1f"}>A047</text>
      </g>
      {/* separador de fila */}
      {[120, 380, 640, 900].map((x) => (
        <g key={x}>
          <rect x={x - 8} y="1380" width="16" height="140" fill="#b9b9b9" stroke="#555" strokeWidth="3" />
          <ellipse cx={x} cy="1522" rx="40" ry="12" fill="#777" />
        </g>
      ))}
      <path d="M120 1400 Q250 1440 380 1400 Q510 1440 640 1400 Q770 1440 900 1400" stroke="#b3263a" strokeWidth="12" fill="none" />
    </Svg>
  );
};

/** Rua de cidade brasileira no fim de tarde: sobrados, poste, árvore, calçada de pedra portuguesa. */
export const CenarioRua: React.FC = () => {
  const f = useCurrentFrame();
  const sobrados = [
    { x: -20, w: 380, h: 900, cor: "#d9825b", porta: "#5a3a2a" },
    { x: 360, w: 360, h: 1000, cor: "#e8d3a6", porta: "#2f5a5a" },
    { x: 720, w: 380, h: 860, cor: "#8fb3a8", porta: "#7a3b2e" },
  ];
  return (
    <Svg>
      <defs>
        <linearGradient id="ceu-r" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6a15b" />
          <stop offset="0.6" stopColor="#f7cf8a" />
          <stop offset="1" stopColor="#f2e0b8" />
        </linearGradient>
        <pattern id="calcada" width="120" height="60" patternUnits="userSpaceOnUse">
          <rect width="120" height="60" fill="#e9e4da" />
          <path d="M0 30 Q30 0 60 30 T120 30" stroke="#2b2b2b" strokeWidth="12" fill="none" />
        </pattern>
      </defs>
      <rect width="1080" height="1920" fill="url(#ceu-r)" />
      <circle cx="820" cy="300" r="120" fill="#fff1c9" opacity="0.8" />
      {sobrados.map((s, i) => {
        const topo = 1380 - s.h;
        return (
          <g key={i}>
            <rect x={s.x} y={topo} width={s.w} height={s.h} fill={s.cor} stroke="#3a2a20" strokeWidth="6" />
            <rect x={s.x - 10} y={topo - 30} width={s.w + 20} height="40" fill="#5a4636" />
            {[0, 1].map((j) => (
              <g key={j}>
                <rect x={s.x + 50 + j * (s.w / 2 - 20)} y={topo + 120} width={s.w / 2 - 110} height="200" fill="#4b6b80" stroke="#3a2a20" strokeWidth="6" />
                <rect x={s.x + 40 + j * (s.w / 2 - 20)} y={topo + 320} width={s.w / 2 - 90} height="20" fill="#3a2a20" />
              </g>
            ))}
            <rect x={s.x + s.w / 2 - 70} y="1110" width="140" height="270" fill={s.porta} stroke="#2a1d16" strokeWidth="6" />
            <circle cx={s.x + s.w / 2 + 40} cy="1250" r="9" fill="#e0c25a" />
          </g>
        );
      })}
      {/* fios e poste */}
      <path d="M0 520 Q540 600 1080 500" stroke="#2b2b2b" strokeWidth="4" fill="none" />
      <rect x="140" y="420" width="22" height="960" fill="#5b5f63" stroke="#2b2b2b" strokeWidth="4" />
      <path d="M151 440 Q151 400 230 400" stroke="#5b5f63" strokeWidth="14" fill="none" />
      <ellipse cx="240" cy="408" rx="34" ry="14" fill="#fff6d0" />
      {/* árvore */}
      <rect x="920" y="1050" width="40" height="330" fill="#6b4a32" stroke="#2f2016" strokeWidth="5" />
      <g transform={`rotate(${Math.sin(f / 30) * 1.2} 940 1050)`}>
        <circle cx="940" cy="960" r="150" fill="#5f8f4e" stroke="#2f4a26" strokeWidth="6" />
        <circle cx="850" cy="1020" r="90" fill="#6fa05c" stroke="#2f4a26" strokeWidth="6" />
        <circle cx="1030" cy="1010" r="90" fill="#6fa05c" stroke="#2f4a26" strokeWidth="6" />
      </g>
      {/* calçada e meio-fio */}
      <rect y="1380" width="1080" height="380" fill="url(#calcada)" />
      <rect y="1760" width="1080" height="30" fill="#9a958b" />
      <rect y="1790" width="1080" height="130" fill="#4a4a4a" />
    </Svg>
  );
};

/** Sala de análise: monitor com a planilha destacando um nome, pastas e luminária. */
export const CenarioEscritorio: React.FC = () => {
  const f = useCurrentFrame();
  const piscar = f % 30 < 18;
  return (
    <Svg>
      <defs>
        <linearGradient id="parede-e" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2f3a44" />
          <stop offset="1" stopColor="#4c5a66" />
        </linearGradient>
        <radialGradient id="luz-e" cx="0.72" cy="0.32" r="0.5">
          <stop offset="0" stopColor="#9fd3ff" stopOpacity="0.35" />
          <stop offset="1" stopColor="#9fd3ff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1080" height="1920" fill="url(#parede-e)" />
      {/* janela noturna com prédios */}
      <rect x="60" y="180" width="380" height="460" fill="#0f1a2b" stroke="#1b232b" strokeWidth="14" />
      {[[90, 420, 80, 220], [190, 360, 90, 280], [300, 450, 110, 190]].map(([x, y, w, h], i) => (
        <g key={i}>
          <rect x={x} y={y} width={w} height={h} fill="#1c2a3d" />
          {Array.from({ length: 6 }).map((_, j) => (
            <rect key={j} x={x + 12 + (j % 2) * (w / 2 - 6)} y={y + 20 + Math.floor(j / 2) * 50} width="22" height="24" fill={(i + j) % 3 ? "#f4d27a" : "#33445a"} />
          ))}
        </g>
      ))}
      {/* estante com pastas */}
      <rect x="60" y="720" width="380" height="420" fill="#5b4636" stroke="#2c2018" strokeWidth="6" />
      {[0, 1, 2].map((r) =>
        Array.from({ length: 7 }).map((_, c) => (
          <rect key={`${r}-${c}`} x={80 + c * 50} y={740 + r * 135} width="40" height="115" fill={["#c84b3c", "#3c6fc8", "#e0b84a", "#4a9a6a"][(r + c) % 4]} stroke="#2c2018" strokeWidth="4" />
        )),
      )}
      {/* mesa */}
      <rect y="1250" width="1080" height="70" fill="#7a5a40" stroke="#3a2a1e" strokeWidth="6" />
      <rect y="1320" width="1080" height="600" fill="#5a4230" />
      {/* monitor */}
      <rect x="520" y="560" width="500" height="380" rx="16" fill="#151a1f" stroke="#0b0d10" strokeWidth="10" />
      <rect x="545" y="585" width="450" height="330" fill="#0d1b26" />
      {Array.from({ length: 8 }).map((_, i) => (
        <g key={i}>
          <rect x="565" y={605 + i * 38} width="250" height="22" fill={i === 5 ? "#E8336D" : "#2d5876"} opacity={i === 5 && !piscar ? 0.5 : 1} />
          <rect x="830" y={605 + i * 38} width="140" height="22" fill={i === 5 ? "#E8336D" : "#244a63"} opacity={i === 5 && !piscar ? 0.5 : 1} />
        </g>
      ))}
      <rect x="745" y="940" width="50" height="120" fill="#151a1f" />
      <rect x="680" y="1060" width="180" height="24" rx="8" fill="#151a1f" />
      <rect width="1080" height="1920" fill="url(#luz-e)" />
      {/* papéis, caneca e luminária */}
      <g transform="rotate(-8 300 1280)">
        <rect x="200" y="1230" width="220" height="60" fill="#f2efe6" stroke="#9a968c" strokeWidth="3" />
      </g>
      <rect x="470" y="1180" width="70" height="80" rx="10" fill="#d94b3c" stroke="#5a1d16" strokeWidth="5" />
      <path d="M540 1200 q30 0 30 25 q0 25 -30 25" stroke="#5a1d16" strokeWidth="6" fill="none" />
      <path d="M960 1250 L930 1080 L990 990" stroke="#2b2b2b" strokeWidth="14" fill="none" />
      <path d="M950 960 L1060 990 L1020 1050 Z" fill="#e0b84a" stroke="#2b2b2b" strokeWidth="5" />
    </Svg>
  );
};
