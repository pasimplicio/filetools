const cdn = {
  pdfLib: "https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js",
  qrCode: "https://cdn.jsdelivr.net/npm/qrcode@1.5.4/build/qrcode.min.js"
};

const icons = {
  pdf: '<svg viewBox="0 0 24 24"><path d="M6 2.75h7l5 5v13.5H6z"/><path d="M13 3v5h5"/><path d="M8.5 14h7M8.5 17h5"/></svg>',
  image: '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="m4 16 4.2-4.2a2 2 0 0 1 2.8 0L17 18"/><path d="m14 15 1.2-1.2a2 2 0 0 1 2.8 0L21 17"/><circle cx="8" cy="8.5" r="1.5"/></svg>',
  media: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m10 9 5 3-5 3z"/></svg>',
  qr: '<svg viewBox="0 0 24 24"><path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4z"/><path d="M14 14h2v2h-2zM18 14h2v4h-2zM14 18h4v2h-4z"/></svg>'
};

const groupLabels = {
  organize: "Organizar PDF",
  optimize: "Otimizar PDF",
  convert: "Converter PDF",
  edit: "Editar PDF",
  security: "Seguranca PDF",
  other: "Outras ferramentas"
};

const tools = [
  {
    id: "compress-pdf",
    title: "Comprimir PDF",
    category: "pdf",
    group: "optimize",
    available: true,
    accept: ".pdf,application/pdf",
    multiple: true,
    mode: "PDF local com pdf-lib",
    buttonLabel: "Comprimir PDF",
    description: "Reduza o tamanho do arquivo mantendo a melhor qualidade possivel no navegador.",
    steps: ["Escolha um ou mais PDFs.", "Selecione o nivel de compressao.", "Baixe os PDFs reduzidos."],
    options: () => `
      <div class="option-grid compression-options">
        <div class="field">
          <label for="pdfLevel">Nivel de compressao</label>
          <select id="pdfLevel" name="pdfLevel">
            <option value="extreme">Maxima local</option>
            <option value="recommended" selected>Recomendada</option>
            <option value="low">Baixa alteracao</option>
          </select>
          <small>A compressao local regrava a estrutura do PDF. Imagens internas nao sao recomprimidas nesta versao.</small>
        </div>
      </div>`
  },
  {
    id: "merge-pdf",
    title: "Juntar PDF",
    category: "pdf",
    group: "organize",
    available: true,
    accept: ".pdf,application/pdf",
    multiple: true,
    mode: "PDF local com pdf-lib",
    buttonLabel: "Juntar PDF",
    description: "Combine PDFs na ordem que voce definir antes de gerar o arquivo final.",
    steps: ["Escolha dois ou mais PDFs.", "Reordene os arquivos se precisar.", "Gere o PDF combinado."],
    options: () => '<p class="muted">Use as setas na lista de arquivos para ajustar a ordem antes de juntar.</p>'
  },
  {
    id: "split-pdf",
    title: "Dividir PDF",
    category: "pdf",
    group: "organize",
    available: true,
    accept: ".pdf,application/pdf",
    multiple: false,
    mode: "PDF local com pdf-lib",
    buttonLabel: "Dividir PDF",
    description: "Separe paginas por intervalos ou extraia cada pagina como um PDF independente.",
    steps: ["Escolha um PDF.", "Defina intervalos ou extraia todas as paginas.", "Baixe os PDFs gerados."],
    options: () => `
      <div class="option-grid">
        <div class="field">
          <label for="splitMode">Modo</label>
          <select id="splitMode" name="splitMode">
            <option value="ranges">Dividir por intervalos</option>
            <option value="extract-all">Extrair todas as paginas</option>
          </select>
          <small>Intervalos podem virar um unico PDF ou varios arquivos.</small>
        </div>
        <div class="field">
          <label for="pageRanges">Intervalos</label>
          <input id="pageRanges" name="pageRanges" value="1" placeholder="Ex: 1-3, 5, 8-10">
          <small>Use numeros e intervalos separados por virgula.</small>
        </div>
        <label class="check-row">
          <input id="mergeRanges" name="mergeRanges" type="checkbox" value="yes" checked>
          <span>Unir intervalos em um unico PDF.</span>
        </label>
      </div>`
  },
  {
    id: "remove-pages",
    title: "Remover paginas",
    category: "pdf",
    group: "organize",
    available: true,
    accept: ".pdf,application/pdf",
    multiple: false,
    mode: "PDF local com pdf-lib",
    buttonLabel: "Remover paginas",
    description: "Apague paginas especificas e baixe uma nova copia do PDF.",
    steps: ["Escolha um PDF.", "Informe as paginas que devem sair.", "Baixe o PDF sem essas paginas."],
    options: () => `
      <div class="option-grid">
        <div class="field">
          <label for="removeRanges">Paginas para remover</label>
          <input id="removeRanges" name="removeRanges" value="1" placeholder="Ex: 2, 4-6, 9">
          <small>As paginas restantes permanecem na ordem original.</small>
        </div>
      </div>`
  },
  {
    id: "rotate-pdf",
    title: "Girar PDF",
    category: "pdf",
    group: "edit",
    available: true,
    accept: ".pdf,application/pdf",
    multiple: false,
    mode: "PDF local com pdf-lib",
    buttonLabel: "Girar PDF",
    description: "Gire todas as paginas ou apenas paginas selecionadas.",
    steps: ["Escolha um PDF.", "Defina paginas e angulo.", "Baixe o PDF girado."],
    options: () => `
      <div class="option-grid">
        <div class="field">
          <label for="rotatePages">Paginas</label>
          <input id="rotatePages" name="rotatePages" value="todas" placeholder="todas ou Ex: 1, 3-5">
          <small>Use "todas" para aplicar no documento inteiro.</small>
        </div>
        <div class="field">
          <label for="rotationDegrees">Rotacao</label>
          <select id="rotationDegrees" name="rotationDegrees">
            <option value="90">90 graus para a direita</option>
            <option value="180">180 graus</option>
            <option value="270">90 graus para a esquerda</option>
          </select>
        </div>
      </div>`
  },
  {
    id: "organize-pdf",
    title: "Organizar PDF",
    category: "pdf",
    group: "organize",
    available: false,
    accept: ".pdf,application/pdf",
    multiple: true,
    mode: "Em breve",
    description: "Reordene paginas visualmente, remova paginas e combine documentos em uma unica etapa.",
    steps: ["Em breve."],
    options: soonOptions
  },
  {
    id: "pdf-to-jpg",
    title: "PDF para JPG",
    category: "pdf",
    group: "convert",
    available: false,
    accept: ".pdf,application/pdf",
    multiple: false,
    mode: "Em breve",
    description: "Converta paginas do PDF em imagens JPG.",
    steps: ["Em breve."],
    options: soonOptions
  },
  {
    id: "jpg-to-pdf",
    title: "JPG para PDF",
    category: "pdf",
    group: "convert",
    available: false,
    accept: "image/jpeg,image/png,image/webp",
    multiple: true,
    mode: "Em breve",
    description: "Transforme imagens em um documento PDF.",
    steps: ["Em breve."],
    options: soonOptions
  },
  {
    id: "protect-pdf",
    title: "Proteger PDF",
    category: "pdf",
    group: "security",
    available: false,
    accept: ".pdf,application/pdf",
    multiple: false,
    mode: "Em breve",
    description: "Adicione senha ao PDF antes de compartilhar.",
    steps: ["Em breve."],
    options: soonOptions
  },
  {
    id: "unlock-pdf",
    title: "Desbloquear PDF",
    category: "pdf",
    group: "security",
    available: false,
    accept: ".pdf,application/pdf",
    multiple: false,
    mode: "Em breve",
    description: "Remova restricoes quando voce tiver permissao e a senha correta.",
    steps: ["Em breve."],
    options: soonOptions
  },
  {
    id: "convert-image",
    title: "Converter imagem",
    category: "image",
    group: "other",
    available: false,
    accept: "image/*",
    multiple: true,
    mode: "100% no navegador",
    description: "Converta imagens para JPG, PNG ou WebP usando Canvas local.",
    steps: ["Escolha uma ou mais imagens.", "Selecione o formato.", "Baixe os arquivos convertidos."],
    options: () => imageOptions("image/webp", 0.86, true)
  },
  {
    id: "compress-image",
    title: "Comprimir imagem",
    category: "image",
    group: "other",
    available: false,
    accept: "image/*",
    multiple: true,
    mode: "100% no navegador",
    description: "Reduza o peso de imagens ajustando qualidade e largura maxima.",
    steps: ["Escolha imagens.", "Ajuste qualidade e tamanho.", "Baixe as versoes comprimidas."],
    options: () => imageOptions("image/jpeg", 0.74, true)
  },
  {
    id: "resize-image",
    title: "Redimensionar imagem",
    category: "image",
    group: "other",
    available: false,
    accept: "image/*",
    multiple: true,
    mode: "100% no navegador",
    description: "Altere largura e altura mantendo proporcao quando um dos campos ficar vazio.",
    steps: ["Escolha imagens.", "Defina largura ou altura.", "Baixe as imagens redimensionadas."],
    options: () => `
      <div class="option-grid">
        <div class="field">
          <label for="targetWidth">Largura</label>
          <input id="targetWidth" name="targetWidth" type="number" min="1" placeholder="Ex: 1200">
        </div>
        <div class="field">
          <label for="targetHeight">Altura</label>
          <input id="targetHeight" name="targetHeight" type="number" min="1" placeholder="Opcional">
        </div>
        <div class="field">
          <label for="imageFormat">Formato</label>
          <select id="imageFormat" name="imageFormat">
            <option value="image/webp">WebP</option>
            <option value="image/jpeg">JPG</option>
            <option value="image/png">PNG</option>
          </select>
        </div>
        <div class="field">
          <label for="quality">Qualidade</label>
          <input id="quality" name="quality" type="range" min="0.4" max="1" step="0.01" value="0.86">
          <small>Usado em JPG e WebP.</small>
        </div>
      </div>`
  },
  {
    id: "convert-video",
    title: "Converter video",
    category: "media",
    group: "other",
    available: false,
    accept: ".mp4,.mov,.mkv,.webm,.avi,.m4v,video/*",
    multiple: false,
    mode: "Video local quando suportado",
    description: "Converta videos reproduziveis pelo navegador para WebM ou MP4 quando disponivel.",
    steps: ["Escolha um video local.", "Selecione o formato de saida.", "Processe e baixe o novo arquivo."],
    options: () => `
      <div class="option-grid">
        <div class="field">
          <label for="videoFormat">Formato de saida</label>
          <select id="videoFormat" name="videoFormat">
            <option value="video/webm;codecs=vp9,opus">WebM VP9</option>
            <option value="video/webm;codecs=vp8,opus">WebM VP8</option>
            <option value="video/mp4">MP4, se o navegador suportar</option>
            <option value="backend/mov">MOV, requer backend FFmpeg</option>
            <option value="backend/mkv">MKV, requer backend FFmpeg</option>
          </select>
          <small>MP4, MOV e MKV dependem do suporte do navegador ou de backend FFmpeg.</small>
        </div>
      </div>`
  },
  {
    id: "platform-downloader",
    title: "Downloader de plataformas",
    category: "media",
    group: "other",
    available: false,
    accept: "",
    multiple: false,
    mode: "Requer backend/API autorizada",
    description: "Fluxo para YouTube, Instagram, TikTok e outras plataformas com validacao de uso permitido.",
    steps: ["Cole o link publico.", "Confirme que voce tem direito de baixar.", "Use uma API/backend autorizado para gerar o arquivo."],
    options: () => `
      <div class="option-grid">
        <div class="field">
          <label for="platformUrl">Link do video</label>
          <input id="platformUrl" name="platformUrl" type="url" placeholder="https://...">
        </div>
        <div class="field">
          <label for="platformName">Plataforma</label>
          <select id="platformName" name="platformName">
            <option value="youtube">YouTube</option>
            <option value="instagram">Instagram</option>
            <option value="tiktok">TikTok</option>
            <option value="twitter">X / Twitter</option>
            <option value="other">Outra</option>
          </select>
        </div>
      </div>
      <label class="check-row">
        <input id="usageRights" name="usageRights" type="checkbox" value="yes">
        <span>Confirmo que tenho permissao para baixar este conteudo ou que ele e de minha autoria, dominio publico ou licenciado.</span>
      </label>`
  },
  {
    id: "youtube-mp3",
    title: "YouTube para MP3",
    category: "media",
    group: "other",
    available: false,
    accept: "",
    multiple: false,
    mode: "Requer backend/API autorizada",
    description: "Fluxo preparado para converter conteudo permitido do YouTube em audio MP3 via backend.",
    steps: ["Cole o link do YouTube.", "Confirme permissao de uso.", "A conversao MP3 deve rodar no backend."],
    options: () => `
      <div class="option-grid">
        <div class="field">
          <label for="youtubeUrl">Link do YouTube</label>
          <input id="youtubeUrl" name="youtubeUrl" type="url" placeholder="https://youtube.com/watch?v=...">
        </div>
        <div class="field">
          <label for="audioQuality">Qualidade</label>
          <select id="audioQuality" name="audioQuality">
            <option value="128">MP3 128 kbps</option>
            <option value="192">MP3 192 kbps</option>
            <option value="256">MP3 256 kbps</option>
          </select>
        </div>
      </div>
      <label class="check-row">
        <input id="youtubeRights" name="youtubeRights" type="checkbox" value="yes">
        <span>Confirmo que tenho permissao para converter este conteudo.</span>
      </label>`
  },
  {
    id: "trim-video",
    title: "Cortador de video",
    category: "media",
    group: "other",
    available: false,
    accept: ".mp4,.mov,.mkv,.webm,.avi,.m4v,video/*",
    multiple: false,
    mode: "Corte local quando suportado",
    description: "Corte trechos de videos locais que o navegador consegue reproduzir.",
    steps: ["Escolha um video local.", "Defina inicio e fim em segundos.", "Baixe o trecho renderizado."],
    options: () => `
      <div class="option-grid">
        <div class="field">
          <label for="startTime">Inicio em segundos</label>
          <input id="startTime" name="startTime" type="number" min="0" step="0.1" value="0">
        </div>
        <div class="field">
          <label for="endTime">Fim em segundos</label>
          <input id="endTime" name="endTime" type="number" min="0" step="0.1" placeholder="Ate o final">
        </div>
        <div class="field">
          <label for="trimFormat">Formato de saida</label>
          <select id="trimFormat" name="trimFormat">
            <option value="video/webm;codecs=vp9,opus">WebM VP9</option>
            <option value="video/webm;codecs=vp8,opus">WebM VP8</option>
            <option value="video/mp4">MP4, se o navegador suportar</option>
          </select>
        </div>
      </div>`
  },
  {
    id: "extract-audio",
    title: "Extrair audio de video",
    category: "media",
    group: "other",
    available: false,
    accept: "video/*",
    multiple: false,
    mode: "Audio local em WebM",
    description: "Extrai audio de videos compativeis com o navegador e salva em WebM.",
    steps: ["Escolha um video local.", "Aguarde a leitura do audio.", "Baixe o arquivo WebM."],
    options: () => `
      <p class="muted">Esta ferramenta grava o audio localmente em tempo real. Videos longos levam mais tempo e o navegador precisa conseguir reproduzir o formato.</p>`
  },
  {
    id: "qr-code",
    title: "Gerar QR Code",
    category: "qr",
    group: "other",
    available: false,
    accept: "",
    multiple: false,
    mode: "Texto local no navegador",
    description: "Gere QR Code para link, texto, Pix, Wi-Fi ou qualquer conteudo curto.",
    steps: ["Digite o conteudo.", "Ajuste tamanho e cor.", "Baixe em PNG."],
    options: () => `
      <div class="option-grid">
        <div class="field">
          <label for="qrText">Conteudo</label>
          <textarea id="qrText" name="qrText" rows="4" placeholder="Cole aqui o link, texto ou chave Pix">https://exemplo.com</textarea>
        </div>
        <div class="field">
          <label for="qrSize">Tamanho</label>
          <input id="qrSize" name="qrSize" type="number" min="160" max="1200" value="512">
          <small>PNG quadrado em pixels.</small>
        </div>
        <div class="field">
          <label for="qrDark">Cor do codigo</label>
          <input id="qrDark" name="qrDark" type="color" value="#10201d">
        </div>
        <div class="field">
          <label for="qrLight">Cor do fundo</label>
          <input id="qrLight" name="qrLight" type="color" value="#ffffff">
        </div>
      </div>`
  }
];

