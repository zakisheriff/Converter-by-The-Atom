"use client";

import { useMemo } from "react";
import {
  getTargetsForExt,
  getFormatInfo,
  formatCategories,
} from "@/data/formatMap";
import styles from "@/components/FormatPicker.module.css";

export default function FormatPicker({ sourceExt, selected, onSelect }) {
  const targets = useMemo(() => getTargetsForExt(sourceExt), [sourceExt]);

  if (targets.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No conversion targets available for .{sourceExt}</p>
      </div>
    );
  }

  // group targets by which category they belong to
  const grouped = useMemo(() => {
    const groups = {};
    for (const [catKey, cat] of Object.entries(formatCategories)) {
      const matching = targets.filter((t) =>
        cat.formats.some((f) => f.ext === t),
      );
      if (matching.length > 0) {
        groups[catKey] = { label: cat.label, formats: matching };
      }
    }
    return groups;
  }, [targets]);

  return (
    <div className={styles.picker}>
      <label className={styles.label}>Convert to</label>
      <div className={styles.groups}>
        {Object.entries(grouped).map(([catKey, group]) => (
          <div key={catKey} className={styles.group}>
            <span className={styles.groupLabel}>{group.label}</span>
            <div className={styles.grid}>
              {group.formats.map((ext) => {
                const info = getFormatInfo(ext);
                const isActive = selected === ext;
                return (
                  <button
                    key={ext}
                    type="button"
                    className={`${styles.chip} ${isActive ? styles.chipActive : ""}`}
                    onClick={() => onSelect(ext)}
                  >
                    {ext}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
