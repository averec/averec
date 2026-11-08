import { ancora, DadosEpisodio } from "../../serie/Episodio";
import { Palavra } from "../../serie/Legenda";
import {
  CartaoBarras,
  CartaoFinal,
  CartaoLimite,
  CartaoNome,
  CartaoPeso,
  CartaoPlacar,
  CartaoRegra,
  CartaoTexto,
  Escolha,
} from "../../serie/Cartoes";
import legenda from "./legenda.json";

const palavras = legenda as Palavra[];
// Ilustração do usuário (já traz o personagem): cada plano escolhe um enquadramento.
const PAREDE = "ep01/cenas/parede.jpg";
const DINHEIRO = { x: 0.82, y: 0.45, zoom: 1.7 };
// Parte alta da parede (sem o personagem da ilustração), para os closes com as expressões.
const PAREDE_ALTO = { x: 0.75, y: 0, zoom: 2.2 };
const em = ancora(palavras);

// Cada bloco começa numa palavra da narração; trocar o roteiro move os cortes junto.
const t = {
  sorte: em("Parece"),
  tese: em("Todo", 1),
  p1: em("Problema", 1),
  lei: em("Pela"),
  garoupa: em("Essas"),
  achada: em("Isso"),
  p2: em("Problema", 2),
  prazo: em("Quem"),
  crime: em("crime."),
  relogio: em("relógio", 1, -0.2),
  regra: em("Regra"),
  dia2: em("Dia", 1),
  peso: em("Vinte", 1),
  quilos: em("Vinte", 2),
  limite: em("sabe:", 1, -0.6),
  comunicado: em("comunicado"),
  auto: em("Automaticamente."),
  toda: em("Toda"),
  esperto: em("Aí"),
  cadaDia: em("cada"),
  dep1: em("Quarenta", 2),
  dep2: em("Noventa"),
  dep3: em("Cento"),
  padrao: em("Só"),
  nome: em("Fracionamento.", 1, -0.3),
  procurar: em("treinado"),
  receita: em("ano", 1, -0.4),
  dia3: em("Dia", 3),
  escolha: em("devolver", 1, -0.5),
  cta: em("Comenta:"),
};