const state = {
  active: tools[0],
  files: [],
  filter: "all",
  history: JSON.parse(localStorage.getItem("filetools-history") || "[]"),
  urls: []
};

const elements = {
  toolGrid: document.querySelector("#toolGrid"),
  toolSearch: document.querySelector("#toolSearch"),
  workspaceTitle: document.querySelector("#workspaceTitle"),
  activeTitle: document.querySelector("#activeTitle"),
  activeDescription: document.querySelector("#activeDescription"),
  activeIcon: document.querySelector("#activeIcon"),
  processingMode: document.querySelector("#processingMode"),
  dropZone: document.querySelector("#dropZone"),
  fileInput: document.querySelector("#fileInput"),
  fileList: document.querySelector("#fileList"),
  optionsPanel: document.querySelector("#optionsPanel"),
  runButton: document.querySelector("#runButton"),
  clearButton: document.querySelector("#clearButton"),
  resultPanel: document.querySelector("#resultPanel"),
  progressWrap: document.querySelector("#progressWrap"),
  progressBar: document.querySelector("#progressBar"),
  progressText: document.querySelector("#progressText"),
  progressPercent: document.querySelector("#progressPercent"),
  howItWorks: document.querySelector("#howItWorks"),
  historyList: document.querySelector("#historyList"),
  themeToggle: document.querySelector("#themeToggle")
};

