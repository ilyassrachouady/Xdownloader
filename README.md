# SaveX — X Video Downloader

Production-ready monorepo for downloading videos, GIFs, and live replays from public X / Twitter posts.

```
Next.js (apps/web)  →  /api rewrite (same-origin)
        ↓
FastAPI extractor (services/extractor)
        ↓
yt-dlp + syndication + Periscope HLS → ffmpeg remux
```

**Brand growth engines**

- **Replace-domain**: `x.com/user/status/id` → `yourdomain.com/user/status/id`
- **PWA Share Target**: install SaveX, then Share → SaveX from the X app
- **Device history**: last 10 downloads in `localStorage` (no login)
- **Best quality first**: primary CTA + remux progress for live replays

## Architecture

| Piece | Role |
| --- | --- |
| `apps/web` | Next.js App Router frontend (TypeScript, Tailwind) |
| `services/extractor` | FastAPI service: URL validation, yt-dlp metadata extraction, signed downloads |
| `docker-compose.yml` | Local full stack (`web` + `extractor`) |

**Security model**

- Only `x.com` / `twitter.com` status URLs are accepted (frontend + backend).
- `/resolve` returns filtered formats with **HMAC-signed, short-lived download tokens**.
- `/download/{token}` streams remote media; clients never submit arbitrary media URLs (SSRF-safe).
- In-memory rate limiting (≈10 extractions / minute / IP) and TTL cache (≈10 minutes) — both interfaces are Redis-ready.

## Local installation

### Prerequisites

- Node.js 20+
- Python 3.11+
- ffmpeg (for yt-dlp when remuxing is needed)
- Docker (optional, for compose)

### 1. Environment

```bash
cp .env.example .env
# Also useful for the frontend:
cp .env.example apps/web/.env.local
```

Set a strong `DOWNLOAD_TOKEN_SECRET` before any public deployment.

### 2. Backend (FastAPI)

```bash
cd services/extractor
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

export ALLOWED_ORIGINS=http://localhost:3000
export DOWNLOAD_TOKEN_SECRET=dev-secret-change-me

uvicorn app.main:app --reload --port 8000
```

Health check: [http://localhost:8000/health](http://localhost:8000/health)

API docs (development): [http://localhost:8000/docs](http://localhost:8000/docs)

### 3. Frontend (Next.js)

```bash
cd apps/web
npm install
NEXT_PUBLIC_API_URL=http://localhost:8000 npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Docker Compose

From the repo root:

```bash
docker compose up --build
```

- Frontend: http://localhost:3000  
- Extractor: http://localhost:8000  

## Environment variables

| Variable | Description | Default / example |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | Extractor URL (used by Next rewrite + SSR) | `http://127.0.0.1:8000` |
| `EXTRACTOR_INTERNAL_URL` | Optional rewrite target override | `http://127.0.0.1:8000` |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL for SEO / magic-link tip | `https://savethex.com` |
| `ALLOWED_ORIGINS` | CORS origins (comma-separated) | includes `https://savethex.com` |
| `DOWNLOAD_TOKEN_SECRET` | HMAC secret for download tokens | **change me** |
| `DOWNLOAD_TOKEN_TTL` | Token lifetime (seconds) | `600` |
| `CACHE_TTL` | Extraction cache TTL (seconds) | `600` |
| `EXTRACTION_TIMEOUT` | yt-dlp / syndication timeout (seconds) | `90` |
| `HLS_DOWNLOAD_TIMEOUT` | Live remux timeout (seconds) | `1800` |
| `RATE_LIMIT_REQUESTS` | Max resolves per window | `10` |
| `RATE_LIMIT_WINDOW` | Rate limit window (seconds) | `60` |
| `ENVIRONMENT` | `development` enables `/docs` | `development` |

See `.env.example`.

## How yt-dlp is used

The extractor calls yt-dlp with **download disabled** (`skip_download`) to dump media metadata for a normalized `https://x.com/i/status/{id}` URL. Formats are filtered to HTTPS, video-bearing, directly downloadable streams (prefer MP4), deduplicated by height, and sorted highest → lowest.

Signed tokens wrap the internal media URL so the Next.js app only ever links to `/download/{token}`.

## Tests

```bash
# Backend
cd services/extractor
source .venv/bin/activate
pytest

# Frontend validation tests
cd apps/web
npm test
npm run lint
npm run typecheck
```

## Production deployment

**Recommended split**

1. **Frontend → Vercel** (see [docs/VERCEL.md](docs/VERCEL.md))  
   Root directory: `apps/web`  
   Domain: [savethex.com](https://savethex.com)  
   Env: `NEXT_PUBLIC_SITE_URL=https://savethex.com`  
   Env: `NEXT_PUBLIC_API_URL=https://your-extractor.example.com`  
   Do **not** run yt-dlp/ffmpeg on Vercel serverless.

2. **Extractor → Fly.io** (recommended) — see [docs/FLY.md](docs/FLY.md)  
   ```bash
   cd services/extractor
   fly auth login
   fly apps create savex-extractor
   fly secrets set DOWNLOAD_TOKEN_SECRET="$(openssl rand -hex 32)" \
     ALLOWED_ORIGINS="https://savethex.com,https://www.savethex.com"
   fly deploy
   ```  
   Then set Vercel `NEXT_PUBLIC_API_URL` to `https://savex-extractor.fly.dev` (or `https://api.savethex.com`).

   Alternatives: Railway / Render / any Docker VPS using `services/extractor/Dockerfile`.

3. Ensure ffmpeg is present in the extractor image (already installed in the Dockerfile).

### Updating yt-dlp when X changes

X occasionally breaks extractors. Update yt-dlp and redeploy the extractor:

```bash
cd services/extractor
source .venv/bin/activate
pip install -U yt-dlp
# or in Docker: rebuild without cache
docker compose build --no-cache extractor
```

Pin or bump the `yt-dlp` version in `requirements.txt` after verifying `/resolve` still returns formats.

## API overview

### `POST /resolve`

```json
{ "url": "https://x.com/user/status/123" }
```

Returns post metadata + filtered formats with `download_url` paths like `/download/{token}`.

### `GET /download/{token}`

Validates HMAC + expiry, streams the remote file with `Content-Disposition: attachment`.

### `GET /health`

Liveness probe.

## Project layout

```
apps/web/                 Next.js app
services/extractor/
  app/
    api/routes.py
    core/                 config, cache, security
    schemas/
    services/             twitter_extractor, download_service
    main.py
  Dockerfile
  tests/
docker-compose.yml
.env.example
README.md
```

## Growth tip: replace-domain + PWA

Domain: **[savethex.com](https://savethex.com)**

Market this pattern:

```
https://x.com/user/status/123
→ https://savethex.com/user/status/123
```

The app serves `/[username]/status/[id]` and auto-fetches that post.

**Mobile share**

1. Install SaveX (Add to Home Screen / Install app — see the on-site tip).
2. In X, Share → More → SaveX.
3. The PWA `share_target` opens `/share` and redirects to the post downloader.

Set `NEXT_PUBLIC_SITE_URL=https://savethex.com` in production (already in `.env.example`).

