#!/usr/bin/env bash
# First-time Oracle server setup for spark-gen (run as opc on the VM).
set -euo pipefail

APP_DIR="${HOME}/spark-gen"
REPO_URL="${SPARK_GEN_REPO:-https://github.com/nisargjoshi16/spark-gen.git}"
SERVICE_NAME="spark-gen"

echo "==> Checking Node.js 20+"
if ! command -v node >/dev/null 2>&1 || [[ "$(node -p "process.versions.node.split('.')[0]")" -lt 20 ]]; then
  if command -v dnf >/dev/null 2>&1; then
    curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
    sudo dnf install -y nodejs
  else
    curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
    sudo yum install -y nodejs
  fi
fi

node -v
npm -v

echo "==> Cloning or updating repository"
if [[ ! -d "${APP_DIR}/.git" ]]; then
  git clone "${REPO_URL}" "${APP_DIR}"
fi

cd "${APP_DIR}"
git pull origin main

echo "==> Installing dependencies and building"
npm ci
npm run build

echo "==> Installing Playwright Chromium"
npx playwright install chromium
sudo npx playwright install-deps chromium

echo "==> Installing systemd service"
sed -e "s|__APP_DIR__|${APP_DIR}|g" -e "s|__USER__|${USER}|g" \
  "${APP_DIR}/deploy/spark-gen.service" | sudo tee "/etc/systemd/system/${SERVICE_NAME}.service" >/dev/null

if [[ ! -f "${APP_DIR}/.env" ]]; then
  cp "${APP_DIR}/.env.example" "${APP_DIR}/.env"
  echo ""
  echo "Created ${APP_DIR}/.env — edit it with real secrets, then restart:"
  echo "  nano ${APP_DIR}/.env"
  echo "  sudo systemctl restart ${SERVICE_NAME}"
fi

sudo systemctl daemon-reload
sudo systemctl enable "${SERVICE_NAME}"

echo ""
echo "Done. Next steps:"
echo "  1. Set secrets in ${APP_DIR}/.env (or use GitHub Actions secrets on deploy)"
echo "  2. sudo systemctl start ${SERVICE_NAME}"
echo "  3. sudo systemctl status ${SERVICE_NAME}"
echo "  4. Open firewall port 3000 if needed:"
echo "     sudo firewall-cmd --permanent --add-port=3000/tcp && sudo firewall-cmd --reload"