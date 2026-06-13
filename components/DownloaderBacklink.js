"use client";

import GlassCard from "./GlassCard";
import { GlassButton } from "@zakisheriff/liquid-glass";
import styles from "./DownloaderBacklink.module.css";

export default function DownloaderBacklink({ type = "general" }) {
  let text = "";
  if (type === "video") {
    text = "Don't have a video to convert? Download high-quality videos from YouTube, Instagram, X (Twitter), TikTok, Facebook, and more for free.";
  } else if (type === "audio") {
    text = "Don't have an audio file to convert? Download audio and videos from YouTube, Instagram, X (Twitter), TikTok, Facebook, and more for free.";
  } else if (type === "image") {
    text = "Don't have an image to convert or edit? Download photos, thumbnails, and media from Instagram, YouTube, X (Twitter), TikTok, Facebook, and more for free.";
  } else {
    text = "Need to download media first? Download high-quality videos, audio, and images from YouTube, Instagram, X (Twitter), TikTok, Facebook, and more for free.";
  }

  return (
    <GlassCard className={styles.backlinkCard}>
      <div className={styles.content}>
        <p className={styles.text}>
          {text}
        </p>
      </div>
      <GlassButton
        onClick={() => window.open("https://downloader.theatom.lk", "_blank", "noopener,noreferrer")}
        size="md"
        intensity={6}
        className={styles.linkButton}
      >
        downloader.theatom.lk
      </GlassButton>
    </GlassCard>
  );
}
