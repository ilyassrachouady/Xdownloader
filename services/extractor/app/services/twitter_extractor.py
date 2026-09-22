"""Public X/Twitter media extraction via yt-dlp with syndication fallback."""

from __future__ import annotations

import logging
import math
import re
from concurrent.futures import ThreadPoolExecutor, TimeoutError as FuturesTimeoutError
from typing import Any
from urllib.parse import urlparse

import httpx
from yt_dlp import YoutubeDL
from yt_dlp.utils import DownloadError, ExtractorError

from app.core.cache import cache
from app.core.config import Settings
from app.core.security import ValidatedTweetUrl, create_download_token
from app.schemas.responses import MediaFormat, ResolveResponse

logger = logging.getLogger(__name__)

_executor = ThreadPoolExecutor(max_workers=4)


class ExtractionError(Exception):
    def __init__(self, code: str, message: str) -> None:
        self.code = code
        self.message = message
        super().__init__(message)


def _quality_label(height: int | None, width: int | None = None) -> str:
    if height:
        return f"{height}p"
    if width:
        return f"{width}w"
    return "original"


def _is_video_format(fmt: dict[str, Any]) -> bool:
    vcodec = fmt.get("vcodec")
    if vcodec and vcodec != "none":
        return True
    url = fmt.get("url")
    if not url:
        return False
    ext = (fmt.get("ext") or "").lower()
    if ext in {"mp4", "m4v", "mov", "webm"} and (fmt.get("height") or fmt.get("width")):
        return True
    return False


def _format_score(fmt: dict[str, Any]) -> tuple:
    """Higher is better when choosing among same-resolution candidates."""
    ext = (fmt.get("ext") or "").lower()
    protocol = (fmt.get("protocol") or "").lower()
    tbr = fmt.get("tbr") or 0
    vbr = fmt.get("vbr") or 0
    filesize = fmt.get("filesize") or fmt.get("filesize_approx") or 0
    has_audio = fmt.get("acodec") not in (None, "none")
    https = 1 if protocol.startswith("http") else 0
    mp4 = 1 if ext == "mp4" else 0
    return (https, mp4, int(has_audio), tbr, vbr, filesize)


def _is_hls_format(fmt: dict[str, Any]) -> bool:
    protocol = (fmt.get("protocol") or "").lower()
    url = str(fmt.get("url") or "")
    return protocol in {"m3u8", "m3u8_native"} or ".m3u8" in url


def _media_host_allowed(url: str) -> bool:
    host = (urlparse(url).hostname or "").lower()
    if not host:
        return False
    allowed_suffixes = (
        "twimg.com",
        "twitter.com",
        "x.com",
        "pscp.tv",
        "periscope.tv",
    )
    return any(host == suffix or host.endswith("." + suffix) for suffix in allowed_suffixes)


def _pick_height(fmt: dict[str, Any]) -> tuple[dict[str, Any], int] | None:
    height = fmt.get("height")
    width = fmt.get("width")
    url = str(fmt.get("url") or "")

    if not height and width:
        height = {1920: 1080, 1280: 720, 854: 480, 640: 360, 1080: 1920}.get(int(width), int(width))

    if not height:
        match = re.search(r"/(\d{2,4})x(\d{2,4})/", url)
        if match:
            width, height = int(match.group(1)), int(match.group(2))
            fmt = {**fmt, "width": width, "height": height}

    if not height:
        return None
    return fmt, int(height)


