"use client";

import {
  Merge,
  Minimize2,
  FileText,
  Image,
  Scissors,
  Lock,
} from "lucide-react";
import ToolPageShell from "@/components/ToolPageShell";

const quickActions = [
  { key: "merge", label: "Merge PDFs", icon: Merge },
  { key: "compress", label: "Compress", icon: Minimize2 },
  { key: "to-word", label: "PDF → Word", icon: FileText },
  { key: "to-images", label: "PDF → Images", icon: Image },
  { key: "split", label: "Split", icon: Scissors },
  { key: "protect", label: "Protect", icon: Lock },
];

export default function PdfToolsPage() {
  return (
    <ToolPageShell
      quickActions={quickActions}
      accept=".pdf,.doc,.docx,.odt,.rtf,.txt,.html,.epub"
      pageDescription="Merge, compress, convert, split, and protect your PDF files. Upload PDFs or documents to get started."
    />
  );
}
