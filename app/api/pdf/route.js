import { NextResponse } from "next/server";
import { createJob, updateJob } from "@/utils/server/jobQueue";
import {
  generateJobId,
  createTempDir,
  saveUploadedFile,
  cleanupTempDir,
} from "@/utils/server/fileHelpers";
import { spawn } from "child_process";
import { readdir } from "fs/promises";
import { join, basename } from "path";

function runCommand(cmd, args, cwd) {
  return new Promise((resolve, reject) => {
    const proc = spawn(cmd, args, { cwd, stdio: ["pipe", "pipe", "pipe"] });
    let stderr = "";
    proc.stderr.on("data", (c) => (stderr += c.toString()));
    proc.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} exited ${code}: ${stderr.slice(-300)}`));
    });
    proc.on("error", reject);
  });
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const action = formData.get("action"); // merge | compress | convert
    const files = formData.getAll("files");
    const targetFormat = formData.get("targetFormat") || "pdf";
    const optionsJson = formData.get("options") || "{}";
    const options = JSON.parse(optionsJson);

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const jobId = generateJobId();
    createJob(jobId, { fileName: "output.pdf" });

    // Run async
    (async () => {
      const tempDir = await createTempDir();
      try {
        if (action === "compress") {
          const file = files[0];
          const buf = Buffer.from(await file.arrayBuffer());
          const inputPath = await saveUploadedFile(buf, file.name, tempDir);
          const outputPath = join(tempDir, "compressed.pdf");

          const quality = options.quality || 75;
          const profile = options.profile || "screen";
          await runCommand(
            "gs",
            [
              "-sDEVICE=pdfwrite",
              "-dCompatibilityLevel=1.5",
              `-dPDFSETTINGS=/${profile}`,
              "-dNOPAUSE",
              "-dQUIET",
              "-dBATCH",
              `-sOutputFile=${outputPath}`,
              inputPath,
            ],
            tempDir,
          );

          updateJob(jobId, {
            status: "done",
            progress: 100,
            outputPath,
            tempDir,
            fileName: "compressed.pdf",
            downloadUrl: `/api/convert/download/${jobId}`,
          });
        } else if (action === "merge") {
          const inputPaths = [];
          for (const file of files) {
            const buf = Buffer.from(await file.arrayBuffer());
            const p = await saveUploadedFile(buf, file.name, tempDir);
            inputPaths.push(p);
          }
          const outputPath = join(tempDir, "merged.pdf");
          await runCommand(
            "pdftk",
            [...inputPaths, "cat", "output", outputPath],
            tempDir,
          );

          updateJob(jobId, {
            status: "done",
            progress: 100,
            outputPath,
            tempDir,
            fileName: "merged.pdf",
            downloadUrl: `/api/convert/download/${jobId}`,
          });
        } else {
          // convert PDF to another format
          const file = files[0];
          const buf = Buffer.from(await file.arrayBuffer());
          const inputPath = await saveUploadedFile(buf, file.name, tempDir);

          const args = [
            "--headless",
            "--convert-to",
            targetFormat,
            "--outdir",
            tempDir,
            inputPath,
          ];
          await runCommand("soffice", args, tempDir);

          // Find the converted file
          const allFiles = await readdir(tempDir);
          const converted = allFiles.find(
            (f) => f !== file.name && f.endsWith(`.${targetFormat}`),
          );
          if (!converted) throw new Error("Conversion output not found");

          const outputPath = join(tempDir, converted);
          updateJob(jobId, {
            status: "done",
            progress: 100,
            outputPath,
            tempDir,
            fileName: converted,
            downloadUrl: `/api/convert/download/${jobId}`,
          });
        }
      } catch (err) {
        updateJob(jobId, { status: "error", error: err.message });
        await cleanupTempDir(tempDir);
      }
    })();

    return NextResponse.json({
      jobId,
      statusUrl: `/api/convert/status/${jobId}`,
    });
  } catch (err) {
    console.error("PDF API error:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 },
    );
  }
}
