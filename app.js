const icons = {
  frames: "FR",
  download: "DL",
  transcript: "TR",
  voice: "VZ",
  config: "CF",
  pdf: "PD",
};

const cdn = {
  pdfLib: "https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js",
};

const toolData = [
  {
    id: "frames",
    title: "Extrair Frames",
    icon: icons.frames,
    badge: "Executa no navegador",
    available: true,
    description: "Seleciona um video local e exporta imagens JPG a partir dos quadros.",
    reference: [
      "Selecionar video local.",
      "Alterar diretorio de saida no sistema desktop.",
      "Extrair frames como frame_00000.jpg, frame_00001.jpg e seguintes.",
    ],
  },
  {
    id: "download",
    title: "Downloader",
    icon: icons.download,
    badge: "Backend necessario",
    available: false,
    description: "Baixa videos de YouTube, Instagram e Facebook, ou converte video local para MP3.",
    reference: [
      "Detecta plataforma pelo link.",
      "Escolhe formato MP4 ou MP3.",
      "Atualiza resolucoes do YouTube.",
      "Converte video local para MP3 com FFmpeg.",
    ],
  },
  {
    id: "transcript",
    title: "Transcricao",
    icon: icons.transcript,
    badge: "Backend necessario",
    available: false,
    description: "Extrai audio de midias e transcreve com Whisper, salvando TXT e JSON.",
    reference: [
      "Seleciona pasta ou arquivos de audio/video.",
      "Modelos Whisper: tiny, base, small, medium, large-v2, large-v3.",
      "Idioma vazio ativa deteccao automatica.",
      "Exporta transcricao em .txt e segmentos em .json.",
    ],
  },
  {
    id: "voice",
    title: "Separar Voz",
    icon: icons.voice,
    badge: "Backend necessario",
    available: false,
    description: "Separa voz e melodia com Spleeter e exporta MP3.",
    reference: [
      "Importa audio local.",
      "Baixa audio do YouTube ou Spotify.",
      "Executa Spleeter em 2 stems.",
      "Gera arquivos *_voz.mp3 e *_melodia.mp3.",
    ],
  },
  {
    id: "pdf",
    title: "Editar PDF",
    icon: icons.pdf,
    badge: "Executa no navegador",
    available: true,
    description: "Edita os dados (metadados) de um PDF: titulo, autor, assunto, palavras-chave, datas e idioma.",
    reference: [
      "Selecionar um PDF local.",
      "Ler os metadados atuais do documento.",
      "Editar titulo, autor, assunto, palavras-chave, criador, produtor, idioma e datas.",
      "Opcao de limpar todos os metadados.",
      "Baixar a nova copia do PDF.",
    ],
  },
  {
    id: "config",
    title: "Configuracoes",
    icon: icons.config,
    badge: "Config local",
    available: true,
    description: "Guarda preferencias equivalentes ao sistema origem neste navegador.",
    reference: [
      "Caminho do FFmpeg.",
      "Pastas padrao de downloads, frames e transcricoes.",
      "Modelo e idioma do Whisper.",
      "Ativar ou desativar logs.",
    ],
  },
];

const state = {
  activeTool: "frames",
  history: JSON.parse(localStorage.getItem("filetools-media-history") || "[]"),
  settings: JSON.parse(localStorage.getItem("filetools-media-settings") || "{}"),
  frameResults: [],
};

const els = {
  nav: document.querySelector("#toolNav"),
  title: document.querySelector("#viewTitle"),
  badge: document.querySelector("#capabilityBadge"),
  icon: document.querySelector("#toolIcon"),
  name: document.querySelector("#toolName"),
  description: document.querySelector("#toolDescription"),
  form: document.querySelector("#toolForm"),
  reference: document.querySelector("#referenceList"),
  history: document.querySelector("#historyList"),
  result: document.querySelector("#resultBox"),
  progressWrap: document.querySelector("#progressWrap"),
  progressLabel: document.querySelector("#progressLabel"),
  progressValue: document.querySelector("#progressValue"),
  progressBar: document.querySelector("#progressBar"),
  themeToggle: document.querySelector("#themeToggle"),
  themeLabel: document.querySelector("#themeLabel"),
};

