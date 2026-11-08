import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COR, FONTE, reais } from "./tema";

const s = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

/** Momento (em segundos, relativo ao início do cartão) em que cada parte aparece. */
type Tempos = number[];

const useT = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return { f, fps, seg: f / fps };
};

const Rotulo: React.FC<{ children: React.ReactNode; cor?: string }> = ({ children, cor }) => (
  <div style={{ fontFamily: FONTE.mono, fontSize: 24, letterSpacing: 5, color: cor ?? COR.cinza, textAlign: "center" }}>
    {children}
  </div>
);

const Entra: React.FC<{ em: number; children: React.ReactNode; y?: number }> = ({ em, children, y = 30 }) => {
  const { f, fps } = useT();
  const p = spring({ frame: f - em * fps, fps, config: { damping: 200 }, durationInFrames: 12 });
  return <div style={{ opacity: p, transform: `translateY(${(1 - p) * y}px)` }}>{children}</div>;
};

const Carimbo: React.FC<{ em: number; texto: string }> = ({ em, texto }) => {
  const { f, fps } = useT();
  const p = spring({ frame: f - em * fps, fps, config: { damping: 12, stiffness: 180 } });
  return (
    <div
      style={{
        display: "inline-block",
        border: `5px solid ${COR.rosa}`,
        color: COR.rosa,
        fontFamily: FONTE.titulo,
        fontWeight: 900,
        fontSize: 46,
        padding: "8px 22px",
        borderRadius: 8,
        transform: `rotate(-6deg) scale(${interpolate(p, [0, 1], [2.4, 1])})`,
        opacity: Math.min(1, p * 3),
      }}
    >
      {texto}
    </div>
  );
};

const Titulo: React.FC<{ children: React.ReactNode; tamanho?: number; cor?: string }> = ({ children, tamanho = 76, cor }) => (
  <div
    style={{
      fontFamily: FONTE.titulo,
      fontWeight: 900,
      fontSize: tamanho,
      letterSpacing: -2.5,
      lineHeight: 1.02,
      textAlign: "center",
      color: cor ?? COR.tinta,
    }}
  >
    {children}
  </div>
);

const Fundo: React.FC<{ escuro?: boolean; children: React.ReactNode }> = ({ escuro, children }) => (
  <AbsoluteFill
    style={{
      background: escuro ? COR.escuro : COR.claro,
      padding: "260px 70px 0",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 34,
    }}
  >
    {children}
  </AbsoluteFill>
);

/** Grade de notas que se enche + contador de notas e peso. */
export const CartaoPeso: React.FC<{ rotulo: string; prefixo: string; tempos: Tempos; notas: number; quilos: number }> = ({ rotulo, prefixo, tempos, notas, quilos }) => {
  const { seg } = useT();
  const cheio = s(seg, tempos[0], tempos[1]);
  const total = 120;
  return (
    <Fundo>
      <Rotulo>{rotulo}</Rotulo>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(10, 1fr)", gap: 8, width: 620, marginTop: 30 }}>
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            style={{
              height: 26,
              borderRadius: 4,
              background: i < cheio * total ? COR.verde : "rgba(0,0,0,.06)",
              border: `2px solid ${i < cheio * total ? COR.verdeEscuro : "transparent"}`,
            }}
          />
        ))}
      </div>
      <Titulo tamanho={52}>
        {prefixo}
        <br />
        {Math.round(cheio * notas).toLocaleString("pt-BR").replace(/,/g, ".")} notas
      </Titulo>
      <Entra em={tempos[2]}>
        <Titulo tamanho={130}>{quilos} kg</Titulo>
      </Entra>
    </Fundo>
  );
};

/** Regra / lição curta em cartão preto. */
export const CartaoRegra: React.FC<{ rotulo: string; texto: string }> = ({ rotulo, texto }) => (
  <Fundo escuro>
    <div style={{ height: 360 }} />
    <Rotulo cor={COR.rosa}>{rotulo}</Rotulo>
    <Entra em={0.1}>
      <Titulo cor="white" tamanho={72}>
        {texto}
      </Titulo>
    </Entra>
  </Fundo>
);

