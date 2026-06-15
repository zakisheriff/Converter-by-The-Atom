import { spawn } from "child_process";
import { rename } from "fs/promises";
import { basename, extname } from "path";
import {
  createTempDir,
  saveUploadedFile,
  getOutputPath,
  findConvertedFile,
  findFileWithExt,
  cleanupTempDir,
} from "./fileHelpers.js";

/**
 * Run a CLI command and return a promise.
 */
function runCommand(cmd, args, { cwd, onProgress } = {}) {
  return new Promise((resolve, reject) => {
    const proc = spawn(cmd, args, { cwd, stdio: ["pipe", "pipe", "pipe"] });
    let stderr = "";

    proc.stdout.on("data", (chunk) => {
      const text = chunk.toString();
      if (onProgress) onProgress(text);
    });

    proc.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
      if (onProgress) onProgress(chunk.toString());
    });

    proc.on("close", (code) => {
      if (code === 0) resolve({ stdout: "", stderr });
      else
        reject(
          new Error(`${cmd} exited with code ${code}: ${stderr.slice(-500)}`),
        );
    });

    proc.on("error", (err) => reject(err));
  });
}

/**
 * Parse FFmpeg progress from stderr output.
 */
function parseFfmpegProgress(text) {
  const timeMatch = text.match(/time=(\d+):(\d+):(\d+\.\d+)/);
  if (timeMatch) {
    const [, h, m, s] = timeMatch;
    return (parseFloat(h) * 3600 + parseFloat(m) * 60 + parseFloat(s)) * 1000;
  }
  return null;
}

// ─── DOCUMENT CONVERSION (LibreOffice) ─────────────────────────

async function convertDocument(inputPath, targetExt, options = {}) {
  const dir = basename(inputPath).replace(/\.[^.]+$/, "");
  const outDir = inputPath.replace(basename(inputPath), "");
  const srcExt = extname(inputPath).toLowerCase().replace(".", "");

  if (srcExt === "pdf" && (targetExt === "txt" || targetExt === "md")) {
    const { readFile, writeFile } = await import("fs/promises");
    const pdfBuffer = await readFile(inputPath);
    const pdfParse = (await import("pdf-parse")).default;
    const data = await pdfParse(pdfBuffer);
    
    let resultText = data.text;
    
    // Normalize text layout/newlines slightly
    if (targetExt === "md") {
      const lines = resultText.split("\n");
      const formattedLines = [];
      let lastLineEmpty = false;
      
      for (let line of lines) {
        line = line.trim();
        if (line === "") {
          if (!lastLineEmpty) {
            formattedLines.push("");
            lastLineEmpty = true;
          }
          continue;
        }
        
        lastLineEmpty = false;
        
        // Basic Markdown header formatting heuristics
        if (line.length > 3 && line.length < 60 && line === line.toUpperCase() && !line.match(/^[0-9\s\W]+$/)) {
          formattedLines.push(`## ${line}`);
        } else {
          formattedLines.push(line);
        }
      }
      resultText = formattedLines.join("\n");
    }
    
    const outputName = basename(inputPath).replace(/\.[^.]+$/, `.${targetExt}`);
    const outputPath = `${outDir}${outputName}`;
    await writeFile(outputPath, resultText, "utf8");
    return outputPath;
  }

  const args = [
    "--headless",
    "--convert-to",
    targetExt,
    "--outdir",
    outDir,
    inputPath,
  ];

  await runCommand("soffice", args, { cwd: outDir });

  // LibreOffice outputs to the same directory
  const outputName = basename(inputPath).replace(/\.[^.]+$/, `.${targetExt}`);
  const outputPath = `${outDir}${outputName}`;
  return outputPath;
}

// ─── IMAGE CONVERSION (ImageMagick) ────────────────────────────

async function convertImage(inputPath, targetExt, options = {}) {
  const dir = inputPath.replace(basename(inputPath), "");
  const outputPath = getOutputPath(dir, basename(inputPath), targetExt);

  const args = [inputPath];

  // Quality
  if (options.quality) {
    args.push("-quality", String(options.quality));
  }

  // Resize
  if (options.resize_width || options.resize_height) {
    const w = options.resize_width || "";
    const h = options.resize_height || "";
    args.push("-resize", `${w}x${h}`);
  }

  // Crop
  if (options.crop) {
    args.push("-crop", String(options.crop));
  }

  // DPI
  if (options.dpi) {
    args.push("-density", String(options.dpi));
  }

  // Strip metadata
  if (options.strip_metadata) {
    args.push("-strip");
  }

  // Watermark text
  if (options.watermark_text) {
    args.push(
      "-gravity",
      "SouthEast",
      "-fill",
      "rgba(255,255,255,0.5)",
      "-pointsize",
      "24",
      "-annotate",
      "+10+10",
      options.watermark_text,
    );
  }

  args.push(outputPath);

  // Try magick first (ImageMagick 7), fall back to convert (IM6)
  try {
    await runCommand("magick", args);
  } catch {
    await runCommand("convert", args);
  }

  return outputPath;
}

