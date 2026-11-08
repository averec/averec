# Formato da série — "Todo dinheiro deixa rastro"

Análise do reel de referência (`reference/source.mp4`, 720×1280, 30 fps, 87 s) e as regras para
criar novos episódios em português com Remotion.

## Por que o reel prende

1. **Gancho em segunda pessoa, no primeiro segundo.** A narração coloca o espectador dentro do
   crime ("você acabou de…") com um número grande e concreto. Sem introdução, sem logo.
2. **A tese em uma frase** logo depois do gancho (≈7 s): "todo dólar deixa rastro". Todo o resto
   é prova dessa frase.
3. **Problemas numerados** ("Problema um", "Problema dois", "Regra um", "Dia dois", "Dia três").
   Cada bloco é uma ideia contável — o espectador sabe onde está e quer o próximo.
4. **Números físicos e verificáveis** (peso das notas, limite de depósito, lei citada em letra
   miúda). Dá credibilidade e vira motivo de comentário/compartilhamento.
5. **Estado persistente na tela (HUD)**: DINHEIRO / NO BANCO / SUSPEITA. O espectador acompanha o
   placar subir e descer — é um jogo. A suspeita sobe em vermelho/rosa quando ele erra.
6. **Reviravolta**: a solução "esperta" (depositar abaixo do limite) tem nome e é crime
   ("ESTRUTURAÇÃO"). Recompensa quem ficou até a metade.
7. **Final aberto com escolha binária** (ESCONDER × GASTAR) e "a maioria escreve a parte 2".
   Gera comentário e seguidores para o próximo episódio.

## Estrutura temporal (≈85 s, ~3 palavras/s)

| Bloco | Tempo | Função | Visual |
| --- | --- | --- | --- |
| Gancho | 0–5 s | situação + número grande | cena ilustrada, câmera aproximando |
| Tese | 5–9 s | "todo dinheiro deixa rastro" | close no personagem |
| Problema 1 | 10–23 s | obstáculo físico + números | HUD aparece; cartão claro com grade de notas e contador |
| Problema 2 | 23–34 s | risco escondido | cena + etiqueta rosa destacando o objeto |
| Regra | 34–37 s | lição curta | cartão preto, título branco, rótulo rosa "REGRA 1" |
| Dia 2 | 37–58 s | plano "esperto" | cartões claros: limite → seta → "AUTOMATICAMENTE" carimbado; gráfico de barras abaixo da linha; cenas com etiqueta de valor por depósito, HUD atualizando |
| Reviravolta | 59–71 s | o plano tem nome e é crime | cartão preto, palavra gigante rosa, carimbo "CRIME FEDERAL", barra de suspeita subindo; cena do analista olhando a tela |
| Dia 3 / placar | 71–78 s | resumo do estado | cartão claro com os três números do HUD em tamanho grande |
| Escolha | 78–82 s | dilema | cena + dois botões (ESCONDER / GASTAR) |
| CTA | 82–87 s | "comente…", "parte 2 amanhã" | cartão preto, "PARTE 2 / AMANHÃ" |

Ritmo de corte: troca de imagem a cada **2–4 s**, sempre num marco da fala (número, nome do
problema, palavra-chave). Nenhum plano fica parado: zoom lento (Ken Burns) nas cenas, contadores
e carimbos animados nos cartões.

## Sistema visual

- **Três tipos de tela**: cena ilustrada (personagem), cartão claro (`#EFEBE3`, dados/explicação),
  cartão escuro (`#141110`, regra/reviravolta/CTA).
- **Cores**: texto `#111`/branco, destaque rosa-magenta `#E8336D` (suspeita, rótulos, palavra
  gigante), verde-nota `#7FB77E` para dinheiro.
- **Tipografia**: título sans-serif pesada e compacta (Inter 800, entreletra negativa); rótulos em
  monoespaçada pequena, maiúsculas, espaçadas ("PROBLEMA 1 · O PESO").
- **HUD** no topo (≈6% da altura): três caixas escuras translúcidas, rótulo mono minúsculo e valor
  em negrito. Valores mudam com contador animado; suspeita fica rosa quando > 0.
- **Legenda**: centralizada a ~70% da altura, 2–4 palavras por vez, branca em negrito com sombra;
  a palavra que ainda vai ser falada aparece em cinza e acende quando é dita.
- **Personagem**: original da série (não copiar o da referência). Traço de desenho animado limpo,
  cabeça grande, boné e moletom; cenários semi-realistas com luz neon rosa.

## Narração

- Voz masculina, grave, calma e seca — conta o crime como quem conta uma piada sem rir.
- Frases curtas. Pausas curtas antes do número ou da virada. Ênfase na palavra que carrega a
  ideia ("**todo** dinheiro", "**automaticamente**", "**toda** vez").
- Marcações de entonação usadas no roteiro (`roteiros/*.md`): `[sério]`, `[irônico]`,
  `[suspense]`, `[pausa]`, `[ênfase]`, `[rápido]`, `[sussurro]`. Elas orientam o motor de voz
  (velocidade, pausas, intensidade) e a direção de leitura.

## Como fazer um novo episódio

1. Escrever o roteiro em `roteiros/epNN.md` seguindo a estrutura acima (gancho com número,
   tese, 2–3 problemas numerados, regra, plano, reviravolta, placar, escolha, CTA).
2. Gerar a narração (`scripts/narrar.py`) e transcrever com tempos por palavra
   (`scripts/transcrever.py`) → `public/epNN/narracao.wav` + `public/epNN/palavras.json`.
3. Descrever as cenas e cartões em `src/episodios/epNN.ts` ancorando cada troca numa palavra.
4. Colocar as ilustrações em `public/epNN/cenas/` (ou usar os placeholders).
5. `npx remotion render EpNN out/epNN.mp4`.
