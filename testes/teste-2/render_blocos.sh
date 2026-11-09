#!/usr/bin/env bash
# Renderiza uma composição em blocos (pula os blocos já prontos) e junta no fim; sobrevive a reinícios do container.
# Uso: bash testes/teste-2/render_blocos.sh <Composicao> <total_quadros> <pasta_blocos> <saida.mp4> [tamanho_bloco] [escala]
# escala 0.6667 = 720x1280 (cerca de 2x mais rápido; o finalizar.sh amplia para 1080x1920)
set -uo pipefail
C="$1"; T="$2"; D="$3"; OUT="$4"; B="${5:-100}"; E="${6:-1}"
mkdir -p "$D"; cd /home/user/averec/videos
for ((a=0; a<T; a+=B)); do
  b=$((a+B-1)); [ $b -ge $T ] && b=$((T-1))
  f="$D/bloco_$(printf %05d $a).mp4"
  [ -s "$f" ] && continue
  echo "bloco $a-$b"
  npx remotion render "$C" "$f.tmp.mp4" --frames=$a-$b --scale=$E --gl=swangle --concurrency=2 --props='{"audio":""}' --muted >/dev/null 2>&1 && mv "$f.tmp.mp4" "$f" || { echo "falhou $a-$b"; exit 1; }
done
ls "$D"/bloco_*.mp4 | sed "s/^/file '/; s/$/'/" > "$D/lista.txt"
ffmpeg -v error -y -f concat -safe 0 -i "$D/lista.txt" -c copy "$OUT" && echo "pronto: $OUT"
