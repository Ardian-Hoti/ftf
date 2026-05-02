import path from "path";

const baseStyle = `
  * { box-sizing: border-box; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
    background: #0f0f0f;
    color: #ffffff;
    margin: 0;
    padding: 0;
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
  }
  a { color: inherit; text-decoration: none; }

  /* ---- Nav ---- */
  nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 32px;
    background: #161616;
    border-bottom: 1px solid #2a2a2a;
    position: sticky;
    top: 0;
    z-index: 100;
  }
  .nav-brand {
    font-size: 18px;
    font-weight: 700;
    letter-spacing: -0.5px;
    display: flex;
    align-items: center;
    gap: 8px;
    color: #fff;
  }
  .nav-brand span { color: #6366f1; }
  .nav-links { display: flex; gap: 8px; }
  .nav-link {
    padding: 8px 16px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    color: #a0a0a0;
    transition: all 0.2s;
  }
  .nav-link:hover, .nav-link.active {
    background: #6366f1;
    color: #fff;
  }

  /* ---- Layout ---- */
  .page {
    display: flex;
    min-height: calc(100vh - 65px);
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
  }
  .card {
    background: #1a1a1a;
    border: 1px solid #2a2a2a;
    border-radius: 20px;
    padding: 40px 36px;
    max-width: 500px;
    width: 100%;
    box-shadow: 0 20px 60px rgba(0,0,0,0.5);
  }
  .card-title {
    font-size: 26px;
    font-weight: 700;
    margin: 0 0 8px;
    letter-spacing: -0.5px;
  }
  .card-subtitle {
    color: #777;
    font-size: 15px;
    margin: 0 0 32px;
    line-height: 1.5;
  }

  /* ---- QR ---- */
  .qr-wrap {
    background: #fff;
    border-radius: 16px;
    padding: 20px;
    display: inline-block;
    margin-bottom: 24px;
  }
  .qr-wrap img { display: block; width: 220px; height: 220px; }
  .qr-placeholder {
    width: 220px;
    height: 220px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #2a2a2a;
    border-radius: 12px;
    color: #666;
    font-size: 14px;
  }
  .url-row {
    display: flex;
    align-items: center;
    gap: 10px;
    background: #111;
    border: 1px solid #2a2a2a;
    border-radius: 10px;
    padding: 12px 16px;
    margin-bottom: 24px;
    font-size: 14px;
    color: #a0a0a0;
    word-break: break-all;
  }
  .url-row .label { color: #555; font-size: 12px; white-space: nowrap; }

  /* ---- Status badge ---- */
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    border-radius: 999px;
    font-size: 13px;
    font-weight: 500;
    margin-bottom: 24px;
  }
  .badge.ready   { background: rgba(16,185,129,0.15); color: #10b981; }
  .badge.waiting { background: rgba(251,191,36,0.12); color: #fbbf24; }
  .badge.error   { background: rgba(239,68,68,0.12);  color: #ef4444; }
  .badge-dot { width: 7px; height: 7px; border-radius: 50%; background: currentColor; }

  /* ---- Upload form ---- */
  .drop-zone {
    border: 2px dashed #2a2a2a;
    border-radius: 12px;
    padding: 28px;
    text-align: center;
    cursor: pointer;
    transition: all 0.25s;
    margin-bottom: 16px;
    position: relative;
  }
  .drop-zone.drag-over, .drop-zone:hover { border-color: #6366f1; background: rgba(99,102,241,0.05); }
  .drop-zone input[type=file] {
    position: absolute; inset: 0; width: 100%; height: 100%;
    opacity: 0; cursor: pointer;
  }
  .drop-icon { font-size: 32px; margin-bottom: 8px; }
  .drop-text { color: #666; font-size: 14px; }
  .drop-text strong { color: #a0a0a0; }
  .selected-files { margin-bottom: 12px; }
  .sel-file {
    background: #111;
    border: 1px solid #2a2a2a;
    border-radius: 8px;
    padding: 8px 12px;
    font-size: 13px;
    color: #ccc;
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  /* ---- Buttons ---- */
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 14px 28px;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    transition: all 0.2s;
    width: 100%;
  }
  .btn-primary { background: #6366f1; color: #fff; }
  .btn-primary:hover:not(:disabled) { background: #4f46e5; transform: translateY(-1px); box-shadow: 0 8px 25px rgba(99,102,241,0.3); }
  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
  @keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:0.6 } }
  .loading { animation: pulse 1.4s ease-in-out infinite; }

  /* ---- File download list ---- */
  .file-dl-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 24px; }
  .file-dl-item {
    display: flex;
    align-items: center;
    gap: 12px;
    background: #111;
    border: 1px solid #2a2a2a;
    border-radius: 10px;
    padding: 14px 16px;
    font-size: 14px;
    color: #ccc;
    transition: background 0.2s, border-color 0.2s;
    text-decoration: none;
  }
  .file-dl-item:hover { background: #6366f1; border-color: #6366f1; color: #fff; }
  .file-dl-item .file-icon { font-size: 20px; flex-shrink: 0; }
  .file-dl-item .file-name { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .file-dl-item .dl-arrow { color: #555; }
  .file-dl-item:hover .dl-arrow { color: #fff; }

  /* ---- Upload log ---- */
  #uploadLog { margin-top: 20px; display: flex; flex-direction: column; gap: 8px; }
  .log-item {
    background: #111;
    border: 1px solid #2a2a2a;
    border-radius: 8px;
    padding: 10px 14px;
    font-size: 13px;
    display: flex;
    align-items: center;
    gap: 8px;
    color: #a0a0a0;
  }
  .log-item .check { color: #10b981; font-size: 16px; }
  .log-item .err   { color: #ef4444; font-size: 16px; }
  #uploadStatus { margin-top: 12px; font-size: 14px; color: #a0a0a0; min-height: 20px; }
  .status-ok  { color: #10b981 !important; }
  .status-err { color: #ef4444 !important; }

  /* ---- Divider ---- */
  .divider { border: none; border-top: 1px solid #2a2a2a; margin: 28px 0; }

  /* ---- Log panel on dashboard ---- */
  .log-panel {
    background: #111;
    border: 1px solid #2a2a2a;
    border-radius: 12px;
    padding: 16px;
    max-height: 240px;
    overflow-y: auto;
    font-size: 13px;
    color: #777;
    font-family: 'SF Mono', 'Fira Code', monospace;
  }
  .log-line { padding: 3px 0; border-bottom: 1px solid #1a1a1a; }
  .log-line:last-child { border-bottom: none; }
  .log-time { color: #444; margin-right: 8px; }
  .log-green { color: #10b981; }
  .log-yellow { color: #fbbf24; }
  .log-red { color: #ef4444; }

  @media (max-width: 520px) {
    nav { padding: 14px 16px; }
    .card { padding: 28px 20px; border-radius: 14px; }
    .qr-wrap img { width: 180px; height: 180px; }
  }
`;

