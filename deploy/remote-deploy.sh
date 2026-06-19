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

echo "==> Extracting prebuilt release"
tar -xzf "${ARCHIVE}"
rm -f "${ARCHIVE}"

echo "==> Installing production dependencies only"
export NODE_OPTIONS="${NODE_OPTIONS:---max-old-space-size=1536}"
npm ci --omit=dev --no-audit --no-fund

echo "==> Playwright Chromium (export API)"
npx playwright install chromium

echo "==> Remote deploy step done"