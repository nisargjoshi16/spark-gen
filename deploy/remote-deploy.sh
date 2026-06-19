#!/usr/bin/env bash
# Run on the VM after release.tar.gz is uploaded — no Next.js build here.
set -euo pipefail

APP_DIR="${HOME}/spark-gen"
ARCHIVE="${APP_DIR}/release.tar.gz"

cd "${APP_DIR}"

if [[ ! -f "${ARCHIVE}" ]]; then
  echo "Missing ${ARCHIVE}" >&2
  exit 1
fi

echo "==> Extracting prebuilt release ($(du -h "${ARCHIVE}" | cut -f1))"
tar -xzf "${ARCHIVE}"
rm -f "${ARCHIVE}"

LOCK_HASH="$(sha256sum package-lock.json | awk '{print $1}')"
HASH_FILE="${APP_DIR}/node_modules/.deploy-lock-hash"

if [[ -f "${HASH_FILE}" && "$(cat "${HASH_FILE}")" == "${LOCK_HASH}" && -d node_modules/next ]]; then
  echo "==> node_modules unchanged — skipping npm ci"
else
  echo "==> Installing production dependencies"
  export NODE_OPTIONS="${NODE_OPTIONS:---max-old-space-size=1536}"
  npm ci --omit=dev --no-audit --no-fund
  echo "${LOCK_HASH}" > "${HASH_FILE}"
fi

if compgen -G "${HOME}/.cache/ms-playwright/chromium-"* >/dev/null 2>&1; then
  echo "==> Playwright Chromium already installed"
else
  echo "==> Installing Playwright Chromium (first deploy only — can take a few minutes)"
  npx playwright install chromium
fi

echo "==> Remote deploy step done"