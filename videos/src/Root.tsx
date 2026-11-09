import React from "react";
import { Composition, continueRender, delayRender, Still } from "remotion";
import { Episodio } from "./serie/Episodio";
import { carregarFontes } from "./serie/tema";
import { ep01 } from "./episodios/ep01";
import { ep01curto } from "./episodios/ep01curto";
import { ep02 } from "./episodios/ep02";
import { Capa } from "./serie/Chamadas";
import { Cena } from "./serie/Cena";

const espera = delayRender("fontes");
carregarFontes().then(() => continueRender(espera));

const FPS = 30;

// Os blocos contêm JSX, que não pode ir em defaultProps (são serializados); por isso um wrapper.
const Ep01: React.FC = () => <Episodio dados={ep01} />;
const Ep01Curto: React.FC = () => <Episodio dados={ep01curto} />;
const Ep02: React.FC = () => <Episodio dados={ep02} />;
const CapaEp02: React.FC = () => (
  <Capa
    fundo={<Cena cenario="mafia" humor="esperto" zoomFinal={1} />}
    linha1="E SE VOCÊ FOSSE"
    destaque="O CHEFÃO?"
    rodape="E SE FOSSE VOCÊ? · EP. 01"
    topo={430}
  />
);
const CapaEp01: React.FC = () => (
  <Capa imagem="ep01/cenas/parede.jpg" linha1="ACHEI R$ 2 MILHÕES" destaque="NA PAREDE" rodape="E AGORA? · EP. 01" />
);

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Ep01"
        component={Ep01}
        durationInFrames={Math.ceil(ep01.duracao * FPS)}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="Ep01Curto"
        component={Ep01Curto}
        durationInFrames={Math.ceil(ep01curto.duracao * FPS)}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="Ep02"
        component={Ep02}
        durationInFrames={Math.ceil(ep02.duracao * FPS)}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Still id="CapaEp02" component={CapaEp02} width={1080} height={1920} />
      <Still id="CapaEp01" component={CapaEp01} width={1080} height={1920} />
    </>
  );
};