def filter_formats(raw_formats: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Prefer progressive HTTPS MP4s; fall back to HLS for live/replay broadcasts."""
    progressive: dict[int, dict[str, Any]] = {}
    hls: dict[int, dict[str, Any]] = {}

    for fmt in raw_formats:
        if not _is_video_format(fmt):
            continue
        url = fmt.get("url")
        if not url or not str(url).startswith("https://"):
            continue
        if not _media_host_allowed(str(url)):
            continue

        picked = _pick_height(fmt)
        if picked is None:
            continue
        fmt, height = picked

        if _is_hls_format(fmt):
            current = hls.get(height)
            if current is None or _format_score(fmt) > _format_score(current):
                hls[height] = {**fmt, "_is_hls": True}
            continue

        protocol = (fmt.get("protocol") or "").lower()
        if protocol in {"http_dash_segments", "dash"}:
            continue

        current = progressive.get(height)
        if current is None or _format_score(fmt) > _format_score(current):
            progressive[height] = {**fmt, "_is_hls": False}

    chosen = progressive if progressive else hls
    ordered = sorted(chosen.items(), key=lambda item: item[0], reverse=True)
    return [fmt for _, fmt in ordered]


def _detect_media_kind(info: dict[str, Any]) -> str:
    extractor = str(info.get("extractor") or info.get("extractor_key") or "").lower()
    if info.get("is_live"):
        return "live"
    if info.get("was_live") or "broadcast" in extractor or info.get("live_status") in {
        "was_live",
        "is_live",
        "post_live",
    }:
        return "live_replay"
    formats = info.get("formats") or []
    if any(_is_hls_format(f) for f in formats) and not any(
        not _is_hls_format(f) and _is_video_format(f) for f in formats
    ):
        # HLS-only progressive post variants still count as video unless broadcast-like
        if "pscp.tv" in str(info.get("url") or "") or "broadcast" in extractor:
            return "live_replay"
    return "video"


def _map_error(exc: BaseException) -> ExtractionError:
    text = str(exc).lower()

    if "private" in text or "protected" in text or "not authorized" in text:
        return ExtractionError(
            "private_account",
            "This account is private or protected. Only public posts can be downloaded.",
        )
    if "not found" in text or "does not exist" in text or "404" in text:
        return ExtractionError(
            "not_found",
            "We couldn't find that post. It may have been deleted or the link is incorrect.",
        )
    if "deleted" in text or "suspended" in text:
        return ExtractionError(
            "deleted",
            "This post appears to have been deleted or the account is unavailable.",
        )
    if "rate" in text and "limit" in text:
        return ExtractionError(
            "rate_limit",
            "X is temporarily rate-limiting requests. Please try again in a minute.",
        )
    if "unsupported url" in text or "no suitable extractor" in text:
        return ExtractionError(
            "unsupported",
            "X may have changed how media is served. Try updating yt-dlp and try again.",
        )
    if "no video" in text or "no media" in text or "unable to extract" in text:
        return ExtractionError(
            "no_media",
            "We couldn't find downloadable media in this post. Make sure the post is public and contains a video or GIF.",
        )

    logger.warning("Unhandled extraction error: %s", exc)
    return ExtractionError(
        "extraction_failed",
        "We couldn't extract media from this post. Make sure it's public and try again.",
    )


def _js_base36(value: float) -> str:
    alphabet = "0123456789abcdefghijklmnopqrstuvwxyz"
    if value != value:
        return "NaN"
    if math.isinf(value):
        return "Infinity"
    if value < 0:
        return "-" + _js_base36(-value)

    integer = int(math.floor(value))
    frac = value - integer
    if integer == 0:
        int_part = "0"
    else:
        chars: list[str] = []
        n = integer
        while n:
            n, rem = divmod(n, 36)
            chars.append(alphabet[rem])
        int_part = "".join(reversed(chars))

    if frac == 0:
        return int_part

    chars = []
    for _ in range(12):
        frac *= 36
        digit = int(frac)
        chars.append(alphabet[digit])
        frac -= digit
        if frac < 1e-12:
            break
    return int_part + "." + "".join(chars)


def syndication_token(tweet_id: str) -> str:
    """Token expected by Twitter's public syndication embed endpoint."""
    raw = _js_base36((int(tweet_id) / 1e15) * math.pi)
    return re.sub(r"(0+|\.)", "", raw)


def _binding_string(bindings: dict[str, Any], key: str) -> str | None:
    value = bindings.get(key)
    if isinstance(value, dict):
        string_value = value.get("string_value")
        if isinstance(string_value, str) and string_value.strip():
            return string_value.strip()
    return None


def _binding_image(bindings: dict[str, Any], *keys: str) -> str | None:
    for key in keys:
        value = bindings.get(key)
        if isinstance(value, dict):
            image = value.get("image_value") or value.get("image_color_value")
            if isinstance(image, dict):
                url = image.get("url")
                if isinstance(url, str) and url.startswith("https://"):
                    return url
    return None


def _parse_m3u8_variants(master_url: str, body: str) -> list[dict[str, Any]]:
    """Turn a master HLS playlist into yt-dlp-like format dicts."""
    formats: list[dict[str, Any]] = []
    lines = [line.strip() for line in body.splitlines() if line.strip()]
    base = master_url.rsplit("/", 1)[0] + "/"

    for index, line in enumerate(lines):
        if not line.startswith("#EXT-X-STREAM-INF:"):
            continue
        meta = line[len("#EXT-X-STREAM-INF:") :]
        bandwidth = None
        resolution = None
        for part in meta.split(","):
            if part.startswith("BANDWIDTH="):
                try:
                    bandwidth = int(part.split("=", 1)[1])
                except ValueError:
                    pass
            elif part.startswith("RESOLUTION="):
                resolution = part.split("=", 1)[1]

        if index + 1 >= len(lines):
            continue
        uri = lines[index + 1]
        if uri.startswith("#"):
            continue
        if not uri.startswith("http"):
            uri = base + uri

        width = height = None
        if resolution and "x" in resolution:
            try:
                width_s, height_s = resolution.split("x", 1)
                width, height = int(width_s), int(height_s)
            except ValueError:
                pass

        formats.append(
            {
                "format_id": f"replay-{bandwidth or height or index}",
                "url": uri,
                "ext": "mp4",
                "width": width,
                "height": height,
                "vcodec": "avc1",
                "acodec": "mp4a",
                "tbr": (bandwidth or 0) / 1000 if bandwidth else None,
                "protocol": "m3u8_native",
            }
        )

    if not formats and master_url.endswith(".m3u8"):
        formats.append(
            {
                "format_id": "replay",
                "url": master_url,
                "ext": "mp4",
                "width": None,
                "height": None,
                "vcodec": "avc1",
                "acodec": "mp4a",
                "protocol": "m3u8_native",
            }
        )
    return formats


def _extract_broadcast_formats(broadcast_id: str, timeout: int) -> list[dict[str, Any]]:
    """Fetch HLS variants for an X / Periscope broadcast replay."""
    endpoints = [
        f"https://proxsee.pscp.tv/api/v2/accessVideoPublic?broadcast_id={broadcast_id}&replay_redirect=false",
        f"https://api.periscope.tv/api/v2/accessVideoPublic?broadcast_id={broadcast_id}&replay_redirect=false",
    ]
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
            "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
        ),
        "Accept": "application/json",
        "Referer": "https://www.periscope.tv/",
    }

    payload: dict[str, Any] | None = None
    try:
        with httpx.Client(timeout=min(timeout, 25), follow_redirects=True) as client:
            for endpoint in endpoints:
                try:
                    response = client.get(endpoint, headers=headers)
                except httpx.HTTPError as exc:
                    logger.info("Broadcast API failed (%s): %s", endpoint, exc)
                    continue
                if response.status_code >= 400:
                    continue
                try:
                    data = response.json()
                except ValueError:
                    continue
                if isinstance(data, dict):
                    payload = data
                    break
    except httpx.HTTPError as exc:
        logger.info("Broadcast client error: %s", exc)
        return []

    if not payload:
        return []

    master = None
    for key in ("replay_url", "hls_url", "https_pscp_uri", "dynamic_url", "url"):
        value = payload.get(key)
        if isinstance(value, str) and ".m3u8" in value and value.startswith("https://"):
            master = value
            break

    if not master:
        return []

    try:
        with httpx.Client(timeout=min(timeout, 20), follow_redirects=True) as client:
            playlist = client.get(
                master,
                headers={
                    **headers,
                    "Accept": "*/*",
                },
            )
    except httpx.HTTPError as exc:
        logger.info("Master playlist fetch failed: %s", exc)
        return [
            {
                "format_id": "replay",
                "url": master,
                "ext": "mp4",
                "vcodec": "avc1",
                "acodec": "mp4a",
                "protocol": "m3u8_native",
            }
        ]

    if playlist.status_code >= 400:
        return [
            {
                "format_id": "replay",
                "url": master,
                "ext": "mp4",
                "vcodec": "avc1",
                "acodec": "mp4a",
                "protocol": "m3u8_native",
            }
        ]

    return _parse_m3u8_variants(master, playlist.text)