/** Limite de depósito → comunicado → carimbo. */
export const CartaoLimite: React.FC<{ rotulo: string; valor: string; tempos: Tempos; rodape: string }> = ({ rotulo, valor, tempos, rodape }) => (
  <Fundo>
    <Rotulo>{rotulo}</Rotulo>
    <div style={{ height: 60 }} />
    <Titulo tamanho={52}>Depósito em espécie a partir de</Titulo>
    <Titulo tamanho={120}>{valor}</Titulo>
    <Entra em={tempos[0]}>
      <Titulo tamanho={70}>↓</Titulo>
      <Titulo tamanho={50}>Comunicado ao COAF</Titulo>
    </Entra>
    <div style={{ height: 120 }}>{<Carimbo em={tempos[1]} texto="AUTOMATICAMENTE" />}</div>
    <Entra em={tempos[2]}>
      <Titulo tamanho={60} cor={COR.cinza}>
        Toda vez.
      </Titulo>
    </Entra>
    <div style={{ position: "absolute", bottom: 260, fontFamily: FONTE.mono, fontSize: 20, color: COR.cinza }}>{rodape}</div>
  </Fundo>
);

/** Barras de depósito logo abaixo da linha. */
export const CartaoBarras: React.FC<{ rotulo: string; titulo: string; sub: string; barras: { valor: string; em: number }[] }> = ({ rotulo, titulo, sub, barras }) => {
  const { seg } = useT();
  return (
    <Fundo>
      <Rotulo>{rotulo}</Rotulo>
      <Titulo tamanho={60}>{titulo}</Titulo>
      <Titulo tamanho={42} cor={COR.cinza}>
        {sub}
      </Titulo>
      <div style={{ position: "relative", width: 640, height: 520, marginTop: 40 }}>
        <div style={{ position: "absolute", top: 60, left: 0, right: 0, borderTop: `4px dashed ${COR.rosa}` }} />
        <div style={{ position: "absolute", top: 20, right: 0, fontFamily: FONTE.mono, color: COR.rosa, fontSize: 22 }}>
          R$ 50 MIL · COMUNICADO
        </div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, display: "flex", gap: 30, alignItems: "flex-end" }}>
          {barras.map((b, i) => (
            <div
              key={i}
              style={{
                width: 120,
                height: 440 * s(seg, b.em, b.em + 0.4),
                background: COR.tinta,
                borderRadius: 6,
                color: "white",
                fontFamily: FONTE.titulo,
                fontWeight: 800,
                fontSize: 30,
                textAlign: "center",
                paddingTop: 14,
                overflow: "hidden",
              }}
            >
              {b.valor}
            </div>
          ))}
        </div>
      </div>
    </Fundo>
  );
};

/** Palavra gigante + carimbo + barra de suspeita. */
export const CartaoNome: React.FC<{ rotulo: string; palavra: string; definicao: string; carimbo: string; tempos: Tempos; suspeita: [number, number] }> = ({ rotulo, palavra, definicao, carimbo, tempos, suspeita }) => {
  const { seg, f, fps } = useT();
  const p = spring({ frame: f, fps, config: { damping: 14 } });
  const susp = interpolate(seg, [tempos[1], tempos[1] + 1.2], suspeita, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Fundo escuro>
      <div style={{ height: 160 }} />
      <Rotulo>{rotulo}</Rotulo>
      <div style={{ transform: `scale(${interpolate(p, [0, 1], [1.4, 1])})` }}>
        <Titulo tamanho={104} cor={COR.rosa}>
          {palavra}
        </Titulo>
      </div>
      <Entra em={tempos[0]}>
        <Titulo tamanho={40} cor="white">
          {definicao}
        </Titulo>
      </Entra>
      <div style={{ height: 110 }}>
        <Carimbo em={tempos[0] + 0.4} texto={carimbo} />
      </div>
      <Entra em={tempos[1]}>
        <div style={{ width: 600 }}>
          <div style={{ fontFamily: FONTE.mono, fontSize: 20, letterSpacing: 4, color: "#a9a49c" }}>SUSPEITA</div>
          <div style={{ fontFamily: FONTE.titulo, fontWeight: 900, fontSize: 64, color: "white" }}>{Math.round(susp)}%</div>
          <div style={{ height: 10, background: "rgba(255,255,255,.12)", borderRadius: 5 }}>
            <div style={{ width: `${susp}%`, height: "100%", background: COR.rosa, borderRadius: 5 }} />
          </div>
        </div>
      </Entra>
    </Fundo>
  );
};