function getTool(id = state.activeTool) {
  return toolData.find((tool) => tool.id === id) || toolData[0];
}

function saveHistory(item) {
  state.history = [item, ...state.history].slice(0, 6);
  localStorage.setItem("filetools-media-history", JSON.stringify(state.history));
  renderHistory();
}

function saveSettings() {
  localStorage.setItem("filetools-media-settings", JSON.stringify(state.settings));
}

function renderNav() {
  els.nav.innerHTML = toolData
    .map(
      (tool) => `
        <button class="nav-button ${tool.id === state.activeTool ? "active" : ""}" type="button" data-tool="${tool.id}">
          <span>${tool.title}</span>
          <small>${tool.icon}</small>
        </button>
      `
    )
    .join("");

  els.nav.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeTool = button.dataset.tool;
      render();
    });
  });
}

function renderHistory() {
  if (!state.history.length) {
    els.history.innerHTML = '<p class="muted">Nenhuma execucao registrada.</p>';
    return;
  }

  els.history.innerHTML = state.history
    .map(
      (item) => `
        <div class="history-item">
          <strong>${item.title}</strong>
          <small>${item.detail}</small>
          <small>${new Date(item.date).toLocaleString("pt-BR")}</small>
        </div>
      `
    )
    .join("");
}

function setProgress(percent, label = "Processando...") {
  const value = Math.max(0, Math.min(100, Math.round(percent)));
  els.progressWrap.hidden = false;
  els.progressLabel.textContent = label;
  els.progressValue.textContent = `${value}%`;
  els.progressBar.style.width = `${value}%`;
}

function resetProgress() {
  els.progressWrap.hidden = true;
  els.progressBar.style.width = "0";
  els.progressValue.textContent = "0%";
}

function showResult(html) {
  els.result.hidden = false;
  els.result.innerHTML = html;
}

function clearResult() {
  els.result.hidden = true;
  els.result.innerHTML = "";
}

function render() {
  const tool = getTool();
  renderNav();

  els.title.textContent = tool.title;
  els.badge.textContent = tool.badge;
  els.badge.className = `status-badge ${tool.available ? "available" : "backend"}`;
  els.icon.textContent = tool.icon;
  els.name.textContent = tool.title;
  els.description.textContent = tool.description;
  els.reference.innerHTML = tool.reference.map((item) => `<li><span>${item}</span></li>`).join("");

  clearResult();
  resetProgress();

  const freshForm = els.form.cloneNode(false);
  els.form.replaceWith(freshForm);
  els.form = freshForm;

  if (tool.id === "frames") renderFramesForm();
  if (tool.id === "download") renderDownloadForm();
  if (tool.id === "transcript") renderTranscriptForm();
  if (tool.id === "voice") renderVoiceForm();
  if (tool.id === "pdf") renderPdfForm();
  if (tool.id === "config") renderConfigForm();

  renderHistory();
}

function fileDrop(name, accept, multiple = false, label = "Clique ou arraste arquivos") {
  return `
    <label class="file-drop">
      <input id="${name}" name="${name}" type="file" accept="${accept}" ${multiple ? "multiple" : ""}>
      <span class="drop-copy">
        <strong>${label}</strong>
        <span>Os arquivos permanecem no seu dispositivo.</span>
      </span>
    </label>
    <div id="${name}List"></div>
  `;
}

function bindFileList(inputId) {
  const input = document.querySelector(`#${inputId}`);
  const list = document.querySelector(`#${inputId}List`);
  if (!input || !list) return;

  input.addEventListener("change", () => {
    const files = Array.from(input.files || []);
    list.innerHTML = files
      .map((file) => `<div class="file-line"><span>${file.name}</span><small>${formatBytes(file.size)}</small></div>`)
      .join("");
  });
}

