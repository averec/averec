#!/usr/bin/env bash
# Junta o render 3D + camada de legenda + mix de áudio num MP4 final (H.264 CRF 17 + AAC) e faz a checagem.
# Uso: bash testes/teste-2/finalizar.sh <video_3d.mp4> <legenda.mov|-> <mix.wav> <saida.mp4>
set -euo pipefail
V="$1"; LEG="$2"; A="$3"; OUT="$4"
if [ "$LEG" != "-" ]; then
  ffmpeg -v error -y -i "$V" -i "$LEG" -i "$A" -filter_complex "[0:v]scale=1080:1920:flags=lanczos[b];[b][1:v]overlay=0:0:format=auto,format=yuv420p[v]" \
    -map "[v]" -map 2:a -c:v libx264 -crf 17 -preset medium -c:a aac -b:a 192k -shortest -movflags +faststart "$OUT"
else
  ffmpeg -v error -y -i "$V" -i "$A" -map 0:v -map 1:a -vf scale=1080:1920:flags=lanczos -c:v libx264 -crf 17 -preset medium -pix_fmt yuv420p -c:a aac -b:a 192k -shortest -movflags +faststart "$OUT"
fi
echo "== quadros congelados (>= 0,4 s) e pretos:"
ffmpeg -v info -i "$OUT" -vf "freezedetect=n=0.001:d=0.4,blackdetect=d=0.1" -an -f null - 2>&1 | grep -E "freeze_start|black_start" || echo "nenhum"
ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT"
