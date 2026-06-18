"use client";

import { useEffect } from "react";
import { TEMPLATE_UI_FONTS_URL } from "@/lib/fonts";

export function TemplateUiFontLoader() {
  useEffect(() => {
    const id = "spark-gen-template-ui-fonts";
    if (document.getElementById(id)) return;

    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = TEMPLATE_UI_FONTS_URL;
    document.head.appendChild(link);
  }, []);

  return null;
}