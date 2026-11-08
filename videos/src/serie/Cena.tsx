import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { COR, FONTE } from "./tema";
import { Humor, Personagem } from "./Personagem";
import { CenarioParede } from "./CenarioParede";

export type Cenario = "parede" | "banco" | "rua" | "escritorio";

export type CenaProps = {
  /** Ilustração em public/ (ex.: "ep01/cenas/parede.png"). Sem ela, desenha o placeholder. */
  imagem?: string;
  cenario: Cenario;
  humor?: Humor;
  /** Zoom lento: 1 → zoomFinal ao longo do plano. */
  zoomFinal?: number;
  close?: boolean;
  etiqueta?: { titulo: string; sub?: string; x: number; y: number };
};

const FUNDOS: Record<Cenario, string> = {
  parede: "radial-gradient(circle at 70% 20%, #ff4fa3 0%, #6b1d4a 32%, #2a1418 72%)",
  banco: "linear-gradient(180deg, #b9c6cf 0%, #e9e3d6 55%, #8c7b63 100%)",
  rua: "linear-gradient(180deg, #f2a65a 0%, #d9cfc0 50%, #6f6a63 100%)",
  escritorio: "linear-gradient(180deg, #4a5560 0%, #8d9aa3 60%, #3b3f43 100%)",
};

const Objetos: React.FC<{ cenario: Cenario }> = ({ cenario }) => {
  if (cenario === "parede") return <CenarioParede />;
  if (cenario === "banco")
    return (
      <>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{ position: "absolute", top: 120, bottom: 520, left: 40 + i * 175, width: 70, background: "linear-gradient(90deg,#d8d2c4,#f6f1e6,#bfb7a6)", border: "6px solid #6d6556" }} />
        ))}
        <div style={{ position: "absolute", top: 70, left: 0, right: 0, height: 70, background: "#cfc7b6", borderBottom: "8px solid #6d6556" }} />
        <div style={{ position: "absolute", top: 86, left: 0, right: 0, textAlign: "center", fontFamily: FONTE.titulo, fontWeight: 900, fontSize: 40, letterSpacing: 12, color: "#5b5446" }}>BANCO</div>
      </>
    );
  if (cenario === "escritorio")
    return (
      <>
        <div style={{ position: "absolute", top: 380, right: 60, width: 360, height: 250, background: "#0f1a22", border: "14px solid #222", borderRadius: 10 }}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} style={{ margin: "18px 20px 0", height: 16, background: i === 3 ? COR.rosa : "#3b6b8a", width: `${60 + ((i * 37) % 35)}%` }} />
          ))}
        </div>
        <div style={{ position: "absolute", bottom: 420, left: 0, right: 0, height: 40, background: "#5b4636" }} />
      </>
    );
  return (
    <>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ position: "absolute", bottom: 420, left: 20 + i * 240, width: 200, height: 520 + i * 60, background: ["#9c4a32", "#b7a58a", "#7a4c3b"][i], border: "8px solid #3a2a20" }} />
      ))}
    </>
  );
};

export const Cena: React.FC<CenaProps> = ({ imagem, cenario, humor, zoomFinal = 1.12, close, etiqueta }) => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const zoom = interpolate(f, [0, durationInFrames], [1, zoomFinal]);
  const entrada = interpolate(f, [0, 6], [0.92, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        {imagem ? (
          <Img src={staticFile(imagem)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <AbsoluteFill style={{ background: FUNDOS[cenario] }}>
            <Objetos cenario={cenario} />
            <div
              style={{
                position: "absolute",
                left: "50%",
                bottom: close ? -300 : 120,
                transform: `translateX(-50%) scale(${(close ? 1.7 : 0.8) * entrada})`,
                transformOrigin: "bottom center",
              }}
            >
              <Personagem humor={humor} />
            </div>
          </AbsoluteFill>
        )}
      </AbsoluteFill>
      {etiqueta && (
        <div
          style={{
            position: "absolute",
            left: etiqueta.x,
            top: etiqueta.y,
            transform: `scale(${interpolate(f, [4, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
            background: COR.rosa,
            color: "white",
            padding: "12px 20px",
            borderRadius: 8,
            fontFamily: FONTE.titulo,
            fontWeight: 900,
            fontSize: 42,
            lineHeight: 1,
            boxShadow: "0 8px 24px rgba(0,0,0,.4)",
          }}
        >
          {etiqueta.titulo}
          {etiqueta.sub && (
            <div style={{ fontFamily: FONTE.mono, fontWeight: 600, fontSize: 20, marginTop: 6, letterSpacing: 2 }}>
              {etiqueta.sub}
            </div>
          )}
        </div>
      )}
    </AbsoluteFill>
  );
};
