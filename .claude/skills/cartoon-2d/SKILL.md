---
name: cartoon-2d
description: Faz um desenho animado vertical curto (1080x1920, 30 fps). Oferece 10 ideias, escreve o roteiro e transforma a locução do usuário num MP4 pronto, com trilha e efeitos sonoros a 50% do nível da voz. Use para qualquer pedido de desenho animado curto ou história animada.
---

# Desenho animado curto: ideia → roteiro → locução → MP4

Skill "cartoon-2d": versão em português, adaptada do PDF "cartoon-audio-short" enviado pelo usuário. O PDF descreve
um `kit/` (motor, ferramentas e exemplo) que **não veio junto**. O `kit/` desta pasta é o código
aberto de onde ele deriva: `mromidev/claude-animated-shorts` (licença MIT, ver `kit/LICENSE`),
que faz o mesmo visual com three.js dentro do Remotion. Onde o PDF cita uma ferramenta que não
existe aqui, a coluna "aqui" diz o que usar.

**O visual:** personagens 2D chapados "cabeça de feijão" (cartões desenhados em canvas, contorno
ameixa) num mundo 3D colorido com contorno preto, texturas pintadas, profundidade de campo e
câmera deslizando. Saída 1080x1920, 30 fps, com a duração exata da locução. A voz do usuário não
é alterada. Trilha e efeitos são sintetizados e ficam a 50% do nível da voz.

## Regras
- Histórias, personagens e planos sempre originais. Nunca refazer o vídeo de outro criador plano a
  plano; oferecer uma versão original da mesma ideia.
- Nada de pessoas reais vivas como personagens, nem mascotes ou logotipos de marcas.
- Sem legenda, a menos que o usuário peça. Texto dentro da cena (placa, mensagem entalhada) pode,
  e tem de ler certo (não espelhado).
- Nunca editar nem re-temporizar a voz. A imagem segue a voz, e cada reação visual cai de 0 a 3
  quadros antes da palavra.
- Áudio: trilha a 50% da voz (−6 dB, RMS com gate); efeitos a 50% ou menos, com picos limitados
  para nenhum impacto passar por cima da narração. Mixar sempre com o script de mix, nunca à mão.
  Sem ducking nem compressão que mude essa proporção: só um ganho linear e um limitador de pico na
  mixagem inteira.
- Manter o usuário informado com uma lista de tarefas. Mandar uma folha de quadros antes da
  renderização longa.
- Projeto: tudo em português do Brasil (roteiro, narração, textos), conforme o `CLAUDE.md`.

## Estágio 1: entrada (sempre primeiro)
Se já veio um áudio, pular para o Estágio 4 (e usar o roteiro, se veio, para o tempo). Senão,
perguntar de onde o usuário quer começar:
- **Locução pronta:** pedir o áudio e o texto do roteiro (o texto deixa o tempo exato).
- **Tenho roteiro, falta a locução:** ajustar pelo Estágio 3, devolver com dicas de gravação e
  pedir o áudio.
- **Preciso de ideias e roteiro:** ir ao Estágio 2 e perguntar a duração (padrão 20–30 s;
  45–60 s permitido).

## Estágio 2: 10 ideias
Exatamente 10 ideias numa resposta, numeradas, e pedir um número (ou "mais"). Cada ideia tem:
- **Título** de 5 a 8 palavras, que dá curiosidade.
- **Gancho:** a primeira frase falada, um paradoxo dito como fato.
- **Virada** numa linha: o fecho irônico que termina o vídeo.
- **Por que anima bem:** os 2 ou 3 grandes momentos visuais (desabamento, revelação, perseguição).
- **Verdade ou lenda:** dizer se é história documentada, relato disputado ou folclore.

Ideia boa para o formato: uma história surpreendente com causa e efeito físicos que dá para
mostrar; um personagem comum, risco que cresce e virada na última linha; um cenário montável com
formas 3D simples e cartões (cidades, pontes, navios, castelos, desertos, laboratórios, palácios).
Variar épocas e temas. O que for apresentado como verdade precisa ter os fatos-chave conferidos
numa busca na web; lenda viral nunca vira fato ("diz a lenda"). Nada de pessoas reais vivas como
alvo de piada, nada gráfico, nada político.

