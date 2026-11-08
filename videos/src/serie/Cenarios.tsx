import React from "react";

// Cenários no estilo da ilustração de referência do usuário (public/ep01/cenas/parede.jpg):
// canto de sala em perspectiva, contorno escuro grosso, cores chapadas saturadas, papel de
// parede estampado e piso de tábuas convergindo. Desenho em 1080×1920, sem aleatório.

const TINTA = "#2b1717";
const T = 7; // espessura do contorno

type Cores = { parede: string; paredeSombra: string; estampa: string; teto: string; rodape: string; piso: string; pisoLinha: string };

const Estampa: React.FC<{ id: string; fundo: string; cor: string; tipo: "damasco" | "listras" | "liso" }> = ({ id, fundo, cor, tipo }) => (
  <pattern id={id} width="120" height="150" patternUnits="userSpaceOnUse">
    <rect width="120" height="150" fill={fundo} />
    {tipo === "damasco" && (
      <g fill={cor}>
        <path d="M60 18 C72 34 78 48 60 66 C42 48 48 34 60 18 Z" />
        <path d="M60 66 C80 70 92 86 84 100 C74 92 66 86 60 92 C54 86 46 92 36 100 C28 86 40 70 60 66 Z" />
        <rect x="56" y="92" width="8" height="26" />
        <path d="M0 0 C14 20 14 50 0 75 M120 0 C106 20 106 50 120 75 M0 75 C14 95 14 125 0 150 M120 75 C106 95 106 125 120 150" stroke={cor} strokeWidth="5" fill="none" />
      </g>
    )}
    {tipo === "listras" && (
      <g>
        <rect x="0" width="18" height="150" fill={cor} />
        <rect x="60" width="6" height="150" fill={cor} />
      </g>
    )}
  </pattern>
);

/** Canto de sala: parede lateral à esquerda, parede do fundo e piso de tábuas. */
const Sala: React.FC<{ id: string; cores: Cores; estampa: "damasco" | "listras" | "liso"; children?: React.ReactNode; fundo?: React.ReactNode; lateral?: React.ReactNode }> = ({ id, cores, estampa, children, fundo, lateral }) => {
  const canto = 360;
  const topo = 230;
  const chao = 1500;
  const vx = 700;
  const vy = 1050; // ponto de fuga do piso
  return (
    <svg viewBox="0 0 1080 1920" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0 }}>
      <defs>
        <Estampa id={`${id}-p`} fundo={cores.parede} cor={cores.estampa} tipo={estampa} />
        <Estampa id={`${id}-l`} fundo={cores.paredeSombra} cor={cores.estampa} tipo={estampa} />
        <radialGradient id={`${id}-v`} cx="0.55" cy="0.5" r="0.8">
          <stop offset="0.6" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.45" />
        </radialGradient>
      </defs>
      {/* teto */}
      <polygon points={`0,0 1080,0 1080,${topo} ${canto},${topo} 0,110`} fill={cores.teto} stroke={TINTA} strokeWidth={T} />
      {/* parede do fundo e lateral */}
      <rect x={canto} y={topo} width={1080 - canto} height={chao - topo} fill={`url(#${id}-p)`} stroke={TINTA} strokeWidth={T} />
      <polygon points={`0,110 ${canto},${topo} ${canto},${chao} 0,1650`} fill={`url(#${id}-l)`} stroke={TINTA} strokeWidth={T} />
      {/* sanca */}
      <polygon points={`0,110 ${canto},${topo} 1080,${topo} 1080,${topo + 28} ${canto},${topo + 28} 0,140`} fill={cores.rodape} stroke={TINTA} strokeWidth={T} />
      {lateral}
      {fundo}
      {/* rodapé */}
      <rect x={canto} y={chao - 40} width={1080 - canto} height={40} fill={cores.rodape} stroke={TINTA} strokeWidth={T} />
      <polygon points={`0,1600 ${canto},${chao - 40} ${canto},${chao} 0,1650`} fill={cores.rodape} stroke={TINTA} strokeWidth={T} />
      {/* piso de tábuas */}
      <polygon points={`0,1650 ${canto},${chao} 1080,${chao} 1080,1920 0,1920`} fill={cores.piso} stroke={TINTA} strokeWidth={T} />
      {Array.from({ length: 11 }).map((_, i) => {
        const x = -400 + i * 190;
        return <line key={i} x1={vx + (x - vx) * 0.45} y1={chao} x2={x} y2={1920} stroke={cores.pisoLinha} strokeWidth={5} />;
      })}
      {[1560, 1650, 1770].map((y) => (
        <line key={y} x1={0} y1={y + (y - vy) * 0.05} x2={1080} y2={y} stroke={cores.pisoLinha} strokeWidth={4} opacity={0.6} />
      ))}
      {children}
      <rect width="1080" height="1920" fill={`url(#${id}-v)`} />
    </svg>
  );
};

const Contorno = { stroke: TINTA, strokeWidth: T, strokeLinejoin: "round" as const };

