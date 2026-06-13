"use client";

import { useState, useRef } from "react";
import { Globe, Download, Loader2, Camera } from "lucide-react";
import {
  LiquidGlassFilter,
  GlassButton,
  useGlassEffect,
} from "@zakisheriff/liquid-glass";
import AppShell from "@/components/AppShell";
import RouteShell from "@/components/RouteShell";
import GlassCard from "@/components/GlassCard";
import styles from "@/app/website-capture/page.module.css";

function CustomGlassInputCard({
  children,
  className,
  style: externalStyle,
  ...props
}) {
  const { style: glassStyle } = useGlassEffect({
    intensity: 6,
    shimmer: true,
    thickness: 1,
  });
  return (
    <div
      data-liquid-glass
      style={{ ...glassStyle, ...externalStyle }}
      className={`${className} lg-root lg-card`}
      {...props}
    >
      <div className="lg-backdrop-surface" aria-hidden="true" />
      <div className="lg-shadow" aria-hidden="true" />
      <div className="lg-surface">
        <div className={`${styles.inputCardContent} lg-content`}>
          {children}
        </div>
      </div>
    </div>
  );
}

const formatOptions = [
  { value: "pdf", label: "PDF" },
  { value: "png", label: "PNG" },
  { value: "jpg", label: "JPG" },
];

export default function WebsiteCapturePage() {
  const [url, setUrl] = useState("");
  const [format, setFormat] = useState("pdf");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleCapture = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/website-capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim(), format }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Capture failed");
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message || "Capture failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <RouteShell>
        <LiquidGlassFilter>
          <div className={styles.page}>
            <p className={styles.description}>
              Capture full-page screenshots of any website as PDF, PNG, or JPG.
              Enter a URL below to get started.
            </p>

            <CustomGlassInputCard className={styles.inputCard}>
              <div className={styles.inputRow}>
                <div className={styles.inputIcon}>
                  <Globe size={18} />
                </div>
                <input
                  type="url"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className={styles.urlInput}
                  onKeyDown={(e) => e.key === "Enter" && handleCapture()}
                />
              </div>

              <div className={styles.formatRow}>
                {formatOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`${styles.formatChip} ${format === opt.value ? styles.formatChipActive : ""}`}
                    onClick={() => setFormat(opt.value)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              <div className={styles.btnRow}>
                <GlassButton
                  onClick={handleCapture}
                  size="lg"
                  intensity={6}
                  disabled={loading || !url.trim()}
                  className={styles.captureBtn}
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className={styles.spin} />
                      Capturing…
                    </>
                  ) : (
                    <>
                      <Camera size={16} />
                      Capture
                    </>
                  )}
                </GlassButton>
              </div>
            </CustomGlassInputCard>

            {error && (
              <GlassCard className={styles.errorCard}>
                <p className={styles.errorText}>{error}</p>
              </GlassCard>
            )}

            {result?.downloadUrl && (
              <GlassCard className={styles.resultCard}>
                <div className={styles.resultInfo}>
                  <Globe size={18} />
                  <span className={styles.resultUrl}>{url}</span>
                </div>
                <GlassButton
                  onClick={() => window.open(result.downloadUrl, "_blank")}
                  size="md"
                  intensity={6}
                >
                  <Download size={14} />
                  Download {format.toUpperCase()}
                </GlassButton>
              </GlassCard>
            )}
          </div>
        </LiquidGlassFilter>
      </RouteShell>
    </AppShell>
  );
}