function formatBytes(bytes) {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** index).toFixed(index ? 1 : 0)} ${units[index]}`;
}

function renderFramesForm() {
  els.form.innerHTML = `
    ${fileDrop("videoFile", "video/mp4,video/webm,video/quicktime,video/x-matroska,video/avi", false, "Selecionar video")}
    <div class="form-grid">
      <div class="field">
        <label for="frameStep">Intervalo entre capturas</label>
        <select id="frameStep" name="frameStep">
          <option value="1">A cada 1 segundo</option>
          <option value="2" selected>A cada 2 segundos</option>
          <option value="5">A cada 5 segundos</option>
          <option value="0">Somente primeiro frame</option>
        </select>
        <small>No desktop a origem extrai todos os frames; no navegador o intervalo evita travar arquivos grandes.</small>
      </div>
      <div class="field">
        <label for="frameLimit">Limite de imagens</label>
        <input id="frameLimit" name="frameLimit" type="number" min="1" max="120" value="24">
      </div>
      <div class="field">
        <label for="jpgQuality">Qualidade JPG</label>
        <input id="jpgQuality" name="jpgQuality" type="number" min="40" max="100" value="90">
      </div>
      <div class="field">
        <label for="namePrefix">Prefixo</label>
        <input id="namePrefix" name="namePrefix" value="frame">
      </div>
    </div>
    <div class="action-row">
      <button class="button" type="button" id="clearFrames">Limpar</button>
      <button class="button primary" type="submit">Extrair frames</button>
    </div>
  `;

  bindFileList("videoFile");
  document.querySelector("#clearFrames").addEventListener("click", () => renderFramesForm());
  els.form.addEventListener("submit", handleFramesSubmit, { once: true });
}

async function handleFramesSubmit(event) {
  event.preventDefault();
  const file = document.querySelector("#videoFile").files[0];
  if (!file) {
    showResult('<p class="notice"><strong>Selecione um video.</strong>Escolha um arquivo local antes de iniciar.</p>');
    renderFramesForm();
    return;
  }

  try {
    const step = Number(document.querySelector("#frameStep").value);
    const limit = Number(document.querySelector("#frameLimit").value || 24);
    const quality = Number(document.querySelector("#jpgQuality").value || 90) / 100;
    const prefix = sanitizeName(document.querySelector("#namePrefix").value || "frame");
    const frames = await extractFrames(file, { step, limit, quality, prefix });

    state.frameResults = frames;
    const cards = frames
      .map(
        (frame) => `
          <div class="preview-card">
            <img src="${frame.url}" alt="${frame.name}">
            <a href="${frame.url}" download="${frame.name}">Baixar ${frame.name}</a>
          </div>
        `
      )
      .join("");

    showResult(`
      <strong>${frames.length} frame(s) extraido(s).</strong>
      <div class="result-actions">
        <button class="button primary" type="button" id="downloadAllFrames">Baixar todos</button>
      </div>
      <div class="preview-grid">${cards}</div>
    `);

    document.querySelector("#downloadAllFrames").addEventListener("click", () => {
      state.frameResults.forEach((frame, index) => {
        setTimeout(() => downloadUrl(frame.url, frame.name), index * 120);
      });
    });

    saveHistory({
      title: "Extrair Frames",
      detail: `${frames.length} frame(s) de ${file.name}`,
      date: Date.now(),
    });
  } catch (error) {
    showResult(`<p class="notice"><strong>Falha ao extrair frames.</strong>${error.message}</p>`);
  } finally {
    resetProgress();
    renderFramesForm();
  }
}

function extractFrames(file, options) {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const sourceUrl = URL.createObjectURL(file);
    const frames = [];

    video.preload = "metadata";
    video.muted = true;
    video.playsInline = true;
    video.src = sourceUrl;

    const cleanup = () => URL.revokeObjectURL(sourceUrl);

    video.onerror = () => {
      cleanup();
      reject(new Error("O navegador nao conseguiu abrir este formato de video."));
    };

    video.onloadedmetadata = async () => {
      try {
        const duration = Number.isFinite(video.duration) ? video.duration : 0;
        const step = options.step > 0 ? options.step : Math.max(duration || 1, 1);
        const times = [];

        if (duration <= 0) {
          times.push(0);
        } else {
          for (let time = 0; time <= duration && times.length < options.limit; time += step) {
            times.push(Math.min(time, Math.max(duration - 0.05, 0)));
          }
        }

        canvas.width = video.videoWidth || 1280;
        canvas.height = video.videoHeight || 720;

        for (let index = 0; index < times.length; index += 1) {
          await seekVideo(video, times[index]);
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          const blob = await canvasToBlob(canvas, "image/jpeg", options.quality);
          const name = `${options.prefix}_${String(index).padStart(5, "0")}.jpg`;
          frames.push({ name, url: URL.createObjectURL(blob), time: times[index] });
          setProgress(((index + 1) / times.length) * 100, `Extraindo frame ${index + 1} / ${times.length}`);
        }

        cleanup();
        resolve(frames);
      } catch (error) {
        cleanup();
        reject(error);
      }
    };
  });
}

function seekVideo(video, time) {
  return new Promise((resolve, reject) => {
    const onSeeked = () => {
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("error", onError);
      resolve();
    };
    const onError = () => {
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("error", onError);
      reject(new Error("Nao foi possivel ler o frame do video."));
    };
    video.addEventListener("seeked", onSeeked);
    video.addEventListener("error", onError);
    video.currentTime = Math.max(0, time);
  });
}

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Falha ao gerar imagem."))), type, quality);
  });
}

function sanitizeName(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9_-]+/gi, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 60) || "frame";
}

function downloadUrl(url, filename) {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
}

function renderDownloadForm() {
  els.form.innerHTML = `
    <div class="notice">
      <strong>Requer backend.</strong>
      Esta funcao na origem usa yt-dlp e FFmpeg. O navegador estatico nao pode baixar midias de plataformas ou converter para MP3 sozinho.
    </div>
    <div class="field">
      <label for="mediaUrl">Link do video</label>
      <input id="mediaUrl" type="url" placeholder="YouTube, Instagram ou Facebook">
    </div>
    <div class="form-grid">
      <div class="field">
        <label for="downloadFormat">Formato</label>
        <select id="downloadFormat">
          <option>MP4</option>
          <option>MP3</option>
        </select>
      </div>
      <div class="field">
        <label for="resolution">Resolucao</label>
        <select id="resolution">
          <option>Melhor disponivel</option>
          <option>1080p</option>
          <option>720p</option>
          <option>480p</option>
        </select>
      </div>
    </div>
    ${fileDrop("localVideo", "video/mp4,video/webm,video/quicktime,video/x-matroska,video/avi", false, "Converter video local para MP3")}
    <div class="action-row">
      <button class="button primary" type="submit">Preparar solicitacao</button>
    </div>
  `;
  bindFileList("localVideo");
  els.form.addEventListener("submit", (event) => {
    event.preventDefault();
    const url = document.querySelector("#mediaUrl").value.trim();
    const platform = detectPlatform(url);
    showResult(`<strong>Fluxo reconhecido.</strong><p class="muted">Plataforma: ${platform}. Para executar, conecte uma API com yt-dlp e FFmpeg.</p>`);
  });
}

function detectPlatform(url) {
  const value = url.toLowerCase();
  if (value.includes("youtube.com") || value.includes("youtu.be")) return "YouTube";
  if (value.includes("instagram.com")) return "Instagram";
  if (value.includes("facebook.com") || value.includes("fb.watch")) return "Facebook";
  return "Desconhecida";
}

function renderTranscriptForm() {
  els.form.innerHTML = `
    <div class="notice">
      <strong>Requer backend.</strong>
      A origem usa FFmpeg e Whisper local. Esta tela mantem as mesmas entradas para uma futura API.
    </div>
    ${fileDrop("transcriptFiles", ".mp3,.wav,.m4a,.ogg,.opus,.aac,.flac,.amr,.wma,.3gp,.mp4,.mkv,.avi,.mov,.flv,.webm,.wmv,.m4v,.ts,.mpeg,.mpg", true, "Selecionar arquivos de audio ou video")}
    <div class="form-grid">
      <div class="field">
        <label for="whisperModel">Modelo Whisper</label>
        <select id="whisperModel">
          <option>tiny</option>
          <option selected>base</option>
          <option>small</option>
          <option>medium</option>
          <option>large-v2</option>
          <option>large-v3</option>
        </select>
      </div>
      <div class="field">
        <label for="language">Idioma</label>
        <input id="language" placeholder="vazio = auto">
      </div>
    </div>
    <div class="field">
      <label for="transcriptOutput">Transcricao</label>
      <textarea id="transcriptOutput" placeholder="O texto transcrito aparecera aqui quando houver backend conectado." readonly></textarea>
    </div>
    <div class="action-row">
      <button class="button primary" type="submit">Preparar transcricao</button>
    </div>
  `;
  bindFileList("transcriptFiles");
  els.form.addEventListener("submit", (event) => {
    event.preventDefault();
    const files = document.querySelector("#transcriptFiles").files.length;
    showResult(`<strong>${files} arquivo(s) selecionado(s).</strong><p class="muted">Saidas esperadas na origem: .wav, .txt e .json.</p>`);
  });
}

function renderVoiceForm() {
  els.form.innerHTML = `
    <div class="notice">
      <strong>Requer backend.</strong>
      A origem usa yt-dlp, spotdl, Spleeter e FFmpeg. Esta versao web mantem somente o fluxo equivalente.
    </div>
    <div class="field">
      <label for="audioUrl">Link do YouTube ou Spotify</label>
      <input id="audioUrl" type="url" placeholder="Cole o link">
    </div>
    ${fileDrop("audioFile", ".mp3,.wav,.m4a,.aac,.flac,.ogg,.opus", false, "Importar audio local")}
    <div class="action-row">
      <button class="button" type="button" id="youtubeAudio">Baixar do YouTube e separar voz</button>
      <button class="button" type="button" id="spotifyAudio">Baixar do Spotify e separar voz</button>
      <button class="button primary" type="submit">Separar Voz/Melodia</button>
    </div>
  `;
  bindFileList("audioFile");
  document.querySelector("#youtubeAudio").addEventListener("click", () => backendNotice("YouTube"));
  document.querySelector("#spotifyAudio").addEventListener("click", () => backendNotice("Spotify"));
  els.form.addEventListener("submit", (event) => {
    event.preventDefault();
    showResult('<strong>Separacao preparada.</strong><p class="muted">Saidas esperadas na origem: *_voz.mp3 e *_melodia.mp3.</p>');
  });
}

function backendNotice(origin) {
  showResult(`<strong>${origin} selecionado.</strong><p class="muted">Este fluxo precisa de backend para baixar o audio antes de executar Spleeter.</p>`);
}

const pdfFields = [
  { id: "pdfTitle", label: "Titulo", get: "getTitle", set: "setTitle" },
  { id: "pdfAuthor", label: "Autor", get: "getAuthor", set: "setAuthor" },
  { id: "pdfSubject", label: "Assunto", get: "getSubject", set: "setSubject" },
  { id: "pdfKeywords", label: "Palavras-chave", get: "getKeywords", set: "setKeywords", hint: "Separe por virgula." },
  { id: "pdfCreator", label: "Aplicativo criador", get: "getCreator", set: "setCreator" },
  { id: "pdfProducer", label: "Produtor", get: "getProducer", set: "setProducer" },
];

function renderPdfForm() {
  els.form.innerHTML = `
    ${fileDrop("pdfFile", ".pdf,application/pdf", false, "Selecionar PDF")}
    <div class="form-grid">
      ${pdfFields
        .map(
          (field) => `
            <div class="field">
              <label for="${field.id}">${field.label}</label>
              <input id="${field.id}" name="${field.id}" disabled>
              ${field.hint ? `<small>${field.hint}</small>` : ""}
            </div>
          `
        )
        .join("")}
      <div class="field">
        <label for="pdfLanguage">Idioma</label>
        <input id="pdfLanguage" name="pdfLanguage" placeholder="Ex: pt-BR" disabled>
      </div>
      <div class="field">
        <label for="pdfPages">Paginas</label>
        <input id="pdfPages" readonly disabled>
      </div>
      <div class="field">
        <label for="pdfCreated">Data de criacao</label>
        <input id="pdfCreated" name="pdfCreated" type="datetime-local" step="1" disabled>
      </div>
      <div class="field">
        <label for="pdfModified">Data de modificacao</label>
        <input id="pdfModified" name="pdfModified" type="datetime-local" step="1" disabled>
        <small>Vazio = data atual ao salvar.</small>
      </div>
    </div>
    <label class="check-row">
      <input id="pdfClear" type="checkbox" disabled>
      <span>Limpar todos os metadados</span>
    </label>
    <div class="action-row">
      <button class="button" type="button" id="clearPdf">Limpar</button>
      <button class="button primary" type="submit" id="savePdf" disabled>Salvar PDF</button>
    </div>
  `;

  bindFileList("pdfFile");
  document.querySelector("#clearPdf").addEventListener("click", () => {
    clearResult();
    renderPdfForm();
  });
  document.querySelector("#pdfFile").addEventListener("change", loadPdfMetadata);
  document.querySelector("#pdfClear").addEventListener("change", (event) => {
    els.form.querySelectorAll(".form-grid input:not(#pdfPages)").forEach((input) => {
      input.disabled = event.target.checked;
    });
  });
  els.form.onsubmit = handlePdfSubmit;
}

async function loadPdfMetadata() {
  const file = document.querySelector("#pdfFile").files[0];
  if (!file) return;
  clearResult();

  try {
    const pdf = await openPdf(file);
    pdfFields.forEach((field) => {
      document.querySelector(`#${field.id}`).value = pdf[field.get]() || "";
    });
    document.querySelector("#pdfLanguage").value = readPdfLanguage(pdf);
    document.querySelector("#pdfPages").value = pdf.getPageCount();
    document.querySelector("#pdfCreated").value = toDateTimeLocal(pdf.getCreationDate());
    document.querySelector("#pdfModified").value = toDateTimeLocal(pdf.getModificationDate());
    els.form.querySelectorAll("input:disabled, button:disabled").forEach((input) => {
      input.disabled = false;
    });
    document.querySelector("#pdfClear").checked = false;
  } catch (error) {
    showResult(`<p class="notice"><strong>Falha ao ler o PDF.</strong>${escapeHtml(error.message)}</p>`);
  }
}

