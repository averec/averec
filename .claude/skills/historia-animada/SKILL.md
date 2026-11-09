---
name: historia-animada
description: Faz um vídeo vertical curto de história real em desenho animado (personagens 2D cabeça de feijão num mundo 3D com contorno preto), em português, com a voz clonada da série, legenda palavra a palavra, trilha e efeitos a 50% da voz. Use quando o usuário pedir "um vídeo como o da Torre de Pisa / do porco", uma história animada, curiosidade histórica animada ou um novo episódio nesse estilo.
---

# História animada (pipeline testado no projeto)

Fluxo que funcionou na "Torre de Pisa" (Teste 2). Base de regras visuais e de áudio: skill `cartoon-2d`.
Tudo em português do Brasil (ver `CLAUDE.md`). Respostas curtas: o usuário prefere economia de tokens.

## 1. Ideia e fatos
- Se o usuário não trouxe tema: 10 ideias numeradas (título, gancho, virada, momentos visuais, verdade/lenda).
- História real com causa e efeito física que dá para mostrar. Conferir os fatos-chave na web antes do roteiro;
  o que for disputado vira "diz a lenda" ou fica fora. Nada de pessoas reais vivas, marcas, nada gráfico/político.
- Personagens e cenários sempre originais (nunca copiar outro criador ou personagem conhecido).

## 2. Roteiro
- Salvar em `testes/<teste>/roteiros/<slug>.md`: bloco de fatos com fontes + seção `## Narração` (uma frase por linha).
- ~3,7 palavras/s (30 s ≈ 110 palavras). Gancho absurdo na 1ª frase → cenário → escalada → explicação com
  analogia → virada irônica nas últimas palavras. Números por extenso, sem indicação de cena no texto falado.
- Entregar ao usuário: roteiro em bloco copiável, contagem/duração, plano visual curto, fatos a confirmar e fontes.

## 3. Voz (clonada no VoiceStudio)
- Servidor: `cd /home/user/VoiceStudio && OMNIVOICE_ANALYTICS_DISABLED=1 OMNIVOICE_DEVICE=cpu uv run --no-sync uvicorn main:app --app-dir backend --host 127.0.0.1 --port 3900`
  (conferir `curl localhost:3900/health`). Licença OmniVoice aceita pelo usuário: **uso não comercial**.
- Amostra da voz da série: `videos/vozes/serie/referencia.wav` + `.txt` (11 s da locução do ep. 01; recriar
  com ffmpeg a partir de `videos/public/ep01/narracao.wav` se o container for novo).
- Gerar **frase por frase** (evita cortar o fim): `python3 -I testes/teste-2/gerar_voz.py <roteiro.md> <pasta>`
  em segundo plano (~2–4 min por frase na CPU). Conferir: transcrição completa e "OK" em todas as frases.
- Nunca acelerar nem editar a voz neste estilo; a imagem segue a voz.

## 4. Tempo
- `python3 -I videos/scripts/transcrever.py <locucao.wav> <palavras.json>`
- Extrair só a narração para `roteiro.txt` e rodar
  `python3 videos/scripts/alinhar_locucao.py <roteiro.txt> <palavras.json> videos/src/videos/<slug>/legenda.json`.
- Cada plano começa 2 quadros antes da primeira palavra da sua frase (`falaIni`, `palavra()` em `historia.ts`).

## 5. Mundo 3D (Remotion + three.js)
- Copiar `videos/src/videos/pisa/` como modelo: `historia.ts` (planos, câmeras, estado por quadro),
  `mundo.ts` (cenário, elenco, update), `Pisa.tsx` (render + pós), `kit/` (personagens `toon.ts`, contorno
  `ink.ts`, desfoque `lensblur.ts`, cor `grade.ts`, texturas `paint.ts`, luz `shade.ts`/`lights.ts`).
- Registrar a composição em `videos/src/Root.tsx` (1080×1920, 30 fps, duração = fim da voz + 0,9 s).
- Um plano por frase; variar tamanhos (médio → aberto → detalhe → reação → aberto no fecho). Luz: dia normal,
  dourada para drama/declínio, noite-azul para explicação. Pulo de tempo = flash branco de 6 quadros. A virada
  ganha aproximação com leve giro e a música para.
- Elenco: `bodyFront()` do `toon.ts` desenhado em cartões que giram só no eixo vertical; expressões do `Expr`.
- Texto dentro da cena (placas) em canvas, conferido legível e sem estourar a borda.

### Armadilhas já resolvidas (não repetir)
- O `<EffectComposer>` do `@react-three/postprocessing` sai **em branco** no render do Remotion: montar o
  `EffectComposer` do `postprocessing` à mão e chamar `composer.render()` em `useFrame(..., 1)` (ver `Pisa.tsx`).
- Sempre renderizar com `--gl=swangle`.
- Escala: torre de raio 3 m precisa de câmera a 18–36 m; câmera perto demais enche a tela de coluna.
- Câmera nunca dentro de andaime/objetos; personagem não pode cortar na borda; testar placas legíveis.

## 6. Conferência antes do render longo
- Stills no meio de cada plano: `npx remotion still <Comp> out/<slug>_stills/fNNNN.png --frame=N --scale=0.35 --gl=swangle --props='{"audio":""}'`
- Montar uma folha (PIL) e **mandar ao usuário** com `SendUserFile` antes do render; corrigir o que estiver errado.

## 7. Render, legenda e som
- Render em segundo plano, em 720p por enquanto (pedido do usuário) e em blocos (sobrevive a reinícios):
  `bash testes/teste-2/render_blocos.sh <Comp> <quadros> <pasta_blocos> <saida.mp4> 100 0.75` (810x1440; 0,6667 dá altura não inteira e falha). Antes (1080p, um só processo):
  `nohup npx remotion render <Comp> out/<slug>-sem-audio.mp4 --gl=swangle --concurrency=2 --props='{"audio":""}' --muted &`
  e agendar uma verificação com `send_later` (~90 min).
- Legenda (o usuário quer): camada transparente separada, sem refazer o 3D — composição tipo
  `videos/src/videos/pisa/LegendaPisa.tsx` renderizada com
  `--codec=prores --prores-profile=4444 --pixel-format=yuva444p10le --image-format=png`.
- Som: `python3 -I testes/teste-2/som.py <voz.wav> <legenda.json> <pasta_som>` → trilha e efeitos a −6 dB da
  voz (confere no log), mix a −14 LUFS com limitador −1 dBFS. Ajustar a tabela de efeitos para cada história.
- Final: `bash testes/teste-2/finalizar.sh <video_3d.mp4> <legenda.mov> <mix.wav> <saida.mp4>` (H.264 CRF 17 +
  AAC; acusa quadros congelados/pretos). Assistir uma folha do MP4 final.

## 8. Entrega
- Em `testes/<teste>/postagem/`: MP4, capa (título no centro, dentro do recorte 3:4 do perfil) e legenda do post
  (gancho, 2 linhas, pergunta com emojis para comentar, 3 hashtags). Mandar com `SendUserFile`.
- Commitar e dar push a cada etapa (vídeos .mp4 ficam fora do Git).