function imageOptions(defaultFormat, defaultQuality, includeMaxWidth) {
  return `
    <div class="option-grid">
      <div class="field">
        <label for="imageFormat">Formato</label>
        <select id="imageFormat" name="imageFormat">
          <option value="image/webp" ${defaultFormat === "image/webp" ? "selected" : ""}>WebP</option>
          <option value="image/jpeg" ${defaultFormat === "image/jpeg" ? "selected" : ""}>JPG</option>
          <option value="image/png" ${defaultFormat === "image/png" ? "selected" : ""}>PNG</option>
        </select>
      </div>
      <div class="field">
        <label for="quality">Qualidade</label>
        <input id="quality" name="quality" type="range" min="0.4" max="1" step="0.01" value="${defaultQuality}">
        <small>Usado em JPG e WebP.</small>
      </div>
      ${includeMaxWidth ? `
        <div class="field">
          <label for="maxWidth">Largura maxima</label>
          <input id="maxWidth" name="maxWidth" type="number" min="1" placeholder="Manter original">
          <small>Opcional. Mantem proporcao.</small>
        </div>` : ""}
    </div>`;
}

function soonOptions() {
  return '<p class="muted">Esta ferramenta esta no roadmap e sera liberada em breve.</p>';
}

function renderTools() {
  const query = elements.toolSearch.value.trim().toLowerCase();
  const filtered = tools.filter((tool) => {
    const matchCategory = state.filter === "all" || tool.group === state.filter || tool.category === state.filter;
    const matchText = [tool.title, tool.description, tool.category, groupLabels[tool.group]].join(" ").toLowerCase().includes(query);
    return matchCategory && matchText;
  });

  elements.toolGrid.innerHTML = filtered.map((tool) => `
    <button
      class="tool-card ${tool.id === state.active.id ? "active" : ""} ${isToolAvailable(tool) ? "" : "disabled"}"
      type="button"
      data-tool="${tool.id}"
      ${isToolAvailable(tool) ? "" : 'disabled aria-disabled="true"'}
    >
      ${icons[tool.category]}
      <small class="tool-group">${groupLabels[tool.group] || "Ferramenta"}</small>
      <strong>${tool.title}</strong>
      <span>${tool.description}</span>
      ${isToolAvailable(tool) ? "" : '<small class="soon-badge">Em breve</small>'}
    </button>
  `).join("");
}

