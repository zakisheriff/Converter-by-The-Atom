import { NextResponse } from "next/server";
import { spawn } from "child_process";
import { join } from "path";
import { createTempDir, saveUploadedFile, generateJobId } from "@/utils/server/fileHelpers";
import { createJob, updateJob } from "@/utils/server/jobQueue";

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
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "Missing image file" }, { status: 400 });
    }

    const jobId = generateJobId();
    createJob(jobId, { fileName: file.name });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const tempDir = await createTempDir();
    const inputPath = await saveUploadedFile(buffer, file.name, tempDir);
    const outputName = file.name.replace(/\.[^.]+$/, "") + "_no_bg.png";
    const outputPath = join(tempDir, outputName);

    const scriptPath = join(process.cwd(), "scripts", "remove_bg.py");

    runCommand("python3", [scriptPath, inputPath, outputPath])
      .then(() => {
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
        console.error("Background removal task error:", err);
        updateJob(jobId, {
          status: "error",
          error: err.message || "Background removal failed",
        });
      });

    return NextResponse.json({
      jobId,
      statusUrl: `/api/convert/status/${jobId}`,
    });
  } catch (err) {
    console.error("Background remover API error:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 },
    );
  }
}
