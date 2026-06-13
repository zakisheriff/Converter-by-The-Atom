import { NextResponse } from "next/server";
import { convertFile } from "@/utils/server/conversionEngine";
import { createJob, updateJob } from "@/utils/server/jobQueue";
import { generateJobId } from "@/utils/server/fileHelpers";
import { basename } from "path";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const targetFormat = formData.get("targetFormat");
    const optionsJson = formData.get("options") || "{}";

    if (!file || !targetFormat) {
      return NextResponse.json(
        { error: "Missing file or target format" },
        { status: 400 },
      );
    }

    const options = JSON.parse(optionsJson);
    const jobId = generateJobId();
    const job = createJob(jobId, {
      fileName: file.name,
      targetFormat,
    });

    // Read file buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Run conversion asynchronously (non-blocking for the response)
    convertFile(buffer, file.name, targetFormat, options)
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
          error: err.message || "Conversion failed",
        });
      });

    return NextResponse.json({
      jobId,
      statusUrl: `/api/convert/status/${jobId}`,
    });
  } catch (err) {
    console.error("Convert API error:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 },
    );
  }
}
