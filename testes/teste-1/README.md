# Teste 1 — personagem do usuário + cenários desenhados + placar

Estado congelado no commit `90b5034` (branch `claude/install-hypit-skill-vkepss`).
Para voltar exatamente a este estado: `git checkout 90b5034 -- videos`.

## Estilo
- Personagem: arte do usuário (`videos/public/personagem/`), expressões do gabarito, animação de
  quique/pulinhos/inclinação/tremor, sem boca.
- Cenários: ilustração do usuário (parede) + cenários desenhados em código (banco, rua,
  escritório, escritório do chefão) com contorno grosso e cores chapadas.
- Estrutura: gancho em 2ª pessoa, título grande no 1º segundo, placar no topo, cartões claros e
  escuros, legenda palavra a palavra, escolha binária por emoji no fim.
- Voz: locução do usuário (ep. 01) e voz clonada no VoiceStudio/OmniVoice (chefão), acelerada para 1,25x.

## Vídeos
| Vídeo | Duração | Composição Remotion | Resultado |
| --- | --- | --- | --- |
| Ep. 01 — A parede (original) | 88 s | `Ep01` | 148 visualizações em 2 h, 29 s de média (33%), 6 curtidas, 0 comentários |
| Ep. 01 — versão curta 1,25x | 56 s | `Ep01Curto` + `CapaEp01` | 1.218 visualizações em 15 h, 22 s de média (39%), 47 curtidas, 2 comentários, 1 seguidor |
| E se fosse você? — O chefão | 35 s | `Ep02` + `CapaEp02` | ainda não postado |

## Arquivos de postagem
`postagem/`: capas e legendas (os .mp4 ficam fora do Git; exporte de novo com
`npx remotion render <Composição> out/<arquivo>.mp4` dentro de `videos/`).

## Aprendizados
- Vídeo curto (≤ 60 s) e gancho visual no 1º segundo multiplicaram o alcance.
- Retenção ainda abaixo de 50%; ninguém compartilhou ou salvou.
- Capa precisa do título no centro (recorte 3:4 da grade do perfil).

## Roteiros prontos para o próximo
- `videos/roteiros/ep03-amazonia.md` — Sozinho na Amazônia com 5% de bateria (não produzido).
