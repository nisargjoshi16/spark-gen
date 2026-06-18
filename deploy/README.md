# Oracle Server Deployment

Same pattern as [prachodayat-bot](https://github.com/nisargjoshi16/prachodayat-bot): GitHub Actions SSH deploy + systemd on the Oracle VM.

## First-time server setup

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

On every push to `main`, `.github/workflows/deploy.yml` SSHs to the server, pulls, builds, writes `.env` from secrets, and restarts the service.

### Reuse from prachodayat-bot

| Secret | Notes |
|--------|--------|
| `SSH_HOST` | Same Oracle VM IP |
| `SSH_USER` | Usually `opc` |
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

```bash
sudo journalctl -u spark-gen -f
sudo systemctl status spark-gen
sudo systemctl restart spark-gen
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