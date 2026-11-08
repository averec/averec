import React from "react";
import { Composition, continueRender, delayRender } from "remotion";
import { Episodio } from "./serie/Episodio";
import { carregarFontes } from "./serie/tema";
import { ep01 } from "./episodios/ep01";

const espera = delayRender("fontes");
carregarFontes().then(() => continueRender(espera));

const FPS = 30;

// Os blocos contêm JSX, que não pode ir em defaultProps (são serializados); por isso um wrapper.
const Ep01: React.FC = () => <Episodio dados={ep01} />;

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
    </>
  );
};
