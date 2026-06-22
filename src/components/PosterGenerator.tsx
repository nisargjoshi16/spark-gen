"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { OrgSwitcher } from "@/components/OrgSwitcher";
import { PosterCard } from "@/components/poster/PosterCard";
import { designTemplates } from "@/lib/design-templates";
import { exportPosterFromServer } from "@/lib/export-server";
import { exportCardAsPng } from "@/lib/export-image";
import { IS_STATIC_EXPORT } from "@/lib/static-export";
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
  DEFAULT_TITLE_COLOR,
  effectiveQuoteColor,
  effectiveTitleColor,
  type BackgroundImageState,
  type DesignTemplateId,
  type FontId,
  type FormatId,
  type HeaderInfo,
  type LanguageId,
  type OrgId,
  type Palette,
  type PaletteId,
  type PosterInput,
  type PosterOptions,
  type TextPlacement,
} from "@/types/poster";
import { getFallbackHeader } from "@/lib/panchang-fallback";

function todayInIst(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
}

const FONT_SAMPLE: Record<LanguageId, string> = {
  hindi: "अ आ इ",
  sanskrit: "ॐ शान्तिः",
  gujarati: "અ આ ઇ",
  english: "Aa Bb",
};

const TEMPLATE_PALETTE_RECOMMENDATIONS: Partial<
  Record<DesignTemplateId, PaletteId>
> = {
  shloka: "saffron",
  traditional_vibrant: "golden_yellow",
  mandala_circle: "purple",
  diagonal_split: "bright_blue",
  sunrise_wave: "coral",
  glow_center: "indigo",
  minimal_rule: "earth_brown",
  left_accent: "orange",
  corner_frame: "mint_green",
  accent_card: "deep_rose",
  quote_box: "hot_pink",
  image_bg: "forest_green",
};

const inputClass =
  "w-full rounded-lg border border-[var(--spark-border)] bg-[var(--surface)] px-4 py-3 text-zinc-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 dark:text-zinc-50";

const compactInputClass =
  "w-full rounded-lg border border-[var(--spark-border)] bg-[var(--surface)] px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 dark:text-zinc-50";