def _extract_via_syndication(tweet_id: str, timeout: int) -> dict[str, Any] | None:
    token = syndication_token(tweet_id)
    url = f"https://cdn.syndication.twimg.com/tweet-result?id={tweet_id}&lang=en&token={token}"
    try:
        with httpx.Client(timeout=timeout, follow_redirects=True) as client:
            response = client.get(
                url,
                headers={
                    "User-Agent": (
                        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
                    ),
                    "Accept": "application/json",
                    "Referer": "https://platform.twitter.com/",
                },
            )
    except httpx.HTTPError as exc:
        logger.info("Syndication request failed: %s", exc)
        return None

    if response.status_code == 404:
        raise ExtractionError(
            "not_found",
            "We couldn't find that post. It may have been deleted or the link is incorrect.",
        )
    if response.status_code >= 400:
        return None

    try:
        data = response.json()
    except ValueError:
        return None

    if not isinstance(data, dict):
        return None

    media_details = data.get("mediaDetails") or []
    formats: list[dict[str, Any]] = []
    thumbnail = None
    duration = None
    title = data.get("text")
    was_live = False
    webpage_url = f"https://x.com/i/status/{tweet_id}"
    user = data.get("user") or {}
    uploader = user.get("name")
    uploader_id = user.get("screen_name")

    for media in media_details:
        media_type = media.get("type")
        if media_type not in {"video", "animated_gif"}:
            continue
        thumbnail = thumbnail or media.get("media_url_https")
        video_info = media.get("video_info") or {}
        if video_info.get("duration_millis"):
            duration = video_info["duration_millis"] / 1000.0
        for variant in video_info.get("variants") or []:
            if variant.get("content_type") != "video/mp4":
                continue
            variant_url = variant.get("url")
            if not variant_url or not str(variant_url).startswith("https://"):
                continue
            width = height = None
            match = re.search(r"/(\d{2,4})x(\d{2,4})/", variant_url)
            if match:
                width, height = int(match.group(1)), int(match.group(2))
            formats.append(
                {
                    "format_id": f"synd-{variant.get('bitrate') or height or 'mp4'}",
                    "url": variant_url,
                    "ext": "mp4",
                    "width": width,
                    "height": height,
                    "vcodec": "avc1",
                    "acodec": "mp4a" if media_type == "video" else "none",
                    "tbr": (variant.get("bitrate") or 0) / 1000,
                    "protocol": "https",
                }
            )

    # Live / replay cards expose a broadcast id instead of mediaDetails.
    card = data.get("card") or {}
    card_name = str(card.get("name") or "")
    bindings = card.get("binding_values") or {}
    if "broadcast" in card_name and isinstance(bindings, dict):
        broadcast_id = _binding_string(bindings, "broadcast_id")
        title = _binding_string(bindings, "broadcast_title") or title
        uploader = _binding_string(bindings, "broadcaster_display_name") or uploader
        uploader_id = _binding_string(bindings, "broadcaster_username") or uploader_id
        thumbnail = (
            _binding_image(
                bindings,
                "broadcast_thumbnail_original",
                "broadcast_thumbnail_x_large",
                "broadcast_thumbnail_large",
                "broadcast_thumbnail",
            )
            or thumbnail
        )
        broadcast_url = _binding_string(bindings, "broadcast_url")
        if broadcast_url:
            webpage_url = broadcast_url
        if broadcast_id:
            was_live = True
            formats = _extract_broadcast_formats(broadcast_id, timeout) or formats
            # Last resort: let yt-dlp hit the broadcast page directly.
            if not formats:
                try:
                    info = _extract_via_ytdlp(f"https://x.com/i/broadcasts/{broadcast_id}", timeout)
                    formats = list(info.get("formats") or [])
                    thumbnail = thumbnail or info.get("thumbnail")
                    title = title or info.get("title")
                    duration = duration or info.get("duration")
                    was_live = True
                except ExtractionError as exc:
                    logger.info("Broadcast yt-dlp fallback failed: %s", exc.code)

    if not formats:
        return None

    result: dict[str, Any] = {
        "id": tweet_id,
        "title": title,
        "description": title,
        "uploader": uploader,
        "uploader_id": uploader_id,
        "thumbnail": thumbnail,
        "duration": duration,
        "webpage_url": webpage_url,
        "formats": formats,
        "extractor": "twitter_broadcast" if was_live else "twitter_syndication",
    }
    if was_live:
        result["was_live"] = True
        result["live_status"] = "was_live"
    return result


