import { ancora, DadosEpisodio } from "../../serie/Episodio";
import { Palavra } from "../../serie/Legenda";
import { CartaoFinal, CartaoNome, CartaoRegra, CartaoTexto, Escolha } from "../../serie/Cartoes";
import { TituloGancho } from "../../serie/Chamadas";
import legenda from "./legenda.json";

// "E se fosse você?" — O chefão. Locução clonada no VoiceStudio a partir da voz do ep. 01.
const palavras = legenda as Palavra[];
const em = ancora(palavras);

const t = {
  trezentos: em("Trezentos"),
  tese: em("todo", 1),
  dia1: em("Dia", 1),
  dilema: em("Se", 1),
  dia10: em("Dia", 2),
  burrice: em("Burrice."),
  avo: em("avó?", 1, -1.2),
  receita: em("Receita"),
  dia30: em("Dia", 3),
  delacao: em("delação", 1, -0.3),
  agora: em("Agora"),
  desconfia: em("desconfia", 1, -0.4),
  cta: em("Comenta:"),
};

export const ep02: DadosEpisodio = {
  audio: "ep02/narracao.wav",
  palavras,
  duracao: palavras[palavras.length - 1].e + 1.6,
  configHud: { rotulos: ["POR MÊS", "HOMENS", "RISCO"], formatoBanco: "numero" },
  hud: [
    { t: 0, dinheiro: 50_000_000, banco: 300, suspeita: 0 },
    { t: t.dilema, dinheiro: 50_000_000, banco: 300, suspeita: 10 },
    { t: t.receita, dinheiro: 50_000_000, banco: 300, suspeita: 35 },
    { t: t.dia30, dinheiro: 50_000_000, banco: 299, suspeita: 50 },
    { t: t.delacao + 1, dinheiro: 50_000_000, banco: 299, suspeita: 85 },
  ],
  blocos: [
    {
      de: 0,
      tipo: "cena",
      cena: { cenario: "mafia", humor: "esperto", zoomFinal: 1.12 },
      sobre: <TituloGancho linha1="E SE VOCÊ FOSSE" destaque="O CHEFÃO?" ate={t.trezentos} />,
    },
    { de: t.trezentos, tipo: "cena", cena: { cenario: "mafia", humor: "esperto" }, hud: true },
    { de: t.tese, tipo: "cartao", cartao: <CartaoRegra rotulo="A REGRA DO JOGO" texto="Todo real deixa rastro." /> },
    {
      de: t.dia1,
      tipo: "cena",
      cena: { cenario: "mafia", humor: "bravo", etiqueta: { titulo: "BRAÇO DIREITO", sub: "QUER UMA PARTE MAIOR", x: 60, y: 330 } },
      hud: true,
      rotuloHud: "DIA 1",
    },
    {
      de: t.dilema,
      tipo: "cartao",
      cartao: (
        <CartaoTexto
          rotulo="DIA 1 · O DILEMA"
          titulo="Nega ou aceita?"
          tamanho={96}
          sub="Nega: ganha um inimigo. Aceita: todo mundo vai querer."
          subEm={0.6}
        />
      ),
    },
    {
      de: t.dia10,
      tipo: "cartao",
      cartao: (
        <CartaoTexto
          rotulo="DIA 10 · A MANSÃO"
          titulo="No seu nome?"
          tamanho={104}
          carimbo="BURRICE"
          carimboEm={t.burrice - t.dia10}
        />
      ),
    },
    {
      de: t.avo,
      tipo: "cena",
      cena: { cenario: "escritorio", humor: "assustado", etiqueta: { titulo: "AVÓ, 82 ANOS", sub: "APOSENTADA · COMPROU MANSÃO", x: 60, y: 330 } },
      hud: true,
    },
    { de: t.dia30, tipo: "cena", cena: { cenario: "mafia", humor: "preocupado", close: true }, hud: true, rotuloHud: "DIA 30" },
    {
      de: t.delacao,
      tipo: "cartao",
      cartao: (
        <CartaoNome
          rotulo="A PROPOSTA"
          palavra="DELAÇÃO PREMIADA"
          definicao="Ele conta tudo. A pena dele cai."
          carimbo="LEI 12.850/2013"
          tempos={[0.6, 1.4]}
          suspeita={[50, 85]}
        />
      ),
    },
    { de: t.agora, tipo: "cena", cena: { cenario: "mafia", humor: "assustado", close: true }, hud: true },
    {
      de: t.desconfia,
      tipo: "cena",
      cena: { cenario: "mafia", humor: "preocupado", close: true },
      hud: true,
      sobre: <Escolha rotulo="QUEM TE ENTREGA?" a="🤵 BRAÇO DIREITO" b="📒 CONTADOR" />,
    },
    {
      de: t.cta,
      tipo: "cartao",
      cartao: <CartaoFinal rotulo="E SE FOSSE VOCÊ?" linha1="PARTE 2" linha2="AMANHÃ" chamada="Comenta 🤵 ou 📒. Quem te entrega?" />,
    },
  ],
};
