#!/usr/bin/env bash
# One-time VM setup without building Next.js on the server.
set -euo pipefail

APP_DIR="${HOME}/spark-gen"
REPO_URL="${SPARK_GEN_REPO:-https://github.com/nisargjoshi16/spark-gen.git}"
SERVICE_NAME="spark-gen"

if ! command -v node >/dev/null 2>&1 || [[ "$(node -p "Number(process.versions.node.split('.')[0])")" -lt 20 ]]; then
  echo "Install Node.js 20+ first (see deploy/README.md)" >&2
  exit 1
fi

NPM_PATH="$(command -v npm)"

if [[ ! -d "${APP_DIR}/.git" ]]; then
  git clone "${REPO_URL}" "${APP_DIR}"
fi

cd "${APP_DIR}"
git pull origin main

echo "==> Playwright system libraries (once)"
sudo npx playwright install-deps chromium || true

sed \
  -e "s|__APP_DIR__|${APP_DIR}|g" \
  -e "s|__USER__|${USER}|g" \
  -e "s|__NPM_PATH__|${NPM_PATH}|g" \
  "${APP_DIR}/deploy/spark-gen.service" | sudo tee "/etc/systemd/system/${SERVICE_NAME}.service" >/dev/null

if [[ ! -f "${APP_DIR}/.env" ]]; then
  cp "${APP_DIR}/.env.example" "${APP_DIR}/.env"
fi

sudo systemctl daemon-reload
sudo systemctl enable "${SERVICE_NAME}"

echo "Done. Deploy a prebuilt release via GitHub Actions, or from your PC:"
echo "  See deploy/README.md → \"Build on your PC\""