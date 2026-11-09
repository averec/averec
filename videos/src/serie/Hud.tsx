import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COR, FONTE, reais } from "./tema";

export type EstadoHud = { t: number; dinheiro: number; banco: number; suspeita: number };

/** Interpola o placar entre os marcos (t em segundos), com 0,6 s de contagem. */
export const estadoEm = (marcos: EstadoHud[], t: number): Omit<EstadoHud, "t"> => {
  let atual = marcos[0];
  let anterior = marcos[0];
  for (const m of marcos) {
    if (m.t <= t) {
      anterior = atual;
      atual = m;
    }
  }
  const p = interpolate(t, [atual.t, atual.t + 0.6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const mix = (k: "dinheiro" | "banco" | "suspeita") => anterior[k] + (atual[k] - anterior[k]) * p;
  return { dinheiro: mix("dinheiro"), banco: mix("banco"), suspeita: mix("suspeita") };
};

const Caixa: React.FC<{ rotulo: string; valor: string; alerta?: boolean }> = ({ rotulo, valor, alerta }) => (
  <div
    style={{
      flex: 1,
      background: COR.hud,
      borderRadius: 14,
      padding: "12px 18px",
      border: "1px solid rgba(255,255,255,.08)",
    }}
  >
    <div style={{ fontFamily: FONTE.mono, fontSize: 17, letterSpacing: 2, color: "#a9a49c" }}>{rotulo}</div>
    <div
      style={{
        fontFamily: FONTE.titulo,
        fontWeight: 800,
        fontSize: 34,
        color: alerta ? COR.rosa : "white",
        fontVariantNumeric: "tabular-nums",
        whiteSpace: "nowrap",
      }}
    >
      {valor}
    </div>
  </div>
);

/** Rótulos e formato do placar por episódio (padrão: dinheiro, banco, suspeita). */
export type ConfigHud = {
  rotulos?: [string, string, string];
  /** Formato do segundo campo: valor em reais ou número simples (ex.: homens). */
  formatoBanco?: "reais" | "numero";
};

const numero = (v: number) => Math.round(v).toLocaleString("pt-BR").replace(/,/g, ".");

export const Hud: React.FC<{ marcos: EstadoHud[]; inicio: number; rotulo?: string; config?: ConfigHud }> = ({ marcos, inicio, rotulo, config }) => {
  const [r1, r2, r3] = config?.rotulos ?? ["DINHEIRO", "NO BANCO", "SUSPEITA"];
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps + inicio;
  const e = estadoEm(marcos, t);
  return (
    <div style={{ position: "absolute", top: 130, left: 40, right: 40 }}>
      <div style={{ display: "flex", gap: 12 }}>
        <Caixa rotulo={r1} valor={reais(e.dinheiro)} />
        <Caixa rotulo={r2} valor={config?.formatoBanco === "numero" ? numero(e.banco) : reais(e.banco)} />
        <Caixa rotulo={r3} valor={`${Math.round(e.suspeita)}%`} alerta={e.suspeita > 0.5} />
      </div>
      {rotulo && (
        <div
          style={{
            display: "inline-block",
            marginTop: 14,
            background: COR.rosa,
            color: "white",
            fontFamily: FONTE.mono,
            fontWeight: 600,
            fontSize: 20,
            letterSpacing: 3,
            padding: "6px 12px",
            borderRadius: 6,
          }}
        >
          {rotulo}
        </div>
      )}
    </div>
  );
};
