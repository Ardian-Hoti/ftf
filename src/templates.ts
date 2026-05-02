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
  <title>FTF – Receive</title>
  <style>${baseStyle}</style>
</head>
<body>
  <nav>
    <div class="nav-brand">📡 <span>FTF</span> Server</div>
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
  <title>FTF Upload</title>
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

export function sendDashboardPage(): string {
	return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FTF – Send</title>
  <style>${baseStyle}
    /* ---- Two-step send flow ---- */
    #stepPick  { display: block; }
    #stepQR    { display: none;  }

    .qr-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    /* staged file list */
    .staged-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
    .staged-item {
      display: flex;
      align-items: center;
      gap: 10px;
      background: #111;
      border: 1px solid #2a2a2a;
      border-radius: 10px;
      padding: 10px 14px;
      font-size: 13px;
      color: #ccc;
    }
    .staged-item .staged-name { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .staged-item .staged-size { color: #555; font-size: 12px; white-space: nowrap; }
    .staged-item .remove-btn {
      background: none;
      border: none;
      color: #555;
      cursor: pointer;
      font-size: 16px;
      padding: 0 4px;
      line-height: 1;
      width: auto;
      transition: color 0.2s;
    }
    .staged-item .remove-btn:hover { color: #ef4444; }

    .btn-row { display: flex; gap: 10px; }
    .btn-row .btn { flex: 1; }
    .btn-secondary {
      background: #2a2a2a;
      color: #ccc;
      border: 1px solid #3a3a3a;
    }
    .btn-secondary:hover:not(:disabled) {
      background: #333;
      transform: translateY(-1px);
    }

    /* upload progress */
    .progress-wrap {
      background: #111;
      border-radius: 8px;
      height: 6px;
      overflow: hidden;
      margin-bottom: 16px;
    }
    .progress-bar {
      height: 100%;
      background: #6366f1;
      width: 0%;
      transition: width 0.3s ease;
      border-radius: 8px;
    }
    #uploadProgress { display: none; }
    #progressLabel { font-size: 13px; color: #777; margin-bottom: 8px; }
  </style>
</head>
<body>
  <nav>
    <div class="nav-brand">📡 <span>FTF</span> Server</div>
    <div class="nav-links">
      <a class="nav-link" href="/">Receive</a>
      <a class="nav-link active" href="/send">Send</a>
    </div>
  </nav>
  <div class="page">
    <div class="card">

      <!-- STEP 1: pick files -->
      <div id="stepPick">
        <div class="card-title">📤 Send Files</div>
        <div class="card-subtitle">Select the files you want to share, then generate a QR code for your phone to scan and download them.</div>

        <div class="drop-zone" id="dropZone">
          <input type="file" id="fileInput" multiple />
          <div class="drop-icon">📂</div>
          <div class="drop-text"><strong>Choose files</strong> or drag &amp; drop</div>
        </div>

        <div class="staged-list" id="stagedList"></div>

        <div id="uploadProgress">
          <div id="progressLabel">Preparing…</div>
          <div class="progress-wrap"><div class="progress-bar" id="progressBar"></div></div>
        </div>

        <div class="btn-row">
          <button class="btn btn-primary" id="generateBtn" disabled>Generate QR Code</button>
        </div>
      </div>

      <!-- STEP 2: QR code -->
      <div id="stepQR">
        <div class="card-title">📱 Scan to Download</div>
        <div class="card-subtitle">Scan this QR code from your phone to open the download page.</div>

        <div class="qr-section">
          <div class="qr-wrap">
            <img id="qrImg" src="" alt="QR Code" />
          </div>
          <div class="badge ready">
            <span class="badge-dot"></span>
            <span id="qrFileCount"></span>
          </div>
          <div class="url-row" style="width:100%;">
            <span class="label">URL</span>
            <a id="qrLink" href="#" target="_blank" style="color:#6366f1;"></a>
          </div>
        </div>

        <hr class="divider">
        <div style="font-size:13px;color:#555;margin-bottom:12px;text-transform:uppercase;letter-spacing:0.5px;" id="qrFilesLabel"></div>
        <div class="staged-list" id="qrFileList"></div>

        <button class="btn btn-secondary" id="resetBtn" style="margin-top:8px;">← Share Different Files</button>
      </div>

    </div>
  </div>

  <script>
  (() => {
    const fileInput    = document.getElementById('fileInput');
    const dropZone     = document.getElementById('dropZone');
    const stagedList   = document.getElementById('stagedList');
    const generateBtn  = document.getElementById('generateBtn');
    const stepPick     = document.getElementById('stepPick');
    const stepQR       = document.getElementById('stepQR');
    const qrImg        = document.getElementById('qrImg');
    const qrLink       = document.getElementById('qrLink');
    const qrFileCount  = document.getElementById('qrFileCount');
    const qrFilesLabel = document.getElementById('qrFilesLabel');
    const qrFileList   = document.getElementById('qrFileList');
    const resetBtn     = document.getElementById('resetBtn');
    const uploadProgress = document.getElementById('uploadProgress');
    const progressBar  = document.getElementById('progressBar');
    const progressLabel= document.getElementById('progressLabel');

    let stagedFiles = []; // { file, id }
    let nextId = 0;

    function formatSize(b) {
      if (b < 1024) return b + ' B';
      if (b < 1024*1024) return (b/1024).toFixed(1) + ' KB';
      return (b/(1024*1024)).toFixed(1) + ' MB';
    }

    function renderStaged() {
      stagedList.innerHTML = stagedFiles.map(({file, id}) =>
        '<div class="staged-item" data-id="' + id + '">' +
          '<span>📄</span>' +
          '<span class="staged-name">' + file.name + '</span>' +
          '<span class="staged-size">' + formatSize(file.size) + '</span>' +
          '<button class="remove-btn" data-id="' + id + '" title="Remove">×</button>' +
        '</div>'
      ).join('');
      generateBtn.disabled = stagedFiles.length === 0;
    }

    function addFiles(fileList) {
      for (const f of fileList) {
        // avoid exact duplicates by name+size
        const dup = stagedFiles.some(s => s.file.name === f.name && s.file.size === f.size);
        if (!dup) stagedFiles.push({ file: f, id: nextId++ });
      }
      renderStaged();
    }

    // File input
    fileInput.addEventListener('change', () => { addFiles(fileInput.files); fileInput.value = ''; });

    // Drag & drop
    ['dragenter','dragover','dragleave','drop'].forEach(ev =>
      dropZone.addEventListener(ev, e => { e.preventDefault(); e.stopPropagation(); })
    );
    ['dragenter','dragover'].forEach(ev => dropZone.addEventListener(ev, () => dropZone.classList.add('drag-over')));
    ['dragleave','drop'].forEach(ev => dropZone.addEventListener(ev, () => dropZone.classList.remove('drag-over')));
    dropZone.addEventListener('drop', e => addFiles(e.dataTransfer.files));

    // Remove individual file
    stagedList.addEventListener('click', e => {
      const btn = e.target.closest('.remove-btn');
      if (!btn) return;
      const id = parseInt(btn.dataset.id, 10);
      stagedFiles = stagedFiles.filter(s => s.id !== id);
      renderStaged();
    });

    // Generate QR – upload files to server, get back a session URL
    generateBtn.addEventListener('click', async () => {
      if (!stagedFiles.length) return;
      generateBtn.disabled = true;
      uploadProgress.style.display = 'block';

      const total = stagedFiles.length;
      let done = 0;

      // Upload each file one by one
      for (const { file } of stagedFiles) {
        progressLabel.textContent = 'Uploading ' + (done + 1) + ' of ' + total + ': ' + file.name;
        progressBar.style.width = Math.round((done / total) * 100) + '%';
        try {
          await fetch('/api/send-stage', {
            method: done === 0 ? 'POST' : 'PUT',  // POST resets session, PUT appends
            headers: { 'x-filename': encodeURIComponent(file.name) },
            body: file
          });
        } catch (err) {
          progressLabel.textContent = 'Error uploading ' + file.name;
          generateBtn.disabled = false;
          return;
        }
        done++;
        progressBar.style.width = Math.round((done / total) * 100) + '%';
      }

      progressLabel.textContent = 'Generating QR…';
      progressBar.style.width = '100%';

      // Get QR data from server
      const res = await fetch('/api/send-qr');
      const data = await res.json();

      // Show step 2
      qrImg.src = data.qrDataUrl;
      qrLink.href = data.url;
      qrLink.textContent = data.url;
      qrFileCount.textContent = total + ' file' + (total !== 1 ? 's' : '') + ' ready';
      qrFilesLabel.textContent = 'Files (' + total + ')';
      qrFileList.innerHTML = stagedFiles.map(({file}) =>
        '<div class="staged-item"><span>📄</span><span class="staged-name">' + file.name + '</span><span class="staged-size">' + formatSize(file.size) + '</span></div>'
      ).join('');

      uploadProgress.style.display = 'none';
      stepPick.style.display = 'none';
      stepQR.style.display = 'block';
    });

    // Reset
    resetBtn.addEventListener('click', async () => {
      await fetch('/api/send-stage', { method: 'DELETE' });
      stagedFiles = [];
      renderStaged();
      stepQR.style.display = 'none';
      stepPick.style.display = 'block';
      generateBtn.disabled = true;
    });
  })();
  </script>
</body>
</html>`;
}

export function sendFilesPage(opts: {
	files: { name: string; idx: number; size: number }[];
}): string {
	const fileItems = opts.files
		.map(({ name, idx, size }) => {
			const kb =
				size < 1024
					? `${size} B`
					: size < 1024 * 1024
						? `${(size / 1024).toFixed(1)} KB`
						: `${(size / (1024 * 1024)).toFixed(1)} MB`;
			return `<div class="file-dl-item">
        <span class="file-icon">📄</span>
        <span class="file-name">${name}<br><span style="color:#555;font-size:12px;">${kb}</span></span>
        <a class="dl-btn" href="/file/${idx}" download="${name}">↓ Download</a>
      </div>`;
		})
		.join("");

	const hasMultiple = opts.files.length > 1;

	return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FTF Download</title>
  <style>${baseStyle}
    .page { padding: 20px; min-height: 100vh; }
    .file-dl-item {
      display: flex;
      align-items: center;
      gap: 12px;
      background: #111;
      border: 1px solid #2a2a2a;
      border-radius: 10px;
      padding: 14px 16px;
      margin-bottom: 8px;
      font-size: 14px;
      color: #ccc;
    }
    .file-dl-item .file-name { flex: 1; overflow: hidden; text-overflow: ellipsis; line-height: 1.4; }
    .dl-btn {
      background: #6366f1;
      color: #fff;
      text-decoration: none;
      padding: 8px 14px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      white-space: nowrap;
      flex-shrink: 0;
      transition: background 0.2s;
    }
    .dl-btn:hover { background: #4f46e5; }
    .dl-all-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      background: #6366f1;
      color: #fff;
      text-decoration: none;
      padding: 15px 24px;
      border-radius: 12px;
      font-size: 15px;
      font-weight: 600;
      width: 100%;
      margin-top: 8px;
      margin-bottom: 24px;
      transition: background 0.2s, transform 0.2s;
      box-sizing: border-box;
    }
    .dl-all-btn:hover { background: #4f46e5; transform: translateY(-1px); }
    .divider { border: none; border-top: 1px solid #2a2a2a; margin: 20px 0; }
    .section-label { font-size: 12px; color: #555; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; }
  </style>
</head>
<body>
  <div class="page">
    <div class="card">
      <div class="card-title">📥 Download Files</div>
      <div class="card-subtitle">${opts.files.length} file${opts.files.length !== 1 ? "s" : ""} ready to download.</div>

      ${
			hasMultiple
				? `<a class="dl-all-btn" href="/file/all.zip" download="fTF-files.zip">⬇ Download All (zip)</a>
      <hr class="divider">
      <div class="section-label">Or download individually</div>`
				: ""
		}

      <div>${fileItems}</div>
    </div>
  </div>
</body>
</html>`;
}
