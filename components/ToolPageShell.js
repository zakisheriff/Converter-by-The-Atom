"use client";

import { useState, useEffect } from "react";
import { LiquidGlassFilter } from "@zakisheriff/liquid-glass";
import AppShell from "@/components/AppShell";
import FileUploader from "@/components/FileUploader";
import ConversionCard from "@/components/ConversionCard";
import RouteShell from "@/components/RouteShell";
import GlassCard from "@/components/GlassCard";
import { GlassButton } from "@zakisheriff/liquid-glass";
import styles from "@/components/ToolPageShell.module.css";
import DownloaderBacklink from "@/components/DownloaderBacklink";

export default function ToolPageShell({
  quickActions,
  accept,
  pageDescription,
}) {
  const [files, setFiles] = useState([]);
  const [activeAction, setActiveAction] = useState(null);

  useEffect(() => {
    const { getPendingFiles } = require("@/utils/clientFileStore");
    const pending = getPendingFiles();
    if (pending && pending.length > 0) {
      let allowed = Array.from(pending);
      if (accept && accept !== "*/*") {
        const allowedExts = accept.split(",").map(e => e.trim().toLowerCase());
        allowed = allowed.filter(f => {
          const ext = "." + f.name.split(".").pop().toLowerCase();
          return allowedExts.includes(ext);
        });
      }
      if (allowed.length > 0) {
        const fileArray = allowed.map((f) => ({
          file: f,
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          name: f.name,
          size: f.size,
          type: f.type,
          ext: f.name.split(".").pop().toLowerCase(),
        }));
        setFiles((prev) => [...prev, ...fileArray]);
      }
    }
  }, [accept]);

  const removeFile = (id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <AppShell>
      <RouteShell>
        <LiquidGlassFilter>
          <div className={styles.page}>
            {pageDescription && (
              <p className={styles.description}>{pageDescription}</p>
            )}

            {quickActions && quickActions.length > 0 && (
              <div className={styles.actions}>
                {quickActions.map((action) => (
                  <GlassButton
                    key={action.key}
                    size="md"
                    intensity={activeAction === action.key ? 8 : 4}
                    className={`${styles.actionBtn} ${activeAction === action.key ? styles.actionBtnActive : ""}`}
                    onClick={() => {
                      setActiveAction((prev) =>
                        prev === action.key ? null : action.key,
                      );
                      if (files.length === 0) {
                        const fileInput = document.querySelector('input[type="file"]');
                        fileInput?.click();
                      }
                    }}
                  >
                    {action.icon && <action.icon size={14} />}
                    {action.label}
                  </GlassButton>
                ))}
              </div>
            )}

            <FileUploader
              files={files}
              onFilesChange={setFiles}
              accept={accept}
            />

            {files.length > 0 ? (
              <div className={styles.cards}>
                {files.map((f) => (
                  <ConversionCard
                    key={f.id}
                    fileItem={f}
                    onRemove={() => removeFile(f.id)}
                    activeAction={activeAction}
                  />
                ))}
              </div>
            ) : (
              <DownloaderBacklink type={
                accept?.includes(".png") ? "image" :
                accept?.includes(".mp4") ? "video" :
                accept?.includes(".mp3") ? "audio" : "general"
              } />
            )}
          </div>
        </LiquidGlassFilter>
      </RouteShell>
    </AppShell>
  );
}
