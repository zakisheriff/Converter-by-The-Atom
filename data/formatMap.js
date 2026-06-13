/**
 * Complete format registry for Converter by The Atom.
 * Groups 200+ formats by category with MIME types, conversion targets,
 * and advanced option schemas.
 */

export const formatCategories = {
  document: {
    label: "Documents",
    icon: "FileText",
    formats: [
      { ext: "pdf", mime: "application/pdf", label: "PDF" },
      { ext: "docx", mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", label: "DOCX" },
      { ext: "doc", mime: "application/msword", label: "DOC" },
      { ext: "odt", mime: "application/vnd.oasis.opendocument.text", label: "ODT" },
      { ext: "rtf", mime: "application/rtf", label: "RTF" },
      { ext: "txt", mime: "text/plain", label: "TXT" },
      { ext: "html", mime: "text/html", label: "HTML" },
      { ext: "htm", mime: "text/html", label: "HTM" },
      { ext: "epub", mime: "application/epub+zip", label: "EPUB" },
      { ext: "mobi", mime: "application/x-mobipocket-ebook", label: "MOBI" },
      { ext: "azw3", mime: "application/vnd.amazon.ebook", label: "AZW3" },
      { ext: "tex", mime: "application/x-tex", label: "LaTeX" },
      { ext: "md", mime: "text/markdown", label: "Markdown" },
      { ext: "pages", mime: "application/x-iwork-pages-sffpages", label: "Pages" },
    ],
    targets: ["pdf", "docx", "doc", "odt", "rtf", "txt", "html", "epub", "mobi"]
  },
  spreadsheet: {
    label: "Spreadsheets",
    icon: "Table",
    formats: [
      { ext: "xlsx", mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", label: "XLSX" },
      { ext: "xls", mime: "application/vnd.ms-excel", label: "XLS" },
      { ext: "csv", mime: "text/csv", label: "CSV" },
      { ext: "ods", mime: "application/vnd.oasis.opendocument.spreadsheet", label: "ODS" },
      { ext: "tsv", mime: "text/tab-separated-values", label: "TSV" },
      { ext: "numbers", mime: "application/x-iwork-numbers-sffnumbers", label: "Numbers" },
      { ext: "fods", mime: "application/vnd.oasis.opendocument.spreadsheet", label: "Flat ODS" },
    ],
    targets: ["xlsx", "xls", "csv", "ods", "tsv", "pdf"]
  },
  presentation: {
    label: "Presentations",
    icon: "Presentation",
    formats: [
      { ext: "pptx", mime: "application/vnd.openxmlformats-officedocument.presentationml.presentation", label: "PPTX" },
      { ext: "ppt", mime: "application/vnd.ms-powerpoint", label: "PPT" },
      { ext: "odp", mime: "application/vnd.oasis.opendocument.presentation", label: "ODP" },
      { ext: "key", mime: "application/x-iwork-keynote-sffkey", label: "Keynote" },
    ],
    targets: ["pptx", "ppt", "odp", "pdf", "html"]
  },
  image: {
    label: "Images",
    icon: "Image",
    formats: [
      { ext: "png", mime: "image/png", label: "PNG" },
      { ext: "jpg", mime: "image/jpeg", label: "JPG" },
      { ext: "jpeg", mime: "image/jpeg", label: "JPEG" },
      { ext: "webp", mime: "image/webp", label: "WEBP" },
      { ext: "gif", mime: "image/gif", label: "GIF" },
      { ext: "bmp", mime: "image/bmp", label: "BMP" },
      { ext: "tiff", mime: "image/tiff", label: "TIFF" },
      { ext: "tif", mime: "image/tiff", label: "TIF" },
      { ext: "svg", mime: "image/svg+xml", label: "SVG" },
      { ext: "ico", mime: "image/x-icon", label: "ICO" },
      { ext: "heic", mime: "image/heic", label: "HEIC" },
      { ext: "heif", mime: "image/heif", label: "HEIF" },
      { ext: "avif", mime: "image/avif", label: "AVIF" },
      { ext: "psd", mime: "image/vnd.adobe.photoshop", label: "PSD" },
      { ext: "ai", mime: "application/postscript", label: "AI" },
      { ext: "eps", mime: "application/postscript", label: "EPS" },
      { ext: "raw", mime: "image/x-raw", label: "RAW" },
      { ext: "cr2", mime: "image/x-canon-cr2", label: "CR2" },
      { ext: "nef", mime: "image/x-nikon-nef", label: "NEF" },
      { ext: "arw", mime: "image/x-sony-arw", label: "ARW" },
      { ext: "dng", mime: "image/x-adobe-dng", label: "DNG" },
      { ext: "jxl", mime: "image/jxl", label: "JPEG XL" },
      { ext: "pgm", mime: "image/x-portable-graymap", label: "PGM" },
      { ext: "ppm", mime: "image/x-portable-pixmap", label: "PPM" },
    ],
    targets: ["png", "jpg", "webp", "gif", "bmp", "tiff", "svg", "ico", "heic", "avif", "eps"]
  },
  video: {
    label: "Videos",
    icon: "Video",
    formats: [
      { ext: "mp4", mime: "video/mp4", label: "MP4" },
      { ext: "mov", mime: "video/quicktime", label: "MOV" },
      { ext: "mkv", mime: "video/x-matroska", label: "MKV" },
      { ext: "avi", mime: "video/x-msvideo", label: "AVI" },
      { ext: "webm", mime: "video/webm", label: "WEBM" },
      { ext: "flv", mime: "video/x-flv", label: "FLV" },
      { ext: "wmv", mime: "video/x-ms-wmv", label: "WMV" },
      { ext: "m4v", mime: "video/x-m4v", label: "M4V" },
      { ext: "mpeg", mime: "video/mpeg", label: "MPEG" },
      { ext: "mpg", mime: "video/mpeg", label: "MPG" },
      { ext: "3gp", mime: "video/3gpp", label: "3GP" },
      { ext: "ogv", mime: "video/ogg", label: "OGV" },
      { ext: "ts", mime: "video/mp2t", label: "TS" },
      { ext: "vob", mime: "video/dvd", label: "VOB" },
      { ext: "mts", mime: "video/mp2t", label: "MTS" },
    ],
    targets: ["mp4", "mov", "mkv", "avi", "webm", "flv", "wmv", "m4v", "mpeg", "3gp", "ogv", "gif", "jpg", "png", "webp"]
  },
  audio: {
    label: "Audio",
    icon: "Music",
    formats: [
      { ext: "mp3", mime: "audio/mpeg", label: "MP3" },
      { ext: "wav", mime: "audio/wav", label: "WAV" },
      { ext: "flac", mime: "audio/flac", label: "FLAC" },
      { ext: "aac", mime: "audio/aac", label: "AAC" },
      { ext: "ogg", mime: "audio/ogg", label: "OGG" },
      { ext: "wma", mime: "audio/x-ms-wma", label: "WMA" },
      { ext: "m4a", mime: "audio/x-m4a", label: "M4A" },
      { ext: "opus", mime: "audio/opus", label: "Opus" },
      { ext: "aiff", mime: "audio/aiff", label: "AIFF" },
      { ext: "amr", mime: "audio/amr", label: "AMR" },
      { ext: "ac3", mime: "audio/ac3", label: "AC3" },
      { ext: "ape", mime: "audio/x-ape", label: "APE" },
      { ext: "wv", mime: "audio/x-wavpack", label: "WavPack" },
    ],
    targets: ["mp3", "wav", "flac", "aac", "ogg", "wma", "m4a", "opus", "aiff"]
  },
  archive: {
    label: "Archives",
    icon: "Archive",
    formats: [
      { ext: "zip", mime: "application/zip", label: "ZIP" },
      { ext: "tar", mime: "application/x-tar", label: "TAR" },
      { ext: "gz", mime: "application/gzip", label: "GZ" },
      { ext: "tar.gz", mime: "application/gzip", label: "TAR.GZ" },
      { ext: "7z", mime: "application/x-7z-compressed", label: "7Z" },
      { ext: "rar", mime: "application/x-rar-compressed", label: "RAR" },
      { ext: "bz2", mime: "application/x-bzip2", label: "BZ2" },
      { ext: "xz", mime: "application/x-xz", label: "XZ" },
      { ext: "iso", mime: "application/x-iso9660-image", label: "ISO" },
    ],
    targets: ["zip", "tar", "gz", "tar.gz", "7z", "bz2"]
  },
  vector: {
    label: "CAD & Vector",
    icon: "PenTool",
    formats: [
      { ext: "svg", mime: "image/svg+xml", label: "SVG" },
      { ext: "eps", mime: "application/postscript", label: "EPS" },
      { ext: "dxf", mime: "application/dxf", label: "DXF" },
      { ext: "dwg", mime: "application/acad", label: "DWG" },
    ],
    targets: ["svg", "eps", "png", "jpg", "pdf"]
  }
};

/**
 * Get the category key for a given file extension.
 */
export function getCategoryForExt(ext) {
  const normalized = ext.toLowerCase().replace(/^\./, "");
  for (const [key, cat] of Object.entries(formatCategories)) {
    if (cat.formats.some((f) => f.ext === normalized)) {
      return key;
    }
  }
  return null;
}

/**
 * Get the list of valid target formats for a given source extension.
 */
export function getTargetsForExt(ext) {
  const normalized = ext.toLowerCase().replace(/^\./, "");
  const categoryKey = getCategoryForExt(normalized);
  if (!categoryKey) return [];
  const cat = formatCategories[categoryKey];
  return cat.targets.filter((t) => t !== normalized);
}

/**
 * Get format info by extension.
 */
export function getFormatInfo(ext) {
  const normalized = ext.toLowerCase().replace(/^\./, "");
  for (const cat of Object.values(formatCategories)) {
    const found = cat.formats.find((f) => f.ext === normalized);
    if (found) return found;
  }
  return { ext: normalized, mime: "application/octet-stream", label: normalized.toUpperCase() };
}

/**
 * Advanced option schemas per category.
 */
export const advancedOptions = {
  image: [
    { key: "quality", label: "Quality", type: "range", min: 1, max: 100, default: 85, unit: "%" },
    { key: "resize_width", label: "Width", type: "number", placeholder: "Auto", unit: "px" },
    { key: "resize_height", label: "Height", type: "number", placeholder: "Auto", unit: "px" },
    { key: "crop", label: "Crop geometry (e.g. 100x100+10+10)", type: "text", placeholder: "widthxheight+x+y" },
    { key: "dpi", label: "DPI", type: "number", placeholder: "72", unit: "dpi" },
    { key: "watermark_text", label: "Watermark text", type: "text", placeholder: "None" },
    { key: "strip_metadata", label: "Strip metadata", type: "boolean", default: false },
  ],
  video: [
    { key: "codec", label: "Codec", type: "select", options: ["auto", "h264", "h265", "vp9", "av1"], default: "auto" },
    { key: "quality", label: "Quality (CRF)", type: "range", min: 0, max: 51, default: 23 },
    { key: "bitrate", label: "Bitrate", type: "text", placeholder: "e.g. 5M", unit: "kbps" },
    { key: "resolution", label: "Resolution", type: "select", options: ["auto", "3840x2160", "1920x1080", "1280x720", "854x480", "640x360"], default: "auto" },
    { key: "framerate", label: "Frame rate", type: "select", options: ["auto", "60", "30", "24", "15"], default: "auto" },
    { key: "audio_bitrate", label: "Audio bitrate", type: "select", options: ["auto", "320k", "256k", "192k", "128k", "96k"], default: "auto" },
    { key: "trim_start", label: "Trim start time", type: "text", placeholder: "e.g. 00:00:05 or seconds" },
    { key: "trim_duration", label: "Trim duration (seconds)", type: "number", placeholder: "e.g. 10" },
  ],
  audio: [
    { key: "codec", label: "Codec", type: "select", options: ["auto", "libmp3lame", "aac", "flac", "libvorbis", "libopus"], default: "auto" },
    { key: "bitrate", label: "Bitrate", type: "select", options: ["auto", "320k", "256k", "192k", "128k", "96k", "64k"], default: "auto" },
    { key: "sample_rate", label: "Sample rate", type: "select", options: ["auto", "48000", "44100", "22050", "16000", "8000"], default: "auto" },
    { key: "channels", label: "Channels", type: "select", options: ["auto", "2", "1"], default: "auto" },
  ],
  document: [
    { key: "dpi", label: "DPI", type: "select", options: ["72", "150", "300", "600"], default: "150" },
    { key: "page_range", label: "Page range", type: "text", placeholder: "e.g. 1-5, 8" },
    { key: "font_embed", label: "Embed fonts", type: "boolean", default: true },
  ],
  pdf: [
    { key: "profile", label: "Profile", type: "select", options: ["web", "print", "archive", "mrc"], default: "web" },
    { key: "quality", label: "Image quality", type: "range", min: 1, max: 100, default: 75, unit: "%" },
    { key: "dpi", label: "DPI", type: "select", options: ["72", "150", "300", "600"], default: "150" },
    { key: "compress_images", label: "Compress images", type: "boolean", default: true },
    { key: "remove_metadata", label: "Remove metadata", type: "boolean", default: false },
  ]
};

/**
 * All supported extensions as a flat list for quick lookup.
 */
export const allExtensions = Object.values(formatCategories).flatMap((cat) =>
  cat.formats.map((f) => f.ext)
);

/**
 * All supported extensions as a Set for O(1) lookup.
 */
export const extensionSet = new Set(allExtensions);