function setActiveTool(id) {
  const tool = tools.find((item) => item.id === id) || tools[0];
  if (!isToolAvailable(tool)) return;
  state.active = tool;
  state.files = [];
  clearResults();

  elements.workspaceTitle.textContent = tool.title;
  elements.activeTitle.textContent = tool.title;
  elements.activeDescription.textContent = tool.description;
  elements.activeIcon.innerHTML = icons[tool.category];
  elements.processingMode.textContent = tool.mode;
  elements.fileInput.accept = tool.accept;
  elements.fileInput.multiple = tool.multiple;
  elements.dropZone.hidden = ["qr-code", "platform-downloader", "youtube-mp3"].includes(tool.id);
  elements.optionsPanel.innerHTML = tool.options();
  elements.howItWorks.innerHTML = tool.steps.map((step) => `<li>${step}</li>`).join("");
  elements.runButton.textContent = tool.buttonLabel || "Processar";
  elements.runButton.disabled = false;

  renderFiles();
  renderTools();
}

function isToolAvailable(tool) {
  return tool.available === true;
}

function renderFiles() {
  if (!state.files.length) {
    elements.fileList.innerHTML = "";
    return;
  }

  elements.fileList.innerHTML = state.files.map((file, index) => `
    <div class="file-item">
      <div>
        <strong><span class="file-order">${index + 1}</span>${escapeHtml(file.name)}</strong>
        <span>${formatBytes(file.size)} - ${file.type || "tipo desconhecido"}</span>
      </div>
      <div class="file-actions" aria-label="Acoes para ${escapeHtml(file.name)}">
        ${state.active.multiple && state.files.length > 1 ? `
          <button type="button" data-file-action="up" data-file-index="${index}" aria-label="Mover ${escapeHtml(file.name)} para cima" ${index === 0 ? "disabled" : ""}>Subir</button>
          <button type="button" data-file-action="down" data-file-index="${index}" aria-label="Mover ${escapeHtml(file.name)} para baixo" ${index === state.files.length - 1 ? "disabled" : ""}>Descer</button>
        ` : ""}
        <button type="button" data-file-action="remove" data-file-index="${index}" aria-label="Remover ${escapeHtml(file.name)}">Remover</button>
      </div>
    </div>
  `).join("");
}

function isPdfFile(file) {
  return file.type === "application/pdf" || /\.pdf$/i.test(file.name);
}

function validateSelectedFiles(files) {
  if (state.active.category !== "pdf") return files;
  const invalid = files.find((file) => !isPdfFile(file));
  if (invalid) throw new Error(`Use apenas arquivos PDF. Arquivo invalido: ${invalid.name}`);
  return files;
}

function renderHistory() {
  if (!state.history.length) {
    elements.historyList.innerHTML = '<p class="muted">Seus ultimos resultados aparecem aqui neste navegador.</p>';
    return;
  }

  elements.historyList.innerHTML = state.history.slice(0, 5).map((entry) => `
    <div class="history-entry">
      <strong>${escapeHtml(entry.tool)}</strong><br>
      <span>${escapeHtml(entry.file)} - ${entry.when}</span>
    </div>
  `).join("");
}

function clearResults() {
  state.urls.forEach((url) => URL.revokeObjectURL(url));
  state.urls = [];
  elements.resultPanel.hidden = true;
  elements.resultPanel.innerHTML = "";
  setProgress(0, "Processando...");
  elements.progressWrap.hidden = true;
}

function setProgress(percent, text) {
  const value = Math.max(0, Math.min(100, Math.round(percent)));
  elements.progressBar.style.width = `${value}%`;
  elements.progressPercent.textContent = `${value}%`;
  elements.progressText.textContent = text;
}

function getFormData() {
  const formData = new FormData(elements.optionsPanel);
  return Object.fromEntries(formData.entries());
}

function showResult(title, description, links) {
  elements.resultPanel.hidden = false;
  elements.resultPanel.innerHTML = `
    <strong>${title}</strong>
    <p class="muted">${description}</p>
    <div class="result-actions" ${links.length ? "" : "hidden"}>
      ${links.map((link) => `<a class="download-link" href="${link.url}" download="${link.name}">${link.label || "Baixar"}</a>`).join("")}
    </div>
  `;
}

function addHistory(fileName) {
  const entry = {
    tool: state.active.title,
    file: fileName,
    when: new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date())
  };
  state.history = [entry, ...state.history].slice(0, 12);
  localStorage.setItem("filetools-history", JSON.stringify(state.history));
  renderHistory();
}

function makeUrl(blob) {
  const url = URL.createObjectURL(blob);
  state.urls.push(url);
  return url;
}

