"use client";

import { useEffect } from "react";
import { getGoogleFontsUrl } from "@/lib/fonts";
import type { FontId } from "@/types/poster";

interface FontLoaderProps {
  fontId: FontId;
}

export function FontLoader({ fontId }: FontLoaderProps) {
  useEffect(() => {
    const id = `spark-gen-font-${fontId}`;
    if (document.getElementById(id)) return;

    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = getGoogleFontsUrl(fontId);
    document.head.appendChild(link);
  }, [fontId]);

  return null;
}