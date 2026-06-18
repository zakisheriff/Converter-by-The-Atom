"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, Download, Scissors, RefreshCw, AlertCircle, ShieldCheck, Sparkles } from "lucide-react";
import { LiquidGlassFilter, GlassButton } from "@zakisheriff/liquid-glass";
import AppShell from "@/components/AppShell";
import RouteShell from "@/components/RouteShell";
import GlassCard from "@/components/GlassCard";
import styles from "./page.module.css";

export default function BackgroundRemoverPage() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

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
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setResult(null);
      setError(null);
      setProgress(0);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const selectedFile = e.dataTransfer?.files?.[0];
    if (selectedFile && selectedFile.type.startsWith("image/")) {
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

  const handleRemoveBackground = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);
    startProgressSimulation();

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/bg-remover", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Background removal failed");
      }

      const data = await res.json();

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
            setError(pollData.error || "Background removal failed");
            setLoading(false);
          }
        } catch (e) {
          // ignore transient poll errors
        }
      }, 1000);
    } catch (err) {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      setError(err.message || "Background removal failed");
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
              Remove backgrounds with AI-powered precision (ISNet segmentation + alpha matting) for clean, hair-detail-preserving cutouts. Upload a photo to get a transparent PNG.
            </p>

            {!file ? (
              <div
                className={`${styles.uploadArea} ${isDragging ? styles.uploadAreaActive : ""}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={40} className={styles.uploadIcon} />
                <h2>Upload Image</h2>
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
                <GlassCard className={styles.configCard}>
                  <div className={styles.sectionTitle}>
                    <Scissors size={18} />
                    <h3>Background Removal</h3>
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
                      onClick={handleRemoveBackground}
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
                          <Sparkles size={16} />
                          Remove Background
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
                        <h4>Background Removed!</h4>
                      </div>
                      <p>Your transparent PNG is ready for download.</p>
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

                <GlassCard className={styles.previewCard}>
                  <div className={styles.previewTitle}>
                    <h4>{result?.downloadUrl ? "Result Preview" : "Image Preview"}</h4>
                  </div>
                  <div className={styles.imageFrame}>
                    <img
                      src={result?.downloadUrl || previewUrl}
                      alt="Preview"
                      className={styles.previewImage}
                    />
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
