import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { COR, FONTE } from "./tema";

/** Título grande do gancho, no primeiro segundo do vídeo (some quando a narração engata). */
export const TituloGancho: React.FC<{ linha1: string; destaque: string; ate: number }> = ({ linha1, destaque, ate }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entra = spring({ frame: f, fps, config: { damping: 12, stiffness: 200 } });
  const sai = interpolate(f / fps, [ate - 0.25, ate], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      style={{
        position: "absolute",
        top: 300,
        left: 50,
        right: 50,
        textAlign: "center",
        opacity: sai,
        transform: `scale(${interpolate(entra, [0, 1], [1.3, 1])})`,
        fontFamily: FONTE.titulo,
        fontWeight: 900,
        letterSpacing: -2.5,
        lineHeight: 1,
        textShadow: "0 6px 0 #000, 0 0 30px rgba(0,0,0,.6)",
      }}
    >
      <div style={{ fontSize: 92, color: "white" }}>{linha1}</div>
      <div style={{ fontSize: 120, color: COR.rosa, WebkitTextStroke: "3px #000" }}>{destaque}</div>
    </div>
  );
};

/** Faixa de votação por emoji no meio do vídeo. */
export const FaixaVoto: React.FC<{ pergunta: string; a: string; b: string }> = ({ pergunta, a, b }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: f, fps, config: { damping: 13 } });
  return (
    <div
      style={{
        position: "absolute",
        top: 330,
        left: 50,
        right: 50,
        transform: `translateY(${(1 - p) * -60}px)`,
        opacity: p,
        background: "rgba(18,16,15,.9)",
        border: `4px solid ${COR.rosa}`,
        borderRadius: 22,
        padding: "22px 26px",
        textAlign: "center",
        fontFamily: FONTE.titulo,
        color: "white",
      }}
    >
      <div style={{ fontSize: 40, fontWeight: 800 }}>{pergunta}</div>
      <div style={{ fontSize: 52, fontWeight: 900, marginTop: 10 }}>
        {a} <span style={{ color: "#999", fontSize: 36 }}>ou</span> {b}
      </div>
    </div>
  );
};

/** Capa do Reel: a ilustração do usuário com o título grande. */
export const Capa: React.FC<{ imagem: string; linha1: string; destaque: string; rodape: string }> = ({ imagem, linha1, destaque, rodape }) => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Img src={staticFile(imagem)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,.55) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0) 70%, rgba(0,0,0,.6) 100%)" }} />
    <div
      style={{
        position: "absolute",
        top: 250,
        left: 40,
        right: 40,
        textAlign: "center",
        fontFamily: FONTE.titulo,
        fontWeight: 900,
        letterSpacing: -3,
        lineHeight: 0.98,
        textShadow: "0 8px 0 #000",
      }}
    >
      <div style={{ fontSize: 104, color: "white" }}>{linha1}</div>
      <div style={{ fontSize: 150, color: COR.rosa, WebkitTextStroke: "4px #000" }}>{destaque}</div>
    </div>
    <div
      style={{
        position: "absolute",
        bottom: 300,
        left: 0,
        right: 0,
        textAlign: "center",
        fontFamily: FONTE.mono,
        fontWeight: 600,
        fontSize: 34,
        letterSpacing: 6,
        color: "white",
        textShadow: "0 3px 8px #000",
      }}
    >
      {rodape}
    </div>
  </AbsoluteFill>
);
