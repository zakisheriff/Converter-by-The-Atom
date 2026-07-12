import { NextResponse } from "next/server";
import { captureWebsite } from "@/utils/server/conversionEngine";
import { createJob, updateJob } from "@/utils/server/jobQueue";
import { generateJobId } from "@/utils/server/fileHelpers";
import { basename } from "path";

export async function POST(request) {
  const backendUrl = process.env.CONVERSION_BACKEND_URL;
  if (backendUrl) {
    try {
      const url = new URL(request.url);
      const targetUrl = `${backendUrl.replace(/\/$/, "")}${url.pathname}${url.search}`;
      const contentType = request.headers.get("content-type") || "";
      let body;
      if (contentType.includes("application/json")) {
        body = JSON.stringify(await request.json());
      } else {
        body = await request.formData();
      }
      const response = await fetch(targetUrl, {
        method: "POST",
        body,
        headers: contentType.includes("application/json") ? { "Content-Type": "application/json" } : undefined
      });
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    } catch (err) {
      return NextResponse.json({ error: "Backend proxy error: " + err.message }, { status: 502 });
    }
  }

  try {
    const body = await request.json();
    const { url, format = "pdf", options = {} } = body;

    if (!url) {
      return NextResponse.json({ error: "Missing URL" }, { status: 400 });
    }

    // Validate URL
    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    const jobId = generateJobId();
    createJob(jobId, { fileName: `capture.${format}` });

    // Run capture async
    captureWebsite(url, format, options)
      .then(({ outputPath, tempDir }) => {
        const outputName = basename(outputPath);
        updateJob(jobId, {
          status: "done",
          progress: 100,
          outputPath,
          tempDir,
          fileName: outputName,
          downloadUrl: `/api/convert/download/${jobId}`,
        });
      })
      .catch((err) => {
        updateJob(jobId, {
          status: "error",
          error: err.message || "Capture failed",
        });
      });

    // For the website-capture page which expects a synchronous-like response,
    // we'll wait briefly and then poll. But let's return the jobId immediately
    // and let the client poll.
    return NextResponse.json({
      jobId,
      statusUrl: `/api/convert/status/${jobId}`,
      downloadUrl: `/api/convert/download/${jobId}`,
    });
  } catch (err) {
    console.error("Website capture error:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 },
    );
  }
}
