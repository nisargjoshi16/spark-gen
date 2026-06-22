"use client";

import { useEffect } from "react";
import { BASE_PATH, IS_STATIC_EXPORT } from "@/lib/static-export";

export function PwaRegistration() {
  useEffect(() => {
    if (!IS_STATIC_EXPORT || !("serviceWorker" in navigator)) return;

    const swUrl = `${BASE_PATH}/sw.js`;
    navigator.serviceWorker.register(swUrl, { scope: `${BASE_PATH}/` }).catch((error) => {
      console.warn("Service worker registration failed:", error);
    });
  }, []);

  return null;
}