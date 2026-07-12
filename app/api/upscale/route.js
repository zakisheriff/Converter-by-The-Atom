import { NextResponse } from "next/server";
import { spawn } from "child_process";
import { basename, extname } from "path";
import { createTempDir, saveUploadedFile, getOutputPath } from "@/utils/server/fileHelpers";
import { createJob, updateJob } from "@/utils/server/jobQueue";
import { generateJobId } from "@/utils/server/fileHelpers";

function runCommand(cmd, args) {
  return new Promise((resolve, reject) => {
    const proc = spawn(cmd, args, { stdio: ["pipe", "pipe", "pipe"] });
    let stderr = "";
    proc.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    proc.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} failed with code ${code}: ${stderr}`));
    });
    proc.on("error", (err) => reject(err));
  });
}

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
    const formData = await request.formData();
    const file = formData.get("file");
    const scale = formData.get("scale") || "2";
    const mode = formData.get("mode") || "ultra-sharp"; // "standard" | "ultra-sharp" | "denoise"

    if (!file) {
      return NextResponse.json({ error: "Missing image file" }, { status: 400 });
    }

    const jobId = generateJobId();
    const outputExt = extname(file.name).toLowerCase() || ".png";
    const cleanOutputExt = outputExt.replace(".", "");

    createJob(jobId, {
      fileName: file.name,
      targetFormat: cleanOutputExt,
    });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Run upscaling asynchronously
    const tempDir = await createTempDir();
    const inputPath = await saveUploadedFile(buffer, file.name, tempDir);
    const outputPath = getOutputPath(tempDir, file.name, cleanOutputExt);

    const resizePercent = scale === "4" ? "400%" : "200%";
    const args = [inputPath];

    // Configure ImageMagick filters based on selected mode
    if (mode === "ultra-sharp") {
      args.push("-filter", "Lanczos", "-resize", resizePercent, "-unsharp", "0x0.75+0.75+0.008");
    } else if (mode === "denoise") {
      // Denoise uses a slight noise-reduction filter prior to scaling, then Lanczos
      args.push("-noise", "2", "-filter", "Lanczos", "-resize", resizePercent);
    } else {
      // Standard Lanczos
      args.push("-filter", "Lanczos", "-resize", resizePercent);
    }

    args.push(outputPath);

    // Run the upscaling command
    const cmd = "magick";
    const fallbackCmd = "convert";

    runCommand(cmd, args)
      .catch(() => runCommand(fallbackCmd, args)) // Fallback to 'convert' if 'magick' is not available
      .then(() => {
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
        console.error("Upscale task error:", err);
        updateJob(jobId, {
          status: "error",
          error: err.message || "Upscaling failed",
        });
      });

    return NextResponse.json({
      jobId,
      statusUrl: `/api/convert/status/${jobId}`,
    });
  } catch (err) {
    console.error("Upscale API error:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 },
    );
  }
}