## Estágio 3: roteiro (depois da escolha)
Só a narração, sem indicações de cena no texto falado, a cerca de 3,7 palavras/s
(20 s ≈ 75 palavras, 30 s ≈ 110, 60 s ≈ 220). Fórmula:
1. **Gancho** (frase 1, sem preparação): o fato absurdo.
2. **Cenário** em 1–2 linhas: quando, onde, quem, um detalhe concreto.
3. **Escalada** em 2–4 batidas, cada uma maior; os outros duvidam ou zombam; uma piada de exagero.
4. **Mistério ou virada de explicação** ("Mas quando…", "Acontece que…"): o mecanismo real, de
   preferência com uma analogia do dia a dia.
5. **Fecho:** curto, irônico, as últimas palavras do vídeo.

Português falado, frases de 8 a 15 palavras, números por extenso. Nunca descrever o que o
espectador já está vendo. Responder com: o roteiro num bloco copiável (contagem de palavras e
duração estimada), um parágrafo com o plano visual, dicas de gravação (voz de narrador estável e
calorosa, pausas naturais no fim das frases, exportar sem música, MP3 ou WAV) e o pedido do áudio.
Guardar o texto final do roteiro: ele comanda o tempo no Estágio 4.

## Estágio 4: montar o vídeo (depois do áudio)
Fazer tudo sem parar; perguntar só se o tempo não fechar.

| Passo | No PDF | Aqui |
| --- | --- | --- |
| 4.0 Kit | `kit/tools/setup.sh` copia o motor | Copiar `kit/templates/bridge/` para `videos/src/videos/<slug>/` e instalar `three`, `@remotion/three`, `@react-three/fiber`, `@react-three/postprocessing`, `postprocessing` |
| 4.1 Tempo | `timing.py` | `videos/scripts/transcrever.py` + `alinhar_locucao.py` (palavras com tempo); total de quadros = round(duração × 30) |
| 4.2 Plano | `work/PLAN.md` | Uma linha por plano: quadros, palavras, cenário, luz, câmera, personagens/poses/expressões, efeitos e deixa de som. Quadro 0 já é a imagem do gancho |
| 4.3 Mundo | `web/main.js` | `world.ts` / `build.ts` / `paint.ts` do kit |
| 4.4 Elenco | `roman.js` / `toon.js` | `cast.ts` / `toon.ts` do kit |
| 4.5 Movimento | `motion.js` | `story.ts` (câmeras, `layersAt`, `dofAt`) |
| 4.6 Conferência | `render.mjs stills` + `sheet.py` | `npx remotion still` em vários quadros + `kit/templates/scripts/sbs_sheet.py`; mandar a folha ao usuário |
| 4.7 Som | `audio.py` + `mix.py` | `kit/templates/audio/` (`music.py`, `sfx.py`, `mix.py`), ajustando o mix para trilha e efeitos a −6 dB da voz, sem ducking |
| 4.8 Render | `render.mjs` + `finish.sh` | `npx remotion render`, ganho linear até ~−14 LUFS com limitador −1 dBFS, H.264 + AAC; `kit/templates/scripts/short_qa.py` para achar quadros congelados ou pretos |

Regras do plano: em geral um plano por frase; ilustrar cada frase literalmente; variar o tamanho
dos planos (gancho em plano médio → revelação aberta → dois personagens → detalhe do objeto →
close de reação → movimento de ambiente no fecho). Luz por batida: dia para o normal, dourada para
declínio ou drama, azul-noite para explicação. Pulo de tempo ganha um flash branco de 6 quadros. A
frase da virada ganha um "sting" (a música para, impacto grave, aproximação com leve giro), e o
efeito físico do último plano cai na última palavra.

Movimento: câmera sempre deslizando (18–45 quadros), nada parado por 4+ quadros, personagens com
respiração/piscadas, antecipação → exagero → assentamento nas ações, algo sempre se mexendo no
fundo (bandeiras, folhas, poeira, água). Profundidade de campo em closes e planos médios, foco nos
olhos; planos abertos nítidos.

Armadilhas a conferir na folha: quadro vertical estreito (encenar em profundidade), grades ou
postes na frente de rostos, câmera atravessando casas, herói escondido atrás de pilar, texto
espelhado, contorno faltando.

Entrega: o MP4 com `SendUserFile` e algumas linhas sobre o que cada plano mostra; oferecer
legendas, ajustes ou a próxima ideia da lista.
