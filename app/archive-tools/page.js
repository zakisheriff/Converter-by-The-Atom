"use client";

import { PackageOpen, PackagePlus, FileArchive, Lock } from "lucide-react";
import ToolPageShell from "@/components/ToolPageShell";

const quickActions = [
  { key: "create-zip", label: "Create ZIP", icon: PackagePlus },
  { key: "extract", label: "Extract", icon: PackageOpen },
  { key: "convert", label: "Convert format", icon: FileArchive },
  { key: "encrypt", label: "Encrypt", icon: Lock },
];

export default function ArchiveToolsPage() {
  return (
    <ToolPageShell
      quickActions={quickActions}
      accept=".zip,.tar,.gz,.tar.gz,.7z,.rar,.bz2,.xz,.iso"
      pageDescription="Create, extract, and convert archive files. Supports ZIP, TAR, GZ, 7Z, RAR, BZ2, and more."
    />
  );
}