// ─── VIDEO CONVERSION (FFmpeg) ─────────────────────────────────

async function convertVideo(inputPath, targetExt, options = {}) {
  const dir = inputPath.replace(basename(inputPath), "");
  const outputPath = getOutputPath(dir, basename(inputPath), targetExt);

  const args = ["-y"];

  // Seek / Trim start
  if (options.trim_start) {
    args.push("-ss", options.trim_start);
  } else if (["jpg", "jpeg", "png", "webp"].includes(targetExt.toLowerCase())) {
    // For image thumbnails, extract frame at 1s mark if no trim start is specified
    args.push("-ss", "00:00:01");
  }

  args.push("-i", inputPath);

  // Trim duration
  if (options.trim_duration) {
    args.push("-t", String(options.trim_duration));
  }

  // If capturing a single frame thumbnail
  const isImageTarget = ["jpg", "jpeg", "png", "webp"].includes(targetExt.toLowerCase());
  if (isImageTarget) {
    args.push("-vframes", "1");
  } else {
    // Codec
    if (options.codec && options.codec !== "auto") {
      const codecMap = {
        h264: "libx264",
        h265: "libx265",
        vp9: "libvpx-vp9",
        av1: "libaom-av1",
      };
      args.push("-c:v", codecMap[options.codec] || options.codec);
    }

    // Quality (CRF)
    if (options.quality !== undefined && options.quality !== null) {
      args.push("-crf", String(options.quality));
    }

    // Bitrate
    if (options.bitrate) {
      args.push("-b:v", options.bitrate);
    }

    // Resolution
    if (options.resolution && options.resolution !== "auto") {
      args.push("-s", options.resolution);
    }

    // Frame rate
    if (options.framerate && options.framerate !== "auto") {
      args.push("-r", options.framerate);
    }

    // Audio bitrate
    if (options.audio_bitrate && options.audio_bitrate !== "auto") {
      args.push("-b:a", options.audio_bitrate);
    }
  }

  args.push(outputPath);

  await runCommand("ffmpeg", args, { cwd: dir });
  return outputPath;
}

// ─── AUDIO CONVERSION (FFmpeg) ─────────────────────────────────

async function convertAudio(inputPath, targetExt, options = {}) {
  const dir = inputPath.replace(basename(inputPath), "");
  const outputPath = getOutputPath(dir, basename(inputPath), targetExt);

  const args = ["-y", "-i", inputPath];

  // Codec
  if (options.codec && options.codec !== "auto") {
    args.push("-c:a", options.codec);
  }

  // Bitrate
  if (options.bitrate && options.bitrate !== "auto") {
    args.push("-b:a", options.bitrate);
  }

  // Sample rate
  if (options.sample_rate && options.sample_rate !== "auto") {
    args.push("-ar", options.sample_rate);
  }

  // Channels
  if (options.channels && options.channels !== "auto") {
    args.push("-ac", options.channels);
  }

  args.push(outputPath);

  await runCommand("ffmpeg", args, { cwd: dir });
  return outputPath;
}

// ─── ARCHIVE CONVERSION ────────────────────────────────────────

async function convertArchive(inputPath, targetExt, options = {}) {
  const dir = inputPath.replace(basename(inputPath), "");
  const inputName = basename(inputPath);
  const baseName = inputName.replace(/\.[^.]+$/, "");

  if (targetExt === "zip") {
    // Extract first, then re-compress
    const extractDir = `${dir}extract_${Date.now()}`;
    const { mkdir } = await import("fs/promises");
    await mkdir(extractDir, { recursive: true });

    // Extract based on source type
    const srcExt = extname(inputPath).toLowerCase().replace(".", "");
    if (srcExt === "zip") {
      await runCommand("unzip", ["-o", inputPath, "-d", extractDir]);
    } else if (["tar", "gz", "bz2", "xz"].includes(srcExt)) {
      await runCommand("tar", ["xf", inputPath, "-C", extractDir]);
    } else if (srcExt === "7z") {
      await runCommand("7z", ["x", inputPath, `-o${extractDir}`, "-y"]);
    } else if (srcExt === "rar") {
      await runCommand("unrar", ["x", "-o+", inputPath, extractDir]);
    }

    const outputPath = getOutputPath(dir, inputName, "zip");
    await runCommand("zip", ["-r", outputPath, "."], { cwd: extractDir });
    await cleanupTempDir(extractDir);
    return outputPath;
  }

  if (
    targetExt === "tar" ||
    targetExt === "gz" ||
    targetExt === "tar.gz" ||
    targetExt === "bz2"
  ) {
    const extractDir = `${dir}extract_${Date.now()}`;
    const { mkdir } = await import("fs/promises");
    await mkdir(extractDir, { recursive: true });

    const srcExt = extname(inputPath).toLowerCase().replace(".", "");
    if (srcExt === "zip") {
      await runCommand("unzip", ["-o", inputPath, "-d", extractDir]);
    } else if (["tar", "gz", "bz2", "xz"].includes(srcExt)) {
      await runCommand("tar", ["xf", inputPath, "-C", extractDir]);
    } else if (srcExt === "7z") {
      await runCommand("7z", ["x", inputPath, `-o${extractDir}`, "-y"]);
    }

    const tarFlag =
      targetExt === "gz" || targetExt === "tar.gz"
        ? "czf"
        : targetExt === "bz2"
          ? "cjf"
          : "cf";
    const outExt = targetExt === "tar.gz" ? "tar.gz" : targetExt;
    const outputPath = getOutputPath(dir, inputName, outExt);
    await runCommand("tar", [tarFlag, outputPath, "."], { cwd: extractDir });
    await cleanupTempDir(extractDir);
    return outputPath;
  }

  if (targetExt === "7z") {
    const outputPath = getOutputPath(dir, inputName, "7z");
    await runCommand("7z", ["a", outputPath, inputPath]);
    return outputPath;
  }

  throw new Error(`Unsupported archive target format: ${targetExt}`);
}

