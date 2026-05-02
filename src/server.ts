import express, { Request, Response } from "express";
import path from "path";
import fs from "fs";
import os, { homedir } from "os";
import archiver from "archiver";
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

// ── Send session: staged files uploaded by the PC browser ────────────────────
type StagedFile = { name: string; tmpPath: string; size: number; idx: number };
let sendSession: StagedFile[] = [];
const SEND_TMP_DIR = path.join(os.tmpdir(), "qrcp-send");

async function clearSendSession() {
	for (const f of sendSession) {
		try {
			await fs.promises.rm(f.tmpPath, { force: true });
		} catch {
			/* ignore */
		}
	}
	sendSession = [];
}

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
		}),
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
		req.headers["x-filename"] as string | undefined,
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

// PC dashboard – file picker UI (step 1 & 2)
app.get("/send", (_req: Request, res: Response) => {
	res.send(sendDashboardPage());
});

// POST  /api/send-stage  – start a new session, upload first file (raw body)
// PUT   /api/send-stage  – append another file to current session
// DELETE /api/send-stage – clear session
app.post("/api/send-stage", async (req: Request, res: Response) => {
	// Reset session then add first file
	await clearSendSession();
	await fs.promises.mkdir(SEND_TMP_DIR, { recursive: true });
	await stageFile(req, res);
});

app.put("/api/send-stage", async (req: Request, res: Response) => {
	await fs.promises.mkdir(SEND_TMP_DIR, { recursive: true });
	await stageFile(req, res);
});

app.delete("/api/send-stage", async (_req: Request, res: Response) => {
	await clearSendSession();
	res.json({ ok: true });
});

async function stageFile(req: Request, res: Response) {
	const { displayName, safeName } = decodeAndSanitizeFilename(
		req.headers["x-filename"] as string | undefined,
	);
	const idx = sendSession.length;
	const tmpPath = path.join(SEND_TMP_DIR, `${Date.now()}_${idx}_${safeName}`);
	try {
		await writeRequestToFile(req, tmpPath);
		const stat = await fs.promises.stat(tmpPath);
		sendSession.push({ name: displayName, tmpPath, size: stat.size, idx });
		console.log(
			`[send] staged (${idx}): ${displayName} (${stat.size} bytes)`,
		);
		res.json({ ok: true, idx, name: displayName });
	} catch (err) {
		await fallbackRemove(tmpPath);
		console.error("[send] stage error:", err);
		if (!res.headersSent)
			res.status(500).json({ error: "Failed to stage file" });
	}
}

// GET /api/send-qr – returns QR data URL + URL for current session
app.get("/api/send-qr", async (_req: Request, res: Response) => {
	const ip = getLocalIp();
	const url = `http://${ip}:${PORT}/send/files`;
	const qrDataUrl = await generateQRCode(url);
	res.json({ qrDataUrl, url });
});

// Mobile-facing download page
app.get("/send/files", (_req: Request, res: Response) => {
	if (!sendSession.length) {
		res.status(404).send(
			"No files available. Go back to the computer and select files first.",
		);
		return;
	}
	res.send(
		sendFilesPage({
			files: sendSession.map((f) => ({
				name: f.name,
				idx: f.idx,
				size: f.size,
			})),
		}),
	);
});

// Individual file download
app.get("/file/:idx", (req: Request, res: Response) => {
	if (req.params.idx === "all.zip") {
		// Download all as zip
		if (!sendSession.length) {
			res.status(404).send("No files");
			return;
		}
		res.setHeader("Content-Type", "application/zip");
		res.setHeader(
			"Content-Disposition",
			'attachment; filename="qrcp-files.zip"',
		);
		const archive = archiver("zip", { zlib: { level: 6 } });
		archive.on("error", (err) => {
			console.error("[send] zip error:", err);
			if (!res.headersSent) res.status(500).send("Zip error");
		});
		archive.pipe(res);
		for (const f of sendSession) {
			archive.file(f.tmpPath, { name: f.name });
		}
		archive.finalize().then(() => console.log("[send] ✓ all.zip downloaded"));
		return;
	}

	const idx = parseInt(req.params.idx, 10);
	const staged = sendSession.find((f) => f.idx === idx);
	if (isNaN(idx) || !staged) {
		res.status(404).send("Not found");
		return;
	}

	res.setHeader(
		"Content-Disposition",
		`attachment; filename="${staged.name}"`,
	);
	const stream = fs.createReadStream(staged.tmpPath);
	stream.on("error", () => {
		if (!res.headersSent) res.status(500).send("Error reading file");
	});
	stream.pipe(res);
	res.on("finish", () => console.log(`[send] ✓ downloaded: ${staged.name}`));
});

// ── Start ─────────────────────────────────────────────────────────────────────
async function main() {
	// Ensure tmp dir exists
	await fs.promises.mkdir(SEND_TMP_DIR, { recursive: true });

	app.listen(PORT, "0.0.0.0", async () => {
		const ip = getLocalIp();
		const baseUrl = `http://${ip}:${PORT}`;

		console.log("\n╔══════════════════════════════════════╗");
		console.log("║           QRCP Server                ║");
		console.log("╚══════════════════════════════════════╝");
		console.log(`  Local:    http://localhost:${PORT}`);
		console.log(`  Network:  ${baseUrl}`);

		console.log(`\n  Receive URL: ${baseUrl}/upload`);
		console.log(`  Send URL:    ${baseUrl}/send`);
		console.log("\n  Scan to upload from phone:\n");
		await generateQRCodeTerminal(`${baseUrl}/upload`);
		console.log(`\n  Download dir: ${DOWNLOAD_DIR}`);
		console.log("\n  Press Ctrl+C to stop\n");
	});
}

main().catch((err) => {
	console.error("Fatal:", err);
	process.exit(1);
});
