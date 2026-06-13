"use client";

import { Loader2, CheckCircle2, XCircle, X } from "lucide-react";
import styles from "@/components/ConversionProgress.module.css";

const statusLabels = {
  queued: "Queued…",
  uploading: "Uploading…",
  converting: "Converting…",
  done: "Complete",
  error: "Failed",
  cancelled: "Cancelled",
};

export default function ConversionProgress({
  status = "queued",
  progress = 0,
  error,
  onCancel,
}) {
  const isActive =
    status === "queued" || status === "uploading" || status === "converting";
  const isDone = status === "done";
  const isError = status === "error";

  return (
    <div className={styles.wrapper}>
      <div className={styles.bar}>
        <div
          className={`${styles.fill} ${isDone ? styles.fillDone : ""} ${isError ? styles.fillError : ""}`}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      <div className={styles.row}>
        <div className={styles.statusLeft}>
          {isActive && <Loader2 size={14} className={styles.spin} />}
          {isDone && <CheckCircle2 size={14} className={styles.doneIcon} />}
          {isError && <XCircle size={14} className={styles.errorIcon} />}
          <span
            className={`${styles.label} ${isDone ? styles.labelDone : ""} ${isError ? styles.labelError : ""}`}
          >
            {isError && error ? error : statusLabels[status] || status}
          </span>
        </div>
        {isActive && onCancel && (
          <button type="button" className={styles.cancelBtn} onClick={onCancel}>
            <X size={13} />
          </button>
        )}
      </div>
    </div>
  );
}
