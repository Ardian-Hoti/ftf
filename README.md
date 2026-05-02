# FTF — Fast Transfer Files 🚀

A lightweight, standalone Express.js server for ultra-fast file transfers between devices over local Wi-Fi. Inspired by the logic of `qrcp`, but built to run as a persistent background service.

**No internet required.** As long as your devices are on the same Wi-Fi network, you can beam files directly between them.

---

### 📥 Quick Download (Windows)

**Not a developer?** You don't need to install Node.js or run any commands.

1. Go to the [**Releases**](https://github.com/Ardian-Hoti/ftf/releases/latest) page.
2. Download `ftf-server.exe`.
3. Double-click to run—your QR code will appear instantly.

---

## Why FTF?

- ⚡ **No Cables:** Transfer files via simple QR codes or local URLs.
- 🌐 **Offline First:** Works perfectly even when your internet is down.
- 🛠️ **Persistent:** Unlike one-off CLI tools, FTF stays running so you can send/receive files whenever you need.
- 📱 **Cross-Platform:** Works between any device with a browser (iOS, Android, Mac, Windows, Linux).

## Manual Install (Developers)

If you prefer to run from source:

```bash
git clone https://github.com/Ardian-Hoti/ftf.git
cd ftf
npm install
npm run build
```

## Usage

### 🚀 Start the Server

Run the server to handle receiving files (Phone → Computer):

```bash
node dist/server.js
```

Open the dashboard at **http://localhost:3333** to view transfer activity, or scan the QR code printed in the terminal to start uploading from your mobile device.

### 📤 Send specific files (Computer → Phone)

```bash
node dist/server.js send /path/to/file1.pdf /path/to/image.png
```

This generates a unique download page for your mobile device.

## Configuration

You can customize the behavior using environment variables:

| Variable       | Default       | Description                         |
| -------------- | ------------- | ----------------------------------- |
| `PORT`         | `3333`        | Port to listen on                   |
| `DOWNLOAD_DIR` | `~/Downloads` | Directory where received files land |

**Example:**

```bash
PORT=8080 DOWNLOAD_DIR=~/Desktop node dist/server.js
```

## API Reference

| Method | Path              | Description                               |
| ------ | ----------------- | ----------------------------------------- |
| GET    | `/`               | Receive dashboard (Status + Activity Log) |
| GET    | `/upload`         | Mobile upload interface                   |
| POST   | `/upload`         | Upload endpoint (Raw body + `x-filename`) |
| GET    | `/send`           | Send dashboard (QR + active file list)    |
| GET    | `/send/files`     | Mobile download interface                 |
| GET    | `/file/:idx`      | Download a specific file by index         |
| GET    | `/api/events`     | SSE stream for real-time activity updates |
| POST   | `/api/send-files` | Update the file list at runtime via JSON  |

## Development

```bash
# Start with hot reload
npm run dev

# Start in "send" mode with hot reload
npm run dev -- send /path/to/file
```

---

License: MIT