// ─── MAIN DISPATCH ─────────────────────────────────────────────

/**
 * Determine the category for a source extension.
 */
function getCategoryForExt(ext) {
  const imageExts = [
    "png",
    "jpg",
    "jpeg",
    "webp",
    "gif",
    "bmp",
    "tiff",
    "tif",
    "svg",
    "ico",
    "heic",
    "heif",
    "avif",
    "psd",
    "raw",
    "cr2",
    "nef",
    "arw",
    "dng",
    "jxl",
    "pgm",
    "ppm",
    "eps",
    "ai",
  ];
  const videoExts = [
    "mp4",
    "mov",
    "mkv",
    "avi",
    "webm",
    "flv",
    "wmv",
    "m4v",
    "mpeg",
    "mpg",
    "3gp",
    "ogv",
    "ts",
    "vob",
    "mts",
  ];
  const audioExts = [
    "mp3",
    "wav",
    "flac",
    "aac",
    "ogg",
    "wma",
    "m4a",
    "opus",
    "aiff",
    "amr",
    "ac3",
    "ape",
    "wv",
  ];
  const archiveExts = ["zip", "tar", "gz", "7z", "rar", "bz2", "xz", "iso"];
  const docExts = [
    "pdf",
    "docx",
    "doc",
    "odt",
    "rtf",
    "txt",
    "html",
    "htm",
    "epub",
    "mobi",
    "azw3",
    "tex",
    "md",
    "pages",
    "xlsx",
    "xls",
    "csv",
    "ods",
    "tsv",
    "numbers",
    "fods",
    "pptx",
    "ppt",
    "odp",
    "key",
  ];

  if (imageExts.includes(ext)) return "image";
  if (videoExts.includes(ext)) return "video";
  if (audioExts.includes(ext)) return "audio";
  if (archiveExts.includes(ext)) return "archive";
  if (docExts.includes(ext)) return "document";
  return null;
}

/**
 * Convert a file buffer to the target format.
 * Returns { outputPath, tempDir } — caller is responsible for cleanup.
 */
export async function convertFile(
  fileBuffer,
  originalName,
  targetExt,
  options = {},
) {
  const ext = originalName.split(".").pop().toLowerCase();
  const category = getCategoryForExt(ext);

  if (!category) {
    throw new Error(`Unsupported source format: .${ext}`);
  }

  // Create temp workspace
  const tempDir = await createTempDir();
  const inputPath = await saveUploadedFile(fileBuffer, originalName, tempDir);

  try {
    let outputPath;

    switch (category) {
      case "document":
        outputPath = await convertDocument(inputPath, targetExt, options);
        break;
      case "image":
        outputPath = await convertImage(inputPath, targetExt, options);
        break;
      case "video":
        outputPath = await convertVideo(inputPath, targetExt, options);
        break;
      case "audio":
        outputPath = await convertAudio(inputPath, targetExt, options);
        break;
      case "archive":
        outputPath = await convertArchive(inputPath, targetExt, options);
        break;
      default:
        throw new Error(`No converter for category: ${category}`);
    }

    return { outputPath, tempDir };
  } catch (err) {
    await cleanupTempDir(tempDir);
    throw err;
  }
}

/**
 * Capture a website URL to PDF/PNG/JPG.
 */
export async function captureWebsite(url, format = "pdf", options = {}) {
  const tempDir = await createTempDir();
  const outputPath = `${tempDir}/capture.${format}`;

  try {
    let apiUrl;
    if (format === "pdf") {
      apiUrl = `https://api.microlink.io/?url=${encodeURIComponent(url)}&pdf=true&embed=pdf.url`;
    } else {
      apiUrl = `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&embed=screenshot.url`;
    }

    const res = await fetch(apiUrl);
    if (!res.ok) {
      throw new Error(`Failed to capture website: ${res.statusText}`);
    }
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const { writeFile } = await import("fs/promises");
    await writeFile(outputPath, buffer);

    return { outputPath, tempDir };
  } catch (err) {
    await cleanupTempDir(tempDir);
    throw err;
  }
}