export function dashboardPage(opts: {
  qrDataUrl: string;
  serverUrl: string;
  downloadDir: string;
  mode: "receive";
}): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>QRCP – Receive</title>
  <style>${baseStyle}</style>
</head>
<body>
  <nav>
    <div class="nav-brand">📡 <span>QRCP</span> Server</div>
    <div class="nav-links">
      <a class="nav-link active" href="/">Receive</a>
      <a class="nav-link" href="/send">Send</a>
    </div>
  </nav>
  <div class="page">
    <div class="card">
      <div class="card-title">📥 Receive Files</div>
      <div class="card-subtitle">Scan the QR code from your phone to upload files to this computer over Wi-Fi.</div>

      <div style="display:flex;flex-direction:column;align-items:center;text-align:center;">
        <div class="qr-wrap">
          <img src="${opts.qrDataUrl}" alt="QR Code" />
        </div>
        <div class="badge ready" id="statusBadge">
          <span class="badge-dot"></span>
          <span id="statusText">Ready to receive</span>
        </div>
        <div class="url-row" style="width:100%;">
          <span class="label">URL</span>
          <a href="${opts.serverUrl}/upload" target="_blank" style="color:#6366f1;">${opts.serverUrl}upload</a>
        </div>
        <div class="url-row" style="width:100%;">
          <span class="label">Saving to</span>
          <span>${opts.downloadDir}</span>
        </div>
      </div>

      <hr class="divider">
      <div style="font-size:13px;color:#555;margin-bottom:12px;text-transform:uppercase;letter-spacing:0.5px;">Activity log</div>
      <div class="log-panel" id="logPanel">
        <div class="log-line"><span class="log-time" id="startTime"></span><span class="log-green">Server started – waiting for connections</span></div>
      </div>
    </div>
  </div>

  <script>
    document.getElementById('startTime').textContent = new Date().toLocaleTimeString();

    const logPanel = document.getElementById('logPanel');
    const statusBadge = document.getElementById('statusBadge');
    const statusText = document.getElementById('statusText');

    function addLog(msg, cls) {
      const line = document.createElement('div');
      line.className = 'log-line';
      line.innerHTML = '<span class="log-time">' + new Date().toLocaleTimeString() + '</span>'
        + '<span class="' + (cls || '') + '">' + msg + '</span>';
      logPanel.appendChild(line);
      logPanel.scrollTop = logPanel.scrollHeight;
    }

    function setStatus(text, type) {
      statusText.textContent = text;
      statusBadge.className = 'badge ' + (type || 'waiting');
    }

    // Poll /api/events for SSE-like updates
    const es = new EventSource('/api/events');
    es.addEventListener('connected', e => {
      const d = JSON.parse(e.data);
      addLog('Device connected: ' + d.ip, 'log-yellow');
      setStatus('Device connected', 'waiting');
    });
    es.addEventListener('received', e => {
      const d = JSON.parse(e.data);
      addLog('✓ Received: ' + d.fileName, 'log-green');
      setStatus('Received: ' + d.fileName, 'ready');
    });
    es.addEventListener('error_event', e => {
      const d = JSON.parse(e.data);
      addLog('✗ Error: ' + d.message, 'log-red');
    });
    es.onerror = () => {};
  </script>
