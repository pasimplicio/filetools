# FileTools

Interface web da Suite de Midia baseada no sistema origem em `C:\midias_suite`.

## Funcoes mantidas

- Extrair Frames
- Downloader
- Transcricao
- Separar Voz
- Configuracoes

O sistema origem e um app desktop Python/Tkinter. Ele usa dependencias locais como OpenCV, yt-dlp, FFmpeg, Whisper, Spleeter e spotdl. Nesta versao web estatica, a extracao de frames de video local roda no navegador. As demais telas preservam o fluxo e as opcoes da origem, mas precisam de backend para executar o processamento real.

## Estrutura

```text
.
|-- index.html
|-- styles.css
|-- app.js
|-- server.js
|-- manifest.webmanifest
|-- sw.js
|-- icon.svg
|-- vercel.json
|-- package.json
```

## Rodar localmente

```bash
npm run dev
```

URL padrao:

```text
http://localhost:5173/
```

## Validar

```bash
npm run check
```
