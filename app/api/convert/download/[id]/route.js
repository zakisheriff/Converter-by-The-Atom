import { NextResponse } from "next/server";
import { getJob } from "@/utils/server/jobQueue";
import { readFile } from "fs/promises";
import { basename } from "path";

const mimeTypes = {
  pdf: "application/pdf",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
  svg: "image/svg+xml",
  mp4: "video/mp4",
  mp3: "audio/mpeg",
  wav: "audio/wav",
  flac: "audio/flac",
  zip: "application/zip",
  tar: "application/x-tar",
  gz: "application/gzip",
  "7z": "application/x-7z-compressed",
};

function getMime(fileName) {
  const ext = fileName.split(".").pop().toLowerCase();
  return mimeTypes[ext] || "application/octet-stream";
}

export async function GET(request, { params }) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "Missing job ID" }, { status: 400 });
  }

  const job = getJob(id);

  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  if (job.status !== "done" || !job.outputPath) {
    return NextResponse.json(
      { error: "File not ready", status: job.status },
      { status: 400 },
    );
  }

  try {
    const buffer = await readFile(job.outputPath);
    const fileName = job.fileName || basename(job.outputPath);
    const mime = getMime(fileName);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": mime,
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Content-Length": String(buffer.length),
      },
    });
  } catch (err) {
    console.error("Download error:", err);
    return NextResponse.json(
      { error: "File not found or expired" },
      { status: 404 },
    );
  }
}
