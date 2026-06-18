import { chromium } from "playwright";
import { orgRequiresPin } from "@/lib/auth/org-access";
import {
  authenticateRequest,
  hasOrgAccess,
} from "@/lib/auth/request-auth";
import { checkRateLimit, getClientIp } from "@/lib/auth/rate-limit";
import { buildPosterHtml } from "@/lib/poster-html";
import { DEFAULT_ORG_ID } from "@/lib/orgs";
import type { GeneratePosterRequest } from "@/types/poster";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  const auth = await authenticateRequest(request);
  if (!auth.ok) {
    return new Response("Unauthorized", { status: 401 });
  }

  const ip = getClientIp(request);
  const rateKey = auth.isApiKey ? `generate:api:${ip}` : `generate:${ip}`;
  const limit = checkRateLimit(rateKey, 30, 60 * 1000);
  if (!limit.allowed) {
    return new Response("Rate limit exceeded. Try again shortly.", {
      status: 429,
      headers: limit.retryAfterSec
        ? { "Retry-After": String(limit.retryAfterSec) }
        : undefined,
    });
  }

  let body: GeneratePosterRequest;

  try {
    body = (await request.json()) as GeneratePosterRequest;
  } catch {
    return new Response("Invalid JSON body", { status: 400 });
  }

  if (!body.input?.quote?.trim() && !body.input?.title?.trim()) {
    return new Response("Title or quote is required", { status: 400 });
  }

  if (body.templateId === "image_bg" && !body.backgroundImage?.base64) {
    return new Response("Background image is required for photo template", {
      status: 400,
    });
  }

  const orgId = body.orgId ?? DEFAULT_ORG_ID;

  if (
    !auth.isApiKey &&
    orgRequiresPin(orgId) &&
    !hasOrgAccess(auth.orgAccess, orgId)
  ) {
    return new Response("Org PIN required. Unlock the organization first.", {
      status: 403,
    });
  }

  const posterRequest: GeneratePosterRequest = {
    ...body,
    orgId,
  };
  const html = buildPosterHtml(posterRequest);
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