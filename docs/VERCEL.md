# Deploy SaveX frontend on Vercel

The Next.js app lives in `apps/web`. The Python extractor (`services/extractor`)
cannot run on Vercel (needs yt-dlp + ffmpeg). Deploy it separately (Railway,
Render, Fly.io, or any Docker host), then point the web app at it.

## 1. Deploy the extractor first (Railway)

See **[RAILWAY.md](./RAILWAY.md)** for the full guide. Short version:

1. Railway → New Project → Deploy from GitHub (`ilyassrachouady/Xdownloader`)
2. **Root Directory**: `services/extractor`
3. Generate a public domain
4. Set variables (`DOWNLOAD_TOKEN_SECRET`, `ALLOWED_ORIGINS`, …)

```bash
# Or CLI
cd services/extractor
railway login && railway init && railway up
```

After you have a Vercel URL, update CORS on Railway:

```
ALLOWED_ORIGINS=https://savethex.com,https://www.savethex.com,https://YOUR-PROJECT.vercel.app
```

API URL example: `https://savex-extractor-production.up.railway.app`

(Fly.io alternative: [FLY.md](./FLY.md))

## 2. Import this repo on Vercel

1. [vercel.com/new](https://vercel.com/new) → Import `ilyassrachouady/Xdownloader`
2. **Root Directory**: `apps/web`
3. Framework: Next.js (auto)
4. Environment variables:

| Name | Value |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://savethex.com` |
| `NEXT_PUBLIC_API_URL` | `https://YOUR-EXTRACTOR-URL` (no trailing slash) |

`NEXT_PUBLIC_API_URL` must point at the Railway extractor. Downloads go there directly —
do not rely on the Next `/api` rewrite for long live remuxes (those get truncated to
~8s / one HLS segment).

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