</body>
</html>`;
}

export function uploadPage(opts: { serverUrl: string }): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>QRCP Upload</title>
  <style>${baseStyle}
    .page { padding: 20px; }
  </style>
</head>
<body>
  <div class="page">
    <div class="card">
      <div class="card-title">📁 Upload Files</div>
      <div class="card-subtitle">Select files to transfer to your computer over Wi-Fi.</div>

      <form id="uploadForm">
        <div class="drop-zone" id="dropZone">
          <input type="file" id="fileInput" multiple />
          <div class="drop-icon">☁️</div>
          <div class="drop-text"><strong>Choose files</strong> or drag &amp; drop</div>
        </div>
        <div class="selected-files" id="selectedFiles"></div>
        <button type="submit" class="btn btn-primary" id="submitBtn">Upload Files</button>
      </form>

      <div id="uploadLog"></div>
      <div id="uploadStatus"></div>
    </div>
  </div>

  <script>
  (() => {
    const form = document.getElementById('uploadForm');
    const fileInput = document.getElementById('fileInput');
    const submitBtn = document.getElementById('submitBtn');
    const selectedFilesDiv = document.getElementById('selectedFiles');
    const uploadLog = document.getElementById('uploadLog');
    const uploadStatus = document.getElementById('uploadStatus');
    const dropZone = document.getElementById('dropZone');

    // Drag & drop
    ['dragenter','dragover','dragleave','drop'].forEach(ev => {
      dropZone.addEventListener(ev, e => { e.preventDefault(); e.stopPropagation(); });
    });
    ['dragenter','dragover'].forEach(ev => dropZone.addEventListener(ev, () => dropZone.classList.add('drag-over')));
    ['dragleave','drop'].forEach(ev => dropZone.addEventListener(ev, () => dropZone.classList.remove('drag-over')));
    dropZone.addEventListener('drop', e => {
      fileInput.files = e.dataTransfer.files;
      renderSelected();
    });

    fileInput.addEventListener('change', renderSelected);

    function renderSelected() {
      const files = Array.from(fileInput.files);
      selectedFilesDiv.innerHTML = files.map(f =>
        '<div class="sel-file">📄 ' + f.name + ' <span style="color:#555;font-size:12px;margin-left:auto;">' + formatSize(f.size) + '</span></div>'
      ).join('');
      uploadStatus.textContent = '';
    }

    function formatSize(bytes) {
      if (bytes < 1024) return bytes + ' B';
      if (bytes < 1024 * 1024) return (bytes/1024).toFixed(1) + ' KB';
      return (bytes/(1024*1024)).toFixed(1) + ' MB';
    }

    form.addEventListener('submit', async e => {
      e.preventDefault();
      const files = Array.from(fileInput.files);
      if (!files.length) {
        uploadStatus.textContent = 'Please select at least one file.';
        uploadStatus.className = 'status-err';
        return;
      }
      submitBtn.disabled = true;
      submitBtn.textContent = 'Uploading...';
      submitBtn.classList.add('loading');
      uploadLog.innerHTML = '';
      let ok = 0;

      for (const file of files) {
        uploadStatus.textContent = 'Uploading ' + file.name + '…';
        uploadStatus.className = '';
        try {
          const res = await fetch('/upload', {
            method: 'POST',
            headers: { 'x-filename': encodeURIComponent(file.name) },
            body: file
          });
          const item = document.createElement('div');
          item.className = 'log-item';
          if (res.ok) {
            ok++;
            item.innerHTML = '<span class="check">✓</span>' + file.name;
          } else {
            item.innerHTML = '<span class="err">✗</span>' + file.name + ' – server error';
          }
          uploadLog.appendChild(item);
        } catch (err) {
          const item = document.createElement('div');
          item.className = 'log-item';
          item.innerHTML = '<span class="err">✗</span>' + file.name + ' – network error';
          uploadLog.appendChild(item);
        }
      }

      submitBtn.disabled = false;
      submitBtn.classList.remove('loading');
      submitBtn.textContent = 'Upload More';

      if (ok === files.length) {
        uploadStatus.textContent = '✓ All ' + ok + ' file(s) uploaded successfully!';
        uploadStatus.className = 'status-ok';
        fileInput.value = '';
        selectedFilesDiv.innerHTML = '';
      } else {
        uploadStatus.textContent = ok + ' of ' + files.length + ' uploaded.';
        uploadStatus.className = 'status-err';
      }
    });
  })();
  </script>
</body>
</html>`;
}

