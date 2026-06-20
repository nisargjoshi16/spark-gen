import { PosterGenerator } from "@/components/PosterGenerator";

export default function Home() {
  return (
    <div className="min-h-dvh bg-[var(--background)] lg:flex lg:h-dvh lg:flex-col lg:overflow-hidden">
      <PosterGenerator />
    </div>
  );
}