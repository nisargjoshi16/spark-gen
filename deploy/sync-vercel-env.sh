#!/usr/bin/env bash
# Push production env vars from GitHub Actions secrets into the linked Vercel project.
set -euo pipefail

if [[ -z "${VERCEL_TOKEN:-}" ]]; then
  echo "VERCEL_TOKEN is required" >&2
  exit 1
fi

sync_env() {
  local name="$1"
  local value="${2:-}"

  if [[ -z "${value}" ]]; then
    echo "==> Skipping ${name} (not set)"
    return 0
  fi

  printf '%s' "${value}" | vercel env add "${name}" production \
    --force \
    --token="${VERCEL_TOKEN}" \
    >/dev/null
  echo "==> Synced ${name}"
}

sync_env APP_PASSWORD "${APP_PASSWORD:-}"
sync_env AUTH_SECRET "${AUTH_SECRET:-}"
sync_env GENERATE_API_SECRET "${GENERATE_API_SECRET:-}"
sync_env ORG_PIN_PRACHODAYAT "${ORG_PIN_PRACHODAYAT:-}"
sync_env ORG_PIN_SHARDUL "${ORG_PIN_SHARDUL:-}"

echo "==> Vercel environment sync complete"