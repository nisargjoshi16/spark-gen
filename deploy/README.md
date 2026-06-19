# Oracle Server Deployment

Same VM as panchang-bot / prachodayat-bot. **Do not build Next.js on the small VM** — use one of the options below.

## Recommended: GitHub builds, server only runs

On every push to `main` (or manual **Actions → Deploy → Run workflow**), GitHub Actions:

1. Runs `npm ci` + `npm run build` on a fast runner
2. Uploads `.next` tarball to the VM
3. Runs `npm ci --omit=dev` + Playwright on the VM (no compile)
4. Restarts `spark-gen`

### One-time on the VM

```bash
cd ~
git clone https://github.com/nisargjoshi16/spark-gen.git
cd spark-gen
bash deploy/install-server-light.sh
sudo npx playwright install-deps chromium
```

Add GitHub secrets (see below), then trigger deploy from GitHub Actions UI.

## Alternative: Build on your Windows PC

```powershell
cd D:\code\spark-gen
npm ci
npm run build
```

Upload build output (no `node_modules`):

```powershell
scp -i "C:\Users\nisar\Downloads\ssh-key-2026-04-16.key" -r .next public package.json package-lock.json next.config.ts ubuntu@80.225.209.167:~/spark-gen/
```

On the server:

```bash
cd ~/spark-gen
npm ci --omit=dev --no-audit --no-fund
npx playwright install chromium
nano .env   # secrets
sudo systemctl restart spark-gen
```

## Legacy: Build on the VM (slow — not recommended)

Use only if CI and PC build are unavailable:

```bash
bash deploy/install-server.sh
```

## First-time server setup (full — includes VM build)

SSH into your server (Ubuntu or Oracle Linux — same VM as panchang-bot / prachodayat-bot):

```bash
ssh ubuntu@your-server-ip
```

Run the install script:

```bash
curl -fsSL https://raw.githubusercontent.com/nisargjoshi16/spark-gen/main/deploy/install-server.sh | bash
```

Or clone manually:

```bash
cd ~
git clone https://github.com/nisargjoshi16/spark-gen.git
cd spark-gen
bash deploy/install-server.sh
```

Edit `.env` with production values (see `.env.example`), then start:

```bash
nano ~/spark-gen/.env
sudo systemctl start spark-gen
sudo systemctl status spark-gen
```

App listens on `http://<server-ip>:3000`.

## GitHub Actions (auto-deploy)

On every push to `main`, `.github/workflows/deploy.yml` builds on GitHub, uploads the release, installs production deps on the VM, writes `.env` from secrets, and restarts the service.

### Reuse from prachodayat-bot

| Secret | Notes |
|--------|--------|
| `SSH_HOST` | Same Oracle VM IP |
| `SSH_USER` | Usually `ubuntu` |
| `SSH_PRIVATE_KEY` | Same deploy key |

### Add for spark-gen

| Secret | Required |
|--------|----------|
| `APP_PASSWORD` | Team login password |
| `AUTH_SECRET` | Long random string for session cookies |
| `ORG_PIN_PRACHODAYAT` | Org export PIN |
| `ORG_PIN_SHARDUL` | Org export PIN |
| `GENERATE_API_SECRET` | Optional — for API/cron automation |

## Manual update (without Actions)

```bash
cd ~/spark-gen
git pull origin main
npm ci
npm run build
npx playwright install chromium
sudo systemctl restart spark-gen
```

## Logs & troubleshooting

### SSH dropped during `npm run build`

`client_loop: send disconnect: Connection reset` means your SSH session died mid-build (common on small VMs). Reconnect and run inside **tmux**:

```bash
ssh ubuntu@your-server-ip
sudo apt-get install -y tmux   # once, if missing
tmux new -s spark-build
cd ~/spark-gen
git pull origin main
npm ci
bash deploy/build-on-server.sh
npx playwright install chromium
sudo npx playwright install-deps chromium
sudo systemctl restart spark-gen
```

Detach tmux with `Ctrl+B` then `D` — build keeps running if you disconnect again.

### Service logs

```bash
sudo journalctl -u spark-gen -f
sudo systemctl status spark-gen
sudo systemctl restart spark-gen
tail -f ~/spark-gen/build.log
```

## Optional: nginx reverse proxy

If you already serve other apps on this VM, proxy a subdomain to port 3000:

```nginx
server {
    listen 80;
    server_name spark.prachodayat.in;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        client_max_body_size 20M;
    }
}
```

`client_max_body_size` helps photo-background uploads.