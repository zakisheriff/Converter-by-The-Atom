"use client";

import { useState, useRef, useEffect } from "react";
import { QrCode, Download, RotateCcw, X, Upload } from "lucide-react";
import { LiquidGlassFilter, GlassButton } from "@zakisheriff/liquid-glass";
import AppShell from "@/components/AppShell";
import RouteShell from "@/components/RouteShell";
import GlassCard from "@/components/GlassCard";
import styles from "./page.module.css";
import QRCode from "qrcode";

export default function QrGeneratorPage() {
  const [text, setText] = useState("https://converter.theatom.lk");
  const [size, setSize] = useState(256);
  const [margin, setMargin] = useState(2);
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [errorLevel, setErrorLevel] = useState("M");
  const [logo, setLogo] = useState(null);
  const [logoSize, setLogoSize] = useState(20); // Percentage of QR code size
  const [downloadFormat, setDownloadFormat] = useState("png");
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // Re-generate QR code whenever parameters change
  useEffect(() => {
    if (!canvasRef.current) return;

    const generateQR = async () => {
      try {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Generate base QR code to canvas
        await QRCode.toCanvas(canvas, text || " ", {
          width: size,
          margin: margin,
          errorCorrectionLevel: errorLevel,
          color: {
            dark: fgColor,
            light: bgColor,
          },
        });

        // Overlay Logo if exists
        if (logo) {
          const img = new Image();
          img.src = logo;
          img.onload = () => {
            const qrWidth = canvas.width;
            
            // Calculate logo bounding box
            const lSize = (qrWidth * logoSize) / 100;
            const x = (qrWidth - lSize) / 2;
            const y = (qrWidth - lSize) / 2;

            // Draw clean background block for logo
            ctx.fillStyle = bgColor;
            ctx.fillRect(x - 2, y - 2, lSize + 4, lSize + 4);

            // Draw Logo
            ctx.drawImage(img, x, y, lSize, lSize);
          };
        }
      } catch (err) {
        console.error("Failed to generate QR code", err);
      }
    };

    generateQR();
  }, [text, size, margin, fgColor, bgColor, errorLevel, logo, logoSize]);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogo(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogo(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;

    if (downloadFormat === "svg") {
      // SVG mode uses QRCode.toString
      QRCode.toString(text || " ", {
        type: "svg",
        width: size,
        margin: margin,
        errorCorrectionLevel: errorLevel,
        color: {
          dark: fgColor,
          light: bgColor,
        },
      }, (err, svgString) => {
        if (err) return console.error(err);
        const blob = new Blob([svgString], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "qrcode.svg";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    } else {
      // PNG mode
      const url = canvasRef.current.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = "qrcode.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleReset = () => {
    setText("https://converter.theatom.lk");
    setSize(256);
    setMargin(2);
    setFgColor("#000000");
    setBgColor("#ffffff");
    setErrorLevel("M");
    removeLogo();
    setLogoSize(20);
  };

  return (
    <AppShell>
      <RouteShell>
        <LiquidGlassFilter>
          <div className={styles.page}>
            <p className={styles.description}>
              Generate high-quality, fully customizable QR codes with custom colors, size, error correction, and embedded logos.
            </p>

            <div className={styles.container}>
              {/* Controls Column */}
              <GlassCard className={styles.controlsCard}>
                <div className={styles.sectionTitle}>
                  <QrCode size={18} />
                  <h3>QR Code Content & Style</h3>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Text / URL</label>
                  <textarea
                    rows={3}
                    placeholder="Enter text or paste link here to encode..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className={styles.textarea}
                  />
                </div>

                <div className={styles.row}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Foreground Color</label>
                    <div className={styles.colorPickerWrapper}>
                      <input
                        type="color"
                        value={fgColor}
                        onChange={(e) => setFgColor(e.target.value)}
                        className={styles.colorPicker}
                      />
                      <input
                        type="text"
                        value={fgColor}
                        onChange={(e) => setFgColor(e.target.value)}
                        className={styles.colorText}
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Background Color</label>
                    <div className={styles.colorPickerWrapper}>
                      <input
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className={styles.colorPicker}
                      />
                      <input
                        type="text"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className={styles.colorText}
                      />
                    </div>
                  </div>
                </div>

                <div className={styles.row}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Error Correction</label>
                    <select
                      value={errorLevel}
                      onChange={(e) => setErrorLevel(e.target.value)}
                      className={styles.select}
                    >
                      <option value="L">Low (7% recovery)</option>
                      <option value="M">Medium (15% recovery)</option>
                      <option value="Q">Quartile (25% recovery)</option>
                      <option value="H">High (30% recovery - recommended for logos)</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Margin (Quiet Zone)</label>
                    <input
                      type="number"
                      min={0}
                      max={10}
                      value={margin}
                      onChange={(e) => setMargin(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                </div>

                {/* Logo Uploader */}
                <div className={styles.formGroup}>
                  <label className={styles.label}>Embed Logo / Icon</label>
                  {!logo ? (
                    <div
                      className={styles.uploadBox}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload size={20} className={styles.uploadIcon} />
                      <span>Upload Logo</span>
                      <small>PNG/JPG works best. Error correction will automatically adjust to overlay safely.</small>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className={styles.hiddenInput}
                      />
                    </div>
                  ) : (
                    <div className={styles.logoPreviewContainer}>
                      <img src={logo} alt="Logo" className={styles.logoPreview} />
                      <div className={styles.logoConfig}>
                        <div className={styles.logoConfigRow}>
                          <span className={styles.logoFilename}>Logo added</span>
                          <button onClick={removeLogo} className={styles.removeLogoBtn} title="Remove logo">
                            <X size={14} />
                          </button>
                        </div>
                        <div className={styles.sliderGroup}>
                          <label className={styles.sliderLabel}>
                            Logo size: {logoSize}%
                          </label>
                          <input
                            type="range"
                            min={10}
                            max={30}
                            value={logoSize}
                            onChange={(e) => setLogoSize(parseInt(e.target.value))}
                            className={styles.slider}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </GlassCard>

              {/* Preview Column */}
              <div className={styles.previewColumn}>
                <GlassCard className={styles.previewCard}>
                  <div className={styles.previewTitle}>
                    <h4>Live Preview</h4>
                    <span className={styles.previewSize}>{size} × {size} px</span>
                  </div>

                  <div className={styles.qrFrame} style={{ backgroundColor: bgColor }}>
                    <canvas ref={canvasRef} className={styles.canvas} />
                  </div>

                  <div className={styles.downloadRow}>
                    <select
                      value={downloadFormat}
                      onChange={(e) => setDownloadFormat(e.target.value)}
                      className={styles.downloadSelect}
                    >
                      <option value="png">PNG (Raster)</option>
                      <option value="svg">SVG (Vector)</option>
                    </select>

                    <GlassButton
                      onClick={handleDownload}
                      size="lg"
                      intensity={6}
                      className={styles.downloadBtn}
                    >
                      <Download size={16} />
                      Download
                    </GlassButton>
                  </div>

                  <GlassButton
                    onClick={handleReset}
                    variant="ghost"
                    size="sm"
                    intensity={2}
                    className={styles.resetBtn}
                  >
                    <RotateCcw size={12} />
                    Reset to Default
                  </GlassButton>
                </GlassCard>
              </div>
            </div>
          </div>
        </LiquidGlassFilter>
      </RouteShell>
    </AppShell>
  );
}
