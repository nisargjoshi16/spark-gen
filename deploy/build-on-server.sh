#!/usr/bin/env bash
# Production build tuned for small Ubuntu VMs (shared with other bots).
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${ROOT_DIR}"

export NODE_OPTIONS="${NODE_OPTIONS:---max-old-space-size=2048}"

mem_mb() {
  awk '/MemTotal/ {print int($2 / 1024)}' /proc/meminfo
}

ensure_swap_if_needed() {
  local ram
  ram="$(mem_mb)"
  if swapon --show 2>/dev/null | grep -q .; then
    echo "==> Swap already enabled"
    return 0
  fi
  if [[ "${ram}" -ge 3500 ]]; then
    return 0
  fi

  echo "==> Low RAM (${ram}MB) — adding 2G swap for build"
  if [[ ! -f /swapfile ]]; then
    sudo fallocate -l 2G /swapfile 2>/dev/null || \
      sudo dd if=/dev/zero of=/swapfile bs=1M count=2048 status=progress
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
  fi
  sudo swapon /swapfile 2>/dev/null || true
}

echo "==> Building spark-gen (webpack, memory-capped)"
ensure_swap_if_needed
npm run build:server 2>&1 | tee "${ROOT_DIR}/build.log"
echo "==> Build finished — log: ${ROOT_DIR}/build.log"