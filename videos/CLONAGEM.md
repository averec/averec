# Voz da série

## Hoje
`scripts/narrar.py` usa o **Piper** (`pt_BR-faber-medium`): gratuito, local e rápido. É uma voz
genérica, sem clonagem, e só serve para validar ritmo, cortes e legenda. As tags do roteiro já
controlam velocidade, volume e pausas.

Para baixar a voz: `curl -LO https://huggingface.co/rhasspy/piper-voices/resolve/main/pt/pt_BR/faber/medium/pt_BR-faber-medium.onnx{,.json}`

## Clonagem (próximo passo)
Motor indicado: **Chatterbox Multilingual** (Resemble AI, licença MIT): fala português, clona a
partir de 10–20 s de áudio limpo e tem controle de intensidade emocional (`exaggeration`) e de
ritmo (`cfg_weight`). As tags viram parâmetros por fala:

| tag | exaggeration | cfg_weight | pausa |
| --- | --- | --- | --- |
| sério | 0.45 | 0.5 | 0.25 s |
| irônico | 0.6 | 0.4 | 0.30 s |
| suspense | 0.55 | 0.3 (mais lento) | 0.45 s |
| ênfase | 0.75 | 0.5 | 0.35 s |
| rápido | 0.5 | 0.6 | 0.15 s |
| sussurro | 0.3 | 0.4 + volume 55% | 0.35 s |

Coesão entre falas: mesma amostra de referência e mesma semente em todas as falas,
normalização de volume no final.

**Só clonamos voz com autorização do dono da voz** (a sua, a de um locutor contratado ou uma voz
com licença). A amostra fica em `vozes/<nome>/amostra.wav` e não vai para o Git.
