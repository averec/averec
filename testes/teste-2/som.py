"""Trilha e efeitos sintetizados para a Torre de Pisa + mixagem com a voz (skill cartoon-2d).

- Trilha: marchinha medieval em loop (bumbo/caixa, baixo dedilhado, metais suaves); para na frase da virada
  ("reta.") e segue só um zumbido grave até o fim.
- Efeitos: deslizes nas trocas de plano grandes, baque da pedra afundando, rangido da torre, martelo, "ting" na
  revelação, vento no pulo de tempo, impacto grave na virada.
- Mix: trilha a exatamente −6 dB do RMS com gate da voz; efeitos no máximo −6 dB, com picos limitados a 0,7× o
  pico da voz. Depois só um ganho linear até ~−14 LUFS e um limitador de −1 dBFS na mixagem inteira.
  A voz não é editada nem re-temporizada.

Uso: python3 -I testes/teste-2/som.py <voz.wav> <legenda.json> <saida_dir>
"""
import json, subprocess, sys, wave, pathlib
import numpy as np

SR = 48000
voz_p, leg_p, out = sys.argv[1], sys.argv[2], pathlib.Path(sys.argv[3])
out.mkdir(parents=True, exist_ok=True)

def ler(p):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", p, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).copy()

def gravar(p, y):
    with wave.open(str(p), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(y, -1, 1) * 32767).astype(np.int16).tobytes())

voz = ler(voz_p)
N = len(voz) + int(0.9 * SR)
L = json.load(open(leg_p))
ini = lambda n: next(p["s"] for p in L if p["fala"] == n)
pal = lambda w, k=1: [p["s"] for p in L if p["w"].lower().strip(".,:;?!") == w][k - 1]
t = np.arange(N) / SR
rng = np.random.default_rng(7)

def env(n, a=0.005, d=0.3):
    x = np.arange(n) / SR
    return np.minimum(1, x / a) * np.exp(-x / d)

def poe(buf, y, at):
    i = int(at * SR)
    if i >= len(buf): return
    y = y[: len(buf) - i]; buf[i:i + len(y)] += y

# ---------------- trilha ----------------
musica = np.zeros(N, np.float32)
bpm = 112; beat = 60 / bpm
fim_musica = pal("reta")  # a música para na virada
notas = [0, 0, 7, 5, 3, 3, 5, 7]  # baixo em ré menor (semitons sobre ré)
nota = lambda st, oit=0: 146.83 * 2 ** (st / 12 + oit)
k = 0
while k * beat < fim_musica:
    at = k * beat
    # bumbo nos tempos 1 e 3, caixa nos 2 e 4
    n = int(0.25 * SR); x = np.arange(n) / SR
    if k % 2 == 0: poe(musica, 0.9 * np.sin(2 * np.pi * (55 + 90 * np.exp(-x * 30)) * x) * env(n, 0.002, 0.12), at)
    else: poe(musica, 0.35 * rng.standard_normal(n) * env(n, 0.001, 0.06), at)
    # baixo dedilhado
    f0 = nota(notas[k % 8], -1); n = int(beat * SR); x = np.arange(n) / SR
    poe(musica, 0.45 * (np.sign(np.sin(2 * np.pi * f0 * x)) * 0.3 + np.sin(2 * np.pi * f0 * x)) * env(n, 0.004, 0.18), at)
    # metais suaves a cada compasso (acorde)
    if k % 4 == 0:
        n = int(4 * beat * SR); x = np.arange(n) / SR
        acorde = sum(np.sin(2 * np.pi * nota(s) * x) + 0.3 * np.sin(4 * np.pi * nota(s) * x) for s in (0, 3, 7))
        poe(musica, 0.12 * acorde * np.minimum(1, x / 0.15) * np.exp(-x / 2.5), at)
    k += 1
# zumbido grave depois da virada
n = N - int(fim_musica * SR); x = np.arange(n) / SR
poe(musica, 0.25 * np.sin(2 * np.pi * 73.4 * x) * np.minimum(1, x / 0.4) * np.minimum(1, (x[::-1]) / 0.6), fim_musica)
fade = np.ones(N); i0 = int((fim_musica - 0.08) * SR); fade[i0:int(fim_musica * SR)] = np.linspace(1, 0, int(fim_musica * SR) - i0)
musica[: int(fim_musica * SR)] *= fade[: int(fim_musica * SR)]

# ---------------- efeitos ----------------
sfx = np.zeros(N, np.float32)
def whoosh(dur=0.5, g=0.5):
    n = int(dur * SR); x = np.arange(n) / SR; ruido = rng.standard_normal(n)
    # passa-faixa simples variando no tempo (média móvel com janela que encolhe)
    y = np.convolve(ruido, np.ones(12) / 12, "same") - np.convolve(ruido, np.ones(60) / 60, "same")
    return g * y * np.sin(np.pi * x / dur) ** 2
