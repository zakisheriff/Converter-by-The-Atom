import { mkdtemp, rm, writeFile, readFile, readdir, stat } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";
import { v4 as uuid } from "uuid";

const TEMP_PREFIX = "converter-";

/**
 * Create a unique temp directory for a conversion job.
 */
export async function createTempDir() {
  const dir = await mkdtemp(join(tmpdir(), TEMP_PREFIX));
  return dir;
}

/**
 * Save an uploaded file to a temp directory.
 * Returns the full file path.
 */
export async function saveUploadedFile(buffer, originalName, dir) {
  const safeName = originalName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const filePath = join(dir, safeName);
  await writeFile(filePath, buffer);
  return filePath;
}

/**
 * Get the output file path for a conversion.
 */
export function getOutputPath(dir, baseName, targetExt) {
  const name = baseName.replace(/\.[^.]+$/, "");
  return join(dir, `${name}.${targetExt}`);
}

/**
 * Read a file as a buffer.
 */
export async function readFileBuffer(filePath) {
  return readFile(filePath);
}

/**
 * Find a file in a directory by extension.
 */
export async function findFileWithExt(dir, ext) {
  const files = await readdir(dir);
  const match = files.find((f) => f.toLowerCase().endsWith(`.${ext}`));
  if (match) return join(dir, match);
  return null;
}

/**
 * Find the first non-input file in the output dir (heuristic for converted output).
 */
export async function findConvertedFile(dir, inputFileName) {
  const files = await readdir(dir);
  const match = files.find((f) => f !== inputFileName && !f.startsWith("."));
  if (match) return join(dir, match);
  return null;
}

/**
 * Clean up a temp directory.
 */
export async function cleanupTempDir(dir) {
  try {
    await rm(dir, { recursive: true, force: true });
  } catch {
    // ignore cleanup errors
  }
}

/**
 * Generate a unique job ID.
 */
export function generateJobId() {
  return uuid();
}

/**
 * Get file size in bytes.
 */
export async function getFileSize(filePath) {
  try {
    const s = await stat(filePath);
    return s.size;
  } catch {
    return 0;
  }
}
