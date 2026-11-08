"""Alinha o roteiro a uma locução gravada/gerada fora (sem falas.json): casa as palavras do
roteiro com as palavras medidas pelo Whisper e interpola as que não casam (números, siglas).

Uso: python3 scripts/alinhar_locucao.py roteiros/ep01.md public/ep01/palavras.json src/episodios/ep01/legenda.json
"""
import difflib, json, re, sys, unicodedata

NUM = {"um": "1", "dois": "2", "três": "3", "quinze": "15", "vinte": "20", "cem": "100", "cinquenta": "50",
       "quarenta": "40", "nove": "9", "noventa": "90", "oito": "8", "sete": "7", "mil": "000"}

def norm(w):
    w = unicodedata.normalize("NFKD", w.lower()).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]", "", w)

roteiro, medidas_p, saida = sys.argv[1:4]
script = []  # (palavra exibida, fala, tag)
fala = 0
for linha in open(roteiro, encoding="utf-8"):
    linha = linha.strip()
    if not linha or linha.startswith(("#", "<!--")):
        continue
    m = re.match(r"\[([^\]]+)\]\s*(.*)", linha)
    tag, texto = (m.group(1), m.group(2)) if m else ("sério", linha)
    if tag == "pausa" and not texto:
        continue
    texto = re.sub(r"\{([^|}]*)\|[^}]*\}", r"\1", texto)
    for w in texto.split():
        script.append((w, fala, tag))
    fala += 1

med = json.load(open(medidas_p))
a = [norm(w) for w, _, _ in script]
b = [norm(m["w"]) for m in med]
tempos = [None] * len(script)
for bloco in difflib.SequenceMatcher(None, a, b, autojunk=False).get_matching_blocks():
    for k in range(bloco.size):
        m = med[bloco.b + k]
        tempos[bloco.a + k] = (m["s"], m["e"])

# interpola os buracos entre âncoras, proporcional ao tamanho das palavras
i = 0
fim_total = med[-1]["e"] if med else 0
while i < len(script):
    if tempos[i] is not None:
        i += 1
        continue
    j = i
    while j < len(script) and tempos[j] is None:
        j += 1
    ini = tempos[i - 1][1] if i > 0 else 0.0
    fim = tempos[j][0] if j < len(script) else fim_total
    pesos = [len(script[k][0]) + 2 for k in range(i, j)]
    t = ini
    for k, p in zip(range(i, j), pesos):
        d = (fim - ini) * p / sum(pesos)
        tempos[k] = (t, t + d)
        t += d
    i = j

out = [{"w": w, "s": round(s, 3), "e": round(e, 3), "fala": f, "tag": tg} for (w, f, tg), (s, e) in zip(script, tempos)]
json.dump(out, open(saida, "w"), ensure_ascii=False, indent=0)
casadas = sum(1 for x in a if x in set(b))
print(f"{len(out)} palavras na legenda; fim {out[-1]['e']:.1f}s")