export const ep01: DadosEpisodio = {
  audio: "ep01/narracao.wav",
  palavras,
  duracao: palavras[palavras.length - 1].e + 1.6,
  hud: [
    { t: 0, dinheiro: 2_000_000, banco: 0, suspeita: 0 },
    { t: t.relogio, dinheiro: 2_000_000, banco: 0, suspeita: 10 },
    { t: t.dep1, dinheiro: 1_951_000, banco: 49_000, suspeita: 10 },
    { t: t.dep2, dinheiro: 1_902_000, banco: 98_000, suspeita: 15 },
    { t: t.dep3, dinheiro: 1_853_000, banco: 147_000, suspeita: 20 },
    { t: t.procurar, dinheiro: 1_853_000, banco: 147_000, suspeita: 45 },
    { t: t.receita, dinheiro: 1_853_000, banco: 147_000, suspeita: 60 },
  ],
  blocos: [
    { de: 0, tipo: "cena", cena: { cenario: "rua", humor: "neutro", zoomFinal: 1.18 } },
    { de: em("E", 1), tipo: "cena", cena: { cenario: "parede", imagem: PAREDE, foco: DINHEIRO, zoomFinal: 1.08 } },
    { de: t.sorte, tipo: "cena", cena: { cenario: "parede", imagem: PAREDE, foco: PAREDE_ALTO, personagem: true, close: true, humor: "esperto", zoomFinal: 1.05 } },
    {
      de: t.tese,
      tipo: "cartao",
      cartao: <CartaoRegra rotulo="A REGRA DO JOGO" texto="Todo real deixa rastro." />,
    },
    { de: t.p1, tipo: "cena", cena: { cenario: "parede", imagem: PAREDE, zoomFinal: 1.1 }, hud: true, rotuloHud: "PROBLEMA 1" },
    {
      de: t.lei,
      tipo: "cartao",
      cartao: (
        <CartaoTexto
          rotulo="PROBLEMA 1 · NÃO É TESOURO"
          titulo="Tesouro"
          sub="é algo tão antigo que ninguém lembra do dono."
          subEm={0.6}
          rodape="Código Civil, art. 1.264"
        />
      ),
    },
    {
      de: t.garoupa,
      tipo: "cena",
      cena: {
        cenario: "parede",
        imagem: PAREDE,
        foco: DINHEIRO,
        etiqueta: { titulo: "NOTA DE R$ 100", sub: "SÉRIE ATUAL · GAROUPA", x: 60, y: 300 },
      },
      hud: true,
    },
    {
      de: t.achada,
      tipo: "cartao",
      cartao: (
        <CartaoTexto
          rotulo="PROBLEMA 1 · NÃO É TESOURO"
          titulo="Coisa achada"
          carimbo="TEM DONO"
          carimboEm={em("dono.", 2) - t.achada}
          rodape="Código Civil, art. 1.233"
        />
      ),
    },
    { de: t.p2, tipo: "cena", cena: { cenario: "parede", imagem: PAREDE, foco: { x: 0.5, y: 0.6, zoom: 1.3 } }, hud: true, rotuloHud: "PROBLEMA 2" },
    {
      de: t.prazo,
      tipo: "cartao",
      cartao: (
        <CartaoTexto
          rotulo="PROBLEMA 2 · O PRAZO"
          titulo="15 dias"
          tamanho={170}
          sub="para devolver o que achou."
          subEm={0.8}
          carimbo="CRIME"
          carimboEm={t.crime - t.prazo}
          rodape="Código Penal, art. 169, parágrafo único, II"
        />
      ),
    },
    { de: t.relogio, tipo: "cena", cena: { cenario: "parede", imagem: PAREDE, foco: PAREDE_ALTO, personagem: true, close: true, humor: "assustado", zoomFinal: 1.05 }, hud: true },
    {
      de: t.regra,
      tipo: "cartao",
      cartao: <CartaoRegra rotulo="REGRA 1" texto="Dinheiro achado não é dinheiro ganho." />,
    },
    { de: t.dia2, tipo: "cena", cena: { cenario: "banco", humor: "esperto" }, hud: true, rotuloHud: "DIA 2" },
    {
      de: t.peso,
      tipo: "cartao",
      cartao: (
        <CartaoPeso
          rotulo="DIA 2 · O PESO"
          prefixo="R$ 2 mi em notas de 100 ="
          notas={20_000}
          quilos={20}
          tempos={[0, 1.2, t.quilos - t.peso]}
        />
      ),
    },
    {
      de: t.limite,
      tipo: "cartao",
      cartao: (
        <CartaoLimite
          rotulo="A LINHA DOS R$ 50 MIL"
          valor="R$ 50.000"
          tempos={[t.comunicado - t.limite, t.auto - t.limite, t.toda - t.limite]}
          rodape="Banco Central, Circular nº 3.978/2020"
        />
      ),
    },
    {
      de: t.esperto,
      tipo: "cartao",
      cartao: (
        <CartaoBarras
          rotulo="O PLANO"
          titulo="R$ 49 mil por vez."
          sub="Cada dia num banco."
          barras={[
            { valor: "49k", em: em("Quarenta", 1) - t.esperto },
            { valor: "49k", em: t.cadaDia - t.esperto },
            { valor: "49k", em: t.cadaDia - t.esperto + 0.4 },
          ]}
        />
      ),
    },
    {
      de: t.dep1,
      tipo: "cena",
      cena: { cenario: "banco", humor: "esperto", etiqueta: { titulo: "R$ 49.000", sub: "DEPÓSITO · BANCO 1", x: 380, y: 760 } },
      hud: true,
    },
    {
      de: t.dep3,
      tipo: "cena",
      cena: { cenario: "rua", humor: "triste", etiqueta: { titulo: "R$ 147.000", sub: "DEPÓSITO 3 · BANCO 3", x: 340, y: 760 } },
      hud: true,
    },
    {
      de: t.nome,
      tipo: "cartao",
      cartao: (
        <CartaoNome
          rotulo="ESSE PADRÃO TEM NOME"
          palavra="FRACIONAMENTO"
          definicao="Dividir o dinheiro para ficar abaixo da linha."
          carimbo="SINAL DE ALERTA"
          tempos={[0.8, t.procurar - t.nome]}
          suspeita={[20, 45]}
        />
      ),
    },
    {
      de: t.receita,
      tipo: "cena",
      cena: {
        cenario: "escritorio",
        humor: "bravo",
        etiqueta: { titulo: "DE ONDE VEIO?", sub: "DECLARAÇÃO DO IMPOSTO DE RENDA", x: 60, y: 300 },
      },
      hud: true,
    },
    {
      de: t.dia3,
      tipo: "cartao",
      cartao: <CartaoPlacar rotulo="DIA 3 · ONDE VOCÊ ESTÁ" dinheiro={1_853_000} banco={147_000} suspeita={60} />,
    },
    {
      de: t.escolha,
      tipo: "cena",
      cena: { cenario: "parede", imagem: PAREDE, foco: PAREDE_ALTO, personagem: true, close: true, humor: "preocupado", zoomFinal: 1.05 },
      hud: true,
      sobre: <Escolha rotulo="VOCÊ ESCOLHE" a="DEVOLVER" b="ARRISCAR" />,
    },
    {
      de: t.cta,
      tipo: "cartao",
      cartao: (
        <CartaoFinal
          rotulo="TODO REAL DEIXA RASTRO"
          linha1="PARTE 2"
          linha2="AMANHÃ"
          chamada="Comenta DEVOLVER ou ARRISCAR. A maioria escreve a parte 2."
        />
      ),
    },
  ],
};