async function runTool() {
  clearResults();

  if (!isToolAvailable(state.active)) {
    elements.resultPanel.hidden = false;
    elements.resultPanel.innerHTML = '<strong>Em breve</strong><p class="muted">Esta ferramenta ainda nao esta disponivel nesta versao.</p>';
    return;
  }

  elements.progressWrap.hidden = false;
  elements.runButton.disabled = true;

  try {
    const toolsWithoutFiles = ["qr-code", "platform-downloader", "youtube-mp3"];
    if (!toolsWithoutFiles.includes(state.active.id) && !state.files.length) {
      throw new Error("Escolha pelo menos um arquivo antes de processar.");
    }
    validateSelectedFiles(state.files);

    const data = getFormData();
    let result;

    if (state.active.category === "image") result = await processImages(data);
    if (state.active.id === "compress-pdf") result = await compressPdf(data);
    if (state.active.id === "merge-pdf") result = await mergePdf();
    if (state.active.id === "split-pdf") result = await splitPdf(data);
    if (state.active.id === "remove-pages") result = await removePages(data);
    if (state.active.id === "rotate-pdf") result = await rotatePdf(data);
    if (state.active.id === "convert-video") result = await convertVideo(data);
    if (state.active.id === "trim-video") result = await trimVideo(data);
    if (state.active.id === "platform-downloader") result = await preparePlatformDownload(data);
    if (state.active.id === "youtube-mp3") result = await prepareYoutubeMp3(data);
    if (state.active.id === "extract-audio") result = await extractAudio();
    if (state.active.id === "qr-code") result = await generateQr(data);

    setProgress(100, "Concluido");
    showResult(result.title, result.description, result.links);
    addHistory(result.links[0]?.name || state.active.title);
  } catch (error) {
    setProgress(100, "Erro");
    elements.resultPanel.hidden = false;
    elements.resultPanel.innerHTML = `<strong>Nao foi possivel concluir</strong><p class="muted">${escapeHtml(error.message)}</p>`;
  } finally {
    elements.runButton.disabled = false;
  }
}

async function processImages(data) {
  const links = [];
  const format = data.imageFormat || "image/webp";
  const quality = Number(data.quality || 0.86);
  const maxWidth = Number(data.maxWidth || 0);
  const targetWidth = Number(data.targetWidth || 0);
  const targetHeight = Number(data.targetHeight || 0);

  for (let index = 0; index < state.files.length; index += 1) {
    const file = state.files[index];
    setProgress((index / state.files.length) * 85, `Processando ${file.name}`);
    const image = await loadImage(file);
    const dimensions = calculateImageSize(image, { maxWidth, targetWidth, targetHeight });
    const blob = await drawImageToBlob(image, dimensions, format, quality);
    const extension = extensionFor(format);
    const name = `${baseName(file.name)}.${extension}`;
    links.push({ url: makeUrl(blob), name, label: `Baixar ${name}` });
  }

  return {
    title: "Imagens prontas",
    description: `${links.length} arquivo(s) gerado(s) localmente no navegador.`,
    links
  };
}

async function compressPdf(data = {}) {
  await ensurePdfLib();
  const levelLabels = {
    extreme: "compressao maxima local",
    recommended: "compressao recomendada",
    low: "baixa alteracao"
  };
  const links = [];
  let originalTotal = 0;
  let finalTotal = 0;

  for (let index = 0; index < state.files.length; index += 1) {
    const file = state.files[index];
    originalTotal += file.size;
    setProgress(15 + (index / state.files.length) * 72, `Otimizando ${file.name}`);
    const bytes = await file.arrayBuffer();
    const pdf = await PDFLib.PDFDocument.load(bytes, { ignoreEncryption: true });
    pdf.setProducer("FileTools");
    pdf.setCreator("FileTools");
    const saved = await pdf.save({ useObjectStreams: true, addDefaultPage: false });
    const blob = new Blob([saved], { type: "application/pdf" });
    finalTotal += blob.size;
    const name = `${baseName(file.name)}-otimizado.pdf`;
    links.push({ url: makeUrl(blob), name, label: `Baixar ${name}` });
  }

  const delta = originalTotal - finalTotal;
  const reduced = delta > 0 ? `${formatBytes(delta)} menor no total` : "sem reducao relevante";

  return {
    title: "PDF otimizado",
    description: `${links.length} arquivo(s) processado(s). Resultado: ${formatBytes(finalTotal)} (${reduced}) com ${levelLabels[data.pdfLevel] || "compressao recomendada"}.`,
    links
  };
}

async function mergePdf() {
  if (state.files.length < 2) throw new Error("Escolha pelo menos dois PDFs para juntar.");
  await ensurePdfLib();
  const output = await PDFLib.PDFDocument.create();

  for (let index = 0; index < state.files.length; index += 1) {
    const file = state.files[index];
    setProgress((index / state.files.length) * 85, `Adicionando ${file.name}`);
    const source = await PDFLib.PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
    const pages = await output.copyPages(source, source.getPageIndices());
    pages.forEach((page) => output.addPage(page));
  }

  const saved = await output.save({ useObjectStreams: true });
  const blob = new Blob([saved], { type: "application/pdf" });
  return {
    title: "PDF unido",
    description: `${state.files.length} PDFs combinados em um arquivo.`,
    links: [{ url: makeUrl(blob), name: "filetools-pdfs-unidos.pdf", label: "Baixar PDF" }]
  };
}