export function sendDashboardPage(opts: {
  qrDataUrl: string;
  serverUrl: string;
  files: string[];
}): string {
  const fileItems = opts.files
    .map((f, i) => {
      const name = path.basename(f);
      return `<a class="file-dl-item" href="${opts.serverUrl}file/${i}" download="${name}">
        <span class="file-icon">📄</span>
        <span class="file-name">${name}</span>
        <span class="dl-arrow">↓</span>
      </a>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>QRCP – Send</title>
  <style>${baseStyle}</style>
</head>
<body>
  <nav>
    <div class="nav-brand">📡 <span>QRCP</span> Server</div>
    <div class="nav-links">
      <a class="nav-link" href="/">Receive</a>
      <a class="nav-link active" href="/send">Send</a>
    </div>
  </nav>
  <div class="page">
    <div class="card">
      <div class="card-title">📤 Send Files</div>
      <div class="card-subtitle">Scan the QR code on your phone to download the files below.</div>

      <div style="display:flex;flex-direction:column;align-items:center;text-align:center;">
        <div class="qr-wrap">
          <img src="${opts.qrDataUrl}" alt="QR Code" />
        </div>
        <div class="badge ready">
          <span class="badge-dot"></span>
          <span>Ready to send</span>
        </div>
        <div class="url-row" style="width:100%;">
          <span class="label">URL</span>
          <a href="${opts.serverUrl}send/files" target="_blank" style="color:#6366f1;">${opts.serverUrl}send/files</a>
        </div>
      </div>

      <hr class="divider">
      <div style="font-size:13px;color:#555;margin-bottom:12px;text-transform:uppercase;letter-spacing:0.5px;">Files (${opts.files.length})</div>
      <div class="file-dl-list">${fileItems}</div>
    </div>
  </div>
</body>
</html>`;
}

export function sendFilesPage(opts: {
  files: string[];
  serverUrl: string;
}): string {
  const fileItems = opts.files
    .map((f, i) => {
      const name = path.basename(f);
      return `<a class="file-dl-item" href="/file/${i}" download="${name}">
        <span class="file-icon">📄</span>
        <span class="file-name">${name}</span>
        <span class="dl-arrow">↓</span>
      </a>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>QRCP Download</title>
  <style>${baseStyle}
    .page { padding: 20px; }
  </style>
</head>
<body>
  <div class="page">
    <div class="card">
      <div class="card-title">📥 Download Files</div>
      <div class="card-subtitle">Tap a file to download it to your device.</div>
      <div class="file-dl-list">${fileItems}</div>
    </div>
  </div>
</body>
</html>`;
}
