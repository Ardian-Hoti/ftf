import express, { Request, Response } from "express";
import path from "path";
import fs from "fs";
import { homedir } from "os";
import {
  getLocalIp,
  generateQRCode,
  generateQRCodeTerminal,
  decodeAndSanitizeFilename,
  writeRequestToFile,
  fallbackRemove,
  defaultDownloadDir,
} from "./qrcp";
import {
  dashboardPage,
  uploadPage,
  sendDashboardPage,
  sendFilesPage,
} from "./templates";

// ── Config from env / args ────────────────────────────────────────────────────
const PORT = parseInt(process.env.PORT ?? "3333", 10);
const DOWNLOAD_DIR = process.env.DOWNLOAD_DIR
  ? resolveDir(process.env.DOWNLOAD_DIR)
  : defaultDownloadDir;

function resolveDir(p: string): string {
  if (p === "~") return homedir();
  if (p.startsWith("~/")) return path.join(homedir(), p.slice(2));
  return p;
}

// ── SSE event bus ─────────────────────────────────────────────────────────────
type SSEClient = Response;
const sseClients: Set<SSEClient> = new Set();

function broadcast(event: string, data: unknown) {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const client of sseClients) {
    try {
      client.write(payload);
    } catch {
      sseClients.delete(client);
    }
  }
}

// ── Shared state for send mode ────────────────────────────────────────────────
let sendFiles: string[] = [];

// ── App ───────────────────────────────────────────────────────────────────────
const app = express();

// Disable x-powered-by header
app.disable("x-powered-by");

// ── SSE endpoint ──────────────────────────────────────────────────────────────
app.get("/api/events", (req: Request, res: Response) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.flushHeaders();

  sseClients.add(res);

  req.on("close", () => {
    sseClients.delete(res);
  });
});

// ── Receive mode routes ───────────────────────────────────────────────────────

// Dashboard – shows QR code pointing to /upload
app.get("/", async (_req: Request, res: Response) => {
  const ip = getLocalIp();
  const baseUrl = `http://${ip}:${PORT}/`;
  const qrDataUrl = await generateQRCode(baseUrl + "upload");

  res.send(
    dashboardPage({
      qrDataUrl,
      serverUrl: baseUrl,
      downloadDir: DOWNLOAD_DIR,
      mode: "receive",
    })
  );
});

// Upload page – served to mobile device
app.get("/upload", (_req: Request, res: Response) => {
  const ip = getLocalIp();
  res.send(uploadPage({ serverUrl: `http://${ip}:${PORT}/` }));
});

// Receive a file upload (raw body with x-filename header)
app.post("/upload", async (req: Request, res: Response) => {
  const { displayName, safeName } = decodeAndSanitizeFilename(
    req.headers["x-filename"] as string | undefined
  );
  const timestamp = Date.now();
  const fileName = `${timestamp}_${safeName}`;
  const filePath = path.join(DOWNLOAD_DIR, fileName);

  try {
    await fs.promises.mkdir(DOWNLOAD_DIR, { recursive: true });
    await writeRequestToFile(req, filePath);
    console.log(`[receive] ✓ ${displayName} → ${filePath}`);
    broadcast("received", { fileName: displayName });
    res.status(200).send("File received");
  } catch (err) {
    console.error("[receive] error:", err);
    await fallbackRemove(filePath);
    if (!res.headersSent) res.status(500).send("Error saving file");
  }
});

// Track device connections to /upload page
app.use((req: Request, _res, next) => {
  if (req.path === "/upload" && req.method === "GET") {
    const ip = req.ip ?? req.socket?.remoteAddress ?? "unknown";
    broadcast("connected", { ip });
    console.log(`[receive] device connected from ${ip}`);
  }
  next();
});

// ── Send mode routes ──────────────────────────────────────────────────────────