async function handlePdfSubmit(event) {
  event.preventDefault();
  const file = document.querySelector("#pdfFile").files[0];
  if (!file) {
    showResult('<p class="notice"><strong>Selecione um PDF.</strong>Escolha um arquivo local antes de salvar.</p>');
    return;
  }

  try {
    setProgress(30, "Aplicando metadados...");
    const pdf = await openPdf(file);
    const clearAll = document.querySelector("#pdfClear").checked;

    if (clearAll) {
      clearPdfMetadata(pdf);
    } else {
      pdfFields.forEach((field) => {
        const value = document.querySelector(`#${field.id}`).value.trim();
        if (field.set === "setKeywords") {
          pdf.setKeywords(value ? [value] : []);
        } else {
          pdf[field.set](value);
        }
      });

      const language = document.querySelector("#pdfLanguage").value.trim();
      if (language) pdf.setLanguage(language);
      else pdf.catalog.delete(PDFLib.PDFName.of("Lang"));

      const created = document.querySelector("#pdfCreated").value;
      const modified = document.querySelector("#pdfModified").value;
      if (created) pdf.setCreationDate(new Date(created));
      pdf.setModificationDate(modified ? new Date(modified) : new Date());
    }

    setProgress(70, "Gerando PDF...");
    const bytes = await pdf.save();
    const url = URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
    const name = `${sanitizeName(file.name.replace(/\.pdf$/i, ""))}_editado.pdf`;

    showResult(`
      <strong>${clearAll ? "Metadados removidos." : "Metadados atualizados."}</strong>
      <div class="file-line"><span>${name}</span><small>${formatBytes(bytes.length)}</small></div>
      <div class="result-actions">
        <a class="button primary" href="${url}" download="${name}">Baixar PDF</a>
      </div>
    `);
    saveHistory({ title: "Editar PDF", detail: `Metadados de ${escapeHtml(file.name)}`, date: Date.now() });
  } catch (error) {
    showResult(`<p class="notice"><strong>Falha ao salvar o PDF.</strong>${escapeHtml(error.message)}</p>`);
  } finally {
    resetProgress();
  }
}