def thunk(g=0.8):
    n = int(0.35 * SR); x = np.arange(n) / SR
    return g * np.sin(2 * np.pi * (70 + 60 * np.exp(-x * 25)) * x) * env(n, 0.002, 0.1)
def creak(dur=0.9, g=0.35):
    n = int(dur * SR); x = np.arange(n) / SR
    f = 180 + 40 * np.sin(2 * np.pi * 3 * x)
    return g * np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * (0.5 + 0.5 * np.sin(2 * np.pi * 23 * x)) * np.sin(np.pi * x / dur)
def ting(g=0.4):
    n = int(1.2 * SR); x = np.arange(n) / SR
    return g * (np.sin(2 * np.pi * 1760 * x) + 0.4 * np.sin(2 * np.pi * 2640 * x)) * env(n, 0.001, 0.35)
def clink(g=0.35):
    n = int(0.25 * SR); x = np.arange(n) / SR
    return g * (np.sin(2 * np.pi * 2200 * x) + rng.standard_normal(n) * 0.3) * env(n, 0.0005, 0.04)
def boom(g=0.9):
    n = int(1.5 * SR); x = np.arange(n) / SR
    return g * np.sin(2 * np.pi * (45 + 30 * np.exp(-x * 8)) * x) * env(n, 0.003, 0.5)

for n_fala in (1, 4, 6, 7, 9, 11):  # trocas de plano com movimento grande
    poe(sfx, whoosh(0.55, 0.45), max(0, ini(n_fala) - 0.3))
poe(sfx, thunk(0.9), pal("lama") - 0.05)            # a pedra afunda
poe(sfx, creak(1.0, 0.3), pal("pendia") - 0.1)      # a torre range ao entortar
poe(sfx, clink(0.4), pal("pendia") + 0.25)          # o martelo cai
poe(sfx, whoosh(0.9, 0.5), ini(5) - 0.45)           # flash do pulo de tempo
for k2 in range(6):                                 # engenheiros cavando
    poe(sfx, clink(0.25), ini(9) + 0.4 + k2 * 0.55)
poe(sfx, ting(0.35), pal("terminar") - 0.05)        # torre pronta (revelação)
poe(sfx, creak(0.8, 0.25), pal("cair") - 0.1)       # 1990: perto de cair
poe(sfx, boom(1.0), pal("reta") - 0.03)             # virada

gravar(out / "musica.wav", musica); gravar(out / "sfx.wav", sfx)

# ---------------- mixagem (níveis travados) ----------------
def rms_gate(y, gate_db=-40):
    bloco = int(0.4 * SR); r = [np.sqrt(np.mean(y[i:i + bloco] ** 2)) for i in range(0, len(y) - bloco, bloco // 4)]
    r = np.array(r); lim = 10 ** (gate_db / 20) * max(r.max(), 1e-9)
    v = r[r > lim]; return float(np.sqrt(np.mean(v ** 2))) if len(v) else 1e-9

voz_pad = np.concatenate([voz, np.zeros(N - len(voz), np.float32)])
rv = rms_gate(voz_pad); pv = float(np.abs(voz_pad).max())
musica *= (rv * 0.5) / rms_gate(musica)
sfx *= min((rv * 0.5) / rms_gate(sfx), (0.7 * pv) / max(np.abs(sfx).max(), 1e-9))
db = lambda a, b: 20 * np.log10(a / b)
print(f"trilha vs voz: {db(rms_gate(musica), rv):+.1f} dB | efeitos vs voz: {db(rms_gate(sfx), rv):+.1f} dB | pico efeitos/pico voz: {np.abs(sfx).max()/pv:.2f}")
mix = voz_pad + musica + sfx
gravar(out / "mix_bruto.wav", mix / max(1.0, np.abs(mix).max()))
# ganho linear até ~−14 LUFS + limitador −1 dBFS (um único estágio na mixagem inteira)
medida = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", str(out / "mix_bruto.wav"), "-af", "ebur128", "-f", "null", "-"], capture_output=True, text=True).stderr
lufs = float([l for l in medida.splitlines() if l.strip().startswith("I:")][-1].split()[1])
ganho = -14 - lufs
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(out / "mix_bruto.wav"), "-af", f"volume={ganho:.2f}dB,alimiter=limit=0.891:level=false", "-ar", str(SR), str(out / "mix.wav")], check=True)
print(f"loudness bruto {lufs:.1f} LUFS, ganho {ganho:+.1f} dB -> mix.wav")
