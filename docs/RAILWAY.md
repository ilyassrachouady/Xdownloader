# Deploy the SaveX extractor on Railway

The FastAPI + yt-dlp + ffmpeg service lives in `services/extractor`.
Deploy **this** on Railway. Keep the Next.js app on Vercel (see [VERCEL.md](./VERCEL.md)).

## Why Railway works

- Uses the existing `Dockerfile` (ffmpeg + Python already installed)
- Binds to `$PORT` automatically
- Public HTTPS URL → set as `NEXT_PUBLIC_API_URL` on Vercel

## One-time setup (dashboard)

1. [railway.app/new](https://railway.app/new) → **Deploy from GitHub repo**  
   Repo: `ilyassrachouady/Xdownloader`
2. **Root Directory**: `services/extractor`  
   (Settings → Root Directory — required so Railway finds the Dockerfile)
3. Railway should detect `Dockerfile` + `railway.toml` and build.
4. Generate a public domain: **Settings → Networking → Generate Domain**  
   Example: `https://savex-extractor-production.up.railway.app`

## Environment variables

In the Railway service → **Variables**:

| Name | Value |
| --- | --- |
| `ENVIRONMENT` | `production` |
| `DOWNLOAD_TOKEN_SECRET` | long random hex (`openssl rand -hex 32`) |
| `ALLOWED_ORIGINS` | `https://savethex.com,https://www.savethex.com,https://YOUR-APP.vercel.app` |
| `HLS_DOWNLOAD_TIMEOUT` | `7200` |
| `DOWNLOAD_TOKEN_TTL` | `7200` |
| `MAX_DOWNLOAD_BYTES` | `4294967296` |
| `EXTRACTION_TIMEOUT` | `90` |
| `CACHE_TTL` | `600` |
| `RATE_LIMIT_REQUESTS` | `30` |
| `RATE_LIMIT_WINDOW` | `60` |

`PORT` is set by Railway — do not override it.

## Wire Vercel

In the Vercel project (`apps/web`):

| Env var | Value |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://savethex.com` |
| `NEXT_PUBLIC_API_URL` | `https://YOUR-SERVICE.up.railway.app` (no trailing slash) |

Redeploy Vercel after saving. Downloads must hit Railway **directly** (not a Next `/api` rewrite).

## CLI alternative

```bash
# Install
npm i -g @railway/cli
# or: brew install railway

railway login
cd services/extractor
railway init          # link or create project
railway variables set \
  ENVIRONMENT=production \
  DOWNLOAD_TOKEN_SECRET="$(openssl rand -hex 32)" \
  ALLOWED_ORIGINS="https://savethex.com,https://www.savethex.com" \
  HLS_DOWNLOAD_TIMEOUT=7200 \
  DOWNLOAD_TOKEN_TTL=7200 \
  MAX_DOWNLOAD_BYTES=4294967296
railway up
railway domain        # generate public URL
```

## Health check

```bash
curl https://YOUR-SERVICE.up.railway.app/health
```

## Long live replays (important)

Railway’s public HTTP edge typically allows requests up to ~**15 minutes**, and will
close a connection if **no bytes** flow for ~5 minutes.

SaveX streams fragmented MP4 while ffmpeg remuxes HLS, so bytes keep flowing. That
covers most lives that remux within the edge limit.

If an hour+ live still truncates (e.g. ~8s or stops mid-file):

1. Confirm Vercel `NEXT_PUBLIC_API_URL` is the Railway URL (not same-origin `/api`)
2. Keep the browser tab open until the download finishes
3. Check Railway logs while downloading
4. Bump the service to more RAM/CPU if remux is slow / OOM

Very long remuxes that exceed Railway’s HTTP max may need a later “remux to file,
then download” path — say if that happens and we can add it.

## Useful commands

```bash
railway logs
railway status
railway variables
railway open
```

## Custom API domain (optional)

Railway → Settings → Networking → Custom Domain → `api.savethex.com`  
Then CNAME `api.savethex.com` → the Railway domain they show you.

Update:

- Vercel: `NEXT_PUBLIC_API_URL=https://api.savethex.com`
- Railway: include `https://savethex.com` in `ALLOWED_ORIGINS`
