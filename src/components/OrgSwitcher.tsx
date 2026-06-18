"use client";

import { useState } from "react";
import { DEFAULT_ORG_ID, orgs, orgRequiresPin } from "@/lib/orgs";
import type { Org, OrgId } from "@/types/poster";

interface OrgSwitcherProps {
  selectedOrgId: OrgId;
  onSelect: (orgId: OrgId) => void;
}

export function OrgSwitcher({ selectedOrgId, onSelect }: OrgSwitcherProps) {
  const [pendingOrg, setPendingOrg] = useState<Org | null>(null);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [unlocked, setUnlocked] = useState<Set<OrgId>>(
    () => new Set([DEFAULT_ORG_ID, "gurukul"]),
  );

  function trySelect(org: Org) {
    if (orgRequiresPin(org.id) && !unlocked.has(org.id)) {
      setPendingOrg(org);
      setPin("");
      setPinError(null);
      return;
    }

    onSelect(org.id);
  }

  async function submitPin() {
    if (!pendingOrg) return;

    setIsVerifying(true);
    setPinError(null);

    try {
      const response = await fetch("/api/auth/verify-org", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ orgId: pendingOrg.id, pin }),
      });

      if (!response.ok) {
        const message = await response.text();
        setPinError(message || "Incorrect PIN");
        return;
      }

      setUnlocked((prev) => new Set(prev).add(pendingOrg.id));
      onSelect(pendingOrg.id);
      setPendingOrg(null);
      setPin("");
    } catch {
      setPinError("Could not verify PIN. Try again.");
    } finally {
      setIsVerifying(false);
    }
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Organization
        </span>
        <div className="grid grid-cols-1 gap-2">
          {orgs.map((org) => (
            <button
              key={org.id}
              type="button"
              onClick={() => trySelect(org)}
              className={`flex items-center gap-3 rounded-lg border-2 px-3 py-2 text-left transition ${
                selectedOrgId === org.id
                  ? "border-orange-500 bg-orange-50 dark:bg-orange-950"
                  : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-700"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={org.logoPath}
                alt=""
                className="h-10 w-10 rounded object-contain"
              />
              <div>
                <span className="block text-sm font-medium">{org.name}</span>
                <span className="text-xs text-zinc-500">{org.footer}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {pendingOrg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl dark:bg-zinc-900">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Enter PIN for {pendingOrg.name}
            </h3>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !isVerifying && submitPin()}
              placeholder="PIN"
              autoFocus
              className="mt-4 w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 dark:border-zinc-700 dark:bg-zinc-800"
            />
            {pinError && (
              <p className="mt-2 text-sm text-red-600">{pinError}</p>
            )}
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={submitPin}
                disabled={isVerifying || !pin}
                className="flex-1 rounded-lg bg-orange-600 px-4 py-2 font-medium text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isVerifying ? "Verifying…" : "Unlock"}
              </button>
              <button
                type="button"
                onClick={() => setPendingOrg(null)}
                className="rounded-lg border border-zinc-200 px-4 py-2 dark:border-zinc-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}