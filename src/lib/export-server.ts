import { downloadImageBlob, type DownloadResult } from "@/lib/download-blob";
import type { GeneratePosterRequest } from "@/types/poster";

export async function exportPosterFromServer(
  request: GeneratePosterRequest,
  filename: string,
): Promise<DownloadResult> {
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Server export failed");
  }

  const blob = await response.blob();
  return downloadImageBlob(blob, filename);
}