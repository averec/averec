"""Transcreve a narração com tempo por palavra (faster-whisper, local e gratuito).

Uso: python3 -I scripts/transcrever.py public/ep01/narracao.wav public/ep01/palavras.json [--modelo small] [--idioma pt]
"""
import argparse, json, subprocess
import numpy as np
from faster_whisper import WhisperModel

ap = argparse.ArgumentParser()
ap.add_argument("audio"); ap.add_argument("saida")
ap.add_argument("--modelo", default="small"); ap.add_argument("--idioma", default="pt")
a = ap.parse_args()
pcm = subprocess.run(["ffmpeg", "-v", "error", "-i", a.audio, "-ac", "1", "-ar", "16000", "-f", "s16le", "-"],
                     capture_output=True, check=True).stdout
audio = np.frombuffer(pcm, np.int16).astype(np.float32) / 32768
m = WhisperModel(a.modelo, device="cpu", compute_type="int8")
segs, _ = m.transcribe(audio, language=a.idioma, word_timestamps=True)
palavras = [{"w": w.word.strip(), "s": round(w.start, 3), "e": round(w.end, 3)} for s in segs for w in s.words]
json.dump(palavras, open(a.saida, "w"), ensure_ascii=False, indent=0)
print(len(palavras), "palavras;", " ".join(p["w"] for p in palavras))