const toolbarInnerClass = "mx-auto w-full max-w-6xl px-4";

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
  const [toast, setToast] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [paletteRecDismissed, setPaletteRecDismissed] = useState(false);

  const palette = getPalette(paletteId);
  const format = getFormat(formatId);
  const org = getOrg(orgId);
  const [mobileTab, setMobileTab] = useState<"setup" | "content">("setup");
  const [previewBounds, setPreviewBounds] = useState({
    maxHeight: 400,
    maxWidth: 320,
  });
  const preview = getPreviewScale(format, previewBounds);
  const [panchang, setPanchang] = useState<HeaderInfo>(getFallbackHeader());

  const recommendedPalette = TEMPLATE_PALETTE_RECOMMENDATIONS[templateId];
  const showPaletteRec =
    !paletteRecDismissed &&
    recommendedPalette &&
    recommendedPalette !== paletteId;

  useEffect(() => {
    setPanchang(computePanchang(panchangDate));
  }, [panchangDate]);

  useEffect(() => {
    const stored = localStorage.getItem("spark-gen-dark");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = stored === "true" || (stored === null && prefersDark);
    setDarkMode(initial);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    document.documentElement.classList.toggle("light", !darkMode);
    localStorage.setItem("spark-gen-dark", String(darkMode));
  }, [darkMode]);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(id);
  }, [toast]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        if (canDownload && !isExporting) void handleDownload();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, templateId, paletteId, formatId, orgId, options, backgroundImage, isExporting]);

  useEffect(() => {
    const updatePreviewBounds = () => {
      const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
      if (isDesktop) {
        setPreviewBounds({
          maxHeight: Math.min(Math.floor(window.innerHeight - 220), 680),
          maxWidth: Math.min(Math.floor(window.innerWidth * 0.28), 520),
        });
      } else {
        setPreviewBounds({
          maxHeight: Math.min(Math.floor(window.innerHeight * 0.36), 380),
          maxWidth: Math.min(Math.floor(window.innerWidth - 48), 300),
        });
      }
    };

    updatePreviewBounds();
    window.addEventListener("resize", updatePreviewBounds);
    return () => window.removeEventListener("resize", updatePreviewBounds);
  }, []);

  useEffect(() => {
    const languageIds = new Set([
      options.titleLanguageId,
      options.quoteLanguageId,
    ]);
    for (const languageId of languageIds) {
      for (const font of getFontsForLanguage(languageId)) {
        const id = `spark-gen-font-${font.id}`;
        if (document.getElementById(id)) continue;
        const link = document.createElement("link");
        link.id = id;
        link.rel = "stylesheet";
        link.href = font.googleFontsUrl;
        document.head.appendChild(link);
      }
    }
  }, [options.titleLanguageId, options.quoteLanguageId]);

  function updateInput<K extends keyof PosterInput>(key: K, value: PosterInput[K]) {
    setInput((prev) => ({ ...prev, [key]: value }));
  }

  const needsBackgroundImage = templateId === "image_bg";
  const canDownload =
    Boolean(input.title.trim() || input.quote.trim()) &&
    (!needsBackgroundImage || backgroundImage !== null);
  const isEmpty = !input.title.trim() && !input.quote.trim();

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
    setToast("Preparing PNG…");

    const filename = `${(input.title || "poster").slice(0, 30).replace(/\s+/g, "-").toLowerCase()}-${format.id}.png`;
    const request = {
      input,
      templateId,
      paletteId,
      formatId,
      orgId,
      options: {
        ...options,
        fontId: options.quoteFontId,
        languageId: options.quoteLanguageId,
      },
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
      if (IS_STATIC_EXPORT) {
        if (!cardRef.current) {
          throw new Error("Preview is not ready");
        }
        await exportCardAsPng(cardRef.current, filename);
      } else {
        await exportPosterFromServer(request, filename);
      }
      setToast("Download started!");
    } catch (serverError) {
      if (IS_STATIC_EXPORT) {
        setExportError(
          serverError instanceof Error ? serverError.message : "Export failed",
        );
        setToast("Export failed");
      } else {
        console.warn("Server export failed, falling back to client:", serverError);
        if (!cardRef.current) {
          setExportError(
            serverError instanceof Error
              ? serverError.message
              : "Export failed",
          );
          setToast("Export failed");
          return;
        }
        try {
          await exportCardAsPng(cardRef.current, filename);
          setToast("Download started!");
        } catch (clientError) {
          setExportError(
            clientError instanceof Error
              ? clientError.message
              : "Export failed",
          );
          setToast("Export failed");
        }
      }
    } finally {
      setIsExporting(false);
    }
  }

  function handleTemplateChange(id: DesignTemplateId) {
    setTemplateId(id);
    setPaletteRecDismissed(false);
  }

  const setupPanel = (
    <div className="flex flex-col gap-8">
      <PanelSection title="Date">
        <label className="flex flex-col gap-2">
          <input
            type="date"
            value={panchangDate}
            onChange={(e) => setPanchangDate(e.target.value)}
            className={inputClass}
          />
          <PanchangChip panchang={panchang} />
        </label>
      </PanelSection>

      <PanelSection title="Organization">
        <OrgSwitcher
          selectedOrgId={orgId}
          onSelect={setOrgId}
          showLabel={false}
          compact
        />
      </PanelSection>

      <PanelSection title="Template">
        <TemplatePicker
          templateId={templateId}
          onChange={handleTemplateChange}
        />
      </PanelSection>

      <PanelSection title="Color palette">
        <PalettePicker paletteId={paletteId} onChange={setPaletteId} />
        {showPaletteRec && recommendedPalette && (
          <button
            type="button"
            onClick={() => {
              setPaletteId(recommendedPalette);
              setPaletteRecDismissed(true);
            }}
            className="mt-2 rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 text-left text-xs text-orange-800 transition hover:bg-orange-100 dark:border-orange-900 dark:bg-orange-950 dark:text-orange-200"
          >
            Suggested for this template:{" "}
            <span className="font-semibold capitalize">
              {getPalette(recommendedPalette).name}
            </span>
          </button>
        )}
      </PanelSection>
    </div>
  );

  const contentPanel = (
    <div className="flex flex-col gap-6">
      <TextStyleCard
        label="Title"
        sublabel="शीर्षक"
        value={input.title}
        onChange={(v) => updateInput("title", v)}
        languageId={options.titleLanguageId}
        fontId={options.titleFontId}
        color={options.titleColor}
        scale={options.titleScale}
        palette={palette}
        defaultColor={DEFAULT_TITLE_COLOR}
        onLanguageChange={(languageId) =>
          setOptions((prev) => ({
            ...prev,
            titleLanguageId: languageId,
            titleFontId: isFontValidForLanguage(prev.titleFontId, languageId)
              ? prev.titleFontId
              : DEFAULT_FONT_BY_LANGUAGE[languageId],
          }))
        }
        onFontChange={(fontId) =>
          setOptions((prev) => ({ ...prev, titleFontId: fontId }))
        }
        onColorChange={(color) =>
          setOptions((prev) => ({ ...prev, titleColor: color }))
        }
        onScaleChange={(scale) =>
          setOptions((prev) => ({ ...prev, titleScale: scale }))
        }
        onResetStyle={() =>
          setOptions((prev) => ({
            ...prev,
            titleFontId: DEFAULT_FONT_BY_LANGUAGE[prev.titleLanguageId],
            titleColor: "",
            titleScale: 1,
          }))
        }
      />

      <TextStyleCard
        label="Quote"
        sublabel="श्लोक"
        value={input.quote}
        onChange={(v) => updateInput("quote", v)}
        multiline
        languageId={options.quoteLanguageId}
        fontId={options.quoteFontId}
        color={options.quoteColor}
        scale={options.quoteScale}
        palette={palette}
        defaultColor={palette.text}
        onLanguageChange={(languageId) =>
          setOptions((prev) => ({
            ...prev,
            quoteLanguageId: languageId,
            quoteFontId: isFontValidForLanguage(prev.quoteFontId, languageId)
              ? prev.quoteFontId
              : DEFAULT_FONT_BY_LANGUAGE[languageId],
            fontId: isFontValidForLanguage(prev.quoteFontId, languageId)
              ? prev.quoteFontId
              : DEFAULT_FONT_BY_LANGUAGE[languageId],
          }))
        }
        onFontChange={(fontId) =>
          setOptions((prev) => ({ ...prev, quoteFontId: fontId, fontId }))
        }
        onColorChange={(color) =>
          setOptions((prev) => ({ ...prev, quoteColor: color }))
        }
        onScaleChange={(scale) =>
          setOptions((prev) => ({
            ...prev,
            quoteScale: scale,
            imageBgQuoteScale: scale,
          }))
        }
        onResetStyle={() =>
          setOptions((prev) => ({
            ...prev,
            quoteFontId: DEFAULT_FONT_BY_LANGUAGE[prev.quoteLanguageId],
            quoteColor: "",
            quoteScale: 1,
            imageBgQuoteScale: 1,
          }))
        }
        showMarkdownHelp
      />

      <PanelSection title="Reference">
        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Source <span className="text-zinc-400">(optional)</span>
            </span>
            <input
              type="text"
              value={input.ref}
              onChange={(e) => updateInput("ref", e.target.value)}
              placeholder="कठोपनिषद्, Chapter 2…"
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Author <span className="text-zinc-400">(optional)</span>
            </span>
            <input
              type="text"
              value={input.author}
              onChange={(e) => updateInput("author", e.target.value)}
              className={inputClass}
            />
          </label>
        </div>
      </PanelSection>
    </div>
  );

  const previewPanel = (
    <PreviewPanel
      cardRef={cardRef}
      preview={preview}
      format={format}
      formatId={formatId}
      onFormatChange={setFormatId}
      input={input}
      templateId={templateId}
      palette={palette}
      options={options}
      org={org}
      panchangDate={panchangDate}
      backgroundImage={backgroundImage}
      exportError={exportError}
      isExporting={isExporting}
      canDownload={canDownload}
      onDownload={handleDownload}
      showChrome
      isEmpty={isEmpty}
    />
  );

  const compactPreview = (
    <PreviewPanel
      cardRef={cardRef}
      preview={preview}
      format={format}
      formatId={formatId}
      onFormatChange={setFormatId}
      input={input}
      templateId={templateId}
      palette={palette}
      options={options}
      org={org}
      panchangDate={panchangDate}
      backgroundImage={backgroundImage}
      exportError={exportError}
      isExporting={isExporting}
      canDownload={canDownload}
      onDownload={handleDownload}
      showChrome={false}
      isEmpty={isEmpty}
    />
  );

  const miniPreviewScale = Math.min(0.22, 72 / preview.height);

  const imageBgBelowPreview = needsBackgroundImage ? (
    <div className="w-full max-w-xs">
      <ImageBgPanel
        belowPreview
        backgroundImage={backgroundImage}
        boxOpacity={options.imageBgBoxOpacity}
        uploadError={uploadError}
        onUpload={(file) => void handleBackgroundUpload(file)}
        onOpacityChange={(v) =>
          setOptions((prev) => ({ ...prev, imageBgBoxOpacity: v }))
        }
        onPlacementChange={setTextPlacement}
      />
    </div>
  ) : null;

  return (
    <div className="flex min-h-0 flex-1 flex-col lg:min-h-0">
      {toast && <Toast message={toast} />}

      {/* Mobile */}
      <div className="flex flex-col lg:hidden">
        <SimpleHeader
          showWatermark={options.showWatermark}
          onWatermarkChange={(show) =>
            setOptions((prev) => ({ ...prev, showWatermark: show }))
          }
          darkMode={darkMode}
          onDarkModeChange={setDarkMode}
          onDownload={handleDownload}
          isExporting={isExporting}
          canDownload={canDownload}
        />
        <div className="border-b border-[var(--spark-border)] bg-[var(--spark-stage)] px-4 py-6">
          <div className="mx-auto flex max-w-md flex-col items-center gap-4">
            {previewPanel}
            {imageBgBelowPreview}
          </div>
        </div>
        <div className="sticky top-0 z-20 border-b border-[var(--spark-border)] bg-[var(--surface)]/95 backdrop-blur">
          <div className="mx-auto flex max-w-lg">
            {(["setup", "content"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setMobileTab(tab)}
                className={`flex-1 border-b-2 px-4 py-3 text-sm font-semibold capitalize transition ${
                  mobileTab === tab
                    ? "border-orange-500 text-orange-600 dark:text-orange-400"
                    : "border-transparent text-zinc-500 hover:text-zinc-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {mobileTab === "content" && (
          <div className="sticky top-[49px] z-10 border-b border-[var(--spark-border)] bg-[var(--spark-stage)] px-4 py-2">
            <div className="mx-auto flex max-w-lg items-center gap-3">
              <div
                className="shrink-0 overflow-hidden rounded-lg shadow ring-1 ring-zinc-200/80 dark:ring-zinc-700"
                style={{
                  width: preview.width * miniPreviewScale,
                  height: preview.height * miniPreviewScale,
                }}
              >
                <div
                  style={{
                    transform: `scale(${preview.scale * miniPreviewScale})`,
                    transformOrigin: "top left",
                  }}
                >
                  <PosterCard
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
              <p className="text-xs text-zinc-500">
                Live preview while editing
              </p>
            </div>
          </div>
        )}

        <div className="px-4 py-6">
          <div className="mx-auto max-w-lg">
            {mobileTab === "setup" ? setupPanel : contentPanel}
          </div>
        </div>
      </div>

      {/* Desktop: toolbar + 3 columns */}
      <div className="hidden min-h-0 flex-1 flex-col overflow-hidden lg:flex">
        <DesignToolbar
          panchang={panchang}
          panchangDate={panchangDate}
          onDateChange={setPanchangDate}
          orgId={orgId}
          onOrgChange={setOrgId}
          templateId={templateId}
          onTemplateChange={handleTemplateChange}
          paletteId={paletteId}
          onPaletteChange={(id) => {
            setPaletteId(id);
            setPaletteRecDismissed(true);
          }}
          formatId={formatId}
          onFormatChange={setFormatId}
          showWatermark={options.showWatermark}
          onWatermarkChange={(show) =>
            setOptions((prev) => ({ ...prev, showWatermark: show }))
          }
          darkMode={darkMode}
          onDarkModeChange={setDarkMode}
          isExporting={isExporting}
          canDownload={canDownload}
          onDownload={handleDownload}
          formatLabel={format.label}
          exportError={exportError}
          showPaletteRec={Boolean(showPaletteRec)}
          recommendedPalette={recommendedPalette}
          onApplyRecommendedPalette={() => {
            if (recommendedPalette) {
              setPaletteId(recommendedPalette);
              setPaletteRecDismissed(true);
            }
          }}
        />

        <div className="grid min-h-0 flex-1 grid-cols-[minmax(220px,1fr)_minmax(340px,1.5fr)_minmax(220px,1fr)] gap-4 overflow-hidden px-4 pb-4">
          <EditorColumn label="Title">
            <MergedTextCard
              label="Title"
              sublabel="शीर्षक"
              value={input.title}
              onChange={(v) => updateInput("title", v)}
              languageId={options.titleLanguageId}
              fontId={options.titleFontId}
              color={options.titleColor}
              scale={options.titleScale}
              palette={palette}
              defaultColor={DEFAULT_TITLE_COLOR}
              isTitle
              onLanguageChange={(languageId) =>
                setOptions((prev) => ({
                  ...prev,
                  titleLanguageId: languageId,
                  titleFontId: isFontValidForLanguage(
                    prev.titleFontId,
                    languageId,
                  )
                    ? prev.titleFontId
                    : DEFAULT_FONT_BY_LANGUAGE[languageId],
                }))
              }
              onFontChange={(fontId) =>
                setOptions((prev) => ({ ...prev, titleFontId: fontId }))
              }
              onColorChange={(color) =>
                setOptions((prev) => ({ ...prev, titleColor: color }))
              }
              onScaleChange={(scale) =>
                setOptions((prev) => ({ ...prev, titleScale: scale }))
              }
              onResetStyle={() =>
                setOptions((prev) => ({
                  ...prev,
                  titleFontId: DEFAULT_FONT_BY_LANGUAGE[prev.titleLanguageId],
                  titleColor: "",
                  titleScale: 1,
                }))
              }
            />
          </EditorColumn>

          <EditorColumn label="Preview" center borderless>
            <div className="flex w-full flex-col items-center gap-4 rounded-2xl bg-[var(--spark-stage)] p-5">
              {compactPreview}
              {imageBgBelowPreview}
            </div>
          </EditorColumn>

          <EditorColumn label="Quote & details">
            <MergedTextCard
              label="Quote"
              sublabel="श्लोक"
              value={input.quote}
              onChange={(v) => updateInput("quote", v)}
              multiline
              languageId={options.quoteLanguageId}
              fontId={options.quoteFontId}
              color={options.quoteColor}
              scale={options.quoteScale}
              palette={palette}
              defaultColor={palette.text}
              onLanguageChange={(languageId) =>
                setOptions((prev) => ({
                  ...prev,
                  quoteLanguageId: languageId,
                  quoteFontId: isFontValidForLanguage(
                    prev.quoteFontId,
                    languageId,
                  )
                    ? prev.quoteFontId
                    : DEFAULT_FONT_BY_LANGUAGE[languageId],
                  fontId: isFontValidForLanguage(prev.quoteFontId, languageId)
                    ? prev.quoteFontId
                    : DEFAULT_FONT_BY_LANGUAGE[languageId],
                }))
              }
              onFontChange={(fontId) =>
                setOptions((prev) => ({ ...prev, quoteFontId: fontId, fontId }))
              }
              onColorChange={(color) =>
                setOptions((prev) => ({ ...prev, quoteColor: color }))
              }
              onScaleChange={(scale) =>
                setOptions((prev) => ({
                  ...prev,
                  quoteScale: scale,
                  imageBgQuoteScale: scale,
                }))
              }
              onResetStyle={() =>
                setOptions((prev) => ({
                  ...prev,
                  quoteFontId: DEFAULT_FONT_BY_LANGUAGE[prev.quoteLanguageId],
                  quoteColor: "",
                  quoteScale: 1,
                  imageBgQuoteScale: 1,
                }))
              }
              showMarkdownHelp
            />
            <div className="mt-3 flex flex-col gap-2">
              <input
                type="text"
                value={input.ref}
                onChange={(e) => updateInput("ref", e.target.value)}
                placeholder="Reference (optional)"
                className={compactInputClass}
              />
              <input
                type="text"
                value={input.author}
                onChange={(e) => updateInput("author", e.target.value)}
                placeholder="Author (optional)"
                className={compactInputClass}
              />
            </div>
          </EditorColumn>
        </div>
      </div>
    </div>
  );
}

function useClickOutside(
  ref: React.RefObject<HTMLElement | null>,
  onClose: () => void,
  active: boolean,
) {
  useEffect(() => {
    if (!active) return;
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [ref, onClose, active]);
}

function PanchangChip({ panchang }: { panchang: HeaderInfo }) {
  return (
    <span className="inline-flex flex-wrap items-center gap-1 rounded-full bg-[var(--spark-warm)] px-2.5 py-1 text-xs text-zinc-600 dark:text-zinc-400">
      <span className="font-medium text-zinc-700 dark:text-zinc-300">
        {panchang.paksha} {panchang.tithi}
      </span>
      <span className="text-zinc-400">·</span>
      <span>{panchang.nakshatra}</span>
      {panchang.festival && (
        <>
          <span className="text-zinc-400">·</span>
          <span className="text-orange-600 dark:text-orange-400">
            {panchang.festival}
          </span>
        </>
      )}
    </span>
  );
}

function Toast({ message }: { message: string }) {
  return (
    <div
      role="status"
      className="spark-toast fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white shadow-lg dark:bg-zinc-100 dark:text-zinc-900"
    >
      {message}
    </div>
  );
}

function Spinner() {
  return (
    <svg
      className="spark-spinner h-3.5 w-3.5"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

function Popover({
  open,
  onClose,
  trigger,
  children,
  align = "left",
  width = "w-72",
  title,
}: {
  open: boolean;
  onClose: () => void;
  trigger: ReactNode;
  children: ReactNode;
  align?: "left" | "right";
  width?: string;
  title?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, onClose, open);

  return (
    <div ref={ref} className="relative">
      {trigger}
      {open && (
        <div
          className={`absolute top-full z-50 mt-2 ${width} overflow-hidden rounded-2xl border border-[var(--spark-border)] bg-[var(--surface)] shadow-2xl ring-1 ring-black/5 dark:ring-white/10 ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {title && (
            <div className="border-b border-[var(--spark-border)] bg-[var(--spark-warm)]/40 px-4 py-2.5">
              <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                {title}
              </p>
            </div>
          )}
          <div className="p-3">{children}</div>
        </div>
      )}
    </div>
  );
}

