import { fontOptions } from "@/lib/fonts";
import type { Customization, FontId, LayoutId, TextAlign } from "@/types/quote";

interface CustomizationPanelProps {
  customization: Customization;
  onChange: (next: Customization) => void;
}

const layouts: { id: LayoutId; name: string }[] = [
  { id: "classic", name: "Classic" },
  { id: "centered", name: "Centered" },
  { id: "editorial", name: "Editorial" },
];

const alignments: { id: TextAlign; name: string }[] = [
  { id: "left", name: "Left" },
  { id: "center", name: "Center" },
  { id: "right", name: "Right" },
];

function OptionGroup<T extends string>({
  label,
  options,
  value,
  onSelect,
}: {
  label: string;
  options: { id: T; name: string }[];
  value: T;
  onSelect: (id: T) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {label}
      </span>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onSelect(option.id)}
            className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
              value === option.id
                ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                : "border-zinc-200 text-zinc-600 hover:border-zinc-300 dark:border-zinc-700 dark:text-zinc-400"
            }`}
          >
            {option.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export function CustomizationPanel({
  customization,
  onChange,
}: CustomizationPanelProps) {
  function update<K extends keyof Customization>(
    key: K,
    value: Customization[K],
  ) {
    onChange({ ...customization, [key]: value });
  }

  return (
    <div className="flex flex-col gap-5 rounded-xl border border-zinc-200 bg-zinc-50/50 p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
        Customize
      </h2>

      <OptionGroup
        label="Layout"
        options={layouts}
        value={customization.layoutId}
        onSelect={(id) => update("layoutId", id)}
      />

      {customization.layoutId === "classic" && (
        <OptionGroup
          label="Alignment"
          options={alignments}
          value={customization.textAlign}
          onSelect={(id) => update("textAlign", id)}
        />
      )}

      <OptionGroup
        label="Font"
        options={fontOptions.map((f) => ({ id: f.id, name: f.name }))}
        value={customization.fontId}
        onSelect={(id) => update("fontId", id as FontId)}
      />

      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Quote size
        </span>
        <input
          type="range"
          min={0.8}
          max={1.6}
          step={0.1}
          value={customization.quoteSize}
          onChange={(e) => update("quoteSize", parseFloat(e.target.value))}
          className="w-full accent-blue-600"
        />
      </label>

      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={customization.showWatermark}
          onChange={(e) => update("showWatermark", e.target.checked)}
          className="h-4 w-4 rounded accent-blue-600"
        />
        <span className="text-sm text-zinc-700 dark:text-zinc-300">
          Show watermark
        </span>
      </label>
    </div>
  );
}