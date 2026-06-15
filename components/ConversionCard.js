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

export default function ConversionCard({ fileItem, onRemove, onComplete, activeAction }) {
  const { file, name, size, ext } = fileItem;
  const Icon = getFileIcon(ext);
  const categoryKey = getCategoryForExt(ext);

  const targets = getTargetsForExt(ext);
  const [targetFormat, setTargetFormat] = useState(targets[0] || "");
  const [advValues, setAdvValues] = useState({});
  const [jobState, setJobState] = useState(null); // null | { status, progress, error, downloadUrl }
  const pollRef = useRef(null);
  const progressIntervalRef = useRef(null);

  // Auto-set target formats for specific quick actions
  useEffect(() => {
    if (activeAction === "audio") {
      if (targets.includes("mp3")) {
        setTargetFormat("mp3");
      } else {
        const audioTargets = targets.filter(t => ["mp3", "wav", "m4a", "flac", "ogg"].includes(t));
        if (audioTargets.length > 0) setTargetFormat(audioTargets[0]);
      }
    } else if (activeAction === "thumbnail") {
      if (targets.includes("jpg")) {
        setTargetFormat("jpg");
      } else if (targets.includes("png")) {
        setTargetFormat("png");
      }
    } else if (activeAction === "to-word") {
      if (targets.includes("docx")) setTargetFormat("docx");
      else if (targets.includes("doc")) setTargetFormat("doc");
    } else if (activeAction === "to-images") {
      if (targets.includes("png")) setTargetFormat("png");
      else if (targets.includes("jpg")) setTargetFormat("jpg");
    } else if (activeAction === "to-text") {
      if (targets.includes("txt")) setTargetFormat("txt");
    } else if (activeAction === "to-markdown") {
      if (targets.includes("md")) setTargetFormat("md");
    }
  }, [activeAction, targets]);

  const startProgressSimulation = useCallback((initialProgress, targetProgress, speed = 0.5) => {
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    
    let currentProgress = initialProgress;
    setJobState((prev) => ({
      ...prev,
      progress: initialProgress
    }));

    progressIntervalRef.current = setInterval(() => {
      if (currentProgress < targetProgress) {
        // Asymptotically slow down as we approach the target
        const remaining = targetProgress - currentProgress;
        const step = Math.max(0.1, remaining * 0.05 * speed);
        currentProgress += step;
        
        setJobState((prev) => {
          if (!prev || prev.status === "done" || prev.status === "error") {
            if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
            return prev;
          }
          return {
            ...prev,
            progress: Math.min(currentProgress, targetProgress)
          };
        });
      } else {
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      }
    }, 50); // 20 frames per second for smooth movement
  }, []);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, []);

  const pollStatus = useCallback(
    (statusUrl) => {
      if (pollRef.current) clearInterval(pollRef.current);

      // Start simulating conversion progress from 30% to 95%
      startProgressSimulation(30, 95, 0.15);

      pollRef.current = setInterval(async () => {
        try {
          const res = await fetch(statusUrl);
          if (!res.ok) return;
          const data = await res.json();

          if (data.status === "done") {
            clearInterval(pollRef.current);
            pollRef.current = null;
            if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
            setJobState({
              status: "done",
              progress: 100,
              downloadUrl: data.downloadUrl,
            });
            if (onComplete) onComplete(data);
          } else if (data.status === "error") {
            clearInterval(pollRef.current);
            pollRef.current = null;
            if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
            setJobState({
              status: "error",
              progress: 0,
              error: data.error || "Conversion failed",
            });
          }
        } catch {
          // ignore polling errors
        }
      }, 1500);
    },
    [onComplete, startProgressSimulation],
  );

  const handleConvert = useCallback(async () => {
    if (!targetFormat || !file) return;

    setJobState({ status: "uploading", progress: 0 });
    startProgressSimulation(0, 30, 0.4);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("targetFormat", targetFormat);
      formData.append("options", JSON.stringify(advValues));

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
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
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
        setJobState((prev) => ({ ...prev, status: "converting" }));
        pollStatus(data.statusUrl);
      }
    } catch (err) {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      setJobState({
        status: "error",
        progress: 0,
        error: err.message || "Conversion failed",
      });
    }
  }, [file, targetFormat, advValues, onComplete, pollStatus, startProgressSimulation]);

  const handleReset = () => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
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
            activeAction={activeAction}
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
