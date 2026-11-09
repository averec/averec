import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const COR = {
  claro: "#EFEBE3",
  escuro: "#141110",
  tinta: "#111111",
  cinza: "#8B8780",
  rosa: "#E8336D",
  verde: "#7FB77E",
  verdeEscuro: "#3E6B3D",
  hud: "rgba(18,16,15,0.82)",
};

export const FONTE = {
  titulo: "Inter, sans-serif",
  mono: "'JetBrains Mono', monospace",
};

const fontes: [string, string, string][] = [
  ["Inter", "inter-latin-500-normal.woff2", "500"],
  ["Inter", "inter-latin-700-normal.woff2", "700"],
  ["Inter", "inter-latin-800-normal.woff2", "800"],
  ["Inter", "inter-latin-900-normal.woff2", "900"],
  ["JetBrains Mono", "jetbrains-mono-latin-400-normal.woff2", "400"],
  ["JetBrains Mono", "jetbrains-mono-latin-600-normal.woff2", "600"],
];

export const carregarFontes = () =>
  Promise.all(
    fontes.map(([family, arquivo, weight]) =>
      loadFont({ family, url: staticFile(`fonts/${arquivo}`), weight }),
    ),
  );

export const reais = (v: number) =>
  "R$ " + Math.round(v).toLocaleString("pt-BR").replace(/,/g, ".");
