"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, Trash2, Download, Droplets, Paintbrush, Eraser, Sparkles, RefreshCw } from "lucide-react";
import { LiquidGlassFilter, GlassButton } from "@zakisheriff/liquid-glass";
import AppShell from "@/components/AppShell";
import RouteShell from "@/components/RouteShell";
import GlassCard from "@/components/GlassCard";
import styles from "./page.module.css";

export default function WatermarkRemoverPage() {
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState("");
  const [brushSize, setBrushSize] = useState(24);
  const [tool, setTool] = useState("brush"); // "brush" | "eraser"
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasWatermarkRemoved, setHasWatermarkRemoved] = useState(false);

  const containerRef = useRef(null);
  const imageCanvasRef = useRef(null);
  const maskCanvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0, displayWidth: 0, displayHeight: 0 });
  const [originalImageSrc, setOriginalImageSrc] = useState(null);

  // Load image onto Canvas
  useEffect(() => {
    if (!image) return;

    const img = new Image();
    img.src = image;
    img.onload = () => {
      const containerWidth = Math.min(containerRef.current?.clientWidth || 800, 800);
      const scale = Math.min(containerWidth / img.width, 500 / img.height, 1);
      
      const displayWidth = img.width * scale;
      const displayHeight = img.height * scale;

      setDimensions({
        width: img.width,
        height: img.height,
        displayWidth,
        displayHeight,
      });

      // Setup Image Canvas
      const imgCanvas = imageCanvasRef.current;
      imgCanvas.width = img.width;
      imgCanvas.height = img.height;
      const imgCtx = imgCanvas.getContext("2d");
      imgCtx.drawImage(img, 0, 0);

      // Setup Mask Canvas
      const maskCanvas = maskCanvasRef.current;
      maskCanvas.width = img.width;
      maskCanvas.height = img.height;
      const maskCtx = maskCanvas.getContext("2d");
      maskCtx.clearRect(0, 0, img.width, img.height);
    };
  }, [image]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target.result);
        setOriginalImageSrc(event.target.result);
        setHasWatermarkRemoved(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const getCanvasMousePos = (e) => {
    const maskCanvas = maskCanvasRef.current;
    if (!maskCanvas) return { x: 0, y: 0 };
    const rect = maskCanvas.getBoundingClientRect();
    
    // Calculate scale between canvas display size and actual buffer dimensions
    const scaleX = maskCanvas.width / rect.width;
    const scaleY = maskCanvas.height / rect.height;

    // Support touch events
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const maskCtx = maskCanvasRef.current?.getContext("2d");
    if (maskCtx) maskCtx.beginPath();
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    
    const maskCanvas = maskCanvasRef.current;
    const maskCtx = maskCanvas?.getContext("2d");
    if (!maskCanvas || !maskCtx) return;

    const { x, y } = getCanvasMousePos(e);

    maskCtx.lineWidth = brushSize * (maskCanvas.width / maskCanvas.getBoundingClientRect().width);
    maskCtx.lineCap = "round";
    maskCtx.lineJoin = "round";

    if (tool === "brush") {
      maskCtx.strokeStyle = "rgba(239, 68, 68, 0.6)"; // Translucent red
      maskCtx.globalCompositeOperation = "source-over";
    } else {
      // Eraser
      maskCtx.globalCompositeOperation = "destination-out";
    }

    maskCtx.lineTo(x, y);
    maskCtx.stroke();
    maskCtx.beginPath();
    maskCtx.moveTo(x, y);
  };

  const handleClearMask = () => {
    const maskCanvas = maskCanvasRef.current;
    const maskCtx = maskCanvas?.getContext("2d");
    if (maskCanvas && maskCtx) {
      maskCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
    }
  };

  const handleResetImage = () => {
    if (originalImageSrc) {
      const img = new Image();
      img.src = originalImageSrc;
      img.onload = () => {
        const imgCanvas = imageCanvasRef.current;
        const imgCtx = imgCanvas?.getContext("2d");
        if (imgCanvas && imgCtx) {
          imgCtx.clearRect(0, 0, imgCanvas.width, imgCanvas.height);
          imgCtx.drawImage(img, 0, 0);
        }
        handleClearMask();
        setHasWatermarkRemoved(false);
      };
    }
  };

  // Run in-painting watermark remover
  const handleRemoveWatermark = () => {
    const imgCanvas = imageCanvasRef.current;
    const maskCanvas = maskCanvasRef.current;
    if (!imgCanvas || !maskCanvas) return;

    setIsProcessing(true);

    // Run in timeout to allow loader UI to show
    setTimeout(() => {
      try {
        const width = imgCanvas.width;
        const height = imgCanvas.height;
        const imgCtx = imgCanvas.getContext("2d");
        const maskCtx = maskCanvas.getContext("2d");

        const imgData = imgCtx.getImageData(0, 0, width, height);
        const maskData = maskCtx.getImageData(0, 0, width, height);
        
        const pixels = imgData.data;
        const mask = maskData.data;

        // Perform spatial neighborhood interpolation to fill mask
        const len = pixels.length;
        const isMasked = new Uint8Array(len / 4);
        let hasMaskPixels = false;

        for (let i = 0; i < len; i += 4) {
          if (mask[i + 3] > 10) {
            isMasked[i / 4] = 1;
            hasMaskPixels = true;
          }
        }

        if (!hasMaskPixels) {
          setIsProcessing(false);
          return;
        }

        const maxPasses = 8;
        const radius = 6;
        let passes = 0;
        let unresolved = true;

        while (unresolved && passes < maxPasses) {
          passes++;
          unresolved = false;
          const resolvedThisPass = [];

          for (let pIdx = 0; pIdx < isMasked.length; pIdx++) {
            if (isMasked[pIdx] === 0) continue;

            const x = pIdx % width;
            const y = Math.floor(pIdx / width);

            let rSum = 0, gSum = 0, bSum = 0, wSum = 0;

            // Search neighborhood
            for (let dy = -radius; dy <= radius; dy++) {
              for (let dx = -radius; dx <= radius; dx++) {
                const nx = x + dx;
                const ny = y + dy;
                if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                  const npIdx = ny * width + nx;
                  if (isMasked[npIdx] === 0) {
                    const distSq = dx * dx + dy * dy;
                    if (distSq <= radius * radius) {
                      const dist = Math.sqrt(distSq) || 0.1;
                      const weight = 1.0 / (dist * dist);
                      const nI = npIdx * 4;
                      rSum += pixels[nI] * weight;
                      gSum += pixels[nI + 1] * weight;
                      bSum += pixels[nI + 2] * weight;
                      wSum += weight;
                    }
                  }
                }
              }
            }

            if (wSum > 0) {
              resolvedThisPass.push({
                idx: pIdx,
                r: rSum / wSum,
                g: gSum / wSum,
                b: bSum / wSum
              });
            } else {
              unresolved = true; // Still has pixels with no resolved neighbors
            }
          }

          // Apply updates
          for (const item of resolvedThisPass) {
            const i = item.idx * 4;
            pixels[i] = item.r;
            pixels[i + 1] = item.g;
            pixels[i + 2] = item.b;
            isMasked[item.idx] = 0;
          }

          if (resolvedThisPass.length === 0) {
            break; // Avoid infinite loop if completely stuck
          }
        }

        imgCtx.putImageData(imgData, 0, 0);
        handleClearMask();
        setHasWatermarkRemoved(true);
      } catch (err) {
        console.error(err);
      } finally {
        setIsProcessing(false);
      }
    }, 100);
  };

  const handleDownload = () => {
    const imgCanvas = imageCanvasRef.current;
    if (!imgCanvas) return;

    const dataUrl = imgCanvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = imageName.replace(/\.[^.]+$/, "_clean.png");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <AppShell>
      <RouteShell>
        <LiquidGlassFilter>
          <div className={styles.page}>
            <p className={styles.description}>
              Erase watermarks, logos, timestamps, or unwanted objects from your images. Select a photo, brush over the watermark, and hit Remove.
            </p>

            {!image ? (
              <div
                className={styles.uploadArea}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={40} className={styles.uploadIcon} />
                <h2>Upload Image to Clean</h2>
                <p>Drag and drop your JPG, PNG, or WEBP image here, or click to browse.</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className={styles.hiddenInput}
                />
              </div>
            ) : (
              <div className={styles.editorLayout}>
                {/* Tools Toolbar */}
                <GlassCard className={styles.toolbar}>
                  <div className={styles.toolGroup}>
                    <GlassButton
                      onClick={() => setTool("brush")}
                      intensity={tool === "brush" ? 8 : 2}
                      className={tool === "brush" ? styles.activeTool : ""}
                      size="md"
                      title="Brush Tool"
                    >
                      <Paintbrush size={16} />
                      Brush
                    </GlassButton>
                    <GlassButton
                      onClick={() => setTool("eraser")}
                      intensity={tool === "eraser" ? 8 : 2}
                      className={tool === "eraser" ? styles.activeTool : ""}
                      size="md"
                      title="Eraser Tool"
                    >
                      <Eraser size={16} />
                      Eraser
                    </GlassButton>
                  </div>

                  <div className={styles.brushSizeWrapper}>
                    <span className={styles.toolbarLabel}>Brush Size: {brushSize}px</span>
                    <input
                      type="range"
                      min={5}
                      max={80}
                      value={brushSize}
                      onChange={(e) => setBrushSize(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                  </div>

                  <div className={styles.divider} />

                  <div className={styles.actionGroup}>
                    <GlassButton onClick={handleClearMask} variant="ghost" size="md" intensity={2}>
                      <Trash2 size={15} />
                      Clear Stroke
                    </GlassButton>
                    <GlassButton onClick={handleResetImage} variant="ghost" size="md" intensity={2}>
                      <RefreshCw size={14} />
                      Reset Image
                    </GlassButton>
                  </div>

                  <div className={styles.divider} />

                  <GlassButton
                    onClick={handleRemoveWatermark}
                    disabled={isProcessing}
                    size="lg"
                    intensity={8}
                    className={styles.processBtn}
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw size={16} className={styles.spin} />
                        Erasing...
                      </>
                    ) : (
                      <>
                        <Sparkles size={16} />
                        Remove Watermark
                      </>
                    )}
                  </GlassButton>

                  {hasWatermarkRemoved && (
                    <GlassButton
                      onClick={handleDownload}
                      size="lg"
                      intensity={10}
                      className={styles.downloadBtn}
                    >
                      <Download size={16} />
                      Download Clean Image
                    </GlassButton>
                  )}
                </GlassCard>

                {/* Canvas Editor Frame */}
                <div ref={containerRef} className={styles.canvasContainer}>
                  <div
                    className={styles.canvasWrapper}
                    style={{
                      width: dimensions.displayWidth || "100%",
                      height: dimensions.displayHeight || 400,
                    }}
                  >
                    {/* Image Canvas */}
                    <canvas
                      ref={imageCanvasRef}
                      className={styles.imageCanvas}
                    />
                    
                    {/* Brush Stroke Overlay Canvas */}
                    <canvas
                      ref={maskCanvasRef}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={draw}
                      onTouchEnd={stopDrawing}
                      className={styles.maskCanvas}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </LiquidGlassFilter>
      </RouteShell>
    </AppShell>
  );
}