async function openPdf(file) {
  await ensurePdfLib();
  try {
    return await PDFLib.PDFDocument.load(await file.arrayBuffer(), { updateMetadata: false });
  } catch (error) {
    if (/encrypt/i.test(error.message)) {
      throw new Error("Este PDF esta protegido por senha. Remova a protecao antes de editar os dados.");
    }
    throw error;
  }
}

function clearPdfMetadata(pdf) {
  const infoRef = pdf.context.trailerInfo.Info;
  if (infoRef) {
    pdf.context.delete(infoRef);
    pdf.context.trailerInfo.Info = undefined;
  }
  pdf.catalog.delete(PDFLib.PDFName.of("Metadata"));
  pdf.catalog.delete(PDFLib.PDFName.of("Lang"));
}

function readPdfLanguage(pdf) {
  const lang = pdf.catalog.lookup(PDFLib.PDFName.of("Lang"));
  return lang && typeof lang.decodeText === "function" ? lang.decodeText() : "";
}

function toDateTimeLocal(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return "";
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 19);
}

function escapeHtml(value) {
  const entities = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  return String(value).replace(/[&<>"']/g, (char) => entities[char]);
}

let pdfLibPromise;
function ensurePdfLib() {
  if (window.PDFLib) return Promise.resolve();
  pdfLibPromise ||= new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = cdn.pdfLib;
    script.onload = resolve;
    script.onerror = () => {
      pdfLibPromise = undefined;
      reject(new Error("Nao foi possivel carregar a biblioteca pdf-lib."));
    };
    document.head.append(script);
  });
  return pdfLibPromise;
}

