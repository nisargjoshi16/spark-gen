"use client";

import { useEffect, useRef, useState } from "react";
import { OrgSwitcher } from "@/components/OrgSwitcher";
import { PosterCard } from "@/components/poster/PosterCard";
import { designTemplates } from "@/lib/design-templates";
import { exportPosterFromServer } from "@/lib/export-server";
import { exportCardAsPng } from "@/lib/export-image";
import {
  DEFAULT_FONT_BY_LANGUAGE,
  getFontFamily,
  getFontsForLanguage,
  isFontValidForLanguage,
} from "@/lib/fonts";
import { languages } from "@/lib/languages";
import { formats, getFormat } from "@/lib/formats";
import { getPalette, palettes } from "@/lib/palettes";
import { computePanchang } from "@/lib/panchang";
import {
  DEFAULT_IMAGE_BG_BOX_OPACITY,
  parseDataUrl,
} from "@/lib/image-bg";
import { DEFAULT_ORG_ID, getOrg } from "@/lib/orgs";
import { getPreviewScale } from "@/lib/preview";
import { findBestTextPlacement } from "@/lib/text-placement";
import {
  DEFAULT_POSTER_INPUT,
  DEFAULT_POSTER_OPTIONS,
  type BackgroundImageState,
  type DesignTemplateId,
  type FontId,
  type FormatId,
  type PaletteId,
  type HeaderInfo,
  type OrgId,
  type PosterInput,
  type PosterOptions,
  type TextPlacement,
} from "@/types/poster";
import { getFallbackHeader } from "@/lib/panchang-fallback";

function todayInIst(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
}

