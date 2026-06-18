#!/usr/bin/env bash
# First-time server setup for spark-gen (Ubuntu or Oracle Linux).
set -euo pipefail

APP_DIR="${HOME}/spark-gen"
REPO_URL="${SPARK_GEN_REPO:-https://github.com/nisargjoshi16/spark-gen.git}"
SERVICE_NAME="spark-gen"

node_major_version() {
  if ! command -v node >/dev/null 2>&1; then
    echo 0
    return
  fi
  node -p "Number(process.versions.node.split('.')[0])"
}

install_node_20() {
  if [[ "$(node_major_version)" -ge 20 ]]; then
    return 0
  fi

  echo "==> Installing Node.js 20"
  if command -v apt-get >/dev/null 2>&1; then
    export DEBIAN_FRONTEND=noninteractive
    export NEEDRESTART_MODE=a
    sudo -E apt-get update -y
    sudo -E apt-get install -y ca-certificates curl gnupg
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo -E apt-get install -y nodejs
  elif command -v dnf >/dev/null 2>&1; then
    curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
    sudo dnf install -y nodejs
  elif command -v yum >/dev/null 2>&1; then
    curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
    sudo yum install -y nodejs
  else
    echo "Could not detect apt, dnf, or yum. Install Node.js 20+ manually." >&2
    exit 1
  fi
}

echo "==> Checking Node.js 20+"
install_node_20

if [[ "$(node_major_version)" -lt 20 ]]; then
  echo "Node.js 20+ is required. Found: $(node -v 2>/dev/null || echo none)" >&2
  exit 1
fi

node -v
npm -v
NPM_PATH="$(command -v npm)"

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
sed \
  -e "s|__APP_DIR__|${APP_DIR}|g" \
  -e "s|__USER__|${USER}|g" \
  -e "s|__NPM_PATH__|${NPM_PATH}|g" \
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
echo "  4. Open firewall if needed:"
echo "     Ubuntu:  sudo ufw allow 3000/tcp"
echo "     Oracle:  sudo firewall-cmd --permanent --add-port=3000/tcp && sudo firewall-cmd --reload"