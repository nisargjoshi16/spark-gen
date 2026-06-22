export type DownloadResult = "shared" | "saved" | "preview";

function isMobileDevice(): boolean {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

function showImageSaveOverlay(url: string, filename: string): void {
  const overlay = document.createElement("div");
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-label", "Save poster image");
  overlay.style.cssText =
    "position:fixed;inset:0;z-index:10000;background:rgba(0,0,0,0.92);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;box-sizing:border-box;";

  const card = document.createElement("div");
  card.style.cssText =
    "display:flex;flex-direction:column;align-items:center;gap:16px;max-width:100%;";

  const hint = document.createElement("p");
  hint.textContent = "Long-press the image, then tap Save Image";
  hint.style.cssText =
    "margin:0;color:#fff;font:600 15px/1.4 system-ui,sans-serif;text-align:center;";

  const img = document.createElement("img");
  img.src = url;
  img.alt = filename;
  img.style.cssText =
    "max-width:100%;max-height:70vh;border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,0.4);";

  const close = document.createElement("button");
  close.type = "button";
  close.textContent = "Close";
  close.style.cssText =
    "margin-top:8px;border:none;border-radius:999px;background:#ea580c;color:#fff;font:600 15px system-ui,sans-serif;padding:10px 28px;";

  const cleanup = () => {
    overlay.remove();
    URL.revokeObjectURL(url);
    document.body.style.overflow = "";
  };

  close.addEventListener("click", cleanup);
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) cleanup();
  });

  card.append(hint, img, close);
  overlay.append(card);
  document.body.style.overflow = "hidden";
  document.body.append(overlay);
}

export async function downloadImageBlob(
  blob: Blob,
  filename: string,
): Promise<DownloadResult> {
  const pngBlob =
    blob.type === "image/png" ? blob : new Blob([blob], { type: "image/png" });
  const file = new File([pngBlob], filename, { type: "image/png" });

  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: filename });
      return "shared";
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        throw error;
      }
    }
  }

  const url = URL.createObjectURL(pngBlob);

  if (isMobileDevice()) {
    showImageSaveOverlay(url, filename);
    return "preview";
  }

  const link = document.createElement("a");
  link.download = filename;
  link.href = url;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  return "saved";
}