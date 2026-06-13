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
  "Convert documents, images, videos, audio, ebooks, archives, and more between 200+ formats. Free, no sign-up, no ads. Powered by FFmpeg, LibreOffice, and ImageMagick.";

export const metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "Converter by The Atom",
  title: {
    default: siteTitle,
    template: `%s | Converter by The Atom`,
  },
  description: siteDescription,
  keywords: [
    "Converter by The Atom",
    "The Atom converter",
    "online file converter",
    "free file converter",
    "PDF converter",
    "image converter",
    "video converter",
    "audio converter",
    "document converter",
    "HEIC converter",
    "WEBP converter",
    "MP4 converter",
    "MP3 converter",
    "cloud convert alternative",
    "convert files online free",
    "200+ format converter",
  ],
  authors: [{ name: "The Atom", url: "https://theatom.lk" }],
  creator: "The Atom",
  publisher: "The Atom",
  category: "technology",
  classification: "File Converter Tool",
  alternates: { canonical: "/" },
  icons: {
    icon: [
      { url: "/Logo.png", type: "image/png" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: ["/Logo.png"],
    apple: [{ url: "/apple-icon.png", sizes: "512x512", type: "image/png" }],
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
        url: "/Logo.png",
        width: 1200,
        height: 630,
        alt: "Converter by The Atom",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    creator: "@theoneatom",
    images: ["/Logo.png"],
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