def _extract_via_ytdlp(url: str, timeout: int) -> dict[str, Any]:
    ydl_opts: dict[str, Any] = {
        "quiet": True,
        "no_warnings": True,
        "skip_download": True,
        "extract_flat": False,
        "noplaylist": True,
        "socket_timeout": timeout,
        "retries": 2,
        "extractor_retries": 2,
        "http_headers": {
            "User-Agent": (
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
            ),
        },
    }

    def _run() -> dict[str, Any]:
        with YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            if info is None:
                raise ExtractionError(
                    "no_media",
                    "We couldn't find downloadable media in this post. Make sure the post is public and contains a video or GIF.",
                )
            return info

    future = _executor.submit(_run)
    try:
        # Broadcasts make several network round-trips; give a small buffer over socket timeout.
        return future.result(timeout=max(timeout + 15, timeout))
    except FuturesTimeoutError as exc:
        future.cancel()
        raise ExtractionError(
            "timeout",
            "Extraction timed out. Please try again in a moment.",
        ) from exc
    except ExtractionError:
        raise
    except (DownloadError, ExtractorError) as exc:
        raise _map_error(exc) from exc
    except Exception as exc:  # noqa: BLE001
        raise _map_error(exc) from exc


def _extract_info(validated: ValidatedTweetUrl, timeout: int) -> dict[str, Any]:
    ytdlp_error: ExtractionError | None = None
    try:
        return _extract_via_ytdlp(validated.normalized_url, timeout)
    except ExtractionError as exc:
        ytdlp_error = exc
        logger.info("yt-dlp extraction failed (%s); trying syndication", exc.code)

    syndicated = _extract_via_syndication(validated.tweet_id, timeout)
    if syndicated:
        return syndicated

    if ytdlp_error:
        raise ytdlp_error

    raise ExtractionError(
        "no_media",
        "We couldn't find downloadable media in this post. Make sure the post is public and contains a video or GIF.",
    )


