import React from "react";
import { Img, staticFile } from "remotion";
import type { Humor } from "./Personagem";

// Personagem da série: a arte do usuário (public/personagem/bento.png), parada, sem falar.
// O movimento do plano vem só da câmera (zoom lento da cena).

export const PersonagemImagem: React.FC<{ humor?: Humor; altura: number }> = ({ altura }) => (
  <Img
    src={staticFile("personagem/bento.png")}
    style={{ height: altura, display: "block", filter: "drop-shadow(0 18px 24px rgba(0,0,0,.45))" }}
  />
);
