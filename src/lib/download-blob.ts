export type DownloadResult = "shared" | "saved" | "opened";

function isMobileDevice(): boolean {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
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
    const opened = window.open(url, "_blank");
    if (!opened) {
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
    window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
    return "opened";
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