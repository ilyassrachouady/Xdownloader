# Deploy the SaveX extractor on Fly.io

The FastAPI + yt-dlp + ffmpeg service lives in `services/extractor`.
Deploy **this** to Fly. Keep the Next.js app on Vercel (see [VERCEL.md](./VERCEL.md)).

## Prerequisites

```bash
# Install Fly CLI (macOS)
brew install flyctl

# Login
fly auth login
```

## One-time setup

From the repo root:

```bash
cd services/extractor

# Create the app (uses fly.toml in this folder)
fly apps create savex-extractor

# Or: fly launch --no-deploy
# (decline Postgres/Redis when asked)
```

Set secrets (required):

```bash
# Generate a long secret
openssl rand -hex 32

fly secrets set \
  DOWNLOAD_TOKEN_SECRET="paste-the-hex-here" \
  ALLOWED_ORIGINS="https://savethex.com,https://www.savethex.com,https://YOUR-APP.vercel.app"
```

Optional later: add your exact Vercel preview URL to `ALLOWED_ORIGINS`.

## Deploy

```bash
cd services/extractor
fly deploy
```

Check health:

```bash
fly status
fly open /health
# or:
curl https://savex-extractor.fly.dev/health
```

Your API base URL will look like:

```
https://savex-extractor.fly.dev
```

(Optional custom domain later: `api.savethex.com` → Fly)

## Wire Vercel to Fly

In the Vercel project (`apps/web`):

| Env var | Value |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://savethex.com` |
| `NEXT_PUBLIC_API_URL` | `https://savex-extractor.fly.dev` |

Redeploy Vercel after saving env vars.

## Custom API domain (recommended)

```bash
fly certs add api.savethex.com
```

Then create a DNS **CNAME**:

```
api.savethex.com  →  savex-extractor.fly.dev
```

Update:

- Vercel: `NEXT_PUBLIC_API_URL=https://api.savethex.com`
- Fly secret: include `https://savethex.com` in `ALLOWED_ORIGINS` (already set)

## Useful commands

```bash
fly logs                 # live logs
fly secrets list
fly scale memory 2048    # bump RAM if remux OOMs
fly scale count 1
fly ssh console          # shell into the machine
```

## Notes

- **Do not** put the extractor on Vercel — it needs ffmpeg and long-running streams.
- Live replays remux HLS → MP4; keep `min_machines_running = 1` so cold starts don’t kill downloads.
- If downloads time out, bump VM memory (`fly.toml` → `[[vm]] memory`) or check `fly logs`.
