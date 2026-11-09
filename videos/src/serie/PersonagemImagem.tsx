import React from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import type { Humor } from "./Personagem";

// Personagem da série a partir das artes do usuário (public/personagem/*.png).
// Cada humor usa a expressão certa do gabarito; nos closes entram os bustos (rosto maior).
// Animação do corpo inteiro: entrada com quique, pulinhos, inclinação e tremor.

const CORPO: Record<Humor, string> = {
  neutro: "bento",
  serio: "bento",
  esperto: "esperto",
  bravo: "bravo",
  triste: "triste",
  preocupado: "triste",
  assustado: "bento",
};

const BUSTO: Partial<Record<Humor, string>> = {
  neutro: "serio",
  serio: "serio",
  assustado: "assustado",
  preocupado: "preocupado",
};

/** Arte usada para o humor; `busto` diz se é a versão da cintura para cima. */
export const arteDoPersonagem = (humor: Humor, close: boolean) => {
  const busto = close ? BUSTO[humor] : undefined;
  return { arquivo: `personagem/${busto ?? CORPO[humor]}.png`, busto: Boolean(busto) };
};

export const PersonagemImagem: React.FC<{ humor?: Humor; altura: number; close?: boolean }> = ({ humor = "neutro", altura, close = false }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { arquivo } = arteDoPersonagem(humor, close);
  const entra = spring({ frame: f, fps, config: { damping: 11, stiffness: 160 } });
  const achata = interpolate(entra, [0, 1], [0.85, 1]);
  const pulo = Math.abs(Math.sin(f / 10)) * (humor === "esperto" ? -14 : -6);
  const tremor = humor === "assustado" || humor === "preocupado" ? Math.sin(f * 2.3) * 5 : 0;
  const inclinacao =
    ({ neutro: 0, serio: 0, preocupado: -3, esperto: 4, assustado: 0, bravo: 2, triste: -3 } as const)[humor] + Math.sin(f / 22) * 1.2;
  return (
    <div
      style={{
        height: altura,
        transformOrigin: "bottom center",
        transform: `translate(${tremor}px, ${pulo}px) rotate(${inclinacao}deg) scale(${2 - achata}, ${achata})`,
        filter: "drop-shadow(0 18px 24px rgba(0,0,0,.45))",
      }}
    >
      <Img src={staticFile(arquivo)} style={{ height: "100%", display: "block" }} />
    </div>
  );
};
