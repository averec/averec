"""Junta o texto do roteiro (falas.json) com os tempos medidos (palavras.json) para a legenda.

A grafia vem sempre do roteiro. Dentro de cada fala, usa os tempos do Whisper quando o número
de palavras bate; senão distribui os tempos pelo tamanho de cada palavra.
Uso: python3 scripts/alinhar.py public/ep01/narracao.wav.falas.json public/ep01/palavras.json public/ep01/legenda.json
"""
import json, sys
falas, medidas = json.load(open(sys.argv[1])), json.load(open(sys.argv[2]))
saida = []
for i, f in enumerate(falas):
    ws = f["texto"].split()
    dentro = [m for m in medidas if f["s"] - 0.15 <= (m["s"] + m["e"]) / 2 <= f["e"] + 0.15]
    if len(dentro) == len(ws):
        tempos = [(m["s"], m["e"]) for m in dentro]
    else:
        total = sum(len(w) + 2 for w in ws); t = f["s"]; tempos = []
        for w in ws:
            d = (f["e"] - f["s"]) * (len(w) + 2) / total; tempos.append((t, t + d)); t += d
    for w, (s, e) in zip(ws, tempos):
        saida.append({"w": w, "s": round(s, 3), "e": round(e, 3), "fala": i, "tag": f["tag"]})
json.dump(saida, open(sys.argv[3], "w"), ensure_ascii=False, indent=0)
print(len(saida), "palavras na legenda")
