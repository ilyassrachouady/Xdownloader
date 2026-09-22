"""Stream remote media through the API using signed tokens."""

from __future__ import annotations

import asyncio
import logging
import shutil
from collections.abc import AsyncIterator
from urllib.parse import urlparse

import httpx
from fastapi import HTTPException
from fastapi.responses import StreamingResponse

from app.core.config import Settings
from app.core.security import TokenError, verify_download_token

logger = logging.getLogger(__name__)

ALLOWED_MEDIA_HOST_SUFFIXES = (
    "twimg.com",
    "twitter.com",
    "x.com",
    "pscp.tv",
    "periscope.tv",
)


def _host_allowed(hostname: str | None) -> bool:
    if not hostname:
        return False
    host = hostname.lower()
    return any(host == suffix or host.endswith("." + suffix) for suffix in ALLOWED_MEDIA_HOST_SUFFIXES)


async def _stream_direct(payload, settings: Settings) -> StreamingResponse:
    filename = f"x-video-{payload.tweet_id}-{payload.quality}.mp4"
    headers = {
        "Content-Disposition": f'attachment; filename="{filename}"',
        "Cache-Control": "no-store",
    }

    client = httpx.AsyncClient(
        timeout=httpx.Timeout(settings.download_timeout, connect=10.0),
        follow_redirects=True,
        headers={
            "User-Agent": (
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
            ),
            "Referer": "https://x.com/",
        },
    )

    try:
        request = client.build_request("GET", payload.media_url)
        response = await client.send(request, stream=True)
    except httpx.HTTPError as exc:
        await client.aclose()
        logger.warning("Upstream media request failed: %s", exc)
        raise HTTPException(
            status_code=502,
            detail={
                "code": "download_failed",
                "message": "We couldn't download the media file. Please resolve the post again.",
            },
        ) from exc

    if response.status_code >= 400:
        await response.aclose()
        await client.aclose()
        raise HTTPException(
            status_code=502,
            detail={
                "code": "download_failed",
                "message": "We couldn't download the media file. Please resolve the post again.",
            },
        )

    content_type = response.headers.get("content-type") or "video/mp4"
    content_length = response.headers.get("content-length")
    if content_length:
        try:
            if int(content_length) > settings.max_download_bytes:
                await response.aclose()
                await client.aclose()
                raise HTTPException(
                    status_code=413,
                    detail={
                        "code": "file_too_large",
                        "message": "This media file is too large to download through the service.",
                    },
                )
        except ValueError:
            pass
        headers["Content-Length"] = content_length

    async def iterator() -> AsyncIterator[bytes]:
        bytes_sent = 0
        try:
            async for chunk in response.aiter_bytes(chunk_size=64 * 1024):
                bytes_sent += len(chunk)
                if bytes_sent > settings.max_download_bytes:
                    break
                yield chunk
        except (httpx.HTTPError, GeneratorExit, ConnectionError):
            logger.debug("Client disconnected or upstream error during stream")
        finally:
            await response.aclose()
            await client.aclose()

    return StreamingResponse(iterator(), media_type=content_type, headers=headers)


async def _stream_hls(payload, settings: Settings) -> StreamingResponse:
    ffmpeg = shutil.which("ffmpeg")
    if not ffmpeg:
        raise HTTPException(
            status_code=500,
            detail={
                "code": "backend_error",
                "message": "Live replay downloads require ffmpeg, which is not available on the server.",
            },
        )

    filename = f"x-live-{payload.tweet_id}-{payload.quality}.mp4"
    headers = {
        "Content-Disposition": f'attachment; filename="{filename}"',
        "Cache-Control": "no-store",
    }

    # Fragmented MP4 so the browser can start saving before remux finishes.
    header_lines = (
        "Referer: https://www.periscope.tv/\r\n"
        "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36\r\n"
    )
    cmd = [
        ffmpeg,
        "-hide_banner",
        "-loglevel",
        "error",
        "-headers",
        header_lines,
        "-i",
        payload.media_url,
        "-c",
        "copy",
        "-bsf:a",
        "aac_adtstoasc",
        "-f",
        "mp4",
        "-movflags",
        "frag_keyframe+empty_moov+default_base_moof",
        "pipe:1",
    ]

    try:
        process = await asyncio.create_subprocess_exec(
            *cmd,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
        )
    except OSError as exc:
        logger.warning("Failed to start ffmpeg: %s", exc)
        raise HTTPException(
            status_code=502,
            detail={
                "code": "download_failed",
                "message": "We couldn't prepare this live replay for download. Please try again.",
            },
        ) from exc

    async def iterator() -> AsyncIterator[bytes]:
        assert process.stdout is not None
        bytes_sent = 0
        timed_out = False
        try:
            while True:
                try:
                    chunk = await asyncio.wait_for(
                        process.stdout.read(64 * 1024),
                        timeout=settings.hls_download_timeout,
                    )
                except asyncio.TimeoutError:
                    timed_out = True
                    break
                if not chunk:
                    break
                bytes_sent += len(chunk)
                if bytes_sent > settings.max_download_bytes:
                    break
                yield chunk
        except (GeneratorExit, ConnectionError, asyncio.CancelledError):
            logger.debug("Client disconnected during HLS remux")
        finally:
            if process.returncode is None:
                process.kill()
                try:
                    await asyncio.wait_for(process.wait(), timeout=5)
                except asyncio.TimeoutError:
                    pass
            if timed_out:
                logger.warning("HLS remux timed out for tweet %s", payload.tweet_id)
            elif process.returncode not in (0, None, -9) and bytes_sent == 0:
                err = b""
                if process.stderr:
                    err = await process.stderr.read()
                logger.warning("ffmpeg failed (%s): %s", process.returncode, err[:500])

    return StreamingResponse(iterator(), media_type="video/mp4", headers=headers)