export function PosterGenerator() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState<PosterInput>(DEFAULT_POSTER_INPUT);
  const [options, setOptions] = useState<PosterOptions>(DEFAULT_POSTER_OPTIONS);
  const [templateId, setTemplateId] =
    useState<DesignTemplateId>("shloka");
  const [paletteId, setPaletteId] = useState<PaletteId>("saffron");
  const [formatId, setFormatId] = useState<FormatId>("portrait");
  const [orgId, setOrgId] = useState<OrgId>(DEFAULT_ORG_ID);
  const [panchangDate, setPanchangDate] = useState(todayInIst);
  const [backgroundImage, setBackgroundImage] =
    useState<BackgroundImageState | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const palette = getPalette(paletteId);
  const format = getFormat(formatId);
  const org = getOrg(orgId);
  const [previewBounds, setPreviewBounds] = useState({
    maxHeight: 720,
    maxWidth: 560,
  });
  const preview = getPreviewScale(format, previewBounds);
  const [panchang, setPanchang] = useState<HeaderInfo>(getFallbackHeader());

  useEffect(() => {
    setPanchang(computePanchang(panchangDate));
  }, [panchangDate]);

  useEffect(() => {
    const updatePreviewBounds = () => {
      setPreviewBounds({
        maxHeight: Math.floor(window.innerHeight * 0.72),
        maxWidth: Math.floor(window.innerWidth * 0.44),
      });
    };

    updatePreviewBounds();
    window.addEventListener("resize", updatePreviewBounds);
    return () => window.removeEventListener("resize", updatePreviewBounds);
  }, []);

  useEffect(() => {
    for (const font of getFontsForLanguage(options.languageId)) {
      const id = `spark-gen-font-${font.id}`;
      if (document.getElementById(id)) continue;
      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href = font.googleFontsUrl;
      document.head.appendChild(link);
    }
  }, [options.languageId]);

  function updateInput<K extends keyof PosterInput>(key: K, value: PosterInput[K]) {
    setInput((prev) => ({ ...prev, [key]: value }));
  }

  const needsBackgroundImage = templateId === "image_bg";
  const canDownload =
    (input.title.trim() || input.quote.trim()) &&
    (!needsBackgroundImage || backgroundImage !== null);

  async function handleBackgroundUpload(file: File | null) {
    if (!file) return;

    setUploadError(null);

    if (!file.type.startsWith("image/")) {
      setUploadError("Please upload an image file (JPEG, PNG, or WebP).");
      return;
    }

    if (file.size > 12 * 1024 * 1024) {
      setUploadError("Image must be smaller than 12 MB.");
      return;
    }

    try {
      const [dataUrl, textPlacement] = await Promise.all([
        readFileAsDataUrl(file),
        findBestTextPlacement(file),
      ]);
      const { mimeType } = parseDataUrl(dataUrl);
      setBackgroundImage({ dataUrl, mimeType, textPlacement });
    } catch {
      setUploadError("Could not read that image. Try another file.");
    }
  }

  function setTextPlacement(placement: TextPlacement) {
    setBackgroundImage((prev) =>
      prev ? { ...prev, textPlacement: placement } : prev,
    );
  }

  async function handleDownload() {
    setIsExporting(true);
    setExportError(null);

    const filename = `${(input.title || "poster").slice(0, 30).replace(/\s+/g, "-").toLowerCase()}-${format.id}.png`;
    const request = {
      input,
      templateId,
      paletteId,
      formatId,
      orgId,
      options,
      panchangDate,
      ...(needsBackgroundImage && backgroundImage
        ? {
            backgroundImage: {
              ...parseDataUrl(backgroundImage.dataUrl),
              textPlacement: backgroundImage.textPlacement,
            },
          }
        : {}),
    };

    try {
      await exportPosterFromServer(request, filename);
    } catch (serverError) {
      console.warn("Server export failed, falling back to client:", serverError);
      if (!cardRef.current) {
        setExportError(
          serverError instanceof Error
            ? serverError.message
            : "Export failed",
        );
        return;
      }
      try {
        await exportCardAsPng(cardRef.current, filename);
      } catch (clientError) {
        setExportError(
          clientError instanceof Error
            ? clientError.message
            : "Export failed",
        );
      }
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-[100rem] flex-col gap-10 px-6 py-12 lg:flex-row lg:items-start lg:gap-10">
      <section className="flex w-full flex-1 flex-col gap-6 lg:max-w-md">
        <header>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Spark Gen
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            प्रचोदयात्-style posters with Devanagari support.
          </p>
        </header>

        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Panchang date
            </span>
            <input
              type="date"
              value={panchangDate}
              onChange={(e) => setPanchangDate(e.target.value)}
              className="rounded-lg border border-zinc-200 bg-white px-4 py-3 text-zinc-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
            />
            <span className="text-xs text-zinc-500">
              {panchang.paksha} {panchang.tithi} · {panchang.nakshatra} ·{" "}
              {panchang.yoga}
              {panchang.festival ? ` · ${panchang.festival}` : ""}
            </span>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Title / शीर्षक
            </span>
            <input
              type="text"
              value={input.title}
              onChange={(e) => updateInput("title", e.target.value)}
              className="rounded-lg border border-zinc-200 bg-white px-4 py-3 text-zinc-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Quote / श्लोक
            </span>
            <textarea
              value={input.quote}
              onChange={(e) => updateInput("quote", e.target.value)}
              rows={5}
              className="resize-none rounded-lg border border-zinc-200 bg-white px-4 py-3 text-zinc-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
            />
            <span className="text-xs text-zinc-500">
              Formatting: **large bold** · *bold* · _italic_ · ==highlight== ·
              --small--
            </span>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Reference / संदर्भ
            </span>
            <input
              type="text"
              value={input.ref}
              onChange={(e) => updateInput("ref", e.target.value)}
              placeholder="कठोपनिषद्, Chapter 2..."
              className="rounded-lg border border-zinc-200 bg-white px-4 py-3 text-zinc-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Author <span className="font-normal text-zinc-400">(optional)</span>
            </span>
            <input
              type="text"
              value={input.author}
              onChange={(e) => updateInput("author", e.target.value)}
              className="rounded-lg border border-zinc-200 bg-white px-4 py-3 text-zinc-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
            />
          </label>
        </div>

        <OrgSwitcher selectedOrgId={orgId} onSelect={setOrgId} />

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Template
          </span>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {designTemplates.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTemplateId(t.id)}
                className={`rounded-lg border-2 px-3 py-2 text-left transition ${
                  templateId === t.id
                    ? "border-orange-500 bg-orange-50 dark:bg-orange-950"
                    : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-700"
                }`}
              >
                <span className="block text-sm font-medium">{t.name}</span>
                <span className="text-xs text-zinc-500">{t.description}</span>
              </button>
            ))}
          </div>
        </div>

        {needsBackgroundImage && (
          <div className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-zinc-50/50 p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
            <span className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
              Background photo
            </span>
            <label className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-zinc-300 bg-white px-4 py-6 text-center transition hover:border-orange-400 dark:border-zinc-600 dark:bg-zinc-900">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={(e) => {
                  void handleBackgroundUpload(e.target.files?.[0] ?? null);
                  e.target.value = "";
                }}
              />
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {backgroundImage ? "Replace photo" : "Upload photo"}
              </span>
              <span className="text-xs text-zinc-500">
                JPEG, PNG, or WebP · auto-detects best text placement
              </span>
            </label>

            <label className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Quote size
                </span>
                <span className="text-xs text-zinc-500">
                  {Math.round(options.imageBgQuoteScale * 100)}%
                  {options.imageBgQuoteScale === 1 ? " (auto)" : ""}
                </span>
              </div>
              <input
                type="range"
                min={50}
                max={150}
                step={5}
                value={Math.round(options.imageBgQuoteScale * 100)}
                onChange={(e) =>
                  setOptions((prev) => ({
                    ...prev,
                    imageBgQuoteScale: Number(e.target.value) / 100,
                  }))
                }
                className="w-full accent-orange-600"
              />
              <div className="flex justify-between text-xs text-zinc-400">
                <span>Smaller</span>
                <button
                  type="button"
                  onClick={() =>
                    setOptions((prev) => ({
                      ...prev,
                      imageBgQuoteScale: 1,
                    }))
                  }
                  className="text-orange-600 hover:underline dark:text-orange-400"
                >
                  Reset to auto
                </button>
                <span>Larger</span>
              </div>
            </label>

            <label className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Quote box opacity
                </span>
                <span className="text-xs text-zinc-500">
                  {Math.round(options.imageBgBoxOpacity * 100)}%
                </span>
              </div>
              <input
                type="range"
                min={20}
                max={100}
                step={5}
                value={Math.round(options.imageBgBoxOpacity * 100)}
                onChange={(e) =>
                  setOptions((prev) => ({
                    ...prev,
                    imageBgBoxOpacity: Number(e.target.value) / 100,
                  }))
                }
                className="w-full accent-orange-600"
              />
              <div className="flex justify-between text-xs text-zinc-400">
                <span>More photo</span>
                <button
                  type="button"
                  onClick={() =>
                    setOptions((prev) => ({
                      ...prev,
                      imageBgBoxOpacity: DEFAULT_IMAGE_BG_BOX_OPACITY,
                    }))
                  }
                  className="text-orange-600 hover:underline dark:text-orange-400"
                >
                  Reset
                </button>
                <span>More solid</span>
              </div>
            </label>

            {backgroundImage && (
              <div className="flex flex-col gap-2">
                <span className="text-xs text-zinc-500">
                  Text overlay:{" "}
                  <span className="font-medium capitalize text-zinc-700 dark:text-zinc-300">
                    {backgroundImage.textPlacement}
                  </span>
                </span>
                <div className="flex gap-2">
                  {(["top", "bottom"] as const).map((placement) => (
                    <button
                      key={placement}
                      type="button"
                      onClick={() => setTextPlacement(placement)}
                      className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium capitalize transition ${
                        backgroundImage.textPlacement === placement
                          ? "border-orange-500 bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300"
                          : "border-zinc-200 text-zinc-600 dark:border-zinc-700 dark:text-zinc-400"
                      }`}
                    >
                      {placement}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {uploadError && (
              <p className="text-sm text-red-600 dark:text-red-400">{uploadError}</p>
            )}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Color palette
          </span>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
            {palettes.map((p) => (
              <button
                key={p.id}
                type="button"
                title={p.name}
                onClick={() => setPaletteId(p.id)}
                className={`h-9 rounded-lg border-2 transition ${
                  paletteId === p.id
                    ? "border-orange-500 ring-2 ring-orange-500/30"
                    : "border-zinc-200 dark:border-zinc-700"
                }`}
                style={{
                  background: `linear-gradient(135deg, ${p.bg} 50%, ${p.bar} 50%)`,
                }}
              />
            ))}
          </div>
          <span className="text-xs text-zinc-500 capitalize">{palette.name}</span>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Format
          </span>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {formats.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFormatId(f.id)}
                className={`rounded-lg border-2 px-3 py-2 text-left transition ${
                  formatId === f.id
                    ? "border-orange-500 bg-orange-50 dark:bg-orange-950"
                    : "border-zinc-200 dark:border-zinc-700"
                }`}
              >
                <span className="block text-sm font-medium">{f.name}</span>
                <span className="text-xs text-zinc-500">{f.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-zinc-50/50 p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
          <span className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
            Language &amp; Font
          </span>
          <span className="text-xs text-zinc-500">
            Applies to title, quote, reference, footer text — not panchang or
            template decorations.
          </span>
          <div className="flex flex-wrap gap-2">
            {languages.map((lang) => (
              <button
                key={lang.id}
                type="button"
                onClick={() =>
                  setOptions((prev) => {
                    const fontId = isFontValidForLanguage(prev.fontId, lang.id)
                      ? prev.fontId
                      : DEFAULT_FONT_BY_LANGUAGE[lang.id];
                    return { ...prev, languageId: lang.id, fontId };
                  })
                }
                className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
                  options.languageId === lang.id
                    ? "border-orange-500 bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300"
                    : "border-zinc-200 text-zinc-600 dark:border-zinc-700 dark:text-zinc-400"
                }`}
              >
                {lang.nativeName}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {getFontsForLanguage(options.languageId).map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() =>
                  setOptions((prev) => ({ ...prev, fontId: f.id }))
                }
                className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
                  options.fontId === f.id
                    ? "border-orange-500 bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300"
                    : "border-zinc-200 text-zinc-600 dark:border-zinc-700 dark:text-zinc-400"
                }`}
                style={{ fontFamily: getFontFamily(f.id) }}
              >
                {f.name}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={options.showWatermark}
              onChange={(e) =>
                setOptions((prev) => ({
                  ...prev,
                  showWatermark: e.target.checked,
                }))
              }
              className="h-4 w-4 rounded accent-orange-600"
            />
            <span className="text-sm text-zinc-700 dark:text-zinc-300">
              Show watermark
            </span>
          </label>
        </div>

        {exportError && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
            {exportError}
          </p>
        )}

        <button
          type="button"
          onClick={handleDownload}
          disabled={isExporting || !canDownload}
          className="rounded-lg bg-orange-600 px-6 py-3 font-medium text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isExporting ? "Generating..." : `Download ${format.label} PNG`}
        </button>
      </section>

      <section className="flex min-w-0 flex-1 flex-col items-center gap-3 lg:sticky lg:top-8">
        <div className="flex w-full items-center justify-between">
          <span className="text-sm font-medium text-zinc-500">Preview</span>
          <span className="text-xs text-zinc-400">{format.label}</span>
        </div>
        <div
          className="overflow-hidden rounded-2xl shadow-2xl"
          style={{
            width: preview.width,
            height: preview.height,
          }}
        >
          <div
            style={{
              transform: `scale(${preview.scale})`,
              transformOrigin: "top left",
            }}
          >
            <PosterCard
              ref={cardRef}
              input={input}
              templateId={templateId}
              palette={palette}
              format={format}
              options={options}
              org={org}
              panchangDate={panchangDate}
              backgroundImage={backgroundImage}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to read file"));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}