"use client";

import { useEffect } from "react";

export function PrintTrigger() {
  useEffect(() => {
    // Small delay so the page fully renders before print dialog
    const timer = setTimeout(() => window.print(), 600);
    return () => clearTimeout(timer);
  }, []);

  return null;
}
