"use client";

import { useRef, useState } from "react";
import { CustomizationPanel } from "@/components/CustomizationPanel";
import { QuoteCard } from "@/components/QuoteCard";
import { exportCardAsPng } from "@/lib/export-image";
import { formats, getFormat } from "@/lib/formats";
import { getPreviewScale } from "@/lib/preview";
import { getTemplate, templates } from "@/lib/templates";
import {
  DEFAULT_CUSTOMIZATION,
  type Customization,
  type FormatId,
  type TemplateId,
} from "@/types/quote";

const DEFAULT_TITLE = "The Power of Persistence";
const DEFAULT_QUOTE =
  "Success is not final, failure is not fatal: it is the courage to continue that counts.";
const DEFAULT_AUTHOR = "Winston Churchill";

export function QuoteGenerator() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [title, setTitle] = useState(DEFAULT_TITLE);
  const [quote, setQuote] = useState(DEFAULT_QUOTE);
  const [author, setAuthor] = useState(DEFAULT_AUTHOR);
  const [templateId, setTemplateId] = useState<TemplateId>("gradient");
  const [formatId, setFormatId] = useState<FormatId>("square");
  const [customization, setCustomization] =
    useState<Customization>(DEFAULT_CUSTOMIZATION);
  const [isExporting, setIsExporting] = useState(false);

  const template = getTemplate(templateId);
  const format = getFormat(formatId);
  const preview = getPreviewScale(format);

  async function handleDownload() {
    if (!cardRef.current) return;

    setIsExporting(true);
    try {
      const filename = `${title.slice(0, 30).replace(/\s+/g, "-").toLowerCase() || "quote"}-${format.id}.png`;
      await exportCardAsPng(cardRef.current, filename);
    } catch (error) {
      console.error("Failed to export image:", error);
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
            Turn your title and quote into a shareable image.
          </p>
        </header>

        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Title
            </span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title..."
              className="rounded-lg border border-zinc-200 bg-white px-4 py-3 text-zinc-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Quote
            </span>
            <textarea
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              placeholder="Enter your quote..."
              rows={4}
              className="resize-none rounded-lg border border-zinc-200 bg-white px-4 py-3 text-zinc-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Author <span className="font-normal text-zinc-400">(optional)</span>
            </span>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Who said it?"
              className="rounded-lg border border-zinc-200 bg-white px-4 py-3 text-zinc-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
            />
          </label>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Format
          </span>
          <div className="grid grid-cols-3 gap-2">
            {formats.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFormatId(f.id)}
                className={`flex flex-col rounded-lg border-2 px-3 py-2 text-left transition ${
                  formatId === f.id
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                    : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-700"
                }`}
              >
                <span
                  className={`text-sm font-medium ${formatId === f.id ? "text-blue-700 dark:text-blue-300" : "text-zinc-700 dark:text-zinc-300"}`}
                >
                  {f.name}
                </span>
                <span className="text-xs text-zinc-500">{f.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Theme
          </span>
          <div className="grid grid-cols-4 gap-2">
            {templates.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTemplateId(t.id)}
                title={t.name}
                className={`h-10 rounded-lg border-2 transition ${
                  templateId === t.id
                    ? "border-blue-500 ring-2 ring-blue-500/30"
                    : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-700"
                }`}
                style={{ background: t.background }}
              />
            ))}
          </div>
          <span className="text-xs text-zinc-500">{template.name}</span>
        </div>

        <CustomizationPanel
          customization={customization}
          onChange={setCustomization}
        />

        <button
          type="button"
          onClick={handleDownload}
          disabled={isExporting || (!title && !quote)}
          className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
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
            <QuoteCard
              ref={cardRef}
              input={{ title, quote, author }}
              template={template}
              format={format}
              customization={customization}
            />
          </div>
        </div>
      </section>
    </div>
  );
}