def _shorten(text: str | None, limit: int = 220) -> str | None:
    if not text:
        return None
    cleaned = " ".join(text.split())
    if len(cleaned) <= limit:
        return cleaned
    return cleaned[: limit - 1].rstrip() + "…"


def _best_thumbnail(info: dict[str, Any]) -> str | None:
    """Pick the highest-quality HTTPS thumbnail from yt-dlp / syndication payload."""
    candidates: list[tuple[int, str]] = []

    thumbs = info.get("thumbnails")
    if isinstance(thumbs, list):
        for thumb in thumbs:
            if not isinstance(thumb, dict):
                continue
            url = thumb.get("url")
            if not url or not str(url).startswith("https://"):
                continue
            if not _media_host_allowed(str(url)):
                continue
            width = int(thumb.get("width") or 0)
            height = int(thumb.get("height") or 0)
            score = width * height
            if score <= 0:
                try:
                    score = int(thumb.get("preference") or thumb.get("id") or 0)
                except (TypeError, ValueError):
                    score = 0
            candidates.append((score, str(url)))

    primary = info.get("thumbnail")
    if primary and str(primary).startswith("https://") and _media_host_allowed(str(primary)):
        candidates.append((1, str(primary)))

    if not candidates:
        return None

    candidates.sort(key=lambda item: item[0], reverse=True)
    return candidates[0][1]


def _thumb_ext(url: str) -> str:
    lower = url.lower()
    if ".webp" in lower:
        return "webp"
    if ".png" in lower:
        return "png"
    return "jpg"