async function splitPdf(data) {
  await ensurePdfLib();
  const file = state.files[0];
  setProgress(20, "Lendo PDF");
  const source = await PDFLib.PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });

  if (data.splitMode === "extract-all") {
    const links = [];
    const total = source.getPageCount();
    for (let index = 0; index < total; index += 1) {
      setProgress(20 + (index / total) * 70, `Extraindo pagina ${index + 1}`);
      const output = await PDFLib.PDFDocument.create();
      const [page] = await output.copyPages(source, [index]);
      output.addPage(page);
      const saved = await output.save({ useObjectStreams: true });
      const blob = new Blob([saved], { type: "application/pdf" });
      const name = `${baseName(file.name)}-pagina-${index + 1}.pdf`;
      links.push({ url: makeUrl(blob), name, label: `Baixar pagina ${index + 1}` });
    }
    return {
      title: "PDF dividido",
      description: `${links.length} pagina(s) extraida(s) em arquivos separados.`,
      links
    };
  }

  const ranges = parsePageRangeGroups(data.pageRanges || "1", source.getPageCount());
  const mergeRanges = data.mergeRanges === "yes";

  if (mergeRanges) {
    const indices = uniqueIndices(ranges.flat());
    const output = await PDFLib.PDFDocument.create();
    const pages = await output.copyPages(source, indices);
    pages.forEach((page) => output.addPage(page));
    setProgress(78, "Gerando novo PDF");
    const saved = await output.save({ useObjectStreams: true });
    const blob = new Blob([saved], { type: "application/pdf" });
    const name = `${baseName(file.name)}-paginas.pdf`;

    return {
      title: "PDF dividido",
      description: `${indices.length} pagina(s) extraida(s) em um unico PDF.`,
      links: [{ url: makeUrl(blob), name, label: "Baixar PDF" }]
    };
  }

  const links = [];
  for (let index = 0; index < ranges.length; index += 1) {
    setProgress(30 + (index / ranges.length) * 60, `Gerando intervalo ${index + 1}`);
    const output = await PDFLib.PDFDocument.create();
    const pages = await output.copyPages(source, ranges[index]);
    pages.forEach((page) => output.addPage(page));
    const saved = await output.save({ useObjectStreams: true });
    const blob = new Blob([saved], { type: "application/pdf" });
    const name = `${baseName(file.name)}-intervalo-${index + 1}.pdf`;
    links.push({ url: makeUrl(blob), name, label: `Baixar intervalo ${index + 1}` });
  }

  return {
    title: "PDF dividido",
    description: `${links.length} arquivo(s) gerado(s) a partir dos intervalos informados.`,
    links
  };
}

async function removePages(data) {
  await ensurePdfLib();
  const file = state.files[0];
  setProgress(20, "Lendo PDF");
  const source = await PDFLib.PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
  const pageCount = source.getPageCount();
  const removed = new Set(parsePageRanges(data.removeRanges || "", pageCount));
  if (removed.size >= pageCount) throw new Error("Mantenha pelo menos uma pagina no PDF.");
  const kept = source.getPageIndices().filter((index) => !removed.has(index));
  const output = await PDFLib.PDFDocument.create();
  const pages = await output.copyPages(source, kept);
  pages.forEach((page) => output.addPage(page));
  setProgress(78, "Gerando PDF");
  const saved = await output.save({ useObjectStreams: true });
  const blob = new Blob([saved], { type: "application/pdf" });
  const name = `${baseName(file.name)}-sem-paginas.pdf`;

  return {
    title: "Paginas removidas",
    description: `${removed.size} pagina(s) removida(s). O novo PDF ficou com ${kept.length} pagina(s).`,
    links: [{ url: makeUrl(blob), name, label: "Baixar PDF" }]
  };
}

async function rotatePdf(data) {
  await ensurePdfLib();
  const file = state.files[0];
  setProgress(20, "Lendo PDF");
  const pdf = await PDFLib.PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
  const pageCount = pdf.getPageCount();
  const input = String(data.rotatePages || "todas").trim().toLowerCase();
  const indices = ["todas", "todos", "all"].includes(input) ? pdf.getPageIndices() : parsePageRanges(input, pageCount);
  const degrees = Number(data.rotationDegrees || 90);
  const pages = pdf.getPages();

  indices.forEach((index) => {
    const current = pages[index].getRotation().angle || 0;
    pages[index].setRotation(PDFLib.degrees((current + degrees) % 360));
  });

  setProgress(78, "Aplicando rotacao");
  const saved = await pdf.save({ useObjectStreams: true });
  const blob = new Blob([saved], { type: "application/pdf" });
  const name = `${baseName(file.name)}-girado.pdf`;

  return {
    title: "PDF girado",
    description: `${indices.length} pagina(s) girada(s) em ${degrees} graus.`,
    links: [{ url: makeUrl(blob), name, label: "Baixar PDF" }]
  };
}

async function convertVideo(data) {
  const file = state.files[0];
  const mimeType = resolveVideoMime(data.videoFormat);
  const blob = await recordVideoSegment(file, { mimeType });
  const extension = videoExtensionFor(mimeType);
  const name = `${baseName(file.name)}-convertido.${extension}`;

  return {
    title: "Video convertido",
    description: `Arquivo gerado localmente em ${extension.toUpperCase()}. Tamanho: ${formatBytes(blob.size)}.`,
    links: [{ url: makeUrl(blob), name, label: "Baixar video" }]
  };
}

async function trimVideo(data) {
  const file = state.files[0];
  const mimeType = resolveVideoMime(data.trimFormat);
  const start = Math.max(0, Number(data.startTime || 0));
  const end = data.endTime === "" ? null : Number(data.endTime);

  if (end !== null && end <= start) {
    throw new Error("O tempo final precisa ser maior que o tempo inicial.");
  }

  const blob = await recordVideoSegment(file, { mimeType, start, end });
  const extension = videoExtensionFor(mimeType);
  const name = `${baseName(file.name)}-corte.${extension}`;

  return {
    title: "Video cortado",
    description: `Trecho renderizado localmente em ${extension.toUpperCase()}. Tamanho: ${formatBytes(blob.size)}.`,
    links: [{ url: makeUrl(blob), name, label: "Baixar corte" }]
  };
}

async function preparePlatformDownload(data) {
  const url = validateUrl(data.platformUrl, "Cole um link valido da plataforma.");
  if (data.usageRights !== "yes") {
    throw new Error("Confirme que voce tem permissao para baixar este conteudo.");
  }

  setProgress(100, "Backend necessario");
  return {
    title: "Fluxo preparado para backend",
    description: `Link validado para ${data.platformName || "plataforma"}: ${url.hostname}. Para baixar, conecte uma API/backend autorizado e respeite os termos da plataforma e direitos autorais.`,
    links: []
  };
}

