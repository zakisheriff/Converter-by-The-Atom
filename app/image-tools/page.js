"use client";

import {
  Maximize2,
  Minimize2,
  Droplets,
  Type,
  Crop,
  Palette,
} from "lucide-react";
import ToolPageShell from "@/components/ToolPageShell";

const quickActions = [
  { key: "resize", label: "Resize", icon: Maximize2 },
  { key: "compress", label: "Compress", icon: Minimize2 },
  { key: "watermark", label: "Watermark", icon: Droplets },
  { key: "text", label: "Add text", icon: Type },
  { key: "crop", label: "Crop", icon: Crop },
  { key: "optimize", label: "Optimize", icon: Palette },
];

export default function ImageToolsPage() {
  return (
    <ToolPageShell
      quickActions={quickActions}
      accept=".png,.jpg,.jpeg,.webp,.gif,.bmp,.tiff,.tif,.svg,.ico,.heic,.heif,.avif,.psd,.raw,.cr2,.nef,.arw,.dng"
      pageDescription="Convert, resize, compress, watermark, and optimize your images. Supports PNG, JPG, WEBP, HEIC, RAW and 20+ more formats."
    />
  );
}