// Dashboard – shows QR pointing to /send/files
app.get("/send", async (_req: Request, res: Response) => {
  if (!sendFiles.length) {
    res.send(`<!DOCTYPE html><html><body style="font-family:sans-serif;background:#0f0f0f;color:#fff;padding:40px;text-align:center;">
      <h2>No files loaded</h2>
      <p style="color:#777;">Start the server with file paths:<br>
      <code style="background:#222;padding:4px 10px;border-radius:6px;">node dist/server.js send /path/to/file1 /path/to/file2</code></p>
      <p style="color:#777;margin-top:16px;">Or use the <a href="/" style="color:#6366f1;">Receive</a> tab instead.</p>
    </body></html>`);
    return;
  }
  const ip = getLocalIp();
  const baseUrl = `http://${ip}:${PORT}/`;
  const qrDataUrl = await generateQRCode(baseUrl + "send/files");
  res.send(sendDashboardPage({ qrDataUrl, serverUrl: baseUrl, files: sendFiles }));
});

// Mobile-facing download page
app.get("/send/files", (_req: Request, res: Response) => {
  const ip = getLocalIp();
  res.send(sendFilesPage({ files: sendFiles, serverUrl: `http://${ip}:${PORT}/` }));
});

// File download
app.get("/file/:idx", (req: Request, res: Response) => {
  const idx = parseInt(req.params.idx, 10);
  if (isNaN(idx) || !sendFiles[idx]) {
    res.status(404).send("Not found");
    return;
  }
  const filePath = sendFiles[idx];
  const fileName = path.basename(filePath);
  fs.promises
    .stat(filePath)
    .then(() => {
      res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
      const stream = fs.createReadStream(filePath);
      stream.on("error", () => {
        if (!res.headersSent) res.status(500).send("Error reading file");
      });
      stream.pipe(res);
      res.on("finish", () => {
        console.log(`[send] ✓ downloaded: ${fileName}`);
      });
    })
    .catch(() => res.status(404).send("File not found"));
});

// ── API: update send files at runtime ─────────────────────────────────────────
app.post("/api/send-files", express.json(), (req: Request, res: Response) => {
  const { files } = req.body as { files?: string[] };
  if (!Array.isArray(files)) {
    res.status(400).json({ error: "files must be an array of paths" });
    return;
  }
  const valid = files.filter((f) => {
    try {
      return fs.existsSync(f);
    } catch {
      return false;
    }
  });
  sendFiles = valid;
  console.log(`[send] files updated (${valid.length}):`, valid);
  res.json({ ok: true, count: valid.length, files: valid });
});

// ── Start ─────────────────────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);
  const mode = args[0]; // "receive" | "send" | undefined

  if (mode === "send") {
    // Remaining args are file paths
    const filePaths = args.slice(1);
    if (!filePaths.length) {
      console.error(
        "Usage: node dist/server.js send <file1> [file2] ...\n" +
        "       Paths can be absolute or relative."
      );
      process.exit(1);
    }
    sendFiles = filePaths.map((p) => path.resolve(p));
    const missing = sendFiles.filter((p) => !fs.existsSync(p));
    if (missing.length) {
      console.error("The following files were not found:\n" + missing.join("\n"));
      process.exit(1);
    }
    console.log(`[send] Loaded ${sendFiles.length} file(s):`);
    sendFiles.forEach((f) => console.log("  •", path.basename(f)));
  }

  app.listen(PORT, "0.0.0.0", async () => {
    const ip = getLocalIp();
    const baseUrl = `http://${ip}:${PORT}`;

    console.log("\n╔══════════════════════════════════════╗");
    console.log("║           QRCP Server                ║");
    console.log("╚══════════════════════════════════════╝");
    console.log(`  Local:    http://localhost:${PORT}`);
    console.log(`  Network:  ${baseUrl}`);

    if (mode === "send" && sendFiles.length) {
      const qrUrl = `${baseUrl}/send/files`;
      console.log(`\n  Send URL: ${qrUrl}`);
      console.log("\n  Scan to download:\n");
      await generateQRCodeTerminal(qrUrl);
      console.log(`\n  Or open: ${baseUrl}/send\n`);
    } else {
      const qrUrl = `${baseUrl}/upload`;
      console.log(`\n  Receive URL: ${qrUrl}`);
      console.log("\n  Scan to upload:\n");
      await generateQRCodeTerminal(qrUrl);
      console.log(`\n  Or open: ${baseUrl}\n`);
      console.log(`  Download dir: ${DOWNLOAD_DIR}`);
    }

    console.log("\n  Press Ctrl+C to stop\n");
  });
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
