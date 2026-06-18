"use client";

import { useEffect, useRef, useState } from "react";
import { PosterCard } from "@/components/poster/PosterCard";
import { designTemplates } from "@/lib/design-templates";
import { exportPosterFromServer } from "@/lib/export-server";
import { exportCardAsPng } from "@/lib/export-image";
import { fontOptions } from "@/lib/fonts";
import { formats, getFormat } from "@/lib/formats";
import { getPalette, palettes } from "@/lib/palettes";
import { computePanchang } from "@/lib/panchang";
import { getPreviewScale } from "@/lib/preview";
import {
  DEFAULT_POSTER_INPUT,
  DEFAULT_POSTER_OPTIONS,
  type DesignTemplateId,
  type FontId,
  type FormatId,
  type PaletteId,
  type HeaderInfo,
  type PosterInput,
  type PosterOptions,
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
  const [panchangDate, setPanchangDate] = useState(todayInIst);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const palette = getPalette(paletteId);
  const format = getFormat(formatId);
  const preview = getPreviewScale(format);
  const [panchang, setPanchang] = useState<HeaderInfo>(getFallbackHeader());

  useEffect(() => {
    setPanchang(computePanchang(panchangDate));
  }, [panchangDate]);

  function updateInput<K extends keyof PosterInput>(key: K, value: PosterInput[K]) {
    setInput((prev) => ({ ...prev, [key]: value }));
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
      options,
      panchangDate,
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
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-12 lg:flex-row lg:items-start lg:gap-12">
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

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Template
          </span>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
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
            Font
          </span>
          <div className="flex flex-wrap gap-2">
            {fontOptions.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() =>
                  setOptions((prev) => ({ ...prev, fontId: f.id as FontId }))
                }
                className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
                  options.fontId === f.id
                    ? "border-orange-500 bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300"
                    : "border-zinc-200 text-zinc-600 dark:border-zinc-700 dark:text-zinc-400"
                }`}
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
          disabled={isExporting || (!input.title && !input.quote)}
          className="rounded-lg bg-orange-600 px-6 py-3 font-medium text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isExporting ? "Generating..." : `Download ${format.label} PNG`}
        </button>
      </section>

      <section className="flex flex-1 flex-col items-center gap-3 lg:sticky lg:top-8">
        <div className="flex w-full items-center justify-between">
          <span className="text-sm font-medium text-zinc-500">Preview</span>
          <span className="text-xs text-zinc-400">{format.label}</span>
        </div>
        <div
          className="overflow-hidden rounded-2xl shadow-2xl"
          style={{ width: preview.width, height: preview.height }}
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
              panchangDate={panchangDate}
            />
          </div>
        </div>
      </section>
    </div>
  );
}