function TemplateStrip({
  templateId,
  onChange,
  compact = false,
}: {
  templateId: DesignTemplateId;
  onChange: (id: DesignTemplateId) => void;
  compact?: boolean;
}) {
  if (compact) {
    return (
      <div className="w-full overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="mx-auto flex w-max min-w-min justify-center gap-2 px-1">
        {designTemplates.map((t) => {
          const selected = templateId === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onChange(t.id)}
              title={t.description}
              className={`flex w-[5.5rem] shrink-0 flex-col items-center gap-1 rounded-xl p-2 transition ${
                selected
                  ? "bg-orange-50 ring-2 ring-orange-500 dark:bg-orange-950/60"
                  : "bg-zinc-50/80 ring-1 ring-[var(--spark-border)] hover:bg-zinc-100 dark:bg-zinc-800/40"
              }`}
            >
              <TemplateThumb id={t.id} size="sm" />
              <span className="w-full truncate text-center text-[10px] font-medium leading-tight">
                {t.name}
              </span>
            </button>
          );
        })}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-2">
      {designTemplates.map((t) => {
        const selected = templateId === t.id;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
            className={`relative rounded-xl p-2.5 text-left transition ${
              selected
                ? "bg-orange-50 ring-2 ring-orange-500 dark:bg-orange-950/60"
                : "bg-zinc-50/80 ring-1 ring-[var(--spark-border)] hover:bg-zinc-100/80 dark:bg-zinc-800/40"
            }`}
          >
            {selected && (
              <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[9px] text-white">
                ✓
              </span>
            )}
            <TemplateThumb id={t.id} />
            <span className="mt-2 block text-xs font-semibold text-zinc-800 dark:text-zinc-100">
              {t.name}
            </span>
            <span className="mt-0.5 line-clamp-2 text-[10px] leading-snug text-zinc-500">
              {t.description}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function TemplatePicker({
  templateId,
  onChange,
}: {
  templateId: DesignTemplateId;
  onChange: (id: DesignTemplateId) => void;
}) {
  return <TemplateStrip templateId={templateId} onChange={onChange} />;
}

function TemplateThumb({
  id,
  size = "md",
}: {
  id: DesignTemplateId;
  size?: "sm" | "md";
}) {
  const dims = size === "sm" ? "h-5 w-8" : "h-12 w-full";
  const accents: Partial<Record<DesignTemplateId, string>> = {
    shloka:
      "border-2 border-amber-600 bg-amber-50 shadow-[inset_0_0_0_2px_#fff]",
    quote_box: "bg-gradient-to-br from-zinc-100 to-zinc-300",
    traditional_vibrant: "bg-gradient-to-br from-orange-300 to-amber-500",
    diagonal_split: "bg-gradient-to-br from-sky-400 to-orange-400",
    mandala_circle:
      "rounded-full border-2 border-violet-400 bg-violet-50 shadow-[inset_0_0_8px_rgba(139,92,246,0.25)]",
    left_accent: "border-l-4 border-orange-500 bg-orange-50",
    sunrise_wave:
      "bg-gradient-to-b from-amber-200 via-white to-orange-300",
    corner_frame: "border border-dashed border-zinc-400 bg-white",
    glow_center:
      "bg-gradient-radial from-amber-100 to-orange-200 shadow-[inset_0_0_12px_rgba(251,191,36,0.4)]",
    minimal_rule: "border-t-2 border-b border-zinc-300 bg-zinc-50",
    accent_card:
      "border-2 border-orange-300 bg-white shadow-sm",
    image_bg: "bg-gradient-to-br from-emerald-300 to-sky-400",
  };

  return (
    <div
      className={`${dims} rounded-md ${accents[id] ?? "bg-gradient-to-br from-orange-100 to-amber-200"}`}
    />
  );
}

function PaletteSwatch({
  palette,
  size = "md",
}: {
  palette: Palette;
  size?: "sm" | "md" | "toolbar";
}) {
  const dims =
    size === "sm"
      ? "h-4 w-4"
      : size === "toolbar"
        ? "h-7 w-full min-w-[1.75rem]"
        : "h-9 w-full";
  return (
    <span
      className={`${dims} shrink-0 overflow-hidden rounded-md ring-1 ring-black/10`}
      style={{
        background: `linear-gradient(135deg, ${palette.bg} 55%, ${palette.bar} 55%)`,
      }}
    />
  );
}

function PaletteStrip({
  paletteId,
  onChange,
  compact = false,
}: {
  paletteId: PaletteId;
  onChange: (id: PaletteId) => void;
  compact?: boolean;
}) {
  const active = getPalette(paletteId);

  const buttons = palettes.map((p) => {
    const selected = paletteId === p.id;
    return (
      <button
        key={p.id}
        type="button"
        title={p.name}
        onClick={() => onChange(p.id)}
        className={`flex flex-col items-center gap-1 rounded-lg transition ${
          compact ? "p-1" : "p-1.5"
        } ${
          selected
            ? "bg-orange-50 ring-2 ring-orange-500 dark:bg-orange-950/50"
            : "hover:bg-zinc-50 dark:hover:bg-zinc-800/60"
        }`}
      >
        <PaletteSwatch palette={p} size={compact ? "toolbar" : "md"} />
        {!compact && (
          <span className="w-full truncate text-center text-[9px] capitalize leading-tight text-zinc-500">
            {p.name}
          </span>
        )}
      </button>
    );
  });

  if (compact) {
    return (
      <div className="flex max-w-3xl flex-wrap justify-center gap-1.5">
        {buttons}
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-4 gap-2">{buttons}</div>
      <span className="mt-2 block text-xs capitalize text-zinc-500">
        {active.name}
      </span>
    </div>
  );
}

function PalettePicker({
  paletteId,
  onChange,
}: {
  paletteId: PaletteId;
  onChange: (id: PaletteId) => void;
}) {
  return <PaletteStrip paletteId={paletteId} onChange={onChange} />;
}

function FontList({
  languageId,
  fontId,
  onChange,
  compact = false,
}: {
  languageId: LanguageId;
  fontId: FontId;
  onChange: (id: FontId) => void;
  compact?: boolean;
}) {
  const fonts = getFontsForLanguage(languageId);
  const sample = FONT_SAMPLE[languageId];

  return (
    <div
      className={`flex flex-col gap-1 overflow-y-auto rounded-xl border border-[var(--spark-border)] bg-[var(--spark-warm)]/30 p-1 ${
        compact ? "max-h-52" : "max-h-64"
      }`}
    >
      {fonts.map((f) => {
        const selected = fontId === f.id;
        return (
          <button
            key={f.id}
            type="button"
            onClick={() => onChange(f.id)}
            className={`flex w-full flex-col items-start gap-0.5 rounded-lg px-2.5 py-2 text-left transition ${
              selected
                ? "bg-orange-50 ring-1 ring-orange-400 dark:bg-orange-950/70 dark:ring-orange-500"
                : "hover:bg-white/80 dark:hover:bg-zinc-800/80"
            }`}
          >
            <span
              className={`leading-none text-zinc-800 dark:text-zinc-100 ${compact ? "text-lg" : "text-xl"}`}
              style={{ fontFamily: getFontFamily(f.id) }}
            >
              {sample}
            </span>
            <span className="text-[10px] text-zinc-500">{f.name}</span>
          </button>
        );
      })}
    </div>
  );
}

function MarkdownHelp() {
  const [open, setOpen] = useState(false);

  return (
    <Popover
      open={open}
      onClose={() => setOpen(false)}
      width="w-56"
      trigger={
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-zinc-100 text-[10px] font-bold text-zinc-500 hover:bg-orange-100 hover:text-orange-600 dark:bg-zinc-800"
          title="Formatting help"
        >
          ?
        </button>
      }
    >
      <p className="mb-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
        Quote formatting
      </p>
      <ul className="space-y-1 text-[11px] text-zinc-600 dark:text-zinc-400">
        <li>
          <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">**text**</code>{" "}
          large bold
        </li>
        <li>
          <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">*text*</code>{" "}
          bold
        </li>
        <li>
          <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">_text_</code>{" "}
          italic
        </li>
        <li>
          <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">==text==</code>{" "}
          highlight
        </li>
        <li>
          <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">--text--</code>{" "}
          smaller
        </li>
      </ul>
    </Popover>
  );
}

function ImageBgPanel({
  backgroundImage,
  boxOpacity,
  uploadError,
  onUpload,
  onOpacityChange,
  onPlacementChange,
  compact = false,
  belowPreview = false,
}: {
  backgroundImage: BackgroundImageState | null;
  boxOpacity: number;
  uploadError: string | null;
  onUpload: (file: File | null) => void;
  onOpacityChange: (v: number) => void;
  onPlacementChange: (p: TextPlacement) => void;
  compact?: boolean;
  belowPreview?: boolean;
}) {
  const wrapper = belowPreview
    ? "flex w-full flex-col gap-3 rounded-xl border border-[var(--spark-border)] bg-[var(--surface)]/80 p-4 shadow-sm"
    : compact
      ? "flex flex-col gap-2 rounded-lg border border-[var(--spark-border)] bg-[var(--spark-warm)]/50 p-3"
      : "mt-3 flex flex-col gap-3 rounded-xl border border-[var(--spark-border)] bg-[var(--spark-warm)]/50 p-4";

  return (
    <div className={wrapper}>
      <span
        className={
          compact
            ? "text-xs font-medium text-zinc-600"
            : "text-sm font-semibold text-zinc-700 dark:text-zinc-300"
        }
      >
        Background photo
      </span>
      <label className="flex cursor-pointer flex-col items-center gap-1 rounded-lg border-2 border-dashed border-zinc-300 bg-[var(--surface)] px-4 py-4 text-center transition hover:border-orange-400 dark:border-zinc-600">
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={(e) => {
            onUpload(e.target.files?.[0] ?? null);
            e.target.value = "";
          }}
        />
        <span
          className={
            compact ? "text-xs font-medium" : "text-sm font-medium"
          }
        >
          {backgroundImage ? "Replace photo" : "Upload photo"}
        </span>
        {(!compact || belowPreview) && (
          <span className="text-xs text-zinc-500">JPEG, PNG, or WebP</span>
        )}
      </label>

      <ScaleSlider
        label={
          compact && !belowPreview ? "Box opacity" : "Quote box opacity"
        }
        value={boxOpacity}
        min={20}
        max={100}
        step={5}
        format={(v) => `${Math.round(v * 100)}%`}
        onChange={onOpacityChange}
        onReset={() => onOpacityChange(DEFAULT_IMAGE_BG_BOX_OPACITY)}
        resetLabel="Reset"
        leftLabel={compact && !belowPreview ? "Photo" : "More photo"}
        rightLabel={compact && !belowPreview ? "Solid" : "More solid"}
      />

      {backgroundImage && (
        <div className="flex gap-2">
          {(["top", "bottom"] as const).map((placement) => (
            <button
              key={placement}
              type="button"
              onClick={() => onPlacementChange(placement)}
              className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium capitalize transition ${
                backgroundImage.textPlacement === placement
                  ? "border-orange-500 bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300"
                  : "border-[var(--spark-border)] text-zinc-600"
              }`}
            >
              {placement}
            </button>
          ))}
        </div>
      )}

      {uploadError && (
        <p className="text-xs text-red-600 dark:text-red-400">{uploadError}</p>
      )}
    </div>
  );
}

function PanelSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
        {title}
      </h3>
      {children}
    </section>
  );
}

function SimpleHeader({
  showWatermark,
  onWatermarkChange,
  darkMode,
  onDarkModeChange,
  onDownload,
  isExporting,
  canDownload,
}: {
  showWatermark: boolean;
  onWatermarkChange: (show: boolean) => void;
  darkMode: boolean;
  onDarkModeChange: (v: boolean) => void;
  onDownload: () => void;
  isExporting: boolean;
  canDownload: boolean;
}) {
  return (
    <header className="shrink-0 border-b border-[var(--spark-border)] bg-[var(--surface)] py-3">
      <div className={`${toolbarInnerClass} flex flex-wrap items-center justify-center gap-3`}>
        <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
          Spark Gen
        </h1>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <label className="flex items-center gap-2 text-sm text-zinc-600">
            <input
              type="checkbox"
              checked={showWatermark}
              onChange={(e) => onWatermarkChange(e.target.checked)}
              className="h-4 w-4 rounded accent-orange-600"
            />
            Watermark
          </label>
          <ThemeToggle darkMode={darkMode} onChange={onDarkModeChange} />
          <button
            type="button"
            onClick={onDownload}
            disabled={isExporting || !canDownload}
            className="flex items-center gap-1.5 rounded-full bg-orange-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
          >
            {isExporting && <Spinner />}
            PNG
          </button>
        </div>
      </div>
    </header>
  );
}

function ThemeToggle({
  darkMode,
  onChange,
}: {
  darkMode: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!darkMode)}
      className="rounded-lg border border-[var(--spark-border)] px-2 py-1 text-xs text-zinc-600 transition hover:border-orange-300 dark:text-zinc-400"
      title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {darkMode ? "☀" : "☾"}
    </button>
  );
}

function DesignToolbar({
  panchang,
  panchangDate,
  onDateChange,
  orgId,
  onOrgChange,
  templateId,
  onTemplateChange,
  paletteId,
  onPaletteChange,
  formatId,
  onFormatChange,
  showWatermark,
  onWatermarkChange,
  darkMode,
  onDarkModeChange,
  isExporting,
  canDownload,
  onDownload,
  formatLabel,
  exportError,
  showPaletteRec,
  recommendedPalette,
  onApplyRecommendedPalette,
}: {
  panchang: HeaderInfo;
  panchangDate: string;
  onDateChange: (date: string) => void;
  orgId: OrgId;
  onOrgChange: (id: OrgId) => void;
  templateId: DesignTemplateId;
  onTemplateChange: (id: DesignTemplateId) => void;
  paletteId: PaletteId;
  onPaletteChange: (id: PaletteId) => void;
  formatId: FormatId;
  onFormatChange: (id: FormatId) => void;
  showWatermark: boolean;
  onWatermarkChange: (show: boolean) => void;
  darkMode: boolean;
  onDarkModeChange: (v: boolean) => void;
  isExporting: boolean;
  canDownload: boolean;
  onDownload: () => void;
  formatLabel: string;
  exportError: string | null;
  showPaletteRec: boolean;
  recommendedPalette?: PaletteId;
  onApplyRecommendedPalette: () => void;
}) {
  const activeTemplate = designTemplates.find((t) => t.id === templateId)!;
  const activePalette = getPalette(paletteId);

  return (
    <div className="shrink-0 border-b border-[var(--spark-border)] bg-[var(--surface)]">
      {/* Row 1: primary controls */}
      <div className={`${toolbarInnerClass} flex flex-wrap items-center justify-center gap-x-3 gap-y-2 py-2`}>
        <h1 className="shrink-0 text-base font-bold text-zinc-900 dark:text-zinc-50">
          Spark Gen
        </h1>

        <ToolbarDivider />

        <ToolbarGroup label="Date">
          <input
            type="date"
            value={panchangDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="rounded-lg border border-[var(--spark-border)] bg-[var(--surface)] px-2 py-1 text-xs"
          />
          <PanchangChip panchang={panchang} />
        </ToolbarGroup>

        <ToolbarDivider />

        <ToolbarGroup label="Org">
          <OrgSwitcher
            selectedOrgId={orgId}
            onSelect={onOrgChange}
            showLabel={false}
            variant="toolbar"
          />
        </ToolbarGroup>

        <ToolbarDivider />

        <ToolbarGroup label="Format">
          <div className="flex flex-wrap justify-center gap-1">
            {formats.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => onFormatChange(f.id)}
                className={`rounded-full px-2 py-0.5 text-xs font-medium transition ${
                  formatId === f.id
                    ? "bg-orange-600 text-white"
                    : "bg-zinc-100 text-zinc-600 ring-1 ring-zinc-200 dark:bg-zinc-800 dark:text-zinc-300"
                }`}
              >
                {f.name}
              </button>
            ))}
          </div>
        </ToolbarGroup>

        <ToolbarDivider />

        <label className="flex shrink-0 items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400">
          <input
            type="checkbox"
            checked={showWatermark}
            onChange={(e) => onWatermarkChange(e.target.checked)}
            className="h-3.5 w-3.5 rounded accent-orange-600"
          />
          Watermark
        </label>

        <ThemeToggle darkMode={darkMode} onChange={onDarkModeChange} />

        <ToolbarDivider />

        <button
          type="button"
          onClick={onDownload}
          disabled={isExporting || !canDownload}
          className="flex shrink-0 items-center gap-2 rounded-full bg-orange-600 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-orange-700 disabled:opacity-50"
          title="Ctrl+S"
        >
          {isExporting ? (
            <>
              <Spinner />
              Exporting…
            </>
          ) : (
            `Download ${formatLabel}`
          )}
        </button>
      </div>

      {/* Row 2: templates */}
      <div className="border-t border-[var(--spark-border)] bg-[var(--spark-warm)]/30 py-2">
        <div className={`${toolbarInnerClass} flex flex-col items-center gap-2`}>
          <div className="flex flex-wrap items-center justify-center gap-2 text-center">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
              Template
            </span>
            <span className="text-[10px] text-zinc-400">·</span>
            <span className="text-[10px] font-medium text-zinc-600 dark:text-zinc-400">
              {activeTemplate.name}
            </span>
          </div>
          <TemplateStrip
            templateId={templateId}
            onChange={onTemplateChange}
            compact
          />
        </div>
      </div>

      {/* Row 3: palettes */}
      <div className="border-t border-[var(--spark-border)] py-2">
        <div className={`${toolbarInnerClass} flex flex-col items-center gap-2`}>
          <div className="flex flex-wrap items-center justify-center gap-2 text-center">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
              Palette
            </span>
            <span className="text-[10px] text-zinc-400">·</span>
            <span className="text-[10px] font-medium capitalize text-zinc-600 dark:text-zinc-400">
              {activePalette.name}
            </span>
            {showPaletteRec && recommendedPalette && (
              <button
                type="button"
                onClick={onApplyRecommendedPalette}
                className="rounded-full bg-orange-100 px-2.5 py-0.5 text-[10px] font-medium text-orange-700 hover:bg-orange-200 dark:bg-orange-950 dark:text-orange-300"
                title={`Try ${getPalette(recommendedPalette).name}`}
              >
                Try {getPalette(recommendedPalette).name}
              </button>
            )}
          </div>
          <PaletteStrip
            paletteId={paletteId}
            onChange={onPaletteChange}
            compact
          />
        </div>
      </div>

      {exportError && (
        <p className="border-t border-red-200 bg-red-50 px-4 py-1.5 text-center text-xs text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          {exportError}
        </p>
      )}
    </div>
  );
}

function ToolbarGroup({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex shrink-0 flex-wrap items-center justify-center gap-2">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
        {label}
      </span>
      {children}
    </div>
  );
}

function ToolbarDivider() {
  return <div className="h-6 w-px shrink-0 bg-[var(--spark-border)]" />;
}

function EditorColumn({
  label,
  children,
  center = false,
  borderless = false,
}: {
  label: string;
  children: ReactNode;
  center?: boolean;
  borderless?: boolean;
}) {
  return (
    <div
      className={`flex min-h-0 min-w-0 flex-col gap-2 overflow-y-auto p-3 ${
        borderless
          ? "bg-transparent"
          : "rounded-xl border border-[var(--spark-border)]/60 bg-[var(--surface)]/60"
      } ${center ? "items-center" : ""}`}
    >
      <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
        {label}
      </span>
      <div className={`min-h-0 w-full flex-1 ${center ? "flex justify-center" : ""}`}>
        {children}
      </div>
    </div>
  );
}

function MergedTextCard({
  label,
  sublabel,
  value,
  onChange,
  multiline = false,
  languageId,
  fontId,
  color,
  scale,
  palette,
  defaultColor,
  isTitle = false,
  onLanguageChange,
  onFontChange,
  onColorChange,
  onScaleChange,
  onResetStyle,
  showMarkdownHelp = false,
}: {
  label: string;
  sublabel: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  languageId: LanguageId;
  fontId: FontId;
  color: string;
  scale: number;
  palette: Palette;
  defaultColor: string;
  isTitle?: boolean;
  onLanguageChange: (id: LanguageId) => void;
  onFontChange: (id: FontId) => void;
  onColorChange: (color: string) => void;
  onScaleChange: (scale: number) => void;
  onResetStyle: () => void;
  showMarkdownHelp?: boolean;
}) {
  const displayColor = isTitle
    ? effectiveTitleColor({ titleColor: color } as PosterOptions)
    : effectiveQuoteColor({ quoteColor: color } as PosterOptions, palette);

  const colorPresets = [
    { name: "Default", value: "" },
    { name: "Text", value: palette.text },
    { name: "Accent", value: palette.accent },
    { name: "Orange", value: DEFAULT_TITLE_COLOR },
  ];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            {label}
          </p>
          <p className="text-[10px] text-zinc-500">{sublabel}</p>
        </div>
        <button
          type="button"
          onClick={onResetStyle}
          className="text-[10px] text-orange-600 hover:underline dark:text-orange-400"
        >
          Reset style
        </button>
      </div>

      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          className={`${compactInputClass} resize-none`}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={compactInputClass}
        />
      )}

      {showMarkdownHelp && (
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-zinc-500">Formatting</span>
          <MarkdownHelp />
        </div>
      )}

      <div className="flex flex-wrap gap-1">
        {languages.map((lang) => (
          <button
            key={lang.id}
            type="button"
            onClick={() => onLanguageChange(lang.id)}
            className={`rounded border px-2 py-0.5 text-[10px] font-medium transition ${
              languageId === lang.id
                ? "border-orange-500 bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300"
                : "border-[var(--spark-border)] text-zinc-600"
            }`}
          >
            {lang.nativeName}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] font-medium text-zinc-500">Font</span>
        <FontList
          languageId={languageId}
          fontId={fontId}
          onChange={onFontChange}
          compact
        />
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-medium text-zinc-500">Color</span>
        <div className="flex flex-wrap items-center gap-1">
          {colorPresets.map((preset) => (
            <button
              key={preset.name}
              type="button"
              title={preset.name}
              onClick={() => onColorChange(preset.value)}
              className={`h-6 w-6 rounded border-2 transition ${
                (color || "") === preset.value
                  ? "border-orange-500"
                  : "border-[var(--spark-border)]"
              }`}
              style={{ background: preset.value || defaultColor }}
            />
          ))}
          <input
            type="color"
            value={displayColor}
            onChange={(e) => onColorChange(e.target.value)}
            className="h-6 w-8 cursor-pointer rounded border border-[var(--spark-border)] bg-transparent"
          />
        </div>
      </div>

      <ScaleSlider
        label="Size"
        value={scale}
        min={50}
        max={150}
        step={5}
        format={(v) => `${Math.round(v * 100)}%${v === 1 ? " (auto)" : ""}`}
        onChange={onScaleChange}
        onReset={() => onScaleChange(1)}
        resetLabel="Auto"
        leftLabel="−"
        rightLabel="+"
      />
    </div>
  );
}

function PreviewPanel({
  cardRef,
  preview,
  format,
  formatId,
  onFormatChange,
  input,
  templateId,
  palette,
  options,
  org,
  panchangDate,
  backgroundImage,
  exportError,
  isExporting,
  canDownload,
  onDownload,
  showChrome = true,
  isEmpty = false,
}: {
  cardRef: React.RefObject<HTMLDivElement | null>;
  preview: ReturnType<typeof getPreviewScale>;
  format: ReturnType<typeof getFormat>;
  formatId: FormatId;
  onFormatChange: (id: FormatId) => void;
  input: PosterInput;
  templateId: DesignTemplateId;
  palette: Palette;
  options: PosterOptions;
  org: ReturnType<typeof getOrg>;
  panchangDate: string;
  backgroundImage: BackgroundImageState | null;
  exportError: string | null;
  isExporting: boolean;
  canDownload: boolean;
  onDownload: () => void;
  showChrome?: boolean;
  isEmpty?: boolean;
}) {
  return (
    <div className="flex w-full flex-col items-center gap-3">
      {showChrome && (
        <div className="flex w-full flex-wrap items-center justify-center gap-1.5">
          {formats.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => onFormatChange(f.id)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                formatId === f.id
                  ? "bg-orange-600 text-white"
                  : "bg-[var(--surface)] text-zinc-600 ring-1 ring-[var(--spark-border)]"
              }`}
            >
              {f.name}
            </button>
          ))}
        </div>
      )}

      <div className="relative">
        {isEmpty && (
          <div
            className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-xl border-2 border-dashed border-zinc-300/80 bg-zinc-50/40 dark:border-zinc-600 dark:bg-zinc-900/30"
            style={{ width: preview.width, height: preview.height }}
          >
            <p className="max-w-[70%] text-center text-xs text-zinc-400">
              Add a title or quote to see your poster
            </p>
          </div>
        )}
        <div
          className="overflow-hidden rounded-xl shadow-lg ring-1 ring-zinc-200/80 dark:ring-zinc-700"
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
              org={org}
              panchangDate={panchangDate}
              backgroundImage={backgroundImage}
            />
          </div>
        </div>
      </div>

      {showChrome && exportError && (
        <p className="w-full rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {exportError}
        </p>
      )}

      {showChrome && (
        <button
          type="button"
          onClick={onDownload}
          disabled={isExporting || !canDownload}
          className="flex w-full max-w-xs items-center justify-center gap-2 rounded-full bg-orange-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isExporting ? (
            <>
              <Spinner />
              Generating…
            </>
          ) : (
            `Download ${format.label} PNG`
          )}
        </button>
      )}
    </div>
  );
}

function TextStyleCard({
  label,
  sublabel,
  value,
  onChange,
  multiline = false,
  languageId,
  fontId,
  color,
  scale,
  palette,
  defaultColor,
  onLanguageChange,
  onFontChange,
  onColorChange,
  onScaleChange,
  onResetStyle,
  showMarkdownHelp = false,
}: {
  label: string;
  sublabel: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  languageId: LanguageId;
  fontId: FontId;
  color: string;
  scale: number;
  palette: Palette;
  defaultColor: string;
  onLanguageChange: (id: LanguageId) => void;
  onFontChange: (id: FontId) => void;
  onColorChange: (color: string) => void;
  onScaleChange: (scale: number) => void;
  onResetStyle: () => void;
  showMarkdownHelp?: boolean;
}) {
  const displayColor =
    label === "Title"
      ? effectiveTitleColor({ titleColor: color } as PosterOptions)
      : effectiveQuoteColor({ quoteColor: color } as PosterOptions, palette);

  const colorPresets = [
    { name: "Default", value: "" },
    { name: "Palette text", value: palette.text },
    { name: "Accent", value: palette.accent },
    { name: "Bar", value: palette.bar },
    { name: "Title orange", value: DEFAULT_TITLE_COLOR },
  ];

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-[var(--spark-border)] bg-[var(--surface)] p-5 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
            {label}
          </h3>
          <p className="text-xs text-zinc-500">{sublabel}</p>
        </div>
        <button
          type="button"
          onClick={onResetStyle}
          className="text-xs text-orange-600 hover:underline dark:text-orange-400"
        >
          Reset style
        </button>
      </div>

      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={5}
          className={`${inputClass} resize-none`}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={inputClass}
        />
      )}

      {showMarkdownHelp && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500">Formatting</span>
          <MarkdownHelp />
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {languages.map((lang) => (
          <button
            key={lang.id}
            type="button"
            onClick={() => onLanguageChange(lang.id)}
            className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition ${
              languageId === lang.id
                ? "border-orange-500 bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300"
                : "border-[var(--spark-border)] text-zinc-600"
            }`}
          >
            {lang.nativeName}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
          Font
        </span>
        <FontList
          languageId={languageId}
          fontId={fontId}
          onChange={onFontChange}
        />
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
          Color
        </span>
        <div className="flex flex-wrap items-center gap-2">
          {colorPresets.map((preset) => (
            <button
              key={preset.name}
              type="button"
              title={preset.name}
              onClick={() => onColorChange(preset.value)}
              className={`h-8 w-8 rounded-lg border-2 transition ${
                (color || "") === preset.value
                  ? "border-orange-500 ring-2 ring-orange-500/30"
                  : "border-[var(--spark-border)]"
              }`}
              style={{ background: preset.value || defaultColor }}
            />
          ))}
          <input
            type="color"
            value={displayColor}
            onChange={(e) => onColorChange(e.target.value)}
            className="h-8 w-10 cursor-pointer rounded border border-[var(--spark-border)] bg-transparent"
            title="Custom color"
          />
        </div>
      </div>

      <ScaleSlider
        label="Size"
        value={scale}
        min={50}
        max={150}
        step={5}
        format={(v) =>
          `${Math.round(v * 100)}%${v === 1 ? " (auto)" : ""}`
        }
        onChange={onScaleChange}
        onReset={() => onScaleChange(1)}
        resetLabel="Reset to auto"
        leftLabel="Smaller"
        rightLabel="Larger"
      />
    </div>
  );
}

function ScaleSlider({
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
  onReset,
  resetLabel,
  leftLabel,
  rightLabel,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (value: number) => string;
  onChange: (value: number) => void;
  onReset: () => void;
  resetLabel: string;
  leftLabel: string;
  rightLabel: string;
}) {
  return (
    <label className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
          {label}
        </span>
        <span className="text-xs text-zinc-500">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={Math.round(value * 100)}
        onChange={(e) => onChange(Number(e.target.value) / 100)}
        className="w-full accent-orange-600"
      />
      <div className="flex justify-between text-xs text-zinc-400">
        <span>{leftLabel}</span>
        <button
          type="button"
          onClick={onReset}
          className="text-orange-600 hover:underline dark:text-orange-400"
        >
          {resetLabel}
        </button>
        <span>{rightLabel}</span>
      </div>
    </label>
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