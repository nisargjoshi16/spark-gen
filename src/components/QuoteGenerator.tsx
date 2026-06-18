"use client";

import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { QuoteCard } from "@/components/QuoteCard";
import { getTemplate, templates } from "@/lib/templates";
import type { TemplateId } from "@/types/quote";

const DEFAULT_TITLE = "The Power of Persistence";
const DEFAULT_QUOTE =
  "Success is not final, failure is not fatal: it is the courage to continue that counts.";

export function QuoteGenerator() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [title, setTitle] = useState(DEFAULT_TITLE);
  const [quote, setQuote] = useState(DEFAULT_QUOTE);
  const [templateId, setTemplateId] = useState<TemplateId>("gradient");
  const [isExporting, setIsExporting] = useState(false);

  const template = getTemplate(templateId);

  async function handleDownload() {
    if (!cardRef.current) return;

    setIsExporting(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 2,
        cacheBust: true,
      });

      const link = document.createElement("a");
      link.download = `${title.slice(0, 30).replace(/\s+/g, "-").toLowerCase() || "quote"}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Failed to export image:", error);
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-12 lg:flex-row lg:items-start lg:gap-16">
      <section className="flex flex-1 flex-col gap-8">
        <header>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Spark Gen
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Turn your title and quote into a shareable image.
          </p>
        </header>

        <div className="flex flex-col gap-5">
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
              rows={5}
              className="resize-none rounded-lg border border-zinc-200 bg-white px-4 py-3 text-zinc-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
            />
          </label>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Template
          </span>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {templates.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTemplateId(t.id)}
                className={`rounded-lg border-2 px-3 py-2 text-sm font-medium transition ${
                  templateId === t.id
                    ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                    : "border-zinc-200 text-zinc-600 hover:border-zinc-300 dark:border-zinc-700 dark:text-zinc-400"
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={handleDownload}
          disabled={isExporting || (!title && !quote)}
          className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isExporting ? "Generating..." : "Download Image"}
        </button>
      </section>

      <section className="flex flex-1 flex-col items-center gap-4">
        <span className="text-sm font-medium text-zinc-500">Preview</span>
        <div ref={cardRef} className="w-full max-w-[480px]">
          <QuoteCard input={{ title, quote }} template={template} />
        </div>
      </section>
    </div>
  );
}