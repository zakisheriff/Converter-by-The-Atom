"use client";

import { useState, useEffect } from "react";
import { LiquidGlassFilter } from "@zakisheriff/liquid-glass";
import AppShell from "@/components/AppShell";
import FileUploader from "@/components/FileUploader";
import ConversionCard from "@/components/ConversionCard";
import RouteShell from "@/components/RouteShell";
import styles from "@/app/convert/page.module.css";
import DownloaderBacklink from "@/components/DownloaderBacklink";

export default function ConvertPage() {
  const [files, setFiles] = useState([]);

  const removeFile = (id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  useEffect(() => {
    const { getPendingFiles } = require("@/utils/clientFileStore");
    const pending = getPendingFiles();
    if (pending && pending.length > 0) {
      const fileArray = Array.from(pending).map((f) => ({
        file: f,
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name: f.name,
        size: f.size,
        type: f.type,
        ext: f.name.split(".").pop().toLowerCase(),
      }));
      setFiles((prev) => [...prev, ...fileArray]);
    }
  }, []);

  return (
    <AppShell>
      <RouteShell>
        <LiquidGlassFilter>
          <div className={styles.page}>
            <FileUploader files={files} onFilesChange={setFiles} />

            {files.length > 0 ? (
              <div className={styles.cards}>
                {files.map((f) => (
                  <ConversionCard
                    key={f.id}
                    fileItem={f}
                    onRemove={() => removeFile(f.id)}
                  />
                ))}
              </div>
            ) : (
              <DownloaderBacklink type="general" />
            )}
          </div>
        </LiquidGlassFilter>
      </RouteShell>
    </AppShell>
  );
}
