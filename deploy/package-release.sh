#!/usr/bin/env bash
# Pack only production artifacts — keeps upload small and fast.
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${ROOT_DIR}"

OUTPUT="${1:-release.tar.gz}"

echo "==> Packing release (excluding cache and dev artifacts)"
tar -czf "${OUTPUT}" \
  --exclude='.next/cache' \
  --exclude='.next/dev' \
  --exclude='.next/diagnostics' \
  --exclude='.next/trace' \
  --exclude='.next/trace-build' \
  .next \
  public \
  package.json \
  package-lock.json \
  next.config.ts \
  deploy/remote-deploy.sh \
  deploy/spark-gen.service

SIZE="$(du -h "${OUTPUT}" | cut -f1)"
echo "==> Created ${OUTPUT} (${SIZE})"