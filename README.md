# FileTools

Site estatico com ferramentas online para PDF, imagem, audio de video e QR Code, preparado para deploy no Vercel via GitHub.

## Ferramentas da primeira versao

- Comprimir PDF
- Juntar PDF
- Dividir PDF
- Converter imagem para JPG, PNG e WebP
- Comprimir imagem
- Redimensionar imagem
- Extrair audio de video local
- Gerar QR Code

As ferramentas de imagem rodam com APIs nativas do navegador. PDF usa `pdf-lib` carregado sob demanda por CDN. QR Code usa biblioteca carregada sob demanda por CDN. Extracao de audio usa Web Audio e MediaRecorder quando o navegador suporta o video enviado.

## Estrutura

```text
.
|-- index.html
|-- styles.css
|-- app.js
|-- manifest.webmanifest
|-- sw.js
|-- icon.svg
|-- vercel.json
|-- package.json
```

## Rodar localmente

Abrir `index.html` no navegador ja funciona para a interface. Para testar service worker/PWA, use um servidor local:

```bash
npx serve .
```

## Deploy no Vercel com GitHub

1. Envie este projeto para o repositorio `pasimplicio/filetools`.
2. No Vercel, clique em **Add New Project**.
3. Importe `pasimplicio/filetools`.
4. Use framework preset **Other**.
5. Deixe build command vazio.
6. Deixe output directory vazio ou `.`.
7. Clique em **Deploy**.

## Comandos Git sugeridos

```bash
git init
git remote add origin https://github.com/pasimplicio/filetools.git
git add .
git commit -m "Initial FileTools static site"
git branch -M main
git push -u origin main
```

Se o repositorio ja tiver commits, use `git pull --rebase origin main` antes do push.
