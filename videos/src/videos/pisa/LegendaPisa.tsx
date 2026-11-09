// Camada só de legenda (fundo transparente) para sobrepor ao render 3D da Torre de Pisa.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Legenda, Palavra } from "../../serie/Legenda";
import legenda from "./legenda.json";

export const LegendaPisa: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "transparent" }}>
    <Legenda palavras={legenda as Palavra[]} />
  </AbsoluteFill>
);
