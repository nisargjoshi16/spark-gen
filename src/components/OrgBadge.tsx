"use client";

import { useRouter } from "next/navigation";
import { getOrgLogoPath } from "@/lib/orgs";
import type { Org } from "@/types/poster";

interface OrgBadgeProps {
  org: Org;
  showSwitch?: boolean;
  compact?: boolean;
}

export function OrgBadge({ org, showSwitch = true, compact = false }: OrgBadgeProps) {
  const router = useRouter();

  async function switchOrg() {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div
      className={`flex items-center gap-2 rounded-full border border-[var(--spark-border)] bg-[var(--surface)] ${
        compact ? "px-2 py-1" : "px-3 py-1.5"
      }`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={getOrgLogoPath(org)}
        alt=""
        className={`rounded object-contain ${compact ? "h-5 w-5" : "h-7 w-7"}`}
      />
      <span
        className={`font-medium text-zinc-800 dark:text-zinc-200 ${
          compact ? "max-w-[6rem] truncate text-xs" : "text-sm"
        }`}
      >
        {org.name}
      </span>
      {showSwitch && (
        <button
          type="button"
          onClick={() => void switchOrg()}
          className="ml-0.5 text-xs font-medium text-orange-600 hover:text-orange-700 dark:text-orange-400"
        >
          Switch
        </button>
      )}
    </div>
  );
}