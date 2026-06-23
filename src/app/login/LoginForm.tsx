"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { getOrgLogoPath } from "@/lib/orgs";
import type { Org, OrgId } from "@/types/poster";

interface LoginFormProps {
  loginOrgs: Org[];
}

export function LoginForm({ loginOrgs }: LoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedOrgId, setSelectedOrgId] = useState<OrgId | null>(
    loginOrgs[0]?.id ?? null,
  );
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedOrg = loginOrgs.find((o) => o.id === selectedOrgId);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!selectedOrgId) {
      setError("Select an organization");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ orgId: selectedOrgId, password }),
      });

      if (!response.ok) {
        const message = await response.text();
        setError(message || "Login failed");
        return;
      }

      const next = searchParams.get("next") || "/";
      router.replace(next);
      router.refresh();
    } catch {
      setError("Could not reach the server. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loginOrgs.length === 0) {
    return (
      <div className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          Spark Gen
        </h1>
        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
          No organizations are configured for login. Set{" "}
          <code className="text-xs">ORG_PIN_*</code> environment variables.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Spark Gen
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Choose your organization and sign in
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <fieldset className="space-y-3">
          <legend className="sr-only">Organization</legend>
          <div className="grid gap-3 sm:grid-cols-1">
            {loginOrgs.map((org) => {
              const selected = selectedOrgId === org.id;
              return (
                <button
                  key={org.id}
                  type="button"
                  onClick={() => {
                    setSelectedOrgId(org.id);
                    setPassword("");
                    setError(null);
                  }}
                  className={`flex min-h-[4.5rem] w-full items-center gap-4 rounded-2xl border-2 px-4 py-3 text-left transition active:scale-[0.99] ${
                    selected
                      ? "border-orange-500 bg-orange-50 shadow-sm shadow-orange-500/10 dark:bg-orange-950/40"
                      : "border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getOrgLogoPath(org)}
                    alt=""
                    className="h-12 w-12 shrink-0 rounded-xl object-contain"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="block text-base font-semibold text-zinc-900 dark:text-zinc-50">
                      {org.name}
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-zinc-500">
                      {org.footer}
                    </span>
                  </div>
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                      selected
                        ? "border-orange-500 bg-orange-500 text-white"
                        : "border-zinc-300 dark:border-zinc-600"
                    }`}
                    aria-hidden
                  >
                    {selected && (
                      <svg viewBox="0 0 12 12" className="h-3 w-3 fill-current">
                        <path d="M10.3 3.3 4.5 9.1 1.7 6.3l1.4-1.4 1.4 1.4 4.2-4.2z" />
                      </svg>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>

        {selectedOrg && (
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Password for {selectedOrg.name}
            </label>
            <div className="relative mt-3">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                autoFocus
                required
                placeholder="Enter organization password"
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 pr-12 text-base outline-none transition focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:focus:bg-zinc-900"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-medium text-zinc-500 hover:text-zinc-700"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
        )}

        {error && (
          <p
            role="alert"
            className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !password || !selectedOrgId}
          className="w-full rounded-xl bg-orange-600 px-4 py-4 text-base font-semibold text-white shadow-sm transition hover:bg-orange-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}