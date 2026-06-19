# GitHub Actions secrets — spark-gen

Add these in the **spark-gen** repository:

**GitHub → Settings → Secrets and variables → Actions → New repository secret**

Secrets are per-repo. Copy the same SSH values from **prachodayat-bot** if you already deploy there.

---

## SSH (required)

| Secret | Example | Description |
|--------|---------|-------------|
| `SSH_HOST` | `80.225.209.167` | Public IP of the Ubuntu VM (`panchang-bot`) |
| `SSH_USER` | `ubuntu` | SSH login user |
| `SSH_PRIVATE_KEY` | *(full key contents)* | Private key matching the `.key` file you use locally. Paste the entire file, including `-----BEGIN ... KEY-----` and `-----END ... KEY-----` |

The deploy workflow uses these to:

1. Upload `release.tar.gz` via SCP
2. SSH in to install deps, write `.env`, and restart `spark-gen`

**Requirement:** `ubuntu` must be able to run `sudo systemctl` without a password (same as prachodayat-bot deploy).

---

## App auth (required in production)

| Secret | Example | Description |
|--------|---------|-------------|
| `APP_PASSWORD` | *(your choice)* | Shared team password for `/login` |
| `AUTH_SECRET` | *(long random string)* | Signs session cookies. Use 32+ random characters; do not reuse `APP_PASSWORD` |
| `ORG_PIN_PRACHODAYAT` | *(your PIN)* | Unlocks Prachodayat branding on server export |
| `ORG_PIN_SHARDUL` | *(your PIN)* | Unlocks Shardul branding on server export |

These are written to `~/spark-gen/.env` on each deploy.

---

## Optional

| Secret | Example | Description |
|--------|---------|-------------|
| `GENERATE_API_SECRET` | *(random API key)* | For automation calling `POST /api/generate` with `Authorization: Bearer <key>`. Omit or leave empty if unused |

---

## Minimum set

**7 secrets** (without optional API key):

1. `SSH_HOST`
2. `SSH_USER`
3. `SSH_PRIVATE_KEY`
4. `APP_PASSWORD`
5. `AUTH_SECRET`
6. `ORG_PIN_PRACHODAYAT`
7. `ORG_PIN_SHARDUL`

---

## Generate `AUTH_SECRET` (examples)

**Linux / macOS:**

```bash
openssl rand -base64 32
```

**PowerShell:**

```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

---

## After secrets are set

### One-time on the VM

```bash
cd ~/spark-gen
git pull origin main
bash deploy/install-server-light.sh
sudo npx playwright install-deps chromium
```

### Run deploy

**GitHub → Actions → Deploy → Run workflow**

Or push to `main` (deploy runs automatically).

### Verify on the VM

```bash
sudo systemctl status spark-gen
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:3000/login
```

Expect `200`. Open `http://<SSH_HOST>:3000` and sign in with `APP_PASSWORD`.

---

## Troubleshooting

| Problem | Check |
|---------|--------|
| SSH step fails | `SSH_HOST`, `SSH_USER`, `SSH_PRIVATE_KEY`; VM running; port 22 open |
| `sudo: a password is required` | Add passwordless sudo for `ubuntu` for `systemctl`, or fix sudoers |
| Login works but export fails | `ORG_PIN_*` set; unlock org in UI before export |
| Workflow build fails | See Actions log — build runs on GitHub, not the VM |

See also [deploy/README.md](./README.md).