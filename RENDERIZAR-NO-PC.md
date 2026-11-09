# Renderizar os vídeos no seu computador

Muito mais rápido que na nuvem (com placa de vídeo, minutos em vez de horas). O resultado já sai com
**legenda e som**, pronto para postar.

## 1. Instale uma vez
- **Node.js 22 ou mais novo**: https://nodejs.org (versão LTS)
- **Git**: https://git-scm.com

## 2. Baixe o projeto (uma vez)
Abra o Terminal (Mac) ou o PowerShell (Windows) e rode:
```
git clone https://github.com/averec/averec.git
cd averec
git checkout claude/install-hypit-skill-vkepss
cd videos
npm install
```
Nas próximas vezes basta atualizar: `cd averec`, `git pull`, `cd videos`, `npm install`.

## 3. Renderize a Torre de Pisa
Dentro da pasta `videos`:
```
npx remotion render PisaFinal out/torre-de-pisa.mp4 --gl=angle
```
O vídeo fica em `videos/out/torre-de-pisa.mp4` (1080×1920, com legenda e som).

Se der erro de WebGL, troque `--gl=angle` por `--gl=vulkan` (Windows/Linux) ou remova o `--gl` (Mac).

## 4. Ver antes de renderizar (opcional)
```
npx remotion studio
```
Abre o editor no navegador; escolha `PisaFinal` na lista para assistir e conferir.
