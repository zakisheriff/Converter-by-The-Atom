/**
 * Simple in-memory job queue for conversion tasks.
 * Jobs are stored in a Map and cleaned up after completion + TTL.
 */

const jobs = new Map();
const JOB_TTL_MS = 30 * 60 * 1000; // 30 minutes

/**
 * Create a new job entry.
 */
export function createJob(id, meta = {}) {
  const job = {
    id,
    status: "queued", // queued | converting | done | error
    progress: 0,
    error: null,
    outputPath: null,
    downloadUrl: null,
    fileName: null,
    createdAt: Date.now(),
    tempDir: null,
    ...meta,
  };
  jobs.set(id, job);
  scheduleCleanup(id);
  return job;
}

/**
 * Get a job by ID.
 */
export function getJob(id) {
  return jobs.get(id) || null;
}

/**
 * Update a job's status and progress.
 */
export function updateJob(id, updates) {
  const job = jobs.get(id);
  if (!job) return null;
  Object.assign(job, updates);
  return job;
}

/**
 * Remove a job from the store.
 */
export function removeJob(id) {
  jobs.delete(id);
}

/**
 * Schedule automatic cleanup of a completed/failed job after TTL.
 */
function scheduleCleanup(id) {
  setTimeout(() => {
    const job = jobs.get(id);
    if (job && (job.status === "done" || job.status === "error")) {
      // Cleanup temp dir if present
      if (job.tempDir) {
        import("@/utils/server/fileHelpers")
          .then(({ cleanupTempDir }) => {
            cleanupTempDir(job.tempDir);
          })
          .catch(() => {});
      }
      jobs.delete(id);
    }
  }, JOB_TTL_MS);
}

/**
 * Get all active jobs (for monitoring).
 */
export function getActiveJobs() {
  return Array.from(jobs.values()).filter(
    (j) => j.status === "queued" || j.status === "converting",
  );
}