/** Agência bancária: guichês com vidro, letreiro, painel de senha e fila. */
export const CenarioBanco: React.FC = () => (
  <Sala
    id="banco"
    estampa="listras"
    cores={{ parede: "#cfe0e8", paredeSombra: "#aac2cf", estampa: "#b9d0dc", teto: "#e9eef0", rodape: "#5c6f7a", piso: "#d8cdb8", pisoLinha: "#b3a68c" }}
    lateral={
      <g>
        {/* cartaz na parede lateral */}
        <polygon points="70,520 280,560 280,860 70,850" fill="#f6efe0" {...Contorno} />
        <text x="175" y="650" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight={900} fontSize={40} fill="#1f4e79" transform="skewY(10) translate(0 -40)">PIX</text>
        <rect x="110" y="700" width="130" height="100" rx="10" fill="#1f4e79" transform="skewY(10) translate(0 -40)" />
      </g>
    }
    fundo={
      <g>
        {/* letreiro */}
        <rect x="470" y="320" width="500" height="120" rx="12" fill="#1f4e79" {...Contorno} />
        <text x="720" y="402" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight={900} fontSize={70} fill="#fff" letterSpacing={10}>BANCO</text>
        {/* painel de senha */}
        <rect x="830" y="470" width="190" height="90" rx="8" fill="#141414" {...Contorno} />
        <text x="925" y="532" textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600} fontSize={44} fill="#ff4d4d">A047</text>
        {/* guichês */}
        {[0, 1].map((i) => (
          <g key={i}>
            <rect x={420 + i * 320} y="600" width="270" height="330" fill="#e6f3f8" opacity={0.85} {...Contorno} />
            <path d={`M${440 + i * 320} 620 L${540 + i * 320} 620 L${460 + i * 320} 760 Z`} fill="#fff" opacity={0.7} />
            <circle cx={555 + i * 320} cy="840" r="28" fill="#9aa6ad" {...Contorno} />
            <text x={555 + i * 320} y="680" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight={800} fontSize={34} fill="#1f4e79">{`CAIXA ${i + 1}`}</text>
          </g>
        ))}
        {/* balcão */}
        <rect x="360" y="930" width="720" height="70" fill="#8a5a3a" {...Contorno} />
        <rect x="360" y="1000" width="720" height="460" fill="#a8704a" {...Contorno} />
        {[0, 1, 2].map((i) => (
          <rect key={i} x={410 + i * 230} y="1060" width="170" height="340" rx="10" fill="#93603d" {...Contorno} />
        ))}
      </g>
    }
  >
    {/* fila com corrente */}
    {[140, 420, 700, 980].map((x) => (
      <g key={x}>
        <rect x={x - 10} y="1560" width="20" height="160" fill="#c9c9c9" {...Contorno} />
        <ellipse cx={x} cy="1725" rx="44" ry="14" fill="#8a8a8a" {...Contorno} />
      </g>
    ))}
    <path d="M140 1590 Q280 1640 420 1590 Q560 1640 700 1590 Q840 1640 980 1590" stroke={TINTA} strokeWidth={20} fill="none" />
    <path d="M140 1590 Q280 1640 420 1590 Q560 1640 700 1590 Q840 1640 980 1590" stroke="#c0283c" strokeWidth={11} fill="none" />
  </Sala>
);

/** Sala de análise à noite: janela com prédios, estante, mesa e monitor destacando um nome. */
export const CenarioEscritorio: React.FC = () => (
  <Sala
    id="escr"
    estampa="liso"
    cores={{ parede: "#3e5468", paredeSombra: "#2f4254", estampa: "#3e5468", teto: "#27343f", rodape: "#1d2730", piso: "#6b4a33", pisoLinha: "#4e3423" }}
    lateral={
      <g>
        {/* janela noturna na parede lateral */}
        <polygon points="60,420 300,470 300,900 60,890" fill="#101c2e" {...Contorno} />
        {[[90, 700, 60], [160, 640, 70], [235, 720, 50]].map(([x, y, w], i) => (
          <g key={i}>
            <rect x={x} y={y} width={w} height={890 - y} fill="#1d2c42" />
            <rect x={x + 10} y={y + 20} width="16" height="18" fill="#f4d27a" />
            <rect x={x + w - 26} y={y + 70} width="16" height="18" fill="#f4d27a" />
          </g>
        ))}
        <line x1="180" y1="445" x2="180" y2="895" stroke={TINTA} strokeWidth={T} />
      </g>
    }
    fundo={
      <g>
        {/* estante */}
        <rect x="400" y="380" width="250" height="560" fill="#5b4030" {...Contorno} />
        {[0, 1, 2].map((r) =>
          [0, 1, 2, 3].map((c) => (
            <rect key={`${r}${c}`} x={418 + c * 56} y={400 + r * 180} width="44" height="160" fill={["#d0503f", "#3f74d0", "#e0b84a", "#4aa070"][(r + c) % 4]} {...Contorno} strokeWidth={5} />
          )),
        )}
        {/* monitor */}
        <rect x="690" y="600" width="350" height="270" rx="14" fill="#151a1f" {...Contorno} />
        <rect x="712" y="622" width="306" height="226" fill="#0e2233" />
        {Array.from({ length: 6 }).map((_, i) => (
          <rect key={i} x="728" y={640 + i * 34} width={i === 3 ? 274 : 180 + ((i * 41) % 90)} height="20" fill={i === 3 ? "#E8336D" : "#2f6a8f"} />
        ))}
        <rect x="845" y="870" width="40" height="70" fill="#151a1f" {...Contorno} />
        {/* mesa */}
        <rect x="360" y="940" width="720" height="60" fill="#8a5d3d" {...Contorno} />
        <rect x="400" y="1000" width="40" height="460" fill="#6e482e" {...Contorno} />
        <rect x="1000" y="1000" width="40" height="460" fill="#6e482e" {...Contorno} />
        {/* caneca e papéis */}
        <rect x="560" y="880" width="56" height="62" rx="8" fill="#d94b3c" {...Contorno} strokeWidth={5} />
        <polygon points="430,935 560,915 575,940 445,960" fill="#f2efe6" {...Contorno} strokeWidth={5} />
      </g>
    }
  />
);

