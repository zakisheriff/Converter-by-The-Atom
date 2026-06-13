"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import styles from "@/components/AppShell.module.css";

export default function AppShell({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Get active tool category for custom backgrounds
  const activeTool = pathname.split("/")[1] || "convert";

  return (
    <div className={styles.shell} data-active-tool={activeTool}>
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className={styles.mainArea}>
        <Topbar onMenuOpening={() => setMobileOpen(true)} />
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}
