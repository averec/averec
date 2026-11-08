import React from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import type { Humor } from "./Personagem";

// Personagem da série a partir da arte do usuário (public/personagem/bento.png, fundo recortado).
// Como é uma imagem única, o humor vira linguagem corporal: entrada com quique, pulinhos,
// inclinação e tremor.

export const PersonagemImagem: React.FC<{ humor?: Humor; altura: number }> = ({ humor = "neutro", altura }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entra = spring({ frame: f, fps, config: { damping: 11, stiffness: 160 } });
  const pulo = Math.abs(Math.sin(f / 10)) * (humor === "esperto" ? -14 : -6);
  const tremor = humor === "assustado" ? Math.sin(f * 2.3) * 5 : 0;
  const inclinacao = { neutro: 0, preocupado: -3, esperto: 4, assustado: 0 }[humor] + Math.sin(f / 22) * 1.2;
  const achata = interpolate(entra, [0, 1], [0.85, 1]);
  return (
    <div
      style={{
        height: altura,
        transformOrigin: "bottom center",
        transform: `translate(${tremor}px, ${pulo}px) rotate(${inclinacao}deg) scale(${2 - achata}, ${achata})`,
        filter: "drop-shadow(0 18px 24px rgba(0,0,0,.45))",
      }}
    >
      <Img src={staticFile("personagem/bento.png")} style={{ height: "100%" }} />
    </div>
  );
};
