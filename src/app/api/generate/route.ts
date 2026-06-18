import { chromium } from "playwright";
import { buildPosterHtml } from "@/lib/poster-html";
import type { GeneratePosterRequest } from "@/types/poster";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  let body: GeneratePosterRequest;

  try {
    body = (await request.json()) as GeneratePosterRequest;
  } catch {
    return new Response("Invalid JSON body", { status: 400 });
  }

  if (!body.input?.quote?.trim() && !body.input?.title?.trim()) {
    return new Response("Title or quote is required", { status: 400 });
  }

  const html = buildPosterHtml(body);
  let browser;

  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({
      viewport: {
        width: body.formatId === "twitter" ? 1200 : 1080,
        height:
          body.formatId === "story"
            ? 1920
            : body.formatId === "twitter"
              ? 675
              : body.formatId === "square"
                ? 1080
                : 1350,
      },
    });

    try {
      await page.setContent(html, { waitUntil: "networkidle", timeout: 20000 });
    } catch {
      await page.setContent(html, {
        waitUntil: "domcontentloaded",
        timeout: 10000,
      });
    }

    try {
      await page.waitForFunction(
        "document.fonts.status === 'loaded'",
        undefined,
        { timeout: 12000 },
      );
    } catch {
      await page.waitForTimeout(2000);
    }

    const png = await page.screenshot({ type: "png", fullPage: false });
    return new Response(new Uint8Array(png), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Image generation failed";
    return new Response(message, { status: 500 });
  } finally {
    await browser?.close();
  }
}