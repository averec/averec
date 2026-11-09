"""Gera a narração de um roteiro com tags de entonação usando Piper (TTS local e gratuito).

Uso: python3 scripts/narrar.py roteiros/ep01.md public/ep01/narracao.wav  (voz: scripts/baixar_voz.sh)

Cada linha "[tag] texto" vira uma fala; a tag ajusta ritmo, volume e pausa depois da fala.
"{exibido|falado}" separa o texto da legenda da pronúncia (ex.: {COAF|Coáfi}).
Também grava <saida>.falas.json com o início/fim de cada fala, usado para alinhar a legenda.
Quando houver um motor de clonagem (ver CLONAGEM.md), ele recebe as mesmas tags.
"""
import argparse, json, re, wave
import numpy as np
from piper import PiperVoice, SynthesisConfig

# tag -> (length_scale, volume, pausa_depois_s)
TAGS = {
    "sério":    (1.00, 1.0, 0.25),
    "irônico":  (1.06, 1.0, 0.30),
    "suspense": (1.15, 0.9, 0.45),
    "ênfase":   (1.10, 1.0, 0.35),
    "rápido":   (0.88, 1.0, 0.15),
    "sussurro": (1.08, 0.55, 0.35),
}
PAUSA = 0.45

def falas(caminho):
    texto = re.sub(r"<!--.*?-->", "", open(caminho, encoding="utf-8").read(), flags=re.S)
    for linha in texto.splitlines():
        linha = linha.strip()
        if not linha or linha.startswith(("#", "<!--")):
            continue
        m = re.match(r"\[([^\]]+)\]\s*(.*)", linha)
        tag, texto = (m.group(1), m.group(2)) if m else ("sério", linha)
        yield tag, texto

def exibido(t): return re.sub(r"\{([^|}]*)\|[^}]*\}", r"\1", t)
def falado(t): return re.sub(r"\{[^|}]*\|([^}]*)\}", r"\1", t)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("roteiro"); ap.add_argument("saida"); ap.add_argument("--modelo", default="vozes/pt_BR-cadu-medium.onnx")
    # A voz "cadu" fala devagar; 0,64 deixa o ritmo perto de 3 palavras/s, como a referência.
    ap.add_argument("--velocidade", type=float, default=0.64, help="multiplica a duração das falas")
    a = ap.parse_args()
    voz = PiperVoice.load(a.modelo)
    sr = voz.config.sample_rate
    partes, info, t = [], [], 0.0
    for tag, texto in falas(a.roteiro):
        if tag == "pausa" and not texto:
            partes.append(np.zeros(int(sr * PAUSA), np.float32)); t += PAUSA; continue
        ls, vol, pausa = TAGS.get(tag, TAGS["sério"])
        cfg = SynthesisConfig(length_scale=ls * a.velocidade, volume=vol, noise_scale=0.75, noise_w_scale=0.9)
        audio = np.concatenate([c.audio_float_array for c in voz.synthesize(falado(texto), syn_config=cfg)])
        partes += [audio, np.zeros(int(sr * pausa), np.float32)]
        dur = len(audio) / sr
        info.append({"tag": tag, "texto": exibido(texto), "s": round(t, 3), "e": round(t + dur, 3)})
        t += dur + int(sr * pausa) / sr
    y = np.concatenate(partes)
    y = y / max(1e-6, np.abs(y).max()) * 0.9
    with wave.open(a.saida, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr)
        w.writeframes((y * 32767).astype(np.int16).tobytes())
    json.dump(info, open(a.saida + ".falas.json", "w"), ensure_ascii=False, indent=0)
    print(f"{a.saida}: {len(y)/sr:.1f}s, {len(info)} falas")

if __name__ == "__main__":
    main()
