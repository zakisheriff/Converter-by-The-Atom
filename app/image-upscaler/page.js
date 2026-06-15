"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, Download, Maximize, RefreshCw, AlertCircle, ArrowRight, ShieldCheck } from "lucide-react";
import { LiquidGlassFilter, GlassButton } from "@zakisheriff/liquid-glass";
import AppShell from "@/components/AppShell";
import RouteShell from "@/components/RouteShell";
import GlassCard from "@/components/GlassCard";
import styles from "./page.module.css";

export default function ImageUpscalerPage() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [scale, setScale] = useState("2"); // "2" | "4"
  const [mode, setMode] = useState("ultra-sharp"); // "standard" | "ultra-sharp" | "denoise"
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const fileInputRef = useRef(null);
  const pollRef = useRef(null);
  const progressIntervalRef = useRef(null);

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setResult(null);
      setError(null);
      setProgress(0);
    }
  };

  const startProgressSimulation = () => {
    setProgress(0);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    
    let cur = 0;
    progressIntervalRef.current = setInterval(() => {
      if (cur < 90) {
        const remaining = 90 - cur;
        cur += Math.max(1, remaining * 0.08);
        setProgress(Math.round(cur));
      }
    }, 120);
  };

  const handleUpscale = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);
    startProgressSimulation();

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("scale", scale);
      formData.append("mode", mode);

      const res = await fetch("/api/upscale", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Upscale failed");
      }

      const data = await res.json();

      if (data.statusUrl) {
        pollRef.current = setInterval(async () => {
          try {
            const pollRes = await fetch(data.statusUrl);
            if (!pollRes.ok) return;
            const pollData = await pollRes.json();

            if (pollData.status === "done") {
              clearInterval(pollRef.current);
              if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
              setProgress(100);
              setResult({ downloadUrl: pollData.downloadUrl });
              setLoading(false);
            } else if (pollData.status === "error") {
              clearInterval(pollRef.current);
              if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
              setError(pollData.error || "Upscale failed");
              setLoading(false);
            }
          } catch (e) {
            // ignore
          }
        }, 1000);
      } else if (data.downloadUrl) {
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        setProgress(100);
        setResult({ downloadUrl: data.downloadUrl });
        setLoading(false);
      }
    } catch (err) {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      setError(err.message || "Upscaling failed");
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    setProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <AppShell>
      <RouteShell>
        <LiquidGlassFilter>
          <div className={styles.page}>
            <p className={styles.description}>
              Enhance and upscale images by 2x or 4x using high-fidelity Lanczos sampling filters. Perfect for magnifying details and sharpening textures.
            </p>

            {!file ? (
              <div
                className={styles.uploadArea}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={40} className={styles.uploadIcon} />
                <h2>Upload Image to Enhance</h2>
                <p>Drag and drop your JPG, PNG, or WEBP photo here, or click to browse.</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className={styles.hiddenInput}
                />
              </div>
            ) : (
              <div className={styles.container}>
                {/* Configuration Card */}
                <GlassCard className={styles.configCard}>
                  <div className={styles.sectionTitle}>
                    <Maximize size={18} />
                    <h3>Enhancement Settings</h3>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Scale Factor</label>
                    <div className={styles.scaleToggleRow}>
                      <button
                        type="button"
                        className={`${styles.scaleBtn} ${scale === "2" ? styles.scaleBtnActive : ""}`}
                        onClick={() => setScale("2")}
                      >
                        2X
                        <span>Double resolution</span>
                      </button>
                      <button
                        type="button"
                        className={`${styles.scaleBtn} ${scale === "4" ? styles.scaleBtnActive : ""}`}
                        onClick={() => setScale("4")}
                      >
                        4X
                        <span>Quadruple resolution</span>
                      </button>
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Enhancement Model</label>
                    <select
                      value={mode}
                      onChange={(e) => setMode(e.target.value)}
                      className={styles.select}
                    >
                      <option value="ultra-sharp">Ultra-Sharp (Lanczos + Unsharp Mask)</option>
                      <option value="standard">Standard Sharp (High-fidelity Lanczos)</option>
                      <option value="denoise">Denoise & Scale (Smoothen & Scale)</option>
                    </select>
                  </div>

                  <div className={styles.metadataCard}>
                    <div className={styles.metaRow}>
                      <span className={styles.metaLabel}>Original Name:</span>
                      <span className={styles.metaVal}>{file.name}</span>
                    </div>
                    <div className={styles.metaRow}>
                      <span className={styles.metaLabel}>Original Size:</span>
                      <span className={styles.metaVal}>{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                    </div>
                  </div>

                  <div className={styles.actionGroup}>
                    <GlassButton
                      onClick={handleUpscale}
                      disabled={loading}
                      size="lg"
                      intensity={8}
                      className={styles.processBtn}
                    >
                      {loading ? (
                        <>
                          <RefreshCw size={16} className={styles.spin} />
                          Processing {progress}%
                        </>
                      ) : (
                        <>
                          <SparklesIcon size={16} />
                          Enhance & Upscale
                        </>
                      )}
                    </GlassButton>

                    <GlassButton
                      onClick={handleReset}
                      variant="ghost"
                      size="md"
                      intensity={2}
                      disabled={loading}
                    >
                      Cancel
                    </GlassButton>
                  </div>

                  {error && (
                    <div className={styles.errorBanner}>
                      <AlertCircle size={16} />
                      <span>{error}</span>
                    </div>
                  )}

                  {result?.downloadUrl && (
                    <GlassCard className={styles.successCard}>
                      <div className={styles.successHeading}>
                        <ShieldCheck size={18} className={styles.successIcon} />
                        <h4>Upscale Complete!</h4>
                      </div>
                      <p>Your high-resolution image is ready for download.</p>
                      <GlassButton
                        onClick={() => window.open(result.downloadUrl, "_blank")}
                        size="lg"
                        intensity={10}
                        className={styles.downloadBtn}
                      >
                        <Download size={16} />
                        Download Image
                      </GlassButton>
                    </GlassCard>
                  )}
                </GlassCard>

                {/* Preview Card */}
                <GlassCard className={styles.previewCard}>
                  <div className={styles.previewTitle}>
                    <h4>Image Preview</h4>
                  </div>
                  <div className={styles.imageFrame}>
                    <img src={previewUrl} alt="Source Preview" className={styles.previewImage} />
                  </div>
                </GlassCard>
              </div>
            )}
          </div>
        </LiquidGlassFilter>
      </RouteShell>
    </AppShell>
  );
}

// Simple Sparkles SVG Icon inline to avoid dependency mismatch
function SparklesIcon({ size = 16, ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275Z" />
      <path d="m5 3 1 2.5L8.5 6 6 7 5 9.5 4 7 1.5 6 4 5Z" />
      <path d="m19 17 1 2.5 2.5.5-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1Z" />
    </svg>
  );
}
