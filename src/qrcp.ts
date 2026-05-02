import { networkInterfaces, homedir } from "os";
import QRCode from "qrcode";
import path from "path";
import fs from "fs";
import { IncomingMessage } from "http";

export const defaultDownloadDir = path.join(
	// homedir(),
	"C:/Users/Ardian/Desktop/camera/snapchat/video",
);

export function getLocalIp(): string {
	const nets = networkInterfaces();
	for (const name of Object.keys(nets)) {
		for (const net of nets[name]!) {
			if (net.family === "IPv4" && !net.internal) {
				return net.address;
			}
		}
	}
	return "localhost";
}

export async function generateQRCode(url: string): Promise<string> {
	return QRCode.toDataURL(url);
}

export async function generateQRCodeTerminal(url: string): Promise<void> {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const qrcodeTerminal = require("qrcode-terminal") as {
		generate: (
			text: string,
			opts: { small: boolean },
			cb: () => void,
		) => void;
	};
	return new Promise((resolve) => {
		qrcodeTerminal.generate(url, { small: true }, resolve);
	});
}

export function decodeAndSanitizeFilename(rawName: string | undefined): {
	displayName: string;
	safeName: string;
} {
	const fallback = "received_file";
	if (!rawName) return { displayName: fallback, safeName: fallback };

	let decoded = rawName;
	try {
		decoded = decodeURIComponent(rawName);
	} catch {
		// ignore
	}

	const stripped = decoded.replace(/[\0]/g, "").trim();
	const normalized = stripped.replace(/[\\/]+/g, "/");
	const base = path.posix.basename(normalized);
	const cleaned = base.replace(/[<>:"/\\|?*]/g, "_");
	const safeName = cleaned || fallback;
	return { displayName: safeName, safeName };
}

export async function writeRequestToFile(
	req: IncomingMessage,
	destinationPath: string,
): Promise<void> {
	await new Promise<void>((resolve, reject) => {
		const fileStream = fs.createWriteStream(destinationPath);
		const cleanup = () => {
			req.removeListener("error", onError);
			fileStream.removeListener("error", onError);
			fileStream.removeListener("finish", onFinish);
		};
		const onFinish = () => {
			cleanup();
			resolve();
		};
		const onError = (err: Error) => {
			cleanup();
			reject(err);
		};
		req.on("error", onError);
		fileStream.on("error", onError);
		fileStream.on("finish", onFinish);
		req.pipe(fileStream);
	});
}

export async function fallbackRemove(filePath: string): Promise<void> {
	try {
		await fs.promises.rm(filePath, { force: true });
	} catch {
		// ignore
	}
}
