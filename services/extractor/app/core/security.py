"""URL validation and signed download tokens."""

from __future__ import annotations

import base64
import hashlib
import hmac
import json
import re
import time
from dataclasses import dataclass
from urllib.parse import urlparse

ALLOWED_HOSTS = frozenset(
    {
        "x.com",
        "www.x.com",
        "twitter.com",
        "www.twitter.com",
        "mobile.twitter.com",
        "mobile.x.com",
    }
)

STATUS_PATH_RE = re.compile(r"^/(?:i/web/status|[^/]+/status)/(\d+)/?$")


class UrlValidationError(ValueError):
    def __init__(self, code: str, message: str) -> None:
        self.code = code
        self.message = message
        super().__init__(message)


@dataclass(frozen=True)
class ValidatedTweetUrl:
    original_url: str
    normalized_url: str
    tweet_id: str
    host: str


def validate_twitter_url(url: str) -> ValidatedTweetUrl:
    if not url or not isinstance(url, str):
        raise UrlValidationError("invalid_url", "Please paste a valid X or Twitter post URL.")

    cleaned = url.strip()
    if len(cleaned) > 2048:
        raise UrlValidationError("invalid_url", "Please paste a valid X or Twitter post URL.")

    parsed = urlparse(cleaned)
    if parsed.scheme not in {"http", "https"}:
        raise UrlValidationError("invalid_url", "Please paste a valid X or Twitter post URL.")

    host = (parsed.hostname or "").lower()
    if host not in ALLOWED_HOSTS:
        raise UrlValidationError(
            "unsupported_domain",
            "Only public X and Twitter post links are supported.",
        )

    match = STATUS_PATH_RE.match(parsed.path or "")
    if not match:
        raise UrlValidationError(
            "invalid_path",
            "That link doesn't look like a post URL. Use a link that contains /status/.",
        )

    tweet_id = match.group(1)
    normalized = f"https://x.com/i/status/{tweet_id}"
    return ValidatedTweetUrl(
        original_url=cleaned,
        normalized_url=normalized,
        tweet_id=tweet_id,
        host=host,
    )


def _b64url_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode("ascii")


def _b64url_decode(data: str) -> bytes:
    padding = "=" * (-len(data) % 4)
    return base64.urlsafe_b64decode(data + padding)


def create_download_token(
    *,
    media_url: str,
    tweet_id: str,
    quality: str,
    ext: str,
    secret: str,
    ttl_seconds: int,
    is_hls: bool = False,
) -> str:
    payload = {
        "u": media_url,
        "id": tweet_id,
        "q": quality,
        "e": ext,
        "hls": bool(is_hls),
        "exp": int(time.time()) + ttl_seconds,
    }
    body = _b64url_encode(json.dumps(payload, separators=(",", ":")).encode("utf-8"))
    signature = hmac.new(secret.encode("utf-8"), body.encode("ascii"), hashlib.sha256).digest()
    return f"{body}.{_b64url_encode(signature)}"


@dataclass(frozen=True)
class DownloadTokenPayload:
    media_url: str
    tweet_id: str
    quality: str
    ext: str
    exp: int
    is_hls: bool = False


class TokenError(ValueError):
    def __init__(self, code: str, message: str) -> None:
        self.code = code
        self.message = message
        super().__init__(message)


def verify_download_token(token: str, secret: str) -> DownloadTokenPayload:
    try:
        body, sig = token.split(".", 1)
    except ValueError as exc:
        raise TokenError("invalid_token", "This download link is invalid or has expired.") from exc

    expected = hmac.new(secret.encode("utf-8"), body.encode("ascii"), hashlib.sha256).digest()
    provided = _b64url_decode(sig)
    if not hmac.compare_digest(expected, provided):
        raise TokenError("invalid_token", "This download link is invalid or has expired.")

    try:
        payload = json.loads(_b64url_decode(body))
        media_url = payload["u"]
        tweet_id = payload["id"]
        quality = payload["q"]
        ext = payload["e"]
        exp = int(payload["exp"])
        is_hls = bool(payload.get("hls")) or ".m3u8" in str(media_url)
    except (KeyError, TypeError, ValueError, json.JSONDecodeError) as exc:
        raise TokenError("invalid_token", "This download link is invalid or has expired.") from exc

    if time.time() >= exp:
        raise TokenError("token_expired", "This download link has expired. Resolve the post again.")

    parsed = urlparse(media_url)
    if parsed.scheme != "https" or not parsed.netloc:
        raise TokenError("invalid_token", "This download link is invalid or has expired.")

    return DownloadTokenPayload(
        media_url=media_url,
        tweet_id=tweet_id,
        quality=quality,
        ext=ext,
        exp=exp,
        is_hls=is_hls,
    )
