"use client";

import { useState, useRef, useEffect } from "react";
import { Globe, Download, Loader2, Camera, Check, Clipboard, Copy, X } from "lucide-react";
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
  const [copied, setCopied] = useState(false);
  const copyTimeoutRef = useRef(null);
  const inputRef = useRef(null);

  const pollRef = useRef(null);

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    };
  }, []);

  const handleContainerClick = (e) => {
    if (e.target.tagName !== "BUTTON" && !e.target.closest("button")) {
      inputRef.current?.focus();
    }
  };

  const handleCopy = async () => {
    if (!url.trim()) return;
    try {
      await navigator.clipboard.writeText(url.trim());
      setCopied(true);
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = setTimeout(() => setCopied(false), 1500);
    } catch { /* ignore */ }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const trimmedText = (text || "").trim();
      if (trimmedText) {
        setUrl(trimmedText);
      }
    } catch (err) {
      console.error("Failed to read clipboard contents: ", err);
    }
  };

  const handleClear = () => setUrl("");

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

      // Poll for status
      if (data.statusUrl) {
        pollRef.current = setInterval(async () => {
          try {
            const sRes = await fetch(data.statusUrl);
            if (!sRes.ok) return;
            const sData = await sRes.json();

            if (sData.status === "done") {
              clearInterval(pollRef.current);
              pollRef.current = null;
              setLoading(false);
              setResult({ downloadUrl: sData.downloadUrl });
            } else if (sData.status === "error") {
              clearInterval(pollRef.current);
              pollRef.current = null;
              setLoading(false);
              setError(sData.error || "Capture failed");
            }
          } catch {
            // ignore
          }
        }, 1500);
      } else if (data.downloadUrl) {
        setResult({ downloadUrl: data.downloadUrl });
        setLoading(false);
      }
    } catch (err) {
      setError(err.message || "Capture failed");
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

            <CustomGlassInputCard className={styles.inputCard} onClick={handleContainerClick}>
              <div className={styles.inputWrap}>
                <Globe size={18} className={styles.inputIcon} />
                <input
                  ref={inputRef}
                  type="url"
                  placeholder="Paste URL (e.g. https://example.com) to capture..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCapture()}
                  className={styles.urlInput}
                />
                {url ? (
                  <>
                    <GlassButton
                      className={styles.iconBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy();
                      }}
                      title={copied ? "Copied!" : "Copy link"}
                      aria-label="Copy link"
                      type="button"
                      variant="ghost"
                      intensity={4}
                      size="sm"
                      style={{ minWidth: "32px", width: "32px", height: "32px", borderRadius: "50%", padding: 0 }}
                    >
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                    </GlassButton>
                    <GlassButton
                      className={styles.iconBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClear();
                      }}
                      title="Clear"
                      aria-label="Clear input"
                      type="button"
                      variant="ghost"
                      intensity={4}
                      size="sm"
                      style={{ minWidth: "32px", width: "32px", height: "32px", borderRadius: "50%", padding: 0 }}
                    >
                      <X size={14} />
                    </GlassButton>
                  </>
                ) : (
                  <GlassButton
                    className={styles.iconBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePaste();
                    }}
                    title="Paste from clipboard"
                    aria-label="Paste from clipboard"
                    type="button"
                    variant="ghost"
                    intensity={4}
                    size="sm"
                    style={{ minWidth: "32px", width: "32px", height: "32px", borderRadius: "50%", padding: 0 }}
                  >
                    <Clipboard size={14} />
                  </GlassButton>
                )}
              </div>
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
            </CustomGlassInputCard>

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
