import Link from "next/link";
import AppShell from "@/components/AppShell";
import RouteShell from "@/components/RouteShell";
import styles from "@/app/blog/blog.module.css";

export const metadata = {
  title: "How it works — Converter by The Atom",
  description:
    "Learn how to convert files between 200+ formats for free. Guides for documents, images, video, audio, archives, and more.",
  alternates: { canonical: "/blog" },
};

const posts = [
  {
    slug: "getting-started",
    title: "Getting Started with Converter by The Atom",
    description:
      "Everything you need to know about converting files online — from documents and images to videos and archives. Step-by-step guide for beginners.",
    date: "2025-01-15",
    readTime: "4 min read",
    tag: "Guide",
  },
  {
    slug: "convert-images-online",
    title: "How to Convert Images Between Formats (PNG, JPG, WEBP, HEIC)",
    description:
      "Convert any image format to another — including HEIC to JPG, PNG to WEBP, and RAW to standard formats. Resize, compress, and add watermarks too.",
    date: "2025-01-25",
    readTime: "3 min read",
    tag: "Images",
  },
  {
    slug: "convert-video-formats",
    title: "Convert Videos Between Formats — MP4, MOV, MKV, AVI & More",
    description:
      "Full guide to converting video files between any format. Change codecs, adjust bitrate and resolution, or extract audio from video.",
    date: "2025-02-05",
    readTime: "5 min read",
    tag: "Video",
  },
  {
    slug: "pdf-tools-guide",
    title: "PDF Tools — Merge, Compress, Split, and Convert PDFs",
    description:
      "How to merge multiple PDFs, compress them for email, convert PDFs to Word or images, and split PDFs into individual pages.",
    date: "2025-02-15",
    readTime: "4 min read",
    tag: "PDF",
  },
  {
    slug: "audio-conversion-guide",
    title: "Audio Conversion — MP3, WAV, FLAC, AAC & More",
    description:
      "Convert audio files between lossy and lossless formats. Adjust bitrate, sample rate, and channels for the perfect audio file.",
    date: "2025-03-01",
    readTime: "3 min read",
    tag: "Audio",
  },
  {
    slug: "website-screenshots",
    title: "How to Capture Full-Page Website Screenshots as PDF or Image",
    description:
      "Take full-page screenshots of any website and save them as PDF, PNG, or JPG — no browser extensions needed.",
    date: "2025-03-10",
    readTime: "3 min read",
    tag: "Web",
  },
];

export default function BlogPage() {
  return (
    <AppShell>
      <RouteShell>
        <div className={styles.page}>
          <div className={styles.header}>
            <h1>How it works</h1>
            <p>
              Guides and tips for converting files between 200+ formats —
              documents, images, video, audio, archives, and more.
            </p>
          </div>

          <div className={styles.grid}>
            {posts.map((post) => (
              <article key={post.slug} className={styles.card}>
                <div className={styles.cardTag}>{post.tag}</div>
                <h2 className={styles.cardTitle}>{post.title}</h2>
                <p className={styles.cardDesc}>{post.description}</p>
                <div className={styles.cardMeta}>
                  <span>
                    {new Date(post.date).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span>&middot;</span>
                  <span>{post.readTime}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </RouteShell>
    </AppShell>
  );
}
