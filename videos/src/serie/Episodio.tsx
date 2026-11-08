import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Cena, CenaProps } from "./Cena";
import { EstadoHud, Hud } from "./Hud";
import { Legenda, Palavra } from "./Legenda";

export type Bloco =
  | { de: number; tipo: "cena"; cena: CenaProps; hud?: boolean; rotuloHud?: string; sobre?: React.ReactNode }
  | { de: number; tipo: "cartao"; cartao: React.ReactNode };

export type DadosEpisodio = {
  audio: string;
  palavras: Palavra[];
  hud: EstadoHud[];
  blocos: Bloco[];
  duracao: number;
};

/** Momento (s) da n-ésima ocorrência de uma palavra na legenda — ancora cortes na fala. */
export const ancora = (palavras: Palavra[]) => (palavra: string, n = 1, desloc = 0) => {
  const norm = (w: string) => w.toLowerCase().replace(/[.,:;?!]/g, "");
  const achadas = palavras.filter((p) => norm(p.w) === norm(palavra));
  const p = achadas[n - 1];
  if (!p) throw new Error(`Palavra "${palavra}" (#${n}) não está na legenda`);
  return Math.max(0, p.s + desloc);
};

const LegendaSoNasCenas: React.FC<{ dados: DadosEpisodio }> = ({ dados }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const atual = [...dados.blocos].reverse().find((b) => b.de <= t);
  if (!atual || atual.tipo !== "cena") return null;
  return <Legenda palavras={dados.palavras} />;
};

export const Episodio: React.FC<{ dados: DadosEpisodio }> = ({ dados }) => {
  const { fps } = useVideoConfig();
  const fim = dados.duracao;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {dados.blocos.map((b, i) => {
        const ate = dados.blocos[i + 1]?.de ?? fim;
        const from = Math.round(b.de * fps);
        const dur = Math.max(1, Math.round(ate * fps) - from);
        return (
          <Sequence key={i} from={from} durationInFrames={dur} name={b.tipo === "cena" ? `cena ${b.cena.cenario}` : "cartão"}>
            {b.tipo === "cena" ? (
              <>
                <Cena {...b.cena} />
                {b.hud && <Hud marcos={dados.hud} inicio={b.de} rotulo={b.rotuloHud} />}
                {b.sobre}
              </>
            ) : (
              b.cartao
            )}
          </Sequence>
        );
      })}
      <LegendaSoNasCenas dados={dados} />
      <Audio src={staticFile(dados.audio)} />
    </AbsoluteFill>
  );
};
