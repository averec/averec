"""Gera a locução frase por frase no VoiceStudio (voz clonada da série) e junta com pausas.

Frase por frase evita que o modelo corte o fim de uma frase longa. Cada trecho recebe uma folga de
silêncio no fim e só é aceito se o áudio não terminar "cortado" (energia alta no último instante).
Uso: python3 testes/teste-2/gerar_voz.py <roteiro.md> <pasta_saida>
"""
import subprocess, sys, wave, re, pathlib
import numpy as np

roteiro, saida = sys.argv[1], pathlib.Path(sys.argv[2])
falas = [l.strip() for l in open(roteiro, encoding="utf-8").read().split("## Narração")[1].splitlines() if l.strip()]
ref = "videos/vozes/serie/referencia.wav"
ref_txt = open("videos/vozes/serie/referencia.txt", encoding="utf-8").read().strip()
(saida / "falas").mkdir(parents=True, exist_ok=True)

def ler(p):
    w = wave.open(str(p)); sr = w.getframerate()
    return np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768, sr

partes, sr = [], 24000
for i, frase in enumerate(falas):
    arq = saida / "falas" / f"{i:02d}.wav"
    if not arq.exists():
        r = subprocess.run(["curl", "-s", "-X", "POST", "localhost:3900/generate", "-F", f"text={frase}", "-F", "language=pt",
                            "-F", f"ref_audio=@{ref}", "-F", f"ref_text={ref_txt}", "-F", "seed=7", "-o", str(arq),
                            "-w", "%{http_code}", "--max-time", "1500"], capture_output=True, text=True)
        if r.stdout != "200":
            sys.exit(f"falha na frase {i}: HTTP {r.stdout} {arq.read_text()[:200] if arq.exists() else ''}")
    y, sr = ler(arq)
    # tira só o silêncio do começo e do fim (sem tocar na fala) e confere se terminou em silêncio
    env = np.convolve(np.abs(y), np.ones(240) / 240, "same")
    falando = np.where(env > 0.01)[0]
    ini, fim = max(0, falando[0] - int(0.05 * sr)), min(len(y), falando[-1] + int(0.25 * sr))
    cauda = env[falando[-1]:][:int(0.05 * sr)]
    print(f"{i:02d} {len(y)/sr:5.2f}s  fala {(fim-ini)/sr:5.2f}s  {'OK' if falando[-1] < len(y) - int(0.05*sr) else 'CORTADA?'}  {frase[:50]}", flush=True)
    pausa = 0.45 if frase.endswith((".", "?", "!")) else 0.25
    partes += [y[ini:fim], np.zeros(int(pausa * sr), np.float32)]

total = np.concatenate([np.zeros(int(0.15 * sr), np.float32)] + partes)
with wave.open(str(saida / "locucao.wav"), "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr)
    w.writeframes((np.clip(total, -1, 1) * 32767).astype(np.int16).tobytes())
print(f"locucao.wav: {len(total)/sr:.1f}s")
