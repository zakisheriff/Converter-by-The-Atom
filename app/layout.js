import "./globals.css";
import RouteShell from "@/components/RouteShell";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import { DepthModeProvider } from "@/components/providers/DepthModeProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { Analytics } from "@vercel/analytics/next";
import "@zakisheriff/liquid-glass/styles.css";

const siteUrl = "https://converter.theatom.lk";
const siteTitle =
  "Converter by The Atom — Free Online File Converter for 200+ Formats";
const siteDescription =
  "The fastest free online file converter. Convert documents, PDFs, images, videos, audio, and archives between 200+ formats instantly — no sign‑up, no ads, no limits. Secure and powered by FFmpeg, LibreOffice, and ImageMagick.";

export const metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "Converter by The Atom",
  title: {
    default: siteTitle,
    template: `%s | Converter by The Atom`,
  },
  description: siteDescription,
  keywords: [
    // Brand
    "Converter by The Atom",
    "The Atom converter",
    "theatom converter",
    "converter theatom lk",
    "Sri Lanka file converter",
    "best free file converter",
    // Documents & PDF
    "free PDF converter online",
    "Word to PDF converter",
    "convert Word to PDF free",
    "merge PDF files online",
    "compress PDF online free",
    "convert PDF to Word",
    "PDF to JPG converter",
    "EPUB to PDF converter",
    "PDF editor tools free",
    "split PDF online",
    // Images
    "HEIC to JPG converter",
    "convert HEIC to JPG free",
    "WEBP converter online",
    "convert PNG to WEBP",
    "convert JPG to PNG",
    "resize image online free",
    "compress images without losing quality",
    "SVG converter online",
    "GIF maker and converter",
    "convert HEIC to PNG",
    // Videos & Audio
    "video to audio converter",
    "convert MP4 to MP3",
    "MOV to MP4 converter free",
    "convert video to MP4 online",
    "MP3 converter online",
    "convert WAV to MP3 free",
    "extract audio from video",
    "M4A to MP3 converter",
    "audio converter online free",
    "MKV to MP4 converter",
    // Archives & Compression
    "ZIP file maker online",
    "unzip files online free",
    "convert ZIP to TAR",
    "7Z to ZIP converter",
    "extract RAR files online",
    // Website Capture
    "website to PDF converter",
    "capture webpage to PNG",
    "save webpage as PDF link",
    "webpage screenshot tool online",
    // Generic & SEO
    "free file converter online no ads",
    "convert files online no signup",
    "cloud convert alternative free",
    "safe online file converter",
    "batch file converter online",
    "best free file converter 2024",
    "best free file converter 2025",
    "convert file from URL"
  ],
  authors: [{ name: "The Atom", url: "https://theatom.lk" }],
  creator: "The Atom",
  publisher: "The Atom",
  category: "technology",
  classification: "File Converter Tool",
  alternates: { canonical: "/" },
  icons: {
    icon: [
      { url: "/converter-logo.png", type: "image/png" },
    ],
    shortcut: ["/converter-logo.png"],
    apple: [{ url: "/converter-logo.png", sizes: "512x512", type: "image/png" }],
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Converter by The Atom",
    title: siteTitle,
    description: siteDescription,
    locale: "en_US",
    images: [
      {
        url: "/converter-logo.png",
        width: 1200,
        height: 630,
        alt: "Converter by The Atom — Free online file converter for documents, images, video and audio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    creator: "@theoneatom",
    images: ["/converter-logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fafafa",
  colorScheme: "light",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${siteUrl}/#webapp`,
      name: "Converter by The Atom",
      url: siteUrl,
      description: siteDescription,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any",
      browserRequirements: "Any modern browser",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      featureList: [
        "200+ file format support",
        "Document conversion (PDF, DOCX, ODT, etc.)",
        "Image conversion (PNG, JPG, WEBP, HEIC, etc.)",
        "Video conversion (MP4, MOV, MKV, etc.)",
        "Audio conversion (MP3, WAV, FLAC, etc.)",
        "Archive tools (ZIP, TAR, 7Z, etc.)",
        "PDF tools (merge, compress, extract)",
        "Website capture to PDF/PNG/JPG",
        "No account required",
        "No ads",
      ],
      creator: {
        "@type": "Person",
        name: "The Atom",
        url: "https://theatom.lk",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Converter by The Atom",
      description: siteDescription,
      publisher: { "@type": "Person", name: "The Atom" },
    },
    {
      "@type": "FAQPage",
      "@id": `${siteUrl}/#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: "What file formats are supported?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Converter by The Atom supports 200+ formats across documents, images, video, audio, spreadsheets, presentations, archives, and CAD/vector files.",
          },
        },
        {
          "@type": "Question",
          name: "Is this converter free?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, Converter by The Atom is completely free. No subscription, no sign-up, and no ads.",
          },
        },
        {
          "@type": "Question",
          name: "How does the conversion work?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Files are processed server-side using FFmpeg for video/audio, LibreOffice for documents, ImageMagick for images, and Ghostscript for PDFs.",
          },
        },
      ],
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <ToastProvider>
          <DepthModeProvider>
            <SmoothScrollProvider>
              <RouteShell>{children}</RouteShell>
            </SmoothScrollProvider>
          </DepthModeProvider>
        </ToastProvider>
        <Analytics />
      </body>
    </html>
  );
}
