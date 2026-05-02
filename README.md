# qrcp-server

Standalone Express.js version of the [QRCP Raycast extension](https://www.raycast.com/yohann84l/qrcp).
Runs persistently in the background — no need to keep Raycast open.

## Install

```bash
cd qrcp-server
npm install
npm run build
```

## Usage

### Receive files (phone → computer)

```bash
node dist/server.js
# or
node dist/server.js receive
```

Open the dashboard at **http://localhost:3333**, or scan the QR code printed in the terminal from your phone to upload files.

### Send files (computer → phone)

```bash
node dist/server.js send /path/to/file1.pdf /path/to/image.png
```

A QR code is printed in the terminal. Scan it from your phone to get a download page with all the listed files.

## Options

| Environment variable | Default         | Description                      |
|----------------------|-----------------|----------------------------------|
| `PORT`               | `3333`          | Port to listen on                |
| `DOWNLOAD_DIR`       | `~/Downloads`   | Where received files are saved   |

```bash
PORT=8080 DOWNLOAD_DIR=~/Desktop node dist/server.js
```

## Development (hot reload)

```bash
npm run dev
# or with a mode:
npm run dev -- send /path/to/file
```

## API

| Method | Path             | Description                                 |
|--------|------------------|---------------------------------------------|
| GET    | `/`              | Receive dashboard (QR + activity log)       |
| GET    | `/upload`        | Mobile upload page                          |
| POST   | `/upload`        | Upload a file (raw body + `x-filename` hdr) |
| GET    | `/send`          | Send dashboard (QR + file list)             |
| GET    | `/send/files`    | Mobile download page                        |
| GET    | `/file/:idx`     | Download file by index                      |
| GET    | `/api/events`    | SSE stream for live activity updates        |
| POST   | `/api/send-files`| Update the send file list at runtime (JSON) |
