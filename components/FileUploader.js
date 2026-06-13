"use client";

import { useRef, useState } from "react";
import {
  Upload,
  X,
  FileText,
  Image,
  Video,
  Music,
  Archive,
  File,
} from "lucide-react";
import { GlassButton } from "@zakisheriff/liquid-glass";
import GlassCard from "@/components/GlassCard";
import styles from "@/components/FileUploader.module.css";
import { useToast } from "@/components/providers/ToastProvider";

function getFileIcon(type, name) {
  if (type?.startsWith("image/")) return Image;
  if (type?.startsWith("video/")) return Video;
  if (type?.startsWith("audio/")) return Music;
  if (
    type?.includes("zip") ||
    type?.includes("tar") ||
    type?.includes("rar") ||
    type?.includes("7z")
  )
    return Archive;
  if (
    type?.includes("pdf") ||
    type?.includes("word") ||
    type?.includes("document")
  )
    return FileText;
  const ext = name?.split(".").pop()?.toLowerCase();
  if (
    [
      "jpg",
      "jpeg",
      "png",
      "gif",
      "webp",
      "svg",
      "bmp",
      "tiff",
      "heic",
      "avif",
      "ico",
    ].includes(ext)
  )
    return Image;
  if (["mp4", "mov", "mkv", "avi", "webm", "flv", "wmv"].includes(ext))
    return Video;
  if (["mp3", "wav", "flac", "aac", "ogg", "m4a", "opus"].includes(ext))
    return Music;
  if (["zip", "tar", "gz", "7z", "rar", "bz2"].includes(ext)) return Archive;
  return File;
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

export default function FileUploader({ files, onFilesChange, accept = "*/*" }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const { showToast } = useToast();

  const addFiles = (newFiles) => {
    if (!newFiles || newFiles.length === 0) return;
    let fileList = Array.from(newFiles);
    
    if (accept && accept !== "*/*") {
      const allowedExts = accept.split(",").map(e => e.trim().toLowerCase());
      fileList = fileList.filter(f => {
        const ext = "." + f.name.split(".").pop().toLowerCase();
        return allowedExts.includes(ext);
      });
      
      const rejectedCount = newFiles.length - fileList.length;
      if (rejectedCount > 0) {
        showToast({
          title: "Unsupported file format",
          description: `${rejectedCount} file(s) ignored. Only formats matching "${accept}" are allowed.`,
          variant: "warning"
        });
      }
    }
    
    if (fileList.length === 0) return;
    
    const fileArray = fileList.map((f) => ({
      file: f,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: f.name,
      size: f.size,
      type: f.type,
      ext: f.name.split(".").pop().toLowerCase(),
    }));
    onFilesChange([...files, ...fileArray]);
  };

  const removeFile = (id) => {
    onFilesChange(files.filter((f) => f.id !== id));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleBrowse = () => fileInputRef.current?.click();

  const handleFileInput = (e) => {
    addFiles(e.target.files);
    e.target.value = "";
  };

  return (
    <div className={styles.wrapper}>
      <GlassCard
        className={`${styles.dropCard} ${isDragging ? styles.dropCardActive : ""}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleBrowse}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className={styles.hiddenInput}
          onChange={handleFileInput}
          accept={accept}
        />
        <div className={styles.dropIcon}>
          <Upload size={28} />
        </div>
        <strong>
          {isDragging
            ? "Drop files here"
            : files.length > 0
              ? "Add more files"
              : "Drop files or click to browse"}
        </strong>
        <p>Documents, images, video, audio, archives — up to 500MB per file</p>
      </GlassCard>

      {files.length > 0 ? (
        <div className={styles.fileList}>
          {files.map((f) => {
            const Icon = getFileIcon(f.type, f.name);
            return (
              <GlassCard key={f.id} className={styles.fileCard}>
                <div className={styles.fileIcon}>
                  <Icon size={20} />
                </div>
                <div className={styles.fileCopy}>
                  <strong>{f.name}</strong>
                  <span>
                    {formatSize(f.size)} &middot; {f.ext.toUpperCase()}
                  </span>
                </div>
                <GlassButton
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(f.id);
                  }}
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
                  <X size={14} />
                </GlassButton>
              </GlassCard>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
