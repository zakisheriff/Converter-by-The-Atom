"use client";

import { useEffect } from "react";

export default function RouteShell({ children }) {
  useEffect(() => {
    const preventDefault = (e) => {
      if (e.dataTransfer && e.dataTransfer.types.includes("Files")) {
        e.preventDefault();
      }
    };
    
    window.addEventListener("dragover", preventDefault);
    window.addEventListener("drop", preventDefault);
    
    return () => {
      window.removeEventListener("dragover", preventDefault);
      window.removeEventListener("drop", preventDefault);
    };
  }, []);

  return children;
}