/** Rua no fim de tarde: sobrados com contorno, poste, árvore e calçada de pedra portuguesa. */
export const CenarioRua: React.FC = () => {
  const casas = [
    { x: -20, w: 380, h: 1000, cor: "#e07a55", porta: "#5a3a2a" },
    { x: 360, w: 360, h: 1100, cor: "#f0d79b", porta: "#2f6a6a" },
    { x: 720, w: 380, h: 960, cor: "#86b9a8", porta: "#8a3b2e" },
  ];
  return (
    <svg viewBox="0 0 1080 1920" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id="rua-ceu" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f58f5b" />
          <stop offset="1" stopColor="#ffd59a" />
        </linearGradient>
        <pattern id="rua-calcada" width="140" height="70" patternUnits="userSpaceOnUse">
          <rect width="140" height="70" fill="#efe8da" />
          <path d="M0 35 Q35 0 70 35 T140 35" stroke={TINTA} strokeWidth={14} fill="none" />
        </pattern>
        <radialGradient id="rua-v" cx="0.5" cy="0.5" r="0.8">
          <stop offset="0.6" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.4" />
        </radialGradient>
      </defs>
      <rect width="1080" height="1920" fill="url(#rua-ceu)" />
      <circle cx="830" cy="260" r="110" fill="#fff0c4" {...Contorno} />
      {casas.map((c, i) => {
        const topo = 1460 - c.h;
        return (
          <g key={i}>
            <rect x={c.x} y={topo} width={c.w} height={c.h} fill={c.cor} {...Contorno} />
            <rect x={c.x - 14} y={topo - 36} width={c.w + 28} height="44" fill="#5a4030" {...Contorno} />
            {[0, 1].map((j) => (
              <g key={j}>
                <rect x={c.x + 46 + j * (c.w / 2 - 16)} y={topo + 120} width={c.w / 2 - 110} height="220" fill="#4f7591" {...Contorno} />
                <line x1={c.x + 46 + j * (c.w / 2 - 16) + (c.w / 2 - 110) / 2} y1={topo + 120} x2={c.x + 46 + j * (c.w / 2 - 16) + (c.w / 2 - 110) / 2} y2={topo + 340} stroke={TINTA} strokeWidth={5} />
                <rect x={c.x + 34 + j * (c.w / 2 - 16)} y={topo + 340} width={c.w / 2 - 86} height="22" fill="#3a2a20" {...Contorno} strokeWidth={5} />
              </g>
            ))}
            <rect x={c.x + c.w / 2 - 75} y="1170" width="150" height="290" fill={c.porta} {...Contorno} />
            <circle cx={c.x + c.w / 2 + 44} cy="1320" r="10" fill="#e0c25a" stroke={TINTA} strokeWidth={4} />
          </g>
        );
      })}
      {/* fios e poste */}
      <path d="M0 470 Q540 560 1080 450" stroke={TINTA} strokeWidth={5} fill="none" />
      <rect x="130" y="400" width="30" height="1060" fill="#6b7075" {...Contorno} />
      <path d="M145 430 Q145 380 240 380" stroke={TINTA} strokeWidth={22} fill="none" />
      <path d="M145 430 Q145 380 240 380" stroke="#6b7075" strokeWidth={12} fill="none" />
      <ellipse cx="250" cy="392" rx="40" ry="16" fill="#fff6d0" {...Contorno} strokeWidth={5} />
      {/* árvore */}
      <rect x="920" y="1110" width="44" height="350" fill="#6b4a32" {...Contorno} />
      <circle cx="942" cy="1010" r="150" fill="#5f9a4e" {...Contorno} />
      <circle cx="845" cy="1080" r="90" fill="#6fae5c" {...Contorno} />
      <circle cx="1040" cy="1070" r="90" fill="#6fae5c" {...Contorno} />
      {/* calçada e meio-fio */}
      <rect y="1460" width="1080" height="320" fill="url(#rua-calcada)" {...Contorno} />
      <rect y="1780" width="1080" height="30" fill="#a39d92" {...Contorno} />
      <rect y="1810" width="1080" height="110" fill="#4a4a4a" />
      <rect width="1080" height="1920" fill="url(#rua-v)" />
    </svg>
  );
};
