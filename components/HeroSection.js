"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  FileText,
  Image,
  Video,
  Music,
  Archive,
  BookOpen,
} from "lucide-react";
import styles from "@/components/HeroSection.module.css";
import {
  useGlassEffect,
  GlassButton,
  LiquidGlassFilter,
} from "@zakisheriff/liquid-glass";

const CoffeeIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="currentColor"
    style={{ display: "block", flexShrink: 0 }}
  >
    <path d="M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.11 0 2-.89 2-2V5c0-1.11-.89-2-2-2zm0 5h-2V5h2v3zM4 19h16v2H4z" />
  </svg>
);

function CustomGlassDropCard({
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
        <div className={`${styles.dropCardContent} lg-content`}>{children}</div>
      </div>
    </div>
  );
}

const categoryBadges = [
  { label: "Documents", icon: FileText, size: 16 },
  { label: "Images", icon: Image, size: 16 },
  { label: "Videos", icon: Video, size: 16 },
  { label: "Audio", icon: Music, size: 16 },
  { label: "E-books", icon: BookOpen, size: 16 },
  { label: "Archives", icon: Archive, size: 16 },
];

export default function HeroSection() {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const router = useRouter();

  const handleFiles = (files) => {
    if (!files || files.length === 0) return;
    const { setPendingFiles } = require("@/utils/clientFileStore");
    setPendingFiles(files);
    router.push("/convert");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleBrowse = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e) => {
    handleFiles(e.target.files);
    e.target.value = "";
  };

  return (
    <LiquidGlassFilter>
      <section className={styles.hero}>
        <nav className={styles.topNav}>
          <div className={styles.topNavActions}>
            <GlassButton
              onClick={(e) => {
                e.stopPropagation();
                router.push("/blog");
              }}
              size="md"
              intensity={6}
              className={styles.topNavLinkGlass}
            >
              How it works
            </GlassButton>
            <GlassButton
              onClick={(e) => {
                e.stopPropagation();
                window.open(
                  "https://buymeacoffee.com/theoneatom",
                  "_blank",
                  "noopener,noreferrer",
                );
              }}
              size="md"
              intensity={6}
              className={styles.topNavCoffeeGlass}
              aria-label="Buy The Atom a coffee"
            >
              <CoffeeIcon />
              <span className={styles.coffeeText}>Support</span>
            </GlassButton>
          </div>
        </nav>

        <div className={styles.glow} />
        <div className={styles.content}>
          <h1 className={styles.title}>Convert anything.</h1>

          <CustomGlassDropCard
            className={`${styles.dropCard} ${isDragging ? styles.dropCardActive : ""}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div className={styles.dropZone} onClick={handleBrowse}>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className={styles.hiddenInput}
                onChange={handleFileInputChange}
                accept="*/*"
              />
              <div className={styles.dropIcon}>
                <Upload size={32} />
              </div>
              <strong className={styles.dropTitle}>
                {isDragging
                  ? "Drop files here"
                  : "Drop files or click to browse"}
              </strong>
              <p className={styles.dropSubtitle}>
                Documents, images, video, audio, archives — 200+ formats
                supported
              </p>
            </div>
            <GlassButton
              onClick={(e) => {
                e.stopPropagation();
                handleBrowse();
              }}
              className={styles.startBtn}
              size="lg"
              intensity={6}
            >
              Choose files
            </GlassButton>
          </CustomGlassDropCard>

          <div className={styles.categoryRow} aria-label="Supported categories">
            {categoryBadges.map((cat) => {
              const Icon = cat.icon;
              return (
                <div key={cat.label} className={styles.categoryBadge}>
                  <Icon size={cat.size} />
                  <span>{cat.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </LiquidGlassFilter>
  );
}