def normalize_result(
    info: dict[str, Any],
    validated: ValidatedTweetUrl,
    settings: Settings,
) -> ResolveResponse:
    raw_formats = info.get("formats") or []
    if not raw_formats and info.get("url"):
        raw_formats = [
            {
                "format_id": info.get("format_id") or "0",
                "url": info["url"],
                "ext": info.get("ext") or "mp4",
                "width": info.get("width"),
                "height": info.get("height"),
                "vcodec": info.get("vcodec") or "unknown",
                "acodec": info.get("acodec"),
                "tbr": info.get("tbr"),
                "filesize": info.get("filesize"),
                "protocol": "https",
            }
        ]

    filtered = filter_formats(raw_formats)
    if not filtered:
        raise ExtractionError(
            "no_media",
            "We couldn't find downloadable media in this post. Make sure the post is public and contains a video or GIF.",
        )

    formats: list[MediaFormat] = []
    for fmt in filtered:
        height = fmt.get("height")
        width = fmt.get("width")
        quality = _quality_label(int(height) if height else None, int(width) if width else None)
        is_hls = bool(fmt.get("_is_hls")) or _is_hls_format(fmt)
        ext = "mp4"  # HLS is remuxed to MP4 on download
        media_url = fmt["url"]
        if not media_url.startswith("https://") or not _media_host_allowed(media_url):
            continue
        token = create_download_token(
            media_url=media_url,
            tweet_id=validated.tweet_id,
            quality=quality,
            ext=ext,
            secret=settings.download_token_secret,
            ttl_seconds=settings.download_token_ttl,
            is_hls=is_hls,
        )
        formats.append(
            MediaFormat(
                format_id=str(fmt.get("format_id") or quality),
                quality=quality,
                width=int(width) if width else None,
                height=int(height) if height else None,
                ext=ext,
                filesize=fmt.get("filesize") or fmt.get("filesize_approx"),
                download_url=f"/download/{token}",
                vcodec=None if fmt.get("vcodec") in (None, "none") else str(fmt.get("vcodec")),
                acodec=None if fmt.get("acodec") in (None, "none") else str(fmt.get("acodec")),
                is_hls=is_hls,
            )
        )

    if not formats:
        raise ExtractionError(
            "no_media",
            "We couldn't find downloadable media in this post. Make sure the post is public and contains a video or GIF.",
        )

    title = info.get("title") or info.get("fulltitle")
    description = info.get("description") or info.get("alt_title") or info.get("title")
    uploader = info.get("uploader") or info.get("creator") or info.get("channel")
    uploader_id = info.get("uploader_id") or info.get("channel_id") or info.get("uploader_url")
    media_kind = _detect_media_kind(info)

    # Proxy thumbnails through our API so browsers aren't blocked by hotlink / Referer rules
    # (especially Periscope live-replay thumbs on *.pscp.tv).
    raw_thumb = _best_thumbnail(info)
    thumbnail_url: str | None = None
    if raw_thumb:
        thumb_token = create_download_token(
            media_url=raw_thumb,
            tweet_id=validated.tweet_id,
            quality="thumb",
            ext=_thumb_ext(raw_thumb),
            secret=settings.download_token_secret,
            ttl_seconds=settings.download_token_ttl,
            is_hls=False,
        )
        thumbnail_url = f"/thumb/{thumb_token}"

    return ResolveResponse(
        id=validated.tweet_id,
        title=_shorten(title, 120),
        description=_shorten(description),
        uploader=uploader,
        uploader_id=uploader_id,
        thumbnail=thumbnail_url,
        duration=info.get("duration"),
        webpage_url=info.get("webpage_url") or info.get("original_url") or validated.normalized_url,
        media_kind=media_kind,
        formats=formats,
    )


def resolve_media(validated: ValidatedTweetUrl, settings: Settings) -> ResolveResponse:
    # Cache raw extraction payload so download tokens are freshly signed on every resolve.
    cache_key = f"tweet:{validated.tweet_id}"
    cached = cache.get(cache_key)
    if isinstance(cached, dict):
        info = cached
    else:
        info = _extract_info(validated, settings.extraction_timeout)
        cache.set(cache_key, info, settings.cache_ttl)

    return normalize_result(info, validated, settings)
