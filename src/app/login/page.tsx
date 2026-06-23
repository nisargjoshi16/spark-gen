import { Suspense } from "react";
import { LoginForm } from "@/app/login/LoginForm";

export const dynamic = "force-dynamic";

export default function LoginPage() {

  return (
    <main className="flex min-h-dvh flex-1 items-center justify-center bg-gradient-to-b from-orange-50/80 to-zinc-50 px-4 py-10 dark:from-zinc-950 dark:to-zinc-950">
      <Suspense
        fallback={
          <div className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm text-zinc-500">Loading…</p>
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </main>
  );
}