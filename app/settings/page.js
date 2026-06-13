import { Server, Wrench, HardDrive, Shield } from "lucide-react";
import AppShell from "@/components/AppShell";
import RouteShell from "@/components/RouteShell";
import GlassCard from "@/components/GlassCard";
import styles from "@/app/settings/page.module.css";

const requirements = [
  {
    icon: Server,
    title: "Persistent Node host",
    copy: "This app runs a real Node.js server with long-running conversion processes. It needs a VPS or Docker container — not serverless.",
  },
  {
    icon: Wrench,
    title: "CLI tools installed",
    copy: "FFmpeg for video/audio, LibreOffice for documents, ImageMagick for images, Ghostscript for PDFs, and zip/tar/7z for archives.",
  },
  {
    icon: HardDrive,
    title: "Temporary disk space",
    copy: "Files are stored temporarily during conversion and cleaned up after download. The server needs enough space for concurrent jobs.",
  },
  {
    icon: Shield,
    title: "Privacy-first design",
    copy: "All conversions happen on our server. Your files are never shared with third parties and are deleted after processing.",
  },
];

export const metadata = {
  title: "Server setup — Converter by The Atom",
  description:
    "Production notes for running Converter by The Atom with FFmpeg, LibreOffice, ImageMagick, and a persistent Node environment.",
};

export default function SettingsPage() {
  return (
    <AppShell>
      <RouteShell>
        <div className={styles.page}>
          <div className={styles.header}>
            <span className="eyebrow">Production setup</span>
            <h1>What this app needs under the hood</h1>
            <p>
              The interface is intentionally simple for users. This page shows
              the server requirements and CLI tools needed for file conversion.
            </p>
          </div>

          <div className={styles.grid}>
            {requirements.map((item) => {
              const Icon = item.icon;
              return (
                <GlassCard key={item.title} className={styles.card}>
                  <div className={styles.iconWrap}>
                    <Icon size={18} />
                  </div>
                  <h2>{item.title}</h2>
                  <p>{item.copy}</p>
                </GlassCard>
              );
            })}
          </div>

          <GlassCard className={styles.codeCard}>
            <h2>Recommended server commands</h2>
            <pre>{`# Install system dependencies
sudo apt update
sudo apt install -y ffmpeg libreoffice imagemagick \\
  ghostscript pdftk p7zip-full wkhtmltopdf \\
  python3 python3-pip

# Install Node dependencies
npm install
npm run build
npm start`}</pre>
          </GlassCard>
        </div>
      </RouteShell>
    </AppShell>
  );
}
