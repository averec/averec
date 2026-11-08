#!/usr/bin/env bash
# Baixa a voz da série (Piper pt_BR "cadu": masculina, grave, ~128 Hz como o narrador de referência).
set -euo pipefail
mkdir -p vozes
for f in pt_BR-cadu-medium.onnx pt_BR-cadu-medium.onnx.json; do
  [ -f "vozes/$f" ] || curl -sSfLo "vozes/$f" "https://huggingface.co/rhasspy/piper-voices/resolve/main/pt/pt_BR/cadu/medium/$f"
done
echo "vozes/pt_BR-cadu-medium.onnx"
