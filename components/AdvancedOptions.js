"use client";

import { useState } from "react";
import { ChevronDown, Settings2 } from "lucide-react";
import { advancedOptions } from "@/data/formatMap";
import styles from "@/components/AdvancedOptions.module.css";

export default function AdvancedOptions({ categoryKey, values, onChange }) {
  const [open, setOpen] = useState(false);
  const schema = advancedOptions[categoryKey];

  if (!schema || schema.length === 0) return null;

  const update = (key, value) => {
    onChange({ ...values, [key]: value });
  };

  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        className={styles.toggle}
        onClick={() => setOpen((v) => !v)}
      >
        <Settings2 size={14} />
        <span>Advanced options</span>
        <ChevronDown
          size={14}
          className={`${styles.chevron} ${open ? styles.chevronOpen : ""}`}
        />
      </button>

      {open && (
        <div className={styles.panel}>
          {schema.map((opt) => (
            <div key={opt.key} className={styles.field}>
              <label className={styles.fieldLabel}>{opt.label}</label>

              {opt.type === "range" && (
                <div className={styles.rangeRow}>
                  <input
                    type="range"
                    min={opt.min}
                    max={opt.max}
                    value={values[opt.key] ?? opt.default ?? opt.max}
                    onChange={(e) => update(opt.key, Number(e.target.value))}
                    className={styles.range}
                  />
                  <span className={styles.rangeValue}>
                    {values[opt.key] ?? opt.default ?? opt.max}
                    {opt.unit || ""}
                  </span>
                </div>
              )}

              {opt.type === "number" && (
                <div className={styles.inputRow}>
                  <input
                    type="number"
                    placeholder={opt.placeholder || ""}
                    value={values[opt.key] ?? ""}
                    onChange={(e) =>
                      update(
                        opt.key,
                        e.target.value ? Number(e.target.value) : "",
                      )
                    }
                    className={styles.input}
                  />
                  {opt.unit && <span className={styles.unit}>{opt.unit}</span>}
                </div>
              )}

              {opt.type === "text" && (
                <input
                  type="text"
                  placeholder={opt.placeholder || ""}
                  value={values[opt.key] ?? ""}
                  onChange={(e) => update(opt.key, e.target.value)}
                  className={styles.input}
                />
              )}

              {opt.type === "select" && (
                <select
                  value={values[opt.key] ?? opt.default ?? opt.options[0]}
                  onChange={(e) => update(opt.key, e.target.value)}
                  className={styles.select}
                >
                  {opt.options.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              )}

              {opt.type === "boolean" && (
                <label className={styles.switch}>
                  <input
                    type="checkbox"
                    checked={values[opt.key] ?? opt.default ?? false}
                    onChange={(e) => update(opt.key, e.target.checked)}
                  />
                  <span className={styles.switchTrack}>
                    <span className={styles.switchThumb} />
                  </span>
                </label>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