async function prepareYoutubeMp3(data) {
  const url = validateUrl(data.youtubeUrl, "Cole um link valido do YouTube.");
  if (!/(^|\.)youtube\.com$|(^|\.)youtu\.be$/.test(url.hostname)) {
    throw new Error("Use um link do YouTube ou youtu.be.");
  }
  if (data.youtubeRights !== "yes") {
    throw new Error("Confirme que voce tem permissao para converter este conteudo.");
  }

  setProgress(100, "Backend necessario");
  return {
    title: "Conversao MP3 preparada",
    description: `Link do YouTube validado. A conversao para MP3 ${data.audioQuality || "128"} kbps deve ser feita em backend autorizado, com conteudo proprio, licenciado ou permitido.`,
    links: []
  };
}

async function extractAudio() {
  const file = state.files[0];
  const video = document.createElement("video");
  video.src = URL.createObjectURL(file);
  video.preload = "auto";
  video.playsInline = true;

  await waitFor(video, "loadedmetadata");
  if (!video.duration || Number.isNaN(video.duration)) {
    throw new Error("O navegador nao conseguiu ler a duracao deste video.");
  }

  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext || !window.MediaRecorder) {
    throw new Error("Este navegador nao oferece suporte suficiente para extrair audio localmente.");
  }

  const audioContext = new AudioContext();
  const source = audioContext.createMediaElementSource(video);
  const destination = audioContext.createMediaStreamDestination();
  source.connect(destination);

  const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus") ? "audio/webm;codecs=opus" : "audio/webm";
  const recorder = new MediaRecorder(destination.stream, { mimeType });
  const chunks = [];

  recorder.addEventListener("dataavailable", (event) => {
    if (event.data.size > 0) chunks.push(event.data);
  });

  video.addEventListener("timeupdate", () => {
    setProgress((video.currentTime / video.duration) * 92, "Extraindo audio em tempo real");
  });

  const stopped = waitFor(recorder, "stop");
  recorder.start(500);
  video.currentTime = 0;
  await video.play();
  await waitFor(video, "ended");
  recorder.stop();
  await stopped;
  await audioContext.close();
  URL.revokeObjectURL(video.src);

  const blob = new Blob(chunks, { type: "audio/webm" });
  const name = `${baseName(file.name)}-audio.webm`;

  return {
    title: "Audio extraido",
    description: `Arquivo de audio WebM gerado localmente. Tamanho: ${formatBytes(blob.size)}.`,
    links: [{ url: makeUrl(blob), name, label: "Baixar audio" }]
  };
}

async function recordVideoSegment(file, options) {
  const video = document.createElement("video");
  const objectUrl = URL.createObjectURL(file);
  video.src = objectUrl;
  video.preload = "auto";
  video.playsInline = true;
  video.volume = 0;

  await waitFor(video, "loadedmetadata");
  if (!video.duration || Number.isNaN(video.duration)) {
    URL.revokeObjectURL(objectUrl);
    throw new Error("O navegador nao conseguiu ler a duracao deste video.");
  }

  const start = Math.min(options.start || 0, Math.max(0, video.duration - 0.1));
  const end = options.end ? Math.min(options.end, video.duration) : video.duration;
  const captureStream = video.captureStream || video.mozCaptureStream;

  if (!captureStream || !window.MediaRecorder) {
    URL.revokeObjectURL(objectUrl);
    throw new Error("Este navegador nao oferece suporte suficiente para converter ou cortar video localmente.");
  }

  const stream = captureStream.call(video);
  const recorder = new MediaRecorder(stream, { mimeType: options.mimeType });
  const chunks = [];

  recorder.addEventListener("dataavailable", (event) => {
    if (event.data.size > 0) chunks.push(event.data);
  });

  const stopped = waitFor(recorder, "stop");
  const finished = new Promise((resolve, reject) => {
    video.addEventListener("timeupdate", () => {
      const elapsed = Math.max(0, video.currentTime - start);
      const total = Math.max(0.1, end - start);
      setProgress(Math.min(92, (elapsed / total) * 92), "Renderizando video");
      if (video.currentTime >= end) resolve();
    });
    video.addEventListener("ended", resolve, { once: true });
    video.addEventListener("error", () => reject(new Error("Erro ao reproduzir este video no navegador.")), { once: true });
  });

  setProgress(8, "Preparando video");
  recorder.start(500);
  video.currentTime = start;
  await video.play();
  await finished;
  video.pause();
  recorder.stop();
  await stopped;
  stream.getTracks().forEach((track) => track.stop());
  URL.revokeObjectURL(objectUrl);

  return new Blob(chunks, { type: options.mimeType });
}

async function generateQr(data) {
  await ensureQrCode();
  const text = String(data.qrText || "").trim();
  if (!text) throw new Error("Digite o conteudo que sera convertido em QR Code.");

  const canvas = document.createElement("canvas");
  const width = Math.max(160, Math.min(1200, Number(data.qrSize || 512)));
  setProgress(55, "Gerando QR Code");
  await QRCode.toCanvas(canvas, text, {
    width,
    margin: 2,
    color: {
      dark: data.qrDark || "#10201d",
      light: data.qrLight || "#ffffff"
    }
  });

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
  return {
    title: "QR Code pronto",
    description: `PNG de ${width} x ${width}px gerado no navegador.`,
    links: [{ url: makeUrl(blob), name: "filetools-qr-code.png", label: "Baixar PNG" }]
  };
}

async function ensurePdfLib() {
  if (window.PDFLib) return;
  setProgress(8, "Carregando biblioteca de PDF");
  await loadScript(cdn.pdfLib);
}

