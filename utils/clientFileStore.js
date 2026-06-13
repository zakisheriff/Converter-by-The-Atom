let pendingFiles = [];

export function setPendingFiles(files) {
  pendingFiles = Array.from(files);
}

export function getPendingFiles() {
  const files = pendingFiles;
  pendingFiles = []; // Clear after retrieval to avoid reuse
  return files;
}
