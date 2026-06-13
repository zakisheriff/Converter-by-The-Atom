---
title: Converter Backend
emoji: 🔄
colorFrom: indigo
colorTo: purple
sdk: docker
app_port: 7860
---

# <div align="center">Converter by The Atom</div>

<div align="center">
<strong>100% Free, High-Performance File Converter — 200+ Formats</strong>
</div>

<br />

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react&logoColor=white)
![FFmpeg](https://img.shields.io/badge/FFmpeg-Latest-007800?style=for-the-badge&logo=ffmpeg&logoColor=white)
![LibreOffice](https://img.shields.io/badge/LibreOffice-Latest-18A303?style=for-the-badge&logo=libreoffice&logoColor=white)
![ImageMagick](https://img.shields.io/badge/ImageMagick-Latest-F8B800?style=for-the-badge&logo=imagemagick&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

<br />

<a href="https://converter.theatom.lk">
<img src="https://img.shields.io/badge/View%20Live%20Site-Click%20Here-0071e3?style=for-the-badge&logo=safari&logoColor=white" height="50" />
</a>

<br />
<br />

**[Visit Live Site: https://converter.theatom.lk](https://converter.theatom.lk)**

</div>

<br />

> **"Converting files between formats should be clean, direct, and free."**
>
> Converter by The Atom is a beautiful, self-hosted web app built for users who want to convert documents, images, videos, audio, and archives without dealing with ads, file size limits, or shady third-party services.

---

## 🌟 Vision

Converter by The Atom is designed with three core principles:

- **100% Free Forever**: No sign-ups, no subscription tiers, no file size limits, and zero ads.
- **Privacy First**: We don't track your conversions or store your files. Everything runs completely self-hosted and files are deleted after processing.
- **Sleek Premium UI**: An elegant layout with micro-interactions, smooth scrolling, and glassy panels that look great on any screen.

---

## ✨ Why Converter by The Atom?

Most file conversion websites are cluttered with ads, tracking cookies, fake download buttons, and file size caps.
Converter by The Atom focuses strictly on the conversion:

- Drop any file (documents, images, videos, audio, archives)
- Pick a target format from 200+ options grouped by category
- Adjust advanced options (quality, DPI, codec, bitrate, resolution, watermark)
- Directly download the converted file without third-party redirects

---

## 🎨 Product Design

- **Minimalist Aesthetic**
  A spacious, clutter-free dashboard centered entirely around the file drop zone.
- **Light Premium Interface**
  Styled using custom vanilla CSS modules featuring smooth design tokens, layered page backgrounds, and glassmorphic panels.
- **High-Radius Border System**
  Consistent use of the signature 35px rounded corners for a modern, tactile card look.
- **Fluid UI Animations**
  Responsive animations powered by Framer Motion and smooth kinetic inertia scrolling powered by Lenis.

---

## ⚙️ Robust Conversion Engine

- **LibreOffice Headless**
  Documents are processed directly on the server through LibreOffice for PDF, DOCX, ODT, RTF, TXT, HTML, EPUB, XLSX, CSV, PPTX conversions.
- **FFmpeg Media Processing**
  Video and audio conversions are handled by FFmpeg with full codec, bitrate, resolution, framerate, and sample rate controls.
- **ImageMagick Image Processing**
  Images are converted between PNG, JPG, WEBP, HEIC, RAW, SVG, and 20+ formats with resize, compress, watermark, and DPI controls.
- **Ghostscript & pdftk**
  PDF compression, merging, and optimization handled by Ghostscript and pdftk.
- **Live Server Progress**
  Track the uploading, converting, and completion steps in real-time through the Next.js API polling status routes.

---

## 🎯 Core Features

✅ **Drag & Drop Upload** — Drop any file or click to browse, supports multiple files at once  
✅ **200+ Format Support** — Documents, images, video, audio, archives, CAD/vector formats  
✅ **Smart Format Picker** — Target formats grouped by category, filtered by source type  
✅ **Advanced Options** — Quality, DPI, codec, bitrate, resolution, watermark, compression  
✅ **PDF Tools** — Merge, compress, split, convert, and protect PDF files  
✅ **Image Tools** — Resize, compress, watermark, crop, and optimize images  
✅ **Video Tools** — Change codec, bitrate, resolution, framerate, extract audio  
✅ **Audio Tools** — Change codec, bitrate, sample rate, channels, extract from video  
✅ **Archive Tools** — Create, extract, and convert ZIP, TAR, GZ, 7Z, RAR archives  
✅ **Website Capture** — Full-page screenshots of any URL as PDF, PNG, or JPG  
✅ **Real-Time Progress** — Track upload and conversion percentages in the UI  
✅ **Direct Browser Save** — Converted files are transferred directly to your browser  
✅ **SEO Optimized** — Built-in metadata, manifest, robots.txt, and sitemaps  
✅ **Custom Brand Identity** — Custom favicon, apple-touch-icons, and logos  
✅ **Vercel Analytics** — Production traffic and page view tracking integrated

---

## 🛡️ Bulletproof Free-Tier Safeguards

To prevent Out-Of-Memory (OOM) crashes, CPU locks, and resource abuse on the free Hugging Face container backend, we implemented a custom zero-cost resilience architecture:

- **In-Memory Job Queue (`utils/server/jobQueue.js`)**: Tracks all conversion tasks with automatic cleanup after 30 minutes, preventing memory leaks from accumulating job data.
- **Temp File Garbage Collection (`utils/server/fileHelpers.js`)**: Each conversion gets its own temp directory that is automatically cleaned up after completion or failure, preventing disk space exhaustion.
- **Async Non-Blocking Processing**: Conversions run asynchronously via `child_process.spawn`, keeping the Node.js event loop free for handling new requests.
- **Graceful Error Handling**: Every conversion pipeline catches errors at every stage and cleans up temp files, ensuring no orphaned processes or disk artifacts.

---

## 📁 Project Structure

```bash
converter/
├── app/
│   ├── api/
│   │   ├── convert/                        # File conversion endpoint
│   │   │   ├── route.js                    # POST: upload + convert
│   │   │   ├── status/[id]/route.js        # GET: poll job progress
│   │   │   └── download/[id]/route.js      # GET: download result
│   │   ├── pdf/route.js                    # PDF merge/compress/convert
│   │   └── website-capture/route.js        # URL to PDF/PNG/JPG
│   ├── convert/                            # Main conversion workspace
│   ├── pdf-tools/                          # PDF-specific tools
│   ├── image-tools/                        # Image conversion & editing
│   ├── video-tools/                        # Video conversion & editing
│   ├── audio-tools/                        # Audio conversion & editing
│   ├── archive-tools/                      # Archive create/extract
│   ├── website-capture/                    # URL screenshot tool
│   ├── settings/                           # Server setup requirements
│   ├── blog/                               # How-it-works guides
│   ├── layout.js                           # App shell layout + SEO metadata
│   ├── manifest.js                         # Web manifest definition
│   ├── robots.js                           # Robots.txt generator
│   └── sitemap.js                          # Sitemap generator
│
├── components/
│   ├── providers/
│   │   ├── ToastProvider.js                # Toast notification system
│   │   └── DepthModeProvider.js            # 3D/flat depth mode toggle
│   ├── AppShell.js                         # Layout framing with sidebar + topbar
│   ├── Topbar.js                           # Clean header with page titles
│   ├── Sidebar.js                          # Drawer navigation bar
│   ├── GlassCard.js                        # Reusable glassmorphic container
│   ├── HeroSection.js                      # Landing page file drop hero
│   ├── FileUploader.js                     # Drag-drop file upload zone
│   ├── ConversionCard.js                   # Per-file conversion UI
│   ├── FormatPicker.js                     # Target format selection grid
│   ├── AdvancedOptions.js                  # Collapsible quality/codec settings
│   ├── ConversionProgress.js               # Progress bar and status
│   ├── ToolPageShell.js                    # Reusable tool page layout
│   └── SmoothScrollProvider.js             # Lenis scroll configuration
│
├── data/
│   ├── formatMap.js                        # 200+ format registry with targets
│   └── siteContent.js                      # Site content and descriptions
│
├── utils/
│   └── server/
│       ├── conversionEngine.js             # Core CLI-based conversion logic
│       ├── jobQueue.js                     # In-memory job tracking
│       └── fileHelpers.js                  # Temp file management
│
├── public/
│   └── Logo.png                            # Project branding asset
│
├── Dockerfile                              # Multi-stage Docker config for HF Spaces
├── next.config.mjs                         # Next.js bundler and API config
├── package.json                            # Package dependencies
└── README.md                               # Project documentation
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18+ recommended)
- **FFmpeg**, **LibreOffice**, **ImageMagick**, **Ghostscript**, **pdftk**, **p7zip**, **wkhtmltopdf** installed and in the system PATH.

### 1. Clone the Repository

```bash
git clone https://github.com/zakisheriff/Converter-by-The-Atom.git
cd Converter-by-The-Atom
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure the Environment

Create a `.env.local` file if needed (optional — defaults work out of the box):

```env
# Port for the server (default: 3000 for dev, 7860 for Docker)
PORT=3000
```

### 4. Run the Development Server

```bash
npm run dev
```

Open **http://localhost:3000** in your browser.

---

## 🌐 Deployment Notes

To deploy the app for 100% free with no credit cards required:

### Hugging Face Spaces (Docker)

Deploy the full Next.js app inside a Docker container on a **Hugging Face Space**.

- **SDK**: Docker
- **Hardware**: Basic CPU (2 vCPU, 16 GB RAM) - 100% Free
- **Port**: `7860` (defined in the Dockerfile)

The Dockerfile automatically installs all required CLI tools:

```dockerfile
ffmpeg libreoffice imagemagick ghostscript pdftk p7zip-full wkhtmltopdf
```

---

## 📡 API Overview

### Convert File

- `POST /api/convert`
  Upload a file with target format and options.
  **Body** (multipart/form-data):
  ```
  file: <binary>
  targetFormat: "pdf"
  options: {"quality": 85, "dpi": 300}
  ```
  **Response**:
  ```json
  { "jobId": "uuid-...", "statusUrl": "/api/convert/status/uuid-..." }
  ```

### Job Status

- `GET /api/convert/status/[id]`
  Polls the conversion progress.
  **Response**:
  ```json
  { "id": "uuid-...", "status": "converting", "progress": 65 }
  ```

### Download Result

- `GET /api/convert/download/[id]`
  Downloads the converted file when complete.

### PDF Tools

- `POST /api/pdf`
  Merge, compress, or convert PDF files.
  **Body** (multipart/form-data):
  ```
  action: "merge" | "compress" | "convert"
  files: <binary>[]
  options: {"profile": "screen", "quality": 75}
  ```

### Website Capture

- `POST /api/website-capture`
  Capture a website URL as PDF, PNG, or JPG.
  **Body**:
  ```json
  { "url": "https://example.com", "format": "pdf" }
  ```

---

## ⚠️ Usage & License

This project is licensed under the MIT License.

_Disclaimer: Converter by The Atom should only be used to convert files you own or have permission to process. The authors are not responsible for any misuse of this tool._

---

<p align="center">
Made by <strong>The Atom</strong>
</p>

<p align="center">
<em>Built to make file conversion simpler, cleaner, and fully free.</em>
</p>