async function ensureQrCode() {
  if (window.QRCode) return;
  setProgress(8, "Carregando gerador de QR Code");
  await loadScript(cdn.qrCode);
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      existing.addEventListener("load", resolve, { once: true });
      existing.addEventListener("error", () => reject(new Error("Falha ao carregar dependencia externa.")), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = resolve;
    script.onerror = () => reject(new Error("Falha ao carregar dependencia externa. Verifique a conexao."));
    document.head.appendChild(script);
  });
}

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Nao foi possivel abrir ${file.name}.`));
    };
    image.src = url;
  });
}

function calculateImageSize(image, options) {
  let width = image.naturalWidth;
  let height = image.naturalHeight;

  if (options.targetWidth || options.targetHeight) {
    if (options.targetWidth && options.targetHeight) return { width: options.targetWidth, height: options.targetHeight };
    if (options.targetWidth) {
      height = Math.round((options.targetWidth / width) * height);
      width = options.targetWidth;
    } else {
      width = Math.round((options.targetHeight / height) * width);
      height = options.targetHeight;
    }
  } else if (options.maxWidth && width > options.maxWidth) {
    height = Math.round((options.maxWidth / width) * height);
    width = options.maxWidth;
  }

  return { width, height };
}

function drawImageToBlob(image, dimensions, format, quality) {
  const canvas = document.createElement("canvas");
  canvas.width = dimensions.width;
  canvas.height = dimensions.height;
  const context = canvas.getContext("2d", { alpha: format === "image/png" });
  context.drawImage(image, 0, 0, dimensions.width, dimensions.height);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) reject(new Error("Nao foi possivel gerar a imagem."));
      else resolve(blob);
    }, format, quality);
  });
}

function parsePageRanges(input, pageCount) {
  const selected = new Set(parsePageRangeGroups(input, pageCount).flat());
  if (!selected.size) throw new Error("Informe pelo menos uma pagina valida.");
  return Array.from(selected);
}

function parsePageRangeGroups(input, pageCount) {
  const groups = input.split(",").map((part) => part.trim()).filter(Boolean).map((part) => {
    const [startRaw, endRaw] = part.split("-").map((value) => Number(value.trim()));
    if (!startRaw || startRaw < 1 || startRaw > pageCount) throw new Error(`Pagina invalida: ${part}`);
    const end = endRaw || startRaw;
    if (end < startRaw || end > pageCount) throw new Error(`Intervalo invalido: ${part}`);
    const indices = [];
    for (let page = startRaw; page <= end; page += 1) indices.push(page - 1);
    return indices;
  });
  if (!groups.length) throw new Error("Informe pelo menos uma pagina valida.");
  return groups;
}

function uniqueIndices(indices) {
  return Array.from(new Set(indices));
}

function waitFor(target, eventName) {
  return new Promise((resolve, reject) => {
    target.addEventListener(eventName, resolve, { once: true });
    target.addEventListener("error", () => reject(new Error("Erro ao processar midia.")), { once: true });
  });
}

function resolveVideoMime(value) {
  if (!value || value.startsWith("backend/")) {
    throw new Error("Este formato precisa de backend com FFmpeg. No frontend estatico, use WebM ou MP4 quando suportado pelo navegador.");
  }
  if (!window.MediaRecorder || !MediaRecorder.isTypeSupported(value)) {
    throw new Error(`Seu navegador nao suporta gerar ${value}. Tente WebM VP8 ou WebM VP9.`);
  }
  return value;
}

function validateUrl(value, message) {
  try {
    const url = new URL(String(value || "").trim());
    if (!["http:", "https:"].includes(url.protocol)) throw new Error("invalid");
    return url;
  } catch {
    throw new Error(message);
  }
}

function formatBytes(bytes) {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** index).toFixed(index ? 1 : 0)} ${units[index]}`;
}

function baseName(name) {
  return name.replace(/\.[^/.]+$/, "").replace(/[^\w.-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "") || "filetools";
}

function extensionFor(format) {
  return { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" }[format] || "webp";
}

function videoExtensionFor(format) {
  if (format.includes("mp4")) return "mp4";
  return "webm";
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

elements.toolGrid.addEventListener("click", (event) => {
  const card = event.target.closest("[data-tool]");
  if (!card) return;
  setActiveTool(card.dataset.tool);
  document.querySelector("#workspace").scrollIntoView({ block: "start" });
});

elements.toolSearch.addEventListener("input", renderTools);

document.querySelectorAll("[data-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    state.filter = button.dataset.filter;
    document.querySelectorAll("[data-filter]").forEach((item) => item.classList.toggle("active", item === button));
    renderTools();
  });
});

elements.fileInput.addEventListener("change", (event) => {
  clearResults();
  try {
    state.files = validateSelectedFiles(Array.from(event.target.files || []));
    renderFiles();
  } catch (error) {
    state.files = [];
    elements.fileInput.value = "";
    renderFiles();
    elements.resultPanel.hidden = false;
    elements.resultPanel.innerHTML = `<strong>Arquivo invalido</strong><p class="muted">${escapeHtml(error.message)}</p>`;
  }
});

elements.fileList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-file-action]");
  if (!button) return;
  const index = Number(button.dataset.fileIndex);
  const action = button.dataset.fileAction;
  if (!Number.isInteger(index) || index < 0 || index >= state.files.length) return;

  if (action === "remove") {
    state.files.splice(index, 1);
  } else if (action === "up" && index > 0) {
    [state.files[index - 1], state.files[index]] = [state.files[index], state.files[index - 1]];
  } else if (action === "down" && index < state.files.length - 1) {
    [state.files[index + 1], state.files[index]] = [state.files[index], state.files[index + 1]];
  }

  elements.fileInput.value = "";
  clearResults();
  renderFiles();
});

["dragenter", "dragover"].forEach((eventName) => {
  elements.dropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    elements.dropZone.classList.add("dragging");
  });
});

["dragleave", "drop"].forEach((eventName) => {
  elements.dropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    elements.dropZone.classList.remove("dragging");
  });
});

elements.dropZone.addEventListener("drop", (event) => {
  const files = Array.from(event.dataTransfer.files || []);
  elements.fileInput.value = "";
  clearResults();
  try {
    const selected = state.active.multiple ? files : files.slice(0, 1);
    state.files = validateSelectedFiles(selected);
    renderFiles();
  } catch (error) {
    state.files = [];
    renderFiles();
    elements.resultPanel.hidden = false;
    elements.resultPanel.innerHTML = `<strong>Arquivo invalido</strong><p class="muted">${escapeHtml(error.message)}</p>`;
  }
});

elements.runButton.addEventListener("click", runTool);

elements.clearButton.addEventListener("click", () => {
  state.files = [];
  elements.fileInput.value = "";
  clearResults();
  renderFiles();
});

elements.themeToggle.addEventListener("click", () => {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  localStorage.setItem("filetools-theme", next);
});

const savedTheme = localStorage.getItem("filetools-theme");
if (savedTheme) document.documentElement.dataset.theme = savedTheme;
else if (window.matchMedia("(prefers-color-scheme: dark)").matches) document.documentElement.dataset.theme = "dark";

if ("serviceWorker" in navigator && location.protocol !== "file:") {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}

setActiveTool("compress-pdf");
renderHistory();
