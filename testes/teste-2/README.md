# Teste 2 — skill "cartoon-audio-short"

Estilo a testar: personagens 2D "cabeça de feijão" (cartões desenhados com contorno ameixa) num
mundo 3D colorido com contorno preto, texturas pintadas, profundidade de campo e câmera
deslizando. 1080×1920, 30 fps, duração exata da locução, voz sem edição, trilha e efeitos
sintetizados a 50% do nível da voz (mix.py), sem legenda.

Status: skill instalada em `.claude/skills/cartoon-audio-short/` a partir do PDF do usuário
(reescrita em português). O `kit/` citado no PDF não veio; no lugar está o código aberto de onde
ele deriva, `mromidev/claude-animated-shorts` (MIT), que faz o visual com three.js no Remotion.
Dependências 3D instaladas em `videos/` (three, @remotion/three, @react-three/fiber,
@react-three/postprocessing, postprocessing).