/** Placar do dia: os três números do HUD em tamanho grande. */
export const CartaoPlacar: React.FC<{ rotulo: string; dinheiro: number; banco: number; suspeita: number }> = ({ rotulo, dinheiro, banco, suspeita }) => {
  const { seg } = useT();
  const linha = (nome: string, valor: string, i: number, alerta?: boolean) => (
    <div key={nome} style={{ width: 620, opacity: s(seg, i * 0.25, i * 0.25 + 0.3), borderBottom: "2px solid rgba(0,0,0,.1)", paddingBottom: 18 }}>
      <div style={{ fontFamily: FONTE.mono, fontSize: 22, letterSpacing: 4, color: COR.cinza }}>{nome}</div>
      <div style={{ fontFamily: FONTE.titulo, fontWeight: 900, fontSize: 76, letterSpacing: -2, color: alerta ? COR.rosa : COR.tinta }}>{valor}</div>
    </div>
  );
  return (
    <Fundo>
      <Rotulo>{rotulo}</Rotulo>
      <div style={{ height: 30 }} />
      {linha("DINHEIRO QUE VOCÊ NÃO PODE TOCAR", reais(dinheiro), 0)}
      {linha("NO BANCO (SINALIZADO)", reais(banco), 1)}
      {linha("SUSPEITA", `${suspeita}%`, 2, true)}
      <div style={{ fontFamily: FONTE.titulo, fontWeight: 700, fontSize: 30, color: COR.cinza, marginTop: 20 }}>Gasto até agora: R$ 0</div>
    </Fundo>
  );
};

/** Dois botões de escolha sobre a cena. */
export const Escolha: React.FC<{ a: string; b: string; rotulo: string }> = ({ a, b, rotulo }) => {
  const { f, fps } = useT();
  const p = spring({ frame: f, fps, config: { damping: 12 } });
  const botao = (t: string, cor: string, fg: string) => (
    <div style={{ background: cor, color: fg, fontFamily: FONTE.titulo, fontWeight: 900, fontSize: 52, padding: "18px 40px", borderRadius: 14, minWidth: 260, textAlign: "center" }}>{t}</div>
  );
  return (
    <div style={{ position: "absolute", bottom: 230, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 18, transform: `scale(${p})` }}>
      <div style={{ fontFamily: FONTE.mono, color: "white", fontSize: 22, letterSpacing: 4, textShadow: "0 2px 6px #000" }}>{rotulo}</div>
      <div style={{ display: "flex", gap: 24 }}>
        {botao(a, "white", COR.tinta)}
        {botao(b, COR.rosa, "white")}
      </div>
    </div>
  );
};

/** Chamada final. */
export const CartaoFinal: React.FC<{ rotulo: string; linha1: string; linha2: string; chamada: string }> = ({ rotulo, linha1, linha2, chamada }) => (
  <Fundo escuro>
    <div style={{ height: 340 }} />
    <Rotulo>{rotulo}</Rotulo>
    <Entra em={0}>
      <Titulo tamanho={110} cor="white">
        {linha1}
      </Titulo>
      <Titulo tamanho={110} cor={COR.rosa}>
        {linha2}
      </Titulo>
    </Entra>
    <Entra em={0.4}>
      <Titulo tamanho={40} cor="#d8d3cb">
        {chamada}
      </Titulo>
    </Entra>
  </Fundo>
);

/** Cartão de texto genérico: rótulo, título grande, complemento, carimbo e fonte. */
export const CartaoTexto: React.FC<{
  rotulo: string;
  titulo: string;
  tamanho?: number;
  sub?: string;
  subEm?: number;
  carimbo?: string;
  carimboEm?: number;
  rodape?: string;
  escuro?: boolean;
}> = ({ rotulo, titulo, tamanho = 110, sub, subEm = 0.5, carimbo, carimboEm = 1, rodape, escuro }) => (
  <Fundo escuro={escuro}>
    <Rotulo>{rotulo}</Rotulo>
    <div style={{ height: 200 }} />
    <Entra em={0}>
      <Titulo tamanho={tamanho} cor={escuro ? "white" : undefined}>
        {titulo}
      </Titulo>
    </Entra>
    {sub && (
      <Entra em={subEm}>
        <Titulo tamanho={50} cor={escuro ? "#d8d3cb" : COR.tinta}>
          {sub}
        </Titulo>
      </Entra>
    )}
    <div style={{ height: 130 }}>{carimbo && <Carimbo em={carimboEm} texto={carimbo} />}</div>
    {rodape && (
      <div style={{ position: "absolute", bottom: 260, fontFamily: FONTE.mono, fontSize: 22, color: COR.cinza }}>{rodape}</div>
    )}
  </Fundo>
);
