"use client";

import {
  Film,
  Volume2,
  Gauge,
  MonitorPlay,
  Camera,
  Scissors,
} from "lucide-react";
import ToolPageShell from "@/components/ToolPageShell";

const quickActions = [
  { key: "codec", label: "Change codec", icon: Film },
  { key: "bitrate", label: "Bitrate", icon: Gauge },
  { key: "audio", label: "Extract audio", icon: Volume2 },
  { key: "resolution", label: "Resolution", icon: MonitorPlay },
  { key: "thumbnail", label: "Thumbnail", icon: Camera },
  { key: "trim", label: "Trim", icon: Scissors },
];

export default function VideoToolsPage() {
  return (
    <ToolPageShell
      quickActions={quickActions}
      accept=".mp4,.mov,.mkv,.avi,.webm,.flv,.wmv,.m4v,.mpeg,.mpg,.3gp,.ogv,.ts,.vob,.mts"
      pageDescription="Convert videos, change codecs, adjust bitrate, resolution, framerate, and extract audio. Supports MP4, MOV, MKV, AVI, WEBM and more."
    />
  );
}
