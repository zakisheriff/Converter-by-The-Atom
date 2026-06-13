"use client";

import { Music2, Gauge, Radio, Headphones, Mic } from "lucide-react";
import ToolPageShell from "@/components/ToolPageShell";

const quickActions = [
  { key: "codec", label: "Change codec", icon: Music2 },
  { key: "bitrate", label: "Bitrate", icon: Gauge },
  { key: "sample-rate", label: "Sample rate", icon: Radio },
  { key: "channels", label: "Channels", icon: Headphones },
  { key: "extract", label: "From video", icon: Mic },
];

export default function AudioToolsPage() {
  return (
    <ToolPageShell
      quickActions={quickActions}
      accept=".mp3,.wav,.flac,.aac,.ogg,.wma,.m4a,.opus,.aiff,.amr,.ac3,.ape,.wv"
      pageDescription="Convert audio files, adjust bitrate, codec, sample rate, and channels. Extract audio from video files. Supports MP3, WAV, FLAC, AAC, OGG and more."
    />
  );
}