def _referer_for_host(hostname: str | None) -> str:
    host = (hostname or "").lower()
    if host.endswith("pscp.tv") or host.endswith("periscope.tv"):
        return "https://www.periscope.tv/"
    return "https://x.com/"


async def stream_thumbnail(token: str, settings: Settings) -> StreamingResponse:
    """Proxy post thumbnails with the correct Referer so hotlinked images always load."""
    try:
        payload = verify_download_token(token, settings.download_token_secret)
    except TokenError as exc:
        raise HTTPException(status_code=400, detail={"code": exc.code, "message": exc.message}) from exc

    parsed = urlparse(payload.media_url)
    if parsed.scheme != "https" or not _host_allowed(parsed.hostname):
        raise HTTPException(
            status_code=400,
            detail={"code": "invalid_token", "message": "This thumbnail link is invalid or has expired."},
        )

    client = httpx.AsyncClient(
        timeout=httpx.Timeout(20.0, connect=8.0),
        follow_redirects=True,
        headers={
            "User-Agent": (
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
            ),
            "Referer": _referer_for_host(parsed.hostname),
            "Accept": "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
        },
    )

    try:
        request = client.build_request("GET", payload.media_url)
        response = await client.send(request, stream=True)
    except httpx.HTTPError as exc:
        await client.aclose()
        logger.warning("Thumbnail upstream failed: %s", exc)
        raise HTTPException(
            status_code=502,
            detail={"code": "thumbnail_failed", "message": "Thumbnail unavailable."},
        ) from exc

    if response.status_code >= 400:
        await response.aclose()
        await client.aclose()
        raise HTTPException(
            status_code=502,
            detail={"code": "thumbnail_failed", "message": "Thumbnail unavailable."},
        )

    content_type = response.headers.get("content-type") or f"image/{payload.ext}"
    if not content_type.startswith("image/"):
        # Some CDNs return octet-stream; keep a sensible default
        content_type = f"image/{payload.ext if payload.ext in {'jpg', 'jpeg', 'png', 'webp'} else 'jpeg'}"

    headers = {
        "Cache-Control": "public, max-age=300",
        "Content-Disposition": "inline",
    }
    content_length = response.headers.get("content-length")
    if content_length:
        headers["Content-Length"] = content_length

    async def iterator() -> AsyncIterator[bytes]:
        bytes_sent = 0
        max_bytes = 15 * 1024 * 1024  # thumbs should be small
        try:
            async for chunk in response.aiter_bytes(chunk_size=64 * 1024):
                bytes_sent += len(chunk)
                if bytes_sent > max_bytes:
                    break
                yield chunk
        except (httpx.HTTPError, GeneratorExit, ConnectionError):
            logger.debug("Client disconnected during thumbnail stream")
        finally:
            await response.aclose()
            await client.aclose()

    return StreamingResponse(iterator(), media_type=content_type, headers=headers)


async def stream_download(token: str, settings: Settings) -> StreamingResponse:
    try:
        payload = verify_download_token(token, settings.download_token_secret)
    except TokenError as exc:
        raise HTTPException(status_code=400, detail={"code": exc.code, "message": exc.message}) from exc

    parsed = urlparse(payload.media_url)
    if parsed.scheme != "https" or not _host_allowed(parsed.hostname):
        raise HTTPException(
            status_code=400,
            detail={"code": "invalid_token", "message": "This download link is invalid or has expired."},
        )

    if payload.is_hls:
        return await _stream_hls(payload, settings)
    return await _stream_direct(payload, settings)
