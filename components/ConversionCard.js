"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  ArrowRight,
  Download,
  FileText,
  Image,
  Video,
  Music,
  Archive,
  File,
  RotateCcw,
} from "lucide-react";
import { GlassButton } from "@zakisheriff/liquid-glass";
import GlassCard from "@/components/GlassCard";
import FormatPicker from "@/components/FormatPicker";
import AdvancedOptions from "@/components/AdvancedOptions";
import ConversionProgress from "@/components/ConversionProgress";
import { getCategoryForExt, getTargetsForExt } from "@/data/formatMap";
import styles from "@/components/ConversionCard.module.css";

function getFileIcon(ext) {
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
  if (imageExts.includes(ext)) return Image;
  if (videoExts.includes(ext)) return Video;
  if (audioExts.includes(ext)) return Music;
  if (archiveExts.includes(ext)) return Archive;
  if (
    [
      "pdf",
      "docx",
      "doc",
      "odt",
      "rtf",
      "txt",
      "html",
      "epub",
      "mobi",
      "md",
    ].includes(ext)
  )
    return FileText;
  return File;
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

export default function ConversionCard({ fileItem, onRemove, onComplete }) {
  const { file, name, size, ext } = fileItem;
  const Icon = getFileIcon(ext);
  const categoryKey = getCategoryForExt(ext);

  const targets = getTargetsForExt(ext);
  const [targetFormat, setTargetFormat] = useState(targets[0] || "");
  const [advValues, setAdvValues] = useState({});
  const [jobState, setJobState] = useState(null); // null | { status, progress, error, downloadUrl }
  const pollRef = useRef(null);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const pollStatus = useCallback(
    (statusUrl) => {
      if (pollRef.current) clearInterval(pollRef.current);

      pollRef.current = setInterval(async () => {
        try {
          const res = await fetch(statusUrl);
          if (!res.ok) return;
          const data = await res.json();

          if (data.status === "done") {
            clearInterval(pollRef.current);
            pollRef.current = null;
            setJobState({
              status: "done",
              progress: 100,
              downloadUrl: data.downloadUrl,
            });
            if (onComplete) onComplete(data);
          } else if (data.status === "error") {
            clearInterval(pollRef.current);
            pollRef.current = null;
            setJobState({
              status: "error",
              progress: 0,
              error: data.error || "Conversion failed",
            });
          } else {
            // Still processing — animate progress
            setJobState((prev) => ({
              status: "converting",
              progress: Math.min((prev?.progress || 30) + 5, 90),
            }));
          }
        } catch {
          // ignore polling errors
        }
      }, 1500);
    },
    [onComplete],
  );

  const handleConvert = useCallback(async () => {
    if (!targetFormat || !file) return;

    setJobState({ status: "uploading", progress: 10 });

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("targetFormat", targetFormat);
      formData.append("options", JSON.stringify(advValues));

      setJobState({ status: "converting", progress: 30 });

      const res = await fetch("/api/convert", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Conversion failed (${res.status})`);
      }

      const data = await res.json();

      // If the server returned a downloadUrl directly (sync mode)
      if (data.downloadUrl && !data.statusUrl) {
        setJobState({
          status: "done",
          progress: 100,
          downloadUrl: data.downloadUrl,
        });
        if (onComplete) onComplete(data);
        return;
      }

      // Otherwise poll for status
      if (data.statusUrl) {
        pollStatus(data.statusUrl);
      }
    } catch (err) {
      setJobState({
        status: "error",
        progress: 0,
        error: err.message || "Conversion failed",
      });
    }
  }, [file, targetFormat, advValues, onComplete, pollStatus]);

  const handleReset = () => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
    setJobState(null);
  };

  const handleDownload = () => {
    if (jobState?.downloadUrl) {
      window.open(jobState.downloadUrl, "_blank");
    }
  };

  return (
    <GlassCard className={styles.card}>
      {/* Source file info */}
      <div className={styles.header}>
        <div className={styles.fileIcon}>
          <Icon size={20} />
        </div>
        <div className={styles.fileCopy}>
          <strong className={styles.fileName}>{name}</strong>
          <span className={styles.fileMeta}>
            {formatSize(size)} &middot; {ext.toUpperCase()}
          </span>
        </div>
        {onRemove && !jobState && (
          <GlassButton
            onClick={onRemove}
            variant="ghost"
            intensity={4}
            size="sm"
            className={styles.removeBtn}
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              padding: 0,
              minWidth: "32px",
            }}
          >
            <span style={{ fontSize: "16px", lineHeight: 1 }}>×</span>
          </GlassButton>
        )}
      </div>

      {/* Conversion result or form */}
      {jobState?.status === "done" ? (
        <div className={styles.resultRow}>
          <div className={styles.resultInfo}>
            <ArrowRight size={16} className={styles.arrowIcon} />
            <span className={styles.resultFormat}>
              .{ext.toUpperCase()} → .{targetFormat.toUpperCase()}
            </span>
          </div>
          <div className={styles.resultActions}>
            <GlassButton
              onClick={handleDownload}
              size="md"
              intensity={6}
              className={styles.downloadBtn}
            >
              <Download size={14} />
              Download
            </GlassButton>
            <GlassButton
              onClick={handleReset}
              variant="ghost"
              intensity={4}
              size="sm"
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                padding: 0,
                minWidth: "32px",
              }}
            >
              <RotateCcw size={14} />
            </GlassButton>
          </div>
        </div>
      ) : jobState ? (
        <ConversionProgress
          status={jobState.status}
          progress={jobState.progress}
          error={jobState.error}
          onCancel={handleReset}
        />
      ) : (
        <>
          <FormatPicker
            sourceExt={ext}
            selected={targetFormat}
            onSelect={setTargetFormat}
          />

          <AdvancedOptions
            categoryKey={categoryKey}
            values={advValues}
            onChange={setAdvValues}
          />

          <div className={styles.actions}>
            <GlassButton
              onClick={handleConvert}
              size="md"
              intensity={6}
              className={styles.convertBtn}
              disabled={!targetFormat}
            >
              Convert to {targetFormat.toUpperCase()}
            </GlassButton>
          </div>
        </>
      )}
    </GlassCard>
  );
}
