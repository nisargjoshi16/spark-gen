# GitHub Actions secrets — Vercel deploy

Alternative to the Oracle VM pipeline (`.github/workflows/deploy.yml`). On push to `main`, **Deploy to Vercel** builds on GitHub and deploys to your Vercel project.

---

## One-time Vercel project setup

1. Install the CLI locally (optional): `npm i -g vercel`
2. From the repo root: `vercel link` — create or link a project under your team/account.
3. Copy IDs from `.vercel/project.json` (do not commit this file):

```json
{
  "orgId": "team_xxxxxxxx",
  "projectId": "prj_xxxxxxxx"
}
```

4. Create a token: **Vercel → Account Settings → Tokens → Create**.

---

## GitHub secrets (required)

Add in **GitHub → Settings → Secrets and variables → Actions**:

| Secret | Description |
|--------|-------------|
| `VERCEL_TOKEN` | Personal/team token from Vercel |
| `VERCEL_ORG_ID` | `orgId` from `.vercel/project.json` |
| `VERCEL_PROJECT_ID` | `projectId` from `.vercel/project.json` |

Reuse the same app secrets as the Oracle deploy (workflow syncs them into Vercel on each deploy):

| Secret | Required |
|--------|----------|
| `APP_PASSWORD` | Yes |
| `AUTH_SECRET` | Yes |
| `ORG_PIN_PRACHODAYAT` | Yes |
| `ORG_PIN_SHARDUL` | Yes |
| `GENERATE_API_SECRET` | No |

You do **not** need the SSH secrets (`SSH_HOST`, `SSH_USER`, `SSH_PRIVATE_KEY`) for Vercel.

---

## Run deploy

- Push to `main`, or
- **GitHub → Actions → Deploy to Vercel → Run workflow**

The workflow prints the deployment URL in the job summary.

---

## Oracle vs Vercel

| | Oracle (`deploy.yml`) | Vercel (`deploy-vercel.yml`) |
|--|----------------------|------------------------------|
| Trigger | Push to `main` | Push to `main` |
| Build | GitHub Actions | GitHub Actions → Vercel |
| Playwright `/api/generate` | Full Chromium on VM | Limited on serverless; UI falls back to client export |
| Photo upload size | Up to ~20 MB (nginx) | ~4.5 MB request body on Hobby |

To stop auto-deploying to Oracle while keeping it as a manual fallback, edit `.github/workflows/deploy.yml` and remove the `push:` trigger (keep `workflow_dispatch` only).

---

## Troubleshooting

| Problem | Check |
|---------|--------|
| `Project not found` | `VERCEL_ORG_ID` / `VERCEL_PROJECT_ID` match `.vercel/project.json` |
| `Invalid token` | Regenerate `VERCEL_TOKEN`; token must access the linked team |
| Login page 401 / redirect loop | `APP_PASSWORD` and `AUTH_SECRET` set in GitHub secrets |
| Export fails on Vercel | Expected for Playwright on serverless; client-side export should still work |
| `maxDuration` build warning | 60s needs Vercel Pro; Hobby caps at 10s |

See also [deploy/GITHUB-SECRETS.md](./GITHUB-SECRETS.md) for auth secret generation.