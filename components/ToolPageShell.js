"use client";

import { useState } from "react";
import { LiquidGlassFilter } from "@zakisheriff/liquid-glass";
import AppShell from "@/components/AppShell";
import FileUploader from "@/components/FileUploader";
import ConversionCard from "@/components/ConversionCard";
import RouteShell from "@/components/RouteShell";
import GlassCard from "@/components/GlassCard";
import { GlassButton } from "@zakisheriff/liquid-glass";
import styles from "@/components/ToolPageShell.module.css";

export default function ToolPageShell({
  quickActions,
  accept,
  pageDescription,
}) {
  const [files, setFiles] = useState([]);
  const [activeAction, setActiveAction] = useState(null);

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
                    onClick={() =>
                      setActiveAction((prev) =>
                        prev === action.key ? null : action.key,
                      )
                    }
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
