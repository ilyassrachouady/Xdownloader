# Deploy SaveX frontend on Vercel

The Next.js app lives in `apps/web`. The Python extractor (`services/extractor`)
cannot run on Vercel (needs yt-dlp + ffmpeg). Deploy it separately (Railway,
Render, Fly.io, or any Docker host), then point the web app at it.

## 1. Deploy the extractor first

```bash
# Example: Railway / Fly / any Docker host
# Build: services/extractor/Dockerfile
# Env:
#   ALLOWED_ORIGINS=https://savethex.com,https://www.savethex.com,https://*.vercel.app
#   DOWNLOAD_TOKEN_SECRET=<long-random>
#   ENVIRONMENT=production
#   EXTRACTION_TIMEOUT=90
#   HLS_DOWNLOAD_TIMEOUT=1800
```

Note the public HTTPS URL, e.g. `https://api.savethex.com`.

## 2. Import this repo on Vercel

1. [vercel.com/new](https://vercel.com/new) → Import `ilyassrachouady/Xdownloader`
2. **Root Directory**: `apps/web`
3. Framework: Next.js (auto)
4. Environment variables:

| Name | Value |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://savethex.com` |
| `NEXT_PUBLIC_API_URL` | `https://YOUR-EXTRACTOR-URL` (no trailing slash) |

5. Deploy

## 3. Attach the domain

In Vercel → Project → Domains → add `savethex.com` and `www.savethex.com`.

Update DNS at your registrar (usually A/CNAME records Vercel shows).

## 4. CORS

On the extractor, set `ALLOWED_ORIGINS` to include:

```
https://savethex.com,https://www.savethex.com,https://xdownloader.vercel.app
```

(add your exact `*.vercel.app` preview URL if needed)

## Local preview of production build

```bash
cd apps/web
NEXT_PUBLIC_SITE_URL=https://savethex.com \
NEXT_PUBLIC_API_URL=https://YOUR-EXTRACTOR-URL \
npm run build && npm start
```
