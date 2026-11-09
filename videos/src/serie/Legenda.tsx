import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { FONTE } from "./tema";

export type Palavra = { w: string; s: number; e: number; fala: number; tag: string };

const MAX = 3;

/** Agrupa até 3 palavras da mesma fala, quebrando depois de pontuação. */
export const agrupar = (ps: Palavra[]): Palavra[][] => {
  const grupos: Palavra[][] = [];
  let g: Palavra[] = [];
  ps.forEach((p, i) => {
    g.push(p);
    const prox = ps[i + 1];
    if (!prox || prox.fala !== p.fala || g.length >= MAX || /[.,:;?!]$/.test(p.w)) {
      grupos.push(g);
      g = [];
    }
  });
  return grupos;
};

/** Legenda palavra a palavra: a falada acende em branco, a próxima espera em cinza. */
export const Legenda: React.FC<{ palavras: Palavra[]; claro?: boolean }> = ({ palavras, claro }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const grupos = agrupar(palavras);
  const g = grupos.find((gr, i) => {
    const fim = grupos[i + 1] ? Math.min(grupos[i + 1][0].s, gr[gr.length - 1].e + 0.6) : gr[gr.length - 1].e + 0.6;
    return t >= gr[0].s - 0.05 && t < fim;
  });
  if (!g) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: "66%",
        left: 60,
        right: 60,
        textAlign: "center",
        fontFamily: FONTE.titulo,
        fontWeight: 800,
        fontSize: 64,
        lineHeight: 1.1,
        letterSpacing: -1.5,
        textShadow: claro ? "none" : "0 4px 18px rgba(0,0,0,.75), 0 2px 3px rgba(0,0,0,.9)",
      }}
    >
      {g.map((p, i) => {
        const dita = t >= p.s;
        const enfase = p.tag === "ênfase";
        return (
          <span
            key={i}
            style={{
              color: dita ? (claro ? "#111" : "white") : claro ? "rgba(0,0,0,.25)" : "rgba(255,255,255,.45)",
              display: "inline-block",
              transform: dita && enfase ? "scale(1.06)" : undefined,
              marginRight: 16,
            }}
          >
            {p.w.replace(/[,:;]$/, "")}
          </span>
        );
      })}
    </div>
  );
};
