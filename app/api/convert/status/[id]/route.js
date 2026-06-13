import { NextResponse } from "next/server";
import { getJob } from "@/utils/server/jobQueue";

export async function GET(request, { params }) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "Missing job ID" }, { status: 400 });
  }

  const backendUrl = process.env.CONVERSION_BACKEND_URL;
  if (backendUrl) {
    try {
      const url = new URL(request.url);
      const targetUrl = `${backendUrl.replace(/\/$/, "")}${url.pathname}${url.search}`;
      const response = await fetch(targetUrl, {
        method: "GET"
      });
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    } catch (err) {
      return NextResponse.json({ error: "Backend proxy error: " + err.message }, { status: 502 });
    }
  }

  const job = getJob(id);

  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: job.id,
    status: job.status,
    progress: job.progress,
    error: job.error,
    downloadUrl: job.downloadUrl,
    fileName: job.fileName,
  });
}
