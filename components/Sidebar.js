"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowLeftRight,
  FileText,
  Image,
  Video,
  Music,
  Archive,
  Globe,
  SlidersHorizontal,
  X,
  Coffee,
  BookOpen
} from "lucide-react";
import { GlassButton } from "@zakisheriff/liquid-glass";
import styles from "@/components/Sidebar.module.css";

const navigation = [
  { label: "Convert", href: "/convert", icon: ArrowLeftRight },
  { label: "PDF Tools", href: "/pdf-tools", icon: FileText },
  { label: "Image Tools", href: "/image-tools", icon: Image },
  { label: "Video Tools", href: "/video-tools", icon: Video },
  { label: "Audio Tools", href: "/audio-tools", icon: Music },
  { label: "Archive Tools", href: "/archive-tools", icon: Archive },
  { label: "Website Capture", href: "/website-capture", icon: Globe },
  { label: "How it works", href: "/blog", icon: BookOpen },
];

export default function Sidebar({ mobileOpen, onClose, hideDesktop = false }) {
  const pathname = usePathname();
  const router = useRouter();

  // Lock body scroll on mobile open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [mobileOpen]);

  const content = (
    <div className={styles.sidebar}>
      <div className={styles.logoRow}>
        <Link href="/" className={styles.logo} onClick={onClose}>
          <img
            src="/converter-logo.png"
            alt="Converter by The Atom Logo"
            className={styles.logoImg}
          />
          <div className={styles.logoCopy}>
            <strong>Go Home</strong>
            <small>converter.theatom.lk</small>
          </div>
        </Link>
        <button
          className={styles.closeMobileButton}
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          aria-label="Close menu"
        >
          <X size={18} />
        </button>
      </div>

      <nav className={styles.nav}>
        {navigation.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <GlassButton
              key={item.href}
              onClick={(e) => {
                e.stopPropagation();
                onClose?.();
                router.push(item.href);
              }}
              size="lg"
              variant={active ? "default" : "ghost"}
              intensity={active ? 6 : 2}
              className={`${styles.linkGlass} ${active ? styles.active : ""}`}
              style={{
                width: "100%",
                justifyContent: "flex-start",
                gap: "12px"
              }}
            >
              <Icon size={18} />
              <span className={styles.linkLabel}>{item.label}</span>
            </GlassButton>
          );
        })}
        <GlassButton
          onClick={(e) => {
            e.stopPropagation();
            onClose?.();
            window.open("https://buymeacoffee.com/theoneatom", "_blank", "noopener,noreferrer");
          }}
          size="lg"
          intensity={6}
          className={styles.coffeeLinkGlass}
          style={{
            width: "100%",
            justifyContent: "flex-start",
            gap: "12px"
          }}
          aria-label="Buy The Atom a coffee"
        >
          <Coffee size={16} />
          <span className={styles.linkLabel}>Buy me a coffee</span>
        </GlassButton>
      </nav>
    </div>
  );

  return (
    <>
      {!hideDesktop ? (
        <aside className={styles.desktop}>{content}</aside>
      ) : null}
      <div className={`${styles.mobileWrap} ${mobileOpen ? styles.mobileWrapOpen : ""}`}>
        <button
          className={styles.backdrop}
          onClick={onClose}
          aria-label="Close sidebar"
        />
        <div className={`${styles.mobile} ${mobileOpen ? styles.mobileOpen : ""}`}>{content}</div>
      </div>
    </>
  );
}