function renderConfigForm() {
  const s = state.settings;
  els.form.innerHTML = `
    <div class="form-grid">
      <div class="field">
        <label for="ffmpegPath">Local do FFmpeg</label>
        <input id="ffmpegPath" value="${s.ffmpegPath || ""}" placeholder="C:\\ffmpeg\\bin">
      </div>
      <div class="field">
        <label for="downloadDir">Pasta padrao de downloads</label>
        <input id="downloadDir" value="${s.downloadDir || ""}" placeholder="Downloads">
      </div>
      <div class="field">
        <label for="framesDir">Pasta padrao de frames</label>
        <input id="framesDir" value="${s.framesDir || ""}" placeholder="FramesExtractor">
      </div>
      <div class="field">
        <label for="transcriptionsDir">Pasta padrao de transcricoes</label>
        <input id="transcriptionsDir" value="${s.transcriptionsDir || ""}" placeholder="Transcriptions">
      </div>
      <div class="field">
        <label for="defaultWhisperModel">Modelo Whisper</label>
        <select id="defaultWhisperModel">
          ${["tiny", "base", "small", "medium", "large-v2", "large-v3"].map((model) => `<option ${model === (s.whisperModel || "base") ? "selected" : ""}>${model}</option>`).join("")}
        </select>
      </div>
      <div class="field">
        <label for="defaultLanguage">Idioma</label>
        <input id="defaultLanguage" value="${s.language || ""}" placeholder="vazio = auto">
      </div>
    </div>
    <label class="check-row">
      <input id="logsEnabled" type="checkbox" ${s.logsEnabled === false ? "" : "checked"}>
      <span>Ativar sistema de logs</span>
    </label>
    <div class="action-row">
      <button class="button primary" type="submit">Salvar configuracoes</button>
    </div>
  `;

  els.form.addEventListener("submit", (event) => {
    event.preventDefault();
    state.settings = {
      ffmpegPath: document.querySelector("#ffmpegPath").value.trim(),
      downloadDir: document.querySelector("#downloadDir").value.trim(),
      framesDir: document.querySelector("#framesDir").value.trim(),
      transcriptionsDir: document.querySelector("#transcriptionsDir").value.trim(),
      whisperModel: document.querySelector("#defaultWhisperModel").value,
      language: document.querySelector("#defaultLanguage").value.trim(),
      logsEnabled: document.querySelector("#logsEnabled").checked,
    };
    saveSettings();
    showResult("<strong>Configuracoes salvas.</strong><p class=\"muted\">Os valores ficam no localStorage deste navegador.</p>");
    saveHistory({ title: "Configuracoes", detail: "Preferencias atualizadas", date: Date.now() });
  });
}

function initTheme() {
  const saved = localStorage.getItem("filetools-media-theme") || "dark";
  document.documentElement.dataset.theme = saved;
  els.themeLabel.textContent = saved === "dark" ? "Escuro" : "Claro";

  els.themeToggle.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("filetools-media-theme", next);
    els.themeLabel.textContent = next === "dark" ? "Escuro" : "Claro";
  });
}

initTheme();
render();
