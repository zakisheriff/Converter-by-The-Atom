"use client";

import { useState } from "react";
import { LiquidGlassFilter } from "@zakisheriff/liquid-glass";
import AppShell from "@/components/AppShell";
import FileUploader from "@/components/FileUploader";
import ConversionCard from "@/components/ConversionCard";
import RouteShell from "@/components/RouteShell";
import styles from "@/app/convert/page.module.css";

export default function ConvertPage() {
  const [files, setFiles] = useState([]);

  const removeFile = (id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <AppShell>
      <RouteShell>
        <LiquidGlassFilter>
          <div className={styles.page}>
            <FileUploader files={files} onFilesChange={setFiles} />

            {files.length > 0 && (
              <div className={styles.cards}>
                {files.map((f) => (
                  <ConversionCard
                    key={f.id}
                    fileItem={f}
                    onRemove={() => removeFile(f.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </LiquidGlassFilter>
      </RouteShell>
    </AppShell>
  );
}
