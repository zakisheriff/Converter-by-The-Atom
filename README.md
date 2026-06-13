---
title: Converter by The Atom
emoji: 🔄
colorFrom: indigo
colorTo: purple
sdk: docker
pinned: true
license: mit
short_description: Convert files between 200+ formats for free
---

# Converter by The Atom

Convert files between 200+ formats for free — documents, images, video, audio, archives, and more.

## Features

- **Documents**: PDF, DOCX, ODT, RTF, TXT, HTML, EPUB (via LibreOffice)
- **Images**: PNG, JPG, WEBP, HEIC, RAW, SVG, and 20+ more (via ImageMagick)
- **Video**: MP4, MOV, MKV, AVI, WEBM with codec/bitrate/resolution controls (via FFmpeg)
- **Audio**: MP3, WAV, FLAC, AAC, OGG with bitrate/codec controls (via FFmpeg)
- **Archives**: ZIP, TAR, GZ, 7Z, RAR (via CLI tools)
- **PDF Tools**: Merge, compress, split, convert PDFs (via Ghostscript + pdftk)
- **Website Capture**: URL to PDF/PNG/JPG (via wkhtmltopdf)

## Stack

- Next.js 15 + React 19
- Liquid Glass UI (`@zakisheriff/liquid-glass`)
- Docker deployment on HuggingFace Spaces
- All conversion happens server-side — no external APIs, no tracking

## Local Development

```bash
npm install
npm run dev
```

## Production

```bash
npm run build
npm start
```
